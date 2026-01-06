#!/usr/bin/env python3
"""
verify_course.py - Quality Verification for Generated Courses

Checks generated course content for:
- Required elements (objectives, takeaways, case studies)
- Minimum/maximum lengths
- Practice Lab presence
- Content repetition
- Empathy keywords
- Coach voice presence

Usage:
    python verify_course.py "course-slug"
    python verify_course.py --all
"""

import sys
import os
import re
import json
from pathlib import Path
from typing import Dict, List, Optional, Tuple
from collections import defaultdict
import difflib

# Configuration
MIN_LESSON_SIZE = 15000  # 15KB minimum
MAX_LESSON_SIZE = 50000  # 50KB maximum
SIMILARITY_THRESHOLD = 0.60  # 60% similarity = potential repetition

# Required elements for standard lessons
REQUIRED_ELEMENTS = [
    ('objectives-box', 'class="objectives-box"'),
    ('takeaways', 'takeaway'),
    ('case-study', 'case stud'),
    ('module-header', 'class="module-header"'),
    ('lesson-title', 'class="lesson-title"'),
]

# Elements required for Practice Labs
PRACTICE_LAB_ELEMENTS = [
    ('scenario', 'scenario'),
    ('coaching-script', 'script'),
    ('practice-exercise', 'practice'),
    ('common-mistakes', 'mistake'),
    ('encouragement', 'encouragement'),
]

# Empathy keywords for 40+ women career changers
EMPATHY_KEYWORDS = [
    'you can do this',
    'you\'re doing great',
    'you\'re building',
    'meaningful',
    'transformation',
    'career change',
    'new chapter',
    'empowering',
    'confidence',
    'your journey',
    'believe in',
    'proud',
    'accomplished',
]


