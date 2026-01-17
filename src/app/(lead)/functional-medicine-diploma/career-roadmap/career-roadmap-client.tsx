"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
    MessageCircle,
    Award,
    TrendingUp,
    ArrowRight,
    CheckCircle,
    Shield,
    Gift,
    Clock,
    Star,
    Sparkles,
    GraduationCap,
    DollarSign,
    Users,
    Target,
    Zap,
    Timer,
    Copy,
    Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Checkout URL for FM certification
const CHECKOUT_URL = "https://buy.stripe.com/eVa8yz5IZ6hP6VacMT";

interface CareerRoadmapClientProps {
    firstName: string;
    examScore?: number;
    scholarshipQualified?: boolean;
    couponCode?: string;
    couponExpiresAt?: string;
}

export function CareerRoadmapClient({
    firstName,
    examScore,
    scholarshipQualified = false,
    couponCode,
    couponExpiresAt,
}: CareerRoadmapClientProps) {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [copied, setCopied] = useState(false);
    const [isExpired, setIsExpired] = useState(false);

    // Countdown timer
    const calculateTimeLeft = useCallback(() => {
        if (!couponExpiresAt) return { hours: 0, minutes: 0, seconds: 0 };

        const expiresAt = new Date(couponExpiresAt).getTime();
        const now = Date.now();
        const diff = expiresAt - now;

        if (diff <= 0) {
            setIsExpired(true);
            return { hours: 0, minutes: 0, seconds: 0 };
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        return { hours, minutes, seconds };
    }, [couponExpiresAt]);

    useEffect(() => {
        if (!couponExpiresAt) return;

        setTimeLeft(calculateTimeLeft());
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(interval);
    }, [couponExpiresAt, calculateTimeLeft]);

    const handleCopyCoupon = () => {
        if (couponCode) {
            navigator.clipboard.writeText(couponCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    // Build checkout URL with coupon if available
    const checkoutUrl = couponCode && !isExpired
        ? `${CHECKOUT_URL}?coupon=${couponCode}`
        : CHECKOUT_URL;

    // If scholarship qualified, show the scholarship offer
    if (scholarshipQualified && couponCode && !isExpired) {
        return (
            <div
                className="min-h-screen flex items-center justify-center p-4"
                style={{
                    fontFamily: '"IBM Plex Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
                    background: 'linear-gradient(135deg, #FFFAF7 0%, #FFF5F0 100%)',
                }}
            >
                <div className="max-w-lg w-full">
                    <div
                        className="bg-white rounded-2xl shadow-xl overflow-hidden"
                        style={{ boxShadow: '0 12px 40px rgba(0,0,0,.08)' }}
                    >
                        {/* Scholarship Badge */}
                        <div className="bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 p-4 text-center">
                            <div className="flex items-center justify-center gap-2 text-burgundy-900 font-bold text-sm">
                                <GraduationCap className="w-5 h-5" />
                                <span>SCHOLARSHIP AWARDED</span>
                                <GraduationCap className="w-5 h-5" />
                            </div>
                            <p className="text-burgundy-800 text-xs mt-1">
                                You scored {examScore}/100 and qualified!
                            </p>
                        </div>

                        <div className="p-6 md:p-8 text-center">
                            {/* Celebration Icon */}
                            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-gold-100 to-gold-200 rounded-full flex items-center justify-center mb-5 shadow-lg">
                                <Gift className="w-10 h-10 text-gold-600" />
                            </div>

                            {/* Heading */}
                            <h1 className="text-2xl md:text-[28px] font-extrabold text-burgundy-700 mb-2">
                                Congratulations, {firstName}!
                            </h1>
                            <p className="text-gray-600 mb-5">
                                You&apos;ve earned our exclusive <strong className="text-gold-600">ASI Graduate Scholarship</strong>
                            </p>

                            {/* Savings Box */}
                            <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl p-5 mb-5 border-2 border-emerald-200">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <DollarSign className="w-6 h-6 text-emerald-600" />
                                    <span className="text-3xl font-extrabold text-emerald-700">$2,000 OFF</span>
                                </div>
                                <p className="text-emerald-700 text-sm">
                                    Full BC-FMP™ Board Certification Program
                                </p>
                            </div>

                            {/* Countdown Timer */}
                            <div className="bg-burgundy-50 rounded-xl p-4 mb-5">
                                <div className="flex items-center justify-center gap-2 text-burgundy-600 mb-2">
                                    <Timer className="w-4 h-4" />
                                    <span className="text-xs font-bold uppercase tracking-wider">Scholarship Expires In</span>
                                </div>
                                <div className="flex items-center justify-center gap-3">
                                    <div className="bg-burgundy-700 text-white rounded-lg px-4 py-2 min-w-[60px]">
                                        <div className="text-2xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</div>
                                        <div className="text-[10px] uppercase tracking-wider opacity-80">Hours</div>
                                    </div>
                                    <span className="text-burgundy-400 text-2xl font-bold">:</span>
                                    <div className="bg-burgundy-700 text-white rounded-lg px-4 py-2 min-w-[60px]">
                                        <div className="text-2xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</div>
                                        <div className="text-[10px] uppercase tracking-wider opacity-80">Mins</div>
                                    </div>
                                    <span className="text-burgundy-400 text-2xl font-bold">:</span>
                                    <div className="bg-burgundy-700 text-white rounded-lg px-4 py-2 min-w-[60px]">
                                        <div className="text-2xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</div>
                                        <div className="text-[10px] uppercase tracking-wider opacity-80">Secs</div>
                                    </div>
                                </div>
                            </div>

                            {/* Coupon Code */}
                            <div className="mb-5">
                                <p className="text-xs text-gray-500 mb-2">Your exclusive scholarship code:</p>
                                <div className="flex items-center justify-center gap-2">
                                    <code className="bg-gray-100 px-4 py-2 rounded-lg font-mono font-bold text-lg text-burgundy-700 border-2 border-dashed border-burgundy-300">
                                        {couponCode}
                                    </code>
                                    <button
                                        onClick={handleCopyCoupon}
                                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
                                    >
                                        {copied ? (
                                            <Check className="w-5 h-5 text-emerald-600" />
                                        ) : (
                                            <Copy className="w-5 h-5 text-gray-600" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* What You Get */}
                            <div className="bg-burgundy-50 rounded-xl p-4 mb-5 text-left">
                                <p className="text-xs font-bold text-burgundy-700 uppercase tracking-wider mb-3 text-center">
                                    What&apos;s included in BC-FMP™:
                                </p>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                        <span className="text-sm text-gray-700">Board Certification (BC-FMP™)</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                        <span className="text-sm text-gray-700">$10K/mo Income Guarantee</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                        <span className="text-sm text-gray-700">1-on-1 Mentorship with Coach Sarah</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                        <span className="text-sm text-gray-700">Client Acquisition System</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                        <span className="text-sm text-gray-700">Lifetime Community Access</span>
                                    </div>
                                </div>
                            </div>

                            {/* CTA Button */}
                            <a href={checkoutUrl} target="_blank" rel="noopener noreferrer">
                                <Button
                                    size="lg"
                                    className="w-full h-14 bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-700 text-burgundy-900 font-bold text-lg rounded-xl shadow-lg"
                                >
                                    <Sparkles className="w-5 h-5 mr-2" />
                                    Claim My $2,000 Scholarship
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </a>

                            <p className="text-xs text-gray-400 mt-4">
                                Questions? <Link href="/functional-medicine-diploma/messages" className="text-burgundy-600 underline">Message Coach Sarah</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Default view - for non-scholarship or expired users
    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{
                fontFamily: '"IBM Plex Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
                background: 'linear-gradient(135deg, #FFFAF7 0%, #FFF5F0 100%)',
            }}
        >
            <div className="max-w-md w-full">
                <div
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                    style={{ boxShadow: '0 12px 40px rgba(0,0,0,.08)' }}
                >
                    {/* Eligibility Badge */}
                    <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 p-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-gold-400 font-bold text-sm">
                            <CheckCircle className="w-4 h-4" />
                            <span>YOU&apos;RE NOW ELIGIBLE</span>
                        </div>
                        <p className="text-burgundy-200 text-xs mt-1">
                            Mini Diploma graduates qualify for the full career path
                        </p>
                    </div>

                    <div className="p-6 md:p-8 text-center">
                        {/* Icon */}
                        <div className="w-16 h-16 mx-auto bg-gold-100 rounded-full flex items-center justify-center mb-5">
                            <TrendingUp className="w-8 h-8 text-gold-600" />
                        </div>

                        {/* Heading */}
                        <h1 className="text-2xl md:text-[28px] font-extrabold text-burgundy-700 mb-3">
                            Ready for $10-15K+/Month?
                        </h1>

                        {/* Subhead */}
                        <p className="text-gray-600 mb-5">
                            {firstName}, as a Mini Diploma graduate, you now qualify for the <strong className="text-burgundy-600">ASI Board Certified</strong> practitioner path.
                        </p>

                        {/* What you qualify for */}
                        <div className="bg-burgundy-50 rounded-xl p-4 mb-5 text-left">
                            <p className="text-xs font-bold text-burgundy-700 uppercase tracking-wider mb-3">
                                What you&apos;re now eligible for:
                            </p>
                            <div className="space-y-2.5">
                                <div className="flex items-start gap-3">
                                    <Award className="w-5 h-5 text-burgundy-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">Board Certification (BC-FMP™)</p>
                                        <p className="text-xs text-gray-500">Highest ASI credential</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Shield className="w-5 h-5 text-burgundy-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">Income Guarantee</p>
                                        <p className="text-xs text-gray-500">$10K/mo or we work free until you do</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <MessageCircle className="w-5 h-5 text-burgundy-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">Chat with Coach Sarah</p>
                                        <p className="text-xs text-gray-500">Get your personalized career plan</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <Link href="/functional-medicine-diploma/messages">
                            <Button
                                size="lg"
                                className="w-full h-14 bg-burgundy-600 hover:bg-burgundy-700 text-white font-bold text-lg rounded-xl"
                            >
                                <MessageCircle className="w-5 h-5 mr-2" />
                                Chat with Sarah
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>

                        <p className="text-xs text-gray-400 mt-4">
                            She&apos;ll create your personalized plan
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
