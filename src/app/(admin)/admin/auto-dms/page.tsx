import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AutoDMsClient } from "./auto-dms-client";

export const metadata = {
  title: "Auto DMs | Admin",
  description: "Manage automated private messages from Coach Sarah",
};

async function getStats() {
  const [
    scheduledMessages,
    sentVoiceDMs,
    totalSentDMs,
    recentActivity,
    moduleCompletions,
  ] = await Promise.all([
    // Pending scheduled messages
    prisma.scheduledVoiceMessage.count({ where: { status: "PENDING" } }),
    // Sent voice DMs
    prisma.message.count({
      where: {
        attachmentType: "voice",
        messageType: "DIRECT",
      },
    }),
    // Total auto DMs (from Sarah or containing module keywords)
    prisma.message.count({
      where: {
        messageType: "DIRECT",
        OR: [
          { content: { contains: "Module" } },
          { content: { contains: "I'll be your coach" } },
          { content: { contains: "Mini Diploma" } },
          { content: { contains: "- Sarah" } },
        ],
      },
    }),
    // Recent auto DM activity (last 50)
    prisma.message.findMany({
      where: {
        messageType: "DIRECT",
        OR: [
          { content: { contains: "Module" } },
          { content: { contains: "I'll be your coach" } },
          { content: { contains: "Welcome to AccrediPro" } },
          { attachmentType: "voice" },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, email: true, avatar: true } },
        receiver: { select: { id: true, firstName: true, lastName: true, email: true } },
      },
    }),
    // Module completion counts for tracking
    prisma.moduleProgress.groupBy({
      by: ["moduleId"],
      where: { isCompleted: true },
      _count: { userId: true },
    }),
  ]);

  // Get scheduled message details
  const scheduledDetails = await prisma.scheduledVoiceMessage.findMany({
    where: { status: { in: ["PENDING", "PROCESSING"] } },
    orderBy: { scheduledFor: "asc" },
    take: 10,
    include: {
      receiver: { select: { firstName: true, lastName: true, email: true } },
    },
  });

  // Get failed messages for retry
  const failedMessages = await prisma.scheduledVoiceMessage.findMany({
    where: { status: "FAILED" },
    orderBy: { scheduledFor: "desc" },
    take: 10,
    include: {
      receiver: { select: { firstName: true, lastName: true, email: true } },
    },
  });

  return {
    scheduledMessages,
    sentVoiceDMs,
    totalSentDMs,
    recentActivity: recentActivity.map((m) => ({
      id: m.id,
      content: m.content,
      createdAt: m.createdAt.toISOString(),
      hasVoice: m.attachmentType === "voice",
      sender: m.sender,
      receiver: m.receiver,
    })),
    moduleCompletions,
    scheduledDetails: scheduledDetails.map((s) => ({
      id: s.id,
      scheduledFor: s.scheduledFor.toISOString(),
      status: s.status,
      receiver: s.receiver,
      textPreview: s.textContent.substring(0, 100),
    })),
    failedMessages: failedMessages.map((f) => ({
      id: f.id,
      scheduledFor: f.scheduledFor.toISOString(),
      status: f.status,
      attempts: f.attempts,
      lastError: f.lastError,
      receiver: f.receiver,
    })),
  };
}

// Get Sarah's coach account
async function getSarahCoach() {
  const sarah = await prisma.user.findFirst({
    where: {
      OR: [
        { email: "sarah@accredipro-certificate.com" },
        { email: "coach@accredipro-certificate.com" },
      ],
    },
    select: { id: true, email: true, firstName: true, lastName: true },
  });
  return sarah;
}

export default async function AutoDMsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Verify user has admin access
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || !["ADMIN"].includes(user.role)) {
    redirect("/dashboard");
  }

  const [stats, sarahCoach] = await Promise.all([
    getStats(),
    getSarahCoach(),
  ]);

  return (
    <AutoDMsClient
      stats={stats}
      sarahCoach={sarahCoach}
    />
  );
}
