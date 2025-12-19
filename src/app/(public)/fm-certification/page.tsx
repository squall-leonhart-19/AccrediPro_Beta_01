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
    Brain, Flame, Activity, Leaf, Sun, Moon, Dumbbell,
    Stethoscope, Pill, Timer, LayoutDashboard, Video
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Real student profile images
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

// Complete curriculum with 21 modules (0-20)
const CURRICULUM_MODULES = [
    {
        number: 0,
        title: "Welcome & Orientation",
        certificate: "Certified FM Practitioner (Foundation)",
        lessons: 5,
        description: "Get oriented and ready for your transformation journey",
        icon: GraduationCap,
    },
    {
        number: 1,
        title: "Functional Medicine Foundations",
        certificate: "Certified in FM Foundations",
        lessons: 8,
        description: "Core principles that set functional medicine apart",
        icon: BookOpen,
    },
    {
        number: 2,
        title: "Health Coaching Mastery",
        certificate: "Certified Health Coach",
        lessons: 10,
        description: "Communication skills that transform client outcomes",
        icon: MessageCircle,
    },
    {
        number: 3,
        title: "Clinical Assessment",
        certificate: "Certified Clinical Assessor",
        lessons: 8,
        description: "Properly evaluate clients and understand root causes",
        icon: Stethoscope,
    },
    {
        number: 4,
        title: "Ethics & Scope of Practice",
        certificate: "Certified in Professional Ethics",
        lessons: 6,
        description: "Protect yourself and clients with proper boundaries",
        icon: Shield,
    },
    {
        number: 5,
        title: "Functional Nutrition",
        certificate: "Certified Functional Nutritionist",
        lessons: 12,
        description: "Use food as powerful medicine to transform lives",
        icon: Leaf,
        highlight: true,
    },
    {
        number: 6,
        title: "Gut Health & Microbiome",
        certificate: "Certified Gut Health Specialist",
        lessons: 10,
        description: "Where 80% of health issues begin — and healing happens",
        icon: Activity,
        highlight: true,
    },
    {
        number: 7,
        title: "Stress, Adrenals & Nervous System",
        certificate: "Certified Stress & Adrenal Specialist",
        lessons: 8,
        description: "The stress connection most practitioners miss",
        icon: Brain,
    },
    {
        number: 8,
        title: "Blood Sugar & Insulin",
        certificate: "Certified Metabolic Health Coach",
        lessons: 8,
        description: "Break clients free from the blood sugar rollercoaster",
        icon: Activity,
    },
    {
        number: 9,
        title: "Women's Hormone Health",
        certificate: "Certified Women's Hormone Specialist",
        lessons: 10,
        description: "Support women's unique hormonal journeys",
        icon: Heart,
        highlight: true,
    },
    {
        number: 10,
        title: "Perimenopause & Menopause",
        certificate: "Certified Menopause Specialist",
        lessons: 8,
        description: "Guide women through life's most challenging transition",
        icon: Moon,
        highlight: true,
    },
    {
        number: 11,
        title: "Thyroid Health",
        certificate: "Certified Thyroid Health Specialist",
        lessons: 8,
        description: "Address the most underdiagnosed condition in healthcare",
        icon: Zap,
        highlight: true,
    },
    {
        number: 12,
        title: "Metabolic Health & Weight",
        certificate: "Certified Weight Management Specialist",
        lessons: 8,
        description: "Why traditional weight loss fails and what actually works",
        icon: Dumbbell,
    },
    {
        number: 13,
        title: "Autoimmunity & Inflammation",
        certificate: "Certified Autoimmune Specialist",
        lessons: 10,
        description: "Cutting-edge knowledge most providers don't have",
        icon: Flame,
        highlight: true,
    },
    {
        number: 14,
        title: "Mental Health & Brain Function",
        certificate: "Certified Brain Health Specialist",
        lessons: 8,
        description: "The gut-brain connection and mental wellness",
        icon: Brain,
    },
    {
        number: 15,
        title: "Cardiometabolic Health",
        certificate: "Certified Heart Health Specialist",
        lessons: 8,
        description: "Life-saving knowledge to protect and heal hearts",
        icon: Heart,
    },
    {
        number: 16,
        title: "Energy & Mitochondrial Health",
        certificate: "Certified Energy & Fatigue Specialist",
        lessons: 8,
        description: "Address the root causes of chronic fatigue",
        icon: Sun,
    },
    {
        number: 17,
        title: "Detox & Environmental Health",
        certificate: "Certified Detox Specialist",
        lessons: 8,
        description: "Reduce toxic burden in today's toxic world",
        icon: Leaf,
    },
    {
        number: 18,
        title: "Immune Health",
        certificate: "Certified Immune Health Specialist",
        lessons: 8,
        description: "Build resilient immune systems that protect",
        icon: Shield,
    },
    {
        number: 19,
        title: "Protocol Building & Program Design",
        certificate: "Certified Protocol Designer",
        lessons: 10,
        description: "Put it ALL together into custom client protocols",
        icon: Target,
    },
    {
        number: 20,
        title: "Building Your Coaching Practice",
        certificate: "Certified FM Practitioner (Complete)",
        lessons: 12,
        description: "Launch and grow your successful practice",
        icon: TrendingUp,
        highlight: true,
    },
];

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

