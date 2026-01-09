# Portal Optimization Plan — Board Approved

> AccrediPro Standards Institute
> Final Action Plan from Board Meeting
> Version 1.0 | January 2026

---

## Executive Summary

The Board (Zuckerberg, Bezos, Musk, Altman) conducted a full audit of the AccrediPro portal. The verdict: **solid for learning, weak for retention, growth, and credential communication.**

This document outlines the prioritized action plan to transform the portal from a "course platform" into a **professional certification authority**.

---

## Board Members & Their Focus

| Member | Focus Area | Key Insight |
|--------|------------|-------------|
| **Mark Zuckerberg** | Scale & Network Effects | "No viral loop. Students can't bring students." |
| **Jeff Bezos** | Customer Obsession | "You don't know why students drop. No data." |
| **Elon Musk** | First Principles | "Sarah should push, not wait. One action per day." |
| **Sam Altman** | AI & Future | "Sarah is at 10% potential. Double down." |

---

## Current State Assessment

### What Works Well ✅

| Feature | Status | Notes |
|---------|--------|-------|
| Course learning system | ✅ | Progress tracking, lessons, modules |
| Coach Sarah (AI) | ✅ | 24/7 availability, differentiator |
| My Pod (cohort chat) | ✅ | Scripted engagement, accountability |
| Certificates | ✅ | Download, share, verify |
| Dashboard | ✅ | Welcome, progress, social proof |
| Start Here onboarding | ✅ | Guided first steps |

### What's Missing ❌

| Gap | Impact | Board Owner |
|-----|--------|-------------|
| Credential Path visibility | Users don't see FC→CP→BC→MC | All |
| Engagement tracking | Can't predict/prevent dropout | Bezos |
| Proactive Sarah | She waits instead of pushes | Musk + Altman |
| Referral system | Zero viral growth | Zuckerberg |
| Milestone celebrations | Silent progress, no dopamine | Bezos |
| Public practitioner profiles | No social proof externally | Zuckerberg |
| Feedback collection | Can't improve without data | Bezos |

---

## Phase 1: Foundation (Weeks 1-2)

### 1.1 Credential Path Visualization

**Problem:** Users see "Career Ladder" with income stages, but not their CREDENTIAL progression. They don't know FC→CP→BC→MC exists.

**Solution:** Replace or supplement Career Ladder with Credential Path widget.

**Current (Income-focused):**
```
1. Certified Practitioner — $3K-$5K/month
2. Working Practitioner — $5K-$10K/month
3. Advanced & Master — $10K-$30K/month
4. Business Scaler — $30K-$50K/month
```

**New (Credential-focused):**
```
YOUR CERTIFICATION PATH

✅ FM Foundations Verified (FREE)
   ↓
🔄 FM-FC™ Foundation Certified — 67% complete
   ↓
🔒 FM-CP™ Certified Professional
   ↓
🔒 BC-FMP™ Board Certified Practitioner
   ↓
🔒 MC-FMP™ Master Practitioner

[VIEW REQUIREMENTS] [UPGRADE NOW]
```

**Implementation:**

```typescript
// New component: src/components/dashboard/credential-path.tsx

interface CredentialTier {
  tier: string;           // "FM-FC™"
  title: string;          // "Foundation Certified"
  status: "completed" | "in_progress" | "locked";
  progress?: number;      // 0-100 if in_progress
  price?: string;         // "$297"
}

const CREDENTIAL_PATH: CredentialTier[] = [
  { tier: "Foundations", title: "FM Foundations Verified", status: "completed" },
  { tier: "FM-FC™", title: "Foundation Certified", status: "in_progress", progress: 67, price: "$297" },
  { tier: "FM-CP™", title: "Certified Professional", status: "locked", price: "$1,997" },
  { tier: "BC-FMP™", title: "Board Certified Practitioner", status: "locked", price: "$5,997" },
  { tier: "MC-FMP™", title: "Master Practitioner", status: "locked", price: "$9,997" },
];
```

