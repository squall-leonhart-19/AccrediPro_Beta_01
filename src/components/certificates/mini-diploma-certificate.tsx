"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Share2, Award, Loader2, CheckCircle, Linkedin } from "lucide-react";
import confetti from "canvas-confetti";

interface MiniDiplomaCertificateProps {
    studentName: string;
    diplomaTitle: string;
    completedDate: string;
    certificateId: string;
    portalSlug: string;
}

export function MiniDiplomaCertificate({
    studentName,
    diplomaTitle,
    completedDate,
    certificateId,
    portalSlug,
}: MiniDiplomaCertificateProps) {
    const [downloading, setDownloading] = useState(false);

    // Fire confetti on mount
    useEffect(() => {
        // Gold and burgundy confetti celebration
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const colors = ["#D4AF37", "#722F37", "#FFD700", "#8B3A42"];

        const frame = () => {
            confetti({
                particleCount: 4,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.8 },
                colors,
            });
            confetti({
                particleCount: 4,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.8 },
                colors,
            });

            if (Date.now() < animationEnd) {
                requestAnimationFrame(frame);
            }
        };

        // Delay slightly then fire
        setTimeout(() => {
            frame();
            // Big burst in the middle
            confetti({
                particleCount: 100,
                spread: 100,
                origin: { x: 0.5, y: 0.5 },
                colors,
            });
        }, 500);
    }, []);

    const formattedDate = new Date(completedDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const handleDownload = async () => {
        setDownloading(true);
        try {
            // Try API first (PDFBolt)
            const response = await fetch("/api/certificates/pdf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    studentName,
                    completedDate,
                    certificateId,
                    type: "mini-diploma",
                    diplomaTitle,
                }),
            });

            const contentType = response.headers.get("content-type");
            if (contentType?.includes("application/pdf")) {
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${diplomaTitle.replace(/\s+/g, "-")}-Certificate.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                return;
            }

            // API didn't return PDF - use client-side generation
            await generateClientSidePDF();
        } catch (error) {
            console.error("PDF download failed, using client-side fallback:", error);
            await generateClientSidePDF();
        } finally {
            setDownloading(false);
        }
    };

    // Client-side PDF generation using html2canvas + jspdf
    const generateClientSidePDF = async () => {
        const html2canvas = (await import("html2canvas")).default;
        const { jsPDF } = await import("jspdf");

        // Find the certificate element
        const certElement = document.querySelector('[data-certificate]') as HTMLElement;
        if (!certElement) {
            throw new Error("Certificate element not found");
        }

        // Capture the certificate as canvas
        const canvas = await html2canvas(certElement, {
            scale: 2,
            useCORS: true,
            backgroundColor: "#fdfbf7",
            logging: false,
        });

        // Create PDF (landscape A4)
        const pdf = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4",
        });

        const pageWidth = 297;
        const pageHeight = 210;
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        // Center vertically if needed
        const yOffset = Math.max(0, (pageHeight - imgHeight) / 2);

        pdf.addImage(
            canvas.toDataURL("image/jpeg", 0.95),
            "JPEG",
            0,
            yOffset,
            imgWidth,
            imgHeight
        );

        pdf.save(`${diplomaTitle.replace(/\s+/g, "-")}-Certificate.pdf`);
    };

    const handleShare = async () => {
        const shareUrl = `${window.location.origin}/verify/${certificateId}`;
        const shareText = `I just earned my ${diplomaTitle} Mini Diploma from AccrediPro Academy! 🎓`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${diplomaTitle} Mini Diploma`,
                    text: shareText,
                    url: shareUrl,
                });
            } catch {
                // User cancelled
            }
        } else {
            await navigator.clipboard.writeText(`${shareText}\n${shareUrl}`);
            alert("Share link copied to clipboard!");
        }
    };

    const handleLinkedInShare = () => {
        const title = encodeURIComponent(`${diplomaTitle} Mini Diploma`);
        const summary = encodeURIComponent(`I just earned my ${diplomaTitle} Mini Diploma from AccrediPro Academy! This certification demonstrates my commitment to professional excellence in ${diplomaTitle}.`);
        const url = encodeURIComponent(`${window.location.origin}/verify/${certificateId}`);

        window.open(
            `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
            "_blank",
            "width=600,height=600"
        );
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                {/* Celebration Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full mb-4">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">Congratulations, {studentName.split(" ")[0]}! 🎉</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        You Did It!
                    </h1>
                    <p className="text-gray-600">
                        Your certificate is ready. Download it, share it, and celebrate your achievement!
                    </p>
                </div>

                <Card className="overflow-hidden shadow-2xl" data-certificate>
                    {/* Certificate Preview */}
                    <div
                        className="bg-gradient-to-br from-[#fdfbf7] to-[#fff9f0] p-8 md:p-12 relative"
                        style={{
                            backgroundImage: `linear-gradient(135deg, #fdfbf7 0%, #fff9f0 100%)`
                        }}
                    >
                        {/* Decorative Border */}
                        <div className="absolute inset-4 border-2 border-[#D4AF37]/50 rounded-lg pointer-events-none" />

                        <div className="relative text-center">
                            {/* Header */}
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <div className="w-14 h-14 bg-gradient-to-br from-[#722F37] to-[#8B3A42] rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-[#D4AF37] font-bold text-xl">AP</span>
                                </div>
                                <h2 className="text-2xl md:text-3xl font-bold text-[#722F37] tracking-wider">
                                    ACCREDIPRO ACADEMY
                                </h2>
                            </div>

                            {/* Mini Diploma Badge */}
                            <div className="inline-block bg-gradient-to-r from-[#D4AF37] to-[#E5C158] text-[#4a2c2c] px-6 py-2 rounded-full text-sm font-bold uppercase tracking-widest mb-2 shadow-md">
                                MINI DIPLOMA
                            </div>
                            <p className="text-xs text-gray-500 mb-6 italic">Level 0 – Foundations</p>

                            {/* Title */}
                            <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#722F37] mb-2">
                                Certificate of Completion
                            </h1>
                            <p className="text-gray-500 mb-6 text-lg">This certifies that</p>

                            {/* Recipient Name */}
                            <p className="text-3xl md:text-5xl font-serif text-gray-800 border-b-3 border-[#D4AF37] inline-block px-8 pb-2 mb-6" style={{ borderBottomWidth: '3px' }}>
                                {studentName}
                            </p>

                            {/* Description */}
                            <p className="text-gray-600 max-w-md mx-auto mb-2 text-lg">
                                has successfully completed the
                            </p>
                            <p className="text-gray-700 max-w-md mx-auto mb-4 text-lg font-medium">
                                Mini Diploma – Level 0 Foundations in
                            </p>

                            {/* Diploma Name */}
                            <h3 className="text-2xl md:text-3xl font-bold text-[#722F37] mb-6">
                                {diplomaTitle}
                            </h3>

                            {/* Authority Line */}
                            <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto leading-relaxed">
                                Aligned with the competency framework of<br />
                                <span className="font-semibold text-gray-700">AccrediPro International Standards Institute</span>
                            </p>

                            {/* Footer Info */}
                            <div className="flex items-end justify-between max-w-lg mx-auto">
                                <div className="text-center">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Date of Completion</p>
                                    <p className="text-sm text-gray-700 font-medium">{formattedDate}</p>
                                </div>

                                {/* Seal */}
                                <div className="w-20 h-20 border-2 border-[#D4AF37] rounded-full flex flex-col items-center justify-center bg-gradient-to-br from-white to-[#fffbf0]">
                                    <Award className="w-8 h-8 text-[#D4AF37]" />
                                    <span className="text-[9px] text-[#D4AF37] uppercase tracking-wider mt-0.5 font-bold">Verified</span>
                                </div>

                                <div className="text-center">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Certificate ID</p>
                                    <p className="text-xs text-gray-700 font-mono font-medium">{certificateId}</p>
                                </div>
                            </div>

                            {/* Legal Disclaimer */}
                            <p className="text-[10px] text-gray-400 mt-8 max-w-lg mx-auto leading-relaxed">
                                This certificate confirms completion of foundational training.
                                It does not confer professional certification, licensure, or authorization to practice.
                            </p>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="p-6 bg-gray-50 border-t">
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Button
                                onClick={handleDownload}
                                disabled={downloading}
                                size="lg"
                                className="gap-2 bg-[#722F37] hover:bg-[#5a252c] text-white shadow-lg"
                            >
                                {downloading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Download className="w-5 h-5" />
                                )}
                                Download PDF
                            </Button>

                            <Button
                                onClick={handleLinkedInShare}
                                size="lg"
                                className="gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white shadow-lg"
                            >
                                <Linkedin className="w-5 h-5" />
                                Share on LinkedIn
                            </Button>

                            <Button
                                onClick={handleShare}
                                variant="outline"
                                size="lg"
                                className="gap-2"
                            >
                                <Share2 className="w-5 h-5" />
                                Share
                            </Button>
                        </div>
                    </div>

                    {/* Verified Badge */}
                    <div className="px-6 pb-6 bg-gray-50">
                        <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
                            <CheckCircle className="w-4 h-4" />
                            <span>Verified Completion</span>
                        </div>
                    </div>
                </Card>

            </div>
        </div>
    );
}
