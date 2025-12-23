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
 * 4. Sends Purchase event to Meta CAPI
 * 5. Logs the webhook event
 *
 * URL: /api/webhooks/clickfunnels
 * Method: POST
 *
 * ClickFunnels sends different payload formats. We support:
 * - ClickFunnels 2.0 format
 * - Legacy ClickFunnels format
 */

// Meta CAPI Configuration
const META_PIXEL_ID = process.env.META_PURCHASE_PIXEL_ID || "1287915349067829";
const META_ACCESS_TOKEN = process.env.META_PURCHASE_ACCESS_TOKEN || "EAAHMlaRKtUoBQBe0ZAFZBQPlRv3xujHeDw0y8kGmRewZA9jaqkbnZA5mJxndHZCNmalSrGmr9DlTbNewOdu4INw4xRRZCE4vC0mSvnWsV17sIvklD9X4PbttSgp2lVIOZBQxG9Uq8UVljCsqZA1LSqxlgjDQ1qIN6PctDh3M5LmJBKkqQa0FDQAIoBN1AAIVqwZDZD";
// Test event code - set in env to route events to Test Events tab in Meta Events Manager
// Set to empty string for production
const META_TEST_EVENT_CODE = process.env.META_TEST_EVENT_CODE || "";

// Hash PII for Meta CAPI (required for user data)
function hashForMeta(data: string): string {
  return crypto.createHash("sha256").update(data.toLowerCase().trim()).digest("hex");
}

