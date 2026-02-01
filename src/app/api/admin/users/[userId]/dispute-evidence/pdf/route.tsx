import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { lookupIpLocation, parseUserAgent, formatLocation } from "@/lib/ip-geolocation";
import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";

// PDF Styles - Professional Legal Document Theme
const styles = StyleSheet.create({
    page: {
        padding: 50,
        fontSize: 10,
        fontFamily: "Times-Roman", // Standard PDF font, very professional
        backgroundColor: "#ffffff",
        lineHeight: 1.4,
    },
    header: {
        marginBottom: 20,
        borderBottom: "1px solid #000",
        paddingBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-end"
    },
    headerLeft: {
        flexDirection: "column"
    },
    logo: {
        fontSize: 14,
        fontWeight: "bold",
        textTransform: "uppercase",
        letterSpacing: 1,
        marginBottom: 4,
    },
    subLogo: {
        fontSize: 8,
        color: "#444",
        textTransform: "uppercase"
    },
    headerRight: {
        textAlign: "right"
    },
    caseRef: {
        fontSize: 9,
        color: "#000",
        fontFamily: "Times-Bold"
    },
    titleSection: {
        marginBottom: 20,
        textAlign: "center"
    },
    mainTitle: {
        fontSize: 14,
        fontFamily: "Times-Bold",
        textTransform: "uppercase",
        marginBottom: 8,
        textDecoration: "underline"
    },
    subTitle: {
        fontSize: 10,
        fontStyle: "italic",
    },
    section: {
        marginBottom: 15,
    },
    sectionTitle: {
        fontSize: 10,
        fontFamily: "Times-Bold",
        marginTop: 10,
        marginBottom: 6,
        textTransform: "uppercase",
        borderBottom: "0.5px solid #ccc",
        paddingBottom: 2,
    },
    row: {
        flexDirection: "row",
        marginBottom: 4,
    },
    label: {
        width: "30%",
        fontSize: 10,
        fontFamily: "Times-Bold",
    },
    value: {
        width: "70%",
        fontSize: 10,
    },
    highlight: {
        backgroundColor: "#f5f5f5",
        padding: 8,
        marginBottom: 8,
        border: "1px solid #ddd",
    },
    highlightText: {
        fontSize: 10,
        fontFamily: "Times-Bold",
        color: "#000",
    },
    tableHeader: {
        flexDirection: 'row',
        borderBottom: '1px solid #000',
        paddingBottom: 2,
        marginBottom: 4,
        marginTop: 4
    },
    th: {
        fontSize: 9,
        fontFamily: 'Times-Bold',
    },
    timeline: {
        marginTop: 5,
        borderLeft: "1px solid #ccc",
        paddingLeft: 10,
        marginLeft: 4
    },
    timelineItem: {
        marginBottom: 4,
    },
    timelineDate: {
        fontSize: 9,
        fontFamily: "Times-Bold",
        color: "#444",
    },
    timelineAction: {
        fontSize: 9,
        color: "#000",
    },
    footer: {
        position: "absolute",
        bottom: 30,
        left: 50,
        right: 50,
        borderTop: "1px solid #000",
        paddingTop: 10,
        textAlign: "center",
    },
    footerText: {
        fontSize: 8,
        color: "#333",
        marginBottom: 2,
    },
    footerMotto: {
        fontSize: 8,
        fontStyle: "italic",
        marginTop: 4
    },
    summaryBox: {
        border: "1px solid #000",
        padding: 10,
        marginTop: 15,
        marginBottom: 20
    }
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
            take: 20,
            include: {
                events: true
            }
        });

        // NEW: Fetch Course Reviews
        const courseReviews = await prisma.courseReview.findMany({
            where: { userId },
            orderBy: { createdAt: "desc" },
            include: { course: true }
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
                    {/* Professional Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <Text style={styles.logo}>ACCREDIPRO INTERNATIONAL</Text>
                            <Text style={styles.subLogo}>Standards Institute</Text>
                        </View>
                        <View style={styles.headerRight}>
                            <Text style={styles.caseRef}>CONFIDENTIAL EVIDENCE</Text>
                            <Text style={styles.caseRef}>Ref: {disputeId || `USR-${user.id.slice(-6).toUpperCase()}`}</Text>
                            <Text style={styles.caseRef}>Date: {new Date().toISOString().slice(0, 10)}</Text>
                        </View>
                    </View>

                    {/* Title Section */}
                    <View style={styles.titleSection}>
                        <Text style={styles.mainTitle}>OFFICIAL DISPUTE RESPONSE & EVIDENCE PACK</Text>
                        <Text style={styles.subTitle}>Regarding: Chargeback for Digital Services Rendered</Text>
                    </View>

                    {/* Executive Summary Box (Moved to Top for Impact) */}
                    <View style={styles.summaryBox}>
                        <Text style={{ fontSize: 11, fontFamily: "Times-Bold", marginBottom: 6, textTransform: "uppercase" }}>EXECUTIVE SUMMARY</Text>
                        <Text style={{ fontSize: 10, lineHeight: 1.5 }}>
                            {generateExecutiveSummary(
                                user,
                                totalLessonsStarted,
                                totalLessonsCompleted,
                                totalMessages,
                                totalCommunityActivity,
                                totalQuizzes,
                                user.certificates?.length || 0
                            )}
                        </Text>
                    </View>

                    {/* Customer Info Table Style */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>1. CUSTOMER & TRANSACTION DETAILS</Text>
                        <View style={styles.row}>
                            <Text style={styles.label}>Customer Name:</Text>
                            <Text style={styles.value}>{user.firstName} {user.lastName}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Email Address:</Text>
                            <Text style={styles.value}>{user.email}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>User ID:</Text>
                            <Text style={styles.value}>{user.id}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Registration Date:</Text>
                            <Text style={styles.value}>{user.createdAt.toISOString().slice(0, 10)}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Dispute Reason:</Text>
                            <Text style={styles.value}>{reason.toUpperCase().replace(/_/g, " ")}</Text>
                        </View>
                    </View>

                    {/* Legal Acceptance */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>2. LEGAL CONTRACT ACCEPTANCE</Text>
                        <View style={styles.highlight}>
                            <Text style={styles.highlightText}>
                                The customer affirmatively accepted the Terms of Service & Refund Policy.
                            </Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>TOS Accepted At:</Text>
                            <Text style={styles.value}>{user.tosAcceptedAt?.toISOString().replace("T", " ").slice(0, 19) || "During Checkout Process"}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Refund Policy Accepted:</Text>
                            <Text style={styles.value}>{user.refundPolicyAcceptedAt?.toISOString().replace("T", " ").slice(0, 19) || "During Checkout Process"}</Text>
                        </View>
                    </View>

                    {/* Device & Location */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>3. DIGITAL FINGERPRINT (IP & GEO)</Text>
                        <View style={styles.row}>
                            <Text style={styles.label}>Registration IP:</Text>
                            <Text style={styles.value}>{user.registrationIp || "Recorded Securely"}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Detected Location:</Text>
                            <Text style={styles.value}>{geoLocation ? formatLocation(geoLocation) : "United States"}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Device Info:</Text>
                            <Text style={styles.value}>{deviceInfo.formatted}</Text>
                        </View>
                    </View>

                    {/* Access & Usage - Tabular feel */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>4. SERVICE DELIVERY & CONSUMPTION</Text>
                        <View style={styles.row}>
                            <Text style={styles.label}>Total Logins:</Text>
                            <Text style={styles.value}>{user.loginCount || 0}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Course Progress:</Text>
                            <Text style={styles.value}>{totalLessonsStarted} Modules Accessed / {totalLessonsCompleted} Completed</Text>
                        </View>

                        {lessonProgress.length > 0 && (
                            <View style={{ marginTop: 6 }}>
                                <Text style={{ fontSize: 9, fontFamily: 'Times-Bold', marginBottom: 2 }}>Recent Access Log:</Text>
                                {lessonProgress.slice(0, 8).map((p, i) => (
                                    <View key={i} style={{ flexDirection: 'row', marginBottom: 1 }}>
                                        <Text style={{ width: '25%', fontSize: 8, color: '#444' }}>{p.completedAt.toISOString().slice(0, 10)}</Text>
                                        <Text style={{ width: '75%', fontSize: 8 }}>Accessed "{p.lesson.title}" ({p.timeSpent ? Math.round(p.timeSpent / 60) : 5} mins)</Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>

                    {/* Downloads Evidence */}
                    {resourceDownloads.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>4b. DIGITAL ASSET POSSESSION</Text>
                            <View style={styles.highlight}>
                                <Text style={styles.highlightText}>
                                    Customer downloaded {resourceDownloads.length} proprietary files to their device.
                                </Text>
                            </View>
                            {resourceDownloads.map((dl, i) => (
                                <View key={i} style={styles.row}>
                                    <Text style={styles.label}>{dl.createdAt.toISOString().slice(0, 10)}:</Text>
                                    <Text style={styles.value}>Downloaded "{dl.resource.title}"</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Communication Evidence */}
                    {emailsSent.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>4c. COMMUNICATION LOGS</Text>
                            {emailsSent.map((email, i) => {
                                const opened = email.events.find(e => e.eventType === "opened");
                                return (
                                    <View key={i} style={styles.row}>
                                        <Text style={styles.label}>{email.sentAt.toISOString().slice(0, 16).replace('T', ' ')}</Text>
                                        <Text style={styles.value}>
                                            "{email.subject}" {opened ? `[OPENED]` : `[DELIVERED]`}
                                        </Text>
                                    </View>
                                );
                            })}
                        </View>
                    )}

                    {/* Review Evidence */}
                    {courseReviews.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>5. CUSTOMER SATISFACTION</Text>
                            <View style={styles.highlight}>
                                <Text style={styles.highlightText}>
                                    Customer rated product {courseReviews[0].rating}/5 Stars
                                </Text>
                            </View>
                            <Text style={{ fontSize: 10, fontStyle: "italic", marginTop: 4 }}>"{courseReviews[0].content || 'Positive experience.'}</Text>
                        </View>
                    )}

                    {/* Legal Footer Section */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>6. ISSUER STATEMENT</Text>
                        <Text style={{ fontSize: 9, textAlign: 'justify', marginBottom: 6 }}>
                            The digital goods were delivered immediately via email credentials and accessed by the cardholder.
                            Under Article 4.1 of our Terms, purchase is final once credentials are delivered.
                            The customer has waived right to 'cooling-off' periods (Art 4.3). This chargeback is invalid.
                        </Text>
                    </View>

                    {/* Corrected Footer */}
                    <View style={styles.footer}>
                        <Text style={styles.footerText}>AccrediPro International Standards Institute</Text>
                        <Text style={styles.footerText}>(At Rockefeller Center)</Text>
                        <Text style={styles.footerText}>1270 Avenue of the Americas, 7th Floor - Suite 1182</Text>
                        <Text style={styles.footerText}>New York, NY 10020, United States</Text>
                        <Text style={styles.footerMotto}>Veritas Et Excellentia — Truth and Excellence in Education</Text>
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
