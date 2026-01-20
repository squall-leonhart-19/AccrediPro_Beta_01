import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Helper for route params
type RouteParams = { params: Promise<{ userId: string }> };

// Tag to Course mapping for automatic enrollment
const TAG_TO_COURSE_SLUG: Record<string, string | string[]> = {
    "functional_medicine_complete_certification_purchased": "functional-medicine-complete-certification",
    "fm_certification_purchased": "functional-medicine-complete-certification",
    "fm certification purchased": "functional-medicine-complete-certification",
    "clickfunnels_purchase": "functional-medicine-complete-certification",
    "fm_pro_accelerator_purchased": ["fm-pro-advanced-clinical", "fm-pro-master-depth", "fm-pro-practice-path"],
    "fm_pro_advanced_clinical_purchased": "fm-pro-advanced-clinical",
    "fm_pro_master_depth_purchased": "fm-pro-master-depth",
    "fm_pro_practice_path_purchased": "fm-pro-practice-path",
    "holistic_nutrition_coach_certification_purchased": "holistic-nutrition-coach-certification",
    "hn_certification_purchased": "holistic-nutrition-coach-certification",
    "narc_recovery_coach_certification_purchased": "narc-recovery-coach-certification",
    "christian_life_coach_certification_purchased": "christian-life-coach-certification",
    "life_coach_certification_purchased": "life-coach-certification",
};

// Helper function to enroll user in a course
async function enrollUserInCourse(userId: string, courseSlug: string): Promise<{ success: boolean; courseName?: string; alreadyEnrolled?: boolean }> {
    const course = await prisma.course.findUnique({ where: { slug: courseSlug } });
    if (!course) {
        console.error(`[Tags] Course not found: ${courseSlug}`);
        return { success: false };
    }

    const existingEnrollment = await prisma.enrollment.findUnique({
        where: { userId_courseId: { userId, courseId: course.id } },
    });

    if (existingEnrollment) {
        return { success: true, courseName: course.title, alreadyEnrolled: true };
    }

    await prisma.enrollment.create({
        data: { userId, courseId: course.id, status: "ACTIVE", progress: 0 },
    });

    // Update course analytics
    await prisma.courseAnalytics.upsert({
        where: { courseId: course.id },
        update: { totalEnrolled: { increment: 1 } },
        create: { courseId: course.id, totalEnrolled: 1 },
    });

    return { success: true, courseName: course.title, alreadyEnrolled: false };
}

// POST - Add a tag to a user (with auto-enrollment)
export async function POST(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        // Write operation - no SUPPORT access
        if (!session?.user || !["ADMIN", "SUPERUSER", "INSTRUCTOR"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { userId } = await params;
        const body = await request.json();
        const { tag } = body; // Tag slug/name

        if (!tag) {
            return NextResponse.json({ error: "Tag name is required" }, { status: 400 });
        }

        const slug = tag.toLowerCase().replace(/[^a-z0-9-_]/g, "_");

        // 1. Find or create the MarketingTag definition
        let marketingTag = await prisma.marketingTag.findUnique({
            where: { slug }
        });

        if (!marketingTag) {
            marketingTag = await prisma.marketingTag.create({
                data: {
                    name: tag,
                    slug: slug,
                    category: "CUSTOM",
                    description: "Created manually via Admin Support"
                }
            });
        }

        // 2. Check if user already has it assigned
        const existingAssignment = await prisma.userMarketingTag.findUnique({
            where: {
                userId_tagId: {
                    userId,
                    tagId: marketingTag.id
                }
            }
        });

        if (existingAssignment) {
            return NextResponse.json({ message: "Tag already assigned", assignment: existingAssignment });
        }

        // 3. Assign to user
        const assignment = await prisma.userMarketingTag.create({
            data: {
                userId,
                tagId: marketingTag.id,
                source: "admin_manual"
            },
            include: {
                tag: true
            }
        });

        // 4. Auto-enrollment for purchase tags
        const normalizedTag = slug.toLowerCase().trim();
        const courseMapping = TAG_TO_COURSE_SLUG[normalizedTag] || TAG_TO_COURSE_SLUG[tag.toLowerCase()];
        const enrolledCourses: string[] = [];

        if (courseMapping) {
            const courseSlugs = Array.isArray(courseMapping) ? courseMapping : [courseMapping];

            for (const courseSlug of courseSlugs) {
                const result = await enrollUserInCourse(userId, courseSlug);
                if (result.success && result.courseName && !result.alreadyEnrolled) {
                    enrolledCourses.push(result.courseName);
                }
            }

            if (enrolledCourses.length > 0) {
                console.log(`[Tags] ✅ Auto-enrolled user ${userId} in: ${enrolledCourses.join(", ")}`);
            }
        }

        return NextResponse.json({
            assignment,
            coursesEnrolled: enrolledCourses,
            message: enrolledCourses.length > 0
                ? `Tag added + Enrolled in: ${enrolledCourses.join(", ")}`
                : "Tag added successfully"
        });
    } catch (error) {
        console.error("Failed to add tag:", error);
        return NextResponse.json({ error: "Failed to add tag" }, { status: 500 });
    }
}

// DELETE - Remove a tag
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const session = await getServerSession(authOptions);
        // Write operation - no SUPPORT access
        if (!session?.user || !["ADMIN", "SUPERUSER", "INSTRUCTOR"].includes(session.user.role as string)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { userId } = await params;
        const body = await request.json();
        const { tag } = body; // Tag slug

        if (!tag) {
            return NextResponse.json({ error: "Tag name is required" }, { status: 400 });
        }

        // Find the tag definition first
        const marketingTag = await prisma.marketingTag.findFirst({
            where: { OR: [{ slug: tag }, { name: tag }] }
        });

        if (!marketingTag) {
            return NextResponse.json({ error: "Tag definition not found" }, { status: 404 });
        }

        await prisma.userMarketingTag.deleteMany({
            where: {
                userId,
                tagId: marketingTag.id
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Failed to remove tag:", error);
        return NextResponse.json({ error: "Failed to remove tag" }, { status: 500 });
    }
}
