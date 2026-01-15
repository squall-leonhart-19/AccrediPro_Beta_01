"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Play,
    CheckCircle,
    Lock,
    Trophy,
    Sparkles,
    ArrowRight,
    Clock,
    BookOpen,
    Target,
    Award,
    GraduationCap,
    Timer,
} from "lucide-react";
import { DashboardPWABanner } from "@/components/dashboard/pwa-banner";

// Module structure type
interface ModuleConfig {
    id: number;
    title: string;
    description: string;
    icon: "BookOpen" | "Target" | "Award";
    lessons: { id: number; title: string; duration: string }[];
}

// Diploma configuration type
export interface DiplomaConfig {
    slug: string;
    name: string;
    shortName: string;
    modules: ModuleConfig[];
    coachName: string;
    coachImage: string;
}

interface LeadPortalDashboardProps {
    firstName: string;
    completedLessons: number[];
    config: DiplomaConfig;
}

const ICONS = {
    BookOpen,
    Target,
    Award,
};

export function LeadPortalDashboard({
    firstName,
    completedLessons,
    config,
}: LeadPortalDashboardProps) {
    // Calculate progress
    const totalLessons = config.modules.reduce((acc, m) => acc + m.lessons.length, 0);
    const lessonsCompleted = completedLessons.length;
    const progressPercent = Math.round((lessonsCompleted / totalLessons) * 100);
    const isAllComplete = lessonsCompleted === totalLessons;

    // Calculate time remaining (estimate 7 min per lesson)
    const lessonsRemaining = totalLessons - lessonsCompleted;
    const timeRemaining = lessonsRemaining * 7;

    // Find next lesson
    const allLessons = config.modules.flatMap(m => m.lessons);
    const nextLessonId = completedLessons.length > 0
        ? Math.max(...completedLessons) + 1
        : 1;

    const basePath = `/${config.slug}`;

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
            {/* Top Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Image
                            src="/asi-logo.png"
                            alt="ASI"
                            width={48}
                            height={48}
                            className="rounded"
                        />
                        <div>
                            <h1 className="font-bold text-lg text-slate-900">{config.shortName} Foundation</h1>
                            <p className="text-sm text-slate-500">ASI-Verified Mini Diploma</p>
                        </div>
                    </div>
                    {!isAllComplete && (
                        <Badge className="bg-amber-100 text-amber-800 border-amber-300">
                            <Timer className="w-3 h-3 mr-1" />
                            7 Days Access
                        </Badge>
                    )}
                </div>
            </div>

            {/* PWA Install Banner */}
            <DashboardPWABanner />

            <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
                {/* Welcome + Progress Section */}
                <div className="grid lg:grid-cols-3 gap-4">
                    {/* Welcome Card */}
                    <Card className="lg:col-span-2 border-0 shadow-md bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 text-white overflow-hidden">
                        <CardContent className="p-6 relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/10 rounded-full blur-3xl" />
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center overflow-hidden flex-shrink-0">
                                    <Image
                                        src={config.coachImage}
                                        alt={config.coachName}
                                        width={56}
                                        height={56}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1">
                                    <p className="text-burgundy-200 text-sm">Coach {config.coachName}</p>
                                    <h2 className="text-xl font-bold mb-2">
                                        {lessonsCompleted === 0
                                            ? `Welcome, ${firstName}! 👋`
                                            : lessonsCompleted < 5
                                                ? `Great progress, ${firstName}! 💪`
                                                : isAllComplete
                                                    ? `Congratulations, ${firstName}! 🎉`
                                                    : `Almost there, ${firstName}! 🔥`
                                        }
                                    </h2>
                                    <p className="text-burgundy-100 text-sm">
                                        {lessonsCompleted === 0
                                            ? `Ready to start your ${config.shortName} certification journey?`
                                            : isAllComplete
                                                ? "You've completed all lessons! Time to claim your certificate."
                                                : `You've completed ${lessonsCompleted} of ${totalLessons} lessons. Keep going!`
                                        }
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Stats Card */}
                    <Card className="border-0 shadow-md">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-medium text-slate-600">Your Progress</span>
                                <span className="text-lg font-bold text-burgundy-600">{progressPercent}%</span>
                            </div>
                            <Progress value={progressPercent} className="h-2 mb-4" />
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50 rounded-lg p-3 text-center">
                                    <div className="flex items-center justify-center gap-1 text-emerald-600 mb-1">
                                        <CheckCircle className="w-4 h-4" />
                                        <span className="font-bold">{lessonsCompleted}/{totalLessons}</span>
                                    </div>
                                    <p className="text-xs text-slate-500">Completed</p>
                                </div>
                                <div className="bg-slate-50 rounded-lg p-3 text-center">
                                    <div className="flex items-center justify-center gap-1 text-blue-600 mb-1">
                                        <Clock className="w-4 h-4" />
                                        <span className="font-bold">{timeRemaining}m</span>
                                    </div>
                                    <p className="text-xs text-slate-500">Remaining</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Completion CTA */}
                {isAllComplete && (
                    <Card className="border-0 shadow-lg bg-gradient-to-r from-gold-500 to-gold-600 text-white">
                        <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                                    <GraduationCap className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">Your Certificate is Ready! 🎓</h3>
                                    <p className="text-gold-100">Download your ASI-verified foundation certificate</p>
                                </div>
                            </div>
                            <Link href={`${basePath}/complete`}>
                                <Button size="lg" className="bg-white text-gold-700 hover:bg-gold-50 font-bold w-full sm:w-auto">
                                    Claim Certificate
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {/* Next Lesson CTA (if not complete) */}
                {!isAllComplete && nextLessonId <= totalLessons && (
                    <Card className="border-2 border-burgundy-200 shadow-md bg-burgundy-50">
                        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-burgundy-600 flex items-center justify-center">
                                    <Play className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="text-sm text-burgundy-600 font-medium flex items-center gap-1">
                                        <Sparkles className="w-3 h-3" /> Continue Learning
                                    </p>
                                    <h3 className="font-bold text-slate-900">
                                        Lesson {nextLessonId}: {allLessons.find(l => l.id === nextLessonId)?.title}
                                    </h3>
                                </div>
                            </div>
                            <Link href={`${basePath}/lesson/${nextLessonId}`}>
                                <Button className="bg-burgundy-600 hover:bg-burgundy-700 text-white font-semibold w-full sm:w-auto">
                                    Start Lesson
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                )}

                {/* Modules Grid */}
                <div className="space-y-6">
                    <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-burgundy-600" />
                        Course Curriculum
                    </h2>

                    {config.modules.map((module) => {
                        const moduleLessonsComplete = module.lessons.filter(l =>
                            completedLessons.includes(l.id)
                        ).length;
                        const moduleComplete = moduleLessonsComplete === module.lessons.length;
                        const ModuleIcon = ICONS[module.icon];

                        return (
                            <Card key={module.id} className="border-0 shadow-md overflow-hidden">
                                {/* Module Header */}
                                <div className={`px-5 py-4 border-b ${moduleComplete ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${moduleComplete ? 'bg-emerald-500 text-white' : 'bg-burgundy-100 text-burgundy-600'}`}>
                                                {moduleComplete ? <CheckCircle className="w-5 h-5" /> : <ModuleIcon className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-900">Module {module.id}: {module.title}</h3>
                                                <p className="text-sm text-slate-500">{module.description}</p>
                                            </div>
                                        </div>
                                        <Badge className={moduleComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}>
                                            {moduleLessonsComplete}/{module.lessons.length} Complete
                                        </Badge>
                                    </div>
                                </div>

                                {/* Lessons */}
                                <CardContent className="p-0">
                                    <div className="divide-y divide-slate-100">
                                        {module.lessons.map((lesson) => {
                                            const isCompleted = completedLessons.includes(lesson.id);
                                            const isNext = lesson.id === nextLessonId;
                                            const prevCompleted = lesson.id === 1 || completedLessons.includes(lesson.id - 1);
                                            const isLocked = !isCompleted && !prevCompleted;

                                            return (
                                                <div
                                                    key={lesson.id}
                                                    className={`flex items-center gap-4 px-5 py-4 transition-colors ${isCompleted
                                                        ? 'bg-white'
                                                        : isNext
                                                            ? 'bg-burgundy-50/50'
                                                            : isLocked
                                                                ? 'bg-slate-50/50 opacity-60'
                                                                : 'bg-white hover:bg-slate-50'
                                                        }`}
                                                >
                                                    {/* Lesson Number/Icon */}
                                                    <div
                                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${isCompleted
                                                            ? 'bg-emerald-500 text-white'
                                                            : isNext
                                                                ? 'bg-burgundy-600 text-white'
                                                                : isLocked
                                                                    ? 'bg-slate-200 text-slate-400'
                                                                    : 'bg-slate-200 text-slate-600'
                                                            }`}
                                                    >
                                                        {isCompleted ? (
                                                            <CheckCircle className="w-5 h-5" />
                                                        ) : isLocked ? (
                                                            <Lock className="w-4 h-4" />
                                                        ) : (
                                                            lesson.id
                                                        )}
                                                    </div>

                                                    {/* Lesson Info */}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className={`font-medium truncate ${isCompleted ? 'text-slate-700' : isLocked ? 'text-slate-400' : 'text-slate-900'}`}>
                                                            {lesson.title}
                                                        </h4>
                                                        <p className="text-xs text-slate-400 flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {lesson.duration}
                                                        </p>
                                                    </div>

                                                    {/* Action */}
                                                    <div className="flex-shrink-0">
                                                        {isCompleted ? (
                                                            <Link href={`${basePath}/lesson/${lesson.id}`}>
                                                                <Button size="sm" variant="ghost" className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
                                                                    <CheckCircle className="w-4 h-4 mr-1" />
                                                                    <span className="hidden sm:inline">Review</span>
                                                                </Button>
                                                            </Link>
                                                        ) : isNext ? (
                                                            <Link href={`${basePath}/lesson/${lesson.id}`}>
                                                                <Button size="sm" className="bg-burgundy-600 hover:bg-burgundy-700 text-white">
                                                                    <Play className="w-4 h-4 sm:mr-1" />
                                                                    <span className="hidden sm:inline">Start</span>
                                                                </Button>
                                                            </Link>
                                                        ) : isLocked ? (
                                                            <span className="text-xs text-slate-400 flex items-center gap-1">
                                                                <Lock className="w-3 h-3" />
                                                                <span className="hidden sm:inline">Locked</span>
                                                            </span>
                                                        ) : (
                                                            <Link href={`${basePath}/lesson/${lesson.id}`}>
                                                                <Button size="sm" variant="outline" className="border-slate-300">
                                                                    Start
                                                                </Button>
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Certificate Preview */}
                {!isAllComplete && (
                    <Card className="border-0 shadow-md overflow-hidden">
                        <CardContent className="p-6">
                            <div className="flex flex-col sm:flex-row items-center gap-6">
                                <div className="relative w-32 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg flex items-center justify-center opacity-50 flex-shrink-0">
                                    <GraduationCap className="w-12 h-12 text-slate-400" />
                                    <Lock className="w-6 h-6 text-slate-500 absolute bottom-2 right-2" />
                                </div>
                                <div className="text-center sm:text-left">
                                    <h3 className="font-bold text-slate-900 mb-1">Your Certificate Awaits</h3>
                                    <p className="text-sm text-slate-500 mb-2">
                                        Complete all {totalLessons} lessons to unlock your ASI-Verified Foundation Certificate
                                    </p>
                                    <div className="flex items-center justify-center sm:justify-start gap-2">
                                        <Progress value={progressPercent} className="w-32 h-2" />
                                        <span className="text-xs text-slate-500">{lessonsRemaining} lessons to go</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
