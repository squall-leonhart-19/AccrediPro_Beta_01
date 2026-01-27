
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFrom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Generic warm welcomes (for ~70-80% of replies)
const GENERIC_WELCOMES = [
    "So happy to have you here! Your story resonates with so many of us. Welcome to the family! 💛",
    "Welcome! I'm so glad you found us. Can't wait to see you thrive in this program! 🌟",
    "This is exactly the kind of energy we love here! Welcome aboard! 💕",
    "Your journey is so inspiring. Welcome to the community! 🙌",
    "So excited you're here! You're going to do amazing things. Welcome! ✨",
    "Welcome! I already know you're going to help so many people. Let's do this! 🔥",
    "I love your story! You're in the right place. Welcome to the family! 💛",
    "This is YOUR time. So happy you're here with us! Welcome! 🌟",
    "Welcome! Your passion for helping others really shines through. 💕",
    "So grateful to have you here! This community is better because of people like you. 🙌",
    "Welcome! I can tell you're going to be an incredible practitioner. ✨",
    "Your heart for healing is exactly what this world needs. Welcome! 💛",
    "I'm so excited for your journey! Welcome to the community! 🔥",
    "Welcome! You've taken the first step and that's HUGE. So proud of you! 🌟",
    "So happy you're here! Your story inspires me. Welcome! 💕",
];

// Personalized reply templates (for ~20-30% of replies)
// These will be filled with keywords extracted from their story
const PERSONALIZED_TEMPLATES = [
    "{{NAME}}, your {{YEARS}} years of experience as a {{PROFESSION}} is exactly what this field needs! The traditional system's gaps are exactly why we're here. Welcome! 💛",
    "{{NAME}}, caring for {{HEALTH_MENTION}} while pursuing this takes incredible strength. You're going to help so many people who are going through what you've experienced. Welcome! 🙌",
    "{{NAME}}, your passion for getting to the root cause instead of just treating symptoms... YES! That's exactly what functional medicine is about. So happy you're here! 🔥",
    "{{NAME}}, I can feel your calling through your words. The fact that you want to turn your pain into purpose? That's powerful. Welcome! 💕",
    "{{NAME}}, your background in {{PROFESSION}} gives you such a unique perspective. I'm so excited to see how you blend that with functional medicine! ✨",
    "{{NAME}}, wanting to help others avoid what you went through is such a beautiful motivation. Welcome to the family! 🌟",
    "{{NAME}}, that burnout you mentioned? I've been there too. This community gets it. You're going to find your fire again. Welcome! 💛",
    "{{NAME}}, your story gave me chills! The healthcare system needs more people like you who actually CARE. Welcome! 🙌",
    "{{NAME}}, I love that you're ready to build something that's YOURS. Financial freedom AND purpose? Let's make it happen! 🔥",
    "{{NAME}}, your dedication to your family while pursuing this is so inspiring. You're showing them what's possible! 💕",
];

// Keywords to detect for personalization
const PROFESSION_KEYWORDS = [
    "nurse", "rn", "nursing", "lpn", "arnp", "midwife",
    "doctor", "physician", "md", "do",
    "therapist", "counselor", "psychologist",
    "massage", "yoga", "fitness", "trainer",
    "coach", "practitioner"
];

const HEALTH_KEYWORDS = [
    "cancer", "autoimmune", "thyroid", "hashimoto", "lupus",
    "diabetes", "lyme", "chronic", "pain", "fatigue",
    "depression", "anxiety", "burnout", "menopause", "perimenopause"
];

