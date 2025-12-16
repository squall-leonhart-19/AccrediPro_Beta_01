import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { TrainingContent } from "./training-content";

export const metadata = {
    title: "Training | AccrediPro Academy",
    description: "Graduate Orientation: Becoming a Certified Functional Medicine Practitioner",
};

export default async function TrainingPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    // Check if user has completed mini diploma from database
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            firstName: true,
            miniDiplomaCompletedAt: true,
            miniDiplomaCategory: true,
            role: true,
            enrollments: {
                where: {
                    course: {
                        certificateType: "CERTIFICATION",
                    },
                },
                select: { id: true },
            },
            tags: {
                where: {
                    tag: { startsWith: "training_video_" },
                },
                select: { tag: true },
            },
        },
    });

    const hasCompletedMiniDiploma = !!user?.miniDiplomaCompletedAt;
    const miniDiplomaCategory = user?.miniDiplomaCategory || null;
    const isAdmin = user?.role === "ADMIN" || user?.role === "MENTOR" || user?.role === "INSTRUCTOR";

    // Check if enrolled in main certification (buyer)
    const isEnrolledInMainCert = (user?.enrollments?.length ?? 0) > 0;

    // Check if video is completed (70%+ watched)
    const videoTags = user?.tags?.map(t => t.tag) || [];
    const hasWatched70 = videoTags.some(t =>
        ["training_video_70", "training_video_80", "training_video_90", "training_video_100"].includes(t)
    );

    return (
        <TrainingContent
            userName={user?.firstName || "Graduate"}
            userId={user?.id || ""}
            hasCompletedMiniDiploma={hasCompletedMiniDiploma}
            miniDiplomaCategory={miniDiplomaCategory}
            isAdmin={isAdmin}
            isEnrolledInMainCert={isEnrolledInMainCert}
            hasCompletedVideo={hasWatched70}
        />
    );
}
