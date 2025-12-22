import prisma from '../src/lib/prisma';

async function main() {
    // Get all users with CF in their leadSource or leadSourceDetail
    const cfUsers = await prisma.user.findMany({
        where: {
            OR: [
                { leadSource: { contains: 'ClickFunnels' } },
                { leadSourceDetail: { contains: 'ClickFunnels' } }
            ]
        },
        include: {
            enrollments: true,
            tags: true
        },
        orderBy: { createdAt: 'desc' }
    });

    console.log('\n=== ALL CLICKFUNNELS USERS ===\n');
    console.log('Total CF users:', cfUsers.length);

    const notEnrolled = cfUsers.filter(u => u.enrollments.length === 0);
    const noTags = cfUsers.filter(u => !u.tags.some(t => t.tag.includes('purchased')));

    console.log('Not enrolled:', notEnrolled.length);
    console.log('No purchase tags:', noTags.length);

    // Group by lead source detail
    const bySource: Record<string, number> = {};
    cfUsers.forEach(u => {
        const src = u.leadSourceDetail || u.leadSource || 'unknown';
        bySource[src] = (bySource[src] || 0) + 1;
    });

    console.log('\n=== BY SOURCE ===\n');
    Object.entries(bySource).sort((a, b) => b[1] - a[1]).forEach(([src, count]) => {
        console.log(`${count}x ${src}`);
    });

    // List users not enrolled
    console.log('\n=== USERS NOT ENROLLED (NEED FIX) ===\n');
    notEnrolled.slice(0, 50).forEach(u => {
        console.log(`${u.email} | ${u.firstName || ''} ${u.lastName || ''} | ${u.leadSourceDetail || u.leadSource}`);
    });

    if (notEnrolled.length > 50) {
        console.log(`... and ${notEnrolled.length - 50} more`);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
