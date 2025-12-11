// Workflow Automation Engine
// Handles trigger detection, condition evaluation, and action execution

import prisma from "@/lib/prisma";
import { TriggerType, ActionType, ExecutionStatus } from "@prisma/client";

interface TriggerContext {
  userId: string;
  triggerType: TriggerType;
  data?: Record<string, any>;
}

interface ActionResult {
  success: boolean;
  data?: any;
  error?: string;
}

// ==================== TRIGGER HANDLERS ====================

export async function handleTrigger(context: TriggerContext): Promise<void> {
  const { userId, triggerType, data } = context;

  // Find all active workflows for this trigger
  const workflows = await prisma.workflow.findMany({
    where: {
      triggerType,
      isActive: true,
    },
    include: {
      actions: {
        where: { isActive: true },
        orderBy: { order: "asc" },
      },
      conditions: {
        orderBy: { order: "asc" },
      },
    },
    orderBy: { priority: "desc" },
  });

  // Process each matching workflow
  for (const workflow of workflows) {
    // Check cooldown
    if (workflow.cooldownMinutes > 0) {
      const recentExecution = await prisma.workflowExecution.findFirst({
        where: {
          workflowId: workflow.id,
          userId,
          startedAt: {
            gte: new Date(Date.now() - workflow.cooldownMinutes * 60 * 1000),
          },
        },
      });

      if (recentExecution) {
        console.log(`Workflow ${workflow.name} on cooldown for user ${userId}`);
        continue;
      }
    }

    // Check max executions
    if (workflow.maxExecutions) {
      const executionCount = await prisma.workflowExecution.count({
        where: {
          workflowId: workflow.id,
          userId,
          status: "COMPLETED",
        },
      });

      if (executionCount >= workflow.maxExecutions) {
        console.log(`Workflow ${workflow.name} max executions reached for user ${userId}`);
        continue;
      }
    }

    // Check trigger config matches
    if (!matchesTriggerConfig(workflow.triggerConfig, data)) {
      continue;
    }

    // Evaluate conditions
    const conditionsMet = await evaluateConditions(workflow.conditions, userId);
    if (!conditionsMet) {
      continue;
    }

    // Execute workflow
    await executeWorkflow(workflow, userId, data);
  }
}

function matchesTriggerConfig(config: any, data?: Record<string, any>): boolean {
  if (!config || Object.keys(config).length === 0) {
    return true;
  }

  if (!data) {
    return false;
  }

  // Check each config property
  for (const [key, value] of Object.entries(config)) {
    if (key === "isFirstLesson" && value === true) {
      return data.isFirstLesson === true;
    }
    if (key === "moduleOrder" && data.moduleOrder !== value) {
      return false;
    }
    if (key === "percentage" && data.percentage !== value) {
      return false;
    }
    if (key === "streakDays" && data.streakDays !== value) {
      return false;
    }
    if (key === "days" && data.days !== value) {
      return false;
    }
    if (key === "viewCount" && data.viewCount < (value as number)) {
      return false;
    }
    if (key === "isFirstBadge" && value === true) {
      return data.isFirstBadge === true;
    }
  }

  return true;
}

async function evaluateConditions(
  conditions: any[],
  userId: string
): Promise<boolean> {
  if (!conditions || conditions.length === 0) {
    return true;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      tags: true,
      enrollments: true,
      streak: true,
    },
  });

  if (!user) {
    return false;
  }

  // Get credit profile if needed
  const creditProfile = await prisma.userCreditProfile.findUnique({
    where: { userId },
  });

  let result = true;
  let currentOp: "AND" | "OR" = "AND";

  for (const condition of conditions) {
    const conditionResult = evaluateSingleCondition(condition, user, creditProfile);

    if (currentOp === "AND") {
      result = result && conditionResult;
    } else {
      result = result || conditionResult;
    }

    currentOp = condition.logicalOp || "AND";
  }

  return result;
}

