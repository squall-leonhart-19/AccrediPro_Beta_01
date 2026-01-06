import Link from "next/link";
import { Scale, Mail, Calendar, ArrowLeft, AlertTriangle, CheckCircle, XCircle, Shield, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ScopeOfPracticePage() {
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
                            <Scale className="w-6 h-6 text-gold-400" />
                        </div>
                        <Badge className="bg-gold-400/20 text-gold-300 border-gold-400/30">
                            Professional Guidelines
                        </Badge>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">Scope of Practice</h1>
                    <p className="text-burgundy-100 text-lg mb-4">
                        Understanding what health and wellness coaches can and cannot do legally and ethically.
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
                            <h3 className="font-bold text-amber-800 mb-2">Important for All Students and Graduates</h3>
                            <p className="text-amber-700 text-sm leading-relaxed">
                                Understanding your scope of practice is essential for operating legally and ethically. Health and wellness coaching is a distinct profession from medical practice, therapy, and counseling. This document clarifies the boundaries.
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
                                <Shield className="w-6 h-6 text-burgundy-600" />
                                What Is a Health and Wellness Coach?
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                A health and wellness coach is a trained professional who partners with clients to facilitate and empower lasting lifestyle and behavior changes in alignment with their values and vision of health.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                Health coaches support clients in taking action toward health goals, provide accountability, and help navigate obstacles. They do NOT diagnose conditions, prescribe treatments, or provide therapy.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                                What Coaches CAN Do
                            </h2>
                            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                                <ul className="list-disc pl-6 text-green-800 space-y-2">
                                    <li><strong>Provide education</strong> about general health and wellness topics</li>
                                    <li><strong>Facilitate goal-setting</strong> and help clients clarify their health vision</li>
                                    <li><strong>Support behavior change</strong> through accountability and motivation</li>
                                    <li><strong>Share general information</strong> about nutrition, exercise, sleep, and stress management</li>
                                    <li><strong>Help clients develop action plans</strong> for lifestyle modifications</li>
                                    <li><strong>Provide encouragement</strong> and celebrate progress and milestones</li>
                                    <li><strong>Ask powerful questions</strong> that promote self-discovery</li>
                                    <li><strong>Refer to other professionals</strong> when appropriate</li>
                                    <li><strong>Share recipes, meal ideas, and wellness resources</strong></li>
                                    <li><strong>Teach stress management techniques</strong> like breathing exercises</li>
                                    <li><strong>Help track progress</strong> toward client-defined goals</li>
                                    <li><strong>Support clients in implementing doctor's recommendations</strong></li>
                                </ul>
                            </div>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <XCircle className="w-6 h-6 text-red-600" />
                                What Coaches CANNOT Do
                            </h2>
                            <div className="bg-red-50 rounded-xl p-6 border border-red-200 mb-4">
                                <ul className="list-disc pl-6 text-red-800 space-y-2">
                                    <li><strong>Diagnose</strong> any disease, illness, or medical condition</li>
                                    <li><strong>Prescribe</strong> medications, supplements, or specific treatments</li>
                                    <li><strong>Provide medical nutrition therapy</strong> for diseases (e.g., diabetes management)</li>
                                    <li><strong>Treat</strong> eating disorders, mental health conditions, or addictions</li>
                                    <li><strong>Provide psychotherapy, counseling, or psychological treatment</strong></li>
                                    <li><strong>Interpret lab results</strong> or medical tests</li>
                                    <li><strong>Recommend stopping prescribed medications</strong></li>
                                    <li><strong>Claim to cure, heal, or treat</strong> any condition</li>
                                    <li><strong>Perform physical assessments</strong> or medical examinations</li>
                                    <li><strong>Use protected titles</strong> (doctor, nutritionist, dietitian, therapist) unless licensed</li>
                                    <li><strong>Practice beyond their training</strong> or certification scope</li>
                                </ul>
                            </div>
                            <p className="text-gray-700 text-sm italic">
                                Note: Some activities may be permissible in certain jurisdictions or with additional training/licensure. Always verify the laws in your specific location.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Users className="w-6 h-6 text-burgundy-600" />
                                When to Refer Clients
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                A responsible coach knows when to refer clients to appropriate professionals. Always refer when a client:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                <li>Describes symptoms that may indicate a medical condition</li>
                                <li>Has not seen a doctor for concerning health issues</li>
                                <li>Shows signs of disordered eating or eating disorders</li>
                                <li>Expresses suicidal thoughts or severe depression</li>
                                <li>Needs specific medical nutrition therapy</li>
                                <li>Requires psychological or psychiatric care</li>
                                <li>Has complex chronic conditions requiring medical oversight</li>
                                <li>Asks for advice outside your scope of knowledge</li>
                            </ul>
                            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                                <h3 className="font-bold text-blue-800 mb-2">When in doubt, refer out.</h3>
                                <p className="text-blue-700 text-sm">
                                    It is always better to refer a client to a qualified professional than to risk harm by operating outside your scope. Build a network of trusted professionals you can refer to.
                                </p>
                            </div>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Legal Considerations</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Health and wellness coaching regulations vary by jurisdiction. As a coach, you must:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                <li><strong>Research your local laws</strong> - Some states/countries may require additional licensing</li>
                                <li><strong>Use appropriate language</strong> - Avoid terms like "treat," "cure," "heal," or "prescribe"</li>
                                <li><strong>Carry liability insurance</strong> - Protect yourself and your practice</li>
                                <li><strong>Use client agreements</strong> - Clearly define your services and limitations</li>
                                <li><strong>Document thoroughly</strong> - Keep records of sessions and referrals</li>
                                <li><strong>Stay within your training</strong> - Only offer services you're qualified to provide</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Working with Healthcare Providers</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                The best client outcomes often come from collaboration. As a coach, you should:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>Encourage clients to maintain relationships with their healthcare providers</li>
                                <li>Support clients in following their doctor's recommendations</li>
                                <li>Request permission to communicate with a client's healthcare team when appropriate</li>
                                <li>Never contradict or undermine medical advice</li>
                                <li>Be transparent about your role as a coach vs. medical provider</li>
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
                    <Link href="/code-of-ethics">
                        <Button variant="outline" className="border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50">
                            Code of Ethics
                        </Button>
                    </Link>
                    <Link href="/health-disclaimer">
                        <Button variant="outline" className="border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50">
                            Health Disclaimer
                        </Button>
                    </Link>
                    <Link href="/credential-terms">
                        <Button variant="outline" className="border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50">
                            Credential Terms
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
