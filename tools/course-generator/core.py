"""
AccrediPro Course Generator
AI-powered course content generation using Gemini 3 Flash
"""

import os
import json
import sqlite3
import asyncio
import aiohttp
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional
from dataclasses import dataclass
from concurrent.futures import ThreadPoolExecutor
import random
import re

# Load configuration
from dotenv import load_dotenv
load_dotenv('config.env')


@dataclass
class GenerationConfig:
    """Configuration for course generation"""
    course_name: str
    output_dir: Path
    reference_dir: Path
    model: str = "gemini-2.0-flash"
    max_retries: int = 3
    lesson_min_size: int = 20000
    lesson_max_size: int = 40000


class APIKeyPool:
    """Manages multiple Gemini API keys with smart rotation and rate limit handling"""
    
    def __init__(self, keys: List[str]):
        self.keys = keys
        self.current_index = 0
        self.failed_keys = set()
        self.rate_limited_keys = {}  # key -> cooldown_until timestamp
        self._lock = asyncio.Lock()
        self.consecutive_failures = 0
        self.global_cooldown_until = 0
    
    async def get_key(self) -> str:
        """Get next available API key with smart rotation"""
        async with self._lock:
            current_time = datetime.now().timestamp()
            
            # Check global cooldown (all keys rate limited)
            if current_time < self.global_cooldown_until:
                wait_time = self.global_cooldown_until - current_time
                print(f"⏳ Global cooldown: waiting {wait_time:.1f}s...")
                await asyncio.sleep(min(wait_time, 30))  # Max 30s wait
            
            # Clean up expired rate limits
            self.rate_limited_keys = {
                k: v for k, v in self.rate_limited_keys.items() 
                if v > current_time
            }
            
            # Try to find a non-rate-limited key
            attempts = 0
            while attempts < len(self.keys) * 2:  # Give more attempts
                key = self.keys[self.current_index]
                self.current_index = (self.current_index + 1) % len(self.keys)
                
                # Skip if currently rate limited
                if key in self.rate_limited_keys:
                    attempts += 1
                    continue
                    
                # Skip if failed (but reset if we've gone full circle)
                if key in self.failed_keys:
                    attempts += 1
                    if attempts >= len(self.keys):
                        self.failed_keys.clear()  # Reset after full rotation
                    continue
                
                self.consecutive_failures = 0  # Reset on successful key find
                return key
            
            # All keys exhausted - trigger global cooldown
            self.consecutive_failures += 1
            cooldown = min(30 * (2 ** self.consecutive_failures), 300)  # Max 5 min
            self.global_cooldown_until = current_time + cooldown
            print(f"🔴 All keys exhausted! Global cooldown: {cooldown}s")
            
            # Clear all states and return first key after waiting
            self.failed_keys.clear()
            self.rate_limited_keys.clear()
            await asyncio.sleep(cooldown)
            return self.keys[0]
    
    def mark_failed(self, key: str):
        """Mark a key as temporarily failed (non-rate-limit error)"""
        self.failed_keys.add(key)
    
    def mark_rate_limited(self, key: str, cooldown_seconds: int = 60):
        """Mark a key as rate limited with cooldown period"""
        cooldown_until = datetime.now().timestamp() + cooldown_seconds
        self.rate_limited_keys[key] = cooldown_until
        # Don't add to failed_keys - it will auto-recover after cooldown
    
    def get_stats(self) -> Dict:
        """Get current pool stats"""
        return {
            'total_keys': len(self.keys),
            'failed_keys': len(self.failed_keys),
            'rate_limited_keys': len(self.rate_limited_keys),
            'available_keys': len(self.keys) - len(self.failed_keys) - len(self.rate_limited_keys),
            'consecutive_failures': self.consecutive_failures
        }



