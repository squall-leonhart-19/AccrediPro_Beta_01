"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";
import type { DropoffPoint } from "./metric-types";

interface DropoffChartProps {
    lessons: DropoffPoint[];
    title?: string;
    description?: string;
}

export function DropoffChart({ lessons, title = "Lesson Drop-off Analysis", description = "Where users are leaving the mini diploma" }: DropoffChartProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                    {title}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-3 gap-2">
                    {lessons.map((lesson) => (
                        <div key={lesson.lesson} className="text-center">
                            <div
                                className={`h-20 sm:h-24 rounded-lg flex items-end justify-center p-2 ${
                                    lesson.dropRate > 25 ? "bg-red-100" :
                                    lesson.dropRate > 15 ? "bg-amber-100" :
                                    "bg-green-100"
                                }`}
                            >
                                <div
                                    className={`w-full rounded ${
                                        lesson.dropRate > 25 ? "bg-red-500" :
                                        lesson.dropRate > 15 ? "bg-amber-500" :
                                        "bg-green-500"
                                    }`}
                                    style={{ height: `${Math.max(10, lesson.dropRate * 2)}%` }}
                                />
                            </div>
                            <p className="text-xs font-medium mt-1.5">L{lesson.lesson}</p>
                            <p className={`text-xs ${
                                lesson.dropRate > 25 ? "text-red-600 font-bold" :
                                lesson.dropRate > 15 ? "text-amber-600" :
                                "text-green-600"
                            }`}>
                                {lesson.dropRate}%
                            </p>
                            <p className="text-xs text-gray-400">{lesson.count}</p>
                        </div>
                    ))}
                </div>
                <p className="text-xs text-gray-500 mt-4 text-center">
                    Drop rate = % of users who left after completing the previous lesson
                </p>
            </CardContent>
        </Card>
    );
}
