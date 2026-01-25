/**
 * Seed 43 Community Channels
 * 3 Global + 10 Categories × 4 Types = 43 Total
 */

import { PrismaClient, ChannelType } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { config } from 'dotenv';
import path from 'path';

// Load env vars
config({ path: path.join(process.cwd(), '.env') });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Category definitions
const CATEGORIES = [
    { key: "functional_medicine", name: "Functional & Integrative Medicine", emoji: "🩺", slug: "fm" },
    { key: "trauma_recovery", name: "Trauma & Recovery", emoji: "💔", slug: "tr" },
    { key: "mental_health", name: "Mental Health & Wellness", emoji: "🧠", slug: "mh" },
    { key: "parenting_family", name: "Parenting & Family", emoji: "👨‍👩‍👧", slug: "pf" },
    { key: "spiritual_energy", name: "Spiritual & Energy", emoji: "✨", slug: "se" },
    { key: "mind_body", name: "Mind & Body", emoji: "🧘", slug: "mb" },
    { key: "pet_wellness", name: "Pet Wellness", emoji: "🐾", slug: "pw" },
    { key: "herbalism", name: "Herbalism & Plant Medicine", emoji: "🌿", slug: "hb" },
    { key: "sexual_wellness", name: "Women's Health & Intimacy", emoji: "💕", slug: "wh" },
    { key: "general_wellness", name: "General Wellness", emoji: "💚", slug: "gw" },
];

// Channel types per category
const CHANNEL_TYPES = [
    { type: ChannelType.INTRODUCTIONS, name: "Introduce Yourself", emoji: "👋" },
    { type: ChannelType.WINS, name: "Wins & Celebrations", emoji: "🎉" },
    { type: ChannelType.QUESTIONS, name: "Questions & Support", emoji: "💬" },
    { type: ChannelType.TIPS, name: "Tips & Resources", emoji: "💡" },
];

// Global channels
const GLOBAL_CHANNELS = [
    {
        slug: "global-wins",
        name: "Wins & Graduates",
        emoji: "🏆",
        type: ChannelType.GLOBAL_WINS,
        description: "Celebrate completions from all categories! Auto-posted when students complete certifications.",
        autoPost: true,
    },
    {
        slug: "global-announcements",
        name: "AccrediPro News",
        emoji: "📢",
        type: ChannelType.GLOBAL_ANNOUNCEMENTS,
        description: "Official announcements, new courses, platform updates, and events.",
        adminOnly: true,
    },
    {
        slug: "global-lounge",
        name: "Student Lounge",
        emoji: "☕",
        type: ChannelType.GLOBAL_LOUNGE,
        description: "Off-topic chat, life stuff, memes, and general support. A place to be human!",
    },
];

async function seedChannels() {
    console.log("🌱 Seeding Community Channels...\n");

    // First, get or create categories
    const categoryMap = new Map<string, string>();

    for (const cat of CATEGORIES) {
        // Try to find by slug first, then by name
        let existing = await prisma.category.findUnique({
            where: { slug: cat.slug },
        });

        if (!existing) {
            // Also check by name in case it exists with different slug
            existing = await prisma.category.findUnique({
                where: { name: cat.name },
            });
        }

        if (existing) {
            categoryMap.set(cat.key, existing.id);
            console.log(`  📁 Found category: ${cat.name} (id: ${existing.id})`);
        } else {
            // Create the category if it doesn't exist
            try {
                const created = await prisma.category.create({
                    data: {
                        name: cat.name,
                        slug: cat.slug,
                        description: `Community for ${cat.name} students and practitioners`,
                        icon: cat.emoji,
                        isActive: true,
                    },
                });
                categoryMap.set(cat.key, created.id);
                console.log(`  ✅ Created category: ${cat.name}`);
            } catch (e: any) {
                // If creation fails, try to find it again (race condition)
                const found = await prisma.category.findFirst({
                    where: { OR: [{ slug: cat.slug }, { name: cat.name }] }
                });
                if (found) {
                    categoryMap.set(cat.key, found.id);
                    console.log(`  📁 Found category (after conflict): ${cat.name}`);
                } else {
                    console.error(`  ❌ Could not create or find: ${cat.name}`);
                }
            }
        }
    }

    // Seed global channels
    console.log("\n🌐 Creating Global Channels...");
    let globalCount = 0;

    for (const channel of GLOBAL_CHANNELS) {
        const existing = await prisma.communityChannel.findUnique({
            where: { slug: channel.slug },
        });

        if (!existing) {
            await prisma.communityChannel.create({
                data: {
                    slug: channel.slug,
                    name: channel.name,
                    emoji: channel.emoji,
                    type: channel.type,
                    description: channel.description,
                    isGlobal: true,
                    adminOnly: channel.adminOnly || false,
                    autoPost: channel.autoPost || false,
                    sortOrder: globalCount,
                },
            });
            globalCount++;
            console.log(`  ✅ Created: ${channel.emoji} ${channel.name}`);
        } else {
            console.log(`  📌 Exists: ${channel.emoji} ${channel.name}`);
        }
    }

    // Seed category channels
    console.log("\n📁 Creating Category Channels...");
    let categoryChannelCount = 0;

    for (const cat of CATEGORIES) {
        const categoryId = categoryMap.get(cat.key);
        if (!categoryId) continue;

        console.log(`\n  ${cat.emoji} ${cat.name}:`);

        for (let i = 0; i < CHANNEL_TYPES.length; i++) {
            const channelDef = CHANNEL_TYPES[i];
            const slug = `${cat.slug}-${channelDef.type.toLowerCase()}`;

            const existing = await prisma.communityChannel.findUnique({
                where: { slug },
            });

            if (!existing) {
                await prisma.communityChannel.create({
                    data: {
                        slug,
                        name: channelDef.name,
                        emoji: channelDef.emoji,
                        type: channelDef.type,
                        isGlobal: false,
                        categoryId,
                        sortOrder: i,
                    },
                });
                categoryChannelCount++;
                console.log(`    ✅ ${channelDef.emoji} ${channelDef.name}`);
            } else {
                console.log(`    📌 ${channelDef.emoji} ${channelDef.name}`);
            }
        }
    }

    console.log("\n" + "=".repeat(50));
    console.log(`✅ Seeding complete!`);
    console.log(`   Global channels: ${globalCount}`);
    console.log(`   Category channels: ${categoryChannelCount}`);
    console.log(`   Total new: ${globalCount + categoryChannelCount}`);
}

async function main() {
    try {
        await seedChannels();
    } catch (error) {
        console.error("❌ Error seeding channels:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main();
