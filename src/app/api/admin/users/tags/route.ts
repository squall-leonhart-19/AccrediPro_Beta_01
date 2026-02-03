import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { z } from "zod";
import { sendCourseEnrollmentEmail, sendProAcceleratorEnrollmentEmail, sendDFYWelcomeEmail } from "@/lib/email";
import { verifyEmail } from "@/lib/neverbounce";

const addTagSchema = z.object({
  userId: z.string(),
  tag: z.string().min(1, "Tag is required"),
  value: z.string().optional(),
});

// Tag to Course mapping for automatic enrollment
// Supports single course OR array of courses (for Pro Accelerator bundles)
// NOTE: Tag names are case-insensitive, we normalize them in the mapping check
const TAG_TO_COURSE_SLUG: Record<string, string | string[]> = {
  // FM Main Certification - all variants
  "functional_medicine_complete_certification_purchased": "functional-medicine-complete-certification",
  "fm_certification_purchased": "functional-medicine-complete-certification",
  "fm certification purchased": "functional-medicine-complete-certification",
  "certified functional medicine practitioner purchased": "functional-medicine-complete-certification",
  "clickfunnels_purchase": "functional-medicine-complete-certification", // ClickFunnels webhook tag

  // FM Pro Accelerator Bundle (all 3 courses at once)
  fm_pro_accelerator_purchased: [
    "fm-pro-advanced-clinical",
    "fm-pro-master-depth",
    "fm-pro-practice-path"
  ],
  fm_pro_advanced_clinical_purchased: "fm-pro-advanced-clinical",
  fm_pro_master_depth_purchased: "fm-pro-master-depth",
  fm_pro_practice_path_purchased: "fm-pro-practice-path",

  // Holistic Nutrition
  holistic_nutrition_coach_certification_purchased: "holistic-nutrition-coach-certification",
  hn_certification_purchased: "holistic-nutrition-coach-certification",
  hn_pro_accelerator_purchased: [
    "hn-pro-advanced-clinical",
    "hn-pro-master-depth",
    "hn-pro-practice-path"
  ],

  // NARC Recovery
  narc_recovery_coach_certification_purchased: "narc-recovery-coach-certification",
  narc_certification_purchased: "narc-recovery-coach-certification",
  narc_pro_accelerator_purchased: [
    "narc-pro-advanced-clinical",
    "narc-pro-master-depth",
    "narc-pro-practice-path"
  ],

  // Other certifications as they're added
  christian_life_coach_certification_purchased: "christian-life-coach-certification",
  life_coach_certification_purchased: "life-coach-certification",
  grief_loss_coach_certification_purchased: "grief-loss-coach-certification",
};

// Helper function to enroll user in a course
async function enrollUserInCourse(userId: string, courseSlug: string): Promise<{ success: boolean; courseName?: string; alreadyEnrolled?: boolean }> {
  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
  });

  if (!course) {
    console.error(`Course not found: ${courseSlug}`);
    return { success: false };
  }

  // Check if already enrolled
  const existingEnrollment = await prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: course.id } },
  });

  if (existingEnrollment) {
    return { success: true, courseName: course.title, alreadyEnrolled: true };
  }

  // Create enrollment
  await prisma.enrollment.create({
    data: {
      userId,
      courseId: course.id,
      status: "ACTIVE",
      progress: 0,
    },
  });

  // Update course analytics
  await prisma.courseAnalytics.upsert({
    where: { courseId: course.id },
    update: { totalEnrolled: { increment: 1 } },
    create: { courseId: course.id, totalEnrolled: 1 },
  });

  // Add enrollment tracking tag
  const enrollmentTag = `enrolled_${courseSlug}`;
  await prisma.userTag.upsert({
    where: { userId_tag: { userId, tag: enrollmentTag } },
    update: {},
    create: { userId, tag: enrollmentTag },
  });

  return { success: true, courseName: course.title, alreadyEnrolled: false };
}

