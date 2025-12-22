
import { prisma } from "../src/lib/prisma";

async function main() {
    try {
        console.log("Fetching messages...");
        const messages = await prisma.salesChat.findMany({
            orderBy: { createdAt: "desc" },
            take: 500,
        });
        console.log(`Found ${messages.length} messages.`);

        console.log("Fetching optins...");
        const optins = await prisma.chatOptin.findMany();
        console.log(`Found ${optins.length} optins.`);

        const optinMap = new Map(optins.map((o) => [o.visitorId, o]));

        const conversationsMap = new Map();

        messages.forEach((msg) => {
            const optin = optinMap.get(msg.visitorId);

            if (!conversationsMap.has(msg.visitorId)) {
                conversationsMap.set(msg.visitorId, {
                    visitorId: msg.visitorId,
                    visitorName: optin?.name || msg.visitorName,
                    visitorEmail: optin?.email || msg.visitorEmail,
                    page: msg.page,
                    messages: [],
                    lastMessage: msg.message,
                    lastMessageAt: msg.createdAt,
                    unreadCount: 0,
                });
            }

            const conv = conversationsMap.get(msg.visitorId);
            conv.messages.push(msg);

            if (msg.isFromVisitor && !msg.isRead) {
                conv.unreadCount++;
            }
        });

        console.log(`Grouped into ${conversationsMap.size} conversations.`);

        // Test serialization
        const conversations = Array.from(conversationsMap.values());
        const json = JSON.stringify({ conversations });
        console.log("✅ Serialization successful. Payload size:", json.length);

    } catch (e: any) {
        console.error("❌ Error:", e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
