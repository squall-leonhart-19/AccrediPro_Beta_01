import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Tag,
  Users,
  Workflow,
  TrendingUp,
  Mail,
  BookOpen,
  Target,
  Sparkles,
  Activity,
  Heart,
  Leaf,
  Brain,
} from "lucide-react";

// Define tag types and their workflows
const TAG_WORKFLOWS: Record<string, {
  name: string;
  description: string;
  workflow: string;
  icon: typeof Tag;
  color: string;
  emailSequence: string[];
}> = {
  "lead:functional-medicine": {
    name: "Functional Medicine Lead",
    description: "Users who opted in via Functional Medicine mini diploma",
    workflow: "Functional Medicine Nurture Sequence",
    icon: Brain,
    color: "bg-blue-100 text-blue-700 border-blue-200",
    emailSequence: [
      "Welcome + Login Credentials",
      "Day 2: Your Personalized Roadmap",
      "Day 4: Meet Your Mentor",
      "Day 7: Step 1 Benefits Overview",
    ],
  },
  "lead:health-coach": {
    name: "Health Coach Lead",
    description: "Users who opted in via Health Coach mini diploma",
    workflow: "Health Coach Nurture Sequence",
    icon: Heart,
    color: "bg-green-100 text-green-700 border-green-200",
    emailSequence: [
      "Welcome + Login Credentials",
      "Day 2: Health Coach Career Path",
      "Day 4: Client Success Stories",
      "Day 7: Certification Benefits",
    ],
  },
  "lead:menopause": {
    name: "Menopause Specialist Lead",
    description: "Users who opted in via Menopause mini diploma",
    workflow: "Menopause Specialist Nurture Sequence",
    icon: Sparkles,
    color: "bg-pink-100 text-pink-700 border-pink-200",
    emailSequence: [
      "Welcome + Login Credentials",
      "Day 2: Why Menopause Expertise Matters",
      "Day 4: Growing Demand in This Niche",
      "Day 7: Your Path to Specialization",
    ],
  },
  "lead:gut-health": {
    name: "Gut Health Lead",
    description: "Users who opted in via Gut Health mini diploma",
    workflow: "Gut Health Nurture Sequence",
    icon: Activity,
    color: "bg-teal-100 text-teal-700 border-teal-200",
    emailSequence: [
      "Welcome + Login Credentials",
      "Day 2: Gut-Brain Connection Basics",
      "Day 4: Client Transformation Stories",
      "Day 7: Advanced Training Preview",
    ],
  },
  "lead:womens-health": {
    name: "Women's Health Lead",
    description: "Users who opted in via Women's Health mini diploma",
    workflow: "Women's Health Nurture Sequence",
    icon: Leaf,
    color: "bg-rose-100 text-rose-700 border-rose-200",
    emailSequence: [
      "Welcome + Login Credentials",
      "Day 2: Women's Health Market Opportunity",
      "Day 4: Holistic Approach Benefits",
      "Day 7: Certification Path Overview",
    ],
  },
};

// Other tag types
const OTHER_TAG_TYPES = [
  {
    prefix: "interest:",
    name: "Interest Tags",
    description: "Tracks user interests based on content interaction",
    color: "bg-purple-100 text-purple-700 border-purple-200",
  },
  {
    prefix: "completed:",
    name: "Completion Tags",
    description: "Tracks completed courses and milestones",
    color: "bg-gold-100 text-gold-700 border-gold-200",
  },
  {
    prefix: "behavior:",
    name: "Behavior Tags",
    description: "Tracks user behavior patterns",
    color: "bg-orange-100 text-orange-700 border-orange-200",
  },
];

