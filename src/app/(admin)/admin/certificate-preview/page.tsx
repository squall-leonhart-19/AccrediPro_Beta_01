"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

const SAMPLE_DATA = {
  studentName: "Sarah Mitchell",
  courseName: "Certified Functional Medicine Practitioner",
  moduleTitle: "Functional Medicine Foundations",
  completedDate: "December 15, 2025",
  certificateId: "MD-MJ6HCPPI-BZ23",
};

// LUXURY 3A: Filled with Large Elements
const luxury3A = (data: typeof SAMPLE_DATA) => `
<div class="certificate" style="width:1122px;height:793px;background:#1a1a1a;border:10px solid #C9A227;position:relative;font-family:Georgia,serif;box-sizing:border-box;">
  <div style="position:absolute;top:20px;left:20px;right:20px;bottom:20px;border:2px solid #C9A22755;box-sizing:border-box;"></div>
  <div style="padding:50px 80px;text-align:center;color:#fff;height:100%;box-sizing:border-box;">
    <div style="display:flex;align-items:center;justify-content:center;gap:20px;margin-bottom:20px;">
      <div style="width:70px;height:70px;background:#C9A227;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#1a1a1a;font-size:28px;font-weight:bold;">AP</div>
      <div style="font-size:32px;color:#C9A227;letter-spacing:8px;">ACCREDIPRO ACADEMY</div>
    </div>
    <div style="font-size:14px;color:#C9A227;letter-spacing:6px;margin-bottom:25px;text-transform:uppercase;">${data.courseName}</div>
    <div style="width:500px;height:1px;background:#C9A227;margin:0 auto 30px;"></div>
    <div style="font-size:58px;color:#fff;font-style:italic;margin-bottom:15px;">Certificate of Completion</div>
    <div style="font-size:18px;color:#888;margin-bottom:25px;">This certificate is proudly presented to</div>
    <div style="font-size:60px;font-family:cursive;color:#C9A227;margin-bottom:15px;">${data.studentName}</div>
    <div style="width:400px;height:3px;background:#C9A227;margin:0 auto 25px;"></div>
    <div style="font-size:16px;color:#999;margin-bottom:15px;max-width:700px;margin-left:auto;margin-right:auto;line-height:1.6;">
      for successfully completing all requirements and demonstrating exceptional proficiency in
    </div>
    <div style="font-size:32px;color:#fff;font-weight:bold;margin-bottom:30px;">${data.moduleTitle}</div>
    <div style="display:flex;justify-content:center;align-items:center;gap:80px;">
      <div style="text-align:center;">
        <div style="font-size:11px;color:#666;letter-spacing:3px;margin-bottom:8px;">DATE ISSUED</div>
        <div style="font-size:18px;color:#ccc;border-bottom:2px solid #C9A227;padding-bottom:5px;">${data.completedDate}</div>
      </div>
      <div style="width:100px;height:100px;border:4px solid #C9A227;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;">
        <div style="font-size:40px;color:#C9A227;">★</div>
        <div style="font-size:10px;color:#C9A227;letter-spacing:2px;">VERIFIED</div>
      </div>
      <div style="text-align:center;">
        <div style="font-size:11px;color:#666;letter-spacing:3px;margin-bottom:8px;">CERTIFICATE ID</div>
        <div style="font-size:18px;color:#ccc;font-family:monospace;border-bottom:2px solid #C9A227;padding-bottom:5px;">${data.certificateId}</div>
      </div>
    </div>
    <div style="font-size:12px;color:#555;font-style:italic;margin-top:25px;">Veritas Et Excellentia — Truth and Excellence</div>
  </div>
</div>
`;

