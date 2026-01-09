"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Activity,
    TrendingUp,
    Calendar,
    Plus,
    Trash2,
    CheckCircle2,
    AlertTriangle,
    Save,
    Download,
    Coffee,
    Utensils,
    Sun,
    Moon,
} from "lucide-react";

interface GlucoseReading {
    id: string;
    timestamp: string;
    value: number;
    type: "fasting" | "pre_meal" | "post_meal" | "bedtime" | "other";
    mealNotes: string;
}

interface DailyEntry {
    date: string;
    readings: GlucoseReading[];
    notes: string;
}

interface BloodSugarData {
    entries: DailyEntry[];
    targetRanges: {
        fasting: { min: number; max: number };
        preMeal: { min: number; max: number };
        postMeal: { min: number; max: number };
    };
}

interface BloodSugarTrackerProps {
    onSave?: (data: BloodSugarData) => void;
    initialData?: Partial<BloodSugarData>;
}

const READING_TYPES = [
    { id: "fasting", label: "Fasting", icon: Sun, time: "Before breakfast" },
    { id: "pre_meal", label: "Pre-Meal", icon: Utensils, time: "Before eating" },
    { id: "post_meal", label: "Post-Meal", icon: Coffee, time: "1-2 hrs after eating" },
    { id: "bedtime", label: "Bedtime", icon: Moon, time: "Before sleep" },
];

const DEFAULT_TARGETS = {
    fasting: { min: 70, max: 100 },
    preMeal: { min: 70, max: 100 },
    postMeal: { min: 70, max: 140 },
};

const getReadingStatus = (value: number, type: string, targets: BloodSugarData["targetRanges"]): "optimal" | "suboptimal" | "concern" => {
    let range;
    switch (type) {
        case "fasting":
            range = targets.fasting;
            break;
        case "pre_meal":
            range = targets.preMeal;
            break;
        case "post_meal":
        case "bedtime":
        case "other":
        default:
            range = targets.postMeal;
    }

    if (value >= range.min && value <= range.max) return "optimal";
    if (value < range.min - 10 || value > range.max + 30) return "concern";
    return "suboptimal";
};

const getStatusColor = (status: "optimal" | "suboptimal" | "concern"): string => {
    switch (status) {
        case "optimal":
            return "text-green-600 bg-green-50 border-green-200";
        case "suboptimal":
            return "text-amber-600 bg-amber-50 border-amber-200";
        case "concern":
            return "text-red-600 bg-red-50 border-red-200";
    }
};

