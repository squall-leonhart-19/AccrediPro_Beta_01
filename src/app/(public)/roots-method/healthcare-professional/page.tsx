"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
    GraduationCap, CheckCircle2, Clock, Users, Award,
    Shield, MessageCircle, BookOpen, DollarSign, ArrowRight,
    ChevronDown, ChevronUp, Star, Heart, Zap,
    TrendingUp, Target, Play, Sparkles, X,
    Gift, HeartHandshake, FileCheck, Laptop, BadgeCheck, Quote,
    Brain, Compass, Layers, Users2, Scale, Timer,
    Stethoscope, AlertCircle, CalendarDays, Home, Linkedin, Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Real student profile images
const STUDENT_AVATARS = [
    "https://accredipro.academy/wp-content/uploads/2025/12/LeezaRhttilthead.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/Head-shot-dark-background-1.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/Profile-Pic.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/MICHELLEM047.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/AnneProfile2.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/MARIA-GARCIA-PIC-IMG_5435-1.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_3542-Profile-Picture-Updated.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/dgp03315.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/Headshot-Ines.jpg",
];

// PERSONA IDENTIFIER - for tracking
const PERSONA_ID = "healthcare-professional";
const PERSONA_LABEL = "Licensed Healthcare Professional";

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

// Testimonial Component - Healthcare Professional focus
const Testimonial = ({ quote, name, role, credential, before, after, income, avatarIndex = 0 }: {
    quote: string;
    name: string;
    role: string;
    credential?: string;
    before?: string;
    after?: string;
    income?: string;
    avatarIndex?: number
}) => (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-slate-100 hover:shadow-xl transition-all">
        <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 p-4 text-white">
            <div className="flex items-center gap-3">
                <Image
                    src={STUDENT_AVATARS[avatarIndex % STUDENT_AVATARS.length]}
                    alt={name}
                    width={56}
                    height={56}
                    className="w-14 h-14 rounded-full object-cover shadow-lg ring-2 ring-white/30"
                />
                <div>
                    <p className="font-bold">{name}</p>
                    <p className="text-burgundy-200 text-sm">{role}</p>
                    {credential && (
                        <p className="text-gold-300 text-xs font-semibold">{credential}</p>
                    )}
                </div>
            </div>
        </div>
        <div className="p-5">
            {before && after && (
                <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-red-50 rounded-xl p-3 border border-red-100">
                        <p className="text-xs uppercase tracking-wide text-red-600 font-semibold mb-1">Before</p>
                        <p className="text-sm text-slate-700">{before}</p>
                    </div>
                    <div className="bg-olive-50 rounded-xl p-3 border border-olive-100">
                        <p className="text-xs uppercase tracking-wide text-olive-600 font-semibold mb-1">After</p>
                        <p className="text-sm text-slate-700">{after}</p>
                    </div>
                </div>
            )}
            <blockquote className="text-slate-600 italic mb-4 pl-4 border-l-4 border-burgundy-200">
                "{quote}"
            </blockquote>
            {income && (
                <div className="bg-gradient-to-r from-gold-50 to-gold-100 rounded-xl p-3 flex items-center justify-between border border-gold-200">
                    <span className="text-gold-800 font-medium text-sm">Now earning:</span>
                    <span className="text-xl font-black text-gold-600">{income}</span>
                </div>
            )}
        </div>
    </div>
);

// Recent Enrollment Toast Component - Professional focus
const RecentEnrollmentToast = () => {
    const [visible, setVisible] = useState(false);
    const [currentEnrollment, setCurrentEnrollment] = useState(0);

    const enrollments = [
        { name: 'Sarah K., RN', location: 'Texas', time: '2 min ago', avatarIndex: 0 },
        { name: 'Michelle R., NP', location: 'California', time: '5 min ago', avatarIndex: 3 },
        { name: 'Jennifer L., BSN', location: 'Florida', time: '8 min ago', avatarIndex: 6 },
        { name: 'Amanda P., PA-C', location: 'New York', time: '12 min ago', avatarIndex: 4 },
        { name: 'Lisa M., RD', location: 'Ohio', time: '15 min ago', avatarIndex: 1 },
        { name: 'Maria G., RN', location: 'Arizona', time: '18 min ago', avatarIndex: 5 },
    ];

    useEffect(() => {
        const initialTimeout = setTimeout(() => {
            setVisible(true);
            setTimeout(() => setVisible(false), 4000);
        }, 8000);

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
                    <p className="text-xs text-slate-500">Just enrolled in R.O.O.T.S. • {enrollment.time}</p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-olive-600 shrink-0" />
            </div>
        </div>
    );
};

// Sticky Mobile CTA Component
const StickyMobileCTA = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
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
                    <p className="text-slate-500 text-xs">Professional Certification</p>
                    <p className="text-xl font-black text-burgundy-700">FREE Access</p>
                </div>
                <a href={`https://sarah.accredipro.academy/fm-mini-diploma-access?persona=${PERSONA_ID}`} className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-bold py-4 rounded-xl">
                        Get Free Pro Access
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </a>
            </div>
        </div>
    );
};

