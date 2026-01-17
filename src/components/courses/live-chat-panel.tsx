"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";

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
    courseSlug?: string; // Alternative: for mini diplomas
    isMobile?: boolean;
    onClose?: () => void;
}

// Zombie names for "join" notifications
const ZOMBIE_JOIN_NAMES = [
    "Jennifer M.", "Lisa K.", "Michelle R.", "Sandra T.", "Patricia W.",
    "Nancy L.", "Karen B.", "Susan H.", "Linda G.", "Stephanie P.",
    "Rebecca J.", "Donna S.", "Deborah C.", "Carol A.", "Sharon N.",
    "Julie F.", "Christina V.", "Melissa D.", "Amy Z.", "Angela Q.",
];

export function LiveChatPanel({ courseId, courseSlug, isMobile = false, onClose }: LiveChatPanelProps) {
    const { data: session } = useSession();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [onlineCount, setOnlineCount] = useState(0);
    const [typingName, setTypingName] = useState<string | null>(null);
    const [joinNotification, setJoinNotification] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const isNearBottomRef = useRef(true);
    const inputRef = useRef<HTMLInputElement>(null);

    // Fetch messages
    const fetchMessages = useCallback(async () => {
        try {
            const param = courseId ? `courseId=${courseId}` : `courseSlug=${courseSlug}`;
            const res = await fetch(`/api/lesson-chat/messages?${param}`);
            const data = await res.json();
            if (data.success) {
                setMessages(data.data);
                setOnlineCount(data.onlineCount);
            }
        } catch (error) {
            console.error("Failed to fetch live chat:", error);
        } finally {
            setLoading(false);
        }
    }, [courseId]);

    // Initial fetch + polling
    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 10000);
        return () => clearInterval(interval);
    }, [fetchMessages]);

    // Simulate typing indicator randomly
    useEffect(() => {
        const showTyping = () => {
            const name = ZOMBIE_JOIN_NAMES[Math.floor(Math.random() * ZOMBIE_JOIN_NAMES.length)];
            setTypingName(name);
            setTimeout(() => setTypingName(null), 2000 + Math.random() * 2000);
        };

        const interval = setInterval(() => {
            if (Math.random() > 0.6) showTyping();
        }, 15000);

        return () => clearInterval(interval);
    }, []);

    // Simulate join notifications
    useEffect(() => {
        const showJoin = () => {
            const name = ZOMBIE_JOIN_NAMES[Math.floor(Math.random() * ZOMBIE_JOIN_NAMES.length)];
            setJoinNotification(name);
            setTimeout(() => setJoinNotification(null), 3000);
        };

        // Show first join after 5s
        const timeout = setTimeout(showJoin, 5000);
        const interval = setInterval(() => {
            if (Math.random() > 0.5) showJoin();
        }, 45000);

        return () => {
            clearTimeout(timeout);
            clearInterval(interval);
        };
    }, []);

    // Smart scroll - only scroll WITHIN chat panel (Twitch/YouTube style)
    // Does NOT affect page scroll
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isNearBottomRef.current && scrollContainerRef.current) {
            // Only scroll the chat container, not the page
            scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const el = e.target as HTMLDivElement;
        isNearBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 150;
    };

    // Send message
    const sendMessage = async () => {
        if (!input.trim() || sending) return;

        const content = input.trim();
        setInput("");
        setSending(true);
        isNearBottomRef.current = true;

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
            }
        } catch (error) {
            console.error("Failed to send:", error);
            setMessages(prev => prev.filter(m => m.id !== tempId));
        } finally {
            setSending(false);
            // Re-focus input after sending
            inputRef.current?.focus();
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff" }}>
            {/* Header */}
            <div style={{
                padding: "12px 16px",
                background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                color: "#fff",
                flexShrink: 0
            }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <div style={{
                            width: "8px", height: "8px",
                            background: "#86efac", borderRadius: "50%",
                            animation: "pulse 2s infinite"
                        }} />
                        <span style={{ fontWeight: 600, fontSize: "14px" }}>Student Lounge</span>
                    </div>
                    <div style={{ fontSize: "12px", opacity: 0.9 }}>
                        🟢 {onlineCount} online
                    </div>
                </div>
            </div>

            {/* Pinned Welcome Message */}
            <div style={{
                padding: "10px 14px",
                background: "#f0fdf4",
                borderBottom: "1px solid #bbf7d0",
                fontSize: "13px",
                color: "#166534",
                flexShrink: 0
            }}>
                👋 Welcome! Share your wins, ask questions, cheer each other on!
            </div>

            {/* Join Notification */}
            {joinNotification && (
                <div style={{
                    padding: "8px 14px",
                    background: "#fef3c7",
                    borderBottom: "1px solid #fde68a",
                    fontSize: "12px",
                    color: "#92400e",
                    textAlign: "center",
                    animation: "fadeIn 0.3s ease"
                }}>
                    ✨ {joinNotification} just joined the chat
                </div>
            )}

            {/* Messages */}
            <div
                ref={scrollContainerRef}
                style={{ flex: 1, overflowY: "auto", padding: "12px", background: "#fafafa" }}
                onScroll={handleScroll}
            >
                {loading ? (
                    <div style={{ textAlign: "center", color: "#999", padding: "40px 0" }}>
                        Loading chat...
                    </div>
                ) : messages.length === 0 ? (
                    <div style={{ textAlign: "center", color: "#999", padding: "40px 0" }}>
                        <div style={{ fontSize: "40px", marginBottom: "12px" }}>👋</div>
                        <div style={{ fontSize: "13px" }}>Be the first to say hi!</div>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {/* Show only 25 most recent messages - users can scroll up for more */}
                        {messages.slice(-25).map((msg) => (
                            <div
                                key={msg.id}
                                style={{
                                    display: "flex", gap: "8px", alignItems: "flex-start",
                                    opacity: msg.id.startsWith("temp-") ? 0.6 : 1,
                                }}
                            >
                                <div style={{
                                    width: "32px", height: "32px", borderRadius: "50%",
                                    background: msg.user.avatar ? `url(${msg.user.avatar}) center/cover` : "#722f37",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: "#fff", fontSize: "12px", fontWeight: 600, flexShrink: 0
                                }}>
                                    {!msg.user.avatar && (msg.user.name?.[0] || "?")}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "2px" }}>
                                        <span style={{
                                            fontWeight: 600, fontSize: "12px",
                                            color: msg.isMe ? "#722f37" : "#333"
                                        }}>
                                            {msg.isMe ? "You" : msg.user.name}
                                        </span>
                                        <span style={{ fontSize: "10px", color: "#999" }}>
                                            {formatTime(msg.createdAt)}
                                        </span>
                                    </div>
                                    <div style={{
                                        fontSize: "13px", color: "#444", lineHeight: 1.4,
                                        background: msg.isMe ? "#f0e6e7" : "#fff",
                                        padding: "8px 12px", borderRadius: "12px",
                                        border: "1px solid #eee", wordBreak: "break-word"
                                    }}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {typingName && (
                            <div style={{
                                display: "flex", gap: "8px", alignItems: "center",
                                padding: "4px 0", color: "#666", fontSize: "12px"
                            }}>
                                <div style={{ display: "flex", gap: "3px" }}>
                                    <span style={{ animation: "bounce 1s infinite 0s" }}>•</span>
                                    <span style={{ animation: "bounce 1s infinite 0.2s" }}>•</span>
                                    <span style={{ animation: "bounce 1s infinite 0.4s" }}>•</span>
                                </div>
                                <span>{typingName} is typing...</span>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input */}
            <div style={{ borderTop: "1px solid #eee", padding: "12px", flexShrink: 0 }}>
                <div style={{ display: "flex", gap: "8px" }}>
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                        placeholder="Say something nice..."
                        style={{
                            flex: 1, padding: "10px 14px",
                            border: "1px solid #ddd", borderRadius: "20px",
                            fontSize: "13px", outline: "none"
                        }}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={sending || !input.trim()}
                        style={{
                            padding: "10px 16px",
                            background: sending ? "#999" : "#16a34a",
                            color: "#fff", border: "none", borderRadius: "20px",
                            cursor: sending ? "wait" : "pointer", fontSize: "13px",
                            fontWeight: 500
                        }}
                    >
                        Send
                    </button>
                </div>
            </div>

            {/* Animations */}
            <style>{`
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
            `}</style>
        </div>
    );
}

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
