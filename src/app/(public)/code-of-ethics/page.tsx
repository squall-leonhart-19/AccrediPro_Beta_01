import Link from "next/link";
import { PublicLayout } from "@/components/public/public-layout";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Scale,
  Heart,
  Users,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  XCircle,
  FileText,
  ArrowRight,
  Gavel,
  Eye,
  Lock,
  UserCheck,
} from "lucide-react";

export const metadata = {
  title: "Code of Ethics | AccrediPro Standards Institute",
  description: "Professional conduct standards and ethical guidelines for ASI certified practitioners. Our commitment to integrity, competence, and client welfare.",
  openGraph: {
    title: "ASI Code of Ethics",
    description: "Professional conduct standards for certified health and wellness practitioners.",
  },
};

const coreValues = [
  {
    icon: Shield,
    title: "Integrity",
    description: "Certificants shall conduct themselves with honesty and transparency in all professional activities.",
  },
  {
    icon: UserCheck,
    title: "Competence",
    description: "Certificants shall practice only within the boundaries of their training and certification.",
  },
  {
    icon: Heart,
    title: "Client Welfare",
    description: "The client's well-being shall be the primary concern in all professional decisions.",
  },
  {
    icon: Lock,
    title: "Confidentiality",
    description: "Certificants shall protect client information and maintain appropriate boundaries.",
  },
  {
    icon: Scale,
    title: "Fairness",
    description: "Certificants shall treat all individuals with respect regardless of background.",
  },
  {
    icon: BookOpen,
    title: "Professionalism",
    description: "Certificants shall maintain high standards of professional conduct at all times.",
  },
];

const obligations = [
  {
    category: "Client Relations",
    items: [
      "Obtain informed consent before providing services",
      "Clearly communicate scope of practice and limitations",
      "Refer clients to appropriate professionals when needed",
      "Maintain accurate and confidential records",
      "Never exploit the client relationship for personal gain",
    ],
  },
  {
    category: "Professional Conduct",
    items: [
      "Present qualifications and credentials accurately",
      "Engage in continuous professional development",
      "Report unethical behavior by other practitioners",
      "Avoid conflicts of interest",
      "Maintain professional liability insurance when practicing",
    ],
  },
  {
    category: "Business Practices",
    items: [
      "Provide clear and honest pricing information",
      "Honor all commitments and agreements",
      "Use truthful advertising without false claims",
      "Respect intellectual property rights",
      "Maintain financial transparency with clients",
    ],
  },
];

const prohibitedConduct = [
  "Diagnosing medical conditions (unless licensed to do so)",
  "Prescribing medications or treatments requiring licensure",
  "Making false or misleading claims about services",
  "Practicing while impaired by substances",
  "Engaging in sexual or romantic relationships with clients",
  "Practicing outside the scope of certification",
  "Falsifying credentials or continuing education records",
  "Discrimination based on protected characteristics",
];

const disciplinaryActions = [
  { level: "Letter of Concern", description: "Written notice for minor first-time violations" },
  { level: "Formal Reprimand", description: "Official censure placed in permanent record" },
  { level: "Mandatory Education", description: "Required completion of ethics training" },
  { level: "Probation", description: "Supervised practice for specified period" },
  { level: "Suspension", description: "Temporary loss of certification" },
  { level: "Revocation", description: "Permanent loss of certification" },
];

export default function CodeOfEthicsPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-gold-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-64 h-64 bg-burgundy-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Scale className="w-4 h-4 text-gold-400" />
            <span className="text-sm font-medium text-white/90">Official Document</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Code of <span className="text-gold-400">Ethics</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
            Professional conduct standards that guide ASI certified practitioners
            in maintaining the highest levels of integrity and client care.
          </p>
          <p className="text-sm text-gray-400 italic">
            "The welfare of our clients and the integrity of our profession are our highest priorities."
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-burgundy-600 font-semibold uppercase tracking-wider text-sm">
              Foundation
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Core Ethical Values
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              These values form the foundation of professional conduct for all ASI certificants.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {coreValues.map((value, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-burgundy-100 rounded-xl flex items-center justify-center mb-6">
                  <value.icon className="w-7 h-7 text-burgundy-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Obligations */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-burgundy-600 font-semibold uppercase tracking-wider text-sm">
              Standards of Conduct
            </span>
            <h2 className="text-3xl font-bold text-gray-900 mt-2 mb-4">
              Professional Obligations
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {obligations.map((category, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm">
                <h3 className="text-lg font-bold text-gray-900 mb-6 pb-4 border-b border-gray-100">
                  {category.category}
                </h3>
                <ul className="space-y-4">
                  {category.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prohibited Conduct */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="bg-red-50 border border-red-100 rounded-2xl p-8 lg:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-14 h-14 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-7 h-7 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Prohibited Conduct</h2>
                <p className="text-red-600 text-sm">Violations may result in disciplinary action</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {prohibitedConduct.map((item, i) => (
                <div key={i} className="flex items-start gap-3 bg-white p-4 rounded-xl">
                  <XCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enforcement */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="text-gold-400 font-semibold uppercase tracking-wider text-sm">
              Enforcement
            </span>
            <h2 className="text-3xl font-bold text-white mt-2 mb-4">
              Disciplinary Actions
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Violations of the Code of Ethics may result in the following disciplinary measures,
              depending on severity and circumstances.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {disciplinaryActions.map((action, i) => (
              <div key={i} className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                    <span className="text-gold-400 font-bold text-sm">{i + 1}</span>
                  </div>
                  <h3 className="font-semibold text-white">{action.level}</h3>
                </div>
                <p className="text-sm text-gray-400">{action.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-400 text-sm mb-6">
              To report a potential ethics violation, contact the ASI Ethics Committee.
            </p>
            <Link href="/contact">
              <Button className="bg-gold-500 text-gray-900 hover:bg-gold-400">
                Report a Concern
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-burgundy-50">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Committed to Ethical Practice
          </h2>
          <p className="text-gray-600 mb-8">
            All ASI certified professionals agree to uphold these standards as a condition of certification.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/standards">
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                View Standards
              </Button>
            </Link>
            <Link href="/fm-course-certification">
              <Button className="bg-burgundy-600 hover:bg-burgundy-700">
                Get Certified <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
