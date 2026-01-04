"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
    Trophy,
    MessageCircle,
    Users,
    Crown,
    ChevronRight,
    Sparkles
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface PodMember {
    id: string;
    name: string;
    avatar?: string;
    progress: number;
    isCurrentUser?: boolean;
    isCoach?: boolean;
    isZombie?: boolean;
    status?: string; // Recent activity
}

interface StudyPodWidgetProps {
    podName: string;
    podId?: string;
    members: PodMember[];
    className?: string;
}

export function StudyPodWidget({ podName, podId, members, className }: StudyPodWidgetProps) {
    // Sort by progress (highest first)
    const sortedMembers = [...members].sort((a, b) => {
        // Coach always first
        if (a.isCoach) return -1;
        if (b.isCoach) return 1;
        // Then by progress
        return b.progress - a.progress;
    });

    const topMembers = sortedMembers.slice(0, 5);
    const currentUser = members.find(m => m.isCurrentUser);
    const currentUserRank = sortedMembers.findIndex(m => m.isCurrentUser) + 1;

    return (
        <Card className={cn("bg-gradient-to-br from-burgundy-50 to-white border-burgundy-100", className)}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-burgundy-500 flex items-center justify-center">
                            <Users className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <span className="text-burgundy-800">Your Study Pod</span>
                            <p className="text-xs font-normal text-burgundy-600">{podName}</p>
                        </div>
                    </CardTitle>
                    {podId && (
                        <Link href={`/my-pod`}>
                            <Button variant="ghost" size="sm" className="text-burgundy-600 hover:text-burgundy-700">
                                <MessageCircle className="w-4 h-4 mr-1" />
                                Chat
                            </Button>
                        </Link>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-3">
                {/* Leaderboard */}
                {topMembers.map((member, index) => (
                    <div
                        key={member.id}
                        className={cn(
                            "flex items-center gap-3 p-2 rounded-lg transition-all",
                            member.isCurrentUser && "bg-burgundy-100/50 ring-1 ring-burgundy-200",
                            member.isCoach && "bg-gold-50/50"
                        )}
                    >
                        {/* Rank */}
                        <div className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0",
                            index === 0 && !member.isCoach ? "bg-gold-400 text-white" : "bg-gray-100 text-gray-600"
                        )}>
                            {member.isCoach ? (
                                <Crown className="w-3 h-3 text-gold-600" />
                            ) : (
                                index + 1
                            )}
                        </div>

                        {/* Avatar */}
                        <Avatar className="w-8 h-8 border-2 border-white shadow-sm">
                            <AvatarImage src={member.avatar} />
                            <AvatarFallback className={cn(
                                "text-xs font-semibold",
                                member.isCoach ? "bg-gold-100 text-gold-700" : "bg-burgundy-100 text-burgundy-700"
                            )}>
                                {member.name.split(" ").map(n => n[0]).join("")}
                            </AvatarFallback>
                        </Avatar>

                        {/* Name and progress */}
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "text-sm font-medium truncate",
                                    member.isCurrentUser ? "text-burgundy-700" : "text-gray-700"
                                )}>
                                    {member.name}
                                    {member.isCurrentUser && " (You)"}
                                </span>
                                {member.isCoach && (
                                    <Badge className="bg-gold-100 text-gold-700 text-xs">Coach</Badge>
                                )}
                                {index === 0 && !member.isCoach && (
                                    <Sparkles className="w-3 h-3 text-gold-500" />
                                )}
                            </div>
                            {!member.isCoach && (
                                <div className="flex items-center gap-2 mt-1">
                                    <Progress value={member.progress} className="h-1.5 flex-1" />
                                    <span className="text-xs text-gray-500 w-8">{member.progress}%</span>
                                </div>
                            )}
                            {member.status && (
                                <p className="text-xs text-gray-500 mt-0.5 truncate">{member.status}</p>
                            )}
                        </div>
                    </div>
                ))}

                {/* Your rank summary */}
                {currentUser && currentUserRank > 5 && (
                    <div className="pt-2 border-t border-burgundy-100">
                        <p className="text-sm text-center text-burgundy-600">
                            You're ranked <span className="font-bold">#{currentUserRank}</span> in your pod
                        </p>
                    </div>
                )}

                {/* Go to pod chat */}
                {podId && (
                    <Link href="/my-pod">
                        <Button
                            className="w-full bg-burgundy-600 hover:bg-burgundy-700 text-white"
                            size="sm"
                        >
                            <MessageCircle className="w-4 h-4 mr-2" />
                            Open Pod Chat
                            <ChevronRight className="w-4 h-4 ml-auto" />
                        </Button>
                    </Link>
                )}
            </CardContent>
        </Card>
    );
}

// Compact version for smaller spaces
export function StudyPodWidgetCompact({ podName, members, className }: StudyPodWidgetProps) {
    const sortedMembers = [...members]
        .filter(m => !m.isCoach)
        .sort((a, b) => b.progress - a.progress)
        .slice(0, 3);

    return (
        <Card className={cn("bg-gradient-to-br from-burgundy-500 to-burgundy-600 border-0 text-white", className)}>
            <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Trophy className="w-5 h-5 text-gold-300" />
                    <span className="font-semibold">{podName}</span>
                </div>

                <div className="space-y-2">
                    {sortedMembers.map((member, index) => (
                        <div key={member.id} className="flex items-center gap-2">
                            <span className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold",
                                index === 0 ? "bg-gold-400 text-burgundy-800" : "bg-white/20"
                            )}>
                                {index + 1}
                            </span>
                            <span className={cn(
                                "flex-1 truncate text-sm",
                                member.isCurrentUser && "font-semibold"
                            )}>
                                {member.name}
                                {member.isCurrentUser && " ✓"}
                            </span>
                            <span className="text-xs text-white/70">{member.progress}%</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
