# ORACLE - Technical Implementation Specification
## AI Operations Commander - Full Technical Plan

---

## 📋 Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Database Schema](#database-schema)
3. [File Structure](#file-structure)
4. [API Endpoints](#api-endpoints)
5. [Core Library Functions](#core-library-functions)
6. [Admin Panel Components](#admin-panel-components)
7. [Event Tracking](#event-tracking)
8. [AI Integration](#ai-integration)
9. [Cron Jobs](#cron-jobs)
10. [Implementation Phases](#implementation-phases)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    ORACLE SYSTEM                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │   OBSERVE   │ →  │   ANALYZE   │ →  │   EXECUTE   │     │
│  │ (Events API)│    │(AI + Rules) │    │ (Actions)   │     │
│  └─────────────┘    └─────────────┘    └─────────────┘     │
│        │                  │                  │              │
│        └──────────────────┴──────────────────┘              │
│                          ↓                                  │
│                   ┌─────────────┐                           │
│                   │    LEARN    │                           │
│                   │ (Outcomes)  │                           │
│                   └─────────────┘                           │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  DATA LAYER:                                                │
│  ├── OracleEvent     - All tracked events                  │
│  ├── OracleAction    - Actions taken/pending               │
│  ├── OracleSegment   - User classifications                │
│  ├── OraclePrediction- AI predictions                      │
│  └── OracleRule      - Automation rules                    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  EXECUTION LAYER:                                           │
│  ├── Email (Resend/SendGrid)                               │
│  ├── DM (Internal messaging)                               │
│  ├── Push (Web notifications)                              │
│  └── Community (Auto-posts)                                │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  AI LAYER:                                                  │
│  ├── GPT-4o-mini (fast tasks)                              │
│  ├── GPT-4o (complex tasks)                                │
│  └── Claude 3.5 (deep analysis)                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Database Schema

### Add to `prisma/schema.prisma`:

```prisma
// =============================================================================
// ORACLE - AI Operations Commander
// =============================================================================

// Track ALL user events
model OracleEvent {
  id        String   @id @default(cuid())
  userId    String
  event     String   // login, lesson_complete, email_open, dm_read, etc.
  metadata  Json?    // { lessonId, courseId, emailId, etc. }
  source    String?  // web, email, dm, api
  sessionId String?  // group events by session
  createdAt DateTime @default(now())

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, createdAt])
  @@index([event, createdAt])
}

// Actions Oracle takes (or queues for approval)
model OracleAction {
  id          String    @id @default(cuid())
  userId      String
  actionType  String    // email, dm, push, post, alert
  status      String    @default("pending") // pending, approved, executed, rejected, failed
  priority    Int       @default(5) // 1-10, higher = more urgent
  
  // Content
  template    String?   // template name if using template
  subject     String?   // for emails
  content     String    @db.Text // the message content
  metadata    Json?     // additional data
  
  // Trigger info
  triggeredBy String    // rule_name, ai_decision, manual
  triggerData Json?     // why this was triggered
  
  // Execution info
  scheduledAt DateTime? // when to execute (null = asap)
  executedAt  DateTime?
  
  // Outcome tracking
  outcome     Json?     // { opened, clicked, replied, converted }
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, status])
  @@index([status, scheduledAt])
  @@index([actionType, createdAt])
}

// Dynamic user segmentation
model OracleSegment {
  id String @id @default(cuid())
  userId String @unique

  // Engagement classification
  engagementLevel String @default("new") // new, active, moderate, dormant, lost
  engagementScore Int    @default(50) // 0-100
  
  // Risk assessment
  churnRisk       Int    @default(0) // 0-100
  churnReason     String? // inactivity, stuck, no_progress, etc.
  
  // Lifecycle stage
  lifecycle       String @default("lead") // lead, new, active, engaged, graduate, alumni
  
  // Persona classification
  persona         String? // career_changer, professional, hobbyist, etc.
  learningStyle   String? // visual, audio, reading, doing
  
  // Value classification
  ltv             Decimal? @db.Decimal(10, 2) // lifetime value
  valueSegment    String?  // high, medium, low
  
  // Prediction scores
  completionProb  Int?    // 0-100
  upgradeProb     Int?    // 0-100
  referralProb    Int?    // 0-100
  
  // Optimal contact info
  bestContactTime String? // morning, afternoon, evening
  bestChannel     String? // email, dm, push
  
  lastAnalyzed    DateTime?
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// Automation rules
model OracleRule {
  id          String  @id @default(cuid())
  name        String
  description String?
  
  // Trigger conditions
  trigger     String  // event_based, time_based, segment_based
  conditions  Json    // { event: "lesson_complete", days_since: 3, etc. }
  
  // Action to take
  actionType  String  // email, dm, push, post, tag
  actionData  Json    // { template: "welcome", subject: "...", etc. }
  
  // Control
  isActive    Boolean @default(true)
  priority    Int     @default(5)
  cooldown    Int     @default(24) // hours between repeated triggers
  maxPerUser  Int?    // max times per user (null = unlimited)
  
  // Stats
  timesTriggered Int  @default(0)
  lastTriggered  DateTime?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([isActive, trigger])
}

// AI Analysis logs (for learning)
model OracleInsight {
  id          String   @id @default(cuid())
  type        String   // hypothesis, observation, recommendation
  title       String
  content     String   @db.Text
  confidence  Int?     // 0-100
  metadata    Json?
  status      String   @default("new") // new, reviewed, implemented, rejected
  createdAt   DateTime @default(now())
}
```

---

## 3. File Structure

```
src/
├── app/
│   ├── (admin)/
│   │   └── admin/
│   │       └── oracle/
│   │           ├── page.tsx                 # Main dashboard
│   │           ├── layout.tsx               # Oracle layout
│   │           ├── users/
│   │           │   ├── page.tsx             # All users + segments
│   │           │   └── [id]/
│   │           │       └── page.tsx         # User story view
│   │           ├── actions/
│   │           │   └── page.tsx             # Action queue
│   │           ├── rules/
│   │           │   └── page.tsx             # Automation rules
│   │           ├── insights/
│   │           │   └── page.tsx             # AI insights
│   │           └── settings/
│   │               └── page.tsx             # Oracle configuration
│   │
│   └── api/
│       └── oracle/
│           ├── events/
│           │   └── route.ts                 # POST: Track event
│           ├── actions/
│           │   └── route.ts                 # GET/POST/PATCH: Manage actions
│           ├── segments/
│           │   └── route.ts                 # GET: User segments
│           ├── analyze/
│           │   ├── user/[id]/route.ts       # GET: Analyze single user
│           │   └── batch/route.ts           # POST: Batch analysis
│           ├── execute/
│           │   └── route.ts                 # POST: Execute action
│           ├── rules/
│           │   └── route.ts                 # CRUD for rules
│           └── ceo-report/
│               └── route.ts                 # GET: Weekly CEO report
│
├── components/
│   └── oracle/
│       ├── oracle-dashboard.tsx             # Main dashboard component
│       ├── user-story-card.tsx              # User journey timeline
│       ├── action-queue.tsx                 # Pending actions list
│       ├── live-feed.tsx                    # Real-time event feed
│       ├── segment-chart.tsx                # Segment visualization
│       ├── rule-builder.tsx                 # Visual rule builder
│       └── insight-card.tsx                 # AI insight display
│
├── lib/
│   └── oracle/
│       ├── index.ts                         # Main exports
│       ├── observer.ts                      # Event tracking functions
│       ├── classifier.ts                    # Segmentation logic
│       ├── predictor.ts                     # AI prediction calls
│       ├── decider.ts                       # Action decision logic
│       ├── executor.ts                      # Execute actions
│       ├── learner.ts                       # Outcome tracking
│       ├── rules-engine.ts                  # Rule evaluation
│       └── ai-client.ts                     # OpenAI/Anthropic wrapper
│
└── types/
    └── oracle.ts                            # TypeScript types
```

---

## 4. API Endpoints

### `/api/oracle/events` - Event Tracking

```typescript
// POST - Track an event
interface TrackEventRequest {
  userId: string;
  event: string;      // "login", "lesson_complete", "email_open", etc.
  metadata?: Record<string, any>;
  source?: string;    // "web", "email", "dm"
}

// Events to track:
const ORACLE_EVENTS = {
  // User activity
  LOGIN: "login",
  LOGOUT: "logout",
  PAGE_VIEW: "page_view",
  
  // Learning
  LESSON_START: "lesson_start",
  LESSON_COMPLETE: "lesson_complete",
  MODULE_COMPLETE: "module_complete",
  COURSE_COMPLETE: "course_complete",
  QUIZ_PASS: "quiz_pass",
  QUIZ_FAIL: "quiz_fail",
  CERTIFICATE_DOWNLOAD: "certificate_download",
  
  // Engagement
  NOTE_CREATED: "note_created",
  COMMUNITY_POST: "community_post",
  COMMUNITY_COMMENT: "community_comment",
  DM_SENT: "dm_sent",
  DM_READ: "dm_read",
  
  // Email
  EMAIL_SENT: "email_sent",
  EMAIL_OPEN: "email_open",
  EMAIL_CLICK: "email_click",
  
  // Revenue
  PURCHASE: "purchase",
  REFUND: "refund",
  UPGRADE: "upgrade",
  
  // Custom
  FEEDBACK_GIVEN: "feedback_given",
  REFERRAL_SHARED: "referral_shared",
  SUPPORT_TICKET: "support_ticket",
};
```

### `/api/oracle/actions` - Action Management

```typescript
// GET - List actions (with filters)
// Query params: status, userId, actionType, limit

// POST - Create action
interface CreateActionRequest {
  userId: string;
  actionType: "email" | "dm" | "push" | "post" | "alert";
  content: string;
  subject?: string;
  template?: string;
  priority?: number;
  scheduledAt?: Date;
  triggeredBy: string;
}

// PATCH - Update action status
interface UpdateActionRequest {
  status: "approved" | "rejected" | "executed";
}
```

### `/api/oracle/analyze/user/[id]` - User Analysis

```typescript
// GET - Get full user analysis
interface UserAnalysis {
  user: UserBasicInfo;
  segment: OracleSegment;
  timeline: OracleEvent[];      // Recent events
  actions: OracleAction[];      // Actions taken
  predictions: {
    churnRisk: number;
    completionProb: number;
    upgradeProb: number;
    recommendedActions: string[];
  };
  aiSummary: string;            // GPT-generated summary
  nextBestAction: {
    type: string;
    content: string;
    reasoning: string;
  };
}
```

---

## 5. Core Library Functions

### `lib/oracle/observer.ts`

```typescript
import { prisma } from "@/lib/prisma";

export async function trackEvent(
  userId: string,
  event: string,
  metadata?: Record<string, any>,
  source?: string
) {
  return prisma.oracleEvent.create({
    data: { userId, event, metadata, source },
  });
}

export async function getUserEvents(
  userId: string,
  options?: { limit?: number; since?: Date }
) {
  return prisma.oracleEvent.findMany({
    where: {
      userId,
      createdAt: options?.since ? { gte: options.since } : undefined,
    },
    orderBy: { createdAt: "desc" },
    take: options?.limit || 100,
  });
}
```

### `lib/oracle/classifier.ts`

```typescript
import { prisma } from "@/lib/prisma";

export async function classifyUser(userId: string) {
  const [events, progress, lastLogin] = await Promise.all([
    getRecentEvents(userId, 30), // Last 30 days
    getUserProgress(userId),
    getLastLogin(userId),
  ]);

  const daysSinceLogin = daysSince(lastLogin);
  const lessonsThisWeek = countEvents(events, "lesson_complete", 7);
  
  // Engagement level
  let engagementLevel = "new";
  let engagementScore = 50;
  
  if (daysSinceLogin > 30) {
    engagementLevel = "lost";
    engagementScore = 0;
  } else if (daysSinceLogin > 14) {
    engagementLevel = "dormant";
    engagementScore = 20;
  } else if (lessonsThisWeek >= 5) {
    engagementLevel = "active";
    engagementScore = 90;
  } else if (lessonsThisWeek >= 2) {
    engagementLevel = "moderate";
    engagementScore = 60;
  }
  
  // Churn risk
  const churnRisk = calculateChurnRisk(events, progress, daysSinceLogin);
  
  // Update segment
  return prisma.oracleSegment.upsert({
    where: { userId },
    create: { userId, engagementLevel, engagementScore, churnRisk },
    update: { engagementLevel, engagementScore, churnRisk, lastAnalyzed: new Date() },
  });
}
```

### `lib/oracle/ai-client.ts`

```typescript
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Fast tasks - GPT-4o-mini
export async function generateQuickMessage(
  context: string,
  type: "email" | "dm" | "push"
): Promise<string> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SARAH_PERSONA },
      { role: "user", content: `Generate a ${type} for: ${context}` },
    ],
    max_tokens: 300,
  });
  return response.choices[0]?.message?.content || "";
}

// Complex analysis - GPT-4o
export async function analyzeUser(userData: any): Promise<UserAnalysis> {
  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: ANALYST_PERSONA },
      { role: "user", content: JSON.stringify(userData) },
    ],
    response_format: { type: "json_object" },
  });
  return JSON.parse(response.choices[0]?.message?.content || "{}");
}

// Deep insights - Claude
export async function generateWeeklyReport(data: any): Promise<string> {
  const response = await anthropic.messages.create({
    model: "claude-3-5-sonnet-20240620",
    max_tokens: 2000,
    messages: [
      { role: "user", content: `Analyze this week's data and provide insights:\n${JSON.stringify(data)}` },
    ],
  });
  return response.content[0].text;
}
```

---

## 6. Admin Panel Components

### Main Dashboard (`/admin/oracle`)

```
┌─────────────────────────────────────────────────────────────┐
│  🧠 ORACLE COMMAND CENTER                                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────────────┐  ┌─────────────────────────────┐  │
│  │  TODAY'S STATS      │  │  LIVE FEED                  │  │
│  │  Actions: 1,247     │  │  • 10:23 - DM sent to Maria │  │
│  │  Emails: 834        │  │  • 10:22 - Rule triggered   │  │
│  │  Revenue: $4,320    │  │  • 10:20 - Email opened     │  │
│  └─────────────────────┘  └─────────────────────────────┘  │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  PENDING ACTIONS (3)                 [Approve All]  │   │
│  │  ┌─────────────────────────────────────────────┐   │   │
│  │  │ Email to 23 users - Upsell offer            │   │   │
│  │  │ [Approve] [Edit] [Reject]                   │   │   │
│  │  └─────────────────────────────────────────────┘   │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌─────────┐  │
│  │ Segments   │ │ Actions    │ │ Rules      │ │ Insights│  │
│  │ 4 active   │ │ 47 queued  │ │ 12 active  │ │ 3 new   │  │
│  └────────────┘ └────────────┘ └────────────┘ └─────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### User Story View (`/admin/oracle/users/[id]`)

```
┌─────────────────────────────────────────────────────────────┐
│  👤 Maria Rodriguez                       [Send DM] [Email] │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PROFILE                    │  SEGMENT                      │
│  Email: maria@email.com     │  Engagement: Active (87/100)  │
│  Joined: Jan 1, 2026        │  Churn Risk: Low (12%)        │
│  Last login: 2 hours ago    │  Lifecycle: Active Student    │
│                             │  LTV: $597                    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  JOURNEY TIMELINE                                           │
│  ─────────────────────────────────────────────────────────  │
│  Jan 10  ✅ Completed Module 5 Lesson 3                     │
│  Jan 10  📧 Opened "Keep going!" email                      │
│  Jan 9   ✅ Completed Module 5 Lesson 2                     │
│  Jan 8   💬 Sarah DM: Check-in                              │
│  Jan 7   ✅ Completed Module 5 Lesson 1                     │
│  ...                                                        │
├─────────────────────────────────────────────────────────────┤
│  AI ANALYSIS                                                │
│  ─────────────────────────────────────────────────────────  │
│  "Maria is a highly engaged student, completing 3 lessons   │
│  this week. She responds well to encouragement emails.      │
│  Recommendation: She's ready for an upsell offer at         │
│  current momentum. Best time to contact: evenings."         │
│                                                             │
│  RECOMMENDED NEXT ACTION                                    │
│  [Send Upsell Email] - Based on high engagement + 60% done  │
└─────────────────────────────────────────────────────────────┘
```

---

## 7. Event Tracking Integration

### Track events throughout the app:

```typescript
// In lesson completion handler
import { trackEvent } from "@/lib/oracle/observer";

await trackEvent(userId, "lesson_complete", {
  lessonId,
  courseId,
  moduleId,
  timeSpent: seconds,
});

// In email sending
await trackEvent(userId, "email_sent", {
  emailId,
  template: "welcome",
  subject: emailSubject,
});

// In login handler
await trackEvent(userId, "login", {
  device: userAgent,
  ip: ipAddress,
});
```

---

## 8. AI Integration Details

### Prompt Templates

```typescript
const SARAH_PERSONA = `
You are Coach Sarah, a warm and supportive wellness educator.
- Use the student's first name naturally
- Be encouraging but not overwhelming
- Keep messages concise (2-3 sentences for DMs, 4-5 for emails)
- Never mention being an AI
- Sign off warmly (💚, "Cheering you on!", etc.)
`;

const ANALYST_PERSONA = `
You are an AI analyst for an online education platform.
Analyze user behavior and provide:
1. Engagement assessment (active/moderate/dormant)
2. Churn risk (0-100 with reasoning)
3. Completion probability
4. Recommended next action with reasoning
Be data-driven and concise.
`;
```

---

## 9. Cron Jobs

```typescript
// cron/oracle/daily.ts - Runs at 2am UTC

export async function dailyOracleJob() {
  // 1. Classify all active users
  const users = await getActiveUsers();
  for (const user of users) {
    await classifyUser(user.id);
  }
  
  // 2. Run automation rules
  await evaluateAllRules();
  
  // 3. Execute scheduled actions
  await executeScheduledActions();
  
  // 4. Clean old events (keep 90 days)
  await cleanOldEvents(90);
}

// cron/oracle/weekly.ts - Runs Sunday 8am UTC

export async function weeklyOracleJob() {
  // 1. Generate CEO report
  const report = await generateWeeklyReport();
  await sendCEOReport(report);
  
  // 2. Update prediction models
  await retrainPredictions();
  
  // 3. Generate new hypotheses
  await generateHypotheses();
}
```

---

## 10. Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Add Oracle schema to Prisma
- [ ] Run `prisma db push`
- [ ] Create `/lib/oracle/observer.ts`
- [ ] Create `/api/oracle/events/route.ts`
- [ ] Create `/admin/oracle/page.tsx` (basic dashboard)
- [ ] Add event tracking to key user actions

### Phase 2: Classification (Week 3)
- [ ] Create `/lib/oracle/classifier.ts`
- [ ] Create `/api/oracle/segments/route.ts`
- [ ] Create segment visualization component
- [ ] Daily cron job for classification

### Phase 3: Actions (Week 4)
- [ ] Create `/lib/oracle/executor.ts`
- [ ] Create `/api/oracle/actions/route.ts`
- [ ] Create action queue UI
- [ ] Connect to email provider (Resend)
- [ ] Connect to Sarah DM system

### Phase 4: AI Analysis (Week 5-6)
- [ ] Create `/lib/oracle/ai-client.ts`
- [ ] Create `/lib/oracle/predictor.ts`
- [ ] User analysis endpoint
- [ ] AI summary on user pages
- [ ] Next best action recommendations

### Phase 5: Automation (Week 7-8)
- [ ] Create `/lib/oracle/rules-engine.ts`
- [ ] Rule builder UI
- [ ] Trigger-based automation
- [ ] A/B testing framework

### Phase 6: Learning (Month 3+)
- [ ] Outcome tracking
- [ ] Model improvement
- [ ] Hypothesis generation
- [ ] CEO weekly report

---

## Quick Start Command

```bash
# After schema is added:
npx prisma db push
npx prisma generate

# Start dev server
npm run dev

# Access Oracle at:
# http://localhost:3001/admin/oracle
```
