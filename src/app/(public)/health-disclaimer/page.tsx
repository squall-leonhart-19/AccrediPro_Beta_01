import Link from "next/link";
import { Heart, Mail, Calendar, ArrowLeft, AlertTriangle, Stethoscope, Shield, Ban } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function HealthDisclaimerPage() {
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
                            <Heart className="w-6 h-6 text-gold-400" />
                        </div>
                        <Badge className="bg-gold-400/20 text-gold-300 border-gold-400/30">
                            Legal Disclaimer
                        </Badge>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">Health & Medical Disclaimer</h1>
                    <p className="text-burgundy-100 text-lg mb-4">
                        Important information about the nature of our educational content and its limitations.
                    </p>
                    <div className="flex items-center gap-2 text-burgundy-200 text-sm">
                        <Calendar className="w-4 h-4" />
                        Last Updated: {lastUpdated}
                    </div>
                </div>
            </div>

            {/* Critical Notice */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                        <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-bold text-red-800 mb-2">THIS IS NOT MEDICAL ADVICE</h3>
                            <p className="text-red-700 text-sm leading-relaxed">
                                The information provided through AccrediPro Academy courses, materials, and resources is for educational and informational purposes only. It is NOT intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of a qualified healthcare provider with any questions you may have regarding a medical condition.
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
                                <Stethoscope className="w-6 h-6 text-burgundy-600" />
                                Educational Purpose Only
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                AccrediPro Academy provides educational content about health, wellness, nutrition, and related topics. This information is intended to:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                <li>Educate you about general health and wellness concepts</li>
                                <li>Train you as a health and wellness coach</li>
                                <li>Provide frameworks for supporting clients' wellness goals</li>
                                <li>Share evidence-based approaches to healthy living</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed">
                                This content is <strong>NOT</strong> intended to diagnose, treat, cure, or prevent any disease or medical condition.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Ban className="w-6 h-6 text-burgundy-600" />
                                Not a Substitute for Medical Care
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Our educational content should never be used as a substitute for:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                <li><strong>Professional medical advice</strong> from a licensed physician or healthcare provider</li>
                                <li><strong>Medical diagnosis</strong> of any health condition or disease</li>
                                <li><strong>Medical treatment</strong> or prescribed medications</li>
                                <li><strong>Mental health treatment</strong> from licensed therapists or psychologists</li>
                                <li><strong>Nutritional therapy</strong> from registered dietitians for medical conditions</li>
                                <li><strong>Emergency medical care</strong> - always call 911 for emergencies</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Important Health Warnings</h2>
                            <div className="bg-amber-50 rounded-xl p-6 border border-amber-200 mb-6">
                                <h3 className="font-bold text-amber-800 mb-3">Before Making Any Health Changes:</h3>
                                <ul className="list-disc pl-6 text-amber-700 space-y-2">
                                    <li>Consult with your doctor or qualified healthcare provider</li>
                                    <li>Do not discontinue any prescribed medications without medical supervision</li>
                                    <li>Inform your healthcare provider of any supplements or lifestyle changes</li>
                                    <li>Seek immediate medical attention for any acute symptoms or emergencies</li>
                                    <li>If you are pregnant, nursing, or have a medical condition, consult your doctor first</li>
                                </ul>
                            </div>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">No Doctor-Patient Relationship</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Use of our educational materials does NOT create a doctor-patient relationship, healthcare provider-patient relationship, or any other professional relationship between you and AccrediPro, its instructors, coaches, or staff.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                Our instructors and coaches are educators, not your personal healthcare providers. They cannot:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                <li>Diagnose your medical conditions</li>
                                <li>Prescribe treatments or medications</li>
                                <li>Provide personalized medical advice for your specific situation</li>
                                <li>Replace the care of your personal physician</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Shield className="w-6 h-6 text-burgundy-600" />
                                For Health Coaches and Students
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                If you are training to become a health and wellness coach through our programs:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                <li>You are being trained as a <strong>coach</strong>, not a medical practitioner</li>
                                <li>You must operate within the legal scope of coaching in your jurisdiction</li>
                                <li>You must refer clients to appropriate medical professionals when needed</li>
                                <li>You cannot diagnose, treat, or prescribe for your clients</li>
                                <li>You are responsible for understanding the laws in your area</li>
                                <li>Review our <Link href="/scope-of-practice" className="text-burgundy-600 hover:underline">Scope of Practice</Link> guidelines carefully</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Individual Results Vary</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Health outcomes are highly individual and depend on many factors including:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                <li>Your unique genetics and biology</li>
                                <li>Your existing health conditions</li>
                                <li>Environmental factors</li>
                                <li>Lifestyle and behavioral factors</li>
                                <li>Consistency in implementing changes</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed">
                                Any health improvements described in our materials or testimonials are individual results and should not be expected by all students or clients.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Limitation of Liability</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                AccrediPro Academy, its instructors, coaches, and staff shall not be liable for:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>Any adverse health outcomes resulting from information in our materials</li>
                                <li>Reliance on our educational content for medical decisions</li>
                                <li>Failure to seek appropriate medical care</li>
                                <li>Actions or advice of graduates in their coaching practice</li>
                                <li>Any direct, indirect, incidental, or consequential damages</li>
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
                    <Link href="/scope-of-practice">
                        <Button variant="outline" className="border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50">
                            Scope of Practice
                        </Button>
                    </Link>
                    <Link href="/earnings-disclaimer">
                        <Button variant="outline" className="border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50">
                            Earnings Disclaimer
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
