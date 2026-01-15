import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SessionProvider } from "@/components/providers/session-provider";

export default async function SupportLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    // Check if user is admin or instructor
    if (!["ADMIN", "INSTRUCTOR"].includes(session.user.role as string)) {
        redirect("/dashboard");
    }

    // Clean full-screen layout - NO sidebar
    return (
        <SessionProvider>
            <div className="min-h-screen bg-slate-100">
                {children}
            </div>
        </SessionProvider>
    );
}
