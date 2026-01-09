"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    TestTube,
    CheckCircle2,
    AlertTriangle,
    AlertCircle,
    Save,
    Download,
    Info,
    Beaker,
} from "lucide-react";

interface LabMarker {
    id: string;
    name: string;
    unit: string;
    conventionalRange: { min: number; max: number };
    optimalRange: { min: number; max: number };
    category: string;
    interpretation: {
        low: string;
        optimal: string;
        high: string;
    };
}

interface LabResult {
    markerId: string;
    value: number | null;
    notes: string;
}

interface LabData {
    results: Record<string, LabResult>;
    testDate: string;
    labName: string;
    overallNotes: string;
}

interface LabResultsCalculatorProps {
    onSave?: (data: LabData) => void;
    initialData?: Partial<LabData>;
}

const LAB_MARKERS: LabMarker[] = [
    // Thyroid
    {
        id: "tsh",
        name: "TSH",
        unit: "mIU/L",
        conventionalRange: { min: 0.45, max: 4.5 },
        optimalRange: { min: 1.0, max: 2.5 },
        category: "Thyroid",
        interpretation: {
            low: "May indicate hyperthyroidism or pituitary dysfunction",
            optimal: "Thyroid-pituitary axis functioning well",
            high: "May indicate hypothyroidism; check Free T3/T4",
        },
    },
    {
        id: "freeT4",
        name: "Free T4",
        unit: "ng/dL",
        conventionalRange: { min: 0.82, max: 1.77 },
        optimalRange: { min: 1.0, max: 1.5 },
        category: "Thyroid",
        interpretation: {
            low: "Low thyroid hormone production",
            optimal: "Good T4 production",
            high: "May indicate hyperthyroidism",
        },
    },
    {
        id: "freeT3",
        name: "Free T3",
        unit: "pg/mL",
        conventionalRange: { min: 2.0, max: 4.4 },
        optimalRange: { min: 3.0, max: 4.0 },
        category: "Thyroid",
        interpretation: {
            low: "Poor T4 to T3 conversion; check gut health, liver, selenium",
            optimal: "Good active thyroid hormone levels",
            high: "Possible hyperthyroidism",
        },
    },

    // Iron
    {
        id: "ferritin",
        name: "Ferritin",
        unit: "ng/mL",
        conventionalRange: { min: 12, max: 150 },
        optimalRange: { min: 50, max: 100 },
        category: "Iron",
        interpretation: {
            low: "Iron deficiency; assess absorption, diet, blood loss",
            optimal: "Good iron storage",
            high: "Iron overload or inflammation marker",
        },
    },
    {
        id: "iron",
        name: "Serum Iron",
        unit: "mcg/dL",
        conventionalRange: { min: 60, max: 170 },
        optimalRange: { min: 85, max: 130 },
        category: "Iron",
        interpretation: {
            low: "Low iron intake or absorption issues",
            optimal: "Adequate iron levels",
            high: "May indicate hemochromatosis",
        },
    },

    // Vitamins
    {
        id: "vitaminD",
        name: "Vitamin D (25-OH)",
        unit: "ng/mL",
        conventionalRange: { min: 30, max: 100 },
        optimalRange: { min: 50, max: 80 },
        category: "Vitamins",
        interpretation: {
            low: "Deficiency; linked to immune, bone, mood issues",
            optimal: "Good for immune function and bone health",
            high: "Possible toxicity above 100",
        },
    },
    {
        id: "b12",
        name: "Vitamin B12",
        unit: "pg/mL",
        conventionalRange: { min: 200, max: 900 },
        optimalRange: { min: 500, max: 800 },
        category: "Vitamins",
        interpretation: {
            low: "Deficiency; check intrinsic factor, diet",
            optimal: "Good for energy and neurological function",
            high: "Generally not concerning",
        },
    },
    {
        id: "folate",
        name: "Folate",
        unit: "ng/mL",
        conventionalRange: { min: 2.7, max: 17.0 },
        optimalRange: { min: 10, max: 15 },
        category: "Vitamins",
        interpretation: {
            low: "May affect methylation, mood, cell division",
            optimal: "Good methylation support",
            high: "Check for MTHFR; may mask B12 deficiency",
        },
    },

    // Blood Sugar
    {
        id: "fastingGlucose",
        name: "Fasting Glucose",
        unit: "mg/dL",
        conventionalRange: { min: 70, max: 100 },
        optimalRange: { min: 75, max: 90 },
        category: "Blood Sugar",
        interpretation: {
            low: "Hypoglycemia; evaluate adrenals and diet",
            optimal: "Good glucose regulation",
            high: "Prediabetes/insulin resistance concerns",
        },
    },
    {
        id: "hba1c",
        name: "Hemoglobin A1c",
        unit: "%",
        conventionalRange: { min: 4.0, max: 5.7 },
        optimalRange: { min: 4.8, max: 5.3 },
        category: "Blood Sugar",
        interpretation: {
            low: "May indicate blood sugar crashes",
            optimal: "Excellent 3-month glucose average",
            high: "Indicates prediabetes or diabetes",
        },
    },
    {
        id: "insulin",
        name: "Fasting Insulin",
        unit: "uIU/mL",
        conventionalRange: { min: 2.6, max: 24.9 },
        optimalRange: { min: 3, max: 8 },
        category: "Blood Sugar",
        interpretation: {
            low: "Low insulin production",
            optimal: "Good insulin sensitivity",
            high: "Insulin resistance; key marker for metabolic health",
        },
    },

    // Inflammation
    {
        id: "crp",
        name: "hs-CRP",
        unit: "mg/L",
        conventionalRange: { min: 0, max: 3.0 },
        optimalRange: { min: 0, max: 1.0 },
        category: "Inflammation",
        interpretation: {
            low: "Low inflammation",
            optimal: "Low cardiovascular and systemic inflammation",
            high: "Chronic inflammation; assess diet, gut, lifestyle",
        },
    },
    {
        id: "homocysteine",
        name: "Homocysteine",
        unit: "umol/L",
        conventionalRange: { min: 0, max: 15 },
        optimalRange: { min: 5, max: 8 },
        category: "Inflammation",
        interpretation: {
            low: "Generally not concerning",
            optimal: "Good methylation and cardiovascular marker",
            high: "Poor methylation; cardiovascular risk; check B vitamins",
        },
    },

    // Lipids
    {
        id: "totalChol",
        name: "Total Cholesterol",
        unit: "mg/dL",
        conventionalRange: { min: 0, max: 200 },
        optimalRange: { min: 150, max: 200 },
        category: "Lipids",
        interpretation: {
            low: "May affect hormone production",
            optimal: "Healthy cholesterol for hormone synthesis",
            high: "Evaluate triglycerides and particle size",
        },
    },
    {
        id: "hdl",
        name: "HDL Cholesterol",
        unit: "mg/dL",
        conventionalRange: { min: 40, max: 200 },
        optimalRange: { min: 55, max: 80 },
        category: "Lipids",
        interpretation: {
            low: "Increased cardiovascular risk",
            optimal: "Good protective cholesterol",
            high: "Generally protective",
        },
    },
    {
        id: "triglycerides",
        name: "Triglycerides",
        unit: "mg/dL",
        conventionalRange: { min: 0, max: 150 },
        optimalRange: { min: 40, max: 100 },
        category: "Lipids",
        interpretation: {
            low: "Generally not concerning",
            optimal: "Low cardiovascular and metabolic risk",
            high: "Insulin resistance marker; reduce refined carbs",
        },
    },
];

