import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || "AccrediPro Academy <noreply@accredipro.academy>";

type RouteContext = { params: Promise<{ id: string }> };

// Sample data for test emails
const sampleData: Record<string, string> = {
  firstName: "Test User",
  lastName: "Test",
  email: "test@example.com",
  loginUrl: "https://app.accredipro.academy/login",
  resetUrl: "https://app.accredipro.academy/reset-password?token=sample-token",
  startUrl: "https://app.accredipro.academy/my-mini-diploma",
  category: "Functional Medicine",
  courseName: "Functional Medicine Complete Certification",
  courseTitle: "Functional Medicine Complete Certification",
  moduleTitle: "Module 3: Advanced Protocols",
  moduleUrl: "https://app.accredipro.academy/my-courses",
  nextModuleUrl: "https://app.accredipro.academy/my-courses",
  progress: "45",
  trainingUrl: "https://app.accredipro.academy/training",
  challengeUrl: "https://app.accredipro.academy/challenges",
  dayNumber: "3",
  dayTitle: "Build Your Online Presence",
  badgeUrl: "https://app.accredipro.academy/my-library",
  certificationUrl: "https://app.accredipro.academy/courses/functional-medicine-complete-certification",
  certificateNumber: "AP-2024-FM-12345",
  downloadUrl: "https://app.accredipro.academy/certificates/download/test",
  verificationUrl: "https://app.accredipro.academy/verify/AP-2024-FM-12345",
  productName: "Functional Medicine Complete Certification",
  amount: "$2,997.00",
  transactionId: "TXN-2024-123456",
  purchaseDate: "December 13, 2024",
  courseUrl: "https://app.accredipro.academy/my-courses",
  coachName: "Coach Sarah",
  messagePreview: "Great question! Let me explain how the assessment protocol works in more detail...",
  messageUrl: "https://app.accredipro.academy/messages",
  daysSinceActive: "5",
  ebookTitle: "The Complete FM Practitioner Guide",
  libraryUrl: "https://app.accredipro.academy/my-library",
  badgeName: "Challenge Champion",
  badgeDescription: "Completed the 7-Day Activation Challenge",
  updateTitle: "Advanced Lab Interpretation Guide",
  updateDescription: "This comprehensive guide covers the latest lab markers and interpretation techniques used by top practitioners.",
  announcementTitle: "Exciting News from AccrediPro!",
  announcementContent: "<p>We're thrilled to announce the launch of our new Advanced Certification Program!</p><ul><li>20+ hours of advanced content</li><li>Live Q&A sessions with experts</li></ul>",
  ctaText: "Learn More",
  ctaUrl: "https://app.accredipro.academy/courses",
  preheader: "Test email from AccrediPro Academy",
  unsubscribeUrl: "https://app.accredipro.academy/unsubscribe",
};

// Replace placeholders with data
function replacePlaceholders(text: string, data: Record<string, string>): string {
  let result = text;
  for (const [key, value] of Object.entries(data)) {
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
  }
  return result;
}

// POST - Send test email
export async function POST(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { testEmail } = body;

    if (!testEmail) {
      return NextResponse.json(
        { error: "Test email address is required" },
        { status: 400 }
      );
    }

    const template = await prisma.emailTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Replace placeholders
    const testData = { ...sampleData, email: testEmail };
    const subject = replacePlaceholders(template.subject, testData);
    const html = replacePlaceholders(template.htmlContent, testData);

    // Send test email
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: [testEmail],
      subject: `[TEST] ${subject}`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send test email", details: error },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Test email sent to ${testEmail}`,
      data,
    });
  } catch (error) {
    console.error("Error sending test email:", error);
    return NextResponse.json(
      { error: "Failed to send test email" },
      { status: 500 }
    );
  }
}
