/**
 * Backfill User Tags Script
 *
 * This script creates UserTag entries for existing users who:
 * 1. Registered via mini-diploma freebie (have leadSource = "mini-diploma")
 * 2. Completed mini diploma (have miniDiplomaCompletedAt set)
 * 3. Have enrollments in courses
 *
 * Run with: npx tsx scripts/backfill-user-tags.ts
 */

import prisma from "../src/lib/prisma";

async function backfillUserTags() {
    console.log("🏷️ Starting user tags backfill...\n");

    // Get all real users (not fake profiles)
    const users = await prisma.user.findMany({
        where: {
            email: { not: null },
            isFakeProfile: false,
        },
        select: {
            id: true,
            email: true,
            firstName: true,
            leadSource: true,
            leadSourceDetail: true,
            miniDiplomaCategory: true,
            miniDiplomaCompletedAt: true,
            createdAt: true,
            enrollments: {
                select: {
                    id: true,
                    status: true,
                    course: {
                        select: {
                            id: true,
                            slug: true,
                            certificateType: true,
                        },
                    },
                },
            },
            tags: {
                select: { tag: true },
            },
        },
    });

    console.log(`Found ${users.length} users to process\n`);

    let tagsCreated = 0;
    let usersUpdated = 0;

    for (const user of users) {
        const existingTags = new Set(user.tags.map(t => t.tag));
        const tagsToCreate: string[] = [];

        // 1. Lead source tag (from mini-diploma freebie)
        // Handle both "mini-diploma" and "mini-diploma-freebie" sources
        if ((user.leadSource === "mini-diploma" || user.leadSource === "mini-diploma-freebie") && user.leadSourceDetail) {
            const leadTag = `lead:${user.leadSourceDetail}`;
            if (!existingTags.has(leadTag)) {
                tagsToCreate.push(leadTag);
            }
        }

        // 2. Mini diploma category selected
        if (user.miniDiplomaCategory) {
            const categoryTag = `mini_diploma_category:${user.miniDiplomaCategory}`;
            if (!existingTags.has(categoryTag)) {
                tagsToCreate.push(categoryTag);
            }
        }

        // 3. Mini diploma completion tags
        if (user.miniDiplomaCompletedAt && user.miniDiplomaCategory) {
            const completionTags = [
                `mini_diploma_completed`,
                `mini_diploma_${user.miniDiplomaCategory}_completed`,
                `graduate_${user.miniDiplomaCategory}`,
            ];
            for (const tag of completionTags) {
                if (!existingTags.has(tag)) {
                    tagsToCreate.push(tag);
                }
            }
        }

        // 4. Enrollment tags
        for (const enrollment of user.enrollments) {
            const courseSlug = enrollment.course.slug;
            const certType = enrollment.course.certificateType;

            // Enrolled tag
            const enrolledTag = `enrolled:${courseSlug}`;
            if (!existingTags.has(enrolledTag)) {
                tagsToCreate.push(enrolledTag);
            }

            // Certification type tag
            if (certType === "CERTIFICATION") {
                const certTag = `certification_enrolled`;
                if (!existingTags.has(certTag)) {
                    tagsToCreate.push(certTag);
                }
            }

            // Completed tag
            if (enrollment.status === "COMPLETED") {
                const completedTag = `completed:${courseSlug}`;
                if (!existingTags.has(completedTag)) {
                    tagsToCreate.push(completedTag);
                }
            }
        }

        // Create the tags
        if (tagsToCreate.length > 0) {
            for (const tag of tagsToCreate) {
                try {
                    await prisma.userTag.upsert({
                        where: { userId_tag: { userId: user.id, tag } },
                        update: {},
                        create: {
                            userId: user.id,
                            tag,
                            metadata: {
                                source: "backfill-script",
                                backfilledAt: new Date().toISOString(),
                            },
                        },
                    });
                    tagsCreated++;
                } catch (error) {
                    console.error(`  Error creating tag "${tag}" for ${user.email}:`, error);
                }
            }

            console.log(`✅ ${user.email}: Created ${tagsToCreate.length} tags`);
            tagsToCreate.forEach(t => console.log(`   - ${t}`));
            usersUpdated++;
        }
    }

    console.log("\n" + "=".repeat(50));
    console.log(`📊 Summary:`);
    console.log(`   Users processed: ${users.length}`);
    console.log(`   Users updated: ${usersUpdated}`);
    console.log(`   Tags created: ${tagsCreated}`);
    console.log("=".repeat(50));
}

// Run the script
backfillUserTags()
    .then(() => {
        console.log("\n✅ Backfill complete!");
        process.exit(0);
    })
    .catch((error) => {
        console.error("❌ Backfill failed:", error);
        process.exit(1);
    });
