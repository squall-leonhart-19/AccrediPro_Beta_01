"use client";

import { useState, useEffect, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Target, BarChart3, Zap, Users, DollarSign, Award, RefreshCw, Calendar, TrendingUp, Flame, AlertTriangle, ArrowUpDown } from "lucide-react";
import { DashboardHeader } from "@/components/admin/leads/dashboard-header";
import { StatCard } from "@/components/admin/leads/stat-card";
import { StatGrid } from "@/components/admin/leads/stat-grid";
import type { SourceStat, SourcesData } from "@/components/admin/leads/metric-types";
import { formatCurrency, getRateColor } from "@/components/admin/leads/metric-types";

type SortKey = "entry" | "signups" | "startRate" | "completionRate" | "paidConversion" | "revenue" | "revenuePerLead" | "avgLeadScore" | "hotLeads" | "warmLeads" | "coldLeads";

function QualityBar({ hot, warm, cold }: { hot: number; warm: number; cold: number }) {
    const total = hot + warm + cold;
    if (total === 0) return null;
    const hotPct = Math.round((hot / total) * 100);
    const warmPct = Math.round((warm / total) * 100);
    const coldPct = 100 - hotPct - warmPct;
    const segments = [
        { pct: hotPct, bg: "bg-green-500", text: "text-white", label: "Hot", count: hot, dot: "bg-green-500" },
        { pct: warmPct, bg: "bg-amber-400", text: "text-white", label: "Warm", count: warm, dot: "bg-amber-400" },
        { pct: coldPct, bg: "bg-gray-300", text: "text-gray-600", label: "Cold", count: cold, dot: "bg-gray-300" },
    ];
    return (
        <div>
            <div className="flex h-4 rounded-full overflow-hidden">
                {segments.map((s) => s.pct > 0 && (
                    <div key={s.label} className={cn(s.bg, "flex items-center justify-center")} style={{ width: `${s.pct}%` }}>
                        {s.pct >= 12 && <span className={cn("text-[10px] font-medium", s.text)}>{s.pct}%</span>}
                    </div>
                ))}
            </div>
            <div className="flex gap-3 mt-1 text-[10px] text-gray-500">
                {segments.map((s) => (
                    <span key={s.label} className="flex items-center gap-1">
                        <span className={cn("w-2 h-2 rounded-full inline-block", s.dot)} /> {s.label} {s.count}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default function SourcesAnalytics() {
    const [data, setData] = useState<SourcesData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [dateRange, setDateRange] = useState("all");
    const [sortKey, setSortKey] = useState<SortKey>("signups");
    const [sortAsc, setSortAsc] = useState(false);

    const fetchData = async () => {
        setLoading(true); setError(false);
        try {
            const res = await fetch(`/api/admin/leads-dashboard/sources?range=${dateRange}`);
            if (res.ok) setData(await res.json()); else setError(true);
        } catch { setError(true); } finally { setLoading(false); }
    };

    useEffect(() => { fetchData(); }, [dateRange]);

    const summary = useMemo(() => {
        if (!data) return null;
        let bestConverting = { name: "-", rate: 0 }, highestRevenue = { name: "-", revenue: 0 };
        let totalScore = 0, totalLeads = 0;
        data.sources.forEach((s) => {
            if (s.paidConversion > bestConverting.rate && s.signups >= 3)
                bestConverting = { name: `${s.leadSourceDetail}/${s.formVariant}`, rate: s.paidConversion };
            if (s.revenue > highestRevenue.revenue)
                highestRevenue = { name: `${s.leadSourceDetail}/${s.formVariant}`, revenue: s.revenue };
            totalScore += s.avgLeadScore * s.signups; totalLeads += s.signups;
        });
        return { uniqueSources: data.sources.length, bestConverting, highestRevenue,
            avgLeadScore: totalLeads > 0 ? Math.round((totalScore / totalLeads) * 10) / 10 : 0 };
    }, [data]);

    const abWinner = useMemo(() => {
        if (!data || data.byVariant.length < 2) return null;
        return data.byVariant.reduce((best, v) => v.stats.paidConversion > best.stats.paidConversion ? v : best).variant;
    }, [data]);

    const sortedSources = useMemo(() => {
        if (!data) return [];
        return [...data.sources].sort((a, b) => {
            if (sortKey === "entry") {
                const aV = `${a.leadSourceDetail}/${a.formVariant}/${a.segment}`;
                const bV = `${b.leadSourceDetail}/${b.formVariant}/${b.segment}`;
                return sortAsc ? aV.localeCompare(bV) : bV.localeCompare(aV);
            }
            return sortAsc ? (a[sortKey] as number) - (b[sortKey] as number) : (b[sortKey] as number) - (a[sortKey] as number);
        });
    }, [data, sortKey, sortAsc]);

    const handleSort = (key: SortKey) => { if (sortKey === key) setSortAsc(!sortAsc); else { setSortKey(key); setSortAsc(false); } };

    const SortHeader = ({ label, col, className }: { label: string; col: SortKey; className?: string }) => (
        <TableHead className={cn("cursor-pointer select-none hover:bg-gray-50", className)} onClick={() => handleSort(col)}>
            <div className="flex items-center gap-1">{label}
                <ArrowUpDown className={cn("w-3 h-3", sortKey === col ? "text-[#4e1f24]" : "text-gray-400")} />
            </div>
        </TableHead>
    );

    if (loading) return (
        <div className="flex items-center justify-center h-96">
            <div className="text-center">
                <RefreshCw className="w-10 h-10 animate-spin text-[#722f37] mx-auto mb-4" />
                <p className="text-gray-500">Loading source analytics...</p>
            </div>
        </div>
    );

    if (error || !data) return (
        <div className="text-center py-12">
            <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">Failed to load source analytics</p>
            <Button onClick={fetchData} className="bg-[#C9A227] hover:bg-[#b8922a] text-[#4e1f24]">Retry</Button>
        </div>
    );

    return (
        <div className="space-y-6">
            <DashboardHeader
                title="Lead Source Analytics"
                subtitle="Track which forms & segments produce the best leads"
                breadcrumbs={[{ label: "Leads", href: "/admin/leads" }, { label: "Source Analytics" }]}
                actions={
                    <Button className="bg-[#C9A227] hover:bg-[#b8922a] text-[#4e1f24] font-semibold" onClick={fetchData}>
                        <RefreshCw className="w-4 h-4 mr-2" />Refresh
                    </Button>
                }
                filters={
                    <Select value={dateRange} onValueChange={setDateRange}>
                        <SelectTrigger className="w-[180px] bg-white/10 border-white/20 text-white">
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
                }
            />

            {summary && (
                <StatGrid cols={4}>
                    <StatCard label="Total Entry Points" value={summary.uniqueSources} icon={Target} color="blue" gradient />
                    <StatCard label="Best Converting Source" value={`${summary.bestConverting.rate}%`} icon={Award} color="green" gradient subtitle={summary.bestConverting.name} />
                    <StatCard label="Highest Revenue Source" value={formatCurrency(summary.highestRevenue.revenue)} icon={DollarSign} color="purple" gradient subtitle={summary.highestRevenue.name} />
                    <StatCard label="Avg Lead Score" value={summary.avgLeadScore} icon={Zap} color="amber" gradient />
                </StatGrid>
            )}

            {/* A/B Test Comparison */}
            {data.byVariant.length > 0 && (
                <div>
                    <h2 className="text-lg font-bold mb-1 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-[#722f37]" /> Form Variant Performance (A/B Test)
                    </h2>
                    <p className="text-sm text-gray-500 mb-4">Compare form variants side-by-side</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {data.byVariant.map(({ variant, stats }) => {
                            const isWinner = variant === abWinner && data.byVariant.length > 1;
                            return (
                                <Card key={variant} className={cn(isWinner && "border-green-400 border-2")}>
                                    <CardHeader className="pb-3">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-base">Variant {variant.toUpperCase()}</CardTitle>
                                            {isWinner && <Badge className="bg-green-500 text-white">Winner</Badge>}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                            <div><p className="text-gray-500">Signups</p><p className="font-bold text-lg">{stats.signups}</p></div>
                                            <div><p className="text-gray-500">Revenue</p><p className="font-bold text-lg text-green-600">{formatCurrency(stats.revenue)}</p></div>
                                            <div><p className="text-gray-500">Start Rate</p><p className={cn("font-bold", getRateColor(stats.startRate, "start"))}>{stats.startRate}%</p></div>
                                            <div><p className="text-gray-500">Completion Rate</p><p className={cn("font-bold", getRateColor(stats.completionRate, "completion"))}>{stats.completionRate}%</p></div>
                                            <div><p className="text-gray-500">Paid Conversion</p><p className={cn("font-bold", getRateColor(stats.paidConversion, "conversion"))}>{stats.paidConversion}%</p></div>
                                            <div><p className="text-gray-500">Avg Lead Score</p><p className="font-bold">{stats.avgLeadScore}</p></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-1">Lead Quality</p>
                                        <QualityBar hot={stats.hotLeads} warm={stats.warmLeads} cold={stats.coldLeads} />
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Segment Performance */}
            {data.bySegment.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5 text-[#722f37]" /> Headline Segment Performance</CardTitle>
                        <CardDescription>Which messaging resonates best</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {(() => {
                                const max = Math.max(...data.bySegment.map((s) => s.stats.paidConversion), 1);
                                return [...data.bySegment].sort((a, b) => b.stats.paidConversion - a.stats.paidConversion).map(({ segment, stats }) => (
                                    <div key={segment} className="space-y-1">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium capitalize">{segment}</span>
                                            <span className={cn("text-sm font-bold", getRateColor(stats.paidConversion, "conversion"))}>{stats.paidConversion}% paid</span>
                                        </div>
                                        <div className="h-6 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-[#722f37] to-[#C9A227] rounded-full transition-all duration-500" style={{ width: `${Math.max(8, (stats.paidConversion / max) * 100)}%` }} />
                                        </div>
                                        <div className="flex gap-4 text-xs text-gray-500">
                                            <span>{stats.signups} signups</span>
                                            <span>Avg score: {stats.avgLeadScore}</span>
                                            <span>{formatCurrency(stats.revenue)} revenue</span>
                                        </div>
                                    </div>
                                ));
                            })()}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Entry Point Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5 text-[#722f37]" /> All Entry Points</CardTitle>
                    <CardDescription>Click column headers to sort</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <SortHeader label="Entry Point" col="entry" />
                                    <SortHeader label="Leads" col="signups" className="text-center" />
                                    <SortHeader label="Start%" col="startRate" className="text-center" />
                                    <SortHeader label="Complete%" col="completionRate" className="text-center" />
                                    <SortHeader label="Paid%" col="paidConversion" className="text-center" />
                                    <SortHeader label="Revenue" col="revenue" className="text-right" />
                                    <SortHeader label="$/Lead" col="revenuePerLead" className="text-center" />
                                    <SortHeader label="Avg Score" col="avgLeadScore" className="text-center" />
                                    <SortHeader label="Hot" col="hotLeads" className="text-center" />
                                    <SortHeader label="Warm" col="warmLeads" className="text-center" />
                                    <SortHeader label="Cold" col="coldLeads" className="text-center" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sortedSources.map((s) => (
                                    <TableRow key={s.key}>
                                        <TableCell><span className="text-sm font-medium">{s.leadSourceDetail} / {s.formVariant} / {s.segment}</span></TableCell>
                                        <TableCell className="text-center font-bold">{s.signups}</TableCell>
                                        <TableCell className="text-center"><span className={getRateColor(s.startRate, "start")}>{s.startRate}%</span></TableCell>
                                        <TableCell className="text-center"><span className={getRateColor(s.completionRate, "completion")}>{s.completionRate}%</span></TableCell>
                                        <TableCell className="text-center">
                                            <Badge className={cn(s.paidConversion >= 8 ? "bg-green-500" : s.paidConversion >= 4 ? "bg-amber-500" : "bg-gray-400")}>{s.paidConversion}%</Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-green-600">{formatCurrency(s.revenue)}</TableCell>
                                        <TableCell className="text-center text-gray-600">${s.revenuePerLead}</TableCell>
                                        <TableCell className="text-center">{s.avgLeadScore}</TableCell>
                                        <TableCell className="text-center">{s.hotLeads > 0 ? <span className="text-green-600 font-medium">{s.hotLeads}</span> : <span className="text-gray-400">0</span>}</TableCell>
                                        <TableCell className="text-center">{s.warmLeads > 0 ? <span className="text-amber-600 font-medium">{s.warmLeads}</span> : <span className="text-gray-400">0</span>}</TableCell>
                                        <TableCell className="text-center"><span className="text-gray-500">{s.coldLeads}</span></TableCell>
                                    </TableRow>
                                ))}
                                {sortedSources.length === 0 && (
                                    <TableRow><TableCell colSpan={11} className="text-center py-8 text-gray-500">No source data available for the selected date range</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Lead Quality by Source */}
            {data.bySource.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Flame className="w-5 h-5 text-[#722f37]" /> Lead Quality by Source</CardTitle>
                        <CardDescription>Hot / warm / cold distribution per source</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-5">
                            {data.bySource.map(({ source, stats }) => {
                                const total = stats.hotLeads + stats.warmLeads + stats.coldLeads;
                                if (total === 0) return null;
                                return (
                                    <div key={source} className="space-y-1.5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">{source}</span>
                                            <span className="text-xs text-gray-500">{total} leads</span>
                                        </div>
                                        <QualityBar hot={stats.hotLeads} warm={stats.warmLeads} cold={stats.coldLeads} />
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
