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
  Trophy,
  Star,
  Heart,
  AlertTriangle,
} from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const SARAH_AVATAR = "/coaches/sarah-coach.webp";

// Module groupings with descriptions
const MODULES = [
  {
    name: "Hormonal Foundations",
    description: "Understanding the female endocrine system",
    color: "pink",
    lessons: [1, 2, 3],
  },
  {
    name: "Hormone-Body Connection",
    description: "How hormones affect your whole body",
    color: "purple",
    lessons: [4, 5, 6],
  },
  {
    name: "Heal & Thrive",
    description: "Your path to hormonal wellness",
    color: "emerald",
    lessons: [7, 8, 9],
  },
];

async function getWomensHealthData(userId: string, userEmail: string) {
  // Get the women's health mini diploma course and enrollment
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
      course: {
        slug: "womens-health-mini-diploma",
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

  // Count total lessons and completed
  let lessonCounter = 0;
  const lessonsWithOrder = enrollment.course.modules.flatMap((module) =>
    module.lessons.map((lesson) => ({
      ...lesson,
      moduleTitle: module.title,
      globalOrder: lessonCounter++,
      isCompleted: completedLessonIds.has(lesson.id),
    }))
  );

  const completedCount = lessonsWithOrder.filter((l) => l.isCompleted).length;
  const totalLessons = lessonsWithOrder.length;

  // Find next lesson to complete
  const nextLesson = lessonsWithOrder.find((l) => !l.isCompleted);

  // Check if mini diploma is completed
  const isCompleted = completedCount === totalLessons && totalLessons > 0;

  // Check if test user for unlock all
  const isTestUser = userEmail === "at.seed019@gmail.com";

  // Get user's access expiry
  // Note: accessExpiresAt field requires schema migration
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return {
    enrollment,
    lessons: lessonsWithOrder,
    completedCount,
    totalLessons,
    nextLesson,
    isCompleted,
    progress: totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0,
    isTestUser,
    accessExpiresAt: (user as any)?.accessExpiresAt || null,
  };
}

export default async function WomensHealthDiplomaPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const data = await getWomensHealthData(session.user.id, session.user.email || "");

  if (!data) {
    redirect("/dashboard");
  }

  const { lessons, completedCount, totalLessons, nextLesson, isCompleted, progress, isTestUser, accessExpiresAt } = data;
  const firstName = session.user.firstName || "there";

  // Calculate days remaining
  let daysRemaining = 7;
  let isExpired = false;
  if (accessExpiresAt) {
    const now = new Date();
    const expiry = new Date(accessExpiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    isExpired = daysRemaining <= 0;
  }

  // Get module completion stats
  const moduleStats = MODULES.map((module) => {
    const moduleLessons = lessons.filter((_, i) => module.lessons.includes(i + 1));
    const completed = moduleLessons.filter((l) => l.isCompleted).length;
    return { ...module, completed, total: moduleLessons.length };
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-pink-50/30">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600" />
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-300/20 rounded-full blur-3xl" />

        <div className="relative max-w-5xl mx-auto px-4 py-10">
          {/* Access Timer Warning */}
          {!isCompleted && daysRemaining <= 3 && !isExpired && (
            <div className="mb-6 bg-amber-400/20 backdrop-blur-sm rounded-xl p-4 border border-amber-400/30 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-300 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">
                  {daysRemaining === 1 ? "Last day!" : `${daysRemaining} days remaining`}
                </p>
                <p className="text-pink-200 text-sm">Complete your mini diploma to earn your certificate!</p>
              </div>
            </div>
          )}

          {/* Expired Notice */}
          {isExpired && !isCompleted && (
            <div className="mb-6 bg-red-500/20 backdrop-blur-sm rounded-xl p-4 border border-red-400/30 flex items-center gap-3">
              <Lock className="w-5 h-5 text-red-300 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">Access expired</p>
                <p className="text-pink-200 text-sm">Upgrade to full access to continue learning!</p>
              </div>
              <Button size="sm" className="ml-auto bg-white text-pink-600 hover:bg-pink-50">
                Upgrade Now
              </Button>
            </div>
          )}

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
                <Heart className="w-3 h-3 text-white" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-pink-400/30 text-pink-100 border-pink-400/40 font-semibold">
                  <Heart className="w-3 h-3 mr-1" />
                  Women's Health Mini Diploma
                </Badge>
                {isCompleted && (
                  <Badge className="bg-emerald-400/30 text-emerald-200 border-emerald-400/40">
                    <Trophy className="w-3 h-3 mr-1" />
                    Completed!
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                Hey {firstName}!
              </h1>
              <p className="text-pink-100 text-base md:text-lg">
                {isCompleted
                  ? "You've mastered the foundations of women's health!"
                  : "I'm Sarah, your guide to hormonal wellness."}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-3 mt-4 md:mt-0">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                <div className="text-2xl font-bold text-white">{completedCount}</div>
                <div className="text-xs text-pink-200">Completed</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                <div className="text-2xl font-bold text-pink-200">{totalLessons - completedCount}</div>
                <div className="text-xs text-pink-200">Remaining</div>
              </div>
            </div>
          </div>

          {/* Progress Section */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-300" />
                <span className="text-white font-medium">Your Progress</span>
              </div>
              <span className="text-pink-200 font-bold text-lg">
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

            {/* Module Progress Dots */}
            <div className="flex justify-between mt-4 px-2">
              {moduleStats.map((module, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="flex gap-1 mb-1">
                    {Array.from({ length: module.total }).map((_, j) => (
                      <div
                        key={j}
                        className={`w-2 h-2 rounded-full ${
                          j < module.completed
                            ? module.color === "pink" ? "bg-pink-300"
                            : module.color === "purple" ? "bg-purple-400"
                            : "bg-emerald-400"
                            : "bg-white/30"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-pink-200">{module.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 -mt-4">
        {/* Next Lesson CTA */}
        {nextLesson && !isCompleted && !isExpired && (
          <Card className="mb-8 border-0 shadow-xl overflow-hidden bg-gradient-to-r from-pink-500 to-rose-500">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row items-stretch">
                <div className="flex-1 p-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <Play className="w-4 h-4" />
                    </div>
                    <span className="text-pink-100 text-sm font-medium">Continue Learning</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold mb-1">
                    Lesson {nextLesson.globalOrder + 1}: {nextLesson.title}
                  </h2>
                  <p className="text-pink-100 text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    ~6 min interactive lesson with Sarah
                  </p>
                </div>
                <div className="bg-white/10 p-6 flex items-center justify-center md:w-48">
                  <Link href={`/womens-health-diploma/lesson/${nextLesson.globalOrder + 1}`} className="w-full">
                    <Button size="lg" className="w-full bg-white text-pink-600 hover:bg-pink-50 font-bold shadow-lg">
                      Start Now
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Completion Celebration */}
        {isCompleted && (
          <Card className="mb-8 border-0 shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400 via-rose-400 to-pink-500" />
            <div className="absolute inset-0 bg-[url('/patterns/confetti.svg')] opacity-30" />
            <CardContent className="relative p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-xl">
                <Trophy className="w-10 h-10 text-pink-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Congratulations!
              </h2>
              <p className="text-pink-100 mb-6 max-w-md mx-auto">
                You've completed all 9 lessons and earned your Women's Health Mini Diploma!
                Your certificate is ready to download.
              </p>
              <Link href="/certificates">
                <Button size="lg" className="bg-white text-pink-600 hover:bg-pink-50 font-bold shadow-lg">
                  <Award className="w-5 h-5 mr-2" />
                  Download Your Certificate
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Lessons by Module */}
        <div className="space-y-6">
          {MODULES.map((module, moduleIndex) => {
            const moduleLessons = lessons.filter((_, i) => module.lessons.includes(i + 1));
            const allComplete = moduleLessons.every((l) => l.isCompleted);
            const moduleNumber = moduleIndex + 1;

            const colorClasses = {
              pink: {
                bg: "bg-pink-50",
                border: "border-pink-200",
                text: "text-pink-700",
                badge: "bg-pink-100 text-pink-700",
                icon: "bg-pink-500",
                complete: "bg-pink-500",
              },
              purple: {
                bg: "bg-purple-50",
                border: "border-purple-200",
                text: "text-purple-700",
                badge: "bg-purple-100 text-purple-700",
                icon: "bg-purple-500",
                complete: "bg-purple-500",
              },
              emerald: {
                bg: "bg-emerald-50",
                border: "border-emerald-200",
                text: "text-emerald-700",
                badge: "bg-emerald-100 text-emerald-700",
                icon: "bg-emerald-500",
                complete: "bg-emerald-500",
              },
            }[module.color];

            return (
              <Card key={moduleIndex} className={`border-2 ${colorClasses?.border} shadow-lg overflow-hidden`}>
                {/* Module Header */}
                <div className={`${colorClasses?.bg} px-6 py-4 border-b ${colorClasses?.border}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${colorClasses?.icon} flex items-center justify-center text-white font-bold shadow-md`}>
                        {moduleNumber}
                      </div>
                      <div>
                        <h3 className={`font-bold ${colorClasses?.text}`}>{module.name}</h3>
                        <p className="text-sm text-slate-500">{module.description}</p>
                      </div>
                    </div>
                    {allComplete ? (
                      <Badge className="bg-emerald-100 text-emerald-700 border-0">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Complete
                      </Badge>
                    ) : (
                      <Badge className={colorClasses?.badge + " border-0"}>
                        {moduleLessons.filter(l => l.isCompleted).length}/{moduleLessons.length} done
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Lessons */}
                <CardContent className="p-4">
                  <div className="space-y-2">
                    {moduleLessons.map((lesson, lessonIdx) => {
                      const globalLessonNumber = module.lessons[lessonIdx];
                      const prevLesson = globalLessonNumber > 1 ? lessons[globalLessonNumber - 2] : null;
                      const isLocked = !isTestUser && globalLessonNumber > 1 && prevLesson && !prevLesson.isCompleted && !lesson.isCompleted;
                      const isNext = nextLesson?.id === lesson.id;
                      const isDisabled = isExpired && !lesson.isCompleted;

                      return (
                        <div
                          key={lesson.id}
                          className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                            lesson.isCompleted
                              ? "bg-emerald-50/50"
                              : isNext && !isDisabled
                              ? `${colorClasses?.bg} ring-2 ring-offset-2 ${module.color === 'pink' ? 'ring-pink-400' : module.color === 'purple' ? 'ring-purple-400' : 'ring-emerald-400'}`
                              : isLocked || isDisabled
                              ? "bg-slate-50 opacity-50"
                              : "bg-slate-50/50 hover:bg-slate-100"
                          }`}
                        >
                          {/* Number/Status */}
                          <div
                            className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 font-bold ${
                              lesson.isCompleted
                                ? "bg-emerald-500 text-white"
                                : isNext && !isDisabled
                                ? `${colorClasses?.complete} text-white`
                                : isLocked || isDisabled
                                ? "bg-slate-200 text-slate-400"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {lesson.isCompleted ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : isLocked || isDisabled ? (
                              <Lock className="w-4 h-4" />
                            ) : (
                              globalLessonNumber
                            )}
                          </div>

                          {/* Title */}
                          <div className="flex-1 min-w-0">
                            <h4
                              className={`font-semibold ${
                                lesson.isCompleted
                                  ? "text-emerald-700"
                                  : isLocked || isDisabled
                                  ? "text-slate-400"
                                  : "text-slate-800"
                              }`}
                            >
                              {lesson.title}
                            </h4>
                            {isNext && !isDisabled && (
                              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                <Sparkles className="w-3 h-3" />
                                Up next for you
                              </p>
                            )}
                          </div>

                          {/* Action */}
                          <div className="flex-shrink-0">
                            {lesson.isCompleted ? (
                              <Link href={`/womens-health-diploma/lesson/${globalLessonNumber}`}>
                                <Button size="sm" variant="ghost" className="text-emerald-600 hover:bg-emerald-100">
                                  <Star className="w-4 h-4 mr-1" />
                                  Review
                                </Button>
                              </Link>
                            ) : isNext && !isDisabled ? (
                              <Link href={`/womens-health-diploma/lesson/${globalLessonNumber}`}>
                                <Button size="sm" className={`${colorClasses?.complete} hover:opacity-90`}>
                                  <Play className="w-4 h-4 mr-1" />
                                  Start
                                </Button>
                              </Link>
                            ) : isLocked || isDisabled ? (
                              <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                {isDisabled ? "Access expired" : "Complete previous"}
                              </span>
                            ) : (
                              <Link href={`/womens-health-diploma/lesson/${globalLessonNumber}`}>
                                <Button size="sm" variant="outline">
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

        {/* Help Card */}
        <Card className="mt-8 border-2 border-pink-200 shadow-lg bg-gradient-to-r from-pink-50 to-rose-50">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <Image
                  src={SARAH_AVATAR}
                  alt="Sarah"
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-xl object-cover ring-2 ring-pink-200"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-slate-900">Questions? I'm here!</h3>
                <p className="text-slate-600 text-sm">
                  Send me a private message anytime
                </p>
              </div>
              <Link href="/messages">
                <Button className="bg-pink-500 hover:bg-pink-600 text-white shadow-md">
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
