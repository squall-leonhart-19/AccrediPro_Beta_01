"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
    Users,
    UserCheck,
    GraduationCap,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    Lightbulb,
    Target,
    Clock,
    Mail,
    Sparkles,
    RefreshCw,
    ChevronRight,
    ArrowRight,
} from "lucide-react";

interface FunnelData {
    signups: number;
    started: number;
    completed: number;
    watchedTraining: number;
    enrolled: number;
    avgTimeToComplete: number;
    avgScore: number;
    dropoffPoints: { module: string; dropRate: number }[];
    recentSignups: {
        id: string;
        name: string;
        email: string;
        signupDate: string;
        status: string;
        progress: number;
        licenseType?: string;
    }[];
    dailySignups: { date: string; count: number }[];
}

interface AIAdvice {
    insights: string[];
    recommendations: string[];
    priority: "high" | "medium" | "low";
}

export default function MiniDiplomaAnalyticsPage() {
    const [data, setData] = useState<FunnelData | null>(null);
    const [advice, setAdvice] = useState<AIAdvice | null>(null);
    const [loading, setLoading] = useState(true);
    const [adviceLoading, setAdviceLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/analytics/mini-diploma");
            if (res.ok) {
                const result = await res.json();
                setData(result);
            }
        } catch (error) {
            console.error("Failed to fetch analytics:", error);
        } finally {
            setLoading(false);
        }
    };

    const generateAdvice = async () => {
        if (!data) return;
        setAdviceLoading(true);
        try {
            const res = await fetch("/api/admin/analytics/mini-diploma/advice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                const result = await res.json();
                setAdvice(result);
            }
        } catch (error) {
            console.error("Failed to generate advice:", error);
        } finally {
            setAdviceLoading(false);
        }
    };

    const conversionRate = (from: number, to: number) => {
        if (from === 0) return 0;
        return Math.round((to / from) * 100);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <RefreshCw className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Failed to load analytics data</p>
                <Button onClick={fetchData} className="mt-4">Retry</Button>
            </div>
        );
    }

    const startRate = conversionRate(data.signups, data.started);
    const completionRate = conversionRate(data.started, data.completed);
    const trainingRate = conversionRate(data.completed, data.watchedTraining);
    const enrollRate = conversionRate(data.watchedTraining, data.enrolled);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Mini Diploma Analytics</h1>
                    <p className="text-gray-500">Funnel performance and optimization insights</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={fetchData}>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                    </Button>
                    <Button onClick={generateAdvice} disabled={adviceLoading} className="bg-burgundy-600 hover:bg-burgundy-700">
                        <Sparkles className="w-4 h-4 mr-2" />
                        {adviceLoading ? "Analyzing..." : "Get AI Advice"}
                    </Button>
                </div>
            </div>

            {/* Main Funnel */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Target className="w-5 h-5 text-burgundy-600" />
                        Conversion Funnel
                    </CardTitle>
                    <CardDescription>Lead journey from signup to enrollment</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-5 gap-4">
                        {/* Signup */}
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center mb-2">
                                <Users className="w-8 h-8 text-blue-600" />
                            </div>
                            <p className="text-3xl font-bold text-gray-900">{data.signups}</p>
                            <p className="text-sm text-gray-500">Signups</p>
                        </div>

                        <div className="flex items-center justify-center">
                            <div className="text-center">
                                <ChevronRight className="w-6 h-6 text-gray-300" />
                                <p className={`text-sm font-semibold ${startRate >= 60 ? "text-green-600" : startRate >= 40 ? "text-yellow-600" : "text-red-600"}`}>
                                    {startRate}%
                                </p>
                            </div>
                        </div>

                        {/* Started */}
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto rounded-full bg-purple-100 flex items-center justify-center mb-2">
                                <UserCheck className="w-8 h-8 text-purple-600" />
                            </div>
                            <p className="text-3xl font-bold text-gray-900">{data.started}</p>
                            <p className="text-sm text-gray-500">Started</p>
                        </div>

                        <div className="flex items-center justify-center">
                            <div className="text-center">
                                <ChevronRight className="w-6 h-6 text-gray-300" />
                                <p className={`text-sm font-semibold ${completionRate >= 50 ? "text-green-600" : completionRate >= 30 ? "text-yellow-600" : "text-red-600"}`}>
                                    {completionRate}%
                                </p>
                            </div>
                        </div>

                        {/* Completed */}
                        <div className="text-center">
                            <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-2">
                                <GraduationCap className="w-8 h-8 text-green-600" />
                            </div>
                            <p className="text-3xl font-bold text-gray-900">{data.completed}</p>
                            <p className="text-sm text-gray-500">Completed</p>
                        </div>
                    </div>

                    {/* Full funnel visualization */}
                    <div className="mt-8 space-y-3">
                        {[
                            { label: "Signups", value: data.signups, pct: 100, color: "bg-blue-500" },
                            { label: "Started Course", value: data.started, pct: startRate, color: "bg-purple-500" },
                            { label: "Completed", value: data.completed, pct: conversionRate(data.signups, data.completed), color: "bg-green-500" },
                            { label: "Watched Training", value: data.watchedTraining, pct: conversionRate(data.signups, data.watchedTraining), color: "bg-amber-500" },
                            { label: "Enrolled in Full Cert", value: data.enrolled, pct: conversionRate(data.signups, data.enrolled), color: "bg-burgundy-500" },
                        ].map((stage, i) => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-40 text-sm text-gray-600">{stage.label}</div>
                                <div className="flex-1">
                                    <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                                        <div className={`h-full ${stage.color} transition-all`} style={{ width: `${stage.pct}%` }} />
                                    </div>
                                </div>
                                <div className="w-20 text-right">
                                    <span className="font-bold">{stage.value}</span>
                                    <span className="text-gray-400 text-sm ml-1">({stage.pct}%)</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Start Rate</p>
                                <p className="text-2xl font-bold">{startRate}%</p>
                            </div>
                            {startRate < 50 ? (
                                <TrendingDown className="w-8 h-8 text-red-500" />
                            ) : (
                                <TrendingUp className="w-8 h-8 text-green-500" />
                            )}
                        </div>
                        <Progress value={startRate} className="mt-2" />
                        <p className="text-xs text-gray-400 mt-1">Target: 60%+</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Completion Rate</p>
                                <p className="text-2xl font-bold">{completionRate}%</p>
                            </div>
                            {completionRate < 40 ? (
                                <TrendingDown className="w-8 h-8 text-red-500" />
                            ) : (
                                <TrendingUp className="w-8 h-8 text-green-500" />
                            )}
                        </div>
                        <Progress value={completionRate} className="mt-2" />
                        <p className="text-xs text-gray-400 mt-1">Target: 50%+</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Avg Time to Complete</p>
                                <p className="text-2xl font-bold">{data.avgTimeToComplete}</p>
                            </div>
                            <Clock className="w-8 h-8 text-blue-500" />
                        </div>
                        <p className="text-xs text-gray-400 mt-3">days average</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Avg Quiz Score</p>
                                <p className="text-2xl font-bold">{data.avgScore}%</p>
                            </div>
                            <GraduationCap className="w-8 h-8 text-purple-500" />
                        </div>
                        <Progress value={data.avgScore} className="mt-2" />
                    </CardContent>
                </Card>
            </div>

            {/* AI Advice Panel */}
            {advice && (
                <Card className="border-2 border-burgundy-200 bg-burgundy-50/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-burgundy-800">
                            <Lightbulb className="w-5 h-5" />
                            AI Optimization Advice
                            <Badge className={advice.priority === "high" ? "bg-red-500" : advice.priority === "medium" ? "bg-yellow-500" : "bg-green-500"}>
                                {advice.priority} priority
                            </Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2">📊 Key Insights</h4>
                            <ul className="space-y-1">
                                {advice.insights.map((insight, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                        <ArrowRight className="w-4 h-4 mt-0.5 text-burgundy-500 flex-shrink-0" />
                                        {insight}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-gray-700 mb-2">💡 Recommendations</h4>
                            <ul className="space-y-1">
                                {advice.recommendations.map((rec, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                                        <Sparkles className="w-4 h-4 mt-0.5 text-amber-500 flex-shrink-0" />
                                        {rec}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Tabs for detailed views */}
            <Tabs defaultValue="dropoff" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="dropoff">Drop-off Analysis</TabsTrigger>
                    <TabsTrigger value="leads">Recent Leads</TabsTrigger>
                    <TabsTrigger value="trends">Daily Trends</TabsTrigger>
                </TabsList>

                <TabsContent value="dropoff">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                                Drop-off Points
                            </CardTitle>
                            <CardDescription>Where users are leaving the funnel</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data.dropoffPoints.map((point, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-40 text-sm font-medium">{point.module}</div>
                                        <div className="flex-1">
                                            <Progress value={point.dropRate} className="h-3" />
                                        </div>
                                        <div className="w-16 text-right">
                                            <span className={`font-bold ${point.dropRate > 30 ? "text-red-600" : point.dropRate > 15 ? "text-amber-600" : "text-green-600"}`}>
                                                {point.dropRate}%
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="leads">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Mail className="w-5 h-5 text-blue-500" />
                                Recent Signups
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {data.recentSignups.map((lead) => (
                                    <div key={lead.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-medium">{lead.name}</p>
                                            <p className="text-sm text-gray-500">{lead.email}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {lead.licenseType && (
                                                <Badge variant="outline">{lead.licenseType}</Badge>
                                            )}
                                            <Badge className={lead.status === "COMPLETED" ? "bg-green-500" : lead.status === "IN_PROGRESS" ? "bg-blue-500" : "bg-gray-500"}>
                                                {lead.status}
                                            </Badge>
                                            <div className="w-20">
                                                <Progress value={lead.progress} className="h-2" />
                                                <p className="text-xs text-gray-400 text-center">{lead.progress}%</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="trends">
                    <Card>
                        <CardHeader>
                            <CardTitle>Daily Signups (Last 14 Days)</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end h-48 gap-2">
                                {data.dailySignups.map((day, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center">
                                        <div
                                            className="w-full bg-burgundy-500 rounded-t transition-all hover:bg-burgundy-600"
                                            style={{ height: `${Math.max(4, (day.count / Math.max(...data.dailySignups.map(d => d.count))) * 160)}px` }}
                                        />
                                        <p className="text-xs text-gray-400 mt-1">{new Date(day.date).toLocaleDateString("en", { weekday: "short" })}</p>
                                        <p className="text-xs font-bold">{day.count}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
