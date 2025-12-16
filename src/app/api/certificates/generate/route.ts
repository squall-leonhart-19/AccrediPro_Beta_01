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

        // Load the new MASTER UNIVERSAL template
        const templatePath = join(process.cwd(), "public/images/certificate-template-master.png");
        const templateImage = await loadImage(templatePath);

        // Create canvas with template dimensions (2000x1545)
        const canvas = createCanvas(templateImage.width, templateImage.height);
        const ctx = canvas.getContext("2d");

        // Draw the template
        ctx.drawImage(templateImage, 0, 0);

        // Helper: Capitalize first letter of each word
        const toProperCase = (str: string) =>
            str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

        const formattedName = toProperCase(studentName);

        // ===== 1. COURSE TITLE - Position: 1000, 910 (Auto-scale for long titles) =====
        if (courseTitle) {
            ctx.fillStyle = "#FFFFFF"; // WHITE text
            ctx.textAlign = "center";

            // Auto-scale: Start with 52px, reduce if text is too wide (max 1600px)
            const maxWidth = 1600;
            let fontSize = 52;
            const titleText = courseTitle.toUpperCase();

            ctx.font = `bold ${fontSize}px Georgia`;
            let textWidth = ctx.measureText(titleText).width;

            // Reduce font size until it fits
            while (textWidth > maxWidth && fontSize > 28) {
                fontSize -= 2;
                ctx.font = `bold ${fontSize}px Georgia`;
                textWidth = ctx.measureText(titleText).width;
            }

            ctx.fillText(titleText, 1000, 910);
        }

        // ===== 2. STUDENT NAME (Center) - Position: 1000, 750 =====
        ctx.fillStyle = "#FFFFFF"; // WHITE text
        ctx.font = "italic 64px Georgia";
        ctx.textAlign = "center";
        ctx.fillText(formattedName, 1000, 750);

        // ===== 3. CERTIFICATE ID - Position: 685, 1280 =====
        ctx.fillStyle = "#FFFFFF"; // WHITE text
        ctx.font = "22px Georgia"; // Elegant serif
        ctx.textAlign = "center";
        ctx.fillText(certificateId, 685, 1280);

        // ===== 4. DATE - Position: 1378, 1283 =====
        ctx.font = "22px Georgia"; // Elegant serif
        ctx.textAlign = "center";
        ctx.fillText(date, 1378, 1283);

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
