// Sarah Nudge System
// Board-approved: Musk - "Sarah should push, not wait. One action per day."
// Board-approved: Altman - "Sarah is at 10% potential. Double down on AI."

export interface NudgeRule {
  id: string;
  condition: "no_login" | "stuck_lesson" | "stalled_near_completion" | "just_completed" | "streak_risk";
  daysThreshold: number;
  progressThreshold?: number; // For stalled_near_completion
  message: string;
  priority: number; // Higher = more urgent (1-5)
  emoji?: string;
}

export const NUDGE_RULES: NudgeRule[] = [
  // No login nudges (escalating urgency)
  {
    id: "no_login_2d",
    condition: "no_login",
    daysThreshold: 2,
    message: "Hey {{firstName}}! I noticed you haven't been around. Everything okay? Your next lesson is waiting: {{nextLessonTitle}}",
    priority: 1,
    emoji: "👋",
  },
  {
    id: "no_login_5d",
    condition: "no_login",
    daysThreshold: 5,
    message: "I miss you, {{firstName}}! You were making great progress on {{courseName}}. Let's not lose momentum. Just 10 minutes today?",
    priority: 2,
    emoji: "💭",
  },
  {
    id: "no_login_7d",
    condition: "no_login",
    daysThreshold: 7,
    message: "Hey {{firstName}}, I'm getting a bit worried. Is something blocking you? Reply and let me know — I'm here to help you succeed.",
    priority: 3,
    emoji: "🤔",
  },
  {
    id: "no_login_14d",
    condition: "no_login",
    daysThreshold: 14,
    message: "{{firstName}}, it's been two weeks since we last connected. I'm genuinely concerned. What's going on? I'm here to help, not judge.",
    priority: 4,
    emoji: "❤️",
  },

  // Stuck on lesson nudge
  {
    id: "stuck_lesson_3d",
    condition: "stuck_lesson",
    daysThreshold: 3,
    message: "I see you've been on \"{{currentLessonTitle}}\" for a few days. Need help? Ask me anything about it, or feel free to skip ahead if it's not clicking.",
    priority: 2,
    emoji: "🤝",
  },

  // Stalled near completion (most urgent - so close!)
  {
    id: "stalled_near_completion",
    condition: "stalled_near_completion",
    daysThreshold: 3,
    progressThreshold: 75,
    message: "You're SO CLOSE, {{firstName}}! Just {{lessonsRemaining}} lessons to go until you're certified. Let's finish this week!",
    priority: 4,
    emoji: "🔥",
  },
  {
    id: "stalled_near_completion_90",
    condition: "stalled_near_completion",
    daysThreshold: 2,
    progressThreshold: 90,
    message: "{{firstName}}, you're at {{progress}}%! That certification is RIGHT THERE. One more push and you've got it!",
    priority: 5,
    emoji: "🏆",
  },

  // Streak at risk
  {
    id: "streak_risk",
    condition: "streak_risk",
    daysThreshold: 1,
    message: "Don't break your {{streakDays}}-day streak, {{firstName}}! Just one lesson today keeps the momentum going.",
    priority: 3,
    emoji: "⚡",
  },
];

export interface StudentNudgeData {
  id: string;
  firstName: string;
  email: string;
  lastLoginAt: Date | null;
  currentStreak: number;
  enrollments: {
    courseId: string;
    courseName: string;
    progress: number;
    lastProgressAt: Date | null;
    currentLessonTitle: string | null;
    nextLessonTitle: string | null;
    lessonsRemaining: number;
    totalLessons: number;
  }[];
}

export interface NudgeResult {
  studentId: string;
  studentEmail: string;
  ruleId: string;
  message: string;
}

/**
 * Evaluate which nudge (if any) to send to a student
 */