// R.O.O.T.S. Step Component
const ROOTSStep = ({ letter, title, description, example, icon: Icon }: {
    letter: string;
    title: string;
    description: string;
    example: string;
    icon: React.ElementType;
}) => (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all">
        <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-burgundy-600 to-burgundy-700 flex items-center justify-center shrink-0">
                <span className="text-2xl font-black text-white">{letter}</span>
            </div>
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                    <Icon className="h-5 w-5 text-burgundy-600" />
                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                </div>
                <p className="text-slate-600 mb-3">{description}</p>
                <div className="bg-burgundy-50 rounded-xl p-3 border-l-4 border-burgundy-400">
                    <p className="text-sm text-burgundy-800 italic">"{example}"</p>
                </div>
            </div>
        </div>
    </div>
);

// Curriculum Module Accordion Component
const CurriculumModule = ({ title, lessons, defaultOpen = false }: {
    title: string;
    lessons: { number: number; title: string; description: string }[];
    defaultOpen?: boolean;
}) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-5 sm:px-6 py-4 sm:py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-burgundy-600 to-burgundy-700 flex items-center justify-center shrink-0">
                        <BookOpen className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-base sm:text-lg">{title}</h3>
                        <p className="text-sm text-slate-500">{lessons.length} lesson{lessons.length > 1 ? 's' : ''}</p>
                    </div>
                </div>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-burgundy-100 rotate-180' : 'bg-slate-100'}`}>
                    <ChevronDown className={`h-5 w-5 ${isOpen ? 'text-burgundy-600' : 'text-slate-400'}`} />
                </div>
            </button>
            {isOpen && (
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-t border-slate-100">
                    <div className="space-y-3 mt-4">
                        {lessons.map((lesson) => (
                            <div key={lesson.number} className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-cream-50 rounded-xl border border-cream-200">
                                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-burgundy-100 flex items-center justify-center shrink-0">
                                    <span className="text-sm sm:text-base font-bold text-burgundy-700">{lesson.number}</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-slate-900 text-sm sm:text-base">{lesson.title}</h4>
                                    <p className="text-xs sm:text-sm text-slate-600 mt-1">{lesson.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// ============================================================
// PERSONA 1: LICENSED HEALTHCARE PROFESSIONAL (RN, NP, PA, RD)
// CS Target: 700-750 (Highest quality)
// Key messaging: Professional extension, ethics, legitimacy, 
// responsibility, structured education, NOT alternative wellness
// ============================================================

export default function HealthcareProfessionalPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-cream-100 via-cream-50 to-white pb-20 lg:pb-0">
            <StickyMobileCTA />
            <RecentEnrollmentToast />

            <style jsx global>{`
                @keyframes slide-up {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
            `}</style>

            {/* Professional Bar - Authority Signal */}
            <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white py-2.5 px-4">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm">
                    <span className="flex items-center gap-2 font-semibold">
                        <Stethoscope className="h-4 w-4 text-gold-400" />
                        Professional Education for Licensed Healthcare Providers
                    </span>
                    <span className="hidden sm:block text-white/40">|</span>
                    <span className="text-white/80">CMA Internationally Accredited</span>
                    <span className="hidden sm:block text-white/40">|</span>
                    <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-full text-xs font-medium">
                        <Award className="h-3 w-3 text-gold-400" />
                        843+ Healthcare Professionals Certified
                    </span>
                </div>
            </div>

            {/* Trustpilot Widget */}
            <div className="bg-white py-2 border-b border-slate-100">
                <div className="max-w-6xl mx-auto px-4 flex items-center justify-center">
                    <div className="trustpilot-widget" data-locale="en-US" data-template-id="5419b6ffb0d04a076446a9af" data-businessunit-id="68c1ac85e89f387ad19f7817" data-style-height="20px" data-style-width="100%" data-token="73ab2ab9-e3e9-4746-b2df-4f148e213f2c">
                        <a href="https://www.trustpilot.com/review/accredipro.academy" target="_blank" rel="noopener noreferrer">Trustpilot</a>
                    </div>
                </div>
            </div>

            {/* Hero Section - Professional Framing */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-burgundy-100/40 via-transparent to-transparent" />

                <div className="relative max-w-6xl mx-auto px-4 pt-10 pb-12 sm:pt-14 sm:pb-16">
                    {/* Professional Badge */}
                    <div className="flex justify-center mb-4">
                        <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-300 rounded-full px-4 py-2 shadow-sm">
                            <Briefcase className="h-4 w-4 text-slate-600" />
                            <span className="text-sm font-semibold text-slate-700">Designed for RNs, NPs, PAs, Dietitians & Licensed Clinicians</span>
                        </div>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-slate-900 mb-4 leading-tight">
                        A Professional Introduction to <br className="hidden sm:block" />
                        <span className="text-burgundy-700">Integrative Health & Functional Medicine</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-center text-slate-700 mb-2 max-w-3xl mx-auto font-semibold">
                        Expand your clinical toolkit with root-cause frameworks — responsibly and ethically.
                    </p>
                    <p className="text-base sm:text-lg text-center text-slate-600 mb-6 max-w-3xl mx-auto">
                        This free professional mini diploma is designed for licensed healthcare professionals seeking a structured, evidence-informed introduction to Functional Medicine — not alternative wellness content.
                    </p>

                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6 text-sm">
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-slate-200">
                            <BookOpen className="h-4 w-4 text-burgundy-600" />
                            <span className="text-slate-700">9 Professional Lessons</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-slate-200">
                            <Clock className="h-4 w-4 text-burgundy-600" />
                            <span className="text-slate-700">Self-Paced Study</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-slate-200">
                            <Award className="h-4 w-4 text-burgundy-600" />
                            <span className="text-slate-700">CMA Internationally Accredited</span>
                        </div>
                    </div>

                    <div className="flex justify-center mb-6">
                        <Image
                            src="https://assets.accredipro.academy/migrated/CMA-Accredited-course.jpeg"
                            alt="CMA Accredited Course"
                            width={140}
                            height={70}
                            className="h-10 sm:h-12 md:h-14 w-auto opacity-90"
                        />
                    </div>

                    <div className="flex justify-center mb-6">
                        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-full px-4 sm:px-5 py-3 shadow-sm border border-slate-200">
                            <div className="flex -space-x-2 sm:-space-x-3">
                                {STUDENT_AVATARS.slice(0, 5).map((src, i) => (
                                    <Image key={i} src={src} alt="Student" width={40} height={40} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-white shadow-sm" />
                                ))}
                            </div>
                            <span className="text-slate-600 text-sm sm:text-base text-center">
                                <strong className="text-slate-800">843+</strong> licensed professionals certified — RNs, NPs, PAs & Dietitians
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-4 mb-6">
                        <a href={`https://sarah.accredipro.academy/fm-mini-diploma-access?persona=${PERSONA_ID}`}>
                            <Button className="w-full sm:w-auto bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-bold py-7 px-12 rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02]">
                                <GraduationCap className="h-5 w-5 mr-2" />
                                Access the Free Professional Mini Diploma
                                <ArrowRight className="h-5 w-5 ml-2" />
                            </Button>
                        </a>
                    </div>

                    <p className="text-center text-slate-500 flex items-center justify-center gap-2 text-sm">
                        <Shield className="h-4 w-4 text-olive-600" />
                        Education only • Instant access • Certificate of completion included
                    </p>
                </div>
            </section>

            {/* Who This Is For Section - Professional Qualification */}
            <section className="py-12 sm:py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Who This Program Is Designed For</h2>
                        <p className="text-xl text-slate-600">This is not casual wellness content.</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* This IS for */}
                        <div className="bg-olive-50 rounded-2xl p-6 border border-olive-200">
                            <h3 className="text-lg font-bold text-olive-800 mb-4 flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5" />
                                This IS for you if:
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    "You hold a current license (RN, NP, PA, RD, or equivalent)",
                                    "You work in or have left a regulated healthcare role",
                                    "You value structure, ethics, and professional boundaries",
                                    "You want to understand Functional Medicine at a clinical level",
                                    "You're exploring how root-cause approaches complement conventional care"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-slate-700">
                                        <CheckCircle2 className="h-5 w-5 text-olive-600 shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* This is NOT for */}
                        <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
                            <h3 className="text-lg font-bold text-red-800 mb-4 flex items-center gap-2">
                                <X className="h-5 w-5" />
                                This is NOT for:
                            </h3>
                            <ul className="space-y-3">
                                {[
                                    "Casual wellness interest or hobby learning",
                                    "Quick certification seekers",
                                    "Alternative medicine without structure",
                                    "Those looking for self-treatment protocols",
                                    "Trendy health content consumers"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2 text-slate-700">
                                        <X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 bg-slate-100 rounded-2xl p-6 border border-slate-200">
                        <p className="text-slate-700 text-center">
                            <strong className="text-slate-900">Why we're explicit:</strong> Functional Medicine requires responsibility.
                            This program respects your professional background and provides education —
                            not diagnosis or treatment training.
                        </p>
                    </div>
                </div>
            </section>

            {/* What You'll Learn Section */}
            <section className="py-12 sm:py-16 bg-gradient-to-b from-cream-50 to-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 bg-burgundy-100 border border-burgundy-200 rounded-full px-5 py-2 mb-4">
                            <BookOpen className="h-4 w-4 text-burgundy-600" />
                            <span className="text-sm font-bold text-burgundy-700">PROFESSIONAL CURRICULUM</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">What This Mini Diploma Covers</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">A structured introduction grounded in ethics, scope, and professional responsibility.</p>
                    </div>

                    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-slate-100">
                        <div className="space-y-4">
                            {[
                                { title: "Core Principles of Functional Medicine", description: "Understand the systems-based approach to root-cause health — how it differs from both conventional and alternative models." },
                                { title: "How Root-Cause Frameworks Work", description: "Learn to see patterns doctors miss — connecting symptoms to origins rather than treating in isolation." },
                                { title: "Scope, Ethics & Professional Boundaries", description: "Critical clarity on what Functional Medicine coaches can and cannot do — protecting both you and those you support." },
                                { title: "How FM Complements Conventional Care", description: "Understand where Functional Medicine fits alongside regulated practice — not as replacement, but as responsible extension." },
                                { title: "Professional Training Pathways", description: "Clear overview of what full certification looks like, what credentials are available, and how to continue responsibly." }
                            ].map((item, i) => (
                                <div key={i} className="flex gap-4 p-4 bg-cream-50 rounded-xl border border-cream-200">
                                    <div className="w-10 h-10 rounded-lg bg-burgundy-100 flex items-center justify-center shrink-0">
                                        <span className="text-base font-bold text-burgundy-700">{i + 1}</span>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-slate-900">{item.title}</h4>
                                        <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6 p-4 bg-slate-100 rounded-xl border border-slate-200">
                            <p className="text-slate-600 text-sm text-center">
                                <strong className="text-slate-800">Note:</strong> This is <em>education</em>, not diagnosis or treatment training.
                                It prepares you to understand Functional Medicine — not to practice medicine.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* The R.O.O.T.S. Method Section */}
            <section className="py-12 sm:py-16">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 bg-burgundy-100 border border-burgundy-200 rounded-full px-5 py-2 mb-4">
                            <Sparkles className="h-4 w-4 text-burgundy-600" />
                            <span className="text-sm font-bold text-burgundy-700">THE FRAMEWORK</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">The R.O.O.T.S. Method™</h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">A structured, 5-step framework used by certified practitioners</p>
                    </div>

                    <div className="space-y-4">
                        <ROOTSStep letter="R" title="RECOGNIZE THE PATTERN" description="Symptoms aren't random. Learn to see the connections that symptom-focused care misses — patterns that reveal upstream causes." example="Why fatigue, brain fog, and weight gain often appear together — and what that signals." icon={Brain} />
                        <ROOTSStep letter="O" title="FIND THE ORIGIN" description="Go upstream. Use timeline methodology to identify when health shifted, what triggered the change, and what maintains dysfunction." example="Tracing symptoms back to life events, exposures, and transitions that started the cascade." icon={Compass} />
                        <ROOTSStep letter="O" title="OPTIMIZE THE FOUNDATIONS" description="Address the 5 pillars: Nutrition, Movement, Sleep, Stress, Environment. Foundational interventions before supplementation." example="Why optimizing foundations often resolves what protocols couldn't." icon={Layers} />
                        <ROOTSStep letter="T" title="TRANSFORM WITH COACHING" description="Provide the accountability conventional care lacks. Guide implementation over time — the critical factor in outcomes." example="What becomes possible with ongoing support vs. 7-minute appointments." icon={Users2} />
                        <ROOTSStep letter="S" title="SCOPE & RESPONSIBILITY" description="Understand where education ends and clinical practice begins. Referral guidelines. Ethical boundaries. Professional accountability." example="How to support clients responsibly — and when to refer." icon={Scale} />
                    </div>

                    <div className="mt-10 text-center">
                        <a href={`https://sarah.accredipro.academy/fm-mini-diploma-access?persona=${PERSONA_ID}`}>
                            <Button className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-bold py-6 px-10 rounded-xl text-lg shadow-lg">
                                Access the Free Professional Mini Diploma
                                <ArrowRight className="h-5 w-5 ml-2" />
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* Certificate Section */}
            <section className="py-12 sm:py-16 bg-gradient-to-b from-gold-50 to-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Upon Completion</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Receive Your Certificate of Completion</h2>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-10 items-center">
                        <div className="relative">
                            <Image src="/roots-certificate.png" alt="R.O.O.T.S. Method Practitioner Certificate" width={600} height={450} className="w-full rounded-2xl shadow-2xl border-4 border-gold-300" />
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-6">Your certificate includes:</h3>
                            <div className="space-y-4">
                                {[
                                    { icon: FileCheck, text: "Official AccrediPro certificate with unique credential ID" },
                                    { icon: Award, text: "Professional designation recognized by CMA" },
                                    { icon: BadgeCheck, text: "CMA Internationally Accredited" },
                                    { icon: Laptop, text: "Digital download — add to LinkedIn immediately" },
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
                    </div>
                </div>
            </section>

            {/* Testimonials - Healthcare Professional Focus */}
            <section className="py-12 sm:py-16 bg-gradient-to-b from-cream-50 to-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">From Licensed Professionals</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Healthcare Professionals Who Made This Transition</h2>
                        <p className="text-xl text-slate-600">They held the same licenses. Faced the same frustrations. Here's where they are now.</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6 mb-10">
                        <Testimonial
                            name="Linda Thompson, RN, BSN"
                            role="ER Nurse → Integrative Health Coach"
                            credential="23 Years Clinical Experience"
                            before="Burned out after 23 years. Watching patients leave with prescriptions that wouldn't address root causes."
                            after="Runs her own practice from home using R.O.O.T.S. 3-week client waitlist. Working 20 hours/week."
                            quote="The R.O.O.T.S. Method gave me a structured framework — not just information. I finally feel like I'm using my clinical skills to actually help people heal. And I make more in 20 hours than I did in 40."
                            income="$125/hr | $6K/month"
                            avatarIndex={0}
                        />
                        <Testimonial
                            name="Jennifer Martinez, NP"
                            role="Family NP → Functional Health Practitioner"
                            credential="Board Certified NP, 15 Years"
                            before="Seeing 30+ patients/day. 7 minutes each. No time to address root causes."
                            after="Private practice with 12 long-term clients. Deep work. Real outcomes."
                            quote="I didn't leave healthcare — I upgraded it. The professional framing of this program is exactly what I needed. No woo-woo. Just structured, responsible education."
                            income="$150/hr | $8K/month"
                            avatarIndex={3}
                        />
                    </div>
                </div>
            </section>

            {/* What Happens After Completion */}
            <section className="py-12 sm:py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">After You Complete the Mini Diploma</h2>
                    </div>

                    <div className="bg-gradient-to-br from-cream-50 to-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-burgundy-100 flex items-center justify-center shrink-0">
                                    <FileCheck className="h-6 w-6 text-burgundy-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">Certificate of Completion</h3>
                                    <p className="text-slate-600">Immediately downloadable. Add to LinkedIn. Yours forever.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-burgundy-100 flex items-center justify-center shrink-0">
                                    <Compass className="h-6 w-6 text-burgundy-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">Clear Professional Pathways</h3>
                                    <p className="text-slate-600">Detailed overview of what full certification involves — and what it does not.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-12 h-12 rounded-xl bg-burgundy-100 flex items-center justify-center shrink-0">
                                    <Target className="h-6 w-6 text-burgundy-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-lg">Optional Next Steps</h3>
                                    <p className="text-slate-600">For those who wish to continue, clear options are provided. No pressure.</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 p-4 bg-slate-100 rounded-xl text-center">
                            <p className="text-slate-600">
                                <strong>There is no pressure — only clarity.</strong><br />
                                You'll have everything you need to decide if this path aligns with your professional goals.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section - Professional Focus */}
            <section className="py-12 sm:py-16 bg-cream-50">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Frequently Asked Questions</h2>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 px-6 sm:px-8">
                        <FAQItem
                            question="Is this appropriate for my professional background?"
                            answer="This program is specifically designed for licensed healthcare professionals — RNs, NPs, PAs, RDs, and equivalent. Your clinical background is an asset, not a barrier. The R.O.O.T.S. Method builds on what you already know about patient care, physiology, and clinical communication."
                        />
                        <FAQItem
                            question="How does this differ from other Functional Medicine training?"
                            answer="Most training is either too clinical (requiring full medical credentials) or too 'wellness' (lacking professional structure). This program is designed specifically for licensed healthcare professionals seeking evidence-informed education with clear ethical boundaries."
                        />
                        <FAQItem
                            question="Does this replace or conflict with my license?"
                            answer="No. This is education, not clinical licensure. It provides a framework for understanding Functional Medicine concepts — not permission to practice medicine. The distinction between education and clinical practice is clearly addressed in the program."
                        />
                        <FAQItem
                            question="What accreditation does this carry?"
                            answer="The program is CMA Internationally Accredited. Your certificate includes a unique credential ID and is valid lifetime. It can be added to LinkedIn and professional profiles."
                        />
                        <FAQItem
                            question="Is this free? What's the catch?"
                            answer="Yes, the mini diploma is free. We provide valuable education upfront because we believe professionals should understand what they're committing to before investing in full certification. If you find the program valuable and wish to continue, optional advanced pathways are available — but there is no pressure."
                        />
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-800 to-slate-900 text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">A Professional Introduction to Functional Medicine</h2>
                    <p className="text-xl text-slate-300 mb-6">Designed for Licensed Healthcare Professionals</p>

                    <p className="text-slate-400 mb-8">
                        Functional Medicine is not casual wellness content.<br />
                        It's a structured, systems-based approach that requires responsibility.<br />
                        This program respects that — and respects your professional background.
                    </p>

                    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 sm:p-8 mb-8 max-w-2xl mx-auto">
                        <p className="text-gold-400 font-semibold mb-4">What you receive (free):</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left text-sm">
                            {[
                                "Complete R.O.O.T.S. Method™ Training",
                                "9 Professional Lessons",
                                "Certificate of Completion",
                                "CMA International Accreditation",
                                "Clear Professional Pathways",
                                "Lifetime Access",
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-olive-400 shrink-0 mt-0.5" />
                                    <span className="text-slate-200">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <a href={`https://sarah.accredipro.academy/fm-mini-diploma-access?persona=${PERSONA_ID}`}>
                        <Button className="bg-gradient-to-r from-burgundy-500 to-burgundy-600 hover:from-burgundy-600 hover:to-burgundy-700 text-white font-bold py-7 px-12 rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02]">
                            <GraduationCap className="h-5 w-5 mr-2" />
                            Access the Free Professional Mini Diploma
                            <ArrowRight className="h-5 w-5 ml-2" />
                        </Button>
                    </a>

                    <p className="text-slate-500 mt-4 text-sm">
                        Instant access • Education only • Certificate included
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-8 bg-slate-950 text-slate-400">
                <div className="max-w-6xl mx-auto px-4 text-center text-sm">
                    <p className="mb-2">© 2024 AccrediPro Academy. CMA Internationally Accredited.</p>
                    <p>This program provides education, not medical advice or clinical training.</p>
                </div>
            </footer>
        </div>
    );
}
