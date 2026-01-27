import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { UniversityDegreesTeaser } from "@/components/community/university-degrees-teaser";

export const dynamic = "force-dynamic";

export default async function UniversityDegreesPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/auth/signin");
    }

    return <UniversityDegreesTeaser />;
}
