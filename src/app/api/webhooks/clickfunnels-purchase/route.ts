import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";

/**
 * ClickFunnels Purchase Webhook
 *
 * Complete purchase processing:
 * 1. Creates user account (if new)
 * 2. Enrolls in appropriate course
 * 3. Sends welcome email
 * 4. Sends Purchase event to Meta CAPI
 * 5. Adds product-specific tags
 *
 * Supports: FM Mini Diploma, FM Certification, Pro Accelerator, Client Guarantee
 */

// Meta CAPI Configuration
const PURCHASE_PIXEL_ID = process.env.META_PURCHASE_PIXEL_ID || "1287915349067829";
const PURCHASE_ACCESS_TOKEN = process.env.META_PURCHASE_ACCESS_TOKEN || "EAAHMlaRKtUoBQBe0ZAFZBQPlRv3xujHeDw0y8kGmRewZA9jaqkbnZA5mJxndHZCNmalSrGmr9DlTbNewOdu4INw4xRRZCE4vC0mSvnWsV17sIvklD9X4PbttSgp2lVIOZBQxG9Uq8UVljCsqZA1LSqxlgjDQ1qIN6PctDh3M5LmJBKkqQa0FDQAIoBN1AAIVqwZDZD";

// Product mappings
// FIXED: Map to ACTUAL database slugs
const PRODUCT_COURSE_MAP: Record<string, string> = {
    // FM Mini Diploma ($27)
    "fm-mini-diploma": "integrative-health-functional-medicine-mini-diploma",
    "fm_mini_diploma": "integrative-health-functional-medicine-mini-diploma",
    "mini diploma": "integrative-health-functional-medicine-mini-diploma",
    "mini-diploma": "integrative-health-functional-medicine-mini-diploma",
    "r.o.o.t.s": "integrative-health-functional-medicine-mini-diploma",
    "roots": "integrative-health-functional-medicine-mini-diploma",

    // FM Certification ($97 XMAS) - THE MAIN PRODUCT
    // Maps to: functional-medicine-complete-certification
    "fm-certification": "functional-medicine-complete-certification",
    "fm_certification": "functional-medicine-complete-certification",
    "certification": "functional-medicine-complete-certification",
    "fm cert": "functional-medicine-complete-certification",
    "functional medicine": "functional-medicine-complete-certification",
    "practitioner": "functional-medicine-complete-certification",
    "complete certification": "functional-medicine-complete-certification",
    "complete-certification": "functional-medicine-complete-certification",

    // Pro Accelerator ($397 XMAS)
    "fm-pro-accelerator": "fm-pro-accelerator",
    "pro accelerator": "fm-pro-accelerator",
    "accelerator": "fm-pro-accelerator",
    "pro-accelerator": "fm-pro-accelerator",
    "advanced": "fm-pro-accelerator",
    "master": "fm-pro-accelerator",

    // Client Guarantee ($497)
    "fm-client-guarantee": "fm-10-client-guarantee",
    "client guarantee": "fm-10-client-guarantee",
    "10-client": "fm-10-client-guarantee",
    "10 client": "fm-10-client-guarantee",
};

const PRODUCT_PRICES: Record<string, number> = {
    "integrative-health-functional-medicine-mini-diploma": 27,
    "functional-medicine-complete-certification": 97,  // XMAS PRICE
    "functional-medicine-certification": 97,           // Fallback
    "fm-pro-accelerator": 397,                         // XMAS PRICE
    "fm-10-client-guarantee": 497,
};

const PRODUCT_NAMES: Record<string, string> = {
    "integrative-health-functional-medicine-mini-diploma": "R.O.O.T.S. Method Mini Diploma",
    "functional-medicine-complete-certification": "Certified FM Practitioner",
    "functional-medicine-certification": "Certified FM Practitioner",
    "fm-pro-accelerator": "FM Pro Accelerator",
    "fm-10-client-guarantee": "10-Client Guarantee Mentorship",
};

// Hash PII for Meta
function hashData(data: string): string {
    return crypto.createHash("sha256").update(data.toLowerCase().trim()).digest("hex");
}

