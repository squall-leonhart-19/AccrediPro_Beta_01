import { NextResponse } from "next/server";
import { sendMarketingEmail, personalEmailWrapper } from "@/lib/email";
import {
    SPRINT_SEQUENCE,
    MILESTONE_EMAILS,
    REMINDER_EMAILS,
    fillEmailTemplate,
    getCourseContext
} from "@/lib/buyer-retention-system";

/**
 * Test endpoint to send all buyer retention emails
 * GET /api/test/buyer-emails?email=test@example.com&course=functional-medicine-complete-certification
 * 
 * Sends from: "Sarah <info@accredipro-certificate.com>" (marketing sender)
 */

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const testEmail = searchParams.get("email");
    const courseSlug = searchParams.get("course") || "functional-medicine-complete-certification";

    if (!testEmail) {
        return NextResponse.json({ error: "Missing email param" }, { status: 400 });
    }

    const results: string[] = [];

    // Get course-specific context
    const context = getCourseContext(courseSlug, "Sarah", testEmail);
    context.deadline = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
    });

    // 1. SPRINT EMAILS (4)
    for (const email of SPRINT_SEQUENCE) {
        try {
            const { subject, content } = fillEmailTemplate(email, context);
            await sendMarketingEmail({
                to: testEmail,
                subject,
                html: personalEmailWrapper(content),
            });
            results.push(`✅ Sprint ${email.id}: ${subject}`);
        } catch (e) {
            results.push(`❌ Sprint ${email.id}: ${String(e)}`);
        }
    }

    // 2. MILESTONE EMAILS (4)
    for (const [key, email] of Object.entries(MILESTONE_EMAILS)) {
        try {
            const { subject, content } = fillEmailTemplate(email, context);
            await sendMarketingEmail({
                to: testEmail,
                subject,
                html: personalEmailWrapper(content),
            });
            results.push(`✅ Milestone ${key}: ${subject}`);
        } catch (e) {
            results.push(`❌ Milestone ${key}: ${String(e)}`);
        }
    }

    // 3. REMINDER EMAILS (4)
    for (const [key, email] of Object.entries(REMINDER_EMAILS)) {
        try {
            const { subject, content } = fillEmailTemplate(email, context);
            await sendMarketingEmail({
                to: testEmail,
                subject,
                html: personalEmailWrapper(content),
            });
            results.push(`✅ Reminder ${key}: ${subject}`);
        } catch (e) {
            results.push(`❌ Reminder ${key}: ${String(e)}`);
        }
    }

    return NextResponse.json({
        success: true,
        sentTo: testEmail,
        courseName: context.courseName,
        totalEmails: results.length,
        results,
    });
}
