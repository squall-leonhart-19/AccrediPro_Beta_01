"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    MessageCircle,
    X,
    Send,
    Loader2,
    ArrowRight,
    Minimize2,
    Play,
    Pause,
    Mic,
    ImageIcon,
    FileText,
} from "lucide-react";
import { toast } from "sonner";

interface Message {
    id: string;
    content: string;
    senderId: string;
    createdAt: Date;
    isRead: boolean;
    attachmentType?: "voice" | "image" | "file" | null;
    attachmentUrl?: string | null;
    attachmentName?: string | null;
    voiceDuration?: number | null;
    isAiVoice?: boolean;
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

// Dynamic messages from Coach Sarah
function getCoachMessage(userName?: string, lessonCount?: number, nextMilestone?: number) {
    const greeting = getGreeting();
    const name = userName || "there";

    const lessonsToGo = nextMilestone && lessonCount !== undefined ? nextMilestone - lessonCount : null;

    const messages = [
        `${greeting}, ${name}! Ready to learn something new today? 🌟`,
        `Hey ${name}! You're doing great. Keep that momentum going! 💪`,
        lessonsToGo && lessonsToGo > 0
            ? `Just ${lessonsToGo} more lesson${lessonsToGo > 1 ? 's' : ''} to your next milestone, ${name}! 🎯`
            : `${greeting}! I'm here if you need anything, ${name}! 💬`,
        `${name}, your dedication is inspiring! How can I help today? ✨`,
    ];

    const index = Math.floor(Date.now() / (1000 * 60 * 60)) % messages.length;
    return messages[index];
}

// Format duration for voice messages
function formatDuration(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

export function FloatingCoachWidget({
    userName,
    userId,
    currentLessonCount = 0,
    nextMilestone = 10
}: FloatingCoachWidgetProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isChatMode, setIsChatMode] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [coachId, setCoachId] = useState<string | null>(null);
    const [playingAudio, setPlayingAudio] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});

    const coachMessage = getCoachMessage(userName, currentLessonCount, nextMilestone);

    // Fetch mentors to get Coach Sarah's ID (sarah@accredipro-certificate.com)
    useEffect(() => {
        if (isChatMode && !coachId) {
            fetch("/api/messages/mentors")
                .then(res => res.json())
                .then(data => {
                    // Find Sarah M. specifically by email first
                    const sarah = data.mentors?.find((m: any) =>
                        m.email === "sarah@accredipro-certificate.com"
                    );
                    // Fallback to any mentor named Sarah, then first mentor
                    const mentor = sarah ||
                        data.mentors?.find((m: any) => m.firstName?.toLowerCase() === "sarah") ||
                        data.mentors?.[0];
                    if (mentor) {
                        setCoachId(mentor.id);
                    }
                })
                .catch((error) => {
                    console.error("Failed to fetch mentors:", error);
                    toast.error("Could not connect to coach. Please try again.");
                });
        }
    }, [isChatMode, coachId]);

    // Fetch messages when chat mode is enabled
    const fetchMessages = useCallback(async () => {
        if (!coachId) return;

        setIsLoading(true);
        try {
            const res = await fetch(`/api/messages?userId=${coachId}&limit=20`);
            const data = await res.json();
            if (data.success && data.data) {
                setMessages(data.data);
            } else {
                toast.error("Failed to load messages");
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error);
            toast.error("Could not load messages. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    }, [coachId]);

    useEffect(() => {
        if (isChatMode && coachId) {
            fetchMessages();
        }
    }, [isChatMode, coachId, fetchMessages]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Focus input when entering chat mode
    useEffect(() => {
        if (isChatMode && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isChatMode]);

    // Audio playback toggle
    const toggleAudio = (messageId: string, audioUrl: string) => {
        const audio = audioRefs.current[messageId];

        if (!audio) {
            const newAudio = new Audio(audioUrl);
            audioRefs.current[messageId] = newAudio;
            newAudio.onended = () => setPlayingAudio(null);
            newAudio.play();
            setPlayingAudio(messageId);
        } else if (playingAudio === messageId) {
            audio.pause();
            setPlayingAudio(null);
        } else {
            // Pause any other playing audio
            Object.values(audioRefs.current).forEach((a) => a.pause());
            audio.currentTime = 0;
            audio.play();
            setPlayingAudio(messageId);
        }
    };

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
                // Replace temp message with real one
                setMessages(prev =>
                    prev.map(m => m.id === tempMessage.id ? data.data : m)
                );
            }
        } catch (error) {
            console.error("Failed to send message:", error);
            // Remove temp message on error
            setMessages(prev => prev.filter(m => m.id !== tempMessage.id));
            toast.error("Failed to send message. Please try again.");
        } finally {
            setIsSending(false);
        }
    };

    const enterChatMode = () => {
        setIsChatMode(true);
    };

    // Render message content (text, voice, image, file)
    const renderMessageContent = (msg: Message, isUser: boolean) => {
        // Voice message
        if (msg.attachmentType === "voice" && msg.attachmentUrl) {
            return (
                <div className="min-w-[180px]">
                    <div className="flex items-center gap-2 mb-1.5">
                        <Mic className={`w-3 h-3 ${isUser ? "text-burgundy-200" : "text-burgundy-500"}`} />
                        <span className={`text-[10px] font-medium uppercase tracking-wide ${isUser ? "text-burgundy-200" : "text-burgundy-500"}`}>
                            Voice Message
                        </span>
                        {msg.isAiVoice && (
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${isUser ? "bg-white/20 text-white" : "bg-purple-100 text-purple-600"}`}>
                                AI
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => toggleAudio(msg.id, msg.attachmentUrl!)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md ${isUser
                                    ? "bg-white/20 hover:bg-white/30"
                                    : "bg-gradient-to-br from-burgundy-500 to-burgundy-600 hover:from-burgundy-600 hover:to-burgundy-700"
                                }`}
                        >
                            {playingAudio === msg.id ? (
                                <Pause className="w-4 h-4 text-white" />
                            ) : (
                                <Play className="w-4 h-4 ml-0.5 text-white" />
                            )}
                        </button>
                        <div className="flex-1">
                            <div className={`text-sm font-bold ${isUser ? "text-white" : "text-gray-900"}`}>
                                {formatDuration(msg.voiceDuration || 0)}
                            </div>
                            <div className={`h-1 rounded-full ${isUser ? "bg-white/30" : "bg-burgundy-200"}`}>
                                <div className={`h-full rounded-full w-0 transition-all ${isUser ? "bg-white" : "bg-burgundy-500"}`} />
                            </div>
                        </div>
                    </div>
                    {msg.content && (
                        <p className={`text-xs mt-2 italic border-l-2 pl-2 ${isUser ? "text-white/80 border-white/40" : "text-gray-600 border-burgundy-300"}`}>
                            "{msg.content}"
                        </p>
                    )}
                </div>
            );
        }

        // Image message
        if (msg.attachmentType === "image" && msg.attachmentUrl) {
            return (
                <div>
                    <img
                        src={msg.attachmentUrl}
                        alt="Shared image"
                        className="max-w-[200px] rounded-lg mb-1.5 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => window.open(msg.attachmentUrl!, "_blank")}
                    />
                    {msg.content && <p className="text-sm whitespace-pre-wrap">{msg.content}</p>}
                </div>
            );
        }

        // File message
        if (msg.attachmentType === "file" && msg.attachmentUrl) {
            return (
                <div>
                    <a
                        href={msg.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 p-2 rounded-lg mb-1.5 transition-all ${isUser ? "bg-white/10 hover:bg-white/20" : "bg-gray-100 hover:bg-gray-200"
                            }`}
                    >
                        <FileText className={`w-4 h-4 ${isUser ? "text-white" : "text-burgundy-600"}`} />
                        <span className={`text-xs font-medium truncate ${isUser ? "text-white" : "text-gray-900"}`}>
                            {msg.attachmentName || "File"}
                        </span>
                    </a>
                    {msg.content && <p className="text-sm whitespace-pre-wrap">{msg.content}</p>}
                </div>
            );
        }

        // Text message
        return <p className="text-sm whitespace-pre-wrap">{msg.content}</p>;
    };

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {/* Expanded Card */}
            {isExpanded && (
                <Card className="mb-3 w-80 sm:w-96 shadow-2xl border-0 bg-white animate-in slide-in-from-bottom-2 duration-200 overflow-hidden">
                    <CardContent className="p-0">
                        {/* Header with gradient */}
                        <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Image
                                            src="/coaches/sarah-coach.webp"
                                            alt="Coach Sarah"
                                            width={40}
                                            height={40}
                                            className="rounded-full border-2 border-gold-400 shadow-lg"
                                        />
                                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-burgundy-600 rounded-full"></span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-white text-sm">Coach Sarah</h4>
                                        <p className="text-xs text-green-300 flex items-center gap-1">
                                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                                            {isChatMode ? "In chat" : "Online now"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    {isChatMode && (
                                        <button
                                            onClick={() => setIsChatMode(false)}
                                            className="text-white/70 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
                                            title="Minimize chat"
                                            aria-label="Minimize chat"
                                        >
                                            <Minimize2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => { setIsExpanded(false); setIsChatMode(false); }}
                                        className="text-white/70 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10"
                                        aria-label="Close coach widget"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Chat Mode - Messages */}
                        {isChatMode ? (
                            <div className="flex flex-col h-80">
                                {/* Messages Area */}
                                <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
                                    {isLoading ? (
                                        <div className="flex items-center justify-center h-full text-gray-400">
                                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                            <span className="text-sm">Loading messages...</span>
                                        </div>
                                    ) : messages.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center h-full text-center text-gray-400">
                                            <MessageCircle className="w-10 h-10 mb-2 opacity-50" />
                                            <p className="text-sm">No messages yet</p>
                                            <p className="text-xs mt-1">Say hi to Coach Sarah!</p>
                                        </div>
                                    ) : (
                                        <>
                                            {messages.map((msg) => {
                                                const isUser = msg.senderId === userId;
                                                return (
                                                    <div
                                                        key={msg.id}
                                                        className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                                                    >
                                                        <div className={`max-w-[85%] rounded-2xl px-3 py-2 ${isUser
                                                                ? 'bg-burgundy-600 text-white rounded-br-sm'
                                                                : 'bg-white text-gray-800 rounded-bl-sm shadow-sm border'
                                                            }`}>
                                                            {renderMessageContent(msg, isUser)}
                                                            <p className={`text-[10px] mt-1 ${isUser ? 'text-burgundy-200' : 'text-gray-400'
                                                                }`}>
                                                                {new Date(msg.createdAt).toLocaleTimeString([], {
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                            <div ref={messagesEndRef} />
                                        </>
                                    )}
                                </div>

                                {/* Message Input */}
                                <div className="p-3 border-t bg-white">
                                    <form
                                        onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
                                        className="flex items-center gap-2"
                                    >
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type a message..."
                                            className="flex-1 px-3 py-2 text-sm border rounded-full focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                                            disabled={isSending || !coachId}
                                        />
                                        <Button
                                            type="submit"
                                            size="sm"
                                            disabled={!newMessage.trim() || isSending || !coachId}
                                            className="rounded-full w-9 h-9 p-0 bg-burgundy-600 hover:bg-burgundy-700"
                                        >
                                            {isSending ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Send className="w-4 h-4" />
                                            )}
                                        </Button>
                                    </form>
                                </div>
                            </div>
                        ) : (
                            /* Initial Mode - Greeting + CTA */
                            <div className="p-4">
                                {/* Message Bubble */}
                                <div className="bg-gray-50 rounded-2xl rounded-tl-sm p-4 mb-4 shadow-sm">
                                    <p className="text-sm text-gray-700 leading-relaxed">{coachMessage}</p>
                                </div>

                                {/* CTA Button - Opens Chat */}
                                <Button
                                    onClick={enterChatMode}
                                    className="w-full bg-burgundy-600 hover:bg-burgundy-700 h-11 text-sm font-semibold shadow-sm mb-2"
                                >
                                    <MessageCircle className="w-4 h-4 mr-2" />
                                    Chat with Coach Sarah
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>

                                <p className="text-center text-xs text-gray-400">
                                    Chat opens here • No page navigation
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Floating Button - navigates to /messages */}
            <Link
                href="/messages"
                aria-label="Open messages with Coach Sarah"
                className="group relative flex items-center gap-2 shadow-lg transition-all duration-200 hover:scale-105 pl-1.5 pr-4 py-1.5 rounded-full bg-white border border-gray-200 hover:border-burgundy-300 hover:shadow-xl"
            >
                {/* Notification Pulse */}
                <span className="absolute -top-0.5 -right-0.5 flex h-3.5 w-3.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-gold-500"></span>
                </span>

                {/* Coach Avatar */}
                <div className="relative">
                    <Image
                        src="/coaches/sarah-coach.webp"
                        alt="Coach Sarah"
                        width={36}
                        height={36}
                        className="rounded-full border-2 border-burgundy-100 group-hover:border-burgundy-300 transition-colors"
                    />
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 border-2 border-white rounded-full"></span>
                </div>
                <span className="font-medium text-sm text-gray-700 hidden sm:inline">Ask Sarah</span>
            </Link>
        </div>
    );
}
