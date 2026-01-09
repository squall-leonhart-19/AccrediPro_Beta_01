"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Award,
    Star,
    ExternalLink,
    Download,
    CheckCircle,
    Rocket,
    ArrowRight
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CertificateClaimStepProps {
    firstName: string;
    lastName: string;
    diplomaName: string; // e.g., "Women's Health & Hormones"
    hasClaimedCertificate: boolean;
    hasLeftReview: boolean;
    onClaimCertificate: () => void;
    onReviewComplete: () => void;
    certificateUrl?: string;
}

export function CertificateClaimStep({
    firstName,
    lastName,
    diplomaName,
    hasClaimedCertificate,
    hasLeftReview,
    onClaimCertificate,
    onReviewComplete,
    certificateUrl,
}: CertificateClaimStepProps) {
    const [isClaimingCertificate, setIsClaimingCertificate] = useState(false);
    const [showReviewPrompt, setShowReviewPrompt] = useState(false);

    const handleClaimCertificate = async () => {
        setIsClaimingCertificate(true);
        try {
            await onClaimCertificate();
            setShowReviewPrompt(true);
        } finally {
            setIsClaimingCertificate(false);
        }
    };

    const handleReviewClick = async () => {
        // Track that they clicked review
        await onReviewComplete();
        // Open Trustpilot in new tab
        window.open("https://www.trustpilot.com/evaluate/accredipro.academy", "_blank");
    };

    return (
        <div className="space-y-6">
            {/* Celebration Header */}
            <div className="bg-gradient-to-br from-burgundy-600 via-burgundy-700 to-burgundy-800 rounded-2xl p-8 text-center text-white relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-gold-400/10 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-0 w-40 h-40 bg-burgundy-500/30 rounded-full blur-3xl" />

                <div className="relative">
                    <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-xl mb-4">
                        <Award className="w-10 h-10 text-gold-500" />
                    </div>

                    <h1 className="text-3xl font-bold mb-2">
                        Congratulations, {firstName}! 🎉
                    </h1>
                    <p className="text-burgundy-200 text-lg">
                        You've completed your {diplomaName} Mini Diploma!
                    </p>
                </div>
            </div>

            {/* Certificate Preview */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                <div className="p-6 text-center">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">
                        Your Certificate is Ready
                    </h2>

                    {/* Certificate Mockup */}
                    <div className="bg-gradient-to-b from-gray-50 to-white rounded-xl border-4 border-double border-burgundy-200 p-8 max-w-md mx-auto mb-6">
                        <Image
                            src="/newlogo.webp"
                            alt="AccrediPro"
                            width={60}
                            height={60}
                            className="mx-auto mb-4"
                        />
                        <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">
                            Mini Diploma
                        </p>
                        <h3 className="text-xl font-bold text-burgundy-700 mb-1">
                            {diplomaName}
                        </h3>
                        <p className="text-gray-500 text-sm mb-4">has been awarded to</p>
                        <p className="text-2xl font-script text-gray-700 italic mb-4">
                            {firstName} {lastName}
                        </p>
                        <div className="flex items-center justify-center gap-2 text-gold-600">
                            <Award className="h-5 w-5" />
                            <span className="text-sm font-medium">Verified Credential</span>
                        </div>
                    </div>

                    {!hasClaimedCertificate ? (
                        <Button
                            onClick={handleClaimCertificate}
                            disabled={isClaimingCertificate}
                            size="lg"
                            className="bg-burgundy-600 hover:bg-burgundy-700 text-white font-bold px-8"
                        >
                            {isClaimingCertificate ? (
                                "Generating Certificate..."
                            ) : (
                                <>
                                    <Download className="w-5 h-5 mr-2" />
                                    Claim Your Certificate
                                </>
                            )}
                        </Button>
                    ) : (
                        <div className="space-y-3">
                            <div className="flex items-center justify-center gap-2 text-emerald-600 mb-4">
                                <CheckCircle className="w-5 h-5" />
                                <span className="font-medium">Certificate Claimed!</span>
                            </div>
                            {certificateUrl && (
                                <a
                                    href={certificateUrl}
                                    download
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download PDF
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Review Request */}
            {(showReviewPrompt || hasClaimedCertificate) && !hasLeftReview && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6">
                    <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <Star className="w-6 h-6 text-amber-500" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                Share Your Experience 🌟
                            </h3>
                            <p className="text-gray-600 mb-4">
                                Your feedback helps other women discover this program.
                                Would you take 30 seconds to leave a quick review?
                            </p>
                            <Button
                                onClick={handleReviewClick}
                                className="bg-amber-500 hover:bg-amber-600 text-white"
                            >
                                <Star className="w-4 h-4 mr-2" />
                                Leave a Review on Trustpilot
                                <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Review Completed */}
            {hasLeftReview && (
                <div className="bg-emerald-50 rounded-2xl border border-emerald-200 p-6 text-center">
                    <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                    <h3 className="text-lg font-bold text-emerald-800 mb-1">
                        Thank You for Your Review! 💚
                    </h3>
                    <p className="text-emerald-600">
                        You're helping other women find their path.
                    </p>
                </div>
            )}

            {/* Upsell to Career Accelerator */}
            <div className="bg-gradient-to-br from-burgundy-50 to-white rounded-2xl border border-burgundy-200 p-6">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-burgundy-100 flex items-center justify-center flex-shrink-0">
                        <Rocket className="w-6 h-6 text-burgundy-600" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                            Ready to Turn This Into a Career?
                        </h3>
                        <p className="text-gray-600 mb-4">
                            Join hundreds of women earning $5-10K/month as certified
                            {diplomaName.includes("Women") ? " Women's Health" : ""} practitioners.
                            Your mini diploma is just the beginning!
                        </p>
                        <Link href="/my-personal-roadmap-by-coach-sarah?interest=career-accelerator">
                            <Button className="bg-burgundy-600 hover:bg-burgundy-700 text-white">
                                Explore Career Accelerator
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
