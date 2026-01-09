import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProfileTabs } from "./profile-tabs";

async function getUserProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      avatar: true,
      bio: true,
      role: true,
      emailVerified: true,
      createdAt: true,
      hasCompletedOnboarding: true,
      learningGoal: true,
      focusAreas: true,
      location: true,

      // Relations
      tags: true,
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
      badges: {
        include: {
          badge: true,
        },
        orderBy: {
          earnedAt: "desc",
        },
      },
      streak: true,
      _count: {
        select: {
          communityPosts: true,
          postComments: true,
        },
      },
    },
  });
}

async function getUserGoals(userId: string) {
  const userTags = await prisma.userTag.findMany({
    where: { userId },
    select: { tag: true, value: true },
  });

  // Extract goals from tags
  const incomeGoalTag = userTags.find(t => t.tag.startsWith('income_goal:'));
  const timelineTag = userTags.find(t => t.tag.startsWith('timeline:'));
  const situationTag = userTags.find(t => t.tag.startsWith('situation:'));
  const investmentTag = userTags.find(t => t.tag.startsWith('investment:'));
  const obstaclesTags = userTags.filter(t => t.tag.startsWith('obstacle:'));
  const interestsTags = userTags.filter(t => t.tag.startsWith('interest:'));

  return {
    incomeGoal: incomeGoalTag?.tag.replace('income_goal:', '') || null,
    timeline: timelineTag?.tag.replace('timeline:', '') || null,
    situation: situationTag?.tag.replace('situation:', '') || null,
    investmentReadiness: investmentTag?.tag.replace('investment:', '') || null,
    obstacles: obstaclesTags.map(t => t.tag.replace('obstacle:', '')),
    interests: interestsTags.map(t => t.tag.replace('interest:', '')),
  };
}

async function getAllBadges() {
  return prisma.badge.findMany({
    orderBy: { points: "desc" },
  });
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const [user, allBadges, goals] = await Promise.all([
    getUserProfile(session.user.id),
    getAllBadges(),
    getUserGoals(session.user.id),
  ]);

  if (!user) {
    redirect("/login");
  }

  return <ProfileTabs user={user as any} allBadges={allBadges} goals={goals} />;
}
