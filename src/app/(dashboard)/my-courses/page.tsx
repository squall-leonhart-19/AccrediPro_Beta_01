import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
    Play,
    CheckCircle,
    GraduationCap,
    ChevronRight,
    BookOpen,
    Trophy,
    Clock,
    Target,
    Flame,
    Star,
    Award,
    Sparkles,
    TrendingUp,
} from "lucide-react";

async function getEnrolledCourses(userId: string) {
    return prisma.enrollment.findMany({
        where: { userId },
        include: {
            course: {
                select: {
                    id: true,
                    slug: true,
                    title: true,
                    thumbnail: true,
                    certificateType: true,
                    modules: {
                        where: { isPublished: true },
                        include: {
                            lessons: { where: { isPublished: true }, select: { id: true } },
                        },
                    },
                },
            },
        },
        orderBy: { lastAccessedAt: "desc" },
    });
}

async function getUserStats(userId: string) {
    const [streak, completedLessons, certificates] = await Promise.all([
        prisma.userStreak.findUnique({ where: { userId } }),
        prisma.lessonProgress.count({ where: { userId, isCompleted: true } }),
        prisma.certificate.count({ where: { userId } }),
    ]);
    return { streak, completedLessons, certificates };
}

async function calculateProgress(userId: string, enrollment: any) {
    const totalLessons = enrollment.course.modules.reduce(
        (acc: number, m: any) => acc + m.lessons.length,
        0
    );

    const completedLessons = await prisma.lessonProgress.count({
        where: {
            userId,
            isCompleted: true,
            lesson: { module: { courseId: enrollment.courseId } }
        },
    });

    // Estimate time remaining (5 min per lesson average)
    const remainingLessons = totalLessons - completedLessons;
    const estimatedMinutes = remainingLessons * 5;

    return {
        totalLessons,
        completedLessons,
        progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
        estimatedMinutes,
    };
}

