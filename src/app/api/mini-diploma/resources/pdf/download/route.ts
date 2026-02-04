import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";

/**
 * Resource PDF Download API - GET endpoint for direct downloads
 * 
 * This GET route serves PDFs directly so browsers respect Content-Disposition header.
 * 
 * Endpoint: GET /api/mini-diploma/resources/pdf/download?path=/documents/asi/...&title=...
 */
export async function GET(request: NextRequest) {
    try {
        // Security: Require authentication
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized - Please log in to download resources" },
                { status: 401 }
            );
        }

        const searchParams = request.nextUrl.searchParams;
        const resourcePath = searchParams.get("path");
        const resourceTitle = searchParams.get("title");

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

        // Look for static PDF file (most reliable)
        const pdfPath = resourcePath.replace(/\.html$/, ".pdf");
        const staticPdfPath = path.join(publicDir, pdfPath);

        try {
            const pdfBuffer = await fs.readFile(staticPdfPath);
            console.log(`[PDF GET] Serving static PDF: ${pdfPath} as "${filename}"`);

            return new NextResponse(pdfBuffer, {
                headers: {
                    "Content-Type": "application/pdf",
                    "Content-Disposition": `attachment; filename="${filename}"`,
                    "Content-Length": pdfBuffer.length.toString(),
                    "Cache-Control": "private, max-age=3600",
                },
            });
        } catch {
            console.error(`[PDF GET] PDF not found: ${staticPdfPath}`);
            return NextResponse.json(
                { error: "PDF not found. Please try again later." },
                { status: 404 }
            );
        }
    } catch (error) {
        console.error("[PDF GET] Error:", error);
        return NextResponse.json(
            { error: "Failed to serve PDF" },
            { status: 500 }
        );
    }
}
