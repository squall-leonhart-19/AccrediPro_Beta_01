import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Download,
  Play,
  Clock,
  BookOpen,
  Award,
  MessageCircle,
  GraduationCap,
  FileText,
  Video,
  HelpCircle,
  ClipboardList,
} from "lucide-react";
import { WistiaPlayer } from "@/components/courses/wistia-player";
import { LessonSidebar } from "@/components/courses/lesson-sidebar";
import { MarkCompleteButton } from "@/components/courses/mark-complete-button";
import { BottomLessonNav } from "@/components/courses/bottom-lesson-nav";

async function getLesson(lessonId: string) {
  return prisma.lesson.findUnique({
    where: { id: lessonId, isPublished: true },
    include: {
      module: {
        include: {
          course: {
            include: {
              modules: {
                where: { isPublished: true },
                orderBy: { order: "asc" },
                include: {
                  lessons: {
                    where: { isPublished: true },
                    orderBy: { order: "asc" },
                  },
                },
              },
              coach: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  avatar: true,
                  bio: true,
                },
              },
            },
          },
        },
      },
      resources: true,
    },
  });
}

async function getEnrollment(userId: string, courseId: string) {
  return prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
}

async function getLessonProgress(userId: string, courseId: string) {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        include: {
          lessons: {
            select: { id: true },
          },
        },
      },
    },
  });

  if (!course) return { progressMap: new Map(), totalLessons: 0, completedLessons: 0 };

  const lessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));

  const progress = await prisma.lessonProgress.findMany({
    where: {
      userId,
      lessonId: { in: lessonIds },
    },
  });

  const progressMap = new Map(progress.map((p) => [p.lessonId, p]));
  const completedLessons = progress.filter((p) => p.isCompleted).length;

  return {
    progressMap,
    totalLessons: lessonIds.length,
    completedLessons,
  };
}

