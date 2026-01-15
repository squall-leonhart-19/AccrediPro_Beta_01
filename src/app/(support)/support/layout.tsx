import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SupportLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    // Auth check - only ADMIN and INSTRUCTOR can access support portal
    if (!session?.user) {
        redirect("/login");
    }

    if (!["ADMIN", "INSTRUCTOR"].includes(session.user.role as string)) {
        redirect("/dashboard");
    }

    // Clean layout - NO sidebar, just the content
    return (
        <div className="min-h-screen bg-slate-100">
            {children}
        </div>
    );
}
