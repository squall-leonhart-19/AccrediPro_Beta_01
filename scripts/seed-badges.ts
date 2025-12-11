import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const badges = [
  {
    name: "First Step",
    slug: "first_step",
    description: "Completed your first lesson",
    icon: "🎯",
    color: "#10B981", // green
    criteria: "Complete your first lesson",
    points: 25,
  },
  {
    name: "Module Master",
    slug: "module_master",
    description: "Completed an entire module",
    icon: "📚",
    color: "#6366F1", // indigo
    criteria: "Complete all lessons in a module",
    points: 50,
  },
  {
    name: "Course Graduate",
    slug: "course_graduate",
    description: "Completed an entire course",
    icon: "🎓",
    color: "#8B5CF6", // purple
    criteria: "Complete all lessons in a course",
    points: 200,
  },
  {
    name: "Week Warrior",
    slug: "week_warrior",
    description: "Maintained a 7-day learning streak",
    icon: "🔥",
    color: "#F59E0B", // amber
    criteria: "Learn for 7 consecutive days",
    points: 75,
  },
  {
    name: "Monthly Master",
    slug: "monthly_master",
    description: "Maintained a 30-day learning streak",
    icon: "⭐",
    color: "#EC4899", // pink
    criteria: "Learn for 30 consecutive days",
    points: 300,
  },
  {
    name: "Community Champion",
    slug: "community_champion",
    description: "Active community member",
    icon: "💬",
    color: "#3B82F6", // blue
    criteria: "Post 10+ comments in the community",
    points: 50,
  },
  {
    name: "Helpful Hero",
    slug: "helpful_hero",
    description: "Helped others in the community",
    icon: "🤝",
    color: "#14B8A6", // teal
    criteria: "Receive 25+ likes on your comments",
    points: 75,
  },
  {
    name: "Early Bird",
    slug: "early_bird",
    description: "One of the first members",
    icon: "🐦",
    color: "#F97316", // orange
    criteria: "Joined within the first 100 members",
    points: 100,
  },
  {
    name: "Knowledge Seeker",
    slug: "knowledge_seeker",
    description: "Enrolled in 3+ courses",
    icon: "🔍",
    color: "#22C55E", // green
    criteria: "Enroll in at least 3 courses",
    points: 50,
  },
  {
    name: "Speed Learner",
    slug: "speed_learner",
    description: "Completed a course in record time",
    icon: "⚡",
    color: "#EAB308", // yellow
    criteria: "Complete a course within 7 days",
    points: 100,
  },
  {
    name: "Perfect Score",
    slug: "perfect_score",
    description: "Achieved 100% on a quiz",
    icon: "💯",
    color: "#EF4444", // red
    criteria: "Get a perfect score on any quiz",
    points: 50,
  },
  {
    name: "Rising Star",
    slug: "rising_star",
    description: "Completed 25% of your first course",
    icon: "🌟",
    color: "#A855F7", // purple
    criteria: "Reach 25% progress in your first course",
    points: 25,
  },
  {
    name: "Halfway Hero",
    slug: "halfway_hero",
    description: "Completed 50% of a course",
    icon: "🌠",
    color: "#06B6D4", // cyan
    criteria: "Reach 50% progress in any course",
    points: 50,
  },
  {
    name: "Almost There",
    slug: "almost_there",
    description: "Completed 75% of a course",
    icon: "🔥",
    color: "#F43F5E", // rose
    criteria: "Reach 75% progress in any course",
    points: 75,
  },
  {
    name: "Certified Professional",
    slug: "certified_professional",
    description: "Earned your first certificate",
    icon: "📜",
    color: "#84CC16", // lime
    criteria: "Receive your first course certificate",
    points: 150,
  },
];

async function main() {
  console.log('Seeding badges...');

  // Delete existing badges first
  await prisma.userBadge.deleteMany({});
  await prisma.badge.deleteMany({});
  console.log('Cleared existing badges');

  for (const badge of badges) {
    await prisma.badge.create({
      data: badge,
    });
    console.log(`Created badge: ${badge.name}`);
  }

  console.log(`\nSeeded ${badges.length} badges successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
