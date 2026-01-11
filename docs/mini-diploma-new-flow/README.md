# Mini Diploma Lead Portal - Technical Documentation

> Last Updated: January 9, 2026

## Overview

The Mini Diploma system is a **free lead generation funnel** designed to capture email leads, deliver immediate value through a 9-lesson micro-course, and convert leads into paid Career Accelerator students.

---

## v2.0 Updates (January 2026)

### New 12-Step Gamified Journey

The lead portal now features a gamified 12-step journey:

```
Step 1:  Watch Welcome Video (60-90 sec)       ← NEW
Step 2:  Tell Us About You (5 questions)       ← NEW
Step 3:  Lesson 1 - Meet Your Hormones
Step 4:  Lesson 2 - The Monthly Dance
Step 5:  Lesson 3 - When Hormones Go Rogue
Step 6:  Lesson 4 - The Gut-Hormone Axis
Step 7:  Lesson 5 - Thyroid & Energy
Step 8:  Lesson 6 - Stress & Your Adrenals
Step 9:  Lesson 7 - Food as Medicine
Step 10: Lesson 8 - Life Stage Support
Step 11: Lesson 9 - Your Next Step
Step 12: Claim Certificate + Leave Review     ← NEW
```

### Psychological Trigger Questions (Step 2)

| Question | Purpose |
|----------|---------|
| What brought you here? | Self-identification (career change = hot lead) |
| What describes you best? | Persona segmentation |
| Income goal? | Financial commitment level |
| What would change? | Future visualization (open text) |
| Who are you doing this for? | Accountability |

### Trustpilot Review Farming (Step 12)

After completing all 9 lessons, users are prompted to:
1. Claim their certificate
2. Leave a Trustpilot review
3. See Career Accelerator upsell

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        LEAD JOURNEY v2.0                        │
└─────────────────────────────────────────────────────────────────┘

  Facebook/Google Ad
         │
         ▼
┌─────────────────────────┐
│   PUBLIC OPTIN PAGE     │  /womens-health-mini-diploma (public)
│   • First Name          │
│   • Last Name           │
│   • Email               │
└──────────┬──────────────┘
           │ POST /api/mini-diploma/optin
           ▼
┌─────────────────────────┐
│   THANK YOU PAGE        │  /womens-health-mini-diploma/thank-you
│   • Account credentials │
│   • Certificate preview │
│   • "Go to Portal" CTA  │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────┐
│   LEAD DASHBOARD v2.0   │  /womens-health-diploma (dashboard)
│   Step 1: Welcome Video │  ← Must complete
│   Step 2: Onboarding Qs │  ← Must complete
│   Steps 3-11: Lessons   │  ← Progressive unlock
│   Step 12: Cert+Review  │
└──────────┬──────────────┘
           │ Complete Step 12
           ▼
┌─────────────────────────┐
│   UPSELL                │  Career Accelerator pitch
│   $97 Tripwire or       │
│   $4,997 Full Program   │
└─────────────────────────┘
```

---

## New Database Model

```prisma
model LeadOnboarding {
  id     String @id @default(cuid())
  userId String @unique
  
  // Step 1: Welcome Video
  watchedVideo   Boolean   @default(false)
  watchedVideoAt DateTime?
  
  // Step 2: Onboarding Questions
  completedQuestions   Boolean   @default(false)
  completedQuestionsAt DateTime?
  bringReason          String?   // what_brought_you
  currentSituation     String?   // stay_at_home_mom, etc.
  incomeGoal           String?   // 2-4k, 5-8k, 10k+
  lifeChangeGoal       String?   // open text
  doingItFor           String?   // myself, family, others
  
  // Profile Photo
  uploadedPhoto   Boolean   @default(false)
  uploadedPhotoAt DateTime?
  
  // Step 12: Certificate & Review
  claimedCertificate   Boolean   @default(false)
  claimedCertificateAt DateTime?
  leftReview           Boolean   @default(false)
  leftReviewAt         DateTime?
  reviewPlatform       String?   // trustpilot, google
}
```

---

## New API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/lead-onboarding/status` | GET | Get 12-step progress |
| `/api/lead-onboarding/video-complete` | POST | Mark video watched |
| `/api/lead-onboarding/save-answers` | POST | Save onboarding answers |
| `/api/lead-onboarding/review-complete` | POST | Mark review submitted |

---

## New Components

| Component | Path | Purpose |
|-----------|------|---------|
| `WelcomeVideoStep` | `@/components/lead-portal/` | Video player with completion tracking |
| `OnboardingQuestionsStep` | `@/components/lead-portal/` | 5-step question flow |
| `LeadStepChecklist` | `@/components/lead-portal/` | 12-step progress UI |
| `CertificateClaimStep` | `@/components/lead-portal/` | Certificate + Trustpilot CTA |
| `LeadOnboardingWrapper` | `@/components/lead-portal/` | State management wrapper |

---

## Usage

```tsx
import { LeadOnboardingWrapper } from "@/components/lead-portal";

// In server component
<LeadOnboardingWrapper
  firstName={user.firstName}
  lastName={user.lastName}
  userAvatar={user.avatar}
  initialOnboarding={onboarding}
  completedLessons={[1, 2, 3]} // lesson IDs completed
>
  {/* Existing lesson content */}
</LeadOnboardingWrapper>
```

