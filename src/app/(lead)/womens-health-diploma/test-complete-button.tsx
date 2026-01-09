"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Zap, RotateCcw } from "lucide-react";

/**
 * Test buttons component - only for test user at.seed019@gmail.com
 * Complete All: Marks all 9 lessons as complete
 * Reset All: Clears all progress to start fresh
 */
export function TestCompleteAllButton() {
    const [loadingComplete, setLoadingComplete] = useState(false);
    const [loadingReset, setLoadingReset] = useState(false);
    const router = useRouter();

    const handleCompleteAll = async () => {
        setLoadingComplete(true);
        try {
            const response = await fetch("/api/mini-diploma/complete-all", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ course: "womens-health" }),
            });

            const data = await response.json();

            if (data.success) {
                router.push("/womens-health-diploma/complete");
            } else {
                alert(data.error || "Failed to complete");
                setLoadingComplete(false);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to complete all lessons");
            setLoadingComplete(false);
        }
    };

    const handleResetAll = async () => {
        if (!confirm("Reset all progress? This will clear all lesson completions.")) {
            return;
        }

        setLoadingReset(true);
        try {
            const response = await fetch("/api/mini-diploma/reset-progress", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ course: "womens-health" }),
            });

            const data = await response.json();

            if (data.success) {
                router.refresh();
            } else {
                alert(data.error || "Failed to reset");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to reset progress");
        } finally {
            setLoadingReset(false);
        }
    };

    return (
        <Card className="mt-6 border-2 border-dashed border-amber-400 bg-amber-50">
            <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <p className="font-semibold text-amber-800 flex items-center gap-2">
                            <Zap className="w-4 h-4" />
                            Test Mode (AT)
                        </p>
                        <p className="text-sm text-amber-600">
                            Complete or reset all lessons for testing
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            onClick={handleResetAll}
                            disabled={loadingReset || loadingComplete}
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                        >
                            {loadingReset ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <>
                                    <RotateCcw className="w-4 h-4 mr-1" />
                                    Reset
                                </>
                            )}
                        </Button>
                        <Button
                            onClick={handleCompleteAll}
                            disabled={loadingComplete || loadingReset}
                            className="bg-amber-500 hover:bg-amber-600 text-white"
                        >
                            {loadingComplete ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                "Complete All"
                            )}
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