export function BloodSugarTracker({
    onSave,
    initialData = {},
}: BloodSugarTrackerProps) {
    const [saved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState<"log" | "trends" | "settings">("log");

    const today = new Date().toISOString().split("T")[0];

    const [data, setData] = useState<BloodSugarData>({
        entries: [],
        targetRanges: DEFAULT_TARGETS,
        ...initialData,
    });

    const [newReading, setNewReading] = useState<Partial<GlucoseReading>>({
        type: "fasting",
        value: 0,
        mealNotes: "",
    });

    // Get or create today's entry
    const getTodayEntry = (): DailyEntry => {
        const existing = data.entries.find(e => e.date === today);
        if (existing) return existing;
        return { date: today, readings: [], notes: "" };
    };

    const [todayEntry, setTodayEntry] = useState<DailyEntry>(getTodayEntry());

    // Load saved data
    useEffect(() => {
        const savedData = localStorage.getItem("blood-sugar-tracker");
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setData(prev => ({ ...prev, ...parsed }));
                const todayData = parsed.entries?.find((e: DailyEntry) => e.date === today);
                if (todayData) {
                    setTodayEntry(todayData);
                }
            } catch (e) {
                console.error("Error loading saved data:", e);
            }
        }
    }, [today]);

    // Auto-save
    useEffect(() => {
        const timeout = setTimeout(() => {
            localStorage.setItem("blood-sugar-tracker", JSON.stringify(data));
        }, 1000);
        return () => clearTimeout(timeout);
    }, [data]);

    const addReading = () => {
        if (!newReading.value || newReading.value <= 0) return;

        const reading: GlucoseReading = {
            id: Math.random().toString(36).substr(2, 9),
            timestamp: new Date().toISOString(),
            value: newReading.value,
            type: newReading.type as GlucoseReading["type"],
            mealNotes: newReading.mealNotes || "",
        };

        const updatedTodayEntry = {
            ...todayEntry,
            readings: [...todayEntry.readings, reading],
        };

        setTodayEntry(updatedTodayEntry);

        // Update entries array
        const otherEntries = data.entries.filter(e => e.date !== today);
        setData(prev => ({
            ...prev,
            entries: [...otherEntries, updatedTodayEntry].sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            ),
        }));

        // Reset form
        setNewReading({ type: "fasting", value: 0, mealNotes: "" });
        setSaved(false);
    };

    const deleteReading = (readingId: string) => {
        const updatedTodayEntry = {
            ...todayEntry,
            readings: todayEntry.readings.filter(r => r.id !== readingId),
        };
        setTodayEntry(updatedTodayEntry);

        const otherEntries = data.entries.filter(e => e.date !== today);
        setData(prev => ({
            ...prev,
            entries: [...otherEntries, updatedTodayEntry],
        }));
        setSaved(false);
    };

    const handleSave = async () => {
        if (onSave) {
            await onSave(data);
        }
        localStorage.setItem("blood-sugar-tracker", JSON.stringify(data));
        setSaved(true);
    };

    const handleDownloadPDF = () => {
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        const last7Days = data.entries.slice(0, 7);
        const allReadings = last7Days.flatMap(e => e.readings);
        const avgFasting = allReadings.filter(r => r.type === "fasting").reduce((sum, r) => sum + r.value, 0) /
            (allReadings.filter(r => r.type === "fasting").length || 1);
        const avgPostMeal = allReadings.filter(r => r.type === "post_meal").reduce((sum, r) => sum + r.value, 0) /
            (allReadings.filter(r => r.type === "post_meal").length || 1);

        printWindow.document.write(`
            <html>
                <head>
                    <title>Blood Sugar Tracking Report</title>
                    <style>
                        body { font-family: system-ui, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
                        h1 { color: #7c2d12; border-bottom: 2px solid #7c2d12; padding-bottom: 10px; }
                        h2 { color: #7c2d12; margin-top: 30px; }
                        .summary-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0; }
                        .summary-box { background: #f9fafb; padding: 20px; border-radius: 8px; text-align: center; }
                        .big-number { font-size: 32px; font-weight: bold; }
                        .optimal { color: #16a34a; }
                        .suboptimal { color: #d97706; }
                        .concern { color: #dc2626; }
                        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                        th, td { border: 1px solid #e5e7eb; padding: 10px; text-align: left; }
                        th { background: #f9fafb; }
                        .targets { background: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <h1>Blood Sugar Tracking Report</h1>
                    <p><strong>Report Period:</strong> Last 7 Days</p>
                    <p><strong>Generated:</strong> ${new Date().toLocaleDateString()}</p>

                    <div class="summary-grid">
                        <div class="summary-box">
                            <div>Average Fasting</div>
                            <div class="big-number ${avgFasting <= 100 ? 'optimal' : avgFasting <= 125 ? 'suboptimal' : 'concern'}">
                                ${Math.round(avgFasting)} mg/dL
                            </div>
                        </div>
                        <div class="summary-box">
                            <div>Average Post-Meal</div>
                            <div class="big-number ${avgPostMeal <= 140 ? 'optimal' : avgPostMeal <= 180 ? 'suboptimal' : 'concern'}">
                                ${Math.round(avgPostMeal)} mg/dL
                            </div>
                        </div>
                        <div class="summary-box">
                            <div>Total Readings</div>
                            <div class="big-number">${allReadings.length}</div>
                        </div>
                    </div>

                    <div class="targets">
                        <h3>Target Ranges</h3>
                        <p><strong>Fasting:</strong> ${data.targetRanges.fasting.min}-${data.targetRanges.fasting.max} mg/dL</p>
                        <p><strong>Pre-Meal:</strong> ${data.targetRanges.preMeal.min}-${data.targetRanges.preMeal.max} mg/dL</p>
                        <p><strong>Post-Meal:</strong> ${data.targetRanges.postMeal.min}-${data.targetRanges.postMeal.max} mg/dL</p>
                    </div>

                    <h2>Daily Log</h2>
                    ${last7Days.map(entry => `
                        <h3>${new Date(entry.date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</h3>
                        ${entry.readings.length > 0 ? `
                            <table>
                                <thead>
                                    <tr><th>Time</th><th>Type</th><th>Reading</th><th>Notes</th></tr>
                                </thead>
                                <tbody>
                                    ${entry.readings.map(r => `
                                        <tr>
                                            <td>${new Date(r.timestamp).toLocaleTimeString()}</td>
                                            <td>${READING_TYPES.find(t => t.id === r.type)?.label || r.type}</td>
                                            <td>${r.value} mg/dL</td>
                                            <td>${r.mealNotes || "-"}</td>
                                        </tr>
                                    `).join("")}
                                </tbody>
                            </table>
                        ` : "<p>No readings recorded</p>"}
                    `).join("")}

                    <p style="margin-top: 40px; text-align: center; color: #9ca3af; font-size: 12px;">
                        Generated ${new Date().toLocaleDateString()} via AccrediPro Academy
                    </p>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    // Calculate 7-day trends
    const last7Days = data.entries.slice(0, 7);
    const allRecentReadings = last7Days.flatMap(e => e.readings);
    const avgFasting = allRecentReadings.filter(r => r.type === "fasting").length > 0
        ? Math.round(allRecentReadings.filter(r => r.type === "fasting").reduce((sum, r) => sum + r.value, 0) /
            allRecentReadings.filter(r => r.type === "fasting").length)
        : 0;
    const avgPostMeal = allRecentReadings.filter(r => r.type === "post_meal").length > 0
        ? Math.round(allRecentReadings.filter(r => r.type === "post_meal").reduce((sum, r) => sum + r.value, 0) /
            allRecentReadings.filter(r => r.type === "post_meal").length)
        : 0;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <Activity className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Blood Sugar Tracker</h1>
                            <p className="text-blue-100">Monitor glucose levels and trends</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold">{todayEntry.readings.length}</div>
                        <div className="text-blue-200 text-sm">Readings Today</div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6">
                {[
                    { id: "log", label: "Log Reading", icon: Plus },
                    { id: "trends", label: "7-Day Trends", icon: TrendingUp },
                    { id: "settings", label: "Target Ranges", icon: Calendar },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as "log" | "trends" | "settings")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                            activeTab === tab.id
                                ? "bg-blue-600 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                {activeTab === "log" && (
                    <div className="space-y-6">
                        {/* Add New Reading */}
                        <div className="bg-blue-50 rounded-xl p-5">
                            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                <Plus className="w-5 h-5 text-blue-600" />
                                Log New Reading
                            </h2>

                            <div className="grid md:grid-cols-4 gap-4 mb-4">
                                {READING_TYPES.map(type => (
                                    <button
                                        key={type.id}
                                        onClick={() => setNewReading(prev => ({ ...prev, type: type.id as GlucoseReading["type"] }))}
                                        className={`p-3 rounded-lg border-2 text-center transition-all ${
                                            newReading.type === type.id
                                                ? "border-blue-500 bg-blue-100"
                                                : "border-gray-200 bg-white hover:border-gray-300"
                                        }`}
                                    >
                                        <type.icon className={`w-5 h-5 mx-auto mb-1 ${
                                            newReading.type === type.id ? "text-blue-600" : "text-gray-400"
                                        }`} />
                                        <div className="font-medium text-sm">{type.label}</div>
                                        <div className="text-xs text-gray-500">{type.time}</div>
                                    </button>
                                ))}
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="glucose">Glucose Reading (mg/dL)</Label>
                                    <Input
                                        id="glucose"
                                        type="number"
                                        value={newReading.value || ""}
                                        onChange={(e) => setNewReading(prev => ({ ...prev, value: Number(e.target.value) }))}
                                        placeholder="e.g., 95"
                                        className="mt-2 text-2xl font-bold h-14"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="notes">Meal/Activity Notes</Label>
                                    <Input
                                        id="notes"
                                        value={newReading.mealNotes || ""}
                                        onChange={(e) => setNewReading(prev => ({ ...prev, mealNotes: e.target.value }))}
                                        placeholder="e.g., After oatmeal breakfast"
                                        className="mt-2 h-14"
                                    />
                                </div>
                            </div>

                            <Button
                                onClick={addReading}
                                className="mt-4 bg-blue-600 hover:bg-blue-700"
                                disabled={!newReading.value || newReading.value <= 0}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Reading
                            </Button>
                        </div>

                        {/* Today's Readings */}
                        <div>
                            <h3 className="font-semibold mb-3 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-gray-400" />
                                Today&apos;s Readings
                            </h3>

                            {todayEntry.readings.length === 0 ? (
                                <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-xl">
                                    <Activity className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                                    <p>No readings logged yet today</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {todayEntry.readings.map(reading => {
                                        const status = getReadingStatus(reading.value, reading.type, data.targetRanges);
                                        const typeInfo = READING_TYPES.find(t => t.id === reading.type);
                                        return (
                                            <div
                                                key={reading.id}
                                                className={`flex items-center justify-between p-4 rounded-lg border ${getStatusColor(status)}`}
                                            >
                                                <div className="flex items-center gap-4">
                                                    {typeInfo && <typeInfo.icon className="w-5 h-5" />}
                                                    <div>
                                                        <div className="font-semibold">
                                                            {reading.value} mg/dL
                                                            <span className="ml-2 text-sm font-normal">
                                                                ({typeInfo?.label})
                                                            </span>
                                                        </div>
                                                        <div className="text-sm opacity-80">
                                                            {new Date(reading.timestamp).toLocaleTimeString()}
                                                            {reading.mealNotes && ` • ${reading.mealNotes}`}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    {status === "optimal" && <CheckCircle2 className="w-5 h-5" />}
                                                    {status === "concern" && <AlertTriangle className="w-5 h-5" />}
                                                    <button
                                                        onClick={() => deleteReading(reading.id)}
                                                        className="text-gray-400 hover:text-red-500"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Daily Notes */}
                        <div>
                            <Label htmlFor="dailyNotes">Daily Notes</Label>
                            <Textarea
                                id="dailyNotes"
                                value={todayEntry.notes}
                                onChange={(e) => {
                                    const updated = { ...todayEntry, notes: e.target.value };
                                    setTodayEntry(updated);
                                    const otherEntries = data.entries.filter(entry => entry.date !== today);
                                    setData(prev => ({ ...prev, entries: [...otherEntries, updated] }));
                                }}
                                placeholder="How did you feel today? Any patterns noticed?"
                                rows={2}
                                className="mt-2"
                            />
                        </div>
                    </div>
                )}

                {activeTab === "trends" && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-blue-600" />
                            7-Day Overview
                        </h2>

                        {/* Averages */}
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className={`rounded-xl p-5 text-center ${
                                avgFasting <= 100 ? "bg-green-50" :
                                avgFasting <= 125 ? "bg-amber-50" :
                                "bg-red-50"
                            }`}>
                                <Sun className={`w-6 h-6 mx-auto mb-2 ${
                                    avgFasting <= 100 ? "text-green-600" :
                                    avgFasting <= 125 ? "text-amber-600" :
                                    "text-red-600"
                                }`} />
                                <div className={`text-3xl font-bold ${
                                    avgFasting <= 100 ? "text-green-600" :
                                    avgFasting <= 125 ? "text-amber-600" :
                                    "text-red-600"
                                }`}>
                                    {avgFasting || "—"}
                                </div>
                                <div className="text-sm text-gray-600">Avg Fasting</div>
                                <div className="text-xs text-gray-400">Target: {data.targetRanges.fasting.min}-{data.targetRanges.fasting.max}</div>
                            </div>

                            <div className={`rounded-xl p-5 text-center ${
                                avgPostMeal <= 140 ? "bg-green-50" :
                                avgPostMeal <= 180 ? "bg-amber-50" :
                                "bg-red-50"
                            }`}>
                                <Coffee className={`w-6 h-6 mx-auto mb-2 ${
                                    avgPostMeal <= 140 ? "text-green-600" :
                                    avgPostMeal <= 180 ? "text-amber-600" :
                                    "text-red-600"
                                }`} />
                                <div className={`text-3xl font-bold ${
                                    avgPostMeal <= 140 ? "text-green-600" :
                                    avgPostMeal <= 180 ? "text-amber-600" :
                                    "text-red-600"
                                }`}>
                                    {avgPostMeal || "—"}
                                </div>
                                <div className="text-sm text-gray-600">Avg Post-Meal</div>
                                <div className="text-xs text-gray-400">Target: {data.targetRanges.postMeal.min}-{data.targetRanges.postMeal.max}</div>
                            </div>

                            <div className="bg-blue-50 rounded-xl p-5 text-center">
                                <Activity className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                                <div className="text-3xl font-bold text-blue-600">
                                    {allRecentReadings.length}
                                </div>
                                <div className="text-sm text-gray-600">Total Readings</div>
                                <div className="text-xs text-gray-400">Last 7 days</div>
                            </div>
                        </div>

                        {/* Simple Trend Visualization */}
                        <div className="bg-gray-50 rounded-xl p-5">
                            <h3 className="font-semibold mb-4">Daily Trend</h3>
                            <div className="flex items-end gap-2 h-32">
                                {last7Days.reverse().map((entry, i) => {
                                    const dayAvg = entry.readings.length > 0
                                        ? Math.round(entry.readings.reduce((sum, r) => sum + r.value, 0) / entry.readings.length)
                                        : 0;
                                    const height = dayAvg > 0 ? Math.min((dayAvg / 200) * 100, 100) : 10;
                                    const bgColor = dayAvg === 0 ? "bg-gray-200" :
                                        dayAvg <= 110 ? "bg-green-500" :
                                        dayAvg <= 140 ? "bg-amber-500" :
                                        "bg-red-500";

                                    return (
                                        <div key={entry.date} className="flex-1 flex flex-col items-center gap-1">
                                            <div
                                                className={`w-full rounded-t-lg transition-all ${bgColor}`}
                                                style={{ height: `${height}%`, minHeight: "8px" }}
                                            />
                                            <div className="text-xs text-gray-500">
                                                {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' })}
                                            </div>
                                            {dayAvg > 0 && (
                                                <div className="text-xs font-medium">{dayAvg}</div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Recent History */}
                        <div>
                            <h3 className="font-semibold mb-3">Recent Days</h3>
                            <div className="space-y-2">
                                {data.entries.slice(0, 7).map(entry => (
                                    <div key={entry.date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                        <div className="font-medium">
                                            {new Date(entry.date).toLocaleDateString('en-US', {
                                                weekday: 'short',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {entry.readings.length} reading{entry.readings.length !== 1 ? "s" : ""}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "settings" && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-blue-600" />
                            Target Ranges
                        </h2>
                        <p className="text-sm text-gray-500">
                            Set your personal glucose targets. These ranges are used for color-coding your readings.
                        </p>

                        <div className="space-y-6">
                            <div className="bg-blue-50 rounded-xl p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <Sun className="w-5 h-5 text-blue-600" />
                                    <h3 className="font-semibold">Fasting Glucose</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="fastingMin">Minimum (mg/dL)</Label>
                                        <Input
                                            id="fastingMin"
                                            type="number"
                                            value={data.targetRanges.fasting.min}
                                            onChange={(e) => setData(prev => ({
                                                ...prev,
                                                targetRanges: {
                                                    ...prev.targetRanges,
                                                    fasting: { ...prev.targetRanges.fasting, min: Number(e.target.value) },
                                                },
                                            }))}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="fastingMax">Maximum (mg/dL)</Label>
                                        <Input
                                            id="fastingMax"
                                            type="number"
                                            value={data.targetRanges.fasting.max}
                                            onChange={(e) => setData(prev => ({
                                                ...prev,
                                                targetRanges: {
                                                    ...prev.targetRanges,
                                                    fasting: { ...prev.targetRanges.fasting, max: Number(e.target.value) },
                                                },
                                            }))}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-green-50 rounded-xl p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <Utensils className="w-5 h-5 text-green-600" />
                                    <h3 className="font-semibold">Pre-Meal</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="preMin">Minimum (mg/dL)</Label>
                                        <Input
                                            id="preMin"
                                            type="number"
                                            value={data.targetRanges.preMeal.min}
                                            onChange={(e) => setData(prev => ({
                                                ...prev,
                                                targetRanges: {
                                                    ...prev.targetRanges,
                                                    preMeal: { ...prev.targetRanges.preMeal, min: Number(e.target.value) },
                                                },
                                            }))}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="preMax">Maximum (mg/dL)</Label>
                                        <Input
                                            id="preMax"
                                            type="number"
                                            value={data.targetRanges.preMeal.max}
                                            onChange={(e) => setData(prev => ({
                                                ...prev,
                                                targetRanges: {
                                                    ...prev.targetRanges,
                                                    preMeal: { ...prev.targetRanges.preMeal, max: Number(e.target.value) },
                                                },
                                            }))}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-amber-50 rounded-xl p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <Coffee className="w-5 h-5 text-amber-600" />
                                    <h3 className="font-semibold">Post-Meal (1-2 hours after eating)</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="postMin">Minimum (mg/dL)</Label>
                                        <Input
                                            id="postMin"
                                            type="number"
                                            value={data.targetRanges.postMeal.min}
                                            onChange={(e) => setData(prev => ({
                                                ...prev,
                                                targetRanges: {
                                                    ...prev.targetRanges,
                                                    postMeal: { ...prev.targetRanges.postMeal, min: Number(e.target.value) },
                                                },
                                            }))}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="postMax">Maximum (mg/dL)</Label>
                                        <Input
                                            id="postMax"
                                            type="number"
                                            value={data.targetRanges.postMeal.max}
                                            onChange={(e) => setData(prev => ({
                                                ...prev,
                                                targetRanges: {
                                                    ...prev.targetRanges,
                                                    postMeal: { ...prev.targetRanges.postMeal, max: Number(e.target.value) },
                                                },
                                            }))}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    {saved ? (
                        <>
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span>Saved</span>
                        </>
                    ) : (
                        <span>Auto-saving...</span>
                    )}
                </div>

                <div className="flex gap-3">
                    <Button variant="outline" onClick={handleDownloadPDF}>
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                    </Button>
                    <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                        <Save className="w-4 h-4 mr-2" />
                        Save Data
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default BloodSugarTracker;
