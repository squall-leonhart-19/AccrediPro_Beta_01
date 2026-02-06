/**
 * Scholarship Autopilot Configuration
 * 
 * Full autopilot system for "Pay What You Can" scholarship model.
 * When user types a number, AI Sarah auto-responds with:
 * - "Institute covered more" drop logic
 * - Approved amount + savings
 * - Coupon code + checkout link
 */

// ─── ClickFunnels Checkout URL ─────────────────────────────────────
export const CHECKOUT_URL = "https://sarah.accredipro.academy/checkout-fm-certification-program";

// ─── Base Product Price ────────────────────────────────────────────
export const BASE_PRICE = 2000;

// ─── Coupon Tier System ────────────────────────────────────────────
// "Institute covered more" drop logic from SCHOLARSHIP-COUPON-SYSTEM.md

export interface CouponTier {
    theyPay: number;
    drop: number;
    couponCode: string;
    savings: number; // vs base price
}

/**
 * Get coupon tier based on what the user offered
 * Implements the "Institute covered MORE" psychology
 * 
 * NEW SYSTEM (Feb 2026): Minimum $500 floor to filter tire-kickers
 * - Below $500: REJECTED (returns null tier)
 * - $500+: Gets coupon with "Institute covered extra" drop
 */
export function getCouponTier(offeredAmount: number): CouponTier | null {
    // HARD FLOOR: Reject anything below $500
    if (offeredAmount < 500) {
        return null; // Signal rejection - caller must handle
    }

    // Exact $500 - Starter tier (no drop)
    if (offeredAmount < 550) {
        return {
            theyPay: 500,
            drop: 0,
            couponCode: "SCHOLARSHIP500",
            savings: BASE_PRICE - 500,
        };
    }

    // $550-599 → they pay $500 (drop $50-99)
    if (offeredAmount < 600) {
        return {
            theyPay: 500,
            drop: offeredAmount - 500,
            couponCode: "SCHOLARSHIP500",
            savings: BASE_PRICE - 500,
        };
    }

    // $600-699 → they pay $550 (drop $50-149)
    if (offeredAmount < 700) {
        return {
            theyPay: 550,
            drop: offeredAmount - 550,
            couponCode: "SCHOLARSHIP550",
            savings: BASE_PRICE - 550,
        };
    }

    // $700-799 → they pay $600 (drop $100-199)
    if (offeredAmount < 800) {
        return {
            theyPay: 600,
            drop: offeredAmount - 600,
            couponCode: "SCHOLARSHIP600",
            savings: BASE_PRICE - 600,
        };
    }

    // $800-899 → they pay $700 (drop $100-199)
    if (offeredAmount < 900) {
        return {
            theyPay: 700,
            drop: offeredAmount - 700,
            couponCode: "SCHOLARSHIP700",
            savings: BASE_PRICE - 700,
        };
    }

    // $900-999 → they pay $800 (drop $100-199)
    if (offeredAmount < 1000) {
        return {
            theyPay: 800,
            drop: offeredAmount - 800,
            couponCode: "SCHOLARSHIP800",
            savings: BASE_PRICE - 800,
        };
    }

    // $1000-1199 → they pay $900 (drop $100-299)
    if (offeredAmount < 1200) {
        return {
            theyPay: 900,
            drop: offeredAmount - 900,
            couponCode: "SCHOLARSHIP900",
            savings: BASE_PRICE - 900,
        };
    }

    // $1200-1499 → they pay $1000 (drop $200-499)
    if (offeredAmount < 1500) {
        return {
            theyPay: 1000,
            drop: offeredAmount - 1000,
            couponCode: "SCHOLARSHIP1000",
            savings: BASE_PRICE - 1000,
        };
    }

    // $1500-1999 → they pay $1200 (drop $300-799)
    if (offeredAmount < 2000) {
        return {
            theyPay: 1200,
            drop: offeredAmount - 1200,
            couponCode: "SCHOLARSHIP1200",
            savings: BASE_PRICE - 1200,
        };
    }

    // $2000+ → full price, no coupon
    return {
        theyPay: BASE_PRICE,
        drop: 0,
        couponCode: "",
        savings: 0,
    };
}


