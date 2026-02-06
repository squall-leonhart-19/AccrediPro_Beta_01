"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, Play, Pause, Volume2, Phone, CheckCircle2 } from "lucide-react";

/**
 * Scholarship Audio Test Page
 * Test Sarah's personalized audio for quiz submission flow
 */

// Pre-defined scripts for testing
const CALLING_SCRIPT = (name: string, caseNumber: string) =>
    `Hi ${name}! This is Sarah from the Admissions team. I'm on the phone with the Institute RIGHT NOW reviewing your case... Case number ${caseNumber}... Based on your profile, this looks really promising. Give me just one minute while I verify your scholarship eligibility...`;

const APPROVAL_SCRIPT = (name: string) =>
    `${name}! OH MY GOD... I have AMAZING news! You've been APPROVED for the ASI Institutional Scholarship! Based on your application, the Institute has agreed to cover a significant portion of your tuition. Let me walk you through exactly what you're getting and what this means for you...`;

export default function ScholarshipAudioTestPage() {
    const [firstName, setFirstName] = useState("Margaret");
    const [caseNumber, setCaseNumber] = useState("4892");
    const [isGeneratingCalling, setIsGeneratingCalling] = useState(false);
    const [isGeneratingApproval, setIsGeneratingApproval] = useState(false);
    const [callingAudio, setCallingAudio] = useState<string | null>(null);
    const [approvalAudio, setApprovalAudio] = useState<string | null>(null);
    const [isPlayingCalling, setIsPlayingCalling] = useState(false);
    const [isPlayingApproval, setIsPlayingApproval] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const callingAudioRef = useRef<HTMLAudioElement | null>(null);
    const approvalAudioRef = useRef<HTMLAudioElement | null>(null);

    const generateAudio = async (type: "calling" | "approval") => {
        const setGenerating = type === "calling" ? setIsGeneratingCalling : setIsGeneratingApproval;
        const setAudio = type === "calling" ? setCallingAudio : setApprovalAudio;

        const script = type === "calling"
            ? CALLING_SCRIPT(firstName, caseNumber)
            : APPROVAL_SCRIPT(firstName);

        setGenerating(true);
        setError(null);

        try {
            const response = await fetch('/api/voice-test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    text: script,
                    settings: {
                        stability: 0.55,
                        similarityBoost: 0.90,
                        style: 0.40,  // More expressive for excitement
                        speed: 0.88,
                    }
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

    const playAudio = (type: "calling" | "approval") => {
        const audioUrl = type === "calling" ? callingAudio : approvalAudio;
        const audioRef = type === "calling" ? callingAudioRef : approvalAudioRef;
        const setIsPlaying = type === "calling" ? setIsPlayingCalling : setIsPlayingApproval;
        const isPlaying = type === "calling" ? isPlayingCalling : isPlayingApproval;

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
        // Generate both audios
        await generateAudio("calling");
        await generateAudio("approval");
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">
                        🎙️ Scholarship Audio Test
                    </h1>
                    <p className="text-slate-600">
                        Test Sarah&apos;s personalized audio for quiz submission flow
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

                {/* Full Flow Simulation */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 mb-6 text-white">
                    <h2 className="text-lg font-semibold mb-2">🚀 Simulate Full Flow</h2>
                    <p className="text-purple-100 text-sm mb-4">
                        Generate both audios to test the complete submission experience
                    </p>
                    <Button
                        onClick={simulateFullFlow}
                        disabled={isGeneratingCalling || isGeneratingApproval}
                        className="w-full bg-white text-purple-600 hover:bg-purple-50"
                    >
                        {(isGeneratingCalling || isGeneratingApproval) ? (
                            <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Generating Both Audios...
                            </>
                        ) : (
                            "Generate Both Audios"
                        )}
                    </Button>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 mb-6">
                        {error}
                    </div>
                )}

                {/* Tips */}
                <div className="text-center text-sm text-slate-500">
                    <p className="mb-2">💡 <strong>Flow:</strong></p>
                    <p>1. User submits quiz optin form</p>
                    <p>2. Audio 1 plays immediately (Sarah calling)</p>
                    <p>3. Loading screen shows for 30-45 seconds</p>
                    <p>4. Audio 2 plays on results (Approval)</p>
                    <p>5. Value stack + Sarah chat appears</p>
                </div>
            </div>
        </div>
    );
}
