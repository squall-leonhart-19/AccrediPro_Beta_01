"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquare, X, ChevronRight } from "lucide-react";

interface UnansweredMessage {
    id: string;
    content: string;
    senderName: string;
    senderAvatar: string | null;
    createdAt: string;
}

export function UnansweredMessageBanner() {
    const [message, setMessage] = useState<UnansweredMessage | null>(null);
    const [dismissed, setDismissed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if dismissed in this session
        let sessionDismissed: string | null = null;
        try { sessionDismissed = sessionStorage.getItem("message-banner-dismissed"); } catch {}
        if (sessionDismissed) {
            setDismissed(true);
            setLoading(false);
            return;
        }

        // Fetch unanswered messages from coach
        fetch("/api/messages/unanswered")
            .then((res) => res.json())
            .then((data) => {
                if (data.success && data.message) {
                    setMessage(data.message);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleDismiss = () => {
        setDismissed(true);
        try { sessionStorage.setItem("message-banner-dismissed", "true"); } catch {}
    };

    if (loading || dismissed || !message) return null;

    // Format time ago
    const getTimeAgo = (date: string) => {
        const diff = Date.now() - new Date(date).getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours < 1) return "just now";
        if (hours === 1) return "1 hour ago";
        if (hours < 24) return `${hours} hours ago`;
        const days = Math.floor(hours / 24);
        if (days === 1) return "yesterday";
        return `${days} days ago`;
    };

    return (
        <div className="bg-gradient-to-r from-burgundy-600 via-burgundy-700 to-burgundy-800 rounded-xl p-4 shadow-lg border border-burgundy-500/30 animate-fade-in">
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-semibold text-sm">
                            💬 {message.senderName} sent you a message
                        </span>
                        <span className="text-burgundy-200 text-xs">{getTimeAgo(message.createdAt)}</span>
                    </div>
                    <p className="text-burgundy-100 text-sm line-clamp-2">
                        &ldquo;{message.content.slice(0, 120)}{message.content.length > 120 ? "..." : ""}&rdquo;
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-shrink-0">
                    <Link
                        href="/messages"
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-burgundy-700 font-semibold text-sm rounded-lg hover:bg-gold-100 transition-colors shadow-sm"
                    >
                        Reply Now
                        <ChevronRight className="w-4 h-4" />
                    </Link>
                    <button
                        onClick={handleDismiss}
                        className="p-1.5 text-burgundy-200 hover:text-white hover:bg-burgundy-600 rounded-lg transition-colors"
                        aria-label="Dismiss"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
