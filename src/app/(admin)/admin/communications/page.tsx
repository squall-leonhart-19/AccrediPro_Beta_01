import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
  Mail,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Send,
  TrendingUp,
  UserCircle,
  Zap,
  Target,
  Activity,
  ChevronRight,
  CalendarDays,
  BarChart3,
  Inbox,
  Bell,
} from "lucide-react";
import { BulkEmailForm } from "@/components/admin/bulk-email-form";
import { BulkDMForm } from "@/components/admin/bulk-dm-form";

async function getRecentCommunications() {
  const [bulkEmails, bulkDMs] = await Promise.all([
    prisma.bulkEmail.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true,
          },
        },
      },
    }),
    prisma.bulkDM.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        sender: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            role: true,
          },
        },
      },
    }),
  ]);

  return { bulkEmails, bulkDMs };
}

async function getUserStats() {
  const [totalUsers, enrolledUsers, completedUsers, activeThisWeek] = await Promise.all([
    prisma.user.count({ where: { isActive: true, role: "STUDENT" } }),
    prisma.enrollment.findMany({
      where: { status: "ACTIVE" },
      select: { userId: true },
      distinct: ["userId"],
    }),
    prisma.enrollment.findMany({
      where: { status: "COMPLETED" },
      select: { userId: true },
      distinct: ["userId"],
    }),
    prisma.user.count({
      where: {
        role: "STUDENT",
        lastLoginAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
  ]);

  return {
    totalUsers,
    enrolledUsers: enrolledUsers.length,
    completedUsers: completedUsers.length,
    activeThisWeek,
  };
}

async function getCommunicationStats() {
  const [totalEmailsSent, totalDMsSent, recentMessages] = await Promise.all([
    prisma.bulkEmail.aggregate({ _sum: { sentCount: true } }),
    prisma.bulkDM.aggregate({ _sum: { sentCount: true } }),
    prisma.message.count({
      where: { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    }),
  ]);

  return {
    totalEmailsSent: totalEmailsSent._sum.sentCount || 0,
    totalDMsSent: totalDMsSent._sum.sentCount || 0,
    recentMessages,
  };
}

async function getCoaches() {
  return prisma.user.findMany({
    where: {
      role: { in: ["ADMIN", "INSTRUCTOR", "MENTOR"] },
      isActive: true,
    },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      avatar: true,
      role: true,
    },
    orderBy: [{ role: "asc" }, { firstName: "asc" }],
  });
}

export default async function CommunicationsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const [communications, userStats, commStats, coaches] = await Promise.all([
    getRecentCommunications(),
    getUserStats(),
    getCommunicationStats(),
    getCoaches(),
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SENT":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Sent
          </Badge>
        );
      case "SENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Sending
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      case "SCHEDULED":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            <Clock className="w-3 h-3 mr-1" />
            Scheduled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
            Communications Hub
          </h1>
          <p className="text-gray-500 mt-1">
            Engage with your students through bulk emails and direct messages
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/messages">
            <Button variant="outline" className="gap-2">
              <Inbox className="w-4 h-4" />
              View Inbox
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Overview - 4 Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Audience */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Total Audience</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {userStats.totalUsers.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">Active students</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-burgundy-500 to-burgundy-600 rounded-xl flex items-center justify-center shadow-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-burgundy-500" />
          </CardContent>
        </Card>

        {/* Active This Week */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Active This Week</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {userStats.activeThisWeek.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {Math.round((userStats.activeThisWeek / userStats.totalUsers) * 100)}% engagement
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500" />
          </CardContent>
        </Card>

        {/* Emails Sent */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Emails Sent</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {commStats.totalEmailsSent.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">All time</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <Mail className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />
          </CardContent>
        </Card>

        {/* DMs Sent */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">DMs Sent</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {commStats.totalDMsSent.toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">All time</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500" />
          </CardContent>
        </Card>
      </div>

      {/* Audience Segments */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Target className="w-5 h-5 text-burgundy-500" />
            Audience Segments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-burgundy-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-burgundy-600" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-gray-900">{userStats.totalUsers}</p>
                <p className="text-sm text-gray-500">All Students</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">100%</p>
                <Progress value={100} className="w-16 h-1.5 mt-1" />
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-gray-900">{userStats.enrolledUsers}</p>
                <p className="text-sm text-gray-500">Currently Enrolled</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">
                  {Math.round((userStats.enrolledUsers / userStats.totalUsers) * 100)}%
                </p>
                <Progress
                  value={Math.round((userStats.enrolledUsers / userStats.totalUsers) * 100)}
                  className="w-16 h-1.5 mt-1"
                />
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-gray-900">{userStats.completedUsers}</p>
                <p className="text-sm text-gray-500">Completed Course</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400">
                  {Math.round((userStats.completedUsers / userStats.totalUsers) * 100)}%
                </p>
                <Progress
                  value={Math.round((userStats.completedUsers / userStats.totalUsers) * 100)}
                  className="w-16 h-1.5 mt-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Communication Forms */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bulk Email */}
        <Card className="border-2 border-blue-100">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b border-blue-100">
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <span className="text-gray-900">Send Bulk Email</span>
                <p className="text-xs font-normal text-gray-500 mt-0.5">
                  Reach your students via email
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <BulkEmailForm userStats={userStats} />
          </CardContent>
        </Card>

        {/* Bulk DM */}
        <Card className="border-2 border-purple-100">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-white border-b border-purple-100">
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <span className="text-gray-900">Send Bulk DM</span>
                <p className="text-xs font-normal text-gray-500 mt-0.5">
                  Send in-app direct messages
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <BulkDMForm userStats={userStats} coaches={coaches} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Communications */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Emails */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-500" />
              Recent Bulk Emails
            </CardTitle>
            <Badge variant="secondary" className="bg-blue-100 text-blue-700">
              {communications.bulkEmails.length} sent
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            {communications.bulkEmails.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {communications.bulkEmails.map((email) => (
                  <div
                    key={email.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-gray-900 line-clamp-1">
                            {email.subject}
                          </p>
                          {getStatusBadge(email.status)}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {email.recipientType}
                          </span>
                          <span className="flex items-center gap-1">
                            <Send className="w-3.5 h-3.5" />
                            {email.sentCount} sent
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          {email.sender ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="w-5 h-5">
                                <AvatarImage src={email.sender.avatar || undefined} />
                                <AvatarFallback className="text-xs bg-burgundy-100 text-burgundy-700">
                                  {email.sender.firstName?.charAt(0)}
                                  {email.sender.lastName?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-gray-500">
                                {email.sender.firstName} {email.sender.lastName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">System</span>
                          )}
                          <span className="text-xs text-gray-400">
                            {formatRelativeTime(email.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No emails sent yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Send your first bulk email above
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent DMs */}
        <Card>
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-500" />
              Recent Bulk DMs
            </CardTitle>
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              {communications.bulkDMs.length} sent
            </Badge>
          </CardHeader>
          <CardContent className="p-0">
            {communications.bulkDMs.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {communications.bulkDMs.map((dm) => (
                  <div
                    key={dm.id}
                    className="p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <MessageSquare className="w-5 h-5 text-purple-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-gray-900 line-clamp-2">
                            {dm.content.length > 60
                              ? dm.content.substring(0, 60) + "..."
                              : dm.content}
                          </p>
                          {getStatusBadge(dm.status)}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" />
                            {dm.recipientType}
                          </span>
                          <span className="flex items-center gap-1">
                            <Send className="w-3.5 h-3.5" />
                            {dm.sentCount} sent
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          {dm.sender ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="w-5 h-5">
                                <AvatarImage src={dm.sender.avatar || undefined} />
                                <AvatarFallback className="text-xs bg-burgundy-100 text-burgundy-700">
                                  {dm.sender.firstName?.charAt(0)}
                                  {dm.sender.lastName?.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-gray-500">
                                {dm.sender.firstName} {dm.sender.lastName}
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">System</span>
                          )}
                          <span className="text-xs text-gray-400">
                            {formatRelativeTime(dm.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">No DMs sent yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Send your first bulk DM above
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
