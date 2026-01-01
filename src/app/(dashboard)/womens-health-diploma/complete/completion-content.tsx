"use client";

import Link from "next/link";

interface CompletionContentProps {
    firstName: string;
    completedLessons: number;
    isFullyComplete: boolean;
    hasCertificate: boolean;
    certificate: {
        id: string;
        certificateNumber: string;
        issuedAt: Date;
    } | null;
}

export function CompletionContent({
    firstName,
}: CompletionContentProps) {
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
            <main className="max-w-[680px] mx-auto px-4 py-6">
                <section
                    className="bg-white border border-[#ECE8E2] rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.06)] p-5"
                >
                    {/* Hero Section */}
                    <div className="text-center pb-6 border-b-2 border-[#f0e9de] mb-6">
                        <h1 className="text-[26px] font-extrabold text-[#284B63] mb-2.5">
                            🎓 Congratulations {firstName} — You&apos;re Almost Officially Certified!
                        </h1>
                        <p className="text-base text-[#5a5146] italic">
                            Sarah here 💚 I&apos;m SO proud of you — 97/100! Just one final step before your diploma is issued.
                        </p>
                    </div>

                    {/* Diploma Box */}
                    <div
                        className="rounded-xl p-5 mb-6 text-center"
                        style={{
                            background: 'linear-gradient(135deg, #FFF9F0 0%, #FFFDF9 100%)',
                            border: '2px solid #EBD0A9',
                        }}
                    >
                        <h2 className="text-xl font-extrabold text-[#C08938] mb-2.5">
                            ✨ How to Receive Your Official Mini Diploma
                        </h2>
                        <p className="text-base text-[#5a5146] mb-4">
                            Please complete these <strong>two quick steps</strong> so we can process and email your certificate within <strong>24–48 hours</strong>:
                        </p>

                        <ol className="list-decimal list-inside text-left max-w-[540px] mx-auto space-y-3.5">
                            <li className="pl-1">
                                <strong className="text-[#2D6A4F]">Step 1:</strong> Leave your honest review clicking the button below! This helps me as a single Mum to improve all I created!
                                <br />
                                <a
                                    href="https://www.trustpilot.com/review/accredipro.academy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-block mt-1.5 px-4 py-2.5 rounded-lg font-bold text-white text-[15px] bg-[#00B67A] hover:bg-[#00A870] transition-colors"
                                >
                                    Trustpilot Review
                                </a>
                            </li>

                            <li className="pl-1">
                                <strong className="text-[#2D6A4F]">Step 2:</strong> Send me a quick message in our <strong>private chat</strong> that says:
                                <br />
                                <em>&quot;Review left ✅&quot;</em>
                                <br />
                                — and your diploma will arrive by email in <strong>24–48 hours</strong>.
                            </li>
                        </ol>

                        <p className="text-sm font-semibold text-[#C08938] mt-4">
                            📧 Remember to check Spam or Promotions folders if you don&apos;t see it after 48 hours.
                        </p>
                    </div>

                    {/* Meanwhile Section */}
                    <div
                        className="rounded-xl p-5 text-center"
                        style={{
                            background: 'linear-gradient(135deg, #F0FFF4 0%, #FFFDF9 100%)',
                            border: '2px solid #CDEFD8',
                        }}
                    >
                        <h2 className="text-xl font-extrabold text-[#2D6A4F] mb-3">
                            Thank You for Being Part of This Journey 💚
                        </h2>
                        <p className="text-base text-[#3C4B5A] mb-4">
                            Your words — even just one sentence — help future students decide if this path is right for them and help me keep improving every class.
                            <br /><br />
                            You&apos;ve worked so hard. Take a deep breath, celebrate, and get ready to add &quot;Certified Health Coach&quot; to your name!
                        </p>
                        <p className="text-[15px] text-[#6B6E76] italic">
                            With pride,<br />Sarah 💚
                        </p>
                    </div>

                    {/* Back to Dashboard Link */}
                    <div className="text-center mt-6">
                        <Link
                            href="/womens-health-diploma"
                            className="text-[#2D6A4F] hover:text-[#1F4F3D] font-medium text-sm"
                        >
                            ← Back to Dashboard
                        </Link>
                    </div>
                </section>
            </main>
        </div>
    );
}
