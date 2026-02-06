"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  UserCheck,
  GraduationCap,
  TrendingUp,
  DollarSign,
  Target,
  RefreshCw,
  Download,
  ExternalLink,
  Trophy,
  Award,
  BarChart3,
  AlertTriangle,
  Filter,
  Calendar,
  Clock,
  Zap,
  Mail,
  Link2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardHeader } from "@/components/admin/leads/dashboard-header";
import { StatCard } from "@/components/admin/leads/stat-card";
import { StatGrid } from "@/components/admin/leads/stat-grid";
import { FunnelChart } from "@/components/admin/leads/funnel-chart";
import { DropoffChart } from "@/components/admin/leads/dropoff-chart";
import { BarChartSimple } from "@/components/admin/leads/bar-chart-simple";
import { LeadsTable } from "@/components/admin/leads/leads-table";
import { NicheCard } from "@/components/admin/leads/niche-card";
import {
  type OverviewData,
  type Lead,
  type PaginatedLeads,
  formatCurrency,
  formatDate,
  getRateColor,
} from "@/components/admin/leads/metric-types";

const TAB_OPTIONS = [
  { value: "funnel", label: "Funnel" },
  { value: "weekly", label: "Weekly" },
  { value: "trends", label: "Trends" },
  { value: "niche", label: "By Niche" },
  { value: "leads", label: "All Leads" },
  { value: "revenue", label: "Revenue" },
];

