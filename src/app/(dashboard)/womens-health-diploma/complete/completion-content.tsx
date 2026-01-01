"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Star,
    Heart,
    ArrowRight,
    CheckCircle,
    Clock,
    Award,
    ExternalLink,
} from "lucide-react";

interface CompletionContentProps {
    firstName: string;
    completedLessons: number;
    isFullyComplete: boolean;
    hasCertificate: boolean;
    certificate: {
        id: string;
        certificateNumber: string;
        issuedAt: Date;
    } | null;
}

export function CompletionContent({
    firstName,
    hasCertificate,
    certificate,
}: CompletionContentProps) {
    const [selectedRating, setSelectedRating] = useState<number>(0);
    const [hoveredRating, setHoveredRating] = useState<number>(0);

    const handleTrustpilotClick = () => {
        // Open Trustpilot review page in new tab
        window.open("https://www.trustpilot.com/evaluate/accredipro.academy", "_blank");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-burgundy-50 via-white to-gold-50">
            <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
                {/* Celebration Header */}
                <div className="text-center mb-10">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gold-400 to-gold-600 rounded-full flex items-center justify-center shadow-lg">
                        <Award className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-bold text-burgundy-800 mb-3">
                        Congratulations, {firstName}!
                    </h1>
                    <p className="text-lg text-gray-600">
                        You&apos;ve completed the Women&apos;s Health & Hormones Mini Diploma!
                    </p>
                </div>

                {/* Trustpilot Review Request Card */}
                <Card className="border-2 border-gold-200 bg-white shadow-xl mb-8">
                    <CardContent className="p-6 sm:p-8">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-2 mb-4">
                                <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
                                <span className="text-lg font-semibold text-gray-800">
                                    One Last Thing...
                                </span>
                            </div>

                            <p className="text-gray-600 mb-6 max-w-xl mx-auto">
                                We&apos;d love to hear about your experience! Your feedback helps other women discover this knowledge. Would you take 60 seconds to leave a quick review?
                            </p>

                            {/* Star Rating Preview */}
                            <div className="flex justify-center gap-2 mb-6">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        onClick={() => setSelectedRating(star)}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        className="transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-10 h-10 ${
                                                star <= (hoveredRating || selectedRating)
                                                    ? "text-gold-500 fill-gold-500"
                                                    : "text-gray-300"
                                            }`}
                                        />
                                    </button>
                                ))}
                            </div>

                            <Button
                                onClick={handleTrustpilotClick}
                                size="lg"
                                className="bg-[#00b67a] hover:bg-[#009a68] text-white px-8 py-6 text-lg font-semibold rounded-lg"
                            >
                                <Star className="w-5 h-5 mr-2 fill-white" />
                                Leave a Review on Trustpilot
                                <ExternalLink className="w-4 h-4 ml-2" />
                            </Button>

                            <p className="text-sm text-gray-500 mt-4">
                                It only takes 60 seconds and helps us so much!
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Certificate Status Card */}
                <Card className="border border-gray-200 bg-white shadow-lg mb-8">
                    <CardContent className="p-6">
                        {hasCertificate && certificate ? (
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-7 h-7 text-green-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">
                                        Your Certificate is Ready!
                                    </h3>
                                    <p className="text-gray-600">
                                        Certificate #{certificate.certificateNumber}
                                    </p>
                                </div>
                                <Link href="/womens-health-diploma/certificates">
                                    <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                                        View Certificate
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center">
                                    <Clock className="w-7 h-7 text-amber-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900">
                                        Certificate Processing
                                    </h3>
                                    <p className="text-gray-600">
                                        Your certificate will be ready within 24-48 hours. We&apos;ll email you when it&apos;s available!
                                    </p>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* What's Next CTA */}
                <Card className="border border-burgundy-200 bg-gradient-to-br from-burgundy-50 to-white">
                    <CardContent className="p-6 sm:p-8">
                        <h3 className="text-xl font-bold text-burgundy-800 mb-3 text-center">
                            Ready to Go Deeper?
                        </h3>
                        <p className="text-gray-600 text-center mb-6">
                            This Mini Diploma was just the beginning. The full Women&apos;s Health & Hormones Certification takes your knowledge to practitioner level.
                        </p>
                        <div className="grid sm:grid-cols-2 gap-4 text-sm mb-6">
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span>60+ hours of advanced training</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span>Client protocols & case studies</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span>Professional certification</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600" />
                                <span>Business building guidance</span>
                            </div>
                        </div>
                        <div className="text-center">
                            <Link href="/courses/womens-health-certification">
                                <Button size="lg" className="bg-burgundy-600 hover:bg-burgundy-700">
                                    Learn More About the Full Certification
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>

                {/* Back to Dashboard Link */}
                <div className="text-center mt-8">
                    <Link
                        href="/womens-health-diploma"
                        className="text-burgundy-600 hover:text-burgundy-700 font-medium"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        </div>
    );
}
