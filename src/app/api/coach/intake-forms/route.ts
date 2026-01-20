import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// Intake form types with their descriptions
const INTAKE_FORM_DETAILS: Record<string, { title: string; description: string; questions: string[] }> = {
    "health-history": {
        title: "Health History Questionnaire",
        description: "A comprehensive review of your health background, past conditions, and medical history.",
        questions: [
            "Current health concerns",
            "Past medical conditions",
            "Family health history",
            "Current medications & supplements",
            "Previous treatments tried",
        ],
    },
    "lifestyle": {
        title: "Lifestyle Assessment",
        description: "Understanding your daily habits, sleep, exercise, and stress patterns.",
        questions: [
            "Daily routine & schedule",
            "Sleep quality & duration",
            "Exercise & movement habits",
            "Stress levels & management",
            "Work-life balance",
        ],
    },
    "nutrition": {
        title: "Nutrition & Diet Intake",
        description: "A detailed look at your current eating patterns and nutritional intake.",
        questions: [
            "Typical daily meals",
            "Food preferences & dislikes",
            "Dietary restrictions",
            "Water intake",
            "Eating habits & patterns",
        ],
    },
    "goals": {
        title: "Goals & Vision Worksheet",
        description: "Define what you want to achieve through our coaching relationship.",
        questions: [
            "Short-term health goals (3 months)",
            "Long-term health vision (1 year)",
            "What success looks like to you",
            "Potential challenges & obstacles",
            "Support systems available",
        ],
    },
    "consent": {
        title: "Coaching Agreement & Consent",
        description: "Review and agree to our coaching terms and policies.",
        questions: [
            "Acknowledgment of coaching scope",
            "Confidentiality agreement",
            "Communication preferences",
            "Cancellation policy",
            "Emergency contact info",
        ],
    },
};

// POST - Send intake form to client
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check coach role
        const coach = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true, firstName: true, lastName: true, email: true },
        });

        if (!coach || !["ADMIN", "INSTRUCTOR", "MENTOR"].includes(coach.role)) {
            return NextResponse.json({ error: "Not authorized" }, { status: 403 });
        }

        const body = await request.json();
        const { clientId, formType } = body;

        if (!clientId || !formType) {
            return NextResponse.json({ error: "Client ID and form type required" }, { status: 400 });
        }

        // Get client details
        const client = await prisma.client.findUnique({
            where: { id: clientId },
            select: { id: true, name: true, email: true, coachId: true },
        });

        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        if (client.coachId !== session.user.id) {
            return NextResponse.json({ error: "Not your client" }, { status: 403 });
        }

        if (!client.email) {
            return NextResponse.json({ error: "Client has no email address" }, { status: 400 });
        }

        const formDetails = INTAKE_FORM_DETAILS[formType];
        if (!formDetails) {
            return NextResponse.json({ error: "Invalid form type" }, { status: 400 });
        }

        const coachName = `${coach.firstName || ""} ${coach.lastName || ""}`.trim() || "Your Coach";

        // Create a unique form link (in production, this would link to an actual form page)
        const formToken = Buffer.from(`${clientId}-${formType}-${Date.now()}`).toString("base64");
        const formLink = `${process.env.NEXTAUTH_URL}/intake-form/${formToken}`;

        // Send email via Resend
        const { data, error } = await resend.emails.send({
            from: "AccrediPro <noreply@accredipro.academy>",
            to: client.email,
            subject: `${formDetails.title} from ${coachName}`,
            html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
    <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <!-- Header -->
        <div style="text-align: center; margin-bottom: 32px;">
            <img src="${process.env.NEXTAUTH_URL}/accredipro-logo.png" alt="AccrediPro" width="180" style="margin-bottom: 16px;">
        </div>

        <!-- Main Card -->
        <div style="background: white; border-radius: 16px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); padding: 32px; margin-bottom: 24px;">
            <h1 style="color: #7c2d36; font-size: 24px; margin: 0 0 8px 0;">Hi ${client.name.split(" ")[0]},</h1>
            <p style="color: #6b7280; font-size: 16px; line-height: 1.6; margin: 0 0 24px 0;">
                ${coachName} has sent you a form to complete as part of your coaching journey.
            </p>

            <!-- Form Info Box -->
            <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <h2 style="color: #92400e; font-size: 18px; margin: 0 0 8px 0;">${formDetails.title}</h2>
                <p style="color: #78350f; font-size: 14px; margin: 0; line-height: 1.5;">${formDetails.description}</p>
            </div>

            <!-- What to expect -->
            <h3 style="color: #374151; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; margin: 0 0 12px 0;">What You'll Cover:</h3>
            <ul style="margin: 0 0 24px 0; padding-left: 20px; color: #6b7280;">
                ${formDetails.questions.map(q => `<li style="margin-bottom: 8px; font-size: 14px;">${q}</li>`).join("")}
            </ul>

            <!-- CTA Button -->
            <div style="text-align: center;">
                <a href="${formLink}" style="display: inline-block; background: linear-gradient(135deg, #7c2d36 0%, #9a3a45 100%); color: white; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                    Complete Form
                </a>
            </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; color: #9ca3af; font-size: 12px;">
            <p style="margin: 0 0 8px 0;">Sent by ${coachName} via AccrediPro</p>
            <p style="margin: 0;">Questions? Reply directly to this email.</p>
        </div>
    </div>
</body>
</html>
            `,
        });

        if (error) {
            console.error("Resend error:", error);
            return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
        }

        // Update client notes to track that form was sent
        await prisma.client.update({
            where: { id: clientId },
            data: {
                notes: prisma.client.fields.notes
                    ? `${client.name} - ${formDetails.title} sent on ${new Date().toLocaleDateString()}\n\n`
                    : `${formDetails.title} sent on ${new Date().toLocaleDateString()}\n\n`,
            },
        });

        return NextResponse.json({
            success: true,
            data: {
                formType,
                sentTo: client.email,
                sentAt: new Date().toISOString(),
                emailId: data?.id,
            },
        });
    } catch (error) {
        console.error("Send intake form error:", error);
        return NextResponse.json({ error: "Failed to send form" }, { status: 500 });
    }
}

// GET - Get intake form status for a client
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const clientId = searchParams.get("clientId");

        if (!clientId) {
            return NextResponse.json({ error: "Client ID required" }, { status: 400 });
        }

        // For now, return the available form types
        // In a full implementation, you'd track which forms have been sent/completed
        const forms = Object.entries(INTAKE_FORM_DETAILS).map(([id, details]) => ({
            id,
            name: details.title,
            description: details.description,
            status: "pending", // Would be dynamic based on actual form submissions
        }));

        return NextResponse.json({ success: true, data: forms });
    } catch (error) {
        console.error("Get intake forms error:", error);
        return NextResponse.json({ error: "Failed to get forms" }, { status: 500 });
    }
}
