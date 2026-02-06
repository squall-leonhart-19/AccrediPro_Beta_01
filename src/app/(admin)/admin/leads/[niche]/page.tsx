import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import NicheDeepDive from "./niche-deep-dive";

export const metadata = {
  title: "Niche Performance | Admin",
};

export default async function NicheDeepDivePage({
  params,
}: {
  params: Promise<{ niche: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || !["ADMIN", "SUPERUSER", "INSTRUCTOR", "MENTOR", "SUPPORT"].includes(user.role)) {
    redirect("/dashboard");
  }

  const { niche } = await params;

  return <NicheDeepDive niche={niche} />;
}
