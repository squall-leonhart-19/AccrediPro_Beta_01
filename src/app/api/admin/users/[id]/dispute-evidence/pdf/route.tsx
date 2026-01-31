import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { lookupIpLocation, parseUserAgent, formatLocation } from "@/lib/ip-geolocation";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

// Register a standard font for the PDF
Font.register({
    family: "NotoSans",
    src: "https://fonts.gstatic.com/s/notosans/v28/o-0IIpQlx3QUlC5A4PNr5TRA.woff2",
});

// PDF Styles - Legal Document Theme
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: "NotoSans",
        backgroundColor: "#ffffff",
    },
    header: {
        marginBottom: 20,
        borderBottom: "2px solid #722F37",
        paddingBottom: 15,
    },
    logo: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#722F37",
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 11,
        color: "#D4AF37",
        fontWeight: "bold",
    },
    caseRef: {
        fontSize: 9,
        color: "#666",
        marginTop: 5,
    },
    section: {
        marginBottom: 15,
        padding: 12,
        backgroundColor: "#fafafa",
        borderRadius: 4,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: "bold",
        color: "#722F37",
        marginBottom: 8,
        borderBottom: "1px solid #ddd",
        paddingBottom: 4,
    },
    row: {
        flexDirection: "row",
        marginBottom: 4,
    },
    label: {
        width: "35%",
        fontSize: 9,
        color: "#666",
    },
    value: {
        width: "65%",
        fontSize: 9,
        color: "#333",
    },
    highlight: {
        backgroundColor: "#f0fdf4",
        padding: 8,
        marginBottom: 10,
        borderLeft: "3px solid #22c55e",
    },
    highlightText: {
        fontSize: 9,
        color: "#166534",
        fontWeight: "bold",
    },
    warning: {
        backgroundColor: "#fef3c7",
        padding: 8,
        marginBottom: 10,
        borderLeft: "3px solid #f59e0b",
    },
    warningText: {
        fontSize: 9,
        color: "#92400e",
    },
    timeline: {
        marginTop: 5,
    },
    timelineItem: {
        flexDirection: "row",
        marginBottom: 3,
        paddingVertical: 2,
        borderBottom: "1px dotted #eee",
    },
    timelineDate: {
        width: "30%",
        fontSize: 8,
        color: "#666",
    },
    timelineAction: {
        width: "70%",
        fontSize: 8,
        color: "#333",
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 40,
        right: 40,
        borderTop: "1px solid #ddd",
        paddingTop: 10,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    footerText: {
        fontSize: 7,
        color: "#999",
    },
    summary: {
        marginTop: 10,
        padding: 12,
        backgroundColor: "#722F37",
        borderRadius: 4,
    },
    summaryTitle: {
        fontSize: 11,
        fontWeight: "bold",
        color: "#D4AF37",
        marginBottom: 8,
    },
    summaryText: {
        fontSize: 9,
        color: "#ffffff",
        lineHeight: 1.5,
    },
});

// Dispute reason types
type DisputeReason = "fraud" | "services_not_received" | "canceled" | "misrepresentation" | "general";

