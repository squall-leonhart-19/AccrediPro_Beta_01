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

    // DEFAULT: 17 Nurture Emails (used as fallback for any sequence without specific templates)
    "_default": [
        { order: 0, subject: "Re: your free Mini Diploma access", delayDays: 0, delayHours: 0, content: `{{firstName}},\n\nWelcome to your Mini Diploma journey!\n\nI'm Sarah, and I'll be your guide through this intro to Functional Medicine.\n\nOver the next 3 days, you'll learn:\n- Why "eat better and exercise" doesn't work\n- The root-cause approach that's changing healthcare\n- How practitioners are building $5-10k/month practices\n\nYou'll also earn an actual credential - a Mini Diploma you can be proud of.\n\n<strong>Here's what I want you to do:</strong>\n\nLog into the platform and start Lesson 1. It takes about 20 minutes. By the end, you'll know if this path is right for you.\n\nStart now: https://learn.accredipro.academy/my-mini-diploma\n\nSarah` },
        { order: 1, subject: "Re: my story (thought you'd relate)", delayDays: 1, delayHours: 0, content: `{{firstName}},\n\nCan I tell you something personal?\n\nTwo years ago, I was stuck in a job I hated.\n\nLong hours. Miserable commute. Coming home too exhausted to do anything but collapse on the couch.\n\n<strong>I looked at my reflection in the microwave door and didn't recognize myself.</strong>\n\nWhen did I become this tired, defeated person?\n\nThat's when I discovered functional medicine - and everything changed.\n\nThe Mini Diploma you're taking right now? It's the first step on the same path I walked.\n\nSo tell me, {{firstName}} - what made you curious about functional medicine? What's YOUR moment?\n\nHit reply. I want to hear your story.\n\nSarah` },
        { order: 2, subject: "Re: why the usual advice doesn't work", delayDays: 3, delayHours: 0, content: `{{firstName}},\n\n"Eat better. Exercise more. Reduce stress."\n\nHow many times have you heard that advice?\n\nAnd how many times has it actually worked?\n\n<strong>Here's the thing:</strong>\n\nGeneric advice fails because it treats symptoms, not causes.\n\nThe real questions are:\n- WHY isn't your body working properly?\n- What's actually causing the symptoms?\n- How do we address the ROOT?\n\nThat's what functional medicine does differently.\n\nKeep going with your Mini Diploma - Day 2 covers the 7 Body Systems framework that makes this all click.\n\nSarah` },
        { order: 3, subject: "Re: the training I mentioned", delayDays: 5, delayHours: 0, content: `{{firstName}},\n\nRemember the moment I told you about? The microwave reflection?\n\nThere's a part I didn't share.\n\n<strong>The 3am Discovery</strong>\n\nThat night, after feeling so lost, I couldn't sleep. I went down a rabbit hole - functional medicine, integrative health, root-cause approaches.\n\nBy morning, I'd found my path.\n\nI want to show you something that helped me see what was possible:\n\n<strong>The Graduate Training</strong>\n\nIt's a 45-minute session where I share:\n- The exact path from Mini Diploma to certified practitioner\n- Real numbers - what our graduates actually earn\n- How to build a practice without burning out\n\nWatch it when you can actually focus. This deserves your full attention.\n\nSarah` },
        { order: 4, subject: "Re: Diane's story (burned-out nurse)", delayDays: 7, delayHours: 0, content: `{{firstName}},\n\nI got a message from a woman named Diane last week.\n\n<strong>"Sarah, I love helping people. But I can't do this anymore. The 5am alarms. The 2-hour commutes. I'm 62 years old and I'm tired."</strong>\n\nThen she said something that broke my heart:\n\n"But what else can I do? I'm too old to start over."\n\nHave you ever felt that, {{firstName}}? Too far down one path to change direction?\n\n<strong>What Diane Says Now</strong>\n\n"I finally feel like I'm using everything I know - without sacrificing my health. I wish I'd found this 20 years ago. But I'm grateful I found it at all."\n\nIf you've ever thought you're "too old" to change - you're not.\n\nThe only thing that matters is: What do you want the next chapter to look like?\n\nSarah` },
        { order: 5, subject: "Re: your complete roadmap", delayDays: 9, delayHours: 0, content: `{{firstName}},\n\nOne thing I've learned: confusion kills dreams.\n\nSo today I'm giving you clarity.\n\n<strong>The Complete Roadmap</strong>\n\n<strong>STEP 0: Mini Diploma (Free - You're Here)</strong>\nThis is your "try before you buy." You learn root-cause thinking. You decide if this path is for you.\n\n<strong>STEP 1: Certified Practitioner ($997)</strong>\nThe full training. 21 modules covering biochemistry, labs, protocols, and practice-building.\n\n<strong>STEP 2: Build Your Practice</strong>\nStart seeing clients. Apply what you learned. Refine your approach.\nIncome potential: $2,000-$10,000+/month\n\nWhere are you in this journey? Reply and let me know.\n\nSarah` },
        { order: 6, subject: "Re: Kelly's story (no clients → waitlist)", delayDays: 11, delayHours: 0, content: `{{firstName}},\n\nI want to tell you about Kelly.\n\nShe sent me this message three months after getting certified:\n\n<strong>"Sarah, I have a WAITLIST. I don't know what to do with a waitlist. I've never had a waitlist for anything in my life."</strong>\n\nHere's the thing about Kelly:\n\nShe had NO health background before this. She was a project manager. Never worked in healthcare.\n\nBut she understood something most people don't:\n\n<strong>You don't need a medical degree to help people truly heal.</strong>\n\nYou need:\n- The right training\n- The right frameworks\n- The willingness to do the work\n\nThat's it.\n\nIf Kelly can do this, so can you.\n\nSarah` },
        { order: 7, subject: "Re: what you'll learn inside", delayDays: 13, delayHours: 0, content: `{{firstName}},\n\nCan we talk about something real for a second?\n\nThere's a fear that stops more people than any practical obstacle.\n\nIt's not money. It's not time. It's not "I'm not smart enough."\n\n<strong>It's fear of judgment.</strong>\n\n"What will people think if I try this and fail?"\n"What if my family thinks this is stupid?"\n"What if I invest and nothing changes?"\n\nHere's what I've learned:\n\nThe people who judge you for trying something new are almost always stuck themselves. They're projecting their own fear onto you.\n\nThe people who love you? They'll be your biggest cheerleaders once they see you succeed.\n\nAnd the only real failure? Not trying at all.\n\nSarah` },
        { order: 8, subject: "Re: Vicki's story (yoga teacher)", delayDays: 15, delayHours: 0, content: `{{firstName}},\n\nNot everyone wants to build a full-time practice.\n\nVicki was a yoga teacher. She loved her work. She didn't want to give it up.\n\nBut she was frustrated. Her students kept asking her questions she couldn't answer.\n\n<strong>So she got certified.</strong>\n\nNot to leave yoga. To ADD to it.\n\nNow she offers "Root Cause Assessments" to her yoga students. $350 per session. One or two a week.\n\n<strong>That's $2,800-$4,200/month extra. On top of her yoga income.</strong>\n\nWhat could an extra few thousand a month mean for YOUR life, {{firstName}}?\n\nSarah` },
        { order: 9, subject: "Re: the investment (let's talk numbers)", delayDays: 17, delayHours: 0, content: `{{firstName}},\n\nLet me be honest about something.\n\nA certificate on your wall doesn't automatically make you money.\n\n<strong>What certification actually gives you:</strong>\n\n1. **Confidence** - You KNOW you can help people. Not just hoping. Knowing.\n2. **Credibility** - A real credential you can point to.\n3. **Community** - Access to other practitioners who've walked this path.\n4. **Frameworks** - Step-by-step systems for everything.\n5. **Permission** - Sometimes we need someone to tell us: "YES, you can do this."\n\nThe certification doesn't do the work for you. But it gives you everything you need to do the work yourself.\n\nSarah` },
        { order: 10, subject: "Re: what's holding you back", delayDays: 19, delayHours: 0, content: `{{firstName}},\n\nI believe in transparency. So let me share real numbers.\n\n<strong>What Our Graduates Charge:</strong>\n- Initial consultations: $175-$400\n- Follow-up sessions: $75-$200\n- Monthly packages: $350-$1,000\n\n<strong>What They Earn:</strong>\n- Part-time (5-10 clients/month): $1,750-$4,000\n- Full-time (15-25 clients/month): $6,000-$12,000+\n\n<strong>Investment in Training:</strong>\n- $997 (or payment plan)\n\n<strong>Time to ROI:</strong>\n- Most recover investment with 3-5 clients\n\nI'm not promising you'll make any specific amount. That depends on YOU. But these numbers are real, from real graduates.\n\nSarah` },
        { order: 11, subject: "Re: two futures", delayDays: 21, delayHours: 0, content: `{{firstName}},\n\nYou're probably asking: "Can I really do this?"\n\nLet me answer with a question:\n\nHave you ever helped a friend with their health? Given advice about supplements? Recommended a book or podcast? Spent hours researching something for someone you love?\n\n<strong>Then you already have the instinct.</strong>\n\nWhat you're missing isn't capability. It's:\n- Structured knowledge\n- Proven frameworks\n- Professional credibility\n\nThose are learnable. Trainable. Achievable.\n\nThe instinct to help? That can't be taught. And you already have it.\n\nSo yes, {{firstName}}. You can do this.\n\nSarah` },
        { order: 12, subject: "Re: Maria's full story (you need to hear this)", delayDays: 23, delayHours: 0, content: `{{firstName}},\n\nI want to try something with you.\n\nClose your eyes for a second. (Well, read this first, THEN close your eyes.)\n\n<strong>Imagine It's December 2026</strong>\n\nYou're sitting somewhere comfortable. A full year has passed.\n\n<strong>Future A: You Didn't Take Action</strong>\n\nSame job. Same frustrations. Same Sunday night dread.\n\nThat dream of helping people? Still just a dream.\n\n<strong>Future B: You Made A Decision</strong>\n\nYou're certified. You've been for months now.\n\nYou have clients. Maybe 5. Maybe 15. Women who come to you frustrated and leave with answers.\n\nYou're earning money doing this. Maybe $2,000/month. Maybe $8,000.\n\n<strong>Both futures take the same amount of time.</strong>\n\nThe only difference? The decision you make now.\n\nSarah` },
        { order: 13, subject: "Re: your questions (answered)", delayDays: 25, delayHours: 0, content: `{{firstName}},\n\nBefore you decide anything, honest answers to the questions I know you're asking:\n\n<strong>"What if I'm not smart enough?"</strong>\nPatricia is 58. Hasn't been in school since the 1980s. She certified in 9 weeks. If you can follow a recipe, you can do this.\n\n<strong>"What if I fail?"</strong>\nYou can retake any assessment. There's no time limit. The only way to fail is to not try.\n\n<strong>"What if I can't get clients?"</strong>\nYou get done-for-you client acquisition systems, scripts, templates, and a supportive community.\n\n<strong>"Is there a guarantee?"</strong>\nYes. 30 days, no questions asked.\n\nWhat other questions do you have? Reply and ask me anything.\n\nSarah` },
        { order: 14, subject: "Re: enrollment closing Friday", delayDays: 27, delayHours: 0, content: `{{firstName}},\n\nI need to tell you something important.\n\n<strong>This enrollment period closes Friday at midnight.</strong>\n\n<strong>THE CORE PROGRAM:</strong>\n- All 21 training modules\n- Lifetime access (no expiration)\n- Certificate upon completion\n\n<strong>THE SUPPORT:</strong>\n- Private community of practitioners\n- Direct access to our mentor team\n- Q&A calls with experts\n\n<strong>THE GUARANTEE:</strong>\n- 30 days, no questions asked\n\nIf you're on the fence, reply RIGHT NOW. I'm here to answer whatever's holding you back.\n\nSarah` },
        { order: 15, subject: "Re: 48 hours left", delayDays: 28, delayHours: 0, content: `{{firstName}},\n\n48 hours.\n\nThat's how much time you have before the bonuses disappear and enrollment closes.\n\n<strong>What's really holding you back?</strong>\n\n<strong>If it's fear:</strong> Maria was terrified. Diane was terrified. Kelly was terrified. They did it anyway.\n\n<strong>If it's money:</strong> Payment plans available. $179/month.\n\n<strong>If it's time:</strong> 5-7 hours a week. Self-paced. Watch on your phone during lunch.\n\n<strong>If it's doubt:</strong> That's what the 30-day guarantee is for. Zero risk.\n\nMake the decision.\n\nSarah` },
        { order: 16, subject: "Re: final call", delayDays: 29, delayHours: 0, content: `{{firstName}},\n\nThis is my last email.\n\n<strong>Tonight at midnight, enrollment closes.</strong>\n\nYou didn't read 17 emails from a stranger by accident. Something in you resonates with this path.\n\n<strong>The Math One More Time</strong>\n\nInvestment: $997 (or $179/month)\nTime: 8-12 weeks\nRisk: Zero (30-day guarantee)\nUpside: A completely different life\n\n<strong>My Promise To You</strong>\n\nIf you join tonight:\n- I will personally welcome you to the community\n- You will have every resource you need to succeed\n- You will not be alone in this\n\nA year from now, you'll be a year older either way.\n\n<strong>This is your moment, {{firstName}}.</strong>\n\nI hope I see you inside.\n\nSarah` },
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
        // If not, use the main nurture sequence as fallback
        let templates = EMAIL_TEMPLATES[sequence.slug];
        let usingFallback = false;

        if (!templates || templates.length === 0) {
            // Use the default template (17 nurture emails)
            templates = EMAIL_TEMPLATES["_default"];
            usingFallback = true;
            console.log(`[IMPORT] No specific template for "${sequence.slug}", using _default (17 nurture emails)`);

            if (!templates || templates.length === 0) {
                return NextResponse.json({
                    error: `No email templates found and no default template available.`,
                    availableTemplates: Object.keys(EMAIL_TEMPLATES),
                }, { status: 400 });
            }
        }

        console.log(`[IMPORT] Importing ${templates.length} emails into sequence: ${sequence.name} (${sequence.slug})`);

        // Delete existing emails for this sequence
        await prisma.sequenceEmail.deleteMany({
            where: { sequenceId: sequence.id },
        });

        // Insert new emails
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const createdEmails: any[] = [];
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
