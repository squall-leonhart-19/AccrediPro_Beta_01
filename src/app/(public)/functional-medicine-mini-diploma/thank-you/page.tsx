"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    ArrowRight, Copy, Check, Play, Clock, Loader2, Mail, Lock, Sparkles
} from "lucide-react";
import { PIXEL_CONFIG } from "@/components/tracking/meta-pixel";
import { useMetaTracking } from "@/hooks/useMetaTracking";
import MetaPixel from "@/components/tracking/meta-pixel";

// Google Fonts
const FONTS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;600;700&family=Source+Sans+3:wght@300;400;500;600;700&display=swap');
`;

function ThankYouContent() {
    const { trackPageView, trackLead } = useMetaTracking();
    const [copiedEmail, setCopiedEmail] = useState(false);
    const [copiedPassword, setCopiedPassword] = useState(false);
    const [userData, setUserData] = useState<{
        firstName: string;
        lastName: string;
        email: string;
    } | null>(null);

    const password = "coach2026";

    useEffect(() => {
        // Get user data from sessionStorage (set during optin)
        const storedData = sessionStorage.getItem("miniDiplomaUser");
        if (storedData) {
            try {
                setUserData(JSON.parse(storedData));
            } catch (e) {
                console.error("Failed to parse user data", e);
            }
        }

        // Track PageView for FM Pixel
        trackPageView("Functional Medicine Mini Diploma Thank You");

        // Track Lead event
        trackLead(
            "Functional Medicine Mini Diploma",
            undefined,
            undefined,
            PIXEL_CONFIG.FUNCTIONAL_MEDICINE
        );
    }, [trackPageView, trackLead]);

    const copyToClipboard = (text: string, type: "email" | "password") => {
        navigator.clipboard.writeText(text);
        if (type === "email") {
            setCopiedEmail(true);
            setTimeout(() => setCopiedEmail(false), 2000);
        } else {
            setCopiedPassword(true);
            setTimeout(() => setCopiedPassword(false), 2000);
        }
    };

    const firstName = userData?.firstName || "Friend";
    const userEmail = userData?.email || "your email";

    return (
        <div className="min-h-screen bg-[#FDF8F3]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
            <style dangerouslySetInnerHTML={{ __html: FONTS }} />
            {/* Functional Medicine Niche Pixel */}
            <MetaPixel pixelId={PIXEL_CONFIG.FUNCTIONAL_MEDICINE} />

            {/* Main Content */}
            <main className="max-w-2xl mx-auto px-4 py-8 md:py-12">
                {/* Sarah Welcome Section */}
                <div className="text-center mb-8">
                    {/* Sarah Avatar */}
                    <div className="relative inline-block mb-4">
                        <div className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-[#C4A77D] shadow-lg mx-auto">
                            <Image
                                src="/coaches/sarah-coach.webp"
                                alt="Sarah - Your Coach"
                                width={112}
                                height={112}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-6 h-6 rounded-full border-3 border-white flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                        </div>
                    </div>

                    {/* Welcome Message */}
                    <h1
                        className="text-3xl md:text-4xl font-bold text-[#4A6741] mb-2"
                        style={{ fontFamily: "'Fraunces', serif" }}
                    >
                        You're In, {firstName}! 🎉
                    </h1>
                    <p className="text-lg text-[#6B7280] mb-2">
                        I'm <span className="font-semibold text-[#4A6741]">Sarah</span>, your personal coach
                    </p>
                    <p className="text-[#9CA3AF] text-sm">
                        Your Functional Medicine Mini Diploma is ready to begin
                    </p>
                </div>

                {/* Login Credentials Card */}
                <div className="bg-white rounded-2xl shadow-xl border border-[#E5E1DB] overflow-hidden mb-6">
                    {/* Card Header */}
                    <div className="bg-gradient-to-r from-[#4A6741] to-[#5C7A52] px-6 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <Lock className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h2 className="text-white font-bold text-lg">Your Login Details</h2>
                                <p className="text-white/80 text-sm">Save these to access your lessons</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 space-y-4">
                        {/* Email Field */}
                        <div className="bg-[#F9F7F4] rounded-xl p-4 border border-[#E5E1DB]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#4A6741]/10 rounded-full flex items-center justify-center">
                                        <Mail className="w-5 h-5 text-[#4A6741]" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#9CA3AF] uppercase tracking-wider font-medium">Email</p>
                                        <p className="text-[#1F2937] font-semibold text-lg truncate max-w-[200px] md:max-w-none">
                                            {userEmail}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => userData?.email && copyToClipboard(userData.email, "email")}
                                    className="border-[#4A6741]/30 hover:bg-[#4A6741]/10 text-[#4A6741]"
                                >
                                    {copiedEmail ? (
                                        <><Check className="w-4 h-4 mr-1" /> Copied!</>
                                    ) : (
                                        <><Copy className="w-4 h-4 mr-1" /> Copy</>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* Password Field */}
                        <div className="bg-[#F9F7F4] rounded-xl p-4 border border-[#E5E1DB]">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-[#C4A77D]/20 rounded-full flex items-center justify-center">
                                        <Lock className="w-5 h-5 text-[#C4A77D]" />
                                    </div>
                                    <div>
                                        <p className="text-xs text-[#9CA3AF] uppercase tracking-wider font-medium">Password</p>
                                        <p className="text-[#1F2937] font-mono font-bold text-xl tracking-wider">
                                            {password}
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => copyToClipboard(password, "password")}
                                    className="border-[#C4A77D]/30 hover:bg-[#C4A77D]/10 text-[#C4A77D]"
                                >
                                    {copiedPassword ? (
                                        <><Check className="w-4 h-4 mr-1" /> Copied!</>
                                    ) : (
                                        <><Copy className="w-4 h-4 mr-1" /> Copy</>
                                    )}
                                </Button>
                            </div>
                        </div>

                        {/* 7-Day Access Notice */}
                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 flex items-start gap-3">
                            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-amber-800 text-sm">7-Day Access</p>
                                <p className="text-xs text-amber-700">
                                    Complete all 9 lessons to earn your certificate!
                                </p>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <a href="https://learn.accredipro.academy/login" className="block">
                            <Button
                                size="lg"
                                className="w-full h-14 bg-gradient-to-r from-[#C4A77D] to-[#B8956C] hover:from-[#B8956C] hover:to-[#A8855C] text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all group"
                            >
                                <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                                Start Lesson 1 with Sarah
                                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </a>
                    </div>
                </div>

                {/* What's Inside Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-[#E5E1DB] p-6 mb-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Sparkles className="w-5 h-5 text-[#C4A77D]" />
                        <h3
                            className="text-xl font-bold text-[#4A6741]"
                            style={{ fontFamily: "'Fraunces', serif" }}
                        >
                            What's Waiting Inside
                        </h3>
                    </div>

                    <div className="grid gap-4">
                        {[
                            { num: "1", title: "Welcome from Sarah", desc: "Your personal coaching intro" },
                            { num: "2", title: "9 Interactive Lessons", desc: "~60 minutes total learning" },
                            { num: "3", title: "Your Certificate", desc: "Unlocks after completion" },
                        ].map((item) => (
                            <div key={item.num} className="flex items-center gap-4 p-3 bg-[#F9F7F4] rounded-xl">
                                <div className="w-10 h-10 rounded-full bg-[#4A6741] text-white font-bold flex items-center justify-center text-sm">
                                    {item.num}
                                </div>
                                <div>
                                    <p className="font-semibold text-[#1F2937]">{item.title}</p>
                                    <p className="text-sm text-[#6B7280]">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Sarah's Message */}
                <div className="bg-gradient-to-br from-[#4A6741] to-[#3D5635] rounded-2xl p-6 text-white shadow-lg">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30 flex-shrink-0">
                            <Image
                                src="/coaches/sarah-coach.webp"
                                alt="Sarah"
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                            />
                        </div>
                        <div>
                            <p className="font-semibold mb-2">A quick note from me...</p>
                            <p className="text-white/90 text-sm leading-relaxed">
                                Hey {firstName}! I'm SO excited you're here. I've helped thousands of women
                                understand Functional Medicine, and I can't wait to guide you through this journey.
                                See you inside Lesson 1! 💕
                            </p>
                            <p className="mt-2 text-white/70 text-sm italic">— Sarah</p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-[#F3EFE9] py-6 mt-8">
                <div className="max-w-6xl mx-auto px-4 text-center text-xs text-[#9CA3AF]">
                    <p>This site is not a part of the Facebook website or Facebook Inc.</p>
                    <p className="mt-1">© {new Date().getFullYear()} AccrediPro Academy. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

export default function FunctionalMedicineThankYouPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-[#FDF8F3] flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-[#4A6741] animate-spin" />
            </div>
        }>
            <ThankYouContent />
        </Suspense>
    );
}
