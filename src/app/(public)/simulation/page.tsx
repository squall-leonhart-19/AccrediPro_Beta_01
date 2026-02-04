"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, Sparkles, Copy, Check, ExternalLink } from "lucide-react";

const B = {
  burgundy: "#722f37",
  burgundyDark: "#4e1f24",
  gold: "#d4af37",
  goldLight: "#f7e7a0",
  cream: "#fdfbf7",
  goldMetallic: "linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)",
};

// ─── All quiz options ────────────────────────────────────────────
const PRESETS: Record<string, {
  label: string;
  description: string;
  params: Record<string, string>;
}> = {
  "burned-nurse": {
    label: "🔥 Burned-Out Nurse ($0 → $10K)",
    description: "ER nurse, zero wellness income, burned by past certs, wants to leave her job, confident clinically, starting this week",
    params: {
      name: "Jessica", lastName: "Williams", email: "jessica@example.com",
      type: "hormone-health", goal: "10k", role: "healthcare-pro",
      currentIncome: "0", experience: "no-experience", clinicalReady: "somewhat",
      labInterest: "want-to-learn", pastCerts: "spent-5k-plus", missingSkill: "framework",
      commitment: "absolutely", vision: "leave-job", startTimeline: "this-week",
    },
  },
  "experienced-pa": {
    label: "💪 Experienced PA ($5K+ → $20K)",
    description: "Physician Assistant with active clients, over $5K income, very confident clinically, already doing labs, wants all-above",
    params: {
      name: "Maria", lastName: "Gonzalez", email: "maria@example.com",
      type: "gut-restoration", goal: "20k", role: "healthcare-pro",
      currentIncome: "over-5k", experience: "active-clients", clinicalReady: "very-confident",
      labInterest: "already-doing", pastCerts: "some-value", missingSkill: "client-system",
      commitment: "absolutely", vision: "all-above", startTimeline: "2-weeks",
    },
  },
  "fresh-start-nurse": {
    label: "🌱 Fresh Start Nurse ($0 → $5K)",
    description: "Brand new to wellness, under $2K income, no experience, not very clinical, first certification, needs confidence",
    params: {
      name: "Tamara", lastName: "Johnson", email: "tamara@example.com",
      type: "burnout-recovery", goal: "5k", role: "healthcare-pro",
      currentIncome: "under-2k", experience: "no-experience", clinicalReady: "not-very",
      labInterest: "want-to-learn", pastCerts: "first-time", missingSkill: "confidence",
      commitment: "yes-work", vision: "security", startTimeline: "1-month",
    },
  },
  "burned-multiple": {
    label: "😤 Multiple Disappointed ($2K-5K → $10K)",
    description: "Has $2K-5K income, past clients, multiple disappointing certs, wants credibility, rearranging schedule, wants fulfillment",
    params: {
      name: "Patricia", lastName: "Chen", email: "patricia@example.com",
      type: "autoimmune-support", goal: "10k", role: "healthcare-pro",
      currentIncome: "2k-5k", experience: "past-clients", clinicalReady: "refer-out",
      labInterest: "open-to-it", pastCerts: "multiple-disappointed", missingSkill: "credibility",
      commitment: "rearrange", vision: "fulfillment", startTimeline: "2-weeks",
    },
  },
  "ambitious-metabolic": {
    label: "🚀 Ambitious Empire Builder ($5K+ → $50K+)",
    description: "Earns $5K+, active clients, very confident, already doing labs, wants to build an empire, starting this week",
    params: {
      name: "Rachel", lastName: "Kim", email: "rachel@example.com",
      type: "metabolic-optimization", goal: "50k-plus", role: "healthcare-pro",
      currentIncome: "over-5k", experience: "active-clients", clinicalReady: "very-confident",
      labInterest: "already-doing", pastCerts: "some-value", missingSkill: "client-system",
      commitment: "absolutely", vision: "all-above", startTimeline: "this-week",
    },
  },
  "cautious-informal": {
    label: "🤔 Cautious Informal Helper ($0 → $5K)",
    description: "Zero income, informal experience only, not very clinical, not sure about daily commitment, needs framework",
    params: {
      name: "Linda", lastName: "Davis", email: "linda@example.com",
      type: "hormone-health", goal: "5k", role: "healthcare-pro",
      currentIncome: "0", experience: "informal", clinicalReady: "not-very",
      labInterest: "open-to-it", pastCerts: "first-time", missingSkill: "framework",
      commitment: "not-sure", vision: "security", startTimeline: "1-month",
    },
  },
};

