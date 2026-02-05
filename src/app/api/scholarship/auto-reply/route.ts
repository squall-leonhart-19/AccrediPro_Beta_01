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

        // Generate messages
        const callingMessage = generateCallingMessage();
        const approvalMessage = generateApprovalMessage(firstName, detectedAmount, tier);

        console.log(`[Scholarship Auto-Reply] ${firstName} offered ${formatCurrency(detectedAmount)} → pays ${formatCurrency(tier.theyPay)} (${tier.couponCode})`);

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
