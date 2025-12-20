"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    CheckCircle2,
    ArrowRight,
    Star,
    Award,
    Users,
    Zap,
    ShieldCheck,
    Clock,
    ChevronDown,
    Play
} from "lucide-react";
import { CreditScoreQualification } from "@/components/fm-mini-diploma/CreditScoreQualification";
import { motion } from "framer-motion";

export default function FMMiniDiplomaLeadGen() {
    const [spotsLeft, setSpotsLeft] = useState(12);

    useEffect(() => {
        const interval = setInterval(() => {
            setSpotsLeft((prev) => (prev > 3 ? prev - 1 : prev));
        }, 45000);
        return () => clearInterval(interval);
    }, []);

    const stories = [
        {
            name: "Jamie",
            role: "Registered Nurse",
            text: "I have prayed for signs. I believe this is my answered prayer. I followed western medicine guidance for years, but I knew I wasn't healing myself. This certification feels like the next step in a very long journey.",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jamie"
        },
        {
            name: "Karyne",
            role: "Health Coach",
            text: "Through diet and lifestyle changes, I've been able to significantly improve my lab results. This program feels like the perfect next step—a structured way to expand my knowledge.",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karyne"
        },
        {
            name: "Diane",
            role: "Retired Nurse",
            text: "I am a retired nurse of 40 years. I wanted something on my terms, not to be so selfish. Your introduction was very interesting. I love to evaluate and analyze things.",
            avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Diane"
        }
    ];

    return (
        <div className="min-h-screen bg-[#FAF9F6] text-gray-900 font-sans selection:bg-burgundy-100 selection:text-burgundy-900">
            {/* Dynamic Urgency Bar */}
            <div className="bg-gray-900 text-white py-3 px-4 text-center text-sm font-medium sticky top-0 z-[60]">
                <span className="inline-flex items-center gap-2">
                    <Zap className="w-4 h-4 text-gold-400 fill-gold-400 animate-pulse" />
                    <span>ALMOST FULL: Only <strong>{spotsLeft} Qualification Spots</strong> left for the January Cohort.</span>
                </span>
            </div>

            {/* Hero Section - The "Hormozi" Hook */}
            <header className="relative pt-16 pb-24 overflow-hidden border-b border-gray-100">
                <div className="absolute inset-0 bg-gradient-to-b from-burgundy-50/50 to-transparent -z-10" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-burgundy-100 text-burgundy-700 font-bold text-sm mb-8 shadow-sm"
                    >
                        <ShieldCheck className="w-4 h-4" />
                        UNMATCHED CREDIBILITY: 9 INTERNATIONAL ACCREDITATIONS
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-8 leading-[1.1]"
                    >
                        Build a <span className="text-burgundy-600">$100k+ Functional Medicine</span> <br className="hidden md:block" />
                        Practice Without a Doctorate.
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed"
                    >
                        Stop being a "cog in the machine." Learn how to identify root-causes and build a freedom-based career using our <strong>Credit Score Targeting™</strong> method.
                    </motion.p>

                    <div className="grid lg:grid-cols-2 gap-12 items-start mt-16 max-w-6xl mx-auto">
                        {/* The VSL / Hook Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 }}
                            className="relative aspect-video bg-gray-900 rounded-3xl overflow-hidden shadow-2xl group cursor-pointer"
                        >
                            <Image
                                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80"
                                alt="Sarah Mitchell Coaching"
                                fill
                                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                                <div className="w-20 h-20 bg-burgundy-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition shadow-xl">
                                    <Play className="w-8 h-8 fill-white ml-1" />
                                </div>
                                <h3 className="text-2xl font-bold text-center">Watch Sarah's Story: The Path to $10k/Month</h3>
                            </div>
                        </motion.div>

                        {/* The Qualification Form - The Primary Goal */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 }}
                        >
                            <CreditScoreQualification />
                        </motion.div>
                    </div>
                </div>
            </header>

            {/* Social Proof - Student Stories Cluster */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6 italic">Why 4,800+ Students Chose This Path...</h2>
                        <div className="flex justify-center gap-1 mb-8">
                            {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-8 h-8 text-gold-400 fill-gold-400" />)}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {stories.map((story, i) => (
                            <motion.div
                                key={i}
                                whileHover={{ y: -5 }}
                                className="bg-[#FAF9F6] p-8 rounded-3xl border border-gray-100 shadow-sm relative"
                            >
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md">
                                        <Image src={story.avatar} alt={story.name} fill />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{story.name}</h4>
                                        <p className="text-burgundy-600 text-sm font-bold">{story.role}</p>
                                    </div>
                                </div>
                                <p className="text-gray-600 italic leading-relaxed">"{story.text}"</p>
                                <div className="absolute top-8 right-8 text-6xl text-gray-100 font-serif leading-none">"</div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* The "Hormozi" Stack - What You Get */}
            <section className="py-24 bg-gray-900 text-white overflow-hidden">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
                                The Most High-Value <br />
                                <span className="text-burgundy-400">Low-Entry</span> Offer in FM.
                            </h2>
                            <p className="text-xl text-gray-400 leading-relaxed">
                                We've spent 10 years and $1M+ perfecting the curriculum so you don't have to.
                                This isn't just a certificate; it's a turnkey business model.
                            </p>

                            <div className="space-y-4">
                                {[
                                    "Level 1: Clinical Foundations Certification",
                                    "Level 2: Advanced Hormone Scaling Protocols",
                                    "Level 3: The 0% Interest Patient Funding System",
                                    "The $10k/Month Client Acquisition Blueprint",
                                    "Lifetime Access to the Student Community"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <CheckCircle2 className="w-6 h-6 text-green-400 shrink-0" />
                                        <span className="font-bold text-lg">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="relative">
                            <div className="absolute inset-0 bg-burgundy-600/20 blur-[120px] rounded-full" />
                            <div className="relative bg-white/5 border border-white/10 p-8 rounded-[40px] backdrop-blur-xl">
                                <div className="bg-gradient-to-br from-gold-400 to-gold-600 text-black p-6 rounded-3xl text-center mb-8">
                                    <p className="text-sm font-bold uppercase tracking-widest mb-1">Total Package Value</p>
                                    <p className="text-5xl font-black">$4,997.00</p>
                                </div>
                                <div className="space-y-6 text-center">
                                    <p className="text-2xl font-bold">Apply Today To See If You Qualify For Scholarship Pricing</p>
                                    <Button
                                        className="w-full h-16 text-xl bg-burgundy-600 hover:bg-burgundy-700 font-black shadow-xl shadow-burgundy-900/40"
                                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    >
                                        START QUALIFICATION <ArrowRight className="w-6 h-6 ml-2" />
                                    </Button>
                                    <p className="text-sm text-gray-500 font-medium">No Credit Card Required to Apply</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trust & Accreditation Cluster */}
            <section className="py-16 bg-white border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-8">Internationally Recognized By</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="font-black text-2xl tracking-tighter">ICF</div>
                        <div className="font-black text-2xl tracking-tighter">IHCAN</div>
                        <div className="font-black text-2xl tracking-tighter">CPD</div>
                        <div className="font-black text-2xl tracking-tighter">ANSI</div>
                        <div className="font-black text-2xl tracking-tighter">ACC</div>
                    </div>
                </div>
            </section>

            {/* Sticky Mobile CTA */}
            <div className="fixed bottom-6 left-6 right-6 z-[60] md:hidden">
                <Button
                    className="w-full h-14 bg-burgundy-600 text-lg font-bold shadow-2xl rounded-2xl"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                >
                    Qualify to Enroll <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </div>

            <footer className="py-12 bg-gray-50 border-t border-gray-100 text-center text-gray-400 text-sm">
                <div className="max-w-7xl mx-auto px-4">
                    <p className="mb-4">© 2025 AccrediPro Academy. All Rights Reserved.</p>
                    <div className="flex justify-center gap-6">
                        <Link href="/privacy" className="hover:text-burgundy-600">Privacy Policy</Link>
                        <Link href="/terms" className="hover:text-burgundy-600">Terms of Service</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
