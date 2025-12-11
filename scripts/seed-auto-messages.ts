import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const autoMessages = [
  {
    trigger: "first_login",
    triggerValue: null,
    subject: "Welcome to AccrediPro!",
    content: `Hi {{firstName}}!

Welcome to AccrediPro Academy! I'm so excited to have you here and can't wait to support you on your learning journey.

I'm Sarah, your dedicated coach, and I'll be here every step of the way to help you succeed. Whether you have questions about your courses, need guidance on your career path, or just want to chat - I'm here for you!

Here are a few things to get you started:

1. **Complete Your Profile** - Tell us a bit about yourself so we can personalize your experience
2. **Explore Your Courses** - Dive into your enrolled courses and start learning
3. **Join the Community** - Connect with other students and share your journey
4. **Reach Out Anytime** - Don't hesitate to message me with any questions!

Remember, every expert was once a beginner. You've taken the first step, and that's something to be proud of!

Looking forward to getting to know you better.

Warmly,
Sarah`,
    messageType: "dm",
    isActive: true,
    delayMinutes: 0,
    priority: 10,
  },
  {
    trigger: "enrollment",
    triggerValue: null,
    subject: "Congratulations on Your New Course!",
    content: `Hi {{firstName}}!

Congratulations on enrolling in your new course! This is such an exciting step in your learning journey.

I wanted to reach out personally to let you know I'm here to support you throughout this course. Here are my top tips for success:

1. **Set a regular schedule** - Even 15-30 minutes a day can make a huge difference
2. **Take notes** - Writing things down helps with retention
3. **Practice actively** - Apply what you learn as you go
4. **Ask questions** - No question is too small. I'm here to help!

Don't forget to download the course resources and check out the community discussions for your course.

You've got this!

Cheering you on,
Sarah`,
    messageType: "dm",
    isActive: true,
    delayMinutes: 5,
    priority: 5,
  },
  {
    trigger: "inactive_7d",
    triggerValue: null,
    subject: "We miss you!",
    content: `Hi {{firstName}}!

I noticed it's been a little while since you've logged in, and I just wanted to check in with you.

Life gets busy - I totally understand! But I wanted to remind you that your courses are waiting for you, and so is your supportive community.

Is there anything I can help you with? Sometimes a quick question answered can make all the difference in getting back on track.

Remember: Progress, not perfection. Even just 10 minutes today can help maintain your momentum.

Here when you need me,
Sarah`,
    messageType: "dm",
    isActive: true,
    delayMinutes: 0,
    priority: 3,
  },
  {
    trigger: "course_complete",
    triggerValue: null,
    subject: "You Did It!",
    content: `Hi {{firstName}}!

CONGRATULATIONS!! You did it!

I am SO proud of you for completing your course. This is a huge accomplishment and you should be incredibly proud of yourself.

Your certificate is now available in your dashboard. Don't forget to:

1. **Download your certificate** - You earned it!
2. **Share your achievement** - Post it on LinkedIn or share with friends
3. **Leave a review** - Help others learn about your experience
4. **Explore what's next** - Check out related courses to continue growing

Thank you for trusting AccrediPro with your learning journey. It's been an honor to be part of your growth.

What's next for you? I'd love to hear about your plans!

Celebrating you,
Sarah`,
    messageType: "dm",
    isActive: true,
    delayMinutes: 0,
    priority: 10,
  },
];

async function main() {
  console.log('Seeding auto-messages...');

  // Clear existing auto-messages
  await prisma.autoMessage.deleteMany({});
  console.log('Cleared existing auto-messages');

  for (const message of autoMessages) {
    await prisma.autoMessage.create({
      data: message,
    });
    console.log(`Created auto-message for trigger: ${message.trigger}`);
  }

  console.log(`\nSeeded ${autoMessages.length} auto-messages successfully!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
