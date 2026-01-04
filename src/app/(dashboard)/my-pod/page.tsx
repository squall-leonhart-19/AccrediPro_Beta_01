import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PodChatClient } from "./pod-chat-client";
import { getRandomPodName, COACH_SARAH } from "@/lib/zombies";
import { getAllScriptsUpToDay, getMessageTime, POD_CHARACTERS } from "@/lib/pod-scripts-v2";

// Fetch specific fake profiles by name for pod chat
// These are the 5 characters we use in the scripts
async function getFakeProfiles() {
    const targetNames = [
        { firstName: "Ivy", lastName: "Hernandez" },      // Gina T.
        { firstName: "Elizabeth", lastName: "Ortiz" },    // Amber L.
        { firstName: "Tiffany", lastName: "Cook" },       // Cheryl W.
        { firstName: "Jennifer", lastName: "Cooper" },    // Lisa K.
        { firstName: "Melissa", lastName: "Thompson" },   // Denise P.
    ];

    const profiles = await Promise.all(
        targetNames.map(async (name) => {
            const profile = await prisma.user.findFirst({
                where: {
                    isFakeProfile: true,
                    firstName: name.firstName,
                    lastName: name.lastName,
                },
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    avatar: true,
                },
            });
            return profile || {
                id: `fallback-${name.firstName}`,
                firstName: name.firstName,
                lastName: name.lastName,
                avatar: null,
            };
        })
    );
    return profiles;
}

// Assign personality types to profiles
// Using all 5 profiles to match chat characters
function assignPersonalities(profiles: { id: string; firstName: string | null; lastName: string | null; avatar: string | null }[]) {
    const types = ["leader", "leader", "questioner", "struggler", "buyer"];
    return profiles.slice(0, 5).map((p, i) => ({
        id: p.id,
        name: `${p.firstName || ""} ${p.lastName || ""}`.trim() || `Student ${i + 1}`,
        avatar: p.avatar || undefined,
        personalityType: types[i],
    }));
}

// Generate pod chat data with humanized zombie messages (v2)
// FEATURES:
// 1. 7-Day Window: Only show messages from last 7 days (not all history)
// 2. Real-Time Drip: Only show messages whose scheduled time has PASSED
function generatePodChatData(enrollmentDate: Date | null, zombies: { id: string; name: string; avatar?: string; personalityType: string }[]) {
    const now = new Date();
    const daysSinceEnrollment = enrollmentDate
        ? Math.floor((now.getTime() - enrollmentDate.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

    const podName = getRandomPodName();
    const messages: Array<{
        id: string;
        senderName: string;
        senderAvatar?: string;
        senderType: "coach" | "zombie" | "user";
        content: string;
        createdAt: Date;
        isCoach: boolean;
    }> = [];

    // LOGIC: Start from Day 0 ALWAYS
    // - Day 0-7: User sees Day 0 through their current day (max 7)
    // - Day 8+: Slide window forward, but ALWAYS include Day 0-7 content in history
    // Actually simpler: Just show Day 0 through min(daysSinceEnrollment, 7) initially
    // After Day 7, show a sliding 7-day window

    // For simplicity: Always show from Day 0, capped at daysSinceEnrollment, max 30
    // The real-time drip will naturally limit what's visible
    const maxDay = Math.min(daysSinceEnrollment, 30);

    // Get all scripts from Day 0 to current day
    const allScripts = getAllScriptsUpToDay(maxDay);

    // Map script character names to specific database profiles
    // Using exact names from user's fake profiles with avatars
    const characterToProfileMap: Record<string, { name: string; avatar?: string }> = {
        "Gina T.": { name: zombies[0]?.name || "Ivy Hernandez", avatar: zombies[0]?.avatar },
        "Amber L.": { name: zombies[1]?.name || "Elizabeth Ortiz", avatar: zombies[1]?.avatar },
        "Cheryl W.": { name: zombies[2]?.name || "Tiffany Cook", avatar: zombies[2]?.avatar },
        "Lisa K.": { name: zombies[3]?.name || "Jennifer Cooper", avatar: zombies[3]?.avatar },
        "Denise P.": { name: zombies[4]?.name || "Melissa Thompson", avatar: zombies[4]?.avatar },
    };

    allScripts.forEach((script, index) => {
        // Calculate when this message should appear
        const messageTime = getMessageTime(enrollmentDate || new Date(), script);

        // REAL-TIME DRIP: Only show if scheduled time has PASSED
        if (messageTime > now) {
            return; // Skip - this message hasn't "arrived" yet
        }

        const isCoach = script.senderType === "coach";

        // Map script character to unique database profile
        const profile = characterToProfileMap[script.senderName];
        const name = isCoach ? COACH_SARAH.name : (profile?.name || script.senderName);
        const avatar = isCoach ? COACH_SARAH.avatar : profile?.avatar;

        messages.push({
            id: `script-${script.id}-${index}`,
            senderName: name,
            senderAvatar: avatar,
            senderType: isCoach ? "coach" : "zombie",
            content: script.content,
            createdAt: messageTime,
            isCoach,
        });
    });

    messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    return { podName, messages, daysSinceEnrollment };
}


export default async function MyPodPage() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        redirect("/login");
    }

    // Get user info including marketing tags
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            createdAt: true,
            role: true,
            marketingTags: {
                include: { tag: true },
            },
        },
    });

    // Check if user has FM certification access (or is admin)
    const hasFMCertification = user?.marketingTags?.some(
        (t) => t.tag.slug === "functional_medicine_complete_certification_purchased"
    ) || user?.role === "ADMIN";

    if (!hasFMCertification) {
        redirect("/dashboard");
    }

    // Use database fake profiles - they have profile images and consistent names
    // Map them to personality types so chat uses same names as leaderboard
    const fakeProfiles = await getFakeProfiles();
    const zombies = assignPersonalities(fakeProfiles);

    const enrollmentDate = user?.createdAt || new Date();
    const podData = generatePodChatData(enrollmentDate, zombies);

    // Calculate REAL user progress from FM certification enrollment
    const fmEnrollment = await prisma.enrollment.findFirst({
        where: {
            userId: session.user.id,
            course: {
                slug: { contains: "functional-medicine" },
            },
        },
        include: {
            course: {
                include: {
                    modules: {
                        include: {
                            lessons: true,
                        },
                    },
                },
            },
        },
    });

    // Get completed lessons count
    const lessonProgress = await prisma.lessonProgress.count({
        where: {
            userId: session.user.id,
            lesson: {
                module: {
                    course: {
                        slug: { contains: "functional-medicine" },
                    },
                },
            },
            isCompleted: true,
        },
    });

    // Calculate total lessons and progress percentage
    const totalLessons = fmEnrollment?.course.modules.reduce(
        (acc, m) => acc + m.lessons.length, 0
    ) || 1;
    const userProgress = Math.round((lessonProgress / totalLessons) * 100);

    // Only show current user in leaderboard if they are NOT admin
    // Admin views the pod as coach, not as student
    const includeCurrentUser = user?.role !== "ADMIN";

    return (
        <div className="min-h-screen">
            <PodChatClient
                podName={podData.podName}
                messages={podData.messages}
                zombies={zombies}
                currentUser={includeCurrentUser ? {
                    id: session.user.id,
                    name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "You",
                    avatar: user?.avatar || undefined,
                    progress: userProgress,
                } : null}
                daysSinceEnrollment={podData.daysSinceEnrollment}
            />
        </div>
    );
}
