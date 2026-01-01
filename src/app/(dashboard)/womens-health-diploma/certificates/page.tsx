import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { CertificatesContent } from "./certificates-content";

export const metadata = {
    title: "Your Certificate | Women's Health Mini Diploma",
    description: "Download your Women's Health & Hormones Mini Diploma certificate",
};

async function getCertificateData(userId: string) {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            firstName: true,
            lastName: true,
            email: true,
            tags: true,
            certificates: {
                where: {
                    course: {
                        slug: "womens-health-mini-diploma",
                    },
                },
                include: {
                    course: {
                        select: {
                            title: true,
                            slug: true,
                        },
                    },
                },
            },
        },
    });

    if (!user) return null;

    // Check if all 9 lessons are complete
    const completedLessons = user.tags.filter(tag =>
        tag.startsWith("wh-lesson-complete:")
    ).length;

    return {
        firstName: user.firstName || "Friend",
        lastName: user.lastName || "",
        fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Student",
        email: user.email,
        completedLessons,
        isFullyComplete: completedLessons >= 9,
        hasCertificate: user.certificates.length > 0,
        certificate: user.certificates[0] || null,
    };
}

export default async function CertificatesPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/login");
    }

    const data = await getCertificateData(session.user.id);
    if (!data) {
        redirect("/womens-health-diploma");
    }

    // If not fully complete, redirect back to dashboard
    if (!data.isFullyComplete) {
        redirect("/womens-health-diploma");
    }

    return <CertificatesContent {...data} />;
}
