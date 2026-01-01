import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateCertificateId } from "@/lib/certificate-service";
import { sendEmail } from "@/lib/email";
import { triggerAutoMessage } from "@/lib/auto-messages";

/**
 * GET /api/cron/issue-mini-diploma-certificates
 *
 * Called by cron job (e.g., every hour) to auto-issue certificates
 * for mini diploma completions that are at least 24 hours old.
 *
 * When certificate is issued:
 * - Certificate is created in database
 * - Email notification is sent
 * - User gets 30-day graduate access (accessExpiresAt extended)
 */
export async function GET(request: NextRequest) {
    try {
        // Verify cron secret (for Vercel cron or similar)
        const authHeader = request.headers.get("authorization");
        const cronSecret = process.env.CRON_SECRET;

        if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const now = new Date();
        const cutoffTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

        // Find users who:
        // 1. Have completed their mini diploma (miniDiplomaCompletedAt is set)
        // 2. Completed at least 24 hours ago
        // 3. Don't have a certificate yet for the mini diploma course
        const usersToIssue = await prisma.user.findMany({
            where: {
                miniDiplomaCompletedAt: {
                    not: null,
                    lte: cutoffTime,
                },
                miniDiplomaCategory: { not: null },
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                miniDiplomaCategory: true,
                miniDiplomaCompletedAt: true,
                enrollments: {
                    where: {
                        course: {
                            slug: {
                                in: [
                                    "womens-health-mini-diploma",
                                    "fm-mini-diploma",
                                ],
                            },
                        },
                    },
                    include: {
                        course: {
                            select: {
                                id: true,
                                slug: true,
                                title: true,
                            },
                        },
                    },
                },
                certificates: {
                    where: {
                        course: {
                            slug: {
                                in: [
                                    "womens-health-mini-diploma",
                                    "fm-mini-diploma",
                                ],
                            },
                        },
                    },
                },
            },
        });

        let issuedCount = 0;
        const results: { email: string; status: string; certificateId?: string }[] = [];

        for (const user of usersToIssue) {
            // Find the relevant enrollment
            const enrollment = user.enrollments[0];
            if (!enrollment || !enrollment.course) {
                results.push({ email: user.email, status: "no_enrollment" });
                continue;
            }

            // Check if certificate already exists
            if (user.certificates.length > 0) {
                results.push({
                    email: user.email,
                    status: "already_issued",
                    certificateId: user.certificates[0].certificateNumber,
                });
                continue;
            }

            // Generate certificate
            const certificateNumber = generateCertificateId(enrollment.course.slug);

            try {
                // Create certificate
                const certificate = await prisma.certificate.create({
                    data: {
                        userId: user.id,
                        courseId: enrollment.course.id,
                        certificateNumber,
                        type: "MINI_DIPLOMA",
                        issuedAt: new Date(),
                    },
                });

                // Grant 30-day graduate access
                const graduateAccessExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
                await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        accessExpiresAt: graduateAccessExpiry,
                        hasCertificateBadge: true,
                    },
                });

                // Add graduate tag for tracking
                await prisma.userTag.upsert({
                    where: { userId_tag: { userId: user.id, tag: "mini-diploma-graduate" } },
                    update: { value: now.toISOString() },
                    create: { userId: user.id, tag: "mini-diploma-graduate", value: now.toISOString() },
                });

                issuedCount++;
                results.push({
                    email: user.email,
                    status: "issued",
                    certificateId: certificate.certificateNumber,
                });

                // Send certificate ready email
                const studentName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Student";
                const certificateUrl = `${process.env.NEXTAUTH_URL}/womens-health-diploma/certificates`;

                await sendEmail({
                    to: user.email,
                    subject: `🎓 Your ${enrollment.course.title} Certificate is Ready!`,
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="utf-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        </head>
                        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
                            <div style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                                <div style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); padding: 40px 30px; text-align: center;">
                                    <h1 style="color: #D4AF37; margin: 0; font-size: 28px;">🎓 Your Certificate is Ready!</h1>
                                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 16px;">${enrollment.course.title}</p>
                                </div>

                                <div style="padding: 40px 30px;">
                                    <p style="font-size: 18px; color: #333;">Hi ${studentName},</p>

                                    <p style="color: #555; font-size: 16px;">Great news! Your official certificate for the <strong style="color: #722F37;">${enrollment.course.title}</strong> is now ready to download.</p>

                                    <div style="background: linear-gradient(135deg, #FDF5E6 0%, #FFF8DC 100%); border: 2px solid #D4AF37; border-radius: 12px; padding: 25px; margin: 25px 0; text-align: center;">
                                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #8B7355;">Certificate Number</p>
                                        <p style="margin: 0; font-size: 20px; font-weight: bold; font-family: monospace; color: #722F37;">${certificateNumber}</p>
                                    </div>

                                    <p style="color: #555; font-size: 16px;">Your certificate is:</p>
                                    <ul style="color: #555; font-size: 14px; padding-left: 20px;">
                                        <li>✓ Professionally designed and verified</li>
                                        <li>✓ Downloadable as a PDF</li>
                                        <li>✓ Shareable with a unique verification link</li>
                                    </ul>

                                    <div style="text-align: center; margin: 30px 0;">
                                        <a href="${certificateUrl}" style="background: linear-gradient(135deg, #722F37 0%, #8B3A42 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold; font-size: 16px;">Download Your Certificate</a>
                                    </div>

                                    <div style="background: #fff3e0; border: 1px solid #ff9800; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                        <p style="margin: 0 0 10px 0; font-weight: bold; color: #e65100;">🎁 Your 30-Day Graduate Access is Active!</p>
                                        <p style="margin: 0; color: #555; font-size: 14px;">As a Mini Diploma graduate, you now have <strong>30 days of exclusive access</strong> to browse our full course catalog with special graduate pricing (20% off). Explore your next certification!</p>
                                        <div style="text-align: center; margin-top: 15px;">
                                            <a href="${process.env.NEXTAUTH_URL}/catalog" style="background: #ff9800; color: white; padding: 10px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; font-size: 14px;">Browse Catalog →</a>
                                        </div>
                                    </div>
                                </div>

                                <div style="background: #f8f9fa; padding: 20px 30px; text-align: center; border-top: 1px solid #eee;">
                                    <p style="margin: 0; color: #999; font-size: 12px;">AccrediPro Academy</p>
                                </div>
                            </div>
                        </body>
                        </html>
                    `,
                }).catch((err) => {
                    console.error(`Failed to send certificate email to ${user.email}:`, err);
                });

                // Create notification
                await prisma.notification.create({
                    data: {
                        userId: user.id,
                        type: "SYSTEM",
                        title: "🎓 Your Certificate is Ready!",
                        message: `Your ${enrollment.course.title} certificate is now available to download!`,
                        data: { certificateId: certificate.id },
                    },
                });

                // Send certificate ready DM from Sarah (Women's Health only)
                if (enrollment.course.slug === "womens-health-mini-diploma") {
                    await triggerAutoMessage({
                        userId: user.id,
                        trigger: "wh_certificate_ready",
                    }).catch((err) => {
                        console.error(`Failed to send certificate DM to ${user.email}:`, err);
                    });
                }

                console.log(`✅ Certificate ${certificateNumber} issued for ${user.email}`);
            } catch (error) {
                console.error(`Failed to issue certificate for ${user.email}:`, error);
                results.push({ email: user.email, status: "error" });
            }
        }

        console.log(`📜 Certificate cron completed: ${issuedCount} certificates issued out of ${usersToIssue.length} eligible users`);

        return NextResponse.json({
            success: true,
            processed: usersToIssue.length,
            issued: issuedCount,
            results,
        });
    } catch (error) {
        console.error("Certificate cron error:", error);
        return NextResponse.json(
            { error: "Failed to process certificates" },
            { status: 500 }
        );
    }
}
