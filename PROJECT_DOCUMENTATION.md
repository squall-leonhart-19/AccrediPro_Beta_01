# AccrediPro LMS - Complete Project Documentation

## Overview

AccrediPro LMS is a comprehensive, production-ready Learning Management System built for professional women transitioning into functional medicine and health coaching careers. The platform combines course delivery, community engagement, marketing automation, coach CRM, and gamification into a unified educational experience.

**Target Audience**: Healthcare professionals, nurses, corporate professionals seeking career change into functional medicine practice.

---

## Table of Contents

1. [Technology Stack](#1-technology-stack)
2. [Project Structure](#2-project-structure)
3. [Database Schema](#3-database-schema)
4. [Authentication System](#4-authentication-system)
5. [Core Features](#5-core-features)
6. [API Reference](#6-api-reference)
7. [Key Components](#7-key-components)
8. [Services & Utilities](#8-services--utilities)
9. [External Integrations](#9-external-integrations)
10. [Environment Configuration](#10-environment-configuration)
11. [Deployment](#11-deployment)

---

## 1. Technology Stack

### Core Framework
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0.7 | React framework with App Router |
| React | 19.2.0 | UI library |
| TypeScript | 5.x | Type safety |

### Database & Authentication
| Technology | Version | Purpose |
|------------|---------|---------|
| Prisma | 7.1.0 | ORM with PostgreSQL |
| PostgreSQL | - | Primary database (via Supabase) |
| NextAuth.js | 4.24.13 | Authentication & sessions |
| bcryptjs | 3.0.3 | Password hashing |

### UI & Styling
| Technology | Version | Purpose |
|------------|---------|---------|
| Tailwind CSS | 4.x | Utility-first CSS |
| Radix UI | - | Headless component primitives |
| shadcn/ui | - | Pre-built component library |
| lucide-react | 0.556.0 | Icon library |

### Communication
| Technology | Version | Purpose |
|------------|---------|---------|
| Resend | 6.5.2 | Email delivery |
| ElevenLabs SDK | 2.27.0 | Text-to-speech voice |
| Anthropic AI SDK | 0.71.2 | Claude AI integration |

### External Services
| Service | Purpose |
|---------|---------|
| Supabase | Database hosting & file storage |
| Wistia | Video hosting & player |
| NeverBounce | Email validation |

### Additional Libraries
- **react-hook-form** - Form state management
- **zod** - Schema validation
- **date-fns** - Date utilities
- **canvas** - Certificate rendering
- **jsPDF** - PDF generation
- **uuid** - ID generation
- **sonner** - Toast notifications
- **react-confetti** - Celebration animations

---

## 2. Project Structure

```
accredipro-lms/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (auth)/              # Authentication pages
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   └── reset-password/
│   │   ├── (admin)/             # Admin dashboard
│   │   │   ├── admin/
│   │   │   │   ├── courses/
│   │   │   │   ├── users/
│   │   │   │   ├── analytics/
│   │   │   │   ├── emails/
│   │   │   │   ├── communications/
│   │   │   │   ├── marketing/
│   │   │   │   └── settings/
│   │   ├── (dashboard)/         # User dashboard
│   │   │   ├── dashboard/
│   │   │   ├── courses/
│   │   │   ├── my-courses/
│   │   │   ├── community/
│   │   │   ├── messages/
│   │   │   ├── challenges/
│   │   │   ├── certificates/
│   │   │   ├── achievements/
│   │   │   ├── mentorship/
│   │   │   ├── profile/
│   │   │   ├── coach/
│   │   │   │   └── workspace/
│   │   │   └── dfy-resources/
│   │   ├── (public)/            # Public pages
│   │   │   └── free-mini-diploma/
│   │   ├── api/                 # API routes (85+ endpoints)
│   │   │   ├── auth/
│   │   │   ├── courses/
│   │   │   ├── progress/
│   │   │   ├── messages/
│   │   │   ├── community/
│   │   │   ├── challenges/
│   │   │   ├── admin/
│   │   │   ├── coach/
│   │   │   ├── ai/
│   │   │   └── webhooks/
│   │   └── verify/              # Certificate verification
│   ├── components/              # React components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── admin/              # Admin components
│   │   ├── courses/            # Course components
│   │   ├── community/          # Community components
│   │   ├── messages/           # Messaging components
│   │   ├── challenges/         # Challenge components
│   │   ├── coach/              # Coach CRM components
│   │   ├── certificates/       # Certificate components
│   │   ├── gamification/       # Badges & streaks
│   │   ├── marketplace/        # DFY marketplace
│   │   ├── freebie/            # Mini-diploma
│   │   └── onboarding/         # Onboarding flow
│   ├── lib/                    # Utilities & services
│   │   ├── auth.ts            # NextAuth configuration
│   │   ├── prisma.ts          # Database client
│   │   ├── email.ts           # Email service
│   │   ├── auto-messages.ts   # Triggered messages
│   │   ├── ai.ts              # AI integration
│   │   ├── elevenlabs.ts      # Text-to-speech
│   │   ├── webhooks.ts        # Webhook system
│   │   └── certificate-service.ts
│   ├── types/                  # TypeScript definitions
│   └── emails/                 # Email templates
├── prisma/
│   └── schema.prisma          # Database schema (1900+ lines)
├── public/                     # Static assets
├── package.json
└── tsconfig.json
```

---

## 3. Database Schema

### Entity Overview (50+ Models)

#### User & Authentication
| Model | Description |
|-------|-------------|
| `User` | Main user model with roles (STUDENT, INSTRUCTOR, MENTOR, ADMIN) |
| `Account` | OAuth provider accounts |
| `Session` | JWT sessions |
| `VerificationToken` | Email verification tokens |
| `PasswordReset` | Password reset tokens |
| `LoginHistory` | Login tracking with device/browser info |

#### Courses & Content
| Model | Description |
|-------|-------------|
| `Course` | Course metadata, pricing, difficulty |
| `Category` | Course categories with icons/colors |
| `Module` | Course sections |
| `Lesson` | Lesson content with video IDs (Wistia) |
| `LessonResource` | Downloadable materials |
| `Tag` | Content tags |
| `CourseReview` | Student reviews with ratings |

#### Enrollment & Progress
| Model | Description |
|-------|-------------|
| `Enrollment` | User course enrollment |
| `LessonProgress` | Lesson completion tracking |
| `ModuleProgress` | Module completion |
| `CourseAnalytics` | Aggregated statistics |
| `Certificate` | Issued certificates |

#### Messaging & Community
| Model | Description |
|-------|-------------|
| `Message` | Direct messages with attachments |
| `MessageReaction` | Emoji reactions |
| `ScheduledVoiceMessage` | Delayed voice delivery |
| `TypingStatus` | Real-time typing indicators |
| `CommunityPost` | Forum posts |
| `PostComment` | Nested comments |
| `PostLike` / `CommentLike` | Engagement tracking |
| `CommentReaction` | Emoji reactions |
| `CategoryCommunity` | Category-based communities |

#### Marketing Automation
| Model | Description |
|-------|-------------|
| `MarketingTag` | User segmentation (STAGE, INTENT, BEHAVIOR, SOURCE, SUPPRESS) |
| `UserMarketingTag` | Tag assignments |
| `Sequence` | Email sequences with triggers |
| `SequenceEmail` | Individual sequence emails |
| `SequenceEnrollment` | Sequence participation |
| `EmailTemplate` | Reusable templates |
| `EmailSend` | Send tracking |
| `EmailEvent` | Open/click/bounce events |
| `EmailAnalytics` | Daily aggregates |

#### Gamification
| Model | Description |
|-------|-------------|
| `Badge` | Achievement badges |
| `UserBadge` | Earned badges |
| `UserStreak` | Daily streaks with XP |

#### Coach CRM
| Model | Description |
|-------|-------------|
| `NicheCoach` | Coach-niche assignments |
| `Client` | Prospect/client profiles |
| `ClientSession` | Coaching sessions |
| `ClientProtocol` | Treatment protocols |
| `ClientTask` | Client homework |
| `MentorSession` | 1:1 mentorship |

#### Marketplace
| Model | Description |
|-------|-------------|
| `Resource` | Resource library |
| `DFYProduct` | Done-For-You products |
| `DFYPurchase` | Purchase records |
| `Ebook` / `EbookChapter` | E-book library |
| `Wishlist` | Course wishlist |

#### Challenges
| Model | Description |
|-------|-------------|
| `Challenge` | 7-day challenges |
| `ChallengeModule` | Daily content |
| `ChallengeEnrollment` | Participation |
| `ChallengeBadge` | Challenge badges |

---

## 4. Authentication System

### Configuration
- **Strategy**: JWT with 30-day expiration
- **Provider**: Credentials (email/password)
- **Password Hashing**: bcryptjs (12 rounds)

### Login Flow
```
1. User submits email/password
2. Password validated against bcrypt hash
3. User stats updated:
   - lastLoginAt
   - firstLoginAt (if first login)
   - loginCount incremented
4. LoginHistory entry created
5. Auto-message triggered for first login
6. Session created with user data
```

### User Roles
| Role | Permissions |
|------|-------------|
| `STUDENT` | Default learner access |
| `INSTRUCTOR` | Course creation & management |
| `MENTOR` | 1:1 mentoring + instructor |
| `ADMIN` | Full system administration |

### Session Data
```typescript
interface Session {
  user: {
    id: string;
    email: string;
    role: UserRole;
    firstName: string;
    lastName: string;
    avatar: string | null;
    isFirstLogin: boolean;
    miniDiplomaCategory: string | null;
  }
}
```

---

## 5. Core Features

### 5.1 Course Management & Learning

**Pages**: `/courses`, `/courses/[slug]`, `/courses/[slug]/learn/[lessonId]`

#### Course Catalog
- Filter by difficulty, category, instructor, duration
- Search functionality
- Wistia video previews
- Wishlist functionality
- Career outlook information

#### Course Structure
```
Course
├── Modules (sections)
│   └── Lessons
│       ├── Video content (Wistia)
│       ├── Rich text content
│       ├── Resources (PDF, DOCX, etc.)
│       └── Progress tracking
└── Certificate on completion
```

#### Lesson Types
- `VIDEO` - Video-based content
- `TEXT` - Rich text lessons
- `QUIZ` - Assessment quizzes
- `ASSIGNMENT` - Practical assignments
- `LIVE_SESSION` - Live sessions

#### Progress Tracking
- Real-time progress (0-100%)
- Lesson completion status
- Module milestones
- Video resume position
- Watch time tracking

### 5.2 Mini-Diploma Freebies (Lead Magnet)

**Pages**: `/free-mini-diploma`, `/my-mini-diploma`

- Self-contained lead generation program
- Categories: functional-medicine, autism, gut-health, etc.
- Certificate generation on completion
- 3-day countdown offer for graduates
- Automatic badge award
- Upsell to full courses

### 5.3 Community & Forums

**Pages**: `/community`, `/community/[id]`

#### Post Features
- Categories: introductions, tips, wins, graduates, questions
- Pin and lock posts (admin)
- View count tracking
- Like/dislike functionality
- Nested comment threads

#### Comment Features
- Reply threading (parent-child)
- Emoji reactions (❤️ 🔥 👏 💯 🎉 💪 ⭐ 🙌)
- Like counts
- Moderation (banned keywords)

#### Sample Data
- Buyer persona comments with realistic engagement
- Static reaction counts (~2000 total per post)
- Students with invisible avatars
- Coach responses with avatar images

### 5.4 Direct Messaging

**Page**: `/messages`

#### Features
- 1:1 conversations
- Message threading/replies
- Read status tracking
- File attachments
- Voice message recording
- AI voice generation (ElevenLabs TTS)
- Emoji reactions
- Message search
- Typing indicators

#### Scheduled Messages
- Schedule for later delivery
- Auto-send via cron jobs
- Retry logic with tracking

#### Auto-Messages
Triggered on events:
- First login
- Course enrollment/completion
- Mini-diploma completion
- 7+ day inactivity
- Pricing page visit
- Sequence milestones

### 5.5 Marketing Automation

**Page**: `/admin/marketing`

#### Marketing Tags
| Category | Examples |
|----------|----------|
| STAGE | mini_started, mini_completed, buyer |
| INTENT | cold, warm, hot |
| BEHAVIOR | email_opener, video_watcher |
| SOURCE | freebie_fm, webinar, referral |
| SUPPRESS | purchased, unsubscribed |

#### Email Sequences
- **Triggers**: TAG_ADDED, USER_REGISTERED, MINI_DIPLOMA_COMPLETED, etc.
- **Scheduling**: Delay days, specific send time
- **Conditions**: Require/skip tags
- **Exit Conditions**: Tag added, reply, link click

#### Email Tracking
- Open tracking with timestamp
- Link click tracking
- Bounce handling
- Complaint tracking
- Daily analytics aggregation

### 5.6 Coach CRM

**Page**: `/coach/workspace`

#### Client Management
- Personal information (DOB, gender, occupation)
- Health profile (concerns, goals, status)
- Health history (conditions, medications, allergies)
- Lifestyle tracking (diet, sleep, exercise, stress)

#### Session Management
- Schedule coaching sessions
- Session types: Initial, Follow-up, Check-in
- Duration and notes tracking
- Next session scheduling

#### Protocols & Tasks
- Custom treatment protocols
- Protocol steps (JSON stored)
- Client homework assignments
- Due dates and priorities
- Completion tracking

### 5.7 Gamification

**Pages**: `/achievements`, `/gamification`

#### Badges
- Achievement-based badges
- Custom icons and colors
- Points per badge
- Earning criteria

#### Streaks
- Daily activity tracking
- Current streak counter
- Longest streak record
- XP accumulation

#### XP Awards
- Lesson completion
- Course completion
- Badge earning
- First lesson bonus

### 5.8 7-Day Challenges

**Pages**: `/challenges`, `/challenges/[slug]`

#### Structure
- Daily modules with video content
- Unlock time (8:00 AM default)
- Action tasks per day
- Community discussion prompts

#### Progress
- Enrollment date tracking
- Daily completion tracking
- Challenge badges (day 0, day 7)
- Requires mini-diploma completion

### 5.9 Certificates

**Pages**: `/certificates`, `/verify/[certificateNumber]`

#### Generation
- Canvas-based rendering
- PDF export (jsPDF)
- Professional template design
- Unique certificate numbers

#### Types
- `COMPLETION` - Course completion
- `CERTIFICATION` - Professional cert
- `MINI_DIPLOMA` - Lead magnet graduates

#### Verification
- Public verification pages
- Shareable URLs
- Certificate data display

### 5.10 Admin Dashboard

**Pages**: `/admin/*`

#### Features
- Analytics dashboard (users, courses, enrollments)
- Course builder with drag-and-drop
- User management
- Email template management
- Bulk email/DM campaigns
- Marketing sequence management
- System settings

### 5.11 DFY Marketplace

**Pages**: `/dfy-resources`, `/programs`

#### Product Types
- CORE_PROGRAM (4-week to 6-month)
- SPECIALTY_KIT (Detox, Gut Reset, etc.)
- BUNDLE (Multiple products)
- TEMPLATE_PACK (Forms, worksheets)
- MARKETING_KIT (Social, email templates)
- EBOOK

#### Features
- Pricing with compare-at prices
- Category organization
- File downloads (PDF, DOCX, Canva)
- Purchase tracking
- Access level restrictions

---

## 6. API Reference

### Authentication (5 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/register-freebie` | Register for mini-diploma |
| POST | `/api/auth/forgot-password` | Initiate password reset |
| POST | `/api/auth/reset-password` | Complete password reset |
| GET/POST | `/api/auth/[...nextauth]` | NextAuth handler |

### Courses (7 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/courses/enroll` | Enroll in course |
| GET | `/api/courses/[courseId]/resources` | Get course resources |
| GET | `/api/certificates/grid` | Get certificates grid |
| POST | `/api/certificates/generate` | Generate certificate PDF |

### Progress (4 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/progress/update` | Update lesson watch time |
| POST | `/api/progress/complete` | Mark lesson complete |
| POST | `/api/progress/uncomplete` | Unmark completion |
| POST | `/api/mini-diploma/complete` | Complete mini-diploma |

### Messages (8 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/messages` | Get/send messages |
| POST | `/api/messages/read` | Mark as read |
| POST | `/api/messages/reactions` | Add reaction |
| GET | `/api/messages/search` | Search messages |
| POST | `/api/messages/typing` | Typing status |
| GET | `/api/messages/templates` | Get templates |
| GET/POST | `/api/messages/scheduled` | Scheduled messages |

### Community (5 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/community` | Create post |
| POST | `/api/community/comments` | Create comment |
| POST | `/api/community/like` | Like post |
| POST | `/api/community/comment-like` | Like comment |
| POST | `/api/community/comment-reaction` | React to comment |

### Challenges (3 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/challenges` | List challenges |
| GET | `/api/challenges/[id]` | Get challenge |
| POST | `/api/challenges/[id]/progress` | Update progress |

### Admin - Marketing (11 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST/PUT | `/api/admin/marketing/sequences` | Sequence CRUD |
| GET/POST | `/api/admin/marketing/sequences/[id]/emails` | Sequence emails |
| PUT/DELETE | `/api/admin/marketing/sequences/[id]/emails/[emailId]` | Email CRUD |
| POST | `/api/admin/marketing/sequences/[id]/enroll` | Enroll user |
| GET | `/api/admin/marketing/sequences/[id]/enrollments` | View enrollments |
| POST | `/api/admin/marketing/sequences/[id]/test` | Test sequence |
| GET/POST/PUT/DELETE | `/api/admin/marketing/tags` | Tag CRUD |

### Coach (8 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET/POST | `/api/coach/clients` | Client CRUD |
| GET/PUT | `/api/coach/clients/[id]` | Client details |
| PUT | `/api/coach/clients/[id]/health` | Health profile |
| PUT | `/api/coach/clients/[id]/notes` | Client notes |
| POST/GET | `/api/coach/clients/[id]/assessments` | Assessments |

### AI (3 endpoints)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ai/chat` | Stream Claude AI |
| POST | `/api/ai/suggest-reply` | AI reply suggestion |
| POST | `/api/ai/tts` | Text-to-speech |

---

## 7. Key Components

### Course Components
| Component | Location | Purpose |
|-----------|----------|---------|
| `CourseCatalogFilters` | `/components/courses/` | Course filtering & display |
| `CoursePlayer` | `/components/courses/` | Video player with progress |
| `LessonNavigation` | `/components/courses/` | Lesson sidebar |
| `ResourceDownloader` | `/components/courses/` | File downloads |

### Community Components
| Component | Location | Size | Purpose |
|-----------|----------|------|---------|
| `CommunityClient` | `/components/community/` | ~50KB | Main feed |
| `PostDetailClient` | `/components/community/` | ~109KB | Post detail |
| `CreatePostDialog` | `/components/community/` | - | Post creation |

### Messaging Components
| Component | Location | Size | Purpose |
|-----------|----------|------|---------|
| `MessagesClient` | `/components/messages/` | ~90KB | Chat interface |

### Coach Components
| Component | Location | Size | Purpose |
|-----------|----------|------|---------|
| `WorkspaceClient` | `/components/coach/` | ~201KB | CRM dashboard |

### UI Components (shadcn/ui)
- Avatar, Badge, Button, Card
- Checkbox, Dialog, Dropdown Menu
- Input, Label, Progress
- Select, Switch, Tabs
- Toast, Tooltip

---

## 8. Services & Utilities

### Email Service (`lib/email.ts`)
```typescript
// Branded email wrapper
sendBrandedEmail({
  to: string,
  subject: string,
  content: string,
  preheader?: string
})

// Personal marketing email
sendPersonalEmail({
  to: string,
  subject: string,
  content: string,
  fromName?: string
})
```

### Auto Messages (`lib/auto-messages.ts`)
```typescript
// Triggers
type AutoMessageTrigger =
  | 'first_login'
  | 'enrollment'
  | 'course_complete'
  | 'inactive_7d'
  | 'mini_diploma_complete'
  | 'pricing_page_visit'
  | 'sequence_day_5'
  | 'sequence_day_10'
  // ...

triggerAutoMessage(trigger: AutoMessageTrigger, userId: string)
```

### AI Integration (`lib/ai.ts`)
```typescript
// Claude AI chat
streamAIResponse({
  messages: Message[],
  context: {
    userName: string,
    userRole: string,
    currentCourse?: string,
    currentLesson?: string
  }
})
```

### Text-to-Speech (`lib/elevenlabs.ts`)
```typescript
generateVoice({
  text: string,
  voiceId?: string
}): Promise<{
  audio: string, // base64
  duration: number
}>
```

### Webhooks (`lib/webhooks.ts`)
```typescript
triggerWebhook(event: WebhookEvent, payload: object)

type WebhookEvent =
  | 'enrollment.created'
  | 'lesson.completed'
  | 'course.completed'
  | 'certificate.issued'
```

### Certificate Service (`lib/certificate-service.ts`)
```typescript
generateCertificate({
  userId: string,
  courseId: string,
  type: CertificateType
}): Promise<Certificate>
```

---

## 9. External Integrations

### Resend (Email)
- Marketing emails
- Transactional emails
- Webhook events (open, click, bounce)
- Template management

### Wistia (Video)
- Video hosting
- Embedded player
- Progress tracking
- Video thumbnails

### ElevenLabs (Voice)
- Text-to-speech generation
- Multiple voice options
- Audio file storage (Supabase)

### Supabase
- PostgreSQL database
- File storage (audio, attachments)
- Real-time subscriptions (optional)

### Anthropic Claude
- AI chat assistant
- Reply suggestions
- Content generation

### NeverBounce
- Email validation
- Bounce prevention
- List cleaning

---

## 10. Environment Configuration

### Required Variables
```env
# Database
DATABASE_URL=postgresql://...

# Authentication
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key

# Email
RESEND_API_KEY=re_...
FROM_EMAIL=hello@yourdomain.com

# Video
WISTIA_API_TOKEN=your-token

# AI
ANTHROPIC_API_KEY=sk-ant-...

# Storage
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-key

# Voice
ELEVENLABS_API_KEY=your-key

# Email Validation
NEVERBOUNCE_API_KEY=your-key
```

### Optional Variables
```env
# Alternative AI
OPENAI_API_KEY=sk-...

# Analytics
GOOGLE_ANALYTICS_ID=G-...

# Error Tracking
SENTRY_DSN=https://...
```

---

## 11. Deployment

### Recommended Stack
| Component | Service |
|-----------|---------|
| Hosting | Vercel |
| Database | Supabase PostgreSQL |
| File Storage | Supabase Storage |
| Email | Resend |
| Video | Wistia |

### Build Commands
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Build for production
npm run build

# Start production server
npm start
```

### Environment Setup
1. Create Supabase project
2. Set up Resend account
3. Configure Wistia project
4. Get API keys for AI services
5. Configure environment variables
6. Deploy to Vercel

### Database Migrations
```bash
# Create migration
npx prisma migrate dev --name migration_name

# Apply to production
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

---

## Summary

AccrediPro LMS is a full-featured educational platform with:

- **Course Delivery**: Video-based courses with progress tracking and certificates
- **Lead Generation**: Mini-diploma freebies with upsell funnel
- **Community**: Forum with posts, comments, and reactions
- **Messaging**: Real-time chat with voice messages and AI
- **Marketing**: Email sequences with automated triggers
- **Gamification**: Badges, streaks, and XP system
- **Coach CRM**: Client management for practitioners
- **Marketplace**: DFY products and resources
- **Admin Tools**: Full course builder and analytics

The platform is built on modern technologies (Next.js 16, React 19, Prisma 7) with a focus on scalability, security, and user engagement.

---

*Documentation generated: December 2024*
*Version: 1.0.0*
