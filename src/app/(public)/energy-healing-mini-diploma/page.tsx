"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Award, CheckCircle2, ArrowRight,
    Users, Star, Clock,
    BookOpen, Loader2, Shield,
    ChevronDown, ChevronUp, ArrowDown,
    DollarSign, Heart, Sparkles, X, Zap
} from "lucide-react";
import { PIXEL_CONFIG } from "@/components/tracking/meta-pixel";
import { useMetaTracking } from "@/hooks/useMetaTracking";
import MetaPixel from "@/components/tracking/meta-pixel";
import { CertificatePreview } from "@/components/certificates/certificate-preview";
import { MultiStepQualificationForm, QualificationData } from "@/components/lead-portal/multi-step-qualification-form";

// Same default password as backend
const LEAD_PASSWORD = "coach2026";

// Brand Colors - Purple/Violet theme for Energy Healing
const BRAND = {
    primary: "#6b21a8",
    primaryDark: "#4c1d95",
    primaryLight: "#9333ea",
    gold: "#d4af37",
    goldLight: "#f7e7a0",
    goldDark: "#b8860b",
    cream: "#fdf8f0",
    goldMetallic: "linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)",
    primaryMetallic: "linear-gradient(135deg, #6b21a8 0%, #9333ea 25%, #6b21a8 50%, #4c1d95 75%, #6b21a8 100%)",
};

