import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * GET /api/admin/users/list
 * Paginated users endpoint with server-side search
 *
 * Query params:
 * - page: number (default 1)
 * - limit: number (default 50)
 * - search: string (searches email, firstName, lastName)
 * - role: string (STUDENT, ADMIN, etc.)
 * - status: string (active, inactive)
 * - includeLeads: boolean (default false) - includes mini diploma leads
 *
 * NOTE: Mini diploma leads are excluded by default (they have their own /admin/leads page)
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const status = searchParams.get("status") || "";
    const userId = searchParams.get("userId") || "";

    const skip = (page - 1) * limit;
    const includeLeads = searchParams.get("includeLeads") === "true";

    // Build where clause with AND conditions
    const andConditions: any[] = [
      { isFakeProfile: false },
      { email: { not: null } },
    ];

    // By default, exclude mini diploma leads (they have their own /admin/leads page)
    // Only show them if explicitly requested with includeLeads=true
    // if (!includeLeads) {
    //   andConditions.push({
    //     // Temporarily relaxed to ensure Admins/Purchasers aren't hidden
    //     // AND: [
    //     //   { miniDiplomaOptinAt: null },
    //     //   { role: { not: "LEAD" } }
    //     // ]
    //     role: { not: "LEAD" }
    //   });
    // }

    // Search filter (email, firstName, lastName, or full name)
    if (search) {
      const searchTerms = search.trim().split(/\s+/);

      if (searchTerms.length >= 2) {
        // Multi-word search: try matching first + last name combination
        andConditions.push({
          OR: [
            { email: { contains: search, mode: "insensitive" } },
            // Match "John Smith" as firstName=John, lastName=Smith
            {
              AND: [
                { firstName: { contains: searchTerms[0], mode: "insensitive" } },
                { lastName: { contains: searchTerms.slice(1).join(" "), mode: "insensitive" } },
              ],
            },
            // Also try reverse: lastName first, firstName second
            {
              AND: [
                { lastName: { contains: searchTerms[0], mode: "insensitive" } },
                { firstName: { contains: searchTerms.slice(1).join(" "), mode: "insensitive" } },
              ],
            },
            // Fallback: any word matches either field
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
          ],
        });
      } else {
        // Single word search
        andConditions.push({
          OR: [
            { email: { contains: search, mode: "insensitive" } },
            { firstName: { contains: search, mode: "insensitive" } },
            { lastName: { contains: search, mode: "insensitive" } },
          ],
        });
      }
    }

    // Role filter
    if (role && role !== "ALL") {
      andConditions.push({ role });
    }

    // Status filter
    if (status === "active") {
      andConditions.push({ isActive: true });
    } else if (status === "inactive") {
      andConditions.push({ isActive: false });
    }

    // ID filter (for direct links)
    if (userId) {
      andConditions.push({ id: userId });
    }

    // Build final where clause
    const where: any = { AND: andConditions };

    // Get total count and role stats in parallel with users
    const [totalCount, users, roleStats] = await Promise.all([
      prisma.user.count({ where }),
      prisma.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          avatar: true,
          phone: true,
          role: true,
          isActive: true,
          createdAt: true,
          lastLoginAt: true,
          leadSource: true,
          leadSourceDetail: true,
          hasCompletedOnboarding: true,
          learningGoal: true,
          experienceLevel: true,
          focusAreas: true,
          bio: true,
          tags: {
            select: {
              id: true,
              tag: true,
              value: true,
              createdAt: true,
            },
            orderBy: { createdAt: "desc" },
          },
          enrollments: {
            include: {
              course: {
                select: {
                  id: true,
                  title: true,
                  slug: true,
                },
              },
            },
          },
          streak: true,
          _count: {
            select: {
              certificates: true,
              progress: true,
              receivedMessages: true,
              sentMessages: true,
            },
          },
          marketingTags: {
            select: {
              id: true,
              tag: {
                select: {
                  slug: true,
                  name: true,
                },
              },
            },
          },
        },
      }),
      prisma.user.groupBy({
        by: ['role'],
        _count: { id: true },
      })
    ]);

    // Format stats
    const stats = {
      total: totalCount,
      student: roleStats.find(r => r.role === "STUDENT")?._count.id || 0,
      instructor: roleStats.find(r => r.role === "INSTRUCTOR")?._count.id || 0,
      admin: roleStats.find(r => r.role === "ADMIN")?._count.id || 0,
      mentor: roleStats.find(r => r.role === "MENTOR")?._count.id || 0,
    };

    // Merge legacy tags with marketing tags for UI display
    // Also calculate mini diploma progress from lesson completion tags
    const formattedUsers = users.map((user) => {
      const allTags = [
        ...user.tags,
        ...user.marketingTags.map((mt) => ({
          id: mt.id,
          tag: mt.tag.slug,
          value: null,
          createdAt: new Date(),
        })),
      ];

      // Calculate mini diploma progress from lesson-complete tags
      // Pattern: {niche}-lesson-complete:{lessonNumber}
      const miniDiplomaProgress: Record<string, number> = {};
      const lessonTagPatterns = [
        { pattern: /^functional-medicine-lesson-complete:(\d+)$/, niche: 'functional-medicine', total: 9 },
        { pattern: /^womens-health-lesson-complete:(\d+)$/, niche: 'womens-health', total: 9 },
        { pattern: /^gut-health-lesson-complete:(\d+)$/, niche: 'gut-health', total: 9 },
        { pattern: /^hormone-health-lesson-complete:(\d+)$/, niche: 'hormone-health', total: 9 },
        { pattern: /^holistic-nutrition-lesson-complete:(\d+)$/, niche: 'holistic-nutrition', total: 9 },
        { pattern: /^nurse-coach-lesson-complete:(\d+)$/, niche: 'nurse-coach', total: 9 },
        { pattern: /^health-coach-lesson-complete:(\d+)$/, niche: 'health-coach', total: 9 },
      ];

      for (const tag of allTags) {
        for (const { pattern, niche, total } of lessonTagPatterns) {
          if (pattern.test(tag.tag)) {
            if (!miniDiplomaProgress[niche]) {
              miniDiplomaProgress[niche] = 0;
            }
            miniDiplomaProgress[niche]++;
          }
        }
      }

      // Calculate overall mini diploma completion percentage
      let miniDiplomaCompletedLessons = 0;
      let miniDiplomaTotalLessons = 0;
      for (const niche of Object.keys(miniDiplomaProgress)) {
        miniDiplomaCompletedLessons += miniDiplomaProgress[niche];
        miniDiplomaTotalLessons += 9; // Each mini diploma has 9 lessons
      }
      const miniDiplomaProgressPercent = miniDiplomaTotalLessons > 0
        ? Math.round((miniDiplomaCompletedLessons / miniDiplomaTotalLessons) * 100)
        : 0;

      return {
        ...user,
        tags: allTags,
        miniDiplomaProgress,
        miniDiplomaProgressPercent,
      };
    });

    return NextResponse.json({
      users: formattedUsers,
      stats,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        hasMore: skip + users.length < totalCount,
      },
    });
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
