import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import LiveChatClient from "./live-chat-client";

export const metadata = {
  title: "Live Chat | Admin",
  description: "Manage live chat conversations",
};

export default async function LiveChatPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Verify user has admin/support access
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });

  if (!user || !["ADMIN", "SUPPORT", "INSTRUCTOR"].includes(user.role)) {
    redirect("/dashboard");
  }

  return <LiveChatClient />;
}
