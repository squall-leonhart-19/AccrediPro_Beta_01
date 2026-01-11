import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CompleteClient } from "./complete-client";

export const dynamic = "force-dynamic";

async function getCompletionData(userId: string) {
    const [user, completionTags] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                firstName: true,
                lastName: true,
            },
        }),
        prisma.userTag.findMany({
            where: {
                userId,
                tag: { startsWith: "gut-health-lesson-complete:" },
            },
        }),
    ]);

    return {
        user,
        completedLessons: completionTags.length,
    };
}

export default async function CompletePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    const { user, completedLessons } = await getCompletionData(session.user.id);
    if (!user) redirect("/login");

    const isComplete = completedLessons >= 9;

    if (!isComplete) {
        redirect("/gut-health-diploma");
    }

    return (
        <CompleteClient
            firstName={user.firstName || "there"}
            diplomaName="Gut Health"
        />
    );
}
