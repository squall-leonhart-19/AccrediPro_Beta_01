# Mini Diploma Landing Page Playbook

## Overview

This playbook documents the high-converting landing page structure for Mini Diploma lead magnets. Use this to replicate the same page for each new niche.

---

## Page Structure

```
┌─────────────────────────────────────┐
│ STICKY HEADER (Logo + CTA Button)   │
├─────────────────────────────────────┤
│ HERO SECTION                        │
│ - ASI Badge                         │
│ - Headline: "Become ASI-Certified"  │
│ - Subhead: Free + 20K practitioners │
│ - Star Rating                       │
│ - 2-FIELD FORM (Name + Email)       │
├─────────────────────────────────────┤
│ TRUST BAR                           │
│ 20K+ | 45 Countries | 4.9/5         │
├─────────────────────────────────────┤
│ VALUE PROPOSITION                   │
│ "In Just 60 Minutes, You'll..."     │
├─────────────────────────────────────┤
│ SOCIAL PROOF BANNER                 │
│ "Join 1,247 Women This Week"        │
├─────────────────────────────────────┤
│ URGENCY SECTION                     │
│ "Won't Be Available Forever"        │
├─────────────────────────────────────┤
│ VALUE TABLE                         │
│ What You Get | Value                │
├─────────────────────────────────────┤
│ TESTIMONIALS (3x, initials only)    │
├─────────────────────────────────────┤
│ COACH SECTION                       │
├─────────────────────────────────────┤
│ FAQ ACCORDION (6 questions)         │
├─────────────────────────────────────┤
│ FINAL CTA                           │
├─────────────────────────────────────┤
│ ASI FOOTER                          │
└─────────────────────────────────────┘
```

---

## Key Elements

### 1. Hero Section

**Headline Formula:**
```
Become an ASI-Certified [NICHE] Specialist
```

**Subhead Formula:**
```
Free 60-minute training — Join 20,000+ certified practitioners worldwide
```

**Badge:**
- ASI Shield icon
- "ASI Certified Program"

---

### 2. Form (2 Fields Only)

| Field | Type | Required |
|-------|------|----------|
| First Name | text | ✅ |
| Email | email | ✅ |

**Reassurance Below Button:**
- ✓ No credit card required
- ✓ Instant access to Lesson 1
- ✓ Meet Coach [Name] in 60 seconds
- ✓ Unsubscribe anytime

---

### 3. Trust Bar

| Metric | Value |
|--------|-------|
| ASI Certified | ✅ |
| Practitioners | 20,000+ |
| Countries | 45+ |
| Rating | 4.9/5 (1,000+ reviews) |

---

### 4. Value Proposition

**Headline:**
```
In Just 60 Minutes, You'll Be Able To:
```

**5 Outcomes (niche-specific):**
- ✓ [Specific skill they'll gain]
- ✓ [Connection most practitioners miss]
- ✓ [Red flag recognition]
- ✓ [Confidence-building outcome]
- ✓ [Industry opportunity]

**Footer:**
```
No [background] required. Start from zero.
```

---

### 5. Social Proof Banner

```
Join [1,247] [Audience] Who Started This Week
⭐⭐⭐⭐⭐ 4.9/5 from 1,000+ verified reviews

"[Short testimonial with specific result]"
— [Name], [Previous Role] → [New Role]
```

---

### 6. Urgency Section

```
⏰ This Free Training Won't Be Available Forever

We're currently accepting new students into the [NICHE] track.
Spots fill fast — over 200 [audience] joined this week alone.

[CTA Button]
```

---

### 7. Value Table

| What You Get | Value |
|--------------|-------|
| 3 Expert-Led Modules | Deep-dive into [topic] |
| 9 Bite-Sized Lessons | Watch on your phone, at your pace |
| Coach [Name] Guidance | Your personal mentor throughout |
| ASI Mini-Diploma Certificate | Download and share on LinkedIn |
| Career Roadmap | See exactly how to become certified |

**Total Value: $197 — Yours FREE Today**

---

### 8. Testimonials (3)

**Format:**
- ⭐⭐⭐⭐⭐ Stars
- Quote with specific result
- Initial in circle (no AI avatars)
- Name + Role transformation

**Example:**
```
"Quote about specific result..."
— Jennifer M. | Former HR Manager → Certified [Niche] Coach
```

---

### 9. Coach Section

**Elements:**
- Coach photo (real, warm)
- "Online" badge
- Name: "Meet Coach [Name] — Your Mentor"
- Bio (150 words max)
- Personal quote

---

### 10. FAQ Accordion (6 Questions)

| Question | Answer |
|----------|--------|
| Is this really free? | Yes, 100% free. No credit card. |
| How long does it take? | About 60 minutes total. Self-paced. |
| Do I need experience? | No. Most start with zero background. |
| Will I get a certificate? | Yes! Complete all 9 lessons. |
| What happens after? | Option to continue with full certification. |
| Who is ASI? | Certification authority. 20K+ practitioners. |

---

### 11. Final CTA

```
Ready to Start Your Journey?

In 60 minutes, you'll know more about [topic] than most [professionals].

Join 20,000+ ASI-certified practitioners who started exactly where you are now.

[CTA Button]

[ASI Badge] ⭐ 4.9/5 from 1,000+ reviews
```

---

### 12. Footer

```
[Logo] Accreditation Standards Institute
Est. 2026 • 20,000+ Practitioners Worldwide
"The Gold Standard in Health & Wellness Certification"
```

---

## Replication Steps

### Step 1: Copy Template

```bash
cp src/app/(public)/womens-health-mini-diploma/page.tsx \
   src/app/(public)/{niche}-mini-diploma/page.tsx
```

### Step 2: Find & Replace

| Find | Replace |
|------|---------|
| `womens-health` | `{niche}` |
| `Women's Health` | `{Niche Name}` |
| `hormonal health` | `{topic}` |
| `Coach Sarah` | `Coach {Name}` |
| `/coaches/sarah-coach.webp` | `/coaches/{coach}.webp` |

### Step 3: Update Content

1. **Testimonials** - Update names, roles, quotes
2. **Learning Outcomes** - Make niche-specific
3. **Value Table** - Adjust if needed
4. **FAQs** - Update if niche-specific questions

### Step 4: Create Thank You Page

```bash
mkdir -p src/app/(public)/{niche}-mini-diploma/thank-you
cp src/app/(public)/womens-health-mini-diploma/thank-you/page.tsx \
   src/app/(public)/{niche}-mini-diploma/thank-you/page.tsx
```

### Step 5: Update API

In `/api/mini-diploma/optin/route.ts`, add:
```typescript
"{niche}": "{niche}-mini-diploma",
```

---

## Conversion Checklist

- [ ] 2-field form (no last name)
- [ ] ASI branding throughout
- [ ] Trust bar with stats
- [ ] Urgency section
- [ ] Value table with strikethrough price
- [ ] Testimonials with initials (no AI avatars)
- [ ] FAQ accordion
- [ ] Coach section with photo
- [ ] Multiple CTAs throughout
- [ ] ASI footer

---

## Expected Performance

| Metric | Before | After |
|--------|--------|-------|
| Opt-in rate | 25-35% | 40-50% |
| Mini-diploma start rate | 70% | 80%+ |
| Trust perception | Medium | High |
