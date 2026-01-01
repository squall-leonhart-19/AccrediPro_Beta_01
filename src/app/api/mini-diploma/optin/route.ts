import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Universal password for all mini diploma leads
const LEAD_PASSWORD = "coach2026";

// Course slugs by mini diploma type
const COURSE_SLUGS: Record<string, string> = {
    "womens-health": "womens-health-mini-diploma",
    "functional-medicine": "fm-mini-diploma",
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { firstName, lastName, email, course } = body;

        // Validate required fields
        if (!firstName || !lastName || !email || !course) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Please enter a valid email address" },
                { status: 400 }
            );
        }

        // Get course slug
        const courseSlug = COURSE_SLUGS[course];
        if (!courseSlug) {
            return NextResponse.json(
                { error: "Invalid course selection" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        if (existingUser) {
            // Check if already enrolled in this course
            const existingEnrollment = await prisma.enrollment.findFirst({
                where: {
                    userId: existingUser.id,
                    course: { slug: courseSlug },
                },
            });

            if (existingEnrollment) {
                return NextResponse.json(
                    { error: "You're already enrolled in this mini diploma. Please log in to continue." },
                    { status: 400 }
                );
            }

            // User exists but not enrolled - enroll them
            const courseData = await prisma.course.findUnique({
                where: { slug: courseSlug },
            });

            if (!courseData) {
                return NextResponse.json(
                    { error: "Course not found. Please try again later." },
                    { status: 500 }
                );
            }

            // Create enrollment
            await prisma.enrollment.create({
                data: {
                    userId: existingUser.id,
                    courseId: courseData.id,
                    status: "ACTIVE",
                },
            });

            // Update user with mini diploma info
            await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                    miniDiplomaCategory: course,
                    miniDiplomaOptinAt: new Date(),
                    // Don't override accessExpiresAt if they're already a paid user
                    ...(existingUser.userType === "LEAD" && {
                        accessExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                    }),
                },
            });

            return NextResponse.json({
                success: true,
                message: "Enrolled successfully",
                isExistingUser: true,
            });
        }

        // Create new user
        const passwordHash = await bcrypt.hash(LEAD_PASSWORD, 10);

        // Find the course
        const courseData = await prisma.course.findUnique({
            where: { slug: courseSlug },
        });

        if (!courseData) {
            return NextResponse.json(
                { error: "Course not found. Please try again later." },
                { status: 500 }
            );
        }

        // Calculate 7-day access expiry
        const accessExpiresAt = new Date();
        accessExpiresAt.setDate(accessExpiresAt.getDate() + 7);

        // Create user and enrollment in transaction
        const user = await prisma.user.create({
            data: {
                email: email.toLowerCase(),
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                passwordHash,
                role: "STUDENT",
                userType: "LEAD",
                isActive: true,
                leadSource: "mini-diploma",
                leadSourceDetail: course,
                miniDiplomaCategory: course,
                miniDiplomaOptinAt: new Date(),
                accessExpiresAt,
                enrollments: {
                    create: {
                        courseId: courseData.id,
                        status: "ACTIVE",
                    },
                },
            },
        });

        // TODO: Send welcome email with login details
        // await sendWelcomeEmail(email, firstName, LEAD_PASSWORD);

        // TODO: Track in analytics/Facebook CAPI
        // await trackOptIn(email, course);

        return NextResponse.json({
            success: true,
            message: "Account created successfully",
            userId: user.id,
        });
    } catch (error: any) {
        console.error("Mini diploma optin error:", error);

        // Handle unique constraint violation (email already exists)
        if (error.code === "P2002") {
            return NextResponse.json(
                { error: "This email is already registered. Please log in instead." },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { error: "Something went wrong. Please try again." },
            { status: 500 }
        );
    }
}
