import { NextRequest, NextResponse } from "next/server";

const PDFBOLT_API_KEY = "d83d7165-f7ab-48ec-9828-98fdd4ff4f42";
const PDFBOLT_API_URL = "https://api.pdfbolt.com/v1/direct";

export async function POST(request: NextRequest) {
  try {
    const { studentName, moduleTitle, courseName, completedDate, certificateId, type = "module" } = await request.json();

    if (!studentName || !certificateId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Format the date
    const formattedDate = new Date(completedDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Capitalize name
    const formattedName = studentName
      .toLowerCase()
      .replace(/\b\w/g, (char: string) => char.toUpperCase());

    // Clean module title
    const cleanModuleTitle = moduleTitle?.replace(/^Module\s*\d+:\s*/i, "").trim() || "Certificate";

    // Generate the certificate HTML
    const htmlCode = generateCertificateHTML({
      studentName: formattedName,
      moduleTitle: cleanModuleTitle,
      courseName: courseName || "AccrediPro Academy",
      completedDate: formattedDate,
      certificateId,
      type,
    });

    // Convert HTML to base64 for PDFBolt
    const htmlBase64 = Buffer.from(htmlCode).toString("base64");

    // Call PDFBolt API
    const pdfResponse = await fetch(PDFBOLT_API_URL, {
      method: "POST",
      headers: {
        "API-KEY": PDFBOLT_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        html: htmlBase64,
        printBackground: true,
        waitUntil: "networkidle",
        landscape: true,
        format: "A4",
        margin: { top: 0, right: 0, bottom: 0, left: 0 },
      }),
    });

    if (!pdfResponse.ok) {
      const errorText = await pdfResponse.text();
      console.error("PDFBolt API error:", pdfResponse.status, errorText);
      // Return HTML for client-side fallback
      return NextResponse.json({ html: htmlCode, fallback: true, error: errorText });
    }

    // Return the PDF
    const pdfBuffer = await pdfResponse.arrayBuffer();

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${cleanModuleTitle.replace(/\s+/g, "-")}-Certificate.pdf"`,
      },
    });
  } catch (error) {
    console.error("Certificate PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate certificate PDF" },
      { status: 500 }
    );
  }
}

interface CertificateData {
  studentName: string;
  moduleTitle: string;
  courseName: string;
  completedDate: string;
  certificateId: string;
  type: string;
}

function generateCertificateHTML(data: CertificateData): string {
  const { studentName, moduleTitle, courseName, completedDate, certificateId } = data;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    @page { size: A4 landscape; margin: 0; }
    body {
      font-family: Georgia, 'Times New Roman', serif;
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
      pointer-events: none;
    }
    .header {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 18px;
      margin-bottom: 4mm;
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
      letter-spacing: 4px;
    }
    .content {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .course-name {
      font-size: 14px;
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
      font-size: 44px;
      color: #722F37;
      font-weight: bold;
      margin-bottom: 2mm;
      font-family: 'Times New Roman', serif;
    }
    .subtitle {
      font-size: 16px;
      color: #666;
      margin-bottom: 3mm;
    }
    .recipient {
      font-size: 44px;
      color: #333;
      font-family: 'Brush Script MT', cursive;
      margin-bottom: 3mm;
      border-bottom: 3px solid #D4AF37;
      display: inline-block;
      padding: 0 35px 6px;
    }
    .description {
      font-size: 15px;
      color: #555;
      max-width: 550px;
      margin: 0 auto 2mm;
      line-height: 1.5;
    }
    .module-title {
      font-size: 24px;
      color: #722F37;
      font-weight: bold;
      margin-bottom: 3mm;
    }
    .seal-container {
      margin: 2mm 0;
    }
    .seal {
      width: 70px;
      height: 70px;
      border: 2px solid #D4AF37;
      border-radius: 50%;
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #D4AF37;
    }
    .seal-icon { font-size: 28px; }
    .seal-text { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }
    .footer-info {
      display: flex;
      justify-content: center;
      gap: 50mm;
      margin-top: 2mm;
    }
    .info-item { text-align: center; }
    .info-label {
      font-size: 10px;
      color: #999;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .info-value {
      font-size: 12px;
      color: #666;
      margin-top: 2px;
    }
    .motto {
      font-size: 11px;
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
      <div class="course-name">${courseName}</div>
      <div class="title">Certificate of Completion</div>
      <div class="subtitle">This is to certify that</div>
      <div class="recipient">${studentName}</div>
      <p class="description">has successfully completed the module and demonstrated proficiency in</p>
      <div class="module-title">${moduleTitle}</div>
    </div>
    <div class="seal-container">
      <div class="seal">
        <div class="seal-icon">★</div>
        <div class="seal-text">Certified</div>
      </div>
    </div>
    <div class="footer-info">
      <div class="info-item">
        <div class="info-label">Date of Completion</div>
        <div class="info-value">${completedDate}</div>
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
}
