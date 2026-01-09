"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Heart,
    Calendar,
    Save,
    Download,
    CheckCircle2,
    AlertTriangle,
    TrendingUp,
    Info,
} from "lucide-react";

interface SymptomEntry {
    id: string;
    severity: number;
    checked: boolean;
}

interface DailyEntry {
    date: string;
    symptoms: Record<string, SymptomEntry>;
    notes: string;
    overallScore: number;
}

interface GutHealthData {
    entries: DailyEntry[];
    currentDate: string;
}

interface GutHealthTrackerProps {
    onSave?: (data: GutHealthData) => void;
    initialData?: Partial<GutHealthData>;
}

const GUT_SYMPTOMS = [
    { id: "bloating", label: "Bloating", category: "digestive" },
    { id: "gas", label: "Excessive Gas", category: "digestive" },
    { id: "constipation", label: "Constipation", category: "bowel" },
    { id: "diarrhea", label: "Diarrhea", category: "bowel" },
    { id: "abdominal_pain", label: "Abdominal Pain/Cramping", category: "pain" },
    { id: "acid_reflux", label: "Acid Reflux/Heartburn", category: "digestive" },
    { id: "nausea", label: "Nausea", category: "digestive" },
    { id: "food_sensitivities", label: "Food Sensitivities", category: "reaction" },
    { id: "brain_fog", label: "Brain Fog", category: "systemic" },
    { id: "fatigue", label: "Fatigue after Eating", category: "systemic" },
    { id: "skin_issues", label: "Skin Issues (acne, rashes)", category: "systemic" },
    { id: "joint_pain", label: "Joint Pain", category: "systemic" },
];

const createDefaultSymptoms = (): Record<string, SymptomEntry> => {
    const symptoms: Record<string, SymptomEntry> = {};
    GUT_SYMPTOMS.forEach(s => {
        symptoms[s.id] = { id: s.id, severity: 0, checked: false };
    });
    return symptoms;
};

const getScoreColor = (score: number): string => {
    if (score <= 30) return "text-green-600";
    if (score <= 60) return "text-amber-600";
    return "text-red-600";
};

const getScoreLabel = (score: number): string => {
    if (score <= 30) return "Mild Symptoms";
    if (score <= 60) return "Moderate Symptoms";
    return "Significant Symptoms";
};

const getRecommendations = (score: number, symptoms: Record<string, SymptomEntry>): string[] => {
    const recommendations: string[] = [];

    if (score <= 30) {
        recommendations.push("Continue current dietary habits");
        recommendations.push("Maintain food journal to track triggers");
    }

    if (symptoms.bloating?.severity >= 5 || symptoms.gas?.severity >= 5) {
        recommendations.push("Consider digestive enzymes with meals");
        recommendations.push("Evaluate FODMAP intake");
    }

    if (symptoms.constipation?.severity >= 5) {
        recommendations.push("Increase fiber intake gradually");
        recommendations.push("Ensure adequate hydration (8+ glasses/day)");
        recommendations.push("Consider magnesium supplementation");
    }

    if (symptoms.diarrhea?.severity >= 5) {
        recommendations.push("Consider stool testing for pathogens");
        recommendations.push("Evaluate for food sensitivities");
    }

    if (symptoms.acid_reflux?.severity >= 5) {
        recommendations.push("Avoid eating 3 hours before bed");
        recommendations.push("Consider HCl support or digestive bitters");
    }

    if (symptoms.brain_fog?.severity >= 5 || symptoms.fatigue?.severity >= 5) {
        recommendations.push("Evaluate for intestinal permeability");
        recommendations.push("Consider elimination diet");
    }

    if (score > 60) {
        recommendations.push("Recommend comprehensive stool analysis");
        recommendations.push("Consider working with a functional medicine practitioner");
    }

    return recommendations.slice(0, 5);
};

