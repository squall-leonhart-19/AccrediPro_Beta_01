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
    if (!includeLeads) {
      andConditions.push({
        // Temporarily relaxed to ensure Admins/Purchasers aren't hidden
        // AND: [
        //   { miniDiplomaOptinAt: null },
        //   { role: { not: "LEAD" } }
        // ]
        role: { not: "LEAD" }
      });
    }

    // Search filter (email, firstName, lastName)
    if (search) {
      andConditions.push({
        OR: [
          { email: { contains: search, mode: "insensitive" } },
          { firstName: { contains: search, mode: "insensitive" } },
          { lastName: { contains: search, mode: "insensitive" } },
        ],
      });
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
    const formattedUsers = users.map((user) => ({
      ...user,
      tags: [
        ...user.tags,
        ...user.marketingTags.map((mt) => ({
          id: mt.id,
          tag: mt.tag.slug,
          value: null,
          createdAt: new Date(),
        })),
      ],
    }));

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
