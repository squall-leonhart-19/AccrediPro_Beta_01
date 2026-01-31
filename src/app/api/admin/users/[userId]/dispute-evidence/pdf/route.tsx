import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { lookupIpLocation, parseUserAgent, formatLocation } from "@/lib/ip-geolocation";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

// PDF Styles - Legal Document Theme
const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontSize: 10,
        fontFamily: "Helvetica",
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
        marginBottom: 12,
        padding: 10,
        backgroundColor: "#fafafa",
        borderRadius: 4,
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: "bold",
        color: "#722F37",
        marginBottom: 6,
        borderBottom: "1px solid #ddd",
        paddingBottom: 4,
    },
    row: {
        flexDirection: "row",
        marginBottom: 3,
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
        marginBottom: 8,
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
        marginBottom: 8,
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
        marginBottom: 2,
        paddingVertical: 1,
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
    messageBox: {
        backgroundColor: "#fff",
        padding: 6,
        marginBottom: 4,
        borderLeft: "2px solid #722F37",
    },
    messageText: {
        fontSize: 8,
        color: "#333",
    },
    messageDate: {
        fontSize: 7,
        color: "#999",
        marginTop: 2,
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
        lineHeight: 1.4,
    },
});

// Dispute reason types
type DisputeReason = "fraud" | "services_not_received" | "canceled" | "misrepresentation" | "general";

