import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  Clock,
  Users,
  Award,
  Play,
  CheckCircle,
  Lock,
  ChevronRight,
  GraduationCap,
  MessageCircle,
  Sparkles,
  Target,
  FileText,
  Video,
  HelpCircle,
  ClipboardList,
  Star,
  Download,
} from "lucide-react";
import { EnrollButton } from "@/components/courses/enroll-button";
import { CourseReviews } from "@/components/courses/course-reviews";

async function getCourse(slug: string) {
  return prisma.course.findUnique({
    where: { slug, isPublished: true },
    include: {
      category: true,
      coach: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
          bio: true,
        },
      },
      modules: {
        where: { isPublished: true },
        orderBy: { order: "asc" },
        include: {
          lessons: {
            where: { isPublished: true },
            orderBy: { order: "asc" },
            include: {
              resources: true,
            },
          },
        },
      },
      _count: {
        select: { enrollments: true },
      },
    },
  });
}

async function getEnrollment(userId: string, courseId: string) {
  return prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
}

async function getCourseReviews(courseId: string) {
  return prisma.courseReview.findMany({
    where: { courseId, isPublic: true },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 20,
  });
}

async function getCourseAnalytics(courseId: string) {
  return prisma.courseAnalytics.findUnique({
    where: { courseId },
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

  if (!course) return new Map();

  const lessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));

  const progress = await prisma.lessonProgress.findMany({
    where: {
      userId,
      lessonId: { in: lessonIds },
    },
  });

  return new Map(progress.map((p) => [p.lessonId, p]));
}

