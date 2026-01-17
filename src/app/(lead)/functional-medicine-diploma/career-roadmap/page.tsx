import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CareerRoadmapClient } from "./career-roadmap-client";

export const dynamic = "force-dynamic";

export default async function CareerRoadmapPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    const [user, examData] = await Promise.all([
        prisma.user.findUnique({
            where: { id: session.user.id },
            select: { firstName: true },
        }),
        prisma.miniDiplomaExam.findFirst({
            where: {
                userId: session.user.id,
                passed: true,
            },
            select: {
                score: true,
                scholarshipQualified: true,
                scholarshipCouponCode: true,
                scholarshipExpiresAt: true,
            },
        }),
    ]);

    return (
        <CareerRoadmapClient
            firstName={user?.firstName || "there"}
            examScore={examData?.score}
            scholarshipQualified={examData?.scholarshipQualified || false}
            couponCode={examData?.scholarshipCouponCode || undefined}
            couponExpiresAt={examData?.scholarshipExpiresAt?.toISOString()}
        />
    );
}
