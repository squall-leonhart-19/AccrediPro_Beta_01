import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";
import { sendLeadWelcomeEmail } from "@/lib/email";
import { assignCoachByTag } from "@/lib/niche-coach";
import { verifyEmail } from "@/lib/neverbounce";
import { z } from "zod";

// Valid specializations that map to tags
const VALID_SPECIALIZATIONS = [
    "functional-medicine",
    "health-coach",
    "menopause",
    "gut-health",
    "womens-health",
] as const;

const leadCaptureSchema = z.object({
    email: z.string().email("Invalid email address"),
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    specialization: z.enum(VALID_SPECIALIZATIONS, {
        errorMap: () => ({ message: "Invalid specialization" }),
    }),
    redirectUrl: z.string().url().optional(),
});

// Static password for all lead accounts
const DEFAULT_PASSWORD = "accredipro123";

// Specialization display names
const SPECIALIZATION_NAMES: Record<string, string> = {
    "functional-medicine": "Functional Medicine",
    "health-coach": "Health Coach",
    "menopause": "Menopause & Perimenopause",
    "gut-health": "Gut Health",
    "womens-health": "Women's Health",
};

export async function POST(request: NextRequest) {
    try {
        // Handle both JSON and form data
        const contentType = request.headers.get("content-type") || "";
        let data: Record<string, string>;

        if (contentType.includes("application/json")) {
            data = await request.json();
        } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
            const formData = await request.formData();
            data = Object.fromEntries(formData.entries()) as Record<string, string>;
        } else {
            return NextResponse.json(
                { success: false, error: "Unsupported content type" },
                { status: 400 }
            );
        }

        const validatedData = leadCaptureSchema.parse(data);
        const { email, firstName, lastName, specialization, redirectUrl } = validatedData;

        // Verify email with NeverBounce (reject invalid/disposable)
        const emailVerification = await verifyEmail(email.toLowerCase());
        if (!emailVerification.isValid) {
            console.log(`[LEAD-CAPTURE] Rejected invalid email: ${email} (${emailVerification.result})`);
            return NextResponse.json(
                {
                    success: false,
                    error: emailVerification.reason || "Please use a valid email address",
                    suggestedEmail: emailVerification.suggestedEmail,
                },
                { status: 400 }
            );
        }

        // Check if user already exists
        let user = await prisma.user.findUnique({
            where: { email: email.toLowerCase() },
        });

        let isNewUser = false;

        if (!user) {
            // Create new user with static password
            const passwordHash = await hashPassword(DEFAULT_PASSWORD);

            user = await prisma.user.create({
                data: {
                    email,
                    passwordHash,
                    firstName,
                    lastName,
                    leadSource: "mini-diploma",
                    leadSourceDetail: specialization,
                },
            });

            isNewUser = true;
        }

        // Add or update the lead tag for this specialization
        const tagName = `lead:${specialization}`;

        await prisma.userTag.upsert({
            where: {
                userId_tag: {
                    userId: user.id,
                    tag: tagName,
                },
            },
            update: {
                // Update timestamp if tag already exists
                createdAt: new Date(),
            },
            create: {
                userId: user.id,
                tag: tagName,
                value: specialization,
                metadata: {
                    source: "lead-capture-form",
                    capturedAt: new Date().toISOString(),
                },
            },
        });

        // Assign coach based on the niche/tag
        const coachResult = await assignCoachByTag(user.id, tagName);
        if (coachResult.success) {
            console.log(`Assigned coach ${coachResult.coachId} to user ${user.id} for niche ${specialization}`);
        } else {
            console.warn(`Could not assign coach for ${specialization}:`, coachResult.error);
        }

        // Send welcome email (only for new users or always? Let's send always for lead capture)
        const specializationName = SPECIALIZATION_NAMES[specialization] || specialization;

        try {
            await sendLeadWelcomeEmail({
                to: email,
                firstName,
                specialization: specializationName,
                isNewUser,
            });
        } catch (emailError) {
            console.error("Failed to send welcome email:", emailError);
            // Don't fail the request if email fails
        }

        // If redirectUrl provided, redirect there (only allow same-origin or trusted domains)
        if (redirectUrl) {
            const url = new URL(redirectUrl);
            const allowedHosts = [
                "learn.accredipro.academy",
                "accredipro.academy",
                "www.accredipro.academy",
                "accredipro-certificate.com",
                "www.accredipro-certificate.com",
                "localhost",
            ];
            if (!allowedHosts.includes(url.hostname)) {
                console.warn(`[Lead Capture] Blocked redirect to untrusted domain: ${url.hostname}`);
                return NextResponse.json({
                    success: true,
                    message: "Account created. Redirect blocked (untrusted domain).",
                });
            }
            url.searchParams.set("success", "true");
            url.searchParams.set("email", email);
            url.searchParams.set("specialization", specialization);

            return NextResponse.redirect(url.toString(), { status: 302 });
        }

        // Otherwise return JSON response
        return NextResponse.json({
            success: true,
            message: isNewUser ? "Account created successfully" : "Tag added to existing account",
            data: {
                email,
                firstName,
                specialization,
                isNewUser,
            },
        });
    } catch (error) {
        console.error("Lead capture error:", error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { success: false, error: error.issues[0].message },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { success: false, error: "Failed to process lead capture" },
            { status: 500 }
        );
    }
}

// Also support GET for testing
export async function GET() {
    return NextResponse.json({
        message: "Lead Capture API",
        usage: "POST with email, firstName, lastName, specialization",
        validSpecializations: VALID_SPECIALIZATIONS,
    });
}
