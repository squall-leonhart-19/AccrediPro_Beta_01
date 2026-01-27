"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle, Loader2 } from "lucide-react";

// Lesson metadata
const LESSONS = [
    { id: 1, title: "The Coaching Mindset" },
    { id: 2, title: "Active Listening" },
    { id: 3, title: "Powerful Questions" },
    { id: 4, title: "The FAITH Framework" },
    { id: 5, title: "Goal Setting with God" },
    { id: 6, title: "Overcoming Obstacles" },
    { id: 7, title: "Finding Your Niche" },
    { id: 8, title: "Pricing Your Services" },
    { id: 9, title: "Your Next Steps" },
];

export default function ChristianCoachingLessonPage() {
    const params = useParams();
    const router = useRouter();
    const lessonId = parseInt(params.id as string);

    const [firstName, setFirstName] = useState("friend");
    const [isCompleted, setIsCompleted] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [lessonContent, setLessonContent] = useState<string | null>(null);

    const lesson = LESSONS.find(l => l.id === lessonId);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch lesson status
                const statusRes = await fetch(`/api/lead-onboarding/lesson-status?lesson=${lessonId}&niche=christian-coaching`);
                if (statusRes.ok) {
                    const data = await statusRes.json();
                    setFirstName(data.firstName || "friend");
                    setIsCompleted(data.completed || false);

                    // If this is lesson 9 and already completed + exam passed, redirect to complete page
                    if (lessonId === 9 && data.completed && data.examPassed) {
                        router.replace("/christian-coaching-diploma/complete");
                        return;
                    }
                }

                // Fetch lesson content from database
                const contentRes = await fetch(`/api/mini-diploma/lesson-content?lessonNumber=${lessonId}&courseSlug=christian-coaching-mini-diploma`);
                if (contentRes.ok) {
                    const contentData = await contentRes.json();
                    setLessonContent(contentData.content);
                }
            } catch (e) {
                console.error("Failed to fetch lesson data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [lessonId, router]);

    if (lessonId < 1 || lessonId > 9 || isNaN(lessonId) || !lesson) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <div className="text-center p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Lesson not found</h1>
                    <Link href="/christian-coaching-diploma">
                        <Button>Back to Dashboard</Button>
                    </Link>
                </div>
            </div>
        );
    }

    const handleComplete = async () => {
        try {
            const res = await fetch("/api/lead-onboarding/lesson-complete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ lessonId, niche: "christian-coaching" }),
            });

            if (res.ok) {
                setIsCompleted(true);
            }
        } catch (e) {
            console.error("Failed to mark lesson complete");
        }
    };

    const handleNext = () => {
        if (lessonId < 9) {
            router.push(`/christian-coaching-diploma/lesson/${lessonId + 1}`);
        } else {
            router.push("/christian-coaching-diploma/complete");
        }
    };

    const handlePrevious = () => {
        if (lessonId > 1) {
            router.push(`/christian-coaching-diploma/lesson/${lessonId - 1}`);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="w-8 h-8 animate-spin text-[#1e3a5f]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#1e3a5f] to-[#2a4a6f] text-white">
                <div className="max-w-4xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/christian-coaching-diploma" className="text-white/80 hover:text-white flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Dashboard
                        </Link>
                        <div className="text-sm text-white/60">
                            Lesson {lessonId} of 9
                        </div>
                    </div>
                </div>
            </div>

            {/* Progress bar */}
            <div className="bg-[#1e3a5f]/10">
                <div
                    className="h-1 bg-gradient-to-r from-[#d4a574] to-[#c9956a]"
                    style={{ width: `${(lessonId / 9) * 100}%` }}
                />
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Lesson Title */}
                <div className="mb-8 text-center">
                    <span className="text-[#d4a574] font-medium">Lesson {lessonId}</span>
                    <h1 className="text-3xl font-bold text-slate-800 mt-2">{lesson.title}</h1>
                </div>

                {/* Lesson Content */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    {lessonContent ? (
                        <div
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: lessonContent }}
                        />
                    ) : (
                        <div className="text-center text-slate-500 py-12">
                            <p>Lesson content is loading...</p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={lessonId === 1}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Previous
                    </Button>

                    <div className="flex items-center gap-4">
                        {!isCompleted ? (
                            <Button
                                onClick={handleComplete}
                                className="bg-[#1e3a5f] hover:bg-[#162d4a] text-white"
                            >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Mark Complete
                            </Button>
                        ) : (
                            <span className="text-emerald-600 font-medium flex items-center gap-2">
                                <CheckCircle className="w-5 h-5" />
                                Completed!
                            </span>
                        )}

                        <Button
                            onClick={handleNext}
                            className="bg-gradient-to-r from-[#d4a574] to-[#c9956a] hover:from-[#c9956a] hover:to-[#be8a5f] text-white flex items-center gap-2"
                        >
                            {lessonId === 9 ? "Complete & Take Exam" : "Next Lesson"}
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
