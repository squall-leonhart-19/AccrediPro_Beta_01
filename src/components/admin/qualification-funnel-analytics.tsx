"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, TrendingDown, Users, CheckCircle, XCircle, ArrowRight } from "lucide-react";

interface QualificationFunnel {
    started: number;
    completed: number;
    abandoned: number;
    completionRate: string;
    dropOffRate: string;
    stepViews: Record<number, number>;
    stepCompletes: Record<number, number>;
    abandonmentByStep: Record<number, number>;
}

interface FunnelData {
    qualificationFunnel: QualificationFunnel;
    metrics: {
        optins: number;
        lessonStarts: number;
        certificates: number;
    };
    variantMetrics?: Record<string, {
        optins: number;
        diplomaStarts: number;
        diplomaCompletions: number;
        formCompletionRate: string;
        diplomaStartRate: string;
        diplomaCompletionRate: string;
    }>;
    period: string;
}

const STEP_NAMES: Record<number, string> = {
    1: "Intro",
    2: "Background",
    3: "Motivation",
    4: "Health Journey",
    5: "Time Availability",
    6: "Dream Outcome",
    7: "Timing",
    8: "Contact Info",
    9: "Commitments"
};

export function QualificationFunnelAnalytics() {
    const [data, setData] = useState<FunnelData | null>(null);
    const [loading, setLoading] = useState(true);
    const [days, setDays] = useState(7);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/track/mini-diploma?days=${days}`);
                const json = await res.json();
                setData(json);
            } catch (e) {
                console.error("Failed to fetch funnel data:", e);
            }
            setLoading(false);
        };
        fetchData();
    }, [days]);

    if (loading) {
        return (
            <div className="p-6 bg-white rounded-xl border animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-12 bg-gray-100 rounded"></div>
                    ))}
                </div>
            </div>
        );
    }

    if (!data?.qualificationFunnel) {
        return (
            <div className="p-6 bg-white rounded-xl border">
                <p className="text-gray-500">No funnel data available yet.</p>
            </div>
        );
    }

    const funnel = data.qualificationFunnel;
    const maxViews = Math.max(...Object.values(funnel.stepViews), 1);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-purple-600" />
                        Qualification Form Analytics
                    </h2>
                    <p className="text-sm text-gray-500">Track form starts, completions, and drop-offs</p>
                </div>
                <select
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    className="px-3 py-2 border rounded-lg text-sm"
                >
                    <option value={1}>Last 24 hours</option>
                    <option value={7}>Last 7 days</option>
                    <option value={30}>Last 30 days</option>
                    <option value={90}>Last 90 days</option>
                </select>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-xl border">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <Users className="w-4 h-4" />
                        Started
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{funnel.started}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        Completed
                    </div>
                    <div className="text-2xl font-bold text-green-600">{funnel.completed}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <TrendingUp className="w-4 h-4 text-blue-500" />
                        Completion Rate
                    </div>
                    <div className="text-2xl font-bold text-blue-600">{funnel.completionRate}</div>
                </div>
                <div className="bg-white p-4 rounded-xl border">
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                        <XCircle className="w-4 h-4 text-red-500" />
                        Abandoned
                    </div>
                    <div className="text-2xl font-bold text-red-600">{funnel.abandoned}</div>
                </div>
            </div>

            {/* Step-by-Step Funnel */}
            <div className="bg-white p-6 rounded-xl border">
                <h3 className="font-semibold text-gray-900 mb-4">Step-by-Step Funnel</h3>
                <div className="space-y-3">
                    {Object.entries(STEP_NAMES).map(([step, name]) => {
                        const stepNum = Number(step);
                        const views = funnel.stepViews[stepNum] || 0;
                        const completes = funnel.stepCompletes[stepNum] || 0;
                        const abandoned = funnel.abandonmentByStep[stepNum] || 0;
                        const barWidth = (views / maxViews) * 100;
                        const stepCompletionRate = views > 0 ? ((completes / views) * 100).toFixed(0) : 0;

                        return (
                            <div key={step} className="relative">
                                <div className="flex items-center gap-3 mb-1">
                                    <span className="text-xs font-bold text-gray-400 w-6">#{step}</span>
                                    <span className="text-sm font-medium text-gray-700 flex-1">{name}</span>
                                    <span className="text-xs text-gray-500">{views} views</span>
                                    <span className="text-xs text-green-600">{completes} ✓</span>
                                    {abandoned > 0 && (
                                        <span className="text-xs text-red-500">{abandoned} ✗</span>
                                    )}
                                    <span className="text-xs font-medium text-blue-600 w-10 text-right">{stepCompletionRate}%</span>
                                </div>
                                <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden ml-9">
                                    <div
                                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-purple-500 to-purple-400 rounded-full transition-all"
                                        style={{ width: `${barWidth}%` }}
                                    />
                                    {abandoned > 0 && (
                                        <div
                                            className="absolute inset-y-0 right-0 bg-red-200 rounded-full"
                                            style={{ width: `${(abandoned / views) * barWidth}%` }}
                                        />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Drop-off Analysis */}
            <div className="bg-amber-50 p-6 rounded-xl border border-amber-200">
                <h3 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                    <TrendingDown className="w-4 h-4" />
                    Biggest Drop-off Points
                </h3>
                <div className="space-y-2">
                    {Object.entries(funnel.abandonmentByStep)
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 3)
                        .map(([step, count]) => (
                            <div key={step} className="flex items-center gap-2 text-sm">
                                <span className="font-medium text-amber-800">Step {step}:</span>
                                <span className="text-amber-700">{STEP_NAMES[Number(step)]}</span>
                                <ArrowRight className="w-3 h-3 text-amber-400" />
                                <span className="text-red-600 font-medium">{count} abandonments</span>
                            </div>
                        ))
                    }
                    {Object.keys(funnel.abandonmentByStep).length === 0 && (
                        <p className="text-sm text-amber-700">No abandonments recorded yet</p>
                    )}
                </div>
            </div>

            {/* A/B Variant Comparison */}
            {data.variantMetrics && Object.keys(data.variantMetrics).length > 0 && (
                <div className="bg-white p-6 rounded-xl border">
                    <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-indigo-600" />
                        Form Variant A/B Testing
                    </h3>
                    <p className="text-sm text-gray-500 mb-4">Compare performance across different form variants (use ?v=A or ?v=B in URL)</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.entries(data.variantMetrics).map(([variant, stats]) => (
                            <div key={variant} className="bg-gray-50 p-4 rounded-lg border">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-lg font-bold text-gray-900">Variant {variant}</span>
                                    <span className="text-xs px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full">
                                        {stats.optins} leads
                                    </span>
                                </div>
                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Form Completion</span>
                                        <span className="font-semibold text-green-600">{stats.formCompletionRate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Diploma Start</span>
                                        <span className="font-semibold text-blue-600">{stats.diplomaStartRate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Diploma Complete</span>
                                        <span className="font-semibold text-purple-600">{stats.diplomaCompletionRate}</span>
                                    </div>
                                </div>
                                <div className="mt-3 pt-3 border-t text-xs text-gray-400">
                                    {stats.diplomaStarts} started • {stats.diplomaCompletions} completed
                                </div>
                            </div>
                        ))}
                    </div>
                    {Object.keys(data.variantMetrics).length === 1 && (
                        <p className="text-xs text-gray-400 mt-3">
                            💡 To run A/B tests, send traffic to ?v=A and ?v=B URLs
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
