import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import MarketingClient from "./marketing-client";

export const metadata = {
  title: "Marketing | Admin",
  description: "Marketing tags and sequences",
};

export default async function MarketingPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Verify user has admin access
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || !["ADMIN"].includes(user.role)) {
    redirect("/dashboard");
  }

  return <MarketingClient />;
}