export function evaluateNudge(
  student: StudentNudgeData,
  now: Date = new Date()
): NudgeRule | null {
  const daysSinceLogin = student.lastLoginAt
    ? Math.floor((now.getTime() - student.lastLoginAt.getTime()) / (1000 * 60 * 60 * 24))
    : 999;

  // Get primary enrollment (most recent progress)
  const primaryEnrollment = student.enrollments
    .filter(e => e.progress > 0 && e.progress < 100)
    .sort((a, b) => {
      const aDate = a.lastProgressAt?.getTime() || 0;
      const bDate = b.lastProgressAt?.getTime() || 0;
      return bDate - aDate;
    })[0];

  if (!primaryEnrollment) {
    // No active enrollment, just check login
    const loginRule = NUDGE_RULES
      .filter(r => r.condition === "no_login" && daysSinceLogin >= r.daysThreshold)
      .sort((a, b) => b.priority - a.priority)[0];

    return loginRule || null;
  }

  // Calculate days since last progress
  const daysSinceProgress = primaryEnrollment.lastProgressAt
    ? Math.floor((now.getTime() - primaryEnrollment.lastProgressAt.getTime()) / (1000 * 60 * 60 * 24))
    : daysSinceLogin;

  // Check rules in priority order
  const applicableRules: NudgeRule[] = [];

  for (const rule of NUDGE_RULES) {
    switch (rule.condition) {
      case "no_login":
        if (daysSinceLogin >= rule.daysThreshold) {
          applicableRules.push(rule);
        }
        break;

      case "stuck_lesson":
        if (daysSinceProgress >= rule.daysThreshold && primaryEnrollment.progress < 100) {
          applicableRules.push(rule);
        }
        break;

      case "stalled_near_completion":
        if (
          primaryEnrollment.progress >= (rule.progressThreshold || 75) &&
          daysSinceProgress >= rule.daysThreshold
        ) {
          applicableRules.push(rule);
        }
        break;

      case "streak_risk":
        if (student.currentStreak > 0 && daysSinceLogin === 1) {
          applicableRules.push(rule);
        }
        break;
    }
  }

  // Return highest priority rule
  return applicableRules.sort((a, b) => b.priority - a.priority)[0] || null;
}

/**
 * Fill in message template with student data
 */
export function fillMessageTemplate(
  template: string,
  student: StudentNudgeData,
  enrollment?: StudentNudgeData["enrollments"][0]
): string {
  let message = template;

  // Basic replacements
  message = message.replace(/\{\{firstName\}\}/g, student.firstName || "there");
  message = message.replace(/\{\{streakDays\}\}/g, String(student.currentStreak));

  // Enrollment-specific replacements
  if (enrollment) {
    message = message.replace(/\{\{courseName\}\}/g, enrollment.courseName);
    message = message.replace(/\{\{currentLessonTitle\}\}/g, enrollment.currentLessonTitle || "your current lesson");
    message = message.replace(/\{\{nextLessonTitle\}\}/g, enrollment.nextLessonTitle || "your next lesson");
    message = message.replace(/\{\{lessonsRemaining\}\}/g, String(enrollment.lessonsRemaining));
    message = message.replace(/\{\{progress\}\}/g, String(enrollment.progress));
  }

  return message;
}

/**
 * Get the nudge cooldown period in days for a rule
 * (to avoid spamming the same message type)
 */
export function getNudgeCooldownDays(rule: NudgeRule): number {
  // Higher priority = shorter cooldown (more urgent)
  switch (rule.priority) {
    case 5:
      return 1; // Daily for critical nudges
    case 4:
      return 2;
    case 3:
      return 3;
    case 2:
      return 5;
    default:
      return 7;
  }
}

/**
 * Daily action suggestions based on user state
 * (Musk: "One action per day. Sarah tells them what to do.")
 */
export function getDailyAction(student: StudentNudgeData): {
  action: string;
  description: string;
  href: string;
  estimatedMinutes: number;
} | null {
  const activeEnrollment = student.enrollments.find(e => e.progress > 0 && e.progress < 100);

  if (!activeEnrollment) {
    // No active course - suggest starting
    return {
      action: "Start Learning",
      description: "Begin your certification journey today",
      href: "/my-learning",
      estimatedMinutes: 15,
    };
  }

  if (activeEnrollment.progress >= 90) {
    return {
      action: "Finish Strong",
      description: `Complete "${activeEnrollment.nextLessonTitle}" - just ${activeEnrollment.lessonsRemaining} left!`,
      href: "/my-learning",
      estimatedMinutes: 10,
    };
  }

  if (activeEnrollment.progress >= 50) {
    return {
      action: "Keep Momentum",
      description: `Continue with "${activeEnrollment.nextLessonTitle}"`,
      href: "/my-learning",
      estimatedMinutes: 12,
    };
  }

  return {
    action: "Today's Lesson",
    description: activeEnrollment.nextLessonTitle || "Continue your course",
    href: "/my-learning",
    estimatedMinutes: 15,
  };
}
