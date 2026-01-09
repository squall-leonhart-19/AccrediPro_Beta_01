import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import CareerHubClient from "./career-hub-client";

export const dynamic = "force-dynamic";

export default async function PracticePage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/login");
    }

    return <CareerHubClient />;
}
