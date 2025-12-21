# ClickFunnels 2.0 Webhook Setup Guide

Step-by-step guide for configuring webhooks in ClickFunnels 2.0 to work with AccrediPro.

---

## Overview

Our system uses these webhook endpoints:

| Endpoint | Purpose |
|----------|---------|
| `/api/webhooks/clickfunnels` | Main webhook - creates users, enrolls, sends emails |
| `/api/webhooks/clickfunnels-purchase` | Purchase tracking only (Meta CAPI) |
| `/api/auth/register-freebie` | Optin/lead capture |

---

## Step 1: Access Webhook Settings

1. Log into ClickFunnels 2.0
2. Go to **Settings** (gear icon) → **Webhooks**
3. Or go to specific funnel → **Settings** → **Webhooks**

---

## Step 2: Create Purchase Webhook

### For Order Completed Events

1. Click **"Add Webhook"**
2. Configure:
   - **Name**: `AccrediPro - Purchase`
   - **URL**: `https://learn.accredipro.academy/api/webhooks/clickfunnels`
   - **Events**: Select these:
     - ✅ `order.completed`
     - ✅ `one-time-order.completed`
     - ✅ `subscription.created`
     - ✅ `charge.refunded`

3. Click **Save**

### Copy the Webhook Secret

After creating, CF will show you a webhook secret. Copy it and add to your `.env`:

```env
CLICKFUNNELS_WEBHOOK_SECRET=your_webhook_secret_here
```

---

## Step 3: Create Optin Webhook (for Exit Popups)

1. Click **"Add Webhook"**
2. Configure:
   - **Name**: `AccrediPro - Optin`
   - **URL**: `https://learn.accredipro.academy/api/auth/register-freebie`
   - **Events**:
     - ✅ `contact.created`
     - ✅ `contact.updated`

3. For exit popups, you may need to use **Automations** instead:
   - Go to **Automations**
   - Create trigger: "Form Submitted"
   - Action: "Send Webhook"
   - URL: `https://learn.accredipro.academy/api/auth/register-freebie`

---

## Step 4: Webhook Payload Mapping

### What CF 2.0 Sends

```json
{
  "event_type": "order.completed",
  "data": {
    "id": "ord_abc123",
    "public_id": "ORD-12345",
    "total_amount": 997.00,
    "contact": {
      "id": "con_xyz",
      "email_address": "customer@example.com",
      "first_name": "Jane",
      "last_name": "Doe",
      "phone_number": "+1234567890"
    },
    "line_items": [
      {
        "id": "li_1",
        "quantity": 1,
        "price": 997.00,
        "original_product": {
          "id": "prod_abc",
          "name": "FM Certification"
        },
        "products_variant": {
          "id": "var_xyz",
          "sku": "fm-certification",
          "name": "FM Certification - Full Access"
        }
      }
    ]
  }
}
```

### How We Parse It

Our webhook extracts:
- `email`: from `data.contact.email_address`
- `firstName`: from `data.contact.first_name`
- `lastName`: from `data.contact.last_name`
- `productId`: from `line_items[0].products_variant.sku` (primary)
- `productName`: from `line_items[0].products_variant.name`
- `amount`: from `data.total_amount`
- `transactionId`: from `data.id` or `data.public_id`

---

## Step 5: Product SKU Configuration

### In ClickFunnels

1. Go to **Products**
2. Click on your product
3. Go to **Variants** or **Settings**
4. Set the **SKU** field (this is what our webhook uses)

### SKU Naming Convention

Use lowercase, hyphenated names:
- `fm-certification`
- `fm-mini-diploma`
- `fm-vip-coaching`
- `fm-implementation`

### Update Code

Add new SKUs to `/api/webhooks/clickfunnels/route.ts`:

```typescript
const PRODUCT_COURSE_MAP: Record<string, string> = {
  "fm-mini-diploma": "fm-mini-diploma",
  "fm-certification": "fm-certification",
  // Add new products here
};
```

---

## Step 6: Testing Webhooks

### Method 1: CF Test Events

1. In webhook settings, click **"Send Test"**
2. Check our logs for the event
3. Verify in database

### Method 2: Use Test Event Code (Meta)

Set in `.env`:
```env
META_TEST_EVENT_CODE=TEST12345
```

Make test purchase → Check Meta Events Manager → Test Events tab

### Method 3: Manual Webhook Test

```bash
curl -X POST https://learn.accredipro.academy/api/webhooks/clickfunnels \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "order.completed",
    "data": {
      "id": "test_123",
      "total_amount": 27,
      "contact": {
        "email_address": "test@example.com",
        "first_name": "Test",
        "last_name": "User"
      },
      "line_items": [{
        "products_variant": {
          "sku": "fm-mini-diploma",
          "name": "FM Mini Diploma"
        }
      }]
    }
  }'
```

---

## Step 7: Verify Webhook is Working

### Check Webhook Endpoint

Visit: `https://learn.accredipro.academy/api/webhooks/clickfunnels`

Should return:
```json
{
  "success": true,
  "message": "ClickFunnels webhook is active",
  "endpoint": "/api/webhooks/clickfunnels",
  "method": "POST",
  "supportedEvents": ["purchase", "refund"]
}
```

### Check Logs

In Vercel dashboard or local logs, look for:
```
ClickFunnels webhook received: order.completed for jane@example.com
Created new user from ClickFunnels: jane@example.com
Enrolled jane@example.com in course: fm-certification
[Meta CAPI] ✅ Purchase sent: FM Certification = $997
```

---

## Troubleshooting

### Webhook Not Received

1. **Check CF Activity Log**
   - Go to Webhooks → Activity
   - Look for failed deliveries
   - Check error messages

2. **Verify URL**
   - Must be HTTPS
   - Must be publicly accessible
   - No trailing slash

3. **Check Firewall**
   - Vercel should allow all IPs
   - If self-hosted, whitelist CF IPs

### Webhook Received But User Not Created

1. **Check Payload Format**
   - Log the raw payload
   - Ensure email is present
   - Check field names match our parser

2. **Check Database Connection**
   - Verify `DATABASE_URL` is correct
   - Check Prisma client initialization

### Duplicate Users/Enrollments

Our webhook handles this:
- Checks for existing transaction ID
- Uses upsert for enrollments
- Skips if already processed

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "No email in payload" | Check CF sends `contact.email_address` |
| "Course not found" | Add SKU to `PRODUCT_COURSE_MAP` |
| User not enrolled | Verify course exists with matching slug |
| Meta event not sent | Check pixel ID and access token |
| Duplicate processing | Transaction ID deduplication should handle this |

---

## Environment Variables Reference

```env
# ClickFunnels
CLICKFUNNELS_WEBHOOK_SECRET=your_webhook_secret

# Meta (Facebook) CAPI
META_PURCHASE_PIXEL_ID=1287915349067829
META_PURCHASE_ACCESS_TOKEN=EAAHMla...
META_TEST_EVENT_CODE=  # Empty for production

# General
NEXTAUTH_URL=https://learn.accredipro.academy
DATABASE_URL=postgresql://...
```

---

*Last Updated: December 2024*
