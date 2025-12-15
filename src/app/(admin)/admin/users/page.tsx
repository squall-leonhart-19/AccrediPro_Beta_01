import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { UsersClient } from "@/components/admin/users-client";

async function getUsers() {
  return prisma.user.findMany({
    where: {
      isFakeProfile: false,
      email: { not: null }
    },
    orderBy: { createdAt: "desc" },
    include: {
      tags: {
        select: {
          id: true,
          tag: true,
          value: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
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

  // @ts-ignore - Prisma types are strict about nulls but we filtered them
  return <UsersClient users={users as any} courses={courses} />;
}
