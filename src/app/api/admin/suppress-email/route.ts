import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

/**
 * POST /api/admin/suppress-email
 * Add suppression tag to a user (bounced, complained, unsubscribed)
 *
 * Body: { email: string, reason: "bounced" | "complained" | "unsubscribed" | "do_not_contact" }
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, reason = "bounced" } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();

    // Find the user
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      include: {
        marketingTags: {
          include: { tag: true }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: `User not found: ${normalizedEmail}` }, { status: 404 });
    }

    // Map reason to tag slug
    const tagSlugMap: Record<string, string> = {
      bounced: "suppress_bounced",
      complained: "suppress_complained",
      unsubscribed: "suppress_unsubscribed",
      do_not_contact: "suppress_do_not_contact",
    };

    const tagSlug = tagSlugMap[reason] || "suppress_bounced";

    // Find the suppression tag
    const tag = await prisma.marketingTag.findUnique({
      where: { slug: tagSlug }
    });

    if (!tag) {
      return NextResponse.json({ error: `Suppression tag not found: ${tagSlug}` }, { status: 404 });
    }

    // Check if already suppressed
    const existingTag = user.marketingTags.find(t => t.tag.slug === tagSlug);
    if (existingTag) {
      return NextResponse.json({
        success: true,
        message: `User ${normalizedEmail} already has suppression tag: ${tagSlug}`,
        alreadySuppressed: true,
      });
    }

    // Add suppression tag
    await prisma.userMarketingTag.create({
      data: {
        userId: user.id,
        tagId: tag.id,
        source: "manual_admin",
      }
    });

    console.log(`[SUPPRESS] Added ${tagSlug} to ${normalizedEmail} by admin ${session.user.email}`);

    return NextResponse.json({
      success: true,
      message: `Added suppression tag '${tagSlug}' to ${normalizedEmail}`,
      userId: user.id,
      tagSlug,
    });

  } catch (error) {
    console.error("Suppress email error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

/**
 * GET /api/admin/suppress-email?email=xxx
 * Check if an email is suppressed
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const email = request.nextUrl.searchParams.get("email");

    if (!email) {
      return NextResponse.json({ error: "Email parameter required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        marketingTags: {
          where: {
            tag: {
              slug: {
                in: ["suppress_bounced", "suppress_complained", "suppress_unsubscribed", "suppress_do_not_contact"]
              }
            }
          },
          include: { tag: true }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ exists: false, suppressed: false });
    }

    const suppressionTags = user.marketingTags.map(t => t.tag.slug);

    return NextResponse.json({
      exists: true,
      suppressed: suppressionTags.length > 0,
      tags: suppressionTags,
      userId: user.id,
    });

  } catch (error) {
    console.error("Check suppression error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/suppress-email
 * Remove suppression tag from a user
 *
 * Body: { email: string, reason: "bounced" | "complained" | "unsubscribed" | "do_not_contact" }
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { email, reason = "bounced" } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json({ error: `User not found: ${normalizedEmail}` }, { status: 404 });
    }

    const tagSlugMap: Record<string, string> = {
      bounced: "suppress_bounced",
      complained: "suppress_complained",
      unsubscribed: "suppress_unsubscribed",
      do_not_contact: "suppress_do_not_contact",
    };

    const tagSlug = tagSlugMap[reason] || "suppress_bounced";

    const tag = await prisma.marketingTag.findUnique({
      where: { slug: tagSlug }
    });

    if (!tag) {
      return NextResponse.json({ error: `Tag not found: ${tagSlug}` }, { status: 404 });
    }

    // Remove the tag
    const deleted = await prisma.userMarketingTag.deleteMany({
      where: {
        userId: user.id,
        tagId: tag.id,
      }
    });

    console.log(`[SUPPRESS] Removed ${tagSlug} from ${normalizedEmail} by admin ${session.user.email}`);

    return NextResponse.json({
      success: true,
      message: `Removed suppression tag '${tagSlug}' from ${normalizedEmail}`,
      removed: deleted.count > 0,
    });

  } catch (error) {
    console.error("Remove suppression error:", error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
