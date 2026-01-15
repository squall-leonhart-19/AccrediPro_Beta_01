"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Award, CheckCircle2, ArrowRight,
    GraduationCap, MessageCircle, Loader2, Shield,
    ChevronDown, ChevronUp, Sparkles, ArrowDown,
    Clock, X, Lock, Users, Star, Zap, AlertTriangle,
    BookOpen, Target, Trophy, Check, Minus
} from "lucide-react";
import { PIXEL_CONFIG } from "@/components/tracking/meta-pixel";
import { useMetaTracking } from "@/hooks/useMetaTracking";
import MetaPixel from "@/components/tracking/meta-pixel";
import { FloatingChatWidget } from "@/components/lead-portal/floating-chat-widget";

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

// Dynamic Cohort Date - Always tomorrow
function getCohortDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
    });
}

// Dynamic spots remaining (random but consistent per day)
function getSpotsRemaining() {
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    return 12 + (seed % 35); // 12-47 spots
}

function FMProContent() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [cohortDate, setCohortDate] = useState("Tomorrow");
    const [spotsLeft, setSpotsLeft] = useState(23); // Default to avoid 0 flash
    const { trackViewContent, trackInitiateCheckout } = useMetaTracking();

    useEffect(() => {
        setCohortDate(getCohortDate());
        setSpotsLeft(getSpotsRemaining());

        trackViewContent(
            "FM Pro Certification $297",
            "fm-pro-297",
            PIXEL_CONFIG.FUNCTIONAL_MEDICINE
        );
    }, [trackViewContent]);

    const handleCheckout = () => {
        trackInitiateCheckout(
            "FM Pro Certification",
            297,
            "",
            PIXEL_CONFIG.FUNCTIONAL_MEDICINE
        );
        // Redirect to checkout
        window.location.href = "https://sarah.accredipro.academy/checkout-fm-certification";
    };

    const scrollToCheckout = () => {
        document.getElementById("offer-section")?.scrollIntoView({ behavior: "smooth" });
    };

    return (
        <div className="min-h-screen" style={{ backgroundColor: BRAND.cream }}>
            <MetaPixel pixelId={PIXEL_CONFIG.FUNCTIONAL_MEDICINE} />

            {/* URGENCY BAR - Dynamic Cohort */}
            <div className="bg-red-600 py-3 px-4">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-white">
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 animate-pulse" />
                        <span className="font-bold text-sm">LAST {spotsLeft} SPOTS</span>
                    </div>
                    <div className="text-sm">
                        Join the <strong>{cohortDate}</strong> Cohort — Enrollment Closes Tonight
                    </div>
                </div>
            </div>

            {/* HERO SECTION */}
            <section className="relative overflow-hidden pt-12 pb-16 md:pt-16 md:pb-24" style={{ backgroundColor: BRAND.burgundyDark }}>
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, ${BRAND.gold} 1px, transparent 0)`,
                        backgroundSize: '48px 48px'
                    }} />
                </div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20" style={{ backgroundColor: BRAND.gold }} />

                <div className="relative max-w-5xl mx-auto px-4 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ background: BRAND.goldMetallic }}>
                        <Trophy className="w-4 h-4" style={{ color: BRAND.burgundyDark }} />
                        <span className="text-sm font-bold" style={{ color: BRAND.burgundyDark }}>The Most Complete FM Certification Online</span>
                    </div>

                    <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-tight mb-6">
                        Get <span style={{ color: BRAND.goldLight }}>Everything You Need</span><br />
                        To Become a Certified<br />
                        Functional Medicine Practitioner
                    </h1>

                    <p className="text-lg md:text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
                        14 comprehensive modules. 12+ specialty certifications.
                        An accountability group that won't let you quit.
                        And lifetime access to a community of <strong className="text-white">12,000+ practitioners</strong>.
                    </p>

                    {/* Key Stats */}
                    <div className="flex flex-wrap justify-center gap-6 md:gap-10 mb-10">
                        <div className="text-center">
                            <p className="text-3xl md:text-4xl font-black" style={{ color: BRAND.gold }}>14</p>
                            <p className="text-sm text-white/60">Core Modules</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl md:text-4xl font-black" style={{ color: BRAND.gold }}>12+</p>
                            <p className="text-sm text-white/60">Specialty Certs</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl md:text-4xl font-black" style={{ color: BRAND.gold }}>50+</p>
                            <p className="text-sm text-white/60">CEU Hours</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl md:text-4xl font-black" style={{ color: BRAND.gold }}>12,847</p>
                            <p className="text-sm text-white/60">Graduates</p>
                        </div>
                    </div>

                    {/* Guarantee + CTA */}
                    <div className="flex flex-col items-center gap-4">
                        <Button
                            onClick={scrollToCheckout}
                            className="h-16 px-10 text-xl font-bold"
                            style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                        >
                            Join the {cohortDate} Cohort — $297
                            <ArrowDown className="ml-2 w-5 h-5" />
                        </Button>
                        <div className="flex items-center gap-2 text-white/60 text-sm">
                            <Shield className="w-4 h-4" />
                            <span>30-Day Money-Back Guarantee</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* COMPETITOR COMPARISON TABLE */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="font-bold text-sm uppercase tracking-wide mb-3" style={{ color: BRAND.burgundy }}>See The Difference</p>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                            Why Pay $6,000+ When You Can Get<br />
                            <span style={{ color: BRAND.burgundy }}>Everything For $297?</span>
                        </h2>
                    </div>

                    {/* Comparison Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="text-left p-4 bg-gray-50 border-b-2 border-gray-200">Feature</th>
                                    <th className="p-4 bg-gray-50 border-b-2 border-gray-200 text-center">
                                        <div className="text-gray-500 text-sm">IIN</div>
                                        <div className="font-bold text-gray-700">$6,495</div>
                                    </th>
                                    <th className="p-4 bg-gray-50 border-b-2 border-gray-200 text-center">
                                        <div className="text-gray-500 text-sm">FMU</div>
                                        <div className="font-bold text-gray-700">$3,997</div>
                                    </th>
                                    <th className="p-4 bg-gray-50 border-b-2 border-gray-200 text-center">
                                        <div className="text-gray-500 text-sm">IFMCP</div>
                                        <div className="font-bold text-gray-700">$2,500</div>
                                    </th>
                                    <th className="p-4 border-b-2 text-center" style={{ backgroundColor: `${BRAND.burgundy}10`, borderColor: BRAND.burgundy }}>
                                        <div className="font-bold" style={{ color: BRAND.burgundy }}>AccrediPro</div>
                                        <div className="font-black text-xl" style={{ color: BRAND.burgundy }}>$297</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { feature: "Full FM Certification", iin: true, fmu: true, ifmcp: true, ap: true },
                                    { feature: "Multiple Specialty Certs", iin: false, fmu: false, ifmcp: false, ap: "12+" },
                                    { feature: "Lifetime Access", iin: false, fmu: false, ifmcp: true, ap: true },
                                    { feature: "Accountability Group", iin: false, fmu: false, ifmcp: false, ap: true },
                                    { feature: "Private Community", iin: true, fmu: true, ifmcp: false, ap: true },
                                    { feature: "CPD/CEU Credits", iin: true, fmu: true, ifmcp: true, ap: "50+" },
                                    { feature: "Practitioner Directory", iin: false, fmu: false, ifmcp: false, ap: true },
                                    { feature: "DFY Templates", iin: false, fmu: true, ifmcp: false, ap: true },
                                    { feature: "100% Online, Self-Paced", iin: true, fmu: true, ifmcp: false, ap: true },
                                    { feature: "Money-Back Guarantee", iin: false, fmu: "14 days", ifmcp: false, ap: "30 days" }
                                ].map((row, i) => (
                                    <tr key={i} className="border-b border-gray-100">
                                        <td className="p-4 font-medium text-gray-800">{row.feature}</td>
                                        <td className="p-4 text-center">
                                            {row.iin === true ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> :
                                                row.iin === false ? <Minus className="w-5 h-5 text-gray-300 mx-auto" /> :
                                                    <span className="text-gray-600 text-sm">{row.iin}</span>}
                                        </td>
                                        <td className="p-4 text-center">
                                            {row.fmu === true ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> :
                                                row.fmu === false ? <Minus className="w-5 h-5 text-gray-300 mx-auto" /> :
                                                    <span className="text-gray-600 text-sm">{row.fmu}</span>}
                                        </td>
                                        <td className="p-4 text-center">
                                            {row.ifmcp === true ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> :
                                                row.ifmcp === false ? <Minus className="w-5 h-5 text-gray-300 mx-auto" /> :
                                                    <span className="text-gray-600 text-sm">{row.ifmcp}</span>}
                                        </td>
                                        <td className="p-4 text-center" style={{ backgroundColor: `${BRAND.burgundy}05` }}>
                                            {row.ap === true ? <Check className="w-5 h-5 text-emerald-500 mx-auto" /> :
                                                row.ap === false ? <Minus className="w-5 h-5 text-gray-300 mx-auto" /> :
                                                    <span className="font-bold" style={{ color: BRAND.burgundy }}>{row.ap}</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="text-center mt-10">
                        <Button
                            onClick={scrollToCheckout}
                            className="h-14 px-10 text-lg font-bold"
                            style={{ background: BRAND.burgundyMetallic, color: "white" }}
                        >
                            Get Everything For $297
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* WHAT'S INCLUDED - Full Stack */}
            <section className="py-16 md:py-20" style={{ backgroundColor: "#faf5eb" }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="font-bold text-sm uppercase tracking-wide mb-3" style={{ color: BRAND.burgundy }}>The Complete Package</p>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                            What You Get With Your Enrollment
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* 14-Module Certification */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: BRAND.goldMetallic }}>
                                    <GraduationCap className="w-7 h-7" style={{ color: BRAND.burgundyDark }} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-gray-900 mb-2">Complete 14-Module FM Certification</h3>
                                    <p className="text-gray-600 text-sm mb-3">
                                        The most comprehensive functional medicine training online.
                                        From gut health to hormones, toxins to nutrition — master it all.
                                    </p>
                                    <p className="text-sm text-gray-400 line-through">Value: $497</p>
                                </div>
                            </div>
                        </div>

                        {/* Full Catalog Access */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: BRAND.goldMetallic }}>
                                    <BookOpen className="w-7 h-7" style={{ color: BRAND.burgundyDark }} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-gray-900 mb-2">Full Certification Library (12+ Programs)</h3>
                                    <p className="text-gray-600 text-sm mb-3">
                                        Gut Health, Women's Health, Hormone Health, Nutrition, Holistic Nursing,
                                        and more. Get certified in every specialty.
                                    </p>
                                    <p className="text-sm text-gray-400 line-through">Value: $397</p>
                                </div>
                            </div>
                        </div>

                        {/* Accountability Pod */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: BRAND.goldMetallic }}>
                                    <Users className="w-7 h-7" style={{ color: BRAND.burgundyDark }} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-gray-900 mb-2">8-Week Accountability Pod</h3>
                                    <p className="text-gray-600 text-sm mb-3">
                                        Small group of 5-8 women. Weekly check-ins.
                                        Support, motivation, and people who won't let you quit.
                                    </p>
                                    <p className="text-sm text-gray-400 line-through">Value: $297</p>
                                </div>
                            </div>
                        </div>

                        {/* Private Community */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: BRAND.goldMetallic }}>
                                    <MessageCircle className="w-7 h-7" style={{ color: BRAND.burgundyDark }} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-gray-900 mb-2">Private Community (12,000+ Members)</h3>
                                    <p className="text-gray-600 text-sm mb-3">
                                        Lifetime access to our practitioner community.
                                        Ask questions, share wins, find referrals.
                                    </p>
                                    <p className="text-sm text-gray-400 line-through">Value: $147</p>
                                </div>
                            </div>
                        </div>

                        {/* Directory Listing */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: BRAND.goldMetallic }}>
                                    <Target className="w-7 h-7" style={{ color: BRAND.burgundyDark }} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-gray-900 mb-2">ASI Practitioner Directory (1 Year)</h3>
                                    <p className="text-gray-600 text-sm mb-3">
                                        Get found by clients in your area.
                                        Verified profile, SEO-optimized, verified credentials badge.
                                    </p>
                                    <p className="text-sm text-gray-400 line-through">Value: $99</p>
                                </div>
                            </div>
                        </div>

                        {/* DFY Templates */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <div className="flex items-start gap-4">
                                <div className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: BRAND.goldMetallic }}>
                                    <Award className="w-7 h-7" style={{ color: BRAND.burgundyDark }} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-gray-900 mb-2">DFY Practice Templates</h3>
                                    <p className="text-gray-600 text-sm mb-3">
                                        Client intake forms, session scripts, protocol templates —
                                        everything you need to start seeing clients.
                                    </p>
                                    <p className="text-sm text-gray-400 line-through">Value: $97</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CURRICULUM PREVIEW */}
            <section className="py-16 md:py-20 text-white" style={{ backgroundColor: BRAND.burgundyDark }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="font-bold text-sm uppercase mb-3" style={{ color: BRAND.gold }}>Complete Curriculum</p>
                        <h2 className="text-3xl md:text-4xl font-black">
                            14 Comprehensive Modules<br />
                            <span style={{ color: BRAND.gold }}>50+ Hours of Training</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        {[
                            { num: 1, title: "Foundations of Functional Medicine", desc: "The paradigm shift explained" },
                            { num: 2, title: "The Gut-Health Connection", desc: "Microbiome, leaky gut, protocols" },
                            { num: 3, title: "Inflammation & Immune System", desc: "Root cause of chronic disease" },
                            { num: 4, title: "Detoxification & Toxin Burden", desc: "Liver, kidneys, lymph protocols" },
                            { num: 5, title: "Functional Nutrition", desc: "Food as medicine approach" },
                            { num: 6, title: "Hormone Health", desc: "Thyroid, adrenals, sex hormones" },
                            { num: 7, title: "Stress & The HPA Axis", desc: "Burnout, cortisol, recovery" },
                            { num: 8, title: "Nutrient Deficiencies", desc: "Testing and targeted supplementation" },
                            { num: 9, title: "Functional Lab Interpretation", desc: "Reading labs like a pro" },
                            { num: 10, title: "Client Assessment", desc: "Intake, history, mapping" },
                            { num: 11, title: "Building Protocols", desc: "Personalized healing plans" },
                            { num: 12, title: "Special Populations", desc: "Pediatrics, geriatrics, pregnancy" },
                            { num: 13, title: "Practice Building", desc: "Marketing, pricing, operations" },
                            { num: 14, title: "Career Roadmap", desc: "Your path to $5K+/month" }
                        ].map((module) => (
                            <div key={module.num} className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: `${BRAND.burgundy}80` }}>
                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ backgroundColor: `${BRAND.gold}30`, color: BRAND.gold }}>
                                    {module.num}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white">{module.title}</h4>
                                    <p className="text-white/60 text-sm">{module.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* VALUE STACK + OFFER */}
            <section id="offer-section" className="py-16 md:py-20 bg-white">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <p className="font-bold text-sm uppercase tracking-wide mb-3" style={{ color: BRAND.burgundy }}>Limited Time Offer</p>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                            Everything You Need.<br />
                            <span style={{ color: BRAND.burgundy }}>One Incredible Price.</span>
                        </h2>
                    </div>

                    <div className="bg-gray-50 rounded-2xl border-2 border-gray-200 overflow-hidden">
                        {/* Value Items */}
                        {[
                            { item: "Complete 14-Module FM Certification", value: "$497", icon: "🎓" },
                            { item: "Full Certification Library (12+ Programs)", value: "$397", icon: "📚" },
                            { item: "8-Week Accountability Pod", value: "$297", icon: "👥" },
                            { item: "Private Community (Lifetime)", value: "$147", icon: "💬" },
                            { item: "ASI Practitioner Directory (1 Year)", value: "$99", icon: "🎯" },
                            { item: "DFY Practice Templates", value: "$97", icon: "📋" },
                            { item: "Career Roadmap & Income Blueprint", value: "$47", icon: "🗺️" },
                            { item: "50+ CEU/CPD Credits", value: "$197", icon: "✅" }
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
                                <span className="text-2xl font-black text-gray-400 line-through">$1,778</span>
                            </div>
                        </div>

                        {/* Final Price */}
                        <div className="p-8 text-center text-white" style={{ background: BRAND.burgundyMetallic }}>
                            <p className="text-sm opacity-80 mb-2">Join the {cohortDate} Cohort:</p>
                            <div className="flex items-center justify-center gap-4 mb-3">
                                <span className="text-2xl font-bold text-white/50 line-through">$497</span>
                                <span className="text-6xl font-black">$297</span>
                            </div>
                            <p className="text-sm opacity-70 mb-6">Only {spotsLeft} spots remaining at this price</p>

                            <Button
                                onClick={handleCheckout}
                                className="h-16 px-12 text-xl font-bold w-full md:w-auto"
                                style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                            >
                                Join the Cohort — $297
                                <ArrowRight className="ml-2 w-6 h-6" />
                            </Button>
                        </div>
                    </div>

                    <div className="text-center mt-6 flex flex-col md:flex-row items-center justify-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Secure checkout
                        </span>
                        <span className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            30-day money-back guarantee
                        </span>
                    </div>
                </div>
            </section>

            {/* INCOME PROOF */}
            <section className="py-16 md:py-20" style={{ backgroundColor: "#faf5eb" }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="font-bold text-sm uppercase tracking-wide mb-3" style={{ color: BRAND.burgundy }}>Graduate Success Stories</p>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                            They Did It. So Can You.
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { name: "Jennifer M.", age: "47", income: "$4,200/mo", before: "ICU Nurse (exhausted)", story: "I was done with 12-hour shifts watching people die. Now I help people truly heal. Best career decision I ever made.", timeline: "Now: 8 clients/month" },
                            { name: "Patricia L.", age: "52", income: "$6,800/mo", before: "Corporate HR Director", story: "Left my desk job at 47. My husband thought I was crazy. Now he's my biggest cheerleader — and we travel whenever we want.", timeline: "Now: Full-time practice" },
                            { name: "Michelle R.", age: "41", income: "$3,100/mo", before: "Stay-at-home mom", story: "Started while my kids were in school. This certification gave me purpose again — and income that's actually mine.", timeline: "Now: Part-time (20 hrs/wk)" }
                        ].map((story, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                                        <span className="font-bold text-xl" style={{ color: BRAND.burgundy }}>{story.name[0]}</span>
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">{story.name}, {story.age}</p>
                                        <p className="text-xs text-gray-500">{story.before}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm mb-4">"{story.story}"</p>
                                <div className="rounded-xl px-4 py-3" style={{ background: BRAND.goldMetallic }}>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-2xl font-black" style={{ color: BRAND.burgundyDark }}>{story.income}</p>
                                            <p className="text-xs" style={{ color: BRAND.burgundyDark }}>{story.timeline}</p>
                                        </div>
                                        <Star className="w-8 h-8" style={{ color: BRAND.burgundyDark }} fill={BRAND.burgundyDark} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* GUARANTEE */}
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
                            Enroll today. Go through the training. If within 30 days you don't feel like this
                            was worth 10x what you paid, email us and we'll refund every penny.
                            <strong> No questions. No hassle.</strong>
                        </p>

                        <p className="text-emerald-700 font-semibold">
                            The only risk is not taking action.
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 md:py-20" style={{ backgroundColor: BRAND.cream }}>
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
                        Frequently Asked Questions
                    </h2>

                    <div className="space-y-3">
                        {[
                            {
                                q: "Why is this so much cheaper than IIN or other programs?",
                                a: "We're an online-first, technology-powered platform. We don't have the overhead of physical campuses or massive marketing budgets. We pass those savings to you. Plus, we believe quality education shouldn't need a payment plan."
                            },
                            {
                                q: "Is this certification actually recognized?",
                                a: "Yes. Our certifications are issued by AccrediPro Standards Institute (ASI) and include 50+ CPD/CEU credits. Graduates are listed in our public practitioner directory with verified credentials."
                            },
                            {
                                q: "How long does it take to complete?",
                                a: "Most people complete the full certification in 8-12 weeks studying 5-10 hours per week. But it's self-paced with lifetime access, so you can go faster or slower."
                            },
                            {
                                q: "What if I have questions during the program?",
                                a: "You'll have access to your Accountability Pod (small group), the private community (12,000+ members), and our support team. You're never alone in this."
                            },
                            {
                                q: "Can I really make money with this?",
                                a: "Our graduates are earning anywhere from $1,000/month (part-time) to $10,000+/month (full-time). Module 13 & 14 specifically cover practice building — how to get clients, set rates, and market yourself."
                            },
                            {
                                q: "What's included in the Accountability Pod?",
                                a: "You'll be matched with 5-8 other students starting at the same time. Weekly check-ins, shared goals, mutual support. It's the #1 reason our completion rate is 78% (vs. 12% industry average)."
                            }
                        ].map((faq, i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-4 text-left"
                                >
                                    <span className="font-semibold text-gray-800 pr-4">{faq.q}</span>
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
                    <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-red-500/20 border border-red-400/30 mb-8">
                        <AlertTriangle className="w-5 h-5 text-red-300" />
                        <span className="text-red-200 font-medium">Only {spotsLeft} spots left for {cohortDate} cohort</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black mb-6">
                        Your New Career Starts<br />
                        <span style={{ color: BRAND.gold }}>With This Decision</span>
                    </h2>

                    <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
                        12,847 women have already made this choice.
                        Many of them are now earning $3K-$8K/month doing work they actually love.
                        <br /><br />
                        <strong className="text-white">Your cohort is waiting.</strong>
                    </p>

                    <Button
                        onClick={handleCheckout}
                        className="h-16 px-12 text-xl font-bold"
                        style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                    >
                        Join the {cohortDate} Cohort — $297
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
                    onClick={handleCheckout}
                    className="w-full h-12 text-lg font-bold"
                    style={{ background: BRAND.burgundyMetallic, color: "white" }}
                >
                    Join Cohort — $297 ({spotsLeft} spots left)
                    <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
            </div>

            <FloatingChatWidget />
        </div>
    );
}

export default function FMProPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#4e1f24" }}>
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#d4af37" }} />
            </div>
        }>
            <FMProContent />
        </Suspense>
    );
}
