import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { triggerAutoMessage } from "@/lib/auto-messages";
import { sendFreebieWelcomeEmail } from "@/lib/email";
import { verifyEmail, isValidEmailSyntax, isDisposableEmail } from "@/lib/neverbounce";
import { sendLeadEvent } from "@/lib/meta-capi";
import { sendLeadToGHL } from "@/lib/ghl-webhook";

// Standard password for all freebie users - simple and memorable
const FREEBIE_PASSWORD = "Futurecoach2025";

/**
 * PUBLIC API - Register user from free mini diploma optin page
 *
 * Called from /free-mini-diploma page with:
 * - email (required)
 * - firstName (required)
 * - lastName (required)
 * - miniDiplomaCategory (optional, defaults to functional-medicine)
 *
 * Creates user with standard password, auto-enrolls in mini diploma course,
 * sends welcome email, and triggers nurture sequence
 */
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const {
            email, firstName, lastName, name, phone,
            licenseType, licenseState, employmentStatus, goal,
            miniDiplomaCategory = "functional-medicine"
        } = body;

        // Validation
        if (!email) {
            return NextResponse.json(
                { success: false, error: "Email is required" },
                { status: 400 }
            );
        }

        // Parse name if firstName not provided
        let fName = firstName;
        let lName = lastName;
        if (!fName && name) {
            const parts = name.trim().split(" ");
            fName = parts[0];
            lName = parts.slice(1).join(" ") || undefined;
        }

        if (!fName) {
            return NextResponse.json(
                { success: false, error: "First name is required" },
                { status: 400 }
            );
        }

        const emailLower = email.toLowerCase().trim();

        // Quick syntax check
        if (!isValidEmailSyntax(emailLower)) {
            return NextResponse.json(
                { success: false, error: "Please enter a valid email address." },
                { status: 400 }
            );
        }

        // Quick disposable check (local, no API call)
        if (isDisposableEmail(emailLower)) {
            return NextResponse.json(
                { success: false, error: "Temporary emails are not allowed. Please use a permanent email address." },
                { status: 400 }
            );
        }

        // Full NeverBounce verification (API call)
        const emailVerification = await verifyEmail(emailLower);
        if (!emailVerification.isValid) {
            return NextResponse.json(
                {
                    success: false,
                    error: emailVerification.reason || "This email address could not be verified.",
                    suggestedEmail: emailVerification.suggestedEmail,
                },
                { status: 400 }
            );
        }

        // If NeverBounce suggested a correction, log it
        if (emailVerification.suggestedEmail) {
            console.log(`[NEVERBOUNCE] Suggested correction for ${emailLower}: ${emailVerification.suggestedEmail}`);
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: emailLower },
        });

        if (existingUser) {
            // User exists - check if already has mini diploma access
            if (existingUser.miniDiplomaOptinAt) {
                return NextResponse.json({
                    success: true,
                    isExisting: true,
                    message: "You already have access! Login with your existing credentials.",
                });
            }

            // Update existing user with mini diploma access
            await prisma.user.update({
                where: { id: existingUser.id },
                data: {
                    miniDiplomaCategory,
                    miniDiplomaOptinAt: new Date(),
                    leadSource: existingUser.leadSource || "mini-diploma-freebie",
                    leadSourceDetail: existingUser.leadSourceDetail || miniDiplomaCategory,
                },
            });

            // Add freebie tag
            await addFreebieTag(existingUser.id);

            // Add source UserTags for marketing emails
            const sourceTags = [
                "source:mini-diploma-freebie",
                `source:${miniDiplomaCategory}`,
                `mini_diploma_category:${miniDiplomaCategory}`,
            ];
            for (const tag of sourceTags) {
                await prisma.userTag.upsert({
                    where: { userId_tag: { userId: existingUser.id, tag } },
                    update: {},
                    create: { userId: existingUser.id, tag },
                });
            }

            // Enroll in nurture sequence
            await enrollInNurtureSequence(existingUser.id);

            // Send welcome email for existing user
            await sendFreebieWelcomeEmail({
                to: emailLower,
                firstName: existingUser.firstName || fName,
                isExistingUser: true,
            });

            // === GOHIGHLEVEL INTEGRATION for existing users ===
            console.log(`[GHL] Sending existing user to GHL: ${emailLower}`);
            sendLeadToGHL({
                firstName: existingUser.firstName || fName,
                lastName: existingUser.lastName || lName,
                email: emailLower,
                phone: phone || existingUser.phone || undefined,
                source: "Mini Diploma Signup (Returning)",
                tags: ["mini-diploma-lead", miniDiplomaCategory, "returning-user"],
            }).catch((err) => {
                console.error(`[GHL] Failed to send existing user:`, err);
            });

            return NextResponse.json({
                success: true,
                isExisting: true,
                message: "Welcome back! Check your email for login details.",
            });
        }

        // Create new user with standard password
        const passwordHash = await bcrypt.hash(FREEBIE_PASSWORD, 12);
        const now = new Date();

        const user = await prisma.user.create({
            data: {
                email: emailLower,
                firstName: fName,
                lastName: lName,
                phone: phone || null,
                passwordHash,
                role: "STUDENT",
                isActive: true,
                leadSource: "mini-diploma-freebie",
                leadSourceDetail: miniDiplomaCategory,
                miniDiplomaCategory,
                miniDiplomaOptinAt: now,
            },
        });

        // Auto-enroll in mini diploma course if it exists
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
            await prisma.enrollment.upsert({
                where: {
                    userId_courseId: {
                        userId: user.id,
                        courseId: miniDiplomaCourse.id,
                    },
                },
                create: {
                    userId: user.id,
                    courseId: miniDiplomaCourse.id,
                    status: "ACTIVE",
                },
                update: {},
            });

            // Add UserTags for mini diploma tracking (for DMs/sequences/marketing)
            const userTags = [
                "mini_diploma_started",
                `enrolled_${miniDiplomaCourse.slug || miniDiplomaCourse.id}`,
                `mini_diploma_category:${miniDiplomaCategory}`,
                `lead:${miniDiplomaCategory}`,
                "source:mini-diploma-freebie",
                `source:${miniDiplomaCategory}`,
            ];

            for (const tag of userTags) {
                await prisma.userTag.upsert({
                    where: { userId_tag: { userId: user.id, tag } },
                    update: {},
                    create: { userId: user.id, tag },
                });
            }

            console.log(`🏷️ Created mini diploma UserTags for ${user.id}: ${userTags.join(", ")}`);
        }

        // Add license/qualification tags if provided (from clinician application form)
        if (licenseType || licenseState || employmentStatus || goal) {
            const qualificationTags = [];
            if (licenseType) qualificationTags.push(`license_type:${licenseType}`);
            if (licenseState) qualificationTags.push(`license_state:${licenseState}`);
            if (employmentStatus) qualificationTags.push(`employment:${employmentStatus}`);
            if (goal) qualificationTags.push(`goal:${goal}`);
            qualificationTags.push("clinician_applicant");

            for (const tag of qualificationTags) {
                await prisma.userTag.upsert({
                    where: { userId_tag: { userId: user.id, tag } },
                    update: {},
                    create: { userId: user.id, tag },
                });
            }
            console.log(`🏷️ Saved clinician qualification tags: ${qualificationTags.join(", ")}`);
        }

        // Add marketing tags
        await addFreebieTag(user.id);

        // Enroll in nurture sequence
        await enrollInNurtureSequence(user.id);

        // Send welcome DM with voice message for first login
        console.log(`[FREEBIE] New user registered: ${user.id} (${emailLower})`);
        triggerAutoMessage({
            userId: user.id,
            trigger: "first_login",
        }).catch((err) => {
            console.error(`[FREEBIE] Failed to queue welcome message:`, err);
        });

        // Send welcome email with credentials
        await sendFreebieWelcomeEmail({
            to: emailLower,
            firstName: fName,
            isExistingUser: false,
        });

        // === SERVER-SIDE META TRACKING ===
        // Send Lead event to Meta CAPI for accurate ad tracking
        sendLeadEvent({
            email: emailLower,
            firstName: fName,
            lastName: lName,
            contentName: `Mini Diploma - ${miniDiplomaCategory}`,
        }).catch((err) => {
            console.error(`[META] Failed to send Lead event:`, err);
        });

        // === GOHIGHLEVEL INTEGRATION ===
        // Send lead to GHL for SMS automation
        console.log(`[GHL] Sending new user to GHL: ${emailLower}`);
        sendLeadToGHL({
            firstName: fName,
            lastName: lName,
            email: emailLower,
            phone: phone || undefined,
            source: "Mini Diploma Signup",
            tags: ["mini-diploma-lead", miniDiplomaCategory],
        }).catch((err) => {
            console.error(`[GHL] Failed to send lead:`, err);
        });

        return NextResponse.json({
            success: true,
            isExisting: false,
            message: "Account created! Check your email for login details.",
            userId: user.id,
        });

    } catch (error) {
        console.error("Freebie registration error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to create account. Please try again." },
            { status: 500 }
        );
    }
}

