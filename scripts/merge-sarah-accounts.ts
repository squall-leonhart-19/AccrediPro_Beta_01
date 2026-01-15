// Script to merge Sarah accounts
// Transfer all messages and relations from old Sarah to new Sarah

import prisma from "../src/lib/prisma";

async function mergeSarahAccounts() {
    const OLD_EMAIL = "sarah@accredipro.academy";
    const NEW_EMAIL = "sarah@accredipro-certificate.com";

    console.log("🔄 Starting Sarah account merge...");
    console.log(`   Old: ${OLD_EMAIL}`);
    console.log(`   New: ${NEW_EMAIL}`);

    // Find both users
    const oldSarah = await prisma.user.findUnique({
        where: { email: OLD_EMAIL },
    });

    const newSarah = await prisma.user.findUnique({
        where: { email: NEW_EMAIL },
    });

    if (!oldSarah) {
        console.log("❌ Old Sarah not found");
        return;
    }

    if (!newSarah) {
        console.log("❌ New Sarah not found");
        return;
    }

    console.log(`   Old Sarah ID: ${oldSarah.id}`);
    console.log(`   New Sarah ID: ${newSarah.id}`);

    // Transfer sent messages
    const sentMessages = await prisma.message.updateMany({
        where: { senderId: oldSarah.id },
        data: { senderId: newSarah.id },
    });
    console.log(`✅ Transferred ${sentMessages.count} sent messages`);

    // Transfer received messages
    const receivedMessages = await prisma.message.updateMany({
        where: { receiverId: oldSarah.id },
        data: { receiverId: newSarah.id },
    });
    console.log(`✅ Transferred ${receivedMessages.count} received messages`);

    // Transfer scheduled voice messages (sender)
    const scheduledSent = await prisma.scheduledVoiceMessage.updateMany({
        where: { senderId: oldSarah.id },
        data: { senderId: newSarah.id },
    });
    console.log(`✅ Transferred ${scheduledSent.count} scheduled voice messages (sent)`);

    // Transfer scheduled voice messages (receiver)
    const scheduledReceived = await prisma.scheduledVoiceMessage.updateMany({
        where: { receiverId: oldSarah.id },
        data: { receiverId: newSarah.id },
    });
    console.log(`✅ Transferred ${scheduledReceived.count} scheduled voice messages (received)`);

    // Transfer coach assignments
    const coachAssignments = await prisma.user.updateMany({
        where: { assignedCoachId: oldSarah.id },
        data: { assignedCoachId: newSarah.id },
    });
    console.log(`✅ Transferred ${coachAssignments.count} coach assignments`);

    // Transfer course coach assignments
    const courseCoach = await prisma.course.updateMany({
        where: { coachId: oldSarah.id },
        data: { coachId: newSarah.id },
    });
    console.log(`✅ Transferred ${courseCoach.count} course coach assignments`);

    // Deactivate old Sarah (don't delete to preserve referential integrity)
    await prisma.user.update({
        where: { id: oldSarah.id },
        data: {
            isActive: false,
            email: `archived_${OLD_EMAIL}`, // Prevent login
        },
    });
    console.log(`✅ Deactivated old Sarah account`);

    console.log("\n🎉 Sarah account merge complete!");
}

mergeSarahAccounts()
    .then(() => process.exit(0))
    .catch((err) => {
        console.error("❌ Error:", err);
        process.exit(1);
    });