class CourseDatabase:
    """SQLite database for tracking generation progress"""
    
    def __init__(self, db_path: str = "courses.db"):
        self.db_path = db_path
        self._init_db()
    
    def _init_db(self):
        """Initialize database tables"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS courses (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT UNIQUE NOT NULL,
                methodology TEXT,
                status TEXT DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                completed_at TIMESTAMP
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS modules (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                course_id INTEGER NOT NULL,
                number INTEGER NOT NULL,
                title TEXT,
                status TEXT DEFAULT 'pending',
                FOREIGN KEY (course_id) REFERENCES courses(id)
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS lessons (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                module_id INTEGER NOT NULL,
                number INTEGER NOT NULL,
                title TEXT,
                file_path TEXT,
                size_bytes INTEGER,
                attempts INTEGER DEFAULT 0,
                status TEXT DEFAULT 'pending',
                FOREIGN KEY (module_id) REFERENCES modules(id)
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS quizzes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                module_id INTEGER NOT NULL,
                question_count INTEGER,
                file_path TEXT,
                status TEXT DEFAULT 'pending',
                FOREIGN KEY (module_id) REFERENCES modules(id)
            )
        ''')
        
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS generation_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                course_id INTEGER,
                action TEXT,
                api_key_used TEXT,
                tokens_in INTEGER,
                tokens_out INTEGER,
                duration_ms INTEGER,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (course_id) REFERENCES courses(id)
            )
        ''')
        
        conn.commit()
        conn.close()
    
    def create_course(self, name: str) -> int:
        """Create a new course entry"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('INSERT OR IGNORE INTO courses (name) VALUES (?)', (name,))
        cursor.execute('SELECT id FROM courses WHERE name = ?', (name,))
        course_id = cursor.fetchone()[0]
        conn.commit()
        conn.close()
        return course_id
    
    def get_course_status(self, name: str) -> Optional[Dict]:
        """Get course generation status"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT * FROM courses WHERE name = ?', (name,))
        row = cursor.fetchone()
        conn.close()
        if row:
            return {
                'id': row[0],
                'name': row[1],
                'methodology': row[2],
                'status': row[3],
                'created_at': row[4],
                'completed_at': row[5]
            }
        return None
    
    def update_course_methodology(self, course_id: int, methodology: str):
        """Update course methodology"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute(
            'UPDATE courses SET methodology = ? WHERE id = ?',
            (methodology, course_id)
        )
        conn.commit()
        conn.close()
    
    def create_module(self, course_id: int, number: int, title: str) -> int:
        """Create a module entry"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO modules (course_id, number, title) VALUES (?, ?, ?)',
            (course_id, number, title)
        )
        module_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return module_id
    
    def create_lesson(self, module_id: int, number: int, title: str) -> int:
        """Create a lesson entry"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute(
            'INSERT INTO lessons (module_id, number, title) VALUES (?, ?, ?)',
            (module_id, number, title)
        )
        lesson_id = cursor.lastrowid
        conn.commit()
        conn.close()
        return lesson_id
    
    def update_lesson_status(self, lesson_id: int, status: str, file_path: str = None, size_bytes: int = None):
        """Update lesson status"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        if file_path and size_bytes:
            cursor.execute(
                'UPDATE lessons SET status = ?, file_path = ?, size_bytes = ? WHERE id = ?',
                (status, file_path, size_bytes, lesson_id)
            )
        else:
            cursor.execute('UPDATE lessons SET status = ? WHERE id = ?', (status, lesson_id))
        conn.commit()
        conn.close()
    
    def increment_lesson_attempts(self, lesson_id: int):
        """Increment lesson generation attempts"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute('UPDATE lessons SET attempts = attempts + 1 WHERE id = ?', (lesson_id,))
        conn.commit()
        conn.close()
    
    def log_generation(self, course_id: int, action: str, api_key: str, tokens_in: int, tokens_out: int, duration_ms: int):
        """Log a generation action"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute(
            '''INSERT INTO generation_log (course_id, action, api_key_used, tokens_in, tokens_out, duration_ms)
               VALUES (?, ?, ?, ?, ?, ?)''',
            (course_id, action, api_key[:10] + "...", tokens_in, tokens_out, duration_ms)
        )
        conn.commit()
        conn.close()
    
    def mark_course_complete(self, course_id: int):
        """Mark course as complete"""
        conn = sqlite3.connect(self.db_path)
        cursor = conn.cursor()
        cursor.execute(
            'UPDATE courses SET status = ?, completed_at = ? WHERE id = ?',
            ('complete', datetime.now().isoformat(), course_id)
        )
        conn.commit()
        conn.close()


class GeminiGenerator:
    """Handles Gemini API calls for content generation with smart retry"""
    
    API_URL = "https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent"
    
    def __init__(self, key_pool: APIKeyPool, model: str = "gemini-2.0-flash"):
        self.key_pool = key_pool
        self.model = model
    
    async def generate(self, prompt: str, system_instruction: str = None, max_retries: int = 6) -> Dict:
        """Generate content using Gemini API with smart retry and rate limit handling"""
        last_error = None
        
        for attempt in range(max_retries):
            api_key = await self.key_pool.get_key()
            url = self.API_URL.format(model=self.model) + f"?key={api_key}"
            
            payload = {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {
                    "temperature": 0.7,
                    "topP": 0.95,
                    "maxOutputTokens": 65536
                }
            }
            
            if system_instruction:
                payload["systemInstruction"] = {"parts": [{"text": system_instruction}]}
            
            try:
                async with aiohttp.ClientSession() as session:
                    start_time = datetime.now()
                    async with session.post(url, json=payload, timeout=aiohttp.ClientTimeout(total=120)) as response:
                        duration_ms = int((datetime.now() - start_time).total_seconds() * 1000)
                        
                        if response.status == 200:
                            result = await response.json()
                            text = result.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', '')
                            usage = result.get('usageMetadata', {})
                            return {
                                'success': True,
                                'text': text,
                                'tokens_in': usage.get('promptTokenCount', 0),
                                'tokens_out': usage.get('candidatesTokenCount', 0),
                                'duration_ms': duration_ms,
                                'api_key': api_key
                            }
                        elif response.status == 429:
                            # Rate limited - mark with cooldown and exponential backoff
                            cooldown = 60 * (2 ** min(attempt, 3))  # 60s, 120s, 240s, 480s max
                            self.key_pool.mark_rate_limited(api_key, cooldown)
                            
                            # Add jitter to avoid thundering herd
                            jitter = random.uniform(1, 5)
                            wait_time = min(5 + (2 ** attempt) + jitter, 30)  # Max 30s wait
                            
                            stats = self.key_pool.get_stats()
                            print(f"⚠️ 429 Rate limit (key ...{api_key[-8:]}) - Attempt {attempt+1}/{max_retries}")
                            print(f"   Keys: {stats['available_keys']}/{stats['total_keys']} available, waiting {wait_time:.1f}s")
                            
                            await asyncio.sleep(wait_time)
                            last_error = "Rate limited"
                            
                        elif response.status == 500 or response.status == 503:
                            # Server error - mark key as failed, short retry
                            self.key_pool.mark_failed(api_key)
                            wait_time = random.uniform(2, 5)
                            print(f"⚠️ Server error {response.status} - retrying in {wait_time:.1f}s")
                            await asyncio.sleep(wait_time)
                            last_error = f"Server error {response.status}"
                            
                        else:
                            error = await response.text()
                            print(f"❌ API Error: {response.status} - {error[:200]}")
                            self.key_pool.mark_failed(api_key)
                            last_error = f"API error {response.status}"
                            await asyncio.sleep(1)
                            
            except asyncio.TimeoutError:
                print(f"⚠️ Timeout on attempt {attempt+1}/{max_retries}")
                last_error = "Timeout"
                await asyncio.sleep(random.uniform(2, 5))
                
            except Exception as e:
                print(f"❌ Request error: {e}")
                last_error = str(e)
                await asyncio.sleep(random.uniform(1, 3))
        
        return {'success': False, 'error': f'Max retries exceeded: {last_error}'}


class QualityChecker:
    """Validates generated content quality"""
    
    @staticmethod
    def check_lesson(html_content: str, min_size: int, max_size: int) -> Dict:
        """Check lesson quality"""
        issues = []
        size = len(html_content.encode('utf-8'))
        
        # Check size
        if size < min_size:
            issues.append(f"Too short: {size} bytes (min: {min_size})")
        elif size > max_size:
            issues.append(f"Too long: {size} bytes (max: {max_size})")
        
        # Check required sections
        required_sections = [
            ('objectives-box', 'Learning Objectives section'),
            ('Check Your Understanding', 'Interactive section'),
            ('Key Takeaways', 'Takeaways section'),
            ('AccrediPro', 'Branding'),
        ]
        
        for marker, name in required_sections:
            if marker not in html_content:
                issues.append(f"Missing: {name}")
        
        # Check for navigation CTAs (should NOT be present)
        if 'Next Lesson' in html_content or 'Continue to' in html_content:
            issues.append("Contains navigation CTA (should be removed)")
        
        return {
            'valid': len(issues) == 0,
            'size': size,
            'issues': issues
        }
    
    @staticmethod
    def check_quiz(json_content: str, expected_questions: int = 10) -> Dict:
        """Check quiz quality"""
        issues = []
        
        try:
            quiz = json.loads(json_content)
            questions = quiz.get('questions', [])
            
            if len(questions) != expected_questions:
                issues.append(f"Expected {expected_questions} questions, got {len(questions)}")
            
            for i, q in enumerate(questions):
                if 'question' not in q:
                    issues.append(f"Question {i+1}: Missing question text")
                if 'options' not in q or len(q.get('options', [])) != 4:
                    issues.append(f"Question {i+1}: Should have 4 options")
                if 'correctAnswer' not in q:
                    issues.append(f"Question {i+1}: Missing correct answer")
                    
        except json.JSONDecodeError as e:
            issues.append(f"Invalid JSON: {e}")
        
        return {
            'valid': len(issues) == 0,
            'issues': issues
        }


# Main function will be in generate.py
if __name__ == "__main__":
    print("AccrediPro Course Generator - Core Module")
    print("Use: python generate.py 'Course Name' to generate a course")
