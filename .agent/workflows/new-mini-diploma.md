---
description: Create a new mini diploma from a spec
---

# New Mini Diploma Workflow

**Fully automated** - just provide a topic name, Claude Code generates everything.

## Usage

```
/new-mini-diploma Spiritual Healing
```

---

## 🚨 CRITICAL: Make EXACTLY The Same But For New Title

**THE GOLDEN RULE**: The Functional Medicine landing page at `src/app/(public)/functional-medicine-mini-diploma/page.tsx` is the PRODUCTION TEMPLATE.

**DO NOT** create a new landing page from scratch.
**DO** copy the FM page exactly, then change ONLY the niche-specific content.

### Step-by-Step for Landing Page:
1. **COPY** `functional-medicine-mini-diploma/page.tsx` to `{new-diploma}/page.tsx`
2. **FIND/REPLACE** these strings:
   - `functional-medicine` → `{new-slug}`
   - `Functional Medicine` → `{New Title}`
   - `fm-healthcare` → `{new-slug}`
3. **CHANGE** these niche-specific elements:
   - Hero title/subtitle text
   - Testimonial names and stories
   - Lesson titles in the "9 Lessons" section
   - Certificate image path
   - Primary color (if different niche feeling)
4. **KEEP EVERYTHING ELSE IDENTICAL**:
   - All imports
   - All CSS
   - All component structure
   - All form handling
   - All animations
   - All sections (Meet Sarah, FAQ, Guarantee, etc.)

### What To COPY (Template + Find/Replace):
| File Type | Template Source | Just Replace |
|-----------|-----------------|--------------|
| **Landing page** | `functional-medicine-mini-diploma/page.tsx` (845 lines) | Niche name, colors, text |
| SMS sequences | `docs/sms-sequences/functional-medicine-sms.md` | Niche name |
| Registry entry | Pattern at line 200+ in registry | Config values |
| diploma-configs entry | Copy existing block | Lesson titles |
| Lesson JSON | Copy FM structure | Lesson content |

### What NEEDS AI Generation:
| File Type | Why |
|-----------|-----|
| 60-day nurture sequence | Niche-specific stories |
| DM messages | Conversational, unique |
| Testimonial content | Names, stories, income claims |

### Landing Page Structure:
```
┌────────────────────────────────────────┐
│  KEEP SAME (template):                 │
│  - ALL CSS and imports                 │
│  - ALL component structure             │
│  - MultiStepQualificationForm          │
│  - Meet Sarah section                  │
│  - Guarantee section                   │
│  - FAQ section (8 questions)           │
│  - Value Stack section                 │
│  - Final CTA                           │
│  - FloatingChatWidget                  │
├────────────────────────────────────────┤
│  CHANGE (niche-specific):              │
│  - Hero title/subtitle                 │
│  - 3 testimonial cards                 │
│  - 9 lesson titles                     │
│  - Color scheme (BRAND object)         │
│  - CertificatePreview component props: │
│      diplomaTitle="{New Title}"        │
│      primaryColor={BRAND.primary}      │
│  - Course slug in API call             │
│  - Pixel ID if different               │
└────────────────────────────────────────┘
```

### Certificate Section Uses HTML Component:
The certificate is NOT a static image. It uses the `<CertificatePreview />` component:
```tsx
import { CertificatePreview } from "@/components/certificates/certificate-preview";

<CertificatePreview
    diplomaTitle="{New Diploma Title}"
    primaryColor={BRAND.primary}
/>
```

---

## 🔄 AI Fallback Chain (If Capped)

If Claude Code hits spending cap, use this fallback chain:

```
Claude Code (Account 1) ─── PRIMARY
       ↓ if "spending cap reached"
Claude Code (Account 2) ─── Switch: ~/.ralph/claude-switch.sh 2
       ↓ if both capped
Gemini API (gemini-3-flash-preview) ─── Use for text generation
       ↓ or
Use HEALTH_COACH fallback sequences ─── Functional, just not niche-specific
```

