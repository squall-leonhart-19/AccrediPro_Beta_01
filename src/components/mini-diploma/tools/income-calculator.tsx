"use client";

import { useState } from "react";
import { DollarSign, TrendingUp, Clock, Users, Calculator } from "lucide-react";
import Link from "next/link";

interface IncomeCalculatorProps {
    portalSlug: string;
}

// Premium ASI Color Palette
const GOLD_GRADIENT = "linear-gradient(135deg, #D4AF37 0%, #F7E7A0 25%, #D4AF37 50%, #B8860B 75%, #D4AF37 100%)";

export function IncomeCalculator({ portalSlug }: IncomeCalculatorProps) {
    const [hoursPerWeek, setHoursPerWeek] = useState(10);
    const [sessionsPerWeek, setSessionsPerWeek] = useState(5);
    const [ratePerSession, setRatePerSession] = useState(125);

    // Calculate income based on current values
    // Hours affects how many sessions you can realistically do
    // We use a factor based on hours: more hours = more potential sessions
    const hoursFactor = hoursPerWeek / 10; // Base is 10 hours
    const adjustedSessions = Math.round(sessionsPerWeek * hoursFactor);
    const weeklyIncome = adjustedSessions * ratePerSession;
    const monthlyIncome = weeklyIncome * 4;
    const yearlyIncome = monthlyIncome * 12;

    // Average certified practitioner makes ~$75K/year
    const avgYearly = 75000;
    const percentOfAvg = Math.min(100, Math.round((yearlyIncome / avgYearly) * 100));

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-amber-50 via-yellow-50 to-white py-8 px-4">
            {/* Wider container for desktop */}
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold mb-4"
                        style={{ background: GOLD_GRADIENT, color: '#5C1F2A' }}
                    >
                        <Calculator className="w-4 h-4" />
                        Interactive Tool
                    </div>
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">
                        💰 Your Income Potential
                    </h1>
                    <p className="text-lg text-gray-600">
                        See how much you could earn as a certified Functional Medicine Practitioner
                    </p>
                </div>

                {/* Calculator Card - Bigger */}
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-amber-300">
                    {/* Gold Metal Header */}
                    <div
                        className="p-8"
                        style={{ background: GOLD_GRADIENT }}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-white/30 backdrop-blur rounded-xl flex items-center justify-center shadow-inner">
                                <DollarSign className="w-8 h-8 text-amber-900" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-amber-900">Income Calculator</h2>
                                <p className="text-amber-800/80">Adjust the sliders to see your potential</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 space-y-8">
                        {/* Hours Per Week Slider */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="flex items-center gap-2 text-base font-medium text-gray-700">
                                    <Clock className="w-5 h-5 text-amber-600" />
                                    Hours dedicated per week
                                </label>
                                <span className="text-xl font-bold text-amber-700 tabular-nums">{hoursPerWeek} hrs</span>
                            </div>
                            <input
                                type="range"
                                min={5}
                                max={40}
                                value={hoursPerWeek}
                                onChange={(e) => setHoursPerWeek(parseInt(e.target.value, 10))}
                                className="w-full h-4 bg-gradient-to-r from-amber-200 to-amber-300 rounded-lg appearance-none cursor-pointer"
                                style={{ accentColor: '#D4AF37' }}
                            />
                            <div className="flex justify-between text-sm text-gray-400 mt-2">
                                <span>5 hrs (Side hustle)</span>
                                <span>40 hrs (Full-time)</span>
                            </div>
                        </div>

                        {/* Sessions Per Week Slider */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="flex items-center gap-2 text-base font-medium text-gray-700">
                                    <Users className="w-5 h-5 text-amber-600" />
                                    Base client sessions per week
                                </label>
                                <span className="text-xl font-bold text-amber-700 tabular-nums">{sessionsPerWeek} sessions</span>
                            </div>
                            <input
                                type="range"
                                min={1}
                                max={25}
                                value={sessionsPerWeek}
                                onChange={(e) => setSessionsPerWeek(parseInt(e.target.value, 10))}
                                className="w-full h-4 bg-gradient-to-r from-amber-200 to-amber-300 rounded-lg appearance-none cursor-pointer"
                                style={{ accentColor: '#D4AF37' }}
                            />
                            <div className="flex justify-between text-sm text-gray-400 mt-2">
                                <span>1 session</span>
                                <span>25 sessions</span>
                            </div>
                        </div>

                        {/* Rate Per Session Slider */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <label className="flex items-center gap-2 text-base font-medium text-gray-700">
                                    <DollarSign className="w-5 h-5 text-amber-600" />
                                    Rate per session
                                </label>
                                <span className="text-xl font-bold text-amber-700 tabular-nums">{formatCurrency(ratePerSession)}</span>
                            </div>
                            <input
                                type="range"
                                min={50}
                                max={300}
                                step={25}
                                value={ratePerSession}
                                onChange={(e) => setRatePerSession(parseInt(e.target.value, 10))}
                                className="w-full h-4 bg-gradient-to-r from-amber-200 to-amber-300 rounded-lg appearance-none cursor-pointer"
                                style={{ accentColor: '#D4AF37' }}
                            />
                            <div className="flex justify-between text-sm text-gray-400 mt-2">
                                <span>$50 (Starting)</span>
                                <span>$300 (Premium)</span>
                            </div>
                        </div>

                        {/* Adjusted Sessions Note */}
                        <div className="text-center text-sm text-gray-500 bg-amber-50 rounded-lg p-3 border border-amber-200">
                            With <strong>{hoursPerWeek} hours/week</strong>, you can realistically handle <strong className="text-amber-700">{adjustedSessions} sessions</strong>
                        </div>

                        {/* Results - Gold Metal Style - Bigger */}
                        <div
                            className="rounded-2xl p-8 border-2 border-amber-400 shadow-lg"
                            style={{ background: 'linear-gradient(135deg, #FEF9E7 0%, #FFF8DC 50%, #FEF9E7 100%)' }}
                        >
                            <div className="grid grid-cols-3 gap-6 mb-6">
                                <div className="text-center">
                                    <p className="text-sm text-amber-700 uppercase tracking-wide font-medium mb-1">Weekly</p>
                                    <p className="text-2xl font-bold text-gray-900 tabular-nums">{formatCurrency(weeklyIncome)}</p>
                                </div>
                                <div className="text-center border-x-2 border-amber-300 px-4">
                                    <p className="text-sm text-amber-700 uppercase tracking-wide font-medium mb-1">Monthly</p>
                                    <p
                                        className="text-4xl font-bold tabular-nums"
                                        style={{
                                            background: GOLD_GRADIENT,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                        }}
                                    >
                                        {formatCurrency(monthlyIncome)}
                                    </p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-amber-700 uppercase tracking-wide font-medium mb-1">Yearly</p>
                                    <p className="text-2xl font-bold text-gray-900 tabular-nums">{formatCurrency(yearlyIncome)}</p>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-6">
                                <div className="flex items-center justify-between text-base mb-2">
                                    <span className="text-gray-600">Compared to avg. certified practitioner</span>
                                    <span
                                        className="font-bold text-lg"
                                        style={{
                                            background: GOLD_GRADIENT,
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                        }}
                                    >
                                        {percentOfAvg}%
                                    </span>
                                </div>
                                <div className="h-5 bg-amber-100 rounded-full overflow-hidden border border-amber-300">
                                    <div
                                        className="h-full transition-all duration-300 rounded-full"
                                        style={{
                                            width: `${percentOfAvg}%`,
                                            background: GOLD_GRADIENT,
                                        }}
                                    />
                                </div>
                                <p className="text-sm text-gray-500 mt-2 text-center">
                                    Average certified FM practitioner earns ~$75,000/year
                                </p>
                            </div>
                        </div>

                        {/* Insight Box - Gold Themed - Bigger */}
                        <div
                            className="rounded-xl p-6 border-2 border-amber-300"
                            style={{ background: 'linear-gradient(135deg, #FFF8DC 0%, #FFFACD 100%)' }}
                        >
                            <div className="flex items-start gap-4">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ background: GOLD_GRADIENT }}
                                >
                                    <TrendingUp className="w-5 h-5 text-amber-900" />
                                </div>
                                <div>
                                    <p className="text-base font-bold text-amber-900">With ASI certification you can:</p>
                                    <ul className="text-base text-amber-800 mt-2 space-y-1">
                                        <li>• Charge premium rates ($200-$500/session)</li>
                                        <li>• Attract higher-quality clients</li>
                                        <li>• Build a recognized, credible practice</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Back Link */}
                <div className="mt-8 text-center">
                    <Link
                        href={`/portal/${portalSlug}/lesson/3`}
                        className="text-base text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        ← Back to Lesson 3
                    </Link>
                </div>
            </div>
        </div>
    );
}
