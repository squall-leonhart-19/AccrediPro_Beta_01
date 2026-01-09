import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// Force dynamic rendering - no caching
export const dynamic = "force-dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  BookOpen,
  Clock,
  Award,
  Play,
  CheckCircle,
  GraduationCap,
  ArrowRight,
  Trophy,
  MapPin,
  MessageSquare,
  Users,
  Sparkles,
  ChevronRight,
  TrendingUp,
  Calendar,
  Target,
  Flame,
  Star,
  Zap,
} from "lucide-react";

// Course level priority mapping (lower = should be done first)
const COURSE_LEVEL_ORDER: Record<string, number> = {
  // L1 - Foundation courses (highest priority)
  "certified-functional-medicine-practitioner": 1,
  "functional-medicine-complete-certification": 1,
  "certified-holistic-nutrition-coach": 1,
  "certified-womens-hormone-health-coach": 1,
  "certified-gut-health-coach": 1,
  "certified-life-coach": 1,

  // L2 - Advanced courses
  "functional-medicine-advanced-clinical-depth": 2,

  // L3 - Master courses
  "functional-medicine-master-depth": 3,

  // L4 - Practice Path (business/launch)
  "functional-medicine-practice-path": 4,
};

function getCourseLevel(slug: string): number {
  return COURSE_LEVEL_ORDER[slug] || 5; // Default to 5 for unknown courses
}

function getCourseLevelLabel(level: number): string {
  switch (level) {
    case 1: return "Foundation";
    case 2: return "Advanced";
    case 3: return "Master";
    case 4: return "Business";
    default: return "Course";
  }
}

function getCourseLevelColor(level: number): string {
  switch (level) {
    case 1: return "bg-emerald-100 text-emerald-700 border-emerald-200";
    case 2: return "bg-blue-100 text-blue-700 border-blue-200";
    case 3: return "bg-purple-100 text-purple-700 border-purple-200";
    case 4: return "bg-amber-100 text-amber-700 border-amber-200";
    default: return "bg-gray-100 text-gray-700 border-gray-200";
  }
}

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
          category: true,
          duration: true,
          modules: {
            where: { isPublished: true },
            include: {
              lessons: { where: { isPublished: true }, select: { id: true, title: true } },
            },
          },
        },
      },
    },
    orderBy: { lastAccessedAt: "desc" },
  });
}

async function getUserProgress(userId: string) {
  const [lessonProgress, badges, streak] = await Promise.all([
    prisma.lessonProgress.findMany({
      where: { userId, isCompleted: true },
      select: { lessonId: true },
    }),
    prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
    }),
    prisma.userStreak.findUnique({
      where: { userId },
    }),
  ]);
  return { completedLessons: lessonProgress.length, badges, streak };
}

async function getCommunityStats() {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart.getTime() - 7 * 24 * 60 * 60 * 1000);

  const [graduatesThisWeek, totalActiveStudents] = await Promise.all([
    prisma.enrollment.count({
      where: { status: "COMPLETED", completedAt: { gte: weekStart } },
    }),
    prisma.user.count({
      where: { isActive: true, role: "STUDENT" },
    }),
  ]);

  return {
    graduatesThisWeek: Math.max(8, graduatesThisWeek + 5),
    totalPractitioners: Math.max(500, totalActiveStudents + 450),
  };
}

// Get next lesson for a course
async function getNextLesson(userId: string, courseId: string) {
  const lessonsWithProgress = await prisma.lesson.findMany({
    where: {
      module: { courseId, isPublished: true },
      isPublished: true,
    },
    include: {
      module: { select: { order: true, title: true } },
      progress: {
        where: { userId },
        select: { isCompleted: true },
      },
    },
    orderBy: [
      { module: { order: "asc" } },
      { order: "asc" },
    ],
  });

  const nextLesson = lessonsWithProgress.find(l => !l.progress[0]?.isCompleted);
  if (nextLesson) {
    return { title: nextLesson.title, moduleTitle: nextLesson.module.title };
  }
  if (lessonsWithProgress.length > 0) {
    const last = lessonsWithProgress[lessonsWithProgress.length - 1];
    return { title: last.title, moduleTitle: last.module.title };
  }
  return null;
}

// Calculate progress for an enrollment
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

  return {
    totalLessons,
    completedLessons,
    progress: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
  };
}

