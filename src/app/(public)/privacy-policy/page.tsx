import Link from "next/link";
import Image from "next/image";
import { Lock, Mail, Calendar, ArrowLeft, Shield, Database, Globe, Eye, Users, FileText, Cookie, Bell, RefreshCw, Baby, ExternalLink, Settings, Server, Scale, UserCheck, Key, Trash2, Download, Ban } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ASI Brand Colors
const BRAND = {
  burgundy: "#722f37",
  burgundyDark: "#4e1f24",
  gold: "#d4af37",
  goldLight: "#e8c547",
  cream: "#fdf8f0",
};

export const metadata = {
  title: "Privacy Policy | Accreditation Standards Institute",
  description: "Privacy Policy for Accreditation Standards Institute - How we collect, use, protect, and share your personal information.",
};

export default function PrivacyPolicyPage() {
  const lastUpdated = "January 1, 2025";

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div style={{ backgroundColor: BRAND.burgundyDark }} className="text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <span>🇺🇸</span> USA Headquarters
            </span>
            <span className="flex items-center gap-2">
              <span>🇦🇪</span> Dubai Office
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/verify" className="hover:opacity-80 transition-opacity" style={{ color: BRAND.gold }}>
              Verify Credential
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/ASI_LOGO-removebg-preview.png"
                alt="Accreditation Standards Institute"
                width={160}
                height={48}
                className="h-12 w-auto"
              />
            </Link>
            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" style={{ color: BRAND.burgundy }}>Log In</Button>
              </Link>
              <Link href="/certifications">
                <Button style={{ backgroundColor: BRAND.burgundy, color: "white" }} className="hover:opacity-90">
                  View Certifications
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <div className="text-white" style={{ background: `linear-gradient(135deg, ${BRAND.burgundyDark} 0%, ${BRAND.burgundy} 100%)` }}>
        <div className="max-w-6xl mx-auto px-4 py-12">
          <Link href="/" className="inline-flex items-center gap-2 hover:opacity-80 mb-6 transition-opacity" style={{ color: BRAND.gold }}>
            <ArrowLeft className="w-4 h-4" />
            Back to ASI Home
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center border" style={{ backgroundColor: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.2)' }}>
              <Lock className="w-6 h-6" style={{ color: BRAND.gold }} />
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${BRAND.gold}20`, color: BRAND.gold, border: `1px solid ${BRAND.gold}40` }}>
              Legal Document
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-lg mb-2" style={{ color: '#f5f5f5' }}>
            Your Privacy Rights and Our Data Practices
          </p>
          <p className="mb-4" style={{ color: BRAND.gold }}>
            Accreditation Standards Institute LLC — A Delaware Limited Liability Company
          </p>
          <div className="flex items-center gap-2 text-sm" style={{ color: '#d1d5db' }}>
            <Calendar className="w-4 h-4" />
            Last Updated: {lastUpdated}
          </div>
        </div>
      </div>

      {/* Privacy Commitment Notice */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-bold text-blue-800 mb-2">Our Commitment to Your Privacy</h3>
              <p className="text-blue-700 text-sm leading-relaxed">
                Accreditation Standards Institute LLC ("ASI," "we," "us," or "our") is committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website, learning management system, certification programs, and related services.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 md:p-12 prose prose-gray max-w-none">

            {/* Section 1: Introduction */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6" style={{ color: BRAND.burgundy }} />
                1. Introduction
              </h2>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1.1 Data Controller</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Accreditation Standards Institute LLC acts as the data controller for personal information collected through our platforms. As the data controller, we determine the purposes and means of processing your personal data and are responsible for ensuring compliance with applicable data protection laws.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1.2 Scope of This Policy</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                This Privacy Policy applies to all personal information collected through:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Our website at accreditation-standards.org and all associated domains</li>
                <li>Our learning management system (LMS) and student portals</li>
                <li>Certification programs, mini-diplomas, and educational courses</li>
                <li>Community forums, group coaching, and mentorship programs</li>
                <li>Email communications and marketing materials</li>
                <li>Mobile applications and downloadable resources</li>
                <li>Customer support interactions and feedback submissions</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1.3 Agreement to This Policy</h3>
              <p className="text-gray-700 leading-relaxed">
                By accessing our services, creating an account, enrolling in a program, or otherwise providing your information to us, you acknowledge that you have read, understood, and agree to the practices described in this Privacy Policy. If you do not agree with our policies and practices, please do not use our services.
              </p>
            </section>

            {/* Section 2: Information We Collect */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Database className="w-6 h-6" style={{ color: BRAND.burgundy }} />
                2. Information We Collect
              </h2>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.1 Personal Information You Provide</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We collect information you voluntarily provide when you register, enroll in courses, or interact with our services:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Identity Information:</strong> Full legal name, date of birth, professional credentials, and professional title</li>
                <li><strong>Contact Information:</strong> Email address, phone number, mailing address, and country of residence</li>
                <li><strong>Account Information:</strong> Username, password, security questions, and account preferences</li>
                <li><strong>Payment Information:</strong> Credit/debit card details, billing address, and transaction history (processed securely through third-party payment processors)</li>
                <li><strong>Professional Background:</strong> Education history, professional experience, current occupation, and career goals</li>
                <li><strong>Profile Information:</strong> Profile photo, biography, professional certifications, and social media links</li>
                <li><strong>Communication Content:</strong> Messages sent through our platform, support tickets, feedback, and survey responses</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.2 Usage Data and Analytics</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We automatically collect certain information when you access and use our services:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Device Information:</strong> IP address, browser type and version, operating system, device identifiers, and screen resolution</li>
                <li><strong>Access Logs:</strong> Login times, session duration, pages visited, and features used</li>
                <li><strong>Referral Data:</strong> How you arrived at our website (search engine, social media, referral link)</li>
                <li><strong>Geographic Data:</strong> Approximate location based on IP address geolocation</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.3 Learning Analytics</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                To enhance your educational experience and track certification progress, we collect detailed learning data:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Course Progress:</strong> Lessons completed, modules accessed, and overall course completion percentage</li>
                <li><strong>Video Engagement:</strong> Videos watched, playback duration, pause/resume patterns, and completion rates</li>
                <li><strong>Assessment Performance:</strong> Quiz scores, exam results, assignment submissions, and certification test attempts</li>
                <li><strong>Time on Task:</strong> Time spent on individual lessons, modules, and the platform overall</li>
                <li><strong>Community Participation:</strong> Forum posts, comments, reactions, and peer interactions</li>
                <li><strong>Resource Downloads:</strong> Worksheets, templates, and supplementary materials accessed</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.4 Cookies and Tracking Technologies</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use cookies and similar tracking technologies to collect and store information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for basic website functionality, authentication, and security</li>
                <li><strong>Functional Cookies:</strong> Remember your preferences, language settings, and login status</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website</li>
                <li><strong>Marketing Cookies:</strong> Track advertising effectiveness and enable targeted marketing</li>
                <li><strong>Third-Party Cookies:</strong> Set by our service providers for analytics and advertising purposes</li>
              </ul>
            </section>

            {/* Section 3: How We Use Information */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Settings className="w-6 h-6" style={{ color: BRAND.burgundy }} />
                3. How We Use Your Information
              </h2>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.1 Course Delivery and Educational Services</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Provide access to purchased courses, modules, and learning materials</li>
                <li>Track your progress through certification programs</li>
                <li>Deliver personalized learning recommendations based on your performance</li>
                <li>Facilitate community discussions and peer-to-peer learning</li>
                <li>Provide coaching, mentorship, and student support services</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.2 Certification and Credentialing</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Issue certificates, mini-diplomas, and professional credentials upon program completion</li>
                <li>Maintain credential verification systems for employers and organizations</li>
                <li>Track continuing education requirements and credential renewals</li>
                <li>Provide certification status to authorized verification requesters</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.3 Marketing and Communications</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Send transactional emails regarding your account and courses</li>
                <li>Deliver newsletters, educational content, and program updates</li>
                <li>Notify you of new courses, features, and special offers</li>
                <li>Conduct surveys and collect feedback to improve our services</li>
                <li>Personalize marketing messages based on your interests and behavior</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.4 Analytics and Service Improvement</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Analyze usage patterns to improve our platform and courses</li>
                <li>Develop new features, content, and educational programs</li>
                <li>Measure the effectiveness of our marketing campaigns</li>
                <li>Conduct research and analysis to enhance learning outcomes</li>
                <li>Generate aggregated, anonymized reports for internal use</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.5 Security and Fraud Prevention</h3>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Protect against unauthorized access, fraud, and security threats</li>
                <li>Verify user identity and prevent account sharing violations</li>
                <li>Investigate and respond to security incidents</li>
                <li>Document transactions for dispute resolution purposes</li>
                <li>Comply with anti-fraud and anti-money laundering requirements</li>
              </ul>
            </section>

            {/* Section 4: Legal Bases for Processing */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Scale className="w-6 h-6" style={{ color: BRAND.burgundy }} />
                4. Legal Bases for Processing
              </h2>

              <p className="text-gray-700 leading-relaxed mb-4">
                We process your personal information under the following legal bases:
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.1 Contractual Necessity</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Processing necessary to fulfill our contract with you, including providing access to courses, tracking your progress, issuing certificates, and delivering customer support. Without this processing, we cannot provide our educational services.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.2 Consent</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Where you have given explicit consent, such as opting into marketing communications, participating in surveys, or enabling optional features. You may withdraw consent at any time without affecting the lawfulness of prior processing.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.3 Legitimate Interests</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Processing necessary for our legitimate business interests, provided these interests do not override your fundamental rights. Our legitimate interests include:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Improving our educational programs and platform functionality</li>
                <li>Preventing fraud and ensuring platform security</li>
                <li>Conducting business analytics and measuring performance</li>
                <li>Marketing our services to existing customers</li>
                <li>Maintaining records for legal and compliance purposes</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.4 Legal Obligations</h3>
              <p className="text-gray-700 leading-relaxed">
                Processing required to comply with applicable laws, regulations, legal processes, or enforceable governmental requests, including tax obligations, record-keeping requirements, and responding to subpoenas or court orders.
              </p>
            </section>

            {/* Section 5: Information Sharing */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-6 h-6" style={{ color: BRAND.burgundy }} />
                5. Information Sharing and Disclosure
              </h2>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.1 Service Providers</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We share information with third-party service providers who perform services on our behalf:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Payment Processors:</strong> Stripe, PayPal, and other payment platforms to process transactions</li>
                <li><strong>Cloud Hosting:</strong> Amazon Web Services, Vercel, and database hosting providers</li>
                <li><strong>Email Services:</strong> Transactional and marketing email delivery providers</li>
                <li><strong>Analytics:</strong> Google Analytics, Mixpanel, and similar analytics platforms</li>
                <li><strong>Customer Support:</strong> Helpdesk and live chat software providers</li>
                <li><strong>Video Hosting:</strong> Video streaming and content delivery networks</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                These providers are contractually bound to use your information only for the purposes we specify and to protect your information with appropriate security measures.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.2 Credential Verification</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                With your consent, we may share limited information with employers, healthcare organizations, or other parties seeking to verify your ASI credentials. Verification information is limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Your name as it appears on the credential</li>
                <li>Credential type and program completed</li>
                <li>Date of issuance and current validity status</li>
                <li>Continuing education compliance status (if applicable)</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.3 Legal Requirements</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may disclose your information when required by law or in response to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Valid subpoenas, court orders, or legal process</li>
                <li>Requests from law enforcement or regulatory agencies</li>
                <li>Investigations of fraud, security breaches, or Terms of Service violations</li>
                <li>Protection of our rights, property, or safety, or that of our users</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.4 Business Transfers</h3>
              <p className="text-gray-700 leading-relaxed">
                In the event of a merger, acquisition, reorganization, bankruptcy, or sale of all or part of our assets, your information may be transferred to the acquiring entity. We will notify you via email and/or prominent notice on our website of any change in ownership and your choices regarding your information.
              </p>
            </section>

            {/* Section 6: International Data Transfers */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Globe className="w-6 h-6" style={{ color: BRAND.burgundy }} />
                6. International Data Transfers
              </h2>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">6.1 Our Global Operations</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                ASI is headquartered in the United States with a regional office in Dubai, UAE. We serve students in over 45 countries worldwide. Your personal information may be transferred to, stored, and processed in the United States, UAE, or other countries where we or our service providers maintain facilities.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">6.2 Safeguards for International Transfers</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                When transferring personal data internationally, we implement appropriate safeguards to protect your information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Standard Contractual Clauses:</strong> We use EU-approved Standard Contractual Clauses (SCCs) for transfers from the European Economic Area</li>
                <li><strong>Data Processing Agreements:</strong> All service providers must sign agreements with data protection obligations</li>
                <li><strong>Adequacy Decisions:</strong> Where available, we rely on adequacy decisions by data protection authorities</li>
                <li><strong>Supplementary Measures:</strong> We implement additional technical and organizational measures as needed</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">6.3 Your Consent to Transfers</h3>
              <p className="text-gray-700 leading-relaxed">
                By using our services, you acknowledge and consent to the transfer of your information to countries that may have different data protection laws than your country of residence. We will always protect your information in accordance with this Privacy Policy regardless of where it is processed.
              </p>
            </section>

            {/* Section 7: Data Security */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6" style={{ color: BRAND.burgundy }} />
                7. Data Security
              </h2>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">7.1 Security Measures</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We implement comprehensive technical and organizational security measures to protect your personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Encryption:</strong> All data transmitted between your browser and our servers is encrypted using TLS/SSL protocols. Sensitive data at rest is encrypted using AES-256 encryption.</li>
                <li><strong>Access Controls:</strong> Role-based access controls limit employee access to personal data on a need-to-know basis. All access is logged and monitored.</li>
                <li><strong>Authentication:</strong> We require strong passwords and offer two-factor authentication (2FA) for enhanced account security.</li>
                <li><strong>Infrastructure Security:</strong> Our servers are hosted in SOC 2 Type II certified data centers with physical security controls, redundant power, and fire suppression systems.</li>
                <li><strong>Regular Audits:</strong> We conduct regular security assessments, vulnerability scans, and penetration testing.</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">7.2 Incident Response</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                In the event of a data breach or security incident:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>We maintain an incident response plan with defined roles and procedures</li>
                <li>We will investigate and contain the breach as quickly as possible</li>
                <li>We will notify affected users and relevant authorities as required by law</li>
                <li>We will provide guidance on steps you can take to protect yourself</li>
                <li>We will conduct a post-incident review and implement improvements</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">7.3 Your Security Responsibilities</h3>
              <p className="text-gray-700 leading-relaxed">
                You are responsible for maintaining the security of your account credentials, using strong passwords, enabling two-factor authentication when available, and promptly reporting any unauthorized access to your account.
              </p>
            </section>

            {/* Section 8: Data Retention */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Server className="w-6 h-6" style={{ color: BRAND.burgundy }} />
                8. Data Retention
              </h2>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">8.1 Retention Periods</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We retain your personal information for as long as necessary to fulfill the purposes outlined in this Privacy Policy:
              </p>
              <div className="bg-gray-50 rounded-lg p-6 mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-2 font-semibold text-gray-800">Data Type</th>
                      <th className="text-left py-2 font-semibold text-gray-800">Retention Period</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-700">
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Account Information</td>
                      <td className="py-2">Duration of account plus 7 years after closure</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Certification Records</td>
                      <td className="py-2">Permanently (required for credential verification)</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Course Progress Data</td>
                      <td className="py-2">Duration of account plus 3 years</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Transaction Records</td>
                      <td className="py-2">7 years (tax and legal compliance)</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Support Tickets</td>
                      <td className="py-2">3 years after resolution</td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="py-2">Marketing Preferences</td>
                      <td className="py-2">Until you unsubscribe plus 2 years</td>
                    </tr>
                    <tr>
                      <td className="py-2">Security Logs</td>
                      <td className="py-2">1 year</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">8.2 Extended Retention</h3>
              <p className="text-gray-700 leading-relaxed">
                We may retain certain information for longer periods when required by law, for dispute resolution, to enforce our agreements, or to maintain business records. Certification records are maintained permanently to enable lifetime credential verification.
              </p>
            </section>

            {/* Section 9: Your Privacy Rights */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <UserCheck className="w-6 h-6" style={{ color: BRAND.burgundy }} />
                9. Your Privacy Rights
              </h2>

              <p className="text-gray-700 leading-relaxed mb-4">
                Depending on your location, you may have the following rights regarding your personal information:
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                    <h4 className="font-semibold text-gray-800">Right to Access</h4>
                  </div>
                  <p className="text-sm text-gray-600">Request a copy of the personal information we hold about you.</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <RefreshCw className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                    <h4 className="font-semibold text-gray-800">Right to Correction</h4>
                  </div>
                  <p className="text-sm text-gray-600">Request correction of inaccurate or incomplete information.</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Trash2 className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                    <h4 className="font-semibold text-gray-800">Right to Deletion</h4>
                  </div>
                  <p className="text-sm text-gray-600">Request deletion of your personal information (subject to legal retention requirements).</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Download className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                    <h4 className="font-semibold text-gray-800">Right to Portability</h4>
                  </div>
                  <p className="text-sm text-gray-600">Receive your data in a structured, machine-readable format.</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Ban className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                    <h4 className="font-semibold text-gray-800">Right to Object</h4>
                  </div>
                  <p className="text-sm text-gray-600">Object to processing based on legitimate interests or for direct marketing.</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Key className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                    <h4 className="font-semibold text-gray-800">Right to Restrict</h4>
                  </div>
                  <p className="text-sm text-gray-600">Request restriction of processing in certain circumstances.</p>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">9.1 How to Exercise Your Rights</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                To exercise any of these rights, please contact us at <a href="mailto:privacy@accreditation-standards.org" className="font-medium hover:underline" style={{ color: BRAND.burgundy }}>privacy@accreditation-standards.org</a>. We will respond to your request within 30 days (or sooner if required by applicable law). We may need to verify your identity before processing your request.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">9.2 Opt-Out of Marketing</h3>
              <p className="text-gray-700 leading-relaxed">
                You can unsubscribe from marketing emails at any time by clicking the "unsubscribe" link in any email or by contacting us directly. Please note that you will continue to receive transactional emails related to your account and courses even after opting out of marketing communications.
              </p>
            </section>

            {/* Section 10: California Privacy Rights */}
            <section className="mb-10">
              <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: `${BRAND.burgundy}08`, border: `2px solid ${BRAND.burgundy}20` }}>
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2" style={{ color: BRAND.burgundyDark }}>
                  <Shield className="w-6 h-6" />
                  10. California Privacy Rights (CCPA/CPRA)
                </h2>
                <p className="text-sm" style={{ color: BRAND.burgundy }}>
                  Additional rights for California residents under the California Consumer Privacy Act and California Privacy Rights Act.
                </p>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">10.1 Your California Rights</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you are a California resident, you have additional rights under the CCPA/CPRA:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Right to Know:</strong> Request disclosure of the categories and specific pieces of personal information we have collected about you, the sources, purposes for collection, and third parties with whom we share it.</li>
                <li><strong>Right to Delete:</strong> Request deletion of your personal information (subject to exceptions for legal retention).</li>
                <li><strong>Right to Correct:</strong> Request correction of inaccurate personal information.</li>
                <li><strong>Right to Opt-Out of Sale/Sharing:</strong> We do not sell personal information. If we share personal information for targeted advertising, you can opt out.</li>
                <li><strong>Right to Limit Use of Sensitive Information:</strong> Limit how we use sensitive personal information to purposes necessary for providing our services.</li>
                <li><strong>Right to Non-Discrimination:</strong> We will not discriminate against you for exercising your privacy rights.</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">10.2 Categories of Information Collected</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                In the preceding 12 months, we have collected the following categories of personal information:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Identifiers (name, email, IP address)</li>
                <li>Customer records (billing information, purchase history)</li>
                <li>Commercial information (products purchased, course enrollments)</li>
                <li>Internet activity (browsing history, course interactions)</li>
                <li>Geolocation data (approximate location from IP)</li>
                <li>Professional information (credentials, work history)</li>
                <li>Education information (course progress, certifications earned)</li>
                <li>Inferences drawn from the above categories</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">10.3 Submitting Requests</h3>
              <p className="text-gray-700 leading-relaxed">
                California residents may submit requests by emailing <a href="mailto:privacy@accreditation-standards.org" className="font-medium hover:underline" style={{ color: BRAND.burgundy }}>privacy@accreditation-standards.org</a> with "California Privacy Request" in the subject line. You may designate an authorized agent to make requests on your behalf. We may require verification of your identity and authorization.
              </p>
            </section>

            {/* Section 11: European Privacy Rights */}
            <section className="mb-10">
              <div className="rounded-xl p-6 mb-6" style={{ backgroundColor: `${BRAND.burgundy}08`, border: `2px solid ${BRAND.burgundy}20` }}>
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2" style={{ color: BRAND.burgundyDark }}>
                  <Globe className="w-6 h-6" />
                  11. European Privacy Rights (GDPR)
                </h2>
                <p className="text-sm" style={{ color: BRAND.burgundy }}>
                  Additional protections for residents of the European Economic Area, United Kingdom, and Switzerland.
                </p>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">11.1 Your GDPR Rights</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you are located in the EEA, UK, or Switzerland, you have the following rights under the General Data Protection Regulation:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Right of Access (Art. 15):</strong> Obtain confirmation of processing and access to your personal data.</li>
                <li><strong>Right to Rectification (Art. 16):</strong> Correct inaccurate personal data without undue delay.</li>
                <li><strong>Right to Erasure (Art. 17):</strong> Request deletion ("right to be forgotten") in certain circumstances.</li>
                <li><strong>Right to Restriction (Art. 18):</strong> Restrict processing when accuracy is contested or processing is unlawful.</li>
                <li><strong>Right to Data Portability (Art. 20):</strong> Receive data in a structured, commonly used format.</li>
                <li><strong>Right to Object (Art. 21):</strong> Object to processing based on legitimate interests or for direct marketing.</li>
                <li><strong>Right Related to Automated Decisions (Art. 22):</strong> Not be subject to decisions based solely on automated processing with legal effects.</li>
                <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time without affecting prior lawful processing.</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">11.2 Supervisory Authority</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You have the right to lodge a complaint with a supervisory authority in your country of residence if you believe our processing violates applicable data protection laws.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">11.3 EU Representative</h3>
              <p className="text-gray-700 leading-relaxed">
                While ASI is based in the United States, we are committed to GDPR compliance for our European users. For GDPR-related inquiries, please contact <a href="mailto:privacy@accreditation-standards.org" className="font-medium hover:underline" style={{ color: BRAND.burgundy }}>privacy@accreditation-standards.org</a>.
              </p>
            </section>

            {/* Section 12: Cookies and Tracking */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Cookie className="w-6 h-6" style={{ color: BRAND.burgundy }} />
                12. Cookies and Tracking Technologies
              </h2>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">12.1 Types of Cookies We Use</h3>
              <div className="space-y-4 mb-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Strictly Necessary Cookies</h4>
                  <p className="text-sm text-gray-600">Essential for website functionality, authentication, and security. Cannot be disabled.</p>
                  <p className="text-xs text-gray-500 mt-1">Examples: Session cookies, CSRF tokens, load balancing cookies</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Functional Cookies</h4>
                  <p className="text-sm text-gray-600">Remember your preferences and provide enhanced features.</p>
                  <p className="text-xs text-gray-500 mt-1">Examples: Language preferences, video player settings, remembered login</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Analytics Cookies</h4>
                  <p className="text-sm text-gray-600">Help us understand how visitors use our website to improve performance.</p>
                  <p className="text-xs text-gray-500 mt-1">Examples: Google Analytics, page view tracking, user journey analysis</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Marketing Cookies</h4>
                  <p className="text-sm text-gray-600">Track advertising effectiveness and enable personalized advertising.</p>
                  <p className="text-xs text-gray-500 mt-1">Examples: Facebook Pixel, Google Ads, retargeting cookies</p>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">12.2 Managing Cookies</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You can control cookies through your browser settings:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Block all cookies (may prevent some features from working)</li>
                <li>Block third-party cookies only</li>
                <li>Delete cookies when you close your browser</li>
                <li>Be notified before cookies are set</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">12.3 Do Not Track</h3>
              <p className="text-gray-700 leading-relaxed">
                Some browsers offer a "Do Not Track" (DNT) setting. Currently, there is no industry standard for how websites should respond to DNT signals. Our website does not currently respond to DNT signals, but we respect your choices through the cookie management options described above.
              </p>
            </section>

            {/* Section 13: Children's Privacy */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Baby className="w-6 h-6" style={{ color: BRAND.burgundy }} />
                13. Children's Privacy
              </h2>

              <p className="text-gray-700 leading-relaxed mb-4">
                Our services are designed for adult professional education and are not directed to children under 18 years of age. We do not knowingly collect personal information from children under 18.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">13.1 Age Restrictions</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You must be at least 18 years of age (or the age of majority in your jurisdiction) to create an account, purchase courses, or use our services. By using our services, you represent that you meet this age requirement.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">13.2 Parental Notice</h3>
              <p className="text-gray-700 leading-relaxed">
                If we learn that we have collected personal information from a child under 18, we will delete that information as quickly as possible. If you believe we have inadvertently collected information from a child, please contact us immediately at <a href="mailto:privacy@accreditation-standards.org" className="font-medium hover:underline" style={{ color: BRAND.burgundy }}>privacy@accreditation-standards.org</a>.
              </p>
            </section>

            {/* Section 14: Third-Party Links */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <ExternalLink className="w-6 h-6" style={{ color: BRAND.burgundy }} />
                14. Third-Party Links and Services
              </h2>

              <p className="text-gray-700 leading-relaxed mb-4">
                Our website and services may contain links to third-party websites, services, or content that are not owned or controlled by ASI. This Privacy Policy applies only to information collected by our services.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">14.1 Third-Party Websites</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We are not responsible for the privacy practices of third-party websites. When you leave our platform via external links, we encourage you to read the privacy policies of those websites before providing any personal information.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">14.2 Social Media Features</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our website includes social media features such as share buttons and links to our social media profiles. These features may collect information about your IP address and pages visited, and may set cookies. Your interactions with these features are governed by the privacy policies of the respective social media platforms.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">14.3 Third-Party Integrations</h3>
              <p className="text-gray-700 leading-relaxed">
                Some features may require integration with third-party services (e.g., payment processors, video hosting). These integrations are governed by the respective third parties' privacy policies, and we encourage you to review them.
              </p>
            </section>

            {/* Section 15: Changes to Policy */}
            <section className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Bell className="w-6 h-6" style={{ color: BRAND.burgundy }} />
                15. Changes to This Privacy Policy
              </h2>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">15.1 Policy Updates</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. The "Last Updated" date at the top of this page indicates when the policy was last revised.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">15.2 Notification of Changes</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                For material changes to this Privacy Policy, we will:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Post the updated policy on our website with a new "Last Updated" date</li>
                <li>Send an email notification to registered users</li>
                <li>Display a prominent notice on our platform</li>
                <li>Where required by law, obtain your consent before implementing changes</li>
              </ul>

              <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">15.3 Continued Use</h3>
              <p className="text-gray-700 leading-relaxed">
                Your continued use of our services after the effective date of any changes constitutes your acceptance of the revised Privacy Policy. If you do not agree with the updated policy, you should stop using our services and may request account deletion.
              </p>
            </section>

            {/* Section 16: Contact Information */}
            <section className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="w-6 h-6" style={{ color: BRAND.burgundy }} />
                16. Contact Information
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="rounded-xl p-6 border" style={{ backgroundColor: `${BRAND.burgundy}08`, borderColor: `${BRAND.burgundy}20` }}>
                <p className="text-gray-900 font-bold text-lg mb-3">Accreditation Standards Institute LLC</p>
                <div className="space-y-2 text-gray-700">
                  <p>United States Headquarters</p>
                  <p>Dubai, UAE Regional Office</p>
                  <p className="pt-2">
                    <strong>Privacy Inquiries:</strong>{" "}
                    <a href="mailto:privacy@accreditation-standards.org" className="font-medium hover:underline" style={{ color: BRAND.burgundy }}>
                      privacy@accreditation-standards.org
                    </a>
                  </p>
                  <p>
                    <strong>General Support:</strong>{" "}
                    <a href="mailto:legal@accredipro.academy" className="font-medium hover:underline" style={{ color: BRAND.burgundy }}>
                      legal@accredipro.academy
                    </a>
                  </p>
                  <p>
                    <strong>Website:</strong>{" "}
                    <a href="https://accreditation-standards.org" className="font-medium hover:underline" style={{ color: BRAND.burgundy }}>
                      accreditation-standards.org
                    </a>
                  </p>
                </div>
                <p className="text-gray-500 text-sm mt-4">
                  We aim to respond to all privacy inquiries within 30 days.
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  © {new Date().getFullYear()} Accreditation Standards Institute LLC. All Rights Reserved.
                </p>
              </div>
            </section>

          </CardContent>
        </Card>

        {/* Related Links */}
        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Link href="/terms-of-service">
            <Button variant="outline" className="hover:opacity-80" style={{ borderColor: `${BRAND.burgundy}40`, color: BRAND.burgundy }}>
              Terms of Service
            </Button>
          </Link>
          <Link href="/refund-policy">
            <Button variant="outline" className="hover:opacity-80" style={{ borderColor: `${BRAND.burgundy}40`, color: BRAND.burgundy }}>
              Refund Policy
            </Button>
          </Link>
          <Link href="/credential-terms">
            <Button variant="outline" className="hover:opacity-80" style={{ borderColor: `${BRAND.burgundy}40`, color: BRAND.burgundy }}>
              Credential Terms
            </Button>
          </Link>
          <Link href="/code-of-ethics">
            <Button variant="outline" className="hover:opacity-80" style={{ borderColor: `${BRAND.burgundy}40`, color: BRAND.burgundy }}>
              Code of Ethics
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-white py-8 mt-12" style={{ backgroundColor: BRAND.burgundyDark }}>
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm" style={{ color: '#d1d5db' }}>
            © {new Date().getFullYear()} Accreditation Standards Institute LLC. All rights reserved.
          </p>
          <p className="text-xs mt-2" style={{ color: '#9ca3af' }}>
            The Global Authority in Functional Medicine & Health Certification
          </p>
        </div>
      </footer>
    </div>
  );
}
