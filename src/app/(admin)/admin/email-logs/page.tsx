"use client";

import { useState, useEffect, useCallback } from "react";
import { formatDistanceToNow, format, subDays, subHours } from "date-fns";

interface EmailSend {
    id: string;
    toEmail: string;
    subject: string;
    emailType: string | null;
    provider: string;
    status: string;
    resendId: string | null;
    attemptCount: number;
    lastError: string | null;
    sentAt: string | null;
    createdAt: string;
    user: {
        id: string;
        email: string;
        firstName: string | null;
        lastName: string | null;
    } | null;
}

interface Stats {
    sent: number;
    delivered: number;
    opened: number;
    failed: number;
    bounced: number;
    queued: number;
    total: number;
}

const DATE_PRESETS = [
    { label: "Last 24 hours", value: "24h", getDate: () => subHours(new Date(), 24) },
    { label: "Last 7 days", value: "7d", getDate: () => subDays(new Date(), 7) },
    { label: "Last 30 days", value: "30d", getDate: () => subDays(new Date(), 30) },
    { label: "All time", value: "all", getDate: () => null },
];

const EMAIL_TYPES = [
    { label: "All Types", value: "all" },
    { label: "Welcome", value: "welcome" },
    { label: "Transactional", value: "transactional" },
    { label: "Nurture", value: "nurture" },
    { label: "Marketing", value: "marketing" },
    { label: "Enrollment", value: "enrollment" },
    { label: "Recovery", value: "recovery" },
];

