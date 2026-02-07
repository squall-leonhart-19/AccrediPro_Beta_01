import { NextResponse } from "next/server";
import { sendEmail, personalEmailWrapper, emailWrapper } from "@/lib/email";

/**
 * Lead Email Templates - Inbox-Optimized (Re: prefix, no emojis)
 * 
 * PROVEN PATTERNS from inbox-test:
 * - "Re:" prefix = PRIMARY (5/5 tests)
 * - No emojis = better deliverability
 * - Plain text style = looks personal
 * - Short paragraphs = easy to read
 */

const BASE_URL = "https://learn.accredipro.academy/womens-health-diploma";

// Helper to strip emojis
function cleanContent(content: string): string {
    return content
        .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}]/gu, '')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .trim();
}

// SECTION: MINI_DIPLOMA - Women's Health Lead Emails
export const MINI_DIPLOMA_EMAILS = {
    // Day 0: Welcome
    welcome: {
        subject: (firstName: string) => `Re: your Women's Health access, ${firstName}`,
        content: (firstName: string) => cleanContent(`${firstName},

You're in.

I just saw your name come through, and I wanted to personally welcome you.

Your FREE Women's Health Mini Diploma is ready - you can start right now.

Here's what you're getting:
- 9 quick lessons (about 6 minutes each)
- Real knowledge about hormones, cycles, and women's health
- Your own certificate when you finish
- 7 days of access

This isn't like other freebies that sit in your downloads folder. This is real training.

Start Lesson 1 now: ${BASE_URL}

I also left you a personal voice message inside. Check your Messages when you log in.

Got questions? Just reply to this email.

Sarah`),
    },

    // Day 1: Start nudge
    day1_start: {
        subject: (firstName: string) => `Re: quick question, ${firstName}`,
        content: (firstName: string) => cleanContent(`${firstName},

Just checking in - have you had a chance to start your Mini Diploma yet?

I know life gets busy. But here's the thing: Lesson 1 takes just 6 minutes. That's shorter than your morning coffee break.

Once you start, you'll understand why hormones affect EVERYTHING - your energy, mood, weight, sleep, even your skin.

Your access is active for 7 days. Let's not waste it.

Start now: ${BASE_URL}

I left you a voice message inside too - give it a listen.

Sarah`),
    },

    // Day 2: Momentum nudge
    day2_momentum: {
        subject: (firstName: string) => `Re: following up, ${firstName}`,
        content: (firstName: string) => cleanContent(`${firstName},

I noticed you haven't started your lessons yet - is everything okay?

I get it. Starting something new can feel overwhelming. But I want you to know:

2 lessons = just 12 minutes total.

That's it. In 12 minutes, you'll already be ahead of 90% of people who sign up for free courses and never even open them.

You signed up for a reason. That curiosity matters. Don't let it fade.

Start Lesson 1 now: ${BASE_URL}

If something's blocking you, just reply and tell me. I'm here to help.

Sarah`),
    },

    // Lesson 3 Complete: Halfway
    lesson3_complete: {
        subject: (firstName: string) => `Re: you're halfway there, ${firstName}`,
        content: (firstName: string) => cleanContent(`${firstName},

You just completed Lesson 3 - you're officially HALFWAY through your Mini Diploma.

I'm so proud of you right now.

Most people who download free courses never even start. But you? You're DOING the work. That tells me something about you.

What you've learned so far:
- The 5 key female hormones
- The 4 menstrual cycle phases
- Signs of hormonal imbalances

And the best stuff is coming up in Lessons 4-6.

Keep going: ${BASE_URL}

You've got this.

Sarah`),
    },

    // Lesson 6 Complete: 2/3 done
    lesson6_complete: {
        subject: (firstName: string) => `Re: only 3 lessons left, ${firstName}`,
        content: (firstName: string) => cleanContent(`${firstName},

Lesson 6 DONE. You're two-thirds through your Mini Diploma.

You now know more about women's health than most people ever will:
- Hormones and cycles
- Gut-hormone connection
- Thyroid function
- Stress and adrenals

Only 3 more lessons until your certificate.

Can you finish today? I think you can.

Go get it: ${BASE_URL}

So proud of you,
Sarah`),
    },

    // Day 4: 3 days left
    day4_urgency: {
        subject: (firstName: string) => `Re: 3 days left, ${firstName}`,
        content: (firstName: string) => cleanContent(`${firstName},

Quick heads up - your access to the Women's Health Mini Diploma expires in just 3 days.

You've got {{lessonsRemaining}} lessons left. Each one is only about 6 minutes - you can totally finish this.

Don't miss out on your certificate.

I know you're busy. But imagine how you'll feel when you've actually FINISHED something. When you have that certificate to show for it.

Start now: ${BASE_URL}

I'm here cheering you on,
Sarah`),
    },

    // Day 5: 48 hours
    day5_48h: {
        subject: (firstName: string) => `Re: 48 hours left, ${firstName}`,
        content: (firstName: string) => cleanContent(`${firstName},

Your access expires in just 48 HOURS.

You've still got {{lessonsRemaining}} lessons to go. Each one is only 6 minutes.

I really don't want you to miss getting your certificate. You came so far just to stop now?

Finish tonight? I believe in you.

Go now: ${BASE_URL}

Sarah`),
    },

    // Day 6: Last day
    day6_final: {
        subject: (firstName: string) => `Re: last day, ${firstName}`,
        content: (firstName: string) => cleanContent(`${firstName},

This is it. LAST DAY.

Your access expires tomorrow and your certificate is so close.

Just {{lessonsRemaining}} more lessons. You can do this TODAY.

Each lesson is 6 minutes. That's less time than scrolling your phone.

Your certificate is waiting: ${BASE_URL}

Don't let this slip away,
Sarah

PS: If you're already done, ignore this. But if not - GO FINISH.`),
    },

    // All 9 Complete
    all_complete: {
        subject: (firstName: string) => `Re: you did it, ${firstName}!`,
        content: (firstName: string) => cleanContent(`${firstName},

YOU DID IT. All 3 lessons COMPLETE.

I am so incredibly proud of you right now.

You now understand:
- The 5 key female hormones
- The 4 menstrual cycle phases
- Hormonal imbalance signs
- The gut-hormone connection
- Thyroid function
- Stress and adrenals
- Nutrition for hormone balance
- Life stage support

This is REAL knowledge that will help REAL women - starting with YOU.

YOUR CERTIFICATE IS COMING!

Within the next 24 hours, you'll receive:
- Your official certificate via email
- Access to it in your portal
- 30 days of continued graduate access

Thank you for learning with me. I can't wait to see what you do with this knowledge.

With so much pride,
Sarah

PS: Want to learn how to turn this knowledge into a $10K/month income? Just reply with "." and I'll send you the roadmap.`),
    },
};

