import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// POST: Add session/task/protocol to client
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; type: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id, type } = await params;
        const data = await req.json();

        // Verify client belongs to coach
        const client = await prisma.client.findFirst({
            where: { id, coachId: session.user.id },
        });

        if (!client) {
            return NextResponse.json({ error: "Client not found" }, { status: 404 });
        }

        let result;

        switch (type) {
            case "sessions":
                result = await prisma.clientSession.create({
                    data: {
                        clientId: id,
                        date: new Date(data.date),
                        duration: data.duration,
                        notes: data.notes,
                        sessionType: data.sessionType,
                    },
                });
                break;

            case "tasks":
                result = await prisma.clientTask.create({
                    data: {
                        clientId: id,
                        task: data.task,
                        description: data.description,
                        dueDate: data.dueDate ? new Date(data.dueDate) : null,
                        priority: data.priority,
                    },
                });
                break;

            case "protocols":
                result = await prisma.clientProtocol.create({
                    data: {
                        clientId: id,
                        name: data.name,
                        description: data.description,
                        steps: data.steps || [],
                        startDate: data.startDate ? new Date(data.startDate) : null,
                    },
                });
                break;

            default:
                return NextResponse.json({ error: "Invalid type" }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Add to client error:", error);
        return NextResponse.json({ error: "Failed to add" }, { status: 500 });
    }
}

// PUT: Update session/task/protocol
export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; type: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { type } = await params;
        const data = await req.json();
        const itemId = data.id;

        let result;

        switch (type) {
            case "tasks":
                result = await prisma.clientTask.update({
                    where: { id: itemId },
                    data: {
                        completed: data.completed,
                        completedAt: data.completed ? new Date() : null,
                        task: data.task,
                        description: data.description,
                        dueDate: data.dueDate ? new Date(data.dueDate) : null,
                        priority: data.priority,
                    },
                });
                break;

            case "protocols":
                result = await prisma.clientProtocol.update({
                    where: { id: itemId },
                    data: {
                        status: data.status,
                        steps: data.steps,
                    },
                });
                break;

            default:
                return NextResponse.json({ error: "Invalid type" }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            data: result,
        });
    } catch (error) {
        console.error("Update error:", error);
        return NextResponse.json({ error: "Failed to update" }, { status: 500 });
    }
}
