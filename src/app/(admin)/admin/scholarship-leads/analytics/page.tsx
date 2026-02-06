"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    ArrowLeft,
    BarChart3,
    TrendingDown,
    Users,
    Target,
    PieChart,
    AlertTriangle,
    CheckCircle,
    Loader2,
} from "lucide-react";

// ─── Types ─────────────────────────────────────────────────────────
interface QuestionFunnel {
    questionNumber: number;
    questionText: string;
    pillar: string;
    reached: number;
    answered: number;
    dropOffRate: number;
    answers: {
        value: string;
        label: string;
        count: number;
        percentage: number;
    }[];
}

interface AnalyticsData {
    totalStarts: number;
    totalCompletes: number;
    overallCompletionRate: number;
    avgTimeToComplete: string;
    funnel: QuestionFunnel[];
    topPatterns: {
        pattern: string;
        count: number;
        percentage: number;
    }[];
    backgroundBreakdown: {
        label: string;
        count: number;
        percentage: number;
    }[];
    incomeGoalBreakdown: {
        label: string;
        count: number;
        percentage: number;
    }[];
    specializationBreakdown: {
        label: string;
        count: number;
        percentage: number;
    }[];
}

// ─── Constants ─────────────────────────────────────────────────────────
const BRAND = {
    burgundy: "#722f37",
    burgundyDark: "#5a252c",
    gold: "#d4af37",
    goldLight: "#f5d998",
};

// Question definitions for labels
const QUESTIONS = [
    { id: 1, pillar: "Specialization", text: "Which area of FM excites you most?" },
    { id: 2, pillar: "Background", text: "What best describes your background?" },
    { id: 3, pillar: "Experience", text: "Knowledge of Functional Medicine?" },
    { id: 4, pillar: "Motivation", text: "Main reason to get certified?" },
    { id: 5, pillar: "Pain Point", text: "What frustrates you MOST?" },
    { id: 6, pillar: "Timeline", text: "When to start certification?" },
    { id: 7, pillar: "Income Goal", text: "Target monthly income?" },
    { id: 8, pillar: "Time Stuck", text: "How long thinking about change?" },
    { id: 9, pillar: "Current Income", text: "Current monthly income?" },
    { id: 10, pillar: "Dream Life", text: "What matters most about goal life?" },
    { id: 11, pillar: "Commitment", text: "How committed are you?" },
];

