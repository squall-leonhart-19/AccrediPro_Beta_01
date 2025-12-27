#!/usr/bin/env python3
"""
AccrediPro PIXEL LAUNCH Generator - v4.0
Enhanced course generator for 8-Pixel Launch with:
- Predefined methodologies (N.A.R.C., L.I.F.E., etc.)
- Full 37-module structure (L1 Foundation + L2/L3/L4 Pro Accelerator)
- Maximum parallel processing
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
    SYSTEM_INSTRUCTION, LESSON_PROMPT, QUIZ_PROMPT, FINAL_EXAM_PROMPT, 
    CAREER_EARNINGS_CONTENT, MODULE_15_ENDING_CONTENT
)

from dotenv import load_dotenv
load_dotenv('config.env')


# ============================================================================
# PREDEFINED METHODOLOGIES - Our custom acronyms for 8-Pixel Launch
# ============================================================================
PREDEFINED_METHODOLOGIES = {
    "Narcissistic Abuse Recovery Coach": {
        "acronym": "NARC",
        "full_name": "The N.A.R.C. Recovery Method™",
        "letters": [
            {"letter": "N", "meaning": "Navigate the Reality", "description": "Recognize narcissistic abuse patterns, understand manipulation tactics, validate experiences, and break through denial and cognitive dissonance."},
            {"letter": "A", "meaning": "Acknowledge the Wounds", "description": "Understand trauma bonds, process complex emotions, identify C-PTSD symptoms, and reduce shame and self-blame while building a foundation for healing."},
            {"letter": "R", "meaning": "Rebuild Identity", "description": "Rediscover authentic self through values clarification, establish healthy boundaries, reclaim personal power, and develop self-trust after betrayal."},
            {"letter": "C", "meaning": "Claim Your Power", "description": "Build resilience, develop healthy relationship skills, recognize red flags in new relationships, and create a fulfilling post-recovery life."}
        ]
    },
    "Energy Healing Practitioner": {
        "acronym": "BALANCE",
        "full_name": "The B.A.L.A.N.C.E. Protocol™",
        "letters": [
            {"letter": "B", "meaning": "Biofield Assessment", "description": "Evaluate the client's energy field, aura, and overall vitality using established assessment techniques."},
            {"letter": "A", "meaning": "Align Chakras", "description": "Balance and harmonize the seven major energy centers to restore energetic equilibrium."},
            {"letter": "L", "meaning": "Lifeforce Activation", "description": "Stimulate the flow of vital life energy (prana/chi/ki) throughout the body's energy pathways."},
            {"letter": "A", "meaning": "Activate Healing", "description": "Facilitate the body's natural healing mechanisms through targeted energy work."},
            {"letter": "N", "meaning": "Neutralize Blocks", "description": "Clear energetic blockages, stagnant patterns, and negative energy accumulations."},
            {"letter": "C", "meaning": "Clear Energy Field", "description": "Purify and protect the aura from external influences and energetic attachments."},
            {"letter": "E", "meaning": "Empower Client", "description": "Teach self-care practices for ongoing energy maintenance and spiritual wellness."}
        ]
    },
    "Life Coach": {
        "acronym": "LIFE",
        "full_name": "The L.I.F.E. Blueprint Method™",
        "letters": [
            {"letter": "L", "meaning": "Listen", "description": "Practice deep, active listening to fully understand the client's story, dreams, fears, and current situation."},
            {"letter": "I", "meaning": "Identify", "description": "Clarify goals, uncover limiting beliefs and blocks, map the gap between current reality and desired future."},
            {"letter": "F", "meaning": "Focus", "description": "Develop strategic action plans, prioritize goals, and create clear roadmaps with measurable milestones."},
            {"letter": "E", "meaning": "Execute", "description": "Build accountability structures, take consistent action, celebrate wins, and maintain momentum toward transformation."}
        ]
    },
    "Conscious Parenting Coach": {
        "acronym": "RAISE",
        "full_name": "The R.A.I.S.E. Framework™",
        "letters": [
            {"letter": "R", "meaning": "Respond", "description": "Replace reactive parenting with thoughtful, regulated responses that model emotional intelligence."},
            {"letter": "A", "meaning": "Attune", "description": "Develop deep emotional attunement and secure attachment through presence and connection."},
            {"letter": "I", "meaning": "Intentional", "description": "Practice purpose-driven parenting aligned with family values and long-term developmental goals."},
            {"letter": "S", "meaning": "Support", "description": "Nurture each child's unique developmental stages, temperament, and individual needs."},
            {"letter": "E", "meaning": "Empower", "description": "Build children's independence, confidence, self-regulation, and intrinsic motivation."}
        ]
    },
    "Grief & Loss Coach": {
        "acronym": "GRACE",
        "full_name": "The G.R.A.C.E. Method™",
        "letters": [
            {"letter": "G", "meaning": "Grounded", "description": "Stabilize and ground the client in the immediate aftermath of loss through presence and safety."},
            {"letter": "R", "meaning": "Recognize", "description": "Acknowledge the reality and depth of the loss without minimizing or rushing the grief process."},
            {"letter": "A", "meaning": "Accept", "description": "Process the full range of emotions without judgment, shame, or artificial timelines."},
            {"letter": "C", "meaning": "Continue", "description": "Maintain continuing bonds with the deceased while adapting to life without their physical presence."},
            {"letter": "E", "meaning": "Emerge", "description": "Create a new identity that honors the past while stepping into a meaningful future."}
        ]
    },
    "LGBTQ+ Affirming Life Coach": {
        "acronym": "PRIDE",
        "full_name": "The P.R.I.D.E. Coaching Framework™",
        "letters": [
            {"letter": "P", "meaning": "Present", "description": "Create safe, affirming, judgment-free coaching space that honors the client's full identity."},
            {"letter": "R", "meaning": "Reflect", "description": "Explore identity, experiences, internalized narratives, and the impact of societal messages."},
            {"letter": "I", "meaning": "Identity", "description": "Clarify and celebrate authentic self-expression across all dimensions of identity."},
            {"letter": "D", "meaning": "Develop", "description": "Build resilience, coping skills, authentic connections, and supportive community networks."},
            {"letter": "E", "meaning": "Empower", "description": "Thrive authentically in relationships, career, family, and life purpose without apology."}
        ]
    },
    "Pet Wellness Coach": {
        "acronym": "PAWS",
        "full_name": "The P.A.W.S. Method™",
        "letters": [
            {"letter": "P", "meaning": "Prevent", "description": "Implement proactive nutrition, exercise, enrichment, and preventive care strategies."},
            {"letter": "A", "meaning": "Assess", "description": "Conduct holistic evaluation of physical, emotional, behavioral, and environmental health."},
            {"letter": "W", "meaning": "Wellness", "description": "Create customized wellness plans addressing nutrition, movement, mental stimulation, and bonding."},
            {"letter": "S", "meaning": "Sustain", "description": "Maintain long-term health through ongoing support, aging care, and quality of life optimization."}
        ]
    },
    "Christian Life Coach": {
        "acronym": "FAITH",
        "full_name": "The F.A.I.T.H. Coaching Method™",
        "letters": [
            {"letter": "F", "meaning": "Foundation", "description": "Build coaching on the solid foundation of biblical principles, scripture, and Christian worldview."},
            {"letter": "A", "meaning": "Align", "description": "Help clients align their life with God's purpose, calling, and plan for their unique journey."},
            {"letter": "I", "meaning": "Inspire", "description": "Encourage spiritual growth, deeper faith, prayer life, and relationship with God."},
            {"letter": "T", "meaning": "Transform", "description": "Facilitate renewal of mind and heart through Christ-centered transformation principles."},
            {"letter": "H", "meaning": "Hope", "description": "Cultivate hope, vision, and trust in God's faithfulness for the future."}
        ]
    }
}


# ============================================================================
# 37-MODULE STRUCTURE TEMPLATE (L1 + L2 + L3 + L4 Pro Accelerator)
# ============================================================================
FULL_COURSE_STRUCTURE = """Create a COMPLETE course outline for "{course_name}" certification.

