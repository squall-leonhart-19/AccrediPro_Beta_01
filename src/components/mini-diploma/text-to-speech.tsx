"use client";

import { useState, useRef } from "react";
import { Volume2, Loader2, Play, Pause, Square } from "lucide-react";

interface TextToSpeechProps {
    textContent: string;
    className?: string;
}

/**
 * Text-to-speech component using ElevenLabs API
 * Generates Sarah's voice for lesson content
 */
export function TextToSpeech({ textContent, className = "" }: TextToSpeechProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [audioSrc, setAudioSrc] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Clean text content (remove HTML tags, limit length)
    const cleanText = textContent
        .replace(/<[^>]*>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 1000); // API limit

    const handlePlay = async () => {
        // Generate audio if not already done
        if (!audioSrc) {
            setIsLoading(true);
            try {
                const res = await fetch("/api/public/tts", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ text: cleanText }),
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.audio) {
                        setAudioSrc(data.audio);
                        if (audioRef.current) {
                            audioRef.current.src = data.audio;
                            await audioRef.current.play();
                            setIsPlaying(true);
                        }
                    }
                }
            } catch (err) {
                console.error("TTS error:", err);
            } finally {
                setIsLoading(false);
            }
            return;
        }

        // Toggle play/pause
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                await audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    const handleStop = () => {
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }
        setIsPlaying(false);
    };

    return (
        <div className={`flex items-center gap-2 ${className}`}>
            <button
                onClick={handlePlay}
                disabled={isLoading}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isPlaying
                        ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    } disabled:opacity-50`}
                title={isPlaying ? "Pause" : "Listen with Sarah's voice"}
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : isPlaying ? (
                    <Pause className="w-4 h-4" />
                ) : (
                    <Volume2 className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">
                    {isLoading ? "Loading..." : isPlaying ? "Pause" : "Listen"}
                </span>
            </button>

            {isPlaying && (
                <button
                    onClick={handleStop}
                    className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
                    title="Stop"
                >
                    <Square className="w-4 h-4" />
                </button>
            )}

            <audio
                ref={audioRef}
                onEnded={() => setIsPlaying(false)}
                preload="none"
            />
        </div>
    );
}
