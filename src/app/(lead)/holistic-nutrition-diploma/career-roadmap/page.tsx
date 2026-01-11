import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CareerRoadmapClient } from "./career-roadmap-client";

export const dynamic = "force-dynamic";

export default async function CareerRoadmapPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { firstName: true },
    });

    return (
        <CareerRoadmapClient
            firstName={user?.firstName || "there"}
        />
    );
}
