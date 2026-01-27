# Implementation Checklist

> Dev task tracking for Mini Diploma CRO System.
> Two systems: Portal Improvements + Live VSL Page.

---

## Phase 1: Database & Models (Week 1)

### Prisma Schema Updates

- [ ] **LiveTrainingSession model**
  ```prisma
  model LiveTrainingSession {
    id              String   @id @default(cuid())
    sessionCode     String   @unique  // "2024-01-live"
    startedAt       DateTime
    videoProgress   Int      @default(0)  // seconds
    lastActivity    DateTime @default(now())
    userId          String
    user            User     @relation(fields: [userId], references: [id])
    enrolledAt      DateTime?
    createdAt       DateTime @default(now())
  }
  ```

- [ ] **ZombieProfile model**
  ```prisma
  model ZombieProfile {
    id          String   @id @default(cuid())
    name        String
    location    String
    avatarUrl   String
    background  String   // "nurse", "pharmacist", "mom"
    tier        Int      @default(2)  // 1=active, 2=moderate, 3=occasional
    isGraduate  Boolean  @default(false)
    createdAt   DateTime @default(now())
  }
  ```

- [ ] **ZombieChatMessage model**
  ```prisma
  model ZombieChatMessage {
    id           String   @id @default(cuid())
    profileId    String
    profile      ZombieProfile @relation(fields: [profileId], references: [id])
    videoTime    Int      // seconds into video
    messageType  String   // CHAT, SARAH, ENROLL, ALERT
    content      String
    createdAt    DateTime @default(now())
  }
  ```

- [ ] **GraduatePost model**
  ```prisma
  model GraduatePost {
    id           String   @id @default(cuid())
    profileId    String?  // null for real users
    profile      ZombieProfile? @relation(fields: [profileId], references: [id])
    userId       String?  // for real user posts
    user         User?    @relation(fields: [userId], references: [id])
    content      String   @db.Text
    postType     String   // JUST_CERTIFIED, FIRST_CLIENT, INCOME, TRANSFORMATION, TIP
    likes        Int      @default(0)
    comments     Json     @default("[]")
    postedAt     DateTime @default(now())
    createdAt    DateTime @default(now())
  }
  ```

- [ ] **SmartNudge model**
  ```prisma
  model SmartNudge {
    id           String   @id @default(cuid())
    userId       String
    user         User     @relation(fields: [userId], references: [id])
    triggerType  String   // LESSON_2_COMPLETE, INACTIVE_48H, etc.
    nudgeType    String   // DM, EMAIL, SMS
    content      String   @db.Text
    sentAt       DateTime?
    openedAt     DateTime?
    clickedAt    DateTime?
    createdAt    DateTime @default(now())
  }
  ```

- [ ] Run `npx prisma db push` and verify

### Seed Data

- [ ] Create seed script for zombie profiles
- [ ] Create seed script for zombie chat messages (from ZOMBIE_CHAT_SCRIPT.md)
- [ ] Create seed script for graduate posts (from GRADUATE_POST_TEMPLATES.md)
- [ ] Run seeds in dev environment
- [ ] Verify data in Prisma Studio

---

## Phase 2: Portal Improvements (Week 1-2)

### Graduates Channel

- [ ] **Create GraduatesChannel component**
  - Location: `/src/components/mini-diploma/graduates-channel.tsx`
  - Shows zombie posts + real graduate posts
  - Read-only for non-graduates
  - Write access after completion

- [ ] **Add to lesson sidebar**
  - Replace Student Lounge with Graduates Channel tab
  - Show "Complete your Mini Diploma to post!" message for non-graduates
  - Display post count badge

- [ ] **API endpoints**
  - [ ] `GET /api/mini-diploma/graduates/posts` - Fetch posts with pagination
  - [ ] `POST /api/mini-diploma/graduates/posts` - Create new post (graduates only)
  - [ ] `POST /api/mini-diploma/graduates/posts/[id]/like` - Like a post
  - [ ] `POST /api/mini-diploma/graduates/posts/[id]/comment` - Add comment

- [ ] **Post interaction animations**
  - Like button with heart animation
  - New post slide-in animation
  - Comment expand/collapse

### Sarah Chat Improvements

- [ ] **Fix chat navigation bug**
  - Chat should stay within mini diploma portal
  - Don't redirect to main portal

- [ ] **Move to lesson sidebar**
  - Add "Chat with Sarah" tab in lesson view
  - Remove Student Lounge completely
  - Sarah avatar and online indicator

- [ ] **Smart message triggers**
  - After Lesson 3: "You're making great progress!"
  - After Lesson 6: "You're past the halfway point!"
  - After Lesson 9: "Ready for your exam?"
  - On inactivity: Personalized nudge

