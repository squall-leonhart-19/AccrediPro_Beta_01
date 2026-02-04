"use client";

import { useState, useEffect } from "react";
import { Clock, Star, Award, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface CertificatePendingPageProps {
    examScore: number;
    timeRemainingMs: number;
    nicheLabel: string;
    portalSlug: string;
}

export function CertificatePendingPage({
    examScore,
    timeRemainingMs,
    nicheLabel,
    portalSlug,
}: CertificatePendingPageProps) {
    const [remaining, setRemaining] = useState(timeRemainingMs);

    useEffect(() => {
        const interval = setInterval(() => {
            setRemaining((prev) => {
                const newVal = prev - 1000;
                if (newVal <= 0) {
                    // Refresh page when ready
                    window.location.reload();
                    return 0;
                }
                return newVal;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // Convert remaining ms to hours, minutes, seconds
    const hours = Math.floor(remaining / (1000 * 60 * 60));
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 to-white py-12 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Success Header */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Congratulations! 🎉
                    </h1>
                    <p className="text-lg text-gray-600">
                        You scored <span className="font-bold text-emerald-600">{examScore}%</span> and passed!
                    </p>
                </div>

                {/* Certificate Preparation Card */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
                    {/* Gold header */}
                    <div
                        className="p-6 text-center"
                        style={{ background: "linear-gradient(135deg, #d4af37 0%, #f7e7a0 50%, #d4af37 100%)" }}
                    >
                        <Award className="w-12 h-12 mx-auto text-[#4E1F24] mb-2" />
                        <h2 className="text-xl font-bold text-[#4E1F24]">
                            Your Certificate is Being Prepared
                        </h2>
                    </div>

                    <div className="p-8 text-center">
                        <p className="text-gray-600 mb-6">
                            Your official <strong>{nicheLabel}</strong> Mini Diploma certificate
                            is being generated and verified by our team.
                        </p>

                        {/* Countdown Timer */}
                        <div className="bg-gray-50 rounded-xl p-6 mb-6">
                            <div className="flex items-center justify-center gap-2 text-gray-500 mb-3">
                                <Clock className="w-5 h-5" />
                                <span className="text-sm font-medium">Ready in:</span>
                            </div>
                            <div className="flex justify-center gap-4">
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-[#722F37] font-mono">
                                        {String(hours).padStart(2, "0")}
                                    </div>
                                    <div className="text-xs text-gray-400 uppercase">Hours</div>
                                </div>
                                <div className="text-4xl font-bold text-gray-300">:</div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-[#722F37] font-mono">
                                        {String(minutes).padStart(2, "0")}
                                    </div>
                                    <div className="text-xs text-gray-400 uppercase">Minutes</div>
                                </div>
                                <div className="text-4xl font-bold text-gray-300">:</div>
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-[#722F37] font-mono">
                                        {String(seconds).padStart(2, "0")}
                                    </div>
                                    <div className="text-xs text-gray-400 uppercase">Seconds</div>
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-gray-500 mb-6">
                            You'll receive an email from Sarah when your certificate is ready.
                            You can also come back to this page anytime.
                        </p>

                        {/* Leave Review CTA */}
                        <div className="border-t pt-6">
                            <p className="text-gray-600 mb-4">
                                While you wait, help other practitioners find us:
                            </p>
                            <a
                                href="https://www.trustpilot.com/review/accredipro.academy"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Button
                                    size="lg"
                                    className="gap-2 bg-[#00b67a] hover:bg-[#009567] text-white"
                                >
                                    <Star className="w-5 h-5" />
                                    Leave a Trustpilot Review
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>

                {/* Back to Portal */}
                <div className="text-center">
                    <Link href={`/portal/${portalSlug}`}>
                        <Button variant="outline" className="gap-2">
                            <ArrowRight className="w-4 h-4 rotate-180" />
                            Back to Portal
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