// LUXURY 3B: Professional with Accreditation Text
const luxury3B = (data: typeof SAMPLE_DATA) => `
<div class="certificate" style="width:1122px;height:793px;background:#1a1a1a;border:10px solid #C9A227;position:relative;font-family:Georgia,serif;box-sizing:border-box;">
  <div style="position:absolute;top:20px;left:20px;right:20px;bottom:20px;border:2px solid #C9A22755;box-sizing:border-box;"></div>
  <div style="padding:45px 70px;text-align:center;color:#fff;height:100%;box-sizing:border-box;">
    <div style="display:flex;align-items:center;justify-content:center;gap:18px;margin-bottom:15px;">
      <div style="width:65px;height:65px;background:#C9A227;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#1a1a1a;font-size:26px;font-weight:bold;">AP</div>
      <div style="font-size:30px;color:#C9A227;letter-spacing:7px;">ACCREDIPRO ACADEMY</div>
    </div>
    <div style="font-size:13px;color:#C9A227;letter-spacing:5px;margin-bottom:20px;text-transform:uppercase;">${data.courseName}</div>
    <div style="font-size:54px;color:#fff;font-style:italic;margin-bottom:12px;">Certificate of Completion</div>
    <div style="font-size:16px;color:#777;margin-bottom:20px;">This is to certify that</div>
    <div style="font-size:56px;font-family:cursive;color:#C9A227;margin-bottom:10px;">${data.studentName}</div>
    <div style="width:380px;height:2px;background:#C9A227;margin:0 auto 20px;"></div>
    <div style="font-size:15px;color:#888;margin-bottom:12px;max-width:650px;margin-left:auto;margin-right:auto;">
      has successfully completed the curriculum requirements and demonstrated mastery in
    </div>
    <div style="font-size:30px;color:#fff;font-weight:bold;margin-bottom:20px;">${data.moduleTitle}</div>
    <div style="font-size:13px;color:#666;margin-bottom:20px;max-width:600px;margin-left:auto;margin-right:auto;">
      This certification is recognized by the AccrediPro Standards Institute and meets all professional competency requirements.
    </div>
    <div style="display:flex;justify-content:center;align-items:center;gap:70px;">
      <div style="text-align:center;">
        <div style="font-size:10px;color:#555;letter-spacing:2px;margin-bottom:6px;">DATE ISSUED</div>
        <div style="font-size:16px;color:#bbb;">${data.completedDate}</div>
      </div>
      <div style="width:90px;height:90px;border:3px solid #C9A227;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;">
        <div style="font-size:34px;color:#C9A227;">★</div>
        <div style="font-size:9px;color:#C9A227;letter-spacing:2px;">VERIFIED</div>
      </div>
      <div style="text-align:center;">
        <div style="font-size:10px;color:#555;letter-spacing:2px;margin-bottom:6px;">CERTIFICATE ID</div>
        <div style="font-size:16px;color:#bbb;font-family:monospace;">${data.certificateId}</div>
      </div>
    </div>
    <div style="font-size:11px;color:#444;font-style:italic;margin-top:18px;">Veritas Et Excellentia — Truth and Excellence</div>
  </div>
</div>
`;

