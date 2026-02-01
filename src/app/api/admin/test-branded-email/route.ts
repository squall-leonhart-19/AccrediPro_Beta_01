import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import {
    SPRINT_SEQUENCE,
    fillTemplateVariables,
    wrapInBrandedTemplate,
} from "@/lib/buyer-retention-system";

/**
 * POST /api/admin/test-branded-email
 * Send a single branded test email
 */
export async function POST(request: Request) {
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { email } = await request.json();
        const testEmail = email || "at.seed019@gmail.com";

        // Use first sprint email as test
        const emailTemplate = SPRINT_SEQUENCE[0];
        const vars = {
            firstName: "TestUser",
            dashboardUrl: "https://learn.accredipro.academy/dashboard"
        };

        const content = fillTemplateVariables(emailTemplate.content, vars);
        const subject = fillTemplateVariables(emailTemplate.subject, vars);
        const html = wrapInBrandedTemplate(content, vars);

        await sendEmail({
            to: testEmail,
            subject: `[TEST BRANDED] ${subject}`,
            html,
            text: content,
        });

        return NextResponse.json({
            success: true,
            message: `Branded email sent to ${testEmail}`
        });

    } catch (error) {
        console.error("[test-branded-email] Error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