export default function EmailLogsPage() {
    const [emails, setEmails] = useState<EmailSend[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [exporting, setExporting] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all");
    const [emailSearch, setEmailSearch] = useState("");
    const [datePreset, setDatePreset] = useState("7d");
    const [emailType, setEmailType] = useState("all");
    const [hasMore, setHasMore] = useState(false);
    const [offset, setOffset] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const LIMIT = 50;

    const buildQueryParams = useCallback((isExport = false, currentOffset = 0) => {
        const params = new URLSearchParams();
        if (statusFilter !== "all") params.set("status", statusFilter);
        if (emailSearch) params.set("email", emailSearch);
        if (emailType !== "all") params.set("emailType", emailType);

        // Date filter
        const preset = DATE_PRESETS.find(p => p.value === datePreset);
        if (preset && preset.value !== "all") {
            const fromDate = preset.getDate();
            if (fromDate) params.set("fromDate", fromDate.toISOString());
        }

        if (isExport) {
            params.set("export", "true");
            params.set("limit", "10000"); // Export up to 10k records
        } else {
            params.set("limit", String(LIMIT));
            params.set("offset", String(currentOffset));
        }

        return params;
    }, [statusFilter, emailSearch, emailType, datePreset]);

    const fetchEmails = useCallback(async (reset = false) => {
        if (reset) {
            setLoading(true);
            setOffset(0);
        } else {
            setLoadingMore(true);
        }

        try {
            const params = buildQueryParams(false, reset ? 0 : offset);
            const res = await fetch(`/api/admin/email-logs?${params}`);
            const data = await res.json();

            if (reset) {
                setEmails(data.emails || []);
                setOffset(LIMIT);
            } else {
                setEmails(prev => [...prev, ...(data.emails || [])]);
                setOffset(prev => prev + LIMIT);
            }

            setStats(data.stats || null);
            setTotalCount(data.total || 0);
            setHasMore(data.pagination?.hasMore || false);
        } catch (error) {
            console.error("Failed to fetch email logs:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [buildQueryParams, offset]);

    useEffect(() => {
        fetchEmails(true);
    }, [statusFilter, datePreset, emailType]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchEmails(true);
    };

    const loadMore = () => {
        fetchEmails(false);
    };

    // CSV Export
    const exportCSV = async () => {
        setExporting(true);
        try {
            const params = buildQueryParams(true);
            const res = await fetch(`/api/admin/email-logs?${params}`);
            const data = await res.json();

            if (!data.emails || data.emails.length === 0) {
                alert("No data to export");
                return;
            }

            // Build CSV
            const headers = ["To Email", "Name", "Subject", "Type", "Provider", "Status", "Attempts", "Error", "Sent At", "Created At"];
            const rows = data.emails.map((e: EmailSend) => [
                e.toEmail,
                e.user ? `${e.user.firstName || ""} ${e.user.lastName || ""}`.trim() : "",
                `"${(e.subject || "").replace(/"/g, '""')}"`,
                e.emailType || "-",
                e.provider,
                e.status,
                e.attemptCount,
                `"${(e.lastError || "").replace(/"/g, '""')}"`,
                e.sentAt ? format(new Date(e.sentAt), "yyyy-MM-dd HH:mm:ss") : "",
                format(new Date(e.createdAt), "yyyy-MM-dd HH:mm:ss"),
            ]);

            const csv = [headers.join(","), ...rows.map((r: string[]) => r.join(","))].join("\n");

            // Download
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `email-logs-${format(new Date(), "yyyy-MM-dd-HHmm")}.csv`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Export failed:", error);
            alert("Export failed. Please try again.");
        } finally {
            setExporting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "SENT": return "bg-green-100 text-green-800";
            case "DELIVERED": return "bg-blue-100 text-blue-800";
            case "OPENED": return "bg-purple-100 text-purple-800";
            case "CLICKED": return "bg-indigo-100 text-indigo-800";
            case "FAILED": return "bg-red-100 text-red-800";
            case "BOUNCED": return "bg-orange-100 text-orange-800";
            case "QUEUED": return "bg-gray-100 text-gray-800";
            case "SENDING": return "bg-yellow-100 text-yellow-800";
            default: return "bg-gray-100 text-gray-800";
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Email Logs</h1>
                    <p className="text-sm text-gray-500 mt-1">Track all email sends, deliveries, and failures</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={exportCSV}
                        disabled={exporting || emails.length === 0}
                        className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 disabled:opacity-50 flex items-center gap-2"
                    >
                        {exporting ? (
                            <>
                                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                Exporting...
                            </>
                        ) : (
                            <>📥 Export CSV</>
                        )}
                    </button>
                    <button
                        onClick={() => fetchEmails(true)}
                        className="px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700"
                    >
                        🔄 Refresh
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-7 gap-3 mb-6">
                    <div className="bg-white rounded-lg p-4 border shadow-sm">
                        <div className="text-2xl font-bold text-gray-900">{stats.total.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Total</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="text-2xl font-bold text-green-700">{stats.sent.toLocaleString()}</div>
                        <div className="text-xs text-green-600">Sent</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="text-2xl font-bold text-blue-700">{stats.delivered.toLocaleString()}</div>
                        <div className="text-xs text-blue-600">Delivered</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                        <div className="text-2xl font-bold text-purple-700">{stats.opened?.toLocaleString() || 0}</div>
                        <div className="text-xs text-purple-600">Opened</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                        <div className="text-2xl font-bold text-red-700">{stats.failed.toLocaleString()}</div>
                        <div className="text-xs text-red-600">Failed</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                        <div className="text-2xl font-bold text-orange-700">{stats.bounced.toLocaleString()}</div>
                        <div className="text-xs text-orange-600">Bounced</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="text-2xl font-bold text-gray-700">{stats.queued.toLocaleString()}</div>
                        <div className="text-xs text-gray-600">Queued</div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg p-4 mb-6 border shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {/* Date Preset */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Date Range</label>
                        <select
                            value={datePreset}
                            onChange={(e) => setDatePreset(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-burgundy-500 text-sm"
                        >
                            {DATE_PRESETS.map(p => (
                                <option key={p.value} value={p.value}>{p.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Status */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-burgundy-500 text-sm"
                        >
                            <option value="all">All Status</option>
                            <option value="SENT">Sent</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="OPENED">Opened</option>
                            <option value="CLICKED">Clicked</option>
                            <option value="FAILED">Failed</option>
                            <option value="BOUNCED">Bounced</option>
                            <option value="QUEUED">Queued</option>
                        </select>
                    </div>

                    {/* Email Type */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Email Type</label>
                        <select
                            value={emailType}
                            onChange={(e) => setEmailType(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-burgundy-500 text-sm"
                        >
                            {EMAIL_TYPES.map(t => (
                                <option key={t.value} value={t.value}>{t.label}</option>
                            ))}
                        </select>
                    </div>

                    {/* Search */}
                    <form onSubmit={handleSearch}>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Search Email</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={emailSearch}
                                onChange={(e) => setEmailSearch(e.target.value)}
                                placeholder="user@example.com"
                                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-burgundy-500 text-sm"
                            />
                            <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 text-sm">
                                🔍
                            </button>
                        </div>
                    </form>
                </div>

                {/* Active Filters Summary */}
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
                    <span className="text-gray-500">Showing:</span>
                    <span className="px-2 py-0.5 bg-burgundy-100 text-burgundy-700 rounded text-xs font-medium">
                        {totalCount.toLocaleString()} results
                    </span>
                    {emailSearch && (
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium flex items-center gap-1">
                            "{emailSearch}"
                            <button onClick={() => { setEmailSearch(""); fetchEmails(true); }} className="hover:text-blue-900">×</button>
                        </span>
                    )}
                </div>
            </div>

            {/* Email Table */}
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">
                        <div className="animate-spin w-8 h-8 border-2 border-burgundy-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                        Loading emails...
                    </div>
                ) : emails.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        <div className="text-4xl mb-2">📭</div>
                        No emails found for the selected filters
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 border-b">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">To</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Subject</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Type</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sent</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {emails.map((email) => (
                                        <tr key={email.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">{email.toEmail}</div>
                                                {email.user && (
                                                    <div className="text-xs text-gray-500">
                                                        {email.user.firstName} {email.user.lastName}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="text-sm text-gray-900 max-w-xs truncate" title={email.subject}>
                                                    {email.subject}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-xs bg-gray-100 px-2 py-1 rounded font-medium">
                                                    {email.emailType || "-"}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs px-2 py-1 rounded font-medium ${getStatusColor(email.status)}`}>
                                                    {email.status}
                                                </span>
                                                {email.lastError && (
                                                    <div className="text-xs text-red-500 mt-1 max-w-[180px] truncate" title={email.lastError}>
                                                        {email.lastError.split(':')[0]}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                                                {email.sentAt
                                                    ? formatDistanceToNow(new Date(email.sentAt), { addSuffix: true })
                                                    : formatDistanceToNow(new Date(email.createdAt), { addSuffix: true })
                                                }
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Load More */}
                        {hasMore && (
                            <div className="p-4 border-t bg-gray-50 text-center">
                                <button
                                    onClick={loadMore}
                                    disabled={loadingMore}
                                    className="px-6 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 disabled:opacity-50"
                                >
                                    {loadingMore ? (
                                        <span className="flex items-center gap-2">
                                            <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                            Loading...
                                        </span>
                                    ) : (
                                        `Load More (${emails.length} of ${totalCount.toLocaleString()})`
                                    )}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
