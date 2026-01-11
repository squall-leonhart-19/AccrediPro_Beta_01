import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { CreateActionParams } from "@/lib/oracle/types";

// GET - Get actions (with filters)
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const status = searchParams.get("status");
        const userId = searchParams.get("userId");
        const actionType = searchParams.get("actionType");
        const limit = parseInt(searchParams.get("limit") || "50");

        const actions = await prisma.oracleAction.findMany({
            where: {
                status: status || undefined,
                userId: userId || undefined,
                actionType: actionType || undefined,
            },
            orderBy: [
                { priority: "desc" },
                { createdAt: "desc" },
            ],
            take: limit,
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        avatar: true,
                    },
                },
            },
        });

        return NextResponse.json({ actions });
    } catch (error) {
        console.error("Error fetching actions:", error);
        return NextResponse.json(
            { error: "Failed to fetch actions" },
            { status: 500 }
        );
    }
}

// POST - Create a new action
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body: CreateActionParams = await req.json();

        const action = await prisma.oracleAction.create({
            data: {
                userId: body.userId,
                actionType: body.actionType,
                content: body.content,
                subject: body.subject,
                template: body.template,
                priority: body.priority || 5,
                triggeredBy: body.triggeredBy,
                triggerData: body.triggerData,
                scheduledAt: body.scheduledAt,
                metadata: body.metadata,
            },
        });

        return NextResponse.json({ success: true, action });
    } catch (error) {
        console.error("Error creating action:", error);
        return NextResponse.json(
            { error: "Failed to create action" },
            { status: 500 }
        );
    }
}

// PATCH - Update action status (approve/reject/execute)
export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { actionId, status, outcome } = body;

        if (!actionId || !status) {
            return NextResponse.json(
                { error: "actionId and status required" },
                { status: 400 }
            );
        }

        const updateData: any = { status };

        if (status === "executed") {
            updateData.executedAt = new Date();
        }

        if (outcome) {
            updateData.outcome = outcome;
        }

        const action = await prisma.oracleAction.update({
            where: { id: actionId },
            data: updateData,
        });

        return NextResponse.json({ success: true, action });
    } catch (error) {
        console.error("Error updating action:", error);
        return NextResponse.json(
            { error: "Failed to update action" },
            { status: 500 }
        );
    }
}
