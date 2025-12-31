import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { MessagesClient } from "@/components/messages/messages-client";
// Force dynamic rendering - no caching
export const dynamic = "force-dynamic";


interface MessagesPageProps {
  searchParams: Promise<{ chat?: string }>;
}

// Optimized: Use raw SQL to get ONLY the last message per conversation
// Instead of fetching ALL messages and filtering in JS
async function getConversations(userId: string, isAdmin: boolean) {
  // Single optimized query: Get last message + unread count for each conversation
  // Uses window function to get only the most recent message per conversation partner
  const conversationData = await prisma.$queryRaw<Array<{
    odpartnerId: string;
    odpartnerFirstName: string | null;
    odpartnerLastName: string | null;
    partnerEmail: string;
    partnerAvatar: string | null;
    partnerRole: string;
    lastMessageId: string;
    lastMessageContent: string;
    lastMessageSenderId: string;
    lastMessageCreatedAt: Date;
    lastMessageIsRead: boolean;
    unreadCount: number;
  }>>`
    WITH conversation_partners AS (
      -- Get all unique conversation partners
      SELECT DISTINCT
        CASE WHEN "senderId" = ${userId} THEN "receiverId" ELSE "senderId" END as partner_id
      FROM "Message"
      WHERE "senderId" = ${userId} OR "receiverId" = ${userId}
    ),
    last_messages AS (
      -- Get last message for each conversation using row_number
      SELECT DISTINCT ON (partner_id)
        cp.partner_id,
        m.id as message_id,
        m.content,
        m."senderId",
        m."createdAt",
        m."isRead"
      FROM conversation_partners cp
      JOIN "Message" m ON (
        (m."senderId" = ${userId} AND m."receiverId" = cp.partner_id) OR
        (m."senderId" = cp.partner_id AND m."receiverId" = ${userId})
      )
      ORDER BY cp.partner_id, m."createdAt" DESC
    ),
    unread_counts AS (
      -- Count unread messages from each partner
      SELECT "senderId" as partner_id, COUNT(*)::integer as unread_count
      FROM "Message"
      WHERE "receiverId" = ${userId} AND "isRead" = false
      GROUP BY "senderId"
    )
    SELECT
      u.id as "odpartnerId",
      u."firstName" as "odpartnerFirstName",
      u."lastName" as "odpartnerLastName",
      u.email as "partnerEmail",
      u.avatar as "partnerAvatar",
      u.role as "partnerRole",
      lm.message_id as "lastMessageId",
      lm.content as "lastMessageContent",
      lm."senderId" as "lastMessageSenderId",
      lm."createdAt" as "lastMessageCreatedAt",
      lm."isRead" as "lastMessageIsRead",
      COALESCE(uc.unread_count, 0)::integer as "unreadCount"
    FROM last_messages lm
    JOIN "User" u ON u.id = lm.partner_id
    LEFT JOIN unread_counts uc ON uc.partner_id = lm.partner_id
    ORDER BY
      -- Coaches: waiting conversations first (where partner sent last message)
      CASE WHEN ${isAdmin} AND lm."senderId" != ${userId} THEN 0 ELSE 1 END,
      lm."createdAt" DESC
  `;

  // If no conversations, return empty
  if (conversationData.length === 0) return [];

  // For admins, fetch additional user data (enrollments, badges, streak) in batch
  // Only fetch if needed and do it efficiently
  let userExtras: Map<string, { enrollments?: any[]; badges?: any[]; streak?: any }> = new Map();

  if (isAdmin && conversationData.length > 0) {
    const partnerIds = conversationData.map(c => c.odpartnerId);

    // Fetch enrollments, badges, streak, and current lesson progress in parallel
    const [enrollments, badges, streaks, lessonProgress] = await Promise.all([
      prisma.enrollment.findMany({
        where: { userId: { in: partnerIds } },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              slug: true,
              _count: { select: { lessons: true } },
            },
          },
        },
      }),
      prisma.userBadge.findMany({
        where: { userId: { in: partnerIds } },
        include: { badge: { select: { name: true, icon: true } } },
        orderBy: { earnedAt: "desc" },
      }),
      prisma.streak.findMany({
        where: { userId: { in: partnerIds } },
      }),
      // Get last active lesson for each user (most recently visited)
      prisma.lessonProgress.findMany({
        where: {
          userId: { in: partnerIds },
          lastVisitedAt: { not: null },
        },
        orderBy: { lastVisitedAt: "desc" },
        include: {
          lesson: {
            select: {
              id: true,
              title: true,
              orderIndex: true,
              module: {
                select: {
                  title: true,
                  course: { select: { id: true, title: true } },
                },
              },
            },
          },
        },
      }),
    ]);

    // Get completed lessons count per user per course
    const completedLessons = await prisma.lessonProgress.groupBy({
      by: ["userId", "lessonId"],
      where: {
        userId: { in: partnerIds },
        isCompleted: true,
      },
    });

    // Create a map of userId -> courseId -> completedCount
    const completedByUserCourse = new Map<string, Map<string, number>>();
    for (const lp of completedLessons) {
      if (!completedByUserCourse.has(lp.userId)) {
        completedByUserCourse.set(lp.userId, new Map());
      }
    }

    // Group lesson progress by user and find their current lesson per course
    const currentLessonByUser = new Map<string, { lessonTitle: string; moduleTitle: string; courseTitle: string; courseId: string }>();
    for (const lp of lessonProgress) {
      // Only keep the first (most recent) for each user
      if (!currentLessonByUser.has(lp.userId) && lp.lesson) {
        currentLessonByUser.set(lp.userId, {
          lessonTitle: lp.lesson.title,
          moduleTitle: lp.lesson.module?.title || "",
          courseTitle: lp.lesson.module?.course?.title || "",
          courseId: lp.lesson.module?.course?.id || "",
        });
      }
    }

    // Group by user
    for (const partnerId of partnerIds) {
      const userEnrollments = enrollments.filter(e => e.userId === partnerId);
      const currentLesson = currentLessonByUser.get(partnerId);
      const userStreak = streaks.find(s => s.userId === partnerId);

      // Count completed lessons per course for this user
      const userCompletedLessons = lessonProgress.filter(
        lp => lp.userId === partnerId && lp.isCompleted
      );

      userExtras.set(partnerId, {
        enrollments: userEnrollments.map(e => {
          const totalLessons = (e.course as any)._count?.lessons || 0;
          const completedInCourse = userCompletedLessons.filter(
            lp => lp.lesson?.module?.course?.id === e.course.id
          ).length;

          return {
            id: e.id,
            progress: Number(e.progress),
            status: e.status,
            course: {
              id: e.course.id,
              title: e.course.title,
              slug: e.course.slug,
            },
            totalLessons,
            completedLessons: completedInCourse,
          };
        }),
        badges: badges.filter(b => b.userId === partnerId).slice(0, 6).map(b => ({
          id: b.id,
          earnedAt: b.earnedAt,
          badge: { name: b.badge.name, icon: b.badge.icon },
        })),
        streak: userStreak ? {
          currentStreak: userStreak.currentStreak,
          longestStreak: userStreak.longestStreak,
          totalPoints: userStreak.totalPoints,
        } : undefined,
        currentLesson: currentLesson || null,
      });
    }
  }

  // Build conversation objects
  return conversationData.map((conv) => {
    const extras = userExtras.get(conv.odpartnerId);

    return {
      user: {
        id: conv.odpartnerId,
        firstName: conv.odpartnerFirstName,
        lastName: conv.odpartnerLastName,
        email: conv.partnerEmail,
        avatar: conv.partnerAvatar,
        role: conv.partnerRole,
        enrollments: extras?.enrollments,
        badges: extras?.badges,
        streak: extras?.streak,
        currentLesson: extras?.currentLesson,
      },
      lastMessage: {
        id: conv.lastMessageId,
        content: conv.lastMessageContent,
        senderId: conv.lastMessageSenderId,
        createdAt: conv.lastMessageCreatedAt,
        isRead: conv.lastMessageIsRead,
      },
      unreadCount: conv.unreadCount,
    };
  });
}

