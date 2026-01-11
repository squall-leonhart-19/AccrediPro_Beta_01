import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import RulesEngineClient from "@/components/admin/rules-engine-client";

export const metadata = {
    title: "Auto-Tag Rules Engine | Admin Super Tools",
};

export default async function RulesEnginePage() {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "ADMIN") {
        redirect("/");
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-6">
                <a href="/admin/super-tools" className="text-burgundy-600 hover:text-burgundy-700 text-sm mb-2 inline-block">
                    ← Back to Super Tools
                </a>
                <h1 className="text-2xl font-bold text-gray-900">Auto-Tag Rules Engine</h1>
                <p className="text-gray-600">Create automation rules to tag users based on their actions</p>
            </div>

            <RulesEngineClient />
        </div>
    );
}
