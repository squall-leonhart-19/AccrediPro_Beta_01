"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Send, Loader2, MessageCircle, Sparkles, RefreshCw } from "lucide-react";

const SARAH_AVATAR = "/coaches/sarah-coach.webp";

interface Message {
    id: string;
    content: string;
    isUser: boolean;
    timestamp: Date;
}

// Quick suggestion buttons for common questions
const QUICK_QUESTIONS = [
    "How long does the certification take?",
    "Can I do this part-time?",
    "How do I get clients?",
    "What's the investment?",
];

interface SarahChatPanelProps {
    userName?: string;
    onClose?: () => void;
}

export function SarahChatPanel({ userName = "there", onClose }: SarahChatPanelProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const [loading, setLoading] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Welcome message (always shown first)
    const welcomeMessage: Message = {
        id: "welcome",
        content: `Hey ${userName}! 👋 I'm Sarah, your coach. I'm here to answer any questions about your certification journey. What's on your mind?`,
        isUser: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
    };

    // Load messages from database on mount
    const loadMessages = useCallback(async () => {
        try {
            const res = await fetch("/api/chat/lead-portal");
            if (res.ok) {
                const data = await res.json();
                if (data.messages && data.messages.length > 0) {
                    const dbMessages = data.messages.map((m: any) => ({
                        id: m.id,
                        content: m.content,
                        isUser: m.isUser,
                        timestamp: new Date(m.timestamp),
                    }));
                    // Prepend welcome message
                    setMessages([welcomeMessage, ...dbMessages]);
                } else {
                    setMessages([welcomeMessage]);
                }
            } else {
                setMessages([welcomeMessage]);
            }
        } catch (e) {
            console.error("Failed to load messages:", e);
            setMessages([welcomeMessage]);
        } finally {
            setLoading(false);
        }
    }, [userName]);

    // Load on mount and poll for new messages
    useEffect(() => {
        loadMessages();

        // Poll every 10 seconds for Sarah's replies
        const interval = setInterval(loadMessages, 10000);
        return () => clearInterval(interval);
    }, [loadMessages]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, sending]);

    // Send message and save to database
    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim() || sending) return;

        // Optimistic update
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
                    niche: "functional-medicine", // Default niche for widget
                }),
            });

            if (res.ok) {
                const data = await res.json();
                // Replace temp message with real one
                setMessages(prev => prev.map(m =>
                    m.id === tempId ? { ...m, id: data.message.id } : m
                ));
            }
        } catch (error) {
            console.error("Send error:", error);
        } finally {
            setSending(false);
            inputRef.current?.focus();
        }
    }, [sending]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    const handleQuickQuestion = (question: string) => {
        sendMessage(question);
    };

    if (loading) {
        return (
            <div className="flex flex-col h-full bg-white items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-burgundy-600" />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="flex-shrink-0 bg-gradient-to-r from-burgundy-600 to-rose-600 px-4 py-3 text-white">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Image
                                src={SARAH_AVATAR}
                                alt="Sarah"
                                width={40}
                                height={40}
                                className="rounded-full border-2 border-white/30"
                            />
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-burgundy-600" />
                        </div>
                        <div>
                            <div className="font-semibold text-sm flex items-center gap-1.5">
                                <MessageCircle className="w-4 h-4" />
                                Chat with Sarah
                            </div>
                            <div className="text-xs text-white/80 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                                Messages synced
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={loadMessages}
                        className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
                        title="Refresh"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-rose-50/50 to-white"
            >
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex gap-2 ${msg.isUser ? "flex-row-reverse" : ""}`}
                    >
                        {!msg.isUser && (
                            <Image
                                src={SARAH_AVATAR}
                                alt="Sarah"
                                width={32}
                                height={32}
                                className="rounded-full flex-shrink-0 self-end"
                            />
                        )}
                        <div
                            className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${msg.isUser
                                    ? "bg-burgundy-600 text-white rounded-br-md"
                                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm"
                                }`}
                        >
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                            <p className="text-[9px] opacity-50 mt-1">
                                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Sending indicator */}
                {sending && (
                    <div className="flex gap-2 flex-row-reverse">
                        <div className="bg-burgundy-400 text-white rounded-2xl rounded-br-md px-4 py-3 opacity-70">
                            <Loader2 className="w-4 h-4 animate-spin" />
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Questions */}
            {!messages.some(m => m.isUser) && !sending && (
                <div className="flex-shrink-0 px-4 py-2 border-t border-gray-100 bg-gray-50">
                    <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" />
                        Quick questions:
                    </p>
                    <div className="flex flex-wrap gap-2">
                        {QUICK_QUESTIONS.map((q) => (
                            <button
                                key={q}
                                onClick={() => handleQuickQuestion(q)}
                                className="text-xs px-3 py-1.5 bg-white border border-burgundy-200 text-burgundy-700 rounded-full hover:bg-burgundy-50 transition-colors"
                            >
                                {q}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input */}
            <div className="flex-shrink-0 p-4 border-t border-gray-200 bg-white">
                <div className="flex gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask Sarah anything..."
                        disabled={sending}
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                        onClick={() => sendMessage(input)}
                        disabled={!input.trim() || sending}
                        className="p-2.5 bg-burgundy-600 text-white rounded-full hover:bg-burgundy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
