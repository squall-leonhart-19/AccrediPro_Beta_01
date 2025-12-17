import prisma from "../src/lib/prisma";

// Use <strong> tags (same format as inbox-test route for perfect HTML rendering)
const NURTURE_EMAILS = [
  {
    day: 0,
    subject: "Re: your free Mini Diploma access",
    content: `{{firstName}},

You're in.

I just saw your name come through, and I wanted to personally welcome you.

<strong>Your Free Mini Diploma in Functional Medicine is ready</strong> - you can start right now if you want.

But before you dive in, I need to tell you something important:

<strong>This isn't like other freebies.</strong>

You know those PDFs that sit in your downloads folder collecting digital dust? Those "free courses" that are really just 45-minute sales pitches?

This isn't that.

This is <strong>real training</strong>. The same foundational content our certified practitioners learned. By the end, you'll understand root-cause thinking in a way that changes how you see health forever.

You'll also earn an actual credential - a Mini Diploma you can be proud of.

<strong>Here's what I want you to do:</strong>

Log into the platform and start Lesson 1. It takes about 20 minutes. By the end, you'll know if this path is right for you.

I'll be checking in over the next few days to see how you're doing. And {{firstName}} - if you have ANY questions, just hit reply. I read and respond to every single email.

This is the beginning of something big.

Sarah

P.S. Check your messages inside the platform - I've left you a personal voice note. I want you to hear my voice before we really get started.`
  },
  {
    day: 1,
    subject: "Re: my story (thought you'd relate)",
    content: `{{firstName}},

Can I tell you something I don't share with everyone?

<strong>The Kitchen Floor Moment</strong>

It was 11pm on a Tuesday. My daughter was finally asleep. I was sitting on my kitchen floor, bills spread around me, calculator in hand.

The numbers didn't add up. Again.

I'd just worked a 12-hour day at a job that was slowly killing me. Gave the same generic advice I'd given a hundred times: "Eat more vegetables. Drink more water. Try to reduce stress."

I knew it wasn't helping anyone. And I couldn't even take my own advice - I was exhausted, inflamed, running on coffee and anxiety.

<strong>I looked at my reflection in the microwave door and didn't recognize myself.</strong>

When did I become this tired, defeated person? When did "helping people" start feeling like a lie I told myself to get through the day?

Have you ever felt that way, {{firstName}}? That gap between who you are and who you wanted to become?

<strong>The Moment Everything Changed</strong>

That night, I couldn't sleep. I started researching at 2am. Functional medicine. Root-cause health. A different approach.

And something clicked.

For the first time, I understood WHY I felt so stuck. Why my clients weren't getting better. Why the advice I'd been giving was like putting band-aids on broken legs.

<strong>It wasn't that I was bad at my job. I just didn't have the right tools.</strong>

Fast forward three years: I work from home. I set my own hours. I help people who've been dismissed by every doctor they've seen. And my daughter? She tells her friends her mom "helps people feel better."

That's worth everything.

<strong>I'm telling you this because...</strong>

If you're where I was - tired, stuck, wondering if there's more - I need you to know: there is.

The Mini Diploma you're taking right now? It's the first step on the same path I walked.

So tell me, {{firstName}} - what made you curious about functional medicine? What's YOUR kitchen floor moment?

Hit reply. I want to hear your story.

Sarah

P.S. I still have that microwave. Every time I see my reflection in it now, I smile. Crazy how much can change.`
  },
];

async function main() {
  console.log("Creating Mini Diploma → Certification (30-Day Nurture) sequence...\n");

  // Delete existing sequence if exists (for clean re-run)
  const existing = await prisma.sequence.findFirst({
    where: {
      OR: [
        { slug: "mini-diploma-to-certification-30d" },
        { slug: "nurture-30-day" },
        { name: { contains: "30-Day Nurture", mode: "insensitive" } },
      ]
    }
  });

  if (existing) {
    console.log("Deleting existing sequence:", existing.name);
    // Delete emails first
    await prisma.sequenceEmail.deleteMany({ where: { sequenceId: existing.id } });
    await prisma.sequence.delete({ where: { id: existing.id } });
    console.log("Deleted.\n");
  }

  // Find the trigger tag (Mini Diploma Freebie)
  const triggerTag = await prisma.marketingTag.findFirst({
    where: {
      OR: [
        { slug: "source_mini_diploma_freebie" },
        { name: { contains: "Mini Diploma", mode: "insensitive" } },
      ]
    }
  });

  // Create the sequence
  const sequence = await prisma.sequence.create({
    data: {
      name: "Mini Diploma → Certification (30-Day Nurture)",
      slug: "mini-diploma-to-certification-30d",
      description: "High-CRO 30-day nurture sequence (Day 0-29). Uses branded email template with burgundy header.",
      triggerType: "MINI_DIPLOMA_STARTED",
      triggerTagId: triggerTag?.id,
      isActive: true,
      exitOnReply: false,
      exitOnClick: false,
    }
  });

  console.log("✅ Created sequence:", sequence.name);
  console.log("   ID:", sequence.id);
  console.log("   Trigger Type:", sequence.triggerType);
  console.log("");

  // Create the emails (first 2 only for testing)
  console.log("Creating email steps (first 2 emails for testing)...\n");

  for (let i = 0; i < NURTURE_EMAILS.length; i++) {
    const email = NURTURE_EMAILS[i];

    await prisma.sequenceEmail.create({
      data: {
        sequenceId: sequence.id,
        order: i,
        customSubject: email.subject,
        customContent: email.content,
        delayDays: email.day,
        delayHours: 0, // Send immediately based on day
        sendAtHour: 9, // 9 AM
        isActive: true,
      }
    });

    console.log(`  ✓ Email ${i + 1}: Day ${email.day} - ${email.subject}`);
  }

  console.log("\n✅ Done! Created sequence with", NURTURE_EMAILS.length, "emails");
  console.log("\nThe emails will use the same branded template as the welcome email (burgundy header, gold text).");
  console.log("Now test by enrolling a user from /admin/marketing");
}

main().catch(console.error).finally(() => prisma.$disconnect());
