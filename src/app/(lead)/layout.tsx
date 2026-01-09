import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { LeadSidebar } from "@/components/lead-portal/LeadSidebar";

interface LeadLayoutProps {
    children: React.ReactNode;
}

async function getLeadData(userId: string) {
    const [user, leadOnboarding] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
                userType: true,
            },
        }),
        prisma.leadOnboarding.findUnique({
            where: { userId },
            select: {
                claimedCertificate: true,
                completedQuestions: true,
                watchedVideo: true,
            },
        }).catch(() => null), // Handle if table doesn't exist yet
    ]);

    // Check if all lessons completed
    const completedLessons = await prisma.userTag.count({
        where: {
            userId,
            tag: { startsWith: "wh-lesson-complete:" },
        },
    });

    const diplomaCompleted = completedLessons >= 9;

    return {
        user,
        leadOnboarding,
        diplomaCompleted,
    };
}

export default async function LeadLayout({ children }: LeadLayoutProps) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/login");
    }

    const { user, leadOnboarding, diplomaCompleted } = await getLeadData(session.user.id);

    if (!user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Lead Sidebar */}
            <LeadSidebar
                firstName={user.firstName || "Student"}
                lastName={user.lastName || ""}
                email={user.email || ""}
                avatar={user.avatar}
                diplomaCompleted={diplomaCompleted}
                certificateClaimed={leadOnboarding?.claimedCertificate || false}
            />

            {/* Main Content */}
            <main className="pl-64">
                <div className="min-h-screen">
                    {children}
                </div>
            </main>
        </div>
    );
}
