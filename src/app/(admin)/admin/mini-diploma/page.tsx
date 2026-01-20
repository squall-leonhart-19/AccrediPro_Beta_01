import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import MiniDiplomaClient from "./mini-diploma-client";

export const metadata = {
  title: "Mini Diploma Analytics | Admin",
  description: "Mini diploma funnel analytics",
};

export default async function MiniDiplomaPage() {
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

  return <MiniDiplomaClient />;
}
