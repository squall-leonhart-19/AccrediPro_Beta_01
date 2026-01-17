"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    Award,
    CheckCircle2,
    Clock,
    Gift,
    Shield,
    Users,
    BookOpen,
    Briefcase,
    Star,
    ArrowRight,
    Timer,
    Sparkles,
    GraduationCap,
    Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CompleteClientProps {
    firstName: string;
    diplomaName: string;
    examScore?: number;
    scholarshipQualified?: boolean;
    couponCode?: string;
    couponExpiresAt?: string;
    spotsRemaining?: number;
    skipped?: boolean;
}

const CHECKOUT_URL = "https://www.fanbasis.com/agency-checkout/AccrediPro/wmoqw";

// Countdown timer component
function CountdownTimer({ expiresAt }: { expiresAt: string }) {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [expired, setExpired] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const expiry = new Date(expiresAt).getTime();
            const difference = expiry - now;

            if (difference <= 0) {
                setExpired(true);
                return { hours: 0, minutes: 0, seconds: 0 };
            }

            const hours = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            return { hours, minutes, seconds };
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [expiresAt]);

    if (expired) {
        return (
            <div className="text-red-600 font-semibold">
                Scholarship coupon has expired
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center gap-3">
            <div className="flex flex-col items-center">
                <div className="bg-burgundy-700 text-white text-2xl font-bold w-14 h-14 rounded-lg flex items-center justify-center">
                    {String(timeLeft.hours).padStart(2, "0")}
                </div>
                <span className="text-xs text-gray-500 mt-1">HOURS</span>
            </div>
            <span className="text-2xl font-bold text-burgundy-600">:</span>
            <div className="flex flex-col items-center">
                <div className="bg-burgundy-700 text-white text-2xl font-bold w-14 h-14 rounded-lg flex items-center justify-center">
                    {String(timeLeft.minutes).padStart(2, "0")}
                </div>
                <span className="text-xs text-gray-500 mt-1">MINUTES</span>
            </div>
            <span className="text-2xl font-bold text-burgundy-600">:</span>
            <div className="flex flex-col items-center">
                <div className="bg-burgundy-700 text-white text-2xl font-bold w-14 h-14 rounded-lg flex items-center justify-center">
                    {String(timeLeft.seconds).padStart(2, "0")}
                </div>
                <span className="text-xs text-gray-500 mt-1">SECONDS</span>
            </div>
        </div>
    );
}