**Display:**
- Dashboard sidebar (desktop)
- Collapsible on mobile
- Also on My Credentials page

---

### 1.2 Milestone Celebrations

**Problem:** When students hit 25%, 50%, 75% completion — nothing happens. Silent progress = no dopamine = dropout.

**Solution:** Trigger celebrations at key milestones.

**Milestones:**

| Milestone | Trigger | Celebration |
|-----------|---------|-------------|
| First Lesson | 1 lesson complete | "Great start! 🎉" toast + confetti |
| 10 Lessons | 10 lessons complete | "First milestone! Keep going!" + badge |
| 25% Course | 25% progress | "Quarter done! You're building momentum." |
| 50% Course | 50% progress | "HALFWAY! 🔥 You're ahead of 60% of students." |
| 75% Course | 75% progress | "Final stretch! Certification is within reach." |
| 100% Course | Course complete | "CERTIFIED! 🏆" + certificate modal + share prompt |

**Implementation:**

```typescript
// src/lib/milestones.ts

export const MILESTONES = [
  { threshold: 1, type: "lessons", message: "Great start! You completed your first lesson! 🎉", badge: "first_step" },
  { threshold: 10, type: "lessons", message: "10 lessons done! You're building real knowledge. 💪", badge: "dedicated_learner" },
  { threshold: 25, type: "percent", message: "25% complete! You're ahead of most who start. Keep going!", badge: null },
  { threshold: 50, type: "percent", message: "HALFWAY THERE! 🔥 You're in the top 40% of students.", badge: "halfway_hero" },
  { threshold: 75, type: "percent", message: "75% complete! The finish line is in sight. Don't stop now!", badge: null },
  { threshold: 100, type: "percent", message: "YOU DID IT! 🏆 You're officially certified.", badge: "certified" },
];

export function checkMilestone(completedLessons: number, totalLessons: number, previouslyAwarded: string[]) {
  const percent = Math.round((completedLessons / totalLessons) * 100);

  for (const milestone of MILESTONES) {
    const value = milestone.type === "lessons" ? completedLessons : percent;
    if (value >= milestone.threshold && !previouslyAwarded.includes(`${milestone.type}_${milestone.threshold}`)) {
      return milestone;
    }
  }
  return null;
}
```

