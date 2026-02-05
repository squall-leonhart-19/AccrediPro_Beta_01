import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GET /api/masterclass-pod
 * Get the current user's masterclass pod and messages
 */
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;

        // Pagination params
        const url = new URL(request.url);
        const cursor = url.searchParams.get("cursor"); // oldest message ID for loading more
        const limit = 30; // Messages per page

        // Get user's pod
        const pod = await prisma.masterclassPod.findUnique({
            where: { userId },
            include: {
                zombieProfile: {
                    select: {
                        name: true,
                        avatar: true,
                        background: true,
                    },
                },
                messages: {
                    where: {
                        OR: [
                            { sentAt: { not: null } },
                            { senderType: "user" },
                            { scheduledFor: { lte: new Date() } }, // Include scheduled messages whose time has passed
                        ],
                        ...(cursor ? { createdAt: { lt: (await prisma.masterclassMessage.findUnique({ where: { id: cursor } }))?.createdAt } } : {}),
                    },
                    orderBy: { createdAt: "desc" }, // Get newest first for pagination
                    take: limit + 1, // Take one extra to check if there's more
                },
                dayProgress: {
                    orderBy: { dayNumber: "desc" },
                    take: 1,
                },
            },
        });

        if (!pod) {
            // Auto-create pod on first access - no exam gating
            // Get user's niche from their most recent tag or default to functional-medicine
            const nicheTag = await prisma.userTag.findFirst({
                where: {
                    userId,
                    tag: { contains: "-diploma" }
                },
                orderBy: { createdAt: "desc" },
            });

            const nicheCategory = nicheTag?.tag.replace("-diploma", "").replace("-lesson-complete:", "") || "functional-medicine";

            // Import and call createMasterclassPod
            const { createMasterclassPod } = await import("@/lib/masterclass-pod");
            const result = await createMasterclassPod(userId, nicheCategory);

            if (!result.success) {
                return NextResponse.json({
                    hasPod: false,
                    message: "Setting up your Circle Pod... Please refresh in a moment!",
                });
            }

            // Fetch the newly created pod
            const newPod = await prisma.masterclassPod.findUnique({
                where: { userId },
                include: {
                    zombieProfile: {
                        select: {
                            name: true,
                            avatar: true,
                            background: true,
                        },
                    },
                    messages: {
                        where: {
                            OR: [
                                { sentAt: { not: null } },
                                { senderType: "user" },
                                { scheduledFor: { lte: new Date() } },
                            ],
                        },
                        orderBy: { createdAt: "asc" },
                    },
                },
            });

            if (!newPod) {
                return NextResponse.json({
                    hasPod: false,
                    message: "Setting up your Circle Pod... Please refresh!",
                });
            }

            // Return the newly created pod data
            // Calculate deadline (48h from creation)
            const deadlineAt = new Date(newPod.startedAt);
            deadlineAt.setHours(deadlineAt.getHours() + 48);

            return NextResponse.json({
                hasPod: true,
                phase: "pre_completion",
                pod: {
                    id: newPod.id,
                    status: newPod.status,
                    currentDay: newPod.masterclassDay,
                    startedAt: newPod.startedAt,
                    examPassed: false,
                    deadlineAt: deadlineAt.toISOString(),
                },
                zombie: newPod.zombieProfile,
                messages: newPod.messages.map((m) => ({
                    id: m.id,
                    senderType: m.senderType,
                    senderName: m.senderName,
                    senderAvatar: m.senderAvatar,
                    content: m.content,
                    audioUrl: m.audioUrl,
                    sentAt: m.sentAt,
                    createdAt: m.createdAt,
                })),
                progress: {
                    userLessons: 0,
                    zombieLessons: 2, // Zombie starts ahead as social proof
                    totalLessons: 9,
                },
            });
        }

        // Get current day's template for lesson info
        const template = await prisma.masterclassTemplate.findUnique({
            where: {
                nicheCategory_dayNumber: {
                    nicheCategory: pod.nicheCategory,
                    dayNumber: pod.masterclassDay,
                },
            },
        });

        // Calculate scholarship status
        let scholarshipStatus = "none";
        if (pod.scholarshipUsed) {
            scholarshipStatus = "used";
        } else if (pod.scholarshipExpiresAt) {
            const now = new Date();
            if (now < pod.scholarshipExpiresAt) {
                scholarshipStatus = "active";
            } else {
                scholarshipStatus = "expired";
            }
        } else if (pod.masterclassDay >= 8) {
            scholarshipStatus = "pending"; // Should have been offered
        }

        // Determine phase based on exam completion
        const examPassed = (pod.examScore ?? 0) >= 80;
        const phase = examPassed ? "post_completion" : "pre_completion";

        // Calculate deadline (48h from creation) for pre-completion
        const deadlineAt = new Date(pod.startedAt);
        deadlineAt.setHours(deadlineAt.getHours() + 48);

        // Get user's lesson progress - join through lesson to get course
        const lessonProgress = await prisma.lessonProgress.count({
            where: {
                userId: userId,
                completedAt: { not: null },
                lesson: {
                    module: {
                        course: {
                            slug: pod.nicheCategory,
                        },
                    },
                },
            },
        });

        // Zombie is always 1-2 lessons ahead (simulated social proof)
        const zombieLessons = Math.min(lessonProgress + 2, 9);

        return NextResponse.json({
            hasPod: true,
            phase,
            pod: {
                id: pod.id,
                status: pod.status,
                currentDay: pod.masterclassDay,
                startedAt: pod.startedAt,
                examPassed,
                deadlineAt: phase === "pre_completion" ? deadlineAt.toISOString() : undefined,
                scholarshipStatus,
                scholarshipExpiresAt: pod.scholarshipExpiresAt,
            },
            zombie: pod.zombieProfile,
            messages: (() => {
                // Check if there are more messages beyond the limit
                const hasMore = pod.messages.length > limit;
                const displayMessages = hasMore ? pod.messages.slice(0, limit) : pod.messages;
                // Reverse to chronological order for display (oldest first)
                return displayMessages.reverse().map((m) => ({
                    id: m.id,
                    senderType: m.senderType,
                    senderName: m.senderName,
                    senderAvatar: m.senderAvatar,
                    content: m.content,
                    audioUrl: m.audioUrl,
                    offerMention: m.offerMention,
                    sentAt: m.sentAt,
                    createdAt: m.createdAt,
                    readAt: m.readAt,
                }));
            })(),
            hasMore: pod.messages.length > limit,
            oldestMessageId: pod.messages.length > 0 ? pod.messages[pod.messages.length - 1]?.id : null,
            progress: {
                userLessons: lessonProgress,
                zombieLessons,
                totalLessons: 9,
            },
            todayLesson: template
                ? {
                    title: template.lessonTitle,
                    gapTopic: template.gapTopic,
                    includesOffer: template.includesOffer,
                }
                : null,
        });
    } catch (error) {
        console.error("[MASTERCLASS] Get pod error:", error);
        return NextResponse.json(
            { error: "Failed to get pod" },
            { status: 500 }
        );
    }
}

