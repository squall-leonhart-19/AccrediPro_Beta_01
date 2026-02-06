"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Award, CheckCircle2, ArrowRight,
    GraduationCap, MessageCircle, Loader2, Shield,
    ChevronDown, ChevronUp, Sparkles, ArrowDown,
    Clock, X, Lock, Users, Star, Zap, AlertTriangle
} from "lucide-react";
import { PIXEL_CONFIG } from "@/components/tracking/meta-pixel";
import { useMetaTracking } from "@/hooks/useMetaTracking";
import MetaPixel from "@/components/tracking/meta-pixel";
import { FloatingChatWidget } from "@/components/lead-portal/floating-chat-widget";
import { MultiStepQualificationForm, QualificationData } from "@/components/lead-portal/multi-step-qualification-form";

// Brand Colors
const BRAND = {
    burgundy: "#722f37",
    burgundyDark: "#4e1f24",
    burgundyLight: "#9a4a54",
    gold: "#d4af37",
    goldLight: "#f7e7a0",
    goldDark: "#b8860b",
    cream: "#fdf8f0",
    goldMetallic: "linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)",
    burgundyMetallic: "linear-gradient(135deg, #722f37 0%, #9a4a54 25%, #722f37 50%, #4e1f24 75%, #722f37 100%)",
};

