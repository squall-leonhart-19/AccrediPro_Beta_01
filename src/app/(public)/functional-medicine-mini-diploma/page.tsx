"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Award, CheckCircle2, ArrowRight,
    GraduationCap, Users, Star, Clock,
    BookOpen, MessageCircle, Loader2, Shield,
    Globe, ChevronDown, ChevronUp, Zap,
} from "lucide-react";
import { PIXEL_CONFIG } from "@/components/tracking/meta-pixel";
import { useMetaTracking } from "@/hooks/useMetaTracking";
import MetaPixel from "@/components/tracking/meta-pixel";
import { FloatingChatWidget } from "@/components/lead-portal/floating-chat-widget";

// Same default password as backend
const LEAD_PASSWORD = "coach2026";

// Testimonials - Real names, specific results, no AI avatars
const TESTIMONIALS = [
    {
        name: "Jennifer M.",
        role: "Former HR Manager → Certified Functional Medicine Practitioner",
        quote: "I was skeptical about another online course. But Coach Sarah actually responds to questions, and the content is legit. I finished my full certification 2 months later and now I help clients find the root cause of their chronic issues.",
    },
    {
        name: "Dr. Rachel T.",
        role: "Chiropractor + Functional Medicine Specialist",
        quote: "As a chiropractor, I wanted to add root-cause protocols for my patients. The mini-diploma gave me the foundation, and now I offer comprehensive functional assessments. My practice revenue tripled.",
    },
    {
        name: "Diane K.",
        role: "Nurse Practitioner, Age 52",
        quote: "After 25 years in conventional medicine, I was burned out. This certification gave me the tools to actually SOLVE problems instead of just managing symptoms. My patients are finally getting better.",
    },
];

// What you'll be able to do - outcomes focused
const LEARNING_OUTCOMES = [
    "Identify root causes of chronic health issues that conventional medicine misses",
    "Understand the gut-brain-immune connection driving most modern diseases",
    "Recognize early warning signs of metabolic dysfunction before they become chronic",
    "Design personalized protocols based on functional lab interpretation",
    "Position yourself as a specialist in the $4.5 trillion wellness industry",
];

// What you get - value table
const WHAT_YOU_GET = [
    { item: "3 Expert-Led Modules", value: "Deep-dive into root-cause medicine" },
    { item: "9 Bite-Sized Lessons", value: "Watch on your phone, at your pace" },
    { item: "Coach Sarah Guidance", value: "Your personal mentor throughout" },
    { item: "ASI Mini-Diploma Certificate", value: "Download and share on LinkedIn" },
    { item: "Career Roadmap", value: "See exactly how to become Board Certified" },
];

// FAQs
const FAQS = [
    {
        question: "Is this really free?",
        answer: "Yes, 100% free. No credit card. No hidden fees.",
    },
    {
        question: "How long does it take?",
        answer: "About 60 minutes total. Self-paced — finish in one sitting or spread it out.",
    },
    {
        question: "Do I need any experience?",
        answer: "No. Most of our students start with zero medical or coaching background.",
    },
    {
        question: "Will I get a certificate?",
        answer: "Yes! Complete all 9 lessons and download your ASI Mini-Diploma certificate.",
    },
    {
        question: "What happens after the mini-diploma?",
        answer: "You'll have the option to continue with our full certification program — but there's no pressure. The mini-diploma stands on its own.",
    },
    {
        question: "Who is ASI?",
        answer: "The Accreditation Standards Institute (ASI) is a Delaware-registered certification authority. We've certified 20,000+ health and wellness practitioners worldwide.",
    },
];


