/**
 * Generate Lesson Audio using ElevenLabs API
 *
 * Replaces the slow F5-TTS local generation (~30 min) with ElevenLabs API (~30 sec).
 * Uses Sarah's cloned voice (eleven_v3 model) for production-quality audio.
 *
 * Usage:
 *   npx tsx scripts/generate-lesson-audio-elevenlabs.ts --niche gut-health
 *   npx tsx scripts/generate-lesson-audio-elevenlabs.ts --niche gut-health --upload
 *   npx tsx scripts/generate-lesson-audio-elevenlabs.ts --niche gut-health --lesson 2
 *
 * Options:
 *   --niche     Portal slug (e.g., gut-health, reiki-healing)
 *   --upload    Upload to R2 after generation (requires wrangler)
 *   --lesson    Generate audio for a single lesson (1, 2, or 3)
 *
 * Output:
 *   public/audio/{niche}/lesson-{1-3}.mp3
 *
 * R2 URL (after upload):
 *   https://media.accredipro.academy/audio/{niche}/lesson-{1-3}.mp3
 */

import { config } from "dotenv";
config({ path: ".env.local" });

import { writeFileSync, mkdirSync, existsSync, readFileSync } from "fs";
import { join } from "path";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { execSync } from "child_process";

// ── Config ──────────────────────────────────────────────────────────────────

const SARAH_VOICE_ID = process.env.SARAH_VOICE_ID || "uXRbZctVA9lTJBqMtWeE";
const PROJECT_ROOT = join(__dirname, "..");
const CONTENT_DIR = join(PROJECT_ROOT, "src/components/mini-diploma/lessons/content");
const OUTPUT_BASE = join(PROJECT_ROOT, "public/audio");
const R2_BUCKET = "accredipro";
const CDN_BASE = "https://media.accredipro.academy/audio";

// Sarah's voice settings — tested and approved
const VOICE_SETTINGS = {
    stability: 0.0,           // Creative mode for eleven_v3
    similarityBoost: 0.85,    // High similarity to original Sarah
    style: 0.65,              // Expressive/emotional
    speed: 1.1,               // Slightly faster, energetic
};

// ── Audio Script Templates ──────────────────────────────────────────────────