// GET - Fetch all unique tags for dropdown (includes UserTags + suggested from leadSource)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get all unique tags from UserTag table
    const tags = await prisma.userTag.findMany({
      select: {
        tag: true,
      },
      distinct: ["tag"],
      orderBy: {
        tag: "asc",
      },
    });

    // Get unique leadSource values to suggest as tags
    const leadSources = await prisma.user.findMany({
      where: {
        leadSource: { not: null },
      },
      select: {
        leadSource: true,
        leadSourceDetail: true,
      },
      distinct: ["leadSource", "leadSourceDetail"],
    });

    // Build suggested tags from leadSource
    const suggestedFromLeadSource: string[] = [];
    for (const ls of leadSources) {
      if (ls.leadSource) {
        suggestedFromLeadSource.push(`source:${ls.leadSource}`);
      }
      if (ls.leadSourceDetail) {
        suggestedFromLeadSource.push(`source:${ls.leadSourceDetail}`);
      }
    }

    // Get MarketingTags
    const marketingTags = await prisma.marketingTag.findMany({
      select: { slug: true },
      distinct: ["slug"],
    });

    // Combine all tags and remove duplicates
    const allTags = [
      ...new Set([
        ...tags.map((t) => t.tag),
        ...marketingTags.map((mt) => mt.slug),
        ...suggestedFromLeadSource,
      ]),
    ].sort();

    return NextResponse.json({
      success: true,
      tags: allTags,
    });
  } catch (error) {
    console.error("Get tags error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tags" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    // Only admins can add tags
    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const data = addTagSchema.parse(body);

    // Check if tag already exists for this user
    const existingTag = await prisma.userTag.findFirst({
      where: {
        userId: data.userId,
        tag: data.tag,
      },
    });

    // For special tags (DFY, mini diploma), still run side effects even if tag exists
    const isDfyTag = data.tag.toLowerCase().startsWith("dfy") || data.tag.toLowerCase().includes("done_for_you") || data.tag.toLowerCase().includes("done for you");
    const isMiniDiplomaTag = data.tag === "fm_free_mini_diploma_lead";
    const isSpecialTag = isDfyTag || isMiniDiplomaTag;

    if (existingTag && !isSpecialTag) {
      return NextResponse.json(
        { error: "This tag already exists for this user" },
        { status: 400 }
      );
    }

    // Create the tag (upsert to handle special tags that may already exist)
    const tag = isSpecialTag
      ? await prisma.userTag.upsert({
          where: { userId_tag: { userId: data.userId, tag: data.tag } },
          update: {},
          create: { userId: data.userId, tag: data.tag, value: data.value || null },
        })
      : await prisma.userTag.create({
          data: {
            userId: data.userId,
            tag: data.tag,
            value: data.value || null,
          },
        });

    // Special tag: fm_free_mini_diploma_lead grants mini-diploma access + enrolls in nurture sequence
    if (data.tag === "fm_free_mini_diploma_lead") {
      await prisma.user.update({
        where: { id: data.userId },
        data: {
          miniDiplomaCategory: "functional-medicine",
          miniDiplomaOptinAt: new Date(),
          leadSource: "admin-tag-grant",
          leadSourceDetail: "fm_free_mini_diploma_lead",
        },
      });

      // Also add related tags for consistency
      const relatedTags = [
        "source:mini-diploma-freebie",
        "source:functional-medicine",
        "mini_diploma_category:functional-medicine",
        "mini_diploma_started",
      ];
      for (const relatedTag of relatedTags) {
        await prisma.userTag.upsert({
          where: { userId_tag: { userId: data.userId, tag: relatedTag } },
          update: {},
          create: { userId: data.userId, tag: relatedTag },
        });
      }

      // Enroll in 30-Day Nurture Sequence
      let nurtureEnrolled = false;
      try {
        const nurtureSequence = await prisma.sequence.findFirst({
          where: {
            OR: [
              { slug: "mini-diploma-nurture" },
              { triggerType: "MINI_DIPLOMA_STARTED" },
            ],
            isActive: true,
          },
        });

        if (nurtureSequence) {
          const existingEnrollment = await prisma.sequenceEnrollment.findUnique({
            where: {
              userId_sequenceId: {
                userId: data.userId,
                sequenceId: nurtureSequence.id,
              },
            },
          });

          if (!existingEnrollment) {
            const nextSendAt = new Date();
            nextSendAt.setHours(nextSendAt.getHours() + 1); // First email 1 hour after tag

            await prisma.sequenceEnrollment.create({
              data: {
                userId: data.userId,
                sequenceId: nurtureSequence.id,
                status: "ACTIVE",
                currentEmailIndex: 0,
                nextSendAt,
              },
            });

            await prisma.sequence.update({
              where: { id: nurtureSequence.id },
              data: { totalEnrolled: { increment: 1 } },
            });

            nurtureEnrolled = true;
          }
        }
      } catch (err) {
        console.error("Error enrolling in nurture sequence:", err);
      }

      return NextResponse.json({
        success: true,
        message: nurtureEnrolled
          ? "Tag added + Mini Diploma access granted + Enrolled in nurture sequence!"
          : "Tag added + Mini Diploma access granted!",
        tag,
        miniDiplomaGranted: true,
        nurtureEnrolled,
      });
    }

    // Special tag: any DFY/done-for-you variant → create DFY purchase + send email + Jessica DM
    if (isDfyTag) {
      const targetUser = await prisma.user.findUnique({
        where: { id: data.userId },
        select: { id: true, email: true, firstName: true },
      });

      let dfyMessage = "Tag added";
      const actions: string[] = [];

      if (targetUser) {
        try {
          // Find or create DFY product
          let dfyProduct = await prisma.dFYProduct.findFirst({
            where: { slug: "dfy-program-ds" },
          });

          if (!dfyProduct) {
            dfyProduct = await prisma.dFYProduct.create({
              data: {
                slug: "dfy-program-ds",
                title: "Done For You Website Package",
                description: "Complete coaching website setup",
                price: 397,
                productType: "CORE_PROGRAM",
                category: "functional-medicine",
                isActive: true,
              },
            });
          }

          // Find Jessica (DFY specialist)
          const jessica = await prisma.user.findFirst({
            where: { email: "jessica@accredipro-certificate.com" },
            select: { id: true },
          });

          // Create DFY purchase record (upsert to avoid duplicates)
          const dfyPurchase = await prisma.dFYPurchase.upsert({
            where: {
              userId_productId: { userId: targetUser.id, productId: dfyProduct.id },
            },
            update: {},
            create: {
              userId: targetUser.id,
              productId: dfyProduct.id,
              purchasePrice: 397,
              status: "COMPLETED",
              fulfillmentStatus: "PENDING",
              assignedToId: jessica?.id || null,
            },
          });
          actions.push("DFY purchase record created");

          // Also add dfy_purchased tag for consistency
          if (data.tag !== "dfy_purchased") {
            await prisma.userTag.upsert({
              where: { userId_tag: { userId: targetUser.id, tag: "dfy_purchased" } },
              update: {},
              create: { userId: targetUser.id, tag: "dfy_purchased" },
            });
            actions.push("dfy_purchased tag added");
          }

          // Send DFY welcome email
          if (targetUser.email) {
            try {
              const intakeUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://learn.accredipro.academy"}/dfy-intake?id=${dfyPurchase.id}`;
              await sendDFYWelcomeEmail({
                to: targetUser.email,
                firstName: targetUser.firstName || "there",
                productName: dfyProduct.title,
                intakeUrl,
              });
              actions.push("DFY welcome email sent");
              console.log(`[Tags API] ✅ DFY welcome email sent to ${targetUser.email}`);
            } catch (emailError) {
              console.error("[Tags API] DFY welcome email failed:", emailError);
            }
          }

          // Send Jessica DM with intake link
          if (jessica) {
            try {
              const intakeUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "https://learn.accredipro.academy"}/dfy-intake?id=${dfyPurchase.id}`;
              await prisma.message.create({
                data: {
                  senderId: jessica.id,
                  receiverId: targetUser.id,
                  content: `Hey ${targetUser.firstName || "there"}! 👋\n\nI'm Jessica, and I'll be personally handling your Done For You website setup! 🎉\n\nTo get started, I just need you to fill out a quick intake form (about 15 minutes). It helps me understand your coaching, your vibe, and exactly how you want your website to look.\n\n👉 Start your intake form here:\n${intakeUrl}\n\nI'll have your website ready within 7 days of receiving your form. Can't wait to build something amazing for you!`,
                  messageType: "DIRECT",
                },
              });
              actions.push("Jessica DM sent");
              console.log(`[Tags API] ✅ Jessica DM sent for DFY to ${targetUser.id}`);
            } catch (dmError) {
              console.error("[Tags API] Jessica DM failed:", dmError);
            }
          }

          dfyMessage = `Tag added + ${actions.join(" + ")}`;
        } catch (dfyError) {
          console.error("[Tags API] DFY processing error:", dfyError);
          dfyMessage = "Tag added (DFY processing had errors - check logs)";
        }
      }

      return NextResponse.json({
        success: true,
        message: dfyMessage,
        tag,
        dfyPurchaseCreated: true,
      });
    }

    // Auto-enrollment for purchase tags (supports single course or bundle)
    // Normalize tag to lowercase for case-insensitive matching
    const normalizedTag = data.tag.toLowerCase().trim();
    const courseMapping = TAG_TO_COURSE_SLUG[normalizedTag] || TAG_TO_COURSE_SLUG[data.tag];
    if (courseMapping) {
      const courseSlugs = Array.isArray(courseMapping) ? courseMapping : [courseMapping];
      const enrolledCourses: string[] = [];
      const isProAccelerator = data.tag.includes('pro_accelerator');

      // Get user info for email
      const targetUser = await prisma.user.findUnique({
        where: { id: data.userId },
        select: { email: true, firstName: true }
      });

      for (const slug of courseSlugs) {
        const enrollResult = await enrollUserInCourse(data.userId, slug);
        if (enrollResult.success && enrollResult.courseName && !enrollResult.alreadyEnrolled) {
          enrolledCourses.push(enrollResult.courseName);
        }
      }

      // Upgrade LEAD to STUDENT if enrolled in a paid course
      if (enrolledCourses.length > 0) {
        try {
          const { upgradeLeadToStudent, isPaidCourseSlug } = await import("@/lib/upgrade-lead-to-student");
          const hasPaidCourse = courseSlugs.some((s: string) => isPaidCourseSlug(s));
          if (hasPaidCourse) {
            const upgradeResult = await upgradeLeadToStudent(data.userId, {
              source: "tag",
            });
            if (upgradeResult.upgraded) {
              console.log(`[Tags API] ✅ LEAD upgraded to STUDENT for user ${data.userId}`);
            }
          }
        } catch (upgradeError) {
          console.error('[Tags API] Lead upgrade failed:', upgradeError);
        }
      }

      // Send enrollment email(s) if user found and courses enrolled
      if (targetUser && targetUser.email && enrolledCourses.length > 0) {
        try {
          const emailCheck = await verifyEmail(targetUser.email);
          if (emailCheck.isValid) {
            if (isProAccelerator) {
              // Determine niche for Pro Accelerator email
              const niche = data.tag.startsWith('hn_') ? 'HN' :
                data.tag.startsWith('narc_') ? 'NARC' : 'FM';
              await sendProAcceleratorEnrollmentEmail(
                targetUser.email,
                targetUser.firstName || 'Student',
                niche
              );
              console.log(`[Tags API] ✅ Pro Accelerator email sent (${niche})`);
            } else {
              // Standard enrollment email
              await sendCourseEnrollmentEmail(
                targetUser.email,
                targetUser.firstName || 'Student',
                enrolledCourses[0],
                courseSlugs[0]
              );
              console.log(`[Tags API] ✅ Enrollment email sent for ${enrolledCourses[0]}`);
            }
          }
        } catch (emailError) {
          console.error('[Tags API] Failed to send enrollment email:', emailError);
        }
      }

      const courseList = enrolledCourses.join(', ');
      const enrollmentMessage = enrolledCourses.length > 0
        ? `Tag added + User enrolled in: ${courseList}!`
        : `Tag added. User was already enrolled in all courses.`;

      return NextResponse.json({
        success: true,
        message: enrollmentMessage,
        tag,
        coursesEnrolled: enrolledCourses,
        emailSent: enrolledCourses.length > 0 && !!targetUser,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Tag added successfully",
      tag,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error("Add tag error:", error);
    return NextResponse.json(
      { error: "Failed to add tag" },
      { status: 500 }
    );
  }
}

// Delete tag endpoint
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const tagId = searchParams.get("tagId");

    if (!tagId) {
      return NextResponse.json({ error: "Tag ID required" }, { status: 400 });
    }

    await prisma.userTag.delete({
      where: { id: tagId },
    });

    return NextResponse.json({
      success: true,
      message: "Tag deleted successfully",
    });
  } catch (error) {
    console.error("Delete tag error:", error);
    return NextResponse.json(
      { error: "Failed to delete tag" },
      { status: 500 }
    );
  }
}
