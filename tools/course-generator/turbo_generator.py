#!/usr/bin/env python3
"""
AccrediPro TURBO Generator v6.0 - PARALLEL BLUEPRINT SYSTEM
Maximum speed WITH reliability:
- Pass 1: Generate module outlines IN PARALLEL (37 parallel calls, ~5 sec)
- Pass 2: Generate full lessons with hybrid parallelism (4 modules at once)
- Pass 3: Verify completeness and identify gaps
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
    SYSTEM_INSTRUCTION, QUIZ_PROMPT, FINAL_EXAM_PROMPT, 
    CAREER_EARNINGS_CONTENT, MODULE_15_ENDING_CONTENT
)

from dotenv import load_dotenv
# Load environment variables from Desktop/config.env for security
# This file is outside the repo and easier for user to access
load_dotenv(os.path.expanduser('~/Desktop/config.env'))


# ============================================================================
# PREDEFINED METHODOLOGIES - 8-Pixel Launch
# ============================================================================
PREDEFINED_METHODOLOGIES = {
    "Narcissistic Abuse Recovery Coach": {
        "acronym": "NARC",
        "full_name": "The N.A.R.C. Recovery Method™",
        "letters": [
            {"letter": "N", "meaning": "Navigate the Reality", "description": "Recognize narcissistic abuse patterns, understand manipulation tactics, validate experiences, and break through denial."},
            {"letter": "A", "meaning": "Acknowledge the Wounds", "description": "Understand trauma bonds, process complex emotions, identify C-PTSD symptoms, and reduce shame."},
            {"letter": "R", "meaning": "Rebuild Identity", "description": "Rediscover authentic self, establish healthy boundaries, reclaim personal power."},
            {"letter": "C", "meaning": "Claim Your Power", "description": "Build resilience, develop healthy relationship skills, create a fulfilling post-recovery life."}
        ]
    },
    "Energy Healing Practitioner": {
        "acronym": "BALANCE",
        "full_name": "The B.A.L.A.N.C.E. Protocol™",
        "letters": [
            {"letter": "B", "meaning": "Biofield Assessment", "description": "Evaluate the client's energy field and overall vitality."},
            {"letter": "A", "meaning": "Align Chakras", "description": "Balance and harmonize the seven major energy centers."},
            {"letter": "L", "meaning": "Lifeforce Activation", "description": "Stimulate the flow of vital life energy (prana/chi)."},
            {"letter": "A", "meaning": "Activate Healing", "description": "Facilitate the body's natural healing mechanisms."},
            {"letter": "N", "meaning": "Neutralize Blocks", "description": "Clear energetic blockages and stagnant patterns."},
            {"letter": "C", "meaning": "Clear Energy Field", "description": "Purify and protect the aura from external influences."},
            {"letter": "E", "meaning": "Empower Client", "description": "Teach self-care practices for ongoing energy maintenance."}
        ]
    },
    "Life Coach": {
        "acronym": "LIFE",
        "full_name": "The L.I.F.E. Blueprint Method™",
        "letters": [
            {"letter": "L", "meaning": "Listen", "description": "Deep, active listening to understand client's full story."},
            {"letter": "I", "meaning": "Identify", "description": "Clarify goals, uncover blocks, map the gap."},
            {"letter": "F", "meaning": "Focus", "description": "Develop strategy, prioritize, create clear roadmaps."},
            {"letter": "E", "meaning": "Execute", "description": "Build accountability, take action, maintain momentum."}
        ]
    },
    "Conscious Parenting Coach": {
        "acronym": "RAISE",
        "full_name": "The R.A.I.S.E. Framework™",
        "letters": [
            {"letter": "R", "meaning": "Respond", "description": "Replace reactive parenting with thoughtful responses."},
            {"letter": "A", "meaning": "Attune", "description": "Develop deep emotional attunement and secure attachment."},
            {"letter": "I", "meaning": "Intentional", "description": "Practice purpose-driven parenting aligned with values."},
            {"letter": "S", "meaning": "Support", "description": "Nurture each child's unique developmental needs."},
            {"letter": "E", "meaning": "Empower", "description": "Build independence, confidence, and self-regulation."}
        ]
    },
    "Grief & Loss Coach": {
        "acronym": "GRACE",
        "full_name": "The G.R.A.C.E. Method™",
        "letters": [
            {"letter": "G", "meaning": "Grounded", "description": "Stabilize in the immediate aftermath of loss."},
            {"letter": "R", "meaning": "Recognize", "description": "Acknowledge the reality and depth of the loss."},
            {"letter": "A", "meaning": "Accept", "description": "Process emotions without judgment or timelines."},
            {"letter": "C", "meaning": "Continue", "description": "Maintain continuing bonds while adapting."},
            {"letter": "E", "meaning": "Emerge", "description": "Create a new identity that honors the past."}
        ]
    },
    "LGBTQ+ Affirming Life Coach": {
        "acronym": "PRIDE",
        "full_name": "The P.R.I.D.E. Coaching Framework™",
        "letters": [
            {"letter": "P", "meaning": "Present", "description": "Create safe, affirming, judgment-free space."},
            {"letter": "R", "meaning": "Reflect", "description": "Explore identity and internalized narratives."},
            {"letter": "I", "meaning": "Identity", "description": "Clarify and celebrate authentic self-expression."},
            {"letter": "D", "meaning": "Develop", "description": "Build resilience and supportive networks."},
            {"letter": "E", "meaning": "Empower", "description": "Thrive authentically in all life areas."}
        ]
    },
    "Pet Wellness Coach": {
        "acronym": "PAWS",
        "full_name": "The P.A.W.S. Method™",
        "letters": [
            {"letter": "P", "meaning": "Prevent", "description": "Proactive nutrition, exercise, and preventive care."},
            {"letter": "A", "meaning": "Assess", "description": "Holistic evaluation of physical and emotional health."},
            {"letter": "W", "meaning": "Wellness", "description": "Customized wellness plans for nutrition and enrichment."},
            {"letter": "S", "meaning": "Sustain", "description": "Long-term health maintenance and aging support."}
        ]
    },
    "Christian Life Coach": {
        "acronym": "FAITH",
        "full_name": "The F.A.I.T.H. Coaching Method™",
        "letters": [
            {"letter": "F", "meaning": "Foundation", "description": "Build on biblical principles and scripture."},
            {"letter": "A", "meaning": "Align", "description": "Align life with God's purpose and calling."},
            {"letter": "I", "meaning": "Inspire", "description": "Encourage spiritual growth and deeper faith."},
            {"letter": "T", "meaning": "Transform", "description": "Renewal of mind and heart through Christ."},
            {"letter": "H", "meaning": "Hope", "description": "Cultivate hope and trust in God's faithfulness."}
        ]
    },
    # ========================================================================
    # NEW FLAGSHIP COURSES - 15-Pixel Architecture Completion
    # ========================================================================
    "Birth & Postpartum Doula": {
        "acronym": "BIRTH",
        "full_name": "The B.I.R.T.H. Support Method™",
        "letters": [
            {"letter": "B", "meaning": "Breathe & Center", "description": "Ground the mother with breath work, calm techniques, and presence during labor."},
            {"letter": "I", "meaning": "Inform & Educate", "description": "Empower with evidence-based information for informed decisions."},
            {"letter": "R", "meaning": "Reassure & Comfort", "description": "Provide physical comfort measures, emotional support, and continuous reassurance."},
            {"letter": "T", "meaning": "Transform the Experience", "description": "Help create a positive, empowering birth memory regardless of how labor unfolds."},
            {"letter": "H", "meaning": "Honor & Heal", "description": "Support postpartum recovery, bonding, and the sacred transition to motherhood."}
        ]
    },
    "Sex & Intimacy Coach": {
        "acronym": "INTIMATE",
        "full_name": "The I.N.T.I.M.A.T.E. Connection Method™",
        "letters": [
            {"letter": "I", "meaning": "Investigate", "description": "Explore sexual history, beliefs, and patterns without judgment."},
            {"letter": "N", "meaning": "Normalize", "description": "Reduce shame by normalizing desires, concerns, and variations in sexuality."},
            {"letter": "T", "meaning": "Trust", "description": "Build emotional safety and trust as the foundation for intimacy."},
            {"letter": "I", "meaning": "Ignite", "description": "Rekindle desire and passion through mindful practices."},
            {"letter": "M", "meaning": "Mindful Presence", "description": "Cultivate embodied awareness and present-moment connection."},
            {"letter": "A", "meaning": "Attune", "description": "Develop attunement to self and partner's needs and desires."},
            {"letter": "T", "meaning": "Transform", "description": "Heal sexual wounds, trauma, and limiting beliefs."},
            {"letter": "E", "meaning": "Expand", "description": "Expand capacity for pleasure, connection, and intimacy."}
        ]
    },
    "EFT Tapping Practitioner": {
        "acronym": "TAPPING",
        "full_name": "The T.A.P.P.I.N.G. Protocol™",
        "letters": [
            {"letter": "T", "meaning": "Target the Issue", "description": "Identify the specific emotion, memory, or belief to address."},
            {"letter": "A", "meaning": "Assess Intensity", "description": "Rate the emotional intensity on the 0-10 SUDS scale."},
            {"letter": "P", "meaning": "Prepare with Setup", "description": "Create the setup statement with acceptance and acknowledgment."},
            {"letter": "P", "meaning": "Point Sequence", "description": "Tap through the meridian points while voicing the issue."},
            {"letter": "I", "meaning": "Investigate Changes", "description": "Check in with body sensations and emotional shifts."},
            {"letter": "N", "meaning": "Navigate Aspects", "description": "Address different aspects and layers that emerge."},
            {"letter": "G", "meaning": "Ground & Integrate", "description": "Complete the session with positive statements and integration."}
        ]
    },
    "Integrative Medicine Practitioner": {
        "acronym": "BRIDGE",
        "full_name": "The B.R.I.D.G.E. Method™",
        "letters": [
            {"letter": "B", "meaning": "Blend Approaches", "description": "Integrate conventional medicine with evidence-based natural therapies."},
            {"letter": "R", "meaning": "Root Cause Analysis", "description": "Look beyond symptoms to identify underlying imbalances."},
            {"letter": "I", "meaning": "Individualize Care", "description": "Create personalized protocols based on genetics, lifestyle, and preferences."},
            {"letter": "D", "meaning": "Data-Driven Decisions", "description": "Use functional lab testing and biomarkers to guide treatment."},
            {"letter": "G", "meaning": "Guide the Journey", "description": "Educate and empower patients to take ownership of their health."},
            {"letter": "E", "meaning": "Evolve & Optimize", "description": "Continuously refine approach based on outcomes and new research."}
        ]
    }
}


# ============================================================================
# OUTLINE PROMPT - PASS 1: Generate course blueprint
# ============================================================================
OUTLINE_BLUEPRINT_PROMPT = """Create a COMPLETE course blueprint for "{course_name}" certification.

