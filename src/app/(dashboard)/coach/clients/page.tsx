import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ClientsPageClient } from "@/components/coach/clients-page-client";

export default async function CoachClientsPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    const clients = await prisma.client.findMany({
        where: { coachId: session.user.id },
        include: {
            sessions: {
                orderBy: { date: "desc" },
                take: 5,
            },
            tasks: {
                where: { completed: false },
                orderBy: { dueDate: "asc" },
            },
            protocols: {
                orderBy: { createdAt: "desc" },
            },
            _count: {
                select: { sessions: true, tasks: true, protocols: true },
            },
        },
        orderBy: { updatedAt: "desc" },
    }) as any[];

    return <ClientsPageClient clients={clients} />;
}
