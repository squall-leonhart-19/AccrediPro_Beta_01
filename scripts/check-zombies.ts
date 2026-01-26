import prisma from "../src/lib/prisma";

async function main() {
  // Get distribution of last names
  const lastNames = await prisma.user.groupBy({
    by: ['lastName'],
    where: { isFakeProfile: true },
    _count: true,
    orderBy: { _count: { lastName: 'desc' } }
  });
  
  console.log("Last name distribution (top 20):");
  lastNames.slice(0, 20).forEach(ln => {
    console.log(`  ${ln.lastName}: ${ln._count}`);
  });
  console.log(`Total unique last names: ${lastNames.length}`);
}
main().finally(() => prisma.$disconnect());
