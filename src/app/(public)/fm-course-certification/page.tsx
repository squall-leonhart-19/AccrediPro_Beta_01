"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

// Sales page images in order
const salesImages = [
    { src: "/sales-images/sp_img_01_hero_1766504275701.png", alt: "Functional Medicine Certification - From $68K to $135K working from home", priority: true },
    { src: "/sales-images/sp_img_02_problem_1766504311399.png", alt: "Does this sound like you? Common pain points of healthcare workers" },
    { src: "/sales-images/sp_img_03_agitation_1766504331004.png", alt: "The ugly truth about healthcare in 2024" },
    { src: "/sales-images/sp_img_04_solution.png", alt: "Introducing Functional Medicine Practitioner Certification" },
    { src: "/sales-images/sp_img_05_credibility.png", alt: "Accredited by 9 professional bodies - 1447 practitioners certified" },
    { src: "/sales-images/sp_img_06_socialproof_1766504460682.png", alt: "Real results from real practitioners - testimonials" },
    { src: "/sales-images/fm_compare_table_1766447639945.png", alt: "Nursing vs FM Coaching comparison - Income, Hours, Freedom" },
    { src: "/sales-images/fm_cro_payment_1766334094314.png", alt: "Stripe payment received - Real client payment" },
    { src: "/sales-images/fm_cro_bank_statement_1766352939005.png", alt: "Bank statement showing FM practitioner income" },
    { src: "/sales-images/fm_cro_calendar_freedom_1766352854539.png", alt: "Flexible schedule - Work when you want" },
    { src: "/sales-images/sp_img_07_transformation_1766504511154.png", alt: "Before and after transformation stories" },
    { src: "/sales-images/sp_img_08_curriculum_1766504530305.png", alt: "What's inside - 21 modules of complete practitioner training" },
    { src: "/sales-images/sp_img_09_included_1766504568811.png", alt: "Everything you get - $4285 value" },
    { src: "/sales-images/sp_img_10_pricing_1766504585512.png", alt: "Your investment today - $97 one-time payment" },
    { src: "/sales-images/sp_img_11_guarantee_1766504633606.png", alt: "30-day money-back guarantee - risk free" },
    { src: "/sales-images/sp_img_12_faq_1766504654263.png", alt: "Frequently asked questions" },
    { src: "/sales-images/sp_img_13_finalcta_1766504690313.png", alt: "The choice is yours - Get certified now" },
];

const CHECKOUT_URL = "https://sarah.accredipro.academy/checkout-fm-certification";

