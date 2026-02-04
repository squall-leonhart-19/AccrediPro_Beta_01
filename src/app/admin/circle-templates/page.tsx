"use client";

import { useState, useEffect } from "react";
import {
    Plus,
    Save,
    Trash2,
    RefreshCw,
    MessageSquare,
    User,
    Bot,
    ChevronDown,
    ChevronUp,
    Edit,
} from "lucide-react";

interface ZombieMessage {
    hour: number;
    content: string;
}

interface Template {
    id: string;
    nicheCategory: string;
    dayNumber: number;
    sarahMessage: string;
    zombieMessages: ZombieMessage[];
    gapTopic: string | null;
    sarahAudioUrl: string | null;
    createdAt: string;
}

export default function CircleTemplatesAdminPage() {
    const [templates, setTemplates] = useState<Template[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [expandedDay, setExpandedDay] = useState<number | null>(null);
    const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
    const [filter, setFilter] = useState("all");

    // Form state
    const [formData, setFormData] = useState({
        nicheCategory: "all",
        dayNumber: 1,
        sarahMessage: "",
        zombieMessages: [{ hour: 2, content: "" }] as ZombieMessage[],
        gapTopic: "",
        sarahAudioUrl: "",
    });

    const fetchTemplates = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/circle-templates");
            const data = await res.json();
            setTemplates(data.templates || []);
        } catch (error) {
            console.error("Failed to fetch templates:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTemplates();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch("/api/admin/circle-templates", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                await fetchTemplates();
                setEditingTemplate(null);
                resetForm();
            }
        } catch (error) {
            console.error("Failed to save template:", error);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this template?")) return;
        try {
            await fetch(`/api/admin/circle-templates?id=${id}`, { method: "DELETE" });
            await fetchTemplates();
        } catch (error) {
            console.error("Failed to delete:", error);
        }
    };

    const resetForm = () => {
        setFormData({
            nicheCategory: "all",
            dayNumber: 1,
            sarahMessage: "",
            zombieMessages: [{ hour: 2, content: "" }],
            gapTopic: "",
            sarahAudioUrl: "",
        });
    };

    const editTemplate = (template: Template) => {
        setEditingTemplate(template);
        setFormData({
            nicheCategory: template.nicheCategory,
            dayNumber: template.dayNumber,
            sarahMessage: template.sarahMessage,
            zombieMessages: template.zombieMessages.length > 0 ? template.zombieMessages : [{ hour: 2, content: "" }],
            gapTopic: template.gapTopic || "",
            sarahAudioUrl: template.sarahAudioUrl || "",
        });
    };

    const addZombieMessage = () => {
        setFormData({
            ...formData,
            zombieMessages: [...formData.zombieMessages, { hour: formData.zombieMessages.length + 2, content: "" }],
        });
    };

    const updateZombieMessage = (index: number, field: "hour" | "content", value: string | number) => {
        const updated = [...formData.zombieMessages];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, zombieMessages: updated });
    };

    const removeZombieMessage = (index: number) => {
        setFormData({
            ...formData,
            zombieMessages: formData.zombieMessages.filter((_, i) => i !== index),
        });
    };

    // Group templates by day
    const groupedByDay = templates
        .filter((t) => filter === "all" || t.nicheCategory === filter)
        .reduce((acc, t) => {
            if (!acc[t.dayNumber]) acc[t.dayNumber] = [];
            acc[t.dayNumber].push(t);
            return acc;
        }, {} as Record<number, Template[]>);

    const niches = Array.from(new Set(templates.map((t) => t.nicheCategory)));

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Circle Templates</h1>
                    <p className="text-gray-500">Edit Sarah & Zombie messages for each day</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchTemplates}
                        disabled={loading}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                    </button>
                    <button
                        onClick={() => {
                            resetForm();
                            setEditingTemplate({} as Template);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        New Template
                    </button>
                </div>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-500">Filter by niche:</span>
                {["all", ...niches.filter((n) => n !== "all")].map((niche) => (
                    <button
                        key={niche}
                        onClick={() => setFilter(niche)}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${filter === niche
                            ? "bg-burgundy-600 text-white"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        {niche}
                    </button>
                ))}
            </div>

            {/* Editor Modal */}
            {editingTemplate && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingTemplate.id ? "Edit Template" : "New Template"}
                            </h2>
                        </div>
                        <div className="p-6 space-y-4">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Niche</label>
                                    <select
                                        value={formData.nicheCategory}
                                        onChange={(e) => setFormData({ ...formData, nicheCategory: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                    >
                                        <option value="all">All (Generic)</option>
                                        <option value="functional-medicine">Functional Medicine</option>
                                        <option value="health-coaching">Health Coaching</option>
                                        <option value="nutrition">Nutrition</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Day Number</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="45"
                                        value={formData.dayNumber}
                                        onChange={(e) => setFormData({ ...formData, dayNumber: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                    />
                                </div>
                            </div>

                            {/* Gap Topic */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gap Topic</label>
                                <input
                                    type="text"
                                    value={formData.gapTopic}
                                    onChange={(e) => setFormData({ ...formData, gapTopic: e.target.value })}
                                    placeholder="e.g., client-acquisition, pricing, legal"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                />
                            </div>

                            {/* Sarah's Message */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                                    <User className="w-4 h-4 text-burgundy-600" />
                                    Sarah&apos;s Message
                                </label>
                                <textarea
                                    value={formData.sarahMessage}
                                    onChange={(e) => setFormData({ ...formData, sarahMessage: e.target.value })}
                                    rows={4}
                                    placeholder="Use {firstName} for personalization"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none"
                                />
                            </div>

                            {/* Sarah Audio URL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sarah Audio URL (optional)</label>
                                <input
                                    type="text"
                                    value={formData.sarahAudioUrl}
                                    onChange={(e) => setFormData({ ...formData, sarahAudioUrl: e.target.value })}
                                    placeholder="/audio/day-1-sarah.mp3"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                />
                            </div>

                            {/* Zombie Messages */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                                    <Bot className="w-4 h-4 text-amber-600" />
                                    Zombie Messages
                                </label>
                                <div className="space-y-3">
                                    {formData.zombieMessages.map((msg, i) => (
                                        <div key={i} className="flex items-start gap-2">
                                            <div className="w-20">
                                                <label className="block text-xs text-gray-500 mb-1">Hour</label>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    max="24"
                                                    value={msg.hour}
                                                    onChange={(e) => updateZombieMessage(i, "hour", parseInt(e.target.value))}
                                                    className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <label className="block text-xs text-gray-500 mb-1">Message</label>
                                                <textarea
                                                    value={msg.content}
                                                    onChange={(e) => updateZombieMessage(i, "content", e.target.value)}
                                                    rows={2}
                                                    placeholder="Zombie message..."
                                                    className="w-full px-2 py-1.5 border border-gray-200 rounded text-sm resize-none"
                                                />
                                            </div>
                                            <button
                                                onClick={() => removeZombieMessage(i)}
                                                className="mt-5 p-1.5 text-red-500 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={addZombieMessage}
                                    className="mt-2 text-sm text-burgundy-600 hover:text-burgundy-700 flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add zombie message
                                </button>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="p-6 border-t border-gray-100 flex items-center justify-end gap-3">
                            <button
                                onClick={() => setEditingTemplate(null)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={saving || !formData.sarahMessage}
                                className="flex items-center gap-2 px-4 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 transition-colors disabled:opacity-50"
                            >
                                <Save className="w-4 h-4" />
                                {saving ? "Saving..." : "Save Template"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Templates by Day */}
            <div className="space-y-3">
                {loading ? (
                    <div className="text-center py-12 text-gray-500">Loading templates...</div>
                ) : Object.keys(groupedByDay).length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No templates found. Seed templates first or create new ones.
                    </div>
                ) : (
                    Object.entries(groupedByDay)
                        .sort(([a], [b]) => parseInt(a) - parseInt(b))
                        .map(([day, dayTemplates]) => (
                            <div key={day} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <button
                                    onClick={() => setExpandedDay(expandedDay === parseInt(day) ? null : parseInt(day))}
                                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center text-white font-bold">
                                            {day}
                                        </span>
                                        <div className="text-left">
                                            <p className="font-medium text-gray-900">Day {day}</p>
                                            <p className="text-sm text-gray-500">{dayTemplates.length} template(s)</p>
                                        </div>
                                    </div>
                                    {expandedDay === parseInt(day) ? (
                                        <ChevronUp className="w-5 h-5 text-gray-400" />
                                    ) : (
                                        <ChevronDown className="w-5 h-5 text-gray-400" />
                                    )}
                                </button>

                                {expandedDay === parseInt(day) && (
                                    <div className="border-t border-gray-100 divide-y divide-gray-100">
                                        {dayTemplates.map((template) => (
                                            <div key={template.id} className="p-4">
                                                <div className="flex items-start justify-between mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                                                            {template.nicheCategory}
                                                        </span>
                                                        {template.gapTopic && (
                                                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded text-xs font-medium">
                                                                Gap: {template.gapTopic}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => editTemplate(template)}
                                                            className="p-1.5 text-gray-400 hover:text-burgundy-600 hover:bg-burgundy-50 rounded"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(template.id)}
                                                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Sarah's message */}
                                                <div className="bg-burgundy-50 rounded-lg p-3 mb-2">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <User className="w-4 h-4 text-burgundy-600" />
                                                        <span className="text-sm font-medium text-burgundy-700">Sarah</span>
                                                    </div>
                                                    <p className="text-sm text-gray-700">{template.sarahMessage}</p>
                                                </div>

                                                {Array.isArray(template.zombieMessages) && template.zombieMessages.length > 0 && (
                                                    <div className="bg-amber-50 rounded-lg p-3">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <Bot className="w-4 h-4 text-amber-600" />
                                                            <span className="text-sm font-medium text-amber-700">
                                                                Zombie ({template.zombieMessages.length} msg groups)
                                                            </span>
                                                        </div>
                                                        <div className="space-y-1">
                                                            {template.zombieMessages.slice(0, 2).map((msg: Record<string, unknown>, i: number) => {
                                                                // Handle both formats: {hour, content} and {minHour, maxHour, options}
                                                                const hour = msg.hour ?? msg.minHour ?? 0;
                                                                const content = msg.content ?? (Array.isArray(msg.options) ? msg.options[0] : "");
                                                                const displayContent = typeof content === 'string' ? content : String(content);
                                                                return (
                                                                    <p key={i} className="text-sm text-gray-700">
                                                                        <span className="text-xs text-amber-600">+{String(hour)}h:</span>{" "}
                                                                        {displayContent.slice(0, 80)}
                                                                        {displayContent.length > 80 && "..."}
                                                                    </p>
                                                                );
                                                            })}
                                                            {template.zombieMessages.length > 2 && (
                                                                <p className="text-xs text-amber-500">
                                                                    +{template.zombieMessages.length - 2} more
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))
                )}
            </div>
        </div>
    );
}
