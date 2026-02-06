"use client";

import { useState } from "react";
import { ScholarshipChat } from "@/components/results/scholarship-chat";

/**
 * 🧪 TEST PAGE - Quick scholarship chat testing without quiz
 * URL: /test-chat
 * 
 * Simulates a completed quiz so you can test the chat flow directly
 */
export default function TestChatPage() {
    const [testName, setTestName] = useState("Marco");
    const [testGoal, setTestGoal] = useState("income_10k");
    const [testBudget, setTestBudget] = useState("500");
    const [isStarted, setIsStarted] = useState(false);

    // Fake quiz data for testing
    const fakeQuizData = {
        firstName: testName,
        email: "test@test.com",
        phoneNumber: "+1234567890",
        goal: testGoal,
        investmentBudget: testBudget,
        currentOccupation: "health_enthusiast",
        experienceLevel: "beginner",
        timelineGoal: "3_months",
        motivation: "career_change",
    };

    if (isStarted) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
                {/* Fake results header */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-4 text-center">
                    <p className="text-white text-sm">🧪 TEST MODE - Simulating quiz results for: <strong>{testName}</strong></p>
                    <button
                        onClick={() => setIsStarted(false)}
                        className="mt-2 text-xs text-white/80 underline hover:text-white"
                    >
                        ← Reset Test
                    </button>
                </div>

                {/* Scholarship Chat Component - uses correct props */}
                <div className="max-w-2xl mx-auto p-4">
                    <ScholarshipChat
                        firstName={testName}
                        lastName="Test"
                        email="test@test.com"
                        quizData={fakeQuizData}
                        page="healthcare-results"
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center p-8">
            <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl border border-gray-700">
                <h1 className="text-2xl font-bold text-white mb-2">🧪 Chat Test Mode</h1>
                <p className="text-gray-400 text-sm mb-6">
                    Skip the quiz! Test the scholarship chat directly.
                </p>

                {/* Test Name */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        First Name
                    </label>
                    <input
                        type="text"
                        value={testName}
                        onChange={(e) => setTestName(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Enter name..."
                    />
                </div>

                {/* Test Goal */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Goal (for personalization)
                    </label>
                    <select
                        value={testGoal}
                        onChange={(e) => setTestGoal(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                        <option value="income_5k">$5,000/month</option>
                        <option value="income_10k">$10,000/month</option>
                        <option value="income_20k">$20,000/month</option>
                        <option value="income_50k">$50,000+/month</option>
                    </select>
                </div>

                {/* Pre-stated Budget */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                        Pre-stated Budget (from quiz)
                    </label>
                    <input
                        type="text"
                        value={testBudget}
                        onChange={(e) => setTestBudget(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="500"
                    />
                    <p className="text-xs text-gray-500 mt-1">This shows in Sarah&apos;s message as a hint</p>
                </div>

                {/* Start Button */}
                <button
                    onClick={() => setIsStarted(true)}
                    className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-all transform hover:scale-[1.02] shadow-lg"
                >
                    🚀 Start Chat Test
                </button>

                <p className="text-center text-xs text-gray-500 mt-4">
                    URL: <code className="bg-gray-700 px-2 py-1 rounded">/test-chat</code>
                </p>
            </div>
        </div>
    );
}
