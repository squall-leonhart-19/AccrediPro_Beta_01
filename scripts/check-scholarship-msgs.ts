import { prisma } from "../src/lib/prisma";

async function main() {
  const msgs = await prisma.salesChat.findMany({
    where: { page: { contains: "scholarship" } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  console.log("=== SCHOLARSHIP MESSAGES ===");
  for (const m of msgs) {
    const type = m.isFromVisitor ? "VISITOR" : "ADMIN  ";
    console.log(type, "|", m.visitorId.slice(0, 15), "|", m.message.slice(0, 40));
  }

  const adminMsgs = msgs.filter(m => m.isFromVisitor === false);
  console.log("\n--- Total:", msgs.length);
  console.log("--- Admin messages:", adminMsgs.length);
  console.log("--- Visitor messages:", msgs.length - adminMsgs.length);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
