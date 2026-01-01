"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    ArrowRight, Copy, Check,
    GraduationCap, Lock, Clock,
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
            <main className="max-w-2xl mx-auto px-4 py-12 md:py-16">
                {/* Sarah Welcome Message */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
                    <div className="p-6 md:p-8">
                        {/* Sarah's Avatar & Message */}
                        <div className="flex gap-4">
                            <div className="flex-shrink-0">
                                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-burgundy-400 to-burgundy-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                                    S
                                </div>
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="font-bold text-gray-900">Sarah</span>
                                    <span className="text-xs bg-burgundy-100 text-burgundy-700 px-2 py-0.5 rounded-full">Your Coach</span>
                                </div>
                                <div className="bg-burgundy-50 rounded-2xl rounded-tl-none p-4 border border-burgundy-100">
                                    <p className="text-gray-700 leading-relaxed">
                                        Hey {firstName}! I'm so excited you're here! I'll be your personal guide through the Women's Health Mini Diploma.
                                    </p>
                                    <p className="text-gray-700 leading-relaxed mt-3">
                                        I've helped hundreds of women understand their hormones, and I can't wait to share everything with you. See you inside!
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Voice Note Preview - Non-clickable */}
                        <div className="mt-4 ml-18 pl-[72px]">
                            <div className="bg-gray-100 rounded-xl p-3 border border-gray-200 inline-flex items-center gap-3 opacity-60">
                                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                                    <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-gray-500 border-b-[5px] border-b-transparent ml-0.5" />
                                </div>
                                <div className="flex gap-0.5">
                                    {[3, 5, 8, 4, 7, 9, 5, 6, 8, 4, 6, 3].map((h, i) => (
                                        <div
                                            key={i}
                                            className="w-1 bg-gray-400 rounded-full"
                                            style={{ height: `${h * 2}px` }}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-gray-500 italic">Voice messages unlock inside...</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Access Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-center">
                        <p className="text-white font-semibold flex items-center justify-center gap-2">
                            <Check className="h-5 w-5" />
                            You're all set! Here's your login details...
                        </p>
                    </div>

                    <div className="p-6 md:p-8">
                        {/* User Details */}
                        {userData && (
                            <div className="bg-burgundy-50 rounded-xl p-4 mb-5 border border-burgundy-100">
                                <p className="text-sm text-burgundy-600 font-medium mb-1">Your account</p>
                                <p className="text-lg font-bold text-gray-900">
                                    {userData.firstName} {userData.lastName}
                                </p>
                                <p className="text-gray-600">{userData.email}</p>
                            </div>
                        )}

                        {/* Password Box */}
                        <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-200">
                            <p className="text-sm text-gray-500 mb-2">Your password</p>
                            <div className="flex items-center justify-between">
                                <p className="text-3xl font-mono font-bold text-gray-900 tracking-wider">{password}</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={copyPassword}
                                    className="border-gray-300 hover:bg-gray-100"
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
                        <div className="bg-amber-50 rounded-xl p-4 mb-6 border border-amber-200 flex items-start gap-3">
                            <Clock className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-amber-800">You have 7 days</p>
                                <p className="text-sm text-amber-700">
                                    Complete all 9 lessons to unlock your certificate before access expires!
                                </p>
                            </div>
                        </div>

                        {/* CTA Button */}
                        <a href="https://learn.accredipro.academy/login" target="_blank" rel="noopener noreferrer">
                            <Button
                                size="lg"
                                className="w-full h-14 bg-burgundy-600 hover:bg-burgundy-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                            >
                                Go to Login Portal
                                <ArrowRight className="h-5 w-5 ml-2" />
                            </Button>
                        </a>

                        <p className="text-center text-sm text-gray-400 mt-4">
                            ~60 minutes to complete • Certificate included
                        </p>
                    </div>
                </div>

                {/* Certificate Preview */}
                <div className="mt-10 text-center">
                    <div className="inline-flex items-center gap-2 bg-burgundy-100 text-burgundy-800 px-4 py-2 rounded-full text-sm font-medium mb-5">
                        <GraduationCap className="h-4 w-4" />
                        Your certificate is waiting...
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 max-w-sm mx-auto relative">
                        {/* Blurred overlay */}
                        <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] rounded-2xl flex items-center justify-center z-10">
                            <div className="bg-burgundy-600 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                Complete 9 lessons to unlock
                            </div>
                        </div>

                        <div className="border-4 border-double border-burgundy-200 rounded-xl p-5">
                            <Image
                                src="/newlogo.webp"
                                alt="AccrediPro"
                                width={40}
                                height={40}
                                className="mx-auto mb-2"
                            />
                            <p className="text-[10px] text-gray-400 uppercase tracking-widest mb-1">Mini Diploma</p>
                            <p className="text-sm font-bold text-burgundy-700 mb-1">Women's Health & Hormones</p>
                            <p className="text-xs text-gray-400">
                                {userData ? `${userData.firstName} ${userData.lastName}` : "Your Name Here"}
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-100 py-6 mt-12">
                <div className="max-w-6xl mx-auto px-4 text-center text-xs text-gray-400">
                    <p>This site is not a part of the Facebook website or Facebook Inc. Additionally, this site is NOT endorsed by Facebook in any way. FACEBOOK is a trademark of FACEBOOK, Inc.</p>
                </div>
            </footer>
        </div>
    );
}
