"use client";

import { useEffect, useState, useRef } from "react";

export default function TestLiveChatPage() {
    const [chatOpen, setChatOpen] = useState(true);
    const [showOptin, setShowOptin] = useState(true);
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [messages, setMessages] = useState<{ role: string; content: string; fromServer?: boolean }[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [visitorId, setVisitorId] = useState("");
    const [debugLog, setDebugLog] = useState<string[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const addLog = (msg: string) => {
        const timestamp = new Date().toLocaleTimeString();
        setDebugLog(prev => [...prev, `[${timestamp}] ${msg}`]);
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // POLLING: Fetch messages from server every 3s to sync admin replies
    useEffect(() => {
        if (!visitorId || showOptin || !chatOpen) return;

        const fetchMessages = async () => {
            try {
                const res = await fetch(`/api/chat/messages?visitorId=${visitorId}`);
                const data = await res.json();
                addLog(`Polled: ${data.count} messages from server`);

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

                        const result = [];
                        if (welcomeMsg) result.push(welcomeMsg);
                        result.push(...serverMessages);
                        result.push(...pendingUserMsgs);

                        if (result.length !== prev.length) {
                            addLog(`Messages updated: ${prev.length} -> ${result.length}`);
                        }

                        return result;
                    });
                }
            } catch (err) {
                addLog(`Poll error: ${err}`);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [visitorId, showOptin, chatOpen]);

    useEffect(() => {
        // Generate a unique test visitor ID
        const testVid = "test_" + Math.random().toString(36).substr(2, 9);
        setVisitorId(testVid);
        addLog(`Visitor ID: ${testVid}`);
    }, []);

    const startChat = async () => {
        if (!userName.trim()) {
            setUserName("Test User");
        }
        if (!userEmail.trim()) {
            setUserEmail("test@example.com");
        }

        const finalName = userName.trim() || "Test User";
        const finalEmail = userEmail.trim() || "test@example.com";

        addLog(`Starting chat as: ${finalName} (${finalEmail})`);

        // Save optin
        try {
            await fetch("/api/chat/optin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    visitorId: visitorId,
                    name: finalName,
                    email: finalEmail,
                    page: "test-live-chat"
                })
            });
            addLog("Optin saved");
        } catch (e) {
            addLog(`Optin error: ${e}`);
        }

        setUserName(finalName);
        setUserEmail(finalEmail);
        setShowOptin(false);
        setMessages([{
            role: "bot",
            content: `Hey ${finalName}! This is a TEST chat. Send a message and then reply from the admin panel to test sync.`
        }]);
    };

    const sendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage = inputValue;
        setInputValue("");
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setIsTyping(true);
        addLog(`Sent: "${userMessage}"`);

        try {
            const res = await fetch("/api/chat/sales", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    page: "test-live-chat",
                    visitorId: visitorId,
                    userName,
                    userEmail
                })
            });
            const data = await res.json();
            addLog(`Server response: ${data.status}`);
            setTimeout(() => setIsTyping(false), 2000);
        } catch (e) {
            addLog(`Send error: ${e}`);
            setIsTyping(false);
        }
    };

    const clearChat = async () => {
        // Delete all messages for this visitor
        try {
            await fetch("/api/admin/live-chat/delete", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ visitorId })
            });
            addLog("Chat cleared");
            // Reset state
            setMessages([]);
            setShowOptin(true);
            setUserName("");
            setUserEmail("");
            // Generate new visitor ID
            const newVid = "test_" + Math.random().toString(36).substr(2, 9);
            setVisitorId(newVid);
            addLog(`New visitor ID: ${newVid}`);
        } catch (e) {
            addLog(`Clear error: ${e}`);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-2">Live Chat Test Page</h1>
                <p className="text-gray-600 mb-6">
                    Test the live chat sync between user widget and admin panel.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Chat Widget */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-[#722F37] to-[#5A2435] text-white p-4 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center font-bold">S</div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-sm">Sarah (Test Mode)</h4>
                                <p className="text-xs opacity-90">Visitor: {visitorId}</p>
                            </div>
                            <button
                                onClick={clearChat}
                                className="text-xs bg-red-500 px-3 py-1 rounded-full hover:bg-red-600"
                            >
                                Clear & Reset
                            </button>
                        </div>

                        {showOptin ? (
                            <div className="p-4 bg-white">
                                <p className="text-sm text-gray-500 mb-3 text-center">Enter your test details:</p>
                                <input
                                    type="text"
                                    placeholder="Your name (or leave blank for 'Test User')"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg p-3 text-sm mb-2 focus:outline-none focus:border-[#722F37]"
                                />
                                <input
                                    type="email"
                                    placeholder="Your email (or leave blank)"
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg p-3 text-sm mb-2 focus:outline-none focus:border-[#722F37]"
                                />
                                <button
                                    onClick={startChat}
                                    className="w-full bg-[#722F37] text-white py-3 rounded-lg font-bold text-sm hover:bg-[#5A2435]"
                                >
                                    Start Test Chat
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="h-80 overflow-y-auto p-3 bg-gray-50">
                                    {messages.map((msg, i) => (
                                        <div key={i} className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "gap-2"}`}>
                                            {msg.role === "bot" && (
                                                <div className="w-7 h-7 rounded-full bg-[#D4AF37] flex items-center justify-center text-xs font-bold flex-shrink-0">S</div>
                                            )}
                                            <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.role === "user"
                                                ? "bg-[#722F37] text-white rounded-br-sm"
                                                : "bg-white border border-gray-200 rounded-bl-sm"
                                                }`}>
                                                {msg.content}
                                                {msg.fromServer && (
                                                    <span className="text-[10px] opacity-50 ml-2">(synced)</span>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <div className="flex gap-2 mb-3">
                                            <div className="w-7 h-7 rounded-full bg-[#D4AF37] flex items-center justify-center text-xs font-bold">S</div>
                                            <div className="bg-white border border-gray-200 p-3 rounded-xl flex gap-1">
                                                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                                                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                                                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Type a test message..."
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                                        className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#722F37]"
                                    />
                                    <button
                                        onClick={sendMessage}
                                        className="w-10 h-10 rounded-full bg-[#722F37] text-white flex items-center justify-center hover:bg-[#5A2435]"
                                    >
                                        ➤
                                    </button>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Debug Log */}
                    <div className="bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
                        <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
                            <h4 className="font-semibold text-sm">Debug Log</h4>
                            <button
                                onClick={() => setDebugLog([])}
                                className="text-xs bg-gray-700 px-3 py-1 rounded-full hover:bg-gray-600"
                            >
                                Clear Log
                            </button>
                        </div>
                        <div className="h-[400px] overflow-y-auto p-4 font-mono text-xs text-green-400">
                            {debugLog.length === 0 ? (
                                <p className="text-gray-500">Waiting for activity...</p>
                            ) : (
                                debugLog.map((log, i) => (
                                    <div key={i} className="mb-1">{log}</div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                    <h3 className="font-bold text-lg mb-3">How to Test:</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                        <li>Click <strong>Start Test Chat</strong> in the widget above</li>
                        <li>Send a test message (e.g., &quot;Hello!&quot;)</li>
                        <li>Open the <a href="/admin/live-chat" target="_blank" className="text-blue-600 underline">Admin Live Chat Panel</a> in a new tab</li>
                        <li>Find your test conversation (look for visitor ID: <code className="bg-gray-200 px-1 rounded">{visitorId}</code>)</li>
                        <li>Send a reply from the admin panel</li>
                        <li>Watch this page - the reply should appear within 3 seconds!</li>
                    </ol>
                    <p className="mt-4 text-sm text-gray-500">
                        The debug log on the right shows polling activity and message sync status.
                    </p>
                </div>
            </div>
        </div>
    );
}