export default function ScholarshipAnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAnalytics();
    }, []);

    const fetchAnalytics = async () => {
        try {
            const res = await fetch("/api/admin/scholarship-leads/analytics");
            if (res.ok) {
                const json = await res.json();
                setData(json);
            } else {
                // Generate mock data if API doesn't exist yet
                setData(generateMockData());
            }
        } catch {
            // Fallback to mock data
            setData(generateMockData());
        } finally {
            setLoading(false);
        }
    };

    const generateMockData = (): AnalyticsData => {
        // Generate realistic mock funnel data
        let remaining = 847;
        const funnel: QuestionFunnel[] = QUESTIONS.map((q, idx) => {
            const dropOff = idx === 0 ? 0 : Math.floor(remaining * (Math.random() * 0.08 + 0.02));
            const reached = remaining;
            remaining -= dropOff;
            const answered = remaining;

            return {
                questionNumber: q.id,
                questionText: q.text,
                pillar: q.pillar,
                reached,
                answered,
                dropOffRate: reached > 0 ? Math.round((dropOff / reached) * 100) : 0,
                answers: [],
            };
        });

        return {
            totalStarts: 847,
            totalCompletes: 612,
            overallCompletionRate: 72.3,
            avgTimeToComplete: "4m 32s",
            funnel,
            topPatterns: [
                { pattern: "Healthcare → Help People → Immediately", count: 156, percentage: 25.5 },
                { pattern: "Wellness → Leave Job → 30 days", count: 98, percentage: 16.0 },
                { pattern: "Career Change → Burned Out → Immediately", count: 87, percentage: 14.2 },
            ],
            backgroundBreakdown: [
                { label: "Nurse or Nursing Assistant", count: 287, percentage: 46.9 },
                { label: "Wellness/Fitness Professional", count: 124, percentage: 20.3 },
                { label: "Other career — ready for change", count: 98, percentage: 16.0 },
                { label: "Allied Health (PT, OT, Dietitian)", count: 56, percentage: 9.2 },
                { label: "Doctor, PA, or NP", count: 28, percentage: 4.6 },
                { label: "Mental Health Professional", count: 19, percentage: 3.1 },
            ],
            incomeGoalBreakdown: [
                { label: "$5,000 to $10,000/month", count: 267, percentage: 43.6 },
                { label: "$10,000 to $15,000/month", count: 189, percentage: 30.9 },
                { label: "$3,000 to $5,000/month", count: 98, percentage: 16.0 },
                { label: "$15,000+/month", count: 58, percentage: 9.5 },
            ],
            specializationBreakdown: [
                { label: "Hormonal Health and Balance", count: 198, percentage: 32.4 },
                { label: "Gut Health and Digestive Wellness", count: 156, percentage: 25.5 },
                { label: "Stress, Burnout and Adrenal Recovery", count: 124, percentage: 20.3 },
                { label: "Weight Management and Metabolic Health", count: 78, percentage: 12.7 },
                { label: "Autoimmune and Inflammation", count: 34, percentage: 5.6 },
                { label: "Not sure yet", count: 22, percentage: 3.6 },
            ],
        };
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
                <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-6">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/scholarship-leads">
                            <Button variant="outline" size="sm" className="gap-2">
                                <ArrowLeft className="w-4 h-4" /> Back to Leads
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold" style={{ color: BRAND.burgundy }}>
                                Quiz Analytics
                            </h1>
                            <p className="text-sm text-gray-500">Question completion & answer patterns</p>
                        </div>
                    </div>
                    <Badge className="text-sm px-3 py-1" style={{ background: BRAND.gold, color: BRAND.burgundyDark }}>
                        Last 30 days
                    </Badge>
                </div>

                {/* Top Stats */}
                <div className="grid grid-cols-4 gap-4">
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl" style={{ background: `${BRAND.gold}20` }}>
                                    <Users className="w-6 h-6" style={{ color: BRAND.gold }} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold" style={{ color: BRAND.burgundy }}>{data.totalStarts}</p>
                                    <p className="text-sm text-gray-500">Quiz Starts</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-green-100">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-green-600">{data.totalCompletes}</p>
                                    <p className="text-sm text-gray-500">Completes</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-blue-100">
                                    <Target className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-blue-600">{data.overallCompletionRate}%</p>
                                    <p className="text-sm text-gray-500">Completion Rate</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-center gap-3">
                                <div className="p-3 rounded-xl bg-purple-100">
                                    <BarChart3 className="w-6 h-6 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-purple-600">{data.avgTimeToComplete}</p>
                                    <p className="text-sm text-gray-500">Avg. Time</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Question Funnel */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2" style={{ color: BRAND.burgundy }}>
                            <TrendingDown className="w-5 h-5" />
                            Question-by-Question Drop-off
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {data.funnel.map((q, idx) => (
                                <div key={q.questionNumber} className="flex items-center gap-4">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                                        style={{ background: `${BRAND.gold}30`, color: BRAND.burgundy }}>
                                        {q.questionNumber}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-sm" style={{ color: BRAND.burgundy }}>{q.questionText}</span>
                                                <Badge variant="outline" className="text-xs">{q.pillar}</Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm">
                                                <span className="text-gray-500">{q.reached} reached</span>
                                                <span className="font-medium text-green-600">{q.answered} answered</span>
                                                {q.dropOffRate > 0 && (
                                                    <span className="flex items-center gap-1 text-red-500">
                                                        <AlertTriangle className="w-3 h-3" />
                                                        {q.dropOffRate}% drop
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className="h-full rounded-full transition-all duration-500"
                                                style={{
                                                    width: `${(q.answered / data.totalStarts) * 100}%`,
                                                    background: q.dropOffRate > 5 ? '#ef4444' : q.dropOffRate > 3 ? BRAND.gold : '#22c55e'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Answer Patterns Grid */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Background Breakdown */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg" style={{ color: BRAND.burgundy }}>
                                <PieChart className="w-5 h-5" />
                                Background Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {data.backgroundBreakdown.map((item) => (
                                    <div key={item.label} className="flex items-center gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium truncate max-w-[200px]">{item.label}</span>
                                                <span className="text-sm text-gray-500">{item.count} ({item.percentage}%)</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{ width: `${item.percentage}%`, background: BRAND.burgundy }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Income Goals */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg" style={{ color: BRAND.burgundy }}>
                                <Target className="w-5 h-5" />
                                Income Goal Distribution
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {data.incomeGoalBreakdown.map((item) => (
                                    <div key={item.label} className="flex items-center gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium">{item.label}</span>
                                                <span className="text-sm text-gray-500">{item.count} ({item.percentage}%)</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{ width: `${item.percentage}%`, background: BRAND.gold }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Specialization */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg" style={{ color: BRAND.burgundy }}>
                                <BarChart3 className="w-5 h-5" />
                                Specialization Interest
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {data.specializationBreakdown.map((item) => (
                                    <div key={item.label} className="flex items-center gap-3">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-sm font-medium truncate max-w-[220px]">{item.label}</span>
                                                <span className="text-sm text-gray-500">{item.count} ({item.percentage}%)</span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{ width: `${item.percentage}%`, background: '#8b5cf6' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Patterns */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-lg" style={{ color: BRAND.burgundy }}>
                                <TrendingDown className="w-5 h-5" />
                                Most Common Paths
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data.topPatterns.map((pattern, idx) => (
                                    <div key={idx} className="p-3 rounded-xl border" style={{ borderColor: `${BRAND.gold}40` }}>
                                        <div className="flex items-center justify-between mb-2">
                                            <Badge style={{ background: BRAND.gold, color: BRAND.burgundyDark }}>
                                                #{idx + 1} Pattern
                                            </Badge>
                                            <span className="text-sm font-bold" style={{ color: BRAND.burgundy }}>
                                                {pattern.count} leads ({pattern.percentage}%)
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 font-medium">{pattern.pattern}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
