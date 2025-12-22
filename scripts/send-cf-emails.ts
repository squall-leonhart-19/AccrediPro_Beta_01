import prisma from '../src/lib/prisma';

async function main() {
    console.log('\n=== SENDING WELCOME EMAILS VIA WEBHOOK ===\n');

    // Get all CF users
    const cfUsers = await prisma.user.findMany({
        where: {
            OR: [
                { leadSource: { contains: 'ClickFunnels' } },
                { leadSourceDetail: { contains: 'ClickFunnels' } }
            ]
        },
        select: {
            email: true,
            firstName: true,
            lastName: true
        }
    });

    console.log(`Found ${cfUsers.length} CF users\n`);

    // Print curl commands for each user
    for (const user of cfUsers) {
        if (!user.email) continue;

        const payload = {
            data: {
                contact: {
                    email_address: user.email,
                    first_name: user.firstName || 'Student',
                    last_name: user.lastName || ''
                },
                line_items: [{
                    name: 'Functional Medicine Certification Practitioner',
                    amount: '97'
                }]
            }
        };

        console.log(`curl -X POST https://learn.accredipro.academy/api/webhooks/clickfunnels-purchase -H "Content-Type: application/json" -d '${JSON.stringify(payload)}'`);
        console.log('');
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
