import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SettingsClient } from "@/components/admin/settings-client";

export default async function AdminSettingsPage() {
    const session = await getServerSession(authOptions);
    // Settings are ADMIN/SUPERUSER only - no SUPPORT access
    if (!session?.user?.id || !["ADMIN", "SUPERUSER"].includes(session.user.role as string)) {
        redirect("/login");
    }

    return <SettingsClient />;
}
