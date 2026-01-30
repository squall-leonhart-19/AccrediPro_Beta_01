"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
    GraduationCap, Award, CheckCircle2, ArrowRight,
    Trophy, Sparkles, Download, Share2, ExternalLink,
    Clock, Star
} from "lucide-react";
import { getConfigByPortalSlug } from "@/lib/mini-diploma-registry";
import confetti from 'canvas-confetti';

const SARAH_AVATAR = "/coaches/sarah-coach.webp";

export default function CompletePage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [firstName, setFirstName] = useState("there");
    const [examPassed, setExamPassed] = useState(false);
    const [examScore, setExamScore] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showCertificate, setShowCertificate] = useState(false);

    const config = getConfigByPortalSlug(slug);

    useEffect(() => {
        const checkStatus = async () => {
            try {
                const res = await fetch(`/api/lead-onboarding/lesson-status?lesson=9&niche=${slug}`);
                if (res.ok) {
                    const data = await res.json();
                    setFirstName(data.firstName || "there");
                    setExamPassed(data.examPassed || false);
                    setExamScore(data.examScore || 0);

                    if (data.examPassed) {
                        setShowCertificate(true);
                        // Fire confetti
                        confetti({
                            particleCount: 100,
                            spread: 70,
                            origin: { y: 0.6 }
                        });

                        // Fire Meta CAPI event for completion
                        if (typeof window !== 'undefined' && (window as any).fbq) {
                            (window as any).fbq('track', 'CompleteRegistration', {
                                content_name: config?.displayName || 'Mini Diploma',
                                content_category: slug,
                                status: 'completed'
                            });
                        }
                    }
                }
            } catch (e) {
                console.error("Failed to check status");
            } finally {
                setLoading(false);
            }
        };
        checkStatus();
    }, [slug, config?.displayName]);

    if (!config) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Portal Not Found</h1>
                    <Link href="/dashboard">
                        <Button>Back to Dashboard</Button>
                    </Link>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    // If exam not passed yet, show exam prompt
    if (!examPassed) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
                <div className="max-w-2xl mx-auto">
                    {/* Congratulations Header */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                            <Trophy className="w-10 h-10 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Amazing Work, {firstName}! 🎉
                        </h1>
                        <p className="text-lg text-gray-600">
                            You've completed all 9 lessons. One final step for your certificate!
                        </p>
                    </div>

                    {/* Exam Card */}
                    <div className="bg-white rounded-2xl shadow-xl border overflow-hidden">
                        <div className="bg-gradient-to-r from-burgundy-600 to-rose-600 px-6 py-4 text-white">
                            <div className="flex items-center gap-3">
                                <GraduationCap className="w-6 h-6" />
                                <h2 className="text-xl font-semibold">Final Assessment</h2>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex items-start gap-4 mb-6">
                                <Image
                                    src={SARAH_AVATAR}
                                    alt="Sarah"
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover"
                                />
                                <div className="flex-1 bg-gray-50 rounded-xl p-4">
                                    <p className="text-gray-700">
                                        "This quick quiz tests your understanding of the key concepts.
                                        Most students pass on their first try! You've got this."
                                    </p>
                                </div>
                            </div>

                            <ul className="space-y-3 mb-6">
                                <li className="flex items-center gap-3 text-gray-600">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    <span>10 multiple choice questions</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-600">
                                    <Clock className="w-5 h-5 text-blue-500" />
                                    <span>~10 minutes to complete</span>
                                </li>
                                <li className="flex items-center gap-3 text-gray-600">
                                    <Star className="w-5 h-5 text-amber-500" />
                                    <span>80% required to pass (8/10 questions)</span>
                                </li>
                            </ul>

                            <Button
                                onClick={() => router.push(`/portal/${slug}/exam`)}
                                className="w-full bg-gradient-to-r from-burgundy-600 to-rose-600 hover:from-burgundy-700 hover:to-rose-700 text-white py-4 rounded-xl font-semibold"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    Start Assessment
                                    <ArrowRight className="w-5 h-5" />
                                </span>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Exam passed - show certificate + CRO
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12 px-4">
            <div className="max-w-3xl mx-auto">
                {/* Celebration Header */}
                <div className="text-center mb-8">
                    <div className="w-24 h-24 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg animate-bounce">
                        <Award className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        Congratulations, {firstName}! 🎓
                    </h1>
                    <p className="text-lg text-gray-600">
                        You scored {examScore}% and earned your {config.displayName} certificate!
                    </p>
                </div>

                {/* Certificate Preview */}
                <div className="bg-white rounded-2xl shadow-xl border overflow-hidden mb-8">
                    <div className="bg-gradient-to-r from-amber-500 to-yellow-500 px-6 py-3 text-white text-center">
                        <div className="flex items-center justify-center gap-2">
                            <Sparkles className="w-5 h-5" />
                            <span className="font-semibold">Your Certificate is Ready!</span>
                            <Sparkles className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="p-6 text-center">
                        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-4 border-amber-200 rounded-xl p-8 mb-6">
                            <GraduationCap className="w-16 h-16 text-amber-600 mx-auto mb-4" />
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                {config.displayName}
                            </h3>
                            <p className="text-gray-600 mb-4">Awarded to: {firstName}</p>
                            <p className="text-sm text-gray-500">
                                Accreditation Service for International Schools
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link href={`/portal/${slug}/certificate`}>
                                <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                                    <Download className="w-4 h-4 mr-2" />
                                    Download Certificate
                                </Button>
                            </Link>
                            <Button variant="outline">
                                <Share2 className="w-4 h-4 mr-2" />
                                Share on LinkedIn
                            </Button>
                        </div>
                    </div>
                </div>

                {/* CRO Offer */}
                <div className="bg-gradient-to-r from-burgundy-600 via-rose-600 to-burgundy-600 rounded-2xl shadow-xl p-8 text-white">
                    <div className="text-center mb-6">
                        <span className="inline-block bg-white/20 rounded-full px-4 py-1 text-sm font-medium mb-4">
                            🔥 Limited Time Offer - Next 24 Hours Only
                        </span>
                        <h2 className="text-2xl font-bold mb-2">
                            Ready to Go PRO?
                        </h2>
                        <p className="text-burgundy-100">
                            Upgrade to the full certification and start earning $150-300/session
                        </p>
                    </div>

                    <div className="bg-white/10 rounded-xl p-6 mb-6">
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                <span>Full professional certification</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                <span>Business-building modules</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                <span>Client attraction templates</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                <span>Lifetime community access</span>
                            </li>
                        </ul>
                    </div>

                    <div className="text-center">
                        <div className="mb-4">
                            <span className="text-burgundy-200 line-through text-lg">$997</span>
                            <span className="text-3xl font-bold ml-3">$297</span>
                            <span className="text-burgundy-200 ml-2">(70% off)</span>
                        </div>

                        <Button
                            className="w-full sm:w-auto bg-white text-burgundy-600 hover:bg-gray-100 font-bold py-4 px-8 rounded-xl"
                            onClick={() => {
                                // Fire Meta Purchase Intent event
                                if (typeof window !== 'undefined' && (window as any).fbq) {
                                    (window as any).fbq('track', 'InitiateCheckout', {
                                        content_name: config?.displayName || 'Full Certification',
                                        content_category: slug,
                                        value: 297,
                                        currency: 'USD'
                                    });
                                }
                                // Redirect to checkout
                                window.location.href = config.checkoutUrl || '/checkout';
                            }}
                        >
                            <span className="flex items-center gap-2">
                                Claim Your Scholarship
                                <ExternalLink className="w-4 h-4" />
                            </span>
                        </Button>

                        <p className="text-sm text-burgundy-200 mt-3">
                            30-day money-back guarantee • Instant access
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
