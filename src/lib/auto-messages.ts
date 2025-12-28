import prisma from "./prisma";
import { generateSarahVoice } from "./elevenlabs";
import { createClient } from "@supabase/supabase-js";

interface TriggerAutoMessageOptions {
  userId: string;
  trigger:
  | "first_login"
  | "enrollment"
  | "course_complete"
  | "module_complete"
  | "mini_diploma_module_complete"
  | "inactive_7d"
  | "mini_diploma_complete"
  | "training_video_complete"
  | "pricing_page_visit"
  | "sequence_day_5"
  | "sequence_day_10"
  | "sequence_day_20"
  | "sequence_day_27"
  | "sequence_day_30";
  triggerValue?: string; // e.g., course ID or module number
}

/**
 * Generate Sarah's voice using ElevenLabs and upload to Supabase storage
 */
async function generateAndUploadVoice(
  text: string,
  filename: string
): Promise<{ url: string; duration: number } | null> {
  try {
    console.log(`[VOICE] Generating voice for: ${filename}`);

    // Generate voice using ElevenLabs
    const voiceResult = await generateSarahVoice(text);

    if (!voiceResult.success || !voiceResult.audioBase64) {
      console.error(`[VOICE] Failed to generate voice: ${voiceResult.error}`);
      return null;
    }

    // Upload to Supabase storage
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.error("[VOICE] Supabase not configured");
      return null;
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const bucket = "chat-attachments";
    const filePath = `system/voice/${filename}-${Date.now()}.mp3`;

    // Convert base64 to buffer
    const buffer = Buffer.from(voiceResult.audioBase64, "base64");

    // Upload to Supabase
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, buffer, {
        contentType: "audio/mpeg",
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      // Try creating bucket if it doesn't exist
      if (error.message?.includes("not found") || error.message?.includes("does not exist")) {
        await supabase.storage.createBucket(bucket, { public: true });
        const { error: retryError } = await supabase.storage
          .from(bucket)
          .upload(filePath, buffer, {
            contentType: "audio/mpeg",
            cacheControl: "3600",
            upsert: false,
          });
        if (retryError) {
          console.error(`[VOICE] Upload failed after retry: ${retryError.message}`);
          return null;
        }
      } else {
        console.error(`[VOICE] Upload failed: ${error.message}`);
        return null;
      }
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath);

    console.log(`[VOICE] Voice uploaded successfully: ${urlData.publicUrl}`);

    return {
      url: urlData.publicUrl,
      duration: voiceResult.duration || 30,
    };
  } catch (error) {
    console.error("[VOICE] Error generating/uploading voice:", error);
    return null;
  }
}