This is a FULL CERTIFICATION PACKAGE with 37 modules across 4 tiers:

=== L1 FOUNDATION (Modules 0-15) - Base Certification $97 ===
Module 0: Introduction & Career Vision (4 lessons, no quiz)
  L1: Welcome to AccrediPro - Your Path to {certification_title} Mastery
  L2: Career Paths & Opportunities (8 specific career paths with income potential)
  L3: The Earnings Breakdown (Part-time, Full-time, Scaled practice numbers)
  L4: Your First 90 Days Roadmap (Foundation → Launch → Growth phases)

Modules 1-13: Core course content (8 lessons each, with quiz)
  - Module 1: Foundations & The {methodology_name} Framework
  - Modules 2-9: Deep dive into each letter of the {acronym} methodology
  - Modules 10-13: Advanced applications, specialized populations, advanced techniques

Module 14: Practice Building & Business Mastery (8 lessons, with quiz)
Module 15: Your Practitioner Journey (8 lessons, with quiz) - CELEBRATORY ENDING

=== L2 ADVANCED CLINICAL (Modules 22-29) - Pro Accelerator ===
8 modules deepening clinical application of {methodology_name}:
Module 22: Advanced {acronym} Assessment Mastery
Module 23: Complex Case Pattern Recognition  
Module 24: Multi-System Integration Protocols
Module 25: Advanced Lab & Biomarker Interpretation (if applicable) OR Advanced Assessment Tools
Module 26: Difficult Client Scenarios
Module 27: High-Complexity Case Management
Module 28: Evidence-Based Protocol Updates
Module 29: Clinical Reasoning Frameworks