const CATEGORIES = [...new Set(LAB_MARKERS.map(m => m.category))];

const getResultStatus = (value: number, marker: LabMarker): "optimal" | "suboptimal" | "concern" => {
    if (value >= marker.optimalRange.min && value <= marker.optimalRange.max) {
        return "optimal";
    }
    if (value >= marker.conventionalRange.min && value <= marker.conventionalRange.max) {
        return "suboptimal";
    }
    return "concern";
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

const getStatusIcon = (status: "optimal" | "suboptimal" | "concern") => {
    switch (status) {
        case "optimal":
            return CheckCircle2;
        case "suboptimal":
            return AlertCircle;
        case "concern":
            return AlertTriangle;
    }
};

export function LabResultsCalculator({
    onSave,
    initialData = {},
}: LabResultsCalculatorProps) {
    const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
    const [saved, setSaved] = useState(false);

    const [data, setData] = useState<LabData>({
        results: {},
        testDate: new Date().toISOString().split("T")[0],
        labName: "",
        overallNotes: "",
        ...initialData,
    });

    // Load saved data
    useEffect(() => {
        const savedData = localStorage.getItem("lab-results-calculator");
        if (savedData) {
            try {
                setData(prev => ({ ...prev, ...JSON.parse(savedData) }));
            } catch (e) {
                console.error("Error loading saved data:", e);
            }
        }
    }, []);

    // Auto-save
    useEffect(() => {
        const timeout = setTimeout(() => {
            localStorage.setItem("lab-results-calculator", JSON.stringify(data));
        }, 1000);
        return () => clearTimeout(timeout);
    }, [data]);

    const updateResult = (markerId: string, value: number | null) => {
        setData(prev => ({
            ...prev,
            results: {
                ...prev.results,
                [markerId]: {
                    ...prev.results[markerId],
                    markerId,
                    value,
                    notes: prev.results[markerId]?.notes || "",
                },
            },
        }));
        setSaved(false);
    };

    const updateResultNotes = (markerId: string, notes: string) => {
        setData(prev => ({
            ...prev,
            results: {
                ...prev.results,
                [markerId]: {
                    ...prev.results[markerId],
                    markerId,
                    notes,
                    value: prev.results[markerId]?.value ?? null,
                },
            },
        }));
        setSaved(false);
    };

    const handleSave = async () => {
        if (onSave) {
            await onSave(data);
        }
        localStorage.setItem("lab-results-calculator", JSON.stringify(data));
        setSaved(true);
    };

    const handleDownloadPDF = () => {
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        const enteredResults = LAB_MARKERS.filter(m => data.results[m.id]?.value != null);
        const optimalCount = enteredResults.filter(m => getResultStatus(data.results[m.id]!.value!, m) === "optimal").length;
        const concernCount = enteredResults.filter(m => getResultStatus(data.results[m.id]!.value!, m) === "concern").length;

        printWindow.document.write(`
            <html>
                <head>
                    <title>Lab Results Analysis</title>
                    <style>
                        body { font-family: system-ui, sans-serif; padding: 40px; max-width: 900px; margin: 0 auto; }
                        h1 { color: #7c2d12; border-bottom: 2px solid #7c2d12; padding-bottom: 10px; }
                        h2 { color: #7c2d12; margin-top: 30px; }
                        .summary { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin: 20px 0; }
                        .summary-box { padding: 20px; border-radius: 8px; text-align: center; }
                        .optimal { background: #f0fdf4; color: #16a34a; }
                        .suboptimal { background: #fffbeb; color: #d97706; }
                        .concern { background: #fef2f2; color: #dc2626; }
                        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                        th, td { border: 1px solid #e5e7eb; padding: 10px; text-align: left; }
                        th { background: #f9fafb; }
                        .marker-name { font-weight: 600; }
                        .interpretation { font-size: 12px; color: #6b7280; margin-top: 4px; }
                        .range { font-size: 11px; color: #9ca3af; }
                    </style>
                </head>
                <body>
                    <h1>Functional Lab Analysis</h1>
                    <p><strong>Test Date:</strong> ${data.testDate}</p>
                    ${data.labName ? `<p><strong>Lab:</strong> ${data.labName}</p>` : ""}

                    <div class="summary">
                        <div class="summary-box optimal">
                            <div style="font-size: 32px; font-weight: bold;">${optimalCount}</div>
                            <div>Optimal</div>
                        </div>
                        <div class="summary-box suboptimal">
                            <div style="font-size: 32px; font-weight: bold;">${enteredResults.length - optimalCount - concernCount}</div>
                            <div>Suboptimal</div>
                        </div>
                        <div class="summary-box concern">
                            <div style="font-size: 32px; font-weight: bold;">${concernCount}</div>
                            <div>Needs Attention</div>
                        </div>
                    </div>

                    ${CATEGORIES.map(category => {
                        const categoryMarkers = LAB_MARKERS.filter(m => m.category === category && data.results[m.id]?.value != null);
                        if (categoryMarkers.length === 0) return "";

                        return `
                            <h2>${category}</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Marker</th>
                                        <th>Your Value</th>
                                        <th>Optimal Range</th>
                                        <th>Conv. Range</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${categoryMarkers.map(marker => {
                                        const result = data.results[marker.id];
                                        const status = getResultStatus(result.value!, marker);
                                        const isLow = result.value! < marker.optimalRange.min;
                                        const interpretation = isLow ? marker.interpretation.low :
                                            result.value! > marker.optimalRange.max ? marker.interpretation.high :
                                            marker.interpretation.optimal;

                                        return `
                                            <tr>
                                                <td>
                                                    <div class="marker-name">${marker.name}</div>
                                                    <div class="interpretation">${interpretation}</div>
                                                </td>
                                                <td><strong>${result.value} ${marker.unit}</strong></td>
                                                <td class="range">${marker.optimalRange.min}-${marker.optimalRange.max}</td>
                                                <td class="range">${marker.conventionalRange.min}-${marker.conventionalRange.max}</td>
                                                <td class="${status}">${status.charAt(0).toUpperCase() + status.slice(1)}</td>
                                            </tr>
                                        `;
                                    }).join("")}
                                </tbody>
                            </table>
                        `;
                    }).join("")}

                    ${data.overallNotes ? `
                        <h2>Notes</h2>
                        <p>${data.overallNotes}</p>
                    ` : ""}

                    <p style="margin-top: 40px; text-align: center; color: #9ca3af; font-size: 12px;">
                        Generated ${new Date().toLocaleDateString()} via AccrediPro Academy
                        <br>Optimal ranges based on functional medicine standards
                    </p>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const categoryMarkers = LAB_MARKERS.filter(m => m.category === activeCategory);
    const enteredCount = Object.values(data.results).filter(r => r.value != null).length;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-teal-600 to-cyan-600 text-white rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <TestTube className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Lab Results Calculator</h1>
                            <p className="text-teal-100">Compare conventional vs. functional optimal ranges</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold">{enteredCount}</div>
                        <div className="text-teal-200 text-sm">Markers Entered</div>
                    </div>
                </div>
            </div>

            {/* Test Info */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
                <div className="grid md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="testDate">Test Date</Label>
                        <Input
                            id="testDate"
                            type="date"
                            value={data.testDate}
                            onChange={(e) => setData(prev => ({ ...prev, testDate: e.target.value }))}
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <Label htmlFor="labName">Lab Name (optional)</Label>
                        <Input
                            id="labName"
                            value={data.labName}
                            onChange={(e) => setData(prev => ({ ...prev, labName: e.target.value }))}
                            placeholder="e.g., Quest, LabCorp"
                            className="mt-1"
                        />
                    </div>
                </div>
            </div>

            {/* Category Navigation */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {CATEGORIES.map(category => {
                    const categoryMarkersCount = LAB_MARKERS.filter(m => m.category === category).length;
                    const filledCount = LAB_MARKERS.filter(
                        m => m.category === category && data.results[m.id]?.value != null
                    ).length;

                    return (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                                activeCategory === category
                                    ? "bg-teal-600 text-white"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            <Beaker className="w-4 h-4" />
                            {category}
                            {filledCount > 0 && (
                                <span className={`text-xs px-1.5 rounded-full ${
                                    activeCategory === category ? "bg-white/30" : "bg-teal-100 text-teal-700"
                                }`}>
                                    {filledCount}/{categoryMarkersCount}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <TestTube className="w-5 h-5 text-teal-600" />
                        {activeCategory} Markers
                    </h2>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-green-500" />
                            Optimal
                        </span>
                        <span className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-amber-500" />
                            Suboptimal
                        </span>
                        <span className="flex items-center gap-1">
                            <div className="w-3 h-3 rounded-full bg-red-500" />
                            Concern
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    {categoryMarkers.map(marker => {
                        const result = data.results[marker.id];
                        const hasValue = result?.value != null;
                        const status = hasValue ? getResultStatus(result.value!, marker) : null;
                        const StatusIcon = status ? getStatusIcon(status) : null;

                        const isLow = hasValue && result.value! < marker.optimalRange.min;
                        const isHigh = hasValue && result.value! > marker.optimalRange.max;
                        const interpretation = !hasValue ? "" :
                            isLow ? marker.interpretation.low :
                            isHigh ? marker.interpretation.high :
                            marker.interpretation.optimal;

                        return (
                            <div
                                key={marker.id}
                                className={`rounded-xl border p-5 ${
                                    hasValue ? getStatusColor(status!) : "border-gray-200"
                                }`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h3 className="font-semibold text-lg flex items-center gap-2">
                                            {marker.name}
                                            {StatusIcon && <StatusIcon className="w-5 h-5" />}
                                        </h3>
                                        <div className="text-sm text-gray-500 mt-1">
                                            <span className="mr-4">
                                                <strong>Optimal:</strong> {marker.optimalRange.min}-{marker.optimalRange.max} {marker.unit}
                                            </span>
                                            <span className="text-gray-400">
                                                <strong>Conv:</strong> {marker.conventionalRange.min}-{marker.conventionalRange.max}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="w-32">
                                        <Input
                                            type="number"
                                            step="0.01"
                                            value={result?.value ?? ""}
                                            onChange={(e) => updateResult(marker.id, e.target.value ? Number(e.target.value) : null)}
                                            placeholder={marker.unit}
                                            className="text-right font-mono"
                                        />
                                    </div>
                                </div>

                                {hasValue && interpretation && (
                                    <div className={`flex items-start gap-2 p-3 rounded-lg mt-3 ${
                                        status === "optimal" ? "bg-green-100" :
                                        status === "suboptimal" ? "bg-amber-100" :
                                        "bg-red-100"
                                    }`}>
                                        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm">{interpretation}</span>
                                    </div>
                                )}

                                <Input
                                    value={result?.notes || ""}
                                    onChange={(e) => updateResultNotes(marker.id, e.target.value)}
                                    placeholder="Add notes..."
                                    className="mt-3 text-sm"
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Overall Notes */}
                <div className="mt-6 pt-6 border-t">
                    <Label htmlFor="overallNotes">Overall Assessment Notes</Label>
                    <Textarea
                        id="overallNotes"
                        value={data.overallNotes}
                        onChange={(e) => setData(prev => ({ ...prev, overallNotes: e.target.value }))}
                        placeholder="Overall observations, patterns, recommendations..."
                        rows={3}
                        className="mt-2"
                    />
                </div>
            </div>

            {/* Legend */}
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-5">
                <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-800">
                        <strong>Understanding the Ranges:</strong>
                        <ul className="mt-2 space-y-1">
                            <li><strong>Conventional Range:</strong> Standard lab reference range (excludes disease states)</li>
                            <li><strong>Optimal Range:</strong> Functional medicine targets for optimal health and prevention</li>
                            <li>Suboptimal values are within conventional range but not optimal for long-term health</li>
                        </ul>
                    </div>
                </div>
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
                    <Button onClick={handleSave} className="bg-teal-600 hover:bg-teal-700">
                        <Save className="w-4 h-4 mr-2" />
                        Save Results
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default LabResultsCalculator;