// DM content for each trigger - with voice scripts for ElevenLabs generation
const DM_CONTENT = {
  sequence_day_5: {
    text: `Hey {{firstName}}!

Just checking in - how's your Mini Diploma going?

I noticed you might not have watched the Graduate Training yet. It's a 45-minute session where I show you exactly what's possible with functional medicine.

No pressure at all, but I think you'd find it really valuable. Let me know if you have any questions!

- Sarah`,
    voiceScript: `Hey {{firstName}}! Just checking in, how's your Mini Diploma going?
I noticed you might not have watched the Graduate Training yet. It's a 45-minute session where I show you exactly what's possible with functional medicine.
No pressure at all, but I think you'd find it really valuable. Let me know if you have any questions!`,
    hasVoice: true,
  },
  sequence_day_10: {
    text: `{{firstName}}!

I see you've been making progress - that's amazing!

I wanted to share something with you: The certification program is what really transformed my life. It's where everything clicked.

When you're ready to take the next step, I'm here. Just message me and we can talk about what that looks like for you.

Cheering you on!
- Sarah`,
    voiceScript: null,
    hasVoice: false,
  },
  sequence_day_20: {
    text: `{{firstName}}, can we have a real talk?

I know $997 is a real investment. And if you're wondering if it's worth it, or if you can make it work... I want you to know I've been there.

I left you a voice message explaining my own journey with this. Give it a listen when you have a moment.

And if cost is the barrier, we do have payment plans. Let's figure this out together.

- Sarah`,
    voiceScript: `{{firstName}}, can we have a real talk?
I know 997 dollars is a real investment. And if you're wondering if it's worth it, or if you can make it work, I want you to know I've been there.
When I started, I didn't have the money either. But I made it work because I believed in myself. And you know what? It was the best decision I ever made.
If cost is the barrier, we do have payment plans. Let's figure this out together.`,
    hasVoice: true,
  },
  sequence_day_27: {
    text: `{{firstName}}, heads up...

Enrollment is closing in just a few days. I didn't want you to miss it without at least checking in.

Is there anything holding you back? Any questions I can answer?

I left you a voice note too. I really believe this could change everything for you.

- Sarah`,
    voiceScript: `{{firstName}}, heads up! Enrollment is closing in just a few days. I didn't want you to miss it without at least checking in.
Is there anything holding you back? Any questions I can answer?
I really believe this could change everything for you. Message me back if you want to chat.`,
    hasVoice: true,
  },
  sequence_day_30: {
    text: `{{firstName}}, this is it. The door closes tonight.

I'm not going to pressure you. You already know if this is right for you.

I just wanted to say: I believe in you. Whatever you decide.

Listen to my final voice message when you get a chance.

- Sarah`,
    voiceScript: `{{firstName}}, this is it. The door closes tonight.
I'm not going to pressure you. You already know if this is right for you.
I just wanted to say: I believe in you. Whatever you decide.
If you're ready to take the leap, I'll be here waiting for you on the other side.`,
    hasVoice: true,
  },
  mini_diploma_complete: {
    text: `{{firstName}}!! You did it!

You finished your Mini Diploma and I am SO proud of you!

Seriously - do you know how many people download something and never even open it? But YOU showed up. You did the work.

I left you a voice message to celebrate. Give it a listen!

When you're ready to talk about the full certification, I'm here.

- Sarah`,
    voiceScript: `Oh my gosh, {{firstName}}! You did it! You finished your Mini Diploma!

I am SO proud of you right now. Seriously. Do you know how many people download a freebie and never even open it? But you, you showed up. You did the work. You completed it.

That tells me something about you. You're not just curious... you're committed.

So here's what I want you to think about:

What you just learned? That's just a tiny taste of what's possible. The full certification goes SO much deeper, into the protocols, the client work, the real transformation you can create for people.

I've seen students just like you go from where you are now... to helping real clients... to building income that gives them freedom.

And I really believe that could be you too.

Take some time to celebrate what you just accomplished. Then, when you're ready, come check out the full certification program. I'll be here waiting to welcome you in.

You've got this. Talk soon!`,
    hasVoice: true,
  },
  pricing_page_visit: {
    text: `Hey {{firstName}}!

I noticed you were checking out the certification program - exciting!

Any questions I can help answer? I'm here if you want to chat about pricing, what's included, or anything else.

No pressure at all. Just here to help!

- Sarah`,
    voiceScript: null,
    hasVoice: false,
  },
  training_video_complete: {
    text: `{{firstName}}! 🎬

I just saw you finished watching the Graduate Training - that's AMAZING!

I put so much into that training because I wanted you to really SEE what's possible with functional medicine. The real transformations. The actual client results.

So now that you've seen it... what do you think? Can you picture yourself doing this?

I left you a voice message with some thoughts. Listen when you can!

If you have ANY questions about the certification, the investment, or whether this is right for you - just reply here. I'm always happy to chat.

- Sarah 💛`,
    voiceScript: `{{firstName}}! I just saw you finished watching the Graduate Training, and I had to send you a quick message.

That training... I put my heart into it. Because I wanted you to really see what's possible. Not just theory, but real transformations. Real client results. Real lives being changed.

So now that you've seen it... I have to ask... can you picture yourself doing this? Can you see yourself helping people the way I showed you?

If there's even a small part of you that's thinking yes... I want you to know that the full certification is where it all comes together. It's where you go from knowing about functional medicine... to actually being able to help people.

Message me back if you want to talk about it. I'm here for you.`,
    hasVoice: true,
  },
};

// Mini Diploma Module completion messages - DM from Coach Sarah for each module (0-3)
// Module 4 is Final Exam - handled by mini_diploma_complete trigger
const MINI_DIPLOMA_MODULE_MESSAGES: Record<number, { text: string; voiceScript: string | null; hasVoice: boolean }> = {
  0: {
    text: `{{firstName}}! 🎉

You just completed the Welcome Module of your Mini Diploma!

I'm SO excited you're here and taking this first step. You now know what functional medicine is all about and why it's so different from conventional approaches.

This is just the beginning! The next modules are going to blow your mind.

I left you a quick voice note - give it a listen!

- Sarah 💜`,
    voiceScript: `{{firstName}}! You just completed the Welcome Module of your Mini Diploma!

I'm SO excited you're here. You've taken that first important step, and now you understand what functional medicine is all about.

This is just the beginning! The next modules are going to teach you so much more. I can't wait for you to dive deeper.

Keep going, you're doing amazing!`,
    hasVoice: true,
  },
  1: {
    text: `{{firstName}}! 🎉

You just completed Module 1 of your Mini Diploma - that's such a great start!

You're now understanding the foundations of Functional Medicine, and trust me, this knowledge is going to serve you SO well.

I left you a quick voice note to celebrate! Keep going, you're doing amazing!

- Sarah ✨`,
    voiceScript: `{{firstName}}! You just completed Module 1 of your Mini Diploma!

I'm so proud of you for taking action. You're now understanding the foundations of functional medicine, and this is exactly where the magic starts.

Keep that momentum going! You've got three more modules to go, and I know you're going to crush them.

Talk soon!`,
    hasVoice: true,
  },
  2: {
    text: `{{firstName}}!! 💪

Module 2 DONE! You're officially halfway through your Mini Diploma!

I have to say... most people who download free courses never even open them. But YOU? You're showing up. You're doing the work. That tells me everything I need to know about you.

Listen to my voice message when you get a chance!

- Sarah 🌟`,
    voiceScript: `{{firstName}}! Module 2 complete! You are officially halfway through your Mini Diploma!

Can I tell you something? Most people who download free courses... they never even open them. But you? You're different. You're showing up. You're putting in the work.

That tells me something about you. You're not just curious... you're serious about this.

Two more modules to go. You've got this!`,
    hasVoice: true,
  },
  3: {
    text: `{{firstName}}!!! 🔥

OH WOW - Module 3 is DONE! You're SO close now!

Just the Final Exam left, and then you'll have completed your entire Mini Diploma. Can you believe how far you've come?

I'm genuinely excited for you. This is real progress, real knowledge, real transformation happening.

I left you a voice message - give it a listen!

Almost there! 🎓

- Sarah`,
    voiceScript: `{{firstName}}! Module 3 is done! Oh my gosh, you are SO close now!

Just the Final Exam left, and then... you'll have completed your entire Mini Diploma. Can you believe how far you've come?

I'm genuinely excited for you right now. This is real progress. Real knowledge. Real transformation happening.

Go take that Final Exam. I believe in you. And when you pass... we'll celebrate together.

You've got this!`,
    hasVoice: true,
  },
};

