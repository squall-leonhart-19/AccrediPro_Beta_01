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
 * UPDATED (Feb 2026): Removed $500 minimum - accept ANY amount from $17+
 * Everyone gets approved with scholarship - no rejections!
 */
export function getCouponTier(offeredAmount: number): CouponTier | null {
    // Accept anything $17 or more
    if (offeredAmount < 17) {
        return null; // Only reject if truly absurd
    }

    // $17-46 → they pay $17 (Mini Diploma tier)
    if (offeredAmount < 47) {
        return {
            theyPay: 17,
            drop: Math.max(0, offeredAmount - 17),
            couponCode: "SCHOLARSHIP17",
            savings: BASE_PRICE - 17,
        };
    }

    // $47-96 → they pay $47
    if (offeredAmount < 97) {
        return {
            theyPay: 47,
            drop: offeredAmount - 47,
            couponCode: "SCHOLARSHIP47",
            savings: BASE_PRICE - 47,
        };
    }

    // $97-146 → they pay $97
    if (offeredAmount < 147) {
        return {
            theyPay: 97,
            drop: offeredAmount - 97,
            couponCode: "SCHOLARSHIP97",
            savings: BASE_PRICE - 97,
        };
    }

    // $147-196 → they pay $147
    if (offeredAmount < 197) {
        return {
            theyPay: 147,
            drop: offeredAmount - 147,
            couponCode: "SCHOLARSHIP147",
            savings: BASE_PRICE - 147,
        };
    }

    // $197-296 → they pay $197
    if (offeredAmount < 297) {
        return {
            theyPay: 197,
            drop: offeredAmount - 197,
            couponCode: "SCHOLARSHIP197",
            savings: BASE_PRICE - 197,
        };
    }

    // $297-396 → they pay $297
    if (offeredAmount < 397) {
        return {
            theyPay: 297,
            drop: offeredAmount - 297,
            couponCode: "SCHOLARSHIP297",
            savings: BASE_PRICE - 297,
        };
    }

    // $397-499 → they pay $397
    if (offeredAmount < 500) {
        return {
            theyPay: 397,
            drop: offeredAmount - 397,
            couponCode: "SCHOLARSHIP397",
            savings: BASE_PRICE - 397,
        };
    }

    // $500-549 - Starter tier (no drop)
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

    // Full price - no coupon needed
    if (!tier.couponCode) {
        return `🎉 ${firstName}!! I AM SO EXCITED FOR YOU!

You just made a decision that's going to change your life!

Here's what happens next:

1️⃣ Check your email in the next 5 minutes — you'll get your login credentials
2️⃣ Log into your portal at learn.accredipro.academy  
3️⃣ Start with Module 1 — it's already unlocked for you
4️⃣ Join our private community — links are inside your portal

I'll personally check in on you in 24 hours to see how you're doing.

Congratulations on investing in yourself. You're going to do AMAZING things! 💜

SO PROUD OF YOU!`;
    }

    // Calculate if there's an actual drop (Institute covered more than minimum)
    const hasDrop = tier.drop > 0;

    // Build drop-specific messaging
    const dropMessage = hasDrop
        ? `The Institute just agreed to cover an EXTRA ${formatCurrency(tier.drop)}!\n\nSo instead of ${formatCurrency(offeredAmount)}, your final investment is just ${formatCurrency(tier.theyPay)}! 🙌`
        : `Your investment of ${formatCurrency(tier.theyPay)} is CONFIRMED! 🙌\nYou're saving ${formatCurrency(tier.savings)} off the full program value!`;

    return `🎉 ${firstName}!! AMAZING NEWS — I just got off the phone with the Institute!

Case #${caseNumber} → APPROVED! You're IN! 💜

${dropMessage}

Here's your private checkout link:
${CHECKOUT_URL}

At checkout, enter your scholarship code:
✨ ${tier.couponCode} ✨

This gets you EVERYTHING:
✅ Full FM Certification (Practitioner + Advanced + Master)
✅ All 9 Specializations 
✅ 1:1 Mentorship
✅ Client Acquisition System
✅ Lifetime Access — no renewals ever

I'm holding this spot for you for the next 24 hours. After that, I have to give it to the next person on the waitlist.

You've got this, ${firstName}! I believe in you! 🔥`;
}


/**
 * Generate "calling Institute" delay message
 */
export function generateCallingMessage(): string {
    return `I'm calling the Institute right now... 📞

I'll stay on the line until I get YOUR account pulled up and see what they can do specifically for YOU.

⏳ Give me a couple minutes — this could change everything!`;
}
