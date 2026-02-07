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
    DollarSign,
    Calendar,
    CreditCard,
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

interface BreakdownItem {
    label: string;
    count: number;
    percentage: number;
}

interface AnalyticsData {
    totalStarts: number;
    totalCompletes: number;
    totalEnrolled: number;
    overallCompletionRate: number;
    enrollmentRate: number;
    funnel: QuestionFunnel[];
    topPatterns: {
        pattern: string;
        count: number;
        percentage: number;
    }[];
    backgroundBreakdown: BreakdownItem[];
    incomeGoalBreakdown: BreakdownItem[];
    specializationBreakdown: BreakdownItem[];
    currentIncomeBreakdown: BreakdownItem[];
    daysFilter: string;
}

// ─── Constants ─────────────────────────────────────────────────────────
const BRAND = {
    burgundy: "#722f37",
    burgundyDark: "#5a252c",
    gold: "#d4af37",
    goldLight: "#f5d998",
};

const DATE_OPTIONS = [
    { label: "7 days", value: "7" },
    { label: "30 days", value: "30" },
    { label: "90 days", value: "90" },
    { label: "All time", value: "all" },
];

export default function ScholarshipAnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [daysFilter, setDaysFilter] = useState("30");
    const [expandedQ, setExpandedQ] = useState<number | null>(null);

    useEffect(() => {
        fetchAnalytics(daysFilter);
    }, [daysFilter]);

    const fetchAnalytics = async (days: string) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/scholarship-leads/analytics?days=${days}`);
            if (res.ok) {
                const json = await res.json();
                setData(json);
            }
        } catch {
            // silently fail
        } finally {
            setLoading(false);
        }
    };

    if (loading && !data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-50">
                <Loader2 className="w-8 h-8 animate-spin text-amber-600" />
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 sm:p-6">
            <div className="max-w-7xl mx-auto space-y-5">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/scholarship-leads">
                            <Button variant="outline" size="sm" className="gap-2">
                                <ArrowLeft className="w-4 h-4" /> Leads
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-xl sm:text-2xl font-bold" style={{ color: BRAND.burgundy }}>
                                Quiz Analytics
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500">Question completion & answer patterns</p>
                        </div>
                    </div>
                    {/* Date Filter */}
                    <div className="flex items-center gap-1.5 bg-white rounded-lg border p-1">
                        {DATE_OPTIONS.map(opt => (
                            <button
                                key={opt.value}
                                onClick={() => setDaysFilter(opt.value)}
                                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                                    daysFilter === opt.value
                                        ? "text-white shadow-sm"
                                        : "text-gray-500 hover:text-gray-700"
                                }`}
                                style={daysFilter === opt.value ? { background: BRAND.burgundy } : {}}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Top Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Card>
                        <CardContent className="pt-5 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl" style={{ background: `${BRAND.gold}20` }}>
                                    <Users className="w-5 h-5" style={{ color: BRAND.gold }} />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold" style={{ color: BRAND.burgundy }}>{data.totalStarts}</p>
                                    <p className="text-xs text-gray-500">Quiz Starts</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-5 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-green-100">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-green-600">{data.totalCompletes}</p>
                                    <p className="text-xs text-gray-500">Completed ({data.overallCompletionRate}%)</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-5 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-blue-100">
                                    <CreditCard className="w-5 h-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-blue-600">{data.totalEnrolled}</p>
                                    <p className="text-xs text-gray-500">Enrolled ({data.enrollmentRate}%)</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="pt-5 pb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-purple-100">
                                    <Target className="w-5 h-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-purple-600">
                                        {data.totalStarts > 0 ? Math.round((data.totalEnrolled / data.totalStarts) * 100 * 10) / 10 : 0}%
                                    </p>
                                    <p className="text-xs text-gray-500">Quiz → Enrolled</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Question Funnel */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg" style={{ color: BRAND.burgundy }}>
                            <TrendingDown className="w-5 h-5" />
                            Question-by-Question Drop-off
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2.5">
                            {data.funnel.map((q) => (
                                <div key={q.questionNumber}>
                                    <div
                                        className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 rounded-lg p-1.5 -mx-1.5 transition-colors"
                                        onClick={() => setExpandedQ(expandedQ === q.questionNumber ? null : q.questionNumber)}
                                    >
                                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                                            style={{ background: `${BRAND.gold}30`, color: BRAND.burgundy }}>
                                            {q.questionNumber}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="font-medium text-sm truncate" style={{ color: BRAND.burgundy }}>{q.questionText}</span>
                                                    <Badge variant="outline" className="text-[10px] shrink-0">{q.pillar}</Badge>
                                                </div>
                                                <div className="flex items-center gap-3 text-xs shrink-0 ml-2">
                                                    <span className="text-gray-400">{q.reached} reached</span>
                                                    <span className={`font-semibold ${q.answered === 0 ? "text-red-500" : "text-green-600"}`}>
                                                        {q.answered} answered
                                                    </span>
                                                    {q.dropOffRate > 0 && (
                                                        <span className={`flex items-center gap-0.5 font-medium ${q.dropOffRate > 20 ? "text-red-600" : q.dropOffRate > 5 ? "text-orange-500" : "text-gray-400"}`}>
                                                            <AlertTriangle className="w-3 h-3" />
                                                            {q.dropOffRate}%
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${data.totalStarts > 0 ? (q.answered / data.totalStarts) * 100 : 0}%`,
                                                        background: q.dropOffRate > 20 ? '#ef4444' : q.dropOffRate > 5 ? BRAND.gold : '#22c55e'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded: Answer Distribution */}
                                    {expandedQ === q.questionNumber && q.answers.length > 0 && (
                                        <div className="ml-10 mt-2 mb-3 p-3 bg-gray-50 rounded-lg border">
                                            <p className="text-xs font-semibold text-gray-500 mb-2">Answer Distribution</p>
                                            <div className="space-y-1.5">
                                                {q.answers.map(a => (
                                                    <div key={a.value} className="flex items-center gap-2">
                                                        <div className="flex-1">
                                                            <div className="flex items-center justify-between text-xs mb-0.5">
                                                                <span className="font-medium text-gray-700 truncate max-w-[250px]">{a.label}</span>
                                                                <span className="text-gray-500 shrink-0 ml-2">{a.count} ({a.percentage}%)</span>
                                                            </div>
                                                            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                                                                <div className="h-full rounded-full" style={{ width: `${a.percentage}%`, background: BRAND.burgundy }} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Breakdowns Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Background */}
                    <BreakdownCard
                        title="Background Distribution"
                        icon={<PieChart className="w-5 h-5" />}
                        items={data.backgroundBreakdown}
                        color={BRAND.burgundy}
                    />

                    {/* Income Goals */}
                    <BreakdownCard
                        title="Income Goal Distribution"
                        icon={<Target className="w-5 h-5" />}
                        items={data.incomeGoalBreakdown}
                        color={BRAND.gold}
                    />

                    {/* Current Income */}
                    <BreakdownCard
                        title="Current Monthly Income"
                        icon={<DollarSign className="w-5 h-5" />}
                        items={data.currentIncomeBreakdown}
                        color="#2563eb"
                    />

                    {/* Specialization */}
                    <BreakdownCard
                        title="Specialization Interest"
                        icon={<BarChart3 className="w-5 h-5" />}
                        items={data.specializationBreakdown}
                        color="#8b5cf6"
                    />
                </div>

                {/* Top Patterns */}
                {data.topPatterns.length > 0 && (
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-lg" style={{ color: BRAND.burgundy }}>
                                <TrendingDown className="w-5 h-5" />
                                Most Common Paths (Background → Income Goal → Timeline)
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {data.topPatterns.map((pattern, idx) => (
                                    <div key={idx} className="p-3 rounded-lg border flex items-center justify-between gap-3" style={{ borderColor: `${BRAND.gold}40` }}>
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                                                style={{ background: `${BRAND.gold}30`, color: BRAND.burgundy }}>
                                                {idx + 1}
                                            </span>
                                            <span className="text-sm text-gray-700 truncate">{pattern.pattern}</span>
                                        </div>
                                        <Badge variant="outline" className="text-xs shrink-0">
                                            {pattern.count} ({pattern.percentage}%)
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}

// ─── Reusable Breakdown Card ─────────────────────────────────────
function BreakdownCard({ title, icon, items, color }: {
    title: string;
    icon: React.ReactNode;
    items: BreakdownItem[];
    color: string;
}) {
    if (!items || items.length === 0) return null;
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-base" style={{ color: BRAND.burgundy }}>
                    {icon}
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2.5">
                    {items.map((item) => (
                        <div key={item.label}>
                            <div className="flex items-center justify-between mb-0.5">
                                <span className="text-sm font-medium truncate max-w-[200px]">{item.label}</span>
                                <span className="text-xs text-gray-500 shrink-0 ml-2">{item.count} ({item.percentage}%)</span>
                            </div>
                            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-300"
                                    style={{ width: `${item.percentage}%`, background: color }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
