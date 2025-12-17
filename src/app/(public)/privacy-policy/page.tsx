import Link from "next/link";
import { Shield, Mail, Calendar, ArrowLeft, FileText, Lock, Users, Database } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function PrivacyPolicyPage() {
  const lastUpdated = "December 15, 2024";

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
              <Lock className="w-6 h-6 text-gold-400" />
            </div>
            <Badge className="bg-gold-400/20 text-gold-300 border-gold-400/30">
              Legal Document
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-burgundy-100 text-lg mb-4">
            Your privacy is important to us. This policy explains how AccrediPro Academy collects, uses, protects, and shares your personal information.
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
                1. Introduction
              </h2>
              <p className="text-gray-700 leading-relaxed">
                AccrediPro LLC ("AccrediPro," "we," "our," or "us") operates the AccrediPro Academy online learning platform located at accredipro.academy and learn.accredipro.academy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our websites, enroll in our courses, or use our services.
              </p>
              <p className="text-gray-700 leading-relaxed">
                By using our services, you consent to the collection and use of your information in accordance with this Privacy Policy. If you do not agree with any part of this policy, please do not use our services.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Database className="w-6 h-6 text-burgundy-600" />
                2. Information We Collect
              </h2>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Personal Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                When you create an account or enroll in our courses, we may collect:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Full name (first and last name)</li>
                <li>Email address</li>
                <li>Phone number (optional)</li>
                <li>Billing and payment information</li>
                <li>Mailing address (for certificate delivery, if applicable)</li>
                <li>Professional background and goals</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Usage Information</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We automatically collect certain information about your use of our platform:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>IP address and device identifiers</li>
                <li>Browser type and operating system</li>
                <li>Course progress and completion data</li>
                <li>Video watch time and lesson interactions</li>
                <li>Quiz and exam results</li>
                <li>Login timestamps and session duration</li>
                <li>Pages visited and navigation patterns</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Cookies and Tracking Technologies</h3>
              <p className="text-gray-700 leading-relaxed">
                We use cookies, pixels, and similar technologies to enhance your experience, analyze usage patterns, and deliver personalized content and advertisements. You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-burgundy-600" />
                3. How We Use Your Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">We use the information we collect to:</p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Provide and improve our educational courses and services</li>
                <li>Process payments and issue certificates</li>
                <li>Send course updates, reminders, and educational content</li>
                <li>Provide customer support and respond to inquiries</li>
                <li>Personalize your learning experience</li>
                <li>Analyze platform usage and optimize performance</li>
                <li>Send marketing communications (with your consent)</li>
                <li>Comply with legal obligations and prevent fraud</li>
                <li>Enforce our Terms of Service</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-burgundy-600" />
                4. Information Sharing
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We do not sell your personal information. We may share your information with:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Service Providers:</strong> Payment processors, email services, hosting providers, and analytics tools that help us operate our platform</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or government regulation</li>
                <li><strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets</li>
                <li><strong>With Your Consent:</strong> When you explicitly authorize sharing</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security</h2>
              <p className="text-gray-700 leading-relaxed">
                We implement industry-standard security measures to protect your personal information, including encryption, secure servers, and access controls. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Retention</h2>
              <p className="text-gray-700 leading-relaxed">
                We retain your personal information for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements. Course completion records and certificates are retained indefinitely for verification purposes.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Your Rights</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Access:</strong> Request a copy of your personal data</li>
                <li><strong>Correction:</strong> Request correction of inaccurate data</li>
                <li><strong>Deletion:</strong> Request deletion of your data (subject to legal retention requirements)</li>
                <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                To exercise these rights, please contact us at <a href="mailto:info@accredipro.academy" className="text-burgundy-600 hover:underline font-medium">info@accredipro.academy</a>.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Children's Privacy</h2>
              <p className="text-gray-700 leading-relaxed">
                Our services are not intended for individuals under 18 years of age. We do not knowingly collect personal information from children. If we become aware that we have collected information from a minor, we will take steps to delete it promptly.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Transfers</h2>
              <p className="text-gray-700 leading-relaxed">
                Your information may be transferred to and processed in countries other than your own. By using our services, you consent to such transfers. We ensure appropriate safeguards are in place to protect your data in accordance with applicable laws.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Changes to This Policy</h2>
              <p className="text-gray-700 leading-relaxed">
                We may update this Privacy Policy from time to time. We will notify you of material changes by posting the updated policy on our website and updating the "Last Updated" date. Your continued use of our services after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-6 h-6 text-burgundy-600" />
                11. Contact Us
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-burgundy-50 rounded-xl p-6 border border-burgundy-100">
                <p className="text-gray-900 font-semibold mb-2">AccrediPro Academy</p>
                <p className="text-gray-700">
                  Email: <a href="mailto:info@accredipro.academy" className="text-burgundy-600 hover:underline font-medium">info@accredipro.academy</a>
                </p>
                <p className="text-gray-700">
                  Website: <a href="https://accredipro.academy" className="text-burgundy-600 hover:underline font-medium">accredipro.academy</a>
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
          <Link href="/refund-policy">
            <Button variant="outline" className="border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50">
              Refund Policy
            </Button>
          </Link>
          <Link href="/code-of-ethics">
            <Button variant="outline" className="border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50">
              Code of Ethics
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
