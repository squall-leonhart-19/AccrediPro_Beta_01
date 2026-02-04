import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { getConfigByPortalSlug } from "@/lib/mini-diploma-registry";
import { MiniDiplomaCertificate } from "@/components/certificates/mini-diploma-certificate";
import { CertificatePendingPage } from "@/components/certificates/certificate-pending";

export const dynamic = "force-dynamic";

// 24 hours in milliseconds
const CERTIFICATE_DELAY_MS = 24 * 60 * 60 * 1000;

// Test accounts bypass the 24h delay
const TEST_EMAILS = ["tortolialessio1997@gmail.com", "alessio@accredipro.academy"];

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
                email: true,
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

    // Check if 24 hours have passed since exam completion
    const examPassedAt = examData.createdAt.getTime();
    const now = Date.now();
    const timeRemaining = CERTIFICATE_DELAY_MS - (now - examPassedAt);
    const isTestAccount = user?.email && TEST_EMAILS.includes(user.email.toLowerCase());

    // If less than 24h and not a test account, show pending page
    if (timeRemaining > 0 && !isTestAccount) {
        return (
            <CertificatePendingPage
                examScore={examData.score}
                timeRemainingMs={timeRemaining}
                nicheLabel={config.displayName}
                portalSlug={slug}
            />
        );
    }

    // Certificate is ready!
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
