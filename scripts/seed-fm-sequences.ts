/**
 * Seed FM Mini Diploma Email Sequences
 *
 * Creates two sequences in the database:
 * 1. FM Completion Sequence (Track 1) - For users who complete mini diploma
 * 2. FM Nurture Sequence (Track 2) - For users who start but haven't completed
 *
 * Run with: npx tsx scripts/seed-fm-sequences.ts
 */

import prisma from "../src/lib/prisma";
import { FM_COMPLETION_SEQUENCE } from "../src/lib/fm-completion-sequence";
import { FM_NURTURE_SEQUENCE_V4 } from "../src/lib/fm-nurture-sequence-v4";

async function seedFMSequences() {
    console.log("🚀 Seeding FM Mini Diploma Sequences...\n");

    // ============================================
    // SEQUENCE 1: FM COMPLETION (Track 1)
    // ============================================
    console.log("📧 Creating FM Completion Sequence (Track 1)...");

    const completionSlug = "fm-completion-sequence";

    let completionSequence = await prisma.sequence.findUnique({
        where: { slug: completionSlug },
    });

    if (completionSequence) {
        console.log("  Found existing sequence, updating...");
        await prisma.sequenceEmail.deleteMany({
            where: { sequenceId: completionSequence.id },
        });
    } else {
        console.log("  Creating new sequence...");
        completionSequence = await prisma.sequence.create({
            data: {
                name: "FM Mini Diploma Completion Sequence",
                slug: completionSlug,
                description: "7-email conversion sequence for users who complete FM mini diploma (score 95+). $297 scholarship offer with 24h urgency.",
                triggerType: "MINI_DIPLOMA_COMPLETED",
                isActive: true,
                isSystem: true,
                priority: 200, // Higher priority than nurture
            },
        });
    }

    console.log(`  ✅ Sequence ID: ${completionSequence.id}`);

    // Create completion emails
    for (const email of FM_COMPLETION_SEQUENCE) {
        await prisma.sequenceEmail.create({
            data: {
                sequenceId: completionSequence.id,
                order: email.id,
                delayDays: email.day,
                delayHours: email.delayHours || 0,
                customSubject: email.subject,
                customContent: email.content,
                isActive: true,
            },
        });
        console.log(`    ✅ Email ${email.id}: "${email.subject.substring(0, 45)}..." (Day ${email.day})`);
    }

    console.log(`  🎉 Created ${FM_COMPLETION_SEQUENCE.length} completion emails\n`);

    // ============================================
    // SEQUENCE 2: FM NURTURE (Track 2)
    // ============================================
    console.log("📧 Creating FM Nurture Sequence (Track 2)...");

    const nurtureSlug = "fm-nurture-sequence-v4";

    let nurtureSequence = await prisma.sequence.findUnique({
        where: { slug: nurtureSlug },
    });

    if (nurtureSequence) {
        console.log("  Found existing sequence, updating...");
        await prisma.sequenceEmail.deleteMany({
            where: { sequenceId: nurtureSequence.id },
        });
    } else {
        console.log("  Creating new sequence...");
        nurtureSequence = await prisma.sequence.create({
            data: {
                name: "FM Mini Diploma Nurture Sequence v4",
                slug: nurtureSlug,
                description: "18-email nurture sequence for FM mini diploma leads. Encourages completion then converts to $297 scholarship.",
                triggerType: "MINI_DIPLOMA_STARTED",
                isActive: true,
                isSystem: true,
                priority: 100,
            },
        });
    }

    console.log(`  ✅ Sequence ID: ${nurtureSequence.id}`);

    // Create nurture emails
    for (const email of FM_NURTURE_SEQUENCE_V4) {
        await prisma.sequenceEmail.create({
            data: {
                sequenceId: nurtureSequence.id,
                order: email.id,
                delayDays: email.day,
                delayHours: email.delayHours || 0,
                customSubject: email.subject,
                customContent: email.content,
                isActive: true,
            },
        });
        console.log(`    ✅ Email ${email.id}: "${email.subject.substring(0, 45)}..." (Day ${email.day})`);
    }

    console.log(`  🎉 Created ${FM_NURTURE_SEQUENCE_V4.length} nurture emails\n`);

    // ============================================
    // SUMMARY
    // ============================================
    console.log("📊 Sequence Summary:");
    console.log("  ┌─────────────────────────────────────────────────┐");
    console.log("  │ TRACK 1: COMPLETION SEQUENCE                    │");
    console.log("  │ • 7 emails over 30 days                         │");
    console.log("  │ • Trigger: mini diploma completed (score 95+)   │");
    console.log("  │ • 24h scholarship urgency → grace period        │");
    console.log("  ├─────────────────────────────────────────────────┤");
    console.log("  │ TRACK 2: NURTURE SEQUENCE                       │");
    console.log("  │ • 18 emails over 45 days                        │");
    console.log("  │ • Trigger: mini diploma started (optin)         │");
    console.log("  │ • Stops when user completes → switches to T1    │");
    console.log("  └─────────────────────────────────────────────────┘");
    console.log("");
    console.log("✨ FM Sequences seeded successfully!");
    console.log("");
    console.log("Next steps:");
    console.log("1. Update enrollment logic to use these sequences");
    console.log("2. Add to inbox-test page for testing");
    console.log("3. Verify cron job picks them up");
}

seedFMSequences()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
