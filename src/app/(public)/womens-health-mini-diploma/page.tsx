"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Award, CheckCircle2, ArrowRight,
    GraduationCap, Users, Star, Clock,
    BookOpen, MessageCircle, Loader2, Shield,
} from "lucide-react";

// Testimonials
const TESTIMONIALS = [
    {
        name: "Sarah M.",
        role: "Registered Nurse",
        age: 42,
        quote: "After 15 years in traditional medicine, I knew there had to be more. This mini diploma opened my eyes to the hormonal connections I was missing with my patients. Now I'm pursuing the full certification!",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SarahM&backgroundColor=ffd5dc",
    },
    {
        name: "Maria L.",
        role: "Mom & Health Enthusiast",
        age: 38,
        quote: "I struggled with hormonal issues for years and doctors kept dismissing me. This program helped me understand my own body AND gave me the confidence to help other women going through the same thing.",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MariaL&backgroundColor=ffd5dc",
    },
    {
        name: "Jennifer K.",
        role: "Yoga Instructor",
        age: 51,
        quote: "I wanted to add hormone coaching to my wellness practice but didn't know where to start. The mini diploma gave me the foundation I needed. My clients are already asking for more!",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=JenniferK&backgroundColor=ffd5dc",
    },
];

// What you'll learn
const LEARNING_OUTCOMES = [
    "Understand the 5 key female hormones and how they interact",
    "Recognize signs of hormonal imbalance in yourself and others",
    "Learn the gut-hormone connection most doctors miss",
    "Support women through every life stage with confidence",
    "Apply nutrition strategies for natural hormone balance",
    "Take the first step toward a rewarding health coaching career",
];

// Module previews
const MODULES = [
    {
        number: 1,
        title: "Hormonal Foundations",
        lessons: ["Meet Your Hormones", "The Monthly Dance", "When Hormones Go Rogue"],
    },
    {
        number: 2,
        title: "The Hormone-Body Connection",
        lessons: ["Gut-Hormone Axis", "Thyroid & Energy", "Stress & Your Adrenals"],
    },
    {
        number: 3,
        title: "Heal & Thrive",
        lessons: ["Food as Medicine", "Life Stage Support", "Your Next Step"],
    },
];

