import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { IncomeCalculator } from "@/components/mini-diploma/tools/income-calculator";
import { NicheScorecard } from "@/components/mini-diploma/tools/niche-scorecard";

interface ToolPageProps {
    params: Promise<{
        slug: string;
        tool: string;
    }>;
}

export default async function ToolPage({ params }: ToolPageProps) {
    const { slug, tool } = await params;

    const session = await getServerSession(authOptions);
    if (!session?.user) {
        redirect(`/portal/${slug}`);
    }

    // Render the appropriate tool
    switch (tool) {
        case "income-calculator":
            return <IncomeCalculator portalSlug={slug} />;
        case "niche-scorecard":
            return <NicheScorecard portalSlug={slug} />;
        default:
            redirect(`/portal/${slug}/lesson/3`);
    }
}
