/**
 * Dispute Evidence Helper Library
 * Captures and stores data points for chargeback/dispute defense
 */

import prisma from './prisma';
import { headers } from 'next/headers';

// Current policy versions - update when policies change
export const CURRENT_TOS_VERSION = '2026-01-06';
export const CURRENT_REFUND_POLICY_VERSION = '2026-01-06';

/**
 * Parse user agent string to extract device and browser info
 */
export function parseUserAgent(ua: string | null): { device: string; browser: string } {
    if (!ua) return { device: 'Unknown', browser: 'Unknown' };

    // Device detection
    let device = 'Desktop';
    if (/mobile/i.test(ua)) device = 'Mobile';
    else if (/tablet|ipad/i.test(ua)) device = 'Tablet';

    // Browser detection
    let browser = 'Unknown';
    if (/chrome/i.test(ua) && !/edg/i.test(ua)) browser = 'Chrome';
    else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
    else if (/firefox/i.test(ua)) browser = 'Firefox';
    else if (/edg/i.test(ua)) browser = 'Edge';
    else if (/opera|opr/i.test(ua)) browser = 'Opera';
    else if (/msie|trident/i.test(ua)) browser = 'IE';

    return { device, browser };
}

/**
 * Get client IP and user agent from request headers
 */
export async function getClientInfo(): Promise<{
    ipAddress: string | null;
    userAgent: string | null;
    device: string;
    browser: string;
}> {
    try {
        const headersList = await headers();
        const ipAddress =
            headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            headersList.get('x-real-ip') ||
            null;
        const userAgent = headersList.get('user-agent');
        const { device, browser } = parseUserAgent(userAgent);

        return { ipAddress, userAgent, device, browser };
    } catch {
        return { ipAddress: null, userAgent: null, device: 'Unknown', browser: 'Unknown' };
    }
}

/**
 * Capture registration data for a new user
 * Call this when creating a user account
 */
export async function captureRegistrationData(userId: string): Promise<void> {
    try {
        const { ipAddress, userAgent, device, browser } = await getClientInfo();
        const now = new Date();

        await prisma.user.update({
            where: { id: userId },
            data: {
                registrationIp: ipAddress,
                registrationUserAgent: userAgent,
                registrationDevice: device,
                registrationBrowser: browser,
                // On registration, they accept TOS (via login page text)
                tosAcceptedAt: now,
                tosVersion: CURRENT_TOS_VERSION,
                refundPolicyAcceptedAt: now,
                refundPolicyVersion: CURRENT_REFUND_POLICY_VERSION,
            },
        });
    } catch (error) {
        console.error('[DISPUTE] Failed to capture registration data:', error);
    }
}

/**
 * Create a payment record from webhook data
 */
export async function createPaymentRecord(data: {
    userId: string;
    amount: number;
    transactionId?: string;
    processorRef?: string;
    productName?: string;
    productSku?: string;
    courseId?: string;
    billingEmail?: string;
    billingName?: string;
    cardLast4?: string;
    cardBrand?: string;
}): Promise<void> {
    try {
        const { ipAddress, userAgent } = await getClientInfo();

        await prisma.payment.create({
            data: {
                userId: data.userId,
                amount: data.amount,
                transactionId: data.transactionId,
                processorRef: data.processorRef,
                productName: data.productName,
                productSku: data.productSku,
                courseId: data.courseId,
                billingEmail: data.billingEmail,
                billingName: data.billingName,
                cardLast4: data.cardLast4,
                cardBrand: data.cardBrand,
                ipAddress,
                userAgent,
                status: 'COMPLETED',
            },
        });
    } catch (error) {
        console.error('[DISPUTE] Failed to create payment record:', error);
    }
}

/**
 * Track resource download for dispute evidence
 */
export async function trackResourceDownload(
    userId: string,
    resourceId: string
): Promise<void> {
    try {
        const { ipAddress, userAgent } = await getClientInfo();

        await prisma.resourceDownload.create({
            data: {
                userId,
                resourceId,
                ipAddress,
                userAgent,
            },
        });
    } catch (error) {
        console.error('[DISPUTE] Failed to track resource download:', error);
    }
}

/**
 * Update TOS acceptance (if user accepts updated TOS)
 */
export async function updateTosAcceptance(userId: string): Promise<void> {
    try {
        const now = new Date();

        await prisma.user.update({
            where: { id: userId },
            data: {
                tosAcceptedAt: now,
                tosVersion: CURRENT_TOS_VERSION,
                refundPolicyAcceptedAt: now,
                refundPolicyVersion: CURRENT_REFUND_POLICY_VERSION,
            },
        });
    } catch (error) {
        console.error('[DISPUTE] Failed to update TOS acceptance:', error);
    }
}

