import prisma from '../src/lib/prisma';

async function deletePod() {
    console.log('Deleting all masterclass messages...');
    await prisma.masterclassMessage.deleteMany({});

    console.log('Deleting all day progress...');
    await prisma.masterclassDayProgress.deleteMany({});

    console.log('Deleting all pods...');
    const result = await prisma.masterclassPod.deleteMany({});
    console.log('Deleted pods:', result.count);

    await prisma.$disconnect();
}

deletePod().then(() => process.exit(0)).catch(e => {
    console.error(e);
    process.exit(1);
});
