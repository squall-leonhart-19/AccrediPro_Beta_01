
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkUserActivity() {
    const email = 'nurselife19@yahoo.com';
    console.log(`Checking activity for: ${email}`);

    const user = await prisma.user.findUnique({
        where: { email },
        include: {
            loginHistory: {
                orderBy: { createdAt: 'desc' },
                take: 5
            },
            enrollments: true,
        }
    });

    if (!user) {
        console.log('User not found!');
        return;
    }

    console.log('User Record:');
    console.log(`- ID: ${user.id}`);
    console.log(`- CreatedAt: ${user.createdAt}`);
    console.log(`- LastLoginAt: ${user.lastLoginAt}`);
    console.log(`- RegistrationIP: ${user.registrationIp}`);
    console.log(`- TOS Accepted: ${user.tosAcceptedAt}`);

    console.log('\nLogin History:');
    if (user.loginHistory.length === 0) {
        console.log('- No login history records found.');
    } else {
        user.loginHistory.forEach(log => {
            console.log(`- ${log.createdAt}: IP=${log.ipAddress}, Device=${log.device}`);
        });
    }

    console.log('\nEnrollments:');
    console.log(user.enrollments.length > 0 ? user.enrollments : 'No enrollments found.');
}

checkUserActivity()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
