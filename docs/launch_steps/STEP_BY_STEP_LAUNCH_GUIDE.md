# 🚀 AccrediPro Course Launch Protocol

Complete guide for launching certifications from content → sales.

---

## 📦 SKU & Tag Convention

**Formula:** Tag is auto-generated from SKU
```
Tag = SKU.replace(/-/g, "_") + "_purchased"
```

| ClickFunnels SKU | Auto-Generated Tag |
|------------------|-------------------|
| `holistic-nutrition-coach-certification` | `holistic_nutrition_coach_certification_purchased` |
| `hn-pro-accelerator` | `hn_pro_accelerator_purchased` |
| `fm-pro-accelerator` | `fm_pro_accelerator_purchased` |

> **Best Practice:** Use the exact course slug as the SKU.

---

## 🎯 Product Tiers

Each certification has 2 tiers:

### Main Certification ($97)
- 15-16 modules of core content
- Single course enrollment
- SKU: `[niche]-coach-certification`

### Pro Accelerator Bundle ($397+)
Enrolls in **4 courses** automatically:
1. Main Certification
2. Advanced Clinical DEPTH
3. Master DEPTH  
4. Practice Path

---

## 📧 Automatic Emails

### How It Works:
| Email | Trigger | Dynamic Fields | Works For All Niches? |
|-------|---------|----------------|----------------------|
| **Welcome** | First purchase (new user) | `{firstName}` | ✅ Yes - generic |
| **Enrollment** | Any course enrollment | `{firstName}`, `{courseName}` | ✅ Yes - pulls title from DB |
| **Pro VIP** | Pro Accelerator purchase | `{firstName}`, `{niche}` | ✅ Yes - pass niche code |
| **Sarah's DM** | 2-3 min after purchase | `{firstName}` | ✅ Yes - in-app message |

> No ClickFunnels email config needed - it's all automatic!

### For NEW Product Launches:

**No code changes needed:**
- Welcome Email ✅ (generic)
- Enrollment Email ✅ (pulls course title from database)
- Sarah's DM ✅ (same for all)

**Code updates needed in `route.ts`:**
```typescript
// 1. Add product keyword mapping
"stress burnout": "stress-burnout-coach-certification",
"sb-pro-accelerator": "sb-pro-accelerator",

// 2. Add to PRODUCT_PRICES
"stress-burnout-coach-certification": 97,
"sb-pro-accelerator": 397,

// 3. Add to PRODUCT_NAMES
"stress-burnout-coach-certification": "Certified Stress & Burnout Coach",
"sb-pro-accelerator": "SB Pro Accelerator™ - Advanced, Master & Practice Path",
```

**Pro VIP niche codes** (already in `email.ts`):
- `FM` = Functional Medicine
- `HN` = Holistic Nutrition
- `SB` = Stress & Burnout
- `HH` = Hormone Health

---

## 📂 Certification Registry (SKU, Tags & Folders)

### 🩺 Functional Medicine (FM) - LIVE ✅

| Product | CF Product Name | SKU | Tags Applied |
|---------|-----------------|-----|--------------|
| Main | Certified Functional Medicine Practitioner™ | `functional-medicine-complete-certification` | `functional_medicine_complete_certification_purchased` |
| Pro Bundle | Functional Medicine Pro Accelerator™ - Advanced, Master & Practice Path | `fm-pro-accelerator` | `fm_pro_accelerator_purchased` |
| Pro L2 | FM Advanced Clinical DEPTH | `fm-pro-advanced-clinical` | `fm_pro_advanced_clinical_purchased` |
| Pro L3 | FM Master DEPTH | `fm-pro-master-depth` | `fm_pro_master_depth_purchased` |
| Pro L4 | FM Practice Path | `fm-pro-practice-path` | `fm_pro_practice_path_purchased` |

**Folder:** `/courses/functional-medicine-complete-certification/`

---

