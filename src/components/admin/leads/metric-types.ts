// Shared types for Admin Leads Dashboard
// Used by: overview, niche deep-dive, sources analytics

export interface Lead {
    id: string;
    email: string;
    firstName: string;
    lastName: string | null;
    phone: string | null;
    category: string;
    categoryLabel: string;
    optinDate: string | null;
    completedDate: string | null;
    lessonsCompleted: number;
    progress: number;
    status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETED" | "PAID" | "REFUNDED";
    hasPaid: boolean;
    revenue: number;
    hasRefund: boolean;
    lastActivity: string | null;
    daysSinceOptin: number;
    daysSinceActivity: number;
    isStuck: boolean;
    enrolledCourses: string[];
}

export interface NicheStat {
    slug: string;
    name: string;
    signups: number;
    started: number;
    completed: number;
    paid: number;
    revenue: number;
    startRate: number;
    completionRate: number;
    overallConversion: number;
    paidConversion: number;
    revenuePerLead: number;
    biggestDropoffLesson: number;
    biggestDropoffRate: number;
    dropoffPoints: DropoffPoint[];
}

export interface DropoffPoint {
    lesson: number;
    count: number;
    dropRate: number;
}

export interface WeeklyCohort {
    weekStart: string;
    weekEnd: string;
    label: string;
    signups: number;
    started: number;
    completed: number;
    paid: number;
    revenue: number;
    startRate: number;
    completionRate: number;
    paidConversion: number;
}

export interface WeekOverWeekMetric {
    current: number;
    previous: number;
    delta: number;
    deltaPercent?: number;
}

export interface WeekOverWeek {
    signups: WeekOverWeekMetric;
    startRate: WeekOverWeekMetric;
    completionRate: WeekOverWeekMetric;
    paidConversion: WeekOverWeekMetric;
    revenue: WeekOverWeekMetric;
}

export interface WeeklyTrends {
    labels: string[];
    signups: number[];
    startRate: number[];
    completionRate: number[];
    paidConversion: number[];
    revenue: number[];
}

export interface DashboardSummary {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
}

export interface FunnelData {
    signups: number;
    started: number;
    completed: number;
    paid: number;
    refunded: number;
    stuck: number;
}

export interface RatesData {
    startRate: number;
    completionRate: number;
    overallCompletion: number;
    paidConversion: number;
    refundRate: number;
}

export interface RevenueData {
    total: number;
    avgPerLead: number;
    avgPerPaid: number;
}

export interface BestPerformers {
    byLeads: { name: string; value: number } | null;
    byConversion: { name: string; value: number } | null;
    byRevenue: { name: string; value: number } | null;
}

export interface DailySignup {
    date: string;
    label: string;
    count: number;
}

export interface CategoryOption {
    value: string;
    label: string;
}

// Source attribution types
export interface SourceStat {
    key: string;
    leadSource: string;
    leadSourceDetail: string;
    formVariant: string;
    segment: string;
    signups: number;
    started: number;
    completed: number;
    paid: number;
    revenue: number;
    startRate: number;
    completionRate: number;
    paidConversion: number;
    revenuePerLead: number;
    avgLeadScore: number;
    hotLeads: number;
    warmLeads: number;
    coldLeads: number;
}

export interface SourcesData {
    sources: SourceStat[];
    byVariant: { variant: string; stats: Omit<SourceStat, "key" | "leadSource" | "leadSourceDetail" | "formVariant" | "segment"> }[];
    bySegment: { segment: string; stats: Omit<SourceStat, "key" | "leadSource" | "leadSourceDetail" | "formVariant" | "segment"> }[];
    bySource: { source: string; stats: Omit<SourceStat, "key" | "leadSource" | "leadSourceDetail" | "formVariant" | "segment"> }[];
}

