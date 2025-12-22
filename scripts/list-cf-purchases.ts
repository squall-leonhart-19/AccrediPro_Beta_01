import prisma from '../src/lib/prisma';

async function main() {
    // Get all users with purchase tags
    const cfUsers = await prisma.userTag.findMany({
        where: { tag: { contains: 'purchased' } },
        include: {
            user: {
                select: {
                    email: true,
                    firstName: true,
                    lastName: true,
                    createdAt: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    });

    console.log('\n=== CLICKFUNNELS PURCHASES ===\n');

    const grouped: Record<string, { name: string; tags: string[]; date: Date }> = {};

    cfUsers.forEach(ut => {
        const email = ut.user.email;
        if (!grouped[email]) {
            grouped[email] = {
                name: `${ut.user.firstName || ''} ${ut.user.lastName || ''}`.trim() || 'Unknown',
                tags: [],
                date: ut.user.createdAt
            };
        }
        grouped[email].tags.push(ut.tag);
    });

    // Print each user
    Object.entries(grouped).forEach(([email, info]) => {
        console.log(`📧 ${email} (${info.name})`);
        info.tags.forEach(t => console.log(`   └─ ${t}`));
        console.log('');
    });

    console.log(`📊 Total unique purchasers: ${Object.keys(grouped).length}`);
    console.log(`📊 Total purchase tags: ${cfUsers.length}\n`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
