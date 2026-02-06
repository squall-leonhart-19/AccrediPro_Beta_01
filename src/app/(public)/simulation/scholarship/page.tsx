"use client";

import { useState } from "react";
import { getCouponTier, extractAmount, generateApprovalMessage, generateCallingMessage, CHECKOUT_URL, formatCurrency, BASE_PRICE } from "@/config/scholarship-autopilot";

// Brand colors
const B = {
    burgundy: "#722f37",
    gold: "#d4af37",
};

// Test presets
const PRESETS = [
    { label: "Low Offer ($100)", message: "I can afford $100" },
    { label: "Mid Offer ($500)", message: "My budget is $500" },
    { label: "High Offer ($800)", message: "I can invest $800" },
    { label: "Premium ($1500)", message: "I have $1500 to invest" },
    { label: "Below Floor ($25)", message: "I only have $25" },
    { label: "Full Price ($2000)", message: "$2000" },
    { label: "Natural Language", message: "I think I could do maybe 350 dollars" },
    { label: "Hesitant", message: "I'm not sure... maybe 200?" },
];

export default function ScholarshipSimulationPage() {
    const [testMessage, setTestMessage] = useState("I can afford $500");
    const [firstName, setFirstName] = useState("Jessica");
    const [result, setResult] = useState<{
        detected: number | null;
        tier: ReturnType<typeof getCouponTier> | null;
        calling: string | null;
        approval: string | null;
    } | null>(null);

    const runSimulation = () => {
        const detected = extractAmount(testMessage);
        if (!detected) {
            setResult({ detected: null, tier: null, calling: null, approval: null });
            return;
        }

        const tier = getCouponTier(detected);
        const calling = generateCallingMessage();
        const approval = generateApprovalMessage(firstName, detected, tier);

        setResult({ detected, tier, calling, approval });
    };

    const applyPreset = (message: string) => {
        setTestMessage(message);
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold mb-2" style={{ color: B.burgundy }}>
                        🤖 Scholarship Autopilot Simulator
                    </h1>
                    <p className="text-gray-600">
                        Test the full autopilot system — enter any message and see the AI response
                    </p>
                </div>

                {/* Config */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border" style={{ borderColor: `${B.gold}30` }}>
                    <h2 className="font-bold text-lg mb-4" style={{ color: B.burgundy }}>Configuration</h2>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Prospect First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Checkout URL</label>
                            <input
                                type="text"
                                value={CHECKOUT_URL}
                                disabled
                                className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-500 text-sm"
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1">User Message (what they type)</label>
                        <textarea
                            value={testMessage}
                            onChange={(e) => setTestMessage(e.target.value)}
                            rows={2}
                            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
                            placeholder="I can afford $500"
                        />
                    </div>

                    {/* Presets */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Quick Presets</label>
                        <div className="flex flex-wrap gap-2">
                            {PRESETS.map((p) => (
                                <button
                                    key={p.label}
                                    onClick={() => applyPreset(p.message)}
                                    className="px-3 py-1.5 text-xs font-medium rounded-full border hover:bg-gray-100 transition-colors"
                                    style={{ borderColor: B.gold, color: B.burgundy }}
                                >
                                    {p.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={runSimulation}
                        className="w-full py-3 rounded-lg font-bold text-white transition-transform hover:scale-[1.02]"
                        style={{ background: B.burgundy }}
                    >
                        🚀 Run Simulation
                    </button>
                </div>

                {/* Results */}
                {result && (
                    <div className="space-y-4">
                        {/* Detection */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border" style={{ borderColor: `${B.gold}30` }}>
                            <h2 className="font-bold text-lg mb-4" style={{ color: B.burgundy }}>
                                1️⃣ Amount Detection
                            </h2>
                            {result.detected ? (
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl font-bold text-green-600">✅</span>
                                    <div>
                                        <p className="font-medium">Detected: <span className="text-xl font-bold" style={{ color: B.burgundy }}>{formatCurrency(result.detected)}</span></p>
                                        <p className="text-sm text-gray-500">From message: "{testMessage}"</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl">❌</span>
                                    <p className="text-gray-500">No amount detected in message</p>
                                </div>
                            )}
                        </div>

                        {/* Tier Calculation */}
                        {result.tier && (
                            <div className="bg-white rounded-xl shadow-lg p-6 border" style={{ borderColor: `${B.gold}30` }}>
                                <h2 className="font-bold text-lg mb-4" style={{ color: B.burgundy }}>
                                    2️⃣ Coupon Tier Calculation
                                </h2>
                                <div className="grid md:grid-cols-4 gap-4 text-center">
                                    <div className="p-4 rounded-lg bg-blue-50">
                                        <p className="text-xs text-blue-600 font-medium">THEY OFFERED</p>
                                        <p className="text-2xl font-bold text-blue-700">{formatCurrency(result.detected!)}</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-green-50">
                                        <p className="text-xs text-green-600 font-medium">DROP AMOUNT</p>
                                        <p className="text-2xl font-bold text-green-700">-{formatCurrency(result.tier.drop)}</p>
                                    </div>
                                    <div className="p-4 rounded-lg" style={{ background: `${B.burgundy}10` }}>
                                        <p className="text-xs font-medium" style={{ color: B.burgundy }}>THEY PAY</p>
                                        <p className="text-2xl font-bold" style={{ color: B.burgundy }}>{formatCurrency(result.tier.theyPay)}</p>
                                    </div>
                                    <div className="p-4 rounded-lg" style={{ background: `${B.gold}20` }}>
                                        <p className="text-xs font-medium" style={{ color: B.burgundy }}>THEY SAVE</p>
                                        <p className="text-2xl font-bold" style={{ color: B.gold }}>{formatCurrency(result.tier.savings)}</p>
                                    </div>
                                </div>
                                <div className="mt-4 p-3 rounded-lg bg-gray-50 text-center">
                                    <p className="text-sm text-gray-500">Coupon Code:</p>
                                    <p className="text-xl font-mono font-bold" style={{ color: B.burgundy }}>
                                        {result.tier.couponCode || "(No coupon - full price)"}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Calling Message */}
                        {result.calling && (
                            <div className="bg-white rounded-xl shadow-lg p-6 border" style={{ borderColor: `${B.gold}30` }}>
                                <h2 className="font-bold text-lg mb-4" style={{ color: B.burgundy }}>
                                    3️⃣ "Calling Institute" Message <span className="text-sm font-normal text-gray-500">(sent after 1s + 2s typing)</span>
                                </h2>
                                <div className="p-4 rounded-xl bg-gray-100 whitespace-pre-wrap text-sm">
                                    {result.calling}
                                </div>
                            </div>
                        )}

                        {/* Approval Message */}
                        {result.approval && (
                            <div className="bg-white rounded-xl shadow-lg p-6 border" style={{ borderColor: `${B.gold}30` }}>
                                <h2 className="font-bold text-lg mb-4" style={{ color: B.burgundy }}>
                                    4️⃣ Approval Message <span className="text-sm font-normal text-gray-500">(sent after 8-12s delay + 3.5s typing)</span>
                                </h2>
                                <div className="p-4 rounded-xl bg-gray-100 whitespace-pre-wrap text-sm">
                                    {result.approval}
                                </div>
                            </div>
                        )}

                        {/* Full JSON Context */}
                        <div className="bg-white rounded-xl shadow-lg p-6 border" style={{ borderColor: `${B.gold}30` }}>
                            <h2 className="font-bold text-lg mb-4" style={{ color: B.burgundy }}>
                                📋 Full Context (saved to admin panel)
                            </h2>
                            <pre className="p-4 rounded-lg bg-gray-900 text-green-400 text-xs overflow-x-auto">
                                {JSON.stringify({
                                    firstName,
                                    offeredAmount: result.detected,
                                    finalAmount: result.tier?.theyPay,
                                    drop: result.tier?.drop,
                                    couponCode: result.tier?.couponCode,
                                    savings: result.tier?.savings,
                                    checkoutUrl: CHECKOUT_URL,
                                    basePrice: BASE_PRICE,
                                }, null, 2)}
                            </pre>
                        </div>
                    </div>
                )}

                {/* Tier Reference Table */}
                <div className="bg-white rounded-xl shadow-lg p-6 mt-6 border" style={{ borderColor: `${B.gold}30` }}>
                    <h2 className="font-bold text-lg mb-4" style={{ color: B.burgundy }}>
                        📊 Drop Tier Reference
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b" style={{ borderColor: B.gold }}>
                                    <th className="py-2 text-left">They Say</th>
                                    <th className="py-2 text-center">Drop</th>
                                    <th className="py-2 text-center">They Pay</th>
                                    <th className="py-2 text-center">Coupon</th>
                                    <th className="py-2 text-right">Savings</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[500, 600, 700, 800, 900, 1000, 1200, 1500, 2000].map((amt) => {
                                    const tier = getCouponTier(amt)!;
                                    return (
                                        <tr key={amt} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-2">{formatCurrency(amt)}</td>
                                            <td className="py-2 text-center text-red-500">-{formatCurrency(tier.drop)}</td>
                                            <td className="py-2 text-center font-bold" style={{ color: B.burgundy }}>{formatCurrency(tier.theyPay)}</td>
                                            <td className="py-2 text-center font-mono text-xs">{tier.couponCode || "-"}</td>
                                            <td className="py-2 text-right text-green-600">{formatCurrency(tier.savings)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
