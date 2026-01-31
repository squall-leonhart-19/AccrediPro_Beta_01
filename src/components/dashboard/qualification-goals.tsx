"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Calendar, DollarSign, Heart, ChevronRight } from "lucide-react";
import Link from "next/link";

interface QualificationGoalsProps {
    userId: string;
}

interface QualificationData {
    incomeGoal: string | null;
    timeline: string | null;
    situation: string | null;
    firstClientDate: string | null;
    drivers: string[];
}

const incomeLabels: Record<string, string> = {
    "10k_plus": "$10,000+/month",
    "5k_10k": "$5,000-$10,000/month",
    "2k_5k": "$2,000-$5,000/month",
    "starter": "First paying clients",
};

const driverLabels: Record<string, { label: string; emoji: string }> = {
    "financial_freedom": { label: "Financial freedom", emoji: "💰" },
    "flexibility": { label: "Work from home", emoji: "🏠" },
    "loved_one": { label: "Help someone I love", emoji: "👶" },
    "burnout": { label: "Escape burnout", emoji: "🔥" },
    "purpose": { label: "Make an impact", emoji: "💪" },
    "credibility": { label: "Gain credibility", emoji: "🎓" },
    "entrepreneur": { label: "Build a business", emoji: "🚀" },
};

export function QualificationGoals({ userId }: QualificationGoalsProps) {
    const [data, setData] = useState<QualificationData | null>(null);
    const [loading, setLoading] = useState(true);
    const [daysRemaining, setDaysRemaining] = useState<number | null>(null);

    useEffect(() => {
        async function fetchQualificationData() {
            try {
                const res = await fetch("/api/user/tags");
                if (!res.ok) return;

                const { tags } = await res.json();
                if (!tags || tags.length === 0) {
                    setLoading(false);
                    return;
                }

                const qualData: QualificationData = {
                    incomeGoal: null,
                    timeline: null,
                    situation: null,
                    firstClientDate: null,
                    drivers: [],
                };

                for (const tagObj of tags) {
                    const tag = tagObj.tag as string;
                    if (tag.startsWith("income_goal:")) {
                        qualData.incomeGoal = tag.split(":")[1];
                    } else if (tag.startsWith("timeline:")) {
                        qualData.timeline = tag.split(":")[1];
                    } else if (tag.startsWith("situation:")) {
                        qualData.situation = tag.split(":")[1];
                    } else if (tag.startsWith("first_client_date:")) {
                        qualData.firstClientDate = tag.split(":")[1];
                    } else if (tag.startsWith("driver:")) {
                        qualData.drivers.push(tag.split(":")[1]);
                    }
                }

                // Only show if they have at least income goal set
                if (!qualData.incomeGoal) {
                    setLoading(false);
                    return;
                }

                setData(qualData);

                // Calculate days remaining
                if (qualData.firstClientDate) {
                    const targetDate = new Date(qualData.firstClientDate);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    const diffTime = targetDate.getTime() - today.getTime();
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    setDaysRemaining(diffDays);
                }
            } catch (error) {
                console.error("Failed to fetch qualification data:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchQualificationData();
    }, [userId]);

    if (loading || !data) {
        return null; // Don't show anything if no qualification data
    }

    const primaryDriver = data.drivers[0];
    const driverInfo = primaryDriver ? driverLabels[primaryDriver] : null;

    return (
        <Card className="border-burgundy-200 bg-gradient-to-r from-burgundy-50 to-gold-50 overflow-hidden">
            <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-burgundy-100 rounded-lg flex items-center justify-center">
                            <Target className="w-4 h-4 text-burgundy-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Your Goals</h3>
                    </div>
                    <Link href="/start-here/questions" className="text-xs text-burgundy-600 hover:underline flex items-center gap-1">
                        Edit <ChevronRight className="w-3 h-3" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {/* Income Goal */}
                    <div className="bg-white rounded-xl p-3 border border-gray-100">
                        <div className="flex items-center gap-2 mb-1">
                            <DollarSign className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-gray-500">Income Goal</span>
                        </div>
                        <p className="font-bold text-gray-900 text-sm">
                            {incomeLabels[data.incomeGoal!] || data.incomeGoal}
                        </p>
                    </div>

                    {/* First Client Countdown */}
                    {daysRemaining !== null && (
                        <div className={`rounded-xl p-3 border ${daysRemaining <= 7 ? "bg-red-50 border-red-200" : daysRemaining <= 30 ? "bg-amber-50 border-amber-200" : "bg-white border-gray-100"}`}>
                            <div className="flex items-center gap-2 mb-1">
                                <Calendar className="w-4 h-4 text-amber-600" />
                                <span className="text-xs text-gray-500">First Client</span>
                            </div>
                            <p className={`font-bold text-sm ${daysRemaining <= 7 ? "text-red-600" : daysRemaining <= 30 ? "text-amber-600" : "text-gray-900"}`}>
                                {daysRemaining > 0 ? `${daysRemaining} days` : daysRemaining === 0 ? "Today!" : "Passed"}
                            </p>
                        </div>
                    )}
                </div>

                {/* Motivation Reminder */}
                {driverInfo && (
                    <div className="mt-3 p-3 bg-white rounded-xl border border-burgundy-100 flex items-center gap-3">
                        <span className="text-xl">{driverInfo.emoji}</span>
                        <div className="flex-1">
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <Heart className="w-3 h-3" /> Remember why you started:
                            </p>
                            <p className="text-sm font-medium text-burgundy-700">{driverInfo.label}</p>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