// GET /api/admin/users/[id]/dispute-evidence/pdf
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session?.user || !["ADMIN", "MENTOR"].includes((session.user as any).role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: userId } = await params;
    const url = new URL(request.url);
    const reason = (url.searchParams.get("reason") || "general") as DisputeReason;
    const disputeId = url.searchParams.get("disputeId") || "";
    const arn = url.searchParams.get("arn") || "";

    try {
        // Fetch user with all evidence data
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                enrollments: {
                    include: {
                        course: { select: { title: true, slug: true } },
                    },
                },
                certificates: {
                    include: {
                        course: { select: { title: true } },
                    },
                },
                tags: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Fetch lesson progress
        const lessonProgress = await prisma.lessonProgress.findMany({
            where: { userId },
            include: {
                lesson: {
                    include: {
                        module: {
                            include: {
                                course: { select: { title: true } },
                            },
                        },
                    },
                },
            },
            orderBy: { completedAt: "asc" },
            take: 50,
        });

        // Fetch activity log
        const activities = await prisma.userActivity.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            take: 30,
        });

        // Fetch emails sent
        const emailsSent = await prisma.emailSend.findMany({
            where: { userId },
            orderBy: { createdAt: "asc" },
            take: 10,
        });

        // Get IP geolocation
        const geoLocation = user.registrationIp
            ? await lookupIpLocation(user.registrationIp)
            : null;

        // Parse user agent
        const deviceInfo = parseUserAgent(user.registrationUserAgent);

        // Calculate metrics
        const totalLessonsStarted = lessonProgress.length;
        const totalLessonsCompleted = lessonProgress.filter(lp => lp.isCompleted).length;
        const totalWatchMinutes = lessonProgress.reduce((acc, lp) => acc + (lp.watchTime || 0), 0) / 60;
        const firstLessonDate = lessonProgress.find(lp => lp.completedAt)?.completedAt;

        // Generate the PDF document
        const EvidenceDocument = () => (
            <Document>
                <Page size="A4" style={styles.page}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.logo}>ACCREDIPRO ACADEMY</Text>
                        <Text style={styles.subtitle}>Official Chargeback Defense Evidence</Text>
                        <Text style={styles.caseRef}>
                            {disputeId && `Dispute ID: ${disputeId} | `}
                            {arn && `ARN: ${arn} | `}
                            Generated: {new Date().toISOString()}
                        </Text>
                    </View>

                    {/* Dispute Summary */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>DISPUTE SUMMARY</Text>
                        <View style={styles.row}>
                            <Text style={styles.label}>Dispute Reason:</Text>
                            <Text style={styles.value}>{getReasonLabel(reason)}</Text>
                        </View>
                        {disputeId && (
                            <View style={styles.row}>
                                <Text style={styles.label}>Dispute ID:</Text>
                                <Text style={styles.value}>{disputeId}</Text>
                            </View>
                        )}
                        {arn && (
                            <View style={styles.row}>
                                <Text style={styles.label}>ARN:</Text>
                                <Text style={styles.value}>{arn}</Text>
                            </View>
                        )}
                    </View>

                    {/* Customer Identification */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>SECTION 1: CUSTOMER IDENTIFICATION</Text>
                        <View style={styles.row}>
                            <Text style={styles.label}>Full Name:</Text>
                            <Text style={styles.value}>{user.firstName} {user.lastName}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Email Address:</Text>
                            <Text style={styles.value}>{user.email}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Account Created:</Text>
                            <Text style={styles.value}>{user.createdAt?.toISOString()}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Phone:</Text>
                            <Text style={styles.value}>{user.phone || "Not provided"}</Text>
                        </View>
                    </View>

                    {/* Legal Acceptance - Priority for all dispute types */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>SECTION 2: LEGAL ACCEPTANCE PROOF</Text>
                        {user.tosAcceptedAt ? (
                            <View style={styles.highlight}>
                                <Text style={styles.highlightText}>✓ Terms of Service Accepted at Purchase</Text>
                            </View>
                        ) : (
                            <View style={styles.warning}>
                                <Text style={styles.warningText}>TOS acceptance not recorded (legacy account)</Text>
                            </View>
                        )}
                        <View style={styles.row}>
                            <Text style={styles.label}>TOS Accepted At:</Text>
                            <Text style={styles.value}>{user.tosAcceptedAt?.toISOString() || "Not recorded"}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>TOS Version:</Text>
                            <Text style={styles.value}>{user.tosVersion || "N/A"}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Refund Policy Accepted:</Text>
                            <Text style={styles.value}>{user.refundPolicyAcceptedAt?.toISOString() || "Not recorded"}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Refund Policy Version:</Text>
                            <Text style={styles.value}>{user.refundPolicyVersion || "N/A"}</Text>
                        </View>
                    </View>

                    {/* Device & Location - Priority for FRAUD */}
                    {(reason === "fraud" || reason === "general") && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>SECTION 3: DEVICE & LOCATION EVIDENCE</Text>
                            <View style={styles.row}>
                                <Text style={styles.label}>Purchase IP Address:</Text>
                                <Text style={styles.value}>{user.registrationIp || "Not recorded"}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Geo Location:</Text>
                                <Text style={styles.value}>
                                    {geoLocation ? formatLocation(geoLocation) : "Unknown"}
                                </Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>ISP:</Text>
                                <Text style={styles.value}>{geoLocation?.isp || "Unknown"}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Device:</Text>
                                <Text style={styles.value}>{deviceInfo.formatted}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Browser:</Text>
                                <Text style={styles.value}>{deviceInfo.browser}</Text>
                            </View>
                            <View style={styles.row}>
                                <Text style={styles.label}>Operating System:</Text>
                                <Text style={styles.value}>{deviceInfo.os}</Text>
                            </View>
                        </View>
                    )}

                    {/* Service Delivery - Priority for SERVICES_NOT_RECEIVED */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>SECTION 4: SERVICE DELIVERY PROOF</Text>
                        {totalLessonsStarted > 0 && (
                            <View style={styles.highlight}>
                                <Text style={styles.highlightText}>
                                    ✓ Customer ACCESSED {totalLessonsStarted} lessons and logged in {user.loginCount || 0} times
                                </Text>
                            </View>
                        )}
                        <View style={styles.row}>
                            <Text style={styles.label}>First Login:</Text>
                            <Text style={styles.value}>{user.firstLoginAt?.toISOString() || "Not recorded"}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Last Login:</Text>
                            <Text style={styles.value}>{user.lastLoginAt?.toISOString() || "Not recorded"}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Total Logins:</Text>
                            <Text style={styles.value}>{user.loginCount || 0}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Lessons Accessed:</Text>
                            <Text style={styles.value}>{totalLessonsStarted}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Lessons Completed:</Text>
                            <Text style={styles.value}>{totalLessonsCompleted}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Watch Time:</Text>
                            <Text style={styles.value}>~{Math.round(totalWatchMinutes)} minutes</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Certificates Earned:</Text>
                            <Text style={styles.value}>{user.certificates.length}</Text>
                        </View>
                    </View>

                    {/* Activity Timeline */}
                    {activities.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>SECTION 5: ACTIVITY TIMELINE</Text>
                            <View style={styles.timeline}>
                                {activities.slice(0, 15).map((activity, i) => (
                                    <View key={i} style={styles.timelineItem}>
                                        <Text style={styles.timelineDate}>
                                            {activity.createdAt?.toISOString().replace("T", " ").slice(0, 19)}
                                        </Text>
                                        <Text style={styles.timelineAction}>{activity.action}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Confirmation Emails */}
                    {emailsSent.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>SECTION 6: CONFIRMATION EMAILS SENT</Text>
                            {emailsSent.slice(0, 5).map((email, i) => (
                                <View key={i} style={styles.row}>
                                    <Text style={styles.label}>{email.createdAt?.toISOString().slice(0, 10)}:</Text>
                                    <Text style={styles.value}>{email.subject}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Executive Summary */}
                    <View style={styles.summary}>
                        <Text style={styles.summaryTitle}>EXECUTIVE SUMMARY</Text>
                        <Text style={styles.summaryText}>
                            {generateExecutiveSummary(user, totalLessonsStarted, totalLessonsCompleted, totalWatchMinutes, reason)}
                        </Text>
                    </View>

                    {/* Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>AccrediPro LLC | 1270 Ave of Americas, NY 10020</Text>
                        <Text style={styles.footerText}>Document generated: {new Date().toISOString()}</Text>
                    </View>
                </Page>
            </Document>
        );

        // Render PDF to buffer
        const pdfBuffer = await renderToBuffer(<EvidenceDocument />);

        // Return PDF response
        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="dispute-evidence-${user.email.split("@")[0]}-${new Date().toISOString().slice(0, 10)}.pdf"`,
            },
        });
    } catch (error) {
        console.error("Error generating dispute evidence PDF:", error);
        return NextResponse.json(
            { error: "Failed to generate evidence PDF", details: String(error) },
            { status: 500 }
        );
    }
}

function getReasonLabel(reason: DisputeReason): string {
    const labels: Record<DisputeReason, string> = {
        fraud: "Fraud - Card Absent Transaction (10.4)",
        services_not_received: "Merchandise/Services Not Received (13.1)",
        canceled: "Canceled Merchandise/Services",
        misrepresentation: "Misrepresentation of Terms",
        general: "General Dispute",
    };
    return labels[reason] || "General Dispute";
}

function generateExecutiveSummary(
    user: any,
    lessonsStarted: number,
    lessonsCompleted: number,
    watchMinutes: number,
    reason: DisputeReason
): string {
    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    const hasAccessed = lessonsStarted > 0;
    const hasTOS = !!user.tosAcceptedAt;

    let summary = `Customer ${name} (${user.email}) created an account on ${user.createdAt?.toISOString().slice(0, 10) || "N/A"}.\n\n`;

    if (hasTOS) {
        summary += `LEGAL ACCEPTANCE: Terms of Service and Refund Policy were accepted at ${user.tosAcceptedAt?.toISOString() || "checkout"}.\n\n`;
    }

    if (hasAccessed) {
        summary += `SERVICE DELIVERED: The customer logged in ${user.loginCount || 0} times, accessed ${lessonsStarted} lessons, completed ${lessonsCompleted} lessons, and accumulated approximately ${Math.round(watchMinutes)} minutes of watch time.\n\n`;
        summary += `CONCLUSION: This evidence demonstrates that the customer DID receive and actively use the digital product purchased.`;
    } else {
        summary += `ACCESS STATUS: No lesson access recorded.\n\n`;
        summary += `CONCLUSION: The customer had full access to the service but chose not to use it. Access was provided immediately upon purchase as agreed in the Terms of Service.`;
    }

    return summary;
}
