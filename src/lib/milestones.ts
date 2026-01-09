// Milestone definitions for student progress celebrations
// Board-approved: Bezos - "Silent progress = no dopamine = dropout"

export interface Milestone {
  threshold: number;
  type: "lessons" | "percent";
  message: string;
  badge: string | null;
  emoji: string;
}

export const MILESTONES: Milestone[] = [
  {
    threshold: 1,
    type: "lessons",
    message: "Great start! You completed your first lesson!",
    badge: "first_step",
    emoji: "🎉",
  },
  {
    threshold: 5,
    type: "lessons",
    message: "5 lessons done! You're building momentum.",
    badge: "quick_starter",
    emoji: "🚀",
  },
  {
    threshold: 10,
    type: "lessons",
    message: "10 lessons complete! You're dedicated.",
    badge: "dedicated_learner",
    emoji: "💪",
  },
  {
    threshold: 25,
    type: "percent",
    message: "25% complete! You're ahead of most who start.",
    badge: null,
    emoji: "📈",
  },
  {
    threshold: 50,
    type: "percent",
    message: "HALFWAY THERE! You're in the top 40% of students.",
    badge: "halfway_hero",
    emoji: "🔥",
  },
  {
    threshold: 75,
    type: "percent",
    message: "75% complete! The finish line is in sight.",
    badge: null,
    emoji: "🏃",
  },
  {
    threshold: 100,
    type: "percent",
    message: "YOU DID IT! You're officially certified.",
    badge: "certified",
    emoji: "🏆",
  },
];

// Lesson count milestones (separate from percentage)
export const LESSON_MILESTONES = MILESTONES.filter(m => m.type === "lessons");
export const PERCENT_MILESTONES = MILESTONES.filter(m => m.type === "percent");

/**
 * Check if user hit a new milestone
 * @param completedLessons - Number of lessons completed
 * @param totalLessons - Total lessons in course
 * @param previouslyAwarded - Array of milestone IDs already awarded
 * @returns The milestone object if a new one was hit, null otherwise
 */
export function checkMilestone(
  completedLessons: number,
  totalLessons: number,
  previouslyAwarded: string[]
): Milestone | null {
  const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // Check milestones in order (lowest first)
  for (const milestone of MILESTONES) {
    const milestoneId = `${milestone.type}_${milestone.threshold}`;
    const value = milestone.type === "lessons" ? completedLessons : percent;

    if (value >= milestone.threshold && !previouslyAwarded.includes(milestoneId)) {
      return milestone;
    }
  }

  return null;
}

/**
 * Get the milestone ID for storing in database
 */
export function getMilestoneId(milestone: Milestone): string {
  return `${milestone.type}_${milestone.threshold}`;
}

/**
 * Get all milestones that should have been awarded by now
 * (for catching up users who started before milestone system)
 */
export function getAllEarnedMilestones(
  completedLessons: number,
  totalLessons: number
): Milestone[] {
  const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return MILESTONES.filter(milestone => {
    const value = milestone.type === "lessons" ? completedLessons : percent;
    return value >= milestone.threshold;
  });
}

/**
 * Get the next upcoming milestone
 */
export function getNextMilestone(
  completedLessons: number,
  totalLessons: number
): { milestone: Milestone; remaining: number } | null {
  const percent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  for (const milestone of MILESTONES) {
    const value = milestone.type === "lessons" ? completedLessons : percent;

    if (value < milestone.threshold) {
      const remaining = milestone.type === "lessons"
        ? milestone.threshold - completedLessons
        : Math.ceil(((milestone.threshold - percent) / 100) * totalLessons);

      return { milestone, remaining };
    }
  }

  return null;
}
