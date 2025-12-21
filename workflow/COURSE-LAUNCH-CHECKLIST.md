# Course Launch Checklist

Master checklist for launching any new certification/course on AccrediPro. Follow this step-by-step for every launch.

---

## Pre-Launch Setup

### 1. Product Configuration (ClickFunnels 2.0)

| Item | Where to Set | Example |
|------|--------------|---------|
| Product SKU | CF Products > Settings | `fm-certification`, `fm-mini-diploma` |
| Product Name | CF Products | "FM Certification - Full Access" |
| Price | CF Products | $997, $27, etc. |
| Checkout URL | CF Funnels | `https://sarah.accredipro.academy/fm-checkout` |
| Bump Products | CF Order Form | Add relevant bumps |
| OTO/Upsell | CF Funnel Steps | Configure post-purchase offers |

### 2. Database Setup (AccrediPro)

```bash
# Create the course in database
npm run db:studio
```

**Required Course Fields:**
- `slug`: URL-friendly identifier (e.g., `fm-certification`)
- `title`: Display name
- `description`: Course description
- `price`: Price in cents (99700 = $997)
- `isPublished`: true
- `thumbnail`: Image URL

**Add to Product Map** (`/api/webhooks/clickfunnels/route.ts` line ~106):
```typescript
const PRODUCT_COURSE_MAP: Record<string, string> = {
  "fm-mini-diploma": "fm-mini-diploma",
  "fm-certification": "fm-certification",  // ADD NEW PRODUCT
  // SKU from ClickFunnels → course slug in database
};
```

### 3. Webhook Configuration (ClickFunnels)

**Webhook URLs:**
| Event Type | Webhook URL |
|------------|-------------|
| Purchase (creates user + enrolls) | `https://learn.accredipro.academy/api/webhooks/clickfunnels` |
| Purchase tracking only (Meta CAPI) | `https://learn.accredipro.academy/api/webhooks/clickfunnels-purchase` |
| Optin/Lead | `https://learn.accredipro.academy/api/auth/register-freebie` |

**CF 2.0 Webhook Setup:**
1. Go to ClickFunnels > Settings > Webhooks
2. Add endpoint URL
3. Select events: `order.completed`, `one-time-order.completed`
4. Copy webhook secret → add to `.env`

**Required ENV Variables:**
```env
CLICKFUNNELS_WEBHOOK_SECRET=your_cf_webhook_secret
CLICKFUNNELS_PURCHASE_WEBHOOK_SECRET=your_purchase_webhook_secret
```

---

## Tracking & Analytics

### 4. Meta (Facebook) Pixel Setup

**Events Sent Automatically:**
| Event | When Fired | Value |
|-------|------------|-------|
| `Purchase` | Webhook receives payment | Product price |
| `Lead` | Optin form submitted | - |

**ENV Variables (already configured):**
```env
META_PURCHASE_PIXEL_ID=1287915349067829
META_PURCHASE_ACCESS_TOKEN=EAAHMla...
META_TEST_EVENT_CODE=  # Empty for production, set for testing
```

**Testing Meta Events:**
1. Set `META_TEST_EVENT_CODE` in .env to your test code
2. Make a test purchase
3. Check Events Manager > Test Events tab
4. Remove test code for production

### 5. Email Tags (Resend)

**Auto-Applied Tags:**
| Tag | Applied When |
|-----|--------------|
| `clickfunnels_purchase` | Any CF purchase |
| `fm_mini_diploma_purchased` | Mini diploma purchase |
| `purchase_27` / `purchase_997` | Purchase by amount |

**Tag Naming Convention:**
- Optins: `{product}_optin` (e.g., `fm_certification_optin`)
- Purchases: `{product}_purchased` (e.g., `fm_certification_purchased`)
- Completion: `{product}_completed` (e.g., `fm_certification_completed`)
- Abandon: `{product}_abandoned` (e.g., `fm_checkout_abandoned`)

---

## Flow: Direct Purchase

