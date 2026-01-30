"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import { SessionProvider, useSession } from "next-auth/react";

// ============================================
// CONSTANTS
// ============================================
const POLL_INTERVAL_MS = 30000;
const SCROLL_THRESHOLD_NEAR_BOTTOM = 50;
const SCROLL_THRESHOLD_SCROLLED_UP = 100;
const MAX_VISIBLE_MESSAGES = 25;
const TYPING_INDICATOR_CHANCE = 0.6;
const TYPING_INDICATOR_INTERVAL_MS = 15000;
const JOIN_NOTIFICATION_CHANCE = 0.5;
const JOIN_NOTIFICATION_INTERVAL_MS = 45000;
const JOIN_NOTIFICATION_INITIAL_DELAY_MS = 5000;

const ZOMBIE_JOIN_NAMES = [
    "Jennifer M.", "Lisa K.", "Michelle R.", "Sandra T.", "Patricia W.",
    "Nancy L.", "Karen B.", "Susan H.", "Linda G.", "Stephanie P.",
    "Rebecca J.", "Donna S.", "Deborah C.", "Carol A.", "Sharon N.",
    "Julie F.", "Christina V.", "Melissa D.", "Amy Z.", "Angela Q.",
] as const;

// ============================================
// STYLES (extracted to prevent re-creation)
// ============================================
const STYLES = {
    container: { display: "flex", flexDirection: "column" as const, height: "100%", background: "#fff" },
    header: {
        padding: "12px 16px",
        background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
        color: "#fff",
        flexShrink: 0
    },
    headerInner: { display: "flex", alignItems: "center", justifyContent: "space-between" },
    headerLeft: { display: "flex", alignItems: "center", gap: "8px" },
    liveIndicator: {
        width: "8px", height: "8px",
        background: "#86efac", borderRadius: "50%",
        animation: "pulse 2s infinite"
    },
    headerTitle: { fontWeight: 600, fontSize: "14px" },
    headerOnline: { fontSize: "12px", opacity: 0.9 },
    welcomeBanner: {
        padding: "10px 14px",
        background: "#f0fdf4",
        borderBottom: "1px solid #bbf7d0",
        fontSize: "13px",
        color: "#166534",
        flexShrink: 0
    },
    joinNotificationContainer: {
        height: "28px",
        overflow: "hidden",
        flexShrink: 0
    },
    joinNotification: (visible: boolean) => ({
        padding: "8px 14px",
        background: "#fef3c7",
        borderBottom: "1px solid #fde68a",
        fontSize: "12px",
        color: "#92400e",
        textAlign: "center" as const,
        opacity: visible ? 1 : 0,
        transition: "opacity 0.3s ease",
        height: visible ? "28px" : "0",
        padding: visible ? "8px 14px" : "0 14px"
    }),
    messagesContainer: { flex: 1, overflowY: "auto" as const, padding: "12px", background: "#fafafa", position: "relative" as const },
    messagesInner: { display: "flex", flexDirection: "column" as const, gap: "10px" },
    loadingText: { textAlign: "center" as const, color: "#999", padding: "40px 0" },
    emptyState: { textAlign: "center" as const, color: "#999", padding: "40px 0" },
    emptyEmoji: { fontSize: "40px", marginBottom: "12px" },
    emptyText: { fontSize: "13px" },
    typingIndicatorContainer: {
        minHeight: "24px",
        flexShrink: 0
    },
    typingIndicator: (visible: boolean) => ({
        display: "flex", gap: "8px", alignItems: "center",
        padding: "4px 0", color: "#666", fontSize: "12px",
        opacity: visible ? 1 : 0,
        transition: "opacity 0.2s ease"
    }),
    typingDots: { display: "flex", gap: "3px" },
    inputContainer: { borderTop: "1px solid #eee", padding: "12px", flexShrink: 0 },
    inputInner: { display: "flex", gap: "8px" },
    input: {
        flex: 1, padding: "10px 14px",
        border: "1px solid #ddd", borderRadius: "20px",
        fontSize: "13px", outline: "none"
    },
    sendButton: (sending: boolean) => ({
        padding: "10px 16px",
        background: sending ? "#999" : "#16a34a",
        color: "#fff", border: "none", borderRadius: "20px",
        cursor: sending ? "wait" : "pointer", fontSize: "13px",
        fontWeight: 500
    }),
    scrollToBottomButton: {
        position: "absolute" as const,
        bottom: "16px",
        left: "50%",
        transform: "translateX(-50%)",
        background: "#16a34a",
        color: "#fff",
        border: "none",
        borderRadius: "20px",
        padding: "8px 16px",
        fontSize: "12px",
        fontWeight: 500,
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        zIndex: 10
    },
    errorBanner: {
        padding: "10px 14px",
        background: "#fef2f2",
        borderBottom: "1px solid #fecaca",
        fontSize: "13px",
        color: "#991b1b",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexShrink: 0
    },
    retryButton: {
        background: "#dc2626",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        padding: "4px 12px",
        fontSize: "12px",
        cursor: "pointer"
    }
} as const;

