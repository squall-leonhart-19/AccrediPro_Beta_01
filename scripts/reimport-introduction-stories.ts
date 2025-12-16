import prisma from "../src/lib/prisma";
import * as fs from "fs";
import * as path from "path";

async function reimportIntroductionStories() {
  console.log("Starting reimport of introduction stories from buyerqualification.csv...");

  // First, delete all existing introduction posts
  const deleted = await prisma.communityPost.deleteMany({
    where: { categoryId: "introductions" },
  });
  console.log(`Deleted ${deleted.count} existing introduction posts`);

  // Read and parse the CSV file
  const csvPath = path.join(process.cwd(), "buyerqualification.csv");
  const csvContent = fs.readFileSync(csvPath, "utf-8");
  const lines = csvContent.split("\n");

  // Skip header
  const dataLines = lines.slice(1).filter(line => line.trim());

  // Get fake profiles to use as authors
  const fakeProfiles = await prisma.user.findMany({
    where: { isFakeProfile: true },
    select: { id: true, firstName: true, lastName: true },
    take: 200,
  });

  if (fakeProfiles.length === 0) {
    console.error("No fake profiles found!");
    return;
  }

  console.log(`Found ${fakeProfiles.length} fake profiles`);
  console.log(`Processing ${dataLines.length} stories from CSV...`);

  // Sarah comment templates for introductions
  const SARAH_COMMENTS = [
    "Welcome to the community, {name}! Your story is so inspiring. I'm honored you chose to share your journey with us. You're going to do amazing things here!",
    "{name}, thank you for being so open and vulnerable. Your background and passion for helping others is exactly what this community needs. We're so glad you're here!",
    "What an incredible journey, {name}! I can already tell you're going to thrive here. Looking forward to supporting you every step of the way!",
    "{name}, your story gave me chills! The dedication you have to helping others is remarkable. Welcome to the family!",
    "So happy to have you here, {name}! Your experience and heart for healing is going to make such a difference. Can't wait to see your transformation!",
  ];

  // Member comment templates
  const MEMBER_COMMENTS = [
    "Welcome! So glad you're here!",
    "Your story resonates with me so much! Looking forward to learning together.",
    "Amazing journey! Welcome to the community!",
    "So inspiring! Can't wait to connect with you!",
    "Welcome, welcome! This community is incredible, you're going to love it!",
    "Your story is beautiful! So glad you took this leap!",
    "I can relate to so much of this! Welcome!",
    "So excited to have you here! Great things ahead!",
  ];

  let created = 0;
  let skipped = 0;

  // Get Sarah's profile for comments
  const sarah = await prisma.user.findFirst({
    where: { email: "sarah@accredipro-certificate.com" },
    select: { id: true },
  });

  for (let i = 0; i < dataLines.length; i++) {
    const line = dataLines[i];

    // Parse CSV - columns are separated by semicolon
    const parts = line.split(";");
    if (parts.length < 3) {
      skipped++;
      continue;
    }

    const firstName = parts[0].trim();
    const lastName = parts[1].trim();
    let story = parts.slice(2).join(";").trim(); // Join in case story has semicolons

    // Clean up the story - remove quotes if wrapped
    if (story.startsWith('"') && story.endsWith('"')) {
      story = story.slice(1, -1);
    }
    story = story.replace(/^"|"$/g, "").trim();

    // Skip empty or very short stories
    if (!story || story.length < 10 || story === "." || story === "Further education") {
      skipped++;
      continue;
    }

    // Find a matching fake profile or use a random one
    let author = fakeProfiles.find(
      p => p.firstName?.toLowerCase() === firstName.toLowerCase()
    );
    if (!author) {
      author = fakeProfiles[i % fakeProfiles.length];
    }

    // Create introduction post title
    const titles = [
      `Hey everyone! My name is ${firstName} and I'm so excited to be here!`,
      `Hi! I'm ${firstName} - Here's my story`,
      `${firstName} here - excited to join this community!`,
      `Hello from ${firstName}! 🙋‍♀️`,
      `Introducing myself - ${firstName}'s journey`,
      `New member here! I'm ${firstName}`,
      `So happy to be here! - ${firstName}`,
      `My story and why I'm here - ${firstName}`,
    ];
    const title = titles[i % titles.length];

    // Format the story content as HTML
    const content = `<p>${story.replace(/\n\n/g, "</p><p>").replace(/\n/g, "<br/>")}</p>`;

    // Generate random date in last 6 months
    const randomDaysAgo = Math.floor(Math.random() * 180);
    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - randomDaysAgo);

    // Generate reactions
    const reactions = {
      "❤️": Math.floor(Math.random() * 80) + 40,
      "🔥": Math.floor(Math.random() * 50) + 20,
      "👏": Math.floor(Math.random() * 60) + 30,
      "💯": Math.floor(Math.random() * 30) + 10,
      "🎉": Math.floor(Math.random() * 40) + 15,
      "💪": Math.floor(Math.random() * 25) + 10,
      "⭐": Math.floor(Math.random() * 20) + 5,
      "🙌": Math.floor(Math.random() * 15) + 5,
    };
    const totalLikes = Object.values(reactions).reduce((sum, count) => sum + count, 0);

    try {
      // Create the post
      const post = await prisma.communityPost.create({
        data: {
          title,
          content,
          categoryId: "introductions",
          authorId: author.id,
          isPinned: false,
          viewCount: Math.floor(Math.random() * 300) + 100,
          likeCount: totalLikes,
          reactions: reactions,
          createdAt,
        },
      });

      // Add Sarah's comment (60% chance)
      if (sarah && Math.random() < 0.6) {
        const sarahComment = SARAH_COMMENTS[Math.floor(Math.random() * SARAH_COMMENTS.length)]
          .replace("{name}", firstName);

        const commentDate = new Date(createdAt);
        commentDate.setHours(commentDate.getHours() + Math.floor(Math.random() * 24) + 1);

        await prisma.postComment.create({
          data: {
            content: sarahComment,
            postId: post.id,
            authorId: sarah.id,
            createdAt: commentDate,
            likeCount: Math.floor(Math.random() * 20) + 5,
          },
        });
      }

      // Add 1-4 member comments (80% chance)
      if (Math.random() < 0.8) {
        const numComments = Math.floor(Math.random() * 4) + 1;
        for (let c = 0; c < numComments; c++) {
          const commenter = fakeProfiles[Math.floor(Math.random() * fakeProfiles.length)];
          const commentContent = MEMBER_COMMENTS[Math.floor(Math.random() * MEMBER_COMMENTS.length)];

          const commentDate = new Date(createdAt);
          commentDate.setHours(commentDate.getHours() + Math.floor(Math.random() * 72) + 2);

          await prisma.postComment.create({
            data: {
              content: commentContent,
              postId: post.id,
              authorId: commenter.id,
              createdAt: commentDate,
              likeCount: Math.floor(Math.random() * 10) + 1,
            },
          });
        }
      }

      created++;
      if (created % 25 === 0) {
        console.log(`Created ${created} introduction posts...`);
      }
    } catch (error) {
      console.error(`Error creating post for ${firstName}:`, error);
      skipped++;
    }
  }

  console.log(`\n✅ Done! Created ${created} introduction posts, skipped ${skipped}`);
}

reimportIntroductionStories()
  .catch((error) => {
    console.error("Error:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
