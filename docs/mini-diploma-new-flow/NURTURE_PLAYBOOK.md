# Mini Diploma Nurture Playbook

## Overview

This playbook documents the complete nurture system for Mini Diploma lead magnets. Use this to replicate the same high-converting sequence for each new niche.

---

## Architecture

```
┌─────────────────┐     ┌─────────────────┐
│  EMAIL SEQUENCE │     │   DM SEQUENCE   │
│   (26 emails)   │     │   (44+ DMs)     │
│   60-day drip   │     │  Days + Lessons │
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────────┬───────────┘
                     ▼
              ┌─────────────┐
              │   $297 CTA  │
              │  Conversion │
              └─────────────┘
```

---

## Email Sequence (60-Day)

### File Structure
```
/src/lib/{niche}-nurture-60-day-v3.ts
```

### Phase Structure

| Phase | Days | Goal | CTA Level |
|-------|------|------|-----------|
| **VALUE** | 0-14 | Trust, NO selling | None |
| **DESIRE** | 15-30 | Transformation stories | Soft |
| **DECISION** | 31-45 | Clear $297 offer | Strong |
| **RE-ENGAGE** | 46-60 | Stay connected | Passive |

### Email Count by Phase
- Phase 1: 8 emails
- Phase 2: 6 emails
- Phase 3: 8 emails
- Phase 4: 4 emails
- **Total: 26 emails**

### Key Elements per Email
- Subject: "Re: [topic]" format (reply-style)
- Hook: First line must create curiosity
- Story: Emotional transformation
- Value: Specific tip or insight
- CTA: Checkout link in decision phase

---

## DM Sequence (Sarah Mentor)

### File Structure
```
/src/lib/{niche}-sarah-dms.ts
```

### DM Types

| Type | Count | Trigger |
|------|-------|---------|
| Time-Based | 31 | Days 0-60 |
| Lesson Complete | 9 | Each lesson finish |
| Behavioral | 4 | Inactive 1,2,3,5 days |
| **Total** | **44** | |

### Voice Notes
- **Only Day 0 welcome** has voice (cost savings)
- ElevenLabs + Supabase storage

### 10/10 Quality Checklist

| Element | ✓ |
|---------|---|
| Punchy hooks (curiosity openers) | |
| Secret tip DM (exclusivity) | |
| Income screenshot reference | |
| 2x Pod visualization | |
| Referral hook | |
| Emotional stories (3+) | |
| Specific numbers ($8K/month, 47 enrolled) | |
| FOMO language ("while you read this...") | |

---

## Template: Creating New Niche Nurture

### Step 1: Create Email Sequence

```bash
# Copy template
cp src/lib/wh-nurture-60-day-v3.ts src/lib/{NICHE}-nurture-60-day-v3.ts
```

**Find & Replace:**
- `Women's Health` → `{Niche Name}`
- `WH-FC`, `WH-CP`, `WH-BC` → `{NICHE}-FC`, `{NICHE}-CP`, `{NICHE}-BC`
- `hormones` → `{niche topic}`
- Coach name if different
- Checkout link

### Step 2: Create DM Sequence

```bash
# Copy template
cp src/lib/wh-sarah-dms.ts src/lib/{NICHE}-sarah-dms.ts
```

**Find & Replace:**
- Same as emails
- Update testimonial names (Diane, Linda, Michelle)
- Update specific stories/tips for niche

### Step 3: Wire to Cron Job

```typescript
// In /src/app/api/cron/lead-engagement/route.ts

import { TIME_BASED_DMS } from "@/lib/{niche}-sarah-dms";
```

### Step 4: Add to Inbox Test

```typescript
// In /src/app/api/admin/marketing/inbox-test/route.ts

import { {NICHE}_NURTURE_60_DAY_V3 } from "@/lib/{niche}-nurture-60-day-v3";
```

---

## Offer Structure ($297)

### Value Stack
| Item | Perceived Value |
|------|-----------------|
| 3-Level Certification (FC + CP + BC) | $1,791 |
| Board Certified Master Title | $497 |
| 25+ Lessons | $997 |
| My Circle Mastermind (daily) | $997 |
| ASI Directory Listing | $97/yr |
| Business Templates (BONUS) | $197 |
| Client Scripts (BONUS) | $97 |
| LIFETIME Access | Priceless |
| **Total** | **$5,000+** |

### ROI Calculation
- Price: $297
- Avg session rate: $150-$300
- Break-even: **2 clients**

### Guarantee
- 30-day money-back
- Under 3% refund rate

---

## Files Reference

### WH (Women's Health)
- Emails: `/src/lib/wh-nurture-60-day-v3.ts`
- DMs: `/src/lib/wh-sarah-dms.ts`
- Checkout: `https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw`

---

## Wiring Status

| Component | Status |
|-----------|--------|
| Email content (v3) | ✅ Done |
| DM content (10/10) | ✅ Done |
| Email cron sending | ⚠️ Needs wire |
| DM cron sending | ⚠️ Needs wire |
| Inbox test preview | ✅ Done (emails) |
| DM test preview | ⚠️ Not built |

---

## Next Niche Checklist

- [ ] Copy email template
- [ ] Customize for niche
- [ ] Copy DM template
- [ ] Customize for niche
- [ ] Create checkout link
- [ ] Wire to cron
- [ ] Add to inbox test
- [ ] Test full flow