// Countdown Timer Component
function CountdownTimer() {
    const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 });

    useEffect(() => {
        // Set end time to midnight tonight
        const now = new Date();
        const midnight = new Date(now);
        midnight.setHours(24, 0, 0, 0);

        const updateTimer = () => {
            const now = new Date();
            const diff = midnight.getTime() - now.getTime();

            if (diff <= 0) {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeLeft({ hours, minutes, seconds });
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-1 font-mono font-bold">
            <span className="bg-black/20 px-2 py-0.5 rounded">{String(timeLeft.hours).padStart(2, '0')}</span>
            <span>:</span>
            <span className="bg-black/20 px-2 py-0.5 rounded">{String(timeLeft.minutes).padStart(2, '0')}</span>
            <span>:</span>
            <span className="bg-black/20 px-2 py-0.5 rounded">{String(timeLeft.seconds).padStart(2, '0')}</span>
        </div>
    );
}

function FMDipContent() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const { trackViewContent, trackInitiateCheckout } = useMetaTracking();

    useEffect(() => {
        trackViewContent(
            "FM $7 Mini Diploma",
            "fm-dip-7",
            PIXEL_CONFIG.FUNCTIONAL_MEDICINE
        );
    }, [trackViewContent]);

    const handleSubmit = async (formData: QualificationData) => {
        setIsVerifying(true);

        try {
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

            setIsVerifying(false);
            setIsSubmitting(true);

            trackInitiateCheckout(
                "FM $7 Mini Diploma",
                7,
                formData.email,
                PIXEL_CONFIG.FUNCTIONAL_MEDICINE
            );

            sessionStorage.setItem("fmDipCheckout", JSON.stringify({
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.toLowerCase().trim(),
                phone: formData.phone,
            }));

            router.push("/checkout/mini-diploma");

        } catch (err: any) {
            alert(err.message || "Something went wrong. Please try again.");
            setIsSubmitting(false);
            setIsVerifying(false);
        }
    };

    const scrollToForm = () => {
        document.getElementById("lead-form")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: BRAND.cream }}>
            <MetaPixel pixelId={PIXEL_CONFIG.FUNCTIONAL_MEDICINE} />

            {/* URGENCY BAR - Countdown + Cohort Scarcity */}
            <div className="bg-red-600 py-3 px-4">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-white">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 animate-pulse" />
                        <span className="font-bold text-sm">FINAL COHORT AT $7</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span>Price returns to $97 in:</span>
                        <CountdownTimer />
                    </div>
                </div>
            </div>

            {/* HERO SECTION */}
            <section className="relative overflow-hidden pt-10 pb-16 md:pt-14 md:pb-20" style={{ backgroundColor: BRAND.burgundyDark }}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, ${BRAND.gold} 1px, transparent 0)`,
                        backgroundSize: '48px 48px'
                    }} />
                </div>

                <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20" style={{ backgroundColor: BRAND.gold }} />

                <div className="relative max-w-6xl mx-auto px-4">
                    <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 items-start">
                        {/* Left Column - Copy */}
                        <div className="text-white">
                            {/* Cohort Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-red-500/20 border border-red-400/40">
                                <Zap className="w-4 h-4 text-red-300" />
                                <span className="text-sm font-bold text-red-200">January 2026 Cohort — Last Call</span>
                            </div>

                            <h1 className="text-3xl md:text-5xl lg:text-[3.2rem] font-black leading-[1.1] mb-6">
                                <span className="text-white">Get Your FM Certification</span><br />
                                <span style={{ color: BRAND.goldLight }}>For Just $7</span><br />
                                <span className="text-white/70 text-xl md:text-2xl">(Before It Goes Back to $97)</span>
                            </h1>

                            <p className="text-lg md:text-xl text-white/80 mb-6 max-w-lg leading-relaxed">
                                This is the <strong className="text-white">last cohort</strong> at the launch price.
                                Complete the 3-lesson mini diploma, earn your ASI-verified certificate,
                                and discover how women like you are building <strong className="text-white">$3K-$8K/month</strong> practices.
                            </p>

                            {/* Guarantee Badge - ABOVE FOLD */}
                            <div className="flex items-center gap-3 mb-6 p-3 rounded-xl bg-emerald-500/20 border border-emerald-400/30 max-w-md">
                                <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center flex-shrink-0">
                                    <Shield className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <p className="font-bold text-emerald-300 text-sm">30-Day Money-Back Guarantee</p>
                                    <p className="text-xs text-emerald-200/70">Not happy? Full refund, no questions.</p>
                                </div>
                            </div>

                            {/* Quick Stats */}
                            <div className="flex flex-wrap gap-4 md:gap-6 mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${BRAND.gold}20` }}>
                                        <Award className="w-5 h-5" style={{ color: BRAND.gold }} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">3 Lessons</p>
                                        <p className="text-xs text-white/60">~60 min total</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${BRAND.gold}20` }}>
                                        <GraduationCap className="w-5 h-5" style={{ color: BRAND.gold }} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">Certificate</p>
                                        <p className="text-xs text-white/60">ASI Verified</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${BRAND.gold}20` }}>
                                        <Users className="w-5 h-5" style={{ color: BRAND.gold }} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">12,847</p>
                                        <p className="text-xs text-white/60">Graduates</p>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile CTA */}
                            <Button
                                onClick={scrollToForm}
                                className="lg:hidden w-full h-14 text-lg font-bold mb-6"
                                style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                            >
                                Secure My Spot — Just $7
                                <ArrowDown className="ml-2 w-5 h-5" />
                            </Button>
                        </div>

                        {/* Right Column - Form */}
                        <div id="lead-form" className="relative z-10">
                            <MultiStepQualificationForm
                                onSubmit={handleSubmit}
                                isSubmitting={isSubmitting}
                                isVerifying={isVerifying}
                                isPaid={true}
                                step1ButtonText="Continue — Lock In $7 Price"
                                submitButtonText="Secure My Spot — $7"
                                step1SubText="Price goes to $97 at midnight"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* PROBLEM/AGITATION SECTION */}
            <section className="py-14 md:py-18 bg-white border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
                            Sound Familiar?
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            "You're exhausted from a job that drains you",
                            "You feel like you were meant for something MORE",
                            "You want flexibility — not asking permission for time off",
                            "You've healed yourself and want to help others",
                            "You're watching others build businesses and wondering \"why not me?\"",
                            "You're ready to bet on yourself, but don't know where to start"
                        ].map((pain, i) => (
                            <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-red-500 text-sm">✓</span>
                                </div>
                                <p className="text-gray-700">{pain}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <p className="text-lg text-gray-600 mb-4">
                            If you checked even ONE of these boxes...
                        </p>
                        <p className="text-2xl font-bold" style={{ color: BRAND.burgundy }}>
                            This mini diploma was made for you.
                        </p>
                    </div>
                </div>
            </section>

            {/* INCOME PROOF */}
            <section className="py-16 md:py-20" style={{ backgroundColor: "#faf5eb" }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="font-bold text-sm uppercase tracking-wide mb-3" style={{ color: BRAND.burgundy }}>Real Women, Real Results</p>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                            They Started Exactly Where You Are.
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { name: "Jennifer M.", age: "47", income: "$4,200/mo", before: "Former nurse", story: "I was done with 12-hour shifts. Now I coach 8 clients from home around my grandkids' schedule.", timeline: "6 months after completing" },
                            { name: "Patricia L.", age: "52", income: "$6,800/mo", before: "Corporate burnout", story: "Left my desk job at 47. Best decision I ever made. My husband says I'm a different person.", timeline: "8 months after completing" },
                            { name: "Michelle R.", age: "41", income: "$3,100/mo", before: "Stay-at-home mom", story: "Started while my kids napped. Now they're in school and this is my full-time income.", timeline: "4 months after completing" }
                        ].map((story, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                                        <span className="font-bold text-lg" style={{ color: BRAND.burgundy }}>{story.name[0]}</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{story.name}, {story.age}</p>
                                        <p className="text-xs text-gray-500">{story.before}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm mb-4 italic">"{story.story}"</p>
                                <div className="rounded-xl px-4 py-3 text-center" style={{ background: BRAND.goldMetallic }}>
                                    <p className="text-2xl font-black" style={{ color: BRAND.burgundyDark }}>{story.income}</p>
                                    <p className="text-xs" style={{ color: BRAND.burgundyDark }}>{story.timeline}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Button
                            onClick={scrollToForm}
                            className="h-14 px-10 text-lg font-bold"
                            style={{ background: BRAND.burgundyMetallic, color: "white" }}
                        >
                            Join 12,847+ Graduates — $7
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* WHAT YOU GET - HORMOZI VALUE STACK */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <p className="font-bold text-sm uppercase tracking-wide mb-3" style={{ color: BRAND.burgundy }}>The Complete Package</p>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                            Everything You're Getting Today
                        </h2>
                    </div>

                    <div className="bg-gray-50 rounded-2xl border-2 border-gray-200 overflow-hidden">
                        {/* Value Items */}
                        {[
                            { item: "Complete 3-Lesson FM Foundations Training", value: "$97", icon: "📚" },
                            { item: "ASI-Verified Certificate of Completion", value: "$47", icon: "🎓" },
                            { item: "Coach Sarah — Personal Mentorship Access", value: "$197", icon: "👩‍🏫" },
                            { item: "Career Roadmap & Income Blueprint", value: "$27", icon: "🗺️" },
                            { item: "Private Community Access (12,000+ members)", value: "$47", icon: "👥" },
                            { item: "6 Graduate Bonus Resources", value: "$49", icon: "🎁" }
                        ].map((row, i) => (
                            <div key={i} className="flex items-center justify-between p-4 border-b border-gray-200 last:border-b-0">
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{row.icon}</span>
                                    <span className="font-medium text-gray-800">{row.item}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-400 line-through text-sm">{row.value}</span>
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                </div>
                            </div>
                        ))}

                        {/* Total Value */}
                        <div className="bg-gray-100 p-4 border-t-2 border-gray-200">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-700">TOTAL VALUE:</span>
                                <span className="text-2xl font-black text-gray-400 line-through">$464</span>
                            </div>
                        </div>

                        {/* Final Price */}
                        <div className="p-6 text-center text-white" style={{ background: BRAND.burgundyMetallic }}>
                            <p className="text-sm opacity-80 mb-1">January Cohort Special Price:</p>
                            <div className="flex items-center justify-center gap-3">
                                <span className="text-5xl font-black">$7</span>
                                <div className="text-left">
                                    <p className="text-xs opacity-70 line-through">$97</p>
                                    <p className="text-sm font-bold text-yellow-300">Save 93%</p>
                                </div>
                            </div>
                            <p className="text-xs opacity-70 mt-2">Price returns to $97 after this cohort</p>
                        </div>
                    </div>

                    <div className="text-center mt-8">
                        <Button
                            onClick={scrollToForm}
                            className="h-14 px-10 text-lg font-bold"
                            style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                        >
                            Secure My Spot — $7
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <p className="text-sm text-gray-500 mt-3 flex items-center justify-center gap-2">
                            <Lock className="w-4 h-4" />
                            Secure checkout • 30-day guarantee
                        </p>
                    </div>
                </div>
            </section>

            {/* CERTIFICATE PREVIEW */}
            <section className="py-16 md:py-20" style={{ backgroundColor: "#faf5eb" }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-10 items-center">
                        <div className="relative">
                            <div className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl" style={{ backgroundColor: BRAND.gold }} />
                            <div className="relative bg-white rounded-2xl shadow-2xl p-4 border border-gray-100 transform hover:scale-[1.02] transition-transform">
                                <Image
                                    src="/FUNCTIONAL_MEDICINE_CERTIFICATE.webp"
                                    alt="Functional Medicine Foundation Certificate"
                                    width={600}
                                    height={450}
                                    className="rounded-xl w-full h-auto"
                                />
                            </div>
                            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg px-4 py-2 border border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                                    <span className="font-bold text-sm" style={{ color: BRAND.burgundy }}>ASI Verified</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6" style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}>
                                <Award className="w-4 h-4" />
                                YOUR CERTIFICATE AWAITS
                            </div>

                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                                Your Name.<br />
                                <span style={{ color: BRAND.burgundy }}>On This Certificate.</span><br />
                                <span className="text-2xl text-gray-500">In About 60 Minutes.</span>
                            </h2>

                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Complete all 3 lessons and receive your <strong>ASI-Verified Foundation Certificate</strong> —
                                recognized by clients and employers worldwide.
                            </p>

                            <div className="space-y-3 mb-6">
                                {[
                                    "Issued by AccrediPro Standards Institute",
                                    "CPD/CEU credit eligible",
                                    "Digital + printable format",
                                    "Unique verification ID"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                        <span className="text-gray-700">{item}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                onClick={scrollToForm}
                                className="h-14 px-8 text-lg font-bold text-white"
                                style={{ background: BRAND.burgundyMetallic }}
                            >
                                Get My Certificate — $7
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* CURRICULUM */}
            <section className="py-16 md:py-20 text-white" style={{ backgroundColor: BRAND.burgundyDark }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="font-bold text-sm uppercase mb-3" style={{ color: BRAND.gold }}>Inside Your Mini-Diploma</p>
                        <h2 className="text-3xl md:text-4xl font-black">
                            3 Lessons That Could Change<br />
                            <span style={{ color: BRAND.gold }}>Your Entire Career Path</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            { num: 1, title: "Root Cause Medicine", desc: "Why conventional medicine gets it wrong" },
                            { num: 2, title: "The Gut Foundation", desc: "Where 80% of healing actually begins" },
                            { num: 3, title: "Inflammation Connection", desc: "The hidden driver behind chronic disease" },
                            { num: 4, title: "The Toxin Burden", desc: "Modern detox protocols that work" },
                            { num: 5, title: "Stress & Hormones", desc: "HPA axis, adrenals, and burnout" },
                            { num: 6, title: "Nutrient Deficiencies", desc: "Testing and targeted correction" },
                            { num: 7, title: "Lab Interpretation", desc: "Reading functional labs like a pro" },
                            { num: 8, title: "Building Protocols", desc: "Creating personalized healing plans" },
                            { num: 9, title: "Your Career Roadmap", desc: "Turn this into income" }
                        ].map((lesson) => (
                            <div key={lesson.num} className="rounded-xl p-4 border" style={{ backgroundColor: `${BRAND.burgundy}80`, borderColor: `${BRAND.gold}30` }}>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm" style={{ backgroundColor: `${BRAND.gold}30`, color: BRAND.gold }}>
                                        {lesson.num}
                                    </div>
                                    <h4 className="font-bold text-white">{lesson.title}</h4>
                                </div>
                                <p className="text-white/60 text-sm pl-11">{lesson.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Button
                            onClick={scrollToForm}
                            className="h-14 px-10 text-lg font-bold"
                            style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                        >
                            Start Learning Now — $7
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* STANDALONE GUARANTEE SECTION */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="text-center p-8 md:p-12 rounded-3xl border-2 border-emerald-200 bg-emerald-50">
                        <div className="w-20 h-20 rounded-full bg-emerald-500 flex items-center justify-center mx-auto mb-6">
                            <Shield className="w-10 h-10 text-white" />
                        </div>

                        <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
                            30-Day Money-Back Guarantee
                        </h2>

                        <p className="text-gray-600 text-lg mb-6 max-w-xl mx-auto">
                            Complete the mini diploma. If you don't feel it was worth every penny of that $7,
                            email us within 30 days and we'll refund you immediately. <strong>No questions. No hassle.</strong>
                        </p>

                        <p className="text-emerald-700 font-semibold">
                            You literally have nothing to lose.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 md:py-20" style={{ backgroundColor: BRAND.cream }}>
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
                        Common Questions
                    </h2>

                    <div className="space-y-3">
                        {[
                            {
                                q: "Why is it only $7? What's the catch?",
                                a: "No catch. This is our January cohort launch price. We're building momentum for 2026 and want to get this into as many hands as possible. After this cohort closes, the price goes back to $97. You're just getting in at the right time."
                            },
                            {
                                q: "How long does it take to complete?",
                                a: "About 60 minutes total for all 3 lessons. Most people finish in one sitting, but you can spread it out over a week if you prefer."
                            },
                            {
                                q: "Do I need any prior health or medical experience?",
                                a: "Not at all! This is designed for complete beginners. If you're curious about health and want to help others heal, you're exactly who this is for."
                            },
                            {
                                q: "Is the certificate actually recognized?",
                                a: "Yes. It's issued by AccrediPro Standards Institute (ASI) and includes a unique verification ID. Employers and clients can verify your credentials through our directory."
                            },
                            {
                                q: "What happens after I complete the mini diploma?",
                                a: "You'll receive your certificate immediately, plus access to your personalized career roadmap. If you want to go deeper into full certification, I'll show you the path — but there's zero obligation."
                            },
                            {
                                q: "What if I don't like it?",
                                a: "Email us within 30 days for a full refund. No questions asked. We've issued maybe 3 refunds ever — but the option is there if you need it."
                            }
                        ].map((faq, i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-4 text-left"
                                >
                                    <span className="font-semibold text-gray-800">{faq.q}</span>
                                    {openFaq === i ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                    )}
                                </button>
                                {openFaq === i && (
                                    <div className="px-4 pb-4 text-gray-600 text-sm">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-16 md:py-20 text-white text-center" style={{ backgroundColor: BRAND.burgundyDark }}>
                <div className="max-w-3xl mx-auto px-4">
                    {/* Countdown Reminder */}
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-red-500/20 border border-red-400/30 mb-8">
                        <AlertTriangle className="w-5 h-5 text-red-300" />
                        <span className="text-red-200 font-medium">Price returns to $97 in: </span>
                        <CountdownTimer />
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black mb-6">
                        Your Next Chapter Starts<br />
                        <span style={{ color: BRAND.gold }}>For Just $7</span>
                    </h2>

                    <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
                        12,847 women have already completed this mini diploma.
                        Many of them are now earning $3K-$8K/month doing work they love.
                        <br /><br />
                        <strong className="text-white">Will you be next?</strong>
                    </p>

                    <Button
                        onClick={scrollToForm}
                        className="h-16 px-12 text-xl font-bold"
                        style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                    >
                        Secure My Spot — $7
                        <ArrowRight className="ml-2 w-6 h-6" />
                    </Button>

                    <p className="text-white/50 text-sm mt-4 flex items-center justify-center gap-2">
                        <Shield className="w-4 h-4" />
                        30-day money-back guarantee
                    </p>
                </div>
            </section>

            {/* TRUST FOOTER */}
            <footer className="py-10 text-gray-400" style={{ backgroundColor: "#2a1518" }}>
                <div className="max-w-5xl mx-auto px-4">
                    {/* Trust Badges */}
                    <div className="flex flex-wrap items-center justify-center gap-6 mb-6 text-gray-500">
                        <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            <span className="text-sm">SSL Encrypted</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            <span className="text-sm">Secure Checkout</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Award className="w-4 h-4" />
                            <span className="text-sm">ASI Accredited</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Image src="/logos/accredipro-logo-gold.svg" alt="AccrediPro" width={140} height={36} />
                    </div>
                    <p className="text-sm text-center">
                        © {new Date().getFullYear()} AccrediPro Standards Institute. All rights reserved.
                    </p>
                </div>
            </footer>

            {/* Sticky Mobile CTA */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3 lg:hidden z-50 shadow-lg">
                <Button
                    onClick={scrollToForm}
                    className="w-full h-12 text-lg font-bold"
                    style={{ background: BRAND.burgundyMetallic, color: "white" }}
                >
                    Secure My Spot — $7
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>

            <FloatingChatWidget />
        </div>
    );
}

export default function FMDipPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#4e1f24" }}>
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#d4af37" }} />
            </div>
        }>
            <FMDipContent />
        </Suspense>
    );
}
