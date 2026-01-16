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
                    course: "functional-medicine",
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

            {/* URGENCY BAR - Healthcare Specific */}
            <div style={{ background: BRAND.goldMetallic }} className="py-2.5 px-4 text-center">
                <p className="text-sm font-bold" style={{ color: BRAND.burgundyDark }}>
                    ⚡ FREE For Healthcare Professionals (Normally $97) — 312 nurses started this week
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
                                <span className="text-sm font-medium" style={{ color: BRAND.gold }}>For RNs, MAs, Therapists & Healthcare Pros</span>
                            </div>

                            <h1 className="text-3xl md:text-5xl lg:text-[3.5rem] font-black leading-[1.1] mb-6">
                                <span style={{ color: BRAND.goldLight }}>Help Patients Heal</span><br />
                                <span className="text-white">Without the Burnout,</span><br />
                                <span className="text-white">Politics, or 12-Hour Shifts.</span>
                            </h1>

                            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg leading-relaxed">
                                You became a healthcare worker to <strong className="text-white">heal people</strong> — not to drown in paperwork, hospital politics, and exhaustion.
                                In <strong className="text-white">60 minutes</strong>, discover how your clinical background is your unfair advantage in Functional Medicine.
                            </p>

                            {/* Proof Points */}
                            <div className="flex flex-wrap gap-4 md:gap-6 mb-8">
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${BRAND.gold}20` }}>
                                        <Award className="w-5 h-5" style={{ color: BRAND.gold }} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">9 Lessons</p>
                                        <p className="text-xs text-white/60">1 hour total</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${BRAND.gold}20` }}>
                                        <GraduationCap className="w-5 h-5" style={{ color: BRAND.gold }} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">Certificate</p>
                                        <p className="text-xs text-white/60">Add to your credentials</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${BRAND.gold}20` }}>
                                        <Heart className="w-5 h-5" style={{ color: BRAND.gold }} />
                                    </div>
                                    <div>
                                        <p className="font-bold text-white">Root Cause Focus</p>
                                        <p className="text-xs text-white/60">Not symptom chasing</p>
                                    </div>
                                </div>
                            </div>

                            {/* Mobile CTA */}
                            <Button
                                onClick={scrollToForm}
                                className="lg:hidden w-full h-14 text-lg font-bold text-white mb-6"
                                style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                            >
                                Get Free Access Now
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

            {/* HEALTHCARE WORKERS SUCCESS STORIES */}
            <section className="py-16 md:py-20" style={{ backgroundColor: "#faf5eb" }}>
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <p className="font-bold text-sm uppercase tracking-wide mb-3" style={{ color: BRAND.burgundy }}>Healthcare Professionals Who Made The Switch</p>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                            They Left the Hospital Floor.<br />
                            <span style={{ color: BRAND.burgundy }}>Now They Heal on Their Terms.</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { name: "Jennifer M., RN", age: "47", income: "$5,800/mo", before: "ICU Nurse, 18 years", story: "I loved my patients but hated the system. 12-hour shifts, mandatory overtime, watching people get sicker on meds. Now I help clients actually get well — from my home office." },
                            { name: "Dr. Patricia L., PT", age: "52", income: "$7,200/mo", before: "Physical Therapist", story: "Insurance dictated my care plans. 15-minute appointments. I knew there was a better way. Now I spend an hour with clients and see real transformation." },
                            { name: "Michelle R., MA", age: "44", income: "$4,100/mo", before: "Medical Assistant", story: "I was exhausted running between exam rooms. The doctors had no time. Patients left confused. Now I give them what the system never could — attention and answers." }
                        ].map((story, i) => (
                            <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                                        <Stethoscope className="w-6 h-6" style={{ color: BRAND.burgundy }} />
                                    </div>
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
                                Stack Another Credential.<br />
                                <span style={{ color: BRAND.burgundy }}>In Just 60 Minutes.</span>
                            </h2>

                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Complete all 9 lessons and receive your <strong>ASI-Verified Foundation Certificate</strong>.
                                Add it to your LinkedIn, resume, or office wall. Show clients and employers you understand
                                root-cause medicine — not just symptom management.
                            </p>

                            {/* Urgency Box */}
                            <div className="rounded-2xl p-5 mb-6 border-2" style={{ backgroundColor: `${BRAND.burgundy}08`, borderColor: `${BRAND.burgundy}30` }}>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: BRAND.burgundyMetallic }}>
                                        <Clock className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 mb-1">⏰ Complete Between Shifts</p>
                                        <p className="text-sm text-gray-600">
                                            9 lessons, 5-7 minutes each. Do one on your lunch break. Finish the rest after your shift.
                                            <strong> Your future practice doesn't need to wait.</strong>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <Button
                                onClick={scrollToForm}
                                className="h-14 px-8 text-lg font-bold text-white"
                                style={{ background: BRAND.burgundyMetallic }}
                            >
                                Get My Free Certificate
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
                            Get Free Access Now
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Button>
                        <p className="text-white/50 text-sm mt-3">Takes 30 seconds • No credit card required</p>
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

            {/* FAQ - HEALTHCARE SPECIFIC */}
            <section className="py-16 md:py-20" style={{ backgroundColor: BRAND.cream }}>
                <div className="max-w-3xl mx-auto px-4">
                    <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-10">
                        Questions From Fellow Healthcare Pros
                    </h2>

                    <div className="space-y-3">
                        {[
                            { q: "Will this conflict with my nursing/medical license?", a: "No! Functional health coaching is a separate scope of practice. You're not diagnosing or treating disease — you're coaching clients on lifestyle, nutrition, and wellness. Many RNs, PTs, and MAs do this alongside their clinical work or as a full transition." },
                            { q: "I'm exhausted after shifts. Do I have time for this?", a: "The entire mini-diploma is 60 minutes. That's one lunch break or one evening after the kids are asleep. The lessons are 5-7 minutes each — designed for busy professionals." },
                            { q: "Can I really earn $4-8K/month doing this?", a: "Healthcare pros typically hit these numbers faster than career changers. Your clinical credibility, patient rapport skills, and medical knowledge give you a major head start. Many start part-time while still working." },
                            { q: "Is this just another certificate that sits on my wall?", a: "Only if you let it. This is your entry point into a proven career path. Our full certification program takes you from foundation to practicing coach, with business training included." },
                            { q: "What's the catch? Why is it free?", a: "Simple: we want you to experience functional medicine thinking. If you love it (most healthcare pros do), you'll want to continue with our full certification. If not, you still walk away with a legitimate credential. Win-win." }
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
                                    <div className="px-4 pb-4 text-gray-600 text-sm">
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
                        You Didn't Become a Healthcare Worker<br />
                        <span style={{ color: BRAND.gold }}>To Burn Out at 45.</span>
                    </h2>
                    <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
                        RNs, therapists, MAs — they're leaving the hospital floor every day for flexible, fulfilling work in functional medicine.
                        Your clinical skills are your golden ticket. <strong className="text-white">Use them.</strong>
                    </p>
                    <Button
                        onClick={scrollToForm}
                        className="h-16 px-12 text-xl font-bold"
                        style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                    >
                        Get My Free Diploma Now
                        <ArrowRight className="ml-2 w-6 h-6" />
                    </Button>
                    <p className="text-white/50 text-sm mt-4">⚡ Free for healthcare professionals today</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 text-gray-400" style={{ backgroundColor: "#2a1518" }}>
                <div className="max-w-5xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Image src="/logos/accredipro-logo-gold.svg" alt="AccrediPro" width={140} height={36} />
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
