"use client";

import { useState } from "react";
import Link from "next/link";
import { X, Megaphone, ArrowRight, Sparkles } from "lucide-react";

interface Announcement {
    id: string;
    message: string;
    link?: string;
    linkText?: string;
    type?: "info" | "celebration" | "new";
}

interface AnnouncementBannerProps {
    announcements?: Announcement[];
}

// Default announcements if none provided
const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
    {
        id: "welcome",
        message: "🎉 Welcome to AccrediPro! Complete your profile to unlock personalized recommendations.",
        link: "/start-here",
        linkText: "Get Started",
        type: "new",
    },
];

export function AnnouncementBanner({ announcements = DEFAULT_ANNOUNCEMENTS }: AnnouncementBannerProps) {
    const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

    // Filter out dismissed announcements
    const visibleAnnouncements = announcements.filter(a => !dismissedIds.has(a.id));

    if (visibleAnnouncements.length === 0) return null;

    const announcement = visibleAnnouncements[0];

    const dismiss = () => {
        setDismissedIds(prev => new Set([...prev, announcement.id]));
    };

    // Type-based styling
    const bgClass = announcement.type === "celebration"
        ? "bg-gradient-to-r from-gold-500 to-amber-500"
        : announcement.type === "new"
            ? "bg-gradient-to-r from-burgundy-600 to-burgundy-700"
            : "bg-gradient-to-r from-blue-500 to-blue-600";

    return (
        <div className={`${bgClass} text-white px-4 py-2.5 flex items-center justify-between gap-3 rounded-lg shadow-sm`}>
            <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="flex-shrink-0">
                    {announcement.type === "celebration" ? (
                        <Sparkles className="w-5 h-5 text-white" />
                    ) : (
                        <Megaphone className="w-5 h-5 text-white/80" />
                    )}
                </div>
                <p className="text-sm font-medium truncate">{announcement.message}</p>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
                {announcement.link && (
                    <Link
                        href={announcement.link}
                        className="text-xs font-semibold bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors"
                    >
                        {announcement.linkText || "Learn More"}
                        <ArrowRight className="w-3 h-3" />
                    </Link>
                )}
                <button
                    onClick={dismiss}
                    className="text-white/70 hover:text-white transition-colors p-1"
                    aria-label="Dismiss announcement"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
