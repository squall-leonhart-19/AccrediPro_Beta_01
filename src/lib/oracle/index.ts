// Oracle - AI Operations Commander
// Main exports

export * from "./types";
export * from "./observer";
export * from "./classifier";
export * from "./rules-engine";
export * from "./executor";
export * from "./ai-client";
export * from "./track";

// Re-export common functions for convenience
export { trackEvent, getUserEvents, ORACLE_EVENTS } from "./observer";
export { EVENTS, trackEvent as track, getActivityFeed } from "./track";
export { classifyUser, classifyAllUsers, getAtRiskUsers } from "./classifier";
export { evaluateRule, evaluateAllRules, createRule } from "./rules-engine";
export { executeAction, executeApprovedActions } from "./executor";
export { generateMessage, analyzeUser, generateWeeklyReport } from "./ai-client";



