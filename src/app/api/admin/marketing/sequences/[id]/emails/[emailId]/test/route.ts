import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendEmail, brandedEmailWrapper } from "@/lib/email";

// POST /api/admin/marketing/sequences/[id]/emails/[emailId]/test
// Send a test email to the current admin user
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; emailId: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || !["ADMIN", "SUPERUSER"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: sequenceId, emailId } = await params;
        const adminEmail = session.user.email;

        if (!adminEmail) {
            return NextResponse.json({ error: "No email found for current user" }, { status: 400 });
        }

        // Get the email
        const email = await prisma.sequenceEmail.findUnique({
            where: { id: emailId },
            include: {
                sequence: {
                    select: { id: true, name: true },
                },
            },
        });

        if (!email) {
            return NextResponse.json({ error: "Email not found" }, { status: 404 });
        }

        if (email.sequenceId !== sequenceId) {
            return NextResponse.json({ error: "Email does not belong to this sequence" }, { status: 400 });
        }

        // Replace placeholders with test values
        const firstName = session.user.name?.split(" ")[0] || "Test";
        const lastName = session.user.name?.split(" ").slice(1).join(" ") || "User";
        const fullName = session.user.name || "Test User";
        const baseUrl = process.env.NEXTAUTH_URL || "https://learn.accredipro.academy";

        let htmlContent = (email.customContent || "")
            .replace(/\{\{firstName\}\}/g, firstName)
            .replace(/\{\{lastName\}\}/g, lastName)
            .replace(/\{\{email\}\}/g, adminEmail)
            .replace(/\{\{fullName\}\}/g, fullName)
            .replace(/\{\{nicheName\}\}/g, "Functional Medicine")
            .replace(/\{\{nicheDisplayName\}\}/g, "Functional Medicine Certification")
            .replace(/\{\{MINI_DIPLOMA_URL\}\}/g, `${baseUrl}/login`)
            .replace(/\{\{GRADUATE_TRAINING_URL\}\}/g, `${baseUrl}/training`)
            .replace(/\{\{CERTIFICATION_URL\}\}/g, `${baseUrl}/courses/functional-medicine-certification`)
            .replace(/\{\{DASHBOARD_URL\}\}/g, `${baseUrl}/dashboard`)
            .replace(/\{\{ROADMAP_URL\}\}/g, `${baseUrl}/my-personal-roadmap-by-coach-sarah`)
            .replace(/\{\{LOGIN_URL\}\}/g, `${baseUrl}/login`)
            // Convert markdown bold/italic to HTML
            .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
            .replace(/\*([^*]+)\*/g, "<em>$1</em>")
            // Convert line breaks
            .replace(/\n\n/g, "</p><p>")
            .replace(/\n/g, "<br>");

        const subject = `[TEST] ${(email.customSubject || "Untitled Email")
            .replace(/\{\{firstName\}\}/g, firstName)}`;

        // Send the test email
        const result = await sendEmail({
            to: adminEmail,
            subject,
            html: brandedEmailWrapper(htmlContent),
            type: "transactional",
        });

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: `Test email sent to ${adminEmail}`,
                sentTo: adminEmail,
            });
        } else {
            return NextResponse.json(
                { error: result.error || "Failed to send test email" },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Error sending test email:", error);
        return NextResponse.json(
            { error: "Failed to send test email" },
            { status: 500 }
        );
    }
}
