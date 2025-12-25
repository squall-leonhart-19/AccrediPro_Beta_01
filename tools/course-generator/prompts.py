"""
AccrediPro Course Generator - Premium Quality Prompt Templates
Templates for generating 10/10 quality course content with scientific references
"""

# HTML Template for lessons (no header logo, has references section)
LESSON_HTML_TEMPLATE = '''<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{lesson_title}</title>
    <style>
        * {{ box-sizing: border-box; }}
        body {{ font-family: Georgia, 'Times New Roman', serif; line-height: 1.8; color: #2d2d2d; background: #f8f6f3; margin: 0; padding: 0; }}
        .lesson-container {{ max-width: 860px; margin: 0 auto; padding: 40px 30px; background: #ffffff; min-height: 100vh; }}
        .module-header {{ background: linear-gradient(135deg, #059669 0%, #10B981 100%); padding: 35px; border-radius: 16px; margin-bottom: 30px; }}
        .module-label {{ margin: 0; font-size: 11px; color: rgba(255,255,255,0.75); text-transform: uppercase; letter-spacing: 2.5px; }}
        .lesson-title {{ margin: 10px 0 0 0; font-size: 28px; color: #ffffff; font-weight: 700; }}
        .lesson-meta {{ display: flex; gap: 12px; margin-top: 20px; flex-wrap: wrap; }}
        .meta-item {{ font-size: 12px; color: rgba(255,255,255,0.85); background: rgba(255,255,255,0.1); padding: 5px 12px; border-radius: 4px; }}
        .objectives-box {{ background: #f0fdf4; border: 2px solid #10B981; border-radius: 14px; padding: 30px; margin-bottom: 40px; }}
        .box-label {{ font-weight: 600; color: #059669; margin: 0 0 18px 0; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; }}
        h2 {{ font-size: 24px; color: #059669; margin: 50px 0 20px 0; padding-bottom: 12px; border-bottom: 3px solid #B8860B; display: inline-block; }}
        h3 {{ font-size: 20px; color: #2d2d2d; margin: 30px 0 15px 0; }}
        p {{ font-size: 17px; margin-bottom: 20px; }}
        .highlight {{ background: linear-gradient(180deg, transparent 60%, #FFF59D 60%); padding: 0 4px; font-weight: 500; }}
        .content-list {{ font-size: 17px; margin: 20px 0; padding-left: 24px; }}
        .content-list li {{ margin-bottom: 14px; line-height: 1.7; }}
        .principle-card {{ background: #fafafa; border-left: 5px solid #059669; padding: 24px; margin-bottom: 18px; border-radius: 0 14px 14px 0; }}
        .principle-card .principle-title {{ font-weight: 700; color: #059669; margin: 0 0 10px 0; font-size: 17px; }}
        .principle-card .principle-text {{ margin: 0; font-size: 15px; color: #555; }}
        .case-study {{ background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 14px; padding: 28px; margin: 30px 0; border-left: 5px solid #B8860B; }}
        .case-study .case-title {{ font-weight: 700; color: #92400e; margin: 0 0 15px 0; font-size: 18px; }}
        .case-study p {{ font-size: 15px; margin-bottom: 12px; }}
        .data-table {{ width: 100%; border-collapse: collapse; margin: 25px 0; font-size: 15px; }}
        .data-table th {{ background: #059669; color: white; padding: 12px 15px; text-align: left; }}
        .data-table td {{ padding: 12px 15px; border-bottom: 1px solid #e5e7eb; }}
        .data-table tr:nth-child(even) {{ background: #f9fafb; }}
        .stat-highlight {{ background: #ecfdf5; border: 1px solid #10B981; border-radius: 8px; padding: 15px 20px; margin: 20px 0; font-size: 16px; }}
        .stat-highlight strong {{ color: #059669; font-size: 24px; }}
        .takeaways-box {{ background: #f5f5f5; padding: 22px; margin-top: 35px; border-radius: 8px; }}
        .takeaways-box ul {{ margin: 0; padding-left: 18px; font-size: 15px; }}
        .takeaways-box li {{ margin-bottom: 10px; }}
        .references-box {{ background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin-top: 40px; }}
        .references-box .box-label {{ color: #475569; }}
        .references-box ol {{ margin: 0; padding-left: 20px; font-size: 13px; color: #64748b; }}
        .references-box li {{ margin-bottom: 8px; line-height: 1.5; }}
        .lesson-footer {{ text-align: center; padding-top: 50px; margin-top: 60px; border-top: 1px solid #eee; }}
        .footer-logo {{ max-width: 160px; margin-bottom: 15px; }}
        .lesson-footer .brand {{ color: #059669; font-weight: 600; font-size: 15px; }}
    </style>
</head>
<body>
    <div class="lesson-container">
        <!-- CONTENT GOES HERE -->
        <footer class="lesson-footer">
            <img src="/logoimg/LOGO_ACCREDI.png" alt="AccrediPro" class="footer-logo">
            <p class="brand">AccrediPro {course_name} Certification</p>
            <p class="copyright">© 2024 AccrediPro Academy.</p>
        </footer>
    </div>
</body>
</html>'''


