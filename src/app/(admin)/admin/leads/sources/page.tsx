import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import SourcesAnalytics from "./sources-analytics";

export const metadata = {
    title: "Lead Source Analytics | Admin",
    description: "Track which forms and segments produce the best leads",
};

export default async function SourcesPage() {
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

    return <SourcesAnalytics />;
}
