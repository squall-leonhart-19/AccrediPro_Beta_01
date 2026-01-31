"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Volume2 } from "lucide-react";

// Wistia Player Component
function WistiaEmbed({ mediaId }: { mediaId: string }) {
    useEffect(() => {
        // Load Wistia player script
        const playerScript = document.createElement("script");
        playerScript.src = "https://fast.wistia.com/player.js";
        playerScript.async = true;
        document.head.appendChild(playerScript);

        // Load media-specific script
        const mediaScript = document.createElement("script");
        mediaScript.src = `https://fast.wistia.com/embed/${mediaId}.js`;
        mediaScript.async = true;
        mediaScript.type = "module";
        document.head.appendChild(mediaScript);

        return () => {
            try {
                document.head.removeChild(playerScript);
                document.head.removeChild(mediaScript);
            } catch (e) {
                // Scripts may have already been removed
            }
        };
    }, [mediaId]);

    return (
        <div className="aspect-video relative">
            <style>{`
                wistia-player[media-id='${mediaId}']:not(:defined) { 
                    background: center / contain no-repeat url('https://fast.wistia.com/embed/medias/${mediaId}/swatch'); 
                    display: block; 
                    filter: blur(5px); 
                    padding-top: 56.25%; 
                }
            `}</style>
            {/* @ts-ignore - Wistia web component */}
            <wistia-player media-id={mediaId} aspect="1.7777777777777777"></wistia-player>
        </div>
    );
}

interface WelcomeVideoStepProps {
    onComplete: () => void;
    isCompleted: boolean;
    firstName?: string;
    niche?: string; // Optional niche for per-niche tracking
}

export function WelcomeVideoStep({ onComplete, isCompleted, firstName = "there", niche }: WelcomeVideoStepProps) {
    const [hasWatched, setHasWatched] = useState(isCompleted);
    const [isLoading, setIsLoading] = useState(false);
    const [showContinue, setShowContinue] = useState(false);

    // Show continue button after 10 seconds
    useEffect(() => {
        if (!hasWatched) {
            const timer = setTimeout(() => {
                setShowContinue(true);
            }, 10000);
            return () => clearTimeout(timer);
        }
    }, [hasWatched]);

    const handleVideoComplete = async () => {
        if (hasWatched) return;

        setIsLoading(true);
        try {
            const res = await fetch("/api/lead-onboarding/video-complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ niche }),
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
            {/* Sarah Header */}
            <div className="bg-burgundy-600 px-4 py-3 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
                    S
                </div>
                <div>
                    <p className="text-white font-semibold">Hey {firstName}! 👋</p>
                    <p className="text-burgundy-200 text-sm">Watch this quick intro from Sarah</p>
                </div>
            </div>

            {/* Wistia Video Embed */}
            <div className="relative">
                <WistiaEmbed mediaId="7w51vpdty2" />
            </div>

            {/* Continue Button - Shows after 10 seconds */}
            <div className="p-4 bg-burgundy-50 border-t border-burgundy-100">
                {showContinue ? (
                    <Button
                        onClick={handleVideoComplete}
                        disabled={isLoading}
                        className="w-full bg-burgundy-600 hover:bg-burgundy-700 text-white font-semibold py-3"
                    >
                        {isLoading ? "Saving..." : "Continue to Next Step →"}
                    </Button>
                ) : (
                    <p className="text-sm text-burgundy-600 text-center flex items-center justify-center gap-2">
                        <Volume2 className="w-4 h-4" />
                        Watch the video - continue button appears shortly
                    </p>
                )}
            </div>
        </div>
    );
}
