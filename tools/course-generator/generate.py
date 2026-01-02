#!/usr/bin/env python3
"""
AccrediPro Course Generator - ROBUST VERSION 3.0
Features:
- Full sample lesson in every prompt
- Continue incomplete responses
- Reduced parallelism (4 modules)
- More retries (6)
- No min size - just validates complete HTML
"""

import sys
import os
import json
import asyncio
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional
import re

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from core import APIKeyPool, CourseDatabase, GeminiGenerator, QualityChecker
from prompts import (
    SYSTEM_INSTRUCTION, METHODOLOGY_PROMPT, OUTLINE_PROMPT,
    LESSON_PROMPT, QUIZ_PROMPT, FINAL_EXAM_PROMPT, CAREER_EARNINGS_CONTENT,
    MODULE_15_ENDING_CONTENT
)

from dotenv import load_dotenv
load_dotenv('config.env')


# Continuation prompt for incomplete responses
CONTINUE_PROMPT = """Continue generating the HTML lesson from where you stopped.

Here is what you generated so far:
{partial_content}

Continue EXACTLY from where this ends. Do NOT repeat any content.
Output ONLY the remaining HTML, starting from where the previous response ended.
Make sure to include the closing tags: </div>, </body>, </html>"""


class RobustCourseGenerator:
    """Robust course generator with all reliability improvements"""
    
    def __init__(self, course_name: str, fill_gaps: bool = False):
        self.course_name = course_name
        self.fill_gaps = fill_gaps
        self.config = self._load_config()
        self.db = CourseDatabase()
        self.key_pool = APIKeyPool(self.config['api_keys'])
        self.generator = GeminiGenerator(self.key_pool, self.config['model'])
        self.quality_checker = QualityChecker()
        self.full_sample = self._load_full_sample()  # Load complete sample lesson
        
        self.course_id = None
        self.methodology = None
        self.outline = None
        
    def _load_config(self) -> Dict:
        keys_str = os.getenv('GEMINI_API_KEYS', '')
        keys = [k.strip() for k in keys_str.split(',') if k.strip()]
        
        return {
            'api_keys': keys,
            'model': os.getenv('GEMINI_MODEL', 'gemini-2.5-flash-preview-05-20'),
            'output_dir': Path(os.getenv('OUTPUT_DIR', '../../courses')),
            'reference_dir': Path(os.getenv('REFERENCE_DIR', './reference')),
            'max_retries': int(os.getenv('MAX_RETRIES', 6)),
            'parallel_modules': int(os.getenv('PARALLEL_MODULES', 12)),  # 12 parallel for speed
            'max_continue_attempts': int(os.getenv('MAX_CONTINUE_ATTEMPTS', 3)),
        }
    
    def _load_full_sample(self) -> str:
        """Load ONE complete sample lesson for use as template"""
        reference_dir = self.config['reference_dir']
        
        # Try to load from reference directory
        if reference_dir.exists():
            for html_file in sorted(reference_dir.glob('*.html')):
                try:
                    content = html_file.read_text()
                    if len(content) > 20000:  # Need a substantial sample
                        print(f"📄 Loaded sample: {html_file.name} ({len(content)//1000}KB)")
                        return content
                except Exception as e:
                    print(f"Warning: Could not load {html_file}: {e}")
        
        # Fallback - try Gut Health course
        gut_health_path = Path(__file__).parent.parent.parent / "FM/GH-Update/Module_01"
        if gut_health_path.exists():
            for html_file in sorted(gut_health_path.glob('*.html'))[:1]:
                try:
                    content = html_file.read_text()
                    print(f"📄 Loaded sample from Gut Health: {html_file.name} ({len(content)//1000}KB)")
                    return content
                except:
                    pass
        
        print("⚠️ No sample lesson found - generation may have inconsistent structure")
        return ""
    
    def _get_course_slug(self) -> str:
        slug = self.course_name.lower()
        slug = re.sub(r'[^a-z0-9]+', '-', slug)
        return slug.strip('-')
    
    def _get_output_path(self) -> Path:
        base = Path(__file__).parent / self.config['output_dir']
        return base / self._get_course_slug()
    
    def _is_html_complete(self, html_content: str) -> bool:
        """Check if HTML is fully generated (has closing tags)"""
        html_lower = html_content.lower()
        return '</html>' in html_lower and '</body>' in html_lower
    
    def _check_lesson_quality(self, html_content: str) -> Dict:
        """Simple quality check - just validates complete HTML"""
        issues = []
        size = len(html_content.encode('utf-8'))
        
        # Check for complete HTML
        if not self._is_html_complete(html_content):
            issues.append("Incomplete HTML (missing closing tags)")
        
        # Very minimal size check (just need something)
        if size < 5000:
            issues.append(f"Too short: {size} bytes")
        
        # Check for basic structure
        if '<html' not in html_content.lower():
            issues.append("Missing HTML tag")
        
        warnings = []
        if 'Next Lesson' in html_content or 'Continue to Module' in html_content:
            warnings.append("Contains navigation CTA")
        
        return {
            'valid': len(issues) == 0,
            'size': size,
            'issues': issues,
            'warnings': warnings
        }
    
    def _find_missing_lessons(self, module: Dict, module_dir: Path) -> List[Dict]:
        """Find lessons that don't exist in the module directory"""
        missing = []
        lessons = module.get('lessons', [])
        
        for lesson in lessons:
            lesson_num = lesson['number']
            pattern = f"Lesson_{module['number']}.{lesson_num}_*.html"
            matches = list(module_dir.glob(pattern))
            
            if not matches:
                missing.append(lesson)
        
        return missing
    
    async def generate_methodology(self) -> Dict:
        print(f"\n📋 Generating methodology for {self.course_name}...")
        
        prompt = METHODOLOGY_PROMPT.format(course_name=self.course_name)
        result = await self.generator.generate(prompt, SYSTEM_INSTRUCTION)
        
        if result['success']:
            try:
                text = result['text']
                json_match = re.search(r'\{[\s\S]*\}', text)
                if json_match:
                    methodology = json.loads(json_match.group())
                    print(f"✅ Methodology: {methodology.get('full_name', 'Generated')}")
                    return methodology
            except json.JSONDecodeError as e:
                print(f"⚠️ JSON parse error: {e}")
        
        print("❌ Failed to generate methodology")
        return None
    
    async def generate_outline(self) -> Dict:
        print(f"\n📚 Generating course outline...")
        
        methodology_str = json.dumps(self.methodology, indent=2) if self.methodology else "None"
        prompt = OUTLINE_PROMPT.format(
            course_name=self.course_name,
            methodology=methodology_str
        )
        
        result = await self.generator.generate(prompt, SYSTEM_INSTRUCTION)
        
        if result['success']:
            try:
                text = result['text']
                json_match = re.search(r'\{[\s\S]*\}', text)
                if json_match:
                    outline = json.loads(json_match.group())
                    modules = outline.get('modules', [])
                    print(f"✅ Outline: {len(modules)} modules generated")
                    return outline
            except json.JSONDecodeError as e:
                print(f"⚠️ JSON parse error: {e}")
        
        print("❌ Failed to generate outline")
        return None
    
    async def continue_generation(self, partial_content: str) -> Optional[str]:
        """Continue generating from where the model stopped"""
        prompt = CONTINUE_PROMPT.format(partial_content=partial_content[-10000:])  # Last 10KB for context
        
        result = await self.generator.generate(prompt, SYSTEM_INSTRUCTION)
        
        if result['success']:
            return result['text']
        return None
    
    async def generate_lesson(self, module: Dict, lesson: Dict, previous_lessons: List[str]) -> Optional[str]:
        """Generate a single lesson with full sample and continue support"""
        module_num = module['number']
        lesson_num = lesson['number']
        
        # Build prompt with FULL SAMPLE
        prompt = f"""Generate a PREMIUM QUALITY HTML lesson for:
Course: {self.course_name}
Module {module_num}: {module['title']}
Lesson {lesson_num}: {lesson['title']}

IMPORTANT: Follow the EXACT structure of this sample lesson. Copy the HTML/CSS structure exactly, only change the text content:

=== SAMPLE LESSON (COPY THIS STRUCTURE EXACTLY) ===
{self.full_sample[:30000]}
=== END SAMPLE ===

Course Methodology: {json.dumps(self.methodology) if self.methodology else "None"}

Previous lessons in this module (avoid repetition):
{chr(10).join(previous_lessons[-3:]) if previous_lessons else "None"}

Requirements:
1. Use the EXACT HTML structure from the sample above
2. Include all CSS styles from the sample
3. Include objectives-box, content sections, Check Your Understanding, takeaways
4. Target 25-35KB of content
5. NO navigation CTAs (Next Lesson, Continue, etc.)
6. Include AccrediPro branding in footer

Return ONLY the complete HTML document."""

        # Add career content for specific modules
        if module_num == 0 and lesson_num == 1:
            prompt += "\n\nINCLUDE INSPIRING CAREER CONTENT:\n" + CAREER_EARNINGS_CONTENT
        elif module_num == 14:
            prompt += "\n\nFOCUS ON BUSINESS BUILDING:\n" + CAREER_EARNINGS_CONTENT
        elif module_num == 15:
            # Add special content for Module 15 - career ending
            prompt += "\n\nMODULE 15 SPECIAL CONTENT - Make this CAREER-FOCUSED and CELEBRATORY:\n" + MODULE_15_ENDING_CONTENT
            if lesson_num == 8:
                prompt += "\n\nTHIS IS THE FINAL LESSON - Make it CELEBRATORY! Congratulate them on completing the course. Include clear next steps: take the exam, get certified, launch their practice. End with an empowering call to action!"
        
        result = await self.generator.generate(prompt, SYSTEM_INSTRUCTION)
        
        if not result['success']:
            return None
        
        html_content = result['text']
        
        # Clean up markdown wrappers
        if html_content.startswith('```'):
            html_content = re.sub(r'^```html?\n?', '', html_content)
            html_content = re.sub(r'\n?```$', '', html_content)
        
        # CONTINUE if incomplete
        continue_attempts = 0
        while not self._is_html_complete(html_content) and continue_attempts < self.config['max_continue_attempts']:
            continue_attempts += 1
            print(f"↪", end="", flush=True)  # Show continue indicator
            
            continuation = await self.continue_generation(html_content)
            if continuation:
                # Clean continuation
                if continuation.startswith('```'):
                    continuation = re.sub(r'^```html?\n?', '', continuation)
                    continuation = re.sub(r'\n?```$', '', continuation)
                
                html_content += continuation
            else:
                break
            
            # Small delay between continues
            await asyncio.sleep(0.3)
        
        return html_content
    
    async def generate_quiz(self, module: Dict, lesson_summaries: str) -> str:
        prompt = QUIZ_PROMPT.format(
            course_name=self.course_name,
            module_number=module['number'],
            module_title=module['title'],
            lesson_summaries=lesson_summaries
        )
        
        result = await self.generator.generate(prompt, SYSTEM_INSTRUCTION)
        
        if result['success']:
            text = result['text']
            if text.startswith('```'):
                text = re.sub(r'^```json?\n?', '', text)
                text = re.sub(r'\n?```$', '', text)
            return text
        
        return None
    
    async def generate_final_exam(self, module_summaries: str) -> str:
        prompt = FINAL_EXAM_PROMPT.format(
            course_name=self.course_name,
            methodology=json.dumps(self.methodology) if self.methodology else "None",
            module_summaries=module_summaries
        )
        
        result = await self.generator.generate(prompt, SYSTEM_INSTRUCTION)
        
        if result['success']:
            text = result['text']
            if text.startswith('```'):
                text = re.sub(r'^```json?\n?', '', text)
                text = re.sub(r'\n?```$', '', text)
            return text
        
        return None
    
    def export_modules_json(self, output_path: Path) -> None:
        """Export a simple modules.json with certification info and module list"""
        if not self.outline or not self.methodology:
            print("⚠️ Cannot export modules.json - missing outline or methodology")
            return
        
        # Niche config mapping (code -> coach, pixel)
        NICHE_CONFIG = {
            "FM": {"coach": "sarah", "pixel": "fm-health"},
            "HN": {"coach": "sarah", "pixel": "fm-health"},
            "WH": {"coach": "sarah", "pixel": "fm-health"},
            "IM": {"coach": "sarah", "pixel": "fm-health"},
            "NR": {"coach": "olivia", "pixel": "mental-health"},
            "ND": {"coach": "olivia", "pixel": "mental-health"},
            "GL": {"coach": "olivia", "pixel": "mental-health"},
            "LC": {"coach": "marcus", "pixel": "life-coaching"},
            "SE": {"coach": "luna", "pixel": "spiritual"},
            "SI": {"coach": "luna", "pixel": "spiritual"},
            "HB": {"coach": "sage", "pixel": "herbalism"},
            "TM": {"coach": "maya", "pixel": "yoga-movement"},
            "PW": {"coach": "bella", "pixel": "pet-wellness"},
            "FB": {"coach": "emma", "pixel": "parenting"},
            "PC": {"coach": "emma", "pixel": "parenting"},
            "CF": {"coach": "grace", "pixel": "faith"},
        }
        
        # Try to determine niche code from course name
        course_name_upper = self.course_name.upper()
        niche_code = None
        if "FUNCTIONAL MEDICINE" in course_name_upper or "FM" in course_name_upper:
            niche_code = "FM"
        elif "HOLISTIC NUTRITION" in course_name_upper or "NUTRITION" in course_name_upper:
            niche_code = "HN"
        elif "HORMONE" in course_name_upper or "WOMEN" in course_name_upper:
            niche_code = "WH"
        elif "INTEGRATIVE" in course_name_upper:
            niche_code = "IM"
        elif "NARCISS" in course_name_upper or "ABUSE" in course_name_upper:
            niche_code = "NR"
        elif "NEURODIVERS" in course_name_upper or "ADHD" in course_name_upper:
            niche_code = "ND"
        elif "GRIEF" in course_name_upper or "LOSS" in course_name_upper:
            niche_code = "GL"
        elif "LIFE COACH" in course_name_upper:
            niche_code = "LC"
        elif "SPIRITUAL" in course_name_upper or "ENERGY" in course_name_upper:
            niche_code = "SE"
        elif "SEX" in course_name_upper or "INTIMACY" in course_name_upper:
            niche_code = "SI"
        elif "HERB" in course_name_upper:
            niche_code = "HB"
        elif "EFT" in course_name_upper or "TAPPING" in course_name_upper:
            niche_code = "TM"
        elif "PET" in course_name_upper or "ANIMAL" in course_name_upper:
            niche_code = "PW"
        elif "BIRTH" in course_name_upper or "DOULA" in course_name_upper or "FERTILITY" in course_name_upper:
            niche_code = "FB"
        elif "PARENT" in course_name_upper or "CHILD" in course_name_upper:
            niche_code = "PC"
        elif "CHRISTIAN" in course_name_upper or "FAITH" in course_name_upper:
            niche_code = "CF"
        else:
            niche_code = "FM"  # Default fallback
        
        niche_info = NICHE_CONFIG.get(niche_code, {"coach": "sarah", "pixel": "fm-health"})
        
        # Extract module names (L1 only - modules 0-15)
        modules = self.outline.get('modules', [])
        module_list = []
        for m in modules:
            if m.get('number', 0) <= 15:  # L1 modules only
                module_list.append(f"Module {m['number']}: {m['title']}")
        
        # Build the JSON
        modules_data = {
            "certification": self.methodology.get('full_name', self.course_name),
            "method": self.methodology.get('acronym', '') + f" ({self.methodology.get('acronym_expansion', '')})",
            "slug": self._get_course_slug(),
            "niche_code": niche_code,
            "coach": niche_info["coach"],
            "pixel": niche_info["pixel"],
            "total_modules": len(module_list),
            "modules": module_list
        }
        
        # Save to output path
        modules_json_path = output_path / "modules.json"
        modules_json_path.write_text(json.dumps(modules_data, indent=2))
        print(f"✅ Exported modules.json ({len(module_list)} modules)")
    
    async def generate_module(self, module: Dict, fill_gaps_only: bool = False) -> Dict:
        """Generate all content for a module"""
        module_num = module['number']
        module_title = module['title']
        lessons = module.get('lessons', [])
        has_quiz = module.get('has_quiz', True)
        
        output_path = self._get_output_path()
        module_dir = output_path / f"Module_{module_num:02d}"
        module_dir.mkdir(parents=True, exist_ok=True)
        
        # If fill_gaps_only, find missing lessons
        if fill_gaps_only:
            lessons = self._find_missing_lessons(module, module_dir)
            if not lessons:
                print(f"\n📦 Module {module_num}: {module_title} - ✅ Complete")
                return {'module_number': module_num, 'module_title': module_title, 'lessons_created': 0, 'total_lessons': 0, 'skipped': True}
        else:
            # CLEANUP: Remove ALL lesson files from this module to prevent duplicates
            old_lessons = list(module_dir.glob("Lesson_*.html"))
            if old_lessons:
                for old_file in old_lessons:
                    old_file.unlink()
                print(f"\n🧹 Cleaned {len(old_lessons)} old files from Module {module_num}")
            # Also remove old quiz if regenerating
            old_quiz = module_dir / f"quiz_module_{module_num:02d}.json"
            if old_quiz.exists():
                old_quiz.unlink()
        
        print(f"\n📦 Module {module_num}: {module_title}")
        
        previous_lessons = []
        lesson_summaries = []
        success_count = 0
        
        for lesson in lessons:
            lesson_num = lesson['number']
            lesson_title = lesson['title']
            
            print(f"  📝 M{module_num}.L{lesson_num}: {lesson_title[:35]}...", end=" ", flush=True)
            
            for attempt in range(self.config['max_retries']):
                html_content = await self.generate_lesson(module, lesson, previous_lessons)
                
                if html_content:
                    quality = self._check_lesson_quality(html_content)
                    
                    if quality['valid']:
                        filename = f"Lesson_{module_num}.{lesson_num}_{lesson_title.replace(' ', '_').replace('/', '_').replace(':', '').replace('?', '')}.html"
                        filepath = module_dir / filename
                        filepath.write_text(html_content)
                        
                        print(f"✅ ({quality['size']//1000}KB)")
                        previous_lessons.append(f"Lesson {lesson_num}: {lesson_title}")
                        lesson_summaries.append(f"Lesson {lesson_num}: {lesson_title}")
                        success_count += 1
                        break
                    else:
                        print(f"⚠️", end=" ", flush=True)
                else:
                    print("❌", end=" ", flush=True)
                
                # Small delay between retries
                await asyncio.sleep(0.5)
            else:
                print("❌ Failed")
        
        # Generate quiz (if not Module 0 and not already exists in fill_gaps mode)
        if has_quiz and module_num > 0:
            quiz_path = module_dir / f"quiz_module_{module_num:02d}.json"
            
            if fill_gaps_only and quiz_path.exists():
                print(f"  📋 M{module_num} Quiz - ✅ Exists")
            else:
                print(f"  📋 M{module_num} Quiz...", end=" ", flush=True)
                
                quiz_content = await self.generate_quiz(module, "\n".join(lesson_summaries))
                
                if quiz_content:
                    quality = self.quality_checker.check_quiz(quiz_content)
                    if quality['valid']:
                        quiz_path.write_text(quiz_content)
                        print("✅")
                    else:
                        print(f"⚠️")
                else:
                    print("❌")
        
        return {
            'module_number': module_num,
            'module_title': module_title,
            'lessons_created': success_count,
            'total_lessons': len(lessons)
        }
    
    async def run(self):
        """Main generation process"""
        start_time = datetime.now()
        
        mode_str = "FILL GAPS" if self.fill_gaps else "FULL GENERATION"
        
        print("=" * 60)
        print(f"🚀 AccrediPro ROBUST Generator v3.0 ({mode_str})")
        print(f"📚 Course: {self.course_name}")
        print(f"🔑 API Keys: {len(self.config['api_keys'])}")
        print(f"⚡ Parallel: {self.config['parallel_modules']} modules")
        print(f"🔄 Max Retries: {self.config['max_retries']}")
        print(f"📄 Full Sample: {'✅ Loaded' if self.full_sample else '❌ Missing'}")
        print("=" * 60)
        
        output_path = self._get_output_path()
        
        # Load existing outline for fill-gaps mode
        if self.fill_gaps:
            outline_path = output_path / "course_outline.json"
            if outline_path.exists():
                self.outline = json.loads(outline_path.read_text())
                print(f"\n✅ Loaded existing outline")
                
                methodology_path = output_path / "methodology.json"
                if methodology_path.exists():
                    self.methodology = json.loads(methodology_path.read_text())
                else:
                    self.methodology = await self.generate_methodology()
            else:
                print(f"\n❌ No outline found. Run without --fill-gaps first.")
                return
        else:
            # Full generation - check for existing outline first
            outline_path = output_path / "course_outline.json"
            methodology_path = output_path / "methodology.json"
            
            # If outline already exists, REUSE IT to prevent duplicate lessons with different titles
            if outline_path.exists() and methodology_path.exists():
                print(f"\n📋 Found existing outline, reusing to prevent duplicates...")
                self.outline = json.loads(outline_path.read_text())
                self.methodology = json.loads(methodology_path.read_text())
                
                # Get or create course ID
                existing = self.db.get_course_status(self.course_name)
                if existing:
                    if existing['status'] == 'complete':
                        print(f"\n⚠️ Course complete. Use --fill-gaps to fix missing lessons.")
                        return
                    self.course_id = existing.get('id') or self.db.create_course(self.course_name)
                else:
                    self.course_id = self.db.create_course(self.course_name)
            else:
                # Generate fresh methodology and outline
                existing = self.db.get_course_status(self.course_name)
                if existing and existing['status'] == 'complete':
                    print(f"\n⚠️ Course exists. Use --fill-gaps to complete missing lessons.")
                    return
                
                self.course_id = self.db.create_course(self.course_name)
                
                self.methodology = await self.generate_methodology()
                if self.methodology:
                    self.db.update_course_methodology(self.course_id, json.dumps(self.methodology))
                    output_path.mkdir(parents=True, exist_ok=True)
                    (output_path / "methodology.json").write_text(json.dumps(self.methodology, indent=2))
                
                self.outline = await self.generate_outline()
                if not self.outline:
                    print("❌ Failed to generate outline. Aborting.")
                    return
                
                output_path.mkdir(parents=True, exist_ok=True)
                (output_path / "course_outline.json").write_text(json.dumps(self.outline, indent=2))
        
        # Export modules.json with certification info
        self.export_modules_json(output_path)
        
        # Generate modules in parallel batches
        modules = self.outline.get('modules', [])
        module_summaries = []
        results = []
        
        batch_size = self.config['parallel_modules']
        for i in range(0, len(modules), batch_size):
            batch = modules[i:i + batch_size]
            print(f"\n🔄 Batch {i//batch_size + 1}/{(len(modules) + batch_size - 1)//batch_size} ({len(batch)} modules)...")
            
            batch_results = await asyncio.gather(*[
                self.generate_module(module, fill_gaps_only=self.fill_gaps) for module in batch
            ])
            
            results.extend(batch_results)
            for result in batch_results:
                if not result.get('skipped'):
                    module_summaries.append(f"Module {result['module_number']}: {result['module_title']}")
        
        # Generate final exam (if not exists)
        exam_path = output_path / "Final_Exam" / "final_exam.json"
        if not exam_path.exists():
            print(f"\n🎓 Generating Final Exam...")
            exam_content = await self.generate_final_exam("\n".join(module_summaries))
            
            if exam_content:
                exam_dir = output_path / "Final_Exam"
                exam_dir.mkdir(exist_ok=True)
                exam_path.write_text(exam_content)
                print("✅ Final exam generated")
        
        # Mark complete
        if not self.fill_gaps and self.course_id:
            self.db.mark_course_complete(self.course_id)
        
        # Summary
        duration = datetime.now() - start_time
        total_lessons = sum(r['lessons_created'] for r in results if not r.get('skipped'))
        
        print("\n" + "=" * 60)
        print(f"✅ {'GAPS FILLED' if self.fill_gaps else 'GENERATION COMPLETE'}")
        print(f"📚 Course: {self.course_name}")
        print(f"📁 Output: {output_path}")
        print(f"📝 Lessons Created: {total_lessons}")
        print(f"⏱️ Duration: {duration}")
        print("=" * 60)
        
        return {
            'course_name': self.course_name,
            'lessons_created': total_lessons,
            'duration': str(duration),
            'success': True
        }


