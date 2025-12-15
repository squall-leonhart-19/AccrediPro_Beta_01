import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Award,
  BookOpen,
  Users,
  CheckCircle,
  ArrowRight,
  Star,
  GraduationCap,
  MessageSquare,
  Shield,
  Sparkles,
  Target,
  TrendingUp,
  Heart,
} from "lucide-react";

export default function HomePage() {
  const pillars = [
    {
      icon: Target,
      title: "Orientation",
      subtitle: "WHO AM I BECOMING?",
      description: "Explore your path and see yourself as a practitioner. Our Mini Diploma helps you discover if this career transformation is right for you.",
      color: "bg-green-100 text-green-600",
    },
    {
      icon: Award,
      title: "Legitimacy",
      subtitle: "CAN I DO THIS FOR REAL?",
      description: "Establish professional legitimacy with verified certificates for every module. Stand behind your work with confidence.",
      color: "bg-gold-100 text-gold-600",
    },
    {
      icon: Sparkles,
      title: "Embodiment",
      subtitle: "DO I FEEL LIKE A PRACTITIONER?",
      description: "Practice thinking like a practitioner through real case walkthroughs, client programs, and community wins.",
      color: "bg-orange-100 text-orange-600",
    },
    {
      icon: TrendingUp,
      title: "Expansion",
      subtitle: "WHAT'S MY FUTURE?",
      description: "Your professional growth continues with specialization tracks, advanced certifications, and mentorship opportunities.",
      color: "bg-burgundy-100 text-burgundy-600",
    },
  ];

  const transformations = [
    { from: "Uncertainty", to: "Legitimacy" },
    { from: "Interest", to: "Practice" },
    { from: "Knowledge", to: "Real Path" },
    { from: "Self-doubt", to: "Confidence" },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/newlogo.webp"
                alt="AccrediPro Academy"
                className="h-10 w-auto"
              />
            </Link>

            <div className="hidden md:flex items-center gap-8">
              <Link href="/certifications" className="text-gray-600 hover:text-burgundy-600">
                Certifications
              </Link>
              <Link href="/accreditation" className="text-gray-600 hover:text-burgundy-600">
                Accreditations
              </Link>
              <Link href="/testimonials" className="text-gray-600 hover:text-burgundy-600">
                Testimonials
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-burgundy-600">
                About
              </Link>
              <Link href="/blog" className="text-gray-600 hover:text-burgundy-600">
                Blog
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-burgundy-600">
                Contact
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Start Your Path</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section - Career Transformation Focus */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-burgundy-50 via-white to-gold-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 bg-burgundy-100 text-burgundy-800 border-0">
              Career Transformation Platform for Health & Wellness Practitioners
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Step Into Your New
              <span className="gradient-text"> Professional Identity</span>
            </h1>

            <p className="text-xl text-gray-600 mb-4 max-w-3xl mx-auto">
              People don't buy certifications. They buy <strong>permission to become someone new</strong>.
            </p>

            <p className="text-lg text-gray-500 mb-8 max-w-2xl mx-auto">
              AccrediPro is the first professional practitioner pathway that issues a verified certificate for every completed specialization module — building your multi-disciplinary profile over time.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/free-mini-diploma">
                <Button size="xl" className="w-full sm:w-auto">
                  Explore This Path
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/catalog">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  See Yourself Here
                </Button>
              </Link>
            </div>

            {/* Transformation Stats */}
            <div className="flex flex-wrap justify-center gap-8 pt-8 border-t border-gray-200">
              <div className="text-center">
                <p className="text-3xl font-bold text-burgundy-600">2,500+</p>
                <p className="text-gray-500">Career Transformations</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-burgundy-600">12</p>
                <p className="text-gray-500">Specialization Modules</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-burgundy-600">97%</p>
                <p className="text-gray-500">Feel More Legitimate</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-burgundy-600">4.9</p>
                <p className="text-gray-500">Student Rating</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Transformation Section */}
      <section id="transformation" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              What You're Really Building
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              A certification is just the artifact. The real product is your transformation.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {transformations.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl border border-gray-200 text-center hover:shadow-lg transition-all"
              >
                <p className="text-gray-400 line-through mb-2">{item.from}</p>
                <ArrowRight className="w-5 h-5 text-burgundy-400 mx-auto mb-2" />
                <p className="text-xl font-bold text-burgundy-600">{item.to}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-gradient-to-r from-burgundy-600 to-burgundy-700 rounded-2xl p-8 text-center text-white">
            <h3 className="text-2xl font-bold mb-4">
              "You're building your professional path."
            </h3>
            <p className="text-burgundy-100 max-w-2xl mx-auto">
              Instead of a single, generic credential, you graduate with a portfolio of focused certifications that reflect your real expertise and professional growth.
            </p>
          </div>
        </div>
      </section>

      {/* 4 Pillars Section */}
      <section id="pillars" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              The 4-Pillar Career Transformation Model
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We don't just teach you — we transform who you are professionally.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {pillars.map((pillar, index) => (
              <div
                key={index}
                className="p-8 rounded-2xl border border-gray-200 hover:border-burgundy-200 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 ${pillar.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <pillar.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">
                      {pillar.subtitle}
                    </p>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {pillar.title}
                    </h3>
                    <p className="text-gray-600">{pillar.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-burgundy-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              This Is Different From Other Certifications
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div>
              <h3 className="text-lg font-semibold text-gray-400 mb-4">OLD WAY (Certification-Selling)</h3>
              <ul className="space-y-3">
                {[
                  '"Get certified"',
                  '"Earn a credential"',
                  '"Complete modules"',
                  '"Pass the exam"',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-500">
                    <span className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs">✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-burgundy-600 mb-4">NEW WAY (Career Transformation)</h3>
              <ul className="space-y-3">
                {[
                  '"Step into a new professional identity"',
                  '"Establish professional legitimacy"',
                  '"Practice thinking like a practitioner"',
                  '"Build a real path, not just knowledge"',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-gray-700 font-medium">
                    <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-green-600" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-burgundy-600 to-burgundy-700">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Transform Your Professional Identity?
          </h2>
          <p className="text-xl text-burgundy-100 mb-8 max-w-2xl mx-auto">
            You're not buying a certification. You're choosing a career identity.
            Start with our free Mini Diploma to explore this path.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/free-mini-diploma">
              <Button size="xl" variant="secondary" className="bg-white text-burgundy-700 hover:bg-gray-100">
                Start Free Mini Diploma
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/career-center">
              <Button size="xl" variant="outline" className="border-white/50 text-gray-900 bg-white/90 hover:bg-white">
                Explore Career Paths
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Real Transformations, Real Stories
            </h2>
            <p className="text-xl text-gray-600">
              Hear from practitioners who stepped into their new professional identity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Maria S.",
                role: "Now: Certified Functional Medicine Practitioner",
                before: "Before: Confused about career direction",
                content:
                  "I didn't just learn functional medicine — I became a practitioner. The module certificates gave me the confidence to start working with clients before I even finished the full program.",
              },
              {
                name: "Elena K.",
                role: "Now: Running her own practice",
                before: "Before: Felt like an imposter",
                content:
                  "At 47, I thought I was too old to change careers. AccrediPro didn't just give me knowledge — it gave me permission to call myself a practitioner. That identity shift changed everything.",
              },
              {
                name: "Patricia R.",
                role: "Now: Health coach with 12 clients",
                before: "Before: Interested but unsure",
                content:
                  "The Mini Diploma helped me see if this was right for me. Then each module certificate built my confidence. I signed my first client after Module 3!",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100"
              >
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="w-5 h-5 fill-gold-400 text-gold-400"
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div className="border-t pt-4">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-burgundy-600 font-medium">{testimonial.role}</p>
                  <p className="text-xs text-gray-400">{testimonial.before}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <Heart className="w-12 h-12 text-burgundy-400 mx-auto mb-6" />
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
            Where Can This Take You in 1–3 Years?
          </h2>
          <p className="text-gray-600 mb-8">
            Explore your future path with our Career Center. See real career trajectories
            from practitioners who started exactly where you are now.
          </p>
          <Link href="/career-center">
            <Button size="lg" variant="outline">
              Explore Career Center
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
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
                Career Transformation & Professional Identity Platform for Health & Wellness Practitioners.
              </p>
              <p className="text-gray-500 text-sm mt-4 italic">
                Veritas Et Excellentia
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li><Link href="/certifications" className="hover:text-white">Certifications</Link></li>
                <li><Link href="/accreditation" className="hover:text-white">Accreditations</Link></li>
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
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
            <p>&copy; {new Date().getFullYear()} AccrediPro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
