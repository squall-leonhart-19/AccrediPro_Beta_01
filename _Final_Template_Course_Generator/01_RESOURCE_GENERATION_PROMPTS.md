# Resource Generation Prompts

> **Universal templates for generating lesson resources across all course niches**

---

## Overview

| Per Lesson | Resources |
|------------|-----------|
| 1 | Client Handout (educational, give to client) |
| 2 | Practical Tool (assessment, tracker, protocol) |

**Total: 140+ resources per 70-lesson course**

---

## PROMPT 1: Client Handout Generator

```markdown
# Generate Client Handout

Read the following lesson content and create a 1-page CLIENT HANDOUT that a health/wellness coach can give to their client.

## CONTEXT:
Course: [COURSE_NAME]
Niche: [e.g., functional medicine, autism coaching, christian coaching, hormone health]
Target Audience: [e.g., women 35+, parents, faith-based practitioners]

## LESSON CONTENT:
[PASTE LESSON CONTENT HERE]

## OUTPUT FORMAT:

**[HANDOUT TITLE]**
*A guide for understanding [topic]*

**What is [Topic]?**
[2-3 simple sentences explaining the concept in layman terms]

**Why This Matters For You**
[3 bullet points on how this affects the client]

**What You Can Do Today**
1. [Action step 1]
2. [Action step 2]
3. [Action step 3]

**Questions to Discuss With Your Practitioner**
- [Question 1]
- [Question 2]

---
*Provided by [Practitioner Name] | Certified [Specialty] Practitioner*
*AccrediPro Standards Institute Verified*

## STYLE GUIDELINES:
- 8th grade reading level
- No jargon (or explain immediately)
- Warm, supportive tone
- Actionable and practical
- Professional but friendly
- Adapt terminology to the specific niche
```

---

## PROMPT 2: Assessment/Intake Form Generator

```markdown
# Generate Client Assessment Form

Read the following lesson content and create a CLIENT ASSESSMENT FORM for intake or follow-up sessions.

## CONTEXT:
Course: [COURSE_NAME]
Niche: [e.g., functional medicine, autism coaching, christian coaching]
Target Audience: [e.g., women 35+, parents, faith-based women]

## LESSON CONTENT:
[PASTE LESSON CONTENT HERE]

## OUTPUT FORMAT:

**[TOPIC] Assessment**
*Complete this form before your session*

**Client Name:** _________________ **Date:** _________

**Section 1: Current Status**
Rate each on a scale of 1-10:
- [ ] [Area 1]: ___
- [ ] [Area 2]: ___
- [ ] [Area 3]: ___
- [ ] [Area 4]: ___
- [ ] [Area 5]: ___

**Section 2: History**
- How long have you experienced [issue]? ________________
- What have you tried? ________________
- What makes it better? ________________
- What makes it worse? ________________

**Section 3: Lifestyle/Context Factors**
[4-5 relevant questions for this niche]

**Section 4: Goals**
What would you like to achieve in the next 30 days?
________________________________________________

**Practitioner Notes:**
________________________________________________

---
*AccrediPro Certified Practitioner Form*

## STYLE GUIDELINES:
- Simple checkboxes where possible
- Space for open-ended answers
- Professional clinical appearance
- Ready to print and use
- Adapt questions to specific niche
```

---

## PROMPT 3: Protocol/Tracking Sheet Generator

```markdown
# Generate Client Protocol/Tracking Sheet

Read the following lesson content and create a PROTOCOL or TRACKING SHEET for clients to implement what they learned.

## CONTEXT:
Course: [COURSE_NAME]
Niche: [e.g., functional medicine, autism coaching, christian coaching]
Target Audience: [e.g., women 35+, parents, faith-based women]

## LESSON CONTENT:
[PASTE LESSON CONTENT HERE]

## OUTPUT FORMAT:

**[TOPIC] Tracker**
*Week of: ____________*

**Daily Tracking:**

| Day | [Action 1] | [Action 2] | [Action 3] | Notes |
|-----|------------|------------|------------|-------|
| Mon | ☐ | ☐ | ☐ | |
| Tue | ☐ | ☐ | ☐ | |
| Wed | ☐ | ☐ | ☐ | |
| Thu | ☐ | ☐ | ☐ | |
| Fri | ☐ | ☐ | ☐ | |
| Sat | ☐ | ☐ | ☐ | |
| Sun | ☐ | ☐ | ☐ | |

**Weekly Reflection:**
- What went well? ________________
- What was challenging? ________________
- Progress rating (1-10): ___
- Changes noticed: ________________

**Next Steps:**
☐ [Step 1]
☐ [Step 2]
☐ [Step 3]

---
*Bring this to your next session*

## STYLE GUIDELINES:
- Printable, checkbox-heavy
- Simple daily tracking
- Weekly reflection section
- Client fills out themselves
```

---

## PROMPT 4: Batch Generation (JSON Output)

```markdown
# Batch Generate Lesson Resources

For each lesson below, generate TWO resources:
1. Client Handout (educational, give to client)
2. Practical Tool (assessment OR tracking sheet OR protocol)

## CONTEXT:
Course: [COURSE_NAME]
Niche: [NICHE]
Target Audience: [AUDIENCE]

## OUTPUT FORMAT (JSON):

{
  "lesson_id": "[LESSON_ID]",
  "lesson_title": "[TITLE]",
  "module": "[MODULE_NAME]",
  "resources": [
    {
      "type": "client_handout",
      "title": "[HANDOUT TITLE]",
      "filename": "[lesson-slug]-handout.pdf",
      "content": "[FULL HANDOUT CONTENT IN MARKDOWN]"
    },
    {
      "type": "assessment_form | protocol_tracker | tracking_sheet",
      "title": "[TOOL TITLE]",
      "filename": "[lesson-slug]-[type].pdf",
      "content": "[FULL TOOL CONTENT IN MARKDOWN]"
    }
  ]
}

## LESSONS TO PROCESS:
[PASTE LESSON LIST WITH CONTENT]
```

---

## Niche Adaptation Examples

| Course | Handout Example | Tool Example |
|--------|-----------------|--------------|
| Functional Medicine | "Understanding Your Gut Health" | Digestive Health Assessment |
| Autism Coach | "Sensory Processing for Parents" | Sensory Sensitivity Tracker |
| Christian Coach | "Finding Purpose Through Faith" | Prayer & Reflection Journal |
| Hormone Health | "What Your Cycle Is Telling You" | Hormone Symptom Tracker |
| Life Coach | "Setting Goals That Stick" | Weekly Goal Progress Sheet |
| Nutrition | "Reading Food Labels 101" | Food & Mood Journal |
