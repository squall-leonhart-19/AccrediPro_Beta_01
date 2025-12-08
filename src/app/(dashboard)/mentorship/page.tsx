import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Video,
  Calendar,
  Clock,
  Star,
  GraduationCap,
  ArrowRight,
  Sparkles,
  Heart,
  Users,
} from "lucide-react";

async function getUserCoach(userId: string) {
  // Get user's enrollments with course coach info
  const enrollments = await prisma.enrollment.findMany({
    where: { userId, status: "ACTIVE" },
    include: {
      course: {
        include: {
          coach: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
              bio: true,
              email: true,
              role: true,
            },
          },
        },
      },
    },
  });

  // Get unique coaches from enrolled courses
  const coaches = enrollments
    .map((e) => e.course.coach)
    .filter((coach): coach is NonNullable<typeof coach> => coach !== null);

  // Remove duplicates
  const uniqueCoaches = coaches.filter(
    (coach, index, self) => index === self.findIndex((c) => c.id === coach.id)
  );

  // Get mentor sessions
  const sessions = await prisma.mentorSession.findMany({
    where: { studentId: userId },
    include: {
      mentor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          avatar: true,
        },
      },
    },
    orderBy: { scheduledAt: "desc" },
    take: 5,
  });

  return { coaches: uniqueCoaches, sessions, enrollments };
}

export default async function MentorshipPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { coaches, sessions, enrollments } = await getUserCoach(session.user.id);

  const formatDate = (date: Date | null) => {
    if (!date) return "Not scheduled";
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
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
              <GraduationCap className="w-8 h-8 text-gold-400" />
            </div>
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">My Coach</h1>
            <p className="text-burgundy-100 text-lg">
              Your dedicated support for success. Connect with your personal coach for 1:1 guidance and accountability.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Coaches Grid */}
      {coaches.length > 0 ? (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Heart className="w-5 h-5 text-burgundy-600" />
            Your Assigned Coaches
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {coaches.map((coach) => (
              <Card key={coach.id} className="card-premium overflow-hidden">
                <div className="h-24 bg-gradient-to-r from-burgundy-500 to-burgundy-600 relative">
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400 rounded-full blur-2xl -translate-y-1/2" />
                  </div>
                </div>
                <CardContent className="p-6 -mt-12 relative">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 ring-4 ring-white shadow-xl mb-4">
                      <AvatarImage src={coach.avatar || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-gold-400 to-gold-600 text-burgundy-900 text-2xl font-bold">
                        {coach.firstName?.charAt(0)}{coach.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {coach.firstName} {coach.lastName}
                    </h3>
                    <Badge className="mt-2 bg-gold-100 text-gold-700 border-gold-200">
                      <Star className="w-3 h-3 mr-1 fill-gold-500" />
                      {coach.role}
                    </Badge>
                    {coach.bio && (
                      <p className="text-gray-600 mt-4 text-sm line-clamp-3">{coach.bio}</p>
                    )}
                    <div className="flex gap-3 mt-6 w-full">
                      <Link href={`/messages?to=${coach.id}`} className="flex-1">
                        <Button className="w-full bg-burgundy-600 hover:bg-burgundy-700">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Chat Now
                        </Button>
                      </Link>
                      <Button variant="outline" className="border-burgundy-200 text-burgundy-600 hover:bg-burgundy-50">
                        <Video className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card className="card-premium">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-burgundy-100 flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="w-10 h-10 text-burgundy-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Coach Assigned Yet</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Enroll in a course to get matched with your personal coach who will guide you through your learning journey.
            </p>
            <Link href="/courses">
              <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                Browse Courses
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card className="card-premium hover:border-burgundy-200 cursor-pointer transition-all">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-burgundy-100">
              <MessageSquare className="w-6 h-6 text-burgundy-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Send Message</h3>
              <p className="text-sm text-gray-500">Chat with your coach</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium hover:border-burgundy-200 cursor-pointer transition-all">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gold-100">
              <Calendar className="w-6 h-6 text-gold-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Schedule Call</h3>
              <p className="text-sm text-gray-500">Book a 1:1 session</p>
            </div>
          </CardContent>
        </Card>

        <Card className="card-premium hover:border-burgundy-200 cursor-pointer transition-all">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="p-3 rounded-xl bg-green-100">
              <Video className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Video Call</h3>
              <p className="text-sm text-gray-500">Start instant call</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sessions */}
      {sessions.length > 0 && (
        <Card className="card-premium">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-burgundy-600" />
              Recent Sessions
            </h3>
            <div className="space-y-3">
              {sessions.map((mentorSession) => (
                <div key={mentorSession.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                  <Avatar>
                    <AvatarImage src={mentorSession.mentor.avatar || undefined} />
                    <AvatarFallback className="bg-burgundy-100 text-burgundy-700">
                      {mentorSession.mentor.firstName?.charAt(0)}{mentorSession.mentor.lastName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      Session with {mentorSession.mentor.firstName} {mentorSession.mentor.lastName}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(mentorSession.scheduledAt)}
                    </p>
                  </div>
                  <Badge variant={
                    mentorSession.status === "COMPLETED" ? "success" :
                    mentorSession.status === "CONFIRMED" ? "default" :
                    "secondary"
                  }>
                    {mentorSession.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Courses with Coaches */}
      {enrollments.length > 0 && (
        <Card className="card-premium">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-burgundy-600" />
              Your Enrolled Courses
            </h3>
            <div className="space-y-3">
              {enrollments.map((enrollment) => (
                <div key={enrollment.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-burgundy-100 flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-burgundy-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{enrollment.course.title}</h4>
                    {enrollment.course.coach ? (
                      <p className="text-sm text-gray-500">
                        Coach: {enrollment.course.coach.firstName} {enrollment.course.coach.lastName}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-400">No coach assigned</p>
                    )}
                  </div>
                  {enrollment.course.coach && (
                    <Link href={`/messages?to=${enrollment.course.coach.id}`}>
                      <Button size="sm" variant="outline" className="border-burgundy-200 text-burgundy-600">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Chat
                      </Button>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
