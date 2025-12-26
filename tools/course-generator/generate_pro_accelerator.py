#!/usr/bin/env python3
"""
FM Pro Accelerator Generator - DEPTH MASTERY™
Generates 21 modules × 8 lessons = 168 lessons

Uses predefined curriculum structure (no AI-generated outline)
"""

import asyncio
import json
import re
import os
import aiofiles
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Optional
from dotenv import load_dotenv

# Load configuration from main .env (already in .gitignore)
load_dotenv(Path(__file__).parent.parent.parent / '.env')

# Import from main generator
from core import GeminiGenerator, APIKeyPool

# Get API keys from environment
API_KEYS = [k.strip() for k in os.getenv('GEMINI_API_KEYS', '').split(',') if k.strip()]

GENERATOR_DIR = Path(__file__).parent
OUTPUT_DIR = Path(__file__).parent.parent.parent / "courses" / "fm-pro-accelerator"

# Load sample lesson
def load_sample():
    sample_path = GENERATOR_DIR / "reference" / "Lesson_1.1_Introduction_To_Gut_Health_Microbiome.html"
    if sample_path.exists():
        with open(sample_path, 'r') as f:
            content = f.read()
            print(f"📄 Loaded sample: {sample_path.name} ({len(content)//1024}KB)")
            return content
    return None

SYSTEM_INSTRUCTION = """You are a professional medical education content developer for AccrediPro Academy.
Generate premium HTML lesson content that matches the exact style and structure of the sample provided.
Focus on ADVANCED PRACTITIONER level content - these are students who already completed the base certification.
Make content highly practical, clinical, and actionable. Include specific protocols, case studies, and real-world applications."""

