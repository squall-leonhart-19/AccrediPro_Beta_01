import prisma from "../src/lib/prisma";

async function addLesson() {
    const course = await prisma.course.findFirst({
        where: { slug: 'certificate-test-course' },
        include: { modules: true }
    });

    if (!course) {
        console.log('Course not found');
        await prisma.$disconnect();
        return;
    }

    const module = course.modules[0];
    if (!module) {
        console.log('Module not found');
        await prisma.$disconnect();
        return;
    }

    // Check if lesson exists
    const existingLesson = await prisma.lesson.findFirst({ where: { moduleId: module.id } });
    if (existingLesson) {
        console.log('✅ Lesson already exists:', existingLesson.title);
        console.log('Course ID:', course.id);
        console.log('\n🎯 Go test it at: /courses/' + course.slug);
        await prisma.$disconnect();
        return;
    }

    const lesson = await prisma.lesson.create({
        data: {
            title: 'Complete This to Get Your Certificate',
            description: 'Complete this lesson to earn your certificate!',
            content: 'Congratulations! Click the Complete button below to finish this course and receive your certificate.',
            order: 1,
            isPublished: true,
            moduleId: module.id
        }
    });
    console.log('✅ Lesson created:', lesson.title);
    console.log('Course ID:', course.id);
    console.log('\n🎯 Go test it at: /courses/' + course.slug);
    await prisma.$disconnect();
}

addLesson();
