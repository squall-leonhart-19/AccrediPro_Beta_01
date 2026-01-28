import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { LeadSidebar } from "@/components/lead-portal/LeadSidebar";
import { FloatingMentorChatWrapper } from "@/components/ai/floating-mentor-chat-wrapper";

interface LeadLayoutProps {
    children: React.ReactNode;
}

// Map diploma slug to tag prefix
const DIPLOMA_TAG_PREFIX: Record<string, string> = {
    "womens-health-diploma": "wh-lesson-complete",
    "gut-health-diploma": "gut-health-lesson-complete",
    "functional-medicine-diploma": "functional-medicine-lesson-complete",
    "health-coach-diploma": "health-coach-lesson-complete",
    "nurse-coach-diploma": "nurse-coach-lesson-complete",
    "holistic-nutrition-diploma": "holistic-nutrition-lesson-complete",
    "hormone-health-diploma": "hormone-health-lesson-complete",
    "christian-coaching-diploma": "christian-coaching-lesson-complete",
};

async function getLeadData(userId: string, diplomaSlug: string) {
    const [user, leadOnboarding, examData] = await Promise.all([
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
        // Check if user has passed an exam (for FM diploma)
        prisma.miniDiplomaExam.findFirst({
            where: {
                userId,
                passed: true,
            },
            select: { passed: true },
        }).catch(() => null),
    ]);

    // Get tag prefix for this diploma (default to womens-health)
    const tagPrefix = DIPLOMA_TAG_PREFIX[diplomaSlug] || "wh-lesson-complete";

    // Check if all lessons completed for this specific diploma
    const completedLessons = await prisma.userTag.count({
        where: {
            userId,
            tag: { startsWith: `${tagPrefix}:` },
        },
    });

    // Diploma is completed if either: 9 lessons done OR exam passed
    const diplomaCompleted = completedLessons >= 9 || !!examData?.passed;

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

    // Get the current URL pathname from headers
    const headersList = await headers();
    const pathname = headersList.get("x-pathname") || headersList.get("x-invoke-path") || "";

    // Extract diploma slug from pathname (e.g., /gut-health-diploma/profile -> gut-health-diploma)
    const pathParts = pathname.split("/").filter(Boolean);
    const diplomaSlug = pathParts.find(part => part.includes("-diploma")) || "womens-health-diploma";

    const { user, leadOnboarding, diplomaCompleted } = await getLeadData(session.user.id, diplomaSlug);

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

            {/* Main Content - responsive padding */}
            <main className="pt-14 lg:pt-0 lg:pl-64">
                <div className="min-h-screen">
                    {children}
                </div>
            </main>

            {/* Floating Mentor Chat Widget */}
            <FloatingMentorChatWrapper />
        </div>
    );
}
