"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";

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

    const handleDownload = async () => {
        setDownloading(true);
        try {
            // Call the API to generate PDF using PDFBolt
            const response = await fetch("/api/certificates/pdf", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    studentName,
                    completedDate,
                    certificateId,
                    type: "mini-diploma",
                    diplomaTitle,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to generate PDF");
            }

            // Check if we got a PDF back
            const contentType = response.headers.get("content-type");
            if (contentType?.includes("application/pdf")) {
                // Download the PDF
                const blob = await response.blob();
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${diplomaTitle.replace(/\s+/g, "-")}-Certificate.pdf`;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);

                // Track certificate download
                try {
                    await fetch("/api/track/certificate-download", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            certificateId,
                            certificateType: "mini-diploma",
                            diplomaTitle,
                        }),
                    });
                } catch (trackError) {
                    // Don't block download if tracking fails
                    console.error("Failed to track download:", trackError);
                }
            } else {
                throw new Error("Unexpected response format");
            }
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