# Course catalog for queue generation - TOP 20 from master-niche-catalog.md
# Already done: Holistic Nutrition Practitioner, Gut Health Specialist, Herbalism Practitioner
COURSE_CATALOG = [
    # Tier 1: Highest Demand
    "Hormone Health Coach",
    "Integrative Health Coach",
    "Weight Loss Coach",
    # Tier 2: Strong Demand
    "Mental Wellness Coach",
    "Anti-Aging & Longevity Coach",
    "Sleep Health Coach",
    "Stress & Burnout Coach",
    "Autoimmune Specialist",
    # Tier 3: Niche but Passionate
    "Thyroid Health Coach",
    "Diabetes & Blood Sugar Coach",
    "Detox & Cleanse Specialist",
    "Menopause Support Coach",
    "Fertility & Prenatal Coach",
    # Tier 4: Specialty/Premium
    "Pediatric Nutrition Coach",
    "Sports Nutrition Coach",
    "Plant-Based Nutrition Coach",
    "Chronic Pain Coach",
    "Heart Health Coach",
]


async def run_queue(courses: List[str], fill_gaps: bool = False):
    """Run multiple courses in sequence"""
    start_time = datetime.now()
    results = []
    
    print("\n" + "=" * 60)
    print(f"🚀 AccrediPro QUEUE MODE - {len(courses)} courses")
    print("=" * 60)
    
    for i, course_name in enumerate(courses):
        print(f"\n📋 Course {i+1}/{len(courses)}: {course_name}")
        print(f"⏱️ ETA: ~{(len(courses) - i) * 15} minutes remaining")
        
        try:
            generator = RobustCourseGenerator(course_name, fill_gaps=fill_gaps)
            result = await generator.run()
            results.append(result)
        except Exception as e:
            print(f"❌ Error generating {course_name}: {e}")
            results.append({'course_name': course_name, 'success': False, 'error': str(e)})
    
    # Queue summary
    total_duration = datetime.now() - start_time
    successful = sum(1 for r in results if r.get('success'))
    
    print("\n" + "=" * 60)
    print(f"🎉 QUEUE COMPLETE")
    print(f"📚 Courses Generated: {successful}/{len(courses)}")
    print(f"⏱️ Total Duration: {total_duration}")
    print("=" * 60)
    
    for r in results:
        status = "✅" if r.get('success') else "❌"
        print(f"  {status} {r['course_name']}")


async def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python generate.py 'Course Name'              # Full generation")
        print("  python generate.py 'Course Name' --fill-gaps  # Fill missing lessons")
        print("  python generate.py --queue                    # Run all courses in catalog")
        print("  python generate.py --queue 'Course1' 'Course2' # Run specific courses")
        sys.exit(1)
    
    # Queue mode
    if '--queue' in sys.argv:
        fill_gaps = '--fill-gaps' in sys.argv
        
        # Get courses from command line or use catalog
        courses = [arg for arg in sys.argv[1:] if not arg.startswith('--')]
        
        if not courses:
            courses = COURSE_CATALOG
        
        await run_queue(courses, fill_gaps=fill_gaps)
    else:
        # Single course mode
        course_name = sys.argv[1]
        fill_gaps = '--fill-gaps' in sys.argv
        
        generator = RobustCourseGenerator(course_name, fill_gaps=fill_gaps)
        await generator.run()


if __name__ == "__main__":
    asyncio.run(main())

