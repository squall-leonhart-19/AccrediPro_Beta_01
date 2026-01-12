# Mini Diploma System Documentation

> Last updated: January 2026

## Overview

The Mini Diploma is a free lead magnet funnel that offers 9-lesson courses in various health niches. Users sign up, complete lessons, and can be converted to paid certification purchases.

---

## Available Niches

| Niche | Category Slug | Tag Prefix | Portal URL |
|-------|---------------|------------|------------|
| Women's Health | `womens-health` | `wh-lesson-complete:` | `/womens-health-diploma` |
| Functional Medicine | `functional-medicine` | `functional-medicine-lesson-complete:` | `/functional-medicine-diploma` |
| Gut Health | `gut-health` | `gut-health-lesson-complete:` | `/gut-health-diploma` |
| Hormone Health | `hormone-health` | `hormone-health-lesson-complete:` | `/hormone-health-diploma` |
| Holistic Nutrition | `holistic-nutrition` | `holistic-nutrition-lesson-complete:` | `/holistic-nutrition-diploma` |
| Nurse Coach | `nurse-coach` | `nurse-coach-lesson-complete:` | `/nurse-coach-diploma` |
| Health Coach | `health-coach` | `health-coach-lesson-complete:` | `/health-coach-diploma` |

---

## User Flow

```
1. User lands on optin page (e.g., /free-mini-diploma)
2. Fills form: firstName, lastName, email, selects niche
3. Account created with standard password
4. Welcome email sent with login credentials
5. User redirected to mini diploma portal
6. Completes 9 lessons (chat-based format)
7. Gets certificate on completion
8. Receives nurture emails to convert to paid certification
```

---

## Data Model

### Key User Fields
```prisma
User {
  miniDiplomaOptinAt    DateTime?   // When they opted in (SOURCE OF TRUTH)
  miniDiplomaCategory   String?     // e.g., "functional-medicine"
  leadSource            String?     // "mini-diploma" or "mini-diploma-freebie"
  leadSourceDetail      String?     // Same as category
}
```

### UserTags Created on Optin
When a user opts in, these tags are automatically created:

| Tag | Example | Purpose |
|-----|---------|---------|
| `mini_diploma_started` | `mini_diploma_started` | Indicates user started a mini diploma |
| `mini_diploma_{category}` | `mini_diploma_functional_medicine` | Category-specific tag for filtering |
| `mini_diploma_category:{category}` | `mini_diploma_category:gut-health` | Alternative category format |
| `lead:{category}-mini-diploma` | `lead:functional-medicine-mini-diploma` | Lead source tracking (specific to mini diploma) |
| `source:mini-diploma` | `source:mini-diploma` | General source tag |
| `source:{category}` | `source:functional-medicine` | Category source tag |

### Lesson Completion Tags
When a user completes a lesson, a tag is created:
```
{tag-prefix}:{lesson-number}
```
Example: `functional-medicine-lesson-complete:3` = completed lesson 3 of FM mini diploma

---

## API Endpoints

### Optin Endpoints
| Endpoint | Purpose |
|----------|---------|
| `POST /api/auth/register-freebie` | Main optin (from /free-mini-diploma pages) |
| `POST /api/mini-diploma/optin` | Alternative optin endpoint |

### Lesson Tracking
| Endpoint | Purpose |
|----------|---------|
| `POST /api/lead-onboarding/lesson-complete` | Mark lesson as complete |
| `GET /api/lead-onboarding/lesson-status` | Get user's completed lessons |

### Admin APIs
| Endpoint | Purpose |
|----------|---------|
| `GET /api/admin/leads` | Get all mini diploma leads |
| `GET /api/admin/analytics/mini-diploma` | Funnel analytics & per-niche stats |

---

## Admin Pages

### Leads Management
**URL:** `/admin/leads`

Shows all mini diploma leads with:
- Lead count (total, today, this week, this month)
- Per-category breakdown
- Progress tracking (lessons completed)
- Conversion status (purchased certification or not)
- Export to CSV

### Mini Diploma Analytics
**URL:** `/admin/mini-diploma`

Shows:
- **Best Performers**: Most popular niche, best conversion rate
- **Conversion Funnel**: Signups → Started → Completed → Enrolled
- **Per-Niche Performance Table**:
  - Leads count
  - Started / Completed counts
  - Start Rate (% who completed at least 1 lesson)
  - Completion Rate (% who finished all 9 lessons)
  - Overall Conversion (signups → completed)
  - Biggest Drop-off Point
- **Drop-off Analysis**: Where users stop in the funnel
- **Daily Trends**: Signups over last 14 days
- **AI Advice**: Click "Get AI Advice" for optimization suggestions

---

## Meta (Facebook) Tracking

### Lead Pixel (Mini Diploma Optins)
- **Pixel ID:** `1829815637745689`
- **Events:** `Lead` event fired on optin
- **Files:**
  - Client-side: `src/components/tracking/meta-pixel.tsx`
  - Server-side (CAPI): `src/lib/meta-capi.ts`

### Purchase Pixel (Separate Account)
- **Pixel ID:** `1287915349067829`
- Used for ClickFunnels purchases only (not mini diploma)

---

## Email Sequences

### Welcome Email
Sent immediately on optin with:
- Login credentials (email + standard password)
- Link to mini diploma portal
- Coach introduction

### Nurture Sequence
- Enrolled in 30-day nurture sequence automatically
- Tag: `nurture-30-day`
- Database: `SequenceEnrollment` table

