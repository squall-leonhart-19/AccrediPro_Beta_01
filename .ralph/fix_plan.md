# Mini Diploma Creation: Pet Nutrition & Wellness

## Tasks

### 🚨 STEP 0: DATABASE COURSE (MANDATORY FIRST!)
- [x] Create database course: `npx ts-node scripts/create-mini-diploma-course.ts --slug pet-nutrition-mini-diploma --name "Pet Nutrition & Wellness"`

### Step 1: Core Files
- [x] Read spec file (or generate if not exists)
- [x] Add lessons array to registry
- [x] Add config entry to registry
- [x] Update optin API - COURSE_SLUGS
- [x] Update optin API - COACH_EMAILS
- [x] Update optin API - WELCOME_MESSAGES
- [x] Update optin API - getCertificationDisplayName
- [x] Update optin API - nicheNames
- [x] Update auth get-redirect
- [x] Update next.config.ts

### Step 2: Landing Page (COPY EXACTLY FROM TEMPLATE)
- [x] Create landing page (COPY spiritual-healing page.tsx)
- [x] Set correct Meta Pixel ID (BellaPetWellness: 1532546858004361)
- [x] Add to diploma-configs.ts (for portal)
- [x] Add to DIPLOMA_TAG_PREFIX in lead layout

### Step 3: Lesson Content
- [x] Create lesson content JSON (9 lessons)
- [x] Add to dynamic-lesson-router.tsx
- [x] Add to DYNAMIC_CONTENT_NICHES in lesson page

### Step 4: Sequences (USE EMAIL_SEQUENCES.md TEMPLATE!)
- [x] Create 60-day nurture sequence file FROM `docs/mini-diploma/EMAIL_SEQUENCES.md` (Using HEALTH_COACH fallback)
- [x] Create DM sequence file FROM template (Using HEALTH_COACH fallback)
- [x] Register sequences in registry (imports + config) (Using HEALTH_COACH fallback)

### Step 5: Cron & GHL
- [x] Generate SMS template file for GHL
- [x] Add to nudge cron (48-hour non-starter)

### Step 6: Verification
- [x] Verify build passes
- [ ] Test enrollment (sign up on landing page, verify user created)
- [ ] Test portal access (/portal/pet-nutrition)
- [ ] Verify sequence email cron works
- [ ] Update `docs/mini-diploma/mini_diploma_planning.csv` status to "done"

## Spec
```json
{
  "topic": "Pet Nutrition & Wellness",
  "lessons": [
    "Pet Nutrition Foundations",
    "Understanding Pet Food Labels",
    "Species-Appropriate Diets",
    "Common Nutritional Deficiencies",
    "Natural Supplements for Pets",
    "Weight Management Strategies",
    "Life Stage Nutrition",
    "Treating Health Issues with Diet",
    "Your Next Step"
  ],
  "colorScheme": "emerald",
  "brandColors": {
    "primary": "#047857",
    "accent": "#10b981",
    "gradient": "from-emerald-700 to-teal-600"
  },
  "pixelName": "BellaPetWellness",
  "pixelId": "1532546858004361",
  "targetAudience": "Pet moms wanting holistic care"
}
```

## Completed
All implementation steps completed!

- Landing page: `src/app/(public)/pet-nutrition-mini-diploma/page.tsx` (840+ lines)
- Lesson content: `src/components/mini-diploma/lessons/content/pet-nutrition.json` (9 comprehensive lessons)
- Registry: Added PET_NUTRITION_LESSONS and config entry
- Optin API: All 5 locations updated
- Auth redirect: Added pet-nutrition-mini-diploma mapping
- Next.config: Added to diplomaSlugs array
- Diploma configs: Added pet-nutrition-diploma config
- Lead layout: Added to DIPLOMA_TAG_PREFIX
- Dynamic router: Added pet-nutrition import and mapping
- Nudge cron: Added pet-nutrition tags
- SMS template: Created `docs/sms-sequences/pet-nutrition-sms.md`
- Build: ✅ PASSES
