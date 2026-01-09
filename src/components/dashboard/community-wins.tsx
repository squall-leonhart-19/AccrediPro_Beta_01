"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp } from "lucide-react";

interface SuccessEvent {
    zombieName: string;
    message: string;
}

interface CommunityWinsProps {
    events: SuccessEvent[];
}

export function CommunityWins({ events }: CommunityWinsProps) {
    return (
        <Card>
            <CardContent className="p-3 sm:p-4">
                <h3 className="font-semibold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                    Community Wins Today
                </h3>
                <div className="space-y-1.5 sm:space-y-2">
                    {events.slice(0, 3).map((event, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs sm:text-sm">
                            <span className="text-green-500 flex-shrink-0">🎉</span>
                            <span className="text-gray-700 font-medium truncate max-w-[80px] sm:max-w-none">{event.zombieName}</span>
                            <span className="text-gray-500 truncate">{event.message}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
