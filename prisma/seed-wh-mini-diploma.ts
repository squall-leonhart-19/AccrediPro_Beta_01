import prisma from "../src/lib/prisma";

async function main() {
    console.log("Attempting raw SQL insert for course...");

    try {
        // Try to insert using raw SQL to bypass Prisma model validation
        // Assuming standard Prisma naming conventions (case sensitive table/col names as defined in schema)
        const result = await prisma.$executeRaw`
      INSERT INTO "Course" ("id", "title", "slug", "description", "updatedAt", "createdAt", "isFree", "isActive")
      VALUES (
        gen_random_uuid(), 
        'Women''s Health Mini Diploma', 
        'womens-health-mini-diploma', 
        'Free 9-lesson introduction to women''s hormone health and wellness', 
        NOW(), 
        NOW(),
        true,
        true
      )
      ON CONFLICT ("slug") DO NOTHING;
    `;

        console.log("✅ Raw SQL executed. Result:", result);
    } catch (error) {
        console.error("❌ Raw SQL failed:", error);

        // Fallback: Try without boolean fields if they are missing
        try {
            console.log("Retrying without boolean fields...");
            await prisma.$executeRaw`
          INSERT INTO "Course" ("id", "title", "slug", "description", "updatedAt", "createdAt")
          VALUES (
            gen_random_uuid(), 
            'Women''s Health Mini Diploma', 
            'womens-health-mini-diploma', 
            'Free 9-lesson introduction to women''s hormone health and wellness', 
            NOW(), 
            NOW()
          )
          ON CONFLICT ("slug") DO NOTHING;
        `;
            console.log("✅ Fallback SQL executed.");
        } catch (e) {
            console.error("❌ Fallback SQL failed:", e);
        }
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