async function addFreebieTag(userId: string) {
    try {
        // Find or create the freebie source tag
        let tag = await prisma.marketingTag.findUnique({
            where: { slug: "source_mini_diploma_freebie" },
        });

        if (!tag) {
            tag = await prisma.marketingTag.create({
                data: {
                    name: "Mini Diploma Freebie",
                    slug: "source_mini_diploma_freebie",
                    category: "SOURCE",
                    color: "#10B981",
                    description: "Opted in for free Mini Diploma",
                    isSystem: true,
                },
            });
        }

        // Add tag to user
        await prisma.userMarketingTag.upsert({
            where: {
                userId_tagId: {
                    userId,
                    tagId: tag.id,
                },
            },
            create: {
                userId,
                tagId: tag.id,
                source: "optin",
            },
            update: {},
        });

        // Also add stage tag
        const stageTag = await prisma.marketingTag.findUnique({
            where: { slug: "stage_mini_diploma" },
        });
        if (stageTag) {
            await prisma.userMarketingTag.upsert({
                where: { userId_tagId: { userId, tagId: stageTag.id } },
                create: { userId, tagId: stageTag.id, source: "optin" },
                update: {},
            });
        }
    } catch (error) {
        console.error("Error adding freebie tag:", error);
    }
}

async function enrollInNurtureSequence(userId: string) {
    try {
        // STEP 1: Tag user with nurture-30-day (for UI count)
        const nurtureTag = await prisma.marketingTag.findFirst({
            where: {
                OR: [
                    { slug: "nurture-30-day" },
                    { name: "nurture-30-day" },
                ],
            },
        });

        if (nurtureTag) {
            // Check if already tagged
            const existingTag = await prisma.userMarketingTag.findUnique({
                where: {
                    userId_tagId: {
                        userId,
                        tagId: nurtureTag.id,
                    },
                },
            });

            if (!existingTag) {
                await prisma.userMarketingTag.create({
                    data: {
                        userId,
                        tagId: nurtureTag.id,
                    },
                });

                await prisma.marketingTag.update({
                    where: { id: nurtureTag.id },
                    data: { userCount: { increment: 1 } },
                });

                console.log(`[NURTURE] ✅ Tagged user ${userId} with nurture-30-day`);
            }
        } else {
            console.log(`[NURTURE] ⚠️ nurture-30-day tag not found - creating...`);
            // Create the tag if it doesn't exist
            const newTag = await prisma.marketingTag.create({
                data: {
                    name: "nurture-30-day",
                    slug: "nurture-30-day",
                    category: "STAGE",
                    description: "Users enrolled in 30-day nurture sequence",
                    color: "#722F37",
                    userCount: 1,
                },
            });

            await prisma.userMarketingTag.create({
                data: {
                    userId,
                    tagId: newTag.id,
                },
            });
            console.log(`[NURTURE] ✅ Created nurture-30-day tag and tagged user`);
        }

        // STEP 2: Find and enroll in database sequence
        const sequence = await prisma.sequence.findFirst({
            where: {
                OR: [
                    { slug: "mini-diploma-to-certification-30d" },
                    { slug: "mini-diploma-nurture" },
                    { name: { contains: "Mini Diploma" } },
                    { triggerType: "MINI_DIPLOMA_STARTED" },
                ],
                isActive: true,
            },
        });

        if (sequence) {
            console.log(`[NURTURE] Found sequence: ${sequence.name} (${sequence.id})`);

            // Check if already enrolled
            const existingEnrollment = await prisma.sequenceEnrollment.findUnique({
                where: {
                    userId_sequenceId: {
                        userId,
                        sequenceId: sequence.id,
                    },
                },
            });

            if (!existingEnrollment) {
                // Schedule first email
                const nextSendAt = new Date();
                nextSendAt.setHours(nextSendAt.getHours() + 1); // First email 1 hour after signup

                await prisma.sequenceEnrollment.create({
                    data: {
                        userId,
                        sequenceId: sequence.id,
                        status: "ACTIVE",
                        currentEmailIndex: 0,
                        nextSendAt,
                    },
                });

                // Update sequence stats
                await prisma.sequence.update({
                    where: { id: sequence.id },
                    data: { totalEnrolled: { increment: 1 } },
                });

                console.log(`[NURTURE] ✅ Enrolled user ${userId} in nurture sequence`);
            } else {
                console.log(`[NURTURE] User ${userId} already enrolled`);
            }
        } else {
            console.log(`[NURTURE] ⚠️ No active nurture sequence found in database`);
        }
    } catch (error) {
        console.error("Error enrolling in nurture sequence:", error);
    }
}
