# Meta Pixel Setup Guide

How to configure Meta (Facebook) pixels for tracking leads and purchases across different ad accounts.

---

## Current Pixel Configuration

| Pixel | ID | Purpose | Ad Account |
|-------|-----|---------|------------|
| **Lead Pixel** | `1829815637745689` | Mini Diploma optins | New account |
| **Purchase Pixel** | `1287915349067829` | ClickFunnels purchases | Royal Certified |

---

## How It Works

### Lead Tracking (Mini Diploma Optins)
- **Client-side**: `src/components/tracking/meta-pixel.tsx` fires `fbq('track', 'Lead')`
- **Server-side**: `src/lib/meta-capi.ts` sends Lead events via Conversions API
- **Triggered by**: `/api/auth/register-freebie` when user optins for mini diploma

### Purchase Tracking (ClickFunnels)
- **Server-side only**: Webhook routes send Purchase events via Conversions API
- **Triggered by**: ClickFunnels webhook when payment completes

---

## Adding a New Pixel for a New ClickFunnels Product

### Step 1: Get Your Pixel Credentials

1. Go to **Meta Business Manager** > **Events Manager**
2. Select your pixel (or create new one)
3. Go to **Settings** > **Conversions API**
4. Copy:
   - **Pixel ID**: The number in the URL or settings
   - **Access Token**: Generate new token

### Step 2: Add Environment Variables in Vercel

For a new product/pixel, add to Vercel:

```
META_PURCHASE_PIXEL_ID_[PRODUCT]=your_pixel_id
META_PURCHASE_ACCESS_TOKEN_[PRODUCT]=your_access_token
```

Example for a "Gut Health" product:
```
META_PURCHASE_PIXEL_ID_GUT=9876543210
META_PURCHASE_ACCESS_TOKEN_GUT=EAAxxxxxxx...
```

### Step 3: Create a New Webhook Route

Create a new file: `src/app/api/webhooks/clickfunnels-[product]/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";

/**
 * ClickFunnels Webhook for [PRODUCT NAME]
 */

// Meta CAPI Configuration - USE YOUR NEW PIXEL HERE
const PIXEL_ID = process.env.META_PURCHASE_PIXEL_ID_[PRODUCT] || "your_pixel_id";
const ACCESS_TOKEN = process.env.META_PURCHASE_ACCESS_TOKEN_[PRODUCT] || "your_access_token";

// Hash PII for Meta CAPI
function hashForMeta(data: string): string {
    return crypto.createHash("sha256").update(data.toLowerCase().trim()).digest("hex");
}

// Send Purchase event to Meta CAPI
async function sendPurchaseToMeta(params: {
    email: string;
    value: number;
    currency?: string;
    contentName: string;
    firstName?: string;
    externalId?: string;
}): Promise<{ success: boolean; eventId?: string }> {
    const { email, value, currency = "USD", contentName, firstName, externalId } = params;

    const eventId = crypto.randomUUID();

    const userData: Record<string, unknown> = {
        em: [hashForMeta(email)],
    };
    if (firstName) userData.fn = [hashForMeta(firstName)];
    if (externalId) userData.external_id = [hashForMeta(externalId)];

    const eventData = {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: "https://learn.accredipro.academy/[product]/thank-you",
        action_source: "website",
        user_data: userData,
        custom_data: {
            value,
            currency,
            content_name: contentName,
        },
    };

    try {
        const response = await fetch(
            `https://graph.facebook.com/v18.0/${PIXEL_ID}/events?access_token=${ACCESS_TOKEN}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: [eventData] }),
            }
        );

        const result = await response.json();
        console.log(`[META] Purchase sent for ${contentName}:`, { eventId, success: response.ok });

        return { success: response.ok, eventId };
    } catch (error) {
        console.error("[META] Error:", error);
        return { success: false };
    }
}