const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;400;500;600;700&family=Source+Sans+3:wght@300;400;500;600&display=swap');
`;

import { MultiStepQualificationForm, QualificationData } from "@/components/lead-portal/multi-step-qualification-form";

function UniqueFunctionalMedicineMiniDiplomaContent() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const { trackViewContent, trackLead } = useMetaTracking();

    // Track ViewContent on mount
    useEffect(() => {
        // Track to Functional Medicine Pixel
        trackViewContent(
            "Functional Medicine Mini Diploma",
            "fm-mini-diploma",
            PIXEL_CONFIG.FUNCTIONAL_MEDICINE
        );
    }, [trackViewContent]);

    const handleSubmit = async (formData: QualificationData) => {
        setIsVerifying(true);

        try {
            // Step 1: Verify email with NeverBounce
            const verifyRes = await fetch("/api/verify-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email })
            });
            const verifyData = await verifyRes.json();

            if (!verifyData.valid) {
                // In the multi-step form, we might want to handle this error better
                alert(verifyData.message || "Please enter a valid email address."); // Basic fallback
                setIsVerifying(false);
                return;
            }

            // Step 2: Submit to mini-diploma optin
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
                    lifeStage: formData.lifeStage,
                    motivation: formData.motivation,
                    investment: formData.investment,
                    course: "functional-medicine",
                }),
            });

            const data = await response.json();


            if (!response.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            // Track Lead (Server-Side via CAPI)
            // We pass the pixelId to ensure it goes to the FM pixel
            trackLead(
                "Functional Medicine Mini Diploma",
                formData.email,
                formData.firstName,
                PIXEL_CONFIG.FUNCTIONAL_MEDICINE
            );

            // Auto-login
            const result = await signIn("credentials", {
                email: formData.email.toLowerCase(),
                password: LEAD_PASSWORD,
                redirect: false,
                callbackUrl: "/functional-medicine-mini-diploma/thank-you",
            });

            if (result?.error) {
                sessionStorage.setItem("miniDiplomaUser", JSON.stringify({
                    firstName: formData.firstName.trim(),
                    lastName: formData.lastName.trim(),
                    email: formData.email.toLowerCase().trim(),
                }));
                window.location.href = "/functional-medicine-mini-diploma/thank-you";
            } else {
                // The redirect in signIn should handle it, but fallback just in case or if redirect: false
                window.location.href = "/functional-medicine-mini-diploma/thank-you";
            }

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
        <div className="min-h-screen bg-[#FDF8F3] text-[#2D2D2D]" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
            <style dangerouslySetInnerHTML={{ __html: FONTS }} />
            <style jsx global>{`
                h1, h2, h3, h4, .font-serif { font-family: 'Fraunces', serif; }
            `}</style>

            {/* Functional Medicine Niche Pixel */}
            <MetaPixel pixelId={PIXEL_CONFIG.FUNCTIONAL_MEDICINE} />

            {/* Top Bar */}
            <div className="bg-[#5C6B54] text-white text-center py-3 text-sm font-medium tracking-wide">
                <strong>243 women</strong> started their certification this week — Spots are limited for March cohort
            </div>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-[#FFFCF9] to-[#FDF8F3]">
                {/* Background Decoration */}
                <div className="absolute -top-[50%] -right-[20%] w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(193,123,95,0.08)_0%,transparent_70%)]" />

                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 bg-white border border-[#E8D5C9] px-4 py-2 rounded-full text-[13px] text-[#8B7355] mb-6 shadow-sm">
                                <Shield className="w-4 h-4 text-[#C9A962]" />
                                ASI Certified Program — Internationally Recognized
                            </div>

                            <h1 className="text-4xl md:text-5xl font-semibold mb-6 text-[#2D2D2D] leading-[1.2]">
                                Your Health Journey Deserves to Become a <span className="text-[#C17B5F]">5K–10K/Month Career</span>
                            </h1>

                            <p className="text-xl text-[#8B7355] font-light mb-8 max-w-xl">
                                You&apos;ve spent years learning what doctors couldn&apos;t teach you. Now get certified to help other women — and finally get paid for what you already know.
                            </p>

                            <div className="flex flex-wrap gap-6 mb-8">
                                <div className="flex items-center gap-2 text-sm text-[#2D2D2D]">
                                    <Award className="w-5 h-5 text-[#7D8B75]" />
                                    20,000+ Certified
                                </div>
                                <div className="flex items-center gap-2 text-sm text-[#2D2D2D]">
                                    <Star className="w-5 h-5 text-[#7D8B75]" />
                                    4.9/5 Rating
                                </div>
                                <div className="flex items-center gap-2 text-sm text-[#2D2D2D]">
                                    <Globe className="w-5 h-5 text-[#7D8B75]" />
                                    45+ Countries
                                </div>
                            </div>
                        </div>

                        {/* Lead Capture Form */}
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

            {/* Income Section */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <p className="text-[#C17B5F] text-xs font-bold tracking-[2px] uppercase mb-3">Real Income. Real Flexibility.</p>
                    <h2 className="text-3xl md:text-4xl mb-4 max-w-2xl">What Certified Practitioners Actually Earn</h2>
                    <p className="text-lg text-[#8B7355] max-w-2xl mb-12">
                        These aren&apos;t &quot;top 1%&quot; outliers. These are women who started exactly where you are — with knowledge from their own health journey and zero coaching experience.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-[#FDF8F3] rounded-xl p-8 text-center border border-[#E8D5C9]">
                            <p className="text-[#5C6B54] text-xs font-bold uppercase tracking-wider mb-2">Part-Time (10-15 hrs/week)</p>
                            <p className="font-serif text-4xl font-semibold text-[#C17B5F] mb-1">$2,500</p>
                            <p className="text-sm text-[#8B7355] mb-4">per month</p>
                            <p className="text-[15px] leading-relaxed text-[#2D2D2D]">4-6 clients at $150/session. Perfect while kids are in school or alongside another job.</p>
                        </div>
                        <div className="bg-[#FDF8F3] rounded-xl p-8 text-center border border-[#E8D5C9] shadow-lg relative transform md:-translate-y-4">
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#C17B5F] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">Most Common</div>
                            <p className="text-[#5C6B54] text-xs font-bold uppercase tracking-wider mb-2">Full-Time (25-30 hrs/week)</p>
                            <p className="font-serif text-4xl font-semibold text-[#C17B5F] mb-1">$5k–$7.5k</p>
                            <p className="text-sm text-[#8B7355] mb-4">per month</p>
                            <p className="text-[15px] leading-relaxed text-[#2D2D2D]">10-15 clients with monthly packages. Replace your 9-5 income with half the hours.</p>
                        </div>
                        <div className="bg-[#FDF8F3] rounded-xl p-8 text-center border border-[#E8D5C9]">
                            <p className="text-[#5C6B54] text-xs font-bold uppercase tracking-wider mb-2">Scaled (Group Programs)</p>
                            <p className="font-serif text-4xl font-semibold text-[#C17B5F] mb-1">$10,000+</p>
                            <p className="text-sm text-[#8B7355] mb-4">per month</p>
                            <p className="text-[15px] leading-relaxed text-[#2D2D2D]">Add group coaching or digital courses. Serve more women without trading more hours.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* This Is For You Section */}
            <section className="py-20 bg-[#FDF8F3]">
                <div className="max-w-6xl mx-auto px-6">
                    <div className="grid md:grid-cols-2 gap-12">
                        <div className="bg-white rounded-xl p-8 border border-[#E8D5C9]">
                            <h3 className="text-2xl mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-[#7D8B75] flex items-center justify-center text-white">
                                    <CheckCircle2 className="w-5 h-5" />
                                </span>
                                This Is For You If...
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    "You've spent years researching your own health — thyroid, hormones, gut, autoimmune — and finally found answers doctors missed",
                                    "Friends already ask you for advice because you \"get it\" in ways their doctors don't",
                                    "You're tired of work that pays bills but leaves you feeling empty",
                                    "You want flexibility — not another 9-5 that owns your life",
                                    "You've thought \"I should help other women with this\" more than once",
                                    "You're ready to invest in YOUR future, not just everyone else's"
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-3 text-[#2D2D2D]">
                                        <div className="w-2 h-2 rounded-full bg-[#7D8B75] mt-2 flex-shrink-0" />
                                        <span className="text-[15px]">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="bg-white rounded-xl p-8 border border-[#E8D5C9]">
                            <h3 className="text-2xl mb-6 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-full bg-[#C9A0A0] flex items-center justify-center text-white">
                                    <div className="w-4 h-0.5 bg-white transform rotate-45 absolute" />
                                    <div className="w-4 h-0.5 bg-white transform -rotate-45 absolute" />
                                </span>
                                This Is NOT For You If...
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    "You're looking for a magic pill or get-rich-quick scheme",
                                    "You're not willing to invest time and money in professional development",
                                    "You just want a certificate to hang on the wall with no intention to help people",
                                    "You expect clients to magically appear without doing any work",
                                    "You're not open to learning — you think you already know everything"
                                ].map((item, i) => (
                                    <li key={i} className="flex gap-3 text-[#2D2D2D]">
                                        <div className="w-2 h-2 rounded-full bg-[#C9A0A0] mt-2 flex-shrink-0" />
                                        <span className="text-[15px]">{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl text-center mb-3">Women Who Were Exactly Where You Are</h2>
                    <p className="text-lg text-[#8B7355] text-center mb-12">Real stories from real practitioners. Different backgrounds. Same transformation.</p>

                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            {
                                name: "Jennifer M., 47",
                                detail: "Former HR Director → Hormone Health Coach",
                                income: "Now earning $6,200/month part-time",
                                text: "After 22 years in corporate HR, I was burned out and invisible. My own hormone journey taught me more than any doctor ever did. Now I help women in perimenopause understand what's happening to their bodies — and my kids tell me they're proud of me for the first time in years.",
                                initials: "JM"
                            },
                            {
                                name: "Rachel T., 41",
                                detail: "Stay-at-home mom → Functional Wellness Coach",
                                income: "Now earning $4,800/month around kids' schedules",
                                text: "I was terrified my husband would think this was 'just another course.' But when I showed him the career roadmap — and then landed my first paying client in week 3 — he became my biggest supporter. We paid off my certification in the first month.",
                                initials: "RT"
                            },
                            {
                                name: "Diane K., 52",
                                detail: "Nurse Practitioner → Integrative Health Coach",
                                income: "Now earning $8,500/month with group programs",
                                text: "As a nurse for 18 years, I knew medicine wasn't solving root causes. But I didn't know if I could coach 'without a medical degree.' Turns out, my nursing background + this certification = exactly what clients need. I'm finally helping people GET BETTER instead of just managing symptoms.",
                                initials: "DK"
                            },
                            {
                                name: "Monica H., 45",
                                detail: "Rebuilding after divorce → Gut Health Specialist",
                                income: "Now earning $5,400/month with waitlist clients",
                                text: "Divorce at 43 forced me to rebuild everything. I'd spent years healing my gut after autoimmune issues — and realized that knowledge was worth something. Coach Sarah held my hand through the whole certification. 14 months later, I have a practice I love and income I control.",
                                initials: "MH"
                            }
                        ].map((t, i) => (
                            <div key={i} className="bg-[#FDF8F3] p-8 rounded-xl border border-[#E8D5C9]">
                                <p className="text-[16px] italic leading-relaxed mb-6 text-[#2D2D2D]">&ldquo;{t.text}&rdquo;</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[#7D8B75] flex items-center justify-center text-white font-serif text-lg">
                                        {t.initials}
                                    </div>
                                    <div>
                                        <p className="font-bold text-[#2D2D2D]">{t.name}</p>
                                        <p className="text-xs text-[#8B7355]">{t.detail}</p>
                                        <p className="text-xs text-[#C17B5F] font-bold mt-0.5">{t.income}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-[#5C6B54] text-white">
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl text-center mb-12">Your Path from Here to $5K–$10K/Month</h2>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { step: "1", title: "Complete Free Mini-Diploma", text: "60 minutes. Learn the foundations. Get your first certificate today." },
                            { step: "2", title: "Choose Your Specialty Track", text: "Hormones, gut health, functional medicine, or 8 other specializations." },
                            { step: "3", title: "Get ASI Board Certified", text: "8-12 weeks at your own pace. Lifetime access. Coach support throughout." },
                            { step: "4", title: "Launch Your Practice", text: "Our Career Roadmap shows exactly how to get your first paying clients." }
                        ].map((s, i) => (
                            <div key={i} className="text-center">
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 font-serif text-xl text-[#C9A962]">
                                    {s.step}
                                </div>
                                <h4 className="text-lg font-bold mb-2">{s.title}</h4>
                                <p className="text-sm opacity-80 leading-relaxed">{s.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section className="py-20 bg-[#FDF8F3]">
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl text-center mb-12">Questions You Might Be Asking</h2>
                    <div className="space-y-4">
                        {[
                            { q: "What if my spouse thinks this is \"just another course\"?", a: "We get it. That's why our full certification includes a Career Roadmap showing exactly how practitioners earn back their investment — often within 60-90 days. We also include spouse FAQ sheets you can share. Most partners become the biggest supporters once they see the plan." },
                            { q: "Can I really coach without a medical degree?", a: "Yes. Health coaches provide education, accountability, and support — not medical diagnosis or treatment. You're not replacing doctors; you're filling the gap they leave. Our certification teaches you exactly what's in scope (and what's not) so you coach confidently and ethically." },
                            { q: "I'm not sure I'm qualified enough...", a: "If you've solved your own health challenges after years of research, you know more than you think. Our certification gives you the framework, credentials, and confidence to package what you already know. Most students say \"I didn't realize how much I already understood.\"" },
                            { q: "How long does certification take? I'm busy.", a: "The free mini-diploma takes 60 minutes. Full certification is 8-12 weeks at your own pace — most students complete it in naptime windows, lunch breaks, or after kids are asleep. You have lifetime access, so there's no pressure to rush." },
                            { q: "What's the investment for full certification?", a: "Full certification programs range from $497-$997 depending on specialization. That's less than one month of the income you can earn as a certified practitioner. Payment plans are available. The free mini-diploma lets you experience our teaching before investing." },
                        ].map((faq, i) => (
                            <div key={i} className="bg-white rounded-xl border border-[#E8D5C9] overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                >
                                    <span className="font-semibold text-gray-900">{faq.q}</span>
                                    {openFaq === i ? <ChevronUp className="w-5 h-5 text-[#C17B5F]" /> : <ChevronDown className="w-5 h-5 text-[#C17B5F]" />}
                                </button>
                                {openFaq === i && (
                                    <div className="px-6 pb-5 text-[#8B7355] text-sm leading-relaxed border-t border-gray-100 pt-4">
                                        {faq.a}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 bg-white text-center">
                <div className="max-w-4xl mx-auto px-6">
                    <h2 className="text-4xl text-[#2D2D2D] mb-4">You&apos;ve Already Done the Hard Part</h2>
                    <p className="text-xl text-[#8B7355] mb-8 max-w-2xl mx-auto">Years of research. Trial and error. Finally understanding what doctors couldn&apos;t tell you. That knowledge is worth something. Let&apos;s turn it into a career.</p>

                    <div className="flex justify-center mb-8">
                        <Button
                            onClick={scrollToForm}
                            className="bg-[#C17B5F] hover:bg-[#A6624A] text-white text-lg font-bold px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all"
                        >
                            Start Your Free Mini-Diploma Now
                        </Button>
                    </div>

                    <div className="bg-[#FDF8F3] max-w-lg mx-auto p-6 rounded-xl text-sm text-[#8B7355] border border-[#E8D5C9]">
                        <strong>Our Promise:</strong> Complete the free mini-diploma in 60 minutes. If you don&apos;t learn something valuable about root-cause health coaching, we&apos;ll personally apologize. (It hasn&apos;t happened yet.)
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-[#2D2D2D] text-white/60 py-12 text-center text-sm">
                <div className="max-w-6xl mx-auto px-6">
                    <p className="font-serif text-xl text-white mb-3">AccrediPro Academy</p>
                    <p className="mb-4">ASI Certified Programs | Est. 2024 | 20,000+ Practitioners Worldwide</p>
                    <p className="text-xs max-w-lg mx-auto">This site is not a part of Facebook or Meta. Health coaching is education-based and does not replace medical care.</p>
                </div>
            </footer>

            {/* Live Chat Widget */}
            <FloatingChatWidget page="functional-medicine-mini-diploma" />
        </div>
    );
}

export default function FunctionalMedicineMiniDiplomaPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-white flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-burgundy-600 animate-spin" />
            </div>
        }>
            <UniqueFunctionalMedicineMiniDiplomaContent />
        </Suspense>
    );
}