### How to Switch Claude Accounts:
```bash
~/.ralph/claude-switch.sh 1   # Main account
~/.ralph/claude-switch.sh 2   # blablarog1234@gmail.com (backup)
```

### Gemini API for Text Generation:
- API key at: `~/.ai-keys`
- Model: `gemini-3-flash-preview`
- Good for: Nurture sequences, email copy, documentation

---

## ⚠️ CRITICAL: Task Tracking (MANDATORY)

**After completing EACH step, you MUST update `.ralph/fix_plan.md`**

⚠️ **Ralph checks this file to know when to exit. If you don't update checkmarks, Ralph will loop forever!**

Mark completed items with `[x]`:
```markdown
- [x] Step 1: Read spec
- [x] Step 2: Add lessons to registry
- [ ] Step 3: Add config to registry  ← currently working
```

**HOW TO UPDATE:** Replace `- [ ]` with `- [x]` after each step completes.

---

## Step 0: Create Task-Specific Fix Plan

> [!CAUTION]
> **🚨 ALWAYS reset the Ralph session before starting a new mini diploma!**
> Without this, Ralph will continue working on the PREVIOUS mini diploma's session.

**FIRST**, reset Ralph's session and create the fix plan:

```bash
# 1. Reset session to clear previous context
ralph --reset-session

# 2. Kill any existing Ralph session
tmux kill-session -t ralph 2>/dev/null
```

**THEN**, overwrite `.ralph/fix_plan.md` with this checklist:

```markdown
# Mini Diploma Creation: {Topic Name}

## Tasks

### 🚨 STEP 0: DATABASE COURSE (MANDATORY FIRST!)
- [ ] Create database course: `npx ts-node scripts/create-mini-diploma-course.ts --slug {slug} --name "{Name}"`

### Step 1: Core Files
- [ ] Read spec file (or generate if not exists)
- [ ] Add lessons array to registry
- [ ] Add config entry to registry
- [ ] Update optin API - COURSE_SLUGS
- [ ] Update optin API - COACH_EMAILS
- [ ] Update optin API - WELCOME_MESSAGES
- [ ] Update optin API - getCertificationDisplayName
- [ ] Update optin API - nicheNames
- [ ] Update auth get-redirect
- [ ] Update next.config.ts

### Step 2: Landing Page (COPY EXACTLY FROM TEMPLATE)
- [ ] Create landing page (COPY spiritual-healing page.tsx, 841 lines)
- [ ] Set correct Meta Pixel ID (lookup from `docs/mini-diploma/mini_diploma_planning.csv`)
- [ ] Add to diploma-configs.ts (for portal)
- [ ] Add to DIPLOMA_TAG_PREFIX in lead layout

### Step 3: Lesson Content
- [ ] Create lesson content JSON (9 lessons)
- [ ] Add to dynamic-lesson-router.tsx

### Step 4: Sequences (USE EMAIL_SEQUENCES.md TEMPLATE!)
- [ ] Create 60-day nurture sequence file FROM `docs/mini-diploma/EMAIL_SEQUENCES.md`
- [ ] Create DM sequence file FROM template
- [ ] Register sequences in registry (imports + config)

### Step 5: Cron & GHL
- [ ] Generate SMS template file for GHL
- [ ] Add to nudge cron (48-hour non-starter)

### Step 6: Verification
- [ ] Verify build passes
- [ ] Test enrollment (sign up on landing page, verify user created)
- [ ] Test portal access (/portal/{portal_slug})
- [ ] Verify sequence email cron works
- [ ] Update `docs/mini-diploma/mini_diploma_planning.csv` status to "done"

## Completed
(move items here when done)
```

---

## 🚨 Step 0: Create Database Course (MANDATORY FIRST!)

**THIS MUST BE DONE FIRST before any other steps!**

Without this, enrollment will fail with "course not found" error.

// turbo
```bash
npx ts-node scripts/create-mini-diploma-course.ts --slug {course_slug} --name "{Topic Name}"
```

Example:
```bash
npx ts-node scripts/create-mini-diploma-course.ts --slug reiki-healing-mini-diploma --name "Reiki Healing"
```

**After completing: Update fix_plan.md - mark "Create database course" as [x]**

