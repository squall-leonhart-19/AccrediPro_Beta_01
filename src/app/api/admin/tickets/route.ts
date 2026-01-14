import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET - List all tickets with filters
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "INSTRUCTOR"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const category = searchParams.get("category");
    const assignedToMe = searchParams.get("assignedToMe") === "true";
    const assignedTo = searchParams.get("assignedTo"); // userId or "UNASSIGNED"
    const dateRange = searchParams.get("dateRange"); // TODAY, WEEK, MONTH
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};

    if (status && status !== "ALL") {
      where.status = status;
    }
    if (priority && priority !== "ALL") {
      where.priority = priority;
    }
    if (category && category !== "ALL") {
      where.category = category;
    }

    // Assignment filter logic
    if (assignedToMe) {
      where.assignedToId = session.user.id;
    } else if (assignedTo) {
      if (assignedTo === "UNASSIGNED") {
        where.assignedToId = null;
      } else {
        where.assignedToId = assignedTo;
      }
    }

    // Date range filter
    if (dateRange) {
      const now = new Date();
      let startDate = new Date();

      switch (dateRange) {
        case "TODAY":
          startDate.setHours(0, 0, 0, 0);
          break;
        case "WEEK":
          startDate.setDate(now.getDate() - 7);
          break;
        case "MONTH":
          startDate.setMonth(now.getMonth() - 1);
          break;
      }

      if (["TODAY", "WEEK", "MONTH"].includes(dateRange)) {
        where.createdAt = { gte: startDate };
      }
    }

    if (search) {
      where.OR = [
        { subject: { contains: search, mode: "insensitive" } },
        { customerName: { contains: search, mode: "insensitive" } },
        { customerEmail: { contains: search, mode: "insensitive" } },
        { ticketNumber: { equals: parseInt(search) || -1 } },
      ];
    }

    // Calculate 30 days ago once for reuse
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Run all queries in PARALLEL for maximum speed
    const [
      tickets,
      statusGroups,
      ratingAgg,
      newTicketsLast30d,
      resolvedTicketsLast30d,
      recentFeedback,
      ticketsWithResponse,
    ] = await Promise.all([
      // 1. Main tickets query - OPTIMIZED: lighter includes, load details on demand
      prisma.supportTicket.findMany({
        where,
        orderBy: [
          { status: "asc" },
          { priority: "desc" },
          { createdAt: "desc" },
        ],
        select: {
          id: true,
          ticketNumber: true,
          subject: true,
          status: true,
          priority: true,
          category: true,
          department: true,
          customerName: true,
          customerEmail: true,
          createdAt: true,
          updatedAt: true,
          rating: true,
          ratingComment: true,
          userId: true,
          assignedToId: true,
          // Minimal user info for list view
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              avatar: true,
              email: true,
              createdAt: true,
              // Only load counts, not full records
              _count: {
                select: {
                  payments: true,
                  submittedTickets: true,
                  enrollments: true,
                }
              }
            }
          },
          assignedTo: { select: { firstName: true, lastName: true } },
          // Only load latest 3 messages for preview
          messages: {
            orderBy: { createdAt: "desc" },
            take: 3,
            select: {
              id: true,
              content: true,
              isFromCustomer: true,
              isInternal: true,
              createdAt: true,
              sentBy: { select: { firstName: true, lastName: true } },
            },
          },
          _count: { select: { messages: true } },
        },
        take: 100,
      }),

      // 2. Status counts
      prisma.supportTicket.groupBy({
        by: ["status"],
        _count: { status: true },
      }),

      // 3. Rating aggregate
      prisma.supportTicket.aggregate({
        where: { rating: { not: null } },
        _avg: { rating: true },
        _count: { rating: true },
      }),

      // 4. New tickets count (30 days)
      prisma.supportTicket.count({
        where: { createdAt: { gte: thirtyDaysAgo } },
      }),

      // 5. Resolved tickets count (30 days)
      prisma.supportTicket.count({
        where: {
          status: { in: ["RESOLVED", "CLOSED"] },
          updatedAt: { gte: thirtyDaysAgo }
        },
      }),

      // 6. Recent feedback
      prisma.supportTicket.findMany({
        where: { rating: { not: null } },
        select: {
          rating: true,
          ratingComment: true,
          customerName: true,
          ratedAt: true,
        },
        orderBy: { ratedAt: "desc" },
        take: 5,
      }),

      // 7. Response time data
      prisma.supportTicket.findMany({
        where: {
          firstResponseAt: { not: null },
          createdAt: { gte: thirtyDaysAgo },
        },
        select: { createdAt: true, firstResponseAt: true },
      }),
    ]);

    // Process status counts
    const statsMap: any = {
      total: 0,
      NEW: 0,
      OPEN: 0,
      PENDING: 0,
      RESOLVED: 0,
      CLOSED: 0,
    };

    statusGroups.forEach((s) => {
      statsMap[s.status as keyof typeof statsMap] = s._count.status;
      statsMap.total += s._count.status;
    });

    // Calculate avg response time
    let totalResponseTime = 0;
    if (ticketsWithResponse.length > 0) {
      ticketsWithResponse.forEach(t => {
        if (t.firstResponseAt) {
          totalResponseTime += t.firstResponseAt.getTime() - t.createdAt.getTime();
        }
      });
    }
    const avgResponseTimeHours = ticketsWithResponse.length > 0
      ? (totalResponseTime / ticketsWithResponse.length / (1000 * 60 * 60))
      : 0;

    // Reverse messages to show oldest first (we fetched newest first for efficiency)
    const ticketsWithReversedMessages = tickets.map(t => ({
      ...t,
      messages: [...t.messages].reverse(),
    }));

    return NextResponse.json({
      tickets: ticketsWithReversedMessages,
      stats: {
        ...statsMap,
        avgRating: ratingAgg._avg.rating || 0,
        ratingCount: ratingAgg._count.rating || 0,
        newTickets30d: newTicketsLast30d,
        resolvedTickets30d: resolvedTicketsLast30d,
        recentFeedback,
        avgResponseTime: avgResponseTimeHours,
      }
    });
  } catch (error) {
    console.error("Failed to fetch tickets:", error);
    return NextResponse.json({ error: "Failed to fetch tickets" }, { status: 500 });
  }
}

