import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
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
} from "lucide-react";

async function getEnrolledCourses(userId: string) {
  return prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          category: true,
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

export default async function MyCoursesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const enrollments = await getEnrolledCourses(session.user.id);

  const inProgressCourses = enrollments.filter((e) => e.status === "ACTIVE");
  const completedCourses = enrollments.filter((e) => e.status === "COMPLETED");

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "Self-paced";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins} min`;
  };

  const getCertificateLabel = (type: string) => {
    switch (type) {
      case "CERTIFICATION":
        return "Certification";
      case "MINI_DIPLOMA":
        return "Mini Diploma";
      default:
        return "Certificate";
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Hero Header */}
      <Card className="bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 border-0 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>
        <CardContent className="p-8 lg:p-10 relative">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm mb-4">
              <BookOpen className="w-8 h-8 text-gold-400" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">My Courses</h1>
            <p className="text-burgundy-100 text-lg mb-6">
              Track your progress and continue your learning journey
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-burgundy-100">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Play className="w-4 h-4 text-gold-400" />
                <span className="text-sm font-medium">{inProgressCourses.length} In Progress</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <CheckCircle className="w-4 h-4 text-gold-400" />
                <span className="text-sm font-medium">{completedCourses.length} Completed</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {enrollments.length === 0 ? (
        <Card className="card-premium">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-burgundy-100 flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="w-10 h-10 text-burgundy-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Courses Yet</h3>
            <p className="text-gray-500 mb-6 max-w-md mx-auto">
              You haven&apos;t enrolled in any courses yet. Explore our catalog to find the perfect course for you.
            </p>
            <Link href="/courses">
              <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                Browse Course Catalog
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* In Progress Courses */}
          {inProgressCourses.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Play className="w-5 h-5 text-burgundy-600" />
                <h2 className="text-lg font-semibold text-gray-900">In Progress</h2>
                <Badge variant="secondary" className="ml-2">
                  {inProgressCourses.length}
                </Badge>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {inProgressCourses.map((enrollment) => {
                  const totalLessons = enrollment.course.modules.reduce(
                    (acc, m) => acc + m.lessons.length,
                    0
                  );

                  return (
                    <Link key={enrollment.id} href={`/courses/${enrollment.course.slug}`}>
                      <Card className="h-full overflow-hidden border border-gray-200 hover:border-burgundy-300 hover:shadow-lg transition-all duration-200 group">
                        <div className="h-32 bg-gradient-to-br from-burgundy-500 via-burgundy-600 to-burgundy-700 relative overflow-hidden">
                          <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                          </div>
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-gold-100 text-gold-700 shadow-sm">
                              {getCertificateLabel(enrollment.course.certificateType)}
                            </Badge>
                          </div>
                          <div className="absolute bottom-3 left-3 right-3">
                            <div className="bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2">
                              <div className="flex items-center justify-between text-white text-sm mb-1">
                                <span>Progress</span>
                                <span className="font-bold">{Math.round(enrollment.progress)}%</span>
                              </div>
                              <Progress value={enrollment.progress} className="h-2 bg-white/20" />
                            </div>
                          </div>
                        </div>

                        <CardContent className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-burgundy-700 transition-colors min-h-[48px]">
                            {enrollment.course.title}
                          </h3>

                          {enrollment.course.category && (
                            <Badge variant="outline" className="mb-2 text-xs">
                              {enrollment.course.category.name}
                            </Badge>
                          )}

                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5" />
                              {totalLessons} lessons
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formatDuration(enrollment.course.duration)}
                            </span>
                          </div>

                          <Button className="w-full bg-burgundy-600 hover:bg-burgundy-700" size="sm">
                            <Play className="w-4 h-4 mr-2" />
                            Continue Learning
                          </Button>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completed Courses */}
          {completedCourses.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-gold-600" />
                <h2 className="text-lg font-semibold text-gray-900">Completed</h2>
                <Badge variant="secondary" className="ml-2">
                  {completedCourses.length}
                </Badge>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                {completedCourses.map((enrollment) => {
                  const totalLessons = enrollment.course.modules.reduce(
                    (acc, m) => acc + m.lessons.length,
                    0
                  );

                  return (
                    <Link key={enrollment.id} href={`/courses/${enrollment.course.slug}`}>
                      <Card className="h-full overflow-hidden border-2 border-green-200 bg-gradient-to-br from-white to-green-50 hover:shadow-lg transition-all duration-200 group">
                        <div className="h-32 bg-gradient-to-br from-green-500 via-green-600 to-green-700 relative overflow-hidden">
                          <div className="absolute inset-0 opacity-20">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
                          </div>
                          <div className="absolute top-3 left-3">
                            <Badge className="bg-white text-green-700 shadow-sm">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          </div>
                          <div className="absolute top-3 right-3">
                            <Badge className="bg-gold-100 text-gold-700 shadow-sm">
                              {getCertificateLabel(enrollment.course.certificateType)}
                            </Badge>
                          </div>
                          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center">
                            <div className="bg-white/90 backdrop-blur-sm rounded-full p-3">
                              <Award className="w-8 h-8 text-gold-600" />
                            </div>
                          </div>
                        </div>

                        <CardContent className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-green-700 transition-colors min-h-[48px]">
                            {enrollment.course.title}
                          </h3>

                          {enrollment.course.category && (
                            <Badge variant="outline" className="mb-2 text-xs border-green-200 text-green-700">
                              {enrollment.course.category.name}
                            </Badge>
                          )}

                          <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3.5 h-3.5" />
                              {totalLessons} lessons
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              {formatDuration(enrollment.course.duration)}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1 border-green-200 text-green-700 hover:bg-green-50" size="sm">
                              <BookOpen className="w-4 h-4 mr-2" />
                              Review
                            </Button>
                            <Link href="/certificates" className="flex-1">
                              <Button className="w-full bg-gold-500 hover:bg-gold-600 text-white" size="sm">
                                <Award className="w-4 h-4 mr-2" />
                                Certificate
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Browse More Courses CTA */}
          <Card className="card-premium bg-gradient-to-r from-burgundy-50 to-gold-50 border-burgundy-100">
            <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-burgundy-100">
                  <GraduationCap className="w-6 h-6 text-burgundy-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Ready for more?</h3>
                  <p className="text-sm text-gray-500">Explore our catalog for new certifications</p>
                </div>
              </div>
              <Link href="/courses">
                <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                  Browse Catalog
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
