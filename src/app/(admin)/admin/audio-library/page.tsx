import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import AudioLibraryClient from "./audio-library-client";

export const metadata = {
  title: "Audio Library | Admin",
  description: "Manage audio files",
};

export default async function AudioLibraryPage() {
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

  return <AudioLibraryClient />;
}