// Module completion messages - personalized DM from Coach Sarah for each module
const MODULE_COMPLETION_MESSAGES: Record<number, { text: string; voiceScript: string | null; hasVoice: boolean }> = {
  0: {
    text: `{{firstName}}!!

You just completed Module 0 - Welcome & Orientation!

I'm SO proud of you for taking this first step. You've officially started your functional medicine journey, and that's huge.

I left you a quick voice message to celebrate. Can't wait to see you crush the next module!

- Sarah 💪`,
    voiceScript: `{{firstName}}! You just completed Module 0, Welcome and Orientation! I'm SO proud of you for taking this first step. You've officially started your functional medicine journey, and that's huge. Keep that momentum going, I know you've got this!`,
    hasVoice: true,
  },
  1: {
    text: `{{firstName}}!

Module 1 DONE! Functional Medicine Foundations - you now understand the core principles that set this approach apart.

You're building such a strong foundation. This knowledge is going to serve your future clients SO well.

I left you a voice note!

- Sarah ✨`,
    voiceScript: `Wow {{firstName}}! You just crushed Module 1, Functional Medicine Foundations! You now understand the core principles that make functional medicine so powerful. This foundation is everything. You're on fire!`,
    hasVoice: true,
  },
  2: {
    text: `{{firstName}}!!!

You finished Module 2 - Health Coaching Mastery!

This is such an important one. The way you communicate with clients can make or break their transformation. And now you have those skills!

Keep going, you're doing amazing!

- Sarah 🌟`,
    voiceScript: `{{firstName}}! Module 2 complete! Health Coaching Mastery. This is such a game-changer. The way you communicate with clients will determine their success, and now you have those skills. You're becoming a real pro!`,
    hasVoice: true,
  },
  3: {
    text: `{{firstName}}, Module 3 is DONE!

Clinical Assessment - you now know how to properly evaluate clients and understand what's really going on in their bodies.

This is where you start seeing people differently. You're not just looking at symptoms anymore... you're seeing the whole picture.

So proud of you!

- Sarah 💜`,
    voiceScript: `{{firstName}}! Module 3, Clinical Assessment, complete! You now know how to properly evaluate clients and see the whole picture. This is where real transformation begins. You're doing incredible!`,
    hasVoice: true,
  },
  4: {
    text: `Amazing work, {{firstName}}!

You've completed Module 4 - Ethics & Scope!

I know ethics might not be the most exciting topic... but it's SO important. Understanding your scope of practice protects you AND your clients.

You're becoming a true professional!

- Sarah 📚`,
    voiceScript: `{{firstName}}, Module 4 done! Ethics and Scope. I know it might not be the most exciting topic, but understanding your scope of practice is crucial. It protects you and your clients. You're becoming a true professional!`,
    hasVoice: true,
  },
  5: {
    text: `YES {{firstName}}!!

Module 5 - Functional Nutrition is COMPLETE!

This is one of my favorite modules. Food is such powerful medicine, and now you understand how to use it to transform lives.

You're halfway through the certification! Keep going!

- Sarah 🥗`,
    voiceScript: `YES {{firstName}}! Module 5, Functional Nutrition, complete! Food is such powerful medicine, and now you understand how to use it. You're halfway through! I'm so proud of how far you've come!`,
    hasVoice: true,
  },
  6: {
    text: `{{firstName}}!!

Gut Health & Microbiome - DONE!

This is where so many health issues begin AND where healing happens. You now understand one of the most foundational aspects of functional medicine.

You're going to help so many people with this knowledge!

- Sarah 🦠`,
    voiceScript: `{{firstName}}! Module 6 complete! Gut Health and Microbiome. This is where so many health issues start and where real healing happens. You're going to help so many people with this knowledge!`,
    hasVoice: true,
  },
  7: {
    text: `Module 7 CRUSHED, {{firstName}}!

Stress, Adrenals & Nervous System - you now understand the stress connection that most practitioners miss.

In today's world, this knowledge is pure gold. Your clients will thank you!

- Sarah 🧘`,
    voiceScript: `Module 7 crushed {{firstName}}! Stress, Adrenals and Nervous System. You now understand the stress connection that most practitioners miss. In today's world, this knowledge is pure gold!`,
    hasVoice: true,
  },
  8: {
    text: `{{firstName}}, you're on FIRE!

Module 8 - Blood Sugar & Insulin complete!

Understanding metabolic health is so crucial. You're equipped to help people break free from the blood sugar rollercoaster.

Keep that momentum going!

- Sarah 🎢`,
    voiceScript: `{{firstName}}, you're on fire! Module 8, Blood Sugar and Insulin, complete! You're now equipped to help people break free from the blood sugar rollercoaster. Amazing progress!`,
    hasVoice: true,
  },
  9: {
    text: `WOW {{firstName}}!!

Module 9 - Women's Hormone Health is DONE!

This module is so close to my heart. Women deserve practitioners who understand their unique hormonal journeys. And now you're one of them!

- Sarah 💗`,
    voiceScript: `Wow {{firstName}}! Module 9, Women's Hormone Health, complete! This is so close to my heart. Women deserve practitioners who truly understand them. And now you're one of them!`,
    hasVoice: true,
  },
  10: {
    text: `{{firstName}}!! Double digits!

Module 10 - Perimenopause & Menopause complete!

You can now help women navigate one of the most challenging transitions of their lives. This is life-changing work.

You're in the home stretch now!

- Sarah 🦋`,
    voiceScript: `{{firstName}}! Double digits! Module 10 complete, Perimenopause and Menopause! You can now help women through one of the most challenging transitions of their lives. You're in the home stretch!`,
    hasVoice: true,
  },
  11: {
    text: `THYROID MASTER, {{firstName}}!

Module 11 - Thyroid Health is complete!

So many people struggle with thyroid issues and don't get proper support. You're now equipped to change that.

Almost there!

- Sarah 🦋`,
    voiceScript: `Thyroid master {{firstName}}! Module 11 complete! So many people struggle with thyroid issues and don't get help. You're now equipped to change that. Almost there!`,
    hasVoice: true,
  },
  12: {
    text: `{{firstName}}!!

Module 12 - Metabolic Health & Weight is DONE!

You now understand why traditional weight loss approaches fail and what actually works. This knowledge is in such high demand!

- Sarah ⚡`,
    voiceScript: `{{firstName}}! Module 12 complete, Metabolic Health and Weight! You now understand why traditional approaches fail and what actually works. This knowledge is in such high demand!`,
    hasVoice: true,
  },
  13: {
    text: `Amazing {{firstName}}!

Module 13 - Autoimmunity & Inflammation complete!

This is cutting-edge functional medicine. You're learning things that most healthcare providers don't even know!

Just a few more to go!

- Sarah 🔥`,
    voiceScript: `Amazing {{firstName}}! Module 13 complete, Autoimmunity and Inflammation! You're learning cutting-edge functional medicine that most healthcare providers don't even know. Just a few more to go!`,
    hasVoice: true,
  },
  14: {
    text: `{{firstName}}, BRAIN HEALTH EXPERT!

Module 14 - Mental Health & Brain Function is DONE!

The gut-brain connection, neurotransmitters, mental wellness... you're equipped to support the whole person now.

So close to the finish line!

- Sarah 🧠`,
    voiceScript: `{{firstName}}, brain health expert! Module 14 complete! The gut-brain connection, mental wellness... you're now equipped to support the whole person. So close to the finish line!`,
    hasVoice: true,
  },
  15: {
    text: `HEART HEALTH HERO {{firstName}}!

Module 15 - Cardiometabolic Health complete!

You can now help people protect and heal their hearts. This is literally life-saving knowledge.

The finish line is in sight!

- Sarah ❤️`,
    voiceScript: `Heart health hero {{firstName}}! Module 15 complete! You can now help people protect and heal their hearts. This is literally life-saving knowledge. The finish line is in sight!`,
    hasVoice: true,
  },
  16: {
    text: `{{firstName}}!!

Module 16 - Energy & Mitochondrial Health is DONE!

Fatigue is one of the biggest complaints people have. You now understand the root causes and how to address them!

Almost certified!

- Sarah ⚡`,
    voiceScript: `{{firstName}}! Module 16 complete, Energy and Mitochondrial Health! Fatigue is such a common complaint and now you understand the root causes. Almost certified!`,
    hasVoice: true,
  },
  17: {
    text: `DETOX SPECIALIST {{firstName}}!

Module 17 - Detox & Environmental Health is complete!

In today's toxic world, this knowledge is essential. You can help people reduce their toxic burden and feel better than ever.

Just 3 more modules!

- Sarah 🌿`,
    voiceScript: `Detox specialist {{firstName}}! Module 17 complete! In today's toxic world, this knowledge is essential. You can help people feel better than ever. Just 3 more modules!`,
    hasVoice: true,
  },
  18: {
    text: `{{firstName}}!!!

Module 18 - Immune Health is DONE!

After everything we've all been through, immune health has never been more important. You're equipped to help people build resilient immune systems.

So close now!

- Sarah 🛡️`,
    voiceScript: `{{firstName}}! Module 18 complete, Immune Health! After everything we've been through, immune health has never been more important. You're equipped to help people build resilience. So close now!`,
    hasVoice: true,
  },
  19: {
    text: `PROTOCOL BUILDER {{firstName}}!!

Module 19 - Protocol Building & Program Design is COMPLETE!

You now know how to put it ALL together into custom protocols for your clients. This is where the magic happens!

ONE MORE MODULE!

- Sarah 🎯`,
    voiceScript: `Protocol builder {{firstName}}! Module 19 complete! You now know how to put it ALL together into custom protocols. This is where the magic happens! ONE more module to go!`,
    hasVoice: true,
  },
  20: {
    text: `{{firstName}}!!!

OH MY GOSH!!! Module 20 - Building Your Coaching Practice is COMPLETE!!!

You did it. You actually DID it. You've completed the ENTIRE certification!

I am SO incredibly proud of you. This journey wasn't easy, but you showed up, you did the work, and you finished.

Your certificate is being prepared. But more importantly... you're now ready to change lives.

I left you a special voice message. Listen when you can.

Welcome to the family, certified coach!

With so much pride,
Sarah 🎓✨🎉`,
    voiceScript: `Oh my gosh {{firstName}}! You did it! You actually DID it! You've completed the entire certification program! I am SO incredibly proud of you right now. This journey wasn't easy, but you showed up every single day. You did the work. And you finished. Your certificate is being prepared, but more importantly, you're now ready to change lives. Welcome to the family, certified coach. I can't wait to see what you accomplish!`,
    hasVoice: true,
  },
};

