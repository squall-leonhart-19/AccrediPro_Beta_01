# Email Tags & Sequences Guide

Tag naming conventions and email sequences for all AccrediPro products.

---

## Tag Naming Convention

### Format
```
{product}_{action}
```

### Examples
- `fm_mini_diploma_optin` - Opted in to mini diploma
- `fm_certification_purchased` - Purchased FM certification
- `fm_certification_completed` - Completed all modules

---

## Standard Tags Per Product

### FM Mini Diploma ($27)

| Tag | Applied When | Sequence Triggered |
|-----|--------------|-------------------|
| `fm_mini_diploma_optin` | Optin form submitted | Lead nurture |
| `fm_mini_diploma_purchased` | Purchase completed | Welcome + onboarding |
| `fm_mini_diploma_started` | First lesson opened | Engagement sequence |
| `fm_mini_diploma_50_percent` | 50% lessons completed | Momentum email |
| `fm_mini_diploma_completed` | All lessons done | Certificate + upsell |
| `fm_mini_diploma_abandoned` | Checkout started, not completed | Abandon cart |

### FM Certification ($997)

| Tag | Applied When | Sequence Triggered |
|-----|--------------|-------------------|
| `fm_certification_optin` | Exit popup / lead magnet | Nurture sequence |
| `fm_certification_purchased` | Full payment | Welcome + onboarding |
| `fm_certification_3pay` | Payment plan started | Payment reminder sequence |
| `fm_certification_started` | First module opened | Engagement |
| `fm_certification_25_percent` | 25% complete | Progress celebration |
| `fm_certification_50_percent` | 50% complete | Halfway email |
| `fm_certification_75_percent` | 75% complete | Final push |
| `fm_certification_completed` | All modules done | Certificate + upsell |
| `fm_certification_abandoned` | Checkout not completed | Abandon cart |
| `fm_vip_purchased` | VIP bump added | VIP welcome |

---

## Where Tags Are Applied

### Automatic (via webhooks)

```typescript
// /api/webhooks/clickfunnels/route.ts
// Applied on purchase:
await prisma.userTag.upsert({
  where: { userId_tagId: { userId, tagId } },
  update: {},
  create: { userId, tagId, source: "ClickFunnels" }
});
```

### Progress-Based (via completion endpoints)

```typescript
// /api/progress/complete/route.ts
// Check milestones and apply tags
if (progressPercent >= 50 && !hasTag('50_percent')) {
  await applyTag(userId, `${courseSlug}_50_percent`);
}
```

### Manual (via admin)

Admin can add/remove tags in user profile.

---

## Email Sequences

### 1. Lead Nurture (Post-Optin)

**Trigger:** `fm_certification_optin`

| Day | Email Subject | Purpose |
|-----|---------------|---------|
| 0 | Welcome! Here's your free guide | Deliver lead magnet |
| 1 | The #1 mistake new FM coaches make | Value + authority |
| 2 | Sarah's story: from burnout to 6 figures | Social proof |
| 3 | Is FM coaching right for you? (Quiz) | Engagement |
| 5 | Limited-time offer: FM Certification | Soft pitch |
| 7 | Case study: How Jennifer replaced her salary | Hard pitch |
| 10 | Final reminder: Enrollment closes soon | Urgency |

### 2. Welcome Sequence (Post-Purchase)

**Trigger:** `fm_certification_purchased`

| Day | Email Subject | Purpose |
|-----|---------------|---------|
| 0 | 🎉 Welcome! Here's how to get started | Login details + first steps |
| 1 | Your 90-day success roadmap | Set expectations |
| 3 | Quick win: Complete Module 1 | Drive engagement |
| 7 | How are you doing? (Check-in) | Support |
| 14 | You're 2 weeks in - celebration! | Motivation |

### 3. Engagement Sequence

**Trigger:** No login for 7 days

| Day | Email Subject | Purpose |
|-----|---------------|---------|
| 7 | We miss you! Your next module awaits | Re-engagement |
| 10 | Need help? Book a call with Sarah | Support offer |
| 14 | Don't lose your progress - log in today | Urgency |

### 4. Completion Sequence

**Trigger:** `fm_certification_completed`

