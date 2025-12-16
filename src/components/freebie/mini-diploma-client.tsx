"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    GraduationCap, Play, CheckCircle2, ChevronRight,
    Trophy, Heart, Sparkles, BookOpen, Clock, Award,
    ArrowRight, Lock, FileText,
} from "lucide-react";

interface Lesson {
    id: string;
    title: string;
    order: number;
}

interface Module {
    id: string;
    title: string;
    order: number;
    lessons: Lesson[];
}

interface Course {
    id: string;
    title: string;
    slug: string;
    description: string;
    thumbnail?: string | null;
    price?: number | null;
    modules: Module[];
}

interface MiniDiplomaClientProps {
    user: {
        firstName: string;
        miniDiplomaCategory: string;
    };
    course: Course | null;
    enrollment: { id: string; progress: number } | null;
    completedLessonIds: string[];
}

const categoryLabels: Record<string, string> = {
    "functional-medicine": "Functional Medicine",
    "gut-health": "Gut Health",
    "autism": "Autism & Neurodevelopment",
    "hormones": "Women's Hormones",
};

const moduleDescriptions: Record<number, string> = {
    0: "Meet Sarah and understand your healing journey",
    1: "Learn the 7 Body Systems Model",
    2: "See how functional medicine solves real problems",
    3: "Choose your path: personal healing or certification",
};

