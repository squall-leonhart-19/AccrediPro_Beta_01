"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Play, Pause } from "lucide-react";
import Image from "next/image";

interface WelcomeAudioProps {
    firstName: string;
    nicheLabel: string;
}

/**
 * Welcome audio message component for lesson 1
 * Uses pre-generated Sarah audio from ElevenLabs
 */
export function WelcomeAudio({
    firstName,
    nicheLabel,
}: WelcomeAudioProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);
    const [showMessage, setShowMessage] = useState(true);
    const audioRef = useRef<HTMLAudioElement>(null);

    // Auto-dismiss after 45 seconds if not interacted
    useEffect(() => {
        const timer = setTimeout(() => {
            if (!hasInteracted) {
                setShowMessage(false);
            }
        }, 45000);
        return () => clearTimeout(timer);
    }, [hasInteracted]);

    const handlePlay = async () => {
        setHasInteracted(true);

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

    const handleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleDismiss = () => {
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setShowMessage(false);
    };

    if (!showMessage) return null;

    return (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-2 border-amber-200 rounded-xl p-4 mb-6 animate-fade-in">
            <div className="flex items-start gap-4">
                {/* Sarah avatar with pulse */}
                <div className="relative flex-shrink-0">
                    <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-amber-400">
                        <Image
                            src="/coaches/sarah-coach.webp"
                            alt="Sarah"
                            width={56}
                            height={56}
                            className="object-cover"
                        />
                    </div>
                    {isPlaying && (
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
                    )}
                </div>

                {/* Message content */}
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-amber-900">
                            🎙️ Personal welcome from Sarah
                        </span>
                        <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full">
                            ~30 sec
                        </span>
                    </div>
                    <p className="text-sm text-amber-800 mb-3">
                        Hey {firstName}! 👋 Before you dive into the {nicheLabel} Mini Diploma,
                        I recorded a quick personal message just for you. Click play to hear it!
                    </p>

                    {/* Audio controls */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handlePlay}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium text-sm transition-colors"
                        >
                            {isPlaying ? (
                                <>
                                    <Pause className="w-4 h-4" />
                                    Pause
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4" />
                                    Play Message
                                </>
                            )}
                        </button>
                        <button
                            onClick={handleMute}
                            className="p-2 text-amber-700 hover:bg-amber-100 rounded-lg transition-colors"
                            title={isMuted ? "Unmute" : "Mute"}
                        >
                            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={handleDismiss}
                            className="ml-auto text-xs text-amber-600 hover:text-amber-800 underline"
                        >
                            Skip intro
                        </button>
                    </div>
                </div>
            </div>

            {/* Audio element - uses pre-generated static file */}
            <audio
                ref={audioRef}
                src="/audio/sarah-welcome.mp3"
                onEnded={() => setIsPlaying(false)}
                preload="auto"
            />
        </div>
    );
}
