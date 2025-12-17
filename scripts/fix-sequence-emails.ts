import * as dotenv from "dotenv";
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// 17 Nurture Emails with full content
const NURTURE_EMAILS = [
    {
        order: 0, subject: "Re: your free Mini Diploma access", delayDays: 0, delayHours: 0, content: `{{firstName}},

Welcome to your Mini Diploma journey!

I'm Sarah, and I'll be your guide through this intro to Functional Medicine.

Over the next 3 days, you'll learn:
- Why "eat better and exercise" doesn't work
- The root-cause approach that's changing healthcare
- How practitioners are building $5-10k/month practices

You'll also earn an actual credential - a Mini Diploma you can be proud of.

<strong>Here's what I want you to do:</strong>

Log into the platform and start Lesson 1. It takes about 20 minutes.

Start now: https://learn.accredipro.academy/my-mini-diploma

I'll be checking in with more insights over the coming days.

Sarah

P.S. If you have ANY trouble logging in, just reply to this email.` },
    {
        order: 1, subject: "Re: my story (thought you'd relate)", delayDays: 1, delayHours: 0, content: `{{firstName}},

Can I tell you something personal?

Two years ago, I was stuck in a job I hated.

<strong>I looked at my reflection in the microwave door and didn't recognize myself.</strong>

When did I become this tired, defeated person?

That's when I discovered functional medicine - and everything changed.

The Mini Diploma you're taking right now? It's the first step on the same path I walked.

So tell me, {{firstName}} - what made you curious about functional medicine?

Hit reply. I want to hear your story.

Sarah` },
    {
        order: 2, subject: "Re: why the usual advice doesn't work", delayDays: 3, delayHours: 0, content: `{{firstName}},

"Eat better. Exercise more. Reduce stress."

<strong>Generic advice fails because it treats symptoms, not causes.</strong>

The real questions are:
- WHY isn't your body working properly?
- What's actually causing the symptoms?

That's what functional medicine does differently.

Keep going with your Mini Diploma - Day 2 covers the 7 Body Systems framework.

Sarah` },
    {
        order: 3, subject: "Re: the training I mentioned", delayDays: 5, delayHours: 0, content: `{{firstName}},

<strong>The Graduate Training</strong>

It's a 45-minute session where I share:
- The exact path from Mini Diploma to certified practitioner  
- Real numbers - what our graduates actually earn

Watch it when you can actually focus.

Sarah` },
    {
        order: 4, subject: "Re: Diane's story (burned-out nurse)", delayDays: 7, delayHours: 0, content: `{{firstName}},

"Sarah, I'm 62 years old and I'm tired. But what else can I do? I'm too old to start over."

<strong>What Diane Says Now</strong>

"I finally feel like I'm using everything I know - without sacrificing my health."

If you've ever thought you're "too old" to change - you're not.

Sarah` },
    {
        order: 5, subject: "Re: your complete roadmap", delayDays: 9, delayHours: 0, content: `{{firstName}},

<strong>The Complete Roadmap</strong>

STEP 0: Mini Diploma (Free - You're Here)
STEP 1: Certified Practitioner ($997)
STEP 2: Build Your Practice ($2,000-$10,000+/month)

Sarah` },
    {
        order: 6, subject: "Re: Kelly's transformation", delayDays: 11, delayHours: 0, content: `{{firstName}},

Kelly had NO health background. She was a project manager.

Three months after getting certified: "Sarah, I have a WAITLIST."

<strong>You don't need a medical degree to help people truly heal.</strong>

Sarah` },
    {
        order: 7, subject: "Re: the fear nobody talks about", delayDays: 13, delayHours: 0, content: `{{firstName}},

It's not money. It's not time. It's not "I'm not smart enough."

<strong>It's fear of judgment.</strong>

The people who judge you for trying something new are almost always stuck themselves.

The only real failure? Not trying at all.

Sarah` },
    {
        order: 8, subject: "Re: Vicki's side-income story", delayDays: 15, delayHours: 0, content: `{{firstName}},

Vicki was a yoga teacher. She didn't want to leave yoga.

So she got certified and added "Root Cause Assessments" to her students. $350 per session.

<strong>$2,800-$4,200/month extra.</strong>

Sarah` },
    {
        order: 9, subject: "Re: what certification actually gets you", delayDays: 17, delayHours: 0, content: `{{firstName}},

<strong>What certification actually gives you:</strong>

1. Confidence - You KNOW you can help people
2. Credibility - A real credential
3. Community - Other practitioners
4. Frameworks - Step-by-step systems
5. Permission - YES, you can do this

Sarah` },
    {
        order: 10, subject: "Re: the real numbers", delayDays: 19, delayHours: 0, content: `{{firstName}},

<strong>What Our Graduates Earn:</strong>
- Part-time (5-10 clients/month): $1,750-$4,000
- Full-time (15-25 clients/month): $6,000-$12,000+

Most recover their $997 investment with 3-5 clients.

Sarah` },
    {
        order: 11, subject: "Re: the question you're asking", delayDays: 21, delayHours: 0, content: `{{firstName}},

"Can I really do this?"

Have you ever helped a friend with their health? Given advice about supplements?

<strong>Then you already have the instinct.</strong>

Sarah` },
    {
        order: 12, subject: "Re: thinking about your decision", delayDays: 23, delayHours: 0, content: `{{firstName}},

Imagine It's December 2026.

<strong>Future A:</strong> Nothing has changed.
<strong>Future B:</strong> You're certified. You have clients. You work on YOUR schedule.

Both futures take the same amount of time.

Sarah` },
    {
        order: 13, subject: "Re: your questions (answered)", delayDays: 25, delayHours: 0, content: `{{firstName}},

"What if I'm not smart enough?" - If you can follow a recipe, you can do this.
"What if I fail?" - You can retake any assessment. Zero risk.
"Is there a guarantee?" - Yes. 30 days, no questions asked.

Sarah` },
    {
        order: 14, subject: "Re: enrollment closing Friday", delayDays: 27, delayHours: 0, content: `{{firstName}},

<strong>This enrollment period closes Friday at midnight.</strong>

If you're on the fence, reply RIGHT NOW.

Sarah` },
    {
        order: 15, subject: "Re: 48 hours left", delayDays: 28, delayHours: 0, content: `{{firstName}},

48 hours.

Payment plans available. $179/month.
30-day guarantee. Zero risk.

Make the decision.

Sarah` },
    {
        order: 16, subject: "Re: final call", delayDays: 29, delayHours: 0, content: `{{firstName}},

This is my last email.

<strong>Tonight at midnight, enrollment closes.</strong>

A year from now, you'll be a year older either way.

The only question is whether you'll be in the same place... or somewhere completely different.

I hope I see you inside.

Sarah` },
];

