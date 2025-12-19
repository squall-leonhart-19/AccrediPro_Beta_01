"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, CheckCircle, Loader2, AlertCircle, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";

interface MiniDiplomaActionsProps {
  userId: string;
}

export function MiniDiplomaActions({ userId }: MiniDiplomaActionsProps) {
  const [isCompleting, setIsCompleting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  const handleCompleteAll = async () => {
    setIsCompleting(true);
    setMessage(null);

    try {
      const response = await fetch("/api/mini-diploma/complete-all", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: "All lessons completed! Triggering completion flow..." });
        // Now trigger the mini diploma complete API
        await fetch("/api/mini-diploma/complete", { method: "POST" });
        router.refresh();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to complete lessons" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "An error occurred" });
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <Card className="mb-6 border-2 border-amber-300 bg-gradient-to-r from-amber-50 to-yellow-50">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500 flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-slate-900">Test Mode</h3>
                <Badge className="bg-amber-200 text-amber-800 border-0 text-xs">DEV ONLY</Badge>
              </div>
              <p className="text-sm text-slate-600">All lessons unlocked for testing</p>
            </div>
          </div>

          <Button
            onClick={handleCompleteAll}
            disabled={isCompleting}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold shadow-lg"
          >
            {isCompleting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Completing...
              </>
            ) : (
              <>
                <Trophy className="w-4 h-4 mr-2" />
                Complete Certification
              </>
            )}
          </Button>
        </div>

        {message && (
          <div
            className={`mt-3 p-3 rounded-lg flex items-center gap-2 ${
              message.type === "success"
                ? "bg-emerald-100 text-emerald-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {message.type === "success" ? (
              <CheckCircle className="w-4 h-4" />
            ) : (
              <AlertCircle className="w-4 h-4" />
            )}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
