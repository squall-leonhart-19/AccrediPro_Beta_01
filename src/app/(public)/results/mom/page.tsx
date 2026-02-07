"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PersonalizedSalesPage } from "@/components/results/personalized-sales-page";
import type { Persona, Intent, Specialization, PainPoint, DreamLife, Readiness, Timeline, IncomeGoal } from "@/data/dynamic-copy";

function ResultsContent() {
  const params = useSearchParams();

  const name = params.get("name") || "Friend";
  const email = params.get("email") || "";
  const persona = (params.get("role") || "stay-at-home-mom") as Persona;
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

  return (
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
  );
}

export default function MomResultsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ background: "#fdfbf7" }}><p className="text-gray-500">Loading your results...</p></div>}>
      <ResultsContent />
    </Suspense>
  );
}