# Complete predefined curriculum
CURRICULUM = {
    "name": "FM Pro Accelerator",
    "methodology": {
        "full_name": "DEPTH MASTERY™",
        "acronym": "Advanced DEPTH",
        "description": "Extension of the DEPTH Method™ for advanced practitioners",
        "framework": "Advanced Clinical + Master Leadership + Practice Building"
    },
    "modules": [
        # ADVANCED TRACK (22-29)
        {
            "number": 22,
            "title": "Complex Case Management",
            "focus": "Master multi-system clients and case stacking",
            "track": "Advanced Clinical DEPTH",
            "lessons": [
                {"number": 1, "title": "Multi-System Client Assessment: Where to Start When Everything Is Connected"},
                {"number": 2, "title": "Case Stacking Mastery: Managing 3+ Conditions Simultaneously"},
                {"number": 3, "title": "The Priority Matrix: Which Root Causes to Address First"},
                {"number": 4, "title": "Red Flags and Scope: When to Refer vs. Manage In-House"},
                {"number": 5, "title": "Advanced SOAP Notes: Documentation for Complex Cases"},
                {"number": 6, "title": "Client Communication: Explaining Complexity Simply"},
                {"number": 7, "title": "Progress Tracking Systems for Multi-Phase Protocols"},
                {"number": 8, "title": "Case Study: The 7-System Client (Real-World Application)"},
            ]
        },
        {
            "number": 23,
            "title": "Advanced Lab Interpretation",
            "focus": "Master comprehensive testing and pattern recognition",
            "track": "Advanced Clinical DEPTH",
            "lessons": [
                {"number": 1, "title": "DUTCH Test Deep Dive: Hormone Metabolites and Detox Pathways"},
                {"number": 2, "title": "GI-MAP Mastery: Advanced Microbiome Pattern Recognition"},
                {"number": 3, "title": "Organic Acids Testing (OAT): Metabolic Pathway Analysis"},
                {"number": 4, "title": "Combining Multiple Lab Results: The Integration Protocol"},
                {"number": 5, "title": "Optimal vs. Normal Ranges: The Functional Interpretation Method"},
                {"number": 6, "title": "Food Sensitivity Testing: IgG, IgE, and Beyond"},
                {"number": 7, "title": "Genetic Testing Translation: MTHFR, COMT, and SNPs in Practice"},
                {"number": 8, "title": "Creating Lab Interpretation Reports for Clients"},
            ]
        },
        {
            "number": 24,
            "title": "Specialty Populations",
            "focus": "Adapt protocols for diverse client needs",
            "track": "Advanced Clinical DEPTH",
            "lessons": [
                {"number": 1, "title": "Pediatric Clients: Nutritional Needs Across Developmental Stages"},
                {"number": 2, "title": "Elderly Clients: Sarcopenia, Polypharmacy, and Age-Related Metabolism"},
                {"number": 3, "title": "Athletes and High Performers: Optimizing Without Overtraining"},
                {"number": 4, "title": "Pregnant and Postpartum: Preconception Through Fourth Trimester"},
                {"number": 5, "title": "Neurodivergent Clients: ADHD, Autism, and Sensory Considerations"},
                {"number": 6, "title": "Cultural Competency: Adapting Recommendations Across Traditions"},
                {"number": 7, "title": "LGBTQ+ Health: Inclusive Practice and Specific Considerations"},
                {"number": 8, "title": "Chronic Pain Populations: The Mind-Body Integration Approach"},
            ]
        },
        {
            "number": 25,
            "title": "Medication-Supplement Interactions",
            "focus": "Navigate drug-nutrient interactions safely",
            "track": "Advanced Clinical DEPTH",
            "lessons": [
                {"number": 1, "title": "Drug-Nutrient Depletions: What Medications Take From the Body"},
                {"number": 2, "title": "Safe Supplement Combinations: Evidence-Based Stacking"},
                {"number": 3, "title": "Medication Transition Protocols: Supporting Clients Through Changes"},
                {"number": 4, "title": "Working with Prescribers: Communication That Gets Results"},
                {"number": 5, "title": "Psychiatric Medications: SSRIs, Benzodiazepines, and Functional Support"},
                {"number": 6, "title": "Hormonal Medications: Birth Control, HRT, and Thyroid Drugs"},
                {"number": 7, "title": "Cardiovascular and Metabolic Medications: Statins, Metformin, and More"},
                {"number": 8, "title": "Creating Safe Supplement Protocols Alongside Medications"},
            ]
        },
        {
            "number": 26,
            "title": "Premium Client Experience",
            "focus": "Deliver concierge-level service that commands premium pricing",
            "track": "Advanced Clinical DEPTH",
            "lessons": [
                {"number": 1, "title": "The Concierge Model: Designing Your Premium Offering"},
                {"number": 2, "title": "VIP Onboarding: First Impressions That Justify Premium Fees"},
                {"number": 3, "title": "White-Glove Service: Touches That Create Raving Fans"},
                {"number": 4, "title": "Premium Pricing Psychology: Why Clients Pay 10x and Feel Great About It"},
                {"number": 5, "title": "Client Communication Cadence: The Right Amount of High-Touch"},
                {"number": 6, "title": "Managing Expectations: Under-Promise, Over-Deliver Systems"},
                {"number": 7, "title": "Handling VIP Problem Clients: When Premium Goes Wrong"},
                {"number": 8, "title": "Building a Waiting List: Scarcity as a Business Model"},
            ]
        },
        {
            "number": 27,
            "title": "MD/Provider Collaboration",
            "focus": "Build referral relationships with medical professionals",
            "track": "Advanced Clinical DEPTH",
            "lessons": [
                {"number": 1, "title": "Speaking Medical Language: Terminology That Earns Respect"},
                {"number": 2, "title": "Referral Letters That Get Read: Templates and Best Practices"},
                {"number": 3, "title": "Co-Management Protocols: Working Alongside Physicians"},
                {"number": 4, "title": "Building Your Medical Referral Network: Step by Step"},
                {"number": 5, "title": "Case Conferences: How to Present Client Cases Professionally"},
                {"number": 6, "title": "Navigating Disagreements: When Your Recommendations Differ"},
                {"number": 7, "title": "Staying in Scope: The Legal and Ethical Boundaries"},
                {"number": 8, "title": "Becoming the Go-To Coach: Making MDs Want to Refer to You"},
            ]
        },
        {
            "number": 28,
            "title": "Advanced Hormone Protocols",
            "focus": "Master complex hormonal cases",
            "track": "Advanced Clinical DEPTH",
            "lessons": [
                {"number": 1, "title": "HRT Support: Optimizing Outcomes for Clients on Hormone Therapy"},
                {"number": 2, "title": "Complex PCOS: Beyond the Basics into Root Cause Resolution"},
                {"number": 3, "title": "Fertility Protocols: The 90-Day Egg and Sperm Quality Intensive"},
                {"number": 4, "title": "The Adrenal-Thyroid-Hormone Axis: Treating the Triangle"},
                {"number": 5, "title": "Estrogen Dominance Deep Dive: Detox Pathways and Interventions"},
                {"number": 6, "title": "Male Hormone Optimization: Testosterone, Cortisol, and Beyond"},
                {"number": 7, "title": "Postpartum Hormone Recovery: The 12-Month Protocol"},
                {"number": 8, "title": "Case Studies: Complex Hormone Cases Resolved"},
            ]
        },
        {
            "number": 29,
            "title": "Chronic & Complex Cases",
            "focus": "Handle the cases others can't",
            "track": "Advanced Clinical DEPTH",
            "lessons": [
                {"number": 1, "title": "Mold Illness: Detection, Detoxification, and Recovery"},
                {"number": 2, "title": "CIRS (Chronic Inflammatory Response Syndrome): The Shoemaker Protocol"},
                {"number": 3, "title": "Post-Viral Syndrome Recovery: Long COVID and Beyond"},
                {"number": 4, "title": "Chronic Lyme: The Functional Approach to Tickborne Illness"},
                {"number": 5, "title": "Chronic Fatigue Syndrome/ME: Mitochondrial and Immune Approaches"},
                {"number": 6, "title": "Multiple Chemical Sensitivity: Environmental Medicine Basics"},
                {"number": 7, "title": "Autoimmune Flare Management: When Things Go Wrong"},
                {"number": 8, "title": "Case Studies: The $10,000 Cases Others Refer Out"},
            ]
        },
        # MASTER TRACK (30-35)
        {
            "number": 30,
            "title": "Expert Case Analysis",
            "focus": "Present cases like a seasoned clinician",
            "track": "Master DEPTH",
            "lessons": [
                {"number": 1, "title": "Case Presentation Fundamentals: The Professional Format"},
                {"number": 2, "title": "Pattern Recognition Mastery: Seeing What Others Miss"},
                {"number": 3, "title": "The Case Conference Methodology: Peer Learning Frameworks"},
                {"number": 4, "title": "Differential Thinking: Ruling In and Ruling Out"},
                {"number": 5, "title": "Building Your Case Library: Documentation for Learning"},
                {"number": 6, "title": "Teaching Through Cases: Educational Case Presentations"},
                {"number": 7, "title": "Complex Case Write-Ups: Publication-Quality Documentation"},
                {"number": 8, "title": "Live Case Analysis: Real-Time Clinical Reasoning"},
            ]
        },
        {
            "number": 31,
            "title": "Thought Leadership Development",
            "focus": "Become a recognized authority in your niche",
            "track": "Master DEPTH",
            "lessons": [
                {"number": 1, "title": "Finding Your Unique Voice: What Only You Can Say"},
                {"number": 2, "title": "Content Strategy for Authority: The 12-Month Plan"},
                {"number": 3, "title": "Building Your Personal Brand: Beyond Just a Logo"},
                {"number": 4, "title": "Creating Signature Frameworks: Your Proprietary Methods"},
                {"number": 5, "title": "Writing for Publication: Blogs, Articles, and Beyond"},
                {"number": 6, "title": "Social Media Thought Leadership: LinkedIn, Instagram, YouTube"},
                {"number": 7, "title": "Speaking Opportunities: Getting on Stages and Podcasts"},
                {"number": 8, "title": "From Practitioner to Authority: The Transition Journey"},
            ]
        },
        {
            "number": 32,
            "title": "Media & Visibility Training",
            "focus": "Get featured and become the go-to expert",
            "track": "Master DEPTH",
            "lessons": [
                {"number": 1, "title": "Podcast Mastery: Being an Exceptional Guest"},
                {"number": 2, "title": "Video Confidence: On-Camera Presence and Delivery"},
                {"number": 3, "title": "Getting Featured in Media: The Pitch Process"},
                {"number": 4, "title": "Building Your Press Kit: Materials That Open Doors"},
                {"number": 5, "title": "Interview Skills: Answers That Get Shared"},
                {"number": 6, "title": "Handling Controversy: Navigating Difficult Questions"},
                {"number": 7, "title": "Local Media Opportunities: TV, Radio, and Print"},
                {"number": 8, "title": "Building Media Relationships: The Long Game"},
            ]
        },
        {
            "number": 33,
            "title": "Teaching & Course Creation",
            "focus": "Monetize your knowledge through education",
            "track": "Master DEPTH",
            "lessons": [
                {"number": 1, "title": "Adult Learning Principles: How Grown-Ups Actually Learn"},
                {"number": 2, "title": "Curriculum Design: From Expertise to Structured Learning"},
                {"number": 3, "title": "Creating Your First Online Course: The 8-Week Blueprint"},
                {"number": 4, "title": "Live Workshop Facilitation: In-Person and Virtual"},
                {"number": 5, "title": "Pricing Educational Products: What the Market Will Bear"},
                {"number": 6, "title": "Launch Strategies: How to Sell Your Course"},
                {"number": 7, "title": "Evergreen Education: Courses That Sell While You Sleep"},
                {"number": 8, "title": "Building a Course Empire: Multiple Offerings Strategy"},
            ]
        },
        {
            "number": 34,
            "title": "Mentoring Practitioners",
            "focus": "Develop the next generation of coaches",
            "track": "Master DEPTH",
            "lessons": [
                {"number": 1, "title": "The Mentor Mindset: From Practitioner to Guide"},
                {"number": 2, "title": "Supervising New Practitioners: Effective Oversight"},
                {"number": 3, "title": "Giving Feedback That Lands: The Art of Developmental Critique"},
                {"number": 4, "title": "Building a Mentorship Practice: Business Model Options"},
                {"number": 5, "title": "Group Mentorship: Mastermind and Cohort Models"},
                {"number": 6, "title": "Clinical Supervision: Supporting Cases in Real Time"},
                {"number": 7, "title": "Developing Practitioner Confidence: From Uncertain to Expert"},
                {"number": 8, "title": "Creating a Mentorship Legacy: Your Lineage of Practitioners"},
            ]
        },
        {
            "number": 35,
            "title": "Master Practitioner Capstone",
            "focus": "Demonstrate mastery and map your future",
            "track": "Master DEPTH",
            "lessons": [
                {"number": 1, "title": "Advanced Case Presentation: Your Signature Case"},
                {"number": 2, "title": "Original Protocol Development: Creating Something New"},
                {"number": 3, "title": "Building Your Professional Portfolio: Evidence of Excellence"},
                {"number": 4, "title": "Career Mapping: Where Do You Want to Be in 5 Years?"},
                {"number": 5, "title": "Specialty Certification Pathways: What's Next"},
                {"number": 6, "title": "The Master Practitioner Identity: Embodying Expertise"},
                {"number": 7, "title": "Giving Back: Contributing to the Profession"},
                {"number": 8, "title": "Your Master Practitioner Declaration: Claiming Your Authority"},
            ]
        },
        # PRACTICE & INCOME PATH (36-42)
        {
            "number": 36,
            "title": "Practice Setup & Branding",
            "focus": "Build a practice that attracts perfect clients",
            "track": "DEPTH Practice Path",
            "lessons": [
                {"number": 1, "title": "Defining Your Ideal Client Avatar: Beyond Demographics"},
                {"number": 2, "title": "Positioning Your Practice: What Makes You Different"},
                {"number": 3, "title": "Visual Branding Basics: Logo, Colors, and Consistency"},
                {"number": 4, "title": "Building Your Online Presence: Website Essentials"},
                {"number": 5, "title": "Professional Photography and Imagery: Looking the Part"},
                {"number": 6, "title": "Creating Your Origin Story: Why You Do This Work"},
                {"number": 7, "title": "Naming and Taglines: Words That Attract"},
                {"number": 8, "title": "Brand Voice: How You Sound Across All Channels"},
            ]
        },
        {
            "number": 37,
            "title": "Ethical Client Acquisition",
            "focus": "Fill your practice without feeling salesy",
            "track": "DEPTH Practice Path",
            "lessons": [
                {"number": 1, "title": "Referral-First Marketing: The Most Powerful Client Source"},
                {"number": 2, "title": "Organic Social Media: Content That Attracts Without Algorithms"},
                {"number": 3, "title": "Content Marketing: Blogs, Videos, and Podcasts That Convert"},
                {"number": 4, "title": "Email List Building: Your Most Valuable Marketing Asset"},
                {"number": 5, "title": "Local Networking: Building Community Presence"},
                {"number": 6, "title": "Speaking for Leads: Talks That Fill Your Calendar"},
                {"number": 7, "title": "Partnership Marketing: Collaborative Client Generation"},
                {"number": 8, "title": "Lead Magnets That Work: Free Resources That Attract Buyers"},
            ]
        },
        {
            "number": 38,
            "title": "Sales Conversations",
            "focus": "Convert inquiries to committed clients",
            "track": "DEPTH Practice Path",
            "lessons": [
                {"number": 1, "title": "The Discovery Call Framework: Structure That Works"},
                {"number": 2, "title": "Qualifying Clients: Who Should (and Shouldn't) Work With You"},
                {"number": 3, "title": "Handling Objections Gracefully: When They Say I Need to Think"},
                {"number": 4, "title": "Closing Without Pressure: Ethical Invitation Techniques"},
                {"number": 5, "title": "Pricing Conversations: Stating Your Fee with Confidence"},
                {"number": 6, "title": "The Follow-Up System: After the Call"},
                {"number": 7, "title": "Enrollment Psychology: What Makes People Say Yes"},
                {"number": 8, "title": "Sales Roleplay: Practicing Until It's Natural"},
            ]
        },
        {
            "number": 39,
            "title": "Client Retention Systems",
            "focus": "Keep clients longer and turn them into advocates",
            "track": "DEPTH Practice Path",
            "lessons": [
                {"number": 1, "title": "Client Journey Mapping: From Inquiry to Raving Fan"},
                {"number": 2, "title": "Onboarding Excellence: The First 30 Days"},
                {"number": 3, "title": "Progress Tracking: Making Results Visible"},
                {"number": 4, "title": "Milestone Celebrations: Acknowledging Wins"},
                {"number": 5, "title": "Re-Enrollment Conversations: Extending the Relationship"},
                {"number": 6, "title": "Referral Systems: Turning Clients into Client-Generators"},
                {"number": 7, "title": "Client Reactivation: Bringing Back Past Clients"},
                {"number": 8, "title": "Building a Client Community: Beyond 1:1 Work"},
            ]
        },
        {
            "number": 40,
            "title": "Pricing & Packages",
            "focus": "Price for profit and create irresistible offers",
            "track": "DEPTH Practice Path",
            "lessons": [
                {"number": 1, "title": "Pricing Psychology: Why People Pay What They Pay"},
                {"number": 2, "title": "Setting Your Rate: The $150+/Hour Foundation"},
                {"number": 3, "title": "Creating Packages: Bundling for Value and Commitment"},
                {"number": 4, "title": "The Good-Better-Best Model: Tiered Pricing Strategy"},
                {"number": 5, "title": "Payment Plans: Making Premium Accessible"},
                {"number": 6, "title": "Raising Your Prices: When and How"},
                {"number": 7, "title": "Value Communication: Justifying Premium Fees"},
                {"number": 8, "title": "Profit Margin Analysis: What You Actually Keep"},
            ]
        },
        {
            "number": 41,
            "title": "Systems & Automation",
            "focus": "Build a practice that runs smoothly without you",
            "track": "DEPTH Practice Path",
            "lessons": [
                {"number": 1, "title": "CRM Setup: Managing Clients and Leads"},
                {"number": 2, "title": "Scheduling Systems: Calendly and Beyond"},
                {"number": 3, "title": "Email Automation: Sequences That Nurture"},
                {"number": 4, "title": "Client Portal Setup: Professional Delivery Systems"},
                {"number": 5, "title": "Standard Operating Procedures: Documenting Everything"},
                {"number": 6, "title": "Hiring Your First Support: VA and Admin Help"},
                {"number": 7, "title": "Financial Systems: Invoicing, Bookkeeping, and Taxes"},
                {"number": 8, "title": "Building for Scale: From Solo to Team Practice"},
            ]
        },
        {
            "number": 42,
            "title": "Income Mastery",
            "focus": "The concrete roadmap to $10K-$20K/month",
            "track": "DEPTH Practice Path",
            "lessons": [
                {"number": 1, "title": "The Health Coach Income Blueprint: How Top Earners Structure Their Business"},
                {"number": 2, "title": "5 Revenue Streams for Health Coaches: Diversify Your Income"},
                {"number": 3, "title": "Day-by-Day Income Building: Your First 90 Days to Paying Clients"},
                {"number": 4, "title": "Scaling to $5K/Month: The Foundation Phase (3-4 Clients)"},
                {"number": 5, "title": "Scaling to $10K/Month: The Growth Phase (8-10 Clients)"},
                {"number": 6, "title": "Scaling to $20K+/Month: Premium Packages & Passive Income"},
                {"number": 7, "title": "Income Case Studies: 12 Real Coach Earnings Breakdowns"},
                {"number": 8, "title": "Your Personalized Income Action Plan: 12-Month Roadmap"},
            ]
        },
    ]
}


