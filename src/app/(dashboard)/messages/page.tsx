import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { MessagesClient } from "@/components/messages/messages-client";

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

      return {
        user: user ? {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          enrollments: isAdmin && user.enrollments ? user.enrollments : undefined,
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

export default async function MessagesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const isAdmin = session.user.role === "ADMIN" || session.user.role === "INSTRUCTOR";

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
    />
  );
}
