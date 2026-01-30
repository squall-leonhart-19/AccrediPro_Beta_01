"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    MessageCircle, Award, TrendingUp, ArrowRight, CheckCircle2,
    Shield, Gift, Sparkles, GraduationCap, DollarSign, Timer,
    Copy, Check, Users, BookOpen, Briefcase, Target, Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";

const SARAH_AVATAR = "/coaches/sarah-coach.webp";

interface CareerRoadmapClientProps {
    firstName: string;
    examScore?: number;
    scholarshipQualified?: boolean;
    couponCode?: string;
    couponExpiresAt?: string;
    portalSlug: string;
    checkoutUrl: string;
    diplomaName: string;
}

// Next Steps for graduates
const NEXT_STEPS = [
    {
        step: 1,
        title: "Learn About Your Scholarship",
        description: "See what you've unlocked and how to claim your $2,000+ in savings",
        icon: Gift,
        link: "scholarship",
        linkText: "View My Scholarship",
        color: "emerald"
    },
    {
        step: 2,
        title: "Chat with Coach Sarah",
        description: "Get personalized guidance on your certification journey",
        icon: MessageCircle,
        link: "chat",
        linkText: "Start Chat",
        color: "burgundy"
    },
    {
        step: 3,
        title: "Explore Your Career Path",
        description: "See income potential and success stories from graduates like you",
        icon: TrendingUp,
        link: "scholarship#case-studies",
        linkText: "See Success Stories",
        color: "gold"
    },
];

// What's included in full certification
const CERTIFICATION_BENEFITS = [
    { icon: BookOpen, title: "36 Advanced Modules", subtitle: "Foundational → Master Level" },
    { icon: Users, title: "1:1 Mentorship with Sarah", subtitle: "Personal guidance" },
    { icon: Briefcase, title: "Business Box", subtitle: "2,000+ done-for-you templates" },
    { icon: Shield, title: "$10K/mo Income Guarantee", subtitle: "Or we work free" },
];

