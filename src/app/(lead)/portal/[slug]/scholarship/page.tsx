"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import {
    CheckCircle2, ArrowRight, Shield, Clock, Star, Users,
    TrendingUp, Award, Zap, Gift, Lock, BadgeCheck, Play,
    Quote, Heart, Sparkles, Target, DollarSign, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getConfigByPortalSlug } from "@/lib/mini-diploma-registry";
import confetti from "canvas-confetti";

const SARAH_AVATAR = "/coaches/sarah-coach.webp";

// ============================================
// VALUE STACK - $11,276 Total Value
// ============================================
const VALUE_STACK = [
    {
        item: "ASI Board Certification",
        subtitle: "36 Modules: Foundational → Advanced → Master → Practice",
        value: 2997,
        icon: Award,
        isMain: true
    },
    {
        item: "1:1 Personal Mentorship with Sarah",
        subtitle: "Direct access to your coach when you need guidance",
        value: 1997,
        icon: Heart,
        isMain: true
    },
    {
        item: "Done-For-You Practice Website",
        subtitle: "Professional site, ready for clients in 48 hours",
        value: 1500,
        icon: Zap,
        isMain: true
    },
    {
        item: "📦 Business Box: 2,000+ Templates",
        subtitle: "Launch this week instead of 3 months from now",
        value: 1997,
        icon: BadgeCheck,
        isMain: true
    },
    {
        item: "\"Peace of Mind\" Legal Suite",
        subtitle: "47 attorney-drafted forms: contracts, HIPAA, waivers ($5,500 to create)",
        value: 997,
        icon: Shield
    },
    {
        item: "\"Client Attraction\" Vault",
        subtitle: "365 days of social posts. Copy, paste, look like an expert.",
        value: 497,
        icon: TrendingUp
    },
    { item: "Email Scripts: First Message to Close", value: 297, icon: Users },
    { item: "Referral System Templates", value: 197, icon: Users },
    { item: "Lifetime Private Community", value: 297, icon: Users },
    {
        item: "🎁 BONUS: VIP Strategy Call",
        subtitle: "Personal roadmap session with Sarah",
        value: 500,
        icon: Gift,
        isBonus: true
    },
];

