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
} from "lucide-react";

interface CertificateViewerProps {
    studentName: string;
    courseTitle: string;
    certificateNumber: string;
    issuedDate: string;
    certificateType: string;
}

export function CertificateViewer({
    studentName,
    courseTitle,
    certificateNumber,
    issuedDate,
    certificateType,
}: CertificateViewerProps) {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownloadPDF = async () => {
        setIsDownloading(true);
        try {
            const response = await fetch("/api/certificates/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentName,
                    certificateId: certificateNumber,
                    date: issuedDate,
                    courseTitle,
                    format: "pdf",
                }),
            });

            if (!response.ok) throw new Error("Failed to generate PDF");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `Certificate-${certificateNumber}.pdf`;
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
        const shareUrl = `${window.location.origin}/verify/${certificateNumber}`;
        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${courseTitle} Certificate`,
                    text: `I earned my ${courseTitle} certification from AccrediPro Academy!`,
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

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <Link href="/certificates">
                    <Button variant="ghost" size="sm">
                        <ArrowLeft className="w-4 h-4 mr-2" /> Back to Certificates
                    </Button>
                </Link>
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
            </div>

            {/* Certificate Preview */}
            <Card className="overflow-hidden shadow-2xl bg-gradient-to-br from-burgundy-600 to-burgundy-800">
                <CardContent className="p-8 md:p-12 text-center text-white">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gold-400 rounded-full flex items-center justify-center">
                        <FileText className="w-10 h-10 text-burgundy-800" />
                    </div>
                    <Badge variant="secondary" className="bg-gold-400/20 text-gold-200 border-0 mb-4">
                        {certificateType === "CERTIFICATION" ? "Certification" : "Mini Diploma"}
                    </Badge>
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">{courseTitle}</h2>
                    <p className="text-burgundy-200 mb-6">Awarded to</p>
                    <p className="text-3xl md:text-4xl font-serif italic text-gold-300 mb-6">{studentName}</p>
                    <p className="text-sm text-burgundy-200">Certificate #{certificateNumber}</p>
                    <p className="text-sm text-burgundy-200">Issued: {issuedDate}</p>
                </CardContent>
            </Card>

            {/* Info Cards */}
            <div className="grid md:grid-cols-2 gap-4">
                <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4 flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="font-semibold text-green-800">Verified Certificate</p>
                            <p className="text-sm text-green-600">This certificate is authentic and verified</p>
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
                            <Link href={`/verify/${certificateNumber}`} className="text-sm text-burgundy-600 hover:underline">
                                accredipro.academy/verify/{certificateNumber}
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Details */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Certificate Details</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-500">Recipient</p>
                            <p className="font-medium text-gray-900">{studentName}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Course</p>
                            <p className="font-medium text-gray-900">{courseTitle}</p>
                        </div>
                        <div>
                            <p className="text-gray-500">Certificate Type</p>
                            <Badge variant="outline">
                                {certificateType === "CERTIFICATION" ? "Certification" : "Mini Diploma"}
                            </Badge>
                        </div>
                        <div>
                            <p className="text-gray-500">Certificate Number</p>
                            <p className="font-mono text-gray-900">{certificateNumber}</p>
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
        </div>
    );
}
