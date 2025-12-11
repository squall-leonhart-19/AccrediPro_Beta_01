import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SettingsClient } from "@/components/admin/settings-client";

export default async function AdminSettingsPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
        redirect("/login");
    }

    return <SettingsClient />;
}
