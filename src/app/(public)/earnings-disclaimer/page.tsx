import Link from "next/link";
import { DollarSign, Mail, Calendar, ArrowLeft, AlertTriangle, TrendingUp, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function EarningsDisclaimerPage() {
    const lastUpdated = "January 7, 2025";

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Hero Header */}
            <div className="bg-gradient-to-br from-burgundy-700 via-burgundy-600 to-burgundy-800 text-white">
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <Link href="/" className="inline-flex items-center gap-2 text-burgundy-200 hover:text-white mb-6 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to AccrediPro
                    </Link>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center border border-white/20">
                            <DollarSign className="w-6 h-6 text-gold-400" />
                        </div>
                        <Badge className="bg-gold-400/20 text-gold-300 border-gold-400/30">
                            Legal Disclaimer
                        </Badge>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">Earnings Disclaimer</h1>
                    <p className="text-burgundy-100 text-lg mb-4">
                        Important information about income claims and financial expectations.
                    </p>
                    <div className="flex items-center gap-2 text-burgundy-200 text-sm">
                        <Calendar className="w-4 h-4" />
                        Last Updated: {lastUpdated}
                    </div>
                </div>
            </div>

            {/* Important Notice */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-bold text-amber-800 mb-2">FTC Compliance Notice</h3>
                            <p className="text-amber-700 text-sm leading-relaxed">
                                This disclaimer is provided in compliance with the Federal Trade Commission (FTC) guidelines regarding income claims and testimonials. We believe in transparency and want you to make informed decisions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 pb-12">
                <Card className="border-0 shadow-lg">
                    <CardContent className="p-8 md:p-12 prose prose-burgundy max-w-none">

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Target className="w-6 h-6 text-burgundy-600" />
                                No Earnings Guarantees
                            </h2>
                            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 mb-6">
                                <p className="text-red-800 font-bold text-lg mb-2">
                                    RESULTS ARE NOT TYPICAL. YOUR RESULTS MAY VARY.
                                </p>
                                <p className="text-red-700 text-sm">
                                    AccrediPro Academy makes NO guarantees regarding income, earnings, or financial success. Any income examples, testimonials, or success stories shared are exceptional results and are not intended to represent or guarantee that anyone will achieve the same or similar results.
                                </p>
                            </div>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <TrendingUp className="w-6 h-6 text-burgundy-600" />
                                Factors Affecting Success
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Your success as a health and wellness coach depends on numerous factors that are unique to you, including but not limited to:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                <li><strong>Your work ethic and dedication</strong> - Success requires consistent effort over time</li>
                                <li><strong>Your existing skills and experience</strong> - Prior knowledge can accelerate results</li>
                                <li><strong>Your local market conditions</strong> - Demand varies by location and niche</li>
                                <li><strong>Your marketing and business skills</strong> - Client acquisition requires business acumen</li>
                                <li><strong>Your financial resources</strong> - Starting a business may require capital investment</li>
                                <li><strong>Your network and connections</strong> - Referrals significantly impact growth</li>
                                <li><strong>Economic conditions</strong> - Market factors outside your control</li>
                                <li><strong>Your time investment</strong> - Part-time vs. full-time commitment affects outcomes</li>
                                <li><strong>Your pricing strategy</strong> - How you position your services matters</li>
                                <li><strong>Your geographic location</strong> - Some markets are more favorable than others</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Income Claims</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                When we share income examples or testimonials from our students:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                <li>These represent individual results and are <strong>NOT typical</strong></li>
                                <li>We cannot and do not guarantee you will duplicate these results</li>
                                <li>The average person who purchases any "how-to" information gets little to no results</li>
                                <li>Many students do not even complete the training or take action</li>
                                <li>Income figures shown are gross revenue, not net profit</li>
                                <li>Past performance is not indicative of future results</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Education, Not Income Opportunity</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                AccrediPro Academy is an educational institution providing training and certification in health and wellness coaching. We are <strong>NOT</strong>:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                <li>A business opportunity, franchise, or multi-level marketing company</li>
                                <li>Promising employment or guaranteed income</li>
                                <li>Suggesting you will earn any specific amount</li>
                                <li>Implying that certification alone creates a successful business</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed">
                                Our courses provide education and credentials. What you do with that education—and whether you succeed financially—depends entirely on your own actions, decisions, and circumstances.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Testimonials and Examples</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Any testimonials, success stories, or income examples on our website, social media, emails, or marketing materials:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>Are real results from real students (unless otherwise noted)</li>
                                <li>Represent extraordinary results, not average outcomes</li>
                                <li>Should not be considered as promises of what you will achieve</li>
                                <li>May have received compensation or special incentives</li>
                                <li>May not reflect the typical student experience</li>
                                <li>Are not verified or substantiated in all cases</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Responsibility</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                By purchasing our courses, you acknowledge and agree that:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>You are solely responsible for your own success or failure</li>
                                <li>You will not rely on any income projections or examples as guarantees</li>
                                <li>You understand building a business involves risk and uncertainty</li>
                                <li>You have conducted your own due diligence before enrolling</li>
                                <li>You will not hold AccrediPro liable for your financial outcomes</li>
                            </ul>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Mail className="w-6 h-6 text-burgundy-600" />
                                Questions?
                            </h2>
                            <div className="bg-burgundy-50 rounded-xl p-6 border border-burgundy-100">
                                <p className="text-gray-900 font-semibold mb-2">AccrediPro Academy</p>
                                <p className="text-gray-700">
                                    Email: <a href="mailto:info@accredipro.academy" className="text-burgundy-600 hover:underline font-medium">info@accredipro.academy</a>
                                </p>
                            </div>
                        </section>

                    </CardContent>
                </Card>

                {/* Related Links */}
                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                    <Link href="/terms-of-service">
                        <Button variant="outline" className="border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50">
                            Terms of Service
                        </Button>
                    </Link>
                    <Link href="/health-disclaimer">
                        <Button variant="outline" className="border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50">
                            Health Disclaimer
                        </Button>
                    </Link>
                    <Link href="/scope-of-practice">
                        <Button variant="outline" className="border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50">
                            Scope of Practice
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
