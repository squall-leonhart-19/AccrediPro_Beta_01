import { Suspense } from "react";
import ScholarshipLeadsClient from "./scholarship-leads-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ScholarshipLeadsPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600" />
            </div>
        }>
            <ScholarshipLeadsClient />
        </Suspense>
    );
}
