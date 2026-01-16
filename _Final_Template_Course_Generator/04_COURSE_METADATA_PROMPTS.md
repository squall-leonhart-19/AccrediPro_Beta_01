# Course Metadata Generation Prompts

> **Generate SEO, AEO-optimized course titles, descriptions, and metadata**

---

## Overview

| Metadata | Purpose |
|----------|---------|
| Title | Sales page, catalog, SEO |
| Short Description | Course cards, previews |
| Long Description | Sales page, detail page |
| Meta Title | SEO `<title>` tag |
| Meta Description | SEO `<meta>` tag, search snippets |
| Learning Outcomes | Bullet points for sales + AEO |
| Target Audience | Who is this for |
| FAQ | AEO structured data |

---

## PROMPT: Full Course Metadata Generator

```markdown
# Generate Course Metadata

Create comprehensive SEO and AEO-optimized metadata for this course.

## CONTEXT:
Course Name: [COURSE_NAME]
Niche: [e.g., functional medicine, autism coaching, christian coaching]
Target Audience: [e.g., women 35+, parents, healthcare professionals]
Modules: [NUMBER]
Lessons: [NUMBER]
Hours: [APPROXIMATE HOURS]
Certificate Type: [Completion / Certification / Diploma]

## OUTPUT FORMAT (JSON):

{
  "seo": {
    "title": "[55-60 chars, keyword-rich, compelling]",
    "meta_title": "[50-60 chars for <title> tag]",
    "meta_description": "[150-160 chars, includes CTA, keyword-rich]",
    "keywords": ["keyword1", "keyword2", "keyword3", ...]
  },
  
  "content": {
    "headline": "[Main sales page headline - benefit-focused]",
    "subheadline": "[Supporting headline - credibility/outcome]",
    "short_description": "[100-150 chars for course cards]",
    "long_description": "[300-500 words, formatted with paragraphs, for sales page]"
  },
  
  "learning_outcomes": [
    "Understand [skill/concept] and apply it to [context]",
    "Master [technique] for [result]",
    "Develop [capability] that [benefit]",
    "Create [deliverable] for [use case]",
    "Build confidence in [area] to [outcome]",
    "Earn [credential] recognized by [organizations]"
  ],
  
  "target_audience": {
    "primary": "[Main persona description]",
    "secondary": "[Secondary audience]",
    "not_for": "[Who this is NOT for - important for AEO]"
  },
  
  "aeo_faq": [
    {
      "question": "What is [Course Name] certification?",
      "answer": "[2-3 sentence answer optimized for voice search]"
    },
    {
      "question": "How long does it take to complete [Course Name]?",
      "answer": "[Answer with specific timeframe]"
    },
    {
      "question": "Is [Course Name] certification accredited?",
      "answer": "[Answer mentioning ASI, CPD, etc.]"
    },
    {
      "question": "Can I start a business with [Course Name] certification?",
      "answer": "[Answer about practical outcomes]"
    },
    {
      "question": "What career opportunities does [Course Name] provide?",
      "answer": "[Answer about job/practice opportunities]"
    }
  ],
  
  "social_proof": {
    "student_count": "[X,XXX+ students enrolled]",
    "countries": "[XX+ countries]",
    "rating": "[4.X/5 stars]",
    "review_count": "[XXX reviews]"
  },
  
  "pricing_copy": {
    "value_stack_headline": "[What's Included - Value X,XXX]",
    "price_anchor": "[Original price for strikethrough]",
    "sale_price": "[Current offer price]",
    "guarantee": "[Money-back guarantee statement]"
  }
}

## STYLE GUIDELINES:
- SEO: Include primary keyword in title, meta, first 100 words
- AEO: Write FAQ answers as if speaking to voice assistant users
- Benefits > Features (what they GET, not what it IS)
- Use power words: Certified, Proven, Complete, Transform, Master
- Include numbers where possible (14 modules, 50+ hours, etc.)
- For target audience, be specific (not "anyone interested in health")
```

---

