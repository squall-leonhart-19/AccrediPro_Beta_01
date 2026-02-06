"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Loader2, Play, Pause, Volume2, Phone, CheckCircle2, Settings, RotateCcw } from "lucide-react";

/**
 * Scholarship Audio Test Page
 * Test Sarah's personalized audio for quiz submission flow
 * With adjustable ElevenLabs voice settings
 */

// Pre-defined scripts for testing
const CALLING_SCRIPT = (name: string, caseNumber: string) =>
    `Hi ${name}! This is Sarah from the Admissions team. I'm on the phone with the Institute RIGHT NOW reviewing your case... Case number ${caseNumber}... Based on your profile, this looks really promising. I'll stay on the call with the Institute because I need to confirm your scholarship eligibility... Give me just a minute...`;

const APPROVAL_SCRIPT = (name: string) =>
    `${name}! OH MY GOD... I have AMAZING news! You've been APPROVED for the ASI Institutional Scholarship! Based on your application, the Institute has agreed to cover a significant portion of your tuition. Let me walk you through exactly what you're getting and what this means for you...`;

const WAITING_SCRIPT = (name: string) =>
    `Perfect ${name}, I'm going to stay right here on the call with the Institute while you complete your enrollment. Once you're done, I'll confirm everything with them immediately and get your access set up right away. Take your time, but know that I'm here waiting for you... The Institute has your scholarship locked in, we just need to finalize it on our end. Go ahead and complete the payment, and I'll be right here when you're done...`;

interface VoiceSettings {
    stability: number;
    similarityBoost: number;
    style: number;
    speed: number;
}

// Default settings for excited/warm Sarah voice
const DEFAULT_SETTINGS: VoiceSettings = {
    stability: 0.55,
    similarityBoost: 0.90,
    style: 0.40,
    speed: 0.88,
};