⚠️ **DO NOT SKIP THIS STEP - enrollment will break!**

---

## Step 1: Generate/Read Spec

If user provides just a topic name, **automatically generate** the spec file:

**File to create:** `docs/mini-diploma/specs/{topic-kebab}.json`

```json
{
  "diplomas": [
    {
      "topic": "{Topic Name}",
      "lessons": [
        "{Topic} Foundations",
        "Core Principles of {Topic}",
        "Understanding {Topic} Systems",
        "Practical {Topic} Techniques",
        "Advanced {Topic} Methods",
        "{Topic} Assessment & Evaluation",
        "Client Sessions & {Topic} Practice",
        "Ethics & Building Your {Topic} Practice",
        "Your Next Step"
      ],
      "checkoutUrl": null,
      "colorScheme": "{auto-select based on topic}",
      "brandColors": {
        "primary": "{hex}",
        "accent": "#d4af37",
        "gradient": "{tailwind gradient}"
      }
    }
  ]
}
```

### Color Scheme Auto-Selection

| Topic Keywords | Color | Primary Hex |
|----------------|-------|-------------|
| spiritual, healing, energy, chakra | purple | #6b21a8 |
| health, medicine, nutrition | burgundy | #722f37 |
| christian, faith, biblical | navy | #1e3a5f |
| pet, animal, veterinary | emerald | #047857 |
| business, coaching, leadership | blue | #1e40af |
| women, hormone, fertility | rose | #be185d |
| default | burgundy | #722f37 |

**After completing: Update fix_plan.md - mark "Read spec file" as [x]**

---

## Step 2: Generate Slugs

From the diploma topic, derive:

| Value | Pattern | Example (Pet Nutrition) |
|-------|---------|-------------------------|
| `name` | Title Case | "Pet Nutrition" |
| `course_slug` | `{kebab}-mini-diploma` | `pet-nutrition-mini-diploma` |
| `portal_slug` | `{kebab}` | `pet-nutrition` |
| `tag_prefix` | `{kebab}` | `pet-nutrition` |
| `exam_category` | `{kebab}-exam` | `pet-nutrition-exam` |
| `display_name` | "Certified {Name} Specialist" | "Certified Pet Nutrition Specialist" |

---

## Step 3: Update Registry

**File:** `src/lib/mini-diploma-registry.ts`

1. Add lesson array before `MINI_DIPLOMA_REGISTRY`:
```typescript
const {NAME_UPPER}_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "Lesson 1", module: 1 },
    // ... 9 lessons from spec
];
```

2. Add config entry to `MINI_DIPLOMA_REGISTRY`:
```typescript
"{course_slug}": {
    name: "{name}",
    slug: "{course_slug}",
    portalSlug: "{portal_slug}",
    displayName: "{display_name}",
    lessons: {NAME_UPPER}_LESSONS,
    checkoutUrl: DEFAULT_CHECKOUT_URL,
    examCategory: "{exam_category}",
    lessonTagPrefix: "{tag_prefix}-lesson-complete",
    nurtureSequence: HEALTH_COACH_NURTURE_SEQUENCE,
    dmSequence: HEALTH_COACH_DMS,
    nudgePrefix: "{tag_prefix}-nudge",
    nurturePrefix: "{tag_prefix}-nurture",
    completionTag: "{course_slug}:completed"
}
```

**After completing: Update fix_plan.md - mark both registry items as [x]**

---

## Step 4: Update Opt-in API

**File:** `src/app/api/mini-diploma/optin/route.ts`

Add to these 5 locations:
1. `COURSE_SLUGS`: `"{portal_slug}": "{course_slug}"`
2. `COACH_EMAILS`: `"{portal_slug}": "sarah_womenhealth@accredipro-certificate.com"`
3. `WELCOME_MESSAGES`: Copy existing entry, update text for topic
4. `getCertificationDisplayName()`: `"{portal_slug}": "{name}"`
5. `nicheNames`: `"{portal_slug}": "{name}"`

**After completing EACH: Update fix_plan.md - mark each API item as [x]**

---

