"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
    GraduationCap, CheckCircle2, Clock, Users, Award,
    Shield, MessageCircle, BookOpen, DollarSign, ArrowRight,
    ChevronDown, ChevronUp, Star, Heart, Zap,
    TrendingUp, Target, Lock, Play, Sparkles,
    Gift, HeartHandshake, FileCheck, Laptop, BadgeCheck, Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Real student profile images from accredipro.academy
const STUDENT_AVATARS = [
    "https://accredipro.academy/wp-content/uploads/2025/12/AI_Headshot_Generator-13.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/LeezaRhttilthead.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/Head-shot-dark-background-1.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/Profile-Pic.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/MICHELLEM047.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/AnneProfile2.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/MARIA-GARCIA-PIC-IMG_5435-1.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_3542-Profile-Picture-Updated.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/dgp03315.jpg",
];

// 9 Accreditation bodies
const ACCREDITATIONS = [
    { abbr: "CMA", name: "Complementary Medical Association" },
    { abbr: "IPHM", name: "International Practitioners of Holistic Medicine" },
    { abbr: "CPD", name: "CPD Certification Service" },
    { abbr: "IAOTH", name: "International Association of Therapists" },
    { abbr: "ICAHP", name: "Int'l Community for Alternative & Holistic Professionals" },
    { abbr: "IGCT", name: "International Guild of Complementary Therapists" },
    { abbr: "CTAA", name: "Complementary Therapists Accredited Association" },
    { abbr: "IHTCP", name: "Int'l Holistic Therapists & Course Providers" },
    { abbr: "IIOHT", name: "International Institute of Holistic Therapists" },
];

// Certificate Component with Accreditations
const CertificatePreview = ({ name = "Jennifer Martinez" }: { name?: string }) => (
    <div className="relative bg-white rounded-lg shadow-2xl overflow-hidden border-4 border-gold-300 max-w-lg mx-auto transform hover:scale-[1.02] transition-transform duration-300">
        {/* Certificate Border Design */}
        <div className="absolute inset-0 border-8 border-gold-100 m-2 pointer-events-none" />

        {/* Certificate Content */}
        <div className="relative p-6 sm:p-8 text-center bg-gradient-to-b from-gold-50/50 to-white">
            {/* Header Ornament */}
            <div className="flex justify-center mb-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-burgundy-600 to-burgundy-800 flex items-center justify-center shadow-lg ring-4 ring-gold-300">
                    <GraduationCap className="h-8 w-8 text-gold-400" />
                </div>
            </div>

            {/* Title */}
            <p className="text-xs uppercase tracking-[0.3em] text-burgundy-600 font-medium mb-1">AccrediPro Academy</p>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-800 mb-1">Mini Diploma</h3>
            <p className="text-sm text-burgundy-600 font-medium mb-4">Functional Medicine Foundations</p>

            {/* Decorative Line */}
            <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-gold-400" />
                <div className="w-2 h-2 rotate-45 bg-gold-400" />
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-gold-400" />
            </div>

            {/* Certifies */}
            <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">This certifies that</p>
            <p className="text-2xl sm:text-3xl font-serif font-bold text-burgundy-700 mb-3">{name}</p>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4 max-w-sm mx-auto">
                has successfully completed the Functional Medicine Mini Diploma program, demonstrating foundational knowledge in root-cause health principles.
            </p>

            {/* Accreditation Badges */}
            <div className="mb-4 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
                <p className="text-xs font-semibold text-emerald-700 mb-2 uppercase tracking-wide">From AccrediPro Academy • Internationally Recognized</p>
                <div className="flex flex-wrap justify-center gap-1">
                    {ACCREDITATIONS.map((acc) => (
                        <span key={acc.abbr} className="px-2 py-0.5 bg-white border border-emerald-200 rounded text-xs font-bold text-emerald-700 shadow-sm">
                            {acc.abbr}
                        </span>
                    ))}
                </div>
            </div>

            {/* Date & Signature */}
            <div className="flex justify-between items-end px-4 mb-3">
                <div className="text-left">
                    <p className="text-xs text-slate-500 mb-1">Date Issued</p>
                    <p className="text-sm font-medium text-slate-700">December 2025</p>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-500 mb-1">Program Director</p>
                    <p className="font-serif italic text-burgundy-700">Sarah Mitchell</p>
                </div>
            </div>

            {/* Verification Badge */}
            <div className="pt-3 border-t border-gold-200">
                <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
                    <Shield className="h-4 w-4 text-emerald-600" />
                    <span>Credential ID: APR-FM-2025-84721</span>
                </div>
            </div>
        </div>
    </div>
);

// FAQ Component
const FAQItem = ({ question, answer }: { question: string; answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-5 flex items-center justify-between text-left hover:text-burgundy-700 transition-colors"
            >
                <span className="font-medium text-slate-800 pr-4 text-lg">{question}</span>
                {isOpen ? (
                    <ChevronUp className="h-5 w-5 text-burgundy-600 shrink-0" />
                ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400 shrink-0" />
                )}
            </button>
            {isOpen && (
                <div className="pb-5 text-slate-600 leading-relaxed">
                    {answer}
                </div>
            )}
        </div>
    );
};

