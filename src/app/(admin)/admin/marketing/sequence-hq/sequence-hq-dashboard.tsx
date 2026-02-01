"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Mail,
    Plus,
    RefreshCw,
    Settings,
    Play,
    Pause,
    Trash2,
    Copy,
    Edit,
    MoreVertical,
    Zap,
    Users,
    Send,
    Eye,
    MousePointer,
    Tag,
    Upload,
    CheckCircle,
    XCircle,
    Clock,
    ChevronRight,
    ArrowLeft,
    AlertCircle,
    Infinity,
    TrendingUp,
    UserCheck,
    Award,
    LogIn,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import SequenceBuilder from "./sequence-builder";
import EnrollmentMonitor from "./enrollment-monitor";
import { TagCombobox } from "@/components/ui/tag-combobox";

// Types
interface SequenceEmail {
    id: string;
    order: number;
    customSubject: string | null;
    customContent: string | null;
    delayDays: number;
    delayHours: number;
    isActive: boolean;
    sentCount: number;
    openCount: number;
    clickCount: number;
}

interface MarketingTag {
    id: string;
    name: string;
    slug: string;
    color: string;
}

interface Sequence {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    triggerType: string;
    triggerTagId: string | null;
    triggerTag: MarketingTag | null;
    exitTagId: string | null;
    exitTag: MarketingTag | null;
    exitOnReply: boolean;
    exitOnClick: boolean;
    isActive: boolean;
    isSystem: boolean;
    priority: number;
    courseCategory: string | null;
    totalEnrolled: number;
    totalCompleted: number;
    totalExited: number;
    emails: SequenceEmail[];
    emailCount: number;
    enrollmentCount: number;
    createdAt: string;
}

interface Stats {
    totalSequences: number;
    activeSequences: number;
    totalEmails: number;
    totalEnrolled: number;
    totalSent: number;
    totalOpens: number;
    totalClicks: number;
}

const TRIGGER_TYPES = [
    { value: "TAG_ADDED", label: "When Tag Added", icon: Tag },
    { value: "USER_REGISTERED", label: "User Registered", icon: Users },
    { value: "MINI_DIPLOMA_STARTED", label: "Mini Diploma Started", icon: Play },
    { value: "MINI_DIPLOMA_COMPLETED", label: "Mini Diploma Completed", icon: CheckCircle },
    { value: "TRAINING_STARTED", label: "Training Started", icon: Play },
    { value: "CHALLENGE_STARTED", label: "Challenge Started", icon: Zap },
    { value: "CHALLENGE_COMPLETED", label: "Challenge Completed", icon: CheckCircle },
    { value: "COURSE_ENROLLED", label: "Course Enrolled", icon: Users },
    { value: "MANUAL", label: "Manual Enrollment", icon: Settings },
];

