import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Heart,
  MapPin,
  Shield,
  AlertTriangle,
  BookOpen,
  Stethoscope,
  Ban,
  CheckCircle,
  XCircle,
  Users,
  Phone,
  Brain,
  Baby,
  Pill,
  Scale,
  FileText,
  ArrowRight,
  ChevronRight,
  Mail,
  Calendar,
} from "lucide-react";

export const metadata = {
  title: "Health Disclaimer | Accreditation Standards Institute",
  description: "Important health and medical disclaimer for ASI educational programs and credentials. ASI provides educational certifications, not medical training or licensure.",
  openGraph: {
    title: "ASI Health Disclaimer",
    description: "Important information about the educational nature of ASI credentials and content.",
  },
};

// Brand Colors from logo
const BRAND = {
  burgundy: "#722f37",
  burgundyDark: "#4e1f24",
  gold: "#d4af37",
  goldLight: "#e8c547",
  cream: "#fdf8f0",
};

export default function HealthDisclaimerPage() {
  const lastUpdated = "January 1, 2025";

  const sections = [
    {
      id: "purpose",
      icon: FileText,
      title: "1. Purpose of This Disclaimer",
      content: `This Health Disclaimer outlines important information regarding the nature of educational content, programs, and credentials provided by the Accreditation Standards Institute (ASI). By accessing our website, enrolling in our programs, or earning an ASI credential, you acknowledge that you have read, understood, and agree to the terms of this disclaimer.

ASI is committed to transparency about what our educational programs provide and, equally important, what they do not provide. This disclaimer protects both you as a student or practitioner and the clients you may serve.`,
    },
    {
      id: "educational-nature",
      icon: BookOpen,
      title: "2. Educational Nature of ASI Content",
      content: `All content provided by ASI, including but not limited to courses, modules, videos, written materials, quizzes, case studies, and supplementary resources, is strictly educational in nature.

Our educational programs are designed to:
- Provide foundational and advanced knowledge in health and wellness topics
- Teach coaching methodologies, communication skills, and client support techniques
- Share evidence-based information about nutrition, lifestyle, and wellness practices
- Prepare individuals for careers in health and wellness coaching
- Develop critical thinking skills for supporting client wellness goals

Our programs do NOT:
- Provide medical training, clinical skills, or diagnostic capabilities
- Qualify graduates to practice medicine, therapy, or other licensed professions
- Replace formal medical, nursing, or allied health professional education
- Grant authority to diagnose, treat, or prescribe for any health condition`,
    },
    {
      id: "not-medical-advice",
      icon: Stethoscope,
      title: "3. Not Medical or Healthcare Advice",
      content: `NOTHING in ASI's educational content, courses, or materials constitutes medical advice, healthcare advice, or professional health services.

The information provided through our programs is general educational content and should NEVER be used to:
- Self-diagnose any disease, disorder, or health condition
- Delay or avoid seeking care from a qualified healthcare provider
- Modify, discontinue, or begin any prescribed treatment without medical supervision
- Replace the professional judgment of a licensed healthcare provider

If you have questions about your health, you should always consult with a qualified physician, registered nurse, licensed nutritionist/dietitian, licensed mental health professional, or other appropriately licensed healthcare provider. If you are experiencing a medical emergency, call 911 or your local emergency services immediately.`,
    },
    {
      id: "scope-of-credentials",
      icon: Shield,
      title: "4. Scope of ASI Credentials",
      content: `ASI credentials are EDUCATIONAL CERTIFICATIONS that demonstrate completion of training programs and competency assessments. They are NOT:

- Medical licenses or permits to practice medicine
- Licenses to diagnose, treat, prescribe, or cure any disease or condition
- Equivalents to degrees or licenses from medical schools, nursing programs, or other regulated healthcare education
- Authorizations to practice in regulated healthcare fields
- State or federal healthcare provider licenses

ASI credentials signify that the holder has:
- Completed a structured educational curriculum
- Passed competency assessments
- Agreed to uphold ASI's Code of Ethics
- Committed to operating within appropriate scope of practice

Each credential holder is responsible for understanding and complying with the laws and regulations governing their practice in their specific jurisdiction.`,
    },
    {
      id: "can-cannot-do",
      icon: Scale,
      title: "5. What ASI-Certified Practitioners Can and Cannot Do",
      content: `ASI-CERTIFIED PRACTITIONERS CAN:
- Provide general wellness education and information
- Coach clients toward health and wellness goals
- Offer accountability, motivation, and support for behavior change
- Share general information about nutrition, lifestyle, and wellness practices
- Help clients implement recommendations from their healthcare providers
- Develop personalized wellness plans within coaching scope
- Teach stress management and mindfulness techniques
- Provide resources and educational materials
- Refer clients to appropriate licensed professionals

ASI-CERTIFIED PRACTITIONERS CANNOT:
- Diagnose any disease, disorder, or medical condition
- Prescribe medications, treatments, or therapeutic interventions
- Provide medical nutrition therapy for diagnosed conditions
- Practice psychotherapy, counseling, or mental health treatment
- Interpret lab results or medical imaging
- Recommend stopping or changing prescribed medications
- Use terms like "treat," "cure," "heal," or "prescribe"
- Claim to prevent or treat any specific disease
- Practice any form of medicine, even if holding other credentials through ASI

Violation of these boundaries may constitute unlicensed practice of medicine or other regulated professions and may result in legal consequences and revocation of ASI credentials.`,
    },
    {
      id: "professional-boundaries",
      icon: Ban,
      title: "6. Professional Boundaries",
      content: `Health and wellness coaching is a distinct profession from medical practice, psychotherapy, nutrition therapy, and other regulated healthcare fields.

COACHING IS:
- Goal-focused and action-oriented
- Concerned with the present and future
- Focused on wellness, not illness
- About supporting client autonomy and self-discovery
- Educational and informational

COACHING IS NOT:
- Medical care or treatment
- Psychotherapy or mental health treatment
- Diagnosis or prescription
- Crisis intervention or emergency care
- A replacement for licensed professional care

ASI-certified practitioners must maintain clear boundaries between coaching services and medical/therapeutic services. When in doubt, always refer clients to appropriate licensed professionals.

The boundary between coaching and medicine/therapy must be respected at all times. Crossing these boundaries puts both the practitioner and their clients at risk.`,
    },
    {
      id: "emergency-situations",
      icon: Phone,
      title: "7. Emergency Situations",
      content: `ASI programs, credentials, and practitioners are NOT equipped to handle medical emergencies, mental health crises, or other urgent situations.

IN CASE OF EMERGENCY:
- Call 911 or your local emergency number immediately
- Go to your nearest emergency room
- Contact a crisis hotline for mental health emergencies

National Suicide Prevention Lifeline: 988 (US)
Crisis Text Line: Text HOME to 741741
Emergency Services: 911

ASI-certified practitioners should NEVER:
- Attempt to manage medical emergencies
- Delay emergency care by providing coaching
- Advise against seeking emergency services
- Provide crisis counseling without appropriate licensure

If you or a client experiences symptoms of a medical emergency (chest pain, difficulty breathing, severe bleeding, signs of stroke, severe allergic reaction, etc.) or mental health crisis (suicidal thoughts, self-harm, psychotic symptoms), seek immediate professional emergency care.`,
    },
    {
      id: "individual-results",
      icon: Users,
      title: "8. Individual Results Vary",
      content: `Health and wellness outcomes are highly individualized and depend on numerous factors including:

- Genetics and biological individuality
- Existing health conditions and medical history
- Current medications and treatments
- Environmental factors
- Lifestyle choices and consistency
- Psychological and emotional factors
- Social support systems
- Compliance with recommendations
- Individual metabolism and physiology

ASI makes no guarantees or warranties regarding:
- Specific health outcomes from implementing educational content
- Results from working with ASI-certified practitioners
- Improvement in any particular health marker or condition
- Timeline for experiencing any benefits

Testimonials and case studies represent individual experiences and should not be interpreted as typical results or promises of similar outcomes. Your results may vary significantly from those described.`,
    },
    {
      id: "supplements-nutrition",
      icon: Pill,
      title: "9. Supplement and Nutrition Information",
      content: `Educational content regarding dietary supplements, herbs, vitamins, minerals, or nutritional approaches is provided for informational purposes only.

IMPORTANT NOTICES:
- Dietary supplements are not regulated by the FDA in the same manner as pharmaceutical drugs
- Supplements can interact with medications and medical conditions
- Natural does not always mean safe
- Quality and purity of supplements vary significantly
- Individual responses to supplements vary widely

Before taking any dietary supplement or making significant dietary changes:
- Consult with your physician or qualified healthcare provider
- Inform them of all supplements and medications you take
- Discuss any known allergies or sensitivities
- Consider potential interactions with existing conditions

ASI does not endorse, recommend, or prescribe any specific supplements, products, or brands. Any mention of supplements in educational content is for informational purposes only and should not be construed as medical advice or prescription.

Pregnant or nursing mothers, children, and individuals with health conditions should exercise particular caution with supplements and always consult appropriate healthcare providers.`,
    },
    {
      id: "mental-health",
      icon: Brain,
      title: "10. Mental Health Considerations",
      content: `ASI educational content may address topics related to stress, emotional well-being, mindset, and lifestyle factors that affect mental health. This content is educational and NOT a substitute for mental health treatment.

ASI programs and credentials DO NOT qualify practitioners to:
- Diagnose mental health conditions
- Provide psychotherapy or counseling
- Treat depression, anxiety, trauma, or other mental health conditions
- Address eating disorders (which require specialized treatment)
- Manage crisis situations or suicidal ideation
- Prescribe or recommend psychiatric medications

If you are experiencing mental health concerns, please seek help from:
- Licensed psychologists
- Licensed clinical social workers (LCSW)
- Licensed professional counselors (LPC)
- Psychiatrists
- Your primary care physician

ASI-certified practitioners must refer clients to licensed mental health professionals when mental health concerns arise. Coaching is not therapy and cannot replace appropriate mental health care.`,
    },
    {
      id: "pregnancy-medical-conditions",
      icon: Baby,
      title: "11. Pregnancy and Special Medical Conditions",
      content: `Individuals who are pregnant, nursing, or have existing medical conditions should exercise particular caution regarding health and wellness information.

IF YOU ARE PREGNANT OR NURSING:
- Consult your OB/GYN or midwife before making any dietary or lifestyle changes
- Do not take supplements without medical approval
- Be aware that nutritional needs are different during pregnancy and lactation
- Some practices safe for the general population may not be safe during pregnancy

IF YOU HAVE A MEDICAL CONDITION:
- Work closely with your medical team
- Do not modify prescribed treatments based on educational content
- Inform your healthcare providers of any wellness approaches you are considering
- Be aware that conditions like diabetes, heart disease, kidney disease, autoimmune conditions, and others may require specific medical nutrition therapy

ASI-certified practitioners must:
- Screen for pregnancy, nursing status, and medical conditions
- Refer clients with complex medical needs to appropriate providers
- Not provide specific recommendations for managing medical conditions
- Encourage clients to maintain relationships with their healthcare teams`,
    },
    {
      id: "healthcare-team",
      icon: CheckCircle,
      title: "12. Your Healthcare Team",
      content: `ASI strongly encourages all individuals to work with a qualified healthcare team that may include:

- Primary care physician
- Specialists relevant to your health needs
- Registered Dietitian (RD) for medical nutrition therapy
- Licensed mental health professionals
- Physical therapists and other rehabilitation specialists
- Pharmacists
- Other licensed healthcare providers as appropriate

A health and wellness coach certified by ASI can be a valuable addition to your wellness team, providing:
- Support in implementing your healthcare provider's recommendations
- Accountability for lifestyle changes
- Motivation and encouragement
- Education about general wellness practices
- Goal-setting and action planning assistance

However, a coach should NEVER replace the medical professionals on your team. The best outcomes often come from collaboration between coaches and healthcare providers, with clear communication and respect for professional boundaries.`,
    },
    {
      id: "liability",
      icon: XCircle,
      title: "13. Liability Limitations",
      content: `To the fullest extent permitted by applicable law, the Accreditation Standards Institute, its officers, directors, employees, affiliates, instructors, and agents disclaim all liability for:

- Any adverse health outcomes resulting from information in our educational materials
- Any harm resulting from reliance on our content for medical decisions
- Any consequences of failure to seek appropriate medical care
- Actions, advice, or conduct of ASI credential holders in their practice
- Any direct, indirect, incidental, special, consequential, or punitive damages
- Lost profits, data, or other intangible losses
- Personal injury or property damage of any nature

USE OF ASI EDUCATIONAL CONTENT AND CREDENTIALS IS AT YOUR OWN RISK.

ASI credential holders are independent practitioners and are solely responsible for their own practice, including maintaining appropriate liability insurance, complying with applicable laws, and operating within their scope of practice.

ASI's liability, if any, shall be limited to the amount paid for the educational program in question.`,
    },
    {
      id: "acknowledgment",
      icon: FileText,
      title: "14. Acknowledgment",
      content: `By accessing ASI's website, enrolling in any ASI educational program, earning an ASI credential, or using ASI's educational materials, you acknowledge and agree that:

1. You have read and understood this Health Disclaimer in its entirety
2. You understand that ASI provides EDUCATIONAL content, not medical advice
3. You will not use ASI content to diagnose, treat, or manage any health condition
4. You will consult appropriate licensed healthcare professionals for medical needs
5. You understand that ASI credentials are educational certifications, not medical licenses
6. You accept full responsibility for your own health decisions
7. You will seek emergency care for any medical or mental health emergencies
8. You release ASI from liability as described in this disclaimer
9. If you become an ASI-certified practitioner, you will operate within appropriate scope of practice and maintain clear professional boundaries

This disclaimer is subject to change. Users are encouraged to review this page periodically for updates. Continued use of ASI services after changes constitutes acceptance of the modified terms.

If you do not agree with any part of this disclaimer, please do not use our website, enroll in our programs, or seek ASI credentials.`,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div style={{ backgroundColor: BRAND.burgundyDark }} className="text-white py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-sm">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-2">
              <MapPin className="w-3 h-3" style={{ color: BRAND.gold }} />
              USA Headquarters
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-3 h-3" style={{ color: BRAND.gold }} />
              Dubai Office
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/verify" className="hover:opacity-80 transition-opacity" style={{ color: BRAND.gold }}>
              Verify Credential
            </Link>
            <Link href="/directory" className="hover:opacity-80 transition-opacity" style={{ color: BRAND.gold }}>
              Find a Practitioner
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link href="/asi-home" className="flex items-center gap-3">
              <Image
                src="/ASI_LOGO-removebg-preview.png"
                alt="Accreditation Standards Institute"
                width={160}
                height={48}
                className="h-12 w-auto"
              />
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              <div className="relative group">
                <Link href="/about" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity flex items-center gap-1" style={{ color: BRAND.burgundy }}>
                  About <ChevronRight className="w-4 h-4 rotate-90" />
                </Link>
              </div>
              <div className="relative group">
                <Link href="/standards" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity flex items-center gap-1" style={{ color: BRAND.burgundy }}>
                  Standards <ChevronRight className="w-4 h-4 rotate-90" />
                </Link>
              </div>
              <div className="relative group">
                <Link href="/certifications" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity flex items-center gap-1" style={{ color: BRAND.burgundy }}>
                  Certifications <ChevronRight className="w-4 h-4 rotate-90" />
                </Link>
              </div>
              <Link href="/directory" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity" style={{ color: BRAND.burgundy }}>Directory</Link>
              <Link href="/verify" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity" style={{ color: BRAND.burgundy }}>Verify</Link>
            </div>

            <div className="flex items-center gap-3">
              <Link href="/login">
                <Button variant="ghost" style={{ color: BRAND.burgundy }}>Log In</Button>
              </Link>
              <Link href="/apply">
                <Button style={{ backgroundColor: BRAND.burgundy, color: "white" }} className="hover:opacity-90">
                  Apply Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden" style={{ backgroundColor: BRAND.burgundyDark }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${BRAND.gold} 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }} />
        </div>
        <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-20" style={{ backgroundColor: BRAND.gold }} />

        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
            <FileText className="w-4 h-4" style={{ color: BRAND.gold }} />
            <span className="text-sm font-medium" style={{ color: BRAND.gold }}>Legal Document</span>
          </div>

          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${BRAND.gold}20`, border: `2px solid ${BRAND.gold}40` }}>
              <Heart className="w-10 h-10" style={{ color: BRAND.gold }} />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Health <span style={{ color: BRAND.gold }}>Disclaimer</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Important information about the educational nature of ASI programs, credentials, and content.
            Please read this disclaimer carefully before using our services.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm" style={{ color: BRAND.gold }}>
            <Calendar className="w-4 h-4" />
            Last Updated: {lastUpdated}
          </div>
        </div>
      </section>

      {/* Critical Warning Box */}
      <section className="py-8" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-2xl p-8 border-2" style={{ backgroundColor: "#fef2f2", borderColor: "#fecaca" }}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: "#fee2e2" }}>
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-red-800 mb-4">THIS IS NOT MEDICAL ADVICE</h2>
                <div className="text-red-700 space-y-3">
                  <p className="font-medium">
                    The Accreditation Standards Institute (ASI) provides EDUCATIONAL CREDENTIALS for health and wellness coaches.
                    ASI does NOT provide medical training, medical licensure, or authority to practice medicine.
                  </p>
                  <p>
                    All content provided by ASI is for educational and informational purposes only. It is NOT intended
                    to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice
                    of a qualified healthcare provider with any questions you may have regarding a medical condition.
                  </p>
                  <p className="font-bold">
                    Never disregard professional medical advice or delay seeking it because of something you have
                    learned through ASI programs or from an ASI-certified practitioner.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ASI Credentials Clarification */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-2xl p-8 border-2" style={{ backgroundColor: `${BRAND.gold}10`, borderColor: BRAND.gold }}>
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${BRAND.gold}30` }}>
                <Shield className="w-7 h-7" style={{ color: BRAND.burgundy }} />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
                  Understanding ASI Credentials
                </h2>
                <div className="space-y-3" style={{ color: BRAND.burgundyDark }}>
                  <p>
                    <strong>ASI provides EDUCATIONAL CERTIFICATIONS</strong> that recognize completion of training
                    programs in health and wellness coaching. These credentials demonstrate knowledge and competency
                    in coaching methodologies, wellness education, and client support.
                  </p>
                  <p>
                    <strong>ASI credentials are NOT:</strong>
                  </p>
                  <ul className="list-disc pl-6 space-y-1">
                    <li>Medical licenses or permits</li>
                    <li>Authority to diagnose, treat, or prescribe</li>
                    <li>Equivalents to medical, nursing, or allied health degrees</li>
                    <li>State or federal healthcare provider licenses</li>
                  </ul>
                  <p className="font-medium pt-2">
                    All ASI credential holders must operate within the scope of wellness coaching and refer clients
                    to licensed healthcare professionals for medical needs.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <section className="py-16" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-4xl mx-auto px-4">
          <div className="space-y-8">
            {sections.map((section) => (
              <div
                key={section.id}
                id={section.id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="p-8 md:p-10">
                  <div className="flex items-start gap-4 mb-6">
                    <div
                      className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: `${BRAND.burgundy}10` }}
                    >
                      <section.icon className="w-6 h-6" style={{ color: BRAND.burgundy }} />
                    </div>
                    <h2 className="text-2xl font-bold" style={{ color: BRAND.burgundy }}>
                      {section.title}
                    </h2>
                  </div>
                  <div className="prose prose-gray max-w-none">
                    {section.content.split('\n\n').map((paragraph, idx) => (
                      <p key={idx} className="text-gray-700 leading-relaxed mb-4 whitespace-pre-line">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: `${BRAND.burgundy}10` }}>
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ backgroundColor: BRAND.burgundy }}>
                <Mail className="w-7 h-7" style={{ color: BRAND.gold }} />
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
              Questions About This Disclaimer?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              If you have questions about this Health Disclaimer or need clarification about
              the scope of ASI credentials and educational programs, please contact us.
            </p>
            <div className="space-y-2 text-gray-700">
              <p><strong>Accreditation Standards Institute</strong></p>
              <p>
                Email: <a href="mailto:compliance@accreditationstandards.org" className="font-medium hover:underline" style={{ color: BRAND.burgundy }}>compliance@accreditationstandards.org</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Documents */}
      <section className="py-16" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: BRAND.burgundy }}>
            Related Legal Documents
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/scope-of-practice">
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow border border-gray-100 text-center">
                <Scale className="w-8 h-8 mx-auto mb-3" style={{ color: BRAND.burgundy }} />
                <h3 className="font-bold" style={{ color: BRAND.burgundy }}>Scope of Practice</h3>
                <p className="text-sm text-gray-500 mt-2">Guidelines for practitioners</p>
              </div>
            </Link>
            <Link href="/code-of-ethics">
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow border border-gray-100 text-center">
                <Shield className="w-8 h-8 mx-auto mb-3" style={{ color: BRAND.burgundy }} />
                <h3 className="font-bold" style={{ color: BRAND.burgundy }}>Code of Ethics</h3>
                <p className="text-sm text-gray-500 mt-2">Professional conduct standards</p>
              </div>
            </Link>
            <Link href="/terms-of-service">
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-shadow border border-gray-100 text-center">
                <FileText className="w-8 h-8 mx-auto mb-3" style={{ color: BRAND.burgundy }} />
                <h3 className="font-bold" style={{ color: BRAND.burgundy }}>Terms of Service</h3>
                <p className="text-sm text-gray-500 mt-2">Usage terms and conditions</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-white py-16" style={{ backgroundColor: BRAND.burgundyDark }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-5 gap-8 mb-12">
            {/* Logo & Info */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: BRAND.gold }}>
                  <Shield className="w-7 h-7" style={{ color: BRAND.burgundyDark }} />
                </div>
                <div>
                  <div className="font-bold text-lg tracking-tight text-white">ACCREDITATION STANDARDS</div>
                  <div className="text-xs tracking-widest" style={{ color: BRAND.gold }}>INSTITUTE</div>
                </div>
              </div>
              <p className="mb-6 max-w-sm" style={{ color: "#f5e6e8" }}>
                The global authority in functional medicine and health certification.
                Setting standards. Building careers.
              </p>
              <div className="space-y-2 text-sm" style={{ color: "#f5e6e8" }}>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: BRAND.gold }} />
                  USA Headquarters
                </p>
                <p className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: BRAND.gold }} />
                  Dubai Office
                </p>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-bold mb-4" style={{ color: BRAND.gold }}>Certifications</h4>
              <ul className="space-y-2 text-sm" style={{ color: "#f5e6e8" }}>
                <li><Link href="/certifications" className="hover:text-white transition-colors">All Certifications</Link></li>
                <li><Link href="/certifications/functional-medicine" className="hover:text-white transition-colors">Functional Medicine</Link></li>
                <li><Link href="/certifications/womens-health" className="hover:text-white transition-colors">Women's Health</Link></li>
                <li><Link href="/certifications/gut-health" className="hover:text-white transition-colors">Gut Health</Link></li>
                <li><Link href="/certifications/nutrition" className="hover:text-white transition-colors">Nutrition</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4" style={{ color: BRAND.gold }}>Company</h4>
              <ul className="space-y-2 text-sm" style={{ color: "#f5e6e8" }}>
                <li><Link href="/about" className="hover:text-white transition-colors">About ASI</Link></li>
                <li><Link href="/standards" className="hover:text-white transition-colors">Our Standards</Link></li>
                <li><Link href="/leadership" className="hover:text-white transition-colors">Leadership</Link></li>
                <li><Link href="/code-of-ethics" className="hover:text-white transition-colors">Code of Ethics</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4" style={{ color: BRAND.gold }}>Legal</h4>
              <ul className="space-y-2 text-sm" style={{ color: "#f5e6e8" }}>
                <li><Link href="/health-disclaimer" className="hover:text-white transition-colors font-medium text-white">Health Disclaimer</Link></li>
                <li><Link href="/scope-of-practice" className="hover:text-white transition-colors">Scope of Practice</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <p className="text-sm" style={{ color: "#f5e6e8" }}>
              © {new Date().getFullYear()} Accreditation Standards Institute. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm" style={{ color: "#f5e6e8" }}>
              <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/terms-of-service" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/health-disclaimer" className="hover:text-white transition-colors">Health Disclaimer</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
