"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Award, CheckCircle2, ArrowRight,
    GraduationCap, Users, Star, Clock,
    BookOpen, MessageCircle, Loader2, Shield,
    Globe, ChevronDown, ChevronUp, Zap, ArrowDown,
    DollarSign, Heart, Sparkles, X, Stethoscope
} from "lucide-react";
import { PIXEL_CONFIG } from "@/components/tracking/meta-pixel";
import { useMetaTracking } from "@/hooks/useMetaTracking";
import MetaPixel from "@/components/tracking/meta-pixel";
import { FloatingChatWidget } from "@/components/lead-portal/floating-chat-widget";
import { MultiStepQualificationForm, QualificationData } from "@/components/lead-portal/multi-step-qualification-form";

// Same default password as backend
const LEAD_PASSWORD = "coach2026";

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

function HealthcareWorkersMiniDiplomaContent() {
    const searchParams = useSearchParams();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const { trackViewContent, trackLead } = useMetaTracking();

    // Countdown timer - 48 hours from now
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

    useEffect(() => {
        trackViewContent(
            "Functional Medicine Mini Diploma - Healthcare Workers",
            "fm-mini-diploma-healthcare",
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

            const response = await fetch("/api/mini-diploma/optin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    lifeStage: formData.timeCommitment || formData.lifeStage,
                    motivation: formData.motivation,
                    investment: formData.incomeGoal || formData.investment,
                    investmentLevel: formData.investmentLevel,
                    readiness: formData.readiness,
                    course: "fm-healthcare",
                    segment: "healthcare-workers",
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            trackLead(
                "Functional Medicine Mini Diploma - Healthcare Workers",
                formData.email,
                formData.firstName,
                PIXEL_CONFIG.FUNCTIONAL_MEDICINE
            );

            // Track optin event for funnel analytics
            fetch("/api/track/mini-diploma", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    event: "optin_completed",
                    properties: {
                        qualification_answer: formData.motivation,
                        life_stage: formData.timeCommitment || formData.lifeStage,
                        income_goal: formData.incomeGoal || formData.investment,
                        utm_source: searchParams.get("utm_source"),
                        utm_medium: searchParams.get("utm_medium"),
                        utm_campaign: searchParams.get("utm_campaign"),
                        segment: "healthcare-workers",
                        device: typeof window !== "undefined" && window.innerWidth < 768 ? "mobile" : "desktop"
                    }
                })
            }).catch(console.error);

            sessionStorage.setItem("miniDiplomaUser", JSON.stringify({
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.toLowerCase().trim(),
            }));

            await signIn("credentials", {
                email: formData.email.toLowerCase(),
                password: LEAD_PASSWORD,
                redirect: false,
                callbackUrl: "/functional-medicine-diploma/qualification",
            });

            // Redirect to qualification interstitial with name for personalization
            window.location.href = `/functional-medicine-diploma/qualification?name=${encodeURIComponent(formData.firstName.trim())}`;

        } catch (err: any) {
            alert(err.message || "Failed to register. Please try again.");
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

            {/* URGENCY BAR with COUNTDOWN */}
            <div style={{ background: BRAND.goldMetallic }} className="py-2.5 px-4 text-center">
                <p className="text-sm font-bold flex items-center justify-center gap-2 flex-wrap" style={{ color: BRAND.burgundyDark }}>
                    ⚡ FREE ACCESS EXPIRES IN:
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-600 text-white text-xs font-mono">
                        {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    • 312 nurses enrolled today
                </p>
            </div>

            {/* HERO SECTION */}
            <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24" style={{ backgroundColor: BRAND.burgundyDark }}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, ${BRAND.gold} 1px, transparent 0)`,
                        backgroundSize: '48px 48px'
                    }} />
                </div>

                {/* Gold Glow */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20" style={{ backgroundColor: BRAND.gold }} />

                <div className="relative max-w-6xl mx-auto px-4">
                    <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-12 items-start">
                        {/* Left Column - Copy */}
                        <div className="text-white">
                            {/* Healthcare Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
                                <Stethoscope className="w-4 h-4" style={{ color: BRAND.gold }} />
                                <span className="text-sm font-medium" style={{ color: BRAND.gold }}>1-Hour Certification for Healthcare Pros</span>
                            </div>

                            <h1 className="text-3xl md:text-5xl lg:text-[3.5rem] font-black leading-[1.1] mb-6">
                                <span style={{ color: BRAND.goldLight }}>RNs: Start Earning</span><br />
                                <span className="text-white">$4K-$8K/Month</span><br />
                                <span className="text-white/80 text-2xl md:text-3xl lg:text-4xl">From Home. No More 12-Hour Shifts.</span>
                            </h1>

                            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg leading-relaxed">
                                Get <strong className="text-white">certified in 1 hour</strong>. Your clinical skills are worth more than hospital wages.
                                Discover how 312 nurses this week turned their healthcare background into a flexible, high-paying coaching career.
                            </p>

                            {/* Proof Points - Optimized */}
                            <div className="flex flex-wrap gap-4 md:gap-6 mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${BRAND.gold}20` }}>
                                        <Clock className="w-5 h-5" style={{ color: BRAND.gold }} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">1 Hour</p>
                                        <p className="text-xs text-white/60">Start to certified</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${BRAND.gold}20` }}>
                                        <Award className="w-5 h-5" style={{ color: BRAND.gold }} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">Certificate</p>
                                        <p className="text-xs text-white/60">Same-day credential</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${BRAND.gold}20` }}>
                                        <DollarSign className="w-5 h-5" style={{ color: BRAND.gold }} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">$4K-$8K/mo</p>
                                        <p className="text-xs text-white/60">Avg. graduate income</p>
                                    </div>
                                </div>
                            </div>

                            {/* Testimonial Avatar Circle - Social Proof - Mobile Optimized */}
                            <div className="flex flex-wrap items-center gap-3 mb-8">
                                <div className="flex -space-x-2 flex-shrink-0">
                                    {[
                                        "/zombie-avatars/user_47_backyard_bbq_1767801467.png",
                                        "/zombie-avatars/user_52_bedroom_morning_1767801467.png",
                                        "/zombie-avatars/user_44_bathroom_mirror_1767801533.png",
                                        "/zombie-avatars/user_55_cooking_class_1767801442.png",
                                        "/zombie-avatars/user_41_coffee_shop_working_1768611487.png",
                                    ].map((src, i) => (
                                        <Image
                                            key={i}
                                            src={src}
                                            alt={`Graduate ${i + 1}`}
                                            width={36}
                                            height={36}
                                            className="rounded-full border-2 border-white object-cover w-9 h-9"
                                        />
                                    ))}
                                    <div className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ backgroundColor: BRAND.gold, color: BRAND.burgundyDark }}>
                                        +4K
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-white text-sm font-semibold">4,247 healthcare pros certified</p>
                                    <p className="text-white/60 text-xs">Join them today — it's free</p>
                                </div>
                            </div>

                            {/* Mobile CTA */}
                            <Button
                                onClick={scrollToForm}
                                className="lg:hidden w-full h-14 text-lg font-bold text-white mb-6"
                                style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                            >
                                Get Certified Free — 1 Hour
                                <ArrowDown className="ml-2 w-5 h-5" />
                            </Button>
                        </div>

                        {/* Right Column - Form */}
                        <div id="lead-form" className="relative z-10">
                            <MultiStepQualificationForm
                                onSubmit={handleSubmit}
                                isSubmitting={isSubmitting}
                                isVerifying={isVerifying}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* MEET SARAH - TRUST SECTION */}
            <section className="py-16 md:py-20" style={{ backgroundColor: '#fff' }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid lg:grid-cols-[300px_1fr] gap-10 items-start">
                        {/* Sarah Photo - Small Testimonial Circle Style */}
                        <div className="flex items-start gap-4 lg:block">
                            <div className="relative inline-block flex-shrink-0">
                                <Image
                                    src="/coach-sarah.webp"
                                    alt="Sarah Mitchell, Your Functional Medicine Coach"
                                    width={80}
                                    height={80}
                                    className="rounded-full shadow-lg w-16 h-16 md:w-20 md:h-20 object-cover border-3"
                                    style={{ borderColor: BRAND.gold }}
                                />
                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full shadow-lg p-1 border border-gray-100">
                                    <Shield className="w-3 h-3" style={{ color: BRAND.burgundy }} />
                                </div>
                            </div>
                        </div>

                        {/* Sarah Story */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4" style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}>
                                <Heart className="w-3 h-3" />
                                FROM SARAH, YOUR COACH
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
                                "I Spent 15 Years Watching Women Leave<br />
                                <span style={{ color: BRAND.burgundy }}>Sicker Than When They Came In."</span>
                            </h2>
                            <div className="space-y-4 text-gray-600 leading-relaxed">
                                <p>
                                    I'm Sarah Mitchell. 20+ years in functional medicine. Certified Integrative Health Practitioner.
                                    Former clinical director who walked away from a six-figure salary because I couldn't watch
                                    one more woman get handed a prescription instead of answers.
                                </p>
                                <p>
                                    <strong className="text-gray-900">The woman who finally broke me?</strong> She was 43, exhausted,
                                    gaining weight despite eating almost nothing, told it was "just stress." I watched her spiral
                                    for 2 years before I found functional medicine and got her better in 8 weeks.
                                </p>
                                <p>
                                    Now I train practitioners who actually help people heal. <strong className="text-gray-900">2,400+ women</strong> have
                                    gone through this program. Many were just like you — burned out healthcare pros who knew there had to be a better way.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-4 mt-6">
                                <div className="flex items-center gap-2">
                                    <Award className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                                    <span className="text-sm font-medium text-gray-700">20+ Years Experience</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                                    <span className="text-sm font-medium text-gray-700">2,400+ Graduates</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                                    <span className="text-sm font-medium text-gray-700">4.9★ Student Rating</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* HEALTHCARE WORKERS SUCCESS STORIES - WITH PHOTOS */}
            <section className="py-16 md:py-20" style={{ backgroundColor: "#faf5eb" }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-4">
                        <p className="font-bold text-sm uppercase tracking-wide mb-3" style={{ color: BRAND.burgundy }}>Join 4,247 Healthcare Professionals Who Made The Switch</p>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                            They Left the Hospital Floor.<br />
                            <span style={{ color: BRAND.burgundy }}>Now They Heal on Their Terms.</span>
                        </h2>
                    </div>

                    {/* Social Proof Counter */}
                    <div className="flex justify-center gap-6 mb-10">
                        <div className="text-center">
                            <p className="text-3xl font-black" style={{ color: BRAND.burgundy }}>4,247</p>
                            <p className="text-xs text-gray-500">Certified Practitioners</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-black" style={{ color: BRAND.burgundy }}>312</p>
                            <p className="text-xs text-gray-500">Enrolled This Week</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-black" style={{ color: BRAND.burgundy }}>89%</p>
                            <p className="text-xs text-gray-500">Finish Same Day</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { name: "Jennifer M., RN", age: "47", income: "$5,800/mo", before: "ICU Nurse, 18 years", story: "I loved my patients but hated the system. 12-hour shifts, mandatory overtime, watching people get sicker on meds. Now I help clients actually get well — from my home office.", avatar: "/zombie-avatars/user_47_backyard_bbq_1767801467.png" },
                            { name: "Patricia L., PT", age: "52", income: "$7,200/mo", before: "Physical Therapist, 24 years", story: "Insurance dictated my care plans. 15-minute appointments. I knew there was a better way. Now I spend an hour with clients and see real transformation.", avatar: "/zombie-avatars/user_52_bedroom_morning_1767801467.png" },
                            { name: "Michelle R., MA", age: "44", income: "$4,100/mo", before: "Medical Assistant", story: "I was exhausted running between exam rooms. The doctors had no time. Patients left confused. Now I give them what the system never could — attention and answers.", avatar: "/zombie-avatars/user_44_bathroom_mirror_1767801533.png" }
                        ].map((story, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <Image
                                        src={story.avatar}
                                        alt={story.name}
                                        width={56}
                                        height={56}
                                        className="rounded-full object-cover w-14 h-14"
                                    />
                                    <div>
                                        <p className="font-bold text-gray-900">{story.name}, {story.age}</p>
                                        <p className="text-xs text-gray-500">{story.before}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm mb-4 italic">"{story.story}"</p>
                                <div className="rounded-xl px-4 py-3 text-center" style={{ background: BRAND.goldMetallic }}>
                                    <p className="text-2xl font-black" style={{ color: BRAND.burgundyDark }}>{story.income}</p>
                                    <p className="text-xs" style={{ color: BRAND.burgundyDark }}>Monthly Income</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* GUARANTEE SECTION */}
            <section className="py-12" style={{ backgroundColor: '#e8f5e9' }}>
                <div className="max-w-3xl mx-auto px-4">
                    <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-green-300">
                        <div className="flex items-start gap-4">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#22c55e20' }}>
                                <Shield className="w-8 h-8 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900 mb-2">🛡️ The "This Actually Works" Guarantee</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Complete all 9 lessons. If you don't feel 100% confident you understand how to start your practice,
                                    email me personally. I'll either coach you until you do — or refund every penny of any future
                                    purchase you make. <strong>No questions, no guilt, no fine print.</strong>
                                </p>
                                <p className="text-sm text-gray-500 mt-3 italic">— Sarah Mitchell, Your Coach</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* YOUR PATH: FUNCTIONAL MEDICINE PRACTITIONER */}
            <section className="py-12 md:py-16 bg-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="rounded-2xl overflow-hidden border-2" style={{ borderColor: BRAND.gold }}>
                        <div className="grid md:grid-cols-2">
                            {/* Left: Career Path */}
                            <div className="p-8" style={{ backgroundColor: BRAND.burgundyDark }}>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}>
                                    <Sparkles className="w-3 h-3" />
                                    YOUR NEW CAREER PATH
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black text-white mb-4">
                                    Become a<br />
                                    <span style={{ color: BRAND.gold }}>Functional Medicine Practitioner</span>
                                </h3>
                                <p className="text-white/70 mb-6">
                                    Help clients find the root cause of their health issues. Work from home. Set your own hours. Earn what you're worth.
                                </p>
                                <div className="space-y-3">
                                    {[
                                        "Work with clients 1-on-1 (virtual or in-person)",
                                        "Help people actually heal (not just manage symptoms)",
                                        "Be your own boss with flexible hours",
                                        "Use your clinical skills in a new way"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 text-white/90">
                                            <CheckCircle2 className="w-4 h-4 flex-shrink-0" style={{ color: BRAND.gold }} />
                                            <span className="text-sm">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Right: Income */}
                            <div className="p-8 flex flex-col justify-center" style={{ backgroundColor: "#faf5eb" }}>
                                <div className="text-center">
                                    <p className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: BRAND.burgundy }}>Average Practitioner Income</p>
                                    <div className="text-5xl md:text-6xl font-black mb-2" style={{ color: BRAND.burgundy }}>$4K-$8K</div>
                                    <p className="text-gray-500 text-sm mb-6">per month (part-time)</p>

                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <p className="text-2xl font-bold" style={{ color: BRAND.burgundy }}>$150</p>
                                            <p className="text-xs text-gray-500">per session</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold" style={{ color: BRAND.burgundy }}>10-15</p>
                                            <p className="text-xs text-gray-500">clients/month</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold" style={{ color: BRAND.burgundy }}>Flexible</p>
                                            <p className="text-xs text-gray-500">your schedule</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* YOUR CLINICAL BACKGROUND IS YOUR ADVANTAGE */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                            Your Clinical Background Is<br />
                            <span style={{ color: BRAND.burgundy }}>Your Unfair Advantage</span>
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            You already understand the body. You can read labs. You know how to assess patients.
                            You just need the <strong>functional medicine framework</strong> to put it all together.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: Stethoscope, title: "Clinical Assessment Skills", desc: "You already know how to take histories, spot red flags, and connect symptoms. That's 50% of functional medicine right there." },
                            { icon: BookOpen, title: "Medical Knowledge Base", desc: "Anatomy, physiology, pharmacology — you have the foundation. Now add root-cause thinking and watch it all click." },
                            { icon: Heart, title: "Patient Relationship Skills", desc: "You know how to build trust, explain complex things simply, and hold space for people. That's what clients pay for." }
                        ].map((item, i) => (
                            <div key={i} className="text-center p-6 rounded-2xl border border-gray-100">
                                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${BRAND.burgundy}10` }}>
                                    <item.icon className="w-7 h-7" style={{ color: BRAND.burgundy }} />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                                <p className="text-gray-600 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CERTIFICATE PREVIEW */}
            <section className="py-16 md:py-20" style={{ backgroundColor: "#faf5eb" }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-10 items-center">
                        {/* Certificate Image */}
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
                            {/* Badge */}
                            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg px-4 py-2 border border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                                    <span className="font-bold text-sm" style={{ color: BRAND.burgundy }}>ASI Verified</span>
                                </div>
                            </div>
                        </div>

                        {/* Certificate Copy */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6" style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}>
                                <Award className="w-4 h-4" />
                                ADD TO YOUR CREDENTIALS
                            </div>

                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                                Get Certified Today.<br />
                                <span style={{ color: BRAND.burgundy }}>In Just 1 Hour.</span>
                            </h2>

                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Complete all 9 lessons and receive your <strong>ASI-Verified Foundation Certificate</strong>.
                                Add it to LinkedIn today. Show employers you understand root-cause medicine.
                            </p>

                            {/* Urgency Box - 48 Hour Deadline */}
                            <div className="rounded-2xl p-5 mb-6 border-2 border-red-200" style={{ backgroundColor: "#fef2f2" }}>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-red-500">
                                        <Clock className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-red-700 mb-1">⏰ 48-Hour Completion Window</p>
                                        <p className="text-sm text-gray-600">
                                            Your access expires in <strong className="text-red-600">48 hours</strong>. Complete all 9 lessons to claim your certificate.
                                            <strong> Most finish in one sitting.</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={scrollToForm}
                                className="h-14 px-8 text-lg font-bold text-white"
                                style={{ background: BRAND.burgundyMetallic }}
                            >
                                Start My 1-Hour Certification
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* THIS IS FOR YOU - HEALTHCARE SPECIFIC */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                            This Is Perfect For You If…
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="rounded-2xl p-6 border" style={{ backgroundColor: `${BRAND.burgundy}08`, borderColor: `${BRAND.burgundy}20` }}>
                            <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: BRAND.burgundy }}>
                                <CheckCircle2 className="w-5 h-5" /> You'll Love This If:
                            </h3>
                            <ul className="space-y-3 text-gray-700">
                                {[
                                    "You're burned out from hospital/clinic work but still love healing",
                                    "You're tired of 12-hour shifts, night rotations, and mandatory overtime",
                                    "You watch patients leave with a prescription, not a solution",
                                    "You want to use your clinical skills on YOUR terms",
                                    "You dream of working from home with flexible hours"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BRAND.burgundy }} />
                                        <span className="text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                                <X className="w-5 h-5" /> Maybe Not Right Now If:
                            </h3>
                            <ul className="space-y-3 text-gray-600">
                                {[
                                    "You love your current clinical environment",
                                    "You're not open to learning a new approach",
                                    "You think conventional medicine has all the answers",
                                    "You're not willing to invest 60 minutes"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <X className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* WHAT YOU'LL LEARN */}
            <section className="py-16 md:py-20 text-white" style={{ backgroundColor: BRAND.burgundyDark }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="font-bold text-sm uppercase mb-3" style={{ color: BRAND.gold }}>Inside Your Free Mini-Diploma</p>
                        <h2 className="text-3xl md:text-4xl font-black">
                            9 Lessons That Fill The Gaps<br />
                            <span style={{ color: BRAND.gold }}>Medical School Never Covered</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            { num: 1, title: "Root Cause Medicine", desc: "Beyond symptom suppression" },
                            { num: 2, title: "The Gut Foundation", desc: "Where 80% of healing begins" },
                            { num: 3, title: "Inflammation Connection", desc: "The hidden driver of disease" },
                            { num: 4, title: "The Toxin Burden", desc: "Modern detox protocols" },
                            { num: 5, title: "Stress & Hormones", desc: "HPA axis dysfunction" },
                            { num: 6, title: "Nutrient Deficiencies", desc: "Functional testing & correction" },
                            { num: 7, title: "Lab Interpretation", desc: "Optimal vs normal ranges" },
                            { num: 8, title: "Building Protocols", desc: "Client healing plans" },
                            { num: 9, title: "Your Exit Strategy", desc: "Transition roadmap" }
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
                            Start My 1-Hour Certification
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <p className="text-white/50 text-sm mt-3">30 seconds to start • 1 hour to certified • 48-hour access</p>
                    </div>
                </div>
            </section>

            {/* VALUE STACK */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                            Everything You're Getting<br />
                            <span style={{ color: BRAND.burgundy }}>100% Free Today</span>
                        </h2>
                    </div>

                    <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
                        {[
                            { item: "9-Lesson Functional Medicine Mini-Diploma", value: "$97" },
                            { item: "ASI-Verified Certificate of Completion", value: "$47" },
                            { item: "Healthcare-to-Coaching Transition Guide", value: "$197" },
                            { item: "Scope of Practice Clarity Module", value: "$47" },
                            { item: "Private Community Access (1,200+ healthcare pros)", value: "$47" }
                        ].map((row, i) => (
                            <div key={i} className={`flex items-center justify-between p-4 ${i < 4 ? "border-b border-gray-200" : ""}`}>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                                    <span className="font-medium text-gray-800">{row.item}</span>
                                </div>
                                <span className="text-gray-400 line-through text-sm">{row.value}</span>
                            </div>
                        ))}
                        <div className="p-6 text-center text-white" style={{ background: BRAND.burgundyMetallic }}>
                            <p className="text-sm opacity-80 mb-1">Total Value: <span className="line-through">$435</span></p>
                            <p className="text-4xl font-black">FREE TODAY</p>
                            <p className="text-sm opacity-80 mt-1">For Healthcare Professionals Only</p>
                        </div>
                    </div>

                    <div className="text-center mt-8">
                        <Button
                            onClick={scrollToForm}
                            className="h-14 px-10 text-lg font-bold text-white"
                            style={{ background: BRAND.burgundyMetallic }}
                        >
                            Claim Your Free Diploma
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* FAQ - EXPANDED WITH OBJECTION HANDLING */}
            <section className="py-16 md:py-20" style={{ backgroundColor: BRAND.cream }}>
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
                        Questions From Fellow Healthcare Pros
                    </h2>

                    <div className="space-y-3">
                        {[
                            { q: "Is this legitimate? I've been burned by fake certifications before.", a: "I get it — the wellness space is full of garbage weekend certificates. ASI (AccrediPro Standards Institute) is a credentialing body specifically for functional medicine practitioners. Our curriculum was developed with practicing clinicians, and unlike most certifications, we teach you how to GET CLIENTS — not just theory. Our graduates are practicing and earning. That's the proof." },
                            { q: "Will this conflict with my nursing/medical license?", a: "No! Functional health coaching is a separate scope of practice. You're NOT diagnosing or treating disease — you're coaching clients on lifestyle, nutrition, and wellness. This is explicitly legal in all 50 states. Many RNs, PTs, and MAs do this alongside their clinical work or as a full career transition. We include a Scope of Practice Clarity Module that explains exactly where the lines are." },
                            { q: "I'm exhausted after shifts. Do I have time for this?", a: "The entire mini-diploma is 60 minutes. That's one lunch break or one evening after the kids are asleep. The lessons are 5-7 minutes each — designed for busy professionals. 89% of our students complete it the same day they start. You can pause and resume anytime within your 48-hour window." },
                            { q: "Can I really earn $4-8K/month doing this?", a: "Healthcare pros typically hit these numbers faster than career changers. Here's the math: $150/session × 3 sessions/client × 10 clients = $4,500/month. That's part-time hours. Your clinical credibility, patient rapport skills, and medical knowledge give you a major head start. Many of our graduates started while still working their clinical jobs." },
                            { q: "What if I can't finish?", a: "Work at your own pace! You have 48 hours of access, but most people finish in a single sitting (about 60 minutes). If something comes up, just pick up where you left off. The lessons save your progress automatically." },
                            { q: "What is ASI exactly? Is this accreditation real?", a: "ASI stands for AccrediPro Standards Institute — our independent credentialing body for functional medicine practitioners. While we're not affiliated with traditional medical boards (which is intentional — they focus on disease treatment, not root-cause wellness), our certification is recognized in the coaching and wellness industry. 2,400+ practitioners carry our credential and are actively practicing." },
                            { q: "What's the catch? Why is it free?", a: "Simple business model: we give you a genuinely valuable free certification so you can experience functional medicine thinking. If you love it (most healthcare pros do), you'll want to continue with our full Board Certification program. If not, you still walk away with a real credential and knowledge you can use. Win-win." },
                            { q: "Is this just another certificate that sits on my wall?", a: "Only if you let it! This Foundation Certificate is Step 1 of a proven career path. After this, you can continue to our full Board Certification (which includes client-getting training, not just clinical knowledge). We don't just teach functional medicine — we teach you how to build a practice." }
                        ].map((faq, i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
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
            <section className="py-16 md:py-20 text-white text-center" style={{ backgroundColor: BRAND.burgundyDark }}>
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-black mb-6">
                        1 Hour From Now, You Could Be<br />
                        <span style={{ color: BRAND.gold }}>Certified in Functional Medicine.</span>
                    </h2>
                    <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
                        312 nurses started this week. 89% finished the same day.
                        Your clinical skills + functional medicine = <strong className="text-white">$4K-$8K/month from home.</strong>
                    </p>
                    <Button
                        onClick={scrollToForm}
                        className="h-16 px-12 text-xl font-bold"
                        style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                    >
                        Get Certified Now — It's Free
                        <ArrowRight className="ml-2 w-6 h-6" />
                    </Button>
                    <p className="text-white/50 text-sm mt-4">⏰ 48-hour access window • Complete in 1 hour</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 text-gray-400" style={{ backgroundColor: "#2a1518" }}>
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Image src="/asi-logo.png" alt="ASI" width={44} height={44} className="rounded-lg" />
                        <span className="text-white font-bold">AccrediPro Standards Institute</span>
                    </div>
                    <p className="text-sm">
                        © {new Date().getFullYear()} AccrediPro Standards Institute. All rights reserved.
                    </p>
                </div>
            </footer>

            <FloatingChatWidget />
        </div>
    );
}

export default function HealthcareWorkersMiniDiplomaPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#4e1f24" }}>
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#d4af37" }} />
            </div>
        }>
            <HealthcareWorkersMiniDiplomaContent />
        </Suspense>
    );
}
