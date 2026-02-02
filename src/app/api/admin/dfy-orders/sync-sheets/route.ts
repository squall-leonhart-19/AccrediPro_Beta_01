import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  fullSyncDFYOrdersToSheet,
  isGoogleSheetsConfigured,
} from "@/lib/google-sheets";

/**
 * POST /api/admin/dfy-orders/sync-sheets
 *
 * Full sync all DFY orders to Google Sheets.
 * Clears the sheet and re-writes all orders with latest data.
 * Admin only.
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

    if (!isGoogleSheetsConfigured()) {
      return NextResponse.json(
        {
          error: "Google Sheets not configured",
          detail:
            "Add GOOGLE_SHEETS_CLIENT_EMAIL, GOOGLE_SHEETS_PRIVATE_KEY, and DFY_GOOGLE_SHEET_ID to your environment variables.",
        },
        { status: 400 }
      );
    }

    // Get all DFY orders
    const orders = await prisma.dFYPurchase.findMany({
      include: {
        user: {
          select: {
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        product: {
          select: {
            title: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Transform for sheets
    const sheetOrders = orders.map((order) => ({
      id: order.id,
      createdAt: order.createdAt,
      userEmail: order.user.email || "",
      firstName: order.user.firstName || "",
      lastName: order.user.lastName || "",
      productTitle: order.product.title,
      purchasePrice: Number(order.purchasePrice),
      fulfillmentStatus: order.fulfillmentStatus,
      deliveredAt: order.deliveredAt,
      notes: order.notes,
      intakeData: order.intakeData as Record<string, any> | null,
    }));

    const result = await fullSyncDFYOrdersToSheet(sheetOrders);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Synced ${result.rowsWritten} orders to Google Sheets`,
        rowsWritten: result.rowsWritten,
      });
    } else {
      return NextResponse.json(
        { error: "Sync failed", detail: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("[DFY Sync Sheets] Error:", error);
    return NextResponse.json(
      { error: "Sync failed", details: String(error) },
      { status: 500 }
    );
  }
}