=== L3 MASTER LEVEL (Modules 30-35) - Pro Accelerator ===
6 modules for authority building:
Module 30: Authority Positioning in Your Niche
Module 31: Professional Reputation & Credibility
Module 32: Peer Collaboration & Referral Networks
Module 33: Case Presentation & Documentation Excellence
Module 34: Thought Leadership & Publishing
Module 35: Industry Influence & Speaking

=== L4 PRACTICE PATH (Modules 36-42) - Pro Accelerator ===
7 modules for business scaling:
Module 36: Advanced Business Operations
Module 37: Team Building & Hiring
Module 38: Systems & Automation
Module 39: Scaling Revenue Streams
Module 40: High-Ticket Program Design
Module 41: Exit Strategy & Passive Income
Module 42: Income Mastery & Wealth Building

Methodology: {methodology}

Return ONLY valid JSON with this structure:
{{
  "course_name": "{course_name}",
  "certification_title": "{certification_title}",
  "methodology_name": "{methodology_name}",
  "total_modules": 37,
  "tiers": {{
    "L1_Foundation": {{"modules": "0-15", "lesson_count": 124}},
    "L2_Advanced": {{"modules": "22-29", "lesson_count": 64}},
    "L3_Master": {{"modules": "30-35", "lesson_count": 48}},
    "L4_Practice": {{"modules": "36-42", "lesson_count": 56}}
  }},
  "modules": [
    {{"number": 0, "title": "Introduction & Career Vision", "tier": "L1", "lessons": [...], "has_quiz": false}},
    {{"number": 1, "title": "Foundations...", "tier": "L1", "lessons": [...], "has_quiz": true}},
    ...all 37 modules with 8 lessons each (except Module 0 with 4)
  ]
}}

Generate ALL 37 modules with appropriate content for this specific niche.
Each module in L1 (1-15), L2, L3, L4 has 8 lessons.
Module 0 has 4 lessons.
Make lesson titles SPECIFIC and relevant to {course_name}.
"""


# Continuation prompt for incomplete responses
CONTINUE_PROMPT = """Continue generating the HTML lesson from where you stopped.

Here is what you generated so far:
{partial_content}

