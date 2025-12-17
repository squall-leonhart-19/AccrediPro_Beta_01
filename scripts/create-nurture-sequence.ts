import prisma from "../src/lib/prisma";

// First 2 emails with full HTML templates
const NURTURE_EMAILS = [
  {
    day: 0,
    subject: "Re: your free Mini Diploma access",
    content: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: #D4AF37; margin: 0; font-size: 28px; font-family: Georgia, serif;">AccrediPro Academy</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0 0; font-size: 14px;">Functional Medicine Excellence</p>
        </div>
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">{{firstName}},</p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">You're in.</p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">I just saw your name come through, and I wanted to personally welcome you.</p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;"><strong>Your Free Mini Diploma in Functional Medicine is ready</strong> - you can start right now if you want.</p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">But before you dive in, I need to tell you something important:</p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;"><strong>This isn't like other freebies.</strong></p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">You know those PDFs that sit in your downloads folder collecting digital dust? Those "free courses" that are really just 45-minute sales pitches?</p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">This isn't that.</p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">This is <strong>real training</strong>. The same foundational content our certified practitioners learned. By the end, you'll understand root-cause thinking in a way that changes how you see health forever.</p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">You'll also earn an actual credential - a Mini Diploma you can be proud of.</p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;"><strong>Here's what I want you to do:</strong></p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">Log into the platform and start Lesson 1. It takes about 20 minutes. By the end, you'll know if this path is right for you.</p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">I'll be checking in over the next few days to see how you're doing. And {{firstName}} - if you have ANY questions, just hit reply. I read and respond to every single email.</p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">This is the beginning of something big.</p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">Sarah</p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">P.S. Check your messages inside the platform - I've left you a personal voice note. I want you to hear my voice before we really get started.</p>
        </div>
        <!-- Footer -->
        <div style="background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eee;">
          <p style="margin: 0 0 5px 0; color: #722F37; font-size: 13px; font-weight: bold;">AccrediPro LLC</p>
          <p style="margin: 0; color: #999; font-size: 11px;">1270 Ave of the Americas, 7th Fl -1182, New York, NY 10020</p>
        </div>
      </div>
    </div>
  </body>
</html>`
  },
  {
    day: 1,
    subject: "Re: my story (thought you'd relate)",
    content: `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
  </head>
  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f5f5f5;">
    <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); padding: 40px 30px; text-align: center;">
          <h1 style="color: #D4AF37; margin: 0; font-size: 28px; font-family: Georgia, serif;">AccrediPro Academy</h1>
          <p style="color: rgba(255,255,255,0.8); margin: 5px 0 0 0; font-size: 14px;">Functional Medicine Excellence</p>
        </div>
        <!-- Content -->
        <div style="padding: 40px 30px;">
          <p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">{{firstName}},</p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">Can I tell you something I don't share with everyone?</p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;"><strong>The Kitchen Floor Moment</strong></p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">It was 11pm on a Tuesday. My daughter was finally asleep. I was sitting on my kitchen floor, bills spread around me, calculator in hand.</p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">The numbers didn't add up. Again.</p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">I'd just worked a 12-hour day at a job that was slowly killing me. Gave the same generic advice I'd given a hundred times: "Eat more vegetables. Drink more water. Try to reduce stress."</p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">I knew it wasn't helping anyone. And I couldn't even take my own advice - I was exhausted, inflamed, running on coffee and anxiety.</p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;"><strong>I looked at my reflection in the microwave door and didn't recognize myself.</strong></p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">When did I become this tired, defeated person? When did "helping people" start feeling like a lie I told myself to get through the day?</p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">Have you ever felt that way, {{firstName}}? That gap between who you are and who you wanted to become?</p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;"><strong>The Moment Everything Changed</strong></p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">That night, I couldn't sleep. I started researching at 2am. Functional medicine. Root-cause health. A different approach.</p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">And something clicked.</p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">For the first time, I understood WHY I felt so stuck. Why my clients weren't getting better. Why the advice I'd been giving was like putting band-aids on broken legs.</p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;"><strong>It wasn't that I was bad at my job. I just didn't have the right tools.</strong></p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">Fast forward three years: I work from home. I set my own hours. I help people who've been dismissed by every doctor they've seen. And my daughter? She tells her friends her mom "helps people feel better."</p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">That's worth everything.</p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;"><strong>I'm telling you this because...</strong></p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">If you're where I was - tired, stuck, wondering if there's more - I need you to know: there is.</p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">The Mini Diploma you're taking right now? It's the first step on the same path I walked.</p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">So tell me, {{firstName}} - what made you curious about functional medicine? What's YOUR kitchen floor moment?</p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">Hit reply. I want to hear your story.</p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">Sarah</p><p style="color: #555; font-size: 16px; margin: 0 0 16px 0;">P.S. I still have that microwave. Every time I see my reflection in it now, I smile. Crazy how much can change.</p>
        </div>
        <!-- Footer -->
        <div style="background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #eee;">
          <p style="margin: 0 0 5px 0; color: #722F37; font-size: 13px; font-weight: bold;">AccrediPro LLC</p>
          <p style="margin: 0; color: #999; font-size: 11px;">1270 Ave of the Americas, 7th Fl -1182, New York, NY 10020</p>
        </div>
      </div>
    </div>
  </body>
</html>`
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
      description: "High-CRO 30-day nurture sequence (Day 0-29). Welcome email sent separately via transactional template on enrollment.",
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
  console.log("\nNow test by enrolling a user from /admin/marketing");
}

main().catch(console.error).finally(() => prisma.$disconnect());
