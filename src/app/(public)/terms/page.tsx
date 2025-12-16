import Link from "next/link";
import { ArrowLeft, Scale, FileText, CheckCircle, AlertTriangle, CreditCard, Users, Globe, Shield } from "lucide-react";

export const metadata = {
  title: "Terms of Service - AccrediPro Academy",
  description: "Read AccrediPro Academy's Terms of Service governing the use of our educational platform and services.",
  alternates: {
    canonical: "https://accredipro.academy/terms",
  },
};

export default function TermsPage() {
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
              <Scale className="w-6 h-6 text-burgundy-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Terms of Service</h1>
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
              1. Introduction
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Welcome to AccrediPro Academy. These Terms of Service ("Terms") govern your access to and use of our website,
              online courses, educational materials, community features, and all related services (collectively, the "Services").
              By accessing or using our Services, you agree to be bound by these Terms.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              AccrediPro Academy ("we," "our," or "us") is operated by AccrediPro Education Ltd. Please read these Terms
              carefully before using our Services. If you do not agree to these Terms, you may not access or use our Services.
            </p>
          </section>

          {/* Eligibility */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-burgundy-600" />
              2. Eligibility
            </h2>
            <p className="text-gray-600 leading-relaxed">
              You must be at least 18 years old to use our Services. By using our Services, you represent and warrant that you:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mt-4 space-y-2">
              <li>Are at least 18 years of age</li>
              <li>Have the legal capacity to enter into binding agreements</li>
              <li>Are not prohibited from using the Services under applicable law</li>
              <li>Will provide accurate and complete registration information</li>
            </ul>
          </section>

          {/* Account Registration */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-burgundy-600" />
              3. Account Registration
            </h2>
            <p className="text-gray-600 leading-relaxed">
              To access certain features of our Services, you must create an account. You are responsible for:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mt-4 space-y-2">
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
              <li>Keeping your account information accurate and up to date</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.
            </p>
          </section>

          {/* Course Enrollment */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-burgundy-600" />
              4. Course Enrollment and Access
            </h2>
            <p className="text-gray-600 leading-relaxed">
              When you purchase a course or certification program, you receive a personal, non-transferable license to access
              the course materials for the duration specified at purchase. This license includes:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mt-4 space-y-2">
              <li>Access to course videos, materials, and resources</li>
              <li>Participation in community forums and discussions</li>
              <li>Access to any included mentorship or coaching sessions</li>
              <li>Certificates upon successful completion (where applicable)</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              Course access is for personal educational purposes only. You may not share, resell, or redistribute course
              materials without our express written permission.
            </p>
          </section>

          {/* Payment Terms */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-burgundy-600" />
              5. Payment and Pricing
            </h2>
            <p className="text-gray-600 leading-relaxed">
              All prices are displayed in USD unless otherwise stated. By purchasing our Services, you agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mt-4 space-y-2">
              <li>Pay all fees and charges associated with your purchase</li>
              <li>Provide valid and accurate payment information</li>
              <li>Authorize us to charge your payment method for recurring payments (if applicable)</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              We reserve the right to modify pricing at any time. Price changes will not affect existing enrollments.
              For information about refunds, please see our <Link href="/refund" className="text-burgundy-600 hover:underline">Refund Policy</Link>.
            </p>
          </section>

          {/* Intellectual Property */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-burgundy-600" />
              6. Intellectual Property
            </h2>
            <p className="text-gray-600 leading-relaxed">
              All content, materials, and intellectual property in our Services, including but not limited to course content,
              videos, text, graphics, logos, and software, are owned by AccrediPro Academy or our licensors and are protected
              by copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              You may not copy, modify, distribute, sell, or lease any part of our Services or content without our prior
              written consent. Any unauthorized use may result in termination of your account and legal action.
            </p>
          </section>

          {/* User Conduct */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-burgundy-600" />
              7. User Conduct
            </h2>
            <p className="text-gray-600 leading-relaxed">
              You agree not to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mt-4 space-y-2">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Share your account credentials with others</li>
              <li>Download, copy, or redistribute course materials</li>
              <li>Harass, abuse, or harm other users</li>
              <li>Post misleading, false, or defamatory content</li>
              <li>Attempt to circumvent security measures</li>
              <li>Use automated tools to access or scrape our Services</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              For detailed community guidelines, please see our <Link href="/code-of-conduct" className="text-burgundy-600 hover:underline">Code of Conduct</Link>.
            </p>
          </section>

          {/* Disclaimers */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Disclaimers</h2>
            <p className="text-gray-600 leading-relaxed">
              Our Services are provided "as is" without warranties of any kind. While we strive to provide accurate and
              up-to-date information, we do not guarantee:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mt-4 space-y-2">
              <li>The accuracy, completeness, or timeliness of our content</li>
              <li>Uninterrupted or error-free access to our Services</li>
              <li>Specific outcomes or results from using our Services</li>
              <li>That our Services will meet your specific needs</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              Our courses provide educational information and are not a substitute for professional medical, legal, or
              financial advice. You are responsible for how you apply the knowledge gained from our courses.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed">
              To the maximum extent permitted by law, AccrediPro Academy shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages arising from your use of our Services, even if we have been
              advised of the possibility of such damages.
            </p>
            <p className="text-gray-600 leading-relaxed mt-4">
              Our total liability for any claim arising from these Terms or your use of our Services shall not exceed
              the amount you paid to us in the twelve (12) months preceding the claim.
            </p>
          </section>

          {/* Termination */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Termination</h2>
            <p className="text-gray-600 leading-relaxed">
              We may terminate or suspend your access to our Services at any time, with or without cause or notice.
              Upon termination:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mt-4 space-y-2">
              <li>Your license to use our Services will immediately cease</li>
              <li>You must stop using and destroy any downloaded materials</li>
              <li>We may delete your account and associated data</li>
            </ul>
            <p className="text-gray-600 leading-relaxed mt-4">
              You may cancel your account at any time by contacting our support team at support@accredipro.academy.
            </p>
          </section>

          {/* Governing Law */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law</h2>
            <p className="text-gray-600 leading-relaxed">
              These Terms shall be governed by and construed in accordance with the laws of the State of Delaware,
              United States, without regard to its conflict of law provisions. Any disputes arising from these Terms
              shall be resolved in the courts of Delaware.
            </p>
          </section>

          {/* Changes to Terms */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update these Terms from time to time. We will notify you of material changes by posting the updated
              Terms on our website and updating the "Last updated" date. Your continued use of our Services after such
              changes constitutes acceptance of the updated Terms.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-12 p-6 bg-gray-50 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Us</h2>
            <p className="text-gray-600 leading-relaxed">
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="mt-4 text-gray-700">
              <p><strong>AccrediPro Academy</strong></p>
              <p>Email: legal@accredipro.academy</p>
              <p>Support: support@accredipro.academy</p>
            </div>
          </section>
        </div>

        {/* Related Links */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Policies</h3>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="text-burgundy-600 hover:text-burgundy-700 hover:underline">
              Privacy Policy
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