Continue EXACTLY from where this ends. Do NOT repeat any content.
Output ONLY the remaining HTML, starting from where the previous response ended.
Make sure to include the closing tags: </div>, </body>, </html>"""


class PixelLaunchGenerator:
    """Enhanced generator for 8-Pixel Launch with predefined methodologies"""
    
    def __init__(self, course_name: str, fill_gaps: bool = False):
        self.course_name = course_name
        self.fill_gaps = fill_gaps
        self.config = self._load_config()
        self.db = CourseDatabase()
        self.key_pool = APIKeyPool(self.config['api_keys'])
        self.generator = GeminiGenerator(self.key_pool, self.config['model'])
        self.quality_checker = QualityChecker()
        self.full_sample = self._load_full_sample()
        
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
            'parallel_modules': int(os.getenv('PARALLEL_MODULES', 16)),  # MAX for speed
            'max_continue_attempts': int(os.getenv('MAX_CONTINUE_ATTEMPTS', 3)),
        }
    
    def _load_full_sample(self) -> str:
        """Load complete sample lesson for use as template"""
        reference_dir = self.config['reference_dir']
        
        # Try to load from reference directory
        if reference_dir.exists():
            for html_file in sorted(reference_dir.glob('*.html')):
                try:
                    content = html_file.read_text()
                    if len(content) > 20000:
                        print(f"📄 Loaded sample: {html_file.name} ({len(content)//1000}KB)")
                        return content
                except Exception as e:
                    print(f"Warning: Could not load {html_file}: {e}")
        
        # Try FM-Update as reference
        fm_path = Path(__file__).parent.parent.parent / "newcourses/FM-Update/Module_01"
        if fm_path.exists():
            for html_file in sorted(fm_path.glob('*.html'))[:1]:
                try:
                    content = html_file.read_text()
                    print(f"📄 Loaded sample from FM-Update: {html_file.name} ({len(content)//1000}KB)")
                    return content
                except:
                    pass
        
        # Fallback to existing courses
        courses_path = Path(__file__).parent.parent.parent / "courses/holistic-nutrition-practitioner/Module_01"
        if courses_path.exists():
            for html_file in sorted(courses_path.glob('*.html'))[:1]:
                try:
                    content = html_file.read_text()
                    print(f"📄 Loaded sample from Holistic Nutrition: {html_file.name} ({len(content)//1000}KB)")
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
        """Check if HTML is fully generated"""
        html_lower = html_content.lower()
        return '</html>' in html_lower and '</body>' in html_lower
    
    def _check_lesson_quality(self, html_content: str) -> Dict:
        """Quality check for lessons"""
        issues = []
        size = len(html_content.encode('utf-8'))
        
        if not self._is_html_complete(html_content):
            issues.append("Incomplete HTML (missing closing tags)")
        
        if size < 5000:
            issues.append(f"Too short: {size} bytes")
        
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
    
    def _get_predefined_methodology(self) -> Optional[Dict]:
        """Check if this course has a predefined methodology"""
        return PREDEFINED_METHODOLOGIES.get(self.course_name)
    
    async def generate_methodology(self) -> Dict:
        """Get methodology - use predefined if available, otherwise generate"""
        print(f"\n📋 Getting methodology for {self.course_name}...")
        
        # CHECK PREDEFINED FIRST
        predefined = self._get_predefined_methodology()
        if predefined:
            print(f"✅ Using PREDEFINED methodology: {predefined['full_name']}")
            return predefined
        
        # Generate with AI if not predefined
        print(f"⚡ Generating new methodology with AI...")
        prompt = f"""Create a unique, memorable methodology acronym for a "{self.course_name}" certification course.

Requirements:
1. The acronym should be 4-7 letters
2. It should spell a relevant word or be catchy
3. Each letter should represent a core principle or step
4. Include a brief explanation (2-3 sentences) for each letter

Format your response as JSON:
{{
    "acronym": "THE WORD",
    "full_name": "The Word Method™",
    "letters": [
        {{"letter": "T", "meaning": "Title of principle", "description": "Brief explanation"}},
        ...
    ]
}}

Make it memorable, professional, and relevant to {self.course_name}."""

        result = await self.generator.generate(prompt, SYSTEM_INSTRUCTION)
        
        if result['success']:
            try:
                text = result['text']
                json_match = re.search(r'\{[\s\S]*\}', text)
                if json_match:
                    methodology = json.loads(json_match.group())
                    print(f"✅ Generated methodology: {methodology.get('full_name', 'Generated')}")
                    return methodology
            except json.JSONDecodeError as e:
                print(f"⚠️ JSON parse error: {e}")
        
        print("❌ Failed to generate methodology")
        return None
    
    async def generate_outline(self) -> Dict:
        """Generate full 37-module course outline"""
        print(f"\n📚 Generating FULL 37-module course outline...")
        
        methodology_str = json.dumps(self.methodology, indent=2) if self.methodology else "None"
        methodology_name = self.methodology.get('full_name', 'The Method') if self.methodology else "The Method"
        acronym = self.methodology.get('acronym', 'METHOD') if self.methodology else "METHOD"
        
        # Build certification title from course name
        certification_title = f"Certified {self.course_name}™"
        
        prompt = FULL_COURSE_STRUCTURE.format(
            course_name=self.course_name,
            certification_title=certification_title,
            methodology_name=methodology_name,
            acronym=acronym,
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
        prompt = CONTINUE_PROMPT.format(partial_content=partial_content[-10000:])
        
        result = await self.generator.generate(prompt, SYSTEM_INSTRUCTION)
        
        if result['success']:
            return result['text']
        return None
    
    async def generate_lesson(self, module: Dict, lesson: Dict, previous_lessons: List[str]) -> Optional[str]:
        """Generate a single lesson with full sample and continue support"""
        module_num = module['number']
        lesson_num = lesson['number']
        tier = module.get('tier', 'L1')
        
        # Build prompt with FULL SAMPLE
        prompt = f"""Generate a PREMIUM QUALITY HTML lesson for:
Course: {self.course_name}
Tier: {tier}
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

        # Add special content for specific modules
        if module_num == 0 and lesson_num == 1:
            prompt += "\n\nINCLUDE INSPIRING CAREER CONTENT:\n" + CAREER_EARNINGS_CONTENT
        elif module_num == 14:
            prompt += "\n\nFOCUS ON BUSINESS BUILDING:\n" + CAREER_EARNINGS_CONTENT
        elif module_num == 15:
            prompt += "\n\nMODULE 15 SPECIAL CONTENT - Make this CAREER-FOCUSED and CELEBRATORY:\n" + MODULE_15_ENDING_CONTENT
            if lesson_num == 8:
                prompt += "\n\nTHIS IS THE FINAL L1 LESSON - Make it CELEBRATORY! Congratulate them on completing the course."
        elif module_num == 42 and lesson_num == 8:
            prompt += "\n\nTHIS IS THE FINAL LESSON OF THE ENTIRE PRO ACCELERATOR - Make it EPIC! Ultimate income mastery and celebration."
        
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
            print(f"↪", end="", flush=True)
            
            continuation = await self.continue_generation(html_content)
            if continuation:
                if continuation.startswith('```'):
                    continuation = re.sub(r'^```html?\n?', '', continuation)
                    continuation = re.sub(r'\n?```$', '', continuation)
                html_content += continuation
            else:
                break
            
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
    
    async def generate_module(self, module: Dict, fill_gaps_only: bool = False) -> Dict:
        """Generate all content for a module"""
        module_num = module['number']
        module_title = module['title']
        lessons = module.get('lessons', [])
        has_quiz = module.get('has_quiz', True)
        tier = module.get('tier', 'L1')
        
        output_path = self._get_output_path()
        
        # Organize by tier for Pro Accelerator
        if tier == 'L2':
            module_dir = output_path / "01_Advanced_Clinical" / f"Module_{module_num:02d}"
        elif tier == 'L3':
            module_dir = output_path / "02_Master_Level" / f"Module_{module_num:02d}"
        elif tier == 'L4':
            module_dir = output_path / "03_Practice_Path" / f"Module_{module_num:02d}"
        else:
            module_dir = output_path / f"Module_{module_num:02d}"
        
        module_dir.mkdir(parents=True, exist_ok=True)
        
        # If fill_gaps_only, find missing lessons
        if fill_gaps_only:
            lessons = self._find_missing_lessons(module, module_dir)
            if not lessons:
                print(f"\n📦 [{tier}] Module {module_num}: {module_title} - ✅ Complete")
                return {'module_number': module_num, 'module_title': module_title, 'lessons_created': 0, 'total_lessons': 0, 'skipped': True}
        else:
            # CLEANUP old files
            old_lessons = list(module_dir.glob("Lesson_*.html"))
            if old_lessons:
                for old_file in old_lessons:
                    old_file.unlink()
                print(f"\n🧹 Cleaned {len(old_lessons)} old files from Module {module_num}")
            old_quiz = module_dir / f"quiz_module_{module_num:02d}.json"
            if old_quiz.exists():
                old_quiz.unlink()
        
        print(f"\n📦 [{tier}] Module {module_num}: {module_title}")
        
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
                
                await asyncio.sleep(0.5)
            else:
                print("❌ Failed")
        
        # Generate quiz
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
            'tier': tier,
            'lessons_created': success_count,
            'total_lessons': len(lessons)
        }
    
    async def run(self):
        """Main generation process"""
        start_time = datetime.now()
        
        mode_str = "FILL GAPS" if self.fill_gaps else "FULL 37-MODULE GENERATION"
        
        print("=" * 70)
        print(f"🚀 AccrediPro PIXEL LAUNCH Generator v4.0 ({mode_str})")
        print(f"📚 Course: {self.course_name}")
        print(f"🔑 API Keys: {len(self.config['api_keys'])}")
        print(f"⚡ Parallel: {self.config['parallel_modules']} modules")
        print(f"🔄 Max Retries: {self.config['max_retries']}")
        print(f"📄 Full Sample: {'✅ Loaded' if self.full_sample else '❌ Missing'}")
        print(f"📋 Predefined Methodology: {'✅ YES' if self._get_predefined_methodology() else '❌ AI Generated'}")
        print("=" * 70)
        
        output_path = self._get_output_path()
        
        # Load or generate methodology and outline
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
            outline_path = output_path / "course_outline.json"
            methodology_path = output_path / "methodology.json"
            
            if outline_path.exists() and methodology_path.exists():
                print(f"\n📋 Found existing outline, reusing to prevent duplicates...")
                self.outline = json.loads(outline_path.read_text())
                self.methodology = json.loads(methodology_path.read_text())
                
                existing = self.db.get_course_status(self.course_name)
                if existing:
                    if existing['status'] == 'complete':
                        print(f"\n⚠️ Course complete. Use --fill-gaps to fix missing lessons.")
                        return
                    self.course_id = existing.get('id') or self.db.create_course(self.course_name)
                else:
                    self.course_id = self.db.create_course(self.course_name)
            else:
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
        
        # Generate final exam
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
        
        print("\n" + "=" * 70)
        print(f"✅ {'GAPS FILLED' if self.fill_gaps else 'GENERATION COMPLETE'}")
        print(f"📚 Course: {self.course_name}")
        print(f"📁 Output: {output_path}")
        print(f"📝 Lessons Created: {total_lessons}")
        print(f"⏱️ Duration: {duration}")
        print("=" * 70)
        
        return {
            'course_name': self.course_name,
            'lessons_created': total_lessons,
            'duration': str(duration),
            'success': True
        }


