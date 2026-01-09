"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Utensils,
    Droplets,
    Save,
    Download,
    CheckCircle2,
    AlertTriangle,
    ChevronRight,
    ChevronLeft,
    Apple,
    Beef,
    Wheat,
    Milk,
} from "lucide-react";

interface NutritionData {
    // Food Frequency
    fruitsVeggies: number;
    protein: number;
    wholeGrains: number;
    dairyAlternatives: number;
    processedFoods: number;
    sugarySoda: number;
    alcohol: number;
    caffeine: number;

    // Macros
    proteinGrams: number;
    carbsGrams: number;
    fatsGrams: number;
    fiberGrams: number;

    // Dietary Restrictions
    restrictions: string[];
    customRestrictions: string;

    // Hydration
    waterGlasses: number;
    hydrationNotes: string;

    // Overall
    eatingPatterns: string;
    mealTiming: string;
}

interface NutritionAssessmentProps {
    onSave?: (data: NutritionData) => void;
    initialData?: Partial<NutritionData>;
}

const FOOD_FREQUENCY_ITEMS = [
    { id: "fruitsVeggies", label: "Fruits & Vegetables", icon: Apple, unit: "servings/day", recommended: "5-9" },
    { id: "protein", label: "Lean Protein", icon: Beef, unit: "servings/day", recommended: "2-3" },
    { id: "wholeGrains", label: "Whole Grains", icon: Wheat, unit: "servings/day", recommended: "3-6" },
    { id: "dairyAlternatives", label: "Dairy/Alternatives", icon: Milk, unit: "servings/day", recommended: "2-3" },
    { id: "processedFoods", label: "Processed Foods", icon: Utensils, unit: "times/week", recommended: "<3" },
    { id: "sugarySoda", label: "Sugary Drinks/Soda", icon: Droplets, unit: "times/week", recommended: "0" },
    { id: "alcohol", label: "Alcohol", icon: Droplets, unit: "drinks/week", recommended: "<7" },
    { id: "caffeine", label: "Caffeine (coffee/tea)", icon: Droplets, unit: "cups/day", recommended: "1-3" },
];

const DIETARY_RESTRICTIONS = [
    { id: "gluten-free", label: "Gluten-Free" },
    { id: "dairy-free", label: "Dairy-Free" },
    { id: "vegetarian", label: "Vegetarian" },
    { id: "vegan", label: "Vegan" },
    { id: "keto", label: "Keto/Low Carb" },
    { id: "paleo", label: "Paleo" },
    { id: "fodmap", label: "Low FODMAP" },
    { id: "nut-free", label: "Nut-Free" },
    { id: "soy-free", label: "Soy-Free" },
    { id: "egg-free", label: "Egg-Free" },
];

const STEPS = [
    { id: "frequency", label: "Food Frequency" },
    { id: "macros", label: "Macronutrients" },
    { id: "restrictions", label: "Restrictions" },
    { id: "hydration", label: "Hydration" },
    { id: "review", label: "Review" },
];

const getNutritionScore = (data: NutritionData): number => {
    let score = 0;

    // Positive points
    if (data.fruitsVeggies >= 5) score += 20;
    else if (data.fruitsVeggies >= 3) score += 10;

    if (data.protein >= 2) score += 15;
    if (data.wholeGrains >= 3) score += 15;
    if (data.waterGlasses >= 8) score += 15;
    else if (data.waterGlasses >= 6) score += 10;

    if (data.fiberGrams >= 25) score += 10;
    else if (data.fiberGrams >= 15) score += 5;

    // Negative points
    if (data.processedFoods > 5) score -= 10;
    if (data.sugarySoda > 3) score -= 15;
    if (data.alcohol > 7) score -= 10;

    return Math.max(0, Math.min(100, score + 25)); // Base of 25
};

