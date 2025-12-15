
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const user = await prisma.user.findUnique({
            where: { email: "at.seed019@gmail.com" }
        });

        const count = await prisma.user.count();

        return NextResponse.json({
            foundMainUser: !!user,
            user: user,
            totalUsers: count
        });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
