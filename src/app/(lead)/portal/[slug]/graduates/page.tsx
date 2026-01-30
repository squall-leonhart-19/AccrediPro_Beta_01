import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { getConfigByPortalSlug } from "@/lib/mini-diploma-registry";
import { GraduatesChannel } from "@/components/mini-diploma/graduates-channel";

export const dynamic = "force-dynamic";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function GraduatesPage({ params }: PageProps) {
    const { slug } = await params;
    const config = getConfigByPortalSlug(slug);

    if (!config) {
        notFound();
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    // Check if user has completed the mini diploma (all lessons)
    const completedLessons = await prisma.userTag.count({
        where: {
            userId: session.user.id,
            tag: { startsWith: `${config.lessonTagPrefix}:` },
        },
    });

    const totalLessons = config.lessons.length;
    const isGraduate = completedLessons >= totalLessons;

    return (
        <GraduatesChannel
            isGraduate={isGraduate}
            diplomaSlug={config.slug}
        />
    );
}
