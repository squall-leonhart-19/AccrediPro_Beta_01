# 🧠 FM Quiz Funnel — Strategy & Reasoning
> **Created**: Feb 3, 2026 | **Status**: Specs Complete, Ready for Implementation

---

## 📋 Executive Summary

We designed **two quiz funnels** to test different price points and conversion strategies for the FM certification ecosystem:

| Funnel | Entry Price | Product | Psychology |
|--------|-------------|---------|------------|
| **Funnel A** | $17 | FM Foundations (Mini Diploma) | "Application Accepted" — they QUALIFIED |
| **Funnel B** | $97 | DEPTH Method™ Certification | "You have what it takes" — clinical authority |

---

## 🎯 The Problem We're Solving

**Current State:**
- Mini Diploma is FREE at `/functional-medicine-mini-diploma`
- $97 Certification sells via Meta Ads → Sales Page directly
- No email capture before landing on sales page
- No pre-qualification or personalization

**Opportunity:**
- Quiz funnel captures email BEFORE purchase decision
- Pre-sells and qualifies leads before they see price
- Enables personalization and retargeting
- Creates "gap" psychology that drives conversion

---

## 💰 Price Point Strategy

### Why Test $7 / $17 / $27?

| Price | Pros | Cons | Best For |
|-------|------|------|----------|
| **$7** | Highest volume, impulse buy | Lowest margin, some tire-kickers | Volume testing, list building |
| **$17** | Good filter, still impulse for 40+ women | Slight volume drop | Sweet spot for 40+ employed demo |
| **$27** | Best margin, highest quality leads | Lower volume | Margin optimization |

**Decision:** Start with $17, test $7 and $27 as variants.

**For 40+ US Women specifically:**
- They have disposable income → $17-27 is nothing for a career change
- $7 might feel "too cheap" and trigger skepticism
- $17 recommended as baseline

---

## 🧠 Hormozi Principles Applied

### 1. Qualification Over Selling
> "People want what they can't have"

- Changed "Buy our course" → "You've been accepted"
- Only 34% of applicants qualify (scarcity)
- They EARNED access, didn't just purchase it

### 2. Gap Creation
Every question shows them what they DON'T have:
- Q1-3: Amplify current pain
- Q4-6: Future pace the dream
- Q7-9: Surface objections (so we can crush them)
- Q10-12: Test commitment level

### 3. Investment Mindset
Even $17 feels like they're investing in transformation:
- "Enrollment fee" not "price"
- "Secure your spot" not "buy now"
- "Application accepted" not "purchase complete"

### 4. Social Proof at Doubt Moments
- Dynamic reactions after EVERY answer ("Exactly like Grace...")
- Mid-quiz testimonials with photos at Q4, Q8, Q11
- "People like you" counters (2,847 women certified in Hormone Health)

---

## 📊 Funnel A: $17 FM Foundations (Mini Diploma)

### Positioning
> "See if you qualify for our FM Foundations Program — the same starting point our highest-earning practitioners used before they went full-time."

### Psychology
- This is an APPLICATION, not a purchase
- They're being ACCEPTED into an exclusive program
- Foundations = first step on a bigger journey

### Flow
```
Meta Ad → Application Quiz → "Application Accepted" → Email → Enrollment Page ($17) → Bump ($27) → OTO ($97 DEPTH)
```

### Key Copy Elements
- "Only 34% of applicants qualify"
- "Secure your spot"
- "12 spots remaining at this rate"
- OTO: "Most of our top earners don't stop at Foundations"

---

## 📊 Funnel B: $97 DEPTH Method™ (Direct)

### Positioning
> "Do you have what it takes to master the DEPTH Method™ — the clinical framework that separates real practitioners from basic health coaches?"

### Psychology
- Clinical authority (not fluffy coaching)
- Identity shift: "Practitioner" not "coach"
- Named framework = proprietary value
- Higher commitment = higher value perception

### Flow
```
Meta Ad → Assessment Quiz → "You Qualify" → Email → Personalized Results → REDIRECT to /fm-certification
```