function evaluateSingleCondition(
  condition: any,
  user: any,
  creditProfile: any
): boolean {
  const { field, operator, value } = condition;

  let fieldValue: any;

  // Get field value based on field name
  switch (field) {
    case "creditScore":
      fieldValue = creditProfile?.creditScore;
      break;
    case "creditTier":
      fieldValue = creditProfile?.creditTier;
      break;
    case "role":
      fieldValue = user.role;
      break;
    case "tags":
      fieldValue = user.tags.map((t: any) => t.tag);
      break;
    case "enrollmentCount":
      fieldValue = user.enrollments.length;
      break;
    case "streakDays":
      fieldValue = user.streak?.currentStreak || 0;
      break;
    default:
      fieldValue = user[field];
  }

  // Evaluate based on operator
  switch (operator) {
    case "EQUALS":
      return fieldValue === value;
    case "NOT_EQUALS":
      return fieldValue !== value;
    case "GREATER_THAN":
      return Number(fieldValue) > Number(value);
    case "LESS_THAN":
      return Number(fieldValue) < Number(value);
    case "GREATER_OR_EQUAL":
      return Number(fieldValue) >= Number(value);
    case "LESS_OR_EQUAL":
      return Number(fieldValue) <= Number(value);
    case "CONTAINS":
      return String(fieldValue).includes(value);
    case "HAS_TAG":
      return Array.isArray(fieldValue) && fieldValue.includes(value);
    case "NOT_HAS_TAG":
      return Array.isArray(fieldValue) && !fieldValue.includes(value);
    case "IS_EMPTY":
      return !fieldValue || (Array.isArray(fieldValue) && fieldValue.length === 0);
    case "IS_NOT_EMPTY":
      return !!fieldValue && (!Array.isArray(fieldValue) || fieldValue.length > 0);
    default:
      return true;
  }
}

// ==================== WORKFLOW EXECUTION ====================

async function executeWorkflow(
  workflow: any,
  userId: string,
  triggerData?: Record<string, any>
): Promise<void> {
  // Create execution record
  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId: workflow.id,
      userId,
      status: "RUNNING",
      triggerData: triggerData || {},
    },
  });

  try {
    // Create action execution records
    for (const action of workflow.actions) {
      await prisma.actionExecution.create({
        data: {
          executionId: execution.id,
          actionId: action.id,
          status: action.delayMinutes > 0 ? "WAITING" : "PENDING",
          scheduledFor:
            action.delayMinutes > 0
              ? new Date(Date.now() + action.delayMinutes * 60 * 1000)
              : null,
        },
      });
    }

    // Execute immediate actions
    const immediateActions = workflow.actions.filter((a: any) => a.delayMinutes === 0);

    for (const action of immediateActions) {
      await executeAction(action, userId, execution.id, triggerData);
    }

    // Schedule delayed actions
    const delayedActions = workflow.actions.filter((a: any) => a.delayMinutes > 0);

    for (const action of delayedActions) {
      await prisma.scheduledJob.create({
        data: {
          jobType: "workflow_action",
          referenceId: action.id,
          userId,
          payload: {
            executionId: execution.id,
            actionId: action.id,
            triggerData,
          },
          scheduledFor: new Date(Date.now() + action.delayMinutes * 60 * 1000),
        },
      });
    }

    // Check if all immediate actions completed
    const hasDelayed = delayedActions.length > 0;

    await prisma.workflowExecution.update({
      where: { id: execution.id },
      data: {
        status: hasDelayed ? "WAITING" : "COMPLETED",
        completedAt: hasDelayed ? null : new Date(),
      },
    });
  } catch (error) {
    console.error(`Workflow execution failed: ${workflow.name}`, error);

    await prisma.workflowExecution.update({
      where: { id: execution.id },
      data: {
        status: "FAILED",
        errorMessage: error instanceof Error ? error.message : "Unknown error",
        completedAt: new Date(),
      },
    });
  }
}

// ==================== ACTION EXECUTORS ====================

