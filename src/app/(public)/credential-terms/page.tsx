import Link from "next/link";
import Image from "next/image";
import { Award, Mail, Calendar, ArrowLeft, AlertTriangle, CheckCircle, XCircle, Shield, FileText, BadgeCheck, Ban, Scale, UserCheck, Building2, Globe } from "lucide-react";
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
  title: "Credential Terms & Conditions | Accreditation Standards Institute",
  description: "Terms governing the use of ASI certifications, credentials, and professional designations. Requirements for certification maintenance and permitted usage.",
};

export default function CredentialTermsPage() {
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
              <Award className="w-6 h-6" style={{ color: BRAND.gold }} />
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${BRAND.gold}20`, color: BRAND.gold, border: `1px solid ${BRAND.gold}40` }}>
              Certification Terms
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Credential Terms & Conditions</h1>
          <p className="text-lg mb-2" style={{ color: '#f5f5f5' }}>
            Terms Governing ASI Certifications and Professional Designations
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

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 md:p-12">

            {/* Section 1: Nature of ASI Credentials */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <Award className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Article 1: Nature of ASI Credentials</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>1.1</strong> Accreditation Standards Institute (ASI) certifications represent the successful completion of rigorous educational training programs in health and wellness disciplines. These are private, educational credentials signifying that the holder has demonstrated competency through required coursework, assessments, and examinations.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>1.2</strong> ASI certification programs include, but are not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
                <li>Certified Functional Medicine Health Coach (CFMHC)</li>
                <li>Certified Holistic Nutrition Coach (CHNC)</li>
                <li>Certified Women's Health Specialist (CWHS)</li>
                <li>Certified Integrative Wellness Practitioner (CIWP)</li>
                <li>Certified Metabolic Health Coach (CMHC)</li>
                <li>Mini-Diploma programs and specialty certifications</li>
              </ul>
              <div className="rounded-xl p-6 border" style={{ backgroundColor: '#eff6ff', borderColor: '#3b82f6' }}>
                <h4 className="font-bold mb-2" style={{ color: '#1e40af' }}>Critical Understanding</h4>
                <p className="text-sm leading-relaxed" style={{ color: '#1d4ed8' }}>
                  ASI certifications are <strong>educational credentials</strong>, not professional licenses issued by governmental bodies. They do not grant legal authority to practice medicine, psychology, counseling, registered dietetics, or any profession requiring state or federal licensure. Graduates must independently verify and comply with all licensure and regulatory requirements in their jurisdiction.
                </p>
              </div>
            </section>

            {/* Section 2: Certification Requirements */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <BadgeCheck className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Article 2: Certification Requirements</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                To earn and maintain an ASI certification in good standing, you must satisfy all of the following requirements:
              </p>
              <div className="rounded-xl p-6 border" style={{ backgroundColor: '#f0fdf4', borderColor: '#22c55e' }}>
                <ul className="space-y-3 text-gray-800">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span><strong>Complete all required coursework</strong> as verified by the ASI Learning Management System (LMS), with minimum progress thresholds achieved</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span><strong>Pass the certification examination</strong> with a minimum passing score of 80% or as specified for your certification program</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span><strong>Complete all required assignments, case studies, and practical assessments</strong> as specified in your program curriculum</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span><strong>Execute the ASI Code of Ethics Agreement</strong> and commit to upholding professional standards</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span><strong>Maintain good standing</strong> with ASI by adhering to all policies, terms, and ethical guidelines</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span><strong>Operate exclusively within the defined scope of practice</strong> for your certification level</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span><strong>Satisfy all financial obligations</strong> to ASI without dispute, chargeback, or default</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 3: Permitted Use of Credentials */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#dcfce7' }}>
                  <CheckCircle className="w-5 h-5" style={{ color: '#16a34a' }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Article 3: Permitted Use of Credentials</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>3.1</strong> Upon successful certification and while maintaining good standing, you are granted a limited, non-exclusive, non-transferable license to use your ASI credential as follows:
              </p>
              <div className="rounded-xl p-6 border mb-6" style={{ backgroundColor: '#f0fdf4', borderColor: '#22c55e' }}>
                <h4 className="font-bold mb-3" style={{ color: '#15803d' }}>Authorized Uses:</h4>
                <ul className="space-y-2 text-gray-800">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span>Display your official ASI digital certificate on your website, social media profiles, and professional platforms</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span>Include your certification title and designation on business cards, letterhead, and marketing materials</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span>Reference your training from Accreditation Standards Institute in professional biographies</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span>Use approved credential designations after your name (e.g., "Jane Smith, CFMHC")</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span>Share your certificate with prospective clients, employers, or collaborative healthcare providers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span>Include certification details on your resume, CV, and professional profiles (LinkedIn, etc.)</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span>State that you are "Certified by the Accreditation Standards Institute"</span>
                  </li>
                </ul>
              </div>
              <p className="text-gray-700 leading-relaxed">
                <strong>3.2</strong> Proper designation format examples:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mt-2">
                <li>"Jane Smith, Certified Functional Medicine Health Coach (ASI)"</li>
                <li>"John Doe, CFMHC — Accreditation Standards Institute"</li>
                <li>"Sarah Johnson — ASI Certified Holistic Nutrition Coach"</li>
              </ul>
            </section>

            {/* Section 4: Prohibited Uses */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fef2f2' }}>
                  <XCircle className="w-5 h-5" style={{ color: '#dc2626' }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Article 4: Prohibited Uses</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                The following uses of ASI credentials are strictly prohibited and may result in immediate credential revocation and legal action:
              </p>
              <div className="rounded-xl p-6 border mb-4" style={{ backgroundColor: '#fef2f2', borderColor: '#ef4444' }}>
                <ul className="space-y-3 text-gray-800">
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                    <span><strong>Claiming to be a medical doctor, licensed physician, registered dietitian, licensed nutritionist, licensed therapist, counselor, psychologist,</strong> or any other licensed professional unless you independently hold such license</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                    <span><strong>Implying that your ASI certification grants medical authority</strong> or the ability to diagnose, treat, prescribe, or cure</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                    <span><strong>Using your certification to diagnose conditions, treat diseases, prescribe medications or supplements,</strong> or provide services requiring professional licensure</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                    <span><strong>Transferring, selling, lending, or sharing</strong> your certification or credential with any other person or entity</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                    <span><strong>Altering, forging, modifying, or misrepresenting</strong> your certificate, credential, or any ASI documentation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                    <span><strong>Continuing to use credentials</strong> if your certification has been revoked, suspended, or is not in good standing</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                    <span><strong>Misrepresenting the nature, scope, or authority</strong> of your ASI training or certification to clients, employers, or the public</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                    <span><strong>Using ASI credentials in connection with illegal activities,</strong> fraud, or services that violate applicable laws</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 5: Credential Verification */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <UserCheck className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Article 5: Credential Verification</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>5.1</strong> ASI maintains a secure database of all certified graduates. Third parties, including prospective clients, employers, healthcare organizations, and regulatory bodies, may request verification of credentials.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>5.2</strong> Upon receipt of a legitimate verification request containing the graduate's name and consent, ASI will confirm:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Whether the individual holds an active ASI certification</li>
                <li>The specific certification program completed</li>
                <li>The date of certification issuance</li>
                <li>The current standing of the certification (active, suspended, or revoked)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                <strong>5.3</strong> By accepting your ASI certification, you consent to ASI responding to legitimate verification requests and maintaining your certification status in our verification system.
              </p>
              <div className="rounded-xl p-4 mt-4 border" style={{ backgroundColor: BRAND.cream, borderColor: `${BRAND.gold}30` }}>
                <p className="text-sm text-gray-700">
                  <strong>Verification requests:</strong>{" "}
                  <a href="mailto:verify@accreditation-standards.org" className="hover:underline font-medium" style={{ color: BRAND.burgundy }}>
                    verify@accreditation-standards.org
                  </a>
                  {" "}or visit{" "}
                  <a href="/verify" className="hover:underline font-medium" style={{ color: BRAND.burgundy }}>
                    accreditation-standards.org/verify
                  </a>
                </p>
              </div>
            </section>

            {/* Section 6: Revocation of Certification */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fef2f2' }}>
                  <Ban className="w-5 h-5" style={{ color: '#dc2626' }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Article 6: Revocation and Suspension of Certification</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>6.1</strong> ASI reserves the absolute right to revoke or suspend any certification at any time for cause, including but not limited to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Violation of the ASI Code of Ethics</li>
                <li>Practicing outside the defined scope of practice</li>
                <li>Misrepresentation of credentials, qualifications, or training</li>
                <li>Fraud, dishonesty, or material misrepresentation to ASI</li>
                <li>Legal violations related to health coaching, wellness, or business practices</li>
                <li>Conduct that harms clients or brings disrepute to ASI</li>
                <li>Initiating a chargeback, payment dispute, or defaulting on financial obligations to ASI</li>
                <li>Conviction of a felony or crime involving moral turpitude</li>
                <li>Failure to comply with these Credential Terms or ASI's Terms of Service</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>6.2</strong> Upon revocation or suspension, you must immediately:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Cease all use of ASI credentials, titles, designations, and certifications</li>
                <li>Remove all references to ASI certification from your marketing materials, website, social media, and professional profiles</li>
                <li>Discontinue any representation that you are certified by ASI</li>
                <li>Notify clients that your ASI certification is no longer active</li>
              </ul>
              <div className="rounded-xl p-4 border" style={{ backgroundColor: '#fef2f2', borderColor: '#ef4444' }}>
                <p className="text-sm leading-relaxed font-medium" style={{ color: '#991b1b' }}>
                  <strong>Notice:</strong> Continued use of ASI credentials after revocation or suspension constitutes fraud and trademark infringement. ASI will pursue all available legal remedies, including injunctive relief, monetary damages, and attorney's fees.
                </p>
              </div>
            </section>

            {/* Section 7: Lifetime Credential Policy */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <Globe className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Article 7: Lifetime Credential Policy</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>7.1</strong> ASI certifications, once earned and while in good standing, do not expire and do not require periodic renewal fees. Your credential remains valid for life, subject to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Continued compliance with these Credential Terms</li>
                <li>Adherence to the ASI Code of Ethics</li>
                <li>Operating within your defined scope of practice</li>
                <li>Maintaining good standing with ASI</li>
                <li>No outstanding financial disputes or chargebacks</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                <strong>7.2</strong> While continuing education is strongly encouraged for professional development, ASI does not currently mandate continuing education credits for credential maintenance.
              </p>
            </section>

            {/* Section 8: Intellectual Property */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <Shield className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Article 8: Intellectual Property Rights</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>8.1</strong> The following are trademarks and intellectual property of Accreditation Standards Institute LLC:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-1 mb-4">
                <li>"Accreditation Standards Institute," "ASI," and the ASI logo</li>
                <li>All certification program names and credential designations</li>
                <li>Certificate designs, digital badges, and verification seals</li>
                <li>Course curricula, lesson content, and educational materials</li>
              </ul>
              <p className="text-gray-700 leading-relaxed">
                <strong>8.2</strong> Your credential grants a limited license to use your specific certification title. It does not grant any ownership, license, or rights to ASI's trademarks, logos, or intellectual property beyond what is expressly permitted in these Terms.
              </p>
            </section>

            {/* Section 9: Governing Law */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <Scale className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Article 9: Governing Law and Dispute Resolution</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>9.1</strong> These Credential Terms are governed by and construed in accordance with the laws of the State of Delaware, United States, without regard to conflict of law principles.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>9.2</strong> Any dispute arising from or relating to these Credential Terms, your certification, or your use of ASI credentials shall be resolved through binding arbitration administered by the American Arbitration Association in accordance with its Commercial Arbitration Rules.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>9.3</strong> You waive any right to participate in class actions or class-wide arbitration.
              </p>
            </section>

            {/* Section 10: Amendments */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <FileText className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Article 10: Amendments</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>10.1</strong> ASI reserves the right to modify these Credential Terms at any time. Material changes will be communicated via email to the address on file and posted on our website.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>10.2</strong> Continued use of your ASI credential after the effective date of any changes constitutes acceptance of the revised terms.
              </p>
            </section>

            {/* Contact Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <Mail className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">Article 11: Contact Information</h2>
              </div>
              <div className="rounded-xl p-6 border" style={{ backgroundColor: BRAND.cream, borderColor: `${BRAND.gold}30` }}>
                <p className="font-bold text-gray-900 mb-3">Accreditation Standards Institute LLC</p>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Credential Questions:</strong>{" "}
                    <a href="mailto:credentials@accreditation-standards.org" className="hover:underline font-medium" style={{ color: BRAND.burgundy }}>
                      credentials@accreditation-standards.org
                    </a>
                  </p>
                  <p>
                    <strong>Verification Requests:</strong>{" "}
                    <a href="mailto:verify@accreditation-standards.org" className="hover:underline font-medium" style={{ color: BRAND.burgundy }}>
                      verify@accreditation-standards.org
                    </a>
                  </p>
                  <p>
                    <strong>Legal Inquiries:</strong>{" "}
                    <a href="mailto:legal@accreditation-standards.org" className="hover:underline font-medium" style={{ color: BRAND.burgundy }}>
                      legal@accreditation-standards.org
                    </a>
                  </p>
                  <p>
                    <strong>General Support:</strong>{" "}
                    <a href="mailto:legal@accredipro.academy" className="hover:underline font-medium" style={{ color: BRAND.burgundy }}>
                      legal@accredipro.academy
                    </a>
                  </p>
                </div>
                <div className="mt-4 pt-4 border-t" style={{ borderColor: `${BRAND.gold}30` }}>
                  <p className="text-sm text-gray-600">
                    <strong>Legal Entity:</strong> Accreditation Standards Institute LLC, a Delaware Limited Liability Company
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Offices:</strong> United States (Headquarters) • Dubai, UAE (International Office)
                  </p>
                </div>
              </div>
            </section>

          </CardContent>
        </Card>

        {/* Related Legal Documents */}
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-4">Related Legal Documents</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/code-of-ethics">
              <Button variant="outline" className="border-gray-200 hover:border-gray-300" style={{ color: BRAND.burgundy }}>
                Code of Ethics
              </Button>
            </Link>
            <Link href="/trademark-usage">
              <Button variant="outline" className="border-gray-200 hover:border-gray-300" style={{ color: BRAND.burgundy }}>
                Trademark Usage
              </Button>
            </Link>
            <Link href="/scope-of-practice">
              <Button variant="outline" className="border-gray-200 hover:border-gray-300" style={{ color: BRAND.burgundy }}>
                Scope of Practice
              </Button>
            </Link>
            <Link href="/terms-of-service">
              <Button variant="outline" className="border-gray-200 hover:border-gray-300" style={{ color: BRAND.burgundy }}>
                Terms of Service
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <Image
                src="/ASI_LOGO-removebg-preview.png"
                alt="ASI"
                width={100}
                height={30}
                className="h-8 w-auto"
              />
              <span className="text-sm text-gray-600">
                © {new Date().getFullYear()} Accreditation Standards Institute LLC. All rights reserved.
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-gray-600">
              <Link href="/terms-of-service" className="hover:underline" style={{ color: BRAND.burgundy }}>
                Terms
              </Link>
              <Link href="/privacy-policy" className="hover:underline" style={{ color: BRAND.burgundy }}>
                Privacy
              </Link>
              <Link href="/contact" className="hover:underline" style={{ color: BRAND.burgundy }}>
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
