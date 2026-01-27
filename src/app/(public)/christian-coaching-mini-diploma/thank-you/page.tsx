"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";

const BRAND = {
    navy: "#1e3a5f",
    navyDark: "#0f2034",
    gold: "#d4a574",
    goldMetallic: "linear-gradient(135deg, #d4a574 0%, #e8c9a8 25%, #d4a574 50%, #b8864a 75%, #d4a574 100%)",
};

export default function ChristianCoachingThankYouPage() {
    return (
        <div className="min-h-screen flex items-center justify-center py-16 px-4" style={{ backgroundColor: BRAND.navyDark }}>
            <div className="max-w-lg text-center">
                {/* Success Icon */}
                <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: `${BRAND.gold}20` }}>
                    <CheckCircle2 className="w-10 h-10" style={{ color: BRAND.gold }} />
                </div>

                <h1 className="text-3xl md:text-4xl font-black text-white mb-4">
                    You're In! 🎉
                </h1>

                <p className="text-white/70 text-lg mb-8">
                    Check your email for login details. Your Christian Life Coaching journey starts now.
                </p>

                <div className="bg-white/10 rounded-2xl p-6 mb-8 text-left">
                    <h3 className="text-white font-bold mb-3">What's Next:</h3>
                    <ul className="space-y-3 text-white/80">
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: BRAND.gold }} />
                            <span>Check your inbox for login credentials</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: BRAND.gold }} />
                            <span>Complete all 9 lessons (takes ~1 hour)</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: BRAND.gold }} />
                            <span>Get your certificate immediately after</span>
                        </li>
                    </ul>
                </div>

                <Link href="/login">
                    <Button
                        className="h-14 px-8 text-lg font-bold"
                        style={{ background: BRAND.goldMetallic, color: BRAND.navyDark }}
                    >
                        Go to Login
                        <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </Link>

                <p className="text-white/50 text-sm mt-6">
                    Didn't receive the email? Check spam or <Link href="/support" className="underline">contact support</Link>.
                </p>
            </div>
        </div>
    );
}
