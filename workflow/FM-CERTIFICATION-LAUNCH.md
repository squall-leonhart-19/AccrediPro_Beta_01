# FM Certification Launch Checklist

Specific checklist for launching the FM Certification ($997).

---

## Product Details

| Field | Value |
|-------|-------|
| Product Name | FM Certification - Full Access |
| SKU | `fm-certification` |
| Course Slug | `fm-certification` |
| Price | $997 (or $197 promo) |
| Payment Options | Full pay / 3-pay ($397/mo) |
| Thank You Page | `/fm-certification/thank-you` |

---

## Exit Popup Lead Magnet (FM Preview)

### Flow Overview

```
┌─────────────────────────────────────────────────────────────┐
│  EXIT POPUP (on /fm-certification)                          │
│                                                             │
│  Trigger: Mouse leaves top of page (after 3s delay)         │
│  Shows: Sarah's photo + "Get Module 0 & 1 FREE"             │
│  Fields: First Name, Email, Phone                           │
│                                                             │
│  On Submit:                                                 │
│  1. POST /api/fm-preview/register                           │
│  2. Creates user account (password: Futurecoach2025)        │
│  3. Enrolls in FM Preview course                            │
│  4. Fires Meta Lead event                                   │
│  5. Redirects to /dashboard                                 │
└─────────────────────────────────────────────────────────────┘
```

### Components

| Component | Location |
|-----------|----------|
| Exit Popup Component | `src/components/fm-certification/exit-popup.tsx` |
| Register API | `src/app/api/fm-preview/register/route.ts` |
| Exit Intent Hook | `useExitIntent()` in exit-popup.tsx |

### API Endpoint: `/api/fm-preview/register`

**Request:**
```json
{
  "firstName": "Jane",
  "email": "jane@example.com",
  "phone": "+1234567890"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "userId": "clxxx",
    "email": "jane@example.com",
    "isNewUser": true,
    "enrollmentId": "clyyy",
    "metaEventSent": true
  }
}
```

### Tags Applied
- `fm_preview_optin` - When user submits exit popup

### Meta Events
- `Lead` event with content_name: "FM Preview - Module 0 & 1"

---

## ClickFunnels Setup

### Main Funnel Structure

```
┌─────────────────────────────────────────────────────────────┐
│                     SALES FUNNEL                            │
├─────────────────────────────────────────────────────────────┤
│  1. Sales Page (/fm-certification)                          │
│     └─ Exit Popup → FM Preview (Module 0 & 1 free)          │
│                                                             │
│  2. Checkout Page (ClickFunnels)                            │
│     ├─ Main Product: FM Certification ($997 or 3x $397)     │
│     ├─ Bump 1: VIP Coaching Upgrade ($297)                  │
│     └─ Exit Popup → Optin (Lead Capture)                    │
│                                                             │
│  3. OTO 1: Implementation Accelerator ($497)                │
│                                                             │
│  4. OTO 2: Private Mentorship ($1,997)                      │
│                                                             │
│  5. Thank You Page                                          │
│     └─ /fm-certification/thank-you                          │
└─────────────────────────────────────────────────────────────┘
```

### Product SKUs to Configure

| Product | SKU | Price | Webhook Event |
|---------|-----|-------|---------------|
| FM Certification (Full) | `fm-certification` | $997 | `order.completed` |
| FM Certification (3-Pay) | `fm-certification-3pay` | $397 | `subscription.created` |
| VIP Coaching Bump | `fm-vip-coaching` | $297 | `order.completed` |
| Implementation OTO | `fm-implementation` | $497 | `order.completed` |
| Private Mentorship | `fm-mentorship` | $1,997 | `order.completed` |

---

## Database Setup

### 1. Create Course Record

```sql
-- Run in Prisma Studio or via seed script
INSERT INTO Course (
  id,
  slug,
  title,
  description,
  price,
  currency,
  isPublished,
  thumbnail
) VALUES (
  'clxxxxx', -- generate UUID
  'fm-certification',
  'Functional Medicine Certification',
  'Complete FM Certification Program with Accreditation',
  99700,  -- $997 in cents
  'USD',
  true,
  '/courses/fm-certification-thumb.jpg'
);
```

### 2. Update Product Map

In `/api/webhooks/clickfunnels/route.ts`:

```typescript
const PRODUCT_COURSE_MAP: Record<string, string> = {
  "fm-mini-diploma": "fm-mini-diploma",
  // ADD THESE:
  "fm-certification": "fm-certification",
  "fm-certification-3pay": "fm-certification",
  "fm-vip-coaching": "fm-certification",  // Bump enrolls in same course
  "fm-implementation": "fm-implementation-accelerator",  // Separate course
  "fm-mentorship": "fm-private-mentorship",  // Separate course
};
```

