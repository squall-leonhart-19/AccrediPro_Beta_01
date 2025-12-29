"use client";

import { useEffect, useState } from "react";
import {
    Users,
    TrendingUp,
    Clock,
    MessageSquare,
    Calendar,
    AlertCircle
} from "lucide-react";

interface AnalyticsData {
    totalLeads: number;
    converted: number;
    conversionRate: number;
    pendingReplies: number;
    avgResponseTimeMin: number;
    todayChats: number;
}

export function ChatAnalyticsCards() {
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
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                {[...Array(6)].map((_, i) => (
                    <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    if (!analytics) return null;

    const cards = [
        {
            title: "Total Leads",
            value: analytics.totalLeads,
            icon: Users,
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
            title: "Conversion Rate",
            value: `${analytics.conversionRate}%`,
            icon: TrendingUp,
            color: analytics.conversionRate >= 15 ? "text-green-600" : "text-yellow-600",
            bgColor: analytics.conversionRate >= 15 ? "bg-green-50" : "bg-yellow-50",
        },
        {
            title: "Pending Replies",
            value: analytics.pendingReplies,
            icon: AlertCircle,
            color: analytics.pendingReplies > 0 ? "text-red-600" : "text-gray-600",
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
            title: "Today's Chats",
            value: analytics.todayChats,
            icon: Calendar,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
            {cards.map((card, idx) => {
                const Icon = card.icon;
                return (
                    <div
                        key={idx}
                        className={`bg-white rounded-lg border ${card.highlight ? "border-red-300 shadow-sm" : "border-gray-200"
                            } p-4 hover:shadow-md transition-shadow`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                                {card.title}
                            </span>
                            <div className={`${card.bgColor} p-1.5 rounded-md`}>
                                <Icon className={`w-4 h-4 ${card.color}`} />
                            </div>
                        </div>
                        <div className={`text-2xl font-bold ${card.color}`}>
                            {card.value}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
