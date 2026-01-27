
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Fixing community channels...');

    // 1. Get FM Category and its channels
    const category = await prisma.category.findFirst({
        where: { slug: 'fm' },
        include: {
            channels: true,
            community: true,
        }
    });

    if (!category) {
        console.error('FM Category not found');
        return;
    }

    console.log(`Found Category: ${category.name}`);

    let community = category.community;

    // 1a. Create community if missing
    if (!community) {
        console.log('Creating missing community...');
        // Find coach
        const coach = await prisma.user.findFirst({
            where: { email: "sarah@accredipro-certificate.com" }
        });

        if (!coach) {
            console.error('Coach Sarah not found');
            return;
        }

        community = await prisma.categoryCommunity.create({
            data: {
                categoryId: category.id,
                name: "Functional Medicine Community",
                description: "Connect with fellow functional medicine students and practitioners.",
                welcomePost: "Welcome to the community!",
                coachId: coach.id,
                isActive: true,
            }
        });
        console.log(`Created community: ${community.id}`);
    }

    // Map channel types to IDs
    const channelMap = category.channels.reduce((acc, ch) => {
        acc[ch.type] = ch.id;
        return acc;
    }, {} as Record<string, string>);

    console.log('Channels:', channelMap);

    // 2. Fix WINS posts
    if (channelMap.WINS) {
        const winsUpdate = await prisma.communityPost.updateMany({
            where: {
                categoryId: 'wins',
                channelId: null,
            },
            data: {
                channelId: channelMap.WINS,
                communityId: community.id,
            }
        });
        console.log(`Updated ${winsUpdate.count} WINS posts to channel ${channelMap.WINS}`);
    }

    // 3. Fix GRADUATES posts -> Map to WINS channel
    if (channelMap.WINS) {
        const gradsUpdate = await prisma.communityPost.updateMany({
            where: {
                categoryId: 'graduates',
                channelId: null,
            },
            data: {
                channelId: channelMap.WINS,
                communityId: community.id,
            }
        });
        console.log(`Updated ${gradsUpdate.count} GRADUATES posts to channel ${channelMap.WINS}`);
    }

    // 4. Fix TIPS posts -> Map to TIPS channel
    if (channelMap.TIPS) {
        const tipsUpdate = await prisma.communityPost.updateMany({
            where: {
                categoryId: 'tips',
                channelId: null,
            },
            data: {
                channelId: channelMap.TIPS,
                communityId: community.id,
            }
        });
        console.log(`Updated ${tipsUpdate.count} TIPS posts to channel ${channelMap.TIPS}`);
    }

    // 5. Fix QUESTIONS posts -> Map to QUESTIONS channel
    if (channelMap.QUESTIONS) {
        const questionsUpdate = await prisma.communityPost.updateMany({
            where: {
                categoryId: 'questions',
                channelId: null,
            },
            data: {
                channelId: channelMap.QUESTIONS,
                communityId: community.id,
            }
        });
        console.log(`Updated ${questionsUpdate.count} QUESTIONS posts to channel ${channelMap.QUESTIONS}`);
    }

    // 6. Fix INTRODUCTIONS posts -> Map to INTRODUCTIONS channel
    if (channelMap.INTRODUCTIONS) {
        const introUpdate = await prisma.communityPost.updateMany({
            where: {
                categoryId: 'introductions',
                channelId: null,
            },
            data: {
                channelId: channelMap.INTRODUCTIONS,
                communityId: community.id,
            }
        });
        console.log(`Updated ${introUpdate.count} INTRODUCTIONS posts to channel ${channelMap.INTRODUCTIONS}`);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
