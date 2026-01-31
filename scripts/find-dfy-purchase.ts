import prisma from '../src/lib/prisma';

async function main() {
    // Find payments containing DFY or Business Accelerator
    const payments = await prisma.payment.findMany({
        where: {
            OR: [
                { productName: { contains: 'Done', mode: 'insensitive' } },
                { productName: { contains: 'Business Accelerator', mode: 'insensitive' } },
                { productName: { contains: 'DFY', mode: 'insensitive' } },
            ]
        },
        include: {
            user: { select: { id: true, email: true, firstName: true, lastName: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
    });

    console.log('DFY/Business Accelerator Payments:');
    payments.forEach(p => {
        console.log(`- ${p.user?.email} | ${p.productName} | $${p.amount} | ${p.createdAt}`);
        console.log(`  User ID: ${p.user?.id}`);
    });

    // Check existing DFY purchases
    const dfyPurchases = await prisma.dFYPurchase.count();
    console.log(`\nExisting DFYPurchase records: ${dfyPurchases}`);

    // Get DFY products
    const dfyProducts = await prisma.dFYProduct.findMany();
    console.log('\nDFY Products:', dfyProducts.map(p => `${p.slug} (${p.id})`));
}

main().catch(console.error).finally(() => prisma.$disconnect());
