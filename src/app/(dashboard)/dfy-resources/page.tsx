import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ResourcesClient } from "@/components/resources/resources-client";

export default async function ResourcesPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    const resources = await prisma.resource.findMany({
        where: { isActive: true },
        include: {
            files: true,
        },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-burgundy-50/30">
            <ResourcesClient resources={resources} />
        </div>
    );
}
