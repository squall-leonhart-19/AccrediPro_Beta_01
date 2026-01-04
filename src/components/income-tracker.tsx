"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    DollarSign,
    Plus,
    Trophy,
    TrendingUp,
    CheckCircle,
    Target
} from "lucide-react";
import { cn } from "@/lib/utils";

interface IncomeMilestone {
    id: string;
    milestone: string;
    amount: number;
    targetAmount: number;
    reachedAt?: Date;
    celebrated?: boolean;
}

interface IncomeLog {
    id: string;
    amount: number;
    source?: string;
    clientName?: string;
    loggedAt: Date;
}

interface IncomeTrackerProps {
    totalIncome: number;
    monthlyIncome: number;
    milestones: IncomeMilestone[];
    recentLogs?: IncomeLog[];
    onLogIncome?: (amount: number, source?: string, clientName?: string) => void;
    className?: string;
}

// Milestone display config
const MILESTONE_CONFIG: Record<string, { label: string; icon: string; nextLabel: string }> = {
    first_500: { label: "First $500", icon: "🎯", nextLabel: "$500" },
    first_1000: { label: "First $1,000", icon: "🚀", nextLabel: "$1K" },
    first_5000: { label: "First $5,000", icon: "💎", nextLabel: "$5K" },
    first_10000: { label: "First $10,000", icon: "👑", nextLabel: "$10K" },
};

const MILESTONE_AMOUNTS: Record<string, number> = {
    first_500: 500,
    first_1000: 1000,
    first_5000: 5000,
    first_10000: 10000,
};

export function IncomeTracker({
    totalIncome,
    monthlyIncome,
    milestones,
    recentLogs = [],
    onLogIncome,
    className,
}: IncomeTrackerProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [logAmount, setLogAmount] = useState("");
    const [logSource, setLogSource] = useState("");
    const [logClientName, setLogClientName] = useState("");

    // Find next milestone to reach
    const nextMilestone = milestones.find(m => !m.reachedAt);
    const nextMilestoneProgress = nextMilestone
        ? Math.min((totalIncome / nextMilestone.targetAmount) * 100, 100)
        : 100;

    // Count reached milestones
    const reachedCount = milestones.filter(m => m.reachedAt).length;

    const handleSubmit = () => {
        const amount = parseFloat(logAmount);
        if (amount > 0 && onLogIncome) {
            onLogIncome(amount, logSource || undefined, logClientName || undefined);
            setLogAmount("");
            setLogSource("");
            setLogClientName("");
            setIsDialogOpen(false);
        }
    };

    return (
        <Card className={cn("bg-gradient-to-br from-emerald-50 to-white border-emerald-100", className)}>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
                            <DollarSign className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <span className="text-emerald-800">Your Practice Income</span>
                        </div>
                    </CardTitle>
                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                                <Plus className="w-4 h-4 mr-1" />
                                Log Income
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Log Your Income 💰</DialogTitle>
                                <DialogDescription>
                                    Track your earnings from your practice. Every dollar counts!
                                </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 pt-4">
                                <div>
                                    <Label htmlFor="amount">Amount ($)</Label>
                                    <Input
                                        id="amount"
                                        type="number"
                                        placeholder="150"
                                        value={logAmount}
                                        onChange={(e) => setLogAmount(e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="source">Source (optional)</Label>
                                    <Input
                                        id="source"
                                        placeholder="Client session, package, course sold..."
                                        value={logSource}
                                        onChange={(e) => setLogSource(e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="client">Client Name (optional)</Label>
                                    <Input
                                        id="client"
                                        placeholder="Jane D."
                                        value={logClientName}
                                        onChange={(e) => setLogClientName(e.target.value)}
                                        className="mt-1"
                                    />
                                </div>
                                <Button
                                    onClick={handleSubmit}
                                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                                    disabled={!logAmount || parseFloat(logAmount) <= 0}
                                >
                                    Log Income
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Income Stats */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-lg p-3 border border-emerald-100">
                        <p className="text-xs text-gray-500">This Month</p>
                        <p className="text-xl font-bold text-emerald-700">
                            ${monthlyIncome.toLocaleString()}
                        </p>
                    </div>
                    <div className="bg-white rounded-lg p-3 border border-emerald-100">
                        <p className="text-xs text-gray-500">All Time</p>
                        <p className="text-xl font-bold text-gray-700">
                            ${totalIncome.toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Next Milestone */}
                {nextMilestone && (
                    <div className="bg-white rounded-lg p-3 border border-emerald-100">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <Target className="w-4 h-4 text-emerald-500" />
                                <span className="text-sm font-medium text-gray-700">
                                    Next: {MILESTONE_CONFIG[nextMilestone.milestone]?.label || nextMilestone.milestone}
                                </span>
                            </div>
                            <span className="text-xs text-gray-500">
                                ${totalIncome} / ${nextMilestone.targetAmount}
                            </span>
                        </div>
                        <Progress value={nextMilestoneProgress} className="h-2" />
                    </div>
                )}

                {/* Milestones */}
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-gold-500" />
                        Milestones ({reachedCount}/{milestones.length})
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                        {milestones.map((m) => {
                            const config = MILESTONE_CONFIG[m.milestone];
                            const isReached = !!m.reachedAt;

                            return (
                                <div
                                    key={m.id}
                                    className={cn(
                                        "flex items-center gap-2 p-2 rounded-lg text-sm",
                                        isReached
                                            ? "bg-emerald-100 text-emerald-700"
                                            : "bg-gray-50 text-gray-400"
                                    )}
                                >
                                    {isReached ? (
                                        <CheckCircle className="w-4 h-4" />
                                    ) : (
                                        <div className="w-4 h-4 rounded-full border-2 border-current" />
                                    )}
                                    <span>{config?.label || m.milestone}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

// Compact version for dashboard
export function IncomeTrackerCompact({ totalIncome, monthlyIncome, milestones, className }: IncomeTrackerProps) {
    const reachedCount = milestones.filter(m => m.reachedAt).length;
    const nextMilestone = milestones.find(m => !m.reachedAt);
    const progress = nextMilestone
        ? Math.min((totalIncome / nextMilestone.targetAmount) * 100, 100)
        : 100;

    return (
        <Card className={cn("bg-gradient-to-br from-emerald-500 to-emerald-600 border-0 text-white", className)}>
            <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                    <DollarSign className="w-5 h-5" />
                    <span className="font-semibold">Practice Income</span>
                </div>

                <p className="text-2xl font-bold mb-1">${monthlyIncome.toLocaleString()}</p>
                <p className="text-xs text-white/70 mb-3">this month</p>

                {nextMilestone && (
                    <div>
                        <div className="flex justify-between text-xs mb-1">
                            <span>Next: {MILESTONE_CONFIG[nextMilestone.milestone]?.nextLabel}</span>
                            <span>{Math.round(progress)}%</span>
                        </div>
                        <Progress value={progress} className="h-1.5 bg-white/20" />
                    </div>
                )}

                <div className="flex items-center gap-1 mt-3 text-xs text-white/80">
                    <Trophy className="w-3 h-3" />
                    <span>{reachedCount} milestones reached</span>
                </div>
            </CardContent>
        </Card>
    );
}