// Re-export for backward compatibility
export const LEAD_EMAILS = MINI_DIPLOMA_EMAILS;

// Sarah signature in italic/cursive like a real handwritten signature
const SARAH_SIGNATURE = `
<div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
    <p style="margin: 0; font-family: 'Georgia', 'Times New Roman', serif; font-style: italic; color: #722F37; font-size: 20px;">– Sarah</p>
    <p style="margin: 5px 0 0 0; color: #999; font-size: 12px;">Your Coach at AccrediPro Academy</p>
</div>`;

// SECTION: ONBOARDING_NUDGES - Buyer Onboarding Step Nudges (Branded HTML)
export const ONBOARDING_NUDGE_EMAILS = {
    profile: {
        subject: (firstName: string) => `Quick thing, ${firstName}...`,
        preheader: "Complete your profile in 30 seconds – I'd love to see who I'm working with!",
        content: (firstName: string) => `
            <h2 style="color: #722F37; margin: 0 0 20px 0; font-size: 22px;">Hey ${firstName},</h2>
            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">I noticed you haven't finished setting up your profile yet.</p>
            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">Adding a photo and a short bio helps me understand your goals better – and makes our community feel more connected.</p>
            <p style="margin: 0 0 25px 0; font-size: 16px; line-height: 1.6;">Takes 30 seconds:</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://learn.accredipro.academy/dashboard" style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); color: #D4AF37; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Complete Your Profile →</a>
            </div>
            <p style="margin: 20px 0 0 0; font-size: 14px; color: #666; font-style: italic;">P.S. I love seeing who I'm working with! 📸</p>
            ${SARAH_SIGNATURE}
        `,
    },
    message: {
        subject: () => `I'm right here if you need me`,
        preheader: "Whether you have questions or just want to chat – I'm here for you.",
        content: (firstName: string) => `
            <h2 style="color: #722F37; margin: 0 0 20px 0; font-size: 22px;">Hey ${firstName},</h2>
            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">Just wanted to remind you – you can message me anytime.</p>
            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">Whether you have questions about the curriculum, need help with a concept, or just want to chat about your goals... I'm here.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://learn.accredipro.academy/messages" style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); color: #D4AF37; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Send Me a Message →</a>
            </div>
            <p style="margin: 20px 0 0 0; font-size: 14px; color: #666; font-style: italic;">P.S. No question is too small! 💬</p>
            ${SARAH_SIGNATURE}
        `,
    },
    lesson: {
        subject: () => `Your first lesson takes 5 mins`,
        preheader: "Just 5 minutes to start your certification journey. Ready?",
        content: (firstName: string) => `
            <h2 style="color: #722F37; margin: 0 0 20px 0; font-size: 22px;">Hey ${firstName},</h2>
            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">I've been checking in and noticed you haven't started your first lesson yet.</p>
            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">I get it – life is busy. But here's the thing: <strong>your first lesson literally takes 5 minutes</strong> and sets the foundation for everything.</p>
            <p style="margin: 0 0 25px 0; font-size: 16px; line-height: 1.6;">Ready to start?</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://learn.accredipro.academy/my-courses" style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); color: #D4AF37; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Start Your First Lesson →</a>
            </div>
            <p style="margin: 20px 0 0 0; font-size: 14px; color: #666; font-style: italic;">P.S. You've got this! 🌟</p>
            ${SARAH_SIGNATURE}
        `,
    },
    community: {
        subject: () => `The community is waiting for you`,
        preheader: "Introduce yourself – everyone's super welcoming!",
        content: (firstName: string) => `
            <h2 style="color: #722F37; margin: 0 0 20px 0; font-size: 22px;">Hey ${firstName},</h2>
            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">Quick one – have you introduced yourself in the community yet?</p>
            <p style="margin: 0 0 16px 0; font-size: 16px; line-height: 1.6;">It's a simple post and a great way to connect with others on the same path. Plus, the accountability and support are game-changers.</p>
            <div style="text-align: center; margin: 30px 0;">
                <a href="https://learn.accredipro.academy/community/cmkvj0klb0000bim95cl2peji" style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); color: #D4AF37; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Introduce Yourself →</a>
            </div>
            <p style="margin: 20px 0 0 0; font-size: 14px; color: #666; font-style: italic;">P.S. Everyone's super welcoming. No pressure, just support! 🤝</p>
            ${SARAH_SIGNATURE}
        `,
    },
};

