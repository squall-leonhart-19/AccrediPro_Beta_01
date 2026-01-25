import prisma from "../src/lib/prisma";

// Get existing R2 avatar URLs to use as templates
async function main() {
  console.log("Finding zombies with R2 avatars to use as pool...");

  // Get list of existing R2 avatar URLs
  const r2Zombies = await prisma.user.findMany({
    where: {
      isFakeProfile: true,
      avatar: { contains: "r2.dev" }
    },
    select: { avatar: true },
    take: 500
  });

  const r2AvatarPool = r2Zombies.map(z => z.avatar!).filter(Boolean);
  console.log(`Found ${r2AvatarPool.length} R2 avatars to use as pool`);

  // Find zombies with no avatar
  const noAvatarZombies = await prisma.user.findMany({
    where: {
      isFakeProfile: true,
      avatar: null
    },
    select: { id: true }
  });

  console.log(`Found ${noAvatarZombies.length} zombies with no avatar`);

  // Assign random R2 avatars to zombies without one
  let updated = 0;
  for (const zombie of noAvatarZombies) {
    const randomAvatar = r2AvatarPool[Math.floor(Math.random() * r2AvatarPool.length)];

    await prisma.user.update({
      where: { id: zombie.id },
      data: { avatar: randomAvatar }
    });

    updated++;
    if (updated % 100 === 0) {
      console.log(`Updated ${updated}/${noAvatarZombies.length}...`);
    }
  }

  console.log(`Done! Assigned avatars to ${updated} zombies`);

  // Verify
  const stillNoAvatar = await prisma.user.count({
    where: { isFakeProfile: true, avatar: null }
  });
  console.log(`Zombies still without avatar: ${stillNoAvatar}`);
}

main().finally(() => prisma.$disconnect());
