/**
 * Scholarship Coupon System Configuration
 *
 * Single Stripe product at $2,000 with coupon codes for dynamic pricing.
 * Uses the "Institute Covered More" closer method — always round DOWN
 * to give the prospect MORE discount than they asked for.
 *
 * CHECKOUT_URL: Set this to your Stripe checkout link for the $2,000 product.
 * Coupon codes are applied at checkout by the prospect.
 */

// ─── Stripe Checkout URL ────────────────────────────────────────────
// TODO: Replace with your actual Stripe checkout URL after creating the product
export const STRIPE_CHECKOUT_URL = "https://buy.stripe.com/REPLACE_WITH_YOUR_CHECKOUT_URL";

// ─── Product Info ───────────────────────────────────────────────────
export const PRODUCT_NAME = "ASI Functional Medicine Practitioner Certification";
export const PRODUCT_PRICE = 2000; // Base price in USD

// ─── Coupon Codes ───────────────────────────────────────────────────
export interface ScholarshipCoupon {
  code: string;         // Coupon code the prospect enters at checkout
  customerPays: number; // What the prospect actually pays
  discount: number;     // Fixed $ amount off (Stripe discount)
  label: string;        // Display label
}

export const SCHOLARSHIP_COUPONS: ScholarshipCoupon[] = [
  { code: "SCHOLARSHIP50",   customerPays: 50,   discount: 1950, label: "$50" },
  { code: "SCHOLARSHIP100",  customerPays: 100,  discount: 1900, label: "$100" },
  { code: "SCHOLARSHIP200",  customerPays: 200,  discount: 1800, label: "$200" },
  { code: "SCHOLARSHIP300",  customerPays: 300,  discount: 1700, label: "$300" },
  { code: "SCHOLARSHIP400",  customerPays: 400,  discount: 1600, label: "$400" },
  { code: "SCHOLARSHIP500",  customerPays: 500,  discount: 1500, label: "$500" },
  { code: "SCHOLARSHIP600",  customerPays: 600,  discount: 1400, label: "$600" },
  { code: "SCHOLARSHIP700",  customerPays: 700,  discount: 1300, label: "$700" },
  { code: "SCHOLARSHIP800",  customerPays: 800,  discount: 1200, label: "$800" },
  { code: "SCHOLARSHIP1000", customerPays: 1000, discount: 1000, label: "$1,000" },
  { code: "SCHOLARSHIP1200", customerPays: 1200, discount: 800,  label: "$1,200" },
];

// ─── "Institute Covered More" Closer Logic ──────────────────────────
// When a prospect names their price, we ALWAYS drop them to a lower tier.
// This creates the "wow" moment: they pay LESS than they offered.
//
// Drop tiers:
//   Low ($100-200): -$50 drop
//   Mid ($300-600): -$100 drop
//   High ($700-1000): -$200 drop
//   Premium ($1200+): -$400/500 drop

interface CloserMapping {
  minOffer: number;  // If they offer this amount or more...
  maxOffer: number;  // ...up to this amount...
  giveCoupon: string; // ...give them this coupon (lower than what they offered)
  customerPays: number;
}

export const CLOSER_MAPPINGS: CloserMapping[] = [
  // Under $50 → "Minimum is $50" (floor)
  { minOffer: 0,    maxOffer: 49,   giveCoupon: "SCHOLARSHIP50",   customerPays: 50 },
  // $50 → give $50 straight (it's the floor, no drop)
  { minOffer: 50,   maxOffer: 99,   giveCoupon: "SCHOLARSHIP50",   customerPays: 50 },
  // $100 → Institute covers more → $50 (-$50 drop)
  { minOffer: 100,  maxOffer: 149,  giveCoupon: "SCHOLARSHIP50",   customerPays: 50 },
  // $150-199 → $100 (-$50 drop)
  { minOffer: 150,  maxOffer: 199,  giveCoupon: "SCHOLARSHIP100",  customerPays: 100 },
  // $200-299 → $100 (-$100 drop)
  { minOffer: 200,  maxOffer: 299,  giveCoupon: "SCHOLARSHIP100",  customerPays: 100 },
  // $300-399 → $200 (-$100 drop)
  { minOffer: 300,  maxOffer: 399,  giveCoupon: "SCHOLARSHIP200",  customerPays: 200 },
  // $400-499 → $300 (-$100 drop)
  { minOffer: 400,  maxOffer: 499,  giveCoupon: "SCHOLARSHIP300",  customerPays: 300 },
  // $500-599 → $400 (-$100 drop)
  { minOffer: 500,  maxOffer: 599,  giveCoupon: "SCHOLARSHIP400",  customerPays: 400 },
  // $600-699 → $500 (-$100 drop)
  { minOffer: 600,  maxOffer: 699,  giveCoupon: "SCHOLARSHIP500",  customerPays: 500 },
  // $700-799 → $500 (-$200 drop)
  { minOffer: 700,  maxOffer: 799,  giveCoupon: "SCHOLARSHIP500",  customerPays: 500 },
  // $800-899 → $600 (-$200 drop)
  { minOffer: 800,  maxOffer: 899,  giveCoupon: "SCHOLARSHIP600",  customerPays: 600 },
  // $900-999 → $700 (-$200 drop)
  { minOffer: 900,  maxOffer: 999,  giveCoupon: "SCHOLARSHIP700",  customerPays: 700 },
  // $1000-1199 → $800 (-$200 drop)
  { minOffer: 1000, maxOffer: 1199, giveCoupon: "SCHOLARSHIP800",  customerPays: 800 },
  // $1200-1499 → $800 (-$400 drop)
  { minOffer: 1200, maxOffer: 1499, giveCoupon: "SCHOLARSHIP800",  customerPays: 800 },
  // $1500+ → $1000 (-$500 drop)
  { minOffer: 1500, maxOffer: 99999, giveCoupon: "SCHOLARSHIP1000", customerPays: 1000 },
];

