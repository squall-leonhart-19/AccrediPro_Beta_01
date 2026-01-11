"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, MessageCircle, Mail, Clock } from "lucide-react";

interface CompleteClientProps {
    firstName: string;
    diplomaName: string;
}

export function CompleteClient({
    firstName,
    diplomaName,
}: CompleteClientProps) {
    return (
        <div
            className="min-h-screen"
            style={{
                fontFamily: '"IBM Plex Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
                background: '#FFFAF7',
                color: '#1F2432',
                lineHeight: 1.6,
                WebkitFontSmoothing: 'antialiased',
            }}
        >
            <main className="max-w-[680px] mx-auto p-4">
                <section
                    className="bg-white border border-[#ECE8E2] rounded-xl shadow-lg p-5 md:p-6"
                    style={{ boxShadow: '0 8px 24px rgba(0,0,0,.06)' }}
                >
                    {/* Hero */}
                    <div className="text-center pb-6 border-b-2 border-[#f0e9de] mb-6">
                        <h1 className="text-2xl md:text-[26px] font-extrabold text-burgundy-700 mb-3">
                            🎓 Congratulations {firstName} — You're Almost Officially Certified!
                        </h1>
                        <p className="text-base text-[#5a5146] italic">
                            Sarah here 💚 I'm SO proud of you — 97/100! Just one final step before your diploma is issued.
                        </p>
                    </div>

                    {/* Diploma Box */}
                    <div
                        className="rounded-xl p-5 mb-6 text-center"
                        style={{
                            background: 'linear-gradient(135deg, #FFF9F0 0%, #FFFDF9 100%)',
                            border: '2px solid #D4AF37',
                        }}
                    >
                        <h2 className="text-xl font-extrabold text-gold-600 mb-3">
                            ✨ How to Receive Your Official Mini Diploma
                        </h2>
                        <p className="text-base text-[#5a5146] mb-4">
                            Please complete these <strong>two quick steps</strong> so we can process and send your certificate within <strong>24 hours</strong>:
                        </p>

                        <ol className="text-left max-w-[540px] mx-auto space-y-4 list-decimal list-inside">
                            <li className="pl-1">
                                <strong className="text-burgundy-600">Step 1:</strong> Leave your honest review clicking the button below! This helps me as a single Mum to improve all I created!
                                <br />
                                <a
                                    href="https://www.trustpilot.com/review/accredipro.academy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 mt-2 px-4 py-2.5 rounded-lg font-bold text-white text-sm"
                                    style={{ background: '#00B67A' }}
                                >
                                    ⭐ Leave Trustpilot Review
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </li>

                            <li className="pl-1">
                                <strong className="text-burgundy-600">Step 2:</strong> Send me a quick message on <strong>Chat</strong> that says:
                                <br />
                                <em className="text-burgundy-600">"Review left ✅"</em>
                                <br />
                                — and your diploma will arrive by email <strong>AND</strong> in this portal in <strong>24 hours</strong>.
                                <br />
                                <Link
                                    href="/womens-health-diploma/chat"
                                    className="inline-flex items-center gap-2 mt-2 px-4 py-2.5 rounded-lg font-bold text-white text-sm bg-burgundy-600 hover:bg-burgundy-700"
                                >
                                    <MessageCircle className="w-4 h-4" />
                                    Message Sarah
                                </Link>
                            </li>
                        </ol>

                        <div className="flex items-center justify-center gap-2 text-gold-700 font-semibold text-sm mt-5">
                            <Clock className="w-4 h-4" />
                            <span>Your certificate will be delivered within 24 hours</span>
                        </div>

                        <p className="text-sm text-gold-600 font-semibold mt-4 flex items-center justify-center gap-2">
                            <Mail className="w-4 h-4" />
                            Remember to check Spam or Promotions folders!
                        </p>
                    </div>

                    {/* Meanwhile Box */}
                    <div
                        className="rounded-xl p-5 text-center"
                        style={{
                            background: 'linear-gradient(135deg, #FDF2F8 0%, #FFF5F7 100%)',
                            border: '2px solid #F5D0E0',
                        }}
                    >
                        <h2 className="text-xl font-extrabold text-burgundy-600 mb-3">
                            Thank You for Being Part of This Journey 💚
                        </h2>
                        <p className="text-base text-gray-700 mb-4">
                            Your words — even just one sentence — help future students decide if this path is right for them and help me keep improving every class.
                            <br /><br />
                            You've worked so hard. Take a deep breath, celebrate, and get ready to add <strong className="text-burgundy-600">"Certified Health Coach"</strong> to your name!
                        </p>
                        <p className="text-[15px] text-gray-500 italic">
                            With pride,<br />
                            <span className="text-burgundy-600 font-semibold">Sarah 💚</span>
                        </p>
                    </div>

                    {/* What happens next */}
                    <div className="mt-6 p-4 bg-burgundy-50 rounded-xl border border-burgundy-100">
                        <p className="text-sm text-burgundy-700 text-center">
                            <strong>📬 What happens next?</strong><br />
                            Once you complete the steps above, your official <strong>{diplomaName}</strong> certificate will be:
                        </p>
                        <ul className="text-sm text-burgundy-600 mt-2 space-y-1 text-center">
                            <li>✉️ Emailed to you (check spam!)</li>
                            <li>📱 Available in this portal under Certificates</li>
                        </ul>
                    </div>
                </section>
            </main>
        </div>
    );
}
