import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "@/lib/email";
import crypto from "crypto";
import { verifyEmail } from "@/lib/neverbounce";
import { detectEmailTypo } from "@/lib/email-typo-detector";

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
// Note: Pro Accelerator uses array for multi-course enrollment
const PRODUCT_COURSE_MAP: Record<string, string | string[]> = {
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

  // OTO1: Pro Accelerator ($397) - enrolls in 3 courses
  "fm-pro-accelerator": ["fm-pro-advanced-clinical", "fm-pro-master-depth", "fm-pro-practice-path"],
  "fm_pro_accelerator": ["fm-pro-advanced-clinical", "fm-pro-master-depth", "fm-pro-practice-path"],
  "accelerator": ["fm-pro-advanced-clinical", "fm-pro-master-depth", "fm-pro-practice-path"],
  "pro-accelerator": ["fm-pro-advanced-clinical", "fm-pro-master-depth", "fm-pro-practice-path"],

  // OTO2: 10-Client Guarantee ($297)
  "fm-client-guarantee": "fm-10-client-guarantee",
  "fm_client_guarantee": "fm-10-client-guarantee",
  "client guarantee": "fm-10-client-guarantee",
  "10-client": "fm-10-client-guarantee",

  // ======================
  // NARC Recovery Coach
  // ======================
  "narc-certification": "narc-recovery-coach-certification",
  "narc_certification": "narc-recovery-coach-certification",
  "narcissistic": "narc-recovery-coach-certification",
  "narc recovery": "narc-recovery-coach-certification",
  "narcissistic abuse": "narc-recovery-coach-certification",

  // NARC Pro Accelerator ($397)
  "narc-pro-accelerator": ["narc-pro-advanced-clinical", "narc-pro-master-depth", "narc-pro-practice-path"],
  "narc_pro_accelerator": ["narc-pro-advanced-clinical", "narc-pro-master-depth", "narc-pro-practice-path"],
};

// Product prices for Meta CAPI (fallback if not in payload)
const PRODUCT_PRICES: Record<string, number> = {
  "fm-mini-diploma": 27,
  "fm-certification": 197,
  "fm-pro-accelerator": 397,
  "fm-client-guarantee": 297,
  "narc-certification": 97,
  "narc-pro-accelerator": 397,
};

