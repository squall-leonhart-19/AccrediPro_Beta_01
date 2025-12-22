# AccrediPro Offer Flow & Ascension Ladder
**Date:** December 22, 2025  
**Status:** Live (v2.0) - XMAS SALE ACTIVE 🎄

---

## 🎄 XMAS 2025 Pricing (Limited Time)

| Product | Original Price | XMAS Price | Savings |
| :--- | :--- | :--- | :--- |
| **Certified FM Practitioner** | ~~$497~~ | **$97** | 80% OFF |
| **Pro Accelerator (Advanced+Master)** | ~~$997~~ | **$397** | 60% OFF |

---

## 🏗️ The Core Hierarchy (The Levels)

| Level | Name | XMAS Price | Purpose | Key Content |
| :--- | :--- | :--- | :--- | :--- |
| **L1** | **Certified FM Practitioner** | **$97** | **The Entry** | Full Certification. 21 Modules. |
| **L2** | **FM Pro Accelerator™** | **$397** | **The Expert** | Advanced + Master + Practice Path. |

---

## 🔄 User Flow (The Journey)

### **Step 1: Certified FM Practitioner ($97 XMAS)**
*   **Goal:** Volume acquisition. Get them certified.
*   **Original:** $497 → **XMAS: $97**
*   **Content:** Full 21-module certification curriculum.
*   **Unlock:** Practitioner status + certificate.

### **Step 2: FM Pro Accelerator™ ($397 XMAS)**
*   **Goal:** Increase LTV and competence.
*   **Original:** $997 → **XMAS: $397**
*   **Content:** Advanced Track + Master Track + Practice & Income Path.
*   **Unlock:** All specialist content + business systems.

---

## 📱 Catalog Display

**Currently Visible:**
1. ✅ Certified Functional Medicine Practitioner
2. ✅ FM Pro Accelerator™

**Currently Hidden:**
- ❌ FM 10-Client Guarantee (removed)
- ❌ Women's Hormone Health Coach
- ❌ Gut Health & Digestive Wellness Coach
- ❌ All Mini Diplomas (separate page)

---

## 🛠️ Technical Notes

*   **Prices in DB:** Update via Admin → Courses → [Course] → Settings & Pricing
*   **Catalog Filter:** `src/app/(dashboard)/catalog/page.tsx`
*   **Webhook Mapping:** `src/app/api/webhooks/clickfunnels-purchase/route.ts`