// Overview dashboard response (no leads array)
export interface OverviewData {
    summary: DashboardSummary;
    funnel: FunnelData;
    rates: RatesData;
    revenue: RevenueData;
    nicheStats: NicheStat[];
    bestPerformers: BestPerformers;
    dailySignups: DailySignup[];
    overallDropoff: DropoffPoint[];
    weeklyCohorts: WeeklyCohort[];
    weekOverWeek: WeekOverWeek;
    weeklyTrends: WeeklyTrends;
    categories: CategoryOption[];
}

// Niche deep-dive response
export interface NicheData {
    niche: NicheStat;
    leads: Lead[];
    dailySignups: DailySignup[];
    weeklyTrends: WeeklyTrends;
    weeklyCohorts: WeeklyCohort[];
    stuckLeads: Lead[];
    sourceBreakdown: SourceStat[];
}

// Paginated leads response
export interface PaginatedLeads {
    leads: Lead[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
}

// Helpers
export const STATUS_STYLES: Record<string, string> = {
    NOT_STARTED: "bg-gray-100 text-gray-700",
    IN_PROGRESS: "bg-blue-100 text-blue-700",
    COMPLETED: "bg-amber-100 text-amber-700",
    PAID: "bg-green-100 text-green-700",
    REFUNDED: "bg-red-100 text-red-700",
};

export const STATUS_LABELS: Record<string, string> = {
    NOT_STARTED: "Not Started",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    PAID: "Paid",
    REFUNDED: "Refunded",
};

export const NICHE_COLORS: Record<string, { bg: string; text: string; accent: string }> = {
    "functional-medicine": { bg: "bg-purple-50", text: "text-purple-700", accent: "bg-purple-500" },
    "womens-health": { bg: "bg-pink-50", text: "text-pink-700", accent: "bg-pink-500" },
    "gut-health": { bg: "bg-green-50", text: "text-green-700", accent: "bg-green-500" },
    "hormone-health": { bg: "bg-amber-50", text: "text-amber-700", accent: "bg-amber-500" },
    "holistic-nutrition": { bg: "bg-emerald-50", text: "text-emerald-700", accent: "bg-emerald-500" },
    "nurse-coach": { bg: "bg-blue-50", text: "text-blue-700", accent: "bg-blue-500" },
    "health-coach": { bg: "bg-cyan-50", text: "text-cyan-700", accent: "bg-cyan-500" },
    "womens-hormone-health": { bg: "bg-rose-50", text: "text-rose-700", accent: "bg-rose-500" },
    "fm-healthcare": { bg: "bg-violet-50", text: "text-violet-700", accent: "bg-violet-500" },
    "energy-healing": { bg: "bg-yellow-50", text: "text-yellow-700", accent: "bg-yellow-500" },
    "christian-coaching": { bg: "bg-sky-50", text: "text-sky-700", accent: "bg-sky-500" },
    "reiki-healing": { bg: "bg-teal-50", text: "text-teal-700", accent: "bg-teal-500" },
    "adhd-coaching": { bg: "bg-orange-50", text: "text-orange-700", accent: "bg-orange-500" },
    "pet-nutrition": { bg: "bg-lime-50", text: "text-lime-700", accent: "bg-lime-500" },
    "spiritual-healing": { bg: "bg-indigo-50", text: "text-indigo-700", accent: "bg-indigo-500" },
    "unknown": { bg: "bg-gray-50", text: "text-gray-700", accent: "bg-gray-500" },
};

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

export function formatDate(date: string | null): string {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}

export function getRateColor(rate: number, type: "start" | "completion" | "conversion"): string {
    if (type === "start") {
        if (rate >= 60) return "text-green-600";
        if (rate >= 40) return "text-amber-600";
        return "text-red-600";
    }
    if (type === "completion") {
        if (rate >= 50) return "text-green-600";
        if (rate >= 30) return "text-amber-600";
        return "text-red-600";
    }
    if (rate >= 8) return "text-green-600";
    if (rate >= 4) return "text-amber-600";
    return "text-red-600";
}
