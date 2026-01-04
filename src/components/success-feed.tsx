"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { GraduationCap, DollarSign, Flame, Star, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface SuccessEvent {
    id: string;
    userName: string;
    userAvatar?: string;
    eventType: string;
    message: string;
    createdAt: Date;
    isZombie?: boolean;
}

interface SuccessFeedProps {
    events?: SuccessEvent[];
    className?: string;
    maxEvents?: number;
}

// Get icon for event type
function getEventIcon(eventType: string) {
    switch (eventType) {
        case "certified":
            return <GraduationCap className="w-4 h-4" />;
        case "milestone_500":
        case "milestone_1000":
        case "milestone_5000":
        case "first_client":
            return <DollarSign className="w-4 h-4" />;
        case "streak_7":
        case "streak_14":
        case "streak_30":
            return <Flame className="w-4 h-4" />;
        default:
            return <Star className="w-4 h-4" />;
    }
}

// Get color for event type
function getEventColor(eventType: string) {
    if (eventType.includes("certified")) return "bg-gold-500";
    if (eventType.includes("milestone") || eventType.includes("client")) return "bg-emerald-500";
    if (eventType.includes("streak")) return "bg-orange-500";
    return "bg-burgundy-500";
}

// Time ago helper
function timeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
}

export function SuccessFeed({ events = [], className, maxEvents = 5 }: SuccessFeedProps) {
    const [displayEvents, setDisplayEvents] = useState<SuccessEvent[]>(events.slice(0, maxEvents));

    useEffect(() => {
        setDisplayEvents(events.slice(0, maxEvents));
    }, [events, maxEvents]);

    if (displayEvents.length === 0) {
        return (
            <Card className={cn("", className)}>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Users className="w-5 h-5 text-burgundy-500" />
                        Community Wins
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500 text-sm">Be the first to achieve something amazing!</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={cn("", className)}>
            <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5 text-burgundy-500" />
                    Community Wins
                    <Badge variant="secondary" className="ml-auto text-xs">
                        Live
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                {displayEvents.map((event, index) => (
                    <div
                        key={event.id}
                        className={cn(
                            "flex items-start gap-3 p-2 rounded-lg transition-all",
                            "bg-gradient-to-r from-transparent to-gray-50",
                            "hover:from-burgundy-50/50 hover:to-burgundy-50/30"
                        )}
                        style={{
                            animationDelay: `${index * 100}ms`,
                            animation: "fadeIn 0.3s ease-out forwards"
                        }}
                    >
                        {/* Avatar with event badge */}
                        <div className="relative">
                            <Avatar className="w-10 h-10 border-2 border-white shadow-sm">
                                <AvatarImage src={event.userAvatar} />
                                <AvatarFallback className="bg-burgundy-100 text-burgundy-700 text-sm font-semibold">
                                    {event.userName.split(" ").map(n => n[0]).join("")}
                                </AvatarFallback>
                            </Avatar>
                            <div className={cn(
                                "absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white",
                                getEventColor(event.eventType)
                            )}>
                                {getEventIcon(event.eventType)}
                            </div>
                        </div>

                        {/* Event content */}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                                {event.message}
                            </p>
                            <p className="text-xs text-gray-500">
                                {timeAgo(new Date(event.createdAt))}
                            </p>
                        </div>
                    </div>
                ))}

                {/* View more link */}
                <button className="w-full text-center text-sm text-burgundy-600 hover:text-burgundy-700 font-medium py-2">
                    View all celebrations →
                </button>
            </CardContent>

            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
        </Card>
    );
}

// Compact version for dashboard sidebar
export function SuccessFeedCompact({ events = [], className, maxEvents = 3 }: SuccessFeedProps) {
    const displayEvents = events.slice(0, maxEvents);

    if (displayEvents.length === 0) return null;

    return (
        <Card className={cn("bg-gradient-to-br from-burgundy-50 to-white border-burgundy-100", className)}>
            <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg bg-burgundy-500 flex items-center justify-center">
                        <Star className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-burgundy-800">Community Wins</span>
                    <Badge className="ml-auto bg-burgundy-100 text-burgundy-700 text-xs">
                        Live
                    </Badge>
                </div>

                <div className="space-y-2">
                    {displayEvents.map((event) => (
                        <div key={event.id} className="flex items-center gap-2 text-sm">
                            <div className={cn(
                                "w-5 h-5 rounded-full flex items-center justify-center text-white shrink-0",
                                getEventColor(event.eventType)
                            )}>
                                {getEventIcon(event.eventType)}
                            </div>
                            <span className="text-gray-700 truncate">{event.message}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
