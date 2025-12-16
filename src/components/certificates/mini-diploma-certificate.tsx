"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Share2, Award, Loader2, CheckCircle } from "lucide-react";

interface MiniDiplomaCertificateProps {
    studentName: string;
    diplomaTitle: string;
    completedDate: string;
    certificateId: string;
}

export function MiniDiplomaCertificate({
    studentName,
    diplomaTitle,
    completedDate,
    certificateId,
}: MiniDiplomaCertificateProps) {
    const [downloading, setDownloading] = useState(false);

    const formattedDate = new Date(completedDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const handleDownload = async () => {
        setDownloading(true);
        try {
            // Call the API to generate PDF using PDFBolt
            const response = await fetch("/api/certificates/pdf", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    studentName,
                    completedDate,
                    certificateId,
                    type: "mini-diploma",
                    diplomaTitle,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to generate PDF");
            }

            // Check if we got a PDF back or a fallback HTML response
            const contentType = response.headers.get("content-type");
            if (contentType?.includes("application/pdf")) {
                // Download the PDF
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${diplomaTitle.replace(/\s+/g, "-")}-Certificate.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
            } else {
                throw new Error("Unexpected response format");
            }
        } catch (error) {
            console.error("PDF download failed:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setDownloading(false);
        }
    };

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}/certificates/mini/${certificateId}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${diplomaTitle} Mini Diploma`,
                    text: `I just completed my ${diplomaTitle} Mini Diploma at AccrediPro Academy!`,
                    url: shareUrl,
                });
            } catch (error) {
                // User cancelled or share failed
            }
        } else {
            // Fallback: copy to clipboard
            await navigator.clipboard.writeText(shareUrl);
            alert("Share link copied to clipboard!");
        }
    };

    return (
        <Card className="overflow-hidden">
            {/* Certificate Preview */}
            <div
                className="bg-gradient-to-br from-[#fdfbf7] to-[#fff9f0] p-8 md:p-12 relative"
                style={{
                    backgroundImage: `
                        linear-gradient(135deg, #fdfbf7 0%, #fff9f0 100%)
                    `
                }}
            >
                {/* Decorative Border */}
                <div className="absolute inset-4 border border-gold-400/50 rounded-lg pointer-events-none" />

                <div className="relative text-center">
                    {/* Header */}
                    <div className="flex items-center justify-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-burgundy-600 to-burgundy-700 rounded-xl flex items-center justify-center">
                            <span className="text-gold-400 font-bold text-lg">AP</span>
                        </div>
                        <h2 className="text-2xl font-bold text-burgundy-700 tracking-wider">
                            ACCREDIPRO ACADEMY
                        </h2>
                    </div>

                    {/* Mini Diploma Badge */}
                    <div className="inline-block bg-gradient-to-r from-gold-400 to-gold-500 text-gray-800 px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest mb-6">
                        Mini Diploma
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-burgundy-700 mb-2">
                        Certificate of Completion
                    </h1>
                    <p className="text-gray-500 mb-6">This is to certify that</p>

                    {/* Recipient Name */}
                    <p className="text-3xl md:text-4xl font-serif text-gray-800 border-b-2 border-gold-400 inline-block px-8 pb-2 mb-6">
                        {studentName}
                    </p>

                    {/* Description */}
                    <p className="text-gray-600 max-w-md mx-auto mb-4">
                        has successfully completed the foundational training and demonstrated
                        proficiency in the core principles and practices of
                    </p>

                    {/* Diploma Name */}
                    <h3 className="text-2xl font-bold text-burgundy-700 mb-8">
                        {diplomaTitle}
                    </h3>

                    {/* Footer Info */}
                    <div className="flex items-end justify-between max-w-lg mx-auto">
                        <div className="text-center">
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Date</p>
                            <p className="text-sm text-gray-700">{formattedDate}</p>
                        </div>

                        {/* Seal */}
                        <div className="w-16 h-16 border-2 border-gold-400 rounded-full flex flex-col items-center justify-center">
                            <Award className="w-6 h-6 text-gold-500" />
                            <span className="text-[8px] text-gold-600 uppercase tracking-wider mt-0.5">Certified</span>
                        </div>

                        <div className="text-center">
                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Certificate ID</p>
                            <p className="text-xs text-gray-700 font-mono">{certificateId}</p>
                        </div>
                    </div>

                    {/* Motto */}
                    <p className="text-xs text-gray-400 italic mt-6">
                        Veritas Et Excellentia — Truth and Excellence
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="p-4 bg-gray-50 flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                    onClick={handleDownload}
                    disabled={downloading}
                    className="gap-2 bg-burgundy-600 hover:bg-burgundy-700"
                >
                    {downloading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <Download className="w-4 h-4" />
                    )}
                    Download Certificate
                </Button>

                <Button
                    onClick={handleShare}
                    variant="outline"
                    className="gap-2"
                >
                    <Share2 className="w-4 h-4" />
                    Share Achievement
                </Button>
            </div>

            {/* Verified Badge */}
            <div className="px-4 pb-4 bg-gray-50">
                <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4" />
                    <span>Verified by AccrediPro Academy</span>
                </div>
            </div>
        </Card>
    );
}
