# AccrediPro Certification Launch System

> Complete pipeline for launching new certifications from content generation to delivery.

---

## 📋 Overview

Each certification launch follows a standardized pipeline:

```
CONFIG → GENERATE → SEED → WEBHOOK → EMAILS → LIVE
```

---

## 🗂️ Phase 1: Configuration

### Master Config File
Location: `/config/certifications.json`

```json
{
  "narc-recovery-coach": {
    "name": "Certified Narcissistic Abuse Recovery Coach™",
    "short_name": "NARC Recovery Coach",
    "methodology": {
      "acronym": "NARC",
      "full_name": "The N.A.R.C. Recovery Method™",
      "letters": ["Navigate", "Acknowledge", "Rebuild", "Claim"]
    },
    "pixel": "mental-health",
    "category": "Mental Health & Trauma",
    
    "products": {
      "certification": {
        "sku": "narc-certification",
        "cf_product_id": "narc-certification",
        "slug": "narc-recovery-coach-certification",
        "price": 97,
        "tag": "narc_certification_purchased",
        "tier": "L1",
        "modules": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
      },
      "pro_accelerator": {
        "sku": "narc-pro-accelerator",
        "cf_product_id": "narc-pro-accelerator",
        "price": 397,
        "tag": "narc_pro_purchased",
        "courses": [
          {
            "slug": "narc-pro-advanced-clinical",
            "tier": "L2",
            "modules": [16, 17, 18, 19, 20, 21, 22, 23]
          },
          {
            "slug": "narc-pro-master-depth",
            "tier": "L3", 
            "modules": [24, 25, 26, 27, 28, 29]
          },
          {
            "slug": "narc-pro-practice-path",
            "tier": "L4",
            "modules": [30, 31, 32, 33, 34, 35, 36]
          }
        ]
      }
    },
    
    "folder_structure": {
      "base": "/courses/narc-recovery-coach/",
      "tiers": {
        "L1": "01_Foundation",
        "L2": "02_Advanced_Clinical", 
        "L3": "03_Master_Depth",
        "L4": "04_Practice_Path"
      }
    },
    
    "emails": {
      "welcome": "certification-welcome",
      "reminder_24h": "reminder-start-course",
      "progress_nudge": "progress-reminder",
      "certificate": "certificate-ready",
      "pro_pitch": "pro-accelerator-pitch"
    }
  }
}
```

---

## 📦 Phase 2: Content Generation

### Generator Command
```bash
cd tools/course-generator
python turbo_generator.py "Narcissistic Abuse Recovery Coach"
```

### Output Structure
```
/courses/narc-recovery-coach/
├── 01_Foundation/           # L1: Main Certification (Modules 0-15)
│   ├── Module_00/
│   ├── Module_01/
│   └── ...Module_15/
├── 02_Advanced_Clinical/    # L2: Pro Accelerator (Modules 16-23)
│   ├── Module_16/
│   └── ...Module_23/
├── 03_Master_Depth/         # L3: Pro Accelerator (Modules 24-29)
│   ├── Module_24/
│   └── ...Module_29/
├── 04_Practice_Path/        # L4: Pro Accelerator (Modules 30-36)
│   ├── Module_30/
│   └── ...Module_36/
├── Final_Exam/
├── course_blueprint.json
└── methodology.json
```

### Lesson Naming Convention
```
Lesson_{module}.{lesson}_{Title}.html

Examples:
Lesson_1.1_The_Spectrum_of_Narcissism.html
Lesson_1.2_The_Anatomy_of_Abuse.html
```

---

## 🗄️ Phase 3: Database Seeding

### Seeder Script
Location: `/prisma/seed-certification.ts`

```bash
npx ts-node prisma/seed-certification.ts narc-recovery-coach
```

### What Gets Created in Prisma:

| Table | Records Created |
|-------|-----------------|
| `Category` | 1 (if new) |
| `Course` | 4 (main + 3 pro) |
| `Module` | 37 total |
| `Lesson` | ~292 total |
| `CourseTag` | Tags for filtering |

### Course Records:

| Slug | Title | Certificate Type |
|------|-------|------------------|
| `narc-recovery-coach-certification` | Certified Narcissistic Abuse Recovery Coach™ | CERTIFICATION |
| `narc-pro-advanced-clinical` | NARC Pro: Advanced Clinical | COMPLETION |
| `narc-pro-master-depth` | NARC Pro: Master Depth | COMPLETION |
| `narc-pro-practice-path` | NARC Pro: Practice Path | COMPLETION |

---

## 🔗 Phase 4: Webhook Configuration

### Product Mapping
Location: `/src/app/api/webhooks/clickfunnels/route.ts`

```typescript
const PRODUCT_COURSE_MAP: Record<string, string | string[]> = {
  // NARC Recovery Coach
  "narc-certification": "narc-recovery-coach-certification",
  "narc_certification": "narc-recovery-coach-certification",
  
  "narc-pro-accelerator": [
    "narc-pro-advanced-clinical",
    "narc-pro-master-depth", 
    "narc-pro-practice-path"
  ],
  "narc_pro_accelerator": [
    "narc-pro-advanced-clinical",
    "narc-pro-master-depth",
    "narc-pro-practice-path"
  ],
};

const PRODUCT_PRICES: Record<string, number> = {
  "narc-certification": 97,
  "narc-pro-accelerator": 397,
};

const PRODUCT_NAMES: Record<string, string> = {
  "narc-certification": "NARC Recovery Coach Certification",
  "narc-pro-accelerator": "NARC Pro Accelerator",
};
```

