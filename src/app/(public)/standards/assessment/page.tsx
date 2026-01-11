import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Shield,
  CheckCircle,
  ArrowRight,
  MapPin,
  Award,
  BookOpen,
  Target,
  FileCheck,
  Users,
  ClipboardCheck,
  ChevronDown,
  RefreshCw,
  Clock,
  Play,
  PenTool,
  MessageSquare,
  BarChart,
} from "lucide-react";

export const metadata = {
  title: "Assessment Process | Accreditation Standards Institute",
  description: "Learn how ASI assessments work. Our multi-modal approach combines knowledge tests, practical applications, and performance reviews to ensure competency.",
};

const BRAND = {
  burgundy: "#722f37",
  burgundyDark: "#4e1f24",
  gold: "#d4af37",
  goldLight: "#e8c547",
  cream: "#fdf8f0",
  goldMetallic: "linear-gradient(135deg, #d4af37 0%, #f7e7a0 25%, #d4af37 50%, #b8860b 75%, #d4af37 100%)",
  burgundyMetallic: "linear-gradient(135deg, #722f37 0%, #9a4a54 25%, #722f37 50%, #4e1f24 75%, #722f37 100%)",
};

export default function AssessmentPage() {
  const assessmentTypes = [
    {
      icon: BookOpen,
      title: "Module Assessments",
      description: "Knowledge checks at the end of each learning module ensure comprehension before progressing.",
      details: [
        "20-30 questions per module",
        "Immediate feedback on incorrect answers",
        "Must pass with 80% to proceed",
        "Unlimited retakes allowed",
      ],
    },
    {
      icon: FileCheck,
      title: "Case Study Analysis",
      description: "Apply your knowledge to realistic client scenarios demonstrating clinical reasoning.",
      details: [
        "3-5 comprehensive case studies",
        "Identify root causes and patterns",
        "Develop appropriate recommendations",
        "Graded by expert reviewers",
      ],
    },
    {
      icon: PenTool,
      title: "Protocol Development",
      description: "Create personalized wellness protocols showing your ability to apply knowledge.",
      details: [
        "Develop complete client protocols",
        "Address multiple body systems",
        "Include phased implementation",
        "Demonstrate evidence-based approach",
      ],
    },
    {
      icon: MessageSquare,
      title: "Coaching Demonstration",
      description: "Recorded or live sessions showing your communication and coaching skills.",
      details: [
        "15-30 minute coaching session",
        "Demonstrate active listening",
        "Use motivational interviewing",
        "Evaluated by certified coaches",
      ],
    },
    {
      icon: ClipboardCheck,
      title: "Final Examination",
      description: "Comprehensive assessment covering all competency domains and specialization areas.",
      details: [
        "100-150 questions",
        "2-3 hour time limit",
        "Passing score: 75%",
        "89% first-attempt pass rate",
      ],
    },
  ];

  const processSteps = [
    {
      step: "1",
      title: "Complete Coursework",
      description: "Work through all learning modules at your own pace. Each module ends with a knowledge assessment.",
      icon: BookOpen,
    },
    {
      step: "2",
      title: "Submit Practical Work",
      description: "Complete case studies, protocol development projects, and coaching demonstrations.",
      icon: PenTool,
    },
    {
      step: "3",
      title: "Receive Feedback",
      description: "Expert reviewers evaluate your work and provide detailed feedback for improvement.",
      icon: MessageSquare,
    },
    {
      step: "4",
      title: "Take Final Exam",
      description: "When ready, schedule your comprehensive final examination through our online testing center.",
      icon: ClipboardCheck,
    },
    {
      step: "5",
      title: "Get Certified",
      description: "Upon passing, receive your official ASI credential and join the practitioner directory.",
      icon: Award,
    },
  ];

  const examFAQs = [
    {
      q: "How long do I have to complete assessments?",
      a: "You have 12 months from enrollment to complete all assessments. Extensions are available for extenuating circumstances.",
    },
    {
      q: "What if I fail an assessment?",
      a: "Module assessments have unlimited retakes at no extra cost. Final exams allow 3 attempts included with enrollment, with additional attempts available for a small fee.",
    },
    {
      q: "Are assessments proctored?",
      a: "Final examinations are proctored online using AI-powered monitoring software. Module assessments are not proctored but have time limits.",
    },
    {
      q: "Can I use notes during exams?",
      a: "Module assessments are open-book. Final examinations are closed-book to ensure you've internalized the knowledge.",
    },
    {
      q: "How soon do I get results?",
      a: "Module assessments provide instant results. Case studies and practical work are graded within 5 business days. Final exam results within 48 hours.",
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
              🇺🇸 USA Headquarters
            </span>
            <span className="flex items-center gap-2">
              <MapPin className="w-3 h-3" style={{ color: BRAND.gold }} />
              🇦🇪 Dubai Office
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

            <div className="hidden lg:flex items-center gap-1">
              <div className="relative group">
                <button className="px-4 py-2 font-medium hover:opacity-70 transition-opacity flex items-center gap-1 cursor-pointer" style={{ color: BRAND.burgundy }}>
                  About <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[200px]">
                    <Link href="/about" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>About ASI</Link>
                    <Link href="/leadership" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Leadership Team</Link>
                    <Link href="/code-of-ethics" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Code of Ethics</Link>
                  </div>
                </div>
              </div>
              <div className="relative group">
                <button className="px-4 py-2 font-medium hover:opacity-70 transition-opacity flex items-center gap-1 cursor-pointer" style={{ color: BRAND.burgundy }}>
                  Standards <ChevronDown className="w-4 h-4" />
                </button>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[220px]">
                    <Link href="/standards" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Our Standards</Link>
                    <Link href="/standards/competency-framework" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Competency Framework</Link>
                    <Link href="/standards/assessment" className="block px-4 py-2 text-sm hover:bg-gray-50 font-semibold" style={{ color: BRAND.gold }}>Assessment Process</Link>
                    <Link href="/standards/recertification" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Recertification</Link>
                  </div>
                </div>
              </div>
              <Link href="/certifications" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity" style={{ color: BRAND.burgundy }}>Certifications</Link>
              <Link href="/careers" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity" style={{ color: BRAND.burgundy }}>Careers</Link>
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
      <section className="relative py-20 md:py-28 text-white overflow-hidden" style={{ backgroundColor: BRAND.burgundyDark }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${BRAND.gold} 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
            <ClipboardCheck className="w-4 h-4" style={{ color: BRAND.gold }} />
            <span className="text-sm font-medium" style={{ color: BRAND.gold }}>Assessment Process</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Prove Your
            <span className="block" style={{ color: BRAND.gold }}>Competency</span>
          </h1>

          <p className="text-xl max-w-2xl mx-auto mb-8" style={{ color: "#f5e6e8" }}>
            Our multi-modal assessment approach ensures you're truly prepared for real-world practice — not just good at taking tests.
          </p>

          <div className="inline-flex items-center gap-6 px-6 py-3 rounded-full bg-white/10">
            <div className="text-center">
              <p className="text-2xl font-bold text-white">89%</p>
              <p className="text-xs" style={{ color: "#f5e6e8" }}>First-attempt pass rate</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">5 Types</p>
              <p className="text-xs" style={{ color: "#f5e6e8" }}>Of assessments</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div className="text-center">
              <p className="text-2xl font-bold text-white">Unlimited</p>
              <p className="text-xs" style={{ color: "#f5e6e8" }}>Module retakes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Assessment Types */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
              Assessment Types
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We use multiple assessment methods to ensure comprehensive evaluation of your competencies
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {assessmentTypes.map((assessment, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: `${BRAND.gold}20` }}>
                  <assessment.icon className="w-7 h-7" style={{ color: BRAND.burgundy }} />
                </div>
                <h3 className="text-xl font-bold mb-2" style={{ color: BRAND.burgundy }}>{assessment.title}</h3>
                <p className="text-gray-600 mb-4">{assessment.description}</p>
                <ul className="space-y-2">
                  {assessment.details.map((detail, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: BRAND.gold }} />
                      <span className="text-gray-700">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment Journey */}
      <section className="py-20" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
              Your Assessment Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A clear path from enrollment to certification
            </p>
          </div>

          <div className="relative">
            <div className="absolute top-24 left-0 right-0 h-1 hidden lg:block" style={{ backgroundColor: `${BRAND.gold}30` }} />
            <div className="grid lg:grid-cols-5 gap-8">
              {processSteps.map((step, i) => (
                <div key={i} className="relative text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10 shadow-lg" style={{ backgroundColor: BRAND.burgundy }}>
                    <step.icon className="w-7 h-7 text-white" />
                  </div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: BRAND.gold, color: BRAND.burgundyDark }}>
                    Step {step.step}
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: BRAND.burgundy }}>{step.title}</h3>
                  <p className="text-sm text-gray-600">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
              Assessment FAQs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Common questions about our assessment process
            </p>
          </div>

          <div className="space-y-4">
            {examFAQs.map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-2" style={{ color: BRAND.burgundy }}>{faq.q}</h3>
                <p className="text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20" style={{ backgroundColor: BRAND.burgundyDark }}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
            Ready to Get Started?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: "#f5e6e8" }}>
            Join thousands of practitioners who've successfully completed ASI certification assessments.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apply">
              <Button size="lg" className="font-bold text-lg px-8 py-6 h-auto" style={{ backgroundColor: BRAND.gold, color: BRAND.burgundyDark }}>
                Apply Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/womens-health-mini-diploma">
              <Button size="lg" variant="outline" className="font-bold text-lg px-8 py-6 h-auto border-white text-white hover:bg-white/10">
                Try Free Mini-Diploma
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-white py-16" style={{ backgroundColor: BRAND.burgundyDark }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
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
              </p>
            </div>

            <div>
              <h4 className="font-bold mb-4" style={{ color: BRAND.gold }}>Standards</h4>
              <ul className="space-y-2 text-sm" style={{ color: "#f5e6e8" }}>
                <li><Link href="/standards" className="hover:text-white transition-colors">Our Standards</Link></li>
                <li><Link href="/standards/competency-framework" className="hover:text-white transition-colors">Competency Framework</Link></li>
                <li><Link href="/standards/assessment" className="hover:text-white transition-colors">Assessment Process</Link></li>
                <li><Link href="/standards/recertification" className="hover:text-white transition-colors">Recertification</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4" style={{ color: BRAND.gold }}>Contact</h4>
              <ul className="space-y-2 text-sm" style={{ color: "#f5e6e8" }}>
                <li><a href="mailto:info@asi.edu" className="hover:text-white transition-colors">info@asi.edu</a></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}>
            <p className="text-sm" style={{ color: "#f5e6e8" }}>
              © 2026 Accreditation Standards Institute. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm" style={{ color: "#f5e6e8" }}>
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
