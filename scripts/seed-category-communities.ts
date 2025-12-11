import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Categories and their community configurations
const categoryConfigurations = [
  {
    name: "Functional Medicine",
    slug: "functional-medicine",
    description: "Comprehensive training in functional medicine approaches",
    icon: "HeartPulse",
    color: "#DC2626",
    community: {
      name: "Functional Medicine Community",
      description: "Connect with fellow functional medicine students and practitioners. Share insights, ask questions, and celebrate your progress!",
      welcomePost: `Welcome to the Functional Medicine Community!

This is your space to connect with fellow students on their functional medicine journey. Here you can:

- Share your learning experiences and wins
- Ask questions and get support
- Connect with others passionate about functional medicine
- Learn from your coach and peers

Community Guidelines:
- Be supportive and encouraging
- Respect everyone's learning journey
- Keep discussions focused on functional medicine
- No spam or self-promotion

Looking forward to growing together!`,
    },
  },
  {
    name: "Herbalism",
    slug: "herbalism",
    description: "Master the art and science of herbal medicine",
    icon: "Leaf",
    color: "#16A34A",
    community: {
      name: "Herbalism Community",
      description: "A gathering place for herbalism students. Discuss herbs, remedies, and the healing power of plants!",
      welcomePost: `Welcome to the Herbalism Community!

This is a sacred space for those exploring the world of herbal medicine. Here you can:

- Share your herbal discoveries and creations
- Ask about specific herbs and their uses
- Discuss traditional and modern herbalism
- Connect with fellow plant enthusiasts

Community Guidelines:
- Share knowledge generously
- Respect traditional plant wisdom
- Be mindful of safety when discussing remedies
- Support each other's herbal journey

May your path with plants be blessed!`,
    },
  },
  {
    name: "Spiritual Healing",
    slug: "spiritual-healing",
    description: "Explore spiritual approaches to health and wellness",
    icon: "Sparkles",
    color: "#9333EA",
    community: {
      name: "Spiritual Healing Community",
      description: "A mindful community for those exploring spiritual dimensions of healing. Share your journey and insights!",
      welcomePost: `Welcome to the Spiritual Healing Community!

This is a safe, supportive space for exploring spiritual approaches to wellness. Here you can:

- Share spiritual insights and experiences
- Discuss energy healing practices
- Connect with like-minded souls
- Support each other's spiritual growth

Community Guidelines:
- Respect all spiritual paths
- Share with an open heart
- Honor each person's unique journey
- Maintain a loving, supportive atmosphere

Namaste and welcome!`,
    },
  },
  {
    name: "Women's Health",
    slug: "womens-health",
    description: "Specialized training in women's health and wellness",
    icon: "Heart",
    color: "#EC4899",
    community: {
      name: "Women's Health Community",
      description: "A supportive community dedicated to women's health and wellness. Share, learn, and grow together!",
      welcomePost: `Welcome to the Women's Health Community!

This is a nurturing space dedicated to all aspects of women's health and wellness. Here you can:

- Discuss women's health topics openly
- Share experiences and support each other
- Learn about holistic approaches to women's wellness
- Connect with practitioners and students alike

Community Guidelines:
- Create a safe, judgment-free space
- Respect privacy and confidentiality
- Support each other with compassion
- Celebrate women's health journeys

Welcome, sister! We're glad you're here.`,
    },
  },
];

async function main() {
  console.log('Setting up category communities...');

  // Find Sarah coach
  let coach = await prisma.user.findFirst({
    where: {
      OR: [
        { email: "coach@accredipro.com" },
        { email: "sarah@accredipro.com" },
        { role: "MENTOR", firstName: { contains: "Sarah" } },
        { role: "ADMIN" },
      ],
      isActive: true,
    },
    orderBy: { createdAt: "asc" },
    select: { id: true, firstName: true, lastName: true },
  });

  if (!coach) {
    console.log('No coach found, creating Sarah...');
    coach = await prisma.user.create({
      data: {
        email: "coach@accredipro.com",
        firstName: "Sarah",
        lastName: "Mitchell",
        role: "MENTOR",
        isActive: true,
        bio: "Certified holistic health practitioner with 15+ years of experience. Passionate about helping women transform their health through natural approaches.",
      },
      select: { id: true, firstName: true, lastName: true },
    });
  }

  console.log(`Using coach: ${coach.firstName} ${coach.lastName} (${coach.id})`);

  for (const config of categoryConfigurations) {
    // Create or update category
    let category = await prisma.category.findFirst({
      where: {
        OR: [
          { slug: config.slug },
          { name: config.name },
        ],
      },
    });

    if (!category) {
      category = await prisma.category.create({
        data: {
          name: config.name,
          slug: config.slug,
          description: config.description,
          icon: config.icon,
          color: config.color,
          isActive: true,
        },
      });
      console.log(`Created category: ${config.name}`);
    } else {
      await prisma.category.update({
        where: { id: category.id },
        data: {
          description: config.description,
          icon: config.icon,
          color: config.color,
          isActive: true,
        },
      });
      console.log(`Updated category: ${config.name}`);
    }

    // Create or update category community
    let community = await prisma.categoryCommunity.findFirst({
      where: { categoryId: category.id },
    });

    if (!community) {
      community = await prisma.categoryCommunity.create({
        data: {
          categoryId: category.id,
          name: config.community.name,
          description: config.community.description,
          welcomePost: config.community.welcomePost,
          coachId: coach.id,
          isActive: true,
        },
      });
      console.log(`Created community for: ${config.name}`);
    } else {
      await prisma.categoryCommunity.update({
        where: { id: community.id },
        data: {
          name: config.community.name,
          description: config.community.description,
          welcomePost: config.community.welcomePost,
          coachId: coach.id,
          isActive: true,
        },
      });
      console.log(`Updated community for: ${config.name}`);
    }

    // Create welcome post in community (if no posts exist)
    const existingPosts = await prisma.communityPost.count({
      where: { communityId: community.id },
    });

    if (existingPosts === 0) {
      await prisma.communityPost.create({
        data: {
          title: `Welcome to ${config.community.name}!`,
          content: config.community.welcomePost,
          authorId: coach.id,
          communityId: community.id,
          isPinned: true,
        },
      });
      console.log(`Created welcome post for: ${config.name}`);
    }
  }

  console.log('\nCategory communities setup complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
