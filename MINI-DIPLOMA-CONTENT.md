# Mini Diploma Content Generation Guide

> For use with Claude Code / Ralph workflow loops.
> Read this file before generating or editing any mini diploma lesson or exam content.

---

## Architecture Overview

```
User visits /portal/{slug}/lesson/{id}
    |
    v
Lesson Page Route: src/app/(lead)/portal/[slug]/lesson/[id]/page.tsx
    |
    +-- FM + fallback niches --> ClassicFunctionalMedicineLessonRouter (TSX)
    |       Files: src/components/mini-diploma/lessons/functional-medicine/classic/
    |       lesson-1-foundation.tsx, lesson-2-depth-method.tsx, lesson-3-first-clients.tsx
    |
    +-- 7 dynamic niches --> DynamicLessonRouter (JSON)
            Files: src/components/mini-diploma/lessons/content/{slug}.json
            Router: src/components/mini-diploma/lessons/shared/dynamic-lesson-router.tsx

Both paths feed into:
    ClassicLessonBase (src/components/mini-diploma/lessons/shared/classic-lesson-base.tsx)
    This is the RENDER ENGINE. Do NOT edit it for content changes.
```

### Exam Flow

```
User visits /portal/{slug}/exam
    |
    v
Exam Page Route: src/app/(lead)/portal/[slug]/exam/page.tsx
    |
    +-- Loads exam config from JSON: src/components/mini-diploma/exams/content/{slug}.json
    +-- Renders: DynamicExamComponent (src/components/mini-diploma/dynamic-exam-component.tsx)
    |
    +-- FM also has: src/lib/fm-exam-questions.ts (used by fm-exam-component.tsx)
```

---

## Content Files Map

### Lesson Content

| Niche | Type | File |
|-------|------|------|
| functional-medicine | TSX (classic) | `lessons/functional-medicine/classic/lesson-{1,2,3}-*.tsx` |
| spiritual-healing | JSON | `lessons/content/spiritual-healing.json` |
| energy-healing | JSON | `lessons/content/energy-healing.json` |
| christian-coaching | JSON | `lessons/content/christian-coaching.json` |
| gut-health | JSON | `lessons/content/gut-health.json` |
| reiki-healing | JSON | `lessons/content/reiki-healing.json` |
| adhd-coaching | JSON | `lessons/content/adhd-coaching.json` |
| pet-nutrition | JSON | `lessons/content/pet-nutrition.json` |

### Exam Content

| Niche | File |
|-------|------|
| All 13 niches | `exams/content/{slug}.json` |
| FM (TypeScript) | `src/lib/fm-exam-questions.ts` |

> All paths relative to `src/components/mini-diploma/`

---

## Curriculum Structure (All Niches)

Every mini diploma has exactly **3 lessons** + **1 final exam (5 questions)**:

| Lesson | Topic | Purpose |
|--------|-------|---------|
| 1 | Foundation | What is this field, why it matters, scope of practice, 5 root causes |
| 2 | The Method/Framework | D.E.P.T.H. Method (or niche-specific framework), how to apply it |
| 3 | Getting First Clients | Warm Market Strategy, pricing packages, scope reminders |
| Exam | 5 multiple-choice questions | 1 per core concept, everyone passes (score 95-100) |

---

## Section Types Reference

The `ClassicLessonBase` render engine supports these `LessonSection` types.
Use these when building lesson content:

### Basic Content

| Type | Purpose | Required Fields |
|------|---------|-----------------|
| `intro` | Sarah's personal opening message. 1 per lesson. | `content` (use `{name}` for personalization) |
| `heading` | Section header. Also triggers a new **progressive reveal step**. | `content` |
| `text` | Body paragraph. | `content` (use `**bold**` for yellow highlights, `$amount` for green) |
| `list` | Numbered bullet list. | `content` (optional title), `items[]` |
| `quote` | Blockquote with left amber border. | `content` |

### Rich Content

