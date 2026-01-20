import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import EmailsClient from "./emails-client";

export const metadata = {
  title: "Email Templates | Admin",
  description: "Manage email templates",
};

export default async function EmailsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Verify user has admin access
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || !["ADMIN", "SUPERUSER", "SUPPORT"].includes(user.role)) {
    redirect("/dashboard");
  }

  return <EmailsClient />;
}