function generateAudioScript(lesson: { id: number; title: string; subtitle?: string; sections: Array<{ type: string; content: string }> }, niche: string, nicheLabel: string): string {
    const lessonNum = lesson.id;

    // Extract key content from sections for script generation
    const introSection = lesson.sections.find(s => s.type === "intro");
    const keyPoints = lesson.sections.filter(s => s.type === "key-point").map(s => s.content);
    const headings = lesson.sections.filter(s => s.type === "heading").map(s => s.content);

    // Clean content: remove markdown bold, {name} placeholders
    const clean = (text: string) => text
        .replace(/\*\*/g, "")
        .replace(/\{name\}/g, "")
        .replace(/\$/g, "")
        .replace(/\n+/g, " ")
        .trim();

    if (lessonNum === 1) {
        return `Hey there! It's Sarah, and I'm so glad you're here.

Welcome to Lesson 1 of your ${nicheLabel} training. ${lesson.title}.

${introSection ? clean(introSection.content).slice(0, 200) : `This is where your journey begins.`}

In this lesson, you're going to discover why ${nicheLabel.toLowerCase()} is one of the fastest-growing fields in health and wellness right now. And more importantly, you're going to see why YOU are perfectly positioned to succeed in it.

${keyPoints[0] ? clean(keyPoints[0]).slice(0, 150) : "What makes this different is the approach. We don't just teach theory. We give you real frameworks you can use with real clients."}

By the end of this lesson, you'll understand the foundations that set great practitioners apart from everyone else.

Now take a deep breath, and let's dive in. You've got this!`.trim();
    }

    if (lessonNum === 2) {
        return `Welcome back! It's Sarah.

You crushed Lesson 1, and now we're getting into the good stuff. Lesson 2 is all about the D.E.P.T.H. Method, your signature framework.

This is the system that turns you from someone who knows a lot about ${nicheLabel.toLowerCase()} into a structured, confident practitioner who gets real results for clients.

D.E.P.T.H. stands for Discover, Evaluate, Pinpoint, Transform, and Heal. Each step builds on the last, and together they give you a repeatable process for every single client you work with.

${keyPoints[0] ? clean(keyPoints[0]).slice(0, 150) : "The best part? This framework works whether you have one client or twenty. It scales with you."}

By the end of this lesson, you'll have the complete method. And honestly, this is where most of our graduates say everything clicked for them.

Let's get into it!`.trim();
    }

    // Lesson 3
    return `Okay, this is it. Lesson 3. The one everyone's been waiting for.

It's Sarah, and I have to be honest with you. This lesson is my favorite to teach. Because this is where we talk about how you actually get paid doing this work.

You've got the foundations from Lesson 1. You've got the D.E.P.T.H. Method from Lesson 2. Now let's talk about turning all of that into a real income.

Here's what I want you to know right now: getting your first ${nicheLabel.toLowerCase()} clients is way easier than you think. You don't need a website. You don't need social media followers. You don't need to spend money on ads.

You just need genuine conversations with people who are already struggling.

${keyPoints[0] ? clean(keyPoints[0]).slice(0, 150) : "We call it the Warm Market Strategy, and it works because your first clients are people who already know and trust you."}

By the end of this lesson, you'll have a complete 30-day launch plan. And then it's exam time, and your certificate is waiting.

Let's finish strong!`.trim();
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
    const args = process.argv.slice(2);
    const nicheIdx = args.indexOf("--niche");
    const uploadFlag = args.includes("--upload");
    const lessonIdx = args.indexOf("--lesson");

    if (nicheIdx === -1 || !args[nicheIdx + 1]) {
        console.error("❌ Usage: npx tsx scripts/generate-lesson-audio-elevenlabs.ts --niche {portal_slug}");
        console.error("   Example: npx tsx scripts/generate-lesson-audio-elevenlabs.ts --niche gut-health");
        process.exit(1);
    }

    const niche = args[nicheIdx + 1];
    const singleLesson = lessonIdx !== -1 ? parseInt(args[lessonIdx + 1]) : null;

    // Verify API key
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
        console.error("❌ ELEVENLABS_API_KEY not set in .env.local");
        process.exit(1);
    }

    // Load lesson content JSON
    const contentPath = join(CONTENT_DIR, `${niche}.json`);
    if (!existsSync(contentPath)) {
        console.error(`❌ Lesson content not found: ${contentPath}`);
        console.error(`   Available niches:`);
        const files = require("fs").readdirSync(CONTENT_DIR).filter((f: string) => f.endsWith(".json"));
        files.forEach((f: string) => console.error(`   - ${f.replace(".json", "")}`));
        process.exit(1);
    }

    const content = JSON.parse(readFileSync(contentPath, "utf-8"));
    const nicheLabel = content.nicheLabel || niche;
    const lessons = content.lessons || [];

    if (lessons.length === 0) {
        console.error(`❌ No lessons found in ${contentPath}`);
        process.exit(1);
    }

    // Filter lessons if --lesson flag provided
    const lessonsToGenerate = singleLesson
        ? lessons.filter((l: { id: number }) => l.id === singleLesson)
        : lessons;

    if (lessonsToGenerate.length === 0) {
        console.error(`❌ Lesson ${singleLesson} not found in content`);
        process.exit(1);
    }

    // Create output directory
    const outputDir = join(OUTPUT_BASE, niche);
    mkdirSync(outputDir, { recursive: true });

    console.log(`\n🎙️  ElevenLabs Lesson Audio Generator`);
    console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`   Niche:    ${niche}`);
    console.log(`   Label:    ${nicheLabel}`);
    console.log(`   Lessons:  ${lessonsToGenerate.length}`);
    console.log(`   Voice:    Sarah (${SARAH_VOICE_ID})`);
    console.log(`   Model:    eleven_v3`);
    console.log(`   Output:   ${outputDir}/`);
    console.log(`   Upload:   ${uploadFlag ? "Yes (R2)" : "No"}\n`);

    const client = new ElevenLabsClient({ apiKey });
    const results: Array<{ lesson: number; path: string; size: number; duration: number; r2Url?: string }> = [];

    // Generate all lessons
    for (const lesson of lessonsToGenerate) {
        const lessonNum = lesson.id;
        console.log(`📝 Lesson ${lessonNum}: "${lesson.title}"`);

        // Generate script from lesson content
        const script = generateAudioScript(lesson, niche, nicheLabel);
        const wordCount = script.split(/\s+/).length;
        console.log(`   Script: ${wordCount} words (~${Math.ceil(wordCount / 160 * 60 / 1.1)}s estimated)`);

        // Generate audio
        console.log(`   🔊 Calling ElevenLabs API...`);
        const startTime = Date.now();

        try {
            const audioStream = await client.textToSpeech.convert(SARAH_VOICE_ID, {
                text: script,
                modelId: "eleven_v3",
                outputFormat: "mp3_44100_128",
                voiceSettings: {
                    stability: VOICE_SETTINGS.stability,
                    similarityBoost: VOICE_SETTINGS.similarityBoost,
                    style: VOICE_SETTINGS.style,
                    useSpeakerBoost: true,
                    speed: VOICE_SETTINGS.speed,
                },
            });

            // Collect audio chunks
            const reader = audioStream.getReader();
            const chunks: Uint8Array[] = [];
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                if (value) chunks.push(value);
            }

            const audioBuffer = Buffer.concat(chunks);
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            const sizeKB = (audioBuffer.length / 1024).toFixed(0);
            const estimatedDuration = Math.ceil(wordCount / (160 * (VOICE_SETTINGS.speed || 1)) * 60);

            // Save MP3
            const outputPath = join(outputDir, `lesson-${lessonNum}.mp3`);
            writeFileSync(outputPath, audioBuffer);

            console.log(`   ✅ Generated in ${elapsed}s — ${sizeKB} KB — ~${estimatedDuration}s audio`);

            const result: { lesson: number; path: string; size: number; duration: number; r2Url?: string } = {
                lesson: lessonNum,
                path: outputPath,
                size: audioBuffer.length,
                duration: estimatedDuration,
            };

            // Upload to R2 if requested
            if (uploadFlag) {
                const r2Key = `audio/${niche}/lesson-${lessonNum}.mp3`;
                console.log(`   ☁️  Uploading to R2: ${r2Key}`);
                try {
                    execSync(
                        `wrangler r2 object put ${R2_BUCKET}/${r2Key} --file="${outputPath}"`,
                        { stdio: "pipe" }
                    );
                    result.r2Url = `${CDN_BASE}/${niche}/lesson-${lessonNum}.mp3`;
                    console.log(`   ✅ Uploaded: ${result.r2Url}`);
                } catch (uploadError) {
                    console.error(`   ⚠️  R2 upload failed (file saved locally): ${uploadError}`);
                }
            }

            results.push(result);
        } catch (error) {
            console.error(`   ❌ Generation failed for lesson ${lessonNum}:`, error);
            process.exit(1);
        }
    }

    // Summary
    console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
    console.log(`✅ All ${results.length} lesson audio files generated!\n`);

    console.log(`📁 Local files:`);
    for (const r of results) {
        console.log(`   lesson-${r.lesson}.mp3 — ${(r.size / 1024).toFixed(0)} KB — ~${r.duration}s`);
    }

    if (uploadFlag && results.some(r => r.r2Url)) {
        console.log(`\n☁️  R2 URLs (for lesson JSON):`);
        for (const r of results) {
            if (r.r2Url) {
                console.log(`   "${r.r2Url}"`);
            }
        }
    }

    // Output JSON snippet for lesson integration
    console.log(`\n📋 Lesson JSON audio sections (copy into ${niche}.json):`);
    for (const r of results) {
        const url = r.r2Url || `/audio/${niche}/lesson-${r.lesson}.mp3`;
        console.log(`
   Lesson ${r.lesson} — add this section:
   {
       "type": "pre-recorded-audio",
       "content": "Listen to Sarah explain this lesson",
       "audioUrl": "${url}",
       "audioDuration": ${r.duration}
   }`);
    }

    console.log(`\n🎉 Done! Total time: ~${results.length * 10}s (vs ~${results.length * 10 * 60}s with F5-TTS)\n`);
}

main().catch(console.error);
