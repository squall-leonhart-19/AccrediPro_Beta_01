import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { LeadPortalDashboard } from "@/components/lead-portal/LeadPortalDashboard";
import { DIPLOMA_CONFIGS } from "@/components/lead-portal/diploma-configs";

export const dynamic = "force-dynamic";

async function getLeadProgress(userId: string) {
    const [user, enrollment, completionTags] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
                accessExpiresAt: true,
                createdAt: true,
            },
        }),
        prisma.enrollment.findFirst({
            where: {
                userId,
                course: { slug: "christian-coaching-mini-diploma" },
            },
            select: {
                id: true,
                enrolledAt: true,
            },
        }),
        prisma.userTag.findMany({
            where: {
                userId,
                tag: { startsWith: "christian-coaching-lesson-complete:" },
            },
        }),
    ]);

    if (!enrollment) return null;

    const completedLessons = new Set(
        completionTags.map((t) => parseInt(t.tag.replace("christian-coaching-lesson-complete:", "")))
    );

    return {
        user,
        completedLessons: Array.from(completedLessons),
        enrolledAt: enrollment?.enrolledAt || user?.createdAt,
    };
}

export default async function ChristianCoachingDiplomaPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    const data = await getLeadProgress(session.user.id);
    if (!data) redirect("/dashboard");

    const { user, completedLessons, enrolledAt } = data;
    const firstName = user?.firstName || "there";
    const config = DIPLOMA_CONFIGS["christian-coaching-diploma"];

    return (
        <LeadPortalDashboard
            firstName={firstName}
            completedLessons={completedLessons}
            config={config}
            enrolledAt={enrolledAt?.toISOString()}
        />
    );
}