This is a FULL CERTIFICATION with 37 modules. Generate detailed OUTLINES for every lesson.

=== COURSE STRUCTURE ===
L1 FOUNDATION (Modules 0-15): 124 lessons
L2 ADVANCED (Modules 22-29): 64 lessons  
L3 MASTER (Modules 30-35): 48 lessons
L4 PRACTICE (Modules 36-42): 56 lessons
TOTAL: 292 lessons

Methodology: {methodology}

Generate a JSON blueprint with DETAILED lesson outlines (not just titles):

{{
  "course_name": "{course_name}",
  "total_lessons": 292,
  "modules": [
    {{
      "number": 0,
      "title": "Introduction & Career Vision",
      "tier": "L1",
      "has_quiz": false,
      "lessons": [
        {{
          "number": 1,
          "title": "Welcome to AccrediPro",
          "outline": [
            "Course overview and learning journey map",
            "The {methodology_name} framework introduction",
            "Career opportunities overview",
            "Certification credentials and recognition",
            "How to succeed in this program"
          ]
        }},
        ...4 lessons for Module 0
      ]
    }},
    ...all 37 modules with 8 lessons each (except Module 0 with 4)
  ]
}}

Each lesson outline should have 4-6 specific bullet points describing what will be covered.
This blueprint ensures NO repetition and perfect continuity across all 292 lessons.