// ============================================
// CASE STUDIES - Real Graduate Journeys (R2 Avatars)
// ============================================
const CASE_STUDIES = [
    {
        name: "Frances H.",
        location: "Phoenix, AZ",
        avatar: "https://pub-bc3849663dc849e59aee2d3c517f51e1.r2.dev/avatars/zombie-cmk8w1ys10002xym9uoo1tzyd.png",
        before: {
            situation: "Burnt-out Pilates instructor, 6 classes/day",
            income: "$0/month from practice",
            feeling: "Body breaking down at 47"
        },
        after: {
            situation: "Health coach charging premium rates",
            income: "$7,400/month",
            feeling: "Finally healing, half the hours"
        },
        timeline: "3 months",
        quote: "I went from $35/hour teaching Pilates to $350/session in health coaching. Working HALF the hours, making 10x more.",
        highlight: "First client within 2 weeks of certification"
    },
    {
        name: "Gloria C.",
        location: "Tucson, AZ",
        avatar: "https://pub-bc3849663dc849e59aee2d3c517f51e1.r2.dev/avatars/zombie-cmk8w20g6000exym9ejtqjanj.png",
        before: {
            situation: "Former educator, felt imposter syndrome",
            income: "$0",
            feeling: "Terrified to take first client"
        },
        after: {
            situation: "Full practice, clients crying tears of relief",
            income: "$8,600/month",
            feeling: "Changing lives every single day"
        },
        timeline: "4 months",
        quote: "My first client said 'no one has ever asked me these questions before.' She cried. I cried. She's referred me 3 more clients since.",
        highlight: "Client Diane: 80% better bloating in 6 weeks"
    },
    {
        name: "Janet R.",
        location: "San Diego, CA",
        avatar: "https://pub-bc3849663dc849e59aee2d3c517f51e1.r2.dev/avatars/zombie-cmk8w1zc30006xym9hvmxhtcn.png",
        before: {
            situation: "Part-time realtor, 60+ hours/week",
            income: "$0 from passion",
            feeling: "Unfulfilled, time for change"
        },
        after: {
            situation: "Full-time practitioner, works from home",
            income: "$9,700/month",
            feeling: "Love what I do every day"
        },
        timeline: "4 months",
        quote: "September: $1,200. December: $9,700. Same girl, just certified. The business module literally handed me the blueprint.",
        highlight: "$21,100 in first 4 months part-time"
    },
    {
        name: "Virginia P.",
        location: "Albuquerque, NM",
        avatar: "https://pub-bc3849663dc849e59aee2d3c517f51e1.r2.dev/avatars/zombie-cmk8w1zwa000axym9ce9izs8r.png",
        before: {
            situation: "Physical therapist for 22 years",
            income: "Good salary, but missing something",
            feeling: "Wanted to help at root cause level"
        },
        after: {
            situation: "Integrates FM into PT practice",
            income: "$9,100/month",
            feeling: "Finally the healer I always wanted to be"
        },
        timeline: "5 months",
        quote: "Client ran into me at Whole Foods. 'You gave me my life back - I'm off 3 medications.' We both cried in aisle 7.",
        highlight: "22-year PT says 'Nothing compares to root cause work'"
    },
    {
        name: "Ruth H.",
        location: "Memphis, TN",
        avatar: "https://pub-bc3849663dc849e59aee2d3c517f51e1.r2.dev/avatars/zombie-cmk8w206a000cxym92yegkgjy.png",
        before: {
            situation: "Dental hygienist, failed exam twice",
            income: "$0 from new career",
            feeling: "Almost gave up completely"
        },
        after: {
            situation: "Passed 3rd time with 94%, now thriving",
            income: "$5,800/month",
            feeling: "The failures made me better"
        },
        timeline: "5 months",
        quote: "I failed TWICE. Sarah said 'You're not failing, you're learning.' Third time? 94%. Now making $5.8K part-time.",
        highlight: "Proof that persistence pays off"
    },
    {
        name: "Michelle R.",
        location: "Orlando, FL",
        avatar: "https://pub-bc3849663dc849e59aee2d3c517f51e1.r2.dev/avatars/zombie-cmktpt36z00cw6um9onazza5t.png",
        before: {
            situation: "Nurse practitioner, burned out",
            income: "$0 from coaching",
            feeling: "Knew there was more to healing"
        },
        after: {
            situation: "Integrated health practice",
            income: "$10,400/month",
            feeling: "Finally doing what I was meant to do"
        },
        timeline: "4 months",
        quote: "I went from prescribing pills to finding root causes. My patients are healthier. I'm happier. And I'm making more.",
        highlight: "Charging $400/session, fully booked"
    },
];

// Additional quick testimonials for social proof
const QUICK_TESTIMONIALS = [
    { name: "Rachel T.", income: "$6,200/mo", avatar: "https://pub-bc3849663dc849e59aee2d3c517f51e1.r2.dev/avatars/zombie-cmktpt4bg00d06um9e84yx1wn.png" },
    { name: "Amanda L.", income: "$5,400/mo", avatar: "https://pub-bc3849663dc849e59aee2d3c517f51e1.r2.dev/avatars/zombie-cmktpt5g300d46um9ye2o086t.png" },
    { name: "Nicole B.", income: "$7,100/mo", avatar: "https://pub-bc3849663dc849e59aee2d3c517f51e1.r2.dev/avatars/zombie-cmktpt7ap00da6um9ynglyfyh.png" },
    { name: "Christina W.", income: "$8,900/mo", avatar: "https://pub-bc3849663dc849e59aee2d3c517f51e1.r2.dev/avatars/zombie-cmktpt7w500dc6um98yciz6dy.png" },
    { name: "Maria T.", income: "$6,800/mo", avatar: "https://pub-bc3849663dc849e59aee2d3c517f51e1.r2.dev/avatars/zombie-cmktpt95300dg6um9glsaxtst.png" },
    { name: "Ashley C.", income: "$7,500/mo", avatar: "https://pub-bc3849663dc849e59aee2d3c517f51e1.r2.dev/avatars/zombie-cmktpt9v200di6um9pfr2rs96.png" },
];