async function getMentors() {
  return prisma.user.findMany({
    where: {
      role: { in: ["MENTOR", "INSTRUCTOR", "ADMIN"] },
      isActive: true,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      avatar: true,
      role: true,
      bio: true,
    },
    take: 10,
  });
}

export default async function MessagesPage({ searchParams }: MessagesPageProps) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const { chat: initialChatUserId } = await searchParams;
  const isAdmin = session.user.role === "ADMIN" || session.user.role === "INSTRUCTOR" || session.user.role === "MENTOR";

  // If a chat user is specified, fetch their info
  let initialSelectedUser = null;
  if (initialChatUserId) {
    const user = await prisma.user.findUnique({
      where: { id: initialChatUserId },
      include: {
        enrollments: isAdmin ? {
          include: {
            course: {
              select: {
                id: true,
                title: true,
                slug: true,
              },
            },
          },
        } : false,
        streak: isAdmin,
        badges: isAdmin ? {
          include: {
            badge: {
              select: {
                name: true,
                icon: true,
              },
            },
          },
          orderBy: { earnedAt: "desc" },
          take: 6,
        } : false,
      },
    });
    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const enrollments = user.enrollments as any[] | undefined;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const badges = user.badges as any[] | undefined;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const streak = user.streak as any | undefined;

      initialSelectedUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        bio: user.bio,
        enrollments: isAdmin && enrollments ? enrollments.map((e) => ({
          id: e.id,
          progress: Number(e.progress),
          status: e.status,
          course: e.course,
        })) : undefined,
        badges: isAdmin && badges ? badges.map((b) => ({
          id: b.id,
          earnedAt: b.earnedAt,
          badge: {
            name: b.badge.name,
            icon: b.badge.icon,
          },
        })) : undefined,
        streak: isAdmin && streak ? {
          currentStreak: streak.currentStreak,
          longestStreak: streak.longestStreak,
          totalPoints: streak.totalPoints,
        } : undefined,
      };
    }
  }

  const [conversations, mentors] = await Promise.all([
    getConversations(session.user.id, isAdmin),
    getMentors(),
  ]);

  return (
    <MessagesClient
      conversations={conversations}
      mentors={mentors}
      currentUserId={session.user.id}
      currentUserRole={session.user.role}
      initialSelectedUser={initialSelectedUser}
    />
  );
}
