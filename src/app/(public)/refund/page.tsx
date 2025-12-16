import Link from "next/link";
import { ArrowLeft, RefreshCcw, Clock, CheckCircle, XCircle, AlertTriangle, CreditCard, Mail, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Refund Policy - AccrediPro Academy",
  description: "Understand AccrediPro Academy's refund policy for courses, certifications, and digital products.",
  alternates: {
    canonical: "https://accredipro.academy/refund",
  },
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-burgundy-600 to-burgundy-700 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="font-bold text-xl text-gray-900">AccrediPro</span>
            </Link>
            <Link
              href="/"
              className="text-sm text-gray-600 hover:text-burgundy-600 flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="pt-24 pb-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-burgundy-100 rounded-xl">
              <RefreshCcw className="w-6 h-6 text-burgundy-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Refund Policy</h1>
          </div>
          <p className="text-gray-600 text-lg">Last updated: December 15, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg prose-burgundy max-w-none">
          {/* Overview */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-burgundy-600" />
              Overview
            </h2>
            <p className="text-gray-600 leading-relaxed">
              At AccrediPro Academy, we are committed to providing high-quality educational content and ensuring
              your satisfaction. This Refund Policy outlines the terms and conditions for refunds on our courses,
              certifications, and digital products.
            </p>
            <div className="bg-burgundy-50 border border-burgundy-200 rounded-xl p-4 mt-4">
              <p className="text-burgundy-800 font-medium">
                We offer a 14-day satisfaction guarantee on most of our courses. If you're not completely
                satisfied with your purchase, we're here to help.
              </p>
            </div>
          </section>

          {/* Eligibility */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-burgundy-600" />
              Refund Eligibility
            </h2>
            <p className="text-gray-600 leading-relaxed">You may be eligible for a refund if:</p>
            <ul className="list-disc pl-6 text-gray-600 mt-4 space-y-2">
              <li>You request the refund within <strong>14 days</strong> of purchase</li>
              <li>You have completed <strong>less than 30%</strong> of the course content</li>
              <li>You have <strong>not</strong> downloaded any course certificates or credentials</li>
              <li>You have <strong>not</strong> completed the final exam or received a passing grade</li>
              <li>This is your <strong>first refund request</strong> for the specific product</li>
            </ul>
          </section>

          {/* Non-Refundable */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <XCircle className="w-5 h-5 text-burgundy-600" />
              Non-Refundable Items
            </h2>
            <p className="text-gray-600 leading-relaxed">The following items are <strong>not eligible</strong> for refunds:</p>
            <ul className="list-disc pl-6 text-gray-600 mt-4 space-y-2">
              <li><strong>Completed Certifications:</strong> Courses where you've earned a certificate</li>
              <li><strong>Bundle Purchases:</strong> Partial refunds for course bundles (all-or-nothing)</li>
              <li><strong>Promotional Items:</strong> Heavily discounted or free courses</li>
              <li><strong>Subscription Fees:</strong> Monthly membership fees after the billing period starts</li>
              <li><strong>Coaching Sessions:</strong> One-on-one coaching sessions once scheduled</li>
              <li><strong>Digital Downloads:</strong> eBooks, resources, or materials once downloaded</li>
              <li><strong>Repeated Purchases:</strong> Re-purchasing a course you previously completed or refunded</li>
            </ul>
          </section>

          {/* Timeframes */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-burgundy-600" />
              Refund Timeframes
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Product Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Refund Window</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Processing Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3 text-gray-600">Individual Courses</td>
                    <td className="px-4 py-3 text-gray-600">14 days</td>
                    <td className="px-4 py-3 text-gray-600">5-10 business days</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">Certification Programs</td>
                    <td className="px-4 py-3 text-gray-600">14 days (before completion)</td>
                    <td className="px-4 py-3 text-gray-600">5-10 business days</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-600">Monthly Subscription</td>
                    <td className="px-4 py-3 text-gray-600">Within first 7 days</td>
                    <td className="px-4 py-3 text-gray-600">3-5 business days</td>
                  </tr>
                  <tr className="bg-gray-50">
                    <td className="px-4 py-3 text-gray-600">Annual Subscription</td>
                    <td className="px-4 py-3 text-gray-600">Within first 14 days</td>
                    <td className="px-4 py-3 text-gray-600">5-10 business days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* How to Request */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-burgundy-600" />
              How to Request a Refund
            </h2>
            <p className="text-gray-600 leading-relaxed">To request a refund, please follow these steps:</p>
            <ol className="list-decimal pl-6 text-gray-600 mt-4 space-y-3">
              <li>
                <strong>Contact Support:</strong> Email us at{" "}
                <a href="mailto:support@accredipro.academy" className="text-burgundy-600 hover:underline">
                  support@accredipro.academy
                </a>{" "}
                with the subject line "Refund Request"
              </li>
              <li>
                <strong>Provide Information:</strong> Include your full name, email address used for purchase,
                order number (found in your purchase confirmation email), and the course/product name
              </li>
              <li>
                <strong>Explain Your Reason:</strong> Briefly describe why you're requesting a refund
                (this helps us improve our services)
              </li>
              <li>
                <strong>Wait for Confirmation:</strong> Our team will review your request within 2-3 business days
                and respond with next steps
              </li>
            </ol>
          </section>

          {/* Special Circumstances */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-burgundy-600" />
              Special Circumstances
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We understand that exceptional circumstances may arise. We may consider refunds outside our standard
              policy in the following situations:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mt-4 space-y-2">
              <li><strong>Technical Issues:</strong> Persistent platform issues preventing course access</li>
              <li><strong>Medical Emergencies:</strong> Documented medical situations (with supporting documentation)</li>
              <li><strong>Duplicate Charges:</strong> Accidental double purchases (full refund on duplicate)</li>
              <li><strong>Course Content Issues:</strong> Material significantly different from description</li>
              <li><strong>Payment Errors:</strong> Incorrect charges due to system errors</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              Each request is reviewed on a case-by-case basis. Please contact our support team with relevant
              documentation.
            </p>
          </section>

          {/* Payment Methods */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Refund Payment Methods</h2>
            <p className="text-gray-600 leading-relaxed">
              Refunds are processed to the original payment method:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mt-4 space-y-2">
              <li><strong>Credit/Debit Cards:</strong> Refunded to the same card (5-10 business days)</li>
              <li><strong>PayPal:</strong> Refunded to your PayPal account (3-5 business days)</li>
              <li><strong>Bank Transfer:</strong> Refunded to the same account (7-14 business days)</li>
              <li><strong>Gift Cards/Credits:</strong> Refunded as account credit (instant)</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              Please note that your financial institution may have additional processing times beyond our control.
            </p>
          </section>

          {/* Cancellation */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Subscription Cancellation</h2>
            <p className="text-gray-600 leading-relaxed">
              For subscription-based products:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mt-4 space-y-2">
              <li>You may cancel your subscription at any time from your account settings</li>
              <li>Cancellation takes effect at the end of the current billing period</li>
              <li>You retain access until the end of the paid period</li>
              <li>No partial refunds are provided for unused time in the billing cycle</li>
              <li>Annual subscriptions may be eligible for prorated refunds within the first 14 days</li>
            </ul>
          </section>

          {/* Disputes */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Chargebacks and Disputes</h2>
            <p className="text-gray-600 leading-relaxed">
              We encourage you to contact us directly before initiating a chargeback with your payment provider.
              We're committed to resolving issues quickly and fairly. Initiating a chargeback without first
              attempting to resolve the issue with us may result in:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mt-4 space-y-2">
              <li>Immediate suspension of your account</li>
              <li>Loss of access to all courses and materials</li>
              <li>Revocation of any certificates earned</li>
              <li>Potential collection action for disputed amounts</li>
            </ul>
          </section>

          {/* Changes */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Policy Changes</h2>
            <p className="text-gray-600 leading-relaxed">
              We reserve the right to modify this refund policy at any time. Changes will be effective immediately
              upon posting to our website. The refund policy in effect at the time of your purchase will apply
              to that transaction.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-12 p-6 bg-gray-50 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-burgundy-600" />
              Contact Us
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If you have questions about our refund policy or need assistance with a refund request:
            </p>
            <div className="mt-4 text-gray-700">
              <p><strong>AccrediPro Academy - Support Team</strong></p>
              <p>Email: support@accredipro.academy</p>
              <p>Response time: Within 24-48 hours</p>
            </div>
          </section>
        </div>

        {/* Related Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Policies</h3>
          <div className="flex flex-wrap gap-4">
            <Link href="/terms" className="text-burgundy-600 hover:text-burgundy-700 hover:underline">
              Terms of Service
            </Link>
            <Link href="/privacy" className="text-burgundy-600 hover:text-burgundy-700 hover:underline">
              Privacy Policy
            </Link>
            <Link href="/code-of-conduct" className="text-burgundy-600 hover:text-burgundy-700 hover:underline">
              Code of Conduct
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">&copy; {new Date().getFullYear()} AccrediPro Academy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
