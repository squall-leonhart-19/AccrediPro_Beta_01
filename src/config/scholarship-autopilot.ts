/**
 * Scholarship Autopilot Configuration
 *
 * Full autopilot system for "Pay What You Can" scholarship model.
 * When user types a number, AI Sarah auto-responds with:
 * - "Institute covered even more" psychology
 * - Approved amount + savings breakdown
 * - Direct Fanbasis checkout link (discount auto-applied, no coupon needed)
 */

// ─── Fanbasis Checkout Links (discount auto-applied per tier) ────
const FANBASIS_LINKS: Record<number, string> = {
    100: "https://www.fanbasis.com/agency-checkout/AccrediPro/p8WmQ",
    200: "https://www.fanbasis.com/agency-checkout/AccrediPro/wVDqR",
    300: "https://www.fanbasis.com/agency-checkout/AccrediPro/xnEr9",
    400: "https://www.fanbasis.com/agency-checkout/AccrediPro/zvJwY",
    500: "https://www.fanbasis.com/agency-checkout/AccrediPro/lxyy1",
};

// Fallback checkout URL
export const CHECKOUT_URL = "https://www.fanbasis.com/agency-checkout/AccrediPro/wVDqR";

// ─── Program Full Price (for savings display) ────────────────────
export const FULL_PRICE = 4997;

// ─── Base Product Price (actual base for tier logic) ─────────────
export const BASE_PRICE = 2000;

// ─── Scholarship Tier System ─────────────────────────────────────

export interface CouponTier {
    theyPay: number;
    drop: number;
    couponCode: string; // kept for compatibility but empty — no codes needed
    savings: number;
    checkoutUrl: string; // direct Fanbasis link with discount auto-applied
}

/**
 * Get the closest checkout link for a given amount
 * Maps to the nearest Fanbasis tier: $100, $200, $300, $400, $500
 */
function getCheckoutLink(amount: number): string {
    if (amount <= 100) return FANBASIS_LINKS[100];
    if (amount <= 200) return FANBASIS_LINKS[200];
    if (amount <= 300) return FANBASIS_LINKS[300];
    if (amount <= 400) return FANBASIS_LINKS[400];
    return FANBASIS_LINKS[500];
}

/**
 * Get scholarship tier based on what the user offered
 * Implements the "Institute covered EVEN MORE" psychology
 *
 * NEW (Feb 2026): Accept any amount from $100+
 * Direct Fanbasis links — no coupon codes needed
 * If they say more than $500, Institute "covered even more"
 */
export function getCouponTier(offeredAmount: number): CouponTier | null {
    // Accept anything $100 or more
    if (offeredAmount < 100) {
        return null; // Below minimum
    }

    // $100-199 → they pay $100
    if (offeredAmount < 200) {
        return {
            theyPay: 100,
            drop: offeredAmount - 100,
            couponCode: "",
            savings: FULL_PRICE - 100,
            checkoutUrl: FANBASIS_LINKS[100],
        };
    }

    // $200-299 → they pay $200
    if (offeredAmount < 300) {
        return {
            theyPay: 200,
            drop: offeredAmount - 200,
            couponCode: "",
            savings: FULL_PRICE - 200,
            checkoutUrl: FANBASIS_LINKS[200],
        };
    }

    // $300-399 → they pay $300
    if (offeredAmount < 400) {
        return {
            theyPay: 300,
            drop: offeredAmount - 300,
            couponCode: "",
            savings: FULL_PRICE - 300,
            checkoutUrl: FANBASIS_LINKS[300],
        };
    }

    // $400-499 → they pay $400
    if (offeredAmount < 500) {
        return {
            theyPay: 400,
            drop: offeredAmount - 400,
            couponCode: "",
            savings: FULL_PRICE - 400,
            checkoutUrl: FANBASIS_LINKS[400],
        };
    }

    // $500+ → they pay $500 (Institute covered even more!)
    return {
        theyPay: 500,
        drop: Math.max(0, offeredAmount - 500),
        couponCode: "",
        savings: FULL_PRICE - 500,
        checkoutUrl: FANBASIS_LINKS[500],
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
 * Now uses direct Fanbasis links — no coupon codes needed!
 */
export function generateApprovalMessage(
    firstName: string,
    offeredAmount: number,
    tier: CouponTier
): string {
    const caseNumber = generateCaseNumber();
    const savingsDisplay = formatCurrency(tier.savings);
    const instituteCovered = tier.drop > 0
        ? `\nThe Institute covered an extra ${formatCurrency(tier.drop)} on top of your scholarship!`
        : "";

    return `🎉 ${firstName}! Case #${caseNumber} — APPROVED! 💜
${instituteCovered}
You pay: ${formatCurrency(tier.theyPay)} (instead of ${formatCurrency(FULL_PRICE)})
You save: ${savingsDisplay}

Scholarship discount auto-applied — just tap and enroll:

👉 ${tier.checkoutUrl}

⏰ This scholarship expires in 10 minutes — tap the link and you're in!`;
}


/**
 * Generate "calling Institute" delay message - SHORT VERSION
 */
export function generateCallingMessage(): string {
    return `Calling the Institute now... 📞 Hold tight!`;
}