---

## Success Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Completion rate | ~30% | 50%+ |
| Profile photos uploaded | 0% | 40%+ |
| Reviews after completion | 0% | 35%+ |
| Conversion to Career Accelerator | ~1% | 3-5% |

---

## Email System

### Domain Configuration
- **Verified Domain:** `accredipro-certificate.com` (in Resend)
- **From Address:** `support@accredipro-certificate.com`
- **Reply-To (tickets):** `ticket-{id}@tickets.accredipro-certificate.com`

### Email Triggers

| Trigger | When | Email Type |
|---------|------|------------|
| Optin | User signs up | Welcome + Credentials |
| 24h after completion | `miniDiplomaCompletedAt` + 24h | Certificate ready |
| Ticket submitted | User submits ticket | Confirmation with ticket # |

### Certificate Delivery (24h Delay Cron)

**File:** `/api/cron/issue-mini-diploma-certificates/route.ts`

1. Runs hourly
2. Finds users where `miniDiplomaCompletedAt <= 24h ago`
3. Creates certificate in DB
4. Sends certificate email
5. Grants 30-day graduate access
6. Triggers Sarah DM via `wh_certificate_ready`

### Email Footer (CAN-SPAM Compliance)

All emails MUST include:
```html
AccrediPro LLC
(At Rockefeller Center)
1270 Ave of the Americas, 7th Fl -1182
New York, NY 10020, United States
```

---

## Completion Flow Pages

### Page 1: /complete

**When:** User completes all 9 lessons
**Content:**
- Congratulations message from Sarah
- "97/100 complete" messaging
- Two-step instructions:
  1. Leave Trustpilot review
  2. Message Sarah "Review left ✅"
- Certificate arrives in 24h (email + portal)

**File:** `/app/(lead)/womens-health-diploma/complete/page.tsx`

### Page 2: /certificate

**When:** 24h after completion (certificate issued)
**Content:**
- Full certificate display
- Download PDF button
- Share button

**File:** `/app/(lead)/womens-health-diploma/certificate/page.tsx`

### Page 3: /career-roadmap

**When:** Linked from complete page
**Content:**
- "YOU'RE NOW ELIGIBLE" badge
- "$10-15K+/Month" headline
- What they qualify for:
  - Board Certification (BC-FMP™)
  - Income Guarantee
  - Free Personalized Roadmap
- CTA: "Get My Free Roadmap" → Chat with Sarah

**File:** `/app/(lead)/womens-health-diploma/career-roadmap/page.tsx`

---

## PDF Certificate Generation

**API:** `/api/certificates/pdf`

```typescript
POST /api/certificates/pdf
{
  studentName: "Jane Doe",
  type: "mini-diploma",
  diplomaTitle: "Women's Health & Hormones",
  completedDate: "2026-01-09",
  certificateId: "WH-ABC123"
}
```

**Returns:** PDF file or HTML fallback for printing

---

## Replicating for New Mini Diplomas

### Step 1: Create Routes

Copy folder structure:
```
/app/(lead)/womens-health-diploma/
├── page.tsx                     # Main dashboard
├── lead-onboarding-client.tsx   # Client component
├── complete/
│   ├── page.tsx                 # Server component
│   └── complete-client.tsx      # Client component
├── certificate/
│   └── page.tsx
├── career-roadmap/
│   ├── page.tsx
│   └── career-roadmap-client.tsx
├── chat/
│   └── page.tsx
└── lessons/
    └── [lessonId]/
        └── page.tsx
```

### Step 2: Create Public Optin Page

```
/app/(public)/{new-diploma}-mini-diploma/
├── page.tsx                     # Optin form
└── thank-you/
    └── page.tsx                 # Credentials + CTA
```

### Step 3: Update Constants

In each file, replace:
- `womens-health` → new slug
- `Women's Health & Hormones` → new title
- Coach name/email if different
- Lesson count if not 9

### Step 4: Database Tags

Lesson completion tags format:
```
wh-lesson-complete:{lessonId}
```

Change prefix for new diploma:
- `fm-lesson-complete:` (Functional Medicine)
- `gh-lesson-complete:` (Gut Health)
- etc.

### Step 5: Coach Configuration

In `/lib/auto-messages.ts`, add coach lookup:
```typescript
const DIPLOMA_COACHES = {
  "womens-health": "sarah_womenhealth@accredipro-certificate.com",
  "functional-medicine": "sarah@accredipro-certificate.com",
  // Add new...
};
```

### Step 6: Cron Job Update

In `/api/cron/issue-mini-diploma-certificates/route.ts`:

```typescript
const MINI_DIPLOMA_SLUGS = [
  "womens-health-mini-diploma",
  "fm-mini-diploma",
  // Add new slug here
];
```

---

## File Checklist for New Mini Diploma

- [ ] Public optin page
- [ ] Public thank-you page
- [ ] Lead dashboard page
- [ ] Lead onboarding client component
- [ ] Complete page + client
- [ ] Certificate page
- [ ] Career roadmap page + client
- [ ] Chat page (with Sarah)
- [ ] Lesson pages (9 lessons)
- [ ] API endpoints (if needed)
- [ ] Cron job slug added
- [ ] Coach email configured
- [ ] Tag prefix defined
- [ ] Pixel tracking configured
