"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Users,
    TrendingUp,
    Clock,
    Calendar,
    AlertCircle,
    Mail,
    Trash2,
} from "lucide-react";

interface AnalyticsData {
    totalLeads: number;
    leadsWithEmail: number;
    leadsWithoutEmail: number;
    converted: number;
    conversionRate: number;
    pendingReplies: number;
    avgResponseTimeMin: number;
    todayChats: number;
}

interface Props {
    onCleanup?: () => Promise<void>;
    cleaningLeads?: boolean;
}

export function ChatAnalyticsCards({ onCleanup, cleaningLeads }: Props) {
    const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAnalytics() {
            try {
                const res = await fetch("/api/admin/chat-analytics/conversion");
                const data = await res.json();
                setAnalytics(data);
            } catch (error) {
                console.error("Failed to fetch analytics:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchAnalytics();
        // Refresh every 30 seconds
        const interval = setInterval(fetchAnalytics, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
                {[...Array(7)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg border border-gray-200 p-3 animate-pulse">
                        <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-7 bg-gray-200 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!analytics) return null;

    const cards = [
        {
            title: "Chat Leads",
            value: analytics.leadsWithEmail,
            subtitle: `${analytics.totalLeads} total`,
            icon: Mail,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Converted",
            value: analytics.converted,
            icon: TrendingUp,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Conversion",
            value: `${analytics.conversionRate}%`,
            subtitle: "of leads w/ email",
            icon: TrendingUp,
            color: analytics.conversionRate >= 10 ? "text-green-600" : "text-yellow-600",
            bgColor: analytics.conversionRate >= 10 ? "bg-green-50" : "bg-yellow-50",
        },
        {
            title: "Pending",
            value: analytics.pendingReplies,
            icon: AlertCircle,
            color: analytics.pendingReplies > 0 ? "text-red-600" : "text-gray-500",
            bgColor: analytics.pendingReplies > 0 ? "bg-red-50" : "bg-gray-50",
            highlight: analytics.pendingReplies > 0,
        },
        {
            title: "Avg Response",
            value: analytics.avgResponseTimeMin > 0
                ? `${analytics.avgResponseTimeMin}m`
                : "N/A",
            icon: Clock,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            title: "Today",
            value: analytics.todayChats,
            icon: Calendar,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50",
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
            {cards.map((card, idx) => {
                const Icon = card.icon;
                return (
                    <div
                        key={idx}
                        className={`bg-white rounded-lg border ${card.highlight ? "border-red-300 shadow-sm" : "border-gray-200"
                            } p-3 hover:shadow-md transition-shadow`}
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-medium text-gray-500 uppercase tracking-wide">
                                {card.title}
                            </span>
                            <div className={`${card.bgColor} p-1 rounded`}>
                                <Icon className={`w-3.5 h-3.5 ${card.color}`} />
                            </div>
                        </div>
                        <div className={`text-xl font-bold ${card.color}`}>
                            {card.value}
                        </div>
                        {card.subtitle && (
                            <div className="text-[10px] text-gray-400 mt-0.5">
                                {card.subtitle}
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Cleanup Card */}
            {analytics.leadsWithoutEmail > 0 && onCleanup && (
                <div className="bg-amber-50 rounded-lg border border-amber-200 p-3 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-medium text-amber-700 uppercase tracking-wide">
                            No Email
                        </span>
                        <div className="bg-amber-100 p-1 rounded">
                            <Users className="w-3.5 h-3.5 text-amber-600" />
                        </div>
                    </div>
                    <div className="text-xl font-bold text-amber-600">
                        {analytics.leadsWithoutEmail}
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onCleanup}
                        disabled={cleaningLeads}
                        className="text-[10px] h-5 px-1.5 mt-1 text-red-600 hover:text-red-700 hover:bg-red-50 p-0"
                    >
                        <Trash2 className="w-3 h-3 mr-1" />
                        {cleaningLeads ? "..." : "Remove"}
                    </Button>
                </div>
            )}
        </div>
    );
}
