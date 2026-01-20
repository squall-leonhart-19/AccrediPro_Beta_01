"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2 } from "lucide-react";

const AUDIO_FILES = [
    {
        name: "Mini Diploma Welcome",
        path: "/audio/mini-diploma-welcome.mp3",
        description: "Welcome message for mini diploma leads",
    },
    {
        name: "Sarah Final Exam Test",
        path: "/audio/sarah-final-exam-test.mp3",
        description: "Test audio for final exam",
    },
    {
        name: "Women's Health - Module 1 Intro",
        path: "/audio/womens-health/module-1-intro.mp3",
        description: "Introduction to Module 1: Hormones",
    },
    {
        name: "Women's Health - Module 2 Intro",
        path: "/audio/womens-health/module-2-intro.mp3",
        description: "Introduction to Module 2: Gut Health",
    },
    {
        name: "Women's Health - Module 3 Intro",
        path: "/audio/womens-health/module-3-intro.mp3",
        description: "Introduction to Module 3: Nutrition",
    },
    {
        name: "Notification Sound",
        path: "/sounds/notification.mp3",
        description: "System notification sound",
    },
];

export default function AudioLibraryClient() {
    const [playingIndex, setPlayingIndex] = useState<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handlePlay = (index: number, path: string) => {
        // Stop current audio
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
        }

        // Toggle off if same audio
        if (playingIndex === index) {
            setPlayingIndex(null);
            return;
        }

        // Play new audio
        setPlayingIndex(index);
        const audio = new Audio(path);
        audioRef.current = audio;
        audio.onended = () => setPlayingIndex(null);
        audio.onerror = () => setPlayingIndex(null);
        audio.play().catch(() => setPlayingIndex(null));
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">🎧 Audio Library</h1>
            <p className="text-gray-600 mb-8">All saved audio files for Sarah messages and lessons</p>

            <div className="grid gap-4">
                {AUDIO_FILES.map((audio, index) => (
                    <Card key={audio.path} className="border shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                                <Button
                                    onClick={() => handlePlay(index, audio.path)}
                                    variant={playingIndex === index ? "default" : "outline"}
                                    size="icon"
                                    className={`h-12 w-12 rounded-full shrink-0 ${playingIndex === index
                                            ? "bg-burgundy-600 hover:bg-burgundy-700"
                                            : "border-burgundy-300 text-burgundy-600 hover:bg-burgundy-50"
                                        }`}
                                >
                                    {playingIndex === index ? (
                                        <Pause className="h-5 w-5" />
                                    ) : (
                                        <Play className="h-5 w-5 ml-0.5" />
                                    )}
                                </Button>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">{audio.name}</h3>
                                    <p className="text-sm text-gray-500">{audio.description}</p>
                                    <code className="text-xs text-gray-400 mt-1 block">{audio.path}</code>
                                </div>
                                {playingIndex === index && (
                                    <div className="flex items-center gap-1 text-burgundy-600">
                                        <Volume2 className="h-4 w-4 animate-pulse" />
                                        <span className="text-sm font-medium">Playing...</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
