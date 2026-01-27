import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ScholarshipClient } from "./scholarship-client";

export const dynamic = "force-dynamic";

export default async function ScholarshipPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            firstName: true,
            email: true,
            miniDiplomaCompletedAt: true,
            graduateOfferDeadline: true,
        },
    });

    if (!user) {
        redirect("/login");
    }

    // Check if user has completed mini diploma
    if (!user.miniDiplomaCompletedAt) {
        redirect("/functional-medicine-diploma");
    }

    // Get their exam score
    const exam = await prisma.miniDiplomaExam.findFirst({
        where: {
            userId: user.id,
            category: "fm-healthcare",
            passed: true,
        },
        orderBy: { createdAt: "desc" },
        select: { score: true },
    });

    const examScore = exam?.score || 95;
    const deadline = user.graduateOfferDeadline || new Date(Date.now() + 24 * 60 * 60 * 1000);

    return (
        <ScholarshipClient
            firstName={user.firstName || "there"}
            email={user.email || ""}
            examScore={examScore}
            deadline={deadline.toISOString()}
        />
    );
}
