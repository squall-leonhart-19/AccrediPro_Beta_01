"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
    Calendar,
    CheckCircle,
    Circle,
    PlayCircle,
    Clock,
    Target,
    Flame,
    ArrowRight,
    Loader2,
} from "lucide-react";
import Link from "next/link";

// Types for dynamic data
interface WeeklyLesson {
    id: string;
    title: string;
    duration: string;
    status: "completed" | "current" | "upcoming";
    moduleName: string;
    lessonUrl: string;
}

interface ThisWeekData {
    weekNumber: number;
    startDate: string;
    endDate: string;
    goal: string;
    lessonsPlanned: number;
    lessonsCompleted: number;
    streakDays: number;
    certificationDate: string;
    daysUntilCert: number;
    lessons: WeeklyLesson[];
    currentCourseName: string;
    currentCourseSlug: string;
}

export default function ThisWeekPage() {
    const [loading, setLoading] = useState(true);
    const [weekData, setWeekData] = useState<ThisWeekData | null>(null);

    useEffect(() => {
        // Generate dynamic week data based on current date
        const generateWeekData = () => {
            const now = new Date();
            const dayOfWeek = now.getDay();

            // Calculate start of week (Monday)
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - ((dayOfWeek + 6) % 7));

            // Calculate end of week (Sunday)
            const endOfWeek = new Date(startOfWeek);
            endOfWeek.setDate(startOfWeek.getDate() + 6);

            // Calculate certification date (45 days from now max)
            const certDate = new Date(now);
            certDate.setDate(now.getDate() + 45);
            const daysUntilCert = 45;

            // Format dates
            const formatDate = (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

            const data: ThisWeekData = {
                weekNumber: Math.ceil((now.getDate() + startOfWeek.getDay()) / 7),
                startDate: formatDate(startOfWeek),
                endDate: formatDate(endOfWeek),
                goal: "Complete your weekly lessons",
                lessonsPlanned: 5,
                lessonsCompleted: 2,
                streakDays: 4,
                certificationDate: formatDate(certDate),
                daysUntilCert,
                currentCourseName: "Functional Medicine Complete Certification",
                currentCourseSlug: "functional-medicine-complete-certification",
                lessons: [
                    {
                        id: "1",
                        title: "Understanding Complete Blood Count (CBC)",
                        duration: "18 min",
                        status: "completed" as const,
                        moduleName: "Lab Analysis",
                        lessonUrl: "/courses/functional-medicine-complete-certification/learn",
                    },
                    {
                        id: "2",
                        title: "Comprehensive Metabolic Panel Interpretation",
                        duration: "22 min",
                        status: "completed" as const,
                        moduleName: "Lab Analysis",
                        lessonUrl: "/courses/functional-medicine-complete-certification/learn",
                    },
                    {
                        id: "3",
                        title: "Thyroid Panel Deep Dive",
                        duration: "25 min",
                        status: "current" as const,
                        moduleName: "Lab Analysis",
                        lessonUrl: "/courses/functional-medicine-complete-certification/learn",
                    },
                    {
                        id: "4",
                        title: "Iron Studies & Anemia Markers",
                        duration: "20 min",
                        status: "upcoming" as const,
                        moduleName: "Lab Analysis",
                        lessonUrl: "/courses/functional-medicine-complete-certification/learn",
                    },
                    {
                        id: "5",
                        title: "Inflammatory Markers (CRP, ESR)",
                        duration: "15 min",
                        status: "upcoming" as const,
                        moduleName: "Lab Analysis",
                        lessonUrl: "/courses/functional-medicine-complete-certification/learn",
                    },
                ],
            };

            setWeekData(data);
            setLoading(false);
        };

        generateWeekData();
    }, []);

    if (loading || !weekData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-burgundy-50 via-white to-gold-50/30 p-6 lg:p-8 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-burgundy-600 mx-auto mb-3" />
                    <p className="text-gray-500">Loading your weekly plan...</p>
                </div>
            </div>
        );
    }

    const progress = Math.round((weekData.lessonsCompleted / weekData.lessonsPlanned) * 100);

    return (
        <div className="min-h-screen bg-gradient-to-br from-burgundy-50 via-white to-gold-50/30 p-6 lg:p-8">
            {/* Header */}
            <div className="max-w-3xl mx-auto mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-gradient-to-br from-burgundy-500 to-burgundy-600 rounded-xl text-white">
                        <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-burgundy-900">This Week</h1>
                        <p className="text-gray-500 text-sm">{weekData.startDate} - {weekData.endDate}</p>
                    </div>
                </div>
            </div>

            {/* Weekly Goal Card */}
            <div className="max-w-3xl mx-auto mb-6">
                <Card className="p-6 bg-gradient-to-r from-burgundy-600 to-burgundy-800 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-3">
                            <Target className="w-5 h-5 text-gold-400" />
                            <span className="text-sm text-white/70">WEEKLY GOAL</span>
                        </div>
                        <h2 className="text-xl font-semibold mb-4">{weekData.goal}</h2>

                        <div className="flex items-center gap-4 mb-2">
                            <div className="flex-1">
                                <Progress value={progress} className="h-3 bg-white/20" />
                            </div>
                            <span className="font-bold text-gold-400">{weekData.lessonsCompleted}/{weekData.lessonsPlanned}</span>
                        </div>
                        <p className="text-sm text-white/70">
                            {weekData.lessonsPlanned - weekData.lessonsCompleted} lessons left this week
                        </p>
                    </div>
                </Card>
            </div>

            {/* Streak Banner */}
            <div className="max-w-3xl mx-auto mb-6">
                <Card className="p-4 bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg text-white">
                                <Flame className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="font-semibold text-orange-800">🔥 {weekData.streakDays} Day Streak!</p>
                                <p className="text-sm text-orange-600">Keep learning to maintain your streak</p>
                            </div>
                        </div>
                        <Badge className="bg-orange-500 text-white">On Fire!</Badge>
                    </div>
                </Card>
            </div>

            {/* Today's Lessons */}
            <div className="max-w-3xl mx-auto">
                <h3 className="text-lg font-semibold text-burgundy-900 mb-4">Your Lessons This Week</h3>

                <div className="space-y-3">
                    {weekData.lessons.map((lesson) => (
                        <Card
                            key={lesson.id}
                            className={`p-4 transition-all ${lesson.status === 'current'
                                ? 'border-2 border-burgundy-400 bg-gradient-to-r from-burgundy-50 to-white shadow-lg ring-2 ring-burgundy-200'
                                : lesson.status === 'completed'
                                    ? 'bg-emerald-50/50 border-emerald-200'
                                    : 'bg-white hover:shadow-md'
                                }`}
                        >
                            <div className="flex items-center gap-4">
                                {/* Status indicator */}
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${lesson.status === 'completed'
                                    ? 'bg-emerald-500'
                                    : lesson.status === 'current'
                                        ? 'bg-burgundy-500'
                                        : 'bg-gray-100'
                                    }`}>
                                    {lesson.status === 'completed' ? (
                                        <CheckCircle className="w-5 h-5 text-white" />
                                    ) : lesson.status === 'current' ? (
                                        <PlayCircle className="w-5 h-5 text-white" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-gray-400" />
                                    )}
                                </div>

                                {/* Lesson info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className={`font-medium ${lesson.status === 'completed' ? 'text-emerald-700 line-through' : 'text-gray-900'
                                            }`}>
                                            {lesson.title}
                                        </span>
                                        {lesson.status === 'current' && (
                                            <Badge className="bg-burgundy-500 text-white text-[10px]">START HERE</Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            {lesson.duration}
                                        </span>
                                        <span>{lesson.moduleName}</span>
                                    </div>
                                </div>

                                {/* Action button */}
                                {lesson.status === 'current' && (
                                    <Link href={lesson.lessonUrl}>
                                        <Button size="sm" className="bg-burgundy-600 hover:bg-burgundy-700">
                                            Start <ArrowRight className="w-3 h-3 ml-1" />
                                        </Button>
                                    </Link>
                                )}
                                {lesson.status === 'completed' && (
                                    <span className="text-sm text-emerald-600 font-medium">✓ Done</span>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Motivation footer - DYNAMIC DATES */}
                <div className="mt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        Complete all lessons by Sunday to stay on track for your
                        <span className="font-semibold text-burgundy-600"> {weekData.certificationDate}</span> certification goal!
                        <span className="text-emerald-600 font-semibold"> ({weekData.daysUntilCert} days)</span> 🎯
                    </p>
                </div>
            </div>
        </div>
    );
}