// ─── Helper Functions ───────────────────────────────────────────────

/**
 * Given the amount a prospect offered, returns the coupon to give them
 * using the "Institute Covered More" closer method.
 */
export function getCloserCoupon(offeredAmount: number): {
  coupon: ScholarshipCoupon;
  isFloor: boolean;       // True if they offered under $50 (floor scenario)
  theirOffer: number;     // What they said
  theySave: number;       // How much less they pay vs their offer
} | null {
  const mapping = CLOSER_MAPPINGS.find(
    m => offeredAmount >= m.minOffer && offeredAmount <= m.maxOffer
  );
  if (!mapping) return null;

  const coupon = SCHOLARSHIP_COUPONS.find(c => c.code === mapping.giveCoupon);
  if (!coupon) return null;

  return {
    coupon,
    isFloor: offeredAmount < 50,
    theirOffer: offeredAmount,
    theySave: Math.max(0, offeredAmount - coupon.customerPays),
  };
}

/**
 * Get the checkout URL with a specific coupon code pre-filled.
 * Stripe checkout links support ?prefilled_promo_code=CODE
 */
export function getCheckoutUrl(couponCode?: string): string {
  if (!couponCode) return STRIPE_CHECKOUT_URL;
  // Stripe checkout supports prefilled promo codes via URL parameter
  const separator = STRIPE_CHECKOUT_URL.includes("?") ? "&" : "?";
  return `${STRIPE_CHECKOUT_URL}${separator}prefilled_promo_code=${couponCode}`;
}

/**
 * Parse a dollar amount from a user's chat message.
 * Handles: "$100", "100", "$1,000", "1000", "100.00", etc.
 */
export function parseAmountFromMessage(message: string): number | null {
  const match = message.match(/\$?([\d,]{1,6})(?:\.\d{2})?/);
  if (!match) return null;
  const num = parseInt(match[1].replace(/,/g, ""), 10);
  if (num < 1 || num > 100000) return null;
  return num;
}

/**
 * Get a coupon by its code name
 */
export function getCouponByCode(code: string): ScholarshipCoupon | null {
  return SCHOLARSHIP_COUPONS.find(c => c.code === code) || null;
}

// ─── Legacy compatibility ───────────────────────────────────────────
// These maintain backward compatibility with old code that imported these names

export interface PaymentLinkConfig {
  amount: number;
  label: string;
  stripeLink: string;
  description: string;
}

export const SCHOLARSHIP_PAYMENT_LINKS: PaymentLinkConfig[] = SCHOLARSHIP_COUPONS.map(c => ({
  amount: c.customerPays,
  label: c.label,
  stripeLink: getCheckoutUrl(c.code),
  description: `Scholarship - ${c.label} (code: ${c.code})`,
}));

export function findClosestPaymentLink(amount: number): PaymentLinkConfig | null {
  const result = getCloserCoupon(amount);
  if (!result) return null;
  return SCHOLARSHIP_PAYMENT_LINKS.find(p => p.amount === result.coupon.customerPays) || null;
}

export function getPaymentLink(amount: number): string | null {
  const result = getCloserCoupon(amount);
  if (!result) return null;
  return getCheckoutUrl(result.coupon.code);
}
