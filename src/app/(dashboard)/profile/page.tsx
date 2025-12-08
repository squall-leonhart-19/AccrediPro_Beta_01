import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Mail,
  Calendar,
  Award,
  BookOpen,
  Clock,
  TrendingUp,
  Settings,
  Bell,
  Shield,
  Camera,
  Pencil,
} from "lucide-react";

async function getUserProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      enrollments: {
        include: {
          course: {
            select: {
              id: true,
              title: true,
              thumbnail: true,
              certificateType: true,
            },
          },
        },
      },
      certificates: {
        include: {
          course: {
            select: {
              title: true,
              certificateType: true,
            },
          },
        },
      },
      _count: {
        select: {
          communityPosts: true,
          postComments: true,
        },
      },
    },
  });
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await getUserProfile(session.user.id);
  if (!user) {
    redirect("/login");
  }

  const initials = `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase() || "U";
  const totalCourses = user.enrollments.length;
  const completedCourses = user.enrollments.filter(e => e.status === "COMPLETED").length;
  const inProgressCourses = user.enrollments.filter(e => e.status === "ACTIVE").length;
  const avgProgress = totalCourses > 0
    ? user.enrollments.reduce((acc, e) => acc + e.progress, 0) / totalCourses
    : 0;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header */}
      <Card className="bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 border-0 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold-500 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        </div>
        <CardContent className="p-8 lg:p-10 relative">
          <div className="flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative group mb-4">
              <Avatar className="h-28 w-28 ring-4 ring-white/20 shadow-xl">
                <AvatarImage src={user.avatar || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-gold-400 to-gold-600 text-burgundy-900 text-3xl font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <div className="text-center">
                  <Camera className="w-6 h-6 text-white mx-auto mb-1" />
                  <span className="text-xs text-white font-medium">Change</span>
                </div>
              </button>
            </div>

            {/* Name and Role */}
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
              {user.firstName} {user.lastName}
            </h1>
            <Badge className="bg-gold-400/20 text-gold-200 border-0 mb-3">
              {user.role}
            </Badge>
            <p className="text-burgundy-100">{user.email}</p>

            {user.bio ? (
              <p className="text-burgundy-100/80 mt-3 max-w-xl">{user.bio}</p>
            ) : (
              <button className="mt-3 text-sm text-gold-300 hover:text-gold-200 flex items-center gap-1">
                <Pencil className="w-3 h-3" />
                Add a bio
              </button>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4 mt-6 text-burgundy-100">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Calendar className="w-4 h-4 text-gold-400" />
                <span className="text-sm font-medium">Member since {formatDate(user.createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Shield className="w-4 h-4 text-gold-400" />
                <span className="text-sm font-medium">{user.emailVerified ? "Verified" : "Not Verified"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="card-premium">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-burgundy-100">
                <BookOpen className="w-5 h-5 text-burgundy-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalCourses}</p>
                <p className="text-sm text-gray-500">Enrolled Courses</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-green-100">
                <Award className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{completedCourses}</p>
                <p className="text-sm text-gray-500">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gold-100">
                <TrendingUp className="w-5 h-5 text-gold-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{Math.round(avgProgress)}%</p>
                <p className="text-sm text-gray-500">Avg Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium">
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-100">
                <Award className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{user.certificates.length}</p>
                <p className="text-sm text-gray-500">Certificates</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Account Details */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="card-premium">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-burgundy-600" />
                Activity Summary
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Community Posts</span>
                  <span className="font-medium text-gray-900">{user._count.communityPosts}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Comments</span>
                  <span className="font-medium text-gray-900">{user._count.postComments}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">In Progress</span>
                  <span className="font-medium text-gray-900">{inProgressCourses} courses</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Certificates Earned</span>
                  <span className="font-medium text-gold-600">{user.certificates.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-premium">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-burgundy-600" />
                Quick Settings
              </h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
                  <Bell className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-700">Notification Preferences</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left">
                  <Shield className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-700">Privacy Settings</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Active Courses */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="card-premium">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-burgundy-600" />
                My Courses
              </h3>
              {user.enrollments.length > 0 ? (
                <div className="space-y-4">
                  {user.enrollments.slice(0, 5).map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="w-16 h-16 rounded-lg bg-burgundy-100 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="w-6 h-6 text-burgundy-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900 truncate">
                          {enrollment.course.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Progress value={enrollment.progress} className="h-2 flex-1" />
                          <span className="text-sm text-gray-500 whitespace-nowrap">
                            {Math.round(enrollment.progress)}%
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant={enrollment.status === "COMPLETED" ? "success" : "secondary"} className="text-xs">
                            {enrollment.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {enrollment.course.certificateType.replace("_", " ")}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No courses enrolled yet</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Certificates */}
          {user.certificates.length > 0 && (
            <Card className="card-premium">
              <CardContent className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="w-5 h-5 text-gold-500" />
                  My Certificates
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  {user.certificates.map((cert) => (
                    <div key={cert.id} className="p-4 rounded-xl border-2 border-gold-200 bg-gradient-to-br from-gold-50 to-white">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-gold-100">
                          <Award className="w-5 h-5 text-gold-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{cert.course.title}</h4>
                          <p className="text-sm text-gray-500">{cert.course.certificateType.replace("_", " ")}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Issued {formatDate(cert.issuedAt)}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