// LUXURY 3C: Maximum Impact with Signatures Area
const luxury3C = (data: typeof SAMPLE_DATA) => `
<div class="certificate" style="width:1122px;height:793px;background:#1a1a1a;border:10px solid #C9A227;position:relative;font-family:Georgia,serif;box-sizing:border-box;">
  <div style="position:absolute;top:20px;left:20px;right:20px;bottom:20px;border:2px solid #C9A22755;box-sizing:border-box;"></div>
  <div style="padding:40px 70px;text-align:center;color:#fff;height:100%;box-sizing:border-box;">
    <div style="display:flex;align-items:center;justify-content:center;gap:18px;margin-bottom:12px;">
      <div style="width:60px;height:60px;background:#C9A227;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#1a1a1a;font-size:24px;font-weight:bold;">AP</div>
      <div style="font-size:28px;color:#C9A227;letter-spacing:6px;">ACCREDIPRO ACADEMY</div>
    </div>
    <div style="font-size:12px;color:#C9A227;letter-spacing:5px;margin-bottom:18px;text-transform:uppercase;">${data.courseName}</div>
    <div style="font-size:50px;color:#fff;font-style:italic;margin-bottom:10px;">Certificate of Completion</div>
    <div style="font-size:15px;color:#777;margin-bottom:15px;">This certificate is awarded to</div>
    <div style="font-size:52px;font-family:cursive;color:#C9A227;margin-bottom:8px;">${data.studentName}</div>
    <div style="width:350px;height:2px;background:#C9A227;margin:0 auto 18px;"></div>
    <div style="font-size:14px;color:#888;margin-bottom:10px;">in recognition of successfully completing</div>
    <div style="font-size:28px;color:#fff;font-weight:bold;margin-bottom:18px;">${data.moduleTitle}</div>
    <div style="width:85px;height:85px;border:3px solid #C9A227;border-radius:50%;margin:0 auto 18px;display:flex;flex-direction:column;align-items:center;justify-content:center;">
      <div style="font-size:32px;color:#C9A227;">★</div>
      <div style="font-size:8px;color:#C9A227;letter-spacing:2px;">VERIFIED</div>
    </div>
    <div style="display:flex;justify-content:space-between;align-items:flex-end;max-width:700px;margin:0 auto;">
      <div style="text-align:center;flex:1;">
        <div style="width:150px;border-top:2px solid #C9A227;margin:0 auto;padding-top:8px;">
          <div style="font-size:14px;color:#ccc;font-family:cursive;">Sarah Johnson</div>
          <div style="font-size:10px;color:#666;">Program Director</div>
        </div>
      </div>
      <div style="text-align:center;flex:1;">
        <div style="font-size:10px;color:#555;letter-spacing:2px;margin-bottom:5px;">DATE ISSUED</div>
        <div style="font-size:15px;color:#bbb;">${data.completedDate}</div>
        <div style="font-size:10px;color:#555;letter-spacing:2px;margin:10px 0 5px;">CERTIFICATE ID</div>
        <div style="font-size:15px;color:#bbb;font-family:monospace;">${data.certificateId}</div>
      </div>
      <div style="text-align:center;flex:1;">
        <div style="width:150px;border-top:2px solid #C9A227;margin:0 auto;padding-top:8px;">
          <div style="font-size:14px;color:#ccc;font-family:cursive;">Dr. Michael Chen</div>
          <div style="font-size:10px;color:#666;">Chief Academic Officer</div>
        </div>
      </div>
    </div>
    <div style="font-size:10px;color:#444;font-style:italic;margin-top:15px;">Veritas Et Excellentia — Truth and Excellence</div>
  </div>
</div>
`;

// LUXURY 3D: Double Seal with Full Details
const luxury3D = (data: typeof SAMPLE_DATA) => `
<div class="certificate" style="width:1122px;height:793px;background:#1a1a1a;border:10px solid #C9A227;position:relative;font-family:Georgia,serif;box-sizing:border-box;">
  <div style="position:absolute;top:20px;left:20px;right:20px;bottom:20px;border:2px solid #C9A22755;box-sizing:border-box;"></div>
  <div style="padding:45px 80px;text-align:center;color:#fff;height:100%;box-sizing:border-box;">
    <div style="display:flex;align-items:center;justify-content:center;gap:20px;margin-bottom:18px;">
      <div style="width:70px;height:70px;background:#C9A227;border-radius:12px;display:flex;align-items:center;justify-content:center;color:#1a1a1a;font-size:28px;font-weight:bold;">AP</div>
      <div>
        <div style="font-size:30px;color:#C9A227;letter-spacing:7px;">ACCREDIPRO ACADEMY</div>
        <div style="font-size:11px;color:#888;letter-spacing:3px;margin-top:5px;">ACCREDITED BY THE ACCREDIPRO STANDARDS INSTITUTE</div>
      </div>
    </div>
    <div style="font-size:13px;color:#C9A227;letter-spacing:5px;margin-bottom:22px;text-transform:uppercase;">${data.courseName}</div>
    <div style="font-size:52px;color:#fff;font-style:italic;margin-bottom:12px;">Certificate of Completion</div>
    <div style="font-size:16px;color:#777;margin-bottom:18px;">This is to certify that</div>
    <div style="font-size:54px;font-family:cursive;color:#C9A227;margin-bottom:10px;">${data.studentName}</div>
    <div style="width:380px;height:2px;background:#C9A227;margin:0 auto 20px;"></div>
    <div style="font-size:15px;color:#888;margin-bottom:12px;">has demonstrated proficiency and successfully completed</div>
    <div style="font-size:30px;color:#fff;font-weight:bold;margin-bottom:25px;">${data.moduleTitle}</div>
    <div style="display:flex;justify-content:center;align-items:center;gap:100px;">
      <div style="width:80px;height:80px;border:3px solid #C9A227;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;">
        <div style="font-size:28px;color:#C9A227;">★</div>
        <div style="font-size:7px;color:#C9A227;letter-spacing:1px;">VERIFIED</div>
      </div>
      <div style="text-align:center;">
        <div style="font-size:10px;color:#555;letter-spacing:2px;margin-bottom:5px;">DATE ISSUED</div>
        <div style="font-size:16px;color:#bbb;margin-bottom:12px;">${data.completedDate}</div>
        <div style="font-size:10px;color:#555;letter-spacing:2px;margin-bottom:5px;">CERTIFICATE ID</div>
        <div style="font-size:16px;color:#bbb;font-family:monospace;">${data.certificateId}</div>
      </div>
      <div style="width:80px;height:80px;border:3px solid #C9A227;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;">
        <div style="font-size:16px;color:#C9A227;font-weight:bold;">ASI</div>
        <div style="font-size:6px;color:#C9A227;letter-spacing:1px;">ACCREDITED</div>
      </div>
    </div>
    <div style="font-size:11px;color:#444;font-style:italic;margin-top:20px;">Veritas Et Excellentia — Truth and Excellence</div>
  </div>
</div>
`;