## Step 5: Update Auth Redirect

**File:** `src/app/api/auth/get-redirect/route.ts`

Add to `miniDiplomaMap`:
```typescript
"{course_slug}": "{portal_slug}",
```

> [!NOTE]
> The redirect query uses `orderBy: { enrolledAt: 'desc' }` (NOT `createdAt`). 
> The Enrollment table uses `enrolledAt` for the timestamp field.

**After completing: Update fix_plan.md - mark "Update auth get-redirect" as [x]**

---

## Step 6: Update next.config.ts

**File:** `next.config.ts`

Add `'{portal_slug}'` to the `diplomaSlugs` array.

**After completing: Update fix_plan.md - mark "Update next.config.ts" as [x]**

---

## Step 7: Create Opt-in Landing Page

**Create:** `src/app/(public)/{course_slug}/page.tsx`

Copy from `src/app/(public)/functional-medicine-mini-diploma/page.tsx` and update:

### Required Changes:
- Brand colors to match spec (see color table in Step 1)
- Title/headlines to match topic
- `course: "{portal_slug}"` in API call
- Redirect to `/portal/{portal_slug}`
- Update LEARNING_OUTCOMES for the topic
- Update lesson titles in the curriculum section
- Update TESTIMONIALS (keep structure, adjust copy)
- Update FAQs for the topic

### CRITICAL - Certificate Preview:
Use the `CertificatePreview` component instead of static image:
```tsx
import { CertificatePreview } from "@/components/certificates/certificate-preview";

// In the certificate section:
<CertificatePreview 
    diplomaTitle="{Topic Name}"
    primaryColor={BRAND.primary}
/>
```

### CRITICAL - No Chat Widget:
Do NOT include FloatingChatWidget. Remove the import and component if copied.

**After completing: Update fix_plan.md - mark "Create landing page" as [x]**

---

## Step 7.3: Set Correct Meta Pixel

**IMPORTANT**: Each diploma needs the correct pixel for its category.

### 1. Lookup Pixel from Planning CSV:
**File:** `docs/mini-diploma/mini_diploma_planning.csv`

Find the row for this diploma and get `pixel_name` and `pixel_id`.

### 2. Add to PIXEL_CONFIG (if new):
**File:** `src/components/tracking/meta-pixel.tsx`

```typescript
export const PIXEL_CONFIG = {
    // ... existing pixels
    {PIXEL_NAME}: '{pixel_id}',  // ← ADD IF NOT EXISTS
};
```

### 3. Use in Landing Page:
In the landing page file, update the MetaPixel component:

```tsx
import { PIXEL_CONFIG } from "@/components/tracking/meta-pixel";

// In JSX:
<MetaPixel pixelId={PIXEL_CONFIG.{PIXEL_NAME}} />
```

### Pixel Category Reference:
| Niche Keywords | Pixel Name | Pixel ID |
|----------------|------------|----------|
| functional, gut, health | SarahFunctionalMedicine | 1322772629882941 |
| spiritual, reiki, energy | LunaSpiritualEnergy | 2704198756438773 |
| christian, faith | GraceFaithBased | 519202804384181 |
| parenting, child | EmmaParenting | 1406328650457869 |
| grief, end-of-life | OliviaGriefEndoflife | 24407167482235913 |
| neurodiversity, adhd | OliviaNeurodiversity | 1385545802948983 |
| ... see `docs/ad_accs_and_pixels.csv` for full list |

**After completing: Update fix_plan.md - mark "Set correct Meta Pixel ID" as [x]**

---

## Step 7.5: Add to diploma-configs.ts

**File:** `src/components/lead-portal/diploma-configs.ts`

Add a new entry for the portal dashboard. Copy structure from existing entries:

```typescript
"{portal_slug}-diploma": {
    slug: "{portal_slug}-diploma",
    name: "{Topic Name} Certification",
    shortName: "{Topic Name}",
    coachName: "Sarah",
    coachImage: "/coaches/sarah-coach.webp",
    modules: [
        {
            id: 1,
            title: "Module 1 Title",
            description: "Module description",
            icon: "BookOpen",
            lessons: [
                { id: 1, title: "Lesson 1 Title", duration: "7 min" },
                { id: 2, title: "Lesson 2 Title", duration: "7 min" },
                { id: 3, title: "Lesson 3 Title", duration: "7 min" },
            ],
        },
        // ... 2 more modules with 3 lessons each (total 9 lessons)
    ],
},
```