export default function ScholarshipAudioTestPage() {
    const [firstName, setFirstName] = useState("Margaret");
    const [caseNumber, setCaseNumber] = useState("4892");
    const [settings, setSettings] = useState<VoiceSettings>(DEFAULT_SETTINGS);
    const [isGeneratingCalling, setIsGeneratingCalling] = useState(false);
    const [isGeneratingApproval, setIsGeneratingApproval] = useState(false);
    const [isGeneratingWaiting, setIsGeneratingWaiting] = useState(false);
    const [callingAudio, setCallingAudio] = useState<string | null>(null);
    const [approvalAudio, setApprovalAudio] = useState<string | null>(null);
    const [waitingAudio, setWaitingAudio] = useState<string | null>(null);
    const [isPlayingCalling, setIsPlayingCalling] = useState(false);
    const [isPlayingApproval, setIsPlayingApproval] = useState(false);
    const [isPlayingWaiting, setIsPlayingWaiting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSettings, setShowSettings] = useState(true);

    const callingAudioRef = useRef<HTMLAudioElement | null>(null);
    const approvalAudioRef = useRef<HTMLAudioElement | null>(null);
    const waitingAudioRef = useRef<HTMLAudioElement | null>(null);

    const generateAudio = async (type: "calling" | "approval" | "waiting") => {
        const setGenerating = type === "calling" ? setIsGeneratingCalling
            : type === "approval" ? setIsGeneratingApproval
                : setIsGeneratingWaiting;
        const setAudio = type === "calling" ? setCallingAudio
            : type === "approval" ? setApprovalAudio
                : setWaitingAudio;

        const script = type === "calling"
            ? CALLING_SCRIPT(firstName, caseNumber)
            : type === "approval"
                ? APPROVAL_SCRIPT(firstName)
                : WAITING_SCRIPT(firstName);

        setGenerating(true);
        setError(null);

        try {
            const response = await fetch('/api/voice-test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: script,
                    settings: settings,
                }),
            });

            const data = await response.json();

            if (data.success && data.audio) {
                setAudio(data.audio);
            } else {
                setError(data.error || 'Failed to generate voice');
            }
        } catch (err) {
            setError('Failed to connect to voice service');
        } finally {
            setGenerating(false);
        }
    };


    const playAudio = (type: "calling" | "approval" | "waiting") => {
        const audioUrl = type === "calling" ? callingAudio
            : type === "approval" ? approvalAudio
                : waitingAudio;
        const audioRef = type === "calling" ? callingAudioRef
            : type === "approval" ? approvalAudioRef
                : waitingAudioRef;
        const setIsPlaying = type === "calling" ? setIsPlayingCalling
            : type === "approval" ? setIsPlayingApproval
                : setIsPlayingWaiting;
        const isPlaying = type === "calling" ? isPlayingCalling
            : type === "approval" ? isPlayingApproval
                : isPlayingWaiting;

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

    const simulateFullFlow = async () => {
        await generateAudio("calling");
        await generateAudio("approval");
        await generateAudio("waiting");
    };

    const resetSettings = () => {
        setSettings(DEFAULT_SETTINGS);
    };


    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">
                        🎙️ Scholarship Audio Test
                    </h1>
                    <p className="text-slate-600">
                        Test Sarah&apos;s personalized audio • <span className="font-mono text-purple-600">ElevenLabs eleven_v3</span>
                    </p>
                </div>

                {/* Name Input */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-200">
                    <h2 className="text-lg font-semibold text-slate-800 mb-4">Test Settings</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                First Name
                            </label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="e.g., Margaret"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-2">
                                Case Number
                            </label>
                            <input
                                type="text"
                                value={caseNumber}
                                onChange={(e) => setCaseNumber(e.target.value)}
                                className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="e.g., 4892"
                            />
                        </div>
                    </div>
                </div>

                {/* Voice Settings */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                            <Settings className="h-5 w-5 text-purple-600" />
                            <h2 className="text-lg font-semibold text-slate-800">Voice Settings (ElevenLabs)</h2>
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={resetSettings}
                                className="text-slate-600"
                            >
                                <RotateCcw className="h-4 w-4 mr-1" />
                                Reset
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowSettings(!showSettings)}
                                className="text-slate-600"
                            >
                                {showSettings ? 'Hide' : 'Show'}
                            </Button>
                        </div>
                    </div>

                    {showSettings && (
                        <div className="space-y-6">
                            {/* Stability */}
                            <div>
                                <div className="flex justify-between mb-2">
                                    <label className="text-sm font-medium text-slate-700">
                                        Stability
                                    </label>
                                    <span className="text-sm font-mono text-purple-600">{settings.stability.toFixed(2)}</span>
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
                                    <span className="text-sm font-mono text-purple-600">{settings.similarityBoost.toFixed(2)}</span>
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
                                    <span className="text-sm font-mono text-purple-600">{settings.style.toFixed(2)}</span>
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
                                    <span className="text-sm font-mono text-purple-600">{settings.speed.toFixed(2)}</span>
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

                            {/* Current Settings Display */}
                            <div className="p-3 bg-slate-50 rounded-xl">
                                <p className="text-xs font-mono text-slate-600">
                                    {`{ stability: ${settings.stability}, similarityBoost: ${settings.similarityBoost}, style: ${settings.style}, speed: ${settings.speed} }`}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Audio 1: Calling Script */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-amber-100 rounded-full">
                            <Phone className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">
                                Audio 1: Calling the Institute
                            </h2>
                            <p className="text-sm text-slate-500">Plays immediately on submission</p>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 mb-4 text-sm text-slate-600 font-mono leading-relaxed">
                        {CALLING_SCRIPT(firstName, caseNumber)}
                    </div>

                    <div className="flex gap-3">
                        <Button
                            onClick={() => generateAudio("calling")}
                            disabled={isGeneratingCalling}
                            className="flex-1 bg-amber-500 hover:bg-amber-600 text-white"
                        >
                            {isGeneratingCalling ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Volume2 className="h-4 w-4 mr-2" />
                                    Generate Audio
                                </>
                            )}
                        </Button>

                        {callingAudio && (
                            <Button
                                onClick={() => playAudio("calling")}
                                variant="outline"
                                className="border-2"
                            >
                                {isPlayingCalling ? (
                                    <>
                                        <Pause className="h-4 w-4 mr-2" />
                                        Pause
                                    </>
                                ) : (
                                    <>
                                        <Play className="h-4 w-4 mr-2" />
                                        Play
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Audio 2: Approval Script */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-emerald-100 rounded-full">
                            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">
                                Audio 2: Approval Announcement
                            </h2>
                            <p className="text-sm text-slate-500">Plays after 30-45 second wait</p>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 mb-4 text-sm text-slate-600 font-mono leading-relaxed">
                        {APPROVAL_SCRIPT(firstName)}
                    </div>

                    <div className="flex gap-3">
                        <Button
                            onClick={() => generateAudio("approval")}
                            disabled={isGeneratingApproval}
                            className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white"
                        >
                            {isGeneratingApproval ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Volume2 className="h-4 w-4 mr-2" />
                                    Generate Audio
                                </>
                            )}
                        </Button>

                        {approvalAudio && (
                            <Button
                                onClick={() => playAudio("approval")}
                                variant="outline"
                                className="border-2"
                            >
                                {isPlayingApproval ? (
                                    <>
                                        <Pause className="h-4 w-4 mr-2" />
                                        Pause
                                    </>
                                ) : (
                                    <>
                                        <Play className="h-4 w-4 mr-2" />
                                        Play
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Audio 3: Waiting Script */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-slate-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-full">
                            <Loader2 className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">
                                Audio 3: Waiting During Payment
                            </h2>
                            <p className="text-sm text-slate-500">Plays while lead completes payment - Sarah stays on call</p>
                        </div>
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 mb-4 text-sm text-slate-600 font-mono leading-relaxed">
                        {WAITING_SCRIPT(firstName)}
                    </div>

                    <div className="flex gap-3">
                        <Button
                            onClick={() => generateAudio("waiting")}
                            disabled={isGeneratingWaiting}
                            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                        >
                            {isGeneratingWaiting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Volume2 className="h-4 w-4 mr-2" />
                                    Generate Audio
                                </>
                            )}
                        </Button>

                        {waitingAudio && (
                            <Button
                                onClick={() => playAudio("waiting")}
                                variant="outline"
                                className="border-2"
                            >
                                {isPlayingWaiting ? (
                                    <>
                                        <Pause className="h-4 w-4 mr-2" />
                                        Pause
                                    </>
                                ) : (
                                    <>
                                        <Play className="h-4 w-4 mr-2" />
                                        Play
                                    </>
                                )}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Full Flow Simulation */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 mb-6 text-white">
                    <h2 className="text-lg font-semibold mb-2">🚀 Simulate Full Flow</h2>
                    <p className="text-purple-100 text-sm mb-4">
                        Generate all 3 audios to test the complete scholarship experience
                    </p>
                    <Button
                        onClick={simulateFullFlow}
                        disabled={isGeneratingCalling || isGeneratingApproval || isGeneratingWaiting}
                        className="w-full bg-white text-purple-600 hover:bg-purple-50"
                    >
                        {(isGeneratingCalling || isGeneratingApproval || isGeneratingWaiting) ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Generating All 3 Audios...
                            </>
                        ) : (
                            "Generate All 3 Audios"
                        )}
                    </Button>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 mb-6">
                        {error}
                    </div>
                )}

                {/* Tips */}
                <div className="text-center text-sm text-slate-500 space-y-1">
                    <p className="font-semibold">💡 ElevenLabs V3 Settings Tips:</p>
                    <p>• Lower stability = more natural variation</p>
                    <p>• Higher style = more emotional/expressive</p>
                    <p>• Speed 0.85-0.90 = slightly slower, warmer feel</p>
                    <p>• For excitement, try style: 0.40-0.50</p>
                </div>
            </div>
        </div>
    );
}
