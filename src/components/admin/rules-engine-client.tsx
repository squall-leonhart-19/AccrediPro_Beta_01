"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    Settings, Plus, Play, Pause, Trash2, Loader2,
    Zap, Tag, BookOpen, Clock, Mail, Target
} from "lucide-react";
import { toast } from "sonner";

interface Rule {
    id: string;
    name: string;
    trigger: string;
    triggerData: any;
    action: string;
    actionData: any;
    isActive: boolean;
    runsCount: number;
    lastRunAt: Date | null;
    createdAt: Date;
}

const TRIGGERS = [
    { value: "course_complete", label: "Course Completed", icon: BookOpen },
    { value: "mini_diploma_complete", label: "Mini Diploma Completed", icon: Target },
    { value: "enrollment", label: "User Enrolled in Course", icon: BookOpen },
    { value: "inactivity", label: "User Inactive for X Days", icon: Clock },
    { value: "signup", label: "New User Signup", icon: Zap },
];

const ACTIONS = [
    { value: "add_tag", label: "Add Tag", icon: Tag },
    { value: "remove_tag", label: "Remove Tag", icon: Tag },
    { value: "enroll_course", label: "Enroll in Course", icon: BookOpen },
];

export default function RulesEngineClient() {
    const [rules, setRules] = useState<Rule[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [saving, setSaving] = useState(false);

    // New rule form state
    const [newRule, setNewRule] = useState({
        name: "",
        trigger: "",
        triggerData: {} as any,
        action: "",
        actionData: {} as any,
    });

    const fetchRules = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/super-tools/rules");
            if (res.ok) {
                const data = await res.json();
                setRules(data.rules || []);
            }
        } catch (error) {
            toast.error("Failed to load rules");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRules();
    }, []);

    const createRule = async () => {
        if (!newRule.name || !newRule.trigger || !newRule.action) {
            toast.error("Please fill in all required fields");
            return;
        }

        setSaving(true);
        try {
            const res = await fetch("/api/admin/super-tools/rules", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newRule),
            });

            if (res.ok) {
                toast.success("Rule created!");
                setDialogOpen(false);
                setNewRule({ name: "", trigger: "", triggerData: {}, action: "", actionData: {} });
                fetchRules();
            } else {
                toast.error("Failed to create rule");
            }
        } catch (error) {
            toast.error("Error creating rule");
        } finally {
            setSaving(false);
        }
    };

    const toggleRule = async (ruleId: string, isActive: boolean) => {
        try {
            const res = await fetch("/api/admin/super-tools/rules", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ruleId, isActive: !isActive }),
            });

            if (res.ok) {
                setRules(prev => prev.map(r =>
                    r.id === ruleId ? { ...r, isActive: !isActive } : r
                ));
                toast.success(isActive ? "Rule paused" : "Rule activated");
            }
        } catch (error) {
            toast.error("Failed to update rule");
        }
    };

    const deleteRule = async (ruleId: string) => {
        if (!confirm("Are you sure you want to delete this rule?")) return;

        try {
            const res = await fetch(`/api/admin/super-tools/rules?ruleId=${ruleId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                setRules(prev => prev.filter(r => r.id !== ruleId));
                toast.success("Rule deleted");
            }
        } catch (error) {
            toast.error("Failed to delete rule");
        }
    };

    const getTriggerLabel = (trigger: string) =>
        TRIGGERS.find(t => t.value === trigger)?.label || trigger;

    const getActionLabel = (action: string) =>
        ACTIONS.find(a => a.value === action)?.label || action;

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-burgundy-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header Actions */}
            <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">
                    {rules.length} rule{rules.length !== 1 ? "s" : ""} configured
                </div>
                <Button onClick={() => setDialogOpen(true)} className="bg-burgundy-600 hover:bg-burgundy-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Rule
                </Button>
            </div>

            {/* Rules List */}
            {rules.length === 0 ? (
                <Card className="p-12 text-center">
                    <Settings className="w-12 h-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Rules Yet</h3>
                    <p className="text-gray-500 mb-4">Create your first automation rule to get started</p>
                    <Button onClick={() => setDialogOpen(true)} variant="outline">
                        <Plus className="w-4 h-4 mr-2" />
                        Create First Rule
                    </Button>
                </Card>
            ) : (
                <div className="space-y-4">
                    {rules.map((rule) => (
                        <Card key={rule.id} className={`p-4 ${rule.isActive ? "border-green-200 bg-green-50/30" : "opacity-60"}`}>
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                                        {rule.isActive ? (
                                            <Badge className="bg-green-100 text-green-700">Active</Badge>
                                        ) : (
                                            <Badge variant="secondary">Paused</Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                                        <span className="flex items-center gap-1">
                                            <Zap className="w-4 h-4 text-purple-500" />
                                            When: {getTriggerLabel(rule.trigger)}
                                            {rule.triggerData?.courseName && (
                                                <span className="text-purple-600 font-medium ml-1">
                                                    ({rule.triggerData.courseName})
                                                </span>
                                            )}
                                            {rule.triggerData?.days && (
                                                <span className="text-purple-600 font-medium ml-1">
                                                    ({rule.triggerData.days} days)
                                                </span>
                                            )}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Target className="w-4 h-4 text-blue-500" />
                                            Then: {getActionLabel(rule.action)}
                                            {rule.actionData?.tag && (
                                                <Badge variant="secondary" className="ml-1 text-xs">
                                                    {rule.actionData.tag}
                                                </Badge>
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                        <span>Runs: {rule.runsCount}</span>
                                        {rule.lastRunAt && (
                                            <span>Last: {new Date(rule.lastRunAt).toLocaleDateString()}</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => toggleRule(rule.id, rule.isActive)}
                                    >
                                        {rule.isActive ? (
                                            <Pause className="w-4 h-4 text-yellow-600" />
                                        ) : (
                                            <Play className="w-4 h-4 text-green-600" />
                                        )}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => deleteRule(rule.id)}
                                    >
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            {/* Create Rule Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Create Automation Rule</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div>
                            <Label>Rule Name</Label>
                            <Input
                                placeholder="e.g., Tag Mini Diploma Graduates"
                                value={newRule.name}
                                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
                            />
                        </div>

                        <div>
                            <Label>When this happens (Trigger)</Label>
                            <Select
                                value={newRule.trigger}
                                onValueChange={(v) => setNewRule({ ...newRule, trigger: v, triggerData: {} })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a trigger..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {TRIGGERS.map((t) => (
                                        <SelectItem key={t.value} value={t.value}>
                                            {t.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {newRule.trigger === "inactivity" && (
                            <div>
                                <Label>Days of Inactivity</Label>
                                <Input
                                    type="number"
                                    placeholder="30"
                                    value={newRule.triggerData.days || ""}
                                    onChange={(e) => setNewRule({
                                        ...newRule,
                                        triggerData: { ...newRule.triggerData, days: parseInt(e.target.value) }
                                    })}
                                />
                            </div>
                        )}

                        <div>
                            <Label>Do this (Action)</Label>
                            <Select
                                value={newRule.action}
                                onValueChange={(v) => setNewRule({ ...newRule, action: v, actionData: {} })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select an action..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {ACTIONS.map((a) => (
                                        <SelectItem key={a.value} value={a.value}>
                                            {a.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {(newRule.action === "add_tag" || newRule.action === "remove_tag") && (
                            <div>
                                <Label>Tag Name</Label>
                                <Input
                                    placeholder="e.g., mini_diploma_completed"
                                    value={newRule.actionData.tag || ""}
                                    onChange={(e) => setNewRule({
                                        ...newRule,
                                        actionData: { ...newRule.actionData, tag: e.target.value }
                                    })}
                                />
                            </div>
                        )}
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button onClick={createRule} disabled={saving} className="bg-burgundy-600 hover:bg-burgundy-700">
                            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Create Rule
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
