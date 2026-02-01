"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    MessageCircle,
    X,
    Send,
    Loader2,
    ArrowRight,
    EyeOff,
    Eye,
    ChevronUp,
} from "lucide-react";
import { toast } from "sonner";

interface Message {
    id: string;
    content: string;
    senderId: string;
    createdAt: Date;
    isRead: boolean;
}

interface FloatingCoachWidgetProps {
    userName?: string;
    userId?: string;
    currentLessonCount?: number;
    nextMilestone?: number;
}

// Dynamic greetings based on time of day
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
}

// localStorage key for hiding chat widget
const CHAT_HIDDEN_KEY = "accredipro_chat_hidden";

export function FloatingCoachWidget({ userName, userId }: FloatingCoachWidgetProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isChatMode, setIsChatMode] = useState(false);
    const [isHidden, setIsHidden] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [isSending, setIsSending] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [coachId, setCoachId] = useState<string | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    // Refs for stable references
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    // Use ref for input value to avoid re-renders that close keyboard
    const inputValueRef = useRef("");
    const [, forceRender] = useState(0);

    const greeting = getGreeting();
    const name = userName || "there";
    const pathname = usePathname();

    // Load hidden state from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(CHAT_HIDDEN_KEY);
        if (stored === "true") {
            setIsHidden(true);
        }
    }, []);

    // Toggle hide state and persist to localStorage
    const toggleHidden = useCallback(() => {
        setIsHidden(prev => {
            const newValue = !prev;
            localStorage.setItem(CHAT_HIDDEN_KEY, String(newValue));
            if (newValue) {
                setIsExpanded(false);
                setIsChatMode(false);
            }
            return newValue;
        });
    }, []);

    // Fetch mentors to get Coach Sarah's ID
    useEffect(() => {
        const abortController = new AbortController();

        fetch("/api/messages/mentors", { signal: abortController.signal })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => {
                if (abortController.signal.aborted) return;
                const sarah = data.mentors?.find((m: any) =>
                    m.email === "sarah@accredipro-certificate.com"
                );
                const mentor = sarah ||
                    data.mentors?.find((m: any) => m.firstName?.toLowerCase() === "sarah") ||
                    data.mentors?.[0];
                if (mentor) setCoachId(mentor.id);
            })
            .catch((err) => {
                if (err.name === "AbortError") return;
            });

        return () => abortController.abort();
    }, []);

    // Fetch unread count periodically
    useEffect(() => {
        if (!coachId) return;

        const checkUnread = async () => {
            try {
                const res = await fetch(`/api/messages?userId=${coachId}&limit=50`);
                if (!res.ok) return;
                const data = await res.json();
                if (data.success && data.data) {
                    const unread = data.data.filter((m: any) =>
                        m.senderId === coachId && !m.isRead
                    ).length;
                    setUnreadCount(unread);
                }
            } catch {
                // Silent fail
            }
        };

        checkUnread();
        const interval = setInterval(checkUnread, 30000);
        return () => clearInterval(interval);
    }, [coachId]);

    // Fetch messages when chat mode is enabled
    const fetchMessages = useCallback(async (offset = 0) => {
        if (!coachId) return;

        if (offset === 0) {
            setIsLoading(true);
        } else {
            setLoadingMore(true);
        }

        try {
            const res = await fetch(`/api/messages?userId=${coachId}&limit=20&offset=${offset}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            if (data.success && data.data) {
                const textMessages = data.data.filter((m: any) => !m.attachmentType || m.attachmentType === null);

                if (offset === 0) {
                    setMessages(textMessages);
                    setUnreadCount(0);
                } else {
                    setMessages(prev => [...textMessages, ...prev]);
                }

                setHasMore(textMessages.length === 20);
            }
        } catch {
            toast.error("Could not load messages.");
        } finally {
            setIsLoading(false);
            setLoadingMore(false);
        }
    }, [coachId]);

    // Load more messages
    const loadMoreMessages = useCallback(() => {
        if (!hasMore || loadingMore) return;
        fetchMessages(messages.length);
    }, [hasMore, loadingMore, messages.length, fetchMessages]);

    useEffect(() => {
        if (isChatMode && coachId) fetchMessages();
    }, [isChatMode, coachId, fetchMessages]);

    // Scroll to bottom
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    // Send message - using ref value, not state
    const handleSendMessage = useCallback(async () => {
        const content = inputValueRef.current.trim();
        if (!content || !coachId || isSending) return;

        // Clear input immediately
        if (inputRef.current) {
            inputRef.current.value = "";
        }
        inputValueRef.current = "";
        setIsSending(true);

        // Optimistic update
        const tempMessage: Message = {
            id: `temp-${Date.now()}`,
            content,
            senderId: userId || "user",
            createdAt: new Date(),
            isRead: false,
        };
        setMessages(prev => [...prev, tempMessage]);
        setTimeout(scrollToBottom, 100);

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ receiverId: coachId, content }),
            });
            const data = await res.json();
            if (data.success && data.data) {
                setMessages(prev => prev.map(m => m.id === tempMessage.id ? data.data : m));
            }
        } catch {
            setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
            toast.error("Failed to send message.");
        } finally {
            setIsSending(false);
            // Keep focus on input after sending
            inputRef.current?.focus();
        }
    }, [coachId, userId, isSending, scrollToBottom]);

    // Handle form submit - prevent default
    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        handleSendMessage();
    }, [handleSendMessage]);

    // Handle input change - update ref, not state (prevents re-render)
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        inputValueRef.current = e.target.value;
    }, []);

    // Handle keyboard enter
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    }, [handleSendMessage]);

    // Close widget
    const handleClose = useCallback(() => {
        setIsExpanded(false);
        setIsChatMode(false);
    }, []);

    // Open chat directly
    const openChat = useCallback(() => {
        setIsExpanded(true);
        setIsChatMode(true);
    }, []);

    // Hide widget entirely on /messages page to avoid overlapping the chat input
    if (pathname === "/messages") {
        return null;
    }

    // Show minimal "show chat" button when hidden
    if (isHidden) {
        return (
            <button
                onClick={toggleHidden}
                className="fixed bottom-4 right-4 z-50 w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-500 hover:text-gray-700 flex items-center justify-center shadow-md transition-all duration-200 hover:scale-110 opacity-60 hover:opacity-100"
                title="Show chat"
                aria-label="Show chat with Coach Sarah"
            >
                <Eye className="w-4 h-4" />
            </button>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Expanded Card */}
            {isExpanded && (
                <Card className="mb-3 w-80 max-w-[calc(100vw-32px)] shadow-2xl border-0 bg-white animate-in slide-in-from-bottom-2 duration-200 overflow-hidden flex flex-col" style={{ maxHeight: 'min(500px, calc(100vh - 100px))' }}>
                    <CardContent className="p-0 flex flex-col flex-1 min-h-0">
                        {/* Header - Fixed */}
                        <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 p-3 flex-shrink-0">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Image
                                            src="/coaches/sarah-coach.webp"
                                            alt="Coach Sarah"
                                            width={36}
                                            height={36}
                                            className="rounded-full border-2 border-gold-400"
                                        />
                                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-burgundy-600 rounded-full"></span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white text-sm">Coach Sarah</h4>
                                        <p className="text-xs text-green-300 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                            Online now
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={toggleHidden}
                                        onMouseDown={(e) => e.preventDefault()}
                                        className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10"
                                        title="Hide chat widget"
                                    >
                                        <EyeOff className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={handleClose}
                                        onMouseDown={(e) => e.preventDefault()}
                                        className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10"
                                        title="Close"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Chat Mode */}
                        {isChatMode ? (
                            <div className="flex flex-col flex-1 min-h-0">
                                {/* Messages - Scrollable */}
                                <div
                                    ref={scrollContainerRef}
                                    className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50"
                                    style={{ minHeight: '200px', maxHeight: '300px' }}
                                >
                                    {/* Load More Button */}
                                    {hasMore && (
                                        <div className="flex justify-center py-2">
                                            <button
                                                onClick={loadMoreMessages}
                                                onMouseDown={(e) => e.preventDefault()}
                                                disabled={loadingMore}
                                                className="text-xs text-burgundy-600 hover:text-burgundy-700 flex items-center gap-1 px-3 py-1.5 bg-white rounded-full shadow-sm border hover:bg-gray-50 disabled:opacity-50"
                                            >
                                                {loadingMore ? (
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                ) : (
                                                    <ChevronUp className="w-3 h-3" />
                                                )}
                                                Load older messages
                                            </button>
                                        </div>
                                    )}

                                    {isLoading ? (
                                        <div className="flex items-center justify-center h-full text-gray-400">
                                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                            <span className="text-xs">Loading...</span>
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                            <MessageCircle className="w-8 h-8 mb-2 opacity-50" />
                                            <p className="text-xs">Say hi to Coach Sarah!</p>
                                        </div>
                                    ) : (
                                        <>
                                            {messages.map((msg) => {
                                                const isUser = msg.senderId === userId;
                                                return (
                                                    <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                                        <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${isUser
                                                            ? 'bg-burgundy-600 text-white'
                                                            : 'bg-white text-gray-800 border shadow-sm'
                                                            }`}>
                                                            <p className="break-words">{msg.content}</p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <div ref={messagesEndRef} />
                                        </>
                                    )}
                                </div>

                                {/* Input - Fixed at bottom */}
                                <div className="p-2 border-t bg-white flex-shrink-0">
                                    <form onSubmit={handleSubmit} className="flex gap-2">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            inputMode="text"
                                            enterKeyHint="send"
                                            autoComplete="off"
                                            autoCorrect="off"
                                            autoCapitalize="sentences"
                                            spellCheck={false}
                                            onChange={handleInputChange}
                                            onKeyDown={handleKeyDown}
                                            placeholder="Type a message..."
                                            className="flex-1 px-3 py-2 text-base border rounded-full focus:outline-none focus:ring-2 focus:ring-burgundy-500 bg-gray-50"
                                            style={{ fontSize: '16px' }}
                                            disabled={isSending || !coachId}
                                        />
                                        <Button
                                            type="submit"
                                            size="sm"
                                            disabled={isSending || !coachId}
                                            onMouseDown={(e) => e.preventDefault()}
                                            className="rounded-full w-9 h-9 p-0 bg-burgundy-600 hover:bg-burgundy-700 flex-shrink-0"
                                        >
                                            {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                        </Button>
                                    </form>
                                    <p className="text-[10px] text-center text-gray-400 mt-1">
                                        For voice & full history → <a href="/messages" className="text-burgundy-600 hover:underline">Messages page</a>
                                    </p>
                                </div>
                            </div>
                        ) : (
                            /* Initial Mode - Greeting */
                            <div className="p-4">
                                <div className="bg-gray-50 rounded-xl p-3 mb-3">
                                    <p className="text-sm text-gray-700">{greeting}, {name}! How can I help today? 🌟</p>
                                </div>
                                <Button
                                    onClick={() => setIsChatMode(true)}
                                    onMouseDown={(e) => e.preventDefault()}
                                    className="w-full bg-burgundy-600 hover:bg-burgundy-700 h-10 text-sm font-medium"
                                >
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Chat with Sarah
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Floating Button - With Notification Badge */}
            <button
                onClick={openChat}
                onMouseDown={(e) => e.preventDefault()}
                aria-label="Open chat with Coach Sarah"
                className="group relative flex items-center gap-2 shadow-lg transition-all duration-200 hover:scale-105 pl-1.5 pr-4 py-1.5 rounded-full bg-white border border-gray-200 hover:border-burgundy-300 hover:shadow-xl cursor-pointer"
            >
                {/* Notification Badge */}
                {unreadCount > 0 ? (
                    <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-xs font-bold animate-pulse shadow-md">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                ) : (
                    <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-gold-500"></span>
                    </span>
                )}
                <div className="relative">
                    <Image
                        src="/coaches/sarah-coach.webp"
                        alt="Coach Sarah"
                        width={32}
                        height={32}
                        className="rounded-full border-2 border-burgundy-100 group-hover:border-burgundy-300"
                    />
                    <span className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 border border-white rounded-full"></span>
                </div>
                <span className="font-medium text-sm text-gray-700 hidden sm:inline">Ask Sarah</span>
            </button>
        </div>
    );
}