Return ONLY valid JSON."""


# ============================================================================
# SINGLE MODULE OUTLINE PROMPT - For parallel blueprint generation
# ============================================================================
SINGLE_MODULE_OUTLINE_PROMPT = """Generate a detailed module outline for:
Course: {course_name}
Module {module_num}: {module_title}
Tier: {tier}

Methodology: {methodology}

Context - Previous modules covered:
{previous_modules}

Generate EXACTLY {lesson_count} lessons for this module with detailed outlines.

Return JSON:
{{
  "number": {module_num},
  "title": "{module_title}",
  "tier": "{tier}",
  "has_quiz": {has_quiz},
  "lessons": [
    {{
      "number": 1,
      "title": "First Lesson Title Here",
      "outline": [
        "Point 1: Specific content to cover",
        "Point 2: Specific content to cover",
        "Point 3: Specific content to cover",
        "Point 4: Specific content to cover"
      ]
    }},
    {{
      "number": 2,
      "title": "Second Lesson Title Here",
      "outline": [...]  
    }},
    ... continue to lesson {lesson_count}
  ]
}}

IMPORTANT:
- Lesson numbers start from 1 and go up to {lesson_count} WITHIN this module
- Example: Module 3 has lessons 3.1, 3.2, 3.3... 3.8
- Each outline should have 4-6 specific bullet points
- Build on previous modules, don't repeat content
- Stay focused on {module_title}

Return ONLY valid JSON for this single module."""


# ============================================================================
# LESSON PROMPT WITH FULL CONTEXT - PASS 2
# ============================================================================
CONTEXTUAL_LESSON_PROMPT = """Generate a PREMIUM QUALITY HTML lesson for:
Course: {course_name}
Module {module_num}: {module_title}
Lesson {lesson_num}: {lesson_title}

=== COURSE BLUEPRINT (Your context for continuity) ===
{course_blueprint}

