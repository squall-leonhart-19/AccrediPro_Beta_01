"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
    GraduationCap, CheckCircle2, Clock, Users, Award,
    Shield, MessageCircle, BookOpen, ArrowRight,
    ChevronDown, ChevronUp, Star, Heart, Zap,
    TrendingUp, Target, Sparkles, X,
    HeartHandshake, Laptop, Quote,
    Brain, Flame, Activity, Leaf, Moon, Dumbbell,
    Stethoscope, Timer, Gift, Infinity, BadgeCheck, Globe2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { FMExitPopup, useExitIntent } from "@/components/fm-certification/exit-popup";
import { useMetaTracking } from "@/hooks/useMetaTracking";

// Student avatars
const ALL_STUDENT_AVATARS = [
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_1131.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_1136.jpeg",
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_4848-1.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_1168.jpeg",
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_0607.jpeg",
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_2733.jpeg",
    "https://accredipro.academy/wp-content/uploads/2025/12/dgp03315.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_2615.jpeg",
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_0153.jpeg",
    "https://accredipro.academy/wp-content/uploads/2025/12/MARIA-GARCIA-PIC-IMG_5435-1.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/Alternative-Health.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/AnneProfile2.jpg",
];

const TESTIMONIAL_AVATARS = [
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_1131.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/MARIA-GARCIA-PIC-IMG_5435-1.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/AnneProfile2.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_7064.jpeg",
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_3104.jpeg",
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_6694.jpeg",
];

// All 21 certificates with specializations
const CERTIFICATES = [
    { name: "Functional Medicine Foundations", icon: BookOpen, value: "Core credential" },
    { name: "Health Coaching Mastery", icon: MessageCircle, value: "Client communication" },
    { name: "Functional Assessment & Case Analysis", icon: Stethoscope, value: "Clinical skills" },
    { name: "Ethics, Scope & Professional Practice", icon: Shield, value: "Legal protection" },
    { name: "Functional Nutrition", icon: Leaf, value: "High demand", highlight: true },
    { name: "Gut Health & Microbiome", icon: Activity, value: "80% of cases", highlight: true },
    { name: "Stress, Adrenals & Nervous System", icon: Brain, value: "Burnout epidemic" },
    { name: "Sleep & Circadian Health", icon: Moon, value: "Foundation of health" },
    { name: "Women's Hormone Health", icon: Heart, value: "$150+/session", highlight: true },
    { name: "Perimenopause & Menopause", icon: Flame, value: "Massive market", highlight: true },
    { name: "Thyroid Health", icon: Zap, value: "Most misdiagnosed", highlight: true },
    { name: "Metabolic Health & Weight", icon: Dumbbell, value: "Weight loss niche" },
    { name: "Autoimmunity & Inflammation", icon: Activity, value: "Growing 15%/yr", highlight: true },
    { name: "Mental Health & Brain Function", icon: Brain, value: "Gut-brain axis" },
    { name: "Cardiometabolic Health", icon: Heart, value: "Life-saving" },
    { name: "Energy & Mitochondrial Health", icon: Sparkles, value: "Fatigue specialty" },
    { name: "Detox & Environmental Health", icon: Leaf, value: "Toxin awareness" },
    { name: "Functional Lab Interpretation", icon: Shield, value: "Premium skill" },
    { name: "Protocol Building & Program Design", icon: Target, value: "Custom protocols" },
    { name: "Building Your FM Practice", icon: TrendingUp, value: "Business launch", highlight: true },
];

// FAQ Component
const FAQItem = ({ question, answer }: { question: string; answer: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-200">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full py-5 flex items-center justify-between text-left hover:text-burgundy-700 transition-colors">
                <span className="font-medium text-slate-800 pr-4 text-lg">{question}</span>
                {isOpen ? <ChevronUp className="h-5 w-5 text-burgundy-600 shrink-0" /> : <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />}
            </button>
            {isOpen && <div className="pb-5 text-slate-600 leading-relaxed">{answer}</div>}
        </div>
    );
};