// ============================================
// SOCIAL PROOF - Live Purchase Ticker
// ============================================
const SOCIAL_PROOF_ITEMS = [
    { name: "Maria G.", location: "Austin, TX", timeAgo: "2 min ago" },
    { name: "Jennifer P.", location: "San Diego, CA", timeAgo: "7 min ago" },
    { name: "Linda M.", location: "Denver, CO", timeAgo: "12 min ago" },
    { name: "Patricia K.", location: "Seattle, WA", timeAgo: "18 min ago" },
    { name: "Susan R.", location: "Miami, FL", timeAgo: "23 min ago" },
    { name: "Nancy T.", location: "Portland, OR", timeAgo: "31 min ago" },
    { name: "Karen W.", location: "Nashville, TN", timeAgo: "45 min ago" },
    { name: "Dorothy S.", location: "Phoenix, AZ", timeAgo: "1 hour ago" },
];

// ============================================
// FAQ QUESTIONS
// ============================================
const FAQ_ITEMS = [
    {
        question: "How long do I have access to the program?",
        answer: "Lifetime access! Once you enroll, you have unlimited access to all modules, updates, and the private community forever. We continuously update the content as the industry evolves."
    },
    {
        question: "What if I'm not satisfied with the program?",
        answer: "We offer a 30-day 'Love It Or Leave It' guarantee. If you don't feel 100% confident this will help you build a profitable practice, simply email us within 30 days for a full refund. No questions asked."
    },
    {
        question: "Do I need any prior certifications to enroll?",
        answer: "No prior certifications required! Since you completed the Mini Diploma, you've already proven you have the foundation. The Board Certification builds on what you learned and adds the business skills to turn it into income."
    },
    {
        question: "How is this different from free YouTube content?",
        answer: "Free content teaches theory. This program gives you the exact systems, templates, and step-by-step guidance to actually build a practice. You get 2,000+ done-for-you templates, legal documents, and 1-on-1 mentorship. Our graduates average $7,400/month within 4 months."
    },
    {
        question: "Will this certification work in my country?",
        answer: "Yes! Our certification is recognized internationally. We have graduates from 47 countries running successful practices. The business systems we teach work globally."
    },
    {
        question: "What support do I get if I get stuck?",
        answer: "You're never alone! You get 1-on-1 mentorship with Coach Sarah, access to our private community of 2,847+ graduates, and direct email support. Most questions get answered within 24 hours."
    },
];

// ============================================
// TRUST BADGES DATA
// ============================================
const TRUST_BADGES = [
    { icon: Shield, label: "ASI Accredited", sublabel: "Board Certification" },
    { icon: Users, label: "2,847+ Graduates", sublabel: "This Year Alone" },
    { icon: Award, label: "30-Day Guarantee", sublabel: "100% Money Back" },
    { icon: Lock, label: "Secure Checkout", sublabel: "256-bit SSL" },
    { icon: BadgeCheck, label: "CPD Approved", sublabel: "50+ CEU Hours" },
];

// ============================================
// SOCIAL PROOF TICKER COMPONENT
// ============================================
function SocialProofTicker() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setIsVisible(false);
            setTimeout(() => {
                setCurrentIndex((prev) => (prev + 1) % SOCIAL_PROOF_ITEMS.length);
                setIsVisible(true);
            }, 300);
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const item = SOCIAL_PROOF_ITEMS[currentIndex];

    return (
        <div className="fixed top-4 left-4 z-50 max-w-xs">
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-lg shadow-xl border border-gray-200 p-3 flex items-center gap-3"
            >
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                        🎉 {item.name} just enrolled!
                    </p>
                    <p className="text-xs text-gray-500">
                        {item.location} • {item.timeAgo}
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

// ============================================
// FAQ ACCORDION COMPONENT
// ============================================
function FAQAccordion() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <div className="space-y-3">
            {FAQ_ITEMS.map((item, idx) => (
                <div
                    key={idx}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                >
                    <button
                        onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                    >
                        <span className="font-semibold text-gray-900 pr-4">{item.question}</span>
                        <span className="text-2xl text-burgundy-600 flex-shrink-0">
                            {openIndex === idx ? "−" : "+"}
                        </span>
                    </button>
                    {openIndex === idx && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            className="px-4 pb-4"
                        >
                            <p className="text-gray-600 leading-relaxed">{item.answer}</p>
                        </motion.div>
                    )}
                </div>
            ))}
        </div>
    );
}

