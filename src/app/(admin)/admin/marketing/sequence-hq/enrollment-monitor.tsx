"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Users,
    RefreshCw,
    Search,
    Play,
    Pause,
    LogOut,
    FastForward,
    Mail,
    Clock,
    User,
    Eye,
    UserPlus,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import { Label } from "@/components/ui/label";

// Types
interface SequenceEmail {
    id: string;
    order: number;
    customSubject: string | null;
}

interface Sequence {
    id: string;
    name: string;
    slug: string;
    emails: SequenceEmail[];
}

interface Enrollment {
    id: string;
    userId: string;
    sequenceId: string;
    status: "ACTIVE" | "COMPLETED" | "EXITED" | "PAUSED";
    currentEmailIndex: number;
    nextSendAt: string | null;
    enrolledAt: string;
    completedAt: string | null;
    exitedAt: string | null;
    exitReason: string | null;
    emailsReceived: number;
    emailsOpened: number;
    emailsClicked: number;
    user: {
        id: string;
        name: string | null;
        email: string;
    };
    sequence: {
        id: string;
        name: string;
        emails: SequenceEmail[];
    };
}

interface EnrollmentMonitorProps {
    sequences: Sequence[];
}

interface SearchedUser {
    id: string;
    email: string;
    firstName: string | null;
    lastName: string | null;
}

const STATUS_COLORS: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-700",
    COMPLETED: "bg-blue-100 text-blue-700",
    EXITED: "bg-gray-100 text-gray-700",
    PAUSED: "bg-amber-100 text-amber-700",
};

