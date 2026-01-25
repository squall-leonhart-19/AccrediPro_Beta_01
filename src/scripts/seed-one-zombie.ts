/**
 * Seed 1 Zombie User + Post for Testing
 * Tests the full flow before batch import
 */

import { PrismaClient, ChannelType } from "@prisma/client";
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { config } from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load env vars
config({ path: path.join(process.cwd(), '.env') });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Load first zombie character and post
const dataDir = path.join(process.cwd(), 'docs/community-seeding/data');
const characters = JSON.parse(fs.readFileSync(path.join(dataDir, 'zombie_characters_1000.json'), 'utf8'));
const posts = JSON.parse(fs.readFileSync(path.join(dataDir, 'zombie_posts_1000.json'), 'utf8'));

// Category slug mapping
const CATEGORY_SLUG_MAP: Record<string, string> = {
    functional_medicine: 'fm',
    trauma_recovery: 'tr',
    mental_health: 'mh',
    parenting_family: 'pf',
    spiritual_energy: 'se',
    mind_body: 'mb',
    pet_wellness: 'pw',
    herbalism: 'hb',
    sexual_wellness: 'wh',
    general_wellness: 'gw',
};

async function seedOneZombie() {
    console.log('🧟 Seeding 1 Zombie User + Post for Testing...\n');

    // Get first character and post
    const char = characters[0];
    const post = posts[0];

    console.log(`📋 Character: ${char.firstName} ${char.lastInitial}. from ${char.city}, ${char.state}`);
    console.log(`   Category: ${char.category}`);
    console.log(`   Archetype: ${char.archetype}`);
    console.log(`   Writing Style: ${char.writingStyleType}`);

    // Check if zombie already exists
    const existingUser = await prisma.user.findFirst({
        where: {
            isFakeProfile: true,
            firstName: char.firstName,
        }
    });

    if (existingUser) {
        console.log(`\n⚠️  Zombie user already exists: ${existingUser.firstName} ${existingUser.lastName}`);
        console.log(`   ID: ${existingUser.id}`);

        // Check for existing post
        const existingPost = await prisma.communityPost.findFirst({
            where: { authorId: existingUser.id }
        });

        if (existingPost) {
            console.log(`   Has post: "${existingPost.title.substring(0, 50)}..."`);
        }

        await prisma.$disconnect();
        return;
    }

    // Create zombie user
    const zombieEmail = `zombie_${char.id}_${Date.now()}@fake.accredipro.com`;
    const slug = `${char.firstName.toLowerCase()}-${char.lastInitial.toLowerCase()}-${char.id}`;

    console.log('\n👤 Creating zombie user...');

    const user = await prisma.user.create({
        data: {
            email: zombieEmail,
            firstName: char.firstName,
            lastName: `${char.lastInitial}.`,
            slug: slug,
            location: `${char.city}, ${char.state}`,
            role: 'STUDENT',
            isFakeProfile: true,
            bio: char.backstory,
            createdAt: new Date(Date.now() - char.joinedMonthsAgo * 30 * 24 * 60 * 60 * 1000),
        },
    });

    console.log(`   ✅ Created: ${user.firstName} ${user.lastName} (${user.id})`);

    // Find the introduction channel for this category
    const categorySlug = CATEGORY_SLUG_MAP[char.category] || 'gw';
    const channelSlug = `${categorySlug}-introductions`;

    const channel = await prisma.communityChannel.findUnique({
        where: { slug: channelSlug }
    });

    if (!channel) {
        console.log(`   ⚠️  Channel not found: ${channelSlug}`);
        await prisma.$disconnect();
        return;
    }

    console.log(`\n📝 Creating intro post in #${channel.name}...`);
    console.log(`   Preview: "${post.content.substring(0, 100)}..."`);

    // Create the post
    const communityPost = await prisma.communityPost.create({
        data: {
            title: `👋 Hi, I'm ${char.firstName}!`,
            content: post.content,
            authorId: user.id,
            channelId: channel.id,
            createdAt: new Date(Date.now() - (char.joinedMonthsAgo - 1) * 30 * 24 * 60 * 60 * 1000),
        },
    });

    console.log(`   ✅ Created post: ${communityPost.id}`);

    console.log('\n' + '='.repeat(50));
    console.log('✅ Test zombie seeding complete!');
    console.log(`   User: ${user.name} (${user.id})`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Post: ${communityPost.id}`);
    console.log(`   Channel: ${channel.emoji} ${channel.name}`);

    await prisma.$disconnect();
}

seedOneZombie().catch(console.error);
