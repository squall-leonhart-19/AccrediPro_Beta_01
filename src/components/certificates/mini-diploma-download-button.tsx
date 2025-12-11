"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface MiniDiplomaDownloadButtonProps {
    studentName: string;
    diplomaTitle: string;
    completedDate: string;
    certificateId: string;
}

export function MiniDiplomaDownloadButton({
    studentName,
    diplomaTitle,
    completedDate,
    certificateId,
}: MiniDiplomaDownloadButtonProps) {
    const [downloading, setDownloading] = useState(false);

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

    return (
        <Button
            onClick={handleDownload}
            disabled={downloading}
            size="sm"
            className="flex-1 bg-burgundy-600 hover:bg-burgundy-700"
        >
            {downloading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
                <Download className="w-4 h-4 mr-2" />
            )}
            Download
        </Button>
    );
}