// LUXURY 3E: Premium Filled (Best Balance)
const luxury3E = (data: typeof SAMPLE_DATA) => `
<div class="certificate" style="width:1122px;height:793px;background:#1a1a1a;border:10px solid #C9A227;position:relative;font-family:Georgia,serif;box-sizing:border-box;">
  <div style="position:absolute;top:20px;left:20px;right:20px;bottom:20px;border:2px solid #C9A22755;box-sizing:border-box;"></div>
  <div style="padding:45px 80px;text-align:center;color:#fff;height:100%;box-sizing:border-box;">
    <div style="display:flex;align-items:center;justify-content:center;gap:20px;margin-bottom:15px;">
      <div style="width:65px;height:65px;background:#C9A227;border-radius:10px;display:flex;align-items:center;justify-content:center;color:#1a1a1a;font-size:26px;font-weight:bold;">AP</div>
      <div style="font-size:30px;color:#C9A227;letter-spacing:7px;">ACCREDIPRO ACADEMY</div>
    </div>
    <div style="font-size:12px;color:#C9A227;letter-spacing:5px;margin-bottom:20px;text-transform:uppercase;">${data.courseName}</div>
    <div style="width:450px;height:1px;background:#C9A22788;margin:0 auto 25px;"></div>
    <div style="font-size:56px;color:#fff;font-style:italic;margin-bottom:12px;">Certificate of Completion</div>
    <div style="font-size:17px;color:#888;margin-bottom:22px;">This is to certify that</div>
    <div style="font-size:58px;font-family:cursive;color:#C9A227;margin-bottom:12px;">${data.studentName}</div>
    <div style="width:400px;height:3px;background:#C9A227;margin:0 auto 22px;"></div>
    <div style="font-size:16px;color:#999;margin-bottom:15px;max-width:650px;margin-left:auto;margin-right:auto;line-height:1.5;">
      has successfully completed all course requirements and demonstrated exceptional proficiency in
    </div>
    <div style="font-size:32px;color:#fff;font-weight:bold;margin-bottom:25px;">${data.moduleTitle}</div>
    <div style="display:flex;justify-content:center;align-items:center;gap:80px;">
      <div style="text-align:center;">
        <div style="font-size:11px;color:#555;letter-spacing:2px;margin-bottom:6px;">DATE ISSUED</div>
        <div style="font-size:17px;color:#ccc;">${data.completedDate}</div>
      </div>
      <div style="width:95px;height:95px;border:4px solid #C9A227;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;">
        <div style="font-size:32px;color:#C9A227;line-height:1;margin-top:-12px;">★</div>
        <div style="font-size:10px;color:#C9A227;letter-spacing:2px;margin-top:6px;">VERIFIED</div>
      </div>
      <div style="text-align:center;">
        <div style="font-size:11px;color:#555;letter-spacing:2px;margin-bottom:6px;">CERTIFICATE ID</div>
        <div style="font-size:17px;color:#ccc;font-family:monospace;">${data.certificateId}</div>
      </div>
    </div>
    <div style="font-size:12px;color:#555;font-style:italic;margin-top:20px;">Veritas Et Excellentia — Truth and Excellence</div>
  </div>
</div>
`;

