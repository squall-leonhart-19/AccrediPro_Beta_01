import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { promises as fs } from "fs";
import path from "path";

// Mapping of resource IDs to their paths and titles
const RESOURCE_MAP: Record<string, { path: string; title: string }> = {
    "scope-and-boundaries": {
        path: "/documents/asi/core/scope-and-boundaries-level-0.html",
        title: "Professional-Scope-Boundaries",
    },
    "practice-toolkit": {
        path: "/documents/asi/core/practice-toolkit-level-0.html",
        title: "Level-0-Practice-Toolkit",
    },
    "pathways-guide": {
        path: "/documents/asi/core/pathways-progression-guide.html",
        title: "ASI-Certification-Pathways-Guide",
    },
    "client-intake": {
        path: "/documents/asi/client-resources/client-intake-snapshot.html",
        title: "Client-Intake-Snapshot",
    },
    "clarity-map": {
        path: "/documents/asi/client-resources/client-clarity-map.html",
        title: "Client-Clarity-Map",
    },
    "support-circle": {
        path: "/documents/asi/client-resources/support-circle-builder.html",
        title: "Support-Circle-Builder",
    },
    "goals-translation": {
        path: "/documents/asi/client-resources/goals-translation-sheet.html",
        title: "Goals-Translation-Sheet",
    },
    "readiness-check": {
        path: "/documents/asi/client-resources/readiness-for-support-check.html",
        title: "Readiness-for-Support-Check",
    },
    "reflection-card": {
        path: "/documents/asi/client-resources/between-sessions-reflection.html",
        title: "Between-Sessions-Reflection-Card",
    },
};

/**
 * Resource PDF Download API - Dynamic route with filename in path
 * 
 * Safari ignores Content-Disposition headers, so we put the filename in the URL path.
 * This ensures ALL browsers use the correct filename.
 * 
 * Endpoint: GET /api/mini-diploma/resources/pdf/[resourceId]/[filename].pdf
 * Example: /api/mini-diploma/resources/pdf/scope-and-boundaries/Professional-Scope-Boundaries.pdf
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string[] }> }
) {
    try {
        // Security: Require authentication
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized - Please log in to download resources" },
                { status: 401 }
            );
        }

        const { slug } = await params;

        // slug should be [resourceId, filename.pdf]
        if (!slug || slug.length < 1) {
            return NextResponse.json(
                { error: "Missing resource ID" },
                { status: 400 }
            );
        }

        const resourceId = slug[0];
        const resource = RESOURCE_MAP[resourceId];

        if (!resource) {
            return NextResponse.json(
                { error: `Unknown resource: ${resourceId}` },
                { status: 404 }
            );
        }

        const publicDir = path.join(process.cwd(), "public");

        // Look for static PDF file
        const pdfPath = resource.path.replace(/\.html$/, ".pdf");
        const staticPdfPath = path.join(publicDir, pdfPath);

        let pdfBuffer: Buffer;
        const filename = `${resource.title}.pdf`;

        try {
            pdfBuffer = await fs.readFile(staticPdfPath);
            console.log(`[PDF] Serving static: ${resourceId} as "${filename}" (${pdfBuffer.length} bytes)`);
        } catch {
            // Static PDF not found — fallback to PDFBolt API
            console.log(`[PDF] Static not found, trying PDFBolt fallback: ${resourceId}`);

            const apiKey = process.env.PDFBOLT_API_KEY;
            if (!apiKey) {
                console.error(`[PDF] No PDFBOLT_API_KEY configured`);
                return NextResponse.json(
                    { error: "PDF not available. Please try again later." },
                    { status: 404 }
                );
            }

            try {
                const htmlPath = path.join(publicDir, resource.path);
                const htmlContent = await fs.readFile(htmlPath, "utf-8");
                const htmlBase64 = Buffer.from(htmlContent).toString("base64");

                const pdfResponse = await fetch("https://api.pdfbolt.com/v1/direct", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify({
                        html: htmlBase64,
                        format: "A4",
                        margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
                        printBackground: true,
                    }),
                });

                if (!pdfResponse.ok) {
                    console.error(`[PDF] PDFBolt error: ${pdfResponse.status} ${pdfResponse.statusText}`);
                    return NextResponse.json(
                        { error: "PDF generation failed. Please try again later." },
                        { status: 500 }
                    );
                }

                const arrayBuffer = await pdfResponse.arrayBuffer();
                pdfBuffer = Buffer.from(arrayBuffer);
                console.log(`[PDF] PDFBolt generated: ${resourceId} as "${filename}" (${pdfBuffer.length} bytes)`);
            } catch (boltError) {
                console.error(`[PDF] PDFBolt fallback failed:`, boltError);
                return NextResponse.json(
                    { error: "PDF not found. Please try again later." },
                    { status: 404 }
                );
            }
        }

        return new NextResponse(pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="${filename}"`,
                "Content-Length": pdfBuffer.length.toString(),
                "Cache-Control": "private, max-age=3600",
            },
        });
    } catch (error) {
        console.error("[PDF] Error:", error);
        return NextResponse.json(
            { error: "Failed to serve PDF" },
            { status: 500 }
        );
    }
}
