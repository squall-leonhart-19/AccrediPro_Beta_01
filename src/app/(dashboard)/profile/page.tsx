import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ProfileTabs } from "./profile-tabs";

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

  const [user, allBadges] = await Promise.all([
    getUserProfile(session.user.id),
    getAllBadges(),
  ]);

  if (!user) {
    redirect("/login");
  }

  return <ProfileTabs user={user as any} allBadges={allBadges} />;
}
