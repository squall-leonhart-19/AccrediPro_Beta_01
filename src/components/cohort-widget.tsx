"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Users,
    Trophy,
    Target,
    TrendingUp,
    Calendar
} from "lucide-react";
import { cn } from "@/lib/utils";

interface CohortMember {
    id: string;
    name: string;
    avatar?: string;
    progress: number;
    isCurrentUser?: boolean;
}

interface CohortWidgetProps {
    cohortName: string;
    cohortSlug?: string;
    startDate: Date;
    targetCertDate: Date;
    memberCount: number;
    certifiedCount: number;
    averageProgress: number;
    leaderboard?: CohortMember[];
    currentUserRank?: number;
    className?: string;
}

export function CohortWidget({
    cohortName,
    cohortSlug,
    startDate,
    targetCertDate,
    memberCount,
    certifiedCount,
    averageProgress,
    leaderboard = [],
    currentUserRank,
    className,
}: CohortWidgetProps) {
    const topMembers = leaderboard.slice(0, 5);

    return (
        <Card className={cn("bg-gradient-to-br from-indigo-50 to-white border-indigo-100", className)}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                            <Users className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <span className="text-indigo-800">{cohortName}</span>
                            <p className="text-xs font-normal text-indigo-600">
                                Started {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                            </p>
                        </div>
                    </CardTitle>
                    <Badge className="bg-indigo-100 text-indigo-700">
                        {memberCount} members
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white rounded-lg p-2 border border-indigo-100">
                        <Trophy className="w-4 h-4 text-gold-500 mx-auto mb-1" />
                        <p className="text-lg font-bold text-indigo-700">{certifiedCount}</p>
                        <p className="text-xs text-gray-500">Certified</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border border-indigo-100">
                        <TrendingUp className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                        <p className="text-lg font-bold text-emerald-700">{averageProgress}%</p>
                        <p className="text-xs text-gray-500">Class Avg</p>
                    </div>
                    <div className="bg-white rounded-lg p-2 border border-indigo-100">
                        <Calendar className="w-4 h-4 text-burgundy-500 mx-auto mb-1" />
                        <p className="text-lg font-bold text-burgundy-700">
                            {targetCertDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                        <p className="text-xs text-gray-500">Target</p>
                    </div>
                </div>

                {/* Class progress bar */}
                <div className="bg-white rounded-lg p-3 border border-indigo-100">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                            <Target className="w-4 h-4 text-indigo-500" />
                            Class Progress
                        </span>
                        <span className="text-sm text-indigo-600 font-semibold">
                            {certifiedCount} / {memberCount} certified
                        </span>
                    </div>
                    <Progress value={(certifiedCount / memberCount) * 100} className="h-2" />
                </div>

                {/* Leaderboard */}
                {topMembers.length > 0 && (
                    <div>
                        <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                            <Trophy className="w-4 h-4 text-gold-500" />
                            Class Leaderboard
                        </h4>
                        <div className="space-y-2">
                            {topMembers.map((member, index) => (
                                <div
                                    key={member.id}
                                    className={cn(
                                        "flex items-center gap-2 p-2 rounded-lg",
                                        member.isCurrentUser && "bg-indigo-100/50 ring-1 ring-indigo-200"
                                    )}
                                >
                                    <span className={cn(
                                        "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold",
                                        index === 0 ? "bg-gold-400 text-white" :
                                            index === 1 ? "bg-gray-300 text-gray-700" :
                                                index === 2 ? "bg-amber-600 text-white" :
                                                    "bg-gray-100 text-gray-600"
                                    )}>
                                        {index + 1}
                                    </span>
                                    <Avatar className="w-6 h-6">
                                        <AvatarImage src={member.avatar} />
                                        <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700">
                                            {member.name.split(" ").map(n => n[0]).join("")}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className={cn(
                                        "flex-1 truncate text-sm",
                                        member.isCurrentUser && "font-semibold text-indigo-700"
                                    )}>
                                        {member.name}
                                        {member.isCurrentUser && " (You)"}
                                    </span>
                                    <span className="text-xs text-gray-500">{member.progress}%</span>
                                </div>
                            ))}
                        </div>
                        {currentUserRank && currentUserRank > 5 && (
                            <p className="text-xs text-center text-gray-500 mt-2">
                                You're ranked #{currentUserRank} in your class
                            </p>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

// Compact cohort badge for certificates
export function CohortBadge({
    cohortName,
    startDate,
    className
}: {
    cohortName: string;
    startDate: Date;
    className?: string;
}) {
    return (
        <div className={cn(
            "inline-flex items-center gap-2 px-3 py-1.5 rounded-full",
            "bg-gradient-to-r from-indigo-100 to-purple-100",
            "border border-indigo-200 text-indigo-800",
            className
        )}>
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">{cohortName}</span>
            <span className="text-xs text-indigo-600">
                {startDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </span>
        </div>
    );
}

// Compact version for dashboard
export function CohortWidgetCompact({
    cohortName,
    memberCount,
    certifiedCount,
    averageProgress,
    currentUserRank,
    className,
}: CohortWidgetProps) {
    return (
        <Card className={cn("bg-gradient-to-br from-indigo-500 to-indigo-600 border-0 text-white", className)}>
            <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Users className="w-5 h-5" />
                    <span className="font-semibold">{cohortName}</span>
                </div>

                <div className="flex items-center justify-between mb-2">
                    <div>
                        <p className="text-2xl font-bold">{certifiedCount}</p>
                        <p className="text-xs text-white/70">certified</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold">{averageProgress}%</p>
                        <p className="text-xs text-white/70">class avg</p>
                    </div>
                </div>

                {currentUserRank && (
                    <div className="flex items-center gap-1 text-xs text-white/80">
                        <Trophy className="w-3 h-3" />
                        <span>You're #{currentUserRank} of {memberCount}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
