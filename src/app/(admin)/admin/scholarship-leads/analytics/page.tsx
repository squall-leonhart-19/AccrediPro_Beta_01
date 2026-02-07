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
    CreditCard,
    Eye,
    ArrowRight,
    Clock,
    CalendarDays,
    Activity,
    Zap,
    RefreshCw,
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
    // Meta
    alaskaDate: string;
    alaskaTime: string;
    daysFilter: string;
    quizFilter: string;
    variantFilter: string;
    // Quizzes
    availableQuizzes: string[];
    perQuizStats: Record<string, number>;
    // Funnel
    quizPageViews: number;
    totalStarts: number;
    totalCompletes: number;
    totalEnrolled: number;
    quizToSubmissionRate: number;
    overallCompletionRate: number;
    enrollmentRate: number;
    questionProgress: number[];
    funnel: QuestionFunnel[];
    topPatterns: { pattern: string; count: number; percentage: number }[];
    // Breakdowns
    backgroundBreakdown: BreakdownItem[];
    incomeGoalBreakdown: BreakdownItem[];
    specializationBreakdown: BreakdownItem[];
    currentIncomeBreakdown: BreakdownItem[];
    // Variants
    activeVariants: string[];
    variantBreakdown: { variant: string; count: number; percentage: number }[];
}

// ─── Constants ─────────────────────────────────────────────────────────
const B = {
    burgundy: "#722f37",
    burgundyDark: "#5a252c",
    gold: "#d4af37",
    goldLight: "#f5d998",
};

const QUIZ_LABELS: Record<string, string> = {
    "depth-method": "Depth Method",
    "fm-application": "FM Application",
    "mini-diploma": "Mini Diploma",
};

const DATE_OPTIONS = [
    { label: "Today", value: "today" },
    { label: "7d", value: "7" },
    { label: "30d", value: "30" },
    { label: "90d", value: "90" },
    { label: "All", value: "all" },
];

