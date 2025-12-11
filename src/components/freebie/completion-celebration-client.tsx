"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    GraduationCap, Download, Award, Trophy, ArrowRight, CheckCircle2,
    Star, Sparkles, Clock, Users, FileText, Gift, Timer, Zap,
} from "lucide-react";
import Confetti from "react-confetti";
import { MiniDiplomaCertificate } from "@/components/certificates/mini-diploma-certificate";

interface CompletionCelebrationClientProps {
    user: {
        firstName: string;
        lastName: string;
        email: string;
        miniDiplomaCategory: string;
        completedAt: string;
        graduateOfferDeadline: string | null;
        offerExpired: boolean;
    };
    fullCertification: {
        id: string;
        title: string;
        slug: string;
        price: number | null;
        thumbnail: string | null;
        description: string | null;
    } | null;
}

const categoryLabels: Record<string, string> = {
    "functional-medicine": "Functional Medicine",
    "gut-health": "Gut Health",
    "autism": "Autism & Neurodevelopment",
    "hormones": "Women's Hormones",
};

export function CompletionCelebrationClient({ user, fullCertification }: CompletionCelebrationClientProps) {
    const [showConfetti, setShowConfetti] = useState(true);
    const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number } | null>(null);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    // Window size for confetti
    useEffect(() => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Stop confetti after 5 seconds
    useEffect(() => {
        const timer = setTimeout(() => setShowConfetti(false), 5000);
        return () => clearTimeout(timer);
    }, []);

    // Countdown timer for graduate offer
    useEffect(() => {
        if (!user.graduateOfferDeadline || user.offerExpired) return;

        const deadline = new Date(user.graduateOfferDeadline).getTime();

        const updateTimer = () => {
            const now = Date.now();
            const diff = deadline - now;

            if (diff <= 0) {
                setTimeLeft(null);
                return;
            }

            setTimeLeft({
                days: Math.floor(diff / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((diff % (1000 * 60)) / 1000),
            });
        };

        updateTimer();
        const interval = setInterval(updateTimer, 1000);
        return () => clearInterval(interval);
    }, [user.graduateOfferDeadline, user.offerExpired]);

    const discountPrice = fullCertification?.price ? Math.round(fullCertification.price * 0.8) : null; // 20% off
    const categoryName = categoryLabels[user.miniDiplomaCategory] || user.miniDiplomaCategory;

    return (
        <div className="min-h-screen bg-gradient-to-b from-burgundy-50 via-white to-gold-50">
            {/* Confetti */}
            {showConfetti && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false}
                    numberOfPieces={300}
                    colors={['#7c2d3c', '#d4a853', '#10b981', '#3b82f6', '#8b5cf6']}
                />
            )}

            {/* Hero Celebration */}
            <section className="relative overflow-hidden pt-12 pb-8">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 shadow-2xl mb-6 animate-bounce">
                        <Trophy className="w-12 h-12 text-white" />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        🎉 Congratulations, {user.firstName}!
                    </h1>

                    <p className="text-xl text-gray-600 mb-2">
                        You've completed your <span className="text-burgundy-600 font-semibold">{categoryName} Mini Diploma</span>
                    </p>

                    <p className="text-gray-500">
                        Completed on {new Date(user.completedAt).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>
            </section>

            {/* Achievements Unlocked */}
            <section className="max-w-4xl mx-auto px-6 py-8">
                <div className="grid md:grid-cols-3 gap-4">
                    {/* Certificate - Link to section below */}
                    <div className="bg-white rounded-2xl shadow-sm border p-6 text-center hover:shadow-lg transition-shadow">
                        <div className="w-16 h-16 rounded-full bg-burgundy-100 flex items-center justify-center mx-auto mb-4">
                            <GraduationCap className="w-8 h-8 text-burgundy-600" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">Digital Certificate</h3>
                        <p className="text-sm text-gray-500 mb-4">Download your official certificate</p>
                        <Button size="sm" variant="outline" className="w-full" onClick={() => document.getElementById('certificate-section')?.scrollIntoView({ behavior: 'smooth' })}>
                            <Download className="w-4 h-4 mr-2" /> View Certificate
                        </Button>
                    </div>

                    {/* Badge */}
                    <div className="bg-white rounded-2xl shadow-sm border p-6 text-center hover:shadow-lg transition-shadow">
                        <div className="w-16 h-16 rounded-full bg-gold-100 flex items-center justify-center mx-auto mb-4">
                            <Award className="w-8 h-8 text-gold-600" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">Badge Unlocked</h3>
                        <p className="text-sm text-gray-500 mb-4">"Mini Diploma Graduate" badge</p>
                        <Badge className="bg-gradient-to-r from-burgundy-600 to-gold-600 text-white">
                            <Star className="w-3 h-3 mr-1 fill-white" /> {categoryName} Graduate
                        </Badge>
                    </div>

                    {/* Roadmap */}
                    <div className="bg-white rounded-2xl shadow-sm border p-6 text-center hover:shadow-lg transition-shadow">
                        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                            <CheckCircle2 className="w-8 h-8 text-green-600" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-1">Roadmap Updated</h3>
                        <p className="text-sm text-gray-500 mb-4">Your next milestone is ready</p>
                        <Link href="/roadmap">
                            <Button size="sm" variant="outline" className="w-full">
                                View Roadmap <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Certificate Section */}
            <section id="certificate-section" className="max-w-3xl mx-auto px-6 py-8">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">
                    🎓 Your Mini Diploma Certificate
                </h2>
                <MiniDiplomaCertificate
                    studentName={`${user.firstName} ${user.lastName}`}
                    diplomaTitle={`${categoryName} Mini Diploma`}
                    completedDate={user.completedAt}
                    certificateId={`MD-${user.miniDiplomaCategory.toUpperCase().slice(0, 3)}-${new Date(user.completedAt).getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`}
                />
            </section>

            {/* Graduate Offer - Only show if not expired */}
            {fullCertification && !user.offerExpired && timeLeft && (
                <section className="max-w-4xl mx-auto px-6 py-8">
                    <div className="bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 rounded-3xl p-8 text-white relative overflow-hidden">
                        {/* Background pattern */}
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

                        <div className="relative">
                            <div className="flex items-center gap-2 mb-4">
                                <Gift className="w-5 h-5 text-gold-400" />
                                <span className="text-gold-400 font-semibold text-sm uppercase tracking-wide">
                                    Exclusive Graduate Offer
                                </span>
                            </div>

                            <h2 className="text-2xl md:text-3xl font-bold mb-2">
                                Your Next Step: Full Certification
                            </h2>
                            <p className="text-burgundy-100 mb-6 max-w-xl">
                                You've mastered the foundations. Now unlock the complete certification
                                with advanced protocols, your official certificate, and Coach Workspace access.
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Benefits */}
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                                        <span>12 Advanced Modules</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                                        <span>Official Accredited Certificate</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                                        <span>Coach Workspace Access</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                                        <span>Start Your Practice</span>
                                    </div>
                                </div>

                                {/* Price & CTA */}
                                <div className="bg-white/10 rounded-2xl p-6 text-center">
                                    <p className="text-gold-400 font-semibold mb-2 flex items-center justify-center gap-2">
                                        <Sparkles className="w-4 h-4" />
                                        Graduate Discount: 20% OFF
                                    </p>

                                    <div className="mb-4">
                                        <span className="text-4xl font-bold">${discountPrice}</span>
                                        <span className="text-burgundy-200 line-through ml-2">${fullCertification.price}</span>
                                    </div>

                                    {/* Countdown */}
                                    <div className="flex items-center justify-center gap-2 text-sm mb-4">
                                        <Timer className="w-4 h-4 text-gold-400" />
                                        <span className="text-gold-300">Expires in:</span>
                                        <span className="font-mono bg-black/20 px-2 py-1 rounded">
                                            {timeLeft.days}d {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m
                                        </span>
                                    </div>

                                    <Link href={`/courses/${fullCertification.slug}`}>
                                        <Button className="w-full bg-white text-burgundy-700 hover:bg-gold-100 font-semibold h-12">
                                            Explore Full Certification <ArrowRight className="w-4 h-4 ml-2" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* Social Proof */}
            <section className="max-w-4xl mx-auto px-6 py-8">
                <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
                    <div className="flex items-center justify-center gap-2 mb-4">
                        <Users className="w-5 h-5 text-burgundy-600" />
                        <span className="font-semibold text-gray-900">Join Our Community of Graduates</span>
                    </div>
                    <p className="text-gray-600 mb-6">
                        500+ practitioners have already upgraded to the full certification and are now helping clients worldwide.
                    </p>

                    <div className="flex justify-center gap-8 text-center">
                        <div>
                            <p className="text-3xl font-bold text-burgundy-600">500+</p>
                            <p className="text-sm text-gray-500">Certified Practitioners</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-green-600">4.9★</p>
                            <p className="text-sm text-gray-500">Average Rating</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-blue-600">96%</p>
                            <p className="text-sm text-gray-500">Recommend to Others</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Back to Dashboard */}
            <section className="max-w-4xl mx-auto px-6 py-8 text-center">
                <Link href="/dashboard">
                    <Button variant="outline" size="lg">
                        Back to Dashboard
                    </Button>
                </Link>
            </section>
        </div>
    );
}
