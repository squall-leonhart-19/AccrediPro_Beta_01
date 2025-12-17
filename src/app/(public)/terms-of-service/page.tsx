import Link from "next/link";
import { Shield, Mail, Calendar, ArrowLeft, FileText, Scale, AlertTriangle, CreditCard, BookOpen, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function TermsOfServicePage() {
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
              <Scale className="w-6 h-6 text-gold-400" />
            </div>
            <Badge className="bg-gold-400/20 text-gold-300 border-gold-400/30">
              Legal Document
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Terms of Service</h1>
          <p className="text-burgundy-100 text-lg mb-4">
            Please read these terms carefully before using AccrediPro Academy's services. By enrolling in our courses, you agree to be bound by these terms.
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
                <FileText className="w-6 h-6 text-burgundy-600" />
                1. Acceptance of Terms
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                These Terms of Service ("Terms") constitute a legally binding agreement between you ("Student," "you," or "your") and AccrediPro LLC ("AccrediPro," "we," "our," or "us"), governing your access to and use of our online educational platform located at accredipro.academy and learn.accredipro.academy.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>You accept this Agreement and become legally bound by its terms through any of the following actions:</strong>
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Clicking "I Agree," "Purchase Now," "Enroll Now," or any similar acceptance button</li>
                <li>Checking any checkbox indicating agreement to these terms</li>
                <li>Completing payment for any digital product or service</li>
                <li>Accessing, logging into, viewing, streaming, or downloading any course materials</li>
                <li>Creating an account on our learning management platform</li>
                <li>Participating in any community features, forums, or group coaching sessions</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-6 h-6 text-burgundy-600" />
                2. Eligibility
              </h2>
              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Age Requirement</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You must be at least 18 years of age or the age of majority in your jurisdiction to enroll in our courses. By using our services, you represent and warrant that you meet this age requirement.
              </p>
              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Legal Capacity</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You represent that you have the legal capacity to enter into a binding contract. If you are enrolling on behalf of an organization, you represent that you have the authority to bind that organization to these Terms.
              </p>
              <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">Geographic Availability</h3>
              <p className="text-gray-700 leading-relaxed">
                Our services are available worldwide. However, you are responsible for ensuring that your use of our platform complies with all applicable local laws and regulations in your jurisdiction.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-burgundy-600" />
                3. Account & Registration
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                To access our courses, you must create an account by providing accurate, current, and complete information including your full legal name, valid email address, and payment information.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>You are solely responsible for:</strong>
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Maintaining the confidentiality of your login credentials</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized access or security breach</li>
                <li>Keeping your account information current and accurate</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                We reserve the right to suspend or terminate accounts with false, inaccurate, or incomplete information.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-burgundy-600" />
                4. Nature of Digital Products
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our courses are delivered as digital products consisting of pre-recorded video lessons, downloadable materials, quizzes, and interactive content. Upon purchase, you receive immediate access to course materials.
              </p>
              <p className="text-gray-700 leading-relaxed">
                You acknowledge that because Digital Products are delivered immediately upon purchase and you have immediate access to the materials, you knowingly and voluntarily waive any statutory "cooling-off" period, right of withdrawal, or cancellation right that might otherwise apply.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="w-6 h-6 text-burgundy-600" />
                5. Payment Terms
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                All prices are displayed in USD unless otherwise indicated. Payment is required in full at the time of enrollment unless a payment plan is offered and selected.
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>We accept major credit cards and other payment methods as displayed at checkout</li>
                <li>All sales are final once access credentials are delivered</li>
                <li>You agree to provide accurate and complete payment information</li>
                <li>Currency conversion fees may apply for international purchases</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Course Access & License</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Upon successful payment, we grant you a limited, non-exclusive, non-transferable, revocable license to access and view the course materials for your personal, non-commercial use.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>You may NOT:</strong>
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Share your account credentials with others</li>
                <li>Download, copy, or redistribute course materials</li>
                <li>Record, screenshot, or capture video lessons</li>
                <li>Use course materials for commercial purposes</li>
                <li>Create derivative works based on our content</li>
                <li>Resell or sublicense access to our courses</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Intellectual Property</h2>
              <p className="text-gray-700 leading-relaxed">
                All course content, including but not limited to videos, text, graphics, logos, images, audio, software, and curriculum, is owned by AccrediPro or its licensors and is protected by copyright, trademark, and other intellectual property laws. Your enrollment does not transfer any ownership rights.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-burgundy-600" />
                8. Disclaimers
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our courses provide educational information for informational purposes only. We do not guarantee specific career outcomes, income levels, or professional results.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>Our certifications:</strong>
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Are educational credentials, not professional licenses</li>
                <li>Do not authorize the practice of medicine, therapy, or other regulated professions</li>
                <li>May require additional licensing or credentials depending on your jurisdiction</li>
                <li>Should be used within appropriate scope of practice</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mt-4">
                THE SERVICES ARE PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
              <p className="text-gray-700 leading-relaxed">
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, ACCREDIPRO SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, OR GOODWILL, ARISING OUT OF OR RELATED TO YOUR USE OF OUR SERVICES. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT YOU PAID FOR THE SPECIFIC COURSE OR SERVICE GIVING RISE TO THE CLAIM.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Termination</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We reserve the right to suspend or terminate your account and access to our services at any time, with or without cause, including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Violation of these Terms of Service</li>
                <li>Fraudulent or illegal activity</li>
                <li>Sharing account credentials</li>
                <li>Harassment of staff or other students</li>
                <li>Chargebacks or payment disputes without proper resolution</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law & Disputes</h2>
              <p className="text-gray-700 leading-relaxed">
                These Terms shall be governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to conflict of law principles. Any disputes arising from these Terms or your use of our services shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Modifications</h2>
              <p className="text-gray-700 leading-relaxed">
                We reserve the right to modify these Terms at any time. We will notify you of material changes by posting the updated terms on our website. Your continued use of our services after changes constitutes acceptance of the modified Terms.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-6 h-6 text-burgundy-600" />
                13. Contact Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have questions about these Terms of Service, please contact us:
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
          <Link href="/privacy-policy">
            <Button variant="outline" className="border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50">
              Privacy Policy
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