| Type | Purpose | Required Fields |
|------|---------|-----------------|
| `callout` | Colored alert box with icon. | `content`, `style`: `'info'` / `'warning'` / `'success'` / `'tip'` |
| `key-point` | Amber-bordered highlight strip. | `content` |
| `example` | Gray card labeled "Real-World Example". | `content` |
| `definition` | Term definition card. | `content`, `term` (optional label) |
| `framework` | Step-by-step method card (dark header + steps). | `content`, `framework: { name, steps: [{ letter, title, description }] }` |
| `before-after` | Two-column comparison (red vs green). | `before: { title, items[] }`, `after: { title, items[] }` |

### Interactive (Conversion Boosters)

| Type | Purpose | Required Fields |
|------|---------|-----------------|
| `checkpoint` | Inline quiz (cream/panna box, confetti on correct). | `checkpoint: { question, options: [{ label, isCorrect }], successMessage? }` |
| `reveal-card` | Teaser that expands on click (curiosity gap). | `revealCard: { teaser, content }` |
| `micro-commitment` | Yes/no prompt (engagement reinforcement). | `content`, `commitmentOptions: { positive, neutral }` |
| `income-calculator` | Slider-based income estimator. | `content` (label), `calculator: { avgPackagePrice, maxClients }` |

### Deprecated (renders nothing)

| Type | Note |
|------|------|
| `quiz` | Legacy. Use `checkpoint` instead. Renders null. |

---

## How to Write a Lesson (TSX — FM Style)

### File Template

```typescript
"use client";

import { ClassicLessonBase, LessonSection } from "../../shared/classic-lesson-base";

interface LessonProps {
    lessonNumber: number;
    totalLessons?: number;
    firstName?: string;
    onComplete?: () => void;
    onNext?: () => void;
    isCompleted?: boolean;
}

export function ClassicLesson{PascalName}({
    lessonNumber,
    totalLessons = 3,
    firstName = "friend",
    onComplete,
    onNext,
    isCompleted,
}: LessonProps) {
    const sections: LessonSection[] = [
        // --- SARAH'S INTRO ---
        {
            type: 'intro',
            content: `Hey {name}, welcome to lesson ${lessonNumber}...`,
        },

        // --- SECTION: (heading triggers new progressive reveal step) ---
        {
            type: 'heading',
            content: 'Section Title Here',
        },
        {
            type: 'text',
            content: `Body text here. Use **bold keywords** for yellow highlights and $5,000 for green money highlights.`,
        },
        {
            type: 'list',
            content: '',
            items: [
                'First point with **key term** highlighted',
                'Second point',
                'Third point',
            ],
        },

        // --- CHECKPOINT (after teaching a concept) ---
        {
            type: 'checkpoint',
            content: '',
            checkpoint: {
                question: 'What does X primarily focus on?',
                options: [
                    { label: 'Wrong answer A', isCorrect: false },
                    { label: 'Correct answer', isCorrect: true },
                    { label: 'Wrong answer C', isCorrect: false },
                ],
                successMessage: 'Yes! Brief reinforcement here.',
            },
        },

        // --- REVEAL CARD (case study / success story) ---
        {
            type: 'reveal-card',
            content: '',
            revealCard: {
                teaser: 'See how Maria transformed her practice →',
                content: 'Maria was a nurse making $52K/year. After getting certified, she signed 4 clients in her first month...',
            },
        },

        // --- MICRO COMMITMENT ---
        {
            type: 'micro-commitment',
            content: 'Can you see yourself doing this?',
            commitmentOptions: {
                positive: 'Yes, I can see it',
                neutral: 'Show me how',
            },
        },

        // --- INCOME CALCULATOR (lesson 3 only) ---
        {
            type: 'income-calculator',
            content: 'See what your monthly income could look like:',
            calculator: {
                avgPackagePrice: 350,
                maxClients: 30,
            },
        },
    ];

    const keyTakeaways = [
        'First key takeaway',
        'Second key takeaway',
        'Third key takeaway',
    ];

    return (
        <ClassicLessonBase
            lessonNumber={lessonNumber}
            lessonTitle="Lesson Title"
            lessonSubtitle="One-line subtitle"
            totalLessons={totalLessons}
            sections={sections}
            keyTakeaways={keyTakeaways}
            onComplete={onComplete}
            onNext={onNext}
            isCompleted={isCompleted}
            firstName={firstName}
            niche="niche-slug"
            nicheLabel="Niche Display Name"
            baseUrl="/portal/niche-slug"
        />
    );
}
```

