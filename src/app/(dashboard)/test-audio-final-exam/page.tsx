"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Volume2, Loader2, Download, Play, Pause, RefreshCw } from "lucide-react";

export default function TestAudioFinalExamPage() {
  // Double line breaks create natural pauses in speech
  const [script, setScript] = useState(`Hey! It's Sarah here.


You made it to the Final Exam! I'm so proud of you for completing all the modules.


This is just a quick 10-question quiz to wrap up everything you've learned. Don't stress - you've got this!


Take your time, trust yourself, and I'll see you on the other side with your certificate!


Good luck.`);

  const [stability, setStability] = useState(0.5);
  const [similarityBoost, setSimilarityBoost] = useState(0.75);
  const [style, setStyle] = useState(0.0);
  const [speakerBoost, setSpeakerBoost] = useState(true);
  const [speed, setSpeed] = useState(0.9);

  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [generationTime, setGenerationTime] = useState<number | null>(null);

  const generateAudio = async () => {
    setIsGenerating(true);
    setError(null);
    const startTime = Date.now();

    try {
      const response = await fetch("/api/test-audio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: script,
          stability,
          similarityBoost,
          style,
          speakerBoost,
          speed,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Failed to generate audio");
      }

      // Create audio URL from base64
      const audioBlob = new Blob(
        [Uint8Array.from(atob(data.audioBase64), (c) => c.charCodeAt(0))],
        { type: "audio/mpeg" }
      );
      const url = URL.createObjectURL(audioBlob);

      // Clean up previous audio
      if (audioUrl) {
        URL.revokeObjectURL(audioUrl);
      }
      if (audioElement) {
        audioElement.pause();
      }

      setAudioUrl(url);
      setGenerationTime(Date.now() - startTime);

      // Create new audio element
      const audio = new Audio(url);
      audio.onended = () => setIsPlaying(false);
      setAudioElement(audio);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsGenerating(false);
    }
  };

  const togglePlay = () => {
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      audioElement.play();
      setIsPlaying(true);
    }
  };

  const downloadAudio = () => {
    if (!audioUrl) return;
    const a = document.createElement("a");
    a.href = audioUrl;
    a.download = "sarah-final-exam-test.mp3";
    a.click();
  };

  const saveToPublic = async () => {
    if (!audioUrl) return;

    try {
      const response = await fetch(audioUrl);
      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = async () => {
        const base64 = (reader.result as string).split(",")[1];

        const saveResponse = await fetch("/api/test-audio/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ audioBase64: base64, filename: "sarah-final-exam.mp3" }),
        });

        const data = await saveResponse.json();
        if (data.success) {
          alert("Audio saved to /public/audio/sarah-final-exam.mp3!");
        } else {
          alert("Failed to save: " + data.error);
        }
      };

      reader.readAsDataURL(blob);
    } catch (err) {
      alert("Error saving audio");
    }
  };

  return (
    <div className="container max-w-4xl py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-burgundy-800">Test Final Exam Audio</h1>
        <p className="text-muted-foreground">
          Experiment with different voice parameters for Sarah&apos;s Final Exam encouragement
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Script Editor */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Script</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              rows={12}
              className="font-mono text-sm"
              placeholder="Enter the script for Sarah to speak..."
            />
            <p className="text-xs text-muted-foreground mt-2">
              {script.length} characters
            </p>
          </CardContent>
        </Card>

        {/* Voice Parameters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Voice Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Stability */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Stability</Label>
                <span className="text-sm text-muted-foreground">{stability.toFixed(2)}</span>
              </div>
              <Slider
                value={[stability]}
                onValueChange={([v]) => setStability(v)}
                min={0}
                max={1}
                step={0.05}
              />
              <p className="text-xs text-muted-foreground">
                Lower = more expressive/variable, Higher = more stable/consistent
              </p>
            </div>

            {/* Similarity Boost */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Similarity Boost</Label>
                <span className="text-sm text-muted-foreground">{similarityBoost.toFixed(2)}</span>
              </div>
              <Slider
                value={[similarityBoost]}
                onValueChange={([v]) => setSimilarityBoost(v)}
                min={0}
                max={1}
                step={0.05}
              />
              <p className="text-xs text-muted-foreground">
                Higher = closer to original voice, Lower = more variation
              </p>
            </div>

            {/* Style */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Style Exaggeration</Label>
                <span className="text-sm text-muted-foreground">{style.toFixed(2)}</span>
              </div>
              <Slider
                value={[style]}
                onValueChange={([v]) => setStyle(v)}
                min={0}
                max={1}
                step={0.05}
              />
              <p className="text-xs text-muted-foreground">
                Higher = more expressive style (can reduce stability)
              </p>
            </div>

            {/* Speed */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Speed</Label>
                <span className="text-sm text-muted-foreground">{speed.toFixed(2)}x</span>
              </div>
              <Slider
                value={[speed]}
                onValueChange={([v]) => setSpeed(v)}
                min={0.5}
                max={1.5}
                step={0.05}
              />
              <p className="text-xs text-muted-foreground">
                0.5 = half speed, 1.0 = normal, 1.5 = 1.5x speed
              </p>
            </div>

            {/* Speaker Boost */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="speakerBoost"
                checked={speakerBoost}
                onChange={(e) => setSpeakerBoost(e.target.checked)}
                className="rounded"
              />
              <Label htmlFor="speakerBoost">Speaker Boost</Label>
              <span className="text-xs text-muted-foreground ml-auto">
                Enhances voice similarity
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generate Button & Audio Player */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-wrap gap-3 items-center">
            <Button
              onClick={generateAudio}
              disabled={isGenerating || !script.trim()}
              className="bg-burgundy-600 hover:bg-burgundy-700"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate Audio
                </>
              )}
            </Button>

            {audioUrl && (
              <>
                <Button
                  onClick={togglePlay}
                  variant="outline"
                  className="border-burgundy-300"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Play
                    </>
                  )}
                </Button>

                <Button onClick={downloadAudio} variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>

                <Button
                  onClick={saveToPublic}
                  variant="default"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Volume2 className="w-4 h-4 mr-2" />
                  Save to /public/audio
                </Button>
              </>
            )}
          </div>

          {generationTime && (
            <p className="text-sm text-muted-foreground mt-3">
              Generated in {(generationTime / 1000).toFixed(1)}s
            </p>
          )}

          {error && (
            <p className="text-sm text-red-600 mt-3">
              Error: {error}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Preset Suggestions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Preset Suggestions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-3">
            <button
              type="button"
              className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-100 cursor-pointer transition-colors"
              onClick={() => {
                setStability(0.5);
                setSimilarityBoost(0.75);
                setStyle(0);
                setSpeed(0.9);
              }}
            >
              Default (Current)
            </button>
            <button
              type="button"
              className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-100 cursor-pointer transition-colors"
              onClick={() => {
                setStability(0.3);
                setSimilarityBoost(0.8);
                setStyle(0.2);
                setSpeed(0.85);
              }}
            >
              More Expressive
            </button>
            <button
              type="button"
              className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-100 cursor-pointer transition-colors"
              onClick={() => {
                setStability(0.7);
                setSimilarityBoost(0.9);
                setStyle(0);
                setSpeed(0.95);
              }}
            >
              More Stable
            </button>
            <button
              type="button"
              className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-100 cursor-pointer transition-colors"
              onClick={() => {
                setStability(0.4);
                setSimilarityBoost(0.7);
                setStyle(0.3);
                setSpeed(0.8);
              }}
            >
              Warm & Friendly
            </button>
            <button
              type="button"
              className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-100 cursor-pointer transition-colors"
              onClick={() => {
                setStability(0.6);
                setSimilarityBoost(0.85);
                setStyle(0.1);
                setSpeed(1.0);
              }}
            >
              Professional
            </button>
            <button
              type="button"
              className="px-3 py-2 text-sm border border-gray-300 rounded-md bg-white hover:bg-gray-100 cursor-pointer transition-colors"
              onClick={() => {
                setStability(0.25);
                setSimilarityBoost(0.6);
                setStyle(0.4);
                setSpeed(0.85);
              }}
            >
              Very Expressive
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
