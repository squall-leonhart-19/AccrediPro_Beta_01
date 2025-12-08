import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Map,
  CheckCircle,
  Lock,
  ChevronRight,
  GraduationCap,
  Star,
  Target,
  ArrowRight,
  Sparkles,
  Award,
  BookOpen,
} from "lucide-react";

async function getRoadmapData(userId: string) {
  const [enrollments, allCourses, certificates] = await Promise.all([
    prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            category: true,
            modules: {
              include: {
                lessons: { select: { id: true } },
              },
            },
          },
        },
      },
      orderBy: { enrolledAt: "asc" },
    }),
    prisma.course.findMany({
      where: { isPublished: true },
      include: {
        category: true,
        modules: {
          include: {
            lessons: { select: { id: true } },
          },
        },
      },
    }),
    prisma.certificate.findMany({
      where: { userId },
      include: { course: true },
    }),
  ]);

  return { enrollments, allCourses, certificates };
}

export default async function RoadmapPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const { enrollments, allCourses, certificates } = await getRoadmapData(session.user.id);

  const enrolledCourseIds = new Set(enrollments.map((e) => e.courseId));
  const completedCourseIds = new Set(
    enrollments.filter((e) => e.status === "COMPLETED").map((e) => e.courseId)
  );

  // Build learning pathway
  const inProgressCourses = enrollments.filter((e) => e.status === "ACTIVE");
  const completedCourses = enrollments.filter((e) => e.status === "COMPLETED");
  const recommendedCourses = allCourses.filter((c) => !enrolledCourseIds.has(c.id)).slice(0, 3);

  // Calculate overall progress
  const totalLessons = enrollments.reduce(
    (acc, e) => acc + e.course.modules.reduce((m, mod) => m + mod.lessons.length, 0),
    0
  );
  const overallProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((acc, e) => acc + e.progress, 0) / enrollments.length)
    : 0;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header */}
      <Card className="bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 border-0 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        </div>
        <CardContent className="p-8 relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 text-gold-300 text-sm font-medium mb-3 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full">
                <Map className="w-4 h-4" />
                Your Learning Roadmap
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Your Personalized Learning Pathway
              </h1>
              <p className="text-burgundy-100 max-w-xl">
                A personalized learning pathway created just for you. See recommended courses, next steps,
                eligibility based on your progress, and your long-term certification journey.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <p className="text-gold-300 text-sm font-medium mb-2">Overall Progress</p>
              <div className="text-4xl font-bold text-white mb-2">{overallProgress}%</div>
              <Progress value={overallProgress} className="h-2 bg-white/20" />
              <p className="text-burgundy-200 text-xs mt-2">
                {completedCourses.length} of {enrollments.length} courses completed
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Focus - In Progress */}
      {inProgressCourses.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-burgundy-100 flex items-center justify-center">
              <Target className="w-5 h-5 text-burgundy-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Current Focus</h2>
              <p className="text-sm text-gray-500">Continue where you left off</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {inProgressCourses.map((enrollment) => {
              const totalLessons = enrollment.course.modules.reduce(
                (acc, m) => acc + m.lessons.length,
                0
              );
              return (
                <Card key={enrollment.id} className="card-premium border-burgundy-200 bg-burgundy-50/50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-burgundy-500 to-burgundy-700 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <Badge className="mb-2 bg-gold-100 text-gold-700 border-0">
                          In Progress
                        </Badge>
                        <h3 className="font-semibold text-gray-900 mb-1">{enrollment.course.title}</h3>
                        <p className="text-sm text-gray-500 mb-3">
                          {enrollment.course.modules.length} modules • {totalLessons} lessons
                        </p>
                        <div className="flex items-center gap-3 mb-4">
                          <Progress value={enrollment.progress} className="flex-1 h-2" />
                          <span className="text-sm font-semibold text-burgundy-600">
                            {Math.round(enrollment.progress)}%
                          </span>
                        </div>
                        <Link href={`/courses/${enrollment.course.slug}`}>
                          <Button className="w-full bg-burgundy-600 hover:bg-burgundy-700">
                            Continue Learning
                            <ChevronRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed Milestone */}
      {completedCourses.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Completed Milestones</h2>
              <p className="text-sm text-gray-500">Courses you&apos;ve mastered</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {completedCourses.map((enrollment) => (
              <Card key={enrollment.id} className="card-premium border-green-200 bg-green-50/50">
                <CardContent className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-0">Completed</Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{enrollment.course.title}</h3>
                  <p className="text-xs text-gray-500 mb-3">
                    Completed on {enrollment.completedAt?.toLocaleDateString()}
                  </p>
                  <Link href="/certificates">
                    <Button variant="outline" size="sm" className="w-full border-green-300 text-green-700">
                      <Award className="w-4 h-4 mr-2" />
                      View Certificate
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Recommended Next Steps */}
      {recommendedCourses.length > 0 && (
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gold-100 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-gold-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Recommended Next Steps</h2>
              <p className="text-sm text-gray-500">Based on your progress and interests</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {recommendedCourses.map((course) => {
              const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
              return (
                <Card key={course.id} className="card-premium hover:border-gold-200 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-gray-600" />
                      </div>
                      <Badge variant="outline" className="border-gold-300 text-gold-700">
                        Recommended
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{course.title}</h3>
                    <p className="text-xs text-gray-500 mb-3">
                      {course.modules.length} modules • {totalLessons} lessons
                    </p>
                    <Link href={`/courses/${course.slug}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        View Course
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Journey Overview */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-gold-600" />
            Your Certification Journey
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-6">
              {enrollments.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-4">Your journey begins here!</p>
                  <Link href="/courses">
                    <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                      Browse Courses
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              ) : (
                allCourses.slice(0, 6).map((course, index) => {
                  const isCompleted = completedCourseIds.has(course.id);
                  const isInProgress = enrolledCourseIds.has(course.id) && !isCompleted;
                  const isLocked = !enrolledCourseIds.has(course.id);

                  return (
                    <div key={course.id} className="relative flex items-start gap-4 pl-12">
                      <div
                        className={`absolute left-4 w-5 h-5 rounded-full border-2 ${
                          isCompleted
                            ? "bg-green-500 border-green-500"
                            : isInProgress
                            ? "bg-burgundy-500 border-burgundy-500"
                            : "bg-white border-gray-300"
                        }`}
                      >
                        {isCompleted && <CheckCircle className="w-4 h-4 text-white -m-0.5" />}
                      </div>
                      <div className="flex-1 pb-6">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className={`font-medium ${isLocked ? "text-gray-400" : "text-gray-900"}`}>
                            {course.title}
                          </h4>
                          {isCompleted && (
                            <Badge className="bg-green-100 text-green-700 text-xs">Completed</Badge>
                          )}
                          {isInProgress && (
                            <Badge className="bg-burgundy-100 text-burgundy-700 text-xs">In Progress</Badge>
                          )}
                          {isLocked && (
                            <Badge variant="outline" className="text-gray-400 text-xs">
                              <Lock className="w-3 h-3 mr-1" />
                              Not Started
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">
                          {course.certificateType.replace("_", " ")} •{" "}
                          {course.modules.length} modules
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
