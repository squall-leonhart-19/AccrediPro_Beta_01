import Link from "next/link";
import { Shield, Mail, Calendar, ArrowLeft, RefreshCcw, AlertTriangle, CheckCircle, XCircle, Clock, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function RefundPolicyPage() {
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
              <RefreshCcw className="w-6 h-6 text-gold-400" />
            </div>
            <Badge className="bg-gold-400/20 text-gold-300 border-gold-400/30">
              Legal Document
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Refund Policy</h1>
          <p className="text-burgundy-100 text-lg mb-4">
            Understanding our refund policy before enrollment helps ensure a smooth experience. Please read this policy carefully.
          </p>
          <div className="flex items-center gap-2 text-burgundy-200 text-sm">
            <Calendar className="w-4 h-4" />
            Last Updated: {lastUpdated}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Important Notice */}
        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-amber-800 mb-2">Important: Digital Products Policy</h3>
              <p className="text-amber-700">
                Due to the immediate-access nature of our digital courses, all purchases are final once access credentials are delivered. We encourage you to review our free content and course previews before enrolling.
              </p>
            </div>
          </div>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 md:p-12 prose prose-burgundy max-w-none">

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-burgundy-600" />
                1. Finality of Purchase
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Once payment is successfully processed and access credentials are delivered to your email address, your purchase is complete and final. Due to the immediate-access nature of Digital Products, you expressly acknowledge and agree that you waive any right to request a refund for any reason whatsoever after receiving access to course materials.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-burgundy-600" />
                2. 30-Day Certification Guarantee
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We offer a conditional 30-Day Certification Guarantee for our main certification programs. To be eligible for consideration, you must satisfy <strong>all</strong> of the following requirements within thirty (30) calendar days from the date of enrollment:
              </p>

              <div className="bg-green-50 rounded-xl p-6 border border-green-200 mb-6">
                <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Requirements for Guarantee Eligibility
                </h3>
                <ul className="list-disc pl-6 text-green-700 space-y-2">
                  <li>Complete 100% of all course modules and lessons</li>
                  <li>Submit all required assignments and assessments</li>
                  <li>Attend or watch all coaching sessions (if applicable)</li>
                  <li>Make genuine effort to apply course materials</li>
                  <li>Document your efforts with screenshots and completion certificates</li>
                  <li>Contact support before requesting refund to attempt resolution</li>
                </ul>
              </div>

              <p className="text-gray-700 leading-relaxed">
                AccrediPro reserves the right to independently verify all claims through login records, analytics, and progress reports. Any inconsistency or misrepresentation will result in immediate denial.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <XCircle className="w-6 h-6 text-burgundy-600" />
                3. Circumstances That Do NOT Qualify for Refund
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                The following circumstances do not entitle you to any refund, credit, or exchange:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>"I changed my mind" or buyer's remorse</li>
                <li>"I don't have time to complete the course"</li>
                <li>"The course wasn't what I expected" (without completing it)</li>
                <li>"I found similar information elsewhere"</li>
                <li>"My financial situation has changed"</li>
                <li>"My spouse/partner doesn't support my decision"</li>
                <li>Technical issues on your end (internet, device, etc.)</li>
                <li>Failure to access the course within 30 days</li>
                <li>Dissatisfaction without making genuine effort to complete</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-6 h-6 text-burgundy-600" />
                4. Extraordinary Circumstances
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We understand that genuine emergencies can occur. Refund requests based on extraordinary circumstances will be evaluated on a case-by-case basis and require mandatory supporting documentation.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">Potentially Acceptable (with documentation):</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Serious medical illness:</strong> Official medical records from a licensed healthcare provider</li>
                <li><strong>Death of immediate family member:</strong> Official death certificate and proof of relationship</li>
                <li><strong>Documented disability:</strong> Official documentation from a licensed medical professional</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">NOT Accepted (regardless of documentation):</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>General financial preference or need to pay bills</li>
                <li>Self-reported stress without medical documentation</li>
                <li>Job changes or work schedule conflicts</li>
                <li>Personal preference changes</li>
              </ul>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-burgundy-600" />
                5. Refund Request Procedure
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you believe you qualify for a refund under our Certification Guarantee or Extraordinary Circumstances policy:
              </p>
              <ol className="list-decimal pl-6 text-gray-700 space-y-3">
                <li>Email <a href="mailto:info@accredipro.academy" className="text-burgundy-600 hover:underline font-medium">info@accredipro.academy</a> with subject "Refund Request"</li>
                <li>Include your full name, email address, and enrollment date</li>
                <li>Explain your reason for requesting a refund with supporting details</li>
                <li>Attach all required documentation (within 7 business days if requested)</li>
                <li>Allow 5-10 business days for review</li>
              </ol>
              <p className="text-gray-700 leading-relaxed mt-4">
                Failure to provide requested documentation within seven (7) business days will result in automatic denial of your request.
              </p>
            </section>

            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Chargebacks & Payment Disputes</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                By enrolling in our courses, you agree to resolve any payment disputes directly with AccrediPro before initiating a chargeback with your financial institution. Fraudulent chargebacks (filed after receiving course access) may result in:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Immediate termination of account access</li>
                <li>Revocation of any certificates issued</li>
                <li>Collection of fees and damages</li>
                <li>Reporting to fraud prevention databases</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-6 h-6 text-burgundy-600" />
                7. Contact Us
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                For questions about our refund policy or to discuss your situation, please contact us:
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
          <Link href="/privacy-policy">
            <Button variant="outline" className="border-burgundy-200 text-burgundy-700 hover:bg-burgundy-50">
              Privacy Policy
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
