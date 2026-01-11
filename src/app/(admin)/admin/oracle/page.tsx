import { Suspense } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { OracleDashboard } from "@/components/oracle/oracle-dashboard";

export default async function OraclePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/");
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <Suspense fallback={
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-burgundy-600"></div>
                </div>
            }>
                <OracleDashboard />
            </Suspense>
        </div>
    );
}