const QUIZ_FIELDS = [
  { key: "name", label: "First Name", options: null },
  { key: "lastName", label: "Last Name", options: null },
  { key: "email", label: "Email", options: null },
  { key: "role", label: "Q1: Current Role", options: [
    { value: "healthcare-pro", label: "Healthcare Professional" },
    { value: "health-coach", label: "Health Coach" },
    { value: "corporate", label: "Corporate Professional" },
    { value: "stay-at-home-mom", label: "Stay-at-Home Mom" },
    { value: "other-passionate", label: "Other Passionate" },
  ]},
  { key: "currentIncome", label: "Q2: Current Income", options: [
    { value: "0", label: "$0 - Haven't started" },
    { value: "under-2k", label: "Under $2,000/month" },
    { value: "2k-5k", label: "$2,000 - $5,000/month" },
    { value: "over-5k", label: "Over $5,000/month" },
  ]},
  { key: "goal", label: "Q3: Income Goal", options: [
    { value: "5k", label: "$5,000/month" },
    { value: "10k", label: "$10,000/month" },
    { value: "20k", label: "$20,000/month" },
    { value: "50k-plus", label: "$50,000+/month" },
  ]},
  { key: "experience", label: "Q4: Client Experience", options: [
    { value: "active-clients", label: "Active clients now" },
    { value: "past-clients", label: "Had clients, stopped" },
    { value: "informal", label: "Only informal" },
    { value: "no-experience", label: "No experience" },
  ]},
  { key: "clinicalReady", label: "Q5: Clinical Readiness", options: [
    { value: "very-confident", label: "Very confident" },
    { value: "somewhat", label: "Somewhat confident" },
    { value: "not-very", label: "Not very confident" },
    { value: "refer-out", label: "Would refer out" },
  ]},
  { key: "labInterest", label: "Q6: Lab Interest", options: [
    { value: "already-doing", label: "Already doing/learning" },
    { value: "want-to-learn", label: "Want to learn" },
    { value: "open-to-it", label: "Open to it" },
    { value: "not-sure", label: "Not sure" },
  ]},
  { key: "pastCerts", label: "Q7: Past Certifications", options: [
    { value: "multiple-disappointed", label: "Multiple, disappointed" },
    { value: "some-value", label: "Some value" },
    { value: "spent-5k-plus", label: "Spent $5K+, unprepared" },
    { value: "first-time", label: "First time" },
  ]},
  { key: "missingSkill", label: "Q8: Missing Skill", options: [
    { value: "framework", label: "Clinical framework" },
    { value: "confidence", label: "Confidence to charge" },
    { value: "client-system", label: "Client acquisition system" },
    { value: "credibility", label: "Credibility/credentials" },
  ]},
  { key: "commitment", label: "Q9: Commitment", options: [
    { value: "absolutely", label: "Absolutely, no-brainer" },
    { value: "yes-work", label: "Yes, I can make it work" },
    { value: "rearrange", label: "Need to rearrange" },
    { value: "not-sure", label: "Not sure about daily" },
  ]},
  { key: "vision", label: "Q10: Vision", options: [
    { value: "leave-job", label: "Leave my 9-to-5" },
    { value: "security", label: "Financial security" },
    { value: "fulfillment", label: "Fulfillment" },
    { value: "all-above", label: "All of the above" },
  ]},
  { key: "type", label: "Q11: Specialization", options: [
    { value: "hormone-health", label: "Hormone Health" },
    { value: "gut-restoration", label: "Gut Restoration" },
    { value: "metabolic-optimization", label: "Metabolic Optimization" },
    { value: "burnout-recovery", label: "Burnout Recovery" },
    { value: "autoimmune-support", label: "Autoimmune Support" },
  ]},
  { key: "startTimeline", label: "Q12: Start Timeline", options: [
    { value: "this-week", label: "This week (URGENT)" },
    { value: "2-weeks", label: "Within 2 weeks" },
    { value: "1-month", label: "Within a month" },
  ]},
];