---

## Webhook Configuration

### Purchase Webhooks (CF 2.0)

**Webhook URL:** `https://learn.accredipro.academy/api/webhooks/clickfunnels`

**Events to Trigger On:**
- `order.completed` - One-time payments
- `subscription.created` - Payment plan first payment
- `subscription.payment.succeeded` - Subsequent payments
- `order.refunded` - Refunds

### Checkout Exit Popup Optin

**Webhook URL:** `https://learn.accredipro.academy/api/auth/register-freebie`

**Payload to Send:**
```json
{
  "email": "{{contact.email}}",
  "firstName": "{{contact.first_name}}",
  "lastName": "{{contact.last_name}}",
  "source": "fm-checkout-exit",
  "niche": "functional-medicine"
}
```

---

## Email Tags to Create

### In Resend/Marketing System

| Tag | Applied When | Sequence to Trigger |
|-----|--------------|---------------------|
| `fm_certification_optin` | Exit popup submit | Nurture sequence |
| `fm_certification_purchased` | Main purchase | Welcome sequence |
| `fm_certification_3pay` | Payment plan started | Payment reminder sequence |
| `fm_vip_purchased` | VIP bump added | VIP welcome email |
| `fm_checkout_abandoned` | Checkout started but not completed | Abandon cart sequence |
| `fm_certification_completed` | All modules done | Completion + upsell sequence |

---

## Meta Pixel Events

### Events Fired Automatically

| Event | Trigger | Value | Content Name |
|-------|---------|-------|--------------|
| `Purchase` | Main product | $997 | "FM Certification" |
| `Purchase` | Each bump/OTO | Product price | Product name |
| `Lead` | Exit popup optin | - | - |
| `InitiateCheckout` | Checkout page load | $997 | (add to page) |

### Add to Checkout Page (CF)

```html
<!-- InitiateCheckout Event -->
<script>
  fbq('track', 'InitiateCheckout', {
    value: 997.00,
    currency: 'USD',
    content_name: 'FM Certification'
  });
</script>
```

---

## Welcome Email Template

```
Subject: 🎉 Welcome to Your FM Certification Journey!

Hi {{firstName}},

You did it! You just made one of the best decisions of your career.

Your FM Certification program is ready and waiting for you:

👉 Login here: https://learn.accredipro.academy

Your login credentials:
Email: {{email}}
Password: Futurecoach2025 (please change this after logging in)

What happens next:
1. Log in to your dashboard
2. Start with Module 1: Foundations
3. Complete each module to unlock the next
4. Earn your accredited certification!

If you have any questions, just reply to this email.

Welcome to the AccrediPro family!

Sarah
Founder, AccrediPro Academy
```

---

## Testing Checklist

### Pre-Launch Tests

- [ ] **Test Purchase - Full Pay**
  - [ ] User created with correct name/email
  - [ ] Enrolled in `fm-certification` course
  - [ ] Welcome email sent
  - [ ] Meta Purchase event fired ($997)
  - [ ] Tag `fm_certification_purchased` applied

- [ ] **Test Purchase - Payment Plan**
  - [ ] User created
  - [ ] Enrolled in course
  - [ ] Tag `fm_certification_3pay` applied
  - [ ] Subscription tracking set up

- [ ] **Test Bump Purchase**
  - [ ] VIP bump added to order
  - [ ] Separate Purchase event for bump ($297)
  - [ ] VIP tag applied

- [ ] **Test Exit Popup Optin**
  - [ ] Lead created in database
  - [ ] Tag `fm_certification_optin` applied
  - [ ] Nurture sequence triggered
  - [ ] Meta Lead event fired

- [ ] **Test Refund**
  - [ ] Enrollment cancelled
  - [ ] Access revoked
  - [ ] Refund logged

### Integration Tests

- [ ] Existing mini-diploma user purchases → upgrades correctly
- [ ] Duplicate purchase webhook → handled (no double enrollment)
- [ ] Payment plan failure → notification sent

---

## Go-Live Checklist

1. [ ] Course created in database with all modules
2. [ ] Product map updated in webhook code
3. [ ] Webhooks configured in ClickFunnels
4. [ ] Email sequences created and connected
5. [ ] Meta pixel events verified in test mode
6. [ ] Remove `META_TEST_EVENT_CODE` from .env
7. [ ] Deploy to production
8. [ ] Make one final test purchase
9. [ ] **LAUNCH!**

---

## Post-Launch Monitoring

### First 24 Hours
- Monitor webhook logs for errors
- Check Meta Events Manager for purchases
- Verify emails are delivering
- Watch for support tickets

### First Week
- Check completion rates
- Monitor payment plan failures
- Review abandon cart recovery
- Analyze funnel conversion rates

---

*Last Updated: December 2024*
