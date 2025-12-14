import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { UsersClient } from "@/components/admin/users-client";

async function getUsers() {
  return prisma.user.findMany({
    where: { isFakeProfile: false }, // Exclude social proof profiles
    orderBy: { createdAt: "desc" },
    include: {
      enrollments: {
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
            },
          },
        },
      },
      tags: {
        select: {
          id: true,
          tag: true,
          value: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
      streak: true,
      _count: {
        select: {
          certificates: true,
          progress: true,
          receivedMessages: true,
          sentMessages: true,
        },
      },
    },
  });
}

async function getCourses() {
  return prisma.course.findMany({
    where: { isPublished: true },
    select: {
      id: true,
      title: true,
      slug: true,
    },
    orderBy: { title: "asc" },
  });
}

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const [users, courses] = await Promise.all([getUsers(), getCourses()]);

  return <UsersClient users={users} courses={courses} />;
}
