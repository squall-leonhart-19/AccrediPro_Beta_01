import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { getConfigByPortalSlug } from "@/lib/mini-diploma-registry";
import { MiniDiplomaCertificate } from "@/components/certificates/mini-diploma-certificate";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function CertificatePage({ params }: PageProps) {
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
            select: {
                firstName: true,
                lastName: true,
            },
        }),
        prisma.miniDiplomaExam.findFirst({
            where: {
                userId: session.user.id,
                passed: true,
                category: config.examCategory,
            },
            select: {
                id: true,
                score: true,
                createdAt: true,
            },
            orderBy: { createdAt: "desc" },
        }),
    ]);

    // If no passed exam, redirect to portal
    if (!examData) {
        redirect(`/portal/${slug}`);
    }

    const studentName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Student";
    const completionDate = examData.createdAt.toISOString();

    // Generate certificate ID from exam ID and portal slug
    const prefix = config.portalSlug.split("-")[0].toUpperCase().slice(0, 4);
    const certificateId = `ASI-${prefix}-${examData.id.slice(-8).toUpperCase()}`;

    return (
        <MiniDiplomaCertificate
            studentName={studentName}
            diplomaTitle={config.displayName}
            completedDate={completionDate}
            certificateId={certificateId}
            portalSlug={config.portalSlug}
        />
    );
}
