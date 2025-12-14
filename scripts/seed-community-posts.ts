/**
 * Seed Script: Migrate static community posts and comments to database
 *
 * This script:
 * 1. Creates fake user profiles for comment authors (isFakeProfile: true)
 * 2. Creates Coach Sarah as MENTOR
 * 3. Creates all static community posts in the database
 * 4. Imports all comments from refined_comments.json
 *
 * Run with: npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/seed-community-posts.ts
 */

import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

// Prisma 7 requires driver adapters
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Read the refined comments JSON
const refinedCommentsPath = path.join(process.cwd(), 'refined_comments.json');
const refinedComments = JSON.parse(fs.readFileSync(refinedCommentsPath, 'utf-8'));

// Static post data
const STATIC_POSTS = [
  {
    id: 'pinned-introductions',
    title: '👋 Welcome! Introduce Yourself Here',
    content: `<p>Welcome to our amazing community of future Functional Medicine Practitioners! 🌟</p>
<p>This is YOUR space to connect, share, and grow together. We'd love to get to know you!</p>
<p><strong>Share a bit about yourself:</strong></p>
<ul>
<li>Where are you from?</li>
<li>What's your background? (nursing, teaching, corporate, stay-at-home parent, etc.)</li>
<li>What drew you to Functional Medicine?</li>
<li>What's your biggest goal for this year?</li>
</ul>
<p>Don't be shy - we're all here to support each other on this incredible journey! 💕</p>
<p><em>P.S. Make sure to welcome others who introduce themselves. A simple "Welcome!" can make someone's day!</em></p>`,
    category: 'introductions',
    isPinned: true,
    viewCount: 15847,
    authorId: 'coach-sarah', // Will be replaced with actual ID
  },
  {
    id: 'official-graduation-thread',
    title: '🎓 Officially Certified? Share Your Graduation News Here!',
    content: `<p>To our newest Certified Functional Medicine Practitioners:</p>
<p><strong>CONGRATULATIONS!</strong> 🎉</p>
<p>You have put in the hours, mastered the material, and proven your dedication to transforming healthcare. We are incredibly proud of you.</p>
<p>This thread is dedicated to celebrating YOUR achievement. Share:</p>
<ul>
<li>📸 Your certificate photo</li>
<li>🎯 Your next steps</li>
<li>💡 Advice for those still on their journey</li>
<li>🙏 Who supported you along the way</li>
</ul>
<p>Let's celebrate together! 🎊</p>`,
    category: 'graduates',
    isPinned: true,
    viewCount: 8934,
    authorId: 'coach-sarah',
  },
];

