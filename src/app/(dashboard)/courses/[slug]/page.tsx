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
  CheckCircle,
  GraduationCap,
  MessageCircle,
  Sparkles,
  Target,
  FileText,
  Video,
  HelpCircle,
  ClipboardList,
  Star,
} from "lucide-react";
import { CourseReviews } from "@/components/courses/course-reviews";
import { CourseCurriculumAccordion } from "@/components/courses/course-curriculum-accordion";
import { CoursePriceCard } from "@/components/courses/course-price-card";

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
  });
}

async function getCourseAnalytics(courseId: string) {
  return prisma.courseAnalytics.findUnique({
    where: { courseId },
  });
}

async function getUserMiniDiplomaCompletion(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { miniDiplomaCompletedAt: true },
  });
  return user?.miniDiplomaCompletedAt || null;
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

  const [reviews, analytics, miniDiplomaCompletedAt] = await Promise.all([
    getCourseReviews(course.id),
    getCourseAnalytics(course.id),
    session?.user?.id ? getUserMiniDiplomaCompletion(session.user.id) : null,
  ]);

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
                {/* 9x Certified Badge - Primary Emphasis (hide for mini diplomas) */}
                {course.certificateType !== "MINI_DIPLOMA" && (
                  <Badge className="bg-gold-400 text-burgundy-900 border-0 font-bold shadow-lg">
                    <Award className="w-3 h-3 mr-1" />
                    9x Accredited Certification
                  </Badge>
                )}
                {course.category && (
                  <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                    {course.category.name}
                  </Badge>
                )}
                <Badge className="bg-gold-400/20 text-gold-200 border-gold-400/30">
                  <Sparkles className="w-3 h-3 mr-1" />
                  {course.certificateType === "MINI_DIPLOMA"
                    ? "Free Mini Diploma"
                    : course.certificateType === "CERTIFICATION"
                    ? "Professional Certification"
                    : "Certificate"}
                </Badge>
                {course.certificateType !== "MINI_DIPLOMA" && (
                  <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                    {course.difficulty.charAt(0) + course.difficulty.slice(1).toLowerCase()}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">{course.title}</h1>

              {/* Full Course Description */}
              <div className="text-burgundy-100 text-base mb-6 max-w-2xl space-y-3">
                {course.description ? (
                  course.description.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="leading-relaxed">
                      {paragraph.split('\n').map((line, lineIndex) => (
                        <span key={lineIndex}>
                          {line}
                          {lineIndex < paragraph.split('\n').length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  ))
                ) : (
                  <p>{course.shortDescription || "Start your professional certification journey"}</p>
                )}
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 text-sm text-burgundy-100">
                <div className="flex items-center gap-1 bg-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm">
                  <Star className="w-4 h-4 fill-gold-400 text-gold-400" />
                  <span className="font-semibold text-white">{analytics?.avgRating?.toFixed(1) || "4.9"}</span>
                  <span className="text-burgundy-200">({course.slug === "functional-medicine-complete-certification" ? "823" :
                    course.slug === "womens-hormone-health-coach" ? "412" :
                    course.slug === "gut-health-digestive-wellness-coach" ? "347" :
                    reviews.length})</span>
                </div>
                <div className="flex items-center gap-1 bg-white/10 rounded-full px-3 py-1.5 backdrop-blur-sm">
                  <Users className="w-4 h-4 text-gold-400" />
                  <span>{course.certificateType === "MINI_DIPLOMA" ? 1975 :
                    course.slug === "functional-medicine-complete-certification" ? 1447 :
                    course.slug === "womens-hormone-health-coach" ? 892 :
                    course.slug === "gut-health-digestive-wellness-coach" ? 756 :
                    (analytics?.totalEnrolled || course._count.enrollments || 0) + 47} practitioners enrolled</span>
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
              <CoursePriceCard
                courseId={course.id}
                courseTitle={course.title}
                courseSlug={course.slug}
                isFree={course.isFree}
                price={course.price ? Number(course.price) : null}
                certificateType={course.certificateType}
                isEnrolled={!!enrollment}
                enrollmentStatus={enrollment?.status || null}
                nextLessonId={nextLesson?.id || null}
                miniDiplomaCompletedAt={miniDiplomaCompletedAt?.toISOString() || null}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content - Course Curriculum */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Curriculum - Accordion */}
          <CourseCurriculumAccordion
            modules={course.modules.map((m) => ({
              id: m.id,
              title: m.title,
              description: m.description,
              lessons: m.lessons.map((l) => ({
                id: l.id,
                title: l.title,
                lessonType: l.lessonType,
                videoDuration: l.videoDuration,
                isFreePreview: l.isFreePreview,
              })),
            }))}
            courseSlug={course.slug}
            isEnrolled={!!enrollment}
            progressMap={Object.fromEntries(
              Array.from(progressMap.entries()).map(([key, value]) => [
                key,
                {
                  isCompleted: value.isCompleted,
                  watchTime: value.watchTime || undefined,
                  lastPosition: value.lastPosition || undefined,
                },
              ])
            )}
          />

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
          {/* Certified Practitioner Training Card - Hidden for mini diplomas */}
          {course.certificateType !== "MINI_DIPLOMA" && (
          <div className="bg-gradient-to-br from-gold-50 to-white rounded-2xl border border-gold-200 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-gold-400 to-gold-500 px-5 py-3">
              <p className="text-burgundy-900 text-sm font-bold flex items-center gap-2">
                <Award className="w-4 h-4" />
                Certified Practitioner Training
              </p>
            </div>
            {/* Certificate Preview Image */}
            {(course.slug === "functional-medicine-complete-certification" ||
              course.slug === "gut-health-certification" ||
              course.slug === "gut-health-digestive-wellness-coach" ||
              course.slug === "womens-hormone-health-coach" ||
              course.slug === "womens-hormone-health-certification") && (
              <div className="px-5 pt-5">
                <div className="relative rounded-xl overflow-hidden border-2 border-gold-200 shadow-lg">
                  <img
                    src={
                      course.slug === "functional-medicine-complete-certification"
                        ? "/certificates_img/FUNCTIONAL_MEDICINE_CERTIFICATE.webp"
                        : course.slug === "gut-health-certification" || course.slug === "gut-health-digestive-wellness-coach"
                        ? "/certificates_img/GUT_HEALTH_CERTIFICATE.webp"
                        : "/certificates_img/WOMENS_HEALTH_CERTIFICATE.webp"
                    }
                    alt="Certificate Preview"
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-burgundy-900/60 to-transparent flex items-end">
                    <div className="p-3 w-full">
                      <Badge className="bg-gold-400 text-burgundy-900 font-bold text-xs">
                        <Award className="w-3 h-3 mr-1" />
                        Your Certificate Awaits
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="p-5">
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-gold-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Award className="w-3.5 h-3.5 text-gold-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">9x Accredited Certification</span>
                    <p className="text-xs text-gray-500 mt-0.5">Internationally recognized credentials</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Practice with Confidence</span>
                    <p className="text-xs text-gray-500 mt-0.5">Full professional legitimacy to work with clients</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-burgundy-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <GraduationCap className="w-3.5 h-3.5 text-burgundy-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Career-Ready Training</span>
                    <p className="text-xs text-gray-500 mt-0.5">Start your practice immediately after completion</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MessageCircle className="w-3.5 h-3.5 text-purple-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">1:1 Expert Mentorship</span>
                    <p className="text-xs text-gray-500 mt-0.5">Personal guidance from certified coaches</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Users className="w-3.5 h-3.5 text-blue-600" />
                  </div>
                  <div>
                    <span className="font-semibold text-gray-900">Professional Community</span>
                    <p className="text-xs text-gray-500 mt-0.5">Connect with practitioners worldwide</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          )}

          {/* Coach Card - Enhanced */}
          {course.coach && (
            <div className="bg-gradient-to-br from-burgundy-50 via-burgundy-50/50 to-white rounded-2xl border border-burgundy-200 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 px-5 py-3">
                <p className="text-white text-sm font-medium flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Need Help? Ask Your Coach
                </p>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16 ring-4 ring-burgundy-200 shadow-lg">
                    <AvatarImage src={course.coach.avatar || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-burgundy-500 to-burgundy-700 text-white font-bold text-xl">
                      {coachInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">
                      {course.coach.firstName} {course.coach.lastName}
                    </p>
                    <p className="text-sm text-burgundy-600">Course Coach & Mentor</p>
                  </div>
                </div>

                {course.coach.bio && (
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                    {course.coach.bio}
                  </p>
                )}

                {/* Quick Action Buttons */}
                <div className="space-y-2">
                  <Link href={`/messages?to=${course.coach.id}`} className="block">
                    <Button className="w-full bg-burgundy-600 hover:bg-burgundy-700 text-white shadow-md">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Send a Message
                    </Button>
                  </Link>
                  <p className="text-xs text-center text-gray-500">
                    Usually responds within 24 hours
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Course Stats - Enhanced */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-white p-4 border-b border-gray-100">
              <h3 className="font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-burgundy-600" />
                Course Details
              </h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-2 gap-4 mb-4">
                {/* Key Stats Grid */}
                <div className="bg-burgundy-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-burgundy-600">{course.modules.length}</div>
                  <div className="text-xs text-gray-600">Modules</div>
                </div>
                <div className="bg-burgundy-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-burgundy-600">{totalLessons}</div>
                  <div className="text-xs text-gray-600">Lessons</div>
                </div>
                <div className="bg-gold-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-gold-600">
                    {course.duration ? `${Math.floor(course.duration / 60)}h` : "∞"}
                  </div>
                  <div className="text-xs text-gray-600">Duration</div>
                </div>
                <div className="bg-green-50 rounded-xl p-3 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {course.certificateType === "CERTIFICATION" ? course.modules.length : 1}
                  </div>
                  <div className="text-xs text-gray-600">Certificates</div>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Enrolled
                  </span>
                  <span className="font-semibold text-gray-900">
                    {(course.slug === "functional-medicine-complete-certification" ? 1447 :
                      course.slug === "womens-hormone-health-coach" ? 892 :
                      course.slug === "gut-health-digestive-wellness-coach" ? 756 :
                      ((analytics?.totalEnrolled || course._count.enrollments || 0) + 347)).toLocaleString()} practitioners
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Rating
                  </span>
                  <span className="font-semibold text-gray-900 flex items-center gap-1">
                    <Star className="w-4 h-4 fill-gold-400 text-gold-400" />
                    {analytics?.avgRating?.toFixed(1) || "4.9"} ({course.slug === "functional-medicine-complete-certification" ? 823 :
                      course.slug === "womens-hormone-health-coach" ? 412 :
                      course.slug === "gut-health-digestive-wellness-coach" ? 347 :
                      reviews.length})
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    Level
                  </span>
                  <Badge variant="outline" className="font-medium">
                    {course.difficulty.charAt(0) + course.difficulty.slice(1).toLowerCase()}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center gap-2">
                    <GraduationCap className="w-4 h-4" />
                    Certificate Type
                  </span>
                  <Badge className="bg-burgundy-100 text-burgundy-700 border-0">
                    {course.certificateType === "MINI_DIPLOMA"
                      ? "Mini Diploma"
                      : course.certificateType === "CERTIFICATION"
                      ? "Certification"
                      : "Completion"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
