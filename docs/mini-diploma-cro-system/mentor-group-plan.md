# Mentor Group System - Implementation Plan

## Overview

Replace the current Sarah-only sidebar chat with a dynamic **Mentor Group** that combines:
- Sarah (AI mentor/coach)
- 3 Senior Graduate Mentors (zombie profiles)
- Real student interactions
- Income Calculator progression

**Goal:** Increase CRO by creating community feel, social proof, and engagement throughout the mini diploma journey.

---

## 1. The 3 Senior Graduate Mentors

### Mentor 1: Gina T. (California)
- **Role:** Leader / Cheerleader
- **Personality:** Enthusiastic, encouraging, celebrates every win
- **Income:** $8.4K/mo
- **Background:** Former yoga instructor, now full-time FM practitioner
- **Avatar:** R2 hosted image

**Sample Messages:**
- Welcome: "Hey [name]! So excited you're here! I remember being exactly where you are. Trust me - this changes everything!"
- Lesson 3 complete: "Look at you go! Lesson 3 done - you're getting into the good stuff now!"
- Milestone: "I just hit $8K this month... a year ago I was making $3K at my old job. This is REAL."

### Mentor 2: Amber L. (Texas)
- **Role:** Advisor / Practical Helper
- **Personality:** Supportive, gives actionable advice, answers questions
- **Income:** $6.2K/mo
- **Background:** Former nurse, works part-time from home
- **Avatar:** R2 hosted image

**Sample Messages:**
- Welcome: "Welcome to the family! I'm Amber - been certified for 8 months now. Ask me anything!"
- Q&A response: "Great question! When I started, I focused on just ONE niche. Made all the difference."
- Encouragement: "Don't rush through the lessons - take notes! Module 7 on labs literally changed how I work with clients."

### Mentor 3: Denise P. (Colorado)
- **Role:** Success Proof / Results-Focused
- **Personality:** Shares numbers, timeline proof, ROI focused
- **Income:** $10.2K/mo (highest)
- **Background:** Former stay-at-home mom, now full practice
- **Avatar:** R2 hosted image

**Sample Messages:**
- Welcome: "Hey! I'm Denise. Got certified Day 14, first client Day 25. Now I'm at $10K/mo. You've got this!"
- Income update: "Just had my best week ever - 6 clients, $1,850. Still can't believe this is my life now."
- Milestone: "When I finished Lesson 9, I was SO nervous about the exam. Passed with 98%. The lessons prepare you perfectly."

---

## 2. Message Trigger System

### 2.1 Welcome Messages (Student Joins)
When a new student starts the mini diploma:

```
[60s delay] Sarah: "Welcome to your Functional Medicine journey, {name}! I'm Sarah, your mentor."
[90s delay] Gina T.: "Hey {name}! So excited you're here! This is going to change everything!"
[120s delay] Amber L.: "Welcome! I'm Amber, been certified 8 months. Ask us anything!"
[150s delay] Denise P.: "Welcome to the group! I was just like you 6 months ago. Now I'm at $10K/mo. Let's do this!"
```

### 2.2 Lesson Completion Milestones

| Lesson | Sarah | Gina | Amber | Denise |
|--------|-------|------|-------|--------|
| 1 | "Great start! Root cause thinking is the foundation." | "Lesson 1 done! You're already ahead of 80% of people!" | - | - |
| 3 | "You're diving deep now!" | "Look at you crushing it!" | "The gut health module coming up next is SO good!" | - |
| 5 | "Halfway there! You're doing amazing." | - | "I take so many notes on this section!" | "Halfway = you're serious. I knew at this point too." |
| 7 | "Almost there! The business content is next." | - | - | "This is where it gets exciting - client acquisition time!" |
| 9 | "You did it! Time for your exam." | "OMG you finished! SO proud of you!" | "You're ready. Trust what you learned." | "Exam day! I scored 98% - you've got this!" |

### 2.3 Q&A Response Triggers

When student asks common questions, zombies respond:

