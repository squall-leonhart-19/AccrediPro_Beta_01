import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function LeadChatPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) redirect("/login");

    // Redirect to the main messages page (Sarah chat)
    redirect("/messages");
}
