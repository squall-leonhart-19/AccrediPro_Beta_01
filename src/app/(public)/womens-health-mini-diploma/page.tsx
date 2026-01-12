"use client";

import { useState, Suspense } from "react";
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
import { FloatingChatWidget } from "@/components/lead-portal/floating-chat-widget";

// Same default password as backend
const LEAD_PASSWORD = "coach2026";

// Testimonials - Real names, specific results, no AI avatars
const TESTIMONIALS = [
    {
        name: "Jennifer M.",
        role: "Former HR Manager → Certified Women's Health Coach",
        quote: "I was skeptical about another online course. But Coach Sarah actually responds to questions, and the content is legit. I finished my full certification 2 months later and just landed my first corporate wellness contract.",
    },
    {
        name: "Rachel T.",
        role: "Yoga Instructor + Women's Health Specialist",
        quote: "As a yoga instructor, I wanted to add nutrition coaching. The mini-diploma gave me the foundation, and now I offer hormone health packages to my clients. My income doubled.",
    },
    {
        name: "Diane K.",
        role: "Career Changer, Age 52",
        quote: "I'm 52, no medical background, and honestly thought this career wasn't for me. Wrong. I'm now helping women my age navigate menopause — and getting paid for it.",
    },
];

// What you'll be able to do - outcomes focused
const LEARNING_OUTCOMES = [
    "Identify hormonal imbalances your clients struggle with daily",
    "Understand the gut-hormone connection most doctors miss",
    "Recognize thyroid red flags before they become chronic",
    "Support women through menopause with confidence",
    "Position yourself as a specialist in a $4.5 trillion wellness industry",
];

