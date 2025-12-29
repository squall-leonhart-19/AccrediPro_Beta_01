
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    const email = "blablarog1234@gmail.com";
    const password = "Futurecoach2025";

    console.log(`Setting password for: ${email}`);

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.update({
        where: { email },
        data: { passwordHash: hashedPassword }
    });

    console.log(`✅ Password updated to: ${password}`);
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
