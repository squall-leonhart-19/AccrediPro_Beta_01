import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { CompletionCelebrationClient } from "@/components/freebie/completion-celebration-client";

export default async function MiniDiplomaCompletePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            miniDiplomaCategory: true,
            miniDiplomaCompletedAt: true,
            graduateOfferDeadline: true,
            hasCertificateBadge: true,
        },
    });

    if (!user?.miniDiplomaCategory) {
        redirect("/courses");
    }

    // If not completed yet, redirect to main mini diploma page
    if (!user.miniDiplomaCompletedAt) {
        redirect("/my-mini-diploma");
    }

    // Find full certification for upsell
    const fullCertification = await prisma.course.findFirst({
        where: {
            certificateType: "CERTIFICATION",
            isPublished: true,
            OR: [
                { slug: { contains: user.miniDiplomaCategory } },
                { category: { slug: user.miniDiplomaCategory } },
            ],
        },
        select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            thumbnail: true,
            description: true,
        },
    });

    // Calculate time remaining for graduate offer
    const now = new Date();
    const offerExpired = user.graduateOfferDeadline
        ? now > user.graduateOfferDeadline
        : true;

    return (
        <CompletionCelebrationClient
            user={{
                firstName: user.firstName || "Graduate",
                lastName: user.lastName || "",
                email: user.email,
                miniDiplomaCategory: user.miniDiplomaCategory,
                completedAt: user.miniDiplomaCompletedAt.toISOString(),
                graduateOfferDeadline: user.graduateOfferDeadline?.toISOString() || null,
                offerExpired,
            }}
            fullCertification={fullCertification ? {
                ...fullCertification,
                price: fullCertification.price ? Number(fullCertification.price) : null,
            } : null}
        />
    );
}
