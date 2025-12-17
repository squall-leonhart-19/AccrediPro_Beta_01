import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

/**
 * CRON: Check for users who need recovery emails
 *
 * Runs daily at 6 PM EST via Vercel Cron
 *
 * Recovery Sequences:
 * 1. Never Logged In (after signup with mini-diploma access)
 *    - 1A: Day 1 after signup
 *    - 1B: Day 3 after signup
 *    - 1C: Day 7 after signup
 *
 * 2. Never Started Learning (logged in but 0% progress)
 *    - 2A: Day 2 after first login
 *    - 2B: Day 5 after first login
 *    - 2C: Day 10 after first login
 *
 * 3. Abandoned Learning (started but stopped)
 *    - 3A: Day 7 after last activity
 *    - 3B: Day 14 after last activity
 *    - 3C: Day 21 after last activity
 */

// Sequence slugs
const RECOVERY_SEQUENCES = {
  NEVER_LOGGED_IN: "recovery-never-logged-in",
  NEVER_STARTED: "recovery-never-started",
  ABANDONED: "recovery-abandoned-learning",
};

export async function GET(request: NextRequest) {
  try {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.warn("[CRON-RECOVERY] Unauthorized cron request");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[CRON-RECOVERY] Checking for users needing recovery emails...");

    const now = new Date();
    const results = {
      neverLoggedIn: { checked: 0, enrolled: 0 },
      neverStarted: { checked: 0, enrolled: 0 },
      abandoned: { checked: 0, enrolled: 0 },
      errors: 0,
    };

    // Get recovery sequences
    const sequences = await prisma.sequence.findMany({
      where: {
        slug: {
          in: Object.values(RECOVERY_SEQUENCES),
        },
        isActive: true,
      },
    });

    const sequenceMap = new Map(sequences.map((s) => [s.slug, s]));

    // ============================================
    // 1. NEVER LOGGED IN
    // Users who signed up for mini-diploma but never logged in
    // ============================================
    const neverLoggedInSequence = sequenceMap.get(RECOVERY_SEQUENCES.NEVER_LOGGED_IN);

    if (neverLoggedInSequence) {
      // Find users with mini-diploma access but no lastLoginAt
      // Who signed up at least 1 day ago
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const neverLoggedInUsers = await prisma.user.findMany({
        where: {
          miniDiplomaOptinAt: {
            not: null,
            lte: oneDayAgo, // At least 1 day old
          },
          lastLoginAt: null, // Never logged in
          isActive: true,
          isFakeProfile: false,
        },
        select: {
          id: true,
          email: true,
          miniDiplomaOptinAt: true,
        },
      });

      results.neverLoggedIn.checked = neverLoggedInUsers.length;

      for (const user of neverLoggedInUsers) {
        try {
          // Check if already enrolled in this sequence
          const existing = await prisma.sequenceEnrollment.findUnique({
            where: {
              userId_sequenceId: {
                userId: user.id,
                sequenceId: neverLoggedInSequence.id,
              },
            },
          });

          if (!existing) {
            // Enroll in recovery sequence
            const nextSendAt = new Date(now.getTime() + 15 * 60 * 1000); // 15 min from now

            await prisma.sequenceEnrollment.create({
              data: {
                userId: user.id,
                sequenceId: neverLoggedInSequence.id,
                status: "ACTIVE",
                currentEmailIndex: 0,
                nextSendAt,
              },
            });

            await prisma.sequence.update({
              where: { id: neverLoggedInSequence.id },
              data: { totalEnrolled: { increment: 1 } },
            });

            // Add recovery tag
            await prisma.userTag.upsert({
              where: { userId_tag: { userId: user.id, tag: "recovery:never_logged_in" } },
              update: {},
              create: { userId: user.id, tag: "recovery:never_logged_in" },
            });

            results.neverLoggedIn.enrolled++;
            console.log(`[CRON-RECOVERY] Enrolled ${user.email} in never-logged-in recovery`);
          }
        } catch (err) {
          results.errors++;
          console.error(`[CRON-RECOVERY] Error enrolling ${user.email}:`, err);
        }
      }
    }

    // ============================================
    // 2. NEVER STARTED LEARNING
    // Users who logged in but have 0% progress
    // ============================================
    const neverStartedSequence = sequenceMap.get(RECOVERY_SEQUENCES.NEVER_STARTED);

    if (neverStartedSequence) {
      const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

      // Find users who:
      // - Have mini-diploma access
      // - Logged in at least 2 days ago
      // - Have 0 progress records
      const loggedInUsers = await prisma.user.findMany({
        where: {
          miniDiplomaOptinAt: { not: null },
          lastLoginAt: {
            not: null,
            lte: twoDaysAgo,
          },
          isActive: true,
          isFakeProfile: false,
        },
        select: {
          id: true,
          email: true,
          lastLoginAt: true,
          _count: {
            select: { progress: true },
          },
        },
      });

      // Filter to those with 0 progress
      const neverStartedUsers = loggedInUsers.filter((u) => u._count.progress === 0);
      results.neverStarted.checked = neverStartedUsers.length;

      for (const user of neverStartedUsers) {
        try {
          const existing = await prisma.sequenceEnrollment.findUnique({
            where: {
              userId_sequenceId: {
                userId: user.id,
                sequenceId: neverStartedSequence.id,
              },
            },
          });

          if (!existing) {
            const nextSendAt = new Date(now.getTime() + 15 * 60 * 1000);

            await prisma.sequenceEnrollment.create({
              data: {
                userId: user.id,
                sequenceId: neverStartedSequence.id,
                status: "ACTIVE",
                currentEmailIndex: 0,
                nextSendAt,
              },
            });

            await prisma.sequence.update({
              where: { id: neverStartedSequence.id },
              data: { totalEnrolled: { increment: 1 } },
            });

            await prisma.userTag.upsert({
              where: { userId_tag: { userId: user.id, tag: "recovery:never_started" } },
              update: {},
              create: { userId: user.id, tag: "recovery:never_started" },
            });

            results.neverStarted.enrolled++;
            console.log(`[CRON-RECOVERY] Enrolled ${user.email} in never-started recovery`);
          }
        } catch (err) {
          results.errors++;
          console.error(`[CRON-RECOVERY] Error enrolling ${user.email}:`, err);
        }
      }
    }

    // ============================================
    // 3. ABANDONED LEARNING
    // Users who started but haven't been active for 7+ days
    // ============================================
    const abandonedSequence = sequenceMap.get(RECOVERY_SEQUENCES.ABANDONED);

    if (abandonedSequence) {
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      // Find users who:
      // - Have mini-diploma access
      // - Have some progress (started learning)
      // - Haven't had activity in 7+ days
      const activeUsers = await prisma.user.findMany({
        where: {
          miniDiplomaOptinAt: { not: null },
          isActive: true,
          isFakeProfile: false,
          progress: {
            some: {}, // Has at least one progress record
          },
        },
        select: {
          id: true,
          email: true,
          lastLoginAt: true,
          progress: {
            orderBy: { updatedAt: "desc" },
            take: 1,
            select: { updatedAt: true },
          },
        },
      });

      // Filter to those with no activity in 7+ days
      const abandonedUsers = activeUsers.filter((u) => {
        const lastActivity = u.progress[0]?.updatedAt || u.lastLoginAt;
        return lastActivity && new Date(lastActivity) <= sevenDaysAgo;
      });

      results.abandoned.checked = abandonedUsers.length;

      for (const user of abandonedUsers) {
        try {
          const existing = await prisma.sequenceEnrollment.findUnique({
            where: {
              userId_sequenceId: {
                userId: user.id,
                sequenceId: abandonedSequence.id,
              },
            },
          });

          if (!existing) {
            const nextSendAt = new Date(now.getTime() + 15 * 60 * 1000);

            await prisma.sequenceEnrollment.create({
              data: {
                userId: user.id,
                sequenceId: abandonedSequence.id,
                status: "ACTIVE",
                currentEmailIndex: 0,
                nextSendAt,
              },
            });

            await prisma.sequence.update({
              where: { id: abandonedSequence.id },
              data: { totalEnrolled: { increment: 1 } },
            });

            await prisma.userTag.upsert({
              where: { userId_tag: { userId: user.id, tag: "recovery:abandoned" } },
              update: {},
              create: { userId: user.id, tag: "recovery:abandoned" },
            });

            results.abandoned.enrolled++;
            console.log(`[CRON-RECOVERY] Enrolled ${user.email} in abandoned-learning recovery`);
          }
        } catch (err) {
          results.errors++;
          console.error(`[CRON-RECOVERY] Error enrolling ${user.email}:`, err);
        }
      }
    }

    // ============================================
    // EXIT RECOVERY: Check if users should exit
    // ============================================
    // Exit "never logged in" if user logged in
    await exitRecoveryOnAction("never_logged_in", RECOVERY_SEQUENCES.NEVER_LOGGED_IN);
    // Exit "never started" if user has progress
    await exitRecoveryOnProgress(RECOVERY_SEQUENCES.NEVER_STARTED);
    // Exit "abandoned" if user is active again
    await exitRecoveryOnRecentActivity(RECOVERY_SEQUENCES.ABANDONED, 3); // Active in last 3 days

    console.log("[CRON-RECOVERY] Complete:", results);

    return NextResponse.json({
      success: true,
      ...results,
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("[CRON-RECOVERY] Error:", error);
    return NextResponse.json(
      { error: "Failed to check recovery triggers" },
      { status: 500 }
    );
  }
}

/**
 * Exit users from recovery sequence if they logged in
 */
async function exitRecoveryOnAction(tagSuffix: string, sequenceSlug: string) {
  try {
    const sequence = await prisma.sequence.findUnique({
      where: { slug: sequenceSlug },
    });

    if (!sequence) return;

    // Find active enrollments where user has now logged in
    const enrollments = await prisma.sequenceEnrollment.findMany({
      where: {
        sequenceId: sequence.id,
        status: "ACTIVE",
        user: {
          lastLoginAt: { not: null },
        },
      },
      select: {
        id: true,
        userId: true,
      },
    });

    for (const enrollment of enrollments) {
      await prisma.sequenceEnrollment.update({
        where: { id: enrollment.id },
        data: {
          status: "EXITED",
          exitedAt: new Date(),
          exitReason: "User took action (logged in)",
        },
      });

      await prisma.sequence.update({
        where: { id: sequence.id },
        data: { totalExited: { increment: 1 } },
      });

      // Update tag
      await prisma.userTag.upsert({
        where: { userId_tag: { userId: enrollment.userId, tag: `recovery:${tagSuffix}_exited` } },
        update: {},
        create: { userId: enrollment.userId, tag: `recovery:${tagSuffix}_exited` },
      });

      console.log(`[CRON-RECOVERY] User ${enrollment.userId} exited ${sequenceSlug} (logged in)`);
    }
  } catch (err) {
    console.error(`[CRON-RECOVERY] Error exiting ${sequenceSlug}:`, err);
  }
}

/**
 * Exit users from recovery sequence if they have progress
 */
async function exitRecoveryOnProgress(sequenceSlug: string) {
  try {
    const sequence = await prisma.sequence.findUnique({
      where: { slug: sequenceSlug },
    });

    if (!sequence) return;

    // Find active enrollments where user has progress
    const enrollments = await prisma.sequenceEnrollment.findMany({
      where: {
        sequenceId: sequence.id,
        status: "ACTIVE",
        user: {
          progress: {
            some: {},
          },
        },
      },
      select: {
        id: true,
        userId: true,
      },
    });

    for (const enrollment of enrollments) {
      await prisma.sequenceEnrollment.update({
        where: { id: enrollment.id },
        data: {
          status: "EXITED",
          exitedAt: new Date(),
          exitReason: "User started learning",
        },
      });

      await prisma.sequence.update({
        where: { id: sequence.id },
        data: { totalExited: { increment: 1 } },
      });

      await prisma.userTag.upsert({
        where: { userId_tag: { userId: enrollment.userId, tag: "recovery:never_started_exited" } },
        update: {},
        create: { userId: enrollment.userId, tag: "recovery:never_started_exited" },
      });

      console.log(`[CRON-RECOVERY] User ${enrollment.userId} exited ${sequenceSlug} (started learning)`);
    }
  } catch (err) {
    console.error(`[CRON-RECOVERY] Error exiting ${sequenceSlug}:`, err);
  }
}

/**
 * Exit users from recovery sequence if they've been active recently
 */
async function exitRecoveryOnRecentActivity(sequenceSlug: string, daysThreshold: number) {
  try {
    const sequence = await prisma.sequence.findUnique({
      where: { slug: sequenceSlug },
    });

    if (!sequence) return;

    const thresholdDate = new Date(Date.now() - daysThreshold * 24 * 60 * 60 * 1000);

    // Find active enrollments where user has recent activity
    const enrollments = await prisma.sequenceEnrollment.findMany({
      where: {
        sequenceId: sequence.id,
        status: "ACTIVE",
      },
      include: {
        user: {
          select: {
            id: true,
            lastLoginAt: true,
            progress: {
              orderBy: { updatedAt: "desc" },
              take: 1,
              select: { updatedAt: true },
            },
          },
        },
      },
    });

    for (const enrollment of enrollments) {
      const lastActivity =
        enrollment.user.progress[0]?.updatedAt || enrollment.user.lastLoginAt;

      if (lastActivity && new Date(lastActivity) > thresholdDate) {
        await prisma.sequenceEnrollment.update({
          where: { id: enrollment.id },
          data: {
            status: "EXITED",
            exitedAt: new Date(),
            exitReason: "User became active again",
          },
        });

        await prisma.sequence.update({
          where: { id: sequence.id },
          data: { totalExited: { increment: 1 } },
        });

        await prisma.userTag.upsert({
          where: { userId_tag: { userId: enrollment.userId, tag: "recovery:abandoned_exited" } },
          update: {},
          create: { userId: enrollment.userId, tag: "recovery:abandoned_exited" },
        });

        console.log(`[CRON-RECOVERY] User ${enrollment.userId} exited ${sequenceSlug} (became active)`);
      }
    }
  } catch (err) {
    console.error(`[CRON-RECOVERY] Error exiting ${sequenceSlug}:`, err);
  }
}

// Also allow POST for manual testing
export async function POST(request: NextRequest) {
  return GET(request);
}