**After completing: Update fix_plan.md - mark "Add to diploma-configs.ts" as [x]**

---

## Step 7.6: Create Lesson Content JSON

**File:** `src/components/mini-diploma/lessons/content/{portal_slug}.json`

Create a JSON file with all 9 lessons. Follow this structure:

```json
{
  "niche": "{portal_slug}",
  "nicheLabel": "{Topic Name} Certification",
  "baseUrl": "/portal/{portal_slug}",
  "courseSlug": "{course_slug}",
  "lessons": [
    {
      "id": 1,
      "title": "Lesson 1 Title from spec",
      "subtitle": "Engaging subtitle",
      "readingTime": "7 min",
      "sections": [
        { "type": "intro", "content": "Hey {name}! Welcome message..." },
        { "type": "heading", "content": "Section Heading" },
        { "type": "text", "content": "Paragraph text..." },
        { "type": "list", "content": "List title:", "items": ["Item 1", "Item 2"] },
        { "type": "key-point", "content": "Important takeaway..." },
        { "type": "quote", "content": "Graduate testimonial..." },
        { "type": "callout", "content": "Tip or warning", "style": "tip" }
      ],
      "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"]
    }
    // ... 9 lessons total
  ]
}
```

### Section Types:
- `intro` - Sarah welcome message (use `{name}` placeholder)
- `heading` - H2 section heading
- `text` - Paragraph text
- `list` - Bullet list with `items` array
- `key-point` - Highlighted key insight
- `quote` - Graduate testimonial
- `callout` - Info/tip/warning box with `style`: "info" | "warning" | "success" | "tip"

**Reference:** See `spiritual-healing.json` for a complete example.

**After completing: Update fix_plan.md - mark "Create lesson content JSON" as [x]**

---

## Step 7.7: Add to Dynamic Lesson Router

**File:** `src/components/mini-diploma/lessons/shared/dynamic-lesson-router.tsx`

1. Add import at top:
```typescript
import {portalSlugCamelCase}Content from "../content/{portal_slug}.json";
```

2. Add to `LESSON_CONTENT` object:
```typescript
"{portal_slug}": {portalSlugCamelCase}Content as NicheContent,
```

> [!CAUTION]
> **🚨 CRITICAL: Without step 3, the portal will show FUNCTIONAL MEDICINE CONTENT instead of your new niche content!**
> This bug is SILENT - no errors, just wrong content displayed to users.

3. **File:** `src/app/(lead)/portal/[slug]/lesson/[id]/page.tsx`

   Add portal slug to `DYNAMIC_CONTENT_NICHES` array (around line 12):
   ```typescript
   const DYNAMIC_CONTENT_NICHES = ["spiritual-healing", "energy-healing", "christian-coaching", "gut-health", "reiki-healing", "adhd-coaching", "{portal_slug}"];
   ```

**After completing: Update fix_plan.md - mark "Add to dynamic-lesson-router" as [x]**

---

## Step 7.8: Add to DIPLOMA_TAG_PREFIX

**File:** `src/app/(lead)/layout.tsx`

Add the new diploma to the `DIPLOMA_TAG_PREFIX` map (around line 14):

```typescript
const DIPLOMA_TAG_PREFIX: Record<string, string> = {
    // ... existing entries
    "{portal_slug}-diploma": "{portal_slug}-lesson-complete",
};
```

**After completing: Update fix_plan.md - mark "Add to DIPLOMA_TAG_PREFIX" as [x]**

---

## Step 7.10: Generate SMS Template for GHL

**Create:** `docs/sms-sequences/{portal_slug}-sms.md`

Generate a complete SMS sequence file for GoHighLevel with these messages:

