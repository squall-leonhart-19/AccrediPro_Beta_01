"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Award, CheckCircle2, ArrowRight, X,
    GraduationCap, Users, Star, Clock,
    BookOpen, Shield, ChevronDown, ChevronUp,
    DollarSign, Heart, Sparkles, Gift, Zap,
    Globe, MessageCircle, FileText, Layout,
    Phone, Calendar, Target
} from "lucide-react";

// Brand Colors
const BRAND = {
    burgundy: "#722f37",
    burgundyDark: "#4e1f24",
    burgundyLight: "#9a4a54",
    gold: "#d4af37",
    goldLight: "#f7e7a0",
    goldDark: "#b8860b",
    cream: "#fdf8f0",
    green: "#22c55e",
    goldMetallic: "linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)",
    burgundyMetallic: "linear-gradient(135deg, #722f37 0%, #9a4a54 25%, #722f37 50%, #4e1f24 75%, #722f37 100%)",
};

interface ScholarshipOfferPageProps {
    userName: string;
    examScore: number;
    diplomaName: string;
    diplomaSlug: string;
    checkoutUrl?: string;
}

export function ScholarshipOfferPage({
    userName,
    examScore,
    diplomaName,
    diplomaSlug,
    checkoutUrl = "/checkout/board-certification"
}: ScholarshipOfferPageProps) {
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [showExitIntent, setShowExitIntent] = useState(false);
    const [showConfetti, setShowConfetti] = useState(true);

    // Countdown timer - 48 hours
    const [timeLeft, setTimeLeft] = useState({ hours: 47, minutes: 59, seconds: 59 });
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
                if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
                return prev;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Spots remaining (fake scarcity)
    const [spotsLeft] = useState(Math.floor(Math.random() * 5) + 3);

    // Hide confetti after 5 seconds
    useEffect(() => {
        const timeout = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timeout);
    }, []);

    // Exit intent detection
    useEffect(() => {
        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY <= 0 && !showExitIntent) {
                setShowExitIntent(true);
            }
        };
        document.addEventListener("mouseleave", handleMouseLeave);
        return () => document.removeEventListener("mouseleave", handleMouseLeave);
    }, [showExitIntent]);

    return (
        <div className="min-h-screen" style={{ backgroundColor: BRAND.cream }}>
            {/* Confetti Animation */}
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                    {Array.from({ length: 50 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute animate-confetti"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `-10%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${3 + Math.random() * 2}s`,
                                backgroundColor: [BRAND.gold, BRAND.burgundy, BRAND.green, '#fff'][Math.floor(Math.random() * 4)],
                                width: '10px',
                                height: '10px',
                                borderRadius: Math.random() > 0.5 ? '50%' : '0',
                            }}
                        />
                    ))}
                </div>
            )}

            {/* URGENCY BAR */}
            <div style={{ background: BRAND.goldMetallic }} className="py-3 px-4 text-center sticky top-0 z-40">
                <p className="text-sm font-bold flex items-center justify-center gap-2 flex-wrap" style={{ color: BRAND.burgundyDark }}>
                    🎓 SCHOLARSHIP EXPIRES IN:
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded bg-red-600 text-white text-sm font-mono">
                        {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    • Only {spotsLeft} spots remaining today
                </p>
            </div>

            {/* CELEBRATION SECTION */}
            <section className="py-12 md:py-16 text-center" style={{ backgroundColor: BRAND.burgundyDark }}>
                <div className="max-w-3xl mx-auto px-4">
                    {/* Achievement Badge */}
                    <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl" style={{ background: BRAND.goldMetallic }}>
                        <GraduationCap className="w-12 h-12" style={{ color: BRAND.burgundyDark }} />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4">
                        🎉 CONGRATULATIONS, {userName.toUpperCase()}!
                    </h1>

                    <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20`, border: `2px solid ${BRAND.gold}` }}>
                        <Award className="w-6 h-6" style={{ color: BRAND.gold }} />
                        <span className="text-xl font-bold" style={{ color: BRAND.gold }}>You Passed with {examScore}%!</span>
                    </div>

                    <p className="text-xl text-white/80 mb-8">
                        You are now a <strong className="text-white">{diplomaName} Foundation Graduate</strong>
                    </p>

                    {/* Certificate Preview */}
                    <div className="relative max-w-md mx-auto mb-8">
                        <div className="absolute -inset-4 rounded-2xl opacity-30 blur-xl" style={{ backgroundColor: BRAND.gold }} />
                        <div className="relative bg-white rounded-xl shadow-2xl p-3 border-2" style={{ borderColor: BRAND.gold }}>
                            <Image
                                src="/FUNCTIONAL_MEDICINE_CERTIFICATE.webp"
                                alt="Your Certificate"
                                width={400}
                                height={300}
                                className="rounded-lg w-full"
                            />
                        </div>
                    </div>

                    <Button
                        className="h-12 px-6 font-semibold"
                        variant="outline"
                        style={{ borderColor: BRAND.gold, color: BRAND.gold }}
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Download Your Certificate
                    </Button>
                </div>
            </section>

            {/* THE UNLOCK */}
            <section className="py-12 md:py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.green}20`, border: `1px solid ${BRAND.green}` }}>
                        <Sparkles className="w-5 h-5 text-green-600" />
                        <span className="font-bold text-green-700">YOUR SCORE UNLOCKED SOMETHING SPECIAL</span>
                    </div>

                    <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                        Because You Scored {examScore}%,<br />
                        <span style={{ color: BRAND.burgundy }}>You Now QUALIFY For...</span>
                    </h2>

                    <div className="relative inline-block">
                        <div className="absolute -inset-2 rounded-2xl opacity-20 blur-xl" style={{ backgroundColor: BRAND.gold }} />
                        <div className="relative bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl px-8 py-6 border-2" style={{ borderColor: BRAND.gold }}>
                            <p className="text-lg text-gray-600 mb-2">Sarah's Exclusive</p>
                            <h3 className="text-3xl md:text-4xl font-black" style={{ color: BRAND.burgundy }}>
                                ✨ BOARD CERTIFICATION SCHOLARSHIP ✨
                            </h3>
                            <p className="text-gray-500 mt-2">Only available to Mini Diploma graduates who pass</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* VALUE STACK */}
            <section className="py-12 md:py-16" style={{ backgroundColor: "#faf5eb" }}>
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                            Everything You Get With<br />
                            <span style={{ color: BRAND.burgundy }}>Board Certification</span>
                        </h2>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border" style={{ borderColor: BRAND.gold }}>
                        {[
                            { icon: BookOpen, item: "Complete Board Certification Program (12 Advanced Modules)", value: "$2,997" },
                            { icon: MessageCircle, item: "1-on-1 Mentorship with Sarah — Until You're Certified", value: "$2,400", highlight: true },
                            { icon: Layout, item: "Done-For-You Professional Website (Ready to Launch)", value: "$997" },
                            { icon: Target, item: "DFY Client Acquisition Kit (Scripts, Funnels, Templates)", value: "$697" },
                            { icon: FileText, item: "30-Day Social Media Content Calendar", value: "$297" },
                            { icon: Shield, item: "Legal Contract Templates (Client Agreements)", value: "$197" },
                            { icon: Award, item: "ASI Board Certification Exam + Official Certificate", value: "$297" },
                            { icon: Globe, item: "ASI Directory Listing (Clients Find YOU)", value: "$197" },
                            { icon: Users, item: "Private Community Access (Lifetime)", value: "$497" },
                        ].map((row, i) => (
                            <div
                                key={i}
                                className={`flex items-center justify-between p-5 ${i < 8 ? "border-b border-gray-100" : ""} ${row.highlight ? "bg-yellow-50" : ""}`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}10` }}>
                                        <row.icon className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                                    </div>
                                    <span className={`font-medium text-gray-800 ${row.highlight ? "font-bold" : ""}`}>
                                        {row.item}
                                        {row.highlight && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">UNLIMITED</span>}
                                    </span>
                                </div>
                                <span className="text-gray-400 line-through text-sm font-mono">{row.value}</span>
                            </div>
                        ))}

                        <div className="p-6 text-center" style={{ background: BRAND.burgundyMetallic }}>
                            <p className="text-white/80 text-sm mb-1">Total Value:</p>
                            <p className="text-3xl font-black text-white line-through opacity-60">$8,576</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SCHOLARSHIP PRICE */}
            <section className="py-12 md:py-16 bg-white">
                <div className="max-w-3xl mx-auto px-4 text-center">
                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6">
                        Your Exclusive Scholarship Price:
                    </h2>

                    <div className="relative inline-block mb-8">
                        <div className="absolute -inset-4 rounded-3xl opacity-30 blur-2xl" style={{ backgroundColor: BRAND.gold }} />
                        <div className="relative bg-gradient-to-br from-yellow-50 to-amber-100 rounded-3xl px-12 py-10 border-4" style={{ borderColor: BRAND.gold }}>
                            <p className="text-gray-500 text-lg mb-2">Instead of <span className="line-through">$8,576</span></p>
                            <div className="text-6xl md:text-7xl font-black mb-2" style={{ color: BRAND.burgundy }}>
                                $997
                            </div>
                            <p className="text-gray-600 mb-4">or 3 easy payments of <strong>$397</strong></p>
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 font-bold">
                                <Zap className="w-4 h-4" />
                                Save $7,579 (88% OFF)
                            </div>
                        </div>
                    </div>

                    {/* CTA Buttons */}
                    <div className="space-y-4">
                        <Link href={checkoutUrl}>
                            <Button
                                className="w-full max-w-md h-16 text-xl font-black shadow-2xl"
                                style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                            >
                                CLAIM MY SCHOLARSHIP — $997
                                <ArrowRight className="ml-2 w-6 h-6" />
                            </Button>
                        </Link>
                        <Link href={`${checkoutUrl}?plan=payment-plan`}>
                            <Button
                                variant="outline"
                                className="w-full max-w-md h-14 text-lg font-bold"
                                style={{ borderColor: BRAND.burgundy, color: BRAND.burgundy }}
                            >
                                Or 3 Payments of $397
                            </Button>
                        </Link>
                    </div>

                    {/* Guarantee */}
                    <div className="mt-8 inline-flex items-center gap-3 px-6 py-4 rounded-2xl bg-green-50 border-2 border-green-200">
                        <Shield className="w-8 h-8 text-green-600" />
                        <div className="text-left">
                            <p className="font-bold text-green-800">100% Money-Back Guarantee</p>
                            <p className="text-sm text-green-600">30 days to try it. Not satisfied? Full refund. No questions.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* BONUSES */}
            <section className="py-12 md:py-16" style={{ backgroundColor: BRAND.burgundyDark }}>
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ backgroundColor: `${BRAND.gold}20` }}>
                            <Gift className="w-5 h-5" style={{ color: BRAND.gold }} />
                            <span className="font-bold" style={{ color: BRAND.gold }}>ORDER IN THE NEXT 24 HOURS</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-white">
                            And Get These <span style={{ color: BRAND.gold }}>FREE Bonuses</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { title: "\"First 5 Clients\" Masterclass", desc: "Step-by-step to land your first paying clients in 30 days or less", value: "$497" },
                            { title: "Sarah's Discovery Call Scripts", desc: "The exact scripts I use to close $1,500+ packages", value: "$297" },
                            { title: "30-Day Quick Start Plan", desc: "Daily action items to launch your practice FAST", value: "$197" }
                        ].map((bonus, i) => (
                            <div key={i} className="bg-white/10 rounded-2xl p-6 border border-white/20">
                                <div className="text-sm font-bold mb-2" style={{ color: BRAND.gold }}>BONUS {i + 1}</div>
                                <h3 className="text-xl font-bold text-white mb-2">{bonus.title}</h3>
                                <p className="text-white/60 text-sm mb-4">{bonus.desc}</p>
                                <div className="text-lg font-bold" style={{ color: BRAND.gold }}>
                                    Value: <span className="line-through opacity-60">{bonus.value}</span> FREE
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-8">
                        <p className="text-white/60 text-sm">⏰ Bonuses expire when the timer hits zero</p>
                    </div>
                </div>
            </section>

            {/* COMPARISON TABLE */}
            <section className="py-12 md:py-16 bg-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                            Mini Diploma vs <span style={{ color: BRAND.burgundy }}>Board Certified</span>
                        </h2>
                        <p className="text-gray-600">See what you're unlocking with the scholarship</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr>
                                    <th className="text-left p-4 bg-gray-50 border-b-2 border-gray-200"></th>
                                    <th className="p-4 bg-gray-50 border-b-2 border-gray-200 text-center">
                                        <div className="font-bold text-gray-500">Mini Diploma</div>
                                        <div className="text-xs text-gray-400">(You Have This)</div>
                                    </th>
                                    <th className="p-4 border-b-2 text-center" style={{ backgroundColor: `${BRAND.gold}10`, borderColor: BRAND.gold }}>
                                        <div className="font-bold" style={{ color: BRAND.burgundy }}>Board Certified</div>
                                        <div className="text-xs" style={{ color: BRAND.burgundy }}>✨ UPGRADE</div>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {[
                                    { feature: "Foundation Knowledge", mini: true, board: true },
                                    { feature: "Basic Certificate", mini: true, board: true },
                                    { feature: "Official Board Certificate", mini: false, board: true },
                                    { feature: "ASI Directory Listing", mini: false, board: true },
                                    { feature: "1-on-1 Mentorship with Sarah (Until Certified)", mini: false, board: true, highlight: true },
                                    { feature: "Done-For-You Website", mini: false, board: true },
                                    { feature: "Client Acquisition Training", mini: false, board: true },
                                    { feature: "DFY Marketing Kit", mini: false, board: true },
                                    { feature: "Legal Templates", mini: false, board: true },
                                    { feature: "Charge Premium Rates ($150-350/hr)", mini: false, board: true },
                                    { feature: "Doctor/Professional Referrals", mini: false, board: true },
                                    { feature: "Private Community (Lifetime)", mini: false, board: true },
                                ].map((row, i) => (
                                    <tr key={i} className={row.highlight ? "bg-yellow-50" : ""}>
                                        <td className="p-4 border-b border-gray-100 font-medium text-gray-800">
                                            {row.feature}
                                            {row.highlight && <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">100% GUARANTEED</span>}
                                        </td>
                                        <td className="p-4 border-b border-gray-100 text-center">
                                            {row.mini ? (
                                                <CheckCircle2 className="w-6 h-6 text-green-500 mx-auto" />
                                            ) : (
                                                <X className="w-6 h-6 text-gray-300 mx-auto" />
                                            )}
                                        </td>
                                        <td className="p-4 border-b text-center" style={{ backgroundColor: `${BRAND.gold}05`, borderColor: `${BRAND.gold}30` }}>
                                            <CheckCircle2 className="w-6 h-6 mx-auto" style={{ color: BRAND.burgundy }} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="text-center mt-8">
                        <Link href={checkoutUrl}>
                            <Button
                                className="h-14 px-10 text-lg font-bold"
                                style={{ background: BRAND.burgundyMetallic, color: "#fff" }}
                            >
                                Upgrade to Board Certified — $997
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* TESTIMONIALS */}
            <section className="py-12 md:py-16" style={{ backgroundColor: "#faf5eb" }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                            What Happens After<br />
                            <span style={{ color: BRAND.burgundy }}>Board Certification</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { name: "Jennifer M.", income: "$7,400/mo", quote: "Board Certification paid for itself in my first month. The mentorship with Sarah alone was worth 10x the investment.", avatar: "/zombie-avatars/user_47_backyard_bbq_1767801467.webp", time: "4 months" },
                            { name: "Michelle R.", income: "$5,600/mo", quote: "I got my first client 2 weeks after certification. The done-for-you website made it so easy to look professional from day one.", avatar: "/zombie-avatars/user_52_bedroom_morning_1767801467.webp", time: "6 weeks" },
                            { name: "Patricia L.", income: "$8,200/mo", quote: "Finally replaced my nursing salary. Sarah mentored me until I was confident. The 100% guarantee removed all my risk.", avatar: "/zombie-avatars/user_44_bathroom_mirror_1767801533.webp", time: "5 months" }
                        ].map((story, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <Image
                                        src={story.avatar}
                                        alt={story.name}
                                        width={48}
                                        height={48}
                                        className="rounded-full object-cover w-12 h-12"
                                    />
                                    <div>
                                        <p className="font-bold text-gray-900">{story.name}</p>
                                        <p className="text-xs text-gray-500">Results in {story.time}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm mb-4 italic">"{story.quote}"</p>
                                <div className="rounded-xl px-4 py-3 text-center" style={{ background: BRAND.goldMetallic }}>
                                    <p className="text-2xl font-black" style={{ color: BRAND.burgundyDark }}>{story.income}</p>
                                    <p className="text-xs" style={{ color: BRAND.burgundyDark }}>Monthly Income</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-12 md:py-16 bg-white">
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
                        Questions About the Scholarship
                    </h2>

                    <div className="space-y-3">
                        {[
                            { q: "What if I'm not ready to take clients yet?", a: "That's exactly why you get 1-on-1 mentorship with Sarah until you're certified! She'll work with you personally until you feel 100% confident. There's no time limit — you get support until you're ready." },
                            { q: "Can I pay in installments?", a: "Yes! You can choose 3 monthly payments of $397 instead of $997 upfront. Same full access, just spread out." },
                            { q: "How long do I have to complete the Board Certification?", a: "You have lifetime access to all materials. Most students complete in 8-12 weeks, but you can go at your own pace. Sarah's mentorship continues until you're certified, no time limit." },
                            { q: "What if I fail the Board exam?", a: "You can retake the exam as many times as needed — it's included. Plus, Sarah will personally mentor you until you pass. We guarantee your certification." },
                            { q: "Is the website really done-for-me?", a: "Yes! Our team builds you a professional website based on proven templates. You just provide your photo and bio, we handle everything else. Ready to accept clients within 7 days of enrollment." },
                            { q: "What's the 100% guarantee exactly?", a: "Try the full program for 30 days. If you don't love it, email us for a complete refund. No questions, no hassle, no hard feelings. We take all the risk so you don't have to." }
                        ].map((faq, i) => (
                            <div key={i} className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-4 text-left"
                                >
                                    <span className="font-semibold text-gray-800">{faq.q}</span>
                                    {openFaq === i ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>
                                {openFaq === i && (
                                    <div className="px-4 pb-4 text-gray-600 text-sm leading-relaxed">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-16 md:py-20 text-center" style={{ backgroundColor: BRAND.burgundyDark }}>
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
                        You've Proven You Can Learn This.<br />
                        <span style={{ color: BRAND.gold }}>Now Let Sarah Help You EARN With It.</span>
                    </h2>

                    <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
                        1-on-1 mentorship until certified. Done-for-you website. Client acquisition kit.
                        <strong className="text-white"> 100% money-back guarantee.</strong>
                    </p>

                    <div className="space-y-4">
                        <Link href={checkoutUrl}>
                            <Button
                                className="h-16 px-12 text-xl font-black shadow-2xl"
                                style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                            >
                                CLAIM MY SCHOLARSHIP — $997
                                <ArrowRight className="ml-2 w-6 h-6" />
                            </Button>
                        </Link>
                        <p className="text-white/50 text-sm">or 3 payments of $397</p>
                    </div>

                    <div className="mt-8 flex items-center justify-center gap-4 text-white/60 text-sm">
                        <div className="flex items-center gap-1">
                            <Shield className="w-4 h-4" />
                            <span>30-Day Guarantee</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>Lifetime Access</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>1-on-1 Mentorship</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* EXIT INTENT MODAL */}
            {showExitIntent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
                    <div className="bg-white rounded-2xl max-w-md w-full p-8 relative shadow-2xl">
                        <button
                            onClick={() => setShowExitIntent(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="text-center">
                            <div className="text-4xl mb-4">⏳</div>
                            <h3 className="text-2xl font-black text-gray-900 mb-2">
                                Wait! Before You Go...
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Can't afford $997 right now? Get Board Certification at an even lower price:
                            </p>

                            <div className="bg-gray-50 rounded-xl p-6 mb-6">
                                <p className="text-gray-500 text-sm mb-1">Special Exit Offer:</p>
                                <p className="text-4xl font-black" style={{ color: BRAND.burgundy }}>$497</p>
                                <p className="text-gray-500 text-sm mt-1">(Bonuses not included)</p>
                            </div>

                            <Link href={`${checkoutUrl}?offer=exit`}>
                                <Button
                                    className="w-full h-14 text-lg font-bold"
                                    style={{ background: BRAND.burgundyMetallic, color: "#fff" }}
                                >
                                    Yes, I Want the $497 Option
                                </Button>
                            </Link>

                            <button
                                onClick={() => setShowExitIntent(false)}
                                className="text-gray-400 text-sm mt-4 hover:underline"
                            >
                                No thanks, I'll pass on this opportunity
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CSS for confetti animation */}
            <style jsx>{`
                @keyframes confetti {
                    0% { transform: translateY(0) rotate(0deg); opacity: 1; }
                    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
                }
                .animate-confetti {
                    animation: confetti linear forwards;
                }
            `}</style>
        </div>
    );
}

export default ScholarshipOfferPage;
