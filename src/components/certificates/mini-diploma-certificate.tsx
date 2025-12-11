"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Download, Share2, Award, Loader2, CheckCircle } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
    const certificateRef = useRef<HTMLDivElement>(null);

    const formattedDate = new Date(completedDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    // Generate the mini diploma HTML template
    const generateCertificateHTML = () => {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Mini Diploma Certificate - ${diplomaTitle}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        @page {
            size: A4 landscape;
            margin: 0;
        }
        body {
            font-family: 'Georgia', serif;
            width: 297mm;
            height: 210mm;
            display: flex;
            justify-content: center;
            align-items: center;
            background: white;
        }
        .certificate {
            width: 280mm;
            height: 195mm;
            padding: 20mm;
            background: linear-gradient(135deg, #fdfbf7 0%, #fff9f0 100%);
            border: 3px solid #722F37;
            position: relative;
            text-align: center;
        }
        .certificate::before {
            content: '';
            position: absolute;
            top: 8mm;
            left: 8mm;
            right: 8mm;
            bottom: 8mm;
            border: 1px solid #D4AF37;
        }
        .header {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            margin-bottom: 15mm;
        }
        .logo {
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #D4AF37;
            font-size: 28px;
            font-weight: bold;
        }
        .academy-name {
            font-size: 28px;
            color: #722F37;
            font-weight: bold;
            letter-spacing: 2px;
        }
        .mini-diploma-badge {
            display: inline-block;
            background: linear-gradient(135deg, #D4AF37 0%, #C9A227 100%);
            color: #333;
            padding: 8px 24px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 2px;
            margin-bottom: 10mm;
        }
        .title {
            font-size: 42px;
            color: #722F37;
            font-weight: bold;
            margin-bottom: 5mm;
            font-family: 'Times New Roman', serif;
        }
        .subtitle {
            font-size: 16px;
            color: #666;
            margin-bottom: 10mm;
        }
        .recipient {
            font-size: 32px;
            color: #333;
            font-family: 'Brush Script MT', cursive;
            margin-bottom: 8mm;
            border-bottom: 2px solid #D4AF37;
            display: inline-block;
            padding: 0 20px 5px;
        }
        .diploma-name {
            font-size: 24px;
            color: #722F37;
            font-weight: bold;
            margin-bottom: 10mm;
        }
        .description {
            font-size: 14px;
            color: #555;
            max-width: 600px;
            margin: 0 auto 10mm;
            line-height: 1.6;
        }
        .footer {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            margin-top: 15mm;
        }
        .date-section, .id-section {
            text-align: center;
        }
        .label {
            font-size: 11px;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .value {
            font-size: 14px;
            color: #333;
            margin-top: 3px;
        }
        .seal {
            width: 80px;
            height: 80px;
            border: 3px solid #D4AF37;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #D4AF37;
        }
        .seal-icon {
            font-size: 24px;
        }
        .seal-text {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .motto {
            font-size: 12px;
            color: #888;
            font-style: italic;
            margin-top: 10mm;
        }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="header">
            <div class="logo">AP</div>
            <div class="academy-name">ACCREDIPRO ACADEMY</div>
        </div>

        <div class="mini-diploma-badge">Mini Diploma</div>

        <div class="title">Certificate of Completion</div>
        <div class="subtitle">This is to certify that</div>

        <div class="recipient">${studentName}</div>

        <p class="description">
            has successfully completed the foundational training and demonstrated
            proficiency in the core principles and practices of
        </p>

        <div class="diploma-name">${diplomaTitle}</div>

        <div class="footer">
            <div class="date-section">
                <div class="label">Date of Completion</div>
                <div class="value">${formattedDate}</div>
            </div>

            <div class="seal">
                <div class="seal-icon">⚡</div>
                <div class="seal-text">Certified</div>
            </div>

            <div class="id-section">
                <div class="label">Certificate ID</div>
                <div class="value">${certificateId}</div>
            </div>
        </div>

        <div class="motto">Veritas Et Excellentia — Truth and Excellence</div>
    </div>
</body>
</html>
`;
    };

    const handleDownload = async () => {
        setDownloading(true);
        try {
            // Create a hidden iframe to render the certificate HTML
            const iframe = document.createElement("iframe");
            iframe.style.position = "absolute";
            iframe.style.left = "-9999px";
            iframe.style.top = "-9999px";
            iframe.style.width = "297mm";
            iframe.style.height = "210mm";
            document.body.appendChild(iframe);

            const htmlContent = generateCertificateHTML();
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

            if (!iframeDoc) {
                throw new Error("Could not access iframe document");
            }

            iframeDoc.open();
            iframeDoc.write(htmlContent);
            iframeDoc.close();

            // Wait for the content to render
            await new Promise((resolve) => setTimeout(resolve, 500));

            const certificateElement = iframeDoc.querySelector(".certificate") as HTMLElement;

            if (!certificateElement) {
                throw new Error("Certificate element not found");
            }

            // Use html2canvas to capture the certificate
            const canvas = await html2canvas(certificateElement, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: "#ffffff",
            });

            // Create PDF in landscape A4
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4",
            });

            const imgData = canvas.toDataURL("image/png");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Mini-Diploma-${certificateId}.pdf`);

            // Clean up
            document.body.removeChild(iframe);
        } catch (error) {
            console.error("Download failed:", error);
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
                ref={certificateRef}
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
