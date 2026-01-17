import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import ZombieMessagesClient from "@/components/admin/zombie-messages-client";

export const metadata = {
    title: "Zombie Messages Manager | Admin Super Tools",
};

export default async function ZombieMessagesPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/");
    }

    // Fetch message templates with stats
    const templates = await prisma.zombieChatTemplate.findMany({
        orderBy: { createdAt: "desc" },
    });

    // Get recent chat messages (sent in last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentMessages = await prisma.lessonChatMessage.findMany({
        where: {
            isZombie: true,
            createdAt: { gte: sevenDaysAgo },
        },
        orderBy: { createdAt: "desc" },
        take: 100,
        select: {
            id: true,
            content: true,
            zombieName: true,
            zombieAvatar: true,
            createdAt: true,
        },
    });

    // Get today's messages
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysMessagesCount = await prisma.lessonChatMessage.count({
        where: {
            isZombie: true,
            createdAt: { gte: today },
        },
    });

    const sarahMessagesCount = await prisma.lessonChatMessage.count({
        where: {
            zombieName: "Sarah, Your Coach",
            createdAt: { gte: today },
        },
    });

    const stats = {
        totalTemplates: templates.length,
        activeTemplates: templates.filter(t => t.isActive).length,
        todaysMessages: todaysMessagesCount,
        sarahToday: sarahMessagesCount,
        recentCount: recentMessages.length,
    };

    // Group templates by category
    const templatesByCategory = templates.reduce((acc, t) => {
        const cat = t.category || "uncategorized";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(t);
        return acc;
    }, {} as Record<string, typeof templates>);

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <a href="/admin/super-tools" className="text-burgundy-600 hover:text-burgundy-700 text-sm mb-2 inline-block">
                    ← Back to Super Tools
                </a>
                <h1 className="text-2xl font-bold text-gray-900">Zombie Messages Manager</h1>
                <p className="text-gray-600">View and manage chat message templates for social proof</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                <div className="bg-white rounded-lg border p-4">
                    <div className="text-3xl font-bold text-burgundy-600">{stats.totalTemplates}</div>
                    <div className="text-sm text-gray-600">Total Templates</div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="text-3xl font-bold text-green-600">{stats.activeTemplates}</div>
                    <div className="text-sm text-gray-600">Active</div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="text-3xl font-bold text-blue-600">{stats.todaysMessages}</div>
                    <div className="text-sm text-gray-600">Sent Today</div>
                </div>
                <div className="bg-white rounded-lg border p-4 bg-gradient-to-r from-amber-50 to-yellow-50">
                    <div className="text-3xl font-bold text-amber-600">{stats.sarahToday}</div>
                    <div className="text-sm text-amber-700">Sarah Today ⭐</div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="text-3xl font-bold text-purple-600">{stats.recentCount}</div>
                    <div className="text-sm text-gray-600">Last 7 Days</div>
                </div>
            </div>

            <ZombieMessagesClient
                templates={templates}
                recentMessages={recentMessages}
                templatesByCategory={templatesByCategory}
            />
        </div>
    );
}
