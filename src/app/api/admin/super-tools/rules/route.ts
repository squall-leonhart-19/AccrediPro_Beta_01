import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - Fetch all rules
export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const rules = await prisma.autoTagRule.findMany({
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ rules });
    } catch (error) {
        console.error("Error fetching rules:", error);
        return NextResponse.json({ error: "Failed to fetch rules" }, { status: 500 });
    }
}

// POST - Create new rule
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name, trigger, triggerData, action, actionData } = await req.json();

        if (!name || !trigger || !action) {
            return NextResponse.json({ error: "Name, trigger, and action are required" }, { status: 400 });
        }

        const rule = await prisma.autoTagRule.create({
            data: {
                name,
                trigger,
                triggerData: triggerData || {},
                action,
                actionData: actionData || {},
                isActive: true,
            },
        });

        return NextResponse.json({ success: true, rule });
    } catch (error) {
        console.error("Error creating rule:", error);
        return NextResponse.json({ error: "Failed to create rule" }, { status: 500 });
    }
}

// PATCH - Toggle rule active status
export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { ruleId, isActive } = await req.json();

        if (!ruleId) {
            return NextResponse.json({ error: "ruleId required" }, { status: 400 });
        }

        const rule = await prisma.autoTagRule.update({
            where: { id: ruleId },
            data: { isActive },
        });

        return NextResponse.json({ success: true, rule });
    } catch (error) {
        console.error("Error updating rule:", error);
        return NextResponse.json({ error: "Failed to update rule" }, { status: 500 });
    }
}

// DELETE - Delete rule
export async function DELETE(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const ruleId = searchParams.get("ruleId");

        if (!ruleId) {
            return NextResponse.json({ error: "ruleId required" }, { status: 400 });
        }

        await prisma.autoTagRule.delete({
            where: { id: ruleId },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting rule:", error);
        return NextResponse.json({ error: "Failed to delete rule" }, { status: 500 });
    }
}
