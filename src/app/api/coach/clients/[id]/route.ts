import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET: Get single client details
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const client = await prisma.client.findFirst({
            where: {
                id,
                coachId: session.user.id,
            },
            include: {
                sessions: {
                    orderBy: { date: "desc" },
                },
                tasks: {
                    orderBy: [{ completed: "asc" }, { dueDate: "asc" }],
                },
                protocols: {
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: client,
        });
    } catch (error) {
        console.error("Get client error:", error);
        return NextResponse.json({ error: "Failed to get client" }, { status: 500 });
    }
}

// PUT: Update client
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const data = await req.json();

        const client = await prisma.client.updateMany({
            where: {
                id,
                coachId: session.user.id,
            },
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone,
                notes: data.notes,
                tags: data.tags,
                status: data.status,
            },
        });

        if (client.count === 0) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Update client error:", error);
        return NextResponse.json({ error: "Failed to update client" }, { status: 500 });
    }
}

// DELETE: Delete client
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        await prisma.client.deleteMany({
            where: {
                id,
                coachId: session.user.id,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete client error:", error);
        return NextResponse.json({ error: "Failed to delete client" }, { status: 500 });
    }
}
