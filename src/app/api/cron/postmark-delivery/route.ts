import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendPostmarkDeliveryConfirmation } from "@/lib/email";

/**
 * GET /api/cron/postmark-delivery
 *
 * Cron job that runs every 5 minutes.
 * Finds scheduled delivery confirmation jobs (15 min after purchase)
 * and sends them via Postmark.
 *
 * Purpose:
 * - Independent delivery log on separate email provider (dispute evidence)
 * - Second touchpoint in case original email hit spam
 * - Official delivery confirmation with order details for chargebacks
 */
export async function GET() {
  try {
    const now = new Date();

    // Find pending delivery confirmation jobs that are due
    const pendingJobs = await prisma.scheduledJob.findMany({
      where: {
        jobType: "postmark_delivery_confirmation",
        status: "PENDING",
        scheduledFor: { lte: now },
        attempts: { lt: 3 },
      },
      orderBy: { scheduledFor: "asc" },
      take: 20, // Process 20 at a time
    });

    if (pendingJobs.length === 0) {
      return NextResponse.json({ success: true, processed: 0, message: "No pending jobs" });
    }

    console.log(`[POSTMARK DELIVERY CRON] Processing ${pendingJobs.length} delivery confirmations`);

    const results: { jobId: string; email: string; status: string }[] = [];

    for (const job of pendingJobs) {
      const payload = job.payload as {
        to: string;
        firstName: string;
        productName: string;
        amount: string;
        transactionId?: string;
        purchaseDate: string;
      };

      // Mark as processing
      await prisma.scheduledJob.update({
        where: { id: job.id },
        data: { attempts: { increment: 1 } },
      });

      try {
        const result = await sendPostmarkDeliveryConfirmation({
          to: payload.to,
          firstName: payload.firstName,
          productName: payload.productName,
          amount: payload.amount,
          transactionId: payload.transactionId,
          purchaseDate: payload.purchaseDate,
        });

        if (result.success) {
          await prisma.scheduledJob.update({
            where: { id: job.id },
            data: {
              status: "COMPLETED",
              executedAt: new Date(),
            },
          });
          results.push({ jobId: job.id, email: payload.to, status: "sent" });
          console.log(`[POSTMARK DELIVERY CRON] ✅ Sent to ${payload.to}`);
        } else {
          await prisma.scheduledJob.update({
            where: { id: job.id },
            data: {
              lastError: result.error || "Unknown error",
            },
          });
          results.push({ jobId: job.id, email: payload.to, status: `failed: ${result.error}` });
          console.error(`[POSTMARK DELIVERY CRON] ❌ Failed for ${payload.to}: ${result.error}`);
        }
      } catch (error) {
        await prisma.scheduledJob.update({
          where: { id: job.id },
          data: {
            lastError: String(error),
          },
        });
        results.push({ jobId: job.id, email: payload.to, status: `error: ${String(error)}` });
        console.error(`[POSTMARK DELIVERY CRON] ❌ Error for ${payload.to}:`, error);
      }
    }

    const sent = results.filter((r) => r.status === "sent").length;
    const failed = results.filter((r) => r.status !== "sent").length;

    return NextResponse.json({
      success: true,
      processed: pendingJobs.length,
      sent,
      failed,
      results,
    });
  } catch (error) {
    console.error("[POSTMARK DELIVERY CRON] Fatal error:", error);
    return NextResponse.json(
      { error: "Cron failed", details: String(error) },
      { status: 500 }
    );
  }
}
