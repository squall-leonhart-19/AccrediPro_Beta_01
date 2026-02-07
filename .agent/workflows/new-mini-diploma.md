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

## CRITICAL: Make EXACTLY The Same But For New Title

**THE GOLDEN RULE**: The Functional Medicine landing page at `src/app/(public)/functional-medicine-mini-diploma/page.tsx` is the PRODUCTION TEMPLATE.

**DO NOT** create a new landing page from scratch.
**DO** copy the FM page exactly, then change ONLY the niche-specific content.

### Step-by-Step for Landing Page:
1. **COPY** `functional-medicine-mini-diploma/page.tsx` to `{new-diploma}/page.tsx`
2. **FIND/REPLACE** these strings:
   - `functional-medicine` -> `{new-slug}`
   - `Functional Medicine` -> `{New Title}`
   - `fm-healthcare` -> `{new-slug}`
3. **CHANGE** these niche-specific elements:
   - Hero title/subtitle text
   - Testimonial names and stories
   - Lesson titles in the "3 Lessons" section
   - Certificate image path
   - Primary color (if different niche feeling)
   - **Quiz niche prop**: Add `niche="{new-slug}"` to `<SarahApplicationForm />` (see below)
4. **ADD NICHE OVERRIDE** (if not already present):
   - In `src/components/lead-portal/sarah-application-form.tsx`, add an entry to `NICHE_OVERRIDES` for the new niche slug with:
     - `q2Title`: "Q2 — Why {New Title}"
     - `q2Subtitle`: Niche-specific subtitle
     - `q2Options`: 5 niche-specific motivation options
     - `sarahCredentials`: "Clinical Director · 20+ Years in {Niche} & {Specialty}"
5. **KEEP EVERYTHING ELSE IDENTICAL**:
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
| Testimonial content | Names, stories, income claims |

### Landing Page Structure:
```
+----------------------------------------+
|  KEEP SAME (template):                 |
|  - ALL CSS and imports                 |
|  - ALL component structure             |
|  - MultiStepQualificationForm          |
|  - Meet Sarah section                  |
|  - Guarantee section                   |
|  - FAQ section (8 questions)           |
|  - Value Stack section                 |
|  - Final CTA                           |
|  - FloatingChatWidget                  |
+----------------------------------------+
|  CHANGE (niche-specific):              |
|  - Hero title/subtitle                 |
|  - 3 testimonial cards                 |
|  - 3 lesson titles                     |
|  - Color scheme (BRAND object)         |
|  - CertificatePreview component props: |
|      diplomaTitle="{New Title}"        |
|      primaryColor={BRAND.primary}      |
|  - Course slug in API call             |
|  - Pixel ID if different               |
|  - SarahApplicationForm niche prop:    |
|      niche="{new-slug}"               |
+----------------------------------------+

### Quiz Niche Customization (REQUIRED — ALL QUESTIONS):
The `SarahApplicationForm` component accepts a `niche` prop that customizes **ALL quiz questions** and Sarah's credentials per niche.

**In the landing page:**
```tsx
<SarahApplicationForm
    onSubmit={handleSubmit}
    onAccepted={() => { /* redirect */ }}
    isSubmitting={isSubmitting}
    isVerifying={isVerifying}
    niche="{new-slug}"  // ← ADD THIS
/>
```

**In `src/components/lead-portal/sarah-application-form.tsx`**, add to `NICHE_OVERRIDES`:
```tsx
"{new-slug}": {
    sarahCredentials: "Clinical Director · 20+ Years in {Niche} & {Specialty}",
    // Q1 — Niche-specific backgrounds (NOT healthcare RN/LPN/NP for non-medical niches!)
    q1Options: [
        { value: "primary-role", label: "Niche-specific primary role", icon: "🔮" },
        { value: "wellness", label: "Related wellness role", icon: "🧘" },
        { value: "caregiver", label: "Caregiver or support role", icon: "💛" },
        { value: "transition", label: "Career transition", icon: "🦋" },
        { value: "other", label: "Other — called to this work", icon: "✨" },
    ],
    // Q2 — Niche-specific motivations
    q2Title: "Q2 — Why {New Title}",
    q2Subtitle: "What's drawing you toward this work?\nBe honest...",
    q2Options: [
        { value: "help-heal", label: "Niche-specific option 1", icon: "💜" },
        { value: "own-journey", label: "Niche-specific option 2", icon: "🌱" },
        { value: "burnout", label: "Niche-specific option 3", icon: "🔥" },
        { value: "flexibility", label: "Niche-specific option 4", icon: "⏰" },
        { value: "new-chapter", label: "Niche-specific option 5", icon: "✨" },
    ],
    // Q3 — Niche-specific pain points + testimonials
    q3Title: "Q3 — What This Has Been Costing You",
    q3Subtitle: "Niche-specific cost framing...",
    q3Options: [
        { value: "pain-1", label: "Niche-specific pain point 1", icon: "🙈" },
        // ... 6 total
    ],
    q3Testimonials: {
        "pain-1": { quote: "Relevant testimonial...", name: "Name, Age", location: "State" },
        // ... one per q3 option
    },
    // Q4 — Niche-specific barriers
    q4Options: [
        { value: "unsure-where", label: "Niche-specific barrier 1", icon: "🤔" },
        // ... 5 total
    ],
    // Q5 — Niche-specific success goals
    q5Options: [
        { value: "side-income", label: "Niche-specific side goal", icon: "🌱" },
        { value: "replace-income", label: "Niche-specific growth goal", icon: "📈" },
        { value: "full-practice", label: "Niche-specific full practice goal", icon: "🚀" },
    ],
    // Q7 — Niche-specific investment framing
    q7Subtitle: "The Foundation Diploma gives you the {niche} fundamentals...",
    // Q8 — Niche-specific readiness vision
    q8Subtitle: "Imagine 8 weeks from now — certified in {niche}, working from home...",
},
```

> **⚠️ Without this, ALL quiz questions default to Functional Medicine!**  
> Q1 will show "Healthcare professional (RN, LPN, NP)" which is wrong for spiritual/energy/coaching niches.

### Buyer Persona JSON (REQUIRED):
Create a comprehensive buyer persona for the niche:

**File:** `src/data/buyer-personas/{portal_slug}.json`

Must include: `primaryBuyer`, `psychographics`, `segments` (5 buyer types with percentages), `emotionalDrivers`, `objections` (top 5 with reframes), `contentTriggers`, `adTargeting` (interests, behaviors, demographics), and `quizMapping`.

**Reference:** See `src/data/buyer-personas/spiritual-healing.json` for gold-standard example.
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

## AI Fallback Chain (If Capped)

If Claude Code hits spending cap, use this fallback chain:

```
Claude Code (Account 1) --- PRIMARY
       | if "spending cap reached"
