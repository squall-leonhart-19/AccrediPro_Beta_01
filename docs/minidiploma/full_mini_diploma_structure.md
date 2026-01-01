# Mini Diploma System - Complete Structure

This document outlines the complete Mini Diploma system architecture, including Women's Health (WH) and Functional Medicine (FM) mini diplomas.

---

## Table of Contents

1. [Overview](#overview)
2. [Database Models](#database-models)
3. [User Journey](#user-journey)
4. [Email Sequences](#email-sequences)
5. [DM System (Sarah)](#dm-system-sarah)
6. [CRON Jobs](#cron-jobs)
7. [API Endpoints](#api-endpoints)
8. [Frontend Pages](#frontend-pages)
9. [Certificate System](#certificate-system)
10. [Tracking & Tags](#tracking--tags)
11. [Upsell Funnel](#upsell-funnel)

---

## Overview

Mini Diplomas are **free lead magnets** that provide a 7-day access window to complete 9 lessons. Upon completion, users receive a verified certificate and 30-day graduate access to browse the full catalog.

### Current Mini Diplomas

| Mini Diploma | Slug | Lessons | Access Window |
|--------------|------|---------|---------------|
| Women's Health | `womens-health-mini-diploma` | 9 | 7 days |
| Functional Medicine | `integrative-health-functional-medicine-mini-diploma` | 9 | 7 days |

---

## Database Models

### User Fields (Mini Diploma Related)

```prisma
model User {
  // Mini Diploma tracking
  miniDiplomaCategory      String?    // "womens-health" | "functional-medicine"
  miniDiplomaOptinAt       DateTime?  // When user opted in
  miniDiplomaCompletedAt   DateTime?  // When all 9 lessons completed
  accessExpiresAt          DateTime?  // 7 days from optin, extended to 30 days on graduation
  lastLoginAt              DateTime?  // For inactive user tracking
  hasCertificateBadge      Boolean    @default(false)
}
```

### Enrollment

```prisma
model Enrollment {
  id        String   @id
  userId    String
  courseId  String
  status    EnrollmentStatus  // ACTIVE, COMPLETED, CANCELLED
  progress  Float    @default(0)
}
```

### Certificate

```prisma
model Certificate {
  id                String   @id
  userId            String
  courseId          String
  certificateNumber String   @unique  // e.g., "WH-2025-ABC123"
  type              CertificateType  // MINI_DIPLOMA, COMPLETION, CERTIFICATION
  issuedAt          DateTime
}
```

### UserTag (Tracking)

```prisma
model UserTag {
  id     String  @id
  userId String
  tag    String
  value  String?

  @@unique([userId, tag])
}
```

---

## User Journey

### 1. Opt-in Flow

```
Landing Page → Email Capture → Webhook → Account Created → Welcome Email + DM
```

**Webhook Endpoint:** `/api/webhooks/clickfunnels` or `/api/webhooks/clickfunnels-purchase`

**Actions on Optin:**
1. Create user account (password: `Futurecoach2025`)
2. Set `miniDiplomaOptinAt` = now
3. Set `miniDiplomaCategory` = "womens-health" or "functional-medicine"
4. Set `accessExpiresAt` = now + 7 days
5. Create enrollment in mini diploma course
6. Send welcome email (with deduplication via `welcome_email_sent` tag)
7. Trigger Sarah welcome DM (WH only)

### 2. Learning Phase (Days 1-7)

```
Dashboard → Lesson 1 → ... → Lesson 9 → Completion
```

**Progress Tracking:**
- Each lesson completion updates `LessonProgress`
- Milestone DMs at Lessons 3, 6, 9 (WH only)
- Daily reminder emails based on progress

### 3. Completion Flow

```
Lesson 9 Complete → miniDiplomaCompletedAt Set → 24h Wait → Certificate Issued
```

**Actions on Completion:**
1. Set `miniDiplomaCompletedAt` = now
2. After 24 hours, CRON issues certificate
3. Extend `accessExpiresAt` to 30 days (graduate access)
4. Set `hasCertificateBadge` = true
5. Send certificate ready email
6. Send certificate ready DM (WH only)
7. Add `mini-diploma-graduate` tag

### 4. Graduate Access (30 Days)

```
Certificate Page → Browse Catalog → 20% Graduate Discount → Upsell to Full Certification
```

---

## Email Sequences

### Women's Health Email Sequence

| # | Trigger | Subject | Timing |
|---|---------|---------|--------|
| 1 | Optin | Welcome to Your Journey! | Immediate |
| 2 | Day 2, 0 lessons | Your lessons are waiting... | Day 2 |
| 3 | Day 3, <3 lessons | Quick check-in | Day 3 |
| 4 | Day 4, <5 lessons | You're halfway there! | Day 4 |
| 5 | Day 5, <7 lessons | Just a few more lessons | Day 5 |
| 6 | Day 6, <9 lessons | Tomorrow is your last day! | Day 6 |
| 7 | Day 7, <9 lessons | FINAL DAY - Complete now! | Day 7 |

**File:** `/src/lib/wh-email-templates.ts`

### Email Tracking Tags

| Tag | Purpose |
|-----|---------|
| `wh-reminder-1-sent` | Day 2 reminder sent |
| `wh-reminder-2-sent` | Day 3 reminder sent |
| `wh-reminder-3-sent` | Day 4 reminder sent |
| `wh-reminder-4-sent` | Day 5 reminder sent |
| `wh-reminder-5-sent` | Day 6 reminder sent |
| `wh-reminder-6-sent` | Day 7 (final) reminder sent |
| `welcome_email_sent` | Welcome email sent (dedup) |

---

## DM System (Sarah)

Sarah is the AI coach for Women's Health mini diploma. She sends personalized DMs with voice notes.

### Sarah's Identity

```
Email: sarah_womenhealth@accredipro-certificate.com
Name: Sarah
Role: Women's Health Coach
Voice: ElevenLabs (Rachel voice)
```

### DM Triggers

| Trigger | Event | Has Voice | Tag |
|---------|-------|-----------|-----|
| `wh_optin` | User opts in | Yes | `wh-dm-sent:welcome` |
| `wh_lesson_milestone` (3) | Lesson 3 complete | Yes | `wh-dm-sent:lesson-3` |
| `wh_lesson_milestone` (6) | Lesson 6 complete | Yes | `wh-dm-sent:lesson-6` |
| `wh_lesson_milestone` (9) | Lesson 9 complete | Yes | `wh-dm-sent:lesson-9` |
| `wh_access_expiring` (2) | 2 days until expiry | Yes | `wh-dm-sent:expiring-2days` |
| `wh_access_expiring` (1) | 1 day until expiry | Yes | `wh-dm-sent:expiring-1day` |
| `wh_certificate_ready` | Certificate issued | Yes | `wh-dm-sent:certificate-ready` |
| `wh_inactive_reminder` (2) | No login for 2 days | Yes | `wh-dm-sent:inactive-2days` |
| `wh_inactive_reminder` (3) | No login for 3 days | No | `wh-dm-sent:inactive-3days` |

### DM Content Structure

```typescript
interface DMMessage {
  text: string;        // Chat message content
  voiceScript: string | null;  // Script for ElevenLabs
  hasVoice: boolean;   // Whether to generate voice
}
```

**File:** `/src/lib/auto-messages.ts`

### Voice Generation

- Uses ElevenLabs API
- Voice ID: Rachel (configurable)
- Audio stored as base64 in message
- Fallback to text-only if generation fails

---

## CRON Jobs

### 1. Send WH Reminder Emails

**Endpoint:** `/api/cron/send-wh-reminder-emails`
**Schedule:** Daily at 3 PM UTC
**File:** `/src/app/api/cron/send-wh-reminder-emails/route.ts`

**Actions:**
1. Find all WH users with active access
2. Calculate days since optin and lessons completed
3. Send appropriate reminder email (if not already sent)
4. Send access expiring DMs (2 days, 1 day)
5. Send inactive DMs (2 days, 3 days without login)

### 2. Issue Mini Diploma Certificates

**Endpoint:** `/api/cron/issue-mini-diploma-certificates`
**Schedule:** Every 6 hours
**File:** `/src/app/api/cron/issue-mini-diploma-certificates/route.ts`

**Actions:**
1. Find users with `miniDiplomaCompletedAt` > 24 hours ago
2. Check no certificate exists yet
3. Generate certificate number
4. Create certificate record
5. Extend access to 30 days
6. Set `hasCertificateBadge` = true
7. Send certificate email
8. Send certificate DM (WH only)
9. Create notification

### 3. Update Mini Diploma Progress

**Endpoint:** `/api/cron/update-mini-diploma-progress`
**Schedule:** Hourly

**Actions:**
1. Recalculate progress for all active enrollments
2. Check for newly completed mini diplomas
3. Set `miniDiplomaCompletedAt` if all 9 lessons done

---

## API Endpoints

### Webhooks (External)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/webhooks/clickfunnels` | POST | ClickFunnels purchase/optin |
| `/api/webhooks/clickfunnels-purchase` | POST | ClickFunnels purchase (alt) |
| `/api/webhook/enroll` | POST | Generic enrollment webhook |

### CRON (Internal)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/cron/send-wh-reminder-emails` | GET | Daily reminder emails + DMs |
| `/api/cron/issue-mini-diploma-certificates` | GET | Auto-issue certificates |
| `/api/cron/update-mini-diploma-progress` | GET | Progress sync |

### User Actions

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/lessons/[id]/complete` | POST | Mark lesson complete |
| `/api/certificates/generate` | POST | Generate certificate PDF |
| `/api/certificates/verify/[number]` | GET | Verify certificate |

### Admin

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/admin/mini-diploma` | GET | Dashboard analytics |
| `/api/admin/bulk-welcome-emails` | POST | Bulk send welcome emails |

---

## Frontend Pages

### Public

| Page | Path | Purpose |
|------|------|---------|
| WH Landing | `/womens-health-mini-diploma` | Optin page |
| WH Thank You | `/womens-health-mini-diploma/thank-you` | Post-optin |
| FM Landing | `/fm-mini-diploma` | Optin page |

### Dashboard (Authenticated)

| Page | Path | Purpose |
|------|------|---------|
| WH Dashboard | `/womens-health-diploma` | Main learning area |
| WH Lesson | `/womens-health-diploma/lesson/[n]` | Individual lesson |
| WH Complete | `/womens-health-diploma/complete` | Completion page |
| WH Certificates | `/womens-health-diploma/certificates` | View/download cert |
| Certificate Verify | `/verify/[certificateNumber]` | Public verification |

---

## Certificate System

### Certificate Number Format

```
{PREFIX}-{YEAR}-{RANDOM}
```

Examples:
- `WH-2025-A3F8K2` (Women's Health)
- `FM-2025-B7X9M1` (Functional Medicine)

### Generation Process

1. User completes all 9 lessons
2. `miniDiplomaCompletedAt` is set
3. 24-hour waiting period
4. CRON generates certificate
5. PDF generated client-side (html2canvas + jsPDF)
6. Certificate stored in database
7. Public verification URL created

### Certificate Data

```typescript
interface CertificateData {
  studentName: string;
  courseName: string;
  certificateNumber: string;
  issuedAt: Date;
  verificationUrl: string;
}
```

**File:** `/src/lib/certificate-service.ts`

---

## Tracking & Tags

### UserTag Categories

#### Email Tracking
```
welcome_email_sent
wh-reminder-1-sent
wh-reminder-2-sent
wh-reminder-3-sent
wh-reminder-4-sent
wh-reminder-5-sent
wh-reminder-6-sent
```

#### DM Tracking
```
wh-dm-sent:welcome
wh-dm-sent:lesson-3
wh-dm-sent:lesson-6
wh-dm-sent:lesson-9
wh-dm-sent:expiring-2days
wh-dm-sent:expiring-1day
wh-dm-sent:certificate-ready
wh-dm-sent:inactive-2days
wh-dm-sent:inactive-3days
```

#### Status Tags
```
mini-diploma-graduate
wh-mini-diploma-completed
fm-mini-diploma-completed
clickfunnels_purchase
```

### Analytics Tracked

- Total optins per day
- Completion rate (optins → completions)
- Average time to complete
- Drop-off by lesson
- Email open/click rates
- DM engagement rates

---

## Upsell Funnel

### Graduate Offers

1. **30-Day Graduate Access**
   - Browse full catalog
   - 20% graduate discount
   - Special graduate pricing page

2. **Full Certification Upsell**
   - WH → Women's Hormone Health Coach Certification
   - FM → Functional Medicine Practitioner Certification

3. **Pro Accelerator Bundle**
   - Advanced + Master + Practice Path
   - Special graduate price

### Upsell Touchpoints

1. Certificate email (CTA to catalog)
2. Certificate page (upsell banner)
3. Graduate dashboard (special offers)
4. Expiring access emails (urgency)

---

## File Reference

### Core Files

| File | Purpose |
|------|---------|
| `/src/lib/auto-messages.ts` | DM triggers and content |
| `/src/lib/wh-email-templates.ts` | Email templates |
| `/src/lib/email.ts` | Email sending functions |
| `/src/lib/certificate-service.ts` | Certificate generation |
| `/src/lib/prisma.ts` | Database client |

### CRON Files

| File | Purpose |
|------|---------|
| `/src/app/api/cron/send-wh-reminder-emails/route.ts` | Daily emails + DMs |
| `/src/app/api/cron/issue-mini-diploma-certificates/route.ts` | Certificate issuance |

### Webhook Files

| File | Purpose |
|------|---------|
| `/src/app/api/webhooks/clickfunnels/route.ts` | CF webhook handler |
| `/src/app/api/webhooks/clickfunnels-purchase/route.ts` | CF purchase handler |

### Frontend Files

| File | Purpose |
|------|---------|
| `/src/app/(dashboard)/womens-health-diploma/page.tsx` | WH dashboard |
| `/src/app/(dashboard)/womens-health-diploma/lesson/[lessonNumber]/page.tsx` | Lesson page |
| `/src/app/(dashboard)/womens-health-diploma/certificates/page.tsx` | Certificate page |

---

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://...

# Auth
NEXTAUTH_URL=https://learn.accredipro.academy
NEXTAUTH_SECRET=...

# Email
RESEND_API_KEY=...

# Voice (ElevenLabs)
ELEVENLABS_API_KEY=...

# CRON
CRON_SECRET=...

# Meta Pixel
META_PURCHASE_PIXEL_ID=...
META_PURCHASE_ACCESS_TOKEN=...
```

---

## Adding a New Mini Diploma

To add a new mini diploma (e.g., "Holistic Nutrition"):

1. **Create Course** in database with 9 lessons
2. **Add Email Templates** in `/src/lib/hn-email-templates.ts`
3. **Add DM Messages** in `/src/lib/auto-messages.ts`
4. **Create Landing Page** at `/holistic-nutrition-mini-diploma`
5. **Create Dashboard Pages** at `/holistic-nutrition-diploma/*`
6. **Update CRON Jobs** to include new category
7. **Add Webhook Mapping** in ClickFunnels webhooks
8. **Configure Coach** (email, voice, persona)
9. **Test Full Flow** optin → completion → certificate

---

## Troubleshooting

### Duplicate Emails
- Check `welcome_email_sent` tag exists
- Verify webhook isn't called multiple times
- Check CRON isn't running twice

### Missing DMs
- Verify coach email exists in database
- Check ElevenLabs API key is valid
- Check user has correct `miniDiplomaCategory`

### Certificate Not Issuing
- Verify `miniDiplomaCompletedAt` is set
- Check 24 hours have passed
- Verify no existing certificate
- Check CRON logs for errors

### Access Expired Early
- Check `accessExpiresAt` was set on optin
- Verify graduate extension happened on completion
- Check timezone issues

---

*Last updated: January 2025*
