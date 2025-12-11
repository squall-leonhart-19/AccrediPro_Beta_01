import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

/**
 * ElevenLabs Voice Service
 * 
 * Environment variables needed:
 * - ELEVENLABS_API_KEY: Your ElevenLabs API key
 * - SARAH_VOICE_ID: The voice ID for Sarah's cloned voice
 */

// Default to a pre-made voice if no custom voice ID is set
// Pre-made voices: Rachel, Domi, Bella, Antoni, Elli, Josh, Arnold, Adam, Sam
const DEFAULT_VOICE_ID = "EXAVITQu4vr4xnSDxMaL"; // "Bella" - warm female voice

export interface VoiceGenerationResult {
    success: boolean;
    audioBase64?: string;
    duration?: number;
    error?: string;
}

/**
 * Generate voice audio using ElevenLabs
 */
export async function generateVoice(
    text: string,
    voiceId?: string
): Promise<VoiceGenerationResult> {
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
        console.warn("ELEVENLABS_API_KEY not set, falling back to OpenAI TTS");
        return { success: false, error: "ElevenLabs not configured" };
    }

    const client = new ElevenLabsClient({ apiKey });
    const finalVoiceId = voiceId || process.env.SARAH_VOICE_ID || DEFAULT_VOICE_ID;

    try {
        console.log(`🎙️ Generating voice with ElevenLabs (voice: ${finalVoiceId})...`);

        const audioStream = await client.textToSpeech.convert(finalVoiceId, {
            text,
            modelId: "eleven_multilingual_v2", // Best quality model
            outputFormat: "mp3_44100_128",
            voiceSettings: {
                stability: 0.6,        // Higher = more stable, less glitches
                similarityBoost: 0.8,  // Keep voice similar to Sarah
                style: 0.25,           // Lower style = fewer artifacts
                useSpeakerBoost: true,
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
        const audioBase64 = buffer.toString("base64");

        // Estimate duration (ElevenLabs is ~150-180 words/minute)
        const wordCount = text.split(/\s+/).length;
        const duration = Math.ceil((wordCount / 160) * 60);

        console.log(`✅ Voice generated! Duration: ~${duration}s, Size: ${buffer.length} bytes`);

        return {
            success: true,
            audioBase64,
            duration,
        };
    } catch (error) {
        console.error("ElevenLabs TTS error:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Voice generation failed",
        };
    }
}

/**
 * Generate Sarah's voice specifically
 * Uses the SARAH_VOICE_ID environment variable
 */
export async function generateSarahVoice(text: string): Promise<VoiceGenerationResult> {
    return generateVoice(text, process.env.SARAH_VOICE_ID);
}

/**
 * List available voices (useful for testing)
 */
export async function listVoices() {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
        return { success: false, error: "ELEVENLABS_API_KEY not set" };
    }

    const client = new ElevenLabsClient({ apiKey });

    try {
        const voices = await client.voices.getAll();
        return {
            success: true,
            voices: voices.voices?.map(v => ({
                voiceId: v.voiceId,
                name: v.name,
                category: v.category,
            })),
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to list voices",
        };
    }
}
