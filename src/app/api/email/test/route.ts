import { NextRequest, NextResponse } from "next/server";
import {
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendMiniDiplomaEnrollmentEmail,
  sendModuleUnlockedEmail,
  sendModuleCompletedEmail,
  sendMiniDiplomaCompletedEmail,
  sendTrainingUnlockedEmail,
  sendChallengeUnlockedEmail,
  sendChallengeDayUnlockedEmail,
  sendChallengeCompletedEmail,
  sendCertificateIssuedEmail,
  sendPaymentReceiptEmail,
  sendCourseEnrollmentEmail,
  sendCoachRepliedEmail,
  sendInactiveReminderEmail,
  sendEbookDownloadEmail,
  sendBadgeEarnedEmail,
  sendCourseUpdateEmail,
  sendAnnouncementEmail,
} from "@/lib/email";

const TEST_EMAIL = "at.seed019@gmail.com";
const TEST_FIRST_NAME = "Test User";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { emailType, testEmail } = body;

    const targetEmail = testEmail || TEST_EMAIL;
    const results: { type: string; success: boolean; error?: string }[] = [];

    // If specific email type requested
    if (emailType && emailType !== 'all') {
      const result = await sendSingleEmail(emailType, targetEmail);
      return NextResponse.json(result);
    }

    // Send all emails with 1 second delay between each
    const emailTypes = [
      'welcome',
      'password-reset',
      'mini-diploma-enrollment',
      'module-unlocked',
      'module-completed',
      'mini-diploma-completed',
      'training-unlocked',
      'challenge-unlocked',
      'challenge-day-unlocked',
      'challenge-completed',
      'certificate-issued',
      'payment-receipt',
      'course-enrollment',
      'coach-replied',
      'inactive-reminder',
      'ebook-download',
      'badge-earned',
      'course-update',
      'announcement',
    ];

    for (const type of emailTypes) {
      const result = await sendSingleEmail(type, targetEmail);
      results.push({ type, ...result });

      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    const successCount = results.filter(r => r.success).length;
    const failCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      success: true,
      message: `Sent ${successCount}/${results.length} emails to ${targetEmail}`,
      results,
      summary: {
        total: results.length,
        succeeded: successCount,
        failed: failCount,
      }
    });

  } catch (error) {
    console.error("Email test error:", error);
    return NextResponse.json(
      { error: "Failed to send test emails", details: String(error) },
      { status: 500 }
    );
  }
}

async function sendSingleEmail(type: string, email: string): Promise<{ success: boolean; error?: string; data?: unknown }> {
  try {
    let result;
    switch (type) {
      case 'welcome':
        result = await sendWelcomeEmail(email, TEST_FIRST_NAME);
        if (!result.success) return { success: false, error: String(result.error) };
        return { success: true, data: result.data };
        break;

      case 'password-reset':
        await sendPasswordResetEmail(email, `test-reset-token-${Date.now()}`, TEST_FIRST_NAME);
        break;

      case 'mini-diploma-enrollment':
        await sendMiniDiplomaEnrollmentEmail(email, TEST_FIRST_NAME, "Functional Medicine");
        break;

      case 'module-unlocked':
        await sendModuleUnlockedEmail(
          email,
          TEST_FIRST_NAME,
          "Module 2: The 5 Root Causes of Disease",
          "Functional Medicine Mini Diploma"
        );
        break;

      case 'module-completed':
        await sendModuleCompletedEmail(
          email,
          TEST_FIRST_NAME,
          "Module 1: Introduction to Functional Medicine",
          "Functional Medicine Mini Diploma",
          25
        );
        break;

      case 'mini-diploma-completed':
        await sendMiniDiplomaCompletedEmail(email, TEST_FIRST_NAME, "Functional Medicine");
        break;

      case 'training-unlocked':
        await sendTrainingUnlockedEmail(email, TEST_FIRST_NAME);
        break;

      case 'challenge-unlocked':
        await sendChallengeUnlockedEmail(email, TEST_FIRST_NAME);
        break;

      case 'challenge-day-unlocked':
        await sendChallengeDayUnlockedEmail(
          email,
          TEST_FIRST_NAME,
          3,
          "Create Your Signature Offer"
        );
        break;

      case 'challenge-completed':
        await sendChallengeCompletedEmail(email, TEST_FIRST_NAME);
        break;

      case 'certificate-issued':
        await sendCertificateIssuedEmail(
          email,
          TEST_FIRST_NAME,
          "Functional Medicine Complete Certification",
          "CERT-2024-FM-001234",
          "http://localhost:3000/certificates/download/test-cert",
          "http://localhost:3000/verify/CERT-2024-FM-001234"
        );
        break;

      case 'payment-receipt':
        await sendPaymentReceiptEmail(
          email,
          TEST_FIRST_NAME,
          "Functional Medicine Complete Certification",
          1997.00,
          "TXN-2024-123456",
          new Date()
        );
        break;

      case 'course-enrollment':
        await sendCourseEnrollmentEmail(
          email,
          TEST_FIRST_NAME,
          "Functional Medicine Complete Certification",
          "functional-medicine-complete-certification"
        );
        break;

      case 'coach-replied':
        await sendCoachRepliedEmail(
          email,
          TEST_FIRST_NAME,
          "Dr. Sarah Mitchell",
          "Great question! The key to understanding gut health is to first assess the microbiome diversity. I recommend starting with a comprehensive stool test to identify any dysbiosis patterns. Let me know if you'd like me to walk you through the interpretation process."
        );
        break;

      case 'inactive-reminder':
        const lastActivity = new Date();
        lastActivity.setDate(lastActivity.getDate() - 5);
        await sendInactiveReminderEmail(email, TEST_FIRST_NAME, lastActivity, 35);
        break;

      case 'ebook-download':
        await sendEbookDownloadEmail(
          email,
          TEST_FIRST_NAME,
          "The Complete FM Practitioner Guide",
          "http://localhost:3000/ebooks/download/fm-guide"
        );
        break;

      case 'badge-earned':
        await sendBadgeEarnedEmail(
          email,
          TEST_FIRST_NAME,
          "Challenge Champion",
          "Completed the 7-Day Activation Challenge"
        );
        break;

      case 'course-update':
        await sendCourseUpdateEmail(
          email,
          TEST_FIRST_NAME,
          "Functional Medicine Certification",
          "Advanced Lab Interpretation Guide",
          "This comprehensive guide covers the latest lab markers and interpretation techniques used by top practitioners."
        );
        break;

      case 'announcement':
        await sendAnnouncementEmail(
          email,
          TEST_FIRST_NAME,
          "Exciting News from AccrediPro!",
          "<p>We're thrilled to announce the launch of our new Advanced Certification Program! This program includes:</p><ul><li>20+ hours of advanced content</li><li>Live Q&A sessions with experts</li><li>Exclusive practitioner resources</li></ul>",
          "Learn More",
          "http://localhost:3000/courses"
        );
        break;

      default:
        return { success: false, error: `Unknown email type: ${type}` };
    }

    return { success: true };
  } catch (error) {
    return { success: false, error: String(error) };
  }
}

// GET endpoint to test a single email
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type') || 'welcome';
  const email = searchParams.get('email') || TEST_EMAIL;

  try {
    const result = await sendSingleEmail(type, email);

    return NextResponse.json({
      success: result.success,
      message: result.success
        ? `${type} email sent successfully to ${email}`
        : `Failed to send ${type} email: ${result.error}`,
      emailType: type,
      recipient: email,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to send test email", details: String(error) },
      { status: 500 }
    );
  }
}