// Available sections for testing
export const EMAIL_SECTIONS = {
    mini_diploma: Object.keys(MINI_DIPLOMA_EMAILS),
    onboarding: Object.keys(ONBOARDING_NUDGE_EMAILS),
};

/**
 * POST /api/test-email
 * 
 * Test endpoint to send lead emails (inbox-optimized).
 * 
 * Usage: POST with { email, firstName, type, section? }
 * - section: "mini_diploma" (default) or future sections
 * - type: email key within section
 */
export async function POST(request: Request) {
    try {
        const {
            email,
            firstName = "there",
            type = "welcome",
            section = "mini_diploma",
            lessonsRemaining = "3"
        } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email required" }, { status: 400 });
        }

        // Get section
        const sectionEmails = section === "mini_diploma"
            ? MINI_DIPLOMA_EMAILS
            : section === "onboarding"
                ? ONBOARDING_NUDGE_EMAILS
                : null;
        if (!sectionEmails) {
            return NextResponse.json({
                error: `Unknown section: ${section}`,
                availableSections: Object.keys(EMAIL_SECTIONS)
            }, { status: 400 });
        }

        const template = sectionEmails[type as keyof typeof sectionEmails];
        if (!template) {
            return NextResponse.json({
                error: `Unknown type: ${type}`,
                availableTypes: Object.keys(sectionEmails)
            }, { status: 400 });
        }

        const subject = template.subject(firstName);
        let content = template.content(firstName);
        content = content.replace(/\{\{lessonsRemaining\}\}/g, lessonsRemaining);

        // Use branded emailWrapper for onboarding, personalEmailWrapper for mini_diploma
        // Onboarding emails get preheader and reply-to for trust/warming
        const preheader = section === "onboarding" ? (template as any).preheader : undefined;
        const wrapContent = section === "onboarding"
            ? emailWrapper(content, preheader)
            : personalEmailWrapper(content.replace(/\n/g, '<br>'));

        const result = await sendEmail({
            to: email,
            subject,
            html: wrapContent,
            replyTo: section === "onboarding" ? "sarah@accredipro-certificate.com" : undefined,
            type: "transactional",
        });

        if (result.success) {
            console.log(`✅ [${section}/${type}] Email sent to ${email}`);
            return NextResponse.json({ success: true, message: `${type} email sent to ${email}` });
        } else {
            console.error(`❌ [${section}/${type}] Failed:`, result.error);
            return NextResponse.json({ success: false, error: result.error }, { status: 500 });
        }

    } catch (error) {
        console.error("[TEST-EMAIL] Error:", error);
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
    }
}

