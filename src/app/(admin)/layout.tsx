import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AdminNav } from "@/components/admin/admin-nav";
import { SessionProvider } from "@/components/providers/session-provider";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Check if user has admin panel access
  // ADMIN: Full access, redirected here on login
  // SUPERUSER: Full access + student dashboard access (for testing)
  // INSTRUCTOR: Course/user management
  // SUPPORT: Read-only access to users, tickets, live-chat
  if (!["ADMIN", "SUPERUSER", "INSTRUCTOR", "SUPPORT"].includes(session.user.role as string)) {
    redirect("/dashboard");
  }

  return (
    <SessionProvider>
      <div className="min-h-screen bg-gray-50">
        <AdminNav />

        {/* Main content */}
        <main className="lg:pl-72 pt-16 lg:pt-0">
          <div className="p-4 lg:p-8">{children}</div>
        </main>
      </div>
    </SessionProvider>
  );
}
