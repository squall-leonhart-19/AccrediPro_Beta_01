"use client";

import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, Flame, ChevronRight, Medal, Crown } from "lucide-react";

interface PodMember {
    name: string;
    avatar: string;
    lessonsThisWeek: number;
    streak: number;
    isCurrentUser?: boolean;
}

interface PodLeaderboardPreviewProps {
    podMembers?: PodMember[];
    currentUserRank?: number;
}

// Default mock data
const DEFAULT_POD_MEMBERS: PodMember[] = [
    { name: "Sarah M.", avatar: "/zombie-avatars/zombie-1.jpg", lessonsThisWeek: 24, streak: 14 },
    { name: "Jennifer K.", avatar: "/zombie-avatars/zombie-2.jpg", lessonsThisWeek: 18, streak: 7 },
    { name: "You", avatar: "", lessonsThisWeek: 12, streak: 3, isCurrentUser: true },
    { name: "Lisa R.", avatar: "/zombie-avatars/zombie-3.jpg", lessonsThisWeek: 8, streak: 2 },
];

export function PodLeaderboardPreview({
    podMembers = DEFAULT_POD_MEMBERS,
    currentUserRank = 3
}: PodLeaderboardPreviewProps) {
    return (
        <Card className="shadow-sm">
            <CardContent className="p-3">
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-gold-500" />
                        <h3 className="font-semibold text-gray-900 text-sm">Pod Leaderboard</h3>
                    </div>
                    <Link
                        href="/my-circle"
                        className="text-xs text-burgundy-600 hover:text-burgundy-700 flex items-center gap-0.5"
                    >
                        View All
                        <ChevronRight className="w-3 h-3" />
                    </Link>
                </div>

                {/* Leaderboard List */}
                <div className="space-y-2">
                    {podMembers.slice(0, 4).map((member, index) => {
                        const rank = index + 1;
                        const isTop3 = rank <= 3;

                        return (
                            <div
                                key={index}
                                className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${member.isCurrentUser
                                        ? 'bg-burgundy-50 border border-burgundy-200'
                                        : 'hover:bg-gray-50'
                                    }`}
                            >
                                {/* Rank Badge */}
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${rank === 1 ? 'bg-gold-100 text-gold-700' :
                                        rank === 2 ? 'bg-gray-200 text-gray-600' :
                                            rank === 3 ? 'bg-amber-100 text-amber-700' :
                                                'bg-gray-100 text-gray-500'
                                    }`}>
                                    {rank === 1 ? <Crown className="w-3 h-3" /> :
                                        rank === 2 || rank === 3 ? <Medal className="w-3 h-3" /> :
                                            rank}
                                </div>

                                {/* Avatar */}
                                <div className="w-7 h-7 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                                    {member.avatar ? (
                                        <Image
                                            src={member.avatar}
                                            alt={member.name}
                                            width={28}
                                            height={28}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-burgundy-100 flex items-center justify-center text-burgundy-600 text-xs font-bold">
                                            {member.name.charAt(0)}
                                        </div>
                                    )}
                                </div>

                                {/* Name */}
                                <div className="flex-1 min-w-0">
                                    <p className={`text-xs font-medium truncate ${member.isCurrentUser ? 'text-burgundy-700' : 'text-gray-700'
                                        }`}>
                                        {member.name}
                                        {member.isCurrentUser && (
                                            <span className="ml-1 text-burgundy-500">(you)</span>
                                        )}
                                    </p>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                    <span className="font-semibold text-gray-700">{member.lessonsThisWeek}</span>
                                    <span className="hidden sm:inline">lessons</span>
                                    {member.streak > 0 && (
                                        <span className="flex items-center gap-0.5 text-orange-500">
                                            <Flame className="w-3 h-3" />
                                            {member.streak}
                                        </span>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Your Rank Footer */}
                {currentUserRank > 3 && (
                    <div className="mt-2 pt-2 border-t text-center">
                        <p className="text-xs text-gray-500">
                            You're <span className="font-semibold text-burgundy-600">#{currentUserRank}</span> this week.
                            <span className="text-burgundy-500"> Keep going! 💪</span>
                        </p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
