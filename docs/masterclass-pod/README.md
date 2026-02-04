# Masterclass Pod System

> **"The circle is awareness. The course is action. Both work together but run independently."**

## Overview

Private 3-person circles (Coach Sarah + Zombie Peer + Student) that nurture Mini Diploma leads through a 45-day engagement sequence, creating gaps and social proof that lead to the paid certification upsell.

---

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Circle lifespan | **45 days** | Students may convert late (Day 35-45) |
| Trigger | **Optin** | Engagement starts immediately, not after exam |
| Circle vs Login | **Independent** | Notifications create FOMO even if not logged in |
| Zombie @mention | **Sarah first** | Soft push then peer pressure |
| Account dormant | **Day 7 no login** | Access revoked but account preserved |
| Account purge | **Day 90** | GDPR-friendly cleanup |

---

## Timeline & Urgency

```
Hour 0      → Optin (48h countdown starts)
Hour 0-48   → CRITICAL WINDOW - must get first login + lesson 1
Hour 48     → Access "expires" but secretly extends to 7 days
Day 7       → Hard cutoff (account dormant, circle continues)
Day 45      → Circle archived, lead tagged "cold-lead"
Day 90      → Account purged
```

---

## Multi-Channel Recovery Strategy

### No Login Recovery (Email + Circle)

| Trigger | Channel | Sender | Message Type |
|---------|---------|--------|--------------|
| +2h no login | Email | Sarah | "Your access is ready!" |
| +2h no login | Circle | Zombie | "Just started! Anyone else nervous? 😅" |
| +6h no login | Email | System | "Don't lose access - 42h left" |
| +12h no login | Circle | Sarah | "Hey {name}! Saw you joined - excited to meet you!" |
| +24h no login | Email | Sarah | "Quick question..." (engagement hook) |
| +24h no login | Circle | Zombie | "@{name} have you started yet? I'm on lesson 2!" |
| +36h no login | Email | Sarah | "Last chance - 12h left ⏰" |
| +48h no login | Email | System | "Access extended! You have 5 more days" |
| +48h no login | Circle | Sarah | "Great news - I extended your access!" |

### Lesson Progress Triggers

| Trigger | Channel | Action |
|---------|---------|--------|
| Lesson 1 complete | Circle | Zombie: "Omg lesson 1 was great right?!" |
| Lesson 3 stall (24h) | Circle | Sarah: "How's lesson 3 going?" |
| Lesson 5+ complete | Circle | Sarah: "You're halfway! Amazing!" |
| Exam pass | Circle | Zombie: "Congrats!! 🎉" + Sarah: Scholarship hint |

### AFK in Circle

| Trigger | Sender | Action |
|---------|--------|--------|
| Never replied (24h) | Sarah | @mention: "Introduce yourself!" |
| Still silent (48h) | Zombie | "Hey @{name} you're so quiet! We don't bite 😊" |
| Still silent (72h) | Zombie | DM user directly (private push) |
| Day 7 silent | System | Tag as "afk-lead", circle continues |

---

## Circle Content (45 Days)

### Phase 1: Gap Creation (Days 1-7)

| Day | Sarah's Lesson | Gap Created | Zombie Reaction |
|-----|----------------|-------------|-----------------|
| 1 | Welcome + roadmap | "Where do I start?" | "So excited to be here!" |
| 2 | Client attraction | "I don't have clients" | "This is exactly what I needed" |
| 3 | Credibility & website | "I don't have a website" | "Working on mine today!" |
| 4 | Pricing your services | "What do I charge?" | "I was charging way too little" |
| 5 | Legal & insurance | "Is this legal?" | "This scared me too" |
| 6 | Sales conversations | "I hate selling" | "The script helped so much" |
| 7 | Visibility & marketing | "How do I get seen?" | "Already got 2 inquiries!" |

### Phase 2: Scholarship Window (Days 8-14)

| Day | Event |
|-----|-------|
| 8 | Sarah reveals scholarship (90%+ scorers) |
| 9-10 | Zombie asks questions about the offer |
| 11 | Zombie announces "I bought it!" + shows proof |
| 12-13 | Zombie shares excitement, asks Sarah questions |
| 14 | Scholarship expires - final push |

### Phase 3: Zombie Journey (Days 15-30)

| Day | Zombie Update |
|-----|---------------|
| 15 | "Starting the certification!" |
| 18 | "Module 2 is intense but so good" |
| 22 | "OMG I just got my first paying client!!" |
| 25 | "Niche feeling so clear now" |
| 28 | "Halfway through! Can't believe how much I've learned" |
| 30 | Sarah check-in: "How's everyone doing?" |

### Phase 4: Conversion Window (Days 31-45)

| Day | Focus |
|-----|-------|
| 31-35 | Zombie shares more wins, results |
| 36-40 | Sarah offers "late enrollment" option |
| 41-44 | Final social proof push |
| 45 | Circle archived |

---

## Account Lifecycle

```
ACTIVE → DORMANT → COLD → PURGED
```

| Status | Trigger | Access | Circle | Recovery |
|--------|---------|--------|--------|----------|
| **Active** | Optin | Full | Running | N/A |
| **Dormant** | 7 days no login | Revoked | Continues | Re-login or re-optin |
| **Cold** | Day 45 | None | Archived | New optin only |
| **Purged** | Day 90 | Deleted | N/A | Fresh start |

---

## Technical Architecture

### Database Models

- `MasterclassPod` - User's circle instance
- `MasterclassMessage` - All messages (Sarah, Zombie, User)
- `MasterclassDayProgress` - Daily tracking
- `MasterclassTemplate` - Content templates per day

### Key Files

- `src/lib/masterclass-pod.ts` - Core service
- `src/lib/masterclass-templates-seed.ts` - Content
- `src/app/api/masterclass-pod/route.ts` - API
- `src/app/api/cron/masterclass-advance/route.ts` - Daily cron
- `src/app/(lead)/portal/[slug]/circle/page.tsx` - UI (rename from /masterclass)

### Triggers

| Event | Action |
|-------|--------|
| Optin | `createMasterclassPod()` |
| Daily cron | `advanceToNextDay()` |
| User login | Check/update engagement |
| Lesson complete | Trigger circle message |

---

## TODO

- [ ] Rename `/masterclass` → `/circle`
- [ ] Seed zombie profiles for testing
- [ ] Build admin dashboard for pods/messages
- [ ] Build template editor GUI
- [ ] Implement login/progress triggers
- [ ] Add email recovery sequences
- [ ] Implement Day 45 archive logic
- [ ] Add niche-matching for zombies