// Testimonial Component - with real student images
const Testimonial = ({ quote, name, role, highlight, avatarIndex = 0 }: { quote: string; name: string; role: string; highlight?: string; avatarIndex?: number }) => (
    <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-burgundy-200 transition-all group">
        <Quote className="h-6 w-6 sm:h-8 sm:w-8 text-burgundy-200 mb-2 sm:mb-3 group-hover:text-burgundy-300 transition-colors" />
        <p className="text-slate-700 leading-relaxed mb-3 sm:mb-4 text-sm sm:text-base">
            {quote}
            {highlight && <span className="font-semibold text-burgundy-700"> {highlight}</span>}
        </p>
        <div className="flex gap-1 mb-3 sm:mb-4">
            {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 sm:h-4 sm:w-4 fill-gold-400 text-gold-400" />
            ))}
        </div>
        <div className="flex items-center gap-3 pt-3 sm:pt-4 border-t border-slate-100">
            <Image
                src={STUDENT_AVATARS[avatarIndex % STUDENT_AVATARS.length]}
                alt={name}
                width={48}
                height={48}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shadow-md border-2 border-white"
            />
            <div>
                <p className="font-semibold text-slate-800 text-sm sm:text-base">{name}</p>
                <p className="text-xs sm:text-sm text-slate-500">{role}</p>
            </div>
        </div>
    </div>
);

// Success Story Component - For detailed mirror neuron stories
const SuccessStory = ({
    name,
    age,
    location,
    before,
    after,
    quote,
    income,
    avatarIndex = 0
}: {
    name: string;
    age: number;
    location: string;
    before: string;
    after: string;
    quote: string;
    income: string;
    avatarIndex?: number;
}) => (
    <div className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl transition-shadow">
        {/* Header */}
        <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 p-4 sm:p-5 text-white">
            <div className="flex items-center gap-3 sm:gap-4">
                <Image
                    src={STUDENT_AVATARS[avatarIndex % STUDENT_AVATARS.length]}
                    alt={name}
                    width={64}
                    height={64}
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover shadow-lg ring-4 ring-white/30"
                />
                <div>
                    <p className="font-bold text-base sm:text-lg">{name}, {age}</p>
                    <p className="text-burgundy-200 text-xs sm:text-sm">{location}</p>
                </div>
            </div>
        </div>

        {/* Content */}
        <div className="p-6">
            {/* Before/After */}
            <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                    <p className="text-xs uppercase tracking-wide text-red-600 font-semibold mb-1">Before</p>
                    <p className="text-sm text-slate-700">{before}</p>
                </div>
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                    <p className="text-xs uppercase tracking-wide text-emerald-600 font-semibold mb-1">After</p>
                    <p className="text-sm text-slate-700">{after}</p>
                </div>
            </div>

            {/* Quote */}
            <blockquote className="text-slate-600 italic mb-4 pl-4 border-l-4 border-burgundy-200">
                "{quote}"
            </blockquote>

            {/* Income Badge */}
            <div className="bg-gradient-to-r from-gold-50 to-gold-100 rounded-xl p-4 flex items-center justify-between border border-gold-200">
                <span className="text-gold-800 font-medium">Now earning:</span>
                <span className="text-2xl font-black text-gold-600">{income}</span>
            </div>
        </div>
    </div>
);

// Recent Enrollment Toast Component
const RecentEnrollmentToast = () => {
    const [visible, setVisible] = useState(false);
    const [currentEnrollment, setCurrentEnrollment] = useState(0);

    const enrollments = [
        { name: 'Sarah K.', location: 'Texas', time: '2 min ago', avatarIndex: 0 },
        { name: 'Michelle R.', location: 'California', time: '5 min ago', avatarIndex: 4 },
        { name: 'Jennifer L.', location: 'Florida', time: '8 min ago', avatarIndex: 7 },
        { name: 'Amanda P.', location: 'New York', time: '12 min ago', avatarIndex: 5 },
        { name: 'Lisa M.', location: 'Ohio', time: '15 min ago', avatarIndex: 1 },
        { name: 'Maria G.', location: 'Arizona', time: '18 min ago', avatarIndex: 6 },
        { name: 'Anne B.', location: 'Georgia', time: '22 min ago', avatarIndex: 5 },
        { name: 'Rachel T.', location: 'Colorado', time: '25 min ago', avatarIndex: 3 },
    ];

    useEffect(() => {
        // Show first notification after 8 seconds
        const initialTimeout = setTimeout(() => {
            setVisible(true);
            // Hide after 4 seconds
            setTimeout(() => setVisible(false), 4000);
        }, 8000);

        // Then show every 25-40 seconds
        const interval = setInterval(() => {
            setCurrentEnrollment(prev => (prev + 1) % enrollments.length);
            setVisible(true);
            setTimeout(() => setVisible(false), 4000);
        }, Math.random() * 15000 + 25000);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, []);

    if (!visible) return null;

    const enrollment = enrollments[currentEnrollment];

    return (
        <div className="fixed bottom-24 left-4 z-40 animate-slide-up lg:bottom-4">
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-3 sm:p-4 flex items-center gap-3 max-w-[280px] sm:max-w-sm">
                <Image
                    src={STUDENT_AVATARS[enrollment.avatarIndex]}
                    alt={enrollment.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover shadow-sm border-2 border-white shrink-0"
                />
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{enrollment.name} from {enrollment.location}</p>
                    <p className="text-xs text-slate-500">Just enrolled • {enrollment.time}</p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
            </div>
        </div>
    );
};

// Sticky Mobile CTA Component
const StickyMobileCTA = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling 500px
            setIsVisible(window.scrollY > 500);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-slate-200 shadow-2xl p-4 animate-slide-up">
            <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
                <div>
                    <p className="text-slate-500 text-xs line-through">$47</p>
                    <p className="text-2xl font-black text-burgundy-700">$27 <span className="text-xs text-red-600 font-bold">🎄 -$20</span></p>
                </div>
                <a href="https://sarah.accredipro.academy/fm-mini-diploma-access" className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-bold py-4 rounded-xl">
                        Get Certified — $27
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </a>
            </div>
        </div>
    );
};

