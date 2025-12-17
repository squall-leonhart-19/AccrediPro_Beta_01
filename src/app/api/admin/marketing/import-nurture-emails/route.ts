import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * POST /api/admin/marketing/import-nurture-emails
 * 
 * Imports the 17 nurture emails from inbox-test variants into SequenceEmail table
 * This is a one-time import to populate the sequence emails
 */

// Nurture sequence emails - same content as inbox-test EMAIL_VARIANTS 1-17
const NURTURE_EMAILS = [
    {
        order: 0,
        subject: "Re: your free Mini Diploma access",
        delayDays: 0,
        delayHours: 0,
        content: `{{firstName}},

Welcome to your Mini Diploma journey!

I'm Sarah, and I'll be your guide through this intro to Functional Medicine.

Over the next 3 days, you'll learn:
- Why "eat better and exercise" doesn't work
- The root-cause approach that's changing healthcare
- How practitioners are building $5-10k/month practices

You'll also earn an actual credential - a Mini Diploma you can be proud of.

<strong>Here's what I want you to do:</strong>

Log into the platform and start Lesson 1. It takes about 20 minutes. By the end, you'll know if this path is right for you.

Start now: https://learn.accredipro.academy/my-mini-diploma

I'll be checking in with more insights over the coming days.

Sarah

P.S. If you have ANY trouble logging in, just reply to this email. I read every single response.`,
    },
    {
        order: 1,
        subject: "Re: my story (thought you'd relate)",
        delayDays: 1,
        delayHours: 0,
        content: `{{firstName}},

Can I tell you something personal?

Two years ago, I was stuck in a job I hated. 

Long hours. Miserable commute. Coming home too exhausted to do anything but collapse on the couch.

<strong>I looked at my reflection in the microwave door and didn't recognize myself.</strong>

When did I become this tired, defeated person?

That's when I discovered functional medicine - and everything changed.

The Mini Diploma you're taking right now? It's the first step on the same path I walked.

So tell me, {{firstName}} - what made you curious about functional medicine? What's YOUR moment?

Hit reply. I want to hear your story.

Sarah

P.S. I still have that microwave. Every time I see my reflection in it now, I smile.`,
    },
    {
        order: 2,
        subject: "Re: why the usual advice doesn't work",
        delayDays: 3,
        delayHours: 0,
        content: `{{firstName}},

"Eat better. Exercise more. Reduce stress."

How many times have you heard that advice?

And how many times has it actually worked?

<strong>Here's the thing:</strong>

Generic advice fails because it treats symptoms, not causes.

"Eat better" doesn't help when you don't know WHAT to eat for YOUR body.
"Reduce stress" doesn't help when the stress is coming from inside (inflammation, blood sugar, hormones).

The real questions are:
- WHY isn't your body working properly?
- What's actually causing the symptoms?
- How do we address the ROOT?

That's what functional medicine does differently.

Keep going with your Mini Diploma - Day 2 covers the 7 Body Systems framework that makes this all click.

Sarah`,
    },
    {
        order: 3,
        subject: "Re: the training I mentioned",
        delayDays: 5,
        delayHours: 0,
        content: `{{firstName}},

Remember the moment I told you about? The microwave reflection?

There's a part I didn't share.

<strong>The 3am Discovery</strong>

That night, after feeling so lost, I couldn't sleep. I went down a rabbit hole - functional medicine, integrative health, root-cause approaches.

By morning, I'd found my path.

I want to show you something that helped me see what was possible:

<strong>The Graduate Training</strong>

It's a 45-minute session where I share:
- The exact path from Mini Diploma to certified practitioner
- Real numbers - what our graduates actually earn
- How to build a practice without burning out

Watch it when you can actually focus. This deserves your full attention.

Sarah`,
    },
    {
        order: 4,
        subject: "Re: Diane's story (burned-out nurse)",
        delayDays: 7,
        delayHours: 0,
        content: `{{firstName}},

I got a message from a woman named Diane last week.

<strong>"Sarah, I love helping people. But I can't do this anymore. The 5am alarms. The 2-hour commutes. I'm 62 years old and I'm tired."</strong>

Then she said something that broke my heart:

"But what else can I do? I'm too old to start over."

Have you ever felt that, {{firstName}}? Too far down one path to change direction?

<strong>What Diane Says Now</strong>

"I finally feel like I'm using everything I know - without sacrificing my health. I wish I'd found this 20 years ago. But I'm grateful I found it at all."

If you've ever thought you're "too old" to change - you're not.

The only thing that matters is: What do you want the next chapter to look like?

Sarah`,
    },
    {
        order: 5,
        subject: "Re: your complete roadmap",
        delayDays: 9,
        delayHours: 0,
        content: `{{firstName}},

One thing I've learned: confusion kills dreams.

So today I'm giving you clarity.

<strong>The Complete Roadmap</strong>

<strong>STEP 0: Mini Diploma (Free - You're Here)</strong>
This is your "try before you buy." You learn root-cause thinking. You decide if this path is for you.
Time: 2-3 hours total

<strong>STEP 1: Certified Practitioner ($997)</strong>
The full training. 21 modules covering biochemistry, labs, protocols, and practice-building.
Time: 8-12 weeks, self-paced

<strong>STEP 2: Build Your Practice</strong>
Start seeing clients. Apply what you learned. Refine your approach.
Income potential: $2,000-$10,000+/month

<strong>Real Results</strong>

Maria: $12,000/month, working from home, waiting list of clients.
Diane: $8,000/month, no more 5am alarms.
Kelly: Fully booked practice, clients finding HER.

Where are you in this journey? Reply and let me know.

Sarah`,
    },
    {
        order: 6,
        subject: "Re: Kelly's story (no clients → waitlist)",
        delayDays: 11,
        delayHours: 0,
        content: `{{firstName}},

I want to tell you about Kelly.

She sent me this message three months after getting certified:

<strong>"Sarah, I have a WAITLIST. I don't know what to do with a waitlist. I've never had a waitlist for anything in my life."</strong>

Here's the thing about Kelly:

She had NO health background before this. She was a project manager. Never worked in healthcare.

But she understood something most people don't:

<strong>You don't need a medical degree to help people truly heal.</strong>

You need:
- The right training
- The right frameworks
- The willingness to do the work

That's it.

If Kelly can do this, so can you.

Sarah`,
    },
    {
        order: 7,
        subject: "Re: what you'll learn inside",
        delayDays: 13,
        delayHours: 0,
        content: `{{firstName}},

Can we talk about something real for a second?

There's a fear that stops more people than any practical obstacle.

It's not money. It's not time. It's not "I'm not smart enough."

<strong>It's fear of judgment.</strong>

"What will people think if I try this and fail?"
"What if my family thinks this is stupid?"
"What if I invest and nothing changes?"

Here's what I've learned:

The people who judge you for trying something new are almost always stuck themselves. They're projecting their own fear onto you.

The people who love you? They'll be your biggest cheerleaders once they see you succeed.

And the only real failure? Not trying at all.

Sarah

P.S. When Maria told her mom she was quitting her job for functional medicine, her mom said she was "throwing money away." Now her mom tells everyone about her "successful daughter."`,
    },
    {
        order: 8,
        subject: "Re: Vicki's story (yoga teacher)",
        delayDays: 15,
        delayHours: 0,
        content: `{{firstName}},

Not everyone wants to build a full-time practice.

Vicki was a yoga teacher. She loved her work. She didn't want to give it up.

But she was frustrated. Her students kept asking her questions she couldn't answer. About supplements. About hormones. About why they felt so tired all the time.

<strong>So she got certified.</strong>

Not to leave yoga. To ADD to it.

Now she offers "Root Cause Assessments" to her yoga students. $350 per session. One or two a week.

<strong>That's $2,800-$4,200/month extra. On top of her yoga income.</strong>

No business cards. No website. No marketing. Just her existing students, grateful to have someone who could finally help them.

What could an extra few thousand a month mean for YOUR life, {{firstName}}?

Sarah`,
    },
    {
        order: 9,
        subject: "Re: the investment (let's talk numbers)",
        delayDays: 17,
        delayHours: 0,
        content: `{{firstName}},

Let me be honest about something.

A certificate on your wall doesn't automatically make you money.

<strong>What certification actually gives you:</strong>

1. **Confidence** - You KNOW you can help people. Not just hoping. Knowing.

2. **Credibility** - A real credential you can point to. Something that sets you apart.

3. **Community** - Access to other practitioners who've walked this path. You're not alone.

4. **Frameworks** - Step-by-step systems for everything. Intake forms. Lab interpretation. Protocol design.

5. **Permission** - Sometimes we need someone to tell us: "YES, you can do this." Consider this your permission.

The certification doesn't do the work for you. But it gives you everything you need to do the work yourself.

Sarah`,
    },
    {
        order: 10,
        subject: "Re: what's holding you back",
        delayDays: 19,
        delayHours: 0,
        content: `{{firstName}},

I believe in transparency. So let me share real numbers.

<strong>What Our Graduates Charge:</strong>
- Initial consultations: $175-$400
- Follow-up sessions: $75-$200
- Monthly packages: $350-$1,000

<strong>What They Earn:</strong>
- Part-time (5-10 clients/month): $1,750-$4,000
- Full-time (15-25 clients/month): $6,000-$12,000+
- Premium positioning: $15,000-$25,000+

<strong>Time to First Client:</strong>
- Average: 30-60 days after certification
- Fastest: 2 weeks (from existing network)

<strong>Investment in Training:</strong>
- $997 (or payment plan)

<strong>Time to ROI:</strong>
- Most recover investment with 3-5 clients

I'm not promising you'll make any specific amount. That depends on YOU. But these numbers are real, from real graduates.

Sarah`,
    },
    {
        order: 11,
        subject: "Re: two futures",
        delayDays: 21,
        delayHours: 0,
        content: `{{firstName}},

You're probably asking: "Can I really do this?"

Let me answer with a question:

Have you ever helped a friend with their health? Given advice about supplements? Recommended a book or podcast? Spent hours researching something for someone you love?

<strong>Then you already have the instinct.</strong>

What you're missing isn't capability. It's:
- Structured knowledge
- Proven frameworks
- Professional credibility

Those are learnable. Trainable. Achievable.

The instinct to help? That can't be taught. And you already have it.

So yes, {{firstName}}. You can do this.

The only question is whether you will.

Sarah`,
    },
    {
        order: 12,
        subject: "Re: Maria's full story (you need to hear this)",
        delayDays: 23,
        delayHours: 0,
        content: `{{firstName}},

I want to try something with you.

Close your eyes for a second. (Well, read this first, THEN close your eyes.)

<strong>Imagine It's December 2026</strong>

You're sitting somewhere comfortable. A full year has passed.

<strong>Future A: You Didn't Take Action</strong>

Same job. Same frustrations. Same Sunday night dread.

That dream of helping people? Still just a dream.

Not terrible. Just... the same.

<strong>Future B: You Made A Decision</strong>

You're certified. You've been for months now.

You have clients. Maybe 5. Maybe 15. Women who come to you frustrated and leave with answers.

You're earning money doing this. Maybe $2,000/month. Maybe $8,000.

And that feeling of "I'm meant for something more"? It's gone. Because you're finally doing the more.

<strong>Both futures take the same amount of time.</strong>

The only difference? The decision you make now.

Sarah`,
    },
    {
        order: 13,
        subject: "Re: your questions (answered)",
        delayDays: 25,
        delayHours: 0,
        content: `{{firstName}},

Before you decide anything, honest answers to the questions I know you're asking:

<strong>"What if I'm not smart enough?"</strong>
Patricia is 58. Hasn't been in school since the 1980s. She certified in 9 weeks. If you can follow a recipe, you can do this.

<strong>"What if I fail?"</strong>
You can retake any assessment. There's no time limit. The only way to fail is to not try.

<strong>"What if I can't get clients?"</strong>
You get done-for-you client acquisition systems, scripts, templates, and a supportive community.

<strong>"What if my family thinks this is stupid?"</strong>
They might at first. Until you replace your income working from home.

<strong>"What if I invest and then life gets crazy?"</strong>
You get lifetime access. Start. Pause. Resume. We're not going anywhere.

<strong>"Is there a guarantee?"</strong>
Yes. 30 days, no questions asked.

What other questions do you have? Reply and ask me anything.

Sarah`,
    },
    {
        order: 14,
        subject: "Re: enrollment closing Friday",
        delayDays: 27,
        delayHours: 0,
        content: `{{firstName}},

I need to tell you something important.

<strong>This enrollment period closes Friday at midnight.</strong>

What you get by Friday:

<strong>THE CORE PROGRAM:</strong>
- All 21 training modules
- Lifetime access (no expiration)
- Certificate upon completion

<strong>THE SUPPORT:</strong>
- Private community of practitioners
- Direct access to our mentor team
- Q&A calls with experts

<strong>THIS WEEK'S BONUSES (Disappear Friday):</strong>
- Client Attraction Masterclass ($297 value)
- Done-For-You Protocol Templates ($197 value)

<strong>THE GUARANTEE:</strong>
- 30 days, no questions asked

If you're on the fence, reply RIGHT NOW. I'm here to answer whatever's holding you back.

Sarah`,
    },
    {
        order: 15,
        subject: "Re: 48 hours left",
        delayDays: 28,
        delayHours: 0,
        content: `{{firstName}},

48 hours.

That's how much time you have before the bonuses disappear and enrollment closes.

<strong>What's really holding you back?</strong>

<strong>If it's fear:</strong>
Maria was terrified. Diane was terrified. Kelly was terrified. They did it anyway.

<strong>If it's money:</strong>
Payment plans available. $179/month.

<strong>If it's time:</strong>
5-7 hours a week. Self-paced. Watch on your phone during lunch.

<strong>If it's doubt:</strong>
That's what the 30-day guarantee is for. Zero risk.

Saturday morning, this email will be irrelevant. The doors will be closed.

Make the decision.

Sarah

P.S. I've never had someone regret enrolling. I've had plenty regret waiting.`,
    },
    {
        order: 16,
        subject: "Re: final call",
        delayDays: 29,
        delayHours: 0,
        content: `{{firstName}},

This is my last email.

<strong>Tonight at midnight, enrollment closes.</strong>

You didn't read 17 emails from a stranger by accident. Something in you resonates with this path.

The question is: Will you let that something win?

<strong>The Math One More Time</strong>

Investment: $997 (or $179/month)
Time: 8-12 weeks
Risk: Zero (30-day guarantee)
Upside: A completely different life

<strong>My Promise To You</strong>

If you join tonight:
- I will personally welcome you to the community
- You will have every resource you need to succeed
- You will not be alone in this
- And if it's truly not right for you, you'll get every penny back

A year from now, you'll be a year older either way.

The only question is whether you'll be in the same place... or somewhere completely different.

<strong>This is your moment, {{firstName}}.</strong>

I hope I see you inside.

Sarah

P.S. Doors close at midnight. This is it.`,
    },
];

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Find the nurture sequence
        const sequence = await prisma.sequence.findFirst({
            where: {
                OR: [
                    { name: { contains: "Nurture" } },
                    { name: { contains: "Mini Diploma" } },
                ],
            },
        });

        if (!sequence) {
            return NextResponse.json({ error: "Nurture sequence not found" }, { status: 404 });
        }

        console.log(`[IMPORT] Importing emails into sequence: ${sequence.name} (${sequence.id})`);

        // Delete existing emails for this sequence
        await prisma.sequenceEmail.deleteMany({
            where: { sequenceId: sequence.id },
        });

        // Insert new emails
        const createdEmails = [];
        for (const email of NURTURE_EMAILS) {
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

        // Update sequence total emails
        await prisma.sequence.update({
            where: { id: sequence.id },
            data: { totalEmails: createdEmails.length },
        });

        return NextResponse.json({
            success: true,
            message: `Imported ${createdEmails.length} emails into sequence "${sequence.name}"`,
            sequenceId: sequence.id,
            emails: createdEmails.map(e => ({ order: e.order, subject: e.customSubject })),
        });
    } catch (error) {
        console.error("[IMPORT] Error:", error);
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
