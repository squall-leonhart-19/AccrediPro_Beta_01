import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import LeadsDashboard from "./leads-dashboard";

export const metadata = {
  title: "Lead Intelligence Dashboard | Admin",
  description: "Mini diploma funnel analytics and lead performance",
};

export default async function LeadsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Verify user has admin access
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || !["ADMIN", "SUPERUSER", "INSTRUCTOR", "MENTOR", "SUPPORT"].includes(user.role)) {
    redirect("/dashboard");
  }

  return <LeadsDashboard />;
}