// Product display names for Meta CAPI
const PRODUCT_NAMES: Record<string, string> = {
  "fm-mini-diploma": "FM Mini Diploma",
  "fm-certification": "FM Certification",
  "fm-pro-accelerator": "FM Pro Accelerator",
  "fm-client-guarantee": "FM 10-Client Guarantee",
  "narc-certification": "NARC Recovery Coach Certification",
  "narc-pro-accelerator": "NARC Pro Accelerator",
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
    // 0. PRE-VALIDATE EMAIL with NeverBounce (before creating user)
    console.log(`[CF] Pre-validating email: ${normalizedEmail}`);
    const emailValidation = await verifyEmail(normalizedEmail);

    if (!emailValidation.isValid) {
      console.warn(`⚠️ [CF] Invalid email detected: ${normalizedEmail} (${emailValidation.result})`);

      // Try to detect typo suggestion
      const typoResult = await detectEmailTypo(normalizedEmail);

      // Create EmailBounce record for admin review
      await prisma.emailBounce.upsert({
        where: {
          userId_originalEmail: {
            userId: "pre-validation",
            originalEmail: normalizedEmail
          }
        },
        create: {
          userId: "pre-validation",
          originalEmail: normalizedEmail,
          bounceType: `pre_validation_${emailValidation.result}`,
          bounceReason: `ClickFunnels purchase - email failed NeverBounce: ${emailValidation.reason || emailValidation.result}`,
          status: typoResult.hasSuggestion ? "pending" : "needs_manual",
          suggestedEmail: typoResult.suggestedEmail,
          suggestionSource: typoResult.source,
          suggestionConfidence: typoResult.confidence,
          neverBounceResult: emailValidation.result,
          neverBounceCheckedAt: new Date(),
        },
        update: {
          bounceCount: { increment: 1 },
          bounceReason: `ClickFunnels purchase - email failed NeverBounce: ${emailValidation.reason || emailValidation.result}`,
          neverBounceResult: emailValidation.result,
          neverBounceCheckedAt: new Date(),
        },
      });

      console.log(`⚠️ [CF] Created EmailBounce record for ${normalizedEmail}. Suggested: ${typoResult.suggestedEmail || 'none'}`);
      // Don't block the purchase - still create user but flag them
    }

    // Get IP address from request headers (for dispute evidence)
    const purchaseIp = request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      request.headers.get("cf-connecting-ip") || // Cloudflare
      null;
    const purchaseUserAgent = request.headers.get("user-agent");

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
          // DISPUTE EVIDENCE: Capture at purchase time
          registrationIp: purchaseIp,
          registrationUserAgent: purchaseUserAgent,
          tosAcceptedAt: new Date(), // TOS accepted at checkout
          tosVersion: "1.0",
          refundPolicyAcceptedAt: new Date(), // Refund policy accepted at checkout
          refundPolicyVersion: "1.0",
        },
      });

      isNewUser = true;
      console.log(`Created new user from ClickFunnels: ${normalizedEmail} (IP: ${purchaseIp})`);
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
      // Update TOS if not set (for users who existed before we added this)
      if (!(user as any).tosAcceptedAt) {
        updates.tosAcceptedAt = new Date();
        updates.tosVersion = "1.0";
        updates.refundPolicyAcceptedAt = new Date();
        updates.refundPolicyVersion = "1.0";
      }
      // Update registration IP if not set
      if (!(user as any).registrationIp && purchaseIp) {
        updates.registrationIp = purchaseIp;
        updates.registrationUserAgent = purchaseUserAgent;
      }

      if (Object.keys(updates).length > 0) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: updates,
        });
      }
    }

    // 2. Determine which course(s) to enroll
    let courseSlugs: string[] = ["functional-medicine-complete-certification"]; // Default to main certification

    if (productId && PRODUCT_COURSE_MAP[productId]) {
      const mapping = PRODUCT_COURSE_MAP[productId];
      courseSlugs = Array.isArray(mapping) ? mapping : [mapping];
    } else if (productName) {
      // Try to match by product name keywords
      const lowerName = productName.toLowerCase();

      // Check all product keywords
      for (const [key, mapping] of Object.entries(PRODUCT_COURSE_MAP)) {
        if (lowerName.includes(key)) {
          courseSlugs = Array.isArray(mapping) ? mapping : [mapping];
          console.log(`[CF] Product "${productName}" matched keyword "${key}" -> ${courseSlugs.join(', ')}`);
          break;
        }
      }
    }

    console.log(`[CF] Determined course slug(s): ${courseSlugs.join(', ')} for product: ${productName || productId}`);

    // If FM Certification purchase, check if user was in FM Preview and migrate progress
    if (courseSlugs.includes("functional-medicine-complete-certification") && user) {
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

    const enrollmentIds: string[] = [];

    // Enroll user in each course
    for (const courseSlug of courseSlugs) {
      const course = await prisma.course.findFirst({
        where: { slug: courseSlug },
      });

      if (!course) {
        console.log(`[CF] Course not found: ${courseSlug}`);
        continue;
      }

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

        enrollmentIds.push(enrollment.id);

        // Auto-complete Lesson 1 since users already watched it in the preview (only for main cert)
        if (courseSlug === "functional-medicine-complete-certification") {
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

        // Initialize user streak (only once, not per course)
        if (enrollmentIds.length === 1) {
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
        }

        console.log(`Enrolled ${normalizedEmail} in course: ${course.slug}`);
      } else {
        enrollmentIds.push(existingEnrollment.id);
        console.log(`User ${normalizedEmail} already enrolled in: ${course.slug}`);
      }
    }

    // 3. Send welcome email (only once - check tag first to prevent duplicates)
    const alreadySentWelcome = await prisma.userTag.findUnique({
      where: { userId_tag: { userId: user.id, tag: "welcome_email_sent" } },
    });

    if (!alreadySentWelcome) {
      try {
        await sendWelcomeEmail(user.email!, user.firstName || "Student");
        await prisma.userTag.create({
          data: { userId: user.id, tag: "welcome_email_sent", value: new Date().toISOString() },
        });
        console.log(`Sent welcome email to ${normalizedEmail}`);
      } catch (emailError) {
        console.error("Failed to send welcome email:", emailError);
      }
    } else {
      console.log(`[Dedup] Welcome email already sent to ${normalizedEmail}, skipping`);
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
          courseSlugs: courseSlugs,
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
      // Product-specific tag for each course
      for (const slug of courseSlugs) {
        const productTagSlug = `${slug.replace(/-/g, "_")}_purchased`;
        await prisma.userTag.upsert({
          where: { userId_tag: { userId: user.id, tag: productTagSlug } },
          update: {},
          create: { userId: user.id, tag: productTagSlug },
        });
      }

      // General purchase tag
      await prisma.userTag.upsert({
        where: { userId_tag: { userId: user.id, tag: "clickfunnels_purchase" } },
        update: {},
        create: { userId: user.id, tag: "clickfunnels_purchase" },
      });

      console.log(`[CF] ✅ Added tags for courses: ${courseSlugs.join(', ')}, clickfunnels_purchase to ${normalizedEmail}`);
    } catch (tagError) {
      console.error("[CF] Failed to add tags:", tagError);
    }

    return NextResponse.json({
      success: true,
      data: {
        userId: user.id,
        email: user.email,
        isNewUser,
        enrollmentIds,
        courseSlugs,
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
