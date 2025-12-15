
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const admins = await prisma.user.findMany({
            where: { role: "ADMIN" },
            select: { id: true, email: true, role: true, avatar: true }
        });

        const testUsers = await prisma.user.findMany({
            where: {
                email: { contains: "test" }
            },
            take: 10,
            select: { id: true, email: true, role: true, avatar: true }
        });

        return NextResponse.json({
            admins,
            testUsers
        });
    } catch (error) {
        return NextResponse.json({ error: String(error) }, { status: 500 });
    }
}