---

## How to Write a Lesson (JSON — Dynamic Niches)

### File Template

```json
{
    "niche": "niche-slug",
    "nicheLabel": "Niche Display Name Certification",
    "baseUrl": "/portal/niche-slug",
    "courseSlug": "niche-slug-complete-certification",
    "lessons": [
        {
            "id": 1,
            "title": "Lesson 1 Title",
            "subtitle": "One-line subtitle",
            "readingTime": "8 min",
            "sections": [
                { "type": "intro", "content": "Hey {name}! Welcome..." },
                { "type": "heading", "content": "Section Title" },
                { "type": "text", "content": "Body text with **bold** and $amounts." },
                { "type": "list", "content": "", "items": ["Item 1", "Item 2"] },
                { "type": "callout", "content": "Important note here.", "style": "info" },
                {
                    "type": "checkpoint",
                    "content": "",
                    "checkpoint": {
                        "question": "Question text?",
                        "options": [
                            { "label": "Wrong", "isCorrect": false },
                            { "label": "Correct", "isCorrect": true },
                            { "label": "Wrong", "isCorrect": false }
                        ],
                        "successMessage": "Reinforcement text."
                    }
                }
            ],
            "keyTakeaways": [
                "Takeaway 1",
                "Takeaway 2",
                "Takeaway 3"
            ]
        },
        {
            "id": 2,
            "title": "Lesson 2 Title",
            "subtitle": "...",
            "readingTime": "10 min",
            "sections": [],
            "keyTakeaways": []
        },
        {
            "id": 3,
            "title": "Lesson 3 Title",
            "subtitle": "...",
            "readingTime": "8 min",
            "sections": [],
            "keyTakeaways": []
        }
    ]
}
```

> JSON files go in: `src/components/mini-diploma/lessons/content/{slug}.json`
> Then register the import in `dynamic-lesson-router.tsx` in the `LESSON_CONTENT` map.

---

## How to Write Exam Questions

### File: `src/components/mini-diploma/exams/content/{slug}.json`

```json
{
    "nichePrefix": "XX",
    "nicheLabel": "Niche Name Mini Diploma",
    "nicheDisplayName": "Certified Niche Specialist",
    "examCategory": "niche-slug",
    "passScore": 80,
    "scholarshipScore": 95,
    "hasMasterclass": true,
    "testimonials": [
        {
            "quote": "Short testimonial about the exam experience.",
            "name": "First L.",
            "location": "State"
        },
        {
            "quote": "Another testimonial.",
            "name": "Name L.",
            "location": "State"
        }
    ],
    "questions": [
        {
            "id": 1,
            "question": "Question text?",
            "lessonRef": 1,
            "options": [
                { "id": "a", "text": "Wrong answer" },
                { "id": "b", "text": "Correct answer" },
                { "id": "c", "text": "Wrong answer" },
                { "id": "d", "text": "Wrong answer" }
            ],
            "correctAnswer": "b"
        }
    ]
}
```

### Exam Rules

- **5 questions per exam** (1 per core concept)
- **4 options per question** (a, b, c, d)
- `lessonRef` maps to which lesson the concept came from (1, 2, or 3)
- `correctAnswer` is always the option `id` (a/b/c/d)
- **Everyone passes** — score is always calculated as 95-100 in the functions
- Questions should be **easy** — the goal is the certificate, not gatekeeping
- Cover these 5 concepts:
  1. L1: Core definition of the field (root causes / what it is)
  2. L1: Scope of practice (educate & support, not diagnose)
  3. L2: The method/framework (first letter or key step)
  4. L3: First clients strategy (warm market = list 20 people)
  5. L3: Pricing (starter package recommendation)

