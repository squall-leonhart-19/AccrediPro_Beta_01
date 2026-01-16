# Mini Diploma Lesson Template

This document provides the complete structure and guidelines for creating high-converting mini diploma lessons. Follow this template to ensure consistency, engagement, and maximum conversion across all mini diplomas.

---

## Overview

Each mini diploma consists of **9 lessons** following a specific psychological and educational arc:

| Lesson | Theme | Primary Goal |
|--------|-------|--------------|
| 1 | Introduction & Root Cause | Hook + "Am I qualified?" objection |
| 2 | Core Topic #1 | Deep teaching + "Too complicated" objection |
| 3 | Core Topic #2 | Case study + "No background" objection |
| 4 | Core Topic #3 | Legal clarity + scope of practice |
| 5 | Core Topic #4 | "Too old" objection + age as advantage |
| 6 | Practical Skills | "Can't do this without degree" objection |
| 7 | Application | "Not qualified to create programs" objection |
| 8 | Getting Clients | "Who will pay me?" objection |
| 9 | Income & CTA | Realistic proof + urgency + conversion |

---

## Lesson Structure

Every lesson MUST include these elements in this order:

### 1. Hook (2-4 messages)
Start with personal story or shocking stat that creates emotional connection.

```tsx
{
    id: 1,
    type: 'coach',
    content: `{name}, I want to ask you something personal...`,
},
{
    id: 2,
    type: 'coach',
    content: `[Personal story or relatable scenario]`,
},
```

### 2. Stats/Problem Block
Establish the market opportunity and problem being solved.

```tsx
{
    id: 3,
    type: 'system',
    content: `**The [Topic] Crisis**

- Stat 1 with specific number
- Stat 2 with specific number
- Stat 3 showing scale of problem
- Why conventional approaches fail

This is a MASSIVE, underserved market.`,
    systemStyle: 'stats',
},
```

### 3. Objection Crusher (REQUIRED)
Each lesson addresses a specific objection. This is the most important element.

```tsx
{
    id: 4,
    type: 'coach',
    content: `Now, you might be thinking: "[Specific objection in their words]"`,
},
{
    id: 5,
    type: 'system',
    content: `**"[The Objection as Quote]..."**

Here's the truth: [Reframe]

**What you might think:**
- [Limiting belief 1]
- [Limiting belief 2]
- [Limiting belief 3]

**What's actually true:**
- [Empowering truth 1]
- [Empowering truth 2]
- [Empowering truth 3]

[Graduate quote crushing this specific objection]`,
    systemStyle: 'comparison',
},
```

### 4. First Testimonial (REQUIRED)
Real-feeling testimonial with specific demographics and numbers.

```tsx
{
    id: 6,
    type: 'system',
    content: `**Meet [Name], [Age] - [Former Career]**

"[2-3 sentence setup about their situation before]