---

## 📧 Phase 5: Email Sequences

### Automated Emails

| Email | Trigger | Template | Variables |
|-------|---------|----------|-----------|
| **Welcome** | Purchase webhook | `certification-welcome` | `{firstName}`, `{courseName}`, `{loginUrl}` |
| **24h Reminder** | 24h after signup, no login | `reminder-start-course` | `{firstName}`, `{courseName}` |
| **Progress Nudge** | 3 days inactive | `progress-reminder` | `{firstName}`, `{progress}%`, `{nextLesson}` |
| **Certificate Ready** | Course completed | `certificate-ready` | `{firstName}`, `{courseName}`, `{certificateUrl}` |
| **Pro Pitch** | 7 days after cert, no Pro | `pro-accelerator-pitch` | `{firstName}`, `{proPrice}` |

### Email Templates Location
```
/src/lib/email-templates/
├── certification-welcome.tsx
├── reminder-start-course.tsx
├── progress-reminder.tsx
├── certificate-ready.tsx
└── pro-accelerator-pitch.tsx
```

---

## 🏷️ Tags & Tracking

### User Tags Applied

| Event | Tag Applied |
|-------|-------------|
| Certification Purchase | `{slug}_certification_purchased` |
| Pro Accelerator Purchase | `{slug}_pro_purchased` |
| Any ClickFunnels Purchase | `clickfunnels_purchase` |
| Certificate Earned | `{slug}_certified` |
| Pro Completed | `{slug}_pro_complete` |

### Example for NARC:
```
narc_certification_purchased
narc_pro_purchased
narc_certified
clickfunnels_purchase
```

---

## ✅ Launch Checklist

### Pre-Launch (Internal)
- [ ] Config added to `certifications.json`
- [ ] Course generated (`turbo_generator.py`)
- [ ] Courses seeded to database
- [ ] Webhook mapping added
- [ ] Email templates configured
- [ ] Certificate template created

### ClickFunnels Setup
- [ ] Product created with correct SKU
- [ ] Webhook URL configured: `https://learn.accredipro.academy/api/webhooks/clickfunnels`
- [ ] Price set correctly
- [ ] Checkout page live

### Meta Ads Setup
- [ ] Correct pixel assigned
- [ ] Sales page has pixel code
- [ ] CAPI configured for purchases

### Testing
- [ ] Test purchase → user created
- [ ] Test purchase → enrollment created
- [ ] Test purchase → welcome email sent
- [ ] Test purchase → Meta event fired
- [ ] Test completion → certificate generated

---

## 📊 Nomenclature Registry

### 8-Pixel Launch Certifications

| Certification | Slug | CF SKU | Tag | Pixel | Price |
|--------------|------|--------|-----|-------|-------|
| Narcissistic Abuse Recovery Coach | `narc-recovery-coach` | `narc-certification` | `narc_purchased` | Mental Health | $97 |
| Christian Life Coach | `christian-life-coach` | `christian-certification` | `christian_purchased` | Faith | $97 |
| Life Coach | `life-coach` | `life-certification` | `life_purchased` | Life Coaching | $97 |
| Grief & Loss Coach | `grief-loss-coach` | `grief-certification` | `grief_purchased` | Mental Health | $97 |
| Energy Healing Practitioner | `energy-healing` | `energy-certification` | `energy_purchased` | Spiritual | $97 |
| Conscious Parenting Coach | `conscious-parenting` | `parenting-certification` | `parenting_purchased` | Parenting | $97 |
| Pet Wellness Coach | `pet-wellness` | `pet-certification` | `pet_purchased` | Pet | $97 |
| LGBTQ+ Affirming Life Coach | `lgbtq-life-coach` | `lgbtq-certification` | `lgbtq_purchased` | Life Coaching | $97 |

### Pro Accelerator (Same for All)
- **SKU Pattern:** `{slug}-pro-accelerator`
- **Price:** $397
- **Tag:** `{slug}_pro_purchased`
- **Courses:** 3 per certification (Advanced, Master, Practice)

---

## 🔄 Automation Scripts

| Script | Purpose | Command |
|--------|---------|---------|
| `turbo_generator.py` | Generate course content | `python turbo_generator.py "Course Name"` |
| `seed-certification.ts` | Seed courses to DB | `npx ts-node prisma/seed-certification.ts {slug}` |
| `add-webhook-mapping.ts` | Add product mapping | `npx ts-node scripts/add-webhook-mapping.ts {slug}` |
| `setup-emails.ts` | Configure email sequence | `npx ts-node scripts/setup-emails.ts {slug}` |

---

## 🚀 Quick Launch Command (Future)

```bash
# One command to launch entire certification
npm run launch-cert narc-recovery-coach

# This will:
# 1. Validate config exists
# 2. Check course files generated
# 3. Seed to database
# 4. Add webhook mapping
# 5. Setup email sequences
# 6. Run test purchase
# 7. Report ready status
```

---

## 📁 File Structure

```
/accredipro-lms/
├── config/
│   └── certifications.json          # Master config
├── courses/
│   └── {slug}/                       # Generated course files
├── prisma/
│   └── seed-certification.ts         # Seeder script
├── scripts/
│   ├── add-webhook-mapping.ts
│   └── setup-emails.ts
├── src/
│   ├── app/api/webhooks/clickfunnels/
│   │   └── route.ts                  # Webhook handler
│   └── lib/
│       ├── email.ts                  # Email sender
│       └── email-templates/          # Email templates
└── tools/
    └── course-generator/
        └── turbo_generator.py        # Content generator
```
