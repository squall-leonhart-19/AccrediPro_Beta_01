"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Play, Pause } from "lucide-react";
import { cn } from "@/lib/utils";

interface WelcomeAudioProps {
    firstName: string;
    nicheLabel: string;
}

export function WelcomeAudio({ firstName }: WelcomeAudioProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const handlePlay = async () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            await audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl mb-6">
            <audio
                ref={audioRef}
                src="/audio/sarah-welcome.mp3"
                preload="auto"
                onEnded={() => setIsPlaying(false)}
            />

            {/* Small avatar */}
            <div className="relative flex-shrink-0">
                <Image
                    src="/coaches/sarah-coach.webp"
                    alt="Sarah"
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                />
                {isPlaying && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
                )}
            </div>

            {/* Name + waveform */}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                    Welcome from Sarah
                </p>
                <div className="flex items-end gap-[2px] h-3 mt-1">
                    {Array.from({ length: 20 }, (_, i) => (
                        <div
                            key={i}
                            className={cn(
                                "w-[3px] rounded-full transition-all",
                                isPlaying ? "bg-amber-500 animate-waveform" : "bg-gray-300 h-1"
                            )}
                            style={isPlaying ? {
                                animationDelay: `${i * 60}ms`,
                            } : undefined}
                        />
                    ))}
                </div>
            </div>

            {/* Play button */}
            <button
                onClick={handlePlay}
                className="w-9 h-9 rounded-full bg-gray-900 text-white flex items-center justify-center hover:bg-gray-800 transition-colors flex-shrink-0"
            >
                {isPlaying ? (
                    <Pause className="w-4 h-4" />
                ) : (
                    <Play className="w-4 h-4 ml-0.5" />
                )}
            </button>
        </div>
    );
}
