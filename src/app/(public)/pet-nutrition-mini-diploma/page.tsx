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
    DollarSign, Heart, Sparkles, X, Leaf
} from "lucide-react";
import { PIXEL_CONFIG } from "@/components/tracking/meta-pixel";
import { useMetaTracking } from "@/hooks/useMetaTracking";
import MetaPixel from "@/components/tracking/meta-pixel";
import { CertificatePreview } from "@/components/certificates/certificate-preview";
import { MultiStepQualificationForm, QualificationData } from "@/components/lead-portal/multi-step-qualification-form";

// Same default password as backend
const LEAD_PASSWORD = "coach2026";

// Brand Colors - Emerald Green theme for Pet Nutrition
const BRAND = {
    primary: "#047857",
    primaryDark: "#065f46",
    primaryLight: "#10b981",
    gold: "#d4af37",
    goldLight: "#f7e7a0",
    goldDark: "#b8860b",
    cream: "#fdf8f0",
    goldMetallic: "linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)",
    primaryMetallic: "linear-gradient(135deg, #047857 0%, #10b981 25%, #047857 50%, #065f46 75%, #047857 100%)",
};

function PetNutritionMiniDiplomaContent() {
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
            "Pet Nutrition Mini Diploma",
            "pet-nutrition-mini-diploma",
            "1532546858004361" // BellaPetWellness Pixel
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
                    course: "pet-nutrition",
                    segment: "general",
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            trackLead(
                "Pet Nutrition Mini Diploma",
                formData.email,
                formData.firstName,
                "1532546858004361" // BellaPetWellness Pixel
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
                callbackUrl: "/portal/pet-nutrition",
            });

            // Redirect to qualification interstitial with name for personalization
            window.location.href = `/portal/pet-nutrition?name=${encodeURIComponent(formData.firstName.trim())}`;

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
            <MetaPixel pixelId="1532546858004361" />

            {/* URGENCY BAR with COUNTDOWN */}
            <div style={{ background: BRAND.goldMetallic }} className="py-2.5 px-4 text-center">
                <p className="text-sm font-bold flex items-center justify-center gap-2 flex-wrap" style={{ color: BRAND.primaryDark }}>
                    🐾 FREE ACCESS EXPIRES IN:
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-red-600 text-white text-xs font-mono">
                        {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}
                    </span>
                    • 156 pet lovers enrolled today
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
                            {/* Pet Nutrition Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
                                <Leaf className="w-4 h-4" style={{ color: BRAND.gold }} />
                                <span className="text-sm font-medium" style={{ color: BRAND.gold }}>1-Hour Certification in Pet Nutrition</span>
                            </div>

                            <h1 className="text-3xl md:text-5xl lg:text-[3.5rem] font-black leading-[1.1] mb-6">
                                <span style={{ color: BRAND.goldLight }}>Help Pets Thrive</span><br />
                                <span className="text-white">With Optimal Nutrition</span><br />
                                <span className="text-white/80 text-2xl md:text-3xl lg:text-4xl">Turn Your Love for Animals Into $2K-$5K/Month.</span>
                            </h1>

                            <p className="text-lg md:text-xl text-white/80 mb-8 max-w-lg leading-relaxed">
                                Get <strong className="text-white">certified in 1 hour</strong>. Your passion for pet health is meant to be shared.
                                Join 156 pet nutrition specialists this week who turned their love for animals into a meaningful, profitable practice.
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
                                        <p className="font-bold text-white">$2K-$5K/mo</p>
                                        <p className="text-xs text-white/60">Avg. specialist income</p>
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
                                        +1.8K
                                    </div>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-white text-sm font-semibold">1,800+ pet nutrition specialists certified</p>
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
                                    alt="Sarah Mitchell, Your Pet Nutrition Coach"
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
                                "My Dog's Health Crisis Sparked My Mission.<br />
                                <span style={{ color: BRAND.primary }}>Now I Help Pet Parents Everywhere."</span>
                            </h2>
                            <div className="space-y-4 text-gray-600 leading-relaxed">
                                <p>
                                    I'm Sarah Mitchell. When my golden retriever Max developed chronic digestive issues, I spent months
                                    researching pet nutrition. What I learned changed everything — for Max and for thousands of pets I've
                                    helped since.
                                </p>
                                <p>
                                    <strong className="text-gray-900">The moment that changed everything?</strong> I realized most pet health
                                    issues start with nutrition. Once I understood species-appropriate diets, food sensitivities, and proper
                                    supplementation, Max thrived — and I knew I had to share this knowledge.
                                </p>
                                <p>
                                    Now I train others who share this passion. <strong className="text-gray-900">1,800+ pet nutrition specialists</strong> have
                                    gone through this program. Many were just like you — pet lovers who wanted to do more.
                                </p>
                            </div>
                            <div className="flex flex-wrap gap-4 mt-6">
                                <div className="flex items-center gap-2">
                                    <Award className="w-5 h-5" style={{ color: BRAND.primary }} />
                                    <span className="text-sm font-medium text-gray-700">12+ Years Experience</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5" style={{ color: BRAND.primary }} />
                                    <span className="text-sm font-medium text-gray-700">1,800+ Graduates</span>
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
                        <p className="font-bold text-sm uppercase tracking-wide mb-3" style={{ color: BRAND.primary }}>Join 1,800+ Pet Nutrition Specialists</p>
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                            They Turned Their Love for Pets<br />
                            <span style={{ color: BRAND.primary }}>Into Thriving Practices.</span>
                        </h2>
                    </div>

                    {/* Social Proof Counter */}
                    <div className="flex justify-center gap-6 mb-10">
                        <div className="text-center">
                            <p className="text-3xl font-black" style={{ color: BRAND.primary }}>1,800+</p>
                            <p className="text-xs text-gray-500">Certified Specialists</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-black" style={{ color: BRAND.primary }}>156</p>
                            <p className="text-xs text-gray-500">Enrolled This Week</p>
                        </div>
                        <div className="text-center">
                            <p className="text-3xl font-black" style={{ color: BRAND.primary }}>91%</p>
                            <p className="text-xs text-gray-500">Finish Same Day</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { name: "Jennifer M.", age: "42", income: "$3,200/mo", before: "Vet Tech", story: "I always wanted to do more for the pets I saw struggling with diet-related issues. This certification gave me the knowledge to start my own nutrition consulting practice. Now I help pet parents feed their babies right!", avatar: "/zombie-avatars/user_47_backyard_bbq_1767801467.webp" },
                            { name: "Michelle R.", age: "48", income: "$4,500/mo", before: "Dog Groomer", story: "After seeing so many dogs with skin and coat issues, I knew nutrition was the key. Now I offer nutrition consultations alongside grooming. My clients' pets are healthier than ever!", avatar: "/zombie-avatars/user_52_bedroom_morning_1767801467.webp" },
                            { name: "Amanda K.", age: "35", income: "$2,800/mo", before: "Pet Store Manager", story: "I got tired of recommending foods I knew weren't optimal. This certification gave me the credibility to start my own consulting business. Now I help pets thrive on species-appropriate diets!", avatar: "/zombie-avatars/user_44_bathroom_mirror_1767801533.webp" }
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
                                <h3 className="text-xl font-black text-gray-900 mb-2">The "Healthy Pets" Guarantee</h3>
                                <p className="text-gray-600 leading-relaxed">
                                    Complete all 9 lessons. If you don't feel 100% confident you understand how to help pets thrive through nutrition,
                                    email me personally. I'll either coach you until you do — or refund every penny of any future
                                    purchase you make. <strong>No questions, no guilt, no fine print.</strong>
                                </p>
                                <p className="text-sm text-gray-500 mt-3 italic">— Sarah Mitchell, Your Coach</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* YOUR PATH: PET NUTRITION SPECIALIST */}
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
                                    <span style={{ color: BRAND.gold }}>Certified Pet Nutrition Specialist</span>
                                </h3>
                                <p className="text-white/70 mb-6">
                                    Help pets live longer, healthier lives through optimal nutrition. Work from home. Set your own hours. Make a real difference for furry families.
                                </p>
                                <div className="space-y-3">
                                    {[
                                        "Consult with pet parents 1-on-1 (virtual or in-person)",
                                        "Create custom nutrition plans for dogs and cats",
                                        "Be your own boss with flexible hours",
                                        "Help pets with allergies, weight issues, and chronic conditions"
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
                                    <p className="text-sm font-bold uppercase tracking-wide mb-2" style={{ color: BRAND.primary }}>Average Specialist Income</p>
                                    <div className="text-5xl md:text-6xl font-black mb-2" style={{ color: BRAND.primary }}>$2K-$5K</div>
                                    <p className="text-gray-500 text-sm mb-6">per month (part-time)</p>

                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div>
                                            <p className="text-2xl font-bold" style={{ color: BRAND.primary }}>$75</p>
                                            <p className="text-xs text-gray-500">per consultation</p>
                                        </div>
                                        <div>
                                            <p className="text-2xl font-bold" style={{ color: BRAND.primary }}>10-15</p>
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

            {/* YOUR LOVE FOR PETS IS YOUR ADVANTAGE */}
            <section className="py-16 md:py-20 bg-white">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                            Your Love for Pets Is<br />
                            <span style={{ color: BRAND.primary }}>Your Unfair Advantage</span>
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            You already understand pets. You see when they're thriving and when something's off.
                            You just need the <strong>knowledge and credentials</strong> to turn that into a practice.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { icon: Leaf, title: "Natural Passion", desc: "You already care deeply about animal health. That's the foundation of every great pet nutrition specialist." },
                            { icon: BookOpen, title: "Desire to Help", desc: "You want to make a difference for pets and their families. That calling drives successful practices." },
                            { icon: Heart, title: "Pet Parent Connection", desc: "You naturally connect with fellow pet lovers. That's what builds a loyal client base." }
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
                                    diplomaTitle="Pet Nutrition"
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
                                VALIDATE YOUR EXPERTISE
                            </div>

                            <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                                Get Certified Today.<br />
                                <span style={{ color: BRAND.primary }}>In Just 1 Hour.</span>
                            </h2>

                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Complete all 9 lessons and receive your <strong>ASI-Verified Foundation Certificate</strong>.
                                Add it to LinkedIn today. Show pet parents you're a trained pet nutrition specialist.
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
                                            Your access expires in <strong className="text-red-600">48 hours</strong>. Complete all 9 lessons to claim your certificate.
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
                                    "You're a devoted pet parent who wants to learn more",
                                    "You work with animals (groomer, vet tech, pet sitter)",
                                    "You want to help pets live longer, healthier lives",
                                    "You're looking for a flexible side income or new career",
                                    "You believe food is the foundation of health"
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
                                    "You're not interested in pet health and nutrition",
                                    "You're looking for a get-rich-quick scheme",
                                    "You're not willing to invest 60 minutes in learning",
                                    "You don't enjoy helping pet parents"
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
                            9 Lessons That Transform Your<br />
                            <span style={{ color: BRAND.gold }}>Passion Into a Practice</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-4">
                        {[
                            { num: 1, title: "Pet Nutrition Foundations", desc: "The principles that guide optimal pet health" },
                            { num: 2, title: "Understanding Pet Food Labels", desc: "Decode ingredients and marketing claims" },
                            { num: 3, title: "Species-Appropriate Diets", desc: "What dogs and cats are designed to eat" },
                            { num: 4, title: "Common Nutritional Deficiencies", desc: "Signs, symptoms, and solutions" },
                            { num: 5, title: "Natural Supplements for Pets", desc: "When and what to recommend" },
                            { num: 6, title: "Weight Management Strategies", desc: "Help overweight pets safely slim down" },
                            { num: 7, title: "Life Stage Nutrition", desc: "Puppies, adults, and senior pets" },
                            { num: 8, title: "Treating Health Issues with Diet", desc: "Allergies, digestive problems, and more" },
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
                            { item: "9-Lesson Pet Nutrition Mini-Diploma", value: "$97" },
                            { item: "ASI-Verified Certificate of Completion", value: "$47" },
                            { item: "Pet Food Label Decoder Guide", value: "$197" },
                            { item: "Client Consultation Templates", value: "$47" },
                            { item: "Private Community Access (1,800+ specialists)", value: "$47" }
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
                            <p className="text-sm opacity-80 mt-1">For Pet Lovers Ready to Make a Difference</p>
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
                            { q: "Can I really help pets with nutrition? Is there a market for this?", a: "Absolutely! The pet industry is worth over $130 billion, and pet nutrition is one of the fastest-growing segments. Pet parents are increasingly seeking nutrition guidance — and they're willing to pay for expertise. Our graduates earn $2K-$5K/month part-time helping pets thrive." },
                            { q: "Do I need a veterinary degree?", a: "No! Pet nutrition specialists are not veterinarians — we focus specifically on nutrition guidance, not medical diagnosis or treatment. Think of it like being a nutritionist for humans vs. being a doctor. You'll learn when to refer to a vet and how to work alongside veterinary care." },
                            { q: "I'm not a professional — can I do this?", a: "Yes! Many of our most successful graduates started as passionate pet parents with no professional background. If you love animals and want to help them thrive, you have what it takes. The certification teaches you everything you need to know." },
                            { q: "Can I really learn this in 1 hour?", a: "This mini-diploma gives you the foundation — the core principles, food label reading, and basic protocols to get started. It's not the end of your journey, it's the beginning. Most students complete it in one sitting and feel ready to start helping pets immediately." },
                            { q: "What's the catch? Why is it free?", a: "Simple: we give you a genuinely valuable free certification so you can experience pet nutrition training. If you love it (most do), you'll want to continue with our full certification program. If not, you still walk away with a real credential and practical knowledge. Win-win." },
                            { q: "Is this certification recognized?", a: "ASI (AccrediPro Standards Institute) is our credentialing body for wellness practitioners. Our certification demonstrates you've been trained in evidence-based pet nutrition methods. 1,800+ specialists carry our credential and use it to build thriving practices." },
                            { q: "What if I have questions during the course?", a: "You'll have access to our private community of 1,800+ pet nutrition specialists, plus you can message me directly. We're here to support your journey every step of the way." }
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
                        <span style={{ color: BRAND.gold }}>A Certified Pet Nutrition Specialist.</span>
                    </h2>
                    <p className="text-white/70 text-lg mb-8 max-w-xl mx-auto">
                        156 pet lovers started this week. 91% finished the same day.
                        Your passion + this certification = <strong className="text-white">$2K-$5K/month helping pets thrive.</strong>
                    </p>
                    <Button
                        onClick={scrollToForm}
                        className="h-16 px-12 text-xl font-bold"
                        style={{ background: BRAND.goldMetallic, color: BRAND.primaryDark }}
                    >
                        Get Certified Now — It's Free
                        <ArrowRight className="ml-2 w-6 h-6" />
                    </Button>
                    <p className="text-white/50 text-sm mt-4">🐾 48-hour access window • Complete in 1 hour</p>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-10 text-gray-400" style={{ backgroundColor: "#022c22" }}>
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

export default function PetNutritionMiniDiplomaPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#065f46" }}>
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#d4af37" }} />
            </div>
        }>
            <PetNutritionMiniDiplomaContent />
        </Suspense>
    );
}