const getRecommendations = (data: NutritionData): string[] => {
    const recommendations: string[] = [];

    if (data.fruitsVeggies < 5) {
        recommendations.push("Increase fruit and vegetable intake to at least 5 servings daily");
    }

    if (data.protein < 2) {
        recommendations.push("Include more lean protein sources with each meal");
    }

    if (data.waterGlasses < 8) {
        recommendations.push("Aim for at least 8 glasses of water daily");
    }

    if (data.processedFoods > 5) {
        recommendations.push("Reduce processed food consumption to less than 3 times per week");
    }

    if (data.sugarySoda > 0) {
        recommendations.push("Eliminate or significantly reduce sugary drink intake");
    }

    if (data.fiberGrams < 25) {
        recommendations.push("Increase fiber intake through whole grains, legumes, and vegetables");
    }

    if (data.caffeine > 4) {
        recommendations.push("Consider reducing caffeine intake to 3 or fewer cups daily");
    }

    return recommendations.slice(0, 5);
};

export function NutritionAssessment({
    onSave,
    initialData = {},
}: NutritionAssessmentProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [saved, setSaved] = useState(false);

    const [data, setData] = useState<NutritionData>({
        fruitsVeggies: 3,
        protein: 2,
        wholeGrains: 2,
        dairyAlternatives: 1,
        processedFoods: 3,
        sugarySoda: 1,
        alcohol: 2,
        caffeine: 2,
        proteinGrams: 60,
        carbsGrams: 200,
        fatsGrams: 65,
        fiberGrams: 20,
        restrictions: [],
        customRestrictions: "",
        waterGlasses: 6,
        hydrationNotes: "",
        eatingPatterns: "",
        mealTiming: "",
        ...initialData,
    });

    // Load saved data
    useEffect(() => {
        const savedData = localStorage.getItem("nutrition-assessment");
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
            localStorage.setItem("nutrition-assessment", JSON.stringify(data));
        }, 1000);
        return () => clearTimeout(timeout);
    }, [data]);

    const updateField = <K extends keyof NutritionData>(field: K, value: NutritionData[K]) => {
        setData(prev => ({ ...prev, [field]: value }));
        setSaved(false);
    };

    const toggleRestriction = (restrictionId: string) => {
        setData(prev => ({
            ...prev,
            restrictions: prev.restrictions.includes(restrictionId)
                ? prev.restrictions.filter(r => r !== restrictionId)
                : [...prev.restrictions, restrictionId],
        }));
        setSaved(false);
    };

    const handleSave = async () => {
        if (onSave) {
            await onSave(data);
        }
        localStorage.setItem("nutrition-assessment", JSON.stringify(data));
        setSaved(true);
    };

    const handleDownloadPDF = () => {
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        const score = getNutritionScore(data);
        const recommendations = getRecommendations(data);
        const restrictionLabels = data.restrictions.map(
            r => DIETARY_RESTRICTIONS.find(d => d.id === r)?.label || r
        );

        printWindow.document.write(`
            <html>
                <head>
                    <title>Nutrition Assessment Report</title>
                    <style>
                        body { font-family: system-ui, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
                        h1 { color: #7c2d12; border-bottom: 2px solid #7c2d12; padding-bottom: 10px; }
                        h2 { color: #7c2d12; margin-top: 30px; }
                        .score-box { background: #f9fafb; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0; }
                        .score { font-size: 48px; font-weight: bold; }
                        .good { color: #16a34a; }
                        .moderate { color: #d97706; }
                        .needs-work { color: #dc2626; }
                        table { width: 100%; border-collapse: collapse; margin-top: 15px; }
                        th, td { border: 1px solid #e5e7eb; padding: 10px; text-align: left; }
                        th { background: #f9fafb; }
                        .recommendations { background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 20px; }
                        .macros { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin: 20px 0; }
                        .macro-box { background: #f0f9ff; padding: 15px; border-radius: 8px; text-align: center; }
                        .macro-value { font-size: 24px; font-weight: bold; color: #0369a1; }
                    </style>
                </head>
                <body>
                    <h1>Nutrition Assessment Report</h1>
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>

                    <div class="score-box">
                        <div class="score ${score >= 70 ? 'good' : score >= 50 ? 'moderate' : 'needs-work'}">
                            ${score}/100
                        </div>
                        <div>Overall Nutrition Score</div>
                    </div>

                    <h2>Daily Intake Summary</h2>
                    <table>
                        <thead>
                            <tr><th>Food Category</th><th>Current</th><th>Recommended</th></tr>
                        </thead>
                        <tbody>
                            ${FOOD_FREQUENCY_ITEMS.map(item => `
                                <tr>
                                    <td>${item.label}</td>
                                    <td>${data[item.id as keyof NutritionData]} ${item.unit}</td>
                                    <td>${item.recommended}</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>

                    <h2>Macronutrient Breakdown</h2>
                    <div class="macros">
                        <div class="macro-box">
                            <div class="macro-value">${data.proteinGrams}g</div>
                            <div>Protein</div>
                        </div>
                        <div class="macro-box">
                            <div class="macro-value">${data.carbsGrams}g</div>
                            <div>Carbs</div>
                        </div>
                        <div class="macro-box">
                            <div class="macro-value">${data.fatsGrams}g</div>
                            <div>Fats</div>
                        </div>
                        <div class="macro-box">
                            <div class="macro-value">${data.fiberGrams}g</div>
                            <div>Fiber</div>
                        </div>
                    </div>

                    <h2>Hydration</h2>
                    <p><strong>Water intake:</strong> ${data.waterGlasses} glasses/day</p>
                    ${data.hydrationNotes ? `<p>${data.hydrationNotes}</p>` : ""}

                    ${restrictionLabels.length > 0 ? `
                        <h2>Dietary Restrictions</h2>
                        <p>${restrictionLabels.join(", ")}</p>
                        ${data.customRestrictions ? `<p>Other: ${data.customRestrictions}</p>` : ""}
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

    const score = getNutritionScore(data);
    const currentStepId = STEPS[currentStep].id;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <Utensils className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Nutrition Assessment</h1>
                            <p className="text-green-100">Evaluate dietary habits and patterns</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className={`text-3xl font-bold ${score >= 70 ? 'text-green-300' : score >= 50 ? 'text-amber-300' : 'text-red-300'}`}>
                            {score}
                        </div>
                        <div className="text-green-200 text-sm">Nutrition Score</div>
                    </div>
                </div>

                {/* Progress */}
                <div className="flex items-center gap-1 mt-4">
                    {STEPS.map((step, index) => (
                        <div
                            key={step.id}
                            className={`flex-1 h-2 rounded-full ${
                                index <= currentStep ? "bg-white" : "bg-green-800/50"
                            }`}
                        />
                    ))}
                </div>
                <div className="flex justify-between mt-2 text-sm text-green-200">
                    <span>Step {currentStep + 1} of {STEPS.length}</span>
                    <span>{STEPS[currentStep].label}</span>
                </div>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                {currentStepId === "frequency" && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Apple className="w-5 h-5 text-green-600" />
                            Food Frequency Questionnaire
                        </h2>
                        <p className="text-sm text-gray-500">
                            How often do you consume the following food categories?
                        </p>

                        <div className="space-y-4">
                            {FOOD_FREQUENCY_ITEMS.map(item => (
                                <div key={item.id} className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <item.icon className="w-5 h-5 text-green-600" />
                                            <span className="font-medium">{item.label}</span>
                                        </div>
                                        <span className="text-sm text-gray-500">
                                            Recommended: {item.recommended}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <input
                                            type="range"
                                            min="0"
                                            max="10"
                                            value={data[item.id as keyof NutritionData] as number}
                                            onChange={(e) => updateField(item.id as keyof NutritionData, Number(e.target.value) as never)}
                                            className="flex-1 accent-green-600"
                                        />
                                        <span className="w-24 text-right font-medium">
                                            {data[item.id as keyof NutritionData]} {item.unit}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {currentStepId === "macros" && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Beef className="w-5 h-5 text-green-600" />
                            Macronutrient Tracking
                        </h2>
                        <p className="text-sm text-gray-500">
                            Estimate your typical daily macronutrient intake.
                        </p>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="bg-blue-50 rounded-lg p-4">
                                <Label htmlFor="protein">Protein (g/day)</Label>
                                <Input
                                    id="protein"
                                    type="number"
                                    value={data.proteinGrams}
                                    onChange={(e) => updateField("proteinGrams", Number(e.target.value))}
                                    className="mt-2"
                                />
                                <p className="text-xs text-blue-600 mt-1">Recommended: 0.8-1g per lb body weight</p>
                            </div>

                            <div className="bg-amber-50 rounded-lg p-4">
                                <Label htmlFor="carbs">Carbohydrates (g/day)</Label>
                                <Input
                                    id="carbs"
                                    type="number"
                                    value={data.carbsGrams}
                                    onChange={(e) => updateField("carbsGrams", Number(e.target.value))}
                                    className="mt-2"
                                />
                                <p className="text-xs text-amber-600 mt-1">Recommended: 150-300g for active individuals</p>
                            </div>

                            <div className="bg-purple-50 rounded-lg p-4">
                                <Label htmlFor="fats">Fats (g/day)</Label>
                                <Input
                                    id="fats"
                                    type="number"
                                    value={data.fatsGrams}
                                    onChange={(e) => updateField("fatsGrams", Number(e.target.value))}
                                    className="mt-2"
                                />
                                <p className="text-xs text-purple-600 mt-1">Recommended: 20-35% of total calories</p>
                            </div>

                            <div className="bg-green-50 rounded-lg p-4">
                                <Label htmlFor="fiber">Fiber (g/day)</Label>
                                <Input
                                    id="fiber"
                                    type="number"
                                    value={data.fiberGrams}
                                    onChange={(e) => updateField("fiberGrams", Number(e.target.value))}
                                    className="mt-2"
                                />
                                <p className="text-xs text-green-600 mt-1">Recommended: 25-35g daily</p>
                            </div>
                        </div>

                        {/* Calorie estimate */}
                        <div className="bg-gray-50 rounded-lg p-4">
                            <div className="text-sm text-gray-500 mb-1">Estimated Daily Calories</div>
                            <div className="text-2xl font-bold">
                                {(data.proteinGrams * 4) + (data.carbsGrams * 4) + (data.fatsGrams * 9)} kcal
                            </div>
                        </div>
                    </div>
                )}

                {currentStepId === "restrictions" && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-green-600" />
                            Dietary Restrictions
                        </h2>
                        <p className="text-sm text-gray-500">
                            Select any dietary restrictions or preferences.
                        </p>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {DIETARY_RESTRICTIONS.map(restriction => (
                                <button
                                    key={restriction.id}
                                    onClick={() => toggleRestriction(restriction.id)}
                                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                                        data.restrictions.includes(restriction.id)
                                            ? "border-green-500 bg-green-50 text-green-700"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                >
                                    <div className="flex items-center gap-2">
                                        {data.restrictions.includes(restriction.id) && (
                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        )}
                                        <span className="font-medium">{restriction.label}</span>
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div>
                            <Label htmlFor="customRestrictions">Other Restrictions/Allergies</Label>
                            <Input
                                id="customRestrictions"
                                value={data.customRestrictions}
                                onChange={(e) => updateField("customRestrictions", e.target.value)}
                                placeholder="e.g., nightshades, shellfish, etc."
                                className="mt-2"
                            />
                        </div>
                    </div>
                )}

                {currentStepId === "hydration" && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Droplets className="w-5 h-5 text-blue-600" />
                            Hydration Tracking
                        </h2>

                        <div className="bg-blue-50 rounded-xl p-6">
                            <Label htmlFor="water" className="text-lg">Daily Water Intake</Label>
                            <div className="flex items-center gap-4 mt-4">
                                <input
                                    type="range"
                                    id="water"
                                    min="0"
                                    max="15"
                                    value={data.waterGlasses}
                                    onChange={(e) => updateField("waterGlasses", Number(e.target.value))}
                                    className="flex-1 accent-blue-600"
                                />
                                <div className="text-center">
                                    <div className={`text-3xl font-bold ${
                                        data.waterGlasses >= 8 ? "text-green-600" :
                                        data.waterGlasses >= 6 ? "text-amber-600" :
                                        "text-red-600"
                                    }`}>
                                        {data.waterGlasses}
                                    </div>
                                    <div className="text-sm text-gray-500">glasses/day</div>
                                </div>
                            </div>

                            <div className="mt-4 flex gap-2">
                                {[...Array(15)].map((_, i) => (
                                    <div
                                        key={i}
                                        className={`flex-1 h-3 rounded-full ${
                                            i < data.waterGlasses
                                                ? i < 6 ? "bg-red-400" : i < 8 ? "bg-amber-400" : "bg-blue-500"
                                                : "bg-gray-200"
                                        }`}
                                    />
                                ))}
                            </div>

                            <p className="text-sm text-blue-700 mt-3">
                                {data.waterGlasses >= 8
                                    ? "Great job! You're meeting hydration goals."
                                    : `Try to increase water intake by ${8 - data.waterGlasses} more glasses.`}
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="hydrationNotes">Hydration Notes</Label>
                            <Input
                                id="hydrationNotes"
                                value={data.hydrationNotes}
                                onChange={(e) => updateField("hydrationNotes", e.target.value)}
                                placeholder="e.g., drinks mostly herbal tea, limited access at work..."
                                className="mt-2"
                            />
                        </div>
                    </div>
                )}

                {currentStepId === "review" && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            Assessment Summary
                        </h2>

                        {/* Score */}
                        <div className={`rounded-xl p-6 text-center ${
                            score >= 70 ? "bg-green-50" : score >= 50 ? "bg-amber-50" : "bg-red-50"
                        }`}>
                            <div className={`text-5xl font-bold mb-2 ${
                                score >= 70 ? "text-green-600" : score >= 50 ? "text-amber-600" : "text-red-600"
                            }`}>
                                {score}/100
                            </div>
                            <div className="text-gray-600">
                                {score >= 70 ? "Excellent nutrition habits!" :
                                 score >= 50 ? "Good foundation with room for improvement" :
                                 "Significant opportunities for dietary improvement"}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-green-600">{data.fruitsVeggies}</div>
                                <div className="text-xs text-gray-500">Fruits/Veggies</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-blue-600">{data.waterGlasses}</div>
                                <div className="text-xs text-gray-500">Water Glasses</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-purple-600">{data.proteinGrams}g</div>
                                <div className="text-xs text-gray-500">Daily Protein</div>
                            </div>
                            <div className="bg-gray-50 rounded-lg p-4 text-center">
                                <div className="text-2xl font-bold text-amber-600">{data.fiberGrams}g</div>
                                <div className="text-xs text-gray-500">Daily Fiber</div>
                            </div>
                        </div>

                        {/* Recommendations */}
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                            <h3 className="font-semibold text-amber-900 mb-3">Recommendations</h3>
                            <ul className="space-y-2">
                                {getRecommendations(data).map((rec, i) => (
                                    <li key={i} className="flex items-start gap-2 text-amber-800 text-sm">
                                        <CheckCircle2 className="w-4 h-4 mt-0.5 text-amber-600 flex-shrink-0" />
                                        {rec}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6 p-4 bg-gray-50 rounded-xl">
                <Button
                    variant="outline"
                    onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
                    disabled={currentStep === 0}
                >
                    <ChevronLeft className="w-4 h-4 mr-2" />
                    Previous
                </Button>

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
                    {currentStep === STEPS.length - 1 ? (
                        <>
                            <Button variant="outline" onClick={handleDownloadPDF}>
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </Button>
                            <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                                <Save className="w-4 h-4 mr-2" />
                                Save Assessment
                            </Button>
                        </>
                    ) : (
                        <Button onClick={() => setCurrentStep(prev => prev + 1)} className="bg-green-600 hover:bg-green-700">
                            Next
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default NutritionAssessment;
