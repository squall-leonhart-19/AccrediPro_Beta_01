import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { sendCourseEnrollmentEmail, sendProAcceleratorEnrollmentEmail } from "@/lib/email";
import { verifyEmail } from "@/lib/neverbounce";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * POST /api/admin/users/bulk-tag
 *
 * Apply a tag to multiple users at once.
 * If the tag maps to courses (via TAG_TO_COURSE_SLUG), auto-enrolls + upgrades LEAD→STUDENT + sends emails.
 *
 * Body: { userIds: string[], tag: string, sendEmails?: boolean }
 */

// Same mapping as tags/route.ts — keep in sync
const TAG_TO_COURSE_SLUG: Record<string, string | string[]> = {
    "functional_medicine_complete_certification_purchased": "functional-medicine-complete-certification",
    "fm_certification_purchased": "functional-medicine-complete-certification",
    "fm certification purchased": "functional-medicine-complete-certification",
    "certified functional medicine practitioner purchased": "functional-medicine-complete-certification",
    "clickfunnels_purchase": "functional-medicine-complete-certification",
    fm_pro_accelerator_purchased: [
        "fm-pro-advanced-clinical",
        "fm-pro-master-depth",
        "fm-pro-practice-path",
    ],
    fm_pro_advanced_clinical_purchased: "fm-pro-advanced-clinical",
    fm_pro_master_depth_purchased: "fm-pro-master-depth",
    fm_pro_practice_path_purchased: "fm-pro-practice-path",
    holistic_nutrition_coach_certification_purchased: "holistic-nutrition-coach-certification",
    hn_certification_purchased: "holistic-nutrition-coach-certification",
    hn_pro_accelerator_purchased: [
        "hn-pro-advanced-clinical",
        "hn-pro-master-depth",
        "hn-pro-practice-path",
    ],
    narc_recovery_coach_certification_purchased: "narc-recovery-coach-certification",
    narc_certification_purchased: "narc-recovery-coach-certification",
    narc_pro_accelerator_purchased: [
        "narc-pro-advanced-clinical",
        "narc-pro-master-depth",
        "narc-pro-practice-path",
    ],
    christian_life_coach_certification_purchased: "christian-life-coach-certification",
    life_coach_certification_purchased: "life-coach-certification",
    grief_loss_coach_certification_purchased: "grief-loss-coach-certification",
};

async function enrollUserInCourse(userId: string, courseSlug: string) {
    const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
    if (!course) return { success: false, courseName: null, alreadyEnrolled: false };

    const existing = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId: course.id } },
    });
    if (existing) return { success: true, courseName: course.title, alreadyEnrolled: true };

    await prisma.enrollment.create({
        data: { userId, courseId: course.id, status: "ACTIVE", progress: 0 },
    });
    await prisma.courseAnalytics.upsert({
        where: { courseId: course.id },
        update: { totalEnrolled: { increment: 1 } },
        create: { courseId: course.id, totalEnrolled: 1 },
    });
    await prisma.userTag.upsert({
        where: { userId_tag: { userId, tag: `enrolled_${courseSlug}` } },
        update: {},
        create: { userId, tag: `enrolled_${courseSlug}` },
    });
    return { success: true, courseName: course.title, alreadyEnrolled: false };
}

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
    if (!["ADMIN", "SUPERUSER"].includes(admin?.role || "")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userIds, tag, sendEmails = true } = await req.json();

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        return NextResponse.json({ error: "userIds required" }, { status: 400 });
    }
    if (!tag || typeof tag !== "string") {
        return NextResponse.json({ error: "tag required" }, { status: 400 });
    }

    const results = {
        total: userIds.length,
        tagged: 0,
        alreadyTagged: 0,
        enrolled: 0,
        alreadyEnrolled: 0,
        upgraded: 0,
        emailsSent: 0,
        errors: [] as string[],
    };

    const normalizedTag = tag.toLowerCase().trim();
    const courseMapping = TAG_TO_COURSE_SLUG[normalizedTag] || TAG_TO_COURSE_SLUG[tag];
    const courseSlugs = courseMapping
        ? Array.isArray(courseMapping) ? courseMapping : [courseMapping]
        : [];
    const isProAccelerator = tag.includes("pro_accelerator");

    for (const userId of userIds) {
        try {
            // 1. Add tag
            const existingTag = await prisma.userTag.findUnique({
                where: { userId_tag: { userId, tag } },
            });

            if (existingTag) {
                results.alreadyTagged++;
            } else {
                await prisma.userTag.create({ data: { userId, tag } });
                results.tagged++;
            }

            // 2. Enroll in courses (if mapped)
            const enrolledCourses: string[] = [];
            for (const slug of courseSlugs) {
                const enrollResult = await enrollUserInCourse(userId, slug);
                if (enrollResult.success && enrollResult.courseName) {
                    if (enrollResult.alreadyEnrolled) {
                        results.alreadyEnrolled++;
                    } else {
                        results.enrolled++;
                        enrolledCourses.push(enrollResult.courseName);
                    }
                }
            }

            // 3. Upgrade LEAD → STUDENT
            if (enrolledCourses.length > 0) {
                try {
                    const { upgradeLeadToStudent, isPaidCourseSlug } = await import("@/lib/upgrade-lead-to-student");
                    const hasPaidCourse = courseSlugs.some((s: string) => isPaidCourseSlug(s));
                    if (hasPaidCourse) {
                        const upgradeResult = await upgradeLeadToStudent(userId, { source: "bulk-tag" });
                        if (upgradeResult.upgraded) results.upgraded++;
                    }
                } catch { /* ignore upgrade errors */ }
            }

            // 4. Send enrollment email
            if (sendEmails && enrolledCourses.length > 0) {
                try {
                    const user = await prisma.user.findUnique({
                        where: { id: userId },
                        select: { email: true, firstName: true },
                    });

                    if (user?.email) {
                        const emailCheck = await verifyEmail(user.email);
                        if (emailCheck.isValid) {
                            if (isProAccelerator) {
                                const niche = tag.startsWith("hn_") ? "HN" : tag.startsWith("narc_") ? "NARC" : "FM";
                                await sendProAcceleratorEnrollmentEmail(user.email, user.firstName || "Student", niche);
                            } else {
                                await sendCourseEnrollmentEmail(
                                    user.email,
                                    user.firstName || "Student",
                                    enrolledCourses[0],
                                    courseSlugs[0],
                                );
                            }
                            results.emailsSent++;
                        }
                    }
                } catch (emailErr) {
                    console.error(`[Bulk Tag] Email failed for ${userId}:`, emailErr);
                }
            }
        } catch (err) {
            results.errors.push(`${userId}: ${String(err)}`);
            console.error(`[Bulk Tag] Error for ${userId}:`, err);
        }

        // Small delay to avoid overwhelming the DB / email service
        await new Promise((r) => setTimeout(r, 50));
    }

    console.log(`[Bulk Tag] Done: ${JSON.stringify(results)}`);

    return NextResponse.json({
        success: true,
        tag,
        courseSlugs,
        results,
    });
}
