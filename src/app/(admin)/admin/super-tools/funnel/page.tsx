import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import FunnelAnalyticsClient from "@/components/admin/funnel-analytics-client";

export const metadata = {
    title: "Funnel Analytics | Admin Super Tools",
};

export default async function FunnelAnalyticsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/");
    }

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="mb-6">
                <a href="/admin/super-tools" className="text-burgundy-600 hover:text-burgundy-700 text-sm mb-2 inline-block">
                    ← Back to Super Tools
                </a>
                <h1 className="text-2xl font-bold text-gray-900">Funnel Analytics</h1>
                <p className="text-gray-600">See where users drop off in their learning journey</p>
            </div>

            <FunnelAnalyticsClient />
        </div>
    );
}
