import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import CertificatePreviewClient from "./certificate-preview-client";

export const metadata = {
  title: "Certificate Preview | Admin",
  description: "Preview certificate designs",
};

export default async function CertificatePreviewPage() {
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

  return <CertificatePreviewClient />;
}
