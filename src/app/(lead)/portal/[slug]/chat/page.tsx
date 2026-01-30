"use client";

import { useParams } from "next/navigation";
import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Send, Loader2, Sparkles, RefreshCw } from "lucide-react";
import { getConfigByPortalSlug } from "@/lib/mini-diploma-registry";

const SARAH_AVATAR = "/coaches/sarah-coach.webp";

// Quick suggestion buttons
const QUICK_QUESTIONS = [
    "How long does certification take?",
    "Can I do this part-time?",
    "How do I get clients?",
    "What's the investment?",
];

interface Message {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
}

export default function ChatPage() {
    const params = useParams();
    const slug = params.slug as string;
    const config = getConfigByPortalSlug(slug);
    const [firstName, setFirstName] = useState("there");
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Fetch user name
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/lead-onboarding/lesson-status?lesson=1&niche=${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setFirstName(data.firstName || "there");
                }
            } catch {
                console.error("Failed to fetch user");
            }
        };
        fetchUser();
    }, [slug]);

    // Load messages from database
    const loadMessages = useCallback(async () => {
        try {
            const res = await fetch("/api/chat/lead-portal");
            if (res.ok) {
                const data = await res.json();

                // Always start with a welcome message from Sarah
                const welcomeMessage: Message = {
                    id: "welcome",
                    content: `Hey ${firstName}! 👋 I'm Sarah, your personal coach. I check this chat regularly and personally respond to every message. Ask me anything about the ${config?.displayName || 'certification'} - I'll get back to you shortly!`,
                    isUser: false,
                    timestamp: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
                };

                if (data.messages && data.messages.length > 0) {
                    const dbMessages = data.messages.map((m: any) => ({
                        id: m.id,
                        content: m.content,
                        isUser: m.isUser,
                        timestamp: new Date(m.timestamp),
                    }));
                    // Prepend welcome message to existing messages
                    setMessages([welcomeMessage, ...dbMessages]);
                } else {
                    // Just show welcome message
                    setMessages([welcomeMessage]);
                }
            }
        } catch (e) {
            console.error("Failed to load messages:", e);
        } finally {
            setLoading(false);
        }
    }, [firstName, config?.displayName]);

    // Load messages on mount and set up polling
    useEffect(() => {
        loadMessages();

        // Poll for new messages every 10 seconds
        const interval = setInterval(loadMessages, 10000);
        return () => clearInterval(interval);
    }, [loadMessages]);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Send message - saves to database
    const sendMessage = async (content: string) => {
        if (!content.trim() || sending) return;

        // Optimistic update - show message immediately
        const tempId = `temp-${Date.now()}`;
        const userMessage: Message = {
            id: tempId,
            content: content.trim(),
            isUser: true,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setSending(true);

        try {
            const res = await fetch("/api/chat/lead-portal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: content.trim(),
                    niche: slug,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                // Replace temp message with real one
                setMessages(prev => prev.map(m =>
                    m.id === tempId ? { ...m, id: data.message.id } : m
                ));
            } else {
                // Show error message
                setMessages(prev => [...prev, {
                    id: `error-${Date.now()}`,
                    content: "Failed to send message. Please try again.",
                    isUser: false,
                    timestamp: new Date(),
                }]);
            }
        } catch (error) {
            console.error("Send error:", error);
            setMessages(prev => [...prev, {
                id: `error-${Date.now()}`,
                content: "Network error. Please check your connection.",
                isUser: false,
                timestamp: new Date(),
            }]);
        } finally {
            setSending(false);
            inputRef.current?.focus();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gradient-to-b from-rose-50 to-amber-50">
                <Loader2 className="w-8 h-8 animate-spin text-burgundy-600" />
            </div>
        );
    }

    return (
        <div className="h-screen flex flex-col bg-gradient-to-b from-rose-50 to-amber-50">
            {/* Compact Header */}
            <div className="flex-shrink-0 bg-gradient-to-r from-burgundy-700 via-burgundy-600 to-rose-600 text-white px-4 py-3">
                <div className="max-w-2xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Image
                                src={SARAH_AVATAR}
                                alt="Sarah"
                                width={48}
                                height={48}
                                className="rounded-full border-2 border-amber-300 shadow-lg"
                            />
                            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white" />
                        </div>
                        <div>
                            <h1 className="font-bold text-lg">Chat with Sarah</h1>
                            <p className="text-xs text-rose-200">
                                Personal support • Messages saved automatically
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={loadMessages}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        title="Refresh messages"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 py-6"
            >
                <div className="max-w-2xl mx-auto space-y-4">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex gap-3 ${msg.isUser ? "flex-row-reverse" : ""}`}
                        >
                            {!msg.isUser && (
                                <Image
                                    src={SARAH_AVATAR}
                                    alt="Sarah"
                                    width={40}
                                    height={40}
                                    className="rounded-full flex-shrink-0 self-end shadow-md"
                                />
                            )}
                            <div
                                className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${msg.isUser
                                    ? "bg-burgundy-600 text-white rounded-br-md"
                                    : "bg-white text-gray-800 rounded-bl-md border border-gray-100"
                                    }`}
                            >
                                <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                <p className="text-[10px] opacity-60 mt-1">
                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    ))}

                    {/* Sending indicator */}
                    {sending && (
                        <div className="flex justify-end">
                            <div className="bg-burgundy-400 text-white rounded-2xl rounded-br-md px-4 py-3 opacity-70">
                                <Loader2 className="w-4 h-4 animate-spin" />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Quick Questions (show only if no user messages) */}
            {!messages.some(m => m.isUser) && !sending && (
                <div className="flex-shrink-0 px-4 pb-2">
                    <div className="max-w-2xl mx-auto">
                        <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Common questions:
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {QUICK_QUESTIONS.map((q) => (
                                <button
                                    key={q}
                                    onClick={() => sendMessage(q)}
                                    className="text-xs px-3 py-2 bg-white border border-burgundy-200 text-burgundy-700 rounded-full hover:bg-burgundy-50 transition-colors shadow-sm"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Input Area */}
            <div className="flex-shrink-0 p-4 bg-white border-t border-gray-200 shadow-lg">
                <div className="max-w-2xl mx-auto flex gap-3">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your question for Sarah..."
                        disabled={sending}
                        className="flex-1 px-5 py-3 border-2 border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent disabled:opacity-50"
                    />
                    <button
                        onClick={() => sendMessage(input)}
                        disabled={!input.trim() || sending}
                        className="p-3 bg-burgundy-600 text-white rounded-full hover:bg-burgundy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-md"
                    >
                        {sending ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Send className="w-5 h-5" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
