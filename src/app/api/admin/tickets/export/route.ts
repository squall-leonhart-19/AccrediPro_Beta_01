import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only ADMIN and SUPERUSER can export
    if (!["ADMIN", "SUPERUSER"].includes(session.user.role as string)) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const tickets = await prisma.ticket.findMany({
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
                assignedTo: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
                messages: {
                    orderBy: { createdAt: "asc" },
                    select: {
                        content: true,
                        isFromCustomer: true,
                        isInternal: true,
                        createdAt: true,
                        sentBy: {
                            select: { firstName: true, lastName: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        // Build CSV
        const headers = [
            "Ticket #",
            "Subject",
            "Status",
            "Priority",
            "Category",
            "Department",
            "Customer Name",
            "Customer Email",
            "Assigned To",
            "Created At",
            "Updated At",
            "Messages Count",
            "Message History",
        ];

        const rows = tickets.map(t => {
            const customerName = t.user
                ? `${t.user.firstName || ""} ${t.user.lastName || ""}`.trim() || t.customerName
                : t.customerName;

            const assignedTo = t.assignedTo
                ? `${t.assignedTo.firstName || ""} ${t.assignedTo.lastName || ""}`.trim()
                : "";

            // Build message history as condensed text
            const messageHistory = t.messages.map(m => {
                const sender = m.isFromCustomer
                    ? customerName
                    : m.sentBy
                        ? `${m.sentBy.firstName || "Agent"}`
                        : "Agent";
                const type = m.isInternal ? "[INTERNAL]" : "";
                const date = new Date(m.createdAt).toISOString().slice(0, 16).replace("T", " ");
                const content = m.content.replace(/\n/g, " ").slice(0, 200);
                return `[${date}] ${sender}${type}: ${content}`;
            }).join(" | ");

            return [
                t.ticketNumber,
                `"${(t.subject || "").replace(/"/g, '""')}"`,
                t.status,
                t.priority,
                t.category || "General",
                t.department,
                `"${customerName.replace(/"/g, '""')}"`,
                t.customerEmail,
                `"${assignedTo.replace(/"/g, '""')}"`,
                new Date(t.createdAt).toISOString(),
                new Date(t.updatedAt).toISOString(),
                t.messages.length,
                `"${messageHistory.replace(/"/g, '""')}"`,
            ].join(",");
        });

        const csv = [headers.join(","), ...rows].join("\n");

        return new NextResponse(csv, {
            headers: {
                "Content-Type": "text/csv",
                "Content-Disposition": `attachment; filename="tickets-export-${new Date().toISOString().slice(0, 10)}.csv"`,
            },
        });
    } catch (error) {
        console.error("Ticket export error:", error);
        return NextResponse.json({ error: "Export failed" }, { status: 500 });
    }
}
