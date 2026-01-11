import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Shield,
  ArrowRight,
  MapPin,
  Award,
  Linkedin,
  Mail,
  ChevronRight,
} from "lucide-react";

export const metadata = {
  title: "Leadership Team | Accreditation Standards Institute",
  description: "Meet the leadership team behind ASI. Our experts in functional medicine, education, and standards development are dedicated to elevating the profession.",
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

const leadership = [
  {
    name: "Dr. Elizabeth Warren",
    title: "Founder & CEO",
    bio: "Former Cleveland Clinic physician with 20 years in functional medicine. Founded ASI to address the credentialing gap in the industry. Board-certified in Internal Medicine and Functional Medicine.",
    credentials: "MD, BC-FMP, IFMCP",
    image: "/avatars/leadership-1.webp",
    linkedin: "#",
  },
  {
    name: "Dr. Michael Chen",
    title: "Chief Academic Officer",
    bio: "Led curriculum development at two major medical schools. Passionate about competency-based education and assessment innovation. 15+ years in medical education.",
    credentials: "PhD, EdD",
    image: "/avatars/leadership-2.webp",
    linkedin: "#",
  },
  {
    name: "Sarah Thompson",
    title: "Chief Operations Officer",
    bio: "Former VP at Coursera with expertise in scaling education companies globally. Oversees ASI's global operations across 45+ countries.",
    credentials: "MBA, Stanford",
    image: "/avatars/leadership-3.webp",
    linkedin: "#",
  },
  {
    name: "Dr. Amina Hassan",
    title: "Director, Middle East & Africa",
    bio: "Based in Dubai, leads ASI's expansion in the MENA region. 12 years in healthcare administration and practitioner development.",
    credentials: "DBA, BC-FMP",
    image: "/avatars/leadership-4.webp",
    linkedin: "#",
  },
  {
    name: "Dr. Rachel Foster",
    title: "Chief Medical Advisor",
    bio: "Leading functional medicine researcher and author of 3 textbooks. Ensures all ASI curriculum reflects the latest evidence-based practices.",
    credentials: "MD, PhD, FACP",
    image: "/avatars/leadership-5.webp",
    linkedin: "#",
  },
  {
    name: "James Mitchell",
    title: "Chief Technology Officer",
    bio: "Built learning platforms serving 10M+ students. Leads ASI's technology innovation including AI-powered learning and assessment.",
    credentials: "MS Computer Science, MIT",
    image: "/avatars/leadership-6.webp",
    linkedin: "#",
  },
];

const advisors = [
  {
    name: "Dr. Mark Hyman",
    title: "Medical Advisory Board",
    affiliation: "The UltraWellness Center",
  },
  {
    name: "Dr. Sara Gottfried",
    title: "Women's Health Advisor",
    affiliation: "Author & Educator",
  },
  {
    name: "Dr. Frank Lipman",
    title: "Integrative Medicine Advisor",
    affiliation: "Eleven Eleven Wellness",
  },
  {
    name: "Dr. Terry Wahls",
    title: "Autoimmune Specialty Advisor",
    affiliation: "University of Iowa",
  },
];

export default function LeadershipPage() {
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
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[200px]">
                    <Link href="/about" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>About ASI</Link>
                    <Link href="/leadership" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Leadership Team</Link>
                    <Link href="/code-of-ethics" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Code of Ethics</Link>
                  </div>
                </div>
              </div>
              <Link href="/standards" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity" style={{ color: BRAND.burgundy }}>Standards</Link>
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
            <Award className="w-4 h-4" style={{ color: BRAND.gold }} />
            <span className="text-sm font-medium" style={{ color: BRAND.gold }}>Meet the Team</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Our
            <span className="block" style={{ color: BRAND.gold }}>Leadership Team</span>
          </h1>

          <p className="text-xl max-w-2xl mx-auto" style={{ color: "#f5e6e8" }}>
            Experts in functional medicine, education, and standards development — dedicated to elevating the profession.
          </p>
        </div>
      </section>

      {/* Executive Team */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
              Executive Leadership
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The team driving ASI's mission to set the global standard for functional medicine certification
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {leadership.map((person, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-[4/3] bg-gradient-to-br from-burgundy-100 to-burgundy-50 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center text-3xl font-bold" style={{ backgroundColor: BRAND.burgundy, color: "white" }}>
                    {person.name.split(" ").map(n => n[0]).join("")}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1" style={{ color: BRAND.burgundy }}>{person.name}</h3>
                  <p className="font-semibold mb-1" style={{ color: BRAND.gold }}>{person.title}</p>
                  <p className="text-sm text-gray-500 mb-3">{person.credentials}</p>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">{person.bio}</p>
                  <a href={person.linkedin} className="inline-flex items-center gap-2 text-sm font-medium hover:opacity-70 transition-opacity" style={{ color: BRAND.burgundy }}>
                    <Linkedin className="w-4 h-4" />
                    Connect on LinkedIn
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Advisory Board */}
      <section className="py-20 md:py-28" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
              Medical Advisory Board
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              World-renowned experts guiding our curriculum and standards
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {advisors.map((advisor, i) => (
              <div key={i} className="bg-white rounded-xl p-6 text-center shadow-sm border border-gray-100">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold" style={{ backgroundColor: `${BRAND.gold}20`, color: BRAND.burgundy }}>
                  {advisor.name.split(" ").map(n => n[0]).join("")}
                </div>
                <h3 className="font-bold mb-1" style={{ color: BRAND.burgundy }}>{advisor.name}</h3>
                <p className="text-sm mb-1" style={{ color: BRAND.gold }}>{advisor.title}</p>
                <p className="text-xs text-gray-500">{advisor.affiliation}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Join Our Team CTA */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
            Want to Join Our Team?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            We're always looking for passionate educators, practitioners, and industry experts to join our mission.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/careers">
              <Button size="lg" className="font-bold text-lg px-8 py-6 h-auto hover:opacity-90" style={{ backgroundColor: BRAND.burgundy, color: "white" }}>
                View Open Positions
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="mailto:careers@asi.edu">
              <Button size="lg" variant="outline" className="font-bold text-lg px-8 py-6 h-auto" style={{ borderColor: BRAND.burgundy, color: BRAND.burgundy }}>
                <Mail className="w-5 h-5 mr-2" />
                careers@asi.edu
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
              <h4 className="font-bold mb-4" style={{ color: BRAND.gold }}>Quick Links</h4>
              <ul className="space-y-2 text-sm" style={{ color: "#f5e6e8" }}>
                <li><Link href="/certifications" className="hover:text-white transition-colors">Certifications</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">About</Link></li>
                <li><Link href="/leadership" className="hover:text-white transition-colors">Leadership</Link></li>
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