**"How long does certification take?"**
- Denise: "I did mine in 14 days going fast. But Amber took 3 weeks working around her schedule. Go your pace!"

**"Can I do this part-time?"**
- Amber: "I work part-time from home around my kids' schedule. 15-20 hours/week. Totally doable!"

**"How do I get clients?"**
- Gina: "Module 8 covers this! But honestly, I got my first 5 from just telling friends and family."

**"Is this legitimate/worth it?"**
- Denise: "I was skeptical too. Now I've earned back my investment 30x over. The ROI is insane."

**"What if I fail the exam?"**
- Amber: "The exam covers exactly what's in the lessons. If you do the work, you'll pass. Promise!"

### 2.4 Periodic Success Stories (Timed)

Random zombie messages appear throughout the day:

```javascript
const SUCCESS_STORIES = [
  { mentor: "Gina", message: "Just booked my 12th client this month! Still pinching myself." },
  { mentor: "Denise", message: "Update: $10.2K last month. Started at $0 just 8 months ago." },
  { mentor: "Amber", message: "Got a referral today from my first-ever client. This compounds!" },
  { mentor: "Gina", message: "A client told me today I 'saved her life.' This is why we do this work." },
  { mentor: "Denise", message: "My husband just quit HIS job because I'm making enough for both of us now." },
  { mentor: "Amber", message: "Working on my back porch today. This flexibility is everything." },
];
```

---

## 3. Income Calculator

### 3.1 Display Timing
Shows between lessons as a motivational interstitial:

- After Lesson 1: "Your earning potential: $3,000-5,000/mo"
- After Lesson 3: "Your earning potential: $4,000-6,000/mo"
- After Lesson 5: "Your earning potential: $5,000-7,500/mo"
- After Lesson 7: "Your earning potential: $6,000-9,000/mo"
- After Lesson 9: "Your earning potential: $7,000-12,000/mo"

### 3.2 Calculator Logic

```typescript
const calculatePotential = (lessonsCompleted: number): { min: number; max: number } => {
  const baseMin = 3000;
  const baseMax = 5000;
  const incrementMin = 500;
  const incrementMax = 750;

  return {
    min: baseMin + (lessonsCompleted * incrementMin),
    max: baseMax + (lessonsCompleted * incrementMax),
  };
};
```

### 3.3 UI Component

```
┌─────────────────────────────────────────────────────┐
│  📈 Your Earning Potential                          │
│                                                     │
│     ████████████████████░░░░░░░░░░░░░░░░░░░░  56%  │
│                                                     │
│  Based on your progress (5/9 lessons):             │
│                                                     │
│     $5,500 - $8,750/mo                             │
│                                                     │
│  "I started at $0 and now make $6.2K/mo working    │
│   part-time from home." - Amber L., Texas          │
│                                                     │
│           [ Continue to Lesson 6 → ]               │
└─────────────────────────────────────────────────────┘
```

---

## 4. Technical Implementation

### 4.1 Component Structure

```
src/components/mini-diploma/
├── mentor-group/
│   ├── mentor-group-panel.tsx      # Main sidebar component
│   ├── mentor-message.tsx          # Individual message bubble
│   ├── mentor-profiles.ts          # Gina, Amber, Denise data
│   ├── mentor-scripts.ts           # All scripted messages
│   ├── mentor-triggers.ts          # When to show what
│   └── income-calculator.tsx       # Between-lesson calculator
```

### 4.2 Database Additions

```prisma
model MentorGroupMessage {
  id          String   @id @default(cuid())

  // Who sent it
  type        String   // "sarah" | "mentor" | "student"
  mentorId    String?  // References zombie profile if mentor
  userId      String?  // References user if student

  // Content
  content     String   @db.Text

  // Targeting
  cohortId    String?  // For cohort-specific messages
  triggeredBy String?  // "welcome" | "lesson_complete:3" | "question:time" | "scheduled"

  // Timestamps
  createdAt   DateTime @default(now())

  @@index([cohortId, createdAt])
}
```

