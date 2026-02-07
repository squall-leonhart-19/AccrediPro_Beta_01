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
 * 3. Returns the approval message with coupon code + checkout link
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

        // Get coupon tier based on amount
        const tier = getCouponTier(detectedAmount);

        // REJECTION: Amount below $200 minimum
        if (!tier) {
            const rejectionMessage = `I hear you \u{1F49C} The Institute needs minimum $200 to activate your scholarship \u2014 that's 96% OFF.

${firstName}, for just $200 you get EVERYTHING:

\u2705 Full BC-FMP\u2122 Board Certification (20 Modules)
\u2705 Done-For-You Website \u2014 LIVE in 48h
\u2705 6 Months 1:1 Mentorship with me
\u2705 9 Board Accreditations + 20 Certificates
\u2705 Legal Templates + Client Management System
\u2705 Lifetime Access \u2014 zero recurring fees

That's $200 for a $4,997 program. Other programs charge $8K-$15K for less.

Can you make $200 work? I'll call the Institute right now \u{1F4DE}`;

            console.log(`[Scholarship Auto-Reply] ${firstName} offered ${formatCurrency(detectedAmount)} \u2192 REJECTED (below $200 minimum)`);

            return NextResponse.json({
                hasAmount: true,
                detectedAmount,
                callingMessage: null,
                approvalMessage: null,
                rejectionMessage, // NEW: Signal rejection with message
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

        console.log(`[Scholarship Auto-Reply] ${firstName} offered ${formatCurrency(detectedAmount)} \u2192 pays ${formatCurrency(tier.theyPay)} (${tier.couponCode})`);

        return NextResponse.json({
            hasAmount: true,
            detectedAmount,
            callingMessage,
            approvalMessage,
            tier,
            checkoutUrl: CHECKOUT_URL,
            fullContext: {
                firstName,
                lastName: lastName || "",
                email: email || "",
                visitorId: visitorId || "",
                offeredAmount: detectedAmount,
                finalAmount: tier.theyPay,
                couponCode: tier.couponCode || null,
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
