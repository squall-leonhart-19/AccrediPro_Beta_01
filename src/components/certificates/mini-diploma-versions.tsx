"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Test component to generate 10 different PDF template versions
export function MiniDiplomaVersions() {
    const [selectedVersion, setSelectedVersion] = useState(1);

    const studentName = "John Smith";
    const diplomaTitle = "Functional Medicine Foundations";
    const formattedDate = "December 11, 2025";
    const certificateId = "AP-MINI-2025-001";

    // Capitalize helper
    const capitalizeWords = (str: string) => {
        return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
    };
    const formattedName = capitalizeWords(studentName);

    // Version 1: Current approved template (baseline)
    const version1 = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>V1 - Current Approved</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: A4 landscape; margin: 0; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
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
            padding: 12mm 20mm;
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
            top: 7mm;
            left: 7mm;
            right: 7mm;
            bottom: 7mm;
            border: 2px solid #D4AF37;
        }
        .header {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            margin-bottom: 5mm;
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
            letter-spacing: 3px;
        }
        .content { flex: 1; display: flex; flex-direction: column; justify-content: center; }
        .diploma-program {
            font-size: 20px;
            color: #722F37;
            font-weight: bold;
            letter-spacing: 3px;
            text-transform: uppercase;
            margin-bottom: 3mm;
            padding-bottom: 2mm;
            border-bottom: 1px solid #D4AF37;
            display: inline-block;
        }
        .title {
            font-size: 44px;
            color: #722F37;
            font-weight: bold;
            margin-bottom: 3mm;
            font-family: 'Times New Roman', serif;
        }
        .subtitle { font-size: 16px; color: #666; margin-bottom: 4mm; }
        .recipient {
            font-size: 44px;
            color: #333;
            font-family: 'Brush Script MT', cursive;
            margin-bottom: 4mm;
            border-bottom: 3px solid #D4AF37;
            display: inline-block;
            padding: 0 30px 6px;
        }
        .description {
            font-size: 15px;
            color: #555;
            max-width: 550px;
            margin: 0 auto 4mm;
            line-height: 1.5;
        }
        .seal-container { margin: 2mm 0; }
        .seal {
            width: 80px;
            height: 80px;
            border: 1px solid #D4AF37;
            border-radius: 50%;
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #D4AF37;
        }
        .seal-icon { font-size: 30px; }
        .seal-text { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }
        .signatures {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding: 0 35mm;
            margin-top: 3mm;
        }
        .signature-block { text-align: center; min-width: 140px; }
        .signature-name {
            font-size: 18px;
            color: #333;
            font-family: 'Brush Script MT', cursive;
            font-style: italic;
            padding-bottom: 3px;
            border-bottom: 1px solid #333;
            margin-bottom: 4px;
        }
        .signature-label {
            font-size: 9px;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 1.5px;
        }
        .footer-info {
            display: flex;
            justify-content: center;
            gap: 40mm;
            margin-top: 3mm;
        }
        .info-item { text-align: center; }
        .info-label { font-size: 9px; color: #999; text-transform: uppercase; letter-spacing: 1px; }
        .info-value { font-size: 11px; color: #666; margin-top: 2px; }
        .motto { font-size: 10px; color: #999; font-style: italic; margin-top: 2mm; letter-spacing: 0.5px; }
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
</html>`;

    // Version 2: BIGGER - 20% larger text throughout
    const version2 = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>V2 - 20% Bigger Text</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: A4 landscape; margin: 0; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
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
        .subtitle { font-size: 19px; color: #666; margin-bottom: 3mm; }
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
        .seal-container { margin: 2mm 0; }
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
        .signature-block { text-align: center; min-width: 160px; }
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
        .info-item { text-align: center; }
        .info-label { font-size: 11px; color: #999; text-transform: uppercase; letter-spacing: 1px; }
        .info-value { font-size: 13px; color: #666; margin-top: 2px; }
        .motto { font-size: 12px; color: #999; font-style: italic; margin-top: 2mm; letter-spacing: 0.5px; }
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
</html>`;

    // Version 3: EXTRA LARGE - Maximum readable text
    const version3 = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>V3 - Extra Large</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: A4 landscape; margin: 0; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
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
            width: 282mm;
            height: 197mm;
            padding: 8mm 15mm;
            background: linear-gradient(135deg, #fdfbf7 0%, #fff9f0 100%);
            border: 5px solid #722F37;
            position: relative;
            text-align: center;
            display: flex;
            flex-direction: column;
        }
        .certificate::before {
            content: '';
            position: absolute;
            top: 5mm;
            left: 5mm;
            right: 5mm;
            bottom: 5mm;
            border: 2px solid #D4AF37;
        }
        .header {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 20px;
            margin-bottom: 3mm;
        }
        .logo {
            width: 75px;
            height: 75px;
            background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%);
            border-radius: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #D4AF37;
            font-size: 38px;
            font-weight: bold;
        }
        .academy-name {
            font-size: 38px;
            color: #722F37;
            font-weight: bold;
            letter-spacing: 4px;
        }
        .content { flex: 1; display: flex; flex-direction: column; justify-content: center; }
        .diploma-program {
            font-size: 26px;
            color: #722F37;
            font-weight: bold;
            letter-spacing: 4px;
            text-transform: uppercase;
            margin-bottom: 2mm;
            padding-bottom: 2mm;
            border-bottom: 2px solid #D4AF37;
            display: inline-block;
        }
        .title {
            font-size: 58px;
            color: #722F37;
            font-weight: bold;
            margin-bottom: 2mm;
            font-family: 'Times New Roman', serif;
        }
        .subtitle { font-size: 20px; color: #666; margin-bottom: 2mm; }
        .recipient {
            font-size: 58px;
            color: #333;
            font-family: 'Brush Script MT', cursive;
            margin-bottom: 2mm;
            border-bottom: 4px solid #D4AF37;
            display: inline-block;
            padding: 0 40px 6px;
        }
        .description {
            font-size: 18px;
            color: #555;
            max-width: 620px;
            margin: 0 auto 2mm;
            line-height: 1.4;
        }
        .seal-container { margin: 1mm 0; }
        .seal {
            width: 85px;
            height: 85px;
            border: 1px solid #D4AF37;
            border-radius: 50%;
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #D4AF37;
        }
        .seal-icon { font-size: 34px; }
        .seal-text { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
        .signatures {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding: 0 45mm;
            margin-top: 1mm;
        }
        .signature-block { text-align: center; min-width: 170px; }
        .signature-name {
            font-size: 24px;
            color: #333;
            font-family: 'Brush Script MT', cursive;
            font-style: italic;
            padding-bottom: 4px;
            border-bottom: 1px solid #333;
            margin-bottom: 4px;
        }
        .signature-label {
            font-size: 12px;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .footer-info {
            display: flex;
            justify-content: center;
            gap: 55mm;
            margin-top: 1mm;
        }
        .info-item { text-align: center; }
        .info-label { font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px; }
        .info-value { font-size: 14px; color: #666; margin-top: 2px; }
        .motto { font-size: 12px; color: #999; font-style: italic; margin-top: 1mm; letter-spacing: 0.5px; }
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
</html>`;

    // Version 4: WIDER PROPORTIONS - Horizontal emphasis
    const version4 = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>V4 - Wider Proportions</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: A4 landscape; margin: 0; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
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
            width: 285mm;
            height: 190mm;
            padding: 10mm 25mm;
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
            gap: 20px;
            margin-bottom: 4mm;
        }
        .logo {
            width: 65px;
            height: 65px;
            background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #D4AF37;
            font-size: 32px;
            font-weight: bold;
        }
        .academy-name {
            font-size: 32px;
            color: #722F37;
            font-weight: bold;
            letter-spacing: 5px;
        }
        .content { flex: 1; display: flex; flex-direction: column; justify-content: center; }
        .diploma-program {
            font-size: 22px;
            color: #722F37;
            font-weight: bold;
            letter-spacing: 5px;
            text-transform: uppercase;
            margin-bottom: 3mm;
            padding-bottom: 2mm;
            border-bottom: 1px solid #D4AF37;
            display: inline-block;
        }
        .title {
            font-size: 50px;
            color: #722F37;
            font-weight: bold;
            margin-bottom: 3mm;
            font-family: 'Times New Roman', serif;
            letter-spacing: 2px;
        }
        .subtitle { font-size: 18px; color: #666; margin-bottom: 3mm; letter-spacing: 1px; }
        .recipient {
            font-size: 50px;
            color: #333;
            font-family: 'Brush Script MT', cursive;
            margin-bottom: 3mm;
            border-bottom: 3px solid #D4AF37;
            display: inline-block;
            padding: 0 50px 6px;
        }
        .description {
            font-size: 16px;
            color: #555;
            max-width: 650px;
            margin: 0 auto 3mm;
            line-height: 1.5;
            letter-spacing: 0.3px;
        }
        .seal-container { margin: 2mm 0; }
        .seal {
            width: 80px;
            height: 80px;
            border: 1px solid #D4AF37;
            border-radius: 50%;
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #D4AF37;
        }
        .seal-icon { font-size: 32px; }
        .seal-text { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; }
        .signatures {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding: 0 50mm;
            margin-top: 2mm;
        }
        .signature-block { text-align: center; min-width: 150px; }
        .signature-name {
            font-size: 20px;
            color: #333;
            font-family: 'Brush Script MT', cursive;
            font-style: italic;
            padding-bottom: 3px;
            border-bottom: 1px solid #333;
            margin-bottom: 4px;
        }
        .signature-label {
            font-size: 10px;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .footer-info {
            display: flex;
            justify-content: center;
            gap: 60mm;
            margin-top: 2mm;
        }
        .info-item { text-align: center; }
        .info-label { font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 2px; }
        .info-value { font-size: 12px; color: #666; margin-top: 2px; }
        .motto { font-size: 11px; color: #999; font-style: italic; margin-top: 2mm; letter-spacing: 1px; }
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
</html>`;

    // Version 5: COMPACT TIGHT - Maximized content area
    const version5 = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>V5 - Compact Tight</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: A4 landscape; margin: 0; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
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
            width: 283mm;
            height: 198mm;
            padding: 8mm 16mm;
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
            top: 5mm;
            left: 5mm;
            right: 5mm;
            bottom: 5mm;
            border: 2px solid #D4AF37;
        }
        .header {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            margin-bottom: 3mm;
        }
        .logo {
            width: 55px;
            height: 55px;
            background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #D4AF37;
            font-size: 26px;
            font-weight: bold;
        }
        .academy-name {
            font-size: 26px;
            color: #722F37;
            font-weight: bold;
            letter-spacing: 3px;
        }
        .content { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 1mm; }
        .diploma-program {
            font-size: 18px;
            color: #722F37;
            font-weight: bold;
            letter-spacing: 3px;
            text-transform: uppercase;
            padding-bottom: 1mm;
            border-bottom: 1px solid #D4AF37;
            display: inline-block;
        }
        .title {
            font-size: 42px;
            color: #722F37;
            font-weight: bold;
            font-family: 'Times New Roman', serif;
        }
        .subtitle { font-size: 15px; color: #666; }
        .recipient {
            font-size: 42px;
            color: #333;
            font-family: 'Brush Script MT', cursive;
            border-bottom: 3px solid #D4AF37;
            display: inline-block;
            padding: 0 30px 4px;
        }
        .description {
            font-size: 14px;
            color: #555;
            max-width: 540px;
            margin: 0 auto;
            line-height: 1.4;
        }
        .seal-container { margin: 1mm 0; }
        .seal {
            width: 70px;
            height: 70px;
            border: 1px solid #D4AF37;
            border-radius: 50%;
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #D4AF37;
        }
        .seal-icon { font-size: 28px; }
        .seal-text { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; }
        .signatures {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding: 0 30mm;
            margin-top: 1mm;
        }
        .signature-block { text-align: center; min-width: 130px; }
        .signature-name {
            font-size: 17px;
            color: #333;
            font-family: 'Brush Script MT', cursive;
            font-style: italic;
            padding-bottom: 2px;
            border-bottom: 1px solid #333;
            margin-bottom: 3px;
        }
        .signature-label {
            font-size: 8px;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 1.5px;
        }
        .footer-info {
            display: flex;
            justify-content: center;
            gap: 35mm;
            margin-top: 1mm;
        }
        .info-item { text-align: center; }
        .info-label { font-size: 8px; color: #999; text-transform: uppercase; letter-spacing: 1px; }
        .info-value { font-size: 10px; color: #666; margin-top: 1px; }
        .motto { font-size: 9px; color: #999; font-style: italic; margin-top: 1mm; }
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
</html>`;

    // Version 6: BALANCED ELEGANT - Better vertical spacing
    const version6 = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>V6 - Balanced Elegant</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: A4 landscape; margin: 0; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
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
            padding: 12mm 22mm;
            background: linear-gradient(135deg, #fdfbf7 0%, #fff9f0 100%);
            border: 4px solid #722F37;
            position: relative;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .certificate::before {
            content: '';
            position: absolute;
            top: 7mm;
            left: 7mm;
            right: 7mm;
            bottom: 7mm;
            border: 2px solid #D4AF37;
        }
        .header {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 16px;
        }
        .logo {
            width: 62px;
            height: 62px;
            background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%);
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #D4AF37;
            font-size: 30px;
            font-weight: bold;
        }
        .academy-name {
            font-size: 30px;
            color: #722F37;
            font-weight: bold;
            letter-spacing: 3px;
        }
        .content { display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 3mm; }
        .diploma-program {
            font-size: 21px;
            color: #722F37;
            font-weight: bold;
            letter-spacing: 3px;
            text-transform: uppercase;
            padding-bottom: 2mm;
            border-bottom: 1px solid #D4AF37;
        }
        .title {
            font-size: 46px;
            color: #722F37;
            font-weight: bold;
            font-family: 'Times New Roman', serif;
        }
        .subtitle { font-size: 17px; color: #666; }
        .recipient {
            font-size: 46px;
            color: #333;
            font-family: 'Brush Script MT', cursive;
            border-bottom: 3px solid #D4AF37;
            padding: 0 35px 5px;
        }
        .description {
            font-size: 16px;
            color: #555;
            max-width: 560px;
            line-height: 1.5;
        }
        .seal-container { }
        .seal {
            width: 82px;
            height: 82px;
            border: 1px solid #D4AF37;
            border-radius: 50%;
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #D4AF37;
        }
        .seal-icon { font-size: 32px; }
        .seal-text { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }
        .signatures {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding: 0 38mm;
        }
        .signature-block { text-align: center; min-width: 145px; }
        .signature-name {
            font-size: 19px;
            color: #333;
            font-family: 'Brush Script MT', cursive;
            font-style: italic;
            padding-bottom: 3px;
            border-bottom: 1px solid #333;
            margin-bottom: 4px;
        }
        .signature-label {
            font-size: 9px;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 1.5px;
        }
        .footer-info {
            display: flex;
            justify-content: center;
            gap: 45mm;
        }
        .info-item { text-align: center; }
        .info-label { font-size: 9px; color: #999; text-transform: uppercase; letter-spacing: 1px; }
        .info-value { font-size: 11px; color: #666; margin-top: 2px; }
        .motto { font-size: 10px; color: #999; font-style: italic; letter-spacing: 0.5px; }
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
</html>`;

    // Version 7: CENTERED SEAL - Seal between signatures
    const version7 = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>V7 - Centered Seal Layout</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: A4 landscape; margin: 0; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
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
            padding: 12mm 20mm;
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
            top: 7mm;
            left: 7mm;
            right: 7mm;
            bottom: 7mm;
            border: 2px solid #D4AF37;
        }
        .header {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 15px;
            margin-bottom: 5mm;
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
            letter-spacing: 3px;
        }
        .content { flex: 1; display: flex; flex-direction: column; justify-content: center; }
        .diploma-program {
            font-size: 20px;
            color: #722F37;
            font-weight: bold;
            letter-spacing: 3px;
            text-transform: uppercase;
            margin-bottom: 3mm;
            padding-bottom: 2mm;
            border-bottom: 1px solid #D4AF37;
            display: inline-block;
        }
        .title {
            font-size: 44px;
            color: #722F37;
            font-weight: bold;
            margin-bottom: 3mm;
            font-family: 'Times New Roman', serif;
        }
        .subtitle { font-size: 16px; color: #666; margin-bottom: 4mm; }
        .recipient {
            font-size: 44px;
            color: #333;
            font-family: 'Brush Script MT', cursive;
            margin-bottom: 4mm;
            border-bottom: 3px solid #D4AF37;
            display: inline-block;
            padding: 0 30px 6px;
        }
        .description {
            font-size: 15px;
            color: #555;
            max-width: 550px;
            margin: 0 auto 4mm;
            line-height: 1.5;
        }
        .bottom-section {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 30mm;
            margin-top: 3mm;
        }
        .signature-block { text-align: center; min-width: 140px; }
        .signature-name {
            font-size: 18px;
            color: #333;
            font-family: 'Brush Script MT', cursive;
            font-style: italic;
            padding-bottom: 3px;
            border-bottom: 1px solid #333;
            margin-bottom: 4px;
        }
        .signature-label {
            font-size: 9px;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 1.5px;
        }
        .seal {
            width: 90px;
            height: 90px;
            border: 1px solid #D4AF37;
            border-radius: 50%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #D4AF37;
        }
        .seal-icon { font-size: 34px; }
        .seal-text { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }
        .footer-info {
            display: flex;
            justify-content: center;
            gap: 40mm;
            margin-top: 3mm;
        }
        .info-item { text-align: center; }
        .info-label { font-size: 9px; color: #999; text-transform: uppercase; letter-spacing: 1px; }
        .info-value { font-size: 11px; color: #666; margin-top: 2px; }
        .motto { font-size: 10px; color: #999; font-style: italic; margin-top: 2mm; letter-spacing: 0.5px; }
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
        <div class="bottom-section">
            <div class="signature-block">
                <div class="signature-name">${formattedName}</div>
                <div class="signature-label">Student Signature</div>
            </div>
            <div class="seal">
                <div class="seal-icon">★</div>
                <div class="seal-text">Certified</div>
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
</html>`;

    // Version 8: PREMIUM BOLD - Bold emphasis throughout
    const version8 = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>V8 - Premium Bold</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: A4 landscape; margin: 0; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
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
            border: 5px solid #722F37;
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
            border: 3px solid #D4AF37;
        }
        .header {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 18px;
            margin-bottom: 4mm;
        }
        .logo {
            width: 68px;
            height: 68px;
            background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%);
            border-radius: 14px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #D4AF37;
            font-size: 32px;
            font-weight: bold;
        }
        .academy-name {
            font-size: 32px;
            color: #722F37;
            font-weight: bold;
            letter-spacing: 4px;
        }
        .content { flex: 1; display: flex; flex-direction: column; justify-content: center; }
        .diploma-program {
            font-size: 22px;
            color: #722F37;
            font-weight: bold;
            letter-spacing: 4px;
            text-transform: uppercase;
            margin-bottom: 2mm;
            padding-bottom: 2mm;
            border-bottom: 2px solid #D4AF37;
            display: inline-block;
        }
        .title {
            font-size: 48px;
            color: #722F37;
            font-weight: bold;
            margin-bottom: 2mm;
            font-family: 'Times New Roman', serif;
        }
        .subtitle { font-size: 18px; color: #555; margin-bottom: 3mm; font-weight: 500; }
        .recipient {
            font-size: 48px;
            color: #222;
            font-family: 'Brush Script MT', cursive;
            margin-bottom: 3mm;
            border-bottom: 4px solid #D4AF37;
            display: inline-block;
            padding: 0 35px 6px;
        }
        .description {
            font-size: 16px;
            color: #444;
            max-width: 570px;
            margin: 0 auto 3mm;
            line-height: 1.5;
            font-weight: 500;
        }
        .seal-container { margin: 2mm 0; }
        .seal {
            width: 85px;
            height: 85px;
            border: 2px solid #D4AF37;
            border-radius: 50%;
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #D4AF37;
        }
        .seal-icon { font-size: 32px; }
        .seal-text { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; }
        .signatures {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding: 0 38mm;
            margin-top: 2mm;
        }
        .signature-block { text-align: center; min-width: 150px; }
        .signature-name {
            font-size: 20px;
            color: #222;
            font-family: 'Brush Script MT', cursive;
            font-style: italic;
            padding-bottom: 3px;
            border-bottom: 2px solid #333;
            margin-bottom: 4px;
        }
        .signature-label {
            font-size: 10px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 2px;
            font-weight: bold;
        }
        .footer-info {
            display: flex;
            justify-content: center;
            gap: 45mm;
            margin-top: 2mm;
        }
        .info-item { text-align: center; }
        .info-label { font-size: 10px; color: #888; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; }
        .info-value { font-size: 12px; color: #555; margin-top: 2px; font-weight: 500; }
        .motto { font-size: 11px; color: #888; font-style: italic; margin-top: 2mm; letter-spacing: 0.5px; }
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
</html>`;

    // Version 9: AIRY SPACIOUS - More breathing room
    const version9 = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>V9 - Airy Spacious</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: A4 landscape; margin: 0; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
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
            width: 278mm;
            height: 192mm;
            padding: 15mm 24mm;
            background: linear-gradient(135deg, #fdfbf7 0%, #fff9f0 100%);
            border: 3px solid #722F37;
            position: relative;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
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
        }
        .logo {
            width: 58px;
            height: 58px;
            background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #D4AF37;
            font-size: 27px;
            font-weight: bold;
        }
        .academy-name {
            font-size: 27px;
            color: #722F37;
            font-weight: bold;
            letter-spacing: 3px;
        }
        .content { display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 4mm; }
        .diploma-program {
            font-size: 19px;
            color: #722F37;
            font-weight: bold;
            letter-spacing: 3px;
            text-transform: uppercase;
            padding-bottom: 2mm;
            border-bottom: 1px solid #D4AF37;
        }
        .title {
            font-size: 42px;
            color: #722F37;
            font-weight: bold;
            font-family: 'Times New Roman', serif;
        }
        .subtitle { font-size: 16px; color: #666; }
        .recipient {
            font-size: 42px;
            color: #333;
            font-family: 'Brush Script MT', cursive;
            border-bottom: 3px solid #D4AF37;
            padding: 0 32px 5px;
        }
        .description {
            font-size: 15px;
            color: #555;
            max-width: 530px;
            line-height: 1.6;
        }
        .seal-container { }
        .seal {
            width: 78px;
            height: 78px;
            border: 1px solid #D4AF37;
            border-radius: 50%;
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #D4AF37;
        }
        .seal-icon { font-size: 30px; }
        .seal-text { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }
        .signatures {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding: 0 40mm;
        }
        .signature-block { text-align: center; min-width: 140px; }
        .signature-name {
            font-size: 18px;
            color: #333;
            font-family: 'Brush Script MT', cursive;
            font-style: italic;
            padding-bottom: 3px;
            border-bottom: 1px solid #333;
            margin-bottom: 4px;
        }
        .signature-label {
            font-size: 9px;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 1.5px;
        }
        .footer-info {
            display: flex;
            justify-content: center;
            gap: 45mm;
        }
        .info-item { text-align: center; }
        .info-label { font-size: 9px; color: #999; text-transform: uppercase; letter-spacing: 1px; }
        .info-value { font-size: 11px; color: #666; margin-top: 2px; }
        .motto { font-size: 10px; color: #999; font-style: italic; letter-spacing: 0.5px; }
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
</html>`;

    // Version 10: MAXIMUM - Largest possible proportions
    const version10 = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>V10 - Maximum Size</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        @page { size: A4 landscape; margin: 0; }
        @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
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
            width: 287mm;
            height: 200mm;
            padding: 6mm 12mm;
            background: linear-gradient(135deg, #fdfbf7 0%, #fff9f0 100%);
            border: 5px solid #722F37;
            position: relative;
            text-align: center;
            display: flex;
            flex-direction: column;
        }
        .certificate::before {
            content: '';
            position: absolute;
            top: 4mm;
            left: 4mm;
            right: 4mm;
            bottom: 4mm;
            border: 2px solid #D4AF37;
        }
        .header {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 22px;
            margin-bottom: 2mm;
        }
        .logo {
            width: 80px;
            height: 80px;
            background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%);
            border-radius: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #D4AF37;
            font-size: 40px;
            font-weight: bold;
        }
        .academy-name {
            font-size: 40px;
            color: #722F37;
            font-weight: bold;
            letter-spacing: 5px;
        }
        .content { flex: 1; display: flex; flex-direction: column; justify-content: center; }
        .diploma-program {
            font-size: 28px;
            color: #722F37;
            font-weight: bold;
            letter-spacing: 5px;
            text-transform: uppercase;
            margin-bottom: 1mm;
            padding-bottom: 2mm;
            border-bottom: 2px solid #D4AF37;
            display: inline-block;
        }
        .title {
            font-size: 62px;
            color: #722F37;
            font-weight: bold;
            margin-bottom: 1mm;
            font-family: 'Times New Roman', serif;
        }
        .subtitle { font-size: 22px; color: #666; margin-bottom: 2mm; }
        .recipient {
            font-size: 62px;
            color: #333;
            font-family: 'Brush Script MT', cursive;
            margin-bottom: 2mm;
            border-bottom: 4px solid #D4AF37;
            display: inline-block;
            padding: 0 45px 6px;
        }
        .description {
            font-size: 20px;
            color: #555;
            max-width: 680px;
            margin: 0 auto 2mm;
            line-height: 1.4;
        }
        .seal-container { margin: 1mm 0; }
        .seal {
            width: 95px;
            height: 95px;
            border: 2px solid #D4AF37;
            border-radius: 50%;
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #D4AF37;
        }
        .seal-icon { font-size: 38px; }
        .seal-text { font-size: 12px; text-transform: uppercase; letter-spacing: 2px; }
        .signatures {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            padding: 0 50mm;
            margin-top: 1mm;
        }
        .signature-block { text-align: center; min-width: 180px; }
        .signature-name {
            font-size: 26px;
            color: #333;
            font-family: 'Brush Script MT', cursive;
            font-style: italic;
            padding-bottom: 4px;
            border-bottom: 2px solid #333;
            margin-bottom: 5px;
        }
        .signature-label {
            font-size: 12px;
            color: #888;
            text-transform: uppercase;
            letter-spacing: 2px;
        }
        .footer-info {
            display: flex;
            justify-content: center;
            gap: 60mm;
            margin-top: 1mm;
        }
        .info-item { text-align: center; }
        .info-label { font-size: 12px; color: #999; text-transform: uppercase; letter-spacing: 1px; }
        .info-value { font-size: 15px; color: #666; margin-top: 2px; }
        .motto { font-size: 13px; color: #999; font-style: italic; margin-top: 1mm; letter-spacing: 1px; }
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
</html>`;

    const versions = [version1, version2, version3, version4, version5, version6, version7, version8, version9, version10];

    const versionNames = [
        "Current",
        "20% Bigger",
        "Extra Large",
        "Wider",
        "Compact",
        "Balanced",
        "Seal Center",
        "Bold",
        "Airy",
        "Maximum"
    ];

    const openVersion = (versionNum: number) => {
        setSelectedVersion(versionNum);
        const htmlContent = versions[versionNum - 1];
        const printWindow = window.open("", "_blank", "width=1122,height=793");
        if (printWindow) {
            printWindow.document.write(htmlContent);
            printWindow.document.close();
            setTimeout(() => printWindow.print(), 500);
        }
    };

    return (
        <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Mini Diploma PDF Versions Test</h2>
            <p className="text-gray-600 mb-4">Click each button to preview and print that version. Compare in print preview.</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <Button
                        key={num}
                        onClick={() => openVersion(num)}
                        variant={selectedVersion === num ? "default" : "outline"}
                        className="h-auto py-3"
                    >
                        <div className="text-center">
                            <div className="font-bold">V{num}</div>
                            <div className="text-xs">{versionNames[num - 1]}</div>
                        </div>
                    </Button>
                ))}
            </div>
        </Card>
    );
}
