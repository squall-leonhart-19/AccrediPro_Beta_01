# AccrediPro DEPTH Method Quiz Funnel — Complete Documentation

> **Last Updated:** February 2026
> Built for AccrediPro LMS — Career transformation platform for 40+ US women in health & wellness.

---

## Table of Contents

1. [System Overview](#system-overview)
2. [Quiz Page](#quiz-page)
3. [Results / Sales Page (Healthcare)](#results-page-healthcare)
4. [Scholarship Chat Widget](#scholarship-chat-widget)
5. [Simulation Dashboard](#simulation-dashboard)
6. [Personalization Engine](#personalization-engine)
7. [API Endpoints](#api-endpoints)
8. [File Map & Line Counts](#file-map)
9. [Remaining Work](#remaining-work)

---

## System Overview

### The Funnel Flow

```
QUIZ (/quiz/depth-method)
  │
  ├─ INTRO → Name entry + social proof
  ├─ 12 QUESTIONS → Persona-aware with Sarah reactions
  ├─ TESTIMONIALS → Shown after Q3, Q6, Q9 (persona-specific)
  ├─ OPTIN → First name, last name, email, phone
  ├─ REVIEWING → 6 animated steps (persona-specific)
  └─ QUALIFIED → Score + practitioner badge
        │
        ▼
RESULTS PAGE (/results/{persona})
  │
  ├─ 19 hyper-personalized sections
  ├─ ALL 12 quiz answers used for dynamic content
  ├─ Scholarship chat widget (pay-what-you-want model)
  ├─ Countdown timer + scarcity (spots)
  └─ Every CTA opens the scholarship chat
        │
        ▼
SCHOLARSHIP CHAT (floating widget)
  │
  ├─ Sarah's 3-message welcome sequence (timed, natural delays)
  ├─ Auto-sends full quiz application to admin
  ├─ Polls for admin replies every 10s
  ├─ Persists in localStorage (survives close/refresh)
  └─ Admin manages via /admin/live-chat/
```

### Tech Stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Framer Motion for scroll animations
- URL params to pass all 12 quiz answers between pages
- localStorage for chat persistence
- Existing `/api/chat/sales` + `/api/chat/optin` APIs

---

## Quiz Page

**File:** `src/app/(public)/quiz/depth-method/page.tsx`
**Lines:** ~1,235

### Quiz Stages

| Stage | What Happens |
|-------|-------------|
| **Intro** | Name entry, 4.9 stars, 1,197+ reviews, 2,847+ women, accreditation logos |
| **Quiz** | 12 questions with real-time persona-aware reactions from Sarah |
| **Testimonial** | Dynamic testimonials shown after Q3, Q6, Q9 (3 per persona = 15 total) |
| **Optin** | Collect first name, last name, email, phone |
| **Reviewing** | 6 animated review steps, fully rewritten per persona |
| **Qualified** | "You Qualify!" with score (15-98%), practitioner type badge |
| **Result** | Redirect to `/results/{persona}` with all quiz data as URL params |

### The 12 Questions

| Q# | Pillar | Question | Options | Key Impact |
|----|--------|----------|---------|------------|
| 1 | Profile | What best describes you? | Healthcare pro, Health coach, Corporate, Stay-at-home mom, Other passionate | **Determines entire persona routing** |
| 2 | Profile | Current monthly income | $0, <$2K, $2K-$5K, $5K+ | Income gap math, Sarah callout, pain points |
| 3 | Dream Outcome | 12-month income goal | $5K, $10K, $20K, $50K+ | Hero headline, income math, final CTA |
| 4 | Experience | Client experience level | Active clients, Past experience, Informal only, No experience | Timeline weeks (3-7), bonuses copy, FAQ |
| 5 | Clinical | Root-cause confidence | Very confident, Somewhat, Not very, Would refer out | Clinical edge section (4 variants) |
| 6 | Clinical | Lab interpretation interest | Already doing, Want to learn, Open to it, Not sure | Lab callout variants |
| 7 | Investment | Past certification history | Multiple disappointed, Some value, Spent $5K+, First time | Conditional section (3 variants), guarantee, FAQ |
| 8 | Gap Analysis | What's missing most? | Framework, Confidence, Client system, Credibility | Hero subtitle (4 variants) |
| 9 | Commitment | 20 min/day commitment | Absolutely, Yes with work, Rearrange, Not sure | "Who NOT for" framing, objection crusher, FAQ |
| 10 | Vision | Desired outcome | Leave job, Financial security, Fulfillment, All above | Sarah's message (4 variants), final CTA, bonuses |
| 11 | Specialization | FM specialization choice | Hormone Health, Gut Restoration, Metabolic Optimization, Burnout Recovery, Autoimmune Support | Practitioner badge, modules, specialization preview |
| 12 | Readiness | When ready to start? | This week, 2 weeks, 1 month | Urgency (bar color, spots 3/5/7, countdown 20/30 min) |

### 8 Personalization Layers in the Quiz

1. **TESTIMONIALS_BY_PERSONA** — 5 personas x 3 testimonials (shown after Q3, Q6, Q9)
2. **PERSONA_REACTIONS** — 50-100+ unique Sarah reactions per persona per question
3. **REVIEW_STEPS_BY_PERSONA** — 6 reviewing steps completely rewritten per persona
4. **QUALIFICATION_FRAMING** — Percentile ranking + reason per persona
5. **COHORT_NAMES** — Custom cohort names + spot counts per persona
6. **OPTIN_BULLETS** — 3 unique value bullets per persona
7. **PERSONA_SUBTITLES** — Custom question subtitles for Q1, Q3, Q5, Q8 per persona
8. **CERT_SUBTITLE** — Certificate description per persona

### Persona Routing

```
Q1 Answer          → Results Page
────────────────────────────────────
healthcare-pro     → /results/healthcare
health-coach       → /results/coach
corporate          → /results/corporate
stay-at-home-mom   → /results/mom
other-passionate   → /results/career-change
```

### API Call on Optin

```
POST /api/quiz-funnel
{
  name, lastName, email, phone,
  funnel: "depth-method",
  answers: { all 12 answers },
  practitionerType, incomeGoal, currentRole
}
```

---

## Results Page (Healthcare)

**File:** `src/app/(public)/results/healthcare/page.tsx`
**Lines:** ~1,211

### URL Parameters Received

```
?name=Jessica&lastName=Williams&email=jessica@example.com
&type=hormone-health&goal=10k&role=healthcare-pro
&currentIncome=under-2k&experience=past-experience
&clinicalReady=somewhat&labInterest=want-to-learn
&pastCerts=multiple-disappointed&missingSkill=framework
&commitment=absolutely&vision=leave-job&startTimeline=this-week
```

### All 19 Sections

| # | Section | Personalized By | Description |
|---|---------|----------------|-------------|
| — | Sticky Urgency Bar | Q12 (start timeline) | Burgundy URGENT if this-week, gold otherwise. Clickable → opens chat |
| — | Trustpilot Widget | — | Client-only render (avoids hydration mismatch). 4.9 stars |
| 1 | **Hero** | Q8 (missing skill), Q11 (specialization) | "Functional Medicine Certification — Specialized in {type}". 4 subtitle variants |
| 2 | **"You Told Us" Callout** | Q2 (current income) | Sarah's assessment callout, 4 income-specific variants |
| 3 | **Pain Points** | Q2, Q5, Q7, Q10 | 4 pain points with conditional messaging |
| 4 | **Cost of Inaction** | Q2 (current), Q3 (goal) | Income gap math: monthly gap x 12 = yearly loss |
| 5 | **Before → After** | Q4, Q5, Q10 | 5 transformation rows |
| — | **Mid-Page CTA 1** | — | "Apply for Scholarship" button |
| 6 | **Clinical Edge** | Q5 (clinical readiness) | 4 headline variants + content |
| — | **Lab Callout** | Q6 (lab interest) | 2 callout variants |
| 7 | **Testimonials** | Q2, Q4, Q7, Q10 | 3 long-form stories (Karen, Margaret, Carolyn) with match badges |
| 8 | **Past Cert Recovery** | Q7 (past certs) | CONDITIONAL: only if Q7 = disappointed/5k+/some-value. 3 variants |
| 9 | **Who This Is NOT For** | Q9 (commitment) | Reverse psychology objection handler |
| 10 | **Specialization + Why Nurses** | Q11 (type), Q4 (experience) | Track preview, module list, client types |
| — | **Mid-Page CTA 2** | — | Scholarship button |
| 11 | **Income Math** | Q2, Q3, Q11 | Sessions/week needed, rates, gap calculation |
| 12 | **Value Stack** | — | Total value $19,979 crossed out → "Pay What You Can" scholarship |
| 13 | **Bonuses** | Q4, Q10 | 7 bonuses: 4 original + community, mentor chat, resources |
| 14 | **What Happens Next** | Q12, Q9, Q11 | 4-step timeline with personalized weeks |
| 15 | **Guarantee** | Q7 (past certs) | 7-day money-back. Stronger copy if burned before |
| 16 | **Sarah's Personal Message** | Q10 (vision) | 4 different personal messages from Sarah |
| 17 | **Objection Crusher** | Q2, Q4, Q7, Q9 | 7 objections crushed (affordability, time, failure, subscription, self-paced, medical degree, dust) |
| 18 | **FAQ** | Q4, Q7, Q9 | 8+ FAQs. 4 always shown + 4 conditional based on quiz answers |
| 19 | **Final CTA** | Q10, Q12 | Dynamic header, countdown, scholarship spots, vision-specific copy |
| — | **Trust Footer** | — | Trustpilot stars, accreditation logos |

### Key Calculations

```
Income Gap    = (goal monthly) - (current monthly)
Yearly Loss   = gap × 12
Sessions/mo   = goal ÷ $800/session
Weekly Clients = sessions ÷ 4
Urgency Spots = 3 (this-week) | 5 (2-weeks) | 7 (1-month)
Countdown     = 1200s / 20min (this-week) | 1800s / 30min (else)
Cert Weeks    = 3 (active-clients) | 4 (past-experience) | 5 (informal-only) | 7 (no-experience)
```

### Pricing Model: Pay-What-You-Can Scholarship

No checkout page. No fixed price. Instead:
- All CTAs open the scholarship chat
- Value stack shows $19,979 crossed out → "Pay What You Can"
- Sarah asks what they can invest
- Admin reviews and creates a custom product link
- Trust badges: "Pay What You Can" / "Scholarships Available" / "ASI Accredited"

### Practitioner Types Config (PRACT)

```
hormone-health     → label: "Functional Medicine Certification", specialization: "Hormone Health"
gut-health         → label: "Functional Medicine Certification", specialization: "Gut Restoration"
metabolic          → label: "Functional Medicine Certification", specialization: "Metabolic Optimization"
burnout            → label: "Functional Medicine Certification", specialization: "Burnout Recovery"
autoimmune         → label: "Functional Medicine Certification", specialization: "Autoimmune Support"
```

---

## Scholarship Chat Widget

**File:** `src/components/results/scholarship-chat.tsx`
**Lines:** ~535

### Props

```typescript
interface ScholarshipChatProps {
  firstName: string;
  lastName: string;
  email: string;
  quizData: {
    type, goal, role, currentIncome, experience,
    clinicalReady, labInterest, pastCerts,
    missingSkill, commitment, vision, startTimeline
  };
  page?: string;
}
```

### Features

- **Floating button** with Sarah's photo + "Apply for Scholarship" + green online indicator
- **Pulse animation** for first 12 seconds
- **Global trigger:** `window.__openScholarshipChat()` callable from any CTA
- **Skips optin** — already has all data from quiz URL params

### Welcome Sequence (Natural Timing)

| Delay | Typing Duration | Message |
|-------|----------------|---------|
| 3s | 2.5s | "Hey {name}! I just saw your assessment come through." |
| +6s | 3.5s | Income-aware message (4 variants from Q2) |
| +8s | 4s | Scholarship ask (3 variants from Q7) |

Total: ~27 seconds for full welcome — feels natural, not instant/fake.

### Persistence

- **localStorage key:** `asi_scholarship_chat`
- **Stores:** visitorId, messages[], hasStarted, welcomeDone, email
- **Survives:** close/reopen, page refresh
- **Polling:** Every 10s for admin replies (continues even when chat minimized)

### Auto-Acknowledgment

If visitor sends a message and no admin replies within 5 seconds:
> "Thanks {name}, let me check on that for you..."

### Admin Management

- All messages go to `/api/chat/sales`
- Admin monitors via `/admin/live-chat/` panel
- Admin replies polled via `/api/chat/messages?visitorId=xxx`

---

## Simulation Dashboard

**File:** `src/app/(public)/simulation/page.tsx`
**Lines:** ~482

### Purpose

Internal testing tool to preview the healthcare results page with different quiz answer combinations. Shows exactly which personalization layers activate.

### 6 Pre-Built Presets

| Preset | Income | Goal | Key Traits |
|--------|--------|------|------------|
| Burned-Out Nurse | $0 | $10K | ER nurse, zero income, burned by certs, wants to leave, starting this week |
| Experienced PA | $5K+ | $20K | Active clients, very confident, all-above vision |
| Fresh Start Nurse | <$2K | $5K | Not very clinical, first certification, needs confidence |
| Multiple Disappointed | $2K-$5K | $10K | Past clients, multiple disappointing certs, wants credibility |
| Ambitious Empire Builder | $5K+ | $50K+ | Very confident, already doing labs, starting this week |
| Cautious Informal Helper | $0 | $5K | Zero income, informal only, not sure about commitment |

### What It Shows

- All 15 quiz fields as customizable dropdowns
- **Personalization Map:** 13 tracked layers with which variant activates
- **Answer → Section Impact Map:** Which sections each Q affects
- **"Open Live Results Page" button:** Generates full URL with all params

---

## Personalization Engine

### How Every Quiz Answer Is Used

```
Q1  (Role)          → Routes to persona-specific results page
Q2  (Current Income) → 6 sections: income math, pain points, before/after,
                       objection crusher, Sarah callout, testimonial badges
Q3  (Income Goal)    → 6 sections: hero headline, income math, cost of inaction,
                       before/after, final CTA
Q4  (Experience)     → 6 sections: timeline weeks, before/after, what happens next,
                       bonuses copy, FAQ conditional
Q5  (Clinical Ready) → 4 sections: clinical edge (4 variants), before/after, pain points
Q6  (Lab Interest)   → 2 sections: clinical callout, value stack lab mention
Q7  (Past Certs)     → 5 sections: past cert recovery (conditional, 3 variants),
                       pain points, guarantee strength, FAQ conditional
Q8  (Missing Skill)  → 2 sections: hero subtitle (4 variants), value stack business
Q9  (Commitment)     → 4 sections: who NOT for (3 variants), what happens next,
                       objection crusher, FAQ conditional
Q10 (Vision)         → 4 sections: Sarah's message (4 variants), pain points,
                       bonuses emphasis, final CTA (4 variants)
Q11 (Specialization) → 6 sections: practitioner badge, specialization preview,
                       modules list, client types, income math, protocols
Q12 (Start Timeline) → 5 sections: urgency bar color/text, spots (3/5/7),
                       countdown timer (20/30 min), final CTA header,
                       what happens next
```

### Conditional Content Rules

| Condition | What Shows |
|-----------|-----------|
| Q7 = multiple-disappointed OR spent-5k-plus OR some-value | Past Cert Recovery section (3 variants) |
| Q7 = multiple-disappointed OR spent-5k-plus | Extra FAQ: "I've wasted money on certs before" |
| Q4 = no-experience | Extra FAQ: "I haven't worked with clients yet" |
| Q9 = not-sure OR rearrange | Extra FAQ: "What if I can't study every day?" |
| Q12 = this-week | Burgundy urgency bar, 3 spots, 20min countdown |

---

## API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/quiz-funnel` | POST | Save quiz answers + lead data |
| `/api/chat/optin` | POST | Register scholarship chat visitor |
| `/api/chat/sales` | POST | Send chat messages to admin panel |
| `/api/chat/messages` | GET | Poll for admin replies (by visitorId) |

---

## File Map

| File | Lines | Purpose |
|------|-------|---------|
| `src/app/(public)/quiz/depth-method/page.tsx` | ~1,235 | 12-question quiz with 8 personalization layers |
| `src/app/(public)/results/healthcare/page.tsx` | ~1,211 | Healthcare results/sales page, 19 sections |
| `src/components/results/scholarship-chat.tsx` | ~535 | Floating scholarship chat widget |
| `src/app/(public)/simulation/page.tsx` | ~482 | Internal simulation dashboard |
| **Total** | **~3,463** | |

### Brand Colors

```
Burgundy:       #722f37
Burgundy Dark:  #4e1f24
Gold:           #d4af37
Gold Light:     #f7e7a0
Gold Metallic:  linear-gradient(135deg, #d4af37 0%, #f5e6a3 25%, #d4af37 50%, #c5a028 75%, #d4af37 100%)
Cream:          #fdfbf7
```

---

## Remaining Work

### Not Yet Built

- [ ] **Coach results page** (`/results/coach/`) — directory exists, page empty
- [ ] **Corporate results page** (`/results/corporate/`) — directory exists, page empty
- [ ] **Mom results page** (`/results/mom/`) — directory exists, page empty
- [ ] **Career-change results page** (`/results/career-change/`) — directory exists, page empty
- [ ] **Audio in chat** — user mentioned wanting audio capability, not built
- [ ] **Admin workflow after price** — manual product link creation after scholarship price agreed
- [ ] **Images on sales page** — user will specify which images and where

### What's Working

- [x] 12-question quiz with 8 personalization layers across 5 personas
- [x] Healthcare results page with 19 hyper-personalized sections
- [x] Pay-what-you-can scholarship model (no checkout)
- [x] Scholarship chat with natural delays, persistence, admin polling
- [x] Simulation dashboard with 6 presets
- [x] Trustpilot widget (client-only, no hydration error)
- [x] Objection-busting content (lifetime access, one-time payment, self-paced, no medical degree)
- [x] Bonuses (community, private mentor chat, resources)
- [x] 1200px wide desktop layout
- [x] "Functional Medicine Certification — Specialized in {type}" naming
