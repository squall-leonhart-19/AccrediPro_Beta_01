"use client";

import { useState } from "react";
import {
    Lock,
    Gift,
    CheckCircle,
    FileText,
    Target,
    ClipboardList,
    Calendar,
    BarChart3,
    DollarSign,
    Phone,
    Mail,
    Share2,
    Users,
    MessageSquare,
    Sparkles,
    BookOpen,
    X,
    Download,
    Copy,
    Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface UnlockCondition {
    type: "message_sarah" | "complete_module" | "complete_course";
    moduleIndex?: number;
}

interface FreeResource {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: "client" | "business" | "marketing";
    unlockCondition: UnlockCondition;
    color: string;
}

// Resource definitions with unlock conditions
const FREE_RESOURCES: FreeResource[] = [
    {
        id: "smart-goals",
        title: "SMART Goals Worksheet",
        description: "Interactive goal-setting tool for client sessions",
        icon: "🎯",
        category: "client",
        unlockCondition: { type: "message_sarah" },
        color: "purple",
    },
    {
        id: "client-intake",
        title: "Client Intake Generator",
        description: "Create professional intake forms instantly",
        icon: "📋",
        category: "client",
        unlockCondition: { type: "complete_module", moduleIndex: 0 },
        color: "blue",
    },
    {
        id: "symptom-tracker",
        title: "7-Day Symptom Tracker",
        description: "Help clients track symptoms and patterns",
        icon: "📊",
        category: "client",
        unlockCondition: { type: "complete_module", moduleIndex: 0 },
        color: "teal",
    },
    {
        id: "consultation-notes",
        title: "Consultation Notes Template",
        description: "Professional session documentation",
        icon: "📝",
        category: "client",
        unlockCondition: { type: "complete_module", moduleIndex: 1 },
        color: "indigo",
    },
    {
        id: "health-history",
        title: "Health History Questionnaire",
        description: "Comprehensive client health assessment",
        icon: "🏥",
        category: "client",
        unlockCondition: { type: "complete_module", moduleIndex: 1 },
        color: "emerald",
    },
    {
        id: "meal-planner",
        title: "Weekly Meal Planner",
        description: "Create custom meal plans for clients",
        icon: "🥗",
        category: "client",
        unlockCondition: { type: "complete_module", moduleIndex: 2 },
        color: "green",
    },
    {
        id: "progress-report",
        title: "Progress Report Generator",
        description: "Visual progress reports for clients",
        icon: "📈",
        category: "business",
        unlockCondition: { type: "complete_module", moduleIndex: 2 },
        color: "amber",
    },
    {
        id: "client-agreement",
        title: "Client Agreement Template",
        description: "Professional service agreements",
        icon: "📄",
        category: "business",
        unlockCondition: { type: "complete_module", moduleIndex: 3 },
        color: "slate",
    },
    {
        id: "pricing-calculator",
        title: "Pricing Calculator",
        description: "Calculate your service pricing strategy",
        icon: "💰",
        category: "business",
        unlockCondition: { type: "complete_module", moduleIndex: 3 },
        color: "yellow",
    },
    {
        id: "discovery-call",
        title: "Discovery Call Script",
        description: "Convert prospects into paying clients",
        icon: "📞",
        category: "business",
        unlockCondition: { type: "complete_module", moduleIndex: 4 },
        color: "rose",
    },
    {
        id: "referral-letter",
        title: "Referral Letter Generator",
        description: "Professional referral templates",
        icon: "✉️",
        category: "business",
        unlockCondition: { type: "complete_module", moduleIndex: 4 },
        color: "cyan",
    },
    {
        id: "social-templates",
        title: "Social Media Templates",
        description: "Ready-to-use marketing content",
        icon: "📱",
        category: "marketing",
        unlockCondition: { type: "complete_module", moduleIndex: 5 },
        color: "pink",
    },
];

interface FreeResourcesTabProps {
    hasMessagedSarah: boolean;
    completedModules: number[]; // Array of completed module indices
    totalModules: number;
}

export function FreeResourcesTab({
    hasMessagedSarah,
    completedModules,
    totalModules,
}: FreeResourcesTabProps) {
    const [selectedResource, setSelectedResource] = useState<FreeResource | null>(null);

    const isUnlocked = (resource: FreeResource): boolean => {
        const { type, moduleIndex } = resource.unlockCondition;

        if (type === "message_sarah") {
            return hasMessagedSarah;
        }
        if (type === "complete_module" && moduleIndex !== undefined) {
            return completedModules.includes(moduleIndex);
        }
        if (type === "complete_course") {
            return completedModules.length >= totalModules;
        }
        return false;
    };

    const getUnlockText = (condition: UnlockCondition): string => {
        if (condition.type === "message_sarah") {
            return "Message Sarah to unlock";
        }
        if (condition.type === "complete_module" && condition.moduleIndex !== undefined) {
            return `Complete Module ${condition.moduleIndex + 1} to unlock`;
        }
        if (condition.type === "complete_course") {
            return "Complete the course to unlock";
        }
        return "Locked";
    };

    const unlockedCount = FREE_RESOURCES.filter(isUnlocked).length;
    const progressPercent = (unlockedCount / FREE_RESOURCES.length) * 100;

    const colorClasses: Record<string, { bg: string; border: string; icon: string }> = {
        purple: { bg: "bg-purple-50", border: "border-purple-200", icon: "text-purple-600" },
        blue: { bg: "bg-blue-50", border: "border-blue-200", icon: "text-blue-600" },
        teal: { bg: "bg-teal-50", border: "border-teal-200", icon: "text-teal-600" },
        indigo: { bg: "bg-indigo-50", border: "border-indigo-200", icon: "text-indigo-600" },
        emerald: { bg: "bg-emerald-50", border: "border-emerald-200", icon: "text-emerald-600" },
        green: { bg: "bg-green-50", border: "border-green-200", icon: "text-green-600" },
        amber: { bg: "bg-amber-50", border: "border-amber-200", icon: "text-amber-600" },
        slate: { bg: "bg-slate-50", border: "border-slate-200", icon: "text-slate-600" },
        yellow: { bg: "bg-yellow-50", border: "border-yellow-200", icon: "text-yellow-600" },
        rose: { bg: "bg-rose-50", border: "border-rose-200", icon: "text-rose-600" },
        cyan: { bg: "bg-cyan-50", border: "border-cyan-200", icon: "text-cyan-600" },
        pink: { bg: "bg-pink-50", border: "border-pink-200", icon: "text-pink-600" },
    };

    return (
        <div className="space-y-6">
            {/* Header with Progress */}
            <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 rounded-2xl p-6 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <Gift className="w-6 h-6 text-gold-400" />
                            <h2 className="text-xl font-bold">Free Coach Resources</h2>
                        </div>
                        <p className="text-burgundy-200 text-sm">
                            Unlock professional tools as you complete your training
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-3xl font-black text-gold-400">
                            {unlockedCount}/{FREE_RESOURCES.length}
                        </p>
                        <p className="text-xs text-burgundy-200">Resources Unlocked</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                    <div className="h-2 bg-burgundy-800 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-gold-400 to-gold-500 rounded-full transition-all duration-500"
                            style={{ width: `${progressPercent}%` }}
                        />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-burgundy-200">
                        <span>🔓 {unlockedCount} unlocked</span>
                        <span>🔒 {FREE_RESOURCES.length - unlockedCount} remaining</span>
                    </div>
                </div>
            </div>

            {/* Quick Unlock Tips */}
            {unlockedCount < FREE_RESOURCES.length && (
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-xl p-4">
                    <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Quick Ways to Unlock More
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-2 text-sm">
                        {!hasMessagedSarah && (
                            <a href="/messages" className="flex items-center gap-2 text-purple-700 hover:text-purple-900 hover:underline">
                                <MessageSquare className="w-4 h-4" />
                                Message Sarah → Unlock SMART Goals
                            </a>
                        )}
                        <a href="/courses" className="flex items-center gap-2 text-purple-700 hover:text-purple-900 hover:underline">
                            <BookOpen className="w-4 h-4" />
                            Continue your course → Unlock more tools
                        </a>
                    </div>
                </div>
            )}

            {/* Resources Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {FREE_RESOURCES.map((resource) => {
                    const unlocked = isUnlocked(resource);
                    const colors = colorClasses[resource.color] || colorClasses.blue;

                    return (
                        <div
                            key={resource.id}
                            onClick={() => unlocked && setSelectedResource(resource)}
                            className={`
                relative rounded-xl border-2 p-4 transition-all
                ${unlocked
                                    ? `${colors.bg} ${colors.border} cursor-pointer hover:shadow-lg hover:scale-[1.02]`
                                    : "bg-gray-50 border-gray-200 opacity-60"
                                }
              `}
                        >
                            {/* Lock/Unlock Badge */}
                            <div className="absolute -top-2 -right-2">
                                {unlocked ? (
                                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-md">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                ) : (
                                    <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center shadow-md">
                                        <Lock className="w-3 h-3 text-white" />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex items-start gap-3">
                                <div className={`text-3xl ${!unlocked && "grayscale"}`}>
                                    {resource.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className={`font-semibold ${unlocked ? "text-gray-900" : "text-gray-500"}`}>
                                        {resource.title}
                                    </h3>
                                    <p className={`text-xs mt-1 ${unlocked ? "text-gray-600" : "text-gray-400"}`}>
                                        {resource.description}
                                    </p>
                                </div>
                            </div>

                            {/* Unlock Requirement or Use Button */}
                            <div className="mt-3">
                                {unlocked ? (
                                    <Button
                                        size="sm"
                                        className="w-full bg-burgundy-600 hover:bg-burgundy-700 text-white"
                                    >
                                        Open Tool
                                    </Button>
                                ) : (
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-100 rounded-lg px-2 py-1.5">
                                        <Lock className="w-3 h-3" />
                                        <span>{getUnlockText(resource.unlockCondition)}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Resource Modal */}
            {selectedResource && (
                <ResourceModal
                    resource={selectedResource}
                    onClose={() => setSelectedResource(null)}
                />
            )}
        </div>
    );
}

// Interactive Resource Modal
function ResourceModal({
    resource,
    onClose
}: {
    resource: FreeResource;
    onClose: () => void;
}) {
    const [copied, setCopied] = useState(false);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success("Copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    // Render different content based on resource type
    const renderContent = () => {
        switch (resource.id) {
            case "smart-goals":
                return <SmartGoalsTool onCopy={handleCopy} copied={copied} />;
            case "client-intake":
                return <ClientIntakeTool onCopy={handleCopy} copied={copied} />;
            case "symptom-tracker":
                return <SymptomTrackerTool />;
            case "pricing-calculator":
                return <PricingCalculatorTool />;
            default:
                return <ComingSoonTool title={resource.title} />;
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">{resource.icon}</span>
                        <h2 className="text-lg font-bold text-white">{resource.title}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center"
                    >
                        <X className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
}

// SMART Goals Interactive Tool
function SmartGoalsTool({ onCopy, copied }: { onCopy: (text: string) => void; copied: boolean }) {
    const [goal, setGoal] = useState({
        specific: "",
        measurable: "",
        achievable: "",
        relevant: "",
        timeBound: "",
    });

    const generateGoalStatement = () => {
        return `SMART Goal Statement:

SPECIFIC: ${goal.specific || "[Not filled]"}
MEASURABLE: ${goal.measurable || "[Not filled]"}
ACHIEVABLE: ${goal.achievable || "[Not filled]"}
RELEVANT: ${goal.relevant || "[Not filled]"}
TIME-BOUND: ${goal.timeBound || "[Not filled]"}

Full Goal: I will ${goal.specific} by ${goal.measurable}. This is achievable because ${goal.achievable}. This matters because ${goal.relevant}. I will complete this by ${goal.timeBound}.`;
    };

    return (
        <div className="space-y-4">
            <p className="text-gray-600 text-sm">
                Help your clients set powerful, actionable goals using the SMART framework.
            </p>

            <div className="space-y-3">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <span className="text-purple-600 font-bold">S</span>pecific - What exactly do you want to achieve?
                    </label>
                    <input
                        type="text"
                        value={goal.specific}
                        onChange={(e) => setGoal({ ...goal, specific: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        placeholder="e.g., Lose 10 pounds of body fat"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <span className="text-blue-600 font-bold">M</span>easurable - How will you track progress?
                    </label>
                    <input
                        type="text"
                        value={goal.measurable}
                        onChange={(e) => setGoal({ ...goal, measurable: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        placeholder="e.g., Weekly weigh-ins and body measurements"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <span className="text-green-600 font-bold">A</span>chievable - Why is this realistic?
                    </label>
                    <input
                        type="text"
                        value={goal.achievable}
                        onChange={(e) => setGoal({ ...goal, achievable: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        placeholder="e.g., 1-2 lbs per week is healthy and sustainable"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <span className="text-amber-600 font-bold">R</span>elevant - Why does this matter to you?
                    </label>
                    <input
                        type="text"
                        value={goal.relevant}
                        onChange={(e) => setGoal({ ...goal, relevant: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        placeholder="e.g., I want more energy to play with my kids"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        <span className="text-red-600 font-bold">T</span>ime-Bound - When will you achieve this?
                    </label>
                    <input
                        type="text"
                        value={goal.timeBound}
                        onChange={(e) => setGoal({ ...goal, timeBound: e.target.value })}
                        className="w-full border rounded-lg px-3 py-2 text-sm"
                        placeholder="e.g., Within the next 8 weeks"
                    />
                </div>
            </div>

            {/* Generated Output */}
            <div className="bg-gray-50 rounded-lg p-4 border">
                <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">Generated Goal Statement</h4>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onCopy(generateGoalStatement())}
                        className="gap-1"
                    >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copied ? "Copied!" : "Copy"}
                    </Button>
                </div>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                    {generateGoalStatement()}
                </pre>
            </div>
        </div>
    );
}

// Client Intake Tool
function ClientIntakeTool({ onCopy, copied }: { onCopy: (text: string) => void; copied: boolean }) {
    const [formType, setFormType] = useState<"basic" | "comprehensive">("basic");

    const basicQuestions = `CLIENT INTAKE FORM (Basic)

PERSONAL INFORMATION
- Full Name: ________________
- Date of Birth: ________________
- Email: ________________
- Phone: ________________

HEALTH GOALS
1. What is your primary health goal?
2. What have you tried before?
3. What does success look like to you?

CURRENT HEALTH
- Current medications: ________________
- Known allergies: ________________
- Chronic conditions: ________________

LIFESTYLE
- Average sleep hours: ________________
- Exercise frequency: ________________
- Stress level (1-10): ________________
- Water intake (cups/day): ________________`;

    const comprehensiveQuestions = `CLIENT INTAKE FORM (Comprehensive)

SECTION 1: PERSONAL INFORMATION
- Full Name: ________________
- Date of Birth: ________________
- Address: ________________
- Email: ________________
- Phone: ________________
- Emergency Contact: ________________

SECTION 2: HEALTH HISTORY
- Primary care physician: ________________
- Last physical exam: ________________
- Current medications (including supplements): ________________
- Past surgeries: ________________
- Family health history: ________________
- Known allergies: ________________

SECTION 3: CURRENT SYMPTOMS
Rate 1-10 for each:
□ Fatigue: ___
□ Digestive issues: ___
□ Brain fog: ___
□ Joint pain: ___
□ Anxiety/Depression: ___
□ Sleep problems: ___
□ Skin issues: ___
□ Hormonal symptoms: ___

SECTION 4: LIFESTYLE ASSESSMENT
- Average hours of sleep: ___
- Sleep quality (1-10): ___
- Exercise type & frequency: ________________
- Stress level (1-10): ___
- Water intake (cups/day): ___
- Alcohol (drinks/week): ___
- Caffeine (cups/day): ___
- Smoking status: ___

SECTION 5: NUTRITION
- Typical breakfast: ________________
- Typical lunch: ________________
- Typical dinner: ________________
- Snacking habits: ________________
- Dietary restrictions: ________________

SECTION 6: GOALS & MOTIVATION
1. What brings you here today?
2. What is your primary health goal?
3. What does success look like in 3 months?
4. What obstacles have you faced before?
5. What are you ready to commit to?`;

    return (
        <div className="space-y-4">
            <p className="text-gray-600 text-sm">
                Generate professional client intake forms. Choose your template:
            </p>

            <div className="flex gap-2">
                <Button
                    size="sm"
                    variant={formType === "basic" ? "default" : "outline"}
                    onClick={() => setFormType("basic")}
                    className={formType === "basic" ? "bg-burgundy-600" : ""}
                >
                    Basic Form
                </Button>
                <Button
                    size="sm"
                    variant={formType === "comprehensive" ? "default" : "outline"}
                    onClick={() => setFormType("comprehensive")}
                    className={formType === "comprehensive" ? "bg-burgundy-600" : ""}
                >
                    Comprehensive Form
                </Button>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border max-h-80 overflow-y-auto">
                <div className="flex items-center justify-between mb-2 sticky top-0 bg-gray-50 pb-2">
                    <h4 className="font-semibold text-gray-900">
                        {formType === "basic" ? "Basic" : "Comprehensive"} Intake Form
                    </h4>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onCopy(formType === "basic" ? basicQuestions : comprehensiveQuestions)}
                        className="gap-1"
                    >
                        {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copied ? "Copied!" : "Copy"}
                    </Button>
                </div>
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                    {formType === "basic" ? basicQuestions : comprehensiveQuestions}
                </pre>
            </div>
        </div>
    );
}

// Symptom Tracker Tool
function SymptomTrackerTool() {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const symptoms = ["Energy", "Digestion", "Sleep", "Mood", "Pain"];
    const [tracker, setTracker] = useState<Record<string, Record<string, number>>>({});

    const updateSymptom = (day: string, symptom: string, value: number) => {
        setTracker(prev => ({
            ...prev,
            [day]: { ...prev[day], [symptom]: value }
        }));
    };

    return (
        <div className="space-y-4">
            <p className="text-gray-600 text-sm">
                Track symptoms throughout the week. Click cells to rate 1-5.
            </p>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="p-2 text-left">Symptom</th>
                            {days.map(day => (
                                <th key={day} className="p-2 text-center">{day}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {symptoms.map(symptom => (
                            <tr key={symptom} className="border-b">
                                <td className="p-2 font-medium">{symptom}</td>
                                {days.map(day => (
                                    <td key={day} className="p-2 text-center">
                                        <select
                                            value={tracker[day]?.[symptom] || ""}
                                            onChange={(e) => updateSymptom(day, symptom, parseInt(e.target.value))}
                                            className="w-12 text-center border rounded p-1"
                                        >
                                            <option value="">-</option>
                                            {[1, 2, 3, 4, 5].map(v => (
                                                <option key={v} value={v}>{v}</option>
                                            ))}
                                        </select>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm">
                <p className="font-medium text-amber-900">Rating Guide:</p>
                <p className="text-amber-700">1 = Poor/Severe | 3 = Moderate | 5 = Excellent/None</p>
            </div>
        </div>
    );
}

// Pricing Calculator Tool
function PricingCalculatorTool() {
    const [inputs, setInputs] = useState({
        desiredIncome: 60000,
        weeksOff: 4,
        hoursPerWeek: 20,
        clientSessionLength: 60,
        adminTimePercent: 30,
    });

    const weeksWorked = 52 - inputs.weeksOff;
    const clientHoursPerWeek = inputs.hoursPerWeek * (1 - inputs.adminTimePercent / 100);
    const sessionsPerWeek = Math.floor((clientHoursPerWeek * 60) / inputs.clientSessionLength);
    const sessionsPerYear = sessionsPerWeek * weeksWorked;
    const pricePerSession = Math.ceil(inputs.desiredIncome / sessionsPerYear);
    const monthlyPackagePrice = pricePerSession * 4;
    const quarterlyPackagePrice = pricePerSession * 12 * 0.9; // 10% discount

    return (
        <div className="space-y-4">
            <p className="text-gray-600 text-sm">
                Calculate your pricing based on income goals and availability.
            </p>

            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Desired Annual Income ($)
                    </label>
                    <input
                        type="number"
                        value={inputs.desiredIncome}
                        onChange={(e) => setInputs({ ...inputs, desiredIncome: parseInt(e.target.value) || 0 })}
                        className="w-full border rounded-lg px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Weeks Off Per Year
                    </label>
                    <input
                        type="number"
                        value={inputs.weeksOff}
                        onChange={(e) => setInputs({ ...inputs, weeksOff: parseInt(e.target.value) || 0 })}
                        className="w-full border rounded-lg px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Work Hours Per Week
                    </label>
                    <input
                        type="number"
                        value={inputs.hoursPerWeek}
                        onChange={(e) => setInputs({ ...inputs, hoursPerWeek: parseInt(e.target.value) || 0 })}
                        className="w-full border rounded-lg px-3 py-2"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Session Length (minutes)
                    </label>
                    <input
                        type="number"
                        value={inputs.clientSessionLength}
                        onChange={(e) => setInputs({ ...inputs, clientSessionLength: parseInt(e.target.value) || 60 })}
                        className="w-full border rounded-lg px-3 py-2"
                    />
                </div>
            </div>

            {/* Results */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-200">
                <h4 className="font-bold text-emerald-900 mb-3">💰 Your Pricing Breakdown</h4>
                <div className="grid sm:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-emerald-600">${pricePerSession}</p>
                        <p className="text-xs text-gray-600">Per Session</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-emerald-600">${monthlyPackagePrice}</p>
                        <p className="text-xs text-gray-600">Monthly Package (4 sessions)</p>
                    </div>
                    <div className="bg-white rounded-lg p-3 text-center">
                        <p className="text-2xl font-bold text-emerald-600">${Math.round(quarterlyPackagePrice)}</p>
                        <p className="text-xs text-gray-600">Quarterly (12 sessions, 10% off)</p>
                    </div>
                </div>
                <p className="text-xs text-emerald-700 mt-3">
                    Based on {sessionsPerWeek} sessions/week × {weeksWorked} weeks/year = {sessionsPerYear} sessions
                </p>
            </div>
        </div>
    );
}

// Placeholder for tools not yet built
function ComingSoonTool({ title }: { title: string }) {
    return (
        <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-500">
                This interactive tool is coming soon! 🚀
            </p>
            <p className="text-sm text-gray-400 mt-2">
                Check back as we add more features.
            </p>
        </div>
    );
}