const lessonTypeIcons: Record<string, typeof Video> = {
  VIDEO: Video,
  TEXT: FileText,
  QUIZ: HelpCircle,
  ASSIGNMENT: ClipboardList,
  LIVE_SESSION: Video,
};

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  const course = await getCourse(slug);

  if (!course) notFound();

  const enrollment = session?.user?.id
    ? await getEnrollment(session.user.id, course.id)
    : null;

  const progressMap = session?.user?.id
    ? await getLessonProgress(session.user.id, course.id)
    : new Map();

  const reviews = await getCourseReviews(course.id);
  const analytics = await getCourseAnalytics(course.id);

  const totalLessons = course.modules.reduce(
    (acc, m) => acc + m.lessons.length,
    0
  );
  const completedLessons = Array.from(progressMap.values()).filter(
    (p) => p.isCompleted
  ).length;
  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "";
    const minutes = Math.floor(seconds / 60);
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    }
    return `${minutes}m`;
  };

  const getNextLesson = () => {
    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        const progress = progressMap.get(lesson.id);
        if (!progress?.isCompleted) {
          return lesson;
        }
      }
    }
    return course.modules[0]?.lessons[0];
  };

  const nextLesson = getNextLesson();

  const coachInitials = course.coach
    ? `${course.coach.firstName?.charAt(0) || ""}${course.coach.lastName?.charAt(0) || ""}`.toUpperCase()
    : "C";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Header */}
      <Card className="bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 border-0 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>
        <CardContent className="p-8 lg:p-10 relative">
          <div className="flex flex-col lg:flex-row lg:items-center gap-8">
            {/* Course Info */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-4">
                {course.category && (
                  <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                    {course.category.name}
                  </Badge>
                )}
                <Badge className="bg-gold-400/20 text-gold-200 border-gold-400/30">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {course.certificateType === "MINI_DIPLOMA"
                    ? "Mini Diploma"
                    : course.certificateType === "CERTIFICATION"
                    ? "Certification"
                    : "Certificate"}
                </Badge>
                <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                  {course.difficulty.charAt(0) + course.difficulty.slice(1).toLowerCase()}
                </Badge>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">{course.title}</h1>
              <p className="text-burgundy-100 text-lg mb-6 max-w-2xl">
                {course.shortDescription || "Start your learning journey"}
              </p>

              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 text-sm text-burgundy-100">
                {analytics?.avgRating && (
                  <div className="flex items-center gap-1 bg-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm">
                    <Star className="w-4 h-4 fill-gold-400 text-gold-400" />
                    <span className="font-semibold text-white">{analytics.avgRating.toFixed(1)}</span>
                    <span className="text-burgundy-200">({reviews.length})</span>
                  </div>
                )}
                <div className="flex items-center gap-1 bg-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm">
                  <Users className="w-4 h-4 text-gold-400" />
                  <span>{(analytics?.totalEnrolled || course._count.enrollments).toLocaleString()} enrolled</span>
                </div>
                <div className="flex items-center gap-1 bg-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm">
                  <BookOpen className="w-4 h-4 text-gold-400" />
                  <span>{totalLessons} lessons</span>
                </div>
                <div className="flex items-center gap-1 bg-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm">
                  <Clock className="w-4 h-4 text-gold-400" />
                  <span>{course.duration ? `${Math.floor(course.duration / 60)}h ${course.duration % 60}m` : "Self-paced"}</span>
                </div>
              </div>

              {/* Progress bar for enrolled users */}
              {enrollment && (
                <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-gold-400" />
                      <span className="font-medium text-white">Your Progress</span>
                    </div>
                    <span className="text-lg font-bold text-gold-400">{Math.round(progressPercentage)}%</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2 bg-white/20" />
                  <p className="text-xs mt-2 text-burgundy-200">
                    {completedLessons} of {totalLessons} lessons completed
                  </p>
                </div>
              )}
            </div>

            {/* Price & Actions Card */}
            <div className="lg:w-72 flex-shrink-0">
              <div className="bg-white rounded-2xl p-6 shadow-xl">
                {!enrollment && (
                  <div className="text-center mb-5">
                    <p className="text-4xl font-bold text-gray-900">
                      {course.isFree ? "Free" : course.price ? `$${course.price}` : "Free"}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">Lifetime access</p>
                  </div>
                )}

                {enrollment ? (
                  <div className="space-y-3">
                    {nextLesson && enrollment.status !== "COMPLETED" && (
                      <Link href={`/courses/${course.slug}/learn/${nextLesson.id}`}>
                        <Button className="w-full bg-burgundy-600 hover:bg-burgundy-700 h-12 text-base" size="lg">
                          <Play className="w-5 h-5 mr-2" />
                          Continue Learning
                        </Button>
                      </Link>
                    )}
                    {enrollment.status === "COMPLETED" && (
                      <Link href="/certificates">
                        <Button className="w-full bg-amber-500 hover:bg-amber-600 text-white h-12 text-base" size="lg">
                          <Award className="w-5 h-5 mr-2" />
                          View Certificate
                        </Button>
                      </Link>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <EnrollButton courseId={course.id} courseName={course.title} />
                  </div>
                )}

                <Button variant="outline" className="w-full mt-3 border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50">
                  <Download className="w-4 h-4 mr-2" />
                  Download Syllabus
                </Button>

                {!enrollment && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Certificate included
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        1:1 coach support
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content - Course Curriculum */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Curriculum */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-burgundy-100 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-burgundy-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Course Curriculum</h2>
                  <p className="text-sm text-gray-500">{course.modules.length} modules, {totalLessons} lessons</p>
                </div>
              </div>
            </div>

            <div>
              {course.modules.map((module, moduleIndex) => {
                const moduleCompleted = module.lessons.filter(
                  (l) => progressMap.get(l.id)?.isCompleted
                ).length;
                const moduleProgress = module.lessons.length > 0
                  ? (moduleCompleted / module.lessons.length) * 100
                  : 0;

                return (
                  <div key={module.id} className="border-b border-gray-100 last:border-0">
                    <div className="p-5 bg-gradient-to-r from-burgundy-50/50 to-transparent">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-burgundy-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                          {moduleIndex + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {module.title}
                          </h3>
                          {module.description && (
                            <p className="text-sm text-gray-500">
                              {module.description}
                            </p>
                          )}
                          <div className="flex items-center gap-3 mt-2">
                            <Progress value={moduleProgress} className="w-24 h-1.5 bg-burgundy-100" />
                            <span className="text-xs text-gray-500">
                              {moduleCompleted}/{module.lessons.length} completed
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      {module.lessons.map((lesson, lessonIndex) => {
                        const progress = progressMap.get(lesson.id);
                        const isCompleted = progress?.isCompleted;
                        const isAccessible = enrollment || lesson.isFreePreview;
                        const LessonIcon = lessonTypeIcons[lesson.lessonType] || Video;

                        return (
                          <div key={lesson.id}>
                            {isAccessible ? (
                              <Link
                                href={`/courses/${course.slug}/learn/${lesson.id}`}
                                className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group"
                              >
                                <div
                                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${
                                    isCompleted
                                      ? "bg-green-100 text-green-600"
                                      : "bg-gray-100 text-gray-500 group-hover:bg-burgundy-100 group-hover:text-burgundy-600"
                                  }`}
                                >
                                  {isCompleted ? (
                                    <CheckCircle className="w-5 h-5" />
                                  ) : (
                                    <LessonIcon className="w-5 h-5" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={`font-medium ${
                                      isCompleted ? "text-green-700" : "text-gray-900"
                                    }`}
                                  >
                                    {lesson.title}
                                  </p>
                                  <div className="flex items-center gap-3 mt-1">
                                    {lesson.videoDuration && (
                                      <span className="text-xs text-gray-500 flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {formatDuration(lesson.videoDuration)}
                                      </span>
                                    )}
                                    {lesson.isFreePreview && !enrollment && (
                                      <Badge className="bg-green-100 text-green-700 border-0 text-xs">
                                        Free Preview
                                      </Badge>
                                    )}
                                    {lesson.lessonType !== "VIDEO" && (
                                      <Badge variant="outline" className="text-xs">
                                        {lesson.lessonType.charAt(0) +
                                          lesson.lessonType.slice(1).toLowerCase().replace('_', ' ')}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-burgundy-600 transition-colors" />
                              </Link>
                            ) : (
                              <div className="flex items-center gap-4 px-5 py-4 opacity-60">
                                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                                  <Lock className="w-4 h-4 text-gray-400" />
                                </div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-600">
                                    {lesson.title}
                                  </p>
                                  {lesson.videoDuration && (
                                    <span className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                                      <Clock className="w-3 h-3" />
                                      {formatDuration(lesson.videoDuration)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Course Description */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-burgundy-100 flex items-center justify-center">
                <FileText className="w-5 h-5 text-burgundy-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">About This Course</h2>
            </div>
            <div className="prose prose-gray max-w-none prose-p:text-gray-600 prose-li:text-gray-600">
              <p className="whitespace-pre-line">{course.description}</p>
            </div>
          </div>

          {/* Course Reviews */}
          {reviews.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <CourseReviews
                reviews={reviews}
                averageRating={analytics?.avgRating || 4.9}
                totalReviews={reviews.length}
                totalEnrolled={analytics?.totalEnrolled || course._count.enrollments}
              />
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* What You'll Get Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-burgundy-600" />
              What You&apos;ll Get
            </h3>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                {totalLessons} comprehensive lessons
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                {course.certificateType === "MINI_DIPLOMA"
                  ? "Mini Diploma"
                  : course.certificateType === "CERTIFICATION"
                  ? "Professional Certification"
                  : "Certificate of completion"}
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                Lifetime access to materials
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                1:1 coach support
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                </div>
                Community access
              </li>
            </ul>
          </div>

          {/* Coach Card */}
          {course.coach && (
            <div className="bg-gradient-to-br from-gold-50 to-white rounded-2xl border border-gold-200/50 p-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="h-14 w-14 ring-4 ring-gold-400/20">
                  <AvatarImage src={course.coach.avatar || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-gold-400 to-gold-600 text-burgundy-900 font-semibold">
                    {coachInitials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs text-gold-600 font-medium">Your Course Coach</p>
                  <p className="font-semibold text-gray-900">
                    {course.coach.firstName} {course.coach.lastName}
                  </p>
                </div>
              </div>
              {course.coach.bio && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {course.coach.bio}
                </p>
              )}
              <Link href={`/messages?to=${course.coach.id}`}>
                <Button variant="outline" className="w-full border-gold-300 text-gold-700 hover:bg-gold-50">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Contact Coach
                </Button>
              </Link>
            </div>
          )}

          {/* Course Stats */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Course Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Modules</span>
                <span className="font-medium text-gray-900">{course.modules.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Lessons</span>
                <span className="font-medium text-gray-900">{totalLessons}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Duration</span>
                <span className="font-medium text-gray-900">
                  {course.duration
                    ? `${Math.floor(course.duration / 60)}h ${course.duration % 60}m`
                    : "Self-paced"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Level</span>
                <span className="font-medium text-gray-900">
                  {course.difficulty.charAt(0) + course.difficulty.slice(1).toLowerCase()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Certificate</span>
                <span className="font-medium text-gray-900">
                  {course.certificateType === "MINI_DIPLOMA"
                    ? "Mini Diploma"
                    : course.certificateType === "CERTIFICATION"
                    ? "Certification"
                    : "Completion"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
