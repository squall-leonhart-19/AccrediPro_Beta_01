import prisma from '../src/lib/prisma';

async function insertTestBounces() {
    try {
        // Get first user with email
        const user = await prisma.user.findFirst({
            where: { email: { not: null } },
            select: { id: true, email: true, firstName: true }
        });

        console.log('Found user:', user);

        if (!user) {
            console.log('No users found');
            return;
        }

        // Check if EmailBounce table exists
        try {
            const count = await prisma.emailBounce.count();
            console.log('EmailBounce table exists, current count:', count);
        } catch (e) {
            console.log('EmailBounce table may not exist. You need to run: npx prisma migrate deploy');
            console.log('Error:', (e as Error).message);
            return;
        }

        // Insert test records
        const testBounces = [
            {
                userId: user.id,
                originalEmail: 'test.buyer@gamil.com',
                bounceType: 'hard',
                bounceCount: 1,
                bounceReason: 'Mailbox does not exist - The email address test.buyer@gamil.com does not exist on the server',
                suggestedEmail: 'test.buyer@gmail.com',
                suggestionSource: 'rules',
                suggestionConfidence: 0.99,
                status: 'pending'
            },
            {
                userId: user.id,
                originalEmail: 'sarah.wellness@yaho.com',
                bounceType: 'hard',
                bounceCount: 2,
                bounceReason: 'DNS lookup failed - Domain yaho.com not found',
                suggestedEmail: 'sarah.wellness@yahoo.com',
                suggestionSource: 'rules',
                suggestionConfidence: 0.99,
                status: 'pending'
            },
            {
                userId: user.id,
                originalEmail: 'maria@outlok.com',
                bounceType: 'hard',
                bounceCount: 1,
                bounceReason: '550 5.1.1 User unknown',
                suggestedEmail: 'maria@outlook.com',
                suggestionSource: 'ai',
                suggestionConfidence: 0.95,
                neverBounceResult: 'valid',
                status: 'pending'
            },
            {
                userId: user.id,
                originalEmail: 'random@weirdxyz123.net',
                bounceType: 'hard',
                bounceCount: 1,
                bounceReason: 'Host not reachable',
                suggestedEmail: null,
                suggestionSource: null,
                suggestionConfidence: null,
                status: 'no_suggestion'
            }
        ];

        for (const bounce of testBounces) {
            try {
                await prisma.emailBounce.upsert({
                    where: {
                        userId_originalEmail: {
                            userId: bounce.userId,
                            originalEmail: bounce.originalEmail
                        }
                    },
                    create: bounce,
                    update: bounce
                });
                console.log(`✓ Created: ${bounce.originalEmail} → ${bounce.suggestedEmail || 'no suggestion'}`);
            } catch (e) {
                console.log(`✗ Failed: ${bounce.originalEmail}`, (e as Error).message);
            }
        }

        // Show final count
        const finalCount = await prisma.emailBounce.count();
        console.log(`\n✅ Done! Total bounce records: ${finalCount}`);
        console.log('Refresh /admin/email-issues to see the test data!');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

insertTestBounces();
