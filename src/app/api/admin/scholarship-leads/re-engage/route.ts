import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Resend } from "resend";
import prisma from "@/lib/prisma";
import path from "path";
import fs from "fs";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // Allow up to 60s for sending many emails

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = "Sarah M. <sarah@accredipro.academy>";
const CHECKOUT_100 = "https://www.fanbasis.com/agency-checkout/AccrediPro/p8WmQ";

/**
 * POST /api/admin/scholarship-leads/re-engage
 *
 * 1. Saves all leads as JSON to exports/
 * 2. Sends segmented re-engagement emails via Resend
 *
 * Body: { dryRun?: boolean } — set true to just save JSON without sending emails
 */
export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const admin = await prisma.user.findUnique({ where: { id: session.user.id }, select: { role: true } });
    if (!["ADMIN", "SUPERUSER"].includes(admin?.role || "")) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const dryRun = body.dryRun === true;

    // Get all scholarship leads
    const scholarshipTags = await prisma.userTag.findMany({
        where: { tag: "scholarship_application_submitted" },
        include: {
            user: {
                select: {
                    id: true, email: true, firstName: true, lastName: true,
                    enrollments: { where: { course: { OR: [{ slug: { contains: "certification" } }, { slug: { contains: "accelerator" } }] } }, select: { id: true } },
                    tags: { select: { tag: true, value: true, metadata: true, createdAt: true } },
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    // Get chat messages
    const allChats = await prisma.salesChat.findMany({
        where: { page: { contains: "scholarship", mode: "insensitive" } },
        orderBy: { createdAt: "asc" },
        select: { visitorId: true, visitorEmail: true, message: true, isFromVisitor: true, createdAt: true },
    });

    const chatsByEmail: Record<string, typeof allChats> = {};
    allChats.forEach(c => {
        const e = c.visitorEmail?.toLowerCase();
        if (e) { if (!chatsByEmail[e]) chatsByEmail[e] = []; chatsByEmail[e].push(c); }
    });

    // Build leads JSON
    const leads = scholarshipTags.map(st => {
        const u = st.user;
        const tags = Object.fromEntries(u.tags.map(t => [t.tag, { value: t.value, metadata: t.metadata }]));
        const meta = st.metadata as { quizData?: Record<string, string>; visitorId?: string } | null;
        const qd = meta?.quizData || {};
        const email = u.email?.toLowerCase() || "";
        const msgs = chatsByEmail[email] || [];
        const status = tags["scholarship_status"]?.value || "pending";
        const offeredAmount = tags["scholarship_offered_amount"]?.value || null;
        const hasConverted = u.enrollments.length > 0;

        // Determine drop-off segment
        let segment = "silent"; // never replied
        const leadMsgs = msgs.filter(m => m.isFromVisitor && !m.message.includes("SCHOLARSHIP APPLICATION"));
        if (hasConverted) segment = "converted";
        else if (leadMsgs.length > 0) {
            const gotLink = msgs.some(m => !m.isFromVisitor && (m.message.includes("fanbasis.com") || m.message.includes("stripe.com")));
            if (gotLink) segment = "got_link_no_pay";
            else if (offeredAmount) segment = "named_price";
            else segment = "chatted_no_price";
        }

        return {
            id: u.id,
            email,
            firstName: u.firstName || "there",
            lastName: u.lastName || "",
            status,
            segment,
            offeredAmount,
            hasConverted,
            quizData: qd,
            applicationDate: st.createdAt.toISOString(),
            messageCount: msgs.length,
            leadMessageCount: leadMsgs.length,
        };
    });

    // Save JSON — use /tmp on Vercel (read-only filesystem), exports/ locally
    const isVercel = !!process.env.VERCEL;
    const exportDir = isVercel
        ? "/tmp"
        : path.join(process.cwd(), "exports");
    if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir, { recursive: true });

    const date = new Date().toISOString().slice(0, 10);
    const jsonPath = path.join(exportDir, `scholarship-leads-${date}.json`);
    try {
        fs.writeFileSync(jsonPath, JSON.stringify(leads, null, 2), "utf-8");
    } catch (fsErr) {
        console.error("[Re-engage] Failed to save JSON (read-only fs?):", fsErr);
        // Don't block email sending if file write fails
    }

    // Segment counts
    const segments = { silent: 0, chatted_no_price: 0, named_price: 0, got_link_no_pay: 0, converted: 0 };
    leads.forEach(l => { if (l.segment in segments) segments[l.segment as keyof typeof segments]++; });

    if (dryRun) {
        return NextResponse.json({
            success: true,
            dryRun: true,
            jsonSaved: jsonPath,
            totalLeads: leads.length,
            segments,
            message: "JSON saved. Set dryRun=false to send emails.",
        });
    }

    // ═══ SEND RE-ENGAGEMENT EMAILS ═══
    const results = { sent: 0, skipped: 0, failed: 0, errors: [] as string[] };
    const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

    for (const lead of leads) {
        if (!lead.email || lead.email.includes("test@") || lead.hasConverted) {
            results.skipped++;
            continue;
        }

        let subject = "";
        let text = "";
        const fn = lead.firstName;

        switch (lead.segment) {
            case "silent":
                // Never replied after seeing value stack
                subject = `${fn}, your scholarship is still reserved`;
                text = `Hey ${fn},

I noticed you qualified for the FM Certification scholarship but we never got to chat!

Your spot is still reserved. Here's what's waiting for you:

→ Full BC-FMP™ Board Certification (20 Modules — 4 Levels)
→ Done-For-You Website to attract clients
→ Business Box + Legal Templates + Coach Workspace
→ 9 international accreditations
→ Lifetime access — no recurring fees

The best part? The Institute covers most of the $4,997 cost. Most students pay just $100–$300.

Ready to claim your scholarship? Just tap below:
👉 ${CHECKOUT_100}

Or reply to this email and I'll personally help you get set up.

— Sarah M.
Scholarship Director, AccrediPro Institute

P.S. This isn't a mass email — I'm reaching out because your quiz responses showed real potential. Don't let this opportunity pass you by.`;
                break;

            case "chatted_no_price":
                // Chatted but never named an amount
                subject = `${fn}, I'm still here 💜`;
                text = `Hey ${fn},

We chatted about your FM Certification scholarship and I realized I may not have explained things clearly enough.

Here's the simple version:
→ The full program is $4,997
→ The Institute covers whatever you can't
→ Most students pay $100–$300 (that's it!)
→ ONE-TIME payment, lifetime access

You don't need a medical background. You don't need experience. You just need the desire to help people heal.

Your scholarship is still active. Ready to lock it in?
👉 ${CHECKOUT_100}

Just reply to this email if you have any questions. I'm here for you.

— Sarah M.`;
                break;

            case "named_price":
                // Named a price but Sarah didn't respond or they dropped
                subject = `${fn}, I owe you an apology`;
                text = `Hey ${fn},

I think I may have missed your message in the chat — and I'm really sorry about that.

Your scholarship is 100% still available. The Institute is still willing to cover the difference.

Here's your direct enrollment link with the scholarship applied:
👉 ${CHECKOUT_100}

If you'd like a different amount, just reply to this email with what works for you and I'll get it set up personally.

You qualified for a reason, ${fn}. I don't want a technical glitch to be the thing that holds you back.

— Sarah M.

P.S. If you already enrolled through another link, just ignore this — and congratulations! 🎉`;
                break;

            case "got_link_no_pay":
                // Got checkout link but didn't complete payment
                subject = `${fn}, your link is still active`;
                text = `Hey ${fn},

Just wanted to let you know — your scholarship enrollment link is still active:
👉 ${CHECKOUT_100}

I know life gets busy. There's no pressure and no expiration on your scholarship.

When you're ready:
1. Tap the link above
2. Complete enrollment
3. Check your email in 5 minutes for login credentials
4. Start Module 1 immediately

If something stopped you last time (link issues, questions, concerns), just reply to this email. I'll personally help.

Your future self will thank you.

— Sarah M.
Scholarship Director, AccrediPro Institute`;
                break;

            default:
                results.skipped++;
                continue;
        }

        try {
            await resend.emails.send({
                from: FROM_EMAIL,
                to: lead.email,
                subject,
                text,
            });
            results.sent++;
            console.log(`[Re-engage] Sent ${lead.segment} email to ${lead.email}`);
        } catch (err) {
            results.failed++;
            results.errors.push(`${lead.email}: ${String(err)}`);
            console.error(`[Re-engage] Failed for ${lead.email}:`, err);
        }

        // Rate limit: 100ms between sends
        await delay(100);
    }

    return NextResponse.json({
        success: true,
        jsonSaved: jsonPath,
        totalLeads: leads.length,
        segments,
        emailResults: results,
    });
}
