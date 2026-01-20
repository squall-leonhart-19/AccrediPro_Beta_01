import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ id: string }> };

// Sample data for preview
const sampleData: Record<string, string> = {
  firstName: "Sarah",
  lastName: "Johnson",
  email: "sarah@example.com",
  loginUrl: "https://learn.accredipro.academy/login",
  resetUrl: "https://learn.accredipro.academy/reset-password?token=sample-token",
  startUrl: "https://learn.accredipro.academy/my-mini-diploma",
  category: "Functional Medicine",
  courseName: "Functional Medicine Complete Certification",
  courseTitle: "Functional Medicine Complete Certification",
  moduleTitle: "Module 3: Advanced Protocols",
  moduleUrl: "https://learn.accredipro.academy/my-courses",
  nextModuleUrl: "https://learn.accredipro.academy/my-courses",
  progress: "45",
  trainingUrl: "https://learn.accredipro.academy/training",
  challengeUrl: "https://learn.accredipro.academy/challenges",
  dayNumber: "3",
  dayTitle: "Build Your Online Presence",
  badgeUrl: "https://learn.accredipro.academy/my-library",
  certificationUrl: "https://learn.accredipro.academy/courses/functional-medicine-complete-certification",
  certificateNumber: "AP-2024-FM-12345",
  downloadUrl: "https://learn.accredipro.academy/certificates/download/test",
  verificationUrl: "https://learn.accredipro.academy/verify/AP-2024-FM-12345",
  productName: "Functional Medicine Complete Certification",
  amount: "$2,997.00",
  transactionId: "TXN-2024-123456",
  purchaseDate: "December 13, 2024",
  courseUrl: "https://learn.accredipro.academy/my-courses",
  coachName: "Coach Sarah",
  messagePreview: "Great question! Let me explain how the assessment protocol works in more detail...",
  messageUrl: "https://learn.accredipro.academy/messages",
  daysSinceActive: "5",
  ebookTitle: "The Complete FM Practitioner Guide",
  libraryUrl: "https://learn.accredipro.academy/my-library",
  badgeName: "Challenge Champion",
  badgeDescription: "Completed the 7-Day Activation Challenge",
  updateTitle: "Advanced Lab Interpretation Guide",
  updateDescription: "This comprehensive guide covers the latest lab markers and interpretation techniques used by top practitioners.",
  announcementTitle: "Exciting News from AccrediPro!",
  announcementContent: "<p>We're thrilled to announce the launch of our new Advanced Certification Program!</p><ul><li>20+ hours of advanced content</li><li>Live Q&A sessions with experts</li></ul>",
  ctaText: "Learn More",
  ctaUrl: "https://learn.accredipro.academy/courses",
  preheader: "Preview email from AccrediPro Academy",
  unsubscribeUrl: "https://learn.accredipro.academy/unsubscribe",
};

// Replace placeholders with sample data
function replacePlaceholders(html: string, data: Record<string, string>): string {
  let result = html;
  for (const [key, value] of Object.entries(data)) {
    // Replace {{placeholder}} format
    result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
  }
  return result;
}

// GET - Generate preview HTML for email template (ADMIN only)
export async function GET(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // Auth check - ADMIN only
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const template = await prisma.emailTemplate.findUnique({
      where: { id },
    });

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    // Replace placeholders with sample data
    const previewHtml = replacePlaceholders(template.htmlContent, sampleData);

    // Return HTML directly for iframe preview
    return new NextResponse(previewHtml, {
      headers: {
        "Content-Type": "text/html",
      },
    });
  } catch (error) {
    console.error("Error generating email preview:", error);
    return NextResponse.json(
      { error: "Failed to generate preview" },
      { status: 500 }
    );
  }
}