### 🥗 Holistic Nutrition (HN) - PENDING 🟡

| Product | CF Product Name | SKU | Tags Applied |
|---------|-----------------|-----|--------------|
| Main | Certified Holistic Nutrition Coach™ | `holistic-nutrition-coach-certification` | `holistic_nutrition_coach_certification_purchased` |
| Pro Bundle | Holistic Nutrition Pro Accelerator™ - Advanced, Master & Practice Path | `hn-pro-accelerator` | `hn_pro_accelerator_purchased` |
| Pro L2 | HN Advanced Clinical DEPTH | `hn-pro-advanced-clinical` | `hn_pro_advanced_clinical_purchased` |
| Pro L3 | HN Master DEPTH | `hn-pro-master-depth` | `hn_pro_master_depth_purchased` |
| Pro L4 | HN Practice Path | `hn-pro-practice-path` | `hn_pro_practice_path_purchased` |

**Folder:** `/courses/certified-holistic-nutrition-coach/`

---

### 😰 Stress & Burnout (SB) - NOT LAUNCHED ❌

| Product | CF Product Name | SKU | Tags Applied |
|---------|-----------------|-----|--------------|
| Main | Certified Stress & Burnout Coach™ | `stress-burnout-coach-certification` | `stress_burnout_coach_certification_purchased` |
| Pro Bundle | Stress & Burnout Pro Accelerator™ - Advanced, Master & Practice Path | `sb-pro-accelerator` | `sb_pro_accelerator_purchased` |

**Folder:** `/courses/stress-burnout-coach/`

---

### 🧬 Hormone Health (HH) - NOT LAUNCHED ❌

| Product | CF Product Name | SKU | Tags Applied |
|---------|-----------------|-----|--------------|
| Main | Certified Hormone Health Coach™ | `hormone-health-coach-certification` | `hormone_health_coach_certification_purchased` |
| Pro Bundle | Hormone Health Pro Accelerator™ - Advanced, Master & Practice Path | `hh-pro-accelerator` | `hh_pro_accelerator_purchased` |

**Folder:** `/courses/hormone-health-coach/`

---

### 📝 BLANK TEMPLATE (Copy for New Niches)

```
### 🏷️ [NICHE NAME] ([ABBREV]) - NOT LAUNCHED ❌

| Product | CF Product Name | SKU | Tags Applied |
|---------|-----------------|-----|--------------|
| Main | Certified [Niche] Coach™ | `[niche-slug]-coach-certification` | `[niche_slug]_coach_certification_purchased` |
| Pro Bundle | [Niche] Pro Accelerator™ - Advanced, Master & Practice Path | `[abbrev]-pro-accelerator` | `[abbrev]_pro_accelerator_purchased` |
| Pro L2 | [ABBREV] Advanced Clinical DEPTH | `[abbrev]-pro-advanced-clinical` | `[abbrev]_pro_advanced_clinical_purchased` |
| Pro L3 | [ABBREV] Master DEPTH | `[abbrev]-pro-master-depth` | `[abbrev]_pro_master_depth_purchased` |
| Pro L4 | [ABBREV] Practice Path | `[abbrev]-pro-practice-path` | `[abbrev]_pro_practice_path_purchased` |

**Folder:** `/courses/[course-folder-name]/`
```

**Naming Convention:**
- `[ABBREV]` = 2-letter code (FM, HN, SB, HH, etc.)
- `[niche-slug]` = lowercase-with-dashes (e.g., `holistic-nutrition`)
- `[niche_slug]` = lowercase_with_underscores (for tags)

---

## ✅ Step 1: Generate Content

```bash
python tools/course-generator/generate_all_18.py
```
**Output:** `/courses/[course-slug]/`  
**Verify:** `Module_01` folder exists with HTML files

---

## ✅ Step 2: Registry (Metadata)

Add to `docs/launch_steps/certifications.json`:

```json
"holistic-nutrition-coach": {
    "name": "Certified Holistic Nutrition Coach™",
    "folder": "/courses/certified-holistic-nutrition-coach/",
    "products": {
        "certification": {
            "slug": "holistic-nutrition-coach-certification",
            "price": 97
        },
        "pro_accelerator": {
            "slug": "hn-pro-accelerator",
            "price": 397,
            "includes": [
                "holistic-nutrition-coach-certification",
                "hn-pro-advanced-clinical",
                "hn-pro-master-depth",
                "hn-pro-practice-path"
            ]
        }
    }
}
```

---

## ✅ Step 3: Import to Database

```bash
npx tsx scripts/import-all-certifications.ts
```

**Success:** Look for "✅ Course Upserted" and "✅ Imported X modules"

---

## ✅ Step 4: ClickFunnels Setup

### A. Create Product
| Field | Value |
|-------|-------|
| Name | See Registry above (e.g., "Holistic Nutrition Pro Accelerator™ - Advanced, Master & Practice Path") |
| Price | $97 (Main) or $397 (Pro) |
| SKU | Exact slug from Registry |

### B. Configure Webhook
**URL:** `https://sarah.accredipro.academy/api/webhooks/clickfunnels-purchase`

> Use this SAME URL for ALL products. Routing is automatic.

### C. What Happens Automatically
- ✅ User account created (password: `Futurecoach2025`)
- ✅ Course enrollment(s) added
- ✅ Welcome + Enrollment emails sent
- ✅ Sarah's DM scheduled (2-3 min delay)
- ✅ Tag applied: `[slug]_purchased`
- ✅ Meta CAPI Purchase event fired

---

## ✅ Step 5: Verify

Test the full flow:
```bash
npx tsx scripts/test-full-real-purchase.ts
```

Or manually:
1. Make a test purchase in ClickFunnels
2. Log in as the test user
3. Verify courses appear on Dashboard
4. Check `/messages` for Sarah's DM

---

## 🔧 Webhook Mapping (For New Niches)

Add to `src/app/api/webhooks/clickfunnels-purchase/route.ts`:

```typescript
// Already added to route.ts:

// HN Pro Accelerator Bundle ($397)
"hn-pro-accelerator": "hn-pro-accelerator",
"hn pro accelerator": "hn-pro-accelerator",
"holistic nutrition pro": "hn-pro-accelerator",
"nutrition pro accelerator": "hn-pro-accelerator",

// PRODUCT_PRICES
"holistic-nutrition-coach-certification": 97,
"hn-pro-accelerator": 397,

// PRODUCT_NAMES
"holistic-nutrition-coach-certification": "Certified Holistic Nutrition Coach",
"hn-pro-accelerator": "HN Pro Accelerator™ - Advanced, Master & Practice Path",
```

> ✅ **HN Pro mapping added** - Dec 29, 2025

---

## 🤖 AUTOMATION ARCHITECTURE (Master Plan)

### Phase 1: Purchase Flow (✅ IMPLEMENTED)

```
ClickFunnels Purchase
        ↓
1. ✅ Create/find user (password: Futurecoach2025)
2. ✅ Add purchase tag (e.g., fm_certification_purchased)
3. ✅ Enroll in course(s)
4. ✅ NeverBounce verify email
5. ✅ Send welcome email
6. ✅ Send enrollment email
7. ✅ Fire Meta CAPI Purchase event
8. ✅ Auto-DM: Sarah intro (0 min)
9. ✅ Auto-DM: Coach follow-up (+5 min)
```

---

### Niche → Coach Mapping (✅ IMPLEMENTED)

**File:** `src/config/niches/index.ts`