// Trust Banner Component (replaces countdown)
const TrustBanner = () => {
    return (
        <div className="bg-gradient-to-r from-burgundy-700 to-burgundy-800 text-white py-3 px-4">
            <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm">
                <span className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-emerald-400" />
                    <span className="font-medium">From AccrediPro Academy</span>
                </span>
                <span className="hidden sm:block text-burgundy-300">•</span>
                <span className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-gold-400" />
                    <span className="font-medium">Recognized by 9 International Bodies</span>
                </span>
                <span className="hidden sm:block text-burgundy-300">•</span>
                <span className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-burgundy-200" />
                    <span className="font-medium">843+ Graduates</span>
                </span>
            </div>
        </div>
    );
};

export default function FMMiniDiplomaPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-rose-50 via-white to-slate-50 pb-20 lg:pb-0">
            {/* Sticky Mobile CTA */}
            <StickyMobileCTA />

            {/* Recent Enrollment Toast */}
            <RecentEnrollmentToast />

            {/* Custom animation for slide-up */}
            <style jsx global>{`
                @keyframes slide-up {
                    from {
                        transform: translateY(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateY(0);
                        opacity: 1;
                    }
                }
                .animate-slide-up {
                    animation: slide-up 0.3s ease-out forwards;
                }
            `}</style>

            {/* Christmas Discount Banner */}
            <div className="bg-gradient-to-r from-red-600 via-red-500 to-green-600 text-white py-2.5 px-4">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm">
                    <span className="flex items-center gap-2 font-bold">
                        <span className="text-lg">🎄</span>
                        Christmas Discount: Save $20!
                    </span>
                    <span className="hidden sm:block text-white/60">|</span>
                    <span className="text-white/90">
                        Until <strong>26 December</strong>
                    </span>
                    <span className="hidden sm:block text-white/60">|</span>
                    <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                        Only 17 spots left (I mentor each student personally)
                    </span>
                </div>
            </div>

            {/* Trustpilot Widget */}
            <div className="bg-white py-2 border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-4 flex items-center justify-center">
                    <div
                        className="trustpilot-widget"
                        data-locale="en-US"
                        data-template-id="5419b6ffb0d04a076446a9af"
                        data-businessunit-id="68c1ac85e89f387ad19f7817"
                        data-style-height="20px"
                        data-style-width="100%"
                        data-token="e33169fc-3158-4c67-94f8-c774e5035e30"
                    >
                        <a href="https://www.trustpilot.com/review/accredipro.academy" target="_blank" rel="noopener noreferrer">Trustpilot</a>
                    </div>
                </div>
            </div>

            {/* Trust Banner */}
            <TrustBanner />

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-burgundy-100/40 via-transparent to-transparent" />

                <div className="relative max-w-6xl mx-auto px-4 pt-12 pb-16 sm:pt-16 sm:pb-20">
                    {/* Badge */}
                    <div className="flex justify-center mb-6">
                        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-burgundy-200 rounded-full px-5 py-2.5 shadow-sm">
                            <MessageCircle className="h-4 w-4 text-burgundy-600" />
                            <span className="text-sm font-medium text-burgundy-700">100% Interactive Coaching Experience</span>
                        </div>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center text-slate-900 mb-5 leading-tight">
                        Become a Functional Medicine<br />
                        <span className="text-burgundy-700">Health Coach</span>
                    </h1>

                    {/* Subheadline */}
                    <p className="text-xl sm:text-2xl text-center text-slate-600 mb-6 max-w-3xl mx-auto">
                        Start earning <span className="font-bold text-slate-800">$50-$150/hr</span> helping people fix what doctors miss.
                        <br />
                        <span className="text-lg text-slate-500">90 minutes. Internationally accredited certificate. Only $27.</span>
                    </p>

                    {/* Accreditation Logos - Right after headline */}
                    <div className="max-w-3xl mx-auto mb-8">
                        <Image
                            src="/all-logos.png"
                            alt="Accredited by CMA, IPHM, CPD, IAOTH, ICAHP, IGCT, CTAA, IHTCP, IIOHT"
                            width={800}
                            height={100}
                            className="w-full h-auto"
                        />
                    </div>

                    {/* Certificate Preview - Inline */}
                    <div className="max-w-md mx-auto mb-8">
                        <CertificatePreview />
                    </div>

                    {/* Social Proof */}
                    <div className="flex justify-center mb-8 sm:mb-10">
                        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-full px-4 sm:px-5 py-3 shadow-sm">
                            <div className="flex -space-x-2 sm:-space-x-3">
                                {STUDENT_AVATARS.slice(0, 5).map((src, i) => (
                                    <Image
                                        key={i}
                                        src={src}
                                        alt="Student"
                                        width={40}
                                        height={40}
                                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white shadow-sm"
                                    />
                                ))}
                            </div>
                            <span className="text-slate-600 text-sm sm:text-base text-center"><strong className="text-slate-800">843+</strong> nurses & healthcare workers enrolled</span>
                        </div>
                    </div>

                    {/* CTA Button - Direct to checkout */}
                    <div className="flex flex-col items-center justify-center gap-4 mb-6">
                        <a href="https://sarah.accredipro.academy/fm-mini-diploma-access">
                            <Button className="w-full sm:w-auto bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-bold py-7 px-12 rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02]">
                                <GraduationCap className="h-5 w-5 mr-2" />
                                Get Certified Now — $27
                                <ArrowRight className="h-5 w-5 ml-2" />
                            </Button>
                        </a>
                        <p className="text-sm text-slate-500">
                            <span className="line-through text-slate-400">$47</span>
                            <span className="text-red-600 font-bold ml-2">🎄 Christmas: Save $20!</span>
                        </p>
                    </div>

                    <p className="text-center text-slate-500 flex items-center justify-center gap-2">
                        <Shield className="h-4 w-4 text-emerald-600" />
                        30-day money-back guarantee • No risk
                    </p>
                </div>
            </section>

            {/* Trust Bar */}
            <section className="border-y border-slate-200 bg-white py-5">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-16 text-slate-600">
                        <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-emerald-600" />
                            <span className="font-medium">Secure Checkout</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-burgundy-600" />
                            <span className="font-medium">Instant Access</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-burgundy-600" />
                            <span className="font-medium">90 Min to Complete</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-burgundy-600" />
                            <span className="font-medium">Certificate Included</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sarah's Story Section - Testimonial Style */}
            <section className="py-16 sm:py-20 bg-gradient-to-b from-rose-50 to-white">
                <div className="max-w-4xl mx-auto px-4">
                    {/* Header with small circular photo */}
                    <div className="flex flex-col items-center text-center mb-8">
                        <Image
                            src="/coaches/sarah-coach.webp"
                            alt="Sarah Mitchell"
                            width={100}
                            height={100}
                            className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white ring-4 ring-burgundy-100 mb-4"
                        />
                        <p className="text-burgundy-600 font-semibold uppercase tracking-wide text-sm">Hi, I'm Sarah</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
                            I Know Exactly How You Feel
                        </h2>
                    </div>

                    {/* Story Content - First Person */}
                    <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100">
                        <div className="space-y-4 text-lg text-slate-600">
                            <p>
                                <strong className="text-slate-800">I was drowning.</strong> 12-hour shifts in the ER, coming home exhausted to my two kids. Bills piling up. Zero time for myself.
                            </p>
                            <p>
                                Then my health crashed. <span className="text-burgundy-700 font-semibold">Thyroid issues. Gut problems. Brain fog so bad I thought I was losing my mind.</span> Doctors told me I was "fine."
                            </p>
                            <p className="font-medium text-slate-800">
                                Sound familiar?
                            </p>
                            <p>
                                Functional medicine changed everything. First, I healed myself. Then I realized I could help other women do the same — <strong className="text-slate-800">on MY terms, from home, around MY kids.</strong>
                            </p>
                        </div>

                        <div className="mt-8 p-5 bg-gradient-to-r from-burgundy-50 to-gold-50 rounded-2xl border-l-4 border-burgundy-600">
                            <p className="text-burgundy-800 font-semibold text-lg mb-2">
                                "Now I earn more than I did as an RN — working 20 hours a week."
                            </p>
                            <p className="text-slate-600">
                                I've helped 843+ students start their journey. Let me show you how.
                            </p>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-burgundy-700">12+</p>
                                <p className="text-xs text-slate-500">Years as RN</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-burgundy-700">843+</p>
                                <p className="text-xs text-slate-500">Students Mentored</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-burgundy-700">97%</p>
                                <p className="text-xs text-slate-500">Completion Rate</p>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <a href="https://sarah.accredipro.academy/fm-mini-diploma-access">
                                <Button className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-bold py-5 px-8 rounded-xl text-lg shadow-lg">
                                    <Heart className="h-5 w-5 mr-2" />
                                    Learn With Me — $27
                                    <ArrowRight className="h-5 w-5 ml-2" />
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Why Sarah Section - Stats Focus */}
            <section className="py-16 sm:py-20">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Why Learn with Sarah?</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                            Personal Mentorship Included
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Unlike other courses where you're left on your own — here you get a real coach who cares.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {[
                            { number: "12+", label: "Years as an RN before discovering FM", icon: Heart },
                            { number: "843+", label: "Students mentored personally", icon: Users },
                            { number: "97%", label: "Completion rate with coach support", icon: Target },
                            { number: "$50-150", label: "Hourly rate our graduates aim for", icon: DollarSign },
                        ].map((stat, i) => (
                            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
                                <div className="w-14 h-14 rounded-xl bg-burgundy-100 flex items-center justify-center mx-auto mb-3">
                                    <stat.icon className="h-7 w-7 text-burgundy-600" />
                                </div>
                                <p className="text-2xl font-bold text-burgundy-700">{stat.number}</p>
                                <p className="text-slate-600 text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <div className="bg-gradient-to-r from-burgundy-50 to-gold-50 border border-burgundy-100 rounded-2xl p-6 inline-block">
                            <p className="text-burgundy-800 font-semibold text-lg">
                                $27. 90 minutes. Personal support until you finish.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Problem Section */}
            <section className="py-16 sm:py-20 bg-slate-900 text-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="text-burgundy-400 font-semibold mb-2 uppercase tracking-wide">The Problem</p>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            You Know Something Is Broken
                        </h2>
                        <p className="text-xl text-slate-400 max-w-2xl mx-auto">
                            The healthcare system wasn't built to help people get well. It was built to manage disease.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-6">
                        {[
                            { stat: "7 min", desc: "Average time doctors spend per patient" },
                            { stat: "80%", desc: "Of chronic disease is preventable with lifestyle changes" },
                            { stat: "0 hrs", desc: "Nutrition training in most medical schools" },
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-800/50 rounded-2xl p-6 text-center border border-slate-700">
                                <p className="text-4xl font-bold text-burgundy-400 mb-2">{item.stat}</p>
                                <p className="text-slate-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-12 text-center">
                        <p className="text-xl text-slate-300 mb-2">
                            You've seen it. Maybe you've lived it.
                        </p>
                        <p className="text-2xl font-bold text-white">
                            There's a better way. <span className="text-burgundy-400">It's called functional medicine.</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* What You'll Learn Section */}
            <section className="py-16 sm:py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">The Curriculum</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                            What You'll Learn in 90 Minutes
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            A complete foundation in functional medicine—enough to know if this is your path.
                        </p>
                    </div>

                    {/* Conversational Learning Feature */}
                    <div className="bg-gradient-to-r from-burgundy-50 to-rose-50 rounded-3xl p-6 sm:p-8 mb-10 border border-burgundy-100">
                        <div className="grid lg:grid-cols-2 gap-8 items-center">
                            <div>
                                <div className="inline-flex items-center gap-2 bg-burgundy-100 text-burgundy-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                                    <MessageCircle className="h-4 w-4" />
                                    Conversational Learning
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                                    We Learn Together — Like a Real Conversation
                                </h3>
                                <p className="text-slate-600 mb-4">
                                    This isn't a boring lecture. I'll guide you through each concept conversationally, checking in with you, answering your questions in real-time, and making sure you don't miss anything.
                                </p>
                                <p className="text-burgundy-700 font-semibold">
                                    Any doubt? Just ask me. I want you to get 100% out of this training!
                                </p>
                            </div>
                            <div className="relative">
                                <Image
                                    src="/conversational-learning.webp"
                                    alt="Conversational learning experience"
                                    width={500}
                                    height={300}
                                    className="rounded-2xl shadow-lg w-full"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 mb-10">
                        {/* Module 1 */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-burgundy-100 flex items-center justify-center">
                                    <span className="text-burgundy-700 font-bold text-xl">1</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-slate-900">Functional Medicine Foundations</h3>
                                    <p className="text-slate-500">45 minutes • Interactive</p>
                                </div>
                            </div>
                            <ul className="space-y-3">
                                {[
                                    "What functional medicine actually is (and isn't)",
                                    "The root-cause framework that changes everything",
                                    "The 7 body systems and how they connect",
                                    "Why 'normal' lab results don't mean you're healthy",
                                    "Real case studies that show FM in action",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                        <span className="text-slate-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Module 2 */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-burgundy-100 flex items-center justify-center">
                                    <span className="text-burgundy-700 font-bold text-xl">2</span>
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl text-slate-900">The FM Mindset & Your Path</h3>
                                    <p className="text-slate-500">45 minutes • Interactive</p>
                                </div>
                            </div>
                            <ul className="space-y-3">
                                {[
                                    "How to think like a functional practitioner",
                                    "The business opportunity in FM health coaching",
                                    "Income potential and realistic timelines",
                                    "What certification options exist",
                                    "Is this the right path for YOU? (clarity exercise)",
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                        <span className="text-slate-700">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                </div>
            </section>

            {/* Certificate Section */}
            <section className="py-16 sm:py-20 bg-gradient-to-b from-gold-50 to-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Your Credential</p>
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                                Earn Your Official Mini Diploma Certificate
                            </h2>
                            <p className="text-lg text-slate-600 mb-6">
                                Complete the program and receive a verifiable certificate that demonstrates your foundational knowledge in functional medicine.
                            </p>

                            <div className="space-y-4">
                                {[
                                    { icon: FileCheck, text: "Official AccrediPro certificate with unique credential ID" },
                                    { icon: Laptop, text: "Download, print, or share digitally" },
                                    { icon: BadgeCheck, text: "Add to your LinkedIn profile" },
                                    { icon: Shield, text: "Lifetime validity — yours forever" },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-burgundy-100 flex items-center justify-center shrink-0">
                                            <item.icon className="h-5 w-5 text-burgundy-600" />
                                        </div>
                                        <span className="text-slate-700">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <CertificatePreview />
                    </div>
                </div>
            </section>

            {/* Who This Is For */}
            <section className="py-16 sm:py-20">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Is This For You?</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                            This Mini Diploma Is Perfect For
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: Heart, title: "Healthcare Workers", desc: "Nurses, PAs, doctors who've seen the system fail patients" },
                            { icon: Sparkles, title: "Wellness Professionals", desc: "Coaches, nutritionists, yoga teachers wanting deeper knowledge" },
                            { icon: Target, title: "Career Changers", desc: "Anyone seeking meaningful work that helps people" },
                            { icon: Users, title: "Healers in Training", desc: "Those on their own healing journey who want to help others" },
                            { icon: TrendingUp, title: "Entrepreneurs", desc: "Looking for a growing field with real income potential" },
                            { icon: HeartHandshake, title: "Caregivers", desc: "Family members who want to better support loved ones" },
                        ].map((item, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                <div className="w-12 h-12 rounded-xl bg-burgundy-100 flex items-center justify-center mb-4">
                                    <item.icon className="h-6 w-6 text-burgundy-600" />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-slate-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Success Stories - Mirror Neuron Section */}
            <section className="py-16 sm:py-20 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Real Transformations</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                            Women Who Were Exactly Where You Are
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            They started with the Mini Diploma. Here's where they are now.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        <SuccessStory
                            name="Linda Thompson"
                            age={52}
                            location="ER Nurse from Texas"
                            before="Burned out after 23 years in the ER. Watching patients leave with pills that wouldn't fix anything."
                            after="Runs her own FM health coaching practice with a 3-week waitlist."
                            quote="I finally feel like I'm actually HELPING people heal."
                            income="$125/hr"
                            avatarIndex={4}
                        />
                        <SuccessStory
                            name="Maria Santos"
                            age={47}
                            location="Former HR Manager, California"
                            before="Had Hashimoto's for 8 years. Doctors just kept adjusting meds. Exhausted, gaining weight."
                            after="Healed herself first, now coaches other women with thyroid issues from home."
                            quote="My clients trust me because I've LIVED it."
                            income="$1,700/week"
                            avatarIndex={6}
                        />
                        <SuccessStory
                            name="Jennifer Walsh"
                            age={44}
                            location="Yoga Teacher, Florida"
                            before="Loved teaching yoga but kept hitting a wall with clients who had chronic issues."
                            after="Runs 6-week 'Yoga + Root Cause' programs that actually transform lives."
                            quote="I went from $40/class to $5,000/month in 4 months."
                            income="$5K/month"
                            avatarIndex={5}
                        />
                    </div>

                    <div className="text-center mt-12">
                        <p className="text-slate-600 mb-6">
                            They didn't need another degree. They needed a different <span className="font-bold text-burgundy-700">FRAMEWORK</span>.
                        </p>
                        <a href="https://sarah.accredipro.academy/fm-mini-diploma-access">
                            <Button className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-bold py-6 px-10 rounded-xl text-lg shadow-lg">
                                Start Your Transformation — $27
                                <ArrowRight className="h-5 w-5 ml-2" />
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* Portal Access Section */}
            <section className="py-16 sm:py-20 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Your Learning Hub</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                            Access the Most Complete Portal
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Community of 1,400+ students & graduates. Coach Workspace to manage your future clients.
                        </p>
                    </div>

                    {/* Portal Screenshot */}
                    <div className="max-w-5xl mx-auto mb-10">
                        <Image
                            src="/portal.webp"
                            alt="AccrediPro Portal - All in one space"
                            width={1200}
                            height={700}
                            className="w-full h-auto rounded-2xl shadow-2xl border border-slate-200"
                        />
                    </div>

                    {/* Features Grid */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                        {[
                            { icon: Users, title: "1,400+ Community", desc: "Connect with students & graduates" },
                            { icon: Laptop, title: "Coach Workspace", desc: "Manage all your future clients" },
                            { icon: MessageCircle, title: "Private Chat", desc: "Direct access to Sarah anytime" },
                            { icon: BookOpen, title: "Coaching Tips", desc: "Listen to stories & strategies" },
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-50 rounded-2xl p-5 text-center border border-slate-100">
                                <div className="w-12 h-12 rounded-xl bg-burgundy-100 flex items-center justify-center mx-auto mb-3">
                                    <item.icon className="h-6 w-6 text-burgundy-600" />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
                                <p className="text-sm text-slate-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Private Chat with Sarah */}
                    <div className="max-w-2xl mx-auto bg-gradient-to-r from-burgundy-50 to-rose-50 rounded-2xl p-6 border border-burgundy-100">
                        <div className="flex items-center gap-4">
                            <Image
                                src="/coaches/sarah-coach.webp"
                                alt="Sarah"
                                width={64}
                                height={64}
                                className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
                            />
                            <div>
                                <p className="font-bold text-slate-900 text-lg">Private chat with me — whenever you need!</p>
                                <p className="text-slate-600">Listen to other stories, get coaching tips, ask questions. I'm here for you.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Everything You Get Section - COMPLETELY REDESIGNED */}
            <section id="pricing" className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-5xl mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Complete Package</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
                            Everything You Get for $27
                        </h2>
                        <p className="text-lg text-slate-600">
                            One payment. Lifetime access. Personal support until you finish.
                        </p>
                    </div>

                    {/* Main Pricing Card */}
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden max-w-3xl mx-auto">
                        {/* Card Header */}
                        <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 px-8 py-6 text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <GraduationCap className="h-6 w-6 text-gold-400" />
                                <span className="text-gold-400 font-semibold uppercase tracking-wide text-sm">Functional Medicine Mini Diploma</span>
                            </div>
                            <div className="flex items-center justify-center gap-4">
                                <span className="text-white/60 line-through text-2xl">$47</span>
                                <span className="text-5xl font-black text-white">$27</span>
                            </div>
                            <p className="text-yellow-300 text-sm mt-2 font-semibold">🎄 Christmas Discount: Save $20! Until 26 Dec</p>
                        </div>

                        {/* What's Included */}
                        <div className="p-8">
                            {/* Core Training */}
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-burgundy-600 uppercase tracking-wide mb-4 flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    Core Training
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { title: "Module 1: FM Foundations", time: "45 min", desc: "Root-cause framework & 7 body systems" },
                                        { title: "Module 2: FM Mindset & Career", time: "45 min", desc: "Think like a practitioner + your path forward" },
                                        { title: "Mini Diploma Certificate", time: "", desc: "Official, verifiable credential for LinkedIn" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl">
                                            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <span className="font-semibold text-slate-800">{item.title}</span>
                                                    {item.time && <span className="text-xs text-slate-500 bg-slate-200 px-2 py-0.5 rounded">{item.time}</span>}
                                                </div>
                                                <p className="text-sm text-slate-500">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Support */}
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-burgundy-600 uppercase tracking-wide mb-4 flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Personal Support (Included!)
                                </h3>
                                <div className="space-y-3">
                                    {[
                                        { title: "1:1 Coach Assignment", desc: "Your own mentor until you complete" },
                                        { title: "Private Community", desc: "Connect with 843+ students for life" },
                                        { title: "Direct Message Support", desc: "Get your questions answered" },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
                                            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                                            <div>
                                                <span className="font-semibold text-slate-800">{item.title}</span>
                                                <p className="text-sm text-slate-500">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bonuses */}
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-burgundy-600 uppercase tracking-wide mb-4 flex items-center gap-2">
                                    <Gift className="h-4 w-4" />
                                    Graduate Bonuses (Unlocked on Completion)
                                </h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        "Practitioner Reality Playbook",
                                        "Scope & Ethics Guide",
                                        "Your First Client Guide",
                                        "$5K/Month Roadmap",
                                        "FM Decision Guide",
                                        "Income Calculator Tool",
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-slate-600 p-2 bg-gold-50 rounded-lg border border-gold-100">
                                            <Gift className="h-4 w-4 text-gold-500 shrink-0" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-slate-500 mt-2 text-center">Value: $832 — Yours FREE when you finish</p>
                            </div>

                            {/* CTA */}
                            <a href="https://sarah.accredipro.academy/fm-mini-diploma-access" className="block">
                                <Button className="w-full bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-bold py-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all">
                                    <GraduationCap className="h-5 w-5 mr-2" />
                                    Start My Mini Diploma — $27
                                </Button>
                            </a>

                            {/* Trust */}
                            <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                    <Shield className="h-4 w-4 text-emerald-500" />
                                    Secure checkout
                                </span>
                                <span>•</span>
                                <span>Instant access</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                    30-day money-back guarantee
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Social Proof Below */}
                    <div className="mt-8 text-center">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <div className="flex -space-x-2">
                                {STUDENT_AVATARS.slice(0, 5).map((src, i) => (
                                    <Image
                                        key={i}
                                        src={src}
                                        alt="Student"
                                        width={32}
                                        height={32}
                                        className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                                    />
                                ))}
                            </div>
                            <p className="text-slate-600 text-sm">
                                <strong className="text-slate-800">843+</strong> nurses, healthcare workers & coaches enrolled
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 sm:py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Student Stories</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                            What Brought Them Here
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Testimonial
                            quote="I'm an ARNP of 25 years and am completely burned out on traditional healthcare. I want to be paid what my knowledge and experience is worth."
                            name="Karen Mitchell"
                            role="Nurse Practitioner, 25 years"
                            highlight="This is exactly what I was looking for."
                            avatarIndex={1}
                        />
                        <Testimonial
                            quote="I'm a nurse, very disappointed in the sick care protocols. I've been trying to talk to people about nutrition and lifestyle changes for years."
                            name="Lisa Rodriguez"
                            role="Registered Nurse"
                            highlight="Finally, real solutions."
                            avatarIndex={2}
                        />
                        <Testimonial
                            quote="I was looking for something to fill the void that was part of my life for 40 years. Something meaningful that actually helps people."
                            name="Patricia Smith"
                            role="Retired Nurse, 40 years"
                            avatarIndex={3}
                        />
                        <Testimonial
                            quote="I was recently diagnosed with breast cancer and strongly believe that if I were able to do all the things your course is offering, I would have been better able to help myself."
                            name="Maria Johnson"
                            role="RN, Med-Surg"
                            highlight="So here I am, hungry to learn."
                            avatarIndex={4}
                        />
                        <Testimonial
                            quote="As a yoga teacher, I kept hitting the limits of what I could help my students with. This gave me the deeper understanding I needed."
                            name="Jennifer Taylor"
                            role="Yoga Instructor & Wellness Coach"
                            avatarIndex={7}
                        />
                        <Testimonial
                            quote="After 15 years in corporate, I wanted work that mattered. This mini diploma helped me see the path clearly."
                            name="Amanda Chen"
                            role="Career Changer"
                            highlight="Best $27 I ever spent."
                            avatarIndex={8}
                        />
                    </div>
                </div>
            </section>

            {/* Income Potential */}
            <section className="py-16 sm:py-20 bg-gradient-to-b from-emerald-50 to-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="text-emerald-600 font-semibold mb-2 uppercase tracking-wide">The Opportunity</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                            Where This Path Can Lead
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            After completing full certification, our students are building toward these income levels:
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-6 mb-8">
                        {[
                            { range: "$3K – $5K", period: "/month", desc: "Part-time practice", detail: "5-10 clients • 10-15 hrs/week" },
                            { range: "$6K – $10K", period: "/month", desc: "Full-time practice", detail: "15-25 clients • Replace job income", highlight: true },
                            { range: "$15K – $20K+", period: "/month", desc: "Premium practice", detail: "Group programs • Scaled business" },
                        ].map((tier, i) => (
                            <div key={i} className={`rounded-2xl p-6 text-center ${tier.highlight ? 'bg-emerald-600 text-white ring-4 ring-emerald-300 shadow-xl' : 'bg-white shadow-sm border border-emerald-100'}`}>
                                <p className={`text-4xl font-black ${tier.highlight ? 'text-white' : 'text-emerald-600'}`}>
                                    {tier.range}
                                    <span className="text-lg font-medium">{tier.period}</span>
                                </p>
                                <p className={`font-semibold text-lg mt-2 ${tier.highlight ? 'text-emerald-100' : 'text-slate-800'}`}>{tier.desc}</p>
                                <p className={`text-sm mt-1 ${tier.highlight ? 'text-emerald-200' : 'text-slate-500'}`}>{tier.detail}</p>
                            </div>
                        ))}
                    </div>

                    <p className="text-center text-slate-500 text-sm">
                        *Income ranges represent goals of enrolled students. Results vary based on effort, background, and dedication. Full certification required to work with clients.
                    </p>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-16 sm:py-20">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Simple Process</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                            What Happens After You Click
                        </h2>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            { step: "1", title: "Instant Access", desc: "Complete checkout and get immediate access to your dashboard" },
                            { step: "2", title: "Meet Your Coach", desc: "Your personal coach sends you a welcome message within 24 hours" },
                            { step: "3", title: "Complete in 90 min", desc: "Work through both modules at your own pace with Sarah" },
                            { step: "4", title: "Get Certified", desc: "Pass the quiz, earn your certificate, unlock bonuses" },
                        ].map((item, i) => (
                            <div key={i} className="relative">
                                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 h-full">
                                    <div className="w-10 h-10 rounded-full bg-burgundy-600 text-white flex items-center justify-center font-bold mb-4">
                                        {item.step}
                                    </div>
                                    <h3 className="font-bold text-slate-900 mb-2">{item.title}</h3>
                                    <p className="text-slate-600 text-sm">{item.desc}</p>
                                </div>
                                {i < 3 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                                        <ArrowRight className="h-6 w-6 text-slate-300" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 sm:py-20 bg-slate-50">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Questions?</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 px-8">
                        <FAQItem
                            question="What can I do with just the Mini Diploma?"
                            answer="The Mini Diploma gives you a solid foundation in functional medicine principles. It's designed to help you understand the field, decide if it's right for you, and prepare for full certification. You'll learn the root-cause framework, understand the business opportunity, and get clarity on your path. To actually work with clients and earn income, you'll need to continue to full certification."
                        />
                        <FAQItem
                            question="Do I really get all those bonuses for $27?"
                            answer="Yes! The Graduate Resource Library (worth $832) unlocks automatically when you complete your Mini Diploma. This includes the Practitioner Reality Playbook, Scope of Practice Guide, Your First Client Guide, the $5K/Month Roadmap, and more. It's our way of setting you up for success and giving you a real taste of what full certification offers."
                        />
                        <FAQItem
                            question="How long does it take to complete?"
                            answer="The core Mini Diploma takes about 90 minutes—two 45-minute interactive modules. Most students complete it in one sitting, but you can go at your own pace. The bonus resources are additional (10+ hours of content) and available whenever you're ready."
                        />
                        <FAQItem
                            question="Will I actually get personal support for $27?"
                            answer="Absolutely. Within 24 hours of enrolling, you'll be assigned a personal coach who will check in on you, answer your questions, and mentor you until you complete the program. We have a 97% completion rate because we don't leave anyone behind. This is what makes us different."
                        />
                        <FAQItem
                            question="What if I want to continue to full certification?"
                            answer="After completing your Mini Diploma, you'll unlock access to our full certification pathways. Your coach will help you understand the options and choose the right path for your goals. Many students see the Mini Diploma as their 'test drive' before committing to full certification."
                        />
                        <FAQItem
                            question="How much can I earn as a functional medicine health coach?"
                            answer="After full certification, our students are building toward $3,000-$20,000+/month depending on whether they work part-time or full-time, and whether they do 1:1 coaching or group programs. The field is growing 15%+ per year and there's high demand for trained practitioners. The Mini Diploma includes our Income Calculator tool so you can see realistic projections."
                        />
                        <FAQItem
                            question="What's your refund policy?"
                            answer="We offer a full 30-day money-back guarantee. If you're not satisfied for any reason, just email us and we'll refund your $27. No questions asked. We're confident you'll love it, but we want you to feel completely safe."
                        />
                    </div>
                </div>
            </section>

            {/* Guarantee Section */}
            <section className="py-16 sm:py-20">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <div className="bg-gradient-to-br from-emerald-50 to-white rounded-3xl p-10 border-2 border-emerald-200">
                        <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
                            <Shield className="h-10 w-10 text-emerald-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            100% Money-Back Guarantee
                        </h2>
                        <p className="text-lg text-slate-600 mb-6 max-w-xl mx-auto">
                            Don't love it? Email us within 30 days for a full refund. No questions. No hassle. No hard feelings.
                        </p>
                        <p className="text-2xl font-bold text-emerald-700">
                            You risk absolutely nothing.
                        </p>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-20 sm:py-28 bg-gradient-to-b from-burgundy-900 to-slate-900 text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <p className="text-burgundy-300 font-semibold mb-4 uppercase tracking-wide">Ready to Start?</p>
                    <h2 className="text-3xl sm:text-5xl font-bold mb-6">
                        Learn What Doctors Don't Teach<br />in Medical School
                    </h2>
                    <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                        The root-cause framework that's helping 843+ practitioners build $5K-$20K/month practices. Your first step starts here.
                    </p>

                    {/* Quick Summary */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-10 max-w-2xl mx-auto">
                        <p className="text-gold-400 font-semibold mb-6 text-lg">Everything you get for $27:</p>
                        <div className="grid grid-cols-2 gap-4 text-left">
                            {[
                                "2 Interactive Modules (90 min)",
                                "Mini Diploma Certificate",
                                "Personal Coach Support",
                                "Private Community Access",
                                "6 Graduate Bonus Resources",
                                "30-Day Money-Back Guarantee",
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                                    <span className="text-slate-200">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="mb-8">
                        <p className="text-slate-400 mb-2">Total Value: $1,344</p>
                        <p className="text-6xl font-black text-gold-400 mb-2">$27</p>
                        <p className="text-slate-400">One-time payment • Lifetime access</p>
                    </div>

                    <a href="https://sarah.accredipro.academy/fm-mini-diploma-access">
                        <Button className="w-full sm:w-auto bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-slate-900 font-black py-8 px-14 rounded-2xl text-xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-[1.02]">
                            Start My Mini Diploma — $27
                            <ArrowRight className="h-6 w-6 ml-3" />
                        </Button>
                    </a>

                    <div className="flex flex-wrap justify-center gap-6 mt-8 text-slate-400">
                        <span className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-emerald-500" />
                            Secure checkout
                        </span>
                        <span className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-gold-400" />
                            Instant access
                        </span>
                        <span className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                            30-day guarantee
                        </span>
                    </div>

                    <p className="text-slate-500 mt-10">
                        Join 843+ nurses, healthcare workers & wellness coaches who started their FM journey here.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 bg-slate-900 text-slate-500 text-center text-sm">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <GraduationCap className="h-6 w-6 text-burgundy-500" />
                        <span className="font-semibold text-slate-300">AccrediPro Academy</span>
                    </div>
                    <p className="mb-4 max-w-2xl mx-auto">
                        *Income ranges represent goals of enrolled students. Results vary based on effort, background, and dedication. Mini Diploma is educational—full certification required to work professionally with clients.
                    </p>
                    <p>© 2025 AccrediPro Academy. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
