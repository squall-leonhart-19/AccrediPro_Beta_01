import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "@/lib/email";
import crypto from "crypto";

/**
 * ClickFunnels Webhook Endpoint
 *
 * Receives payment notifications from ClickFunnels and:
 * 1. Creates or finds user account
 * 2. Enrolls them in the appropriate course
 * 3. Sends welcome email
 * 4. Logs the webhook event
 *
 * URL: /api/webhooks/clickfunnels
 * Method: POST
 *
 * ClickFunnels sends different payload formats. We support:
 * - ClickFunnels 2.0 format
 * - Legacy ClickFunnels format
 */

// Product ID to Course slug mapping
// Add your ClickFunnels product IDs here
const PRODUCT_COURSE_MAP: Record<string, string> = {
  // FM Mini Diploma ($7)
  "fm-mini-diploma": "functional-medicine-certification",
  "fm_mini_diploma": "functional-medicine-certification",
  // Add more mappings as needed
  // "cf-product-id": "course-slug",
};

// Verify ClickFunnels webhook signature (if they provide one)
function verifySignature(
  payload: string,
  signature: string | null,
  secret: string
): boolean {
  if (!signature || !secret) return true; // Skip if no signature provided

  try {
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  } catch {
    return false;
  }
}

// Parse ClickFunnels payload into standard format
interface ParsedPayload {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  productId?: string;
  productName?: string;
  transactionId?: string;
  amount?: number;
  eventType: string;
}

