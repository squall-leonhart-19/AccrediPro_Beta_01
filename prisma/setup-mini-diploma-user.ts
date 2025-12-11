import prisma from "../src/lib/prisma";

async function main() {
    const targetEmail = "at.seed019@gmail.com";

    const user = await prisma.user.findUnique({
        where: { email: targetEmail },
    });

    if (user) {
        await prisma.user.update({
            where: { id: user.id },
            data: {
                miniDiplomaCategory: "functional-medicine",
                miniDiplomaOptinAt: new Date(),
                miniDiplomaCompletedAt: null,
                graduateOfferDeadline: null,
                hasCertificateBadge: false,
                hasCompletedOnboarding: true,
                hasCompletedProfile: true,
            },
        });
        console.log(`✅ Added mini diploma to ${targetEmail}`);
        console.log(`   - Category: functional-medicine`);
        console.log(`   - Onboarding: complete`);
        console.log(`   - Now go to /my-mini-diploma and test!`);
    } else {
        console.log(`❌ User ${targetEmail} not found`);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