```
User → CF Checkout → Pays → CF Webhook fires
                              ↓
                    /api/webhooks/clickfunnels
                              ↓
                    1. Parse CF payload
                    2. Check for duplicate transaction
                    3. Create/find user (password: Futurecoach2025)
                    4. Enroll in course
                    5. Send welcome email (Resend)
                    6. Fire Purchase event (Meta CAPI)
                    7. Add marketing tags
                    8. Log webhook event
                              ↓
                    Return success to CF
```

## Flow: Optin → Nurture → Purchase

```
User → Optin Form → /api/auth/register-freebie
                              ↓
                    1. Create user account
                    2. Add optin tag
                    3. Send Lead event (Meta)
                    4. Trigger email sequence
                              ↓
User → Email Sequence → CF Checkout → Purchase flow above
```

## Flow: Exit Popup Optin

```
User → Exit Intent → Popup Form → /api/auth/register-freebie
                                            ↓
                                  1. Create lead
                                  2. Tag: exit_popup_optin
                                  3. Send Lead event
                                  4. Trigger rescue sequence
```

---

## Webhook Payload Examples

### ClickFunnels 2.0 Purchase

```json
{
  "event_type": "order.completed",
  "data": {
    "id": "ord_abc123",
    "public_id": "ORD-12345",
    "total_amount": 27.00,
    "contact": {
      "email_address": "jane@example.com",
      "first_name": "Jane",
      "last_name": "Doe",
      "phone_number": "+1234567890"
    },
    "line_items": [
      {
        "id": "li_xyz",
        "original_product": {
          "id": "prod_123",
          "name": "FM Mini Diploma"
        },
        "products_variant": {
          "id": "var_456",
          "sku": "fm-mini-diploma",
          "name": "FM Mini Diploma"
        }
      }
    ]
  }
}
```

### Optin Form

```json
{
  "email": "jane@example.com",
  "firstName": "Jane",
  "lastName": "Doe",
  "source": "exit-popup",
  "niche": "functional-medicine"
}
```

---

## Testing Checklist

Before going live:

- [ ] **Test Purchase Flow**
  - [ ] Make test purchase in CF
  - [ ] Verify user created in database
  - [ ] Verify enrollment created
  - [ ] Verify welcome email received
  - [ ] Verify Meta Purchase event in Events Manager

- [ ] **Test Optin Flow**
  - [ ] Submit optin form
  - [ ] Verify user created
  - [ ] Verify tags applied
  - [ ] Verify email sequence started

- [ ] **Test Edge Cases**
  - [ ] Existing user purchases (should enroll, not create new)
  - [ ] Duplicate webhook (should skip, not double-enroll)
  - [ ] Refund webhook (should cancel enrollment)

---

## Troubleshooting

### Webhook Not Firing
1. Check CF Webhook settings > Activity log
2. Check our logs: `npm run logs` or Vercel logs
3. Verify webhook URL is correct
4. Check for CF outages

### User Not Created
1. Check `prisma.webhookEvent` for error logs
2. Verify email in payload
3. Check for duplicate email (user may already exist)

### Meta Events Not Showing
1. Check `META_TEST_EVENT_CODE` is empty for production
2. Verify pixel ID and access token
3. Check Events Manager > Overview (events may be delayed)
4. Look for errors in webhook logs

### Email Not Sent
1. Check Resend dashboard for failures
2. Verify `RESEND_API_KEY` is set
3. Check user email is valid

---

## Quick Reference: API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/webhooks/clickfunnels` | POST | Main purchase webhook (user + enrollment) |
| `/api/webhooks/clickfunnels-purchase` | POST | Purchase tracking only (Meta) |
| `/api/auth/register-freebie` | POST | Optin/lead capture |
| `/api/webhook/enroll` | POST | Generic enrollment webhook |
| `/api/courses/enroll` | POST | Internal enrollment API |

---

## New Course Launch: Quick Steps

1. **ClickFunnels**: Create product with SKU
2. **Database**: Create course with matching slug
3. **Code**: Add SKU → slug mapping to `PRODUCT_COURSE_MAP`
4. **ClickFunnels**: Add webhook pointing to `/api/webhooks/clickfunnels`
5. **Test**: Make test purchase, verify everything works
6. **Launch**: Remove test event code, go live

---

*Last Updated: December 2024*
