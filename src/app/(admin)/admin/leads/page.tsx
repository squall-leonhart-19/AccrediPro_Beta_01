import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import LeadsClient from "./leads-client";

export const metadata = {
  title: "Lead Management | Admin",
  description: "Manage mini diploma leads",
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

  if (!user || !["ADMIN", "INSTRUCTOR"].includes(user.role)) {
    redirect("/dashboard");
  }

  return <LeadsClient />;
}
