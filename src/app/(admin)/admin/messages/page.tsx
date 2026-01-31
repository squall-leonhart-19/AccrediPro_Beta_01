"use client";

import { Suspense, useEffect, useState } from "react";
import { MessagesClient } from "@/components/messages/messages-client";
import { useSession } from "next-auth/react";
import { MessageSquare, Clock, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

// Analytics bar data type
interface MessagesAnalytics {
    totalConversations: number;
    activeToday: number;
    avgResponseTimeHours: number;
    awaitingResponse: number;
}

// Analytics bar component
function AnalyticsBar() {
    const [analytics, setAnalytics] = useState<MessagesAnalytics | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAnalytics() {
            try {
                const res = await fetch("/api/admin/messages/analytics");
                if (res.ok) {
                    const data = await res.json();
                    setAnalytics(data);
                }
            } catch (error) {
                console.error("Failed to fetch message analytics:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="bg-gradient-to-r from-burgundy-700 to-burgundy-800 px-4 py-2 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <div className="w-4 h-4 bg-white/20 rounded animate-pulse" />
                            <div className="w-16 h-4 bg-white/20 rounded animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (!analytics) return null;

    return (
        <div className="bg-gradient-to-r from-burgundy-700 to-burgundy-800 px-4 py-2 flex items-center justify-between">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gold-400" />
                    <span className="text-white/80 text-xs">Conversations:</span>
                    <span className="text-white font-semibold text-sm">{analytics.totalConversations}</span>
                </div>
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-white/80 text-xs">Active Today:</span>
                    <span className="text-white font-semibold text-sm">{analytics.activeToday}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-blue-400" />
                    <span className="text-white/80 text-xs">Avg Response:</span>
                    <span className="text-white font-semibold text-sm">{analytics.avgResponseTimeHours}h</span>
                </div>
                <div className="flex items-center gap-2">
                    <MessageSquare className={`w-4 h-4 ${analytics.awaitingResponse > 0 ? 'text-red-400' : 'text-green-400'}`} />
                    <span className="text-white/80 text-xs">Awaiting Reply:</span>
                    <span className={`font-semibold text-sm ${analytics.awaitingResponse > 0 ? 'text-red-400' : 'text-green-400'}`}>
                        {analytics.awaitingResponse}
                    </span>
                </div>
            </div>
            <Link
                href="/admin/customer-care"
                className="text-xs text-gold-400 hover:text-gold-300 transition-colors"
            >
                Full Dashboard →
            </Link>
        </div>
    );
}

// Admin Messages Page - keeps user in admin layout
export default function AdminMessagesPage() {
    return (
        <div className="h-[calc(100vh-4rem)] -mx-4 -my-4 lg:-mx-8 lg:-my-8 flex flex-col">
            <AnalyticsBar />
            <div className="flex-1 min-h-0">
                <Suspense fallback={<MessagesLoadingSkeleton />}>
                    <AdminMessagesWrapper />
                </Suspense>
            </div>
        </div>
    );
}

function AdminMessagesWrapper() {
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <MessagesLoadingSkeleton />;
    }

    if (!session?.user?.id) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Please sign in to access messages</p>
            </div>
        );
    }

    return (
        <MessagesClient
            currentUserId={session.user.id}
            currentUserRole={session.user.role as string}
            currentUserName={`${session.user.firstName || ""} ${session.user.lastName || ""}`.trim()}
            currentUserAvatar={session.user.image || null}
        />
    );
}

function MessagesLoadingSkeleton() {
    return (
        <div className="flex h-full w-full bg-white overflow-hidden shadow-xl border border-gray-200/50">
            {/* Sidebar skeleton */}
            <div className="w-80 flex-shrink-0 border-r bg-slate-50 flex flex-col">
                <div className="p-4 border-b bg-burgundy-700">
                    <div className="h-10 bg-white/20 rounded-lg animate-pulse" />
                </div>
                <div className="flex-1 p-4 space-y-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex gap-3 p-3 rounded-lg bg-white">
                            <div className="w-12 h-12 rounded-full bg-slate-200 animate-pulse" />
                            <div className="flex-1 space-y-2">
                                <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse" />
                                <div className="h-3 bg-slate-100 rounded w-1/2 animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Chat area skeleton */}
            <div className="flex-1 flex flex-col min-w-0">
                <div className="h-16 border-b flex items-center px-6 gap-4">
                    <div className="w-10 h-10 rounded-full bg-slate-200 animate-pulse" />
                    <div className="space-y-2">
                        <div className="h-4 bg-slate-200 rounded w-32 animate-pulse" />
                        <div className="h-3 bg-slate-100 rounded w-24 animate-pulse" />
                    </div>
                </div>
                <div className="flex-1 flex items-center justify-center text-slate-400">
                    <div className="text-center">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 animate-pulse" />
                        <p>Loading messages...</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
