"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    GraduationCap, Play, CheckCircle2, Zap, ChevronRight,
    Trophy, Heart, Star, Sparkles,
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

    // Check for completion and trigger celebration
    useEffect(() => {
        if (isComplete && !completing) {
            setCompleting(true);
            // Call completion API
            fetch("/api/mini-diploma/complete", { method: "POST" })
                .then(res => res.json())
                .then(() => {
                    // Redirect to celebration page
                    router.push("/my-mini-diploma/complete");
                })
                .catch(console.error)
                .finally(() => setCompleting(false));
        }
    }, [isComplete, completing, router]);

    // Test completion handler
    const handleTestComplete = async () => {
        setCompleting(true);
        try {
            await fetch("/api/mini-diploma/complete", { method: "POST" });
            router.push("/my-mini-diploma/complete");
        } catch (error) {
            console.error(error);
            setCompleting(false);
        }
    };

    const categoryName = categoryLabels[user.miniDiplomaCategory] || user.miniDiplomaCategory;

    return (
        <div className="min-h-screen bg-gradient-to-b from-burgundy-50 via-white to-white">
            {/* Hero Section with improved design */}
            <section className="max-w-4xl mx-auto px-6 py-12">
                {/* Welcome Card - Premium Design */}
                <div className="relative bg-gradient-to-br from-white via-white to-burgundy-50 rounded-3xl shadow-lg border border-burgundy-100 p-8 mb-8 overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-gold-100/30 to-burgundy-100/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

                    <div className="relative">
                        {/* Header with icon */}
                        <div className="flex items-start justify-between mb-6">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-burgundy-500 to-burgundy-700 flex items-center justify-center shadow-lg">
                                    <GraduationCap className="w-8 h-8 text-white" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <Badge className="bg-green-100 text-green-700 border-green-200 font-semibold">
                                            <Heart className="w-3 h-3 mr-1 fill-green-500" /> FREE ACCESS
                                        </Badge>
                                    </div>
                                    <h3 className="text-sm font-medium text-burgundy-600">{categoryName} Mini Diploma</h3>
                                </div>
                            </div>

                            {/* Test button (for dev/testing) */}
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleTestComplete}
                                disabled={completing}
                                className="text-xs border-dashed border-gray-300 text-gray-500 hover:text-burgundy-600 hover:border-burgundy-300"
                            >
                                {completing ? "Completing..." : "🧪 Test Complete"}
                            </Button>
                        </div>

                        {/* Welcome message */}
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            Welcome back, {user.firstName}! ✨
                        </h1>
                        <p className="text-gray-600 text-lg mb-8 max-w-xl">
                            Continue your journey to becoming a certified practitioner.
                            Complete all modules to unlock your <span className="text-burgundy-600 font-semibold">official certificate</span> and <span className="text-gold-600 font-semibold">graduate badge</span>!
                        </p>

                        {/* Progress Section */}
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-burgundy-100 flex items-center justify-center">
                                        <Trophy className="w-4 h-4 text-burgundy-600" />
                                    </div>
                                    <span className="font-semibold text-gray-900">Your Progress</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-burgundy-600">{progressPercent}%</span>
                                    <span className="text-sm text-gray-500 ml-1">complete</span>
                                </div>
                            </div>

                            <Progress value={progressPercent} className="h-3 bg-gray-100 mb-3" />

                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">{completedCount} of {totalLessons} lessons completed</span>
                                {progressPercent === 0 && (
                                    <span className="text-burgundy-600 font-medium">🚀 Let's get started!</span>
                                )}
                                {progressPercent > 0 && progressPercent < 50 && (
                                    <span className="text-blue-600 font-medium">💪 Great progress!</span>
                                )}
                                {progressPercent >= 50 && progressPercent < 100 && (
                                    <span className="text-green-600 font-medium">🔥 Almost there!</span>
                                )}
                                {progressPercent === 100 && (
                                    <span className="text-green-600 font-medium">🎉 Complete!</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Encouragement Card based on progress */}
                {progressPercent > 0 && progressPercent < 100 && (
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-xl p-4 mb-8 flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <Sparkles className="w-6 h-6 text-green-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-green-800">Keep going, you're doing amazing! 💪</p>
                            <p className="text-sm text-green-600">
                                {progressPercent < 50
                                    ? "Every lesson brings you closer to your certificate."
                                    : "So close to earning your Mini Diploma certificate!"}
                            </p>
                        </div>
                    </div>
                )}

                {/* Course Content */}
                {course ? (
                    <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                        <div className="p-6 border-b bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                        <GraduationCap className="w-5 h-5 text-burgundy-600" />
                                        {course.title}
                                    </h2>
                                    <p className="text-gray-500 mt-1">{course.modules.length} modules • {totalLessons} lessons</p>
                                </div>
                                {isComplete && (
                                    <Badge className="bg-green-100 text-green-700">
                                        <Trophy className="w-3 h-3 mr-1" /> Completed
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="divide-y">
                            {course.modules.map((module, moduleIndex) => {
                                const moduleCompletedCount = module.lessons.filter(l => completedLessonIds.includes(l.id)).length;
                                const moduleComplete = moduleCompletedCount === module.lessons.length;

                                return (
                                    <div key={module.id} className="p-6">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${moduleComplete ? 'bg-green-100 text-green-600' : 'bg-burgundy-100 text-burgundy-600'
                                                }`}>
                                                {moduleComplete ? <CheckCircle2 className="w-5 h-5" /> : <span className="font-bold">{moduleIndex + 1}</span>}
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-gray-900">{module.title}</h3>
                                                <p className="text-sm text-gray-500">{moduleCompletedCount}/{module.lessons.length} lessons completed</p>
                                            </div>
                                            {moduleComplete && (
                                                <Badge variant="outline" className="text-green-600 border-green-200 text-xs">
                                                    <Star className="w-3 h-3 mr-1 fill-green-500" /> Done
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="ml-14 space-y-2">
                                            {module.lessons.map((lesson) => {
                                                const isCompleted = completedLessonIds.includes(lesson.id);
                                                return (
                                                    <Link
                                                        key={lesson.id}
                                                        href={`/learning/${course.slug}/${lesson.id}`}
                                                        className={`flex items-center gap-3 p-3 rounded-lg transition-all ${isCompleted
                                                            ? 'bg-green-50 hover:bg-green-100 border border-green-100'
                                                            : 'bg-gray-50 hover:bg-gray-100 hover:border-gray-200 border border-transparent'
                                                            }`}
                                                    >
                                                        {isCompleted ? (
                                                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                        ) : (
                                                            <Play className="w-5 h-5 text-burgundy-600" />
                                                        )}
                                                        <span className={`text-sm flex-1 ${isCompleted ? 'text-green-700' : 'text-gray-700'}`}>
                                                            {lesson.title}
                                                        </span>
                                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                                    </Link>
                                                );
                                            })}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border p-12 text-center">
                        <GraduationCap className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">Course Coming Soon</h3>
                        <p className="text-gray-500">
                            Your {categoryName} Mini Diploma is being prepared.
                            Check back soon!
                        </p>
                    </div>
                )}

                {/* Continue Learning Card - Only shows if not complete */}
                {course && completedCount < totalLessons && (
                    <div className="mt-8 bg-gradient-to-r from-burgundy-600 to-burgundy-700 rounded-2xl p-6 text-white">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                                <Zap className="w-7 h-7 text-gold-400" />
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg">Continue Where You Left Off</h3>
                                {(() => {
                                    for (const module of course.modules) {
                                        for (const lesson of module.lessons) {
                                            if (!completedLessonIds.includes(lesson.id)) {
                                                return (
                                                    <>
                                                        <p className="text-burgundy-100 text-sm">Up next: {lesson.title}</p>
                                                        <Link href={`/learning/${course.slug}/${lesson.id}`}>
                                                            <Button size="sm" className="mt-3 bg-white text-burgundy-700 hover:bg-gold-100">
                                                                <Play className="w-4 h-4 mr-2" /> Start Lesson
                                                            </Button>
                                                        </Link>
                                                    </>
                                                );
                                            }
                                        }
                                    }
                                    return null;
                                })()}
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}
