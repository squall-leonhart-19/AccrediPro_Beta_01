"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Download,
    Share2,
    ArrowLeft,
    CheckCircle,
    ExternalLink,
    Loader2,
    FileText,
    Award,
    ArrowRight,
    Clock,
    Sparkles,
} from "lucide-react";

interface CertificateData {
    id: string;
    certificateNumber: string;
    issuedAt: Date;
    course: {
        title: string;
        slug: string;
    };
}

interface CertificatesContentProps {
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    completedLessons: number;
    isFullyComplete: boolean;
    hasCertificate: boolean;
    certificate: CertificateData | null;
}

export function CertificatesContent({
    firstName,
    fullName,
    hasCertificate,
    certificate,
}: CertificatesContentProps) {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadPDF = async () => {
        if (!certificate) return;

        setIsDownloading(true);
        try {
            const response = await fetch("/api/certificates/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentName: fullName,
                    certificateId: certificate.certificateNumber,
                    date: new Date(certificate.issuedAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    }),
                    courseTitle: "Women's Health & Hormones Mini Diploma",
                    format: "pdf",
                }),
            });

            if (!response.ok) throw new Error("Failed to generate PDF");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Certificate-${certificate.certificateNumber}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error downloading PDF:", error);
            alert("Failed to download certificate. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };

    const handleShare = async () => {
        if (!certificate) return;

        const shareUrl = `${window.location.origin}/verify/${certificate.certificateNumber}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: "Women's Health & Hormones Mini Diploma",
                    text: `I earned my Women's Health & Hormones Mini Diploma from AccrediPro Academy!`,
                    url: shareUrl,
                });
            } catch {
                console.log("Share cancelled");
            }
        } else {
            navigator.clipboard.writeText(shareUrl);
            alert("Verification link copied to clipboard!");
        }
    };

    const issuedDate = certificate
        ? new Date(certificate.issuedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "";

    return (
        <div className="min-h-screen bg-gradient-to-br from-burgundy-50 via-white to-gold-50">
            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="flex items-center justify-between flex-wrap gap-4 mb-8">
                    <Link href="/womens-health-diploma">
                        <Button variant="ghost" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                        </Button>
                    </Link>
                    {hasCertificate && certificate && (
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleShare}>
                                <Share2 className="w-4 h-4 mr-2" /> Share
                            </Button>
                            <Button
                                size="sm"
                                onClick={handleDownloadPDF}
                                disabled={isDownloading}
                                className="bg-burgundy-600 hover:bg-burgundy-700"
                            >
                                {isDownloading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4 mr-2" /> Download PDF
                                    </>
                                )}
                            </Button>
                        </div>
                    )}
                </div>

                {hasCertificate && certificate ? (
                    <>
                        {/* Certificate Preview */}
                        <Card className="overflow-hidden shadow-2xl bg-gradient-to-br from-burgundy-600 to-burgundy-800 mb-8">
                            <CardContent className="p-8 md:p-12 text-center text-white">
                                <div className="w-20 h-20 mx-auto mb-4 bg-gold-400 rounded-full flex items-center justify-center">
                                    <FileText className="w-10 h-10 text-burgundy-800" />
                                </div>
                                <Badge variant="secondary" className="bg-gold-400/20 text-gold-200 border-0 mb-4">
                                    Mini Diploma
                                </Badge>
                                <h2 className="text-2xl md:text-3xl font-bold mb-2">
                                    Women&apos;s Health & Hormones
                                </h2>
                                <p className="text-burgundy-200 mb-6">Awarded to</p>
                                <p className="text-3xl md:text-4xl font-serif italic text-gold-300 mb-6">
                                    {fullName}
                                </p>
                                <p className="text-sm text-burgundy-200">
                                    Certificate #{certificate.certificateNumber}
                                </p>
                                <p className="text-sm text-burgundy-200">Issued: {issuedDate}</p>
                            </CardContent>
                        </Card>

                        {/* Info Cards */}
                        <div className="grid md:grid-cols-2 gap-4 mb-8">
                            <Card className="bg-green-50 border-green-200">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-green-800">Verified Certificate</p>
                                        <p className="text-sm text-green-600">
                                            This certificate is authentic and verified
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="bg-burgundy-50 border-burgundy-200">
                                <CardContent className="p-4 flex items-center gap-3">
                                    <div className="w-10 h-10 bg-burgundy-100 rounded-full flex items-center justify-center">
                                        <ExternalLink className="w-5 h-5 text-burgundy-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-burgundy-800">Public Verification</p>
                                        <Link
                                            href={`/verify/${certificate.certificateNumber}`}
                                            className="text-sm text-burgundy-600 hover:underline"
                                        >
                                            accredipro.academy/verify/{certificate.certificateNumber}
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Certificate Details */}
                        <Card className="mb-8">
                            <CardContent className="p-6">
                                <h3 className="font-bold text-gray-900 mb-4">Certificate Details</h3>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Recipient</p>
                                        <p className="font-medium text-gray-900">{fullName}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Course</p>
                                        <p className="font-medium text-gray-900">
                                            Women&apos;s Health & Hormones Mini Diploma
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Certificate Type</p>
                                        <Badge variant="outline">Mini Diploma</Badge>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Certificate Number</p>
                                        <p className="font-mono text-gray-900">{certificate.certificateNumber}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Issued Date</p>
                                        <p className="font-medium text-gray-900">{issuedDate}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Issuing Organization</p>
                                        <p className="font-medium text-gray-900">AccrediPro Academy</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                ) : (
                    /* Certificate Pending */
                    <Card className="mb-8 border-2 border-amber-200 bg-amber-50">
                        <CardContent className="p-8 text-center">
                            <div className="w-20 h-20 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center">
                                <Clock className="w-10 h-10 text-amber-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">
                                Certificate Processing
                            </h2>
                            <p className="text-gray-600 max-w-md mx-auto mb-6">
                                Great work completing all 9 lessons, {firstName}! Your certificate is being processed and will be ready within 24-48 hours.
                            </p>
                            <div className="bg-white rounded-lg p-4 inline-block">
                                <p className="text-sm text-gray-500">We&apos;ll email you at</p>
                                <p className="font-medium text-gray-900">your registered email</p>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Upsell Section */}
                <Card className="border-2 border-burgundy-200 bg-gradient-to-br from-burgundy-50 to-white overflow-hidden">
                    <CardContent className="p-0">
                        <div className="bg-burgundy-600 text-white px-6 py-4 text-center">
                            <div className="flex items-center justify-center gap-2 mb-1">
                                <Sparkles className="w-5 h-5 text-gold-300" />
                                <span className="font-semibold">Ready for the Full Certification?</span>
                                <Sparkles className="w-5 h-5 text-gold-300" />
                            </div>
                            <p className="text-burgundy-200 text-sm">
                                Transform your passion into a professional career
                            </p>
                        </div>

                        <div className="p-6 sm:p-8">
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Women&apos;s Health & Hormones Certification
                                </h3>
                                <p className="text-gray-600">
                                    Take your knowledge to practitioner level and start helping women transform their health
                                </p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4 mb-6">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-burgundy-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Award className="w-4 h-4 text-burgundy-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">60+ Hours Training</p>
                                        <p className="text-sm text-gray-500">Advanced protocols & case studies</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-burgundy-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <FileText className="w-4 h-4 text-burgundy-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Client Resources</p>
                                        <p className="text-sm text-gray-500">Intake forms, protocols, templates</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-burgundy-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="w-4 h-4 text-burgundy-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Professional Certification</p>
                                        <p className="text-sm text-gray-500">Internationally recognized credentials</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-burgundy-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Sparkles className="w-4 h-4 text-burgundy-600" />
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Business Building</p>
                                        <p className="text-sm text-gray-500">Launch your health coaching practice</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gold-50 border border-gold-200 rounded-lg p-4 text-center mb-6">
                                <p className="text-sm text-gold-800 mb-1">
                                    Special offer for Mini Diploma graduates
                                </p>
                                <p className="text-2xl font-bold text-burgundy-700">
                                    Save $200 on enrollment
                                </p>
                            </div>

                            <div className="text-center">
                                <Link href="/courses/womens-health-certification">
                                    <Button size="lg" className="bg-burgundy-600 hover:bg-burgundy-700 px-8">
                                        Learn More About Full Certification
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
