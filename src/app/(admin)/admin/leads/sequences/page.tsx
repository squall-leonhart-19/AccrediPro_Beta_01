import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import SequencesDashboard from "./sequences-dashboard";

export const metadata = {
    title: "Email Sequences | Lead Intelligence",
    description: "Email sequence performance and conversion tracking",
};

export default async function SequencesPage() {
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

    return <SequencesDashboard />;
}
