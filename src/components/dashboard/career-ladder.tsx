"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Trophy } from "lucide-react";

const CAREER_STAGES = [
    { id: 1, title: "Certified Practitioner", income: "$3K-$5K/month" },
    { id: 2, title: "Working Practitioner", income: "$5K-$10K/month" },
    { id: 3, title: "Advanced & Master", income: "$10K-$30K/month" },
    { id: 4, title: "Business Scaler", income: "$30K-$50K/month" },
];

interface CareerLadderProps {
    currentStage: number;
}

export function CareerLadder({ currentStage }: CareerLadderProps) {
    return (
        <Card className="overflow-hidden shadow-sm">
            <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 p-3 sm:p-4">
                <h3 className="font-semibold text-white flex items-center gap-2 text-sm sm:text-base">
                    <Trophy className="w-4 h-4 sm:w-5 sm:h-5 text-gold-400" />
                    Your Career Path
                </h3>
            </div>
            <CardContent className="p-3 sm:p-4">
                {/* Horizontal scroll on mobile, vertical list on desktop */}
                <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 -mx-1 px-1 lg:mx-0 lg:px-0 scrollbar-hide">
                    {CAREER_STAGES.map((stage, i) => {
                        const isUnlocked = currentStage >= stage.id;
                        const isCurrent = currentStage === stage.id - 1;

                        return (
                            <div
                                key={stage.id}
                                className={`flex-shrink-0 lg:flex-shrink flex items-center gap-2 sm:gap-3 p-2 sm:p-2.5 rounded-lg min-w-[160px] lg:min-w-0 ${isUnlocked
                                    ? 'bg-green-50'
                                    : isCurrent
                                        ? 'bg-burgundy-50 ring-1 ring-burgundy-200'
                                        : 'bg-gray-50 opacity-50'
                                    }`}
                            >
                                <div
                                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-xs sm:text-sm font-bold text-white flex-shrink-0 ${isUnlocked ? 'bg-green-500' : 'bg-gray-300'
                                        }`}
                                >
                                    {isUnlocked ? '✓' : i + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs sm:text-sm font-medium text-gray-900 truncate">{stage.title}</p>
                                    <p className="text-xs text-gray-500">{stage.income}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