=== PREVIOUS LESSONS IN THIS MODULE ===
{previous_lessons}

=== PREVIOUS MODULE SUMMARIES ===
{module_summaries}

=== THIS LESSON'S OUTLINE ===
{lesson_outline}

=== SAMPLE HTML STRUCTURE ===
{sample_html}

REQUIREMENTS:
1. Follow the EXACT HTML structure from sample
2. Cover ALL points in the lesson outline above
3. Bridge from previous lessons (avoid repetition)
4. Set up for upcoming lessons (use foreshadowing)
5. Reference the {methodology_name} framework throughout
6. Include: objectives-box, case studies, statistics, takeaways, references
7. Target 25-35KB of content
8. NO navigation CTAs

Return ONLY the complete HTML document."""


# Continuation prompt
CONTINUE_PROMPT = """Continue generating from where you stopped.

Partial content:
{partial_content}

Continue EXACTLY from where this ends. Output ONLY remaining HTML with closing tags."""


class TurboGenerator:
    """Two-Pass Generator: Outlines first, then full content with context"""
    
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
        self.blueprint = None  # Full course blueprint with outlines
        self.module_summaries = {}  # Generated summaries for context
        
    def _load_config(self) -> Dict:
        keys_str = os.getenv('GEMINI_API_KEYS', '')
        keys = [k.strip() for k in keys_str.split(',') if k.strip()]
        
        return {
            'api_keys': keys,
            'model': os.getenv('GEMINI_MODEL', 'gemini-2.0-flash'),
            'output_dir': Path(os.getenv('OUTPUT_DIR', '../../courses')),
            'reference_dir': Path(os.getenv('REFERENCE_DIR', './reference')),
            'max_retries': int(os.getenv('MAX_RETRIES', 4)),  # Fewer retries, faster
            'parallel_lessons': int(os.getenv('PARALLEL_LESSONS', 4)),  # Parallel within module
            'max_continue_attempts': int(os.getenv('MAX_CONTINUE_ATTEMPTS', 2)),
        }
    
    def _load_full_sample(self) -> str:
        """Load sample lesson for template"""
        paths_to_try = [
            self.config['reference_dir'],
            Path(__file__).parent.parent.parent / "newcourses/FM-Update/Module_01",
            Path(__file__).parent.parent.parent / "courses/holistic-nutrition-practitioner/Module_01",
        ]
        
        for path in paths_to_try:
            if path.exists():
                for html_file in sorted(path.glob('*.html'))[:1]:
                    try:
                        content = html_file.read_text()
                        if len(content) > 15000:
                            print(f"📄 Loaded sample: {html_file.name} ({len(content)//1000}KB)")
                            return content[:25000]  # Truncate for prompt size
                    except:
                        pass
        
        print("⚠️ No sample lesson found")
        return ""
    
    def _get_course_slug(self) -> str:
        return re.sub(r'[^a-z0-9]+', '-', self.course_name.lower()).strip('-')
    
    def _get_output_path(self) -> Path:
        return Path(__file__).parent / self.config['output_dir'] / self._get_course_slug()
    
    def _is_html_complete(self, html: str) -> bool:
        html_lower = html.lower()
        return '</html>' in html_lower and '</body>' in html_lower
    
    def _check_lesson_quality(self, html: str) -> Dict:
        size = len(html.encode('utf-8'))
        issues = []
        if not self._is_html_complete(html): issues.append("Incomplete HTML")
        if size < 5000: issues.append(f"Too short: {size}b")
        if '<html' not in html.lower(): issues.append("Missing HTML tag")
        return {'valid': len(issues) == 0, 'size': size, 'issues': issues}
    
    def _get_predefined_methodology(self) -> Optional[Dict]:
        return PREDEFINED_METHODOLOGIES.get(self.course_name)
    
    def _get_course_structure(self) -> List[Dict]:
        """Define the 37-module course structure"""
        methodology = self.methodology or {}
        acronym = methodology.get('acronym', 'METHOD')
        letters = methodology.get('letters', [])
        
        # Build structure based on methodology letters
        structure = []
        
        # Module 0: Introduction (4 lessons) - lessons numbered 1-4
        structure.append({
            'number': 0, 'title': 'Introduction & Career Vision', 'tier': 'L1',
            'has_quiz': False, 'lesson_count': 4
        })
        
        # L1 FOUNDATION: Modules 1-15 (8 lessons each)
        # Map methodology letters to modules
        for i, letter_info in enumerate(letters):
            structure.append({
                'number': i + 1,
                'title': f"{letter_info['letter']}: {letter_info['meaning']}",
                'tier': 'L1', 'has_quiz': True, 'lesson_count': 8
            })
        
        # Fill remaining L1 modules if methodology has fewer letters
        for m in range(len(letters) + 1, 16):
            structure.append({
                'number': m,
                'title': f"L1 Deep Dive Module {m}",
                'tier': 'L1', 'has_quiz': True, 'lesson_count': 8
            })
        
        # L2 ADVANCED: Modules 16-23 (8 lessons each)
        l2_topics = [
            "Advanced Case Studies", "Complex Client Scenarios", "Integration & Synthesis",
            "Research & Evidence", "Assessment Tools", "Treatment Planning",
            "Ethical Considerations", "Advanced Techniques"
        ]
        for i, topic in enumerate(l2_topics):
            structure.append({
                'number': 16 + i,
                'title': f"L2: {topic}",
                'tier': 'L2', 'has_quiz': True, 'lesson_count': 8
            })
        
        # L3 MASTER: Modules 24-29 (8 lessons each)
        l3_topics = [
            "Master Practitioner Skills", "Supervision & Mentoring",
            "Program Development", "Specialty Applications",
            "Crisis & Complex Cases", "Master Integration"
        ]
        for i, topic in enumerate(l3_topics):
            structure.append({
                'number': 24 + i,
                'title': f"L3: {topic}",
                'tier': 'L3', 'has_quiz': True, 'lesson_count': 8
            })
        
        # L4 PRACTICE: Modules 30-36 (8 lessons each)
        l4_topics = [
            "Building Your Practice", "Marketing & Client Acquisition",
            "Business Operations", "Legal & Compliance",
            "Group Programs & Workshops", "Scaling & Growth",
            "Certification & Final Review"
        ]
        for i, topic in enumerate(l4_topics):
            structure.append({
                'number': 30 + i,
                'title': f"L4: {topic}",
                'tier': 'L4', 'has_quiz': i < 6, 'lesson_count': 8
            })
        
        return structure
    
    # ========================================================================
    # PASS 1: PARALLEL Blueprint Generation (NEW - 37 parallel calls)
    # ========================================================================
    async def generate_single_module_outline(self, module_info: Dict, previous_modules: str) -> Optional[Dict]:
        """Generate outline for a single module"""
        methodology_str = json.dumps(self.methodology, indent=2) if self.methodology else "None"
        
        prompt = SINGLE_MODULE_OUTLINE_PROMPT.format(
            course_name=self.course_name,
            module_num=module_info['number'],
            module_title=module_info['title'],
            tier=module_info['tier'],
            methodology=methodology_str,
            previous_modules=previous_modules,
            lesson_count=module_info['lesson_count'],
            has_quiz='true' if module_info['has_quiz'] else 'false'
        )
        
        result = await self.generator.generate(prompt, SYSTEM_INSTRUCTION)
        
        if result['success']:
            try:
                text = result['text']
                json_match = re.search(r'\{[\s\S]*\}', text)
                if json_match:
                    module_data = json.loads(json_match.group())
                    return module_data
            except json.JSONDecodeError:
                pass
        
        return None
    
    async def generate_blueprint(self) -> Dict:
        """PASS 1: Generate course blueprint with PARALLEL module outline generation"""
        print(f"\n🗺️  PASS 1: Generating course blueprint (PARALLEL - 37 modules)...")
        
        structure = self._get_course_structure()
        print(f"📋 Course structure: {len(structure)} modules")
        
        # Generate all module outlines in parallel batches
        modules = []
        batch_size = min(10, len(self.config['api_keys']) // 2)  # Parallel batch size
        batch_size = max(4, batch_size)
        
        for i in range(0, len(structure), batch_size):
            batch = structure[i:i + batch_size]
            print(f"  🔄 Blueprint batch {i//batch_size + 1}/{(len(structure) + batch_size - 1)//batch_size}...")
            
            # Build previous modules context from already-generated modules
            prev_context = "\n".join([
                f"Module {m['number']}: {m['title']}" 
                for m in modules[-5:]  # Last 5 modules for context
            ]) if modules else "This is the first module"
            
            # Generate batch in parallel
            tasks = [
                self.generate_single_module_outline(mod_info, prev_context)
                for mod_info in batch
            ]
            batch_results = await asyncio.gather(*tasks)
            
            # Collect successful results
            for j, result in enumerate(batch_results):
                if result:
                    modules.append(result)
                    print(f"    ✅ Module {batch[j]['number']}: {len(result.get('lessons', []))} lessons")
                else:
                    # Fallback: create placeholder
                    print(f"    ⚠️ Module {batch[j]['number']}: Using fallback")
                    modules.append({
                        'number': batch[j]['number'],
                        'title': batch[j]['title'],
                        'tier': batch[j]['tier'],
                        'has_quiz': batch[j]['has_quiz'],
                        'lessons': self._generate_fallback_lessons(batch[j])
                    })
        
        # Sort by module number
        modules.sort(key=lambda m: m['number'])
        
        total_lessons = sum(len(m.get('lessons', [])) for m in modules)
        print(f"\n✅ Blueprint complete: {len(modules)} modules, {total_lessons} lessons outlined")
        
        return {
            'course_name': self.course_name,
            'total_lessons': total_lessons,
            'modules': modules
        }
    
    def _generate_fallback_lessons(self, module_info: Dict) -> List[Dict]:
        """Generate fallback lesson structure if API fails"""
        lessons = []
        for i in range(module_info['lesson_count']):
            lessons.append({
                'number': i + 1,  # Module-local numbering: 1, 2, 3, 4...
                'title': f"{module_info['title']} - Part {i + 1}",
                'outline': [
                    f"Key concepts for {module_info['title']}",
                    "Practical applications and examples",
                    "Case studies and real-world scenarios",
                    "Summary and key takeaways"
                ]
            })
        return lessons

    
    def _get_blueprint_context(self, current_module: int) -> str:
        """Get blueprint context string for a module"""
        if not self.blueprint:
            return "No blueprint available"
        
        lines = []
        for module in self.blueprint.get('modules', []):
            m_num = module['number']
            m_title = module['title']
            if m_num <= current_module + 2:  # Show current + 2 ahead
                lines.append(f"\nModule {m_num}: {m_title}")
                for lesson in module.get('lessons', [])[:4]:  # First 4 lessons
                    lines.append(f"  L{lesson['number']}: {lesson['title']}")
        
        return "\n".join(lines[:50])  # Limit size
    
    def _get_lesson_outline(self, module_num: int, lesson_num: int) -> str:
        """Get specific lesson outline from blueprint"""
        if not self.blueprint:
            return "No outline available"
        
        for module in self.blueprint.get('modules', []):
            if module['number'] == module_num:
                for lesson in module.get('lessons', []):
                    if lesson['number'] == lesson_num:
                        outline = lesson.get('outline', [])
                        return "\n".join(f"• {point}" for point in outline)
        
        return "No specific outline"
    
    # ========================================================================
    # PASS 2: Generate Full Lessons Sequentially with Context
    # ========================================================================
    async def generate_lesson(self, module: Dict, lesson: Dict, prev_lessons: List[str]) -> Optional[str]:
        """PASS 2: Generate a lesson with full context"""
        module_num = module['number']
        lesson_num = lesson['number']
        
        # Build context
        blueprint_context = self._get_blueprint_context(module_num)
        lesson_outline = self._get_lesson_outline(module_num, lesson_num)
        module_summary_text = "\n".join(
            f"Module {k}: {v}" for k, v in sorted(self.module_summaries.items()) if k < module_num
        )[:2000]
        
        methodology_name = self.methodology.get('full_name', 'The Method') if self.methodology else "The Method"
        
        prompt = CONTEXTUAL_LESSON_PROMPT.format(
            course_name=self.course_name,
            module_num=module_num,
            module_title=module['title'],
            lesson_num=lesson_num,
            lesson_title=lesson['title'],
            course_blueprint=blueprint_context,
            previous_lessons="\n".join(prev_lessons[-5:]) if prev_lessons else "None",
            module_summaries=module_summary_text if module_summary_text else "This is the first module",
            lesson_outline=lesson_outline,
            sample_html=self.full_sample,
            methodology_name=methodology_name
        )
        
        # Add special content for key modules
        if module_num == 0 and lesson_num == 1:
            prompt += "\n\nINCLUDE CAREER CONTENT:\n" + CAREER_EARNINGS_CONTENT[:3000]
        elif module_num == 15 and lesson_num == 8:
            prompt += "\n\nCELEBRATORY FINAL LESSON:\n" + MODULE_15_ENDING_CONTENT
        
        result = await self.generator.generate(prompt, SYSTEM_INSTRUCTION)
        
        if not result['success']:
            return None
        
        html = result['text']
        if html.startswith('```'):
            html = re.sub(r'^```html?\n?', '', html)
            html = re.sub(r'\n?```$', '', html)
        
        # Continue if incomplete
        attempts = 0
        while not self._is_html_complete(html) and attempts < self.config['max_continue_attempts']:
            attempts += 1
            print("↪", end="", flush=True)
            cont_prompt = CONTINUE_PROMPT.format(partial_content=html[-8000:])
            cont_result = await self.generator.generate(cont_prompt, SYSTEM_INSTRUCTION)
            if cont_result['success']:
                cont = cont_result['text']
                if cont.startswith('```'):
                    cont = re.sub(r'^```html?\n?', '', cont)
                    cont = re.sub(r'\n?```$', '', cont)
                html += cont
            await asyncio.sleep(0.2)
        
        return html
    
    async def generate_module(self, module: Dict) -> Dict:
        """Generate all lessons in a module SEQUENTIALLY for quality"""
        module_num = module['number']
        module_title = module['title']
        lessons = module.get('lessons', [])
        tier = module.get('tier', 'L1')
        
        output_path = self._get_output_path()
        
        # Organize by tier
        tier_dirs = {'L2': '01_Advanced_Clinical', 'L3': '02_Master_Level', 'L4': '03_Practice_Path'}
        if tier in tier_dirs:
            module_dir = output_path / tier_dirs[tier] / f"Module_{module_num:02d}"
        else:
            module_dir = output_path / f"Module_{module_num:02d}"
        
        module_dir.mkdir(parents=True, exist_ok=True)
        
        print(f"\n📦 [{tier}] Module {module_num}: {module_title}")
        
        prev_lessons = []
        success_count = 0
        
        # Generate lessons SEQUENTIALLY for context
        for lesson in lessons:
            lesson_num = lesson['number']
            lesson_title = lesson['title']
            
            print(f"  📝 M{module_num}.L{lesson_num}: {lesson_title[:30]}...", end=" ", flush=True)
            
            for attempt in range(self.config['max_retries']):
                html = await self.generate_lesson(module, lesson, prev_lessons)
                
                if html:
                    quality = self._check_lesson_quality(html)
                    if quality['valid']:
                        filename = f"Lesson_{module_num}.{lesson_num}_{lesson_title.replace(' ', '_').replace('/', '_').replace(':', '').replace('?', '')[:50]}.html"
                        (module_dir / filename).write_text(html)
                        print(f"✅ ({quality['size']//1000}KB)")
                        prev_lessons.append(f"L{lesson_num}: {lesson_title} - covered key topics")
                        success_count += 1
                        break
                    else:
                        print("⚠️", end=" ", flush=True)
                else:
                    print("❌", end=" ", flush=True)
                await asyncio.sleep(0.3)
            else:
                print("❌ Failed")
        
        # Save module summary for next modules' context
        self.module_summaries[module_num] = f"{module_title} - {len(lessons)} lessons on {lessons[0]['title'] if lessons else 'various topics'}"
        
        # Generate quiz
        if module.get('has_quiz', True) and module_num > 0:
            quiz_path = module_dir / f"quiz_module_{module_num:02d}.json"
            print(f"  📋 Quiz...", end=" ", flush=True)
            quiz_prompt = QUIZ_PROMPT.format(
                course_name=self.course_name,
                module_number=module_num,
                module_title=module_title,
                lesson_summaries="\n".join(prev_lessons)
            )
            quiz_result = await self.generator.generate(quiz_prompt, SYSTEM_INSTRUCTION)
            if quiz_result['success']:
                quiz = quiz_result['text']
                if quiz.startswith('```'):
                    quiz = re.sub(r'^```json?\n?', '', quiz)
                    quiz = re.sub(r'\n?```$', '', quiz)
                quiz_path.write_text(quiz)
                print("✅")
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
        """Main two-pass generation"""
        start_time = datetime.now()
        
        print("=" * 70)
        print(f"🚀 AccrediPro TURBO Generator v6.0 - PARALLEL BLUEPRINT")
        print(f"📚 Course: {self.course_name}")
        print(f"🔑 API Keys: {len(self.config['api_keys'])}")
        print(f"📄 Sample: {'✅' if self.full_sample else '❌'}")
        print(f"📋 Methodology: {'✅ PREDEFINED' if self._get_predefined_methodology() else '⚡ AI'}")
        print("=" * 70)
        
        output_path = self._get_output_path()
        output_path.mkdir(parents=True, exist_ok=True)
        
        # Get methodology
        self.methodology = self._get_predefined_methodology()
        if not self.methodology:
            print("\n⚡ No predefined methodology, generating...")
            # Would generate here, but we have predefined for all 8
        else:
            print(f"\n✅ Using: {self.methodology['full_name']}")
        
        # Save methodology
        (output_path / "methodology.json").write_text(json.dumps(self.methodology, indent=2))
        
        # PASS 1: Generate Blueprint
        blueprint_path = output_path / "course_blueprint.json"
        if blueprint_path.exists() and not self.fill_gaps:
            print(f"\n📋 Loading existing blueprint...")
            self.blueprint = json.loads(blueprint_path.read_text())
        else:
            self.blueprint = await self.generate_blueprint()
            if not self.blueprint:
                print("❌ Blueprint generation failed")
                return
            blueprint_path.write_text(json.dumps(self.blueprint, indent=2))
        
        # PASS 2: Generate Full Lessons - HYBRID: Parallel Modules, Sequential Lessons
        print(f"\n📝 PASS 2: Generating lessons (HYBRID: {min(4, len(self.config['api_keys']))} parallel modules)...")
        
        modules = self.blueprint.get('modules', [])
        results = []
        
        # Process modules in parallel batches (Use all keys for maximum speed)
        # With 19+ keys, we can do 18+ modules in parallel
        # Reserve 1 key for safety/overheads
        batch_size = max(4, len(self.config['api_keys']) - 1)
        
        for i in range(0, len(modules), batch_size):
            batch = modules[i:i + batch_size]
            print(f"\n🔄 Module Batch {i//batch_size + 1}/{(len(modules) + batch_size - 1)//batch_size} ({len(batch)} modules in parallel)...")
            
            # Generate batch in parallel
            batch_results = await asyncio.gather(*[
                self.generate_module(module) for module in batch
            ])
            
            results.extend(batch_results)
            
            # Update module summaries for context in next batch
            for result in batch_results:
                self.module_summaries[result['module_number']] = f"{result['module_title']} - {result['lessons_created']} lessons"
        
        # Generate final exam
        exam_path = output_path / "Final_Exam" / "final_exam.json"
        if not exam_path.exists():
            print(f"\n🎓 Generating Final Exam...")
            exam_prompt = FINAL_EXAM_PROMPT.format(
                course_name=self.course_name,
                methodology=json.dumps(self.methodology),
                module_summaries="\n".join(f"M{k}: {v}" for k, v in self.module_summaries.items())
            )
            exam_result = await self.generator.generate(exam_prompt, SYSTEM_INSTRUCTION)
            if exam_result['success']:
                exam_dir = output_path / "Final_Exam"
                exam_dir.mkdir(exist_ok=True)
                exam = exam_result['text']
                if exam.startswith('```'):
                    exam = re.sub(r'^```json?\n?', '', exam)
                    exam = re.sub(r'\n?```$', '', exam)
                exam_path.write_text(exam)
                print("✅")
        
        # Summary
        duration = datetime.now() - start_time
        total_lessons = sum(r['lessons_created'] for r in results)
        
        # PASS 3: VERIFICATION - Count lessons and identify gaps
        print(f"\n🔍 PASS 3: Verification...")
        verification = self._verify_course(output_path)
        
        print("\n" + "=" * 70)
        print(f"✅ GENERATION COMPLETE")
        print(f"📚 {self.course_name}")
        print(f"📁 {output_path}")
        print(f"📝 Lessons: {total_lessons} generated")
        print(f"🔍 Verified: {verification['total_files']} HTML files found")
        print(f"⏱️ Duration: {duration}")
        if verification['missing_modules']:
            print(f"⚠️ Missing modules: {verification['missing_modules']}")
        print("=" * 70)
        
        return {
            'course_name': self.course_name, 
            'lessons': total_lessons, 
            'duration': str(duration), 
            'success': True,
            'verification': verification
        }
    
    def _verify_course(self, output_path: Path) -> Dict:
        """Verify course completeness by counting files"""
        module_counts = {}
        total_files = 0
        missing_modules = []
        
        # Count HTML files in each module folder
        for module_dir in sorted(output_path.glob("Module_*")):
            module_num = int(module_dir.name.split("_")[1])
            html_files = list(module_dir.glob("*.html"))
            count = len(html_files)
            module_counts[module_num] = count
            total_files += count
            
            # Check if module is empty or has fewer than expected lessons
            expected = 4 if module_num == 0 else 8
            if count < expected:
                missing_modules.append(f"M{module_num}({count}/{expected})")
        
        print(f"  📊 Module counts: {dict(sorted(module_counts.items()))}")
        print(f"  📄 Total HTML files: {total_files}")
        
        if missing_modules:
            print(f"  ⚠️ Incomplete: {', '.join(missing_modules)}")
        else:
            print(f"  ✅ All modules complete")
        
        return {
            'total_files': total_files,
            'module_counts': module_counts,
            'missing_modules': missing_modules
        }



# 8-Pixel Launch Catalog
PIXEL_CATALOG = [
    "Narcissistic Abuse Recovery Coach",
    "Christian Life Coach",
    "Life Coach",
    "Grief & Loss Coach",
    "Energy Healing Practitioner",
    "Conscious Parenting Coach",
    "Pet Wellness Coach",
    "LGBTQ+ Affirming Life Coach",
]


async def main():
    if len(sys.argv) < 2:
        print("Usage:")
        print("  python turbo_generator.py 'Course Name'")
        print("  python turbo_generator.py --queue")
        print("\n8-Pixel Courses:")
        for c in PIXEL_CATALOG:
            print(f"  • {c}")
        sys.exit(1)
    
    if '--queue' in sys.argv:
        for course in PIXEL_CATALOG:
            gen = TurboGenerator(course)
            await gen.run()
    else:
        gen = TurboGenerator(sys.argv[1])
        await gen.run()


if __name__ == "__main__":
    asyncio.run(main())
