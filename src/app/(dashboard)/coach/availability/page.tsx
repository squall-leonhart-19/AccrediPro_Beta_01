import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { AvailabilityPageClient } from "@/components/coach/availability-page-client";

export default async function CoachAvailabilityPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            availabilityNote: true,
            socialLinks: true,
        },
    });

    const socialLinks = user?.socialLinks as Record<string, unknown> | null;
    const availability = socialLinks?.availability || null;
    const timezone = (socialLinks?.timezone as string) || "America/New_York";

    return (
        <AvailabilityPageClient
            initialAvailability={availability}
            initialTimezone={timezone}
            initialNote={user?.availabilityNote || ""}
        />
    );
}
