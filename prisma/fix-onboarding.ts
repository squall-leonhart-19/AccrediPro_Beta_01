import prisma from "../src/lib/prisma";

async function main() {
    await prisma.user.update({
        where: { email: "tortolialessio1997@gmail.com" },
        data: {
            hasCompletedOnboarding: true,
            hasCompletedProfile: true,
        },
    });
    console.log("✅ Fixed: Onboarding marked as complete for tortolialessio1997@gmail.com");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
