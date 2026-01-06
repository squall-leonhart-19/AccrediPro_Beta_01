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

    const tickets = await prisma.supportTicket.findMany({
      where,
      orderBy: [
        { status: "asc" }, // NEW first
        { priority: "desc" }, // URGENT first
        { createdAt: "desc" },
      ],
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            avatar: true,
            email: true,
            createdAt: true,
            payments: {
              take: 5,
              orderBy: { createdAt: "desc" },
              select: {
                id: true,
                amount: true,
                currency: true,
                status: true,
                productName: true,
                createdAt: true,
              }
            },
            submittedTickets: {
              where: { status: { not: "CLOSED" } },
              orderBy: { createdAt: "desc" },
              select: {
                id: true,
                ticketNumber: true,
                subject: true,
                status: true,
                createdAt: true,
              }
            },
            // Marketing tags for quick context
            marketingTags: {
              include: {
                tag: {
                  select: {
                    id: true,
                    name: true,
                    slug: true,
                    color: true,
                    category: true,
                  }
                }
              }
            },
            // Enrollments for context (progress is already on enrollment)
            enrollments: {
              select: {
                id: true,
                status: true,
                progress: true,
                enrolledAt: true,
                completedAt: true,
                course: {
                  select: {
                    id: true,
                    title: true,
                    slug: true,
                  }
                }
              },
              orderBy: { enrolledAt: "desc" }
            }
          }
        },
        assignedTo: { select: { firstName: true, lastName: true } },
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            sentBy: { select: { firstName: true, lastName: true } },
          },
        },
        _count: { select: { messages: true } },
      },
      take: 100,
    });

    // --- ANALYTICS CALCULATIONS ---

    // 1. Status Counts
    const statusGroups = await prisma.supportTicket.groupBy({
      by: ["status"],
      _count: { status: true },
    });

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

    // 2. Average Rating (Customers)
    const ratingAgg = await prisma.supportTicket.aggregate({
      where: {
        rating: { not: null },
      },
      _avg: { rating: true },
      _count: { rating: true },
    });

    // 3. 30-Day Volume
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newTicketsLast30d = await prisma.supportTicket.count({
      where: { createdAt: { gte: thirtyDaysAgo } },
    });

    const resolvedTicketsLast30d = await prisma.supportTicket.count({
      where: {
        status: { in: ["RESOLVED", "CLOSED"] },
        updatedAt: { gte: thirtyDaysAgo }
      },
    });

    // 4. Recent Feedback
    const recentFeedback = await prisma.supportTicket.findMany({
      where: { rating: { not: null } },
      select: {
        rating: true,
        ratingComment: true,
        customerName: true,
        ratedAt: true,
      },
      orderBy: { ratedAt: "desc" },
      take: 5,
    });

    // 5. Avg Response Time (Last 30 days)
    const ticketsWithResponse = await prisma.supportTicket.findMany({
      where: {
        firstResponseAt: { not: null },
        createdAt: { gte: thirtyDaysAgo },
      },
      select: { createdAt: true, firstResponseAt: true },
    });

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

    return NextResponse.json({
      tickets,
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