export default function ScholarshipAnalyticsPage() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [daysFilter, setDaysFilter] = useState("30");
    const [quizFilter, setQuizFilter] = useState("all");
    const [variantFilter, setVariantFilter] = useState("all");
    const [expandedQ, setExpandedQ] = useState<number | null>(null);

    useEffect(() => {
        fetchAnalytics();
    }, [daysFilter, quizFilter, variantFilter]);

    const fetchAnalytics = async () => {
        if (data) setRefreshing(true);
        else setLoading(true);
        try {
            const params = new URLSearchParams({ days: daysFilter });
            if (quizFilter !== "all") params.set("quiz", quizFilter);
            if (variantFilter !== "all") params.set("variant", variantFilter);
            const res = await fetch(`/api/admin/scholarship-leads/analytics?${params.toString()}`);
            if (res.ok) setData(await res.json());
        } catch { /* silent */ } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    if (loading && !data) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    if (!data) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* ─── Sticky Header ─────────────────────────────────────── */}
            <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
                <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3">
                    {/* Row 1: Title + Date/Time + Refresh */}
                    <div className="flex items-center justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                            <Link href="/admin/scholarship-leads">
                                <Button variant="ghost" size="sm" className="gap-1.5 text-xs text-gray-500 hover:text-gray-700 -ml-2">
                                    <ArrowLeft className="w-3.5 h-3.5" /> Leads
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900">Quiz Analytics</h1>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Alaska time display */}
                            <div className="hidden sm:flex items-center gap-1.5 text-xs text-gray-400">
                                <Clock className="w-3.5 h-3.5" />
                                <span>{data.alaskaDate}</span>
                                <span className="text-gray-300">|</span>
                                <span>{data.alaskaTime} AK</span>
                            </div>
                            <Button variant="outline" size="sm" onClick={fetchAnalytics} disabled={refreshing} className="gap-1.5 text-xs">
                                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
                            </Button>
                        </div>
                    </div>

                    {/* Row 2: Filters */}
                    <div className="flex items-center gap-3 flex-wrap">
                        {/* Date Filter */}
                        <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5">
                            {DATE_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    onClick={() => setDaysFilter(opt.value)}
                                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                                        daysFilter === opt.value
                                            ? "bg-white text-gray-900 shadow-sm"
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>

                        {/* Quiz Selector */}
                        {data.availableQuizzes.length > 0 && (
                            <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5">
                                <button
                                    onClick={() => setQuizFilter("all")}
                                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                                        quizFilter === "all"
                                            ? "bg-white text-gray-900 shadow-sm"
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    All Quizzes
                                </button>
                                {data.availableQuizzes.map(q => (
                                    <button
                                        key={q}
                                        onClick={() => setQuizFilter(q)}
                                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                                            quizFilter === q
                                                ? "bg-white text-gray-900 shadow-sm"
                                                : "text-gray-500 hover:text-gray-700"
                                        }`}
                                    >
                                        {QUIZ_LABELS[q] || q}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Variant Filter */}
                        {data.activeVariants.length > 1 && (
                            <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5">
                                <button
                                    onClick={() => setVariantFilter("all")}
                                    className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                                        variantFilter === "all"
                                            ? "bg-white text-gray-900 shadow-sm"
                                            : "text-gray-500 hover:text-gray-700"
                                    }`}
                                >
                                    All
                                </button>
                                {data.activeVariants.map(v => (
                                    <button
                                        key={v}
                                        onClick={() => setVariantFilter(v)}
                                        className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                                            variantFilter === v
                                                ? "bg-white text-gray-900 shadow-sm"
                                                : "text-gray-500 hover:text-gray-700"
                                        }`}
                                    >
                                        V{v}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Active filters summary */}
                        <div className="flex items-center gap-1.5 ml-auto text-xs text-gray-400">
                            {quizFilter !== "all" && (
                                <Badge variant="outline" className="text-[10px] gap-1">
                                    <Activity className="w-2.5 h-2.5" />
                                    {QUIZ_LABELS[quizFilter] || quizFilter}
                                </Badge>
                            )}
                            {variantFilter !== "all" && (
                                <Badge variant="outline" className="text-[10px] gap-1">
                                    <Zap className="w-2.5 h-2.5" />
                                    Variant {variantFilter}
                                </Badge>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* ─── Content ─────────────────────────────────────────── */}
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-5 space-y-5">

                {/* ─── Per-Quiz Overview (when "All Quizzes" selected) ── */}
                {quizFilter === "all" && Object.keys(data.perQuizStats).length > 1 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {Object.entries(data.perQuizStats)
                            .sort(([, a], [, b]) => b - a)
                            .map(([slug, count]) => (
                                <button
                                    key={slug}
                                    onClick={() => setQuizFilter(slug)}
                                    className="bg-white rounded-xl border border-gray-200 p-4 text-left hover:border-gray-300 hover:shadow-sm transition-all group"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {QUIZ_LABELS[slug] || slug}
                                        </span>
                                        <ArrowRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-blue-400 transition-colors" />
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900">{count}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">quiz visitors tracked</p>
                                </button>
                            ))}
                    </div>
                )}

                {/* ─── Funnel Stats ──────────────────────────────────── */}
                <Card className="border-gray-200">
                    <CardContent className="pt-5 pb-4">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                            <FunnelStat
                                icon={<Eye className="w-5 h-5" style={{ color: B.gold }} />}
                                iconBg={`${B.gold}20`}
                                value={data.quizPageViews}
                                label="Page Views"
                                color={B.burgundy}
                            />
                            <ArrowRight className="w-4 h-4 text-gray-300 hidden sm:block" />
                            <FunnelStat
                                icon={<Users className="w-5 h-5 text-amber-600" />}
                                iconBg="rgb(254 243 199)"
                                value={data.totalStarts}
                                label={`Submissions (${data.quizToSubmissionRate}%)`}
                                color="#d97706"
                            />
                            <ArrowRight className="w-4 h-4 text-gray-300 hidden sm:block" />
                            <FunnelStat
                                icon={<CheckCircle className="w-5 h-5 text-green-600" />}
                                iconBg="rgb(220 252 231)"
                                value={data.totalCompletes}
                                label={`Completed (${data.overallCompletionRate}%)`}
                                color="#16a34a"
                            />
                            <ArrowRight className="w-4 h-4 text-gray-300 hidden sm:block" />
                            <FunnelStat
                                icon={<CreditCard className="w-5 h-5 text-blue-600" />}
                                iconBg="rgb(219 234 254)"
                                value={data.totalEnrolled}
                                label={`Enrolled (${data.enrollmentRate}%)`}
                                color="#2563eb"
                            />
                            <ArrowRight className="w-4 h-4 text-gray-300 hidden sm:block" />
                            <FunnelStat
                                icon={<Target className="w-5 h-5 text-purple-600" />}
                                iconBg="rgb(243 232 255)"
                                value={`${data.quizPageViews > 0 ? Math.round((data.totalEnrolled / data.quizPageViews) * 1000) / 10 : 0}%`}
                                label="View \u2192 Enrolled"
                                color="#7c3aed"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* ─── Live Quiz Drop-off Funnel ─────────────────────── */}
                {data.questionProgress && data.questionProgress[0] > 0 && (
                    <Card className="border-gray-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base text-gray-900">
                                <TrendingDown className="w-4.5 h-4.5 text-gray-500" />
                                Live Drop-off Funnel
                                {quizFilter !== "all" && (
                                    <Badge variant="outline" className="text-[10px] ml-1">{QUIZ_LABELS[quizFilter] || quizFilter}</Badge>
                                )}
                            </CardTitle>
                            <p className="text-xs text-gray-400 mt-0.5">Real-time tracking of where visitors abandon the quiz</p>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-1.5">
                                {(() => {
                                    const STEP_LABELS = [
                                        "Landed on quiz",
                                        "Q1: Specialization",
                                        "Q2: Background",
                                        "Q3: Experience",
                                        "Q4: Motivation",
                                        "Q5: Pain Point",
                                        "Q6: Timeline",
                                        "Q7: Income Goal",
                                        "Q8: Time Stuck",
                                        "Q9: Current Income",
                                        "Q10: Dream Life",
                                        "Q11: Commitment",
                                    ];
                                    const qp = data.questionProgress;
                                    const max = qp[0] || 1;
                                    return STEP_LABELS.map((label, i) => {
                                        if (i >= qp.length) return null;
                                        const count = qp[i];
                                        const prev = i === 0 ? max : qp[i - 1];
                                        const dropOff = prev > 0 ? prev - count : 0;
                                        const dropPct = prev > 0 ? Math.round((dropOff / prev) * 100) : 0;
                                        const pct = max > 0 ? Math.round((count / max) * 100) : 0;
                                        return (
                                            <div key={i} className="flex items-center gap-3">
                                                <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 bg-gray-100 text-gray-600">
                                                    {i === 0 ? "\u2605" : i}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between mb-0.5">
                                                        <span className="font-medium text-xs text-gray-700">{label}</span>
                                                        <div className="flex items-center gap-2 text-xs shrink-0 ml-2">
                                                            <span className="font-semibold text-gray-900">{count}</span>
                                                            <span className="text-gray-400">({pct}%)</span>
                                                            {dropOff > 0 && i > 0 && (
                                                                <span className={`flex items-center gap-0.5 font-medium ${dropPct > 30 ? "text-red-600" : dropPct > 15 ? "text-orange-500" : "text-gray-400"}`}>
                                                                    <AlertTriangle className="w-3 h-3" />
                                                                    -{dropOff} ({dropPct}%)
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full transition-all duration-500"
                                                            style={{
                                                                width: `${pct}%`,
                                                                background: dropPct > 30 ? '#ef4444' : dropPct > 15 ? B.gold : '#22c55e'
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* ─── Question Funnel (submitted data) ──────────────── */}
                <Card className="border-gray-200">
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-base text-gray-900">
                            <BarChart3 className="w-4.5 h-4.5 text-gray-500" />
                            Question-by-Question (Submitted)
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
                                        <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-gray-100 text-gray-600">
                                            {q.questionNumber}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="flex items-center gap-2 min-w-0">
                                                    <span className="font-medium text-sm text-gray-900 truncate">{q.questionText}</span>
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
                                                        background: q.dropOffRate > 20 ? '#ef4444' : q.dropOffRate > 5 ? B.gold : '#22c55e'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>

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
                                                                <div className="h-full rounded-full" style={{ width: `${a.percentage}%`, background: B.burgundy }} />
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

                {/* ─── Breakdowns Grid ───────────────────────────────── */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <BreakdownCard title="Background" icon={<PieChart className="w-4 h-4" />} items={data.backgroundBreakdown} color={B.burgundy} />
                    <BreakdownCard title="Income Goal" icon={<Target className="w-4 h-4" />} items={data.incomeGoalBreakdown} color={B.gold} />
                    <BreakdownCard title="Current Income" icon={<DollarSign className="w-4 h-4" />} items={data.currentIncomeBreakdown} color="#2563eb" />
                    <BreakdownCard title="Specialization" icon={<BarChart3 className="w-4 h-4" />} items={data.specializationBreakdown} color="#8b5cf6" />
                </div>

                {/* ─── Variant Breakdown ──────────────────────────────── */}
                {data.variantBreakdown && data.variantBreakdown.length > 1 && (
                    <Card className="border-gray-200">
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-base text-gray-900">
                                <Zap className="w-4 h-4 text-gray-500" />
                                A/B Variants
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                {data.variantBreakdown.map(v => (
                                    <button
                                        key={v.variant}
                                        onClick={() => setVariantFilter(variantFilter === v.variant ? "all" : v.variant)}
                                        className={`p-3 rounded-lg border text-center transition-all ${
                                            variantFilter === v.variant
                                                ? "border-blue-300 bg-blue-50"
                                                : "border-gray-200 hover:border-gray-300"
                                        }`}
                                    >
                                        <p className="text-sm font-semibold text-gray-900">Variant {v.variant}</p>
                                        <p className="text-2xl font-bold text-gray-900 mt-1">{v.count}</p>
                                        <p className="text-xs text-gray-400">{v.percentage}% of total</p>
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* ─── Top Patterns ──────────────────────────────────── */}
                {data.topPatterns.length > 0 && (
                    <Card className="border-gray-200">
                        <CardHeader className="pb-3">
                            <CardTitle className="flex items-center gap-2 text-base text-gray-900">
                                <CalendarDays className="w-4 h-4 text-gray-500" />
                                Most Common Paths
                            </CardTitle>
                            <p className="text-xs text-gray-400 mt-0.5">Background \u2192 Income Goal \u2192 Timeline</p>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {data.topPatterns.map((pattern, idx) => (
                                    <div key={idx} className="p-3 rounded-lg border border-gray-100 flex items-center justify-between gap-3 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-center gap-2 min-w-0">
                                            <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 bg-gray-100 text-gray-600">
                                                {idx + 1}
                                            </span>
                                            <span className="text-xs text-gray-700 truncate">{pattern.pattern}</span>
                                        </div>
                                        <Badge variant="outline" className="text-[10px] shrink-0">
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

// ─── Funnel Stat Component ──────────────────────────────────────────
function FunnelStat({ icon, iconBg, value, label, color }: {
    icon: React.ReactNode;
    iconBg: string;
    value: number | string;
    label: string;
    color: string;
}) {
    return (
        <div className="flex items-center gap-3 min-w-[110px]">
            <div className="p-2.5 rounded-xl shrink-0" style={{ background: iconBg }}>
                {icon}
            </div>
            <div>
                <p className="text-2xl font-bold" style={{ color }}>{value}</p>
                <p className="text-xs text-gray-500">{label}</p>
            </div>
        </div>
    );
}

// ─── Breakdown Card Component ───────────────────────────────────────
function BreakdownCard({ title, icon, items, color }: {
    title: string;
    icon: React.ReactNode;
    items: BreakdownItem[];
    color: string;
}) {
    if (!items || items.length === 0) return null;
    return (
        <Card className="border-gray-200">
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2 text-sm text-gray-900">
                    {icon}
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {items.map((item) => (
                        <div key={item.label}>
                            <div className="flex items-center justify-between mb-0.5">
                                <span className="text-xs font-medium text-gray-700 truncate max-w-[180px]">{item.label}</span>
                                <span className="text-[11px] text-gray-500 shrink-0 ml-2">{item.count} ({item.percentage}%)</span>
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
