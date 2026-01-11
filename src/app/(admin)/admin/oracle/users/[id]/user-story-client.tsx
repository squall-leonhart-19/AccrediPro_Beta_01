"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import {
    ArrowLeft,
    Mail,
    MessageCircle,
    AlertTriangle,
    CheckCircle,
    Clock,
    Activity,
    Brain,
    Zap,
    BookOpen,
    Award,
    TrendingUp,
    TrendingDown,
    User,
} from "lucide-react";

interface UserData {
    user: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        avatar: string | null;
        phone: string | null;
        location: string | null;
        lastLoginAt: Date | null;
        createdAt: Date;
        hasCompletedOnboarding: boolean;
        userType: string;
        role: string;
    };
    segment: {
        engagementLevel: string;
        engagementScore: number;
        churnRisk: number;
        churnReason: string | null;
        lifecycle: string;
        completionProb: number | null;
    } | null;
    events: Array<{
        id: string;
        event: string;
        metadata: any;
        createdAt: Date;
    }>;
    actions: Array<{
        id: string;
        actionType: string;
        content: string;
        status: string;
        createdAt: Date;
        executedAt: Date | null;
    }>;
    enrollments: Array<{
        courseId: string;
        progress: number | null;
        status: string;
        course: { id: string; title: string };
    }>;
    certificates: Array<{
        id: string;
        courseId: string;
        createdAt: Date;
    }>;
}

