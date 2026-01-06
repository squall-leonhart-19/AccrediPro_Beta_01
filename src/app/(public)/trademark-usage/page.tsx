import Link from "next/link";
import { Stamp, Mail, Calendar, ArrowLeft, AlertTriangle, CheckCircle, XCircle, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TrademarkUsagePage() {
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
                            <Stamp className="w-6 h-6 text-gold-400" />
                        </div>
                        <Badge className="bg-gold-400/20 text-gold-300 border-gold-400/30">
                            Brand Guidelines
                        </Badge>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-3">Trademark Usage Guidelines</h1>
                    <p className="text-burgundy-100 text-lg mb-4">
                        How graduates and partners may use the AccrediPro name and branding.
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
                                <Shield className="w-6 h-6 text-burgundy-600" />
                                Our Trademarks
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                The following are trademarks of AccrediPro LLC:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                <li><strong>AccrediPro®</strong></li>
                                <li><strong>AccrediPro Academy®</strong></li>
                                <li>The AccrediPro logo and visual identity</li>
                                <li>Certification program names (e.g., "Certified Functional Medicine Practitioner™")</li>
                                <li>Course titles and curriculum content</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed">
                                These marks are protected by trademark law. Unauthorized use may result in legal action.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                                Permitted Uses (Certified Graduates)
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                If you are a certified graduate in good standing, you may:
                            </p>
                            <div className="bg-green-50 rounded-xl p-6 border border-green-200 mb-4">
                                <ul className="list-disc pl-6 text-green-800 space-y-2">
                                    <li>State that you are "Certified by AccrediPro Academy"</li>
                                    <li>Display your official digital certificate</li>
                                    <li>Use your certification title (e.g., "Certified Holistic Nutrition Coach")</li>
                                    <li>Include statements like "Graduate of AccrediPro Academy" on your website</li>
                                    <li>Link to AccrediPro Academy's website</li>
                                    <li>Share your certification on social media</li>
                                </ul>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Proper Attribution Examples:</h3>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>✅ "Jane Smith, Certified Functional Medicine Practitioner (AccrediPro)"</li>
                                <li>✅ "Certified by AccrediPro Academy | learn.accredipro.academy"</li>
                                <li>✅ "Holding a certification in Holistic Nutrition from AccrediPro Academy"</li>
                            </ul>
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
                                    <li>Use "AccrediPro" in your business name or domain name</li>
                                    <li>Create logos or graphics that incorporate our trademarks</li>
                                    <li>Imply partnership, sponsorship, or affiliation beyond being a graduate</li>
                                    <li>Modify or alter our logos or visual identity</li>
                                    <li>Use our trademarks in advertising without prior written approval</li>
                                    <li>Sell products or services using our branding</li>
                                    <li>Register domain names containing our trademarks</li>
                                    <li>Create social media handles that could be confused with official accounts</li>
                                </ul>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Improper Use Examples:</h3>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>❌ "AccrediPro Wellness Center" (using our name in business name)</li>
                                <li>❌ "accredipro-coaching.com" (using our trademark in domain)</li>
                                <li>❌ "@AccrediProJaneSmith" (creating confusing social handles)</li>
                                <li>❌ Using our logo on your business cards without permission</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Logo Usage</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                The AccrediPro logo may only be used:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                                <li>By certified graduates displaying their official certificate</li>
                                <li>With prior written permission from AccrediPro LLC</li>
                                <li>In accordance with our brand guidelines</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed">
                                To request permission for logo usage, please email <a href="mailto:info@accredipro.academy" className="text-burgundy-600 hover:underline">info@accredipro.academy</a> with details of your intended use.
                            </p>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Social Media Guidelines</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                When posting about your AccrediPro certification on social media:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>Tag our official accounts when appropriate</li>
                                <li>Use hashtags like #AccrediProGraduate or #AccrediProCertified</li>
                                <li>Be honest and accurate about your certification</li>
                                <li>Do not create accounts that could be confused with official AccrediPro accounts</li>
                                <li>Do not speak on behalf of AccrediPro without authorization</li>
                            </ul>
                        </section>

                        <section className="mb-10">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-6 h-6 text-amber-600" />
                                Enforcement
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                AccrediPro actively protects its trademarks. Violations may result in:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>Cease and desist notices</li>
                                <li>Revocation of certification</li>
                                <li>Legal action for trademark infringement</li>
                                <li>Damages and attorney's fees</li>
                            </ul>
                        </section>

                        <section className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <Mail className="w-6 h-6 text-burgundy-600" />
                                Permission Requests
                            </h2>
                            <div className="bg-burgundy-50 rounded-xl p-6 border border-burgundy-100">
                                <p className="text-gray-900 font-semibold mb-2">For trademark usage inquiries:</p>
                                <p className="text-gray-700">
                                    Email: <a href="mailto:info@accredipro.academy" className="text-burgundy-600 hover:underline font-medium">info@accredipro.academy</a>
                                </p>
                                <p className="text-gray-500 text-sm mt-2">
                                    Please include your name, certification status, and detailed description of intended use.
                                </p>
                            </div>
                        </section>

                    </CardContent>
                </Card>

                {/* Related Links */}
                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                    <Link href="/credential-terms">
                        <Button variant="outline" className="border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50">
                            Credential Terms
                        </Button>
                    </Link>
                    <Link href="/code-of-ethics">
                        <Button variant="outline" className="border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50">
                            Code of Ethics
                        </Button>
                    </Link>
                    <Link href="/terms-of-service">
                        <Button variant="outline" className="border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50">
                            Terms of Service
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