/**
 * Generate dispute evidence report data for a user
 */
export async function generateDisputeReport(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                loginHistory: {
                    orderBy: { createdAt: 'desc' },
                    take: 100,
                },
                enrollments: {
                    include: {
                        course: {
                            select: { title: true },
                        },
                    },
                },
                progress: {
                    include: {
                        lesson: {
                            select: { title: true, module: { select: { title: true } } },
                        },
                    },
                    orderBy: { updatedAt: 'desc' },
                },
                quizAttempts: {
                    include: {
                        quiz: {
                            select: { title: true, module: { select: { title: true } } },
                        },
                    },
                    orderBy: { completedAt: 'desc' },
                },
                certificates: {
                    include: {
                        course: { select: { title: true } },
                        module: { select: { title: true } },
                    },
                    orderBy: { issuedAt: 'desc' },
                },
                payments: {
                    orderBy: { createdAt: 'desc' },
                },
                resourceDownloads: {
                    include: {
                        resource: { select: { title: true, type: true } },
                    },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });

        if (!user) {
            throw new Error('User not found');
        }

        // Calculate total learning time
        const totalTimeSpent = user.progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0);
        const totalWatchTime = user.progress.reduce((sum, p) => sum + (p.watchTime || 0), 0);
        const completedLessons = user.progress.filter((p) => p.isCompleted).length;
        const totalLessons = user.progress.length;
        const completionRate = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

        return {
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                createdAt: user.createdAt,
                emailVerified: user.emailVerified,
            },
            registration: {
                ip: user.registrationIp,
                device: user.registrationDevice,
                browser: user.registrationBrowser,
                userAgent: user.registrationUserAgent,
                timestamp: user.createdAt,
            },
            legalAcceptance: {
                tosAcceptedAt: user.tosAcceptedAt,
                tosVersion: user.tosVersion,
                refundPolicyAcceptedAt: user.refundPolicyAcceptedAt,
                refundPolicyVersion: user.refundPolicyVersion,
            },
            loginHistory: user.loginHistory.map((login) => ({
                timestamp: login.createdAt,
                ip: login.ipAddress,
                device: login.device,
                browser: login.browser,
                method: login.loginMethod,
                isFirstLogin: login.isFirstLogin,
            })),
            payments: user.payments.map((payment) => ({
                timestamp: payment.createdAt,
                amount: payment.amount.toString(),
                currency: payment.currency,
                transactionId: payment.transactionId,
                productName: payment.productName,
                cardLast4: payment.cardLast4,
                status: payment.status,
                ip: payment.ipAddress,
            })),
            courseProgress: {
                totalTimeSpentSeconds: totalTimeSpent,
                totalWatchTimeSeconds: totalWatchTime,
                completedLessons,
                totalLessons,
                completionRate,
                lessons: user.progress.map((p) => ({
                    lessonTitle: p.lesson.title,
                    moduleTitle: p.lesson.module?.title,
                    isCompleted: p.isCompleted,
                    completedAt: p.completedAt,
                    timeSpent: p.timeSpent,
                    watchTime: p.watchTime,
                    visitCount: p.visitCount,
                })),
            },
            quizAttempts: user.quizAttempts.map((attempt) => ({
                quizTitle: attempt.quiz.title,
                moduleTitle: attempt.quiz.module?.title,
                score: attempt.score,
                passed: attempt.passed,
                startedAt: attempt.startedAt,
                completedAt: attempt.completedAt,
                timeSpent: attempt.timeSpent,
            })),
            certificates: user.certificates.map((cert) => ({
                certificateNumber: cert.certificateNumber,
                courseTitle: cert.course.title,
                moduleTitle: cert.module?.title,
                type: cert.type,
                issuedAt: cert.issuedAt,
            })),
            downloads: user.resourceDownloads.map((dl) => ({
                resourceTitle: dl.resource.title,
                resourceType: dl.resource.type,
                downloadedAt: dl.createdAt,
                ip: dl.ipAddress,
            })),
            enrollments: user.enrollments.map((e) => ({
                courseTitle: e.course.title,
                enrolledAt: e.enrolledAt,
                progress: e.progress,
                status: e.status,
                completedAt: e.completedAt,
                lastAccessedAt: e.lastAccessedAt,
            })),
        };
    } catch (error) {
        console.error('[DISPUTE] Failed to generate dispute report:', error);
        throw error;
    }
}