export default function WomensHealthMiniDiplomaPage() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
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

            // Store user data for thank you page
            sessionStorage.setItem("miniDiplomaUser", JSON.stringify({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.toLowerCase().trim(),
            }));

            window.location.href = "/womens-health-mini-diploma/thank-you";
        } catch (err: any) {
            setError(err.message || "Failed to register. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <Image
                                src="/newlogo.webp"
                                alt="AccrediPro Academy"
                                width={48}
                                height={48}
                                className="rounded-lg"
                            />
                            <div className="hidden sm:block">
                                <span className="font-bold text-lg text-gray-900">AccrediPro</span>
                                <span className="text-burgundy-600 font-medium ml-1">Academy</span>
                            </div>
                        </Link>
                        <div className="flex items-center gap-2 text-sm">
                            <Shield className="h-4 w-4 text-burgundy-600" />
                            <span className="text-gray-600 hidden sm:inline">Accredited Programs</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-burgundy-700 via-burgundy-800 to-burgundy-900">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-burgundy-600/30 rounded-full blur-3xl" />

                <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-20">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Left - Content */}
                        <div className="text-white">
                            <div className="inline-flex items-center gap-2 bg-gold-400/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-gold-400/30">
                                <Award className="h-4 w-4 text-gold-400" />
                                <span className="text-sm font-medium text-gold-300">Free Mini Diploma • Certificate Included</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                                Become a Women's Health Coach
                                <span className="block text-gold-400 mt-2">in Just 60 Minutes</span>
                            </h1>

                            <p className="text-xl text-burgundy-100 mb-8 leading-relaxed">
                                Master the foundations of women's hormonal health with our free 9-lesson mini diploma.
                                Learn from Sarah, earn your certificate, and take the first step toward a rewarding career.
                            </p>

                            {/* Stats */}
                            <div className="flex flex-wrap gap-6 mb-8">
                                <div className="flex items-center gap-2">
                                    <BookOpen className="h-5 w-5 text-gold-400" />
                                    <span className="text-burgundy-100">9 Lessons</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-gold-400" />
                                    <span className="text-burgundy-100">~60 Minutes</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Award className="h-5 w-5 text-gold-400" />
                                    <span className="text-burgundy-100">Certificate</span>
                                </div>
                            </div>

                            {/* Trust badges */}
                            <div className="flex items-center gap-4 text-sm text-burgundy-200">
                                <div className="flex items-center gap-1">
                                    <Users className="h-4 w-4" />
                                    <span>1,200+ enrolled</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} className="h-4 w-4 fill-gold-400 text-gold-400" />
                                    ))}
                                    <span className="ml-1">4.9/5</span>
                                </div>
                            </div>
                        </div>

                        {/* Right - Optin Form */}
                        <div className="bg-white rounded-2xl shadow-2xl p-8">
                            <div className="text-center mb-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-burgundy-100 to-burgundy-50 rounded-xl flex items-center justify-center mx-auto mb-4">
                                    <GraduationCap className="h-7 w-7 text-burgundy-600" />
                                </div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                    Start Your Free Mini Diploma
                                </h2>
                                <p className="text-gray-600">
                                    Get instant access • No credit card required
                                </p>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <Label htmlFor="firstName" className="text-gray-700 text-sm">
                                            First Name
                                        </Label>
                                        <Input
                                            id="firstName"
                                            type="text"
                                            value={firstName}
                                            onChange={(e) => setFirstName(e.target.value)}
                                            placeholder="Sarah"
                                            required
                                            className="mt-1 h-11 border-gray-200 focus:border-burgundy-500 focus:ring-burgundy-500"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="lastName" className="text-gray-700 text-sm">
                                            Last Name
                                        </Label>
                                        <Input
                                            id="lastName"
                                            type="text"
                                            value={lastName}
                                            onChange={(e) => setLastName(e.target.value)}
                                            placeholder="Johnson"
                                            required
                                            className="mt-1 h-11 border-gray-200 focus:border-burgundy-500 focus:ring-burgundy-500"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="email" className="text-gray-700 text-sm">
                                        Email Address
                                    </Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="sarah@example.com"
                                        required
                                        className="mt-1 h-11 border-gray-200 focus:border-burgundy-500 focus:ring-burgundy-500"
                                    />
                                </div>

                                {error && (
                                    <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                                        {error}
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-12 bg-burgundy-600 hover:bg-burgundy-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
                                >
                                    {isSubmitting ? (
                                        <span className="flex items-center gap-2">
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                            Creating Your Account...
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            Get Instant Access
                                            <ArrowRight className="h-5 w-5" />
                                        </span>
                                    )}
                                </Button>

                                <p className="text-center text-xs text-gray-500">
                                    By signing up, you agree to our{" "}
                                    <Link href="/terms-of-service" className="text-burgundy-600 hover:underline">Terms</Link>
                                    {" "}and{" "}
                                    <Link href="/privacy-policy" className="text-burgundy-600 hover:underline">Privacy Policy</Link>
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            {/* Certificate Preview */}
            <section className="py-16 bg-gradient-to-b from-burgundy-50 to-white">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Earn Your Certificate
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                        Complete all 9 lessons and receive your official Women's Health & Hormones Mini Diploma certificate.
                        Share it on LinkedIn and add it to your credentials.
                    </p>

                    {/* Certificate mockup */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 max-w-lg mx-auto">
                        <div className="border-4 border-double border-burgundy-200 rounded-xl p-8">
                            <Image
                                src="/newlogo.webp"
                                alt="AccrediPro"
                                width={60}
                                height={60}
                                className="mx-auto mb-4"
                            />
                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">Mini Diploma</p>
                            <h3 className="text-xl font-bold text-burgundy-700 mb-1">Women's Health & Hormones</h3>
                            <p className="text-gray-500 text-sm mb-4">has been awarded to</p>
                            <p className="text-2xl font-script text-gray-700 mb-4 italic">Your Name Here</p>
                            <div className="flex items-center justify-center gap-2 text-gold-600">
                                <Award className="h-5 w-5" />
                                <span className="text-sm font-medium">Verified Credential</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* What You'll Learn */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            What You'll Learn
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Everything you need to understand women's hormonal health and start helping others
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {LEARNING_OUTCOMES.map((outcome, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-3 bg-gray-50 rounded-xl p-5 border border-gray-100"
                            >
                                <CheckCircle2 className="h-5 w-5 text-burgundy-600 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700">{outcome}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Course Curriculum */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            Your Learning Journey
                        </h2>
                        <p className="text-gray-600">
                            3 modules, 9 interactive lessons with your guide Sarah
                        </p>
                    </div>

                    <div className="space-y-4">
                        {MODULES.map((module) => (
                            <div
                                key={module.number}
                                className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                            >
                                <div className="bg-burgundy-600 px-6 py-4 flex items-center gap-4">
                                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center text-white font-bold">
                                        {module.number}
                                    </div>
                                    <h3 className="text-white font-semibold text-lg">
                                        {module.title}
                                    </h3>
                                </div>
                                <div className="p-6">
                                    <div className="grid sm:grid-cols-3 gap-3">
                                        {module.lessons.map((lesson, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-2 text-gray-600"
                                            >
                                                <div className="w-6 h-6 rounded-full bg-burgundy-100 flex items-center justify-center text-xs font-medium text-burgundy-600">
                                                    {(module.number - 1) * 3 + i + 1}
                                                </div>
                                                <span className="text-sm">{lesson}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-16 bg-white">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">
                            What Our Students Say
                        </h2>
                        <p className="text-gray-600">
                            Join thousands of women transforming their careers
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {TESTIMONIALS.map((testimonial, i) => (
                            <div
                                key={i}
                                className="bg-gray-50 rounded-2xl p-6 border border-gray-100"
                            >
                                {/* Stars */}
                                <div className="flex gap-1 mb-4">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star key={star} className="h-4 w-4 fill-gold-400 text-gold-400" />
                                    ))}
                                </div>

                                {/* Quote */}
                                <p className="text-gray-700 mb-6 leading-relaxed">
                                    "{testimonial.quote}"
                                </p>

                                {/* Author */}
                                <div className="flex items-center gap-3">
                                    <Image
                                        src={testimonial.avatar}
                                        alt={testimonial.name}
                                        width={48}
                                        height={48}
                                        className="rounded-full bg-burgundy-100"
                                    />
                                    <div>
                                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                                        <p className="text-sm text-gray-500">{testimonial.role}, {testimonial.age}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Meet Sarah */}
            <section className="py-16 bg-burgundy-50">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border border-burgundy-100">
                        <div className="flex flex-col md:flex-row items-center gap-8">
                            <div className="relative flex-shrink-0">
                                <Image
                                    src="/coaches/sarah-coach.webp"
                                    alt="Sarah - Your Coach"
                                    width={140}
                                    height={140}
                                    className="rounded-2xl shadow-lg"
                                />
                                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-md flex items-center gap-1">
                                    <MessageCircle className="h-3 w-3" />
                                    Online
                                </div>
                            </div>
                            <div className="text-center md:text-left">
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    Meet Sarah, Your Personal Guide
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    I'll walk you through each lesson with personalized guidance.
                                    Think of me as your mentor - I'm here to answer questions,
                                    provide insights, and help you apply what you learn to real situations.
                                </p>
                                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                                    <span className="bg-burgundy-100 px-3 py-1 rounded-full text-sm text-burgundy-700">
                                        1:1 Chat Support
                                    </span>
                                    <span className="bg-burgundy-100 px-3 py-1 rounded-full text-sm text-burgundy-700">
                                        Quick Responses
                                    </span>
                                    <span className="bg-burgundy-100 px-3 py-1 rounded-full text-sm text-burgundy-700">
                                        Voice Messages
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-16 bg-burgundy-700">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-burgundy-200 text-lg mb-8 max-w-2xl mx-auto">
                        Join 1,200+ women who have taken the first step toward becoming a Women's Health Coach
                    </p>
                    <Button
                        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                        size="lg"
                        className="bg-gold-400 hover:bg-gold-500 text-burgundy-900 font-bold px-8 py-6 rounded-xl shadow-lg"
                    >
                        Get Your Free Mini Diploma
                        <ArrowRight className="h-5 w-5 ml-2" />
                    </Button>
                    <p className="text-burgundy-300 text-sm mt-4">
                        Free access • Certificate included • No credit card required
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-100 py-6">
                <div className="max-w-6xl mx-auto px-4 text-center text-xs text-gray-400">
                    <p>This site is not a part of the Facebook website or Facebook Inc. Additionally, this site is NOT endorsed by Facebook in any way. FACEBOOK is a trademark of FACEBOOK, Inc.</p>
                </div>
            </footer>
        </div>
    );
}