// Generate Sarah's contextual message with earning potential
function getSarahMessage(
  inProgressCourse: any,
  progress: number,
  daysSinceLastAccess: number,
  userName: string
): string {
  const firstName = userName?.split(' ')[0] || 'there';
  const earningHint = "💰 Graduates earn $5K-$15K/month helping clients transform their health.";

  if (daysSinceLastAccess > 5) {
    return `Hey ${firstName}! 👋 I noticed you've been away for a few days. Ready to pick up where you left off? You were making great progress! ${earningHint}`;
  }

  if (progress === 0) {
    return `Welcome ${firstName}! 🎉 Your certification journey begins now. Let's start with your first lesson - I'll guide you every step of the way. ${earningHint}`;
  }

  if (progress < 25) {
    return `Great start ${firstName}! 🚀 You're ${Math.round(progress)}% through. Keep this momentum going - the first modules are the foundation of everything! ${earningHint}`;
  }

  if (progress < 50) {
    return `Awesome progress ${firstName}! 💪 You're nearly halfway there (${Math.round(progress)}%). At this pace, you'll be certified and earning soon! ${earningHint}`;
  }

  if (progress < 75) {
    return `${firstName}, you're crushing it! 🔥 ${Math.round(progress)}% complete - the finish line is in sight. Most grads land their first client within 60 days of certification!`;
  }

  if (progress < 100) {
    return `So close ${firstName}! ⭐ Just ${Math.round(100 - progress)}% left to go. You're about to become a certified practitioner earning $5K-$15K/month helping clients!`;
  }

  return `Congratulations ${firstName}! 🏆 You've completed this certification. Ready to level up with the next credential? Many practitioners stack certifications to earn $10K-$25K/month!`;
}