export default async function MyCoursesPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/login");
    }

    const [enrollments, stats] = await Promise.all([
        getEnrolledCourses(session.user.id),
        getUserStats(session.user.id),
    ]);

    const enrollmentsWithProgress = await Promise.all(
        enrollments.map(async (enrollment) => {
            const progressData = await calculateProgress(session.user.id, enrollment);
            return { ...enrollment, ...progressData };
        })
    );

    // Sort: in-progress first (by progress desc), then not started, then completed
    const sortedEnrollments = enrollmentsWithProgress.sort((a, b) => {
        const aStatus = a.progress === 100 ? 2 : a.progress > 0 ? 0 : 1;
        const bStatus = b.progress === 100 ? 2 : b.progress > 0 ? 0 : 1;
        if (aStatus !== bStatus) return aStatus - bStatus;
        return b.progress - a.progress;
    });

    const inProgress = sortedEnrollments.filter(e => e.progress > 0 && e.progress < 100);
    const notStarted = sortedEnrollments.filter(e => e.progress === 0);
    const completed = sortedEnrollments.filter(e => e.progress === 100);

    const firstName = session.user.firstName || "there";
    const totalProgress = sortedEnrollments.length > 0
        ? Math.round(sortedEnrollments.reduce((acc, e) => acc + e.progress, 0) / sortedEnrollments.length)
        : 0;

    return (
        <div className="min-h-[80vh] space-y-6 animate-fade-in">
            {/* Hero Header with Stats */}
            <Card className="bg-gradient-to-br from-burgundy-700 via-burgundy-600 to-burgundy-800 border-0 overflow-hidden relative">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-burgundy-300 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
                </div>
                <CardContent className="p-6 md:p-8 relative">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        {/* Welcome Text */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur flex items-center justify-center">
                                    <GraduationCap className="w-5 h-5 text-gold-400" />
                                </div>
                                <Badge className="bg-gold-500/20 text-gold-300 border-gold-400/30 text-xs">
                                    <Sparkles className="w-3 h-3 mr-1" />
                                    {sortedEnrollments.length} Certification{sortedEnrollments.length !== 1 ? 's' : ''}
                                </Badge>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                                {inProgress.length > 0 ? `Keep Going, ${firstName}!` : `Your Learning Journey`}
                            </h1>
                            <p className="text-burgundy-200 text-sm md:text-base">
                                {totalProgress > 0
                                    ? `You're ${totalProgress}% through your certifications. Every lesson brings you closer to your goals!`
                                    : "Start your first lesson today and begin your transformation."}
                            </p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
                                <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                                <p className="text-xl font-bold text-white">{stats.streak?.currentStreak || 0}</p>
                                <p className="text-[10px] text-burgundy-200 uppercase tracking-wide">Day Streak</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
                                <BookOpen className="w-5 h-5 text-blue-400 mx-auto mb-1" />
                                <p className="text-xl font-bold text-white">{stats.completedLessons}</p>
                                <p className="text-[10px] text-burgundy-200 uppercase tracking-wide">Lessons Done</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
                                <Trophy className="w-5 h-5 text-gold-400 mx-auto mb-1" />
                                <p className="text-xl font-bold text-white">{stats.streak?.totalPoints || 0}</p>
                                <p className="text-[10px] text-burgundy-200 uppercase tracking-wide">XP Points</p>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center border border-white/10">
                                <Award className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
                                <p className="text-xl font-bold text-white">{stats.certificates}</p>
                                <p className="text-[10px] text-burgundy-200 uppercase tracking-wide">Certificates</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {sortedEnrollments.length === 0 ? (
                /* Empty State */
                <Card className="border-2 border-dashed border-gray-200">
                    <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                        <div className="w-20 h-20 bg-burgundy-50 rounded-full flex items-center justify-center mb-4">
                            <GraduationCap className="w-10 h-10 text-burgundy-400" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Start Your Journey</h2>
                        <p className="text-gray-500 mb-6 max-w-sm">
                            Your certification path begins here. Explore our catalog and find the perfect program for you.
                        </p>
                        <Link href="/catalog">
                            <Button className="bg-burgundy-600 hover:bg-burgundy-700 shadow-lg px-8">
                                <BookOpen className="w-4 h-4 mr-2" />
                                Browse Certifications
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-8">
                    {/* Continue Learning - Featured */}
                    {inProgress.length > 0 && (
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                        <Play className="w-4 h-4 text-blue-600" />
                                    </div>
                                    Continue Learning
                                </h2>
                                <Badge variant="secondary" className="bg-blue-50 text-blue-700">
                                    {inProgress.length} in progress
                                </Badge>
                            </div>
                            <div className="grid md:grid-cols-2 gap-4">
                                {inProgress.map((enrollment, idx) => (
                                    <CourseCard
                                        key={enrollment.id}
                                        enrollment={enrollment}
                                        featured={idx === 0}
                                    />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Ready to Start */}
                    {notStarted.length > 0 && (
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                                        <Star className="w-4 h-4 text-amber-600" />
                                    </div>
                                    Ready to Start
                                </h2>
                                <Badge variant="secondary" className="bg-amber-50 text-amber-700">
                                    {notStarted.length} awaiting
                                </Badge>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {notStarted.map((enrollment) => (
                                    <CourseCard key={enrollment.id} enrollment={enrollment} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Completed */}
                    {completed.length > 0 && (
                        <section>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    Completed
                                </h2>
                                <Badge variant="secondary" className="bg-emerald-50 text-emerald-700">
                                    {completed.length} earned
                                </Badge>
                            </div>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {completed.map((enrollment) => (
                                    <CourseCard key={enrollment.id} enrollment={enrollment} isCompleted />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            )}
        </div>
    );
}

function CourseCard({
    enrollment,
    isCompleted = false,
    featured = false,
}: {
    enrollment: any;
    isCompleted?: boolean;
    featured?: boolean;
}) {
    return (
        <Link href={`/courses/${enrollment.course.slug}`}>
            <Card className={`group overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${featured ? 'border-2 border-burgundy-200 bg-gradient-to-br from-white to-burgundy-50/30' :
                    isCompleted ? 'border-2 border-emerald-200 bg-gradient-to-br from-white to-emerald-50/30' :
                        'border border-gray-100 hover:border-burgundy-200'
                }`}>
                <CardContent className="p-0">
                    {/* Thumbnail */}
                    <div className="relative h-40 overflow-hidden">
                        {enrollment.course.thumbnail ? (
                            <Image
                                src={enrollment.course.thumbnail}
                                alt={enrollment.course.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-burgundy-500 to-burgundy-700">
                                <GraduationCap className="w-12 h-12 text-white/50" />
                            </div>
                        )}
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                            <Button size="sm" className="bg-white text-burgundy-700 hover:bg-gray-100 shadow-lg">
                                <Play className="w-4 h-4 mr-1 fill-current" />
                                {isCompleted ? 'Review' : 'Continue'}
                            </Button>
                        </div>
                        {/* Status Badge */}
                        <div className="absolute top-3 right-3">
                            {isCompleted ? (
                                <Badge className="bg-emerald-500 text-white border-0 shadow-lg">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Completed
                                </Badge>
                            ) : enrollment.progress > 0 ? (
                                <Badge className="bg-blue-500 text-white border-0 shadow-lg">
                                    <TrendingUp className="w-3 h-3 mr-1" />
                                    In Progress
                                </Badge>
                            ) : (
                                <Badge className="bg-amber-500 text-white border-0 shadow-lg">
                                    <Star className="w-3 h-3 mr-1" />
                                    New
                                </Badge>
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                        <h3 className="font-bold text-gray-900 group-hover:text-burgundy-700 transition-colors mb-2 line-clamp-2">
                            {enrollment.course.title}
                        </h3>

                        {/* Progress Section */}
                        {!isCompleted && (
                            <div className="mb-3">
                                <div className="flex items-center justify-between text-xs mb-1.5">
                                    <span className="text-gray-500">
                                        {enrollment.completedLessons}/{enrollment.totalLessons} lessons
                                    </span>
                                    <span className="font-semibold text-burgundy-600">{enrollment.progress}%</span>
                                </div>
                                <Progress value={enrollment.progress} className="h-2" />
                            </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between">
                            {isCompleted ? (
                                <span className="flex items-center gap-1 text-xs text-emerald-600 font-medium">
                                    <Award className="w-3.5 h-3.5" />
                                    Certificate Earned
                                </span>
                            ) : (
                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                    <Clock className="w-3.5 h-3.5" />
                                    ~{enrollment.estimatedMinutes} min left
                                </span>
                            )}
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-burgundy-600 group-hover:translate-x-1 transition-all" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}
