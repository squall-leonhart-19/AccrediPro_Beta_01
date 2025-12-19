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
  Zap,
} from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { MiniDiplomaActions } from "./mini-diploma-actions";

export const dynamic = "force-dynamic";

const SARAH_AVATAR = "/coaches/sarah-coach.webp";

// Module groupings with descriptions
const MODULES = [
  {
    name: "Foundations",
    description: "Understand the core principles",
    color: "burgundy",
    lessons: [1, 2, 3],
  },
  {
    name: "Core Systems",
    description: "Master the body systems",
    color: "purple",
    lessons: [4, 5, 6],
  },
  {
    name: "Your Path",
    description: "Launch your practice",
    color: "emerald",
    lessons: [7, 8, 9],
  },
];

async function getMiniDiplomaData(userId: string, userEmail: string) {
  // Get the mini diploma course and enrollment
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
      course: {
        slug: "fm-mini-diploma",
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

  // Find next lesson to complete (start from lesson 2 since lesson 1 should be auto-completed from preview)
  const nextLesson = lessonsWithOrder.find((l) => !l.isCompleted);

  // Check if mini diploma is completed
  const isCompleted = completedCount === totalLessons && totalLessons > 0;

  // Check if test user for unlock all
  const isTestUser = userEmail === "at.seed019@gmail.com";

  return {
    enrollment,
    lessons: lessonsWithOrder,
    completedCount,
    totalLessons,
    nextLesson,
    isCompleted,
    progress: totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0,
    isTestUser,
  };
}

export default async function MiniDiplomaPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const data = await getMiniDiplomaData(session.user.id, session.user.email || "");

  if (!data) {
    redirect("/dashboard");
  }

  const { lessons, completedCount, totalLessons, nextLesson, isCompleted, progress, isTestUser } = data;
  const firstName = session.user.firstName || "there";

  // Get module completion stats
  const moduleStats = MODULES.map((module) => {
    const moduleLessons = lessons.filter((_, i) => module.lessons.includes(i + 1));
    const completed = moduleLessons.filter((l) => l.isCompleted).length;
    return { ...module, completed, total: moduleLessons.length };
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-burgundy-50/30">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-900" />
        <div className="absolute inset-0 bg-[url('/patterns/grid.svg')] opacity-10" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl" />

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
                  FM Mini Diploma
                </Badge>
                {isCompleted && (
                  <Badge className="bg-emerald-400/30 text-emerald-200 border-emerald-400/40">
                    <Trophy className="w-3 h-3 mr-1" />
                    Completed!
                  </Badge>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                Hey {firstName}! 👋
              </h1>
              <p className="text-burgundy-200 text-base md:text-lg">
                {isCompleted
                  ? "Amazing work! You've mastered the foundations."
                  : "I'm Sarah, your guide to Functional Medicine mastery."}
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
                <span className="text-white font-medium">Your Progress</span>
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
                            ? module.color === "burgundy" ? "bg-gold-400"
                            : module.color === "purple" ? "bg-purple-400"
                            : "bg-emerald-400"
                            : "bg-white/30"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[10px] text-burgundy-200">{module.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 -mt-4">

        {/* Test User Actions */}
        {isTestUser && (
          <MiniDiplomaActions userId={session.user.id} />
        )}

        {/* Next Lesson CTA */}
        {nextLesson && !isCompleted && (
          <Card className="mb-8 border-0 shadow-xl overflow-hidden bg-gradient-to-r from-burgundy-600 to-burgundy-700">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row items-stretch">
                <div className="flex-1 p-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <Play className="w-4 h-4" />
                    </div>
                    <span className="text-burgundy-200 text-sm font-medium">Continue Learning</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold mb-1">
                    Lesson {nextLesson.globalOrder + 1}: {nextLesson.title}
                  </h2>
                  <p className="text-burgundy-200 text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    ~5 min interactive lesson with Sarah
                  </p>
                </div>
                <div className="bg-white/10 p-6 flex items-center justify-center md:w-48">
                  <Link href={`/mini-diploma/lesson/${nextLesson.globalOrder + 1}`} className="w-full">
                    <Button size="lg" className="w-full bg-white text-burgundy-700 hover:bg-gold-100 font-bold shadow-lg">
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
            <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-yellow-400 to-orange-400" />
            <div className="absolute inset-0 bg-[url('/patterns/confetti.svg')] opacity-30" />
            <CardContent className="relative p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-xl">
                <Trophy className="w-10 h-10 text-amber-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                You Did It! 🎉
              </h2>
              <p className="text-amber-100 mb-6 max-w-md mx-auto">
                You've completed all 9 lessons and earned your FM Mini Diploma!
                Your certificate is ready to download.
              </p>
              <Link href="/certificates">
                <Button size="lg" className="bg-white text-amber-600 hover:bg-amber-50 font-bold shadow-lg">
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
              burgundy: {
                bg: "bg-burgundy-50",
                border: "border-burgundy-200",
                text: "text-burgundy-700",
                badge: "bg-burgundy-100 text-burgundy-700",
                icon: "bg-burgundy-600",
                complete: "bg-burgundy-600",
              },
              purple: {
                bg: "bg-purple-50",
                border: "border-purple-200",
                text: "text-purple-700",
                badge: "bg-purple-100 text-purple-700",
                icon: "bg-purple-600",
                complete: "bg-purple-600",
              },
              emerald: {
                bg: "bg-emerald-50",
                border: "border-emerald-200",
                text: "text-emerald-700",
                badge: "bg-emerald-100 text-emerald-700",
                icon: "bg-emerald-600",
                complete: "bg-emerald-600",
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

                      return (
                        <div
                          key={lesson.id}
                          className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                            lesson.isCompleted
                              ? "bg-emerald-50/50"
                              : isNext
                              ? `${colorClasses?.bg} ring-2 ring-offset-2 ${module.color === 'burgundy' ? 'ring-burgundy-400' : module.color === 'purple' ? 'ring-purple-400' : 'ring-emerald-400'}`
                              : isLocked
                              ? "bg-slate-50 opacity-50"
                              : "bg-slate-50/50 hover:bg-slate-100"
                          }`}
                        >
                          {/* Number/Status */}
                          <div
                            className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 font-bold ${
                              lesson.isCompleted
                                ? "bg-emerald-500 text-white"
                                : isNext
                                ? `${colorClasses?.complete} text-white`
                                : isLocked
                                ? "bg-slate-200 text-slate-400"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {lesson.isCompleted ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : isLocked ? (
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
                                  : isLocked
                                  ? "text-slate-400"
                                  : "text-slate-800"
                              }`}
                            >
                              {lesson.title}
                            </h4>
                            {isNext && (
                              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                <Sparkles className="w-3 h-3" />
                                Up next for you
                              </p>
                            )}
                          </div>

                          {/* Action */}
                          <div className="flex-shrink-0">
                            {lesson.isCompleted ? (
                              <Link href={`/mini-diploma/lesson/${globalLessonNumber}`}>
                                <Button size="sm" variant="ghost" className="text-emerald-600 hover:bg-emerald-100">
                                  <Star className="w-4 h-4 mr-1" />
                                  Review
                                </Button>
                              </Link>
                            ) : isNext ? (
                              <Link href={`/mini-diploma/lesson/${globalLessonNumber}`}>
                                <Button size="sm" className={`${colorClasses?.complete} hover:opacity-90`}>
                                  <Play className="w-4 h-4 mr-1" />
                                  Start
                                </Button>
                              </Link>
                            ) : isLocked ? (
                              <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                Complete previous
                              </span>
                            ) : (
                              <Link href={`/mini-diploma/lesson/${globalLessonNumber}`}>
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
        <Card className="mt-8 border-2 border-violet-200 shadow-lg bg-gradient-to-r from-violet-50 to-purple-50">
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
                <h3 className="font-semibold text-slate-900">Questions? I'm here!</h3>
                <p className="text-slate-600 text-sm">
                  Send me a private message anytime
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
