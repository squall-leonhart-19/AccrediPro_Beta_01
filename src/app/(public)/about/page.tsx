import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Target,
  Eye,
  Scale,
  Gem,
  Handshake,
  Users,
  ArrowRight,
  CheckCircle,
  Award,
  Globe,
  GraduationCap,
  BookOpen,
} from "lucide-react";

export const metadata = {
  title: "About Us - Our Mission & Team",
  description: "Learn about AccrediPro Academy's mission, vision, and the team behind the world's most accredited functional medicine certification program. 9 international accreditations.",
  openGraph: {
    title: "About AccrediPro Academy",
    description: "Discover our mission to empower health practitioners with world-class functional medicine education.",
    type: "website",
  },
  alternates: {
    canonical: "https://accredipro.academy/about",
  },
};

export default function AboutPage() {
  const values = [
    {
      icon: Scale,
      title: "Truth",
      description: "Evidence-based education rooted in scientific research, not trends.",
    },
    {
      icon: Gem,
      title: "Excellence",
      description: "Uncompromising quality in curriculum design and student support.",
    },
    {
      icon: Handshake,
      title: "Integrity",
      description: "Honest pricing, transparent accreditations, ethical practices.",
    },
    {
      icon: Users,
      title: "Accessibility",
      description: "World-class education at a price that doesn't require debt.",
    },
  ];

  const reasons = [
    {
      number: "01",
      title: "Most Accredited",
      description: "9 international accreditations mean your certificate is recognized everywhere, and you can get insured in 30+ countries.",
    },
    {
      number: "02",
      title: "Certificate Per Module",
      description: "We pioneered the 1-certificate-per-module structure. Complete 14 modules, earn 14 specialization certificates.",
    },
    {
      number: "03",
      title: "Business Training Included",
      description: "Unlike competitors, we include comprehensive business training, client acquisition, and even your own professional website.",
    },
    {
      number: "04",
      title: "Daily Mentorship",
      description: "Live daily support from coaches and faculty. You're never alone on this journey—we're with you every step.",
    },
    {
      number: "05",
      title: "Affordable Pricing",
      description: "At $997, we're a fraction of competitors charging $7,000-$15,000+ for less comprehensive programs.",
    },
    {
      number: "06",
      title: "Real Client Experience",
      description: "We guarantee you'll work with real clients during training—not just simulations. Graduate ready to practice.",
    },
  ];

  const stats = [
    { value: "9", label: "Accreditations" },
    { value: "95+", label: "Expert Faculty" },
    { value: "30+", label: "Countries" },
    { value: "14", label: "Certifications" },
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
              <Link href="/accreditation" className="text-gray-600 hover:text-burgundy-600">Accreditations</Link>
              <Link href="/testimonials" className="text-gray-600 hover:text-burgundy-600">Testimonials</Link>
              <Link href="/about" className="text-burgundy-600 font-semibold">About</Link>
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
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-burgundy-600 font-bold uppercase tracking-wider text-sm mb-4 block">
            About AccrediPro
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Truth, Excellence & <span className="text-burgundy-600 italic">Integrity</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
            We founded AccrediPro with a singular vision: to create the most comprehensive, accessible, and
            accredited functional medicine education in the world.
          </p>
          <p className="text-lg italic text-burgundy-600">"Veritas et Excellentia"</p>
        </div>
      </header>

      {/* Mission & Vision */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-burgundy-50 p-10 rounded-2xl">
              <div className="w-16 h-16 bg-burgundy-600 rounded-full flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-gold-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h2>
              <p className="text-gray-600 leading-relaxed">
                To democratize functional medicine education by making world-class training accessible,
                affordable, and globally recognized. We empower individuals to become certified practitioners
                who can legally and ethically help others achieve optimal health through root-cause approaches.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-burgundy-50 p-10 rounded-2xl">
              <div className="w-16 h-16 bg-burgundy-600 rounded-full flex items-center justify-center mb-6">
                <Eye className="w-8 h-8 text-gold-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h2>
              <p className="text-gray-600 leading-relaxed">
                A world where everyone has access to practitioners who understand the interconnectedness of body
                systems and can address the root causes of chronic illness. We envision graduates in every
                community, transforming healthcare from reactive to proactive.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-burgundy-600 font-bold uppercase tracking-wider text-sm">Our Story</span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2 mb-6">
                Why We Started AccrediPro
              </h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  AccrediPro was born from frustration. We saw aspiring health coaches paying $10,000+ for
                  certifications that left them without insurance eligibility, without business skills, and
                  without true clinical competence.
                </p>
                <p>
                  We knew there had to be a better way. So we assembled a team of functional medicine doctors,
                  experienced educators, and business strategists to create something different: a program
                  that combines rigorous clinical education with practical business training—all at a fraction
                  of the cost.
                </p>
                <p>
                  <strong>Today, AccrediPro holds 9 international accreditations</strong>—more than any other
                  program in our space. Our graduates practice in 30+ countries, get insured, and build
                  thriving careers helping others heal.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="AccrediPro Team"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-burgundy-600 text-white p-6 rounded-xl shadow-lg">
                <p className="font-bold text-2xl">2,500+</p>
                <p className="text-xs uppercase tracking-widest text-gold-300">Career Transformations</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-burgundy-600 font-bold uppercase tracking-wider text-sm">What We Stand For</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Our Core Values</h2>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="w-20 h-20 bg-burgundy-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-burgundy-600 transition-colors">
                  <value.icon className="w-8 h-8 text-burgundy-600 group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-burgundy-600 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-5xl font-bold text-gold-400 mb-2">{stat.value}</div>
                <div className="text-sm uppercase tracking-wider text-burgundy-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-burgundy-600 font-bold uppercase tracking-wider text-sm">The AccrediPro Difference</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Why Students Choose Us</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {reasons.map((reason, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-shadow">
                <div className="text-4xl font-bold text-burgundy-400 mb-4">{reason.number}</div>
                <h3 className="font-bold text-xl text-gray-900 mb-3">{reason.title}</h3>
                <p className="text-gray-600 text-sm">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-burgundy-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join Our Community?</h2>
          <p className="text-lg text-burgundy-100 mb-8">
            Begin your transformation into a certified functional medicine practitioner.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="xl" variant="secondary" className="bg-white text-burgundy-700 hover:bg-gray-100">
                Apply Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="xl" variant="outline" className="border-white/50 text-gray-900 bg-white/90 hover:bg-white">
                Contact Us
              </Button>
            </Link>
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
                The world's most accredited functional medicine certification. Truth, Excellence, and Integrity in education.
              </p>
              <p className="text-gray-500 text-sm mt-4 italic">Veritas Et Excellentia</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li><Link href="/certifications" className="hover:text-white">Certifications</Link></li>
                <li><Link href="/accreditation" className="hover:text-white">Accreditation</Link></li>
                <li><Link href="/about" className="hover:text-white text-burgundy-400">About Us</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/testimonials" className="hover:text-white">Testimonials</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
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
            <p>&copy; {new Date().getFullYear()} AccrediPro Academy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