export function GutHealthTracker({
    onSave,
    initialData = {},
}: GutHealthTrackerProps) {
    const [saved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState<"track" | "history" | "summary">("track");

    const today = new Date().toISOString().split("T")[0];

    const [data, setData] = useState<GutHealthData>({
        entries: [],
        currentDate: today,
        ...initialData,
    });

    const [currentEntry, setCurrentEntry] = useState<DailyEntry>({
        date: today,
        symptoms: createDefaultSymptoms(),
        notes: "",
        overallScore: 0,
    });

    // Load saved data
    useEffect(() => {
        const savedData = localStorage.getItem("gut-health-tracker");
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                setData(prev => ({ ...prev, ...parsed }));

                // Load today's entry if exists
                const todayEntry = parsed.entries?.find((e: DailyEntry) => e.date === today);
                if (todayEntry) {
                    setCurrentEntry(todayEntry);
                }
            } catch (e) {
                console.error("Error loading saved data:", e);
            }
        }
    }, [today]);

    // Auto-save
    useEffect(() => {
        const timeout = setTimeout(() => {
            localStorage.setItem("gut-health-tracker", JSON.stringify(data));
        }, 1000);
        return () => clearTimeout(timeout);
    }, [data]);

    // Calculate overall score
    useEffect(() => {
        const checkedSymptoms = Object.values(currentEntry.symptoms).filter(s => s.checked);
        if (checkedSymptoms.length === 0) {
            setCurrentEntry(prev => ({ ...prev, overallScore: 0 }));
            return;
        }

        const totalSeverity = checkedSymptoms.reduce((sum, s) => sum + s.severity, 0);
        const maxPossible = checkedSymptoms.length * 10;
        const score = Math.round((totalSeverity / maxPossible) * 100);
        setCurrentEntry(prev => ({ ...prev, overallScore: score }));
    }, [currentEntry.symptoms]);

    const updateSymptom = (symptomId: string, field: "checked" | "severity", value: boolean | number) => {
        setCurrentEntry(prev => ({
            ...prev,
            symptoms: {
                ...prev.symptoms,
                [symptomId]: {
                    ...prev.symptoms[symptomId],
                    [field]: value,
                    // Reset severity when unchecked
                    ...(field === "checked" && !value ? { severity: 0 } : {}),
                },
            },
        }));
        setSaved(false);
    };

    const saveEntry = () => {
        const updatedEntries = data.entries.filter(e => e.date !== currentEntry.date);
        updatedEntries.push(currentEntry);
        updatedEntries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const newData = { ...data, entries: updatedEntries };
        setData(newData);
        localStorage.setItem("gut-health-tracker", JSON.stringify(newData));

        if (onSave) {
            onSave(newData);
        }
        setSaved(true);
    };

    const handleDownloadPDF = () => {
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        const checkedSymptoms = Object.entries(currentEntry.symptoms)
            .filter(([, s]) => s.checked)
            .map(([id, s]) => ({
                label: GUT_SYMPTOMS.find(gs => gs.id === id)?.label || id,
                severity: s.severity,
            }));

        const recommendations = getRecommendations(currentEntry.overallScore, currentEntry.symptoms);

        printWindow.document.write(`
            <html>
                <head>
                    <title>Gut Health Assessment - ${currentEntry.date}</title>
                    <style>
                        body { font-family: system-ui, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
                        h1 { color: #7c2d12; border-bottom: 2px solid #7c2d12; padding-bottom: 10px; }
                        h2 { color: #7c2d12; margin-top: 30px; }
                        .score-box { background: #f9fafb; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
                        .score { font-size: 48px; font-weight: bold; }
                        .score.low { color: #16a34a; }
                        .score.moderate { color: #d97706; }
                        .score.high { color: #dc2626; }
                        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                        th, td { border: 1px solid #e5e7eb; padding: 10px; text-align: left; }
                        th { background: #f9fafb; }
                        .severity { display: inline-block; width: 20px; height: 20px; border-radius: 50%; }
                        .recommendations { background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 20px; }
                        .recommendations li { margin: 8px 0; }
                    </style>
                </head>
                <body>
                    <h1>Gut Health Assessment</h1>
                    <p><strong>Date:</strong> ${currentEntry.date}</p>

                    <div class="score-box">
                        <div class="score ${currentEntry.overallScore <= 30 ? 'low' : currentEntry.overallScore <= 60 ? 'moderate' : 'high'}">
                            ${currentEntry.overallScore}%
                        </div>
                        <div>${getScoreLabel(currentEntry.overallScore)}</div>
                    </div>

                    <h2>Reported Symptoms</h2>
                    ${checkedSymptoms.length > 0 ? `
                        <table>
                            <thead>
                                <tr><th>Symptom</th><th>Severity (1-10)</th></tr>
                            </thead>
                            <tbody>
                                ${checkedSymptoms.map(s => `
                                    <tr>
                                        <td>${s.label}</td>
                                        <td>${s.severity}/10</td>
                                    </tr>
                                `).join("")}
                            </tbody>
                        </table>
                    ` : "<p>No symptoms reported</p>"}

                    ${currentEntry.notes ? `
                        <h2>Notes</h2>
                        <p>${currentEntry.notes}</p>
                    ` : ""}

                    <div class="recommendations">
                        <h3>Recommendations</h3>
                        <ul>
                            ${recommendations.map(r => `<li>${r}</li>`).join("")}
                        </ul>
                    </div>

                    <p style="margin-top: 40px; text-align: center; color: #9ca3af; font-size: 12px;">
                        Generated ${new Date().toLocaleDateString()} via AccrediPro Academy
                    </p>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const recentEntries = data.entries.slice(0, 7);
    const averageScore = recentEntries.length > 0
        ? Math.round(recentEntries.reduce((sum, e) => sum + e.overallScore, 0) / recentEntries.length)
        : 0;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <Heart className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Gut Health Tracker</h1>
                            <p className="text-burgundy-100">Track and monitor digestive symptoms</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className={`text-3xl font-bold ${currentEntry.overallScore <= 30 ? 'text-green-300' : currentEntry.overallScore <= 60 ? 'text-amber-300' : 'text-red-300'}`}>
                            {currentEntry.overallScore}%
                        </div>
                        <div className="text-burgundy-200 text-sm">Symptom Score</div>
                    </div>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6">
                {[
                    { id: "track", label: "Track Today", icon: Calendar },
                    { id: "history", label: "History", icon: TrendingUp },
                    { id: "summary", label: "Summary", icon: Info },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as "track" | "history" | "summary")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                            activeTab === tab.id
                                ? "bg-burgundy-600 text-white"
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
                {activeTab === "track" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-burgundy-600" />
                                Daily Symptom Check
                            </h2>
                            <div className="text-sm text-gray-500">
                                {new Date(currentEntry.date).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                })}
                            </div>
                        </div>

                        <p className="text-sm text-gray-500">
                            Check the symptoms you&apos;re experiencing today and rate their severity (1-10).
                        </p>

                        <div className="space-y-3">
                            {GUT_SYMPTOMS.map(symptom => (
                                <div
                                    key={symptom.id}
                                    className={`rounded-lg border p-4 transition-all ${
                                        currentEntry.symptoms[symptom.id]?.checked
                                            ? "border-burgundy-300 bg-burgundy-50"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center gap-3 cursor-pointer flex-1">
                                            <input
                                                type="checkbox"
                                                checked={currentEntry.symptoms[symptom.id]?.checked || false}
                                                onChange={(e) => updateSymptom(symptom.id, "checked", e.target.checked)}
                                                className="w-5 h-5 rounded border-gray-300 text-burgundy-600 focus:ring-burgundy-500"
                                            />
                                            <span className="font-medium">{symptom.label}</span>
                                        </label>

                                        {currentEntry.symptoms[symptom.id]?.checked && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-500">Severity:</span>
                                                <input
                                                    type="range"
                                                    min="1"
                                                    max="10"
                                                    value={currentEntry.symptoms[symptom.id]?.severity || 1}
                                                    onChange={(e) => updateSymptom(symptom.id, "severity", Number(e.target.value))}
                                                    className="w-24 accent-burgundy-600"
                                                />
                                                <span className={`w-8 text-center font-bold ${
                                                    (currentEntry.symptoms[symptom.id]?.severity || 0) <= 3
                                                        ? "text-green-600"
                                                        : (currentEntry.symptoms[symptom.id]?.severity || 0) <= 6
                                                        ? "text-amber-600"
                                                        : "text-red-600"
                                                }`}>
                                                    {currentEntry.symptoms[symptom.id]?.severity || 1}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div>
                            <Label htmlFor="notes">Additional Notes</Label>
                            <Textarea
                                id="notes"
                                value={currentEntry.notes}
                                onChange={(e) => {
                                    setCurrentEntry(prev => ({ ...prev, notes: e.target.value }));
                                    setSaved(false);
                                }}
                                placeholder="Food eaten today, stress levels, other observations..."
                                rows={3}
                            />
                        </div>

                        {/* Score Summary */}
                        <div className={`rounded-xl p-5 ${
                            currentEntry.overallScore <= 30
                                ? "bg-green-50 border border-green-200"
                                : currentEntry.overallScore <= 60
                                ? "bg-amber-50 border border-amber-200"
                                : "bg-red-50 border border-red-200"
                        }`}>
                            <div className="flex items-center gap-3 mb-3">
                                {currentEntry.overallScore <= 30 ? (
                                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                                ) : currentEntry.overallScore <= 60 ? (
                                    <Info className="w-6 h-6 text-amber-600" />
                                ) : (
                                    <AlertTriangle className="w-6 h-6 text-red-600" />
                                )}
                                <div>
                                    <div className={`text-xl font-bold ${getScoreColor(currentEntry.overallScore)}`}>
                                        {getScoreLabel(currentEntry.overallScore)}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                        Overall symptom score: {currentEntry.overallScore}%
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "history" && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-burgundy-600" />
                            Recent Entries
                        </h2>

                        {recentEntries.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p>No entries yet. Start tracking today!</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {recentEntries.map(entry => {
                                    const checkedCount = Object.values(entry.symptoms).filter(s => s.checked).length;
                                    return (
                                        <div
                                            key={entry.date}
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                                        >
                                            <div>
                                                <div className="font-medium">
                                                    {new Date(entry.date).toLocaleDateString("en-US", {
                                                        weekday: "short",
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {checkedCount} symptom{checkedCount !== 1 ? "s" : ""} reported
                                                </div>
                                            </div>
                                            <div className={`text-xl font-bold ${getScoreColor(entry.overallScore)}`}>
                                                {entry.overallScore}%
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {/* 7-Day Average */}
                        {recentEntries.length > 0 && (
                            <div className="bg-burgundy-50 rounded-xl p-5 mt-6">
                                <div className="text-sm text-burgundy-600 mb-1">7-Day Average</div>
                                <div className={`text-3xl font-bold ${getScoreColor(averageScore)}`}>
                                    {averageScore}%
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === "summary" && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Info className="w-5 h-5 text-burgundy-600" />
                            Recommendations
                        </h2>

                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                            <h3 className="font-semibold text-amber-900 mb-3">Based on Your Symptoms</h3>
                            <ul className="space-y-2">
                                {getRecommendations(currentEntry.overallScore, currentEntry.symptoms).map((rec, i) => (
                                    <li key={i} className="flex items-start gap-2 text-amber-800">
                                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-amber-600 flex-shrink-0" />
                                        {rec}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-gray-50 rounded-xl p-5">
                            <h3 className="font-semibold mb-3">Understanding Your Score</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full bg-green-500" />
                                    <span><strong>0-30%:</strong> Mild symptoms - maintain current habits</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full bg-amber-500" />
                                    <span><strong>31-60%:</strong> Moderate symptoms - consider dietary adjustments</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-full bg-red-500" />
                                    <span><strong>61-100%:</strong> Significant symptoms - functional testing recommended</span>
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
                    <Button onClick={saveEntry} className="bg-burgundy-600 hover:bg-burgundy-700">
                        <Save className="w-4 h-4 mr-2" />
                        Save Entry
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default GutHealthTracker;
