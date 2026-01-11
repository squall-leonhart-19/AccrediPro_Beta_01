import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
 * Seed script to create Course records for all 6 Mini Diploma niches
 */
async function main() {
    console.log("🚀 Seeding Mini Diploma Course records...\n");

    const courses = [
        {
            title: "Functional Medicine Mini Diploma",
            slug: "functional-medicine-mini-diploma",
            description: "Free 9-lesson introduction to functional medicine and root-cause health",
        },
        {
            title: "Gut Health Mini Diploma",
            slug: "gut-health-mini-diploma",
            description: "Free 9-lesson introduction to gut health and the microbiome",
        },
        {
            title: "Hormone Health Mini Diploma",
            slug: "hormone-health-mini-diploma",
            description: "Free 9-lesson introduction to hormone health and balance",
        },
        {
            title: "Holistic Nutrition Mini Diploma",
            slug: "holistic-nutrition-mini-diploma",
            description: "Free 9-lesson introduction to holistic nutrition principles",
        },
        {
            title: "Nurse Coach Mini Diploma",
            slug: "nurse-coach-mini-diploma",
            description: "Free 9-lesson introduction to nurse life coaching",
        },
        {
            title: "Health Coach Mini Diploma",
            slug: "health-coach-mini-diploma",
            description: "Free 9-lesson introduction to health coaching fundamentals",
        },
    ];

    for (const course of courses) {
        try {
            await prisma.$executeRaw`
                INSERT INTO "Course" ("id", "title", "slug", "description", "updatedAt", "createdAt", "isFree", "isActive")
                VALUES (
                    gen_random_uuid(), 
                    ${course.title}, 
                    ${course.slug}, 
                    ${course.description}, 
                    NOW(), 
                    NOW(),
                    true,
                    true
                )
                ON CONFLICT ("slug") DO NOTHING;
            `;
            console.log(`✅ ${course.slug}`);
        } catch (error) {
            console.error(`❌ Failed: ${course.slug}`, error);
        }
    }

    console.log("\n✅ Done seeding Mini Diploma courses!");
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
