import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Globe,
  Handshake,
  CheckCircle,
  ArrowRight,
  ChevronDown,
} from "lucide-react";

export const metadata = {
  title: "9 Global Accreditations & Certifications",
  description: "AccrediPro holds 9 prestigious accreditations: CMA, IPHM, IAOTH, ICAHP, IGCT, CTAA, IHTCP, IIOHT & CPD. Practice legally in 30+ countries with insurance eligibility.",
  keywords: ["accredited certification", "CPD approved", "health coach accreditation", "IPHM accredited", "CMA certified", "insurance eligible certification"],
  openGraph: {
    title: "9 Global Accreditations | AccrediPro Academy",
    description: "Our certifications are recognized by 9 international accreditation bodies. Practice legally in 30+ countries.",
    type: "website",
  },
  alternates: {
    canonical: "https://accredipro.academy/accreditation",
  },
};

export default function AccreditationPage() {
  const stats = [
    { value: "9", label: "Accreditation Bodies" },
    { value: "30+", label: "Countries Recognized" },
    { value: "100%", label: "Insurance Eligibility" },
    { value: "∞", label: "Lifetime Validity" },
  ];

  const benefits = [
    {
      icon: Shield,
      title: "Professional Liability Insurance",
      description: "Our accreditations qualify you for professional indemnity and malpractice insurance in USA, UK, Canada, Australia, Europe, and beyond through partners like IICT and BGI.",
      color: "bg-green-100",
      iconColor: "text-green-600",
    },
    {
      icon: Globe,
      title: "Global Career Portability",
      description: "Move countries without losing your credential. International accreditations like CMA and IPHM are recognized by insurance providers and professional bodies worldwide.",
      color: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      icon: Handshake,
      title: "Instant Client Trust",
      description: "Display recognized accreditation seals on your website and materials. Clients instantly recognize legitimacy, increasing conversions and commanding higher fees.",
      color: "bg-amber-100",
      iconColor: "text-amber-600",
    },
  ];

  const accreditations = [
    {
      abbr: "CMA",
      name: "The Complementary Medical Association (CMA)",
      badges: [
        { label: "FLAGSHIP", color: "bg-green-100 text-green-800" },
        { label: "GLOBAL", color: "bg-burgundy-600 text-white" },
      ],
      description: "Established in 1993, the CMA is one of the world's longest-established and most respected professional membership bodies for complementary medical practitioners. With members in over 106 countries, CMA accreditation is the gold standard for holistic health education. AccrediPro is a fully registered College with the CMA.",
      benefits: [
        "Use MCMA post-nominal letters after your name",
        "Listed in the official CMA Practitioner Directory",
        "Access to discounted insurance via CMA partners",
        "Recognized by employers and hospitals worldwide",
      ],
      focus: "Recognition: UK, Europe, USA, Canada, Australia, Asia — 106+ countries",
      focusIcon: "globe",
    },
    {
      abbr: "IPHM",
      name: "International Practitioners of Holistic Medicine (IPHM)",
      badges: [
        { label: "EXECUTIVE PROVIDER", color: "bg-blue-100 text-blue-800" },
      ],
      description: "IPHM is one of the largest independent accreditation boards for holistic therapists and training providers globally. AccrediPro holds Executive Training Provider status — the highest tier of IPHM recognition. This accreditation is specifically designed to help graduates obtain professional insurance.",
      benefits: [
        "Automatic insurance eligibility in UK, Europe, Asia, Australia",
        "Free listing in the IPHM International Directory",
        "Use official IPHM accredited badges and seals",
        "Priority partnerships with insurance providers",
      ],
      focus: "Insurance Focus: Specifically designed for practitioner insurance qualification",
      focusIcon: "shield",
    },
    {
      abbr: "IAOTH",
      name: "International Association of Therapists (IAOTH)",
      badges: [
        { label: "GLOBAL NETWORK", color: "bg-purple-100 text-purple-800" },
      ],
      description: "IAOTH is dedicated to uniting therapists from all corners of the globe under a single professional standard. Recognition by IAOTH signals a commitment to excellence, ethical practice, and ongoing professional development in functional medicine and holistic health coaching.",
      benefits: [
        "Listing in the International Therapist Directory",
        "Professional networking with global practitioners",
        "Access to IAOTH events and conferences",
        "Professional standards code certification",
      ],
      focus: "Community: Connect with 10,000+ therapists worldwide",
      focusIcon: "users",
    },
    {
      abbr: "ICAHP",
      name: "International Community for Alternative and Holistic Professionals (ICAHP)",
      badges: [
        { label: "ALTERNATIVE MEDICINE", color: "bg-teal-100 text-teal-800" },
      ],
      description: "ICAHP provides a supportive global community specifically for alternative and holistic health professionals. Their accreditation validates that our curriculum meets rigorous standards for evidence-based alternative medicine education and ethical practice guidelines.",
      benefits: [
        "Membership in global holistic community",
        "Access to practitioner resources and tools",
        "Evidence-based education verification",
        "Ethical standards certification",
      ],
      focus: "Focus: Evidence-based alternative and holistic medicine standards",
      focusIcon: "heart",
    },
    {
      abbr: "IGCT",
      name: "International Guild of Complementary Therapists (IGCT)",
      badges: [
        { label: "COMPLEMENTARY THERAPY", color: "bg-orange-100 text-orange-800" },
      ],
      description: "The IGCT is a prestigious professional guild that sets high standards for complementary therapy training and practice. Guild membership signifies excellence and provides graduates with additional credibility when marketing their services to clients and healthcare providers.",
      benefits: [
        "Guild membership with professional standing",
        "Use IGCT credentials and badges",
        "Professional referral network access",
        "Continuing education opportunities",
      ],
      focus: "Prestige: Guild-level recognition for complementary therapists",
      focusIcon: "award",
    },
    {
      abbr: "CTAA",
      name: "Complementary Therapists Accredited Association (CTAA)",
      badges: [
        { label: "UK FOCUSED", color: "bg-red-100 text-red-800" },
      ],
      description: "CTAA is a UK-based accreditation body that has been validating complementary therapy courses for decades. CTAA accreditation is particularly valuable for practitioners looking to work in the United Kingdom and ensures graduates meet British standards for complementary healthcare.",
      benefits: [
        "UK practice eligibility with full recognition",
        "Insurance qualification for UK providers",
        "Recognition by NHS complementary services",
        "British standards compliance verified",
      ],
      focus: "Priority: UK-specific accreditation for British market practice",
      focusIcon: "flag",
    },
    {
      abbr: "IHTCP",
      name: "International Holistic Therapists & Course Providers (IHTCP)",
      badges: [
        { label: "TRAINING STANDARD", color: "bg-indigo-100 text-indigo-800" },
      ],
      description: "IHTCP focuses on validating both practitioners AND training providers. Their dual-focus accreditation ensures that AccrediPro not only produces qualified graduates but also maintains the highest standards in curriculum design, assessment methodology, and student support.",
      benefits: [
        "Curriculum quality independently verified",
        "Assessment standards approved",
        "Student support standards certified",
        "Ongoing quality monitoring",
      ],
      focus: "Quality: Training provider excellence verification",
      focusIcon: "graduation-cap",
    },
    {
      abbr: "IIOHT",
      name: "International Institute of Holistic Therapists (IIOHT)",
      badges: [
        { label: "HOLISTIC INSTITUTE", color: "bg-cyan-100 text-cyan-800" },
      ],
      description: "The IIOHT is an international institute-level accreditation body that validates holistic therapy education at the highest academic and practical standards. IIOHT recognition demonstrates that our program meets institutional-quality benchmarks for holistic health education.",
      benefits: [
        "Institute-level academic recognition",
        "Practical skills standards verified",
        "Research-based curriculum validation",
        "Professional pathway recognition",
      ],
      focus: "Academic: Institute-level holistic education standards",
      focusIcon: "building-columns",
    },
    {
      abbr: "CPD",
      name: "CPD Certification Service",
      badges: [
        { label: "CONTINUING EDUCATION", color: "bg-green-100 text-green-800" },
        { label: "UNIVERSAL", color: "bg-burgundy-600 text-white" },
      ],
      description: "CPD (Continuing Professional Development) certification means our program counts towards your ongoing professional education requirements. Healthcare professionals, fitness trainers, nurses, and other regulated professionals can use this certification for their mandatory CPD hours and recertification.",
      benefits: [
        "Official CPD hours for recertification",
        "Recognized by employers and regulators",
        "Valid for NASM & AFAA credits",
        "Stackable with existing credentials",
      ],
      focus: "Universal: Counts for continuing education across all regulated professions",
      focusIcon: "certificate",
      specialBorder: "border-green-500",
    },
  ];

  const faqs = [
    {
      question: "How many accreditations does AccrediPro have?",
      answer: "AccrediPro holds 9 prestigious international accreditations: CMA, IPHM, IAOTH, ICAHP, IGCT, CTAA, IHTCP, IIOHT, and CPD certification. This makes us one of the most accredited functional medicine programs globally.",
    },
    {
      question: "Can I get professional liability insurance with this certificate?",
      answer: "Yes. Our accreditations (particularly IPHM and CMA) qualify graduates for professional liability and malpractice insurance in over 30 countries including USA, UK, Canada, Australia, New Zealand, and throughout Europe and Asia.",
    },
    {
      question: "What post-nominal letters can I use?",
      answer: "Graduates who join the CMA as individual members can use \"MCMA\" (Member of the Complementary Medical Association) after their name. Additional designations may be available through other accreditation bodies upon individual membership.",
    },
    {
      question: "Does my certificate expire?",
      answer: "Your AccrediPro Functional Medicine Practitioner certificate has lifetime validity and never expires. However, individual membership with third-party bodies (CMA, IPHM, etc.) typically requires annual renewal fees and CPD requirements.",
    },
    {
      question: "Is this CPD certified for existing healthcare professionals?",
      answer: "Yes. Our program is CPD certified, meaning it counts towards continuing professional development requirements. This includes recognition for NASM and AFAA credits for fitness professionals, as well as general CPD hours for nurses, allied health professionals, and other regulated practitioners.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-burgundy-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">AP</span>
              </div>
              <span className="text-lg font-bold text-burgundy-600">AccrediPro</span>
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/accreditation" className="text-burgundy-600 font-semibold">Accreditations</Link>
              <Link href="/testimonials" className="text-gray-600 hover:text-burgundy-600">Testimonials</Link>
              <Link href="/about" className="text-gray-600 hover:text-burgundy-600">About</Link>
              <Link href="/blog" className="text-gray-600 hover:text-burgundy-600">Blog</Link>
              <Link href="/contact" className="text-gray-600 hover:text-burgundy-600">Contact</Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Apply Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <header className="pt-32 pb-20 px-4 bg-gradient-to-br from-burgundy-50 via-white to-gold-50">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm mb-6">
            <Shield className="w-4 h-4 text-gold-500" />
            <span className="text-burgundy-600 font-bold text-sm uppercase tracking-wider">9 Official Accreditations</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            The World's Most <span className="text-burgundy-600 italic">Accredited</span><br />Functional Medicine Program
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            Your certification is only as valuable as its recognition. AccrediPro holds <strong>9 prestigious international accreditations</strong>, ensuring you can practice legally, get insured, and build instant credibility in over 30 countries worldwide.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Insurance Eligible
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              CPD Certified
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Global Recognition
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Post-Nominal Letters
            </span>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, index) => (
              <div key={index} className={`p-4 ${index > 0 ? "md:border-l border-gray-100" : ""}`}>
                <div className="text-4xl font-bold text-burgundy-600 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Accreditation Matters */}
      <section className="py-20 bg-burgundy-50/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-gold-600 font-bold uppercase tracking-wider text-sm">Why It Matters</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">The Power of Proper Accreditation</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <article key={index} className="bg-white p-8 rounded-xl shadow-sm text-center">
                <div className={`w-16 h-16 ${benefit.color} rounded-full flex items-center justify-center mx-auto mb-6`}>
                  <benefit.icon className={`w-8 h-8 ${benefit.iconColor}`} />
                </div>
                <h3 className="font-bold text-xl text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* All 9 Accreditations */}
      <section id="accreditations" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-gold-600 font-bold uppercase tracking-wider text-sm">Complete List</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">Our 9 Official Accreditations</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each accreditation body below has reviewed and approved our curriculum, assessment standards, and practitioner outcomes.
            </p>
          </div>

          <div className="space-y-8">
            {accreditations.map((accred, index) => (
              <article
                key={index}
                className={`bg-burgundy-50/50 p-8 rounded-2xl border-l-4 ${accred.specialBorder || "border-gold-500"} hover:shadow-lg transition`}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="lg:w-1/4 flex items-center justify-center">
                    <div className={`w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-200 ${accred.abbr === "CPD" ? "text-green-700" : "text-burgundy-600"}`}>
                      <span className="font-bold text-xl">{accred.abbr}</span>
                    </div>
                  </div>
                  <div className="lg:w-3/4">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      {accred.badges.map((badge, badgeIndex) => (
                        <span key={badgeIndex} className={`${badge.color} px-3 py-1 rounded-full text-xs font-bold`}>
                          {badge.label}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{accred.name}</h3>
                    <p className="text-gray-600 mb-4">{accred.description}</p>
                    <div className="grid sm:grid-cols-2 gap-3 mb-4">
                      {accred.benefits.map((benefit, benefitIndex) => (
                        <div key={benefitIndex} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-1 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-burgundy-600 font-semibold">
                      {accred.focus}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-burgundy-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join the Most Accredited Program?</h2>
          <p className="text-lg text-burgundy-100 mb-8">
            Start your journey with confidence. Our 9 international accreditations ensure your success.
          </p>
          <Link href="/register">
            <Button size="xl" variant="secondary" className="bg-gold-500 text-burgundy-900 hover:bg-gold-400">
              Apply Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-gold-600 font-bold uppercase tracking-wider text-sm">Questions</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Accreditation FAQ</h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details key={index} className="border border-gray-200 rounded-lg p-6 group">
                <summary className="font-bold text-lg text-gray-900 cursor-pointer list-none flex justify-between items-center">
                  {faq.question}
                  <ChevronDown className="w-5 h-5 text-gold-500 group-open:rotate-180 transition" />
                </summary>
                <p className="text-gray-600 mt-4">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-burgundy-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AP</span>
                </div>
                <span className="text-lg font-bold">AccrediPro</span>
              </div>
              <p className="text-gray-400 text-sm">
                The world's most accredited functional medicine certification. 9 international accreditations. Practice legally in 30+ countries.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li><Link href="/certifications" className="hover:text-white">Certifications</Link></li>
                <li><Link href="/accreditation" className="hover:text-white text-burgundy-400">Accreditation</Link></li>
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Accreditations</h4>
              <ul className="space-y-2 text-gray-500 text-xs">
                <li>CMA • IPHM • IAOTH</li>
                <li>ICAHP • IGCT • CTAA</li>
                <li>IHTCP • IIOHT • CPD</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <p className="text-sm text-gray-400">
                <a href="mailto:info@accredipro.academy" className="hover:text-white">
                  info@accredipro.academy
                </a>
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-center text-gray-400 text-sm">
            <p>&copy; {new Date().getFullYear()} AccrediPro Academy. All rights reserved. | 9 International Accreditations</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
