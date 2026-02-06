/**
 * Generate Sarah Welcome Audio
 * Run with: npx tsx scripts/generate-welcome-audio.ts
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { writeFileSync } from "fs";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

const SARAH_VOICE_ID = process.env.SARAH_VOICE_ID || "uXRbZctVA9lTJBqMtWeE"; // Sarah's cloned voice

const WELCOME_SCRIPT = `
Hey there! It's Sarah, and I am SO happy you're here.
Welcome to the Mini Diploma.
Over the next 3 lessons, you're going to learn real frameworks that practitioners charge hundreds of dollars to teach.
This isn't fluff. This is what actually works.
I'm going to be with you every step of the way.
Now take a deep breath, and let's get started with your first lesson.
You've got this!
`.trim();

async function generateWelcomeAudio() {
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
        console.error("❌ ELEVENLABS_API_KEY not set in environment");
        process.exit(1);
    }

    console.log("🎙️ Generating Sarah welcome audio...");
    console.log(`Script: "${WELCOME_SCRIPT.slice(0, 50)}..."`);

    const client = new ElevenLabsClient({ apiKey });

    try {
        const audioStream = await client.textToSpeech.convert(SARAH_VOICE_ID, {
            text: WELCOME_SCRIPT,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
                stability: 0.75,
                similarity_boost: 0.85,
                style: 0.4,
                speed: 1.05,
            },
        });

        // Collect all chunks
        const chunks: Buffer[] = [];
        for await (const chunk of audioStream) {
            chunks.push(Buffer.from(chunk));
        }
        const audioBuffer = Buffer.concat(chunks);

        // Save to public folder
        const outputPath = "./public/audio/sarah-welcome.mp3";
        writeFileSync(outputPath, audioBuffer);

        console.log(`✅ Audio saved to ${outputPath}`);
        console.log(`   Size: ${(audioBuffer.length / 1024).toFixed(1)} KB`);
    } catch (error) {
        console.error("❌ ElevenLabs error:", error);
        process.exit(1);
    }
}

generateWelcomeAudio();
