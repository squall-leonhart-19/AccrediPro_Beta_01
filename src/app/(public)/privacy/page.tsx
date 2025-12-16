import Link from "next/link";
import { ArrowLeft, Shield, Eye, Database, Lock, Globe, Mail, UserCheck, Cookie, FileText } from "lucide-react";

export const metadata = {
  title: "Privacy Policy - AccrediPro Academy",
  description: "Learn how AccrediPro Academy collects, uses, and protects your personal information.",
  alternates: {
    canonical: "https://accredipro.academy/privacy",
  },
};

export default function PrivacyPage() {
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
              <Shield className="w-6 h-6 text-burgundy-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Privacy Policy</h1>
          </div>
          <p className="text-gray-600 text-lg">Last updated: December 15, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg prose-burgundy max-w-none">
          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-burgundy-600" />
              Introduction
            </h2>
            <p className="text-gray-600 leading-relaxed">
              AccrediPro Academy ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy
              explains how we collect, use, disclose, and safeguard your personal information when you use our website,
              online courses, and related services (collectively, the "Services").
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              By using our Services, you consent to the practices described in this Privacy Policy. If you do not agree
              with our practices, please do not use our Services.
            </p>
          </section>

          {/* Information We Collect */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Database className="w-5 h-5 text-burgundy-600" />
              Information We Collect
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Information You Provide</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Account Information:</strong> Name, email address, password, and profile details</li>
              <li><strong>Payment Information:</strong> Credit card details, billing address (processed securely by Stripe)</li>
              <li><strong>Educational Information:</strong> Course progress, quiz results, certificates earned</li>
              <li><strong>Communication Data:</strong> Messages to support, community posts, feedback</li>
              <li><strong>Professional Information:</strong> Healthcare credentials, certifications (if provided)</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Information Collected Automatically</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li><strong>Device Information:</strong> IP address, browser type, operating system</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent, clicks, course engagement</li>
              <li><strong>Cookies and Tracking:</strong> See our Cookie section below</li>
              <li><strong>Log Data:</strong> Server logs, error reports, access times</li>
            </ul>
          </section>

          {/* How We Use Information */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Eye className="w-5 h-5 text-burgundy-600" />
              How We Use Your Information
            </h2>
            <p className="text-gray-600 leading-relaxed">We use your information to:</p>
            <ul className="list-disc pl-6 text-gray-600 mt-4 space-y-2">
              <li>Provide, maintain, and improve our Services</li>
              <li>Process payments and deliver purchased courses</li>
              <li>Send course updates, certificates, and educational materials</li>
              <li>Respond to your inquiries and provide customer support</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Detect and prevent fraud and security issues</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-burgundy-600" />
              Information Sharing
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We do not sell your personal information. We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mt-4 space-y-2">
              <li><strong>Service Providers:</strong> Companies that help us operate our Services (payment processors, hosting, email services)</li>
              <li><strong>Accreditation Bodies:</strong> For verification of certificates and credentials</li>
              <li><strong>Legal Requirements:</strong> When required by law or to protect our rights</li>
              <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or sales</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              Our service providers are contractually obligated to protect your information and use it only for the
              purposes we specify.
            </p>
          </section>

          {/* Data Security */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-burgundy-600" />
              Data Security
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We implement appropriate technical and organizational security measures to protect your personal information:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mt-4 space-y-2">
              <li>SSL/TLS encryption for data transmission</li>
              <li>Secure data storage with encryption at rest</li>
              <li>Regular security audits and vulnerability assessments</li>
              <li>Access controls and authentication measures</li>
              <li>Employee training on data protection</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              While we strive to protect your information, no method of transmission over the Internet is 100% secure.
              We cannot guarantee absolute security.
            </p>
          </section>

          {/* Cookies */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Cookie className="w-5 h-5 text-burgundy-600" />
              Cookies and Tracking
            </h2>
            <p className="text-gray-600 leading-relaxed">We use cookies and similar technologies to:</p>
            <ul className="list-disc pl-6 text-gray-600 mt-4 space-y-2">
              <li><strong>Essential Cookies:</strong> Required for the Services to function properly</li>
              <li><strong>Analytics Cookies:</strong> Help us understand how you use our Services</li>
              <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
              <li><strong>Marketing Cookies:</strong> Used for targeted advertising (with consent)</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              You can manage cookie preferences through your browser settings. Disabling certain cookies may affect
              the functionality of our Services.
            </p>
          </section>

          {/* Your Rights */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-burgundy-600" />
              Your Rights
            </h2>
            <p className="text-gray-600 leading-relaxed">Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-6 text-gray-600 mt-4 space-y-2">
              <li><strong>Access:</strong> Request a copy of your personal information</li>
              <li><strong>Correction:</strong> Request correction of inaccurate information</li>
              <li><strong>Deletion:</strong> Request deletion of your personal information</li>
              <li><strong>Portability:</strong> Receive your data in a portable format</li>
              <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              <li><strong>Restrict Processing:</strong> Limit how we use your data</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              To exercise these rights, please contact us at privacy@accredipro.academy. We will respond within 30 days.
            </p>
          </section>

          {/* Data Retention */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Retention</h2>
            <p className="text-gray-600 leading-relaxed">
              We retain your personal information for as long as necessary to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mt-4 space-y-2">
              <li>Provide our Services and maintain your account</li>
              <li>Comply with legal obligations</li>
              <li>Resolve disputes and enforce our agreements</li>
              <li>Maintain certificate records (may be retained indefinitely for verification)</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              When you delete your account, we will delete or anonymize your personal information within 90 days,
              except where retention is required by law.
            </p>
          </section>

          {/* International Transfers */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">International Data Transfers</h2>
            <p className="text-gray-600 leading-relaxed">
              Your information may be transferred to and processed in countries other than your own. We ensure
              appropriate safeguards are in place for such transfers, including standard contractual clauses
              approved by relevant data protection authorities.
            </p>
          </section>

          {/* Children's Privacy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Children's Privacy</h2>
            <p className="text-gray-600 leading-relaxed">
              Our Services are not intended for individuals under 18 years of age. We do not knowingly collect
              personal information from children. If we learn that we have collected information from a child,
              we will delete it promptly.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Changes to This Policy</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Privacy Policy from time to time. We will notify you of material changes by
              posting the updated policy on our website and updating the "Last updated" date. We encourage you
              to review this policy periodically.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-12 p-6 bg-gray-50 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-burgundy-600" />
              Contact Us
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <div className="mt-4 text-gray-700">
              <p><strong>AccrediPro Academy - Privacy Team</strong></p>
              <p>Email: privacy@accredipro.academy</p>
              <p>Support: support@accredipro.academy</p>
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
            <Link href="/refund" className="text-burgundy-600 hover:text-burgundy-700 hover:underline">
              Refund Policy
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
