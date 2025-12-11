import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CoachWorkspaceClient } from "@/components/coach/workspace-client";

export default async function CoachWorkspacePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    // Check if user is a coach
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
    });

    // Allow all authenticated users to see Coach Workspace
    // Students can explore and prepare for their coaching journey
    // if (!user || !["ADMIN", "INSTRUCTOR", "MENTOR", "STUDENT"].includes(user.role)) {
    //     redirect("/dashboard");
    // }

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


    // Stats
    const stats = {
        totalClients: clients.length,
        activeClients: clients.filter((c) => c.status === "ACTIVE").length,
        pendingTasks: clients.reduce((acc, c) => acc + c.tasks.length, 0),
        thisWeekSessions: clients.reduce((acc, c) => {
            const recentSession = c.sessions[0];
            if (recentSession) {
                const weekAgo = new Date();
                weekAgo.setDate(weekAgo.getDate() - 7);
                if (new Date(recentSession.date) > weekAgo) return acc + 1;
            }
            return acc;
        }, 0),
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-burgundy-50/30">
            <CoachWorkspaceClient clients={clients} stats={stats} />
        </div>
    );
}
