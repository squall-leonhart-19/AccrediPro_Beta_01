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
        <Card className="bg-gradient-to-br from-white to-burgundy-50/50 shadow-sm overflow-hidden">
            <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                    {/* Left: Progress Info */}
                    <div className="flex-1 p-5 sm:p-6 lg:p-8">
                        {/* Badges */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                            <Badge className="bg-green-100 text-green-700 border-0">
                                <Play className="w-3 h-3 mr-1" />
                                Up Next
                            </Badge>
                            {lessonsToClientReady > 0 && (
                                <Badge variant="outline" className="border-gold-300 text-gold-700 text-xs">
                                    {lessonsToClientReady} to client-ready!
                                </Badge>
                            )}
                        </div>

                        {/* Lesson Title */}
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
                            {nextLesson.title}
                        </h2>
                        <p className="text-gray-600 text-sm mb-4">
                            {nextLesson.moduleName} • ~12 min
                        </p>

                        {/* Client-Ready Progress */}
                        <div className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Client-Ready Progress</span>
                                <span className="font-semibold text-burgundy-600">{clientReadyProgress}%</span>
                            </div>
                            <Progress value={clientReadyProgress} className="h-2 sm:h-3" />
                            <p className="text-xs text-gray-500 mt-1">
                                {clientReadyProgress >= 100
                                    ? "✅ You're ready to take on clients!"
                                    : `Complete ${lessonsToClientReady} more lessons to start earning`}
                            </p>
                        </div>

                        {/* CTA Button */}
                        <Link href={`/learning/${nextLesson.courseSlug}/${nextLesson.lessonId}`}>
                            <Button
                                size="lg"
                                className="bg-burgundy-600 hover:bg-burgundy-700 text-white shadow-lg w-full sm:w-auto text-base sm:text-lg py-5 sm:py-6"
                            >
                                Continue Learning
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </div>

                    {/* Right: Stats - Horizontal on mobile, vertical sidebar on desktop */}
                    <div className="lg:w-64 bg-burgundy-50 p-4 sm:p-5 lg:p-6 border-t lg:border-t-0 lg:border-l border-burgundy-100">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 lg:mb-4">Your Stats</h3>

                        {/* Stats Grid - 3 columns on mobile, vertical on desktop */}
                        <div className="grid grid-cols-3 lg:grid-cols-1 gap-3 lg:gap-4">
                            <div className="flex flex-col lg:flex-row items-center lg:items-center gap-1 lg:gap-3 text-center lg:text-left">
                                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center flex-shrink-0">
                                    <Flame className="w-5 h-5 text-orange-500" />
                                </div>
                                <div>
                                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{currentStreak}</p>
                                    <p className="text-xs text-gray-500">Day Streak</p>
                                </div>
                            </div>
                            <div className="flex flex-col lg:flex-row items-center lg:items-center gap-1 lg:gap-3 text-center lg:text-left">
                                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <Award className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{certificates}</p>
                                    <p className="text-xs text-gray-500">Certificates</p>
                                </div>
                            </div>
                            <div className="flex flex-col lg:flex-row items-center lg:items-center gap-1 lg:gap-3 text-center lg:text-left">
                                <div className="w-10 h-10 rounded-lg bg-burgundy-100 flex items-center justify-center flex-shrink-0">
                                    <CheckCircle className="w-5 h-5 text-burgundy-600" />
                                </div>
                                <div>
                                    <p className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{completedLessonsCount}</p>
                                    <p className="text-xs text-gray-500">Lessons Done</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