export default function EnrollmentMonitor({ sequences }: EnrollmentMonitorProps) {
    const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(20);

    // Filters
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ACTIVE");
    const [sequenceFilter, setSequenceFilter] = useState<string>("");

    // Action modal
    const [actionTarget, setActionTarget] = useState<Enrollment | null>(null);
    const [actionType, setActionType] = useState<"pause" | "resume" | "exit" | "forward" | null>(null);
    const [processing, setProcessing] = useState(false);

    // Enroll modal
    const [enrollModalOpen, setEnrollModalOpen] = useState(false);
    const [enrollSequenceId, setEnrollSequenceId] = useState<string>("");
    const [userSearchQuery, setUserSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<SearchedUser[]>([]);
    const [searching, setSearching] = useState(false);
    const [selectedUser, setSelectedUser] = useState<SearchedUser | null>(null);
    const [enrolling, setEnrolling] = useState(false);

    // Search users for enrollment
    const searchUsers = async (query: string) => {
        if (query.length < 2) {
            setSearchResults([]);
            return;
        }

        setSearching(true);
        try {
            const res = await fetch(`/api/admin/users/search?q=${encodeURIComponent(query)}&limit=10`);
            if (res.ok) {
                const data = await res.json();
                setSearchResults(data.users || []);
            }
        } catch (error) {
            console.error("Failed to search users:", error);
        } finally {
            setSearching(false);
        }
    };

    // Enroll user
    const handleEnrollUser = async () => {
        if (!selectedUser || !enrollSequenceId) return;

        setEnrolling(true);
        try {
            const res = await fetch(`/api/admin/marketing/sequences/${enrollSequenceId}/enroll`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: selectedUser.id }),
            });

            if (res.ok) {
                toast.success(`Enrolled ${selectedUser.email} successfully`);
                setEnrollModalOpen(false);
                setSelectedUser(null);
                setUserSearchQuery("");
                setSearchResults([]);
                setEnrollSequenceId("");
                fetchEnrollments();
            } else {
                const error = await res.json();
                toast.error(error.error || "Failed to enroll user");
            }
        } catch (error) {
            console.error("Failed to enroll user:", error);
            toast.error("Failed to enroll user");
        } finally {
            setEnrolling(false);
        }
    };

    // Fetch enrollments
    const fetchEnrollments = useCallback(async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.set("page", page.toString());
            params.set("pageSize", pageSize.toString());
            if (statusFilter) params.set("status", statusFilter);
            if (sequenceFilter) params.set("sequenceId", sequenceFilter);
            if (searchQuery) params.set("search", searchQuery);

            const res = await fetch(`/api/admin/marketing/sequences/enrollments?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setEnrollments(data.enrollments || []);
                setTotal(data.total || 0);
            }
        } catch (error) {
            console.error("Failed to fetch enrollments:", error);
        } finally {
            setLoading(false);
        }
    }, [page, pageSize, statusFilter, sequenceFilter, searchQuery]);

    useEffect(() => {
        fetchEnrollments();
    }, [fetchEnrollments]);

    // Handle action
    const handleAction = async () => {
        if (!actionTarget || !actionType) return;

        setProcessing(true);
        try {
            const res = await fetch(`/api/admin/marketing/sequences/${actionTarget.sequenceId}/enrollments/${actionTarget.id}/action`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: actionType }),
            });

            if (res.ok) {
                toast.success(`Enrollment ${actionType}ed`);
                setActionTarget(null);
                setActionType(null);
                fetchEnrollments();
            } else {
                toast.error("Action failed");
            }
        } catch (error) {
            console.error("Action failed:", error);
            toast.error("Action failed");
        } finally {
            setProcessing(false);
        }
    };

    // Format date
    const formatDate = (date: string | null) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Format relative time
    const formatRelativeTime = (date: string | null) => {
        if (!date) return "-";
        const d = new Date(date);
        const now = new Date();
        const diff = d.getTime() - now.getTime();

        if (diff < 0) return "Overdue";

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (days > 0) return `in ${days}d ${hours % 24}h`;
        if (hours > 0) return `in ${hours}h`;
        return "Soon";
    };

    const totalPages = Math.ceil(total / pageSize);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-burgundy-600" />
                    Active Enrollments
                </CardTitle>
                <CardDescription>
                    Monitor and manage users currently in sequences
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Filters */}
                <div className="flex flex-wrap gap-4 mb-6">
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search by email or name..."
                            className="pl-9"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[150px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Statuses</SelectItem>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="PAUSED">Paused</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="EXITED">Exited</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={sequenceFilter} onValueChange={setSequenceFilter}>
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="All Sequences" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">All Sequences</SelectItem>
                            {sequences.map((seq) => (
                                <SelectItem key={seq.id} value={seq.id}>
                                    {seq.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Button variant="outline" onClick={fetchEnrollments}>
                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                    <Button onClick={() => setEnrollModalOpen(true)} className="bg-[#C9A227] hover:bg-[#b8922a] text-[#4e1f24]">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Enroll User
                    </Button>
                </div>

                {/* Table */}
                {loading && enrollments.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                        <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
                    </div>
                ) : enrollments.length > 0 ? (
                    <>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Sequence</TableHead>
                                    <TableHead className="text-center">Status</TableHead>
                                    <TableHead className="text-center">Progress</TableHead>
                                    <TableHead className="text-center">Next Email</TableHead>
                                    <TableHead className="text-center">Engagement</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {enrollments.map((enrollment) => {
                                    const emailCount = enrollment.sequence.emails.length;
                                    const progress = emailCount > 0
                                        ? Math.round((enrollment.currentEmailIndex / emailCount) * 100)
                                        : 0;

                                    return (
                                        <TableRow key={enrollment.id}>
                                            <TableCell>
                                                <Link
                                                    href={`/admin/users/${enrollment.userId}`}
                                                    className="hover:underline"
                                                >
                                                    <div>
                                                        <p className="font-medium">
                                                            {enrollment.user.name || "Unknown"}
                                                        </p>
                                                        <p className="text-xs text-gray-500">
                                                            {enrollment.user.email}
                                                        </p>
                                                    </div>
                                                </Link>
                                            </TableCell>
                                            <TableCell>
                                                <p className="text-sm">{enrollment.sequence.name}</p>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge className={STATUS_COLORS[enrollment.status]}>
                                                    {enrollment.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-2">
                                                    <span className="text-sm font-medium">
                                                        {enrollment.currentEmailIndex}/{emailCount}
                                                    </span>
                                                    <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-burgundy-500 transition-all"
                                                            style={{ width: `${progress}%` }}
                                                        />
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {enrollment.status === "ACTIVE" && enrollment.nextSendAt ? (
                                                    <div className="flex items-center justify-center gap-1 text-sm">
                                                        <Clock className="w-3 h-3 text-gray-400" />
                                                        {formatRelativeTime(enrollment.nextSendAt)}
                                                    </div>
                                                ) : (
                                                    <span className="text-gray-400">-</span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <div className="flex items-center justify-center gap-3 text-xs">
                                                    <span className="flex items-center gap-1">
                                                        <Mail className="w-3 h-3" />
                                                        {enrollment.emailsReceived}
                                                    </span>
                                                    <span className="flex items-center gap-1 text-purple-600">
                                                        <Eye className="w-3 h-3" />
                                                        {enrollment.emailsOpened}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    {enrollment.status === "ACTIVE" && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            title="Pause"
                                                            onClick={() => {
                                                                setActionTarget(enrollment);
                                                                setActionType("pause");
                                                            }}
                                                        >
                                                            <Pause className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                    {enrollment.status === "PAUSED" && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            title="Resume"
                                                            onClick={() => {
                                                                setActionTarget(enrollment);
                                                                setActionType("resume");
                                                            }}
                                                        >
                                                            <Play className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                    {(enrollment.status === "ACTIVE" || enrollment.status === "PAUSED") && (
                                                        <>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                title="Skip to next email"
                                                                onClick={() => {
                                                                    setActionTarget(enrollment);
                                                                    setActionType("forward");
                                                                }}
                                                            >
                                                                <FastForward className="w-4 h-4" />
                                                            </Button>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                title="Exit sequence"
                                                                className="text-red-500"
                                                                onClick={() => {
                                                                    setActionTarget(enrollment);
                                                                    setActionType("exit");
                                                                }}
                                                            >
                                                                <LogOut className="w-4 h-4" />
                                                            </Button>
                                                        </>
                                                    )}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-between mt-4">
                                <p className="text-sm text-gray-500">
                                    Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, total)} of {total}
                                </p>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={page === 1}
                                        onClick={() => setPage(page - 1)}
                                    >
                                        Previous
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        disabled={page >= totalPages}
                                        onClick={() => setPage(page + 1)}
                                    >
                                        Next
                                    </Button>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No enrollments found</p>
                        <p className="text-sm text-gray-400">
                            Users will appear here when they enter sequences
                        </p>
                    </div>
                )}
            </CardContent>

            {/* Action Confirmation Modal */}
            <Dialog open={!!actionTarget && !!actionType} onOpenChange={() => { setActionTarget(null); setActionType(null); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {actionType === "pause" && "Pause Enrollment"}
                            {actionType === "resume" && "Resume Enrollment"}
                            {actionType === "exit" && "Exit Enrollment"}
                            {actionType === "forward" && "Skip to Next Email"}
                        </DialogTitle>
                        <DialogDescription>
                            {actionType === "pause" && "This will pause all future emails for this user in this sequence."}
                            {actionType === "resume" && "This will resume sending emails to this user."}
                            {actionType === "exit" && "This will permanently exit the user from this sequence."}
                            {actionType === "forward" && "This will immediately advance the user to the next email."}
                            <br /><br />
                            User: <strong>{actionTarget?.user.email}</strong>
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setActionTarget(null); setActionType(null); }}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAction}
                            disabled={processing}
                            variant={actionType === "exit" ? "destructive" : "default"}
                        >
                            {processing ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                "Confirm"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Enroll User Modal */}
            <Dialog open={enrollModalOpen} onOpenChange={(open) => {
                setEnrollModalOpen(open);
                if (!open) {
                    setSelectedUser(null);
                    setUserSearchQuery("");
                    setSearchResults([]);
                    setEnrollSequenceId("");
                }
            }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <UserPlus className="w-5 h-5 text-[#C9A227]" />
                            Enroll User in Sequence
                        </DialogTitle>
                        <DialogDescription>
                            Search for a user and select a sequence to enroll them in.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {/* Sequence selector */}
                        <div className="space-y-2">
                            <Label>Select Sequence</Label>
                            <Select value={enrollSequenceId} onValueChange={setEnrollSequenceId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a sequence..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {sequences.map((seq) => (
                                        <SelectItem key={seq.id} value={seq.id}>
                                            {seq.name} ({seq.emails.length} emails)
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* User search */}
                        <div className="space-y-2">
                            <Label>Search User</Label>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    placeholder="Search by email or name..."
                                    className="pl-9"
                                    value={userSearchQuery}
                                    onChange={(e) => {
                                        setUserSearchQuery(e.target.value);
                                        searchUsers(e.target.value);
                                    }}
                                />
                            </div>

                            {/* Search results */}
                            {searching && (
                                <div className="text-center py-2 text-sm text-gray-500">
                                    <RefreshCw className="w-4 h-4 animate-spin inline mr-2" />
                                    Searching...
                                </div>
                            )}

                            {searchResults.length > 0 && (
                                <div className="border rounded-lg max-h-40 overflow-y-auto">
                                    {searchResults.map((user) => (
                                        <div
                                            key={user.id}
                                            className={`p-2 cursor-pointer hover:bg-gray-50 border-b last:border-b-0 ${selectedUser?.id === user.id ? "bg-[#C9A227]/10 border-[#C9A227]" : ""
                                                }`}
                                            onClick={() => setSelectedUser(user)}
                                        >
                                            <p className="font-medium text-sm">
                                                {user.firstName || user.lastName
                                                    ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                                                    : "No name"}
                                            </p>
                                            <p className="text-xs text-gray-500">{user.email}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Selected user */}
                            {selectedUser && (
                                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <p className="text-sm font-medium text-green-700">
                                        Selected: {selectedUser.firstName || ""} {selectedUser.lastName || ""}
                                    </p>
                                    <p className="text-xs text-green-600">{selectedUser.email}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setEnrollModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleEnrollUser}
                            disabled={enrolling || !selectedUser || !enrollSequenceId}
                            className="bg-[#C9A227] hover:bg-[#b8922a] text-[#4e1f24]"
                        >
                            {enrolling ? (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Enrolling...
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4 mr-2" />
                                    Enroll User
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