### PRE-COMPLETION (Maximize Starts & Completion):
1. **Welcome** (Immediate): Access ready link + 48h urgency
2. **Nudge** (3h, no start): "47 others started" social proof
3. **First Lesson Done** (L1 complete): Celebration + L2 link
4. **Stalled** (24h no progress): "You left off at Lesson X"
5. **Almost Done** (L7 complete): "Just 2 lessons left!"
6. **Final Urgency** (6h before expiry): "Only 6 hours left!"

### POST-COMPLETION (CRO Sequence):
7. **Certificate Ready** (1h after pass): Download + share link
8. **Upgrade Teaser** (4h after): "Go PRO - 70% off for 24h"
9. **Social Proof** (12h after): "3 from your cohort upgraded"
10. **Final CRO** (23h after): "Last chance - expires in 1h"

Include GHL trigger tags and tracking variables in the file.

**Reference:** See `docs/sms-sequences/spiritual-healing-sms.md` for format.

**After completing: Update fix_plan.md - mark "Generate SMS template" as [x]**

---

## Step 8: Verify Build

// turbo
Run `npm run build` to check for TypeScript errors.

If build fails, fix errors and run again.

**After build passes: Update fix_plan.md - mark "Verify build passes" as [x]**

---

## Step 8.5: Create 60-Day Nurture Sequence

**IMPORTANT**: Universal email templates exist at `docs/mini-diploma/EMAIL_SEQUENCES.md` (62 templates!)

### EMAIL_SEQUENCES.md Contains:
| Part | Name | Count | Purpose |
|------|------|-------|---------|
| 1 | Pre-Completion | 6 | Get them to FINISH |
| 1B | **Milestone & Progress** | 8 | Celebrate lessons, prevent stalls |
| 2 | Post-Completion | 8 | Convert to $397 scholarship |
| 3 | DM Nurturing | 7 | Personal conversation |
| 3B | **Milestone DMs** | 7 | DM progress celebration |
| 4 | SMS Templates | 4 | GHL messaging |
| 6 | Winback | 4 | Recover scholarship-expired |
| 7 | Downsell | 3 | $497 core, $297 audit |
| 8 | Long-Term Nurture | 7 | Days 7-90 value |
| 9 | Revival | 1 | Re-engage clicks |
| 10 | **Hormozi Warming** | 7 | Deep CRO (tragic stories, proof stacks) |

### All emails have niche placeholders:
- `{{nicheName}}` - Topic name (Reiki Healing, ADHD Coaching)
- `{{nicheDisplayName}}` - Credential title (Certified Reiki Practitioner)
- `{{boardCertName}}` - Full title (Board Certified {{nicheName}} Specialist)
- `{{firstName}}` - User's first name

### Accreditation Block (use in emails):
> **ASI-Verified & Internationally Recognized**
> Backed by: CMA • IPHM • CPD • IAOTH • ICAHP • IGCT • CTAA • IHTCP • IIOHT

### Current Pricing:
- Mini Diploma: FREE
- Board Certification Scholarship: **$397** (was $997)
- Payment Plan: 2x $199

**File to create:** `src/lib/{portal_slug}-nurture-60-day.ts`

Copy from an existing sequence (e.g., `health-coach-nurture-60-day.ts`) and replace:
- All niche-specific text (e.g., "functional medicine" → "{Topic Name}")
- Tag prefixes (e.g., "fm-nurture" → "{portal_slug}-nurture")

```typescript
import { NurtureEmail } from "./wh-nurture-60-day";

export const {TOPIC_UPPER}_NURTURE_SEQUENCE: NurtureEmail[] = [
    // Email templates from EMAIL_SEQUENCES.md with niche name replaced
    {
        day: 1,
        hour: 9,
        subject: "🎓 {firstName}, your {Topic Name} certificate is ready!",
        body: `...content from EMAIL_SEQUENCES.md...`,
        tags: ["{portal_slug}-nurture:day-1"]
    },
    // ... copy remaining emails from health-coach-nurture-60-day.ts
    // Replace all niche references with {Topic Name}
];
```

