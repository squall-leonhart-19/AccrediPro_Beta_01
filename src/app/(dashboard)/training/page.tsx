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
            firstName: true,
            miniDiplomaCompletedAt: true,
            miniDiplomaCategory: true,
        },
    });

    const hasCompletedMiniDiploma = !!user?.miniDiplomaCompletedAt;
    const miniDiplomaCategory = user?.miniDiplomaCategory || null;

    return (
        <TrainingContent
            userName={user?.firstName || "Graduate"}
            hasCompletedMiniDiploma={hasCompletedMiniDiploma}
            miniDiplomaCategory={miniDiplomaCategory}
        />
    );
}
