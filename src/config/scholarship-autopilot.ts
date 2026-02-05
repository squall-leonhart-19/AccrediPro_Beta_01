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
 */
export function getCouponTier(offeredAmount: number): CouponTier {
    // Floor: minimum is $50
    if (offeredAmount < 50) {
        return {
            theyPay: 50,
            drop: 0,
            couponCode: "SCHOLARSHIP50",
            savings: BASE_PRICE - 50,
        };
    }

    // Exact $50 - no drop (floor)
    if (offeredAmount === 50) {
        return {
            theyPay: 50,
            drop: 0,
            couponCode: "SCHOLARSHIP50",
            savings: BASE_PRICE - 50,
        };
    }

    // $51-100 → they pay $50 (drop $50)
    if (offeredAmount <= 100) {
        return {
            theyPay: 50,
            drop: offeredAmount - 50,
            couponCode: "SCHOLARSHIP50",
            savings: BASE_PRICE - 50,
        };
    }

    // $101-200 → they pay $100 (drop $100)
    if (offeredAmount <= 200) {
        return {
            theyPay: 100,
            drop: offeredAmount - 100,
            couponCode: "SCHOLARSHIP100",
            savings: BASE_PRICE - 100,
        };
    }

    // $201-300 → they pay $200 (drop $100)
    if (offeredAmount <= 300) {
        return {
            theyPay: 200,
            drop: offeredAmount - 200,
            couponCode: "SCHOLARSHIP200",
            savings: BASE_PRICE - 200,
        };
    }

    // $301-400 → they pay $300 (drop $100)
    if (offeredAmount <= 400) {
        return {
            theyPay: 300,
            drop: offeredAmount - 300,
            couponCode: "SCHOLARSHIP300",
            savings: BASE_PRICE - 300,
        };
    }

    // $401-500 → they pay $400 (drop $100)
    if (offeredAmount <= 500) {
        return {
            theyPay: 400,
            drop: offeredAmount - 400,
            couponCode: "SCHOLARSHIP400",
            savings: BASE_PRICE - 400,
        };
    }

    // $501-600 → they pay $500 (drop $100)
    if (offeredAmount <= 600) {
        return {
            theyPay: 500,
            drop: offeredAmount - 500,
            couponCode: "SCHOLARSHIP500",
            savings: BASE_PRICE - 500,
        };
    }

    // $601-700 → they pay $500 (drop $200)
    if (offeredAmount <= 700) {
        return {
            theyPay: 500,
            drop: offeredAmount - 500,
            couponCode: "SCHOLARSHIP500",
            savings: BASE_PRICE - 500,
        };
    }

    // $701-800 → they pay $600 (drop $200)
    if (offeredAmount <= 800) {
        return {
            theyPay: 600,
            drop: offeredAmount - 600,
            couponCode: "SCHOLARSHIP600",
            savings: BASE_PRICE - 600,
        };
    }

    // $801-900 → they pay $700 (drop $200)
    if (offeredAmount <= 900) {
        return {
            theyPay: 700,
            drop: offeredAmount - 700,
            couponCode: "SCHOLARSHIP700",
            savings: BASE_PRICE - 700,
        };
    }

    // $901-1000 → they pay $800 (drop $200)
    if (offeredAmount <= 1000) {
        return {
            theyPay: 800,
            drop: offeredAmount - 800,
            couponCode: "SCHOLARSHIP800",
            savings: BASE_PRICE - 800,
        };
    }

    // $1001-1200 → they pay $800 (drop $400)
    if (offeredAmount <= 1200) {
        return {
            theyPay: 800,
            drop: offeredAmount - 800,
            couponCode: "SCHOLARSHIP800",
            savings: BASE_PRICE - 800,
        };
    }

    // $1201-1500 → they pay $1000 (drop $500)
    if (offeredAmount <= 1500) {
        return {
            theyPay: 1000,
            drop: offeredAmount - 1000,
            couponCode: "SCHOLARSHIP1000",
            savings: BASE_PRICE - 1000,
        };
    }

    // $1501-1999 → they pay $1200
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
