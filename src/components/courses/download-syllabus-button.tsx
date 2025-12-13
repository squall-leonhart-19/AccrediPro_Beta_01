"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function DownloadSyllabusButton() {
  return (
    <Button
      variant="outline"
      className="w-full mt-3 border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50"
      onClick={() => window.print()}
    >
      <Download className="w-4 h-4 mr-2" />
      Download Syllabus
    </Button>
  );
}