async function fixEmailMarketing() {
    console.log("🔧 FIXING EMAIL MARKETING INFRASTRUCTURE\n");

    // Step 1: Check or create the sequence
    console.log("1️⃣  Checking for existing sequence...");

    let sequence = await prisma.sequence.findFirst({
        where: {
            OR: [
                { name: { contains: "Mini Diploma" } },
                { name: { contains: "Nurture" } },
                { name: { contains: "Certification" } }
            ]
        }
    });

    if (!sequence) {
        console.log("   Creating new nurture sequence...");

        // Find or create trigger tag (MarketingTag, not Tag!)
        let triggerTag = await prisma.marketingTag.findFirst({
            where: { slug: "mini-diploma-started" }
        });

        if (!triggerTag) {
            triggerTag = await prisma.marketingTag.create({
                data: {
                    name: "Mini diploma started",
                    slug: "mini-diploma-started",
                    category: "STAGE",
                }
            });
            console.log("   ✅ Created trigger tag");
        }

        sequence = await prisma.sequence.create({
            data: {
                name: "Mini Diploma → Certification (30-Day Nurture)",
                slug: "mini-diploma-nurture",
                description: "High-CRO 30-day nurture sequence (Day 0-29). Welcome email sent separately via transactional template on enrollment.",
                triggerType: "TAG_ADDED",
                triggerTagId: triggerTag.id,
                isActive: true,
            }
        });
        console.log("   ✅ Created sequence:", sequence.name);
    } else {
        console.log("   ✅ Found existing sequence:", sequence.name);

        // Make sure it's active
        await prisma.sequence.update({
            where: { id: sequence.id },
            data: { isActive: true }
        });
    }

    // Step 2: Add emails
    console.log("\n2️⃣  Setting up sequence emails...");

    const existingEmails = await prisma.sequenceEmail.count({
        where: { sequenceId: sequence.id }
    });

    if (existingEmails > 0) {
        console.log(`   Deleting ${existingEmails} existing emails...`);
        await prisma.sequenceEmail.deleteMany({ where: { sequenceId: sequence.id } });
    }

    for (const email of NURTURE_EMAILS) {
        await prisma.sequenceEmail.create({
            data: {
                sequenceId: sequence.id,
                order: email.order,
                customSubject: email.subject,
                customContent: email.content,
                delayDays: email.delayDays,
                delayHours: email.delayHours,
                isActive: true,
            }
        });
    }
    console.log(`   ✅ Created ${NURTURE_EMAILS.length} emails`);

    // Step 3: Enroll all mini diploma users
    console.log("\n3️⃣  Enrolling mini diploma users...");

    const miniDiplomaUsers = await prisma.user.findMany({
        where: {
            miniDiplomaOptinAt: { not: null },
            isFakeProfile: false,
        },
        select: {
            id: true,
            email: true,
            firstName: true,
            miniDiplomaOptinAt: true,
        }
    });

    console.log(`   Found ${miniDiplomaUsers.length} mini diploma users`);

    // Delete existing enrollments for this sequence
    await prisma.sequenceEnrollment.deleteMany({
        where: { sequenceId: sequence.id }
    });

    const now = new Date();
    let enrolled = 0;

    for (const user of miniDiplomaUsers) {
        // Calculate which email they should be at based on optin date
        const daysSinceOptin = Math.floor(
            (now.getTime() - user.miniDiplomaOptinAt!.getTime()) / (1000 * 60 * 60 * 24)
        );

        // Find current email index based on days since optin
        let currentIndex = 0;
        for (let i = 0; i < NURTURE_EMAILS.length; i++) {
            if (daysSinceOptin >= NURTURE_EMAILS[i].delayDays) {
                currentIndex = i;
            }
        }

        // Set next send to 5 minutes from now for immediate processing
        const nextSendAt = new Date(now.getTime() + 5 * 60 * 1000);

        await prisma.sequenceEnrollment.create({
            data: {
                userId: user.id,
                sequenceId: sequence.id,
                status: "ACTIVE",
                currentEmailIndex: currentIndex,
                enrolledAt: user.miniDiplomaOptinAt!,
                nextSendAt: nextSendAt,
                emailsReceived: 0, // Reset so they get their next email
            }
        });
        enrolled++;
    }

    console.log(`   ✅ Enrolled ${enrolled} users`);

    // Step 4: Sequence updated (no totalEmails/totalEnrolled fields in model)
    console.log(`   Updated sequence with ${enrolled} users enrolled`);

    // Step 5: Verify
    console.log("\n4️⃣  Verification...");

    const emailCount = await prisma.sequenceEmail.count({ where: { sequenceId: sequence.id } });
    const enrollmentCount = await prisma.sequenceEnrollment.count({ where: { sequenceId: sequence.id } });
    const readyToSend = await prisma.sequenceEnrollment.count({
        where: {
            sequenceId: sequence.id,
            status: "ACTIVE",
            nextSendAt: { lte: new Date(now.getTime() + 10 * 60 * 1000) }
        }
    });

    console.log(`   Sequence emails: ${emailCount}`);
    console.log(`   Total enrollments: ${enrollmentCount}`);
    console.log(`   Ready to send (next 10 min): ${readyToSend}`);

    console.log("\n🎉 EMAIL MARKETING FIXED!");
    console.log("\nNext step: Trigger the cron job manually to send emails:");
    console.log("  POST /api/cron/send-sequence-emails");

    await prisma.$disconnect();
}

fixEmailMarketing().catch(console.error);
