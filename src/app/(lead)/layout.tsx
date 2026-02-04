import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { LeadSidebar } from "@/components/lead-portal/LeadSidebar";
import { MainContentWrapper } from "@/components/lead-portal/MainContentWrapper";
import { FloatingMentorChatWrapper } from "@/components/ai/floating-mentor-chat-wrapper";
import { SidebarProvider } from "@/contexts/sidebar-context";
import { CIRCLE_RESOURCES } from "@/data/circle-resources";

interface LeadLayoutProps {
    children: React.ReactNode;
}

// Map diploma slug to tag prefix
const DIPLOMA_TAG_PREFIX: Record<string, string> = {
    "womens-health-diploma": "wh-lesson-complete",
    "womens-hormone-health-diploma": "whh-lesson-complete",
    "gut-health-diploma": "gut-health-lesson-complete",
    "functional-medicine-diploma": "functional-medicine-lesson-complete",
    "health-coach-diploma": "health-coach-lesson-complete",
    "nurse-coach-diploma": "nurse-coach-lesson-complete",
    "holistic-nutrition-diploma": "holistic-nutrition-lesson-complete",
    "hormone-health-diploma": "hormone-health-lesson-complete",
    "spiritual-healing-diploma": "spiritual-healing-lesson-complete",
    "energy-healing-diploma": "energy-healing-lesson-complete",
    "christian-coaching-diploma": "christian-coaching-lesson-complete",
    "reiki-healing-diploma": "reiki-healing-lesson-complete",
    "adhd-coaching-diploma": "adhd-coaching-lesson-complete",
    "pet-nutrition-diploma": "pet-nutrition-lesson-complete",
};

async function getLeadData(userId: string, diplomaSlug: string) {
    const [user, leadOnboarding, examData, masterclassPod] = await Promise.all([
        prisma.user.findUnique({
            where: { id: userId },
            select: {
                firstName: true,
                lastName: true,
                email: true,
                avatar: true,
                userType: true,
                createdAt: true,
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
        // Get masterclass pod for resources
        prisma.masterclassPod.findUnique({
            where: { userId },
            select: {
                createdAt: true,
                unlockedResources: true,
            },
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

    // Calculate resources unlock status - always show resources (locked if no pod)
    let resources: {
        id: string;
        name: string;
        icon: string;
        description: string;
        isUnlocked: boolean;
        minutesUntilUnlock: number;
    }[] = [];

    if (masterclassPod) {
        const minutesSinceCreated = Math.floor(
            (Date.now() - new Date(masterclassPod.createdAt).getTime()) / (1000 * 60)
        );
        const unlockedIds = (masterclassPod.unlockedResources as string[]) || [];

        resources = CIRCLE_RESOURCES.map(r => ({
            id: r.id,
            name: r.name,
            icon: r.icon,
            description: r.description,
            isUnlocked: unlockedIds.includes(r.id),
            minutesUntilUnlock: Math.max(0, r.unlockAfterMinutes - minutesSinceCreated),
        }));
    } else {
        // No pod yet - show all resources as locked
        resources = CIRCLE_RESOURCES.map(r => ({
            id: r.id,
            name: r.name,
            icon: r.icon,
            description: r.description,
            isUnlocked: false,
            minutesUntilUnlock: r.unlockAfterMinutes,
        }));
    }

    return {
        user,
        leadOnboarding,
        diplomaCompleted,
        resources,
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

    // Extract diploma slug from pathname
    // New pattern: /portal/functional-medicine/lesson/1 -> functional-medicine-diploma
    // Old pattern: /gut-health-diploma/profile -> gut-health-diploma
    const pathParts = pathname.split("/").filter(Boolean);

    let diplomaSlug = "womens-health-diploma";
    if (pathParts[0] === "portal" && pathParts[1]) {
        // New portal pattern - convert to course slug format
        diplomaSlug = `${pathParts[1]}-diploma`;
    } else if (pathParts[0]?.includes("-diploma")) {
        // Old diploma pattern
        diplomaSlug = pathParts[0];
    }

    const { user, leadOnboarding, diplomaCompleted, resources } = await getLeadData(session.user.id, diplomaSlug);

    if (!user) {
        redirect("/login");
    }

    return (
        <SidebarProvider>
            <div className="min-h-screen bg-gray-50">
                {/* Lead Sidebar */}
                <LeadSidebar
                    firstName={user.firstName || "Student"}
                    lastName={user.lastName || ""}
                    email={user.email || ""}
                    avatar={user.avatar}
                    diplomaCompleted={diplomaCompleted}
                    certificateClaimed={leadOnboarding?.claimedCertificate || false}
                    resources={resources}
                />

                {/* Main Content - responsive padding (dynamic based on sidebar state) */}
                <MainContentWrapper>
                    {children}
                </MainContentWrapper>
            </div>
        </SidebarProvider>
    );
}
