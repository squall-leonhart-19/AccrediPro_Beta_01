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
