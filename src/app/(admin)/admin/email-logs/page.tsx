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
    const [statusFilter, setStatusFilter] = useState("all");
    const [emailSearch, setEmailSearch] = useState("");

    const fetchEmails = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (statusFilter !== "all") params.set("status", statusFilter);
            if (emailSearch) params.set("email", emailSearch);

            const res = await fetch(`/api/admin/email-logs?${params}`);
            const data = await res.json();
            setEmails(data.emails || []);
            setStats(data.stats || null);
        } catch (error) {
            console.error("Failed to fetch email logs:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmails();
    }, [statusFilter]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        fetchEmails();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "SENT": return "bg-green-100 text-green-800";
            case "DELIVERED": return "bg-blue-100 text-blue-800";
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
                <h1 className="text-2xl font-bold text-gray-900">Email Logs</h1>
                <button
                    onClick={fetchEmails}
                    className="px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700"
                >
                    Refresh
                </button>
            </div>

            {/* Stats Cards */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 border">
                        <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                        <div className="text-sm text-gray-500">Total</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                        <div className="text-2xl font-bold text-green-700">{stats.sent}</div>
                        <div className="text-sm text-green-600">Sent</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                        <div className="text-2xl font-bold text-blue-700">{stats.delivered}</div>
                        <div className="text-sm text-blue-600">Delivered</div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                        <div className="text-2xl font-bold text-red-700">{stats.failed}</div>
                        <div className="text-sm text-red-600">Failed</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                        <div className="text-2xl font-bold text-orange-700">{stats.bounced}</div>
                        <div className="text-sm text-orange-600">Bounced</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="text-2xl font-bold text-gray-700">{stats.queued}</div>
                        <div className="text-sm text-gray-600">Queued</div>
                    </div>
                </div>
            )}

            {/* Filters */}
            <div className="bg-white rounded-lg p-4 mb-6 border flex flex-wrap gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 border rounded-lg"
                    >
                        <option value="all">All Status</option>
                        <option value="SENT">Sent</option>
                        <option value="DELIVERED">Delivered</option>
                        <option value="FAILED">Failed</option>
                        <option value="BOUNCED">Bounced</option>
                        <option value="QUEUED">Queued</option>
                        <option value="SENDING">Sending</option>
                    </select>
                </div>
                <form onSubmit={handleSearch} className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Search Email</label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={emailSearch}
                            onChange={(e) => setEmailSearch(e.target.value)}
                            placeholder="Search by email address..."
                            className="flex-1 px-3 py-2 border rounded-lg"
                        />
                        <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded-lg">
                            Search
                        </button>
                    </div>
                </form>
            </div>

            {/* Email Table */}
            <div className="bg-white rounded-lg border overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-gray-500">Loading...</div>
                ) : emails.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No emails found</div>
                ) : (
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">To</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Subject</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Type</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Provider</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Attempts</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Sent</th>
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
                                        <div className="text-sm text-gray-900 max-w-xs truncate">{email.subject}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                                            {email.emailType || "-"}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className="text-xs">{email.provider}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(email.status)}`}>
                                            {email.status}
                                        </span>
                                        {email.lastError && (
                                            <div className="text-xs text-red-500 mt-1 max-w-xs truncate" title={email.lastError}>
                                                {email.lastError}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
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
                )}
            </div>
        </div>
    );
}
