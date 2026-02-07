import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import path from "path";
import fs from "fs";

export const dynamic = "force-dynamic";

/**
 * POST /api/admin/scholarship-leads/export
 *
 * Exports scholarship leads data as CSV files directly to the project's exports/ folder.
 * Body: { type: "leads" | "conversations", data: ScholarshipLead[] }
 */
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { type, data } = await req.json();

        if (!type || !data || !Array.isArray(data)) {
            return NextResponse.json({ error: "Missing type or data" }, { status: 400 });
        }

        const exportDir = path.join(process.cwd(), "exports");
        if (!fs.existsSync(exportDir)) {
            fs.mkdirSync(exportDir, { recursive: true });
        }

        const date = new Date().toISOString().slice(0, 10);
        const time = new Date().toISOString().slice(11, 19).replace(/:/g, "-");
        const esc = (s: string) => `"${(s || "").replace(/"/g, '""').replace(/\n/g, " | ")}"`;

        let csv = "";
        let filename = "";

        if (type === "leads") {
            filename = `scholarship-leads-${date}_${time}.csv`;
            const rows = [
                ["Name", "Email", "Phone", "Status", "Specialization", "Income Goal", "Background", "Offered Amount", "Score", "Applied", "Drop-off Stage", "Messages Count"].join(","),
            ];
            data.forEach((l: Record<string, unknown>) => {
                rows.push([
                    esc(`${l.firstName} ${l.lastName || ""}`),
                    l.email as string,
                    (l.phone as string) || "",
                    l.status as string,
                    (l.specializationLabel as string) || "",
                    (l.incomeGoalLabel as string) || "",
                    (l.roleLabel as string) || "",
                    (l.offeredAmount as string) || "",
                    `${l.qualificationScore}%`,
                    new Date(l.applicationDate as string).toLocaleDateString(),
                    (l.dropOffStage as string) || "",
                    `${(l.messages as unknown[])?.length || 0}`,
                ].join(","));
            });
            csv = rows.join("\n");
        } else if (type === "conversations") {
            filename = `scholarship-conversations-${date}_${time}.csv`;
            const rows = [
                ["Lead Name", "Email", "Status", "Score", "Sender", "Message", "Timestamp", "Drop-off Stage"].join(","),
            ];
            data.forEach((l: Record<string, unknown>) => {
                const name = `${l.firstName} ${l.lastName || ""}`.trim();
                const messages = (l.messages as { isFromVisitor: boolean; message: string; createdAt: string }[]) || [];
                if (messages.length === 0) {
                    rows.push([
                        esc(name), l.email as string, l.status as string, `${l.qualificationScore}%`,
                        "", esc("(no messages)"), "", (l.dropOffStage as string) || "",
                    ].join(","));
                } else {
                    messages.forEach((msg) => {
                        rows.push([
                            esc(name), l.email as string, l.status as string, `${l.qualificationScore}%`,
                            msg.isFromVisitor ? "Lead" : "Sarah AI",
                            esc(msg.message),
                            new Date(msg.createdAt).toLocaleString(),
                            (l.dropOffStage as string) || "",
                        ].join(","));
                    });
                }
            });
            csv = rows.join("\n");
        } else {
            return NextResponse.json({ error: "Invalid type. Use 'leads' or 'conversations'" }, { status: 400 });
        }

        const filePath = path.join(exportDir, filename);
        fs.writeFileSync(filePath, "\uFEFF" + csv, "utf-8"); // BOM for Excel UTF-8

        return NextResponse.json({
            success: true,
            filename,
            path: filePath,
            rows: csv.split("\n").length - 1,
        });
    } catch (error) {
        console.error("[Export] Error:", error);
        return NextResponse.json({ error: "Export failed" }, { status: 500 });
    }
}