| Niche Code | Certification | Assigned Coach | Pixel |
|------------|---------------|----------------|-------|
| FM | Functional Medicine | Sarah | fm-health |
| WH | Women's Hormone Health | Sarah | fm-health |
| IM | Integrative Medicine | Sarah | fm-health |
| HN | Holistic Nutrition | Sarah | fm-health |
| NR | Narcissistic Recovery | Olivia | mental-health |
| ND | Neurodiversity | Olivia | mental-health |
| GL | Grief & Loss | Olivia | mental-health |
| LC | Life Coaching | Marcus | life-coaching |
| SE | Spiritual Energy | Luna | spiritual |
| SI | Sex & Intimacy | Luna | spiritual |
| HB | Herbalism | Sage | herbalism |
| TM | Therapy Modalities | Maya | yoga-movement |
| PW | Pet Wellness | Bella | pet-wellness |
| FB | Fertility & Birth | Emma | parenting |
| PC | Parenting Coach | Emma | parenting |
| CF | Christian Faith | Grace | faith |

---

### DM Templates (✅ IMPLEMENTED)

**File:** `docs/messaging/DM_TEMPLATES.md`

| Template | Sent At | Contains |
|----------|---------|----------|
| Sarah Intro | 0 min | Welcome + assigns coach + income proof |
| Coach Follow-up | +5 min | Personal intro + story ask + income goal question |

**Income Messaging by Niche:**
- Life Coaching: $10K-$25K/month
- Business: $10K-$30K/month
- FM/Health: $8K-$20K/month
- Mental Health: $6K-$15K/month

---

### Tag System

| Tag Type | Format | Example |
|----------|--------|---------|
| **Purchase** | `[slug]_purchased` | `fm_certification_purchased` |
| **Suppression** | `suppress_[reason]` | `suppress_bounced`, `suppress_complained` |
| **Lifecycle** | descriptive | `welcome_email_sent`, `certificate_earned` |

---

### Email Deliverability (✅ IMPLEMENTED)

**Smart Email Recovery System:**

| Feature | Status |
|---------|--------|
| NeverBounce verification on signup | ✅ |
| AI typo detection on bounce | ✅ |
| Auto-fix valid suggestions | ✅ |
| Admin UI at `/admin/email-issues` | ✅ |
| Hard bounce suppression | ✅ |
| Spam complaint suppression | ✅ |

---

### Phase 2: Lifecycle Automation (🟡 PENDING)

| Step | Timing | What Happens | Status |
|------|--------|--------------|--------|
| Day 3 Reminder | +72h | "How's Module 1 going?" | ❌ |
| Day 7 Check-in | +168h | "1 week in! Progress check" | ❌ |
| Day 14 Motivation | +336h | "Halfway there!" | ❌ |
| Day 30 Push | +720h | "Time to finish + certificate!" | ❌ |
| Inactivity Nudge | 5 days no login | "Haven't seen you..." | ❌ |
| Certificate Congrats | On completion | "You did it! + upsell" | ❌ |

---

### Phase 3: Community Automation (❌ PENDING)

| Feature | Status |
|---------|--------|
| Auto-join coach's community group | ❌ |
| Welcome post on join | ❌ |
| Milestone celebrations | ❌ |

---

## 📋 Launch Checklist (Per Niche)

**Before Launch:**
- [ ] Course content generated (21 modules L1 + 20 modules L2-L4)
- [ ] Course imported to database
- [ ] Course thumbnails generated
- [ ] Sales page created
- [ ] ClickFunnels product created with correct SKU
- [ ] Webhook URL configured: `https://sarah.accredipro.academy/api/webhooks/clickfunnels-purchase`
- [ ] Pixel configured with correct category
- [ ] Product mapping added to `route.ts` (if new keywords needed)

**Automatic (No Setup Needed):**
- ✅ User account creation
- ✅ Course enrollment
- ✅ Welcome + enrollment emails
- ✅ Sarah intro DM (0 min)
- ✅ Coach follow-up DM (+5 min)
- ✅ Meta CAPI purchase event
- ✅ NeverBounce email verification
- ✅ Bounce recovery AI

---

**Last Updated:** Jan 2, 2026

