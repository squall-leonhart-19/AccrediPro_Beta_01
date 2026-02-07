"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PersonalizedSalesPage } from "@/components/results/personalized-sales-page";
import { ScholarshipChat } from "@/components/results/scholarship-chat";
import type { Persona, Intent, Specialization, PainPoint, DreamLife, Readiness, Timeline, IncomeGoal } from "@/data/dynamic-copy";

function ResultsContent() {
  const params = useSearchParams();

  const name = params.get("name") || "Friend";
  const email = params.get("email") || "";
  const persona = (params.get("role") || "health-coach") as Persona;
  const intent = (params.get("intent") || "business") as Intent;
  const specialization = (params.get("specialization") || "hormone-health") as Specialization;
  const painPoint = (params.get("painPoint") || "stuck") as PainPoint;
  const dreamLife = (params.get("dreamLife") || "complete-transformation") as DreamLife;
  const readiness = (params.get("readiness") || "nothing") as Readiness;
  const timeline = (params.get("timeline") || "immediately") as Timeline;
  const incomeGoal = (params.get("incomeGoal") || "5k-10k") as IncomeGoal;
  const currentIncome = params.get("currentIncome") || "";
  const background = params.get("background") || "";
  const motivation = params.get("motivation") || "";
  const lifeSituation = params.get("lifeSituation") || "";

  // Practitioner type for chat
  const practType = params.get("type") || "hormone-health";

  return (
    <>
      <PersonalizedSalesPage
        name={name}
        email={email}
        persona={persona}
        intent={intent}
        specialization={specialization}
        painPoint={painPoint}
        dreamLife={dreamLife}
        readiness={readiness}
        timeline={timeline}
        incomeGoal={incomeGoal}
        currentIncome={currentIncome}
        background={background}
        motivation={motivation}
        lifeSituation={lifeSituation}
      />

      {/* Chat closer — appears AFTER all persuasion sections */}
      <div style={{ background: "#fff" }} className="px-4 pt-6 pb-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <p className="text-sm uppercase tracking-wider font-semibold text-gray-400 mb-2">Still have questions?</p>
            <p className="text-xl font-bold" style={{ color: "#722f37" }}>
              Chat with Sarah — ASI Clinical Director
            </p>
            <p className="text-sm text-gray-500 mt-1">She&apos;s reviewed your assessment and can answer any questions about your certification path.</p>
          </div>
          <ScholarshipChat
            firstName={name}
            lastName=""
            email={email}
            quizData={{
              type: practType,
              role: persona,
              specialization: specialization,
              background: background,
              experience: "",
              motivation: motivation,
              painPoint: painPoint,
              timeline: timeline,
              incomeGoal: incomeGoal,
              timeStuck: "",
              currentIncome: currentIncome,
              dreamLife: dreamLife,
              commitment: intent,
            }}
            page="coach"
          />
        </div>
      </div>
    </>
  );
}

export default function CoachResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "#fdfbf7" }}><p className="text-gray-500">Loading your results...</p></div>}>
      <ResultsContent />
    </Suspense>
  );
}