// Send Purchase event to Meta Conversions API
async function sendPurchaseToMeta(params: {
  email: string;
  value: number;
  currency?: string;
  contentName: string;
  firstName?: string;
  externalId?: string;
}): Promise<{ success: boolean; eventId?: string; error?: string }> {
  const { email, value, currency = "USD", contentName, firstName, externalId } = params;

  const eventId = crypto.randomUUID();

  const userData: Record<string, unknown> = {
    em: [hashForMeta(email)],
  };
  if (firstName) userData.fn = [hashForMeta(firstName)];
  if (externalId) userData.external_id = [hashForMeta(externalId)];

  const eventData = {
    event_name: "Purchase",
    event_time: Math.floor(Date.now() / 1000),
    event_id: eventId,
    event_source_url: "https://learn.accredipro.academy/fm-mini-diploma/thank-you",
    action_source: "website",
    user_data: userData,
    custom_data: {
      value,
      currency,
      content_name: contentName,
    },
  };

  try {
    // Build request body - include test_event_code if set for debugging
    const requestBody: { data: typeof eventData[]; test_event_code?: string } = {
      data: [eventData]
    };
    if (META_TEST_EVENT_CODE) {
      requestBody.test_event_code = META_TEST_EVENT_CODE;
      console.log(`[Meta CAPI] Using test event code: ${META_TEST_EVENT_CODE}`);
    }

    const response = await fetch(
      `https://graph.facebook.com/v18.0/${META_PIXEL_ID}/events?access_token=${META_ACCESS_TOKEN}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("[Meta CAPI] Error:", result);
      return { success: false, eventId, error: result.error?.message };
    }

    console.log(`[Meta CAPI] ✅ Purchase sent: ${contentName} = $${value}`, { event_id: eventId });
    return { success: true, eventId };
  } catch (error) {
    console.error("[Meta CAPI] Exception:", error);
    return { success: false, error: String(error) };
  }
}

// Product ID to Course slug mapping
// Add your ClickFunnels product IDs here
const PRODUCT_COURSE_MAP: Record<string, string> = {
  // FM Mini Diploma ($27)
  "fm-mini-diploma": "integrative-health-functional-medicine-mini-diploma",
  "fm_mini_diploma": "integrative-health-functional-medicine-mini-diploma",
  "mini-diploma": "integrative-health-functional-medicine-mini-diploma",
  "mini diploma": "integrative-health-functional-medicine-mini-diploma",

  // FM Certification (Main product - maps to complete certification)
  "fm-certification": "functional-medicine-complete-certification",
  "fm_certification": "functional-medicine-complete-certification",
  "certification": "functional-medicine-complete-certification",
  "practitioner": "functional-medicine-complete-certification",
  "coach": "functional-medicine-complete-certification",
  "toolkit": "functional-medicine-complete-certification",
  "business toolkit": "functional-medicine-complete-certification",
  "integrative": "functional-medicine-complete-certification",
  "integrative health": "functional-medicine-complete-certification",

  // OTO1: Pro Accelerator ($397)
  "fm-pro-accelerator": "fm-pro-accelerator",
  "fm_pro_accelerator": "fm-pro-accelerator",
  "accelerator": "fm-pro-accelerator",
  "pro-accelerator": "fm-pro-accelerator",

  // OTO2: 10-Client Guarantee ($297)
  "fm-client-guarantee": "fm-10-client-guarantee",
  "fm_client_guarantee": "fm-10-client-guarantee",
  "client guarantee": "fm-10-client-guarantee",
  "10-client": "fm-10-client-guarantee",
};

// Product prices for Meta CAPI (fallback if not in payload)
const PRODUCT_PRICES: Record<string, number> = {
  "fm-mini-diploma": 27,
  "fm-certification": 197,
  "fm-pro-accelerator": 397,
  "fm-client-guarantee": 297,
};

// Product display names for Meta CAPI
const PRODUCT_NAMES: Record<string, string> = {
  "fm-mini-diploma": "FM Mini Diploma",
  "fm-certification": "FM Certification",
  "fm-pro-accelerator": "FM Pro Accelerator",
  "fm-client-guarantee": "FM 10-Client Guarantee",
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

    console.log(`ClickFunnels webhook received: ${eventType} for ${normalizedEmail}, txn: ${transactionId}`);

    // DEDUPLICATION: Check if we already processed this transaction
    if (transactionId) {
      const existingEvent = await prisma.webhookEvent.findFirst({
        where: {
          eventType: "clickfunnels.purchase",
          payload: {
            path: ["transactionId"],
            equals: transactionId,
          },
        },
      });

      if (existingEvent) {
        console.log(`[Dedup] Transaction ${transactionId} already processed, skipping`);
        return NextResponse.json({
          success: true,
          message: "Duplicate transaction, already processed",
          transactionId,
        });
      }
    }

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
    let courseSlug = "functional-medicine-complete-certification"; // Default to main certification

    if (productId && PRODUCT_COURSE_MAP[productId]) {
      courseSlug = PRODUCT_COURSE_MAP[productId];
    } else if (productName) {
      // Try to match by product name keywords
      const lowerName = productName.toLowerCase();

      // Check all product keywords
      for (const [key, slug] of Object.entries(PRODUCT_COURSE_MAP)) {
        if (lowerName.includes(key)) {
          courseSlug = slug;
          console.log(`[CF] Product "${productName}" matched keyword "${key}" -> ${slug}`);
          break;
        }
      }
    }

    console.log(`[CF] Determined course slug: ${courseSlug} for product: ${productName || productId}`);

    // Find the course
    const course = await prisma.course.findFirst({
      where: { slug: courseSlug },
    });

    // If FM Certification purchase, check if user was in FM Preview and migrate progress
    if (courseSlug === "fm-certification" && user) {
      const previewEnrollment = await prisma.enrollment.findFirst({
        where: {
          userId: user.id,
          course: { slug: "fm-preview" },
        },
        include: {
          course: true,
        },
      });

      if (previewEnrollment) {
        // Mark preview enrollment as COMPLETED (they upgraded)
        await prisma.enrollment.update({
          where: { id: previewEnrollment.id },
          data: { status: "COMPLETED" },
        });

        console.log(`[Upgrade] User ${normalizedEmail} upgraded from FM Preview to FM Certification`);
      }
    }

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

        // Auto-complete Lesson 1 since users already watched it in the preview
        const lesson1 = await prisma.lesson.findFirst({
          where: {
            module: { courseId: course.id },
            order: 0, // First lesson (0-indexed)
          },
        });

        if (lesson1) {
          await prisma.lessonProgress.upsert({
            where: { userId_lessonId: { userId: user.id, lessonId: lesson1.id } },
            update: { isCompleted: true, completedAt: new Date() },
            create: {
              userId: user.id,
              lessonId: lesson1.id,
              isCompleted: true,
              completedAt: new Date(),
            },
          });
          console.log(`Auto-completed Lesson 1 for ${normalizedEmail} (preview was watched)`);
        }

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

    // 3. Send welcome email (for all purchases - new and existing users need login info)
    try {
      await sendWelcomeEmail(user.email!, user.firstName || "Student");
      console.log(`Sent welcome email to ${normalizedEmail}`);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
    }

    // 4. Send Purchase event to Meta CAPI
    // Each product gets its own Purchase event with correct value for optimization
    let metaResult: { success: boolean; eventId?: string; error?: string } = { success: false };
    try {
      // Use product-specific price, fallback to amount from payload, then default
      const purchaseValue = amount || (productId ? PRODUCT_PRICES[productId] : undefined) || 27;
      const contentName = (productId ? PRODUCT_NAMES[productId] : undefined) || productName || "FM Mini Diploma";

      metaResult = await sendPurchaseToMeta({
        email: normalizedEmail,
        value: purchaseValue,
        contentName,
        firstName: user.firstName || firstName,
        externalId: user.id,
      });

      console.log(`[Meta CAPI] Purchase event sent: ${contentName} = $${purchaseValue}`);
    } catch (metaError) {
      console.error("Failed to send Meta CAPI event:", metaError);
    }

    // 5. Log webhook event
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
          metaEventId: metaResult.eventId,
          metaSuccess: metaResult.success,
          processingTime: Date.now() - startTime,
        },
        status: "sent",
        processedAt: new Date(),
      },
    });

    // 6. Add product-specific tags using UserTag (same as clickfunnels-purchase webhook)
    try {
      // Product-specific tag (e.g., functional_medicine_complete_certification_purchased)
      const productTagSlug = `${courseSlug.replace(/-/g, "_")}_purchased`;

      await prisma.userTag.upsert({
        where: { userId_tag: { userId: user.id, tag: productTagSlug } },
        update: {},
        create: { userId: user.id, tag: productTagSlug },
      });

      // General purchase tag
      await prisma.userTag.upsert({
        where: { userId_tag: { userId: user.id, tag: "clickfunnels_purchase" } },
        update: {},
        create: { userId: user.id, tag: "clickfunnels_purchase" },
      });

      console.log(`[CF] ✅ Added tags: ${productTagSlug}, clickfunnels_purchase to ${normalizedEmail}`);
    } catch (tagError) {
      console.error("[CF] Failed to add tags:", tagError);
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
        metaEventSent: metaResult.success,
        metaEventId: metaResult.eventId,
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
