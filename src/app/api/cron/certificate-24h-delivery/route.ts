import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Resend } from "resend";
import { getConfigByExamCategory } from "@/lib/mini-diploma-registry";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * GET /api/cron/certificate-24h-delivery
 *
 * Called hourly to send certificate emails and Sarah DMs
 * for users who completed exam 24+ hours ago.
 */
export async function GET(request: NextRequest) {
    try {
        // Verify cron secret
        const authHeader = request.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const now = Date.now();
        const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

        // Find users who passed exam 24h ago but haven't received certificate email yet
        const eligibleUsers = await prisma.miniDiplomaExam.findMany({
            where: {
                passed: true,
                certificateEmailSent: false,
                createdAt: {
                    lte: new Date(now - TWENTY_FOUR_HOURS),
                },
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                        firstName: true,
                        lastName: true,
                    },
                },
            },
            orderBy: { createdAt: "asc" },
            take: 50, // Process in batches
        });

        console.log(`[CERT-24H] Found ${eligibleUsers.length} users to process`);

        let processed = 0;
        const results: { email: string; status: string }[] = [];

        for (const exam of eligibleUsers) {
            const user = exam.user;
            if (!user?.email) continue;

            const config = getConfigByExamCategory(exam.category);
            const nicheLabel = config?.displayName || exam.category
                .split("-")
                .map(w => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ");

            const portalSlug = config?.portalSlug || exam.category;
            const certificateUrl = `https://learn.accredipro.academy/portal/${portalSlug}/certificate`;
            const firstName = user.firstName || "there";

            try {
                // 1. Send certificate email from Sarah
                await resend.emails.send({
                    from: "Sarah <sarah@accredipro-certificate.com>",
                    to: user.email,
                    subject: `${firstName}, your ${nicheLabel} certificate is ready! 🎓`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
                            <p style="margin: 0 0 20px 0; font-size: 16px; color: #333;">Hey ${firstName}!</p>

                            <p style="margin: 0 0 15px 0; font-size: 15px; color: #444; line-height: 1.6;">
                                Great news — your <strong>${nicheLabel} Mini Diploma certificate</strong> is now ready to download!
                            </p>

                            <p style="margin: 0 0 15px 0; font-size: 15px; color: #444; line-height: 1.6;">
                                You can access it anytime here:
                            </p>

                            <p style="margin: 20px 0; font-size: 15px;">
                                <a href="${certificateUrl}" style="color: #722f37; font-weight: bold;">👉 Download your certificate</a>
                            </p>

                            <p style="margin: 0 0 15px 0; font-size: 15px; color: #444; line-height: 1.6;">
                                Add it to your LinkedIn profile and show the world you're certified!
                            </p>

                            <p style="margin: 0 0 15px 0; font-size: 15px; color: #444; line-height: 1.6;">
                                I've also sent you a message in the portal with some exciting news about your next steps.
                            </p>

                            <p style="margin: 25px 0 0 0; font-size: 15px; color: #444;">
                                So proud of you,<br/>
                                <strong>Sarah</strong>
                            </p>
                        </div>
                    `
                });

                // 2. Send Sarah DM
                const sarah = await prisma.user.findFirst({
                    where: { email: "sarah@accredipro-certificate.com" },
                });

                if (sarah) {
                    // Check for existing DM to avoid duplicates
                    const existingDM = await prisma.message.findFirst({
                        where: {
                            senderId: sarah.id,
                            receiverId: user.id,
                            content: { contains: "certificate is ready" },
                        },
                    });

                    if (!existingDM) {
                        await prisma.message.create({
                            data: {
                                senderId: sarah.id,
                                receiverId: user.id,
                                content: `${firstName}, your certificate is ready! 🎓

Congratulations on completing your ${nicheLabel} Mini Diploma!

📜 Your certificate is now available to download:
${certificateUrl}

Add it to LinkedIn, share it with colleagues, and celebrate this achievement!

This is just the beginning of your journey. When you're ready to take the next step toward building a real practice (and earning $3-10K/month), reply here and let's talk about the full certification program.

I'm so proud of you!

— Coach Sarah 💕`,
                            },
                        });
                    }
                }

                // 3. Mark email as sent
                await prisma.miniDiplomaExam.update({
                    where: { id: exam.id },
                    data: { certificateEmailSent: true },
                });

                processed++;
                results.push({ email: user.email, status: "sent" });
                console.log(`[CERT-24H] ✅ Sent certificate to ${user.email}`);

            } catch (error) {
                console.error(`[CERT-24H] Failed for ${user.email}:`, error);
                results.push({ email: user.email, status: "error" });
            }
        }

        console.log(`[CERT-24H] Processed ${processed}/${eligibleUsers.length} users`);

        return NextResponse.json({
            success: true,
            processed,
            total: eligibleUsers.length,
            results,
        });

    } catch (error) {
        console.error("[CERT-24H] Cron error:", error);
        return NextResponse.json(
            { error: "Failed to process certificates" },
            { status: 500 }
        );
    }
}
