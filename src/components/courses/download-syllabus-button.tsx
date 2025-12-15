"use client";

import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { useState } from "react";
import { jsPDF } from "jspdf";

interface Module {
  id: string;
  title: string;
  description: string | null;
  lessons: {
    id: string;
    title: string;
    description: string | null;
    videoDuration: number | null;
    lessonType: string;
  }[];
}

interface DownloadSyllabusButtonProps {
  courseTitle: string;
  courseDescription: string;
  modules: Module[];
  totalLessons: number;
  totalDuration: number | null;
  difficulty: string;
}

// Brand colors
const BURGUNDY = { r: 139, g: 35, b: 50 }; // #8B2332
const DARK_BURGUNDY = { r: 114, g: 28, b: 40 }; // #721C28
const LIGHT_GRAY = { r: 248, g: 248, b: 248 };
const MEDIUM_GRAY = { r: 100, g: 100, b: 100 };
const DARK_GRAY = { r: 50, g: 50, b: 50 };

export function DownloadSyllabusButton({
  courseTitle,
  courseDescription,
  modules,
  totalLessons,
  totalDuration,
  difficulty,
}: DownloadSyllabusButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "";
    const minutes = Math.floor(seconds / 60);
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    }
    return `${minutes}m`;
  };

  const formatTotalDuration = (minutes: number | null) => {
    if (!minutes) return "Self-paced";
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours} hours ${mins} minutes` : `${hours} hours`;
    }
    return `${minutes} minutes`;
  };

  const handleDownload = async () => {
    setIsGenerating(true);

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;
      let currentPage = 1;

      // Helper functions
      const addHeader = (pageNum: number) => {
        // Top burgundy bar
        doc.setFillColor(BURGUNDY.r, BURGUNDY.g, BURGUNDY.b);
        doc.rect(0, 0, pageWidth, 8, "F");

        // Header area
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 8, pageWidth, 25, "F");

        // Logo text (since we can't easily embed image)
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(BURGUNDY.r, BURGUNDY.g, BURGUNDY.b);
        doc.text("AccrediPro", margin, 22);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(MEDIUM_GRAY.r, MEDIUM_GRAY.g, MEDIUM_GRAY.b);
        doc.text("ACADEMY", margin + 50, 22);

        // Right side - document type
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(BURGUNDY.r, BURGUNDY.g, BURGUNDY.b);
        doc.text("COURSE SYLLABUS", pageWidth - margin, 22, { align: "right" });

        // Separator line
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.5);
        doc.line(margin, 33, pageWidth - margin, 33);
      };

      const addFooter = (pageNum: number, totalPages: number) => {
        const footerY = pageHeight - 15;

        // Footer separator
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.5);
        doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

        // Footer text
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(MEDIUM_GRAY.r, MEDIUM_GRAY.g, MEDIUM_GRAY.b);

        // Left: Website
        doc.text("www.accredipro.academy", margin, footerY);

        // Center: Page number
        doc.text(`Page ${pageNum} of ${totalPages}`, pageWidth / 2, footerY, { align: "center" });

        // Right: Confidential notice
        doc.text("9x Accredited Programs", pageWidth - margin, footerY, { align: "right" });

        // Bottom burgundy bar
        doc.setFillColor(BURGUNDY.r, BURGUNDY.g, BURGUNDY.b);
        doc.rect(0, pageHeight - 5, pageWidth, 5, "F");
      };

      const addWrappedText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number = 5): number => {
        const lines = doc.splitTextToSize(text, maxWidth);
        doc.text(lines, x, y);
        return y + lines.length * lineHeight;
      };

      const checkPageBreak = (yPos: number, requiredSpace: number = 30): number => {
        if (yPos + requiredSpace > pageHeight - 25) {
          doc.addPage();
          currentPage++;
          addHeader(currentPage);
          return 45; // Return new starting position after header
        }
        return yPos;
      };

      // ============ PAGE 1 - Cover Page ============
      addHeader(1);

      // Hero section with burgundy background
      doc.setFillColor(BURGUNDY.r, BURGUNDY.g, BURGUNDY.b);
      doc.roundedRect(margin, 45, contentWidth, 70, 4, 4, "F");

      // Course title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(24);
      doc.setTextColor(255, 255, 255);
      const titleLines = doc.splitTextToSize(courseTitle, contentWidth - 30);
      doc.text(titleLines, margin + 15, 70);

      // Subtitle
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.text("Professional Certification Program", margin + 15, titleLines.length > 1 ? 95 : 85);

      // Badge
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(pageWidth - margin - 65, 50, 50, 20, 3, 3, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(BURGUNDY.r, BURGUNDY.g, BURGUNDY.b);
      doc.text("ACCREDITED", pageWidth - margin - 40, 62, { align: "center" });

      // Course stats section
      let yPos = 130;

      // Stats boxes
      const statsBoxWidth = (contentWidth - 20) / 4;
      const stats = [
        { label: "Modules", value: `${modules.length}` },
        { label: "Lessons", value: `${totalLessons}` },
        { label: "Duration", value: formatTotalDuration(totalDuration) },
        { label: "Level", value: difficulty.charAt(0) + difficulty.slice(1).toLowerCase() },
      ];

      stats.forEach((stat, i) => {
        const boxX = margin + i * (statsBoxWidth + 5);
        doc.setFillColor(LIGHT_GRAY.r, LIGHT_GRAY.g, LIGHT_GRAY.b);
        doc.roundedRect(boxX, yPos, statsBoxWidth, 35, 3, 3, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        doc.setTextColor(BURGUNDY.r, BURGUNDY.g, BURGUNDY.b);
        doc.text(stat.value, boxX + statsBoxWidth / 2, yPos + 15, { align: "center" });

        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);
        doc.setTextColor(MEDIUM_GRAY.r, MEDIUM_GRAY.g, MEDIUM_GRAY.b);
        doc.text(stat.label, boxX + statsBoxWidth / 2, yPos + 27, { align: "center" });
      });

      yPos = 180;

      // Course Overview Section
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(BURGUNDY.r, BURGUNDY.g, BURGUNDY.b);
      doc.text("Course Overview", margin, yPos);

      yPos += 10;

      // Description
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(DARK_GRAY.r, DARK_GRAY.g, DARK_GRAY.b);
      const cleanDescription = courseDescription.replace(/<[^>]*>/g, '').replace(/\n\n+/g, '\n').trim();
      yPos = addWrappedText(cleanDescription, margin, yPos, contentWidth, 5);

      // ============ CURRICULUM PAGES ============
      doc.addPage();
      currentPage = 2;
      addHeader(2);
      yPos = 45;

      // Curriculum header
      doc.setFillColor(BURGUNDY.r, BURGUNDY.g, BURGUNDY.b);
      doc.roundedRect(margin, yPos, contentWidth, 15, 3, 3, "F");
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.setTextColor(255, 255, 255);
      doc.text("Complete Curriculum", margin + 10, yPos + 10);
      yPos += 25;

      // Modules and lessons
      modules.forEach((module, moduleIndex) => {
        yPos = checkPageBreak(yPos, 40);

        // Module header
        doc.setFillColor(LIGHT_GRAY.r, LIGHT_GRAY.g, LIGHT_GRAY.b);
        doc.roundedRect(margin, yPos, contentWidth, 14, 2, 2, "F");

        // Module number badge
        doc.setFillColor(BURGUNDY.r, BURGUNDY.g, BURGUNDY.b);
        doc.circle(margin + 8, yPos + 7, 5, "F");
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9);
        doc.setTextColor(255, 255, 255);
        doc.text(`${moduleIndex + 1}`, margin + 8, yPos + 9, { align: "center" });

        // Module title
        doc.setFont("helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(DARK_GRAY.r, DARK_GRAY.g, DARK_GRAY.b);
        const moduleTitleTrunc = module.title.length > 60 ? module.title.substring(0, 60) + "..." : module.title;
        doc.text(moduleTitleTrunc, margin + 18, yPos + 9);

        // Lesson count
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(MEDIUM_GRAY.r, MEDIUM_GRAY.g, MEDIUM_GRAY.b);
        doc.text(`${module.lessons.length} lessons`, pageWidth - margin - 5, yPos + 9, { align: "right" });

        yPos += 18;

        // Module description
        if (module.description) {
          doc.setFont("helvetica", "italic");
          doc.setFontSize(9);
          doc.setTextColor(MEDIUM_GRAY.r, MEDIUM_GRAY.g, MEDIUM_GRAY.b);
          const descLines = doc.splitTextToSize(module.description, contentWidth - 20);
          if (descLines.length > 2) {
            doc.text(descLines.slice(0, 2), margin + 10, yPos);
            yPos += 10;
          } else {
            doc.text(descLines, margin + 10, yPos);
            yPos += descLines.length * 4 + 2;
          }
        }

        // Lessons
        module.lessons.forEach((lesson, lessonIndex) => {
          yPos = checkPageBreak(yPos, 10);

          // Lesson bullet
          doc.setFillColor(BURGUNDY.r, BURGUNDY.g, BURGUNDY.b);
          doc.circle(margin + 12, yPos - 1, 1.5, "F");

          // Lesson title
          doc.setFont("helvetica", "normal");
          doc.setFontSize(9);
          doc.setTextColor(DARK_GRAY.r, DARK_GRAY.g, DARK_GRAY.b);

          const lessonTitle = lesson.title.length > 70 ? lesson.title.substring(0, 70) + "..." : lesson.title;
          doc.text(lessonTitle, margin + 18, yPos);

          // Duration
          if (lesson.videoDuration) {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(MEDIUM_GRAY.r, MEDIUM_GRAY.g, MEDIUM_GRAY.b);
            doc.text(formatDuration(lesson.videoDuration), pageWidth - margin - 5, yPos, { align: "right" });
          }

          yPos += 6;
        });

        yPos += 8; // Space between modules
      });

      // ============ FINAL PAGE - About & CTA ============
      yPos = checkPageBreak(yPos, 80);

      // About AccrediPro section
      doc.setFillColor(LIGHT_GRAY.r, LIGHT_GRAY.g, LIGHT_GRAY.b);
      doc.roundedRect(margin, yPos, contentWidth, 50, 4, 4, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(BURGUNDY.r, BURGUNDY.g, BURGUNDY.b);
      doc.text("About AccrediPro Academy", margin + 10, yPos + 15);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.setTextColor(DARK_GRAY.r, DARK_GRAY.g, DARK_GRAY.b);
      const aboutText = "AccrediPro Academy offers 9x internationally accredited professional certification programs in functional medicine, integrative health, and wellness. Our programs are designed for healthcare professionals seeking to expand their expertise with evidence-based, practical knowledge.";
      addWrappedText(aboutText, margin + 10, yPos + 25, contentWidth - 20, 4);

      yPos += 60;

      // Contact/CTA section
      yPos = checkPageBreak(yPos, 40);

      doc.setFillColor(BURGUNDY.r, BURGUNDY.g, BURGUNDY.b);
      doc.roundedRect(margin, yPos, contentWidth, 35, 4, 4, "F");

      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      doc.setTextColor(255, 255, 255);
      doc.text("Ready to Start Your Journey?", margin + 10, yPos + 14);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("Visit www.accredipro.academy to enroll today", margin + 10, yPos + 24);

      doc.setFontSize(8);
      doc.text("Questions? Contact us at hello@accredipro.academy", margin + 10, yPos + 32);

      // Calculate total pages and add footers
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        addFooter(i, totalPages);
      }

      // Save the PDF
      const fileName = `${courseTitle.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase()}-syllabus.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate syllabus PDF. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant="outline"
      className="w-full mt-3 border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50"
      onClick={handleDownload}
      disabled={isGenerating}
    >
      {isGenerating ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : (
        <Download className="w-4 h-4 mr-2" />
      )}
      {isGenerating ? "Generating PDF..." : "Download Syllabus (PDF)"}
    </Button>
  );
}
