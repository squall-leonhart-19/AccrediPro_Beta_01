import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Save DFY intake form progress for abandonment tracking and reminders
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        const body = await request.json();

        const { purchaseId, currentStep, totalSteps, formData, stepId, abandoned = false } = body;

        if (!purchaseId) {
            return NextResponse.json({ error: "Purchase ID required" }, { status: 400 });
        }

        // Calculate progress percentage
        const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);

        // Find the DFY purchase
        const purchase = await prisma.dFYPurchase.findFirst({
            where: {
                OR: [
                    { id: purchaseId },
                    { id: purchaseId.replace('test-', '') } // Handle test mode
                ]
            }
        });

        // Store progress in metadata or create a separate tracking record
        // Using IntakeSubmission for now to track progress
        if (purchase) {
            // Update purchase with progress tracking in intakeData
            await prisma.dFYPurchase.update({
                where: { id: purchase.id },
                data: {
                    intakeData: {
                        ...(purchase.intakeData as object || {}),
                        lastStep: currentStep,
                        lastStepId: stepId,
                        progressPercent,
                        lastActivity: new Date().toISOString(),
                        abandoned,
                        formDataSnapshot: formData,
                    }
                }
            });
        }

        // Track the event for analytics
        if (session?.user?.id) {
            // Could also create an analytics event here
            console.log(`[DFY Progress] User ${session.user.id} at step ${currentStep + 1}/${totalSteps} (${progressPercent}%) - ${abandoned ? 'ABANDONED' : 'in progress'}`);
        }

        return NextResponse.json({
            success: true,
            progress: progressPercent,
            step: currentStep + 1,
            abandoned
        });

    } catch (error) {
        console.error("Error saving DFY progress:", error);
        return NextResponse.json({ error: "Failed to save progress" }, { status: 500 });
    }
}

// Get progress for a purchase (to resume where they left off)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const purchaseId = searchParams.get("purchaseId");

        if (!purchaseId) {
            return NextResponse.json({ error: "Purchase ID required" }, { status: 400 });
        }

        const purchase = await prisma.dFYPurchase.findFirst({
            where: {
                OR: [
                    { id: purchaseId },
                    { id: purchaseId.replace('test-', '') }
                ]
            }
        });

        if (!purchase) {
            return NextResponse.json({ progress: null });
        }

        const intakeData = purchase.intakeData as any;

        return NextResponse.json({
            progress: {
                lastStep: intakeData?.lastStep || 0,
                lastStepId: intakeData?.lastStepId || null,
                progressPercent: intakeData?.progressPercent || 0,
                lastActivity: intakeData?.lastActivity || null,
                formData: intakeData?.formDataSnapshot || null,
            }
        });

    } catch (error) {
        console.error("Error getting DFY progress:", error);
        return NextResponse.json({ error: "Failed to get progress" }, { status: 500 });
    }
}
