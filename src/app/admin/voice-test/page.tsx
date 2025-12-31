"use client";

import { useState } from "react";

interface VoiceVariation {
  id: string;
  name: string;
  settings: {
    stability: number;
    similarityBoost: number;
    style: number;
    speed: number;
  };
  description: string;
}

const VOICE_VARIATIONS: VoiceVariation[] = [
  {
    id: "slow-calm",
    name: "Slow & Calm",
    settings: { stability: 0.7, similarityBoost: 0.75, style: 0.15, speed: 0.75 },
    description: "Very slow, calm and reassuring tone",
  },
  {
    id: "natural-slow",
    name: "Natural Slow",
    settings: { stability: 0.65, similarityBoost: 0.75, style: 0.20, speed: 0.85 },
    description: "Natural pacing, slightly slower than normal (DEFAULT)",
  },
  {
    id: "warm-medium",
    name: "Warm Medium",
    settings: { stability: 0.60, similarityBoost: 0.80, style: 0.25, speed: 0.90 },
    description: "Warm and friendly, medium pace",
  },
  {
    id: "expressive-slow",
    name: "Expressive Slow",
    settings: { stability: 0.55, similarityBoost: 0.75, style: 0.35, speed: 0.80 },
    description: "More expressive/emotional, slow pace",
  },
  {
    id: "very-slow",
    name: "Very Slow",
    settings: { stability: 0.70, similarityBoost: 0.75, style: 0.15, speed: 0.70 },
    description: "Very slow and deliberate, maximum clarity",
  },
];

// Short personalized welcome (~17 seconds, ~230 chars)
// Double dash and period at end helps prevent the "sigh" sound
const SHORT_WELCOME = `Hey Jennifer! It's Sarah. I just saw you signed up and wanted to personally welcome you. I'm so excited you're here! Check your dashboard to get started, and message me anytime if you have questions - - Talk soon Jennifer!.`;

// Medium welcome (~25-30 seconds, ~450 chars)
const MEDIUM_WELCOME = `Hey Jennifer! It's Sarah here. I just saw your name come through and I'm so excited you're taking this step. Inside your dashboard, you'll find your Mini Diploma ready to start. I know you might have questions - maybe wondering if this is really for you. I get it. But here's what I know: you signed up for a reason. Message me anytime - I'm here for you every step of the way. Talk soon!`;

// Original long welcome
const LONG_WELCOME = `Hey there! I'm Sarah, and I'll be your coach throughout this journey.
I just saw your name come through and wanted to personally say welcome. This is the start of something special.
Inside your dashboard, you'll find your Mini Diploma ready to start, your Roadmap showing where you're headed, and you can message me anytime.
I know you might have questions. Maybe you're wondering if this is really for you. I get it, I felt the same way when I started.
But here's what I know: you signed up for a reason. Let's find out what that is together.
Hit reply anytime. I'm here for you, every step of the way. Talk soon!`;

const SCRIPT_OPTIONS = [
  { id: "short", name: "Short Welcome (~10s)", text: SHORT_WELCOME },
  { id: "medium", name: "Medium Welcome (~25s)", text: MEDIUM_WELCOME },
  { id: "long", name: "Long Welcome (~45s)", text: LONG_WELCOME },
];

const DEFAULT_TEXT = SHORT_WELCOME;

export default function VoiceTestPage() {
  const [text, setText] = useState(DEFAULT_TEXT);
  const [selectedScript, setSelectedScript] = useState("short");
  const [generating, setGenerating] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, { url: string; duration: number } | null>>({});
  const [error, setError] = useState("");

  const handleScriptChange = (scriptId: string) => {
    setSelectedScript(scriptId);
    const script = SCRIPT_OPTIONS.find(s => s.id === scriptId);
    if (script) setText(script.text);
  };

  const generateVoice = async (variation: VoiceVariation) => {
    setGenerating(variation.id);
    setError("");

    try {
      const res = await fetch("/api/admin/voice-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          settings: variation.settings,
        }),
      });

      const data = await res.json();

      if (data.success && data.audioUrl) {
        setResults((prev) => ({
          ...prev,
          [variation.id]: { url: data.audioUrl, duration: data.duration },
        }));
      } else {
        setError(data.error || "Failed to generate voice");
      }
    } catch (err) {
      setError("Connection error. Please try again.");
    } finally {
      setGenerating(null);
    }
  };

  const generateAll = async () => {
    for (const variation of VOICE_VARIATIONS) {
      await generateVoice(variation);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Voice Test Lab</h1>
        <p className="text-gray-600 mb-8">
          Generate and compare different voice settings to find the best one for Sarah
        </p>

        {/* Script Selector */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Script Template
          </label>
          <div className="grid grid-cols-3 gap-4 mb-6">
            {SCRIPT_OPTIONS.map((script) => (
              <button
                key={script.id}
                onClick={() => handleScriptChange(script.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedScript === script.id
                    ? "border-burgundy-600 bg-burgundy-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="font-semibold text-gray-900">{script.name}</div>
                <div className="text-sm text-gray-500 mt-1">{script.text.length} chars</div>
              </button>
            ))}
          </div>

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Test Script (edit to customize)
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-burgundy-500 font-mono text-sm"
          />
          <div className="mt-2 text-sm text-gray-500">
            {text.length} characters • Tip: Replace "Jennifer" with any name to test personalization
          </div>
          <div className="mt-4 flex gap-4">
            <button
              onClick={generateAll}
              disabled={generating !== null}
              className="px-6 py-2 bg-burgundy-600 text-white rounded-lg hover:bg-burgundy-700 disabled:opacity-50"
            >
              Generate All Variations
            </button>
            <button
              onClick={() => handleScriptChange(selectedScript)}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Reset Text
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8">{error}</div>
        )}

        {/* Voice Variations Grid */}
        <div className="grid gap-6">
          {VOICE_VARIATIONS.map((variation) => (
            <div
              key={variation.id}
              className="bg-white rounded-lg shadow p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {variation.name}
                    {variation.id === "natural-slow" && (
                      <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                        CURRENT DEFAULT
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-600 text-sm">{variation.description}</p>
                </div>
                <button
                  onClick={() => generateVoice(variation)}
                  disabled={generating !== null}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    generating === variation.id
                      ? "bg-gray-200 text-gray-500"
                      : "bg-burgundy-600 text-white hover:bg-burgundy-700"
                  }`}
                >
                  {generating === variation.id ? "Generating..." : "Generate"}
                </button>
              </div>

              {/* Settings Display */}
              <div className="grid grid-cols-4 gap-4 text-sm mb-4">
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Speed:</span>{" "}
                  <span className="font-mono">{variation.settings.speed}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Stability:</span>{" "}
                  <span className="font-mono">{variation.settings.stability}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Similarity:</span>{" "}
                  <span className="font-mono">{variation.settings.similarityBoost}</span>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <span className="text-gray-500">Style:</span>{" "}
                  <span className="font-mono">{variation.settings.style}</span>
                </div>
              </div>

              {/* Audio Player */}
              {results[variation.id] && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-4">
                    <audio
                      controls
                      src={results[variation.id]!.url}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-600">
                      ~{results[variation.id]!.duration}s
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Custom Settings */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Custom Settings (Coming Soon)
          </h3>
          <p className="text-gray-600 text-sm">
            Once you find the best settings above, we can make those the new default.
          </p>
        </div>
      </div>
    </div>
  );
}
