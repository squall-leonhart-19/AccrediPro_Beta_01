import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Megaphone,
  Bell,
  Sparkles,
  BookOpen,
  Award,
  Gift,
  ChevronRight,
  Calendar,
} from "lucide-react";

// Sample announcements - in production these would come from database
const announcements = [
  {
    id: "1",
    title: "New Course Released: Advanced Hormone Health",
    description: "We're excited to announce our newest certification course covering advanced hormone health protocols, testing interpretation, and client management strategies.",
    type: "NEW_COURSE",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    isNew: true,
    link: "/courses",
  },
  {
    id: "2",
    title: "Platform Update: New Learning Features",
    description: "We've added new features including progress tracking improvements, lesson bookmarks, and enhanced note-taking capabilities. Explore the updated dashboard today!",
    type: "UPDATE",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    isNew: true,
    link: null,
  },
  {
    id: "3",
    title: "Holiday Scholarship Program Now Open",
    description: "Apply for our annual scholarship program. We're offering 5 full scholarships for the Functional Medicine Certification. Applications close December 31st.",
    type: "SCHOLARSHIP",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    isNew: false,
    link: null,
  },
  {
    id: "4",
    title: "Success Story: Meet Our Graduate Jessica",
    description: "Jessica completed her certification last month and has already launched her successful coaching practice. Read her inspiring journey and tips for new coaches.",
    type: "SUCCESS_STORY",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    isNew: false,
    link: null,
  },
  {
    id: "5",
    title: "Upcoming Live Event: Annual Summit",
    description: "Save the date for our biggest event of the year! Join industry experts, network with fellow coaches, and gain exclusive insights. Early bird registration now open.",
    type: "EVENT",
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    isNew: false,
    link: "/events",
  },
];

const typeConfig: Record<string, { icon: typeof Megaphone; color: string; bg: string; label: string }> = {
  NEW_COURSE: { icon: BookOpen, color: "text-burgundy-600", bg: "bg-burgundy-100", label: "New Course" },
  UPDATE: { icon: Sparkles, color: "text-purple-600", bg: "bg-purple-100", label: "Platform Update" },
  SCHOLARSHIP: { icon: Gift, color: "text-gold-600", bg: "bg-gold-100", label: "Scholarship" },
  SUCCESS_STORY: { icon: Award, color: "text-green-600", bg: "bg-green-100", label: "Success Story" },
  EVENT: { icon: Calendar, color: "text-blue-600", bg: "bg-blue-100", label: "Event" },
};

export default async function AnnouncementsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const newCount = announcements.filter((a) => a.isNew).length;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header */}
      <Card className="bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 border-0 overflow-hidden relative">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold-400 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        </div>
        <CardContent className="p-8 relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Megaphone className="w-7 h-7 text-gold-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Announcements</h1>
              <p className="text-burgundy-200">Stay informed with the latest updates</p>
            </div>
            {newCount > 0 && (
              <Badge className="bg-gold-400 text-burgundy-900 ml-auto">
                {newCount} new
              </Badge>
            )}
          </div>
          <p className="text-burgundy-100 max-w-2xl">
            Stay informed with important updates, new course releases, platform enhancements,
            scholarships, success stories, and special opportunities.
          </p>
        </CardContent>
      </Card>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((announcement) => {
          const config = typeConfig[announcement.type] || typeConfig.UPDATE;
          const Icon = config.icon;

          return (
            <Card
              key={announcement.id}
              className={`card-premium transition-colors ${
                announcement.isNew ? "border-gold-200 bg-gold-50/30" : ""
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-6 h-6 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={`${config.bg} ${config.color} border-0`}>
                        {config.label}
                      </Badge>
                      {announcement.isNew && (
                        <Badge className="bg-gold-400 text-burgundy-900 text-xs">NEW</Badge>
                      )}
                      <span className="text-xs text-gray-400 ml-auto">
                        {formatDate(announcement.date)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{announcement.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{announcement.description}</p>
                    {announcement.link && (
                      <a
                        href={announcement.link}
                        className="inline-flex items-center gap-1 text-sm font-medium text-burgundy-600 hover:text-burgundy-700 mt-3"
                      >
                        Learn more
                        <ChevronRight className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Notification Preferences */}
      <Card className="card-premium">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center">
              <Bell className="w-6 h-6 text-gray-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">Notification Settings</h3>
              <p className="text-sm text-gray-500">
                Manage how you receive announcements and updates
              </p>
            </div>
            <a
              href="/profile"
              className="text-sm font-medium text-burgundy-600 hover:text-burgundy-700"
            >
              Manage preferences
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
