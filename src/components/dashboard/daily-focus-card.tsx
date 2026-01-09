"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, ArrowRight, Clock, Zap } from "lucide-react";

interface DailyFocusCardProps {
    nextLesson?: {
        title: string;
        moduleTitle: string;
        courseSlug: string;
        lessonSlug: string;
        estimatedMinutes?: number;
    };
    lessonsToMilestone?: number;
    currentStreak?: number;
}

export function DailyFocusCard({
    nextLesson,
    lessonsToMilestone = 3,
    currentStreak = 0
}: DailyFocusCardProps) {
    // Default lesson if none provided
    const lesson = nextLesson || {
        title: "Continue Your Learning",
        moduleTitle: "Your Current Module",
        courseSlug: "#",
        lessonSlug: "#",
        estimatedMinutes: 15,
    };

    return (
        <Card className="border-2 border-gold-200 bg-gradient-to-r from-gold-50 via-amber-50 to-gold-50 overflow-hidden">
            <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Left: Icon + Content */}
                    <div className="flex items-start gap-3 flex-1">
                        <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center flex-shrink-0 border border-gold-200">
                            <Target className="w-6 h-6 text-gold-600" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold text-gold-600 uppercase tracking-wide">
                                    📌 Today's Focus
                                </span>
                                {currentStreak > 0 && (
                                    <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full flex items-center gap-1">
                                        🔥 {currentStreak} day streak
                                    </span>
                                )}
                            </div>
                            <h3 className="font-semibold text-gray-900 text-sm sm:text-base line-clamp-1">
                                {lesson.title}
                            </h3>
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                <span className="line-clamp-1">{lesson.moduleTitle}</span>
                                {lesson.estimatedMinutes && (
                                    <span className="flex items-center gap-1 text-gray-400">
                                        <Clock className="w-3 h-3" />
                                        {lesson.estimatedMinutes} min
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right: CTA + Motivation */}
                    <div className="flex flex-col sm:items-end gap-2">
                        <Link
                            href={lesson.courseSlug !== "#"
                                ? `/courses/${lesson.courseSlug}/lessons/${lesson.lessonSlug}`
                                : "/my-learning"
                            }
                        >
                            <Button className="bg-gold-500 hover:bg-gold-600 text-white w-full sm:w-auto">
                                <Zap className="w-4 h-4 mr-2" />
                                Start Now
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                        {lessonsToMilestone > 0 && (
                            <p className="text-xs text-gold-600 font-medium">
                                {lessonsToMilestone} lessons to next milestone 🎯
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
