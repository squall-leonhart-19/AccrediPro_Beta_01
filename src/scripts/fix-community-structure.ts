/**
 * Fix Community Structure - Full Rebuild
 * 1. Delete wrong zombie posts
 * 2. Create 10 category intro posts
 * 3. Add 1000 zombie comments distributed by category
 */

import { PrismaClient } from "@prisma/client";
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

// Category definitions
const CATEGORIES = [
    { key: "functional_medicine", name: "Functional Medicine", slug: "fm", emoji: "🩺" },
    { key: "trauma_recovery", name: "Trauma Recovery", slug: "tr", emoji: "💔" },
    { key: "mental_health", name: "Mental Health", slug: "mh", emoji: "🧠" },
    { key: "parenting_family", name: "Parenting & Family", slug: "pf", emoji: "👨‍👩‍👧" },
    { key: "spiritual_energy", name: "Spiritual & Energy", slug: "se", emoji: "✨" },
    { key: "mind_body", name: "Mind & Body", slug: "mb", emoji: "🧘" },
    { key: "pet_wellness", name: "Pet Wellness", slug: "pw", emoji: "🐾" },
    { key: "herbalism", name: "Herbalism", slug: "hb", emoji: "🌿" },
    { key: "sexual_wellness", name: "Women's Health", slug: "wh", emoji: "💕" },
    { key: "general_wellness", name: "General Wellness", slug: "gw", emoji: "💚" },
];

async function fixCommunityStructure() {
    console.log('🔧 FIX COMMUNITY STRUCTURE');
    console.log('='.repeat(50));

    // PHASE 1: Delete wrong zombie posts
    console.log('\n📛 PHASE 1: Deleting wrong zombie posts...');
    const deletedPosts = await prisma.communityPost.deleteMany({
        where: {
            author: { isFakeProfile: true }
        }
    });
    console.log(`   Deleted ${deletedPosts.count} zombie posts`);

    // PHASE 2: Create category intro posts
    console.log('\n📝 PHASE 2: Creating category intro posts...');

    // Get admin user (Coach Sarah or first admin)
    const adminUser = await prisma.user.findFirst({
        where: { role: 'ADMIN' },
        orderBy: { createdAt: 'asc' }
    });

    if (!adminUser) {
        throw new Error('No admin user found!');
    }
    console.log(`   Using admin: ${adminUser.firstName} ${adminUser.lastName}`);

    const introPosts: Map<string, string> = new Map();

    for (const cat of CATEGORIES) {
        // Find or use default category
        const category = await prisma.category.findFirst({
            where: { OR: [{ slug: cat.slug }, { name: { contains: cat.name.split(' ')[0] } }] }
        });

        const title = `${cat.emoji} Welcome to ${cat.name}! Introduce Yourself`;
        const content = `
<p>👋 <strong>Welcome to the ${cat.name} community!</strong></p>

<p>This is YOUR space to connect with fellow practitioners on the same journey. We're so excited to have you here!</p>

<p><strong>💫 Tell us about yourself:</strong></p>
<ul>
  <li>Where are you from?</li>
  <li>What brought you to ${cat.name}?</li>
  <li>What are you hoping to achieve?</li>
  <li>Fun fact about yourself! 🎉</li>
</ul>

<p>Don't be shy - we're all here to support each other. Drop a comment below and say hi! 💕</p>

<p>- Coach Sarah & the AccrediPro Team</p>
`;

        const post = await prisma.communityPost.create({
            data: {
                title,
                content,
                authorId: adminUser.id,
                isPinned: true,
                categoryId: 'introductions',
                communityId: null,
                channelId: null,
            }
        });

        introPosts.set(cat.key, post.id);
        console.log(`   ✅ Created: ${cat.emoji} ${cat.name} intro (${post.id})`);
    }

    // PHASE 3: Add zombie comments to category intro posts
    console.log('\n💬 PHASE 3: Adding zombie comments...');

    let commentsCreated = 0;
    const errors: string[] = [];

    for (const char of characters) {
        try {
            // Find the zombie user
            const user = await prisma.user.findFirst({
                where: {
                    isFakeProfile: true,
                    firstName: char.firstName,
                    lastName: `${char.lastInitial}.`
                }
            });

            if (!user) {
                errors.push(`User not found: ${char.firstName} ${char.lastInitial}`);
                continue;
            }

            // Get the post content for this zombie
            const postContent = posts.find((p: any) => p.id === char.id);
            if (!postContent) {
                errors.push(`No post content for: ${char.firstName}`);
                continue;
            }

            // Find the intro post for this category
            const introPostId = introPosts.get(char.category);
            if (!introPostId) {
                // Default to general wellness
                const gwPostId = introPosts.get('general_wellness');
                if (!gwPostId) {
                    errors.push(`No intro post for: ${char.category}`);
                    continue;
                }
            }

            const targetPostId = introPostId || introPosts.get('general_wellness')!;

            // Create comment
            await prisma.postComment.create({
                data: {
                    content: postContent.content,
                    authorId: user.id,
                    postId: targetPostId,
                    createdAt: new Date(Date.now() - (char.joinedMonthsAgo - 1) * 30 * 24 * 60 * 60 * 1000 + Math.random() * 7 * 24 * 60 * 60 * 1000),
                }
            });

            commentsCreated++;

            if (commentsCreated % 100 === 0) {
                console.log(`   Progress: ${commentsCreated} comments created`);
            }

        } catch (err: any) {
            errors.push(`Error on ${char.firstName}: ${err.message}`);
        }
    }

    console.log('\n' + '='.repeat(50));
    console.log('✅ FIX COMPLETE');
    console.log('='.repeat(50));
    console.log(`   Intro posts created: ${introPosts.size}`);
    console.log(`   Comments created: ${commentsCreated}`);
    console.log(`   Errors: ${errors.length}`);

    if (errors.length > 0 && errors.length <= 10) {
        console.log('\n❌ Errors:');
        errors.forEach(e => console.log(`   - ${e}`));
    }

    // Log intro post IDs for reference
    console.log('\n📋 INTRO POST IDs:');
    introPosts.forEach((id, cat) => console.log(`   ${cat}: ${id}`));

    await prisma.$disconnect();
}

fixCommunityStructure().catch(console.error);
