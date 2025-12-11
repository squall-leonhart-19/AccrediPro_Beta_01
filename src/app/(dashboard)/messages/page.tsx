import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { MessagesClient } from "@/components/messages/messages-client";

interface MessagesPageProps {
  searchParams: Promise<{ chat?: string }>;
}

async function getConversations(userId: string, isAdmin: boolean) {
  // Get all users the current user has exchanged messages with
  const sentTo = await prisma.message.findMany({
    where: { senderId: userId },
    select: { receiverId: true },
    distinct: ["receiverId"],
  });

  const receivedFrom = await prisma.message.findMany({
    where: { receiverId: userId },
    select: { senderId: true },
    distinct: ["senderId"],
  });

  const userIds = new Set([
    ...sentTo.map((m) => m.receiverId),
    ...receivedFrom.map((m) => m.senderId),
  ]);

  // Get user details and last message for each conversation
  const conversations = await Promise.all(
    Array.from(userIds).map(async (otherUserId) => {
      const [user, lastMessage, unreadCount] = await Promise.all([
        prisma.user.findUnique({
          where: { id: otherUserId },
          include: {
            // Include enrollments for admin/coach view
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
            // Include streak data for admin/coach view
            streak: isAdmin,
            // Include badges for admin/coach view
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
        }),
        prisma.message.findFirst({
          where: {
            OR: [
              { senderId: userId, receiverId: otherUserId },
              { senderId: otherUserId, receiverId: userId },
            ],
          },
          orderBy: { createdAt: "desc" },
        }),
        prisma.message.count({
          where: {
            senderId: otherUserId,
            receiverId: userId,
            isRead: false,
          },
        }),
      ]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const enrollments = user?.enrollments as any[] | undefined;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const badges = user?.badges as any[] | undefined;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const streak = user?.streak as any | undefined;

      return {
        user: user ? {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
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
        } : null,
        lastMessage,
        unreadCount,
      };
    })
  );

  return conversations
    .filter((c) => c.user)
    .sort((a, b) => {
      const aTime = a.lastMessage?.createdAt.getTime() || 0;
      const bTime = b.lastMessage?.createdAt.getTime() || 0;
      return bTime - aTime;
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
