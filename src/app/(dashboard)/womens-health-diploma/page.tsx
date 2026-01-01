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
  Shield,
} from "lucide-react";
import Image from "next/image";
import { redirect } from "next/navigation";
import { TestCompleteAllButton } from "./test-complete-button";

export const dynamic = "force-dynamic";

// Hardcoded lessons matching the React components
const LESSONS = [
  { id: 1, title: "Meet Your Hormones", module: 1, moduleName: "Hormonal Foundations" },
  { id: 2, title: "The Monthly Dance", module: 1, moduleName: "Hormonal Foundations" },
  { id: 3, title: "When Hormones Go Rogue", module: 1, moduleName: "Hormonal Foundations" },
  { id: 4, title: "The Gut-Hormone Axis", module: 2, moduleName: "Hormone-Body Connection" },
  { id: 5, title: "Thyroid & Energy", module: 2, moduleName: "Hormone-Body Connection" },
  { id: 6, title: "Stress & Your Adrenals", module: 2, moduleName: "Hormone-Body Connection" },
  { id: 7, title: "Food as Medicine", module: 3, moduleName: "Heal & Thrive" },
  { id: 8, title: "Life Stage Support", module: 3, moduleName: "Heal & Thrive" },
  { id: 9, title: "Your Next Step", module: 3, moduleName: "Heal & Thrive" },
];

const MODULES = [
  { id: 1, name: "Hormonal Foundations", description: "Understanding the female endocrine system", lessons: [1, 2, 3] },
  { id: 2, name: "Hormone-Body Connection", description: "How hormones affect your whole body", lessons: [4, 5, 6] },
  { id: 3, name: "Heal & Thrive", description: "Your path to hormonal wellness", lessons: [7, 8, 9] },
];

async function getWomensHealthProgress(userId: string) {
  // Get user data including access expiry
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      firstName: true,
      email: true,
      accessExpiresAt: true,
      userType: true,
    },
  });

  // Check enrollment exists
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
      course: { slug: "womens-health-mini-diploma" },
    },
  });

  if (!enrollment) {
    return null;
  }

  // Get completed lessons from localStorage key stored in database
  // For now, use a simple key-value approach
  const progressKey = `womens-health-progress-${userId}`;

  // Get user tags that track lesson completion
  const completionTags = await prisma.userTag.findMany({
    where: {
      userId,
      tag: { startsWith: "wh-lesson-complete:" },
    },
  });

  const completedLessons = new Set(
    completionTags.map((t) => parseInt(t.tag.replace("wh-lesson-complete:", "")))
  );

  return {
    user,
    enrollment,
    completedLessons,
  };
}

