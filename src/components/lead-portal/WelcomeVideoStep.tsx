"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Play, CheckCircle, Volume2 } from "lucide-react";

interface WelcomeVideoStepProps {
    onComplete: () => void;
    isCompleted: boolean;
    firstName?: string;
}

export function WelcomeVideoStep({ onComplete, isCompleted, firstName = "there" }: WelcomeVideoStepProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [hasWatched, setHasWatched] = useState(isCompleted);
    const [isLoading, setIsLoading] = useState(false);

    const handleVideoEnd = async () => {
        if (hasWatched) return;

        setIsLoading(true);
        try {
            const res = await fetch("/api/lead-onboarding/video-complete", {
                method: "POST",
            });

            if (res.ok) {
                setHasWatched(true);
                onComplete();
            }
        } catch (error) {
            console.error("Error marking video complete:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Simulate video completion after play
    const handlePlay = () => {
        setIsPlaying(true);
        // For now, mark as complete after 5 seconds (demo)
        // In production, this would track actual video completion
        setTimeout(() => {
            handleVideoEnd();
        }, 5000);
    };

    if (isCompleted || hasWatched) {
        return (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center">
                <div className="w-16 h-16 mx-auto bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold text-emerald-800 mb-2">
                    Welcome Video Completed ✓
                </h3>
                <p className="text-emerald-600">
                    Great! Now let's get to know you better.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
            {/* Video Container */}
            <div className="relative aspect-video bg-gradient-to-br from-burgundy-700 to-burgundy-900">
                {!isPlaying ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6">
                        {/* Sarah Avatar */}
                        <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 ring-4 ring-white/30">
                            <span className="text-4xl font-bold">S</span>
                        </div>

                        <h2 className="text-2xl font-bold mb-2 text-center">
                            Hey {firstName}! 👋
                        </h2>
                        <p className="text-burgundy-200 text-center mb-6 max-w-md">
                            I'm Sarah, and I'm so excited to guide you through this journey.
                            Watch this quick 60-second intro before we begin.
                        </p>

                        {/* Play Button */}
                        <Button
                            onClick={handlePlay}
                            size="lg"
                            className="bg-white text-burgundy-700 hover:bg-burgundy-50 font-bold px-8 py-6 rounded-xl shadow-lg group"
                        >
                            <Play className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" />
                            Watch Welcome Video
                        </Button>

                        <p className="text-burgundy-300 text-sm mt-4 flex items-center gap-2">
                            <Volume2 className="w-4 h-4" />
                            60 seconds • Sound on recommended
                        </p>
                    </div>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                        {/* Playing State */}
                        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 animate-pulse">
                            <Volume2 className="w-10 h-10" />
                        </div>
                        <p className="text-xl font-medium">Playing...</p>
                        <p className="text-burgundy-200 text-sm mt-2">Your journey starts now 🌟</p>

                        {/* Progress bar */}
                        <div className="w-64 h-2 bg-white/20 rounded-full mt-6 overflow-hidden">
                            <div
                                className="h-full bg-white rounded-full animate-[progress_5s_linear]"
                                style={{
                                    animation: "progress 5s linear forwards",
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Info Footer */}
            <div className="p-4 bg-burgundy-50 border-t border-burgundy-100">
                <p className="text-sm text-burgundy-700 text-center">
                    ✨ This quick intro will help you get the most out of your mini diploma
                </p>
            </div>

            <style jsx>{`
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
        </div>
    );
}
