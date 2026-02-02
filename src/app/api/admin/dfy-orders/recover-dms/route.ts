import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/admin/dfy-orders/recover-dms
 *
 * Finds all DFY purchases where Jessica's welcome DM was never sent
 * and sends them now. Checks the Message table for existing DMs from
 * Jessica to each DFY customer.
 *
 * Also sends the DFY welcome email if it wasn't sent.
 */
export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session?.user ||
      !["ADMIN", "SUPERUSER"].includes(session.user.role || "")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find Jessica
    const jessica = await prisma.user.findFirst({
      where: { email: "jessica@accredipro-certificate.com" },
      select: { id: true, email: true },
    });

    if (!jessica) {
      return NextResponse.json(
        {
          error: "Jessica user not found",
          detail:
            "jessica@accredipro-certificate.com does not exist in the User table. Create this account first.",
        },
        { status: 404 }
      );
    }

    // Get ALL DFY purchases with user info
    const dfyPurchases = await prisma.dFYPurchase.findMany({
      include: {
        user: {
          select: { id: true, email: true, firstName: true },
        },
        product: {
          select: { id: true, title: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    if (dfyPurchases.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No DFY purchases found",
        recovered: 0,
      });
    }

    // Get all existing Jessica DMs to DFY customers (batch query)
    const dfyUserIds = dfyPurchases.map((p) => p.userId);
    const existingDMs = await prisma.message.findMany({
      where: {
        senderId: jessica.id,
        receiverId: { in: dfyUserIds },
        messageType: "DIRECT",
      },
      select: {
        receiverId: true,
        content: true,
        createdAt: true,
      },
    });

    // Group existing DMs by receiver
    const dmsByReceiver = new Map<
      string,
      { content: string; createdAt: Date }[]
    >();
    for (const dm of existingDMs) {
      const existing = dmsByReceiver.get(dm.receiverId) || [];
      existing.push({ content: dm.content, createdAt: dm.createdAt });
      dmsByReceiver.set(dm.receiverId, existing);
    }

    const recovered: {
      email: string | null;
      firstName: string | null;
      purchaseId: string;
      action: string;
    }[] = [];
    const skipped: {
      email: string | null;
      reason: string;
    }[] = [];

    for (const purchase of dfyPurchases) {
      const userDMs = dmsByReceiver.get(purchase.userId) || [];

      // Check if Jessica already sent an intake DM to this user
      const hasIntakeDM = userDMs.some(
        (dm) =>
          dm.content.includes("intake form") ||
          dm.content.includes("I'm Jessica")
      );

      if (hasIntakeDM) {
        skipped.push({
          email: purchase.user.email,
          reason: "Already has Jessica intake DM",
        });
        continue;
      }

      // Send the missing Jessica DM
      try {
        const intakeUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://learn.accredipro.academy"}/dfy-intake?id=${purchase.id}`;

        await prisma.message.create({
          data: {
            senderId: jessica.id,
            receiverId: purchase.userId,
            content: `Hey ${purchase.user.firstName || "there"}! 👋\n\nI'm Jessica, and I'll be personally handling your Done For You website setup! 🎉\n\nTo get started, I just need you to fill out a quick intake form (about 15 minutes). It helps me understand your coaching, your vibe, and exactly how you want your website to look.\n\n👉 Start your intake form here:\n${intakeUrl}\n\nI'll have your website ready within 7 days of receiving your form. Can't wait to build something amazing for you!`,
            messageType: "DIRECT",
          },
        });

        // Also send DFY welcome email if not already sent
        const hasWelcomeEmailTag = await prisma.userTag.findFirst({
          where: {
            userId: purchase.userId,
            tag: "dfy_welcome_email_sent",
          },
        });

        if (!hasWelcomeEmailTag && purchase.user.email) {
          try {
            const { sendDFYWelcomeEmail } = await import("@/lib/email");
            const intakeUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://learn.accredipro.academy"}/dfy-intake?id=${purchase.id}`;
            await sendDFYWelcomeEmail({
              to: purchase.user.email,
              firstName: purchase.user.firstName || "there",
              productName: purchase.product.title,
              intakeUrl,
            });

            await prisma.userTag.upsert({
              where: {
                userId_tag: {
                  userId: purchase.userId,
                  tag: "dfy_welcome_email_sent",
                },
              },
              update: {},
              create: { userId: purchase.userId, tag: "dfy_welcome_email_sent" },
            });

            recovered.push({
              email: purchase.user.email,
              firstName: purchase.user.firstName,
              purchaseId: purchase.id,
              action: "DM sent + Welcome email sent",
            });
          } catch (emailErr) {
            console.error(
              `[DFY Recover] Email failed for ${purchase.user.email}:`,
              emailErr
            );
            recovered.push({
              email: purchase.user.email,
              firstName: purchase.user.firstName,
              purchaseId: purchase.id,
              action: "DM sent (email failed)",
            });
          }
        } else {
          recovered.push({
            email: purchase.user.email,
            firstName: purchase.user.firstName,
            purchaseId: purchase.id,
            action: "DM sent (email already sent)",
          });
        }

        console.log(
          `[DFY Recover] ✅ Jessica DM sent to ${purchase.user.email} (${purchase.user.firstName})`
        );
      } catch (dmError) {
        console.error(
          `[DFY Recover] Failed to send DM to ${purchase.user.email}:`,
          dmError
        );
        skipped.push({
          email: purchase.user.email,
          reason: `DM creation failed: ${String(dmError)}`,
        });
      }
    }

    return NextResponse.json({
      success: true,
      jessicaId: jessica.id,
      totalDFYPurchases: dfyPurchases.length,
      recovered,
      recoveredCount: recovered.length,
      skipped,
      skippedCount: skipped.length,
    });
  } catch (error) {
    console.error("[DFY Recover DMs] Error:", error);
    return NextResponse.json(
      { error: "Recovery failed", details: String(error) },
      { status: 500 }
    );
  }
}