async function executeAction(
  action: any,
  userId: string,
  executionId: string,
  triggerData?: Record<string, any>
): Promise<ActionResult> {
  const actionExecution = await prisma.actionExecution.findFirst({
    where: {
      executionId,
      actionId: action.id,
    },
  });

  try {
    let result: ActionResult;

    switch (action.actionType) {
      case "SEND_DM":
        result = await executeSendDM(action.config, userId, triggerData);
        break;
      case "SEND_EMAIL":
        result = await executeSendEmail(action.config, userId, triggerData);
        break;
      case "SEND_NOTIFICATION":
        result = await executeSendNotification(action.config, userId, triggerData);
        break;
      case "ADD_TAG":
        result = await executeAddTag(action.config, userId, triggerData);
        break;
      case "REMOVE_TAG":
        result = await executeRemoveTag(action.config, userId);
        break;
      case "AWARD_BADGE":
        result = await executeAwardBadge(action.config, userId);
        break;
      case "ASSIGN_COACH":
        result = await executeAssignCoach(action.config, userId);
        break;
      case "ADD_POINTS":
        result = await executeAddPoints(action.config, userId);
        break;
      default:
        result = { success: true, data: { message: "Action type not implemented yet" } };
    }

    if (actionExecution) {
      await prisma.actionExecution.update({
        where: { id: actionExecution.id },
        data: {
          status: result.success ? "COMPLETED" : "FAILED",
          result: result.data,
          errorMessage: result.error,
          executedAt: new Date(),
        },
      });
    }

    return result;
  } catch (error) {
    console.error(`Action execution failed: ${action.actionType}`, error);

    if (actionExecution) {
      await prisma.actionExecution.update({
        where: { id: actionExecution.id },
        data: {
          status: "FAILED",
          errorMessage: error instanceof Error ? error.message : "Unknown error",
          executedAt: new Date(),
        },
      });
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// ==================== ACTION IMPLEMENTATIONS ====================

async function executeSendDM(
  config: any,
  userId: string,
  triggerData?: Record<string, any>
): Promise<ActionResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { assignedCoach: true },
  });

  if (!user) {
    return { success: false, error: "User not found" };
  }

  // Get message content
  let content = config.content || "";

  // If using template
  if (config.templateSlug) {
    const template = await prisma.messageTemplate.findUnique({
      where: { slug: config.templateSlug },
    });

    if (template) {
      content = template.content;
    }
  }

  // Replace placeholders
  content = replacePlaceholders(content, user, triggerData);

  // Determine sender
  let senderId: string;

  if (config.fromAssignedCoach && user.assignedCoachId) {
    senderId = user.assignedCoachId;
  } else if (config.fromCoachId) {
    senderId = config.fromCoachId;
  } else {
    // Default to first admin
    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN", isActive: true },
    });
    senderId = admin?.id || userId;
  }

  // Create message
  const message = await prisma.message.create({
    data: {
      senderId,
      receiverId: userId,
      content,
      messageType: "SYSTEM",
    },
  });

  return { success: true, data: { messageId: message.id } };
}

async function executeSendEmail(
  config: any,
  userId: string,
  triggerData?: Record<string, any>
): Promise<ActionResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user || !user.email) {
    return { success: false, error: "User or email not found" };
  }

  let subject = config.subject || "Message from AccrediPro";
  let content = config.content || "";

  // If using template
  if (config.templateSlug) {
    const template = await prisma.messageTemplate.findUnique({
      where: { slug: config.templateSlug },
    });

    if (template) {
      subject = template.subject || subject;
      content = template.content;
    }
  }

  // Replace placeholders
  subject = replacePlaceholders(subject, user, triggerData);
  content = replacePlaceholders(content, user, triggerData);

  // TODO: Integrate with actual email service (Resend, SendGrid, etc.)
  console.log(`[EMAIL] To: ${user.email}, Subject: ${subject}`);

  return { success: true, data: { email: user.email, subject } };
}

async function executeSendNotification(
  config: any,
  userId: string,
  triggerData?: Record<string, any>
): Promise<ActionResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return { success: false, error: "User not found" };
  }

  const title = replacePlaceholders(config.title || "Notification", user, triggerData);
  const message = replacePlaceholders(config.message || "", user, triggerData);

  const notification = await prisma.notification.create({
    data: {
      userId,
      type: config.type || "SYSTEM",
      title,
      message,
    },
  });

  return { success: true, data: { notificationId: notification.id } };
}