/**
 * Creates the initial admin welcome message (sent immediately on signup)
 * Now from "AccrediPro Founder" - includes accreditations, portal preview, trust signals
 */
function getAdminWelcomeMessage(firstName: string): string {
  return `Welcome to AccrediPro Academy, ${firstName}!

Congratulations on taking this important step toward your functional medicine journey.

🎓 WHAT YOU'VE UNLOCKED:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 FREE Mini Diploma in Functional Medicine
• Module 1: Foundations of Functional Medicine
• Module 2: The Functional Medicine Matrix
• Module 3: Nutrition & Lifestyle Protocols
• Final Assessment + Certificate

🖥️ YOUR PERSONAL LEARNING PORTAL:
• My Mini Diploma - Track your progress through modules
• Dashboard - Your learning hub with quick access to everything
• Roadmap - See your path from beginner to certified practitioner
• Messages - Direct chat with your personal coach Sarah
• Certificates - Download your Mini Diploma certificate upon completion
• Community - Connect with fellow students worldwide

🏛️ YOUR CERTIFICATION IS BACKED BY 9 ACCREDITATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CMA • IPHM • IAOTH • ICAHP • IGCT • CTAA • IHTCP • IIOHT • CPD

✅ Practice legally in 30+ countries
✅ Qualify for professional liability insurance
✅ Use MCMA post-nominal letters (with CMA membership)
✅ CPD certified for existing healthcare professionals

📍 WHAT TO DO NOW:
1. Click "My Mini Diploma" in the sidebar to start learning
2. Watch for a personal voice message from your coach Sarah
3. Complete all 3 modules + Final Exam to earn your certificate

Your coach Sarah will be reaching out shortly with a personal welcome message (including a voice note just for you!).

We're thrilled to have you in our global community of 12,000+ students from 45+ countries.

Best,
The AccrediPro Team`;
}

