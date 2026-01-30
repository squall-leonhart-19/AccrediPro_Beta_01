import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

// Upload DFY intake photos to local storage
// In production, these would be uploaded to R2/S3/Blob
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const formData = await request.formData();
        const purchaseId = formData.get("purchaseId") as string;

        if (!purchaseId) {
            return NextResponse.json({ error: "Missing purchaseId" }, { status: 400 });
        }

        const urls: string[] = [];

        // Create upload directory
        const uploadDir = path.join(process.cwd(), "public", "uploads", "dfy", purchaseId);
        await mkdir(uploadDir, { recursive: true });

        // Process up to 2 photos
        for (let i = 0; i < 2; i++) {
            const photo = formData.get(`photo${i}`) as File | null;
            if (photo) {
                const bytes = await photo.arrayBuffer();
                const buffer = Buffer.from(bytes);

                const ext = photo.name.split('.').pop() || 'jpg';
                const filename = `photo-${i}-${Date.now()}.${ext}`;
                const filePath = path.join(uploadDir, filename);

                await writeFile(filePath, buffer);

                // Return public URL
                urls.push(`/uploads/dfy/${purchaseId}/${filename}`);
            }
        }

        return NextResponse.json({ urls });
    } catch (error) {
        console.error("[DFY Photo Upload] Error:", error);
        return NextResponse.json(
            { error: "Failed to upload photos" },
            { status: 500 }
        );
    }
}
