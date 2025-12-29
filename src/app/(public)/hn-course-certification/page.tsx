"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// HN Sales page images in order (matching index.html structure)
const salesImages = [
    { src: "/sales-images/hn/hn_hero_1766948385466.png", alt: "Certified Holistic Nutrition Coach - Transform Lives Through Nutrition", priority: true },
    { src: "/sales-images/hn/hn_problem_1766948379743.png", alt: "Does this sound like you? Common pain points" },
    { src: "/sales-images/hn/hn_agitation_1766948382810.png", alt: "The truth about the nutrition industry" },
    { src: "/sales-images/hn/hn_solution_1766948450707.png", alt: "Introducing Holistic Nutrition Coach Certification" },
    { src: "/sales-images/hn/shared_credibility.png", alt: "Accredited certification - professional recognition" },
    { src: "/sales-images/hn/shared_socialproof.png", alt: "Real results from real practitioners" },
    { src: "/sales-images/hn/hn_comparison_1766948405478.png", alt: "Traditional job vs Nutrition Coaching comparison" },
    { src: "/sales-images/hn/shared_cro_payment.png", alt: "Client payment received" },
    { src: "/sales-images/hn/shared_cro_bank.png", alt: "Bank statement showing income" },
    { src: "/sales-images/hn/shared_cro_calendar.png", alt: "Flexible schedule - Work when you want" },
    { src: "/sales-images/hn/hn_cro_text_1766948427967.png", alt: "Client success messages" },
    { src: "/sales-images/hn/hn_transform_1766948426593.png", alt: "Transformation stories" },
    { src: "/sales-images/hn/hn_curriculum_1766948410868.png", alt: "What's inside - Complete training curriculum" },
    { src: "/sales-images/hn/shared_pricing.png", alt: "Your investment today - $97", isCta: true },
    { src: "/sales-images/hn/shared_guarantee.png", alt: "30-day money-back guarantee" },
    { src: "/sales-images/hn/shared_faq.png", alt: "Frequently asked questions" },
    { src: "/sales-images/hn/shared_finalcta.png", alt: "Get certified now", isCta: true },
];

const CHECKOUT_URL = "https://sarah.accredipro.academy/checkout-hn-certification";

export default function HNCourseCertificationPage() {
    const [showFloatingCta, setShowFloatingCta] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [showOptin, setShowOptin] = useState(true);
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setShowFloatingCta(window.scrollY > 200);
        };

        window.addEventListener("scroll", handleScroll);

        const savedName = localStorage.getItem("chatUserName");
        if (savedName) {
            setUserName(savedName);
            setShowOptin(false);
            setMessages([{
                role: "bot",
                content: `Hey ${savedName}! 👋 Welcome back! I'm Sarah, your nutrition coach guide. Ask me anything about the Holistic Nutrition certification!`
            }]);
        }

        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const startChat = () => {
        if (!userName.trim()) return;

        localStorage.setItem("chatUserName", userName);
        if (userEmail) localStorage.setItem("chatUserEmail", userEmail);

        fetch("/api/chat/optin", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                visitorId: localStorage.getItem("chatVisitorId") || `visitor_${Math.random().toString(36).substr(2, 9)}`,
                name: userName,
                email: userEmail || null,
                page: "hn-course-certification"
            })
        }).catch(() => { });

        setShowOptin(false);
        setMessages([{
            role: "bot",
            content: `Hey ${userName}! 👋 So nice to meet you! I'm Sarah, your guide to becoming a Certified Holistic Nutrition Coach. Ask me anything about the certification!`
        }]);
    };

    const sendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage = inputValue;
        setInputValue("");
        setMessages(prev => [...prev, { role: "user", content: userMessage }]);
        setIsTyping(true);

        try {
            const res = await fetch("/api/chat/sales", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    page: "hn-course-certification",
                    visitorId: localStorage.getItem("chatVisitorId"),
                    userName,
                    userEmail
                })
            });
            const data = await res.json();
            setMessages(prev => [...prev, { role: "bot", content: data.reply || "Thanks for your question! The Holistic Nutrition Coach certification gives you professional credentials, personal mentorship, and lifetime access for just $97 today. What else would you like to know?" }]);
        } catch {
            setMessages(prev => [...prev, { role: "bot", content: "Thanks for reaching out! The Holistic Nutrition certification teaches you evidence-based nutrition coaching using our V.I.T.A.L.™ method. You'll get professional certification, daily mentorship with me, and lifetime access to our community. Today's special is just $97! What questions can I answer?" }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            <head>
                <title>Certified Holistic Nutrition Coach | AccrediPro Academy</title>
                <meta
                    name="description"
                    content="Become a Certified Holistic Nutrition Coach. Evidence-based training using the V.I.T.A.L. Method. Get certified in 4-8 weeks. $97 today."
                />
            </head>

            {/* Sticky Promo Banner */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#722F37] to-[#8B3A42] shadow-lg">
                <div className="max-w-[1080px] mx-auto px-4 py-2.5 flex items-center justify-between text-white">
                    <div className="flex items-center gap-2 text-sm">
                        <span>🥗</span>
                        <span className="font-bold">SPECIAL OFFER: 80% OFF</span>
                        <span className="hidden sm:inline">— Limited Time!</span>
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
                                <button
                                    onClick={() => { setShowOptin(false); setUserName("Friend"); setMessages([{ role: "bot", content: "Hey there! 👋 I'm Sarah. Ask me anything about the Holistic Nutrition certification!" }]); }}
                                    className="w-full text-center text-xs text-gray-400 mt-2 hover:text-gray-600"
                                >
                                    Skip, just let me ask a question
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