/**
 * Creates the personalized welcome message content from Sarah (sent 2-3 min after signup)
 */
function getWelcomeMessage(firstName: string): string {
  return `Hey ${firstName}! 💕

I'm Sarah, your coach for this entire journey - and I just saw your name come through!

Welcome! This is the start of something special, and I'm SO excited you're here!

Inside your dashboard you'll find:

✨ Your certification ready to start
✨ Your Roadmap showing where you're headed
✨ Direct access to message me anytime

I know you might be wondering if this is really for you... maybe feeling a mix of excited and nervous? I felt the exact same way when I started!

But here's what I know: you signed up for a reason. Something inside you said YES to this. Let's find out what that is together.

Hit reply anytime - tell me a little about yourself! What brought you here? What's your "why"?

I'm here for you every step of the way!

Talk soon,
Sarah ✨`;
}

/**
 * Creates the voice script for welcome message (natural speech with pauses)
 * Uses punctuation for natural pacing: ... for pauses, ..! for emphasis
 */
function getWelcomeVoiceScript(firstName: string): string {
  return `Hey there! I'm Sarah, and I'll be your coach throughout this journey....!

I just saw your name come through, ${firstName}, and wanted to personally say welcome.

This is the start of something special.

Inside your dashboard, you'll find your Mini Diploma ready to start, your Roadmap showing where you're headed, and you can message me anytime..!

..I know you might have questions. Maybe you're wondering if this is really for you. I get it, I felt the same way when I started...

But here's what I know: you signed up for a reason. Let's find out what that is together.

Hit reply anytime. I'm here for you, every step of the way!!!`;
}

/**
 * Triggers automatic messages based on user events
 */
