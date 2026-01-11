import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import {
  Shield,
  ArrowRight,
  MapPin,
  Star,
  Quote,
  Play,
  Clock,
  DollarSign,
  Users,
  Award,
  ChevronRight,
} from "lucide-react";

export const metadata = {
  title: "Success Stories | Accreditation Standards Institute",
  description: "Read inspiring success stories from ASI-certified practitioners who transformed their careers. Real people, real results.",
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

const featuredStories = [
  {
    name: "Jennifer Martinez",
    title: "Functional Medicine Practitioner",
    location: "Austin, TX",
    photo: "/success-stories/jennifer.webp",
    credentials: "BC-FMP",
    headline: "From Corporate Burnout to Thriving Practice",
    story: `After 15 years in corporate marketing, I was burned out and searching for meaning. I'd always been passionate about health, but never thought I could make a career of it without going back to medical school.

    When I found ASI, everything changed. The program was rigorous but flexible — I completed it while working my day job. Within 3 months of certification, I had my first 5 clients. Six months later, I quit my corporate job.

    Today, I run a thriving virtual practice helping women with autoimmune conditions. I make more than I did in corporate, work fewer hours, and wake up excited every day. ASI didn't just give me a credential — they gave me a complete career transformation roadmap.`,
    outcome: "$125K",
    outcomeLabel: "First Year Income",
    timeToFirstClient: "3 weeks",
    previousCareer: "Marketing Director",
  },
  {
    name: "Dr. Rachel Thompson",
    title: "Women's Health Specialist",
    location: "Dubai, UAE",
    photo: "/success-stories/rachel.webp",
    credentials: "BC-WHS",
    headline: "Taking My Medical Career to the Next Level",
    story: `As a conventionally trained physician, I felt limited by the 15-minute appointments and symptom-suppression approach. I wanted to help patients get to the root cause of their issues, especially women struggling with hormones.

    ASI's Women's Health certification gave me the framework and protocols I needed. The program was evidence-based and practical — not just theory. I could apply what I learned immediately with patients.

    I've now built a specialized menopause and perimenopause practice that serves clients across the Middle East and Europe. My patients get the time and attention they deserve, and I finally feel like I'm practicing medicine the way I always wanted to.`,
    outcome: "300+",
    outcomeLabel: "Clients Served",
    timeToFirstClient: "Immediately",
    previousCareer: "General Practitioner",
  },
  {
    name: "Lisa Chen",
    title: "Holistic Nutrition Coach",
    location: "San Francisco, CA",
    photo: "/success-stories/lisa.webp",
    credentials: "HN-CP",
    headline: "Career Change at 52",
    story: `At 52, I thought it was too late to change careers. I'd been a stay-at-home mom for 20 years, and my kids were finally grown. I was passionate about nutrition but had no professional experience.

    ASI's supportive community made all the difference. My study pod kept me accountable, and my success coach helped me believe I could do this. The program was challenging, but I completed it in 10 weeks.

    Within 2 months of certification, I had 8 paying clients — all from word-of-mouth referrals. A year later, I'm booked solid with a waitlist. It's never too late to pursue your passion.`,
    outcome: "8",
    outcomeLabel: "Clients in 60 Days",
    timeToFirstClient: "4 weeks",
    previousCareer: "Stay-at-home Mom",
  },
];

const quickWins = [
  {
    name: "Amanda K.",
    credential: "FM-CP",
    quote: "Certified in 6 weeks. First client 10 days later. Best investment I've ever made.",
    outcome: "$4,200",
    outcomeLabel: "First Month",
  },
  {
    name: "Michelle R.",
    credential: "CHC",
    quote: "The study pod community was incredible. I made lifelong friends and professional connections.",
    outcome: "12",
    outcomeLabel: "Referrals from Cohort",
  },
  {
    name: "Sarah T.",
    credential: "BC-WHS",
    quote: "Finally a credential that employers actually recognize. Got hired at a functional medicine clinic within weeks.",
    outcome: "$85K",
    outcomeLabel: "Starting Salary",
  },
  {
    name: "Diana L.",
    credential: "GH-CP",
    quote: "The curriculum was so practical. I was using what I learned with clients before I even finished.",
    outcome: "100%",
    outcomeLabel: "Pass Rate",
  },
];

const stats = [
  { value: "$2,400", label: "Avg First Month Income" },
  { value: "14 Days", label: "Avg Time to First Client" },
  { value: "94%", label: "Would Recommend" },
  { value: "73%", label: "Complete Within 30 Days" },
];

export default function SuccessStoriesPage() {
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
              <Link href="/about" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity" style={{ color: BRAND.burgundy }}>About</Link>
              <Link href="/standards" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity" style={{ color: BRAND.burgundy }}>Standards</Link>
              <Link href="/certifications" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity" style={{ color: BRAND.burgundy }}>Certifications</Link>
              <div className="relative group">
                <Link href="/careers" className="px-4 py-2 font-medium hover:opacity-70 transition-opacity flex items-center gap-1" style={{ color: BRAND.burgundy }}>
                  Careers <ChevronRight className="w-4 h-4 rotate-90" />
                </Link>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2 min-w-[200px]">
                    <Link href="/careers" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Career Paths</Link>
                    <Link href="/success-stories" className="block px-4 py-2 text-sm hover:bg-gray-50" style={{ color: BRAND.burgundy }}>Success Stories</Link>
                  </div>
                </div>
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
      <section className="relative py-20 md:py-28 text-white overflow-hidden" style={{ backgroundColor: BRAND.burgundyDark }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, ${BRAND.gold} 1px, transparent 0)`,
            backgroundSize: '48px 48px'
          }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6" style={{ backgroundColor: `${BRAND.gold}20`, border: `1px solid ${BRAND.gold}40` }}>
            <Star className="w-4 h-4" style={{ color: BRAND.gold }} />
            <span className="text-sm font-medium" style={{ color: BRAND.gold }}>Real People, Real Results</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Success
            <span className="block" style={{ color: BRAND.gold }}>Stories</span>
          </h1>

          <p className="text-xl max-w-2xl mx-auto mb-8" style={{ color: "#f5e6e8" }}>
            Hear from practitioners who transformed their careers with ASI certification.
          </p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-b border-gray-100" style={{ backgroundColor: BRAND.cream }}>
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl md:text-4xl font-bold mb-1" style={{ color: BRAND.burgundy }}>{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16" style={{ color: BRAND.burgundy }}>
            Featured Stories
          </h2>

          <div className="space-y-16">
            {featuredStories.map((story, i) => (
              <div key={i} className={`grid lg:grid-cols-2 gap-12 items-center ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
                <div className={i % 2 === 1 ? 'lg:order-2' : ''}>
                  <div className="aspect-square max-w-md mx-auto bg-gradient-to-br from-burgundy-100 to-burgundy-50 rounded-3xl flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full flex items-center justify-center text-4xl font-bold" style={{ backgroundColor: BRAND.burgundy, color: "white" }}>
                      {story.name.split(" ").map(n => n[0]).join("")}
                    </div>
                  </div>
                </div>

                <div className={i % 2 === 1 ? 'lg:order-1' : ''}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: BRAND.gold, color: BRAND.burgundyDark }}>
                      {story.credentials}
                    </span>
                    <span className="text-sm text-gray-500">{story.location}</span>
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: BRAND.burgundy }}>
                    {story.headline}
                  </h3>

                  <p className="text-lg font-medium mb-4" style={{ color: BRAND.gold }}>
                    {story.name}, {story.title}
                  </p>

                  <div className="text-gray-600 leading-relaxed mb-6 whitespace-pre-line">
                    {story.story}
                  </div>

                  <div className="grid grid-cols-3 gap-4 p-4 rounded-xl" style={{ backgroundColor: `${BRAND.gold}10` }}>
                    <div className="text-center">
                      <div className="text-2xl font-bold" style={{ color: BRAND.burgundy }}>{story.outcome}</div>
                      <div className="text-xs text-gray-500">{story.outcomeLabel}</div>
                    </div>
                    <div className="text-center border-x border-gray-200">
                      <div className="text-2xl font-bold" style={{ color: BRAND.burgundy }}>{story.timeToFirstClient}</div>
                      <div className="text-xs text-gray-500">Time to First Client</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-bold" style={{ color: BRAND.burgundy }}>{story.previousCareer}</div>
                      <div className="text-xs text-gray-500">Previous Career</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Wins */}
      <section className="py-20 md:py-28" style={{ backgroundColor: BRAND.burgundyDark }}>
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
            More Success Stories
          </h2>
          <p className="text-xl text-center mb-16" style={{ color: "#f5e6e8" }}>
            Quick wins from our community of certified practitioners
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickWins.map((story, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4" style={{ color: BRAND.gold, fill: BRAND.gold }} />
                  ))}
                </div>
                <Quote className="w-8 h-8 mb-2" style={{ color: `${BRAND.gold}50` }} />
                <p className="text-white mb-4 text-sm leading-relaxed">{story.quote}</p>
                <div className="flex justify-between items-end mt-auto pt-4 border-t border-white/10">
                  <div>
                    <p className="font-bold text-white">{story.name}</p>
                    <p className="text-xs" style={{ color: BRAND.gold }}>{story.credential}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold" style={{ color: BRAND.gold }}>{story.outcome}</p>
                    <p className="text-xs" style={{ color: "#f5e6e8" }}>{story.outcomeLabel}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: BRAND.burgundy }}>
            Ready to Write Your Success Story?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join 20,000+ practitioners who've transformed their careers with ASI certification.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/apply">
              <Button size="lg" className="font-bold text-lg px-8 py-6 h-auto hover:opacity-90" style={{ backgroundColor: BRAND.burgundy, color: "white" }}>
                Apply Now
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link href="/certifications">
              <Button size="lg" variant="outline" className="font-bold text-lg px-8 py-6 h-auto" style={{ borderColor: BRAND.burgundy, color: BRAND.burgundy }}>
                Explore Certifications
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
                <li><Link href="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link href="/success-stories" className="hover:text-white transition-colors">Success Stories</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4" style={{ color: BRAND.gold }}>Get Started</h4>
              <ul className="space-y-2 text-sm" style={{ color: "#f5e6e8" }}>
                <li><Link href="/apply" className="hover:text-white transition-colors">Apply Now</Link></li>
                <li><Link href="/womens-health-mini-diploma" className="hover:text-white transition-colors">Free Mini-Diploma</Link></li>
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