async function executeAddTag(
  config: any,
  userId: string,
  triggerData?: Record<string, any>
): Promise<ActionResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return { success: false, error: "User not found" };
  }

  let tag = config.tag;

  // If building tag from field
  if (config.tagFromField && triggerData) {
    const fieldValue = user[config.tagFromField as keyof typeof user] || triggerData[config.tagFromField];

    if (Array.isArray(fieldValue)) {
      // Create multiple tags
      for (const value of fieldValue) {
        const fullTag = config.tagPrefix ? `${config.tagPrefix}${value}` : value;
        await prisma.userTag.upsert({
          where: { userId_tag: { userId, tag: fullTag } },
          update: {},
          create: { userId, tag: fullTag },
        });
      }
      return { success: true, data: { tags: fieldValue } };
    } else {
      tag = config.tagPrefix ? `${config.tagPrefix}${fieldValue}` : fieldValue;
    }
  }

  if (!tag) {
    return { success: false, error: "No tag specified" };
  }

  await prisma.userTag.upsert({
    where: { userId_tag: { userId, tag } },
    update: {},
    create: { userId, tag },
  });

  return { success: true, data: { tag } };
}

async function executeRemoveTag(
  config: any,
  userId: string
): Promise<ActionResult> {
  if (!config.tag) {
    return { success: false, error: "No tag specified" };
  }

  await prisma.userTag.deleteMany({
    where: { userId, tag: config.tag },
  });

  return { success: true, data: { tag: config.tag } };
}

async function executeAwardBadge(
  config: any,
  userId: string
): Promise<ActionResult> {
  if (!config.badgeSlug) {
    return { success: false, error: "No badge specified" };
  }

  const badge = await prisma.badge.findUnique({
    where: { slug: config.badgeSlug },
  });

  if (!badge) {
    return { success: false, error: `Badge not found: ${config.badgeSlug}` };
  }

  // Check if user already has badge
  const existing = await prisma.userBadge.findUnique({
    where: { userId_badgeId: { userId, badgeId: badge.id } },
  });

  if (existing) {
    return { success: true, data: { message: "Badge already awarded" } };
  }

  await prisma.userBadge.create({
    data: {
      userId,
      badgeId: badge.id,
    },
  });

  return { success: true, data: { badgeId: badge.id, badgeName: badge.name } };
}

async function executeAssignCoach(
  config: any,
  userId: string
): Promise<ActionResult> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return { success: false, error: "User not found" };
  }

  let coachId: string | null = null;

  if (config.coachId) {
    coachId = config.coachId;
  } else if (config.assignmentRule === "round-robin") {
    // Simple round-robin assignment
    const coaches = await prisma.user.findMany({
      where: { role: { in: ["MENTOR", "INSTRUCTOR"] }, isActive: true },
      include: { _count: { select: { assignedStudents: true } } },
      orderBy: { assignedStudents: { _count: "asc" } },
    });

    if (coaches.length > 0) {
      coachId = coaches[0].id;
    }
  } else if (config.assignmentRule === "by-category") {
    // Assign based on user's focus areas or enrollment category
    // This is simplified - real implementation would be more sophisticated
    const coaches = await prisma.user.findMany({
      where: { role: { in: ["MENTOR", "INSTRUCTOR"] }, isActive: true },
    });

    if (coaches.length > 0) {
      coachId = coaches[Math.floor(Math.random() * coaches.length)].id;
    }
  }

  if (!coachId) {
    return { success: false, error: "No coach available" };
  }

  await prisma.user.update({
    where: { id: userId },
    data: { assignedCoachId: coachId },
  });

  return { success: true, data: { coachId } };
}

async function executeAddPoints(
  config: any,
  userId: string
): Promise<ActionResult> {
  const points = config.points || 0;

  await prisma.userStreak.upsert({
    where: { userId },
    update: {
      totalPoints: { increment: points },
    },
    create: {
      userId,
      totalPoints: points,
    },
  });

  return { success: true, data: { pointsAdded: points } };
}

