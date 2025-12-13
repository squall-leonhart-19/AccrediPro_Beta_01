"use client";

import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface TranscriptDownloadButtonProps {
  studentName: string;
  certificateTitle: string;
  certificateId: string;
  issuedDate: string;
  totalHours: number;
  skills: string[];
  instructor?: string;
  isMiniDiploma?: boolean;
}

export function TranscriptDownloadButton({
  studentName,
  certificateTitle,
  certificateId,
  issuedDate,
  totalHours,
  skills,
  instructor = "AccrediPro Academy",
  isMiniDiploma = false,
}: TranscriptDownloadButtonProps) {
  const handleDownload = () => {
    const formattedDate = new Date(issuedDate).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Different transcript for mini-diplomas vs full certifications
    const transcriptContent = isMiniDiploma
      ? `
================================================================================
                        LEARNING RECORD
                        AccrediPro Academy
================================================================================

--------------------------------------------------------------------------------

STUDENT INFORMATION
-------------------
Name:                   ${studentName}
Student ID:             AP-${certificateId.slice(-8).toUpperCase()}
Transcript Date:        ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}

--------------------------------------------------------------------------------

MINI DIPLOMA DETAILS
--------------------
Certificate Title:      ${certificateTitle}
Credential ID:          ${certificateId}
Issue Date:             ${formattedDate}
Status:                 COMPLETED
Total Study Hours:      ${totalHours} hours
Lead Instructor:        ${instructor}

--------------------------------------------------------------------------------

LEARNING OUTCOMES / TOPICS COVERED
----------------------------------
${skills.map((skill, i) => `  ${i + 1}. ${skill}`).join("\n")}

--------------------------------------------------------------------------------

ABOUT THIS CREDENTIAL
---------------------
This Mini Diploma represents completion of an introductory exploration course.
It demonstrates foundational knowledge in the subject area.

To become a certified practitioner and work with clients professionally,
we recommend completing the full certification program.

--------------------------------------------------------------------------------

NEXT STEPS
----------
Ready to advance your career? Unlock the full certification to:
  * Earn internationally accredited credentials
  * Practice with full professional legitimacy
  * Work with clients confidently
  * Access advanced training and mentorship

Visit your dashboard to explore certification options.

--------------------------------------------------------------------------------

                        AccrediPro Academy
                        Learning Record

Generated: ${new Date().toISOString()}
================================================================================
`
      : `
================================================================================
                        OFFICIAL ACADEMIC TRANSCRIPT
                            AccrediPro Academy
================================================================================

                        9x INTERNATIONALLY ACCREDITED

--------------------------------------------------------------------------------

STUDENT INFORMATION
-------------------
Name:                   ${studentName}
Student ID:             AP-${certificateId.slice(-8).toUpperCase()}
Transcript Date:        ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}

--------------------------------------------------------------------------------

CERTIFICATION DETAILS
---------------------
Certificate Title:      ${certificateTitle}
Credential ID:          ${certificateId}
Issue Date:             ${formattedDate}
Status:                 COMPLETED
Total Study Hours:      ${totalHours} hours
Lead Instructor:        ${instructor}

--------------------------------------------------------------------------------

LEARNING OUTCOMES / SKILLS ACQUIRED
------------------------------------
${skills.map((skill, i) => `  ${i + 1}. ${skill}`).join("\n")}

--------------------------------------------------------------------------------

ACCREDITATION INFORMATION
-------------------------
This certification is accredited by 9 international accreditation bodies:
  * CPD Certification Service (UK)
  * IPHM - International Practitioners of Holistic Medicine
  * CMA - Complementary Medical Association
  * AADP - American Association of Drugless Practitioners
  * And 5 additional recognized bodies

--------------------------------------------------------------------------------

VERIFICATION
------------
This transcript can be verified online at:
https://accredipro-certificate.com/verify/${certificateId}

--------------------------------------------------------------------------------

                        OFFICIAL DOCUMENT

This transcript is an official document of AccrediPro Academy.
Any unauthorized alteration or reproduction is strictly prohibited.

Generated: ${new Date().toISOString()}
================================================================================
`;

    // Create and download the file
    const blob = new Blob([transcriptContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `AccrediPro_${isMiniDiploma ? "MiniDiploma" : "Transcript"}_${studentName.replace(/\s+/g, "_")}_${certificateId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDownload}
      className="h-8 px-3 text-xs"
    >
      <FileText className="w-3 h-3 mr-1" />
      {isMiniDiploma ? "Learning Record" : "Transcript"}
    </Button>
  );
}
