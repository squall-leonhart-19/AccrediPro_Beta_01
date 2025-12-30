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
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      avatar: true,
      phone: true,
      role: true,
      isActive: true,
      createdAt: true,
      lastLoginAt: true,
      leadSource: true,
      leadSourceDetail: true,
      // knowledgeBase: true, // EXCLUDED explicitly to prevent 10s load times
      hasCompletedOnboarding: true,
      learningGoal: true,
      experienceLevel: true,
      focusAreas: true,
      bio: true,
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
      marketingTags: {
        select: {
          id: true,
          tag: {
            select: {
              slug: true,
              name: true,
            }
          }
        }
      }
    },
  }).then(users => users.map(user => ({
    ...user,
    // Merge legacy tags with marketing tags for UI display
    tags: [
      ...user.tags,
      ...user.marketingTags.map(mt => ({
        id: mt.id,
        tag: mt.tag.slug, // Use slug as the tag string
        value: null,
        createdAt: new Date() // Placeholder
      }))
    ]
  })));
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