class CourseVerifier:
    def __init__(self, course_slug: str):
        self.course_slug = course_slug
        self.base_path = Path(__file__).parent.parent.parent / "courses" / course_slug
        self.issues = []
        self.stats = defaultdict(int)
        
    def verify(self) -> Dict:
        """Run all verification checks and return results"""
        if not self.base_path.exists():
            return {
                'success': False,
                'error': f"Course not found: {self.course_slug}",
                'path': str(self.base_path)
            }
        
        print(f"\n🔍 Verifying: {self.course_slug}")
        print(f"   Path: {self.base_path}\n")
        
        # Collect all lesson files
        lessons = self._collect_lessons()
        if not lessons:
            return {
                'success': False,
                'error': "No lesson files found",
                'path': str(self.base_path)
            }
        
        self.stats['total_lessons'] = len(lessons)
        
        # Run verification checks
        self._check_lengths(lessons)
        self._check_required_elements(lessons)
        self._check_practice_labs(lessons)
        self._check_empathy_keywords(lessons)
        self._check_repetition(lessons)
        self._check_folder_structure()
        self._check_blueprint()
        
        # Calculate quality score
        quality_score = self._calculate_score()
        
        return {
            'success': True,
            'course_slug': self.course_slug,
            'quality_score': quality_score,
            'stats': dict(self.stats),
            'issues': self.issues,
            'path': str(self.base_path)
        }
    
    def _collect_lessons(self) -> List[Tuple[Path, str]]:
        """Collect all lesson HTML files"""
        lessons = []
        for html_file in self.base_path.rglob("*.html"):
            if html_file.name.startswith("Lesson_"):
                try:
                    content = html_file.read_text(errors='ignore')
                    lessons.append((html_file, content))
                except Exception as e:
                    self.issues.append({
                        'type': 'read_error',
                        'file': str(html_file),
                        'message': str(e)
                    })
        return lessons
    
    def _check_lengths(self, lessons: List[Tuple[Path, str]]):
        """Check lesson file sizes"""
        for path, content in lessons:
            size = len(content)
            
            if size < MIN_LESSON_SIZE:
                self.issues.append({
                    'type': 'too_short',
                    'file': path.name,
                    'size': size,
                    'min_required': MIN_LESSON_SIZE,
                    'severity': 'warning'
                })
                self.stats['too_short'] += 1
            elif size > MAX_LESSON_SIZE:
                self.issues.append({
                    'type': 'too_long',
                    'file': path.name,
                    'size': size,
                    'max_allowed': MAX_LESSON_SIZE,
                    'severity': 'info'
                })
                self.stats['too_long'] += 1
            else:
                self.stats['good_length'] += 1
    
    def _check_required_elements(self, lessons: List[Tuple[Path, str]]):
        """Check for required HTML elements"""
        for path, content in lessons:
            content_lower = content.lower()
            
            # Skip Practice Labs for standard element checks
            if '.8_' in path.name or 'practice' in path.name.lower():
                continue
            
            missing = []
            for element_name, pattern in REQUIRED_ELEMENTS:
                if pattern.lower() not in content_lower:
                    missing.append(element_name)
            
            if missing:
                self.issues.append({
                    'type': 'missing_elements',
                    'file': path.name,
                    'missing': missing,
                    'severity': 'warning'
                })
                self.stats['missing_elements'] += 1
            else:
                self.stats['complete_elements'] += 1
    
    def _check_practice_labs(self, lessons: List[Tuple[Path, str]]):
        """Check for Practice Lab presence and content"""
        practice_labs = []
        
        for path, content in lessons:
            # Identify Practice Labs (lesson 8)
            if '.8_' in path.name or 'practice_lab' in path.name.lower():
                practice_labs.append((path, content))
                
                # Check Practice Lab specific elements
                content_lower = content.lower()
                missing = []
                for element_name, pattern in PRACTICE_LAB_ELEMENTS:
                    if pattern.lower() not in content_lower:
                        missing.append(element_name)
                
                if len(missing) > 2:  # Allow some flexibility
                    self.issues.append({
                        'type': 'practice_lab_incomplete',
                        'file': path.name,
                        'missing': missing,
                        'severity': 'warning'
                    })
        
        self.stats['practice_labs'] = len(practice_labs)
        
        # Check if we have expected number of Practice Labs
        # Expected: ~37 (one per module except Module 0)
        expected_practice_labs = 36
        if len(practice_labs) < expected_practice_labs * 0.9:  # 90% threshold
            self.issues.append({
                'type': 'missing_practice_labs',
                'found': len(practice_labs),
                'expected': expected_practice_labs,
                'severity': 'warning'
            })
    
    def _check_empathy_keywords(self, lessons: List[Tuple[Path, str]]):
        """Check for empathy/encouragement language"""
        total_empathy_matches = 0
        lessons_with_empathy = 0
        
        for path, content in lessons:
            content_lower = content.lower()
            matches = sum(1 for kw in EMPATHY_KEYWORDS if kw in content_lower)
            
            if matches > 0:
                lessons_with_empathy += 1
                total_empathy_matches += matches
        
        self.stats['empathy_coverage'] = round(lessons_with_empathy / len(lessons) * 100, 1)
        self.stats['total_empathy_matches'] = total_empathy_matches
        
        if self.stats['empathy_coverage'] < 50:
            self.issues.append({
                'type': 'low_empathy_coverage',
                'coverage': self.stats['empathy_coverage'],
                'severity': 'info'
            })
    
    def _check_repetition(self, lessons: List[Tuple[Path, str]]):
        """Check for content repetition between lessons"""
        # Extract text content (strip HTML)
        def extract_text(html: str) -> str:
            text = re.sub(r'<style[^>]*>.*?</style>', '', html, flags=re.DOTALL | re.IGNORECASE)
            text = re.sub(r'<[^>]+>', ' ', text)
            text = re.sub(r'\s+', ' ', text).strip()
            return text[:5000]  # Compare first 5000 chars for performance
        
        # Compare consecutive lessons for similarity
        repetition_pairs = []
        lesson_texts = [(path, extract_text(content)) for path, content in lessons]
        
        # Only check lessons within same module
        for i in range(len(lesson_texts) - 1):
            path1, text1 = lesson_texts[i]
            path2, text2 = lesson_texts[i + 1]
            
            # Skip if different modules
            module1 = path1.parent.name
            module2 = path2.parent.name
            if module1 != module2:
                continue
            
            # Calculate similarity
            similarity = difflib.SequenceMatcher(None, text1, text2).ratio()
            
            if similarity > SIMILARITY_THRESHOLD:
                repetition_pairs.append({
                    'file1': path1.name,
                    'file2': path2.name,
                    'similarity': round(similarity * 100, 1)
                })
        
        self.stats['repetition_pairs'] = len(repetition_pairs)
        
        for pair in repetition_pairs:
            self.issues.append({
                'type': 'potential_repetition',
                'files': [pair['file1'], pair['file2']],
                'similarity': pair['similarity'],
                'severity': 'warning'
            })
    
    def _check_folder_structure(self):
        """Verify folder structure (L1_Main, L2_Advanced, etc.)"""
        expected_folders = ['L1_Main', 'L2_Advanced', 'L3_Master', 'L4_Practice']
        found_folders = []
        
        for folder in expected_folders:
            folder_path = self.base_path / folder
            if folder_path.exists():
                found_folders.append(folder)
            else:
                self.issues.append({
                    'type': 'missing_folder',
                    'folder': folder,
                    'severity': 'info'
                })
        
        self.stats['tier_folders'] = len(found_folders)
    
    def _check_blueprint(self):
        """Check for course_blueprint.json and nomenclature.json"""
        blueprint_path = self.base_path / "course_blueprint.json"
        nomenclature_path = self.base_path / "nomenclature.json"
        
        if blueprint_path.exists():
            self.stats['has_blueprint'] = True
            try:
                data = json.loads(blueprint_path.read_text())
                self.stats['blueprint_modules'] = len(data.get('modules', []))
            except:
                pass
        else:
            self.stats['has_blueprint'] = False
            self.issues.append({
                'type': 'missing_blueprint',
                'severity': 'warning'
            })
        
        if nomenclature_path.exists():
            self.stats['has_nomenclature'] = True
        else:
            self.stats['has_nomenclature'] = False
    
    def _calculate_score(self) -> int:
        """Calculate overall quality score (0-100)"""
        score = 100
        
        # Deductions for issues
        deductions = {
            'too_short': 2,
            'too_long': 0.5,
            'missing_elements': 2,
            'missing_practice_labs': 5,
            'potential_repetition': 3,
            'missing_folder': 2,
            'missing_blueprint': 5,
            'practice_lab_incomplete': 1,
            'low_empathy_coverage': 3,
        }
        
        for issue in self.issues:
            issue_type = issue.get('type', '')
            if issue_type in deductions:
                score -= deductions[issue_type]
        
        # Bonus for good coverage
        if self.stats.get('empathy_coverage', 0) > 80:
            score += 5
        
        return max(0, min(100, int(score)))


