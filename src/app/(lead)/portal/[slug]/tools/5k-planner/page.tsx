"use client";

import { useState } from "react";
import { TrendingUp, DollarSign, Target, Users, Calendar, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";

const GOLD_GRADIENT = "linear-gradient(135deg, #D4AF37 0%, #F7E7A0 25%, #D4AF37 50%, #B8860B 75%, #D4AF37 100%)";

const weeklyTasks = [
    {
        week: 1,
        focus: "Foundation",
        tasks: [
            "Define your ideal client avatar (age, struggles, goals)",
            "Create your signature package (3-6 sessions)",
            "Set your pricing using the Package Price Builder",
            "Write your transformation promise in one sentence",
        ],
    },
    {
        week: 2,
        focus: "Online Presence",
        tasks: [
            "Update LinkedIn/Instagram bio with coaching focus",
            "Post your first 'I help [X] with [Y]' content",
            "Create a simple booking link (Calendly/Acuity)",
            "Announce your new services to your network",
        ],
    },
    {
        week: 3,
        focus: "Outreach",
        tasks: [
            "Reach out to 10 people who might need help",
            "Offer 3 free discovery calls for testimonials",
            "Join 2 Facebook/LinkedIn groups in your niche",
            "Engage daily (comment on 5 posts in your niche)",
        ],
    },
    {
        week: 4,
        focus: "First Clients",
        tasks: [
            "Follow up with everyone you've connected with",
            "Send 5 DMs offering value (not selling)",
            "Book your first paid client 🎉",
            "Collect feedback and testimonial",
        ],
    },
];

export default function FirstFiveKPlannerPage({
    params: paramsPromise,
}: {
    params: Promise<{ slug: string }>;
}) {
    const [incomeGoal] = useState(5000);
    const [packagePrice, setPackagePrice] = useState(1500);
    const [completedTasks, setCompletedTasks] = useState<string[]>([]);

    const clientsNeeded = Math.ceil(incomeGoal / packagePrice);
    const clientsPerWeek = (clientsNeeded / 4).toFixed(1);
    const conversionRate = 0.25; // 25% conversion
    const callsNeeded = Math.ceil(clientsNeeded / conversionRate);
    const callsPerWeek = Math.ceil(callsNeeded / 4);

    const toggleTask = (taskId: string) => {
        setCompletedTasks(prev =>
            prev.includes(taskId)
                ? prev.filter(id => id !== taskId)
                : [...prev, taskId]
        );
    };

    const totalTasks = weeklyTasks.reduce((sum, week) => sum + week.tasks.length, 0);
    const progressPercent = Math.round((completedTasks.length / totalTasks) * 100);

    return (
        <div className="min-h-screen p-6" style={{ background: "linear-gradient(180deg, #1a0a0c 0%, #2d1518 100%)" }}>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="rounded-xl p-3" style={{ background: GOLD_GRADIENT }}>
                            <TrendingUp className="w-8 h-8" style={{ color: "#4e1f24" }} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">Your First $5K Month</h1>
                            <p className="text-white/60">Step-by-step planner to hit $5,000</p>
                        </div>
                    </div>
                </div>

                {/* Calculator Section */}
                <div className="p-6 rounded-xl mb-8" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Target className="w-5 h-5 text-amber-400" />
                        Your Numbers
                    </h2>

                    <div className="mb-6">
                        <label className="text-white/60 text-sm mb-2 block">Your Package Price</label>
                        <div className="relative max-w-xs">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                            <input
                                type="number"
                                value={packagePrice}
                                onChange={(e) => setPackagePrice(Number(e.target.value))}
                                className="w-full bg-black/30 border border-white/10 rounded-lg px-10 py-3 text-white text-xl"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 rounded-lg text-center" style={{ background: GOLD_GRADIENT }}>
                            <Users className="w-5 h-5 mx-auto mb-2" style={{ color: "#4e1f24" }} />
                            <p className="text-2xl font-bold" style={{ color: "#4e1f24" }}>{clientsNeeded}</p>
                            <p className="text-xs" style={{ color: "#4e1f24" }}>Clients Needed</p>
                        </div>
                        <div className="p-4 rounded-lg text-center bg-white/10">
                            <Calendar className="w-5 h-5 mx-auto mb-2 text-amber-400" />
                            <p className="text-2xl font-bold text-white">{clientsPerWeek}</p>
                            <p className="text-xs text-white/60">Per Week</p>
                        </div>
                        <div className="p-4 rounded-lg text-center bg-white/10">
                            <Target className="w-5 h-5 mx-auto mb-2 text-amber-400" />
                            <p className="text-2xl font-bold text-white">{callsNeeded}</p>
                            <p className="text-xs text-white/60">Discovery Calls</p>
                        </div>
                        <div className="p-4 rounded-lg text-center bg-white/10">
                            <TrendingUp className="w-5 h-5 mx-auto mb-2 text-green-400" />
                            <p className="text-2xl font-bold text-white">{callsPerWeek}/wk</p>
                            <p className="text-xs text-white/60">Calls Needed</p>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-white/60 text-sm">Your Progress</span>
                        <span className="text-amber-400 font-bold">{progressPercent}%</span>
                    </div>
                    <div className="h-3 bg-white/10 rounded-full overflow-hidden">
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{ width: `${progressPercent}%`, background: GOLD_GRADIENT }}
                        />
                    </div>
                    <p className="text-white/40 text-xs mt-1">{completedTasks.length} of {totalTasks} tasks completed</p>
                </div>

                {/* Weekly Tasks */}
                <div className="space-y-4">
                    {weeklyTasks.map((week) => (
                        <div
                            key={week.week}
                            className="rounded-xl overflow-hidden"
                            style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                        >
                            <div className="p-4 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold" style={{ background: GOLD_GRADIENT, color: "#4e1f24" }}>
                                        {week.week}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">Week {week.week}</h3>
                                        <p className="text-sm text-amber-400">{week.focus}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-4 space-y-2">
                                {week.tasks.map((task, taskIndex) => {
                                    const taskId = `${week.week}-${taskIndex}`;
                                    const isCompleted = completedTasks.includes(taskId);
                                    return (
                                        <button
                                            key={taskId}
                                            onClick={() => toggleTask(taskId)}
                                            className="w-full flex items-start gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors text-left"
                                        >
                                            {isCompleted ? (
                                                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                                            ) : (
                                                <Circle className="w-5 h-5 text-white/30 flex-shrink-0 mt-0.5" />
                                            )}
                                            <span className={`text-sm ${isCompleted ? "text-white/50 line-through" : "text-white/80"}`}>
                                                {task}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="mt-8 p-6 rounded-xl text-center" style={{ background: "rgba(212,175,55,0.1)", border: "1px solid rgba(212,175,55,0.3)" }}>
                    <h3 className="text-xl font-bold text-white mb-2">Ready to Make This Real?</h3>
                    <p className="text-white/60 mb-4">Get certified and start your $5K month journey</p>
                    <Link
                        href="#"
                        className="inline-block px-6 py-3 rounded-xl font-bold"
                        style={{ background: GOLD_GRADIENT, color: "#4e1f24" }}
                    >
                        Get Started Now
                    </Link>
                </div>
            </div>
        </div>
    );
}
