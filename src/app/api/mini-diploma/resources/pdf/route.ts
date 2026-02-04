import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";

const PDFBOLT_API_KEY = process.env.PDFBOLT_API_KEY || "";
const PDFBOLT_API_URL = "https://api.pdfbolt.com/v1/direct";

/**
 * Resource PDF Download API - Static-First Strategy
 * 
 * Priority:
 * 1. Serve pre-generated static PDF if it exists (fastest, most reliable)
 * 2. Fall back to PDFBolt API conversion if no static PDF
 * 
 * Endpoint: POST /api/mini-diploma/resources/pdf
 * 
 * Body: { resourcePath: string, resourceTitle: string }
 */
export async function POST(request: NextRequest) {
    try {
        // Security: Require authentication
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized - Please log in to download resources" },
                { status: 401 }
            );
        }

        const { resourcePath, resourceTitle } = await request.json();

        if (!resourcePath) {
            return NextResponse.json(
                { error: "Missing resource path" },
                { status: 400 }
            );
        }

        // Validate path - must be an ASI resource
        if (!resourcePath.startsWith("/documents/asi/")) {
            return NextResponse.json(
                { error: "Invalid resource path" },
                { status: 400 }
            );
        }

        // Generate clean filename from resource title
        const filename = resourceTitle
            ? `${resourceTitle.replace(/[^a-zA-Z0-9\s]/g, "").replace(/\s+/g, "-").trim()}.pdf`
            : `ASI-Resource.pdf`;

        const publicDir = path.join(process.cwd(), "public");

        // STRATEGY 1: Check for pre-generated static PDF first (most reliable)
        // Convert HTML path to PDF path: /documents/asi/core/file.html -> /documents/asi/core/file.pdf
        const pdfPath = resourcePath.replace(/\.html$/, ".pdf");
        const staticPdfPath = path.join(publicDir, pdfPath);

        try {
            const staticPdfBuffer = await fs.readFile(staticPdfPath);
            console.log(`[PDF API] Serving static PDF: ${pdfPath} (${staticPdfBuffer.length} bytes)`);

            return new NextResponse(staticPdfBuffer, {
                headers: {
                    "Content-Type": "application/pdf",
                    "Content-Disposition": `attachment; filename="${filename}"`,
                    "X-PDF-Source": "static",
                },
            });
        } catch {
            // Static PDF doesn't exist, continue to dynamic generation
            console.log(`[PDF API] No static PDF found at ${pdfPath}, falling back to PDFBolt`);
        }

        // STRATEGY 2: Generate PDF dynamically using PDFBolt
        const htmlPath = path.join(publicDir, resourcePath);

        let htmlContent: string;
        try {
            htmlContent = await fs.readFile(htmlPath, "utf-8");
        } catch {
            return NextResponse.json(
                { error: "Resource not found" },
                { status: 404 }
            );
        }

        // Fix relative image paths to absolute URLs for PDF rendering
        const baseUrl = process.env.NEXTAUTH_URL || "https://learn.accredipro.academy";
        htmlContent = htmlContent.replace(
            /src=["']\/(?!\/)/g,
            `src="${baseUrl}/`
        );

        if (!PDFBOLT_API_KEY) {
            console.error("[PDF API] PDFBOLT_API_KEY not configured");
            return NextResponse.json(
                { error: "PDF service not configured", fallback: true },
                { status: 500 }
            );
        }

        // Convert HTML to base64 for PDFBolt
        const htmlBase64 = Buffer.from(htmlContent).toString("base64");

        console.log(`[PDF API] Converting resource: ${resourcePath}`);
        console.log(`[PDF API] HTML size: ${htmlContent.length} bytes`);

        // Call PDFBolt API
        const pdfResponse = await fetch(PDFBOLT_API_URL, {
            method: "POST",
            headers: {
                "API-KEY": PDFBOLT_API_KEY,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                html: htmlBase64,
                printBackground: true,
                waitUntil: "networkidle",
                format: "A4",
                margin: { top: 0, right: 0, bottom: 0, left: 0 },
            }),
        });

        console.log(`[PDF API] PDFBolt response: ${pdfResponse.status}`);

        if (!pdfResponse.ok) {
            const errorText = await pdfResponse.text();
            console.error("[PDF API] PDFBolt error:", pdfResponse.status, errorText);
            return NextResponse.json(
                { error: "PDF generation failed", details: errorText, fallback: true },
                { status: 500 }
            );
        }

        // Return the PDF
        const pdfBuffer = await pdfResponse.arrayBuffer();
        console.log(`[PDF API] PDF generated: ${pdfBuffer.byteLength} bytes`);

        return new NextResponse(pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${filename}"`,
                "X-PDF-Source": "pdfbolt",
            },
        });
    } catch (error) {
        console.error("[PDF API] Resource PDF generation error:", error);
        return NextResponse.json(
            { error: "Failed to generate PDF" },
            { status: 500 }
        );
    }
}