export function UserStoryClient({ data }: { data: UserData }) {
    const { user, segment, events, actions, enrollments, certificates } = data;
    const [sending, setSending] = useState(false);

    const formatDate = (date: Date | string | null) => {
        if (!date) return "Never";
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const formatEventName = (event: string) => {
        return event.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
    };

    const getEngagementColor = (level: string) => {
        switch (level) {
            case "active": return "bg-green-100 text-green-700 border-green-200";
            case "moderate": return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "dormant": return "bg-orange-100 text-orange-700 border-orange-200";
            case "lost": return "bg-red-100 text-red-700 border-red-200";
            default: return "bg-blue-100 text-blue-700 border-blue-200";
        }
    };

    const getRiskColor = (risk: number) => {
        if (risk >= 75) return "text-red-600";
        if (risk >= 50) return "text-orange-600";
        if (risk >= 25) return "text-yellow-600";
        return "text-green-600";
    };

    const handleSendDM = async () => {
        setSending(true);
        try {
            await fetch("/api/oracle/actions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id,
                    actionType: "dm",
                    content: `Hey ${user.firstName}! Just checking in - how's everything going with your studies? Let me know if you need any help! 💚`,
                    triggeredBy: "manual_admin",
                }),
            });
            alert("DM queued!");
        } catch (error) {
            console.error(error);
        }
        setSending(false);
    };

    const initials = `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() || "U";

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Link href="/admin/oracle">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="w-5 h-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Story</h1>
                    <p className="text-gray-500">Deep dive into user journey</p>
                </div>
            </div>

            {/* Profile Card */}
            <Card className="p-6">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16 ring-2 ring-burgundy-100">
                            <AvatarImage src={user.avatar || undefined} />
                            <AvatarFallback className="bg-burgundy-100 text-burgundy-700 text-xl">
                                {initials}
                            </AvatarFallback>
                        </Avatar>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">
                                {user.firstName} {user.lastName}
                            </h2>
                            <p className="text-gray-500">{user.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-0.5 rounded-full text-xs border ${getEngagementColor(segment?.engagementLevel || "new")}`}>
                                    {segment?.engagementLevel || "New"}
                                </span>
                                <span className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600">
                                    {segment?.lifecycle || "Lead"}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={handleSendDM} disabled={sending}>
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Send DM
                        </Button>
                        <Button variant="outline" size="sm">
                            <Mail className="w-4 h-4 mr-2" />
                            Email
                        </Button>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                    <div>
                        <p className="text-sm text-gray-500">Last Login</p>
                        <p className="font-medium">{formatDate(user.lastLoginAt)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Member Since</p>
                        <p className="font-medium">{formatDate(user.createdAt)}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Courses</p>
                        <p className="font-medium">{enrollments.length}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Certificates</p>
                        <p className="font-medium">{certificates.length}</p>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Segment Analysis */}
                <Card className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Brain className="w-5 h-5 text-purple-600" />
                        Oracle Analysis
                    </h3>

                    {segment ? (
                        <div className="space-y-4">
                            {/* Engagement Score */}
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Engagement</span>
                                    <span className="font-medium">{segment.engagementScore}/100</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-green-500 rounded-full"
                                        style={{ width: `${segment.engagementScore}%` }}
                                    />
                                </div>
                            </div>

                            {/* Churn Risk */}
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Churn Risk</span>
                                    <span className={`font-medium ${getRiskColor(segment.churnRisk)}`}>
                                        {segment.churnRisk}%
                                    </span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-red-500 rounded-full"
                                        style={{ width: `${segment.churnRisk}%` }}
                                    />
                                </div>
                                {segment.churnReason && (
                                    <p className="text-xs text-orange-600 mt-1 flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" />
                                        {segment.churnReason.replace("_", " ")}
                                    </p>
                                )}
                            </div>

                            {/* Completion Probability */}
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-600">Completion Prob</span>
                                    <span className="font-medium">{segment.completionProb || 0}%</span>
                                </div>
                                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full"
                                        style={{ width: `${segment.completionProb || 0}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-sm">Not yet classified</p>
                    )}
                </Card>

                {/* Enrollments */}
                <Card className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                        Courses ({enrollments.length})
                    </h3>

                    <div className="space-y-3">
                        {enrollments.length === 0 ? (
                            <p className="text-gray-500 text-sm">No enrollments</p>
                        ) : (
                            enrollments.slice(0, 5).map((e) => (
                                <div key={e.courseId} className="flex items-center justify-between">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">{e.course.title}</p>
                                        <div className="h-1.5 bg-gray-100 rounded-full mt-1 overflow-hidden">
                                            <div
                                                className="h-full bg-burgundy-500 rounded-full"
                                                style={{ width: `${e.progress || 0}%` }}
                                            />
                                        </div>
                                    </div>
                                    <span className="text-sm text-gray-500 ml-3">{e.progress || 0}%</span>
                                </div>
                            ))
                        )}
                    </div>
                </Card>

                {/* Certificates */}
                <Card className="p-6">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Award className="w-5 h-5 text-gold-600" />
                        Certificates ({certificates.length})
                    </h3>

                    <div className="space-y-2">
                        {certificates.length === 0 ? (
                            <p className="text-gray-500 text-sm">No certificates yet</p>
                        ) : (
                            certificates.map((c) => (
                                <div key={c.id} className="flex items-center gap-2 text-sm">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span>{formatDate(c.createdAt)}</span>
                                </div>
                            ))
                        )}
                    </div>
                </Card>
            </div>

            {/* Timeline */}
            <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-green-600" />
                    Journey Timeline (Last 50 Events)
                </h3>

                <div className="relative">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />

                    <div className="space-y-4 max-h-96 overflow-y-auto">
                        {events.length === 0 ? (
                            <p className="text-gray-500 text-sm pl-10">No events tracked yet</p>
                        ) : (
                            events.map((event) => (
                                <div key={event.id} className="flex items-start gap-4 relative">
                                    <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center z-10">
                                        <Zap className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <div className="flex-1 pb-4">
                                        <p className="text-sm font-medium text-gray-900">
                                            {formatEventName(event.event)}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatDate(event.createdAt)}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </Card>

            {/* Actions History */}
            <Card className="p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-purple-600" />
                    Oracle Actions ({actions.length})
                </h3>

                <div className="space-y-3">
                    {actions.length === 0 ? (
                        <p className="text-gray-500 text-sm">No actions taken yet</p>
                    ) : (
                        actions.map((action) => (
                            <div key={action.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                <div className={`w-2 h-2 rounded-full mt-2 ${action.status === "executed" ? "bg-green-500" :
                                        action.status === "pending" ? "bg-yellow-500" :
                                            action.status === "failed" ? "bg-red-500" :
                                                "bg-gray-400"
                                    }`} />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium capitalize">{action.actionType}</span>
                                        <span className="text-xs text-gray-400">{action.status}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 truncate">{action.content}</p>
                                    <p className="text-xs text-gray-400">{formatDate(action.createdAt)}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </Card>
        </div>
    );
}
