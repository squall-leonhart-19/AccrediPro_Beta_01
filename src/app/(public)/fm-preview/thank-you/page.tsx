"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ArrowRight, BookOpen, Clock, Award, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FMPreviewThankYouPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-burgundy-50 via-white to-olive-50/30">
            {/* Header */}
            <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 py-12 px-4">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-white/20 flex items-center justify-center">
                        <CheckCircle2 className="h-10 w-10 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        You&apos;re In! Welcome to FM Preview
                    </h1>
                    <p className="text-burgundy-100 text-lg max-w-2xl mx-auto">
                        Your free access to Module 0 & 1 of the Functional Medicine Certification is ready.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                {/* Login Info Card */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 mb-8">
                    <div className="flex items-start gap-6">
                        <Image
                            src="/coaches/sarah-coach.webp"
                            alt="Sarah Mitchell"
                            width={80}
                            height={80}
                            className="w-20 h-20 rounded-full object-cover border-4 border-burgundy-100 shadow-md shrink-0"
                        />
                        <div>
                            <h2 className="text-xl font-bold text-slate-900 mb-2">
                                Here&apos;s How to Access Your Free Modules
                            </h2>
                            <p className="text-slate-600 mb-4">
                                I&apos;m so excited you&apos;re taking this first step! Here&apos;s everything you need to get started:
                            </p>
                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                <p className="text-sm text-slate-600 mb-2">
                                    <strong>Login at:</strong>{" "}
                                    <a
                                        href="https://learn.accredipro.academy"
                                        className="text-burgundy-600 hover:underline"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        learn.accredipro.academy
                                    </a>
                                </p>
                                <p className="text-sm text-slate-600">
                                    <strong>Password:</strong> Futurecoach2025 (please change after first login)
                                </p>
                            </div>
                            <p className="text-slate-500 text-sm mt-3 italic">— Sarah Mitchell, Founder</p>
                        </div>
                    </div>
                </div>

                {/* What You'll Learn */}
                <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8 mb-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-burgundy-600" />
                        What You&apos;ll Learn in Your Free Modules
                    </h3>

                    <div className="space-y-6">
                        {/* Module 0 */}
                        <div className="border border-slate-200 rounded-xl p-5">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-olive-100 flex items-center justify-center shrink-0">
                                    <span className="text-olive-700 font-bold">0</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 mb-1">
                                        Welcome & Foundations
                                    </h4>
                                    <p className="text-slate-600 text-sm mb-3">
                                        Get oriented with the certification program and understand the FM framework that will transform your coaching practice.
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5" />
                                            30 min
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Play className="h-3.5 w-3.5" />
                                            3 lessons
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Module 1 */}
                        <div className="border border-slate-200 rounded-xl p-5">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-olive-100 flex items-center justify-center shrink-0">
                                    <span className="text-olive-700 font-bold">1</span>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-slate-900 mb-1">
                                        Core FM Principles
                                    </h4>
                                    <p className="text-slate-600 text-sm mb-3">
                                        Master the 5 pillars of Functional Medicine coaching and learn how to apply them with your clients.
                                    </p>
                                    <div className="flex items-center gap-4 text-xs text-slate-500">
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5" />
                                            45 min
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Play className="h-3.5 w-3.5" />
                                            5 lessons
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Award className="h-3.5 w-3.5" />
                                            Mini-certificate
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="text-center">
                    <Link href="/login">
                        <Button className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800 text-white font-bold py-6 px-8 rounded-xl text-lg shadow-lg">
                            Start Learning Now
                            <ArrowRight className="h-5 w-5 ml-2" />
                        </Button>
                    </Link>
                    <p className="text-slate-500 text-sm mt-4">
                        Check your email for login details and next steps
                    </p>
                </div>

                {/* What's Next */}
                <div className="mt-12 bg-gradient-to-r from-burgundy-50 to-olive-50 rounded-2xl p-8 border border-burgundy-100">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 text-center">
                        Love the Preview? Unlock the Full Certification
                    </h3>
                    <p className="text-slate-600 text-center mb-6">
                        After completing Module 0 & 1, you can upgrade to the full FM Certification
                        to access all 12 modules, earn your accredited certificate, and transform your career.
                    </p>
                    <div className="flex justify-center">
                        <Link href="/fm-certification">
                            <Button variant="outline" className="border-burgundy-300 text-burgundy-700 hover:bg-burgundy-50">
                                Learn About Full Certification
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 border-t border-slate-200 py-8 px-4">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-slate-500 text-sm">
                        Questions? Reply to your welcome email or contact{" "}
                        <a href="mailto:support@accredipro.academy" className="text-burgundy-600 hover:underline">
                            support@accredipro.academy
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
