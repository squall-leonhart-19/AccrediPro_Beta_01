"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    MessageCircle,
    X,
    Send,
    Loader2,
    ArrowRight,
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

export function FloatingCoachWidget({ userName, userId }: FloatingCoachWidgetProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isChatMode, setIsChatMode] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [coachId, setCoachId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const greeting = getGreeting();
    const name = userName || "there";

    // Fetch mentors to get Coach Sarah's ID - with AbortController to prevent race conditions
    useEffect(() => {
        if (!isChatMode || coachId) return;

        const abortController = new AbortController();

        fetch("/api/messages/mentors", { signal: abortController.signal })
            .then(res => res.json())
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
                toast.error("Could not connect to coach.");
            });

        return () => abortController.abort();
    }, [isChatMode, coachId]);

    // Fetch messages when chat mode is enabled
    const fetchMessages = useCallback(async () => {
        if (!coachId) return;
        setIsLoading(true);
        try {
            const res = await fetch(`/api/messages?userId=${coachId}&limit=15`);
            const data = await res.json();
            if (data.success && data.data) {
                // Filter out voice messages for simplified view
                const textMessages = data.data.filter((m: any) => !m.attachmentType || m.attachmentType === null);
                setMessages(textMessages);
            }
        } catch {
            toast.error("Could not load messages.");
        } finally {
            setIsLoading(false);
        }
    }, [coachId]);

    useEffect(() => {
        if (isChatMode && coachId) fetchMessages();
    }, [isChatMode, coachId, fetchMessages]);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Focus input when entering chat mode
    useEffect(() => {
        if (isChatMode && inputRef.current) inputRef.current.focus();
    }, [isChatMode]);

    // Send message
    const handleSendMessage = async () => {
        if (!newMessage.trim() || !coachId || isSending) return;

        const content = newMessage.trim();
        setNewMessage("");
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
            inputRef.current?.focus();
        }
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Expanded Card */}
            {isExpanded && (
                <Card className="mb-3 w-80 shadow-2xl border-0 bg-white animate-in slide-in-from-bottom-2 duration-200 overflow-hidden">
                    <CardContent className="p-0">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 p-3">
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
                                <button
                                    onClick={() => { setIsExpanded(false); setIsChatMode(false); }}
                                    className="text-white/70 hover:text-white p-1.5 rounded-lg hover:bg-white/10"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Chat Mode - Simplified */}
                        {isChatMode ? (
                            <div className="flex flex-col h-64">
                                {/* Messages - Fixed Height with Scroll */}
                                <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
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

                                {/* Input - Compact */}
                                <div className="p-2 border-t bg-white">
                                    <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex gap-2">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type a message..."
                                            className="flex-1 px-3 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                            disabled={isSending || !coachId}
                                        />
                                        <Button
                                            type="submit"
                                            size="sm"
                                            disabled={!newMessage.trim() || isSending || !coachId}
                                            className="rounded-full w-8 h-8 p-0 bg-burgundy-600 hover:bg-burgundy-700"
                                        >
                                            {isSending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
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

            {/* Floating Button */}
            <button
                onClick={() => { setIsExpanded(true); setIsChatMode(true); }}
                aria-label="Open chat with Coach Sarah"
                className="group relative flex items-center gap-2 shadow-lg transition-all duration-200 hover:scale-105 pl-1.5 pr-4 py-1.5 rounded-full bg-white border border-gray-200 hover:border-burgundy-300 hover:shadow-xl cursor-pointer"
            >
                <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-gold-500"></span>
                </span>
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
