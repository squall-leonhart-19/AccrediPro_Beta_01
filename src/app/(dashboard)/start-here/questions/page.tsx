import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { QuestionsClient } from "./questions-client";

export default async function QuestionsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/login");
    }

    // Check if user has already completed onboarding
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            firstName: true,
            hasCompletedOnboarding: true,
        },
    });

    // If already completed, redirect to start-here
    if (user?.hasCompletedOnboarding) {
        redirect("/start-here");
    }

    return (
        <QuestionsClient
            userId={session.user.id}
            firstName={user?.firstName || ""}
        />
    );
}
