# Mini Diploma ID System

## Overview

The Mini Diploma system uses a structured ID system to track students throughout their journey from enrollment to certification.

---

## ID Types

### 1. Student ID (STU-XXXXXX)

**Format:** `STU-{last6chars}`

**Source:** Derived from the user's database ID (last 6 characters, uppercase)

**Example:** `STU-AWLKOP`

**Usage:**
- Displayed on student profile page
- Shown during exam process
- Used in certificate generation
- Customer support reference

**Generation:**
```typescript
function generateStudentId(userId: string): string {
    const hash = userId.slice(-6).toUpperCase();
    return `STU-${hash}`;
}
```

---

### 2. Application ID (APP-FM-YYYYMMDD)

**Format:** `APP-{niche}-{date}`

**Components:**
- `APP` - Application prefix
- `{niche}` - Mini diploma type (FM = Functional Medicine, WH = Women's Health, GH = Gut Health)
- `{date}` - Enrollment date in YYYYMMDD format

**Example:** `APP-FM-20260115`

**Usage:**
- Enrollment tracking
- Customer support reference
- Shown on profile page

**Generation:**
```typescript
function generateApplicationId(createdAt: Date, niche: string = 'FM'): string {
    const dateStr = `${createdAt.getFullYear()}${String(createdAt.getMonth() + 1).padStart(2, '0')}${String(createdAt.getDate()).padStart(2, '0')}`;
    return `APP-${niche}-${dateStr}`;
}
```

---

### 3. Exam ID (FM-YYYYMMDD-XXXXXX)

**Format:** `{niche}-{date}-{examIdHash}`

**Components:**
- `{niche}` - Mini diploma type (FM, WH, GH)
- `{date}` - Exam date in YYYYMMDD format
- `{examIdHash}` - Last 6 characters of database exam ID, uppercase

**Example:** `FM-20260117-4U7FRW`

**Usage:**
- Exam results reference
- Scholarship qualification proof
- Certificate verification
- Shown on profile and results pages

**Generation:**
```typescript
function generateExamId(examCreatedAt: Date, examDbId: string): string {
    const dateStr = examCreatedAt.toISOString().slice(0, 10).replace(/-/g, '');
    const hash = examDbId.slice(-6).toUpperCase();
    return `FM-${dateStr}-${hash}`;
}
```

---

### 4. Scholarship Coupon Code (ASI-XXXXXXXX)

**Format:** `ASI-{random8chars}`

**Components:**
- `ASI` - AccrediPro Standards Institute prefix
- `{random8chars}` - 8-character nanoid, uppercase

**Example:** `ASI-K7M2P9QX`

**Usage:**
- Checkout discount application
- Scholarship tracking
- 24-hour expiration from generation

**Generation:**
```typescript
import { nanoid } from 'nanoid';

function generateCouponCode(): string {
    return `ASI-${nanoid(8).toUpperCase()}`;
}
```

---

### 5. Cohort Number

**Format:** `#{weekNumber}`

**Calculation:** Weeks since January 1, 2024

**Example:** `#107` (Week 107 since Jan 1, 2024)

**Usage:**
- Student grouping
- Community building
- Marketing (urgency/scarcity)

**Calculation:**
```typescript
const cohortNumber = Math.floor(
    (Date.now() - new Date("2024-01-01").getTime()) /
    (7 * 24 * 60 * 60 * 1000)
) + 1;
```

---

## Where IDs Are Displayed

### Profile Page (`/functional-medicine-diploma/profile`)
- Student ID (STU-XXXXXX)
- Application ID (APP-FM-YYYYMMDD)
- Cohort Number
- Exam ID (if exam taken)
- Coupon Code (if scholarship qualified)

### Exam Component
- Exam ID (generated on mount)
- Student ID
- Displayed in header and footer during exam

### Results Page
- Final Score
- Exam ID
- Student ID
- Scholarship Coupon (if qualified)

### Certificate
- Student ID
- Exam ID
- Completion Date
- Certificate Number (separate system)

---

## Database Models

### MiniDiplomaExam
```prisma
model MiniDiplomaExam {
  id                    String    @id @default(cuid())
  userId                String
  category              String    // fm-healthcare, womens-health, gut-health
  score                 Int
  correctAnswers        Int
  totalQuestions        Int
  passed                Boolean   @default(false)
  scholarshipQualified  Boolean   @default(false)
  answers               Json
  attemptNumber         Int       @default(1)
  scholarshipCouponCode String?   @unique
  scholarshipExpiresAt  DateTime?
  scholarshipClaimedAt  DateTime?
  createdAt             DateTime  @default(now())
}
```

### ScholarshipSpot
```prisma
model ScholarshipSpot {
  id         String   @id @default(cuid())
  month      Int      // 1-12
  year       Int      // 2024, 2025, etc.
  category   String   // fm-healthcare, womens-health, etc.
  totalSpots Int      @default(3)
  usedSpots  Int      @default(0)
  claimedBy  String[] // Array of user IDs

  @@unique([month, year, category])
}
```

---

## Scholarship System

### Qualification
- Score 95% or higher on final exam (currently all users score 95-100)
- Everyone qualifies for scholarship

### Monthly Spots
- 3 spots available per month per category
- Real scarcity tracking
- Resets on 1st of each month

### Coupon Expiration
- 24 hours from exam completion
- Displayed countdown on completion page

---

## API Endpoints

### Submit Exam
`POST /api/mini-diploma/exam/submit`

**Request:**
```json
{
  "examType": "fm-healthcare",
  "answers": { "1": "c", "2": "b", ... }
}
```

**Response:**
```json
{
  "success": true,
  "score": 97,
  "correct": 10,
  "total": 10,
  "passed": true,
  "scholarshipQualified": true,
  "attemptNumber": 1,
  "couponCode": "ASI-K7M2P9QX",
  "expiresAt": "2026-01-18T14:30:00.000Z",
  "spotsRemaining": 2
}
```

### Get Exam History
`GET /api/mini-diploma/exam/submit?category=fm-healthcare`

**Response:**
```json
{
  "attempts": 1,
  "bestScore": 97,
  "hasPassed": true,
  "hasScholarship": true,
  "activeCoupon": {
    "code": "ASI-K7M2P9QX",
    "expiresAt": "2026-01-18T14:30:00.000Z"
  },
  "spotsRemaining": 2,
  "exams": [...]
}
```

---

## Future Considerations

1. **Certificate Verification API** - Public endpoint to verify certificate/exam IDs
2. **QR Codes** - Generate QR codes linking to verification
3. **ID History** - Track ID changes if user data updates
4. **Cross-Diploma IDs** - Unified student ID across multiple mini diplomas
