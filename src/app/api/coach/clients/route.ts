import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: List all clients for the coach
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Check if user is a coach
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: { role: true },
        });

        if (!user || !["ADMIN", "INSTRUCTOR", "MENTOR"].includes(user.role)) {
            return NextResponse.json({ error: "Not authorized" }, { status: 403 });
        }

        const clients = await prisma.client.findMany({
            where: { coachId: session.user.id },
            include: {
                sessions: {
                    orderBy: { date: "desc" },
                    take: 1,
                },
                tasks: {
                    where: { completed: false },
                },
                protocols: {
                    where: { status: "ACTIVE" },
                },
                _count: {
                    select: { sessions: true, tasks: true, protocols: true },
                },
            },
            orderBy: { updatedAt: "desc" },
        });

        return NextResponse.json({
            success: true,
            data: clients,
        });
    } catch (error) {
        console.error("Get clients error:", error);
        return NextResponse.json({ error: "Failed to get clients" }, { status: 500 });
    }
}

// POST: Create a new client
export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, email, phone, notes, tags } = await req.json();

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        const client = await prisma.client.create({
            data: {
                coachId: session.user.id,
                name,
                email,
                phone,
                notes,
                tags: tags || [],
            },
        });

        return NextResponse.json({
            success: true,
            data: client,
        });
    } catch (error) {
        console.error("Create client error:", error);
        return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
    }
}
