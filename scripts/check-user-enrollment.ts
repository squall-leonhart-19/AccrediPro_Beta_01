import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    const user = await prisma.user.findUnique({
        where: { email: 'tortolialessio1997@gmail.com' },
        include: {
            enrollments: {
                include: { course: true }
            }
        }
    });
    console.log('User:', user?.email);
    console.log('Enrollments:', JSON.stringify(user?.enrollments?.map((e: any) => ({
        courseSlug: e.course?.slug,
        courseTitle: e.course?.title,
    })), null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