// Auto-detect category from subject/message
function detectCategory(subject: string, message: string): string {
  const text = `${subject} ${message}`.toLowerCase();

  if (text.includes("refund") || text.includes("cancel") || text.includes("money back") || text.includes("chargeback")) {
    return "REFUND";
  }
  if (text.includes("access") || text.includes("login") || text.includes("password") || text.includes("can't get in") || text.includes("locked out")) {
    return "ACCESS";
  }
  if (text.includes("certificate") || text.includes("completion") || text.includes("credential") || text.includes("diploma")) {
    return "CERTIFICATES";
  }
  if (text.includes("billing") || text.includes("payment") || text.includes("charge") || text.includes("invoice") || text.includes("receipt")) {
    return "BILLING";
  }
  if (text.includes("module") || text.includes("lesson") || text.includes("course") || text.includes("video") || text.includes("content")) {
    return "COURSE_CONTENT";
  }
  if (text.includes("error") || text.includes("bug") || text.includes("broken") || text.includes("not working") || text.includes("crash")) {
    return "TECHNICAL";
  }
  return "GENERAL";
}

// Auto-detect priority from subject/message
function detectPriority(subject: string, message: string): string {
  const text = `${subject} ${message}`.toLowerCase();

  // URGENT: Financial issues, broken access, time-sensitive
  if (text.includes("urgent") || text.includes("asap") || text.includes("immediately") ||
      text.includes("refund") || text.includes("chargeback") || text.includes("can't access") ||
      text.includes("exam tomorrow") || text.includes("deadline")) {
    return "URGENT";
  }

  // HIGH: Access issues, payment problems
  if (text.includes("can't login") || text.includes("locked out") || text.includes("payment failed") ||
      text.includes("not working") || text.includes("certificate not") || text.includes("stuck")) {
    return "HIGH";
  }

  // LOW: General questions, feedback
  if (text.includes("question") || text.includes("curious") || text.includes("wondering") ||
      text.includes("suggestion") || text.includes("feedback") || text.includes("just wanted")) {
    return "LOW";
  }

  return "MEDIUM";
}

// POST - Create a new ticket (from admin or customer form)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { subject, message, customerName, customerEmail, category, priority, userId } = body;

    if (!subject || !message || !customerName || !customerEmail) {
      return NextResponse.json(
        { error: "Subject, message, name, and email are required" },
        { status: 400 }
      );
    }

    // Auto-detect category and priority if not provided
    const detectedCategory = category || detectCategory(subject, message);
    const detectedPriority = priority || detectPriority(subject, message);

    // Create ticket with initial message
    const ticket = await prisma.supportTicket.create({
      data: {
        subject,
        customerName,
        customerEmail,
        category: detectedCategory,
        priority: detectedPriority,
        userId: userId || null,
        messages: {
          create: {
            content: message,
            isFromCustomer: true,
          },
        },
      },
      include: {
        messages: true,
      },
    });

    return NextResponse.json({ ticket });
  } catch (error) {
    console.error("Failed to create ticket:", error);
    return NextResponse.json({ error: "Failed to create ticket" }, { status: 500 });
  }
}
