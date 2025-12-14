"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

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

    // Capitalize first letter of each word
    const capitalizeWords = (str: string) => {
        return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
    };

    const formattedName = capitalizeWords(studentName);

    // Generate the mini diploma HTML template (V2 - 20% Bigger)
    const generateCertificateHTML = () => {
        return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Mini Diploma Certificate - ${diplomaTitle}</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: A4 landscape; margin: 0; }
        @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
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
            padding: 10mm 18mm;
            background: linear-gradient(135deg, #fdfbf7 0%, #fff9f0 100%);
            border: 4px solid #722F37;
            position: relative;
            text-align: center;
            display: flex;
            flex-direction: column;
        }
        .certificate::before {
            content: '';
            position: absolute;
            top: 6mm;
            left: 6mm;
            right: 6mm;
            bottom: 6mm;
            border: 2px solid #D4AF37;
        }
        .header {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 18px;
            margin-bottom: 4mm;
        }
        .logo {
            width: 70px;
            height: 70px;
            background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%);
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #D4AF37;
            font-size: 34px;
            font-weight: bold;
        }
        .academy-name {
            font-size: 34px;
            color: #722F37;
            font-weight: bold;
            letter-spacing: 4px;
        }
        .content { flex: 1; display: flex; flex-direction: column; justify-content: center; }
        .diploma-program {
            font-size: 24px;
            color: #722F37;
            font-weight: bold;
            letter-spacing: 4px;
            text-transform: uppercase;
            margin-bottom: 2mm;
            padding-bottom: 2mm;
            border-bottom: 1px solid #D4AF37;
            display: inline-block;
        }
        .title {
            font-size: 52px;
            color: #722F37;
            font-weight: bold;
            margin-bottom: 2mm;
            font-family: 'Times New Roman', serif;
        }
        .subtitle {
            font-size: 19px;
            color: #666;
            margin-bottom: 3mm;
        }
        .recipient {
            font-size: 52px;
            color: #333;
            font-family: 'Brush Script MT', cursive;
            margin-bottom: 3mm;
            border-bottom: 3px solid #D4AF37;
            display: inline-block;
            padding: 0 35px 6px;
        }
        .description {
            font-size: 18px;
            color: #555;
            max-width: 600px;
            margin: 0 auto 3mm;
            line-height: 1.5;
        }
        .seal-container {
            margin: 2mm 0;
        }
        .seal {
            width: 90px;
            height: 90px;
            border: 1px solid #D4AF37;
            border-radius: 50%;
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #D4AF37;
        }
        .seal-icon { font-size: 36px; }
        .seal-text { font-size: 12px; text-transform: uppercase; letter-spacing: 1px; }
        .signatures {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding: 0 40mm;
            margin-top: 2mm;
        }
        .signature-block {
            text-align: center;
            min-width: 160px;
        }
        .signature-name {
            font-size: 22px;
            color: #333;
            font-family: 'Brush Script MT', cursive;
            font-style: italic;
            padding-bottom: 3px;
            border-bottom: 1px solid #333;
            margin-bottom: 4px;
        }
        .signature-label {
            font-size: 11px;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 1.5px;
        }
        .footer-info {
            display: flex;
            justify-content: center;
            gap: 50mm;
            margin-top: 2mm;
        }
        .info-item {
            text-align: center;
        }
        .info-label {
            font-size: 11px;
            color: #999;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        .info-value {
            font-size: 13px;
            color: #666;
            margin-top: 2px;
        }
        .motto {
            font-size: 12px;
            color: #999;
            font-style: italic;
            margin-top: 2mm;
            letter-spacing: 0.5px;
        }
    </style>
</head>
<body>
    <div class="certificate">
        <div class="header">
            <div class="logo">AP</div>
            <div class="academy-name">ACCREDIPRO ACADEMY</div>
        </div>
        <div class="content">
            <div class="diploma-program">${diplomaTitle}</div>
            <div class="title">Certificate of Completion</div>
            <div class="subtitle">This is to certify that</div>
            <div class="recipient">${formattedName}</div>
            <p class="description">has successfully completed the foundational training and demonstrated proficiency in the core principles and practices of this Mini Diploma program.</p>
        </div>
        <div class="seal-container">
            <div class="seal">
                <div class="seal-icon">★</div>
                <div class="seal-text">Certified</div>
            </div>
        </div>
        <div class="signatures">
            <div class="signature-block">
                <div class="signature-name">${formattedName}</div>
                <div class="signature-label">Student Signature</div>
            </div>
            <div class="signature-block">
                <div class="signature-name">AccrediPro</div>
                <div class="signature-label">Company Signature</div>
            </div>
        </div>
        <div class="footer-info">
            <div class="info-item">
                <div class="info-label">Date of Completion</div>
                <div class="info-value">${formattedDate}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Certificate ID</div>
                <div class="info-value">${certificateId}</div>
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
            const htmlContent = generateCertificateHTML();

            // Create a hidden container to render the certificate
            const container = document.createElement("div");
            container.style.position = "absolute";
            container.style.left = "-9999px";
            container.style.top = "0";
            container.innerHTML = htmlContent;
            document.body.appendChild(container);

            // Find the certificate element
            const certificateEl = container.querySelector(".certificate") as HTMLElement;
            if (!certificateEl) {
                throw new Error("Certificate element not found");
            }

            // Wait for styles to apply
            await new Promise(resolve => setTimeout(resolve, 100));

            // Generate canvas from the certificate
            const canvas = await html2canvas(certificateEl, {
                scale: 2,
                useCORS: true,
                allowTaint: true,
                backgroundColor: "#ffffff",
            });

            // Remove the container
            document.body.removeChild(container);

            // Generate PDF (A4 Landscape)
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "mm",
                format: "a4",
            });

            const imgData = canvas.toDataURL("image/png");
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            // Add the image to fill the PDF
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

            // Download the PDF
            const fileName = `${diplomaTitle.replace(/\s+/g, "_")}_Certificate_${formattedName.replace(/\s+/g, "_")}.pdf`;
            pdf.save(fileName);

        } catch (error) {
            console.error("Download failed:", error);
            alert("Failed to generate PDF. Please try again.");
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
