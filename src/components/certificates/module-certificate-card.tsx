"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Download, Share2, Award, Loader2, Eye, Calendar, Hash } from "lucide-react";
import { toast } from "sonner";
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
    const toastId = toast.loading("Generating certificate PDF...");

    try {
      // 1. Try Server-Side API (PDFBolt)
      const response = await fetch("/api/certificates/pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentName,
          moduleTitle,
          courseName,
          completedDate,
          certificateId,
          type: "module",
        }),
      });

      const contentType = response.headers.get("content-type");

      if (response.ok && contentType?.includes("application/pdf")) {
        // Success - Download PDF
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${cleanModuleTitle.replace(/\s+/g, "-")}-Certificate.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        toast.dismiss(toastId);
        toast.success("Certificate downloaded successfully!");
      } else {
        // Fallback to Client-Side if API fails or returns fallback instructions
        console.warn("Server-side PDF generation failed or requested fallback, switching to client-side.");
        await generatePDFClientSide(generateCertificateHTML());
        toast.dismiss(toastId);
        toast.success("Certificate downloaded successfully!");
      }

    } catch (error) {
      console.error("PDF download failed (Server-Side), trying fallback:", error);
      // Try fallback one last time if fetch failed completely
      try {
        await generatePDFClientSide(generateCertificateHTML());
        toast.dismiss(toastId);
        toast.success("Certificate downloaded successfully! (Fallback)");
      } catch (fallbackError) {
        toast.dismiss(toastId);
        toast.error(`Failed to generate PDF: ${fallbackError instanceof Error ? fallbackError.message : "Unknown error"}`);
      }
    } finally {
      // Cleanup fallback container if exists (handled by generatePDFClientSide logic usually, but safe to check)
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

    // Create an iframe to isolate the rendering from global app styles (Tailwind v4 uses oklch which crashes html2canvas)
    const iframe = document.createElement("iframe");
    iframe.id = "pdf-certificate-container";
    iframe.style.cssText = `
      position: fixed;
      left: 0;
      top: 0;
      width: 1122px;
      height: 793px;
      z-index: -9999;
      border: none;
    `;
    document.body.appendChild(iframe);

    try {
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) {
        throw new Error("Could not create iframe document");
      }

      // Write content into the iframe - PRISTINE environment, no global CSS
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { margin: 0; padding: 0; background-color: #fdfbf7; }
            </style>
          </head>
          <body>
            ${htmlContent}
          </body>
        </html>
      `);
      doc.close();

      // Wait for font rendering / layout
      await new Promise(resolve => setTimeout(resolve, 1000));

      const certificateElement = doc.querySelector(".certificate") as HTMLElement;
      if (!certificateElement) {
        throw new Error("Certificate element not found in iframe");
      }

      const canvas = await html2canvas(certificateElement, {
        scale: 2,
        backgroundColor: "#fdfbf7",
        width: 1122,
        height: 793,
        logging: false,
        window: doc.defaultView,
      } as any);

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const imgData = canvas.toDataURL("image/png", 1.0);
      pdf.addImage(imgData, "PNG", 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());

      pdf.save(`${cleanModuleTitle.replace(/\s+/g, "-")}-Certificate.pdf`);

      // Cleanup on success
      if (document.body.contains(iframe)) {
        document.body.removeChild(iframe);
      }
    } catch (e) {
      console.error("IFrame generation failed:", e);
      // Cleanup is handled by handleDownloadPDF finally block if checks ID,
      // but we should throw to let the toast know
      throw e;
    }
  };

  const generateCertificateHTML = () => {
    return `
      <div class="certificate" style="width:1122px;height:793px;background:#1a1a1a;border:10px solid #C9A227;position:relative;font-family:Georgia,serif;box-sizing:border-box;">
        <div style="position:absolute;top:20px;left:20px;right:20px;bottom:20px;border:2px solid #C9A22755;box-sizing:border-box;"></div>
        <div style="padding:45px 80px;text-align:center;color:#fff;height:100%;box-sizing:border-box;">
          <div style="display:flex;align-items:center;justify-content:center;gap:20px;margin-bottom:15px;">
            <div style="width:65px;height:65px;background:#C9A227;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#1a1a1a;font-size:26px;font-weight:bold;">AP</div>
            <div style="font-size:30px;color:#C9A227;letter-spacing:7px;">ACCREDIPRO ACADEMY</div>
          </div>
          <div style="font-size:12px;color:#C9A227;letter-spacing:5px;margin-bottom:20px;text-transform:uppercase;">${courseName}</div>
          <div style="width:450px;height:1px;background:#C9A22788;margin:0 auto 25px;"></div>
          <div style="font-size:56px;color:#fff;font-style:italic;margin-bottom:12px;">Certificate of Completion</div>
          <div style="font-size:17px;color:#888;margin-bottom:22px;">This is to certify that</div>
          <div style="font-size:58px;font-family:cursive;color:#C9A227;margin-bottom:12px;">${formattedName}</div>
          <div style="width:400px;height:3px;background:#C9A227;margin:0 auto 22px;"></div>
          <div style="font-size:16px;color:#999;margin-bottom:15px;max-width:650px;margin-left:auto;margin-right:auto;line-height:1.5;">
            has successfully completed all course requirements and demonstrated exceptional proficiency in
          </div>
          <div style="font-size:32px;color:#fff;font-weight:bold;margin-bottom:25px;">${cleanModuleTitle}</div>
          <div style="display:flex;justify-content:center;align-items:center;gap:80px;">
            <div style="text-align:center;">
              <div style="font-size:11px;color:#555;letter-spacing:2px;margin-bottom:6px;">DATE ISSUED</div>
              <div style="font-size:17px;color:#ccc;">${fullFormattedDate}</div>
            </div>
            <div style="width:95px;height:95px;border:4px solid #C9A227;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;">
              <div style="font-size:32px;color:#C9A227;line-height:1;margin-top:-12px;">★</div>
              <div style="font-size:10px;color:#C9A227;letter-spacing:2px;margin-top:6px;">VERIFIED</div>
            </div>
            <div style="text-align:center;">
              <div style="font-size:11px;color:#555;letter-spacing:2px;margin-bottom:6px;">CERTIFICATE ID</div>
              <div style="font-size:17px;color:#ccc;font-family:monospace;">${certificateId}</div>
            </div>
          </div>
          <div style="font-size:12px;color:#555;font-style:italic;margin-top:20px;">Veritas Et Excellentia — Truth and Excellence</div>
        </div>
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
          <div className="w-24 h-16 rounded-lg flex-shrink-0 relative overflow-hidden" style={{ background: '#1a1a1a', border: '2px solid #C9A227' }}>
            <div className="absolute inset-1 rounded" style={{ border: '1px solid rgba(201,162,39,0.3)' }} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className="w-6 h-6 rounded flex items-center justify-center mb-0.5" style={{ background: '#C9A227' }}>
                <span className="text-[7px] font-bold" style={{ color: '#1a1a1a' }}>AP</span>
              </div>
              <span className="text-lg" style={{ color: '#C9A227' }}>★</span>
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

          {/* Full Certificate Preview - Luxury 3E Dark Gold Theme */}
          <div className="p-6 md:p-8 relative rounded-lg" style={{ background: '#1a1a1a', border: '4px solid #C9A227' }}>
            {/* Decorative Border */}
            <div className="absolute inset-4 rounded-lg pointer-events-none" style={{ border: '1px solid rgba(201,162,39,0.3)' }} />

            <div className="relative text-center">
              {/* Header */}
              <div className="flex items-center justify-center gap-3 mb-4 flex-wrap">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl flex items-center justify-center" style={{ background: '#C9A227' }}>
                  <span className="font-bold text-base md:text-lg" style={{ color: '#1a1a1a' }}>AP</span>
                </div>
                <h2 className="text-lg md:text-2xl font-bold tracking-widest" style={{ color: '#C9A227' }}>
                  ACCREDIPRO ACADEMY
                </h2>
              </div>

              {/* Course Name */}
              <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#C9A227' }}>
                {courseName}
              </p>

              <div className="w-48 md:w-64 h-px mx-auto mb-5" style={{ background: 'rgba(201,162,39,0.5)' }} />

              {/* Title */}
              <h1 className="text-2xl md:text-3xl font-serif italic text-white mb-3">
                Certificate of Completion
              </h1>
              <p className="text-gray-400 text-sm md:text-base mb-4">This is to certify that</p>

              {/* Recipient Name */}
              <p className="text-2xl md:text-3xl font-serif mb-3" style={{ color: '#C9A227' }}>
                {formattedName}
              </p>
              <div className="w-36 md:w-48 h-0.5 mx-auto mb-4" style={{ background: '#C9A227' }} />

              {/* Description */}
              <p className="text-gray-400 text-xs md:text-sm max-w-lg mx-auto mb-3">
                has successfully completed all course requirements and demonstrated exceptional proficiency in
              </p>

              {/* Module Name */}
              <h3 className="text-lg md:text-xl font-bold text-white mb-5">
                {cleanModuleTitle}
              </h3>

              {/* Seal */}
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full flex flex-col items-center justify-center mx-auto mb-4" style={{ border: '2px solid #C9A227' }}>
                <span className="text-xl md:text-2xl -mt-2" style={{ color: '#C9A227' }}>★</span>
                <span className="text-[7px] md:text-[8px] uppercase tracking-wider mt-1" style={{ color: '#C9A227' }}>VERIFIED</span>
              </div>

              {/* Footer Info */}
              <div className="flex items-center justify-center gap-12 text-xs">
                <div>
                  <p className="text-gray-500 uppercase tracking-wider mb-1">Date Issued</p>
                  <p className="text-gray-300">{fullFormattedDate}</p>
                </div>
                <div>
                  <p className="text-gray-500 uppercase tracking-wider mb-1">Certificate ID</p>
                  <p className="text-gray-300 font-mono">{certificateId}</p>
                </div>
              </div>

              {/* Motto */}
              <p className="text-xs text-gray-500 italic mt-4">
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
