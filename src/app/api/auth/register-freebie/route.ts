import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

/**
 * PUBLIC API - Register user from external mini diploma freebie landing page
 * 
 * Called from external landing page with:
 * - email (required)
 * - name (optional)
 * - miniDiplomaCategory (required): functional-medicine, autism, gut-health, etc.
 * - password (optional, if not provided user gets magic link)
 * 
 * Creates user, sets freebie tracking, auto-enrolls in mini diploma course
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, firstName, lastName, name, miniDiplomaCategory, password } = body;

        // Validation
        if (!email || !miniDiplomaCategory) {
            return NextResponse.json(
                { error: "Email and miniDiplomaCategory are required" },
                { status: 400 }
            );
        }

        const emailLower = email.toLowerCase().trim();

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: emailLower },
        });

        if (existingUser) {
            // User exists - update their mini diploma if not already set
            if (!existingUser.miniDiplomaCategory) {
                await prisma.user.update({
                    where: { id: existingUser.id },
                    data: {
                        miniDiplomaCategory,
                        miniDiplomaOptinAt: new Date(),
                        miniDiplomaUpgradeDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
                        leadSource: "mini-diploma-freebie",
                        leadSourceDetail: miniDiplomaCategory,
                    },
                });
            }

            return NextResponse.json({
                success: true,
                isExisting: true,
                message: "Welcome back! Login to access your mini diploma.",
                redirectUrl: `/login?email=${encodeURIComponent(emailLower)}&from=freebie`,
            });
        }

        // Parse name
        let fName = firstName;
        let lName = lastName;
        if (!fName && name) {
            const parts = name.trim().split(" ");
            fName = parts[0];
            lName = parts.slice(1).join(" ") || undefined;
        }

        // Create new user
        const passwordHash = password ? await bcrypt.hash(password, 12) : null;
        const now = new Date();
        const upgradeDeadline = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from now

        const user = await prisma.user.create({
            data: {
                email: emailLower,
                firstName: fName,
                lastName: lName,
                passwordHash,
                role: "STUDENT",
                isActive: true,
                leadSource: "mini-diploma-freebie",
                leadSourceDetail: miniDiplomaCategory,
                miniDiplomaCategory,
                miniDiplomaOptinAt: now,
                miniDiplomaUpgradeDeadline: upgradeDeadline,
            },
        });

        // Auto-enroll in mini diploma course if it exists
        // Find course matching the category
        const miniDiplomaCourse = await prisma.course.findFirst({
            where: {
                OR: [
                    { slug: { contains: miniDiplomaCategory } },
                    { slug: { contains: "mini-diploma" } },
                ],
                certificateType: "MINI_DIPLOMA",
            },
        });

        if (miniDiplomaCourse) {
            await prisma.enrollment.create({
                data: {
                    userId: user.id,
                    courseId: miniDiplomaCourse.id,
                    status: "ACTIVE",
                },
            });
        }

        // Trigger welcome automation (if workflow exists)
        try {
            await prisma.workflowExecution.create({
                data: {
                    workflowId: "freebie-welcome", // System workflow
                    userId: user.id,
                    status: "PENDING",
                    triggerData: { miniDiplomaCategory },
                },
            });
        } catch {
            // Workflow might not exist yet, that's okay
        }

        return NextResponse.json({
            success: true,
            isExisting: false,
            message: "Account created! Set your password to access your free mini diploma.",
            userId: user.id,
            redirectUrl: password
                ? `/login?email=${encodeURIComponent(emailLower)}&from=freebie`
                : `/set-password?email=${encodeURIComponent(emailLower)}&from=freebie`,
        });

    } catch (error) {
        console.error("Freebie registration error:", error);
        return NextResponse.json(
            { error: "Failed to process registration" },
            { status: 500 }
        );
    }
}
