import Link from "next/link";
import { Award, Mail, Calendar, ArrowLeft, AlertTriangle, CheckCircle, XCircle, Shield, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function CredentialTermsPage() {
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
                            <Award className="w-6 h-6 text-gold-400" />
                        </div>
                        <Badge className="bg-gold-400/20 text-gold-300 border-gold-400/30">
                            Certification Terms
                        </Badge>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">Credential Terms & Conditions</h1>
                    <p className="text-burgundy-100 text-lg mb-4">
                        Terms governing the use of AccrediPro certifications and credentials.
                    </p>
                    <div className="flex items-center gap-2 text-burgundy-200 text-sm">
                        <Calendar className="w-4 h-4" />
                        Last Updated: {lastUpdated}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-12">
                <Card className="border-0 shadow-lg">
                    <CardContent className="p-8 md:p-12 prose prose-burgundy max-w-none">

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Award className="w-6 h-6 text-burgundy-600" />
                                About AccrediPro Certifications
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                AccrediPro Academy certifications represent completion of our educational training programs. These are private, educational credentials signifying that the holder has successfully completed the required coursework and assessments.
                            </p>
                            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                                <h3 className="font-bold text-blue-800 mb-2">Nature of Credential</h3>
                                <p className="text-blue-700 text-sm">
                                    AccrediPro certifications are educational credentials, not professional licenses. They do not grant the legal authority to practice medicine, counseling, therapy, or any licensed profession. Graduates must comply with all applicable laws and regulations in their jurisdiction.
                                </p>
                            </div>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                                Requirements for Certification
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                To earn and maintain an AccrediPro certification, you must:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li><strong>Complete all required coursework</strong> as verified by our learning management system</li>
                                <li><strong>Pass the certification exam</strong> with a minimum passing score</li>
                                <li><strong>Complete all required assignments and assessments</strong></li>
                                <li><strong>Agree to abide by our Code of Ethics</strong></li>
                                <li><strong>Maintain good standing</strong> with AccrediPro Academy</li>
                                <li><strong>Operate within the defined scope of practice</strong></li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText className="w-6 h-6 text-burgundy-600" />
                                Permitted Use of Credentials
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Upon successful certification, you may:
                            </p>
                            <div className="bg-green-50 rounded-xl p-6 border border-green-200 mb-4">
                                <ul className="list-disc pl-6 text-green-800 space-y-2">
                                    <li>Display your digital certificate on your website and social media</li>
                                    <li>Include your certification title on business cards and marketing materials</li>
                                    <li>Reference your training from AccrediPro Academy</li>
                                    <li>Use approved credential designations after your name (e.g., "Certified Functional Medicine Practitioner")</li>
                                    <li>Share your certificate with potential clients or employers</li>
                                    <li>Include certification details on your resume/CV</li>
                                </ul>
                            </div>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <XCircle className="w-6 h-6 text-red-600" />
                                Prohibited Uses
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                You may NOT:
                            </p>
                            <div className="bg-red-50 rounded-xl p-6 border border-red-200 mb-4">
                                <ul className="list-disc pl-6 text-red-800 space-y-2">
                                    <li>Claim to be a medical doctor, licensed nutritionist, licensed therapist, or other licensed professional unless separately licensed</li>
                                    <li>Imply that your certification grants you medical authority</li>
                                    <li>Use the certification to diagnose, treat, or prescribe</li>
                                    <li>Transfer, sell, or share your certification with others</li>
                                    <li>Alter, forge, or misrepresent your certificate</li>
                                    <li>Continue using credentials if your certification is revoked or suspended</li>
                                    <li>Misrepresent the nature or scope of your training</li>
                                </ul>
                            </div>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Shield className="w-6 h-6 text-burgundy-600" />
                                Revocation of Certification
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                AccrediPro reserves the right to revoke or suspend certification for:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                <li>Violation of the Code of Ethics</li>
                                <li>Practicing outside the defined scope of practice</li>
                                <li>Misrepresentation of credentials or qualifications</li>
                                <li>Fraud, dishonesty, or unethical conduct</li>
                                <li>Legal violations related to coaching practice</li>
                                <li>Actions that bring disrepute to AccrediPro Academy</li>
                                <li>Initiating a chargeback or payment dispute after certification</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed">
                                Upon revocation, you must immediately cease using all AccrediPro credentials, titles, and materials.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Verification</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                AccrediPro maintains records of all certified graduates. Third parties may request verification of credentials by contacting us with the graduate's name and email address. We will confirm:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>Whether the individual holds an active certification</li>
                                <li>The name of the certification program</li>
                                <li>The date of certification</li>
                                <li>Whether the certification is in good standing</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Lifetime Access</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Your certification, once earned, does not expire and does not require renewal fees. However, maintaining good standing and compliance with these terms is required to continue using your credentials.
                            </p>
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
                    <Link href="/trademark-usage">
                        <Button variant="outline" className="border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50">
                            Trademark Usage
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