---

## Content Writing Guidelines

### Text Formatting

- `**bold text**` → renders with yellow highlight background
- `$5,000` or `$297/month` → renders in green (money highlight)
- `{name}` → replaced with user's first name
- `™` → use the actual character, NOT `\u2122`
- `—` → use actual em dash, NOT `\u2014`

### Progressive Reveal

Every `heading` section splits the lesson into a new **step**.
Users see one step at a time and click "Continue" (gold button) to advance.
Step progress saves to localStorage.

**Rule**: Place 1 heading per major topic. Typical lesson has 4-6 headings = 4-6 steps.

### Interactive Placement Guide

| Element | Where to Place | Frequency |
|---------|---------------|-----------|
| `checkpoint` | After teaching a core concept | 2-3 per lesson |
| `reveal-card` | After a success story setup / case study | 1 per lesson |
| `micro-commitment` | After an inspiring moment | 1 per lesson |
| `income-calculator` | Lesson 3 only, after pricing discussion | 1 total |

### Tone & Style

- Conversational, empowering, second-person ("you")
- Sarah (the coach) speaks in first person in `intro` sections
- Short paragraphs (2-3 sentences max)
- Use real-feeling numbers and names (e.g., "$4,200/month", "Jennifer from Texas")
- Always include scope of practice reminders (educate & support, NOT diagnose)
- End each lesson with strong emotional CTA toward the next lesson

---

## Registration Checklist (New Niche)

When adding a new niche to the mini diploma system:

1. **Lesson content**: Create `lessons/content/{slug}.json` with 3 lessons
2. **Register in router**: Add import + entry in `dynamic-lesson-router.tsx` → `LESSON_CONTENT`
3. **Register in registry**: Add entry in `src/lib/mini-diploma-registry.ts` → `MINI_DIPLOMA_REGISTRY`
4. **Exam content**: Create `exams/content/{slug}.json` with 5 questions
5. **Register exam**: Add import + entry in exam page → `EXAM_CONFIGS` map
6. **Build**: Run `npm run build` to verify no TypeScript errors

---

## Quick Reference: File Paths

```
src/
├── components/mini-diploma/
│   ├── lessons/
│   │   ├── shared/
│   │   │   ├── classic-lesson-base.tsx    ← RENDER ENGINE (don't edit for content)
│   │   │   └── dynamic-lesson-router.tsx  ← JSON lesson router
│   │   ├── functional-medicine/classic/
│   │   │   ├── lesson-1-foundation.tsx    ← FM lesson 1 content
│   │   │   ├── lesson-2-depth-method.tsx  ← FM lesson 2 content
│   │   │   ├── lesson-3-first-clients.tsx ← FM lesson 3 content
│   │   │   └── lesson-router.tsx          ← FM lesson switcher
│   │   └── content/
│   │       ├── spiritual-healing.json     ← JSON lessons (7 niches)
│   │       ├── energy-healing.json
│   │       └── ...
│   ├── exams/content/
│   │   ├── functional-medicine.json       ← Exam configs (13 niches)
│   │   ├── spiritual-healing.json
│   │   └── ...
│   ├── dynamic-exam-component.tsx         ← Exam UI renderer
│   ├── fm-exam-component.tsx              ← FM-specific exam (legacy)
│   ├── welcome-audio.tsx                  ← Spotify-style audio player
│   ├── certificate-preview.tsx            ← Blurred certificate teaser
│   ├── gamification-bar.tsx               ← Confetti-only (no visible UI)
│   └── commitment-checkpoint.tsx          ← Post-L2 modal
├── lib/
│   ├── fm-exam-questions.ts               ← FM exam questions (TypeScript)
│   └── mini-diploma-registry.ts           ← Niche registry + config
└── app/(lead)/portal/[slug]/
    ├── lesson/[id]/page.tsx               ← Lesson page route
    └── exam/page.tsx                      ← Exam page route
```
