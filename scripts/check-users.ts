
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const count = await prisma.user.count();
    console.log(`Total users: ${count}`);

    const sample = await prisma.user.findMany({
        take: 5,
        select: {
            id: true,
            name: true,
            email: true,
            image: true
        }
    });

    console.log('Sample users:', JSON.stringify(sample, null, 2));
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
