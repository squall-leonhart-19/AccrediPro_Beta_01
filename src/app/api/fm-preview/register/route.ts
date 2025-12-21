import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";

/**
 * FM Preview Registration API
 *
 * Creates a user account and enrolls them in the FM Preview course (Module 0 + 1 only).
 * Used by the exit popup on /fm-certification page.
 *
 * POST /api/fm-preview/register
 * Body: { firstName, email, phone }
 */

// Meta CAPI Configuration
const META_PIXEL_ID = process.env.META_PURCHASE_PIXEL_ID || "1287915349067829";
const META_ACCESS_TOKEN = process.env.META_PURCHASE_ACCESS_TOKEN || "EAAHMlaRKtUoBQBe0ZAFZBQPlRv3xujHeDw0y8kGmRewZA9jaqkbnZA5mJxndHZCNmalSrGmr9DlTbNewOdu4INw4xRRZCE4vC0mSvnWsV17sIvklD9X4PbttSgp2lVIOZBQxG9Uq8UVljCsqZA1LSqxlgjDQ1qIN6PctDh3M5LmJBKkqQa0FDQAIoBN1AAIVqwZDZD";

// Hash PII for Meta CAPI
function hashForMeta(data: string): string {
    return crypto.createHash("sha256").update(data.toLowerCase().trim()).digest("hex");
}

