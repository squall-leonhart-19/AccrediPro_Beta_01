
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Searching for 'FM Certification Preview'...");
    const courses = await prisma.course.findMany({
        where: {
            title: { contains: "Preview", mode: "insensitive" }
        }
    });

    console.log("Found:", courses.map(c => ({ id: c.id, title: c.title, slug: c.slug, isPublished: c.isPublished })));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
