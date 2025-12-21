import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    BookOpen,
    Award,
    ArrowRight,
    Play,
    GraduationCap,
    CheckCircle,
    Lock,
    MessageSquare,
    Sparkles,
    Clock,
    Star,
    Zap,
} from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const SARAH_AVATAR = "/coaches/sarah-coach.webp";

// FM Preview Module structure (Module 0 & 1 only)
const FM_PREVIEW_MODULES = [
    {
        number: 0,
        name: "Welcome & Foundations",
        description: "Get oriented with the FM framework",
        color: "burgundy",
        isUnlocked: true,
        lessons: [
            { id: 1, title: "Welcome to FM Certification", duration: "10 min" },
            { id: 2, title: "What is Functional Medicine?", duration: "12 min" },
            { id: 3, title: "The FM Coach Mindset", duration: "8 min" },
        ],
    },
    {
        number: 1,
        name: "Core FM Principles",
        description: "Master the 5 pillars of FM coaching",
        color: "purple",
        isUnlocked: true,
        lessons: [
            { id: 4, title: "The 5 Pillars Overview", duration: "15 min" },
            { id: 5, title: "Systems Thinking in Health", duration: "12 min" },
            { id: 6, title: "Root Cause Analysis Framework", duration: "18 min" },
            { id: 7, title: "Client-Centered Assessment", duration: "14 min" },
            { id: 8, title: "Creating Action Plans", duration: "16 min" },
        ],
    },
];

// Locked modules preview
const LOCKED_MODULES = [
    { number: 2, name: "Body Systems Mastery", description: "Deep dive into interconnected systems" },
    { number: 3, name: "Gut Health & Microbiome", description: "The foundation of whole-body health" },
    { number: 4, name: "Hormonal Balance", description: "Understanding endocrine dynamics" },
    { number: 5, name: "Stress & Nervous System", description: "HPA axis and resilience" },
    { number: 6, name: "Detoxification Pathways", description: "Supporting natural cleansing" },
    { number: 7, name: "Nutrition Foundations", description: "Personalized dietary protocols" },
    { number: 8, name: "Lifestyle Medicine", description: "Sleep, movement, and recovery" },
    { number: 9, name: "Client Practice", description: "Real-world application skills" },
    { number: 10, name: "Business Building", description: "Launch your FM practice" },
    { number: 11, name: "Case Studies", description: "Complex client scenarios" },
    { number: 12, name: "Certification Exam", description: "Final assessment & certification" },
];

async function getFMPreviewData(userId: string) {
    // Get the FM Preview course and enrollment
    const enrollment = await prisma.enrollment.findFirst({
        where: {
            userId,
            course: {
                slug: "fm-preview",
            },
        },
        include: {
            course: {
                include: {
                    modules: {
                        where: { isPublished: true },
                        include: {
                            lessons: {
                                where: { isPublished: true },
                                orderBy: { order: "asc" },
                            },
                        },
                        orderBy: { order: "asc" },
                    },
                },
            },
        },
    });

    if (!enrollment) {
        return null;
    }

    // Get lesson progress for this user
    const lessonProgress = await prisma.lessonProgress.findMany({
        where: {
            userId,
            lesson: {
                module: {
                    courseId: enrollment.courseId,
                },
            },
        },
        select: {
            lessonId: true,
            isCompleted: true,
        },
    });

    const completedLessonIds = new Set(
        lessonProgress.filter((lp) => lp.isCompleted).map((lp) => lp.lessonId)
    );

    // Calculate progress from our defined modules (8 lessons total in Module 0 & 1)
    const totalLessons = FM_PREVIEW_MODULES.reduce((sum, m) => sum + m.lessons.length, 0);

    // For now, use a simple completion count based on what's in the database
    const completedCount = lessonProgress.filter((lp) => lp.isCompleted).length;
    const progress = totalLessons > 0 ? Math.min((completedCount / totalLessons) * 100, 100) : 0;

    const isCompleted = completedCount >= totalLessons;

    return {
        enrollment,
        completedCount,
        totalLessons,
        progress,
        isCompleted,
        completedLessonIds,
    };
}

