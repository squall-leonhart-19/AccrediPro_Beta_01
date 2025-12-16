import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import * as fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

interface Question {
  number: number;
  title: string;
  content: string;
  length: "short" | "medium" | "long";
}

interface Reply {
  username: string;
  state: string;
  content: string;
  isSarah: boolean;
}

interface QuestionWithReplies {
  question: Question;
  sarahReply: string;
  studentReplies: Reply[];
}

// Parse questions from the main question files
function parseQuestions(content: string): Question[] {
  const questions: Question[] = [];

  // Split by ### headers which contain question numbers
  const sections = content.split(/### \d+\./);

  for (let i = 1; i < sections.length; i++) {
    const section = sections[i];

    // Extract title from first line after the number
    const lines = section.trim().split('\n');
    const titleLine = lines[0].trim();

    // Get the question number from header match
    const numberMatch = content.match(new RegExp(`### (\\d+)\\..*${titleLine.substring(0, 20).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
    const number = numberMatch ? parseInt(numberMatch[1]) : i;

    // Determine length from title like "(Short)" or "(Long)"
    let length: "short" | "medium" | "long" = "medium";
    if (titleLine.includes("(Short)")) length = "short";
    else if (titleLine.includes("(Long)")) length = "long";
    else if (titleLine.includes("(Medium)")) length = "medium";

    // Clean title
    const title = titleLine.replace(/\(Short\)|\(Long\)|\(Medium\)/gi, '').trim();

    // Find the question content (in bold/quoted format)
    const contentMatch = section.match(/\*\*"([^"]+)"\*\*/);
    const questionContent = contentMatch ? contentMatch[1] : "";

    if (questionContent) {
      questions.push({
        number,
        title,
        content: questionContent,
        length,
      });
    }
  }

  return questions;
}

// Parse replies from the channel files with replies
function parseRepliesFile(content: string): Map<number, QuestionWithReplies> {
  const questionsMap = new Map<number, QuestionWithReplies>();

  // Split by QUESTION headers
  const sections = content.split(/# QUESTION (\d+):/);

  for (let i = 1; i < sections.length; i += 2) {
    const questionNum = parseInt(sections[i]);
    const sectionContent = sections[i + 1];

    if (!sectionContent) continue;

    // Extract original question title
    const originalMatch = sectionContent.match(/\*\*Original:\*\*\s*\*"([^"]+)"\*/);
    const originalQuestion = originalMatch ? originalMatch[1] : "";

    // Extract Sarah's reply
    const sarahMatch = sectionContent.match(/### 💛 Sarah M \(Coach\) Reply:\s*([\s\S]*?)(?=---|\n### 👥)/);
    let sarahReply = "";
    if (sarahMatch) {
      sarahReply = sarahMatch[1]
        .replace(/\*\*/g, '')
        .replace(/💛/g, '')
        .trim();
    }

    // Extract student replies
    const studentReplies: Reply[] = [];
    const studentSection = sectionContent.match(/### 👥 Student Replies:([\s\S]*?)(?=\n---\n|# QUESTION|$)/);

    if (studentSection) {
      // Match patterns like **Maria R. (AZ):**\n"comment"
      const replyMatches = studentSection[1].matchAll(/\*\*([^(]+)\s*\(([^)]+)\):\*\*\s*\n"?([^"*\n]+(?:\n[^"*\n]+)*)"?/g);

      for (const match of replyMatches) {
        const fullName = match[1].trim();
        const state = match[2].trim();
        const replyContent = match[3].trim().replace(/^"|"$/g, '');

        if (fullName && replyContent) {
          studentReplies.push({
            username: fullName,
            state,
            content: replyContent,
            isSarah: false,
          });
        }
      }
    }

    // Get title from section
    const titleMatch = sectionContent.match(/# .*?:\s*(.+?)\n/);
    const title = titleMatch ? titleMatch[1].trim() : `Question ${questionNum}`;

    questionsMap.set(questionNum, {
      question: {
        number: questionNum,
        title,
        content: originalQuestion,
        length: originalQuestion.length > 300 ? "long" : originalQuestion.length > 100 ? "medium" : "short",
      },
      sarahReply,
      studentReplies,
    });
  }

  return questionsMap;
}

async function main() {
  console.log("Starting community channels import...\n");

  // Read the reply files (they contain both questions and replies)
  const channel1Path = path.join(__dirname, "../FM/COMMUNITY/channel1_questions_and_replies.md");
  const channel2Path = path.join(__dirname, "../FM/COMMUNITY/channel2_questions_and_replies_part1.md");

  const channel1Content = fs.readFileSync(channel1Path, "utf-8");
  const channel2Content = fs.readFileSync(channel2Path, "utf-8");

  // Parse the content
  const channel1Data = parseRepliesFile(channel1Content);
  const channel2Data = parseRepliesFile(channel2Content);

  console.log(`Parsed ${channel1Data.size} questions from Channel 1 (Questions Everyone Has)`);
  console.log(`Parsed ${channel2Data.size} questions from Channel 2 (Career Pathway)`);

  // Get admin user (Sarah's replies come from admin)
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (!admin) {
    console.error("Admin user not found!");
    return;
  }

  console.log(`\nUsing admin: ${admin.firstName} ${admin.lastName}`);

  // Get zombie profiles for question posters and commenters
  const zombies = await prisma.user.findMany({
    where: {
      isFakeProfile: true,
      avatar: { contains: "accredipro.academy" },
    },
    take: 500,
  });

  console.log(`Found ${zombies.length} zombie profiles`);

  // Create a map of zombies by first name for matching
  const zombiesByName = new Map<string, typeof zombies[0]>();
  for (const zombie of zombies) {
    if (zombie.firstName) {
      const key = zombie.firstName.toLowerCase();
      if (!zombiesByName.has(key)) {
        zombiesByName.set(key, zombie);
      }
    }
  }

  // Delete existing posts in these categories
  const deletedChannel1 = await prisma.communityPost.deleteMany({
    where: { categoryId: "questions-everyone-has" },
  });
  const deletedChannel2 = await prisma.communityPost.deleteMany({
    where: { categoryId: "career-pathway" },
  });
  console.log(`Deleted ${deletedChannel1.count} existing questions-everyone-has posts`);
  console.log(`Deleted ${deletedChannel2.count} existing career-pathway posts`);

  // Date range: Aug 17, 2025 to Dec 15, 2025
  const startDate = new Date("2025-08-17T08:00:00");
  const endDate = new Date("2025-12-15T20:00:00");
  const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

  let totalPosts = 0;
  let totalComments = 0;
  let totalLikes = 0;

  // Helper function to import a channel
  async function importChannel(
    channelData: Map<number, QuestionWithReplies>,
    categoryId: string,
    categoryName: string
  ) {
    const questions = Array.from(channelData.values());
    console.log(`\nImporting ${questions.length} questions to ${categoryName}...`);

    for (let i = 0; i < questions.length; i++) {
      const data = questions[i];
      const { question, sarahReply, studentReplies } = data;

      // Calculate date (spread evenly, newest first)
      const questionIndex = questions.length - i - 1;
      const daysFromEnd = Math.floor((questionIndex / Math.max(questions.length - 1, 1)) * totalDays);
      const postDate = new Date(endDate.getTime() - daysFromEnd * 24 * 60 * 60 * 1000);
      postDate.setHours(8 + Math.floor(Math.random() * 12));
      postDate.setMinutes(Math.floor(Math.random() * 60));

      // Find a zombie to post the question
      const shuffledZombies = [...zombies].sort(() => Math.random() - 0.5);
      const posterZombie = shuffledZombies[0];

      // Create the post (question)
      const post = await prisma.communityPost.create({
        data: {
          title: question.content.length > 80
            ? question.content.substring(0, 80) + "..."
            : question.content,
          content: question.content,
          authorId: posterZombie.id,
          categoryId,
          isPinned: question.number <= 3 && categoryId === "questions-everyone-has", // Pin first 3 in channel 1
          viewCount: 80 + Math.floor(Math.random() * 300),
          likeCount: 0,
          createdAt: postDate,
          updatedAt: postDate,
        },
      });

      totalPosts++;

      // Add likes to the post
      const likeCount = 10 + Math.floor(Math.random() * 20);
      for (let j = 0; j < Math.min(likeCount, shuffledZombies.length); j++) {
        const likeDate = new Date(postDate.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000);
        try {
          await prisma.postLike.create({
            data: {
              postId: post.id,
              userId: shuffledZombies[j].id,
              createdAt: likeDate,
            },
          });
          totalLikes++;
        } catch (e) {
          // Skip duplicate likes
        }
      }

      // Update like count
      await prisma.communityPost.update({
        where: { id: post.id },
        data: { likeCount },
      });

      // Add Sarah's reply first (as a comment)
      if (sarahReply) {
        const sarahCommentDate = new Date(postDate.getTime() + 30 * 60 * 1000 + Math.random() * 60 * 60 * 1000);
        await prisma.postComment.create({
          data: {
            postId: post.id,
            authorId: admin.id,
            content: sarahReply,
            likeCount: 5 + Math.floor(Math.random() * 15),
            createdAt: sarahCommentDate,
            updatedAt: sarahCommentDate,
          },
        });
        totalComments++;
      }

      // Add student replies as comments
      const usedZombieIds = new Set<string>();
      for (let j = 0; j < studentReplies.length; j++) {
        const reply = studentReplies[j];

        // Try to find a matching zombie by first name, or use a random one
        const firstName = reply.username.split(' ')[0].toLowerCase();
        let commentZombie = zombiesByName.get(firstName);

        // If no match or already used, pick a random unused zombie
        if (!commentZombie || usedZombieIds.has(commentZombie.id)) {
          const availableZombies = shuffledZombies.filter(z => !usedZombieIds.has(z.id));
          if (availableZombies.length > 0) {
            commentZombie = availableZombies[j % availableZombies.length];
          } else {
            commentZombie = shuffledZombies[j % shuffledZombies.length];
          }
        }

        usedZombieIds.add(commentZombie.id);

        // Comment date is after Sarah's reply
        const commentDate = new Date(postDate.getTime() + (j + 2) * 45 * 60 * 1000 + Math.random() * 12 * 60 * 60 * 1000);

        await prisma.postComment.create({
          data: {
            postId: post.id,
            authorId: commentZombie.id,
            content: reply.content,
            likeCount: Math.floor(Math.random() * 8),
            createdAt: commentDate,
            updatedAt: commentDate,
          },
        });

        totalComments++;
      }

      if ((i + 1) % 5 === 0) {
        console.log(`  Created ${i + 1}/${questions.length} posts...`);
      }
    }
  }

  // Import both channels
  await importChannel(channel1Data, "questions-everyone-has", "Questions Everyone Has");
  await importChannel(channel2Data, "career-pathway", "Career Pathway & Next Steps");

  console.log(`\n✅ Import complete!`);
  console.log(`   - ${totalPosts} question posts`);
  console.log(`   - ${totalComments} comments (including Sarah's replies)`);
  console.log(`   - ${totalLikes} likes`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