export function MiniDiplomaClient({
    user,
    course,
    enrollment,
    completedLessonIds,
}: MiniDiplomaClientProps) {
    const router = useRouter();
    const [completing, setCompleting] = useState(false);

    // Calculate total lessons and progress
    const totalLessons = course?.modules.reduce((sum, m) => sum + m.lessons.length, 0) || 0;
    const completedCount = completedLessonIds.length;
    const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
    const isComplete = totalLessons > 0 && completedCount === totalLessons;

    // Get first uncompleted lesson
    const getNextLesson = () => {
        if (!course) return null;
        for (const module of course.modules) {
            for (const lesson of module.lessons) {
                if (!completedLessonIds.includes(lesson.id)) {
                    return { lesson, module };
                }
            }
        }
        return null;
    };

    const nextLessonInfo = getNextLesson();

    // Check for completion and trigger celebration
    useEffect(() => {
        if (isComplete && !completing) {
            setCompleting(true);
            fetch("/api/mini-diploma/complete", { method: "POST" })
                .then(res => res.json())
                .then(() => {
                    router.push("/my-mini-diploma/complete");
                })
                .catch(console.error)
                .finally(() => setCompleting(false));
        }
    }, [isComplete, completing, router]);

    const categoryName = categoryLabels[user.miniDiplomaCategory] || user.miniDiplomaCategory;

    return (
        <div className="min-h-screen bg-gradient-to-b from-burgundy-50 via-white to-white -m-4 lg:-m-8">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800" />
                <div className="absolute inset-0 bg-[url('/images/pattern-dots.svg')] opacity-5" />

                {/* Decorative circles */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-burgundy-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
                    {/* Badge */}
                    <div className="flex justify-center mb-6">
                        <Badge className="bg-white/10 text-white border-white/20 font-semibold px-4 py-1.5 text-sm backdrop-blur-sm">
                            <Heart className="w-3.5 h-3.5 mr-1.5 fill-red-400 text-red-400" />
                            FREE ACCESS UNLOCKED
                        </Badge>
                    </div>

                    {/* Title */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4">
                            {categoryName} Mini Diploma
                        </h1>
                        <p className="text-burgundy-100 text-lg sm:text-xl max-w-2xl mx-auto">
                            Your first step toward understanding root-cause health
                        </p>
                    </div>

                    {/* Course Stats */}
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 mb-10">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                            <BookOpen className="w-4 h-4 text-gold-400" />
                            <span className="text-white text-sm font-medium">{course?.modules.length || 4} Modules</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                            <Clock className="w-4 h-4 text-gold-400" />
                            <span className="text-white text-sm font-medium">~90 Minutes</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                            <Award className="w-4 h-4 text-gold-400" />
                            <span className="text-white text-sm font-medium">Certificate Included</span>
                        </div>
                    </div>

                    {/* Main CTA Card */}
                    {course && (
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                                {/* Progress Bar at top */}
                                <div className="h-2 bg-gray-100">
                                    <div
                                        className="h-full bg-gradient-to-r from-burgundy-500 to-burgundy-600 transition-all duration-500"
                                        style={{ width: `${progressPercent}%` }}
                                    />
                                </div>

                                <div className="p-6 sm:p-8">
                                    {/* Welcome Message */}
                                    <div className="text-center mb-6">
                                        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-burgundy-100 to-burgundy-50 flex items-center justify-center">
                                            <GraduationCap className="w-8 h-8 text-burgundy-600" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                            {progressPercent === 0
                                                ? `Ready to start, ${user.firstName}?`
                                                : progressPercent < 100
                                                    ? `Welcome back, ${user.firstName}!`
                                                    : `Congratulations, ${user.firstName}!`
                                            }
                                        </h2>
                                        <p className="text-gray-600">
                                            {progressPercent === 0
                                                ? "Begin your journey to understanding root-cause health"
                                                : progressPercent < 100
                                                    ? `You're ${progressPercent}% through your Mini Diploma`
                                                    : "You've completed all modules!"
                                            }
                                        </p>
                                    </div>

                                    {/* Progress Info */}
                                    <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                                        <span>{completedCount} of {totalLessons} lessons completed</span>
                                        <span className="font-semibold text-burgundy-600">{progressPercent}%</span>
                                    </div>
                                    <Progress value={progressPercent} className="h-2 bg-gray-100 mb-6" />

                                    {/* Main CTA Button */}
                                    {nextLessonInfo ? (
                                        <Link href={`/learning/${course.slug}/${nextLessonInfo.lesson.id}`}>
                                            <Button
                                                size="lg"
                                                className="w-full bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-semibold h-14 text-lg shadow-lg shadow-burgundy-200 group"
                                            >
                                                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                                                {progressPercent === 0 ? "Start Learning Now" : "Continue Learning"}
                                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    ) : (
                                        <Button
                                            size="lg"
                                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold h-14 text-lg shadow-lg"
                                            disabled
                                        >
                                            <CheckCircle2 className="w-5 h-5 mr-2" />
                                            All Modules Completed!
                                        </Button>
                                    )}

                                    {/* Next lesson info */}
                                    {nextLessonInfo && (
                                        <p className="text-center text-sm text-gray-500 mt-3">
                                            Up next: <span className="font-medium text-gray-700">{nextLessonInfo.module.title}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Course Curriculum Section */}
            <section className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
                {course ? (
                    <>
                        {/* Section Header */}
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">Course Curriculum</h2>
                                <p className="text-gray-500 mt-1">Complete all modules to earn your certificate</p>
                            </div>
                            {progressPercent > 0 && progressPercent < 100 && (
                                <Badge className="bg-green-100 text-green-700 border-green-200">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    In Progress
                                </Badge>
                            )}
                        </div>

                        {/* Modules List */}
                        <div className="space-y-4">
                            {course.modules.map((module, moduleIndex) => {
                                const moduleCompletedCount = module.lessons.filter(l => completedLessonIds.includes(l.id)).length;
                                const moduleComplete = moduleCompletedCount === module.lessons.length;
                                const isCurrentModule = nextLessonInfo?.module.id === module.id;
                                const isLocked = moduleIndex > 0 && !completedLessonIds.includes(course.modules[moduleIndex - 1]?.lessons[0]?.id || '');

                                return (
                                    <div
                                        key={module.id}
                                        className={`bg-white rounded-xl border-2 overflow-hidden transition-all ${
                                            isCurrentModule
                                                ? 'border-burgundy-200 shadow-lg shadow-burgundy-100'
                                                : moduleComplete
                                                    ? 'border-green-200'
                                                    : 'border-gray-100'
                                        }`}
                                    >
                                        <div className="p-5 sm:p-6">
                                            <div className="flex items-start gap-4">
                                                {/* Module Number/Status */}
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                                    moduleComplete
                                                        ? 'bg-green-100'
                                                        : isCurrentModule
                                                            ? 'bg-burgundy-100'
                                                            : 'bg-gray-100'
                                                }`}>
                                                    {moduleComplete ? (
                                                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                                                    ) : isLocked && moduleIndex > 0 ? (
                                                        <Lock className="w-5 h-5 text-gray-400" />
                                                    ) : (
                                                        <span className={`text-lg font-bold ${
                                                            isCurrentModule ? 'text-burgundy-600' : 'text-gray-400'
                                                        }`}>
                                                            {moduleIndex}
                                                        </span>
                                                    )}
                                                </div>

                                                {/* Module Info */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div>
                                                            <h3 className={`font-semibold text-lg ${
                                                                moduleComplete ? 'text-green-700' : 'text-gray-900'
                                                            }`}>
                                                                {module.title}
                                                            </h3>
                                                            <p className="text-sm text-gray-500 mt-0.5">
                                                                {moduleDescriptions[moduleIndex] || "Learn essential concepts"}
                                                            </p>
                                                        </div>

                                                        {/* Status Badge */}
                                                        {moduleComplete ? (
                                                            <Badge variant="outline" className="text-green-600 border-green-200 flex-shrink-0">
                                                                <CheckCircle2 className="w-3 h-3 mr-1" /> Complete
                                                            </Badge>
                                                        ) : isCurrentModule ? (
                                                            <Badge className="bg-burgundy-100 text-burgundy-700 border-burgundy-200 flex-shrink-0">
                                                                <Play className="w-3 h-3 mr-1" /> Current
                                                            </Badge>
                                                        ) : null}
                                                    </div>

                                                    {/* Lesson Links */}
                                                    <div className="mt-4 space-y-2">
                                                        {module.lessons.map((lesson) => {
                                                            const isCompleted = completedLessonIds.includes(lesson.id);
                                                            const isCurrent = nextLessonInfo?.lesson.id === lesson.id;

                                                            return (
                                                                <Link
                                                                    key={lesson.id}
                                                                    href={`/learning/${course.slug}/${lesson.id}`}
                                                                    className={`flex items-center gap-3 p-3 rounded-lg transition-all group ${
                                                                        isCompleted
                                                                            ? 'bg-green-50 hover:bg-green-100'
                                                                            : isCurrent
                                                                                ? 'bg-burgundy-50 hover:bg-burgundy-100 ring-2 ring-burgundy-200'
                                                                                : 'bg-gray-50 hover:bg-gray-100'
                                                                    }`}
                                                                >
                                                                    {isCompleted ? (
                                                                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                                                                    ) : isCurrent ? (
                                                                        <Play className="w-5 h-5 text-burgundy-600 flex-shrink-0" />
                                                                    ) : (
                                                                        <FileText className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                                                    )}
                                                                    <span className={`text-sm flex-1 ${
                                                                        isCompleted
                                                                            ? 'text-green-700'
                                                                            : isCurrent
                                                                                ? 'text-burgundy-700 font-medium'
                                                                                : 'text-gray-600'
                                                                    }`}>
                                                                        {lesson.title}
                                                                    </span>
                                                                    <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${
                                                                        isCompleted
                                                                            ? 'text-green-400'
                                                                            : isCurrent
                                                                                ? 'text-burgundy-400'
                                                                                : 'text-gray-300'
                                                                    }`} />
                                                                </Link>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Final Exam Card */}
                        <div className="mt-6 bg-gradient-to-r from-gold-50 to-amber-50 rounded-xl border-2 border-gold-200 p-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center flex-shrink-0">
                                    <Trophy className="w-6 h-6 text-gold-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">Final Exam & Certificate</h3>
                                    <p className="text-sm text-gray-600 mt-0.5">
                                        {isComplete
                                            ? "All modules complete! You can now take the final exam."
                                            : "Complete all modules to unlock the final exam and earn your certificate"
                                        }
                                    </p>
                                </div>
                                {isComplete ? (
                                    <Button className="bg-gold-500 hover:bg-gold-600 text-white">
                                        Take Exam <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                ) : (
                                    <Badge variant="outline" className="text-gray-500 border-gray-300">
                                        <Lock className="w-3 h-3 mr-1" /> Locked
                                    </Badge>
                                )}
                            </div>
                        </div>

                        {/* Bottom CTA for continuing */}
                        {nextLessonInfo && (
                            <div className="mt-8 text-center">
                                <Link href={`/learning/${course.slug}/${nextLessonInfo.lesson.id}`}>
                                    <Button
                                        size="lg"
                                        className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-semibold px-8 shadow-lg group"
                                    >
                                        <Play className="w-5 h-5 mr-2" />
                                        {progressPercent === 0 ? "Start Your Journey" : "Continue Learning"}
                                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </>
                ) : (
                    /* Course Coming Soon State */
                    <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
                        <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gray-100 flex items-center justify-center">
                            <GraduationCap className="w-10 h-10 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">Course Coming Soon</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                            Your {categoryName} Mini Diploma is being prepared by our team.
                            We'll notify you as soon as it's ready!
                        </p>
                        <div className="mt-6 inline-flex items-center gap-2 bg-gold-50 text-gold-700 px-4 py-2 rounded-full text-sm font-medium">
                            <Sparkles className="w-4 h-4" />
                            Check back soon
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
