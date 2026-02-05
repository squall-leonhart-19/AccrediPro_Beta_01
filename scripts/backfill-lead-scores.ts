/**
 * Backfill Lead Qualification Tags and Scores
 * 
 * This script:
 * 1. Finds all mini diploma leads without lead_score tag
 * 2. Reads their existing qualification tags
 * 3. Calculates lead score based on any existing data
 * 4. Adds lead_score and lead_tier tags
 * 
 * Run with: npx tsx scripts/backfill-lead-scores.ts
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Scoring function (same as in optin route)
function calculateLeadScore(data: {
    background?: string;
    motivation?: string;
    workCost?: string;
    holdingBack?: string;
    successGoal?: string;
    timeAvailable?: string;
    investmentRange?: string;
    readiness?: string;
}): number {
    let score = 0;

    // Q1: Background
    switch (data.background) {
        case "healthcare": score += 30; break;
        case "wellness": score += 25; break;
        case "educator": score += 20; break;
        case "transition": score += 15; break;
        case "other": score += 10; break;
    }

    // Q2: Motivation
    switch (data.motivation) {
        case "help-heal": score += 20; break;
        case "own-journey": score += 20; break;
        case "burnout": score += 15; break;
        case "flexibility": score += 15; break;
        case "new-chapter": score += 15; break;
    }

    // Q3: Work Cost
    if (data.workCost) score += 10;

    // Q4: Holding Back
    switch (data.holdingBack) {
        case "ready": score += 25; break;
        case "investment-concern": score += 15; break;
        case "self-doubt": score += 10; break;
        case "tried-before": score += 10; break;
        case "unsure-where": score += 10; break;
    }

    // Q5: Success Goal
    switch (data.successGoal) {
        case "full-practice": score += 25; break;
        case "replace-income": score += 20; break;
        case "side-income": score += 15; break;
        // Legacy mappings
        case "scale-business-10k-plus": score += 25; break;
        case "replace-job-5-10k": score += 20; break;
        case "starter-3-5k": score += 15; break;
    }

    // Q6: Time Available
    switch (data.timeAvailable) {
        case "priority": score += 20; break;
        case "part-time": score += 15; break;
        case "few-hours": score += 10; break;
        // Legacy mappings
        case "all-in-full-commitment": score += 20; break;
        case "part-time-10-15h": score += 15; break;
        case "few-hours-flexible": score += 10; break;
    }

    // Q7: Investment Range
    switch (data.investmentRange) {
        case "5k-plus": score += 30; break;
        case "3k-5k": score += 25; break;
        case "1k-3k": score += 15; break;
        case "under-1k": score += 5; break;
    }

    // Q8: Readiness
    switch (data.readiness) {
        case "ready": score += 25; break;
        case "yes-ready": score += 25; break;
        case "need-time": score += 10; break;
        case "talk-partner": score += 5; break;
    }

    return score;
}

function getLeadTier(score: number): "hot" | "warm" | "cold" {
    if (score >= 130) return "hot";
    if (score >= 80) return "warm";
    return "cold";
}

async function backfillLeadScores() {
    console.log("🔍 Finding mini diploma leads without lead_score tag...\n");

    // Get all mini diploma leads
    const leads = await prisma.user.findMany({
        where: {
            userType: "LEAD",
            miniDiplomaOptinAt: { not: null },
        },
        include: {
            tags: true,
        },
    });

    console.log(`📊 Found ${leads.length} total mini diploma leads\n`);

    let processed = 0;
    let skipped = 0;
    let updated = 0;

    for (const lead of leads) {
        const tags = lead.tags.map(t => t.tag);

        // Skip if already has lead_score
        if (tags.some(t => t.startsWith("lead_score:"))) {
            skipped++;
            continue;
        }

        // Extract qualification data from existing tags
        const qualData: any = {};

        // Parse existing tags to extract qualification data
        for (const tag of tags) {
            // New format: qualification:field:value
            if (tag.startsWith("qualification:background:")) {
                qualData.background = tag.split(":")[2];
            } else if (tag.startsWith("qualification:motivation:")) {
                qualData.motivation = tag.split(":")[2];
            } else if (tag.startsWith("qualification:work-cost:")) {
                qualData.workCost = tag.split(":")[2];
            } else if (tag.startsWith("qualification:holding-back:")) {
                qualData.holdingBack = tag.split(":")[2];
            } else if (tag.startsWith("qualification:success-goal:")) {
                qualData.successGoal = tag.split(":")[2];
            } else if (tag.startsWith("qualification:time:")) {
                qualData.timeAvailable = tag.split(":")[2];
            } else if (tag.startsWith("qualification:investment:")) {
                qualData.investmentRange = tag.split(":")[2];
            } else if (tag.startsWith("qualification:readiness:")) {
                qualData.readiness = tag.split(":")[2];
            }
            // Legacy format mappings
            else if (tag.startsWith("income_goal:")) {
                qualData.successGoal = tag.split(":")[1];
            } else if (tag.startsWith("time_commitment:")) {
                qualData.timeAvailable = tag.split(":")[1];
            } else if (tag.startsWith("motivation:")) {
                qualData.motivation = tag.split(":")[1];
            } else if (tag.startsWith("investment_level:")) {
                qualData.investmentRange = tag.split(":")[1];
            } else if (tag.startsWith("readiness:")) {
                qualData.readiness = tag.split(":")[1];
            }
        }

        // Calculate score
        const leadScore = calculateLeadScore(qualData);
        const leadTier = getLeadTier(leadScore);

        // Add new tags
        const newTags = [
            `lead_score:${leadScore}`,
            `lead_tier:${leadTier}`,
        ];

        // Also add new-format qualification tags if we have legacy data
        if (qualData.background && !tags.includes(`qualification:background:${qualData.background}`)) {
            newTags.push(`qualification:background:${qualData.background}`);
        }
        if (qualData.motivation && !tags.includes(`qualification:motivation:${qualData.motivation}`)) {
            newTags.push(`qualification:motivation:${qualData.motivation}`);
        }
        if (qualData.successGoal && !tags.includes(`qualification:success-goal:${qualData.successGoal}`)) {
            newTags.push(`qualification:success-goal:${qualData.successGoal}`);
        }
        if (qualData.timeAvailable && !tags.includes(`qualification:time:${qualData.timeAvailable}`)) {
            newTags.push(`qualification:time:${qualData.timeAvailable}`);
        }
        if (qualData.investmentRange && !tags.includes(`qualification:investment:${qualData.investmentRange}`)) {
            newTags.push(`qualification:investment:${qualData.investmentRange}`);
        }
        if (qualData.readiness && !tags.includes(`qualification:readiness:${qualData.readiness}`)) {
            newTags.push(`qualification:readiness:${qualData.readiness}`);
        }

        // Insert tags
        for (const tag of newTags) {
            try {
                await prisma.userTag.create({
                    data: { userId: lead.id, tag },
                });
            } catch (e) {
                // Ignore duplicate tag errors
            }
        }

        updated++;
        console.log(`✅ ${lead.firstName} (${lead.email}): Score ${leadScore} (${leadTier})`);
        processed++;
    }

    console.log("\n" + "=".repeat(50));
    console.log("📈 BACKFILL COMPLETE");
    console.log("=".repeat(50));
    console.log(`Total leads:     ${leads.length}`);
    console.log(`Already scored:  ${skipped}`);
    console.log(`Newly scored:    ${updated}`);
    console.log("=".repeat(50));
}

backfillLeadScores()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