// ==================== HELPER FUNCTIONS ====================

function replacePlaceholders(
  text: string,
  user: any,
  triggerData?: Record<string, any>
): string {
  const replacements: Record<string, string> = {
    "{firstName}": user.firstName || "there",
    "{lastName}": user.lastName || "",
    "{email}": user.email || "",
    "{courseName}": triggerData?.courseTitle || triggerData?.courseName || "",
    "{courseTitle}": triggerData?.courseTitle || "",
    "{lessonTitle}": triggerData?.lessonTitle || "",
    "{moduleTitle}": triggerData?.moduleTitle || "",
    "{badgeName}": triggerData?.badgeName || "",
    "{streakDays}": String(triggerData?.streakDays || ""),
    "{progress}": String(triggerData?.progress || ""),
    "{challengeName}": triggerData?.challengeName || "",
  };

  let result = text;
  for (const [placeholder, value] of Object.entries(replacements)) {
    result = result.replace(new RegExp(placeholder, "g"), value);
  }

  return result;
}

// ==================== TRIGGER HELPER FUNCTIONS ====================

// Call these from your app when events happen

export async function triggerUserRegistered(userId: string) {
  await handleTrigger({
    userId,
    triggerType: "USER_REGISTERED",
  });
}

export async function triggerFirstLogin(userId: string) {
  await handleTrigger({
    userId,
    triggerType: "USER_FIRST_LOGIN",
  });
}

export async function triggerLessonCompleted(
  userId: string,
  lessonId: string,
  lessonTitle: string,
  courseTitle: string,
  isFirstLesson: boolean = false
) {
  await handleTrigger({
    userId,
    triggerType: "LESSON_COMPLETED",
    data: { lessonId, lessonTitle, courseTitle, isFirstLesson },
  });
}

export async function triggerModuleCompleted(
  userId: string,
  moduleId: string,
  moduleTitle: string,
  moduleOrder: number,
  courseTitle: string
) {
  await handleTrigger({
    userId,
    triggerType: "MODULE_COMPLETED",
    data: { moduleId, moduleTitle, moduleOrder, courseTitle },
  });
}

export async function triggerCourseCompleted(
  userId: string,
  courseId: string,
  courseTitle: string
) {
  await handleTrigger({
    userId,
    triggerType: "COURSE_COMPLETED",
    data: { courseId, courseTitle },
  });
}

export async function triggerBadgeEarned(
  userId: string,
  badgeId: string,
  badgeName: string,
  isFirstBadge: boolean = false
) {
  await handleTrigger({
    userId,
    triggerType: "BADGE_EARNED",
    data: { badgeId, badgeName, isFirstBadge },
  });
}

export async function triggerStreakAchieved(userId: string, streakDays: number) {
  await handleTrigger({
    userId,
    triggerType: "STREAK_ACHIEVED",
    data: { streakDays },
  });
}

export async function triggerInactivity(
  userId: string,
  hours: 24 | 48 | 168
) {
  const triggerType =
    hours === 24
      ? "INACTIVE_24H"
      : hours === 48
        ? "INACTIVE_48H"
        : "INACTIVE_7D";

  await handleTrigger({
    userId,
    triggerType: triggerType as TriggerType,
  });
}

export async function triggerCatalogViewed(userId: string, viewCount: number) {
  await handleTrigger({
    userId,
    triggerType: "CATALOG_VIEWED",
    data: { viewCount },
  });
}

export async function triggerFirstCommunityPost(userId: string, postId: string) {
  await handleTrigger({
    userId,
    triggerType: "FIRST_COMMUNITY_POST",
    data: { postId },
  });
}

export async function triggerProgressMilestone(
  userId: string,
  courseId: string,
  courseTitle: string,
  percentage: number
) {
  await handleTrigger({
    userId,
    triggerType: "PROGRESS_PERCENTAGE",
    data: { courseId, courseTitle, percentage },
  });
}
