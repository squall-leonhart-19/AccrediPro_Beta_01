# Mini Diploma Creation Template

> **Version:** 2.0 (High-Intent Curriculum)
> **Last Updated:** January 2025
> **Author:** AccrediPro Engineering Team

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Lesson Structure](#lesson-structure)
4. [Interactive Elements](#interactive-elements)
5. [Content Framework](#content-framework)
6. [File Structure](#file-structure)
7. [Implementation Checklist](#implementation-checklist)
8. [Replication Steps](#replication-steps)
9. [PDF Resources Template](#pdf-resources-template)
10. [Metrics & Tracking](#metrics--tracking)

---

## Overview

### Purpose
Mini Diplomas are FREE lead magnets designed to:
1. **Attract** qualified leads ($1 CAC target)
2. **Educate** them on core concepts
3. **Transform** their thinking (identity shift)
4. **Create desire** for full certification (upsell)

### Key Metrics
| Metric | Target | Description |
|--------|--------|-------------|
| Start Rate | 50%+ | Optin → Lesson 1 started |
| Completion Rate | 45%+ | Started → All 9 lessons done |
| Time to Start | <15 min | How quickly they begin |
| Upgrade Rate | 10%+ | Completers → Paid certification |

### Core Philosophy
```
GIVE: The WHAT (what it is, why it matters)
GIVE: The WHY (proof it works, market demand)
TEASE: The HOW (how to actually do it)
PROVE: The ROI (income calculator)
```
**The full certification = The HOW**

---

## Architecture

### Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Components:** React 19 + TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **State:** React useState + props
- **Tracking:** Custom events → Prisma → PostgreSQL

### Component Hierarchy
```
LessonBaseV2 (shared)
├── Message Renderer
│   ├── Coach Messages
│   ├── System Cards
│   ├── User Choice
│   └── Custom Components
├── Interactive Elements (shared)
│   ├── SelfAssessmentQuiz
│   ├── CaseStudyChallenge
│   ├── KnowledgeCheckQuiz
│   ├── IncomeCalculator
│   ├── DownloadResource
│   └── PractitionerScore
└── Lesson Components (per niche)
    ├── Lesson 1-9
    └── LessonRouter
```

### File Locations
```
src/components/mini-diploma/
├── lessons/
│   ├── shared/
│   │   ├── lesson-base-v2.tsx      # Base lesson component
│   │   └── interactive-elements.tsx # Reusable interactive components
│   ├── functional-medicine/
│   │   └── v2/
│   │       ├── lesson-1-root-cause.tsx
│   │       ├── lesson-2-gut.tsx
│   │       ├── ...
│   │       ├── lesson-9-income.tsx
│   │       ├── lesson-router.tsx
│   │       └── index.ts
│   ├── womens-health/
│   │   └── v2/
│   │       └── ... (same structure)
│   └── [other-niches]/
```

---

## Lesson Structure

### 9-Lesson Curriculum Template

| # | Focus | Interactive Element | Download |
|---|-------|---------------------|----------|
| 1 | **Hook + Introduction** | Self-Assessment Quiz | - |
| 2 | **Core Concept 1** | Knowledge Check (3 Qs) | Cheatsheet PDF |
| 3 | **Core Concept 2** | Case Study #1 | - |
| 4 | **Core Concept 3** | Knowledge Check (3 Qs) | Resource PDF |
| 5 | **Core Concept 4** | Case Study #2 | - |
| 6 | **Core Concept 5** | Knowledge Check (3 Qs) | Reference PDF |
| 7 | **Application/Protocol** | Case Study #3 | - |
| 8 | **Business/Clients** | Knowledge Check (3 Qs) | Template PDF |
| 9 | **Income + Graduation** | Income Calculator | Career Roadmap |

### Individual Lesson Framework

Each lesson follows this structure:

```typescript
const messages: Message[] = [
    // 1. HOOK (30 seconds)
    // - Emotional pain point OR income opportunity
    // - Create urgency/relevance

    // 2. TEACH (5-6 minutes)
    // - Core concept with examples
    // - Visual system cards
    // - User interaction question

    // 3. INTERACTIVE ELEMENT
    // - Quiz, Case Study, or Assessment
    // - Points for Practitioner Score

    // 4. CAREER TIE-IN (1 minute)
    // - How this knowledge = money
    // - Market demand stats
    // - "In the certification, you'll learn..."

    // 5. ACTION (30 seconds)
    // - Micro-win they can do today
    // - Real-world application

    // 6. PREVIEW (30 seconds)
    // - Tease next lesson
    // - Certificate progress reminder
];
```

---

## Interactive Elements

### 1. Self-Assessment Quiz
**Purpose:** Personal relevance + identity shift
**Use in:** Lesson 1

```tsx
<SelfAssessmentQuiz
    title="Your [Topic] Assessment"
    subtitle="Select all that apply to you or people you know"
    options={[
        { id: 'issue1', label: 'Issue 1', description: 'Symptoms...' },
        { id: 'issue2', label: 'Issue 2', description: 'Symptoms...' },
        // 4-6 options
    ]}
    onComplete={(selectedIds, score) => {
        // Track and continue
    }}
/>
```

### 2. Case Study Challenge
**Purpose:** Practice thinking like a practitioner
**Use in:** Lessons 3, 5, 7

```tsx
<CaseStudyChallenge
    caseTitle="[Name]'s [Condition]"
    patientInfo="[Name], [age], [occupation], [family status]"
    symptoms={[
        "Symptom 1 with detail",
        "Symptom 2 with detail",
        // 4-6 symptoms
    ]}
    question="What's the MOST LIKELY underlying issue?"
    options={[
        { id: 'a', label: 'Option A', isCorrect: false, explanation: 'Why wrong...' },
        { id: 'b', label: 'Option B', isCorrect: true, explanation: 'Why right...' },
        { id: 'c', label: 'Option C', isCorrect: false, explanation: 'Why wrong...' },
        { id: 'd', label: 'Option D', isCorrect: false, explanation: 'Why wrong...' },
    ]}
    expertExplanation="Detailed explanation of the correct answer..."
    incomeHook="Practitioners who can identify [X] charge $X for this."
    onComplete={(selectedId, isCorrect) => {
        // Track and continue
    }}
/>
```

### 3. Knowledge Check Quiz
**Purpose:** Reinforce learning + engagement
**Use in:** Lessons 2, 4, 6, 8

```tsx
<KnowledgeCheckQuiz
    title="[Topic] Knowledge Check"
    questions={[
        {
            id: 'q1',
            question: 'Question 1?',
            options: [
                { id: 'a', label: 'Answer A', isCorrect: false },
                { id: 'b', label: 'Answer B', isCorrect: true },
                { id: 'c', label: 'Answer C', isCorrect: false },
                { id: 'd', label: 'Answer D', isCorrect: false },
            ],
        },
        // 3 questions per quiz
    ]}
    onComplete={(score, total) => {
        // Track and continue
    }}
/>
```

### 4. Income Calculator
**Purpose:** Make ROI tangible
**Use in:** Lesson 9

```tsx
<IncomeCalculator
    onComplete={(monthlyIncome, yearlyIncome) => {
        // Track and continue
    }}
/>
```

### 5. Downloadable Resource
**Purpose:** Value + Reference
**Use in:** Lessons 2, 4, 6, 8, 9

```tsx
<DownloadResource
    title="[Resource Name]"
    description="What they'll get..."
    fileName="resource-name.pdf"
    downloadUrl="/resources/mini-diploma/resource-name.pdf"
    icon="pdf" | "checklist" | "template" | "guide"
    onDownload={() => {
        // Track download
    }}
/>
```

### 6. Practitioner Score
**Purpose:** Gamification + Progress
**Use in:** Lesson 9

```tsx
<PractitionerScore
    currentScore={totalScore}
    maxScore={210}
    lessonsCompleted={9}
    totalLessons={9}
/>
```

---

## Content Framework

### Hook Templates

**Emotional Hook:**
```
"[Name], I need to tell you something that will change how you see [topic]..."
"Have you ever felt [common frustration]? That's not normal. Let me show you why."
```

**Income Hook:**
```
"Practitioners who understand [topic] charge $[X]-$[Y] per session. Here's why..."
"This knowledge is worth $[X] per hour in the marketplace. Let me prove it."
```

### System Card Styles

| Style | Use For | Icon |
|-------|---------|------|
| `info` | Educational content | Target |
| `stats` | Statistics/data | TrendingUp |
| `comparison` | Before/after | Sparkles |
| `takeaway` | Key insights | Heart |
| `exercise` | Action steps | CheckCircle |
| `income-hook` | Income/career | DollarSign |
| `career-tip` | Business advice | Award |
| `quote` | Testimonials | MessageCircle |

### Career Tie-In Template

```typescript
{
    type: 'system',
    content: `**Why [Topic] = Money**

• [Stat about market size/demand]
• [What practitioners charge]
• [Why clients pay premium]

**Income potential:**
• [Service 1]: $[X]-$[Y]
• [Service 2]: $[X]-$[Y]
• [Package]: $[X]-$[Y]

→ Full certification includes exact protocols`,
    systemStyle: 'income-hook',
}
```

---

## File Structure

### Creating a New Mini Diploma

```
src/components/mini-diploma/lessons/[niche-name]/v2/
├── lesson-1-[topic].tsx
├── lesson-2-[topic].tsx
├── lesson-3-[topic].tsx
├── lesson-4-[topic].tsx
├── lesson-5-[topic].tsx
├── lesson-6-[topic].tsx
├── lesson-7-[topic].tsx
├── lesson-8-clients.tsx       # Reuse content
├── lesson-9-income.tsx        # Reuse with niche customization
├── lesson-router.tsx
└── index.ts
```

### Naming Conventions

| Element | Convention | Example |
|---------|------------|---------|
| Niche folder | kebab-case | `womens-health` |
| Lesson file | `lesson-[N]-[topic].tsx` | `lesson-3-hormones.tsx` |
| Component | PascalCase | `Lesson3Hormones` |
| Props interface | `LessonProps` | Same for all |

---

## Implementation Checklist

### For Each New Mini Diploma

- [ ] **Planning**
  - [ ] Define 9 lesson topics
  - [ ] Identify 3 case study scenarios
  - [ ] Write 4 PDF resource outlines
  - [ ] Define income/career hooks per lesson

- [ ] **Development**
  - [ ] Create v2 folder structure
  - [ ] Implement Lesson 1 with Self-Assessment
  - [ ] Implement Lessons 2, 4, 6, 8 with Knowledge Checks
  - [ ] Implement Lessons 3, 5, 7 with Case Studies
  - [ ] Implement Lesson 9 with Income Calculator
  - [ ] Create LessonRouter
  - [ ] Create index.ts exports

- [ ] **Content**
  - [ ] Write all lesson messages
  - [ ] Create 4 downloadable PDFs
  - [ ] Write case study scenarios
  - [ ] Define knowledge check questions

- [ ] **Integration**
  - [ ] Add to mini-diploma registry
  - [ ] Configure email/SMS sequences
  - [ ] Set up tracking events
  - [ ] Test full flow

- [ ] **Testing**
  - [ ] Test all interactive elements
  - [ ] Verify downloads work
  - [ ] Check score tracking
  - [ ] Test completion flow

---

## Replication Steps

### Step 1: Copy Template
```bash
cp -r src/components/mini-diploma/lessons/functional-medicine/v2 \
      src/components/mini-diploma/lessons/[new-niche]/v2
```

### Step 2: Rename Files
```bash
cd src/components/mini-diploma/lessons/[new-niche]/v2
# Rename lesson files to match niche topics
mv lesson-1-root-cause.tsx lesson-1-[new-topic].tsx
# etc.
```

### Step 3: Update Content
1. Replace all lesson content with niche-specific material
2. Update case study scenarios
3. Customize income/career hooks
4. Update knowledge check questions

### Step 4: Update Router
```tsx
// lesson-router.tsx
export const [NICHE]_LESSONS_V2 = [
    { id: 1, title: "...", subtitle: "...", ... },
    // etc.
];
```

### Step 5: Add to Registry
```typescript
// src/lib/mini-diploma-registry.ts
export const MINI_DIPLOMA_REGISTRY = {
    "[new-niche]": {
        slug: "[new-niche]-mini-diploma",
        // ...config
    },
};
```

### Step 6: Configure Nurture
```typescript
// Update email/SMS templates for new niche
```

---

## PDF Resources Template

### PDF 1: Protocol/Framework Cheatsheet
**Lesson:** 2
**Content:**
- Core framework (e.g., 5R Protocol)
- Key steps with brief descriptions
- When to use
- Quick reference table

### PDF 2: Checklist/Audit
**Lesson:** 4
**Content:**
- Room-by-room or category-by-category checklist
- Action items
- Red flags to watch for
- Resources for more info

### PDF 3: Reference Guide
**Lesson:** 6
**Content:**
- Comparison tables (e.g., lab ranges)
- Quick lookup values
- Interpretation guidelines
- Common patterns

### PDF 4: Template/Form
**Lesson:** 8
**Content:**
- Client intake form
- Assessment template
- Session notes format
- Follow-up checklist

### PDF 5: Career Roadmap
**Lesson:** 9
**Content:**
- 6-month timeline
- Milestones and goals
- Income projections
- Next steps

---

## Metrics & Tracking

### Tracking Implementation

All tracking is handled via the `useMiniDiplomaTracking` hook which sends events to `/api/track/mini-diploma`.

```tsx
import { useMiniDiplomaTracking } from "@/hooks/use-mini-diploma-tracking";

const {
    trackLessonStarted,
    trackLessonCompleted,
    trackAssessmentCompleted,
    trackQuizCompleted,
    trackCaseStudyCompleted,
    trackIncomeCalculated,
    trackResourceDownloaded,
    trackCertificateDownloaded,
} = useMiniDiplomaTracking();
```

### Events Tracked

| Event | Trigger | Properties | Auto-Tags Created |
|-------|---------|------------|-------------------|
| `lesson_started` | Lesson loads | lesson_id, lesson_title | `[niche]-lesson-started:[N]` |
| `lesson_completed` | Finish button | lesson_id, duration_seconds, practitioner_score | `[niche]-lesson-complete:[N]` |
| `assessment_completed` | Self-assessment done | assessment_type, selected_options, score | `fm-assessment:[type]` |
| `quiz_completed` | Knowledge check done | quiz_title, score, total, percentage | `fm-quiz-complete:[N]`, `fm-quiz-score:[N]:[score]/[total]` |
| `case_study_completed` | Case study answered | case_title, is_correct | `fm-case-study:[N]:[correct/incorrect]` |
| `income_calculated` | Calculator used | monthly_income, yearly_income, hours_per_week, session_rate | `fm-income-goal:[low/medium/high]` |
| `resource_downloaded` | PDF download | resource_name, resource_url | `fm-resource:[resource-name]` |
| `certificate_downloaded` | Final completion | practitioner_score, lessons_completed | `[niche]-certificate-downloaded` |

### Income Segmentation

Users are automatically tagged based on their income calculator results:
- `fm-income-goal:low` - Yearly income < $50,000
- `fm-income-goal:medium` - Yearly income $50,000 - $99,999
- `fm-income-goal:high` - Yearly income $100,000+

### Tags Created Summary

| Tag | Format | When |
|-----|--------|------|
| Lesson started | `[niche]-lesson-started:[N]` | Lesson load |
| Lesson complete | `[niche]-lesson-complete:[N]` | Lesson finish |
| Quiz complete | `fm-quiz-complete:[N]` | Knowledge check done |
| Quiz score | `fm-quiz-score:[N]:[score]/[total]` | Knowledge check done |
| Case study | `fm-case-study:[N]:[result]` | Case study answered |
| Assessment | `fm-assessment:[type]` | Self-assessment done |
| Income goal | `fm-income-goal:[level]` | Calculator used |
| Resource | `fm-resource:[name]` | PDF downloaded |
| Certificate | `[niche]-certificate-downloaded` | Certificate claimed |

### Dashboard Queries

```sql
-- Start Rate
SELECT
  COUNT(DISTINCT CASE WHEN tag LIKE '%lesson-started:1' THEN userId END) as started,
  COUNT(DISTINCT CASE WHEN tag LIKE 'lead:%' THEN userId END) as optins
FROM UserTag;

-- Completion Rate
SELECT
  COUNT(DISTINCT CASE WHEN tag LIKE '%lesson-complete:9' THEN userId END) as completed,
  COUNT(DISTINCT CASE WHEN tag LIKE '%lesson-started:1' THEN userId END) as started
FROM UserTag;
```

---

## Example: Functional Medicine Curriculum

### Lesson Overview

| # | Title | Hook | Career Tie-In |
|---|-------|------|---------------|
| 1 | Why Root Cause Medicine Wins | Healthcare is failing | $150-300/session |
| 2 | The Gut Connection | 70% of immunity | Gut programs = bread & butter |
| 3 | The Inflammation Blueprint | Silent killer | $2B anti-inflammatory market |
| 4 | The Toxin Reality | 200 chemicals before breakfast | $50B detox industry |
| 5 | Stress & Hormones Decoded | Burnout epidemic | Corporate wellness contracts |
| 6 | Lab Interpretation Secrets | "Normal" doesn't mean healthy | Premium positioning |
| 7 | Building Client Protocols | Knowledge → Action | $300 sessions |
| 8 | Finding Your First Clients | 3 proven strategies | First 90 days plan |
| 9 | Your Income Calculator | See YOUR potential | Graduation + upsell |

### Case Study Scenarios

**Case Study 1 (Lesson 3): Maria's Inflammation**
- 48yo nurse, fatigue, joint pain, brain fog, weight gain

**Case Study 2 (Lesson 5): Jennifer's Burnout**
- 42yo executive, single mom, exhaustion, afternoon crashes

**Case Study 3 (Lesson 7): Sarah's Protocol**
- 45yo teacher, wants to lose 30lbs, needs energy

---

## Conclusion

This template provides everything needed to create high-intent mini diplomas that:
1. Educate leads on core concepts
2. Transform their thinking (identity shift)
3. Create desire for full certification
4. Track engagement and completion

When replicating to new niches:
1. Follow the lesson structure exactly
2. Customize content for the niche
3. Use the same interactive elements
4. Update career/income hooks for the market

**The goal is not to satisfy - it's to create HUNGER for more.**
