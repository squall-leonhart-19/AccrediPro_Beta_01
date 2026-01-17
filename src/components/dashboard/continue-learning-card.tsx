"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, ArrowRight, Flame, Award, CheckCircle } from "lucide-react";

interface ContinueLearningCardProps {
    nextLesson: {
        title: string;
        courseSlug: string;
        lessonId: string;
        moduleName: string;
    };
    clientReadyProgress: number;
    lessonsToClientReady: number;
    currentStreak: number;
    certificates: number;
    completedLessonsCount: number;
}

export function ContinueLearningCard({
    nextLesson,
    clientReadyProgress,
    lessonsToClientReady,
    currentStreak,
    certificates,
    completedLessonsCount,
}: ContinueLearningCardProps) {
    return (
        <Card className="shadow-xl overflow-hidden border-0" style={{ background: '#ffffff' }}>
            <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                    {/* Left: Progress Info */}
                    <div className="flex-1 p-5 sm:p-6 lg:p-8">
                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <Badge
                                className="border-0 font-bold"
                                style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#16a34a' }}
                            >
                                <Play className="w-3 h-3 mr-1" />
                                Up Next
                            </Badge>
                            {lessonsToClientReady > 0 && (
                                <Badge
                                    variant="outline"
                                    className="text-xs font-bold"
                                    style={{ borderColor: '#d4af37', color: '#b8860b' }}
                                >
                                    {lessonsToClientReady} to client-ready!
                                </Badge>
                            )}
                        </div>

                        {/* Lesson Title */}
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-black mb-2 line-clamp-2" style={{ color: '#1e293b' }}>
                            {nextLesson.title}
                        </h2>
                        <p className="text-gray-600 text-sm mb-4">
                            {nextLesson.moduleName} • ~12 min
                        </p>

                        {/* Client-Ready Progress - Gold styled */}
                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600 font-medium">Client-Ready Progress</span>
                                <span className="font-black" style={{ color: '#722f37' }}>{clientReadyProgress}%</span>
                            </div>
                            <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#f1f5f9' }}>
                                <div
                                    className="h-full rounded-full transition-all"
                                    style={{
                                        width: `${clientReadyProgress}%`,
                                        background: 'linear-gradient(135deg, #d4af37 0%, #f7e7a0 50%, #d4af37 100%)'
                                    }}
                                />
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {clientReadyProgress >= 100
                                    ? "✅ You're ready to take on clients!"
                                    : `Complete ${lessonsToClientReady} more lessons to start earning`}
                            </p>
                        </div>

                        {/* CTA Button - Gold Metallic */}
                        <Link href={`/learning/${nextLesson.courseSlug}/${nextLesson.lessonId}`}>
                            <Button
                                size="lg"
                                className="shadow-lg w-full sm:w-auto text-base sm:text-lg py-5 sm:py-6 border-0 font-bold hover:brightness-105"
                                style={{
                                    background: 'linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)',
                                    color: '#4e1f24'
                                }}
                            >
                                ✨ Continue Learning
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </div>

                    {/* Right: Stats - Premium Burgundy Sidebar */}
                    <div
                        className="lg:w-64 p-4 sm:p-5 lg:p-6 border-t lg:border-t-0 lg:border-l"
                        style={{
                            background: 'linear-gradient(180deg, #4e1f24 0%, #722f37 100%)',
                            borderColor: 'rgba(212, 175, 55, 0.3)'
                        }}
                    >
                        <h3 className="text-sm font-bold mb-3 lg:mb-4" style={{ color: '#d4af37' }}>Your Stats</h3>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 lg:gap-4">
                            <div className="flex flex-col lg:flex-row items-center lg:items-center gap-1 lg:gap-3 text-center lg:text-left">
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }}
                                >
                                    <Flame className="w-5 h-5" style={{ color: '#d4af37' }} />
                                </div>
                                <div>
                                    <p className="text-lg sm:text-xl lg:text-2xl font-black text-white">{currentStreak}</p>
                                    <p className="text-xs" style={{ color: '#d4af37' }}>Day Streak</p>
                                </div>
                            </div>
                            <div className="flex flex-col lg:flex-row items-center lg:items-center gap-1 lg:gap-3 text-center lg:text-left">
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }}
                                >
                                    <Award className="w-5 h-5" style={{ color: '#d4af37' }} />
                                </div>
                                <div>
                                    <p className="text-lg sm:text-xl lg:text-2xl font-black text-white">{certificates}</p>
                                    <p className="text-xs" style={{ color: '#d4af37' }}>Certificates</p>
                                </div>
                            </div>
                            <div className="flex flex-col lg:flex-row items-center lg:items-center gap-1 lg:gap-3 text-center lg:text-left">
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: 'rgba(212, 175, 55, 0.2)' }}
                                >
                                    <CheckCircle className="w-5 h-5" style={{ color: '#d4af37' }} />
                                </div>
                                <div>
                                    <p className="text-lg sm:text-xl lg:text-2xl font-black text-white">{completedLessonsCount}</p>
                                    <p className="text-xs" style={{ color: '#d4af37' }}>Lessons Done</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