export default async function MyCoursesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const [enrollments, userProgress, communityStats] = await Promise.all([
    getEnrolledCourses(session.user.id),
    getUserProgress(session.user.id),
    getCommunityStats(),
  ]);

  // Calculate progress for ALL enrollments
  const enrollmentsWithProgress = await Promise.all(
    enrollments.map(async (enrollment) => {
      const progressData = await calculateProgress(session.user.id, enrollment);
      const level = getCourseLevel(enrollment.course.slug);
      return {
        ...enrollment,
        ...progressData,
        level,
        levelLabel: getCourseLevelLabel(level),
        levelColor: getCourseLevelColor(level),
      };
    })
  );

  // SMART SORTING: First by progress (highest first), then by level (lower = earlier in journey)
  const sortedEnrollments = enrollmentsWithProgress.sort((a, b) => {
    // First: courses with progress > 0 go first
    if (a.progress > 0 && b.progress === 0) return -1;
    if (b.progress > 0 && a.progress === 0) return 1;

    // If both have progress > 0, sort by progress descending (continue what you started)
    if (a.progress > 0 && b.progress > 0) {
      if (b.progress !== a.progress) return b.progress - a.progress;
    }

    // If both have 0 progress, sort by level (L1 first)
    return a.level - b.level;
  });

  const inProgressCourses = sortedEnrollments.filter((e) => e.status === "ACTIVE");
  const completedCourses = sortedEnrollments.filter((e) => e.status === "COMPLETED");

  // PRIMARY = first in sorted list (either highest progress, or if all 0%, the L1 course)
  const primaryCourse = inProgressCourses[0];
  const otherCourses = inProgressCourses.slice(1);

  // Get next lesson info for primary course
  let nextLessonInfo = null;
  if (primaryCourse) {
    nextLessonInfo = await getNextLesson(session.user.id, primaryCourse.courseId);
  }

  // Days since last access
  const daysSinceLastAccess = primaryCourse?.lastAccessedAt
    ? Math.floor((Date.now() - new Date(primaryCourse.lastAccessedAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // Sarah's contextual message
  const sarahMessage = primaryCourse
    ? getSarahMessage(
      primaryCourse,
      primaryCourse.progress,
      daysSinceLastAccess,
      `${session.user.firstName || ''} ${session.user.lastName || ''}`.trim()
    )
    : "Welcome! Let's start your certification journey. Browse our catalog to find the perfect program for you.";

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Sarah's Contextual Message - AI Coach */}
      <Card className="bg-gradient-to-r from-emerald-50 via-white to-teal-50 border-emerald-200 shadow-lg overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg border-2 border-white">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-emerald-800">Coach Sarah</span>
                <Badge className="bg-emerald-100 text-emerald-700 border-0 text-[10px]">Your Mentor</Badge>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{sarahMessage}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* PRIMARY COURSE - ONE THING HERO */}
      {primaryCourse ? (
        <Card className="overflow-hidden border-0 shadow-2xl">
          {/* Hero Image Section */}
          <div className="relative aspect-[21/9] md:aspect-[3/1] bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800">
            {primaryCourse.course.thumbnail ? (
              <Image
                src={primaryCourse.course.thumbnail}
                alt={primaryCourse.course.title}
                fill
                sizes="100vw"
                className="object-cover opacity-40"
                priority
              />
            ) : (
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

            {/* Content Overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className={`${primaryCourse.levelColor} font-semibold`}>
                  <Star className="w-3 h-3 mr-1" />
                  {primaryCourse.levelLabel}
                </Badge>
                {primaryCourse.course.category && (
                  <Badge className="bg-white/20 text-white border-0 backdrop-blur-sm">
                    {primaryCourse.course.category.name}
                  </Badge>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4 drop-shadow-lg">
                {primaryCourse.course.title}
              </h1>

              {/* Progress Section */}
              <div className="max-w-xl">
                <div className="flex items-center justify-between text-white mb-2">
                  <span className="text-sm font-medium">Your Progress</span>
                  <span className="text-2xl font-bold text-gold-400">{primaryCourse.progress}%</span>
                </div>
                <div className="h-3 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
                  <div
                    className="h-full bg-gradient-to-r from-gold-400 to-gold-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.max(2, primaryCourse.progress)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-2 text-sm text-white/80">
                  <span>{primaryCourse.completedLessons} of {primaryCourse.totalLessons} lessons completed</span>
                  {primaryCourse.course.duration && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      ~{Math.round(primaryCourse.course.duration * (1 - primaryCourse.progress / 100) / 60)}h remaining
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action Section */}
          <CardContent className="p-6 bg-gradient-to-b from-gray-50 to-white">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Next Lesson Info */}
              {nextLessonInfo && (
                <div className="flex-1 bg-burgundy-50 rounded-xl p-4 border border-burgundy-100">
                  <p className="text-xs text-burgundy-600 font-medium mb-1 flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    Next Up
                  </p>
                  <p className="font-semibold text-burgundy-800 line-clamp-1">
                    {nextLessonInfo.title}
                  </p>
                  <p className="text-xs text-burgundy-500">{nextLessonInfo.moduleTitle}</p>
                </div>
              )}

              {/* CTA Button - HUGE */}
              <Link href={`/courses/${primaryCourse.course.slug}`} className="flex-shrink-0">
                <Button
                  size="lg"
                  className="w-full md:w-auto bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white px-8 py-6 text-lg font-bold shadow-xl hover:shadow-2xl transition-all"
                >
                  <Play className="w-6 h-6 mr-2" />
                  Continue Learning
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Empty State - No Courses */
        <Card className="border-0 shadow-lg">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-burgundy-100 to-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="w-10 h-10 text-burgundy-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Start Your Journey</h2>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              You haven't enrolled in any certifications yet. Browse our catalog to find the perfect program for your career goals.
            </p>
            <Link href="/catalog">
              <Button size="lg" className="bg-burgundy-600 hover:bg-burgundy-700">
                <BookOpen className="w-5 h-5 mr-2" />
                Explore Certifications
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Other In-Progress Courses - Premium Cards */}
      {otherCourses.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Your Learning Path
          </h2>
          <div className="grid gap-3">
            {otherCourses.map((enrollment, index) => (
              <Link key={enrollment.id} href={`/courses/${enrollment.course.slug}`}>
                <Card className="hover:shadow-lg transition-all cursor-pointer border-gray-200 hover:border-burgundy-200 group">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Order Number */}
                      <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-burgundy-100 flex items-center justify-center flex-shrink-0 transition-colors">
                        <span className="text-lg font-bold text-gray-400 group-hover:text-burgundy-600">{index + 2}</span>
                      </div>

                      {/* Thumbnail */}
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-burgundy-100 flex-shrink-0 relative">
                        {enrollment.course.thumbnail ? (
                          <Image
                            src={enrollment.course.thumbnail}
                            alt={enrollment.course.title}
                            width={64}
                            height={64}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-burgundy-500 to-burgundy-700">
                            <GraduationCap className="w-6 h-6 text-white" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={`${enrollment.levelColor} text-[10px] px-1.5 py-0`}>
                            {enrollment.levelLabel}
                          </Badge>
                        </div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-burgundy-700 truncate transition-colors">
                          {enrollment.course.title}
                        </h3>
                        <div className="flex items-center gap-3 mt-2">
                          <div className="flex-1 max-w-40">
                            <Progress value={enrollment.progress} className="h-2" />
                          </div>
                          <span className="text-sm font-medium text-gray-600">{enrollment.progress}%</span>
                          <span className="text-xs text-gray-400">
                            {enrollment.completedLessons}/{enrollment.totalLessons} lessons
                          </span>
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-burgundy-600 flex items-center justify-center transition-colors">
                          <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Completed Courses */}
      {completedCourses.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-2">
              <Trophy className="w-4 h-4 text-gold-500" />
              Completed Certifications
            </h2>
            <Link href="/my-credentials">
              <Button variant="ghost" size="sm" className="text-gold-600 hover:text-gold-700">
                View Credentials →
              </Button>
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {completedCourses.map((enrollment) => (
              <Card key={enrollment.id} className="border-emerald-200 bg-gradient-to-br from-white to-emerald-50 hover:shadow-md transition-shadow">
                <CardContent className="p-4 text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <Badge className={`${enrollment.levelColor} text-[10px] mb-2`}>
                    {enrollment.levelLabel}
                  </Badge>
                  <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-2">
                    {enrollment.course.title}
                  </h4>
                  <Link href={`/courses/${enrollment.course.slug}`}>
                    <Button variant="outline" size="sm" className="text-xs">
                      Review Course
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Social Proof Footer - Minimal */}
      <Card className="border-0 bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white">
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center justify-center gap-6 text-center">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gold-400" />
              <span className="text-sm">
                <strong className="text-gold-400">{communityStats.totalPractitioners}+</strong> active practitioners
              </span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-sm">
                <strong className="text-emerald-400">{communityStats.graduatesThisWeek}</strong> graduated this week
              </span>
            </div>
            <Link href="/messages">
              <Button size="sm" variant="secondary" className="bg-white/10 text-white hover:bg-white/20 border-0">
                <MessageSquare className="w-4 h-4 mr-2" />
                Chat with Coach Sarah
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
