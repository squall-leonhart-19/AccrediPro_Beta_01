"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Users,
    MessageSquare,
    Heart,
    MousePointer,
    TrendingUp,
    Calendar,
    Eye,
    RefreshCw,
    BookOpen,
    AlertTriangle
} from "lucide-react";
import Link from "next/link";

type AnalyticsData = {
    summary: {
        totalVisits: number;
        totalMessages: number;
        totalReactions: number;
        totalDfyClicks: number;
        totalEducationalViews: number;
        uniqueUsers: number;
        period: string;
    };
    dailyChart: Array<{
        date: string;
        visits: number;
        messages: number;
        reactions: number;
        uniqueUsers: number;
    }>;
    dayDistribution: Record<string, number>;
    topUsers: Array<{
        id: string;
        name: string;
        email: string;
        events: number;
        messages: number;
        reactions: number;
    }>;
    recentActivity: Array<{
        id: string;
        eventType: string;
        userName: string;
        email: string;
        metadata: any;
        createdAt: string;
    }>;
};

type AlertsData = {
    alerts: Array<{
        id: string;
        name: string;
        email: string;
        enrolledAt: string;
        daysSinceEnrollment: number;
        lastEngagement: string | null;
        daysSinceLastEngagement: number | null;
        messageCount: number;
        alertType: "never_engaged" | "inactive_7_days" | "at_risk_3_days" | "no_messages";
        severity: "high" | "medium" | "low";
    }>;
    summary: {
        totalFmUsers: number;
        atRisk: number;
        inactive: number;
        neverEngaged: number;
        noMessages: number;
    };
};

