import { NextRequest, NextResponse } from "next/server";
import {
    extractAmount,
    getCouponTier,
    generateApprovalMessage,
    generateCallingMessage,
    CHECKOUT_URL,
    formatCurrency,
} from "@/config/scholarship-autopilot";

/**
 * Scholarship Auto-Reply API
 *
 * Full autopilot system for handling scholarship price negotiations.
 * When a user messages with a dollar amount, this API:
 * 1. Extracts the amount
 * 2. Applies the "Institute covered more" drop logic
 * 3. Returns the approval message with direct Fanbasis checkout link
 */

export interface AutoReplyRequest {
    message: string;
    firstName: string;
    lastName?: string;
    email?: string;
    visitorId?: string;
    quizData?: {
        type?: string;
        goal?: string;
        currentIncome?: string;
        experience?: string;
        clinicalReady?: string;
        labInterest?: string;
        pastCerts?: string;
        missingSkill?: string;
        commitment?: string;
        vision?: string;
        startTimeline?: string;
    };
}

export interface AutoReplyResponse {
    hasAmount: boolean;
    detectedAmount: number | null;
    callingMessage: string | null;
    approvalMessage: string | null;
    tier: {
        theyPay: number;
        drop: number;
        couponCode: string;
        savings: number;
        checkoutUrl?: string;
    } | null;
    checkoutUrl: string;
    fullContext: {
        firstName: string;
        lastName: string;
        email: string;
        visitorId: string;
        offeredAmount: number | null;
        finalAmount: number | null;
        couponCode: string | null;
        quizData: AutoReplyRequest["quizData"];
    };
}

export async function POST(req: NextRequest) {
    try {
        const body: AutoReplyRequest = await req.json();
        const { message, firstName, lastName, email, visitorId, quizData } = body;

        if (!message || !firstName) {
            return NextResponse.json(
                { error: "message and firstName are required" },
                { status: 400 }
            );
        }

        // Extract amount from message
        const detectedAmount = extractAmount(message);

        if (!detectedAmount) {
            // No amount detected - return null responses
            return NextResponse.json({
                hasAmount: false,
                detectedAmount: null,
                callingMessage: null,
                approvalMessage: null,
                tier: null,
                checkoutUrl: CHECKOUT_URL,
                fullContext: {
                    firstName,
                    lastName: lastName || "",
                    email: email || "",
                    visitorId: visitorId || "",
                    offeredAmount: null,
                    finalAmount: null,
                    couponCode: null,
                    quizData,
                },
            } satisfies AutoReplyResponse);
        }

        // Get tier based on amount
        const tier = getCouponTier(detectedAmount);

        // REJECTION: Amount below $100 minimum
        if (!tier) {
            const rejectionMessage = `I hear you \u{1F49C} The Institute needs a bit more to activate your scholarship.

${firstName}, can you do $100? For just $100 you get the FULL program:

\u2705 Full BC-FMP\u2122 Board Certification (20 Modules \u2014 4 Levels)
\u2705 Done-For-You Website to attract clients
\u2705 Business Box + Legal Templates
\u2705 Coach Workspace + Client Management Tools
\u2705 Lifetime Access \u2014 zero recurring fees

That's $100 for a $4,997 program. The Institute covers the rest.

Can you make $100 work? I'll call them right now \u{1F4DE}`;

            console.log(`[Scholarship Auto-Reply] ${firstName} offered ${formatCurrency(detectedAmount)} \u2192 REJECTED (below $100 minimum)`);

            return NextResponse.json({
                hasAmount: true,
                detectedAmount,
                callingMessage: null,
                approvalMessage: null,
                rejectionMessage,
                tier: null,
                checkoutUrl: CHECKOUT_URL,
                fullContext: {
                    firstName,
                    lastName: lastName || "",
                    email: email || "",
                    visitorId: visitorId || "",
                    offeredAmount: detectedAmount,
                    requestedAmount: detectedAmount,
                    finalAmount: null,
                    couponCode: null,
                    quizData,
                },
            });
        }

        // Generate messages
        const callingMessage = generateCallingMessage();
        const approvalMessage = generateApprovalMessage(firstName, detectedAmount, tier);

        console.log(`[Scholarship Auto-Reply] ${firstName} offered ${formatCurrency(detectedAmount)} \u2192 pays ${formatCurrency(tier.theyPay)} (Fanbasis link)`);

        return NextResponse.json({
            hasAmount: true,
            detectedAmount,
            callingMessage,
            approvalMessage,
            tier,
            checkoutUrl: tier.checkoutUrl || CHECKOUT_URL,
            fullContext: {
                firstName,
                lastName: lastName || "",
                email: email || "",
                visitorId: visitorId || "",
                offeredAmount: detectedAmount,
                finalAmount: tier.theyPay,
                couponCode: null,
                quizData,
            },
        } satisfies AutoReplyResponse);

    } catch (error) {
        console.error("Scholarship auto-reply error:", error);
        return NextResponse.json(
            { error: "Failed to process auto-reply" },
            { status: 500 }
        );
    }
}