// ─── Personalization summary ────────────────────────────────────
function getPersonalizationSummary(params: Record<string, string>): string[] {
  const items: string[] = [];

  // Hero subtitle
  const subtitleMap: Record<string, string> = {
    framework: "Framework-focused hero subtitle",
    confidence: "Confidence-focused hero subtitle",
    "client-system": "Client-system hero subtitle",
    credibility: "Credibility-focused hero subtitle",
  };
  items.push(`🎯 Hero: ${subtitleMap[params.missingSkill] || "Default"}`);

  // Sarah callout
  const incomeMap: Record<string, string> = {
    "0": "$0 income — clean slate messaging",
    "under-2k": "Under $2K — leaving money on table",
    "2k-5k": "$2K-5K — ceiling is low messaging",
    "over-5k": "$5K+ — scale with DEPTH messaging",
  };
  items.push(`💬 Sarah Callout: ${incomeMap[params.currentIncome] || "Default"}`);

  // Cost of inaction
  const INCOME_MONTHLY: Record<string, number> = { "0": 0, "under-2k": 1500, "2k-5k": 3500, "over-5k": 6000 };
  const GOAL_MONTHLY: Record<string, number> = { "5k": 5000, "10k": 10000, "20k": 20000, "50k-plus": 50000 };
  const gap = (GOAL_MONTHLY[params.goal] || 10000) - (INCOME_MONTHLY[params.currentIncome] || 0);
  items.push(`📉 Cost of Inaction: -$${(gap * 12).toLocaleString()}/year lost`);

  // Clinical edge
  const clinicalMap: Record<string, string> = {
    "very-confident": "Sharpen Your Clinical Edge",
    somewhat: "Turn Instinct Into Certainty",
    "not-very": "Bridge the Root-Cause Gap",
    "refer-out": "Become the Specialist They Refer TO",
  };
  items.push(`🩺 Clinical Edge: "${clinicalMap[params.clinicalReady] || "Default"}"`);

  // Lab callout
  items.push(`🧪 Lab Callout: ${params.labInterest === "already-doing" ? "Ahead of 95% callout" : params.labInterest === "want-to-learn" ? "Income multiplier callout" : "No callout"}`);

  // Past cert section
  if (["multiple-disappointed", "spent-5k-plus", "some-value"].includes(params.pastCerts)) {
    const pastMap: Record<string, string> = {
      "multiple-disappointed": "You've Been Burned Before section",
      "spent-5k-plus": "Spent $5K+ section + extra guarantee",
      "some-value": "Good Foundation — Ready for Clinical Grade",
    };
    items.push(`🔥 Past Certs: ${pastMap[params.pastCerts]}`);
  } else {
    items.push(`✅ Past Certs: Section hidden (first-time)`);
  }

  // Who this is NOT for - acceptance
  const commitMap: Record<string, string> = {
    absolutely: "Top tier commitment score",
    "yes-work": "Serious willingness recognized",
    rearrange: "Schedule rearrangement dedication",
    "not-sure": "Schedule rearrangement dedication",
  };
  items.push(`🚫 Who NOT For: ${commitMap[params.commitment] || "Default"}`);

  // Timeline
  const weekMap: Record<string, number> = { "active-clients": 3, "past-clients": 5, informal: 6, "no-experience": 7 };
  items.push(`⏱️ Timeline: ${weekMap[params.experience] || 6} weeks to certify`);

  // Sarah vision
  const visionMap: Record<string, string> = {
    "leave-job": "Leave the hospital message",
    security: "Financial security message",
    fulfillment: "Do medicine the right way",
    "all-above": "Complete transformation message",
  };
  items.push(`💌 Sarah's Message: ${visionMap[params.vision] || "Default"}`);

  // Urgency
  const urgencyMap: Record<string, string> = {
    "this-week": "🔴 URGENT: Burgundy bar, 3 spots, 20-min countdown",
    "2-weeks": "🟡 Standard: Gold bar, 5 spots, 30-min countdown",
    "1-month": "🟢 Relaxed: Gold bar, 7 spots, 30-min countdown",
  };
  items.push(`⚡ Urgency: ${urgencyMap[params.startTimeline] || "Standard"}`);

  // Objection crusher
  items.push(`💥 Objection Crusher: ${params.experience === "no-experience" ? "Inexperience framing" : "Busy framing"}`);

  // Bonus descriptions
  items.push(`🎁 Bonuses: ${params.vision === "leave-job" ? "Transition blueprint emphasis" : "Standard bonuses"}`);
  items.push(`👩‍💻 Client Accelerator: ${params.experience === "active-clients" ? "Upgrade existing clients" : params.experience === "no-experience" ? "ZERO to 5 clients" : "Standard launch sequence"}`);

  // Conditional FAQs
  const extraFaqs: string[] = [];
  if (params.pastCerts === "multiple-disappointed" || params.pastCerts === "spent-5k-plus") extraFaqs.push("wasted-money FAQ");
  if (params.experience === "no-experience") extraFaqs.push("no-experience FAQ");
  if (params.commitment === "not-sure" || params.commitment === "rearrange") extraFaqs.push("study-schedule FAQ");
  items.push(`❓ Extra FAQs: ${extraFaqs.length > 0 ? extraFaqs.join(", ") : "None (standard only)"}`);

  // Guarantee
  items.push(`🛡️ Guarantee: ${params.pastCerts === "multiple-disappointed" || params.pastCerts === "spent-5k-plus" ? "STRONGER burned-before language" : "Standard guarantee"}`);

  // Final CTA
  items.push(`🎯 Final CTA: ${visionMap[params.vision] || "Default"} + ${params.startTimeline === "this-week" ? "burgundy header" : "gold header"}`);

  // Pain points conditionals
  const painInserts: string[] = [];
  if (params.currentIncome === "0" || params.currentIncome === "under-2k") painInserts.push("nursing school frustration");
  if (params.clinicalReady === "refer-out" || params.clinicalReady === "not-very") painInserts.push("no framework yet");
  if (params.pastCerts === "spent-5k-plus") painInserts.push("$5K+ wasted");
  if (params.vision === "leave-job") painInserts.push("leave 9-to-5 hook");
  items.push(`😤 Pain Points: ${painInserts.length > 0 ? painInserts.join(" + ") : "Standard only"}`);

  return items;
}