---

## Passwords

| Optin Route | Password |
|-------------|----------|
| `/api/auth/register-freebie` | `Futurecoach2025` |
| `/api/mini-diploma/optin` | `coach2026` |

---

## Filtering Leads (For Queries)

**Source of Truth:** `User.miniDiplomaOptinAt IS NOT NULL`

```typescript
// Correct way to get all mini diploma leads
const leads = await prisma.user.findMany({
    where: {
        miniDiplomaOptinAt: { not: null },
        isFakeProfile: { not: true },
        email: { not: { contains: "@test" } },
    },
});
```

**Do NOT filter by `leadSource`** - there are multiple values:
- `mini-diploma-freebie` (from register-freebie)
- `mini-diploma` (from mini-diploma/optin)

---

## Progress Calculation

```typescript
// Get lessons completed for a user
const category = user.miniDiplomaCategory || "functional-medicine";
const tagPrefix = CATEGORY_TO_TAG_PREFIX[category];
const lessonsCompleted = user.tags.filter(t =>
    t.tag.startsWith(`${tagPrefix}:`)
).length;

// Progress percentage (9 lessons total)
const progress = Math.round((lessonsCompleted / 9) * 100);
```

---

## Lesson Formats

### Classic Text-Based Lessons (Current - FM)
**Functional Medicine** now uses classic text-based lessons for better UX with 40+ demographic.

Features:
- All content visible at once (no sequential reveals)
- Clear section headers with organized content
- Key takeaways section at end of each lesson
- Reading time indicator (5-7 min per lesson)
- Progress bar through curriculum
- Sticky header with navigation

Section types supported:
- `intro` - Coach introduction with avatar
- `heading` - Section headers
- `text` - Body paragraphs
- `list` - Bulleted lists
- `quote` - Blockquotes
- `callout` - Info/warning/success/tip boxes
- `key-point` - Highlighted important points
- `example` - Example scenarios

### Chat-Based Lessons (Legacy)
Other niches still use chat-based format where users interact with Coach Sarah through sequential messages.

Known issues with chat format:
- Low start rate (~8%)
- 40+ demographic may find it confusing
- Slower consumption

---

## Key Files

```
src/
├── app/
│   ├── (lead)/                           # Mini diploma portals
│   │   ├── functional-medicine-diploma/
│   │   ├── womens-health-diploma/
│   │   ├── gut-health-diploma/
│   │   └── ...
│   ├── api/
│   │   ├── auth/register-freebie/        # Main optin API
│   │   ├── mini-diploma/optin/           # Alt optin API
│   │   ├── lead-onboarding/              # Lesson completion
│   │   └── admin/
│   │       ├── leads/                    # Leads API
│   │       └── analytics/mini-diploma/   # Analytics API
│   └── (admin)/admin/
│       ├── leads/                        # Leads page
│       └── mini-diploma/                 # Analytics page
├── components/
│   ├── mini-diploma/lessons/
│   │   ├── shared/
│   │   │   ├── lesson-base.tsx           # Chat-based lesson component
│   │   │   └── classic-lesson-base.tsx   # Text-based lesson component
│   │   └── functional-medicine/
│   │       ├── classic/                  # Classic text lessons (9 files)
│   │       │   ├── lesson-1-root-cause-medicine.tsx
│   │       │   ├── lesson-2-gut-foundation.tsx
│   │       │   ├── ... (lessons 3-8)
│   │       │   ├── lesson-9-your-next-step.tsx
│   │       │   └── lesson-router.tsx
│   │       └── *.tsx                     # Legacy chat-based lessons
│   └── tracking/meta-pixel.tsx           # Client-side FB pixel
└── lib/
    ├── meta-capi.ts                      # Server-side FB CAPI
    └── email.ts                          # Welcome emails
```

---

## Changelog

### January 2026 (Week 2)
- **Fixed: Lead tags now specific to mini diploma**
  - Changed `lead:functional-medicine` to `lead:functional-medicine-mini-diploma`
  - Prevents confusion with certification purchase tracking
  - Updated both `/api/auth/register-freebie` and `/api/mini-diploma/optin`
- **Fixed: Mini diploma leads excluded from /admin/users by default**
  - Users with `miniDiplomaOptinAt` now filtered out by default
  - Use `?includeLeads=true` to show them
  - Leads have their own dedicated page at `/admin/leads`
- **Fixed: ClickFunnels certification purchasers excluded from leads**
  - ClickFunnels webhook was incorrectly setting `miniDiplomaOptinAt` for ALL products
  - Now only sets for actual mini diploma products (containing "mini-diploma")
  - Leads/Analytics APIs now exclude users where `leadSource=ClickFunnels` AND `leadSourceDetail` doesn't contain "mini"
- **Converted FM mini diploma to classic text-based lessons**
  - Created `ClassicLessonBase` shared component
  - Created 9 classic lesson files for Functional Medicine
  - Better UX for 40+ demographic (all content visible at once)
  - Preserves existing completion tracking

### January 2026 (Week 1)
- Fixed leads API to use `miniDiplomaOptinAt` as source of truth
- Added `mini_diploma_{category}` tags on optin
- Added per-niche analytics to Mini Diploma page
- Added best performer highlights
- Fixed Meta pixel for lead tracking (pixel ID: 1829815637745689)
- Created separate lead vs purchase pixel tracking
