import { NextRequest, NextResponse } from "next/server";
import { createCanvas, loadImage } from "canvas";
import { join } from "path";

export async function GET(request: NextRequest) {
    try {
        // Load the new master template
        const templatePath = join(process.cwd(), "public/images/certificate-template-master.png");
        const templateImage = await loadImage(templatePath);

        // Create canvas with template dimensions
        const canvas = createCanvas(templateImage.width, templateImage.height);
        const ctx = canvas.getContext("2d");

        // Draw the template
        ctx.drawImage(templateImage, 0, 0);

        // Draw grid lines every 25 pixels for more precision
        ctx.strokeStyle = "rgba(255, 0, 0, 0.3)";
        ctx.lineWidth = 0.5;
        ctx.font = "bold 11px Arial";
        ctx.fillStyle = "red";

        // Vertical lines
        for (let x = 0; x <= canvas.width; x += 25) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            if (x % 50 === 0) {
                ctx.strokeStyle = "rgba(255, 0, 0, 0.6)";
                ctx.lineWidth = 1;
            } else {
                ctx.strokeStyle = "rgba(255, 0, 0, 0.3)";
                ctx.lineWidth = 0.5;
            }
            ctx.stroke();
            // Label every 50px
            if (x % 50 === 0) {
                ctx.fillText(x.toString(), x + 2, 12);
            }
        }

        // Horizontal lines
        for (let y = 0; y <= canvas.height; y += 25) {
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            if (y % 50 === 0) {
                ctx.strokeStyle = "rgba(255, 0, 0, 0.6)";
                ctx.lineWidth = 1;
            } else {
                ctx.strokeStyle = "rgba(255, 0, 0, 0.3)";
                ctx.lineWidth = 0.5;
            }
            ctx.stroke();
            // Label every 50px
            if (y % 50 === 0) {
                ctx.fillText(y.toString(), 2, y + 12);
            }
        }

        // Add dimension info
        ctx.font = "bold 14px Arial";
        ctx.fillStyle = "blue";
        ctx.fillText(`Image: ${canvas.width}x${canvas.height}px`, 10, canvas.height - 10);

        // Convert to PNG buffer
        const buffer = canvas.toBuffer("image/png");

        // Return as PNG image
        return new NextResponse(new Uint8Array(buffer), {
            headers: {
                "Content-Type": "image/png",
            },
        });
    } catch (error) {
        console.error("Grid overlay error:", error);
        return NextResponse.json(
            { error: "Failed to generate grid" },
            { status: 500 }
        );
    }
}
