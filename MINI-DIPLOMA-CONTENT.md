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
    +-- 12 dynamic niches --> DynamicLessonRouter (JSON)
    |       Files: src/components/mini-diploma/lessons/content/{slug}.json
    |       Router: src/components/mini-diploma/lessons/shared/dynamic-lesson-router.tsx
    |
    +-- FM only --> ClassicFunctionalMedicineLessonRouter (TSX)
            Files: src/components/mini-diploma/lessons/functional-medicine/classic/
            lesson-1-foundation.tsx, lesson-2-depth-method.tsx, lesson-3-first-clients.tsx

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
```

---

## All 14 Niches

| # | Portal Slug | Display Name | Lesson Type | Status |
|---|-------------|-------------|-------------|--------|
| 1 | functional-medicine | Functional Medicine Foundation | TSX (classic) | ✅ |
| 2 | spiritual-healing | Spiritual Healing | JSON (dynamic) | ✅ |
| 3 | energy-healing | Certified Energy Healing Practitioner | JSON (dynamic) | ✅ |
| 4 | christian-coaching | Certified Christian Life Coach | JSON (dynamic) | ✅ |
| 5 | gut-health | Gut Health Specialist | JSON (dynamic) | ✅ |
| 6 | reiki-healing | Certified Reiki Practitioner | JSON (dynamic) | ✅ |
| 7 | adhd-coaching | Certified ADHD Coach | JSON (dynamic) | ✅ |
| 8 | pet-nutrition | Certified Pet Nutrition Specialist | JSON (dynamic) | ✅ |
| 9 | hormone-health | Hormone Health Specialist | JSON (dynamic) | ✅ |
| 10 | holistic-nutrition | Holistic Nutrition Specialist | JSON (dynamic) | ✅ |
| 11 | nurse-coach | Certified Nurse Life Coach | JSON (dynamic) | ✅ |
| 12 | health-coach | Certified Health Coach | JSON (dynamic) | ✅ |
| 13 | womens-hormone-health | Women's Hormone Health Foundation | JSON (dynamic) | ✅ |

---

## Content Files Map

### Lesson Content

| Niche | Type | File |
|-------|------|------|
| functional-medicine | TSX (classic) | `lessons/functional-medicine/classic/lesson-{1,2,3}-*.tsx` |
| All other 12 niches | JSON (dynamic) | `lessons/content/{slug}.json` |

### Exam Content

| Niche | File |
|-------|------|
| All 13 niches | `exams/content/{slug}.json` |

> All paths relative to `src/components/mini-diploma/`

---

## Curriculum Structure (All Niches)

Every mini diploma has exactly **3 lessons** + **1 final exam (5 questions)**:

| Lesson | Topic | Purpose |
|--------|-------|---------|
| 1 | Foundation | What is this field, why it matters, scope of practice, root causes |
| 2 | The D.E.P.T.H. Method™ | Framework for client sessions (Discover, Evaluate, Plan, Transform, Heal) |
| 3 | Getting First Clients | Warm Market Strategy, pricing packages ($297 starter), scope reminders |
| Exam | 5 multiple-choice questions | 1 per core concept, everyone passes (score 95-100) |

**Total time: ~25 minutes for lessons + ~5 minutes for exam**

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

## How to Write a Lesson (JSON — All Dynamic Niches)

### File Template

```json
{
    "niche": "niche-slug",
    "nicheLabel": "Niche Display Name Certification",
    "baseUrl": "/portal/niche-slug",
    "courseSlug": "niche-slug-mini-diploma",
    "lessons": [
        {
            "id": 1,
            "title": "Lesson 1 Title (Foundation)",
            "subtitle": "One-line subtitle",
            "readingTime": "8 min",
            "sections": [
                { "type": "intro", "content": "Hey {name}! Welcome to your journey..." },
                { "type": "heading", "content": "What Is [Niche]?" },
                { "type": "text", "content": "Body text with **bold keywords** and $amounts." },
                { "type": "list", "content": "The 5 root causes:", "items": ["Item 1", "Item 2", "Item 3"] },
                { "type": "callout", "content": "Important scope reminder.", "style": "warning" },
                { "type": "key-point", "content": "Key takeaway for this section." },
                {
                    "type": "checkpoint",
                    "content": "",
                    "checkpoint": {
                        "question": "What does [niche] primarily focus on?",
                        "options": [
                            { "label": "Wrong answer A", "isCorrect": false },
                            { "label": "Correct answer", "isCorrect": true },
                            { "label": "Wrong answer C", "isCorrect": false }
                        ],
                        "successMessage": "Yes! Brief reinforcement."
                    }
                },
                {
                    "type": "reveal-card",
                    "content": "",
                    "revealCard": {
                        "teaser": "See how Maria transformed her practice →",
                        "content": "Maria was a nurse making $52K/year. After getting certified..."
                    }
                },
                {
                    "type": "micro-commitment",
                    "content": "Can you see yourself helping people this way?",
                    "commitmentOptions": {
                        "positive": "Yes, I can see it!",
                        "neutral": "Tell me more"
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
            "title": "The D.E.P.T.H. Method™",
            "subtitle": "Your signature framework for client sessions",
            "readingTime": "10 min",
            "sections": [
                { "type": "intro", "content": "Hey {name}! Ready for the method that changes everything?" },
                {
                    "type": "framework",
                    "content": "",
                    "framework": {
                        "name": "The D.E.P.T.H. Method™",
                        "steps": [
                            { "letter": "D", "title": "Discover", "description": "Uncover root causes through deep conversation" },
                            { "letter": "E", "title": "Evaluate", "description": "Assess the full picture of their health" },
                            { "letter": "P", "title": "Plan", "description": "Create a personalized action plan" },
                            { "letter": "T", "title": "Transform", "description": "Guide implementation and behavior change" },
                            { "letter": "H", "title": "Heal", "description": "Support long-term wellness and growth" }
                        ]
                    }
                }
            ],
            "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"]
        },
        {
            "id": 3,
            "title": "How To Get Your First Clients",
            "subtitle": "From certification to your first paying client",
            "readingTime": "8 min",
            "sections": [
                { "type": "intro", "content": "Hey {name}! This is where it gets REAL..." },
                {
                    "type": "income-calculator",
                    "content": "See what your monthly income could look like:",
                    "calculator": {
                        "avgPackagePrice": 297,
                        "maxClients": 30
                    }
                }
            ],
            "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"]
        }
    ]
}
```

> JSON files go in: `src/components/mini-diploma/lessons/content/{slug}.json`
> Then register the import in `dynamic-lesson-router.tsx` in the `LESSON_CONTENT` map.
> And add the slug to `DYNAMIC_CONTENT_NICHES` array in `lesson/[id]/page.tsx`.

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
    "hasMasterclass": false,
    "postExamFlow": "trustpilot",
    "trustpilotUrl": "https://www.trustpilot.com/review/accredipro.academy",
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
- **Always include** `"postExamFlow": "trustpilot"` and `"trustpilotUrl"`
- Cover these 5 concepts:
  1. L1: Core definition of the field (root causes / what it is)
  2. L1: Scope of practice (educate & support, not diagnose)
  3. L2: The D.E.P.T.H. Method™ (first letter D = Discover)
  4. L3: First clients strategy (warm market = list 20 people you know)
  5. L3: Pricing (starter package ~$297)

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
| `framework` | Lesson 2 only, for D.E.P.T.H. Method™ | 1 total |

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
3. **Register in DYNAMIC_CONTENT_NICHES**: Add slug to array in `lesson/[id]/page.tsx`
4. **Register in registry**: Add entry in `src/lib/mini-diploma-registry.ts` → `MINI_DIPLOMA_REGISTRY`
5. **Exam content**: Create `exams/content/{slug}.json` with 5 questions + `postExamFlow: "trustpilot"`
6. **Register exam**: Add import + entry in exam page → `EXAM_CONFIGS` map
7. **Nudge cron**: AUTOMATIC — reads from `MINI_DIPLOMA_REGISTRY`, no code change needed
8. **Build**: Run `npm run build` to verify no TypeScript errors

---

## Quick Reference: File Paths

```
src/
├── components/mini-diploma/
│   ├── lessons/
│   │   ├── shared/
│   │   │   ├── classic-lesson-base.tsx    ← RENDER ENGINE (don't edit for content)
│   │   │   └── dynamic-lesson-router.tsx  ← JSON lesson router (12 niches)
│   │   ├── functional-medicine/classic/
│   │   │   ├── lesson-1-foundation.tsx    ← FM lesson 1 content (TSX)
│   │   │   ├── lesson-2-depth-method.tsx  ← FM lesson 2 content (TSX)
│   │   │   ├── lesson-3-first-clients.tsx ← FM lesson 3 content (TSX)
│   │   │   └── lesson-router.tsx          ← FM lesson switcher
│   │   └── content/
│   │       ├── spiritual-healing.json     ← JSON lessons (12 niches)
│   │       ├── energy-healing.json
│   │       ├── christian-coaching.json
│   │       ├── gut-health.json
│   │       ├── reiki-healing.json
│   │       ├── adhd-coaching.json
│   │       ├── pet-nutrition.json
│   │       ├── hormone-health.json
│   │       ├── holistic-nutrition.json
│   │       ├── nurse-coach.json
│   │       ├── health-coach.json
│   │       └── womens-hormone-health.json
│   ├── exams/content/
│   │   ├── functional-medicine.json       ← Exam configs (13 niches, 5 Qs each)
│   │   ├── spiritual-healing.json
│   │   └── ... (all 13 niches)
│   ├── dynamic-exam-component.tsx         ← Exam UI renderer
│   ├── welcome-audio.tsx                  ← Spotify-style audio player
│   ├── certificate-preview.tsx            ← Blurred certificate teaser
│   └── gamification-bar.tsx               ← Confetti-only (no visible UI)
├── lib/
│   ├── mini-diploma-registry.ts           ← Niche registry + config (14 niches)
│   └── mini-diploma/completion-emails.ts  ← Milestone email templates
└── app/(lead)/portal/[slug]/
    ├── lesson/[id]/page.tsx               ← Lesson page route
    ├── exam/page.tsx                      ← Exam page route
    └── certificate/page.tsx               ← Certificate page
```

---

## Email & Nudge System

### Nudge Cron (Automatic for ALL niches)

The nudge cron at `src/app/api/cron/mini-diploma-nudges/route.ts` runs hourly and:
- Reads ALL niches from `MINI_DIPLOMA_REGISTRY` automatically
- Sends 6 emails over 72 hours to leads who haven't started
- Email content is dynamic: uses `config.displayName` and `config.portalSlug` for each niche
- No code changes needed when adding new niches

### Email Timeline

| Hour | Email | Content |
|------|-------|---------|
| 3 | Social proof | "847 women started this week" + what's inside |
| 12 | Game plan | Step 1-2-Done table, ~30 min total |
| 24 | Urgency | "24 hours left" + what you'll miss |
| 36 | Final warning | "ONLY 12 HOURS LEFT" |
| 48 | Recovery | "Access expired — 24h extension" |
| 72 | Final goodbye | "Reply to come back" |
