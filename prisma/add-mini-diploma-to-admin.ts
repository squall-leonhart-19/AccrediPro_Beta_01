import prisma from "../src/lib/prisma";

async function main() {
    // Find admin user
    const admin = await prisma.user.findFirst({
        where: { role: "ADMIN" },
        select: { id: true, email: true, firstName: true },
    });

    if (!admin) {
        console.log("No admin user found!");
        return;
    }

    console.log("Found admin:", admin.email);

    // Update with mini diploma
    const now = new Date();
    const deadline = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    await prisma.user.update({
        where: { id: admin.id },
        data: {
            miniDiplomaCategory: "functional-medicine",
            miniDiplomaOptinAt: now,
            miniDiplomaUpgradeDeadline: deadline,
        },
    });

    console.log("✅ Updated admin with mini diploma: functional-medicine");
    console.log("   Upgrade deadline:", deadline.toISOString());
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