const variants = [
  { name: "3A: Large Elements", fn: luxury3A, description: "60px name, 58px title, 100px seal, underlined dates" },
  { name: "3B: With Accreditation", fn: luxury3B, description: "Includes ASI recognition text, professional tone" },
  { name: "3C: With Signatures", fn: luxury3C, description: "Director & CAO signature lines at bottom" },
  { name: "3D: Double Seal", fn: luxury3D, description: "Verified seal + ASI accreditation seal, subtitle" },
  { name: "3E: Premium Filled", fn: luxury3E, description: "Best balance - 58px name, larger text, filled space" },
];

export default function CertificatePreviewPage() {
  const [selected, setSelected] = useState<number | null>(4);
  const [downloading, setDownloading] = useState<number | null>(null);

  const downloadPDF = async (index: number) => {
    setDownloading(index);
    try {
      const htmlContent = variants[index].fn(SAMPLE_DATA);
      const iframe = document.createElement("iframe");
      iframe.style.cssText = "position:fixed;left:0;top:0;width:1122px;height:793px;z-index:-9999;border:none;";
      document.body.appendChild(iframe);
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!doc) throw new Error("Could not access iframe document");
      doc.open();
      doc.write(`<!DOCTYPE html><html><head><style>*{margin:0;padding:0;box-sizing:border-box;}body{width:1122px;height:793px;}</style></head><body>${htmlContent}</body></html>`);
      doc.close();
      await new Promise(resolve => setTimeout(resolve, 500));
      const certificateElement = doc.querySelector(".certificate") as HTMLElement;
      if (!certificateElement) throw new Error("Certificate element not found");
      const canvas = await html2canvas(certificateElement, { scale: 2, width: 1122, height: 793, logging: false, backgroundColor: null } as any);
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const imgData = canvas.toDataURL("image/png", 1.0);
      pdf.addImage(imgData, "PNG", 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
      pdf.save(`Certificate-Luxury-${variants[index].name.split(":")[0]}.pdf`);
      document.body.removeChild(iframe);
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert(`Failed: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-2 text-white">Luxury Gold - Filled Variants</h1>
        <p className="text-center text-gray-400 mb-8">Bigger text, more content, better filled certificates</p>
        <div className="space-y-10">
          {variants.map((variant, index) => (
            <div key={index} className={`bg-gray-800 rounded-xl shadow-lg p-6 ${selected === index ? 'ring-4 ring-yellow-500' : ''}`}>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-white">{variant.name}</h2>
                  <p className="text-sm text-gray-400">{variant.description}</p>
                </div>
                <div className="flex gap-3">
                  <Button onClick={() => downloadPDF(index)} disabled={downloading !== null} variant="outline" className="gap-2 border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black">
                    {downloading === index ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating...</> : <><Download className="w-4 h-4" /> Download PDF</>}
                  </Button>
                  <Button onClick={() => setSelected(index)} className={selected === index ? "bg-yellow-500 text-black hover:bg-yellow-400" : "bg-gray-700 text-white hover:bg-gray-600"}>
                    {selected === index ? "✓ Selected" : "Select"}
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto border border-gray-700 rounded-lg">
                <div style={{ transform: "scale(0.55)", transformOrigin: "top left", width: "1122px", height: "436px" }} dangerouslySetInnerHTML={{ __html: variant.fn(SAMPLE_DATA) }} />
              </div>
            </div>
          ))}
        </div>
        {selected !== null && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-6 py-3 rounded-full shadow-lg font-bold">
            Selected: {variants[selected].name}
          </div>
        )}
      </div>
    </div>
  );
}
