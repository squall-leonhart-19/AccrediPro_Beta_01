"use client";

import { useState } from "react";
import { DollarSign, Calculator, Users, Clock, TrendingUp } from "lucide-react";

export default function PricingToolPage() {
    const [incomeGoal, setIncomeGoal] = useState(8000);
    const [hoursPerWeek, setHoursPerWeek] = useState(20);
    const [consultPrice, setConsultPrice] = useState(150);
    const [packagePrice, setPackagePrice] = useState(997);

    // Calculations
    const monthlyFromConsults = Math.round((hoursPerWeek * 4 * consultPrice) / 1.5); // 1.5 hours per consult
    const packagesNeeded = Math.ceil(incomeGoal / packagePrice);
    const consultsNeeded = Math.ceil(incomeGoal / consultPrice);
    const effectiveHourlyRate = Math.round(incomeGoal / (hoursPerWeek * 4));

    return (
        <div className="min-h-screen py-8 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        💰 Client Pricing Tool
                    </h1>
                    <p className="text-gray-600">
                        Configure your services to hit your income goals
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Input Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <Calculator className="w-5 h-5 text-[#722f37]" />
                            Your Numbers
                        </h2>

                        {/* Monthly Income Goal */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Monthly Income Goal
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="number"
                                    value={incomeGoal}
                                    onChange={(e) => setIncomeGoal(Number(e.target.value))}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#d4af37] focus:ring-0 text-lg font-semibold"
                                />
                            </div>
                            <input
                                type="range"
                                min={2000}
                                max={20000}
                                step={500}
                                value={incomeGoal}
                                onChange={(e) => setIncomeGoal(Number(e.target.value))}
                                className="w-full mt-2 accent-[#d4af37]"
                            />
                        </div>

                        {/* Hours Per Week */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hours Per Week
                            </label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="number"
                                    value={hoursPerWeek}
                                    onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#d4af37] focus:ring-0 text-lg font-semibold"
                                />
                            </div>
                        </div>

                        {/* Consultation Price */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Initial Consultation Price
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="number"
                                    value={consultPrice}
                                    onChange={(e) => setConsultPrice(Number(e.target.value))}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#d4af37] focus:ring-0 text-lg font-semibold"
                                />
                            </div>
                        </div>

                        {/* Package Price */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                3-Month Package Price
                            </label>
                            <div className="relative">
                                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="number"
                                    value={packagePrice}
                                    onChange={(e) => setPackagePrice(Number(e.target.value))}
                                    className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#d4af37] focus:ring-0 text-lg font-semibold"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Results Section */}
                    <div className="space-y-4">
                        {/* Key Metrics */}
                        <div className="bg-gradient-to-br from-[#722f37] to-[#4e1f24] rounded-2xl p-6 text-white">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5" />
                                Your Numbers
                            </h2>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/10 rounded-xl p-4">
                                    <p className="text-white/60 text-sm">Effective Hourly Rate</p>
                                    <p className="text-2xl font-bold text-[#d4af37]">${effectiveHourlyRate}</p>
                                </div>
                                <div className="bg-white/10 rounded-xl p-4">
                                    <p className="text-white/60 text-sm">Max Monthly (Consults Only)</p>
                                    <p className="text-2xl font-bold text-[#d4af37]">${monthlyFromConsults.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Path to Goal */}
                        <div className="bg-white rounded-2xl shadow-lg p-6">
                            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Users className="w-5 h-5 text-[#722f37]" />
                                Path to ${incomeGoal.toLocaleString()}/month
                            </h3>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                                    <div>
                                        <p className="font-medium text-emerald-800">Package Path</p>
                                        <p className="text-sm text-emerald-600">Sell {packagesNeeded} packages @ ${packagePrice}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-emerald-700">{packagesNeeded}</p>
                                        <p className="text-xs text-emerald-500">clients/month</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-xl bg-blue-50 border border-blue-200">
                                    <div>
                                        <p className="font-medium text-blue-800">Consult Path</p>
                                        <p className="text-sm text-blue-600">Book {consultsNeeded} consults @ ${consultPrice}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-blue-700">{consultsNeeded}</p>
                                        <p className="text-xs text-blue-500">consults/month</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pro Tips */}
                        <div className="bg-[#d4af37]/10 rounded-xl p-4 border border-[#d4af37]/30">
                            <p className="font-medium text-[#722f37] mb-2">💡 Pro Tip</p>
                            <p className="text-sm text-gray-700">
                                Focus on packages over hourly. {packagesNeeded} package clients = ${incomeGoal.toLocaleString()}/month
                                vs. {consultsNeeded} individual consults. Way less work!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