class ProAcceleratorGenerator:
    """Generate FM Pro Accelerator content using predefined curriculum"""
    
    def __init__(self):
        self.key_pool = APIKeyPool(API_KEYS)
        self.generator = GeminiGenerator(self.key_pool)
        self.full_sample = load_sample()
        self.parallel_modules = 4  # Conservative parallelism
        print(f"🔑 Loaded {len(API_KEYS)} API keys")
        
    def _get_lesson_filename(self, module_num: int, lesson_num: int, title: str) -> str:
        """Generate filename for lesson"""
        # Clean title for filename
        clean_title = re.sub(r'[^\w\s-]', '', title)
        clean_title = re.sub(r'\s+', '_', clean_title)
        clean_title = clean_title[:50]  # Limit length
        return f"Lesson_{module_num}.{lesson_num}_{clean_title}.html"
    
    async def generate_lesson(self, module: Dict, lesson: Dict) -> Optional[str]:
        """Generate a single lesson"""
        module_num = module['number']
        lesson_num = lesson['number']
        
        prompt = f"""Generate a PREMIUM QUALITY HTML lesson for:

Course: FM Pro Accelerator - DEPTH MASTERY™
Track: {module['track']}
Module {module_num}: {module['title']}
Module Focus: {module['focus']}
Lesson {lesson_num}: {lesson['title']}

CRITICAL: This is ADVANCED PRACTITIONER content for students who already completed the base certification.
Content should be:
- Highly clinical and practical
- Include specific protocols, dosages where appropriate (within scope)
- Real case studies and examples
- Actionable frameworks they can implement immediately
- Reference research and evidence where relevant

IMPORTANT: Follow the EXACT structure of this sample lesson. Copy the HTML/CSS structure exactly, only change the text content:

=== SAMPLE LESSON (COPY THIS STRUCTURE EXACTLY) ===
{self.full_sample[:25000] if self.full_sample else "Use standard AccrediPro lesson format"}
=== END SAMPLE ===

Requirements:
1. Use the EXACT HTML structure from the sample above
2. Include all CSS styles from the sample
3. Include objectives-box, content sections, Check Your Understanding, takeaways
4. Target 28-35KB of content (DETAILED content)
5. NO navigation CTAs (Next Lesson, Continue, etc.)
6. Include AccrediPro branding in footer
7. Update module label to show "Pro Accelerator - {module['track']}"

Return ONLY the complete HTML document."""

        result = await self.generator.generate(prompt, SYSTEM_INSTRUCTION)
        
        if result['success']:
            html = result['text']
            # Validate HTML
            if '</html>' in html.lower() and len(html) > 15000:
                return html
        
        return None
    
    async def generate_quiz(self, module: Dict) -> Optional[str]:
        """Generate module quiz"""
        prompt = f"""Generate a comprehensive quiz HTML file for:

Course: FM Pro Accelerator - DEPTH MASTERY™
Track: {module['track']}
Module {module['number']}: {module['title']}

This quiz should:
1. Cover advanced concepts from all 8 lessons
2. Test practical application, not just memorization
3. Include case-based scenarios
4. Match the AccrediPro quiz styling
5. Include 10 questions with explanations

Return ONLY the complete HTML document."""

        result = await self.generator.generate(prompt, SYSTEM_INSTRUCTION)
        if result['success']:
            return result['text']
        return None
    
    async def generate_module(self, module: Dict) -> Dict:
        """Generate all content for a module"""
        module_num = module['number']
        module_dir = OUTPUT_DIR / f"Module_{module_num:02d}"
        module_dir.mkdir(parents=True, exist_ok=True)
        
        results = {"lessons": 0, "quiz": False}
        
        print(f"\n📦 Module {module_num}: {module['title']}")
        
        # Generate lessons
        for lesson in module['lessons']:
            lesson_num = lesson['number']
            filename = self._get_lesson_filename(module_num, lesson_num, lesson['title'])
            filepath = module_dir / filename
            
            # Skip if exists
            if filepath.exists():
                print(f"  ⏭️ M{module_num}.L{lesson_num}: Already exists")
                results["lessons"] += 1
                continue
            
            print(f"  📝 M{module_num}.L{lesson_num}: {lesson['title'][:40]}...", end=" ")
            
            html = await self.generate_lesson(module, lesson)
            if html:
                async with aiofiles.open(filepath, 'w') as f:
                    await f.write(html)
                print(f"✅ ({len(html)//1024}KB)")
                results["lessons"] += 1
            else:
                print("❌")
        
        # Generate quiz
        quiz_path = module_dir / "Quiz.html"
        if not quiz_path.exists():
            print(f"  📋 M{module_num} Quiz...", end=" ")
            quiz_html = await self.generate_quiz(module)
            if quiz_html:
                async with aiofiles.open(quiz_path, 'w') as f:
                    await f.write(quiz_html)
                print("✅")
                results["quiz"] = True
            else:
                print("❌")
        else:
            results["quiz"] = True
        
        return results
    
    async def generate_final_exam(self) -> bool:
        """Generate final exam"""
        exam_dir = OUTPUT_DIR / "Final_Exam"
        exam_dir.mkdir(parents=True, exist_ok=True)
        exam_path = exam_dir / "Final_Exam.html"
        
        if exam_path.exists():
            print("⏭️ Final exam already exists")
            return True
        
        print("\n🎓 Generating Final Exam...")
        
        prompt = """Generate a comprehensive final exam for FM Pro Accelerator - DEPTH MASTERY™.

This exam should:
1. Cover all 21 modules across 3 tracks
2. Test advanced clinical reasoning
3. Include complex case-based scenarios
4. Test business and practice building knowledge
5. Include 30 questions total (multiple choice and short answer)
6. Match AccrediPro styling

Return ONLY the complete HTML document."""

        result = await self.generator.generate(prompt, SYSTEM_INSTRUCTION)
        if result['success']:
            async with aiofiles.open(exam_path, 'w') as f:
                await f.write(result['text'])
            print("✅ Final exam generated")
            return True
        print("❌ Failed to generate final exam")
        return False
    
    async def run(self):
        """Main generation process"""
        print(f"\n{'='*60}")
        print(f"🚀 FM Pro Accelerator Generator - DEPTH MASTERY™")
        print(f"📚 21 Modules × 8 Lessons = 168 Lessons")
        print(f"🔑 API Keys: {len(self.key_pool.keys)}")
        print(f"⏰ {datetime.now().strftime('%H:%M:%S')}")
        print(f"{'='*60}")
        
        OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
        
        start_time = datetime.now()
        total_lessons = 0
        
        # Generate modules in batches
        modules = CURRICULUM["modules"]
        batch_size = self.parallel_modules
        
        for i in range(0, len(modules), batch_size):
            batch = modules[i:i+batch_size]
            batch_num = (i // batch_size) + 1
            total_batches = (len(modules) + batch_size - 1) // batch_size
            
            print(f"\n🔄 Batch {batch_num}/{total_batches} ({len(batch)} modules)...")
            
            tasks = [self.generate_module(m) for m in batch]
            results = await asyncio.gather(*tasks)
            
            for r in results:
                total_lessons += r["lessons"]
        
        # Generate final exam
        await self.generate_final_exam()
        
        duration = datetime.now() - start_time
        
        print(f"\n{'='*60}")
        print(f"✅ GENERATION COMPLETE")
        print(f"📚 Course: FM Pro Accelerator")
        print(f"📁 Output: {OUTPUT_DIR}")
        print(f"📝 Lessons Created: {total_lessons}")
        print(f"⏱️ Duration: {duration}")
        print(f"{'='*60}")


async def main():
    generator = ProAcceleratorGenerator()
    await generator.run()


if __name__ == "__main__":
    asyncio.run(main())