| Day | Email Subject | Purpose |
|-----|---------------|---------|
| 0 | 🎓 Congratulations! Download your certificate | Certificate delivery |
| 1 | What's next? Advanced training available | Upsell |
| 3 | Share your success! Get featured | Social proof gathering |
| 7 | Private mentorship invitation | High-ticket upsell |

### 5. Abandon Cart Sequence

**Trigger:** `fm_certification_abandoned`

| Time | Email Subject | Purpose |
|------|---------------|---------|
| 1hr | Did something go wrong? | Technical issue check |
| 24hr | Still thinking about it? | Objection handling |
| 48hr | Last chance: Special offer expires | Urgency + discount |
| 72hr | Final reminder | Last touch |

---

## Resend Integration

### Sending Tagged Emails

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

// Send email with tags for tracking
await resend.emails.send({
  from: 'Sarah <sarah@coach-accredipro.academy>',
  to: user.email,
  subject: 'Welcome to FM Certification!',
  html: welcomeEmailHtml,
  tags: [
    { name: 'sequence', value: 'welcome' },
    { name: 'product', value: 'fm-certification' },
    { name: 'email_number', value: '1' }
  ]
});
```

### Checking Tags Before Sending

```typescript
// Don't send nurture emails to purchasers
const hasPurchased = await prisma.userTag.findFirst({
  where: {
    userId: user.id,
    tag: { slug: 'fm_certification_purchased' }
  }
});

if (hasPurchased) {
  // Skip nurture sequence
  return;
}
```

---

## Tag Management in Database

### Schema

```prisma
model MarketingTag {
  id          String      @id @default(cuid())
  name        String      // "FM Certification Purchased"
  slug        String      @unique // "fm_certification_purchased"
  description String?
  users       UserTag[]
  createdAt   DateTime    @default(now())
}

model UserTag {
  id        String       @id @default(cuid())
  user      User         @relation(fields: [userId], references: [id])
  userId    String
  tag       MarketingTag @relation(fields: [tagId], references: [id])
  tagId     String
  source    String?      // "ClickFunnels", "Manual", "System"
  createdAt DateTime     @default(now())

  @@unique([userId, tagId])
}
```

### Creating Tags

```typescript
// Seed script for tags
const tags = [
  { name: "FM Mini Diploma Purchased", slug: "fm_mini_diploma_purchased" },
  { name: "FM Certification Purchased", slug: "fm_certification_purchased" },
  { name: "FM Certification Completed", slug: "fm_certification_completed" },
  // etc.
];

for (const tag of tags) {
  await prisma.marketingTag.upsert({
    where: { slug: tag.slug },
    update: {},
    create: tag,
  });
}
```

---

## Tracking Sequence Progress

### Database Model

```prisma
model EmailSequence {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  sequence  String   // "welcome", "nurture", "abandon"
  step      Int      // Current step number
  status    String   // "active", "completed", "cancelled"
  startedAt DateTime @default(now())
  nextSendAt DateTime?
  completedAt DateTime?
}
```

### Sequence Logic

```typescript
// Cron job to send sequence emails
async function processSequences() {
  const due = await prisma.emailSequence.findMany({
    where: {
      status: 'active',
      nextSendAt: { lte: new Date() }
    },
    include: { user: true }
  });

  for (const seq of due) {
    await sendSequenceEmail(seq);
    await updateSequenceStep(seq);
  }
}
```

---

## Quick Reference: All Tags

### Purchase Tags
- `clickfunnels_purchase` - Any CF purchase
- `fm_mini_diploma_purchased`
- `fm_certification_purchased`
- `fm_certification_3pay`
- `fm_vip_purchased`
- `fm_implementation_purchased`
- `fm_mentorship_purchased`

### Progress Tags
- `{product}_started`
- `{product}_25_percent`
- `{product}_50_percent`
- `{product}_75_percent`
- `{product}_completed`

### Lead Tags
- `{product}_optin`
- `{product}_abandoned`
- `exit_popup_optin`
- `webinar_registered`
- `quiz_completed`

### Source Tags
- `source_facebook`
- `source_google`
- `source_organic`
- `source_referral`

---

*Last Updated: December 2024*
