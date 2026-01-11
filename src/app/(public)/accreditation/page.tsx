import Link from "next/link";
import { PublicLayout } from "@/components/public/public-layout";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Award,
  Globe,
  CheckCircle,
  ExternalLink,
  ArrowRight,
  FileCheck,
  Building,
  Star,
  BadgeCheck,
} from "lucide-react";

export const metadata = {
  title: "Accreditations | AccrediPro Standards Institute",
  description: "AccrediPro holds 9 international accreditations including CPD, IPHM, CMA, IICT, and more. Our credentials are recognized worldwide.",
  openGraph: {
    title: "ASI Accreditations",
    description: "Internationally recognized certifications backed by 9 accrediting bodies.",
  },
};

const accreditations = [
  {
    name: "CPD Certification Service",
    abbrev: "CPD",
    country: "United Kingdom",
    description: "The world's leading independent CPD accreditation institution. CPD certified courses are recognized by professional bodies worldwide.",
    benefits: ["Global recognition", "Employer confidence", "Professional development credits"],
    logo: "/images/accreditations/cpd.png",
  },
  {
    name: "International Practitioners of Holistic Medicine",
    abbrev: "IPHM",
    country: "United Kingdom",
    description: "Leading accreditor for holistic health practitioners. IPHM membership enables professional insurance in 30+ countries.",
    benefits: ["Insurance eligibility", "Professional directory listing", "Client confidence"],
    logo: "/images/accreditations/iphm.png",
  },
  {
    name: "Complementary Medical Association",
    abbrev: "CMA",
    country: "United Kingdom",
    description: "Premier association for complementary therapists. CMA approval demonstrates the highest standards in holistic health education.",
    benefits: ["UK recognition", "Practitioner insurance", "Professional standards"],
    logo: "/images/accreditations/cma.png",
  },
  {
    name: "International Institute for Complementary Therapists",
    abbrev: "IICT",
    country: "Australia",
    description: "Global professional body supporting natural therapy practitioners. Recognized in Australia, New Zealand, and internationally.",
    benefits: ["Australia/NZ recognition", "Insurance support", "Member resources"],
    logo: "/images/accreditations/iict.png",
  },
  {
    name: "International Compliance Assurance for Health Professionals",
    abbrev: "ICAHP",
    country: "International",
    description: "Ensures compliance with international standards for health education programs.",
    benefits: ["International compliance", "Quality assurance", "Educational standards"],
    logo: "/images/accreditations/icahp.png",
  },
];

const benefits = [
  {
    icon: Globe,
    title: "Global Recognition",
    description: "Our certifications are recognized in 50+ countries around the world.",
  },
  {
    icon: FileCheck,
    title: "Insurance Eligibility",
    description: "Qualify for professional liability insurance with accredited credentials.",
  },
  {
    icon: BadgeCheck,
    title: "Employer Confidence",
    description: "Stand out to employers with internationally recognized qualifications.",
  },
  {
    icon: Star,
    title: "Client Trust",
    description: "Build credibility with clients who seek properly credentialed practitioners.",
  },
];

export default function AccreditationPage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative py-20 lg:py-28 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-gold-400/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
            <Shield className="w-4 h-4 text-gold-400" />
            <span className="text-sm font-medium text-gold-400">9 International Accreditations</span>
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Internationally <span className="text-gold-400">Accredited</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Our certifications are backed by the world's leading accrediting bodies,
            ensuring your credentials are recognized and respected globally.
          </p>
        </div>
      </section>

      {/* Why Accreditation Matters */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-burgundy-600 font-semibold uppercase tracking-wider text-sm">
              Why It Matters
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              The Power of Accreditation
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Accreditation isn't just a badge—it's your key to professional practice,
              insurance eligibility, and client confidence.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-burgundy-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <benefit.icon className="w-8 h-8 text-burgundy-600" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{benefit.title}</h3>
                <p className="text-gray-600 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accreditation Bodies */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-burgundy-600 font-semibold uppercase tracking-wider text-sm">
              Our Partners
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-4">
              Accrediting Bodies
            </h2>
          </div>

          <div className="space-y-6">
            {accreditations.map((accred, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-col lg:flex-row gap-8">
                  <div className="lg:w-32 flex-shrink-0">
                    <div className="w-24 h-24 bg-gray-100 rounded-xl flex items-center justify-center mx-auto lg:mx-0">
                      <span className="text-2xl font-bold text-burgundy-600">{accred.abbrev}</span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-3">
                      <h3 className="text-xl font-bold text-gray-900">{accred.name}</h3>
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                        {accred.country}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{accred.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {accred.benefits.map((benefit, j) => (
                        <span
                          key={j}
                          className="inline-flex items-center gap-1 text-sm text-green-700 bg-green-50 px-3 py-1 rounded-full"
                        >
                          <CheckCircle className="w-3 h-3" />
                          {benefit}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Badges */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-8">
            Additional Recognitions & Affiliations
          </h3>
          <div className="flex flex-wrap justify-center items-center gap-8">
            {["IAHC", "IAHC", "AHLC", "NBCHC"].map((badge, i) => (
              <div
                key={i}
                className="w-20 h-20 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 font-bold"
              >
                {badge}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verify Section */}
      <section className="py-20 bg-burgundy-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Shield className="w-16 h-16 text-burgundy-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Verify Any ASI Credential
          </h2>
          <p className="text-gray-600 mb-8">
            Employers, clients, and institutions can verify any ASI credential through our
            public verification system.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/professionals">
              <Button size="lg" className="bg-burgundy-600 hover:bg-burgundy-700">
                Find Professionals <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/standards">
              <Button size="lg" variant="outline">
                View Standards
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Get Accredited Credentials
          </h2>
          <p className="text-gray-400 mb-8">
            Join thousands of professionals with internationally recognized certifications.
          </p>
          <Link href="/fm-course-certification">
            <Button size="lg" className="bg-gold-500 text-gray-900 hover:bg-gold-400">
              Start Your Certification <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </PublicLayout>
  );
}
