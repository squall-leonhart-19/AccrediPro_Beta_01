"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    User,
    Phone,
    Mail,
    Calendar,
    Heart,
    Activity,
    AlertCircle,
    FileText,
    Save,
    Download,
    CheckCircle2
} from "lucide-react";

interface IntakeFormData {
    // Personal Info
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    gender: string;

    // Health History
    chiefComplaint: string;
    currentMedications: string;
    supplements: string;
    allergies: string;
    previousDiagnoses: string;
    familyHistory: string;

    // Lifestyle
    diet: string;
    exercise: string;
    sleep: string;
    stress: string;

    // Goals
    healthGoals: string;
    expectations: string;
}

interface ClientIntakeFormProps {
    practitionerName?: string;
    practiceName?: string;
    onSave?: (data: IntakeFormData) => void;
    initialData?: Partial<IntakeFormData>;
}

const SECTIONS = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "health", label: "Health History", icon: Heart },
    { id: "lifestyle", label: "Lifestyle", icon: Activity },
    { id: "goals", label: "Goals", icon: FileText },
];

export function ClientIntakeForm({
    practitionerName = "Your Practitioner",
    practiceName = "Functional Medicine Practice",
    onSave,
    initialData = {},
}: ClientIntakeFormProps) {
    const [activeSection, setActiveSection] = useState("personal");
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const [formData, setFormData] = useState<IntakeFormData>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "",
        chiefComplaint: "",
        currentMedications: "",
        supplements: "",
        allergies: "",
        previousDiagnoses: "",
        familyHistory: "",
        diet: "",
        exercise: "",
        sleep: "",
        stress: "",
        healthGoals: "",
        expectations: "",
        ...initialData,
    });

    // Load saved data from localStorage
    useEffect(() => {
        const savedData = localStorage.getItem("client-intake-form");
        if (savedData) {
            try {
                setFormData(prev => ({ ...prev, ...JSON.parse(savedData) }));
            } catch (e) {
                console.error("Error loading saved form data:", e);
            }
        }
    }, []);

    // Auto-save to localStorage
    useEffect(() => {
        const timeout = setTimeout(() => {
            localStorage.setItem("client-intake-form", JSON.stringify(formData));
        }, 1000);
        return () => clearTimeout(timeout);
    }, [formData]);

    const updateField = (field: keyof IntakeFormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setSaved(false);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            if (onSave) {
                await onSave(formData);
            }
            localStorage.setItem("client-intake-form", JSON.stringify(formData));
            setSaved(true);
        } catch (e) {
            console.error("Error saving form:", e);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDownloadPDF = () => {
        // Generate printable version
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        printWindow.document.write(`
      <html>
        <head>
          <title>Client Intake Form - ${formData.firstName} ${formData.lastName}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { color: #7c2d12; border-bottom: 2px solid #7c2d12; padding-bottom: 10px; }
            h2 { color: #7c2d12; margin-top: 30px; }
            .field { margin: 15px 0; }
            .label { font-weight: 600; color: #374151; }
            .value { margin-top: 5px; padding: 10px; background: #f9fafb; border-radius: 6px; }
            .header { text-align: center; margin-bottom: 40px; }
            .practice { color: #6b7280; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Client Intake Form</h1>
            <p class="practice">${practiceName} • ${practitionerName}</p>
          </div>
          
          <h2>Personal Information</h2>
          <div class="field"><span class="label">Name:</span><div class="value">${formData.firstName} ${formData.lastName}</div></div>
          <div class="field"><span class="label">Email:</span><div class="value">${formData.email}</div></div>
          <div class="field"><span class="label">Phone:</span><div class="value">${formData.phone}</div></div>
          <div class="field"><span class="label">Date of Birth:</span><div class="value">${formData.dateOfBirth}</div></div>
          <div class="field"><span class="label">Gender:</span><div class="value">${formData.gender}</div></div>
          
          <h2>Health History</h2>
          <div class="field"><span class="label">Chief Complaint:</span><div class="value">${formData.chiefComplaint || "Not provided"}</div></div>
          <div class="field"><span class="label">Current Medications:</span><div class="value">${formData.currentMedications || "None"}</div></div>
          <div class="field"><span class="label">Supplements:</span><div class="value">${formData.supplements || "None"}</div></div>
          <div class="field"><span class="label">Allergies:</span><div class="value">${formData.allergies || "None known"}</div></div>
          <div class="field"><span class="label">Previous Diagnoses:</span><div class="value">${formData.previousDiagnoses || "None"}</div></div>
          <div class="field"><span class="label">Family History:</span><div class="value">${formData.familyHistory || "Not provided"}</div></div>
          
          <h2>Lifestyle</h2>
          <div class="field"><span class="label">Diet:</span><div class="value">${formData.diet || "Not provided"}</div></div>
          <div class="field"><span class="label">Exercise:</span><div class="value">${formData.exercise || "Not provided"}</div></div>
          <div class="field"><span class="label">Sleep:</span><div class="value">${formData.sleep || "Not provided"}</div></div>
          <div class="field"><span class="label">Stress:</span><div class="value">${formData.stress || "Not provided"}</div></div>
          
          <h2>Goals</h2>
          <div class="field"><span class="label">Health Goals:</span><div class="value">${formData.healthGoals || "Not provided"}</div></div>
          <div class="field"><span class="label">Expectations:</span><div class="value">${formData.expectations || "Not provided"}</div></div>
          
          <p style="margin-top: 40px; font-size: 12px; color: #9ca3af; text-align: center;">
            Generated on ${new Date().toLocaleDateString()} via AccrediPro Academy
          </p>
        </body>
      </html>
    `);
        printWindow.document.close();
        printWindow.print();
    };

    const completionPercentage = () => {
        const fields = Object.values(formData);
        const filled = fields.filter(v => v && v.trim().length > 0).length;
        return Math.round((filled / fields.length) * 100);
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 text-white rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Client Intake Form</h1>
                        <p className="text-burgundy-100 mt-1">{practiceName} • {practitionerName}</p>
                    </div>
                    <div className="text-right">
                        <div className="text-3xl font-bold">{completionPercentage()}%</div>
                        <div className="text-burgundy-200 text-sm">Complete</div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 bg-burgundy-800/50 rounded-full h-2">
                    <div
                        className="bg-gold-400 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${completionPercentage()}%` }}
                    />
                </div>
            </div>

            {/* Section Navigation */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {SECTIONS.map(section => (
                    <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${activeSection === section.id
                                ? "bg-burgundy-600 text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        <section.icon className="w-4 h-4" />
                        {section.label}
                    </button>
                ))}
            </div>

            {/* Form Content */}
            <div className="bg-white rounded-xl border border-gray-200 p-6">
                {/* Personal Info Section */}
                {activeSection === "personal" && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <User className="w-5 h-5 text-burgundy-600" />
                            Personal Information
                        </h2>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="firstName">First Name *</Label>
                                <Input
                                    id="firstName"
                                    value={formData.firstName}
                                    onChange={(e) => updateField("firstName", e.target.value)}
                                    placeholder="John"
                                />
                            </div>
                            <div>
                                <Label htmlFor="lastName">Last Name *</Label>
                                <Input
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={(e) => updateField("lastName", e.target.value)}
                                    placeholder="Smith"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="email">Email *</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        id="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => updateField("email", e.target.value)}
                                        placeholder="john@example.com"
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => updateField("phone", e.target.value)}
                                        placeholder="+1 (555) 000-0000"
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="dob">Date of Birth</Label>
                                <div className="relative">
                                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        id="dob"
                                        type="date"
                                        value={formData.dateOfBirth}
                                        onChange={(e) => updateField("dateOfBirth", e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="gender">Gender</Label>
                                <select
                                    id="gender"
                                    value={formData.gender}
                                    onChange={(e) => updateField("gender", e.target.value)}
                                    className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-burgundy-500"
                                >
                                    <option value="">Select...</option>
                                    <option value="female">Female</option>
                                    <option value="male">Male</option>
                                    <option value="non-binary">Non-binary</option>
                                    <option value="prefer-not-to-say">Prefer not to say</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Health History Section */}
                {activeSection === "health" && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Heart className="w-5 h-5 text-burgundy-600" />
                            Health History
                        </h2>

                        <div>
                            <Label htmlFor="chiefComplaint">
                                What is your primary health concern? *
                            </Label>
                            <Textarea
                                id="chiefComplaint"
                                value={formData.chiefComplaint}
                                onChange={(e) => updateField("chiefComplaint", e.target.value)}
                                placeholder="Describe your main health concern or reason for seeking help..."
                                rows={3}
                            />
                        </div>

                        <div>
                            <Label htmlFor="medications">
                                Current Medications
                            </Label>
                            <Textarea
                                id="medications"
                                value={formData.currentMedications}
                                onChange={(e) => updateField("currentMedications", e.target.value)}
                                placeholder="List any prescription or over-the-counter medications..."
                                rows={2}
                            />
                        </div>

                        <div>
                            <Label htmlFor="supplements">
                                Current Supplements
                            </Label>
                            <Textarea
                                id="supplements"
                                value={formData.supplements}
                                onChange={(e) => updateField("supplements", e.target.value)}
                                placeholder="List any vitamins, herbs, or supplements you take..."
                                rows={2}
                            />
                        </div>

                        <div>
                            <Label htmlFor="allergies" className="flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-amber-500" />
                                Allergies & Sensitivities
                            </Label>
                            <Textarea
                                id="allergies"
                                value={formData.allergies}
                                onChange={(e) => updateField("allergies", e.target.value)}
                                placeholder="List any known allergies (food, medications, environmental)..."
                                rows={2}
                            />
                        </div>

                        <div>
                            <Label htmlFor="diagnoses">Previous Diagnoses</Label>
                            <Textarea
                                id="diagnoses"
                                value={formData.previousDiagnoses}
                                onChange={(e) => updateField("previousDiagnoses", e.target.value)}
                                placeholder="List any medical conditions you've been diagnosed with..."
                                rows={2}
                            />
                        </div>

                        <div>
                            <Label htmlFor="familyHistory">Family Health History</Label>
                            <Textarea
                                id="familyHistory"
                                value={formData.familyHistory}
                                onChange={(e) => updateField("familyHistory", e.target.value)}
                                placeholder="Notable health conditions in your immediate family..."
                                rows={2}
                            />
                        </div>
                    </div>
                )}

                {/* Lifestyle Section */}
                {activeSection === "lifestyle" && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Activity className="w-5 h-5 text-burgundy-600" />
                            Lifestyle Factors
                        </h2>

                        <div>
                            <Label htmlFor="diet">Diet & Nutrition</Label>
                            <Textarea
                                id="diet"
                                value={formData.diet}
                                onChange={(e) => updateField("diet", e.target.value)}
                                placeholder="Describe your typical daily diet. Any restrictions or preferences?"
                                rows={3}
                            />
                        </div>

                        <div>
                            <Label htmlFor="exercise">Exercise & Movement</Label>
                            <Textarea
                                id="exercise"
                                value={formData.exercise}
                                onChange={(e) => updateField("exercise", e.target.value)}
                                placeholder="How often do you exercise? What types of activity?"
                                rows={2}
                            />
                        </div>

                        <div>
                            <Label htmlFor="sleep">Sleep Quality</Label>
                            <Textarea
                                id="sleep"
                                value={formData.sleep}
                                onChange={(e) => updateField("sleep", e.target.value)}
                                placeholder="How many hours do you sleep? Any issues falling or staying asleep?"
                                rows={2}
                            />
                        </div>

                        <div>
                            <Label htmlFor="stress">Stress & Mental Health</Label>
                            <Textarea
                                id="stress"
                                value={formData.stress}
                                onChange={(e) => updateField("stress", e.target.value)}
                                placeholder="How would you rate your stress levels? Any anxiety or mood concerns?"
                                rows={2}
                            />
                        </div>
                    </div>
                )}

                {/* Goals Section */}
                {activeSection === "goals" && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <FileText className="w-5 h-5 text-burgundy-600" />
                            Health Goals
                        </h2>

                        <div>
                            <Label htmlFor="healthGoals">What are your health goals?</Label>
                            <Textarea
                                id="healthGoals"
                                value={formData.healthGoals}
                                onChange={(e) => updateField("healthGoals", e.target.value)}
                                placeholder="What would you like to achieve through this process? Be specific..."
                                rows={4}
                            />
                        </div>

                        <div>
                            <Label htmlFor="expectations">What are your expectations?</Label>
                            <Textarea
                                id="expectations"
                                value={formData.expectations}
                                onChange={(e) => updateField("expectations", e.target.value)}
                                placeholder="What do you expect from working with a functional medicine practitioner?"
                                rows={3}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-6 p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    {saved ? (
                        <>
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                            <span>Changes saved</span>
                        </>
                    ) : (
                        <span>Auto-saving...</span>
                    )}
                </div>

                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={handleDownloadPDF}
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                    </Button>
                    <Button
                        onClick={handleSave}
                        loading={isSaving}
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Save Form
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default ClientIntakeForm;