- [ ] **Update `/src/components/mini-diploma/lesson-sidebar.tsx`**
  - Tab 1: Lesson Content
  - Tab 2: Sarah Chat
  - Tab 3: Graduates Channel

### Smart Nudges System

- [ ] **Create nudge trigger service**
  - Location: `/src/lib/smart-nudges.ts`
  - Functions for each trigger type
  - Rate limiting (max 1 nudge per day)

- [ ] **Nudge triggers to implement**
  ```typescript
  const NUDGE_TRIGGERS = {
    LESSON_2_COMPLETE: "lesson_2_momentum",
    LESSON_5_HALFWAY: "halfway_encouragement",
    INACTIVE_24H: "gentle_checkin",
    INACTIVE_48H: "personal_reach_out",
    QUIZ_FAILED: "quiz_support",
    EXAM_ELIGIBLE: "exam_ready_push",
  };
  ```

- [ ] **Update cron job**
  - Modify `/src/app/api/cron/mini-diploma-nudges/route.ts`
  - Check for nudge triggers
  - Send appropriate DM/email based on trigger
  - Log nudge delivery

- [ ] **Add to GHL workflows**
  - SMS versions of key nudges
  - Coordinate with email to avoid double-messaging

---

## Phase 3: Live VSL Infrastructure (Week 2)

### Backend APIs

- [ ] **Create `/api/vsl/session` endpoint**
  ```typescript
  // POST: Create or resume session
  // GET: Get current session state
  // PATCH: Update video progress
  ```

- [ ] **Create `/api/vsl/chat` endpoint**
  ```typescript
  // GET: Get zombie messages for current video time
  // POST: Submit user message, get Sarah AI response
  ```

- [ ] **Create `/api/vsl/enrollment-events` endpoint**
  ```typescript
  // GET: Get enrollment notifications
  // Called from ClickFunnels to show real-time enrollments
  ```

- [ ] **Create Sarah AI chat handler**
  - Location: `/src/lib/sarah-ai-chat.ts`
  - Use prompts from SARAH_AI_PROMPTS.md
  - Rate limit: 5 messages/minute per user
  - Log all conversations

### Video & Chat Sync

- [ ] **Create zombie chat loader**
  - Fetch messages in 5-minute batches
  - Cache in memory for performance
  - Sync with video timestamp

- [ ] **Create chat display component**
  - Location: `/src/components/vsl/live-chat.tsx`
  - Message types: CHAT, SARAH, ENROLL, ALERT, USER
  - Auto-scroll with smooth animation
  - User input field

- [ ] **Create enrollment notification component**
  - Toast-style notifications
  - Slide in from bottom right
  - Auto-dismiss after 5 seconds

### Spots & Urgency

- [ ] **Create spots counter logic**
  - Start at 3
  - Decrease at video timestamps: 7:45, 13:45, 18:00, 22:15, 27:15, 31:45, 37:30
  - Never go below 1 (emergency spot)

- [ ] **Create countdown timer**
  - Read deadline from URL param or cookie
  - Display HH:MM:SS format
  - Show "EXPIRED" state with re-engagement message

---

## Phase 4: ClickFunnels Page (Week 2-3)

### Page Setup

- [ ] **Create funnel in CF 2.0**
  - Page 1: VSL + Chat + Checkout
  - Page 2: Thank You / Welcome

- [ ] **Design header section**
  - AccrediPro logo
  - Live indicator
  - Viewer count (dynamic)

- [ ] **Design video + chat layout**
  - Responsive two-column on desktop
  - Stacked on mobile
  - Chat toggle for mobile

- [ ] **Embed Fanbasis checkout**
  - Test iframe embedding
  - Pass user params (email, firstName)
  - Style to match page design

### Custom Code Integration

- [ ] **Add zombie chat JS**
  - Copy from CLICKFUNNELS_SPEC.md
  - Test message timing

- [ ] **Add real user chat JS**
  - Connect to Sarah AI endpoint
  - Handle responses

- [ ] **Add spots counter JS**
  - Test decrement logic

- [ ] **Add countdown timer JS**
  - Test deadline handling

- [ ] **Add tracking pixels**
  - Facebook Pixel with all events
  - GA4 event tracking
  - Verify in debugger

### Mobile Optimization

- [ ] **Test on iOS Safari**
  - Video plays correctly
  - Chat scrolls smoothly
  - Checkout loads

- [ ] **Test on Android Chrome**
  - Same checks as iOS

- [ ] **Test chat toggle on mobile**
  - Expands/collapses correctly
  - Doesn't block video

---

## Phase 5: GHL Workflows (Week 3)

### Create Workflows

- [ ] **Workflow 1: Welcome Sequence**
  - Trigger: mini_diploma_started
  - 2 messages over 2 days

- [ ] **Workflow 2: Engagement Nudges**
  - Trigger: engagement_drop
  - 3 messages over 10 days

