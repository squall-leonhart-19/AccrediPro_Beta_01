import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
/* import { cookies } from "next/headers"; // Not using cookies for now, client-side handling or diverse auth strategy */

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { firstName, email, phone, smsConsent, specialtySlug, source } = body;

        if (!email || !firstName) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // 1. Upsert User
        const user = await prisma.user.upsert({
            where: { email },
            update: {
                name: firstName,
                phoneNumber: phone,
            },
            create: {
                email,
                name: firstName,
                phoneNumber: phone,
                role: "USER", // Default role
            },
        });

        // 2. Add Tags (Mocking tag logic or relationship if needed)
        // For now, we assume a simple User model. In a real app, we'd add to a 'Tags' relation.
        // console.log(`Tagging user ${user.id} with: ${source}, ${specialtySlug}_lead`);

        // 3. Mock Session / Login
        // in a real app, we would generate a JWT or Session token here
        // const cookieStore = cookies();
        // cookieStore.set("auth-token", "mock-token-" + user.id); 

        return NextResponse.json({
            success: true,
            userId: user.id,
            redirect: `/${specialtySlug}-diploma/vip-offer`
        });

    } catch (error) {
        console.error("Lead Capture Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
