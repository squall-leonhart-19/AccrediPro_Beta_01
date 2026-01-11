import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ZombieProfilesClient from "@/components/admin/zombie-profiles-client";

export const metadata = {
    title: "Zombie Profiles Manager | Admin Super Tools",
};

export default async function ZombieProfilesPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/");
    }

    // Fetch zombie profiles with stats
    const zombieProfiles = await prisma.user.findMany({
        where: { isFakeProfile: true },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            bio: true,
            location: true,
            professionalTitle: true,
            specialties: true,
            acceptingClients: true,
            isPublicDirectory: true,
            slug: true,
            createdAt: true,
        },
        orderBy: { createdAt: "desc" },
    });

    const stats = {
        total: zombieProfiles.length,
        inDirectory: zombieProfiles.filter(p => p.isPublicDirectory).length,
        withBio: zombieProfiles.filter(p => p.bio && p.bio.length > 50).length,
        withTitle: zombieProfiles.filter(p => p.professionalTitle).length,
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <a href="/admin/super-tools" className="text-burgundy-600 hover:text-burgundy-700 text-sm mb-2 inline-block">
                    ← Back to Super Tools
                </a>
                <h1 className="text-2xl font-bold text-gray-900">Zombie Profiles Manager</h1>
                <p className="text-gray-600">Manage fake profiles used for social proof and professionals directory</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-white rounded-lg border p-4">
                    <div className="text-3xl font-bold text-burgundy-600">{stats.total}</div>
                    <div className="text-sm text-gray-600">Total Profiles</div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="text-3xl font-bold text-green-600">{stats.inDirectory}</div>
                    <div className="text-sm text-gray-600">In Directory</div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="text-3xl font-bold text-blue-600">{stats.withBio}</div>
                    <div className="text-sm text-gray-600">With Rich Bio</div>
                </div>
                <div className="bg-white rounded-lg border p-4">
                    <div className="text-3xl font-bold text-purple-600">{stats.withTitle}</div>
                    <div className="text-sm text-gray-600">With Title</div>
                </div>
            </div>

            <ZombieProfilesClient profiles={zombieProfiles} />
        </div>
    );
}
