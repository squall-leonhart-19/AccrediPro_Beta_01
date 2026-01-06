/**
 * Social Proof Configuration
 * Controls the displayed community numbers for FOMO and social proof
 *
 * HOW IT WORKS:
 * - Base numbers start from LAUNCH_DATE
 * - Total grows by DAILY_GROWTH each day
 * - Live users fluctuate by time of day (peaks during business hours)
 *
 * TO ADJUST:
 * - Change BASE_TOTAL to set starting point
 * - Change DAILY_GROWTH to control growth speed
 * - Change LAUNCH_DATE if resetting counts
 */

// ============ CONFIGURATION ============

// Starting point for total community members
const BASE_TOTAL = 9135;

// How many new members join per day (average)
const DAILY_GROWTH = 18;

// Date when counting started (for calculating days elapsed)
// Format: Year, Month (0-indexed), Day
const LAUNCH_DATE = new Date(2026, 0, 4); // January 4, 2026

// Live user range (fluctuates by time of day)
const LIVE_MIN = 1128;
const LIVE_MAX = 5967;

// Peak hours (when live users are highest) - 24hr format
const PEAK_START = 9;  // 9 AM
const PEAK_END = 21;   // 9 PM

// ============ FUNCTIONS ============

/**
 * Get the current total community count
 * Grows by DAILY_GROWTH each day since LAUNCH_DATE
 */
export function getTotalCommunityCount(): number {
    const now = new Date();
    const daysSinceLaunch = Math.floor(
        (now.getTime() - LAUNCH_DATE.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Add some randomness to daily growth (+/- 5)
    const dailyVariance = Math.floor(Math.random() * 10) - 5;

    return BASE_TOTAL + (daysSinceLaunch * DAILY_GROWTH) + dailyVariance;
}

/**
 * Get the current "live now" user count
 * Fluctuates based on time of day (higher during peak hours)
 */
export function getLiveUserCount(): number {
    const now = new Date();
    const hour = now.getHours();
    const minutes = now.getMinutes();

    // Calculate how "peak" we are (0-1)
    let peakFactor: number;
    if (hour >= PEAK_START && hour < PEAK_END) {
        // During peak hours - higher numbers
        // Peak is highest around noon-2pm
        const peakHour = 13; // 1 PM
        const distanceFromPeak = Math.abs(hour - peakHour);
        peakFactor = 1 - (distanceFromPeak / 12);
    } else {
        // Off-peak hours - lower numbers
        peakFactor = 0.3;
    }

    // Calculate base live count
    const range = LIVE_MAX - LIVE_MIN;
    const baseLive = LIVE_MIN + (range * peakFactor);

    // Add minute-based variation for "realness"
    const minuteVariance = (minutes % 7) * 8 - 28; // -28 to +28

    return Math.floor(baseLive + minuteVariance);
}

/**
 * Get formatted display strings
 */
export function getSocialProofStats() {
    const total = getTotalCommunityCount();
    const live = getLiveUserCount();

    return {
        total,
        live,
        totalFormatted: total.toLocaleString(),
        liveFormatted: live.toLocaleString(),
        // Milestone tracking
        nextMilestone: getNextMilestone(total),
        percentToMilestone: getPercentToMilestone(total),
    };
}

/**
 * Get the next milestone number
 */
function getNextMilestone(current: number): number {
    const milestones = [10000, 15000, 20000, 25000, 50000, 100000];
    return milestones.find(m => m > current) || milestones[milestones.length - 1];
}

/**
 * Get percentage progress to next milestone
 */
function getPercentToMilestone(current: number): number {
    const milestones = [0, 10000, 15000, 20000, 25000, 50000, 100000];
    const nextIndex = milestones.findIndex(m => m > current);
    if (nextIndex <= 0) return 100;

    const prevMilestone = milestones[nextIndex - 1];
    const nextMilestone = milestones[nextIndex];

    return Math.floor(((current - prevMilestone) / (nextMilestone - prevMilestone)) * 100);
}

/**
 * Check if we just crossed a milestone (for celebration)
 */
export function checkMilestone(previousTotal: number, currentTotal: number): number | null {
    const milestones = [10000, 15000, 20000, 25000, 50000, 100000];

    for (const milestone of milestones) {
        if (previousTotal < milestone && currentTotal >= milestone) {
            return milestone;
        }
    }
    return null;
}

/**
 * Get milestone countdown data for display
 * Shows progress toward next milestone with urgency messaging
 */
export function getMilestoneCountdown(): {
    currentTotal: number;
    nextMilestone: number;
    remaining: number;
    percentComplete: number;
    estimatedDaysToMilestone: number;
    urgencyMessage: string;
    celebrationReady: boolean;
} {
    const total = getTotalCommunityCount();
    const next = getNextMilestone(total);
    const remaining = next - total;
    const percent = getPercentToMilestone(total);

    // Estimate days based on daily growth
    const estimatedDays = Math.ceil(remaining / DAILY_GROWTH);

    // Generate urgency message based on proximity
    let urgencyMessage: string;
    if (remaining <= 50) {
        urgencyMessage = `Only ${remaining} spots until we hit ${next.toLocaleString()}! 🎉`;
    } else if (remaining <= 200) {
        urgencyMessage = `Less than ${remaining} to go until ${next.toLocaleString()}!`;
    } else if (remaining <= 500) {
        urgencyMessage = `Almost at ${next.toLocaleString()} members!`;
    } else {
        urgencyMessage = `Growing toward ${next.toLocaleString()} practitioners`;
    }

    // Check if we should show celebration (just crossed or very close)
    const celebrationReady = remaining <= 10;

    return {
        currentTotal: total,
        nextMilestone: next,
        remaining,
        percentComplete: percent,
        estimatedDaysToMilestone: estimatedDays,
        urgencyMessage,
        celebrationReady,
    };
}
