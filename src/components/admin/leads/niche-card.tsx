"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, Trophy, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { type NicheStat, NICHE_COLORS, getRateColor } from "./metric-types";

interface NicheCardProps {
    niche: NicheStat;
    rank: number;
    totalLeads: number;
}

export function NicheCard({ niche, rank, totalLeads }: NicheCardProps) {
    const colors = NICHE_COLORS[niche.slug] || NICHE_COLORS["unknown"];
    const pctOfTotal = totalLeads > 0 ? Math.round((niche.signups / totalLeads) * 100) : 0;

    return (
        <Link href={`/admin/leads/${niche.slug}`}>
            <Card className={cn(
                "hover:shadow-md transition-all cursor-pointer border-l-4 group",
                rank === 0 ? "border-l-amber-400" : "border-l-transparent hover:border-l-gray-300"
            )}>
                <CardContent className="pt-4 pb-3">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2 min-w-0">
                            {rank === 0 && <Trophy className="w-4 h-4 text-amber-500 shrink-0" />}
                            <h3 className="font-semibold text-sm truncate">{niche.name}</h3>
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 shrink-0 transition-colors" />
                    </div>

                    {/* Lead count + bar */}
                    <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-2xl font-bold">{niche.signups}</span>
                            <span className="text-xs text-gray-400">{pctOfTotal}% of total</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={cn("h-full rounded-full", colors.accent)} style={{ width: `${pctOfTotal}%` }} />
                        </div>
                    </div>

                    {/* KPIs grid */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                            <p className={cn("text-sm font-bold", getRateColor(niche.startRate, "start"))}>{niche.startRate}%</p>
                            <p className="text-[10px] text-gray-400">Start</p>
                        </div>
                        <div>
                            <p className={cn("text-sm font-bold", getRateColor(niche.completionRate, "completion"))}>{niche.completionRate}%</p>
                            <p className="text-[10px] text-gray-400">Complete</p>
                        </div>
                        <div>
                            <p className={cn("text-sm font-bold", getRateColor(niche.paidConversion, "conversion"))}>{niche.paidConversion}%</p>
                            <p className="text-[10px] text-gray-400">Paid</p>
                        </div>
                    </div>

                    {/* Drop-off alert */}
                    {niche.biggestDropoffLesson > 0 && niche.biggestDropoffRate > 20 && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                            <p className="text-[10px] text-red-600 flex items-center gap-1">
                                <TrendingDown className="w-3 h-3" />
                                {niche.biggestDropoffRate}% drop at Lesson {niche.biggestDropoffLesson}
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    );
}
