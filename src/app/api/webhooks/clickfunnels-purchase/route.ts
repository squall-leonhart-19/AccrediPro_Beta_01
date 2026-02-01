import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";
import { verifyEmail } from "@/lib/neverbounce";
import { sendPurchaseDMs } from "@/lib/auto-dm-service";
import { triggerAutoMessage } from "@/lib/auto-messages";

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
    "practictioner": "functional-medicine-complete-certification", // Typo in CF
    "complete certification": "functional-medicine-complete-certification",
    "complete-certification": "functional-medicine-complete-certification",
    // NEW: Coach Business Toolkit & Integrative Health products
    "coach": "functional-medicine-complete-certification",
    "toolkit": "functional-medicine-complete-certification",
    "business toolkit": "functional-medicine-complete-certification",
    "integrative": "functional-medicine-complete-certification",
    "integrative health": "functional-medicine-complete-certification",

    // === NEW 2025 CERTIFICATIONS ===
    // 1. Holistic Nutrition (Main Certification)
    "holistic nutrition": "holistic-nutrition-coach-certification",
    "holistic-nutrition": "holistic-nutrition-coach-certification",
    "nutrition coach": "holistic-nutrition-coach-certification",

    // HN Pro Accelerator Bundle ($397)
    "hn-pro-accelerator": "hn-pro-accelerator",
    "hn pro accelerator": "hn-pro-accelerator",
    "holistic nutrition pro": "hn-pro-accelerator",
    "nutrition pro accelerator": "hn-pro-accelerator",

    // 2. NARC Recovery
    "narc": "narc-recovery-coach-certification",
    "narcissistic": "narc-recovery-coach-certification",
    "abuse recovery": "narc-recovery-coach-certification",

    // 3. Christian Life Coach
    "christian": "christian-life-coach-certification",
    "faith-based": "christian-life-coach-certification",

    // 4. Life Coach
    "life coach": "life-coach-certification",
    "life-coach": "life-coach-certification",

    // 5. Grief & Loss
    "grief": "grief-loss-coach-certification",
    "bereavement": "grief-loss-coach-certification",

    // 6. Energy Healing
    "energy healing": "energy-healing-certification",
    "reiki": "energy-healing-certification",

    // 7. Conscious Parenting
    "conscious parenting": "conscious-parenting-certification",
    "mindful parenting": "conscious-parenting-certification",

    // 8. Pet Wellness
    "pet": "pet-wellness-certification",
    "animal": "pet-wellness-certification",

    // 9. LGBTQ+ Life Coach
    "lgbtq": "lgbtq-life-coach-certification",
    "affirming": "lgbtq-life-coach-certification",

    // 10. Women's Hormone Health (WH)
    "womens hormone": "womens-hormone-health-coach-certification",
    "women's hormone": "womens-hormone-health-coach-certification",
    "hormone health": "womens-hormone-health-coach-certification",
    "wh-certification": "womens-hormone-health-coach-certification",
    "wh-pro-accelerator": "wh-pro-accelerator",
    "wh pro accelerator": "wh-pro-accelerator",

    // 11. Gut Health & Microbiome (GH)
    "gut health": "gut-health-microbiome-coach-certification",
    "microbiome": "gut-health-microbiome-coach-certification",
    "digestive": "gut-health-microbiome-coach-certification",
    "gh-certification": "gut-health-microbiome-coach-certification",
    "gh-pro-accelerator": "gh-pro-accelerator",
    "gh pro accelerator": "gh-pro-accelerator",

    // === DFY (Done-For-You) Products - MUST BE BEFORE 'accelerator' keyword ===
    "done-for-you business accelerator": "dfy-business-accelerator",
    "done for you business accelerator": "dfy-business-accelerator",
    "dfy business accelerator": "dfy-business-accelerator",
    "dfy-business-accelerator": "dfy-business-accelerator",
    "dfy business kit": "dfy-business-kit",
    "dfy-business-kit": "dfy-business-kit",
    "done-for-you business kit": "dfy-business-kit",
    "done for you business kit": "dfy-business-kit",
    "dfy program": "dfy-business-kit",
    "dfy_program_ds": "dfy-business-kit",

    // Pro Accelerator ($397 XMAS) - generic 'accelerator' AFTER DFY patterns
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
    // DFY Products
    "dfy-business-accelerator": 397,
    "dfy-business-kit": 397,
    // Holistic Nutrition
    "holistic-nutrition-coach-certification": 97,
    "hn-pro-accelerator": 397,
    // Women's Hormone Health
    "womens-hormone-health-coach-certification": 97,
    "wh-pro-accelerator": 397,
    // Gut Health & Microbiome
    "gut-health-microbiome-coach-certification": 97,
    "gh-pro-accelerator": 397,
};

