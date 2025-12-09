import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Flame,
  Star,
  Award,
  Target,
  Zap,
  BookOpen,
  CheckCircle,
  Lock,
  Medal,
  Crown,
  Sparkles,
} from "lucide-react";

async function getAchievementsData(userId: string) {
  const [userStreak, userBadges, allBadges, completedLessons, completedCourses, enrollments] =
    await Promise.all([
      prisma.userStreak.findUnique({ where: { userId } }),
      prisma.userBadge.findMany({
        where: { userId },
        include: { badge: true },
        orderBy: { earnedAt: "desc" },
      }),
      prisma.badge.findMany({ orderBy: { points: "asc" } }),
      prisma.lessonProgress.count({ where: { userId, isCompleted: true } }),
      prisma.enrollment.count({ where: { userId, status: "COMPLETED" } }),
      prisma.enrollment.count({ where: { userId } }),
    ]);

  return {
    userStreak,
    userBadges,
    allBadges,
    completedLessons,
    completedCourses,
    enrollments,
  };
}

// Milestone definitions
const milestones = [
  { id: "first_lesson", title: "First Step", description: "Complete your first lesson", target: 1, type: "lessons", icon: BookOpen },
  { id: "five_lessons", title: "Getting Started", description: "Complete 5 lessons", target: 5, type: "lessons", icon: Target },
  { id: "twenty_lessons", title: "Dedicated Learner", description: "Complete 20 lessons", target: 20, type: "lessons", icon: Star },
  { id: "fifty_lessons", title: "Knowledge Seeker", description: "Complete 50 lessons", target: 50, type: "lessons", icon: Zap },
  { id: "hundred_lessons", title: "Master Student", description: "Complete 100 lessons", target: 100, type: "lessons", icon: Crown },
  { id: "first_course", title: "Course Graduate", description: "Complete your first course", target: 1, type: "courses", icon: Award },
  { id: "three_courses", title: "Multi-Certified", description: "Complete 3 courses", target: 3, type: "courses", icon: Medal },
  { id: "week_streak", title: "Week Warrior", description: "Maintain a 7-day streak", target: 7, type: "streak", icon: Flame },
  { id: "month_streak", title: "Monthly Master", description: "Maintain a 30-day streak", target: 30, type: "streak", icon: Trophy },
];

export default async function AchievementsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const { userStreak, userBadges, allBadges, completedLessons, completedCourses } =
    await getAchievementsData(session.user.id);

  const earnedBadgeIds = new Set(userBadges.map((ub: { badgeId: string }) => ub.badgeId));
  const totalPoints = userStreak?.totalPoints || 0;

  const getMilestoneProgress = (milestone: typeof milestones[0]) => {
    let current = 0;
    switch (milestone.type) {
      case "lessons":
        current = completedLessons;
        break;
      case "courses":
        current = completedCourses;
        break;
      case "streak":
        current = userStreak?.longestStreak || 0;
        break;
    }
    return { current, percentage: Math.min(100, (current / milestone.target) * 100), isComplete: current >= milestone.target };
  };

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
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <Trophy className="w-7 h-7 text-gold-400" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white">Achievements</h1>
                  <p className="text-burgundy-200">Celebrate your progress</p>
                </div>
              </div>
              <p className="text-burgundy-100 max-w-xl">
                View all the badges, milestones, streaks, and rewards you&apos;ve earned along your
                journey. Celebrate your progress and track how far you&apos;ve come.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <Zap className="w-6 h-6 text-gold-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{totalPoints}</p>
                <p className="text-xs text-burgundy-200">Total Points</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <Flame className="w-6 h-6 text-orange-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{userStreak?.currentStreak || 0}</p>
                <p className="text-xs text-burgundy-200">Day Streak</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
                <Medal className="w-6 h-6 text-gold-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white">{userBadges.length}</p>
                <p className="text-xs text-burgundy-200">Badges</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-burgundy-600" />
            Milestones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {milestones.map((milestone) => {
              const { current, percentage, isComplete } = getMilestoneProgress(milestone);
              const Icon = milestone.icon;

              return (
                <div
                  key={milestone.id}
                  className={`p-4 rounded-xl border ${
                    isComplete
                      ? "bg-green-50 border-green-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        isComplete ? "bg-green-100" : "bg-gray-100"
                      }`}
                    >
                      {isComplete ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Icon className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <p className={`font-medium ${isComplete ? "text-green-700" : "text-gray-700"}`}>
                        {milestone.title}
                      </p>
                      <p className="text-xs text-gray-500">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Progress
                      value={percentage}
                      className={`flex-1 h-2 ${isComplete ? "bg-green-200" : "bg-gray-200"}`}
                    />
                    <span className="text-xs font-medium text-gray-500">
                      {current}/{milestone.target}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Earned Badges */}
      {userBadges.length > 0 && (
        <Card className="card-premium">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-600" />
              Earned Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {userBadges.map((userBadge: { id: string; earnedAt: Date; badge: { icon: string; name: string; description: string; points: number } }) => (
                <div
                  key={userBadge.id}
                  className="bg-gold-50 border border-gold-200 rounded-xl p-4 text-center"
                >
                  <span className="text-4xl block mb-2">{userBadge.badge.icon}</span>
                  <h4 className="font-semibold text-gray-900 text-sm">{userBadge.badge.name}</h4>
                  <p className="text-xs text-gray-500 mt-1">{userBadge.badge.description}</p>
                  <Badge className="mt-2 bg-gold-100 text-gold-700 text-xs">
                    +{userBadge.badge.points} pts
                  </Badge>
                  <p className="text-xs text-gray-400 mt-2">
                    {userBadge.earnedAt.toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Available Badges */}
      <Card className="card-premium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-burgundy-600" />
            All Badges
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {allBadges.map((badge: { id: string; icon: string; name: string; description: string }) => {
              const isEarned = earnedBadgeIds.has(badge.id);

              return (
                <div
                  key={badge.id}
                  className={`rounded-xl p-4 text-center border ${
                    isEarned
                      ? "bg-gold-50 border-gold-200"
                      : "bg-gray-50 border-gray-200 opacity-60"
                  }`}
                >
                  <div className="relative">
                    <span className={`text-3xl block mb-2 ${!isEarned && "grayscale"}`}>
                      {badge.icon}
                    </span>
                    {!isEarned && (
                      <Lock className="w-4 h-4 text-gray-400 absolute top-0 right-0" />
                    )}
                  </div>
                  <h4 className="font-medium text-gray-900 text-xs">{badge.name}</h4>
                  <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                    {badge.description}
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Streak Info */}
      <Card className="card-premium bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-orange-200 flex items-center justify-center">
              <Flame className="w-8 h-8 text-orange-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-lg">Streak Stats</h3>
              <div className="flex gap-6 mt-2">
                <div>
                  <p className="text-2xl font-bold text-orange-600">
                    {userStreak?.currentStreak || 0}
                  </p>
                  <p className="text-xs text-gray-500">Current Streak</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">
                    {userStreak?.longestStreak || 0}
                  </p>
                  <p className="text-xs text-gray-500">Longest Streak</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Keep learning daily to build your streak!</p>
              <p className="text-xs text-gray-500 mt-1">
                Last active:{" "}
                {userStreak?.lastActiveAt
                  ? userStreak.lastActiveAt.toLocaleDateString()
                  : "Never"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
