import prisma from '../src/lib/prisma';

async function main() {
    // User IDs of DFY Business Accelerator purchasers (from the payment scan)
    const dfyUserIds = [
        'cml1u9ewt000a04ib4te3mnjm', // ndobulmirabel@yahoo.com
        'cml1dd5bd000604jmb48is532', // lindsaylewis927@icloud.com (2 payments, same user)
        'cml07qkcx009l04l87kyq8j5i', // jthomas.rn@live.com
        'cml01l1r4004m04kygswb6jf7', // xanmonique@gmail.com
        'cmkzm4313002c04li2v1gcs8l', // nonahk@yahoo.com
        'cmkzm849y002p04li64ecvotg', // kidmin1977@gmail.com
        'cmkzlp3b3002904l7wxgg0g6k', // nurseangela007@gmail.com
        'cmkzkjroq001904liyfigzs1d', // evelynmjones@sbcglobal.net
        'cmkzkbjf200gw04ibcrq5epj9', // devineimage4u@gmail.com
    ];

    // Find or create DFY Business Accelerator product
    let dfyProduct = await prisma.dFYProduct.findFirst({
        where: { slug: 'dfy-business-accelerator' }
    });

    if (!dfyProduct) {
        dfyProduct = await prisma.dFYProduct.create({
            data: {
                slug: 'dfy-business-accelerator',
                title: 'Done-For-You Business Accelerator',
                description: 'Complete coaching business setup with website, branding, and marketing materials',
                price: 397,
                productType: 'CORE_PROGRAM',
                category: 'functional-medicine',
                isActive: true,
            }
        });
        console.log(`✅ Created DFY Product: ${dfyProduct.id}`);
    } else {
        console.log(`Found existing DFY Product: ${dfyProduct.id}`);
    }

    // Find Jessica (DFY fulfillment specialist)
    const jessica = await prisma.user.findFirst({
        where: { email: 'jessica@accredipro-certificate.com' },
        select: { id: true }
    });

    console.log(`\nAssigning to Jessica: ${jessica?.id || 'NOT FOUND'}\n`);

    // Create DFYPurchase records for each user
    let created = 0;
    let skipped = 0;

    for (const userId of dfyUserIds) {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, email: true, firstName: true }
        });

        if (!user) {
            console.log(`❌ User not found: ${userId}`);
            continue;
        }

        // Check if already exists
        const existing = await prisma.dFYPurchase.findFirst({
            where: { userId: user.id, productId: dfyProduct.id }
        });

        if (existing) {
            console.log(`⏭️ Already exists for ${user.email}`);
            skipped++;
            continue;
        }

        // Create DFYPurchase
        const purchase = await prisma.dFYPurchase.create({
            data: {
                userId: user.id,
                productId: dfyProduct.id,
                purchasePrice: 397,
                status: 'COMPLETED',
                fulfillmentStatus: 'PENDING',
                assignedToId: jessica?.id || null,
            }
        });

        // Add dfy_purchased tag
        await prisma.userTag.upsert({
            where: { userId_tag: { userId: user.id, tag: 'dfy_purchased' } },
            update: {},
            create: { userId: user.id, tag: 'dfy_purchased' }
        });

        // Remove wrong tag if present
        await prisma.userTag.deleteMany({
            where: {
                userId: user.id,
                tag: { in: ['fm_pro_advanced_clinical_purchased', 'fm-pro-advanced-clinical'] }
            }
        });

        console.log(`✅ Created DFYPurchase for ${user.email} (${purchase.id})`);
        created++;
    }

    console.log(`\n========================================`);
    console.log(`Created: ${created} | Skipped: ${skipped}`);
    console.log(`========================================`);

    // Verify
    const total = await prisma.dFYPurchase.count();
    console.log(`\nTotal DFYPurchase records now: ${total}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