function parseClickFunnelsPayload(body: Record<string, unknown>): ParsedPayload | null {
  // Log the full payload structure for debugging
  console.log("Parsing CF payload:", JSON.stringify(body, null, 2).substring(0, 2000));

  // ClickFunnels 2.0 V2 webhooks format (order.completed, one-time-order.completed)
  // Structure: { data: { contact: { email_address, first_name, ... }, line_items: [...] }, event_type: "order.completed" }
  if (body.data && typeof body.data === 'object') {
    const data = body.data as Record<string, unknown>;
    const contact = data.contact as Record<string, unknown> | undefined;
    const lineItems = data.line_items as Array<Record<string, unknown>> | undefined;
    const firstLineItem = lineItems?.[0];
    const productsVariant = firstLineItem?.products_variant as Record<string, unknown> | undefined;
    const originalProduct = firstLineItem?.original_product as Record<string, unknown> | undefined;

    // Get contact info - CF uses email_address, not email
    const contactEmail = contact?.email_address || contact?.email || data.email_address;
    const contactFirstName = contact?.first_name || data.first_name;
    const contactLastName = contact?.last_name || data.last_name;
    const contactPhone = contact?.phone_number || data.phone_number;

    // Get product info from products_variant (has SKU) or original_product
    const productSku = productsVariant?.sku;
    const productId = productsVariant?.id || originalProduct?.id || firstLineItem?.id;
    const productName = productsVariant?.name || originalProduct?.name;

    console.log("Parsed contact:", { contactEmail, contactFirstName, contactLastName });
    console.log("Parsed product:", { productSku, productId, productName });

    if (contactEmail) {
      return {
        email: String(contactEmail),
        firstName: String(contactFirstName || ""),
        lastName: String(contactLastName || ""),
        phone: contactPhone ? String(contactPhone) : undefined,
        productId: String(productSku || productId || ""),
        productName: productName ? String(productName) : undefined,
        transactionId: String(data.id || data.public_id || ""),
        amount: data.total_amount ? Number(data.total_amount) : undefined,
        eventType: String(body.event_type || "purchase"),
      };
    }
  }

  // ClickFunnels 2.0 format (older structure)
  if (body.contact && typeof body.contact === 'object') {
    const contact = body.contact as Record<string, unknown>;
    const purchase = body.purchase as Record<string, unknown> | undefined;

    return {
      email: (contact.email as string) || "",
      firstName: (contact.first_name as string) || (contact.firstName as string) || "",
      lastName: (contact.last_name as string) || (contact.lastName as string) || "",
      phone: contact.phone as string | undefined,
      productId: purchase?.product_id as string | undefined,
      productName: purchase?.product_name as string | undefined,
      transactionId: purchase?.transaction_id as string | undefined,
      amount: purchase?.amount as number | undefined,
      eventType: (body.event as string) || "purchase",
    };
  }

  // ClickFunnels legacy format / Webhook format
  if (body.email || body.contact_email) {
    return {
      email: (body.email as string) || (body.contact_email as string) || "",
      firstName: (body.first_name as string) || (body.firstName as string) || (body.contact_first_name as string) || "",
      lastName: (body.last_name as string) || (body.lastName as string) || (body.contact_last_name as string) || "",
      phone: (body.phone as string) || (body.contact_phone as string),
      productId: (body.product_id as string) || (body.productId as string) || (body.funnel_step_product_id as string),
      productName: (body.product_name as string) || (body.productName as string),
      transactionId: (body.transaction_id as string) || (body.stripe_charge_id as string),
      amount: body.amount ? Number(body.amount) : undefined,
      eventType: (body.event as string) || (body.type as string) || "purchase",
    };
  }

  // Direct simple format
  if (body.customer && typeof body.customer === 'object') {
    const customer = body.customer as Record<string, unknown>;
    const product = body.product as Record<string, unknown> | undefined;
    const transaction = body.transaction as Record<string, unknown> | undefined;

    return {
      email: (customer.email as string) || "",
      firstName: (customer.first_name as string) || "",
      lastName: (customer.last_name as string) || "",
      phone: customer.phone as string | undefined,
      productId: product?.id as string | undefined,
      productName: product?.name as string | undefined,
      transactionId: transaction?.id as string | undefined,
      amount: transaction?.amount as number | undefined,
      eventType: (body.type as string) || "purchase",
    };
  }

  return null;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Get raw payload for signature verification
    const rawPayload = await request.text();

    // Verify webhook signature if secret is configured
    const signature = request.headers.get("X-Signature") ||
                     request.headers.get("x-clickfunnels-signature") ||
                     request.headers.get("x-webhook-signature");
    const secret = process.env.CLICKFUNNELS_WEBHOOK_SECRET || "";

    // Log incoming webhook for debugging
    console.log("ClickFunnels webhook received:", {
      headers: Object.fromEntries(request.headers.entries()),
      payloadPreview: rawPayload.substring(0, 500),
    });

    // Skip signature verification for now - CF V2 uses different method
    // TODO: Re-enable once we confirm the signature format
    // if (secret && !verifySignature(rawPayload, signature, secret)) {
    //   console.error("ClickFunnels webhook: Invalid signature");
    //   return NextResponse.json(
    //     { success: false, error: "Invalid signature" },
    //     { status: 401 }
    //   );
    // }

    // Parse payload
    const body = JSON.parse(rawPayload);
    const parsed = parseClickFunnelsPayload(body);

    if (!parsed || !parsed.email) {
      console.error("ClickFunnels webhook: No email in payload", body);
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const { email, firstName, lastName, phone, productId, productName, transactionId, amount, eventType } = parsed;
    const normalizedEmail = email.toLowerCase().trim();

    console.log(`ClickFunnels webhook received: ${eventType} for ${normalizedEmail}`);

    // Handle refunds - deactivate enrollment
    if (eventType === "refund" || eventType === "refunded" || eventType === "charge.refunded") {
      const user = await prisma.user.findUnique({
        where: { email: normalizedEmail },
      });

      if (user) {
        // Cancel all active enrollments for this user
        await prisma.enrollment.updateMany({
          where: { userId: user.id, status: "ACTIVE" },
          data: { status: "CANCELLED" },
        });

        console.log(`Refund processed: Cancelled enrollments for ${normalizedEmail}`);
      }

      // Log the refund event
      await prisma.webhookEvent.create({
        data: {
          eventType: "clickfunnels.refund",
          payload: body,
          status: "sent",
          processedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: "Refund processed",
        data: { email: normalizedEmail },
      });
    }

    // Handle purchases
    // 1. Find or create user
    let user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    let isNewUser = false;

    if (!user) {
      // Use standard password for all new accounts
      const defaultPassword = "Futurecoach2025";
      const passwordHash = await bcrypt.hash(defaultPassword, 12);

      user = await prisma.user.create({
        data: {
          email: normalizedEmail,
          firstName: firstName || "Student",
          lastName: lastName || "",
          passwordHash,
          role: "STUDENT",
          isActive: true,
          leadSource: "ClickFunnels",
          leadSourceDetail: productName || productId || "Purchase",
          phone: phone || null,
          // Set mini diploma fields for FM products
          miniDiplomaCategory: productId?.includes("fm") || productName?.toLowerCase().includes("functional")
            ? "functional-medicine"
            : null,
          miniDiplomaOptinAt: new Date(),
        },
      });

      isNewUser = true;
      console.log(`Created new user from ClickFunnels: ${normalizedEmail}`);
    } else {
      // Update existing user with any new info
      const updates: Record<string, unknown> = {};
      if (!user.firstName && firstName) updates.firstName = firstName;
      if (!user.lastName && lastName) updates.lastName = lastName;
      if (!user.phone && phone) updates.phone = phone;
      if (!user.leadSource) {
        updates.leadSource = "ClickFunnels";
        updates.leadSourceDetail = productName || productId || "Purchase";
      }

      if (Object.keys(updates).length > 0) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: updates,
        });
      }
    }

    // 2. Determine which course to enroll
    let courseSlug = "functional-medicine-certification"; // Default to FM cert

    if (productId && PRODUCT_COURSE_MAP[productId]) {
      courseSlug = PRODUCT_COURSE_MAP[productId];
    } else if (productName) {
      // Try to match by product name
      const lowerName = productName.toLowerCase();
      if (lowerName.includes("mini diploma") || lowerName.includes("mini-diploma")) {
        courseSlug = "functional-medicine-certification";
      }
    }

    // Find the course
    const course = await prisma.course.findFirst({
      where: {
        OR: [
          { slug: courseSlug },
          { slug: "functional-medicine-certification" },
          { isPublished: true },
        ],
      },
      orderBy: { createdAt: "asc" },
    });

    let enrollmentId: string | null = null;

    if (course) {
      // Check if already enrolled
      const existingEnrollment = await prisma.enrollment.findUnique({
        where: {
          userId_courseId: { userId: user.id, courseId: course.id },
        },
      });

      if (!existingEnrollment) {
        // Create enrollment
        const enrollment = await prisma.enrollment.create({
          data: {
            userId: user.id,
            courseId: course.id,
            status: "ACTIVE",
            progress: 0,
          },
        });

        enrollmentId = enrollment.id;

        // Update course analytics
        await prisma.courseAnalytics.upsert({
          where: { courseId: course.id },
          update: { totalEnrolled: { increment: 1 } },
          create: {
            courseId: course.id,
            totalEnrolled: 1,
          },
        });

        // Initialize user streak
        await prisma.userStreak.upsert({
          where: { userId: user.id },
          update: {},
          create: {
            userId: user.id,
            currentStreak: 0,
            longestStreak: 0,
            totalPoints: 0,
          },
        });

        console.log(`Enrolled ${normalizedEmail} in course: ${course.slug}`);
      } else {
        enrollmentId = existingEnrollment.id;
        console.log(`User ${normalizedEmail} already enrolled in: ${course.slug}`);
      }
    }

    // 3. Send welcome email (only for new users)
    if (isNewUser) {
      try {
        await sendWelcomeEmail({
          to: user.email!,
          firstName: user.firstName || "Student",
          courseName: course?.title || "Functional Medicine Certification",
          courseSlug: course?.slug || "functional-medicine-certification",
        });
        console.log(`Sent welcome email to ${normalizedEmail}`);
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
      }
    }

    // 4. Log webhook event
    await prisma.webhookEvent.create({
      data: {
        eventType: "clickfunnels.purchase",
        payload: {
          email: normalizedEmail,
          firstName,
          lastName,
          productId,
          productName,
          transactionId,
          amount,
          isNewUser,
          courseSlug: course?.slug,
          processingTime: Date.now() - startTime,
        },
        status: "sent",
        processedAt: new Date(),
      },
    });

    // 5. Add marketing tag for tracking
    try {
      const purchaseTag = await prisma.marketingTag.findFirst({
        where: { slug: "clickfunnels_purchase" },
      });

      if (purchaseTag) {
        await prisma.userTag.upsert({
          where: {
            userId_tagId: { userId: user.id, tagId: purchaseTag.id },
          },
          update: {},
          create: {
            userId: user.id,
            tagId: purchaseTag.id,
            source: "ClickFunnels",
          },
        });
      }
    } catch {
      // Tag doesn't exist, skip
    }

    return NextResponse.json({
      success: true,
      data: {
        userId: user.id,
        email: user.email,
        isNewUser,
        enrollmentId,
        courseSlug: course?.slug,
        transactionId,
        processingTime: Date.now() - startTime,
      },
    });

  } catch (error) {
    console.error("ClickFunnels webhook error:", error);

    // Log failed webhook
    try {
      await prisma.webhookEvent.create({
        data: {
          eventType: "clickfunnels.error",
          payload: { error: String(error) },
          status: "failed",
          attempts: 1,
          lastError: String(error),
        },
      });
    } catch (logError) {
      console.error("Failed to log webhook error:", logError);
    }

    return NextResponse.json(
      { success: false, error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

// GET endpoint to verify webhook is active
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "ClickFunnels webhook is active",
    endpoint: "/api/webhooks/clickfunnels",
    method: "POST",
    supportedEvents: ["purchase", "refund"],
    configuration: {
      webhookUrl: "https://yourdomain.com/api/webhooks/clickfunnels",
      signatureHeader: "X-Signature (optional)",
      envVariable: "CLICKFUNNELS_WEBHOOK_SECRET",
    },
    testPayload: {
      email: "test@example.com",
      first_name: "Jane",
      last_name: "Doe",
      product_id: "fm-mini-diploma",
      product_name: "FM Mini Diploma",
      transaction_id: "txn_123456",
      amount: 7,
    },
  });
}