**Trigger points:**
- After lesson completion (check progress)
- Show toast notification
- Record in database (don't repeat)
- Send Sarah congratulation message

---

### 1.3 Naming Updates

**Problem:** "My Certificates" sounds like PDFs. "My Credentials" sounds professional.

**Changes:**

| Current | New | Reason |
|---------|-----|--------|
| My Certificates | My Credentials | Professional terminology |
| Practice & Earn | Career Center | Clearer purpose |
| (Keep) Coach Sarah | Coach Sarah | Personal, branded |
| (Keep) My Pod | My Pod | Short, friendly |

**Implementation:**

```typescript
// dashboard-nav.tsx

// Change:
{ href: "/certificates", label: "My Certificates", ... }
// To:
{ href: "/certificates", label: "My Credentials", ... }

// Change:
{ href: "/practice", label: "Practice & Earn", ... }
// To:
{ href: "/practice", label: "Career Center", ... }
```

---

## Phase 2: Retention (Weeks 3-4)

### 2.1 Proactive Sarah Nudges

**Problem:** Sarah waits for students to message her. She should PUSH them.

**Bezos:** "The customer doesn't know they need help until it's too late."
**Musk:** "One action per day. Sarah tells them what to do."

**Nudge System:**

| Trigger | Days | Sarah's Message |
|---------|------|-----------------|
| No login | 2 days | "Hey [Name]! I noticed you haven't been around. Everything okay? Your next lesson is waiting: [Lesson Title]" |
| No login | 5 days | "I miss you, [Name]! 😊 You were making great progress. Let's not lose momentum. Just 10 minutes today?" |
| No login | 7 days | "Hey [Name], I'm getting worried. Is something blocking you? Reply and let me know — I'm here to help." |
| Stuck on lesson | 3 days | "I see you've been on [Lesson] for a few days. Need help? Ask me anything, or skip ahead if it's not clicking." |
| 75%+ complete, stalled | 3 days | "You're SO CLOSE, [Name]! Just [X] lessons to go. Let's finish this week!" |
| Just completed course | 0 days | "CONGRATULATIONS! 🎉 You're officially [Credential]! Here's what to do next..." |

**Implementation:**

```typescript
// src/lib/sarah-nudges.ts

export interface NudgeRule {
  id: string;
  condition: "no_login" | "stuck_lesson" | "stalled_near_completion" | "just_completed";
  daysThreshold: number;
  progressThreshold?: number;  // For stalled_near_completion
  message: string;
  priority: number;  // Higher = more urgent
}

export const NUDGE_RULES: NudgeRule[] = [
  {
    id: "no_login_2d",
    condition: "no_login",
    daysThreshold: 2,
    message: "Hey {{firstName}}! I noticed you haven't been around. Everything okay? Your next lesson is waiting: {{nextLessonTitle}}",
    priority: 1,
  },
  {
    id: "no_login_5d",
    condition: "no_login",
    daysThreshold: 5,
    message: "I miss you, {{firstName}}! 😊 You were making great progress on {{courseName}}. Let's not lose momentum. Just 10 minutes today?",
    priority: 2,
  },
  {
    id: "no_login_7d",
    condition: "no_login",
    daysThreshold: 7,
    message: "Hey {{firstName}}, I'm getting a bit worried. Is something blocking you? Reply and let me know — I'm here to help you succeed.",
    priority: 3,
  },
  {
    id: "stuck_lesson",
    condition: "stuck_lesson",
    daysThreshold: 3,
    message: "I see you've been on \"{{currentLessonTitle}}\" for a few days. Need help? Ask me anything about it, or feel free to skip ahead if it's not clicking.",
    priority: 2,
  },
  {
    id: "stalled_near_completion",
    condition: "stalled_near_completion",
    daysThreshold: 3,
    progressThreshold: 75,
    message: "You're SO CLOSE, {{firstName}}! Just {{lessonsRemaining}} lessons to go until you're certified. Let's finish this week! 💪",
    priority: 3,
  },
];
```

**Cron Job (daily at 9 AM):**

```typescript
// src/app/api/cron/sarah-nudges/route.ts

export async function GET() {
  // 1. Get all active students
  // 2. Check each against nudge rules
  // 3. Send message via Sarah (create Message record)
  // 4. Log nudge sent (don't repeat same nudge within X days)
}
```

---

### 2.2 Engagement Tracking Dashboard (Admin)

**Problem:** You don't know who's about to drop out until they're gone.

**Solution:** Admin dashboard showing at-risk students.

**Metrics to track:**

| Metric | Definition | Risk Level |
|--------|------------|------------|
| Days since last login | Time since lastLoginAt | >3 = yellow, >7 = red |
| Days on current lesson | Time since last progress | >5 = yellow, >10 = red |
| Progress velocity | Lessons/week average | <1 = yellow, 0 = red |
| Sarah response rate | % of Sarah messages read/replied | <50% = yellow |

**Admin Dashboard View:**

```
┌─────────────────────────────────────────────────────────────────┐
│  STUDENT ENGAGEMENT — At Risk Students                          │
│                                                                  │
│  🔴 HIGH RISK (No login 7+ days)                                │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Maria G.      │ 9 days │ 45% complete │ [Send Nudge] [View] │ │
│  │ John S.       │ 7 days │ 23% complete │ [Send Nudge] [View] │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  🟡 MEDIUM RISK (No login 3-6 days)                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Lisa K.       │ 4 days │ 78% complete │ [Send Nudge] [View] │ │
│  │ Amanda B.     │ 3 days │ 56% complete │ [Send Nudge] [View] │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
│  🟢 ALMOST DONE (75%+ but stalled)                              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ Cheryl W.     │ 2 days │ 92% complete │ [Push to Finish]    │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### 2.3 Feedback Collection

**Problem:** No NPS, no lesson ratings, no way to improve.

**Solution:** Simple feedback at key moments.

**Feedback Points:**

| Moment | Question | Format |
|--------|----------|--------|
| After each lesson | "Was this lesson helpful?" | 👍 / 👎 |
| After each module | "Rate this module" | 1-5 stars |
| After course completion | "How likely to recommend?" | NPS 0-10 |
| After 30 days | "Are you using what you learned?" | Yes/No + comment |

**Implementation (Lesson feedback):**

```typescript
// At bottom of each lesson:

<div className="mt-6 p-4 bg-gray-50 rounded-lg">
  <p className="text-sm text-gray-600 mb-2">Was this lesson helpful?</p>
  <div className="flex gap-2">
    <Button variant="outline" onClick={() => submitFeedback("helpful")}>
      👍 Yes
    </Button>
    <Button variant="outline" onClick={() => submitFeedback("not_helpful")}>
      👎 Could be better
    </Button>
  </div>
</div>
```

---

## Phase 3: Growth (Weeks 5-6)

### 3.1 Referral System

**Problem:** Zero viral loop. Students can't bring students.

**Zuckerberg:** "Every student should bring 2 more. That's how you scale."

**Referral Program:**

```
┌─────────────────────────────────────────────────────────────────┐
│  REFER A FRIEND — Earn Rewards                                  │
│                                                                  │
│  Your referral link:                                            │
│  https://accredipro.com/r/MARIA-ABC123                         │
│                                                   [COPY] [SHARE]│
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  HOW IT WORKS:                                                   │
│                                                                  │
│  1. Share your link with friends                                │
│  2. They get $50 off any certification                         │
│  3. You get $50 credit when they enroll                        │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  YOUR REFERRALS:                                                 │
│                                                                  │
│  ✅ Jennifer L. — Enrolled FM-FC™ — You earned $50             │
│  ⏳ Amanda K. — Clicked link, not enrolled yet                  │
│                                                                  │
│  Total earned: $50                                              │
│  Pending: 1 referral                                            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Database Schema:**

```prisma
model Referral {
  id            String   @id @default(cuid())
  referrerId    String
  referrer      User     @relation("Referrer", fields: [referrerId], references: [id])
  referredId    String?
  referred      User?    @relation("Referred", fields: [referredId], references: [id])
  code          String   @unique
  status        ReferralStatus  // PENDING, ENROLLED, REWARDED
  rewardAmount  Decimal?
  createdAt     DateTime @default(now())
  convertedAt   DateTime?
}

enum ReferralStatus {
  PENDING
  CLICKED
  ENROLLED
  REWARDED
}
```

---

### 3.2 Public Practitioner Profiles

**Problem:** Practitioners are invisible to the world. No social proof.

**Solution:** Public profile pages for certified practitioners.

**URL:** `accredipro.org/practitioners/jane-smith`

**Public Profile:**

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ┌────────┐                                                     │
│  │ [Photo]│  Jane Smith, FM-CP™                                │
│  │        │  Certified Functional Medicine Professional         │
│  └────────┘                                                     │
│                                                                  │
│  📍 San Diego, CA  •  🌐 Virtual Available                      │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  VERIFIED CREDENTIALS                                           │
│                                                                  │
│  ✅ FM-FC™ Foundation Certified — Jan 2026                     │
│  ✅ FM-CP™ Certified Professional — Mar 2026                   │
│                                                                  │
│  Verify at: accredipro.org/verify/FM-CP-2026-XXXX              │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  SPECIALTIES                                                     │
│                                                                  │
│  • Gut Health & Digestion                                       │
│  • Hormonal Balance                                             │
│  • Weight Management                                            │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  ABOUT                                                           │
│                                                                  │
│  I help women over 40 reclaim their energy and balance their   │
│  hormones through functional medicine principles...             │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│                    [BOOK CONSULTATION]                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- Verification badge (linked to credential)
- Specialties highlighted
- Booking link integration
- SEO optimized (Google finds them)

---

## Phase 4: AI Enhancement (Weeks 7-8)

### 4.1 Daily Action Push

**Musk:** "Kill the menu. One action per day. Sarah tells them what to do."

**Implementation:**

When user logs in, instead of showing dashboard navigation, show:

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  Good morning, Maria! ☀️                                        │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  TODAY'S FOCUS                                                   │
│                                                                  │
│  📚 Complete: Module 3, Lesson 4                                │
│     "Understanding the Gut-Brain Axis"                          │
│     ~15 minutes                                                  │
│                                                                  │
│                    [START LESSON →]                             │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  After this lesson:                                              │
│  • Quick quiz (5 questions)                                     │
│  • Check in with Sarah                                          │
│                                                                  │
│  ─────────────────────────────────────────────────────────────  │
│                                                                  │
│  Your progress: ████████████░░░░░░░░  62%                       │
│  Streak: 🔥 5 days                                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**This replaces** the complex dashboard for users who prefer guided learning.

**Optional:** Toggle between "Guided Mode" and "Self-Directed Mode"

---

### 4.2 Sarah's Memory (Visible)

**Altman:** "The student doesn't see that Sarah knows them."

**Solution:** Show Sarah's understanding of the student.

**In Sarah's chat or profile:**

```
┌─────────────────────────────────────────────────────────────────┐
│  SARAH'S NOTES ABOUT YOU                                        │
│                                                                  │
│  🎯 Your Goal: Start a gut health practice within 6 months     │
│  ⏰ Your Schedule: Evenings & weekends                          │
│  💪 Your Strength: Great at understanding concepts              │
│  🤔 Your Challenge: Staying consistent                          │
│  📍 Current Focus: Module 3 — Gut Health Foundations            │
│                                                                  │
│  Last check-in: 2 days ago                                      │
│  Mood: Motivated but busy with family                           │
│                                                                  │
│                    [UPDATE MY INFO]                             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**This shows:** Sarah is personalized, not generic.

---

## Phase 5: Authority (Ongoing)

### 5.1 Honest Trust Messaging

**What we CAN claim (if true):**

```
┌─────────────────────────────────────────────────────────────────┐
│               ACCREDIPRO STANDARDS INSTITUTE                    │
│                                                                  │
│  ✓ Professional Certification Body                              │
│  ✓ Verified Digital Credentials                                │
│  ✓ Personal AI Coach (available 24/7)                          │
│  ✓ Peer Accountability Pods                                     │
│  ✓ Global Practitioner Directory                               │
│  ✓ Supervised Practicum (Board level)                          │
│  ✓ Career & Practice Support                                   │
│                                                                  │
│  Dubai HQ • Delaware Registered • Global Community             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**What we CANNOT claim (yet):**
- NBHWC Approved
- ICF Aligned
- College credits
- BBB Rating (unless registered)
- X years of history (if new)
- X thousand alumni (if not true)

---

### 5.2 Future Authority Building

| Action | Timeline | Impact |
|--------|----------|--------|
| Register with BBB | Month 1 | Trust signal |
| Apply for CEU provider (NASM, ACE) | Month 2-3 | Credibility |
| Research NBHWC provider application | Month 3-6 | Major credibility |
| Collect 100+ Trustpilot reviews | Ongoing | Social proof |
| Advisory board with known names | Month 6+ | Authority |

---

## Implementation Timeline

### Week 1-2: Foundation
- [ ] Build Credential Path widget
- [ ] Implement milestone celebrations
- [ ] Update navigation naming
- [ ] Add credential ID to dashboard

### Week 3-4: Retention
- [ ] Build Sarah nudge system
- [ ] Create nudge cron job
- [ ] Build admin engagement dashboard
- [ ] Add lesson feedback (👍/👎)

### Week 5-6: Growth
- [ ] Build referral system
- [ ] Create referral tracking
- [ ] Build public practitioner profiles
- [ ] SEO optimize profile pages

### Week 7-8: AI Enhancement
- [ ] Build daily action push
- [ ] Create guided mode toggle
- [ ] Add Sarah's memory display
- [ ] Personalization improvements

### Ongoing: Authority
- [ ] Register BBB
- [ ] Apply for CEU status
- [ ] Collect reviews
- [ ] Research NBHWC pathway

---

## Success Metrics

| Metric | Current | Target (90 days) |
|--------|---------|------------------|
| Course completion rate | Unknown | 70%+ |
| 7-day retention | Unknown | 80%+ |
| Referral rate | 0% | 10%+ |
| NPS Score | Unknown | 50+ |
| Public profiles created | 0 | 100+ |
| Trustpilot reviews | Few | 50+ |

---

## Budget Estimate

| Item | Cost | Notes |
|------|------|-------|
| Development (internal) | $0 | Your team |
| BBB Registration | $500/year | One-time |
| Trustpilot Business | $200/month | Optional |
| CEU Applications | $200-500 each | Variable |
| Total Year 1 | ~$3,000-5,000 | Minimal |

---

## Board Sign-Off

**Zuckerberg:** "Referral system + public profiles = growth engine. Approved."

**Bezos:** "Engagement tracking + feedback loops = know your customer. Approved."

**Musk:** "Proactive Sarah + daily action = push not pull. Approved."

**Altman:** "AI personalization + Sarah's memory = unfair advantage. Approved."

---

## Next Steps

1. **CEO Decision:** Which phase to start first?
2. **Resource Allocation:** Who builds what?
3. **Timeline Commitment:** Realistic delivery dates?
4. **Success Review:** Check metrics in 30/60/90 days

---

*This plan is property of AccrediPro Standards Institute. Board approved January 2026.*

---

## Appendix: Component Specifications

### A. Credential Path Widget

**File:** `src/components/dashboard/credential-path.tsx`

```typescript
"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Circle, Lock, ArrowRight } from "lucide-react";
import Link from "next/link";

interface CredentialTier {
  tier: string;
  title: string;
  status: "completed" | "in_progress" | "locked";
  progress?: number;
  price?: string;
}

interface CredentialPathProps {
  credentials: CredentialTier[];
  specialty: string; // "FM", "WH", etc.
}

export function CredentialPath({ credentials, specialty }: CredentialPathProps) {
  return (
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 p-3">
        <h3 className="font-semibold text-white text-sm">
          Your {specialty} Certification Path
        </h3>
      </div>
      <CardContent className="p-4 space-y-3">
        {credentials.map((cred, index) => (
          <div key={cred.tier} className="relative">
            {/* Connector line */}
            {index < credentials.length - 1 && (
              <div className="absolute left-4 top-10 w-0.5 h-6 bg-gray-200" />
            )}

            <div className={`flex items-center gap-3 p-3 rounded-lg ${
              cred.status === "completed" ? "bg-green-50" :
              cred.status === "in_progress" ? "bg-burgundy-50 ring-1 ring-burgundy-200" :
              "bg-gray-50 opacity-60"
            }`}>
              {/* Status icon */}
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                cred.status === "completed" ? "bg-green-500 text-white" :
                cred.status === "in_progress" ? "bg-burgundy-500 text-white" :
                "bg-gray-300 text-gray-500"
              }`}>
                {cred.status === "completed" ? <CheckCircle className="w-5 h-5" /> :
                 cred.status === "in_progress" ? <Circle className="w-5 h-5" /> :
                 <Lock className="w-4 h-4" />}
              </div>

              {/* Info */}
              <div className="flex-1">
                <p className="font-semibold text-sm text-gray-900">{cred.tier}</p>
                <p className="text-xs text-gray-500">{cred.title}</p>
                {cred.status === "in_progress" && cred.progress && (
                  <div className="mt-1">
                    <div className="w-full h-1.5 bg-gray-200 rounded-full">
                      <div
                        className="h-full bg-burgundy-500 rounded-full"
                        style={{ width: `${cred.progress}%` }}
                      />
                    </div>
                    <p className="text-xs text-burgundy-600 mt-0.5">{cred.progress}% complete</p>
                  </div>
                )}
              </div>

              {/* Action */}
              {cred.status === "in_progress" && (
                <Link href="/my-learning">
                  <Button size="sm" className="bg-burgundy-600 hover:bg-burgundy-700">
                    Continue
                  </Button>
                </Link>
              )}
              {cred.status === "locked" && cred.price && (
                <Badge variant="outline" className="text-xs">
                  {cred.price}
                </Badge>
              )}
            </div>
          </div>
        ))}

        <Link href="/my-personal-roadmap-by-coach-sarah">
          <Button variant="outline" className="w-full mt-2">
            View Full Path <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
