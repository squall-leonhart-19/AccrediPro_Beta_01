"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface FunnelStage {
    label: string;
    value: number;
    pct: number;
    color: string;
    icon: LucideIcon;
}

interface FunnelChartProps {
    stages: FunnelStage[];
    betweenLabels?: string[];
    title?: string;
    description?: string;
}

export function FunnelChart({ stages, betweenLabels = [], title = "Conversion Funnel", description = "Lead journey from signup to paid enrollment" }: FunnelChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-[#722f37]" />
                    {title}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {stages.map((stage, i, arr) => (
                        <div key={i}>
                            <div className="flex items-center gap-3 sm:gap-4">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                                    <stage.icon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-xs sm:text-sm font-medium truncate">{stage.label}</span>
                                        <span className="text-xs sm:text-sm shrink-0 ml-2">
                                            <span className="font-bold">{stage.value}</span>
                                            <span className="text-gray-400 ml-1 sm:ml-2">({stage.pct}%)</span>
                                        </span>
                                    </div>
                                    <div className="h-3 sm:h-4 bg-gray-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${stage.color} transition-all duration-500`}
                                            style={{ width: `${stage.pct}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                            {i < arr.length - 1 && betweenLabels[i] && (
                                <div className="flex items-center ml-4 sm:ml-5 my-2">
                                    <div className="w-px h-5 bg-gray-200" />
                                    <div className="ml-4 sm:ml-6 text-xs text-gray-500">
                                        {betweenLabels[i]}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
