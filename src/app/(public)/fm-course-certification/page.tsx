"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

// NEW Sales page images - FM Practitioner Certification V2 ($197)
const salesImages = [
    { src: "/sales-images/fm-cert/fm_cert_hero_v3_1768138625292.png", alt: "From $68K Nurse To $135K Working 20 Hours/Week From Home", priority: true },
    { src: "/sales-images/fm-cert/fm_problem_1767548810219.png", alt: "Does this sound like you?" },
    { src: "/sales-images/fm-cert/fm_agitation_1767548813472.png", alt: "The ugly truth about healthcare" },
    { src: "/sales-images/fm-cert/fm_solution_1767548837542.png", alt: "There is another way" },
    { src: "/sales-images/fm-cert/fm_course_thumb_1767548891028.png", alt: "FM Practitioner Certification Course" },
    { src: "/sales-images/fm-cert/shared_credibility.png", alt: "Accredited by 9 professional bodies" },
    { src: "/sales-images/fm-cert/fm_cert_whatyouget_v2_1768138641978.png", alt: "What You Get - 5-Person Accountability Pod" },
    { src: "/sales-images/fm-cert/fm_cert_mentor_sarah_1768138233552.png", alt: "Your Personal Mentor Coach Sarah" },
    { src: "/sales-images/fm-cert/fm_income_v1.png", alt: "Income proof - Practitioner earnings" },
    { src: "/sales-images/fm-cert/fm_income_v2.png", alt: "Income proof - Bank statement" },
    { src: "/sales-images/fm-cert/fm_income_v3.png", alt: "Income proof - Client payments" },
    { src: "/sales-images/fm-cert/fm_income_v4.png", alt: "Income proof - Monthly revenue" },
    { src: "/sales-images/fm-cert/shared_socialproof.png", alt: "What our practitioners are saying" },
    { src: "/sales-images/fm-cert/whats_included.png", alt: "Everything included in your certification" },
    { src: "/sales-images/fm-cert/private_coach.png", alt: "Your private coach - Sarah M." },
    { src: "/sales-images/fm-cert/career_roadmap.png", alt: "Your career roadmap to Board Certified" },
    { src: "/sales-images/fm-cert/pod_accountability.png", alt: "5-Person Accountability Pod" },
    { src: "/sales-images/fm-cert/fm_curriculum_1767548839262.png", alt: "Complete curriculum - 21 modules" },
    { src: "/sales-images/fm-cert/comparison_other_certs.png", alt: "How we compare to other certifications" },
    { src: "/sales-images/fm-cert/fm_cert_pricing_v2_1768138659551.png", alt: "FM Practitioner Certification $197", isCta: true },
    { src: "/sales-images/fm-cert/shared_guarantee.png", alt: "30-day money-back guarantee" },
    { src: "/sales-images/fm-cert/shared_faq.png", alt: "Frequently asked questions" },
    { src: "/sales-images/fm-cert/imessage_group.png", alt: "Join our iMessage accountability group" },
    { src: "/sales-images/fm-cert/fm_cert_finalcta_v2_1768138681076.png", alt: "Get Certified Now - Start Your Journey", isCta: true },
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

    const [isVerifying, setIsVerifying] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [showProactivePopup, setShowProactivePopup] = useState(false);
    const [visitorId, setVisitorId] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

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

                        return result;
                    });
                }
            } catch (err) {
                // Silent fail for polling
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [visitorId, showOptin, chatOpen]);

    useEffect(() => {
        const handleScroll = () => {
            setShowFloatingCta(window.scrollY > 200);
        };

        window.addEventListener("scroll", handleScroll);

        let vid = localStorage.getItem("chatVisitorId");
        if (!vid) {
            vid = "visitor_" + Math.random().toString(36).substr(2, 9);
            localStorage.setItem("chatVisitorId", vid);
        }
        setVisitorId(vid);

        const savedName = localStorage.getItem("chatUserName");
        if (savedName) {
            setUserName(savedName);
            setShowOptin(false);
            setMessages([{
                role: "bot",
                content: `Hey ${savedName}! 👋 Welcome back! I'm Sarah, your personal mentor. Ask me anything about the certification!`
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
        }, 30000);

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
                content: `Hey ${userName}! 👋 So nice to meet you! I'm Sarah, your personal mentor. I'll be guiding you through the entire certification journey. Ask me anything!`
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
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);

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
        } catch {
            // Silent fail - message will still sync via polling
        }
    };

    return (
        <>
            {/* Meta tags for SEO */}
            <head>
                <title>FM Practitioner Certification | AccrediPro Academy</title>
                <meta
                    name="description"
                    content="From $68K Nurse to $135K Working 20 Hours/Week From Home. FM-FC™ Credential + Personal Mentor + 5-Person Pod. Your path to Board Certified starts here."
                />
            </head>

            {/* Sticky Promo Banner */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#722F37] to-[#8B3A42] shadow-lg">
                <div className="max-w-[1080px] mx-auto px-4 py-2.5 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2 text-sm">
                        <span>🎉</span>
                        <span className="font-bold">JANUARY SPECIAL: 80% OFF</span>
                        <span className="hidden sm:inline">— Limited Spots!</span>
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
                        GET CERTIFIED — $197 →
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
                    GET CERTIFIED - $197 →
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
                                <h4 className="font-semibold text-sm">Sarah M. — Your Personal Mentor</h4>
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
                                {emailError && (
                                    <p className="text-red-500 text-xs mb-2">{emailError}</p>
                                )}
                                <button
                                    onClick={startChat}
                                    disabled={isVerifying}
                                    className="w-full bg-[#722F37] text-white py-3 rounded-lg font-bold text-sm hover:bg-[#5A2435] disabled:opacity-50"
                                >
                                    {isVerifying ? "Verifying..." : "Let's Chat!"}
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
                                <p className="text-sm text-gray-600 mb-3">👋 Have questions about the certification? I'm your personal mentor — ask me anything!</p>
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
                        Sarah here... I&apos;m your mentor! Ask me anything 💬
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
