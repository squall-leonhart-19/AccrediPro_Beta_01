"use client";

import { useState } from "react";
import { Phone, Loader2, CheckCircle, XCircle, User } from "lucide-react";

// Format phone number as user types
const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, "");
    if (digits.length === 0) return "";
    if (digits.length <= 1) return `+${digits}`;
    if (digits.length <= 4) return `+${digits.slice(0, 1)} (${digits.slice(1)}`;
    if (digits.length <= 7) return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4)}`;
    if (digits.length <= 11) return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
    return `+${digits.slice(0, 1)} (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7, 11)}`;
};

export default function RetellAITestPage() {
    // Contact Info
    const [phone, setPhone] = useState("+1 (646) 934-8747");
    const [firstName, setFirstName] = useState("Jenna");
    const [lastName, setLastName] = useState("Mitchell");
    const [email, setEmail] = useState("tortolialessio1997@gmail.com");

    // Quiz Answers Simulation
    const [background, setBackground] = useState("healthcare-professional");
    const [currentIncome, setCurrentIncome] = useState("under-2k");
    const [incomeGoal, setIncomeGoal] = useState("10k");
    const [experience, setExperience] = useState("some-experience");
    const [specialization, setSpecialization] = useState("Hormone Health");
    const [commitment, setCommitment] = useState("absolutely");
    const [startTimeline, setStartTimeline] = useState("this-week");

    // For Martinez direct call testing
    const [investmentAmount, setInvestmentAmount] = useState("300");

    // UI State
    const [status, setStatus] = useState<"idle" | "calling" | "success" | "error">("idle");
    const [message, setMessage] = useState("");
    const [callTime, setCallTime] = useState<number | null>(null);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(formatPhoneNumber(e.target.value));
    };

    const triggerCall = async (agent: "sarah" | "martinez") => {
        if (!phone) {
            setMessage("Please enter a phone number");
            return;
        }
        if (!firstName) {
            setMessage("Please enter a first name");
            return;
        }

        setStatus("calling");
        setMessage(`Triggering ${agent === "sarah" ? "Sarah" : "Dr. Martinez"} call...`);
        const startTime = Date.now();

        try {
            const response = await fetch("/api/retellai/call", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    phone,
                    firstName,
                    lastName: lastName || "Test",
                    email: email || `${firstName.toLowerCase()}@test.com`,
                    agent, // "sarah" or "martinez"
                    specialization,
                    investmentAmount: agent === "martinez" ? investmentAmount : undefined,
                    incomeGoal: incomeGoal === "5k" ? "five thousand dollars per month" :
                        incomeGoal === "10k" ? "ten thousand dollars per month" :
                            incomeGoal === "20k" ? "twenty thousand dollars per month" : "fifty thousand dollars or more per month",
                    currentIncome: currentIncome === "0" ? "nothing yet" :
                        currentIncome === "under-2k" ? "under 2000 per month" :
                            currentIncome === "2k-5k" ? "2000 to 5000 per month" : "over 5000 per month",
                    background: background === "healthcare-professional" ? "healthcare professional like a nurse" :
                        background === "health-coach" ? "health coach" :
                            background === "corporate" ? "corporate professional" :
                                background === "stay-at-home-mom" ? "stay at home mom" : "passionate about health",
                    experience: experience === "active-clients" ? "currently has clients" :
                        experience === "past-clients" ? "had clients before" :
                            experience === "informal" ? "helped friends and family" : "no experience yet",
                    commitment: commitment === "absolutely" ? "absolutely committed" :
                        commitment === "yes-work" ? "can make it work" : "needs to rearrange",
                    startTimeline: startTimeline === "this-week" ? "this week" :
                        startTimeline === "2-weeks" ? "within 2 weeks" :
                            startTimeline === "1-month" ? "within a month" : "planning but committed",
                }),
            });

            const data = await response.json();
            const elapsed = Date.now() - startTime;
            setCallTime(elapsed);

            if (response.ok) {
                setStatus("success");
                setMessage(`${agent === "sarah" ? "Sarah" : "Dr. Martinez"} call initiated in ${elapsed}ms! Phone should ring in ~5-10 seconds.`);
            } else {
                setStatus("error");
                setMessage(`Error: ${data.error || data.details || "Unknown error"}`);
            }
        } catch (err) {
            setStatus("error");
            setMessage(`Network error: ${err}`);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
                    <h1 className="text-3xl font-bold text-white text-center mb-2">
                        🧪 RetellAI Two-Call Flow Test
                    </h1>
                    <p className="text-slate-400 text-center mb-8">
                        Test Sarah (Qualifier) and Dr. Martinez (Closer) separately
                    </p>

                    {/* Contact Info Section */}
                    <div className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                        <h2 className="text-lg font-semibold text-white mb-4">📱 Contact Info</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Phone *</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    placeholder="+1 (555) 123-4567"
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">First Name *</label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder="Sarah"
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Last Name</label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder="Mitchell"
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="test@example.com"
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Quiz Simulation Section */}
                    <div className="mb-6 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                        <h2 className="text-lg font-semibold text-white mb-4">📋 Quiz Answers (For Sarah)</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Background</label>
                                <select
                                    value={background}
                                    onChange={(e) => setBackground(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                                >
                                    <option value="healthcare-professional">Healthcare Professional</option>
                                    <option value="health-coach">Health Coach</option>
                                    <option value="corporate">Corporate Professional</option>
                                    <option value="stay-at-home-mom">Stay-at-Home Mom</option>
                                    <option value="other">Other Passionate</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Specialization</label>
                                <select
                                    value={specialization}
                                    onChange={(e) => setSpecialization(e.target.value)}
                                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm"
                                >
                                    <option>Hormone Health</option>
                                    <option>Gut Restoration</option>
                                    <option>Metabolic Optimization</option>
                                    <option>Burnout Recovery</option>
                                    <option>Autoimmune Support</option>
                                </select>
                            </div>
                        </div>
                    </div>


                    {/* Call Buttons */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <button
                            onClick={() => triggerCall("sarah")}
                            disabled={status === "calling"}
                            className={`py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${status === "calling"
                                ? "bg-slate-600 cursor-not-allowed"
                                : "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white shadow-lg hover:shadow-blue-500/30"
                                }`}
                        >
                            {status === "calling" ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Phone className="w-5 h-5" />
                                    Sarah (Call 1)
                                </>
                            )}
                        </button>

                        <button
                            onClick={() => triggerCall("martinez")}
                            disabled={status === "calling"}
                            className={`py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all ${status === "calling"
                                ? "bg-slate-600 cursor-not-allowed"
                                : "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-lg hover:shadow-emerald-500/30"
                                }`}
                        >
                            {status === "calling" ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <User className="w-5 h-5" />
                                    Dr. Martinez (Call 2)
                                </>
                            )}
                        </button>
                    </div>

                    {/* Status Message */}
                    {message && (
                        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${status === "success"
                            ? "bg-emerald-500/20 border border-emerald-500/30"
                            : status === "error"
                                ? "bg-red-500/20 border border-red-500/30"
                                : "bg-blue-500/20 border border-blue-500/30"
                            }`}>
                            {status === "success" && <CheckCircle className="w-5 h-5 text-emerald-400" />}
                            {status === "error" && <XCircle className="w-5 h-5 text-red-400" />}
                            {status === "calling" && <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />}
                            <span className={`text-sm ${status === "success" ? "text-emerald-300" :
                                status === "error" ? "text-red-300" : "text-blue-300"
                                }`}>
                                {message}
                            </span>
                        </div>
                    )}

                    {/* Two-Call Flow Info */}
                    <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                        <h3 className="text-sm font-semibold text-amber-300 mb-2">📞 Two-Call Flow:</h3>
                        <ol className="text-xs text-amber-200/80 space-y-1">
                            <li><strong>Call 1 - Sarah:</strong> Qualifies, gets investment amount, creates uncertainty</li>
                            <li><strong>45 second wait:</strong> Prospect waits nervously...</li>
                            <li><strong>Call 2 - Dr. Martinez:</strong> "Great news! Your scholarship is approved!"</li>
                        </ol>
                    </div>

                    {/* Manual Testing Note */}
                    <div className="mt-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                        <h3 className="text-sm font-semibold text-slate-300 mb-2">🧪 Manual Testing:</h3>
                        <ol className="text-xs text-slate-400 space-y-1">
                            <li>1. Click <strong>Sarah (Call 1)</strong> → Answer, say an amount</li>
                            <li>2. Wait 45-60 seconds after Sarah hangs up</li>
                            <li>3. Click <strong>Dr. Martinez (Call 2)</strong> → She delivers approval</li>
                        </ol>
                        <p className="text-xs text-slate-500 mt-2 italic">
                            (In production, Martinez call will trigger automatically via webhook)
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