[What they were worried about - matching the lesson's objection]

[What actually happened]

My numbers:
- X active clients
- $X/session
- Monthly income: $X,XXX
- Working X hours/week

[Closing quote with emotional impact]"

- [Full Name], [State] | ASI Graduate [Year]`,
    systemStyle: 'testimonial',
},
```

### 5. Core Teaching Content
Educational content specific to the lesson topic.

```tsx
{
    id: 7,
    type: 'coach',
    content: `Let me teach you [topic]. Understanding this will change how you see [domain] forever.`,
},
{
    id: 8,
    type: 'system',
    content: `**[Framework/Concept Name]**

**POINT 1**
- Detail
- Detail
- Why it matters

**POINT 2**
- Detail
- Detail
- Why it matters

**POINT 3**
- Detail
- Detail
- Why it matters

This is what separates [average practitioners] from [successful practitioners].`,
    systemStyle: 'takeaway', // or 'info', 'comparison'
},
```

### 6. Interactive Element (REQUIRED)
User choice OR quiz OR case study - must have engagement.

**Option A: User Choice**
```tsx
{
    id: 9,
    type: 'user-choice',
    content: `Which of these sounds most like you right now?`,
    choices: [
        "Option that most will select",
        "Alternative option",
        "Third option",
    ],
    showReaction: true,
},
```

**Option B: Case Study (for lessons 3, 5, 6, 7)**
```tsx
{
    id: 10,
    type: 'custom-component',
    content: '',
    componentProps: { points: 40 },
    renderComponent: ({ onComplete }) => (
        <CaseStudyChallenge
            caseTitle="[Client Name]'s [Problem]"
            patientInfo="[Name], [Age], [Career], [Situation]"
            symptoms={[
                "Symptom/Issue 1",
                "Symptom/Issue 2",
                "Symptom/Issue 3",
                "Symptom/Issue 4",
                "Symptom/Issue 5",
                "Relevant data point",
            ]}
            question="[Question about what to prioritize/identify]?"
            options={[
                { id: 'a', label: '[Wrong answer]', isCorrect: false, explanation: '[Why wrong]' },
                { id: 'b', label: '[Correct answer]', isCorrect: true, explanation: '[Why right]' },
                { id: 'c', label: '[Wrong answer]', isCorrect: false, explanation: '[Why wrong]' },
                { id: 'd', label: '[Wrong answer]', isCorrect: false, explanation: '[Why wrong]' },
            ]}
            expertExplanation="[2-3 sentence expert explanation of the case and correct approach]"
            incomeHook="[Name] would be a [duration] client. [Pricing breakdown]. That's $X,XXX from ONE client."
            onComplete={(selected, isCorrect) => {
                onComplete();
            }}
        />
    ),
},
```

**Option C: Knowledge Quiz (for lessons 2, 4, 6, 8)**
```tsx
{
    id: 11,
    type: 'custom-component',
    content: '',
    componentProps: { points: 30 },
    renderComponent: ({ onComplete }) => (
        <KnowledgeCheckQuiz
            title="[Topic] Knowledge Check"
            questions={[
                {
                    id: 'q1',
                    question: '[Question 1]?',
                    options: [
                        { id: 'a', label: '[Wrong]', isCorrect: false },
                        { id: 'b', label: '[Correct]', isCorrect: true },
                        { id: 'c', label: '[Wrong]', isCorrect: false },
                        { id: 'd', label: '[Wrong]', isCorrect: false },
                    ],
                },
                // 2-3 questions total
            ]}
            onComplete={(score, total) => {
                onComplete();
            }}
        />
    ),
},
```

### 7. Scope of Practice (REQUIRED for lessons 1-7)
Clear boundaries between coaching and medical practice.

```tsx
{
    id: 12,
    type: 'system',
    content: `**Your Role: [Coach Type], Not Doctor**

What you CAN do:
✓ [Specific action 1]
✓ [Specific action 2]
✓ [Specific action 3]
✓ [Specific action 4]

What doctors do:
- [Medical action 1]
- [Medical action 2]
- [Medical action 3]

**The partnership:**
[How coaching and medical work together]

Doctors don't have [X time]. You do.`,
    systemStyle: 'comparison',
},
```

### 8. Unique Income Hook (REQUIRED - MUST BE DIFFERENT EACH LESSON)
Each lesson needs a UNIQUE income section - never copy-paste.

```tsx
{
    id: 13,
    type: 'system',
    content: `**The [Specialty] Niche: [Unique Hook]**

Why this niche is [profitable/growing/underserved]:

**Market Opportunity:**
- [Specific stat about market size]
- [Specific stat about demand]
- [Specific stat about pricing]

**Typical Pricing for [This Specialty]:**

*[Service 1]*
- [Description]
- $[Price range]

*[Service 2]*
- [Description]
- $[Price range]

*[Package Option]*
- [Description]
- $[Price range]

**Graduate Reality:**
"[Quote from graduate specific to THIS income model]" - [Name], ASI Graduate`,
    systemStyle: 'income-hook',
},
```

### 9. Second Testimonial (REQUIRED)
Different demographic than first testimonial.

```tsx
{
    id: 14,
    type: 'system',
    content: `**Meet [Name], [Age] - [Different Background]**

"[Story emphasizing different angle than first testimonial]

[Specific to lesson topic]

The numbers:
- X clients currently
- $X/session
- Monthly: $X,XXX
- [Unique detail]

[Emotional closing]"

- [Full Name], [State] | ASI Graduate [Year]`,
    systemStyle: 'testimonial',
},
```

### 10. Action Step / Exercise
Something they can do TODAY.

```tsx
{
    id: 15,
    type: 'system',
    content: `**Your [Topic] Action Step**

[What to do TODAY]:

1. **[Step 1]**
   - [Detail]
   - [Detail]

2. **[Step 2]**
   - [Detail]
   - [Detail]

3. **[Step 3]**
   - [Detail]
   - [Detail]

This is EXACTLY what you'll do with clients.`,
    systemStyle: 'exercise',
},
```

### 11. Preview & Close
Bridge to next lesson with curiosity hook.

```tsx
{
    id: 16,
    type: 'coach',
    content: `{name}, you just [accomplishment from this lesson]. [Encouragement].`,
},
{
    id: 17,
    type: 'coach',
    content: `Next up: [NEXT TOPIC IN CAPS]. [One-sentence teaser of why it matters].`,
},
{
    id: 18,
    type: 'system',
    content: `**Coming Up: [Next Lesson Title]**

- [Teaser point 1]
- [Teaser point 2]
- [Teaser point 3]
- [Curiosity hook]

See you in Lesson [X]!`,
    systemStyle: 'info',
},
```

---

## Objection Schedule

Each lesson MUST address its assigned objection:

| Lesson | Primary Objection | How to Handle |
|--------|-------------------|---------------|
| 1 | "Am I qualified without a medical degree?" | Compare coaching vs medical practice, show it's education not diagnosis |
| 2 | "This is too complicated for me" | Show patterns, not science degree needed |
| 3 | "I don't have a science background" | Use simple analogies, show graduates without backgrounds |
| 4 | "Can I legally advise on this?" | Clear legal framework, education vs treatment |
| 5 | "I'm too old to start something new" | Age as credential and competitive advantage |
| 6 | "Can I really interpret labs without being a doctor?" | Education not interpretation, second set of eyes |
| 7 | "Am I qualified to create protocols?" | Lifestyle guidance not medical treatment |
| 8 | "Who would pay ME?" | Reframe value, first client stories |
| 9 | "What if I fail?" | Define real failure as not trying |

---

## Testimonial Guidelines

Each testimonial MUST include:

1. **Name and Age** - Always 40-58 years old (target demographic)
2. **Former Career** - Relatable, non-medical backgrounds
3. **Specific Concern** - Matching the lesson's objection
4. **Timeline** - Month-by-month progression
5. **Real Numbers**:
   - Number of clients (6-15 typically)
   - Session rate ($150-250)
   - Monthly income ($2,500-6,500)
   - Hours worked (12-20/week)
6. **Location** - US state
7. **Graduation Year** - 2023 or 2024

**Testimonial Variety** - Across 9 lessons, use:
- 3-4 complete career changers (no health background)
- 2-3 healthcare workers transitioning
- 2-3 who had personal health journey
- Mix of ages: 44, 46, 48, 49, 51, 52, 53, 55, 56, 58

---

## Income Section Guidelines

**CRITICAL: Each lesson MUST have unique income content**

| Lesson | Income Focus |
|--------|--------------|
| 1 | Root cause premium vs average coach comparison |
| 2 | Gut health = recurring revenue (client journey) |
| 3 | Anti-inflammatory packages ($2,000/12 weeks) |
| 4 | Detox niches (mold, home audit, heavy metals) |
| 5 | Burnout coaching for high-achievers (premium) |
| 6 | Lab review as service tier ($75-250) |
| 7 | Protocol packages vs per-session ($1,500-2,500) |
| 8 | 90-day client acquisition timeline |
| 9 | Range of graduate incomes (part-time to full) |

---

## Technical Implementation

### File Structure
```
src/components/mini-diploma/lessons/[diploma-name]/v2/
├── index.ts                    # Exports all lessons
├── lesson-1-[topic].tsx
├── lesson-2-[topic].tsx
├── lesson-3-[topic].tsx
├── lesson-4-[topic].tsx
├── lesson-5-[topic].tsx
├── lesson-6-[topic].tsx
├── lesson-7-[topic].tsx
├── lesson-8-[topic].tsx
├── lesson-9-[topic].tsx
└── lesson-router.tsx           # Router component
```

### Required Imports
```tsx
"use client";

