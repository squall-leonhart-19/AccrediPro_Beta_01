"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { MessagesClient } from "@/components/messages/messages-client";

interface Conversation {
    user: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        email: string;
        avatar: string | null;
        role: string;
        enrollments?: any[];
        badges?: any[];
        streak?: any;
        currentLesson?: any;
    };
    lastMessage: {
        id: string;
        content: string;
        senderId: string;
        createdAt: Date;
        isRead: boolean;
    };
    unreadCount: number;
}

interface Mentor {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    avatar: string | null;
    role: string;
    bio: string | null;
}

export function MessagesClientWrapper() {
    const { data: session, status } = useSession();
    const searchParams = useSearchParams();
    const initialChatUserId = searchParams?.get("chat") || null;

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [initialSelectedUser, setInitialSelectedUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        if (status !== "authenticated" || !session?.user?.id) return;

        try {
            // Fetch conversations and mentors in parallel
            const [convRes, mentorsRes] = await Promise.all([
                fetch("/api/messages/conversations"),
                fetch("/api/messages/mentors"),
            ]);

            const [convData, mentorsData] = await Promise.all([
                convRes.json(),
                mentorsRes.json(),
            ]);

            setConversations(convData.conversations || []);
            setMentors(mentorsData.mentors || []);

            // If initial chat user specified, fetch their info
            if (initialChatUserId) {
                const userRes = await fetch(`/api/messages/user/${initialChatUserId}`);
                const userData = await userRes.json();
                if (userData.user) {
                    setInitialSelectedUser(userData.user);
                }
            }
        } catch (error) {
            console.error("Failed to load messages:", error);
        } finally {
            setIsLoading(false);
        }
    }, [session?.user?.id, status, initialChatUserId]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Still loading session
    if (status === "loading") {
        return <LoadingState />;
    }

    // Not authenticated
    if (!session?.user?.id) {
        return null;
    }

    // Loading data
    if (isLoading) {
        return <LoadingState />;
    }

    return (
        <MessagesClient
            conversations={conversations}
            mentors={mentors}
            currentUserId={session.user.id}
            currentUserRole={session.user.role as string}
            initialSelectedUser={initialSelectedUser}
        />
    );
}

function LoadingState() {
    return (
        <div className="flex h-[calc(100vh-64px)] bg-white">
            {/* Sidebar */}
            <div className="w-80 border-r bg-slate-50 flex flex-col">
                <div className="p-4 border-b">
                    <div className="h-10 bg-slate-200 rounded-lg animate-pulse" />
                </div>
                <div className="flex-1 p-4 space-y-3">
                    {[...Array(5)].map((_, i) => (
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

            {/* Main area */}
            <div className="flex-1 flex items-center justify-center text-slate-400">
                <p>Loading conversations...</p>
            </div>
        </div>
    );
}