export default function SimulationPage() {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [params, setParams] = useState<Record<string, string>>(PRESETS["burned-nurse"].params);
  const [copied, setCopied] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const resultUrl = `/results/healthcare?${new URLSearchParams(params).toString()}`;
  const fullUrl = typeof window !== "undefined" ? `${window.location.origin}${resultUrl}` : resultUrl;

  const selectPreset = (key: string) => {
    setSelectedPreset(key);
    setParams({ ...PRESETS[key].params });
  };

  const updateParam = (key: string, value: string) => {
    setParams(prev => ({ ...prev, [key]: value }));
    setSelectedPreset(null); // Clear preset since custom
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const summary = getPersonalizationSummary(params);

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(180deg, ${B.cream} 0%, #f0ece4 100%)` }}>
      <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-8">

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest" style={{ backgroundColor: `${B.burgundy}10`, color: B.burgundy }}>
            <Sparkles className="w-3.5 h-3.5" /> Simulation Dashboard
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold" style={{ color: B.burgundyDark }}>
            Healthcare Results — Personalization Simulator
          </h1>
          <p className="text-sm text-gray-500 max-w-xl mx-auto">
            Select a preset persona or customize every quiz answer. See exactly which personalization layers activate, then open the live page.
          </p>
        </div>

        {/* ═══ PRESETS ═══ */}
        <div className="space-y-3">
          <h2 className="text-lg font-bold" style={{ color: B.burgundyDark }}>Quick Presets</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(PRESETS).map(([key, preset]) => (
              <button key={key} onClick={() => selectPreset(key)}
                className={`p-4 rounded-xl border-2 text-left transition-all hover:shadow-md ${selectedPreset === key ? "shadow-lg" : ""}`}
                style={{
                  borderColor: selectedPreset === key ? B.gold : `${B.gold}30`,
                  background: selectedPreset === key ? `${B.gold}10` : "white",
                }}>
                <p className="font-bold text-sm" style={{ color: B.burgundy }}>{preset.label}</p>
                <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">{preset.description}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">

          {/* ═══ CUSTOM CONTROLS ═══ */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold" style={{ color: B.burgundyDark }}>Quiz Answers {!selectedPreset && <span className="text-xs font-normal text-gray-400">(custom)</span>}</h2>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {QUIZ_FIELDS.map((field) => (
                <div key={field.key} className="p-3 rounded-xl bg-white border shadow-sm" style={{ borderColor: `${B.gold}20` }}>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-1.5" style={{ color: B.burgundy }}>
                    {field.label}
                  </label>
                  {field.options ? (
                    <select
                      value={params[field.key] || ""}
                      onChange={(e) => updateParam(field.key, e.target.value)}
                      className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 bg-white"
                      style={{ borderColor: `${B.gold}40`, color: B.burgundyDark }}
                    >
                      {field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={params[field.key] || ""}
                      onChange={(e) => updateParam(field.key, e.target.value)}
                      className="w-full text-sm border rounded-lg px-3 py-2 focus:outline-none focus:ring-2"
                      style={{ borderColor: `${B.gold}40`, color: B.burgundyDark }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* ═══ PERSONALIZATION MAP ═══ */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold" style={{ color: B.burgundyDark }}>Personalization Map</h2>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: `${B.gold}15`, color: B.burgundy }}>
                {summary.length} active layers
              </span>
            </div>

            <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
              {summary.map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-white border shadow-sm text-xs sm:text-sm leading-relaxed" style={{ borderColor: `${B.gold}20` }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══ URL + LAUNCH ═══ */}
        <div className="p-5 sm:p-6 rounded-2xl border-2 shadow-lg space-y-4" style={{ borderColor: B.gold, background: `${B.gold}06` }}>
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold" style={{ color: B.burgundyDark }}>Generated URL</h2>
            <button onClick={copyUrl} className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all hover:shadow-sm" style={{ borderColor: `${B.gold}40`, color: B.burgundy }}>
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? "Copied!" : "Copy URL"}
            </button>
          </div>

          <div className="p-3 rounded-lg bg-white border overflow-x-auto" style={{ borderColor: `${B.gold}30` }}>
            <code className="text-[11px] text-gray-600 break-all whitespace-pre-wrap">{fullUrl}</code>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <a href={resultUrl} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button className="w-full h-14 text-base font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all" style={{ background: B.goldMetallic, color: B.burgundyDark }}>
                <Eye className="w-5 h-5 mr-2" /> Open Live Results Page
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </a>
            <a href={resultUrl} className="flex-1">
              <Button className="w-full h-14 text-base font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all" style={{ background: B.burgundy, color: "white" }}>
                <Eye className="w-5 h-5 mr-2" /> Open in Same Tab
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>

          <p className="text-center text-[11px] text-gray-400">
            Tip: Try switching presets to see how completely different the page content is for each persona.
          </p>
        </div>

        {/* ═══ ANSWER-TO-SECTION MAP ═══ */}
        <div className="space-y-4">
          <button onClick={() => setShowMap(!showMap)} className="flex items-center gap-2 text-sm font-bold" style={{ color: B.burgundy }}>
            {showMap ? "▼" : "▶"} Full Answer → Section Impact Map
          </button>

          {showMap && (
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr style={{ background: `${B.gold}15` }}>
                    <th className="p-2 text-left font-bold border" style={{ borderColor: `${B.gold}30`, color: B.burgundy }}>Quiz Answer</th>
                    <th className="p-2 text-left font-bold border" style={{ borderColor: `${B.gold}30`, color: B.burgundy }}>Sections Personalized</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { answer: "Q1: Role", sections: "Page routing (healthcare/coach/corporate/mom/career-change)" },
                    { answer: "Q2: Current Income", sections: "Sarah Callout, Cost of Inaction math, Before/After, Income Math, Pain Points, Objection Crusher" },
                    { answer: "Q3: Income Goal", sections: "Hero headline, Income Math, Cost of Inaction, Before/After, Final CTA stats, What Happens Next" },
                    { answer: "Q4: Experience", sections: "Timeline weeks (3-7), Client readiness text, Before/After, What Happens Next, Bonuses, Objection Crusher, Conditional FAQ" },
                    { answer: "Q5: Clinical Readiness", sections: "Clinical Edge section (4 full variants), Before/After row, Pain Points conditional" },
                    { answer: "Q6: Lab Interest", sections: "Clinical Edge callout (2 variants), Value Stack lab description" },
                    { answer: "Q7: Past Certs", sections: "Past Cert Recovery (conditional section, 3 variants), Pain Points, Guarantee language, Conditional FAQ" },
                    { answer: "Q8: Missing Skill", sections: "Hero subtitle (4 variants), Value Stack business description" },
                    { answer: "Q9: Commitment", sections: "Who NOT For acceptance (3 variants), What Happens Next, Objection Crusher, Conditional FAQ" },
                    { answer: "Q10: Vision", sections: "Sarah's Message (4 variants), Pain Points, Bonuses, Final CTA paragraph (4 variants)" },
                    { answer: "Q11: Specialization", sections: "Practitioner badge, Specialization preview, Modules list, Client types, Income Math group programs, Protocol description" },
                    { answer: "Q12: Start Timeline", sections: "Urgency bar color+text, Spots count (3/5/7), Countdown timer (20/30 min), Final CTA header color, What Happens Next" },
                  ].map((row, i) => (
                    <tr key={i} className={i % 2 === 0 ? "bg-white" : ""} style={{ background: i % 2 !== 0 ? `${B.gold}05` : undefined }}>
                      <td className="p-2 border font-medium whitespace-nowrap" style={{ borderColor: `${B.gold}20`, color: B.burgundy }}>{row.answer}</td>
                      <td className="p-2 border text-gray-600" style={{ borderColor: `${B.gold}20` }}>{row.sections}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-[10px] text-gray-400 pb-4">
          AccrediPro LMS — Personalization Simulator • For internal testing only
        </div>
      </div>
    </div>
  );
}