### 4.3 API Endpoints

```
POST /api/mentor-group/message
  - Student sends a message
  - Triggers AI response (Sarah) + zombie responses if applicable

GET /api/mentor-group/messages?cohortId=X&since=Y
  - Fetch recent messages for sidebar
  - Includes mentor messages + student messages

POST /api/mentor-group/trigger
  - Internal: Trigger zombie messages based on events
  - Called after lesson completion, on schedule, etc.
```

### 4.4 Real-time Updates

Use polling or WebSocket for live feel:
- Poll every 5 seconds for new messages
- Show typing indicator when mentor "responding"
- Animate new messages sliding in

---

## 5. Migration Path

### Phase 1: Replace Sidebar (Week 1)
1. Create `mentor-group-panel.tsx` component
2. Port Sarah chat functionality
3. Add 3 mentor profiles
4. Implement welcome messages
5. Replace `sarah-chat-panel.tsx` in layout

### Phase 2: Add Triggers (Week 2)
1. Lesson completion triggers
2. Q&A response system
3. Scheduled success stories
4. Income calculator interstitial

### Phase 3: Polish (Week 3)
1. Typing indicators
2. Reaction emojis
3. Message read receipts
4. Mobile optimization

---

## 6. Success Metrics

### Before (Current Sarah-only chat):
- Chat engagement rate: ~15%
- Avg messages per student: 2-3
- Completion rate: 58%

### Target (Mentor Group):
- Chat engagement rate: 40%+
- Avg messages per student: 8-10
- Completion rate: 75-80%

### Track:
1. Messages sent by students
2. Questions asked
3. Time spent in mentor group
4. Lesson completion velocity
5. Exam pass rate
6. Upsell conversion

---

## 7. Mentor Scripts Database

Full script library in `src/lib/mentor-scripts.ts`:

```typescript
export const MENTOR_SCRIPTS = {
  welcome: {
    sarah: [...],
    gina: [...],
    amber: [...],
    denise: [...],
  },
  lessonComplete: {
    1: { ... },
    3: { ... },
    // ...
  },
  qa: {
    time: [...],
    partTime: [...],
    clients: [...],
    legitimate: [...],
    exam: [...],
  },
  successStories: [...],
  encouragement: [...],
  tips: [...],
};
```

---

## 8. Visual Design

### Sidebar Layout
```
┌──────────────────────────────────────┐
│ 👥 Mentor Group                      │
│ Sarah + 3 Senior Graduates           │
├──────────────────────────────────────┤
│                                      │
│ ┌────────────────────────────────┐   │
│ │ 🟢 Sarah (Mentor)              │   │
│ │ Welcome to your FM journey!   │   │
│ └────────────────────────────────┘   │
│                                      │
│ ┌────────────────────────────────┐   │
│ │ 👩 Gina T. · California        │   │
│ │ Hey! So excited you're here!  │   │
│ │ This changes everything!       │   │
│ └────────────────────────────────┘   │
│                                      │
│ ┌────────────────────────────────┐   │
│ │ 💰 Denise P. · $10.2K/mo       │   │
│ │ Just had my best week - 6     │   │
│ │ clients, $1,850!              │   │
│ └────────────────────────────────┘   │
│                                      │
├──────────────────────────────────────┤
│ [ Type a message...           Send ] │
└──────────────────────────────────────┘
```

### Message Bubbles
- Sarah: Burgundy background, gold accent
- Gina: Emerald accent (success/energy)
- Amber: Blue accent (calm/helpful)
- Denise: Gold accent (money/results)
- Student: Gray background, right-aligned

---

## Next Steps

1. [ ] Approve this plan
2. [ ] Create mentor profile assets (avatars)
3. [ ] Build `mentor-group-panel.tsx` component
4. [ ] Write full script library
5. [ ] Implement trigger system
6. [ ] Add income calculator
7. [ ] Test with real users
8. [ ] Measure impact on completion rate
