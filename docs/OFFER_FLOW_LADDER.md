# AccrediPro Offer Flow & Ascension Ladder
**Date:** December 22, 2025
**Status:** Live (v2.0)

This document outlines the strategic flow of offers from Level 1 (Entry) to Level 4 (Scale), defining the "Ascension Ladder" for the AccrediPro Academy.

---

## 🏗️ The Core Hierarchy (The Levels)

We have moved from a flat catalog to a **Level-Based Career Path**.

| Level | Name | Price | Purpose | Key Content |
| :--- | :--- | :--- | :--- | :--- |
| **L1** | **Certified Practitioner** | **$197** | **The Entry** | Full Functional Medicine Certification. 21 Modules. |
| **L2** | **Pro Accelerator** | **$397** | **The Proficiency** | Unlocks Advanced Specialists (Hormones, Gut, etc.) + Master Classes. |
| **L3** | **10-Client Guarantee** | **$497** | **The Income** | Mentorship & Business Systems to get first 10 clients. |
| **L4** | **Business Scaler** | **Application** | **The Scale** | High-ticket backend ($5K+). Done-for-you infrastructure. |

---

## 🔄 User Flow (The Journey)

### **Step 1: The "No-Brainer" Start ($197)**
*   **Goal:** Volume acquisition. Get them certified and believing in themselves.
*   **User Action:** Purchases "Certified Functional Medicine Practitioner".
*   **Unlock:** Access to the core 21-module curriculum.
*   **Tag:** `Level 1`

### **Step 2: The "Expert" Upgrade ($397)**
*   **Goal:** Increase LTV and competence.
*   **Trigger:** After Module 3 or upon completion of L1.
*   **User Action:** Purchases "Pro Accelerator Upgrade".
*   **Unlock:** Instant access to all **Specialist Tracks** (Gut Health, Hormones, etc.) which are otherwise locked.
*   **Tag:** `Level 2`

### **Step 3: The "Safety Net" ($497)**
*   **Goal:** Conversion to serious business builder.
*   **Trigger:** "I'm certified, but how do I get clients?"
*   **User Action:** Purchases "10-Client Guarantee Mentorship".
*   **Unlock:** Access to private mentorship chat and client-getting systems.
*   **Tag:** `Level 3`

---

## 📱 Visual Indicators (Live Site)

1.  **Roadmap:** `/tracks/functional-medicine` - Visually displays Steps 1-4 with pricing ($197/$397/$497).
2.  **Catalog:** `/catalog` - Courses are now grouped by **"Level 1: Core"**, **"Level 2: Advanced"**, etc.
3.  **Admin:** `/admin/courses` - Your Command Center now shows which category/level each course belongs to.

---

## 🛠️ Technical Note
*   **Database:** `Category` table now includes "Level 1", "Level 2", etc.
*   **Pricing:** Prices are managed in the Admin Course Editor (`/admin/courses/[id]`).
*   **Access:** Logic in `types/next-auth.d.ts` and middleware checks for these Level tags to grant access.
