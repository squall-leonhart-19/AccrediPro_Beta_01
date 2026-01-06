import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import { PodChatClient } from "./pod-chat-client";
import { getRandomPodName, COACH_SARAH, ZOMBIE_PROFILES } from "@/lib/zombies";
import fs from "fs/promises";
import path from "path";

// Load pod scripts from JSON file (easier to edit!)
async function loadPodScripts() {
    try {
        const scriptsPath = path.join(process.cwd(), "src/data/pod-scripts.json");
        const scriptsData = await fs.readFile(scriptsPath, "utf-8");
        return JSON.parse(scriptsData);
    } catch (error) {
        console.error("Failed to load pod scripts:", error);
        return { characters: {}, scripts: [] };
    }
}

// Calculate when a message should appear based on enrollment date
function getMessageTime(enrollmentDate: Date, dayOffset: number, delayMinutes: number): Date {
    const messageDate = new Date(enrollmentDate);
    messageDate.setDate(messageDate.getDate() + dayOffset);
    messageDate.setHours(9, 0, 0, 0); // Start at 9 AM
    messageDate.setMinutes(messageDate.getMinutes() + delayMinutes);
    return messageDate;
}

// Generate pod chat data from JSON scripts
async function generatePodChatData(enrollmentDate: Date | null, zombies: typeof ZOMBIE_PROFILES) {
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

    // Load scripts from JSON
    const podScripts = await loadPodScripts();
    const characters = podScripts.characters || {};

    // Map character keys to zombie profiles
    const characterToZombie: Record<string, { name: string; avatar?: string }> = {
        "gina": { name: zombies[0]?.name || "Gina T.", avatar: zombies[0]?.avatar },
        "amber": { name: zombies[1]?.name || "Amber L.", avatar: zombies[1]?.avatar },
        "cheryl": { name: zombies[2]?.name || "Cheryl W.", avatar: zombies[2]?.avatar },
        "lisa": { name: zombies[3]?.name || "Lisa K.", avatar: zombies[3]?.avatar },
        "denise": { name: zombies[4]?.name || "Denise P.", avatar: zombies[4]?.avatar },
    };

    // Process scripts up to current day (max 30)
    const maxDay = Math.min(daysSinceEnrollment, 30);
    const effectiveEnrollment = enrollmentDate || new Date();

    for (const dayScript of podScripts.scripts || []) {
        if (dayScript.day > maxDay) continue;

        for (const msg of dayScript.messages || []) {
            const messageTime = getMessageTime(effectiveEnrollment, dayScript.day, msg.delayMinutes);

            // Only show messages whose time has passed (real-time drip)
            if (messageTime > now) continue;

            const isCoach = msg.sender === "coach";
            const zombie = characterToZombie[msg.sender];

            messages.push({
                id: `script-${msg.id}`,
                senderName: isCoach ? COACH_SARAH.name : (zombie?.name || msg.sender),
                senderAvatar: isCoach ? COACH_SARAH.avatar : zombie?.avatar,
                senderType: isCoach ? "coach" : "zombie",
                content: msg.content,
                createdAt: messageTime,
                isCoach,
            });
        }
    }

    // Sort by time
    messages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

    return { podName, messages, daysSinceEnrollment };
}

export default async function MyCirclePage() {
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
            tags: true, // UserTag - simple string tags from admin create
        },
    });

    // Check if user has FM certification access (or is admin)
    const hasFMCertification =
        user?.marketingTags?.some(
            (t) => t.tag.slug === "functional_medicine_complete_certification_purchased"
        ) ||
        user?.tags?.some(
            (t) => t.tag === "functional_medicine_complete_certification_purchased"
        ) ||
        user?.role === "ADMIN";

    if (!hasFMCertification) {
        redirect("/dashboard");
    }

    // Use consistent zombie profiles from zombies.ts (matches script characters)
    const zombies = ZOMBIE_PROFILES.map((z, i) => ({
        id: `zombie-${i}`,
        name: z.name,
        avatar: z.avatar,
        personalityType: z.personalityType,
    }));

    const enrollmentDate = user?.createdAt || new Date();
    const podData = await generatePodChatData(enrollmentDate, ZOMBIE_PROFILES);

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
