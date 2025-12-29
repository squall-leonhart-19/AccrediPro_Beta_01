import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Trigger auto-reply check manually
export async function POST() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Call the check endpoint
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://learn.accredipro.academy";
        const res = await fetch(`${baseUrl}/api/chat/sales/auto-reply/check`);
        const data = await res.json();

        return NextResponse.json(data);
    } catch (error) {
        console.error("Failed to trigger auto-reply:", error);
        return NextResponse.json({ error: "Failed to trigger auto-reply" }, { status: 500 });
    }
}
