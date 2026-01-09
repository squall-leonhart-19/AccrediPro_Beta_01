"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Target,
    Heart,
    Moon,
    Flame,
    Droplets,
    Brain,
    CheckCircle2,
    Save,
    Download,
    AlertTriangle,
    Info,
} from "lucide-react";

interface HormoneData {
    symptoms: Record<string, boolean>;
    notes: string;
    menstrualCycle: string;
    lastPeriod: string;
}

interface HormoneSymptomCheckerProps {
    onSave?: (data: HormoneData) => void;
    initialData?: Partial<HormoneData>;
}

interface SymptomCategory {
    id: string;
    name: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
    description: string;
    symptoms: { id: string; label: string }[];
}

const HORMONE_CATEGORIES: SymptomCategory[] = [
    {
        id: "estrogen_dominance",
        name: "Estrogen Dominance",
        icon: Droplets,
        color: "text-pink-600",
        bgColor: "bg-pink-50",
        description: "Signs of excess estrogen relative to progesterone",
        symptoms: [
            { id: "ed_heavy_periods", label: "Heavy or prolonged periods" },
            { id: "ed_breast_tenderness", label: "Breast tenderness or swelling" },
            { id: "ed_bloating", label: "Bloating, especially before period" },
            { id: "ed_mood_swings", label: "PMS mood swings" },
            { id: "ed_weight_hips", label: "Weight gain in hips/thighs" },
            { id: "ed_fibroids", label: "Fibroids or cysts" },
            { id: "ed_headaches", label: "Menstrual migraines/headaches" },
            { id: "ed_fatigue", label: "Fatigue and low energy" },
        ],
    },
    {
        id: "progesterone_deficiency",
        name: "Low Progesterone",
        icon: Moon,
        color: "text-purple-600",
        bgColor: "bg-purple-50",
        description: "Signs of inadequate progesterone production",
        symptoms: [
            { id: "pd_anxiety", label: "Anxiety or nervousness" },
            { id: "pd_insomnia", label: "Difficulty sleeping" },
            { id: "pd_short_cycles", label: "Short menstrual cycles (<25 days)" },
            { id: "pd_spotting", label: "Spotting before period" },
            { id: "pd_infertility", label: "Difficulty conceiving" },
            { id: "pd_miscarriage", label: "History of miscarriage" },
            { id: "pd_irritability", label: "Irritability and mood changes" },
            { id: "pd_low_libido", label: "Low libido" },
        ],
    },
    {
        id: "low_estrogen",
        name: "Low Estrogen",
        icon: Heart,
        color: "text-red-600",
        bgColor: "bg-red-50",
        description: "Signs of estrogen deficiency (common in perimenopause)",
        symptoms: [
            { id: "le_hot_flashes", label: "Hot flashes or night sweats" },
            { id: "le_vaginal_dryness", label: "Vaginal dryness" },
            { id: "le_painful_sex", label: "Painful intercourse" },
            { id: "le_dry_skin", label: "Dry skin and wrinkles" },
            { id: "le_joint_pain", label: "Joint pain or stiffness" },
            { id: "le_brain_fog", label: "Brain fog and memory issues" },
            { id: "le_depression", label: "Low mood or depression" },
            { id: "le_bone_loss", label: "Bone density concerns" },
        ],
    },
    {
        id: "high_androgens",
        name: "High Androgens",
        icon: Flame,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        description: "Signs of elevated testosterone/DHEA (PCOS pattern)",
        symptoms: [
            { id: "ha_acne", label: "Adult acne (jaw, chin)" },
            { id: "ha_hair_loss", label: "Hair thinning/loss on head" },
            { id: "ha_facial_hair", label: "Facial hair growth" },
            { id: "ha_irregular", label: "Irregular or absent periods" },
            { id: "ha_weight_belly", label: "Weight gain around belly" },
            { id: "ha_oily_skin", label: "Oily skin" },
            { id: "ha_dark_patches", label: "Dark skin patches (neck, armpits)" },
            { id: "ha_cravings", label: "Sugar/carb cravings" },
        ],
    },
    {
        id: "thyroid_overlap",
        name: "Thyroid Connection",
        icon: Brain,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        description: "Thyroid symptoms that overlap with hormone imbalance",
        symptoms: [
            { id: "th_fatigue", label: "Persistent fatigue" },
            { id: "th_cold", label: "Always feeling cold" },
            { id: "th_constipation", label: "Constipation" },
            { id: "th_weight", label: "Unexplained weight changes" },
            { id: "th_hair", label: "Hair loss (outer eyebrow)" },
            { id: "th_dry_skin", label: "Dry skin and brittle nails" },
            { id: "th_depression", label: "Depression or brain fog" },
            { id: "th_irregular", label: "Irregular periods" },
        ],
    },
];

