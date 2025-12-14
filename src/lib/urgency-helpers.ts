/**
 * Urgency & Scarcity Helpers for Email Sequences
 *
 * These functions help create personalized urgency based on:
 * 1. User's enrollment date (30-day window)
 * 2. Graduate offer deadline (3-day bonus after mini diploma completion)
 * 3. Cohort enrollment windows (if applicable)
 */

/**
 * Calculate days remaining until deadline
 */
export function getDaysRemaining(deadline: Date | null | undefined): number | null {
  if (!deadline) return null;

  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffTime = deadlineDate.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
}

/**
 * Get urgency level based on days remaining
 */
export function getUrgencyLevel(
  daysRemaining: number | null
): "none" | "low" | "medium" | "high" | "critical" {
  if (daysRemaining === null) return "none";
  if (daysRemaining <= 1) return "critical";
  if (daysRemaining <= 3) return "high";
  if (daysRemaining <= 7) return "medium";
  if (daysRemaining <= 14) return "low";
  return "none";
}

/**
 * Get urgency text for email subject lines
 */
export function getUrgencySubjectPrefix(daysRemaining: number | null): string {
  if (daysRemaining === null) return "";
  if (daysRemaining <= 0) return "[FINAL HOURS] ";
  if (daysRemaining === 1) return "[LAST DAY] ";
  if (daysRemaining <= 2) return "[48 HOURS] ";
  if (daysRemaining <= 3) return "[CLOSING SOON] ";
  return "";
}

/**
 * Get urgency text for email content
 */
export function getUrgencyText(daysRemaining: number | null): string {
  if (daysRemaining === null) return "";

  if (daysRemaining <= 0) {
    return `**Enrollment closes TONIGHT at midnight.** This is your last chance.`;
  }
  if (daysRemaining === 1) {
    return `**Only 1 day left.** Enrollment closes tomorrow at midnight.`;
  }
  if (daysRemaining === 2) {
    return `**Just 48 hours remaining.** The door closes in 2 days.`;
  }
  if (daysRemaining === 3) {
    return `**3 days left.** Make your decision before it's too late.`;
  }
  if (daysRemaining <= 7) {
    return `**${daysRemaining} days remaining** until enrollment closes.`;
  }
  return "";
}

/**
 * Get bonus expiration text
 */
export function getBonusExpirationText(
  daysRemaining: number | null,
  bonusName: string = "exclusive bonuses"
): string {
  if (daysRemaining === null) return "";

  if (daysRemaining <= 0) {
    return `Your ${bonusName} expire TONIGHT.`;
  }
  if (daysRemaining === 1) {
    return `Your ${bonusName} expire tomorrow.`;
  }
  if (daysRemaining <= 3) {
    return `Your ${bonusName} expire in ${daysRemaining} days.`;
  }
  return "";
}

/**
 * Calculate user's sequence day based on enrollment
 */
export function getSequenceDay(enrolledAt: Date | string): number {
  const enrolled = new Date(enrolledAt);
  const now = new Date();
  const diffTime = now.getTime() - enrolled.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Get the enrollment deadline (30 days from sequence enrollment)
 */
export function getEnrollmentDeadline(enrolledAt: Date | string): Date {
  const enrolled = new Date(enrolledAt);
  return new Date(enrolled.getTime() + 30 * 24 * 60 * 60 * 1000);
}

/**
 * Check if user should receive urgency messaging
 */
export function shouldShowUrgency(sequenceDay: number): boolean {
  // Start urgency messaging from day 22 onwards
  return sequenceDay >= 22;
}

/**
 * Get cohort info for social proof
 */
export function getCohortInfo(): {
  cohortName: string;
  spotsRemaining: number;
  nextCohortDate: string;
} {
  // This could be dynamic based on actual enrollment data
  // For now, return static values that create urgency
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  return {
    cohortName: `${now.toLocaleString("default", { month: "long" })} Cohort`,
    spotsRemaining: Math.floor(Math.random() * 10) + 5, // 5-15 spots
    nextCohortDate: nextMonth.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
    }),
  };
}

/**
 * Replace urgency placeholders in email content
 */
export function replaceUrgencyPlaceholders(
  content: string,
  user: {
    sequenceEnrolledAt?: Date | string | null;
    graduateOfferDeadline?: Date | null;
  }
): string {
  let result = content;

  // Calculate days remaining for sequence deadline (30 days)
  if (user.sequenceEnrolledAt) {
    const deadline = getEnrollmentDeadline(user.sequenceEnrolledAt);
    const daysRemaining = getDaysRemaining(deadline);

    result = result.replace(/\{\{DAYS_REMAINING\}\}/g, String(daysRemaining || ""));
    result = result.replace(/\{\{URGENCY_TEXT\}\}/g, getUrgencyText(daysRemaining));
    result = result.replace(
      /\{\{URGENCY_PREFIX\}\}/g,
      getUrgencySubjectPrefix(daysRemaining)
    );
  }

  // Calculate graduate offer deadline (3-day bonus)
  if (user.graduateOfferDeadline) {
    const daysRemaining = getDaysRemaining(user.graduateOfferDeadline);

    result = result.replace(
      /\{\{GRADUATE_DAYS_REMAINING\}\}/g,
      String(daysRemaining || "")
    );
    result = result.replace(
      /\{\{GRADUATE_URGENCY\}\}/g,
      getBonusExpirationText(daysRemaining, "20% graduate discount")
    );
  }

  // Cohort info
  const cohortInfo = getCohortInfo();
  result = result.replace(/\{\{COHORT_NAME\}\}/g, cohortInfo.cohortName);
  result = result.replace(
    /\{\{SPOTS_REMAINING\}\}/g,
    String(cohortInfo.spotsRemaining)
  );
  result = result.replace(/\{\{NEXT_COHORT_DATE\}\}/g, cohortInfo.nextCohortDate);

  return result;
}
