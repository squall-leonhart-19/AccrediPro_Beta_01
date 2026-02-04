import prisma from "../src/lib/prisma";

/**
 * CIRCLE POD MESSAGE FLOW
 * 
 * BASE LAYER (pre-seeded, backdated):
 * - Sarah + Amber already having conversation
 * - Creates illusion of active cohort
 * 
 * WHEN REAL STUDENT OPTS IN:
 * - Sees base conversation (social proof)
 * - Sarah welcomes THEM +5min
 * - Amber welcomes THEM +12min
 * - Then milestone triggers on lesson completion
 */

async function setupDemoPod() {
    try {
        const user = await prisma.user.findFirst({
            where: { email: "tortolialessio1997@gmail.com" },
        });
        if (!user) { console.log("User not found"); return; }

        const pod = await prisma.masterclassPod.findUnique({
            where: { userId: user.id },
            include: { zombieProfile: true },
        });
        if (!pod) { console.log("Pod not found"); return; }

        const firstName = user.firstName || "friend";
        const zombieName = pod.zombieProfile.name;
        const zombieFirstName = zombieName.split(" ")[0];
        const zombieAvatar = pod.zombieProfile.avatar;

        // Delete existing messages
        await prisma.masterclassMessage.deleteMany({ where: { podId: pod.id } });

        const now = new Date();

        // ============================================
        // BASE LAYER - Backdated (cohort already running)
        // ============================================

        // 1. Sarah intro (2h ago)
        const time1 = new Date(now.getTime() - 2 * 60 * 60 * 1000);
        await prisma.masterclassMessage.create({
            data: {
                podId: pod.id,
                dayNumber: 0,
                senderType: "sarah",
                senderName: "Sarah M.",
                senderAvatar: "/coaches/sarah-coach.webp",
                content: `🎉 Welcome to Cohort #47!

I'm Sarah - your guide for the next 48 hours.

You've just joined a small group of women serious about building a health coaching career.

Let's introduce ourselves! I'll go first... 👇`,
                scheduledFor: time1,
                sentAt: time1,
            },
        });

        // 2. Sarah's story (1h50m ago)
        const time2 = new Date(now.getTime() - 110 * 60 * 1000);
        await prisma.masterclassMessage.create({
            data: {
                podId: pod.id,
                dayNumber: 0,
                senderType: "sarah",
                senderName: "Sarah M.",
                senderAvatar: "/coaches/sarah-coach.webp",
                content: `I'm 52, from Austin Texas. Single mom of two. Was a nurse for 15 years until I burnt out so bad I couldn't get out of bed.

Functional medicine saved my life - literally. Now I help women like you do the same. 💛`,
                scheduledFor: time2,
                sentAt: time2,
            },
        });

        // 3. Amber intro (1h30m ago)
        const time3 = new Date(now.getTime() - 90 * 60 * 1000);
        await prisma.masterclassMessage.create({
            data: {
                podId: pod.id,
                dayNumber: 0,
                senderType: "zombie",
                senderName: zombieName,
                senderAvatar: zombieAvatar,
                content: `Hi everyone!! 👋 I'm ${zombieFirstName}, 48, from Ohio.

Former ER nurse - collapsed at work after 18 years. Functional medicine helped me fix my thyroid issues when doctors said "you're fine."

So excited to be here!! 💕`,
                scheduledFor: time3,
                sentAt: time3,
            },
        });

        // 4. Amber excitement (1h ago)
        const time4 = new Date(now.getTime() - 60 * 60 * 1000);
        await prisma.masterclassMessage.create({
            data: {
                podId: pod.id,
                dayNumber: 0,
                senderType: "zombie",
                senderName: zombieName,
                senderAvatar: zombieAvatar,
                content: `Can't believe we're actually doing this 🥹 I've been thinking about getting certified for 2 years... finally just went for it!`,
                scheduledFor: time4,
                sentAt: time4,
            },
        });

        console.log("✅ Base layer created (backdated cohort conversation)");

        // ============================================
        // STUDENT WELCOME - Scheduled for future
        // (Simulating: student just opted in NOW)
        // ============================================

        // 5. Sarah welcomes NEW student (+5 min)
        const welcome1 = new Date(now.getTime() + 5 * 60 * 1000);
        await prisma.masterclassMessage.create({
            data: {
                podId: pod.id,
                dayNumber: 0,
                senderType: "sarah",
                senderName: "Sarah M.",
                senderAvatar: "/coaches/sarah-coach.webp",
                content: `Oh ${firstName}!! 🎉 You made it!

So glad you're here. You have 48 hours to complete all 9 lessons + the exam.

It's designed for one focused day, but take breaks when you need!

What brought you to functional medicine? I'd love to hear your story 💛`,
                scheduledFor: welcome1,
                sentAt: null, // NOT sent yet - cron will send at scheduled time
            },
        });

        // 6. Amber welcomes NEW student (+12 min)
        const welcome2 = new Date(now.getTime() + 12 * 60 * 1000);
        await prisma.masterclassMessage.create({
            data: {
                podId: pod.id,
                dayNumber: 0,
                senderType: "zombie",
                senderName: zombieName,
                senderAvatar: zombieAvatar,
                content: `Yay ${firstName}!! 🙌 So happy you joined us!

Want to be accountability partners? I'm on Lesson 2 already - this stuff is actually SO good!

Let's do this together!! 💪`,
                scheduledFor: welcome2,
                sentAt: null, // NOT sent yet
            },
        });

        console.log("✅ Welcome messages scheduled (+5min, +12min)");
        console.log(`\n📅 Sarah will welcome ${firstName} at ${welcome1.toLocaleTimeString()}`);
        console.log(`📅 ${zombieFirstName} will welcome ${firstName} at ${welcome2.toLocaleTimeString()}`);

        console.log("\n🎉 Demo pod ready! Refresh to see base convo, wait 5min for personalized welcome.");
    } catch (e) {
        console.log("ERROR:", e);
    } finally {
        await prisma.$disconnect();
    }
}

setupDemoPod();
