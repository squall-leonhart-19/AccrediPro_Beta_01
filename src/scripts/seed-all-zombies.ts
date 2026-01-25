/**
 * Seed All 1000 Zombie Users + Posts
 * Batch import with progress tracking
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

// Load zombie data
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

// Pre-fetch all channels
let channelCache: Map<string, string> = new Map();

async function loadChannels() {
    const channels = await prisma.communityChannel.findMany();
    channels.forEach(ch => channelCache.set(ch.slug, ch.id));
    console.log(`📦 Loaded ${channelCache.size} channels into cache`);
}

async function seedAllZombies() {
    console.log('🧟 BATCH ZOMBIE SEEDING');
    console.log('='.repeat(50));
    console.log(`Total characters: ${characters.length}`);
    console.log(`Total posts: ${posts.length}`);
    console.log('='.repeat(50) + '\n');

    await loadChannels();

    const startTime = Date.now();
    let usersCreated = 0;
    let postsCreated = 0;
    let skipped = 0;
    const errors: string[] = [];

    // Process in batches of 50
    const BATCH_SIZE = 50;

    for (let i = 0; i < characters.length; i += BATCH_SIZE) {
        const batch = characters.slice(i, Math.min(i + BATCH_SIZE, characters.length));
        const batchNum = Math.floor(i / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(characters.length / BATCH_SIZE);

        console.log(`\n📦 Batch ${batchNum}/${totalBatches} (${i + 1}-${i + batch.length})`);

        for (const char of batch) {
            try {
                // Check if already exists
                const existing = await prisma.user.findFirst({
                    where: {
                        isFakeProfile: true,
                        email: { startsWith: `zombie_${char.id}_` }
                    }
                });

                if (existing) {
                    skipped++;
                    continue;
                }

                // Create user
                const zombieEmail = `zombie_${char.id}_${Date.now()}@fake.accredipro.com`;
                const slug = `${char.firstName.toLowerCase()}-${char.lastInitial.toLowerCase()}-${char.id}`;

                const user = await prisma.user.create({
                    data: {
                        email: zombieEmail,
                        firstName: char.firstName,
                        lastName: `${char.lastInitial}.`,
                        slug: slug,
                        location: `${char.city}, ${char.state}`,
                        role: 'STUDENT',
                        isFakeProfile: true,
                        bio: char.backstory?.substring(0, 500),
                        createdAt: new Date(Date.now() - char.joinedMonthsAgo * 30 * 24 * 60 * 60 * 1000),
                    },
                });
                usersCreated++;

                // Get matching post
                const post = posts.find((p: any) => p.id === char.id);
                if (!post) {
                    errors.push(`No post found for char ${char.id}`);
                    continue;
                }

                // Find channel
                const categorySlug = CATEGORY_SLUG_MAP[char.category] || 'gw';
                const channelSlug = `${categorySlug}-introductions`;
                const channelId = channelCache.get(channelSlug);

                if (!channelId) {
                    errors.push(`Channel not found: ${channelSlug}`);
                    continue;
                }

                // Create post
                await prisma.communityPost.create({
                    data: {
                        title: `👋 Hi, I'm ${char.firstName}!`,
                        content: post.content,
                        authorId: user.id,
                        channelId: channelId,
                        createdAt: new Date(Date.now() - (char.joinedMonthsAgo - 1) * 30 * 24 * 60 * 60 * 1000),
                    },
                });
                postsCreated++;

            } catch (err: any) {
                errors.push(`Error on ${char.firstName} ${char.lastInitial}: ${err.message}`);
            }
        }

        // Progress update
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        const rate = (usersCreated / parseFloat(elapsed)).toFixed(1);
        console.log(`   ✅ Users: ${usersCreated} | Posts: ${postsCreated} | Skipped: ${skipped} | Rate: ${rate}/s`);
    }

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log('\n' + '='.repeat(50));
    console.log('✅ SEEDING COMPLETE');
    console.log('='.repeat(50));
    console.log(`   Users created: ${usersCreated}`);
    console.log(`   Posts created: ${postsCreated}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Errors: ${errors.length}`);
    console.log(`   Time: ${totalTime}s`);

    if (errors.length > 0 && errors.length <= 10) {
        console.log('\n❌ Errors:');
        errors.forEach(e => console.log(`   - ${e}`));
    } else if (errors.length > 10) {
        console.log(`\n❌ First 10 errors (${errors.length} total):`);
        errors.slice(0, 10).forEach(e => console.log(`   - ${e}`));
    }

    await prisma.$disconnect();
}

seedAllZombies().catch(console.error);
