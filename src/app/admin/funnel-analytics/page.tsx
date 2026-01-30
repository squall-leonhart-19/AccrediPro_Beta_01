import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { QualificationFunnelAnalytics } from "@/components/admin/qualification-funnel-analytics";

export const metadata = {
    title: "Funnel Analytics | Admin",
    description: "View qualification form analytics and drop-off metrics"
};

export default async function FunnelAnalyticsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user || !["ADMIN"].includes(session.user.role as string)) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-6xl mx-auto p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Funnel Analytics</h1>
                    <p className="text-gray-500">Track qualification form performance and optimize conversions</p>
                </div>

                <QualificationFunnelAnalytics />
            </div>
        </div>
    );
}
