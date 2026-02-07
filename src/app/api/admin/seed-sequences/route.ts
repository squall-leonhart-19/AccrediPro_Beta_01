import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { MINI_DIPLOMA_REGISTRY } from "@/lib/mini-diploma-registry";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/seed-sequences
 * 
 * Seeds the Sequence + SequenceEmail tables for all mini-diploma niches.
 * This populates the /admin/leads/sequences dashboard.
 * 
 * Each niche gets TWO sequences:
 * 1. "Started" - 6-email nudge series (3h, 12h, 24h, 36h, 48h, 72h)
 * 2. "Completed" - post-completion nurture for scholarship/upsell
 */
export async function POST() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { role: true },
    });

    if (!["ADMIN", "SUPERUSER"].includes(user?.role || "")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // The 6-email nudge sequence for Mini Diploma leads
    const NUDGE_EMAILS = [
        {
            order: 1,
            subject: "{firstName}, 847 women started this week",
            delayHours: 3,
            delayDays: 0,
            description: "Social proof urgency — 847 women started",
        },
        {
            order: 2,
            subject: "{firstName}, are you still thinking about it?",
            delayHours: 12,
            delayDays: 0,
            description: "Re-engagement — haven't started yet",
        },
        {
            order: 3,
            subject: "Your 48-hour access is running out ⏰",
            delayHours: 0,
            delayDays: 1,
            description: "Urgency + progress reminder at 24h",
        },
        {
            order: 4,
            subject: "{firstName}, women like you are making $4K+/mo",
            delayHours: 12,
            delayDays: 1,
            description: "Income aspiration at 36h",
        },
        {
            order: 5,
            subject: "FINAL: Your Mini-Diploma expires tonight",
            delayHours: 0,
            delayDays: 2,
            description: "Final urgency at 48h",
        },
        {
            order: 6,
            subject: "{firstName}, we reopened your access for 24 more hours",
            delayHours: 0,
            delayDays: 3,
            description: "Grace period extension at 72h",
        },
    ];

    // Post-completion nurture sequence for scholarship/certification upsell
    const NURTURE_EMAILS = [
        {
            order: 1,
            subject: "🎉 Congrats {firstName}! Your certificate is ready",
            delayHours: 1,
            delayDays: 0,
            description: "Immediate congrats + certificate download",
        },
        {
            order: 2,
            subject: "{firstName}, here's what graduates are doing right now...",
            delayHours: 0,
            delayDays: 1,
            description: "Graduate success stories + scholarship hint",
        },
        {
            order: 3,
            subject: "The scholarship you qualified for ✨",
            delayHours: 0,
            delayDays: 2,
            description: "Scholarship offer reveal",
        },
        {
            order: 4,
            subject: "{firstName}, Sarah left you a voicemail",
            delayHours: 0,
            delayDays: 3,
            description: "Sarah personal voicemail + scholarship reminder",
        },
        {
            order: 5,
            subject: "Your scholarship expires tomorrow",
            delayHours: 0,
            delayDays: 6,
            description: "Scholarship expiration urgency",
        },
    ];

    let created = 0;
    let updated = 0;
    const results: { niche: string; started: string; completed: string }[] = [];

    for (const [slug, config] of Object.entries(MINI_DIPLOMA_REGISTRY)) {
        const nicheName = config.name;
        const startedSlug = `${config.portalSlug}-started`;
        const completedSlug = `${config.portalSlug}-completed`;

        // --- STARTED SEQUENCE ---
        const existingStarted = await prisma.sequence.findUnique({
            where: { slug: startedSlug },
        });

        let startedId: string;
        if (existingStarted) {
            startedId = existingStarted.id;
            updated++;
        } else {
            const seq = await prisma.sequence.create({
                data: {
                    name: `${nicheName} Mini-Diploma — Nudge Sequence`,
                    slug: startedSlug,
                    description: `6-email nudge series for ${nicheName} mini-diploma leads who haven't completed. Fires at 3h, 12h, 24h, 36h, 48h, 72h after signup.`,
                    triggerType: "MINI_DIPLOMA_STARTED",
                    isActive: true,
                    isSystem: true,
                    priority: 10,
                    courseCategory: config.portalSlug,
                },
            });
            startedId = seq.id;

            // Create sequence emails
            for (const email of NUDGE_EMAILS) {
                await prisma.sequenceEmail.create({
                    data: {
                        sequenceId: startedId,
                        customSubject: email.subject.replace("{firstName}", "{{firstName}}"),
                        customContent: email.description,
                        order: email.order,
                        delayDays: email.delayDays,
                        delayHours: email.delayHours,
                        sendAtHour: 9, // 9 AM preferred send time
                        isActive: true,
                    },
                });
            }
            created++;
        }

        // --- COMPLETED SEQUENCE ---
        const existingCompleted = await prisma.sequence.findUnique({
            where: { slug: completedSlug },
        });

        let completedId: string;
        if (existingCompleted) {
            completedId = existingCompleted.id;
            updated++;
        } else {
            const seq = await prisma.sequence.create({
                data: {
                    name: `${nicheName} Mini-Diploma — Nurture Sequence`,
                    slug: completedSlug,
                    description: `Post-completion nurture for ${nicheName} graduates. Scholarship offer + certification upsell over 7 days.`,
                    triggerType: "MINI_DIPLOMA_COMPLETED",
                    isActive: true,
                    isSystem: true,
                    priority: 20,
                    courseCategory: config.portalSlug,
                },
            });
            completedId = seq.id;

            // Create sequence emails
            for (const email of NURTURE_EMAILS) {
                await prisma.sequenceEmail.create({
                    data: {
                        sequenceId: completedId,
                        customSubject: email.subject.replace("{firstName}", "{{firstName}}"),
                        customContent: email.description,
                        order: email.order,
                        delayDays: email.delayDays,
                        delayHours: email.delayHours,
                        sendAtHour: 10, // 10 AM preferred send time
                        isActive: true,
                    },
                });
            }
            created++;
        }

        results.push({
            niche: nicheName,
            started: existingStarted ? "exists" : "created",
            completed: existingCompleted ? "exists" : "created",
        });
    }

    return NextResponse.json({
        success: true,
        message: `Seeded ${created} new sequences, ${updated} already existed`,
        results,
    });
}

/**
 * GET /api/admin/seed-sequences
 * Check current sequence counts
 */
export async function GET() {
    const sequences = await prisma.sequence.findMany({
        where: {
            triggerType: {
                in: ["MINI_DIPLOMA_STARTED", "MINI_DIPLOMA_COMPLETED"],
            },
        },
        select: {
            id: true,
            name: true,
            slug: true,
            triggerType: true,
            isActive: true,
            _count: { select: { emails: true, enrollments: true } },
        },
        orderBy: { name: "asc" },
    });

    return NextResponse.json({
        total: sequences.length,
        sequences,
    });
}
