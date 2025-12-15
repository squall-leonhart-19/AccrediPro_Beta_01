"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Download, Share2, Award } from "lucide-react";

interface MiniDiplomaProps {
  studentName: string;
  moduleTitle: string;
  courseName: string;
  score: number;
  completionDate: string;
  certificateNumber: string;
}

export function MiniDiploma({
  studentName,
  moduleTitle,
  courseName,
  score,
  completionDate,
  certificateNumber,
}: MiniDiplomaProps) {
  const diplomaRef = useRef<HTMLDivElement>(null);

  const handleDownload = async () => {
    if (!diplomaRef.current) return;

    // Use html2canvas to convert to image
    const html2canvas = (await import("html2canvas")).default;
    const canvas = await html2canvas(diplomaRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
    });

    const link = document.createElement("a");
    link.download = `${moduleTitle.replace(/\s+/g, "-")}-certificate.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="space-y-4">
      {/* Mini Diploma Card */}
      <div
        ref={diplomaRef}
        className="relative bg-white rounded-xl overflow-hidden shadow-xl"
        style={{ aspectRatio: "1.4/1", maxWidth: "600px" }}
      >
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-burgundy-50 via-white to-gold-50" />

        {/* Border decoration */}
        <div className="absolute inset-3 border-2 border-burgundy-200 rounded-lg" />
        <div className="absolute inset-4 border border-gold-300 rounded-lg" />

        {/* Corner decorations */}
        <div className="absolute top-6 left-6 w-8 h-8 border-t-2 border-l-2 border-burgundy-400" />
        <div className="absolute top-6 right-6 w-8 h-8 border-t-2 border-r-2 border-burgundy-400" />
        <div className="absolute bottom-6 left-6 w-8 h-8 border-b-2 border-l-2 border-burgundy-400" />
        <div className="absolute bottom-6 right-6 w-8 h-8 border-b-2 border-r-2 border-burgundy-400" />

        {/* Content */}
        <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
          {/* Logo/Brand */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gradient-to-br from-burgundy-600 to-burgundy-700 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-burgundy-700 tracking-wide">
              ACCREDIPRO
            </span>
          </div>

          {/* Title */}
          <h2 className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-2">
            Certificate of Completion
          </h2>

          {/* Module Title */}
          <h1 className="text-xl font-bold text-gray-900 mb-4 px-4 leading-tight">
            {moduleTitle}
          </h1>

          {/* Awarded to */}
          <p className="text-xs text-gray-500 mb-1">Awarded to</p>
          <p className="text-lg font-semibold text-burgundy-700 mb-3">
            {studentName}
          </p>

          {/* Score badge */}
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-full px-4 py-1 mb-4">
            <span className="text-sm font-semibold text-green-700">
              Score: {score}%
            </span>
          </div>

          {/* Course name */}
          <p className="text-xs text-gray-500 mb-1">Part of</p>
          <p className="text-sm font-medium text-gray-700 mb-4">{courseName}</p>

          {/* Footer */}
          <div className="flex items-center gap-4 text-xs text-gray-400">
            <span>{completionDate}</span>
            <span>•</span>
            <span>#{certificateNumber}</span>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3 max-w-[600px]">
        <Button
          onClick={handleDownload}
          className="flex-1 bg-burgundy-600 hover:bg-burgundy-700 text-white"
        >
          <Download className="w-4 h-4 mr-2" />
          Download
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50"
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share
        </Button>
      </div>
    </div>
  );
}

// Preview component for showing in modal after quiz pass
export function MiniDiplomaPreview({
  studentName,
  moduleTitle,
  courseName,
  score,
  onClose,
  onViewCertificates,
}: {
  studentName: string;
  moduleTitle: string;
  courseName: string;
  score: number;
  onClose: () => void;
  onViewCertificates: () => void;
}) {
  const completionDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-6 max-w-xl w-full animate-in zoom-in-95 duration-300">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Congratulations!
          </h2>
          <p className="text-gray-600">
            You&apos;ve earned a certificate for completing this module!
          </p>
        </div>

        <MiniDiploma
          studentName={studentName}
          moduleTitle={moduleTitle}
          courseName={courseName}
          score={score}
          completionDate={completionDate}
          certificateNumber="PREVIEW"
        />

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1"
          >
            Continue Learning
          </Button>
          <Button
            onClick={onViewCertificates}
            className="flex-1 bg-burgundy-600 hover:bg-burgundy-700"
          >
            View All Certificates
          </Button>
        </div>
      </div>
    </div>
  );
}