```

### B. Milestone Toast Component

**File:** `src/components/ui/milestone-toast.tsx`

```typescript
"use client";

import { useEffect, useState } from "react";
import confetti from "canvas-confetti";

interface MilestoneToastProps {
  message: string;
  badge?: string;
  onClose: () => void;
}

export function MilestoneToast({ message, badge, onClose }: MilestoneToastProps) {
  useEffect(() => {
    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Auto-close after 5 seconds
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-gold-400 to-gold-500 text-burgundy-900 p-4 rounded-xl shadow-2xl max-w-sm">
        <div className="flex items-start gap-3">
          <div className="text-3xl">🎉</div>
          <div>
            <p className="font-bold">Milestone Reached!</p>
            <p className="text-sm mt-1">{message}</p>
            {badge && (
              <p className="text-xs mt-2 opacity-75">
                +1 Badge Earned: {badge}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
```

### C. Sarah Nudge API

**File:** `src/app/api/cron/sarah-nudges/route.ts`

```typescript
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { NUDGE_RULES } from "@/lib/sarah-nudges";

export async function GET(request: Request) {
  // Verify cron secret (security)
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get Coach Sarah's ID
  const sarah = await prisma.user.findFirst({
    where: { email: "sarah@accredipro-certificate.com" },
  });

  if (!sarah) {
    return NextResponse.json({ error: "Sarah not found" }, { status: 500 });
  }

  // Get all active students
  const students = await prisma.user.findMany({
    where: {
      role: "STUDENT",
      isActive: true,
    },
    include: {
      enrollments: {
        include: {
          course: true,
        },
      },
      lessonProgress: {
        orderBy: { updatedAt: "desc" },
        take: 1,
      },
    },
  });

  const now = new Date();
  const nudgesSent = [];

  for (const student of students) {
    // Calculate days since last login
    const daysSinceLogin = student.lastLoginAt
      ? Math.floor((now.getTime() - student.lastLoginAt.getTime()) / (1000 * 60 * 60 * 24))
      : 999;

    // Check each nudge rule
    for (const rule of NUDGE_RULES) {
      if (rule.condition === "no_login" && daysSinceLogin >= rule.daysThreshold) {
        // Check if we already sent this nudge recently
        const recentNudge = await prisma.message.findFirst({
          where: {
            senderId: sarah.id,
            receiverId: student.id,
            content: { contains: rule.id },
            createdAt: { gte: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) }, // 3 days
          },
        });

        if (!recentNudge) {
          // Send nudge
          const message = rule.message
            .replace("{{firstName}}", student.firstName || "there")
            .replace("{{courseName}}", student.enrollments[0]?.course.title || "your course");

          await prisma.message.create({
            data: {
              senderId: sarah.id,
              receiverId: student.id,
              content: `${message}\n\n<!-- nudge:${rule.id} -->`,
            },
          });

          nudgesSent.push({ student: student.email, rule: rule.id });
          break; // Only one nudge per student per run
        }
      }
    }
  }

  return NextResponse.json({
    success: true,
    nudgesSent: nudgesSent.length,
    details: nudgesSent,
  });
}
```

---

*End of Document*