export function CompleteClient({
    firstName,
    diplomaName,
    examScore = 0,
    scholarshipQualified = false,
    couponCode,
    couponExpiresAt,
    spotsRemaining = 3,
    skipped = false,
}: CompleteClientProps) {
    // Build checkout URL with coupon if available
    const checkoutUrl = couponCode
        ? `${CHECKOUT_URL}?coupon=${couponCode}`
        : CHECKOUT_URL;

    // Scholarship qualified view
    if (scholarshipQualified && couponCode && couponExpiresAt) {
        return (
            <div
                className="min-h-screen"
                style={{
                    fontFamily: '"IBM Plex Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
                    background: 'linear-gradient(135deg, #FFFAF7 0%, #FFF5F0 100%)',
                    color: '#1F2432',
                    lineHeight: 1.6,
                    WebkitFontSmoothing: 'antialiased',
                }}
            >
                <main className="max-w-[720px] mx-auto p-4 py-8">
                    {/* Hero - Scholarship Qualified */}
                    <section
                        className="bg-white border-2 border-gold-400 rounded-2xl shadow-2xl overflow-hidden"
                        style={{ boxShadow: '0 12px 40px rgba(212,175,55,0.2)' }}
                    >
                        {/* Gold Banner */}
                        <div className="bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2 text-white font-bold text-lg">
                                <Award className="w-6 h-6" />
                                ASI GRADUATE SCHOLARSHIP QUALIFIED
                                <Award className="w-6 h-6" />
                            </div>
                        </div>

                        <div className="p-6 md:p-8">
                            {/* Score Badge */}
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gold-100 to-gold-200 border-4 border-gold-400 mb-4">
                                    <span className="text-3xl font-black text-gold-700">{examScore}%</span>
                                </div>
                                <h1 className="text-2xl md:text-3xl font-extrabold text-burgundy-800 mb-2">
                                    Congratulations {firstName}!
                                </h1>
                                <p className="text-lg text-gray-700">
                                    You scored in the <span className="font-bold text-gold-600">top 5%</span> of all exam takers!
                                </p>
                            </div>

                            {/* Countdown */}
                            <div className="bg-gradient-to-r from-burgundy-50 to-rose-50 rounded-xl p-5 mb-6 border border-burgundy-100">
                                <div className="text-center mb-4">
                                    <div className="flex items-center justify-center gap-2 text-burgundy-700 font-semibold mb-2">
                                        <Timer className="w-5 h-5" />
                                        Your $297 Scholarship Expires In:
                                    </div>
                                    <CountdownTimer expiresAt={couponExpiresAt} />
                                </div>
                                <p className="text-center text-sm text-burgundy-600">
                                    Only <span className="font-bold">{spotsRemaining}</span> scholarship spot{spotsRemaining !== 1 ? "s" : ""} remaining this month
                                </p>
                            </div>

                            {/* Value Stack */}
                            <div className="space-y-4 mb-6">
                                <h2 className="text-xl font-bold text-burgundy-800 text-center">
                                    Everything Included For Just $297:
                                </h2>

                                {/* Certifications */}
                                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-4 border border-purple-100">
                                    <div className="flex items-start gap-3">
                                        <GraduationCap className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-bold text-purple-800">THE CERTIFICATIONS ($8,291 value)</h3>
                                            <ul className="text-sm text-purple-700 mt-1 space-y-1">
                                                <li>- Foundation Certificate (your first credential)</li>
                                                <li>- Professional Certificate ($100+/hour level)</li>
                                                <li>- Board Certification ($200/hr practitioner level)</li>
                                                <li>- 9 International Accreditations (CMA, IPHM, CPD, IAOTH + 5 more)</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Training */}
                                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                                    <div className="flex items-start gap-3">
                                        <BookOpen className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-bold text-blue-800">THE TRAINING ($4,494 value)</h3>
                                            <ul className="text-sm text-blue-700 mt-1 space-y-1">
                                                <li>- 150-Hour DEPTH Method Clinical Training</li>
                                                <li>- Functional Lab Interpretation Intensive</li>
                                                <li>- Client Consultation Blueprint</li>
                                                <li>- 50+ Complex Case Masterclasses</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Support */}
                                <div className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 border border-emerald-100">
                                    <div className="flex items-start gap-3">
                                        <Users className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-bold text-emerald-800">THE SUPPORT ($4,894 value)</h3>
                                            <ul className="text-sm text-emerald-700 mt-1 space-y-1">
                                                <li>- 52 Weeks of Group Mentorship (weekly LIVE calls)</li>
                                                <li>- Weekly Accountability Pod (your 5-person squad)</li>
                                                <li>- Private Practitioner Community (1,247+ coaches)</li>
                                                <li>- "Stuck? Text Sarah" Direct Access</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Practice-Building */}
                                <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 border border-orange-100">
                                    <div className="flex items-start gap-3">
                                        <Briefcase className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-bold text-orange-800">THE PRACTICE-BUILDING ($3,985 value)</h3>
                                            <ul className="text-sm text-orange-700 mt-1 space-y-1">
                                                <li>- Done-For-You Practice Website (LIVE in 48 hours)</li>
                                                <li>- 500+ Clinical Templates</li>
                                                <li>- Lifetime Directory Listing</li>
                                                <li>- "First 5 Clients" Attraction System</li>
                                                <li>- Legal & Scope of Practice Kit</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Bonuses */}
                                <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-xl p-4 border border-pink-100">
                                    <div className="flex items-start gap-3">
                                        <Gift className="w-6 h-6 text-pink-600 flex-shrink-0 mt-1" />
                                        <div>
                                            <h3 className="font-bold text-pink-800">THE BONUSES ($2,991 value)</h3>
                                            <ul className="text-sm text-pink-700 mt-1 space-y-1">
                                                <li>- Professional Brand Photo Session</li>
                                                <li>- 90-Day Social Content Calendar</li>
                                                <li>- Email Sequence Templates</li>
                                                <li>- "Clients From Scratch" Workshop</li>
                                                <li>- Lab Partner Discounts + Certificate Frames</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Price Box */}
                            <div className="bg-gradient-to-br from-burgundy-700 to-burgundy-900 rounded-2xl p-6 text-white text-center mb-6">
                                <div className="text-sm opacity-80 mb-1">Total Value</div>
                                <div className="text-3xl font-bold line-through opacity-60">$24,655</div>
                                <div className="text-sm opacity-80 mt-3 mb-1">Your Scholarship Price</div>
                                <div className="text-5xl font-black text-gold-400">$297</div>
                                <div className="bg-gold-500 text-burgundy-900 font-bold text-sm px-4 py-1 rounded-full inline-block mt-3">
                                    You Save $24,358 (99% OFF)
                                </div>
                            </div>

                            {/* CTA */}
                            <a
                                href={checkoutUrl}
                                className="block w-full bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 hover:from-gold-600 hover:via-gold-500 hover:to-gold-600 text-burgundy-900 font-bold text-lg py-4 px-6 rounded-xl text-center transition-all shadow-lg hover:shadow-xl"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    <Sparkles className="w-5 h-5" />
                                    Claim Your Scholarship Now
                                    <ArrowRight className="w-5 h-5" />
                                </span>
                            </a>

                            {/* Trust Badges */}
                            <div className="flex items-center justify-center gap-4 mt-4 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <Shield className="w-4 h-4" />
                                    Secure Checkout
                                </span>
                                <span className="flex items-center gap-1">
                                    <Heart className="w-4 h-4" />
                                    HSA/FSA Accepted
                                </span>
                            </div>

                            {/* Guarantee */}
                            <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                                <div className="flex items-start gap-3">
                                    <Shield className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-emerald-800">30-Day Money Back Guarantee</h4>
                                        <p className="text-sm text-emerald-700">
                                            If you don't feel the program is right for you within 30 days, just let us know and we'll refund your investment. No questions asked.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        );
    }

    // Non-scholarship view (passed but score < 95 or skipped)
    return (
        <div
            className="min-h-screen"
            style={{
                fontFamily: '"IBM Plex Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
                background: '#FFFAF7',
                color: '#1F2432',
                lineHeight: 1.6,
                WebkitFontSmoothing: 'antialiased',
            }}
        >
            <main className="max-w-[680px] mx-auto p-4 py-8">
                <section
                    className="bg-white border border-[#ECE8E2] rounded-xl shadow-lg overflow-hidden"
                    style={{ boxShadow: '0 8px 24px rgba(0,0,0,.06)' }}
                >
                    {/* Hero */}
                    <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 px-6 py-8 text-center text-white">
                        <GraduationCap className="w-16 h-16 mx-auto mb-4 text-gold-400" />
                        <h1 className="text-2xl md:text-3xl font-extrabold mb-2">
                            Congratulations {firstName}!
                        </h1>
                        <p className="text-burgundy-100">
                            You've completed your {diplomaName} Mini Diploma!
                        </p>
                        {!skipped && examScore > 0 && (
                            <div className="mt-4 inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                                <Star className="w-5 h-5 text-gold-400" />
                                <span>Exam Score: {examScore}%</span>
                            </div>
                        )}
                    </div>

                    <div className="p-6">
                        {/* Certificate Ready */}
                        <div className="bg-gradient-to-r from-gold-50 to-amber-50 rounded-xl p-5 mb-6 border-2 border-gold-200">
                            <h2 className="text-lg font-bold text-gold-800 mb-2 flex items-center gap-2">
                                <Award className="w-5 h-5" />
                                Your Certificate is Ready!
                            </h2>
                            <p className="text-gold-700 text-sm mb-4">
                                Your {diplomaName} Mini Diploma certificate has been generated. Check your email or download it from your dashboard.
                            </p>
                            <Link
                                href="/dashboard/certificates"
                                className="inline-flex items-center gap-2 bg-gold-600 hover:bg-gold-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                View Certificate
                            </Link>
                        </div>

                        {/* Upgrade CTA */}
                        <div className="bg-gradient-to-br from-burgundy-50 to-rose-50 rounded-xl p-5 border border-burgundy-100">
                            <h2 className="text-lg font-bold text-burgundy-800 mb-3">
                                Ready to Go Further?
                            </h2>
                            <p className="text-burgundy-700 text-sm mb-4">
                                Continue your journey with full Board Certification. Get lifetime access to all training, mentorship, and business-building tools.
                            </p>

                            <ul className="space-y-2 mb-4">
                                {[
                                    "3 Certification Levels (Foundation → Professional → Board)",
                                    "150+ Hours of Clinical Training",
                                    "52 Weeks of Live Mentorship",
                                    "Done-For-You Practice Website",
                                    "1,247+ Practitioner Community",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-burgundy-700">
                                        <CheckCircle2 className="w-4 h-4 text-burgundy-500 flex-shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <a
                                href={CHECKOUT_URL}
                                className="block w-full bg-burgundy-600 hover:bg-burgundy-700 text-white font-bold py-3 px-6 rounded-xl text-center transition-colors"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    Learn More About Full Certification
                                    <ArrowRight className="w-5 h-5" />
                                </span>
                            </a>

                            {!skipped && examScore > 0 && examScore < 95 && (
                                <p className="text-center text-xs text-burgundy-500 mt-3">
                                    Score 95% or higher on the exam to qualify for the $297 Graduate Scholarship
                                </p>
                            )}
                        </div>

                        {/* Back to Dashboard */}
                        <div className="mt-6 text-center">
                            <Link
                                href="/functional-medicine-diploma"
                                className="text-burgundy-600 hover:text-burgundy-700 font-medium text-sm underline"
                            >
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