export async function triggerAutoMessage({
  userId,
  trigger,
  triggerValue,
}: TriggerAutoMessageOptions) {
  try {
    console.log(`[AUTO-MESSAGE] Triggering ${trigger} for user ${userId}`);

    // Get the user to determine their assigned coach
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        assignedCoachId: true,
        isFakeProfile: true,
      },
    });

    if (!user) {
      console.warn(`[AUTO-MESSAGE] User ${userId} not found`);
      return;
    }

    // Skip fake profiles - they don't need auto-messages
    if (user.isFakeProfile) {
      console.log(`[AUTO-MESSAGE] Skipping fake profile ${userId}`);
      return;
    }

    console.log(`[AUTO-MESSAGE] Found user: ${user.firstName || 'Unknown'}`);

    // Get a coach to send from (prefer assigned coach, then Sarah, then any admin)
    let coachId = user.assignedCoachId;

    if (!coachId) {
      // Try to find a coach - prioritize specific coach emails first
      const defaultCoach = await prisma.user.findFirst({
        where: {
          OR: [
            { email: "coach@accredipro-certificate.com" },
            { email: "sarah@accredipro-certificate.com" },
            { role: "ADMIN" },
            { role: "MENTOR" },
          ],
        },
        orderBy: { createdAt: "asc" },
        select: { id: true, email: true, firstName: true },
      });

      if (defaultCoach) {
        console.log(`[AUTO-MESSAGE] Using coach: ${defaultCoach.email || defaultCoach.firstName}`);
        coachId = defaultCoach.id;
      }
    }

    if (!coachId) {
      console.error("[AUTO-MESSAGE] No coach available to send auto-message - please create an ADMIN or MENTOR user");
      return;
    }

    // SPECIAL HANDLING: First login welcome message with voice
    if (trigger === "first_login") {
      await sendFirstLoginWelcome(userId, user.firstName || "there", coachId);
      return; // Don't process other auto-messages for first login
    }

    // SPECIAL HANDLING: Module completion DM with voice (Main Certification)
    if (trigger === "module_complete" && triggerValue) {
      const moduleNumber = parseInt(triggerValue, 10);
      const moduleContent = MODULE_COMPLETION_MESSAGES[moduleNumber];
      if (moduleContent) {
        await sendAutoDM(userId, user.firstName || "there", coachId, `module_${moduleNumber}_complete`, moduleContent);
        return;
      }
    }

    // SPECIAL HANDLING: Mini Diploma module completion DM with voice
    // Module 0-3 = Content modules, Module 4 = Final Exam (handled by mini_diploma_complete)
    if (trigger === "mini_diploma_module_complete" && triggerValue) {
      const moduleNumber = parseInt(triggerValue, 10);
      // Send DMs for modules 0, 1, 2, 3 (not Final Exam which is 4+)
      if (moduleNumber >= 0 && moduleNumber <= 3) {
        const miniDiplomaModuleContent = MINI_DIPLOMA_MODULE_MESSAGES[moduleNumber];
        if (miniDiplomaModuleContent) {
          await sendAutoDM(userId, user.firstName || "there", coachId, `mini_diploma_module_${moduleNumber}_complete`, miniDiplomaModuleContent);
          return;
        }
      }
      // Final Exam (4+) is handled by mini_diploma_complete trigger
      return;
    }

    // Handle DM triggers with voice messages
    const dmContent = DM_CONTENT[trigger as keyof typeof DM_CONTENT];
    if (dmContent) {
      await sendAutoDM(userId, user.firstName || "there", coachId, trigger, dmContent);
      return;
    }

    // Get active auto-messages for this trigger
    const autoMessages = await prisma.autoMessage.findMany({
      where: {
        trigger,
        isActive: true,
        OR: [
          { triggerValue: null }, // Generic message for this trigger
          { triggerValue: triggerValue || null }, // Specific to this value (e.g., course)
        ],
      },
      orderBy: { priority: "desc" },
    });

    if (autoMessages.length === 0) return;

    // Process each auto-message
    for (const autoMessage of autoMessages) {
      const senderId = autoMessage.fromCoachId || coachId;

      // Replace template variables in content
      let content = autoMessage.content;
      content = content.replace(/\{\{firstName\}\}/g, user.firstName || "there");

      // Create the message based on type
      if (autoMessage.messageType === "dm") {
        // Check if we've already sent this auto-message to this user
        const existingMessage = await prisma.message.findFirst({
          where: {
            senderId,
            receiverId: userId,
            content: { contains: content.substring(0, 50) }, // Partial match
            createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Within 24 hours
          },
        });

        if (existingMessage) {
          continue; // Don't send duplicate
        }

        // Create the DM
        await prisma.message.create({
          data: {
            senderId,
            receiverId: userId,
            content,
            messageType: "DIRECT",
          },
        });

        // Create notification
        await prisma.notification.create({
          data: {
            userId,
            type: "NEW_MESSAGE",
            title: "New message from your coach",
            message: content.substring(0, 100) + (content.length > 100 ? "..." : ""),
            data: { senderId },
          },
        });
      }
      // Could add email/notification types here
    }
  } catch (error) {
    console.error("Error triggering auto-message:", error);
  }
}

/**
 * Sends personalized first login welcome message with voice from Sarah
 *
 * Flow:
 * 1. Immediately: Send admin welcome message
 * 2. After 2-3 min: Schedule Sarah's personal message with voice (via scheduled_messages table)
 */