// ============================================
// TRUST BADGES COMPONENT
// ============================================
function TrustBadges() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {TRUST_BADGES.map((badge, idx) => (
                <div
                    key={idx}
                    className="bg-white rounded-xl p-4 border border-gray-200 text-center shadow-sm"
                >
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: '#d4af37' }}>
                        <badge.icon className="w-5 h-5 text-burgundy-900" />
                    </div>
                    <p className="font-semibold text-gray-900 text-sm">{badge.label}</p>
                    <p className="text-xs text-gray-500">{badge.sublabel}</p>
                </div>
            ))}
        </div>
    );
}

// ============================================
// COUNTDOWN TIMER
// ============================================
function CountdownTimer({ initialHours = 24 }: { initialHours?: number }) {
    const [timeLeft, setTimeLeft] = useState({ hours: initialHours, minutes: 0, seconds: 0 });

    useEffect(() => {
        const endTime = new Date();
        endTime.setHours(endTime.getHours() + initialHours);

        const timer = setInterval(() => {
            const now = new Date();
            const diff = endTime.getTime() - now.getTime();
            if (diff <= 0) { clearInterval(timer); return; }

            setTimeLeft({
                hours: Math.floor(diff / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000),
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [initialHours]);

    return (
        <div className="flex items-center justify-center gap-3">
            {[
                { value: timeLeft.hours, label: "HRS" },
                { value: timeLeft.minutes, label: "MIN" },
                { value: timeLeft.seconds, label: "SEC" },
            ].map((unit, idx) => (
                <div key={idx} className="text-center">
                    <div className="bg-burgundy-900 text-white text-2xl md:text-3xl font-black px-3 md:px-4 py-2 md:py-3 rounded-lg shadow-lg border border-burgundy-700">
                        {String(unit.value).padStart(2, "0")}
                    </div>
                    <span className="text-xs text-burgundy-300 mt-1">{unit.label}</span>
                </div>
            ))}
        </div>
    );
}

// ============================================
// INCOME CALCULATOR
// ============================================
function IncomeCalculator() {
    const [sessionsPerWeek, setSessionsPerWeek] = useState(5);
    const sessionRate = 175;
    const weeklyIncome = sessionsPerWeek * sessionRate;
    const monthlyIncome = weeklyIncome * 4;
    const yearlyIncome = monthlyIncome * 12;

    return (
        <div className="bg-white rounded-2xl p-6 md:p-8 shadow-xl border-2 border-burgundy-100">
            <div className="text-center mb-6">
                <span className="inline-flex items-center gap-2 bg-burgundy-100 text-burgundy-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                    <DollarSign className="w-4 h-4" />
                    Income Calculator
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                    See Your Earning Potential
                </h3>
            </div>

            <div className="space-y-6">
                <div>
                    <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Sessions per week</span>
                        <span className="text-lg font-bold text-burgundy-600">{sessionsPerWeek} sessions</span>
                    </div>
                    <input
                        type="range"
                        min="1"
                        max="20"
                        value={sessionsPerWeek}
                        onChange={(e) => setSessionsPerWeek(Number(e.target.value))}
                        className="w-full h-3 bg-burgundy-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Part-time (1)</span>
                        <span>Full-time (20)</span>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-2 md:gap-4">
                    <div className="bg-gray-50 rounded-xl p-3 md:p-4 text-center border">
                        <p className="text-xs text-gray-500 mb-1">Per Session</p>
                        <p className="text-lg md:text-xl font-bold text-gray-800">${sessionRate}</p>
                    </div>
                    <div className="bg-burgundy-50 rounded-xl p-3 md:p-4 text-center border border-burgundy-200">
                        <p className="text-xs text-burgundy-500 mb-1">Monthly</p>
                        <p className="text-lg md:text-xl font-bold text-burgundy-600">${monthlyIncome.toLocaleString()}</p>
                    </div>
                    <div className="bg-burgundy-700 rounded-xl p-3 md:p-4 text-center shadow-lg">
                        <p className="text-xs text-burgundy-200 mb-1">Yearly</p>
                        <p className="text-lg md:text-xl font-black text-white">${yearlyIncome.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-emerald-50 rounded-xl p-3 md:p-4 border border-emerald-200 text-center">
                    <p className="text-emerald-800 text-sm md:text-base">
                        <strong>ROI:</strong> Earn back your $397 investment in just <strong>{Math.ceil(397 / monthlyIncome * 30)} days</strong>
                    </p>
                </div>
            </div>
        </div>
    );
}

// ============================================
// CASE STUDY CARD - Fully Responsive, Solid Burgundy, Gold Metal
// ============================================
function CaseStudyCard({ study, index }: { study: typeof CASE_STUDIES[0]; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-200 flex flex-col h-full"
        >
            {/* Header - Solid Burgundy */}
            <div className="bg-burgundy-700 p-4 text-white">
                <div className="flex items-center gap-3">
                    {/* Avatar from R2 */}
                    <img
                        src={study.avatar}
                        alt={study.name}
                        className="w-12 h-12 rounded-full border-2 border-[#d4af37] object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-base truncate">{study.name}</h4>
                        <p className="text-burgundy-200 text-xs truncate">{study.location}</p>
                    </div>
                    <div className="bg-[#d4af37] text-burgundy-900 text-xs font-bold px-2 py-1 rounded-full flex-shrink-0">
                        {study.timeline}
                    </div>
                </div>
            </div>

            {/* Before/After - Responsive */}
            <div className="p-4 flex-1 flex flex-col">
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {/* Before */}
                    <div className="bg-gray-100 rounded-lg p-3">
                        <p className="text-[10px] font-bold text-gray-500 mb-1">BEFORE</p>
                        <p className="text-base md:text-lg font-black text-gray-400 leading-tight">{study.before.income}</p>
                        <p className="text-[11px] text-gray-500 mt-1 line-clamp-2">{study.before.situation}</p>
                    </div>
                    {/* After - Gold metal border */}
                    <div className="bg-emerald-50 rounded-lg p-3 border-2 border-emerald-400">
                        <p className="text-[10px] font-bold text-emerald-600 mb-1">AFTER</p>
                        <p className="text-base md:text-lg font-black text-emerald-600 leading-tight">{study.after.income}</p>
                        <p className="text-[11px] text-emerald-700 mt-1 line-clamp-2">{study.after.situation}</p>
                    </div>
                </div>

                {/* Quote - Gold metal accent */}
                <div className="bg-[#fef7e0] rounded-lg p-3 border border-[#d4af37]/30 flex-1">
                    <div className="flex gap-2">
                        <Quote className="w-5 h-5 text-[#d4af37] flex-shrink-0 mt-0.5" />
                        <p className="text-gray-700 text-xs md:text-sm italic leading-relaxed line-clamp-4">"{study.quote}"</p>
                    </div>
                </div>

                {/* Highlight */}
                <div className="mt-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#d4af37] flex-shrink-0" />
                    <span className="text-xs font-semibold text-burgundy-700 line-clamp-1">{study.highlight}</span>
                </div>
            </div>
        </motion.div>
    );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function ScholarshipPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [firstName, setFirstName] = useState("there");

    const config = getConfigByPortalSlug(slug);
    const totalValue = VALUE_STACK.reduce((sum, item) => sum + item.value, 0);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch(`/api/lead-onboarding/lesson-status?lesson=9&niche=${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setFirstName(data.firstName || "there");
                }
            } catch (e) { console.error("Failed to fetch user"); }
        };
        fetchUser();

        // Confetti celebration
        setTimeout(() => {
            confetti({ particleCount: 150, spread: 80, origin: { y: 0.3 } });
        }, 500);
    }, [slug]);

    const handleClaimScholarship = () => {
        if (typeof window !== "undefined" && (window as any).fbq) {
            (window as any).fbq("track", "InitiateCheckout", {
                content_name: config?.displayName || "Full Certification",
                content_category: slug,
                value: 397,
                currency: "USD",
            });
        }
        const checkoutUrl = config?.checkoutUrl || `/checkout?product=${slug}&discount=SCHOLAR70`;
        window.location.href = checkoutUrl;
    };

    if (!config) {
        return <div className="min-h-screen flex items-center justify-center"><p>Portal not found</p></div>;
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Social Proof Ticker */}
            <SocialProofTicker />

            {/* ============================================ */}
            {/* HERO SECTION - Burgundy & Gold Premium */}
            {/* ============================================ */}
            <section className="relative overflow-hidden">
                {/* Background pattern */}
                <div className="absolute inset-0" style={{ backgroundColor: '#4e1f24' }} />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('/patterns/topography.svg')" }} />

                <div className="relative py-16 px-4">
                    <div className="max-w-4xl mx-auto text-center text-white">

                        {/* Sarah's warm welcome */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center gap-4 mb-8"
                        >
                            <Image
                                src={SARAH_AVATAR}
                                alt="Sarah"
                                width={72}
                                height={72}
                                className="w-18 h-18 rounded-full border-4 border-amber-400 shadow-xl"
                            />
                            <div className="text-left">
                                <p className="text-amber-300 font-semibold text-sm">A Message from Sarah</p>
                                <p className="text-white/90 text-lg">
                                    {firstName}, I'm <span className="text-amber-400 font-bold">SO proud</span> of you! 🎉
                                </p>
                            </div>
                        </motion.div>

                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.1 }}
                            className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/50 text-amber-300 px-6 py-2 rounded-full text-sm font-semibold mb-6 backdrop-blur-sm"
                        >
                            <Award className="w-5 h-5" />
                            Top 5% of All Exam Takers
                        </motion.div>

                        {/* Main Headline */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-6xl font-black mb-6 leading-tight"
                        >
                            Now Let's Turn Your Certification Into
                            <br />
                            <span style={{ color: '#d4af37' }}>
                                $5,000 - $10,000/Month
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-xl text-white/80 mb-10 max-w-2xl mx-auto"
                        >
                            Join 2,847+ graduates who went from "just certified" to <strong className="text-white">running profitable practices</strong>
                        </motion.p>

                        {/* Countdown */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 }}
                            className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-md mx-auto mb-8"
                        >
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <Clock className="w-5 h-5 text-amber-400" />
                                <span className="text-amber-300 font-semibold">Your Scholarship Expires In:</span>
                            </div>
                            <CountdownTimer initialHours={24} />
                        </motion.div>

                        {/* CTA */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <Button
                                onClick={handleClaimScholarship}
                                size="lg"
                                className="text-burgundy-900 font-black text-xl px-12 py-7 rounded-2xl shadow-2xl hover:brightness-110 transition-all transform hover:scale-105"
                                style={{ backgroundColor: '#d4af37' }}
                            >
                                YES! CLAIM MY $397 SCHOLARSHIP
                                <ArrowRight className="w-6 h-6 ml-2" />
                            </Button>
                            <p className="text-sm text-white/60 mt-4 flex items-center justify-center gap-4">
                                <span className="flex items-center gap-1"><Lock className="w-3 h-3" /> Secure</span>
                                <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> 30-Day Guarantee</span>
                                <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> Instant Access</span>
                            </p>
                        </motion.div>
                    </div>
                </div>

                {/* Gold ribbon divider */}
                <div className="h-2" style={{ backgroundColor: '#d4af37' }} />
            </section>

            {/* ============================================ */}
            {/* SARAH'S STORY SECTION */}
            {/* ============================================ */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <span className="inline-flex items-center gap-2 bg-burgundy-100 text-burgundy-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                                <Heart className="w-4 h-4" />
                                Why I Created This Program
                            </span>
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">
                                I Was Exactly Where You Are Right Now
                            </h2>
                            <div className="space-y-4 text-gray-600">
                                <p>
                                    When I first got certified, I thought clients would just... appear.
                                    <strong className="text-gray-900"> They didn't.</strong>
                                </p>
                                <p>
                                    I spent 6 months struggling—no website, no marketing, no idea how to actually
                                    <em> run a business</em>. I almost gave up.
                                </p>
                                <p>
                                    Then I figured it out. I created systems. Templates. A proven process.
                                    Within 90 days, I was fully booked.
                                </p>
                                <p className="text-burgundy-700 font-semibold">
                                    I don't want you to struggle like I did. That's why I'm giving you
                                    EVERYTHING—the certification AND the business systems—at a fraction of what it cost me to build.
                                </p>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="bg-gradient-to-br from-burgundy-100 to-amber-100 rounded-3xl p-8">
                                <Image
                                    src={SARAH_AVATAR}
                                    alt="Sarah"
                                    width={300}
                                    height={300}
                                    className="w-full h-auto rounded-2xl shadow-xl"
                                />
                                <div className="absolute -bottom-4 -right-4 bg-amber-400 text-burgundy-900 font-bold px-4 py-2 rounded-full shadow-lg">
                                    ❤️ Your Coach, Sarah
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================ */}
            {/* INCOME CALCULATOR */}
            {/* ============================================ */}
            <section className="py-16 px-4 bg-burgundy-50">
                <div className="max-w-2xl mx-auto">
                    <IncomeCalculator />
                </div>
            </section>

            {/* ============================================ */}
            {/* VALUE STACK - Premium Metal Look */}
            {/* ============================================ */}
            <section className="py-16 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-10">
                        <span className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                            <Gift className="w-4 h-4" />
                            Everything Included
                        </span>
                        <h2 className="text-3xl font-bold text-gray-900">
                            Here's What You're Getting Today
                        </h2>
                    </div>

                    <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-burgundy-100">
                        {VALUE_STACK.map((item, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                viewport={{ once: true }}
                                className={`flex items-start justify-between p-5 border-b border-gray-100 last:border-0 hover:bg-burgundy-50/50 transition-colors ${item.isBonus ? 'bg-amber-50' :
                                    item.isMain ? 'bg-burgundy-50/30' : ''
                                    }`}
                            >
                                <div className="flex items-start gap-4 flex-1">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${item.isBonus ? 'bg-amber-300' : 'bg-emerald-100'
                                        }`}>
                                        <CheckCircle2 className={`w-5 h-5 ${item.isBonus ? 'text-amber-800' : 'text-emerald-600'}`} />
                                    </div>
                                    <div>
                                        <span className={`font-semibold text-gray-900 ${item.isMain ? 'text-base' : 'text-sm'}`}>
                                            {item.item}
                                        </span>
                                        {item.subtitle && (
                                            <p className="text-xs text-gray-500 mt-1">{item.subtitle}</p>
                                        )}
                                    </div>
                                </div>
                                <span className="text-burgundy-600 font-bold whitespace-nowrap">
                                    ${item.value.toLocaleString()}
                                </span>
                            </motion.div>
                        ))}

                        {/* Totals */}
                        <div className="p-8 text-white" style={{ backgroundColor: '#4e1f24' }}>
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-xl">Total Value:</span>
                                <span className="text-3xl font-bold">${totalValue.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center justify-between mb-6">
                                <span className="text-xl">Your Scholarship Price:</span>
                                <div className="text-right">
                                    <span className="text-burgundy-300 line-through text-lg mr-3">$997</span>
                                    <span className="text-5xl font-black text-amber-400">$397</span>
                                </div>
                            </div>
                            <div className="text-center">
                                <span className="inline-block text-burgundy-900 font-black px-6 py-2 rounded-full text-lg shadow-lg" style={{ backgroundColor: '#d4af37' }}>
                                    YOU SAVE 96% TODAY
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================ */}
            {/* CASE STUDIES */}
            {/* ============================================ */}
            <section className="py-12 md:py-16 px-4 bg-burgundy-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-8 md:mb-12">
                        <span className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                            <TrendingUp className="w-4 h-4" />
                            Real Results
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            Graduate Success Stories
                        </h2>
                        <p className="text-gray-600 text-sm md:text-base">
                            See how regular people built $5-10K/month practices
                        </p>
                    </div>

                    {/* Responsive Grid: 1 col mobile, 2 cols tablet, 3 cols desktop */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                        {CASE_STUDIES.map((study, idx) => (
                            <CaseStudyCard key={idx} study={study} index={idx} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================================ */}
            {/* GUARANTEE */}
            {/* ============================================ */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-emerald-50 rounded-3xl p-10 border-2 border-emerald-200 text-center relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-500" />

                        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl">
                            <Shield className="w-12 h-12 text-white" />
                        </div>

                        <h3 className="text-2xl font-bold text-gray-900 mb-4">
                            30-Day "Love It Or Leave It" Guarantee
                        </h3>

                        <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                            If you don't feel <strong>100% confident</strong> this will help you build a profitable practice,
                            just email me within 30 days. <strong>Full refund. No questions. No hard feelings.</strong>
                        </p>

                        <div className="flex items-center justify-center gap-2 text-emerald-700 font-semibold">
                            <Heart className="w-5 h-5" />
                            I believe in you, {firstName}. — Sarah
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================================ */}
            {/* TRUST BADGES */}
            {/* ============================================ */}
            <section className="py-12 px-4 bg-burgundy-50">
                <div className="max-w-4xl mx-auto">
                    <TrustBadges />
                </div>
            </section>

            {/* ============================================ */}
            {/* FAQ SECTION */}
            {/* ============================================ */}
            <section className="py-16 px-4 bg-white">
                <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-gray-600">
                            Got questions? We've got answers.
                        </p>
                    </div>
                    <FAQAccordion />
                </div>
            </section>

            {/* ============================================ */}
            {/* FINAL CTA */}
            {/* ============================================ */}
            <section className="py-20 px-4 relative overflow-hidden" style={{ backgroundColor: '#4e1f24' }}>
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "url('/patterns/topography.svg')" }} />

                <div className="relative max-w-3xl mx-auto text-center text-white">
                    <h2 className="text-4xl font-black mb-4">
                        Ready to Start Earning $5-10K/Month?
                    </h2>
                    <p className="text-burgundy-200 text-xl mb-8">
                        Your scholarship is reserved for the next 24 hours
                    </p>

                    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 max-w-md mx-auto mb-8">
                        <CountdownTimer initialHours={24} />
                    </div>

                    <Button
                        onClick={handleClaimScholarship}
                        size="lg"
                        className="text-burgundy-900 font-black text-2xl px-16 py-8 rounded-2xl shadow-2xl hover:brightness-110 transition-all transform hover:scale-105"
                        style={{ backgroundColor: '#d4af37' }}
                    >
                        CLAIM MY SCHOLARSHIP - $397
                        <ArrowRight className="w-7 h-7 ml-3" />
                    </Button>

                    <p className="text-sm text-white/50 mt-6">
                        ✓ Instant access • ✓ 30-day guarantee • ✓ 2,847+ graduates this year
                    </p>
                </div>
            </section>

            {/* ============================================ */}
            {/* STICKY MOBILE CTA */}
            {/* ============================================ */}
            <div className="fixed bottom-0 left-0 right-0 p-4 md:hidden z-50 shadow-2xl" style={{ backgroundColor: '#4e1f24' }}>
                <Button
                    onClick={handleClaimScholarship}
                    className="w-full text-burgundy-900 font-black py-5 rounded-xl text-lg"
                    style={{ backgroundColor: '#d4af37' }}
                >
                    CLAIM SCHOLARSHIP - $397
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </div>

            <div className="h-24 md:hidden" />
        </div>
    );
}