function EnergyHealingMiniDiplomaContent() {
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
            "Energy Healing Mini Diploma",
            "energy-healing-mini-diploma",
            PIXEL_CONFIG.HEALTH_COACH
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
                    course: "energy-healing",
                    segment: "general",
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            trackLead(
                "Energy Healing Mini Diploma",
                formData.email,
                formData.firstName,
                PIXEL_CONFIG.HEALTH_COACH
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
                        segment: "general",
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
                callbackUrl: "/portal/energy-healing",
            });

            // Redirect to qualification interstitial with name for personalization
            window.location.href = `/portal/energy-healing?name=${encodeURIComponent(formData.firstName.trim())}`;

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
            <MetaPixel pixelId={PIXEL_CONFIG.HEALTH_COACH} />

            {/* URGENCY BAR with COUNTDOWN */}
            <div style={{ background: BRAND.goldMetallic }} className="py-2.5 px-4 text-center">
                <p className="text-sm font-bold flex items-center justify-center gap-2 flex-wrap" style={{ color: BRAND.primaryDark }}>
                    ✨ FREE ACCESS EXPIRES IN:
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-600 text-white text-xs font-mono">
                        {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    • 203 practitioners enrolled today
                </p>
            </div>

            {/* HERO SECTION */}
            <section className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-24" style={{ backgroundColor: BRAND.primaryDark }}>
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
                            {/* Energy Healing Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
                                <Zap className="w-4 h-4" style={{ color: BRAND.gold }} />
                                <span className="text-sm font-medium" style={{ color: BRAND.gold }}>1-Hour Certification in Energy Healing</span>
                            </div>

                            <h1 className="text-3xl md:text-5xl lg:text-[3.5rem] font-black leading-[1.1] mb-6">
                                <span style={{ color: BRAND.goldLight }}>Master Energy Healing</span><br />
                                <span className="text-white">Transform Lives With Your Hands</span><br />
                                <span className="text-white/80 text-2xl md:text-3xl lg:text-4xl">Help Others Heal. Earn $3K-$6K/Month.</span>
                            </h1>

                            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg leading-relaxed">
                                Get <strong className="text-white">certified in 1 hour</strong>. Learn to channel healing energy.
                                Join 203 practitioners this week who turned their sensitivity into a thriving practice.
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
                                        <p className="font-bold text-white">$3K-$6K/mo</p>
                                        <p className="text-xs text-white/60">Avg. practitioner income</p>
                                    </div>
                                </div>
                            </div>

                            {/* Testimonial Avatar Circle - Social Proof - Mobile Optimized */}
                            <div className="flex flex-wrap items-center gap-3 mb-8">
                                <div className="flex -space-x-2 flex-shrink-0">
                                    {[
                                        "/zombie-avatars/user_47_backyard_bbq_1767801467.webp",
                                        "/zombie-avatars/user_52_bedroom_morning_1767801467.webp",
                                        "/zombie-avatars/user_44_bathroom_mirror_1767801533.webp",
                                        "/zombie-avatars/user_55_cooking_class_1767801442.webp",
                                        "/zombie-avatars/user_41_coffee_shop_working_1768611487.webp",
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
                                    <div className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ backgroundColor: BRAND.gold, color: BRAND.primaryDark }}>
                                        +2K
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-white text-sm font-semibold">2,300+ energy healers certified</p>
                                    <p className="text-white/60 text-xs">Join them today — it's free</p>
                                </div>
                            </div>

                            {/* Mobile CTA */}
                            <Button
                                onClick={scrollToForm}
                                className="lg:hidden w-full h-14 text-lg font-bold text-white mb-6"
                                style={{ background: BRAND.goldMetallic, color: BRAND.primaryDark }}
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
                                    alt="Sarah Mitchell, Your Energy Healing Coach"
                                    width={80}
                                    height={80}
                                    className="rounded-full shadow-lg w-16 h-16 md:w-20 md:h-20 object-cover border-3"
                                    style={{ borderColor: BRAND.gold }}
                                />
                                <div className="absolute -bottom-1 -right-1 bg-white rounded-full shadow-lg p-1 border border-gray-100">
                                    <Shield className="w-3 h-3" style={{ color: BRAND.primary }} />
                                </div>
                            </div>
                        </div>

                        {/* Sarah Story */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-4" style={{ background: BRAND.goldMetallic, color: BRAND.primaryDark }}>
                                <Heart className="w-3 h-3" />
                                FROM SARAH, YOUR COACH
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-4">
                                "I Could Always Feel Energy.<br />
                                <span style={{ color: BRAND.primary }}>Now I Channel It to Heal."</span>
                            </h2>
                            <div className="space-y-4 text-gray-600 leading-relaxed">
                                <p>
                                    I'm Sarah Mitchell. For years, I felt energy in my hands — tingling, warmth, a pull toward
                                    people who were hurting. But I had no idea what to do with it. I thought I was just "weird."
                                </p>
                                <p>
                                    <strong className="text-gray-900">The moment that changed everything?</strong> I discovered energy healing
                                    has a real framework — grounding, protection, chakras, energy transfer. It's not magic; it's a practice.
                                    Within months, I was helping clients release pain, trauma, and blocks.
                                </p>
                                <p>
                                    Now I train others who feel that same pull. <strong className="text-gray-900">2,300+ practitioners</strong> have
                                    gone through this program. Many were just like you — sensitive, drawn to healing, but unsure how to start.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-4 mt-6">
                                <div className="flex items-center gap-2">
                                    <Award className="w-5 h-5" style={{ color: BRAND.primary }} />
                                    <span className="text-sm font-medium text-gray-700">15+ Years Experience</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5" style={{ color: BRAND.primary }} />
                                    <span className="text-sm font-medium text-gray-700">2,300+ Graduates</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5" style={{ color: BRAND.primary }} />
                                    <span className="text-sm font-medium text-gray-700">4.9★ Student Rating</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SUCCESS STORIES - WITH PHOTOS */}
            <section className="py-16 md:py-20" style={{ backgroundColor: "#faf5eb" }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-4">
                        <p className="font-bold text-sm uppercase tracking-wide mb-3" style={{ color: BRAND.primary }}>Join 2,300+ Practitioners Who Discovered Their Gift</p>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                            They Learned to Channel Energy.<br />
                            <span style={{ color: BRAND.primary }}>Now They Transform Lives.</span>
                        </h2>
                    </div>

                    {/* Social Proof Counter */}
                    <div className="flex justify-center gap-6 mb-10">
                        <div className="text-center">
                            <p className="text-3xl font-black" style={{ color: BRAND.primary }}>2,300+</p>
                            <p className="text-xs text-gray-500">Certified Practitioners</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-black" style={{ color: BRAND.primary }}>203</p>
                            <p className="text-xs text-gray-500">Enrolled This Week</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-black" style={{ color: BRAND.primary }}>91%</p>
                            <p className="text-xs text-gray-500">Finish Same Day</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { name: "Michelle T.", age: "42", income: "$4,500/mo", before: "Former Nurse", story: "I always felt energy but had no framework for it. This certification taught me how to channel and direct healing energy safely. Now I help clients release pain and emotional blocks.", avatar: "/zombie-avatars/user_47_backyard_bbq_1767801467.webp" },
                            { name: "Rachel K.", age: "48", income: "$5,200/mo", before: "Corporate Executive", story: "After burnout, I discovered my hands had healing power. This program gave me the structure and ethics to practice professionally. Now I run a thriving energy healing practice.", avatar: "/zombie-avatars/user_52_bedroom_morning_1767801467.webp" },
                            { name: "Susan M.", age: "35", income: "$3,800/mo", before: "Yoga Instructor", story: "I wanted to go deeper than just yoga. Energy healing was the missing piece. Now I combine both and my clients experience profound transformation.", avatar: "/zombie-avatars/user_44_bathroom_mirror_1767801533.webp" }
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
                                    <p className="text-2xl font-black" style={{ color: BRAND.primaryDark }}>{story.income}</p>
                                    <p className="text-xs" style={{ color: BRAND.primaryDark }}>Monthly Income</p>
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
                                <h3 className="text-xl font-black text-gray-900 mb-2">The "This Actually Works" Guarantee</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Complete all 3 lessons. If you don't feel 100% confident you understand energy healing fundamentals,
                                    email me personally. I'll either coach you until you do — or refund every penny of any future
                                    purchase you make. <strong>No questions, no guilt, no fine print.</strong>
                                </p>
                                <p className="text-sm text-gray-500 mt-3 italic">— Sarah Mitchell, Your Coach</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* YOUR PATH: ENERGY HEALING PRACTITIONER */}
            <section className="py-12 md:py-16 bg-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="rounded-2xl overflow-hidden border-2" style={{ borderColor: BRAND.gold }}>
                        <div className="grid md:grid-cols-2">
                            {/* Left: Career Path */}
                            <div className="p-8" style={{ backgroundColor: BRAND.primaryDark }}>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-4" style={{ background: BRAND.goldMetallic, color: BRAND.primaryDark }}>
                                    <Sparkles className="w-3 h-3" />
                                    YOUR NEW CAREER PATH
                                </div>
                                <h3 className="text-2xl md:text-3xl font-black text-white mb-4">
                                    Become a<br />
                                    <span style={{ color: BRAND.gold }}>Certified Energy Healing Practitioner</span>
                                </h3>
                                <p className="text-white/70 mb-6">
                                    Channel healing energy to help clients release pain, trauma, and blocks. Work from home. Set your own hours. Create profound transformation.
                                </p>
                                <div className="space-y-3">
                                    {[
                                        "Work with clients 1-on-1 (virtual or in-person)",
                                        "Help people release pain, stress, and emotional blocks",
                                        "Practice distance healing from anywhere",
                                        "Be your own boss with flexible hours"
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
                                    <p className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: BRAND.primary }}>Average Practitioner Income</p>
                                    <div className="text-5xl md:text-6xl font-black mb-2" style={{ color: BRAND.primary }}>$3K-$6K</div>
                                    <p className="text-gray-500 text-sm mb-6">per month (part-time)</p>

                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <p className="text-2xl font-bold" style={{ color: BRAND.primary }}>$125</p>
                                            <p className="text-xs text-gray-500">per session</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold" style={{ color: BRAND.primary }}>8-12</p>
                                            <p className="text-xs text-gray-500">clients/month</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold" style={{ color: BRAND.primary }}>Flexible</p>
                                            <p className="text-xs text-gray-500">your schedule</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* YOUR SENSITIVITY IS YOUR SUPERPOWER */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                            Your Sensitivity Is<br />
                            <span style={{ color: BRAND.primary }}>Your Superpower</span>
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            You already feel energy in your hands. You sense when something's "off" with people.
                            You just need the <strong>framework and techniques</strong> to channel it for healing.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: Zap, title: "Energy Sensitivity", desc: "You feel tingling, warmth, or pull in your hands. That's the foundation of all energy healing work." },
                            { icon: BookOpen, title: "Desire to Help", desc: "You're drawn to people who are hurting. That calling is what drives a successful practice." },
                            { icon: Heart, title: "Natural Intuition", desc: "You sense what others need. That's what clients pay for — someone who truly understands them." }
                        ].map((item, i) => (
                            <div key={i} className="text-center p-6 rounded-2xl border border-gray-100">
                                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: `${BRAND.primary}10` }}>
                                    <item.icon className="w-7 h-7" style={{ color: BRAND.primary }} />
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
                        {/* Certificate Preview */}
                        <div className="relative">
                            <div className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl" style={{ backgroundColor: BRAND.gold }} />
                            <div className="relative transform hover:scale-[1.02] transition-transform">
                                <CertificatePreview
                                    diplomaTitle="Energy Healing"
                                    primaryColor={BRAND.primary}
                                />
                            </div>
                            {/* Badge */}
                            <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-lg px-4 py-2 border border-gray-100">
                                <div className="flex items-center gap-2">
                                    <Shield className="w-5 h-5" style={{ color: BRAND.primary }} />
                                    <span className="font-bold text-sm" style={{ color: BRAND.primary }}>ASI Verified</span>
                                </div>
                            </div>
                        </div>

                        {/* Certificate Copy */}
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6" style={{ background: BRAND.goldMetallic, color: BRAND.primaryDark }}>
                                <Award className="w-4 h-4" />
                                VALIDATE YOUR GIFT
                            </div>

                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                                Get Certified Today.<br />
                                <span style={{ color: BRAND.primary }}>In Just 1 Hour.</span>
                            </h2>

                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Complete all 3 lessons and receive your <strong>ASI-Verified Foundation Certificate</strong>.
                                Add it to LinkedIn today. Show the world you're a trained energy healing practitioner.
                            </p>

                            {/* Urgency Box - 48 Hour Deadline */}
                            <div className="rounded-2xl p-5 mb-6 border-2 border-red-200" style={{ backgroundColor: "#fef2f2" }}>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-red-500">
                                        <Clock className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-red-700 mb-1">48-Hour Completion Window</p>
                                        <p className="text-sm text-gray-600">
                                            Your access expires in <strong className="text-red-600">48 hours</strong>. Complete all 3 lessons to claim your certificate.
                                            <strong> Most finish in one sitting.</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={scrollToForm}
                                className="h-14 px-8 text-lg font-bold text-white"
                                style={{ background: BRAND.primaryMetallic }}
                            >
                                Start My 1-Hour Certification
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* THIS IS FOR YOU */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                            This Is Perfect For You If...
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="rounded-2xl p-6 border" style={{ backgroundColor: `${BRAND.primary}08`, borderColor: `${BRAND.primary}20` }}>
                            <h3 className="font-bold mb-4 flex items-center gap-2" style={{ color: BRAND.primary }}>
                                <CheckCircle2 className="w-5 h-5" /> You'll Love This If:
                            </h3>
                            <ul className="space-y-3 text-gray-700">
                                {[
                                    "You feel energy in your hands — tingling, warmth, or pulling",
                                    "You're drawn to help others heal and release pain",
                                    "You want to learn hands-on and distance healing techniques",
                                    "You're ready to turn your gift into a meaningful practice",
                                    "You believe in the power of energy and intention"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BRAND.primary }} />
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
                                    "You're skeptical about energy and healing",
                                    "You're not open to working with unseen forces",
                                    "You're looking for instant results without practice",
                                    "You're not willing to invest 60 minutes in yourself"
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
            <section className="py-16 md:py-20 text-white" style={{ backgroundColor: BRAND.primaryDark }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="font-bold text-sm uppercase mb-3" style={{ color: BRAND.gold }}>Inside Your Free Mini-Diploma</p>
                        <h2 className="text-3xl md:text-4xl font-black">
                            3 Lessons That Transform Your<br />
                            <span style={{ color: BRAND.gold }}>Gift Into a Practice</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            { num: 1, title: "Foundations of Energy Healing", desc: "The principles that guide all energy work" },
                            { num: 2, title: "The Human Energy Field", desc: "Understanding auras and energy anatomy" },
                            { num: 3, title: "Chakra Systems & Energy Centers", desc: "The 7 main chakras and their functions" },
                            { num: 4, title: "Grounding & Protection", desc: "Essential techniques for safe practice" },
                            { num: 5, title: "Energy Assessment & Scanning", desc: "How to sense and read energy fields" },
                            { num: 6, title: "Hands-On Healing Methods", desc: "Practical techniques for sessions" },
                            { num: 7, title: "Distance Healing Practices", desc: "Healing across time and space" },
                            { num: 8, title: "Ethics & Client Boundaries", desc: "Professional standards and safety" },
                            { num: 9, title: "Your Next Step", desc: "Your path to full certification" }
                        ].map((lesson) => (
                            <div key={lesson.num} className="rounded-xl p-4 border" style={{ backgroundColor: `${BRAND.primary}80`, borderColor: `${BRAND.gold}30` }}>
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
                            style={{ background: BRAND.goldMetallic, color: BRAND.primaryDark }}
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
                            <span style={{ color: BRAND.primary }}>100% Free Today</span>
                        </h2>
                    </div>

                    <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
                        {[
                            { item: "3-Lesson Energy Healing Mini-Diploma", value: "$97" },
                            { item: "ASI-Verified Certificate of Completion", value: "$47" },
                            { item: "Chakra Balancing Quick Guide", value: "$197" },
                            { item: "Grounding & Protection Module", value: "$47" },
                            { item: "Private Community Access (2,300+ practitioners)", value: "$47" }
                        ].map((row, i) => (
                            <div key={i} className={`flex items-center justify-between p-4 ${i < 4 ? "border-b border-gray-200" : ""}`}>
                                <div className="flex items-center gap-3">
                                    <CheckCircle2 className="w-5 h-5" style={{ color: BRAND.primary }} />
                                    <span className="font-medium text-gray-800">{row.item}</span>
                                </div>
                                <span className="text-gray-400 line-through text-sm">{row.value}</span>
                            </div>
                        ))}
                        <div className="p-6 text-center text-white" style={{ background: BRAND.primaryMetallic }}>
                            <p className="text-sm opacity-80 mb-1">Total Value: <span className="line-through">$435</span></p>
                            <p className="text-4xl font-black">FREE TODAY</p>
                            <p className="text-sm opacity-80 mt-1">For Those Called to Heal</p>
                        </div>
                    </div>

                    <div className="text-center mt-8">
                        <Button
                            onClick={scrollToForm}
                            className="h-14 px-10 text-lg font-bold text-white"
                            style={{ background: BRAND.primaryMetallic }}
                        >
                            Claim Your Free Diploma
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section className="py-16 md:py-20" style={{ backgroundColor: BRAND.cream }}>
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
                        Common Questions
                    </h2>

                    <div className="space-y-3">
                        {[
                            { q: "Is energy healing legitimate? Can I really make money doing this?", a: "Absolutely. The wellness industry is worth over $4 trillion globally, and energy healing is one of the fastest-growing modalities. Our graduates earn $3K-$6K/month part-time by helping clients with pain, stress, and emotional blocks. People are seeking alternative approaches — and they're willing to pay for skilled practitioners." },
                            { q: "Do I need to have special gifts or abilities?", a: "If you feel energy in your hands or are drawn to healing, you have what it takes. Energy healing isn't about having superpowers — it's about learning techniques to channel and direct energy. The sensitivity you already have is the foundation; the techniques can be learned." },
                            { q: "How is this different from Reiki?", a: "This program covers broad energy healing principles that apply across many modalities, including Reiki-style techniques. You'll learn grounding, protection, chakra work, scanning, and both hands-on and distance healing. It's a comprehensive foundation that works with or without prior Reiki training." },
                            { q: "Can I really learn this in 1 hour?", a: "This mini-diploma gives you the foundation — the core principles, ethics, and techniques to get started. It's not the end of your journey, it's the beginning. Most students complete it in one sitting and feel ready to start practicing immediately." },
                            { q: "What's the catch? Why is it free?", a: "Simple: we give you a genuinely valuable free certification so you can experience energy healing training. If you love it (most do), you'll want to continue with our full Board Certification program. If not, you still walk away with a real credential and practical knowledge. Win-win." },
                            { q: "Is this certification recognized?", a: "ASI (AccrediPro Standards Institute) is our credentialing body for wellness practitioners. While energy healing isn't regulated like medicine, our certification demonstrates you've been trained in ethical, effective methods. 2,300+ practitioners carry our credential." },
                            { q: "Can I do energy healing remotely/from a distance?", a: "Yes! Distance healing is covered in Lesson 7. Many of our practitioners work with clients around the world via video calls. Energy isn't limited by physical proximity — you'll learn exactly how to facilitate remote sessions." }
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
            <section className="py-16 md:py-20 text-white text-center" style={{ backgroundColor: BRAND.primaryDark }}>
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-black mb-6">
                        1 Hour From Now, You Could Be<br />
                        <span style={{ color: BRAND.gold }}>A Certified Energy Healing Practitioner.</span>
                    </h2>
                    <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
                        203 practitioners started this week. 91% finished the same day.
                        Your gift + this certification = <strong className="text-white">$3K-$6K/month helping others heal.</strong>
                    </p>
                    <Button
                        onClick={scrollToForm}
                        className="h-16 px-12 text-xl font-bold"
                        style={{ background: BRAND.goldMetallic, color: BRAND.primaryDark }}
                    >
                        Get Certified Now — It's Free
                        <ArrowRight className="ml-2 w-6 h-6" />
                    </Button>
                    <p className="text-white/50 text-sm mt-4">✨ 48-hour access window • Complete in 1 hour</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 text-gray-400" style={{ backgroundColor: "#1e1033" }}>
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

            {/* Chat widget removed for mini diploma */}
        </div>
    );
}

export default function EnergyHealingMiniDiplomaPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#4c1d95" }}>
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#d4af37" }} />
            </div>
        }>
            <EnergyHealingMiniDiplomaContent />
        </Suspense>
    );
}
