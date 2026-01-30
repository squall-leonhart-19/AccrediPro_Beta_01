# Adding a New Mini Diploma: Complete Automation Checklist

**Purpose:** Complete step-by-step guide for Ralph + code automation when adding a new mini diploma.

---

## 📋 DIPLOMA SPEC (Fill First)

```yaml
diploma_name: "Example Coaching"
course_slug: "example-coaching-mini-diploma"
portal_slug: "example-coaching"
display_name: "Certified Example Coach"
tag_prefix: "example-coaching"
exam_category: "example-coaching-exam"
checkout_url: "https://buy.stripe.com/..."
meta_pixel_id: ""
brand_colors:
  primary: "#722f37"
  accent: "#d4af37"
```

---

## 1. REGISTRY CONFIGURATION

**File:** `src/lib/mini-diploma-registry.ts`

### 1.1 Lesson Definitions
```typescript
const EXAMPLE_COACHING_LESSONS: DiplomaLesson[] = [
    { id: 1, title: "Lesson 1 Title", module: 1 },
    { id: 2, title: "Lesson 2 Title", module: 1 },
    { id: 3, title: "Lesson 3 Title", module: 1 },
    { id: 4, title: "Lesson 4 Title", module: 2 },
    { id: 5, title: "Lesson 5 Title", module: 2 },
    { id: 6, title: "Lesson 6 Title", module: 2 },
    { id: 7, title: "Lesson 7 Title", module: 3 },
    { id: 8, title: "Lesson 8 Title", module: 3 },
    { id: 9, title: "Your Next Step", module: 3 },
];
```

### 1.2 Registry Entry
```typescript
"example-coaching-mini-diploma": {
    name: "Example Coaching",
    slug: "example-coaching-mini-diploma",
    portalSlug: "example-coaching",
    displayName: "Certified Example Coach",
    lessons: EXAMPLE_COACHING_LESSONS,
    checkoutUrl: "https://buy.stripe.com/...",
    examCategory: "example-coaching-exam",
    lessonTagPrefix: "example-coaching-lesson-complete",
    nurtureSequence: EXAMPLE_COACHING_NURTURE_SEQUENCE, // or fallback
    dmSequence: EXAMPLE_COACHING_DMS, // or fallback
    nudgePrefix: "example-coaching-nudge",
    nurturePrefix: "example-coaching-nurture",
    completionTag: "example-coaching-mini-diploma:completed"
}
```

**Checklist:**
- [ ] Create lesson array with 9 lessons (3 per module)
- [ ] Add to `MINI_DIPLOMA_REGISTRY`
- [ ] Import sequences at top of file

---

## 2. DM SEQUENCES (In-App Sarah Messages)

**Create:** `src/lib/example-coaching-dms.ts`

### 2.1 Interface
```typescript
export interface SarahDM {
    id: string;
    type: "time_based" | "lesson_complete" | "behavioral";
    day?: number;
    lessonNumber?: number;
    condition?: string;
    text: string;
    voiceScript: string | null;
    hasVoice: boolean;
}
```

### 2.2 DM Schedule (60-day sequence)
| Phase | Days | Purpose | DM Count |
|-------|------|---------|----------|
| Welcome | 0 | Personal intro + voice | 1 (with audio) |
| Value | 1-7 | Educational tips, secret tip | 7 |
| Desire | 8-20 | Social proof, pod visualizations | 12 |
| Decision | 21-45 | Objection handling, pricing, testimonials | 20+ |
| Urgency | 46-60 | Final push, last chance | 10+ |

### 2.3 Required DMs
- [ ] Day 0: Welcome (ONLY one with voice)
- [ ] Day 1-7: Educational value content
- [ ] Day 6: "Secret tip" DM (exclusivity)
- [ ] Day 9: Income screenshot reference
- [ ] Day 12, 18: Pod visualization (social proof)
- [ ] Day 16: Objection crusher
- [ ] Day 25: Full value breakdown
- [ ] Day 26: ROI math
- [ ] Day 30+: Urgency triggers

**OR use fallback:**
```typescript
import { HEALTH_COACH_DMS } from "./health-coach-dms";
// then use HEALTH_COACH_DMS as fallback
```

---

## 3. NURTURE EMAIL SEQUENCE (60-day)

**Create:** `src/lib/example-coaching-nurture-60-day.ts`

### 3.1 Email Interface
```typescript
export interface NurtureEmail {
    day: number;
    subject: string;
    preheader: string;
    body: string;
    cta?: { text: string; url: string };
    tag?: string;
}
```

### 3.2 Email Schedule
| Day | Email Type | Subject Pattern |
|-----|------------|-----------------|
| 0 | Welcome | "Welcome! Start your Mini Diploma" |
| 1 | Reminder | "You haven't started yet..." |
| 2 | Value | Educational insight |
| 3-7 | Value + nudge | Mixed content |
| 8-14 | Social proof | Success stories |
| 15-30 | Offer introduction | Scholarship/certification |
| 31-60 | Urgency | Last chance, expiring |

**OR use fallback:**
```typescript
import { HEALTH_COACH_NURTURE_SEQUENCE } from "./health-coach-nurture-60-day";
```

---

## 4. TAGS & TRACKING

### 4.1 Tag Schema
| Tag | Format | Example |
|-----|--------|---------|
| Lesson completion | `{lessonTagPrefix}:{lesson-id}` | `example-coaching-lesson-complete:3` |
| Diploma completion | `{completionTag}` | `example-coaching-mini-diploma:completed` |
| Nudge sent | `{nudgePrefix}:{day}` | `example-coaching-nudge:5` |
| Nurture sent | `{nurturePrefix}:{day}` | `example-coaching-nurture:7` |