// GET /api/admin/users/[userId]/dispute-evidence/pdf
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session?.user || !["ADMIN", "MENTOR"].includes((session.user as any).role)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await params;
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
                    select: { title: true },
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

        // NEW: Fetch mentorship/chat messages (sent BY the user)
        const messagesSent = await prisma.message.findMany({
            where: { senderId: userId },
            orderBy: { createdAt: "asc" },
            take: 20,
            select: {
                id: true,
                content: true,
                createdAt: true,
                messageType: true,
            },
        });

        // NEW: Fetch messages received by the user
        const messagesReceived = await prisma.message.findMany({
            where: { receiverId: userId },
            orderBy: { createdAt: "asc" },
            take: 20,
            select: {
                id: true,
                content: true,
                createdAt: true,
                isRead: true,
                readAt: true,
            },
        });

        // NEW: Fetch community posts by user
        const communityPosts = await prisma.communityPost.findMany({
            where: { authorId: userId },
            orderBy: { createdAt: "asc" },
            take: 10,
            select: {
                id: true,
                title: true,
                content: true,
                createdAt: true,
            },
        });

        // NEW: Fetch community comments by user
        const communityComments = await prisma.postComment.findMany({
            where: { authorId: userId },
            orderBy: { createdAt: "asc" },
            take: 15,
            select: {
                id: true,
                content: true,
                createdAt: true,
            },
        });

        // NEW: Fetch quiz attempts by user
        const quizAttempts = await prisma.quizAttempt.findMany({
            where: { userId },
            orderBy: { startedAt: "asc" },
            include: {
                quiz: {
                    select: { title: true },
                },
            },
            take: 20,
        });

        // NEW: Fetch resource downloads
        const resourceDownloads = await prisma.resourceDownload.findMany({
            where: { userId },
            orderBy: { createdAt: "asc" },
            include: {
                resource: {
                    select: { title: true }
                }
            }
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
        const totalMessages = messagesSent.length + messagesReceived.length;
        const totalCommunityActivity = communityPosts.length + communityComments.length;
        const totalQuizzes = quizAttempts.length;
        const quizzesPassed = quizAttempts.filter(q => q.passed).length;

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
                        </View>
                    )}

                    {/* Service Delivery - Lessons accessed */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>SECTION 4: LESSON ACCESS PROOF</Text>
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
                            <Text style={styles.label}>Certificates Earned:</Text>
                            <Text style={styles.value}>{user.certificates.length}</Text>
                        </View>
                    </View>

                    {/* NEW: Digital Asset Possession */}
                    {resourceDownloads.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>SECTION 4b: DIGITAL ASSET POSSESSION</Text>
                            <View style={styles.highlight}>
                                <Text style={styles.highlightText}>
                                    ✓ Customer DOWNLOADED {resourceDownloads.length} course files (Content Consumed)
                                </Text>
                            </View>
                            {resourceDownloads.map((dl, i) => (
                                <View key={i} style={styles.row}>
                                    <Text style={styles.label}>{dl.createdAt.toISOString().split('T')[0]}:</Text>
                                    <Text style={styles.value}>Downloaded "{dl.resource.title}" ({dl.ipAddress || "IP Logged"})</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* NEW: Mentorship Messages */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>SECTION 5: MENTORSHIP COMMUNICATION</Text>
                        {totalMessages > 0 ? (
                            <View style={styles.highlight}>
                                <Text style={styles.highlightText}>
                                    ✓ Customer sent {messagesSent.length} messages and received {messagesReceived.length} messages
                                </Text>
                            </View>
                        ) : (
                            <View style={styles.row}>
                                <Text style={styles.value}>No mentorship messages recorded</Text>
                            </View>
                        )}
                        {messagesSent.slice(0, 5).map((msg, i) => (
                            <View key={i} style={styles.messageBox}>
                                <Text style={styles.messageText}>
                                    {msg.content.slice(0, 100)}{msg.content.length > 100 ? "..." : ""}
                                </Text>
                                <Text style={styles.messageDate}>
                                    Sent: {msg.createdAt?.toISOString()}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* NEW: Community Activity */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>SECTION 6: COMMUNITY ENGAGEMENT</Text>
                        {totalCommunityActivity > 0 ? (
                            <View style={styles.highlight}>
                                <Text style={styles.highlightText}>
                                    ✓ Customer made {communityPosts.length} posts and {communityComments.length} comments
                                </Text>
                            </View>
                        ) : (
                            <View style={styles.row}>
                                <Text style={styles.value}>No community activity recorded</Text>
                            </View>
                        )}
                        {communityPosts.slice(0, 3).map((post, i) => (
                            <View key={i} style={styles.messageBox}>
                                <Text style={styles.messageText}>POST: {post.title}</Text>
                                <Text style={styles.messageDate}>
                                    Posted: {post.createdAt?.toISOString()}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* NEW: Quiz Scores */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>SECTION 7: QUIZ/ASSESSMENT COMPLETIONS</Text>
                        {totalQuizzes > 0 ? (
                            <View style={styles.highlight}>
                                <Text style={styles.highlightText}>
                                    ✓ Customer completed {totalQuizzes} quizzes, passed {quizzesPassed}
                                </Text>
                            </View>
                        ) : (
                            <View style={styles.row}>
                                <Text style={styles.value}>No quiz attempts recorded</Text>
                            </View>
                        )}
                        {quizAttempts.slice(0, 5).map((attempt, i) => (
                            <View key={i} style={styles.row}>
                                <Text style={styles.label}>{attempt.quiz.title}:</Text>
                                <Text style={styles.value}>
                                    Score: {attempt.score}% {attempt.passed ? "(PASSED)" : ""} - {attempt.startedAt?.toISOString().slice(0, 10)}
                                </Text>
                            </View>
                        ))}
                    </View>

                    {/* Activity Timeline */}
                    {activities.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>SECTION 8: ACTIVITY TIMELINE</Text>
                            <View style={styles.timeline}>
                                {activities.slice(0, 10).map((activity, i) => (
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
                            <Text style={styles.sectionTitle}>SECTION 9: CONFIRMATION EMAILS SENT</Text>
                            {emailsSent.slice(0, 5).map((email, i) => (
                                <View key={i} style={styles.row}>
                                    <Text style={styles.label}>{email.createdAt?.toISOString().slice(0, 10)}:</Text>
                                    <Text style={styles.value}>{email.subject}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* NEW: Legal & Bank Statement */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>SECTION 10: LEGAL DEFINITIONS & ISSUER STATEMENT</Text>

                        <View style={styles.highlight}>
                            <Text style={styles.highlightText}>OFFICIAL STATEMENT FOR DISPUTE RESOLUTION</Text>
                        </View>

                        <Text style={{ fontSize: 9, marginBottom: 6, color: "#333", lineHeight: 1.4 }}>
                            TO THE CARD ISSUER / BANK:
                        </Text>
                        <Text style={{ fontSize: 9, marginBottom: 8, color: "#333", lineHeight: 1.4, textAlign: "justify" }}>
                            The Cardholder purchased a non-tangible digital good ("Professional Certification Program") which was delivered immediately via email credentials.
                            Our logs (Section 3 & 4) confirm the user successfully logged in, accessed proprietary intellectual property, and consumed content.
                            Because the digital secrets were revealed and consumed, this product cannot be "returned."
                        </Text>

                        <Text style={{ fontSize: 9, marginBottom: 6, fontWeight: "bold", color: "#722F37", marginTop: 4 }}>
                            RELEVANT TERMS OF SERVICE (ACCEPTED BY CARDHOLDER):
                        </Text>

                        <View style={{ marginLeft: 8, marginBottom: 8 }}>
                            <Text style={{ fontSize: 8, color: "#555", marginBottom: 4 }}>
                                <Text style={{ fontWeight: "bold" }}>ARTICLE 4.1: FINALITY OF PURCHASE.</Text> "Once access credentials are delivered... purchase is complete and final. You expressly acknowledge and agree that... You waive any right to initiate a payment dispute or chargeback... You waive any right to claim non-delivery... after receiving access credentials."
                            </Text>
                            <Text style={{ fontSize: 8, color: "#555", marginBottom: 4 }}>
                                <Text style={{ fontWeight: "bold" }}>ARTICLE 4.3: WAIVER OF COOLING-OFF PERIOD.</Text> "You knowingly and voluntarily waive any statutory 'cooling-off' period... that might otherwise apply under federal, state, or local law."
                            </Text>
                            <Text style={{ fontSize: 8, color: "#555" }}>
                                <Text style={{ fontWeight: "bold" }}>ARTICLE 6.1: CHARGEBACK WAIVER.</Text> "You expressly agree not to initiate any chargeback... for any reason other than documented and verified identity theft supported by a police report."
                            </Text>
                        </View>

                        <Text style={{ fontSize: 8, color: "#666", fontStyle: "italic" }}>
                            Full policies tracked at: https://learn.accredipro.academy/terms-of-service
                        </Text>
                    </View>

                    {/* Executive Summary */}
                    <View style={styles.summary}>
                        <Text style={styles.summaryTitle}>EXECUTIVE SUMMARY & EVIDENCE CONCLUSION</Text>
                        <Text style={styles.summaryText}>
                            {generateExecutiveSummary(
                                user,
                                totalLessonsStarted,
                                totalLessonsCompleted,
                                totalMessages,
                                totalCommunityActivity,
                                totalQuizzes,
                                reason
                            )}
                        </Text>
                    </View>

                    {/* Footer - Modified with Bank instructions */}
                    <View style={styles.footer}>
                        <View style={{ flexDirection: "column" }}>
                            <Text style={styles.footerText}>AccrediPro LLC | Accreditation Standards Institute</Text>
                            <Text style={styles.footerText}>1270 Ave of Americas, NY 10020 | legal@accredipro.academy</Text>
                        </View>
                        <View style={{ flexDirection: "column", alignItems: "flex-end" }}>
                            <Text style={styles.footerText}>Authorized by: Legal Dept.</Text>
                            <Text style={styles.footerText}>Generated: {new Date().toISOString()}</Text>
                        </View>
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
    totalMessages: number,
    communityActivity: number,
    quizzes: number,
    reason: DisputeReason
): string {
    const name = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    const hasTOS = !!user.tosAcceptedAt;
    const hasEngagement = lessonsStarted > 0 || totalMessages > 0 || communityActivity > 0 || quizzes > 0;

    let summary = `Customer ${name} (${user.email}) created account on ${user.createdAt?.toISOString().slice(0, 10) || "N/A"} from IP Address ${user.registrationIp || "Recorded"}.\n\n`;

    if (hasTOS) {
        summary += `LEGAL: TOS and Refund Policy were AFFIRMATIVELY ACCEPTED at ${user.tosAcceptedAt?.toISOString().slice(0, 19) || "checkout"}. This contract governs the purchase.\n\n`;
    }

    summary += `DIGITAL FOOTPRINT & CONSUMPTION PROOF:\n`;
    summary += `- Logins: ${user.loginCount || 0} separate authentication events\n`;
    summary += `- Content Accessed: ${lessonsStarted} unique lessons opened\n`;
    summary += `- Content Completed: ${lessonsCompleted} lessons fully consumed\n`;
    if (quizzes > 0) summary += `- Assessments: ${quizzes} quizzes completed (Active Participation)\n`;
    summary += `- Status: Product was DELIVERED and CONSUMED.\n\n`;

    summary += `CONCLUSION: \n`;
    summary += `1. The digital product was successfully delivered immediately upon purchase.\n`;
    summary += `2. The customer logged in and accessed the proprietary content (IP).\n`;
    summary += `3. Under the accepted Terms of Service (Article 4.1), this purchase is FINAL and NON-REFUNDABLE.\n`;
    summary += `4. This chargeback is invalid as the 'service' was fully rendered and cannot be returned.`;

    return summary;
}
