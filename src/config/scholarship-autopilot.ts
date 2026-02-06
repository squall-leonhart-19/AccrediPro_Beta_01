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
 * UPDATED (Feb 2026): Accept any amount from $50+
 * Round numbers only: $50, $100, $150, $200, $250, $300, $350, $400, $500+
 */
export function getCouponTier(offeredAmount: number): CouponTier | null {
    // Accept anything $50 or more (minimum floor)
    if (offeredAmount < 50) {
        return null; // Below minimum - needs manual handling
    }

    // $50-99 → they pay $50
    if (offeredAmount < 100) {
        return {
            theyPay: 50,
            drop: Math.max(0, offeredAmount - 50),
            couponCode: "SCHOLARSHIP50",
            savings: BASE_PRICE - 50,
        };
    }

    // $100-149 → they pay $100
    if (offeredAmount < 150) {
        return {
            theyPay: 100,
            drop: offeredAmount - 100,
            couponCode: "SCHOLARSHIP100",
            savings: BASE_PRICE - 100,
        };
    }

    // $150-199 → they pay $150
    if (offeredAmount < 200) {
        return {
            theyPay: 150,
            drop: offeredAmount - 150,
            couponCode: "SCHOLARSHIP150",
            savings: BASE_PRICE - 150,
        };
    }

    // $200-249 → they pay $200
    if (offeredAmount < 250) {
        return {
            theyPay: 200,
            drop: offeredAmount - 200,
            couponCode: "SCHOLARSHIP200",
            savings: BASE_PRICE - 200,
        };
    }

    // $250-299 → they pay $250
    if (offeredAmount < 300) {
        return {
            theyPay: 250,
            drop: offeredAmount - 250,
            couponCode: "SCHOLARSHIP250",
            savings: BASE_PRICE - 250,
        };
    }

    // $300-349 → they pay $300
    if (offeredAmount < 350) {
        return {
            theyPay: 300,
            drop: offeredAmount - 300,
            couponCode: "SCHOLARSHIP300",
            savings: BASE_PRICE - 300,
        };
    }

    // $350-399 → they pay $350
    if (offeredAmount < 400) {
        return {
            theyPay: 350,
            drop: offeredAmount - 350,
            couponCode: "SCHOLARSHIP350",
            savings: BASE_PRICE - 350,
        };
    }

    // $400-499 → they pay $400
    if (offeredAmount < 500) {
        return {
            theyPay: 400,
            drop: offeredAmount - 400,
            couponCode: "SCHOLARSHIP400",
            savings: BASE_PRICE - 400,
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
 * Generate the full approval response message - SHORT VERSION
 */
export function generateApprovalMessage(
    firstName: string,
    offeredAmount: number,
    tier: CouponTier
): string {
    const caseNumber = generateCaseNumber();

    // Full price - no coupon needed
    if (!tier.couponCode) {
        return `🎉 ${firstName}!! YOU'RE IN!

Check your email in 5 min for login credentials.
Start with Module 1 → learn.accredipro.academy

SO PROUD OF YOU! 💜`;
    }

    // Scholarship approved
    const hasDrop = tier.drop > 0;
    const investmentLine = hasDrop
        ? `${formatCurrency(tier.theyPay)} (Institute covered extra ${formatCurrency(tier.drop)}!)`
        : `${formatCurrency(tier.theyPay)} CONFIRMED!`;

    return `🎉 ${firstName}! Case #${caseNumber} → APPROVED! 💜

Investment: ${investmentLine}

Checkout: ${CHECKOUT_URL}
Code: ✨ ${tier.couponCode} ✨

Link expires in 24h. You've got this! 🔥`;
}


/**
 * Generate "calling Institute" delay message - SHORT VERSION
 */
export function generateCallingMessage(): string {
    return `Calling the Institute now... 📞 Hold tight!`;
}