const CSS_ANIMATIONS = `
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-3px); }
    }
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;

// ============================================
// TYPES
// ============================================
interface ChatMessage {
    id: string;
    content: string;
    createdAt: string;
    isZombie: boolean;
    isMe: boolean;
    user: {
        name: string;
        avatar: string | null;
    };
}

interface LiveChatPanelProps {
    courseId?: string;
    courseSlug?: string;
    isMobile?: boolean;
    onClose?: () => void;
}

// ============================================
// MEMOIZED MESSAGE COMPONENT
// ============================================
interface MessageItemProps {
    msg: ChatMessage;
    isOptimistic: boolean;
}

const MessageItem = memo(function MessageItem({ msg, isOptimistic }: MessageItemProps) {
    const isSarah = msg.user.name?.toLowerCase().includes("sarah");

    const containerStyle = {
        display: "flex", gap: "8px", alignItems: "flex-start",
        opacity: isOptimistic ? 0.6 : 1,
        ...(isSarah ? {
            background: "linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)",
            padding: "8px",
            borderRadius: "12px",
            border: "2px solid #f59e0b"
        } : {})
    };

    const avatarStyle = {
        width: "32px", height: "32px", borderRadius: "50%",
        background: msg.user.avatar ? `url(${msg.user.avatar}) center/cover` :
            isSarah ? "#f59e0b" : "#722f37",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontSize: "12px", fontWeight: 600, flexShrink: 0,
        border: isSarah ? "2px solid #d97706" : "none"
    };

    const nameStyle = {
        fontWeight: 600, fontSize: "12px",
        color: isSarah ? "#b45309" : msg.isMe ? "#722f37" : "#333"
    };

    const timeStyle = { fontSize: "10px", color: isSarah ? "#92400e" : "#999" };

    const bubbleStyle = {
        fontSize: "13px",
        color: isSarah ? "#78350f" : "#444",
        lineHeight: 1.4,
        background: isSarah ? "transparent" : msg.isMe ? "#f0e6e7" : "#fff",
        padding: isSarah ? "0" : "8px 12px",
        borderRadius: "12px",
        border: isSarah ? "none" : "1px solid #eee",
        wordBreak: "break-word" as const
    };

    return (
        <div style={containerStyle}>
            <div style={avatarStyle}>
                {!msg.user.avatar && (msg.user.name?.[0] || "?")}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                    <span style={nameStyle}>
                        {msg.isMe ? "You" : msg.user.name}
                        {isSarah && " ⭐"}
                    </span>
                    <span style={timeStyle}>
                        {formatTime(msg.createdAt)}
                    </span>
                </div>
                <div style={bubbleStyle}>
                    {msg.content}
                </div>
            </div>
        </div>
    );
});

// ============================================
// HELPER FUNCTIONS
// ============================================
function formatTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return "now";
    if (diffMins < 60) return `${diffMins}m`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
    return date.toLocaleDateString();
}

function getRandomZombieName(): string {
    return ZOMBIE_JOIN_NAMES[Math.floor(Math.random() * ZOMBIE_JOIN_NAMES.length)];
}

function deduplicateMessages(messages: ChatMessage[]): ChatMessage[] {
    const seen = new Set<string>();
    return messages.filter(msg => {
        if (seen.has(msg.id)) return false;
        seen.add(msg.id);
        return true;
    });
}

// ============================================
// MAIN COMPONENT
// ============================================
export function LiveChatPanel(props: LiveChatPanelProps) {
    return (
        <SessionProvider>
            <LiveChatPanelInner {...props} />
        </SessionProvider>
    );
}

function LiveChatPanelInner({ courseId, courseSlug, isMobile = false, onClose }: LiveChatPanelProps) {
    const { data: session } = useSession();

    // State
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [onlineCount, setOnlineCount] = useState(0);
    const [typingName, setTypingName] = useState<string | null>(null);
    const [joinNotification, setJoinNotification] = useState<string | null>(null);
    const [unreadCount, setUnreadCount] = useState(0);

    // Refs
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const isNearBottomRef = useRef(true);
    const userHasScrolledRef = useRef(false);
    const isInitialLoadRef = useRef(true);
    const lastMessageIdRef = useRef<string | null>(null);
    const abortControllerRef = useRef<AbortController | null>(null);

    // ============================================
    // FETCH MESSAGES (with delta polling support)
    // ============================================
    const fetchMessages = useCallback(async (isInitial = false) => {
        // Cancel any in-flight request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();

        try {
            const params = new URLSearchParams();
            if (courseId) params.set("courseId", courseId);
            if (courseSlug) params.set("courseSlug", courseSlug);

            // Delta polling: only fetch new messages after initial load
            if (!isInitial && lastMessageIdRef.current) {
                params.set("since", lastMessageIdRef.current);
            }

            const res = await fetch(`/api/lesson-chat/messages?${params}`, {
                signal: abortControllerRef.current.signal
            });

            if (!res.ok) throw new Error(`HTTP ${res.status}`);

            const data = await res.json();
            if (data.success) {
                setMessages(prev => {
                    let newMessages: ChatMessage[];

                    if (isInitial || !lastMessageIdRef.current) {
                        // Initial load: replace all
                        newMessages = data.data;
                    } else {
                        // Delta: merge new messages
                        newMessages = deduplicateMessages([...prev, ...data.data]);
                    }

                    // Update last message ID for next delta poll
                    if (newMessages.length > 0) {
                        lastMessageIdRef.current = newMessages[newMessages.length - 1].id;
                    }

                    // Track unread if user has scrolled up
                    if (userHasScrolledRef.current && data.data.length > 0) {
                        setUnreadCount(c => c + data.data.length);
                    }

                    return newMessages;
                });
                setOnlineCount(data.onlineCount);
                setError(null);
            }
        } catch (err) {
            if (err instanceof Error && err.name === "AbortError") {
                return; // Ignore aborted requests
            }
            console.error("Failed to fetch live chat:", err);
            setError("Failed to load messages");
        } finally {
            setLoading(false);
        }
    }, [courseId, courseSlug]);

    // ============================================
    // EFFECTS
    // ============================================

    // Initial fetch + visibility-aware polling
    useEffect(() => {
        fetchMessages(true);

        let interval: NodeJS.Timeout | null = null;

        const startPolling = () => {
            if (interval) clearInterval(interval);
            interval = setInterval(() => fetchMessages(false), POLL_INTERVAL_MS);
        };

        const stopPolling = () => {
            if (interval) {
                clearInterval(interval);
                interval = null;
            }
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchMessages(false);
                startPolling();
            } else {
                stopPolling();
            }
        };

        if (document.visibilityState === 'visible') {
            startPolling();
        }

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            stopPolling();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchMessages]);

    // Typing indicator simulation
    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        const showTyping = () => {
            setTypingName(getRandomZombieName());
            timeoutId = setTimeout(() => setTypingName(null), 2000 + Math.random() * 2000);
        };

        const interval = setInterval(() => {
            if (Math.random() > TYPING_INDICATOR_CHANCE) showTyping();
        }, TYPING_INDICATOR_INTERVAL_MS);

        return () => {
            clearInterval(interval);
            clearTimeout(timeoutId);
        };
    }, []);

    // Join notification simulation
    useEffect(() => {
        let notificationTimeoutId: NodeJS.Timeout;

        const showJoin = () => {
            setJoinNotification(getRandomZombieName());
            notificationTimeoutId = setTimeout(() => setJoinNotification(null), 3000);
        };

        const initialTimeout = setTimeout(showJoin, JOIN_NOTIFICATION_INITIAL_DELAY_MS);
        const interval = setInterval(() => {
            if (Math.random() > JOIN_NOTIFICATION_CHANCE) showJoin();
        }, JOIN_NOTIFICATION_INTERVAL_MS);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
            clearTimeout(notificationTimeoutId);
        };
    }, []);

    // Smart scroll effect
    useEffect(() => {
        if (!scrollContainerRef.current) return;

        if (isInitialLoadRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
            isInitialLoadRef.current = false;
        } else if (!userHasScrolledRef.current && isNearBottomRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [messages]);

    // ============================================
    // HANDLERS
    // ============================================
    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const el = e.target as HTMLDivElement;
        const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
        isNearBottomRef.current = distanceFromBottom < SCROLL_THRESHOLD_NEAR_BOTTOM;

        if (distanceFromBottom > SCROLL_THRESHOLD_SCROLLED_UP) {
            userHasScrolledRef.current = true;
        } else if (distanceFromBottom < SCROLL_THRESHOLD_NEAR_BOTTOM) {
            userHasScrolledRef.current = false;
            setUnreadCount(0);
        }
    }, []);

    const scrollToBottom = useCallback(() => {
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
            userHasScrolledRef.current = false;
            isNearBottomRef.current = true;
            setUnreadCount(0);
        }
    }, []);

    const sendMessage = useCallback(async () => {
        if (!input.trim() || sending) return;

        const content = input.trim();
        setInput("");
        setSending(true);
        isNearBottomRef.current = true;
        userHasScrolledRef.current = false;
        setUnreadCount(0);

        const tempId = `temp-${Date.now()}`;
        const optimisticMsg: ChatMessage = {
            id: tempId,
            content,
            createdAt: new Date().toISOString(),
            isZombie: false,
            isMe: true,
            user: { name: "You", avatar: session?.user?.image || null }
        };
        setMessages(prev => [...prev, optimisticMsg]);

        try {
            const res = await fetch("/api/lesson-chat/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId, courseSlug, content }),
            });
            const data = await res.json();
            if (data.success) {
                setMessages(prev => prev.map(m => m.id === tempId ? data.data : m));
                lastMessageIdRef.current = data.data.id;
            } else {
                throw new Error(data.error || "Failed to send");
            }
        } catch (err) {
            console.error("Failed to send:", err);
            setMessages(prev => prev.filter(m => m.id !== tempId));
            setError("Failed to send message");
        } finally {
            setSending(false);
            inputRef.current?.focus();
        }
    }, [input, sending, session?.user?.image, courseId, courseSlug]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    }, [sendMessage]);

    const handleRetry = useCallback(() => {
        setError(null);
        setLoading(true);
        fetchMessages(true);
    }, [fetchMessages]);

    // ============================================
    // RENDER
    // ============================================
    const visibleMessages = messages.slice(-MAX_VISIBLE_MESSAGES);
    const showScrollToBottom = userHasScrolledRef.current && unreadCount > 0;

    return (
        <div style={STYLES.container}>
            {/* Header */}
            <div style={STYLES.header}>
                <div style={STYLES.headerInner}>
                    <div style={STYLES.headerLeft}>
                        <div style={STYLES.liveIndicator} />
                        <span style={STYLES.headerTitle}>Student Lounge</span>
                    </div>
                    <div style={STYLES.headerOnline}>
                        🟢 {onlineCount} online
                    </div>
                </div>
            </div>

            {/* Error Banner */}
            {error && (
                <div style={STYLES.errorBanner}>
                    <span>⚠️ {error}</span>
                    <button onClick={handleRetry} style={STYLES.retryButton}>
                        Retry
                    </button>
                </div>
            )}

            {/* Welcome Banner */}
            <div style={STYLES.welcomeBanner}>
                👋 Welcome! Share your wins, ask questions, cheer each other on!
            </div>

            {/* Join Notification - Fixed height to prevent layout shift */}
            <div style={STYLES.joinNotificationContainer}>
                <div style={STYLES.joinNotification(!!joinNotification)}>
                    {joinNotification ? `✨ ${joinNotification} just joined the chat` : "\u00A0"}
                </div>
            </div>

            {/* Messages */}
            <div
                ref={scrollContainerRef}
                style={STYLES.messagesContainer}
                onScroll={handleScroll}
            >
                {loading ? (
                    <div style={STYLES.loadingText}>
                        Loading chat...
                    </div>
                ) : visibleMessages.length === 0 ? (
                    <div style={STYLES.emptyState}>
                        <div style={STYLES.emptyEmoji}>👋</div>
                        <div style={STYLES.emptyText}>Be the first to say hi!</div>
                    </div>
                ) : (
                    <div style={STYLES.messagesInner}>
                        {visibleMessages.map((msg) => (
                            <MessageItem
                                key={msg.id}
                                msg={msg}
                                isOptimistic={msg.id.startsWith("temp-")}
                            />
                        ))}

                        {/* Typing Indicator - Fixed height to prevent layout shift */}
                        <div style={STYLES.typingIndicatorContainer}>
                            <div style={STYLES.typingIndicator(!!typingName)}>
                                <div style={STYLES.typingDots}>
                                    <span style={{ animation: "bounce 1s infinite 0s" }}>•</span>
                                    <span style={{ animation: "bounce 1s infinite 0.2s" }}>•</span>
                                    <span style={{ animation: "bounce 1s infinite 0.4s" }}>•</span>
                                </div>
                                <span>{typingName ? `${typingName} is typing...` : "\u00A0"}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Scroll to Bottom Button */}
                {showScrollToBottom && (
                    <button onClick={scrollToBottom} style={STYLES.scrollToBottomButton}>
                        ↓ {unreadCount} new {unreadCount === 1 ? "message" : "messages"}
                    </button>
                )}
            </div>

            {/* Input */}
            <div style={STYLES.inputContainer}>
                <div style={STYLES.inputInner}>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={session ? "Say something nice..." : "Sign in to chat..."}
                        disabled={!session}
                        style={{
                            ...STYLES.input,
                            opacity: session ? 1 : 0.6,
                            cursor: session ? "text" : "not-allowed"
                        }}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={sending || !input.trim() || !session}
                        style={STYLES.sendButton(sending || !session)}
                    >
                        Send
                    </button>
                </div>
            </div>

            {/* CSS Animations */}
            <style>{CSS_ANIMATIONS}</style>
        </div>
    );
}