/**
 * GET /api/test-email?email=xxx&section=mini_diploma&sendAll=true
 * 
 * Send all emails in a section for testing
 */
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");
    const section = searchParams.get("section") || "mini_diploma";
    const sendAll = searchParams.get("sendAll");

    if (!email) {
        return NextResponse.json({
            availableSections: Object.keys(EMAIL_SECTIONS),
            sectionContents: EMAIL_SECTIONS,
            usage: "GET ?email=xxx&section=mini_diploma&sendAll=true"
        });
    }

    const sectionEmails = section === "mini_diploma"
        ? MINI_DIPLOMA_EMAILS
        : section === "onboarding"
            ? ONBOARDING_NUDGE_EMAILS
            : null;
    if (!sectionEmails) {
        return NextResponse.json({ error: `Unknown section: ${section}` }, { status: 400 });
    }

    if (sendAll === "true") {
        const results: Record<string, boolean> = {};
        const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

        for (const type of Object.keys(sectionEmails)) {
            const template = sectionEmails[type as keyof typeof sectionEmails];
            const subject = template.subject("Test");
            let content = template.content("Test");
            content = content.replace(/\{\{lessonsRemaining\}\}/g, "3");

            // Use branded emailWrapper for onboarding with preheader, personalEmailWrapper for mini_diploma
            const preheader = section === "onboarding" ? (template as any).preheader : undefined;
            const wrapContent = section === "onboarding"
                ? emailWrapper(content, preheader)
                : personalEmailWrapper(content.replace(/\n/g, '<br>'));

            const result = await sendEmail({
                to: email,
                subject: `[TEST] ${subject}`,
                html: wrapContent,
                replyTo: section === "onboarding" ? "sarah@accredipro-certificate.com" : undefined,
                type: "transactional",
            });

            results[type] = result.success || false;
            console.log(`📧 Sent ${type}: ${result.success ? "✅" : "❌"}`);

            // 1.5 second delay between emails
            await delay(1500);
        }

        return NextResponse.json({ success: true, section, results });
    }

    return NextResponse.json({
        section,
        availableTypes: Object.keys(sectionEmails),
        usage: "Add ?sendAll=true to send all emails in this section"
    });
}
