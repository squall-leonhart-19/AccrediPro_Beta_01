import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import SequenceHQDashboard from "../marketing/sequence-hq/sequence-hq-dashboard";

export const metadata = {
    title: "Email Panel | Admin",
    description: "Sequence HQ email automation center",
};

export default async function EmailPanelPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/login");
    }

    // Only ADMIN and SUPERUSER can access
    if (!["ADMIN", "SUPERUSER"].includes(session.user.role as string)) {
        redirect("/admin");
    }

    return <SequenceHQDashboard />;
}