// Send Lead event to Meta CAPI
async function sendLeadToMeta(params: {
    email: string;
    firstName?: string;
    phone?: string;
}): Promise<{ success: boolean; eventId?: string; error?: string }> {
    const { email, firstName, phone } = params;

    const eventId = crypto.randomUUID();

    const userData: Record<string, unknown> = {
        em: [hashForMeta(email)],
    };
    if (firstName) userData.fn = [hashForMeta(firstName)];
    if (phone) userData.ph = [hashForMeta(phone.replace(/\D/g, ""))]; // Remove non-digits

    const eventData = {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: "https://learn.accredipro.academy/fm-certification",
        action_source: "website",
        user_data: userData,
        custom_data: {
            content_name: "FM Preview - Module 0 & 1",
            content_category: "FM Certification",
            lead_type: "exit_popup",
        },
    };

    try {
        const response = await fetch(
            `https://graph.facebook.com/v18.0/${META_PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: [eventData] }),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            console.error("[Meta CAPI Lead] Error:", result);
            return { success: false, eventId, error: result.error?.message };
        }

        console.log(`[Meta CAPI] ✅ Lead sent: FM Preview optin`, { event_id: eventId });
        return { success: true, eventId };
    } catch (error) {
        console.error("[Meta CAPI Lead] Exception:", error);
        return { success: false, error: String(error) };
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { firstName, email, phone } = body;

        // Validation
        if (!email) {
            return NextResponse.json(
                { success: false, error: "Email is required" },
                { status: 400 }
            );
        }

        if (!firstName) {
            return NextResponse.json(
                { success: false, error: "First name is required" },
                { status: 400 }
            );
        }

        const normalizedEmail = email.toLowerCase().trim();

        // Normalize phone number - add +1 if not present (US/Canada)
        let normalizedPhone = phone ? phone.replace(/\D/g, "") : null; // Remove non-digits
        if (normalizedPhone && !normalizedPhone.startsWith("1")) {
            normalizedPhone = "1" + normalizedPhone;
        }
        if (normalizedPhone) {
            normalizedPhone = "+" + normalizedPhone;
        }

        // Check if user already exists
        let user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        let isNewUser = false;

        if (!user) {
            // Create new user with standard password
            const defaultPassword = "Futurecoach2025";
            const passwordHash = await bcrypt.hash(defaultPassword, 12);

            user = await prisma.user.create({
                data: {
                    email: normalizedEmail,
                    firstName: firstName.trim(),
                    lastName: "",
                    passwordHash,
                    role: "STUDENT",
                    isActive: true,
                    leadSource: "FM Exit Popup",
                    leadSourceDetail: "FM Preview - Module 0 & 1",
                    phone: normalizedPhone,
                },
            });

            isNewUser = true;
            console.log(`[FM Preview] Created new user: ${normalizedEmail}`);
        } else {
            // Update existing user with phone if not set
            if (!user.phone && normalizedPhone) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: { phone: normalizedPhone },
                });
            }
            console.log(`[FM Preview] Existing user found: ${normalizedEmail}`);
        }

        // Find or create FM Preview course enrollment
        // First, try to find the FM Preview course
        let fmPreviewCourse = await prisma.course.findFirst({
            where: { slug: "fm-preview" },
        });

        // If FM Preview course doesn't exist, use Mini Diploma as fallback
        // (You should create the FM Preview course in the database)
        if (!fmPreviewCourse) {
            fmPreviewCourse = await prisma.course.findFirst({
                where: { slug: "fm-mini-diploma" },
            });
        }

        let enrollmentId: string | null = null;

        if (fmPreviewCourse) {
            // Check if already enrolled
            const existingEnrollment = await prisma.enrollment.findUnique({
                where: {
                    userId_courseId: { userId: user.id, courseId: fmPreviewCourse.id },
                },
            });

            if (!existingEnrollment) {
                const enrollment = await prisma.enrollment.create({
                    data: {
                        userId: user.id,
                        courseId: fmPreviewCourse.id,
                        status: "ACTIVE",
                        progress: 0,
                    },
                });
                enrollmentId = enrollment.id;

                // Update course analytics
                await prisma.courseAnalytics.upsert({
                    where: { courseId: fmPreviewCourse.id },
                    update: { totalEnrolled: { increment: 1 } },
                    create: { courseId: fmPreviewCourse.id, totalEnrolled: 1 },
                });

                // Initialize user streak
                await prisma.userStreak.upsert({
                    where: { userId: user.id },
                    update: {},
                    create: {
                        userId: user.id,
                        currentStreak: 0,
                        longestStreak: 0,
                        totalPoints: 0,
                    },
                });

                console.log(`[FM Preview] Enrolled user in course: ${fmPreviewCourse.slug}`);
            } else {
                enrollmentId = existingEnrollment.id;
            }
        }

        // Send Lead event to Meta CAPI
        const metaResult = await sendLeadToMeta({
            email: normalizedEmail,
            firstName,
            phone,
        });

        // Add marketing tag
        try {
            const optinTag = await prisma.marketingTag.findFirst({
                where: { slug: "fm_preview_optin" },
            });

            if (optinTag) {
                await prisma.userTag.upsert({
                    where: { userId_tagId: { userId: user.id, tagId: optinTag.id } },
                    update: {},
                    create: {
                        userId: user.id,
                        tagId: optinTag.id,
                        source: "FM Exit Popup",
                    },
                });
            }
        } catch {
            // Tag doesn't exist, skip
        }

        // Log webhook event
        await prisma.webhookEvent.create({
            data: {
                eventType: "fm_preview.optin",
                payload: {
                    email: normalizedEmail,
                    firstName,
                    phone,
                    isNewUser,
                    enrollmentId,
                    metaEventId: metaResult.eventId,
                    metaSuccess: metaResult.success,
                },
                status: "sent",
                processedAt: new Date(),
            },
        });

        return NextResponse.json({
            success: true,
            data: {
                userId: user.id,
                email: user.email,
                isNewUser,
                enrollmentId,
                metaEventSent: metaResult.success,
            },
        });
    } catch (error) {
        console.error("[FM Preview] Registration error:", error);

        return NextResponse.json(
            { success: false, error: "Registration failed. Please try again." },
            { status: 500 }
        );
    }
}

// GET endpoint to verify the API is active
export async function GET() {
    return NextResponse.json({
        success: true,
        message: "FM Preview registration API is active",
        endpoint: "/api/fm-preview/register",
        method: "POST",
        requiredFields: ["firstName", "email", "phone"],
    });
}
