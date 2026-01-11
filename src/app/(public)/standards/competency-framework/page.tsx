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
  Briefcase,
  Brain,
  HeartPulse,
  Stethoscope,
  ChevronDown,
  Layers,
  GraduationCap,
} from "lucide-react";

export const metadata = {
  title: "Competency Framework | Accreditation Standards Institute",
  description: "Explore ASI's comprehensive competency framework. Our evidence-based domains ensure practitioners master both knowledge and real-world application skills.",
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

export default function CompetencyFrameworkPage() {
  const competencyDomains = [
    {
      icon: BookOpen,
      title: "Domain 1: Foundational Knowledge",
      weight: "30%",
      description: "Deep understanding of functional medicine principles, systems biology, and the science of root-cause health.",
      competencies: [
        "Understand the functional medicine model and its key principles",
        "Apply systems biology thinking to health conditions",
        "Interpret research and evidence-based literature",
        "Understand pathophysiology of common conditions",
        "Knowledge of nutrient biochemistry and metabolism",
      ],
    },
    {
      icon: ClipboardCheck,
      title: "Domain 2: Clinical Assessment",
      weight: "25%",
      description: "Skills in gathering, analyzing, and interpreting client health information to identify root causes.",
      competencies: [
        "Conduct comprehensive health history intakes",
        "Identify patterns and connections across body systems",
        "Interpret functional lab results within scope",
        "Recognize red flags requiring medical referral",
        "Use timeline and matrix tools effectively",
      ],
    },
    {
      icon: HeartPulse,
      title: "Domain 3: Protocol Development",
      weight: "20%",
      description: "Ability to create personalized, evidence-based wellness plans that address root causes.",
      competencies: [
        "Design individualized nutrition protocols",
        "Develop lifestyle modification plans",
        "Understand supplement applications within scope",
        "Create phased intervention strategies",
        "Adapt protocols based on client response",
      ],
    },
    {
      icon: Users,
      title: "Domain 4: Coaching & Communication",
      weight: "15%",
      description: "Mastery of behavior change science and the ability to guide clients toward lasting transformation.",
      competencies: [
        "Apply motivational interviewing techniques",
        "Use active listening and powerful questions",
        "Support clients through stages of change",
        "Handle resistance and setbacks effectively",
        "Build trust and maintain rapport",
      ],
    },
    {
      icon: Briefcase,
      title: "Domain 5: Professional Practice",
      weight: "10%",
      description: "Ethical conduct, legal awareness, and collaboration skills for professional practice.",
      competencies: [
        "Practice within legal and ethical boundaries",
        "Maintain proper documentation and records",
        "Collaborate with healthcare providers",
        "Apply HIPAA and confidentiality principles",
        "Commit to ongoing professional development",
      ],
    },
  ];

  const proficiencyLevels = [
    {
      level: "Level 1: Foundation",
      description: "Demonstrates basic understanding and can apply concepts under guidance",
      characteristics: ["Recognizes key concepts", "Follows established protocols", "Needs mentorship for complex cases"],
    },
    {
      level: "Level 2: Proficient",
      description: "Independently applies knowledge to standard client situations",
      characteristics: ["Works independently", "Adapts protocols appropriately", "Handles common challenges"],
    },
    {
      level: "Level 3: Advanced",
      description: "Handles complex cases and contributes to the field",
      characteristics: ["Manages complex cases", "Mentors others", "Contributes to best practices"],
    },
    {
      level: "Level 4: Expert",
      description: "Recognized authority who advances the profession",
      characteristics: ["Thought leader", "Develops new approaches", "Shapes industry standards"],
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
                    <Link href="/standards/competency-framework" className="block px-4 py-2 text-sm hover:bg-gray-50 font-semibold" style={{ color: BRAND.gold }}>Competency Framework</Link>
                    <Link href="/standards/assessment" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Assessment Process</Link>
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
            <Layers className="w-4 h-4" style={{ color: BRAND.gold }} />
            <span className="text-sm font-medium" style={{ color: BRAND.gold }}>ASI Competency Framework</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            The Foundation of
            <span className="block" style={{ color: BRAND.gold }}>Excellence</span>
          </h1>

          <p className="text-xl max-w-2xl mx-auto mb-8" style={{ color: "#f5e6e8" }}>
            Our comprehensive competency framework ensures every ASI-certified practitioner can deliver real results — not just pass a test.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apply">
              <Button size="lg" className="font-bold text-lg px-8 py-6 h-auto" style={{ backgroundColor: BRAND.gold, color: BRAND.burgundyDark }}>
                Start Your Certification
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6" style={{ color: BRAND.burgundy }}>
            Beyond Knowledge — Proven Competency
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Traditional certifications test what you know. ASI certifications test what you can <strong>do</strong>.
            Our competency framework is built on five interconnected domains, each assessed through multiple methods
            to ensure graduates are truly prepared for professional practice. This is why employers trust ASI credentials.
          </p>
        </div>
      </section>

      {/* Competency Domains */}
      <section className="py-20" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
              Five Competency Domains
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every ASI certification assesses performance across these interconnected domains
            </p>
          </div>

          <div className="space-y-8">
            {competencyDomains.map((domain, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="p-8">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${BRAND.gold}20` }}>
                        <domain.icon className="w-8 h-8" style={{ color: BRAND.burgundy }} />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                        <h3 className="text-xl font-bold" style={{ color: BRAND.burgundy }}>{domain.title}</h3>
                        <span className="text-sm font-bold px-3 py-1 rounded-full mt-2 sm:mt-0" style={{ backgroundColor: BRAND.gold, color: BRAND.burgundyDark }}>
                          Weight: {domain.weight}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-4">{domain.description}</p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {domain.competencies.map((comp, j) => (
                          <div key={j} className="flex items-start gap-2">
                            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: BRAND.gold }} />
                            <span className="text-sm text-gray-700">{comp}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proficiency Levels */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
              Proficiency Levels
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Progress through four levels of mastery as you advance your career
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {proficiencyLevels.map((level, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4 text-xl font-bold" style={{ backgroundColor: BRAND.burgundy, color: "white" }}>
                  {i + 1}
                </div>
                <h3 className="text-lg font-bold mb-2" style={{ color: BRAND.burgundy }}>{level.level}</h3>
                <p className="text-sm text-gray-600 mb-4">{level.description}</p>
                <ul className="space-y-2">
                  {level.characteristics.map((char, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: BRAND.gold }} />
                      <span className="text-gray-700">{char}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It's Assessed */}
      <section className="py-20" style={{ backgroundColor: BRAND.burgundyDark }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              How Competencies Are Assessed
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: "#f5e6e8" }}>
              Multiple assessment methods ensure comprehensive evaluation
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: BRAND.gold }}>
                <BookOpen className="w-8 h-8" style={{ color: BRAND.burgundyDark }} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Knowledge Assessments</h3>
              <p style={{ color: "#f5e6e8" }}>Module quizzes, case-based questions, and comprehensive exams test your understanding of core concepts.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: BRAND.gold }}>
                <ClipboardCheck className="w-8 h-8" style={{ color: BRAND.burgundyDark }} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Practical Applications</h3>
              <p style={{ color: "#f5e6e8" }}>Case studies, protocol development projects, and scenario-based assessments demonstrate real-world skills.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: BRAND.gold }}>
                <Users className="w-8 h-8" style={{ color: BRAND.burgundyDark }} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Performance Review</h3>
              <p style={{ color: "#f5e6e8" }}>Recorded sessions, peer reviews, and mentor evaluations assess communication and coaching abilities.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
            Ready to Demonstrate Your Competency?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join 20,000+ practitioners who've proven their skills through ASI's rigorous competency framework.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apply">
              <Button size="lg" className="font-bold text-lg px-8 py-6 h-auto hover:opacity-90" style={{ backgroundColor: BRAND.burgundy, color: "white" }}>
                Apply Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/standards/assessment">
              <Button size="lg" variant="outline" className="font-bold text-lg px-8 py-6 h-auto" style={{ borderColor: BRAND.burgundy, color: BRAND.burgundy }}>
                Learn About Assessment
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