export default function SequenceHQDashboard() {
    // State
    const [sequences, setSequences] = useState<Sequence[]>([]);
    const [tags, setTags] = useState<MarketingTag[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("leads");

    // Selected sequence for builder view
    const [selectedSequence, setSelectedSequence] = useState<Sequence | null>(null);

    // Create modal
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [newSequence, setNewSequence] = useState({
        name: "",
        description: "",
        triggerType: "MANUAL",
        triggerTagId: "",
        exitTagId: "",
    });

    // Delete confirmation
    const [deleteTarget, setDeleteTarget] = useState<Sequence | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Import modal
    const [importModalOpen, setImportModalOpen] = useState(false);
    const [importing, setImporting] = useState(false);

    // Stats
    const [stats, setStats] = useState<Stats>({
        totalSequences: 0,
        activeSequences: 0,
        totalEmails: 0,
        totalEnrolled: 0,
        totalSent: 0,
        totalOpens: 0,
        totalClicks: 0,
    });

    // Evergreen stats
    interface EvergreenStats {
        sequences: Record<string, { name: string; emails: number; sent: number; description: string }>;
        totals: { totalBuyers: number; neverLoggedIn: number; withProgress: number; totalSent: number };
    }
    const [evergreenStats, setEvergreenStats] = useState<EvergreenStats | null>(null);
    const [evergreenLoading, setEvergreenLoading] = useState(false);

    // Fetch data
    const fetchSequences = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/marketing/sequences");
            if (res.ok) {
                const data = await res.json();
                setSequences(data.sequences || []);

                // Calculate stats
                const seqs = data.sequences || [];
                const activeCount = seqs.filter((s: Sequence) => s.isActive).length;
                const emailCount = seqs.reduce((acc: number, s: Sequence) => acc + s.emailCount, 0);
                const enrolledCount = seqs.reduce((acc: number, s: Sequence) => acc + s.totalEnrolled, 0);
                const sentCount = seqs.reduce((acc: number, s: Sequence) =>
                    acc + s.emails.reduce((e: number, em: SequenceEmail) => e + em.sentCount, 0), 0);
                const openCount = seqs.reduce((acc: number, s: Sequence) =>
                    acc + s.emails.reduce((e: number, em: SequenceEmail) => e + em.openCount, 0), 0);
                const clickCount = seqs.reduce((acc: number, s: Sequence) =>
                    acc + s.emails.reduce((e: number, em: SequenceEmail) => e + em.clickCount, 0), 0);

                setStats({
                    totalSequences: seqs.length,
                    activeSequences: activeCount,
                    totalEmails: emailCount,
                    totalEnrolled: enrolledCount,
                    totalSent: sentCount,
                    totalOpens: openCount,
                    totalClicks: clickCount,
                });
            }
        } catch (error) {
            console.error("Failed to fetch sequences:", error);
            toast.error("Failed to load sequences");
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchTags = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/marketing/tags");
            if (res.ok) {
                const data = await res.json();
                setTags(data.tags || []);
            }
        } catch (error) {
            console.error("Failed to fetch tags:", error);
        }
    }, []);

    const fetchEvergreenStats = useCallback(async () => {
        setEvergreenLoading(true);
        try {
            const res = await fetch("/api/admin/marketing/evergreen-stats");
            if (res.ok) {
                const data = await res.json();
                setEvergreenStats(data);
            }
        } catch (error) {
            console.error("Failed to fetch evergreen stats:", error);
        } finally {
            setEvergreenLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSequences();
        fetchTags();
    }, [fetchSequences, fetchTags]);

    // Fetch evergreen stats when tab changes to evergreen
    useEffect(() => {
        if (activeTab === "evergreen" && !evergreenStats) {
            fetchEvergreenStats();
        }
    }, [activeTab, evergreenStats, fetchEvergreenStats]);

    // Toggle sequence active state
    const toggleSequenceActive = async (sequence: Sequence) => {
        try {
            const res = await fetch(`/api/admin/marketing/sequences/${sequence.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !sequence.isActive }),
            });

            if (res.ok) {
                setSequences(prev =>
                    prev.map(s => s.id === sequence.id ? { ...s, isActive: !s.isActive } : s)
                );
                toast.success(`Sequence ${!sequence.isActive ? "activated" : "paused"}`);
            } else {
                toast.error("Failed to update sequence");
            }
        } catch (error) {
            console.error("Failed to toggle sequence:", error);
            toast.error("Failed to update sequence");
        }
    };

    // Create new sequence
    const handleCreateSequence = async () => {
        if (!newSequence.name.trim()) {
            toast.error("Sequence name is required");
            return;
        }

        setCreating(true);
        try {
            const res = await fetch("/api/admin/marketing/sequences", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: newSequence.name,
                    description: newSequence.description || null,
                    triggerType: newSequence.triggerType,
                    triggerTagId: newSequence.triggerTagId || null,
                    exitTagId: newSequence.exitTagId && newSequence.exitTagId !== "none" ? newSequence.exitTagId : null,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                toast.success("Sequence created!");
                setCreateModalOpen(false);
                setNewSequence({ name: "", description: "", triggerType: "MANUAL", triggerTagId: "", exitTagId: "" });
                fetchSequences();
                // Open builder for new sequence
                setSelectedSequence(data.sequence);
            } else {
                const error = await res.json();
                toast.error(error.error || "Failed to create sequence");
            }
        } catch (error) {
            console.error("Failed to create sequence:", error);
            toast.error("Failed to create sequence");
        } finally {
            setCreating(false);
        }
    };

    // Delete sequence
    const handleDeleteSequence = async () => {
        if (!deleteTarget) return;

        setDeleting(true);
        try {
            const res = await fetch(`/api/admin/marketing/sequences/${deleteTarget.id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Sequence deleted");
                setDeleteTarget(null);
                fetchSequences();
            } else {
                toast.error("Failed to delete sequence");
            }
        } catch (error) {
            console.error("Failed to delete sequence:", error);
            toast.error("Failed to delete sequence");
        } finally {
            setDeleting(false);
        }
    };

    // Duplicate sequence (with all emails)
    const handleDuplicateSequence = async (sequence: Sequence) => {
        try {
            const res = await fetch(`/api/admin/marketing/sequences/${sequence.id}/duplicate`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            if (res.ok) {
                const data = await res.json();
                toast.success(`Sequence duplicated with ${data.emailsCloned} emails`);
                fetchSequences();
            } else {
                toast.error("Failed to duplicate sequence");
            }
        } catch (error) {
            console.error("Failed to duplicate sequence:", error);
            toast.error("Failed to duplicate sequence");
        }
    };

    // Import recovery emails
    const handleImportRecoveryEmails = async () => {
        setImporting(true);
        try {
            const res = await fetch("/api/admin/marketing/sequences/import-recovery-emails", {
                method: "POST",
            });

            if (res.ok) {
                const data = await res.json();
                toast.success(`Imported ${data.imported} sequences with ${data.emails} emails`);
                setImportModalOpen(false);
                fetchSequences();
            } else {
                const error = await res.json();
                toast.error(error.error || "Failed to import");
            }
        } catch (error) {
            console.error("Failed to import:", error);
            toast.error("Failed to import recovery emails");
        } finally {
            setImporting(false);
        }
    };

    // If viewing sequence builder
    if (selectedSequence) {
        return (
            <SequenceBuilder
                sequence={selectedSequence}
                onBack={() => {
                    setSelectedSequence(null);
                    fetchSequences();
                }}
                onUpdate={(updated) => {
                    setSelectedSequence(updated);
                    setSequences(prev => prev.map(s => s.id === updated.id ? updated : s));
                }}
            />
        );
    }

    // Loading state
    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <RefreshCw className="w-10 h-10 animate-spin text-burgundy-500 mx-auto mb-4" />
                    <p className="text-gray-500">Loading Sequence HQ...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#4e1f24] via-[#722f37] to-[#4e1f24] -mx-6 -mt-6 px-6 py-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/admin/marketing">
                            <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Zap className="w-6 h-6 text-[#C9A227]" />
                                Sequence HQ
                            </h1>
                            <p className="text-[#C9A227] text-sm">Full email automation command center</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            className="!bg-transparent !border-white/40 !text-white hover:!bg-white/10"
                            onClick={() => setImportModalOpen(true)}
                        >
                            <Upload className="w-4 h-4 mr-2" />
                            Import Templates
                        </Button>
                        <Button
                            className="bg-[#C9A227] hover:bg-[#b8922a] text-[#4e1f24] font-semibold"
                            onClick={() => setCreateModalOpen(true)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Create Sequence
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                <Card>
                    <CardContent className="pt-4 pb-4">
                        <p className="text-xs text-gray-500">Sequences</p>
                        <p className="text-2xl font-bold">{stats.totalSequences}</p>
                    </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-200">
                    <CardContent className="pt-4 pb-4">
                        <p className="text-xs text-green-600">Active</p>
                        <p className="text-2xl font-bold text-green-700">{stats.activeSequences}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4 pb-4">
                        <p className="text-xs text-gray-500">Total Emails</p>
                        <p className="text-2xl font-bold">{stats.totalEmails}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4 pb-4">
                        <p className="text-xs text-gray-500">Enrolled</p>
                        <p className="text-2xl font-bold">{stats.totalEnrolled.toLocaleString()}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4 pb-4">
                        <p className="text-xs text-gray-500">Sent</p>
                        <p className="text-2xl font-bold">{stats.totalSent.toLocaleString()}</p>
                    </CardContent>
                </Card>
                <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="pt-4 pb-4">
                        <p className="text-xs text-purple-600">Opens</p>
                        <p className="text-2xl font-bold text-purple-700">{stats.totalOpens.toLocaleString()}</p>
                    </CardContent>
                </Card>
                <Card className="bg-amber-50 border-amber-200">
                    <CardContent className="pt-4 pb-4">
                        <p className="text-xs text-amber-600">Clicks</p>
                        <p className="text-2xl font-bold text-amber-700">{stats.totalClicks.toLocaleString()}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                    <TabsTrigger value="leads" className="gap-2">
                        <Users className="w-4 h-4" />
                        Lead Sequences
                    </TabsTrigger>
                    <TabsTrigger value="students" className="gap-2">
                        <Mail className="w-4 h-4" />
                        Student Sequences
                    </TabsTrigger>
                    <TabsTrigger value="enrollments" className="gap-2">
                        <Users className="w-4 h-4" />
                        Enrollments
                    </TabsTrigger>
                    <TabsTrigger value="evergreen" className="gap-2">
                        <Infinity className="w-4 h-4" />
                        Evergreen Buyers
                    </TabsTrigger>
                    <TabsTrigger value="triggers" className="gap-2">
                        <Tag className="w-4 h-4" />
                        Triggers
                    </TabsTrigger>
                </TabsList>


                {/* Lead Sequences Tab (Mini Diploma / Free) */}
                <TabsContent value="leads">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-blue-600" />
                                    Lead Sequences
                                </CardTitle>
                                <CardDescription>
                                    Email automations for Mini Diploma leads and free users
                                </CardDescription>
                            </div>
                            <Button variant="outline" size="sm" onClick={fetchSequences}>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Refresh
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {(() => {
                                const leadSequences = sequences.filter(s =>
                                    s.courseCategory === "MINI_DIPLOMA" ||
                                    s.triggerType === "MINI_DIPLOMA_STARTED" ||
                                    s.triggerType === "MINI_DIPLOMA_COMPLETED" ||
                                    s.triggerType === "USER_REGISTERED" ||
                                    (s.triggerTag?.name?.toLowerCase().includes("mini") || false)
                                );

                                return leadSequences.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Sequence</TableHead>
                                                <TableHead className="text-center">Status</TableHead>
                                                <TableHead className="text-center">Trigger</TableHead>
                                                <TableHead className="text-center">Emails</TableHead>
                                                <TableHead className="text-center">Enrolled</TableHead>
                                                <TableHead className="text-center">Sent</TableHead>
                                                <TableHead className="text-center">Opens</TableHead>
                                                <TableHead className="text-center">Clicks</TableHead>
                                                <TableHead></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {leadSequences.map((seq) => {
                                                const totalSent = seq.emails.reduce((a, e) => a + e.sentCount, 0);
                                                const totalOpens = seq.emails.reduce((a, e) => a + e.openCount, 0);
                                                const totalClicks = seq.emails.reduce((a, e) => a + e.clickCount, 0);
                                                const openRate = totalSent > 0 ? Math.round((totalOpens / totalSent) * 100) : 0;
                                                const clickRate = totalSent > 0 ? Math.round((totalClicks / totalSent) * 100) : 0;

                                                return (
                                                    <TableRow
                                                        key={seq.id}
                                                        className="cursor-pointer hover:bg-gray-50"
                                                        onClick={() => setSelectedSequence(seq)}
                                                    >
                                                        <TableCell>
                                                            <div>
                                                                <p className="font-medium flex items-center gap-2">
                                                                    {seq.name}
                                                                    {seq.isSystem && (
                                                                        <span className="text-xs border border-gray-300 rounded px-1.5 py-0.5 text-gray-500">System</span>
                                                                    )}
                                                                </p>
                                                                <p className="text-xs text-gray-500 line-clamp-1">
                                                                    {seq.description || "No description"}
                                                                </p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <div className="inline-flex items-center" onClick={(e) => e.stopPropagation()}>
                                                                <Switch checked={seq.isActive} onCheckedChange={() => toggleSequenceActive(seq)} />
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <div className="flex flex-col items-center gap-0.5">
                                                                <Badge variant="outline" className="text-xs">
                                                                    {seq.triggerType.replace(/_/g, " ")}
                                                                </Badge>
                                                                {seq.triggerType === "TAG_ADDED" && seq.triggerTag && (
                                                                    <span className="text-[10px] text-gray-500">→ {seq.triggerTag.name}</span>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center font-medium">{seq.emailCount}</TableCell>
                                                        <TableCell className="text-center">{seq.totalEnrolled.toLocaleString()}</TableCell>
                                                        <TableCell className="text-center">{totalSent.toLocaleString()}</TableCell>
                                                        <TableCell className="text-center">
                                                            <span className={openRate >= 30 ? "text-green-600" : openRate >= 20 ? "text-amber-600" : "text-gray-500"}>
                                                                {openRate}%
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <span className={clickRate >= 5 ? "text-green-600" : clickRate >= 2 ? "text-amber-600" : "text-gray-500"}>
                                                                {clickRate}%
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div onClick={(e) => e.stopPropagation()}>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" size="sm"><MoreVertical className="w-4 h-4" /></Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem onClick={() => setSelectedSequence(seq)}>
                                                                            <Edit className="w-4 h-4 mr-2" /> Edit Emails
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={() => handleDuplicateSequence(seq)}>
                                                                            <Copy className="w-4 h-4 mr-2" /> Duplicate
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem className="text-red-600" onClick={() => setDeleteTarget(seq)} disabled={seq.isSystem}>
                                                                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-12">
                                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 mb-2">No lead sequences</p>
                                        <p className="text-sm text-gray-400 mb-4">
                                            Create sequences for Mini Diploma leads
                                        </p>
                                        <div className="flex gap-2 justify-center">
                                            <Button variant="outline" onClick={() => setImportModalOpen(true)}>
                                                <Upload className="w-4 h-4 mr-2" /> Import Templates
                                            </Button>
                                            <Button onClick={() => setCreateModalOpen(true)}>
                                                <Plus className="w-4 h-4 mr-2" /> Create Sequence
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })()}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Student Sequences Tab (Purchases / Paid) */}
                <TabsContent value="students">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="flex items-center gap-2">
                                    <Mail className="w-5 h-5 text-green-600" />
                                    Student Sequences
                                </CardTitle>
                                <CardDescription>
                                    Email automations for paying students and course enrollees
                                </CardDescription>
                            </div>
                            <Button variant="outline" size="sm" onClick={fetchSequences}>
                                <RefreshCw className="w-4 h-4 mr-2" />
                                Refresh
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {(() => {
                                const studentSequences = sequences.filter(s =>
                                    s.courseCategory === "FUNCTIONAL_MEDICINE" ||
                                    s.courseCategory === "NUTRITION" ||
                                    s.triggerType === "COURSE_ENROLLED" ||
                                    s.triggerType === "TRAINING_STARTED" ||
                                    s.triggerType === "CHALLENGE_STARTED" ||
                                    s.triggerType === "CHALLENGE_COMPLETED" ||
                                    (s.courseCategory !== "MINI_DIPLOMA" && s.triggerType !== "MINI_DIPLOMA_STARTED" && s.triggerType !== "MINI_DIPLOMA_COMPLETED" && s.triggerType !== "USER_REGISTERED" && s.triggerType !== "MANUAL")
                                );

                                return studentSequences.length > 0 ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Sequence</TableHead>
                                                <TableHead className="text-center">Status</TableHead>
                                                <TableHead className="text-center">Trigger</TableHead>
                                                <TableHead className="text-center">Course</TableHead>
                                                <TableHead className="text-center">Emails</TableHead>
                                                <TableHead className="text-center">Enrolled</TableHead>
                                                <TableHead className="text-center">Sent</TableHead>
                                                <TableHead className="text-center">Opens</TableHead>
                                                <TableHead className="text-center">Clicks</TableHead>
                                                <TableHead></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {studentSequences.map((seq) => {
                                                const totalSent = seq.emails.reduce((a, e) => a + e.sentCount, 0);
                                                const totalOpens = seq.emails.reduce((a, e) => a + e.openCount, 0);
                                                const totalClicks = seq.emails.reduce((a, e) => a + e.clickCount, 0);
                                                const openRate = totalSent > 0 ? Math.round((totalOpens / totalSent) * 100) : 0;
                                                const clickRate = totalSent > 0 ? Math.round((totalClicks / totalSent) * 100) : 0;

                                                return (
                                                    <TableRow
                                                        key={seq.id}
                                                        className="cursor-pointer hover:bg-gray-50"
                                                        onClick={() => setSelectedSequence(seq)}
                                                    >
                                                        <TableCell>
                                                            <div>
                                                                <p className="font-medium flex items-center gap-2">
                                                                    {seq.name}
                                                                    {seq.isSystem && (
                                                                        <span className="text-xs border border-gray-300 rounded px-1.5 py-0.5 text-gray-500">System</span>
                                                                    )}
                                                                </p>
                                                                <p className="text-xs text-gray-500 line-clamp-1">
                                                                    {seq.description || "No description"}
                                                                </p>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <div className="inline-flex items-center" onClick={(e) => e.stopPropagation()}>
                                                                <Switch checked={seq.isActive} onCheckedChange={() => toggleSequenceActive(seq)} />
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <div className="flex flex-col items-center gap-0.5">
                                                                <Badge variant="outline" className="text-xs">
                                                                    {seq.triggerType.replace(/_/g, " ")}
                                                                </Badge>
                                                                {seq.triggerType === "TAG_ADDED" && seq.triggerTag && (
                                                                    <span className="text-[10px] text-gray-500">→ {seq.triggerTag.name}</span>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <Badge
                                                                variant="outline"
                                                                className={`text-xs ${seq.courseCategory === "FUNCTIONAL_MEDICINE" ? "border-green-300 bg-green-50 text-green-700" :
                                                                    seq.courseCategory === "NUTRITION" ? "border-orange-300 bg-orange-50 text-orange-700" :
                                                                        "border-gray-300 bg-gray-50 text-gray-600"
                                                                    }`}
                                                            >
                                                                {seq.courseCategory ? seq.courseCategory.replace(/_/g, " ") : "All Courses"}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-center font-medium">{seq.emailCount}</TableCell>
                                                        <TableCell className="text-center">{seq.totalEnrolled.toLocaleString()}</TableCell>
                                                        <TableCell className="text-center">{totalSent.toLocaleString()}</TableCell>
                                                        <TableCell className="text-center">
                                                            <span className={openRate >= 30 ? "text-green-600" : openRate >= 20 ? "text-amber-600" : "text-gray-500"}>
                                                                {openRate}%
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-center">
                                                            <span className={clickRate >= 5 ? "text-green-600" : clickRate >= 2 ? "text-amber-600" : "text-gray-500"}>
                                                                {clickRate}%
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <div onClick={(e) => e.stopPropagation()}>
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" size="sm"><MoreVertical className="w-4 h-4" /></Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem onClick={() => setSelectedSequence(seq)}>
                                                                            <Edit className="w-4 h-4 mr-2" /> Edit Emails
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem onClick={() => handleDuplicateSequence(seq)}>
                                                                            <Copy className="w-4 h-4 mr-2" /> Duplicate
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuSeparator />
                                                                        <DropdownMenuItem className="text-red-600" onClick={() => setDeleteTarget(seq)} disabled={seq.isSystem}>
                                                                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="text-center py-12">
                                        <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500 mb-2">No student sequences yet</p>
                                        <p className="text-sm text-gray-400 mb-4">
                                            Create sequences for paying students: welcome emails, re-activation, completion, etc.
                                        </p>
                                        <div className="flex gap-2 justify-center">
                                            <Button onClick={() => setCreateModalOpen(true)}>
                                                <Plus className="w-4 h-4 mr-2" /> Create Sequence
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })()}
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Enrollments Tab */}
                <TabsContent value="enrollments">
                    <EnrollmentMonitor sequences={sequences} />
                </TabsContent>

                {/* Evergreen Buyers Tab - Automatic for ALL buyers */}
                <TabsContent value="evergreen">
                    <div className="space-y-6">
                        {/* Header Banner */}
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center shrink-0">
                                        <Infinity className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">Evergreen Buyer Sequences</h3>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Automatic sequences for <strong>ALL course purchases</strong>. Triggers based on login, progress, and milestones.
                                        </p>
                                        <Badge className="mt-2 bg-green-100 text-green-700 border-green-300">
                                            ACTIVE • Runs Hourly
                                        </Badge>
                                    </div>
                                </div>
                                <Button variant="outline" size="sm" onClick={fetchEvergreenStats} disabled={evergreenLoading}>
                                    <RefreshCw className={`w-4 h-4 mr-2 ${evergreenLoading ? 'animate-spin' : ''}`} />
                                    Refresh
                                </Button>
                            </div>
                        </div>

                        {/* Stats Overview Cards */}
                        {evergreenStats && (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <Card>
                                    <CardContent className="pt-4 pb-4">
                                        <p className="text-xs text-gray-500">Total Buyers</p>
                                        <p className="text-2xl font-bold">{evergreenStats.totals.totalBuyers.toLocaleString()}</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-red-50 border-red-200">
                                    <CardContent className="pt-4 pb-4">
                                        <p className="text-xs text-red-600">Never Logged In</p>
                                        <p className="text-2xl font-bold text-red-700">{evergreenStats.totals.neverLoggedIn.toLocaleString()}</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-green-50 border-green-200">
                                    <CardContent className="pt-4 pb-4">
                                        <p className="text-xs text-green-600">With Progress</p>
                                        <p className="text-2xl font-bold text-green-700">{evergreenStats.totals.withProgress.toLocaleString()}</p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-purple-50 border-purple-200">
                                    <CardContent className="pt-4 pb-4">
                                        <p className="text-xs text-purple-600">Total Emails Sent</p>
                                        <p className="text-2xl font-bold text-purple-700">{evergreenStats.totals.totalSent.toLocaleString()}</p>
                                    </CardContent>
                                </Card>
                            </div>
                        )}

                        {/* Sequences Table */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Mail className="w-5 h-5 text-purple-600" />
                                        Buyer Email Sequences
                                    </CardTitle>
                                    <CardDescription>
                                        Automatic retention sequences for all certification purchases
                                    </CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent>
                                {evergreenLoading && !evergreenStats ? (
                                    <div className="py-8 text-center">
                                        <RefreshCw className="w-8 h-8 text-gray-300 mx-auto mb-4 animate-spin" />
                                        <p className="text-gray-500">Loading stats...</p>
                                    </div>
                                ) : evergreenStats ? (
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Sequence</TableHead>
                                                <TableHead className="text-center">Trigger</TableHead>
                                                <TableHead className="text-center">Emails</TableHead>
                                                <TableHead className="text-center">Sent</TableHead>
                                                <TableHead className="text-center">Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {/* Sprint */}
                                            <TableRow>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-8 rounded-full bg-blue-500"></div>
                                                        <div>
                                                            <p className="font-medium">Sprint Sequence</p>
                                                            <p className="text-xs text-gray-500">Days 0-5 after purchase</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline" className="text-xs">PURCHASE</Badge>
                                                </TableCell>
                                                <TableCell className="text-center font-medium">6</TableCell>
                                                <TableCell className="text-center font-medium text-blue-600">
                                                    {evergreenStats.sequences.sprint?.sent || 0}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge className="bg-green-100 text-green-700 border-green-300">Active</Badge>
                                                </TableCell>
                                            </TableRow>

                                            {/* Recovery */}
                                            <TableRow>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-8 rounded-full bg-red-500"></div>
                                                        <div>
                                                            <p className="font-medium">Recovery Sequence</p>
                                                            <p className="text-xs text-gray-500">Never logged in (Days 3-30)</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline" className="text-xs border-red-200 text-red-600">NO LOGIN</Badge>
                                                </TableCell>
                                                <TableCell className="text-center font-medium">5</TableCell>
                                                <TableCell className="text-center font-medium text-red-600">
                                                    {evergreenStats.sequences.recovery?.sent || 0}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge className="bg-green-100 text-green-700 border-green-300">Active</Badge>
                                                </TableCell>
                                            </TableRow>

                                            {/* Stalled */}
                                            <TableRow>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-8 rounded-full bg-amber-500"></div>
                                                        <div>
                                                            <p className="font-medium">Stalled Sequence</p>
                                                            <p className="text-xs text-gray-500">Logged in, no progress (Days 3-14)</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline" className="text-xs border-amber-200 text-amber-600">0% PROGRESS</Badge>
                                                </TableCell>
                                                <TableCell className="text-center font-medium">4</TableCell>
                                                <TableCell className="text-center font-medium text-amber-600">
                                                    {evergreenStats.sequences.stalled?.sent || 0}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge className="bg-green-100 text-green-700 border-green-300">Active</Badge>
                                                </TableCell>
                                            </TableRow>

                                            {/* Milestone */}
                                            <TableRow>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-8 rounded-full bg-green-500"></div>
                                                        <div>
                                                            <p className="font-medium">Milestone Emails</p>
                                                            <p className="text-xs text-gray-500">Module 1, 25%, 50%, 90%, Complete</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline" className="text-xs border-green-200 text-green-600">PROGRESS</Badge>
                                                </TableCell>
                                                <TableCell className="text-center font-medium">5</TableCell>
                                                <TableCell className="text-center font-medium text-green-600">
                                                    {evergreenStats.sequences.milestone?.sent || 0}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge className="bg-green-100 text-green-700 border-green-300">Active</Badge>
                                                </TableCell>
                                            </TableRow>

                                            {/* Re-engagement */}
                                            <TableRow>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-2 h-8 rounded-full bg-purple-500"></div>
                                                        <div>
                                                            <p className="font-medium">Re-engagement</p>
                                                            <p className="text-xs text-gray-500">Welcome back after 7+ day absence</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge variant="outline" className="text-xs border-purple-200 text-purple-600">RETURN</Badge>
                                                </TableCell>
                                                <TableCell className="text-center font-medium">1</TableCell>
                                                <TableCell className="text-center font-medium text-purple-600">
                                                    {evergreenStats.sequences.reengagement?.sent || 0}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    <Badge className="bg-green-100 text-green-700 border-green-300">Active</Badge>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                ) : (
                                    <div className="py-8 text-center">
                                        <Mail className="w-8 h-8 text-gray-300 mx-auto mb-4" />
                                        <p className="text-gray-500">Click refresh to load stats</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Email Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">All Emails in Sequences</CardTitle>
                                <CardDescription>21 unique emails across 5 sequences</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-blue-500" /> Sprint (6 emails)
                                        </p>
                                        <div className="text-xs text-gray-500 space-y-0.5 pl-6">
                                            <p>Immediate: "your access is ready"</p>
                                            <p>+2h: "quick hello"</p>
                                            <p>Day 1: "thinking about you"</p>
                                            <p>Day 2: "a little something"</p>
                                            <p>Day 3: "one thing I've noticed"</p>
                                            <p>Day 5: "before the weekend"</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium flex items-center gap-2">
                                            <LogIn className="w-4 h-4 text-red-500" /> Recovery (5 emails)
                                        </p>
                                        <div className="text-xs text-gray-500 space-y-0.5 pl-6">
                                            <p>Day 3: "everything okay?"</p>
                                            <p>Day 5: "here for you"</p>
                                            <p>Day 7: "thinking of you"</p>
                                            <p>Day 14: "still here for you"</p>
                                            <p>Day 30: "sending love your way"</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium flex items-center gap-2">
                                            <Pause className="w-4 h-4 text-amber-500" /> Stalled (4 emails)
                                        </p>
                                        <div className="text-xs text-gray-500 space-y-0.5 pl-6">
                                            <p>Day 3: "can I help?"</p>
                                            <p>Day 5: "stuck on something?"</p>
                                            <p>Day 7: "no pressure"</p>
                                            <p>Day 14: "whenever you're ready"</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium flex items-center gap-2">
                                            <Award className="w-4 h-4 text-green-500" /> Milestone (5 emails)
                                        </p>
                                        <div className="text-xs text-gray-500 space-y-0.5 pl-6">
                                            <p>Module 1: "you did it!"</p>
                                            <p>25%: "look how far you've come"</p>
                                            <p>50%: "halfway there!"</p>
                                            <p>90%: "almost at finish line"</p>
                                            <p>100%: "congratulations!"</p>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-sm font-medium flex items-center gap-2">
                                            <UserCheck className="w-4 h-4 text-purple-500" /> Re-engagement (1 email)
                                        </p>
                                        <div className="text-xs text-gray-500 space-y-0.5 pl-6">
                                            <p>Return: "so good to see you back!"</p>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Triggers Tab - Separated by Category */}

                <TabsContent value="triggers">
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Lead Triggers */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Users className="w-4 h-4 text-blue-600" />
                                    Lead Triggers
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {[
                                    { value: "USER_REGISTERED", label: "User Registered", icon: Users },
                                    { value: "MINI_DIPLOMA_STARTED", label: "Mini Diploma Started", icon: Play },
                                    { value: "MINI_DIPLOMA_COMPLETED", label: "Mini Diploma Completed", icon: CheckCircle },
                                    { value: "TAG_ADDED", label: "Tag Added", icon: Tag },
                                ].map((trigger) => {
                                    const matchingSequences = sequences.filter(s => s.triggerType === trigger.value);
                                    const TriggerIcon = trigger.icon;
                                    return (
                                        <div key={trigger.value} className="flex items-center justify-between py-2 border-b last:border-0">
                                            <div className="flex items-center gap-2">
                                                <TriggerIcon className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm">{trigger.label}</span>
                                            </div>
                                            <Badge variant={matchingSequences.length > 0 ? "default" : "secondary"} className="text-xs">
                                                {matchingSequences.length}
                                            </Badge>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>

                        {/* Student Triggers */}
                        <Card>
                            <CardHeader className="pb-3">
                                <CardTitle className="flex items-center gap-2 text-base">
                                    <Mail className="w-4 h-4 text-green-600" />
                                    Student Triggers
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {[
                                    { value: "COURSE_ENROLLED", label: "Course Enrolled", icon: Users },
                                    { value: "TRAINING_STARTED", label: "Training Started", icon: Play },
                                    { value: "CHALLENGE_STARTED", label: "Challenge Started", icon: Zap },
                                    { value: "CHALLENGE_COMPLETED", label: "Challenge Completed", icon: CheckCircle },
                                    { value: "MANUAL", label: "Manual Enrollment", icon: Settings },
                                ].map((trigger) => {
                                    const matchingSequences = sequences.filter(s => s.triggerType === trigger.value);
                                    const TriggerIcon = trigger.icon;
                                    return (
                                        <div key={trigger.value} className="flex items-center justify-between py-2 border-b last:border-0">
                                            <div className="flex items-center gap-2">
                                                <TriggerIcon className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm">{trigger.label}</span>
                                            </div>
                                            <Badge variant={matchingSequences.length > 0 ? "default" : "secondary"} className="text-xs">
                                                {matchingSequences.length}
                                            </Badge>
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>

            {/* Create Sequence Modal */}
            <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Create New Sequence</DialogTitle>
                        <DialogDescription>
                            Set up a new email automation sequence
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Sequence Name *</Label>
                            <Input
                                id="name"
                                placeholder="e.g., Welcome Nurture Sequence"
                                value={newSequence.name}
                                onChange={(e) => setNewSequence(prev => ({ ...prev, name: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                placeholder="What is this sequence for?"
                                value={newSequence.description}
                                onChange={(e) => setNewSequence(prev => ({ ...prev, description: e.target.value }))}
                                rows={2}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Trigger Type</Label>
                            <Select
                                value={newSequence.triggerType}
                                onValueChange={(value) => setNewSequence(prev => ({ ...prev, triggerType: value }))}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {TRIGGER_TYPES.map((trigger) => (
                                        <SelectItem key={trigger.value} value={trigger.value}>
                                            {trigger.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {newSequence.triggerType === "TAG_ADDED" && (
                            <div className="space-y-2">
                                <Label>Trigger Tag</Label>
                                <TagCombobox
                                    tags={tags}
                                    value={newSequence.triggerTagId}
                                    onChange={(value) => setNewSequence(prev => ({ ...prev, triggerTagId: value }))}
                                    placeholder="Search and select a tag..."
                                />
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label>Exit Tag (Optional)</Label>
                            <TagCombobox
                                tags={tags}
                                value={newSequence.exitTagId}
                                onChange={(value) => setNewSequence(prev => ({ ...prev, exitTagId: value }))}
                                placeholder="Exit when tag added..."
                                allowNone
                                noneLabel="None"
                            />
                            <p className="text-xs text-gray-500">
                                Users will exit the sequence when this tag is added
                            </p>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateSequence} disabled={creating}>
                            {creating ? (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Sequence
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Modal */}
            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-red-600">
                            <AlertCircle className="w-5 h-5" />
                            Delete Sequence
                        </DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{deleteTarget?.name}"? This will also remove all
                            emails in this sequence and exit all active enrollments. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteSequence} disabled={deleting}>
                            {deleting ? (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Sequence
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Import Templates Modal */}
            <Dialog open={importModalOpen} onOpenChange={setImportModalOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Upload className="w-5 h-5 text-burgundy-600" />
                            Import Recovery Email Templates
                        </DialogTitle>
                        <DialogDescription>
                            This will import the 3 recovery sequences (9 emails total) from the codebase:
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-3">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Mail className="w-5 h-5 text-blue-500" />
                            <div>
                                <p className="font-medium">Never Logged In</p>
                                <p className="text-xs text-gray-500">3 emails • Days 1, 3, 7</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Mail className="w-5 h-5 text-purple-500" />
                            <div>
                                <p className="font-medium">Never Started</p>
                                <p className="text-xs text-gray-500">3 emails • Days 2, 5, 10</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <Mail className="w-5 h-5 text-amber-500" />
                            <div>
                                <p className="font-medium">Abandoned Learning</p>
                                <p className="text-xs text-gray-500">3 emails • Days 7, 14, 21</p>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setImportModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleImportRecoveryEmails} disabled={importing}>
                            {importing ? (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Importing...
                                </>
                            ) : (
                                <>
                                    <Upload className="w-4 h-4 mr-2" />
                                    Import All
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