/**
 * Extract dollar amount from user message
 * Handles: "$500", "500", "$1,000", "1000 dollars", etc.
 */
export function extractAmount(message: string): number | null {
    // Remove commas from numbers
    const cleanMessage = message.replace(/,/g, "");

    // Match patterns like $500, 500, $1000, 500 dollars
    const patterns = [
        /\$(\d+(?:\.\d{2})?)/,           // $500 or $500.00
        /(\d+(?:\.\d{2})?)\s*dollars?/i, // 500 dollars
        /(\d+(?:\.\d{2})?)\s*(?:usd|bucks?)?/i, // 500 usd, 500 bucks
        /(?:pay|afford|invest|offer|budget)[^$\d]*\$?(\d+)/i, // "I can pay 500"
        /(?:only|just|max|maximum)[^$\d]*\$?(\d+)/i, // "only 500"
    ];

    for (const pattern of patterns) {
        const match = cleanMessage.match(pattern);
        if (match && match[1]) {
            const amount = parseFloat(match[1]);
            if (amount > 0 && amount <= 10000) {
                return Math.round(amount);
            }
        }
    }

    // Fallback: find any standalone number that looks like a price
    const numbers = cleanMessage.match(/\b(\d{2,4})\b/g);
    if (numbers) {
        for (const numStr of numbers) {
            const num = parseInt(numStr, 10);
            if (num >= 20 && num <= 5000) {
                return num;
            }
        }
    }

    return null;
}

/**
 * Generate case number for approval message
 */
export function generateCaseNumber(): string {
    return String(1000 + Math.floor(Math.random() * 9000));
}

/**
 * Format currency with commas
 */
export function formatCurrency(amount: number): string {
    return "$" + amount.toLocaleString("en-US");
}

/**
 * Generate the full approval response message
 */
export function generateApprovalMessage(
    firstName: string,
    offeredAmount: number,
    tier: CouponTier
): string {
    const caseNumber = generateCaseNumber();

    // Below minimum floor
    if (offeredAmount < 50) {
        return `I totally understand 💜 The absolute minimum the Institute allows for scholarship recipients is $50 — that still gets you FULL access to everything. 9 certifications, mentorship, lifetime access. Can you make $50 work?`;
    }

    // Full price - no coupon needed
    if (!tier.couponCode) {
        return `🎉 AMAZING NEWS ${firstName}!

Case #${caseNumber} → APPROVED!

You're getting the full certification at full value!

👇 Here's your checkout link:
${CHECKOUT_URL}

This is ONE-TIME payment — includes:
✅ Full FM Certification
✅ 9 Specializations
✅ Community + Mentorship
✅ Business Setup System
✅ Lifetime Access`;
    }

    // Standard approval with drop
    return `🎉 AMAZING NEWS ${firstName}!

Case #${caseNumber} → APPROVED!

The Institute is covering the difference!

Instead of ${formatCurrency(offeredAmount)}, you'll only pay ${formatCurrency(tier.theyPay)}!
You save ${formatCurrency(tier.savings)}! 🙌

👇 Here's your checkout link:
${CHECKOUT_URL}

At the bottom of checkout, apply code:
${tier.couponCode}

This is ONE-TIME payment — includes:
✅ Full FM Certification
✅ 9 Specializations
✅ Community + Mentorship
✅ Business Setup System
✅ Lifetime Access

This scholarship approval expires in 24 hours — grab your spot! 🔥`;
}

/**
 * Generate "calling Institute" delay message
 */
export function generateCallingMessage(): string {
    return `I'm calling the Institute right now... 📞

I'll stay on the line until I get YOUR account pulled up and see what they can do specifically for YOU.

⏳ Give me a couple minutes — this could change everything!`;
}
