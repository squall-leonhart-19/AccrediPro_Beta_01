import prisma from '../src/lib/prisma';

async function removeUserFromPod(email: string) {
    console.log(`\n🔍 Looking for user: ${email}`);

    // Find user
    const user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, firstName: true, lastName: true }
    });

    if (!user) {
        console.log('❌ User not found:', email);
        return;
    }

    console.log(`✅ Found user: ${user.firstName} ${user.lastName} (${user.id})`);

    // Find their pod memberships
    const memberships = await prisma.podMember.findMany({
        where: { userId: user.id },
        include: { pod: { select: { id: true, name: true } } }
    });

    if (memberships.length === 0) {
        console.log('ℹ️  User is not a member of any pod');
        return;
    }

    console.log(`📋 Current pod memberships: ${memberships.length}`);
    memberships.forEach(m => {
        console.log(`   - Pod: ${m.pod.name} (${m.pod.id})`);
    });

    // Remove from all pods
    const deleted = await prisma.podMember.deleteMany({
        where: { userId: user.id }
    });

    console.log(`\n🗑️  Removed ${deleted.count} pod membership(s)`);
    console.log('✅ Done!');
}

// Run with the specified email
removeUserFromPod('aetripp2024@gmail.com')
    .then(() => prisma.$disconnect())
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
