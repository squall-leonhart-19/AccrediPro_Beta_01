/**
 * Seed Script: Create "Questions Everyone Has" posts
 * Run with: npx tsx scripts/seed-questions-posts.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Reusing user pools from other scripts slightly modified for questions context
const QUESTION_TITLES = [
    "How did you choose your niche?",
    "Is the 6-month timeline realistic with a full-time job?",
    "Dealing with imposter syndrome before my first client call",
    "How much should I charge for my first package?",
    "Do I really need a website to start?",
    "Client retention - help!",
    "What malpractice insurance do you use?",
    "Feeling overwhelmed by Module 4 (Hormones)",
    "How do you explain Functional Medicine to skeptics?",
    "Anyone else struggling to find study time with kids?",
    "Best way to accept payments?",
    "LLC vs Sole Proprietorship?",
    "Marketing on Instagram - is it worth it?",
    "Tech stack recommendations for new coaches?",
    "Handling a difficult client refund request",
    "Networking with local doctors - any tips?",
    "Confidence to raise prices?",
    "Scope of practice question - supplements",
    "Coaching agreement templates?",
    "Motivation slump in the middle of the course",
    "Certification exam - how hard is it?",
    "Switching careers at 50 - am I crazy?",
    "Integrating FM into a nursing practice",
    "Virtual vs In-person coaching?",
    "How to get first testimonials?"
];

const QUESTION_CONTENTS = [
    "I'm stuck trying to decide between focusing on gut health or thyroid issues. I have personal experience with both. How did you guys narrow it down? Did you waiting until you had a few clients first?",
    "I'm working 40 hours a week and trying to squeeze this in. I see some people finishing in 6 months but I feel like I'm falling behind. Be honest - how long did it really take you?",
    "I have my first discovery call booked for Tuesday and I am terrified. I feel like I don't know enough yet even though I've passed the exams. Any tips for calming the nerves?",
    "I'm thinking of creating a 12-week program. I was thinking $1200 but my partner thinks that's too high for a newbie. What did you charge for your first package?",
    "I'm getting stuck in the weeds trying to build a Wix site. Do I actually need this to launch my pilot program or can I just use social media and DMs?",
    "I have a client who started strong but has ghosted our last two sessions. How many times do I follow up before letting it go?",
    "Just looking for recommendations for liability insurance. Who do you use and about how much is it running you per year?",
    "The hormone pathways are making my brain hurt. Does anyone have a good study guide or resource that simplifies the HPA axis? I'm drowning in biochemistry here.",
    "My brother-in-law keeps calling this 'woo woo' science. How do you explain the science-backed nature of FM to people who are skeptical?",
    "Summer break is killing my study routine. Moms, when do you find time? Early mornings? Late nights? I feel like I haven't opened a module in 2 weeks.",
    "Stripe? PayPal? Venmo? What's the most professional way to invoice clients that doesn't take huge fees?",
    "For those just starting out, did you form an LLC immediately or wait until you had consistent income? The paperwork seems daunting right now.",
    "I hate being on camera but everyone says Reels are the only way to grow. Has anyone built a business without constant video content?",
    "Practice Better vs Healthie vs simple Google Docs? I don't want to spend a fortune on software yet but want to look professional.",
    "I have a client asking for a refund after 2 sessions because she 'isn't seeing results yet' (even though she hasn't changed her diet). How do you handle this politely but firmly?",
    "I want to connect with local functional MDs to get referrals. Has anyone successfully done this? What was your approach?",
    "I'm fully booked at my intro rate ($75/session) but scared to raise it. How did you handle the conversation with existing clients?",
    "Where is the line on recommending supplements? I want to be helpful but don't want to cross into 'prescribing'. How do you phrase things?",
    "Does anyone have a solid coaching contract they'd be willing to share? Or where did you buy yours? I want to make sure I'm legally covered.",
    "I started with so much fire but real life is getting in the way. I'm 60% done and stalling out. How do you get your mojo back?",
    "Nervous about the final exam. Is it mostly case studies or memorization? Trying to figure out how to best focus my review time.",
    "I've been an accountant for 30 years. Leaving a stable salary to do this feels huge. Anyone else make a massive pivot later in life?",
    "I'm an RN and want to use this in my clinical work but my hospital is strict. Any other nurses here finding ways to incorporate FM principles in a traditional setting?",
    "I assumed I'd do Zoom but I miss human connection. Does anyone rent office space? Is the overhead worth it?",
    "I need social proof but have no clients yet. Is it okay to do free sessions for friends in exchange for reviews? helping verify this approach."
];

async function main() {
    console.log("🚀 Seeding 'Questions Everyone Has' posts...");

    // Get users for authors
    const students = await prisma.user.findMany({
        where: { role: "STUDENT", isFakeProfile: true },
        take: 100 // Grab a pool of potential authors
    });

    if (students.length === 0) {
        console.error("No student profiles found! Run community seed first.");
        return;
    }

    // Get the category ID for 'questions'
    const category = await prisma.category.findFirst({
        where: {
            OR: [
                { slug: "questions" },
                { name: { contains: "Questions", mode: "insensitive" } }
            ]
        }
    });

    if (!category) {
        console.error("Questions category not found!");
        return;
    }

    console.log(`Using category: ${category.name} (${category.id})`);

    let createdCount = 0;

    // We'll create as many posts as we have matching title/content pairs
    // (Assuming arrays are synced, which they seem to be visually, but let's be safe with min length)
    const count = Math.min(QUESTION_TITLES.length, QUESTION_CONTENTS.length);

    for (let i = 0; i < count; i++) {
        const author = students[Math.floor(Math.random() * students.length)];
        const title = QUESTION_TITLES[i];
        const content = QUESTION_CONTENTS[i];

        // Random date in the last 60 days
        const daysAgo = Math.floor(Math.random() * 60);
        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - daysAgo);

        await prisma.communityPost.create({
            data: {
                title,
                content,
                categoryId: category.id, // Using the ID we found from DB
                authorId: author.id,
                viewCount: Math.floor(Math.random() * 500) + 50,
                likeCount: Math.floor(Math.random() * 20),
                isPinned: false,
                createdAt,
                updatedAt: createdAt
            }
        });

        createdCount++;
    }

    console.log(`✅ Created ${createdCount} question posts in category '${category.name}'`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
