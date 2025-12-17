import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { CompletionCelebrationClient } from "@/components/freebie/completion-celebration-client";
import * as crypto from "crypto";
// Force dynamic rendering - no caching
export const dynamic = "force-dynamic";


// Generate a stable certificate ID based on user ID and completion date
function generateStableCertificateId(userId: string, category: string, completedAt: Date): string {
    const year = completedAt.getFullYear();
    const categoryCode = category.toUpperCase().slice(0, 3);
    // Create a stable hash from user ID
    const hash = crypto.createHash('md5').update(userId).digest('hex').slice(0, 6).toUpperCase();
    return `MD-${categoryCode}-${year}-${hash}`;
}

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

    // Generate stable certificate ID on server side
    const certificateId = generateStableCertificateId(
        user.id,
        user.miniDiplomaCategory,
        user.miniDiplomaCompletedAt
    );

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
                certificateId,
            }}
            fullCertification={fullCertification ? {
                ...fullCertification,
                price: fullCertification.price ? Number(fullCertification.price) : null,
            } : null}
        />
    );
}
