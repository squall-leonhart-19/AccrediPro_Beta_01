"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

    const getStatusBadge = (status: string) => {
        const styles: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
            pending: { bg: "bg-yellow-100", text: "text-yellow-700", icon: <Clock className="h-3 w-3" /> },
            auto_fixed: { bg: "bg-green-100", text: "text-green-700", icon: <Sparkles className="h-3 w-3" /> },
            manual_fixed: { bg: "bg-blue-100", text: "text-blue-700", icon: <CheckCircle className="h-3 w-3" /> },
            needs_manual: { bg: "bg-orange-100", text: "text-orange-700", icon: <AlertTriangle className="h-3 w-3" /> },
            no_suggestion: { bg: "bg-gray-100", text: "text-gray-600", icon: <XCircle className="h-3 w-3" /> },
            ignored: { bg: "bg-gray-100", text: "text-gray-400", icon: <Ban className="h-3 w-3" /> },
        };
        const style = styles[status] || styles.pending;
        return (
            <Badge variant="outline" className={`${style.bg} ${style.text} gap-1 font-medium`}>
                {style.icon}
                {status.replace("_", " ")}
            </Badge>
        );
    };

    const formatDate = (date: string) => {
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
        { key: "auto_fixed", label: "Auto-Fixed", count: (summary?.auto_fixed || 0) + (summary?.manual_fixed || 0), color: "text-green-600" },
        { key: "no_suggestion", label: "No Fix", count: summary?.no_suggestion, color: "text-gray-500" },
        { key: "ignored", label: "Ignored", count: summary?.ignored, color: "text-gray-400" },
    ];

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Mail className="h-6 w-6" />
                        Email Issues
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Monitor bounced emails and AI-suggested fixes
                    </p>
                </div>
                <Button onClick={fetchBounces} variant="outline" size="sm" disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 flex-wrap">
                {filterButtons.map((btn) => (
                    <Button
                        key={btn.key}
                        variant={filter === btn.key ? "default" : "outline"}
                        size="sm"
                        onClick={() => setFilter(btn.key)}
                        className="gap-2"
                    >
                        <span>{btn.label}</span>
                        <span className={`font-bold ${btn.color || ""}`}>
                            {btn.count ?? 0}
                        </span>
                    </Button>
                ))}
            </div>

            {/* Table */}
            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : bounces.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground">
                            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
                            <p className="font-medium">No email issues!</p>
                            <p className="text-sm">All bounces have been handled.</p>
                        </div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-muted/50">
                                    <TableHead className="w-[180px]">User</TableHead>
                                    <TableHead className="w-[200px]">Bounced Email</TableHead>
                                    <TableHead className="w-[200px]">Suggested Fix</TableHead>
                                    <TableHead className="w-[100px] text-center">Status</TableHead>
                                    <TableHead className="w-[80px] text-center">Count</TableHead>
                                    <TableHead className="w-[120px]">Date</TableHead>
                                    <TableHead className="w-[100px] text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {bounces.map((bounce) => (
                                    <TableRow key={bounce.id} className="hover:bg-muted/30">
                                        <TableCell>
                                            <div className="font-medium truncate max-w-[170px]">
                                                {bounce.user.firstName || "Unknown"} {bounce.user.lastName || ""}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <code className="text-xs text-red-600 bg-red-50 px-1.5 py-0.5 rounded truncate block max-w-[190px]">
                                                {bounce.originalEmail}
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            {bounce.suggestedEmail ? (
                                                <div className="flex items-center gap-1.5">
                                                    <ArrowRight className="h-3 w-3 text-green-500 flex-shrink-0" />
                                                    <code className="text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded truncate max-w-[160px]">
                                                        {bounce.suggestedEmail}
                                                    </code>
                                                    <span className="text-xs text-muted-foreground">
                                                        {bounce.suggestionConfidence ? `${Math.round(bounce.suggestionConfidence * 100)}%` : ""}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-muted-foreground italic">No suggestion</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            {getStatusBadge(bounce.status)}
                                        </TableCell>
                                        <TableCell className="text-center">
                                            <Badge variant="outline" className="font-mono">
                                                {bounce.bounceCount}x
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground">
                                            {formatDate(bounce.createdAt)}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {(bounce.status === "pending" || bounce.status === "needs_manual" || bounce.status === "no_suggestion") ? (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="sm" disabled={processingId === bounce.id}>
                                                            {processingId === bounce.id ? (
                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                            ) : (
                                                                <MoreHorizontal className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        {bounce.suggestedEmail && (
                                                            <DropdownMenuItem
                                                                onClick={() => handleAction(bounce.id, "apply_suggestion")}
                                                            >
                                                                <CheckCircle className="h-4 w-4 mr-2 text-green-600" />
                                                                Apply Fix
                                                            </DropdownMenuItem>
                                                        )}
                                                        <DropdownMenuItem onClick={() => openEditDialog(bounce)}>
                                                            <Edit2 className="h-4 w-4 mr-2" />
                                                            Manual Edit
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => handleAction(bounce.id, "retry_detection")}
                                                        >
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
                                                <span className="text-xs text-muted-foreground">
                                                    {bounce.fixedAt ? formatDate(bounce.fixedAt) : "—"}
                                                </span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Manual Edit Dialog */}
            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Manual Email Fix</DialogTitle>
                        <DialogDescription>
                            Enter the correct email address for this user
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <label className="text-sm font-medium">Original Email</label>
                            <code className="block mt-1 text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                                {selectedBounce?.originalEmail}
                            </code>
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
    );
}