const lessonTypeIcons = {
  VIDEO: Video,
  TEXT: FileText,
  QUIZ: HelpCircle,
  ASSIGNMENT: ClipboardList,
  LIVE_SESSION: Video,
};

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string; lessonId: string }>;
}) {
  const { slug, lessonId } = await params;
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect("/login");
  }

  const lesson = await getLesson(lessonId);

  if (!lesson) notFound();

  const course = lesson.module.course;
  const enrollment = await getEnrollment(session.user.id, course.id);

  // Check access
  if (!enrollment && !lesson.isFreePreview) {
    redirect(`/courses/${slug}`);
  }

  const { progressMap, totalLessons, completedLessons } = await getLessonProgress(
    session.user.id,
    course.id
  );

  const currentProgress = progressMap.get(lesson.id);
  const isCompleted = currentProgress?.isCompleted || false;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  // Get all lessons in order
  const allLessons = course.modules.flatMap((m) =>
    m.lessons.map((l) => ({ ...l, moduleTitle: m.title, moduleId: m.id }))
  );
  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Check if user can access the next lesson (linear progression first time)
  // User can access next lesson if current lesson is completed
  const canAccessNextLesson = isCompleted;

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins} min`;
  };

  const LessonTypeIcon = lessonTypeIcons[lesson.lessonType] || Video;
  const coachInitials = course.coach
    ? `${course.coach.firstName?.charAt(0) || ""}${course.coach.lastName?.charAt(0) || ""}`.toUpperCase()
    : "C";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Premium Top Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 lg:px-6 py-3">
          {/* Left: Back + Course Title */}
          <div className="flex items-center gap-4">
            <Link href={`/courses/${slug}`}>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                <span className="hidden sm:inline">Back to Course</span>
              </Button>
            </Link>
            <div className="hidden md:flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-burgundy-600 to-burgundy-700 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-gray-900 font-semibold truncate max-w-md">
                  {course.title}
                </h1>
                <p className="text-xs text-gray-500">
                  {lesson.module.title}
                </p>
              </div>
            </div>
          </div>

          {/* Center: Progress */}
          <div className="hidden lg:flex items-center gap-4 bg-gray-100 rounded-full px-6 py-2 border border-gray-200">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-burgundy-600" />
              <span className="text-sm text-gray-600">
                {completedLessons}/{totalLessons} lessons
              </span>
            </div>
            <div className="w-px h-4 bg-gray-300" />
            <div className="flex items-center gap-3">
              <Progress
                value={progressPercentage}
                className="w-32 h-2 bg-gray-200"
              />
              <span className="text-sm font-semibold text-burgundy-600">
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>

          {/* Right: Coach Contact */}
          {course.coach && (
            <Link
              href={`/messages?to=${course.coach.id}`}
              className="hidden sm:flex items-center gap-3 bg-burgundy-50 hover:bg-burgundy-100 rounded-xl px-4 py-2 border border-burgundy-200 transition-all"
            >
              <Avatar className="h-8 w-8 ring-2 ring-burgundy-200">
                <AvatarImage src={course.coach.avatar || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-burgundy-500 to-burgundy-600 text-white text-xs font-semibold">
                  {coachInitials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:block">
                <p className="text-xs text-gray-500">Your Coach</p>
                <p className="text-sm font-medium text-gray-900">
                  {course.coach.firstName} {course.coach.lastName}
                </p>
              </div>
              <MessageCircle className="w-4 h-4 text-burgundy-600" />
            </Link>
          )}
        </div>
      </header>

      <div className="flex">
        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {/* Video Player Section */}
          <div className="relative bg-black">
            {lesson.videoId ? (
              <div className="aspect-video max-h-[70vh]">
                <WistiaPlayer
                  videoId={lesson.videoId}
                  lessonId={lesson.id}
                  courseId={course.id}
                />
              </div>
            ) : (
              <div className="aspect-video max-h-[70vh] flex items-center justify-center bg-gradient-to-br from-burgundy-900 to-burgundy-950">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-burgundy-800/50 flex items-center justify-center mx-auto mb-4">
                    <LessonTypeIcon className="w-10 h-10 text-gold-400" />
                  </div>
                  <p className="text-burgundy-300 text-lg">
                    {lesson.lessonType === "TEXT" && "Reading Material"}
                    {lesson.lessonType === "QUIZ" && "Quiz Assessment"}
                    {lesson.lessonType === "ASSIGNMENT" && "Assignment"}
                    {lesson.lessonType === "LIVE_SESSION" && "Live Session"}
                    {lesson.lessonType === "VIDEO" && "Video Coming Soon"}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Lesson Content Section */}
          <div className="p-6 lg:p-8">
            <div className="max-w-4xl mx-auto">
              {/* Lesson Header */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="outline"
                      className="bg-gray-100 text-gray-700 border-gray-200"
                    >
                      <LessonTypeIcon className="w-3 h-3 mr-1" />
                      {lesson.lessonType.charAt(0) + lesson.lessonType.slice(1).toLowerCase().replace('_', ' ')}
                    </Badge>
                    {lesson.videoDuration && (
                      <Badge
                        variant="outline"
                        className="bg-gray-100 text-gray-700 border-gray-200"
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        {formatDuration(lesson.videoDuration)}
                      </Badge>
                    )}
                    {isCompleted && (
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    {lesson.title}
                  </h2>
                  <p className="text-gray-500 text-sm">
                    Lesson {currentIndex + 1} of {allLessons.length} in {lesson.module.title}
                  </p>
                </div>

                <MarkCompleteButton
                  lessonId={lesson.id}
                  courseId={course.id}
                  moduleId={lesson.module.id}
                  isCompleted={isCompleted}
                  courseName={course.title}
                  courseSlug={slug}
                  lessonNumber={currentIndex + 1}
                  totalLessons={totalLessons}
                />
              </div>

              {/* Lesson Description Card */}
              {lesson.description && (
                <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-burgundy-100 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-burgundy-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      About This Lesson
                    </h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{lesson.description}</p>
                </div>
              )}

              {/* Lesson Content (Rich Text) */}
              {lesson.content && (
                <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-burgundy-100 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-burgundy-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Lesson Content
                    </h3>
                  </div>
                  <div
                    className="prose prose-gray max-w-none prose-headings:text-gray-900 prose-p:text-gray-600 prose-strong:text-gray-900 prose-li:text-gray-600"
                    dangerouslySetInnerHTML={{ __html: lesson.content }}
                  />
                </div>
              )}

              {/* Resources */}
              {lesson.resources.length > 0 && (
                <div className="bg-white rounded-2xl p-6 mb-6 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-burgundy-100 flex items-center justify-center">
                      <Download className="w-5 h-5 text-burgundy-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Downloadable Resources
                    </h3>
                  </div>
                  <div className="grid gap-3">
                    {lesson.resources.map((resource) => (
                      <a
                        key={resource.id}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all border border-gray-200 group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-burgundy-100 flex items-center justify-center group-hover:bg-burgundy-200 transition-colors">
                          <FileText className="w-6 h-6 text-burgundy-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-900 font-medium truncate">{resource.title}</p>
                          <p className="text-sm text-gray-500">{resource.type}</p>
                        </div>
                        <Download className="w-5 h-5 text-gray-400 group-hover:text-burgundy-600 transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Coach Support Card */}
              {course.coach && (
                <div className="bg-gradient-to-r from-burgundy-50 to-burgundy-100 rounded-2xl p-6 mb-8 border border-burgundy-200">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 ring-4 ring-burgundy-200">
                      <AvatarImage src={course.coach.avatar || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-burgundy-500 to-burgundy-600 text-white text-lg font-semibold">
                        {coachInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-burgundy-600 text-sm font-medium mb-1">Need Help?</p>
                      <p className="text-gray-900 font-semibold text-lg">
                        {course.coach.firstName} {course.coach.lastName}
                      </p>
                      <p className="text-gray-500 text-sm truncate">Your dedicated course coach</p>
                    </div>
                    <Link href={`/messages?to=${course.coach.id}`}>
                      <Button className="bg-burgundy-600 hover:bg-burgundy-700 text-white font-semibold shadow-lg">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Message Coach
                      </Button>
                    </Link>
                  </div>
                </div>
              )}

              {/* Spacer for fixed bottom navigation */}
              <div className="h-24" />
            </div>
          </div>

          {/* Bottom Fixed Navigation Bar for Text Readers */}
          <BottomLessonNav
            courseSlug={slug}
            courseId={course.id}
            moduleId={lesson.module.id}
            lessonId={lesson.id}
            courseName={course.title}
            prevLesson={prevLesson}
            nextLesson={nextLesson}
            isCompleted={isCompleted}
            completedLessons={completedLessons}
            totalLessons={totalLessons}
            currentIndex={currentIndex}
          />
        </main>

        {/* Sidebar - Course Content */}
        <LessonSidebar
          course={course}
          currentLessonId={lesson.id}
          progressMap={progressMap}
          slug={slug}
        />
      </div>
    </div>
  );
}
