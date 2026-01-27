# Mini Diploma CRO System - Master Plan

> **Created:** January 26, 2026
> **Status:** Planning
> **Goal:** Increase completion rate from 58% to 80%+ and purchase conversion from 2.6% to 15%+

---

## Table of Contents

1. [Current State Analysis](#1-current-state-analysis)
2. [Two Systems Overview](#2-two-systems-overview)
3. [System 1: Mini Diploma Portal Improvements](#3-system-1-mini-diploma-portal-improvements)
4. [System 2: Live VSL Scholarship Page](#4-system-2-live-vsl-scholarship-page)
5. [Technical Implementation](#5-technical-implementation)
6. [Database Models](#6-database-models)
7. [Zombie Profiles System](#7-zombie-profiles-system)
8. [Sarah AI Chat](#8-sarah-ai-chat)
9. [SMS/GHL Integration](#9-smsghl-integration)
10. [Implementation Timeline](#10-implementation-timeline)
11. [Success Metrics](#11-success-metrics)

---

## 1. Current State Analysis

### Current Funnel Performance

```
102 signups → 65 started (64%) → 38 completed (58%) → 1 purchase (2.6%)
```

| Stage | Current | Target | Gap |
|-------|---------|--------|-----|
| Signup → Start | 64% | 80% | -16% |
| Start → Complete | 58% | 80% | -22% |
| Complete → Purchase | 2.6% | 15% | -12.4% |

### Current Problems Identified

1. **No motivation to complete** - Users don't see graduates succeeding
2. **Student Lounge is useless** - Doesn't drive completion or conversion
3. **Sarah chat leaves mini diploma** - Breaks the experience
4. **Exam results page is weak** - Goes straight to cold checkout
5. **No VSL before purchase** - Missing the 45-min conversion engine
6. **No social proof during journey** - No "X people just enrolled"
7. **No urgency mechanics** - Countdown exists but not compelling

---

## 2. Two Systems Overview

### System 1: Mini Diploma Portal (No VSL)
For users going through the 9 lessons before exam.

**Changes:**
- Add "Graduates" channel (visible from Day 1, read-only until completion)
- Replace "Student Lounge" with "Ask Sarah" chat in lesson sidebar
- Fix Sarah chat to stay in mini diploma context
- Add completion motivation triggers
- Smart Sarah nudges based on behavior

### System 2: Live VSL Scholarship Page (After Exam)
For users who passed the exam and qualified for scholarship.

**Changes:**
- New "Unlock Scholarship" flow instead of direct checkout
- Live webinar-style page with 45-min VSL
- Fake live chat with zombie profiles
- Real-time "enrollment" notifications
- Spots decreasing mechanism
- Sarah AI responding to real questions
- Embedded checkout (ClickFunnels + Fanbasis)

---

## 3. System 1: Mini Diploma Portal Improvements

### 3.1 Graduates Channel (FOMO Engine)

**Purpose:** Show users what success looks like from Day 1

**Location:** Sidebar, visible throughout the journey

**Rules:**
- READ-ONLY until user completes mini diploma
- Shows real graduate posts + zombie profiles
- Locked icon with "Complete to unlock posting"

**Content Types:**
```
- "Just got my certificate!" (with certificate image)
- "First client booked! $200 consultation"
- "Quit my nursing job today - going full time!"
- "Hit $5K this month!"
```

**Implementation:**
```
/functional-medicine-diploma
├── Sidebar
│   ├── My Progress
│   ├── Continue Learning
│   ├── 🎓 Graduates (read-only) ← NEW
│   │   └── "Complete to unlock posting"
│   └── 💬 Ask Sarah ← MOVED from main nav
```

### 3.2 Lesson Sidebar Restructure

**Current:**
```
- My Progress
- Start Lessons
- Student Lounge ← REMOVE
- Get Help from Sarah
```

**New:**
```
- My Progress
- Continue Learning
- 🎓 Graduates Channel (preview, read-only)
- 💬 Ask Sarah (inline chat)
```

### 3.3 Sarah Chat Fix

**Problem:** Clicking "Get Help from Sarah" navigates to main portal, user gets lost.

**Solution:** Open Sarah chat as:
- Inline panel in sidebar, OR
- Modal overlay, OR
- Slide-out drawer

**Key:** User NEVER leaves the mini diploma context.

### 3.4 Smart Sarah Nudges

| Trigger | Timing | Sarah Says |
|---------|--------|------------|
| Stuck on lesson 3+ days | After 72h | "Hey! I noticed you paused. The gut lesson is actually my favorite - want a quick summary?" |
| Completed 5 lessons | Immediately | "HALFWAY! Did you know 89% of women who reach this point finish? You're on track!" |
| Inactive 24h | After 24h | "Missing you! Lesson [X] is only 7 min. Your certificate is waiting!" |
| Completed all 9 | Immediately | "YOU DID IT! Ready for your exam? I'll be here cheering you on!" |
| Passed exam | Immediately | "95%! I KNEW you could do it! Your scholarship is unlocked..." |
| Viewed checkout, didn't buy | After 1h | "I saw you checking out the certification. Any questions? No pressure!" |

### 3.5 Completion Motivation Elements

**Progress Bar Enhancement:**
```
┌─────────────────────────────────────────┐
│ Your Progress: 5/9 lessons              │
│ ████████████░░░░░░░░ 56%               │
│                                         │
│ 🎓 34 women completed today             │
│ ⏰ Access expires in 1d 23h             │
└─────────────────────────────────────────┘
```

**Milestone Celebrations:**
- Lesson 3: "1/3 done! You're learning faster than 70% of students!"
- Lesson 5: "HALFWAY! Certificate is getting closer!"
- Lesson 7: "Almost there! Just 2 more lessons!"
- Lesson 9: "FINAL LESSON! Your certificate awaits!"

---

## 4. System 2: Live VSL Scholarship Page

### 4.1 Flow Overview

```
EXAM PASS (95%+)
     ↓
RESULTS PAGE
├── Score celebration (95%!)
├── "You've unlocked the ASI Graduate Scholarship"
└── [ 🎁 Reveal My Scholarship → ]
     ↓
LIVE VSL PAGE (ClickFunnels or AccrediPro)
├── 🔴 LIVE badge + "47 graduates watching"
├── 45-min training video
├── Live chat (zombies + real users)
├── Sarah AI responding
├── Enrollment notifications ("🎉 Lisa just enrolled!")
├── Spots decreasing (3 → 2 → 1 → "emergency spot!")
├── Sticky countdown timer
├── Value stack summary
├── FAQ accordion
└── EMBEDDED CHECKOUT (Fanbasis)
```

### 4.2 Live Chat System

**Timeline-Based Zombie Messages:**

| Video Time | Type | Message |
|------------|------|---------|
| 0:00 | system | "🔴 Live training starting now..." |
| 0:30 | zombie | "Hi everyone! Maria from Texas, just passed my exam!" |
| 0:45 | zombie | "Jennifer here, nervous but excited!" |
| 1:00 | sarah | "Welcome everyone! So excited to see you all here!" |
| 5:00 | zombie | "This is exactly what I needed to hear" |
| 5:30 | enrollment | "🎉 Amanda J. just enrolled! (California)" |
| 5:35 | alert | "2 scholarship spots remaining" |
| 12:00 | zombie | "Wait, $12,500 first month??" |
| 12:15 | sarah | "Yes! Jenny was a burned out nurse just like many of you" |
| 20:00 | zombie | "Do we really get all those templates?" |
| 20:10 | sarah | "Every single one. Ready to use Day 1" |
| 20:30 | enrollment | "🎉 Patricia K. just enrolled! (Ohio)" |
| 20:35 | alert | "⚠️ Only 1 scholarship spot remaining!" |
| 30:00 | zombie | "I'm worried I'm not smart enough" |
| 30:10 | sarah | "You passed the exam! You ARE smart enough" |
| 40:00 | zombie | "$997?? I thought it would be way more" |
| 40:10 | sarah | "For graduates who qualify, it's actually $297" |
| 40:30 | enrollment | "🎉 Michelle R. just enrolled!" |
| 40:35 | alert | "Last spot claimed! Checking for additional spots..." |
| 40:40 | alert | "✅ 1 emergency spot released for today only!" |
| 45:00 | sarah | "Alright everyone, the checkout is now open below" |
| 45:15 | zombie | "I'm doing it!" |
| 45:30 | enrollment | "🎉 Jennifer K. just enrolled!" |

### 4.3 Real User Integration

Real users can type in chat. Their messages:
1. Appear alongside zombie messages
2. Get responses from Sarah AI (Claude)
3. Create authentic feel

**Sarah AI Prompt:**
```
You are Sarah, a warm, encouraging functional medicine coach.
You're hosting a live training for women who just passed their exam.
Keep responses short (1-2 sentences) for chat format.
Be personal, use their name if provided.
Address objections positively.
Never reveal you're AI.
```

### 4.4 Spots Mechanism

```javascript
const spotEvents = [
  { videoTime: 330, spots: 2, name: "Amanda J.", location: "California" },
  { videoTime: 1230, spots: 1, name: "Patricia K.", location: "Ohio" },
  { videoTime: 2430, spots: 0, name: "Michelle R.", location: "New York" },
  { videoTime: 2440, spots: 1, message: "1 emergency spot released!" },
];
```

**Psychology:**
- Start with 3 spots
- Decrease during high-impact moments in video
- Hit 0 at climax, then "release emergency spot"
- Creates urgency without being completely fake

### 4.5 Viewer Counter

```javascript
const displayViewers = baseCount + realViewers + randomFluctuation;
// baseCount: 35-45
// realViewers: actual WebSocket connections
// randomFluctuation: -5 to +5

// Shows: "47 graduates watching"
```

### 4.6 Page Structure

```
┌─────────────────────────────────────────────────────────────┐
│ HEADER                                                      │
│ 🔴 LIVE Graduate Training │ 47 watching │ ⏰ 23:45:12      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────────────┐ ┌───────────────────────┐ │
│  │                             │ │ 💬 LIVE CHAT          │ │
│  │      VIDEO PLAYER           │ │                       │ │
│  │      (45 min training)      │ │ [Chat messages here]  │ │
│  │                             │ │                       │ │
│  └─────────────────────────────┘ │ [Type message...]     │ │
│                                  └───────────────────────┘ │
│  YOUR SCHOLARSHIP (locked until video progress)            │
│  ┌───────────────────────────────────────────────────────┐ │
│  │ 🔒 Checkout unlocks at end of training                │ │
│  │ $24,655 → $297  │  2 spots left                       │ │
│  └───────────────────────────────────────────────────────┘ │
│                                                             │
├───────────────────── AFTER VIDEO ───────────────────────────┤
│                                                             │
│  ✅ CHECKOUT NOW UNLOCKED                                   │
│                                                             │
│  VALUE STACK                                                │
│  ├── 20 Modules, 156 Lessons                               │
│  ├── 21 Certificates                                       │
│  ├── 9 International Accreditations                        │
│  ├── Sarah's Personal Mentorship                           │
│  └── $100K Business Accelerator                            │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         EMBEDDED FANBASIS CHECKOUT                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  FAQ ACCORDION                                              │
│  ├── "I'm not a doctor. Can I really do this?"            │
│  ├── "What if I'm not smart enough?"                      │
│  ├── "What if I don't have time?"                         │
│  └── "What if it doesn't work?"                           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ STICKY FOOTER                                               │
│ ⏰ 23:45:12 │ $297 (was $24,655) │ 2 spots │ [ENROLL →]   │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Technical Implementation

### 5.1 New Routes/Pages

```
/functional-medicine-diploma/
├── (existing pages)
├── scholarship/              ← NEW: VSL page
│   ├── page.tsx             # Server component
│   └── scholarship-client.tsx # Client with video + chat
└── graduates/               ← NEW: Graduates channel
    └── page.tsx
```

### 5.2 New Components

```
/src/components/
├── mini-diploma/
│   ├── graduates-channel.tsx      # Read-only graduates feed
│   ├── graduates-post.tsx         # Individual post component
│   ├── sarah-inline-chat.tsx      # Sidebar chat widget
│   └── completion-motivator.tsx   # Progress + social proof
│
├── live-vsl/
│   ├── live-training-page.tsx     # Main VSL page
│   ├── live-video-player.tsx      # Video with progress tracking
│   ├── live-chat.tsx              # Chat with zombies + real
│   ├── live-chat-message.tsx      # Individual message
│   ├── enrollment-notification.tsx # "🎉 X just enrolled!"
│   ├── spots-counter.tsx          # "2 spots remaining"
│   ├── viewer-counter.tsx         # "47 watching"
│   ├── sticky-cta.tsx             # Bottom sticky bar
│   └── checkout-reveal.tsx        # Animated checkout unlock
│
└── zombies/
    ├── zombie-message-scheduler.tsx # Times messages to video
    └── zombie-profiles.ts          # Profile data
```

### 5.3 New API Routes

```
/src/app/api/
├── live-training/
│   ├── join/route.ts              # WebSocket-like join
│   ├── message/route.ts           # Post real user message
│   ├── viewers/route.ts           # Get viewer count
│   └── sarah-response/route.ts    # AI response to question
│
├── graduates/
│   ├── feed/route.ts              # Get graduates posts
│   └── post/route.ts              # Create post (after completion)
│
└── mini-diploma/
    └── smart-nudge/route.ts       # Trigger Sarah nudge
```

### 5.4 New Cron Jobs

```
/src/app/api/cron/
├── graduate-posts/route.ts        # Auto-post zombie graduate messages
├── smart-sarah-nudges/route.ts    # Check for nudge triggers
└── live-session-cleanup/route.ts  # Clean old live sessions
```

---

## 6. Database Models

### 6.1 Live Training Session

```prisma
model LiveTrainingSession {
  id            String   @id @default(cuid())

  // Viewer tracking
  visitorId     String   // Anonymous or userId
  userId        String?  // If logged in

  // Session data
  joinedAt      DateTime @default(now())
  leftAt        DateTime?
  videoProgress Int      @default(0) // Seconds watched
  maxProgress   Int      @default(0) // Furthest point reached

  // Conversion tracking
  checkoutViewed Boolean @default(false)
  enrolled       Boolean @default(false)
  enrolledAt     DateTime?

  // Chat participation
  messagesSent   Int     @default(0)

  @@index([userId])
  @@index([joinedAt])
}
```

### 6.2 Live Chat Messages (Zombies)

```prisma
model LiveChatZombieMessage {
  id        String   @id @default(cuid())

  // Timing
  videoTime Int      // Seconds into video

  // Message type
  type      String   // "chat" | "enrollment" | "sarah" | "alert"

  // Profile (for chat type)
  name      String?  // "Maria T."
  location  String?  // "Texas"
  avatar    String?  // Photo URL

  // Content
  message   String

  // Status
  isActive  Boolean  @default(true)

  @@index([videoTime])
}
```

### 6.3 Live Chat Messages (Real Users)

```prisma
model LiveChatUserMessage {
  id        String   @id @default(cuid())
  sessionId String   // LiveTrainingSession.id
  userId    String?

  // Message
  name      String
  message   String

  // Response
  sarahResponse String?
  respondedAt   DateTime?

  createdAt DateTime @default(now())

  @@index([sessionId])
}
```

### 6.4 Graduate Posts

```prisma
model GraduatePost {
  id        String   @id @default(cuid())

  // Author
  userId    String?  // null = zombie
  isZombie  Boolean  @default(false)

  // Profile (for zombies)
  zombieName     String?
  zombieAvatar   String?
  zombieLocation String?

  // Content
  type      String   // "certificate" | "first_client" | "milestone" | "win"
  content   String
  imageUrl  String?  // Certificate image, etc.

  // Engagement
  likes     Int      @default(0)

  // Display
  isActive  Boolean  @default(true)
  isPinned  Boolean  @default(false)

  createdAt DateTime @default(now())

  @@index([createdAt])
  @@index([isActive])
}
```

### 6.5 Smart Nudge Tracking

```prisma
model SmartNudge {
  id        String   @id @default(cuid())
  userId    String

  // Nudge details
  trigger   String   // "inactive_24h" | "stuck_lesson" | "halfway" etc.
  channel   String   // "dm" | "email" | "push"
  message   String

  // Tracking
  sentAt    DateTime @default(now())
  openedAt  DateTime?
  clickedAt DateTime?

  @@index([userId])
  @@index([trigger])
}
```

---

## 7. Zombie Profiles System

### 7.1 Profile Data Structure

```typescript
// /src/lib/zombies/profiles.ts

export interface ZombieProfile {
  id: string;
  firstName: string;
  lastName: string;
  location: string;
  avatar: string;
  background: string; // "nurse" | "mom" | "corporate" | "teacher"
  incomeLevel?: string; // "$4.2K/mo" | "$8.5K/mo"
}

export const ZOMBIE_PROFILES: ZombieProfile[] = [
  {
    id: "maria_t",
    firstName: "Maria",
    lastName: "T.",
    location: "Texas",
    avatar: "/zombies/maria.jpg",
    background: "nurse",
    incomeLevel: "$6.2K/mo"
  },
  {
    id: "jennifer_k",
    firstName: "Jennifer",
    lastName: "K.",
    location: "Florida",
    avatar: "/zombies/jennifer.jpg",
    background: "mom",
    incomeLevel: "$4.8K/mo"
  },
  // ... 20+ profiles
];
```

### 7.2 Graduate Post Templates

```typescript
// /src/lib/zombies/post-templates.ts

export const GRADUATE_POST_TEMPLATES = {
  certificate: [
    "Just got my certificate! Feeling so proud right now!",
    "It's official! ASI Foundation Certified!",
    "Can't believe I actually did it! Certificate in hand!",
  ],
  first_client: [
    "FIRST CLIENT BOOKED! $200 consultation tomorrow!",
    "She found me through the ASI directory. First paying client!",
    "I'm shaking - just got my first $150 consultation booking!",
  ],
  milestone: [
    "Hit $5K this month! Never thought this was possible.",
    "Quit my nursing job today. Going full time with my practice!",
    "3 months certified, 12 clients, $8K revenue. This is real.",
  ],
  win: [
    "Client just texted - her energy is back after 3 years. THIS is why I do this.",
    "Best feeling ever - helping someone who'd been dismissed by doctors.",
    "My client's husband noticed the change. She cried happy tears.",
  ],
};
```

### 7.3 Live Chat Message Templates

```typescript
// /src/lib/zombies/chat-templates.ts

export interface ZombieChatMessage {
  videoTime: number; // Seconds
  type: "chat" | "enrollment" | "sarah" | "alert";
  profileId?: string; // Reference to ZOMBIE_PROFILES
  message: string;
}

export const LIVE_CHAT_SCRIPT: ZombieChatMessage[] = [
  // Pre-training
  { videoTime: 0, type: "sarah", message: "Welcome everyone! We're about to start..." },
  { videoTime: 30, type: "chat", profileId: "maria_t", message: "Hi! Maria from Texas, just passed my exam!" },
  { videoTime: 45, type: "chat", profileId: "jennifer_k", message: "Jennifer here, nervous but excited!" },

  // During training (synced to content)
  { videoTime: 300, type: "chat", profileId: "maria_t", message: "This is exactly what I needed to hear" },
  { videoTime: 330, type: "enrollment", profileId: "amanda_j", message: "🎉 Amanda J. just enrolled! (California)" },
  { videoTime: 335, type: "alert", message: "2 scholarship spots remaining" },

  // ... full script continues
];
```

---

## 8. Sarah AI Chat

### 8.1 Real-Time Response System

```typescript
// /src/lib/sarah-ai-chat.ts

import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

const SARAH_SYSTEM_PROMPT = `You are Sarah, a warm, encouraging functional medicine coach.
You're hosting a live training for women who just passed their mini diploma exam.

RULES:
- Keep responses SHORT (1-2 sentences max) - this is live chat, not email
- Be personal - use their name if they provide it
- Be encouraging but not fake
- Address objections positively
- Never reveal you're AI
- If they ask about price, confirm $297 with scholarship
- If they're hesitant, empathize then encourage

CONTEXT:
- They just scored 95%+ on their exam
- They're watching a 45-min training about the certification
- The certification is $297 (normally $997)
- Includes 20 modules, 21 certificates, mentorship, business accelerator
- 30-day money back guarantee

TONE: Warm, sisterly, confident, supportive`;

export async function getSarahResponse(
  userMessage: string,
  userName?: string
): Promise<string> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 150,
    system: SARAH_SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: userName
          ? `User "${userName}" says: ${userMessage}`
          : userMessage
      }
    ]
  });

  return response.content[0].type === "text"
    ? response.content[0].text
    : "";
}
```

### 8.2 Common Question Responses (Pre-Written Fallbacks)

```typescript
// /src/lib/sarah-ai-chat.ts

export const SARAH_QUICK_RESPONSES: Record<string, string> = {
  "part time": "Absolutely! Most graduates start part-time, 5-7 hours/week.",
  "not smart": "You passed the exam! That proves you're smart enough.",
  "no time": "The average student finishes in 12-16 weeks, about 1 hour/day.",
  "money back": "Yes! 30-day no questions asked guarantee.",
  "legitimate": "We're accredited by 9 international bodies. Fully verifiable!",
  "how long": "Most complete certification in 12-16 weeks at their own pace.",
  "get clients": "ASI Directory + your pod referrals. 73% say demand exceeds capacity!",
};

export function getQuickResponse(message: string): string | null {
  const lowerMessage = message.toLowerCase();

  for (const [trigger, response] of Object.entries(SARAH_QUICK_RESPONSES)) {
    if (lowerMessage.includes(trigger)) {
      return response;
    }
  }

  return null; // Use AI for complex questions
}
```

---

## 9. SMS/GHL Integration

### 9.1 Current GHL Webhooks

Already configured:
- Lead signup → GHL → SMS welcome sequence
- Mini diploma completion → GHL → SMS follow-up

### 9.2 Additional SMS Touchpoints Needed

| Trigger | Timing | Message |
|---------|--------|---------|
| Signup | Immediate | "Welcome {{firstName}}! Your Mini Diploma is ready. Start Lesson 1 (7 min): [link]" |
| No start 1h | Hour 1 | "Hey {{firstName}}! Lesson 1 takes 7 min - perfect for a coffee break! [link]" |
| No start 6h | Hour 6 | "{{firstName}}, 42h left! Start now: [link]" |
| No start 18h | Hour 18 | "Evening check-in! 30h remaining. [link]" |
| No start 24h | Hour 24 | "24h LEFT! Don't miss your certificate. [link]" |
| Completed | Immediate | "YOU DID IT! Certificate ready. Take your exam: [link]" |
| Passed exam | Immediate | "95%! Your $297 scholarship is unlocked: [link]" |
| No purchase 24h | Day 1 after exam | "Scholarship expires in 12h! Claim: [link]" |
| No purchase 48h | Day 2 after exam | "Grace offer: $497 for 48h more: [link]" |

### 9.3 GHL Workflow Configuration

```
Workflow: Mini Diploma Nurture

Trigger: Webhook (lead signup)
├── Wait 1 hour
├── IF no lesson started → Send SMS "Hour 1 reminder"
├── Wait 5 hours
├── IF no lesson started → Send SMS "Hour 6 reminder"
├── Wait 12 hours
├── IF no lesson started → Send SMS "Hour 18 reminder"
├── Wait 6 hours
├── IF no lesson started → Send SMS "Hour 24 - URGENT"
└── END

Trigger: Webhook (exam passed)
├── Send SMS "Congrats! Scholarship unlocked"
├── Wait 24 hours
├── IF no purchase → Send SMS "12h left on scholarship"
├── Wait 12 hours
├── IF no purchase → Send SMS "Scholarship expired - grace offer"
└── END
```

---

## 10. Implementation Timeline

### Phase 1: Portal Improvements (Week 1)
- [ ] Create Graduates channel component
- [ ] Add Graduates to lesson sidebar (read-only)
- [ ] Replace Student Lounge with Ask Sarah
- [ ] Fix Sarah chat to stay in context
- [ ] Add zombie graduate posts (10 initial)
- [ ] Add completion motivators to progress bar

### Phase 2: Smart Nudges (Week 1-2)
- [ ] Create SmartNudge database model
- [ ] Build nudge trigger cron job
- [ ] Implement 6 nudge scenarios
- [ ] Connect to Sarah DM system

### Phase 3: Live VSL Page - Core (Week 2)
- [ ] Create scholarship page route
- [ ] Build video player with progress tracking
- [ ] Build live chat component
- [ ] Create zombie message scheduler
- [ ] Add 50+ zombie chat messages

### Phase 4: Live VSL Page - Advanced (Week 2-3)
- [ ] Build enrollment notification system
- [ ] Build spots counter with events
- [ ] Build viewer counter
- [ ] Implement Sarah AI responses
- [ ] Build sticky CTA footer
- [ ] Build checkout reveal animation

### Phase 5: ClickFunnels Integration (Week 3)
- [ ] Create ClickFunnels page structure
- [ ] Embed Fanbasis checkout
- [ ] Pass user data (name, email, score, coupon)
- [ ] Configure countdown from coupon expiration
- [ ] Test full flow

### Phase 6: GHL SMS Enhancement (Week 3)
- [ ] Add new webhook triggers
- [ ] Configure 10 SMS touchpoints
- [ ] Test delivery and timing

### Phase 7: Testing & Launch (Week 4)
- [ ] Full funnel testing
- [ ] A/B test zombie message timing
- [ ] Monitor conversion rates
- [ ] Iterate based on data

---

## 11. Success Metrics

### Primary KPIs

| Metric | Current | Target | Measurement |
|--------|---------|--------|-------------|
| Signup → Start | 64% | 80% | `started / signups` |
| Start → Complete | 58% | 80% | `completed / started` |
| Complete → Purchase | 2.6% | 15% | `purchases / completed` |
| Overall Conversion | 0.98% | 9.6% | `purchases / signups` |

### Secondary KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| VSL watch time | >30 min avg | Video progress tracking |
| Chat engagement | 20% send message | Message count / viewers |
| Checkout views | 60% of VSL watchers | Checkout reveal triggers |
| Time to purchase | <2 hours after VSL | Timestamp comparison |

### Revenue Impact

**Current:**
- 102 signups × 0.98% conversion × $297 = $297 revenue

**Target:**
- 102 signups × 9.6% conversion × $297 = $2,911 revenue
- **10x improvement**

At scale (1000 signups/month):
- Current: $2,911/month
- Target: $28,512/month

---

## File Structure Summary

```
docs/mini-diploma-cro-system/
├── MASTER_PLAN.md                 # This file ✅
├── ZOMBIE_PROFILES.md             # All zombie profile data ✅
├── ZOMBIE_CHAT_SCRIPT.md          # Full 45-min chat script (100+ messages) ✅
├── GRADUATE_POST_TEMPLATES.md     # Graduate channel post templates ✅
├── SARAH_AI_PROMPTS.md            # AI prompts for Sarah chat responses ✅
├── GHL_WORKFLOWS.md               # SMS workflow configurations ✅
├── CLICKFUNNELS_SPEC.md           # ClickFunnels page requirements ✅
└── IMPLEMENTATION_CHECKLIST.md    # Dev task tracking ✅
```

**Documentation Status: COMPLETE**

---

## What's In Each Doc

| Document | Contents |
|----------|----------|
| **ZOMBIE_PROFILES.md** | 20 live chat profiles + 15 graduate profiles, with names, locations, backgrounds, personality tiers |
| **ZOMBIE_CHAT_SCRIPT.md** | Full 45-minute timed script with 100+ messages synced to video timestamps, all message types (CHAT, SARAH, ENROLL, ALERT) |
| **GRADUATE_POST_TEMPLATES.md** | Ready-to-use posts for graduates channel: Just Certified, First Client, Income Milestones, Transformation Stories, Tips & Encouragement |
| **SARAH_AI_PROMPTS.md** | Complete Claude system prompts for Live VSL context and Mini Diploma Portal context, response templates, edge case handling |
| **GHL_WORKFLOWS.md** | 7 SMS workflows (Welcome, Engagement, Completion, Urgency, Post-Purchase, Recovery, Re-engagement), webhook payloads, compliance notes |
| **CLICKFUNNELS_SPEC.md** | Full page structure, custom JS for zombie chat/video sync/spots counter, Fanbasis embed code, mobile responsiveness, tracking pixels |
| **IMPLEMENTATION_CHECKLIST.md** | 4-week phased implementation plan with checkboxes, Prisma models, API endpoints, testing checklist, success metrics |

---

## Next Steps

1. **Confirm VSL video** - Is the 45-min training recorded as video?
2. **Confirm Fanbasis embed** - Can checkout be embedded in iframe?
3. **Acquire zombie photos** - Need AI-generated or stock photos for 35 profiles
4. **Start Phase 1** - Database models + Portal improvements
5. **Review plan** - Approve before implementation begins