export default function FMCourseCertificationPage() {
    const [showFloatingCta, setShowFloatingCta] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [showOptin, setShowOptin] = useState(true);
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [messages, setMessages] = useState<{ role: string; content: string; fromServer?: boolean }[]>([]);
    const [inputValue, setInputValue] = useState("");

    const [isTyping, setIsTyping] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [showProactivePopup, setShowProactivePopup] = useState(false);
    const [visitorId, setVisitorId] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // POLLING: Fetch messages from server every 3s to sync admin replies
    // We track server messages separately and merge with welcome message
    useEffect(() => {
        if (!visitorId || showOptin || !chatOpen) return;

        const fetchMessages = async () => {
            try {
                const res = await fetch(`/api/chat/messages?visitorId=${visitorId}`);
                const data = await res.json();

                if (data.messages) {
                    // Convert server messages to our format
                    const serverMessages = data.messages.map((m: any) => ({
                        role: m.role === "user" ? "user" : "bot",
                        content: m.text,
                        fromServer: true
                    }));

                    setMessages((prev) => {
                        // Keep the welcome message (first message, not from server)
                        const welcomeMsg = prev.length > 0 && !prev[0].fromServer ? prev[0] : null;

                        // Filter out any pending/typing indicators from local state
                        const pendingUserMsgs = prev.filter(m =>
                            m.role === "user" && !m.fromServer &&
                            !serverMessages.some((s: any) => s.content === m.content)
                        );

                        // Build final messages: welcome + server messages + pending user messages
                        const result = [];
                        if (welcomeMsg) result.push(welcomeMsg);
                        result.push(...serverMessages);
                        result.push(...pendingUserMsgs);

                        return result;
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

    useEffect(() => {
        // Show floating CTA after scrolling 200px
        const handleScroll = () => {
            setShowFloatingCta(window.scrollY > 200);
        };

        window.addEventListener("scroll", handleScroll);

        // Initialize Visitor ID
        let vid = localStorage.getItem("chatVisitorId");
        if (!vid) {
            vid = "visitor_" + Math.random().toString(36).substr(2, 9);
            localStorage.setItem("chatVisitorId", vid);
        }
        setVisitorId(vid);

        // Check localStorage for existing user
        const savedName = localStorage.getItem("chatUserName");
        if (savedName) {
            setUserName(savedName);
            setShowOptin(false);
            setMessages([{
                role: "bot",
                content: `Hey ${savedName}! 👋 Welcome back! I'm Sarah, the lead instructor. Ask me anything about the certification!`
            }]);
        }

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Proactive popup: Show after 30s, once per session
    useEffect(() => {
        const hasSeenPopup = sessionStorage.getItem("fm-chat-popup-seen");
        if (hasSeenPopup || chatOpen) return;

        const timer = setTimeout(() => {
            setShowProactivePopup(true);
            sessionStorage.setItem("fm-chat-popup-seen", "true");
        }, 30000); // 30 seconds

        return () => clearTimeout(timer);
    }, [chatOpen]);

    const startChat = async () => {
        if (!userName.trim() || !userEmail.trim()) {
            setEmailError("Please enter your name and email to start.");
            return;
        }

        setIsVerifying(true);
        setEmailError("");

        try {
            const res = await fetch("/api/verify-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: userEmail })
            });
            const data = await res.json();

            if (!data.valid) {
                setEmailError(data.message || "Please enter a valid email address.");
                setIsVerifying(false);
                return;
            }

            // Success - proceed
            localStorage.setItem("chatUserName", userName);
            localStorage.setItem("chatUserEmail", userEmail);

            fetch("/api/chat/optin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    visitorId: visitorId,
                    name: userName,
                    email: userEmail,
                    page: "fm-course-certification"
                })
            }).catch(() => { });

            setShowOptin(false);
            setMessages([{
                role: "bot",
                content: `Hey ${userName}! 👋 So nice to meet you! I'm Sarah, the lead instructor here. I'm live right now — ask me anything about the certification!`
            }]);

        } catch (error) {
            setEmailError("Something went wrong. Please try again.");
        } finally {
            setIsVerifying(false);
        }
    };

    const sendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage = inputValue;
        setInputValue("");
        // Add user message locally (will be synced from server on next poll)
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setIsTyping(true);

        try {
            await fetch("/api/chat/sales", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    page: "fm-course-certification",
                    visitorId: visitorId,
                    userName,
                    userEmail
                })
            });
            // Don't add fake acknowledgment - let polling sync real admin replies
            // Show typing for 2 seconds to indicate message was received
            setTimeout(() => setIsTyping(false), 2000);
        } catch {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Meta tags for SEO */}
            <head>
                <title>Functional Medicine Practitioner Certification | AccrediPro Academy</title>
                <meta
                    name="description"
                    content="Transform from burned-out healthcare worker to thriving home-based practitioner. Get certified in 4-8 weeks. 9 International Accreditations. $97 today."
                />
            </head>

            {/* Sticky Promo Banner */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#722F37] to-[#8B3A42] shadow-lg">
                <div className="max-w-[1080px] mx-auto px-4 py-2.5 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2 text-sm">
                        <span>🎉</span>
                        <span className="font-bold">NEW YEAR SALE: 80% OFF</span>
                        <span className="hidden sm:inline">— Ends Soon!</span>
                        <span className="mx-2 opacity-50">|</span>
                        <span className="hidden sm:flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            Sarah is Online
                        </span>
                        <button
                            onClick={() => setChatOpen(true)}
                            className="sm:hidden flex items-center gap-1 text-[#D4AF37] font-semibold"
                        >
                            💬 Chat
                        </button>
                    </div>
                    <Link
                        href={CHECKOUT_URL}
                        className="bg-gradient-to-r from-[#D4AF37] to-[#AA8C2C] text-[#1a1a1a] 
              px-5 py-1.5 rounded-full font-bold text-sm
              shadow-[0_2px_10px_rgba(212,175,55,0.3)]
              hover:scale-105 transition-transform"
                    >
                        GET CERTIFIED — $97 →
                    </Link>
                </div>
            </header>


            <main className="min-h-screen bg-[#1a1a1a] flex flex-col items-center pt-14">
                <div className="w-full max-w-[1080px] flex flex-col items-center">
                    {salesImages.map((image, index) => (
                        <Link
                            key={index}
                            href={CHECKOUT_URL}
                            className="w-full block cursor-pointer hover:opacity-95 transition-opacity"
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                width={1080}
                                height={1350}
                                className="w-full h-auto"
                                priority={image.priority}
                                loading={image.priority ? "eager" : "lazy"}
                            />
                        </Link>
                    ))}
                </div>

                {/* Floating CTA for Mobile */}
                <Link
                    href={CHECKOUT_URL}
                    className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-40 md:hidden
            bg-gradient-to-r from-[#D4AF37] to-[#AA8C2C] text-[#1a1a1a]
            px-8 py-4 rounded-full font-bold text-base
            shadow-[0_4px_20px_rgba(212,175,55,0.4)]
            transition-all duration-300
            hover:scale-105 hover:shadow-[0_6px_30px_rgba(212,175,55,0.6)]
            ${showFloatingCta ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}
                >
                    GET CERTIFIED - $97 →
                </Link>
            </main>

            {/* Sarah Live Chat Widget */}
            <div className="fixed bottom-5 right-5 z-50">
                {/* Chat Window */}
                {chatOpen && (
                    <div className="absolute bottom-20 right-0 w-[340px] bg-white rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-[#722F37] to-[#5A2435] text-white p-4 flex items-center gap-3">
                            <img
                                src="https://coach.accredipro.academy/wp-content/uploads/2025/10/Sarah-M.webp"
                                alt="Sarah"
                                className="w-10 h-10 rounded-full border-2 border-[#D4AF37]"
                            />
                            <div className="flex-1">
                                <h4 className="font-semibold text-sm">Sarah</h4>
                                <p className="text-xs opacity-90 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                    Online now
                                </p>
                            </div>
                            <button
                                onClick={() => setChatOpen(false)}
                                className="text-xl opacity-80 hover:opacity-100"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Optin Form */}
                        {showOptin ? (
                            <div className="p-4 bg-white">
                                <p className="text-sm text-gray-500 mb-3 text-center">Hey, Sarah here! How should I call you? 😊</p>
                                <input
                                    type="text"
                                    placeholder="Your first name"
                                    value={userName}
                                    onChange={(e) => setUserName(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg p-3 text-sm mb-2 focus:outline-none focus:border-[#722F37]"
                                />
                                <input
                                    type="email"
                                    placeholder="Your email (in case I'm offline)"
                                    value={userEmail}
                                    onChange={(e) => setUserEmail(e.target.value)}
                                    className="w-full border border-gray-200 rounded-lg p-3 text-sm mb-2 focus:outline-none focus:border-[#722F37]"
                                />
                                <button
                                    onClick={startChat}
                                    className="w-full bg-[#722F37] text-white py-3 rounded-lg font-bold text-sm hover:bg-[#5A2435]"
                                >
                                    Let&apos;s Chat!
                                </button>

                            </div>
                        ) : (
                            <>
                                {/* Messages */}
                                <div className="h-60 overflow-y-auto p-3 bg-gray-50">
                                    {messages.map((msg, i) => (
                                        <div key={i} className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "gap-2"}`}>
                                            {msg.role === "bot" && (
                                                <img
                                                    src="https://coach.accredipro.academy/wp-content/uploads/2025/10/Sarah-M.webp"
                                                    alt="Sarah"
                                                    className="w-7 h-7 rounded-full flex-shrink-0"
                                                />
                                            )}
                                            <div className={`max-w-[80%] p-3 rounded-xl text-sm ${msg.role === "user"
                                                ? "bg-[#722F37] text-white rounded-br-sm"
                                                : "bg-white border border-gray-200 rounded-bl-sm"
                                                }`}>
                                                {msg.content}
                                            </div>
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <div className="flex gap-2 mb-3">
                                            <img
                                                src="https://coach.accredipro.academy/wp-content/uploads/2025/10/Sarah-M.webp"
                                                alt="Sarah"
                                                className="w-7 h-7 rounded-full"
                                            />
                                            <div className="bg-white border border-gray-200 p-3 rounded-xl flex gap-1">
                                                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce"></span>
                                                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></span>
                                                <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></span>
                                            </div>
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Type your question..."
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
                )}

                {/* Proactive Popup (appears after 30s, once per session) */}
                {showProactivePopup && !chatOpen && (
                    <div className="absolute bottom-24 right-0 bg-white rounded-lg shadow-2xl p-4 w-72 border-2 border-[#D4AF37] animate-[slideIn_0.3s_ease-out]">
                        <button
                            onClick={() => setShowProactivePopup(false)}
                            className="absolute -top-2 -right-2 w-6 h-6 bg-gray-600 text-white rounded-full text-xs hover:bg-gray-700 flex items-center justify-center font-bold"
                        >
                            ✕
                        </button>
                        <div className="flex gap-3 items-start">
                            <img
                                src="https://coach.accredipro.academy/wp-content/uploads/2025/10/Sarah-M.webp"
                                alt="Sarah"
                                className="w-10 h-10 rounded-full border-2 border-[#D4AF37] flex-shrink-0"
                            />
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 mb-1">Sarah here!</p>
                                <p className="text-sm text-gray-600 mb-3">👋 Have questions about the certification? I'm here to help!</p>
                                <button
                                    onClick={() => { setChatOpen(true); setShowProactivePopup(false); }}
                                    className="w-full bg-gradient-to-r from-[#722F37] to-[#5A2435] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity"
                                >
                                    Ask Me Anything
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Chat Bubble */}
                <div
                    onClick={() => setChatOpen(!chatOpen)}
                    className="w-16 h-16 rounded-full bg-gradient-to-br from-[#722F37] to-[#5A2435] flex items-center justify-center cursor-pointer shadow-lg hover:scale-105 transition-transform relative"
                >
                    <div className="absolute inset-[-4px] rounded-full bg-[#722F37] opacity-30 animate-ping"></div>
                    <img
                        src="https://coach.accredipro.academy/wp-content/uploads/2025/10/Sarah-M.webp"
                        alt="Sarah"
                        className="w-11 h-11 rounded-full border-2 border-[#D4AF37]"
                    />
                    <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>

                {/* Chat Label */}
                {!chatOpen && (
                    <div className="absolute bottom-20 right-0 bg-white px-4 py-2 rounded-full shadow-md text-sm whitespace-nowrap animate-pulse">
                        Sarah here... I&apos;m live! Ask me anything 💬
                    </div>
                )}
            </div>

            <style jsx>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.3s ease;
        }
      `}</style>
        </>
    );
}
