"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Ticket, Clock, AlertTriangle, CheckCircle2, MessageSquare,
    TrendingUp, RefreshCcw, ExternalLink, Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CustomerCareStats {
    currentOpen: number;
    awaitingReply: number;
    answeredToday: number;
    closedToday: number;
    avgResponseTime: number;
    slaBreaches: number;
    urgentCount: number;
    categoryBreakdown: Record<string, number>;
}

export function CustomerCareKPIWidget() {
    const [stats, setStats] = useState<CustomerCareStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/admin/customer-care-stats");
            const data = await res.json();
            if (data.stats) {
                setStats(data.stats);
                setLastUpdated(new Date());
            }
        } catch (error) {
            console.error("Failed to fetch customer care stats:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        // Refresh every 5 minutes
        const interval = setInterval(fetchStats, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (loading && !stats) {
        return (
            <Card className="col-span-full lg:col-span-2">
                <CardContent className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-[#722F37]" />
                </CardContent>
            </Card>
        );
    }

    if (!stats) return null;

    const topCategories = Object.entries(stats.categoryBreakdown || {})
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4);

    return (
        <Card className="col-span-full lg:col-span-2 bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Ticket className="w-5 h-5 text-[#722F37]" />
                        Customer Care Dashboard
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={fetchStats}
                            disabled={loading}
                            className="h-8 px-2"
                        >
                            <RefreshCcw className={cn("w-4 h-4", loading && "animate-spin")} />
                        </Button>
                        <Link href="/support">
                            <Button variant="outline" size="sm" className="h-8 gap-1">
                                <ExternalLink className="w-3 h-3" />
                                Open Inbox
                            </Button>
                        </Link>
                    </div>
                </div>
                {lastUpdated && (
                    <p className="text-xs text-slate-500">
                        Last updated: {lastUpdated.toLocaleTimeString()}
                    </p>
                )}
            </CardHeader>

            <CardContent className="space-y-4">
                {/* SLA Alert */}
                {stats.slaBreaches > 0 && (
                    <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                        <span className="text-sm font-medium">
                            {stats.slaBreaches} ticket{stats.slaBreaches > 1 ? 's' : ''} waiting &gt;24h for response!
                        </span>
                    </div>
                )}

                {/* Main Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {/* Open Tickets */}
                    <div className="bg-white rounded-lg border p-3 text-center">
                        <div className="text-2xl font-bold text-slate-900">{stats.currentOpen}</div>
                        <div className="text-xs text-slate-500 uppercase">Open</div>
                    </div>

                    {/* Awaiting Reply */}
                    <div className={cn(
                        "rounded-lg border p-3 text-center",
                        stats.awaitingReply > 5 ? "bg-amber-50 border-amber-200" : "bg-white"
                    )}>
                        <div className={cn(
                            "text-2xl font-bold",
                            stats.awaitingReply > 5 ? "text-amber-600" : "text-slate-900"
                        )}>
                            {stats.awaitingReply}
                        </div>
                        <div className="text-xs text-slate-500 uppercase">Awaiting Reply</div>
                    </div>

                    {/* Answered Today */}
                    <div className="bg-white rounded-lg border p-3 text-center">
                        <div className="text-2xl font-bold text-emerald-600">{stats.answeredToday}</div>
                        <div className="text-xs text-slate-500 uppercase">Answered Today</div>
                    </div>

                    {/* Closed Today */}
                    <div className="bg-white rounded-lg border p-3 text-center">
                        <div className="text-2xl font-bold text-purple-600">{stats.closedToday}</div>
                        <div className="text-xs text-slate-500 uppercase">Closed Today</div>
                    </div>
                </div>

                {/* Secondary Stats Row */}
                <div className="flex items-center justify-between text-sm border-t pt-3">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span className="text-slate-600">Avg Response:</span>
                            <span className="font-semibold">{stats.avgResponseTime}h</span>
                        </div>
                        {stats.urgentCount > 0 && (
                            <div className="flex items-center gap-1.5">
                                <AlertTriangle className="w-4 h-4 text-red-500" />
                                <span className="text-red-600 font-semibold">{stats.urgentCount} Urgent</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Category Breakdown */}
                {topCategories.length > 0 && (
                    <div className="border-t pt-3">
                        <div className="text-xs text-slate-500 uppercase mb-2">By Category</div>
                        <div className="flex flex-wrap gap-2">
                            {topCategories.map(([category, count]) => (
                                <Badge
                                    key={category}
                                    variant="secondary"
                                    className={cn(
                                        "text-xs",
                                        category === "Refund" && "bg-red-100 text-red-700",
                                        category === "Access" && "bg-purple-100 text-purple-700",
                                        category === "Billing" && "bg-amber-100 text-amber-700",
                                        category === "Certificate" && "bg-green-100 text-green-700",
                                        category === "Technical" && "bg-blue-100 text-blue-700"
                                    )}
                                >
                                    {category}: {count}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