// Send Purchase event to Meta CAPI
async function sendPurchaseToMeta(params: {
    email: string;
    value: number;
    currency?: string;
    contentName: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    clientIp?: string;
    userAgent?: string;
    externalId?: string;
    fbp?: string;
    fbc?: string;
}): Promise<{ success: boolean; eventId?: string; error?: string }> {
    const {
        email, value, currency = "USD", contentName, firstName, lastName,
        phone, city, state, zip, country, clientIp, userAgent, externalId,
        fbp, fbc
    } = params;

    const eventId = crypto.randomUUID();

    const userData: Record<string, unknown> = {
        em: [hashData(email)],
    };

    // Add all available PII
    if (firstName) userData.fn = [hashData(firstName)];
    if (lastName) userData.ln = [hashData(lastName)];
    if (phone) userData.ph = [hashData(phone.replace(/\D/g, ""))];
    if (city) userData.ct = [hashData(city)];
    if (state) userData.st = [hashData(state)];
    if (zip) userData.zp = [hashData(zip)];
    if (country) userData.country = [hashData(country)];

    // Tech info (not hashed)
    if (clientIp) userData.client_ip_address = clientIp;
    if (userAgent) userData.client_user_agent = userAgent;
    if (fbp) userData.fbp = fbp;
    if (fbc) userData.fbc = fbc;
    if (externalId) userData.external_id = [hashData(externalId)];

    const eventData = {
        event_name: "Purchase",
        event_time: Math.floor(Date.now() / 1000),
        event_id: eventId,
        event_source_url: "https://sarah.accredipro.academy/checkout",
        action_source: "website",
        user_data: userData,
        custom_data: {
            value,
            currency,
            content_name: contentName,
        },
    };

    try {
        const response = await fetch(
            `https://graph.facebook.com/v18.0/${PURCHASE_PIXEL_ID}/events?access_token=${PURCHASE_ACCESS_TOKEN}`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ data: [eventData] }),
            }
        );

        const result = await response.json();

        if (!response.ok) {
            console.error("[Meta CAPI] Error:", result);
            return { success: false, eventId, error: result.error?.message };
        }

        console.log(`[Meta CAPI] ✅ Purchase sent: ${contentName} = $${value}, EV_ID: ${eventId}`);
        return { success: true, eventId };
    } catch (error) {
        console.error("[Meta CAPI] Exception:", error);
        return { success: false, error: String(error) };
    }
}

// Determine course slug from product name
function getCourseSlug(productName: string): string {
    const lowerName = productName.toLowerCase();

    // Check direct mappings first
    for (const [key, slug] of Object.entries(PRODUCT_COURSE_MAP)) {
        if (lowerName.includes(key)) {
            console.log(`[CF Purchase] Product "${productName}" matched to course slug: ${slug}`);
            return slug;
        }
    }

    // Default to the main certification
    console.log(`[CF Purchase] Product "${productName}" NOT MATCHED - defaulting to functional-medicine-certification`);
    return "functional-medicine-certification";
}

// Generate random password
function generatePassword(): string {
    return crypto.randomBytes(12).toString("base64").slice(0, 16);
}

