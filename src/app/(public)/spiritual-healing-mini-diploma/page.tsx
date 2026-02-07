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
import { SarahApplicationForm, SarahApplicationData } from "@/components/lead-portal/sarah-application-form";
import { CertificatePreview } from "@/components/certificates/certificate-preview";

// Same default password as backend
const LEAD_PASSWORD = "coach2026";

// Brand Colors
const BRAND = {
    burgundy: "#6b21a8",     // purple-900 (was burgundy)
    burgundyDark: "#4c1d95",  // purple-950
    burgundyLight: "#9333ea", // purple-600
    gold: "#d4af37",
    goldLight: "#f7e7a0",
    goldDark: "#b8860b",
    cream: "#fdf8f0",
    goldMetallic: "linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)",
    burgundyMetallic: "linear-gradient(135deg, #6b21a8 0%, #9333ea 25%, #6b21a8 50%, #4c1d95 75%, #6b21a8 100%)",
};

function SpiritualHealingMiniDiplomaContent() {
    const searchParams = useSearchParams();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const [acceptedFirstName, setAcceptedFirstName] = useState<string>("");
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
            "Spiritual Healing Mini Diploma",
            "sh-mini-diploma",
            PIXEL_CONFIG.FUNCTIONAL_MEDICINE
        );
    }, [trackViewContent]);

    const handleSubmit = async (formData: SarahApplicationData) => {
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

            // Calculate lead quality score based on answers
            let leadScore = 0;
            if (formData.background === "healthcare") leadScore += 30;
            else if (formData.background === "wellness") leadScore += 25;
            else if (formData.background === "educator") leadScore += 20;
            if (formData.readiness === "ready") leadScore += 25;
            else if (formData.readiness === "need-time") leadScore += 15;
            if (formData.timeAvailable === "priority" || formData.timeAvailable === "part-time") leadScore += 15;
            if (formData.investmentRange === "5k-plus") leadScore += 20;
            else if (formData.investmentRange === "3k-5k") leadScore += 15;

            const response = await fetch("/api/mini-diploma/optin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    phone: formData.phone,
                    // Qualification data (8-question form)
                    background: formData.background,
                    motivation: formData.motivation,
                    workCost: formData.workCost,
                    holdingBack: formData.holdingBack,
                    successGoal: formData.successGoal,
                    timeCommitment: formData.timeAvailable,
                    investmentRange: formData.investmentRange,
                    readiness: formData.readiness,
                    leadScore: leadScore,
                    course: "spiritual-healing",
                    segment: "spiritual-healers",
                    formVariant: searchParams.get("v") || "B", // A=16q, B=8q
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            trackLead(
                "Spiritual Healing Mini Diploma",
                formData.email,
                formData.firstName,
                PIXEL_CONFIG.FUNCTIONAL_MEDICINE
            );

            // Track optin event with rich qualification data
            fetch("/api/track/mini-diploma", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    event: "optin_completed",
                    properties: {
                        background: formData.background,
                        motivation: formData.motivation,
                        work_cost: formData.workCost,
                        time_available: formData.timeAvailable,
                        investment_range: formData.investmentRange,
                        readiness: formData.readiness,
                        lead_score: leadScore,
                        utm_source: searchParams.get("utm_source"),
                        utm_medium: searchParams.get("utm_medium"),
                        utm_campaign: searchParams.get("utm_campaign"),
                        segment: "spiritual-healers",
                        form_variant: "B", // 8-question form
                        device: typeof window !== "undefined" && window.innerWidth < 768 ? "mobile" : "desktop"
                    }
                })
            }).catch(console.error);

            sessionStorage.setItem("miniDiplomaUser", JSON.stringify({
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.toLowerCase().trim(),
            }));

            // Sign in the user
            await signIn("credentials", {
                email: formData.email.toLowerCase(),
                password: LEAD_PASSWORD,
                redirect: false,
                callbackUrl: "/portal/spiritual-healing",
            });

            // Redirect to portal (which shows reviewing/accepted animation)
            window.location.href = `/portal/spiritual-healing?name=${encodeURIComponent(formData.firstName.trim())}`;

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
                    • 37 women enrolled today
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
                            {/* Badge + Level */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-6">
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
                                    <Sparkles className="w-4 h-4" style={{ color: BRAND.gold }} />
                                    <span className="text-sm font-medium" style={{ color: BRAND.gold }}>1-Hour Mini Diploma for Spiritual Healers</span>
                                </div>
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                                    <Shield className="w-3.5 h-3.5" style={{ color: BRAND.gold }} />
                                    <span className="text-xs font-medium" style={{ color: BRAND.goldLight }}>ASI Level 0 – Foundations</span>
                                </div>
                            </div>

                            <h1 className="text-3xl md:text-5xl lg:text-[3.5rem] font-black leading-[1.1] mb-2">
                                <span className="text-white">Spiritual Healing</span><br />
                                <span style={{ color: BRAND.goldLight }}>Mini Diploma</span>
                            </h1>
                            <p className="text-lg md:text-xl font-medium mb-4" style={{ color: BRAND.gold }}>
                                Level 0 – Foundations
                            </p>
                            <p className="text-xs text-white/50 mb-6 uppercase tracking-wider">
                                Aligned with the competency framework of AccrediPro International Standards Institute
                            </p>

                            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg leading-relaxed">
                                <strong className="text-white">Women:</strong> Get certified in 1 hour. Start earning <strong className="text-white">$4K-$8K/month</strong> from home.
                                Your gift for healing is worth more than a 9-to-5. Stop waiting for permission.
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
                            <div className="flex flex-wrap items-center gap-3 mb-4">
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
                                    <div className="w-9 h-9 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold flex-shrink-0" style={{ backgroundColor: BRAND.gold, color: BRAND.burgundyDark }}>
                                        +4K
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-white text-sm font-semibold">2,400+ spiritual healers certified</p>
                                    <p className="text-white/60 text-xs">Join them today — it's free</p>
                                </div>
                            </div>

                            {/* Trustpilot-Style Review Widget */}
                            <div className="flex items-center gap-3 mb-8 px-4 py-3 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                                <div className="flex items-center gap-0.5">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <Star key={i} className="w-4 h-4 fill-current" style={{ color: '#00b67a' }} />
                                    ))}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-white font-bold text-sm">4.9/5</span>
                                    <span className="text-white/60 text-xs">•</span>
                                    <span className="text-white/80 text-xs">1,157+ reviews</span>
                                </div>
                                <div className="ml-auto flex items-center gap-1.5">
                                    <span className="text-[10px] text-white/50 uppercase tracking-wide">Verified by</span>
                                    <span className="text-xs font-bold" style={{ color: '#00b67a' }}>★ Trustpilot</span>
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

                        {/* Right Column - CTA Box (Form is below) */}
                        <div className="hidden lg:block relative z-10">
                            <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: `1px solid ${BRAND.gold}40` }}>
                                <div className="mb-6">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4" style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}>
                                        <Sparkles className="w-4 h-4" />
                                        Free 1-Hour Certification
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-2">Start Earning as a Coach</h3>
                                    <p className="text-white/70">Take our quick qualification quiz to see if you're a fit</p>
                                </div>
                                <Button
                                    onClick={scrollToForm}
                                    className="w-full h-14 text-lg font-bold"
                                    style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                                >
                                    See If You Qualify
                                    <ArrowDown className="ml-2 w-5 h-5" />
                                </Button>
                                <p className="text-white/50 text-xs mt-4">Takes 3 minutes • No payment required</p>
                            </div>
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
                                    alt="Sarah Mitchell, Your Spiritual Healing Coach"
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
                                "I Spent 15 Years Watching Women Search<br />
                                <span style={{ color: BRAND.burgundy }}>For Answers In All The Wrong Places."</span>
                            </h2>
                            <div className="space-y-4 text-gray-600 leading-relaxed">
                                <p>
                                    I'm Sarah Mitchell. 20+ years in spiritual healing and integrative wellness. Certified Holistic Health Practitioner.
                                    Former wellness director who walked away from a six-figure salary because I couldn't watch
                                    one more woman be told her pain was "all in her head."
                                </p>
                                <p>
                                    <strong className="text-gray-900">The woman who finally broke me?</strong> She was 43, exhausted,
                                    spiritually depleted, told her anxiety was "just stress." I watched her spiral
                                    for 2 years before I found spiritual healing and helped her transform in 8 weeks.
                                </p>
                                <p>
                                    Now I train practitioners who actually help people heal. <strong className="text-gray-900">2,400+ women</strong> have
                                    gone through this program. Many were just like you — women who sensed there had to be a deeper way to help others.
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

            {/* SPIRITUAL HEALERS SUCCESS STORIES - WITH PHOTOS */}
            <section className="py-16 md:py-20" style={{ backgroundColor: "#faf5eb" }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-4">
                        <p className="font-bold text-sm uppercase tracking-wide mb-3" style={{ color: BRAND.burgundy }}>Join a Professional Learning Community Aligned with ASI Standards</p>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                            They Stopped Waiting for Permission.<br />
                            <span style={{ color: BRAND.burgundy }}>Now They Heal on Their Terms.</span>
                        </h2>
                    </div>

                    {/* Social Proof Counter */}
                    <div className="flex justify-center gap-6 mb-10">
                        <div className="text-center">
                            <p className="text-3xl font-black" style={{ color: BRAND.burgundy }}>2,400+</p>
                            <p className="text-xs text-gray-500">Certified Practitioners</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-black" style={{ color: BRAND.burgundy }}>37</p>
                            <p className="text-xs text-gray-500">Enrolled Today</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-black" style={{ color: BRAND.burgundy }}>89%</p>
                            <p className="text-xs text-gray-500">Finish Same Day</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { name: "Lisa M., Former Teacher", age: "47", income: "$5,200/mo", before: "Elementary Teacher, 20 years", story: "I always felt something was missing in education. I could see children suffering from issues no textbook could explain. Spiritual healing gave me the language and tools to finally help people at the deepest level — and now I do it full-time from home.", avatar: "/zombie-avatars/user_47_backyard_bbq_1767801467.webp" },
                            { name: "Patricia R., Yoga Instructor", age: "52", income: "$6,800/mo", before: "Yoga Instructor, 15 years", story: "Yoga opened the door, but spiritual healing walked me through it. My students kept coming to me with problems that went far beyond the physical. Now I combine both practices and my clients experience transformation they never thought possible.", avatar: "/zombie-avatars/user_52_bedroom_morning_1767801467.webp" },
                            { name: "Michelle T., Social Worker", age: "44", income: "$4,300/mo", before: "Licensed Social Worker, 12 years", story: "Years of helping others drained my own spirit. The system was broken — paperwork over people. Spiritual healing certification gave me a way to truly serve without the burnout. I've never felt more aligned with my purpose.", avatar: "/zombie-avatars/user_44_bathroom_mirror_1767801533.webp" },
                            { name: "Sandra K., Retiree", age: "55", income: "$7,100/mo", before: "Corporate Manager, Retired", story: "After my husband passed, I found healing through spiritual practice. I realized I could help other women navigate grief and loss. This certification gave me the credibility to turn my pain into purpose — and a thriving practice.", avatar: "/zombie-avatars/user_55_cooking_class_1767801442.webp" },
                            { name: "Angela C., Massage Therapist", age: "41", income: "$3,800/mo", before: "Licensed Massage Therapist", story: "I knew I was only touching the surface — literally. My clients would release emotions on the table and I had no tools to help them process it. Spiritual healing completed my skill set. Now I offer whole-person transformation.", avatar: "/zombie-avatars/user_41_coffee_shop_working_1768611487.webp" },
                            { name: "Karen W., Stay-at-Home Mom", age: "38", income: "$4,900/mo", before: "Stay-at-Home Mom, 10 years", story: "My spiritual awakening happened after my divorce. I went from feeling lost to discovering a gift I didn't know I had. This certification showed me how to turn that gift into a real career — on my schedule, around my kids.", avatar: "/zombie-avatars/user_38_single_mom_1767718497633.webp" }
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
                                    Complete all 3 lessons. If you don't feel 100% confident you understand how to start your practice,
                                    email me personally. I'll coach you until you do — <strong>no limits, no extra cost, no fine print.</strong>
                                </p>
                                <p className="text-sm text-gray-500 mt-3 italic">— Sarah Mitchell, Your Coach</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* PROFESSIONAL SCOPE & SAFETY - ASI Authority */}
            <section className="py-10" style={{ backgroundColor: '#f8fafc' }}>
                <div className="max-w-3xl mx-auto px-4">
                    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-100">
                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${BRAND.burgundy}10` }}>
                                <Shield className="w-6 h-6" style={{ color: BRAND.burgundy }} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-gray-900 mb-2">Professional Scope & Safety</h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-3">
                                    This Mini Diploma is educational in nature and designed to support licensed and non-licensed
                                    professionals within appropriate scope-of-practice boundaries.
                                </p>
                                <p className="text-gray-500 text-xs leading-relaxed">
                                    AccrediPro International Standards Institute emphasizes ethical, non-diagnostic, non-prescriptive
                                    application of spiritual healing and integrative concepts at the foundational level.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* YOUR PATH: SPIRITUAL HEALING PRACTITIONER */}
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
                                    <span style={{ color: BRAND.gold }}>Certified Spiritual Healing Practitioner</span>
                                </h3>
                                <p className="text-white/70 mb-6">
                                    Help clients find the root cause of their spiritual disconnection. Work from home. Set your own hours. Earn what you're worth.
                                </p>
                                <div className="space-y-3">
                                    {[
                                        "Work with clients 1-on-1 (virtual or in-person)",
                                        "Help people actually heal (not just manage symptoms)",
                                        "Be your own boss with flexible hours",
                                        "Use your spiritual gifts in a meaningful way"
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

            {/* YOUR SPIRITUAL GIFTS ARE YOUR UNFAIR ADVANTAGE */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                            Your Spiritual Gifts Are<br />
                            <span style={{ color: BRAND.burgundy }}>Your Unfair Advantage</span>
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            You already feel what others miss. You sense the deeper story behind someone's pain.
                            You just need the <strong>spiritual healing framework</strong> to put it all together.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: Heart, title: "Natural Empathy & Intuition", desc: "You already sense what people need before they say it. You feel energy shifts in a room. That's the foundation of spiritual healing — and you were born with it." },
                            { icon: BookOpen, title: "Life Experience & Wisdom", desc: "Every challenge you've overcome — loss, heartbreak, transformation — is your curriculum. Your lived experience gives you credibility no textbook can match." },
                            { icon: Sparkles, title: "Deep Desire to Serve", desc: "You've always known you were meant for something more. That pull toward helping others isn't random — it's your calling. Now it's time to answer it." }
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
                        {/* Certificate Preview - HTML */}
                        <div className="relative">
                            <div className="absolute -inset-4 rounded-3xl opacity-20 blur-2xl" style={{ backgroundColor: BRAND.gold }} />
                            <div className="relative transform hover:scale-[1.02] transition-transform">
                                <CertificatePreview diplomaTitle="Spiritual Healing Foundation" primaryColor={BRAND.burgundy} />
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
                                Complete all 3 foundational lessons and receive your <strong>ASI Level 0 Certificate</strong>.
                                Add it to LinkedIn today. Show clients you understand spiritual healing at a professional level.
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
                                            Your access expires in <strong className="text-red-600">48 hours</strong>. Complete all 3 lessons to claim your certificate.
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
                                Start Your Application
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* THIS IS FOR YOU - SPIRITUAL HEALING SPECIFIC */}
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
                                    "You've always felt drawn to healing others spiritually",
                                    "You're tired of feeling like your gift is going to waste",
                                    "You sense there's something deeper behind people's suffering",
                                    "You want to turn your spiritual calling into a real career",
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
                                    "You're not open to exploring spiritual healing practices",
                                    "You don't believe in energy or intuitive healing",
                                    "You're looking for a traditional medical credential",
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
                        <p className="font-bold text-xs uppercase mb-3 tracking-wide" style={{ color: BRAND.gold }}>ASI Level 0 – Foundational Competencies</p>
                        <h2 className="text-3xl md:text-4xl font-black">
                            3 Lessons That Unlock The Healing Gifts<br />
                            <span style={{ color: BRAND.gold }}>You Were Always Meant to Share</span>
                        </h2>
                        <p className="text-white/60 text-sm mt-4 max-w-xl mx-auto">
                            These lessons align with ASI Level 0 (Foundations) standards within the AccrediPro professional framework.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            { num: 1, title: "What Is Spiritual Healing?", desc: "Root-cause thinking, the 5 root causes of spiritual disconnection, and real client case studies that prove this works" },
                            { num: 2, title: "The S.A.C.R.E.D. Method™", desc: "Your signature 6-step framework for spiritual transformation: See, Attune, Clear, Reconnect, Empower & Deepen" },
                            { num: 3, title: "Getting Your First Clients", desc: "Warm market strategy, pricing your packages, and a 30-day launch plan to start earning $4K-$8K/month" }
                        ].map((lesson) => (
                            <div key={lesson.num} className="rounded-xl p-5 border" style={{ backgroundColor: `${BRAND.burgundy}80`, borderColor: `${BRAND.gold}30` }}>
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg" style={{ backgroundColor: `${BRAND.gold}30`, color: BRAND.gold }}>
                                        {lesson.num}
                                    </div>
                                    <h4 className="font-bold text-white text-lg">{lesson.title}</h4>
                                </div>
                                <p className="text-white/70 text-sm pl-13 leading-relaxed">{lesson.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-10">
                        <Button
                            onClick={scrollToForm}
                            className="h-14 px-10 text-lg font-bold"
                            style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                        >
                            Get Started Free
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <p className="text-white/50 text-sm mt-3">30 seconds to start • 1 hour to certified • 48-hour access</p>
                    </div>
                </div>
            </section>

            {/* QUALIFICATION FORM SECTION */}
            <section id="lead-form" className="py-16 md:py-20" style={{ backgroundColor: BRAND.cream }}>
                <div className="max-w-2xl mx-auto px-4">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4" style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}>
                            <Sparkles className="w-4 h-4" />
                            See If You Qualify
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-3">
                            Ready to Start Earning<br />
                            <span style={{ color: BRAND.burgundy }}>as a Spiritual Healing Practitioner?</span>
                        </h2>
                        <p className="text-gray-600 max-w-md mx-auto">
                            Answer a few quick questions so I can understand if we're a fit — takes about 3 minutes.
                        </p>
                    </div>

                    <SarahApplicationForm
                        onSubmit={handleSubmit}
                        onAccepted={() => {
                            window.location.href = `/portal/spiritual-healing?name=${encodeURIComponent(acceptedFirstName)}`;
                        }}
                        isSubmitting={isSubmitting}
                        isVerifying={isVerifying}
                        niche="spiritual-healing"
                    />
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
                            { item: "3-Lesson Spiritual Healing Mini-Diploma", value: "$97" },
                            { item: "ASI-Verified Certificate of Completion", value: "$47" },
                            { item: "Spiritual Healing Practice Startup Guide", value: "$197" },
                            { item: "Scope of Practice Clarity Module", value: "$47" },
                            { item: "Private Community Access (1,200+ spiritual healers)", value: "$47" }
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
                            <p className="text-sm opacity-80 mt-1">For Aspiring Spiritual Healers Only</p>
                        </div>
                    </div>

                    <div className="text-center mt-8">
                        <Button
                            onClick={scrollToForm}
                            className="h-14 px-10 text-lg font-bold text-white"
                            style={{ background: BRAND.burgundyMetallic }}
                        >
                            See If You Qualify
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* ASI CREDENTIALING SECTION */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold mb-6" style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}>
                            <Shield className="w-4 h-4" />
                            YOUR CERTIFICATION AUTHORITY
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                            Certified by the<br />
                            <span style={{ color: BRAND.burgundy }}>AccrediPro International Standards Institute</span>
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            ASI is the credentialing body for spiritual healing practitioners.
                            Our certification is recognized by employers, clients, and the wellness industry worldwide.
                        </p>
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200">
                        <div className="grid md:grid-cols-[200px_1fr] gap-8 items-center">
                            <div className="flex flex-col items-center">
                                <Image
                                    src="/asi-logo.png"
                                    alt="AccrediPro International Standards Institute"
                                    width={120}
                                    height={120}
                                    className="rounded-xl mb-3"
                                />
                                <p className="text-sm font-bold text-gray-900 text-center">AccrediPro<br />Standards Institute</p>
                            </div>
                            <div>
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    {[
                                        { num: "2,400+", label: "Certified Practitioners" },
                                        { num: "42", label: "Countries" },
                                        { num: "4.9/5", label: "Student Rating" }
                                    ].map((stat, i) => (
                                        <div key={i} className="text-center">
                                            <p className="text-2xl font-black" style={{ color: BRAND.burgundy }}>{stat.num}</p>
                                            <p className="text-xs text-gray-500">{stat.label}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="space-y-2">
                                    {[
                                        "Curriculum developed with practicing spiritual healing clinicians",
                                        "Certificates include unique verification ID for employer validation",
                                        "Recognized in the coaching and wellness industry worldwide"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: BRAND.burgundy }} />
                                            <span className="text-sm text-gray-700">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ - EXPANDED WITH OBJECTION HANDLING */}
            <section className="py-16 md:py-20" style={{ backgroundColor: BRAND.cream }}>
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
                        Questions From Fellow Spiritual Healers
                    </h2>

                    <div className="space-y-3">
                        {[
                            { q: "Is this legitimate? I've been burned by fake certifications before.", a: "I get it — the wellness space is full of garbage weekend certificates. ASI (AccrediPro International Standards Institute) is a credentialing body specifically for spiritual healing practitioners. Our curriculum was developed with practicing healers, and unlike most certifications, we teach you how to GET CLIENTS — not just theory. Our graduates are practicing and earning. That's the proof." },
                            { q: "Do I need any prior training or experience?", a: "No formal training is required! Many of our most successful graduates came with zero credentials — just a deep desire to help others and their own life experience. If you've ever been the person friends turn to for guidance, comfort, or support, you already have the foundation. This certification gives you the professional framework and confidence to turn that gift into a career." },
                            { q: "I'm busy with work/family. Do I have time for this?", a: "The entire mini-diploma is 60 minutes. That's one lunch break or one evening after the kids are asleep. It's just 3 focused lessons — designed for busy women. 89% of our students complete it the same day they start. You can pause and resume anytime within your 48-hour window." },
                            { q: "Can I really earn $4-8K/month doing this?", a: "Absolutely. Here's the math: $150/session x 3 sessions/client x 10 clients = $4,500/month. That's part-time hours. Your natural empathy, life experience, and spiritual intuition give you a major head start. Many of our graduates started while still working their day jobs and transitioned once they built their client base." },
                            { q: "What if I can't finish?", a: "Work at your own pace! You have 48 hours of access, but most people finish in a single sitting (about 60 minutes). If something comes up, just pick up where you left off. The lessons save your progress automatically." },
                            { q: "What is ASI exactly? Is this accreditation real?", a: "ASI stands for AccrediPro International Standards Institute — our independent credentialing body for spiritual healing practitioners. While we're not affiliated with traditional medical boards (which is intentional — they focus on disease treatment, not spiritual wellness), our certification is recognized in the coaching and wellness industry. 4,200+ practitioners carry our credential and are actively practicing." },
                            { q: "What's the catch? Why is it free?", a: "Simple business model: we give you a genuinely valuable free certification so you can experience spiritual healing thinking. If you love it (most women do), you'll want to continue with our full Board Certification program. If not, you still walk away with a real credential and knowledge you can use. Win-win." },
                            { q: "Is this just another certificate that sits on my wall?", a: "Only if you let it! This Foundation Certificate is Step 1 of a proven career path. After this, you can continue to our full Board Certification (which includes client-getting training, not just spiritual knowledge). We don't just teach spiritual healing — we teach you how to build a practice." }
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

                    <div className="text-center mt-10">
                        <Button
                            onClick={scrollToForm}
                            className="h-14 px-10 text-lg font-bold text-white"
                            style={{ background: BRAND.burgundyMetallic }}
                        >
                            Apply Now
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-16 md:py-20 text-white text-center" style={{ backgroundColor: BRAND.burgundyDark }}>
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-black mb-6">
                        1 Hour From Now, You Could Be<br />
                        <span style={{ color: BRAND.gold }}>Certified in Spiritual Healing.</span>
                    </h2>
                    <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
                        37 women enrolled today. 89% finished the same day.
                        Your spiritual gifts + this certification = <strong className="text-white">$4K-$8K/month from home.</strong>
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

            {/* Footer - Minimal for Optin */}
            <footer className="py-8 text-gray-400" style={{ backgroundColor: "#2a1518" }}>
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Image src="/asi-logo.png" alt="ASI" width={44} height={44} className="rounded-lg" />
                        <span className="text-white font-bold">AccrediPro International Standards Institute</span>
                    </div>
                    <div className="flex items-center justify-center gap-4 mb-4">
                        <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map(i => (
                                <Star key={i} className="w-3.5 h-3.5 fill-current" style={{ color: '#00b67a' }} />
                            ))}
                        </div>
                        <span className="text-sm text-gray-300">4.9/5 from 1,157+ reviews</span>
                    </div>
                    <p className="text-xs">
                        © {new Date().getFullYear()} AccrediPro International Standards Institute. All rights reserved.
                    </p>
                </div>
            </footer>

            {/* Chat widget removed for mini diploma */}
        </div>
    );
}

export default function SpiritualHealingMiniDiplomaPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#4c1d95" }}>
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#d4af37" }} />
            </div>
        }>
            <SpiritualHealingMiniDiplomaContent />
        </Suspense>
    );
}