export default async function FMPreviewPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/login");
    }

    const data = await getFMPreviewData(session.user.id);

    if (!data) {
        redirect("/dashboard");
    }

    const { completedCount, totalLessons, progress, isCompleted } = data;
    const firstName = session.user.firstName || "there";

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-burgundy-50/30">
            {/* Hero Header */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-900" />
                <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/20 rounded-full blur-3xl" />

                <div className="relative max-w-5xl mx-auto px-4 py-10">
                    {/* Welcome Section */}
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                        <div className="relative">
                            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden ring-4 ring-white/20 shadow-2xl">
                                <Image
                                    src={SARAH_AVATAR}
                                    alt="Sarah"
                                    width={96}
                                    height={96}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full border-3 border-white flex items-center justify-center">
                                <Sparkles className="w-3 h-3 text-white" />
                            </div>
                        </div>

                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Badge className="bg-gold-400/30 text-gold-200 border-gold-400/40 font-semibold">
                                    <GraduationCap className="w-3 h-3 mr-1" />
                                    FM Preview Access
                                </Badge>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                                Welcome, {firstName}! 👋
                            </h1>
                            <p className="text-burgundy-200 text-base md:text-lg">
                                You have free access to Module 0 & 1. Complete them to see what&apos;s possible!
                            </p>
                        </div>

                        {/* Quick Stats */}
                        <div className="flex gap-3 mt-4 md:mt-0">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                                <div className="text-2xl font-bold text-white">{completedCount}</div>
                                <div className="text-xs text-burgundy-200">Completed</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                                <div className="text-2xl font-bold text-gold-300">{totalLessons - completedCount}</div>
                                <div className="text-xs text-burgundy-200">Remaining</div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Section */}
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Zap className="w-5 h-5 text-gold-400" />
                                <span className="text-white font-medium">Preview Progress</span>
                            </div>
                            <span className="text-gold-300 font-bold text-lg">
                                {Math.round(progress)}%
                            </span>
                        </div>
                        <div className="relative">
                            <Progress value={progress} className="h-4 bg-white/20" />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-xs font-bold text-white drop-shadow-md">
                                    {completedCount} of {totalLessons} lessons
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-4 py-8 -mt-4">

                {/* Unlocked Modules (0 & 1) */}
                <div className="space-y-6 mb-8">
                    {FM_PREVIEW_MODULES.map((module) => {
                        const colorClasses = {
                            burgundy: {
                                bg: "bg-burgundy-50",
                                border: "border-burgundy-200",
                                text: "text-burgundy-700",
                                badge: "bg-burgundy-100 text-burgundy-700",
                                icon: "bg-burgundy-600",
                            },
                            purple: {
                                bg: "bg-purple-50",
                                border: "border-purple-200",
                                text: "text-purple-700",
                                badge: "bg-purple-100 text-purple-700",
                                icon: "bg-purple-600",
                            },
                        }[module.color] || {
                            bg: "bg-slate-50",
                            border: "border-slate-200",
                            text: "text-slate-700",
                            badge: "bg-slate-100 text-slate-700",
                            icon: "bg-slate-600",
                        };

                        return (
                            <Card key={module.number} className={`border-2 ${colorClasses.border} shadow-lg overflow-hidden`}>
                                {/* Module Header */}
                                <div className={`${colorClasses.bg} px-6 py-4 border-b ${colorClasses.border}`}>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl ${colorClasses.icon} flex items-center justify-center text-white font-bold shadow-md`}>
                                                {module.number}
                                            </div>
                                            <div>
                                                <h3 className={`font-bold ${colorClasses.text}`}>{module.name}</h3>
                                                <p className="text-sm text-slate-500">{module.description}</p>
                                            </div>
                                        </div>
                                        <Badge className="bg-emerald-100 text-emerald-700 border-0">
                                            <BookOpen className="w-3 h-3 mr-1" />
                                            Unlocked
                                        </Badge>
                                    </div>
                                </div>

                                {/* Lessons */}
                                <CardContent className="p-4">
                                    <div className="space-y-2">
                                        {module.lessons.map((lesson, lessonIdx) => (
                                            <div
                                                key={lesson.id}
                                                className="flex items-center gap-4 p-4 rounded-xl bg-slate-50/50 hover:bg-slate-100 transition-all"
                                            >
                                                <div className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 font-bold ${colorClasses.icon} text-white`}>
                                                    {lessonIdx + 1}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-slate-800">{lesson.title}</h4>
                                                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                                        <Clock className="w-3 h-3" />
                                                        {lesson.duration}
                                                    </p>
                                                </div>
                                                <Button size="sm" className={`${colorClasses.icon} hover:opacity-90`}>
                                                    <Play className="w-4 h-4 mr-1" />
                                                    Start
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Upgrade CTA */}
                <Card className="mb-8 border-0 shadow-xl overflow-hidden bg-gradient-to-r from-gold-500 to-amber-500">
                    <CardContent className="p-6 text-center">
                        <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                            <Award className="w-8 h-8 text-gold-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">
                            Ready for the Full Certification?
                        </h2>
                        <p className="text-gold-100 mb-6 max-w-lg mx-auto">
                            Unlock all 12 modules, earn your accredited FM Certification, and transform your coaching career.
                        </p>
                        <Link href="/fm-certification">
                            <Button size="lg" className="bg-white text-gold-600 hover:bg-gold-50 font-bold shadow-lg">
                                Unlock Full Certification
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>

                {/* Locked Modules Preview */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-slate-700 mb-4 flex items-center gap-2">
                        <Lock className="w-5 h-5 text-slate-400" />
                        Full Certification Includes:
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {LOCKED_MODULES.map((module) => (
                            <div
                                key={module.number}
                                className="flex items-center gap-3 p-4 rounded-xl bg-slate-100/50 border border-dashed border-slate-200"
                            >
                                <div className="w-10 h-10 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400 font-bold">
                                    {module.number}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-slate-500">{module.name}</h4>
                                    <p className="text-xs text-slate-400">{module.description}</p>
                                </div>
                                <Lock className="w-4 h-4 text-slate-300 flex-shrink-0" />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Help Card */}
                <Card className="border-2 border-violet-200 shadow-lg bg-gradient-to-r from-violet-50 to-purple-50">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="relative flex-shrink-0">
                                <Image
                                    src={SARAH_AVATAR}
                                    alt="Sarah"
                                    width={56}
                                    height={56}
                                    className="w-14 h-14 rounded-xl object-cover ring-2 ring-violet-200"
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-slate-900">Questions about the certification?</h3>
                                <p className="text-slate-600 text-sm">
                                    Send me a message - I&apos;m here to help!
                                </p>
                            </div>
                            <Link href="/messages">
                                <Button className="bg-violet-600 hover:bg-violet-700 text-white shadow-md">
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    Chat with me
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
