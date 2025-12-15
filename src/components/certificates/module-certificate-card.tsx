"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Share2, Award, Loader2, Eye, Calendar, Hash } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ModuleCertificateCardProps {
  studentName: string;
  moduleTitle: string;
  courseName: string;
  completedDate: string;
  certificateId: string;
}

export function ModuleCertificateCard({
  studentName,
  moduleTitle,
  courseName,
  completedDate,
  certificateId,
}: ModuleCertificateCardProps) {
  const [downloading, setDownloading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const formattedDate = new Date(completedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const fullFormattedDate = new Date(completedDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Capitalize first letter of each word
  const capitalizeWords = (str: string) => {
    return str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formattedName = capitalizeWords(studentName);

  // Clean module title - remove "Module X:" prefix if present
  const cleanModuleTitle = moduleTitle.replace(/^Module\s*\d+:\s*/i, "").trim();

  const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      // Try server-side PDF generation first (uses Sejda API)
      const response = await fetch("/api/certificates/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentName,
          moduleTitle,
          courseName,
          completedDate,
          certificateId,
          type: "module",
        }),
      });

      if (response.ok) {
        const contentType = response.headers.get("content-type");

        if (contentType?.includes("application/pdf")) {
          // Server returned PDF directly
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = `${cleanModuleTitle.replace(/\s+/g, "-")}-Certificate.pdf`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          return;
        }

        // Fallback: server returned HTML for client-side rendering
        const data = await response.json();
        if (data.fallback && data.html) {
          await generatePDFClientSide(data.html);
          return;
        }
      }

      // If server failed, use client-side generation
      await generatePDFClientSide(generateCertificateHTML());

    } catch (error) {
      console.error("PDF download failed:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      alert(`Failed to generate PDF: ${errorMessage}. Please try again.`);
    } finally {
      const leftover = document.getElementById("pdf-certificate-container");
      if (leftover) {
        document.body.removeChild(leftover);
      }
      setDownloading(false);
    }
  };

  const generatePDFClientSide = async (htmlContent: string) => {
    const html2canvas = (await import("html2canvas")).default;
    const { jsPDF } = await import("jspdf");

    const container = document.createElement("div");
    container.id = "pdf-certificate-container";
    container.style.cssText = `
      position: absolute;
      left: -10000px;
      top: 0;
      width: 1122px;
      height: 793px;
      background-color: #fdfbf7;
      overflow: hidden;
    `;
    container.innerHTML = htmlContent;
    document.body.appendChild(container);

    await new Promise(resolve => setTimeout(resolve, 300));

    const certificateElement = container.querySelector(".certificate") as HTMLElement;
    if (!certificateElement) {
      document.body.removeChild(container);
      throw new Error("Certificate element not found");
    }

    const canvas = await html2canvas(certificateElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: "#fdfbf7",
      width: 1122,
      height: 793,
      logging: false,
    });

    document.body.removeChild(container);

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const imgData = canvas.toDataURL("image/png", 1.0);
    pdf.addImage(imgData, "PNG", 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());

    const pdfBlob = pdf.output("blob");
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${cleanModuleTitle.replace(/\s+/g, "-")}-Certificate.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateCertificateHTML = () => {
    return `
      <div class="certificate" style="
        width: 1122px;
        height: 793px;
        padding: 40px 70px;
        background: linear-gradient(135deg, #fdfbf7 0%, #fff9f0 100%);
        border: 4px solid #722F37;
        position: relative;
        text-align: center;
        display: flex;
        flex-direction: column;
        font-family: Georgia, serif;
        box-sizing: border-box;
      ">
        <div style="
          position: absolute;
          top: 24px;
          left: 24px;
          right: 24px;
          bottom: 24px;
          border: 2px solid #D4AF37;
          pointer-events: none;
        "></div>

        <div style="
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 18px;
          margin-bottom: 16px;
        ">
          <div style="
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
          ">AP</div>
          <div style="
            font-size: 28px;
            color: #722F37;
            font-weight: bold;
            letter-spacing: 4px;
          ">ACCREDIPRO ACADEMY</div>
        </div>

        <div style="flex: 1; display: flex; flex-direction: column; justify-content: center;">
          <div style="
            font-size: 14px;
            color: #722F37;
            font-weight: bold;
            letter-spacing: 4px;
            text-transform: uppercase;
            margin-bottom: 8px;
            padding-bottom: 8px;
            border-bottom: 1px solid #D4AF37;
            display: inline-block;
          ">${courseName}</div>

          <div style="
            font-size: 44px;
            color: #722F37;
            font-weight: bold;
            margin-bottom: 8px;
            font-family: 'Times New Roman', serif;
          ">Certificate of Completion</div>

          <div style="
            font-size: 16px;
            color: #666;
            margin-bottom: 12px;
          ">This is to certify that</div>

          <div style="
            font-size: 44px;
            color: #333;
            font-family: 'Brush Script MT', cursive;
            margin-bottom: 12px;
            border-bottom: 3px solid #D4AF37;
            display: inline-block;
            padding: 0 35px 6px;
          ">${formattedName}</div>

          <div style="
            font-size: 15px;
            color: #555;
            max-width: 600px;
            margin: 0 auto 12px;
            line-height: 1.5;
          ">has successfully completed the module and demonstrated proficiency in</div>

          <div style="
            font-size: 28px;
            color: #722F37;
            font-weight: bold;
            margin-bottom: 16px;
          ">${cleanModuleTitle}</div>
        </div>

        <div style="margin: 8px 0;">
          <div style="
            width: 70px;
            height: 70px;
            border: 2px solid #D4AF37;
            border-radius: 50%;
            display: inline-flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: #D4AF37;
          ">
            <div style="font-size: 28px;">★</div>
            <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 1px;">Certified</div>
          </div>
        </div>

        <div style="
          display: flex;
          justify-content: center;
          gap: 150px;
          margin-top: 8px;
        ">
          <div style="text-align: center;">
            <div style="font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Date</div>
            <div style="font-size: 12px; color: #666; margin-top: 2px;">${fullFormattedDate}</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 1px;">Certificate ID</div>
            <div style="font-size: 12px; color: #666; margin-top: 2px;">${certificateId}</div>
          </div>
        </div>

        <div style="
          font-size: 11px;
          color: #999;
          font-style: italic;
          margin-top: 8px;
          letter-spacing: 0.5px;
        ">Veritas Et Excellentia — Truth and Excellence</div>
      </div>
    `;
  };

  const handleShare = async () => {
    const shareUrl = `${window.location.origin}/verify/${certificateId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${cleanModuleTitle} Certificate`,
          text: `I completed the ${cleanModuleTitle} module in ${courseName} at AccrediPro Academy!`,
          url: shareUrl,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      await navigator.clipboard.writeText(shareUrl);
      alert("Share link copied to clipboard!");
    }
  };

  return (
    <>
      {/* Compact Card View */}
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <div className="flex items-center gap-4 p-4">
          {/* Mini Certificate Preview */}
          <div className="w-24 h-16 bg-gradient-to-br from-[#fdfbf7] to-[#fff9f0] rounded-lg border border-gold-300 flex-shrink-0 relative overflow-hidden">
            <div className="absolute inset-1 border border-gold-200/50 rounded" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-5 h-5 bg-burgundy-600 rounded flex items-center justify-center mb-0.5">
                <span className="text-gold-400 text-[6px] font-bold">AP</span>
              </div>
              <Award className="w-3 h-3 text-gold-500" />
            </div>
          </div>

          {/* Certificate Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">{cleanModuleTitle}</h3>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {formattedDate}
              </span>
              <span className="flex items-center gap-1">
                <Hash className="w-3 h-3" />
                {certificateId.slice(0, 12)}...
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPreview(true)}
              className="text-gray-600 hover:text-burgundy-600"
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="text-gray-600 hover:text-burgundy-600"
            >
              {downloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="text-gray-600 hover:text-burgundy-600"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Full Certificate Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-burgundy-600" />
              {cleanModuleTitle} Certificate
            </DialogTitle>
          </DialogHeader>

          {/* Full Certificate Preview */}
          <div className="bg-gradient-to-br from-[#fdfbf7] to-[#fff9f0] p-6 md:p-8 relative rounded-lg border border-gold-300">
            {/* Decorative Border */}
            <div className="absolute inset-3 border border-gold-400/50 rounded-lg pointer-events-none" />

            <div className="relative text-center">
              {/* Header */}
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-burgundy-600 to-burgundy-700 rounded-xl flex items-center justify-center">
                  <span className="text-gold-400 font-bold text-sm">AP</span>
                </div>
                <h2 className="text-xl font-bold text-burgundy-700 tracking-wider">
                  ACCREDIPRO ACADEMY
                </h2>
              </div>

              {/* Course Name Badge */}
              <Badge className="bg-burgundy-600 text-white mb-3">
                {courseName}
              </Badge>

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-burgundy-700 mb-2">
                Certificate of Completion
              </h1>
              <p className="text-gray-500 text-sm mb-3">This is to certify that</p>

              {/* Recipient Name */}
              <p className="text-2xl md:text-3xl font-serif text-gray-800 border-b-2 border-gold-400 inline-block px-6 pb-2 mb-3">
                {formattedName}
              </p>

              {/* Description */}
              <p className="text-gray-600 text-sm max-w-md mx-auto mb-2">
                has successfully completed the module and demonstrated proficiency in
              </p>

              {/* Module Name */}
              <h3 className="text-xl font-bold text-burgundy-700 mb-4">
                {cleanModuleTitle}
              </h3>

              {/* Seal */}
              <div className="w-14 h-14 border-2 border-gold-400 rounded-full flex flex-col items-center justify-center mx-auto mb-4">
                <Award className="w-5 h-5 text-gold-500" />
                <span className="text-[7px] text-gold-600 uppercase tracking-wider">Certified</span>
              </div>

              {/* Footer Info */}
              <div className="flex items-center justify-center gap-8 text-xs text-gray-500">
                <div>
                  <p className="text-gray-400 uppercase tracking-wider mb-0.5">Date</p>
                  <p className="text-gray-700">{fullFormattedDate}</p>
                </div>
                <div>
                  <p className="text-gray-400 uppercase tracking-wider mb-0.5">Certificate ID</p>
                  <p className="text-gray-700 font-mono">{certificateId}</p>
                </div>
              </div>

              {/* Motto */}
              <p className="text-xs text-gray-400 italic mt-4">
                Veritas Et Excellentia — Truth and Excellence
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-center pt-4">
            <Button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="gap-2 bg-burgundy-600 hover:bg-burgundy-700"
            >
              {downloading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Download className="w-4 h-4" />
              )}
              Download PDF
            </Button>

            <Button
              onClick={handleShare}
              variant="outline"
              className="gap-2"
            >
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
