import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import HealthDashboardClient from "@/components/admin/health-dashboard-client";

export const metadata = {
    title: "Customer Health Dashboard | Admin Super Tools",
};

export default async function HealthDashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/");
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-6">
                <a href="/admin/super-tools" className="text-burgundy-600 hover:text-burgundy-700 text-sm mb-2 inline-block">
                    ← Back to Super Tools
                </a>
                <h1 className="text-2xl font-bold text-gray-900">Customer Health Dashboard</h1>
                <p className="text-gray-600">Monitor user engagement and prevent churn before it happens</p>
            </div>

            <HealthDashboardClient />
        </div>
    );
}
