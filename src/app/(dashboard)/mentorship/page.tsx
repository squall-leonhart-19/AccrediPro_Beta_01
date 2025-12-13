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
  CheckCircle,
  Leaf,
  Target,
} from "lucide-react";
import { getUserCoach as getNicheCoach, NICHE_DEFINITIONS } from "@/lib/niche-coach";

async function getUserCoachData(userId: string) {
  // Get assigned coach (from niche matching)
  const nicheCoachData = await getNicheCoach(userId);

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

  // Get unique coaches from enrolled courses (excluding assigned coach)
  const courseCoaches = enrollments
    .map((e) => e.course.coach)
    .filter((coach): coach is NonNullable<typeof coach> =>
      coach !== null && coach.id !== nicheCoachData?.coach?.id
    );

  // Remove duplicates
  const uniqueCourseCoaches = courseCoaches.filter(
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

  return {
    assignedCoach: nicheCoachData?.coach || null,
    nicheDisplayName: nicheCoachData?.nicheDisplayName || null,
    matchReason: nicheCoachData?.matchReason || null,
    courseCoaches: uniqueCourseCoaches,
    sessions,
    enrollments
  };
}

export default async function MentorshipPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { assignedCoach, nicheDisplayName, matchReason, courseCoaches, sessions, enrollments } = await getUserCoachData(session.user.id);

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
            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3">My Personal Coach</h1>
            <p className="text-burgundy-100 text-lg">
              Your dedicated mentor matched to your specialty. Get personalized 1:1 guidance and support.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Primary Assigned Coach - Featured */}
      {assignedCoach ? (
        <Card className="card-premium overflow-hidden border-2 border-gold-200 bg-gradient-to-br from-white to-gold-50/30">
          <div className="h-32 bg-gradient-to-r from-burgundy-500 via-burgundy-600 to-burgundy-700 relative">
            <div className="absolute inset-0 opacity-30">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gold-400 rounded-full blur-3xl -translate-y-1/2" />
            </div>
            {/* Match Badge */}
            <div className="absolute top-4 right-4">
              <Badge className="bg-gold-400 text-burgundy-900 shadow-lg">
                <CheckCircle className="w-3 h-3 mr-1" />
                {nicheDisplayName || "Matched Coach"}
              </Badge>
            </div>
          </div>
          <CardContent className="p-8 -mt-16 relative">
            <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6">
              {/* Avatar */}
              <Avatar className="h-32 w-32 ring-4 ring-white shadow-2xl flex-shrink-0">
                <AvatarImage src={assignedCoach.avatar || undefined} />
                <AvatarFallback className="bg-gradient-to-br from-gold-400 to-gold-600 text-burgundy-900 text-3xl font-bold">
                  {assignedCoach.firstName?.charAt(0)}{assignedCoach.lastName?.charAt(0)}
                </AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex-1 text-center lg:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {assignedCoach.firstName} {assignedCoach.lastName}
                </h2>
                <p className="text-burgundy-600 font-medium mb-3">
                  Your {nicheDisplayName || "Personal"} Coach
                </p>

                {/* Match Reason */}
                {matchReason && (
                  <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-sm mb-4">
                    <Target className="w-4 h-4" />
                    {matchReason}
                  </div>
                )}

                {assignedCoach.bio && (
                  <p className="text-gray-600 mb-4 line-clamp-3">{assignedCoach.bio}</p>
                )}

                {/* Specialties */}
                {assignedCoach.specialties && assignedCoach.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4 justify-center lg:justify-start">
                    {assignedCoach.specialties.slice(0, 4).map((specialty, i) => (
                      <Badge key={i} variant="secondary" className="bg-burgundy-100 text-burgundy-700">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6 justify-center lg:justify-start">
                  {assignedCoach.avgResponseTime && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>Replies in ~{assignedCoach.avgResponseTime} min</span>
                    </div>
                  )}
                  {assignedCoach.availabilityNote && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>{assignedCoach.availabilityNote}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                  <Link href={`/messages?to=${assignedCoach.id}`}>
                    <Button size="lg" className="bg-burgundy-600 hover:bg-burgundy-700 shadow-lg">
                      <MessageSquare className="w-5 h-5 mr-2" />
                      Send Message
                    </Button>
                  </Link>
                  <Button size="lg" variant="outline" className="border-burgundy-200 text-burgundy-600 hover:bg-burgundy-50">
                    <Calendar className="w-5 h-5 mr-2" />
                    Schedule Call
                  </Button>
                  <Button size="lg" variant="outline" className="border-burgundy-200 text-burgundy-600 hover:bg-burgundy-50">
                    <Video className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Personal Quote */}
            {assignedCoach.personalQuote && (
              <div className="mt-6 pt-6 border-t border-gray-100">
                <p className="text-gray-600 italic text-center lg:text-left">
                  "{assignedCoach.personalQuote}"
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="card-premium border-2 border-dashed border-burgundy-200">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-burgundy-100 flex items-center justify-center mx-auto mb-6">
              <GraduationCap className="w-10 h-10 text-burgundy-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Your Personal Coach</h3>
            <p className="text-gray-500 max-w-md mx-auto mb-6">
              Start your free mini diploma to get matched with a coach who specializes in your area of interest.
            </p>
            <Link href="/career-center">
              <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                <Leaf className="w-4 h-4 mr-2" />
                Start Free Mini Diploma
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Course Coaches (if any) */}
      {courseCoaches.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-burgundy-600" />
            Course Instructors
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {courseCoaches.map((coach) => (
              <Card key={coach.id} className="card-premium">
                <CardContent className="p-5">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-14 w-14 ring-2 ring-burgundy-100">
                      <AvatarImage src={coach.avatar || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-burgundy-400 to-burgundy-600 text-white font-bold">
                        {coach.firstName?.charAt(0)}{coach.lastName?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900">
                        {coach.firstName} {coach.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">Course Instructor</p>
                    </div>
                    <Link href={`/messages?to=${coach.id}`}>
                      <Button size="sm" variant="outline" className="border-burgundy-200 text-burgundy-600">
                        <MessageSquare className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
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
