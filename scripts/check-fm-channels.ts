
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    const category = await prisma.category.findFirst({
        where: { slug: 'fm' },
        include: {
            channels: true,
            community: {
                include: {
                    posts: true
                }
            }
        }
    });

    if (!category) {
        console.log('Category FM not found');
        return;
    }

    console.log(`Category: ${category.name} (${category.id})`);
    console.log(`Channels: ${category.channels.length}`);
    category.channels.forEach(c => console.log(` - ${c.name} (${c.type})`));

    if (category.community) {
        console.log(`Community: ${category.community.name} (${category.community.id})`);
        console.log(`Posts linked to Community: ${category.community.posts.length}`);
    } else {
        console.log('No Community linked');
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