// Tips posts content (30 posts)
const TIPS_POSTS = [
  { id: 'tips-daily-1', title: '💡 Daily Tip #1: The Power of Morning Routines', content: 'Start your day with intention. A consistent morning routine sets the tone for success in your practice and personal life.', date: new Date('2025-11-14') },
  { id: 'tips-daily-2', title: '💡 Daily Tip #2: Active Listening is Your Superpower', content: 'Your clients need to feel heard. Practice active listening - it builds trust faster than any certification.', date: new Date('2025-11-15') },
  { id: 'tips-daily-3', title: '💡 Daily Tip #3: Document Everything', content: 'Keep detailed notes on every client interaction. Future you will thank present you.', date: new Date('2025-11-16') },
  { id: 'tips-daily-4', title: '💡 Daily Tip #4: Boundaries Create Freedom', content: 'Set clear boundaries with clients from day one. It protects your energy and their expectations.', date: new Date('2025-11-17') },
  { id: 'tips-daily-5', title: '💡 Daily Tip #5: Progress Over Perfection', content: 'Don\'t wait until you feel "ready". Start helping people now and improve as you go.', date: new Date('2025-11-18') },
  { id: 'tips-daily-6', title: '💡 Daily Tip #6: Your Story is Your Strength', content: 'Your personal health journey is what makes you relatable. Share it authentically.', date: new Date('2025-11-19') },
  { id: 'tips-daily-7', title: '💡 Daily Tip #7: Invest in Continuing Education', content: 'The best practitioners never stop learning. Stay curious and keep growing.', date: new Date('2025-11-20') },
  { id: 'tips-daily-8', title: '💡 Daily Tip #8: Build Systems Early', content: 'Create templates, workflows, and processes. Systems free you to focus on what matters - your clients.', date: new Date('2025-11-21') },
  { id: 'tips-daily-9', title: '💡 Daily Tip #9: Celebrate Small Wins', content: 'Every client success, no matter how small, deserves recognition. Celebrate progress!', date: new Date('2025-11-22') },
  { id: 'tips-daily-10', title: '💡 Daily Tip #10: Network with Other Practitioners', content: 'Collaboration over competition. Build relationships with others in your field.', date: new Date('2025-11-23') },
  { id: 'tips-daily-11', title: '💡 Daily Tip #11: Self-Care Isn\'t Selfish', content: 'You can\'t pour from an empty cup. Prioritize your own health and wellness.', date: new Date('2025-11-24') },
  { id: 'tips-daily-12', title: '💡 Daily Tip #12: Simplify Your Message', content: 'Speak in terms your clients understand. Avoid jargon - clarity creates confidence.', date: new Date('2025-11-25') },
  { id: 'tips-daily-13', title: '💡 Daily Tip #13: Follow Up is Everything', content: 'The fortune is in the follow-up. Check in with past clients - it shows you care.', date: new Date('2025-11-26') },
  { id: 'tips-daily-14', title: '💡 Daily Tip #14: Embrace Technology', content: 'Use tools that save you time. Automation is your friend, not your enemy.', date: new Date('2025-11-27') },
  { id: 'tips-daily-15', title: '💡 Daily Tip #15: Know Your Numbers', content: 'Track your business metrics. What gets measured gets improved.', date: new Date('2025-11-28') },
  { id: 'tips-daily-16', title: '💡 Daily Tip #16: Create Content That Helps', content: 'Share valuable content regularly. Position yourself as the expert you are.', date: new Date('2025-11-29') },
  { id: 'tips-daily-17', title: '💡 Daily Tip #17: Ask for Testimonials', content: 'Happy clients are your best marketing. Don\'t be shy about asking for reviews.', date: new Date('2025-11-30') },
  { id: 'tips-daily-18', title: '💡 Daily Tip #18: Set Realistic Expectations', content: 'Under-promise and over-deliver. Realistic expectations lead to satisfied clients.', date: new Date('2025-12-01') },
  { id: 'tips-daily-19', title: '💡 Daily Tip #19: Stay Organized', content: 'A cluttered space equals a cluttered mind. Keep your workspace and systems tidy.', date: new Date('2025-12-02') },
  { id: 'tips-daily-20', title: '💡 Daily Tip #20: Practice Gratitude Daily', content: 'Start or end each day noting what you\'re grateful for. It transforms your perspective.', date: new Date('2025-12-03') },
  { id: 'tips-daily-21', title: '💡 Daily Tip #21: Learn to Say No', content: 'Not every client is your ideal client. It\'s okay to refer out when needed.', date: new Date('2025-12-04') },
  { id: 'tips-daily-22', title: '💡 Daily Tip #22: Batch Similar Tasks', content: 'Group similar activities together. Batching increases efficiency and reduces mental fatigue.', date: new Date('2025-12-05') },
  { id: 'tips-daily-23', title: '💡 Daily Tip #23: Pricing Reflects Value', content: 'Don\'t undercharge. Your pricing communicates the value of your expertise.', date: new Date('2025-12-06') },
  { id: 'tips-daily-24', title: '💡 Daily Tip #24: Rest is Productive', content: 'Taking breaks isn\'t lazy - it\'s strategic. Rest allows for greater creativity and focus.', date: new Date('2025-12-07') },
  { id: 'tips-daily-25', title: '💡 Daily Tip #25: Focus on Root Causes', content: 'Symptoms are clues, not destinations. Always dig deeper to find the root cause.', date: new Date('2025-12-08') },
  { id: 'tips-daily-26', title: '💡 Daily Tip #26: Build Your Email List', content: 'Social media followers are rented. Email subscribers are owned. Build your list!', date: new Date('2025-12-09') },
  { id: 'tips-daily-27', title: '💡 Daily Tip #27: Imposter Syndrome is Normal', content: 'Every successful practitioner has felt like a fraud at some point. Push through it.', date: new Date('2025-12-10') },
  { id: 'tips-daily-28', title: '💡 Daily Tip #28: Consistency Beats Intensity', content: 'Small daily actions compound over time. Consistency always wins long-term.', date: new Date('2025-12-11') },
  { id: 'tips-daily-29', title: '💡 Daily Tip #29: Your Energy is Contagious', content: 'Clients pick up on your energy. Show up with enthusiasm and positive intentions.', date: new Date('2025-12-12') },
  { id: 'tips-daily-30', title: '💡 Daily Tip #30: Remember Your Why', content: 'On hard days, reconnect with why you started this journey. Your purpose is your fuel.', date: new Date('2025-12-13') },
];

