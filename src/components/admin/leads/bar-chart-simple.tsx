"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { LucideIcon } from "lucide-react";

interface BarChartData {
    label: string;
    value: number;
}

interface BarChartSimpleProps {
    data: BarChartData[];
    title: string;
    description?: string;
    icon?: LucideIcon;
    iconColor?: string;
    color?: string;
    height?: string;
    formatValue?: (v: number) => string;
}

export function BarChartSimple({
    data,
    title,
    description,
    icon: Icon,
    iconColor = "text-blue-600",
    color = "bg-[#722f37]",
    height = "h-32 sm:h-40",
    formatValue,
}: BarChartSimpleProps) {
    const maxValue = Math.max(...data.map(d => d.value), 1);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                    {Icon && <Icon className={`w-5 h-5 ${iconColor}`} />}
                    {title}
                </CardTitle>
                {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
            <CardContent>
                <div className={`flex items-end ${height} gap-1`}>
                    {data.map((item, i) => {
                        const pctHeight = (item.value / maxValue) * 100;
                        return (
                            <div key={i} className="flex-1 flex flex-col items-center min-w-0">
                                {formatValue && item.value > 0 && (
                                    <span className="text-[9px] sm:text-xs text-gray-500 mb-1 truncate w-full text-center">
                                        {formatValue(item.value)}
                                    </span>
                                )}
                                <div
                                    className={`w-full ${color} rounded-t hover:opacity-80 transition-opacity cursor-default`}
                                    style={{ height: `${Math.max(4, pctHeight)}%` }}
                                    title={`${item.label}: ${formatValue ? formatValue(item.value) : item.value}`}
                                />
                                <p className="text-[8px] sm:text-[10px] text-gray-400 mt-1 truncate w-full text-center">
                                    {item.label.split(" ")[0]}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
