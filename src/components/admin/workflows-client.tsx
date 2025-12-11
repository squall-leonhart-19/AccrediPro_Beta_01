"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
  ChevronDown,
  Activity,
  BarChart3,
  Search,
  Sparkles,
  Eye,
  Edit,
  Trash2,
  Copy,
  MoreVertical,
  ArrowRight,
  Timer,
  GitBranch,
} from "lucide-react";

interface WorkflowAction {
  id: string;
  order: number;
  actionType: string;
  config: any;
  delayMinutes: number;
  isActive: boolean;
}

interface Workflow {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string;
  triggerType: string;
  triggerConfig: any;
  isActive: boolean;
  isSystem: boolean;
  priority: number;
  cooldownMinutes: number;
  maxExecutions: number | null;
  actions: WorkflowAction[];
  _count: {
    executions: number;
  };
}

interface MessageTemplate {
  id: string;
  name: string;
  slug: string;
  category: string;
  subject: string | null;
  content: string;
  isActive: boolean;
}

interface Execution {
  id: string;
  workflowId: string;
  userId: string;
  status: string;
  startedAt: Date;
  completedAt: Date | null;
  workflow: {
    name: string;
    slug: string;
  };
}

interface CategoryInfo {
  label: string;
  icon: string;
  color: string;
  description: string;
}

interface WorkflowsClientProps {
  workflows: Workflow[];
  templates: MessageTemplate[];
  recentExecutions: Execution[];
  categoryInfo: Record<string, CategoryInfo>;
  workflowsByCategory: Record<string, Workflow[]>;
}

const actionIcons: Record<string, React.ElementType> = {
  SEND_DM: MessageSquare,
  SEND_EMAIL: Mail,
  SEND_NOTIFICATION: Bell,
  AWARD_BADGE: Award,
  ADD_TAG: Target,
  SHOW_POPUP: Eye,
  SHOW_OFFER: Sparkles,
  REDIRECT_TO_PAGE: ArrowRight,
  ASSIGN_COACH: Users,
  WAIT: Timer,
};

const triggerLabels: Record<string, string> = {
  USER_REGISTERED: "User Registers",
  USER_FIRST_LOGIN: "First Login",
  USER_ENROLLED: "Enrolls in Course",
  USER_ONBOARDING_COMPLETE: "Completes Onboarding",
  LESSON_COMPLETED: "Completes Lesson",
  MODULE_COMPLETED: "Completes Module",
  COURSE_COMPLETED: "Completes Course",
  MINI_DIPLOMA_EARNED: "Earns Mini Diploma",
  CERTIFICATION_EARNED: "Earns Certification",
  CHALLENGE_HALFWAY: "Challenge Halfway",
  CHALLENGE_COMPLETED: "Challenge Completed",
  PROGRESS_PERCENTAGE: "Progress Milestone",
  INACTIVE_24H: "Inactive 24 Hours",
  INACTIVE_48H: "Inactive 48 Hours",
  INACTIVE_7D: "Inactive 7 Days",
  STREAK_ACHIEVED: "Streak Achieved",
  FIRST_COMMUNITY_POST: "First Community Post",
  FIRST_COMMUNITY_COMMENT: "First Comment",
  CATALOG_VIEWED: "Views Catalog",
  COURSE_PAGE_VIEWED: "Views Course Page",
  VIDEO_WATCHED_PERCENT: "Video Watch %",
  CREDIT_SCORE_UNDER_620: "Credit < 620",
  CREDIT_SCORE_620_679: "Credit 620-679",
  CREDIT_SCORE_680_PLUS: "Credit 680+",
  DAYS_SINCE_ENROLLMENT: "Days Since Enrollment",
  BADGE_EARNED: "Badge Earned",
  CERTIFICATE_ISSUED: "Certificate Issued",
  MANUAL: "Manual Trigger",
};

const categoryColors: Record<string, string> = {
  ENROLLMENT: "blue",
  PROGRESS: "green",
  ENGAGEMENT: "purple",
  UPSELL: "amber",
  MILESTONE: "pink",
  BEHAVIOR: "cyan",
  SYSTEM: "gray",
  ANNOUNCEMENT: "red",
};

const CategoryIcon = ({ category }: { category: string }) => {
  const icons: Record<string, React.ElementType> = {
    ENROLLMENT: Users,
    PROGRESS: TrendingUp,
    ENGAGEMENT: Activity,
    UPSELL: Target,
    MILESTONE: Award,
    BEHAVIOR: BarChart3,
    SYSTEM: Settings,
    ANNOUNCEMENT: Bell,
  };
  const Icon = icons[category] || Zap;
  return <Icon className="w-5 h-5" />;
};

