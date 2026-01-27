
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// R2 Avatar Pool (30 images, assume all female based on user request)
const R2_AVATARS = Array.from({ length: 30 }, (_, i) =>
    `https://assets.accredipro.academy/avatars/avatar-${(i + 1).toString().padStart(2, '0')}.webp`
);

const MALE_NAMES = ["Mike", "David", "Chris", "Brian", "James"];
const NEW_FEMALE_NAMES = [
    "Emma", "Olivia", "Ava", "Isabella", "Sophia", "Mia", "Charlotte", "Amelia",
    "Harper", "Evelyn", "Abigail", "Emily", "Elizabeth", "Mila", "Ella",
    "Avery", "Sofia", "Camila", "Aria", "Scarlett"
];

function randomFrom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
    console.log("🚀 Fixing zombie profiles (Avatars -> R2 & Gender -> Female)...");

    // Fetch all fake profiles
    const zombies = await prisma.user.findMany({
        where: {
            isFakeProfile: true,
        },
        select: { id: true, firstName: true, avatar: true }
    });

    console.log(`Scanning ${zombies.length} zombie profiles...`);

    let updatedAvatars = 0;
    let updatedNames = 0;

    for (const zombie of zombies) {
        const updates: any = {};
        let needsUpdate = false;

        // 1. Fix Avatar (if not R2)
        if (!zombie.avatar || !zombie.avatar.startsWith("https://assets.accredipro.academy/names/")) {
            // Note: The previous script check was assets.accredipro.academy/avatars/, but let's be safe.
            // Actually the R2 script uses `https://assets.accredipro.academy/avatars/`
            if (!zombie.avatar?.startsWith("https://assets.accredipro.academy/avatars/")) {
                updates.avatar = randomFrom(R2_AVATARS);
                needsUpdate = true;
                updatedAvatars++;
            }
        }

        // 2. Fix Name (if male)
        if (zombie.firstName && MALE_NAMES.includes(zombie.firstName)) {
            updates.firstName = randomFrom(NEW_FEMALE_NAMES);
            needsUpdate = true;
            updatedNames++;
        }

        if (needsUpdate) {
            await prisma.user.update({
                where: { id: zombie.id },
                data: updates
            });
        }

        if ((updatedAvatars + updatedNames) % 100 === 0 && (updatedAvatars + updatedNames) > 0) {
            process.stdout.write(".");
        }
    }

    console.log("\n\n✅ Fix Complete!");
    console.log(`   - Updated Avatars: ${updatedAvatars}`);
    console.log(`   - Updated Names (Male -> Female): ${updatedNames}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
