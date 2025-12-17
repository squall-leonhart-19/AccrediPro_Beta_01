import prisma from "../src/lib/prisma";

async function main() {
  const sequences = await prisma.sequence.findMany({
    select: { id: true, name: true, slug: true, isActive: true, triggerType: true },
    orderBy: { createdAt: "desc" },
    take: 10
  });
  console.log("All Sequences:");
  sequences.forEach(s => console.log(`- ${s.name} (slug: ${s.slug}, active: ${s.isActive})`));

  // Also check for nurture specifically
  const nurture = await prisma.sequence.findFirst({
    where: {
      OR: [
        { slug: "nurture-30-day" },
        { name: { contains: "nurture", mode: "insensitive" } },
        { slug: { contains: "nurture", mode: "insensitive" } },
      ]
    },
    include: { emails: { where: { isActive: true }, take: 3 } }
  });
  console.log("");
  console.log("Nurture sequence found:", nurture ? nurture.name : "NONE");
  if (nurture) {
    console.log("Has active emails:", nurture.emails.length);
    console.log("Is active:", nurture.isActive);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
