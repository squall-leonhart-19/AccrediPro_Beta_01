"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import {
    CheckCircle2, Mail, MessageCircle, GraduationCap,
    ArrowRight, Clock, Users, Heart, Sparkles,
    BookOpen, Key, Copy, Check, Award, Star,
    Play, Shield
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Meta Pixel ID
const META_PIXEL_ID = "1287915349067829";

// Confetti effect component
const Confetti = () => {
    const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; color: string }>>([]);

    useEffect(() => {
        const colors = ['#722f37', '#d4af37', '#8b9a64', '#fdfaf5'];
        const newParticles = Array.from({ length: 60 }, (_, i) => ({
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

export default function FMCertificationThankYouPage() {
    const [copied, setCopied] = useState(false);
    const [showConfetti, setShowConfetti] = useState(true);

    useEffect(() => {
        // Hide confetti after 6 seconds
        const timer = setTimeout(() => setShowConfetti(false), 6000);
        return () => clearTimeout(timer);
    }, []);

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
            <div className="max-w-4xl mx-auto px-4 py-12 sm:py-16">
                {/* Success Message */}
                <div className="text-center mb-10">
                    <div className="w-24 h-24 rounded-full bg-olive-100 flex items-center justify-center mx-auto mb-6 ring-4 ring-olive-200 ring-offset-4 ring-offset-cream-50">
                        <CheckCircle2 className="h-12 w-12 text-olive-600" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                        Welcome to the Certified Family! 🎓
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Your payment was successful. You're now enrolled in the <span className="font-semibold text-burgundy-700">Complete Functional Medicine Certification</span>.
                    </p>
                    <div className="mt-6 flex items-center justify-center gap-4 text-sm">
                        <div className="flex items-center gap-2 bg-burgundy-50 px-4 py-2 rounded-full">
                            <Award className="h-4 w-4 text-burgundy-600" />
                            <span className="text-burgundy-700 font-medium">21 Modules</span>
                        </div>
                        <div className="flex items-center gap-2 bg-gold-50 px-4 py-2 rounded-full">
                            <GraduationCap className="h-4 w-4 text-gold-600" />
                            <span className="text-gold-700 font-medium">20 Certificates</span>
                        </div>
                        <div className="flex items-center gap-2 bg-olive-50 px-4 py-2 rounded-full">
                            <Shield className="h-4 w-4 text-olive-600" />
                            <span className="text-olive-700 font-medium">9 Accreditations</span>
                        </div>
                    </div>
                </div>

                {/* What Happens Next Card */}
                <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 px-6 py-5">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Sparkles className="h-5 w-5 text-gold-400" />
                            Your Certification Journey Starts Now
                        </h2>
                    </div>

                    <div className="p-6 sm:p-8 space-y-8">
                        {/* Step 1: Check Email */}
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-burgundy-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                                1
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                    <Mail className="h-5 w-5 text-burgundy-600" />
                                    Check Your Email
                                </h3>
                                <p className="text-slate-600 mt-1">
                                    We've sent your <strong>login credentials</strong> to your email. Check your inbox (and spam folder, just in case!).
                                </p>
                                <div className="mt-3 p-4 bg-cream-50 rounded-xl border border-cream-200">
                                    <p className="text-sm text-slate-500 mb-2">Your login portal:</p>
                                    <div className="flex items-center gap-2">
                                        <code className="text-burgundy-700 font-semibold bg-white px-4 py-2 rounded-lg border border-slate-200 flex-1 text-sm">
                                            learn.accredipro.academy/login
                                        </code>
                                        <button
                                            onClick={() => copyToClipboard('https://learn.accredipro.academy/login')}
                                            className="p-2.5 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 bg-white"
                                        >
                                            {copied ? (
                                                <Check className="h-4 w-4 text-olive-600" />
                                            ) : (
                                                <Copy className="h-4 w-4 text-slate-500" />
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-400 mt-2">Password: Futurecoach2025 (change after first login)</p>
                                </div>
                            </div>
                        </div>

                        {/* Step 2: Personal Message from Sarah */}
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-burgundy-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                                2
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                    <MessageCircle className="h-5 w-5 text-burgundy-600" />
                                    Expect a Personal Welcome from Me
                                </h3>
                                <p className="text-slate-600 mt-1">
                                    Within the next <strong>24 hours</strong>, I'll personally reach out to welcome you, answer any questions, and make sure you're set up for success.
                                </p>
                                <div className="mt-3 flex items-center gap-4 p-4 bg-burgundy-50 rounded-xl border border-burgundy-100">
                                    <Image
                                        src="/coaches/sarah-coach.webp"
                                        alt="Sarah Mitchell"
                                        width={64}
                                        height={64}
                                        className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-md"
                                    />
                                    <div>
                                        <p className="font-semibold text-burgundy-800">Sarah Mitchell</p>
                                        <p className="text-sm text-burgundy-600">Your Personal Coach & Mentor</p>
                                        <div className="flex gap-1 mt-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className="h-3 w-3 fill-gold-400 text-gold-400" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 3: Start Module 0 */}
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-burgundy-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                                3
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                    <Play className="h-5 w-5 text-burgundy-600" />
                                    Start with Module 0: Orientation
                                </h3>
                                <p className="text-slate-600 mt-1">
                                    Log in and begin with Module 0 to get oriented. It's designed to set you up for success and show you exactly how to navigate your certification journey.
                                </p>
                                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div className="flex flex-col items-center gap-1 text-center p-3 bg-slate-50 rounded-lg">
                                        <BookOpen className="h-5 w-5 text-burgundy-500" />
                                        <span className="text-xs text-slate-600">21 Modules</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 text-center p-3 bg-slate-50 rounded-lg">
                                        <Clock className="h-5 w-5 text-burgundy-500" />
                                        <span className="text-xs text-slate-600">80+ Hours</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 text-center p-3 bg-slate-50 rounded-lg">
                                        <GraduationCap className="h-5 w-5 text-burgundy-500" />
                                        <span className="text-xs text-slate-600">20 Certificates</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 text-center p-3 bg-slate-50 rounded-lg">
                                        <Users className="h-5 w-5 text-burgundy-500" />
                                        <span className="text-xs text-slate-600">Community</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Step 4: Join Community */}
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-burgundy-600 text-white flex items-center justify-center font-bold text-lg shrink-0">
                                4
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                                    <Users className="h-5 w-5 text-burgundy-600" />
                                    Join Our Private Community
                                </h3>
                                <p className="text-slate-600 mt-1">
                                    Inside the portal, you'll find access to our <strong>2,000+ member community</strong> of practitioners. Introduce yourself, connect with others on the same journey, and get support anytime.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Login CTA */}
                <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 rounded-2xl p-6 sm:p-8 text-center text-white mb-8 shadow-xl">
                    <h3 className="text-2xl font-bold mb-2">Ready to Transform Your Career?</h3>
                    <p className="text-burgundy-100 mb-6 max-w-lg mx-auto">
                        Your complete Functional Medicine Certification awaits. Log in now to begin Module 0.
                    </p>
                    <a href="https://learn.accredipro.academy/login">
                        <Button className="bg-gold-400 hover:bg-gold-500 text-slate-900 font-bold py-6 px-12 rounded-xl text-lg shadow-lg">
                            <Key className="h-5 w-5 mr-2" />
                            Go to Your Dashboard
                            <ArrowRight className="h-5 w-5 ml-2" />
                        </Button>
                    </a>
                </div>

                {/* What You'll Achieve */}
                <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm mb-8">
                    <h3 className="font-bold text-slate-900 mb-4 text-lg flex items-center gap-2">
                        <Award className="h-5 w-5 text-gold-500" />
                        What You'll Achieve
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-olive-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-slate-800">Complete FM Certification</p>
                                <p className="text-sm text-slate-500">21 comprehensive modules</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-olive-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-slate-800">20 Specialty Certificates</p>
                                <p className="text-sm text-slate-500">One for each module completed</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-olive-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-slate-800">9 International Accreditations</p>
                                <p className="text-sm text-slate-500">CMA, IPHM, CPD & more</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="h-5 w-5 text-olive-500 shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-slate-800">Practice-Ready Skills</p>
                                <p className="text-sm text-slate-500">Start seeing clients with confidence</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Note from Sarah */}
                <div className="bg-cream-50 rounded-2xl p-6 border border-cream-200">
                    <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <Heart className="h-5 w-5 text-burgundy-600" />
                        A Personal Note from Sarah
                    </h3>
                    <div className="flex gap-4 sm:gap-6">
                        <Image
                            src="/coaches/sarah-coach.webp"
                            alt="Sarah"
                            width={80}
                            height={80}
                            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg shrink-0"
                        />
                        <div className="text-slate-600 italic">
                            <p className="mb-2">
                                "I am SO excited you're here. This certification changed my life, and I've seen it change thousands of others.
                            </p>
                            <p className="mb-2">
                                You're not just getting a certification—you're joining a <strong className="text-slate-800 not-italic">movement</strong> of practitioners who are changing healthcare from the inside out.
                            </p>
                            <p className="mb-2">
                                I'll be with you every step of the way. See you inside!"
                            </p>
                            <p className="mt-4 font-semibold text-burgundy-700 not-italic">— Sarah Mitchell, Founder</p>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-12 text-slate-500 text-sm">
                    <p>Questions? Email us at <a href="mailto:sarah@coach-accredipro.academy" className="text-burgundy-600 hover:underline">sarah@coach-accredipro.academy</a></p>
                    <p className="mt-2">© 2025 AccrediPro Academy. All rights reserved.</p>
                </div>
            </div>

            {/* Meta Pixel Code */}
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