export default async function WomensHealthDiplomaPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const data = await getWomensHealthProgress(session.user.id);

  if (!data) {
    redirect("/dashboard");
  }

  const { user, completedLessons } = data;
  const firstName = user?.firstName || session.user.firstName || "there";
  const isTestUser = user?.email === "at.seed019@gmail.com";

  // Calculate progress
  const completedCount = completedLessons.size;
  const totalLessons = LESSONS.length;
  const progress = (completedCount / totalLessons) * 100;
  const isCompleted = completedCount === totalLessons;

  // Find next lesson
  const nextLessonNumber = LESSONS.find((l) => !completedLessons.has(l.id))?.id || null;

  // Calculate days remaining
  let daysRemaining = 7;
  let isExpired = false;
  if (user?.accessExpiresAt) {
    const now = new Date();
    const expiry = new Date(user.accessExpiresAt);
    const diffMs = expiry.getTime() - now.getTime();
    daysRemaining = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    isExpired = daysRemaining <= 0;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-burgundy-50 via-white to-gray-50">
      {/* Hero Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-burgundy-500/20 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 py-8 md:py-10">
          {/* Access Timer Warning */}
          {!isCompleted && daysRemaining <= 3 && daysRemaining > 0 && (
            <div className="mb-6 bg-amber-400/20 backdrop-blur-sm rounded-xl p-4 border border-amber-400/30 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-300 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">
                  {daysRemaining === 1 ? "Last day!" : `${daysRemaining} days remaining`}
                </p>
                <p className="text-burgundy-200 text-sm">Complete your mini diploma to earn your certificate!</p>
              </div>
            </div>
          )}

          {/* Expired Notice */}
          {isExpired && !isCompleted && (
            <div className="mb-6 bg-red-500/20 backdrop-blur-sm rounded-xl p-4 border border-red-400/30 flex items-center gap-3">
              <Lock className="w-5 h-5 text-red-300 flex-shrink-0" />
              <div>
                <p className="text-white font-medium">Access expired</p>
                <p className="text-burgundy-200 text-sm">Upgrade to continue your learning journey!</p>
              </div>
              <Button size="sm" className="ml-auto bg-white text-burgundy-600 hover:bg-burgundy-50">
                Upgrade Now
              </Button>
            </div>
          )}

          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
            <div className="relative">
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-burgundy-400 to-burgundy-600 flex items-center justify-center text-white text-2xl md:text-3xl font-bold shadow-xl ring-4 ring-white/20">
                S
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-400 rounded-full border-2 border-white flex items-center justify-center">
                <Heart className="w-3 h-3 text-white" />
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-gold-400/20 text-gold-300 border-gold-400/30 font-semibold">
                  <Shield className="w-3 h-3 mr-1" />
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
                Hey {firstName}! 👋
              </h1>
              <p className="text-burgundy-200 text-base md:text-lg">
                {isCompleted
                  ? "You've mastered the foundations of women's health!"
                  : "I'm Sarah, your guide to hormonal wellness. Let's learn together!"}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-400" />
                <span className="text-white font-medium">Your Progress</span>
              </div>
              <span className="text-gold-300 font-bold text-lg">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="relative">
              <Progress value={progress} className="h-3 bg-white/20" />
            </div>
            <p className="text-burgundy-200 text-sm mt-2">
              {completedCount} of {totalLessons} lessons completed
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Next Lesson CTA */}
        {nextLessonNumber && !isCompleted && !isExpired && (
          <Card className="mb-8 border-0 shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                      <Play className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-burgundy-200 text-sm font-medium">Continue Learning</span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
                    Lesson {nextLessonNumber}: {LESSONS[nextLessonNumber - 1].title}
                  </h2>
                  <p className="text-burgundy-200 text-sm flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    ~6 min interactive chat with Sarah
                  </p>
                </div>
                <Link href={`/womens-health-diploma/lesson/${nextLessonNumber}`}>
                  <Button size="lg" className="bg-white text-burgundy-600 hover:bg-burgundy-50 font-bold shadow-lg">
                    Start Lesson
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        )}

        {/* Completion Celebration */}
        {isCompleted && (
          <Card className="mb-8 border-0 shadow-xl overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-burgundy-500 via-burgundy-600 to-burgundy-700" />
            <CardContent className="relative p-8 text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-xl">
                <Trophy className="w-10 h-10 text-gold-500" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Congratulations! 🎉
              </h2>
              <p className="text-burgundy-200 mb-6 max-w-md mx-auto">
                You've completed all 9 lessons and earned your Women's Health Mini Diploma!
                Your certificate is ready to download.
              </p>
              <Link href="/certificates">
                <Button size="lg" className="bg-white text-burgundy-600 hover:bg-burgundy-50 font-bold shadow-lg">
                  <Award className="w-5 h-5 mr-2" />
                  Download Your Certificate
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* Lessons by Module */}
        <div className="space-y-6">
          {MODULES.map((module) => {
            const moduleLessons = LESSONS.filter((l) => module.lessons.includes(l.id));
            const moduleCompleted = moduleLessons.filter((l) => completedLessons.has(l.id)).length;
            const allComplete = moduleCompleted === moduleLessons.length;

            return (
              <Card key={module.id} className="border border-gray-200 shadow-lg overflow-hidden">
                {/* Module Header */}
                <div className="bg-gradient-to-r from-burgundy-50 to-burgundy-100/50 px-6 py-4 border-b border-burgundy-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-burgundy-600 flex items-center justify-center text-white font-bold shadow-md">
                        {module.id}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{module.name}</h3>
                        <p className="text-sm text-gray-500">{module.description}</p>
                      </div>
                    </div>
                    {allComplete ? (
                      <Badge className="bg-emerald-100 text-emerald-700 border-0">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Complete
                      </Badge>
                    ) : (
                      <Badge className="bg-burgundy-100 text-burgundy-700 border-0">
                        {moduleCompleted}/{moduleLessons.length} done
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Lessons */}
                <CardContent className="p-4">
                  <div className="space-y-2">
                    {moduleLessons.map((lesson) => {
                      const isLessonCompleted = completedLessons.has(lesson.id);
                      const isNext = lesson.id === nextLessonNumber;
                      const prevLessonCompleted = lesson.id === 1 || completedLessons.has(lesson.id - 1);
                      const isLocked = !isTestUser && !isLessonCompleted && !prevLessonCompleted;
                      const isDisabled = isExpired && !isLessonCompleted;

                      return (
                        <div
                          key={lesson.id}
                          className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                            isLessonCompleted
                              ? "bg-emerald-50"
                              : isNext && !isDisabled
                              ? "bg-burgundy-50 ring-2 ring-burgundy-400 ring-offset-2"
                              : isLocked || isDisabled
                              ? "bg-gray-50 opacity-60"
                              : "bg-gray-50 hover:bg-gray-100"
                          }`}
                        >
                          {/* Number/Status */}
                          <div
                            className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 font-bold ${
                              isLessonCompleted
                                ? "bg-emerald-500 text-white"
                                : isNext && !isDisabled
                                ? "bg-burgundy-600 text-white"
                                : isLocked || isDisabled
                                ? "bg-gray-200 text-gray-400"
                                : "bg-gray-200 text-gray-600"
                            }`}
                          >
                            {isLessonCompleted ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : isLocked || isDisabled ? (
                              <Lock className="w-4 h-4" />
                            ) : (
                              lesson.id
                            )}
                          </div>

                          {/* Title */}
                          <div className="flex-1 min-w-0">
                            <h4
                              className={`font-semibold ${
                                isLessonCompleted
                                  ? "text-emerald-700"
                                  : isLocked || isDisabled
                                  ? "text-gray-400"
                                  : "text-gray-900"
                              }`}
                            >
                              {lesson.title}
                            </h4>
                            {isNext && !isDisabled && (
                              <p className="text-xs text-burgundy-600 flex items-center gap-1 mt-0.5">
                                <Sparkles className="w-3 h-3" />
                                Up next for you
                              </p>
                            )}
                          </div>

                          {/* Action */}
                          <div className="flex-shrink-0">
                            {isLessonCompleted ? (
                              <Link href={`/womens-health-diploma/lesson/${lesson.id}`}>
                                <Button size="sm" variant="ghost" className="text-emerald-600 hover:bg-emerald-100">
                                  <Star className="w-4 h-4 mr-1" />
                                  Review
                                </Button>
                              </Link>
                            ) : isNext && !isDisabled ? (
                              <Link href={`/womens-health-diploma/lesson/${lesson.id}`}>
                                <Button size="sm" className="bg-burgundy-600 hover:bg-burgundy-700 text-white">
                                  <Play className="w-4 h-4 mr-1" />
                                  Start
                                </Button>
                              </Link>
                            ) : isLocked || isDisabled ? (
                              <span className="text-xs text-gray-400 flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                {isDisabled ? "Expired" : "Locked"}
                              </span>
                            ) : (
                              <Link href={`/womens-health-diploma/lesson/${lesson.id}`}>
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
            );
          })}
        </div>

        {/* Sarah Help Card */}
        <Card className="mt-8 border border-burgundy-200 shadow-lg bg-gradient-to-r from-burgundy-50 to-white">
          <CardContent className="p-5">
            <div className="flex items-center gap-4">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-burgundy-400 to-burgundy-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                  S
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">Questions? I'm here to help!</h3>
                <p className="text-gray-600 text-sm">
                  Send me a message anytime
                </p>
              </div>
              <Link href="/messages">
                <Button className="bg-burgundy-600 hover:bg-burgundy-700 text-white shadow-md">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Chat with Sarah
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Test Button - Only for test user */}
        {isTestUser && (
          <TestCompleteAllButton />
        )}
      </div>
    </div>
  );
}
