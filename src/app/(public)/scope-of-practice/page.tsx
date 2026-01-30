import Link from "next/link";
import Image from "next/image";
import { Scale, Mail, Calendar, ArrowLeft, AlertTriangle, CheckCircle, XCircle, Shield, Users, Heart, Stethoscope, GraduationCap, FileText, Building2 } from "lucide-react";
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
  title: "Scope of Practice | Accreditation Standards Institute",
  description: "Professional scope of practice guidelines for ASI certified health and wellness coaches, functional medicine practitioners, and nutrition professionals.",
};

export default function ScopeOfPracticePage() {
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
              <Scale className="w-6 h-6" style={{ color: BRAND.gold }} />
            </div>
            <span className="px-3 py-1 rounded-full text-sm font-medium" style={{ backgroundColor: `${BRAND.gold}20`, color: BRAND.gold, border: `1px solid ${BRAND.gold}40` }}>
              Professional Guidelines
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">Scope of Practice</h1>
          <p className="text-lg mb-2" style={{ color: '#f5f5f5' }}>
            Professional Boundaries for ASI-Certified Practitioners
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

      {/* Critical Notice */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="rounded-xl p-6 border-2" style={{ backgroundColor: '#fef3c7', borderColor: '#f59e0b' }}>
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#d97706' }} />
            <div>
              <h3 className="font-bold mb-2" style={{ color: '#92400e' }}>Critical Professional Compliance Notice</h3>
              <p className="text-sm leading-relaxed" style={{ color: '#a16207' }}>
                This document defines the professional boundaries for all ASI-certified practitioners. Understanding and adhering to your scope of practice is not optional—it is a legal and ethical requirement. Violations may result in immediate credential revocation, legal liability, and harm to clients. Health and wellness coaching is a distinct profession from licensed medical practice, psychotherapy, and registered dietetics.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 pb-12">
        <Card className="border-0 shadow-lg">
          <CardContent className="p-8 md:p-12">

            {/* Section 1: Definition */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <Shield className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">1. Definition of an ASI-Certified Health and Wellness Professional</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                An Accreditation Standards Institute (ASI) certified health and wellness professional is a trained practitioner who has successfully completed rigorous ASI certification coursework in areas including but not limited to: functional medicine coaching, holistic nutrition, women's health, metabolic health, and integrative wellness.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                ASI-certified practitioners partner with clients to facilitate and empower lasting lifestyle and behavior changes in alignment with the client's personal values, health goals, and vision of optimal wellness.
              </p>
              <div className="rounded-xl p-6 border" style={{ backgroundColor: `${BRAND.cream}`, borderColor: `${BRAND.gold}30` }}>
                <h4 className="font-bold mb-2" style={{ color: BRAND.burgundy }}>Core Professional Identity</h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Health coaches and wellness practitioners support clients in taking meaningful action toward health goals, provide accountability structures, help navigate obstacles, and educate on general wellness principles. They do NOT diagnose diseases, prescribe medications or treatments, provide medical nutrition therapy, or deliver psychotherapy.
                </p>
              </div>
            </section>

            {/* Section 2: What Practitioners CAN Do */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#dcfce7' }}>
                  <CheckCircle className="w-5 h-5" style={{ color: '#16a34a' }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">2. Authorized Scope: What ASI Practitioners CAN Do</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Within your scope of practice as an ASI-certified professional, you are authorized to:
              </p>
              <div className="rounded-xl p-6 border" style={{ backgroundColor: '#f0fdf4', borderColor: '#22c55e' }}>
                <ul className="space-y-3 text-gray-800">
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span><strong>Provide health education</strong> on general wellness topics, including nutrition fundamentals, stress management, sleep hygiene, movement principles, and lifestyle optimization strategies</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span><strong>Facilitate goal-setting</strong> and help clients clarify their personal health vision, values, and priorities using evidence-based coaching methodologies</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span><strong>Support behavior change</strong> through accountability partnerships, motivational interviewing techniques, habit formation strategies, and progress monitoring</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span><strong>Share general information</strong> about nutrition (whole foods, macronutrients, meal planning), physical activity, circadian health, stress resilience, and emotional wellness</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span><strong>Develop personalized action plans</strong> for lifestyle modifications that support the client's stated health goals, within general wellness parameters</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span><strong>Provide encouragement and celebrate progress</strong>, helping clients recognize achievements and maintain motivation</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span><strong>Ask powerful, open-ended questions</strong> that promote self-discovery, insight, and client-directed solutions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span><strong>Refer to licensed healthcare professionals</strong> when client needs exceed your scope of practice</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span><strong>Share recipes, meal ideas, and wellness resources</strong> as general educational information</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span><strong>Teach stress management techniques</strong> such as breathing exercises, mindfulness practices, and relaxation strategies</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span><strong>Track and monitor client progress</strong> toward self-defined wellness goals using appropriate assessment tools</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#16a34a' }} />
                    <span><strong>Support clients in implementing recommendations</strong> from their licensed healthcare providers, without contradiction or modification</span>
                  </li>
                </ul>
              </div>
            </section>

            {/* Section 3: What Practitioners CANNOT Do */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fef2f2' }}>
                  <XCircle className="w-5 h-5" style={{ color: '#dc2626' }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">3. Prohibited Activities: What ASI Practitioners CANNOT Do</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                The following activities are strictly prohibited and constitute practice outside your scope. Violations may result in immediate credential revocation and legal consequences:
              </p>
              <div className="rounded-xl p-6 border mb-4" style={{ backgroundColor: '#fef2f2', borderColor: '#ef4444' }}>
                <ul className="space-y-3 text-gray-800">
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                    <span><strong>Diagnose</strong> any disease, illness, medical condition, mental health disorder, or pathology</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                    <span><strong>Prescribe</strong> medications, supplements for therapeutic purposes, or specific treatments for medical conditions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                    <span><strong>Provide Medical Nutrition Therapy (MNT)</strong> for diseases such as diabetes management, renal disease, cardiovascular disease, or eating disorders</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                    <span><strong>Treat</strong> eating disorders, mental health conditions, substance abuse, or addictions</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                    <span><strong>Provide psychotherapy, counseling, or psychological treatment</strong> of any kind</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                    <span><strong>Interpret laboratory results</strong>, medical imaging, or clinical diagnostic tests</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                    <span><strong>Recommend discontinuing or modifying</strong> prescribed medications, treatments, or medical recommendations</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                    <span><strong>Claim to cure, heal, treat, or reverse</strong> any medical condition or disease</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                    <span><strong>Perform physical assessments</strong>, medical examinations, or clinical procedures</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                    <span><strong>Use protected professional titles</strong> (Doctor, Physician, Registered Dietitian, Nutritionist, Therapist, Counselor, Psychologist) unless separately and appropriately licensed</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                    <span><strong>Practice beyond your training</strong> or ASI certification scope</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#dc2626' }} />
                    <span><strong>Order laboratory tests</strong> or diagnostic procedures</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-xl p-4 border" style={{ backgroundColor: '#fffbeb', borderColor: '#f59e0b' }}>
                <p className="text-sm leading-relaxed" style={{ color: '#92400e' }}>
                  <strong>Jurisdictional Note:</strong> Some activities may be permissible in certain jurisdictions with additional licensing or credentials. Always verify the specific laws, regulations, and scope of practice requirements in your location before offering services.
                </p>
              </div>
            </section>

            {/* Section 4: Mandatory Referrals */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <Users className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">4. Mandatory Referral Situations</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                A responsible ASI-certified practitioner knows when to refer clients to appropriate licensed healthcare professionals. You are obligated to refer when a client:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                <li>Describes symptoms that may indicate an undiagnosed medical condition</li>
                <li>Has not seen a physician for concerning health issues or symptoms</li>
                <li>Shows signs of disordered eating, body dysmorphia, or eating disorders</li>
                <li>Expresses suicidal ideation, self-harm thoughts, or severe depression</li>
                <li>Requires medical nutrition therapy for a diagnosed condition</li>
                <li>Needs psychological, psychiatric, or addiction treatment</li>
                <li>Has complex chronic conditions requiring medical oversight</li>
                <li>Requests advice that exceeds your knowledge or certification scope</li>
                <li>Experiences adverse reactions to any wellness recommendations</li>
                <li>Is pregnant or postpartum with complications</li>
                <li>Has a history of cardiac events or is at high cardiovascular risk</li>
              </ul>
              <div className="rounded-xl p-6 border" style={{ backgroundColor: '#eff6ff', borderColor: '#3b82f6' }}>
                <div className="flex items-start gap-3">
                  <Stethoscope className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: '#2563eb' }} />
                  <div>
                    <h4 className="font-bold mb-2" style={{ color: '#1e40af' }}>The Golden Rule: When In Doubt, Refer Out</h4>
                    <p className="text-sm leading-relaxed" style={{ color: '#1d4ed8' }}>
                      It is always better to refer a client to a qualified licensed professional than to risk harm by operating outside your scope. Build and maintain a network of trusted healthcare providers (physicians, registered dietitians, mental health professionals, physical therapists) for seamless referrals.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 5: Legal Requirements */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <Scale className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">5. Legal Compliance Requirements</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Health and wellness professional regulations vary significantly by jurisdiction. As an ASI-certified practitioner, you must:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li><strong>Research and comply with local laws</strong> — Some states, provinces, and countries require additional licensing or registration for wellness practitioners</li>
                <li><strong>Use legally compliant language</strong> — Avoid terms like "treat," "cure," "heal," "diagnose," or "prescribe" unless appropriately licensed</li>
                <li><strong>Maintain professional liability insurance</strong> — Protect yourself and your practice with adequate coverage</li>
                <li><strong>Utilize comprehensive client agreements</strong> — Clearly define your services, limitations, scope, and client responsibilities in writing</li>
                <li><strong>Document thoroughly</strong> — Maintain accurate records of all sessions, recommendations, and referrals</li>
                <li><strong>Stay within your training</strong> — Only offer services for which you have completed appropriate ASI certification</li>
                <li><strong>Display credentials accurately</strong> — Never misrepresent your qualifications or scope of practice</li>
              </ul>
            </section>

            {/* Section 6: Healthcare Provider Collaboration */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <Heart className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">6. Collaborative Healthcare Provider Relationships</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                Optimal client outcomes often result from interprofessional collaboration. ASI-certified practitioners should:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Encourage clients to maintain active relationships with their primary care physicians and specialists</li>
                <li>Support clients in adhering to their healthcare providers' recommendations</li>
                <li>Request written permission before communicating with a client's healthcare team</li>
                <li>Never contradict, undermine, or suggest modifications to medical advice</li>
                <li>Be transparent with clients about the distinction between coaching and medical care</li>
                <li>Provide healthcare providers with relevant coaching notes when requested and authorized</li>
                <li>Position yourself as a complementary partner to licensed healthcare, not a replacement</li>
              </ul>
            </section>

            {/* Section 7: Credential Revocation */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#fef2f2' }}>
                  <AlertTriangle className="w-5 h-5" style={{ color: '#dc2626' }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">7. Scope of Practice Violations and Consequences</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                ASI takes scope of practice violations extremely seriously. The following actions may result in immediate credential revocation, removal from the ASI directory, and reporting to appropriate authorities:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-4">
                <li>Diagnosing or treating medical conditions</li>
                <li>Prescribing medications or supplements for therapeutic purposes</li>
                <li>Providing services that require professional licensure you do not hold</li>
                <li>Using protected professional titles without appropriate credentials</li>
                <li>Failing to refer clients who require licensed professional care</li>
                <li>Making health claims that misrepresent the nature of coaching services</li>
                <li>Any activity that results in client harm</li>
              </ul>
              <div className="rounded-xl p-4 border" style={{ backgroundColor: '#fef2f2', borderColor: '#ef4444' }}>
                <p className="text-sm leading-relaxed font-medium" style={{ color: '#991b1b' }}>
                  ASI reserves the right to investigate complaints, revoke credentials, and take legal action against practitioners who violate scope of practice requirements or bring disrepute to the ASI credential.
                </p>
              </div>
            </section>

            {/* Section 8: Continuing Education */}
            <section className="mb-10 pb-10 border-b border-gray-100">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <GraduationCap className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">8. Continuing Education and Professional Development</h2>
              </div>
              <p className="text-gray-700 leading-relaxed mb-4">
                ASI-certified practitioners are expected to maintain current knowledge through ongoing professional development. We strongly recommend:
              </p>
              <ul className="list-disc pl-6 text-gray-700 space-y-2">
                <li>Pursuing additional ASI certifications to expand scope appropriately</li>
                <li>Staying current with research in your specialty areas</li>
                <li>Participating in professional communities and peer support</li>
                <li>Reviewing and updating your scope of practice knowledge annually</li>
                <li>Obtaining additional credentials or licenses as your practice evolves</li>
              </ul>
            </section>

            {/* Contact Section */}
            <section>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${BRAND.burgundy}15` }}>
                  <Mail className="w-5 h-5" style={{ color: BRAND.burgundy }} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900">9. Questions and Compliance Inquiries</h2>
              </div>
              <div className="rounded-xl p-6 border" style={{ backgroundColor: BRAND.cream, borderColor: `${BRAND.gold}30` }}>
                <p className="font-bold text-gray-900 mb-3">Accreditation Standards Institute LLC</p>
                <div className="space-y-2 text-gray-700">
                  <p>
                    <strong>Scope of Practice Questions:</strong>{" "}
                    <a href="mailto:compliance@accreditation-standards.org" className="hover:underline font-medium" style={{ color: BRAND.burgundy }}>
                      compliance@accreditation-standards.org
                    </a>
                  </p>
                  <p>
                    <strong>Report a Concern:</strong>{" "}
                    <a href="mailto:ethics@accreditation-standards.org" className="hover:underline font-medium" style={{ color: BRAND.burgundy }}>
                      ethics@accreditation-standards.org
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
          <h3 className="text-lg font-semibold text-gray-900 text-center mb-4">Related Professional Documents</h3>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/code-of-ethics">
              <Button variant="outline" className="border-gray-200 hover:border-gray-300" style={{ color: BRAND.burgundy }}>
                Code of Ethics
              </Button>
            </Link>
            <Link href="/credential-terms">
              <Button variant="outline" className="border-gray-200 hover:border-gray-300" style={{ color: BRAND.burgundy }}>
                Credential Terms
              </Button>
            </Link>
            <Link href="/health-disclaimer">
              <Button variant="outline" className="border-gray-200 hover:border-gray-300" style={{ color: BRAND.burgundy }}>
                Health Disclaimer
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