**Reference:** `docs/mini-diploma/EMAIL_SEQUENCES.md` - Part 2 (Post-Completion Sequence)

⚠️ **CRITICAL: Update .ralph/fix_plan.md - mark "Create nurture sequence" as [x]**

---

## Step 8.6: Create DM Sequence

**File to create:** `src/lib/{portal_slug}-dms.ts`

Copy from an existing DM sequence and update:

```typescript
import { SarahDM } from "./wh-sarah-dms";

export const {TOPIC_UPPER}_DMS: SarahDM[] = [
    {
        day: 2,
        hour: 14,
        message: "Hey {firstName}! 👋 Just saw you completed the {Topic Name} training. What made you decide to take the leap?",
        followUpHours: 24,
        followUp: "Did you see my message? Just checking in! 💕"
    },
    // DM 2: Lesson 3 complete
    {
        day: 3,
        hour: 10,
        message: "How's it clicking for you so far? Any questions on the {Topic Name} concepts?",
    },
    // ... Add remaining DMs from EMAIL_SEQUENCES.md Part 3
];
```

**Reference:** `docs/mini-diploma/EMAIL_SEQUENCES.md` - Part 3 (DM Nurturing Sequence)

⚠️ **CRITICAL: Update .ralph/fix_plan.md - mark "Create DM sequence" as [x]**

---

## Step 8.7: Create SMS Template for GHL

**File to create:** `docs/sms-sequences/{portal_slug}-sms.md`

Create SMS template doc for GoHighLevel with these messages:

```markdown
# {Topic Name} SMS Sequence for GHL

## Pre-Completion SMS

### SMS 1: Welcome (Trigger: Signup)
```
Hey {{firstName}}! Your {Topic Name} Mini Diploma is ready 🎓 Start now while it's fresh: {{lessonLink}} — Sarah
```

### SMS 2: Reminder (Trigger: +24h, not started)
```
{{firstName}}, quick reminder: your training access expires in 24h! Takes about an hour total: {{lessonLink}}
```

### SMS 3: Urgency (Trigger: +44h, not completed)
```
{{firstName}}, only 4 hours left on your {Topic Name} access! Finish now: {{lessonLink}} — Sarah
```

## Post-Completion SMS

### SMS 4: Celebration (Trigger: Exam passed)
```
🎉 YOU DID IT! Your {Topic Name} certificate is ready. Check your email for the download link! — Sarah
```

### SMS 5: Scholarship (Trigger: +6h post-exam)
```
{{firstName}}, I sent you something special — a scholarship for Board Certification. Check your inbox! Expires in 48h.
```
```

**Reference:** `docs/mini-diploma/EMAIL_SEQUENCES.md` - Part 4 (SMS Templates)

⚠️ **CRITICAL: Update .ralph/fix_plan.md - mark "Generate SMS template" as [x]**

---

## Step 8.8: Register Sequences in Registry

**File:** `src/lib/mini-diploma-registry.ts`

1. **Add imports at top:**
```typescript
import { {TOPIC_UPPER}_NURTURE_SEQUENCE } from "./{portal_slug}-nurture-60-day";
import { {TOPIC_UPPER}_DMS } from "./{portal_slug}-dms";
```

2. **Update the config entry to use the new sequences:**
```typescript
"{course_slug}": {
    // ... other config
    nurtureSequence: {TOPIC_UPPER}_NURTURE_SEQUENCE,
    dmSequence: {TOPIC_UPPER}_DMS,
}
```

⚠️ **CRITICAL: Update .ralph/fix_plan.md - mark "Register sequences" as [x]**

---

## Step 8.9: Add to Nudge Cron (48-hour non-starter sequence)

**File:** `src/app/api/cron/mini-diploma-nudges/route.ts`

1. **Find the lead tag query** (search for "lead:functional-medicine-mini-diploma")

2. **Add new diploma to the OR clause:**
```typescript
OR: [
    { tag: "lead:functional-medicine-mini-diploma" },
    { tag: "lead:fm-healthcare-mini-diploma" },
    { tag: "lead:spiritual-healing-mini-diploma" },
    { tag: "lead:{portal_slug}-mini-diploma" },  // ← ADD THIS
]
```