// Testimonial Component
const Testimonial = ({ quote, name, role, highlight, avatarIndex = 0 }: { quote: string; name: string; role: string; highlight?: string; avatarIndex?: number }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-burgundy-200 transition-all group">
        <Quote className="h-8 w-8 text-burgundy-200 mb-3 group-hover:text-burgundy-300 transition-colors" />
        <p className="text-slate-700 leading-relaxed mb-4">
            {quote}
            {highlight && <span className="font-semibold text-burgundy-700"> {highlight}</span>}
        </p>
        <div className="flex gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
            ))}
        </div>
        <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
            <Image
                src={STUDENT_AVATARS[avatarIndex % STUDENT_AVATARS.length]}
                alt={name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full object-cover shadow-md border-2 border-white"
            />
            <div>
                <p className="font-semibold text-slate-800">{name}</p>
                <p className="text-sm text-slate-500">{role}</p>
            </div>
        </div>
    </div>
);

// Module Card Component
const ModuleCard = ({ module, index }: { module: typeof CURRICULUM_MODULES[0]; index: number }) => {
    const Icon = module.icon;
    return (
        <div className={`relative bg-white rounded-2xl p-5 border transition-all hover:shadow-lg ${module.highlight ? 'border-burgundy-200 ring-1 ring-burgundy-100' : 'border-slate-100'}`}>
            {module.highlight && (
                <div className="absolute -top-2 -right-2 bg-burgundy-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    Popular
                </div>
            )}
            <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${module.highlight ? 'bg-burgundy-100' : 'bg-cream-100'}`}>
                    <Icon className={`h-6 w-6 ${module.highlight ? 'text-burgundy-600' : 'text-burgundy-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-burgundy-600 bg-burgundy-50 px-2 py-0.5 rounded">
                            Module {module.number}
                        </span>
                        <span className="text-xs text-slate-400">{module.lessons} lessons</span>
                    </div>
                    <h4 className="font-bold text-slate-900 mb-1">{module.title}</h4>
                    <p className="text-sm text-slate-500 mb-2">{module.description}</p>
                    <div className="flex items-center gap-2 text-xs">
                        <Award className="h-3.5 w-3.5 text-gold-500" />
                        <span className="text-gold-700 font-medium">{module.certificate}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Recent Enrollment Toast
const RecentEnrollmentToast = () => {
    const [visible, setVisible] = useState(false);
    const [currentEnrollment, setCurrentEnrollment] = useState(0);

    const enrollments = [
        { name: 'Dr. Sarah K.', location: 'Texas', time: '3 min ago', avatarIndex: 0 },
        { name: 'Michelle R.', location: 'California', time: '7 min ago', avatarIndex: 4 },
        { name: 'Jennifer L.', location: 'Florida', time: '12 min ago', avatarIndex: 7 },
        { name: 'Amanda P.', location: 'New York', time: '18 min ago', avatarIndex: 5 },
        { name: 'Lisa M.', location: 'Ohio', time: '23 min ago', avatarIndex: 1 },
    ];

    useEffect(() => {
        const initialTimeout = setTimeout(() => {
            setVisible(true);
            setTimeout(() => setVisible(false), 4000);
        }, 10000);

        const interval = setInterval(() => {
            setCurrentEnrollment(prev => (prev + 1) % enrollments.length);
            setVisible(true);
            setTimeout(() => setVisible(false), 4000);
        }, Math.random() * 20000 + 30000);

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, []);

    if (!visible) return null;

    const enrollment = enrollments[currentEnrollment];

    return (
        <div className="fixed bottom-24 left-4 z-40 animate-slide-up lg:bottom-4">
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-4 flex items-center gap-3 max-w-sm">
                <Image
                    src={STUDENT_AVATARS[enrollment.avatarIndex]}
                    alt={enrollment.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover shadow-sm border-2 border-white shrink-0"
                />
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{enrollment.name} from {enrollment.location}</p>
                    <p className="text-xs text-slate-500">Just enrolled in Full Certification • {enrollment.time}</p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-olive-600 shrink-0" />
            </div>
        </div>
    );
};

// Sticky Mobile CTA
const StickyMobileCTA = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY > 600);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-slate-200 shadow-2xl p-4 animate-slide-up">
            <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
                <div>
                    <p className="text-slate-500 text-xs line-through">$497</p>
                    <p className="text-2xl font-black text-burgundy-700">$197</p>
                </div>
                <a href="https://sarah.accredipro.academy/fm-certification-access" className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-bold py-4 rounded-xl">
                        Get Certified — $197
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                </a>
            </div>
        </div>
    );
};

export default function FMCertificationPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-cream-100 via-cream-50 to-white pb-20 lg:pb-0">
            <StickyMobileCTA />
            <RecentEnrollmentToast />

            {/* Custom animation */}
            <style jsx global>{`
                @keyframes slide-up {
                    from { transform: translateY(100%); opacity: 0; }
                    to { transform: translateY(0); opacity: 1; }
                }
                .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
            `}</style>

            {/* Trust Banner */}
            <div className="bg-gradient-to-r from-burgundy-800 to-burgundy-900 text-white py-3 px-4">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-sm">
                    <span className="flex items-center gap-2">
                        <Award className="h-4 w-4 text-gold-400" />
                        <span className="font-medium">21 Specialized Certifications</span>
                    </span>
                    <span className="hidden sm:block text-burgundy-400">•</span>
                    <span className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-burgundy-300" />
                        <span className="font-medium">60+ Hours • 168 Lessons</span>
                    </span>
                    <span className="hidden sm:block text-burgundy-400">•</span>
                    <span className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-burgundy-300" />
                        <span className="font-medium">1,447 Practitioners Enrolled</span>
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

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-burgundy-100/40 via-transparent to-transparent" />

                <div className="relative max-w-6xl mx-auto px-4 pt-12 pb-16 sm:pt-16 sm:pb-20">
                    {/* Badge */}
                    <div className="flex justify-center mb-6">
                        <div className="inline-flex items-center gap-2 bg-burgundy-50 border border-burgundy-200 rounded-full px-5 py-2.5 shadow-sm">
                            <Sparkles className="h-4 w-4 text-burgundy-600" />
                            <span className="text-sm font-semibold text-burgundy-700">Complete Professional Certification</span>
                        </div>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center text-slate-900 mb-5 leading-tight">
                        Become a <span className="text-burgundy-700">Certified</span><br />
                        Functional Medicine Practitioner
                    </h1>

                    {/* Subheadline */}
                    <p className="text-xl sm:text-2xl text-center text-slate-600 mb-4 max-w-4xl mx-auto">
                        21 specialized certifications. 168 lessons. 60+ hours of training.
                        <br />
                        <span className="font-bold text-slate-800">Graduate with a portfolio of credentials that prove your expertise.</span>
                    </p>

                    {/* Stats Row */}
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-8">
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                            <Star className="h-4 w-4 fill-gold-400 text-gold-400" />
                            <span className="font-bold text-slate-800">4.9</span>
                            <span className="text-slate-500">(823 reviews)</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                            <Users className="h-4 w-4 text-burgundy-600" />
                            <span className="font-bold text-slate-800">1,447</span>
                            <span className="text-slate-500">enrolled</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm">
                            <BookOpen className="h-4 w-4 text-burgundy-600" />
                            <span className="font-bold text-slate-800">80+</span>
                            <span className="text-slate-500">CEU hours</span>
                        </div>
                    </div>

                    {/* Hero Image - Course Bundle */}
                    <div className="max-w-4xl mx-auto mb-8">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                            <Image
                                src="https://learn.accredipro.academy/rails/active_storage/representations/redirect/eyJfcmFpbHMiOnsiZGF0YSI6MTMyLCJwdXIiOiJibG9iX2lkIn19--c6a8f1be4e0a8f1c8f1e0c8f1e0c8f1e0c8f1e0c/eyJfcmFpbHMiOnsiZGF0YSI6eyJmb3JtYXQiOiJ3ZWJwIiwicmVzaXplX3RvX2xpbWl0IjpbMTIwMCw2MzBdfSwicHVyIjoidmFyaWF0aW9uIn19--abc123/course-bundle.webp"
                                alt="Functional Medicine Complete Certification Bundle"
                                width={1200}
                                height={630}
                                className="w-full h-auto"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-burgundy-900/80 via-transparent to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <p className="text-gold-400 font-semibold mb-1">Complete Certification Bundle</p>
                                <h3 className="text-2xl font-bold">21 Modules • 21 Certificates • 1 Practitioner</h3>
                            </div>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <div className="flex flex-col items-center justify-center gap-4 mb-6">
                        <a href="https://sarah.accredipro.academy/fm-certification-access">
                            <Button className="w-full sm:w-auto bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-bold py-7 px-12 rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02]">
                                <GraduationCap className="h-5 w-5 mr-2" />
                                Start Your Certification — $197
                                <ArrowRight className="h-5 w-5 ml-2" />
                            </Button>
                        </a>
                        <p className="text-sm text-slate-500">
                            <span className="line-through text-slate-400">$497</span>
                            <span className="text-burgundy-600 font-bold ml-2">Save $300 Today</span>
                        </p>
                    </div>

                    <p className="text-center text-slate-500 flex items-center justify-center gap-2">
                        <Shield className="h-4 w-4 text-olive-600" />
                        30-day money-back guarantee • Lifetime access
                    </p>
                </div>
            </section>

            {/* Accreditation Logos */}
            <section className="py-8 bg-white border-y border-slate-100">
                <div className="max-w-5xl mx-auto px-4">
                    <p className="text-center text-sm text-slate-500 mb-4 uppercase tracking-wide font-medium">
                        Recognized by 9 International Accreditation Bodies
                    </p>
                    <Image
                        src="/all-logos.png"
                        alt="Accredited by CMA, IPHM, CPD, IAOTH, ICAHP, IGCT, CTAA, IHTCP, IIOHT"
                        width={900}
                        height={100}
                        className="w-full max-w-4xl mx-auto h-auto"
                    />
                </div>
            </section>

            {/* The Difference Section */}
            <section className="py-16 sm:py-20 bg-gradient-to-b from-burgundy-900 to-slate-900 text-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="text-gold-400 font-semibold mb-2 uppercase tracking-wide">What Makes Us Different</p>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            21 Certifications, Not Just 1
                        </h2>
                        <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                            Instead of a single, generic credential, you graduate with a <span className="text-gold-400 font-semibold">portfolio of focused certifications</span> that reflect your real expertise and professional growth.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {/* Other Programs */}
                        <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700">
                            <p className="text-red-400 font-semibold mb-4 flex items-center gap-2">
                                <span className="text-xl">✗</span> Other Programs
                            </p>
                            <ul className="space-y-3 text-slate-400">
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400">✗</span>
                                    One generic "Health Coach" certificate
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400">✗</span>
                                    No specialization options
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400">✗</span>
                                    Left alone after enrollment
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400">✗</span>
                                    Theory with no practical application
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-red-400">✗</span>
                                    No business or career support
                                </li>
                            </ul>
                        </div>

                        {/* AccrediPro */}
                        <div className="bg-gradient-to-br from-burgundy-800 to-burgundy-900 rounded-2xl p-6 border border-burgundy-600 ring-2 ring-gold-400/30">
                            <p className="text-gold-400 font-semibold mb-4 flex items-center gap-2">
                                <span className="text-xl">★</span> AccrediPro Academy
                            </p>
                            <ul className="space-y-3 text-slate-200">
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-olive-400 shrink-0" />
                                    <span><strong>21 specialized certificates</strong> — one per module</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-olive-400 shrink-0" />
                                    <span>Certified in Thyroid, Hormones, Gut Health, Autoimmune & more</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-olive-400 shrink-0" />
                                    <span>Private 1:1 mentorship until certified</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-olive-400 shrink-0" />
                                    <span>Real case studies & practical protocols</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-olive-400 shrink-0" />
                                    <span>Complete business & career launch support</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Master Certificate Preview */}
            <section className="py-16 sm:py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Your Master Credential</p>
                            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">
                                Certified Functional Medicine Practitioner
                            </h2>
                            <p className="text-lg text-slate-600 mb-6">
                                Upon completion, you earn the <strong className="text-slate-900">Certified Functional Medicine Practitioner</strong> designation — plus 21 individual specialty certificates that showcase your complete expertise.
                            </p>

                            <div className="space-y-4">
                                {[
                                    "Master certification with unique credential ID",
                                    "21 specialty certificates (one per module)",
                                    "80+ CEU hours for license renewal",
                                    "Verifiable credentials for LinkedIn & clients",
                                    "Lifetime validity — yours forever",
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <CheckCircle2 className="h-5 w-5 text-olive-600 shrink-0" />
                                        <span className="text-slate-700">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Certificate Image */}
                        <div className="relative">
                            <Image
                                src="/FUNCTIONAL_MEDICINE_CERTIFICATE.webp"
                                alt="Certified Functional Medicine Practitioner Certificate"
                                width={600}
                                height={450}
                                className="w-full rounded-2xl shadow-2xl border-4 border-gold-300"
                            />
                            <div className="absolute -bottom-4 -right-4 bg-burgundy-600 text-white rounded-xl px-4 py-2 shadow-lg">
                                <p className="text-sm font-bold">+ 21 Specialty Certificates</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Complete Curriculum */}
            <section className="py-16 sm:py-20 bg-gradient-to-b from-cream-50 to-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Complete Curriculum</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                            21 Modules. 21 Certifications.
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Each module builds your professional identity. Complete a module, earn a certificate.
                            <span className="font-semibold text-burgundy-700"> Graduate as a multi-certified specialist.</span>
                        </p>
                    </div>

                    {/* Specialty Certificates Preview */}
                    <div className="flex flex-wrap justify-center gap-2 mb-10">
                        {[
                            "Thyroid Specialist",
                            "Gut Health Specialist",
                            "Women's Hormone Specialist",
                            "Autoimmune Specialist",
                            "Menopause Specialist",
                            "Metabolic Health Coach",
                            "Functional Nutritionist",
                            "+ 14 more..."
                        ].map((cert, i) => (
                            <span key={i} className="bg-burgundy-50 text-burgundy-700 px-3 py-1.5 rounded-full text-sm font-medium border border-burgundy-100">
                                {cert}
                            </span>
                        ))}
                    </div>

                    {/* Module Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {CURRICULUM_MODULES.map((module, i) => (
                            <ModuleCard key={module.number} module={module} index={i} />
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <div className="inline-flex items-center gap-4 bg-gradient-to-r from-gold-50 to-gold-100 border border-gold-200 rounded-2xl px-8 py-4">
                            <div className="text-left">
                                <p className="text-gold-800 font-bold text-lg">168 Lessons • 60+ Hours • 80+ CEU</p>
                                <p className="text-gold-700">The most comprehensive FM certification available</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* What's Included - Dashboard & Tools */}
            <section className="py-16 sm:py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Complete Access</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                            Everything You Need to Succeed
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Full Dashboard */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all">
                            <div className="w-14 h-14 rounded-xl bg-burgundy-100 flex items-center justify-center mb-4">
                                <LayoutDashboard className="h-7 w-7 text-burgundy-600" />
                            </div>
                            <h3 className="font-bold text-xl text-slate-900 mb-2">Full Dashboard Access</h3>
                            <p className="text-slate-600 mb-3">
                                Your personal learning portal with progress tracking, certificates, and all resources in one place.
                            </p>
                            <p className="text-burgundy-600 font-semibold text-sm">Lifetime access included</p>
                        </div>

                        {/* Private Mentorship */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all">
                            <div className="w-14 h-14 rounded-xl bg-burgundy-100 flex items-center justify-center mb-4">
                                <HeartHandshake className="h-7 w-7 text-burgundy-600" />
                            </div>
                            <h3 className="font-bold text-xl text-slate-900 mb-2">Private Mentorship</h3>
                            <p className="text-slate-600 mb-3">
                                Your personal coach guides you through certification — answering questions, providing feedback, celebrating wins.
                            </p>
                            <p className="text-burgundy-600 font-semibold text-sm">Until you're fully certified</p>
                        </div>

                        {/* Coach Workspace */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all">
                            <div className="w-14 h-14 rounded-xl bg-burgundy-100 flex items-center justify-center mb-4">
                                <Laptop className="h-7 w-7 text-burgundy-600" />
                            </div>
                            <h3 className="font-bold text-xl text-slate-900 mb-2">Coach Workspace</h3>
                            <p className="text-slate-600 mb-3">
                                Professional client management system. Track clients, create protocols, manage your entire practice.
                            </p>
                            <p className="text-burgundy-600 font-semibold text-sm">Built-in practice tools</p>
                        </div>

                        {/* Career Launch */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all">
                            <div className="w-14 h-14 rounded-xl bg-burgundy-100 flex items-center justify-center mb-4">
                                <TrendingUp className="h-7 w-7 text-burgundy-600" />
                            </div>
                            <h3 className="font-bold text-xl text-slate-900 mb-2">Career Launch Support</h3>
                            <p className="text-slate-600 mb-3">
                                Your coach helps you plan your new career — pricing, niching, getting first clients, building income.
                            </p>
                            <p className="text-burgundy-600 font-semibold text-sm">Roadmap to $5K-$20K/month</p>
                        </div>

                        {/* Community */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all">
                            <div className="w-14 h-14 rounded-xl bg-burgundy-100 flex items-center justify-center mb-4">
                                <Users className="h-7 w-7 text-burgundy-600" />
                            </div>
                            <h3 className="font-bold text-xl text-slate-900 mb-2">Private Community</h3>
                            <p className="text-slate-600 mb-3">
                                1,400+ practitioners sharing wins, asking questions, collaborating. Never feel alone on this journey.
                            </p>
                            <p className="text-burgundy-600 font-semibold text-sm">Lifetime membership</p>
                        </div>

                        {/* Coaching Tips */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg transition-all">
                            <div className="w-14 h-14 rounded-xl bg-burgundy-100 flex items-center justify-center mb-4">
                                <Video className="h-7 w-7 text-burgundy-600" />
                            </div>
                            <h3 className="font-bold text-xl text-slate-900 mb-2">Coaching Tips & Stories</h3>
                            <p className="text-slate-600 mb-3">
                                Weekly insights from Sarah and successful graduates. Real strategies that work in the real world.
                            </p>
                            <p className="text-burgundy-600 font-semibold text-sm">Ongoing education</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Sarah's Story */}
            <section className="py-16 sm:py-20 bg-gradient-to-b from-cream-100 to-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex flex-col items-center text-center mb-8">
                        <Image
                            src="/coaches/sarah-coach.webp"
                            alt="Sarah Mitchell"
                            width={120}
                            height={120}
                            className="w-28 h-28 rounded-full object-cover shadow-lg border-4 border-white ring-4 ring-burgundy-100 mb-4"
                        />
                        <p className="text-burgundy-600 font-semibold uppercase tracking-wide text-sm">Your Lead Coach</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-2">
                            I'll Be With You Every Step
                        </h2>
                    </div>

                    <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100">
                        <div className="space-y-4 text-lg text-slate-600">
                            <p>
                                <strong className="text-slate-800">12 years as an ER nurse.</strong> I watched patients leave with prescriptions that would never fix their problems. I saw the system fail, over and over.
                            </p>
                            <p>
                                Then <span className="text-burgundy-700 font-semibold">I got sick.</span> Thyroid. Gut issues. Autoimmune symptoms. Doctors told me everything was "normal." I knew it wasn't.
                            </p>
                            <p>
                                Functional medicine didn't just heal me — it gave me a new purpose. Now I've helped <strong className="text-slate-800">1,447 practitioners</strong> launch their own practices. Many earn more than they did in traditional healthcare, working fewer hours.
                            </p>
                        </div>

                        <div className="mt-8 p-5 bg-gradient-to-r from-burgundy-50 to-gold-50 rounded-2xl border-l-4 border-burgundy-600">
                            <p className="text-burgundy-800 font-semibold text-lg mb-2">
                                "I don't just hand you a course and disappear. I mentor you personally until you're certified and confident."
                            </p>
                            <p className="text-slate-600">— Sarah Mitchell, Lead Coach</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-slate-100">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-burgundy-700">12+</p>
                                <p className="text-xs text-slate-500">Years as RN</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-burgundy-700">1,447</p>
                                <p className="text-xs text-slate-500">Practitioners Trained</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-burgundy-700">97%</p>
                                <p className="text-xs text-slate-500">Completion Rate</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Income Potential */}
            <section className="py-16 sm:py-20 bg-gradient-to-b from-olive-50 to-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="text-olive-600 font-semibold mb-2 uppercase tracking-wide">The Opportunity</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                            Your New Career Awaits
                        </h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Our certified practitioners are building practices from $3K to $20K+ per month.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-6 mb-8">
                        {[
                            { range: "$3K – $5K", period: "/month", desc: "Part-time practice", detail: "5-10 clients • 10-15 hrs/week" },
                            { range: "$6K – $10K", period: "/month", desc: "Full-time practice", detail: "15-25 clients • Replace job income", highlight: true },
                            { range: "$15K – $20K+", period: "/month", desc: "Premium practice", detail: "Group programs • Scaled business" },
                        ].map((tier, i) => (
                            <div key={i} className={`rounded-2xl p-6 text-center ${tier.highlight ? 'bg-olive-600 text-white ring-4 ring-olive-300 shadow-xl' : 'bg-white shadow-sm border border-olive-200'}`}>
                                <p className={`text-4xl font-black ${tier.highlight ? 'text-white' : 'text-olive-600'}`}>
                                    {tier.range}
                                    <span className="text-lg font-medium">{tier.period}</span>
                                </p>
                                <p className={`font-semibold text-lg mt-2 ${tier.highlight ? 'text-olive-100' : 'text-slate-800'}`}>{tier.desc}</p>
                                <p className={`text-sm mt-1 ${tier.highlight ? 'text-olive-200' : 'text-slate-500'}`}>{tier.detail}</p>
                            </div>
                        ))}
                    </div>

                    <p className="text-center text-slate-500 text-sm">
                        *Income ranges represent goals of certified practitioners. Results vary based on effort, background, and dedication.
                    </p>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 sm:py-20">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Success Stories</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                            What Our Graduates Say
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <Testimonial
                            quote="After 25 years as an ARNP, I was burned out. This certification gave me a complete career pivot. I now earn MORE than I did in the hospital, working 20 hours a week from home."
                            name="Karen Mitchell"
                            role="Former ARNP, Now FM Practitioner"
                            highlight="Complete career transformation."
                            avatarIndex={1}
                        />
                        <Testimonial
                            quote="The 21 specialty certificates are GOLD. When clients see I'm certified in thyroid, hormones, AND gut health — they trust me immediately. It sets me apart from every other coach."
                            name="Maria Santos"
                            role="FM Practitioner, California"
                            highlight="Now earning $8K/month."
                            avatarIndex={6}
                        />
                        <Testimonial
                            quote="I was skeptical at first — but Sarah's mentorship changed everything. She didn't just teach me, she helped me launch my practice. I got my first paying client within 2 weeks of finishing."
                            name="Jennifer Walsh"
                            role="Career Changer, Florida"
                            avatarIndex={7}
                        />
                        <Testimonial
                            quote="The Coach Workspace tool alone is worth the investment. I manage all my clients, track their progress, create protocols — everything in one place. So professional."
                            name="Lisa Rodriguez"
                            role="FM Practitioner, Texas"
                            avatarIndex={2}
                        />
                        <Testimonial
                            quote="I've taken other health certifications. They hand you a PDF and disappear. Here, Sarah literally messages you, checks on you, celebrates your wins. It's like having a business partner."
                            name="Amanda Chen"
                            role="Former Corporate, Now Coach"
                            avatarIndex={8}
                        />
                        <Testimonial
                            quote="The autoimmune and thyroid modules are incredibly deep. I work with Hashimoto's clients exclusively now, and my specialized certificates prove I actually know my stuff."
                            name="Patricia Smith"
                            role="Thyroid & Autoimmune Specialist"
                            highlight="$150/hour sessions."
                            avatarIndex={3}
                        />
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-16 sm:py-24 bg-gradient-to-b from-cream-50 to-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Investment</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
                            Complete Certification for $197
                        </h2>
                        <p className="text-lg text-slate-600">
                            One payment. Lifetime access. Personal mentorship until certified.
                        </p>
                    </div>

                    {/* Pricing Card */}
                    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden max-w-3xl mx-auto">
                        <div className="bg-gradient-to-r from-burgundy-700 to-burgundy-800 px-8 py-6 text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <GraduationCap className="h-6 w-6 text-gold-400" />
                                <span className="text-gold-400 font-semibold uppercase tracking-wide text-sm">Certified FM Practitioner</span>
                            </div>
                            <div className="flex items-center justify-center gap-4">
                                <span className="text-white/60 line-through text-2xl">$497</span>
                                <span className="text-5xl font-black text-white">$197</span>
                            </div>
                            <p className="text-burgundy-200 text-sm mt-2">Save $300 — Limited Time Offer</p>
                        </div>

                        <div className="p-8">
                            {/* What's Included */}
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-burgundy-600 uppercase tracking-wide mb-4 flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    Complete Training
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        "21 comprehensive modules",
                                        "168 video lessons",
                                        "60+ hours of training",
                                        "80+ CEU hours",
                                        "21 specialty certificates",
                                        "Master FM Practitioner cert",
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                                            <CheckCircle2 className="h-4 w-4 text-olive-600 shrink-0" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-burgundy-600 uppercase tracking-wide mb-4 flex items-center gap-2">
                                    <Users className="h-4 w-4" />
                                    Support & Community
                                </h3>
                                <div className="grid grid-cols-2 gap-3">
                                    {[
                                        "Private 1:1 mentorship",
                                        "1,400+ practitioner community",
                                        "Coach Workspace access",
                                        "Career launch support",
                                        "DFY protocols & templates",
                                        "Weekly coaching tips",
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                                            <CheckCircle2 className="h-4 w-4 text-olive-600 shrink-0" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* CTA */}
                            <a href="https://sarah.accredipro.academy/fm-certification-access" className="block">
                                <Button className="w-full bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-bold py-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all">
                                    <GraduationCap className="h-5 w-5 mr-2" />
                                    Start My Certification — $197
                                </Button>
                            </a>

                            <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs text-slate-500">
                                <span className="flex items-center gap-1">
                                    <Shield className="h-4 w-4 text-olive-600" />
                                    Secure checkout
                                </span>
                                <span>•</span>
                                <span>Instant access</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <CheckCircle2 className="h-4 w-4 text-olive-600" />
                                    30-day money-back guarantee
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Social Proof */}
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
                                <strong className="text-slate-800">1,447</strong> practitioners certified and practicing
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-16 sm:py-20 bg-cream-50">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Questions?</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 px-8">
                        <FAQItem
                            question="How long does the certification take?"
                            answer="The full certification is 60+ hours across 21 modules. Most students complete it in 3-6 months, studying a few hours per week. You have lifetime access, so you can go at your own pace. Your coach will help you create a realistic timeline based on your schedule."
                        />
                        <FAQItem
                            question="Do I really get 21 separate certificates?"
                            answer="Yes! Each of the 21 modules awards its own specialty certificate upon completion. So you graduate with certificates in Thyroid Health, Gut Health, Women's Hormones, Autoimmunity, and 17 more specialties. Plus the master Certified Functional Medicine Practitioner credential."
                        />
                        <FAQItem
                            question="What's included in the private mentorship?"
                            answer="You're assigned a personal coach who messages you throughout your journey. They check on your progress, answer questions, help you through challenging modules, and support you in launching your practice. They're with you until you're fully certified and confident."
                        />
                        <FAQItem
                            question="Can I work with clients after certification?"
                            answer="Yes! Upon completing the full certification, you'll be qualified to work as a Functional Medicine Health Coach. You'll have the credentials, knowledge, protocols, and business training to start seeing clients. Many graduates land their first client within weeks of finishing."
                        />
                        <FAQItem
                            question="What's the Coach Workspace?"
                            answer="It's a professional client management system built into your dashboard. You can track client progress, create custom protocols, manage appointments, and run your entire practice from one place. It's designed specifically for FM practitioners."
                        />
                        <FAQItem
                            question="How much can I earn as a certified practitioner?"
                            answer="Our certified practitioners are building toward $3K-$20K+ per month, depending on whether they work part-time or full-time, do 1:1 coaching or group programs. The field is growing 15%+ annually, and there's high demand for trained practitioners. Your coach will help you create a realistic income plan."
                        />
                        <FAQItem
                            question="What's your refund policy?"
                            answer="We offer a full 30-day money-back guarantee. If you're not satisfied for any reason, just email us and we'll refund your $197. No questions asked. We're confident you'll love it, but we want you to feel completely safe investing in yourself."
                        />
                    </div>
                </div>
            </section>

            {/* Guarantee */}
            <section className="py-16 sm:py-20">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <div className="bg-gradient-to-br from-olive-50 to-white rounded-3xl p-10 border-2 border-olive-200">
                        <div className="w-20 h-20 rounded-full bg-olive-100 flex items-center justify-center mx-auto mb-6">
                            <Shield className="h-10 w-10 text-olive-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">
                            100% Money-Back Guarantee
                        </h2>
                        <p className="text-lg text-slate-600 mb-6 max-w-xl mx-auto">
                            Enroll today, explore the content, meet your coach. If it's not right for you, email us within 30 days for a full refund. No questions asked.
                        </p>
                        <p className="text-2xl font-bold text-olive-700">
                            Your investment is completely protected.
                        </p>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 sm:py-28 bg-gradient-to-b from-burgundy-900 to-slate-900 text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <p className="text-gold-400 font-semibold mb-4 uppercase tracking-wide">Your Transformation Starts Now</p>
                    <h2 className="text-3xl sm:text-5xl font-bold mb-6">
                        Become a Certified<br />Functional Medicine Practitioner
                    </h2>
                    <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
                        21 certifications. 168 lessons. Private mentorship. Complete career launch support. Everything you need to build a $5K-$20K/month practice.
                    </p>

                    {/* Quick Summary */}
                    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-10 max-w-2xl mx-auto">
                        <p className="text-gold-400 font-semibold mb-6 text-lg">Everything included for $197:</p>
                        <div className="grid grid-cols-2 gap-4 text-left">
                            {[
                                "21 modules (168 lessons)",
                                "21 specialty certificates",
                                "Master FM Practitioner cert",
                                "60+ hours of training",
                                "Private 1:1 mentorship",
                                "Coach Workspace access",
                                "Career launch support",
                                "Lifetime community access",
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-olive-400 shrink-0" />
                                    <span className="text-slate-200">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="mb-8">
                        <p className="text-slate-400 mb-2">Complete Investment</p>
                        <p className="text-6xl font-black text-gold-400 mb-2">$197</p>
                        <p className="text-slate-400">One-time payment • Lifetime access • Save $300</p>
                    </div>

                    <a href="https://sarah.accredipro.academy/fm-certification-access">
                        <Button className="w-full sm:w-auto bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-slate-900 font-black py-8 px-14 rounded-2xl text-xl shadow-2xl transition-all transform hover:scale-[1.02]">
                            Start My Certification — $197
                            <ArrowRight className="h-6 w-6 ml-3" />
                        </Button>
                    </a>

                    <div className="flex flex-wrap justify-center gap-6 mt-8 text-slate-400">
                        <span className="flex items-center gap-2">
                            <Shield className="h-5 w-5 text-olive-400" />
                            Secure checkout
                        </span>
                        <span className="flex items-center gap-2">
                            <Zap className="h-5 w-5 text-gold-400" />
                            Instant access
                        </span>
                        <span className="flex items-center gap-2">
                            <CheckCircle2 className="h-5 w-5 text-olive-400" />
                            30-day guarantee
                        </span>
                    </div>

                    <p className="text-slate-500 mt-10">
                        Join 1,447 practitioners who chose to transform their careers with AccrediPro Academy.
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
                        *Income ranges represent goals of certified practitioners. Results vary based on effort, background, and dedication. Certification qualifies you to work as a Functional Medicine Health Coach.
                    </p>
                    <p>© 2025 AccrediPro Academy. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
