import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { TrainingContent } from "./training-content";

export const metadata = {
    title: "Training | AccrediPro Academy",
    description: "Official graduate training and certification resources",
};

export default async function TrainingPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
        redirect("/login");
    }

    // Check if user has completed mini diploma (for access control)
    const hasCompletedMiniDiploma = true; // TODO: Check from DB

    return (
        <TrainingContent
            userName={session.user.firstName || "Graduate"}
            hasCompletedMiniDiploma={hasCompletedMiniDiploma}
        />
    );
}
