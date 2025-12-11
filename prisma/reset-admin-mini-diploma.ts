import prisma from "../src/lib/prisma";

async function main() {
    // Reset admin for testing mini diploma flow
    const admin = await prisma.user.findFirst({
        where: { role: "ADMIN" },
    });

    if (!admin) {
        console.log("No admin found!");
        return;
    }

    // Reset completion so they can test the full flow
    await prisma.user.update({
        where: { id: admin.id },
        data: {
            miniDiplomaCategory: "functional-medicine",
            miniDiplomaOptinAt: new Date(),
            miniDiplomaCompletedAt: null, // Reset completion
            graduateOfferDeadline: null,
            hasCertificateBadge: false,
        },
    });

    console.log("✅ Reset admin for mini diploma testing");
    console.log("   - Category: functional-medicine");
    console.log("   - Completion: reset (not completed)");
    console.log("   - Go to /my-mini-diploma to test!");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
