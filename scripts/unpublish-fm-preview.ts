
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Unpublishing 'FM Certification Preview'...");

    // Update slug fm-preview
    const result = await prisma.course.update({
        where: { slug: 'fm-preview' },
        data: { isPublished: false }
    });

    console.log("✅ Unpublished:", result.title);
}

main()
    .catch(e => {
        if (e.code === 'P2025') {
            console.log("Course not found, maybe already deleted/unpublished?");
        } else {
            console.error(e);
        }
    })
    .finally(async () => await prisma.$disconnect());
