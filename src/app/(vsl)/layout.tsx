import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

interface VSLLayoutProps {
    children: React.ReactNode;
}

export default async function VSLLayout({ children }: VSLLayoutProps) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/login");
    }

    // Full-screen layout with no sidebar for VSL pages
    return (
        <div className="min-h-screen bg-slate-950">
            {children}
        </div>
    );
}
