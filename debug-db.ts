import prisma from './src/lib/prisma';

async function main() {
    console.log('Connecting to database...');
    try {
        const lessonId = 'cmjisfkaa0003skm9u4j64np7';
        // We need a valid courseId to test Course directly. 
        // We can get it from the lesson -> module -> courseId if possible, 
        // but since that failed, let's try to get it from a raw query first.

        const lessonRaw = await prisma.$queryRaw`
        SELECT m."courseId" 
        FROM "Lesson" l
        JOIN "Module" m ON l."moduleId" = m.id
        WHERE l.id = ${lessonId}
    `;
        // @ts-ignore
        const courseId = lessonRaw[0]?.courseId;
        console.log('Found CourseID from Raw Query:', courseId);

        console.log('\n--- TEST A: Fetch Course Direct (Basic) ---');
        try {
            await prisma.course.findUnique({
                where: { id: courseId }
            });
            console.log('✅ Course Direct fetch success');
        } catch (e: any) {
            console.log('❌ Course Direct fetch FAILED:', e.message);
        }

        console.log('\n--- TEST B: Fetch Course + Coach ---');
        try {
            await prisma.course.findUnique({
                where: { id: courseId },
                include: { coach: true }
            });
            console.log('✅ Course + Coach fetch success');
        } catch (e: any) {
            console.log('❌ Course + Coach fetch FAILED:', e.message);
        }

        console.log('\n--- TEST C: Lesson -> Module -> Course (No includes in Course) ---');
        try {
            await prisma.lesson.findFirst({
                where: { id: lessonId },
                include: {
                    module: {
                        include: {
                            course: true
                        }
                    }
                }
            });
            console.log('✅ Lesson -> Module -> Course fetch success');
        } catch (e: any) {
            console.log('❌ Lesson -> Module -> Course fetch FAILED:', e.message);
        }

        // Check columns in Course table
        const columns = await prisma.$queryRaw`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'Course';
    `;
        console.log('\nColumns in "Course" table:', columns);

    } catch (e) {
        console.error('General Error:', e);
    }
}

main();
