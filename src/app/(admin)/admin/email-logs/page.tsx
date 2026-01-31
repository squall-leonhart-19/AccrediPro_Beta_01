"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";

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
    failed: number;
    bounced: number;
    queued: number;
    total: number;
}

export default function EmailLogsPage() {
    const [emails, setEmails] = useState<EmailSend[]>([]);
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [statusFilter, setStatusFilter] = useState("all");
    const [emailSearch, setEmailSearch] = useState("");
    const [hasMore, setHasMore] = useState(false);
    const [offset, setOffset] = useState(0);
    const LIMIT = 50;

    const fetchEmails = async (reset = false) => {
        if (reset) {
            setLoading(true);
            setOffset(0);
        } else {
            setLoadingMore(true);
        }

        try {
            const params = new URLSearchParams();
            if (statusFilter !== "all") params.set("status", statusFilter);
            if (emailSearch) params.set("email", emailSearch);
            params.set("limit", String(LIMIT));
            params.set("offset", String(reset ? 0 : offset));

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
            setHasMore(data.pagination?.hasMore || false);
        } catch (error) {
            console.error("Failed to fetch email logs:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => {
        fetchEmails(true);
    }, [statusFilter]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchEmails(true);
    };

    const loadMore = () => {
        fetchEmails(false);
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
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Email Logs</h1>
                    <p className="text-sm text-gray-500 mt-1">Track all email sends, deliveries, and failures</p>
                </div>
                <button
                    onClick={() => fetchEmails(true)}
                    className="px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700"
                >
                    Refresh
                </button>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 border shadow-sm">
                        <div className="text-2xl font-bold text-gray-900">{stats.total.toLocaleString()}</div>
                        <div className="text-sm text-gray-500">Total</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200 shadow-sm">
                        <div className="text-2xl font-bold text-green-700">{stats.sent.toLocaleString()}</div>
                        <div className="text-sm text-green-600">Sent</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 shadow-sm">
                        <div className="text-2xl font-bold text-blue-700">{stats.delivered.toLocaleString()}</div>
                        <div className="text-sm text-blue-600">Delivered</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200 shadow-sm">
                        <div className="text-2xl font-bold text-red-700">{stats.failed.toLocaleString()}</div>
                        <div className="text-sm text-red-600">Failed</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200 shadow-sm">
                        <div className="text-2xl font-bold text-orange-700">{stats.bounced.toLocaleString()}</div>
                        <div className="text-sm text-orange-600">Bounced</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm">
                        <div className="text-2xl font-bold text-gray-700">{stats.queued.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Queued</div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg p-4 mb-6 border shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="w-full md:w-48">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-burgundy-500"
                        >
                            <option value="all">All Status</option>
                            <option value="SENT">Sent</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="OPENED">Opened</option>
                            <option value="CLICKED">Clicked</option>
                            <option value="FAILED">Failed</option>
                            <option value="BOUNCED">Bounced</option>
                            <option value="QUEUED">Queued</option>
                            <option value="SENDING">Sending</option>
                        </select>
                    </div>
                    <form onSubmit={handleSearch} className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search by Email</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={emailSearch}
                                onChange={(e) => setEmailSearch(e.target.value)}
                                placeholder="Enter email address to search..."
                                className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-burgundy-500"
                            />
                            <button type="submit" className="px-6 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900">
                                Search
                            </button>
                            {emailSearch && (
                                <button
                                    type="button"
                                    onClick={() => { setEmailSearch(""); fetchEmails(true); }}
                                    className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            {/* Results Count */}
            <div className="mb-4 text-sm text-gray-600">
                Showing {emails.length} of {stats?.total || 0} emails
                {emailSearch && <span className="ml-2 text-burgundy-600">• Filtered by: "{emailSearch}"</span>}
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
                        No emails found
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
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Provider</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Attempts</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Sent</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {emails.map((email) => (
                                        <tr key={email.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="text-sm font-medium text-gray-900">{email.toEmail}</div>
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
                                                <span className="text-xs font-medium">{email.provider}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs px-2 py-1 rounded font-medium ${getStatusColor(email.status)}`}>
                                                    {email.status}
                                                </span>
                                                {email.lastError && (
                                                    <div className="text-xs text-red-500 mt-1 max-w-[200px] truncate" title={email.lastError}>
                                                        {email.lastError}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-sm text-gray-600 text-center">
                                                {email.attemptCount}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-gray-500">
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

                        {/* Load More Button */}
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
                                        `Load More (${emails.length} loaded)`
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
