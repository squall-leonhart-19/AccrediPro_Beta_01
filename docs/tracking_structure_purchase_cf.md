# FM Mini Diploma Purchase Tracking Structure

## Overview

This document describes the complete tracking flow for FM Mini Diploma purchases ($27) via ClickFunnels.

---

## Flow Diagram

```
ClickFunnels Checkout → CF Webhook → AccrediPro Server → Meta CAPI
                                            ↓
                                    Thank You Page → Meta Pixel (PageView only)
```

---

## Components

### 1. ClickFunnels Webhook

**Endpoint:** `https://learn.accredipro.academy/api/webhooks/clickfunnels`

**File:** `src/app/api/webhooks/clickfunnels/route.ts`

**Triggered by:** ClickFunnels on successful payment

**Actions performed:**
1. Parse purchase data (email, name, amount, transactionId)
2. **Deduplication check** - skip if transactionId already processed
3. Create or find user account (password: `Futurecoach2025`)
4. Enroll user in FM Mini Diploma course
5. Send welcome email with login credentials
6. **Send Purchase event to Meta CAPI**
7. Log webhook event to database

---

### 2. Meta CAPI (Server-Side Tracking)

**Pixel ID:** `1287915349067829` (ROYAL CERTIFIED)

**Access Token:** Stored in code, can be overridden via `META_PURCHASE_ACCESS_TOKEN` env var

**Event Details:**
| Field | Value |
|-------|-------|
| Event Name | `Purchase` |
| Value | `$27` (or actual amount from CF) |
| Currency | `USD` |
| Content Name | Product name from CF or "FM Mini Diploma" |
| Event Source URL | `https://learn.accredipro.academy/fm-mini-diploma/thank-you` |
| Action Source | `website` |

**User Data (hashed SHA256):**
- `em` - Email
- `fn` - First name
- `external_id` - User ID from database

---

### 3. Thank You Page (Browser-Side)

**URL:** `https://learn.accredipro.academy/fm-mini-diploma/thank-you`

**File:** `src/app/(public)/fm-mini-diploma/thank-you/page.tsx`

**Tracking:**
- Meta Pixel `PageView` event only
- Purchase event is NOT fired browser-side (handled by server CAPI)

**Why server-side only for Purchase:**
- More reliable (fires even if user closes browser)
- Cannot be blocked by ad blockers
- Prevents duplicate events

---

## Deduplication

**Problem:** ClickFunnels sends duplicate webhooks for same transaction

**Solution:** Check `transactionId` in database before processing

```typescript
// Check if transaction already processed
const existingEvent = await prisma.webhookEvent.findFirst({
  where: {
    eventType: "clickfunnels.purchase",
    payload: {
      path: ["transactionId"],
      equals: transactionId,
    },
  },
});

if (existingEvent) {
  return { message: "Duplicate transaction, already processed" };
}
```

---

## Verification

### Check Events Manager
1. Go to Meta Events Manager
2. Select Pixel `1287915349067829` (ROYAL CERTIFIED)
3. Go to **Overview** tab
4. Look for `Purchase` events marked as **Server**

### Check Database
```sql
SELECT * FROM "WebhookEvent"
WHERE "eventType" = 'clickfunnels.purchase'
ORDER BY "createdAt" DESC
LIMIT 10;
```

### Check Logs (Vercel)
Look for:
- `[Meta CAPI] ✅ Purchase sent: FM Mini Diploma = $27`
- `[Dedup] Transaction XXX already processed, skipping`

---

## Configuration

### Environment Variables (optional overrides)

| Variable | Description | Default |
|----------|-------------|---------|
| `META_PURCHASE_PIXEL_ID` | Meta Pixel ID | `1287915349067829` |
| `META_PURCHASE_ACCESS_TOKEN` | Meta CAPI Token | (hardcoded) |
| `META_TEST_EVENT_CODE` | Test event code for debugging | (empty = production) |

### Test Mode

To route events to Test Events tab:
1. Set `META_TEST_EVENT_CODE=TEST26530` in Vercel env vars
2. Events will appear in Events Manager → Test Events tab
3. Remove for production

---

## Files Reference

| File | Purpose |
|------|---------|
| `src/app/api/webhooks/clickfunnels/route.ts` | Main webhook handler |
| `src/app/(public)/fm-mini-diploma/thank-you/page.tsx` | Thank you page with PageView pixel |
| `src/lib/email.ts` | `sendWelcomeEmail` function |

---

## Troubleshooting

### No Purchase events in Events Manager
1. Check Vercel logs for `[Meta CAPI]` messages
2. Verify webhook is being triggered (check WebhookEvent table)
3. Verify Pixel ID and Access Token are correct

### Duplicate Purchase events
1. Check if deduplication code is deployed
2. Look for `[Dedup]` messages in logs
3. Verify transactionId is being parsed from CF payload

### Welcome email not received
1. Check if user was created in database
2. Check Resend dashboard for email status
3. Verify `sendWelcomeEmail` is being called (check logs)

---

## Summary

| Component | Event | Source |
|-----------|-------|--------|
| Meta CAPI (Webhook) | `Purchase` | Server |
| Thank You Page | `PageView` | Browser |

**Best Practice:** Server-side CAPI for conversion events (Purchase), browser pixel for attribution (PageView).
