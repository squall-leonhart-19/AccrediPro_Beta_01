# ASI Scholarship Coupon System — Strategy & Setup

## Overview

One Stripe product, dynamic coupon codes. "Pay What You Can" scholarship model where every prospect pays through the same checkout link with a personalized coupon code.

**Product:** ASI Functional Medicine Practitioner Certification
**Base Price:** $2,000
**Checkout:** Single Stripe checkout URL (same for everyone)
**Pricing:** Controlled via coupon codes applied at checkout

---

## The Closer Method: "Institute Covered More"

When a prospect names their price, Sarah NEVER accepts the number they give. Instead:

1. Prospect says their budget → e.g. "$500"
2. Sarah says: "Let me check with the Institute..."
3. Sarah comes back: "Amazing news! The Institute wants to cover even MORE for you. Instead of $500, your scholarship covers everything for just $400! Use code SCHOLARSHIP400 at checkout 💜"
4. Prospect pays LESS than they offered → feels like they won

**Psychology:**
- Reciprocity — Sarah fought for them, they feel obligated to act
- Surprise — they got MORE than expected, kills hesitation
- Urgency — "before anyone changes their mind"
- Zero buyer's remorse — they're paying less than their own number
- Sarah is on THEIR side — not a salesperson, an advocate

---

## Drop Tiers (Hormozi Method)

The discount scales with commitment level. Higher offers = bigger drops = bigger wow = zero refunds.

| Tier | They Say | Drop | They Pay | Coupon Code |
|------|----------|------|----------|-------------|
| Floor | Under $50 | "Minimum is $50" | $50 | SCHOLARSHIP50 |
| Floor | $50 | No drop (floor) | $50 | SCHOLARSHIP50 |
| Low | $100 | -$50 | $50 | SCHOLARSHIP50 |
| Low | $200 | -$100 | $100 | SCHOLARSHIP100 |
| Mid | $300 | -$100 | $200 | SCHOLARSHIP200 |
| Mid | $400 | -$100 | $300 | SCHOLARSHIP300 |
| Mid | $500 | -$100 | $400 | SCHOLARSHIP400 |
| Mid | $600 | -$100 | $500 | SCHOLARSHIP500 |
| High | $700 | -$200 | $500 | SCHOLARSHIP500 |
| High | $800 | -$200 | $600 | SCHOLARSHIP600 |
| High | $900 | -$200 | $700 | SCHOLARSHIP700 |
| High | $1000 | -$200 | $800 | SCHOLARSHIP800 |
| Premium | $1200 | -$400 | $800 | SCHOLARSHIP800 |
| Premium | $1500 | -$500 | $1000 | SCHOLARSHIP1000 |
| Premium | $2000 | full price | $2000 | (no coupon) |

**Logic:**
- Low ($100-200): -$50 drop — they're stretching, $50 feels generous
- Mid ($300-600): -$100 drop — standard "Institute bonus"
- High ($700-1000): -$200 drop — big surprise, locks commitment
- Premium ($1200+): -$400/500 drop — insane overdeliver, zero refund risk

---

## Stripe Coupons to Create

**Product:** ASI Functional Medicine Practitioner Certification — $2,000
**Type:** All coupons are "Fixed amount off", unlimited redemptions

| # | Coupon Code | Discount Amount | Customer Pays |
|---|-------------|----------------|---------------|
| 1 | SCHOLARSHIP50 | $1,950 off | $50 |
| 2 | SCHOLARSHIP100 | $1,900 off | $100 |
| 3 | SCHOLARSHIP200 | $1,800 off | $200 |
| 4 | SCHOLARSHIP300 | $1,700 off | $300 |
| 5 | SCHOLARSHIP400 | $1,600 off | $400 |
| 6 | SCHOLARSHIP500 | $1,500 off | $500 |
| 7 | SCHOLARSHIP600 | $1,400 off | $600 |
| 8 | SCHOLARSHIP700 | $1,300 off | $700 |
| 9 | SCHOLARSHIP800 | $1,200 off | $800 |
| 10 | SCHOLARSHIP1000 | $1,000 off | $1,000 |
| 11 | SCHOLARSHIP1200 | $800 off | $1,200 |

