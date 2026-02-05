import { NextRequest, NextResponse } from "next/server";
import {
    sendScholarshipApprovedEmail,
    saveScholarshipApproval,
} from "@/lib/scholarship-emails";
import prisma from "@/lib/prisma";

/**
 * POST /api/scholarship/send-approval-email
 * 
 * Triggered when user types an amount and gets approved.
 * Sends Email #2 (plain text) and saves tags to DB.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, firstName, amount, finalAmount, couponCode, savings } = body;

        if (!email || !firstName || !amount || !finalAmount || !couponCode) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: email.toLowerCase().trim() },
            select: { id: true },
        });

        // Send Email #2: Scholarship Approved
        const emailResult = await sendScholarshipApprovedEmail({
            to: email,
            firstName,
            amount,
            finalAmount,
            couponCode,
            savings,
        });

        // Save approval tags if user exists
        if (user) {
            await saveScholarshipApproval(user.id, amount, finalAmount, couponCode);
        }

        console.log(`[Scholarship] Approval email sent to ${email} - $${finalAmount}`);

        return NextResponse.json({
            success: true,
            emailId: emailResult.id,
            userId: user?.id,
        });
    } catch (error) {
        console.error("[Scholarship] Send approval email error:", error);
        return NextResponse.json(
            { error: "Failed to send approval email" },
            { status: 500 }
        );
    }
}
