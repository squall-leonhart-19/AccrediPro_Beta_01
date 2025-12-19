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
} from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const SARAH_AVATAR = "/coaches/sarah-coach.webp";

// Lesson data for the Mini Diploma
const MINI_DIPLOMA_LESSONS = [
  { number: 1, title: "What is Functional Medicine?", module: "Foundations" },
  { number: 2, title: "The 7 Body Systems Model", module: "Foundations" },
  { number: 3, title: "Your Unfair Advantage", module: "Foundations" },
  { number: 4, title: "The Gut-Health Connection", module: "Core Systems" },
  { number: 5, title: "Hormones & Thyroid", module: "Core Systems" },
  { number: 6, title: "Connecting the Dots", module: "Core Systems" },
  { number: 7, title: "Working With Clients", module: "Your Path" },
  { number: 8, title: "Building Your Practice", module: "Your Path" },
  { number: 9, title: "Your Next Step", module: "Your Path" },
];

async function getMiniDiplomaData(userId: string) {
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

  // Map lessons with their completion status
  const allLessons = enrollment.course.modules.flatMap((module) =>
    module.lessons.map((lesson, lessonIndex) => ({
      id: lesson.id,
      title: lesson.title,
      moduleTitle: module.title,
      isCompleted: completedLessonIds.has(lesson.id),
      lessonNumber: lessonIndex + 1,
    }))
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

  return {
    enrollment,
    lessons: lessonsWithOrder,
    completedCount,
    totalLessons,
    nextLesson,
    isCompleted,
    progress: totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0,
  };
}

export default async function MiniDiplomaPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const data = await getMiniDiplomaData(session.user.id);

  if (!data) {
    // User doesn't have mini diploma enrollment
    redirect("/dashboard");
  }

  const { lessons, completedCount, totalLessons, nextLesson, isCompleted, progress } = data;
  const firstName = session.user.firstName || "Student";

  return (
    <div className="min-h-screen bg-gradient-to-b from-burgundy-50 via-white to-gold-50/30">
      {/* Header */}
      <div className="bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 text-white">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <Image
                src={SARAH_AVATAR}
                alt="Sarah"
                width={64}
                height={64}
                className="w-16 h-16 rounded-full object-cover border-4 border-white/20"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-400 rounded-full border-2 border-white" />
            </div>
            <div>
              <Badge className="bg-gold-400/20 text-gold-300 border-gold-400/30 mb-1">
                FM Mini Diploma
              </Badge>
              <h1 className="text-2xl font-bold">Welcome back, {firstName}!</h1>
              <p className="text-burgundy-200 text-sm">Sarah is here to guide you</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-burgundy-100 text-sm">Your Progress</span>
              <span className="text-white font-semibold">
                {completedCount} of {totalLessons} lessons
              </span>
            </div>
            <Progress value={progress} className="h-3 bg-white/20" />
            <p className="text-burgundy-200 text-sm mt-2">
              {isCompleted
                ? "🎉 Congratulations! You've completed the Mini Diploma!"
                : `${Math.round(progress)}% complete — keep going!`}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Next Lesson CTA */}
        {nextLesson && !isCompleted && (
          <Card className="mb-8 border-2 border-burgundy-200 shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-burgundy-50 to-rose-50 p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-burgundy-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-burgundy-600 text-sm font-medium mb-1">Continue Your Journey</p>
                  <h2 className="text-xl font-bold text-slate-900">
                    Lesson {nextLesson.globalOrder + 1}: {nextLesson.title}
                  </h2>
                  <p className="text-slate-600 text-sm">{nextLesson.moduleTitle}</p>
                </div>
                <Link href={`/mini-diploma/lesson/${nextLesson.globalOrder + 1}`}>
                  <Button className="bg-burgundy-600 hover:bg-burgundy-700 text-white px-6">
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        {/* Certificate CTA (if completed) */}
        {isCompleted && (
          <Card className="mb-8 border-2 border-amber-300 shadow-lg overflow-hidden bg-gradient-to-br from-amber-50 to-yellow-50">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-slate-900">
                    Congratulations! 🎉
                  </h2>
                  <p className="text-slate-600">
                    You've completed the FM Mini Diploma! Download your certificate now.
                  </p>
                </div>
                <Link href="/dashboard/certificates">
                  <Button className="bg-amber-500 hover:bg-amber-600 text-white px-6">
                    Get Certificate
                    <GraduationCap className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* All Lessons */}
        <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-burgundy-600" />
                Your 9 Lessons
              </h2>
            </div>

            <div className="space-y-3">
              {lessons.map((lesson, index) => {
                const lessonNumber = index + 1;
                const isLocked = index > 0 && !lessons[index - 1].isCompleted && !lesson.isCompleted;
                const isNext = nextLesson?.id === lesson.id;

                return (
                  <div
                    key={lesson.id}
                    className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      lesson.isCompleted
                        ? "bg-emerald-50 border-emerald-200"
                        : isNext
                        ? "bg-burgundy-50 border-burgundy-300 shadow-sm"
                        : isLocked
                        ? "bg-slate-50 border-slate-200 opacity-60"
                        : "bg-white border-slate-200 hover:border-burgundy-200 hover:bg-burgundy-50/30"
                    }`}
                  >
                    {/* Lesson Number / Status Icon */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        lesson.isCompleted
                          ? "bg-emerald-500 text-white"
                          : isNext
                          ? "bg-burgundy-600 text-white"
                          : isLocked
                          ? "bg-slate-300 text-slate-500"
                          : "bg-burgundy-100 text-burgundy-600"
                      }`}
                    >
                      {lesson.isCompleted ? (
                        <CheckCircle className="w-6 h-6" />
                      ) : isLocked ? (
                        <Lock className="w-5 h-5" />
                      ) : (
                        <span className="font-bold">{lessonNumber}</span>
                      )}
                    </div>

                    {/* Lesson Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-500 mb-0.5">{lesson.moduleTitle}</p>
                      <h3
                        className={`font-semibold ${
                          lesson.isCompleted
                            ? "text-emerald-700"
                            : isLocked
                            ? "text-slate-400"
                            : "text-slate-900"
                        }`}
                      >
                        {lesson.title}
                      </h3>
                    </div>

                    {/* Action */}
                    <div className="flex-shrink-0">
                      {lesson.isCompleted ? (
                        <Badge className="bg-emerald-100 text-emerald-700 border-0">
                          Complete
                        </Badge>
                      ) : isNext ? (
                        <Link href={`/mini-diploma/lesson/${lessonNumber}`}>
                          <Button size="sm" className="bg-burgundy-600 hover:bg-burgundy-700">
                            <Play className="w-4 h-4 mr-1" />
                            Start
                          </Button>
                        </Link>
                      ) : isLocked ? (
                        <Badge className="bg-slate-100 text-slate-500 border-0">
                          <Lock className="w-3 h-3 mr-1" />
                          Locked
                        </Badge>
                      ) : (
                        <Link href={`/mini-diploma/lesson/${lessonNumber}`}>
                          <Button size="sm" variant="outline" className="border-burgundy-200 text-burgundy-600">
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

        {/* Coach Support Card */}
        <Card className="mt-8 border-2 border-purple-200 shadow-lg overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <Image
                src={SARAH_AVATAR}
                alt="Sarah"
                width={56}
                height={56}
                className="w-14 h-14 rounded-full object-cover border-2 border-purple-200"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">Need Help?</h3>
                <p className="text-slate-600 text-sm">
                  Chat with Sarah directly if you have any questions
                </p>
              </div>
              <Link href="/chat">
                <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat with Sarah
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
