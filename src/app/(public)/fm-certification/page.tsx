"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
    GraduationCap, CheckCircle2, Clock, Users, Award,
    Shield, MessageCircle, BookOpen, ArrowRight,
    ChevronDown, ChevronUp, Star, Heart, Zap,
    TrendingUp, Target, Play, Sparkles, X,
    HeartHandshake, Laptop, Quote, Calendar,
    Brain, Flame, Activity, Leaf, Sun, Moon, Dumbbell,
    Stethoscope, LayoutDashboard, Video, AlertCircle, Timer,
    Gift, Infinity, DollarSign, Lock, BadgeCheck, Globe2
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Fixed student avatars from CSV - professional headshots only
const ALL_STUDENT_AVATARS = [
    "https://accredipro.academy/wp-content/uploads/2025/12/AI_Headshot_Generator-13.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/LeezaRhttilthead.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/Head-shot-dark-background-1.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/Profile-Pic.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/MICHELLEM047.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/AnneProfile2.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/MARIA-GARCIA-PIC-IMG_5435-1.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_3542-Profile-Picture-Updated.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/dgp03315.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/Headshot-Ines.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/Shondra_Williams_Business_Headshot-scaled.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/Tiffany-Nelson-MD.webp",
    "https://accredipro.academy/wp-content/uploads/2025/11/Liz-Sept-2023-headshot.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/11/2023-Lambert-163.jpeg",
    "https://accredipro.academy/wp-content/uploads/2025/11/Tammie-15.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/11/CraftRealty2024-6337-EditHiRes.jpeg",
    "https://accredipro.academy/wp-content/uploads/2025/10/headshot-1.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/10/DSC_9240-2.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/09/headshot.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/08/Headshot-1.jpg",
];

// Fixed testimonial avatars - specific headshots for each testimonial
const TESTIMONIAL_AVATARS = [
    "https://accredipro.academy/wp-content/uploads/2025/12/AI_Headshot_Generator-13.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/MARIA-GARCIA-PIC-IMG_5435-1.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/AnneProfile2.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/LeezaRhttilthead.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/Profile-Pic.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/11/Liz-Sept-2023-headshot.jpg",
];

// Function to get random avatars
const getRandomAvatars = (count: number, exclude: number[] = []) => {
    const available = ALL_STUDENT_AVATARS.filter((_, i) => !exclude.includes(i));
    const shuffled = [...available].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count);
};

// Get random avatar index
const getRandomAvatarIndex = (exclude: number[] = []) => {
    const available = ALL_STUDENT_AVATARS.map((_, i) => i).filter(i => !exclude.includes(i));
    return available[Math.floor(Math.random() * available.length)];
};

// Complete curriculum with 21 modules (0-20)
const CURRICULUM_MODULES = [
    { number: 0, title: "Welcome & Orientation", certificate: "Certified FM Practitioner (Foundation)", lessons: 5, description: "Get oriented and ready for your transformation journey", icon: GraduationCap },
    { number: 1, title: "Functional Medicine Foundations", certificate: "Certified in FM Foundations", lessons: 8, description: "Core principles that set functional medicine apart", icon: BookOpen },
    { number: 2, title: "Health Coaching Mastery", certificate: "Certified Health Coach", lessons: 10, description: "Communication skills that transform client outcomes", icon: MessageCircle },
    { number: 3, title: "Clinical Assessment", certificate: "Certified Clinical Assessor", lessons: 8, description: "Properly evaluate clients and understand root causes", icon: Stethoscope },
    { number: 4, title: "Ethics & Scope of Practice", certificate: "Certified in Professional Ethics", lessons: 6, description: "Protect yourself and clients with proper boundaries", icon: Shield },
    { number: 5, title: "Functional Nutrition", certificate: "Certified Functional Nutritionist", lessons: 12, description: "Use food as powerful medicine to transform lives", icon: Leaf, highlight: true },
    { number: 6, title: "Gut Health & Microbiome", certificate: "Certified Gut Health Specialist", lessons: 10, description: "Where 80% of health issues begin — and healing happens", icon: Activity, highlight: true },
    { number: 7, title: "Stress, Adrenals & Nervous System", certificate: "Certified Stress & Adrenal Specialist", lessons: 8, description: "The stress connection most practitioners miss", icon: Brain },
    { number: 8, title: "Blood Sugar & Insulin", certificate: "Certified Metabolic Health Coach", lessons: 8, description: "Break clients free from the blood sugar rollercoaster", icon: Activity },
    { number: 9, title: "Women's Hormone Health", certificate: "Certified Women's Hormone Specialist", lessons: 10, description: "Support women's unique hormonal journeys", icon: Heart, highlight: true },
    { number: 10, title: "Perimenopause & Menopause", certificate: "Certified Menopause Specialist", lessons: 8, description: "Guide women through life's most challenging transition", icon: Moon, highlight: true },
    { number: 11, title: "Thyroid Health", certificate: "Certified Thyroid Health Specialist", lessons: 8, description: "Address the most underdiagnosed condition in healthcare", icon: Zap, highlight: true },
    { number: 12, title: "Metabolic Health & Weight", certificate: "Certified Weight Management Specialist", lessons: 8, description: "Why traditional weight loss fails and what actually works", icon: Dumbbell },
    { number: 13, title: "Autoimmunity & Inflammation", certificate: "Certified Autoimmune Specialist", lessons: 10, description: "Cutting-edge knowledge most providers don't have", icon: Flame, highlight: true },
    { number: 14, title: "Mental Health & Brain Function", certificate: "Certified Brain Health Specialist", lessons: 8, description: "The gut-brain connection and mental wellness", icon: Brain },
    { number: 15, title: "Cardiometabolic Health", certificate: "Certified Heart Health Specialist", lessons: 8, description: "Life-saving knowledge to protect and heal hearts", icon: Heart },
    { number: 16, title: "Energy & Mitochondrial Health", certificate: "Certified Energy & Fatigue Specialist", lessons: 8, description: "Address the root causes of chronic fatigue", icon: Sun },
    { number: 17, title: "Detox & Environmental Health", certificate: "Certified Detox Specialist", lessons: 8, description: "Reduce toxic burden in today's toxic world", icon: Leaf },
    { number: 18, title: "Immune Health", certificate: "Certified Immune Health Specialist", lessons: 8, description: "Build resilient immune systems that protect", icon: Shield },
    { number: 19, title: "Protocol Building & Program Design", certificate: "Certified Protocol Designer", lessons: 10, description: "Put it ALL together into custom client protocols", icon: Target },
    { number: 20, title: "Building Your Coaching Practice", certificate: "Certified FM Practitioner (Complete)", lessons: 12, description: "Launch and grow your successful practice", icon: TrendingUp, highlight: true },
];