### Key Differences from Funnel A
- More clinical language
- DEPTH Method™ introduced in quiz
- Questions surface why "basic coaching" isn't enough
- Results page redirects to existing sales page (not standalone checkout)
- Sales page can be personalized via URL params

---

## 🔥 Quiz Completion Optimization Tactics

| Tactic | Why It Works |
|--------|--------------|
| **Progress bar starts at 20%** | Sunk cost — they've already "invested" |
| **Sarah's face on every screen** | Parasocial connection, speaking to HER |
| **Dynamic reactions per answer** | "Exactly like Grace..." — they're not alone |
| **Mid-quiz testimonials (with photos)** | Social proof at exact moment of doubt |
| **Name personalization** | Every question uses {{NAME}} |
| **Micro-commitment checkpoints** | Small yeses → big yes |
| **Results teaser at 75%** | "You're qualifying!" — must finish |
| **Exit intent email capture** | Recover abandoners for nurture |
| **Time perception hack** | "~90 seconds left!" feels faster |

**Expected Completion Rate:** 70-80%+ (vs. 40-50% for standard quizzes)

---

## 👩‍⚕️ Sarah's Persona

**Identity:**
> Former burned-out ER nurse and single mum who was missing her kids' school plays to survive another double shift. Found a better path through Functional Medicine.

**Voice Guidelines:**
- Warm, maternal, relatable
- Never salesy — always caring
- Speaks as a friend who's been there
- Uses "we" and "you" — never corporate

**Visual:**
Circular avatar photo on EVERY screen — multiple expressions:
- Welcoming (intro)
- Empathetic (pain questions)
- Proud (acceptance screen)
- Concerned (exit intent)

---

## 📁 Files in FM_QUIZ_Test/

| File | Purpose |
|------|---------|
| `FM_QUIZ_SPEC.md` | $17 Foundations Application funnel spec |
| `FM_QUIZ_$97_SPEC.md` | $97 DEPTH Method™ direct funnel spec |
| `quiz_instruction_reasoning.md` | This document — strategy & context |

---

## ✅ Next Steps

### Immediate (Before Build)
- [ ] Confirm final price point for testing ($17 baseline)
- [ ] Decide: build as separate pages or within existing Next.js portal?
- [ ] Source/generate 25+ UGC testimonial photos for quiz reactions
- [ ] Create multiple Sarah avatar expressions

### Build Phase
- [ ] Create quiz component (`quiz.tsx`) with:
  - Multi-step flow
  - Progress bar (starts at 20%)
  - Dynamic reactions per answer
  - Personalization ({{NAME}})
  - Exit intent modal
- [ ] Create "Application Accepted" / "You Qualify" screens
- [ ] Create email capture gate
- [ ] Create results/enrollment pages ($17 and $97 versions)
- [ ] Integrate Stripe checkout for $17 + $27 bump
- [ ] Build OTO page for $97 DEPTH upsell

### Post-Build
- [ ] Set up Meta Pixel events (QuizStart, QuizComplete, EmailCapture, Purchase)
- [ ] Create 3-5 ad variants pointing to quiz
- [ ] Configure email nurture sequence for non-buyers
- [ ] A/B test $7 / $17 / $27 price points
- [ ] Track completion rate, CVR, AOV, bump take rate

### Success Metrics (Targets)

| Metric | Funnel A ($17) | Funnel B ($97) |
|--------|----------------|----------------|
| Quiz Start → Complete | >70% | >70% |
| Complete → Email Opt-In | >85% | >85% |
| Email → Purchase | >10% | >5-8% |
| Bump Take Rate | >65% | N/A |
| OTO Take Rate | >15% | N/A |
| Average Cart Value | >$40 | $97 |

---

## 🤔 Open Questions for Future

1. **Personalized Sales Page**: Should `/fm-certification` show personalized header based on quiz answers?
2. **Email Nurture**: What's the sequence for non-buyers? 3-day? 7-day?
3. **Retargeting**: Quiz completers who don't buy — what ads do they see?
4. **Split Test**: Should we A/B test quiz vs. no-quiz for $97 to prove lift?

---

*Last Updated: Feb 3, 2026*