- [ ] **Workflow 3: Completion Celebration**
  - Trigger: mini_diploma_completed
  - 1 immediate message

- [ ] **Workflow 4: Scholarship Urgency**
  - Trigger: scholarship_activated
  - 2 messages (12h and 23h)

- [ ] **Workflow 5: Post-Purchase Welcome**
  - Trigger: certification_enrolled
  - 2 messages (immediate + day 3)

- [ ] **Workflow 6: Recovery Sequences**
  - Multiple triggers for abandoned users

### Webhook Integration

- [ ] **Update `/src/lib/ghl-webhook.ts`**
  - Add all new milestone types
  - Include custom_data fields

- [ ] **Test webhook delivery**
  - Verify GHL receives events
  - Check tag assignment
  - Confirm workflow triggers

### Compliance Setup

- [ ] **Configure STOP handling**
  - Immediate opt-out processing
  - Tag user as sms_opted_out

- [ ] **Set quiet hours**
  - 8am - 9pm local time only

- [ ] **Enable A/B testing**
  - Set up test variants for key messages

---

## Phase 6: Integration & Testing (Week 3-4)

### Completion Flow Integration

- [ ] **Update `/api/mini-diploma/complete/route.ts`**
  - Redirect to VSL page instead of direct checkout
  - Pass user params in URL
  - Set scholarship deadline (24h)

- [ ] **Update completion UI**
  - Show "Watch Your Graduate Training" button
  - Hide direct Fanbasis link

- [ ] **Test full flow**
  1. Complete Mini Diploma
  2. Pass exam
  3. Redirect to VSL page
  4. Watch video with chat
  5. Complete checkout
  6. Receive welcome emails

### End-to-End Testing

- [ ] **Test Portal Improvements**
  - [ ] Graduates Channel displays correctly
  - [ ] Non-graduates see read-only view
  - [ ] Graduates can post
  - [ ] Sarah chat works in sidebar
  - [ ] Smart nudges fire correctly

- [ ] **Test VSL Page**
  - [ ] Video plays without seeking
  - [ ] Zombie chat syncs to video
  - [ ] Real user messages work
  - [ ] Sarah AI responds appropriately
  - [ ] Spots counter decreases
  - [ ] Countdown timer works
  - [ ] Checkout processes payment

- [ ] **Test GHL Workflows**
  - [ ] Webhooks trigger workflows
  - [ ] SMS messages send
  - [ ] STOP handling works
  - [ ] Quiet hours respected

### Analytics Verification

- [ ] **Facebook Pixel**
  - ViewContent fires on page load
  - Custom events fire at milestones
  - Purchase event fires from Fanbasis

- [ ] **GA4**
  - Video progress events
  - Checkout events
  - Purchase events

- [ ] **Internal tracking**
  - Session data stored correctly
  - Nudge delivery logged
  - Conversion attributed

---

## Phase 7: Launch & Monitoring (Week 4)

### Pre-Launch

- [ ] **Load test VSL page**
  - Simulate 50 concurrent users
  - Check API response times

- [ ] **Security review**
  - Rate limiting on all endpoints
  - Input validation
  - XSS prevention

- [ ] **Backup current flow**
  - Screenshot existing completion page
  - Save current conversion rate

### Launch

- [ ] **Deploy to production**
  - Prisma migrations
  - Seed zombie data
  - Enable new routes

- [ ] **Monitor first 24 hours**
  - Watch for errors in Vercel logs
  - Check GHL workflow delivery
  - Monitor conversion rate

- [ ] **Gather feedback**
  - Watch chat transcripts
  - Note common questions
  - Identify UX friction

### Post-Launch Optimization

- [ ] **A/B test variations**
  - Different urgency messaging
  - Chat placement options
  - CTA button copy

- [ ] **Iterate on Sarah AI**
  - Review response quality
  - Add new response templates
  - Fine-tune personality

- [ ] **Optimize for mobile**
  - Based on real user behavior
  - Heat mapping if available

---

## Success Metrics

### Target KPIs (30 days post-launch)

| Metric | Current | Target | Owner |
|--------|---------|--------|-------|
| Exam → Purchase | 2.6% | 15% | CRO |
| VSL Watch Rate | N/A | 60% | CRO |
| Chat Engagement | N/A | 30% | CRO |
| Lesson Completion | 58% | 75% | Portal |
| Graduate Channel Posts | N/A | 5/week | Community |
| SMS Response Rate | N/A | 8% | GHL |

### Tracking Dashboard

- [ ] Create Amplitude/Mixpanel dashboard
- [ ] Track funnel conversion at each step
- [ ] Monitor daily/weekly trends
- [ ] Set up alerts for anomalies

---

## Documentation

- [ ] Update CLAUDE.md with new systems
- [ ] Document API endpoints
- [ ] Create runbook for common issues
- [ ] Training doc for support team
