// Oracle Types - TypeScript definitions for the AI Operations Commander

export type OracleEventType =
    | "login"
    | "logout"
    | "page_view"
    | "lesson_start"
    | "lesson_complete"
    | "module_complete"
    | "course_complete"
    | "quiz_pass"
    | "quiz_fail"
    | "certificate_download"
    | "note_created"
    | "community_post"
    | "community_comment"
    | "dm_sent"
    | "dm_read"
    | "email_sent"
    | "email_open"
    | "email_click"
    | "purchase"
    | "refund"
    | "upgrade"
    | "feedback_given"
    | "referral_shared"
    | "support_ticket";

export type OracleActionType = "email" | "dm" | "push" | "post" | "alert" | "tag";

export type OracleActionStatus = "pending" | "approved" | "executed" | "rejected" | "failed";

export type EngagementLevel = "new" | "active" | "moderate" | "dormant" | "lost";

export type LifecycleStage = "lead" | "new" | "active" | "engaged" | "graduate" | "alumni";

export interface TrackEventParams {
    userId: string;
    event: OracleEventType | string;
    metadata?: Record<string, any>;
    source?: "web" | "email" | "dm" | "api";
    sessionId?: string;
}

export interface CreateActionParams {
    userId: string;
    actionType: OracleActionType;
    content: string;
    subject?: string;
    template?: string;
    priority?: number;
    triggeredBy: string;
    triggerData?: Record<string, any>;
    scheduledAt?: Date;
    metadata?: Record<string, any>;
}

export interface UserAnalysis {
    userId: string;
    segment: {
        engagementLevel: EngagementLevel;
        engagementScore: number;
        churnRisk: number;
        lifecycle: LifecycleStage;
    };
    predictions: {
        completionProb: number;
        upgradeProb: number;
        churnRisk: number;
    };
    recommendations: string[];
    nextBestAction?: {
        type: OracleActionType;
        content: string;
        reasoning: string;
    };
    aiSummary?: string;
}

export interface OracleDashboardStats {
    today: {
        events: number;
        actions: number;
        emails: number;
        dms: number;
    };
    segments: {
        active: number;
        moderate: number;
        dormant: number;
        atRisk: number;
    };
    pendingActions: number;
    recentInsights: number;
}
