import prisma from "../src/lib/prisma";

/**
 * Fix zombie avatars - replace broken R2 URLs with real avatar service URLs
 * Uses DiceBear API which is already allowed in next.config
 */

// DiceBear styles that work well for professional female profiles
const DICEBEAR_STYLES = [
  "lorelei",     // Feminine illustrated faces
  "micah",       // Soft, friendly illustrated faces
  "avataaars",   // Classic avatar style
  "notionists",  // Simple, professional
];

function generateAvatarUrl(userId: string, firstName: string): string {
  // Use random style per user based on ID hash
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash) + userId.charCodeAt(i);
    hash = hash & hash;
  }

  const style = DICEBEAR_STYLES[Math.abs(hash) % DICEBEAR_STYLES.length];
  const seed = encodeURIComponent(`${firstName}-${userId.substring(0, 8)}`);

  return `https://api.dicebear.com/7.x/${style}/svg?seed=${seed}`;
}

async function main() {
  console.log("Fixing zombie avatars with DiceBear URLs...\n");

  // Get zombies with broken R2 avatars
  const brokenAvatarZombies = await prisma.user.findMany({
    where: {
      isFakeProfile: true,
      avatar: { contains: "r2.dev" }
    },
    select: { id: true, firstName: true, lastName: true }
  });

  console.log(`Found ${brokenAvatarZombies.length} zombies with broken R2 avatars`);

  // Update each zombie with a DiceBear avatar
  let updated = 0;
  for (const zombie of brokenAvatarZombies) {
    const newAvatar = generateAvatarUrl(zombie.id, zombie.firstName || "User");

    await prisma.user.update({
      where: { id: zombie.id },
      data: { avatar: newAvatar }
    });

    updated++;
    if (updated % 200 === 0) {
      console.log(`Updated ${updated}/${brokenAvatarZombies.length}...`);
    }
  }

  console.log(`\nDone! Updated ${updated} zombie avatars to DiceBear URLs`);

  // Verify a sample
  const sample = await prisma.user.findFirst({
    where: { isFakeProfile: true, avatar: { contains: "dicebear" } },
    select: { firstName: true, lastName: true, avatar: true }
  });
  console.log("\nSample avatar:", sample);
}

main().catch(console.error).finally(() => prisma.$disconnect());