/**
 * POST /api/masterclass-pod
 * Send a message in the masterclass pod
 */
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = session.user.id;
        const body = await request.json();
        const { content } = body;

        if (!content || typeof content !== "string") {
            return NextResponse.json({ error: "Message content required" }, { status: 400 });
        }

        // Get user's pod
        const pod = await prisma.masterclassPod.findUnique({
            where: { userId },
            include: {
                user: { select: { firstName: true, avatar: true } },
                zombieProfile: { select: { name: true, avatar: true } },
            },
        });

        if (!pod) {
            return NextResponse.json({ error: "No pod found" }, { status: 404 });
        }

        const now = new Date();

        // Save user's message
        const userMessage = await prisma.masterclassMessage.create({
            data: {
                podId: pod.id,
                dayNumber: pod.masterclassDay,
                senderType: "user",
                senderName: pod.user.firstName || "You",
                senderAvatar: pod.user.avatar,
                content: content.trim(),
                sentAt: now,
            },
        });

        // Update day progress - user replied
        await prisma.masterclassDayProgress.upsert({
            where: {
                podId_dayNumber: {
                    podId: pod.id,
                    dayNumber: pod.masterclassDay,
                },
            },
            update: { userReplied: true },
            create: {
                podId: pod.id,
                dayNumber: pod.masterclassDay,
                userReplied: true,
            },
        });

        // Log user message for admin view
        await prisma.podUserMessage.create({
            data: {
                userId,
                content: content.trim(),
                daysSinceEnrollment: pod.masterclassDay,
            },
        });

        // Get recent conversation history for AI context
        const recentMessages = await prisma.masterclassMessage.findMany({
            where: { podId: pod.id, sentAt: { not: null } },
            orderBy: { createdAt: "desc" },
            take: 10,
        });
        const conversationHistory = recentMessages.reverse().map(m =>
            `${m.senderName}: ${m.content}`
        ).join("\n");

        // Import knowledge context for rich AI prompts
        const {
            buildSarahPrompt,
            buildZombiePrompt,
            calculateSarahDelay,
            calculateZombieDelay
        } = await import("@/data/circle-pod-knowledge");

        // Import Anthropic and generate AI responses
        const { default: Anthropic } = await import("@anthropic-ai/sdk");
        const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

        const studentName = pod.user.firstName || "friend";
        const zombieName = pod.zombieProfile.name;
        const zombieFirstName = zombieName.split(" ")[0];

        // Build user context for AI
        const userContext = {
            firstName: studentName,
            email: session.user.email || "",
            certificationProgress: 8, // TODO: calculate from actual progress
            daysInPod: pod.masterclassDay,
            hasEngaged: true,
            lessonsCompleted: pod.masterclassDay * 2, // Approximate
            unlockedResources: [],
        };

        // Build zombie context
        const zombieContext = {
            name: zombieName,
            firstName: zombieFirstName,
            avatar: pod.zombieProfile.avatar || "/avatars/zombie-1.webp",
            age: 48,
            background: "Former ER nurse from Ohio, excited but nervous about this journey",
            goal: "Create genuine peer bond. Be the accountability partner who makes them feel less alone.",
            personality: ["Authentic and relatable", "Encouraging peer", "Slightly nervous but excited"],
            voice: "Casual, supportive peer. Uses contractions, casual language, emojis.",
            doList: [],
            dontList: [],
        };

        // 1. SARAH RESPONSE (15-60 min delay)
        const sarahDelayMinutes = calculateSarahDelay();
        const sarahResponseTime = new Date(now.getTime() + sarahDelayMinutes * 60 * 1000);

        const sarahPrompt = buildSarahPrompt(userContext, zombieContext, conversationHistory, content);

        let sarahResponse = "That's a great question! Let's explore that together 💛";
        try {
            const sarahAI = await anthropic.messages.create({
                model: "claude-haiku-4-5-20251001",
                max_tokens: 200,
                system: sarahPrompt,
                messages: [{ role: "user", content: content }],
            });
            if (sarahAI.content[0]?.type === "text") {
                sarahResponse = sarahAI.content[0].text;
            }
        } catch (e) {
            console.error("[MASTERCLASS] Sarah AI error:", e);
        }

        await prisma.masterclassMessage.create({
            data: {
                podId: pod.id,
                dayNumber: pod.masterclassDay,
                senderType: "sarah",
                senderName: "Sarah M.",
                senderAvatar: "/coaches/sarah-coach.webp",
                content: sarahResponse,
                scheduledFor: sarahResponseTime,
                sentAt: null, // Will be set by cron
            },
        });

        // 2. ZOMBIE RESPONSE (60-180 min delay)
        const zombieDelayMinutes = calculateZombieDelay();
        const zombieResponseTime = new Date(now.getTime() + zombieDelayMinutes * 60 * 1000);

        const zombiePrompt = buildZombiePrompt(userContext, zombieContext, conversationHistory, content, sarahResponse);

        let zombieResponse = `Totally agree with Sarah! You got this ${studentName}! 💪`;
        let zombieSkipped = false;
        try {
            const zombieAI = await anthropic.messages.create({
                model: "claude-haiku-4-5-20251001",
                max_tokens: 150,
                system: zombiePrompt,
                messages: [{ role: "user", content: content }],
            });
            if (zombieAI.content[0]?.type === "text") {
                const response = zombieAI.content[0].text.trim();
                // Check if AI decided to skip this message
                if (response.includes("[SKIP]") || response.toLowerCase() === "skip") {
                    zombieSkipped = true;
                } else {
                    zombieResponse = response;
                }
            }
        } catch (e) {
            console.error("[MASTERCLASS] Zombie AI error:", e);
        }

        // Only create zombie message if not skipped
        if (!zombieSkipped) {
            await prisma.masterclassMessage.create({
                data: {
                    podId: pod.id,
                    dayNumber: pod.masterclassDay,
                    senderType: "zombie",
                    senderName: zombieName,
                    senderAvatar: pod.zombieProfile.avatar,
                    content: zombieResponse,
                    scheduledFor: zombieResponseTime,
                    sentAt: null, // Will be set by cron
                },
            });
            console.log(`[MASTERCLASS] Scheduled: Sarah in ${Math.round(sarahDelayMinutes)}min, ${zombieFirstName} in ${Math.round(zombieDelayMinutes)}min`);
        } else {
            console.log(`[MASTERCLASS] Zombie skipped this response. Sarah scheduled in ${Math.round(sarahDelayMinutes)}min`);
        }

        return NextResponse.json({
            success: true,
            message: {
                id: userMessage.id,
                content: userMessage.content,
                createdAt: userMessage.createdAt,
            },
        });
    } catch (error) {
        console.error("[MASTERCLASS] Send message error:", error);
        return NextResponse.json(
            { error: "Failed to send message" },
            { status: 500 }
        );
    }
}
