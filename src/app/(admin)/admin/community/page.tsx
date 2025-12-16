import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import CommunityAdminClient from "./community-admin-client";

async function getCommunityData() {
  // Get all zombie/fake profiles for post creation
  const fakeProfiles = await prisma.user.findMany({
    where: { isFakeProfile: true },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      avatar: true,
      email: true,
    },
    orderBy: { firstName: "asc" },
    take: 100,
  });

  // Get Sarah (coach) profile
  const sarahProfile = await prisma.user.findFirst({
    where: { email: "sarah@accredipro-certificate.com" },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      avatar: true,
    },
  });

  // Get ALL posts for the "add to existing" feature
  const recentPosts = await prisma.communityPost.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      categoryId: true,
      createdAt: true,
      likeCount: true,
      reactions: true, // Get stored reactions JSON
      author: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      _count: {
        select: { comments: true, likes: true },
      },
    },
  });

  // Get community stats
  const stats = await prisma.$transaction([
    prisma.communityPost.count(),
    prisma.postComment.count(),
    prisma.user.count({ where: { isFakeProfile: true } }),
    prisma.communityPost.count({ where: { categoryId: "wins" } }),
    prisma.communityPost.count({ where: { categoryId: "graduates" } }),
    prisma.communityPost.count({ where: { categoryId: "coaching-tips" } }),
    prisma.communityPost.count({ where: { categoryId: "questions-everyone-has" } }),
    prisma.communityPost.count({ where: { categoryId: "career-pathway" } }),
    prisma.postLike.count(),
  ]);

  // Transform recentPosts to ensure reactions type is correct
  const transformedPosts = recentPosts.map(post => ({
    ...post,
    reactions: post.reactions as Record<string, number> | null,
  }));

  return {
    fakeProfiles,
    sarahProfile,
    recentPosts: transformedPosts,
    stats: {
      totalPosts: stats[0],
      totalComments: stats[1],
      totalFakeProfiles: stats[2],
      winsPosts: stats[3],
      graduatesPosts: stats[4],
      coachingTipsPosts: stats[5],
      questionsPosts: stats[6],
      careerPosts: stats[7],
      totalLikes: stats[8],
    },
  };
}

export default async function AdminCommunityPage() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const data = await getCommunityData();

  return <CommunityAdminClient {...data} />;
}