import { useState } from "react";
import { LessonBaseV2, Message } from "../../shared/lesson-base-v2";
import {
    SelfAssessmentQuiz,
    KnowledgeCheckQuiz,
    CaseStudyChallenge,
    DownloadResource,
    IncomeCalculator,      // Lesson 9 only
    PractitionerScore,     // Lesson 9 only
} from "../../shared/interactive-elements";
```

### Component Props
```tsx
interface LessonProps {
    lessonNumber: number;
    totalLessons?: number;
    firstName?: string;
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
    totalScore?: number;  // Lesson 9 only
}
```

### Message Types
```tsx
type MessageType =
    | 'coach'           // Coach Sarah speaking
    | 'system'          // Information blocks
    | 'user-choice'     // Interactive choice
    | 'custom-component'; // Quiz, case study, etc.
```

### System Styles
```tsx
type SystemStyle =
    | 'stats'        // Statistics/data blocks
    | 'comparison'   // Side-by-side comparisons, objection handling
    | 'testimonial'  // Graduate stories
    | 'takeaway'     // Key frameworks
    | 'info'         // General information
    | 'income-hook'  // Income/pricing sections
    | 'exercise'     // Action steps
    | 'quote';       // Inspirational quotes
```

---

## Quality Checklist

Before finalizing any lesson, verify:

- [ ] Hook is personal and emotionally engaging
- [ ] Stats block establishes market opportunity
- [ ] Objection crusher addresses assigned objection
- [ ] First testimonial matches lesson demographics
- [ ] Core teaching is actionable and clear
- [ ] Interactive element is engaging
- [ ] Scope of practice is clearly defined
- [ ] Income hook is UNIQUE to this lesson
- [ ] Second testimonial has different background
- [ ] Action step is doable TODAY
- [ ] Preview creates curiosity for next lesson
- [ ] All {name} placeholders work correctly
- [ ] No copy-paste content from other lessons

---

## Example: Complete Lesson Structure

See `/src/components/mini-diploma/lessons/functional-medicine/v2/` for fully implemented examples following this template.

---

## Notes for Writers

1. **Voice**: Coach Sarah is warm, empathetic, experienced. She overcame similar doubts.
2. **Tone**: Encouraging but realistic. No hype or false promises.
3. **Numbers**: Always specific and believable ($175/session, not $500)
4. **Timeline**: Always realistic (6 months to sustainable income, not 30 days)
5. **Objections**: Handle passively - don't call attention to selling, just resolve concern
6. **Testimonials**: Should feel like real people with real struggles and wins