3. **Add to lesson complete check:**
```typescript
NOT: {
    tags: {
        some: { 
            OR: [
                { tag: { startsWith: "functional-medicine-lesson-complete:" } },
                { tag: { startsWith: "spiritual-healing-lesson-complete:" } },
                { tag: { startsWith: "{portal_slug}-lesson-complete:" } },  // ← ADD
            ]
        }
    }
}
```

**NOTE**: Nudge emails use universal templates from EMAIL_SEQUENCES.md Part 1. Dashboard links are auto-generated based on lead tag.

⚠️ **CRITICAL: Update .ralph/fix_plan.md - mark "Add to nudge cron" as [x]**

---

## Step 8.10: Verify All Crons Work

Check that sequence crons read from registry correctly:

1. **Sequence email cron** (`send-sequence-emails/route.ts`):
   - Must iterate `MINI_DIPLOMA_REGISTRY`
   - Must use `nurtureSequence` from each config

2. **DM cron** (`send-scheduled-dms/route.ts`):
   - Must iterate `MINI_DIPLOMA_REGISTRY`
   - Must use `dmSequence` from each config

**No code change needed** if registry is correct and crons iterate all diplomas.

⚠️ **CRITICAL: Update .ralph/fix_plan.md - mark "Verify sequence cron" as [x]**

---

## Step 8.11: Update Planning CSV Status

**IMPORTANT**: After all steps complete, update the tracking CSV.

**File:** `docs/mini-diploma/mini_diploma_planning.csv`

Find the row for this diploma and change `status` from "planned" to "done":

```csv
...,reiki-healing-mini-diploma,...,planned  ← BEFORE
...,reiki-healing-mini-diploma,...,done     ← AFTER
```

This tracks what's been created vs. still pending.

⚠️ **CRITICAL: Update .ralph/fix_plan.md - mark "Update planning CSV status" as [x]**

---

## Step 9: Send EXIT_SIGNAL

**CRITICAL**: When ALL tasks are complete, output this EXACT block:

```
RALPH_STATUS:
EXIT_SIGNAL: true
REASON: project_complete
SUMMARY: Created {Topic Name} mini diploma - landing page, registry, API, auth, config, pixel, 60-day nurture sequence, DM sequence, cron registration all updated. Build passes. Planning CSV updated.
```

---

## Summary

When complete, verify all files were created/modified:
1. ✅ Database course created (FIRST!)
2. ✅ Lesson array in registry
3. ✅ Config entry in registry  
4. ✅ Optin API (5 locations)
5. ✅ Auth redirect
6. ✅ next.config.ts
7. ✅ Landing page created (with CertificatePreview, correct Pixel)
8. ✅ **Correct Meta Pixel ID set**
9. ✅ diploma-configs.ts (portal dashboard)
10. ✅ Lesson content JSON (9 lessons)
11. ✅ dynamic-lesson-router.tsx updated
12. ✅ **60-day nurture sequence file**
13. ✅ **DM sequence file**
14. ✅ **Sequences registered in registry**
15. ✅ **Nudge cron updated**
16. ✅ SMS template generated
17. ✅ Build passes
18. ✅ **Planning CSV status updated to "done"**

**Fully Automated After Creation (62 message templates!):**
- ✅ Pre-completion emails (6) + Milestone emails (8)
- ✅ Post-completion nurture (8) + Hormozi warming (7)
- ✅ Winback (4) + Downsell (3) + Long-term (7) + Revival (1)
- ✅ DMs: Post-completion (7) + Milestone (7)
- ✅ SMS (4)
- ✅ Lesson completion tracking
- ✅ Certificate generation
- ✅ Meta Pixel tracking (leads, views, etc.)

**All emails use niche placeholders:** `{{nicheName}}`, `{{nicheDisplayName}}`

**Manual steps for user:**
- Test opt-in flow at `/{course_slug}`
- Test portal at `/portal/{portal_slug}`
- Test lessons at `/portal/{portal_slug}/lesson/1`
- (Optional) Create custom Stripe checkout link

