import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { getQuizConfig } from "@/lib/quiz-configs";
import { NicheQuizClient } from "./quiz-client";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function QuizPage({ params }: PageProps) {
    const { slug } = await params;

    // Get quiz config for this niche
    const config = getQuizConfig(slug);
    if (!config) {
        notFound();
    }

    // Require authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect(`/login?callbackUrl=/portal/${slug}/quiz`);
    }

    // Get user's first name
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { firstName: true },
    });

    const firstName = user?.firstName || "there";

    // Check if quiz already completed - redirect if so
    const quizCompletedTag = await prisma.userTag.findFirst({
        where: {
            userId: session.user.id,
            tag: "quiz:completed",
        },
    });

    if (quizCompletedTag) {
        // Already completed, redirect to portal
        redirect(`${config.completionRedirect}?quiz=already-complete`);
    }

    return <NicheQuizClient config={config} firstName={firstName} />;
}
