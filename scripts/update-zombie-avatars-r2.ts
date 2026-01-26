/**
 * Script: Update all zombie avatars to use R2 assets
 * Run with: npx tsx scripts/update-zombie-avatars-r2.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// R2 Avatar Pool (30 images available)
const R2_AVATARS = Array.from({ length: 30 }, (_, i) =>
  `https://assets.accredipro.academy/avatars/avatar-${(i + 1).toString().padStart(2, '0')}.webp`
);

async function main() {
  console.log("🚀 Updating zombie avatars to R2 assets...");

  const zombies = await prisma.user.findMany({
    where: {
      isFakeProfile: true,
      // Find ones that don't match our specific pattern effectively
      NOT: {
        avatar: {
          startsWith: "https://assets.accredipro.academy/avatars/"
        }
      }
    },
    select: { id: true, email: true }
  });

  console.log(`Found ${zombies.length} zombies needing R2 avatars.`);

  if (zombies.length === 0) {
    console.log("✅ All zombies already updated!");
    return;
  }

  let updated = 0;
  for (const zombie of zombies) {
    const randomAvatar = R2_AVATARS[Math.floor(Math.random() * R2_AVATARS.length)];

    await prisma.user.update({
      where: { id: zombie.id },
      data: { avatar: randomAvatar }
    });

    updated++;
    if (updated % 50 === 0) process.stdout.write(".");
  }

  console.log(`\n✅ Successfully updated ${updated} profiles to use R2 avatars.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
