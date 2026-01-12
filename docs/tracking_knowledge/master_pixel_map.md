# AccrediPro Master Tracking Architecture (Strict Silo)
> **Status**: Production Live
> **Last Updated**: 2026-01-12
> **Architecture**: Strict Niche Silo (No Cross-Contamination)

## 1. The Strategy
We utilize a **Strict Silo Architecture**. Each of the 17 Niches has its own dedicated Pixel.
-   **No "Royal Certified" Mixing**: Data does not flow to a master pixel for niche products.
-   **Pure Signal**: Ad algorithms see only relevant data (e.g., "Pet Wellness" pixel only sees Pet Wellness leads/buyers).

## 2. The Tech Stack
### A. The Registry (`src/config/pixel-registry.ts`)
The central brain. It maps:
1.  **Niche -> Pixel ID** (e.g., `SarahFunctionalMedicine` -> `1322772...`)
2.  **Product -> Pixel ID** (e.g., `pet-wellness` -> `BellaPetWellness`)
3.  **Product -> User Tags** (e.g., `pw001` -> `pet_wellness_specialist_purchased`)

### B. Event Flow
| Event | Source | Destination | Logic |
| :--- | :--- | :--- | :--- |
| **Lead** | Frontend Page | **Niche Pixel** | `trackLead()` calls specific Niche ID from Registry. |
| **Purchase** | ClickFunnels Webhook | **Niche Pixel** | Webhook resolves Product ID -> Niche Pixel via Registry. |

## 3. Launch Protocol (How to Add a New Course)

To launch a new Mini Diploma (e.g., "Christian Life Coach"), follow this **3-Step Protocol**:

### Step 1: Frontend Build (The Page)
1.  **Clone**: Copy `src/app/(public)/functional-medicine-mini-diploma/page.tsx`.
2.  **Paste**: Create `src/app/(public)/christian-life-coach-mini-diploma/page.tsx`.
3.  **Update Content**: Swap text/images.

### Step 2: Configure Tracking (The Switch)
Import the Registry and select the correct Niche Pixel.

```typescript
import { PIXEL_REGISTRY } from "@/config/pixel-registry";

// Inside component:
useEffect(() => {
    // 1. ViewContent
    trackViewContent("Christian Life Coach", "gf003", PIXEL_REGISTRY.GraceFaithBased);
}, []);

// Inside handleSubmit:
// 2. Lead
trackLead("Christian Life Coach", email, firstName, PIXEL_REGISTRY.GraceFaithBased);
```

### Step 3: Verify Backend (The Auto-Magic)
**You do nothing.**
As long as the ClickFunnels Product ID / Name contains the keyword (e.g., "Christian"), the Webhook implicitly knows to:
1.  Fire the `GraceFaithBased` Pixel for Purchase.
2.  Apply the `christian_life_coach_purchased` tag.

## 4. Reference: Niche Pixels
| Key | Context |
| :--- | :--- |
| `SarahFunctionalMedicine` | Functional Medicine |
| `SarahWomensHormones` | Women's Health |
| `OliviaNarcTrauma` | Narcissistic Abuse |
| `BellaPetWellness` | Pet Wellness |
| *(See `src/config/pixel-registry.ts` for full list)* | |