# 8-Pixel Launch Catalog
PIXEL_LAUNCH_CATALOG = [
    "Narcissistic Abuse Recovery Coach",  # Trauma Pixel
    "Christian Life Coach",                # Faith Pixel
    "Life Coach",                          # Life Pixel
    "Grief & Loss Coach",                  # Grief Pixel
    "Energy Healing Practitioner",         # Spiritual Pixel
    "Conscious Parenting Coach",           # Parent Pixel
    "Pet Wellness Coach",                  # Pet Pixel
    "LGBTQ+ Affirming Life Coach",         # LGBTQ+ Pixel
]


async def run_queue(courses: List[str], fill_gaps: bool = False):
    """Run multiple courses in sequence"""
    start_time = datetime.now()
    results = []
    
    print("\n" + "=" * 70)
    print(f"🚀 AccrediPro PIXEL LAUNCH QUEUE - {len(courses)} courses")
    print("=" * 70)
    
    for i, course_name in enumerate(courses):
        print(f"\n📋 Course {i+1}/{len(courses)}: {course_name}")
        print(f"⏱️ ETA: ~{(len(courses) - i) * 180} minutes remaining")
        
        try:
            generator = PixelLaunchGenerator(course_name, fill_gaps=fill_gaps)
            result = await generator.run()
            results.append(result)
        except Exception as e:
            print(f"❌ Error generating {course_name}: {e}")
            results.append({'course_name': course_name, 'success': False, 'error': str(e)})
    
    # Queue summary
    total_duration = datetime.now() - start_time
    successful = sum(1 for r in results if r and r.get('success'))
    
    print("\n" + "=" * 70)
    print(f"🎉 PIXEL LAUNCH QUEUE COMPLETE")
    print(f"📚 Courses Generated: {successful}/{len(courses)}")
    print(f"⏱️ Total Duration: {total_duration}")
    print("=" * 70)
    
    for r in results:
        if r:
            status = "✅" if r.get('success') else "❌"
            print(f"  {status} {r.get('course_name', 'Unknown')}")


async def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python pixel_generator.py 'Course Name'              # Full generation")
        print("  python pixel_generator.py 'Course Name' --fill-gaps  # Fill missing lessons")
        print("  python pixel_generator.py --queue                    # Run all 8 Pixel courses")
        print("  python pixel_generator.py --queue 'Course1' 'Course2' # Run specific courses")
        print("\n8-Pixel Launch Courses:")
        for course in PIXEL_LAUNCH_CATALOG:
            predefined = "✅ PREDEFINED" if course in PREDEFINED_METHODOLOGIES else "⚡ AI"
            print(f"  • {course} ({predefined})")
        sys.exit(1)
    
    # Queue mode
    if '--queue' in sys.argv:
        fill_gaps = '--fill-gaps' in sys.argv
        
        courses = [arg for arg in sys.argv[1:] if not arg.startswith('--')]
        
        if not courses:
            courses = PIXEL_LAUNCH_CATALOG
        
        await run_queue(courses, fill_gaps=fill_gaps)
    else:
        # Single course mode
        course_name = sys.argv[1]
        fill_gaps = '--fill-gaps' in sys.argv
        
        generator = PixelLaunchGenerator(course_name, fill_gaps=fill_gaps)
        await generator.run()


if __name__ == "__main__":
    asyncio.run(main())