Claude Code (Account 2) --- Switch: ~/.ralph/claude-switch.sh 2
       | if both capped
Gemini API (gemini-3-flash-preview) --- Use for text generation
       | or
Use HEALTH_COACH fallback sequences --- Functional, just not niche-specific
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

## CRITICAL: Task Tracking (MANDATORY)

**After completing EACH step, you MUST update `.ralph/fix_plan.md`**

**Ralph checks this file to know when to exit. If you don't update checkmarks, Ralph will loop forever!**

Mark completed items with `[x]`:
```markdown
- [x] Step 1: Read spec
- [x] Step 2: Add lessons to registry
- [ ] Step 3: Add config to registry  <-- currently working
```

**HOW TO UPDATE:** Replace `- [ ]` with `- [x]` after each step completes.

---

## Step 0: Reset + Create Database Course (MANDATORY FIRST!)

> [!CAUTION]
> **ALWAYS reset the Ralph session before starting a new mini diploma!**
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

### Step 0: DATABASE COURSE (MANDATORY FIRST!)
- [ ] Create database course

### Step 1: Core Files
- [ ] Read/generate spec file
- [ ] Add lessons array to registry
- [ ] Add config entry to registry
- [ ] Update optin API (5 locations)
- [ ] Update auth get-redirect
- [ ] Update next.config.ts

### Step 2: Landing Page
- [ ] Create landing page (COPY FM template)
- [ ] Set correct Meta Pixel ID
- [ ] Add to diploma-configs.ts
- [ ] Add to DIPLOMA_TAG_PREFIX

### Step 3: Lesson Content
- [ ] Create lesson content JSON (3 lessons)
- [ ] Add to dynamic-lesson-router.tsx
- [ ] Add to DYNAMIC_CONTENT_NICHES

### Step 4: Media Generation + Integration
- [ ] Generate 3 doodle images (WaveSpeed API)
- [ ] Generate 3 lesson audio (ElevenLabs API)
- [ ] Upload images + audio to R2
- [ ] Inject audioUrl + imageUrl into lesson JSON

### Step 5: Exam
- [ ] Create exam JSON (5 questions, trustpilot flow)
- [ ] Add import + mapping to exam page

### Step 6: Circle Pod
- [ ] Create Zombie persona JSON
- [ ] Create Sarah knowledge JSON
- [ ] Create 45-day curriculum (days 9-23 + 24-45)
- [ ] Update seed route + seed to database

### Step 7: Nurture Email Sequence
- [ ] Create 60-day nurture sequence (NICHE-SPECIFIC copy)
- [ ] Register nurture sequence in registry

### Step 8: SMS
- [ ] Generate SMS template for GHL

### Step 9: Verification
- [ ] Verify build passes
- [ ] Update planning CSV status to "done"