export function WorkflowsClient({
  workflows,
  templates,
  recentExecutions,
  categoryInfo,
  workflowsByCategory,
}: WorkflowsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedWorkflows, setExpandedWorkflows] = useState<Set<string>>(new Set());
  const [togglingIds, setTogglingIds] = useState<Set<string>>(new Set());

  const toggleWorkflowExpand = (id: string) => {
    setExpandedWorkflows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleActive = async (workflow: Workflow) => {
    if (togglingIds.has(workflow.id)) return;

    setTogglingIds((prev) => new Set([...prev, workflow.id]));

    try {
      const response = await fetch(`/api/admin/workflows/${workflow.id}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !workflow.isActive }),
      });

      if (response.ok) {
        // In a real app, you'd update state or refresh data
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to toggle workflow:", error);
    } finally {
      setTogglingIds((prev) => {
        const next = new Set(prev);
        next.delete(workflow.id);
        return next;
      });
    }
  };

  const filteredWorkflows = workflows.filter((workflow) => {
    const matchesSearch =
      searchQuery === "" ||
      workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workflow.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === null || workflow.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return (
          <Badge className="bg-green-100 text-green-700 border-green-200">
            <CheckCircle className="w-3 h-3 mr-1" />
            Completed
          </Badge>
        );
      case "RUNNING":
        return (
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            <Activity className="w-3 h-3 mr-1" />
            Running
          </Badge>
        );
      case "FAILED":
        return (
          <Badge className="bg-red-100 text-red-700 border-red-200">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      case "PENDING":
        return (
          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const formatTimeAgo = (date: Date) => {
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
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Main Workflows List */}
      <div className="lg:col-span-2 space-y-4">
        {/* Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search workflows..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                <Button
                  variant={selectedCategory === null ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(null)}
                >
                  All
                </Button>
                {Object.entries(categoryInfo).map(([key, info]) => (
                  <Button
                    key={key}
                    variant={selectedCategory === key ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(key)}
                    className="whitespace-nowrap"
                  >
                    {info.label.split(" ")[0]}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Workflows by Category */}
        {selectedCategory
          ? workflowsByCategory[selectedCategory]?.filter((w) =>
              searchQuery === "" ||
              w.name.toLowerCase().includes(searchQuery.toLowerCase())
            ).length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                  <CategoryIcon category={selectedCategory} />
                  {categoryInfo[selectedCategory]?.label}
                  <span className="text-xs text-gray-400">
                    ({workflowsByCategory[selectedCategory]?.length || 0})
                  </span>
                </h3>
                {workflowsByCategory[selectedCategory]
                  ?.filter(
                    (w) =>
                      searchQuery === "" ||
                      w.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((workflow) => (
                    <WorkflowCard
                      key={workflow.id}
                      workflow={workflow}
                      expanded={expandedWorkflows.has(workflow.id)}
                      onToggleExpand={() => toggleWorkflowExpand(workflow.id)}
                      onToggleActive={() => handleToggleActive(workflow)}
                      isToggling={togglingIds.has(workflow.id)}
                    />
                  ))}
              </div>
            )
          : Object.entries(workflowsByCategory).map(([category, categoryWorkflows]) => {
              const filtered = categoryWorkflows.filter(
                (w) =>
                  searchQuery === "" ||
                  w.name.toLowerCase().includes(searchQuery.toLowerCase())
              );
              if (filtered.length === 0) return null;

              return (
                <div key={category} className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-500 flex items-center gap-2">
                    <CategoryIcon category={category} />
                    {categoryInfo[category]?.label || category}
                    <span className="text-xs text-gray-400">
                      ({filtered.length})
                    </span>
                  </h3>
                  {filtered.map((workflow) => (
                    <WorkflowCard
                      key={workflow.id}
                      workflow={workflow}
                      expanded={expandedWorkflows.has(workflow.id)}
                      onToggleExpand={() => toggleWorkflowExpand(workflow.id)}
                      onToggleActive={() => handleToggleActive(workflow)}
                      isToggling={togglingIds.has(workflow.id)}
                    />
                  ))}
                </div>
              );
            })}

        {filteredWorkflows.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Zap className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">No workflows found</p>
              <p className="text-sm text-gray-400 mt-1">
                Try adjusting your search or filters
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Sidebar */}
      <div className="space-y-4">
        {/* Recent Executions */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-500" />
              Recent Executions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentExecutions.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {recentExecutions.slice(0, 8).map((execution) => (
                  <div
                    key={execution.id}
                    className="p-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {execution.workflow.name}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatTimeAgo(execution.startedAt)}
                        </p>
                      </div>
                      {getStatusBadge(execution.status)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Activity className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No executions yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats by Category */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-500" />
              Workflows by Category
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(categoryInfo).map(([key, info]) => {
                const count = workflowsByCategory[key]?.length || 0;
                const activeCount =
                  workflowsByCategory[key]?.filter((w) => w.isActive).length || 0;

                return (
                  <div key={key} className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center bg-${categoryColors[key]}-100`}
                    >
                      <CategoryIcon category={key} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {info.label.split(" ")[0]}
                      </p>
                      <p className="text-xs text-gray-400">
                        {activeCount}/{count} active
                      </p>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {count}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Message Templates */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-500" />
              Message Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {["WELCOME", "PROGRESS", "ENCOURAGEMENT", "UPSELL", "REMINDER"].map(
                (category) => {
                  const count = templates.filter(
                    (t) => t.category === category
                  ).length;
                  return (
                    <div
                      key={category}
                      className="flex items-center justify-between py-1"
                    >
                      <span className="text-sm text-gray-600 capitalize">
                        {category.toLowerCase()}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {count}
                      </Badge>
                    </div>
                  );
                }
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-4 gap-2"
            >
              <Edit className="w-3 h-3" />
              Manage Templates
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Individual Workflow Card Component
function WorkflowCard({
  workflow,
  expanded,
  onToggleExpand,
  onToggleActive,
  isToggling,
}: {
  workflow: Workflow;
  expanded: boolean;
  onToggleExpand: () => void;
  onToggleActive: () => void;
  isToggling: boolean;
}) {
  const ActionIcon = actionIcons[workflow.actions[0]?.actionType] || Zap;

  return (
    <Card
      className={`transition-all ${
        workflow.isActive
          ? "border-l-4 border-l-green-500"
          : "border-l-4 border-l-gray-300"
      }`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
              workflow.isActive
                ? "bg-gradient-to-br from-purple-500 to-indigo-600"
                : "bg-gray-200"
            }`}
          >
            <Zap className={`w-5 h-5 ${workflow.isActive ? "text-white" : "text-gray-500"}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h4 className="font-medium text-gray-900">{workflow.name}</h4>
                <p className="text-sm text-gray-500 mt-0.5">
                  When: {triggerLabels[workflow.triggerType] || workflow.triggerType}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={workflow.isActive}
                  onCheckedChange={onToggleActive}
                  disabled={isToggling}
                />
              </div>
            </div>

            {/* Quick Info */}
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <GitBranch className="w-3 h-3" />
                {workflow.actions.length} action{workflow.actions.length !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1">
                <Activity className="w-3 h-3" />
                {workflow._count.executions} runs
              </span>
              {workflow.cooldownMinutes > 0 && (
                <span className="flex items-center gap-1">
                  <Timer className="w-3 h-3" />
                  {workflow.cooldownMinutes}m cooldown
                </span>
              )}
              {workflow.isSystem && (
                <Badge variant="outline" className="text-xs">
                  System
                </Badge>
              )}
            </div>

            {/* Expand Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onToggleExpand}
              className="mt-2 -ml-2 text-xs text-gray-500 hover:text-gray-700"
            >
              {expanded ? (
                <>
                  <ChevronDown className="w-4 h-4 mr-1" />
                  Hide Actions
                </>
              ) : (
                <>
                  <ChevronRight className="w-4 h-4 mr-1" />
                  Show Actions
                </>
              )}
            </Button>

            {/* Expanded Actions */}
            {expanded && (
              <div className="mt-3 space-y-2 pl-2 border-l-2 border-gray-200">
                {workflow.actions.map((action, index) => {
                  const Icon = actionIcons[action.actionType] || Zap;
                  return (
                    <div
                      key={action.id}
                      className="flex items-center gap-3 py-2 text-sm"
                    >
                      <div className="w-6 h-6 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Icon className="w-3 h-3 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-gray-700">
                          {action.actionType.replace(/_/g, " ")}
                        </span>
                        {action.delayMinutes > 0 && (
                          <span className="text-gray-400 ml-2">
                            (after {action.delayMinutes}m)
                          </span>
                        )}
                      </div>
                      {index < workflow.actions.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-gray-300" />
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
