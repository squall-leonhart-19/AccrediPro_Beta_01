"use client";

import Link from "next/link";

export default function ThankYouPage() {
    return (
        <div
            className="min-h-screen"
            style={{
                background: "#FFFAF7",
                fontFamily: '"IBM Plex Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
            }}
        >
            <main className="max-w-[800px] mx-auto px-6 py-8">
                <div
                    className="rounded-2xl p-8 text-center"
                    style={{
                        background: "#FFFFFF",
                        border: "1px solid #ECE8E2",
                        boxShadow: "0 14px 34px rgba(0,0,0,.08)",
                    }}
                >
                    {/* Main Headline */}
                    <h1
                        className="text-3xl md:text-4xl font-bold mb-4"
                        style={{ color: "#284B63" }}
                    >
                        🎉 Hi beautiful soul — You&apos;re In!
                    </h1>

                    <p className="text-base mb-6 max-w-[640px] mx-auto" style={{ color: "#1F2432" }}>
                        I&apos;m Sarah 💕 and I just want to say how proud I am of you. You&apos;ve officially enrolled in the{" "}
                        <strong>Free 3-Day Mini Diploma in Functional Medicine</strong> — this is the first step toward something amazing.
                    </p>

                    {/* Vimeo Video */}
                    <div className="my-8 max-w-[640px] mx-auto">
                        <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
                            <iframe
                                src="https://player.vimeo.com/video/1117011197?badge=0&autopause=0&player_id=0&app_id=58479"
                                frameBorder="0"
                                allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                                referrerPolicy="strict-origin-when-cross-origin"
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    borderRadius: "12px",
                                    boxShadow: "0 8px 20px rgba(0,0,0,.15)",
                                }}
                                title="Welcome Message from Sarah"
                            />
                        </div>
                        <p className="text-sm mt-3" style={{ color: "#6B6E76" }}>
                            🎥 Watch this short welcome message from me before you dive in!
                        </p>
                    </div>

                    {/* What Happens Next */}
                    <h2 className="text-xl font-bold mb-4" style={{ color: "#C89A5B" }}>
                        Here&apos;s what happens next
                    </h2>

                    <ul
                        className="text-left max-w-[560px] mx-auto space-y-3 mb-6"
                        style={{ color: "#1F2432" }}
                    >
                        <li>📩 <strong>Your portal is ready</strong> — log in now to access Day 1 immediately.</li>
                        <li>🌱 Each day for the next 3 days, a new module will unlock for you.</li>
                        <li>🎓 At the end, you&apos;ll download your <strong>official Mini Diploma certificate</strong>.</li>
                    </ul>

                    {/* Certificate Preview */}
                    <div className="my-6">
                        <div
                            className="max-w-[400px] mx-auto rounded-xl p-6 text-center"
                            style={{
                                background: "linear-gradient(135deg, #722F37 0%, #8B3A42 100%)",
                                boxShadow: "0 10px 24px rgba(114,47,55,.25)",
                            }}
                        >
                            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: "#D4AF37" }}>
                                Certificate Preview
                            </p>
                            <p className="text-lg font-bold text-white mb-1">
                                Mini Diploma in Functional Medicine
                            </p>
                            <p className="text-sm text-white opacity-80">
                                Awarded to: <em>Your Name Here</em>
                            </p>
                            <div className="flex justify-center gap-4 mt-4">
                                {["CMA", "IPHM", "IAOTH", "CPD"].map((badge) => (
                                    <span
                                        key={badge}
                                        className="px-2 py-1 rounded text-xs font-bold"
                                        style={{ background: "rgba(212,175,55,0.2)", color: "#D4AF37" }}
                                    >
                                        {badge}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <p className="text-sm mt-3" style={{ color: "#6B6E76" }}>
                            Imagine your name here in just 72 hours 🎓
                        </p>
                    </div>

                    {/* Quick Tip */}
                    <h2 className="text-xl font-bold mb-3" style={{ color: "#C89A5B" }}>
                        Quick tip from me 💌
                    </h2>
                    <p className="text-sm mb-6 max-w-[560px] mx-auto" style={{ color: "#1F2432" }}>
                        Check your email for login credentials — if you don&apos;t see it within 5 minutes, check Promotions or Spam, then drag it into Primary so you won&apos;t miss the lessons or your certificate.
                    </p>

                    {/* Primary CTA */}
                    <Link
                        href="/login"
                        className="inline-block px-8 py-4 rounded-full font-black text-white text-lg transition-all hover:opacity-90"
                        style={{
                            background: "#2D6A4F",
                            boxShadow: "0 14px 34px rgba(45,106,79,.25)",
                        }}
                    >
                        Access Your Free Mini-Diploma Now →
                    </Link>

                    {/* Looking Ahead */}
                    <div className="mt-8 pt-6 border-t" style={{ borderColor: "#ECE8E2" }}>
                        <h2 className="text-xl font-bold mb-3" style={{ color: "#C89A5B" }}>
                            Looking ahead
                        </h2>
                        <p className="text-sm max-w-[560px] mx-auto" style={{ color: "#1F2432" }}>
                            This Mini Diploma is just the beginning. Many women continue on to the full{" "}
                            <strong>Functional Medicine Practitioner Certification</strong> — where they start helping clients and building their new career.
                            <br /><br />
                            But for now, focus on completing these 3 days. I&apos;ll be with you every step of the way 💕
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <p className="text-center text-sm mt-8" style={{ color: "#777" }}>
                    © Sarah • AccrediPro Academy • Questions?{" "}
                    <a href="mailto:info@accredipro.academy" className="underline">
                        info@accredipro.academy
                    </a>
                </p>
            </main>
        </div>
    );
}