def print_report(result: Dict):
    """Print formatted verification report"""
    if not result['success']:
        print(f"❌ Error: {result['error']}")
        return
    
    score = result['quality_score']
    stats = result['stats']
    issues = result['issues']
    
    # Score indicator
    if score >= 90:
        indicator = "🌟 EXCELLENT"
    elif score >= 80:
        indicator = "✅ GOOD"
    elif score >= 70:
        indicator = "⚠️ NEEDS WORK"
    else:
        indicator = "❌ POOR"
    
    print("\n" + "="*60)
    print(f"📊 QUALITY REPORT: {result['course_slug']}")
    print("="*60)
    print(f"\n   Quality Score: {score}/100 {indicator}\n")
    
    # Stats
    print("📈 STATISTICS:")
    print(f"   • Total Lessons: {stats.get('total_lessons', 0)}")
    print(f"   • Good Length: {stats.get('good_length', 0)}")
    print(f"   • Too Short: {stats.get('too_short', 0)}")
    print(f"   • Practice Labs: {stats.get('practice_labs', 0)}")
    print(f"   • Tier Folders: {stats.get('tier_folders', 0)}/4")
    print(f"   • Empathy Coverage: {stats.get('empathy_coverage', 0)}%")
    print(f"   • Repetition Pairs: {stats.get('repetition_pairs', 0)}")
    
    # Issues
    if issues:
        print(f"\n⚠️ ISSUES ({len(issues)}):")
        # Group by type
        by_type = defaultdict(list)
        for issue in issues:
            by_type[issue['type']].append(issue)
        
        for issue_type, items in by_type.items():
            print(f"\n   {issue_type} ({len(items)}):")
            for item in items[:5]:  # Show first 5
                if 'file' in item:
                    print(f"      - {item.get('file')}: {item.get('message', item.get('missing', item.get('size', '')))}")
                elif 'files' in item:
                    print(f"      - {item['files'][0]} ↔ {item['files'][1]} ({item.get('similarity')}% similar)")
                else:
                    print(f"      - {item}")
            if len(items) > 5:
                print(f"      ... and {len(items) - 5} more")
    else:
        print("\n✅ No issues found!")
    
    print("\n" + "="*60)


def verify_all_courses():
    """Verify all courses in the courses directory"""
    courses_path = Path(__file__).parent.parent.parent / "courses"
    course_dirs = [d for d in courses_path.iterdir() if d.is_dir() and not d.name.startswith('.')]
    
    if not course_dirs:
        print("No courses found to verify.")
        return
    
    print(f"\n🔍 Verifying {len(course_dirs)} courses...\n")
    
    results = []
    for course_dir in sorted(course_dirs):
        verifier = CourseVerifier(course_dir.name)
        result = verifier.verify()
        results.append(result)
        
        if result['success']:
            score = result['quality_score']
            indicator = "🌟" if score >= 90 else "✅" if score >= 80 else "⚠️" if score >= 70 else "❌"
            print(f"   {indicator} {course_dir.name}: {score}/100")
        else:
            print(f"   ❌ {course_dir.name}: {result.get('error', 'Unknown error')}")
    
    # Summary
    valid_results = [r for r in results if r['success']]
    if valid_results:
        avg_score = sum(r['quality_score'] for r in valid_results) / len(valid_results)
        print(f"\n📊 Average Quality Score: {avg_score:.1f}/100")


def main():
    if len(sys.argv) < 2:
        print("Usage: python verify_course.py <course-slug>")
        print("       python verify_course.py --all")
        sys.exit(1)
    
    arg = sys.argv[1]
    
    if arg == '--all':
        verify_all_courses()
    else:
        verifier = CourseVerifier(arg)
        result = verifier.verify()
        print_report(result)
        
        # Return exit code based on score
        if result['success'] and result['quality_score'] >= 70:
            sys.exit(0)
        else:
            sys.exit(1)


if __name__ == "__main__":
    main()
