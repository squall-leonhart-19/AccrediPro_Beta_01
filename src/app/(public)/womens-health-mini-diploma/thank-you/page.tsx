"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    ArrowRight, Copy, Check,
    GraduationCap, Lock, Clock, Sparkles,
} from "lucide-react";

export default function WomensHealthThankYouPage() {
    const [copied, setCopied] = useState(false);
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
            setUserData(JSON.parse(storedData));
        }
    }, []);

    const copyPassword = () => {
        navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const firstName = userData?.firstName || "there";

    return (
        <div className="min-h-screen bg-gradient-to-b from-burgundy-50 via-white to-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-center">
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/newlogo.webp"
                                alt="AccrediPro Academy"
                                width={48}
                                height={48}
                                className="rounded-lg"
                            />
                            <div>
                                <span className="font-bold text-lg text-gray-900">AccrediPro</span>
                                <span className="text-burgundy-600 font-medium ml-1">Academy</span>
                            </div>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-lg mx-auto px-4 py-8 md:py-12">
                {/* Success Banner */}
                <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 mb-6 text-center text-white shadow-lg">
                    <div className="w-14 h-14 mx-auto bg-white/20 rounded-full flex items-center justify-center mb-3">
                        <Check className="h-7 w-7" />
                    </div>
                    <h1 className="text-2xl font-bold mb-1">
                        You're In, {firstName}! 🎉
                    </h1>
                    <p className="text-green-100 text-sm">
                        Your Women's Health Mini Diploma is ready
                    </p>
                </div>

                {/* Login Credentials Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden mb-6">
                    <div className="bg-burgundy-600 px-4 py-3">
                        <p className="text-white font-semibold text-center">📧 Your Login Details</p>
                    </div>

                    <div className="p-5">
                        {/* User Details */}
                        {userData && (
                            <div className="bg-burgundy-50 rounded-xl p-4 mb-4 border border-burgundy-100">
                                <p className="text-xs text-burgundy-600 font-medium mb-1">Email</p>
                                <p className="text-gray-900 font-semibold text-sm truncate">{userData.email}</p>
                            </div>
                        )}

                        {/* Password Box */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-5 border border-gray-200">
                            <p className="text-xs text-gray-500 mb-1">Password</p>
                            <div className="flex items-center justify-between gap-3">
                                <p className="text-2xl font-mono font-bold text-gray-900">{password}</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={copyPassword}
                                    className="border-gray-300 hover:bg-gray-100 flex-shrink-0"
                                >
                                    {copied ? (
                                        <Check className="h-4 w-4 mr-1 text-green-600" />
                                    ) : (
                                        <Copy className="h-4 w-4 mr-1" />
                                    )}
                                    {copied ? "Copied!" : "Copy"}
                                </Button>
                            </div>
                        </div>

                        {/* 7-Day Notice */}
                        <div className="bg-amber-50 rounded-xl p-3 mb-5 border border-amber-200 flex items-start gap-3">
                            <Clock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-amber-800 text-sm">7-Day Access</p>
                                <p className="text-xs text-amber-700">
                                    Complete 3 lessons to get your certificate!
                                </p>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <a href="https://learn.accredipro.academy/login" target="_blank" rel="noopener noreferrer">
                            <Button
                                size="lg"
                                className="w-full h-14 bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all"
                            >
                                Start My Mini Diploma Now
                                <ArrowRight className="h-5 w-5 ml-2" />
                            </Button>
                        </a>
                    </div>
                </div>

                {/* What's Waiting */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 mb-6">
                    <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-burgundy-600" />
                        What's Waiting Inside
                    </h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-burgundy-100 text-burgundy-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
                                1
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Welcome Video from Sarah</p>
                                <p className="text-xs text-gray-500">Meet your personal coach</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-burgundy-100 text-burgundy-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
                                2
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">9 Interactive Lessons</p>
                                <p className="text-xs text-gray-500">~60 minutes total</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-burgundy-100 text-burgundy-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
                                3
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">Certificate</p>
                                <p className="text-xs text-gray-500">Unlocks after completion</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Certificate Preview */}
                <div className="text-center">
                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 max-w-xs mx-auto relative">
                        {/* Blurred overlay */}
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] rounded-2xl flex items-center justify-center z-10">
                            <div className="bg-burgundy-600 text-white px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5">
                                <Lock className="h-3 w-3" />
                                Complete to unlock
                            </div>
                        </div>

                        <div className="border-4 border-double border-burgundy-200 rounded-xl p-4">
                            <Image
                                src="/newlogo.webp"
                                alt="AccrediPro"
                                width={36}
                                height={36}
                                className="mx-auto mb-2"
                            />
                            <p className="text-[9px] text-gray-400 uppercase tracking-widest mb-1">Mini Diploma</p>
                            <p className="text-xs font-bold text-burgundy-700 mb-1">Women's Health & Hormones</p>
                            <p className="text-[10px] text-gray-400">
                                {userData ? `${userData.firstName} ${userData.lastName}` : "Your Name Here"}
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-100 py-6 mt-8">
                <div className="max-w-6xl mx-auto px-4 text-center text-xs text-gray-400">
                    <p>This site is not a part of the Facebook website or Facebook Inc. Additionally, this site is NOT endorsed by Facebook in any way. FACEBOOK is a trademark of FACEBOOK, Inc.</p>
                </div>
            </footer>
        </div>
    );
}