function extractInfo(story: string, firstName: string): { shouldPersonalize: boolean; reply: string } {
    const storyLower = story.toLowerCase();

    // Decide if we should personalize (20-30% chance, or if we find good keywords)
    const baseChance = Math.random() < 0.25;

    // Look for profession
    let profession = "";
    for (const keyword of PROFESSION_KEYWORDS) {
        if (storyLower.includes(keyword)) {
            profession = keyword.charAt(0).toUpperCase() + keyword.slice(1);
            break;
        }
    }

    // Look for health mention
    let healthMention = "";
    for (const keyword of HEALTH_KEYWORDS) {
        if (storyLower.includes(keyword)) {
            healthMention = keyword;
            break;
        }
    }

    // Look for years of experience
    const yearsMatch = story.match(/(\d+)\s*(?:years?|yrs?)/i);
    const years = yearsMatch ? yearsMatch[1] : "";

    // Check for burnout
    const hasBurnout = storyLower.includes("burnout") || storyLower.includes("burnt out") || storyLower.includes("burned out");

    // Decide personalization
    const hasGoodKeywords = profession || healthMention || hasBurnout;
    const shouldPersonalize = baseChance || hasGoodKeywords;

    if (!shouldPersonalize) {
        return { shouldPersonalize: false, reply: randomFrom(GENERIC_WELCOMES) };
    }

    // Create personalized reply
    let template = randomFrom(PERSONALIZED_TEMPLATES);

    template = template.replace("{{NAME}}", firstName);
    template = template.replace("{{PROFESSION}}", profession || "healthcare");
    template = template.replace("{{YEARS}}", years || "many");
    template = template.replace("{{HEALTH_MENTION}}", healthMention || "your health journey");

    return { shouldPersonalize: true, reply: template };
}

async function main() {
    console.log("🚀 Adding Sarah replies to ALL comments...\n");

    // 1. Get Sarah
    const sarah = await prisma.user.findFirst({
        where: { email: "sarah@accredipro-certificate.com" }
    });

    if (!sarah) {
        console.error("Sarah not found!");
        return;
    }

    console.log(`Found Sarah: ${sarah.id}`);

    // 2. Get the welcome post
    const welcomePost = await prisma.communityPost.findFirst({
        where: { title: { contains: "Welcome" } }
    });

    if (!welcomePost) {
        console.error("Welcome post not found!");
        return;
    }

    console.log(`Found welcome post: ${welcomePost.id}`);

    // 3. Get all comments on this post (excluding any that are already replies)
    const comments = await prisma.postComment.findMany({
        where: {
            postId: welcomePost.id,
            parentId: null, // Top-level comments only
        },
        include: {
            author: { select: { firstName: true } },
            replies: { select: { id: true } } // Check if already has replies
        },
        orderBy: { createdAt: "asc" }
    });

    console.log(`Found ${comments.length} top-level comments\n`);

    // 4. Add Sarah's reply to each comment
    let personalizedCount = 0;
    let genericCount = 0;

    for (let i = 0; i < comments.length; i++) {
        const comment = comments[i];

        // Skip if already has a reply
        if (comment.replies.length > 0) {
            console.log(`   Skipping comment ${i + 1} (already has replies)`);
            continue;
        }

        const firstName = comment.author.firstName || "friend";
        const { shouldPersonalize, reply } = extractInfo(comment.content, firstName);

        // Create reply from Sarah
        const replyDate = new Date(new Date(comment.createdAt).getTime() + randomInt(1, 24) * 60 * 60 * 1000); // 1-24 hours after comment

        await prisma.postComment.create({
            data: {
                postId: welcomePost.id,
                parentId: comment.id,
                authorId: sarah.id,
                content: reply,
                likeCount: randomInt(5, 25),
                createdAt: replyDate,
                updatedAt: replyDate
            }
        });

        if (shouldPersonalize) {
            personalizedCount++;
        } else {
            genericCount++;
        }

        if ((i + 1) % 50 === 0) {
            console.log(`   Progress: ${i + 1}/${comments.length} replies created...`);
        }
    }

    console.log(`\n🎉 SUCCESS! Added ${personalizedCount + genericCount} replies from Sarah.`);
    console.log(`   Personalized: ${personalizedCount}`);
    console.log(`   Generic warm: ${genericCount}`);
    console.log(`\n   Refresh: http://localhost:3000/community/c/fm`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
