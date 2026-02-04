"use client";

import { useState } from "react";
import { Map, CheckCircle, Circle, Trophy, Target, Users, DollarSign } from "lucide-react";

const ROADMAP_PHASES = [
    {
        id: 1,
        title: "Week 1-2: Foundation",
        subtitle: "Set up your practice basics",
        color: "#d4af37",
        tasks: [
            { id: "1a", text: "Complete your certification training" },
            { id: "1b", text: "Define your niche and ideal client" },
            { id: "1c", text: "Create your service packages (3 tiers)" },
            { id: "1d", text: "Set up business basics (name, email)" },
        ],
    },
    {
        id: 2,
        title: "Week 3-4: Online Presence",
        subtitle: "Get visible to potential clients",
        color: "#722f37",
        tasks: [
            { id: "2a", text: "Create a simple landing page or website" },
            { id: "2b", text: "Set up professional social media profiles" },
            { id: "2c", text: "Write your bio and story hook" },
            { id: "2d", text: "Create 5 pieces of content about your niche" },
        ],
    },
    {
        id: 3,
        title: "Week 5-6: Lead Generation",
        subtitle: "Start attracting potential clients",
        color: "#2563eb",
        tasks: [
            { id: "3a", text: "Create a free lead magnet (checklist, guide)" },
            { id: "3b", text: "Set up email capture on your site" },
            { id: "3c", text: "Post daily on social media" },
            { id: "3d", text: "Join 2-3 Facebook groups in your niche" },
        ],
    },
    {
        id: 4,
        title: "Week 7-8: First Clients",
        subtitle: "Convert leads into paying clients",
        color: "#059669",
        tasks: [
            { id: "4a", text: "Offer 3 free discovery calls" },
            { id: "4b", text: "Practice your sales conversation" },
            { id: "4c", text: "Send your first proposal/package offer" },
            { id: "4d", text: "Close your first paying client! 🎉" },
        ],
    },
    {
        id: 5,
        title: "Week 9-12: Scale & Refine",
        subtitle: "Build momentum and systems",
        color: "#7c3aed",
        tasks: [
            { id: "5a", text: "Get your first testimonial" },
            { id: "5b", text: "Create a simple client onboarding process" },
            { id: "5c", text: "Set monthly income and client goals" },
            { id: "5d", text: "Celebrate your 90-day milestone! 🏆" },
        ],
    },
];

export default function RoadmapPage() {
    const [completedTasks, setCompletedTasks] = useState<string[]>([]);

    const toggleTask = (taskId: string) => {
        setCompletedTasks(prev =>
            prev.includes(taskId)
                ? prev.filter(id => id !== taskId)
                : [...prev, taskId]
        );
    };

    const totalTasks = ROADMAP_PHASES.reduce((sum, phase) => sum + phase.tasks.length, 0);
    const completedCount = completedTasks.length;
    const progressPercent = Math.round((completedCount / totalTasks) * 100);

    return (
        <div className="min-h-screen py-8 px-4 md:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#722f37]/10 text-[#722f37] text-sm font-medium mb-4">
                        <Map className="w-4 h-4" />
                        90-Day Launch Roadmap
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                        Your First 90 Days to Getting Clients
                    </h1>
                    <p className="text-gray-600">
                        Follow this step-by-step plan to launch your coaching practice
                    </p>
                </div>

                {/* Progress Overview */}
                <div className="bg-gradient-to-r from-[#722f37] to-[#4e1f24] rounded-2xl p-6 mb-8 text-white">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-white/60 text-sm">Your Progress</p>
                            <p className="text-3xl font-bold">{progressPercent}%</p>
                        </div>
                        <div className="text-right">
                            <p className="text-white/60 text-sm">Tasks Completed</p>
                            <p className="text-3xl font-bold text-[#d4af37]">{completedCount}/{totalTasks}</p>
                        </div>
                    </div>
                    <div className="h-3 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${progressPercent}%`,
                                background: "linear-gradient(90deg, #d4af37, #f7e7a0)",
                            }}
                        />
                    </div>
                </div>

                {/* Phases */}
                <div className="space-y-6">
                    {ROADMAP_PHASES.map((phase, index) => {
                        const phaseCompleted = phase.tasks.filter(t => completedTasks.includes(t.id)).length;
                        const phaseProgress = Math.round((phaseCompleted / phase.tasks.length) * 100);

                        return (
                            <div key={phase.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                                {/* Phase Header */}
                                <div
                                    className="p-4 md:p-6 flex items-center gap-4"
                                    style={{ borderLeft: `4px solid ${phase.color}` }}
                                >
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
                                        style={{ background: phase.color }}
                                    >
                                        {phaseProgress === 100 ? <CheckCircle className="w-5 h-5" /> : phase.id}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-gray-900">{phase.title}</h3>
                                        <p className="text-sm text-gray-500">{phase.subtitle}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold" style={{ color: phase.color }}>
                                            {phaseCompleted}/{phase.tasks.length}
                                        </p>
                                    </div>
                                </div>

                                {/* Tasks */}
                                <div className="px-4 md:px-6 pb-4 md:pb-6 space-y-2">
                                    {phase.tasks.map((task) => {
                                        const isCompleted = completedTasks.includes(task.id);
                                        return (
                                            <button
                                                key={task.id}
                                                onClick={() => toggleTask(task.id)}
                                                className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${isCompleted
                                                        ? "bg-emerald-50 border border-emerald-200"
                                                        : "bg-gray-50 border border-gray-200 hover:border-gray-300"
                                                    }`}
                                            >
                                                {isCompleted ? (
                                                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                                                ) : (
                                                    <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                                                )}
                                                <span className={isCompleted ? "text-emerald-700 line-through" : "text-gray-700"}>
                                                    {task.text}
                                                </span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Completion Message */}
                {progressPercent === 100 && (
                    <div className="mt-8 bg-gradient-to-br from-[#d4af37] to-[#b8860b] rounded-2xl p-8 text-center text-white">
                        <Trophy className="w-16 h-16 mx-auto mb-4" />
                        <h2 className="text-2xl font-bold mb-2">🎉 You Did It!</h2>
                        <p className="text-white/90">
                            You've completed your 90-day launch roadmap. You're officially a practicing health coach!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
