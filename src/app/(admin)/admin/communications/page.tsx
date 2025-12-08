import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, MessageSquare, Clock, CheckCircle, XCircle } from "lucide-react";
import { BulkEmailForm } from "@/components/admin/bulk-email-form";
import { BulkDMForm } from "@/components/admin/bulk-dm-form";

async function getRecentCommunications() {
  const [bulkEmails, bulkDMs] = await Promise.all([
    prisma.bulkEmail.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.bulkDM.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  return { bulkEmails, bulkDMs };
}

async function getUserStats() {
  const [totalUsers, enrolledUsers, completedUsers] = await Promise.all([
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
  ]);

  return {
    totalUsers,
    enrolledUsers: enrolledUsers.length,
    completedUsers: completedUsers.length,
  };
}

export default async function CommunicationsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const [communications, userStats] = await Promise.all([
    getRecentCommunications(),
    getUserStats(),
  ]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SENT":
        return <Badge variant="success"><CheckCircle className="w-3 h-3 mr-1" />Sent</Badge>;
      case "SENDING":
        return <Badge variant="warning"><Clock className="w-3 h-3 mr-1" />Sending</Badge>;
      case "FAILED":
        return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      case "SCHEDULED":
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
          Communications
        </h1>
        <p className="text-gray-500 mt-1">
          Send bulk emails and direct messages to your users
        </p>
      </div>

      {/* Audience Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">All Students</p>
            <p className="text-2xl font-bold text-gray-900">{userStats.totalUsers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Currently Enrolled</p>
            <p className="text-2xl font-bold text-gray-900">{userStats.enrolledUsers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-gray-500">Completed at Least 1 Course</p>
            <p className="text-2xl font-bold text-gray-900">{userStats.completedUsers}</p>
          </CardContent>
        </Card>
      </div>

      {/* Communication Forms */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Bulk Email */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-burgundy-600" />
              Send Bulk Email
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BulkEmailForm userStats={userStats} />
          </CardContent>
        </Card>

        {/* Bulk DM */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-burgundy-600" />
              Send Bulk DM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <BulkDMForm userStats={userStats} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Communications */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Emails */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Bulk Emails</CardTitle>
          </CardHeader>
          <CardContent>
            {communications.bulkEmails.length > 0 ? (
              <div className="space-y-3">
                {communications.bulkEmails.map((email) => (
                  <div
                    key={email.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">
                        {email.subject}
                      </p>
                      <p className="text-sm text-gray-500">
                        To: {email.recipientType} | Sent: {email.sentCount}
                      </p>
                    </div>
                    {getStatusBadge(email.status)}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No emails sent yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent DMs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Bulk DMs</CardTitle>
          </CardHeader>
          <CardContent>
            {communications.bulkDMs.length > 0 ? (
              <div className="space-y-3">
                {communications.bulkDMs.map((dm) => (
                  <div
                    key={dm.id}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-900 line-clamp-1">
                        {dm.content.substring(0, 50)}...
                      </p>
                      <p className="text-sm text-gray-500">
                        To: {dm.recipientType} | Sent: {dm.sentCount}
                      </p>
                    </div>
                    {getStatusBadge(dm.status)}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No DMs sent yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
