"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Award, CheckCircle2, ArrowRight,
    GraduationCap, Users, Star, Clock,
    BookOpen, MessageCircle, Loader2, Shield,
    Globe, ChevronDown, ChevronUp, Zap, ArrowDown,
    DollarSign, Heart, Sparkles, X
} from "lucide-react";
import { PIXEL_CONFIG } from "@/components/tracking/meta-pixel";
import { useMetaTracking } from "@/hooks/useMetaTracking";
import MetaPixel from "@/components/tracking/meta-pixel";
import { FloatingChatWidget } from "@/components/lead-portal/floating-chat-widget";
import { MultiStepQualificationForm, QualificationData } from "@/components/lead-portal/multi-step-qualification-form";

// Same default password as backend
const LEAD_PASSWORD = "coach2026";

function FunctionalMedicineMiniDiplomaContent() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const { trackViewContent, trackLead } = useMetaTracking();

    // Track ViewContent on mount
    useEffect(() => {
        trackViewContent(
            "Functional Medicine Mini Diploma",
            "fm-mini-diploma",
            PIXEL_CONFIG.FUNCTIONAL_MEDICINE
        );
    }, [trackViewContent]);

    const handleSubmit = async (formData: QualificationData) => {
        setIsVerifying(true);

        try {
            // Step 1: Verify email with NeverBounce
            const verifyRes = await fetch("/api/verify-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email })
            });
            const verifyData = await verifyRes.json();

            if (!verifyData.valid) {
                alert(verifyData.message || "Please enter a valid email address.");
                setIsVerifying(false);
                return;
            }

            // Step 2: Submit to mini-diploma optin
            setIsVerifying(false);
            setIsSubmitting(true);

            const response = await fetch("/api/mini-diploma/optin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    lifeStage: formData.lifeStage,
                    motivation: formData.motivation,
                    investment: formData.investment,
                    course: "functional-medicine",
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            // Track Lead (Server-Side via CAPI)
            trackLead(
                "Functional Medicine Mini Diploma",
                formData.email,
                formData.firstName,
                PIXEL_CONFIG.FUNCTIONAL_MEDICINE
            );

            // Store user data for thank you page
            sessionStorage.setItem("miniDiplomaUser", JSON.stringify({
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.toLowerCase().trim(),
            }));

            // Auto-login
            const result = await signIn("credentials", {
                email: formData.email.toLowerCase(),
                password: LEAD_PASSWORD,
                redirect: false,
                callbackUrl: "/functional-medicine-mini-diploma/thank-you",
            });

            // Redirect to thank you page
            window.location.href = "/functional-medicine-mini-diploma/thank-you";

        } catch (err: any) {
            alert(err.message || "Failed to register. Please try again.");
            setIsSubmitting(false);
            setIsVerifying(false);
        }
    };

    const scrollToForm = () => {
        document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Functional Medicine Niche Pixel */}
            <MetaPixel pixelId={PIXEL_CONFIG.FUNCTIONAL_MEDICINE} />

            {/* URGENCY BAR - Hormozi style */}
            <div className="bg-red-600 text-white py-2 px-4 text-center">
                <p className="text-sm md:text-base font-bold">
                    ⚡ FREE FOR THE NEXT 24 HOURS ⚡ (Normally $97) — 847 women claimed access this week
                </p>
            </div>

            {/* HERO SECTION - Direct Response Style */}
            <section className="bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white pt-8 pb-16 md:pt-12 md:pb-24 relative overflow-hidden">
                {/* Background glow */}
                <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/20 rounded-full blur-[120px]" />

                <div className="relative max-w-6xl mx-auto px-4">
                    <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 items-start">
                        {/* Left Column - Copy */}
                        <div>
                            {/* Problem Agitation Hook */}
                            <p className="text-emerald-400 font-bold text-sm md:text-base mb-4 uppercase tracking-wide">
                                For Women Ready To Leave Their 9-5 Behind
                            </p>

                            {/* Main Headline */}
                            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black leading-[1.1] mb-6">
                                Get Certified In<br />
                                <span className="text-emerald-400">Functional Medicine</span><br />
                                In 60 Minutes<br />
                                <span className="text-slate-400 text-2xl md:text-3xl">(For Free)</span>
                            </h1>

                            {/* Subheadline - Paint the dream */}
                            <p className="text-lg md:text-xl text-slate-300 mb-8 max-w-lg leading-relaxed">
                                …And discover how 4,000+ women are earning <strong className="text-white">$3,000-$8,000/month</strong> helping clients heal — without a medical degree, office rent, or years of schooling.
                            </p>

                            {/* Proof Points */}
                            <div className="flex flex-wrap gap-4 md:gap-6 mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <Award className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">9 Lessons</p>
                                        <p className="text-xs text-slate-400">Complete in 1 hour</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <GraduationCap className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">Certificate</p>
                                        <p className="text-xs text-slate-400">ASI Verified</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                        <Users className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">Coach Support</p>
                                        <p className="text-xs text-slate-400">Sarah guides you</p>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile CTA */}
                            <Button
                                onClick={scrollToForm}
                                className="lg:hidden w-full h-14 text-lg font-bold bg-emerald-500 hover:bg-emerald-600 text-white mb-6"
                            >
                                Claim Free Access Now
                                <ArrowDown className="ml-2 w-5 h-5" />
                            </Button>
                        </div>

                        {/* Right Column - Form */}
                        <div id="lead-form" className="relative z-10">
                            <MultiStepQualificationForm
                                onSubmit={handleSubmit}
                                isSubmitting={isSubmitting}
                                isVerifying={isVerifying}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* INCOME PROOF - Hormozi Stack */}
            <section className="py-16 md:py-20 bg-slate-50">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="text-emerald-600 font-bold text-sm uppercase tracking-wide mb-3">Real Results From Real Women</p>
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900">
                            They Started Where You Are.<br />
                            <span className="text-emerald-600">Now They Earn $3K-$8K/Month.</span>
                        </h2>
                    </div>

                    {/* Income Stories */}
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { name: "Jennifer M.", income: "$4,200/mo", before: "Exhausted nurse", story: "I was done with 12-hour shifts. Now I coach 8 clients from home." },
                            { name: "Patricia L.", income: "$6,800/mo", before: "Corporate burnout", story: "Left my desk job at 47. Best decision I ever made." },
                            { name: "Michelle R.", income: "$3,100/mo", before: "Stay-at-home mom", story: "Started while kids napped. Now it's my full-time income." }
                        ].map((story, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <span className="text-emerald-700 font-bold text-lg">{story.name[0]}</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{story.name}</p>
                                        <p className="text-xs text-slate-500">{story.before}</p>
                                    </div>
                                </div>
                                <p className="text-slate-600 text-sm mb-4 italic">"{story.story}"</p>
                                <div className="bg-emerald-50 rounded-xl px-4 py-3 text-center">
                                    <p className="text-2xl font-black text-emerald-600">{story.income}</p>
                                    <p className="text-xs text-emerald-700">Monthly Income</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* THIS IS FOR YOU - Qualification Section */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                            This Is For You If…
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* FOR YOU */}
                        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
                            <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" /> Perfect For You If:
                            </h3>
                            <ul className="space-y-3 text-slate-700">
                                {[
                                    "You're tired of trading time for money",
                                    "You've always wanted to help people heal",
                                    "You want flexibility around family",
                                    "You're ready for purpose-driven work",
                                    "You can invest 60 minutes today"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* NOT FOR YOU */}
                        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                            <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2">
                                <X className="w-5 h-5" /> Not For You If:
                            </h3>
                            <ul className="space-y-3 text-slate-600">
                                {[
                                    "You expect overnight results without effort",
                                    "You're not willing to learn something new",
                                    "You're happy in your current career",
                                    "You prefer someone else to do the work"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <X className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHAT YOU'LL LEARN */}
            <section className="py-16 md:py-20 bg-slate-900 text-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="text-emerald-400 font-bold text-sm uppercase mb-3">Inside Your Free Mini-Diploma</p>
                        <h2 className="text-3xl md:text-4xl font-black">
                            9 Lessons That Could Change<br />
                            <span className="text-emerald-400">Your Entire Career Path</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            { num: 1, title: "Root Cause Medicine", desc: "Why symptoms are just the tip" },
                            { num: 2, title: "The Gut Foundation", desc: "Where 80% of healing begins" },
                            { num: 3, title: "Inflammation Connection", desc: "The hidden driver of disease" },
                            { num: 4, title: "The Toxin Burden", desc: "Modern detox protocols" },
                            { num: 5, title: "Stress & HPA Axis", desc: "Hormonal stress response" },
                            { num: 6, title: "Nutrient Deficiencies", desc: "Testing and correction" },
                            { num: 7, title: "Lab Interpretation", desc: "Reading functional labs" },
                            { num: 8, title: "Building Protocols", desc: "Client healing plans" },
                            { num: 9, title: "Your Next Step", desc: "Career roadmap unlocked" }
                        ].map((lesson) => (
                            <div key={lesson.num} className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-sm">
                                        {lesson.num}
                                    </div>
                                    <h4 className="font-bold text-white">{lesson.title}</h4>
                                </div>
                                <p className="text-slate-400 text-sm pl-11">{lesson.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Button
                            onClick={scrollToForm}
                            className="h-14 px-10 text-lg font-bold bg-emerald-500 hover:bg-emerald-600"
                        >
                            Get Free Access Now
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <p className="text-slate-500 text-sm mt-3">Takes 30 seconds • No credit card required</p>
                    </div>
                </div>
            </section>

            {/* VALUE STACK - Hormozi Style */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">
                            Everything You're Getting<br />
                            <span className="text-emerald-600">100% Free Today</span>
                        </h2>
                    </div>

                    <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
                        {[
                            { item: "9-Lesson Functional Medicine Mini-Diploma", value: "$97" },
                            { item: "ASI-Verified Certificate of Completion", value: "$47" },
                            { item: "Access to Coach Sarah (Your Personal Guide)", value: "$197" },
                            { item: "Career Roadmap & Next Steps Plan", value: "$27" },
                            { item: "Exclusive Community Access", value: "$47" }
                        ].map((row, i) => (
                            <div key={i} className={`flex items-center justify-between p-4 ${i < 4 ? "border-b border-slate-200" : ""}`}>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                    <span className="font-medium text-slate-800">{row.item}</span>
                                </div>
                                <span className="text-slate-400 line-through text-sm">{row.value}</span>
                            </div>
                        ))}
                        <div className="bg-emerald-600 p-6 text-center text-white">
                            <p className="text-sm opacity-80 mb-1">Total Value: <span className="line-through">$415</span></p>
                            <p className="text-4xl font-black">FREE TODAY</p>
                            <p className="text-sm opacity-80 mt-1">Limited Time • Normally $97</p>
                        </div>
                    </div>

                    <div className="text-center mt-8">
                        <Button
                            onClick={scrollToForm}
                            className="h-14 px-10 text-lg font-bold bg-emerald-600 hover:bg-emerald-700"
                        >
                            Claim Your Free Diploma
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 md:py-20 bg-slate-50">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-center text-slate-900 mb-10">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-3">
                        {[
                            { q: "Is this really free?", a: "Yes, 100% free. No credit card required. We offer this to help you experience what's possible in functional medicine." },
                            { q: "How long does it take?", a: "About 60 minutes total. You can do all 9 lessons in one sitting, or spread them out over a few days." },
                            { q: "What's the catch?", a: "No catch. After completing, you'll have the option to continue your education with our full certification — but there's no obligation." },
                            { q: "Is the certificate real?", a: "Yes! It's issued by AccrediPro Standards Institute (ASI) and recognized by employers worldwide." },
                            { q: "Do I need prior experience?", a: "Not at all. This mini-diploma is designed for complete beginners." }
                        ].map((faq, i) => (
                            <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-4 text-left"
                                >
                                    <span className="font-semibold text-slate-800">{faq.q}</span>
                                    {openFaq === i ? (
                                        <ChevronUp className="w-5 h-5 text-slate-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-slate-400" />
                                    )}
                                </button>
                                {openFaq === i && (
                                    <div className="px-4 pb-4 text-slate-600 text-sm">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-16 md:py-20 bg-slate-900 text-white text-center">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-black mb-6">
                        Your Next Chapter Starts<br />
                        <span className="text-emerald-400">In 60 Minutes</span>
                    </h2>
                    <p className="text-slate-300 text-lg mb-8 max-w-xl mx-auto">
                        Women just like you are already earning $3K-$8K/month as functional medicine practitioners. The only question is: will you join them?
                    </p>
                    <Button
                        onClick={scrollToForm}
                        className="h-16 px-12 text-xl font-bold bg-emerald-500 hover:bg-emerald-600"
                    >
                        Get My Free Diploma Now
                        <ArrowRight className="ml-2 w-6 h-6" />
                    </Button>
                    <p className="text-slate-500 text-sm mt-4">⚡ Free for next 24 hours only</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-950 text-slate-400 py-10">
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Image src="/logos/accredipro-logo-gold.svg" alt="AccrediPro" width={140} height={36} />
                    </div>
                    <p className="text-sm">
                        © {new Date().getFullYear()} AccrediPro Standards Institute. All rights reserved.
                    </p>
                </div>
            </footer>

            {/* Floating Chat Widget */}
            <FloatingChatWidget />
        </div>
    );
}

export default function FunctionalMedicineMiniDiplomaPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-slate-900">
                <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
        }>
            <FunctionalMedicineMiniDiplomaContent />
        </Suspense>
    );
}
