import prisma from "../src/lib/prisma";

async function main() {
  // Check recent wins posts
  const posts = await prisma.communityPost.findMany({
    where: { categoryId: "wins" },
    include: {
      author: { select: { id: true, firstName: true, lastName: true, avatar: true, isFakeProfile: true } },
      comments: {
        include: { author: { select: { firstName: true, lastName: true, avatar: true } } },
        take: 3
      }
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  console.log("Recent Wins Posts:\n");
  for (const post of posts) {
    console.log("Post:", post.title.substring(0, 50));
    console.log("Author:", post.author.firstName, post.author.lastName);
    const avatarType = post.author.avatar
      ? (post.author.avatar.startsWith("data:") ? "BASE64"
         : post.author.avatar.includes("r2.dev") ? "R2"
         : post.author.avatar.includes("accredipro") ? "WP"
         : "OTHER")
      : "NONE";
    console.log("Avatar:", avatarType);
    console.log("isFakeProfile:", post.author.isFakeProfile);
    console.log("Reactions:", JSON.stringify(post.reactions));
    console.log("Comments:", post.comments.length);
    console.log("");
  }

  // Check how many zombies have each avatar type
  const total = await prisma.user.count({ where: { isFakeProfile: true } });
  const r2Avatars = await prisma.user.count({
    where: { isFakeProfile: true, avatar: { contains: "r2.dev" } }
  });
  const wpAvatars = await prisma.user.count({
    where: { isFakeProfile: true, avatar: { contains: "accredipro" } }
  });
  const base64Avatars = await prisma.user.count({
    where: { isFakeProfile: true, avatar: { startsWith: "data:" } }
  });
  const noAvatars = await prisma.user.count({
    where: { isFakeProfile: true, avatar: null }
  });

  console.log("\nZombie Avatar Distribution:");
  console.log("Total zombies:", total);
  console.log("R2 avatars:", r2Avatars);
  console.log("WordPress avatars:", wpAvatars);
  console.log("Base64 avatars:", base64Avatars);
  console.log("No avatar:", noAvatars);
}
main().finally(() => prisma.$disconnect());
