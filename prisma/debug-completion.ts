import prisma from "../src/lib/prisma";

async function main() {
    const userEmail = "tortolialessio1997@gmail.com";

    // Check user status
    const user = await prisma.user.findUnique({
        where: { email: userEmail },
        select: {
            id: true,
            email: true,
            firstName: true,
            miniDiplomaCategory: true,
            miniDiplomaCompletedAt: true,
            graduateOfferDeadline: true,
            hasCertificateBadge: true,
        },
    });

    console.log("\n📊 User Status:");
    console.log(user);

    if (!user) {
        console.log("❌ User not found!");
        return;
    }

    // Check for Sarah coach
    const sarah = await prisma.user.findFirst({
        where: {
            email: { contains: "sarah", mode: "insensitive" },
            role: { in: ["ADMIN", "INSTRUCTOR", "MENTOR"] },
        },
        select: { id: true, email: true, firstName: true, role: true },
    });

    console.log("\n👩‍🏫 Sarah Coach:");
    console.log(sarah);

    // Check messages from Sarah to this user
    if (sarah) {
        const messages = await prisma.message.findMany({
            where: {
                senderId: sarah.id,
                receiverId: user.id,
            },
            orderBy: { createdAt: "desc" },
            take: 5,
        });

        console.log("\n✉️ Messages from Sarah to user:");
        console.log(messages.map(m => ({
            id: m.id,
            type: m.type,
            content: m.content.substring(0, 100) + "...",
            createdAt: m.createdAt,
        })));
    }

    // Check notifications for user
    const notifications = await prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        take: 5,
    });

    console.log("\n🔔 Recent Notifications:");
    console.log(notifications.map(n => ({
        title: n.title,
        type: n.type,
        createdAt: n.createdAt,
    })));
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
