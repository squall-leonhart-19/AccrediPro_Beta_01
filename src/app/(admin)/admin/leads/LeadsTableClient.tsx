"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
    MessageSquare,
    Eye,
    Clock,
    Send,
    ChevronDown,
    ChevronUp,
    Download,
    X,
    Search,
    Loader2,
} from "lucide-react";

interface Lead {
    id: string;
    progress: number;
    lessonsCompleted: number;
    watchedVideo: boolean;
    completedQuestions: boolean;
    claimedCertificate: boolean;
    status: "hot" | "warm" | "cold" | "completed";
    daysSinceActive: number;
    daysUntilExpiry: number;
    enrolledAt: Date;
    diplomaType: "WH" | "FM";
    user: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        avatar: string | null;
    };
    onboardingAnswers?: {
        bringReason: string | null;
        currentSituation: string | null;
        incomeGoal: string | null;
        lifeChangeGoal: string | null;
        doingItFor: string | null;
    } | null;
}

interface LeadsTableClientProps {
    leads: Lead[];
}

type SortField = "name" | "progress" | "status" | "lastActive" | "expiry" | "enrolled";
type SortOrder = "asc" | "desc";

const ITEMS_PER_PAGE = 20;

export function LeadsTableClient({ leads: allLeads }: LeadsTableClientProps) {
    const router = useRouter();
    const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
    const [selectAll, setSelectAll] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
    const [sendingDM, setSendingDM] = useState(false);

    // Search
    const [searchQuery, setSearchQuery] = useState("");

    // Sorting
    const [sortField, setSortField] = useState<SortField>("enrolled");
    const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

    // Filters
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [sourceFilter, setSourceFilter] = useState<string>("all");
    const [expiryFilter, setExpiryFilter] = useState<string>("all");

    // Apply search, filters, and sorting
    const filteredLeads = useMemo(() => {
        let result = allLeads;

        // Search
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            result = result.filter(lead =>
                (lead.user.firstName?.toLowerCase().includes(q)) ||
                (lead.user.lastName?.toLowerCase().includes(q)) ||
                (lead.user.email?.toLowerCase().includes(q))
            );
        }

        // Filters
        result = result.filter(lead => {
            if (statusFilter !== "all" && lead.status !== statusFilter) return false;
            if (sourceFilter !== "all" && lead.diplomaType !== sourceFilter) return false;
            if (expiryFilter === "expiring" && lead.daysUntilExpiry > 2) return false;
            if (expiryFilter === "expired" && lead.daysUntilExpiry > 0) return false;
            return true;
        });

        // Sorting
        result = [...result].sort((a, b) => {
            let comparison = 0;
            switch (sortField) {
                case "name":
                    comparison = (a.user.firstName || "").localeCompare(b.user.firstName || "");
                    break;
                case "progress":
                    comparison = a.progress - b.progress;
                    break;
                case "status":
                    const statusOrder = { hot: 0, warm: 1, cold: 2, completed: 3 };
                    comparison = statusOrder[a.status] - statusOrder[b.status];
                    break;
                case "lastActive":
                    comparison = a.daysSinceActive - b.daysSinceActive;
                    break;
                case "expiry":
                    comparison = a.daysUntilExpiry - b.daysUntilExpiry;
                    break;
                case "enrolled":
                    comparison = new Date(a.enrolledAt).getTime() - new Date(b.enrolledAt).getTime();
                    break;
            }
            return sortOrder === "asc" ? comparison : -comparison;
        });

        return result;
    }, [allLeads, searchQuery, statusFilter, sourceFilter, expiryFilter, sortField, sortOrder]);

    // Paginated leads
    const visibleLeads = filteredLeads.slice(0, visibleCount);
    const hasMore = visibleCount < filteredLeads.length;

    const toggleSelectAll = () => {
        if (selectAll) {
            setSelectedLeads(new Set());
        } else {
            setSelectedLeads(new Set(visibleLeads.map(l => l.id)));
        }
        setSelectAll(!selectAll);
    };

    const toggleLead = (id: string) => {
        const newSet = new Set(selectedLeads);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setSelectedLeads(newSet);
        setSelectAll(newSet.size === visibleLeads.length);
    };

    const handleSort = (field: SortField) => {
        if (sortField === field) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortOrder("desc");
        }
    };

    const SortIcon = ({ field }: { field: SortField }) => {
        if (sortField !== field) return null;
        return sortOrder === "asc"
            ? <ChevronUp className="w-3 h-3 inline ml-1" />
            : <ChevronDown className="w-3 h-3 inline ml-1" />;
    };

    const handleBulkDM = async () => {
        const selectedUserIds = visibleLeads
            .filter(l => selectedLeads.has(l.id))
            .map(l => l.user.id);

        if (selectedUserIds.length === 0) return;

        const message = prompt(
            `Send DM to ${selectedUserIds.length} leads.\n\nEnter your message:`,
            "Hi! Just checking in on your Women's Health Mini Diploma progress. 🌸 Is there anything I can help with?"
        );

        if (!message) return;

        setSendingDM(true);

        try {
            const response = await fetch("/api/admin/bulk-dm", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userIds: selectedUserIds, message }),
            });

            if (response.ok) {
                const data = await response.json();
                alert(`✅ Successfully sent DM to ${data.sent} leads!`);
                setSelectedLeads(new Set());
                setSelectAll(false);
            } else {
                const error = await response.json();
                alert(`❌ Error: ${error.error || "Failed to send DMs"}`);
            }
        } catch (error) {
            alert("❌ Network error. Please try again.");
        } finally {
            setSendingDM(false);
        }
    };

    const handleExportCSV = () => {
        const headers = ["Name", "Email", "Source", "Progress", "Status", "Last Active", "Days to Expiry", "Enrolled"];
        const rows = filteredLeads.map(lead => [
            `${lead.user.firstName || ""} ${lead.user.lastName || ""}`.trim(),
            lead.user.email || "",
            lead.diplomaType === "WH" ? "Women's Health" : "Functional Medicine",
            `${lead.progress}%`,
            lead.status,
            `${lead.daysSinceActive} days`,
            lead.daysUntilExpiry,
            new Date(lead.enrolledAt).toLocaleDateString(),
        ]);

        const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `leads-export-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const clearFilters = () => {
        setStatusFilter("all");
        setSourceFilter("all");
        setExpiryFilter("all");
        setSearchQuery("");
    };

    const hasActiveFilters = statusFilter !== "all" || sourceFilter !== "all" || expiryFilter !== "all" || searchQuery.trim() !== "";

    const formatLastActive = (days: number) => {
        if (days === 0) return "Today";
        if (days === 1) return "Yesterday";
        if (days > 30) return "30+ days";
        return `${days}d ago`;
    };

    const getExpiryBadge = (daysUntilExpiry: number) => {
        if (daysUntilExpiry <= 0) {
            return <Badge className="bg-gray-100 text-gray-600">Expired</Badge>;
        }
        if (daysUntilExpiry <= 2) {
            return <Badge className="bg-red-100 text-red-700 animate-pulse">⚠️ {daysUntilExpiry}d</Badge>;
        }
        if (daysUntilExpiry <= 4) {
            return <Badge className="bg-amber-100 text-amber-700">{daysUntilExpiry}d</Badge>;
        }
        return <Badge className="bg-emerald-100 text-emerald-700">{daysUntilExpiry}d</Badge>;
    };

    return (
        <div>
            {/* Search & Filters Bar */}
            <div className="flex items-center justify-between mb-4 gap-4">
                <div className="flex items-center gap-2 flex-1">
                    {/* Search */}
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search name or email..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-burgundy-500 focus:border-burgundy-500"
                        />
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className={hasActiveFilters ? "border-burgundy-500 text-burgundy-600" : ""}
                    >
                        <ChevronDown className={`w-4 h-4 mr-1 transition-transform ${showFilters ? "rotate-180" : ""}`} />
                        Filters
                        {hasActiveFilters && (
                            <span className="ml-1 w-2 h-2 bg-burgundy-500 rounded-full" />
                        )}
                    </Button>
                    {hasActiveFilters && (
                        <Button variant="ghost" size="sm" onClick={clearFilters}>
                            <X className="w-3 h-3 mr-1" />
                            Clear
                        </Button>
                    )}
                    <span className="text-sm text-gray-500">
                        {filteredLeads.length} leads
                    </span>
                </div>
                <Button variant="outline" size="sm" onClick={handleExportCSV}>
                    <Download className="w-4 h-4 mr-1" />
                    Export
                </Button>
            </div>

            {/* Filter Options */}
            {showFilters && (
                <div className="mb-4 p-4 bg-gray-50 rounded-lg flex flex-wrap gap-4">
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-3 py-2 border rounded-lg text-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="hot">🔥 Hot</option>
                            <option value="warm">⏳ Warm</option>
                            <option value="cold">❄️ Cold</option>
                            <option value="completed">✅ Completed</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Source</label>
                        <select
                            value={sourceFilter}
                            onChange={(e) => setSourceFilter(e.target.value)}
                            className="px-3 py-2 border rounded-lg text-sm"
                        >
                            <option value="all">All Sources</option>
                            <option value="WH">🌸 Women&apos;s Health</option>
                            <option value="FM">⚕️ Functional Medicine</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">Access</label>
                        <select
                            value={expiryFilter}
                            onChange={(e) => setExpiryFilter(e.target.value)}
                            className="px-3 py-2 border rounded-lg text-sm"
                        >
                            <option value="all">All</option>
                            <option value="expiring">⚠️ Expiring Soon</option>
                            <option value="expired">❌ Expired</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Bulk Actions Bar */}
            {selectedLeads.size > 0 && (
                <div className="mb-4 p-3 bg-burgundy-50 border border-burgundy-200 rounded-lg flex items-center justify-between">
                    <span className="text-sm text-burgundy-700 font-medium">
                        {selectedLeads.size} lead{selectedLeads.size > 1 ? "s" : ""} selected
                    </span>
                    <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => setSelectedLeads(new Set())}>
                            Clear
                        </Button>
                        <Button
                            size="sm"
                            className="bg-burgundy-600 hover:bg-burgundy-700"
                            onClick={handleBulkDM}
                            disabled={sendingDM}
                        >
                            {sendingDM ? (
                                <>
                                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <Send className="w-3 h-3 mr-1" />
                                    Send DM to All
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b text-left text-sm text-gray-500">
                            <th className="pb-3 pl-2">
                                <input
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={toggleSelectAll}
                                    className="w-4 h-4 rounded border-gray-300 text-burgundy-600 focus:ring-burgundy-500"
                                />
                            </th>
                            <th className="pb-3 font-medium cursor-pointer hover:text-gray-700" onClick={() => handleSort("name")}>
                                Lead <SortIcon field="name" />
                            </th>
                            <th className="pb-3 font-medium">Source</th>
                            <th className="pb-3 font-medium cursor-pointer hover:text-gray-700" onClick={() => handleSort("progress")}>
                                Progress <SortIcon field="progress" />
                            </th>
                            <th className="pb-3 font-medium cursor-pointer hover:text-gray-700" onClick={() => handleSort("status")}>
                                Status <SortIcon field="status" />
                            </th>
                            <th className="pb-3 font-medium cursor-pointer hover:text-gray-700" onClick={() => handleSort("lastActive")}>
                                Active <SortIcon field="lastActive" />
                            </th>
                            <th className="pb-3 font-medium cursor-pointer hover:text-gray-700" onClick={() => handleSort("expiry")}>
                                Access <SortIcon field="expiry" />
                            </th>
                            <th className="pb-3 font-medium">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {visibleLeads.map((lead) => {
                            const isExpiringSoon = lead.daysUntilExpiry <= 2 && lead.daysUntilExpiry > 0;
                            const isExpired = lead.daysUntilExpiry <= 0;

                            return (
                                <tr
                                    key={lead.id}
                                    className={`hover:bg-gray-50 ${isExpired ? "bg-gray-50 opacity-60" :
                                        isExpiringSoon ? "bg-red-50/50" : ""
                                        }`}
                                >
                                    <td className="py-3 pl-2">
                                        <input
                                            type="checkbox"
                                            checked={selectedLeads.has(lead.id)}
                                            onChange={() => toggleLead(lead.id)}
                                            className="w-4 h-4 rounded border-gray-300 text-burgundy-600 focus:ring-burgundy-500"
                                        />
                                    </td>
                                    <td className="py-3">
                                        <div className="flex items-center gap-3">
                                            {lead.user.avatar ? (
                                                <img
                                                    src={lead.user.avatar}
                                                    alt=""
                                                    className="w-8 h-8 rounded-full"
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-burgundy-100 flex items-center justify-center text-burgundy-600 font-bold text-sm">
                                                    {lead.user.firstName?.[0] || "?"}
                                                </div>
                                            )}
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">
                                                    {lead.user.firstName} {lead.user.lastName}
                                                </p>
                                                <p className="text-xs text-gray-500">{lead.user.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <div className="flex flex-col gap-1">
                                            <Badge className={
                                                lead.diplomaType === "WH"
                                                    ? "bg-pink-100 text-pink-700"
                                                    : "bg-blue-100 text-blue-700"
                                            }>
                                                {lead.diplomaType}
                                            </Badge>
                                            {lead.onboardingAnswers?.incomeGoal && (
                                                <span className="text-xs text-gray-500" title={`Goal: ${lead.onboardingAnswers.lifeChangeGoal || "Not specified"}`}>
                                                    💰 {lead.onboardingAnswers.incomeGoal}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <div className="w-24">
                                            <div className="flex items-center justify-between text-xs mb-1">
                                                <span>{lead.progress}%</span>
                                            </div>
                                            <Progress value={lead.progress} className="h-1.5" />
                                        </div>
                                    </td>
                                    <td className="py-3">
                                        <Badge className={
                                            lead.status === "hot" ? "bg-emerald-100 text-emerald-700" :
                                                lead.status === "warm" ? "bg-amber-100 text-amber-700" :
                                                    lead.status === "cold" ? "bg-red-100 text-red-700" :
                                                        "bg-burgundy-100 text-burgundy-700"
                                        }>
                                            {lead.status === "hot" ? "🔥" :
                                                lead.status === "warm" ? "⏳" :
                                                    lead.status === "cold" ? "❄️" : "✅"}
                                        </Badge>
                                    </td>
                                    <td className="py-3">
                                        <span className="text-xs text-gray-500">
                                            {formatLastActive(lead.daysSinceActive)}
                                        </span>
                                    </td>
                                    <td className="py-3">
                                        {getExpiryBadge(lead.daysUntilExpiry)}
                                    </td>
                                    <td className="py-3">
                                        <div className="flex gap-1">
                                            <a href={`/admin/users?userId=${lead.user.id}`}>
                                                <Button size="sm" variant="ghost" className="h-7 px-2">
                                                    <Eye className="w-3 h-3" />
                                                </Button>
                                            </a>
                                            <a href={`/messages?recipientId=${lead.user.id}`}>
                                                <Button size="sm" variant="ghost" className="h-7 px-2">
                                                    <MessageSquare className="w-3 h-3" />
                                                </Button>
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Load More */}
            {hasMore && (
                <div className="mt-6 text-center">
                    <Button
                        variant="outline"
                        onClick={() => setVisibleCount(prev => prev + ITEMS_PER_PAGE)}
                        className="px-8"
                    >
                        Load More ({filteredLeads.length - visibleCount} remaining)
                    </Button>
                </div>
            )}

            {/* Empty State */}
            {filteredLeads.length === 0 && (
                <div className="py-12 text-center text-gray-500">
                    <p>No leads match your search/filters</p>
                    <Button variant="link" onClick={clearFilters}>Clear all</Button>
                </div>
            )}
        </div>
    );
}
