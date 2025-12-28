# 🚀 AccrediPro Course Launch Protocol (The 4-Step Process)

Use this guide to take a generated course from "Files on Disk" to "For Sale on ClickFunnels".

## ✅ Step 1: Generate Content (The Factory)
Ensure the course content is generated.
- **Script:** `tools/course-generator/generate_all_18.py`
- **Output:** `/Users/pochitino/Desktop/accredipro-lms/courses/[course-slug]`
- **Check:** Look for `Module_01` folder with HTML files.

## ✅ Step 2: Registry (The Metadata)
The LMS needs to know the course exists (Slug, Price, Name, methodology).
Add the course to: `docs/launch_steps/certifications.json`

**Required Format:**
```json
"stress-burnout-coach": {
    "name": "Certified Stress & Burnout Coach™",
    "short_name": "Stress & Burnout Coach",
    "methodology": {
        "acronym": "RESTORE",
        "full_name": "The R.E.S.T.O.R.E. Protocol™"
        // ... (letters)
    },
    "folder": "/courses/stress-burnout-coach/",
    "category": "Health & Wellness",
    "products": {
        "certification": {
            "slug": "stress-burnout-coach-certification",
            "price": 97
        }
    }
}
```
> **Critical:** The key `stress-burnout-coach` must match what you put in the JSON file.

## ✅ Step 3: Import (The Bridge)
Push the metadata and content into the Database.

**Run Command:**
```bash
npx tsx scripts/import-all-certifications.ts
```
> **Success:** Look for "✅ Course Upserted" and "✅ Imported X modules".

## ✅ Step 4: Sales Integration (ClickFunnels)
Connect the payment to the access.

### A. Create Product in ClickFunnels
- **Name:** "Certified Stress & Burnout Coach" (or similar)
- **Price:** $97
- **SKU:** `stress-burnout-coach-certification`
  - *Recommendation:* Use the exact slug from JSON, e.g., `[niche]-coach-certification`.
  - *Fallback:* If you use keywords like "stress" or "burnout", the system will likely find it too, but the exact slug is safest.

### B. Configure Webhook
Enable the **Purchase Webhook** for the product.
- **URL:** `https://sarah.accredipro.academy/api/webhooks/clickfunnels-purchase`
> **One URL Rule:** Use this **SAME URL** for ALL 18 certification products. The system handles routing automatically.

### C. Verify Delivery (Automated)
- **Access:** The system will create the user and enroll them.
- **Emails:** The system **automatically sends** a "You're Enrolled" email with the correct course name inserted. You do NOT need to configure this in ClickFunnels.
- **Tagging:** The system applies a purchased tag automatically: `[slug]_purchased` (e.g., `stress_burnout_coach_certification_purchased`).

## ✅ Step 5: Verify
1.  Log in as a test user (or simulate a webhook).
2.  Go to Dashboard.
3.  You should see the course!

---
**Current Status:**
- [x] **Holistic Nutrition:** LAUNCHED & LIVE 🟢
- [ ] **Stress & Burnout:** Generated ✅ -> Needs Metadata (Step 2)
- [ ] **Hormone Health:** Generated ✅ -> Needs Metadata (Step 2)
