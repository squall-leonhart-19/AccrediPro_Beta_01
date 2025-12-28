
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

// Setup Prisma with Adapter
const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const targets = [
    { email: 'Tricia.jefferson12@gmail.com', nameKeywords: ['Tricia', 'Jefferson'] },
    { email: 'heartsforpeace@aol.com', nameKeywords: ['Hearts', 'Peace', 'Peace'] },
    { email: 'dbonfadini2442@gmail.com', nameKeywords: ['Bonfadini'] },
    { email: 'MarcyMatteson@msn.com', nameKeywords: ['Marcy', 'Matteson'] },
    { email: 'giancarlagureng@gmail.com', nameKeywords: ['Giancarla', 'Gureng'] },
];

async function main() {
    console.log("Searching for users...");

    for (const target of targets) {
        console.log(`\n--- Target: ${target.email} ---`);

        // 1. Check exact email match
        const exactMatch = await prisma.user.findUnique({
            where: { email: target.email },
        });

        if (exactMatch) {
            console.log(`✅ FAILSAFE: Exact match found: ${exactMatch.firstName} ${exactMatch.lastName} (${exactMatch.email}) ID: ${exactMatch.id}`);
            continue;
        }

        console.log("❌ No exact email match.");

        // 2. Search by keywords
        const currentConditions: any[] = [];

        for (const keyword of target.nameKeywords) {
            if (!keyword) continue;
            currentConditions.push({ firstName: { contains: keyword, mode: 'insensitive' } });
            currentConditions.push({ lastName: { contains: keyword, mode: 'insensitive' } });
            currentConditions.push({ email: { contains: keyword, mode: 'insensitive' } });
        }

        const candidates = await prisma.user.findMany({
            where: {
                OR: currentConditions
            },
            select: { id: true, firstName: true, lastName: true, email: true }
        });

        if (candidates.length > 0) {
            console.log(`🔎 Potential candidates for [${target.email}]:`);
            const uniqueCandidates = Array.from(new Map(candidates.map(item => [item.id, item])).values());
            uniqueCandidates.forEach(c => console.log(`   - ID: ${c.id} | Name: ${c.firstName} ${c.lastName} | Email: ${c.email}`));
        } else {
            console.log("⚠️ No candidates found by name/email keywords.");
        }
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