## PROMPT: Batch Module Metadata

```markdown
# Generate Module Metadata

Create SEO-optimized titles and descriptions for all modules in a course.

## CONTEXT:
Course: [COURSE_NAME]
Total Modules: [NUMBER]

## OUTPUT FORMAT (JSON Array):

[
  {
    "module_number": 1,
    "title": "[Module title - keyword rich]",
    "description": "[2-3 sentences describing module content]",
    "lessons_count": 5,
    "duration_hours": 3,
    "key_outcomes": [
      "Outcome 1",
      "Outcome 2",
      "Outcome 3"
    ]
  },
  // ... repeat for all modules
]
```

---

## PROMPT: Lesson Titles & Descriptions

```markdown
# Generate Lesson Metadata

Create SEO-optimized titles and descriptions for all lessons in a module.

## CONTEXT:
Course: [COURSE_NAME]
Module: [MODULE_NUMBER] - [MODULE_NAME]
Lessons: [NUMBER]

## OUTPUT FORMAT (JSON Array):

[
  {
    "lesson_number": 1,
    "title": "[Lesson title - specific, keyword-rich]",
    "description": "[1-2 sentences]",
    "duration_minutes": 15,
    "lesson_type": "VIDEO | TEXT | QUIZ",
    "is_free_preview": false
  },
  // ... repeat for all lessons
]
```

---

## Example Output: Functional Medicine Certification

```json
{
  "seo": {
    "title": "Functional Medicine Certification | 14-Module Online Course",
    "meta_title": "Functional Medicine Certification Online | AccrediPro Academy",
    "meta_description": "Become a Certified Functional Medicine Health Coach in 8 weeks. 14 modules, ASI accredited, 50+ CEU hours. Start your practice today.",
    "keywords": ["functional medicine certification", "health coach certification", "online functional medicine course", "CPD accredited"]
  },
  
  "content": {
    "headline": "Become a Certified Functional Medicine Health Coach",
    "subheadline": "The most complete certification for launching your holistic health practice",
    "short_description": "14-module ASI-accredited certification. Master root cause medicine and start your practice in 8 weeks.",
    "long_description": "Transform your passion for health into a thriving career..."
  },
  
  "learning_outcomes": [
    "Master the Functional Medicine Matrix and root cause approach",
    "Conduct comprehensive client health assessments",
    "Create personalized nutrition and lifestyle protocols",
    "Interpret functional lab markers and biomarkers",
    "Launch and grow your functional medicine practice",
    "Earn your ASI-verified Functional Medicine Practitioner credential"
  ],
  
  "aeo_faq": [
    {
      "question": "What is functional medicine certification?",
      "answer": "Functional medicine certification is a professional credential that trains you to address the root causes of chronic disease using personalized nutrition, lifestyle, and evidence-based protocols. Our program is accredited by ASI and provides 50+ CPD hours."
    }
  ]
}
```

---

## AEO (Answer Engine Optimization) Tips

For voice search and AI assistants, optimize for:

| Format | Example |
|--------|---------|
| **Direct answers** | "The certification takes 8-12 weeks to complete." |
| **Featured snippet format** | Lists, tables, numbered steps |
| **Question starters** | What, How, Why, When, Is, Can, Does |
| **Conversational tone** | "Yes, you can start a business with this certification..." |
| **Local intent (if applicable)** | "...available online to students worldwide" |

---

## Schema.org Structured Data

For each course, generate:

```json
{
  "@context": "https://schema.org",
  "@type": "Course",
  "name": "[Course Title]",
  "description": "[Meta Description]",
  "provider": {
    "@type": "Organization",
    "name": "AccrediPro Academy",
    "sameAs": "https://learn.accredipro.academy"
  },
  "educationalCredentialAwarded": "[Certificate Name]",
  "timeRequired": "PT[X]H",
  "hasCourseInstance": {
    "@type": "CourseInstance",
    "courseMode": "online",
    "instructor": {
      "@type": "Person",
      "name": "Coach Sarah"
    }
  }
}
```
