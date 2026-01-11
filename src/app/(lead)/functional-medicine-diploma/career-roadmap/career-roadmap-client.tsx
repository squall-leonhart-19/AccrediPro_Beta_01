"use client";

import Link from "next/link";
import { MessageCircle, Award, TrendingUp, ArrowRight, CheckCircle, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CareerRoadmapClientProps {
    firstName: string;
}

export function CareerRoadmapClient({ firstName }: CareerRoadmapClientProps) {
    return (
        <div
            className="min-h-screen flex items-center justify-center p-4"
            style={{
                fontFamily: '"IBM Plex Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
                background: 'linear-gradient(135deg, #FFFAF7 0%, #FFF5F0 100%)',
            }}
        >
            <div className="max-w-md w-full">
                <div
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                    style={{ boxShadow: '0 12px 40px rgba(0,0,0,.08)' }}
                >
                    {/* Eligibility Badge */}
                    <div className="bg-gradient-to-r from-burgundy-600 to-burgundy-700 p-4 text-center">
                        <div className="flex items-center justify-center gap-2 text-gold-400 font-bold text-sm">
                            <CheckCircle className="w-4 h-4" />
                            <span>YOU'RE NOW ELIGIBLE</span>
                        </div>
                        <p className="text-burgundy-200 text-xs mt-1">
                            Mini Diploma graduates qualify for the full career path
                        </p>
                    </div>

                    <div className="p-6 md:p-8 text-center">
                        {/* Icon */}
                        <div className="w-16 h-16 mx-auto bg-gold-100 rounded-full flex items-center justify-center mb-5">
                            <TrendingUp className="w-8 h-8 text-gold-600" />
                        </div>

                        {/* Heading */}
                        <h1 className="text-2xl md:text-[28px] font-extrabold text-burgundy-700 mb-3">
                            Ready for $10-15K+/Month?
                        </h1>

                        {/* Subhead */}
                        <p className="text-gray-600 mb-5">
                            {firstName}, as a Mini Diploma graduate, you now qualify for the <strong className="text-burgundy-600">ASI Board Certified</strong> practitioner path.
                        </p>

                        {/* What you qualify for */}
                        <div className="bg-burgundy-50 rounded-xl p-4 mb-5 text-left">
                            <p className="text-xs font-bold text-burgundy-700 uppercase tracking-wider mb-3">
                                What you're now eligible for:
                            </p>
                            <div className="space-y-2.5">
                                <div className="flex items-start gap-3">
                                    <Award className="w-5 h-5 text-burgundy-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">Board Certification (BC-FMP™)</p>
                                        <p className="text-xs text-gray-500">Highest ASI credential</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Shield className="w-5 h-5 text-burgundy-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">Income Guarantee</p>
                                        <p className="text-xs text-gray-500">$10K/mo or we work free until you do</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <TrendingUp className="w-5 h-5 text-burgundy-500 flex-shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">Free Personalized Roadmap</p>
                                        <p className="text-xs text-gray-500">Your path to $10-15K+/month</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <Link href="/womens-health-diploma/chat">
                            <Button
                                size="lg"
                                className="w-full h-14 bg-burgundy-600 hover:bg-burgundy-700 text-white font-bold text-lg rounded-xl"
                            >
                                <MessageCircle className="w-5 h-5 mr-2" />
                                Get My Free Roadmap
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </Button>
                        </Link>

                        <p className="text-xs text-gray-400 mt-4">
                            Chat with Sarah — she'll create your personalized plan 💚
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