async function sendFirstLoginWelcome(userId: string, firstName: string, coachId: string) {
  try {
    console.log(`[AUTO-MESSAGE] Sending first login welcome to ${firstName} (${userId}) from coach ${coachId}`);

    // Check if we've already sent a welcome message (check for admin welcome OR Sarah welcome)
    const existingWelcome = await prisma.message.findFirst({
      where: {
        receiverId: userId,
        OR: [
          { content: { contains: "I'll be your coach" } },
          { content: { contains: "Welcome to AccrediPro Academy" } },
        ],
      },
    });

    // Also check if there's already a scheduled voice message for this user
    const existingScheduled = await prisma.scheduledVoiceMessage.findFirst({
      where: {
        receiverId: userId,
        status: { in: ["PENDING", "PROCESSING"] },
      },
    });

    if (existingWelcome || existingScheduled) {
      console.log(`[AUTO-MESSAGE] Welcome already sent/scheduled to ${userId}, skipping`);
      return; // Already sent or scheduled
    }

    // Get admin user for the system message (AccrediPro Founder)
    const adminUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: "admin@accredipro.com" },  // Main admin account (AccrediPro Founder)
          { email: "admin@accredipro-certificate.com" },
          { email: "admin@accredipro.academy" },
          { role: "ADMIN" },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    const adminId = adminUser?.id || coachId;

    // Get Sarah's coach account specifically for the personal message
    const sarahCoach = await prisma.user.findFirst({
      where: {
        email: "sarah@accredipro-certificate.com",
      },
    });

    // Use Sarah's ID if found, otherwise fall back to the provided coachId
    const sarahId = sarahCoach?.id || coachId;
    console.log(`[AUTO-MESSAGE] Using Sarah coach ID: ${sarahId}`);

    // STEP 1: Admin welcome message DISABLED - only Sarah's personal message now
    // const adminContent = getAdminWelcomeMessage(firstName);
    // const adminMessage = await prisma.message.create({...});
    console.log(`[AUTO-MESSAGE] Admin welcome message disabled, only sending Sarah's personal message`);

    // STEP 2: Schedule Sarah's personal message for 2-3 minutes later
    // Random delay between 2-3 minutes (120-180 seconds)
    const delaySeconds = 120 + Math.floor(Math.random() * 60);
    const scheduledFor = new Date(Date.now() + delaySeconds * 1000);

    console.log(`[AUTO-MESSAGE] Scheduling Sarah's welcome for ${scheduledFor.toISOString()} (${delaySeconds}s delay)`);

    // Store the scheduled voice message in database using existing ScheduledVoiceMessage model
    const voiceScript = getWelcomeVoiceScript(firstName);
    const textContent = getWelcomeMessage(firstName);

    await prisma.scheduledVoiceMessage.create({
      data: {
        senderId: sarahId,
        receiverId: userId,
        voiceText: voiceScript,
        textContent: textContent,
        scheduledFor,
        status: "PENDING",
      },
    });

    // Assign Sarah as the user's coach
    if (sarahCoach) {
      await prisma.user.update({
        where: { id: userId },
        data: { assignedCoachId: sarahId },
      });
      console.log(`[AUTO-MESSAGE] Assigned Sarah as coach for user ${userId}`);
    }

    console.log(`[AUTO-MESSAGE] SUCCESS: Sent admin welcome + scheduled Sarah's message for user ${userId}`);
  } catch (error) {
    console.error("[AUTO-MESSAGE] Error sending first login welcome:", error);
    throw error; // Re-throw to see in logs
  }
}

/**
 * Process scheduled voice messages - called by cron job every minute
 */
export async function processScheduledMessages() {
  try {
    const now = new Date();

    // Find all pending voice messages that should be sent now
    const pendingMessages = await prisma.scheduledVoiceMessage.findMany({
      where: {
        status: "PENDING",
        scheduledFor: { lte: now },
      },
      include: {
        receiver: {
          select: { firstName: true },
        },
      },
    });

    console.log(`[SCHEDULED] Found ${pendingMessages.length} voice messages to process`);

    for (const scheduled of pendingMessages) {
      try {
        // Mark as processing to prevent duplicate sends
        await prisma.scheduledVoiceMessage.update({
          where: { id: scheduled.id },
          data: { status: "PROCESSING" },
        });

        // Extract first name from receiver or parse from voiceText
        const firstName = scheduled.receiver?.firstName || "there";

        // Check if this is a trigger-based scheduled message (module completion)
        if (scheduled.textContent.startsWith("trigger:")) {
          // Parse trigger from format: "trigger:mini_diploma_module_complete:0"
          const parts = scheduled.textContent.split(":");
          const trigger = parts[1] as TriggerAutoMessageOptions["trigger"];
          const triggerValue = parts[2];

          console.log(`[SCHEDULED] Processing trigger: ${trigger} value: ${triggerValue} for user ${scheduled.receiverId}`);

          // Call the triggerAutoMessage function
          await triggerAutoMessage({
            userId: scheduled.receiverId,
            trigger,
            triggerValue,
          });
        } else {
          // Original behavior: Send Sarah's welcome with voice
          await sendSarahWelcomeWithVoiceFromScheduled(
            scheduled.receiverId,
            firstName,
            scheduled.senderId,
            scheduled.textContent,
            scheduled.voiceText
          );
        }

        // Mark as sent
        await prisma.scheduledVoiceMessage.update({
          where: { id: scheduled.id },
          data: { status: "SENT", sentAt: new Date() },
        });

        console.log(`[SCHEDULED] Successfully processed voice message ${scheduled.id}`);
      } catch (error) {
        console.error(`[SCHEDULED] Error processing voice message ${scheduled.id}:`, error);

        // Mark as failed and increment attempts
        await prisma.scheduledVoiceMessage.update({
          where: { id: scheduled.id },
          data: {
            status: "FAILED",
            attempts: { increment: 1 },
            lastError: error instanceof Error ? error.message : "Unknown error",
          },
        });
      }
    }
  } catch (error) {
    console.error("[SCHEDULED] Error in processScheduledMessages:", error);
  }
}

/**
 * Sends Sarah's personal welcome message with voice (from scheduled job)
 * Uses pre-generated text and voice script from the scheduled message
 */