async function getTagStats() {
  // Get all tags with user counts
  const tagCounts = await prisma.userTag.groupBy({
    by: ["tag"],
    _count: {
      userId: true,
    },
    orderBy: {
      _count: {
        userId: "desc",
      },
    },
  });

  // Get recent tag assignments
  const recentTags = await prisma.userTag.findMany({
    take: 10,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  // Get total users with tags
  const usersWithTags = await prisma.user.count({
    where: {
      tags: {
        some: {},
      },
    },
  });

  const totalUsers = await prisma.user.count();

  return {
    tagCounts,
    recentTags,
    usersWithTags,
    totalUsers,
  };
}

export default async function AdminTagsPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  const { tagCounts, recentTags, usersWithTags, totalUsers } = await getTagStats();

  // Categorize tags
  const leadTags = tagCounts.filter((t) => t.tag.startsWith("lead:"));
  const interestTags = tagCounts.filter((t) => t.tag.startsWith("interest:"));
  const completedTags = tagCounts.filter((t) => t.tag.startsWith("completed:"));
  const otherTags = tagCounts.filter(
    (t) => !t.tag.startsWith("lead:") && !t.tag.startsWith("interest:") && !t.tag.startsWith("completed:")
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tags & Workflows</h1>
          <p className="text-gray-500">Manage user segmentation and automated workflows</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
                <Tag className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{tagCounts.length}</p>
                <p className="text-sm text-gray-500">Unique Tags</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{usersWithTags}</p>
                <p className="text-sm text-gray-500">Tagged Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{Math.round((usersWithTags / totalUsers) * 100)}%</p>
                <p className="text-sm text-gray-500">Tag Coverage</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gold-100 flex items-center justify-center">
                <Workflow className="w-5 h-5 text-gold-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{Object.keys(TAG_WORKFLOWS).length}</p>
                <p className="text-sm text-gray-500">Active Workflows</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead Tags with Workflows */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            Lead Tags & Workflows
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(TAG_WORKFLOWS).map(([tagKey, config]) => {
              const tagData = leadTags.find((t) => t.tag === tagKey);
              const userCount = tagData?._count.userId || 0;
              const IconComponent = config.icon;

              return (
                <div key={tagKey} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.color.split(" ")[0]}`}>
                        <IconComponent className={`w-6 h-6 ${config.color.split(" ")[1]}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{config.name}</h3>
                          <Badge className={config.color}>{tagKey}</Badge>
                        </div>
                        <p className="text-sm text-gray-500 mb-2">{config.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span className="flex items-center gap-1 text-blue-600">
                            <Users className="w-4 h-4" />
                            {userCount} users
                          </span>
                          <span className="flex items-center gap-1 text-green-600">
                            <Workflow className="w-4 h-4" />
                            {config.workflow}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Active
                      </Badge>
                    </div>
                  </div>

                  {/* Email Sequence Preview */}
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs font-medium text-gray-500 mb-2">EMAIL SEQUENCE</p>
                    <div className="flex flex-wrap gap-2">
                      {config.emailSequence.map((email, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {i + 1}. {email}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Show any lead tags not in workflow config */}
            {leadTags
              .filter((t) => !TAG_WORKFLOWS[t.tag])
              .map((tag) => (
                <div key={tag.tag} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center">
                        <Tag className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <Badge className="bg-blue-100 text-blue-700 border-blue-200">{tag.tag}</Badge>
                        <p className="text-sm text-gray-500 mt-1">{tag._count.userId} users</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      No Workflow
                    </Badge>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Other Tag Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Interest Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="w-5 h-5 text-purple-600" />
              Interest Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            {interestTags.length > 0 ? (
              <div className="space-y-2">
                {interestTags.map((tag) => (
                  <div key={tag.tag} className="flex items-center justify-between p-2 bg-purple-50 rounded-lg">
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200">{tag.tag}</Badge>
                    <span className="text-sm text-gray-600">{tag._count.userId} users</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No interest tags yet</p>
            )}
          </CardContent>
        </Card>

        {/* Completion Tags */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BookOpen className="w-5 h-5 text-gold-600" />
              Completion Tags
            </CardTitle>
          </CardHeader>
          <CardContent>
            {completedTags.length > 0 ? (
              <div className="space-y-2">
                {completedTags.map((tag) => (
                  <div key={tag.tag} className="flex items-center justify-between p-2 bg-gold-50 rounded-lg">
                    <Badge className="bg-gold-100 text-gold-700 border-gold-200">{tag.tag}</Badge>
                    <span className="text-sm text-gray-600">{tag._count.userId} users</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No completion tags yet</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Tag Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            Recent Tag Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTags.map((tagAssignment) => (
              <div key={tagAssignment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-burgundy-100 flex items-center justify-center text-sm font-medium text-burgundy-700">
                    {tagAssignment.user.firstName?.charAt(0) || "U"}
                    {tagAssignment.user.lastName?.charAt(0) || ""}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {tagAssignment.user.firstName} {tagAssignment.user.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{tagAssignment.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    className={
                      tagAssignment.tag.startsWith("lead:")
                        ? "bg-blue-100 text-blue-700 border-blue-200"
                        : tagAssignment.tag.startsWith("interest:")
                        ? "bg-purple-100 text-purple-700 border-purple-200"
                        : tagAssignment.tag.startsWith("completed:")
                        ? "bg-gold-100 text-gold-700 border-gold-200"
                        : "bg-gray-100 text-gray-700 border-gray-200"
                    }
                  >
                    {tagAssignment.tag}
                  </Badge>
                  <span className="text-xs text-gray-500">
                    {new Date(tagAssignment.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
            {recentTags.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">No tag activity yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tag System Documentation */}
      <Card className="bg-gradient-to-br from-burgundy-50 to-gold-50 border-burgundy-200">
        <CardContent className="p-6">
          <h3 className="font-semibold text-burgundy-800 mb-3">How Tags Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white/80 rounded-lg p-4">
              <p className="font-medium text-blue-700 mb-1">Lead Tags (lead:*)</p>
              <p className="text-gray-600">Assigned when users opt-in via mini diploma forms. Triggers nurture email sequences and personalizes their roadmap.</p>
            </div>
            <div className="bg-white/80 rounded-lg p-4">
              <p className="font-medium text-purple-700 mb-1">Interest Tags (interest:*)</p>
              <p className="text-gray-600">Assigned based on content interaction, course views, and engagement patterns. Used for targeting.</p>
            </div>
            <div className="bg-white/80 rounded-lg p-4">
              <p className="font-medium text-gold-700 mb-1">Completion Tags (completed:*)</p>
              <p className="text-gray-600">Assigned when users complete courses or milestones. Unlocks next steps and triggers celebration emails.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
