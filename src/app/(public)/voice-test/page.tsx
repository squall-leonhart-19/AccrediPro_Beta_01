"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, Loader2, Volume2, RotateCcw, Copy, Check } from "lucide-react";

interface VoiceSettings {
    stability: number;
    similarityBoost: number;
    style: number;
    speed: number;
}

export default function VoiceTestPage() {
    const [text, setText] = useState("Hey Sarah! I'm so glad you're here. I'm Sarah. I was a nurse for 12 years, and what I'm about to share with you changed everything for me. This isn't a video you watch. It's a real conversation between us. I'm going to tell you my story... and I have a feeling it might sound a lot like yours. Let's find out together.");
    const [settings, setSettings] = useState<VoiceSettings>({
        stability: 0.50,
        similarityBoost: 1.0,
        style: 0.50,
        speed: 0.85,
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [savedVersions, setSavedVersions] = useState<Array<{
        id: number;
        settings: VoiceSettings;
        text: string;
        audioUrl: string;
        notes: string;
    }>>([]);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const generateVoice = async () => {
        setIsGenerating(true);
        setError(null);
        setAudioUrl(null);

        try {
            const response = await fetch('/api/voice-test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, settings }),
            });

            const data = await response.json();

            if (data.success && data.audio) {
                setAudioUrl(data.audio);
            } else {
                setError(data.error || 'Failed to generate voice');
            }
        } catch (err) {
            setError('Failed to connect to voice service');
        } finally {
            setIsGenerating(false);
        }
    };

    const playAudio = () => {
        if (!audioUrl) return;

        if (isPlaying && audioRef.current) {
            audioRef.current.pause();
            setIsPlaying(false);
            return;
        }

        const audio = new Audio(audioUrl);
        audioRef.current = audio;
        audio.onended = () => setIsPlaying(false);
        audio.onerror = () => setIsPlaying(false);
        audio.play();
        setIsPlaying(true);
    };

    const saveVersion = () => {
        if (!audioUrl) return;
        const notes = prompt("Add notes for this version (e.g., 'too fast', 'perfect warmth'):");
        setSavedVersions(prev => [...prev, {
            id: Date.now(),
            settings: { ...settings },
            text,
            audioUrl,
            notes: notes || '',
        }]);
    };

    const loadVersion = (version: typeof savedVersions[0]) => {
        setSettings(version.settings);
        setText(version.text);
        setAudioUrl(version.audioUrl);
    };

    const copySettings = () => {
        const settingsStr = JSON.stringify(settings, null, 2);
        navigator.clipboard.writeText(settingsStr);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const resetToDefaults = () => {
        setSettings({
            stability: 0.50,
            similarityBoost: 1.0,
            style: 0.50,
            speed: 0.85,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">
                        🎙️ Voice Settings Tester
                    </h1>
                    <p className="text-slate-600">
                        Adjust ElevenLabs settings and find the perfect Sarah voice
                    </p>
                </div>

                {/* Text Input */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-200">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">
                        Test Text
                    </label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-burgundy-500 focus:border-transparent resize-none"
                        placeholder="Enter text to test..."
                    />
                    <p className="text-xs text-slate-500 mt-1">{text.length} characters</p>
                </div>

                {/* Settings Sliders */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-200">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-slate-800">Voice Settings</h2>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={resetToDefaults}
                                className="text-slate-600"
                            >
                                <RotateCcw className="h-4 w-4 mr-1" />
                                Reset
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={copySettings}
                                className="text-slate-600"
                            >
                                {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                                {copied ? 'Copied!' : 'Copy'}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Stability */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-slate-700">
                                    Stability
                                </label>
                                <span className="text-sm font-mono text-burgundy-600">{settings.stability.toFixed(2)}</span>
                            </div>
                            <Slider
                                value={[settings.stability]}
                                onValueChange={([v]) => setSettings(s => ({ ...s, stability: v }))}
                                min={0}
                                max={1}
                                step={0.05}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>More Variable/Expressive</span>
                                <span>More Stable/Consistent</span>
                            </div>
                        </div>

                        {/* Similarity Boost */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-slate-700">
                                    Similarity Boost
                                </label>
                                <span className="text-sm font-mono text-burgundy-600">{settings.similarityBoost.toFixed(2)}</span>
                            </div>
                            <Slider
                                value={[settings.similarityBoost]}
                                onValueChange={([v]) => setSettings(s => ({ ...s, similarityBoost: v }))}
                                min={0}
                                max={1}
                                step={0.05}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>Less Similar to Original</span>
                                <span>More Similar to Original</span>
                            </div>
                        </div>

                        {/* Style */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-slate-700">
                                    Style Exaggeration
                                </label>
                                <span className="text-sm font-mono text-burgundy-600">{settings.style.toFixed(2)}</span>
                            </div>
                            <Slider
                                value={[settings.style]}
                                onValueChange={([v]) => setSettings(s => ({ ...s, style: v }))}
                                min={0}
                                max={1}
                                step={0.05}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>Neutral/Professional</span>
                                <span>More Expressive/Emotional</span>
                            </div>
                        </div>

                        {/* Speed */}
                        <div>
                            <div className="flex justify-between mb-2">
                                <label className="text-sm font-medium text-slate-700">
                                    Speed
                                </label>
                                <span className="text-sm font-mono text-burgundy-600">{settings.speed.toFixed(2)}</span>
                            </div>
                            <Slider
                                value={[settings.speed]}
                                onValueChange={([v]) => setSettings(s => ({ ...s, speed: v }))}
                                min={0.5}
                                max={2.0}
                                step={0.05}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                                <span>0.5x (Slow)</span>
                                <span>1.0x (Normal)</span>
                                <span>2.0x (Fast)</span>
                            </div>
                        </div>
                    </div>

                    {/* Current Settings Display */}
                    <div className="mt-6 p-4 bg-slate-50 rounded-xl">
                        <p className="text-xs font-mono text-slate-600">
                            {`{ stability: ${settings.stability}, similarityBoost: ${settings.similarityBoost}, style: ${settings.style}, speed: ${settings.speed} }`}
                        </p>
                    </div>
                </div>

                {/* Generate & Play Buttons */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-200">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Button
                            onClick={generateVoice}
                            disabled={isGenerating || !text.trim()}
                            className="flex-1 bg-burgundy-600 hover:bg-burgundy-700 text-white py-6 text-lg"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Volume2 className="h-5 w-5 mr-2" />
                                    Generate Voice
                                </>
                            )}
                        </Button>

                        {audioUrl && (
                            <>
                                <Button
                                    onClick={playAudio}
                                    variant="outline"
                                    className="flex-1 py-6 text-lg border-2"
                                >
                                    {isPlaying ? (
                                        <>
                                            <Pause className="h-5 w-5 mr-2" />
                                            Pause
                                        </>
                                    ) : (
                                        <>
                                            <Play className="h-5 w-5 mr-2" />
                                            Play
                                        </>
                                    )}
                                </Button>

                                <Button
                                    onClick={saveVersion}
                                    variant="outline"
                                    className="py-6 text-lg border-2 border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                                >
                                    Save Version
                                </Button>
                            </>
                        )}
                    </div>

                    {error && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
                            {error}
                        </div>
                    )}
                </div>

                {/* Saved Versions */}
                {savedVersions.length > 0 && (
                    <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4">
                            Saved Versions ({savedVersions.length})
                        </h2>
                        <div className="space-y-3">
                            {savedVersions.map((version, i) => (
                                <div
                                    key={version.id}
                                    className="p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-burgundy-300 transition-colors"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-slate-700 mb-1">
                                                Version {i + 1} {version.notes && `• ${version.notes}`}
                                            </p>
                                            <p className="text-xs font-mono text-slate-500">
                                                stab: {version.settings.stability} | sim: {version.settings.similarityBoost} | style: {version.settings.style} | speed: {version.settings.speed}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    const audio = new Audio(version.audioUrl);
                                                    audio.play();
                                                }}
                                            >
                                                <Play className="h-3 w-3" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => loadVersion(version)}
                                            >
                                                Load
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tips */}
                <div className="mt-8 text-center text-sm text-slate-500">
                    <p className="mb-2">💡 <strong>Tips:</strong></p>
                    <p>• Lower stability = more natural variation</p>
                    <p>• Higher style = more emotional/expressive</p>
                    <p>• Speed 0.85 = slightly slower, warmer feel</p>
                    <p>• Save versions to compare and find the best!</p>
                </div>
            </div>
        </div>
    );
}