async function main() {
  console.log('🚀 Starting community posts migration...\n');

  // Step 1: Create or get Coach Sarah
  console.log('👩‍⚕️ Creating Coach Sarah...');
  let coachSarah = await prisma.user.findFirst({
    where: {
      OR: [
        { email: 'sarah@accredipro.com' },
        { firstName: 'Sarah', lastName: 'M.', role: 'MENTOR' }
      ]
    }
  });

  if (!coachSarah) {
    coachSarah = await prisma.user.create({
      data: {
        email: 'sarah@accredipro.com',
        firstName: 'Sarah',
        lastName: 'M.',
        avatar: '/coaches/sarah-coach.webp',
        role: 'MENTOR',
        isFakeProfile: false,
        isActive: true,
      }
    });
    console.log('  ✅ Coach Sarah created:', coachSarah.id);
  } else {
    console.log('  ✅ Coach Sarah already exists:', coachSarah.id);
  }

  // Step 2: Create fake user profiles for all comment authors
  console.log('\n👥 Creating fake user profiles for comment authors...');
  const userMap = new Map<string, string>(); // oldId -> newId
  userMap.set('coach-sarah', coachSarah.id);

  const comments = refinedComments['pinned-introductions'] || [];

  for (const comment of comments) {
    const author = comment.author;
    if (!author || userMap.has(author.id)) continue;

    // Check if user already exists with this fake profile
    const existingUser = await prisma.user.findFirst({
      where: {
        firstName: author.firstName?.trim(),
        lastName: author.lastName?.trim(),
        isFakeProfile: true,
      }
    });

    if (existingUser) {
      userMap.set(author.id, existingUser.id);
      continue;
    }

    // Create new fake user
    const newUser = await prisma.user.create({
      data: {
        firstName: author.firstName?.trim() || 'Anonymous',
        lastName: author.lastName?.trim() || '',
        avatar: author.avatar,
        role: author.role === 'MENTOR' ? 'MENTOR' : 'STUDENT',
        isFakeProfile: true,
        isActive: true,
      }
    });
    userMap.set(author.id, newUser.id);

    // Also handle reply authors
    if (comment.replies) {
      for (const reply of comment.replies) {
        if (reply.author && !userMap.has(reply.author.id)) {
          if (reply.author.id === 'coach-sarah') {
            userMap.set(reply.author.id, coachSarah.id);
          } else {
            const existingReplyUser = await prisma.user.findFirst({
              where: {
                firstName: reply.author.firstName?.trim(),
                lastName: reply.author.lastName?.trim(),
                isFakeProfile: true,
              }
            });

            if (existingReplyUser) {
              userMap.set(reply.author.id, existingReplyUser.id);
            } else {
              const newReplyUser = await prisma.user.create({
                data: {
                  firstName: reply.author.firstName?.trim() || 'Anonymous',
                  lastName: reply.author.lastName?.trim() || '',
                  avatar: reply.author.avatar,
                  role: reply.author.role === 'MENTOR' ? 'MENTOR' : 'STUDENT',
                  isFakeProfile: true,
                  isActive: true,
                }
              });
              userMap.set(reply.author.id, newReplyUser.id);
            }
          }
        }
      }
    }
  }
  console.log(`  ✅ Created ${userMap.size} user profiles`);

  // Step 3: Create the pinned-introductions post
  console.log('\n📝 Creating pinned-introductions post...');

  // Delete existing post if it exists (to avoid duplicates)
  await prisma.communityPost.deleteMany({
    where: { id: { startsWith: 'static-' } }
  });

  const introPost = await prisma.communityPost.create({
    data: {
      title: '👋 Welcome! Introduce Yourself Here',
      content: STATIC_POSTS[0].content,
      categoryId: 'introductions',
      isPinned: true,
      viewCount: 15847,
      authorId: coachSarah.id,
    }
  });
  console.log('  ✅ Created pinned-introductions post:', introPost.id);

  // Step 4: Import all comments
  console.log('\n💬 Importing comments...');
  let commentCount = 0;
  let replyCount = 0;
  const commentIdMap = new Map<string, string>(); // oldCommentId -> newCommentId

  for (const comment of comments) {
    const authorId = userMap.get(comment.author?.id) || coachSarah.id;

    try {
      const newComment = await prisma.postComment.create({
        data: {
          content: comment.content,
          postId: introPost.id,
          authorId: authorId,
          likeCount: comment.likeCount || 0,
          createdAt: new Date(comment.createdAt),
        }
      });
      commentIdMap.set(comment.id, newComment.id);
      commentCount++;

      // Import replies
      if (comment.replies && comment.replies.length > 0) {
        for (const reply of comment.replies) {
          const replyAuthorId = userMap.get(reply.author?.id) || coachSarah.id;

          await prisma.postComment.create({
            data: {
              content: reply.content,
              postId: introPost.id,
              authorId: replyAuthorId,
              parentId: newComment.id,
              likeCount: reply.likeCount || 0,
              createdAt: new Date(reply.createdAt),
            }
          });
          replyCount++;
        }
      }
    } catch (error) {
      console.error(`  ❌ Error creating comment ${comment.id}:`, error);
    }
  }
  console.log(`  ✅ Imported ${commentCount} comments and ${replyCount} replies`);

  // Step 5: Create graduation thread post
  console.log('\n📝 Creating graduation thread post...');
  const gradPost = await prisma.communityPost.create({
    data: {
      title: '🎓 Officially Certified? Share Your Graduation News Here!',
      content: STATIC_POSTS[1].content,
      categoryId: 'graduates',
      isPinned: true,
      viewCount: 8934,
      authorId: coachSarah.id,
    }
  });
  console.log('  ✅ Created graduation thread post:', gradPost.id);

  // Step 6: Create tips posts
  console.log('\n📝 Creating 30 tips posts...');
  for (const tip of TIPS_POSTS) {
    await prisma.communityPost.create({
      data: {
        title: tip.title,
        content: `<p>${tip.content}</p>`,
        categoryId: 'tips',
        isPinned: false,
        viewCount: 5000 + Math.floor(Math.random() * 5000),
        authorId: coachSarah.id,
        createdAt: tip.date,
      }
    });
  }
  console.log('  ✅ Created 30 tips posts');

  // Output summary
  console.log('\n' + '='.repeat(50));
  console.log('✅ Migration Complete!');
  console.log('='.repeat(50));
  console.log(`📝 Posts created: ${2 + TIPS_POSTS.length}`);
  console.log(`💬 Comments imported: ${commentCount}`);
  console.log(`↩️ Replies imported: ${replyCount}`);
  console.log(`👥 Fake profiles created: ${userMap.size - 1}`);
  console.log('\n📌 Important Post IDs:');
  console.log(`  - Pinned Introductions: ${introPost.id}`);
  console.log(`  - Graduation Thread: ${gradPost.id}`);
  console.log('\n⚠️ Update your page routes to use these new database IDs!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
