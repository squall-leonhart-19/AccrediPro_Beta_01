import prisma from "../src/lib/prisma";

async function main() {
    const zombies = await prisma.user.findMany({
        where: { isFakeProfile: true },
        select: {
            firstName: true,
            lastName: true,
            bio: true,
            specialties: true,
            professionalTitle: true,
            location: true
        },
        take: 10
    });
    console.log(JSON.stringify(zombies, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
