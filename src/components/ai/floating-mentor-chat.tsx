"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";

interface Message {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    createdAt: Date;
    isRead: boolean;
}

interface FloatingMentorChatProps {
    className?: string;
    lessonContext?: string;
}

const SARAH_MENTOR = {
    id: "coach-sarah-id", // This should match the actual Sarah coach ID
    name: "Coach Sarah M.",
    avatar: "/coaches/sarah-coach.webp",
    title: "Your Private Mentor"
};

export function FloatingMentorChat({ className, lessonContext }: FloatingMentorChatProps) {
    const { data: session } = useSession();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const [selectedMentorId, setSelectedMentorId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const abortControllerRef = useRef<AbortController | null>(null);
    const streamReaderRef = useRef<ReadableStreamDefaultReader | null>(null);

    // Cleanup streaming response on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            if (streamReaderRef.current) {
                streamReaderRef.current.cancel().catch(() => {});
            }
        };
    }, []);

    // Fetch mentor and messages on mount
    const fetchMentorAndMessages = useCallback(async () => {
        if (!session?.user?.id) return;

        try {
            // Fetch mentors to get Sarah's ID
            const mentorsRes = await fetch("/api/messages/mentors");
            const mentorsData = await mentorsRes.json();

            if (mentorsData.mentors && mentorsData.mentors.length > 0) {
                // Find Sarah or use first mentor
                const sarah = mentorsData.mentors.find((m: any) =>
                    m.firstName?.toLowerCase().includes("sarah") ||
                    m.email?.toLowerCase().includes("sarah")
                ) || mentorsData.mentors[0];

                setSelectedMentorId(sarah.id);

                // Fetch messages with this mentor
                const messagesRes = await fetch(`/api/messages?userId=${sarah.id}`);
                const messagesData = await messagesRes.json();

                if (messagesData.messages) {
                    setMessages(messagesData.messages);

                    // Count unread messages from mentor
                    const unread = messagesData.messages.filter(
                        (m: Message) => m.senderId === sarah.id && !m.isRead
                    ).length;
                    setUnreadCount(unread);
                }
            }
        } catch (error) {
            console.error("Failed to load mentor chat:", error);
        }
    }, [session?.user?.id]);

    useEffect(() => {
        if (isOpen) {
            fetchMentorAndMessages();
        }
    }, [isOpen, fetchMentorAndMessages]);

    // Track if user is near bottom for smart auto-scroll
    const isNearBottomRef = useRef(true);
    const prevMessagesLengthRef = useRef(messages.length);

    // Scroll to bottom only when appropriate
    useEffect(() => {
        if (scrollRef.current && messages.length > 0) {
            const container = scrollRef.current;
            const lastMsg = messages[messages.length - 1];
            const isUserMessage = lastMsg?.senderId === session?.user?.id;
            const isInitialLoad = prevMessagesLengthRef.current === 0;

            // Auto-scroll if:
            // 1. User is near bottom, OR
            // 2. It's initial load, OR
            // 3. User just sent a message
            if (isNearBottomRef.current || isInitialLoad || isUserMessage) {
                container.scrollTop = container.scrollHeight;
            }

            prevMessagesLengthRef.current = messages.length;
        }
    }, [messages, session?.user?.id]);

    // Handle scroll to track if user is near bottom
    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const el = e.target as HTMLDivElement;
        isNearBottomRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 150;
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }, [isOpen]);

    // Mark messages as read
    const markAsRead = useCallback(async () => {
        if (!selectedMentorId) return;

        try {
            await fetch("/api/messages/mark-read", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ senderId: selectedMentorId }),
            });
            setUnreadCount(0);
        } catch (error) {
            console.error("Failed to mark as read:", error);
        }
    }, [selectedMentorId]);

    useEffect(() => {
        if (isOpen && unreadCount > 0) {
            markAsRead();
        }
    }, [isOpen, unreadCount, markAsRead]);

    // Send message with AI auto-response
    const handleSend = async () => {
        if (!input.trim() || !selectedMentorId || isSending) return;

        const messageContent = input.trim();
        setInput("");
        setIsSending(true);

        // Optimistic update for user message
        const tempMessage: Message = {
            id: `temp-${Date.now()}`,
            content: messageContent,
            senderId: session?.user?.id || "",
            receiverId: selectedMentorId,
            createdAt: new Date(),
            isRead: false,
        };
        setMessages(prev => [...prev, tempMessage]);

        try {
            // Send message to real mentor (for record keeping)
            const res = await fetch("/api/messages/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    receiverId: selectedMentorId,
                    content: messageContent,
                    context: lessonContext,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                // Replace temp message with real one
                setMessages(prev =>
                    prev.map(m => m.id === tempMessage.id ? data.message : m)
                );
            }

            // Generate AI response from Sarah
            const aiPlaceholderId = `ai-${Date.now()}`;
            const aiPlaceholder: Message = {
                id: aiPlaceholderId,
                content: "",
                senderId: selectedMentorId,
                receiverId: session?.user?.id || "",
                createdAt: new Date(),
                isRead: true,
            };
            setMessages(prev => [...prev, aiPlaceholder]);

            // Prepare chat history for AI (last 10 messages)
            const chatHistory = messages.slice(-10).map(m => ({
                role: m.senderId === session?.user?.id ? "user" as const : "assistant" as const,
                content: m.content
            }));
            chatHistory.push({ role: "user" as const, content: messageContent });

            // Call AI chat API for Sarah's response - with AbortController for cleanup
            abortControllerRef.current = new AbortController();

            const aiRes = await fetch("/api/ai/mentor-chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: chatHistory,
                    context: { currentLesson: lessonContext },
                }),
                signal: abortControllerRef.current.signal,
            });

            if (aiRes.ok) {
                const reader = aiRes.body?.getReader();
                if (reader) {
                    // Store reader ref for cleanup on unmount
                    streamReaderRef.current = reader;
                    const decoder = new TextDecoder();
                    let accumulatedContent = "";

                    try {
                        while (true) {
                            const { done, value } = await reader.read();
                            if (done) break;

                            const chunk = decoder.decode(value);
                            const lines = chunk.split("\n");

                            for (const line of lines) {
                                if (line.startsWith("data: ")) {
                                    const data = line.slice(6);
                                    if (data === "[DONE]") continue;

                                    try {
                                        const parsed = JSON.parse(data);
                                        if (parsed.text) {
                                            accumulatedContent += parsed.text;
                                            setMessages(prev =>
                                                prev.map(m =>
                                                    m.id === aiPlaceholderId
                                                        ? { ...m, content: accumulatedContent }
                                                        : m
                                                )
                                            );
                                        }
                                    } catch {
                                        // Ignore JSON parse errors for incomplete chunks
                                    }
                                }
                            }
                        }
                    } finally {
                        streamReaderRef.current = null;
                    }

                    // Save AI response as a real message from Sarah
                    if (accumulatedContent) {
                        await fetch("/api/messages/ai-response", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                receiverId: session?.user?.id,
                                senderId: selectedMentorId,
                                content: accumulatedContent,
                            }),
                        });
                    }
                }
            }
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setIsSending(false);
        }
    };

    // Floating button when closed
    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className={cn(
                    "fixed bottom-6 right-6 z-50",
                    "w-16 h-16 rounded-full shadow-2xl",
                    "bg-[#722f37] hover:bg-[#5a252c]",
                    "text-white flex items-center justify-center",
                    "transition-all duration-200 hover:scale-110",
                    "border-2 border-white/30",
                    className
                )}
                style={{ backgroundColor: '#722f37' }}
            >
                <MessageCircle className="h-7 w-7 text-white" strokeWidth={2} />
                {/* Online indicator */}
                <span className="absolute top-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                {/* Unread badge */}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -left-1 w-6 h-6 bg-red-500 rounded-full text-xs font-bold flex items-center justify-center border-2 border-white text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>
        );
    }

    // Chat window when open
    return (
        <div className={cn(
            "fixed bottom-6 right-6 z-50",
            "w-[380px] max-w-[calc(100vw-48px)]",
            "bg-white rounded-2xl shadow-2xl overflow-hidden",
            "border border-gray-200",
            "flex flex-col",
            "h-[500px] max-h-[70vh]",
            className
        )}>
            {/* Header - Solid Burgundy */}
            <div className="bg-[#722f37] text-white p-4 flex items-center gap-3 flex-none">
                <div className="relative">
                    <Avatar className="h-11 w-11 border-2 border-white/30">
                        <AvatarImage src={SARAH_MENTOR.avatar} alt={SARAH_MENTOR.name} />
                        <AvatarFallback className="bg-white/20">SM</AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-[#722f37]" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-white">{SARAH_MENTOR.name}</h4>
                    <p className="text-xs text-white/80">{SARAH_MENTOR.title}</p>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsOpen(false)}
                    className="text-white/80 hover:text-white hover:bg-white/20 h-8 w-8"
                >
                    <X className="h-5 w-5" />
                </Button>
            </div>

            {/* Messages */}
            <div
                className="flex-1 p-4 bg-gray-50 overflow-y-auto"
                ref={scrollRef}
                onScroll={handleScroll}
            >
                {isLoading ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-8">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#722f37]/10 to-[#8B3A42]/10 flex items-center justify-center">
                            <MessageCircle className="h-8 w-8 text-[#722f37]" />
                        </div>
                        <p className="text-gray-700 font-medium text-sm">
                            Start a conversation with your mentor!
                        </p>
                        <p className="text-gray-400 text-xs mt-2 max-w-[200px] mx-auto">
                            Ask questions, get guidance, share your progress.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {messages.map((msg) => {
                            const isUser = msg.senderId === session?.user?.id;
                            return (
                                <div
                                    key={msg.id}
                                    className={cn(
                                        "flex",
                                        isUser ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "max-w-[85%] p-3 rounded-2xl text-sm",
                                            isUser
                                                ? "bg-[#722f37] text-white rounded-br-sm"
                                                : "bg-white border border-gray-200 rounded-bl-sm text-gray-700 shadow-sm"
                                        )}
                                    >
                                        <p className="whitespace-pre-wrap">{msg.content}</p>
                                        <p className={cn(
                                            "text-[10px] mt-1",
                                            isUser ? "text-white/60" : "text-gray-400"
                                        )}>
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Input */}
            <div className="p-3 bg-white border-t border-gray-100 flex gap-2 flex-none">
                <Input
                    ref={inputRef}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type a message..."
                    disabled={isSending}
                    className="flex-1 rounded-full border-gray-200 focus:border-[#722f37] focus:ring-[#722f37]/20"
                />
                <Button
                    onClick={handleSend}
                    disabled={!input.trim() || isSending}
                    className="w-10 h-10 rounded-full bg-[#722f37] hover:bg-[#5a252c] disabled:bg-gray-300 text-white p-0"
                >
                    {isSending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                        <Send className="h-4 w-4" />
                    )}
                </Button>
            </div>
        </div>
    );
}
