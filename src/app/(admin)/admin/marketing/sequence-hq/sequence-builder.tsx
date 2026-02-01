"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    Trash2,
    Edit,
    ArrowLeft,
    GripVertical,
    Clock,
    Eye,
    MousePointer,
    Send,
    ChevronDown,
    ChevronUp,
    Save,
    X,
    TestTube,
    Code,
    Settings,
    Tag,
} from "lucide-react";
import { toast } from "sonner";

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

interface SequenceBuilderProps {
    sequence: Sequence;
    onBack: () => void;
    onUpdate: (sequence: Sequence) => void;
}

// Variable tokens for email content
const VARIABLES = [
    { token: "{{firstName}}", label: "First Name" },
    { token: "{{nicheName}}", label: "Niche Name" },
    { token: "{{nicheDisplayName}}", label: "Niche Title" },
    { token: "{{LOGIN_URL}}", label: "Login URL" },
    { token: "{{DASHBOARD_URL}}", label: "Dashboard URL" },
];

export default function SequenceBuilder({ sequence, onBack, onUpdate }: SequenceBuilderProps) {
    const [emails, setEmails] = useState<SequenceEmail[]>(sequence.emails || []);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Email editor modal
    const [editingEmail, setEditingEmail] = useState<SequenceEmail | null>(null);
    const [emailForm, setEmailForm] = useState({
        subject: "",
        content: "",
        delayDays: 0,
        delayHours: 0,
        isActive: true,
    });

    // New email modal
    const [createModalOpen, setCreateModalOpen] = useState(false);
    const [newEmailForm, setNewEmailForm] = useState({
        subject: "",
        content: "",
        delayDays: 1,
        delayHours: 0,
        isActive: true,
    });

    // Delete confirmation
    const [deleteTarget, setDeleteTarget] = useState<SequenceEmail | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Test send
    const [sendingTest, setSendingTest] = useState(false);

    // Settings panel
    const [settingsExpanded, setSettingsExpanded] = useState(false);
    const [tags, setTags] = useState<MarketingTag[]>([]);
    const [savingSettings, setSavingSettings] = useState(false);
    const [settings, setSettings] = useState({
        triggerTagId: sequence.triggerTagId || "",
        exitTagId: sequence.exitTagId || "",
        exitOnReply: sequence.exitOnReply,
        exitOnClick: sequence.exitOnClick,
        priority: sequence.priority,
    });

    // Fetch tags for selector
    useEffect(() => {
        fetch("/api/admin/marketing/tags")
            .then(res => res.json())
            .then(data => setTags(data.tags || []))
            .catch(err => console.error("Failed to fetch tags:", err));
    }, []);

    // Save settings
    const handleSaveSettings = async () => {
        setSavingSettings(true);
        try {
            const res = await fetch(`/api/admin/marketing/sequences/${sequence.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    triggerTagId: settings.triggerTagId || null,
                    exitTagId: settings.exitTagId || null,
                    exitOnReply: settings.exitOnReply,
                    exitOnClick: settings.exitOnClick,
                    priority: settings.priority,
                }),
            });

            if (res.ok) {
                const data = await res.json();
                onUpdate(data.sequence);
                toast.success("Settings saved");
            } else {
                toast.error("Failed to save settings");
            }
        } catch (error) {
            console.error("Failed to save settings:", error);
            toast.error("Failed to save settings");
        } finally {
            setSavingSettings(false);
        }
    };

    // Fetch latest emails
    const fetchEmails = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/marketing/sequences/${sequence.id}/emails`);
            if (res.ok) {
                const data = await res.json();
                setEmails(data.emails || []);
            }
        } catch (error) {
            console.error("Failed to fetch emails:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEmails();
    }, [sequence.id]);

    // Open email editor
    const openEmailEditor = (email: SequenceEmail) => {
        setEditingEmail(email);
        setEmailForm({
            subject: email.customSubject || "",
            content: email.customContent || "",
            delayDays: email.delayDays,
            delayHours: email.delayHours,
            isActive: email.isActive,
        });
    };

    // Save email changes
    const handleSaveEmail = async () => {
        if (!editingEmail) return;

        setSaving(true);
        try {
            const res = await fetch(`/api/admin/marketing/sequences/${sequence.id}/emails/${editingEmail.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customSubject: emailForm.subject,
                    customContent: emailForm.content,
                    delayDays: emailForm.delayDays,
                    delayHours: emailForm.delayHours,
                    isActive: emailForm.isActive,
                }),
            });

            if (res.ok) {
                toast.success("Email saved");
                setEditingEmail(null);
                fetchEmails();
            } else {
                toast.error("Failed to save email");
            }
        } catch (error) {
            console.error("Failed to save email:", error);
            toast.error("Failed to save email");
        } finally {
            setSaving(false);
        }
    };

    // Create new email
    const handleCreateEmail = async () => {
        if (!newEmailForm.subject.trim()) {
            toast.error("Subject is required");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch(`/api/admin/marketing/sequences/${sequence.id}/emails`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    customSubject: newEmailForm.subject,
                    customContent: newEmailForm.content,
                    delayDays: newEmailForm.delayDays,
                    delayHours: newEmailForm.delayHours,
                    isActive: newEmailForm.isActive,
                    order: emails.length,
                }),
            });

            if (res.ok) {
                toast.success("Email added");
                setCreateModalOpen(false);
                setNewEmailForm({ subject: "", content: "", delayDays: 1, delayHours: 0, isActive: true });
                fetchEmails();
            } else {
                toast.error("Failed to add email");
            }
        } catch (error) {
            console.error("Failed to create email:", error);
            toast.error("Failed to add email");
        } finally {
            setSaving(false);
        }
    };

    // Delete email
    const handleDeleteEmail = async () => {
        if (!deleteTarget) return;

        setDeleting(true);
        try {
            const res = await fetch(`/api/admin/marketing/sequences/${sequence.id}/emails/${deleteTarget.id}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Email deleted");
                setDeleteTarget(null);
                fetchEmails();
            } else {
                toast.error("Failed to delete email");
            }
        } catch (error) {
            console.error("Failed to delete email:", error);
            toast.error("Failed to delete email");
        } finally {
            setDeleting(false);
        }
    };

    // Move email up/down
    const moveEmail = async (email: SequenceEmail, direction: "up" | "down") => {
        const currentIndex = emails.findIndex(e => e.id === email.id);
        const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;

        if (newIndex < 0 || newIndex >= emails.length) return;

        const newEmails = [...emails];
        [newEmails[currentIndex], newEmails[newIndex]] = [newEmails[newIndex], newEmails[currentIndex]];

        setEmails(newEmails);

        // Update order in DB
        try {
            await fetch(`/api/admin/marketing/sequences/${sequence.id}/emails/reorder`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    emailOrders: newEmails.map((e, i) => ({ id: e.id, order: i })),
                }),
            });
        } catch (error) {
            console.error("Failed to reorder:", error);
            fetchEmails(); // Revert on error
        }
    };

    // Toggle email active
    const toggleEmailActive = async (email: SequenceEmail) => {
        try {
            const res = await fetch(`/api/admin/marketing/sequences/${sequence.id}/emails/${email.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ isActive: !email.isActive }),
            });

            if (res.ok) {
                setEmails(prev => prev.map(e => e.id === email.id ? { ...e, isActive: !e.isActive } : e));
            }
        } catch (error) {
            console.error("Failed to toggle email:", error);
        }
    };

    // Insert variable into content
    const insertVariable = (token: string) => {
        setEmailForm(prev => ({
            ...prev,
            content: prev.content + token,
        }));
    };

    // Send test email
    const handleTestSend = async () => {
        if (!editingEmail) return;

        setSendingTest(true);
        try {
            const res = await fetch(
                `/api/admin/marketing/sequences/${sequence.id}/emails/${editingEmail.id}/test`,
                { method: "POST" }
            );

            if (res.ok) {
                const data = await res.json();
                toast.success(`Test email sent to ${data.sentTo}`);
            } else {
                const error = await res.json();
                toast.error(error.error || "Failed to send test email");
            }
        } catch (error) {
            console.error("Failed to send test:", error);
            toast.error("Failed to send test email");
        } finally {
            setSendingTest(false);
        }
    };

    // Render HTML preview with variable substitution
    const getPreviewHtml = () => {
        return emailForm.content
            .replace(/\{\{firstName\}\}/g, "Test")
            .replace(/\{\{lastName\}\}/g, "User")
            .replace(/\{\{email\}\}/g, "test@example.com")
            .replace(/\{\{fullName\}\}/g, "Test User")
            .replace(/\{\{nicheName\}\}/g, "Functional Medicine")
            .replace(/\{\{nicheDisplayName\}\}/g, "Functional Medicine Certification")
            .replace(/\{\{LOGIN_URL\}\}/g, "#")
            .replace(/\{\{DASHBOARD_URL\}\}/g, "#")
            .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
            .replace(/\*([^*]+)\*/g, "<em>$1</em>")
            .replace(/\n\n/g, "</p><p>")
            .replace(/\n/g, "<br>");
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#4e1f24] via-[#722f37] to-[#4e1f24] -mx-6 -mt-6 px-6 py-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/10"
                            onClick={onBack}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-white">{sequence.name}</h1>
                            <p className="text-[#C9A227] text-sm">
                                {sequence.description || "Email sequence builder"}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Badge className={sequence.isActive ? "bg-green-500" : "bg-gray-500"}>
                            {sequence.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Button
                            className="bg-[#C9A227] hover:bg-[#b8922a] text-[#4e1f24] font-semibold"
                            onClick={() => setCreateModalOpen(true)}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Email
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <Card>
                    <CardContent className="pt-4 pb-4">
                        <p className="text-xs text-gray-500">Emails</p>
                        <p className="text-2xl font-bold">{emails.length}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4 pb-4">
                        <p className="text-xs text-gray-500">Enrolled</p>
                        <p className="text-2xl font-bold">{sequence.totalEnrolled.toLocaleString()}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-4 pb-4">
                        <p className="text-xs text-gray-500">Total Sent</p>
                        <p className="text-2xl font-bold">
                            {emails.reduce((a, e) => a + e.sentCount, 0).toLocaleString()}
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-purple-50 border-purple-200">
                    <CardContent className="pt-4 pb-4">
                        <p className="text-xs text-purple-600">Total Opens</p>
                        <p className="text-2xl font-bold text-purple-700">
                            {emails.reduce((a, e) => a + e.openCount, 0).toLocaleString()}
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-amber-50 border-amber-200">
                    <CardContent className="pt-4 pb-4">
                        <p className="text-xs text-amber-600">Total Clicks</p>
                        <p className="text-2xl font-bold text-amber-700">
                            {emails.reduce((a, e) => a + e.clickCount, 0).toLocaleString()}
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Settings Panel (Collapsible) */}
            <Card className="border-[#C9A227]/30">
                <CardHeader
                    className="cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setSettingsExpanded(!settingsExpanded)}
                >
                    <CardTitle className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Settings className="w-5 h-5 text-[#C9A227]" />
                            Sequence Settings
                        </div>
                        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${settingsExpanded ? "rotate-180" : ""}`} />
                    </CardTitle>
                    <CardDescription>
                        Trigger: {sequence.triggerType.replace(/_/g, " ")}
                        {sequence.triggerTag && ` • Tag: ${sequence.triggerTag.name}`}
                        {sequence.exitTag && ` • Exit: ${sequence.exitTag.name}`}
                    </CardDescription>
                </CardHeader>
                {settingsExpanded && (
                    <CardContent className="border-t pt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Trigger Tag */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-1">
                                    <Tag className="w-3 h-3" />
                                    Trigger Tag
                                </Label>
                                <Select
                                    value={settings.triggerTagId}
                                    onValueChange={(v) => setSettings(prev => ({ ...prev, triggerTagId: v }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select tag..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">None</SelectItem>
                                        {tags.map(tag => (
                                            <SelectItem key={tag.id} value={tag.id}>
                                                {tag.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-gray-500">Starts sequence when this tag is added</p>
                            </div>

                            {/* Exit Tag */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-1">
                                    <Tag className="w-3 h-3" />
                                    Exit Tag
                                </Label>
                                <Select
                                    value={settings.exitTagId}
                                    onValueChange={(v) => setSettings(prev => ({ ...prev, exitTagId: v }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select tag..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="">None</SelectItem>
                                        {tags.map(tag => (
                                            <SelectItem key={tag.id} value={tag.id}>
                                                {tag.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-gray-500">Exits sequence when this tag is added</p>
                            </div>

                            {/* Exit Conditions */}
                            <div className="space-y-3">
                                <Label>Exit Conditions</Label>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            id="exit-reply"
                                            checked={settings.exitOnReply}
                                            onCheckedChange={(v) => setSettings(prev => ({ ...prev, exitOnReply: v }))}
                                        />
                                        <Label htmlFor="exit-reply" className="font-normal">Exit on reply</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            id="exit-click"
                                            checked={settings.exitOnClick}
                                            onCheckedChange={(v) => setSettings(prev => ({ ...prev, exitOnClick: v }))}
                                        />
                                        <Label htmlFor="exit-click" className="font-normal">Exit on click</Label>
                                    </div>
                                </div>
                            </div>

                            {/* Priority */}
                            <div className="space-y-2">
                                <Label>Priority</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={settings.priority}
                                    onChange={(e) => setSettings(prev => ({ ...prev, priority: parseInt(e.target.value) || 0 }))}
                                />
                                <p className="text-xs text-gray-500">Higher = runs first if multiple match</p>
                            </div>
                        </div>

                        <div className="flex justify-end mt-4">
                            <Button onClick={handleSaveSettings} disabled={savingSettings}>
                                {savingSettings ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Settings
                                    </>
                                )}
                            </Button>
                        </div>
                    </CardContent>
                )}
            </Card>

            {/* Email Timeline */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-burgundy-600" />
                        Email Sequence
                    </CardTitle>
                    <CardDescription>
                        Drag to reorder • Click to edit • Toggle to enable/disable
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
                        </div>
                    ) : emails.length > 0 ? (
                        <div className="space-y-3">
                            {emails.sort((a, b) => a.order - b.order).map((email, idx) => {
                                const openRate = email.sentCount > 0
                                    ? Math.round((email.openCount / email.sentCount) * 100)
                                    : 0;
                                const clickRate = email.sentCount > 0
                                    ? Math.round((email.clickCount / email.sentCount) * 100)
                                    : 0;

                                return (
                                    <div key={email.id} className="relative">
                                        {/* Connector line */}
                                        {idx > 0 && (
                                            <div className="absolute left-6 -top-3 w-0.5 h-3 bg-gray-200" />
                                        )}

                                        <div
                                            className={`flex items-center gap-4 p-4 border rounded-lg transition-all hover:shadow-md ${email.isActive ? "bg-white" : "bg-gray-50 opacity-60"
                                                }`}
                                        >
                                            {/* Order controls */}
                                            <div className="flex flex-col gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    disabled={idx === 0}
                                                    onClick={() => moveEmail(email, "up")}
                                                >
                                                    <ChevronUp className="w-4 h-4" />
                                                </Button>
                                                <div className="w-6 h-6 rounded-full bg-burgundy-100 flex items-center justify-center text-xs font-bold text-burgundy-600">
                                                    {idx + 1}
                                                </div>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6"
                                                    disabled={idx === emails.length - 1}
                                                    onClick={() => moveEmail(email, "down")}
                                                >
                                                    <ChevronDown className="w-4 h-4" />
                                                </Button>
                                            </div>

                                            {/* Email content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className="font-medium truncate">
                                                        {email.customSubject || "Untitled Email"}
                                                    </p>
                                                    {!email.isActive && (
                                                        <Badge variant="outline" className="text-xs">Disabled</Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3 h-3" />
                                                        {email.delayDays > 0 && `${email.delayDays}d `}
                                                        {email.delayHours > 0 && `${email.delayHours}h`}
                                                        {email.delayDays === 0 && email.delayHours === 0 && "Immediate"}
                                                        {idx > 0 && " after previous"}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Stats */}
                                            <div className="flex items-center gap-6 text-sm">
                                                <div className="text-center">
                                                    <p className="text-gray-400 text-xs">Sent</p>
                                                    <p className="font-medium">{email.sentCount.toLocaleString()}</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-purple-500 text-xs flex items-center gap-1">
                                                        <Eye className="w-3 h-3" /> Opens
                                                    </p>
                                                    <p className="font-medium">{openRate}%</p>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-amber-500 text-xs flex items-center gap-1">
                                                        <MousePointer className="w-3 h-3" /> Clicks
                                                    </p>
                                                    <p className="font-medium">{clickRate}%</p>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={email.isActive}
                                                    onCheckedChange={() => toggleEmailActive(email)}
                                                />
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => openEmailEditor(email)}
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-600"
                                                    onClick={() => setDeleteTarget(email)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 mb-4">No emails in this sequence yet</p>
                            <Button onClick={() => setCreateModalOpen(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Add First Email
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Edit Email Modal */}
            <Dialog open={!!editingEmail} onOpenChange={() => setEditingEmail(null)}>
                <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Email</DialogTitle>
                        <DialogDescription>
                            Email #{(editingEmail?.order || 0) + 1} in sequence
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Delay (Days)</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={emailForm.delayDays}
                                    onChange={(e) => setEmailForm(prev => ({
                                        ...prev,
                                        delayDays: parseInt(e.target.value) || 0
                                    }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Delay (Hours)</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="23"
                                    value={emailForm.delayHours}
                                    onChange={(e) => setEmailForm(prev => ({
                                        ...prev,
                                        delayHours: parseInt(e.target.value) || 0
                                    }))}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Subject Line</Label>
                            <Input
                                value={emailForm.subject}
                                onChange={(e) => setEmailForm(prev => ({ ...prev, subject: e.target.value }))}
                                placeholder="Email subject..."
                            />
                            <p className="text-xs text-gray-500">{emailForm.subject.length} characters</p>
                        </div>

                        {/* Editor/Preview Tabs */}
                        <Tabs defaultValue="editor" className="w-full">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <TabsList>
                                    <TabsTrigger value="editor" className="gap-1">
                                        <Code className="w-3 h-3" />
                                        Editor
                                    </TabsTrigger>
                                    <TabsTrigger value="preview" className="gap-1">
                                        <Eye className="w-3 h-3" />
                                        Preview
                                    </TabsTrigger>
                                </TabsList>
                                <div className="flex flex-wrap gap-1">
                                    {VARIABLES.map((v) => (
                                        <Button
                                            key={v.token}
                                            variant="outline"
                                            size="sm"
                                            className="text-xs h-7"
                                            onClick={() => insertVariable(v.token)}
                                        >
                                            {v.label}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                            <TabsContent value="editor">
                                <Textarea
                                    value={emailForm.content}
                                    onChange={(e) => setEmailForm(prev => ({ ...prev, content: e.target.value }))}
                                    placeholder="Email content (HTML supported)..."
                                    rows={14}
                                    className="font-mono text-sm"
                                />
                            </TabsContent>
                            <TabsContent value="preview">
                                <div
                                    className="border rounded-lg p-4 bg-gray-50 min-h-[300px] prose prose-sm max-w-none"
                                    dangerouslySetInnerHTML={{ __html: `<p>${getPreviewHtml()}</p>` }}
                                />
                            </TabsContent>
                        </Tabs>

                        <div className="flex items-center gap-2">
                            <Switch
                                id="edit-active"
                                checked={emailForm.isActive}
                                onCheckedChange={(checked) => setEmailForm(prev => ({ ...prev, isActive: checked }))}
                            />
                            <Label htmlFor="edit-active">Email is active</Label>
                        </div>
                    </div>
                    <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 justify-between">
                        <Button
                            variant="outline"
                            onClick={handleTestSend}
                            disabled={sendingTest || !editingEmail}
                        >
                            {sendingTest ? (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                <>
                                    <TestTube className="w-4 h-4 mr-2" />
                                    Send Test to Me
                                </>
                            )}
                        </Button>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setEditingEmail(null)}>
                                Cancel
                            </Button>
                            <Button onClick={handleSaveEmail} disabled={saving}>
                                {saving ? (
                                    <>
                                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Create Email Modal */}
            <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Add New Email</DialogTitle>
                        <DialogDescription>
                            This will be email #{emails.length + 1} in the sequence
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Delay (Days)</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    value={newEmailForm.delayDays}
                                    onChange={(e) => setNewEmailForm(prev => ({
                                        ...prev,
                                        delayDays: parseInt(e.target.value) || 0
                                    }))}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Delay (Hours)</Label>
                                <Input
                                    type="number"
                                    min="0"
                                    max="23"
                                    value={newEmailForm.delayHours}
                                    onChange={(e) => setNewEmailForm(prev => ({
                                        ...prev,
                                        delayHours: parseInt(e.target.value) || 0
                                    }))}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Subject Line *</Label>
                            <Input
                                value={newEmailForm.subject}
                                onChange={(e) => setNewEmailForm(prev => ({ ...prev, subject: e.target.value }))}
                                placeholder="Email subject..."
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Content</Label>
                            <Textarea
                                value={newEmailForm.content}
                                onChange={(e) => setNewEmailForm(prev => ({ ...prev, content: e.target.value }))}
                                placeholder="Email content (HTML supported)..."
                                rows={10}
                                className="font-mono text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Switch
                                id="new-active"
                                checked={newEmailForm.isActive}
                                onCheckedChange={(checked) => setNewEmailForm(prev => ({ ...prev, isActive: checked }))}
                            />
                            <Label htmlFor="new-active">Email is active</Label>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleCreateEmail} disabled={saving}>
                            {saving ? (
                                <>
                                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                    Adding...
                                </>
                            ) : (
                                <>
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Email
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-red-600">Delete Email</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete this email? This action cannot be undone.
                            Email: "{deleteTarget?.customSubject || "Untitled"}"
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteTarget(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDeleteEmail} disabled={deleting}>
                            {deleting ? (
                                <RefreshCw className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
