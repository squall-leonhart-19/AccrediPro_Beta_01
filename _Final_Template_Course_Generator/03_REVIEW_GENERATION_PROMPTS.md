# Review Generation Prompts

> **Generate authentic-sounding course reviews for social proof**

---

## Overview

| Per Course | Reviews |
|------------|---------|
| 50-100 | Mixed ratings, varied personas |

**Attach to zombie profiles with realistic timestamps**

---

## PROMPT: Review Generator (Single)

```markdown
# Generate Course Review

Generate a realistic, authentic-sounding course review.

## CONTEXT:
Course: [COURSE_NAME]
Niche: [e.g., functional medicine, autism coaching, christian coaching]
Rating: [4 or 5 stars]
Reviewer Profile: [zombie profile bio - e.g., "45-year-old former nurse from Texas"]

## FOCUS ANGLE (pick one):
- career_change: Left previous job, now thriving
- income_win: Got first clients, made money
- knowledge_depth: Impressed by content quality
- support_community: Coach/community made difference
- constructive: Positive overall with minor critique

## OUTPUT FORMAT:

{
  "rating": [4 or 5],
  "title": "[SHORT TITLE - 5-8 words]",
  "content": "[REVIEW TEXT - 2-4 sentences]",
  "helpful_votes": [random 3-25]
}

## GUIDELINES:
- 2-4 sentences only
- Be specific (mention a module, concept, or result)
- Include 1 minor critique if rating is 4
- Natural language, not hyperbolic
- First person, past tense
- No exclamation marks overload
- Sound like a real person, not marketing
```

---

## PROMPT: Batch Review Generation

```markdown
# Batch Generate Course Reviews

Generate [NUMBER] realistic reviews for this course.

## CONTEXT:
Course: [COURSE_NAME]
Niche: [NICHE]
Number of Reviews: [50-100]

## DISTRIBUTION:
- 5-star: 65%
- 4-star: 25%
- 3-star: 10%

## FOCUS DISTRIBUTION:
- Career change stories: 25%
- Income/client wins: 20%
- Knowledge/content quality: 25%
- Support/community: 20%
- Constructive (with critique): 10%

## OUTPUT FORMAT (JSON ARRAY):

[
  {
    "id": 1,
    "rating": 5,
    "title": "Changed my entire career path",
    "content": "I was a burned-out nurse for 15 years. This certification gave me the knowledge and confidence to start my own practice. Module 5 on gut health alone was worth the investment.",
    "focus": "career_change",
    "days_ago": 45,
    "helpful_votes": 12
  },
  {
    "id": 2,
    "rating": 4,
    "title": "Great content, wish there was more on labs",
    "content": "The clinical protocols are excellent and I use them daily with clients. I would have loved a deeper dive into lab interpretation, but overall this exceeded my expectations.",
    "focus": "constructive",
    "days_ago": 128,
    "helpful_votes": 8
  }
  // ... more reviews
]

## TIMESTAMP RULES:
- days_ago: Random between 14-240
- Spread evenly across time range
- More recent = more 5-star (natural pattern)

## AUTHENTICITY RULES:
- Vary sentence structure
- Mix short and medium reviews
- Some mention specific modules by number
- Some mention Coach Sarah by name
- Include occasional typos or informal language
- No review sounds like the others
```

---

## Example Reviews by Focus

### Career Change (5-star)
> "I spent 20 years in corporate HR feeling unfulfilled. This certification gave me the foundation to pivot into health coaching. Already have 3 paying clients."

### Income Win (5-star)
> "Within 8 weeks of finishing, I landed my first client through word of mouth. The business modules in the Practice Path were exactly what I needed."

### Knowledge Depth (5-star)
> "The clinical depth here rivals programs costing 5x more. Module 7 on hormone health completely changed how I approach female clients."

### Support/Community (5-star)
> "Coach Sarah's feedback on my case studies was invaluable. The community is supportive without being overwhelming. Felt like I had a mentor the whole time."

### Constructive (4-star)
> "Solid program overall. The gut health section is exceptional. I wish the brain health module went a bit deeper, but the foundation is strong."

### Constructive (3-star)
> "Good content for beginners. Some modules felt a bit rushed. Completed it in 4 weeks and learned useful concepts, though I expected more clinical protocols."

---

## Niche-Specific Examples

### Autism Coach Course
> "As a mom of two autistic boys, I thought I knew it all. This course opened my eyes to sensory processing in ways I never understood. Now I help other parents too."

### Christian Coach Course
> "Finally, a program that integrates faith with practical coaching skills. The module on finding purpose through Scripture was transformative for my ministry."

### Hormone Health Course
> "I'm 48 and going through perimenopause. This course not only helped me understand my own body but gave me tools to help other women in my community."

---

## Import Process

1. Generate reviews JSON
2. Match to zombie profiles in database (has_avatar, has_activity)
3. Set `createdAt` based on `days_ago`
4. Insert into `CourseReview` table
5. Link to course and zombie user