export async function POST(request: NextRequest) {
    const startTime = Date.now();

    try {
        const rawBody = await request.text();
        const body = JSON.parse(rawBody);

        console.log("[CF Purchase] Received webhook:", JSON.stringify(body, null, 2).substring(0, 2000));

        // =====================================================
        // PARSE CLICKFUNNELS 2.0 PAYLOAD
        // =====================================================

        // CF 2.0 structure: { data: { contact: {...}, line_items: [...] }, event_type: "..." }
        const data = body.data || body;
        const contact = data.contact || {};
        const lineItems = data.line_items || data.products || [];
        const firstLineItem = lineItems[0] || {};
        const productsVariant = firstLineItem.products_variant || {};
        const originalProduct = firstLineItem.original_product || {};

        // Extract email (CF 2.0 uses email_address)
        const email = contact.email_address || contact.email || data.email_address || data.email || body.email;
        const firstName = contact.first_name || data.first_name || body.first_name || "";
        const lastName = contact.last_name || data.last_name || body.last_name || "";
        const phone = contact.phone_number || data.phone_number || body.phone || "";

        // Extract product info
        const productSku = productsVariant.sku || originalProduct.sku || "";
        const productName = productsVariant.name || originalProduct.name || firstLineItem.name || body.product_name || "FM Mini Diploma";
        const productAmount = parseFloat(firstLineItem.amount || firstLineItem.price || productsVariant.amount || body.amount) || 27;

        // Extract Address Info (Try to find in contact addresses)
        const addresses = contact.addresses || [];
        const primaryAddress = addresses[0] || {};
        const city = primaryAddress.city || data.city || "";
        const state = primaryAddress.region || primaryAddress.state || data.state || "";
        const zip = primaryAddress.postal_code || primaryAddress.zip || data.zip || "";
        const country = primaryAddress.country_code || primaryAddress.country || data.country || "";

        // Extract Tech Info
        const clientIp = contact.ip_address || data.ip_address || "";
        // CF doesn't always send User Agent directly, but check
        const userAgent = data.user_agent || "";

        // Extract Pixel Cookies (fbp/fbc)
        // Check various locations where custom fields might appear
        const customFields = contact.custom_fields || data.custom_fields || {};
        const fbp = customFields.fbp || data.fbp || contact.fbp || body.fbp || "";
        const fbc = customFields.fbc || data.fbc || contact.fbc || body.fbc || "";

        if (!email) {
            console.error("[CF Purchase] No email in payload");
            return NextResponse.json({ error: "No email provided" }, { status: 400 });
        }

        const normalizedEmail = email.toLowerCase().trim();
        console.log(`[CF Purchase] Processing: ${normalizedEmail}, Name: ${firstName} ${lastName}`);

        // =====================================================
        // 1. CREATE OR FIND USER
        // =====================================================

        let user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
        });

        let isNewUser = false;
        let tempPassword: string | null = null;

        if (!user) {
            // Create new user with standard password
            const standardPassword = "Futurecoach2025";
            const hashedPassword = await bcrypt.hash(standardPassword, 12);

            user = await prisma.user.create({
                data: {
                    email: normalizedEmail,
                    passwordHash: hashedPassword,
                    firstName: firstName || null,
                    lastName: lastName || null,
                    phone: phone || null,
                    role: "STUDENT",
                    emailVerified: new Date(),
                },
            });

            isNewUser = true;
            console.log(`[CF Purchase] ✅ Created new user: ${normalizedEmail}`);
        } else {
            // Update existing user if needed
            const updates: Record<string, string> = {};
            if (!user.firstName && firstName) updates.firstName = firstName;
            if (!user.lastName && lastName) updates.lastName = lastName;
            if (!user.phone && phone) updates.phone = phone;

            if (Object.keys(updates).length > 0) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: updates,
                });
            }
            console.log(`[CF Purchase] Found existing user: ${normalizedEmail}`);
        }

        // =====================================================
        // 2. DETERMINE COURSE AND ENROLL
        // =====================================================

        const courseSlug = getCourseSlug(productName);

        // Try to find course with flexible slug matching
        let course = await prisma.course.findFirst({
            where: { slug: courseSlug },
        });

        // If not found, try alternative slugs (handle legacy mismatches)
        if (!course) {
            console.log(`[CF Purchase] Course not found with slug "${courseSlug}", trying alternatives...`);

            // Try common variations
            const alternativeSlugs = [
                courseSlug.replace('fm-', ''),
                courseSlug.replace('fm-', 'functional-medicine-'),
                'functional-medicine-certification',
                'functional-medicine-complete-certification',
            ];

            for (const altSlug of alternativeSlugs) {
                course = await prisma.course.findFirst({
                    where: { slug: altSlug },
                });
                if (course) {
                    console.log(`[CF Purchase] Found course with alternative slug: ${altSlug}`);
                    break;
                }
            }
        }

        if (!course) {
            console.error(`[CF Purchase] ⚠️ CRITICAL: Course not found for ANY slug variation. Product: "${productName}"`);
        }

        let enrollmentId: string | null = null;

        if (course) {
            // Check for existing enrollment
            const existingEnrollment = await prisma.enrollment.findUnique({
                where: {
                    userId_courseId: { userId: user.id, courseId: course.id },
                },
            });

            if (!existingEnrollment) {
                const enrollment = await prisma.enrollment.create({
                    data: {
                        userId: user.id,
                        courseId: course.id,
                        status: "ACTIVE",
                        progress: 0,
                    },
                });
                enrollmentId = enrollment.id;
                console.log(`[CF Purchase] ✅ Enrolled in: ${courseSlug}`);
            } else {
                enrollmentId = existingEnrollment.id;
                console.log(`[CF Purchase] Already enrolled in: ${courseSlug}`);
            }

            // If FM Certification, mark any FM Preview as completed (upgrade)
            if (courseSlug === "fm-certification") {
                const previewEnrollment = await prisma.enrollment.findFirst({
                    where: {
                        userId: user.id,
                        course: { slug: "fm-preview" },
                    },
                });

                if (previewEnrollment) {
                    await prisma.enrollment.update({
                        where: { id: previewEnrollment.id },
                        data: { status: "COMPLETED" },
                    });
                    console.log(`[CF Purchase] Upgraded from FM Preview`);
                }
            }
        } else {
            console.error(`[CF Purchase] Course not found: ${courseSlug}`);
        }

        // =====================================================
        // 3. SEND WELCOME EMAIL (ALWAYS - returning users may have forgotten credentials)
        // =====================================================

        try {
            console.log(`[CF Purchase] Sending welcome email to ${normalizedEmail}...`);
            const emailResult = await sendWelcomeEmail(normalizedEmail, firstName || "Student");
            if (emailResult.success) {
                console.log(`[CF Purchase] ✅ Welcome email sent successfully`);
            } else {
                console.error(`[CF Purchase] ❌ Welcome email failed:`, emailResult.error);
            }
        } catch (emailError) {
            console.error("[CF Purchase] ❌ Exception sending welcome email:", emailError);
        }

        // Also send enrollment confirmation if we enrolled them
        if (enrollmentId && course) {
            try {
                const { sendCourseEnrollmentEmail } = await import("@/lib/email");
                await sendCourseEnrollmentEmail(normalizedEmail, firstName || "Student", course.title, course.slug);
                console.log(`[CF Purchase] ✅ Enrollment confirmation email sent`);
            } catch (enrollError) {
                console.error("[CF Purchase] Failed to send enrollment email:", enrollError);
            }
        }

        // =====================================================
        // 4. SEND PURCHASE TO META CAPI
        // =====================================================

        const purchaseValue = productAmount || PRODUCT_PRICES[courseSlug] || 27;
        const contentName = PRODUCT_NAMES[courseSlug] || productName;

        const metaResult = await sendPurchaseToMeta({
            email: normalizedEmail,
            value: purchaseValue,
            contentName,
            firstName: user.firstName || firstName,
            lastName: user.lastName || lastName,
            phone: user.phone || phone,
            externalId: user.id,
            zip,
            country,
            clientIp,
            userAgent,
            fbp,
            fbc
        });

        // =====================================================
        // 5. ADD PRODUCT-SPECIFIC TAGS
        // =====================================================

        try {
            // Product-specific tag (e.g., fm_certification_purchased)
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

            console.log(`[CF Purchase] ✅ Added tag: ${productTagSlug}`);
        } catch (tagError) {
            console.error("[CF Purchase] Failed to add tags:", tagError);
        }

        // =====================================================
        // 6. LOG WEBHOOK EVENT
        // =====================================================

        await prisma.webhookEvent.create({
            data: {
                eventType: "clickfunnels.purchase",
                payload: {
                    ...body,
                    _processed: {
                        email: normalizedEmail,
                        product: productName,
                        courseSlug,
                        amount: purchaseValue,
                        isNewUser,
                        enrollmentId,
                        metaSuccess: metaResult.success,
                        metaEventId: metaResult.eventId,
                        processingTime: Date.now() - startTime,
                    },
                },
                status: "sent",
                processedAt: new Date(),
            },
        });

        console.log(`[CF Purchase] ✅ Complete! User: ${normalizedEmail}, Course: ${courseSlug}, Meta: ${metaResult.success ? "✅" : "❌"}`);

        return NextResponse.json({
            success: true,
            data: {
                userId: user.id,
                email: normalizedEmail,
                isNewUser,
                courseSlug,
                enrollmentId,
                metaEventSent: metaResult.success,
                processingTime: Date.now() - startTime,
            },
        });

    } catch (error) {
        console.error("[CF Purchase] Error:", error);
        return NextResponse.json(
            { error: "Failed to process purchase webhook", details: String(error) },
            { status: 500 }
        );
    }
}

// GET for webhook verification
export async function GET() {
    return NextResponse.json({
        status: "ok",
        endpoint: "clickfunnels-purchase",
        message: "Webhook endpoint is active",
        supports: ["fm-mini-diploma", "fm-certification", "fm-pro-accelerator", "fm-client-guarantee"],
    });
}