export default function PodAnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [alerts, setAlerts] = useState<AlertsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(14);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [analyticsRes, alertsRes] = await Promise.all([
                fetch(`/api/admin/pod/analytics?days=${days}`),
                fetch("/api/admin/pod/alerts"),
            ]);
            const analyticsJson = await analyticsRes.json();
            const alertsJson = await alertsRes.json();
            setData(analyticsJson);
            if (alertsJson.alerts) {
                setAlerts(alertsJson);
            }
        } catch (error) {
            console.error("Failed to fetch analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [days]);

    const formatEventType = (type: string) => {
        const icons: Record<string, string> = {
            visit: "👁️",
            message: "💬",
            reaction: "❤️",
            dfy_click: "🎯",
            educational_view: "📚",
            milestone: "🏆",
        };
        return `${icons[type] || "📊"} ${type.replace("_", " ")}`;
    };

    if (loading && !data) {
        return (
            <div className="p-8 flex items-center justify-center min-h-[400px]">
                <RefreshCw className="w-8 h-8 animate-spin text-burgundy-600" />
            </div>
        );
    }

    // Handle API error or missing data
    const summary = data?.summary || {
        totalVisits: 0,
        totalMessages: 0,
        totalReactions: 0,
        totalDfyClicks: 0,
        totalEducationalViews: 0,
        uniqueUsers: 0,
        period: `Last ${days} days`,
    };

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">My Circle Analytics</h1>
                    <p className="text-slate-600 mt-1">Track engagement in the Private Accountability Group</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={days === 7 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDays(7)}
                    >
                        7 Days
                    </Button>
                    <Button
                        variant={days === 14 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDays(14)}
                    >
                        14 Days
                    </Button>
                    <Button
                        variant={days === 30 ? "default" : "outline"}
                        size="sm"
                        onClick={() => setDays(30)}
                    >
                        30 Days
                    </Button>
                    <Button variant="ghost" size="sm" onClick={fetchData} disabled={loading}>
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    </Button>
                    <Link href="/admin/pod-messages">
                        <Button variant="outline" size="sm">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            View Messages
                        </Button>
                    </Link>
                </div>
            </div>

            {/* At-Risk Users Alert */}
            {alerts && alerts.alerts.length > 0 && (
                <Card className="border-red-200 bg-gradient-to-br from-red-50 to-orange-50">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-red-700">
                            <AlertTriangle className="w-5 h-5" />
                            At-Risk Users ({alerts.summary.atRisk} high priority)
                        </CardTitle>
                        <CardDescription>
                            Users who need attention • {alerts.summary.neverEngaged} never visited • {alerts.summary.inactive} inactive 7+ days
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2 max-h-[250px] overflow-y-auto">
                            {alerts.alerts.slice(0, 10).map((alert) => (
                                <div
                                    key={alert.id}
                                    className={`flex items-center gap-3 p-3 rounded-lg ${alert.severity === "high"
                                        ? "bg-red-100 border border-red-200"
                                        : alert.severity === "medium"
                                            ? "bg-orange-100 border border-orange-200"
                                            : "bg-yellow-50 border border-yellow-200"
                                        }`}
                                >
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-900 truncate">{alert.name}</p>
                                        <p className="text-xs text-slate-500 truncate">{alert.email}</p>
                                    </div>
                                    <div className="text-right">
                                        <Badge
                                            variant="outline"
                                            className={
                                                alert.severity === "high"
                                                    ? "border-red-300 text-red-700 bg-red-50"
                                                    : alert.severity === "medium"
                                                        ? "border-orange-300 text-orange-700 bg-orange-50"
                                                        : "border-yellow-300 text-yellow-700 bg-yellow-50"
                                            }
                                        >
                                            {alert.alertType === "never_engaged"
                                                ? "Never visited"
                                                : alert.alertType === "inactive_7_days"
                                                    ? `Inactive ${alert.daysSinceLastEngagement}d`
                                                    : alert.alertType === "at_risk_3_days"
                                                        ? `${alert.daysSinceLastEngagement}d ago`
                                                        : "No messages"}
                                        </Badge>
                                        <p className="text-xs text-slate-400 mt-1">
                                            Day {alert.daysSinceEnrollment} • {alert.messageCount} msgs
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {alerts.alerts.length > 10 && (
                            <p className="text-center text-sm text-slate-500 mt-3">
                                +{alerts.alerts.length - 10} more users need attention
                            </p>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
                <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-blue-600 mb-2">
                            <Eye className="w-5 h-5" />
                            <span className="text-sm font-medium">Visits</span>
                        </div>
                        <p className="text-3xl font-bold text-blue-900">{summary.totalVisits}</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-green-600 mb-2">
                            <Users className="w-5 h-5" />
                            <span className="text-sm font-medium">Users</span>
                        </div>
                        <p className="text-3xl font-bold text-green-900">{summary.uniqueUsers}</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-purple-600 mb-2">
                            <MessageSquare className="w-5 h-5" />
                            <span className="text-sm font-medium">Messages</span>
                        </div>
                        <p className="text-3xl font-bold text-purple-900">{summary.totalMessages}</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-pink-50 to-pink-100 border-pink-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-pink-600 mb-2">
                            <Heart className="w-5 h-5" />
                            <span className="text-sm font-medium">Reactions</span>
                        </div>
                        <p className="text-3xl font-bold text-pink-900">{summary.totalReactions}</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-orange-600 mb-2">
                            <MousePointer className="w-5 h-5" />
                            <span className="text-sm font-medium">DFY Clicks</span>
                        </div>
                        <p className="text-3xl font-bold text-orange-900">{summary.totalDfyClicks}</p>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-2 text-teal-600 mb-2">
                            <BookOpen className="w-5 h-5" />
                            <span className="text-sm font-medium">Edu Views</span>
                        </div>
                        <p className="text-3xl font-bold text-teal-900">{summary.totalEducationalViews}</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Daily Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-burgundy-600" />
                            Daily Engagement
                        </CardTitle>
                        <CardDescription>Visits and interactions per day</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {data?.dailyChart && data.dailyChart.length > 0 ? (
                            <div className="space-y-2">
                                {data.dailyChart.slice(-10).map((day) => (
                                    <div key={day.date} className="flex items-center gap-2 text-sm">
                                        <span className="w-20 text-slate-500 font-mono text-xs">
                                            {new Date(day.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                        </span>
                                        <div className="flex-1 flex gap-1">
                                            <div
                                                className="h-6 bg-blue-400 rounded"
                                                style={{ width: `${Math.min(day.visits * 5, 100)}%` }}
                                                title={`${day.visits} visits`}
                                            />
                                        </div>
                                        <div className="flex gap-2 text-xs text-slate-600">
                                            <span>👁️{day.visits}</span>
                                            <span>💬{day.messages}</span>
                                            <span>❤️{day.reactions}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-center py-8">No data yet. Users will start generating data when they visit My Circle.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Day Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-burgundy-600" />
                            Journey Distribution
                        </CardTitle>
                        <CardDescription>Where are users in their pod journey?</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {data?.dayDistribution && Object.keys(data.dayDistribution).length > 0 ? (
                            <div className="space-y-2">
                                {Object.entries(data.dayDistribution)
                                    .sort((a, b) => {
                                        const dayA = parseInt(a[0].replace("Day ", ""));
                                        const dayB = parseInt(b[0].replace("Day ", ""));
                                        return dayA - dayB;
                                    })
                                    .slice(0, 15)
                                    .map(([day, count]) => (
                                        <div key={day} className="flex items-center gap-2 text-sm">
                                            <span className="w-16 text-slate-600 font-medium">{day}</span>
                                            <div className="flex-1 bg-slate-100 rounded-full h-4 overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-burgundy-500 to-burgundy-600 rounded-full"
                                                    style={{ width: `${Math.min((count / (summary.totalVisits || 1)) * 300, 100)}%` }}
                                                />
                                            </div>
                                            <span className="w-12 text-right text-slate-500">{count}</span>
                                        </div>
                                    ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-center py-8">No journey data yet.</p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                {/* Top Users */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-burgundy-600" />
                            Most Engaged Users
                        </CardTitle>
                        <CardDescription>Top 10 by total interactions</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {data?.topUsers && data.topUsers.length > 0 ? (
                            <div className="space-y-3">
                                {data.topUsers.map((user, index) => (
                                    <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50">
                                        <div className="w-8 h-8 rounded-full bg-burgundy-100 flex items-center justify-center text-burgundy-700 font-bold text-sm">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-slate-900 truncate">{user.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Badge variant="secondary" className="text-xs">
                                                💬 {user.messages}
                                            </Badge>
                                            <Badge variant="secondary" className="text-xs">
                                                ❤️ {user.reactions}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-center py-8">No user engagement yet.</p>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-burgundy-600" />
                            Recent Activity
                        </CardTitle>
                        <CardDescription>Latest engagement events</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {data?.recentActivity && data.recentActivity.length > 0 ? (
                            <div className="space-y-2 max-h-[400px] overflow-y-auto">
                                {data.recentActivity.slice(0, 20).map((activity) => (
                                    <div key={activity.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 text-sm">
                                        <span className="text-lg">{formatEventType(activity.eventType).split(" ")[0]}</span>
                                        <div className="flex-1 min-w-0">
                                            <span className="font-medium text-slate-900">{activity.userName}</span>
                                            <span className="text-slate-500 ml-1">{activity.eventType.replace("_", " ")}</span>
                                        </div>
                                        <span className="text-xs text-slate-400">
                                            {new Date(activity.createdAt).toLocaleTimeString("en-US", {
                                                hour: "numeric",
                                                minute: "2-digit",
                                            })}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-slate-500 text-center py-8">No recent activity.</p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
