"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, TrendingDown, AlertTriangle, ArrowDown, Target } from "lucide-react";
import { toast } from "sonner";

interface Stage {
    id: number;
    name: string;
    count: number;
    percent: number;
    dropOff: number;
}

interface FunnelData {
    stages: Stage[];
    totalSignups: number;
    finalConversion: number;
    biggestDropOff: string;
    biggestDropOffCount: number;
}

export default function FunnelAnalyticsClient() {
    const [data, setData] = useState<FunnelData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/super-tools/funnel");
            if (res.ok) {
                const json = await res.json();
                setData(json);
            } else {
                toast.error("Failed to load funnel data");
            }
        } catch (error) {
            toast.error("Error loading data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-burgundy-600" />
            </div>
        );
    }

    if (!data) {
        return (
            <div className="text-center py-20 text-gray-500">
                Failed to load funnel data.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                    <div className="flex items-center gap-3">
                        <Target className="w-8 h-8 text-blue-600" />
                        <div>
                            <div className="text-2xl font-bold text-blue-900">{data.finalConversion}%</div>
                            <div className="text-xs text-blue-600">Overall Conversion</div>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
                    <div className="flex items-center gap-3">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                        <div>
                            <div className="text-lg font-bold text-red-900">{data.biggestDropOff}</div>
                            <div className="text-xs text-red-600">Biggest Drop ({data.biggestDropOffCount} lost)</div>
                        </div>
                    </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                    <div className="flex items-center gap-3">
                        <TrendingDown className="w-8 h-8 text-green-600" />
                        <div>
                            <div className="text-2xl font-bold text-green-900">{data.totalSignups}</div>
                            <div className="text-xs text-green-600">Total Signups</div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Funnel Visualization */}
            <Card className="p-6">
                <h2 className="font-semibold text-gray-900 mb-6 flex items-center gap-2">
                    <TrendingDown className="w-5 h-5 text-burgundy-600" />
                    User Journey Funnel
                </h2>

                <div className="space-y-3">
                    {data.stages.map((stage, index) => {
                        const isFirst = index === 0;
                        const isDropOffStage = stage.dropOff > data.biggestDropOffCount * 0.8 && stage.dropOff > 0;
                        const barWidth = Math.max(10, stage.percent);

                        return (
                            <div key={stage.id}>
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-700">{stage.name}</span>
                                        {isDropOffStage && !isFirst && (
                                            <Badge variant="destructive" className="text-xs">
                                                High drop-off
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 text-sm">
                                        <span className="font-semibold text-gray-900">{stage.count.toLocaleString()}</span>
                                        <span className="text-gray-500">({stage.percent}%)</span>
                                    </div>
                                </div>
                                <div className="relative">
                                    <div className="w-full bg-gray-200 rounded-full h-8 overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all ${isDropOffStage && !isFirst
                                                    ? "bg-gradient-to-r from-red-500 to-orange-500"
                                                    : "bg-gradient-to-r from-burgundy-600 to-burgundy-500"
                                                }`}
                                            style={{ width: `${barWidth}%` }}
                                        />
                                    </div>
                                </div>
                                {!isFirst && stage.dropOff > 0 && (
                                    <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                                        <ArrowDown className="w-3 h-3 text-red-500" />
                                        <span className="text-red-500 font-medium">-{stage.dropOff.toLocaleString()}</span>
                                        <span>dropped here</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* Recommendations */}
            <Card className="p-6 bg-yellow-50 border-yellow-200">
                <h3 className="font-semibold text-yellow-900 mb-2">💡 Recommendations</h3>
                <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Focus on the <strong>{data.biggestDropOff}</strong> stage - this is where most users leave</li>
                    <li>• Consider adding email nudges for users stuck at each stage</li>
                    <li>• Use the Auto-Tag Rules to trigger re-engagement at drop-off points</li>
                </ul>
            </Card>
        </div>
    );
}
