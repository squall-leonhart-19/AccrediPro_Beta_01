"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    ClipboardList,
    Pill,
    Utensils,
    Activity,
    Moon,
    Brain,
    Plus,
    Trash2,
    ChevronRight,
    ChevronLeft,
    Save,
    Download,
    CheckCircle2,
    AlertCircle,
} from "lucide-react";

interface ProtocolItem {
    id: string;
    name: string;
    dosage: string;
    timing: string;
    duration: string;
    notes: string;
}

interface ProtocolData {
    clientName: string;
    primaryConcern: string;
    startDate: string;
    duration: string;

    // Categories
    supplements: ProtocolItem[];
    dietary: ProtocolItem[];
    lifestyle: ProtocolItem[];
    sleep: ProtocolItem[];
    mindset: ProtocolItem[];

    // Notes
    generalNotes: string;
    contraindications: string;
    followUp: string;
}

interface ProtocolBuilderProps {
    practitionerName?: string;
    onSave?: (data: ProtocolData) => void;
    initialData?: Partial<ProtocolData>;
}

const STEPS = [
    { id: "client", label: "Client Info", icon: ClipboardList },
    { id: "supplements", label: "Supplements", icon: Pill },
    { id: "dietary", label: "Dietary", icon: Utensils },
    { id: "lifestyle", label: "Lifestyle", icon: Activity },
    { id: "sleep", label: "Sleep", icon: Moon },
    { id: "mindset", label: "Mindset", icon: Brain },
    { id: "review", label: "Review", icon: CheckCircle2 },
];

const createEmptyItem = (): ProtocolItem => ({
    id: Math.random().toString(36).substr(2, 9),
    name: "",
    dosage: "",
    timing: "",
    duration: "",
    notes: "",
});

