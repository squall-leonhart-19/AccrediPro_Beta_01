"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { Send, Loader2, MessageCircle, Sparkles } from "lucide-react";

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
    "Is this legitimate?",
];

interface SarahChatPanelProps {
    userName?: string;
    onClose?: () => void;
}

export function SarahChatPanel({ userName = "there", onClose }: SarahChatPanelProps) {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            content: `Hey ${userName}! 👋 I'm Sarah, your coach. I'm here to answer any questions about your certification journey. What's on your mind?`,
            isUser: false,
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim() || isTyping) return;

        const userMessage: Message = {
            id: `user-${Date.now()}`,
            content: content.trim(),
            isUser: true,
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput("");
        setIsTyping(true);

        try {
            const response = await fetch("/api/vsl/sarah-response", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: content.trim(),
                    userName,
                }),
            });

            const data = await response.json();

            // Add artificial delay for realism
            const delay = data.delay || 2000;
            await new Promise(resolve => setTimeout(resolve, delay));

            const sarahMessage: Message = {
                id: `sarah-${Date.now()}`,
                content: data.response || "That's a great question! Let me think about that...",
                isUser: false,
                timestamp: new Date(),
            };

            setMessages(prev => [...prev, sarahMessage]);
        } catch (error) {
            console.error("Error getting Sarah response:", error);
            const errorMessage: Message = {
                id: `sarah-${Date.now()}`,
                content: "Sorry, I got distracted for a second! Could you ask that again?",
                isUser: false,
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
            inputRef.current?.focus();
        }
    }, [isTyping, userName]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage(input);
        }
    };

    const handleQuickQuestion = (question: string) => {
        sendMessage(question);
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="flex-shrink-0 bg-gradient-to-r from-burgundy-600 to-rose-600 px-4 py-3 text-white">
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
                            Online now
                        </div>
                    </div>
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
                            className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                                msg.isUser
                                    ? "bg-burgundy-600 text-white rounded-br-md"
                                    : "bg-white border border-gray-200 text-gray-800 rounded-bl-md shadow-sm"
                            }`}
                        >
                            <p className="text-sm leading-relaxed">{msg.content}</p>
                        </div>
                    </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                    <div className="flex gap-2">
                        <Image
                            src={SARAH_AVATAR}
                            alt="Sarah"
                            width={32}
                            height={32}
                            className="rounded-full flex-shrink-0 self-end"
                        />
                        <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                            <div className="flex gap-1">
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Questions */}
            {messages.length <= 2 && !isTyping && (
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
                        disabled={isTyping}
                        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <button
                        onClick={() => sendMessage(input)}
                        disabled={!input.trim() || isTyping}
                        className="p-2.5 bg-burgundy-600 text-white rounded-full hover:bg-burgundy-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {isTyping ? (
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
