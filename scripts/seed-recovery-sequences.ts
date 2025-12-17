import prisma from "../src/lib/prisma";

/**
 * Seed 3 Recovery Email Sequences (9 emails total)
 *
 * 1. Never Logged In (1A, 1B, 1C) - Days 1, 3, 7
 * 2. Never Started Learning (2A, 2B, 2C) - Days 2, 5, 10
 * 3. Abandoned Learning (3A, 3B, 3C) - Days 7, 14, 21
 */

async function main() {
  console.log("🔄 Seeding Recovery Email Sequences...\n");

  // ============================================
  // SEQUENCE 1: NEVER LOGGED IN
  // ============================================
  const neverLoggedInSequence = await prisma.sequence.upsert({
    where: { slug: "recovery-never-logged-in" },
    update: {
      name: "Recovery: Never Logged In",
      description: "Win-back sequence for users who signed up but never logged in",
      triggerType: "MANUAL", // Triggered by cron job
      isActive: true,
      priority: 90,
    },
    create: {
      name: "Recovery: Never Logged In",
      slug: "recovery-never-logged-in",
      description: "Win-back sequence for users who signed up but never logged in",
      triggerType: "MANUAL",
      isActive: true,
      isSystem: true,
      priority: 90,
    },
  });

  console.log(`✅ Created sequence: ${neverLoggedInSequence.name}`);

  // Delete existing emails for this sequence
  await prisma.sequenceEmail.deleteMany({
    where: { sequenceId: neverLoggedInSequence.id },
  });

  // Recovery 1A - Day 1
  await prisma.sequenceEmail.create({
    data: {
      sequenceId: neverLoggedInSequence.id,
      order: 0,
      delayDays: 0, // First email sends immediately when enrolled
      delayHours: 0,
      customSubject: "Re: did you see this? (your access)",
      customContent: `{{firstName}}, I noticed you created your account but haven't logged in yet.

Just wanted to make sure everything's working on your end!

**Your free Mini Diploma access is ready and waiting** — it only takes 5 minutes to start your first lesson.

Here's your direct link:
{{LOGIN_URL}}

If you're having any trouble logging in, just reply to this email and I'll personally help you out.

Looking forward to seeing you inside!

Warm regards,
Dr. Elena Rodriguez
Founder, AccrediPro Academy

P.S. — The first lesson is my favorite. It's called "What Is Functional Medicine?" and it's going to completely change how you think about health.`,
      isActive: true,
    },
  });

  // Recovery 1B - Day 3
  await prisma.sequenceEmail.create({
    data: {
      sequenceId: neverLoggedInSequence.id,
      order: 1,
      delayDays: 2, // 2 days after first email (Day 3 total)
      delayHours: 0,
      customSubject: "Re: quick question about your Mini Diploma",
      customContent: `{{firstName}}, quick question...

Is there something holding you back from starting?

I've seen a lot of people sign up excited about functional medicine, but then life gets in the way. I totally get it.

Here's the thing though — **your access is completely free**, and the first lesson literally takes 5 minutes.

You could start right now, while you're reading this email:
{{LOGIN_URL}}

If something else is going on (tech issues, questions about the program, or you're just not sure if this is right for you), I'm here. Just reply.

Talk soon,
Dr. Elena

P.S. — I've had students tell me that ONE lesson changed their entire perspective on their health. That could be you in 5 minutes.`,
      isActive: true,
    },
  });

  // Recovery 1C - Day 7
  await prisma.sequenceEmail.create({
    data: {
      sequenceId: neverLoggedInSequence.id,
      order: 2,
      delayDays: 4, // 4 days after 1B (Day 7 total)
      delayHours: 0,
      customSubject: "Re: last chance to activate your access",
      customContent: `{{firstName}}, this is my last email about your Mini Diploma access.

I don't want to be pushy — I just genuinely believe this program could help you, and I hate seeing it go to waste.

**Your free access is still active**, but I'm going to stop emailing you about it after today.

If you want to give it a try:
{{LOGIN_URL}}

If functional medicine isn't for you right now, that's totally okay too. No hard feelings.

Either way, I wish you the best on your health journey.

With gratitude,
Dr. Elena Rodriguez

P.S. — If you ever change your mind, your account will still be there. I'll just be here, quietly cheering you on from the sidelines.`,
      isActive: true,
    },
  });

  console.log(`   📧 Added 3 emails to Never Logged In sequence`);

  // ============================================
  // SEQUENCE 2: NEVER STARTED LEARNING
  // ============================================
  const neverStartedSequence = await prisma.sequence.upsert({
    where: { slug: "recovery-never-started" },
    update: {
      name: "Recovery: Never Started Learning",
      description: "Win-back sequence for users who logged in but never started a lesson",
      triggerType: "MANUAL",
      isActive: true,
      priority: 85,
    },
    create: {
      name: "Recovery: Never Started Learning",
      slug: "recovery-never-started",
      description: "Win-back sequence for users who logged in but never started a lesson",
      triggerType: "MANUAL",
      isActive: true,
      isSystem: true,
      priority: 85,
    },
  });

  console.log(`✅ Created sequence: ${neverStartedSequence.name}`);

  await prisma.sequenceEmail.deleteMany({
    where: { sequenceId: neverStartedSequence.id },
  });

  // Recovery 2A - Day 2
  await prisma.sequenceEmail.create({
    data: {
      sequenceId: neverStartedSequence.id,
      order: 0,
      delayDays: 0,
      delayHours: 0,
      customSubject: "Re: the first lesson takes 5 minutes",
      customContent: `{{firstName}}, I saw you logged in — awesome!

But you haven't started your first lesson yet, and I wanted to share something with you...

**The first lesson is only 5 minutes long.**

It's called "What Is Functional Medicine?" and it lays the foundation for everything else. Students tell me it's the moment they go "ohhhh, THIS is what I've been missing."

Here's the thing: you don't need to commit to anything. Just watch that first 5-minute lesson and see how you feel.

Start here:
{{MINI_DIPLOMA_URL}}

If you finish it and think "eh, not for me" — no worries at all. But I have a feeling you're going to want to keep going.

Let me know how it goes!

Dr. Elena`,
      isActive: true,
    },
  });

  // Recovery 2B - Day 5
  await prisma.sequenceEmail.create({
    data: {
      sequenceId: neverStartedSequence.id,
      order: 1,
      delayDays: 3, // 3 days after 2A (Day 5 total)
      delayHours: 0,
      customSubject: "Re: most people start here...",
      customContent: `{{firstName}}, want to know what most of our successful students have in common?

**They all started with Module 1, Lesson 1.** (Revolutionary, I know 😄)

But seriously — I've noticed you logged in but haven't started yet. And I get it. Sometimes the hardest part is just pressing "play" on that first video.

So here's what I want you to do:

1. Click this link: {{MINI_DIPLOMA_URL}}
2. Watch the first 5-minute lesson
3. That's it. You're done for today.

No pressure to do more. No homework. Just give me 5 minutes.

Deal?

Dr. Elena

P.S. — If something specific is holding you back (questions, confusion, overwhelm), just reply. I read every email.`,
      isActive: true,
    },
  });

  // Recovery 2C - Day 10
  await prisma.sequenceEmail.create({
    data: {
      sequenceId: neverStartedSequence.id,
      order: 2,
      delayDays: 5, // 5 days after 2B (Day 10 total)
      delayHours: 0,
      customSubject: "Re: still interested in functional medicine?",
      customContent: `{{firstName}}, I want to be respectful of your inbox, so I'll keep this short.

You signed up for the free Mini Diploma because something about functional medicine caught your attention.

**That spark of interest? It's still there.**

Maybe life got busy. Maybe you weren't sure where to start. Maybe you're wondering if this is really worth your time.

I'll just say this: the students who've completed this Mini Diploma tell me it changed how they see health forever. And it only takes a few hours total.

If you want to give it a real try, your lessons are waiting:
{{MINI_DIPLOMA_URL}}

If now isn't the right time, that's okay too. Your account will be here whenever you're ready.

Wishing you well,
Dr. Elena Rodriguez`,
      isActive: true,
    },
  });

  console.log(`   📧 Added 3 emails to Never Started sequence`);

  // ============================================
  // SEQUENCE 3: ABANDONED LEARNING
  // ============================================
  const abandonedSequence = await prisma.sequence.upsert({
    where: { slug: "recovery-abandoned-learning" },
    update: {
      name: "Recovery: Abandoned Learning",
      description: "Win-back sequence for users who started but stopped",
      triggerType: "MANUAL",
      isActive: true,
      priority: 80,
    },
    create: {
      name: "Recovery: Abandoned Learning",
      slug: "recovery-abandoned-learning",
      description: "Win-back sequence for users who started but stopped",
      triggerType: "MANUAL",
      isActive: true,
      isSystem: true,
      priority: 80,
    },
  });

  console.log(`✅ Created sequence: ${abandonedSequence.name}`);

  await prisma.sequenceEmail.deleteMany({
    where: { sequenceId: abandonedSequence.id },
  });

  // Recovery 3A - Day 7
  await prisma.sequenceEmail.create({
    data: {
      sequenceId: abandonedSequence.id,
      order: 0,
      delayDays: 0,
      delayHours: 0,
      customSubject: "Re: noticed you haven't been back",
      customContent: `Hey {{firstName}},

I noticed you started the Mini Diploma but haven't been back in a while.

No judgment here — life happens! But I wanted to check in because you were making progress, and I'd hate for that momentum to go to waste.

**Remember why you started?**

Maybe it was curiosity about functional medicine. Maybe you want to help yourself, your family, or even build a career in health coaching.

Whatever it was, that reason is still valid.

Here's where you left off:
{{MINI_DIPLOMA_URL}}

You can pick up right where you stopped. Your progress is saved.

Rooting for you,
Dr. Elena

P.S. — Even 10 minutes today is progress. You've got this.`,
      isActive: true,
    },
  });

  // Recovery 3B - Day 14
  await prisma.sequenceEmail.create({
    data: {
      sequenceId: abandonedSequence.id,
      order: 1,
      delayDays: 7, // 7 days after 3A (Day 14 total)
      delayHours: 0,
      customSubject: "Re: where did you leave off?",
      customContent: `{{firstName}}, quick question...

What happened? You were doing so well with the Mini Diploma!

I've been teaching functional medicine for years, and I've seen this pattern before. Someone gets excited, starts strong, then... something comes up.

**It's not about falling off track. It's about getting back on.**

Here's the truth: you don't need to finish the whole thing in one sitting. You don't even need to do it perfectly.

You just need to take the next step. One lesson. That's it.

Ready to jump back in?
{{MINI_DIPLOMA_URL}}

If something else is going on (confusion about the material, tech issues, or you're questioning whether this is right for you), just reply. I'm here to help.

Talk soon,
Dr. Elena`,
      isActive: true,
    },
  });

  // Recovery 3C - Day 21
  await prisma.sequenceEmail.create({
    data: {
      sequenceId: abandonedSequence.id,
      order: 2,
      delayDays: 7, // 7 days after 3B (Day 21 total)
      delayHours: 0,
      customSubject: "Re: your Mini Diploma is waiting",
      customContent: `{{firstName}}, this will be my last email about the Mini Diploma for a while.

I know I've been reaching out, and I don't want to be annoying. I just genuinely believe in what we're building here — and I saw you were interested.

**Your progress is still saved.** Your account is still active. The lessons are still there whenever you're ready.

If you want to finish what you started:
{{MINI_DIPLOMA_URL}}

If now isn't the right time, I completely understand. Health journeys aren't linear, and neither is learning.

I'll be here when you're ready.

With warmth,
Dr. Elena Rodriguez
Founder, AccrediPro Academy

P.S. — One day, you might wake up and decide "today's the day." And when that happens, I'll be here cheering you on.`,
      isActive: true,
    },
  });

  console.log(`   📧 Added 3 emails to Abandoned Learning sequence`);

  console.log("\n✅ All recovery sequences seeded successfully!");
  console.log(`
Summary:
- Recovery: Never Logged In (3 emails - Days 1, 3, 7)
- Recovery: Never Started Learning (3 emails - Days 2, 5, 10)
- Recovery: Abandoned Learning (3 emails - Days 7, 14, 21)

Total: 9 recovery emails ready to send
`);
}

main()
  .catch((e) => {
    console.error("Error seeding recovery sequences:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