export function ProtocolBuilder({
    practitionerName = "Your Name",
    onSave,
    initialData = {},
}: ProtocolBuilderProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [protocol, setProtocol] = useState<ProtocolData>({
        clientName: "",
        primaryConcern: "",
        startDate: new Date().toISOString().split("T")[0],
        duration: "12 weeks",
        supplements: [createEmptyItem()],
        dietary: [createEmptyItem()],
        lifestyle: [createEmptyItem()],
        sleep: [createEmptyItem()],
        mindset: [createEmptyItem()],
        generalNotes: "",
        contraindications: "",
        followUp: "4 weeks",
        ...initialData,
    });

    // Load saved data
    useEffect(() => {
        const savedData = localStorage.getItem("protocol-builder");
        if (savedData) {
            try {
                setProtocol(prev => ({ ...prev, ...JSON.parse(savedData) }));
            } catch (e) {
                console.error("Error loading saved protocol:", e);
            }
        }
    }, []);

    // Auto-save
    useEffect(() => {
        const timeout = setTimeout(() => {
            localStorage.setItem("protocol-builder", JSON.stringify(protocol));
        }, 1000);
        return () => clearTimeout(timeout);
    }, [protocol]);

    const updateField = (field: keyof ProtocolData, value: string | ProtocolItem[]) => {
        setProtocol(prev => ({ ...prev, [field]: value }));
        setSaved(false);
    };

    const addItem = (category: keyof Pick<ProtocolData, "supplements" | "dietary" | "lifestyle" | "sleep" | "mindset">) => {
        setProtocol(prev => ({
            ...prev,
            [category]: [...prev[category], createEmptyItem()],
        }));
    };

    const removeItem = (category: keyof Pick<ProtocolData, "supplements" | "dietary" | "lifestyle" | "sleep" | "mindset">, id: string) => {
        setProtocol(prev => ({
            ...prev,
            [category]: prev[category].filter(item => item.id !== id),
        }));
    };

    const updateItem = (
        category: keyof Pick<ProtocolData, "supplements" | "dietary" | "lifestyle" | "sleep" | "mindset">,
        id: string,
        field: keyof ProtocolItem,
        value: string
    ) => {
        setProtocol(prev => ({
            ...prev,
            [category]: prev[category].map(item =>
                item.id === id ? { ...item, [field]: value } : item
            ),
        }));
        setSaved(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (onSave) {
                await onSave(protocol);
            }
            localStorage.setItem("protocol-builder", JSON.stringify(protocol));
            setSaved(true);
        } catch (e) {
            console.error("Error saving protocol:", e);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDownloadPDF = () => {
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        const renderItems = (items: ProtocolItem[], title: string) => {
            const filledItems = items.filter(i => i.name.trim());
            if (filledItems.length === 0) return "";

            return `
        <h2>${title}</h2>
        <table>
          <thead>
            <tr>
              <th>Recommendation</th>
              <th>Dosage/Details</th>
              <th>Timing</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            ${filledItems.map(item => `
              <tr>
                <td><strong>${item.name}</strong>${item.notes ? `<br><small>${item.notes}</small>` : ""}</td>
                <td>${item.dosage || "-"}</td>
                <td>${item.timing || "-"}</td>
                <td>${item.duration || "-"}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
        };

        printWindow.document.write(`
      <html>
        <head>
          <title>Health Protocol - ${protocol.clientName}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; max-width: 900px; margin: 0 auto; }
            h1 { color: #7c2d12; border-bottom: 2px solid #7c2d12; padding-bottom: 10px; }
            h2 { color: #7c2d12; margin-top: 30px; font-size: 18px; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; }
            th, td { border: 1px solid #e5e7eb; padding: 10px; text-align: left; }
            th { background: #f9fafb; font-weight: 600; }
            small { color: #6b7280; }
            .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .meta { background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
            .meta p { margin: 5px 0; }
            .notes { background: #fef3c7; padding: 15px; border-radius: 8px; margin-top: 30px; }
            .warning { background: #fee2e2; padding: 15px; border-radius: 8px; margin-top: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Personalized Health Protocol</h1>
          </div>
          
          <div class="meta">
            <p><strong>Client:</strong> ${protocol.clientName}</p>
            <p><strong>Primary Concern:</strong> ${protocol.primaryConcern}</p>
            <p><strong>Start Date:</strong> ${protocol.startDate}</p>
            <p><strong>Duration:</strong> ${protocol.duration}</p>
            <p><strong>Practitioner:</strong> ${practitionerName}</p>
          </div>
          
          ${renderItems(protocol.supplements, "🧬 Supplement Protocol")}
          ${renderItems(protocol.dietary, "🥗 Dietary Recommendations")}
          ${renderItems(protocol.lifestyle, "🏃 Lifestyle Modifications")}
          ${renderItems(protocol.sleep, "😴 Sleep Optimization")}
          ${renderItems(protocol.mindset, "🧠 Mindset & Stress Management")}
          
          ${protocol.generalNotes ? `
            <div class="notes">
              <h3>📝 General Notes</h3>
              <p>${protocol.generalNotes}</p>
            </div>
          ` : ""}
          
          ${protocol.contraindications ? `
            <div class="warning">
              <h3>⚠️ Important Considerations</h3>
              <p>${protocol.contraindications}</p>
            </div>
          ` : ""}
          
          <p style="margin-top: 40px; text-align: center; color: #9ca3af; font-size: 12px;">
            Follow-up in ${protocol.followUp} • Generated ${new Date().toLocaleDateString()} via AccrediPro Academy
          </p>
        </body>
      </html>
    `);
        printWindow.document.close();
        printWindow.print();
    };

    const renderCategoryEditor = (
        category: keyof Pick<ProtocolData, "supplements" | "dietary" | "lifestyle" | "sleep" | "mindset">,
        title: string,
        Icon: React.ElementType,
        placeholder: { name: string; dosage: string; timing: string }
    ) => (
        <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
                <Icon className="w-5 h-5 text-burgundy-600" />
                {title}
            </h2>

            {protocol[category].map((item, index) => (
                <div key={item.id} className="bg-gray-50 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                        {protocol[category].length > 1 && (
                            <button
                                onClick={() => removeItem(category, item.id)}
                                className="text-red-500 hover:text-red-700 p-1"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                        <div>
                            <Label className="text-xs">Name/Description</Label>
                            <Input
                                value={item.name}
                                onChange={(e) => updateItem(category, item.id, "name", e.target.value)}
                                placeholder={placeholder.name}
                            />
                        </div>
                        <div>
                            <Label className="text-xs">Dosage/Amount</Label>
                            <Input
                                value={item.dosage}
                                onChange={(e) => updateItem(category, item.id, "dosage", e.target.value)}
                                placeholder={placeholder.dosage}
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                        <div>
                            <Label className="text-xs">Timing</Label>
                            <Input
                                value={item.timing}
                                onChange={(e) => updateItem(category, item.id, "timing", e.target.value)}
                                placeholder={placeholder.timing}
                            />
                        </div>
                        <div>
                            <Label className="text-xs">Duration</Label>
                            <Input
                                value={item.duration}
                                onChange={(e) => updateItem(category, item.id, "duration", e.target.value)}
                                placeholder="e.g., 8 weeks"
                            />
                        </div>
                    </div>

                    <div>
                        <Label className="text-xs">Notes</Label>
                        <Input
                            value={item.notes}
                            onChange={(e) => updateItem(category, item.id, "notes", e.target.value)}
                            placeholder="Additional notes..."
                        />
                    </div>
                </div>
            ))}

            <Button
                variant="outline"
                onClick={() => addItem(category)}
                className="w-full border-dashed"
            >
                <Plus className="w-4 h-4 mr-2" />
                Add Another
            </Button>
        </div>
    );

    const currentStepId = STEPS[currentStep].id;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white rounded-xl p-6 mb-6">
                <h1 className="text-2xl font-bold">Protocol Builder</h1>
                <p className="text-burgundy-100 mt-1">Create personalized health protocols for your clients</p>

                {/* Progress */}
                <div className="flex items-center gap-1 mt-4">
                    {STEPS.map((step, index) => (
                        <div
                            key={step.id}
                            className={`flex-1 h-2 rounded-full ${index <= currentStep ? "bg-gold-400" : "bg-burgundy-800/50"
                                }`}
                        />
                    ))}
                </div>
                <div className="flex justify-between mt-2 text-sm text-burgundy-200">
                    <span>Step {currentStep + 1} of {STEPS.length}</span>
                    <span>{STEPS[currentStep].label}</span>
                </div>
            </div>

            {/* Step Navigation */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {STEPS.map((step, index) => (
                    <button
                        key={step.id}
                        onClick={() => setCurrentStep(index)}
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${currentStep === index
                                ? "bg-burgundy-600 text-white"
                                : index < currentStep
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-500"
                            }`}
                    >
                        {index < currentStep ? (
                            <CheckCircle2 className="w-4 h-4" />
                        ) : (
                            <step.icon className="w-4 h-4" />
                        )}
                        <span className="hidden md:inline">{step.label}</span>
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                {currentStepId === "client" && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <ClipboardList className="w-5 h-5 text-burgundy-600" />
                            Client Information
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="clientName">Client Name</Label>
                                <Input
                                    id="clientName"
                                    value={protocol.clientName}
                                    onChange={(e) => updateField("clientName", e.target.value)}
                                    placeholder="Jane Smith"
                                />
                            </div>
                            <div>
                                <Label htmlFor="startDate">Start Date</Label>
                                <Input
                                    id="startDate"
                                    type="date"
                                    value={protocol.startDate}
                                    onChange={(e) => updateField("startDate", e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <Label htmlFor="primaryConcern">Primary Health Concern</Label>
                            <Textarea
                                id="primaryConcern"
                                value={protocol.primaryConcern}
                                onChange={(e) => updateField("primaryConcern", e.target.value)}
                                placeholder="e.g., Gut dysbiosis, fatigue, hormonal imbalance..."
                                rows={2}
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="duration">Protocol Duration</Label>
                                <select
                                    id="duration"
                                    value={protocol.duration}
                                    onChange={(e) => updateField("duration", e.target.value)}
                                    className="w-full h-10 px-3 rounded-md border border-gray-300"
                                >
                                    <option value="4 weeks">4 weeks</option>
                                    <option value="8 weeks">8 weeks</option>
                                    <option value="12 weeks">12 weeks</option>
                                    <option value="16 weeks">16 weeks</option>
                                    <option value="6 months">6 months</option>
                                </select>
                            </div>
                            <div>
                                <Label htmlFor="followUp">Follow-up In</Label>
                                <select
                                    id="followUp"
                                    value={protocol.followUp}
                                    onChange={(e) => updateField("followUp", e.target.value)}
                                    className="w-full h-10 px-3 rounded-md border border-gray-300"
                                >
                                    <option value="2 weeks">2 weeks</option>
                                    <option value="4 weeks">4 weeks</option>
                                    <option value="6 weeks">6 weeks</option>
                                    <option value="8 weeks">8 weeks</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {currentStepId === "supplements" && renderCategoryEditor(
                    "supplements",
                    "Supplement Protocol",
                    Pill,
                    { name: "e.g., Vitamin D3", dosage: "e.g., 5000 IU", timing: "e.g., With breakfast" }
                )}

                {currentStepId === "dietary" && renderCategoryEditor(
                    "dietary",
                    "Dietary Recommendations",
                    Utensils,
                    { name: "e.g., Eliminate gluten", dosage: "100%", timing: "All meals" }
                )}

                {currentStepId === "lifestyle" && renderCategoryEditor(
                    "lifestyle",
                    "Lifestyle Modifications",
                    Activity,
                    { name: "e.g., Morning walk", dosage: "30 minutes", timing: "Before 9am" }
                )}

                {currentStepId === "sleep" && renderCategoryEditor(
                    "sleep",
                    "Sleep Optimization",
                    Moon,
                    { name: "e.g., Blue light blocking", dosage: "-", timing: "After 8pm" }
                )}

                {currentStepId === "mindset" && renderCategoryEditor(
                    "mindset",
                    "Mindset & Stress Management",
                    Brain,
                    { name: "e.g., Box breathing", dosage: "5 minutes", timing: "3x daily" }
                )}

                {currentStepId === "review" && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-600" />
                            Review Protocol
                        </h2>

                        <div className="bg-gray-50 rounded-lg p-4">
                            <h3 className="font-medium mb-2">Client: {protocol.clientName || "Not set"}</h3>
                            <p className="text-sm text-gray-600">
                                {protocol.primaryConcern || "No primary concern specified"}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">
                                Duration: {protocol.duration} • Follow-up: {protocol.followUp}
                            </p>
                        </div>

                        <div className="space-y-4">
                            <Label htmlFor="generalNotes">General Notes</Label>
                            <Textarea
                                id="generalNotes"
                                value={protocol.generalNotes}
                                onChange={(e) => updateField("generalNotes", e.target.value)}
                                placeholder="Any additional instructions or notes for the client..."
                                rows={3}
                            />
                        </div>

                        <div className="space-y-4">
                            <Label htmlFor="contraindications" className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-500" />
                                Contraindications & Warnings
                            </Label>
                            <Textarea
                                id="contraindications"
                                value={protocol.contraindications}
                                onChange={(e) => updateField("contraindications", e.target.value)}
                                placeholder="Any important warnings, contraindications, or cautions..."
                                rows={2}
                            />
                        </div>

                        {/* Summary */}
                        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
                            {[
                                { label: "Supplements", count: protocol.supplements.filter(i => i.name).length },
                                { label: "Dietary", count: protocol.dietary.filter(i => i.name).length },
                                { label: "Lifestyle", count: protocol.lifestyle.filter(i => i.name).length },
                                { label: "Sleep", count: protocol.sleep.filter(i => i.name).length },
                                { label: "Mindset", count: protocol.mindset.filter(i => i.name).length },
                            ].map(item => (
                                <div key={item.label} className="bg-burgundy-50 rounded-lg p-3 text-center">
                                    <div className="text-2xl font-bold text-burgundy-600">{item.count}</div>
                                    <div className="text-xs text-gray-500">{item.label}</div>
                                </div>
                            ))}
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
                            <Button onClick={handleSave} loading={isSaving}>
                                <Save className="w-4 h-4 mr-2" />
                                Save Protocol
                            </Button>
                        </>
                    ) : (
                        <Button onClick={() => setCurrentStep(prev => prev + 1)}>
                            Next
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ProtocolBuilder;
