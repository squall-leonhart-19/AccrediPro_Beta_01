"use client";

import { useEffect, useState, useRef } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import Image from "next/image";

interface FloatingChatWidgetProps {
    coachName?: string;
    coachImage?: string;
    page: string;
}

export function FloatingChatWidget({
    coachName = "Sarah",
    coachImage = "/coaches/sarah-mitchell.webp",
    page,
}: FloatingChatWidgetProps) {
    const [chatOpen, setChatOpen] = useState(false);
    const [showOptin, setShowOptin] = useState(true);
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [messages, setMessages] = useState<{ role: string; content: string; fromServer?: boolean }[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [visitorId, setVisitorId] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Generate visitor ID on mount
    useEffect(() => {
        const vid = "v_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
        setVisitorId(vid);
    }, []);

    // Polling for messages
    useEffect(() => {
        if (!visitorId || showOptin || !chatOpen) return;

        const fetchMessages = async () => {
            try {
                const res = await fetch(`/api/chat/messages?visitorId=${visitorId}`);
                const data = await res.json();

                if (data.messages) {
                    const serverMessages = data.messages.map((m: any) => ({
                        role: m.role === "user" ? "user" : "bot",
                        content: m.text,
                        fromServer: true
                    }));

                    setMessages((prev) => {
                        const welcomeMsg = prev.length > 0 && !prev[0].fromServer ? prev[0] : null;
                        const pendingUserMsgs = prev.filter(m =>
                            m.role === "user" && !m.fromServer &&
                            !serverMessages.some((s: any) => s.content === m.content)
                        );

                        const result: { role: string; content: string; fromServer?: boolean }[] = [];
                        if (welcomeMsg) result.push(welcomeMsg);
                        result.push(...serverMessages);
                        result.push(...pendingUserMsgs);

                        return result;
                    });
                }
            } catch (err) {
                console.error("Chat poll error:", err);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [visitorId, showOptin, chatOpen]);

    const startChat = async () => {
        if (!userName.trim() || !userEmail.trim()) return;

        try {
            await fetch("/api/chat/optin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    visitorId,
                    name: userName.trim(),
                    email: userEmail.trim(),
                    page
                })
            });
        } catch (e) {
            console.error("Chat optin error:", e);
        }

        setShowOptin(false);
        setMessages([{
            role: "bot",
            content: `Hey ${userName.trim()}! 👋 I'm ${coachName}, your guide through the Women's Health Mini Diploma. How can I help you today?`
        }]);
    };

    const sendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage = inputValue;
        setInputValue("");
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setIsTyping(true);

        try {
            await fetch("/api/chat/sales", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    page,
                    visitorId,
                    userName,
                    userEmail
                })
            });
            setTimeout(() => setIsTyping(false), 2000);
        } catch (e) {
            console.error("Chat send error:", e);
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            {!chatOpen && (
                <button
                    onClick={() => setChatOpen(true)}
                    className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-burgundy-600 hover:bg-burgundy-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110"
                >
                    <MessageCircle className="h-7 w-7" />
                    {/* Online indicator */}
                    <span className="absolute top-1 right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                </button>
            )}

            {/* Chat Window */}
            {chatOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white p-4 flex items-center gap-3">
                        <div className="relative">
                            <Image
                                src={coachImage}
                                alt={coachName}
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                            <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-burgundy-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-semibold text-sm">Chat with {coachName}</h4>
                        </div>
                        <button
                            onClick={() => setChatOpen(false)}
                            className="text-white/80 hover:text-white"
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {showOptin ? (
                        /* Optin Form */
                        <div className="p-5">
                            <p className="text-sm text-gray-600 mb-4 text-center">
                                👋 Hi! I&apos;m Coach {coachName}. Enter your name to start chatting!
                            </p>
                            <input
                                type="text"
                                placeholder="Your first name"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg p-3 text-sm mb-2 focus:outline-none focus:border-burgundy-500"
                            />
                            <input
                                type="email"
                                placeholder="Your email"
                                value={userEmail}
                                onChange={(e) => setUserEmail(e.target.value)}
                                className="w-full border border-gray-200 rounded-lg p-3 text-sm mb-3 focus:outline-none focus:border-burgundy-500"
                            />
                            <button
                                onClick={startChat}
                                disabled={!userName.trim() || !userEmail.trim()}
                                className="w-full bg-burgundy-600 hover:bg-burgundy-700 disabled:bg-gray-300 text-white py-3 rounded-lg font-semibold text-sm transition-colors"
                            >
                                Start Chat
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Messages */}
                            <div className="h-72 overflow-y-auto p-4 bg-gray-50">
                                {messages.map((msg, i) => (
                                    <div key={i} className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                                        <div className={`max-w-[85%] p-3 rounded-xl text-sm ${msg.role === "user"
                                            ? "bg-burgundy-600 text-white rounded-br-sm"
                                            : "bg-white border border-gray-200 rounded-bl-sm text-gray-700"
                                            }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                                {isTyping && (
                                    <div className="flex justify-start mb-3">
                                        <div className="bg-white border border-gray-200 p-3 rounded-xl flex gap-1">
                                            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" />
                                            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
                                            <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                                        </div>
                                    </div>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input */}
                            <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                                    className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-burgundy-500"
                                />
                                <button
                                    onClick={sendMessage}
                                    disabled={!inputValue.trim()}
                                    className="w-10 h-10 rounded-full bg-burgundy-600 hover:bg-burgundy-700 disabled:bg-gray-300 text-white flex items-center justify-center transition-colors"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}
        </>
    );
}
