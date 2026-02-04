import prisma from "../src/lib/prisma";
import { getPreCompletionMessage } from "../src/data/masterclass-pre-completion";

async function test() {
    try {
        // Get a test user
        const user = await prisma.user.findFirst({
            where: { email: { contains: "@" } },
            orderBy: { createdAt: "desc" },
        });
        console.log("Test user:", user?.id, user?.email, user?.firstName);

        if (!user) {
            console.log("ERROR: No users found!");
            return;
        }

        // Delete existing pod for this user
        await prisma.masterclassMessage.deleteMany({ where: { pod: { userId: user.id } } });
        await prisma.masterclassDayProgress.deleteMany({ where: { pod: { userId: user.id } } });
        await prisma.masterclassPod.deleteMany({ where: { userId: user.id } });
        console.log("Deleted existing pod for user");

        // Get zombie
        const zombie = await prisma.zombieProfile.findFirst({
            where: { isActive: true, tier: 1 },
        });
        console.log("Zombie:", zombie?.id, zombie?.name);

        if (!zombie) {
            console.log("ERROR: No zombie found!");
            return;
        }

        // Test getPreCompletionMessage
        console.log("\nTesting pre-completion message import...");
        const welcomeMsg = getPreCompletionMessage("optin");
        console.log("Welcome message found:", !!welcomeMsg);
        console.log("Sarah message starts with:", welcomeMsg?.sarah?.substring(0, 50) + "...");
        console.log("Zombie messages count:", welcomeMsg?.zombies?.length);

        const now = new Date();
        const firstName = user.firstName || "friend";

        // Create pod
        console.log("\nCreating pod...");
        const pod = await prisma.masterclassPod.create({
            data: {
                userId: user.id,
                zombieProfileId: zombie.id,
                nicheCategory: "functional-medicine",
                examScore: 0,
                examPassedAt: now,
                status: "pre_completion",
                masterclassDay: 0,
                startedAt: now,
            },
        });
        console.log("✅ Pod created:", pod.id);

        // Create welcome messages
        if (welcomeMsg) {
            // Sarah's welcome message
            const sarahTime = new Date(now.getTime() - 2 * 60 * 60 * 1000);
            await prisma.masterclassMessage.create({
                data: {
                    podId: pod.id,
                    dayNumber: 0,
                    senderType: "sarah",
                    senderName: "Sarah Mitchell",
                    senderAvatar: "/coaches/sarah-coach.webp",
                    content: welcomeMsg.sarah.replace(/{firstName}/g, firstName),
                    scheduledFor: sarahTime,
                    sentAt: sarahTime,
                },
            });
            console.log("✅ Sarah message created");

            // Zombie messages
            for (const zg of welcomeMsg.zombies) {
                const content = zg.options[0].replace(/{firstName}/g, firstName);
                const zombieTime = new Date(now.getTime() - 1 * 60 * 60 * 1000);
                await prisma.masterclassMessage.create({
                    data: {
                        podId: pod.id,
                        dayNumber: 0,
                        senderType: "zombie",
                        senderName: zombie.name,
                        senderAvatar: zombie.avatar,
                        content,
                        scheduledFor: zombieTime,
                        sentAt: zombieTime,
                    },
                });
                console.log("✅ Zombie message created");
            }
        }

        // Verify messages
        const messages = await prisma.masterclassMessage.count({ where: { podId: pod.id } });
        console.log("\n✅ Total messages created:", messages);
        console.log("\n🎉 SUCCESS! Pod creation works correctly.");

    } catch (e) {
        console.log("\n❌ ERROR:", e);
    } finally {
        await prisma.$disconnect();
    }
}

test();
