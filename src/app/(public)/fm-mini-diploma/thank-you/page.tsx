"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import {
    CheckCircle2, Mail, MessageCircle, GraduationCap,
    ArrowRight, Clock, Users, Heart, Sparkles,
    BookOpen, Lock, Key, Copy, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Meta Pixel ID for ROYAL CERTIFIED
const META_PIXEL_ID = "1287915349067829";

// Confetti effect component
const Confetti = () => {
    const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([]);

    useEffect(() => {
        const colors = ['#722f37', '#d4af37', '#8b9a64', '#fdfaf5'];
        const newParticles = Array.from({ length: 50 }, (_, i) => ({
            id: i,
            left: Math.random() * 100,
            delay: Math.random() * 3,
            color: colors[Math.floor(Math.random() * colors.length)]
        }));
        setParticles(newParticles);
    }, []);

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
            {particles.map((particle) => (
                <div
                    key={particle.id}
                    className="absolute w-3 h-3 animate-confetti"
                    style={{
                        left: `${particle.left}%`,
                        animationDelay: `${particle.delay}s`,
                        backgroundColor: particle.color,
                        borderRadius: Math.random() > 0.5 ? '50%' : '0'
                    }}
                />
            ))}
        </div>
    );
};

export default function ThankYouPage() {
    const [copied, setCopied] = useState(false);
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        // Hide confetti after 5 seconds
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    // NOTE: Purchase event is fired server-side via CAPI webhook (more reliable)
    // Browser pixel only tracks PageView for attribution

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-cream-100 via-cream-50 to-white">
            {/* Confetti Animation */}
            {showConfetti && <Confetti />}

            {/* Custom CSS for confetti */}
            <style jsx global>{`
                @keyframes confetti-fall {
                    0% {
                        transform: translateY(-100vh) rotate(0deg);
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) rotate(720deg);
                        opacity: 0;
                    }
                }
                .animate-confetti {
                    animation: confetti-fall 4s ease-in-out forwards;
                }
            `}</style>

            {/* Header */}
            <div className="bg-gradient-to-r from-burgundy-700 to-burgundy-800 text-white py-4 px-4">
                <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
                    <GraduationCap className="h-6 w-6 text-gold-400" />
                    <span className="font-semibold">AccrediPro Academy</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
                {/* Success Message */}
                <div className="text-center mb-10">
                    <div className="w-20 h-20 rounded-full bg-olive-100 flex items-center justify-center mx-auto mb-6 ring-4 ring-olive-200">
                        <CheckCircle2 className="h-10 w-10 text-olive-600" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                        Welcome to the Family! 🎉
                    </h1>
                    <p className="text-xl text-slate-600 max-w-xl mx-auto">
                        Your payment was successful. You're officially enrolled in the <span className="font-semibold text-burgundy-700">Functional Medicine Mini Diploma</span>.
                    </p>
                </div>

                {/* What Happens Next Card */}
                <div className="bg-white rounded-3xl shadow-lg border border-slate-100 overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 px-6 py-4">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-gold-400" />
                            What Happens Next
                        </h2>
                    </div>

                    <div className="p-6 sm:p-8 space-y-6">
                        {/* Step 1: Check Email */}
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-burgundy-600 text-white flex items-center justify-center font-bold shrink-0">
                                1
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                    <Mail className="h-5 w-5 text-burgundy-600" />
                                    Check Your Email
                                </h3>
                                <p className="text-slate-600 mt-1">
                                    We've sent your <strong>login credentials</strong> to your email. Check your inbox (and spam folder, just in case!).
                                </p>
                                <div className="mt-3 p-3 bg-cream-50 rounded-xl border border-cream-200">
                                    <p className="text-sm text-slate-500 mb-1">Your login portal:</p>
                                    <div className="flex items-center gap-2">
                                        <code className="text-burgundy-700 font-semibold bg-white px-3 py-1.5 rounded border border-slate-200 flex-1">
                                            learn.accredipro.academy/login
                                        </code>
                                        <button
                                            onClick={() => copyToClipboard('https://learn.accredipro.academy/login')}
                                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                        >
                                            {copied ? (
                                                <Check className="h-4 w-4 text-olive-600" />
                                            ) : (
                                                <Copy className="h-4 w-4 text-slate-400" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Private Message */}
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-burgundy-600 text-white flex items-center justify-center font-bold shrink-0">
                                2
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                    <MessageCircle className="h-5 w-5 text-burgundy-600" />
                                    Expect a Private Message from Me
                                </h3>
                                <p className="text-slate-600 mt-1">
                                    Within the next <strong>24 hours</strong>, I'll personally reach out to you inside the portal. I want to welcome you, answer any questions, and make sure you're set up for success.
                                </p>
                                <div className="mt-3 flex items-center gap-3 p-3 bg-burgundy-50 rounded-xl border border-burgundy-100">
                                    <Image
                                        src="/coaches/sarah-coach.webp"
                                        alt="Sarah Mitchell"
                                        width={48}
                                        height={48}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                                    />
                                    <div>
                                        <p className="font-semibold text-burgundy-800">Sarah Mitchell</p>
                                        <p className="text-sm text-burgundy-600">Your Personal Coach</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 3: Start Learning */}
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-burgundy-600 text-white flex items-center justify-center font-bold shrink-0">
                                3
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-burgundy-600" />
                                    Start Your Training
                                </h3>
                                <p className="text-slate-600 mt-1">
                                    Log in and dive into <strong>Module 1</strong>. The training is conversational and interactive — we'll learn together, not just watch videos.
                                </p>
                                <div className="mt-3 grid grid-cols-2 gap-3">
                                    <div className="flex items-center gap-2 text-sm text-slate-600 bg-olive-50 p-2 rounded-lg">
                                        <Clock className="h-4 w-4 text-olive-600" />
                                        <span>90 minutes total</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-slate-600 bg-olive-50 p-2 rounded-lg">
                                        <GraduationCap className="h-4 w-4 text-olive-600" />
                                        <span>Certificate included</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 4: Join Community */}
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-burgundy-600 text-white flex items-center justify-center font-bold shrink-0">
                                4
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                    <Users className="h-5 w-5 text-burgundy-600" />
                                    Join Our Private Community
                                </h3>
                                <p className="text-slate-600 mt-1">
                                    Inside the portal, you'll find access to our <strong>1,400+ member community</strong>. Introduce yourself, connect with others on the same journey, and get support anytime.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Login CTA */}
                <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 rounded-2xl p-6 sm:p-8 text-center text-white mb-8">
                    <h3 className="text-xl font-bold mb-2">Ready to Start?</h3>
                    <p className="text-burgundy-100 mb-6">
                        Check your email for login credentials, then click below to access your training.
                    </p>
                    <a href="https://learn.accredipro.academy/login">
                        <Button className="bg-gold-400 hover:bg-gold-500 text-slate-900 font-bold py-6 px-10 rounded-xl text-lg shadow-lg">
                            <Key className="h-5 w-5 mr-2" />
                            Go to Login Portal
                            <ArrowRight className="h-5 w-5 ml-2" />
                        </Button>
                    </a>
                </div>

                {/* Quick Reminder Card */}
                <div className="bg-cream-50 rounded-2xl p-6 border border-cream-200">
                    <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <Heart className="h-5 w-5 text-burgundy-600" />
                        A Quick Note from Sarah
                    </h3>
                    <div className="flex gap-4">
                        <Image
                            src="/coaches/sarah-coach.webp"
                            alt="Sarah"
                            width={64}
                            height={64}
                            className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md shrink-0"
                        />
                        <div className="text-slate-600 italic">
                            <p className="mb-2">
                                "I'm so excited you're here. This Mini Diploma changed my life, and I know it can change yours too.
                            </p>
                            <p className="mb-2">
                                Don't just watch the modules — <strong className="text-slate-800 not-italic">really engage</strong>. Ask questions. Reach out to me. That's what I'm here for.
                            </p>
                            <p>
                                See you inside! 💜"
                            </p>
                            <p className="mt-3 font-semibold text-burgundy-700 not-italic">— Sarah</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-12 text-slate-500 text-sm">
                    <p>Questions? Email us at <a href="mailto:sarah@accredipro.academy" className="text-burgundy-600 hover:underline">sarah@accredipro.academy</a></p>
                    <p className="mt-2">© 2025 AccrediPro Academy. All rights reserved.</p>
                </div>
            </div>

            {/* Meta Pixel Code - ROYAL CERTIFIED with Advanced Matching */}
            <Script
                id="meta-pixel"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
                        !function(f,b,e,v,n,t,s)
                        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                        n.queue=[];t=b.createElement(e);t.async=!0;
                        t.src=v;s=b.getElementsByTagName(e)[0];
                        s.parentNode.insertBefore(t,s)}(window, document,'script',
                        'https://connect.facebook.net/en_US/fbevents.js');
                        fbq('init', '${META_PIXEL_ID}');
                        fbq('track', 'PageView');
                    `
                }}
            />
            <noscript>
                <img
                    height="1"
                    width="1"
                    style={{ display: 'none' }}
                    src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
                    alt=""
                />
            </noscript>
        </div>
    );
}
