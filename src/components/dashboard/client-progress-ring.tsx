"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Target, ChevronDown } from "lucide-react";
import { useState } from "react";

interface ClientProgressRingProps {
    completedLessonsCount: number;
    certificates: number;
    incomeGoal: string;
}

export function ClientProgressRing({
    completedLessonsCount,
    certificates,
    incomeGoal,
}: ClientProgressRingProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Client-ready requires 15 lessons
    const clientReadyLessons = 15;
    const progress = Math.min(100, Math.round((completedLessonsCount / clientReadyLessons) * 100));
    const isClientReady = progress >= 100;

    // Calculate checklist items
    const milestones = [
        { label: "Complete 15 core lessons", done: completedLessonsCount >= 15 },
        { label: "Pass Module 1 Quiz", done: completedLessonsCount >= 5 },
        { label: "Complete Client Assessment training", done: completedLessonsCount >= 12 },
        { label: "Get your certification", done: certificates > 0 },
        { label: "Set up your practice profile", done: false },
    ];
    const completedMilestones = milestones.filter(m => m.done).length;

    // SVG progress ring calculations
    const size = 80;
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <Card className="bg-gradient-to-br from-gold-50/50 to-white shadow-sm overflow-hidden">
            <CardContent className="p-4 sm:p-6">
                {/* Mobile: Compact Progress Ring View */}
                <div className="flex items-center gap-4">
                    {/* Progress Ring */}
                    <div className="relative flex-shrink-0">
                        <svg width={size} height={size} className="transform -rotate-90">
                            {/* Background circle */}
                            <circle
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                stroke="#E5E7EB"
                                strokeWidth={strokeWidth}
                                fill="none"
                            />
                            {/* Progress circle */}
                            <circle
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                stroke={isClientReady ? "#22C55E" : "#B45309"}
                                strokeWidth={strokeWidth}
                                fill="none"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                strokeLinecap="round"
                                className="transition-all duration-500"
                            />
                        </svg>
                        {/* Center content */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-lg font-bold text-gray-900">{progress}%</span>
                            <span className="text-[10px] text-gray-500">Ready</span>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-sm sm:text-base">
                            <Target className="w-4 h-4 text-gold-600" />
                            Client-Ready Progress
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 mt-1">
                            {isClientReady
                                ? "✅ You're ready to take on clients!"
                                : `${completedMilestones}/5 milestones complete`}
                        </p>
                        <p className="text-xs text-gold-700 font-medium mt-1">
                            Goal: {incomeGoal}
                        </p>
                    </div>

                    {/* Expand button - mobile only */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label={isExpanded ? "Collapse checklist" : "Expand checklist"}
                    >
                        <ChevronDown
                            className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        />
                    </button>
                </div>

                {/* Expanded checklist - always visible on desktop, toggle on mobile */}
                <div className={`mt-4 space-y-2 ${isExpanded ? 'block' : 'hidden lg:block'}`}>
                    {milestones.map((item, i) => (
                        <div
                            key={i}
                            className={`flex items-center gap-2 p-2 rounded-lg text-sm ${item.done ? 'bg-green-50' : 'bg-gray-50'
                                }`}
                        >
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-green-500' : 'bg-gray-200'
                                }`}>
                                {item.done ? (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                ) : (
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full" />
                                )}
                            </div>
                            <span className={`${item.done ? 'text-green-700 line-through' : 'text-gray-700'}`}>
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
