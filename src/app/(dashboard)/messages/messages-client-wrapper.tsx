"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { MessagesClient } from "@/components/messages/messages-client";
import { RefreshCw, MessageSquare, WifiOff } from "lucide-react";

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
        receiverId: string;
        createdAt: Date;
        isRead: boolean;
    } | null;
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

interface Student {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    avatar: string | null;
    role: string;
    enrollments?: any[];
}

// Safe fetch with retry for transient errors (429, 503, network)
async function safeFetch(url: string, retries = 2, delay = 1000): Promise<any> {
    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await fetch(url);

            if (response.ok) {
                return await response.json();
            }

            // Retry on 429 (rate limit) or 5xx (server errors)
            if ((response.status === 429 || response.status >= 500) && attempt < retries) {
                const retryAfter = response.headers.get("Retry-After");
                const waitMs = retryAfter ? parseInt(retryAfter) * 1000 : delay * (attempt + 1);
                await new Promise(resolve => setTimeout(resolve, waitMs));
                continue;
            }

            // Non-retryable error - return empty data structure
            console.warn(`[Messages] ${url} returned ${response.status}`);
            return null;
        } catch (error) {
            if (attempt < retries) {
                await new Promise(resolve => setTimeout(resolve, delay * (attempt + 1)));
                continue;
            }
            console.error(`[Messages] Failed to fetch ${url}:`, error);
            return null;
        }
    }
    return null;
}

export function MessagesClientWrapper() {
    const { data: session, status } = useSession();
    const searchParams = useSearchParams();
    const initialChatUserId = searchParams?.get("chat") || null;

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [initialSelectedUser, setInitialSelectedUser] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const retryCountRef = useRef(0);

    const isCoach = session?.user?.role && ["ADMIN", "INSTRUCTOR", "MENTOR"].includes(session.user.role as string);

    const fetchData = useCallback(async () => {
        if (status !== "authenticated" || !session?.user?.id) return;

        setIsLoading(true);
        setHasError(false);

        try {
            // Fetch conversations and mentors in parallel with safe retry
            const results = await Promise.all([
                safeFetch("/api/messages/conversations"),
                safeFetch("/api/messages/mentors"),
                ...(isCoach ? [safeFetch("/api/messages/students?limit=50")] : []),
            ]);

            const convData = results[0];
            const mentorsData = results[1];
            const studentsData = isCoach ? results[2] : null;

            // Check if critical data loaded (conversations OR mentors)
            if (!convData && !mentorsData) {
                setHasError(true);
                return;
            }

            setConversations(convData?.conversations || []);
            const fetchedMentors = mentorsData?.mentors || [];
            setMentors(fetchedMentors);

            if (isCoach && studentsData) {
                setStudents(studentsData.students || []);
            }

            // If initial chat user specified, fetch their info
            if (initialChatUserId) {
                const userData = await safeFetch(`/api/messages/user/${initialChatUserId}`);
                if (userData?.user) {
                    setInitialSelectedUser(userData.user);
                }
            } else {
                // AUTO-SELECT SARAH: If no chat param, default to Sarah for students
                const sarah = fetchedMentors.find((m: Mentor) => m.email === "sarah@accredipro-certificate.com");
                if (sarah) {
                    setInitialSelectedUser(sarah);
                }
            }

            retryCountRef.current = 0;
        } catch (error) {
            console.error("Failed to load messages:", error);
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    }, [session?.user?.id, status, initialChatUserId, isCoach]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRetry = useCallback(() => {
        retryCountRef.current += 1;
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

    // Error state - show retry UI instead of crashing
    if (hasError) {
        return <ErrorState onRetry={handleRetry} retryCount={retryCountRef.current} />;
    }

    return (
        <MessagesClient
            conversations={conversations}
            mentors={mentors}
            students={students}
            currentUserId={session.user.id}
            currentUserRole={session.user.role as string}
            initialSelectedUser={initialSelectedUser}
        />
    );
}

function ErrorState({ onRetry, retryCount }: { onRetry: () => void; retryCount: number }) {
    return (
        <div className="flex h-[calc(100vh-64px)] bg-white">
            {/* Sidebar */}
            <div className="w-80 border-r bg-slate-50 flex flex-col">
                <div className="p-4 border-b bg-burgundy-700">
                    <div className="h-10 bg-white/20 rounded-lg" />
                </div>
                <div className="flex-1" />
            </div>

            {/* Main area - error message */}
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center max-w-sm px-4">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                        <WifiOff className="w-8 h-8 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Couldn&apos;t load messages
                    </h3>
                    <p className="text-sm text-gray-500 mb-6">
                        {retryCount >= 3
                            ? "Still having trouble. Please try refreshing the page."
                            : "This usually fixes itself in a moment. Tap retry to try again."}
                    </p>
                    <button
                        onClick={onRetry}
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors text-sm font-medium"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Retry
                    </button>
                </div>
            </div>
        </div>
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
