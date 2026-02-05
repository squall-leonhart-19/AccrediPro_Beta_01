import { NextRequest, NextResponse } from "next/server";
import { sendScholarshipWelcomeEmail } from "@/lib/scholarship-emails";
import prisma from "@/lib/prisma";

/**
 * POST /api/scholarship/send-welcome-email
 * 
 * Triggered when user says "paid/done" in chat.
 * Sends Email #5 (Welcome to the family!) and marks as purchased.
 */
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, firstName } = body;

        if (!email || !firstName) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Find user
        const user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
            select: { id: true },
        });

        // Send Email #5
        const emailResult = await sendScholarshipWelcomeEmail({
            to: normalizedEmail,
            firstName,
        });

        // Mark as purchased in tags
        if (user) {
            await prisma.userTag.upsert({
                where: { userId_tag: { userId: user.id, tag: "scholarship_purchased" } },
                update: { value: "true" },
                create: {
                    userId: user.id,
                    tag: "scholarship_purchased",
                    value: "true",
                },
            });

            await prisma.userTag.upsert({
                where: { userId_tag: { userId: user.id, tag: "scholarship_purchased_at" } },
                update: { value: new Date().toISOString() },
                create: {
                    userId: user.id,
                    tag: "scholarship_purchased_at",
                    value: new Date().toISOString(),
                },
            });

            await prisma.userTag.upsert({
                where: { userId_tag: { userId: user.id, tag: "scholarship_status" } },
                update: { value: "purchased" },
                create: {
                    userId: user.id,
                    tag: "scholarship_status",
                    value: "purchased",
                },
            });
        }

        console.log(`[Scholarship] Welcome email sent to ${normalizedEmail} - marked as purchased`);

        return NextResponse.json({
            success: true,
            emailId: emailResult.id,
            userId: user?.id,
        });
    } catch (error) {
        console.error("[Scholarship] Send welcome email error:", error);
        return NextResponse.json(
            { error: "Failed to send welcome email" },
            { status: 500 }
        );
    }
}
