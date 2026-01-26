"use client";

import { useEffect, useState, useRef } from "react";

export default function ChatTestPage() {
  const [chatOpen, setChatOpen] = useState(false);
  const [showOptin, setShowOptin] = useState(true);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [visitorId, setVisitorId] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
    { role: "bot", text: "Hey there! I'm Sarah. Ask me anything about the FM Certification!" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [debugLogs, setDebugLogs] = useState<{ type: string; message: string; time: string }[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const debugLog = (type: string, message: string) => {
    const time = new Date().toLocaleTimeString();
    setDebugLogs((prev) => [{ type, message, time }, ...prev]);
  };

  const resetChat = () => {
    localStorage.removeItem("chatVisitorId");
    localStorage.removeItem("chatUserName");
    localStorage.removeItem("chatUserEmail");
    const newVid = "visitor_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("chatVisitorId", newVid);
    setVisitorId(newVid);
    setUserName("");
    setUserEmail("");
    setShowOptin(true);
    setMessages([{ role: "bot", text: "Hey there! I'm Sarah. Ask me anything about the FM Certification!" }]);
    setChatOpen(false);
    setDebugLogs([]);
    debugLog("info", "Chat reset! New Visitor ID: " + newVid);
  };

  useEffect(() => {
    let vid = localStorage.getItem("chatVisitorId");
    if (!vid) {
      vid = "visitor_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("chatVisitorId", vid);
    }
    setVisitorId(vid);
    debugLog("info", "Visitor ID: " + vid);

    const storedName = localStorage.getItem("chatUserName");
    const storedEmail = localStorage.getItem("chatUserEmail");
    if (storedName) {
      setUserName(storedName);
      setShowOptin(false);
    }
    if (storedEmail) setUserEmail(storedEmail);

    debugLog("success", "Chat widget initialized");
  }, []);

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

        if (data.messages && data.messages.length > 0) {
          // Only update if we have new messages (compare counts)
          setMessages((prev) => {
            // If server has more messages, use server data
            if (data.messages.length > prev.length) {
              debugLog("info", `Synced ${data.messages.length - prev.length} new message(s)`);
              return data.messages.map((m: any) => ({
                role: m.role as "user" | "bot",
                text: m.text
              }));
            }
            return prev;
          });
        }
      } catch (err) {
        // Silent fail for polling
      }
    };

    // Initial fetch
    fetchMessages();

    // Poll every 3 seconds
    const interval = setInterval(fetchMessages, 3000);

    return () => clearInterval(interval);
  }, [visitorId, showOptin, chatOpen]);

  const [isVerifying, setIsVerifying] = useState(false);
  const [emailError, setEmailError] = useState("");

  const handleStartChat = async () => {
    if (!userName.trim() || !userEmail.trim()) {
      setEmailError("Please enter your name and email.");
      return;
    }

    setIsVerifying(true);
    setEmailError("");
    debugLog("info", "Verifying email: " + userEmail);

    try {
      // 1. Verify Email
      const verifyRes = await fetch("/api/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail }),
      });
      const verifyData = await verifyRes.json();

      if (!verifyData.valid) {
        setEmailError(verifyData.message || "Invalid email.");
        debugLog("error", "Email validation failed: " + verifyData.message);
        setIsVerifying(false);
        return;
      }

      debugLog("success", "Email verified!");

      // 2. Save Optin
      localStorage.setItem("chatUserName", userName);
      localStorage.setItem("chatUserEmail", userEmail);

      const response = await fetch("/api/chat/optin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          visitorId,
          name: userName,
          email: userEmail,
          page: "chat-test",
        }),
      });

      const data = await response.json();
      if (data.success) {
        debugLog("success", "Optin saved: " + (data.optinId || "ok"));
      }

      setShowOptin(false);
      setMessages([{ role: "bot", text: `Hey ${userName}! Nice to meet you! Ask me anything about the FM Certification!` }]);

    } catch (err) {
      debugLog("error", "Error: " + (err instanceof Error ? err.message : "Unknown"));
      setEmailError("Connection error. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };


  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const message = inputValue.trim();
    setInputValue("");
    setMessages((prev) => [...prev, { role: "user", text: message }]);
    debugLog("info", "Sending message: " + message.substring(0, 50) + "...");

    setIsTyping(true);

    try {
      const response = await fetch("/api/chat/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          page: "chat-test",
          visitorId,
          userName,
          userEmail,
        }),
      });

      debugLog("info", "Response status: " + response.status);
      const data = await response.json();
      debugLog("success", "AI replied: " + (data.reply || "No reply").substring(0, 50) + "...");
      setMessages((prev) => [...prev, { role: "bot", text: data.reply || "Thanks for your question!" }]);
    } catch (err) {
      debugLog("error", "Error: " + (err instanceof Error ? err.message : "Unknown"));
      setMessages((prev) => [...prev, { role: "bot", text: "Sorry, I couldn't connect. Please try again!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF8F3] flex flex-col items-center p-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-[#6B2C40] mb-2">Live Chat Test Page</h1>
        <p className="text-gray-500">Testing the Sarah AI chat widget</p>
      </div>

      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-lg mb-10">
        <h2 className="text-xl font-semibold mb-4">Test Instructions</h2>
        <ul className="space-y-2 text-gray-600">
          <li><strong>1.</strong> Click the chat bubble in the bottom right</li>
          <li><strong>2.</strong> Enter your name (or skip)</li>
          <li><strong>3.</strong> Send a message to Sarah</li>
          <li><strong>4.</strong> Check the debug panel for API responses</li>
          <li><strong>5.</strong> Verify in <a href="/admin/live-chat" className="text-blue-600 hover:underline" target="_blank">/admin/live-chat</a></li>
        </ul>
      </div>

      <div className="bg-[#1a1a1a] text-green-400 rounded-xl p-5 max-w-md w-full font-mono text-xs max-h-72 overflow-y-auto">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white text-sm">Debug Log</h3>
          <button
            onClick={resetChat}
            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
          >
            Reset Chat
          </button>
        </div>
        {debugLogs.map((log, i) => (
          <div key={i} className="mb-2 pb-2 border-b border-gray-700">
            <span className="text-gray-500">[{log.time}]</span>{" "}
            <span className={log.type === "success" ? "text-green-400" : log.type === "error" ? "text-red-400" : "text-blue-400"}>
              {log.message}
            </span>
          </div>
        ))}
      </div>

      {/* Chat Widget */}
      <div className="fixed bottom-5 right-5 z-50">
        {chatOpen && (
          <div className="absolute bottom-[70px] right-0 w-[360px] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[500px]">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#6B2C40] to-[#5A2435] text-white p-4 flex items-center gap-3">
              <img
                src="https://assets.accredipro.academy/fm-certification/Sarah-M.webp"
                alt="Sarah"
                className="w-11 h-11 rounded-full border-2 border-[#C9A54D]"
              />
              <div>
                <h4 className="font-semibold">Sarah</h4>
                <p className="text-xs opacity-90 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> Online now
                </p>
              </div>
              <button onClick={() => setChatOpen(false)} className="ml-auto text-xl opacity-80 hover:opacity-100">
                &times;
              </button>
            </div>

            {showOptin ? (
              <div className="p-4">
                <p className="text-sm text-gray-500 text-center mb-3">Hey, Sarah here! How should I call you?</p>
                <input
                  type="text"
                  placeholder="Your first name"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full border rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:border-[#6B2C40]"
                />
                <input
                  type="email"
                  placeholder="Your email (in case I'm offline)"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 text-sm mb-2 focus:outline-none focus:border-[#6B2C40] ${emailError ? "border-red-500 bg-red-50" : ""}`}
                />
                {emailError && <p className="text-xs text-red-500 mb-2">{emailError}</p>}

                <button
                  onClick={handleStartChat}
                  disabled={isVerifying}
                  className="w-full bg-[#6B2C40] text-white py-3 rounded-lg font-bold hover:bg-[#5A2435] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isVerifying ? "Verifying..." : "Let's Chat!"}
                </button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 bg-gray-50 min-h-[200px] max-h-[300px]">
                  {messages.map((msg, i) => (
                    <div key={i} className={`flex gap-2 mb-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                      {msg.role === "bot" && (
                        <img
                          src="https://assets.accredipro.academy/fm-certification/Sarah-M.webp"
                          alt="Sarah"
                          className="w-8 h-8 rounded-full flex-shrink-0"
                        />
                      )}
                      <div
                        className={`px-3 py-2 max-w-[240px] text-sm rounded-2xl ${msg.role === "user"
                          ? "bg-[#6B2C40] text-white rounded-br-sm"
                          : "bg-white border rounded-bl-sm"
                          }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {isTyping && (
                    <div className="flex gap-2 mb-3">
                      <img
                        src="https://assets.accredipro.academy/fm-certification/Sarah-M.webp"
                        alt="Sarah"
                        className="w-8 h-8 rounded-full"
                      />
                      <div className="bg-white border rounded-2xl px-3 py-2 flex gap-1">
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <div className="flex gap-2 p-3 border-t">
                  <input
                    type="text"
                    placeholder="Type your question..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-[#6B2C40]"
                  />
                  <button
                    onClick={sendMessage}
                    className="w-10 h-10 rounded-full bg-[#6B2C40] text-white flex items-center justify-center hover:bg-[#5A2435]"
                  >
                    &#10148;
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Bubble */}
        <div
          onClick={() => setChatOpen(!chatOpen)}
          className="w-[60px] h-[60px] rounded-full bg-gradient-to-br from-[#6B2C40] to-[#5A2435] flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition-transform relative"
        >
          <div className="absolute inset-[-4px] rounded-full bg-[#6B2C40] opacity-30 animate-ping" />
          <img
            src="https://assets.accredipro.academy/fm-certification/Sarah-M.webp"
            alt="Sarah"
            className="w-[42px] h-[42px] rounded-full border-2 border-[#C9A54D]"
          />
          <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white" />
        </div>
      </div>
    </div>
  );
}
