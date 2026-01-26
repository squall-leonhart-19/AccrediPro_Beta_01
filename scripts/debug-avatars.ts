import prisma from "../src/lib/prisma";

async function main() {
  // Check Leah Daniels specifically
  const leah = await prisma.user.findFirst({
    where: { firstName: "Leah", lastName: "Daniels" },
    select: { id: true, firstName: true, lastName: true, avatar: true, isFakeProfile: true }
  });
  console.log("Leah Daniels:", leah);

  // Check Sarah coach
  const sarah = await prisma.user.findFirst({
    where: { email: "sarah@accredipro-certificate.com" }
  });
  console.log("\nSarah (correct email):", sarah ? {
    id: sarah.id,
    email: sarah.email,
    firstName: sarah.firstName,
    lastName: sarah.lastName,
    role: sarah.role,
    avatar: sarah.avatar?.substring(0, 50) + "..."
  } : "NOT FOUND");

  // Check all Sarahs
  const allSarahs = await prisma.user.findMany({
    where: { firstName: "Sarah" },
    select: { id: true, email: true, firstName: true, lastName: true, role: true }
  });
  console.log("\nAll users named Sarah:", allSarahs);

  // Check recent wins post author avatar
  const recentPost = await prisma.communityPost.findFirst({
    where: { title: { contains: "$4200" } },
    include: {
      author: { select: { id: true, firstName: true, lastName: true, avatar: true } },
      comments: {
        include: { author: { select: { id: true, firstName: true, lastName: true, email: true, role: true } } },
        take: 2
      }
    }
  });
  console.log("\nRecent post author avatar:", recentPost?.author.avatar?.substring(0, 80));
  console.log("Comments authors:", recentPost?.comments.map(c => ({
    name: c.author.firstName + " " + c.author.lastName,
    email: c.author.email,
    role: c.author.role
  })));
}
main().finally(() => prisma.$disconnect());
