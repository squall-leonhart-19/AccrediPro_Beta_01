import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { MessagesClient } from "@/components/messages/messages-client";
// Force dynamic rendering - no caching
export const dynamic = "force-dynamic";


interface MessagesPageProps {
  searchParams: Promise<{ chat?: string }>;
}

async function getConversations(userId: string, isAdmin: boolean) {
  // Step 1: Get all unique conversation partners (users we've exchanged messages with)
  const [sentTo, receivedFrom] = await Promise.all([
    prisma.message.findMany({
      where: { senderId: userId },
      select: { receiverId: true },
      distinct: ["receiverId"],
    }),
    prisma.message.findMany({
      where: { receiverId: userId },
      select: { senderId: true },
      distinct: ["senderId"],
    }),
  ]);

  const userIds = Array.from(new Set([
    ...sentTo.map((m) => m.receiverId),
    ...receivedFrom.map((m) => m.senderId),
  ]));

  if (userIds.length === 0) return [];

  // Step 2: Batch fetch ALL user details at once (instead of one-by-one)
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    include: {
      enrollments: isAdmin ? {
        include: {
          course: {
            select: { id: true, title: true, slug: true },
          },
        },
      } : false,
      streak: isAdmin,
      badges: isAdmin ? {
        include: {
          badge: {
            select: { name: true, icon: true },
          },
        },
        orderBy: { earnedAt: "desc" },
        take: 6,
      } : false,
    },
  });

  // Step 3: Batch fetch last messages for ALL conversations
  const allMessages = await prisma.message.findMany({
    where: {
      OR: userIds.flatMap((otherUserId) => [
        { senderId: userId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: userId },
      ]),
    },
    orderBy: { createdAt: "desc" },
  });

  // Step 4: Batch count unread messages
  const unreadCounts = await prisma.$queryRaw<Array<{ senderId: string; count: bigint }>>`
    SELECT "senderId", COUNT(*)::integer as count
    FROM "Message"
    WHERE "receiverId" = ${userId}
      AND "isRead" = false
      AND "senderId" IN (${Prisma.join(userIds)})
    GROUP BY "senderId"
  `;

  // Create lookup maps for O(1) access
  const userMap = new Map(users.map((u) => [u.id, u]));
  const unreadMap = new Map(unreadCounts.map((uc) => [uc.senderId, Number(uc.count)]));

  // Group messages by conversation
  const messagesByConversation = new Map<string, typeof allMessages>();
  for (const msg of allMessages) {
    const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
    if (!messagesByConversation.has(otherUserId)) {
      messagesByConversation.set(otherUserId, []);
    }
    messagesByConversation.get(otherUserId)!.push(msg);
  }

  // Build conversation objects
  const conversations = userIds.map((otherUserId) => {
    const user = userMap.get(otherUserId);
    if (!user) return null;

    const conversationMsgs = messagesByConversation.get(otherUserId) || [];
    const lastMessage = conversationMsgs[0] || null; // Already sorted desc

    const enrollments = user.enrollments as any[] | undefined;
    const badges = user.badges as any[] | undefined;
    const streak = user.streak as any | undefined;

    return {
      user: {
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
      },
      lastMessage,
      unreadCount: unreadMap.get(otherUserId) || 0,
    };
  }).filter((c): c is NonNullable<typeof c> => c !== null);

  // Sort conversations:
  // For admins/coaches: Prioritize "waiting for answer" (last message from other user)
  // Then by last message time
  return conversations.sort((a, b) => {
    // Check if conversation is waiting for admin's reply
    // (last message was sent BY the other user, not by admin)
    const aWaiting = a.lastMessage && a.lastMessage.senderId !== userId;
    const bWaiting = b.lastMessage && b.lastMessage.senderId !== userId;

    // If admin view: prioritize conversations waiting for reply
    if (isAdmin) {
      if (aWaiting && !bWaiting) return -1; // a waiting, b not -> a first
      if (!aWaiting && bWaiting) return 1;  // b waiting, a not -> b first
    }

    // Then sort by last message time (newest first)
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
