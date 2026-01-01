/**
 * Generate pre-recorded module intro audio for Women's Health Mini Diploma
 *
 * Run with: npx tsx scripts/generate-module-intros.ts
 */

import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import * as fs from "fs";
import * as path from "path";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config({ path: ".env.local" });

// Module intro scripts - warm, welcoming, ~30-45 seconds each
const moduleIntros = [
    {
        module: 1,
        filename: "module-1-intro.mp3",
        script: `Hey there! Welcome to Module 1 of your Women's Health Mini Diploma! I'm Sarah, and I'm so excited to be your guide on this journey.

Over the next three lessons, we're going to explore the foundations of women's hormonal health. You'll learn about the key hormones that run the show, how your menstrual cycle actually works, and what happens when things get out of balance.

This is the stuff that changes everything once you understand it. Ready? Let's dive in!`,
    },
    {
        module: 2,
        filename: "module-2-intro.mp3",
        script: `Welcome to Module 2! You're doing amazing.

Now that you understand the hormonal basics, we're going deeper. In this module, we'll explore the connections that most doctors miss - how your gut, thyroid, and stress levels all affect your hormones.

This is where it gets really interesting, because you'll start seeing how everything is connected. Understanding these links is the key to actually solving hormonal issues, not just treating symptoms. Let's go!`,
    },
    {
        module: 3,
        filename: "module-3-intro.mp3",
        script: `You made it to Module 3! This is where we put everything together.

In these final lessons, we'll cover practical strategies you can actually use - food as medicine, supporting women through different life stages, and your path forward.

By the end of this module, you'll have a real foundation in women's health that most people never learn. I'm so proud of how far you've come. Let's finish strong!`,
    },
];

async function generateAudioFiles() {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.SARAH_VOICE_ID || "Rn0vawuWHBy1e0yur4D8";

    if (!apiKey) {
        console.error("❌ ELEVENLABS_API_KEY not set in .env.local");
        process.exit(1);
    }

    const client = new ElevenLabsClient({ apiKey });
    const outputDir = path.join(__dirname, "../public/audio/womens-health");

    // Ensure directory exists
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    console.log("🎙️ Generating module intro audio files...");
    console.log(`   Voice ID: ${voiceId}\n`);

    for (const intro of moduleIntros) {
        console.log(`📝 Module ${intro.module}: ${intro.filename}`);
        console.log(`   Script: "${intro.script.substring(0, 50)}..."`);

        try {
            const audioStream = await client.textToSpeech.convert(voiceId, {
                text: intro.script,
                modelId: "eleven_turbo_v2_5",
                outputFormat: "mp3_44100_128",
                voiceSettings: {
                    stability: 0.60,
                    similarityBoost: 0.80,
                    style: 0.25,
                    useSpeakerBoost: true,
                    speed: 0.90,
                },
            });

            // Convert ReadableStream to buffer
            const reader = audioStream.getReader();
            const chunks: Uint8Array[] = [];

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                if (value) chunks.push(value);
            }

            const buffer = Buffer.concat(chunks);
            const outputPath = path.join(outputDir, intro.filename);
            fs.writeFileSync(outputPath, buffer);

            // Estimate duration
            const wordCount = intro.script.split(/\s+/).length;
            const duration = Math.ceil((wordCount / 144) * 60); // ~144 wpm at 0.9 speed

            console.log(`   ✅ Saved: ${outputPath} (~${duration}s, ${buffer.length} bytes)\n`);
        } catch (error) {
            console.error(`   ❌ Error generating Module ${intro.module}:`, error);
        }
    }

    console.log("🎉 Done! Audio files saved to public/audio/womens-health/");
}

generateAudioFiles().catch(console.error);
