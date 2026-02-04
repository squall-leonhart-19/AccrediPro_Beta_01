---
description: Create and optimize a Circle Pod mini diploma curriculum
---

# Circle Pod Mini Diploma Workflow

## Prerequisites
- [ ] Niche identified (e.g., functional-medicine, autism, faith, adhd, narcissism, equine)
- [ ] Zombie avatar images available in `/public/zombies/`

---

## STEP 1: Create Zombie Profile

Create `/src/data/zombies/{niche}-{name}.json`:

```json
{
  "nicheId": "{niche}",
  "zombie": {
    "id": "{niche}-{name}",
    "name": "{Name}",
    "age": 48,
    "avatar": "/zombies/{name}.webp",
    "niche": "{niche}",
    "backstory": "Dramatic personal story...",
    "dramaticMoment": "The moment everything changed - emotional, crying 😭...",
    "incomeStory": "$X,XXX/month working X hours/week",
    "writingStyle": {
      "capitalization": "mostly lowercase",
      "emojis": ["😭", "💕", "🙌", "🥹", "😅", "💪", "🔥"],
      "tone": "warm, supportive, emotional"
    },
    "videoTestimonialScript": "Script for video testimonial..."
  }
}
```

---

## STEP 2: Create Niche Config

Define variables for the niche:

```typescript
{
  "nicheId": "{niche}",
  "variables": {
    "nicheStruggle": "your specific struggle description",
    "nicheExample": "specific examples for this niche",
    "nicheGroups": "Facebook groups for this niche",
    "nichePillars": ["Pillar1", "Pillar2", "Pillar3", "Pillar4", "Pillar5"],
    "nicheAuthority": "relevant professionals in this niche",
    "nicheScope": "what practitioners can/cannot do in this niche"
  }
}
```

---

## STEP 3: Adapt Curriculum

Copy template and replace variables:

1. Copy `/src/data/masterclass-days-9-23.ts`
2. Copy `/src/data/masterclass-days-24-45.ts`
3. Replace all `{nicheStruggle}`, `{nicheExample}`, etc. with niche-specific content
4. Update zombie messages to match niche

---

## STEP 4: Add Audio URLs (8 Key Days)

Add `sarahAudioUrl` field to these days:
// turbo
```
Day 1: sarahAudioUrl: "/audio/{niche}/day-1-welcome.mp3"
Day 8: sarahAudioUrl: "/audio/{niche}/day-8-scholarship.mp3"
Day 14: sarahAudioUrl: "/audio/{niche}/day-14-deadline.mp3"
Day 21: sarahAudioUrl: "/audio/{niche}/day-21-celebration.mp3"
Day 30: sarahAudioUrl: "/audio/{niche}/day-30-gap.mp3"
Day 35: sarahAudioUrl: "/audio/{niche}/day-35-dfy.mp3"
Day 42: sarahAudioUrl: "/audio/{niche}/day-42-invite.mp3"
Day 44: sarahAudioUrl: "/audio/{niche}/day-44-last.mp3"
```

---

## STEP 5: Add Video URLs (6 Key Days)

Add `videoTestimonialUrl` field to these days:
// turbo
```
Day 10: videoTestimonialUrl: "/videos/{niche}/case-study.mp4"
Day 13: videoTestimonialUrl: "/videos/{niche}/first-client.mp4"
Day 21: videoTestimonialUrl: "/videos/{niche}/milestone.mp4"
Day 30: videoTestimonialUrl: "/videos/{niche}/credential.mp4"
Day 33: videoTestimonialUrl: "/videos/{niche}/income-story.mp4"
Day 40: videoTestimonialUrl: "/videos/{niche}/graduate-montage.mp4"
```

---

## STEP 6: Create Resources

Create PDF resources for the niche in `/public/resources/{niche}/`:
// turbo
- origin-story-worksheet.pdf
- ideal-client-avatar.pdf
- pricing-calculator.pdf
- 5-pillar-assessment.pdf
- sample-session.pdf
- testimonial-template.pdf
- welcome-email-template.pdf
- referral-email-template.pdf
- client-boundaries-template.pdf
- weekly-time-blocking.pdf

---

## STEP 7: Update Seed Route

Modify `/src/app/api/admin/seed-templates/route.ts`:

1. Import new niche curriculum files
2. Add niche condition in POST handler
3. Map niche to correct zombie profile

// turbo
```typescript
import { daysXtoY as {niche}Days } from "@/data/masterclass-{niche}";
```

---

## STEP 8: Seed to Database

// turbo
```bash
curl -X POST http://localhost:3000/api/admin/seed-templates?niche={niche}
```

---

## STEP 9: Verify

1. Open `/admin/circle-templates`
2. Filter by niche
3. Verify all 45 days present
4. Check audio URLs on Days 1, 8, 14, 21, 30, 35, 42, 44
5. Check video URLs on Days 10, 13, 21, 30, 33, 40
6. Check zombie messages match niche language

---

## TIME ESTIMATE

| Task | Time |
|------|------|
| Zombie profile | 30 min |
| Niche config | 15 min |
| Curriculum adaptation | 2-3 hours |
| Resources | 1-2 hours |
| Seeding + testing | 30 min |
| **TOTAL** | **4-6 hours** |

---

## QUICK REFERENCE

### Niches Supported
- functional-medicine
- autism
- faith
- adhd
- narcissism
- equine
- (add more as needed)

### Key Files
- Zombie: `/src/data/zombies/{niche}-{name}.json`
- Days 1-8: `/src/app/api/admin/seed-templates/route.ts` (inline)
- Days 9-23: `/src/data/masterclass-days-9-23.ts`
- Days 24-45: `/src/data/masterclass-days-24-45.ts`
- Resources: `/public/resources/{niche}/`