### 4.2 Registry Entries
- [ ] `lessonTagPrefix`: `"example-coaching-lesson-complete"`
- [ ] `completionTag`: `"example-coaching-mini-diploma:completed"`
- [ ] `nudgePrefix`: `"example-coaching-nudge"`
- [ ] `nurturePrefix`: `"example-coaching-nurture"`

### 4.3 Meta Pixel (Optional)
**File:** `src/components/tracking/meta-pixel.ts`
- [ ] Add to `PIXEL_CONFIG` if using separate ad account

---

## 5. API CONFIGURATION

**File:** `src/app/api/mini-diploma/optin/route.ts`

| Location | What to Add | Example |
|----------|-------------|---------|
| `COURSE_SLUGS` | Course slug mapping | `"example-coaching": "example-coaching-mini-diploma"` |
| `COACH_EMAILS` | Coach email | `"example-coaching": "sarah_womenhealth@accredipro-certificate.com"` |
| `WELCOME_MESSAGES` | Text + voiceScript | Personalized welcome |
| `getCertificationDisplayName()` | Display name | `"example-coaching": "Example Coaching"` |
| `nicheNames` | Email niche name | `"example-coaching": "Example Coaching"` |

**Checklist:**
- [ ] Added to `COURSE_SLUGS`
- [ ] Added to `COACH_EMAILS`
- [ ] Added to `WELCOME_MESSAGES`
- [ ] Added to `getCertificationDisplayName()`
- [ ] Added to `nicheNames`

---

## 6. AUTH REDIRECT

**File:** `src/app/api/auth/get-redirect/route.ts`

```typescript
const miniDiplomaMap: Record<string, string> = {
    // ... existing
    "example-coaching-mini-diploma": "example-coaching",
};
```

- [ ] Added to `miniDiplomaMap`

---

## 7. OPT-IN LANDING PAGE

**Create:** `src/app/(public)/example-coaching-mini-diploma/page.tsx`

### 7.1 Required Sections
- [ ] Urgency bar with countdown
- [ ] Hero with value prop
- [ ] Opt-in form (firstName, lastName, email)
- [ ] Coach Sarah section
- [ ] 3 testimonials (no AI avatars)
- [ ] Guarantee section
- [ ] Career path section
- [ ] Certificate preview
- [ ] "This is for you if" section
- [ ] 9 lessons overview
- [ ] Value stack
- [ ] FAQ section (6+)
- [ ] Final CTA
- [ ] Footer with disclaimers
- [ ] FloatingChatWidget

### 7.2 Form Submission
```typescript
// Submit to API
const response = await fetch("/api/mini-diploma/optin", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        firstName,
        lastName,
        email,
        course: "example-coaching",  // ← must match COURSE_SLUGS key
    }),
});

// Auto-login
const result = await signIn("credentials", {
    email: email.toLowerCase(),
    password: "coach2026",  // Default lead password
    redirect: false,
});

// Redirect to portal
window.location.href = "/portal/example-coaching";
```

---

## 8. NEXT.JS CONFIG

**File:** `next.config.ts`

```typescript
const diplomaSlugs = [
    // ... existing
    'example-coaching',
];
```

- [ ] Added to `diplomaSlugs` array

---

## 9. DATABASE

### 9.1 Course Entry
```sql
INSERT INTO "Course" (id, title, slug, description, price, status)
VALUES (
    'cm...',  -- generate cuid
    'Example Coaching Mini Diploma',
    'example-coaching-mini-diploma',
    'Free mini diploma...',
    0,  -- free
    'published'
);
```

### 9.2 Exam Questions
- [ ] Create exam questions for `examCategory`
- [ ] Set pass threshold (typically 70%)

---

## 10. STRIPE CHECKOUT

- [ ] Create Stripe Product for full certification
- [ ] Create Checkout Link
- [ ] Add link to `checkoutUrl` in registry

---

## 11. TESTING CHECKLIST

### Local
- [ ] Dev server runs without errors
- [ ] Opt-in form submits successfully
- [ ] Auto-login works after opt-in
- [ ] Redirects to `/portal/example-coaching`
- [ ] All 9 lessons display correctly
- [ ] Lesson completion tracking fires tags
- [ ] DMs appear in chat after trigger times
- [ ] Certificate generates with correct name
- [ ] Career roadmap shows correct checkout URL
- [ ] Chat/AI assistant responds

### Production
- [ ] Deploy changes
- [ ] Test opt-in flow end-to-end
- [ ] Verify Meta Pixel fires
- [ ] Check email delivery
- [ ] Monitor error logs

---

## 📁 FILES TO CREATE/MODIFY

| Action | File |
|--------|------|
| MODIFY | `src/lib/mini-diploma-registry.ts` |
| CREATE | `src/lib/example-coaching-dms.ts` (optional) |
| CREATE | `src/lib/example-coaching-nurture-60-day.ts` (optional) |
| MODIFY | `src/app/api/mini-diploma/optin/route.ts` |
| MODIFY | `src/app/api/auth/get-redirect/route.ts` |
| CREATE | `src/app/(public)/example-coaching-mini-diploma/page.tsx` |
| MODIFY | `next.config.ts` |
| DB | Create course entry |
| STRIPE | Create checkout link |

---

## 🔄 QUICK START (Minimum Viable)

If using fallback sequences (no custom DMs/emails):

1. Add lessons to registry
2. Add config to registry (use `HEALTH_COACH_*` as fallback sequences)
3. Add to optin API (5 locations)
4. Add to auth get-redirect
5. Create opt-in landing page
6. Add to next.config
7. Create course in DB
8. Create Stripe checkout link
9. Test!

**Estimated time:** 2-4 hours for MVP
