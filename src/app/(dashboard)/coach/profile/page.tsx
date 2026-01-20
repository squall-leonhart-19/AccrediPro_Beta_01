import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { ProfilePageClient } from "@/components/coach/profile-page-client";

export default async function CoachProfilePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            image: true,
            bio: true,
            professionalTitle: true,
            qualifications: true,
            specialties: true,
            personalQuote: true,
            availabilityNote: true,
            acceptingClients: true,
            isPublicDirectory: true,
            website: true,
            socialLinks: true,
            slug: true,
        },
    });

    if (!user) {
        redirect("/dashboard");
    }

    return <ProfilePageClient user={user} />;
}
