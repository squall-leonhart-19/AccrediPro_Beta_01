import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * POST /api/admin/marketing/sequences/[id]/import-emails
 * 
 * Import emails from templates based on sequence slug.
 * This works for any sequence - it looks up predefined email content
 * from EMAIL_TEMPLATES based on the sequence slug.
 */

// Email templates for different sequences
// Format: { [sequenceSlug]: Array<{ order, subject, delayDays, delayHours, content }> }
const EMAIL_TEMPLATES: Record<string, Array<{
    order: number;
    subject: string;
    delayDays: number;
    delayHours: number;
    content: string;
}>> = {
    // Scholarship Downsell (Days 35-37)
    "scholarship-downsell": [
        {
            order: 0,
            subject: "Re: a special opportunity",
            delayDays: 0,
            delayHours: 0,
            content: `{{firstName}},

I noticed you didn't join us during the enrollment period.

And I want you to know - <strong>I completely understand.</strong>

Maybe it wasn't the right time. Maybe the investment felt like too much. Maybe life just got in the way.

Whatever the reason, I'm not here to pressure you. I'm here because I genuinely believe you have what it takes to do this work.

<strong>That's why I'm reaching out with something special.</strong>

<strong>The Scholarship Program</strong>

I've reserved a small number of scholarship spots for people who completed the Mini Diploma but couldn't make the full investment work.

Instead of the normal $997, scholarship recipients pay just <strong>$497</strong>.

You get everything:
- All 21 training modules
- Lifetime access
- Full certification upon completion
- Private community access
- 30-day money-back guarantee

<strong>The only difference is the price.</strong>

The scholarship expires in <strong>48 hours</strong>. After that, the price goes back to $997.

Sarah

P.S. I'm not doing this to create fake urgency. The 48-hour window is real.`,
        },
        {
            order: 1,
            subject: "Re: why I created scholarships",
            delayDays: 1,
            delayHours: 0,
            content: `{{firstName}},

I want to tell you why scholarships exist in our program.

About two years ago, a woman named Teresa reached out to me. She'd completed the Mini Diploma. She was excited, engaged, asked smart questions.

But when enrollment opened, she didn't join.

I followed up. Her response broke my heart:

<strong>"Sarah, I want this more than anything. But I'm a single mom working two jobs. $997 might as well be $10,000. I just can't make it work right now."</strong>

Here was a woman who had everything it takes - the passion, the intelligence, the drive. The only thing standing between her and a completely different life was $500.

So I made a decision. I called Teresa. I told her I'd created a scholarship spot for her. Half price. Same program. Same certification.

She cried on the phone.

<strong>Eight months later, she was earning $6,000/month from her home office.</strong>

<strong>24 Hours Left</strong>

The scholarship I offered you expires tomorrow at midnight.

<strong>$497 instead of $997.</strong>

Reply if you have questions. I'm here.

Sarah`,
        },
        {
            order: 2,
            subject: "Re: scholarship expires midnight",
            delayDays: 2,
            delayHours: 0,
            content: `{{firstName}},

This is my last email about the scholarship.

<strong>Tonight at midnight, it expires.</strong>

$497 becomes $997. The scholarship spot goes to someone else.

<strong>The Math One Last Time</strong>

Investment: <strong>$497</strong> (scholarship price)
Normal price: $997
You save: <strong>$500</strong>

What you get:
- All 21 training modules
- Lifetime access
- Full certification
- Private community
- 30-day guarantee

<strong>Zero risk. Maximum upside.</strong>

<strong>Scholarship expires midnight. This is it.</strong>

I hope I see you inside.

Sarah`,
        },
    ],

    // Recovery: Never Logged In
    "recovery-never-logged-in": [
        {
            order: 0,
            subject: "Re: did you see this? (your access)",
            delayDays: 1,
            delayHours: 0,
            content: `{{firstName}},

Quick note - I noticed you haven't logged in yet!

Your Mini Diploma access is ready and waiting. Just click below to get started:

https://learn.accredipro.academy/my-mini-diploma

The first lesson takes about 20 minutes and covers the fundamentals of root-cause thinking.

If you're having any trouble logging in, just reply to this email. I'm here to help.

Sarah`,
        },
        {
            order: 1,
            subject: "Re: quick question about your Mini Diploma",
            delayDays: 3,
            delayHours: 0,
            content: `{{firstName}},

I wanted to check in - is everything okay?

You signed up for the Mini Diploma a few days ago, but I haven't seen you log in yet.

Is something preventing you from getting started? Maybe:
- Technical issues with login?
- Not sure where to begin?
- Life got busy?

Whatever it is, I'm here to help. Just hit reply and let me know.

Your access is still active and ready when you are.

Sarah`,
        },
        {
            order: 2,
            subject: "Re: last chance to activate your access",
            delayDays: 7,
            delayHours: 0,
            content: `{{firstName}},

This is my last email about your Mini Diploma access.

I know life gets busy. I know sometimes things get pushed to "later" and later never comes.

But you signed up for a reason. Something about functional medicine called to you.

<strong>Your access is still there.</strong> The lessons are waiting. The credential is ready to be earned.

One click: https://learn.accredipro.academy/my-mini-diploma

If you've changed your mind, that's okay too. I won't keep filling your inbox.

But if there's still a part of you that wants to explore this path... now's the time.

Sarah`,
        },
    ],

    // Recovery: Never Started Learning
    "recovery-never-started": [
        {
            order: 0,
            subject: "Re: the first lesson takes 5 minutes",
            delayDays: 2,
            delayHours: 0,
            content: `{{firstName}},

I noticed you logged in but haven't started the training yet.

I get it - starting something new can feel overwhelming. But here's the thing:

<strong>The first lesson is only 5 minutes.</strong>

That's it. Five minutes to see if this is right for you.

You don't have to commit to the whole thing right now. Just start with Lesson 1 and see how it feels.

https://learn.accredipro.academy/my-mini-diploma

Sarah`,
        },
        {
            order: 1,
            subject: "Re: most people start here...",
            delayDays: 5,
            delayHours: 0,
            content: `{{firstName}},

Want to know what most successful students do first?

They don't overthink it. They just start Lesson 1 and take it from there.

The Mini Diploma is designed to be digestible. Short lessons. Clear concepts. No overwhelm.

Give yourself permission to just BEGIN. You can always adjust your pace later.

Start here: https://learn.accredipro.academy/my-mini-diploma

Sarah`,
        },
        {
            order: 2,
            subject: "Re: still interested in functional medicine?",
            delayDays: 10,
            delayHours: 0,
            content: `{{firstName}},

I wanted to check in one more time.

You signed up for the Mini Diploma a while ago, but you haven't started yet.

<strong>If you're still interested:</strong> Your access is waiting. The lessons are ready. Everything picks up right where you left off.

<strong>If you've moved on:</strong> That's okay too. Sometimes the timing just isn't right.

Either way, I wish you all the best on your journey - wherever it takes you.

Sarah`,
        },
    ],

    // Recovery: Abandoned Learning
    "recovery-abandoned-learning": [
        {
            order: 0,
            subject: "Re: noticed you haven't been back",
            delayDays: 7,
            delayHours: 0,
            content: `{{firstName}},

I noticed you started the Mini Diploma but haven't been back in a while.

No judgment - life happens. We all have those moments where something important gets pushed aside.

But I wanted to remind you: <strong>your progress is saved.</strong>

You can pick up right where you left off. No need to start over.

When you're ready: https://learn.accredipro.academy/my-mini-diploma

Sarah`,
        },
        {
            order: 1,
            subject: "Re: where did you leave off?",
            delayDays: 14,
            delayHours: 0,
            content: `{{firstName}},

Just checking in.

You were making progress on your Mini Diploma - what happened?

If something's blocking you, I'd love to hear about it. Whether it's:
- The content felt confusing
- Life got in the way
- You're not sure this is right for you

Whatever it is, reply and let me know. I read every email.

Your progress is still saved and waiting for you.

Sarah`,
        },
        {
            order: 2,
            subject: "Re: your Mini Diploma is waiting",
            delayDays: 21,
            delayHours: 0,
            content: `{{firstName}},

This is my last check-in about your Mini Diploma.

Your progress is still saved. The credential is still waiting to be earned.

When you're ready - and only when YOU'RE ready - everything will be there.

https://learn.accredipro.academy/my-mini-diploma

Wishing you all the best,

Sarah`,
        },
    ],
};

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id: sequenceId } = await params;

        // Get the sequence
        const sequence = await prisma.sequence.findUnique({
            where: { id: sequenceId },
            select: { id: true, name: true, slug: true },
        });

        if (!sequence) {
            return NextResponse.json({ error: "Sequence not found" }, { status: 404 });
        }

        // Check if we have templates for this sequence
        const templates = EMAIL_TEMPLATES[sequence.slug];

        if (!templates || templates.length === 0) {
            return NextResponse.json({
                error: `No email templates found for sequence "${sequence.slug}". Templates are available for: ${Object.keys(EMAIL_TEMPLATES).join(", ")}`,
                availableTemplates: Object.keys(EMAIL_TEMPLATES),
            }, { status: 400 });
        }

        console.log(`[IMPORT] Importing ${templates.length} emails into sequence: ${sequence.name} (${sequence.slug})`);

        // Delete existing emails for this sequence
        await prisma.sequenceEmail.deleteMany({
            where: { sequenceId: sequence.id },
        });

        // Insert new emails
        const createdEmails = [];
        for (const email of templates) {
            const created = await prisma.sequenceEmail.create({
                data: {
                    sequenceId: sequence.id,
                    order: email.order,
                    customSubject: email.subject,
                    customContent: email.content,
                    delayDays: email.delayDays,
                    delayHours: email.delayHours,
                    isActive: true,
                },
            });
            createdEmails.push(created);
        }

        return NextResponse.json({
            success: true,
            message: `Imported ${createdEmails.length} emails into sequence "${sequence.name}"`,
            sequenceId: sequence.id,
            imported: createdEmails.length,
            emails: createdEmails.map(e => ({ order: e.order, subject: e.customSubject })),
        });
    } catch (error) {
        console.error("[IMPORT] Error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
