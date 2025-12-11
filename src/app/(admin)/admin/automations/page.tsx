import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import {
  Zap,
  Play,
  Pause,
  Settings,
  Mail,
  MessageSquare,
  Bell,
  Award,
  Users,
  Target,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronRight,
  Activity,
  BarChart3,
  Filter,
  Search,
  Plus,
  Sparkles,
  LayoutGrid,
  ListFilter,
} from "lucide-react";
import { WorkflowsClient } from "@/components/admin/workflows-client";

async function getWorkflows() {
  return prisma.workflow.findMany({
    include: {
      actions: {
        orderBy: { order: "asc" },
      },
      _count: {
        select: { executions: true },
      },
    },
    orderBy: [{ isActive: "desc" }, { priority: "desc" }, { name: "asc" }],
  });
}

async function getWorkflowStats() {
  const [
    totalWorkflows,
    activeWorkflows,
    totalExecutions,
    recentExecutions,
    executionsByStatus,
  ] = await Promise.all([
    prisma.workflow.count(),
    prisma.workflow.count({ where: { isActive: true } }),
    prisma.workflowExecution.count(),
    prisma.workflowExecution.count({
      where: { startedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } },
    }),
    prisma.workflowExecution.groupBy({
      by: ["status"],
      _count: true,
    }),
  ]);

  const statusCounts = executionsByStatus.reduce(
    (acc, item) => {
      acc[item.status] = item._count;
      return acc;
    },
    {} as Record<string, number>
  );

  return {
    totalWorkflows,
    activeWorkflows,
    totalExecutions,
    recentExecutions,
    completedExecutions: statusCounts.COMPLETED || 0,
    failedExecutions: statusCounts.FAILED || 0,
    pendingExecutions: statusCounts.PENDING || 0,
  };
}

async function getMessageTemplates() {
  return prisma.messageTemplate.findMany({
    orderBy: [{ category: "asc" }, { name: "asc" }],
  });
}

async function getRecentExecutions() {
  return prisma.workflowExecution.findMany({
    take: 10,
    orderBy: { startedAt: "desc" },
    include: {
      workflow: {
        select: { name: true, slug: true },
      },
    },
  });
}

export default async function AutomationsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const [workflows, stats, templates, recentExecutions] = await Promise.all([
    getWorkflows(),
    getWorkflowStats(),
    getMessageTemplates(),
    getRecentExecutions(),
  ]);

  // Group workflows by category
  const workflowsByCategory = workflows.reduce(
    (acc, workflow) => {
      const cat = workflow.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(workflow);
      return acc;
    },
    {} as Record<string, typeof workflows>
  );

  const categoryInfo: Record<
    string,
    { label: string; icon: string; color: string; description: string }
  > = {
    ENROLLMENT: {
      label: "Enrollment & Welcome",
      icon: "Users",
      color: "blue",
      description: "Onboarding, welcome sequences, first login",
    },
    PROGRESS: {
      label: "Progress & Learning",
      icon: "TrendingUp",
      color: "green",
      description: "Lesson, module, course completion",
    },
    ENGAGEMENT: {
      label: "Engagement & Retention",
      icon: "Activity",
      color: "purple",
      description: "Inactivity reminders, streaks, community",
    },
    UPSELL: {
      label: "Upsell & Revenue",
      icon: "Target",
      color: "amber",
      description: "Credit-based offers, upgrade CTAs",
    },
    MILESTONE: {
      label: "Milestones & Achievements",
      icon: "Award",
      color: "pink",
      description: "Badges, certificates, challenges",
    },
    BEHAVIOR: {
      label: "Behavior Tracking",
      icon: "BarChart3",
      color: "cyan",
      description: "Catalog views, page visits, video watch",
    },
    SYSTEM: {
      label: "System & Technical",
      icon: "Settings",
      color: "gray",
      description: "Auto-tagging, coach assignment",
    },
    ANNOUNCEMENT: {
      label: "Announcements",
      icon: "Bell",
      color: "red",
      description: "Bulk communications, flash sales",
    },
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            Workflow Automations
          </h1>
          <p className="text-gray-500 mt-1">
            Automate your LMS with powerful triggers and actions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700">
            <Plus className="w-4 h-4" />
            Create Workflow
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Total Workflows</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.totalWorkflows}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {stats.activeWorkflows} active
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-purple-500" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Executions (7d)</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.recentExecutions.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  {stats.totalExecutions.toLocaleString()} total
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                <Activity className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Success Rate</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.totalExecutions > 0
                    ? Math.round(
                        (stats.completedExecutions / stats.totalExecutions) * 100
                      )
                    : 100}
                  %
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {stats.completedExecutions} completed
                </p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500" />
          </CardContent>
        </Card>

        <Card className="relative overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-500">Templates</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {templates.length}
                </p>
                <p className="text-xs text-gray-400 mt-1">Message templates</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-500" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <WorkflowsClient
        workflows={workflows}
        templates={templates}
        recentExecutions={recentExecutions}
        categoryInfo={categoryInfo}
        workflowsByCategory={workflowsByCategory}
      />
    </div>
  );
}
