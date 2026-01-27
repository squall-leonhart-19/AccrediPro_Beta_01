
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as fs from "fs";
import * as path from "path";
import { parse } from "csv-parse/sync";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Male first names to skip
const MALE_NAMES = new Set([
    "todd", "steven", "eric", "john", "mike", "david", "chris", "brian", "james",
    "nathan", "kermit", "apollo", "derrell", "brig", "robin"
]);

function randomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function main() {
    console.log("🧹 Cleaning up previous test data...\n");

    const fmCategory = await prisma.category.findFirst({
        where: { slug: "fm" },
        include: { community: true, channels: true }
    });

    if (fmCategory?.community) {
        await prisma.postComment.deleteMany({
            where: { post: { communityId: fmCategory.community.id } }
        });
        await prisma.postLike.deleteMany({
            where: { post: { communityId: fmCategory.community.id } }
        });
        await prisma.communityPost.deleteMany({
            where: { communityId: fmCategory.community.id }
        });
        console.log("✅ Cleaned up previous FM posts\n");
    }

    console.log("🚀 Importing ALL 817 stories...\n");

    // 1. Read CSV
    const csvPath = path.join(process.cwd(), "BUYER QUALIFICATION - My branded typeform (1).csv");
    const csvContent = fs.readFileSync(csvPath, "utf-8");
    const records = parse(csvContent, { columns: true, skip_empty_lines: true });

    console.log(`Total records in CSV: ${records.length}`);

    // 2. Filter: skip males, dedupe by email
    const seenEmails = new Set<string>();
    const femaleStories: any[] = [];

    for (const row of records) {
        const firstName = (row["First name"] || "").trim();
        const lastName = (row["Last name"] || "").trim();
        const email = (row["Email"] || "").trim().toLowerCase();
        const story = (row["Tell me your story — what brought you here today? Why did investing in this certification feel right in your heart?"] || "").trim();

        if (MALE_NAMES.has(firstName.toLowerCase())) continue;
        if (!story || story.length < 20) continue;
        if (seenEmails.has(email)) continue;
        seenEmails.add(email);

        femaleStories.push({
            firstName,
            lastName,
            fullName: `${firstName} ${lastName}`.trim(),
            story
        });
    }

    console.log(`Female stories (deduped): ${femaleStories.length}`);

    if (!fmCategory?.community) {
        console.error("FM Community not found!");
        return;
    }

    const introChannel = fmCategory.channels.find(c => c.type === "INTRODUCTIONS");
    if (!introChannel) {
        console.error("Introductions channel not found!");
        return;
    }

    // 3. Get ALL existing zombies with R2 avatars
    const existingZombies = await prisma.user.findMany({
        where: {
            isFakeProfile: true,
            avatar: { startsWith: "https://assets.accredipro.academy/avatars/" }
        },
        select: { id: true, avatar: true },
        take: 1000 // We have 817 stories, need 817 zombies
    });

    console.log(`Found ${existingZombies.length} existing zombies with R2 avatars`);

    if (existingZombies.length < femaleStories.length) {
        console.error(`Not enough zombies! Need ${femaleStories.length}, have ${existingZombies.length}`);
        return;
    }

    // 4. Get Sarah
    const sarah = await prisma.user.findFirst({
        where: { email: "sarah@accredipro-certificate.com" }
    });

    if (!sarah) {
        console.error("Sarah not found!");
        return;
    }

    // 5. Create the pinned welcome post
    const postDate = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);

    const welcomePost = await prisma.communityPost.create({
        data: {
            title: "👋 Welcome! Introduce Yourself Here",
            content: `Hey there, beautiful soul! 💛

Welcome to our Functional Medicine family! I'm so excited you're here.

This is YOUR space to share your story. Tell us:

• Who you are
• What brought you here
• What you're hoping to achieve

Don't be shy — we're all on this journey together, and every story matters.

Drop your intro in the comments below! I read every single one. 🌟

With love,
Sarah 💕`,
            authorId: sarah.id,
            communityId: fmCategory.community.id,
            channelId: introChannel.id,
            isPinned: true,
            viewCount: randomInt(8000, 15000),
            likeCount: 0,
            createdAt: postDate,
            updatedAt: postDate
        }
    });

    console.log(`\n✅ Created pinned welcome post: ${welcomePost.id}`);

    // 6. Add likes to welcome post
    const likeCount = randomInt(150, 250);
    let actualLikes = 0;

    for (let i = 0; i < Math.min(likeCount, existingZombies.length); i++) {
        try {
            await prisma.postLike.create({
                data: {
                    postId: welcomePost.id,
                    userId: existingZombies[i].id,
                    createdAt: new Date(postDate.getTime() + randomInt(1, 80) * 24 * 60 * 60 * 1000)
                }
            });
            actualLikes++;
        } catch (e) { }
    }

    await prisma.communityPost.update({
        where: { id: welcomePost.id },
        data: { likeCount: actualLikes }
    });

    console.log(`✅ Added ${actualLikes} reactions to welcome post`);

    // 7. Import ALL stories as comments
    console.log(`\n📝 Creating ${femaleStories.length} comments...\n`);

    for (let i = 0; i < femaleStories.length; i++) {
        const story = femaleStories[i];
        const zombie = existingZombies[i];

        // Update zombie name to match CSV
        await prisma.user.update({
            where: { id: zombie.id },
            data: {
                firstName: story.firstName,
                lastName: story.lastName
            }
        });

        // Create comment
        const daysAgo = randomInt(1, 89); // Spread over last 89 days
        const commentDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000);

        await prisma.postComment.create({
            data: {
                postId: welcomePost.id,
                authorId: zombie.id,
                content: story.story,
                likeCount: randomInt(13, 49),
                createdAt: commentDate,
                updatedAt: commentDate
            }
        });

        if ((i + 1) % 50 === 0) {
            console.log(`   Progress: ${i + 1}/${femaleStories.length} comments created...`);
        }
    }

    console.log(`\n🎉 SUCCESS! Imported ${femaleStories.length} introduction stories.`);
    console.log(`   Refresh: http://localhost:3000/community/c/fm`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
