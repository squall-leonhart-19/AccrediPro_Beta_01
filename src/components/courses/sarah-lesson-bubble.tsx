"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Send, Loader2, MessageCircle } from "lucide-react";

interface SarahLessonBubbleProps {
    lessonId?: string;
    lessonTitle?: string;
    courseTitle?: string;
    moduleTitle?: string;
}

interface Message {
    role: "user" | "sarah";
    content: string;
}

export function SarahLessonBubble({
    lessonId,
    lessonTitle,
    courseTitle,
    moduleTitle
}: SarahLessonBubbleProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Initial greeting when opened
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                role: "sarah",
                content: `Hi there! 👋 I'm Coach Sarah, and I'm here to help you with "${lessonTitle || 'this lesson'}". What questions do you have? I'm happy to explain anything that's unclear!`
            }]);
        }
    }, [isOpen, lessonTitle, messages.length]);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput("");
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setLoading(true);

        try {
            const res = await fetch("/api/sarah/lesson-help", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    lessonId,
                    lessonTitle,
                    courseTitle,
                    moduleTitle,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                setMessages(prev => [...prev, { role: "sarah", content: data.reply }]);
            } else {
                setMessages(prev => [...prev, {
                    role: "sarah",
                    content: "I'm having trouble responding right now. Please try again in a moment! 💚"
                }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, {
                role: "sarah",
                content: "Something went wrong. Let me know if you need help!"
            }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Bubble Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-gradient-to-r from-[#722f37] to-[#8b3a42] text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 group"
                >
                    <Avatar className="w-8 h-8 border-2 border-white">
                        <AvatarImage src="/coaches/sarah-mitchell.webp" />
                        <AvatarFallback className="bg-[#B8860B] text-white text-xs font-bold">SM</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">Ask Sarah</span>
                    <MessageCircle className="w-4 h-4 group-hover:animate-pulse" />
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <Card className="fixed bottom-6 right-6 z-50 w-[380px] max-h-[500px] shadow-2xl border-[#722f37]/20 overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[#722f37] to-[#8b3a42] text-white p-3 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8 border-2 border-white/30">
                                <AvatarImage src="/coaches/sarah-mitchell.webp" />
                                <AvatarFallback className="bg-[#B8860B] text-white text-xs font-bold">SM</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-sm">Coach Sarah</p>
                                <p className="text-xs text-white/80">Here to help 💚</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Lesson Context */}
                    {lessonTitle && (
                        <div className="px-3 py-2 bg-[#722f37]/5 text-xs text-[#722f37] border-b border-[#722f37]/10">
                            📚 Helping with: <strong>{lessonTitle}</strong>
                        </div>
                    )}

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-[300px]">
                        {messages.map((msg, i) => (
                            <div
                                key={i}
                                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${msg.role === "user"
                                        ? "bg-[#722f37] text-white rounded-br-md"
                                        : "bg-gray-100 text-gray-800 rounded-bl-md"
                                        }`}
                                >
                                    {msg.content}
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2">
                                    <Loader2 className="w-4 h-4 animate-spin text-[#722f37]" />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-3 border-t bg-white">
                        <form
                            onSubmit={(e) => { e.preventDefault(); sendMessage(); }}
                            className="flex gap-2"
                        >
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask me anything..."
                                className="flex-1 text-sm focus-visible:ring-[#722f37]"
                                disabled={loading}
                            />
                            <Button
                                type="submit"
                                size="sm"
                                disabled={loading || !input.trim()}
                                className="bg-[#722f37] hover:bg-[#8b3a42]"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </form>
                    </div>
                </Card>
            )}
        </>
    );
}