# PREMIUM System instruction for 10/10 content
SYSTEM_INSTRUCTION = """You are an expert course content creator for AccrediPro Academy, producing PREMIUM certification content.

Your content must be EXCEPTIONAL - worthy of a $997+ professional certification. Every lesson should demonstrate expertise and provide genuine value.

CRITICAL QUALITY REQUIREMENTS:

1. SCIENTIFIC REFERENCES (MANDATORY)
   - End EVERY lesson with a "References & Further Reading" section
   - Include 5-8 real, credible references per lesson
   - Use format: Author et al. (Year). "Title." Journal Name.
   - Include a mix of peer-reviewed studies, meta-analyses, and clinical guidelines
   - Make references relevant to the lesson content

2. CASE STUDIES (MANDATORY)
   - Include 1-2 detailed case studies per lesson
   - Format: Client name (fictional), age, presenting symptoms, intervention, outcomes
   - Use the case-study CSS class for styling
   - Show real-world application of concepts

3. SPECIFIC STATISTICS & DATA
   - Use specific numbers, not vague claims
   - Example: "A 2023 meta-analysis of 42 studies (n=8,234) found..."
   - Include percentages, effect sizes, confidence intervals where appropriate
   - Use the stat-highlight CSS class for key statistics

4. COMPARISON TABLES
   - Include at least one data-table where appropriate
   - Compare conditions, symptoms, interventions, or outcomes
   - Use clear headers and organized data

5. STRUCTURE REQUIREMENTS
   - Use the exact HTML template with all CSS classes
   - Include objectives-box with 4-6 learning objectives
   - Use multiple h2 sections to organize (aim for 6-8 sections)
   - Include "Check Your Understanding" with 2-3 questions and reveal buttons
   - End with takeaways-box (4-5 key points)
   - Then references-box with citations
   - Then footer with AccrediPro branding

6. CONTENT DEPTH
   - Target 30-40KB file size (substantial content)
   - Explain mechanisms, not just facts
   - Include practical applications
   - Reference the course methodology where relevant

7. NO NAVIGATION
   - DO NOT include "Next Lesson" or "Continue to" links
   - The LMS handles navigation

8. HIGHLIGHT KEY TERMS
   - Use <span class="highlight">term</span> for important concepts

The content should establish the reader as a knowledgeable practitioner who can confidently work with clients."""


# Prompt for generating course methodology
METHODOLOGY_PROMPT = """Create a unique, memorable methodology acronym for a "{course_name}" certification course.

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

Examples for reference:
- Gut Health: G.U.T.S. (Gut Understanding Through Science)
- Make it memorable, professional, and relevant to {course_name}."""


