import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import ScholarshipsClient from "./scholarships-client";

export const metadata = {
  title: "Scholarship Applications | Admin",
  description: "Manage scholarship applications",
};

export default async function ScholarshipsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Verify user has admin access
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || !["ADMIN", "SUPERUSER", "INSTRUCTOR"].includes(user.role)) {
    redirect("/dashboard");
  }

  return <ScholarshipsClient />;
}
