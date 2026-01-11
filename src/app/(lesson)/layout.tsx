import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { SessionProvider } from "@/components/providers/session-provider";
import { NotificationProvider } from "@/components/providers/notification-provider";
import { SWRProvider } from "@/components/providers/swr-provider";
import { AchievementProvider } from "@/components/gamification/achievement-toast";

export default async function LessonLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <SessionProvider>
            <SWRProvider>
                <NotificationProvider>
                    <AchievementProvider>
                        {/* Minimal layout - no sidebar or header, just content */}
                        <div className="min-h-screen bg-gray-50">
                            {children}
                        </div>
                    </AchievementProvider>
                </NotificationProvider>
            </SWRProvider>
        </SessionProvider>
    );
}
