"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Users,
    UserCheck,
    GraduationCap,
    DollarSign,
    Target,
    Zap,
    RefreshCw,
    Download,
    Clock,
    AlertTriangle,
    Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardHeader } from "@/components/admin/leads/dashboard-header";
import { StatCard } from "@/components/admin/leads/stat-card";
import { StatGrid } from "@/components/admin/leads/stat-grid";
import { FunnelChart } from "@/components/admin/leads/funnel-chart";
import { DropoffChart } from "@/components/admin/leads/dropoff-chart";
import { BarChartSimple } from "@/components/admin/leads/bar-chart-simple";
import { LeadsTable } from "@/components/admin/leads/leads-table";
import {
    type NicheData,
    type Lead,
    type NicheStat,
    type SourceStat,
    formatCurrency,
    formatDate,
    getRateColor,
    NICHE_COLORS,
} from "@/components/admin/leads/metric-types";

interface NicheDeepDiveProps {
    niche: string;
}

export default function NicheDeepDive({ niche }: NicheDeepDiveProps) {
    const [data, setData] = useState<NicheData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [dateRange, setDateRange] = useState("all");

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(false);
        try {
            const res = await fetch(`/api/admin/leads-dashboard/niche?slug=${niche}&range=${dateRange}`);
            if (res.ok) {
                const result = await res.json();
                setData(result);
            } else {
                setError(true);
            }
        } catch {
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [niche, dateRange]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const exportCSV = () => {
        if (!data) return;
        const csv = [
            ["Email", "First Name", "Last Name", "Phone", "Optin Date", "Lessons", "Progress", "Status", "Revenue", "Courses"].join(","),
            ...data.leads.map((lead) =>
                [
                    lead.email,
                    lead.firstName,
                    lead.lastName || "",
                    lead.phone || "",
                    lead.optinDate || "",
                    lead.lessonsCompleted,
                    `${lead.progress}%`,
                    lead.status,
                    lead.revenue > 0 ? `$${lead.revenue}` : "",
                    lead.enrolledCourses.join("; "),
                ].join(",")
            ),
        ].join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `leads-${niche}-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <RefreshCw className="w-10 h-10 animate-spin text-[#722f37] mx-auto mb-4" />
                    <p className="text-gray-500">Loading niche analytics...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="text-center py-12">
                <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">Failed to load niche data</p>
                <Button onClick={fetchData}>Retry</Button>
            </div>
        );
    }

    const { niche: nicheStats, leads, dailySignups, stuckLeads, sourceBreakdown } = data;

    const funnelStages = [
        { label: "Signups", value: nicheStats.signups, pct: 100, color: "bg-blue-500", icon: Users },
        { label: "Started Lessons", value: nicheStats.started, pct: nicheStats.startRate, color: "bg-purple-500", icon: Zap },
        { label: "Completed Mini Diploma", value: nicheStats.completed, pct: nicheStats.signups > 0 ? Math.round((nicheStats.completed / nicheStats.signups) * 100) : 0, color: "bg-amber-500", icon: GraduationCap },
        { label: "Paid for Certification", value: nicheStats.paid, pct: nicheStats.paidConversion, color: "bg-green-500", icon: DollarSign },
    ];

    const funnelBetweenLabels = [
        `${nicheStats.startRate}% start lessons`,
        `${nicheStats.completionRate}% of starters complete`,
        `${nicheStats.completed > 0 ? Math.round((nicheStats.paid / nicheStats.completed) * 100) : 0}% of completers purchase`,
    ];

    return (
        <div className="space-y-6">
            {/* Header */}
            <DashboardHeader
                title={nicheStats.name}
                subtitle="Mini Diploma Performance & Analytics"
                breadcrumbs={[
                    { label: "Leads", href: "/admin/leads" },
                    { label: nicheStats.name },
                ]}
                actions={
                    <>
                        <Button
                            variant="outline"
                            className="!bg-transparent !border-white/40 !text-white hover:!bg-white/10"
                            onClick={exportCSV}
                        >
                            <Download className="w-4 h-4 mr-2" />
                            Export CSV
                        </Button>
                        <Button
                            variant="outline"
                            className="!bg-transparent !border-white/40 !text-white hover:!bg-white/10"
                            onClick={fetchData}
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Refresh
                        </Button>
                    </>
                }
                filters={
                    <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-full sm:w-[180px] bg-white/10 border-white/20 text-white">
                            <Calendar className="w-4 h-4 mr-2" />
                            <SelectValue placeholder="All Time" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Time</SelectItem>
                            <SelectItem value="today">Today</SelectItem>
                            <SelectItem value="week">Last 7 Days</SelectItem>
                            <SelectItem value="month">This Month</SelectItem>
                            <SelectItem value="90days">Last 90 Days</SelectItem>
                        </SelectContent>
                    </Select>
                }
            />

            {/* Hero Stats */}
            <StatGrid cols={4}>
                <StatCard
                    label="Total Leads"
                    value={nicheStats.signups}
                    icon={Users}
                    color="blue"
                    gradient
                    subtitle={`${formatCurrency(nicheStats.revenuePerLead)} per lead`}
                />
                <StatCard
                    label="Start Rate"
                    value={`${nicheStats.startRate}%`}
                    icon={Zap}
                    color="purple"
                    gradient
                    subtitle={`${nicheStats.started} of ${nicheStats.signups} started`}
                />
                <StatCard
                    label="Completion Rate"
                    value={`${nicheStats.completionRate}%`}
                    icon={GraduationCap}
                    color="amber"
                    gradient
                    subtitle={`${nicheStats.completed} completed`}
                />
                <StatCard
                    label="Paid Conversion"
                    value={`${nicheStats.paidConversion}%`}
                    icon={DollarSign}
                    color="green"
                    gradient
                    subtitle={`${formatCurrency(nicheStats.revenue)} total revenue`}
                />
            </StatGrid>

            {/* Funnel */}
            <FunnelChart
                stages={funnelStages}
                betweenLabels={funnelBetweenLabels}
                title={`${nicheStats.name} Funnel`}
                description="Lead journey from signup to paid enrollment"
            />

            {/* Lesson Drop-off */}
            {nicheStats.dropoffPoints && nicheStats.dropoffPoints.length > 0 && (
                <DropoffChart
                    lessons={nicheStats.dropoffPoints}
                    title="Lesson Drop-off Analysis"
                    description={`Where ${nicheStats.name} leads leave the mini diploma`}
                />
            )}

            {/* Stuck Leads Alert */}
            {stuckLeads.length > 0 && (
                <Card className="border-amber-300 bg-amber-50/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-amber-700">
                            <AlertTriangle className="w-5 h-5 text-amber-500" />
                            {stuckLeads.length} Stuck Lead{stuckLeads.length !== 1 ? "s" : ""}
                        </CardTitle>
                        <CardDescription>
                            Leads with no activity in 7+ days who haven't completed
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {stuckLeads.map((lead) => (
                                <div
                                    key={lead.id}
                                    className="flex items-center gap-3 p-3 bg-white rounded-lg border border-amber-200"
                                >
                                    <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-medium truncate">
                                            {lead.firstName} {lead.lastName}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">{lead.email}</p>
                                        <p className="text-xs text-amber-600">
                                            {lead.lessonsCompleted}/3 lessons &middot; {lead.daysSinceActivity}d inactive
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Source Breakdown */}
            {sourceBreakdown && sourceBreakdown.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Target className="w-5 h-5 text-[#722f37]" />
                            Lead Sources
                        </CardTitle>
                        <CardDescription>Performance breakdown by acquisition source</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto -mx-6 px-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Entry Point</TableHead>
                                        <TableHead className="text-center">Leads</TableHead>
                                        <TableHead className="text-center">Start %</TableHead>
                                        <TableHead className="text-center">Complete %</TableHead>
                                        <TableHead className="text-center">Paid %</TableHead>
                                        <TableHead className="text-center">Avg Score</TableHead>
                                        <TableHead className="text-center">Hot</TableHead>
                                        <TableHead className="text-center">Warm</TableHead>
                                        <TableHead className="text-center">Cold</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {sourceBreakdown.map((src) => (
                                        <TableRow key={src.key}>
                                            <TableCell>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-medium truncate">
                                                        {src.leadSource || "Direct"}
                                                        {src.formVariant && (
                                                            <span className="text-gray-400"> | {src.formVariant}</span>
                                                        )}
                                                    </p>
                                                    {src.segment && (
                                                        <p className="text-xs text-gray-500">{src.segment}</p>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center font-bold">{src.signups}</TableCell>
                                            <TableCell className="text-center">
                                                <span className={getRateColor(src.startRate, "start")}>{src.startRate}%</span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <span className={getRateColor(src.completionRate, "completion")}>{src.completionRate}%</span>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge className={cn(
                                                    "text-xs",
                                                    src.paidConversion >= 8 ? "bg-green-500" :
                                                    src.paidConversion >= 4 ? "bg-amber-500" :
                                                    "bg-gray-300"
                                                )}>
                                                    {src.paidConversion}%
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center text-sm">{src.avgLeadScore}</TableCell>
                                            <TableCell className="text-center">
                                                <Badge className="bg-red-100 text-red-700 text-xs">{src.hotLeads}</Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge className="bg-amber-100 text-amber-700 text-xs">{src.warmLeads}</Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge className="bg-blue-100 text-blue-700 text-xs">{src.coldLeads}</Badge>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Daily Signups */}
            {dailySignups && dailySignups.length > 0 && (
                <BarChartSimple
                    data={dailySignups.map((d) => ({ label: d.label, value: d.count }))}
                    title="Daily Signups (Last 14 Days)"
                    description={`New ${nicheStats.name} leads per day`}
                    icon={Calendar}
                    iconColor="text-blue-600"
                    formatValue={(v) => String(v)}
                />
            )}

            {/* All Leads */}
            <LeadsTable
                leads={leads}
                showNicheColumn={false}
                title={`${leads.length} ${nicheStats.name} Leads`}
                description="All leads in this niche"
            />
        </div>
    );
}