# Prompt for generating course outline
OUTLINE_PROMPT = """Create a course outline for "{course_name}" certification.

Structure:
- Module 0: Introduction & Career Vision (4 lessons, no quiz)
- Modules 1-13: Core content (8 lessons each, with quiz)
- Module 14: Practice Building & Business (8 lessons, with quiz) - Pricing, marketing, clients
- Module 15: Your Practitioner Journey (8 lessons, with quiz) - CAREER-FOCUSED ENDING

IMPORTANT - Module 0 must follow this career-focused structure:
L1: Welcome to AccrediPro - Your Path to [Certification Name] Mastery
L2: Career Paths & Opportunities (8 specific career paths with income potential)
L3: The Earnings Breakdown (Part-time, Full-time, Scaled practice numbers)
L4: Your First 90 Days Roadmap (Foundation → Launch → Growth phases)

IMPORTANT - Module 15 must follow this structure:
L1: Reflecting on Your Transformation Journey
L2: Building Your Practice Blueprint  
L3: Your First 30 Days as a Certified Practitioner
L4: Pricing & Packaging Your Services for Maximum Value
L5: Finding Your First Clients - Proven Strategies
L6: Done-For-You Accelerator Resources (templates, scripts, materials)
L7: Preparing for Your Certification Exam
L8: Congratulations & Your Next Steps (celebratory, action-oriented)

Methodology: {methodology}

Return ONLY valid JSON (no markdown, no explanation):

{{"course_name": "{course_name}", "total_modules": 16, "modules": [{{"number": 0, "title": "Welcome", "lessons": [{{"number": 1, "title": "Lesson Title"}}], "has_quiz": false}}, {{"number": 1, "title": "Module Title", "lessons": [{{"number": 1, "title": "Lesson 1"}}, {{"number": 2, "title": "Lesson 2"}}], "has_quiz": true}}]}}

Generate all 16 modules (0-15) with appropriate titles and 4-8 lessons each.
Module 0: 4 lessons, no quiz
Modules 1-15: 8 lessons each, has_quiz: true
Make lesson titles specific and descriptive."""


# PREMIUM Prompt for generating a lesson
LESSON_PROMPT = """Generate a PREMIUM QUALITY HTML lesson for:
Course: {course_name}
Module {module_number}: {module_title}
Lesson {lesson_number}: {lesson_title}

Course Methodology: {methodology}

MANDATORY QUALITY REQUIREMENTS:

1. REFERENCES SECTION (REQUIRED)
   End with a references-box containing 5-8 scientific citations:
   <div class="references-box">
       <p class="box-label">📚 References & Further Reading</p>
       <ol>
           <li>Author et al. (Year). "Study Title." Journal Name. DOI/PMID</li>
           ...5-8 real, relevant references
       </ol>
   </div>

2. CASE STUDIES (REQUIRED - include 1-2)
   <div class="case-study">
       <p class="case-title">📋 Case Study: [Client Name], [Age]</p>
       <p><strong>Presenting Concerns:</strong> ...</p>
       <p><strong>Assessment:</strong> ...</p>
       <p><strong>Intervention:</strong> ...</p>
       <p><strong>Outcome:</strong> ...</p>
   </div>

3. STATISTICS (use stat-highlight class)
   <div class="stat-highlight">
       <strong>73%</strong> of participants showed significant improvement...
   </div>

4. COMPARISON TABLE (include where relevant)
   <table class="data-table">
       <tr><th>Factor</th><th>Details</th><th>Implications</th></tr>
       ...
   </table>

5. STRUCTURE
   - objectives-box with 4-6 objectives
   - 6-8 h2 sections with substantial content
   - Check Your Understanding (2-3 questions with reveal buttons)
   - takeaways-box with 4-5 points
   - references-box (MANDATORY)
   - footer with AccrediPro branding

Reference for tone and structure:
{reference_content}

Previous lessons in this module (avoid repetition):
{previous_lessons}

For Module 0 Lesson 1: Include inspiring career potential section (earning $10K-30K/month)
For Module 14 lessons: Focus on practical business building with specific income strategies

TARGET SIZE: 30-40KB (comprehensive, detailed content)

Return ONLY the complete HTML document."""


# Prompt for generating quiz
QUIZ_PROMPT = """Generate a 10-question multiple choice quiz for:
Course: {course_name}
Module {module_number}: {module_title}

The quiz should test understanding of these lessons:
{lesson_summaries}

Format as JSON:
{{
    "moduleId": "module_{module_number:02d}",
    "moduleTitle": "{module_title}",
    "passingScore": 80,
    "questions": [
        {{
            "id": "q{module_number}_1",
            "question": "Question text here?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0,
            "explanation": "Brief explanation of why this is correct"
        }},
        ...10 questions total
    ]
}}

Requirements:
1. Exactly 10 questions
2. Four options per question
3. correctAnswer is 0-indexed (0, 1, 2, or 3)
4. Questions should test key concepts from the module
5. Include practical application questions
6. Vary difficulty (some easy, some challenging)
7. Reference specific statistics or case studies from lessons

Return ONLY valid JSON, no markdown or explanations."""


