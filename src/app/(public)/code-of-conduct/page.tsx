import Link from "next/link";
import { ArrowLeft, Users, Heart, MessageCircle, AlertTriangle, Ban, Shield, Award, Gavel, Mail } from "lucide-react";

export const metadata = {
  title: "Code of Conduct - AccrediPro Academy",
  description: "Community guidelines and code of conduct for AccrediPro Academy students and members.",
  alternates: {
    canonical: "https://accredipro.academy/code-of-conduct",
  },
};

export default function CodeOfConductPage() {
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
              <Users className="w-6 h-6 text-burgundy-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">Code of Conduct</h1>
          </div>
          <p className="text-gray-600 text-lg">Last updated: December 15, 2025</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg prose-burgundy max-w-none">
          {/* Introduction */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment</h2>
            <p className="text-gray-600 leading-relaxed">
              AccrediPro Academy is dedicated to providing a welcoming, supportive, and professional learning
              environment for all students, regardless of background, experience level, or identity. This Code
              of Conduct outlines our expectations for community participation and the consequences for
              unacceptable behavior.
            </p>
            <div className="bg-burgundy-50 border border-burgundy-200 rounded-xl p-4 mt-4">
              <p className="text-burgundy-800 font-medium">
                We are committed to fostering a community where healthcare professionals can learn, grow,
                and support each other in their functional medicine journey.
              </p>
            </div>
          </section>

          {/* Core Values */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-burgundy-600" />
              Our Core Values
            </h2>
            <div className="grid md:grid-cols-2 gap-4 mt-6">
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Respect</h3>
                <p className="text-gray-600 text-sm">
                  Treat all community members with dignity and consideration, valuing diverse perspectives
                  and experiences.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Integrity</h3>
                <p className="text-gray-600 text-sm">
                  Be honest in your interactions, submit your own work, and maintain the highest ethical
                  standards.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Collaboration</h3>
                <p className="text-gray-600 text-sm">
                  Support fellow learners, share knowledge generously, and contribute positively to discussions.
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Excellence</h3>
                <p className="text-gray-600 text-sm">
                  Strive for continuous improvement, engage thoughtfully with course material, and apply
                  learning professionally.
                </p>
              </div>
            </div>
          </section>

          {/* Expected Behavior */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-burgundy-600" />
              Expected Behavior
            </h2>
            <p className="text-gray-600 leading-relaxed">
              All community members are expected to:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mt-4 space-y-2">
              <li><strong>Be Professional:</strong> Communicate respectfully and maintain professional standards in all interactions</li>
              <li><strong>Be Inclusive:</strong> Welcome and support people of all backgrounds, identities, and experience levels</li>
              <li><strong>Be Constructive:</strong> Offer helpful feedback and engage in productive discussions</li>
              <li><strong>Be Honest:</strong> Represent yourself and your credentials accurately</li>
              <li><strong>Be Supportive:</strong> Encourage fellow students and celebrate their achievements</li>
              <li><strong>Be Responsible:</strong> Take ownership of your learning and contribute positively to the community</li>
              <li><strong>Respect Privacy:</strong> Do not share personal information about others without consent</li>
              <li><strong>Follow Platform Rules:</strong> Adhere to all course and platform guidelines</li>
            </ul>
          </section>

          {/* Community Guidelines */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-burgundy-600" />
              Community Guidelines
            </h2>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Discussion Forums & Comments</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Stay on topic and contribute meaningfully to discussions</li>
              <li>Ask questions respectfully and search for existing answers first</li>
              <li>When sharing knowledge, cite sources when appropriate</li>
              <li>Avoid promotional content unless explicitly permitted</li>
              <li>Use appropriate language and avoid profanity</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Sharing Content</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Only share content you have the right to share</li>
              <li>Give proper credit when referencing others' work</li>
              <li>Do not share course materials outside the platform</li>
              <li>Respect intellectual property rights</li>
            </ul>

            <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-3">Professional Advice</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Course content is educational and not a substitute for professional medical advice</li>
              <li>Do not provide specific medical diagnoses or treatment recommendations in forums</li>
              <li>Always recommend consulting qualified healthcare providers for medical concerns</li>
              <li>Practice within your scope of licensure and certification</li>
            </ul>
          </section>

          {/* Unacceptable Behavior */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Ban className="w-5 h-5 text-burgundy-600" />
              Unacceptable Behavior
            </h2>
            <p className="text-gray-600 leading-relaxed">
              The following behaviors are not tolerated in our community:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mt-4 space-y-2">
              <li><strong>Harassment:</strong> Any form of harassment, intimidation, or bullying</li>
              <li><strong>Discrimination:</strong> Discriminatory comments or behavior based on race, gender, sexuality, religion, disability, or other protected characteristics</li>
              <li><strong>Hate Speech:</strong> Offensive comments, slurs, or imagery targeting any group</li>
              <li><strong>Personal Attacks:</strong> Ad hominem attacks, insults, or derogatory remarks about individuals</li>
              <li><strong>Spam:</strong> Unsolicited advertising, promotional content, or repetitive messages</li>
              <li><strong>Plagiarism:</strong> Submitting others' work as your own or cheating on assessments</li>
              <li><strong>Privacy Violations:</strong> Sharing private information about others without consent</li>
              <li><strong>Misinformation:</strong> Deliberately spreading false or misleading health information</li>
              <li><strong>Threats:</strong> Any threats of violence or harm</li>
              <li><strong>Illegal Activity:</strong> Promoting or engaging in illegal activities</li>
              <li><strong>Impersonation:</strong> Pretending to be someone else or misrepresenting credentials</li>
              <li><strong>Account Sharing:</strong> Sharing your account credentials with others</li>
            </ul>
          </section>

          {/* Academic Integrity */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-burgundy-600" />
              Academic Integrity
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Maintaining academic integrity is essential for the value of your certification:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mt-4 space-y-2">
              <li>Complete all assessments and quizzes on your own</li>
              <li>Do not share quiz questions or answers with other students</li>
              <li>Do not use unauthorized materials during proctored exams</li>
              <li>Report any suspected academic dishonesty to our team</li>
              <li>Your certificate represents your personal achievement and knowledge</li>
            </ul>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
              <p className="text-amber-800 text-sm">
                <strong>Note:</strong> Violations of academic integrity may result in certificate revocation
                and permanent removal from the platform.
              </p>
            </div>
          </section>

          {/* Reporting */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-burgundy-600" />
              Reporting Violations
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If you witness or experience behavior that violates this Code of Conduct:
            </p>
            <ol className="list-decimal pl-6 text-gray-600 mt-4 space-y-3">
              <li>
                <strong>Report Immediately:</strong> Email{" "}
                <a href="mailto:support@accredipro.academy" className="text-burgundy-600 hover:underline">
                  support@accredipro.academy
                </a>{" "}
                with details of the incident
              </li>
              <li>
                <strong>Provide Details:</strong> Include screenshots, links, dates, times, and any relevant context
              </li>
              <li>
                <strong>Maintain Confidentiality:</strong> We will handle reports confidentially to the extent possible
              </li>
              <li>
                <strong>No Retaliation:</strong> We prohibit retaliation against anyone who reports violations in good faith
              </li>
            </ol>
          </section>

          {/* Enforcement */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Gavel className="w-5 h-5 text-burgundy-600" />
              Enforcement & Consequences
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Violations of this Code of Conduct may result in the following actions, depending on severity:
            </p>
            <div className="mt-6 space-y-4">
              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-semibold text-gray-900">Warning</h3>
                <p className="text-gray-600 text-sm">
                  A private written warning explaining the violation and expected behavior change.
                </p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-900">Temporary Suspension</h3>
                <p className="text-gray-600 text-sm">
                  Temporary loss of access to community features, forums, or specific course components.
                </p>
              </div>
              <div className="border-l-4 border-red-500 pl-4">
                <h3 className="font-semibold text-gray-900">Permanent Ban</h3>
                <p className="text-gray-600 text-sm">
                  Permanent removal from the platform, revocation of certificates, and forfeiture of any paid fees.
                </p>
              </div>
            </div>
            <p className="text-gray-600 leading-relaxed mt-4">
              We reserve the right to take immediate action without warning for severe violations. All decisions
              regarding enforcement are at the discretion of the AccrediPro Academy team.
            </p>
          </section>

          {/* Appeals */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Appeals Process</h2>
            <p className="text-gray-600 leading-relaxed">
              If you believe an enforcement action was taken in error, you may appeal:
            </p>
            <ul className="list-disc pl-6 text-gray-600 mt-4 space-y-2">
              <li>Submit a written appeal within 14 days of the enforcement action</li>
              <li>Email your appeal to support@accredipro.academy with subject "Code of Conduct Appeal"</li>
              <li>Include your account information and a detailed explanation of your position</li>
              <li>Appeals will be reviewed within 7 business days</li>
              <li>The decision on appeal is final</li>
            </ul>
          </section>

          {/* Changes */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Policy Updates</h2>
            <p className="text-gray-600 leading-relaxed">
              We may update this Code of Conduct as our community evolves. Significant changes will be
              communicated to all members. Continued use of the platform after changes constitutes
              acceptance of the updated Code of Conduct.
            </p>
          </section>

          {/* Contact */}
          <section className="mb-12 p-6 bg-gray-50 rounded-xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Mail className="w-5 h-5 text-burgundy-600" />
              Questions?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              If you have questions about this Code of Conduct or need clarification on community guidelines:
            </p>
            <div className="mt-4 text-gray-700">
              <p><strong>AccrediPro Academy - Community Team</strong></p>
              <p>Email: support@accredipro.academy</p>
            </div>
          </section>

          {/* Final Note */}
          <section className="mb-12 p-6 bg-burgundy-50 rounded-xl">
            <p className="text-burgundy-800 leading-relaxed text-center">
              <strong>Thank you for being part of the AccrediPro Academy community!</strong>
              <br />
              Together, we're building a supportive environment where healthcare professionals
              can learn, grow, and make a positive impact on patient health.
            </p>
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
            <Link href="/refund" className="text-burgundy-600 hover:text-burgundy-700 hover:underline">
              Refund Policy
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
