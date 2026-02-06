import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

/**
 * ElevenLabs Voice Service
 * 
 * Environment variables needed:
 * - ELEVENLABS_API_KEY: Your ElevenLabs API key
 * - SARAH_VOICE_ID: The voice ID for Sarah's cloned voice
 */

// Default to Sarah's custom voice - use this if SARAH_VOICE_ID env var is not set
const DEFAULT_VOICE_ID = "Rn0vawuWHBy1e0yur4D8"; // Sarah's custom cloned voice

export interface VoiceGenerationResult {
    success: boolean;
    audioBase64?: string;
    duration?: number;
    error?: string;
}

export interface VoiceSettings {
    stability?: number;        // 0-1, higher = more stable/consistent
    similarityBoost?: number;  // 0-1, higher = more similar to original voice
    style?: number;            // 0-1, higher = more expressive
    speed?: number;            // 0.5-2.0, lower = slower speech
}

// Default voice settings - TESTED AND APPROVED for Sarah (eleven_v3)
// Warm, expressive, builds bond with leads
const DEFAULT_VOICE_SETTINGS: VoiceSettings = {
    stability: 0.25,       // Creative mode - more expressive (maps to 0.0 in eleven_v3)
    similarityBoost: 0.85, // High similarity to original Sarah voice
    style: 0.65,           // More emotional/expressive delivery
    speed: 1.1,            // Slightly faster, energetic
};

/**
 * Generate voice audio using ElevenLabs
 */
export async function generateVoice(
    text: string,
    voiceId?: string,
    settings?: VoiceSettings
): Promise<VoiceGenerationResult> {
    const apiKey = process.env.ELEVENLABS_API_KEY;

    if (!apiKey) {
        console.warn("ELEVENLABS_API_KEY not set, falling back to OpenAI TTS");
        return { success: false, error: "ElevenLabs not configured" };
    }

    const client = new ElevenLabsClient({ apiKey });
    const finalVoiceId = voiceId || process.env.SARAH_VOICE_ID || DEFAULT_VOICE_ID;
    const finalSettings = { ...DEFAULT_VOICE_SETTINGS, ...settings };

    try {
        console.log(`🎙️ Generating voice with ElevenLabs eleven_v3 (voice: ${finalVoiceId}, speed: ${finalSettings.speed})...`);

        // eleven_v3 only accepts specific stability values: 0.0, 0.5, or 1.0
        // Map our 0-1 slider to nearest valid value
        const mapStabilityForV3 = (value: number): number => {
            if (value <= 0.25) return 0.0;  // Creative
            if (value <= 0.75) return 0.5;  // Natural
            return 1.0;  // Robust
        };

        const v3Stability = mapStabilityForV3(finalSettings.stability || 0.5);
        console.log(`   Stability mapped: ${finalSettings.stability} → ${v3Stability} (${v3Stability === 0 ? 'Creative' : v3Stability === 0.5 ? 'Natural' : 'Robust'})`);

        const audioStream = await client.textToSpeech.convert(finalVoiceId, {
            text,
            modelId: "eleven_v3", // NEW: Human-like and expressive speech, 70+ languages
            outputFormat: "mp3_44100_128",
            voiceSettings: {
                stability: v3Stability,  // Must be 0.0, 0.5, or 1.0 for eleven_v3
                similarityBoost: finalSettings.similarityBoost!,
                style: finalSettings.style!,
                useSpeakerBoost: true,
                speed: finalSettings.speed,
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

        // Estimate duration (ElevenLabs is ~150-180 words/minute, adjusted for speed)
        const wordCount = text.split(/\s+/).length;
        const baseWPM = 160;
        const adjustedWPM = baseWPM * (finalSettings.speed || 1);
        const duration = Math.ceil((wordCount / adjustedWPM) * 60);

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
export async function generateSarahVoice(text: string, settings?: VoiceSettings): Promise<VoiceGenerationResult> {
    return generateVoice(text, process.env.SARAH_VOICE_ID, settings);
}

/**
 * Generate voice with custom settings - for A/B testing different voice styles
 */
export async function generateVoiceWithSettings(
    text: string,
    settings: VoiceSettings,
    voiceId?: string
): Promise<VoiceGenerationResult> {
    return generateVoice(text, voiceId, settings);
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