# Prompt for final exam
FINAL_EXAM_PROMPT = """Generate a comprehensive 20-question final exam for:
Course: {course_name}
Methodology: {methodology}

The exam should cover key concepts from all modules:
{module_summaries}

Format as JSON:
{{
    "examId": "final_exam",
    "examTitle": "{course_name} Certification - Final Exam",
    "passingScore": 80,
    "timeLimit": 60,
    "questions": [
        {{
            "id": "final_1",
            "question": "Question text?",
            "options": ["A", "B", "C", "D"],
            "correctAnswer": 0,
            "explanation": "Explanation"
        }},
        ...20 questions total
    ]
}}

Requirements:
1. Exactly 20 questions covering all major topics
2. Include questions about the methodology
3. Mix of foundational, applied, and advanced questions
4. Test practical knowledge and clinical application
5. Questions should be challenging but fair
6. Reference specific concepts, statistics, and protocols

Return ONLY valid JSON."""


# Career/Earnings content for Module 0 and Module 14
CAREER_EARNINGS_CONTENT = """
=== MODULE 0 CAREER CONTENT - MAKE THIS INSPIRING AND SPECIFIC ===

LESSON 0.1 (Welcome) - Paint the Vision:
- "This certification transforms you from someone interested in wellness to a legitimate, credentialed practitioner"
- Show the journey: Student → Certified → Practitioner → Thriving Business
- Emphasize: AccrediPro certification is recognized and valued in the industry

LESSON 0.2 (Career Paths) - SPECIFIC OPPORTUNITIES:
Include these 8 career paths with realistic descriptions:

1. PRIVATE PRACTICE (1-on-1 Consulting)
   - Work from home or rent clinic space
   - Set your own hours
   - Virtual or in-person sessions
   - Income: $150-500/session, $8,000-20,000/month

2. GROUP PROGRAMS & WORKSHOPS
   - Run 4-12 week group coaching programs
   - 10-30 participants at $500-1,500 each
   - Host workshops and masterclasses
   - Income: $5,000-45,000 per program launch

3. CORPORATE WELLNESS CONSULTING
   - Work with companies on employee wellness
   - Lunch & learns, wellness programs
   - Retainer contracts: $2,000-10,000/month
   - Income: $100K-250K/year for established consultants

4. CONTENT CREATION & EDUCATION
   - Create online courses and digital products
   - YouTube, podcasts, social media
   - Passive income from courses: $1,000-20,000/month
   - Build audience + sell programs

5. PRODUCT FORMULATION & BRAND CREATION
   - Create your own supplement or product line
   - Partner with manufacturers
   - Private label opportunities
   - Income: Highly variable, $10K-500K+/year

6. WRITING & PUBLISHING
   - Write books, ebooks, guides
   - Health blogs and publications
   - Freelance health writing: $0.10-1.00/word
   - Book advances: $5,000-100,000+

7. TEACHING & TRAINING
   - Guest lecturer at wellness schools
   - Train other practitioners
   - Create certification programs
   - Income: $50-500/hour, $100K-200K/year

8. INTEGRATIVE HEALTHCARE TEAMS
   - Work alongside MDs, chiropractors, naturopaths
   - Hospital and clinic positions
   - Referral partnerships
   - Income: $60,000-150,000/year

LESSON 0.3 (Earnings Vision) - DETAILED BREAKDOWN WITH REAL NUMBERS:

PART-TIME PRACTICE (10-15 hours/week):
├── 8-12 clients/month at $150-250/session
├── Monthly income: $1,200-3,000
├── Add 1 small group program: +$2,000-5,000
├── TOTAL: $3,200-8,000/month part-time
└── Perfect for: Stay-at-home parents, career changers, side income

FULL-TIME SOLO PRACTICE (30-40 hours/week):
├── 25-40 clients/month at $200-350/session
├── Monthly income: $5,000-14,000
├── 3-month packages at $1,500-3,000: +$4,500-12,000
├── TOTAL: $9,500-26,000/month
└── Perfect for: Full-time practitioners, clinic owners

SCALED PRACTICE (with team or systems):
├── 1:1 clients: 20-30/month at $300-500 = $6,000-15,000
├── Group programs: 2x per year at $15,000-45,000 = $30,000-90,000/year
├── Digital products: $1,000-5,000/month passive
├── TOTAL: $15,000-40,000/month
└── Perfect for: Entrepreneurs, thought leaders, brand builders

LESSON 0.4 (Your First 90 Days) - CONCRETE ROADMAP:

=== DAYS 1-30: FOUNDATION PHASE ===
Week 1: Complete certification exam, celebrate, download certificate
Week 2: Set up business basics (LLC/sole prop, basic website, booking system)
Week 3: Create your signature offer (what problem do you solve?)
Week 4: Announce to your network, update LinkedIn, tell everyone

=== DAYS 31-60: LAUNCH PHASE ===
Week 5-6: Get first 3-5 clients (friends, family, referrals - discounted)
Week 7-8: Deliver exceptional service, collect testimonials and case studies
Week 8: Refine your process based on real client feedback

=== DAYS 61-90: GROWTH PHASE ===
Week 9-10: Launch social media content strategy (3-5 posts/week)
Week 11: Start building email list with lead magnet
Week 12: Create and launch first group program or package

=== END OF 90 DAYS GOAL ===
- 10-15 paying clients
- Clear signature offer
- 5-10 testimonials
- Active social media presence
- Email list of 100-500 subscribers
- First $5,000-10,000 earned

"This certification pays for itself with your first 2-3 clients. Most practitioners book their first paying client within 2 weeks of certification."

=== FOR MODULE 14 (Business Building) - MORE ADVANCED ===

PRICING YOUR SERVICES:
├── Single sessions: $150-500 (avoid hourly traps)
├── 3-month packages: $2,500-5,000 (best value proposition)
├── 6-month programs: $4,000-8,000 (transformation focus)
├── VIP intensives: $5,000-10,000 (premium clients)
├── Group programs: $500-1,500 per person, 10-30 people
└── Corporate contracts: $2,000-10,000/month retainer

BUSINESS BUILDING STRATEGIES:
- Referral system: Ask every satisfied client for 2 referrals
- Content marketing: Become the go-to expert in your niche
- Email marketing: Nurture leads, launch programs
- Strategic partnerships: Collaborate with complementary practitioners
- Specialization: Niche down to stand out (gut health, hormones, weight loss, etc.)

YEAR 1 ROADMAP TO $100K:
Month 1-3: Get certified, first 10 clients, $3,000-5,000
Month 4-6: Build to 20 clients, first group program, $5,000-10,000/month
Month 7-9: Systematize, raise prices, launch signature program, $10,000-15,000/month
Month 10-12: Scale with groups, digital products, team, $15,000-25,000/month
TOTAL YEAR 1: $80,000-150,000
"""