// Accreditation data
const ACCREDITATIONS = [
    { abbr: "CMA", name: "Complementary Medical Association", desc: "Global flagship, 106+ countries", year: "1993" },
    { abbr: "IPHM", name: "International Practitioners of Holistic Medicine", desc: "Executive Provider status, insurance eligibility", year: "" },
    { abbr: "CPD", name: "Continuing Professional Development", desc: "80+ CEU hours for recertification", year: "" },
    { abbr: "IAOTH", name: "International Association of Therapists", desc: "10,000+ practitioner network", year: "" },
    { abbr: "ICAHP", name: "Intl. Community for Alternative & Holistic Professionals", desc: "Evidence-based verification", year: "" },
    { abbr: "IGCT", name: "International Guild of Complementary Therapists", desc: "Prestige guild recognition", year: "" },
    { abbr: "CTAA", name: "Complementary Therapists Accredited Association", desc: "UK practice & NHS recognition", year: "" },
    { abbr: "IHTCP", name: "Intl. Holistic Therapists & Course Providers", desc: "Curriculum quality verified", year: "" },
    { abbr: "IIOHT", name: "International Institute of Holistic Therapists", desc: "Institute-level academic standards", year: "" },
];

// FAQ Component with rich answers
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

// Enhanced Testimonial with specifics - uses random avatars
const TestimonialCard = ({ quote, name, role, before, after, timeframe, income, avatarSrc }: {
    quote: string; name: string; role: string; before?: string; after?: string; timeframe?: string; income?: string; avatarSrc: string
}) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-burgundy-200 transition-all">
        <Quote className="h-6 w-6 text-burgundy-200 mb-3" />
        {before && after && (
            <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-red-50 rounded-lg p-3 border border-red-100">
                    <p className="text-xs font-semibold text-red-600 mb-1">BEFORE</p>
                    <p className="text-sm text-slate-700">{before}</p>
                </div>
                <div className="bg-olive-50 rounded-lg p-3 border border-olive-100">
                    <p className="text-xs font-semibold text-olive-600 mb-1">AFTER</p>
                    <p className="text-sm text-slate-700">{after}</p>
                </div>
            </div>
        )}
        <p className="text-slate-700 leading-relaxed mb-4 italic">"{quote}"</p>
        {(timeframe || income) && (
            <div className="flex gap-3 mb-4">
                {timeframe && (
                    <span className="inline-flex items-center gap-1 bg-burgundy-50 text-burgundy-700 px-2 py-1 rounded text-xs font-medium">
                        <Clock className="h-3 w-3" /> {timeframe}
                    </span>
                )}
                {income && (
                    <span className="inline-flex items-center gap-1 bg-olive-50 text-olive-700 px-2 py-1 rounded text-xs font-medium">
                        <TrendingUp className="h-3 w-3" /> {income}
                    </span>
                )}
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

// Module Certificate Card - compact
const ModuleCertCard = ({ module }: { module: typeof CURRICULUM_MODULES[0] }) => {
    const Icon = module.icon;
    return (
        <div className={`relative bg-white rounded-2xl p-4 border transition-all hover:shadow-lg ${module.highlight ? 'border-burgundy-200 ring-1 ring-burgundy-100' : 'border-slate-100'}`}>
            {module.highlight && (
                <div className="absolute -top-2 -right-2 bg-burgundy-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">Popular</div>
            )}
            <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${module.highlight ? 'bg-burgundy-100' : 'bg-cream-100'}`}>
                    <Icon className={`h-5 w-5 ${module.highlight ? 'text-burgundy-600' : 'text-burgundy-500'}`} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold text-burgundy-600">M{module.number}</span>
                        <span className="text-xs text-slate-400">{module.lessons} lessons</span>
                    </div>
                    <h4 className="font-semibold text-slate-900 text-sm mb-1">{module.title}</h4>
                    <div className="flex items-center gap-1 text-xs">
                        <Award className="h-3 w-3 text-gold-500" />
                        <span className="text-gold-700 font-medium truncate">{module.certificate}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Recent Enrollment Toast - with randomized avatars
const RecentEnrollmentToast = () => {
    const [visible, setVisible] = useState(false);
    const [currentEnrollment, setCurrentEnrollment] = useState(0);

    // Randomize enrollment data on component mount
    const [enrollments] = useState(() => {
        const names = [
            { name: 'Dr. Sarah K.', location: 'Texas' },
            { name: 'Michelle R.', location: 'California' },
            { name: 'Jennifer L.', location: 'Florida' },
            { name: 'Amanda P.', location: 'New York' },
            { name: 'Linda M.', location: 'Arizona' },
            { name: 'Patricia H.', location: 'Colorado' },
            { name: 'Nancy W.', location: 'Georgia' },
            { name: 'Karen B.', location: 'Ohio' },
        ];
        const times = ['2 min ago', '5 min ago', '8 min ago', '12 min ago', '15 min ago', '21 min ago'];

        // Shuffle and pick 5
        const shuffled = [...names].sort(() => Math.random() - 0.5).slice(0, 5);
        return shuffled.map((item, i) => ({
            ...item,
            time: times[i % times.length],
            avatarIndex: Math.floor(Math.random() * ALL_STUDENT_AVATARS.length)
        }));
    });

    useEffect(() => {
        const initialTimeout = setTimeout(() => {
            setVisible(true);
            setTimeout(() => setVisible(false), 4000);
        }, 8000);
        const interval = setInterval(() => {
            setCurrentEnrollment(prev => (prev + 1) % enrollments.length);
            setVisible(true);
            setTimeout(() => setVisible(false), 4000);
        }, 35000);
        return () => { clearTimeout(initialTimeout); clearInterval(interval); };
    }, [enrollments.length]);

    if (!visible) return null;
    const enrollment = enrollments[currentEnrollment];

    return (
        <div className="fixed bottom-24 left-4 z-40 animate-slide-up lg:bottom-4">
            <div className="bg-white rounded-xl shadow-2xl border border-slate-200 p-4 flex items-center gap-3 max-w-sm">
                <Image src={ALL_STUDENT_AVATARS[enrollment.avatarIndex]} alt={enrollment.name} width={40} height={40} className="w-10 h-10 rounded-full object-cover shadow-sm border-2 border-white shrink-0" />
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{enrollment.name} from {enrollment.location}</p>
                    <p className="text-xs text-slate-500">Enrolled in Full Certification • {enrollment.time}</p>
                </div>
                <CheckCircle2 className="h-5 w-5 text-olive-600 shrink-0" />
            </div>
        </div>
    );
};

// Sticky CTA (Mobile + Desktop)
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
            {/* Mobile Bottom Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-slate-200 shadow-2xl p-3 animate-slide-up">
                <div className="flex items-center justify-between gap-3 max-w-lg mx-auto">
                    <div>
                        <p className="text-slate-400 text-xs line-through">$497</p>
                        <p className="text-xl font-black text-burgundy-700">$197</p>
                    </div>
                    <a href="https://sarah.accredipro.academy/fm-certification-access" className="flex-1">
                        <Button className="w-full bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white font-bold py-3 rounded-lg text-sm">
                            Get Certified Now <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                    </a>
                </div>
            </div>
            {/* Desktop Floating Button */}
            <div className="hidden lg:block fixed bottom-6 right-6 z-50 animate-slide-up">
                <a href="https://sarah.accredipro.academy/fm-certification-access">
                    <Button className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-bold py-4 px-6 rounded-xl shadow-2xl text-base">
                        <GraduationCap className="h-5 w-5 mr-2" />
                        Get Certified — $197
                    </Button>
                </a>
            </div>
        </>
    );
};

export default function FMCertificationPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-cream-100 via-cream-50 to-white pb-20 lg:pb-0">
            <StickyCTA />
            <RecentEnrollmentToast />

            <style jsx global>{`
                @keyframes slide-up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
                .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
            `}</style>

            {/* Christmas Urgency Banner */}
            <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-sm">
                    <span className="font-bold flex items-center gap-2">
                        🎄 Christmas Special: Save $300!
                    </span>
                    <span className="hidden sm:block">|</span>
                    <span className="flex items-center gap-2">
                        <Timer className="h-4 w-4" />
                        <span>Ends December 26th</span>
                    </span>
                    <span className="hidden sm:block">|</span>
                    <span className="font-semibold text-yellow-300">Only 23 spots left at this price</span>
                </div>
            </div>

            {/* Trust Banner */}
            <div className="bg-gradient-to-r from-burgundy-800 to-burgundy-900 text-white py-2.5 px-4">
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
                    <div className="trustpilot-widget" data-locale="en-US" data-template-id="5419b6ffb0d04a076446a9af" data-businessunit-id="68c1ac85e89f387ad19f7817" data-style-height="20px" data-style-width="100%" data-token="e33169fc-3158-4c67-94f8-c774e5035e30">
                        <a href="https://www.trustpilot.com/review/accredipro.academy" target="_blank" rel="noopener noreferrer">Trustpilot</a>
                    </div>
                </div>
            </div>

            {/* Hero Section - NEW COPY */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-burgundy-100/40 via-transparent to-transparent" />

                <div className="relative max-w-6xl mx-auto px-4 pt-10 pb-12 sm:pt-14 sm:pb-16">
                    {/* Target Audience Badge */}
                    <div className="flex justify-center mb-4">
                        <div className="inline-flex items-center gap-2 bg-burgundy-50 border border-burgundy-200 rounded-full px-4 py-2 shadow-sm">
                            <Stethoscope className="h-4 w-4 text-burgundy-600" />
                            <span className="text-sm font-semibold text-burgundy-700">For Nurses, NPs, PAs & Licensed Clinicians</span>
                        </div>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center text-slate-900 mb-4 leading-tight">
                        Become a <span className="text-burgundy-700">Certified<br className="sm:hidden" /> Functional Medicine Practitioner</span>
                    </h1>

                    {/* Value Proposition */}
                    <p className="text-lg sm:text-xl text-center text-slate-700 mb-6 max-w-3xl mx-auto">
                        Add <span className="font-bold text-olive-700">$4,000–$8,000/month</span> helping patients actually heal — <span className="font-semibold">without quitting your job.</span>
                    </p>

                    {/* Key Benefits */}
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-6">
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-olive-100">
                            <CheckCircle2 className="h-4 w-4 text-olive-600" />
                            <span className="font-medium text-slate-800 text-sm">21 clinical specializations</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-olive-100">
                            <CheckCircle2 className="h-4 w-4 text-olive-600" />
                            <span className="font-medium text-slate-800 text-sm">Personal mentorship until certified</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm rounded-full px-4 py-2 shadow-sm border border-olive-100">
                            <CheckCircle2 className="h-4 w-4 text-olive-600" />
                            <span className="font-medium text-slate-800 text-sm">Most graduates earning within 90 days</span>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-6">
                        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-3 py-1.5">
                            <Star className="h-4 w-4 fill-gold-400 text-gold-400" />
                            <span className="font-bold text-slate-800">4.9</span>
                            <span className="text-slate-500 text-sm">(823)</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-3 py-1.5">
                            <Users className="h-4 w-4 text-burgundy-600" />
                            <span className="font-bold text-slate-800">1,447</span>
                            <span className="text-slate-500 text-sm">enrolled</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-3 py-1.5">
                            <BookOpen className="h-4 w-4 text-burgundy-600" />
                            <span className="font-bold text-slate-800">168</span>
                            <span className="text-slate-500 text-sm">lessons</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm rounded-full px-3 py-1.5">
                            <Award className="h-4 w-4 text-burgundy-600" />
                            <span className="font-bold text-slate-800">80+</span>
                            <span className="text-slate-500 text-sm">CEU</span>
                        </div>
                    </div>

                    {/* VSL Video */}
                    <div className="max-w-4xl mx-auto mb-8">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-slate-900" style={{ padding: '56.25% 0 0 0', position: 'relative' }}>
                            <iframe
                                src="https://player.vimeo.com/video/1134216854?badge=0&autopause=0&player_id=0&app_id=58479"
                                frameBorder="0"
                                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                title="Certification Overview"
                            />
                        </div>
                    </div>

                    {/* CTA with Payment Plan */}
                    <div className="flex flex-col items-center justify-center gap-4 mb-6">
                        <a href="https://sarah.accredipro.academy/fm-certification-access">
                            <Button className="w-full sm:w-auto bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-bold py-6 px-10 rounded-xl text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-[1.02]">
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
                            <p className="text-sm text-slate-500">
                                or <span className="font-semibold">2 × $109/month</span>
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1"><Shield className="h-4 w-4 text-olive-600" />30-day guarantee</span>
                        <span className="flex items-center gap-1"><Infinity className="h-4 w-4 text-olive-600" />Lifetime access</span>
                        <span className="flex items-center gap-1"><Clock className="h-4 w-4 text-olive-600" />Self-paced</span>
                        <span className="flex items-center gap-1"><Zap className="h-4 w-4 text-olive-600" />Start today</span>
                    </div>
                </div>
            </section>

            {/* Accreditation Logos */}
            <section className="py-6 bg-white border-y border-slate-100">
                <div className="max-w-5xl mx-auto px-4">
                    <p className="text-center text-xs text-slate-500 mb-3 uppercase tracking-wide font-medium">
                        Recognized by 9 International Accreditation Bodies
                    </p>
                    <Image src="/all-logos.png" alt="Accredited by CMA, IPHM, CPD, IAOTH, ICAHP, IGCT, CTAA, IHTCP, IIOHT" width={900} height={100} className="w-full max-w-4xl mx-auto h-auto" />
                </div>
            </section>

            {/* 21 Certifications Showcase */}
            <section className="py-12 sm:py-16 bg-gradient-to-b from-burgundy-900 to-slate-900 text-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <p className="text-gold-400 font-semibold mb-2 uppercase tracking-wide">What Makes Us Different</p>
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                            21 Certifications + Master Certification
                        </h2>
                        <p className="text-lg text-slate-300 max-w-3xl mx-auto">
                            Instead of one generic credential, you graduate with a <span className="text-gold-400 font-semibold">portfolio of focused specializations</span>. Each module = 1 certificate.
                        </p>
                    </div>

                    {/* Specialty Badges */}
                    <div className="flex flex-wrap justify-center gap-2 mb-10">
                        {["Thyroid Specialist", "Gut Health Specialist", "Women's Hormone Specialist", "Autoimmune Specialist", "Menopause Specialist", "Metabolic Health Coach", "Functional Nutritionist", "Brain Health Specialist", "+ 13 more"].map((cert, i) => (
                            <span key={i} className="bg-burgundy-700/50 text-white px-3 py-1.5 rounded-full text-sm font-medium border border-burgundy-500">
                                {cert}
                            </span>
                        ))}
                    </div>

                    {/* Comparison */}
                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <div className="bg-slate-800/50 rounded-2xl p-5 border border-slate-700">
                            <p className="text-red-400 font-semibold mb-3 flex items-center gap-2"><X className="h-5 w-5" /> Other Programs</p>
                            <ul className="space-y-2 text-slate-400 text-sm">
                                <li className="flex items-start gap-2"><X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />One generic "Health Coach" certificate</li>
                                <li className="flex items-start gap-2"><X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />No specialization options</li>
                                <li className="flex items-start gap-2"><X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />Left alone after enrollment</li>
                                <li className="flex items-start gap-2"><X className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />No business or career support</li>
                            </ul>
                        </div>
                        <div className="bg-gradient-to-br from-burgundy-800 to-burgundy-900 rounded-2xl p-5 border border-burgundy-500 ring-2 ring-gold-400/30">
                            <p className="text-gold-400 font-semibold mb-3 flex items-center gap-2"><Star className="h-5 w-5" /> AccrediPro Academy</p>
                            <ul className="space-y-2 text-slate-200 text-sm">
                                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-olive-400 shrink-0 mt-0.5" /><strong>21 specialized certificates</strong> — one per module</li>
                                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-olive-400 shrink-0 mt-0.5" />Certified in Thyroid, Hormones, Gut Health & more</li>
                                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-olive-400 shrink-0 mt-0.5" />Private 1:1 mentorship until certified</li>
                                <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 text-olive-400 shrink-0 mt-0.5" />Complete business & career launch support</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Master Certificate + Sample Certificates Section */}
            <section className="py-12 sm:py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Your Master Credential</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                            Certified Functional Medicine Practitioner
                        </h2>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                            Upon completion, earn the <strong className="text-slate-900">Certified FM Practitioner</strong> designation — plus 21 specialty certificates showcasing your complete expertise.
                        </p>
                    </div>

                    {/* Master Certificate */}
                    <div className="max-w-4xl mx-auto mb-10">
                        <div className="relative">
                            <Image
                                src="/FUNCTIONAL_MEDICINE_CERTIFICATE.webp"
                                alt="Certified Functional Medicine Practitioner Certificate"
                                width={800}
                                height={600}
                                className="w-full rounded-2xl shadow-2xl border-4 border-gold-300"
                            />
                            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-burgundy-600 text-white rounded-full px-6 py-2 shadow-lg">
                                <p className="text-sm font-bold flex items-center gap-2">
                                    <Award className="h-4 w-4 text-gold-400" />
                                    + 21 Specialty Certificates Below
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Sample Module Certificates Grid */}
                    <div className="mt-12">
                        <p className="text-center text-slate-600 mb-6 font-medium">Sample Specialty Certificates You'll Earn:</p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { name: "Gut Health Specialist", icon: Activity, color: "olive" },
                                { name: "Thyroid Health Specialist", icon: Zap, color: "burgundy" },
                                { name: "Women's Hormone Specialist", icon: Heart, color: "burgundy" },
                                { name: "Autoimmune Specialist", icon: Flame, color: "olive" },
                            ].map((cert, i) => (
                                <div key={i} className="bg-gradient-to-br from-cream-50 to-white rounded-xl p-4 border-2 border-gold-200 shadow-md relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-20 h-20 bg-gold-100/50 rounded-full -mr-10 -mt-10" />
                                    <div className="relative">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="w-10 h-10 rounded-full bg-burgundy-100 flex items-center justify-center">
                                                <cert.icon className="h-5 w-5 text-burgundy-600" />
                                            </div>
                                            <Award className="h-6 w-6 text-gold-500" />
                                        </div>
                                        <p className="text-xs text-slate-500 uppercase tracking-wide mb-1">Certificate of Completion</p>
                                        <p className="font-bold text-slate-900 text-sm">{cert.name}</p>
                                        <div className="mt-2 pt-2 border-t border-gold-100 flex items-center gap-1 text-xs text-slate-500">
                                            <Shield className="h-3 w-3" />
                                            <span>Verified Credential</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <p className="text-center text-slate-500 text-sm mt-4">
                            ...and 17 more specialty certificates, one for each module completed!
                        </p>
                    </div>

                    {/* Benefits list */}
                    <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
                        {["Master certification with unique ID", "21 specialty certificates", "80+ CEU hours", "Verifiable on LinkedIn", "Lifetime validity"].map((item, i) => (
                            <div key={i} className="flex items-center gap-2 bg-cream-50 rounded-lg px-4 py-3 border border-cream-200">
                                <CheckCircle2 className="h-4 w-4 text-olive-600 shrink-0" />
                                <span className="text-sm text-slate-700">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Complete Curriculum Grid */}
            <section className="py-12 sm:py-16 bg-gradient-to-b from-cream-50 to-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Complete Curriculum</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">21 Modules. 21 Certifications.</h2>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                            Each module = 1 certificate. Graduate as a <span className="font-semibold text-burgundy-700">multi-certified specialist</span>.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {CURRICULUM_MODULES.map((module) => (
                            <ModuleCertCard key={module.number} module={module} />
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <div className="inline-flex items-center gap-4 bg-gradient-to-r from-gold-50 to-gold-100 border border-gold-200 rounded-xl px-6 py-3">
                            <p className="text-gold-800 font-bold">168 Lessons • 60+ Hours • 80+ CEU</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Also AccrediPro Section - Accreditations Detail */}
            <section className="py-12 sm:py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Also AccrediPro</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
                            9 Global Accreditations
                        </h2>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                            Practice in 30+ countries. Qualify for professional liability insurance. Credentials recognized worldwide.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4 mb-8">
                        {ACCREDITATIONS.map((acc, i) => (
                            <div key={i} className="bg-gradient-to-br from-cream-50 to-white rounded-xl p-4 border border-cream-200 hover:shadow-lg transition-all">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="bg-burgundy-600 text-white font-bold px-2.5 py-1 rounded text-sm">{acc.abbr}</span>
                                    <BadgeCheck className="h-5 w-5 text-olive-600" />
                                </div>
                                <p className="font-semibold text-slate-800 text-sm mb-1">{acc.name}</p>
                                <p className="text-xs text-slate-500">{acc.desc}</p>
                            </div>
                        ))}
                    </div>

                    {/* Key Benefits of Accreditations */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
                        {[
                            { icon: Globe2, title: "Global Mobility", desc: "Practice in 30+ countries" },
                            { icon: Shield, title: "Insurance Access", desc: "Qualify for liability coverage" },
                            { icon: Award, title: "Premium Credibility", desc: "Command higher rates" },
                            { icon: Infinity, title: "Lifetime Validity", desc: "Certificates never expire" },
                        ].map((item, i) => {
                            const Icon = item.icon || Shield;
                            return (
                                <div key={i} className="flex items-center gap-3 bg-olive-50 rounded-lg px-4 py-3 border border-olive-100">
                                    <Shield className="h-5 w-5 text-olive-600 shrink-0" />
                                    <div>
                                        <p className="font-semibold text-slate-800 text-sm">{item.title}</p>
                                        <p className="text-xs text-slate-500">{item.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </section>

            {/* What You Get - with Images */}
            <section className="py-12 sm:py-16 bg-cream-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Complete Access</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Everything You Need to Succeed</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { icon: LayoutDashboard, title: "Full Dashboard Access", desc: "Your personal learning portal with progress tracking, certificates, and all resources.", badge: "Lifetime access" },
                            { icon: HeartHandshake, title: "Private Mentorship", desc: "Personal coach guides you — answers questions, provides feedback, celebrates wins.", badge: "Until certified" },
                            { icon: Laptop, title: "Coach Workspace", desc: "Professional client management. Track clients, create protocols, manage your practice.", badge: "Built-in tools" },
                            { icon: TrendingUp, title: "Career Launch Support", desc: "Your coach helps plan your career — pricing, niching, getting first clients.", badge: "$5K-$20K/month" },
                            { icon: Users, title: "Private Community", desc: "1,400+ practitioners sharing wins, asking questions, collaborating together.", badge: "Lifetime access" },
                            { icon: Video, title: "Coaching Tips & Stories", desc: "Weekly insights from Sarah and successful graduates. Real strategies that work.", badge: "Ongoing" },
                        ].map((item, i) => (
                            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-lg transition-all">
                                <div className="w-12 h-12 rounded-xl bg-burgundy-100 flex items-center justify-center mb-3">
                                    <item.icon className="h-6 w-6 text-burgundy-600" />
                                </div>
                                <h3 className="font-bold text-lg text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-slate-600 text-sm mb-2">{item.desc}</p>
                                <span className="text-burgundy-600 font-semibold text-xs">{item.badge}</span>
                            </div>
                        ))}
                    </div>

                    {/* Portal Screenshot */}
                    <div className="mt-10 bg-gradient-to-r from-burgundy-50 to-gold-50 rounded-2xl p-6 sm:p-8 border border-burgundy-100">
                        <div className="grid lg:grid-cols-2 gap-6 items-center">
                            <div>
                                <h3 className="text-2xl font-bold text-slate-900 mb-3">Your Learning Portal</h3>
                                <p className="text-slate-600 mb-4">Everything in one place: courses, community, private chat with Sarah, coaching tips, and your Coach Workspace.</p>
                                <div className="flex flex-wrap gap-2">
                                    {["1,400+ Community", "Coach Workspace", "Private Chat", "Coaching Tips"].map((f, i) => (
                                        <span key={i} className="bg-white px-3 py-1 rounded-full text-sm text-burgundy-700 font-medium border border-burgundy-100">{f}</span>
                                    ))}
                                </div>
                            </div>
                            <Image src="/portal.webp" alt="AccrediPro Learning Portal" width={600} height={400} className="w-full rounded-xl shadow-lg border border-slate-200" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Bonus Section - Similar to Mini Diploma */}
            <section className="py-12 sm:py-16 bg-gradient-to-b from-burgundy-900 to-burgundy-800">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 bg-gold-400/20 border border-gold-400/30 rounded-full px-4 py-2 mb-4">
                            <Gift className="h-4 w-4 text-gold-400" />
                            <span className="text-sm font-semibold text-gold-400">BONUSES INCLUDED</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            6 Exclusive Bonuses Worth $497
                        </h2>
                        <p className="text-lg text-burgundy-200">
                            Included FREE when you enroll today
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {[
                            { title: "Client Intake Templates", value: "$97", desc: "Professional forms ready to use with your first client" },
                            { title: "Protocol Builder Toolkit", value: "$147", desc: "Create custom protocols for any condition" },
                            { title: "Pricing & Packages Guide", value: "$47", desc: "Exactly how to price your services for profit" },
                            { title: "Marketing Starter Kit", value: "$97", desc: "Social media templates, bio scripts, and more" },
                            { title: "First Client Script", value: "$47", desc: "Word-for-word script for your discovery call" },
                            { title: "Graduate Resource Vault", value: "$62", desc: "Ongoing resources as the field evolves" },
                        ].map((bonus, i) => (
                            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                                <div className="flex items-center justify-between mb-2">
                                    <Gift className="h-5 w-5 text-gold-400" />
                                    <span className="text-gold-400 font-bold text-sm">{bonus.value} value</span>
                                </div>
                                <h3 className="font-bold text-white mb-1">{bonus.title}</h3>
                                <p className="text-sm text-burgundy-200">{bonus.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <p className="text-burgundy-200">
                            Total Bonus Value: <span className="text-gold-400 font-bold text-xl">$497</span> — <span className="text-white font-semibold">Yours FREE</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* Sarah's Story */}
            <section className="py-12 sm:py-16 bg-gradient-to-b from-cream-100 to-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex flex-col items-center text-center mb-6">
                        <Image src="/coaches/sarah-coach.webp" alt="Sarah Mitchell" width={100} height={100} className="w-24 h-24 rounded-full object-cover shadow-lg border-4 border-white ring-4 ring-burgundy-100 mb-3" />
                        <p className="text-burgundy-600 font-semibold uppercase tracking-wide text-sm">Your Lead Coach</p>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">I'll Be With You Every Step</h2>
                    </div>

                    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100">
                        <div className="space-y-3 text-slate-600">
                            <p><strong className="text-slate-800">12 years as an ER nurse.</strong> I watched patients leave with prescriptions that would never fix their problems.</p>
                            <p>Then <span className="text-burgundy-700 font-semibold">I got sick.</span> Thyroid. Gut issues. Autoimmune symptoms. Doctors said "normal." I knew it wasn't.</p>
                            <p>Functional medicine healed me — and gave me purpose. Now I've helped <strong className="text-slate-800">1,447 practitioners</strong> launch their own practices.</p>
                        </div>

                        <div className="mt-6 p-4 bg-gradient-to-r from-burgundy-50 to-gold-50 rounded-xl border-l-4 border-burgundy-600">
                            <p className="text-burgundy-800 font-semibold">"I don't just hand you a course and disappear. I mentor you personally until you're certified and confident."</p>
                            <p className="text-slate-600 text-sm mt-1">— Sarah Mitchell, Lead Coach</p>
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 text-center">
                            <div><p className="text-xl font-bold text-burgundy-700">12+</p><p className="text-xs text-slate-500">Years as RN</p></div>
                            <div><p className="text-xl font-bold text-burgundy-700">1,447</p><p className="text-xs text-slate-500">Practitioners</p></div>
                            <div><p className="text-xl font-bold text-burgundy-700">97%</p><p className="text-xs text-slate-500">Completion</p></div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials with Specifics - Random Avatars */}
            <section className="py-12 sm:py-16">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Real Transformations</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">What Our Graduates Say</h2>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
                        <TestimonialCard
                            quote="Sarah's mentorship changed everything. She helped me launch my practice. Got my first paying client within 2 weeks of finishing."
                            name="Karen Mitchell"
                            role="Former ARNP, Now FM Practitioner"
                            before="Burned out, 25 years in hospitals"
                            after="Working 20 hrs/week from home"
                            timeframe="Certified in 4 months"
                            income="$6,200/month"
                            avatarSrc={TESTIMONIAL_AVATARS[0]}
                        />
                        <TestimonialCard
                            quote="The 21 specialty certificates are GOLD. When clients see I'm certified in thyroid, hormones, AND gut health — they trust me immediately."
                            name="Maria Santos"
                            role="FM Practitioner, California"
                            before="Generic health coach cert"
                            after="21 specialty credentials"
                            timeframe="Completed in 5 months"
                            income="$8,400/month"
                            avatarSrc={TESTIMONIAL_AVATARS[1]}
                        />
                        <TestimonialCard
                            quote="I work with Hashimoto's clients exclusively now. My specialized certificates prove I actually know my stuff. Clients pay premium rates."
                            name="Patricia Smith"
                            role="Thyroid & Autoimmune Specialist"
                            before="No niche, charging $50/session"
                            after="Thyroid specialist, $150/session"
                            timeframe="First client in 3 weeks"
                            income="$9,800/month"
                            avatarSrc={TESTIMONIAL_AVATARS[2]}
                        />
                        <TestimonialCard
                            quote="The Coach Workspace alone is worth it. I manage all clients, track progress, create protocols — everything in one place. So professional."
                            name="Lisa Rodriguez"
                            role="FM Practitioner, Texas"
                            timeframe="6 months to certification"
                            income="$5,100/month part-time"
                            avatarSrc={TESTIMONIAL_AVATARS[3]}
                        />
                        <TestimonialCard
                            quote="Other certifications hand you a PDF and disappear. Here, Sarah literally messages you, checks on you, celebrates wins. Like having a partner."
                            name="Amanda Chen"
                            role="Former Corporate, Now Coach"
                            before="Stuck in 9-5, unfulfilled"
                            after="Own schedule, meaningful work"
                            timeframe="Career change in 5 months"
                            avatarSrc={TESTIMONIAL_AVATARS[4]}
                        />
                        <TestimonialCard
                            quote="I was skeptical — $197 seemed too good. But the content rivals $10K programs. The mentorship is what makes the difference."
                            name="Jennifer Walsh"
                            role="Career Changer, Florida"
                            timeframe="Certified in 4 months"
                            income="First client at $125/hr"
                            avatarSrc={TESTIMONIAL_AVATARS[5]}
                        />
                    </div>
                </div>
            </section>

            {/* Income Potential */}
            <section className="py-12 sm:py-16 bg-gradient-to-b from-olive-50 to-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <p className="text-olive-600 font-semibold mb-2 uppercase tracking-wide">The Opportunity</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Your New Career Awaits</h2>
                        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                            Our certified practitioners are building practices from $3K to $20K+ per month.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-5 mb-6">
                        {[
                            { range: "$3K – $5K", period: "/month", desc: "Part-time practice", detail: "5-10 clients • 10-15 hrs/week" },
                            { range: "$6K – $10K", period: "/month", desc: "Full-time practice", detail: "15-25 clients • Replace job income", highlight: true },
                            { range: "$15K – $20K+", period: "/month", desc: "Premium practice", detail: "Group programs • Scaled business" },
                        ].map((tier, i) => (
                            <div key={i} className={`rounded-2xl p-5 text-center ${tier.highlight ? 'bg-olive-600 text-white ring-4 ring-olive-300 shadow-xl' : 'bg-white shadow-sm border border-olive-200'}`}>
                                <p className={`text-3xl font-black ${tier.highlight ? 'text-white' : 'text-olive-600'}`}>{tier.range}<span className="text-base font-medium">{tier.period}</span></p>
                                <p className={`font-semibold mt-1 ${tier.highlight ? 'text-olive-100' : 'text-slate-800'}`}>{tier.desc}</p>
                                <p className={`text-sm ${tier.highlight ? 'text-olive-200' : 'text-slate-500'}`}>{tier.detail}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* This is NOT for you */}
            <section className="py-12 sm:py-16">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 sm:p-8 border border-slate-200">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertCircle className="h-6 w-6 text-burgundy-600" />
                            <h3 className="text-xl font-bold text-slate-900">This Certification is NOT For You If:</h3>
                        </div>
                        <ul className="space-y-3 text-slate-700">
                            <li className="flex items-start gap-3"><X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" /><span>You're looking for "get rich quick" — this requires real work and commitment</span></li>
                            <li className="flex items-start gap-3"><X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" /><span>You're not willing to study 3-5 hours per week for 3-6 months</span></li>
                            <li className="flex items-start gap-3"><X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" /><span>You don't genuinely care about helping people transform their health</span></li>
                            <li className="flex items-start gap-3"><X className="h-5 w-5 text-red-500 shrink-0 mt-0.5" /><span>You expect clients to magically appear without marketing effort</span></li>
                        </ul>
                        <div className="mt-5 pt-5 border-t border-slate-200">
                            <p className="font-semibold text-olive-700 flex items-center gap-2">
                                <CheckCircle2 className="h-5 w-5" />
                                This IS for you if you're ready to invest in yourself and build a meaningful career helping others.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Improved Pricing Section */}
            <section id="pricing" className="py-12 sm:py-16 bg-gradient-to-b from-cream-50 to-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-red-50 border border-red-200 rounded-full px-4 py-2 mb-4">
                            <Timer className="h-4 w-4 text-red-600" />
                            <span className="text-sm font-semibold text-red-700">Christmas Special Ends Dec 26th — Only 23 Spots Left</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-3">Start Your Certification Now</h2>
                    </div>

                    {/* Pricing Card */}
                    <div className="bg-white rounded-3xl shadow-2xl border-2 border-burgundy-100 overflow-hidden max-w-2xl mx-auto">
                        <div className="bg-gradient-to-r from-burgundy-700 to-burgundy-800 px-6 py-6 text-center">
                            <div className="flex items-center justify-center gap-2 mb-3">
                                <GraduationCap className="h-5 w-5 text-gold-400" />
                                <span className="text-gold-400 font-semibold uppercase tracking-wide text-sm">Certified FM Practitioner</span>
                            </div>
                            <div className="flex items-center justify-center gap-4 mb-2">
                                <span className="text-white/60 line-through text-3xl">$497</span>
                                <span className="text-6xl font-black text-white">$197</span>
                            </div>
                            <p className="text-burgundy-200 text-sm mb-3">one-time payment</p>
                            <div className="inline-block bg-burgundy-600/50 rounded-lg px-4 py-2 border border-burgundy-500">
                                <p className="text-white font-medium">or <span className="font-bold">2 × $109/month</span></p>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* What's Included */}
                            <div className="mb-6">
                                <p className="font-semibold text-slate-800 mb-3 text-center">Everything Included:</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        "21 modules (168 lessons)",
                                        "21 specialty certificates",
                                        "Master FM Practitioner cert",
                                        "60+ hours, 80+ CEU",
                                        "Private 1:1 mentorship",
                                        "Coach Workspace access",
                                        "Career launch support",
                                        "6 bonuses ($497 value)",
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-slate-700">
                                            <CheckCircle2 className="h-4 w-4 text-olive-600 shrink-0" />{item}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Key Benefits Row */}
                            <div className="grid grid-cols-3 gap-3 mb-6 py-4 border-y border-slate-100">
                                <div className="text-center">
                                    <Infinity className="h-5 w-5 text-burgundy-600 mx-auto mb-1" />
                                    <p className="text-xs font-semibold text-slate-800">Lifetime Access</p>
                                </div>
                                <div className="text-center">
                                    <Clock className="h-5 w-5 text-burgundy-600 mx-auto mb-1" />
                                    <p className="text-xs font-semibold text-slate-800">Self-Paced</p>
                                </div>
                                <div className="text-center">
                                    <HeartHandshake className="h-5 w-5 text-burgundy-600 mx-auto mb-1" />
                                    <p className="text-xs font-semibold text-slate-800">Personal Mentorship</p>
                                </div>
                            </div>

                            {/* Scarcity Note */}
                            <div className="bg-burgundy-50 rounded-xl p-4 mb-6 border border-burgundy-100">
                                <p className="text-burgundy-800 text-sm text-center">
                                    <strong>Only accepting limited students</strong> — I personally mentor every student until they're certified.
                                </p>
                            </div>

                            <a href="https://sarah.accredipro.academy/fm-certification-access" className="block">
                                <Button className="w-full bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-bold py-6 rounded-xl text-lg shadow-lg">
                                    <GraduationCap className="h-5 w-5 mr-2" />
                                    Start My Certification — $197
                                </Button>
                            </a>

                            <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-xs text-slate-500">
                                <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5 text-olive-600" />30-day money-back guarantee</span>
                                <span>•</span>
                                <span>Instant access</span>
                                <span>•</span>
                                <span>Start today</span>
                            </div>
                        </div>
                    </div>

                    {/* Social Proof */}
                    <div className="mt-6 text-center">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                            <div className="flex -space-x-2">
                                {[...ALL_STUDENT_AVATARS].sort(() => Math.random() - 0.5).slice(0, 6).map((src, i) => (
                                    <Image key={i} src={src} alt="Student" width={32} height={32} className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm" />
                                ))}
                            </div>
                            <p className="text-slate-600 text-sm"><strong className="text-slate-800">1,447</strong> practitioners certified</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-12 sm:py-16 bg-cream-50">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <p className="text-burgundy-600 font-semibold mb-2 uppercase tracking-wide">Questions?</p>
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900">Frequently Asked Questions</h2>
                    </div>

                    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 px-6">
                        <FAQItem
                            question="How long does the certification take?"
                            answer={<>Most students complete in <strong>3-6 months</strong> studying 3-5 hours per week. Some finish faster (8 weeks with intensive study), others take longer. You have <strong>lifetime access</strong> — go at your pace. Your coach helps create a realistic timeline for your schedule.</>}
                        />
                        <FAQItem
                            question="Do I really get 21 separate certificates?"
                            answer={<>Yes! Each module awards its own specialty certificate: <strong>Thyroid Health Specialist, Gut Health Specialist, Women's Hormone Specialist, Autoimmune Specialist</strong>, etc. Plus the master <strong>Certified Functional Medicine Practitioner</strong> credential. That's 22 credentials total.</>}
                        />
                        <FAQItem
                            question="Can I work with clients after certification?"
                            answer={<>Absolutely. You'll graduate as a <strong>Certified Functional Medicine Health Coach</strong> — qualified to work with clients on nutrition, lifestyle, and wellness. Many graduates get their first paying client within <strong>2-4 weeks</strong> of finishing. Your coach helps with pricing, niching, and marketing.</>}
                        />
                        <FAQItem
                            question="How is the private mentorship delivered?"
                            answer={<>Your personal coach messages you directly through the portal. They <strong>check on your progress weekly</strong>, answer questions, help you through challenging modules, and support you in launching your practice. It's like having a business partner — not just a course you're left alone with.</>}
                        />
                        <FAQItem
                            question="Is $197 really the full price? What's the catch?"
                            answer={<>No catch. The regular price is $497, but we're running a <strong>Christmas special until Dec 26th</strong>. We keep pricing accessible because we want more practitioners in this field. The investment is $197 one-time or 2 × $109/month. Plus <strong>30-day money-back guarantee</strong> — if it's not right, you get a full refund.</>}
                        />
                        <FAQItem
                            question="How much can I earn as a certified practitioner?"
                            answer={<>Our graduates are earning <strong>$3K-$5K/month part-time</strong> (5-10 clients), <strong>$6K-$10K/month full-time</strong> (15-25 clients), and <strong>$15K-$20K+/month</strong> with group programs. Session rates range from $75-$200+. The field is growing 15%+ annually — there's high demand.</>}
                        />
                        <FAQItem
                            question="What's the Coach Workspace?"
                            answer={<>A professional client management system built into your dashboard. <strong>Track client progress, create custom protocols, manage appointments</strong>, and run your entire practice from one place. It's designed specifically for FM practitioners — so you look professional from day one.</>}
                        />
                    </div>
                </div>
            </section>

            {/* Guarantee */}
            <section className="py-12 sm:py-16">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <div className="bg-gradient-to-br from-olive-50 to-white rounded-3xl p-8 border-2 border-olive-200">
                        {/* Company Logo */}
                        <Image
                            src="https://coach.accredipro.academy/wp-content/uploads/2025/10/Senza-titolo-Logo-1.png"
                            alt="AccrediPro Academy"
                            width={80}
                            height={80}
                            className="mx-auto mb-4"
                        />
                        <div className="w-16 h-16 rounded-full bg-olive-100 flex items-center justify-center mx-auto mb-4">
                            <Shield className="h-8 w-8 text-olive-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-3">100% Money-Back Guarantee</h2>
                        <p className="text-slate-600 mb-4 max-w-xl mx-auto">
                            Enroll today, explore the content, meet your coach. If it's not right for you, email us within 30 days for a full refund. No questions asked.
                        </p>
                        <p className="text-xl font-bold text-olive-700">Your investment is completely protected.</p>
                    </div>
                </div>
            </section>

            {/* Professional Footer - No Blue, Burgundy Branded */}
            <footer className="bg-burgundy-950 text-white">
                {/* Main Footer */}
                <div className="max-w-6xl mx-auto px-4 py-12">
                    <div className="grid md:grid-cols-4 gap-8 mb-10">
                        {/* Brand */}
                        <div className="md:col-span-2">
                            <div className="flex items-center gap-2 mb-4">
                                <GraduationCap className="h-8 w-8 text-gold-400" />
                                <span className="font-bold text-xl">AccrediPro Academy</span>
                            </div>
                            <p className="text-burgundy-200 text-sm mb-4 max-w-sm">
                                The most comprehensive Functional Medicine certification program. 21 specializations, personal mentorship, and career launch support.
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-gold-400 text-gold-400" />
                                    <Star className="h-4 w-4 fill-gold-400 text-gold-400" />
                                    <Star className="h-4 w-4 fill-gold-400 text-gold-400" />
                                    <Star className="h-4 w-4 fill-gold-400 text-gold-400" />
                                    <Star className="h-4 w-4 fill-gold-400 text-gold-400" />
                                </div>
                                <span className="text-sm text-burgundy-200">4.9/5 (823 reviews)</span>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h4 className="font-semibold mb-4 text-gold-400">Programs</h4>
                            <ul className="space-y-2 text-sm text-burgundy-200">
                                <li><a href="/fm-certification" className="hover:text-white transition-colors">Full Certification</a></li>
                                <li><a href="/fm-mini-diploma" className="hover:text-white transition-colors">Mini Diploma</a></li>
                                <li><a href="https://learn.accredipro.academy/accreditation" className="hover:text-white transition-colors">Accreditations</a></li>
                            </ul>
                        </div>

                        {/* Support */}
                        <div>
                            <h4 className="font-semibold mb-4 text-gold-400">Support</h4>
                            <ul className="space-y-2 text-sm text-burgundy-200">
                                <li><a href="mailto:sarah@accredipro.academy" className="hover:text-white transition-colors">sarah@accredipro.academy</a></li>
                                <li><a href="https://learn.accredipro.academy/login" className="hover:text-white transition-colors">Student Login</a></li>
                            </ul>
                        </div>
                    </div>

                    {/* Accreditation Badges */}
                    <div className="border-t border-burgundy-800 pt-8 mb-8">
                        <p className="text-center text-xs text-burgundy-400 mb-4 uppercase tracking-wide">Internationally Accredited</p>
                        <div className="flex flex-wrap justify-center gap-3">
                            {["CMA", "IPHM", "CPD", "IAOTH", "ICAHP", "IGCT", "CTAA", "IHTCP", "IIOHT"].map((acc, i) => (
                                <span key={i} className="bg-burgundy-900 border border-burgundy-700 px-3 py-1 rounded text-xs font-medium text-burgundy-200">{acc}</span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-burgundy-900 py-6">
                    <div className="max-w-6xl mx-auto px-4">
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-burgundy-400">
                            <p>© 2025 AccrediPro Academy. All rights reserved.</p>
                            <p className="text-center">
                                *Income ranges represent goals of certified practitioners. Results vary based on effort, background, and dedication.
                            </p>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
