import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { getConfigByPortalSlug } from "@/lib/mini-diploma-registry";
import { CareerRoadmapClient } from "./career-roadmap-client";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function CareerRoadmapPage({ params }: PageProps) {
    const { slug } = await params;
    const config = getConfigByPortalSlug(slug);

    if (!config) {
        notFound();
    }

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
                // Use exam category from config, fallback to slug-based
                category: config.examCategory,
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
            portalSlug={slug}
            checkoutUrl={config.checkoutUrl}
            diplomaName={config.displayName}
        />
    );
}