# Module 15 career ending content - CELEBRATORY and ACTION-ORIENTED
MODULE_15_ENDING_CONTENT = """
MODULE 15 SPECIFIC CONTENT - Make this CELEBRATORY and ACTION-ORIENTED:

For L6 (Done-For-You Accelerator Resources):
- Mention the DFY Accelerator package available in the portal
- Client intake forms and assessment templates
- Session tracking spreadsheets  
- Email scripts for booking consultations
- Social media templates for attracting clients
- Client agreement templates
- Progress tracking worksheets
- Marketing swipe files
- "These resources alone save you 100+ hours of setup"

For L7 (Preparing for Certification Exam):
- Review all key concepts from each module
- Study focus areas
- Practice question strategies
- Exam format: 20 questions, 80% passing score
- Time management tips
- "You've got this - you're ready!"

For L8 (Congratulations & Next Steps):
- CELEBRATORY TONE - "You made it! You are now a certified practitioner!"
- Remind them of the transformation journey
- Earning potential reminder ($10K-30K/month realistic)
- Clear next steps:
  1. Take and pass the certification exam
  2. Download your certificate
  3. Set up your practice (use DFY resources)
  4. Book your first client within 7 days
  5. Join the practitioner community
  6. Optional: Schedule coaching call for personalized guidance
- "Your certification is just the beginning - your practice starts NOW"
- Call to action: "Go take your exam and claim your certificate!"
"""


# Retry prompts for failed lessons
RETRY_PROMPTS = {
    1: "\n\nIMPORTANT: Your previous attempt was missing the references section. You MUST include a references-box with 5-8 scientific citations at the end.",
    2: "\n\nIMPORTANT: Your content was too short. Make it MORE COMPREHENSIVE - aim for 35KB. Add more detail, examples, and a case study.",
    3: "\n\nCRITICAL: Include ALL required sections: objectives-box, case-study, stat-highlight, Check Your Understanding, takeaways-box, references-box, and AccrediPro footer."
}

