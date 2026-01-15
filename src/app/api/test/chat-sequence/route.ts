import { NextResponse } from "next/server";
import { sendMarketingEmail, personalEmailWrapper, brandedEmailWrapper } from "@/lib/email";
import { NURTURE_EMAILS } from "@/lib/nurture-emails";

/**
 * Test endpoint for email sequence testing
 * GET: Send test email to verify inbox placement
 * ?style=branded or ?style=personal (default: branded)
 * ?nurture=1-17 to send nurture sequence emails
 * ?num=1-3 to send chat follow-up emails
 */

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || "at.seed019@gmail.com";
    const emailNum = parseInt(searchParams.get("num") || "1");
    const nurtureNum = searchParams.get("nurture"); // 1-17
    const style = searchParams.get("style") || "branded"; // branded or personal

    let subject: string;
    let content: string;

    if (nurtureNum) {
        // Use nurture sequence email
        const idx = parseInt(nurtureNum) - 1;
        const nurtureEmail = NURTURE_EMAILS[idx];
        if (!nurtureEmail) {
            return NextResponse.json({
                success: false,
                error: `Nurture email ${nurtureNum} not found (valid: 1-${NURTURE_EMAILS.length})`
            }, { status: 400 });
        }
        subject = nurtureEmail.subject;
        content = nurtureEmail.content
            .replace(/\{\{firstName\}\}/g, "Test")
            .replace(/\{\{lastName\}\}/g, "User")
            .replace(/\{\{email\}\}/g, email)
            .replace(/\{\{fullName\}\}/g, "Test User");
    } else {
        // Use chat follow-up emails
        const emails = [
            {
                subject: "Hey, following up on our chat...",
                content: `Hi there!

It's Sarah from AccrediPro Academy.

I wanted to follow up on our conversation earlier. I know you were interested in the Functional Medicine certification, and I wanted to make sure you got all your questions answered.

If there's anything holding you back or if you'd like more details about how the program works, just reply to this email and I'll personally get back to you.

No pressure at all - I just want to make sure you have everything you need to make the best decision for your career.

Talk soon,
Sarah M.
Lead Instructor, AccrediPro Academy

P.S. If you're ready to enroll, here's the link: https://sarah.accredipro.academy/checkout-fm-certification`
            },
            {
                subject: "Quick question for you...",
                content: `Hey!

Just a quick follow-up - did you see my last email?

I've been getting a lot of messages from students who were in a similar position to you. They were unsure if the certification was right for them, but took the leap and now they're thriving.

Here's what Maria from Texas said last week:

"I was skeptical at first, but the R.O.O.T.S. Method changed everything. I went from burned out nurse to running my own practice in 3 months. Best $97 I ever spent."

I'd love to help you achieve similar results.

Any questions? Just hit reply.

Sarah`
            },
            {
                subject: "Last chance (ends tonight)",
                content: `Hi,

This is my last email about this.

The New Year Sale (80% OFF) ends tonight at midnight.

After that, the price goes back to $497.

If you've been on the fence, now's the time.

Enroll here: https://sarah.accredipro.academy/checkout-fm-certification

Whatever you decide, I wish you the best on your health journey.

Sarah M.
AccrediPro Academy`
            }
        ];
        const selectedEmail = emails[emailNum - 1] || emails[0];
        subject = selectedEmail.subject;
        content = selectedEmail.content;
    }

    try {
        const wrapper = style === "personal" ? personalEmailWrapper : brandedEmailWrapper;
        const result = await sendMarketingEmail({
            to: email,
            subject,
            html: wrapper(content),
            replyTo: "sarah@accredipro-certificate.com"
        });

        return NextResponse.json({
            success: result.success,
            message: `Email sent to ${email}`,
            subject,
            style,
            type: nurtureNum ? `nurture-${nurtureNum}` : `chat-${emailNum}`,
            error: result.error
        });
    } catch (error) {
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}
