import { NextRequest, NextResponse } from "next/server";
import { createCanvas, loadImage } from "canvas";
import { join } from "path";
import jsPDF from "jspdf";

export async function POST(request: NextRequest) {
    try {
        const { studentName, certificateId, date, courseTitle, format = "pdf" } = await request.json();

        if (!studentName || !certificateId || !date) {
            return NextResponse.json(
                { error: "Missing required fields: studentName, certificateId, date" },
                { status: 400 }
            );
        }

        // Load the blank template
        const templatePath = join(process.cwd(), "public/images/certificate-template-blank.png");
        const templateImage = await loadImage(templatePath);

        // Create canvas with template dimensions
        const canvas = createCanvas(templateImage.width, templateImage.height);
        const ctx = canvas.getContext("2d");

        // Draw the template
        ctx.drawImage(templateImage, 0, 0);

        // Configure text styling
        ctx.textAlign = "center";
        ctx.fillStyle = "#000000"; // Black

        // ===== 0. COURSE TITLE - 2 lines =====
        if (courseTitle) {
            ctx.fillStyle = "#000000"; // Black
            ctx.textAlign = "center";
            const words = courseTitle.toUpperCase().split(" ");
            const midPoint = Math.ceil(words.length / 2);
            const line1 = words.slice(0, midPoint).join(" ");
            const line2 = words.slice(midPoint).join(" ");
            const centerX = canvas.width / 2;
            // Line 1 - bigger font
            ctx.font = "bold 58px Arial";
            ctx.fillText(line1, centerX, 205);
            // Line 2 - normal font, 10px lower
            ctx.font = "bold 44px Arial";
            ctx.fillText(line2, centerX, 280);
        }

        // Helper: Capitalize first letter of each word
        const toProperCase = (str: string) =>
            str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

        const formattedName = toProperCase(studentName);

        // ===== 1. MAIN STUDENT NAME (Center) =====
        ctx.font = "italic 48px Georgia";
        ctx.textAlign = "center";
        ctx.fillText(formattedName, 500, 390);

        // ===== 2. STUDENT NAME SIGNATURE (Bottom left - cursive script) =====
        ctx.font = "italic 22px 'Brush Script MT', cursive";
        ctx.textAlign = "center";
        ctx.fillText(formattedName, 301, 615);

        // ===== 3. CERTIFICATE ID (Bottom left) =====
        ctx.font = "13px Arial";
        ctx.textAlign = "left";
        ctx.fillText(certificateId, 250, 680);

        // ===== 4. DATE (Bottom right) =====
        ctx.textAlign = "left";
        ctx.fillText(date, 805, 680);

        // Convert to PNG buffer
        const pngBuffer = canvas.toBuffer("image/png");

        if (format === "pdf") {
            // Generate PDF
            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "px",
                format: [canvas.width, canvas.height],
            });

            const imgData = canvas.toDataURL("image/png");
            pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

            const pdfBuffer = Buffer.from(pdf.output("arraybuffer"));

            return new NextResponse(new Uint8Array(pdfBuffer), {
                headers: {
                    "Content-Type": "application/pdf",
                    "Content-Disposition": `attachment; filename="Certificate-${certificateId}.pdf"`,
                },
            });
        }

        // Return as PNG image
        return new NextResponse(new Uint8Array(pngBuffer), {
            headers: {
                "Content-Type": "image/png",
                "Content-Disposition": `attachment; filename="Certificate-${certificateId}.png"`,
            },
        });
    } catch (error) {
        console.error("Certificate generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate certificate" },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    // Test endpoint
    const url = new URL(request.url);
    const studentName = url.searchParams.get("name") || "Test Student";
    const certificateId = url.searchParams.get("id") || "AP-FMCC-2025-TEST123";
    const date = url.searchParams.get("date") || new Date().toLocaleDateString("en-GB");
    const courseTitle = url.searchParams.get("course") || "Functional Medicine Coach Certification";
    const format = url.searchParams.get("format") || "pdf";

    const response = await POST(
        new NextRequest(request.url, {
            method: "POST",
            body: JSON.stringify({ studentName, certificateId, date, courseTitle, format }),
        })
    );

    return response;
}