export default function LeadsOverview() {
  const [data, setData] = useState<OverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [activeTab, setActiveTab] = useState("funnel");
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoaded, setLeadsLoaded] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (categoryFilter !== "all") params.set("category", categoryFilter);
      if (dateRange !== "all") params.set("range", dateRange);
      const res = await fetch(`/api/admin/leads-dashboard?${params.toString()}`);
      if (res.ok) setData(await res.json());
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }, [categoryFilter, dateRange]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Lazy-load leads when the All Leads tab is selected
  useEffect(() => {
    if (activeTab !== "leads" || leadsLoaded) return;
    (async () => {
      try {
        const params = new URLSearchParams({ page: "1", limit: "50" });
        if (categoryFilter !== "all") params.set("category", categoryFilter);
        if (dateRange !== "all") params.set("range", dateRange);
        const res = await fetch(`/api/admin/leads-dashboard/leads?${params.toString()}`);
        if (res.ok) {
          const json: PaginatedLeads = await res.json();
          setLeads(json.leads);
        }
      } catch (err) {
        console.error("Failed to fetch leads:", err);
      } finally {
        setLeadsLoaded(true);
      }
    })();
  }, [activeTab, leadsLoaded, categoryFilter, dateRange]);

  // Reset leads when filters change
  useEffect(() => { setLeadsLoaded(false); }, [categoryFilter, dateRange]);

  const exportCSV = () => {
    if (!leads.length) return;
    const rows = [
      ["Email", "First Name", "Last Name", "Phone", "Category", "Optin Date", "Lessons", "Progress", "Status", "Revenue", "Courses"].join(","),
      ...leads.map((l) =>
        [l.email, l.firstName, l.lastName || "", l.phone || "", l.categoryLabel, l.optinDate || "", l.lessonsCompleted, `${l.progress}%`, l.status, l.revenue > 0 ? `$${l.revenue}` : "", l.enrolledCourses.join("; ")].join(",")
      ),
    ].join("\n");
    const blob = new Blob([rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  // ── Loading / Error ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <RefreshCw className="w-10 h-10 animate-spin text-[#722f37] mx-auto mb-4" />
          <p className="text-gray-500">Loading lead intelligence...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
        <p className="text-gray-500 mb-4">Failed to load dashboard data</p>
        <Button onClick={fetchData}>Retry</Button>
      </div>
    );
  }

  const { summary, funnel, rates, revenue, bestPerformers, weekOverWeek: wow, nicheStats, dailySignups, overallDropoff, weeklyCohorts, weeklyTrends } = data;

  // ── Funnel stages for FunnelChart ──────────────────────────────────
  const funnelStages = [
    { label: "Signups", value: funnel.signups, pct: 100, color: "bg-blue-500", icon: Users },
    { label: "Started", value: funnel.started, pct: funnel.signups ? Math.round((funnel.started / funnel.signups) * 100) : 0, color: "bg-amber-500", icon: Zap },
    { label: "Completed", value: funnel.completed, pct: funnel.signups ? Math.round((funnel.completed / funnel.signups) * 100) : 0, color: "bg-green-500", icon: GraduationCap },
    { label: "Paid", value: funnel.paid, pct: funnel.signups ? Math.round((funnel.paid / funnel.signups) * 100) : 0, color: "bg-purple-500", icon: DollarSign },
  ];
  const funnelBetween = [
    `${rates.startRate}% start rate`,
    `${rates.completionRate}% completion rate`,
    `${rates.paidConversion}% paid conversion`,
  ];

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <div className="space-y-6">
      {/* Header */}
      <DashboardHeader
        title="Lead Intelligence Dashboard"
        subtitle="Mini Diploma Funnel Analytics & Performance"
        actions={
          <>
            <Link href="/admin/leads/sources">
              <Button variant="outline" className="!bg-transparent !border-white/40 !text-white hover:!bg-white/10">
                <Link2 className="w-4 h-4 mr-2" />Sources
              </Button>
            </Link>
            <Link href="/admin/leads/sequences">
              <Button variant="outline" className="!bg-transparent !border-white/40 !text-white hover:!bg-white/10">
                <Mail className="w-4 h-4 mr-2" />Sequences
              </Button>
            </Link>
            <Button variant="outline" className="!bg-transparent !border-white/40 !text-white hover:!bg-white/10" onClick={exportCSV}>
              <Download className="w-4 h-4 mr-2" />Export
            </Button>
            <Button className="bg-[#C9A227] hover:bg-[#b8922a] text-[#4e1f24] font-semibold" onClick={fetchData}>
              <RefreshCw className="w-4 h-4 mr-2" />Refresh
            </Button>
          </>
        }
        filters={
          <>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[200px] bg-white/10 border-white/20 text-white">
                <Filter className="w-4 h-4 mr-2" /><SelectValue placeholder="All Niches" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Niches</SelectItem>
                {data.categories.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-full sm:w-[180px] bg-white/10 border-white/20 text-white">
                <Calendar className="w-4 h-4 mr-2" /><SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">Last 7 Days</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="90days">Last 90 Days</SelectItem>
              </SelectContent>
            </Select>
          </>
        }
      />

      {/* Hero Stats */}
      <StatGrid cols={4}>
        <StatCard label="Total Revenue" value={formatCurrency(revenue.total)} icon={DollarSign} color="green" gradient delta={{ value: wow?.revenue.deltaPercent || 0, isPercent: true, suffix: " vs LW" }} subtitle={`${funnel.paid} paid conversions`} />
        <StatCard label="Paid Conversion" value={`${rates.paidConversion}%`} icon={Target} color="purple" gradient delta={{ value: wow?.paidConversion.delta || 0, suffix: "pp" }} subtitle={`of ${funnel.signups} leads`} />
        <StatCard label="Completion Rate" value={`${rates.completionRate}%`} icon={GraduationCap} delta={{ value: wow?.completionRate.delta || 0, suffix: "pp" }} subtitle={`${funnel.completed} of ${funnel.started} starters`} />
        <StatCard label="Start Rate" value={`${rates.startRate}%`} icon={UserCheck} delta={{ value: wow?.startRate.delta || 0, suffix: "pp" }} subtitle={`${funnel.started} of ${funnel.signups} signups`} />
      </StatGrid>

      {/* Quick Stats */}
      <StatGrid cols={5}>
        <StatCard label="Total Leads" value={summary.total} icon={Users} />
        <StatCard label="Today" value={summary.today} icon={TrendingUp} color="blue" />
        <StatCard label="This Week" value={summary.thisWeek} icon={BarChart3} />
        <StatCard label="Stuck Users" value={funnel.stuck} icon={Clock} color="amber" subtitle="No activity 5+ days" />
        <StatCard label="Refund Rate" value={`${rates.refundRate}%`} icon={AlertTriangle} color="red" subtitle={`${funnel.refunded} refunds`} />
      </StatGrid>

      {/* Best Performers */}
      {(bestPerformers.byLeads || bestPerformers.byConversion || bestPerformers.byRevenue) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
          {bestPerformers.byLeads && (
            <Card className="border-amber-200 bg-amber-50/50">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  <p className="text-sm text-amber-600 font-medium">Most Leads</p>
                </div>
                <p className="text-lg font-bold truncate">{bestPerformers.byLeads.name}</p>
                <p className="text-sm text-amber-600">{bestPerformers.byLeads.value} leads</p>
              </CardContent>
            </Card>
          )}
          {bestPerformers.byConversion && (
            <Card className="border-green-200 bg-green-50/50">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <Award className="w-4 h-4 text-green-500" />
                  <p className="text-sm text-green-600 font-medium">Best Conversion</p>
                </div>
                <p className="text-lg font-bold truncate">{bestPerformers.byConversion.name}</p>
                <p className="text-sm text-green-600">{bestPerformers.byConversion.value}% paid</p>
              </CardContent>
            </Card>
          )}
          {bestPerformers.byRevenue && (
            <Card className="border-purple-200 bg-purple-50/50">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center gap-2 mb-1">
                  <DollarSign className="w-4 h-4 text-purple-500" />
                  <p className="text-sm text-purple-600 font-medium">Top Revenue</p>
                </div>
                <p className="text-lg font-bold truncate">{bestPerformers.byRevenue.name}</p>
                <p className="text-sm text-purple-600">{formatCurrency(bestPerformers.byRevenue.value)}</p>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {/* Mobile: Select dropdown */}
        <div className="sm:hidden">
          <Select value={activeTab} onValueChange={setActiveTab}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TAB_OPTIONS.map((t) => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        {/* Desktop: TabsList */}
        <TabsList className="hidden sm:grid grid-cols-6 w-full">
          {TAB_OPTIONS.map((t) => <TabsTrigger key={t.value} value={t.value}>{t.label}</TabsTrigger>)}
        </TabsList>

        {/* ── Funnel Tab ─────────────────────────────────────────── */}
        <TabsContent value="funnel" className="space-y-6 mt-4">
          <FunnelChart stages={funnelStages} betweenLabels={funnelBetween} />
          <DropoffChart lessons={overallDropoff} />
          <BarChartSimple
            data={dailySignups.map((d) => ({ label: d.label, value: d.count }))}
            title="Daily Signups (Last 30 Days)"
            description="New leads per day"
            icon={BarChart3}
            iconColor="text-[#722f37]"
          />
        </TabsContent>

        {/* ── Weekly Tab ─────────────────────────────────────────── */}
        <TabsContent value="weekly" className="space-y-6 mt-4">
          {wow && (
            <StatGrid cols={5}>
              <StatCard label="Signups" value={wow.signups.current} delta={{ value: wow.signups.delta }} subtitle={`prev: ${wow.signups.previous}`} />
              <StatCard label="Start Rate" value={`${wow.startRate.current}%`} delta={{ value: wow.startRate.delta, suffix: "pp" }} subtitle={`prev: ${wow.startRate.previous}%`} />
              <StatCard label="Completion" value={`${wow.completionRate.current}%`} delta={{ value: wow.completionRate.delta, suffix: "pp" }} subtitle={`prev: ${wow.completionRate.previous}%`} />
              <StatCard label="Paid Conv." value={`${wow.paidConversion.current}%`} delta={{ value: wow.paidConversion.delta, suffix: "pp" }} subtitle={`prev: ${wow.paidConversion.previous}%`} />
              <StatCard label="Revenue" value={formatCurrency(wow.revenue.current)} delta={{ value: wow.revenue.deltaPercent || 0, isPercent: true }} subtitle={`prev: ${formatCurrency(wow.revenue.previous)}`} />
            </StatGrid>
          )}
          {/* Cohort table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Calendar className="w-5 h-5 text-[#722f37]" />Weekly Cohorts</CardTitle>
              <CardDescription>Performance by signup week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto -mx-6 px-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Week</TableHead>
                      <TableHead className="text-right">Signups</TableHead>
                      <TableHead className="text-right">Started</TableHead>
                      <TableHead className="text-right">Completed</TableHead>
                      <TableHead className="text-right">Paid</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead className="text-right">Start %</TableHead>
                      <TableHead className="text-right">Comp %</TableHead>
                      <TableHead className="text-right">Paid %</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {weeklyCohorts.map((c) => (
                      <TableRow key={c.weekStart}>
                        <TableCell className="whitespace-nowrap font-medium text-sm">{c.label}</TableCell>
                        <TableCell className="text-right">{c.signups}</TableCell>
                        <TableCell className="text-right">{c.started}</TableCell>
                        <TableCell className="text-right">{c.completed}</TableCell>
                        <TableCell className="text-right">{c.paid}</TableCell>
                        <TableCell className="text-right text-green-600 font-medium">{formatCurrency(c.revenue)}</TableCell>
                        <TableCell className={cn("text-right font-medium", getRateColor(c.startRate, "start"))}>{c.startRate}%</TableCell>
                        <TableCell className={cn("text-right font-medium", getRateColor(c.completionRate, "completion"))}>{c.completionRate}%</TableCell>
                        <TableCell className={cn("text-right font-medium", getRateColor(c.paidConversion, "conversion"))}>{c.paidConversion}%</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Trends Tab ─────────────────────────────────────────── */}
        <TabsContent value="trends" className="space-y-6 mt-4">
          <BarChartSimple
            data={weeklyTrends.labels.map((l, i) => ({ label: l, value: weeklyTrends.signups[i] }))}
            title="Weekly Signups"
            icon={Users}
            iconColor="text-blue-600"
            color="bg-blue-500"
          />
          <BarChartSimple
            data={weeklyTrends.labels.map((l, i) => ({ label: l, value: weeklyTrends.completionRate[i] }))}
            title="Completion Rate Trend"
            description="% of starters who completed"
            icon={GraduationCap}
            iconColor="text-green-600"
            color="bg-green-500"
            formatValue={(v) => `${v}%`}
          />
          <BarChartSimple
            data={weeklyTrends.labels.map((l, i) => ({ label: l, value: weeklyTrends.revenue[i] }))}
            title="Weekly Revenue"
            icon={DollarSign}
            iconColor="text-emerald-600"
            color="bg-emerald-500"
            formatValue={(v) => formatCurrency(v)}
          />
        </TabsContent>

        {/* ── By Niche Tab ───────────────────────────────────────── */}
        <TabsContent value="niche" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-4">
            {nicheStats
              .sort((a, b) => b.signups - a.signups)
              .map((niche, i) => (
                <NicheCard key={niche.slug} niche={niche} rank={i} totalLeads={summary.total} />
              ))}
          </div>
        </TabsContent>

        {/* ── All Leads Tab ──────────────────────────────────────── */}
        <TabsContent value="leads" className="mt-4">
          {!leadsLoaded ? (
            <div className="flex items-center justify-center py-16">
              <RefreshCw className="w-6 h-6 animate-spin text-[#722f37]" />
              <span className="ml-2 text-gray-500">Loading leads...</span>
            </div>
          ) : (
            <LeadsTable leads={leads} title={`${leads.length} Leads`} description="All mini-diploma funnel leads" />
          )}
        </TabsContent>

        {/* ── Revenue Tab ────────────────────────────────────────── */}
        <TabsContent value="revenue" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4">
            <StatCard label="Total Revenue" value={formatCurrency(revenue.total)} icon={DollarSign} color="green" gradient />
            <StatCard label="Avg per Lead" value={formatCurrency(revenue.avgPerLead)} icon={Users} color="blue" />
            <StatCard label="Avg per Paid" value={formatCurrency(revenue.avgPerPaid)} icon={Target} color="purple" gradient />
          </div>

          {/* Revenue by Niche */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><BarChart3 className="w-5 h-5 text-[#722f37]" />Revenue by Niche</CardTitle>
              <CardDescription>Total revenue contribution per specialization</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {nicheStats
                .filter((n) => n.revenue > 0)
                .sort((a, b) => b.revenue - a.revenue)
                .map((n) => {
                  const maxRev = Math.max(...nicheStats.map((ns) => ns.revenue), 1);
                  const pct = Math.round((n.revenue / maxRev) * 100);
                  return (
                    <div key={n.slug}>
                      <div className="flex items-center justify-between mb-1">
                        <Link href={`/admin/leads/${n.slug}`} className="text-sm font-medium hover:underline truncate mr-2">{n.name}</Link>
                        <span className="text-sm font-bold text-green-600 shrink-0">{formatCurrency(n.revenue)}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#722f37] rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              {nicheStats.filter((n) => n.revenue > 0).length === 0 && (
                <p className="text-center text-gray-400 py-4">No revenue data yet</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
