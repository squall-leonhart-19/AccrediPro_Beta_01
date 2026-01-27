import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { GraduatesChannel } from "@/components/mini-diploma/graduates-channel";

export const dynamic = "force-dynamic";

export default async function GraduatesPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    // Check if user has completed the mini diploma (all 9 lessons)
    const completedLessons = await prisma.userTag.count({
        where: {
            userId: session.user.id,
            tag: { startsWith: "functional-medicine-lesson-complete:" },
        },
    });

    const isGraduate = completedLessons >= 9;

    return (
        <GraduatesChannel
            isGraduate={isGraduate}
            diplomaSlug="functional-medicine-mini-diploma"
        />
    );
}
