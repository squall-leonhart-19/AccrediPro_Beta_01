"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    AlertCircle,
    CheckCircle,
    XCircle,
    RefreshCw,
    Loader2,
    Mail,
    Wand2,
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
    needs_manual: number;
    no_suggestion: number;
    ignored: number;
}

export default function EmailIssuesPage() {
    const [bounces, setBounces] = useState<EmailBounce[]>([]);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>("pending");
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [editingId, setEditingId] = useState<string | null>(null);
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
                setEditingId(null);
                setManualEmail("");
            } else {
                toast.error(data.error || "Action failed");
            }
        } catch (error) {
            console.error("Action failed:", error);
            toast.error("Action failed");
        }
        setProcessingId(null);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "pending":
                return <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Pending</Badge>;
            case "auto_fixed":
                return <Badge variant="outline" className="bg-green-50 text-green-700">Auto-Fixed</Badge>;
            case "manual_fixed":
                return <Badge variant="outline" className="bg-blue-50 text-blue-700">Manual Fixed</Badge>;
            case "needs_manual":
                return <Badge variant="outline" className="bg-orange-50 text-orange-700">Needs Manual</Badge>;
            case "no_suggestion":
                return <Badge variant="outline" className="bg-gray-50 text-gray-700">No Suggestion</Badge>;
            case "ignored":
                return <Badge variant="outline" className="bg-gray-50 text-gray-500">Ignored</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getConfidenceBadge = (confidence: number | null) => {
        if (!confidence) return null;
        const pct = Math.round(confidence * 100);
        const color = pct >= 90 ? "text-green-600" : pct >= 70 ? "text-yellow-600" : "text-red-600";
        return <span className={`text-xs font-medium ${color}`}>{pct}%</span>;
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Mail className="h-6 w-6" />
                        Email Issues
                    </h1>
                    <p className="text-muted-foreground">
                        Manage bounced emails and AI-suggested fixes
                    </p>
                </div>
                <Button onClick={fetchBounces} variant="outline" disabled={loading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                    Refresh
                </Button>
            </div>

            {/* Summary Cards */}
            {summary && (
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                    <Card
                        className={`cursor-pointer ${filter === "all" ? "ring-2 ring-primary" : ""}`}
                        onClick={() => setFilter("all")}
                    >
                        <CardContent className="pt-4">
                            <div className="text-2xl font-bold">{summary.total}</div>
                            <div className="text-xs text-muted-foreground">Total</div>
                        </CardContent>
                    </Card>
                    <Card
                        className={`cursor-pointer ${filter === "pending" ? "ring-2 ring-primary" : ""}`}
                        onClick={() => setFilter("pending")}
                    >
                        <CardContent className="pt-4">
                            <div className="text-2xl font-bold text-yellow-600">{summary.pending}</div>
                            <div className="text-xs text-muted-foreground">Pending</div>
                        </CardContent>
                    </Card>
                    <Card
                        className={`cursor-pointer ${filter === "needs_manual" ? "ring-2 ring-primary" : ""}`}
                        onClick={() => setFilter("needs_manual")}
                    >
                        <CardContent className="pt-4">
                            <div className="text-2xl font-bold text-orange-600">{summary.needs_manual}</div>
                            <div className="text-xs text-muted-foreground">Needs Manual</div>
                        </CardContent>
                    </Card>
                    <Card
                        className={`cursor-pointer ${filter === "auto_fixed" ? "ring-2 ring-primary" : ""}`}
                        onClick={() => setFilter("auto_fixed")}
                    >
                        <CardContent className="pt-4">
                            <div className="text-2xl font-bold text-green-600">{summary.auto_fixed}</div>
                            <div className="text-xs text-muted-foreground">Auto-Fixed</div>
                        </CardContent>
                    </Card>
                    <Card
                        className={`cursor-pointer ${filter === "no_suggestion" ? "ring-2 ring-primary" : ""}`}
                        onClick={() => setFilter("no_suggestion")}
                    >
                        <CardContent className="pt-4">
                            <div className="text-2xl font-bold text-gray-500">{summary.no_suggestion}</div>
                            <div className="text-xs text-muted-foreground">No Fix Found</div>
                        </CardContent>
                    </Card>
                    <Card
                        className={`cursor-pointer ${filter === "ignored" ? "ring-2 ring-primary" : ""}`}
                        onClick={() => setFilter("ignored")}
                    >
                        <CardContent className="pt-4">
                            <div className="text-2xl font-bold text-gray-400">{summary.ignored}</div>
                            <div className="text-xs text-muted-foreground">Ignored</div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Bounce List */}
            <Card>
                <CardHeader>
                    <CardTitle>
                        {filter === "all" ? "All Issues" : `${filter.replace("_", " ")} Issues`}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    ) : bounces.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                            <p>No email issues in this category!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {bounces.map((bounce) => (
                                <div
                                    key={bounce.id}
                                    className="border rounded-lg p-4 space-y-3"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium">
                                                    {bounce.user.firstName || "Unknown"} {bounce.user.lastName || ""}
                                                </span>
                                                {getStatusBadge(bounce.status)}
                                            </div>
                                            <div className="text-sm text-muted-foreground">
                                                <span className="font-mono text-red-600">
                                                    {bounce.originalEmail}
                                                </span>
                                                {bounce.bounceType === "hard" && (
                                                    <Badge variant="destructive" className="ml-2 text-xs">
                                                        Hard Bounce
                                                    </Badge>
                                                )}
                                            </div>
                                            {bounce.bounceReason && (
                                                <p className="text-xs text-muted-foreground italic">
                                                    {bounce.bounceReason}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right text-xs text-muted-foreground">
                                            <div>Bounced {bounce.bounceCount}x</div>
                                            <div>{new Date(bounce.createdAt).toLocaleDateString()}</div>
                                        </div>
                                    </div>

                                    {/* Suggestion Section */}
                                    {bounce.suggestedEmail && (
                                        <div className="flex items-center gap-2 bg-green-50 p-3 rounded-lg">
                                            <Wand2 className="h-4 w-4 text-green-600" />
                                            <span className="text-sm">AI Suggestion:</span>
                                            <span className="font-mono text-green-700 font-medium">
                                                {bounce.suggestedEmail}
                                            </span>
                                            {getConfidenceBadge(bounce.suggestionConfidence)}
                                            <Badge variant="outline" className="text-xs">
                                                {bounce.suggestionSource}
                                            </Badge>
                                            {bounce.neverBounceResult && (
                                                <Badge
                                                    variant={
                                                        bounce.neverBounceResult === "valid"
                                                            ? "default"
                                                            : "destructive"
                                                    }
                                                    className="text-xs"
                                                >
                                                    NB: {bounce.neverBounceResult}
                                                </Badge>
                                            )}
                                        </div>
                                    )}

                                    {/* Action Buttons */}
                                    {(bounce.status === "pending" || bounce.status === "needs_manual" || bounce.status === "no_suggestion") && (
                                        <div className="flex flex-wrap gap-2">
                                            {bounce.suggestedEmail && (
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleAction(bounce.id, "apply_suggestion")}
                                                    disabled={processingId === bounce.id}
                                                >
                                                    {processingId === bounce.id ? (
                                                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                                    ) : (
                                                        <CheckCircle className="h-4 w-4 mr-1" />
                                                    )}
                                                    Apply Fix
                                                </Button>
                                            )}

                                            {editingId === bounce.id ? (
                                                <div className="flex gap-2">
                                                    <Input
                                                        type="email"
                                                        placeholder="Enter correct email"
                                                        value={manualEmail}
                                                        onChange={(e) => setManualEmail(e.target.value)}
                                                        className="w-64"
                                                    />
                                                    <Button
                                                        size="sm"
                                                        onClick={() =>
                                                            handleAction(bounce.id, "manual_fix", manualEmail)
                                                        }
                                                        disabled={!manualEmail || processingId === bounce.id}
                                                    >
                                                        Save
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => {
                                                            setEditingId(null);
                                                            setManualEmail("");
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setEditingId(bounce.id)}
                                                >
                                                    <Edit2 className="h-4 w-4 mr-1" />
                                                    Manual Edit
                                                </Button>
                                            )}

                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleAction(bounce.id, "retry_detection")}
                                                disabled={processingId === bounce.id}
                                            >
                                                <RefreshCw className="h-4 w-4 mr-1" />
                                                Retry AI
                                            </Button>

                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                className="text-muted-foreground"
                                                onClick={() => handleAction(bounce.id, "ignore")}
                                                disabled={processingId === bounce.id}
                                            >
                                                <XCircle className="h-4 w-4 mr-1" />
                                                Ignore
                                            </Button>
                                        </div>
                                    )}

                                    {/* Fixed Status */}
                                    {(bounce.status === "auto_fixed" || bounce.status === "manual_fixed") && (
                                        <div className="flex items-center gap-2 text-sm text-green-600">
                                            <CheckCircle className="h-4 w-4" />
                                            Fixed on {bounce.fixedAt ? new Date(bounce.fixedAt).toLocaleDateString() : "unknown date"}
                                            {bounce.user.email && (
                                                <span className="font-mono">→ {bounce.user.email}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
