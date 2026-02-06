"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DeltaIndicator } from "./delta-indicator";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
    label: string;
    value: string | number;
    icon?: LucideIcon;
    delta?: { value: number; suffix?: string; isPercent?: boolean };
    color?: "green" | "purple" | "amber" | "blue" | "red" | "default";
    subtitle?: string;
    className?: string;
    gradient?: boolean;
}

const COLOR_MAP = {
    green: { card: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200", label: "text-green-600 font-medium", value: "text-green-700", icon: "bg-green-100 text-green-600" },
    purple: { card: "bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200", label: "text-purple-600 font-medium", value: "text-purple-700", icon: "bg-purple-100 text-purple-600" },
    amber: { card: "border-amber-200 bg-amber-50/50", label: "text-amber-600 font-medium", value: "text-amber-700", icon: "bg-amber-100 text-amber-600" },
    blue: { card: "", label: "text-gray-500", value: "text-blue-600", icon: "bg-blue-100 text-blue-600" },
    red: { card: "", label: "text-gray-500", value: "text-red-600", icon: "bg-red-100 text-red-600" },
    default: { card: "", label: "text-gray-500", value: "", icon: "bg-gray-100 text-gray-600" },
};

export function StatCard({ label, value, icon: Icon, delta, color = "default", subtitle, className, gradient }: StatCardProps) {
    const colors = COLOR_MAP[color];
    return (
        <Card className={cn(gradient ? colors.card : "", className)}>
            <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between">
                    <div className="min-w-0 flex-1">
                        <p className={cn("text-sm truncate", colors.label)}>{label}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                            <p className={cn("text-2xl sm:text-3xl font-bold", colors.value)}>{value}</p>
                            {delta && <DeltaIndicator delta={delta.value} suffix={delta.suffix} isPercent={delta.isPercent} />}
                        </div>
                        {subtitle && <p className={cn("text-xs mt-1", color !== "default" ? colors.label : "text-gray-400")}>{subtitle}</p>}
                    </div>
                    {Icon && (
                        <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0 ml-3", colors.icon)}>
                            <Icon className="w-5 h-5" />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
