---
description: Create a new mini diploma from a spec
---

# New Mini Diploma Workflow

**Fully automated** - just provide a topic name, Claude Code generates everything.

## Usage

```
/new-mini-diploma Spiritual Healing
```

That's it! Claude Code will:
1. Auto-generate the JSON spec
2. Auto-generate 9 lessons
3. Create all code files
4. Update all registries
5. Build and verify

---

## Step 0: Generate JSON Spec (Automatic)

When user provides just a topic name, **automatically generate** the spec file:

**File to create:** `mini-diploma/specs/{topic-kebab}.json`

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
      "coachEmail": null,
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

### Batch Mode

If user provides a JSON/CSV file path instead of topic name:
```
/new-mini-diploma mini-diploma/specs/batch.json
```

Read the file and loop through each diploma in the array.

## Step 1: Read Templates

// turbo
Read these files for reference:
- `mini-diploma/NEW_DIPLOMA_CHECKLIST.md`
- `docs/mini-diploma/LESSON_TEMPLATE.md`

## Step 1: Generate All Values from Topic

From the diploma topic, derive:

| Value | Pattern | Example (Pet Nutrition) |
|-------|---------|-------------------------|
| `name` | Title Case | "Pet Nutrition" |
| `course_slug` | `{kebab}-mini-diploma` | `pet-nutrition-mini-diploma` |
| `portal_slug` | `{kebab}` | `pet-nutrition` |
| `tag_prefix` | `{kebab}` | `pet-nutrition` |
| `exam_category` | `{kebab}-exam` | `pet-nutrition-exam` |
| `display_name` | "Certified {Name} Specialist" | "Certified Pet Nutrition Specialist" |

## Step 2: Auto-Generate Lessons

If user didn't provide lesson titles, generate 9 lessons following this pattern:

**Module 1 - Foundation (Lessons 1-3):**
1. `{Topic} Foundations`
2. Core concept A (the "what")
3. Core concept B (the "why")

**Module 2 - Deep Dive (Lessons 4-6):**
4. Practical skill A
5. Practical skill B
6. Assessment/testing methods

**Module 3 - Application (Lessons 7-9):**
7. Client work / how to apply
8. Business / ethics
9. "Your Next Step"

**Example for "Pet Nutrition":**
```typescript
const PET_NUTRITION_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "Pet Nutrition Foundations", module: 1 },
    { id: 2, title: "Species-Specific Diets", module: 1 },
    { id: 3, title: "Reading Pet Food Labels", module: 1 },
    { id: 4, title: "Common Nutritional Issues", module: 2 },
    { id: 5, title: "Therapeutic Diets", module: 2 },
    { id: 6, title: "Nutritional Assessment", module: 2 },
    { id: 7, title: "Client Consultations", module: 3 },
    { id: 8, title: "Building Your Practice", module: 3 },
    { id: 9, title: "Your Next Step", module: 3 },
];
```

## Step 3: Update Registry

**File:** `src/lib/mini-diploma-registry.ts`

1. Add import at top (if not using fallback):
```typescript
// If using fallback, no new import needed - use HEALTH_COACH_* sequences
```

2. Add lesson array before `MINI_DIPLOMA_REGISTRY`:
```typescript
const {NAME_UPPER}_LESSONS: DiplomaLesson[] = [
    // ... generated lessons
];
```

3. Add config entry to `MINI_DIPLOMA_REGISTRY`:
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

## Step 4: Update Opt-in API

**File:** `src/app/api/mini-diploma/optin/route.ts`

Add to these 5 locations:
1. `COURSE_SLUGS`: `"{portal_slug}": "{course_slug}"`
2. `COACH_EMAILS`: `"{portal_slug}": "sarah_womenhealth@accredipro-certificate.com"`
3. `WELCOME_MESSAGES`: Copy existing entry, update text for topic
4. `getCertificationDisplayName()`: `"{portal_slug}": "{name}"`
5. `nicheNames`: `"{portal_slug}": "{name}"`

## Step 5: Update Auth Redirect

**File:** `src/app/api/auth/get-redirect/route.ts`

Add to `miniDiplomaMap`:
```typescript
"{course_slug}": "{portal_slug}",
```

## Step 6: Update next.config.ts

**File:** `next.config.ts`

Add `'{portal_slug}'` to the `diplomaSlugs` array.

## Step 7: Create Opt-in Landing Page

**Create:** `src/app/(public)/{course_slug}/page.tsx`

Copy from `src/app/(public)/functional-medicine-mini-diploma/page.tsx` and update:
- Title/headlines to match topic
- `course: "{portal_slug}"` in API call
- Redirect to `/portal/{portal_slug}`
- Update LEARNING_OUTCOMES for the topic
- Update TESTIMONIALS (generic or topic-specific)
- Update FAQs for the topic

## Step 8: Verify Build

// turbo
Run `npm run build` to check for TypeScript errors.

## Step 9: Summary for User

Tell user:
1. ✅ Created lesson array: `{NAME_UPPER}_LESSONS`
2. ✅ Added to registry
3. ✅ Updated optin API (5 locations)
4. ✅ Updated auth redirect
5. ✅ Updated next.config.ts
6. ✅ Created opt-in landing page

**Manual steps remaining:**
- Create course in database: `{course_slug}`
- Create Stripe checkout link (or use default)
- Test opt-in flow at `/{course_slug}`
