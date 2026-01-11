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
    Stethoscope, AlertCircle, CalendarDays, Home, Linkedin
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
const Testimonial = ({ quote, name, role, before, after, income, avatarIndex = 0 }: {
    quote: string;
    name: string;
    role: string;
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

// Recent Enrollment Toast Component
const RecentEnrollmentToast = () => {
    const [visible, setVisible] = useState(false);
    const [currentEnrollment, setCurrentEnrollment] = useState(0);

    const enrollments = [
        { name: 'Sarah K.', location: 'Texas', time: '2 min ago', avatarIndex: 0 },
        { name: 'Michelle R.', location: 'California', time: '5 min ago', avatarIndex: 3 },
        { name: 'Jennifer L.', location: 'Florida', time: '8 min ago', avatarIndex: 6 },
        { name: 'Amanda P.', location: 'New York', time: '12 min ago', avatarIndex: 4 },
        { name: 'Lisa M.', location: 'Ohio', time: '15 min ago', avatarIndex: 1 },
        { name: 'Maria G.', location: 'Arizona', time: '18 min ago', avatarIndex: 5 },
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
                    <p className="text-slate-500 text-xs line-through">$47</p>
                    <p className="text-2xl font-black text-burgundy-700">$27 <span className="text-xs text-red-600 font-bold">Save $20</span></p>
                </div>
                <a href="https://sarah.accredipro.academy/fm-mini-diploma-access" className="flex-1">
                    <Button className="w-full bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-bold py-4 rounded-xl">
                        Get R.O.O.T.S. Certified
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

export default function ROOTSMethodPage() {
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

            {/* Christmas Discount Banner */}
            <div className="bg-gradient-to-r from-red-600 via-red-500 to-green-600 text-white py-2.5 px-4">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm">
                    <span className="flex items-center gap-2 font-bold">
                        <span className="text-lg">🎄</span>
                        Christmas Discount: Save $20!
                    </span>
                    <span className="hidden sm:block text-white/60">|</span>
                    <span className="text-white/90">Until <strong>December 26th</strong></span>
                    <span className="hidden sm:block text-white/60">|</span>
                    <span className="flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-bold">
                        <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                        Only 17 spots left
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

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-burgundy-100/40 via-transparent to-transparent" />

                <div className="relative max-w-6xl mx-auto px-4 pt-10 pb-12 sm:pt-14 sm:pb-16">
                    <div className="flex justify-center mb-4">
                        <div className="inline-flex items-center gap-2 bg-burgundy-50 border border-burgundy-200 rounded-full px-4 py-2 shadow-sm">
                            <Stethoscope className="h-4 w-4 text-burgundy-600" />
                            <span className="text-sm font-semibold text-burgundy-700">For Licensed Healthcare Workers Ready to Break Free</span>
                        </div>
                    </div>

                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-slate-900 mb-4 leading-tight">
                        Become a <span className="text-burgundy-700">Certified Integrative Health<br className="hidden sm:block" /> & Functional Medicine Coach</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-center text-slate-700 mb-2 max-w-3xl mx-auto font-semibold">
                        Stop Chasing Symptoms. Start Getting Root-Cause Results Using the R.O.O.T.S. Method™
                    </p>
                    <p className="text-base sm:text-lg text-center text-slate-600 mb-6 max-w-3xl mx-auto">
                        The 5-step framework for healing clients AND building a $5K/month practice — using the clinical skills you already have.
                    </p>

                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6 text-sm">
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-slate-200">
                            <BookOpen className="h-4 w-4 text-burgundy-600" />
                            <span className="text-slate-700">9 lessons</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-slate-200">
                            <Clock className="h-4 w-4 text-burgundy-600" />
                            <span className="text-slate-700">Self-paced</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-slate-200">
                            <Award className="h-4 w-4 text-burgundy-600" />
                            <span className="text-slate-700">CMA Internationally Accredited</span>
                        </div>
                    </div>

                    <div className="flex justify-center mb-6">
                        <Image
                            src="https://coach.accredipro.academy/wp-content/uploads/2025/12/CMA-Accredited-course.jpeg"
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
                                <strong className="text-slate-800">843+</strong> healthcare professionals certified — RNs, NPs, PAs, LPNs & Allied Health
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-4 mb-6">
                        <a href="https://sarah.accredipro.academy/fm-mini-diploma-access">
                            <Button className="w-full sm:w-auto bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-bold py-7 px-12 rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02]">
                                <GraduationCap className="h-5 w-5 mr-2" />
                                Get R.O.O.T.S. Certified — $27
                                <span className="ml-2 line-through text-white/60 text-sm">$47</span>
                                <span className="ml-2 text-yellow-300 text-sm">🎄 Save $20!</span>
                            </Button>
                        </a>
                    </div>

                    <p className="text-center text-slate-500 flex items-center justify-center gap-2 text-sm">
                        <Shield className="h-4 w-4 text-olive-600" />
                        30-day money-back guarantee • Instant access • Certificate included
                    </p>
                </div>
            </section>

            {/* Sarah Intro Section */}
            <section className="py-12 sm:py-16 bg-gradient-to-b from-cream-100 to-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex flex-col items-center text-center mb-8">
                        <Image src="/coaches/sarah-coach.webp" alt="Sarah Mitchell" width={120} height={120} className="w-28 h-28 rounded-full object-cover shadow-lg border-4 border-white ring-4 ring-burgundy-100 mb-4" />
                        <p className="text-burgundy-600 font-semibold uppercase tracking-wide text-sm">Hi, I'm Sarah</p>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2">
                            I Left 12-Hour Shifts Behind. Made More Money. Actually Helped People Heal.
                        </h2>
                    </div>

                    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
                        <div className="space-y-4 text-lg text-slate-600">
                            <p className="font-semibold text-slate-800">I was you.</p>
                            <p>20 years in healthcare. Drowning in charting. Watching patients leave with prescriptions that wouldn't fix anything. Coming home too exhausted to be present for my own family.</p>
                            <p>Then <span className="text-burgundy-700 font-semibold">my health crashed.</span> Thyroid. Gut issues. Brain fog so bad I thought I was losing it.</p>
                            <p>Doctors told me I was "fine." Labs were "normal."</p>
                            <p className="font-semibold text-burgundy-700 text-xl">Sound familiar?</p>
                            <p>I discovered functional medicine. Healed myself first. Then realized I could use everything I already knew as a healthcare professional — and actually get paid to help people get REAL answers.</p>
                            <p className="font-semibold text-slate-800">That's when I created the R.O.O.T.S. Method™.</p>
                        </div>

                        <div className="mt-8 p-5 bg-gradient-to-r from-burgundy-50 to-gold-50 rounded-2xl border-l-4 border-burgundy-600">
                            <p className="text-burgundy-800 font-semibold text-lg mb-3">A simple 5-step framework that shows you exactly how to:</p>
                            <ul className="space-y-2">
                                {["Help clients find what doctors miss", "Build a flexible practice around YOUR life", "Earn $75-150/hour working from home"].map((item, i) => (
                                    <li key={i} className="flex items-center gap-2 text-slate-700">
                                        <CheckCircle2 className="h-5 w-5 text-olive-600 shrink-0" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <p className="text-slate-600 mt-6 text-center">I've now certified <strong className="text-slate-800">843+ healthcare professionals</strong> in this method. This is where your journey starts.</p>

                        <div className="grid grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100">
                            {[
                                { value: "20+", label: "Years Clinical Experience" },
                                { value: "843+", label: "Healthcare Pros Certified" },
                                { value: "$75-150", label: "What Graduates Charge/hr" },
                                { value: "$5K+", label: "Part-Time Practice Goal/mo" },
                            ].map((stat, i) => (
                                <div key={i} className="text-center">
                                    <p className="text-xl sm:text-2xl font-bold text-burgundy-700">{stat.value}</p>
                                    <p className="text-xs text-slate-500">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 text-center">
                            <a href="https://sarah.accredipro.academy/fm-mini-diploma-access">
                                <Button className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-bold py-5 px-8 rounded-xl text-lg shadow-lg">
                                    Get Certified in the R.O.O.T.S. Method™ — $27
                                    <ArrowRight className="h-5 w-5 ml-2" />
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Problem Section */}
            <section className="py-12 sm:py-16 bg-slate-900 text-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">You Already Know the System Is Broken</h2>
                        <p className="text-xl text-slate-300">You didn't go into healthcare to:</p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
                        {[
                            "Spend 7 minutes with patients and 2 hours charting",
                            "Watch the same patients return with the same problems",
                            "Hand out prescriptions that mask symptoms instead of fixing causes",
                            "Work exhausting shifts and still stress about bills",
                            "Come home too drained to enjoy your actual life",
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-3 bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                                <X className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                                <span className="text-slate-300">{item}</span>
                            </div>
                        ))}
                    </div>

                    <div className="grid sm:grid-cols-3 gap-6 mb-10">
                        {[
                            { stat: "7 min", desc: "Average doctor visit" },
                            { stat: "90%", desc: "Chronic disease costs from preventable causes" },
                            { stat: "$0", desc: "What you earn helping people on your own time" },
                        ].map((item, i) => (
                            <div key={i} className="bg-slate-800/50 rounded-2xl p-6 text-center border border-slate-700">
                                <p className="text-4xl font-bold text-burgundy-400 mb-2">{item.stat}</p>
                                <p className="text-slate-400">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <p className="text-lg text-slate-300 mb-2">The system wasn't built to help people heal. It was built to manage disease.</p>
                        <p className="text-xl text-white font-semibold mb-2">You've seen patients who needed MORE than what the system allows you to give.</p>
                        <p className="text-lg text-slate-300 mb-4">You've probably BEEN that patient yourself.</p>
                        <p className="text-2xl font-bold text-gold-400">There's a different path. Your nursing background is exactly what qualifies you for it.</p>
                    </div>
                </div>
            </section>

            {/* Introducing the R.O.O.T.S. Method */}
            <section className="py-12 sm:py-16">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 bg-burgundy-100 border border-burgundy-200 rounded-full px-5 py-2 mb-4">
                            <Sparkles className="h-4 w-4 text-burgundy-600" />
                            <span className="text-sm font-bold text-burgundy-700">THE COMPLETE SYSTEM</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Introducing the R.O.O.T.S. Method™</h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">The 5-Step Framework for Healing Clients AND Building Your Practice</p>
                        <p className="text-slate-500 mt-2">Most functional medicine training teaches you theory. Or it teaches you business. Rarely both.<br />The R.O.O.T.S. Method™ gives you the complete system:</p>
                    </div>

                    <div className="space-y-4">
                        <ROOTSStep letter="R" title="RECOGNIZE THE PATTERN" description="Symptoms aren't random. Learn to see the connections doctors miss — the patterns that reveal what's really going on." example="Why does she have fatigue AND brain fog AND weight gain? Because they're connected." icon={Brain} />
                        <ROOTSStep letter="O" title="FIND THE ORIGIN" description="Go upstream. Use the timeline technique to find when health broke down, what triggered it, and what's keeping it stuck." example="It started after her second pregnancy, got worse during her divorce, and never recovered." icon={Compass} />
                        <ROOTSStep letter="O" title="OPTIMIZE THE FOUNDATIONS" description="Address the 5 pillars that control everything: Nutrition, Movement, Sleep, Stress, Environment. This is where transformation happens." example="We don't add more pills. We fix what's actually broken." icon={Layers} />
                        <ROOTSStep letter="T" title="TRANSFORM WITH COACHING" description="Be the accountability they've never had. Guide them through implementation. This is why coaches succeed where doctors fail — you have TIME." example="Her doctor gave her 7 minutes. You give her 7 weeks." icon={Users2} />
                        <ROOTSStep letter="S" title="SCALE YOUR PRACTICE" description="Get paid. Get clients. Build income. Learn exactly how to price your services, find your first clients, and build a $5K/month practice while still employed." example="This isn't a hobby. This is your exit strategy." icon={Scale} />
                    </div>

                    <div className="mt-10 text-center">
                        <p className="text-lg text-slate-600 mb-6">This certification makes you a <strong className="text-burgundy-700">R.O.O.T.S. Method™ Practitioner</strong> — not just someone who "knows about" functional medicine.</p>
                        <a href="https://sarah.accredipro.academy/fm-mini-diploma-access">
                            <Button className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-bold py-6 px-10 rounded-xl text-lg shadow-lg">
                                Get R.O.O.T.S. Certified — $27
                                <ArrowRight className="h-5 w-5 ml-2" />
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* Curriculum Section */}
            <section className="py-12 sm:py-16 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 bg-burgundy-100 border border-burgundy-200 rounded-full px-5 py-2 mb-4">
                            <BookOpen className="h-4 w-4 text-burgundy-600" />
                            <span className="text-sm font-bold text-burgundy-700">COMPLETE CURRICULUM</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">What You'll Learn Inside</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">9 comprehensive lessons covering the foundations, the R.O.O.T.S. Method™ framework, and how to build your practice.</p>
                    </div>

                    <div className="space-y-4">
                        <CurriculumModule
                            title="Foundation"
                            defaultOpen={true}
                            lessons={[
                                { number: 1, title: "From Burnout to Purpose", description: "Why healthcare is broken for practitioners AND patients — and how integrative health coaching gives you a way out that actually aligns with why you became a nurse in the first place." },
                                { number: 2, title: "Your Clinical Advantage Assessment", description: "What you already know that most coaches don't. The skills that transfer directly. What (minimal) gaps you need to fill. And why your background is your biggest competitive advantage." },
                            ]}
                        />
                        <CurriculumModule
                            title="The R.O.O.T.S. Method™"
                            lessons={[
                                { number: 3, title: "The R.O.O.T.S. Framework Overview", description: "The complete 5-step system for getting root-cause results. How each step builds on the previous. Why this method works when symptom-chasing fails." },
                                { number: 4, title: "R — Recognize the Pattern", description: "Stop seeing symptoms in isolation. Learn to connect the dots that doctors miss. Intake questions that reveal the real story. Pattern recognition that changes outcomes." },
                                { number: 5, title: "O — Find the Origin", description: "Go upstream. The timeline technique that reveals when health broke down — and why. Finding the triggers that started the cascade. Identifying what's keeping them stuck." },
                                { number: 6, title: "O — Optimize the Foundations", description: "The 5 pillars that control everything: Nutrition, Movement, Sleep, Stress, Environment. Practical interventions for each. Why foundations trump supplements every time." },
                                { number: 7, title: "T — Transform with Coaching", description: "Be the accountability they've never had. Session structure that gets results. Progress tracking that proves your value. Why coaches succeed where doctors fail — you have TIME." },
                            ]}
                        />
                        <CurriculumModule
                            title="Build Your Practice"
                            lessons={[
                                { number: 8, title: "S — Scale Your Practice (The Money Lesson)", description: "Get paid. Get clients. Build income. What to charge ($75-150/hr is normal). The exact math for $5K/month. How to get your first 5 clients while still employed. Packages that sell." },
                                { number: 9, title: "Case Study + Your 90-Day Roadmap", description: "Real case study: From intake to transformation using R.O.O.T.S. Your personal 90-day action plan. What to do in weeks 1-4, 5-8, 9-12. The path from certification to first paying clients." },
                            ]}
                        />
                    </div>

                    <div className="mt-10 text-center">
                        <a href="https://sarah.accredipro.academy/fm-mini-diploma-access">
                            <Button className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-bold py-6 px-10 rounded-xl text-lg shadow-lg">
                                Start Learning Today — $27
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
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Your Official Certification</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Complete the program and receive your R.O.O.T.S. Method™ Practitioner Certificate.</h2>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-10 items-center">
                        <div className="relative">
                            <Image src="/roots-certificate.png" alt="R.O.O.T.S. Method Practitioner Certificate" width={600} height={450} className="w-full rounded-2xl shadow-2xl border-4 border-gold-300" />
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-slate-900 mb-6">What you'll receive:</h3>
                            <div className="space-y-4">
                                {[
                                    { icon: FileCheck, text: "Official AccrediPro certificate with unique credential ID" },
                                    { icon: Award, text: "R.O.O.T.S. Method™ Practitioner designation" },
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

            {/* Testimonials Section */}
            <section className="py-12 sm:py-16 bg-gradient-to-b from-cream-50 to-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Real Transformations</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Healthcare Professionals Who Made the Transition</h2>
                        <p className="text-xl text-slate-600">They were exactly where you are. Here's where they are now.</p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6 mb-10">
                        <Testimonial
                            name="Linda Thompson, 52"
                            role="ER Nurse, 23 Years — Texas"
                            before="Burned out, watching patients leave with pills that wouldn't fix anything."
                            after="Runs her own R.O.O.T.S.-based practice from home. 3-week client waitlist."
                            quote="The R.O.O.T.S. Method gave me a SYSTEM — not just information. I finally feel like I'm actually helping people heal. And I make more in 20 hours than I did in 40."
                            income="$125/hr | $6K/month part-time"
                            avatarIndex={0}
                        />
                        <Testimonial
                            name="Maria Santos, 47"
                            role="Former Med-Surg RN — California"
                            before="Hashimoto's for 8 years. Doctors just kept adjusting meds. Exhausted, gaining weight."
                            after="Healed herself first using root-cause principles. Now coaches other women with thyroid issues from home."
                            quote="The R.O.O.T.S. framework is exactly what I use with every client. My clients trust me because I've LIVED it — and now I have a real METHOD to help them."
                            income="$1,700/week"
                            avatarIndex={5}
                        />
                    </div>

                    <div className="mt-8 text-center">
                        <a href="https://sarah.accredipro.academy/fm-mini-diploma-access">
                            <Button className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-bold py-6 px-10 rounded-xl text-lg shadow-lg">
                                Join 843+ Healthcare Professionals — Get R.O.O.T.S. Certified for $27
                                <ArrowRight className="h-5 w-5 ml-2" />
                            </Button>
                        </a>
                    </div>
                </div>
            </section>

            {/* Everything You Get Section */}
            <section id="pricing" className="py-12 sm:py-16 bg-gradient-to-b from-cream-50 to-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Everything You Get for $27</h2>
                        <p className="text-lg text-slate-600">One payment. Lifetime certificate. The complete method.</p>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                        <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 px-8 py-6 text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <GraduationCap className="h-6 w-6 text-gold-400" />
                                <span className="text-gold-400 font-semibold uppercase tracking-wide text-sm">R.O.O.T.S. Method™ Certification</span>
                            </div>
                            <div className="flex items-center justify-center gap-4">
                                <span className="text-white/60 line-through text-2xl">$47</span>
                                <span className="text-5xl font-black text-white">$27</span>
                            </div>
                            <p className="text-yellow-300 text-sm mt-2 font-semibold">🎄 Christmas Discount Until Dec 26</p>
                        </div>

                        <div className="p-6 sm:p-8">
                            <div className="mb-8">
                                <h3 className="text-sm font-bold text-burgundy-600 uppercase tracking-wide mb-4 flex items-center gap-2">
                                    <BookOpen className="h-4 w-4" />
                                    Complete R.O.O.T.S. Training (9 Lessons)
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {[
                                        "Lesson 1: From Burnout to Purpose",
                                        "Lesson 2: Your Clinical Advantage Assessment",
                                        "Lesson 3: The R.O.O.T.S. Framework Overview",
                                        "Lesson 4: R — Recognize the Pattern",
                                        "Lesson 5: O — Find the Origin",
                                        "Lesson 6: O — Optimize the Foundations",
                                        "Lesson 7: T — Transform with Coaching",
                                        "Lesson 8: S — Scale Your Practice (The Money Lesson)",
                                        "Lesson 9: Case Study + Your 90-Day Roadmap",
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-slate-700 p-2 bg-cream-50 rounded-lg">
                                            <CheckCircle2 className="h-4 w-4 text-olive-600 shrink-0" />
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-slate-100 rounded-xl p-4 text-center mb-6">
                                <p className="text-slate-500 text-sm">Total Value:</p>
                                <p className="text-2xl font-bold text-slate-800">$1,344</p>
                                <p className="text-burgundy-700 font-bold text-lg">Your Price: $27</p>
                            </div>

                            <a href="https://sarah.accredipro.academy/fm-mini-diploma-access" className="block">
                                <Button className="w-full bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-bold py-6 rounded-xl text-lg shadow-lg hover:shadow-xl transition-all">
                                    <GraduationCap className="h-5 w-5 mr-2" />
                                    Get R.O.O.T.S. Certified — $27
                                </Button>
                            </a>

                            <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs text-slate-500">
                                <span className="flex items-center gap-1"><Shield className="h-4 w-4 text-olive-600" />Secure checkout</span>
                                <span>•</span>
                                <span>Instant access</span>
                                <span>•</span>
                                <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-olive-600" />30-day money-back guarantee</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-12 sm:py-16 bg-cream-50">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Frequently Asked Questions</h2>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 px-6 sm:px-8">
                        <FAQItem question="What is the R.O.O.T.S. Method™?" answer="R.O.O.T.S. stands for: Recognize, Origin, Optimize, Transform, Scale. It's our proprietary 5-step framework that teaches you both how to help clients get root-cause results AND how to build a profitable practice. Most trainings teach one or the other — this teaches both." />
                        <FAQItem question="Can I really transition from traditional healthcare to this?" answer="Yes — licensed healthcare professionals actually have a massive advantage. You already understand anatomy, physiology, labs, and patient communication. The R.O.O.T.S. Method builds on what you know. Lesson 2 shows you exactly which skills transfer and what (minimal) gaps you need to fill." />
                        <FAQItem question="Will this actually help me make money?" answer="Lesson 8 is entirely about building your practice — what to charge, how to get clients, the exact math for $5K/month. This isn't theory. It's a business plan. Most graduates start with 3-5 clients while still employed, then scale from there." />
                        <FAQItem question="How long does it take to complete?" answer="Most healthcare professionals finish in 1-2 weeks going at their own pace. Some power through in a weekend. Work around your schedule — no pressure, no deadlines." />
                        <FAQItem question="What's the refund policy?" answer="100% money-back guarantee. Complete the certification, and if you don't feel it was worth $27, email us within 30 days for a full refund. No questions. No hassle." />
                    </div>
                </div>
            </section>

            {/* Guarantee Section */}
            <section className="py-12 sm:py-16">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <div className="bg-gradient-to-br from-olive-50 to-white rounded-3xl p-10 border-2 border-olive-200">
                        <div className="w-20 h-20 rounded-full bg-olive-100 flex items-center justify-center mx-auto mb-6">
                            <Shield className="h-10 w-10 text-olive-600" />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">100% Money-Back Guarantee</h2>
                        <p className="text-lg text-slate-600 mb-4 max-w-xl mx-auto">
                            Complete the R.O.O.T.S. certification. If you don't feel it was worth your investment, email us within 30 days for a full refund.
                        </p>
                        <p className="text-slate-500 mb-4">No questions. No hassle. No hard feelings.</p>
                        <p className="text-2xl font-bold text-olive-700">You risk nothing. You gain a method, a certificate, and a path forward.</p>
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="py-16 sm:py-24 bg-gradient-to-b from-burgundy-900 to-slate-900 text-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">You Went Into Healthcare to Help People Heal.</h2>
                    <p className="text-xl text-slate-300 mb-6">The System Won't Let You. The R.O.O.T.S. Method™ Will.</p>

                    <p className="text-slate-400 mb-8">
                        843+ healthcare professionals have already made this transition.<br />
                        They're working from home. Setting their own hours. Earning $75-150/hour.<br />
                        Actually helping people get better — not just managing their decline.
                    </p>

                    <p className="text-gold-400 font-semibold text-lg mb-8">
                        Your clinical background isn't a limitation. It's your biggest advantage.<br />
                        The R.O.O.T.S. Method gives you the framework to use it.
                    </p>

                    <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 sm:p-8 mb-8 max-w-2xl mx-auto">
                        <p className="text-gold-400 font-semibold mb-4">Everything you get for $27:</p>
                        <div className="grid grid-cols-2 gap-3 text-left text-sm">
                            {[
                                "Complete R.O.O.T.S. Method™ Training (9 Lessons)",
                                "Official Practitioner Certificate (Internationally Accredited)",
                                "Private Nurse Community Access",
                                "Lesson 8: Scale Your Practice (The Money Lesson)",
                                "90-Day Roadmap to First Clients",
                                "6 Graduate Bonus Resources ($497 value)",
                                "30-Day Money-Back Guarantee",
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-olive-400 shrink-0 mt-0.5" />
                                    <span className="text-slate-200">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mb-8">
                        <p className="text-slate-400 mb-2">Total Value: $1,344</p>
                        <p className="text-5xl font-black text-gold-400 mb-2">$27</p>
                        <p className="text-slate-400">One-time payment • Instant access • Lifetime certificate</p>
                    </div>

                    <a href="https://sarah.accredipro.academy/fm-mini-diploma-access">
                        <Button className="w-full sm:w-auto bg-gradient-to-r from-gold-400 to-gold-500 hover:from-gold-500 hover:to-gold-600 text-slate-900 font-black py-8 px-14 rounded-2xl text-xl shadow-2xl hover:shadow-3xl transition-all transform hover:scale-[1.02]">
                            Get R.O.O.T.S. Certified — $27
                            <ArrowRight className="h-6 w-6 ml-3" />
                        </Button>
                    </a>

                    <div className="flex flex-wrap justify-center gap-6 mt-8 text-slate-400 text-sm">
                        <span className="flex items-center gap-2"><Shield className="h-5 w-5 text-olive-400" />Secure checkout</span>
                        <span className="flex items-center gap-2"><Zap className="h-5 w-5 text-gold-400" />Instant access</span>
                        <span className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-olive-400" />30-day guarantee</span>
                    </div>

                    <p className="text-slate-500 mt-8">Join 843+ healthcare professionals who stopped waiting and started building.</p>

                    <div className="mt-8">
                        <Image
                            src="https://coach.accredipro.academy/wp-content/uploads/2025/12/CMA-Accredited-course.jpeg"
                            alt="CMA Accredited Course"
                            width={120}
                            height={60}
                            className="h-8 sm:h-10 w-auto mx-auto opacity-70"
                        />
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 bg-slate-900 text-slate-500 text-center text-sm">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <GraduationCap className="h-6 w-6 text-burgundy-500" />
                        <span className="font-semibold text-slate-300">AccrediPro Academy</span>
                    </div>
                    <p className="mb-4 max-w-3xl mx-auto text-xs">
                        © {new Date().getFullYear()} AccrediPro Academy. All rights reserved.<br />
                        R.O.O.T.S. Method™ is a trademark of AccrediPro Academy. This certification provides foundational education in integrative health, functional medicine principles, and practice-building. Income examples represent graduate goals and vary based on effort, background, and dedication. Full certification available for graduates who want to go deeper.
                    </p>
                </div>
            </footer>
        </div>
    );
}
