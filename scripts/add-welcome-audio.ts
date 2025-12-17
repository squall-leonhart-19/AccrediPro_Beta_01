/**
 * Generate Welcome Audio for Mini Diploma
 * 
 * Creates a short Sarah welcome audio and saves it to public/audio/
 * Then updates the welcome lesson to include the audio player
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { generateSarahVoice } from "../src/lib/elevenlabs";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load both .env and .env.local (priority to .env.local)
dotenv.config({ path: ".env" });
dotenv.config({ path: ".env.local", override: true });

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Super short welcome script (~15 seconds)
const WELCOME_SCRIPT = `Hey! It's Sarah here. Welcome to your Mini Diploma! I'm so excited you're taking this step. Let's dive in!`;

// Updated welcome content with audio player at the top
const WELCOME_LESSON_CONTENT_WITH_AUDIO = (audioUrl: string) => `
<div style="max-width: 800px; margin: 0 auto; font-family: system-ui, -apple-system, sans-serif;">
  <!-- Audio Player Section -->
  <div style="background: linear-gradient(135deg, #FBF4F4 0%, #fff 100%); border: 2px solid #722F37; border-radius: 16px; padding: 24px; margin-bottom: 24px; text-align: center;">
    <div style="display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 12px;">
      <img src="https://iili.io/3kGDUes.webp" alt="Sarah" style="width: 56px; height: 56px; border-radius: 50%; border: 3px solid #722F37; object-fit: cover;" />
      <div style="text-align: left;">
        <p style="margin: 0; font-weight: 700; color: #722F37; font-size: 16px;">A message from Sarah</p>
        <p style="margin: 0; color: #666; font-size: 13px;">Your Instructor</p>
      </div>
    </div>
    <audio controls style="width: 100%; max-width: 400px; margin: 0 auto;">
      <source src="${audioUrl}" type="audio/mpeg">
      Your browser does not support the audio element.
    </audio>
  </div>

  <!-- Hero Section - WHITE background -->
  <div style="background: white; border: 2px solid #722F37; border-radius: 16px; padding: 40px 30px; text-align: center; margin-bottom: 32px;">
    <h1 style="margin: 0 0 12px; font-size: 28px; font-weight: 800; color: #722F37;">Welcome to Your Mini Diploma!</h1>
    <p style="margin: 0; color: #666; font-size: 16px;">You're about to discover the power of root-cause healing</p>
  </div>

  <!-- Welcome Message -->
  <div style="background: #FBF4F4; border-left: 4px solid #722F37; padding: 24px; border-radius: 0 12px 12px 0; margin-bottom: 32px;">
    <p style="margin: 0 0 16px; font-size: 18px; color: #333; line-height: 1.6;">
      <strong>Hey there!</strong>
    </p>
    <p style="margin: 0 0 16px; font-size: 16px; color: #555; line-height: 1.7;">
      I'm Sarah, and I'll be your guide for the next 3 days. Whether you're a nurse feeling burnt out, a health enthusiast looking to turn your passion into a career, or someone who's struggled with their own health issues — <strong>you're in the right place.</strong>
    </p>
    <p style="margin: 0; font-size: 16px; color: #555; line-height: 1.7;">
      This Mini Diploma will give you a solid foundation in Functional Medicine — the root-cause approach that's transforming healthcare. And the best part? <strong>No medical degree required.</strong>
    </p>
  </div>

  <!-- What You'll Learn -->
  <div style="background: white; border: 2px solid #ECE8E2; border-radius: 16px; padding: 28px; margin-bottom: 32px;">
    <h2 style="margin: 0 0 20px; color: #722F37; font-size: 20px; font-weight: 700;">What You'll Learn</h2>
    
    <div style="display: grid; gap: 16px;">
      <div style="display: flex; align-items: flex-start; gap: 16px; padding: 16px; background: #F9F9F9; border-radius: 12px;">
        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #722F37, #8B3A42); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; flex-shrink: 0;">1</div>
        <div>
          <h3 style="margin: 0 0 4px; font-size: 16px; color: #333; font-weight: 600;">Day 1: The Foundations</h3>
          <p style="margin: 0; font-size: 14px; color: #666;">Understand why conventional medicine misses the mark — and how Functional Medicine fills the gap.</p>
        </div>
      </div>
      
      <div style="display: flex; align-items: flex-start; gap: 16px; padding: 16px; background: #F9F9F9; border-radius: 12px;">
        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #722F37, #8B3A42); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; flex-shrink: 0;">2</div>
        <div>
          <h3 style="margin: 0 0 4px; font-size: 16px; color: #333; font-weight: 600;">Day 2: The 7 Body Systems</h3>
          <p style="margin: 0; font-size: 14px; color: #666;">Learn the framework that connects all health issues to their root causes.</p>
        </div>
      </div>
      
      <div style="display: flex; align-items: flex-start; gap: 16px; padding: 16px; background: #F9F9F9; border-radius: 12px;">
        <div style="width: 40px; height: 40px; background: linear-gradient(135deg, #722F37, #8B3A42); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; flex-shrink: 0;">3</div>
        <div>
          <h3 style="margin: 0 0 4px; font-size: 16px; color: #333; font-weight: 600;">Day 3: Your Path Forward</h3>
          <p style="margin: 0; font-size: 14px; color: #666;">See real case studies and discover how to turn this knowledge into a fulfilling career.</p>
        </div>
      </div>
    </div>
  </div>

  <!-- How to Succeed -->
  <div style="background: linear-gradient(145deg, #FFFEF8, #FFF9E8); border: 2px solid #C9A14E; border-radius: 16px; padding: 28px;">
    <h2 style="margin: 0 0 20px; color: #8B6914; font-size: 20px; font-weight: 700;">How to Get the Most Out of This</h2>
    
    <ul style="margin: 0; padding: 0; list-style: none;">
      <li style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; font-size: 15px; color: #555;">
        <span style="color: #C9A14E; font-weight: 800;">✓</span>
        <span><strong>Watch in order</strong> — each lesson builds on the last</span>
      </li>
      <li style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; font-size: 15px; color: #555;">
        <span style="color: #C9A14E; font-weight: 800;">✓</span>
        <span><strong>Complete in 90 minutes</strong> — or spread it over 3 days</span>
      </li>
      <li style="display: flex; align-items: flex-start; gap: 12px; margin-bottom: 12px; font-size: 15px; color: #555;">
        <span style="color: #C9A14E; font-weight: 800;">✓</span>
        <span><strong>Take the quizzes</strong> — they help you retain what you learn</span>
      </li>
      <li style="display: flex; align-items: flex-start; gap: 12px; font-size: 15px; color: #555;">
        <span style="color: #C9A14E; font-weight: 800;">✓</span>
        <span><strong>Pass the final exam</strong> — and earn your official Mini Diploma certificate!</span>
      </li>
    </ul>
  </div>
</div>
`;

async function main() {
    console.log("🎙️ Generating Welcome Audio for Mini Diploma...\n");

    // Step 1: Generate audio
    console.log(`Script: "${WELCOME_SCRIPT}"\n`);
    console.log("Generating voice with ElevenLabs...");

    const voiceResult = await generateSarahVoice(WELCOME_SCRIPT, {
        stability: 0.55,
        similarityBoost: 0.78,
        style: 0.3,
        speed: 1.05,
    });

    if (!voiceResult.success || !voiceResult.audioBase64) {
        console.error("❌ Failed to generate voice:", voiceResult.error);
        return;
    }

    console.log(`✅ Voice generated! Duration: ~${voiceResult.duration}s`);

    // Step 2: Save audio file
    const audioDir = path.join(process.cwd(), "public", "audio");
    if (!fs.existsSync(audioDir)) {
        fs.mkdirSync(audioDir, { recursive: true });
    }

    const filename = "mini-diploma-welcome.mp3";
    const filePath = path.join(audioDir, filename);
    const buffer = Buffer.from(voiceResult.audioBase64, "base64");
    fs.writeFileSync(filePath, buffer);
    console.log(`✅ Saved audio to: ${filePath}`);

    // Step 3: Update the welcome lesson with audio
    const audioUrl = `/audio/${filename}`;
    const updatedContent = WELCOME_LESSON_CONTENT_WITH_AUDIO(audioUrl);

    // Find the welcome lesson
    const welcomeLesson = await prisma.lesson.findFirst({
        where: {
            title: "Welcome to Your Mini Diploma",
            module: {
                course: {
                    slug: "functional-medicine-mini-diploma",
                },
            },
        },
    });

    if (!welcomeLesson) {
        console.error("❌ Welcome lesson not found!");
        return;
    }

    // Update the lesson content
    await prisma.lesson.update({
        where: { id: welcomeLesson.id },
        data: { content: updatedContent },
    });

    console.log(`✅ Updated welcome lesson with audio player!`);
    console.log(`\n🎉 Done! Audio URL: ${audioUrl}`);
}

main()
    .catch((e) => {
        console.error("Error:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