## Completed
(move items here when done)
```

**THEN**, create the database course:

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

**DO NOT SKIP THIS STEP - enrollment will break!**

---

## Step 1: Core Files (Registry + APIs + Auth + next.config)

### Step 1.1: Generate/Read Spec

If user provides just a topic name, **automatically generate** the spec file:

**File to create:** `docs/mini-diploma/specs/{topic-kebab}.json`

```json
{
  "diplomas": [
    {
      "topic": "{Topic Name}",
      "lessons": [
        "{Topic} Foundations",
        "The D.E.P.T.H. Method for {Topic}",
        "How To Get Your First Clients"
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

**After completing: Update fix_plan.md - mark "Read/generate spec file" as [x]**

### Step 1.2: Generate Slugs

From the diploma topic, derive:

| Value | Pattern | Example (Pet Nutrition) |
|-------|---------|-------------------------|
| `name` | Title Case | "Pet Nutrition" |
| `course_slug` | `{kebab}-mini-diploma` | `pet-nutrition-mini-diploma` |
| `portal_slug` | `{kebab}` | `pet-nutrition` |
| `tag_prefix` | `{kebab}` | `pet-nutrition` |
| `exam_category` | `{kebab}-exam` | `pet-nutrition-exam` |
| `display_name` | "Certified {Name} Specialist" | "Certified Pet Nutrition Specialist" |

### Step 1.3: Update Registry

**File:** `src/lib/mini-diploma-registry.ts`

1. Add lesson array before `MINI_DIPLOMA_REGISTRY`:
```typescript
const {NAME_UPPER}_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "Lesson 1", module: 1 },
    // ... 3 lessons from spec
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
    nudgePrefix: "{tag_prefix}-nudge",
    nurturePrefix: "{tag_prefix}-nurture",
    completionTag: "{course_slug}:completed"
}
```

**After completing: Update fix_plan.md - mark both registry items as [x]**

### Step 1.4: Update Opt-in API

**File:** `src/app/api/mini-diploma/optin/route.ts`

Add to these 5 locations:
1. `COURSE_SLUGS`: `"{portal_slug}": "{course_slug}"`
2. `COACH_EMAILS`: `"{portal_slug}": "sarah_womenhealth@accredipro-certificate.com"`
3. `WELCOME_MESSAGES`: Copy existing entry, update text for topic
4. `getCertificationDisplayName()`: `"{portal_slug}": "{name}"`
5. `nicheNames`: `"{portal_slug}": "{name}"`

**After completing EACH: Update fix_plan.md - mark "Update optin API (5 locations)" as [x]**

### Step 1.5: Update Auth Redirect

**File:** `src/app/api/auth/get-redirect/route.ts`

Add to `miniDiplomaMap`:
```typescript
"{course_slug}": "{portal_slug}",
```

> [!NOTE]
> The redirect query uses `orderBy: { enrolledAt: 'desc' }` (NOT `createdAt`).
> The Enrollment table uses `enrolledAt` for the timestamp field.

**After completing: Update fix_plan.md - mark "Update auth get-redirect" as [x]**

### Step 1.6: Update next.config.ts

**File:** `next.config.ts`

Add `'{portal_slug}'` to the `diplomaSlugs` array.

**After completing: Update fix_plan.md - mark "Update next.config.ts" as [x]**

---

## Step 2: Landing Page (COPY FM Template)

### Step 2.1: Create Opt-in Landing Page

**Create:** `src/app/(public)/{course_slug}/page.tsx`

Copy from `src/app/(public)/functional-medicine-mini-diploma/page.tsx` and update:

#### Required Changes:
- Brand colors to match spec (see color table in Step 1)
- Title/headlines to match topic
- `course: "{portal_slug}"` in API call
- Redirect to `/portal/{portal_slug}`
- Update LEARNING_OUTCOMES for the topic
- Update lesson titles in the curriculum section
- Update TESTIMONIALS (keep structure, adjust copy)
- Update FAQs for the topic

#### CRITICAL - Certificate Preview:
Use the `CertificatePreview` component instead of static image:
```tsx
import { CertificatePreview } from "@/components/certificates/certificate-preview";

// In the certificate section:
<CertificatePreview
    diplomaTitle="{Topic Name}"
    primaryColor={BRAND.primary}
/>
```

#### CRITICAL - No Chat Widget:
Do NOT include FloatingChatWidget. Remove the import and component if copied.

**After completing: Update fix_plan.md - mark "Create landing page" as [x]**

### Step 2.2: Set Correct Meta Pixel

**IMPORTANT**: Each diploma needs the correct pixel for its category.

#### 1. Lookup Pixel from Planning CSV:
**File:** `docs/mini-diploma/mini_diploma_planning.csv`

Find the row for this diploma and get `pixel_name` and `pixel_id`.

#### 2. Add to PIXEL_CONFIG (if new):
**File:** `src/components/tracking/meta-pixel.tsx`

```typescript
export const PIXEL_CONFIG = {
    // ... existing pixels
    {PIXEL_NAME}: '{pixel_id}',  // <-- ADD IF NOT EXISTS
};
```

#### 3. Use in Landing Page:
In the landing page file, update the MetaPixel component:

```tsx
import { PIXEL_CONFIG } from "@/components/tracking/meta-pixel";

// In JSX:
<MetaPixel pixelId={PIXEL_CONFIG.{PIXEL_NAME}} />
```

#### Pixel Category Reference:
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

### Step 2.3: Add to diploma-configs.ts

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
            title: "{Topic Name} Certification",
            description: "Complete certification program",
            icon: "BookOpen",
            lessons: [
                { id: 1, title: "{Topic} Foundations", duration: "10 min" },
                { id: 2, title: "The D.E.P.T.H. Method for {Topic}", duration: "10 min" },
                { id: 3, title: "How To Get Your First Clients", duration: "10 min" },
            ],
        },
    ],
},
```

**After completing: Update fix_plan.md - mark "Add to diploma-configs.ts" as [x]**

### Step 2.4: Add to DIPLOMA_TAG_PREFIX

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

## Step 3: Lesson Content JSON (3 Lessons with All Section Types)

### Step 3.1: Create Lesson Content JSON

**File:** `src/components/mini-diploma/lessons/content/{portal_slug}.json`

Create a JSON file with all 3 lessons. Follow this structure:

```json
{
  "niche": "{portal_slug}",
  "nicheLabel": "{Topic Name} Certification",
  "baseUrl": "/portal/{portal_slug}",
  "courseSlug": "{course_slug}",
  "lessons": [
    {
      "id": 1,
      "title": "{Topic} Foundations",
      "subtitle": "Engaging subtitle",
      "readingTime": "10 min",
      "sections": [
        { "type": "intro", "content": "Hey {name}! Welcome message..." },
        { "type": "heading", "content": "Section Heading" },
        { "type": "text", "content": "Paragraph text..." },
        { "type": "list", "content": "List title:", "items": ["Item 1", "Item 2"] },
        { "type": "key-point", "content": "Important takeaway..." },
        { "type": "quote", "content": "Graduate testimonial..." },
        { "type": "callout", "content": "Tip or warning", "style": "tip" },
        { "type": "checkpoint", "content": "Quick check -- what did you learn?" },
        { "type": "reveal-card", "content": "Click to reveal the answer..." },
        { "type": "micro-commitment", "content": "Are you ready to take the next step?" },
        { "type": "income-calculator", "content": "Calculate your potential earnings" },
        { "type": "framework", "content": "The D.E.P.T.H. Method framework" },
        { "type": "before-after", "content": "Before vs. after transformation" },
        { "type": "definition", "content": "Key term definition" }
      ],
      "keyTakeaways": ["Takeaway 1", "Takeaway 2", "Takeaway 3"]
    }
    // ... 3 lessons total
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
- `checkpoint` - Interactive knowledge check mid-lesson
- `reveal-card` - Click-to-reveal hidden content card
- `micro-commitment` - Yes/no commitment prompt to boost engagement
- `income-calculator` - Interactive income projection calculator
- `framework` - Visual framework/method display (e.g., D.E.P.T.H. Method)
- `before-after` - Before vs. after transformation comparison
- `definition` - Key term definition with highlight styling

**Reference:** See `spiritual-healing.json` for a complete example.

**After completing: Update fix_plan.md - mark "Create lesson content JSON" as [x]**

### Step 3.2: Add to Dynamic Lesson Router

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
> **CRITICAL: Without step 3, the portal will show FUNCTIONAL MEDICINE CONTENT instead of your new niche content!**
> This bug is SILENT - no errors, just wrong content displayed to users.

3. **File:** `src/app/(lead)/portal/[slug]/lesson/[id]/page.tsx`

   Add portal slug to `DYNAMIC_CONTENT_NICHES` array (around line 12):
   ```typescript
   const DYNAMIC_CONTENT_NICHES = ["spiritual-healing", "energy-healing", "christian-coaching", "gut-health", "reiki-healing", "adhd-coaching", "{portal_slug}"];
   ```

**After completing: Update fix_plan.md - mark "Add to dynamic-lesson-router.tsx" and "Add to DYNAMIC_CONTENT_NICHES" as [x]**

---

## Step 4: Generate Media + Embed in Lesson JSON

**This step generates all media (images + audio) and injects the URLs back into the lesson JSON created in Step 3.**

### Step 4.1: Generate Doodle Images (WaveSpeed API)

Uses 20 parallel API keys with nano-banana-pro model for 4K images.

#### Brand Standard: Whiteboard Doodle Aesthetic
- Style: Hand-drawn whiteboard sketch
- Colors: Black marker on cream/off-white paper
- Feel: Student notebook, authentic, not polished
- Purpose: Visual breaks, concept illustration, engagement

// turbo
```bash
cd /Users/pochitino/Desktop/accredipro-lms/scripts/wavespeed-image-gen && \
python3 generate_lesson_images.py --niche {portal_slug}
```

**Output:** `public/images/lessons/{portal_slug}/lesson-{1-3}-doodle.png`
**Time:** ~30 seconds for all 3 images (parallel generation)

**Custom prompts:** Create `prompts.json` with lesson-specific prompts:
```json
{
  "lesson_1": "Hand-drawn whiteboard sketch about {niche concept}...",
  "lesson_2": "...",
  "lesson_3": "..."
}
```

Then run: `python3 generate_lesson_images.py --niche {slug} --prompts prompts.json`

#### Lesson Image Prompt Patterns (Customize per niche):

**Lesson 1 - Foundations:**
```
Root cause thinking - stick figure with symptoms (tired, bloated, anxious) with red X marks,
arrow pointing to "ROOT CAUSE" with magnifying glass, then happy stick figure with checkmarks.
Bottom text: "Fix the cause, not the symptom"
```

**Lesson 2 - D.E.P.T.H. Method:**
```
Framework diagram - D.E.P.T.H. acronym with each letter connected to a concept,
arrows showing the flow from assessment to transformation.
Bottom text: "The method that changes everything"
```

**Lesson 3 - Getting Clients:**
```
Client funnel - top shows "YOUR NETWORK" with stick figures, middle shows "FREE VALUE"
with heart, bottom shows "PAYING CLIENTS $$" with money symbols.
Bottom text: "Help first, sell second"
```

### Step 4.2: Generate Lesson Audio (ElevenLabs API)

Uses ElevenLabs API for fast, high-quality Sarah voice narration.

// turbo
```bash
npx tsx scripts/generate-lesson-audio-elevenlabs.ts --niche {portal_slug} --upload
```

**What this script does:**
1. Reads the lesson JSON from `src/components/mini-diploma/lessons/content/{portal_slug}.json`
2. Generates audio scripts from lesson content
3. Calls ElevenLabs API to generate MP3s with Sarah's voice
4. Saves MP3s locally
5. Uploads to R2 (with `--upload` flag)
6. Prints R2 URLs for embedding

**Output:** R2 URLs automatically printed for embedding
**Time:** ~30 seconds for all 3 lessons

### Step 4.3: Upload to R2

If not already uploaded by the scripts above, manually upload:

// turbo
```bash
# Upload images
for i in {1..3}; do
  wrangler r2 object put accredipro/images/lessons/{portal_slug}/lesson-$i-doodle.png \
    --file=public/images/lessons/{portal_slug}/lesson-$i-doodle.png
done

# Upload audio (if not already uploaded by --upload flag)
for i in {1..3}; do
  wrangler r2 object put accredipro/audio/{portal_slug}/lesson-$i.mp3 \
    --file=output/audio/{portal_slug}/lesson-$i.mp3
done
```

**Public URLs:**
- Images: `https://media.accredipro.academy/images/lessons/{portal_slug}/lesson-{N}-doodle.png`
- Audio: `https://media.accredipro.academy/audio/{portal_slug}/lesson-{N}.mp3`

### Step 4.4: Inject audioUrl + imageUrl into Lesson JSON

Update the lesson JSON file created in Step 3 to include media URLs.

**File:** `src/components/mini-diploma/lessons/content/{portal_slug}.json`

For each lesson, add image and audio sections:

Add `type: 'image'` section (after income-hook or key-point):
```json
{
    "type": "image",
    "imageUrl": "https://media.accredipro.academy/images/lessons/{portal_slug}/lesson-1-doodle.png",
    "imageAlt": "Visual illustration of lesson concept",
    "content": "Understanding the key concept"
}
```

Add `type: 'pre-recorded-audio'` section:
```json
{
    "type": "pre-recorded-audio",
    "audioUrl": "https://media.accredipro.academy/audio/{portal_slug}/lesson-1.mp3",
    "audioDuration": 180,
    "content": "Listen to Sarah explain this lesson"
}
```

### Step 4.5: Verify Lesson JSON is Complete with Media

Check that each of the 3 lessons has:
- [x] `imageUrl` pointing to a valid R2 URL
- [x] `audioUrl` pointing to a valid R2 URL
- [x] All section types are present
- [x] Build still passes after JSON updates

**After completing: Update fix_plan.md - mark all Step 4 items as [x]**

---

## Step 5: Exam JSON (5 Questions + Trustpilot)

**File to create:** `src/components/mini-diploma/exams/content/{portal_slug}.json`

Each mini diploma MUST have its own niche-specific exam questions. Do NOT reuse fallbacks.

### JSON Structure:
```json
{
    "nichePrefix": "{2-letter prefix}",
    "nicheLabel": "{Topic Name} Mini Diploma",
    "nicheDisplayName": "Certified {Topic Name} Specialist",
    "examCategory": "{portal_slug}",
    "passScore": 80,
    "scholarshipScore": 95,
    "hasMasterclass": false,
    "postExamFlow": "trustpilot",
    "trustpilotUrl": "https://www.trustpilot.com/review/accredipro.academy",
    "testimonials": [
        {
            "quote": "Exam testimonial 1",
            "name": "First L.",
            "location": "State"
        },
        {
            "quote": "Exam testimonial 2",
            "name": "Second N.",
            "location": "State"
        }
    ],
    "questions": [
        {
            "id": 1,
            "question": "Question text from Lesson 1?",
            "lessonRef": 1,
            "options": [
                { "id": "a", "text": "Wrong answer" },
                { "id": "b", "text": "CORRECT answer - always detailed and educational" },
                { "id": "c", "text": "Wrong answer" },
                { "id": "d", "text": "Wrong answer" }
            ],
            "correctAnswer": "b"
        }
        // ... 5 questions total (1-2 per lesson, lessonRefs 1-3)
    ]
}
```

### Question Guidelines:
- **5 questions total** - covering all 3 lessons
- **lessonRef** must be 1, 2, or 3 matching the lesson the question covers
- **Correct answer is ALWAYS "b"** - makes grading predictable
- **Wrong answers should be plausible but clearly wrong**
- **Questions should test practical knowledge, not trivia**

### After creating JSON, add to exam page:

**File:** `src/app/(lead)/portal/[slug]/exam/page.tsx`

1. Add import at top:
```typescript
import {portalSlugCamelCase}Exam from "@/components/mini-diploma/exams/content/{portal_slug}.json";
```

2. Add to EXAM_CONFIGS:
```typescript
"{portal_slug}": {portalSlugCamelCase}Exam as ExamConfig,
```

**Reference:** See existing exam files like `spiritual-healing.json` for complete examples.

**After completing: Update fix_plan.md - mark "Create exam JSON" and "Add import + mapping to exam page" as [x]**

---

## Step 6: Circle Pod (Zombie Persona + Sarah Knowledge + 45-Day Curriculum + Seed)

### Step 6.1: Create Zombie Persona JSON

**File to create:** `src/data/zombies/{portal_slug}-{name}.json`

Each mini diploma needs a unique zombie persona with a detailed backstory:

```json
{
    "nicheId": "{portal_slug}",
    "zombie": {
        "id": "{portal_slug}-{firstname}",
        "name": "{FirstName}",
        "age": 48,
        "avatar": "/zombies/{firstname}.webp",
        "niche": "{portal_slug}",
        "backstory": "Dramatic personal story that makes them relatable... Struggles, pain, what they overcame...",
        "dramaticMoment": "The breaking point when everything changed - emotional, use emoji...",
        "transformation": "From [before state] -> To [after state with income]",
        "incomeStory": "$X,XXX/month working XX hours/week. Started with $0. Now have a waitlist.",
        "writingStyle": {
            "capitalization": "mostly lowercase",
            "emojis": ["...", "..."],
            "punctuation": "multiple exclamation marks, ellipses...",
            "typos": "occasional (dont, youre, wont)",
            "tone": "warm, supportive, emotional"
        },
        "exampleMessages": [
            "omg this hit so hard my {niche} journey is literally why clients trust me now",
            "when I was struggling I would have PAID anything for someone who understood",
            "just closed my 6th client this month... still cant believe this is my life"
        ],
        "videoTestimonialScript": "Hi, I'm {Name}. [Describe struggle]... [Describe transformation]... If I can do this, you absolutely can too."
    }
}
```

#### Zombie Name Guidelines:
- Use common, relatable names (Jennifer, Lisa, Michelle, Karen, Diane)
- Match demographics to niche (e.g., younger for ADHD, older for menopause)
- Keep avatar path consistent: `/zombies/{firstname}.webp`

**After completing: Update fix_plan.md - mark "Create Zombie persona JSON" as [x]**

### Step 6.2: Create Sarah Knowledge JSON

**File to create:** `src/data/sarah-knowledge/{portal_slug}.json`

Sarah stays the SAME person but adapts her KNOWLEDGE per niche:

```json
{
    "nicheId": "{portal_slug}",
    "nicheLabel": "{Topic Name}",
    "lessonTopics": [
        "Lesson 1: {Title} - Core concepts covered",
        "Lesson 2: {Title} - Core concepts covered",
        "Lesson 3: {Title} - Core concepts covered"
    ],
    "painPoints": [
        "Common struggle 1 for this niche",
        "Common struggle 2 for this niche",
        "What makes people frustrated/stuck"
    ],
    "terminology": [
        "Key term 1 - definition",
        "Key term 2 - definition",
        "Jargon unique to this niche"
    ],
    "clientExamples": [
        "Type of client they'll help",
        "Common client transformation story"
    ],
    "credentialTitle": "Certified {Topic} Specialist",
    "practiceType": "What practitioners do in this field"
}
```

**Used by:** `circle-pod-knowledge.ts` to build Sarah's AI prompts with niche context.

**After completing: Update fix_plan.md - mark "Create Sarah knowledge JSON" as [x]**

### Step 6.3: Create 45-Day Circle Pod Curriculum

**Files to create:**
- `src/data/masterclass-{portal_slug}-days-9-23.ts`
- `src/data/masterclass-{portal_slug}-days-24-45.ts`

#### Copy and Adapt Template:
1. Copy `masterclass-days-9-23.ts` and `masterclass-days-24-45.ts`
2. Replace all FM-specific content with niche content
3. Update zombie messages to match the zombie persona

#### Structure per day:
```typescript
{
    day: 9,
    gap: "topic-keyword",
    sarah: `Morning {firstName}!

TODAY'S LESSON: {Niche-specific lesson title}

{Niche-specific content explaining a concept or giving advice}

TODAY'S ACTION:
{Specific action step for this niche}

Sarah`,
    zombies: [
        {
            minHour: 1, maxHour: 3, options: [
                "zombie reaction message 1 matching their persona",
                "zombie reaction message 2 with their emojis",
                "zombie reaction message 3 casual style",
            ]
        },
        {
            minHour: 4, maxHour: 8, options: [
                "later zombie message sharing their own experience",
                "another option for variety",
            ]
        }
    ]
}
```

#### Key Days with Audio:
Add `sarahAudioUrl` to: Day 1, 8, 14, 21, 30, 35, 42, 44

#### Key Days with Video:
Add `videoTestimonialUrl` to: Day 10, 13, 21, 30, 33, 40

**After completing: Update fix_plan.md - mark "Create 45-day curriculum" as [x]**

### Step 6.4: Seed Circle Pod Templates

**Update:** `src/app/api/admin/seed-templates/route.ts`

1. Import the new curriculum files:
```typescript
import { days9to23 as {nicheSlug}Days9to23 } from "@/data/masterclass-{portal_slug}-days-9-23";
import { days24to45 as {nicheSlug}Days24to45 } from "@/data/masterclass-{portal_slug}-days-24-45";
```

2. Add niche condition in the seed handler:
```typescript
if (niche === "{portal_slug}") {
    allDays = [...{nicheSlug}Days9to23, ...{nicheSlug}Days24to45];
    zombieProfile = require("@/data/zombies/{portal_slug}-{name}.json").zombie;
}
```

3. Seed to database:
// turbo
```bash
curl -X POST http://localhost:3000/api/admin/seed-templates?niche={portal_slug}
```

4. Verify at `/admin/circle-templates` - filter by niche, check all 45 days exist.

**After completing: Update fix_plan.md - mark "Update seed route + seed to database" as [x]**

---

## Step 7: 60-Day Nurture Email Sequence (NICHE-SPECIFIC, NOT Generic!)

> [!CAUTION]
> **DO NOT just use placeholder replacements! Every diploma MUST have UNIQUE, niche-specific email copy.**
> Generic placeholders like `{{nicheName}}` are NOT acceptable as final content.

**File to create:** `src/lib/{portal_slug}-nurture-60-day.ts`

### What "Niche-Specific" Means:

**BAD (Generic Placeholder):**
```
"Congratulations on completing your {{nicheName}} Mini Diploma!"
```

**GOOD (Niche-Specific):**
```
"You did it! You've just completed training that many doctors never receive.
Understanding chakras, energy meridians, and healing frequencies puts you
in the top 1% of spiritual practitioners."
```

### Requirements for Each Email:
1. **Niche-relevant stories** - Specific to the topic (e.g., client transformation stories)
2. **Niche-specific pain points** - What this niche's audience struggles with
3. **Niche-specific benefits** - What outcomes they'll achieve
4. **Niche credibility markers** - Relevant certifications, research, statistics

### Email Sequence Structure (21 emails minimum):

| Day | Email Type | Content Focus |
|-----|------------|---------------|
| 1 | Certificate Ready | Celebrate completion + download link |
| 2 | Story Email | Graduate success story specific to niche |
| 3 | Pain Point | Specific struggle this niche solves |
| 4 | Credibility | Why certification matters in this field |
| 5 | Urgency | Scholarship expiring + social proof |
| 7 | Long-form | Deep dive into niche topic |
| 14 | Re-engagement | "Still thinking about certification?" |
| 21 | Winback | Last chance messaging |
| 30-60 | Value nurture | Weekly helpful content for niche |

### Reference for Email Structure:
- `docs/mini-diploma/EMAIL_SEQUENCES.md` - Template structures (use as SKELETON only)
- `src/lib/fm-nurture-60-day.ts` - Example of niche-specific FM emails

### Register Nurture Sequence in Registry

**File:** `src/lib/mini-diploma-registry.ts`

1. **Add import at top:**
```typescript
import { {TOPIC_UPPER}_NURTURE_SEQUENCE } from "./{portal_slug}-nurture-60-day";
```

2. **Update the config entry to use the new sequence:**
```typescript
"{course_slug}": {
    // ... other config
    nurtureSequence: {TOPIC_UPPER}_NURTURE_SEQUENCE,
}
```

**CRITICAL: Update .ralph/fix_plan.md - mark "Create 60-day nurture sequence" and "Register nurture sequence in registry" as [x]**

---

## Step 8: SMS Template for GHL

**File to create:** `docs/sms-sequences/{portal_slug}-sms.md`

Generate a complete SMS sequence file for GoHighLevel with these messages:

### PRE-COMPLETION (Maximize Starts & Completion):
1. **Welcome** (Immediate): Access ready link + 48h urgency
2. **Nudge** (3h, no start): "47 others started" social proof
3. **First Lesson Done** (L1 complete): Celebration + L2 link
4. **Stalled** (24h no progress): "You left off at Lesson X"
5. **Almost Done** (L2 complete): "Just 1 lesson left!"
6. **Final Urgency** (6h before expiry): "Only 6 hours left!"

### POST-COMPLETION (CRO Sequence):
7. **Certificate Ready** (1h after pass): Download + share link
8. **Upgrade Teaser** (4h after): "Go PRO - 70% off for 24h"
9. **Social Proof** (12h after): "3 from your cohort upgraded"
10. **Final CRO** (23h after): "Last chance - expires in 1h"

Include GHL trigger tags and tracking variables in the file.

### SMS Template Format:

```markdown
# {Topic Name} SMS Sequence for GHL

## Pre-Completion SMS

### SMS 1: Welcome (Trigger: Signup)
```
Hey {{firstName}}! Your {Topic Name} Mini Diploma is ready Start now while it's fresh: {{lessonLink}} -- Sarah
```

### SMS 2: Reminder (Trigger: +24h, not started)
```
{{firstName}}, quick reminder: your training access expires in 24h! Takes about 25 minutes total: {{lessonLink}}
```

### SMS 3: Urgency (Trigger: +44h, not completed)
```
{{firstName}}, only 4 hours left on your {Topic Name} access! Finish now: {{lessonLink}} -- Sarah
```

## Post-Completion SMS

### SMS 4: Celebration (Trigger: Exam passed)
```
YOU DID IT! Your {Topic Name} certificate is ready. Check your email for the download link! -- Sarah
```

### SMS 5: Scholarship (Trigger: +6h post-exam)
```
{{firstName}}, I sent you something special -- a scholarship for Board Certification. Check your inbox! Expires in 48h.
```
```

**Reference:** `docs/sms-sequences/spiritual-healing-sms.md` for format.
**Reference:** `docs/mini-diploma/EMAIL_SEQUENCES.md` - Part 4 (SMS Templates)

**CRITICAL: Update .ralph/fix_plan.md - mark "Generate SMS template for GHL" as [x]**

---

## Step 9: Build + Verify + Update CSV

### Step 9.1: Verify Build

// turbo
Run `npm run build` to check for TypeScript errors.

If build fails, fix errors and run again.

**After build passes: Update fix_plan.md - mark "Verify build passes" as [x]**

### Step 9.2: Nudge Cron (48-hour non-starter sequence)

AUTOMATIC -- nudge cron now reads from MINI_DIPLOMA_REGISTRY automatically, no code change needed.

### Step 9.3: Verify All Crons Work

Check that sequence crons read from registry correctly:

1. **Sequence email cron** (`send-sequence-emails/route.ts`):
   - Must iterate `MINI_DIPLOMA_REGISTRY`
   - Must use `nurtureSequence` from each config

**No code change needed** if registry is correct and crons iterate all diplomas.

### Step 9.4: Update Planning CSV Status

**IMPORTANT**: After all steps complete, update the tracking CSV.

**File:** `docs/mini-diploma/mini_diploma_planning.csv`

Find the row for this diploma and change `status` from "planned" to "done":

```csv
...,reiki-healing-mini-diploma,...,planned  <-- BEFORE
...,reiki-healing-mini-diploma,...,done     <-- AFTER
```

This tracks what's been created vs. still pending.

**CRITICAL: Update .ralph/fix_plan.md - mark "Update planning CSV status" as [x]**

---

## Step 10: Send EXIT_SIGNAL

**CRITICAL**: When ALL tasks are complete, output this EXACT block:

```
RALPH_STATUS:
EXIT_SIGNAL: true
REASON: project_complete
SUMMARY: Created {Topic Name} mini diploma - landing page, registry, API, auth, config, pixel, lesson JSON with media (images + audio), exam, Circle Pod (zombie + Sarah knowledge + 45-day curriculum), 60-day nurture sequence, SMS template all updated. Build passes. Planning CSV updated.
```

---

## Summary

When complete, verify all files were created/modified:
1. Database course created (FIRST!)
2. Spec file generated
3. Lesson array in registry
4. Config entry in registry
5. Optin API (5 locations)
6. Auth redirect
7. next.config.ts
8. Landing page created (with CertificatePreview, correct Pixel)
9. **Correct Meta Pixel ID set**
10. diploma-configs.ts (portal dashboard -- 1 module, 3 lessons)
11. DIPLOMA_TAG_PREFIX updated
12. Lesson content JSON (3 lessons with all section types)
13. dynamic-lesson-router.tsx updated
14. DYNAMIC_CONTENT_NICHES updated
15. **Doodle images generated** (3 images via WaveSpeed)
16. **Audio generated via ElevenLabs** (3 MP3s, ~30 seconds total)
17. **Media uploaded to R2**
18. **audioUrl + imageUrl injected into lesson JSON**
19. Exam questions JSON (5 questions, lessonRefs 1-3, postExamFlow: trustpilot)
20. **Zombie persona JSON** (backstory, income story, writing style)
21. **Sarah knowledge JSON** (lesson topics, terminology)
22. **45-day Circle Pod curriculum** (days 9-23 + 24-45)
23. **Seeded templates** to database
24. **60-day nurture sequence file** (niche-specific copy)
25. **Nurture sequence registered in registry**
26. SMS template generated
27. Build passes
28. **Planning CSV status updated to "done"**

**Circle Pod System (Auto-runs after creation):**
- Sarah AI replies (15-60 min delay, Claude Haiku)
- Zombie AI replies (60-180 min delay, with SKIP option)
- **10 Resource tools unlock progressively** (30min -> 72h)
- Sarah gifts each tool with personalized message
- 45-day daily messages (Sarah + Zombie)

**Fully Automated After Creation:**
- Pre-completion emails (6) + Milestone emails (8)
- Post-completion nurture (8) + Hormozi warming (7)
- Winback (4) + Downsell (3) + Long-term (7) + Revival (1)
- SMS (4)
- Lesson completion tracking
- Certificate generation
- Meta Pixel tracking (leads, views, etc.)

**All emails use niche placeholders:** `{{nicheName}}`, `{{nicheDisplayName}}`

**Manual steps for user:**
- Test opt-in flow at `/{course_slug}`
- Test portal at `/portal/{portal_slug}`
- Test lessons at `/portal/{portal_slug}/lesson/1`
- Test Circle Pod at `/portal/{portal_slug}` (sidebar)
- (Optional) Create custom Stripe checkout link
