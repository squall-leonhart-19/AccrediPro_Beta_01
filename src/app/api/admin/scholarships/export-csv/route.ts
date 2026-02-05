import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

/**
 * POST /api/admin/scholarships/export-csv
 *
 * Export scholarship applications to CSV and save to server folder.
 * Also returns the CSV for browser download.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || !["ADMIN", "SUPERUSER"].includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all scholarship chat conversations
    const chats = await prisma.salesChat.findMany({
      where: {
        page: { contains: "scholarship" },
      },
      orderBy: { createdAt: "desc" },
    });

    // Group by visitorId
    const grouped = new Map<string, typeof chats>();
    for (const chat of chats) {
      const existing = grouped.get(chat.visitorId) || [];
      existing.push(chat);
      grouped.set(chat.visitorId, existing);
    }

    // Build CSV rows
    const rows: string[] = [];

    // Header
    rows.push([
      "Name",
      "Email",
      "Specialization",
      "Income Goal",
      "Current Income",
      "Vision",
      "Past Certs",
      "Offered Amount",
      "Status",
      "Messages Count",
      "Last Message",
      "Last Message Date",
      "Full Conversation",
    ].join(","));

    // Data rows
    for (const [visitorId, messages] of grouped) {
      // Sort messages by time
      messages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      // Find application data
      const appMsg = messages.find(m => m.message.includes("SCHOLARSHIP APPLICATION"));
      const appData: Record<string, string> = {};
      if (appMsg) {
        const lines = appMsg.message.split("\n");
        for (const line of lines) {
          if (line.startsWith("Name:")) appData.name = line.replace("Name:", "").trim();
          if (line.startsWith("Email:")) appData.email = line.replace("Email:", "").trim();
          if (line.startsWith("Specialization:")) appData.specialization = line.replace("Specialization:", "").trim();
          if (line.startsWith("Income Goal:")) appData.incomeGoal = line.replace("Income Goal:", "").trim();
          if (line.startsWith("Current Income:")) appData.currentIncome = line.replace("Current Income:", "").trim();
          if (line.startsWith("Vision:")) appData.vision = line.replace("Vision:", "").trim();
          if (line.startsWith("Past Certs:")) appData.pastCerts = line.replace("Past Certs:", "").trim();
        }
      }

      // Get name/email from optin or message
      const name = appData.name || messages[0]?.visitorName || "";
      const email = appData.email || messages[0]?.visitorEmail || "";

      // Find offered amount from user messages
      let offeredAmount = "";
      const userMsgs = messages.filter(m => m.isFromVisitor && !m.message.includes("SCHOLARSHIP APPLICATION"));
      for (const msg of userMsgs) {
        const match = msg.message.match(/\$?(\d{1,3}(?:,?\d{3})*(?:\.\d{2})?)/);
        if (match) {
          offeredAmount = match[0].startsWith("$") ? match[0] : `$${match[0]}`;
          break;
        }
      }

      // Status
      const unreadCount = messages.filter(m => !m.isRead && m.isFromVisitor).length;
      const hasResponse = messages.some(m => !m.isFromVisitor);
      const status = unreadCount > 0 ? "Pending" : hasResponse ? "Responded" : "New";

      // Conversation (excluding application data)
      const convMsgs = messages.filter(m => !m.message.includes("SCHOLARSHIP APPLICATION"));
      const conversation = convMsgs
        .map(m => `[${m.isFromVisitor ? name || "Visitor" : "Sarah M."}]: ${m.message.replace(/[\n\r,]/g, " ")}`)
        .join(" | ");

      const lastMsg = convMsgs[convMsgs.length - 1];

      const row = [
        `"${(name).replace(/"/g, '""')}"`,
        `"${(email).replace(/"/g, '""')}"`,
        `"${(appData.specialization || "").replace(/"/g, '""')}"`,
        `"${(appData.incomeGoal || "").replace(/"/g, '""')}"`,
        `"${(appData.currentIncome || "").replace(/"/g, '""')}"`,
        `"${(appData.vision || "").replace(/"/g, '""')}"`,
        `"${(appData.pastCerts || "").replace(/"/g, '""')}"`,
        `"${offeredAmount.replace(/"/g, '""')}"`,
        `"${status}"`,
        convMsgs.length,
        `"${(lastMsg?.message || "").replace(/"/g, '""').replace(/[\n\r]/g, " ").slice(0, 100)}"`,
        `"${lastMsg ? new Date(lastMsg.createdAt).toLocaleString() : ""}"`,
        `"${conversation.replace(/"/g, '""').slice(0, 500)}"`,
      ];
      rows.push(row.join(","));
    }

    const csv = rows.join("\n");

    // Save to server folder
    const exportDir = join(process.cwd(), "exports", "scholarship-csvs");
    if (!existsSync(exportDir)) {
      await mkdir(exportDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().split("T")[0];
    const timeStr = new Date().toISOString().replace(/[:.]/g, "-");
    const filename = `scholarship-applications-${timestamp}-${timeStr}.csv`;
    const filepath = join(exportDir, filename);

    await writeFile(filepath, csv, "utf-8");

    console.log(`[CSV Export] Saved ${grouped.size} applications to ${filepath}`);

    // Return CSV for browser download
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "X-Server-Path": filepath,
      },
    });
  } catch (error) {
    console.error("[CSV Export] Error:", error);
    return NextResponse.json({ error: "Failed to export CSV" }, { status: 500 });
  }
}