**Total: 11 coupons**

---

## Sarah's Scripts

### Under $50 (Floor)
> "I totally understand 💜 The absolute minimum the Institute allows for scholarship recipients is $50 — that still gets you FULL access to everything. 9 certifications, mentorship, lifetime access. Can you make $50 work?"

### Standard Close ($100-$1000)
> "Let me call the Institute real quick to check on your scholarship... ⏳"
> *(2 min delay)*
> "Amazing news! 🎉 I just spoke with the Institute and they want to support you even MORE. Instead of $[THEIR AMOUNT], your scholarship covers everything for just $[LOWER AMOUNT]! Use code SCHOLARSHIP[AMOUNT] at checkout → [CHECKOUT LINK]"

### Premium Close ($1200+)
> "I just got off the phone with the Director — and you won't believe this 🎉 She approved an ADDITIONAL scholarship grant for you. Instead of $[THEIR AMOUNT], you'll only pay $[LOWER AMOUNT]. That's $[DROP] LESS than you offered. Use code SCHOLARSHIP[AMOUNT] → [CHECKOUT LINK]"

### They Hesitate After Getting Code
> "I totally understand wanting to think about it 💜 Just so you know — I can only hold this scholarship approval for 24 hours. After that, your spot goes to the next person on the waitlist. The code SCHOLARSHIP[X] is yours — use it whenever you're ready today!"

### They Try to Go Lower After Quote
> "I wish I could go lower 😔 $[AMOUNT] is already the maximum scholarship the Institute can offer. That's $[DISCOUNT] off the $2,000 certification. I genuinely can't get a better rate than this — but I promise it includes absolutely everything."

---

## What the Prospect Sees at Checkout

```
ASI Functional Medicine Practitioner Certification
$2,000.00

Coupon: SCHOLARSHIP500 ✅
Discount: -$1,500.00

Total: $500.00
```

They see:
1. The $2,000 value (price anchor)
2. The word "SCHOLARSHIP" (reframes payment as achievement)
3. The massive discount amount (feels like they won)
4. A clean total they agreed to (or less)

---

## Admin Quick Actions

When admin sees a chat and the prospect names a price:

1. Look up their amount in the Drop Tiers table above
2. Use the "Institute covered more" script
3. Send the coupon code + checkout link
4. If they don't convert within 2 hours, send urgency follow-up
5. At 20 hours, send "4 hours left" warning
6. At 24 hours, scholarship "expires" (can be re-extended)

---

## Edge Cases

| Scenario | Response |
|----------|----------|
| Says $10-25 | "Minimum is $50" script |
| Says $50 | Give SCHOLARSHIP50 straight, no "Institute" move |
| Says $100 | "Institute covered more!" → SCHOLARSHIP50 ($50) |
| Says weird number like $175 | Round UP to next tier ($200) → drop to $100 |
| Says $2000 (full price) | No coupon needed, direct checkout |
| Doesn't name a number | Sarah asks: "What feels comfortable for your situation right now?" |
| Says "I can't afford anything" | "Minimum is $50" script, emphasize $2,000 value |
| Wants payment plan | Handle separately (Stripe payment links with installments) |

---

## Stripe Setup Checklist

- [ ] Create product: "ASI Functional Medicine Practitioner Certification" at $2,000
- [ ] Add product description: "Full FM Certification • 9 Clinical Specializations • Lifetime Access • Mentorship • Protocol Library • Business Setup System"
- [ ] Create 11 coupon codes (table above)
- [ ] Set all coupons to: unlimited redemptions, no expiry
- [ ] Create checkout link for the product
- [ ] Test each coupon code on checkout
- [ ] Add checkout URL to codebase config

---

## After Stripe Setup

Provide:
1. **Checkout URL** (the single Stripe checkout link)
2. **Confirm all 11 coupons are created**

Then we wire up:
- JSON config replacing placeholder links
- AI Sarah's system prompt with checkout URL + coupon logic
- Admin panel quick-reply templates
- Cron sequence emails with real checkout URL
- Auto-coupon matching logic (prospect says amount → system picks coupon)
