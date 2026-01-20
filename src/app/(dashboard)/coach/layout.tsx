import { CoachSidebar } from "@/components/coach/coach-sidebar";

export default function CoachLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen bg-gray-50">
            <CoachSidebar />
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
