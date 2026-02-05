import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

// POST - Send reply to scholarship applicant
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    console.log("[Scholarship Reply] Session:", session?.user?.email, session?.user?.role);

    if (!session?.user || !["ADMIN", "SUPERUSER", "INSTRUCTOR"].includes(session.user.role as string)) {
      console.log("[Scholarship Reply] Unauthorized - role:", session?.user?.role);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { visitorId, message } = await request.json();
    console.log("[Scholarship Reply] Request:", { visitorId, messageLength: message?.length });

    if (!visitorId || !message?.trim()) {
      console.log("[Scholarship Reply] Missing fields:", { visitorId: !!visitorId, message: !!message?.trim() });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Find the original conversation to get page info
    const existingMessage = await prisma.salesChat.findFirst({
      where: { visitorId },
      orderBy: { createdAt: "desc" },
    });

    console.log("[Scholarship Reply] Found existing message:", !!existingMessage, existingMessage?.page);

    if (!existingMessage) {
      return NextResponse.json({ error: "Conversation not found" }, { status: 404 });
    }

    // Create the reply message
    // Note: repliedBy is a foreign key to User, so we use the session user's ID
    // The display name "Sarah M." is shown on the frontend
    const reply = await prisma.salesChat.create({
      data: {
        visitorId,
        page: existingMessage.page,
        message: message.trim(),
        isFromVisitor: false,
        isRead: true,
        visitorName: existingMessage.visitorName,
        visitorEmail: existingMessage.visitorEmail,
        repliedBy: session.user.id, // Use actual user ID for foreign key
      },
    });

    // Mark all visitor messages as read
    await prisma.salesChat.updateMany({
      where: {
        visitorId,
        isFromVisitor: true,
        isRead: false,
      },
      data: { isRead: true },
    });

    // Send email notification if we have visitor's email
    if (existingMessage.visitorEmail) {
      const firstName = existingMessage.visitorName?.split(" ")[0] || "there";
      try {
        await sendEmail({
          to: existingMessage.visitorEmail,
          from: "Sarah M. <sarah@accredipro-certificate.com>",
          subject: `${firstName}, I just replied to your message! 💬`,
          type: "transactional",
          text: `Hey ${firstName}!

I just sent you a message about your scholarship application.

Go back to your results page to see my reply — I'm waiting for you in the chat!

Talk soon,

Sarah M.
Scholarship Director
Accredipro Specialists Institute

P.S. Don't wait too long — scholarship spots are limited! 💛`,
          html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Georgia, serif; line-height: 1.8; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background: #fafafa;">
  <div style="background: white; padding: 30px; border-radius: 8px;">
    <p style="font-size: 16px; margin: 0 0 20px 0;">Hey ${firstName}!</p>
    <p style="font-size: 18px; margin: 0 0 20px 0;"><strong>I just sent you a message about your scholarship application. 💬</strong></p>
    <p style="margin: 0 0 25px 0;">Go back to your results page to see my reply — I'm waiting for you in the chat!</p>
    <p style="margin: 0 0 5px 0;">Talk soon,</p>
    <p style="margin: 0 0 5px 0; font-weight: bold; color: #722f37;">Sarah M.</p>
    <p style="margin: 0; font-size: 14px; color: #666;">Scholarship Director<br>Accredipro Specialists Institute</p>
    <p style="margin: 30px 0 0 0; font-size: 14px; color: #888; padding-top: 20px; border-top: 1px solid #eee;">
      P.S. Don't wait too long — scholarship spots are limited! 💛
    </p>
  </div>
</body>
</html>`,
        });
        console.log(`[Scholarships] Sent reply notification email to ${existingMessage.visitorEmail}`);
      } catch (emailError) {
        console.error("[Scholarships] Failed to send reply notification:", emailError);
        // Don't fail the reply if email fails
      }
    }

    console.log(`[Scholarships] Reply sent to ${visitorId}: ${message.substring(0, 50)}...`);
    return NextResponse.json({ success: true, reply });
  } catch (error) {
    console.error("Failed to send scholarship reply:", error);
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500 });
  }
}