const getHormoneAnalysis = (symptoms: Record<string, boolean>): {
    category: string;
    score: number;
    percentage: number;
}[] => {
    return HORMONE_CATEGORIES.map(category => {
        const checkedCount = category.symptoms.filter(s => symptoms[s.id]).length;
        return {
            category: category.id,
            score: checkedCount,
            percentage: Math.round((checkedCount / category.symptoms.length) * 100),
        };
    }).sort((a, b) => b.percentage - a.percentage);
};

const getRecommendations = (symptoms: Record<string, boolean>): string[] => {
    const analysis = getHormoneAnalysis(symptoms);
    const recommendations: string[] = [];

    const topCategory = analysis[0];

    if (topCategory.percentage >= 50) {
        switch (topCategory.category) {
            case "estrogen_dominance":
                recommendations.push("Support liver detoxification with cruciferous vegetables");
                recommendations.push("Consider DIM or calcium D-glucarate supplements");
                recommendations.push("Reduce xenoestrogen exposure (plastics, conventional cosmetics)");
                recommendations.push("Increase fiber intake to 30-35g daily");
                break;
            case "progesterone_deficiency":
                recommendations.push("Support progesterone with vitex (chasteberry)");
                recommendations.push("Reduce stress to lower cortisol steal");
                recommendations.push("Consider seed cycling (flax/pumpkin days 1-14, sesame/sunflower days 15-28)");
                recommendations.push("Ensure adequate vitamin B6, zinc, and magnesium");
                break;
            case "low_estrogen":
                recommendations.push("Include phytoestrogen-rich foods (flaxseeds, fermented soy)");
                recommendations.push("Support adrenal function with adaptogens");
                recommendations.push("Consider black cohosh or maca for menopausal symptoms");
                recommendations.push("Weight-bearing exercise to protect bone density");
                break;
            case "high_androgens":
                recommendations.push("Balance blood sugar with low-glycemic eating");
                recommendations.push("Consider spearmint tea (2 cups daily) to lower androgens");
                recommendations.push("Support detoxification with adequate fiber");
                recommendations.push("Consider inositol for insulin sensitization");
                break;
            case "thyroid_overlap":
                recommendations.push("Request comprehensive thyroid panel (TSH, Free T3, Free T4, antibodies)");
                recommendations.push("Ensure adequate selenium, iodine, and zinc");
                recommendations.push("Reduce goitrogen consumption if hypothyroid");
                recommendations.push("Support gut health for thyroid hormone conversion");
                break;
        }
    }

    recommendations.push("Consider DUTCH test or comprehensive hormone panel");
    recommendations.push("Track symptoms across menstrual cycle for patterns");

    return recommendations.slice(0, 6);
};

