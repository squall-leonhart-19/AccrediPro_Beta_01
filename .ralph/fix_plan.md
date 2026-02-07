# Mini Diploma Creation: Spiritual Healing

## Tasks

### Step 0: DATABASE COURSE (MANDATORY FIRST!)
- [x] Create database course (ALREADY EXISTS from previous build — slug: spiritual-healing-mini-diploma)

### Step 1: Core Files
- [x] Read/generate spec file
- [x] Add lessons array to registry
- [x] Add config entry to registry
- [x] Update optin API (5 locations)
- [x] Update auth get-redirect
- [x] Update next.config.ts
- [x] Update admin dashboard routes (leads, sources, niche)
- [x] Update lesson-complete + lesson-status tag maps
- [x] Update metric-types, onboarding-client, upgrade-lead-to-student

### Step 2: Landing Page
- [x] Create landing page (COPY FM template, purple theme)
- [x] Set correct Meta Pixel ID
- [x] Add to diploma-configs.ts
- [x] Add to DIPLOMA_TAG_PREFIX

### Step 3: Lesson Content
- [x] Create lesson content JSON (3 lessons with checkpoints, case studies, highlights)
- [x] Add to dynamic-lesson-router.tsx
- [x] Add to DYNAMIC_CONTENT_NICHES

### Step 4: Media Generation + Integration
- [ ] Generate 3 doodle images (WaveSpeed API)
- [ ] Generate 3 lesson audio (ElevenLabs API)
- [ ] Upload images + audio to R2
- [ ] Inject audioUrl + imageUrl into lesson JSON

### Step 5: Exam
- [x] Create exam JSON (5 questions, trustpilot flow)
- [x] Add import + mapping to exam page

### Step 6: Circle Pod
- [ ] Create Zombie persona JSON
- [ ] Create Sarah knowledge JSON
- [ ] Create 45-day curriculum (days 9-23 + 24-45)
- [ ] Update seed route + seed to database

### Step 7: Nurture Email Sequence
- [x] Create 60-day nurture sequence (4 phases, niche-specific copy)
- [x] Register nurture sequence in registry (SPIRITUAL_HEALING_NURTURE_SEQUENCE)

### Step 8: SMS
- [x] Generate SMS template for GHL (10 messages)

### Step 9: Verification
- [x] Verify build passes (586/586 pages, 0 errors)
- [ ] Update planning CSV status to "done"

## Spec
```json
{
  "topic": "Spiritual Healing",
  "lessons": [
    "Spiritual Healing Foundation",
    "The D.E.P.T.H. Method™ for Spiritual Healing",
    "How To Get Your First Clients"
  ],
  "colorScheme": "purple",
  "brandColors": {
    "primary": "#6b21a8",
    "accent": "#d4af37",
    "gradient": "from-purple-900 via-indigo-800 to-purple-700"
  },
  "targetAudience": "US women 35-55+ seeking spiritual growth and healing practice careers"
}
```

## Completed
- Step 0: DB course exists
- Step 1: Core files (14 files edited)
- Step 2: Landing page (purple theme, 6 testimonials)
- Step 3: Lesson JSON (3 lessons + router wiring)
- Step 5: Exam JSON (5 questions + exam page wiring)
- Step 7: Nurture emails (60-day, 4-phase sequence)
- Step 8: SMS (10 messages for GHL)
- Step 9: Build verified (586/586 pages)

## Remaining
- Step 4: Media generation (WaveSpeed images + ElevenLabs audio) — requires external API calls
- Step 6: Circle Pod — requires persona/knowledge JSON + DB seeding
