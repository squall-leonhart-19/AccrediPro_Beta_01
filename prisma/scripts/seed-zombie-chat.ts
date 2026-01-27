/**
 * Seed script for Live VSL Zombie Chat Messages
 * Run with: npx tsx prisma/scripts/seed-zombie-chat.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Live chat profiles with existing R2 testimonial images
const CHAT_PROFILES = [
    { name: "Gina T.", location: "California", background: "nurse", tier: 1, avatar: "https://assets.accredipro.academy/fm-certification/T6.webp" },
    { name: "Amber L.", location: "Texas", background: "mom", tier: 1, avatar: "https://assets.accredipro.academy/fm-certification/T3.webp" },
    { name: "Cheryl W.", location: "Florida", background: "pharmacist", tier: 1, avatar: "https://assets.accredipro.academy/fm-certification/TESTIMONIAL_02.jpg" },
    { name: "Lisa K.", location: "Oregon", background: "yoga teacher", tier: 1, avatar: "https://assets.accredipro.academy/fm-certification/TESTIMONIAL_05.jpeg" },
    { name: "Denise P.", location: "Colorado", background: "corporate", tier: 2, avatar: "https://assets.accredipro.academy/fm-certification/T2.webp" },
    { name: "Patricia W.", location: "Nashville", background: "teacher", tier: 2, avatar: "https://assets.accredipro.academy/fm-certification/T4.webp" },
    { name: "Michelle R.", location: "Chicago", background: "nurse", tier: 2, avatar: "https://assets.accredipro.academy/fm-certification/T5.webp" },
    { name: "Sandra L.", location: "Phoenix", background: "mom", tier: 2, avatar: "https://assets.accredipro.academy/fm-certification/T7.webp" },
    { name: "Amy C.", location: "Portland", background: "corporate", tier: 3, avatar: "https://assets.accredipro.academy/fm-certification/T8.webp" },
    { name: "Christine B.", location: "Atlanta", background: "therapist", tier: 3, avatar: "https://assets.accredipro.academy/fm-certification/T9.webp" },
];

// Full 45-minute chat script synced to video timestamps
// Format: [videoTime in seconds, type, profileIndex or null, message]
const CHAT_SCRIPT: [number, string, number | null, string, string?, string?][] = [
    // Pre-Training (0:00 - 2:00)
    [0, "system", null, "Live training starting now..."],
    [15, "sarah", null, "Welcome everyone! So excited to see you all here. We're about to start!"],
    [30, "chat", 0, "Hi everyone! Gina from California, just passed my exam!"],
    [35, "chat", 1, "Amber here from Texas, nervous but excited!"],
    [45, "chat", 2, "Cheryl from Florida. Let's see what this is about."],
    [55, "chat", 3, "Hey everyone! Lisa here - I actually enrolled 2 months ago, came back to watch this again!"],
    [65, "sarah", null, "Lisa! So good to see you back! Everyone, Lisa is proof this works."],
    [75, "chat", 4, "Denise from Colorado. Just finished the exam 20 min ago!"],
    [90, "chat", 5, "Patricia, Nashville. Ready to learn!"],
    [105, "sarah", null, "Love seeing where everyone's from! OK let's get started..."],

    // Section 1: Introduction (2:00 - 5:00)
    [135, "chat", 0, "This is hitting different"],
    [165, "chat", 1, "So true about people scrolling past and forgetting by dinner"],
    [180, "chat", 2, "OK that 'top 10%' stat got my attention"],
    [210, "chat", 3, "I remember feeling exactly like this when I watched"],
    [240, "chat", 0, "Wait, 5-12K/month? Is that real?"],
    [255, "sarah", null, "Gina - yes! I'll show you exactly how in a few minutes. Real numbers from real graduates."],
    [285, "chat", 4, "Saving this chat for later lol"],

    // Section 2: The Problem (5:00 - 12:00)
    [315, "chat", 1, "The health part... that's literally me"],
    [330, "alert", null, "47 graduates watching right now"],
    [345, "chat", 0, "I've spent SO much money on supplements that didn't work"],
    [360, "chat", 2, "10K on specialists, programs, courses... yep"],
    [375, "sarah", null, "Diane, you're not alone. The average woman spends $8,000+ before finding answers."],
    [405, "chat", 5, "The 'maybe you're just stressed' thing... TRIGGERED"],
    [420, "chat", 0, "OMG the work part too. I dread going to my nursing shifts"],
    [450, "chat", 1, "The 'everyone comes to me for advice' - that's literally my life"],
    [465, "enrollment", null, "Jessica L. just enrolled!", "Atlanta, GA"],
    [470, "alert", null, "3 scholarship spots remaining this month"],
    [480, "chat", 3, "Jennifer, I was the same way. Now I actually get PAID for that advice!"],
    [510, "chat", 2, "OK Sarah is reading my mind right now"],
    [540, "chat", 4, "The 'could this actually be my career' question... yes"],
    [570, "sarah", null, "Lisa, I asked myself that same question 3 years ago. Now I've helped 1,247 women do exactly that."],
    [600, "chat", 0, "Something IS pulling me toward this"],
    [630, "chat", 1, "Crying a little bit not gonna lie"],
    [660, "chat", 5, "The whisper... the knowing... yes"],
    [690, "chat", 2, "Fine, I'm hooked. What's the 'more' she's talking about?"],

    // Section 3: The Opportunity (12:00 - 20:00)
    [735, "chat", 0, "TRILLION??"],
    [750, "chat", 1, "I'm literally in that demographic lol"],
    [765, "chat", 2, "OK pharmacist here - those health issues she listed are EVERYWHERE"],
    [780, "sarah", null, "Diane, exactly! You see it every day. Imagine actually being able to HELP those women."],
    [810, "chat", 4, "The '6 minute appointments' thing is so real"],
    [825, "enrollment", null, "Stephanie H. just enrolled!", "Boston, MA"],
    [830, "alert", null, "2 scholarship spots remaining"],
    [840, "chat", 0, "Root cause vs band-aids... THIS"],
    [870, "chat", 3, "This is what I do now. Listen, understand, find the ROOT"],
    [900, "chat", 1, "$150-300 per session?? Really?"],
    [915, "sarah", null, "Jennifer, that's actually conservative. Many of our practitioners charge $200-400."],
    [930, "chat", 2, "Wait let me do this math..."],
    [960, "chat", 0, "3 clients x $1500 = $4500/month PART TIME?!"],
    [975, "chat", 2, "4 clients at $2000 = $8000/month... working from HOME?"],
    [990, "sarah", null, "Diane's doing the math! Yes, that's exactly right."],
    [1005, "chat", 5, "I need to see proof this actually works though"],
    [1020, "sarah", null, "Patricia, perfect timing - real case studies coming up right now..."],
    [1050, "chat", 0, "JENNY THE NURSE"],
    [1065, "chat", 1, "Wait - $12,500 her FIRST MONTH?"],
    [1080, "enrollment", null, "Nicole C. just enrolled!", "Dallas, TX"],
    [1095, "chat", 2, "OK the pharmacist story... that's literally me"],
    [1110, "chat", 0, "Sarah the stay-at-home mom with NO qualifications made $6200 month 2??"],
    [1125, "sarah", null, "Maria, Sarah (different Sarah!) is now one of our most successful graduates. Zero background."],
    [1140, "chat", 1, "I'm just a mom... she was just a mom..."],
    [1155, "chat", 3, "Jennifer, I was 'just a yoga teacher.' Now I have a full practice."],
    [1170, "chat", 2, "The Rebecca story at 47... saying it's too late... that's my fear"],
    [1185, "chat", 5, "78K first year PART TIME at 47?!"],
    [1200, "sarah", null, "Rebecca quit her corporate job 8 months in. Now works 20 hours/week from home."],

    // Section 4: The Certification (20:00 - 30:00)
    [1215, "chat", 0, "OK what exactly do we learn?"],
    [1230, "chat", 2, "20 MODULES? That's comprehensive"],
    [1245, "chat", 1, "156 lessons... that sounds like a lot"],
    [1260, "sarah", null, "Jennifer, don't worry - it's self-paced. Most finish in 12-16 weeks doing about 1 hour/day."],
    [1290, "chat", 4, "The specialization certificates are smart - niche down"],
    [1305, "chat", 5, "Gut Health Specialist... that's what I need for my yoga clients"],
    [1320, "chat", 0, "21 certificates INCLUDING verified Master Certification??"],
    [1335, "enrollment", null, "Ashley R. just enrolled!", "Minneapolis, MN"],
    [1340, "alert", null, "1 scholarship spot remaining"],
    [1350, "chat", 2, "9 international accreditations... that's actually impressive"],
    [1365, "sarah", null, "Diane, we're the first program EVER to achieve all 9. Took us 2 years to get them all."],
    [1380, "chat", 1, "The LinkedIn credential thing... my friends would see that"],
    [1410, "chat", 3, "My LinkedIn connections have brought me 3 clients. The credential matters."],
    [1440, "chat", 0, "Personal mentorship until certified?? From Sarah herself?"],
    [1455, "sarah", null, "Yes Maria! Weekly group calls + direct access to me. I don't let my students fail."],
    [1470, "chat", 2, "OK the business building stuff is what I need. I can learn the health part but... clients?"],
    [1485, "chat", 5, "$100K Business Accelerator Box... what's in that?"],
    [1500, "sarah", null, "Patricia, it's everything - client attraction, pricing, templates, sales scripts. I'll show you..."],
    [1530, "chat", 0, "DONE FOR YOU program templates??"],
    [1545, "chat", 1, "Wait we get 5 complete programs already built?"],
    [1560, "sarah", null, "Yes! 12-week transformation programs, ready to use. Just add your personality."],
    [1590, "chat", 2, "The pricing calculator is genius. I'd have no idea what to charge."],
    [1620, "chat", 4, "Client Agreement Templates, Liability Protection... smart"],
    [1635, "enrollment", null, "Brittany M. just enrolled!", "Miami, FL"],
    [1650, "chat", 0, "OK I'm sold on the WHAT. Now tell me the price so I can panic lol"],
    [1665, "chat", 1, "Maria SAME"],
    [1680, "sarah", null, "Ha! Maria, Jennifer - stay with me. Let me address concerns first, then we'll talk investment."],
    [1710, "chat", 2, "The pharmacist in me is doing ROI calculations already"],
    [1740, "chat", 5, "Addressing concerns is smart. I have a few."],
    [1770, "chat", 0, "The 'I'm not a doctor' one... that's my big fear"],
    [1785, "sarah", null, "Maria, coming up right now. This is the #1 concern and I'll address it directly."],

    // Section 5: Objections (30:00 - 38:00)
    [1815, "chat", 1, "I'm not a doctor... I'm literally JUST a mom"],
    [1830, "chat", 0, "Wait - we EDUCATE not diagnose? That's different"],
    [1845, "sarah", null, "Exactly! We're coaches, not doctors. That's actually our ADVANTAGE. Doctors have 6 min. We have 60."],
    [1860, "chat", 2, "Hm, actually that makes sense. Doctors prescribe, we educate."],
    [1890, "chat", 3, "My clients love that I actually LISTEN. Their doctors never did."],
    [1920, "chat", 1, "The 'not smart enough' thing... ugh"],
    [1935, "chat", 0, "Jennifer we literally JUST passed the exam. We're smart enough!"],
    [1950, "sarah", null, "Maria's right! You passed the exam. That's proof. Sarah the mom had ZERO background."],
    [1980, "chat", 2, "The time concern is real for me though. I work full time."],
    [1995, "chat", 5, "5-7 hours per week is actually doable"],
    [2010, "sarah", null, "Most graduates are busy moms, nurses, professionals. They found the time because they decided it was worth it."],
    [2025, "enrollment", null, "Megan D. just enrolled!", "Philadelphia, PA"],
    [2040, "chat", 0, "OK the guarantees though..."],
    [2055, "chat", 1, "30-day money back, no questions?"],
    [2070, "sarah", null, "Yes! And 100% certification guarantee. If you do the work, you WILL get certified. I guarantee it."],
    [2085, "chat", 2, "Under 3% refund rate actually says a lot"],
    [2100, "chat", 4, "So basically... zero risk?"],
    [2115, "sarah", null, "Lisa, exactly. Either it changes your life, or you get your money back. That's it."],
    [2130, "chat", 0, "Can I actually make money though? Like ACTUALLY?"],
    [2145, "chat", 3, "Maria, I made $3,200 my second month. It's real."],
    [2160, "sarah", null, "Maria, Jenny did $12,500 month one. Rebecca did $78K year one. The math works."],
    [2190, "chat", 2, "OK the income math checks out. 2-3 clients covers it."],
    [2205, "chat", 1, "Is this legitimate though? Like actually accredited?"],
    [2220, "sarah", null, "Jennifer, 9 international accreditations. Google us. Check the reviews. We have nothing to hide."],
    [2235, "chat", 5, "I did Google before this. Reviews are real."],
    [2250, "enrollment", null, "Lauren W. just enrolled!", "Detroit, MI"],
    [2255, "alert", null, "Last scholarship spot claimed!"],
    [2260, "system", null, "Checking for additional spots..."],
    [2265, "alert", null, "1 emergency spot released for today only!"],
    [2280, "chat", 0, "OMG the spots!"],

    // Section 6: Price & Close (38:00 - 45:00)
    [2295, "chat", 1, "OK here comes the price... bracing myself"],
    [2310, "chat", 2, "Other programs are $5-6K... this better be reasonable"],
    [2325, "chat", 0, "IIN is $6000+, I looked"],
    [2340, "sarah", null, "Maria's done her research! Yes, comparable programs are $4,000-6,000."],
    [2370, "chat", 5, "And most don't include mentorship or business training"],
    [2385, "chat", 1, "Wait... $997?"],
    [2400, "chat", 0, "$997?? I was expecting like $3000"],
    [2415, "chat", 2, "For everything she listed? That's... actually reasonable"],
    [2430, "sarah", null, "And for scholarship graduates like you... it's $297."],
    [2445, "chat", 1, "WAIT WHAT"],
    [2460, "chat", 0, "$297?!?! For $24,000 worth of stuff??"],
    [2475, "chat", 2, "OK doing the math - ONE client at $150 pays this back"],
    [2490, "enrollment", null, "Emily K. just enrolled!", "Houston, TX"],
    [2505, "chat", 3, "That's less than I spent on ONE supplement protocol that didn't work"],
    [2520, "chat", 5, "$297 to change my career? That's nothing"],
    [2535, "sarah", null, "Patricia, that's exactly how to think about it. Investment vs expense."],
    [2550, "chat", 0, "The 72-hour thing though... I need to think"],
    [2565, "sarah", null, "Maria, I understand. But I've watched too many women say 'later' and later never comes."],
    [2580, "chat", 2, "She's right. I've been saying 'someday' for 3 years."],
    [2595, "chat", 1, "Me too..."],
    [2610, "enrollment", null, "Amanda B. just enrolled!", "Sacramento, CA"],
    [2625, "chat", 3, "Best decision I ever made was clicking that button. Just saying."],
    [2640, "sarah", null, "Alright everyone - checkout is now open below. Your scholarship is active."],
    [2655, "chat", 0, "I'm doing it."],
    [2670, "chat", 1, "Me too. Here goes nothing!"],
    [2685, "enrollment", null, "Maria T. just enrolled!", "Austin, TX"],
    [2690, "enrollment", null, "Jennifer K. just enrolled!", "Orlando, FL"],
    [2700, "chat", 2, "Fine. You convinced this skeptical pharmacist. Enrolling now."],
    [2710, "enrollment", null, "Diane R. just enrolled!", "Columbus, OH"],
    [2715, "sarah", null, "Welcome to the family Maria, Jennifer, Diane! Check your emails - I'll see you in Module 1!"],

    // Post-Video (45:00+)
    [2730, "chat", 6, "Just enrolled! So excited!"],
    [2745, "sarah", null, "Welcome! You made an amazing decision today."],
    [2760, "chat", 7, "Still watching, thinking about it"],
    [2775, "sarah", null, "Take your time! I'm here if you have questions. Just ask in the chat."],
    [2790, "enrollment", null, "Rachel T. just enrolled!", "Charlotte, NC"],
    [2820, "sarah", null, "For those still here - your scholarship is active for 24 hours. Don't let it expire!"],
];

async function main() {
    console.log("Seeding zombie chat profiles and messages...");

    // Create chat profiles with R2 avatars
    const profiles: string[] = [];
    for (const profile of CHAT_PROFILES) {
        const id = `chat-${profile.name.toLowerCase().replace(/[^a-z]/g, "-")}`;
        await prisma.zombieProfile.upsert({
            where: { id },
            update: {
                name: profile.name,
                location: profile.location,
                avatar: profile.avatar,
                background: profile.background,
                tier: profile.tier,
                personalityType: profile.tier === 1 ? "leader" : profile.tier === 2 ? "questioner" : "struggler",
                isGraduate: false,
            },
            create: {
                id,
                name: profile.name,
                location: profile.location,
                avatar: profile.avatar,
                background: profile.background,
                tier: profile.tier,
                personalityType: profile.tier === 1 ? "leader" : profile.tier === 2 ? "questioner" : "struggler",
                isGraduate: false,
            },
        });
        profiles.push(id);
        console.log(`Created/updated chat profile: ${profile.name}`);
    }

    // Clear existing chat messages
    await prisma.zombieChatMessage.deleteMany({});
    console.log("Cleared existing chat messages");

    // Create chat messages
    for (const [videoTime, type, profileIndex, content, enrolleeName, enrolleeLocation] of CHAT_SCRIPT) {
        const profileId = profileIndex !== null ? profiles[profileIndex] : null;

        await prisma.zombieChatMessage.create({
            data: {
                videoTime,
                messageType: type,
                content,
                profileId,
                enrolleeName: type === "enrollment" ? enrolleeName : null,
                enrolleeLocation: type === "enrollment" ? enrolleeLocation : null,
                isActive: true,
            },
        });
    }

    console.log(`Created ${CHAT_SCRIPT.length} chat messages`);
    console.log("Seeding complete!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
