"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    ArrowRight, Copy, Check, Play, Clock, Loader2, Mail, Lock, Sparkles, LogIn, GraduationCap
} from "lucide-react";
import { PIXEL_CONFIG } from "@/components/tracking/meta-pixel";
import { useMetaTracking } from "@/hooks/useMetaTracking";
import MetaPixel from "@/components/tracking/meta-pixel";

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
        <div className="min-h-screen bg-gray-50">
            {/* Functional Medicine Niche Pixel */}
            <MetaPixel pixelId={PIXEL_CONFIG.FUNCTIONAL_MEDICINE} />

            {/* ===== HEADER - School Quality ===== */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/accredipro-logo.png"
                                alt="AccrediPro"
                                width={140}
                                height={35}
                                className="h-8 w-auto"
                            />
                        </Link>

                        {/* Login Button */}
                        <Link href="/login">
                            <Button className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-semibold rounded-xl shadow-sm">
                                <LogIn className="w-4 h-4 mr-2" />
                                Login to Dashboard
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            {/* ===== MAIN CONTENT ===== */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">

                {/* Success Banner */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-4 mb-8 flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <p className="font-bold text-green-800">Registration Complete!</p>
                        <p className="text-sm text-green-700">Your Functional Medicine Mini Diploma is ready</p>
                    </div>
                </div>

                {/* Two Column Layout on Desktop */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">

                    {/* LEFT COLUMN - Video + Welcome */}
                    <div className="space-y-6">
                        {/* Sarah Welcome Video */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/30">
                                        <Image
                                            src="/coaches/sarah-coach.webp"
                                            alt="Sarah"
                                            width={48}
                                            height={48}
                                            className="object-cover w-full h-full"
                                        />
                                    </div>
                                    <div>
                                        <h2 className="text-white font-bold text-lg">Welcome Message from Sarah</h2>
                                        <p className="text-white/80 text-sm">Your personal coach has a message for you</p>
                                    </div>
                                </div>
                            </div>

                            {/* Vimeo Video Embed */}
                            <div className="aspect-video bg-gray-900">
                                <iframe
                                    src="https://player.vimeo.com/video/1117011197?badge=0&autopause=0&player_id=0&app_id=58479"
                                    frameBorder="0"
                                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
                                    style={{ width: "100%", height: "100%" }}
                                    title="Welcome from Sarah"
                                />
                            </div>
                        </div>

                        {/* What's Inside Section */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                            <div className="flex items-center gap-2 mb-5">
                                <Sparkles className="w-5 h-5 text-gold-500" />
                                <h3 className="text-xl font-bold text-gray-900">
                                    What's Waiting Inside
                                </h3>
                            </div>

                            <div className="space-y-3">
                                {[
                                    { num: "1", title: "Welcome from Sarah", desc: "Your personal coaching intro" },
                                    { num: "2", title: "9 Interactive Lessons", desc: "~60 minutes total learning" },
                                    { num: "3", title: "Your Certificate", desc: "Unlocks after completion" },
                                ].map((item) => (
                                    <div key={item.num} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                                            {item.num}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">{item.title}</p>
                                            <p className="text-sm text-gray-500">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN - Login Details */}
                    <div className="space-y-6">
                        {/* Welcome Header */}
                        <div className="text-center lg:text-left">
                            <div className="inline-block mb-4">
                                <div className="flex items-center gap-3 bg-burgundy-50 rounded-full px-4 py-2 border border-burgundy-100">
                                    <GraduationCap className="w-5 h-5 text-burgundy-600" />
                                    <span className="text-sm font-semibold text-burgundy-700">Functional Medicine Mini Diploma</span>
                                </div>
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                                You're In, {firstName}! 🎉
                            </h1>
                            <p className="text-gray-600">
                                Save your login details below to access your lessons
                            </p>
                        </div>

                        {/* Login Credentials Card */}
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                            {/* Card Header */}
                            <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 px-6 py-4">
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
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-burgundy-100 rounded-full flex items-center justify-center">
                                                <Mail className="w-5 h-5 text-burgundy-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Email</p>
                                                <p className="text-gray-900 font-semibold text-lg truncate max-w-[180px] sm:max-w-none">
                                                    {userEmail}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => userData?.email && copyToClipboard(userData.email, "email")}
                                            className="border-burgundy-200 hover:bg-burgundy-50 text-burgundy-700"
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
                                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gold-100 rounded-full flex items-center justify-center">
                                                <Lock className="w-5 h-5 text-gold-600" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Password</p>
                                                <p className="text-gray-900 font-mono font-bold text-xl tracking-wider">
                                                    {password}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => copyToClipboard(password, "password")}
                                            className="border-gold-200 hover:bg-gold-50 text-gold-700"
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
                                <Link href="/login" className="block">
                                    <Button
                                        size="lg"
                                        className="w-full h-14 bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all group"
                                    >
                                        <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                                        Start Lesson 1 with Sarah
                                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Sarah's Message */}
                        <div className="bg-gradient-to-br from-burgundy-600 to-burgundy-700 rounded-2xl p-6 text-white shadow-lg">
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
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200 py-8 mt-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Image
                        src="/accredipro-logo.png"
                        alt="AccrediPro"
                        width={120}
                        height={30}
                        className="h-6 w-auto mx-auto mb-4 opacity-60"
                    />
                    <p className="text-xs text-gray-400">
                        This site is not a part of the Facebook website or Facebook Inc.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        © {new Date().getFullYear()} AccrediPro Academy. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
}

export default function FunctionalMedicineThankYouPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-burgundy-600 animate-spin" />
            </div>
        }>
            <ThankYouContent />
        </Suspense>
    );
}
