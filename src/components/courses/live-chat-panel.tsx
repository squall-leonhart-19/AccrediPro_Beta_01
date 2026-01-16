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
    courseId: string;
    isMobile?: boolean;
    onClose?: () => void;
}

export function LiveChatPanel({ courseId, isMobile = false, onClose }: LiveChatPanelProps) {
    const { data: session } = useSession();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [onlineCount, setOnlineCount] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const isNearBottomRef = useRef(true);

    // Fetch messages
    const fetchMessages = useCallback(async () => {
        try {
            const res = await fetch(`/api/lesson-chat/messages?courseId=${courseId}`);
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
        const interval = setInterval(fetchMessages, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, [fetchMessages]);

    // Smart scroll - only scroll when near bottom
    useEffect(() => {
        if (isNearBottomRef.current && messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // Track scroll position
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

        // Optimistic update
        const tempId = `temp-${Date.now()}`;
        const optimisticMsg: ChatMessage = {
            id: tempId,
            content,
            createdAt: new Date().toISOString(),
            isZombie: false,
            isMe: true,
            user: {
                name: "You",
                avatar: session?.user?.image || null,
            }
        };
        setMessages(prev => [...prev, optimisticMsg]);
        isNearBottomRef.current = true; // Scroll to see own message

        try {
            const res = await fetch("/api/lesson-chat/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId, content }),
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
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "#fff" }}>
            {/* Header */}
            <div style={{
                padding: "16px 20px",
                borderBottom: "1px solid #eee",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
                color: "#fff",
                flexShrink: 0
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{
                        width: "10px",
                        height: "10px",
                        background: "#86efac",
                        borderRadius: "50%",
                        animation: "pulse 2s infinite"
                    }} />
                    <div>
                        <div style={{ fontWeight: 600, fontSize: "15px" }}>🔴 Live Chat</div>
                        <div style={{ fontSize: "12px", opacity: 0.9 }}>
                            {onlineCount} students online
                        </div>
                    </div>
                </div>
                {isMobile && onClose && (
                    <button
                        onClick={onClose}
                        style={{
                            width: "32px", height: "32px",
                            background: "rgba(255,255,255,0.2)",
                            border: "none", borderRadius: "50%",
                            color: "#fff", fontSize: "18px", cursor: "pointer"
                        }}
                    >✕</button>
                )}
            </div>

            {/* Messages */}
            <div
                style={{ flex: 1, overflowY: "auto", padding: "16px", background: "#fafafa" }}
                onScroll={handleScroll}
            >
                {loading ? (
                    <div style={{ textAlign: "center", color: "#999", padding: "40px 0" }}>
                        Loading chat...
                    </div>
                ) : messages.length === 0 ? (
                    <div style={{ textAlign: "center", color: "#999", padding: "40px 0" }}>
                        <div style={{ fontSize: "48px", marginBottom: "16px" }}>👋</div>
                        <div style={{ fontSize: "14px" }}>Be the first to say hi!</div>
                        <div style={{ fontSize: "13px", color: "#bbb" }}>Join the conversation with fellow students</div>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                style={{
                                    display: "flex",
                                    gap: "10px",
                                    alignItems: "flex-start",
                                    opacity: msg.id.startsWith("temp-") ? 0.6 : 1,
                                }}
                            >
                                {/* Avatar */}
                                <div style={{
                                    width: "36px", height: "36px", borderRadius: "50%",
                                    background: msg.user.avatar ? `url(${msg.user.avatar}) center/cover` : "#722f37",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: "#fff", fontSize: "14px", fontWeight: 600, flexShrink: 0
                                }}>
                                    {!msg.user.avatar && (msg.user.name?.[0] || "?")}
                                </div>
                                {/* Message */}
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                        <span style={{
                                            fontWeight: 600,
                                            fontSize: "13px",
                                            color: msg.isMe ? "#722f37" : "#333"
                                        }}>
                                            {msg.isMe ? "You" : msg.user.name}
                                        </span>
                                        <span style={{ fontSize: "11px", color: "#999" }}>
                                            {formatTime(msg.createdAt)}
                                        </span>
                                    </div>
                                    <div style={{
                                        fontSize: "14px",
                                        color: "#444",
                                        lineHeight: 1.5,
                                        background: msg.isMe ? "#f0e6e7" : "#fff",
                                        padding: "10px 14px",
                                        borderRadius: "12px",
                                        border: "1px solid #eee"
                                    }}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            {/* Input */}
            <div style={{ borderTop: "1px solid #eee", padding: "16px", flexShrink: 0 }}>
                <div style={{ display: "flex", gap: "8px" }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        placeholder="Say something to the class..."
                        style={{
                            flex: 1, padding: "12px 16px",
                            border: "1px solid #ddd", borderRadius: "24px",
                            fontSize: "14px", outline: "none"
                        }}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={sending || !input.trim()}
                        style={{
                            padding: "12px 20px",
                            background: sending ? "#999" : "#16a34a",
                            color: "#fff", border: "none", borderRadius: "24px",
                            cursor: sending ? "wait" : "pointer", fontSize: "14px"
                        }}
                    >
                        Send
                    </button>
                </div>
            </div>

            {/* Pulse animation */}
            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
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

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
}
