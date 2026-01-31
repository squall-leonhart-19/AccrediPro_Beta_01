import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function fixJessicaOrder() {
    const userEmail = "jferdinando@yahoo.com";
    console.log(`🔧 Fixing DFY order for ${userEmail}...\n`);

    // Find the user
    const user = await prisma.user.findUnique({
        where: { email: userEmail },
        select: { id: true, firstName: true, lastName: true },
    });

    if (!user) {
        console.log("❌ User not found");
        return;
    }

    console.log(`Found user: ${user.firstName} ${user.lastName} (${user.id})`);

    // 1. Remove wrong tags
    const wrongTags = [
        "fm_pro_advanced_clinical_purchased",
        "fm_pro_master_depth_purchased",
        "fm_pro_practice_path_purchased",
    ];

    for (const tag of wrongTags) {
        try {
            await prisma.userTag.delete({
                where: { userId_tag: { userId: user.id, tag } },
            });
            console.log(`   ❌ Removed wrong tag: ${tag}`);
        } catch {
            console.log(`   ⏭️ Tag not found: ${tag}`);
        }
    }

    // 2. Add correct DFY tag
    await prisma.userTag.upsert({
        where: { userId_tag: { userId: user.id, tag: "dfy_purchased" } },
        update: {},
        create: { userId: user.id, tag: "dfy_purchased" },
    });
    console.log(`   ✅ Added correct tag: dfy_purchased`);

    await prisma.userTag.upsert({
        where: { userId_tag: { userId: user.id, tag: "dfy_business_accelerator_purchased" } },
        update: {},
        create: { userId: user.id, tag: "dfy_business_accelerator_purchased" },
    });
    console.log(`   ✅ Added correct tag: dfy_business_accelerator_purchased`);

    // 3. Remove wrong enrollments (fm-pro courses she shouldn't have)
    const wrongSlugs = [
        "fm-pro-advanced-clinical",
        "fm-pro-master-depth",
        "fm-pro-practice-path",
    ];

    for (const slug of wrongSlugs) {
        const enrollment = await prisma.enrollment.findFirst({
            where: {
                userId: user.id,
                course: { slug },
            },
        });

        if (enrollment) {
            await prisma.enrollment.delete({
                where: { id: enrollment.id },
            });
            console.log(`   ❌ Removed wrong enrollment: ${slug}`);
        }
    }

    // 4. Create DFY purchase record
    // Find Jessica (DFY specialist)
    let jessica = await prisma.user.findFirst({
        where: { email: "jessica@accredipro-certificate.com" },
        select: { id: true },
    });

    // Find or create DFY product (use correct schema fields)
    let dfyProduct = await prisma.dFYProduct.findFirst({
        where: { slug: "dfy-business-accelerator" },
    });

    if (!dfyProduct) {
        dfyProduct = await prisma.dFYProduct.create({
            data: {
                slug: "dfy-business-accelerator",
                title: "Done For You Business Accelerator",
                description: "Complete coaching business website setup with premium branding, funnel pages, and marketing materials.",
                price: 397,
                productType: "CORE_PROGRAM",
                category: "functional-medicine",
                isActive: true,
            },
        });
        console.log(`   ✅ Created DFY Product: ${dfyProduct.id}`);
    }

    // Create DFY purchase
    const existingPurchase = await prisma.dFYPurchase.findFirst({
        where: { userId: user.id, productId: dfyProduct.id },
    });

    if (!existingPurchase) {
        const dfyPurchase = await prisma.dFYPurchase.create({
            data: {
                userId: user.id,
                productId: dfyProduct.id,
                purchasePrice: 397,
                status: "COMPLETED",
                fulfillmentStatus: "PENDING",
                assignedToId: jessica?.id || null,
            },
        });
        console.log(`   ✅ Created DFY Purchase: ${dfyPurchase.id}`);
    } else {
        console.log(`   ⏭️ DFY Purchase already exists: ${existingPurchase.id}`);
    }

    console.log("\n🎉 DONE! Jessica Diamond's order is now fixed.");
    console.log("   - Wrong tags removed");
    console.log("   - Correct DFY tags added");
    console.log("   - Wrong enrollments removed");
    console.log("   - DFY purchase record created");
}

fixJessicaOrder()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
