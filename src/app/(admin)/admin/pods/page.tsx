import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import PodsDashboard from "./pods-dashboard";

export const metadata = {
    title: "Masterclass Pods | Admin",
    description: "View and manage mini diploma nurture pods",
};

export default async function PodsPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/login");
    }

    // Verify user has admin access
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
    });

    if (!user || !["ADMIN", "SUPERUSER", "INSTRUCTOR", "MENTOR", "SUPPORT"].includes(user.role)) {
        redirect("/dashboard");
    }

    return <PodsDashboard />;
}