export function HormoneSymptomChecker({
    onSave,
    initialData = {},
}: HormoneSymptomCheckerProps) {
    const [activeCategory, setActiveCategory] = useState(0);
    const [saved, setSaved] = useState(false);

    const [data, setData] = useState<HormoneData>({
        symptoms: {},
        notes: "",
        menstrualCycle: "",
        lastPeriod: "",
        ...initialData,
    });

    // Load saved data
    useEffect(() => {
        const savedData = localStorage.getItem("hormone-symptom-checker");
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
            localStorage.setItem("hormone-symptom-checker", JSON.stringify(data));
        }, 1000);
        return () => clearTimeout(timeout);
    }, [data]);

    const toggleSymptom = (symptomId: string) => {
        setData(prev => ({
            ...prev,
            symptoms: {
                ...prev.symptoms,
                [symptomId]: !prev.symptoms[symptomId],
            },
        }));
        setSaved(false);
    };

    const handleSave = async () => {
        if (onSave) {
            await onSave(data);
        }
        localStorage.setItem("hormone-symptom-checker", JSON.stringify(data));
        setSaved(true);
    };

    const handleDownloadPDF = () => {
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        const analysis = getHormoneAnalysis(data.symptoms);
        const recommendations = getRecommendations(data.symptoms);
        const totalSymptoms = Object.values(data.symptoms).filter(Boolean).length;

        printWindow.document.write(`
            <html>
                <head>
                    <title>Hormone Symptom Assessment</title>
                    <style>
                        body { font-family: system-ui, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
                        h1 { color: #7c2d12; border-bottom: 2px solid #7c2d12; padding-bottom: 10px; }
                        h2 { color: #7c2d12; margin-top: 30px; }
                        .summary { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; }
                        .category-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin: 20px 0; }
                        .category-box { padding: 15px; border-radius: 8px; border: 1px solid #e5e7eb; }
                        .high { background: #fef2f2; border-color: #fca5a5; }
                        .moderate { background: #fffbeb; border-color: #fcd34d; }
                        .low { background: #f0fdf4; border-color: #86efac; }
                        .symptoms-list { columns: 2; margin-top: 15px; }
                        .symptoms-list li { margin: 5px 0; }
                        .recommendations { background: #f0f9ff; padding: 20px; border-radius: 8px; margin-top: 20px; }
                    </style>
                </head>
                <body>
                    <h1>Hormone Symptom Assessment</h1>
                    <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                    ${data.menstrualCycle ? `<p><strong>Cycle Length:</strong> ${data.menstrualCycle} days</p>` : ""}

                    <div class="summary">
                        <h3>Assessment Summary</h3>
                        <p><strong>Total Symptoms Reported:</strong> ${totalSymptoms}</p>
                        <p><strong>Primary Pattern:</strong> ${HORMONE_CATEGORIES.find(c => c.id === analysis[0].category)?.name || "None"} (${analysis[0].percentage}%)</p>
                    </div>

                    <h2>Hormone Pattern Analysis</h2>
                    <div class="category-grid">
                        ${analysis.map(a => {
                            const category = HORMONE_CATEGORIES.find(c => c.id === a.category)!;
                            const levelClass = a.percentage >= 50 ? 'high' : a.percentage >= 25 ? 'moderate' : 'low';
                            return `
                                <div class="category-box ${levelClass}">
                                    <strong>${category.name}</strong>
                                    <div style="font-size: 24px; font-weight: bold;">${a.percentage}%</div>
                                    <small>${a.score}/${category.symptoms.length} symptoms</small>
                                </div>
                            `;
                        }).join("")}
                    </div>

                    <h2>Reported Symptoms</h2>
                    ${HORMONE_CATEGORIES.map(category => {
                        const checkedSymptoms = category.symptoms.filter(s => data.symptoms[s.id]);
                        if (checkedSymptoms.length === 0) return "";
                        return `
                            <h3>${category.name}</h3>
                            <ul class="symptoms-list">
                                ${checkedSymptoms.map(s => `<li>${s.label}</li>`).join("")}
                            </ul>
                        `;
                    }).join("")}

                    <div class="recommendations">
                        <h2>Recommendations</h2>
                        <ul>
                            ${recommendations.map(r => `<li>${r}</li>`).join("")}
                        </ul>
                    </div>

                    ${data.notes ? `
                        <h2>Notes</h2>
                        <p>${data.notes}</p>
                    ` : ""}

                    <p style="margin-top: 40px; text-align: center; color: #9ca3af; font-size: 12px;">
                        Generated ${new Date().toLocaleDateString()} via AccrediPro Academy
                    </p>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    };

    const analysis = getHormoneAnalysis(data.symptoms);
    const currentCategory = HORMONE_CATEGORIES[activeCategory];
    const totalChecked = Object.values(data.symptoms).filter(Boolean).length;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <Target className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">Hormone Symptom Checker</h1>
                            <p className="text-pink-100">Map symptoms to hormone imbalances</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold">{totalChecked}</div>
                        <div className="text-pink-200 text-sm">Symptoms</div>
                    </div>
                </div>
            </div>

            {/* Category Navigation */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {HORMONE_CATEGORIES.map((category, index) => {
                    const categorySymptomCount = category.symptoms.filter(s => data.symptoms[s.id]).length;
                    return (
                        <button
                            key={category.id}
                            onClick={() => setActiveCategory(index)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                                activeCategory === index
                                    ? `${category.bgColor} ${category.color}`
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            <category.icon className="w-4 h-4" />
                            <span className="hidden md:inline">{category.name}</span>
                            {categorySymptomCount > 0 && (
                                <span className={`w-5 h-5 rounded-full text-xs flex items-center justify-center ${
                                    activeCategory === index ? "bg-white/30" : "bg-gray-300"
                                }`}>
                                    {categorySymptomCount}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                {/* Category Header */}
                <div className={`${currentCategory.bgColor} rounded-xl p-5 mb-6`}>
                    <div className="flex items-center gap-3 mb-2">
                        <currentCategory.icon className={`w-6 h-6 ${currentCategory.color}`} />
                        <h2 className={`text-xl font-bold ${currentCategory.color}`}>
                            {currentCategory.name}
                        </h2>
                    </div>
                    <p className="text-gray-600 text-sm">{currentCategory.description}</p>
                </div>

                {/* Symptoms Checklist */}
                <div className="grid md:grid-cols-2 gap-3">
                    {currentCategory.symptoms.map(symptom => (
                        <button
                            key={symptom.id}
                            onClick={() => toggleSymptom(symptom.id)}
                            className={`flex items-center gap-3 p-4 rounded-lg border-2 text-left transition-all ${
                                data.symptoms[symptom.id]
                                    ? `border-pink-500 bg-pink-50`
                                    : "border-gray-200 hover:border-gray-300"
                            }`}
                        >
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                                data.symptoms[symptom.id]
                                    ? "border-pink-500 bg-pink-500"
                                    : "border-gray-300"
                            }`}>
                                {data.symptoms[symptom.id] && (
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                )}
                            </div>
                            <span className={data.symptoms[symptom.id] ? "text-pink-900 font-medium" : "text-gray-700"}>
                                {symptom.label}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Visual Mapping */}
                <div className="mt-8">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-gray-400" />
                        Hormone Pattern Overview
                    </h3>
                    <div className="grid grid-cols-5 gap-3">
                        {analysis.map(a => {
                            const category = HORMONE_CATEGORIES.find(c => c.id === a.category)!;
                            return (
                                <div
                                    key={a.category}
                                    className={`rounded-xl p-4 text-center ${category.bgColor}`}
                                >
                                    <category.icon className={`w-5 h-5 mx-auto mb-1 ${category.color}`} />
                                    <div className={`text-xl font-bold ${category.color}`}>
                                        {a.percentage}%
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1 hidden md:block">
                                        {category.name.split(" ")[0]}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Primary Pattern Alert */}
                {analysis[0].percentage >= 50 && (
                    <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-3">
                        <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0" />
                        <div>
                            <h4 className="font-semibold text-amber-900">
                                Primary Pattern: {HORMONE_CATEGORIES.find(c => c.id === analysis[0].category)?.name}
                            </h4>
                            <p className="text-amber-800 text-sm mt-1">
                                Your symptom profile suggests this may be a dominant hormonal pattern.
                                Consider discussing these findings with a healthcare provider.
                            </p>
                        </div>
                    </div>
                )}

                {/* Cycle Info */}
                <div className="mt-6 grid md:grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="cycle">Average Cycle Length (days)</Label>
                        <input
                            id="cycle"
                            type="number"
                            value={data.menstrualCycle}
                            onChange={(e) => setData(prev => ({ ...prev, menstrualCycle: e.target.value }))}
                            placeholder="e.g., 28"
                            className="w-full h-10 px-3 mt-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                    <div>
                        <Label htmlFor="lastPeriod">Last Period Start Date</Label>
                        <input
                            id="lastPeriod"
                            type="date"
                            value={data.lastPeriod}
                            onChange={(e) => setData(prev => ({ ...prev, lastPeriod: e.target.value }))}
                            className="w-full h-10 px-3 mt-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                    </div>
                </div>

                {/* Notes */}
                <div className="mt-6">
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                        id="notes"
                        value={data.notes}
                        onChange={(e) => setData(prev => ({ ...prev, notes: e.target.value }))}
                        placeholder="Birth control use, HRT, supplements, timing of symptoms..."
                        rows={3}
                        className="mt-2"
                    />
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
                    <Button onClick={handleSave} className="bg-pink-600 hover:bg-pink-700">
                        <Save className="w-4 h-4 mr-2" />
                        Save Assessment
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default HormoneSymptomChecker;
