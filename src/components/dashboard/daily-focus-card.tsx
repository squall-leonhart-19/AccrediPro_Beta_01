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
        <Card
            className="border-0 overflow-hidden shadow-xl"
            style={{
                background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.05) 50%, rgba(212, 175, 55, 0.15) 100%)',
                border: '2px solid rgba(212, 175, 55, 0.3)'
            }}
        >
            <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    {/* Left: Icon + Content */}
                    <div className="flex items-start gap-3 flex-1">
                        <div
                            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{
                                background: 'linear-gradient(135deg, #d4af37 0%, #f7e7a0 50%, #d4af37 100%)',
                                boxShadow: '0 2px 10px rgba(212, 175, 55, 0.3)'
                            }}
                        >
                            <Target className="w-6 h-6" style={{ color: '#4e1f24' }} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-bold uppercase tracking-wider" style={{ color: '#722f37' }}>
                                    📌 Today's Focus
                                </span>
                                {currentStreak > 0 && (
                                    <span
                                        className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1 font-bold"
                                        style={{ backgroundColor: 'rgba(234, 88, 12, 0.15)', color: '#ea580c' }}
                                    >
                                        🔥 {currentStreak} day streak
                                    </span>
                                )}
                            </div>
                            <h3 className="font-bold text-sm sm:text-base line-clamp-1" style={{ color: '#1e293b' }}>
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
                                ? `/learning/${lesson.courseSlug}/${lesson.lessonSlug}`
                                : "/my-learning"
                            }
                        >
                            <Button
                                className="w-full sm:w-auto border-0 font-bold"
                                style={{
                                    background: 'linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)',
                                    color: '#4e1f24'
                                }}
                            >
                                <Zap className="w-4 h-4 mr-2" />
                                Start Now
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                        {lessonsToMilestone > 0 && (
                            <p className="text-xs font-bold" style={{ color: '#722f37' }}>
                                {lessonsToMilestone} lessons to next milestone 🎯
                            </p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
