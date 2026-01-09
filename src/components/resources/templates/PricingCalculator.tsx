"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    DollarSign,
    Target,
    Calculator,
    TrendingUp,
    Users,
    Clock,
    CalendarDays,
    Download,
    Save,
    CheckCircle2,
    Sparkles,
    Info,
} from "lucide-react";

interface PricingData {
    // Income Goals
    annualIncomeGoal: number;
    workingWeeksPerYear: number;
    workingDaysPerWeek: number;
    hoursPerDay: number;

    // Service Offerings
    services: {
        id: string;
        name: string;
        price: number;
        duration: number; // in minutes
        sessionsPerClient: number;
    }[];

    // Business Expenses
    monthlyOverhead: number;
    taxRate: number;
}

interface PricingCalculatorProps {
    onSave?: (data: PricingData) => void;
    initialData?: Partial<PricingData>;
}

const DEFAULT_SERVICES = [
    { id: "1", name: "Initial Consultation", price: 250, duration: 90, sessionsPerClient: 1 },
    { id: "2", name: "Follow-up Session", price: 150, duration: 60, sessionsPerClient: 4 },
    { id: "3", name: "Monthly Coaching", price: 500, duration: 60, sessionsPerClient: 12 },
];

export function PricingCalculator({
    onSave,
    initialData = {},
}: PricingCalculatorProps) {
    const [saved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState<"goals" | "services" | "results">("goals");

    const [data, setData] = useState<PricingData>({
        annualIncomeGoal: 100000,
        workingWeeksPerYear: 48,
        workingDaysPerWeek: 5,
        hoursPerDay: 6,
        services: DEFAULT_SERVICES,
        monthlyOverhead: 1500,
        taxRate: 25,
        ...initialData,
    });

    // Load saved data
    useEffect(() => {
        const savedData = localStorage.getItem("pricing-calculator");
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
            localStorage.setItem("pricing-calculator", JSON.stringify(data));
        }, 1000);
        return () => clearTimeout(timeout);
    }, [data]);

    const updateField = <K extends keyof PricingData>(field: K, value: PricingData[K]) => {
        setData(prev => ({ ...prev, [field]: value }));
        setSaved(false);
    };

    const updateService = (id: string, field: keyof PricingData["services"][0], value: number | string) => {
        setData(prev => ({
            ...prev,
            services: prev.services.map(s =>
                s.id === id ? { ...s, [field]: value } : s
            ),
        }));
        setSaved(false);
    };

    const addService = () => {
        setData(prev => ({
            ...prev,
            services: [
                ...prev.services,
                {
                    id: Math.random().toString(36).substr(2, 9),
                    name: "New Service",
                    price: 100,
                    duration: 60,
                    sessionsPerClient: 1,
                },
            ],
        }));
    };

    const removeService = (id: string) => {
        setData(prev => ({
            ...prev,
            services: prev.services.filter(s => s.id !== id),
        }));
    };

    // Calculations
    const calculations = {
        // Time available
        totalWorkingHours: data.workingWeeksPerYear * data.workingDaysPerWeek * data.hoursPerDay,
        totalWorkingMinutes: data.workingWeeksPerYear * data.workingDaysPerWeek * data.hoursPerDay * 60,

        // Gross income needed (to cover expenses and taxes)
        yearlyOverhead: data.monthlyOverhead * 12,
        grossIncomeNeeded: (data.annualIncomeGoal + data.monthlyOverhead * 12) / (1 - data.taxRate / 100),

        // Per time period
        get monthlyTarget() {
            return this.grossIncomeNeeded / 12;
        },
        get weeklyTarget() {
            return this.grossIncomeNeeded / data.workingWeeksPerYear;
        },
        get dailyTarget() {
            return this.weeklyTarget / data.workingDaysPerWeek;
        },
        get hourlyRate() {
            return this.grossIncomeNeeded / this.totalWorkingHours;
        },

        // Service-based projections
        get averageServiceValue() {
            if (data.services.length === 0) return 0;
            const totalClientValue = data.services.reduce((sum, s) => sum + (s.price * s.sessionsPerClient), 0);
            return totalClientValue / data.services.length;
        },
        get clientsNeededYearly() {
            if (this.averageServiceValue === 0) return 0;
            return Math.ceil(this.grossIncomeNeeded / this.averageServiceValue);
        },
        get clientsNeededMonthly() {
            return Math.ceil(this.clientsNeededYearly / 12);
        },
    };

    const handleSave = async () => {
        if (onSave) {
            await onSave(data);
        }
        localStorage.setItem("pricing-calculator", JSON.stringify(data));
        setSaved(true);
    };

    const handleDownload = () => {
        const printWindow = window.open("", "_blank");
        if (!printWindow) return;

        printWindow.document.write(`
      <html>
        <head>
          <title>Pricing & Income Analysis</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            h1 { color: #7c2d12; border-bottom: 2px solid #7c2d12; padding-bottom: 10px; }
            h2 { color: #7c2d12; margin-top: 30px; }
            .card { background: #f9fafb; padding: 20px; border-radius: 8px; margin: 10px 0; }
            .big-number { font-size: 32px; font-weight: bold; color: #7c2d12; }
            .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; }
            table { width: 100%; border-collapse: collapse; margin-top: 15px; }
            th, td { border: 1px solid #e5e7eb; padding: 10px; text-align: left; }
            th { background: #f9fafb; }
          </style>
        </head>
        <body>
          <h1>💰 Pricing & Income Analysis</h1>
          
          <h2>Income Goals</h2>
          <div class="card">
            <p><strong>Annual Income Goal:</strong> $${data.annualIncomeGoal.toLocaleString()}</p>
            <p><strong>Working:</strong> ${data.workingWeeksPerYear} weeks × ${data.workingDaysPerWeek} days × ${data.hoursPerDay} hours</p>
            <p><strong>Monthly Overhead:</strong> $${data.monthlyOverhead.toLocaleString()}</p>
            <p><strong>Tax Rate:</strong> ${data.taxRate}%</p>
          </div>
          
          <h2>Required Revenue</h2>
          <div class="grid">
            <div class="card">
              <div>Yearly</div>
              <div class="big-number">$${Math.round(calculations.grossIncomeNeeded).toLocaleString()}</div>
            </div>
            <div class="card">
              <div>Monthly</div>
              <div class="big-number">$${Math.round(calculations.monthlyTarget).toLocaleString()}</div>
            </div>
            <div class="card">
              <div>Hourly Rate</div>
              <div class="big-number">$${Math.round(calculations.hourlyRate)}</div>
            </div>
          </div>
          
          <h2>Client Targets</h2>
          <div class="card">
            <p><strong>Average Client Value:</strong> $${Math.round(calculations.averageServiceValue).toLocaleString()}</p>
            <p><strong>Clients Needed (Yearly):</strong> ${calculations.clientsNeededYearly}</p>
            <p><strong>Clients Needed (Monthly):</strong> ${calculations.clientsNeededMonthly}</p>
          </div>
          
          <h2>Service Pricing</h2>
          <table>
            <thead>
              <tr><th>Service</th><th>Price</th><th>Duration</th><th>Sessions/Client</th></tr>
            </thead>
            <tbody>
              ${data.services.map(s => `
                <tr>
                  <td>${s.name}</td>
                  <td>$${s.price}</td>
                  <td>${s.duration} min</td>
                  <td>${s.sessionsPerClient}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          
          <p style="margin-top: 40px; text-align: center; color: #9ca3af; font-size: 12px;">
            Generated ${new Date().toLocaleDateString()} via AccrediPro Academy
          </p>
        </body>
      </html>
    `);
        printWindow.document.close();
        printWindow.print();
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white rounded-xl p-6 mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <Calculator className="w-7 h-7" />
                    Pricing Calculator
                </h1>
                <p className="text-emerald-100 mt-1">Calculate your ideal pricing based on income goals</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-6">
                {[
                    { id: "goals", label: "Income Goals", icon: Target },
                    { id: "services", label: "Services", icon: DollarSign },
                    { id: "results", label: "Results", icon: TrendingUp },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as "goals" | "services" | "results")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${activeTab === tab.id
                                ? "bg-emerald-600 text-white"
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
                {activeTab === "goals" && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Target className="w-5 h-5 text-emerald-600" />
                            Set Your Income Goals
                        </h2>

                        <div className="bg-emerald-50 rounded-lg p-4">
                            <Label htmlFor="annualGoal" className="text-sm font-medium">
                                Annual Income Goal (Take-Home)
                            </Label>
                            <div className="relative mt-2">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <Input
                                    id="annualGoal"
                                    type="number"
                                    value={data.annualIncomeGoal}
                                    onChange={(e) => updateField("annualIncomeGoal", Number(e.target.value))}
                                    className="pl-10 text-2xl font-bold h-14"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="weeks" className="flex items-center gap-1">
                                    <CalendarDays className="w-4 h-4" />
                                    Working Weeks/Year
                                </Label>
                                <Input
                                    id="weeks"
                                    type="number"
                                    value={data.workingWeeksPerYear}
                                    onChange={(e) => updateField("workingWeeksPerYear", Number(e.target.value))}
                                    min={1}
                                    max={52}
                                />
                                <p className="text-xs text-gray-500 mt-1">{52 - data.workingWeeksPerYear} weeks off</p>
                            </div>
                            <div>
                                <Label htmlFor="days" className="flex items-center gap-1">
                                    <Users className="w-4 h-4" />
                                    Days/Week
                                </Label>
                                <Input
                                    id="days"
                                    type="number"
                                    value={data.workingDaysPerWeek}
                                    onChange={(e) => updateField("workingDaysPerWeek", Number(e.target.value))}
                                    min={1}
                                    max={7}
                                />
                            </div>
                            <div>
                                <Label htmlFor="hours" className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    Hours/Day
                                </Label>
                                <Input
                                    id="hours"
                                    type="number"
                                    value={data.hoursPerDay}
                                    onChange={(e) => updateField("hoursPerDay", Number(e.target.value))}
                                    min={1}
                                    max={12}
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="overhead">Monthly Business Expenses</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        id="overhead"
                                        type="number"
                                        value={data.monthlyOverhead}
                                        onChange={(e) => updateField("monthlyOverhead", Number(e.target.value))}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="tax">Estimated Tax Rate (%)</Label>
                                <Input
                                    id="tax"
                                    type="number"
                                    value={data.taxRate}
                                    onChange={(e) => updateField("taxRate", Number(e.target.value))}
                                    min={0}
                                    max={50}
                                />
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === "services" && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <DollarSign className="w-5 h-5 text-emerald-600" />
                                Your Services
                            </h2>
                            <Button variant="outline" onClick={addService}>
                                + Add Service
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {data.services.map((service, index) => (
                                <div key={service.id} className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm font-medium text-gray-500">Service #{index + 1}</span>
                                        {data.services.length > 1 && (
                                            <button
                                                onClick={() => removeService(service.id)}
                                                className="text-red-500 text-sm hover:underline"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-3">
                                        <div>
                                            <Label className="text-xs">Service Name</Label>
                                            <Input
                                                value={service.name}
                                                onChange={(e) => updateService(service.id, "name", e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Price ($)</Label>
                                            <Input
                                                type="number"
                                                value={service.price}
                                                onChange={(e) => updateService(service.id, "price", Number(e.target.value))}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-3 mt-3">
                                        <div>
                                            <Label className="text-xs">Duration (minutes)</Label>
                                            <Input
                                                type="number"
                                                value={service.duration}
                                                onChange={(e) => updateService(service.id, "duration", Number(e.target.value))}
                                            />
                                        </div>
                                        <div>
                                            <Label className="text-xs">Sessions per Client</Label>
                                            <Input
                                                type="number"
                                                value={service.sessionsPerClient}
                                                onChange={(e) => updateService(service.id, "sessionsPerClient", Number(e.target.value))}
                                                min={1}
                                            />
                                        </div>
                                    </div>

                                    <div className="mt-3 pt-3 border-t border-gray-200 text-sm text-gray-600">
                                        Client value: <strong>${service.price * service.sessionsPerClient}</strong> total
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === "results" && (
                    <div className="space-y-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-emerald-600" />
                            Your Numbers
                        </h2>

                        {/* Big Numbers */}
                        <div className="grid md:grid-cols-3 gap-4">
                            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl p-5 text-center">
                                <div className="text-emerald-100 text-sm">Gross Revenue Needed</div>
                                <div className="text-3xl font-bold mt-1">
                                    ${Math.round(calculations.grossIncomeNeeded).toLocaleString()}
                                </div>
                                <div className="text-emerald-200 text-xs mt-1">per year</div>
                            </div>

                            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-5 text-center">
                                <div className="text-blue-100 text-sm">Minimum Hourly Rate</div>
                                <div className="text-3xl font-bold mt-1">
                                    ${Math.round(calculations.hourlyRate)}
                                </div>
                                <div className="text-blue-200 text-xs mt-1">per hour</div>
                            </div>

                            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-5 text-center">
                                <div className="text-purple-100 text-sm">Clients Needed</div>
                                <div className="text-3xl font-bold mt-1">
                                    {calculations.clientsNeededMonthly}
                                </div>
                                <div className="text-purple-200 text-xs mt-1">per month</div>
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div className="bg-gray-50 rounded-xl p-5">
                            <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-emerald-600" />
                                Revenue Targets Breakdown
                            </h3>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <div className="text-sm text-gray-500">Yearly</div>
                                    <div className="text-xl font-bold">${Math.round(calculations.grossIncomeNeeded).toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Monthly</div>
                                    <div className="text-xl font-bold">${Math.round(calculations.monthlyTarget).toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Weekly</div>
                                    <div className="text-xl font-bold">${Math.round(calculations.weeklyTarget).toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-500">Daily</div>
                                    <div className="text-xl font-bold">${Math.round(calculations.dailyTarget).toLocaleString()}</div>
                                </div>
                            </div>
                        </div>

                        {/* Info Box */}
                        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex gap-3">
                            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-amber-800">
                                <strong>How we calculated this:</strong> Your take-home goal of ${data.annualIncomeGoal.toLocaleString()}
                                + overhead of ${(data.monthlyOverhead * 12).toLocaleString()}/year, adjusted for {data.taxRate}% taxes,
                                across {calculations.totalWorkingHours.toLocaleString()} working hours.
                            </div>
                        </div>

                        {/* Client Math */}
                        <div className="bg-emerald-50 rounded-xl p-5">
                            <h3 className="font-semibold mb-3">📊 Client Math</h3>
                            <div className="space-y-2 text-sm">
                                <p>Based on your services, average client value: <strong>${Math.round(calculations.averageServiceValue).toLocaleString()}</strong></p>
                                <p>To hit ${Math.round(calculations.grossIncomeNeeded).toLocaleString()} yearly, you need:</p>
                                <ul className="list-disc list-inside ml-4 space-y-1">
                                    <li><strong>{calculations.clientsNeededYearly}</strong> clients per year</li>
                                    <li><strong>{calculations.clientsNeededMonthly}</strong> clients per month</li>
                                    <li><strong>{Math.ceil(calculations.clientsNeededYearly / data.workingWeeksPerYear)}</strong> clients per week</li>
                                </ul>
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
                    <Button variant="outline" onClick={handleDownload}>
                        <Download className="w-4 h-4 mr-2" />
                        Download Report
                    </Button>
                    <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
                        <Save className="w-4 h-4 mr-2" />
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default PricingCalculator;
