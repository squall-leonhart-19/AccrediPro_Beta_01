"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    CheckCircle,
    XCircle,
    RefreshCw,
    Loader2,
    Mail,
    MoreHorizontal,
    ArrowRight,
    AlertTriangle,
    Clock,
    Ban,
    Sparkles,
    Edit2,
    Download,
    Search,
    AlertOctagon,
    Info,
} from "lucide-react";
import { toast } from "sonner";

interface EmailBounce {
    id: string;
    userId: string;
    originalEmail: string;
    bounceType: string;
    bounceCount: number;
    bounceReason: string | null;
    suggestedEmail: string | null;
    suggestionSource: string | null;
    suggestionConfidence: number | null;
    neverBounceResult: string | null;
    status: string;
    fixedAt: string | null;
    createdAt: string;
    user: {
        id: string;
        email: string | null;
        firstName: string | null;
        lastName: string | null;
    };
}

interface Summary {
    total: number;
    pending: number;
    auto_fixed: number;
    manual_fixed?: number;
    needs_manual: number;
    no_suggestion: number;
    ignored: number;
}

export default function EmailIssuesPage() {
    const [bounces, setBounces] = useState<EmailBounce[]>([]);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedBounce, setSelectedBounce] = useState<EmailBounce | null>(null);
    const [manualEmail, setManualEmail] = useState<string>("");

    const fetchBounces = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/email-issues?status=${filter}`);
            const data = await res.json();
            setBounces(data.bounces || []);
            setSummary(data.summary || null);
        } catch (error) {
            console.error("Failed to fetch bounces:", error);
            toast.error("Failed to load email issues");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBounces();
    }, [filter]);

    // Filter bounces by search query
    const filteredBounces = useMemo(() => {
        if (!searchQuery.trim()) return bounces;
        const query = searchQuery.toLowerCase();
        return bounces.filter(
            (b) =>
                b.originalEmail.toLowerCase().includes(query) ||
                b.suggestedEmail?.toLowerCase().includes(query) ||
                b.user.firstName?.toLowerCase().includes(query) ||
                b.user.lastName?.toLowerCase().includes(query) ||
                b.user.email?.toLowerCase().includes(query)
        );
    }, [bounces, searchQuery]);

    const handleAction = async (
        bounceId: string,
        action: string,
        newEmail?: string
    ) => {
        setProcessingId(bounceId);
        try {
            const res = await fetch("/api/admin/email-issues", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ bounceId, action, newEmail }),
            });
            const data = await res.json();

            if (data.success) {
                toast.success(data.message || "Action completed");
                fetchBounces();
                setEditDialogOpen(false);
                setManualEmail("");
                setSelectedBounce(null);
            } else {
                toast.error(data.error || "Action failed");
            }
        } catch (error) {
            console.error("Action failed:", error);
            toast.error("Action failed");
        }
        setProcessingId(null);
    };

    const openEditDialog = (bounce: EmailBounce) => {
        setSelectedBounce(bounce);
        setManualEmail(bounce.suggestedEmail || "");
        setEditDialogOpen(true);
    };

    // Export to CSV
    const exportCSV = () => {
        const headers = [
            "User Name",
            "Original Email",
            "Suggested Fix",
            "Status",
            "Bounce Type",
            "Bounce Count",
            "Bounce Reason",
            "Fixed Email",
            "Bounce Date",
            "Fixed Date",
        ];

        const rows = filteredBounces.map((b) => [
            `${b.user.firstName || ""} ${b.user.lastName || ""}`.trim() || "Unknown",
            b.originalEmail,
            b.suggestedEmail || "",
            b.status,
            b.bounceType,
            b.bounceCount,
            b.bounceReason || "",
            b.user.email || "",
            formatFullDate(b.createdAt),
            b.fixedAt ? formatFullDate(b.fixedAt) : "",
        ]);

        const csvContent = [
            headers.join(","),
            ...rows.map((row) =>
                row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `email-issues-${new Date().toISOString().split("T")[0]}.csv`;
        link.click();
        toast.success("CSV exported!");
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
            pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: <Clock className="h-3 w-3" /> },
            auto_fixed: { bg: "bg-green-100", text: "text-green-700", icon: <Sparkles className="h-3 w-3" /> },
            manual_fixed: { bg: "bg-blue-100", text: "text-blue-700", icon: <CheckCircle className="h-3 w-3" /> },
            needs_manual: { bg: "bg-orange-100", text: "text-orange-700", icon: <AlertTriangle className="h-3 w-3" /> },
            no_suggestion: { bg: "bg-gray-100", text: "text-gray-600", icon: <XCircle className="h-3 w-3" /> },
            ignored: { bg: "bg-gray-100", text: "text-gray-400", icon: <Ban className="h-3 w-3" /> },
            complained: { bg: "bg-red-100", text: "text-red-700", icon: <AlertOctagon className="h-3 w-3" /> },
        };
        const style = styles[status] || styles.pending;
        return (
            <Badge variant="outline" className={`${style.bg} ${style.text} gap-1 font-medium`}>
                {style.icon}
                {status.replace("_", " ")}
            </Badge>
        );
    };

    const formatFullDate = (date: string) => {
        return new Date(date).toLocaleString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    const formatShortDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const filterButtons = [
        { key: "all", label: "All", count: summary?.total },
        { key: "pending", label: "Pending", count: summary?.pending, color: "text-yellow-600" },
        { key: "needs_manual", label: "Needs Manual", count: summary?.needs_manual, color: "text-orange-600" },
        { key: "auto_fixed", label: "Fixed", count: (summary?.auto_fixed || 0) + (summary?.manual_fixed || 0), color: "text-green-600" },
        { key: "no_suggestion", label: "No Fix", count: summary?.no_suggestion, color: "text-gray-500" },
        { key: "ignored", label: "Ignored", count: summary?.ignored, color: "text-gray-400" },
    ];

    return (
        <TooltipProvider>
            <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Mail className="h-6 w-6" />
                            Email Issues
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Monitor bounced emails, spam complaints, and AI-suggested fixes
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button onClick={exportCSV} variant="outline" size="sm" disabled={filteredBounces.length === 0}>
                            <Download className="h-4 w-4 mr-2" />
                            Export CSV
                        </Button>
                        <Button onClick={fetchBounces} variant="outline" size="sm" disabled={loading}>
                            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Search + Filter */}
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search */}
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by email or name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-1.5 flex-wrap">
                        {filterButtons.map((btn) => (
                            <Button
                                key={btn.key}
                                variant={filter === btn.key ? "default" : "outline"}
                                size="sm"
                                onClick={() => setFilter(btn.key)}
                                className="gap-1.5 h-9"
                            >
                                <span>{btn.label}</span>
                                <span className={`font-bold ${filter !== btn.key ? btn.color || "" : ""}`}>
                                    {btn.count ?? 0}
                                </span>
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                <Card>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="flex items-center justify-center py-16">
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                            </div>
                        ) : filteredBounces.length === 0 ? (
                            <div className="text-center py-16 text-muted-foreground">
                                <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                                <p className="font-medium">No email issues!</p>
                                <p className="text-sm">
                                    {searchQuery ? "No results match your search." : "All bounces have been handled."}
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50">
                                            <TableHead className="w-[150px]">User</TableHead>
                                            <TableHead className="w-[180px]">Bounced Email</TableHead>
                                            <TableHead className="w-[180px]">Suggested Fix</TableHead>
                                            <TableHead className="w-[100px] text-center">Status</TableHead>
                                            <TableHead className="w-[60px] text-center">#</TableHead>
                                            <TableHead className="w-[140px]">Bounce Date</TableHead>
                                            <TableHead className="w-[80px]">Reason</TableHead>
                                            <TableHead className="w-[80px] text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredBounces.map((bounce) => (
                                            <TableRow key={bounce.id} className="hover:bg-muted/30">
                                                <TableCell>
                                                    <div className="font-medium truncate max-w-[140px]">
                                                        {bounce.user.firstName || "Unknown"} {bounce.user.lastName || ""}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <code className="text-xs text-red-600 bg-red-50 px-1.5 py-0.5 rounded truncate block max-w-[170px]">
                                                        {bounce.originalEmail}
                                                    </code>
                                                </TableCell>
                                                <TableCell>
                                                    {bounce.suggestedEmail ? (
                                                        <div className="flex items-center gap-1">
                                                            <ArrowRight className="h-3 w-3 text-green-500 flex-shrink-0" />
                                                            <code className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded truncate max-w-[130px]">
                                                                {bounce.suggestedEmail}
                                                            </code>
                                                            <span className="text-[10px] text-muted-foreground">
                                                                {bounce.suggestionConfidence ? `${Math.round(bounce.suggestionConfidence * 100)}%` : ""}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground italic">—</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {getStatusBadge(bounce.status)}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline" className="font-mono text-xs">
                                                        {bounce.bounceCount}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <span className="text-xs text-muted-foreground cursor-help">
                                                                {formatShortDate(bounce.createdAt)}
                                                            </span>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p className="font-mono text-xs">{formatFullDate(bounce.createdAt)}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TableCell>
                                                <TableCell>
                                                    {bounce.bounceReason ? (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                                                    <Info className="h-3.5 w-3.5 text-muted-foreground" />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="left" className="max-w-[300px]">
                                                                <p className="text-xs">{bounce.bounceReason}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    ) : (
                                                        <span className="text-xs text-muted-foreground">—</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    {bounce.status === "pending" ||
                                                        bounce.status === "needs_manual" ||
                                                        bounce.status === "no_suggestion" ? (
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0" disabled={processingId === bounce.id}>
                                                                    {processingId === bounce.id ? (
                                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                                    ) : (
                                                                        <MoreHorizontal className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                {bounce.suggestedEmail && (
                                                                    <DropdownMenuItem onClick={() => handleAction(bounce.id, "apply_suggestion")}>
                                                                        <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                                                        Apply Fix
                                                                    </DropdownMenuItem>
                                                                )}
                                                                <DropdownMenuItem onClick={() => openEditDialog(bounce)}>
                                                                    <Edit2 className="h-4 w-4 mr-2" />
                                                                    Manual Edit
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem onClick={() => handleAction(bounce.id, "retry_detection")}>
                                                                    <RefreshCw className="h-4 w-4 mr-2" />
                                                                    Retry AI
                                                                </DropdownMenuItem>
                                                                <DropdownMenuItem
                                                                    onClick={() => handleAction(bounce.id, "ignore")}
                                                                    className="text-muted-foreground"
                                                                >
                                                                    <XCircle className="h-4 w-4 mr-2" />
                                                                    Ignore
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    ) : (
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <span className="text-[10px] text-muted-foreground cursor-help">
                                                                    {bounce.fixedAt ? formatShortDate(bounce.fixedAt) : "—"}
                                                                </span>
                                                            </TooltipTrigger>
                                                            {bounce.fixedAt && (
                                                                <TooltipContent>
                                                                    <p className="text-xs">Fixed: {formatFullDate(bounce.fixedAt)}</p>
                                                                </TooltipContent>
                                                            )}
                                                        </Tooltip>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Results count */}
                {!loading && filteredBounces.length > 0 && (
                    <p className="text-xs text-muted-foreground text-center">
                        Showing {filteredBounces.length} of {bounces.length} records
                        {searchQuery && ` matching "${searchQuery}"`}
                    </p>
                )}

                {/* Manual Edit Dialog */}
                <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Manual Email Fix</DialogTitle>
                            <DialogDescription>Enter the correct email address for this user</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <label className="text-sm font-medium">Original Email</label>
                                <code className="block mt-1 text-sm text-red-600 bg-red-50 px-2 py-1.5 rounded">
                                    {selectedBounce?.originalEmail}
                                </code>
                            </div>
                            {selectedBounce?.bounceReason && (
                                <div>
                                    <label className="text-sm font-medium">Bounce Reason</label>
                                    <p className="mt-1 text-xs text-muted-foreground bg-muted px-2 py-1.5 rounded">
                                        {selectedBounce.bounceReason}
                                    </p>
                                </div>
                            )}
                            <div>
                                <label className="text-sm font-medium">Bounce Timestamp</label>
                                <p className="mt-1 text-xs text-muted-foreground font-mono">
                                    {selectedBounce ? formatFullDate(selectedBounce.createdAt) : ""}
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium">Corrected Email</label>
                                <Input
                                    type="email"
                                    placeholder="correct@email.com"
                                    value={manualEmail}
                                    onChange={(e) => setManualEmail(e.target.value)}
                                    className="mt-1"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                                Cancel
                            </Button>
                            <Button
                                onClick={() => selectedBounce && handleAction(selectedBounce.id, "manual_fix", manualEmail)}
                                disabled={!manualEmail || processingId === selectedBounce?.id}
                            >
                                {processingId === selectedBounce?.id ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                )}
                                Apply Fix
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </TooltipProvider>
    );
}
