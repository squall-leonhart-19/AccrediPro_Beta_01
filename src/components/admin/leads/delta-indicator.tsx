"use client";

import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface DeltaIndicatorProps {
    delta: number;
    suffix?: string;
    isPercent?: boolean;
}

export function DeltaIndicator({ delta, suffix = "", isPercent = false }: DeltaIndicatorProps) {
    if (delta === 0) return null;
    const isPositive = delta > 0;
    return (
        <span className={`inline-flex items-center text-xs font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {isPositive ? "+" : ""}{delta}{isPercent ? "%" : ""}{suffix}
        </span>
    );
}