// Testimonial Card
const TestimonialCard = ({ quote, name, role, result, avatarSrc }: {
    quote: string; name: string; role: string; result?: string; avatarSrc: string
}) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <Quote className="h-6 w-6 text-burgundy-200 mb-3" />
        <p className="text-slate-700 leading-relaxed mb-4 italic">"{quote}"</p>
        {result && (
            <div className="mb-4">
                <span className="inline-flex items-center gap-1 bg-olive-50 text-olive-700 px-3 py-1 rounded-full text-sm font-medium">
                    <TrendingUp className="h-3 w-3" /> {result}
                </span>
            </div>
        )}
        <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />)}
        </div>
        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <Image src={avatarSrc} alt={name} width={48} height={48} className="w-12 h-12 rounded-full object-cover shadow-md border-2 border-white" />
            <div>
                <p className="font-semibold text-slate-800">{name}</p>
                <p className="text-sm text-slate-500">{role}</p>
            </div>
        </div>
    </div>
);

// Sticky CTA
const StickyCTA = () => {
    const [isVisible, setIsVisible] = useState(false);
    useEffect(() => {
        const handleScroll = () => setIsVisible(window.scrollY > 800);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    if (!isVisible) return null;
    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-slate-200 shadow-2xl p-3">
                <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
                    <div>
                        <p className="text-slate-400 text-xs line-through">$497</p>
                        <p className="text-xl font-black text-burgundy-700">$197</p>
                    </div>
                    <a href="https://sarah.accredipro.academy/checkout-fm-certification" className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white font-bold py-3 rounded-lg text-sm">
                            Get Certified Now <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                    </a>
                </div>
            </div>
            <div className="hidden lg:block fixed bottom-6 right-6 z-50">
                <a href="https://sarah.accredipro.academy/checkout-fm-certification">
                    <Button className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white font-bold py-4 px-6 rounded-xl shadow-2xl text-base">
                        <GraduationCap className="h-5 w-5 mr-2" />
                        Get Certified — $197
                    </Button>
                </a>
            </div>
        </>
    );
};

export default function FMCertificationPage() {
    const { showPopup, closePopup } = useExitIntent(3000);
    const { trackPageView, trackAddToCart, trackViewContent } = useMetaTracking();

    useEffect(() => {
        trackPageView("FM Certification");
        trackViewContent("FM Certification", "fm-certification");
    }, [trackPageView, trackViewContent]);

    useEffect(() => {
        if (typeof window !== "undefined" && !(window as unknown as { fbq?: unknown }).fbq) {
            const PIXEL_ID = "1287915349067829";
            const fbq = function(...args: unknown[]) {
                if ((fbq as { callMethod?: (...a: unknown[]) => void }).callMethod) {
                    (fbq as { callMethod: (...a: unknown[]) => void }).callMethod(...args);
                } else {
                    ((fbq as { queue?: unknown[] }).queue = (fbq as { queue?: unknown[] }).queue || []).push(args);
                }
            };
            (fbq as { push: typeof fbq }).push = fbq;
            (fbq as { loaded: boolean }).loaded = true;
            (fbq as { version: string }).version = "2.0";
            (fbq as { queue: unknown[] }).queue = [];
            (window as unknown as Record<string, unknown>).fbq = fbq;
            (window as unknown as Record<string, unknown>)._fbq = fbq;
            const script = document.createElement("script");
            script.async = true;
            script.src = "https://connect.facebook.net/en_US/fbevents.js";
            document.head.appendChild(script);
            fbq("init", PIXEL_ID);
            fbq("track", "PageView");
            fbq("track", "ViewContent", { content_name: "FM Certification", content_ids: ["fm-certification"], content_type: "product", value: 197, currency: "USD" });
        }
    }, []);

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const link = target.closest('a[href*="checkout-fm-certification"]');
            if (link) {
                trackAddToCart("FM Certification", 197, "fm-certification");
                const fbq = (window as unknown as { fbq?: (...args: unknown[]) => void }).fbq;
                if (fbq) {
                    fbq("track", "AddToCart", { value: 197, currency: "USD", content_name: "FM Certification", content_ids: ["fm-certification"] });
                }
            }
        };
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, [trackAddToCart]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-cream-100 via-cream-50 to-white pb-20 lg:pb-0">
            <StickyCTA />
            <FMExitPopup isOpen={showPopup} onClose={closePopup} />

            <style jsx global>{`
                @keyframes slide-up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
            `}</style>

            {/* Urgency Banner */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm">
                    <span className="font-bold">Christmas Special: Save $300!</span>
                    <span className="hidden sm:block">|</span>
                    <span className="flex items-center gap-2"><Timer className="h-4 w-4" />Ends December 26th</span>
                    <span className="hidden sm:block">|</span>
                    <span className="font-semibold text-yellow-300">Only 23 spots left</span>
                </div>
            </div>

            {/* ============================================ */}
            {/* HERO SECTION */}
            {/* ============================================ */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-burgundy-100/40 via-transparent to-transparent" />

                <div className="relative max-w-6xl mx-auto px-4 pt-10 pb-12 sm:pt-14 sm:pb-16">
                    {/* Target Audience */}
                    <div className="flex justify-center mb-4">
                        <div className="inline-flex items-center gap-2 bg-burgundy-50 border border-burgundy-200 rounded-full px-4 py-2 shadow-sm">
                            <Stethoscope className="h-4 w-4 text-burgundy-600" />
                            <span className="text-sm font-semibold text-burgundy-700">For Healthcare Professionals Ready for Change</span>
                        </div>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-slate-900 mb-4 leading-tight">
                        Become a <span className="text-burgundy-700">Certified Functional Medicine Practitioner</span> in 4-8 Weeks
                    </h1>

                    {/* Subheadline */}
                    <p className="text-lg sm:text-xl text-center text-slate-700 mb-6 max-w-3xl mx-auto">
                        Start earning <span className="font-bold text-olive-700">$100+ per session</span> helping patients actually heal — without quitting your job or spending $15,000 on traditional certifications.
                    </p>

                    {/* Accreditation Logos */}
                    <div className="flex justify-center mb-6">
                        <Image src="/all-logos.png" alt="Accredited by 9 International Organizations" width={600} height={60} className="h-10 sm:h-12 w-auto opacity-80" />
                    </div>

                    {/* VSL Video */}
                    <div className="max-w-3xl mx-auto mb-6">
                        <div className="rounded-2xl overflow-hidden shadow-2xl border-4 border-white" style={{ padding: "56.25% 0 0 0", position: "relative" }}>
                            <iframe
                                src="https://player.vimeo.com/video/1134216854?badge=0&autopause=0&player_id=0&app_id=58479"
                                frameBorder="0"
                                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                                referrerPolicy="strict-origin-when-cross-origin"
                                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
                                title="VSL"
                            />
                        </div>
                    </div>

                    {/* $10K/Month Math - INLINE */}
                    <div className="max-w-4xl mx-auto mb-8">
                        <p className="text-center text-slate-600 text-sm mb-4">How Practitioners Reach $10K/Month — Simple Math:</p>
                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-white rounded-xl p-4 text-center border border-olive-100 shadow-sm">
                                <p className="text-olive-700 font-bold">10 clients</p>
                                <p className="text-slate-500 text-xs">× $1,000 programs</p>
                                <p className="text-xl font-black text-olive-600 mt-1">= $10K/mo</p>
                                <p className="text-[10px] text-slate-400 mt-1">3-month packages</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 text-center border border-olive-100 shadow-sm">
                                <p className="text-olive-700 font-bold">20 sessions</p>
                                <p className="text-slate-500 text-xs">× $125/week each</p>
                                <p className="text-xl font-black text-olive-600 mt-1">= $10K/mo</p>
                                <p className="text-[10px] text-slate-400 mt-1">Weekly 1:1 clients</p>
                            </div>
                            <div className="bg-white rounded-xl p-4 text-center border border-olive-100 shadow-sm">
                                <p className="text-olive-700 font-bold">15 clients</p>
                                <p className="text-slate-500 text-xs">× $750 group</p>
                                <p className="text-xl font-black text-olive-600 mt-1">= $11K/mo</p>
                                <p className="text-[10px] text-slate-400 mt-1">One group launch</p>
                            </div>
                        </div>
                    </div>

                    {/* CTA */}
                    <div className="flex flex-col items-center justify-center gap-4 mb-6">
                        <a href="https://sarah.accredipro.academy/checkout-fm-certification">
                            <Button className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-bold py-6 px-10 rounded-xl text-lg shadow-xl">
                                <GraduationCap className="h-5 w-5 mr-2" />
                                Start Your Certification Now
                                <ArrowRight className="h-5 w-5 ml-2" />
                            </Button>
                        </a>
                        <div className="text-center">
                            <p className="text-lg font-bold text-slate-800">
                                <span className="line-through text-slate-400 text-base">$497</span>
                                <span className="text-burgundy-700 ml-2">$197</span>
                                <span className="text-slate-500 text-sm ml-2">one-time</span>
                            </p>
                            <p className="text-sm text-slate-500">or 2 × $109/month</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><Shield className="h-4 w-4 text-olive-600" />30-day guarantee</span>
                        <span className="flex items-center gap-1"><Infinity className="h-4 w-4 text-olive-600" />Lifetime access</span>
                        <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-olive-600" />Self-paced</span>
                    </div>
                </div>
            </section>

            {/* ============================================ */}
            {/* YOUR MASTER CREDENTIAL - Certificate with Name */}
            {/* ============================================ */}
            <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-cream-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-8">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide text-sm">Your Master Credential</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
                            Your Name on an <span className="text-burgundy-700">Official Certificate</span>
                        </h2>
                        <p className="text-lg text-slate-600">Certified Functional Medicine Practitioner — verified and recognized worldwide.</p>
                    </div>

                    {/* Certificate Image */}
                    <div className="max-w-2xl mx-auto mb-10">
                        <Image
                            src="/FUNCTIONAL_MEDICINE_CERTIFICATE.webp"
                            alt="Your Functional Medicine Practitioner Certificate"
                            width={1080}
                            height={700}
                            className="w-full h-auto rounded-2xl shadow-2xl border-4 border-white"
                        />
                    </div>

                    {/* All Certificates Checklist */}
                    <div className="mb-10">
                        <h3 className="text-xl font-bold text-slate-900 text-center mb-6">
                            <CheckCircle2 className="h-6 w-6 text-olive-600 inline mr-2" />
                            All 21 Certificates You&apos;ll Earn
                        </h3>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {CERTIFICATES.map((cert, i) => (
                                <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${cert.highlight ? 'bg-burgundy-50 border border-burgundy-200' : 'bg-white border border-slate-100'}`}>
                                    <CheckCircle2 className={`h-5 w-5 shrink-0 ${cert.highlight ? 'text-burgundy-600' : 'text-olive-600'}`} />
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-slate-900 text-sm truncate">{cert.name}</p>
                                        {cert.highlight && <p className="text-xs text-burgundy-600 font-medium">{cert.value}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-slate-100">
                            <p className="text-3xl font-bold text-burgundy-700">22</p>
                            <p className="text-sm text-slate-600">Total Certifications</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-slate-100">
                            <p className="text-3xl font-bold text-burgundy-700">80+</p>
                            <p className="text-sm text-slate-600">CEU Hours</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-slate-100">
                            <p className="text-3xl font-bold text-burgundy-700">9</p>
                            <p className="text-sm text-slate-600">Accreditation Bodies</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 text-center shadow-sm border border-slate-100">
                            <p className="text-3xl font-bold text-burgundy-700">Lifetime</p>
                            <p className="text-sm text-slate-600">Validity</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================ */}
            {/* EMOTIONAL BENEFITS - What This Means For You */}
            {/* ============================================ */}
            <section className="py-12 sm:py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">What This Means For You</h2>
                        <p className="text-lg text-slate-600">This certification changes everything.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                        <div className="bg-gradient-to-br from-olive-50 to-white rounded-2xl p-6 border border-olive-200">
                            <div className="w-12 h-12 rounded-xl bg-olive-100 flex items-center justify-center mb-4">
                                <HeartHandshake className="h-6 w-6 text-olive-600" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg mb-2">Be Present With Your Kids</h3>
                            <p className="text-slate-600">Work from home on your schedule. No more missing school events or bedtime. Build your practice around your family — not the other way around.</p>
                        </div>

                        <div className="bg-gradient-to-br from-burgundy-50 to-white rounded-2xl p-6 border border-burgundy-200">
                            <div className="w-12 h-12 rounded-xl bg-burgundy-100 flex items-center justify-center mb-4">
                                <Heart className="h-6 w-6 text-burgundy-600" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg mb-2">Escape the Burnout</h3>
                            <p className="text-slate-600">No more 12-hour shifts. No more feeling powerless as patients cycle through symptoms. Actually help people heal — and feel fulfilled doing it.</p>
                        </div>

                        <div className="bg-gradient-to-br from-gold-50 to-white rounded-2xl p-6 border border-gold-200">
                            <div className="w-12 h-12 rounded-xl bg-gold-100 flex items-center justify-center mb-4">
                                <TrendingUp className="h-6 w-6 text-gold-600" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg mb-2">Earn $100+ Per Session</h3>
                            <p className="text-slate-600">Cash-pay clients. No insurance hassles. Set your own rates. Our graduates charge $125-$250+ per session and fill their calendars.</p>
                        </div>

                        <div className="bg-gradient-to-br from-cream-50 to-white rounded-2xl p-6 border border-cream-200">
                            <div className="w-12 h-12 rounded-xl bg-cream-100 flex items-center justify-center mb-4">
                                <Brain className="h-6 w-6 text-burgundy-600" />
                            </div>
                            <h3 className="font-bold text-slate-900 text-lg mb-2">End the Emotional Pain</h3>
                            <p className="text-slate-600">Stop feeling stuck, undervalued, and exhausted. Rediscover why you got into healthcare. This is the career pivot you&apos;ve been waiting for.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================ */}
            {/* MARKET COMPARISON */}
            {/* ============================================ */}
            <section className="py-12 sm:py-16 bg-cream-50">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Market Comparison</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Why AccrediPro is the New Frontier</h2>
                        <p className="text-lg text-slate-600">See how we compare to other leading Functional Medicine certification programs.</p>
                    </div>

                    <div className="overflow-x-auto bg-white rounded-2xl shadow-xl border border-slate-200">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-burgundy-700 text-white">
                                    <th className="px-4 py-4 font-semibold rounded-tl-xl">Feature</th>
                                    <th className="px-4 py-4 font-bold text-center bg-burgundy-600">
                                        <span className="text-gold-400">AccrediPro</span>
                                        <span className="block text-sm font-normal text-burgundy-200">$197</span>
                                    </th>
                                    <th className="px-4 py-4 font-semibold text-center">
                                        FMCA
                                        <span className="block text-sm font-normal text-burgundy-200">$7,200+</span>
                                    </th>
                                    <th className="px-4 py-4 font-semibold text-center">
                                        IFM
                                        <span className="block text-sm font-normal text-burgundy-200">$15,000+</span>
                                    </th>
                                    <th className="px-4 py-4 font-semibold text-center rounded-tr-xl">
                                        IIN
                                        <span className="block text-sm font-normal text-burgundy-200">$6,499</span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {[
                                    { feature: "Investment", ap: "$197", fmca: "$7,200+", ifm: "$15,000+", iin: "$6,499" },
                                    { feature: "Specialty Certificates", ap: "21 Certs", fmca: "1", ifm: "1", iin: "1" },
                                    { feature: "1:1 Personal Mentorship", ap: true, fmca: false, ifm: false, iin: false },
                                    { feature: "Coach Workspace (CRM)", ap: true, fmca: false, ifm: false, iin: false },
                                    { feature: "Lifetime Access", ap: true, fmca: "1 Year", ifm: "Event", iin: "1 Year" },
                                    { feature: "CEU Hours", ap: "80+", fmca: "40-50", ifm: "Varies", iin: "Varies" },
                                    { feature: "Self-Paced", ap: true, fmca: "Cohort", ifm: "In-person", iin: "Cohort" },
                                    { feature: "Money-Back Guarantee", ap: "30 days", fmca: "7 days", ifm: "None", iin: "7 days" },
                                ].map((row, i) => (
                                    <tr key={i} className={`border-b border-slate-100 ${i % 2 === 0 ? 'bg-white' : 'bg-cream-50'}`}>
                                        <td className="px-4 py-3 font-medium text-slate-800">{row.feature}</td>
                                        <td className="px-4 py-3 text-center bg-burgundy-50/50">
                                            {typeof row.ap === 'boolean' ? (
                                                row.ap ? <CheckCircle2 className="h-5 w-5 text-olive-600 mx-auto" /> : <X className="h-5 w-5 text-red-400 mx-auto" />
                                            ) : (
                                                <span className="font-semibold text-burgundy-700">{row.ap}</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center text-slate-600">
                                            {typeof row.fmca === 'boolean' ? (row.fmca ? <CheckCircle2 className="h-5 w-5 text-olive-600 mx-auto" /> : <X className="h-5 w-5 text-red-400 mx-auto" />) : row.fmca}
                                        </td>
                                        <td className="px-4 py-3 text-center text-slate-600">
                                            {typeof row.ifm === 'boolean' ? (row.ifm ? <CheckCircle2 className="h-5 w-5 text-olive-600 mx-auto" /> : <X className="h-5 w-5 text-red-400 mx-auto" />) : row.ifm}
                                        </td>
                                        <td className="px-4 py-3 text-center text-slate-600">
                                            {typeof row.iin === 'boolean' ? (row.iin ? <CheckCircle2 className="h-5 w-5 text-olive-600 mx-auto" /> : <X className="h-5 w-5 text-red-400 mx-auto" />) : row.iin}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>

            {/* ============================================ */}
            {/* COACH WORKSPACE */}
            {/* ============================================ */}
            <section className="py-12 sm:py-16 bg-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="bg-gradient-to-br from-slate-900 to-burgundy-900 rounded-3xl p-8 sm:p-12 text-white overflow-hidden relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-burgundy-700/20 rounded-full -mr-32 -mt-32" />
                        <div className="relative">
                            <div className="flex items-center gap-2 mb-4">
                                <Laptop className="h-6 w-6 text-gold-400" />
                                <span className="text-gold-400 font-semibold uppercase tracking-wide text-sm">Included: Coach Workspace</span>
                            </div>
                            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Run Your Entire Practice From One Dashboard</h2>
                            <p className="text-lg text-burgundy-200 mb-8 max-w-2xl">
                                Most coaches pay $50-$200/month for separate CRM tools. Yours is built-in — professional from day one.
                            </p>

                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { icon: Users, title: "Client Management", desc: "Track all clients in one place" },
                                    { icon: Target, title: "Protocol Builder", desc: "Create custom health plans" },
                                    { icon: Clock, title: "Scheduling", desc: "Book appointments easily" },
                                    { icon: TrendingUp, title: "Progress Tracking", desc: "Monitor client results" },
                                ].map((feature, i) => (
                                    <div key={i} className="bg-white/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                                        <feature.icon className="h-6 w-6 text-gold-400 mb-2" />
                                        <p className="font-semibold text-white text-sm">{feature.title}</p>
                                        <p className="text-xs text-burgundy-200">{feature.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================ */}
            {/* TESTIMONIALS */}
            {/* ============================================ */}
            <section className="py-12 sm:py-16 bg-cream-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Success Stories</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Real Results From Real Practitioners</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <TestimonialCard
                            quote="I went from burnt-out ER nurse to earning $6,200/month part-time. I'm finally present for my kids and doing work that matters."
                            name="Jennifer M."
                            role="Former ER Nurse, Texas"
                            result="$6,200/mo part-time"
                            avatarSrc={TESTIMONIAL_AVATARS[0]}
                        />
                        <TestimonialCard
                            quote="At 52, I thought it was too late to pivot. Now I have 18 clients and charge $150/session. Best decision I ever made."
                            name="Patricia L."
                            role="Former PA, California"
                            result="$150/session"
                            avatarSrc={TESTIMONIAL_AVATARS[1]}
                        />
                        <TestimonialCard
                            quote="The mentorship made all the difference. Sarah personally guided me through every module. I had my first paying client within 3 weeks."
                            name="Amanda R."
                            role="Health Coach, Florida"
                            result="First client in 3 weeks"
                            avatarSrc={TESTIMONIAL_AVATARS[2]}
                        />
                        <TestimonialCard
                            quote="I added functional medicine to my practice and increased revenue by $8K/month. My patients are actually getting better."
                            name="Dr. Karen W."
                            role="Integrative MD, Arizona"
                            result="+$8K/mo revenue"
                            avatarSrc={TESTIMONIAL_AVATARS[3]}
                        />
                        <TestimonialCard
                            quote="The 21 specialty certificates let me niche into thyroid and hormones. Now I'm booked 6 weeks out charging premium rates."
                            name="Michelle S."
                            role="Thyroid Specialist, Colorado"
                            result="Booked 6 weeks out"
                            avatarSrc={TESTIMONIAL_AVATARS[4]}
                        />
                        <TestimonialCard
                            quote="I was skeptical at $197 but the value is insane. Coach Workspace alone saves me $150/month. The certificates opened so many doors."
                            name="Linda K."
                            role="Wellness Coach, Ohio"
                            result="Saves $150/mo on tools"
                            avatarSrc={TESTIMONIAL_AVATARS[5]}
                        />
                    </div>
                </div>
            </section>

            {/* ============================================ */}
            {/* BONUSES */}
            {/* ============================================ */}
            <section className="py-12 sm:py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 bg-gold-100 border border-gold-300 rounded-full px-4 py-2 mb-4">
                            <Gift className="h-4 w-4 text-gold-600" />
                            <span className="text-sm font-bold text-gold-800">INCLUDED BONUSES</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Everything You Get Today</h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            { title: "21-Module Clinical Training (168 Lessons)", value: "$2,497" },
                            { title: "22 Verifiable Certificates", value: "$1,100" },
                            { title: "80+ CEU Hours", value: "$400" },
                            { title: "Personal 1:1 Mentorship", value: "$997" },
                            { title: "Coach Workspace (Practice CRM)", value: "$1,200/yr" },
                            { title: "18 Proprietary Protocols", value: "$497" },
                            { title: "Career Launch Toolkit", value: "$297" },
                            { title: "Private Community Access", value: "$197/yr" },
                        ].map((item, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-cream-50 rounded-xl border border-cream-200">
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-olive-600 shrink-0" />
                                    <span className="font-medium text-slate-900">{item.title}</span>
                                </div>
                                <span className="font-bold text-burgundy-600">{item.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-slate-600 mb-2">Total Value: <span className="line-through">$7,185+</span></p>
                        <p className="text-4xl font-black text-burgundy-700">Your Price: $197</p>
                        <p className="text-olive-600 font-semibold mt-2">Save $300 — Christmas Special</p>
                    </div>

                    <div className="mt-8 text-center">
                        <a href="https://sarah.accredipro.academy/checkout-fm-certification">
                            <Button className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-bold py-6 px-10 rounded-xl text-lg shadow-xl">
                                <GraduationCap className="h-5 w-5 mr-2" />
                                Start My Certification — $197
                            </Button>
                        </a>
                        <p className="text-sm text-slate-500 mt-4">or 2 × $109/month • 30-day money-back guarantee</p>
                    </div>
                </div>
            </section>

            {/* ============================================ */}
            {/* FAQ */}
            {/* ============================================ */}
            <section className="py-12 sm:py-16 bg-cream-50">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Frequently Asked Questions</h2>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 px-6">
                        <FAQItem
                            question="How long does the certification take?"
                            answer={<>Most students complete in <strong>4-8 weeks</strong> studying 3-5 hours per week. You have <strong>lifetime access</strong> — go at your pace.</>}
                        />
                        <FAQItem
                            question="Do I really get 21 separate certificates?"
                            answer={<>Yes! Each module awards its own specialty certificate plus the master <strong>Certified Functional Medicine Practitioner</strong> credential. 22 total.</>}
                        />
                        <FAQItem
                            question="Can I work with clients after certification?"
                            answer={<>Absolutely. Many graduates get their first paying client within <strong>2-4 weeks</strong> of finishing. Your coach helps with pricing and marketing.</>}
                        />
                        <FAQItem
                            question="Is $197 really the full price?"
                            answer={<><strong>Yes. $197 is the full price. No upsells required.</strong> Advanced coaching is optional. Plus <strong>30-day money-back guarantee</strong>.</>}
                        />
                        <FAQItem
                            question="How much can I earn?"
                            answer={<>Our graduates earn <strong>$5K-$8K/month part-time</strong>, <strong>$10K-$15K/month full-time</strong>. Session rates range from $125-$250+.</>}
                        />
                        <FAQItem
                            question="What's the Coach Workspace?"
                            answer={<>A professional client management system built into your dashboard. <strong>Track clients, create protocols, manage appointments</strong> — all in one place.</>}
                        />
                    </div>
                </div>
            </section>

            {/* ============================================ */}
            {/* GUARANTEE */}
            {/* ============================================ */}
            <section className="py-12 sm:py-16">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <div className="bg-gradient-to-br from-olive-50 to-white rounded-3xl p-8 border-2 border-olive-200">
                        <Image
                            src="https://coach.accredipro.academy/wp-content/uploads/2025/10/Senza-titolo-Logo-1.png"
                            alt="AccrediPro Academy"
                            width={80}
                            height={80}
                            className="mx-auto mb-4"
                        />
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">100% Money-Back Guarantee</h2>
                        <p className="text-slate-600 mb-4">
                            Enroll today, explore the content, meet your coach. If it&apos;s not right for you, email us within 30 days for a full refund. No questions asked.
                        </p>
                        <p className="text-xl font-bold text-olive-700">Your investment is completely protected.</p>
                    </div>
                </div>
            </section>

            {/* ============================================ */}
            {/* FOOTER - Disclaimer Only */}
            {/* ============================================ */}
            <footer className="bg-slate-900 text-white py-8">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <p className="text-sm text-slate-400 leading-relaxed">
                        This site is not a part of the Facebook website or Facebook Inc. Additionally, this site is NOT endorsed by Facebook in any way.
                        FACEBOOK is a trademark of FACEBOOK, Inc. Results vary based on effort, background, and dedication.
                        Income examples represent goals of certified practitioners — not guarantees.
                    </p>
                    <p className="text-xs text-slate-500 mt-4">© 2025 AccrediPro Academy. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