export function CareerRoadmapClient({
    firstName,
    examScore,
    scholarshipQualified = false,
    couponCode,
    couponExpiresAt,
    portalSlug,
    checkoutUrl,
    diplomaName,
}: CareerRoadmapClientProps) {
    const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
    const [copied, setCopied] = useState(false);
    const [isExpired, setIsExpired] = useState(false);

    // Countdown timer
    const calculateTimeLeft = useCallback(() => {
        if (!couponExpiresAt) return { hours: 24, minutes: 0, seconds: 0 };

        const expiresAt = new Date(couponExpiresAt).getTime();
        const now = Date.now();
        const diff = expiresAt - now;

        if (diff <= 0) {
            setIsExpired(true);
            return { hours: 0, minutes: 0, seconds: 0 };
        }

        return {
            hours: Math.floor(diff / (1000 * 60 * 60)),
            minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((diff % (1000 * 60)) / 1000),
        };
    }, [couponExpiresAt]);

    useEffect(() => {
        setTimeLeft(calculateTimeLeft());
        const interval = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
        return () => clearInterval(interval);
    }, [calculateTimeLeft]);

    const handleCopyCoupon = () => {
        if (couponCode) {
            navigator.clipboard.writeText(couponCode);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const finalCheckoutUrl = couponCode && !isExpired
        ? `${checkoutUrl}?coupon=${couponCode}`
        : checkoutUrl;

    return (
        <div className="min-h-screen bg-gradient-to-b from-burgundy-50 via-white to-amber-50">

            {/* ============================================ */}
            {/* HERO - Congratulations Header */}
            {/* ============================================ */}
            <section className="bg-burgundy-700 text-white py-10 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                        <Image
                            src={SARAH_AVATAR}
                            alt="Coach Sarah"
                            width={100}
                            height={100}
                            className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-[#d4af37] shadow-xl"
                        />
                        <div>
                            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                                <GraduationCap className="w-6 h-6 text-[#d4af37]" />
                                <span className="text-[#d4af37] font-semibold text-sm uppercase tracking-wider">
                                    Mini Diploma Complete
                                </span>
                            </div>
                            <h1 className="text-2xl md:text-3xl font-bold mb-2">
                                Congratulations, {firstName}! 🎉
                            </h1>
                            <p className="text-burgundy-200 text-sm md:text-base">
                                You passed with <strong className="text-white">{examScore || 85}%</strong> —
                                you're in the <span className="text-[#d4af37] font-semibold">top 5%</span> of all exam takers!
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Gold ribbon */}
            <div className="h-1.5 bg-gradient-to-r from-[#d4af37] via-[#f0d78c] to-[#d4af37]" />

            {/* ============================================ */}
            {/* NEXT STEPS SECTION */}
            {/* ============================================ */}
            <section className="py-10 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            Your Next Steps
                        </h2>
                        <p className="text-gray-600">
                            Here's what to do now that you've completed your mini diploma
                        </p>
                    </div>

                    <div className="grid gap-4 md:gap-6">
                        {NEXT_STEPS.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                            >
                                <Link href={`/portal/${portalSlug}/${step.link}`}>
                                    <div className="bg-white rounded-2xl p-5 md:p-6 shadow-lg border-2 border-gray-100 hover:border-burgundy-300 hover:shadow-xl transition-all cursor-pointer group">
                                        <div className="flex items-start gap-4">
                                            {/* Step number */}
                                            <div className="w-12 h-12 bg-burgundy-700 text-white rounded-full flex items-center justify-center font-bold text-lg flex-shrink-0">
                                                {step.step}
                                            </div>

                                            {/* Content */}
                                            <div className="flex-1">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-burgundy-700 transition-colors">
                                                            {step.title}
                                                        </h3>
                                                        <p className="text-gray-600 text-sm">
                                                            {step.description}
                                                        </p>
                                                    </div>
                                                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-burgundy-600 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
                                                </div>

                                                <div className="mt-3">
                                                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-burgundy-600 group-hover:text-burgundy-700">
                                                        {step.linkText}
                                                        <ArrowRight className="w-4 h-4" />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================ */}
            {/* SCHOLARSHIP CARD (if qualified) */}
            {/* ============================================ */}
            {scholarshipQualified && couponCode && !isExpired && (
                <section className="py-8 px-4">
                    <div className="max-w-2xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-[#d4af37]"
                        >
                            {/* Gold header */}
                            <div className="bg-gradient-to-r from-[#d4af37] via-[#f0d78c] to-[#d4af37] p-4 text-center">
                                <div className="flex items-center justify-center gap-2 text-burgundy-900 font-bold">
                                    <Sparkles className="w-5 h-5" />
                                    <span>🎓 SCHOLARSHIP UNLOCKED</span>
                                    <Sparkles className="w-5 h-5" />
                                </div>
                            </div>

                            <div className="p-6 md:p-8">
                                {/* Savings */}
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full font-bold text-xl mb-2">
                                        <DollarSign className="w-5 h-5" />
                                        $2,000 OFF
                                    </div>
                                    <p className="text-gray-600 text-sm">
                                        Full Board Certification — {diplomaName}
                                    </p>
                                </div>

                                {/* Countdown */}
                                <div className="bg-burgundy-50 rounded-xl p-4 mb-6">
                                    <div className="flex items-center justify-center gap-2 text-burgundy-600 mb-3">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-xs font-bold uppercase tracking-wider">
                                            Scholarship Expires In
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                        {[
                                            { value: timeLeft.hours, label: "HRS" },
                                            { value: timeLeft.minutes, label: "MIN" },
                                            { value: timeLeft.seconds, label: "SEC" },
                                        ].map((unit, idx) => (
                                            <div key={idx} className="text-center">
                                                <div className="bg-burgundy-700 text-white text-xl font-bold px-3 py-2 rounded-lg min-w-[50px]">
                                                    {String(unit.value).padStart(2, "0")}
                                                </div>
                                                <span className="text-[10px] text-burgundy-500 mt-1">{unit.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Coupon */}
                                <div className="text-center mb-6">
                                    <p className="text-xs text-gray-500 mb-2">Your scholarship code:</p>
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

                                {/* CTA */}
                                <a href={finalCheckoutUrl} target="_blank" rel="noopener noreferrer">
                                    <Button
                                        size="lg"
                                        className="w-full h-14 bg-burgundy-700 hover:bg-burgundy-800 text-white font-bold text-lg rounded-xl"
                                    >
                                        <Award className="w-5 h-5 mr-2" />
                                        Claim My $2,000 Scholarship
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </a>
                            </div>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* ============================================ */}
            {/* WHAT'S INCLUDED IN FULL CERTIFICATION */}
            {/* ============================================ */}
            <section className="py-10 px-4 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-8">
                        <span className="inline-flex items-center gap-2 bg-burgundy-100 text-burgundy-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                            <Award className="w-4 h-4" />
                            Full Board Certification
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                            What You're Now Eligible For
                        </h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {CERTIFICATION_BENEFITS.map((benefit, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                viewport={{ once: true }}
                                className="bg-burgundy-50 rounded-xl p-4 text-center"
                            >
                                <div className="w-12 h-12 bg-burgundy-700 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <benefit.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-semibold text-gray-900 text-sm mb-1">
                                    {benefit.title}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {benefit.subtitle}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================ */}
            {/* QUESTIONS CTA */}
            {/* ============================================ */}
            <section className="py-8 px-4">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-burgundy-700 rounded-2xl p-6 text-center text-white">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <Image
                                src={SARAH_AVATAR}
                                alt="Sarah"
                                width={50}
                                height={50}
                                className="w-12 h-12 rounded-full border-2 border-[#d4af37]"
                            />
                            <div className="text-left">
                                <p className="font-semibold">Have Questions?</p>
                                <p className="text-burgundy-200 text-sm">Chat with Sarah anytime</p>
                            </div>
                        </div>
                        <Link href={`/portal/${portalSlug}/chat`}>
                            <Button className="bg-white text-burgundy-700 hover:bg-burgundy-50 font-semibold px-8">
                                <MessageCircle className="w-4 h-4 mr-2" />
                                Chat with Sarah
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Bottom padding */}
            <div className="h-8" />
        </div>
    );
}