async function sendSarahWelcomeWithVoiceFromScheduled(
  userId: string,
  firstName: string,
  coachId: string,
  textContent: string,
  voiceScript: string
) {
  console.log(`[AUTO-MESSAGE] Sending Sarah's scheduled welcome with voice to ${firstName} (${userId})`);

  // Create the welcome text message
  const textMessage = await prisma.message.create({
    data: {
      senderId: coachId,
      receiverId: userId,
      content: textContent,
      messageType: "DIRECT",
    },
  });
  console.log(`[AUTO-MESSAGE] Created Sarah's text message: ${textMessage.id}`);

  // Generate voice message using ElevenLabs with Sarah's cloned voice
  const voiceResult = await generateAndUploadVoice(voiceScript, `welcome-${userId.slice(0, 8)}`);

  if (voiceResult) {
    // Create the voice message with uploaded audio URL
    const voiceMessage = await prisma.message.create({
      data: {
        senderId: coachId,
        receiverId: userId,
        content: `🎤 Voice message from Sarah`,
        attachmentUrl: voiceResult.url,
        attachmentType: "voice",
        attachmentName: "Welcome from Sarah",
        voiceDuration: voiceResult.duration,
        messageType: "DIRECT",
      },
    });
    console.log(`[AUTO-MESSAGE] Created voice message: ${voiceMessage.id}`);
  } else {
    console.warn(`[AUTO-MESSAGE] Could not generate voice, skipping voice message`);
  }

  // Create notification
  await prisma.notification.create({
    data: {
      userId,
      type: "NEW_MESSAGE",
      title: "New message from Sarah! 🎤",
      message: "Sarah has sent you a personal welcome message with a voice note",
      data: { senderId: coachId },
    },
  });

  console.log(`[AUTO-MESSAGE] SUCCESS: Sent Sarah's welcome (text + voice) to user ${userId}`);
}

/**
 * Sends an automated DM with optional voice message
 */
async function sendAutoDM(
  userId: string,
  firstName: string,
  coachId: string,
  trigger: string,
  content: { text: string; voiceScript: string | null; hasVoice: boolean }
) {
  try {
    console.log(`[AUTO-MESSAGE] Sending ${trigger} DM to ${firstName} (${userId})`);

    // Check if we've already sent this specific DM trigger to this user
    const existingMessage = await prisma.message.findFirst({
      where: {
        receiverId: userId,
        senderId: coachId,
        content: { contains: content.text.substring(0, 30).replace(/\{\{firstName\}\}/g, firstName) },
      },
    });

    if (existingMessage) {
      console.log(`[AUTO-MESSAGE] ${trigger} DM already sent to ${userId}, skipping`);
      return;
    }

    // Replace template variables
    const textContent = content.text.replace(/\{\{firstName\}\}/g, firstName);

    // Create the text message
    const textMessage = await prisma.message.create({
      data: {
        senderId: coachId,
        receiverId: userId,
        content: textContent,
        messageType: "DIRECT",
      },
    });
    console.log(`[AUTO-MESSAGE] Created text DM: ${textMessage.id}`);

    // Generate and send voice message if script is provided
    if (content.hasVoice && content.voiceScript) {
      const voiceScriptPersonalized = content.voiceScript.replace(/\{\{firstName\}\}/g, firstName);
      const voiceResult = await generateAndUploadVoice(
        voiceScriptPersonalized,
        `${trigger}-${userId.slice(0, 8)}`
      );

      if (voiceResult) {
        const voiceMessage = await prisma.message.create({
          data: {
            senderId: coachId,
            receiverId: userId,
            content: `🎤 Voice message from Sarah`,
            attachmentUrl: voiceResult.url,
            attachmentType: "voice",
            attachmentName: `Sarah - ${trigger.replace(/_/g, " ")}`,
            voiceDuration: voiceResult.duration,
            messageType: "DIRECT",
          },
        });
        console.log(`[AUTO-MESSAGE] Created voice DM: ${voiceMessage.id}`);
      } else {
        console.warn(`[AUTO-MESSAGE] Could not generate voice for ${trigger}`);
      }
    }

    // Create notification
    await prisma.notification.create({
      data: {
        userId,
        type: "NEW_MESSAGE",
        title: content.hasVoice ? "New voice message from Sarah!" : "New message from Sarah!",
        message: textContent.substring(0, 100) + "...",
        data: { senderId: coachId },
      },
    });

    console.log(`[AUTO-MESSAGE] SUCCESS: Sent ${trigger} DM to user ${userId}`);
  } catch (error) {
    console.error(`[AUTO-MESSAGE] Error sending ${trigger} DM:`, error);
    throw error;
  }
}

/**
 * Assigns a coach to a user based on their enrollments
 */
export async function assignCoachToUser(userId: string) {
  try {
    // Get user's enrollments to determine category
    const enrollments = await prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            category: true,
            coach: true,
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    });

    if (enrollments.length === 0) return;

    // Find a coach from their most recent enrollment
    const recentEnrollment = enrollments[0];
    const coachId = recentEnrollment.course.coachId;

    if (coachId) {
      await prisma.user.update({
        where: { id: userId },
        data: { assignedCoachId: coachId },
      });
    }
  } catch (error) {
    console.error("Error assigning coach:", error);
  }
}
