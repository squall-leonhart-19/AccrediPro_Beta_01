"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import { MultiStepQualificationForm, QualificationData } from "@/components/lead-portal/multi-step-qualification-form";

// Same default password as backend
const LEAD_PASSWORD = "coach2026";

// AccrediPro Brand Colors (from homepage)
const BRAND = {
    burgundy: "#722f37",
    burgundyDark: "#4e1f24",
    gold: "#d4af37",
    goldLight: "#e8c547",
    cream: "#fdf8f0",
    // Metallic gradients
    goldMetallic: "linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)",
    burgundyMetallic: "linear-gradient(135deg, #722f37 0%, #9a4a54 25%, #722f37 50%, #4e1f24 75%, #722f37 100%)",
};

function FunctionalMedicineMiniDiplomaContent() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [openFaq, setOpenFaq] = useState<number | null>(null);
    const { trackViewContent, trackLead } = useMetaTracking();

    // Track ViewContent on mount
    useEffect(() => {
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
                alert(verifyData.message || "Please enter a valid email address.");
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
            trackLead(
                "Functional Medicine Mini Diploma",
                formData.email,
                formData.firstName,
                PIXEL_CONFIG.FUNCTIONAL_MEDICINE
            );

            // Store user data for thank you page
            sessionStorage.setItem("miniDiplomaUser", JSON.stringify({
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.toLowerCase().trim(),
            }));

            // Auto-login
            const result = await signIn("credentials", {
                email: formData.email.toLowerCase(),
                password: LEAD_PASSWORD,
                redirect: false,
                callbackUrl: "/functional-medicine-mini-diploma/thank-you",
            });

            // Redirect to thank you page
            window.location.href = "/functional-medicine-mini-diploma/thank-you";

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
            {/* Functional Medicine Niche Pixel */}
            <MetaPixel pixelId={PIXEL_CONFIG.FUNCTIONAL_MEDICINE} />

            {/* Top Banner - Gold Metallic */}
            <div className="py-2.5 px-4 text-center text-sm" style={{ background: BRAND.goldMetallic }}>
                <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 flex-wrap">
                    <span className="font-bold" style={{ color: BRAND.burgundyDark }}>
                        🧬 Free Functional Medicine Mini-Diploma
                    </span>
                    <span style={{ color: BRAND.burgundyDark }}>•</span>
                    <span style={{ color: BRAND.burgundyDark }}>
                        <strong>243 women</strong> started this week — Limited cohort access
                    </span>
                </div>
            </div>

            {/* Hero Section */}
            <section className="relative overflow-hidden pt-12 pb-20" style={{ backgroundColor: BRAND.burgundyDark }}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute inset-0" style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, ${BRAND.gold} 1px, transparent 0)`,
                        backgroundSize: '48px 48px'
                    }} />
                </div>

                {/* Glow Effects */}
                <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20" style={{ backgroundColor: BRAND.gold }} />

                <div className="relative max-w-6xl mx-auto px-6">
                    <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
                        <div className="text-white">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
                                <Shield className="w-4 h-4" style={{ color: BRAND.gold }} />
                                <span className="text-sm font-medium" style={{ color: BRAND.gold }}>ASI Certified — Globally Recognized</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-[1.15]">
                                <span className="text-white">Your Free</span>
                                <span className="block mt-2" style={{ color: BRAND.gold }}>
                                    Functional Medicine
                                </span>
                                <span className="block mt-2 text-white">Mini-Diploma Awaits</span>
                            </h1>

                            <p className="text-xl mb-8 opacity-90 max-w-xl">
                                60 minutes. 9 lessons. 1 certificate. Start your journey to becoming a
                                <strong className="text-white"> certified Functional Medicine practitioner</strong> — completely free.
                            </p>

                            <div className="flex flex-wrap gap-6 mb-6">
                                <div className="flex items-center gap-2 text-sm opacity-80">
                                    <Award className="w-5 h-5" style={{ color: BRAND.gold }} />
                                    20,000+ Certified
                                </div>
                                <div className="flex items-center gap-2 text-sm opacity-80">
                                    <Star className="w-5 h-5" style={{ color: BRAND.gold }} />
                                    4.9/5 Rating
                                </div>
                                <div className="flex items-center gap-2 text-sm opacity-80">
                                    <Globe className="w-5 h-5" style={{ color: BRAND.gold }} />
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

            {/* What is Functional Medicine */}
            <section className="py-20" style={{ backgroundColor: BRAND.cream }}>
                <div className="max-w-6xl mx-auto px-6">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.burgundy}10` }}>
                            <Zap className="w-4 h-4" style={{ color: BRAND.burgundy }} />
                            <span className="text-sm font-semibold" style={{ color: BRAND.burgundy }}>The $4.5 Trillion Wellness Industry</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
                            What is Functional Medicine?
                        </h2>
                        <p className="text-lg max-w-3xl mx-auto" style={{ color: "#666" }}>
                            <strong style={{ color: BRAND.burgundy }}>Functional Medicine</strong> addresses the root causes of disease — not just symptoms.
                            While conventional medicine asks "what drug treats this symptom?", Functional Medicine asks
                            "<strong>why is this happening in the first place?</strong>"
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { title: "Root-Cause Focus", desc: "Find what's actually causing health issues, not just mask symptoms with medications" },
                            { title: "Whole-Person Care", desc: "Understand the connections between gut, hormones, immune system, and mental health" },
                            { title: "Prevention First", desc: "Catch dysfunction early before it becomes chronic disease" },
                        ].map((item, i) => (
                            <div key={i} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${BRAND.burgundy}10` }}>
                                    <CheckCircle2 className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                                </div>
                                <h3 className="text-lg font-bold mb-2" style={{ color: BRAND.burgundy }}>{item.title}</h3>
                                <p className="text-gray-600 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Income Section */}
            <section className="py-20 bg-white">
                <div className="max-w-6xl mx-auto px-6">
                    <p className="text-xs font-bold tracking-[2px] uppercase mb-3" style={{ color: BRAND.gold }}>Real Income. Real Flexibility.</p>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 max-w-2xl" style={{ color: BRAND.burgundy }}>What Certified Functional Medicine Practitioners Earn</h2>
                    <p className="text-lg max-w-2xl mb-12" style={{ color: "#666" }}>
                        These aren't "top 1%" outliers. These are women who started exactly where you are.
                    </p>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="rounded-xl p-8 text-center border" style={{ backgroundColor: BRAND.cream, borderColor: "#e5e1db" }}>
                            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: BRAND.burgundy }}>Part-Time (10-15 hrs/week)</p>
                            <p className="text-4xl font-bold mb-1" style={{ color: BRAND.gold }}>$2,500</p>
                            <p className="text-sm mb-4" style={{ color: "#888" }}>per month</p>
                            <p className="text-sm" style={{ color: "#555" }}>4-6 clients at $150/session. Perfect while kids are in school.</p>
                        </div>
                        <div className="rounded-xl p-8 text-center shadow-lg relative transform md:-translate-y-4" style={{ backgroundColor: BRAND.burgundy }}>
                            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}>Most Common</div>
                            <p className="text-xs font-bold uppercase tracking-wider mb-2 text-white/80">Full-Time (25-30 hrs/week)</p>
                            <p className="text-4xl font-bold mb-1" style={{ color: BRAND.gold }}>$5k–$7.5k</p>
                            <p className="text-sm mb-4 text-white/60">per month</p>
                            <p className="text-sm text-white/90">10-15 clients with monthly packages. Replace your 9-5.</p>
                        </div>
                        <div className="rounded-xl p-8 text-center border" style={{ backgroundColor: BRAND.cream, borderColor: "#e5e1db" }}>
                            <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: BRAND.burgundy }}>Scaled (Group Programs)</p>
                            <p className="text-4xl font-bold mb-1" style={{ color: BRAND.gold }}>$10,000+</p>
                            <p className="text-sm mb-4" style={{ color: "#888" }}>per month</p>
                            <p className="text-sm" style={{ color: "#555" }}>Add group coaching or digital courses for leverage.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20" style={{ backgroundColor: BRAND.cream }}>
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-3" style={{ color: BRAND.burgundy }}>Women Who Were Exactly Where You Are</h2>
                    <p className="text-lg text-center mb-12" style={{ color: "#888" }}>Real Functional Medicine practitioners. Different backgrounds. Same transformation.</p>

                    <div className="grid md:grid-cols-2 gap-6">
                        {[
                            {
                                name: "Jennifer M., 47",
                                detail: "Former HR Director → Functional Medicine Coach",
                                income: "Now earning $6,200/month part-time",
                                text: "After 22 years in corporate, I was burned out. My own hormone journey taught me more than any doctor. Now I help women in perimenopause using Functional Medicine principles — and my kids tell me they're proud of me for the first time in years.",
                                initials: "JM"
                            },
                            {
                                name: "Rachel T., 41",
                                detail: "Stay-at-home mom → Functional Wellness Practitioner",
                                income: "Now earning $4,800/month around kids' schedules",
                                text: "I showed my husband the career roadmap and landed my first paying client in week 3. We paid off my certification in the first month with Functional Medicine consultations.",
                                initials: "RT"
                            },
                            {
                                name: "Diane K., 52",
                                detail: "Nurse Practitioner → Integrative Functional Medicine Coach",
                                income: "Now earning $8,500/month with group programs",
                                text: "As a nurse for 18 years, I knew medicine wasn't solving root causes. My nursing background + Functional Medicine certification = exactly what clients need.",
                                initials: "DK"
                            },
                            {
                                name: "Monica H., 45",
                                detail: "Rebuilding after divorce → Functional Gut Health Specialist",
                                income: "Now earning $5,400/month with waitlist clients",
                                text: "I'd spent years healing my gut after autoimmune issues — and realized that Functional Medicine knowledge was worth something. 14 months later, I have a practice I love.",
                                initials: "MH"
                            }
                        ].map((t, i) => (
                            <div key={i} className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                                <p className="text-[15px] italic leading-relaxed mb-6" style={{ color: "#333" }}>&ldquo;{t.text}&rdquo;</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold" style={{ backgroundColor: BRAND.burgundy }}>
                                        {t.initials}
                                    </div>
                                    <div>
                                        <p className="font-bold" style={{ color: BRAND.burgundy }}>{t.name}</p>
                                        <p className="text-xs text-gray-500">{t.detail}</p>
                                        <p className="text-xs font-bold mt-0.5" style={{ color: BRAND.gold }}>{t.income}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 text-white" style={{ backgroundColor: BRAND.burgundyDark }}>
                <div className="max-w-6xl mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Your Path from Here to Certified Functional Medicine Practitioner</h2>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { step: "1", title: "Complete Free Mini-Diploma", text: "60 minutes. Learn Functional Medicine foundations. Get your first certificate today." },
                            { step: "2", title: "Choose Your Specialty", text: "Hormones, gut health, metabolic health, or 8 other Functional Medicine tracks." },
                            { step: "3", title: "Get ASI Board Certified", text: "8-12 weeks at your own pace. Lifetime access. Coach support throughout." },
                            { step: "4", title: "Launch Your Practice", text: "Our Career Roadmap shows exactly how to get your first Functional Medicine clients." }
                        ].map((s, i) => (
                            <div key={i} className="text-center">
                                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl" style={{ color: BRAND.gold }}>
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
            <section className="py-20" style={{ backgroundColor: BRAND.cream }}>
                <div className="max-w-3xl mx-auto px-6">
                    <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: BRAND.burgundy }}>Functional Medicine Mini-Diploma FAQs</h2>
                    <div className="space-y-4">
                        {[
                            { q: "What will I learn in the Functional Medicine mini-diploma?", a: "You'll learn the foundations of root-cause medicine: how the gut, hormones, and immune system connect; early warning signs of dysfunction; and how Functional Medicine differs from conventional approaches. It's your first step toward certification." },
                            { q: "Is this really free?", a: "Yes, 100% free. No credit card required. The Functional Medicine Mini-Diploma is our way of letting you experience ASI training before investing in full certification." },
                            { q: "Can I coach without a medical degree?", a: "Yes. Functional Medicine coaches provide education, accountability, and support — not medical diagnosis. You're filling the gap doctors leave. Our certification teaches you exactly what's in scope." },
                            { q: "How long does the full Functional Medicine certification take?", a: "The free mini-diploma takes 60 minutes. Full Functional Medicine certification is 8-12 weeks at your own pace. Most students complete it while working full-time." },
                            { q: "What's the investment for full Functional Medicine certification?", a: "Full Functional Medicine certification programs range from $497-$997. That's less than one month of income as a certified practitioner. Payment plans available." },
                        ].map((faq, i) => (
                            <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                >
                                    <span className="font-semibold" style={{ color: BRAND.burgundy }}>{faq.q}</span>
                                    {openFaq === i ? <ChevronUp className="w-5 h-5" style={{ color: BRAND.gold }} /> : <ChevronDown className="w-5 h-5" style={{ color: BRAND.gold }} />}
                                </button>
                                {openFaq === i && (
                                    <div className="px-6 pb-5 text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
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
                    <h2 className="text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>Start Your Functional Medicine Journey Today</h2>
                    <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: "#666" }}>
                        60 minutes. 9 lessons. Your first certificate in Functional Medicine. Completely free.
                    </p>

                    <div className="flex justify-center mb-8">
                        <Button
                            onClick={scrollToForm}
                            className="text-lg font-bold px-8 py-6 rounded-xl shadow-xl hover:opacity-90 transition-all"
                            style={{ background: BRAND.goldMetallic, color: BRAND.burgundyDark }}
                        >
                            Start Your Free Mini-Diploma Now
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </div>

                    <div className="max-w-lg mx-auto p-6 rounded-xl text-sm border" style={{ backgroundColor: BRAND.cream, borderColor: "#e5e1db", color: "#666" }}>
                        <strong style={{ color: BRAND.burgundy }}>Our Promise:</strong> Complete the free Functional Medicine mini-diploma in 60 minutes. If you don't learn something valuable about root-cause health, we'll personally apologize.
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 text-center text-sm" style={{ backgroundColor: BRAND.burgundyDark, color: "rgba(255,255,255,0.6)" }}>
                <div className="max-w-6xl mx-auto px-6">
                    <Image
                        src="/ASI_LOGO-removebg-preview.png"
                        alt="Accreditation Standards Institute"
                        width={140}
                        height={40}
                        className="mx-auto mb-4 opacity-80"
                    />
                    <p className="mb-4 text-white">ASI Certified Functional Medicine Programs | Est. 2024 | 20,000+ Practitioners</p>
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
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#fdf8f0" }}>
                <Loader2 className="h-8 w-8 animate-spin" style={{ color: "#722f37" }} />
            </div>
        }>
            <FunctionalMedicineMiniDiplomaContent />
        </Suspense>
    );
}