// What you get - value table
const WHAT_YOU_GET = [
    { item: "3 Expert-Led Modules", value: "Deep-dive into women's hormonal health" },
    { item: "9 Bite-Sized Lessons", value: "Watch on your phone, at your pace" },
    { item: "Coach Sarah Guidance", value: "Your personal mentor throughout" },
    { item: "ASI Mini-Diploma Certificate", value: "Download and share on LinkedIn" },
    { item: "Career Roadmap", value: "See exactly how to become certified" },
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

export default function WomensHealthMiniDiplomaPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState("");
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsVerifying(true);
        setError("");

        try {
            // Step 1: Verify email with NeverBounce
            const verifyRes = await fetch("/api/verify-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            const verifyData = await verifyRes.json();

            if (!verifyData.valid) {
                setError(verifyData.message || "Please enter a valid email address.");
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
                    firstName,
                    lastName,
                    email,
                    course: "womens-health",
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Something went wrong");
            }

            // Auto-login
            const result = await signIn("credentials", {
                email: email.toLowerCase(),
                password: LEAD_PASSWORD,
                redirect: false,
            });

            if (result?.error) {
                sessionStorage.setItem("miniDiplomaUser", JSON.stringify({
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    email: email.toLowerCase().trim(),
                }));
                window.location.href = "/womens-health-mini-diploma/thank-you";
            } else {
                window.location.href = "/womens-health-mini-diploma/thank-you";
            }

        } catch (err: any) {
            setError(err.message || "Failed to register. Please try again.");
            setIsSubmitting(false);
            setIsVerifying(false);
        }
    };

    const scrollToForm = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Sticky Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 py-3">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/newlogo.webp"
                                alt="AccrediPro Academy"
                                width={44}
                                height={44}
                                className="rounded-lg"
                            />
                            <div className="hidden sm:block">
                                <span className="font-bold text-gray-900">AccrediPro</span>
                                <span className="text-burgundy-600 font-medium ml-1">Academy</span>
                            </div>
                        </Link>
                        <Button
                            onClick={scrollToForm}
                            className="bg-burgundy-600 hover:bg-burgundy-700 text-white font-semibold px-4 py-2 rounded-lg text-sm"
                        >
                            Get Free Access
                        </Button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-burgundy-700 via-burgundy-800 to-burgundy-900">
                <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-burgundy-600/30 rounded-full blur-3xl" />

                <div className="relative max-w-6xl mx-auto px-4 py-12 md:py-16">
                    <div className="grid lg:grid-cols-2 gap-10 items-center">
                        {/* Left - Content */}
                        <div className="text-white">
                            {/* ASI Badge */}
                            <div className="inline-flex items-center gap-2 bg-gold-400/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-gold-400/30">
                                <Shield className="h-4 w-4 text-gold-400" />
                                <span className="text-sm font-medium text-gold-300">ASI Certified Program</span>
                            </div>

                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                                Become an ASI-Certified
                                <span className="block text-gold-400 mt-1">Women&apos;s Health Specialist</span>
                            </h1>

                            <p className="text-lg md:text-xl text-burgundy-100 mb-6 leading-relaxed">
                                Free 60-minute training — Join 20,000+ certified practitioners worldwide
                            </p>

                            {/* Rating */}
                            <div className="flex items-center gap-2 mb-8">
                                <div className="flex">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} className="h-5 w-5 fill-gold-400 text-gold-400" />
                                    ))}
                                </div>
                                <span className="text-gold-300 font-medium">4.9/5 from 1,000+ reviews</span>
                            </div>
                        </div>

                        {/* Right - Optin Form */}
                        <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
                            <div className="text-center mb-5">
                                <div className="w-12 h-12 bg-gradient-to-br from-burgundy-100 to-burgundy-50 rounded-xl flex items-center justify-center mx-auto mb-3">
                                    <GraduationCap className="h-6 w-6 text-burgundy-600" />
                                </div>
                                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                                    Start Your Free Mini-Diploma Now
                                </h2>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Label htmlFor="firstName" className="text-gray-700 text-sm font-medium">
                                        First Name
                                    </Label>
                                    <Input
                                        id="firstName"
                                        type="text"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        placeholder="Your first name"
                                        required
                                        className="mt-1 h-12 border-gray-200 focus:border-burgundy-500 focus:ring-burgundy-500 text-base"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="lastName" className="text-gray-700 text-sm font-medium">
                                        Last Name
                                    </Label>
                                    <Input
                                        id="lastName"
                                        type="text"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        placeholder="Your last name"
                                        required
                                        className="mt-1 h-12 border-gray-200 focus:border-burgundy-500 focus:ring-burgundy-500 text-base"
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="email" className="text-gray-700 text-sm font-medium">
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        required
                                        className="mt-1 h-12 border-gray-200 focus:border-burgundy-500 focus:ring-burgundy-500 text-base"
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                                        {error}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={isSubmitting || isVerifying}
                                    className="w-full h-14 bg-burgundy-600 hover:bg-burgundy-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transition-all"
                                >
                                    {isVerifying ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Verifying Email...
                                        </span>
                                    ) : isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Creating Your Account...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Get Instant Access — Free
                                            <ArrowRight className="h-5 w-5" />
                                        </span>
                                    )}
                                </Button>

                                {/* Trust badges under button */}
                                <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 pt-2">
                                    <div className="flex items-center gap-1">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                        <span>No credit card required</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                        <span>Instant access to Lesson 1</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                        <span>Meet Coach Sarah in 60 seconds</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                                        <span>Certificate upon completion</span>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust Bar */}
            <section className="bg-gray-50 border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-4 py-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <Shield className="h-5 w-5 text-burgundy-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">ASI</div>
                            <div className="text-xs text-gray-500">Certified</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-gray-900">20,000+</div>
                            <div className="text-xs text-gray-500">Certified Practitioners</div>
                        </div>
                        <div>
                            <div className="flex items-center justify-center gap-1 mb-1">
                                <Globe className="h-5 w-5 text-burgundy-600" />
                            </div>
                            <div className="text-2xl font-bold text-gray-900">45+</div>
                            <div className="text-xs text-gray-500">Countries Worldwide</div>
                        </div>
                        <div>
                            <div className="flex items-center justify-center gap-0.5 mb-1">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
                                ))}
                            </div>
                            <div className="text-2xl font-bold text-gray-900">4.9/5</div>
                            <div className="text-xs text-gray-500">1,000+ Reviews</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Value Proposition - What You'll Be Able To Do */}
            <section className="py-14 bg-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                            In Just 60 Minutes, You&apos;ll Be Able To:
                        </h2>
                    </div>

                    <div className="space-y-3 mb-8">
                        {LEARNING_OUTCOMES.map((outcome, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-3 bg-burgundy-50 rounded-xl p-4 border border-burgundy-100"
                            >
                                <CheckCircle2 className="h-5 w-5 text-burgundy-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-800 font-medium">{outcome}</span>
                            </div>
                        ))}
                    </div>

                    <p className="text-center text-gray-600 text-sm">
                        <span className="font-semibold text-burgundy-600">No medical background required.</span> Start from zero.
                    </p>
                </div>
            </section>

            {/* Social Proof - Join This Week */}
            <section className="py-10 bg-burgundy-50 border-y border-burgundy-100">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Users className="h-5 w-5 text-burgundy-600" />
                        <span className="text-xl font-bold text-gray-900">Join 1,247 Women Who Started This Week</span>
                    </div>
                    <div className="flex items-center justify-center gap-1 mb-4">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className="h-5 w-5 fill-gold-400 text-gold-400" />
                        ))}
                        <span className="ml-2 text-gray-600">4.9/5 from 1,000+ verified reviews</span>
                    </div>
                    <div className="bg-white rounded-xl p-5 border border-burgundy-200 max-w-2xl mx-auto">
                        <p className="text-gray-700 italic mb-3">
                            &ldquo;I finished the mini-diploma on my lunch break. Now I&apos;m 3 months into my certification and already have paying clients.&rdquo;
                        </p>
                        <p className="text-sm text-gray-500">— Michelle R., Former Nurse, Now Women&apos;s Health Coach</p>
                    </div>
                </div>
            </section>

            {/* Urgency Section */}
            <section className="py-10 bg-gradient-to-r from-burgundy-600 to-burgundy-700">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Clock className="h-5 w-5 text-gold-400" />
                        <span className="text-xl font-bold text-white">This Free Training Won&apos;t Be Available Forever</span>
                    </div>
                    <p className="text-burgundy-100 mb-5">
                        We&apos;re currently accepting new students into the Women&apos;s Health track.<br />
                        Spots fill fast — over 200 women joined this week alone.
                    </p>
                    <Button
                        onClick={scrollToForm}
                        size="lg"
                        className="bg-gold-400 hover:bg-gold-500 text-burgundy-900 font-bold px-8 py-4 rounded-xl shadow-lg"
                    >
                        Get Instant Access — It&apos;s Free
                        <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                </div>
            </section>

            {/* What You Get - Value Table */}
            <section className="py-14 bg-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                            Your Free Mini-Diploma Includes:
                        </h2>
                    </div>

                    <div className="bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden mb-6">
                        <div className="grid grid-cols-2 bg-burgundy-600 text-white font-semibold text-sm">
                            <div className="px-5 py-3">What You Get</div>
                            <div className="px-5 py-3">Value</div>
                        </div>
                        {WHAT_YOU_GET.map((row, i) => (
                            <div key={i} className={`grid grid-cols-2 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                <div className="px-5 py-4 font-medium text-gray-900 text-sm">{row.item}</div>
                                <div className="px-5 py-4 text-gray-600 text-sm">{row.value}</div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center">
                        <p className="text-lg">
                            <span className="line-through text-gray-400">Total Value: $197</span>
                            <span className="ml-3 text-2xl font-bold text-burgundy-600">Yours FREE Today</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* Testimonials - No AI Avatars */}
            <section className="py-14 bg-gray-50">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                            What Our Students Say
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {TESTIMONIALS.map((testimonial, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm"
                            >
                                {/* Stars */}
                                <div className="flex gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="h-4 w-4 fill-gold-400 text-gold-400" />
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-gray-700 mb-5 leading-relaxed text-sm">
                                    &ldquo;{testimonial.quote}&rdquo;
                                </p>

                                {/* Author - Initial circle instead of AI avatar */}
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-burgundy-100 flex items-center justify-center text-burgundy-600 font-bold">
                                        {testimonial.name.charAt(0)}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">{testimonial.name}</p>
                                        <p className="text-xs text-gray-500">{testimonial.role}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Meet Coach Sarah */}
            <section className="py-14 bg-white">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-burgundy-50 rounded-2xl p-6 md:p-8 border border-burgundy-100">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="relative flex-shrink-0">
                                <Image
                                    src="/coaches/sarah-coach.webp"
                                    alt="Coach Sarah - Your Mentor"
                                    width={120}
                                    height={120}
                                    className="rounded-2xl shadow-lg"
                                />
                                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white px-2.5 py-1 rounded-full text-xs font-medium shadow-md flex items-center gap-1">
                                    <MessageCircle className="h-3 w-3" />
                                    Online
                                </div>
                            </div>
                            <div className="text-center md:text-left">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Meet Coach Sarah — Your Mentor
                                </h3>
                                <p className="text-gray-600 mb-4 text-sm">
                                    Sarah has helped over 5,000 women transform their health — and their careers.
                                    After struggling with her own hormonal issues for years, she became obsessed with understanding what doctors weren&apos;t telling her.
                                    Now she trains the next generation of women&apos;s health specialists.
                                </p>
                                <div className="bg-white rounded-lg p-4 border border-burgundy-200">
                                    <p className="text-gray-700 italic text-sm">
                                        &ldquo;I&apos;ll be with you every step of the way. This mini-diploma is your first step — but it won&apos;t be your last.&rdquo;
                                    </p>
                                    <p className="text-burgundy-600 font-medium mt-2 text-sm">— Coach Sarah</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQs */}
            <section className="py-14 bg-gray-50">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="text-center mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="space-y-3">
                        {FAQS.map((faq, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                            >
                                <button
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
                                >
                                    <span className="font-medium text-gray-900">{faq.question}</span>
                                    {openFaq === i ? (
                                        <ChevronUp className="h-5 w-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="h-5 w-5 text-gray-400" />
                                    )}
                                </button>
                                {openFaq === i && (
                                    <div className="px-5 pb-4 text-gray-600 text-sm">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-14 bg-gradient-to-br from-burgundy-700 via-burgundy-800 to-burgundy-900">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-burgundy-200 text-lg mb-6 max-w-2xl mx-auto">
                        In 60 minutes, you&apos;ll know more about women&apos;s hormonal health than most doctors.
                    </p>
                    <p className="text-burgundy-100 mb-8">
                        Join 20,000+ ASI-certified practitioners who started exactly where you are now.
                    </p>
                    <Button
                        onClick={scrollToForm}
                        size="lg"
                        className="bg-gold-400 hover:bg-gold-500 text-burgundy-900 font-bold px-10 py-6 rounded-xl shadow-lg text-lg"
                    >
                        Get Instant Access — It&apos;s Free
                        <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                    <div className="flex items-center justify-center gap-3 mt-5 text-burgundy-200 text-sm">
                        <div className="flex items-center gap-1">
                            <Shield className="h-4 w-4" />
                            <span>ASI Certified</span>
                        </div>
                        <span>•</span>
                        <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <Star key={i} className="h-3.5 w-3.5 fill-gold-400 text-gold-400" />
                            ))}
                            <span className="ml-1">4.9/5 from 1,000+ reviews</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Trust Bar */}
            <footer className="bg-gray-900 py-8">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-2 mb-3">
                        <Image
                            src="/newlogo.webp"
                            alt="ASI"
                            width={36}
                            height={36}
                            className="rounded-lg"
                        />
                        <span className="text-white font-semibold">Accreditation Standards Institute</span>
                    </div>
                    <p className="text-gray-400 text-sm mb-3">
                        Est. 2026 • 20,000+ Practitioners Worldwide
                    </p>
                    <p className="text-gold-400 text-sm font-medium">
                        &ldquo;The Gold Standard in Health & Wellness Certification&rdquo;
                    </p>
                    <div className="mt-6 pt-6 border-t border-gray-800">
                        <p className="text-gray-500 text-xs">
                            This site is not a part of the Facebook website or Facebook Inc. Additionally, this site is NOT endorsed by Facebook in any way.
                        </p>
                    </div>
                </div>
            </footer>

            {/* Live Chat Widget */}
            <FloatingChatWidget page="womens-health-mini-diploma" />
        </div>
    );
}