const PRODUCT_NAMES: Record<string, string> = {
    "integrative-health-functional-medicine-mini-diploma": "R.O.O.T.S. Method Mini Diploma",
    "functional-medicine-complete-certification": "Certified FM Practitioner",
    "functional-medicine-certification": "Certified FM Practitioner",
    "fm-pro-accelerator": "FM Pro Accelerator",
    "fm-10-client-guarantee": "10-Client Guarantee Mentorship",
    // DFY Products
    "dfy-business-accelerator": "Done-For-You Business Accelerator",
    "dfy-business-kit": "Done-For-You Business Kit",
    // Holistic Nutrition
    "holistic-nutrition-coach-certification": "Certified Holistic Nutrition Coach",
    "hn-pro-accelerator": "HN Pro Accelerator™ - Advanced, Master & Practice Path",
    // Women's Hormone Health
    "womens-hormone-health-coach-certification": "Certified Women's Hormone Health Coach",
    "wh-pro-accelerator": "WH Pro Accelerator™ - Advanced, Master & Practice Path",
    // Gut Health & Microbiome
    "gut-health-microbiome-coach-certification": "Certified Gut Health & Microbiome Coach",
    "gh-pro-accelerator": "GH Pro Accelerator™ - Advanced, Master & Practice Path",
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

// Check if a product is a DFY (Done-For-You) product - used to skip course enrollment
function isDFYProduct(productName: string, productSku: string): boolean {
    const nameLower = productName.toLowerCase();
    const skuLower = productSku.toLowerCase();

    return skuLower.includes("dfy_program") ||
        skuLower.includes("dfy_business") ||
        skuLower.includes("dfy-business") ||
        nameLower.includes("dfy_program") ||
        nameLower.includes("dfy program") ||
        nameLower.includes("done for you") ||
        nameLower.includes("done-for-you") ||
        nameLower.includes("dfy business") ||
        (nameLower.includes("business accelerator") && !nameLower.includes("pro accelerator"));
}

// Determine course slug from product name
function getCourseSlug(productName: string, productSku: string = ""): string {
    const lowerName = productName.toLowerCase();
    const lowerSku = productSku.toLowerCase();

    // === PRIORITY 1: Check DFY products FIRST (before any generic keywords) ===
    // DFY products should NOT enroll in courses, return special slug
    if (isDFYProduct(productName, productSku)) {
        console.log(`[CF Purchase] Product "${productName}" (SKU: ${productSku}) is a DFY product - skipping course enrollment`);
        return "dfy-business-accelerator"; // Special slug that won't match any course
    }

    // === PRIORITY 2: Check longer, more specific patterns first ===
    // This prevents "accelerator" from matching before "done-for-you business accelerator"
    const priorityPatterns = [
        // DFY patterns (backup check)
        ["done-for-you business accelerator", "dfy-business-accelerator"],
        ["done for you business accelerator", "dfy-business-accelerator"],
        ["dfy business accelerator", "dfy-business-accelerator"],
        ["dfy-business-accelerator", "dfy-business-accelerator"],
        // Pro Accelerator patterns (more specific)
        ["fm-pro-accelerator", "fm-pro-accelerator"],
        ["fm pro accelerator", "fm-pro-accelerator"],
        ["hn-pro-accelerator", "hn-pro-accelerator"],
        ["wh-pro-accelerator", "wh-pro-accelerator"],
        ["gh-pro-accelerator", "gh-pro-accelerator"],
    ];

    for (const [pattern, slug] of priorityPatterns) {
        if (lowerName.includes(pattern) || lowerSku.includes(pattern.replace(/-/g, "_"))) {
            console.log(`[CF Purchase] Product "${productName}" matched priority pattern: ${slug}`);
            return slug;
        }
    }

    // === PRIORITY 3: Check standard mappings ===
    for (const [key, slug] of Object.entries(PRODUCT_COURSE_MAP)) {
        if (lowerName.includes(key)) {
            console.log(`[CF Purchase] Product "${productName}" matched to course slug: ${slug}`);
            return slug;
        }
    }

    // Default to the main certification (COMPLETE slug)
    console.log(`[CF Purchase] Product "${productName}" NOT MATCHED - defaulting to functional-medicine-complete-certification`);
    return "functional-medicine-complete-certification";
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
        const productsPrice = firstLineItem.products_price || {}; // NEW
        const originalProduct = firstLineItem.original_product || {};

        // Extract email (CF 2.0 uses email_address)
        const email = contact.email_address || contact.email || data.email_address || data.email || body.email;
        const firstName = contact.first_name || data.first_name || body.first_name || "";
        const lastName = contact.last_name || data.last_name || body.last_name || "";
        const phone = contact.phone_number || data.phone_number || body.phone || "";

        // Extract product info
        // Helper to combine product names
        const allProductNames = lineItems
            .map((item: any) => item.products_variant?.name || item.original_product?.name || item.name)
            .filter((name: any) => name && typeof name === 'string')
            .join(" + ");

        const productSku = productsVariant.sku || productsPrice.sku || originalProduct.sku || "";
        // Use combined name if available, fallback to single logic
        const productName = allProductNames || body.product_name || "FM Mini Diploma";
        const productAmount = parseFloat(firstLineItem.amount || firstLineItem.price || productsVariant.amount || productsPrice.amount || body.amount) || 27;

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

        // Get IP from request headers (fallback if CF doesn't send it)
        const purchaseIp = clientIp ||
            request.headers.get("x-forwarded-for")?.split(",")[0] ||
            request.headers.get("x-real-ip") ||
            request.headers.get("cf-connecting-ip") ||
            null;
        const purchaseUserAgent = userAgent || request.headers.get("user-agent") || null;

        // Use safe select to avoid P2022 errors from missing columns in production DB
        let user = await prisma.user.findUnique({
            where: { email: normalizedEmail },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
            },
        });

        let isNewUser = false;
        let tempPassword: string | null = null;

        if (!user) {
            // Create new user with standard password
            // TEMPORARILY DISABLED fields that may not exist: registrationIp, registrationUserAgent, tosAcceptedAt, tosVersion, refundPolicyAcceptedAt, refundPolicyVersion
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

                    // Evidence & Legal
                    registrationIp: purchaseIp || "0.0.0.0",
                    registrationUserAgent: purchaseUserAgent || "Unknown",
                    registrationDevice: "Unknown", // Can be parsed from UA if needed later
                    registrationBrowser: "Unknown",

                    // Explicit usage of creating a user via Purchase Webhook implies checks passed on CF side
                    tosAcceptedAt: new Date(),
                    tosVersion: "2026-01-web-enroll",
                    refundPolicyAcceptedAt: new Date(),
                    refundPolicyVersion: "2026-01-no-refunds",
                },
            });

            isNewUser = true;
            console.log(`[CF Purchase] ✅ Created new user: ${normalizedEmail} (IP: ${purchaseIp})`);
        } else {
            // Update existing user if needed
            const updates: Record<string, unknown> = {};
            if (!user.firstName && firstName) updates.firstName = firstName;
            if (!user.lastName && lastName) updates.lastName = lastName;
            if (!user.phone && phone) updates.phone = phone;
            // TEMPORARILY DISABLED: These columns may not exist in production DB
            // TODO: Re-enable after running db:push or migration

            if (Object.keys(updates).length > 0) {
                await prisma.user.update({
                    where: { id: user.id },
                    data: updates,
                });
            }
            console.log(`[CF Purchase] Found existing user: ${normalizedEmail}`);
        }

        // =====================================================
        // 2. DETERMINE COURSE AND ENROLL
        // =====================================================

        const courseSlug = getCourseSlug(productName, productSku);

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
        // 3. SEND WELCOME EMAIL (with deduplication via UserTag)
        // =====================================================

        // Check if welcome email already sent using tag (reliable deduplication)
        const alreadySentWelcome = await prisma.userTag.findUnique({
            where: { userId_tag: { userId: user.id, tag: "welcome_email_sent" } },
        });

        if (alreadySentWelcome) {
            console.log(`[CF Purchase] ⏭️ Welcome email already sent to ${normalizedEmail}, skipping`);
        } else {
            try {
                // Verify email with NeverBounce before sending
                console.log(`[CF Purchase] 🔍 Verifying email with NeverBounce: ${normalizedEmail}`);
                const emailVerification = await verifyEmail(normalizedEmail);

                if (!emailVerification.isValid) {
                    console.log(`[CF Purchase] ⏭️ Skipping email to ${normalizedEmail} - NeverBounce result: ${emailVerification.result} (${emailVerification.reason || 'invalid'})`);
                } else {
                    console.log(`[CF Purchase] ✅ Email verified (${emailVerification.result}), sending welcome email to ${normalizedEmail}...`);
                    const emailResult = await sendWelcomeEmail(normalizedEmail, firstName || "Student");
                    if (emailResult.success) {
                        // Mark welcome email as sent
                        await prisma.userTag.create({
                            data: { userId: user.id, tag: "welcome_email_sent", value: new Date().toISOString() },
                        });
                        console.log(`[CF Purchase] ✅ Welcome email sent successfully`);
                    } else {
                        console.error(`[CF Purchase] ❌ Welcome email failed:`, emailResult.error);
                    }
                }
            } catch (emailError) {
                console.error("[CF Purchase] ❌ Exception sending welcome email:", emailError);
            }
        }

        // Also send enrollment confirmation if we enrolled them
        if (enrollmentId && course) {
            try {
                // Use VIP email for Pro Accelerator, standard for others
                if (courseSlug === 'fm-pro-accelerator' || courseSlug === 'hn-pro-accelerator' || courseSlug.includes('pro-accelerator')) {
                    const { sendProAcceleratorEnrollmentEmail } = await import("@/lib/email");
                    // Determine niche from course slug (fm-pro, hn-pro, etc.)
                    const niche = courseSlug.startsWith('hn-') ? 'HN' :
                        courseSlug.startsWith('sb-') ? 'SB' :
                            courseSlug.startsWith('hh-') ? 'HH' : 'FM';
                    await sendProAcceleratorEnrollmentEmail(normalizedEmail, firstName || "Student", niche);
                    console.log(`[CF Purchase] ✅ VIP Pro Accelerator email sent (${niche})`);
                } else {
                    const { sendCourseEnrollmentEmail } = await import("@/lib/email");
                    await sendCourseEnrollmentEmail(normalizedEmail, firstName || "Student", course.title, course.slug);
                    console.log(`[CF Purchase] ✅ Enrollment confirmation email sent`);
                }
            } catch (enrollError) {
                console.error("[CF Purchase] Failed to send enrollment email:", enrollError);
            }
        }

        // =====================================================
        // 4A. SEND AUTOMATED COACH DMS (Sarah intro + Coach follow-up)
        // =====================================================

        try {
            const dmResult = await sendPurchaseDMs({
                userId: user.id,
                firstName: firstName || "there",
                courseSlug: courseSlug,
            });
            if (dmResult) {
                console.log(`[CF Purchase] ✅ Auto-DMs triggered (Sarah now, Coach in 5 min)`);
            } else {
                console.log(`[CF Purchase] ⏭️ Auto-DMs skipped (niche not found or already sent)`);
            }
        } catch (dmError) {
            console.error("[CF Purchase] Failed to send auto-DMs:", dmError);
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
        // 5A. DETECT DFY PURCHASE (DFY_PROGRAM_DS)
        // =====================================================

        const productSkuLower = productSku.toLowerCase();
        const productNameLower = productName.toLowerCase();
        const isDFYPurchase = productSkuLower.includes("dfy_program_ds") ||
            productSkuLower.includes("dfy_business") ||
            productSkuLower.includes("dfy-business") ||
            productNameLower.includes("dfy_program_ds") ||
            productNameLower.includes("dfy program") ||
            productNameLower.includes("done for you") ||
            productNameLower.includes("done-for-you") ||
            productNameLower.includes("dfy business") ||
            (productNameLower.includes("business accelerator") && !productNameLower.includes("pro accelerator"));

        if (isDFYPurchase) {
            console.log(`[CF Purchase] 🎁 DFY PRODUCT DETECTED: ${productName}`);

            try {
                // Find Jessica (DFY specialist)
                const jessica = await prisma.user.findFirst({
                    where: { email: "jessica@accredipro-certificate.com" },
                    select: { id: true },
                });

                // Find or create DFY product record
                let dfyProduct = await prisma.dFYProduct.findFirst({
                    where: { slug: "dfy-program-ds" },
                });

                if (!dfyProduct) {
                    dfyProduct = await prisma.dFYProduct.create({
                        data: {
                            slug: "dfy-program-ds",
                            title: "Done For You Website Package",
                            description: "Complete coaching website setup",
                            price: purchaseValue,
                            productType: "CORE_PROGRAM",
                            category: "functional-medicine",
                            isActive: true,
                        },
                    });
                    console.log(`[CF Purchase] Created DFY Product: ${dfyProduct.id}`);
                }

                // Create DFY purchase record
                const dfyPurchase = await prisma.dFYPurchase.upsert({
                    where: {
                        userId_productId: { userId: user.id, productId: dfyProduct.id },
                    },
                    update: {},
                    create: {
                        userId: user.id,
                        productId: dfyProduct.id,
                        purchasePrice: purchaseValue,
                        status: "COMPLETED",
                        fulfillmentStatus: "PENDING",
                        assignedToId: jessica?.id || null,
                    },
                });

                console.log(`[CF Purchase] ✅ Created DFY Purchase: ${dfyPurchase.id}`);

                // Add dfy_purchased tag
                await prisma.userTag.upsert({
                    where: { userId_tag: { userId: user.id, tag: "dfy_purchased" } },
                    update: {},
                    create: { userId: user.id, tag: "dfy_purchased" },
                });

                // Send DFY welcome email
                try {
                    const { sendDFYWelcomeEmail } = await import("@/lib/email");
                    const intakeUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://learn.accredipro.academy"}/dfy-intake?id=${dfyPurchase.id}`;

                    await sendDFYWelcomeEmail({
                        to: normalizedEmail,
                        firstName: firstName || "there",
                        productName: dfyProduct.title,
                        intakeUrl,
                    });
                    console.log(`[CF Purchase] ✅ DFY welcome email sent`);
                } catch (emailError) {
                    console.error("[CF Purchase] DFY welcome email failed:", emailError);
                }

                // Send welcome DM from Jessica with intake link
                if (jessica) {
                    const intakeUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://learn.accredipro.academy"}/dfy-intake?id=${dfyPurchase.id}`;
                    await prisma.message.create({
                        data: {
                            senderId: jessica.id,
                            receiverId: user.id,
                            content: `Hey ${firstName || "there"}! 👋\n\nI'm Jessica, and I'll be personally handling your Done For You website setup! 🎉\n\nTo get started, I just need you to fill out a quick intake form (about 15 minutes). It helps me understand your coaching, your vibe, and exactly how you want your website to look.\n\n👉 **Start your intake form here:**\n${intakeUrl}\n\nI'll have your website ready within 7 days of receiving your form. Can't wait to build something amazing for you!`,
                            messageType: "DIRECT",
                        },
                    });
                    console.log(`[CF Purchase] ✅ Jessica DM sent for DFY`);
                }

            } catch (dfyError) {
                console.error("[CF Purchase] DFY processing error:", dfyError);
            }
        }

        // =====================================================
        // 6. TRIGGER SARAH'S WELCOME DM (NEW USERS ONLY)
        // =====================================================

        if (isNewUser) {
            try {
                // Sarah's welcome DM with voice note (2-3 min delay built-in)
                await triggerAutoMessage({
                    userId: user.id,
                    trigger: "first_login"
                });
                console.log(`[CF Purchase] ✅ Sarah welcome DM scheduled for new user`);
            } catch (dmError) {
                console.error("[CF Purchase] Failed to trigger welcome DM:", dmError);
            }
        }

        // =====================================================
        // 7. CREATE PAYMENT RECORD (for dispute evidence & revenue)
        // =====================================================

        let paymentId: string | null = null;
        try {
            const course = await prisma.course.findFirst({ where: { slug: courseSlug } });

            // Use CF Order ID if available, otherwise create deterministic ID from email+product+amount+date
            // This prevents duplicate payments if the webhook fires multiple times
            const cfOrderId = data.id || data.order_id;
            let transactionId: string;

            if (cfOrderId) {
                transactionId = `cf_${cfOrderId}`;
            } else {
                // Create deterministic ID based on email + product + amount + today's date
                // This ensures retries on same day for same product don't create duplicates
                const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
                const hash = crypto.createHash('sha256')
                    .update(`${normalizedEmail}-${courseSlug}-${purchaseValue}-${today}`)
                    .digest('hex')
                    .substring(0, 16);
                transactionId = `cf_${hash}`;
            }

            // Detect payment type: FRONTEND (main purchase) vs OTO (upsell)
            // OTOs typically have: "accelerator", "pro", "guarantee", "upgrade", "special offer" in name
            // Or higher prices than the base certification
            const productNameLower = productName.toLowerCase();
            let paymentType: 'FRONTEND' | 'OTO' | 'BUMP' = 'FRONTEND';

            if (
                productNameLower.includes('accelerator') ||
                productNameLower.includes('guarantee') ||
                productNameLower.includes('special offer') ||
                productNameLower.includes('upgrade') ||
                productNameLower.includes('one-for-you') ||
                productNameLower.includes('done-for-you') ||
                productNameLower.includes('dfy') ||
                productNameLower.includes('oto') ||
                purchaseValue >= 297 // Base cert is $97-164, OTOs are $297+
            ) {
                paymentType = 'OTO';
            }

            // Bumps are usually small add-ons with specific keywords
            if (
                productNameLower.includes('bump') ||
                productNameLower.includes('order bump') ||
                (purchaseValue <= 47 && productNameLower.includes('bonus'))
            ) {
                paymentType = 'BUMP';
            }

            // Check for existing payment with this transaction ID
            const existingPayment = await prisma.payment.findUnique({
                where: { transactionId },
            });

            if (existingPayment) {
                paymentId = existingPayment.id;
                console.log(`[CF Purchase] ⏭️ Payment already exists: ${paymentId} (TxID: ${transactionId})`);
            } else {
                // Create new payment record
                const payment = await prisma.payment.create({
                    data: {
                        userId: user.id,
                        amount: purchaseValue,
                        currency: "USD",
                        transactionId,
                        paymentMethod: "clickfunnels",
                        paymentType, // FRONTEND, OTO, or BUMP
                        productName: contentName,
                        productSku: courseSlug,
                        courseId: course?.id,
                        ipAddress: purchaseIp,
                        userAgent: purchaseUserAgent,
                        billingEmail: normalizedEmail,
                        billingName: `${firstName || ""} ${lastName || ""}`.trim() || undefined,
                        status: "COMPLETED",
                    },
                });
                paymentId = payment.id;
                console.log(`[CF Purchase] ✅ Created Payment: $${purchaseValue} (${paymentType}) - ${payment.id} (TxID: ${transactionId})`);
            }
        } catch (paymentError) {
            console.error("[CF Purchase] Failed to create Payment record:", paymentError);
        }


        // =====================================================
        // 8. LOG WEBHOOK EVENT (Upsert or Create new only if distinct)
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