export async function POST(request: NextRequest) {
    try {
        const payload = await request.json();

        // Extract data from ClickFunnels payload
        const email = payload.contact?.email || payload.email;
        const firstName = payload.contact?.first_name || payload.firstName;
        const lastName = payload.contact?.last_name || payload.lastName;
        const amount = parseFloat(payload.purchase?.total || payload.amount || "0");

        if (!email) {
            return NextResponse.json({ error: "Email required" }, { status: 400 });
        }

        // 1. Create/find user
        let user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
            const passwordHash = await bcrypt.hash("Futurecoach2025", 12);
            user = await prisma.user.create({
                data: {
                    email,
                    firstName,
                    lastName,
                    passwordHash,
                    role: "STUDENT",
                },
            });
        }

        // 2. Enroll in course
        const course = await prisma.course.findFirst({
            where: { slug: "[your-course-slug]" },
        });

        if (course) {
            await prisma.enrollment.upsert({
                where: { userId_courseId: { userId: user.id, courseId: course.id } },
                create: { userId: user.id, courseId: course.id, status: "ACTIVE" },
                update: {},
            });
        }

        // 3. Send Purchase to Meta
        await sendPurchaseToMeta({
            email,
            value: amount,
            contentName: "[Product Name]",
            firstName,
            externalId: user.id,
        });

        // 4. Send welcome email
        await sendWelcomeEmail({ to: email, firstName });

        return NextResponse.json({ success: true, userId: user.id });
    } catch (error) {
        console.error("Webhook error:", error);
        return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
    }
}
```

### Step 4: Configure ClickFunnels Webhook

1. In ClickFunnels, go to **Settings** > **Webhooks**
2. Add new webhook:
   - **URL**: `https://learn.accredipro.academy/api/webhooks/clickfunnels-[product]`
   - **Events**: `order.completed`, `one-time-order.completed`
3. Save and copy webhook secret
4. Add to Vercel: `CLICKFUNNELS_WEBHOOK_SECRET_[PRODUCT]=xxx`

### Step 5: Create Thank You Page (Optional)

If you want client-side pixel firing on thank-you page:

```typescript
// src/app/(public)/[product]/thank-you/page.tsx
"use client";

import Script from "next/script";

const META_PIXEL_ID = "your_new_pixel_id";

export default function ThankYouPage() {
    return (
        <>
            <Script
                id="meta-pixel"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        !function(f,b,e,v,n,t,s)
                        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                        n.queue=[];t=b.createElement(e);t.async=!0;
                        t.src=v;s=b.getElementsByTagName(e)[0];
                        s.parentNode.insertBefore(t,s)}(window, document,'script',
                        'https://connect.facebook.net/en_US/fbevents.js');
                        fbq('init', '${META_PIXEL_ID}');
                        fbq('track', 'Purchase', {value: 97, currency: 'USD'});
                    `,
                }}
            />
            {/* Your thank you page content */}
        </>
    );
}
```

---

## Testing Meta Events

### Using Test Event Code

1. In Meta Events Manager, go to **Test Events**
2. Copy the test event code (e.g., `TEST12345`)
3. Add to Vercel: `META_TEST_EVENT_CODE=TEST12345`
4. Make a test purchase
5. Check **Test Events** tab - event should appear
6. Remove test code for production

### Verifying in Events Manager

1. Go to **Events Manager** > **Your Pixel**
2. Check **Overview** tab for recent events
3. Click on event to see details (email hash, value, etc.)

---

## Troubleshooting

### Events Not Appearing

1. **Check Vercel logs**: Look for `[META]` log entries
2. **Verify credentials**: Ensure pixel ID and access token are correct
3. **Check Events Manager**: Events can take 5-20 minutes to appear
4. **Test with test code**: Use `META_TEST_EVENT_CODE` to route to Test Events

### Duplicate Events

- Server-side (CAPI) and client-side (pixel) events are deduplicated by Meta using `event_id`
- Each event should have a unique `event_id` generated with `crypto.randomUUID()`

### Wrong Pixel Receiving Events

- Check which pixel ID is configured in the specific webhook route
- Each product can have its own pixel - just use different env var names

---

## Quick Reference: Environment Variables

```bash
# Lead Pixel (Mini Diploma optins)
META_PIXEL_ID_2=1829815637745689
META_ACCESS_TOKEN_2=EAAHMla...

# Purchase Pixel (Royal Certified - existing)
META_PURCHASE_PIXEL_ID=1287915349067829
META_PURCHASE_ACCESS_TOKEN=EAAHMla...

# Additional product pixels (example)
META_PURCHASE_PIXEL_ID_GUT=9876543210
META_PURCHASE_ACCESS_TOKEN_GUT=EAAHMla...

# Testing (optional)
META_TEST_EVENT_CODE=TEST12345
```

---

*Last Updated: January 2025*
