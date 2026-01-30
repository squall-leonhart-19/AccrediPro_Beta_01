import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { sendMarketingEmail, personalEmailWrapper } from "@/lib/email";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { to, subject, content, emailId } = await request.json();

        if (!to || !subject || !content) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Format the content with line breaks
        const formattedContent = content
            .split('\n\n')
            .map((p: string) => `<p style="margin: 0 0 16px 0;">${p.replace(/\n/g, '<br>')}</p>`)
            .join('');

        await sendMarketingEmail({
            to,
            subject,
            html: personalEmailWrapper(formattedContent),
        });

        return NextResponse.json({
            success: true,
            emailId,
            sentTo: to,
        });
    } catch (error) {
        console.error("Error sending nurturing test email:", error);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
}
