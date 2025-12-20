import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Star,
  MapPin,
  ArrowRight,
  Play,
} from "lucide-react";

export const metadata = {
  title: "Student Testimonials & Success Stories",
  description: "Read real success stories from AccrediPro graduates. See how our functional medicine certification transformed careers and lives worldwide. 98% satisfaction rate.",
  openGraph: {
    title: "Success Stories from AccrediPro Graduates",
    description: "1,000+ graduates, 98% satisfaction rate. Read how functional medicine certification transformed their careers.",
    type: "website",
  },
  alternates: {
    canonical: "https://accredipro.academy/testimonials",
  },
};

export default function TestimonialsPage() {
  const stats = [
    { value: "1,000+", label: "Graduates Worldwide" },
    { value: "98%", label: "Student Satisfaction" },
    { value: "4.9/5", label: "Average Rating" },
    { value: "30+", label: "Countries Represented" },
  ];

  const featuredTestimonials = [
    {
      name: "Sarah Mitchell",
      role: "Former Nurse → Functional Medicine Practitioner",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80",
      quote: "After 15 years as an ER nurse, I was burned out and disillusioned with the healthcare system. AccrediPro gave me the knowledge and credentials to start my own functional medicine practice. Within 6 months of graduating, I replaced my nursing income and now work from home helping clients heal from chronic conditions.",
      location: "Austin, Texas, USA",
      rating: 5,
    },
    {
      name: "James Turner",
      role: "Personal Trainer → Health Coach",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80",
      quote: "The accreditation was key for me. I was already a personal trainer but clients kept asking about nutrition and hormones. Now with my AccrediPro certification, I can offer comprehensive health coaching AND get professional insurance. My client retention doubled!",
      location: "London, UK",
      rating: 5,
    },
    {
      name: "Emma Lawson",
      role: "Stay-at-Home Mom → Online Health Coach",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80",
      quote: "I started AccrediPro with zero healthcare background—just a passion for wellness and a dream to help others. The self-paced format let me study while my kids slept. Now I run a thriving online practice specializing in gut health, and I set my own hours!",
      location: "Sydney, Australia",
      rating: 5,
    },
    {
      name: "Dr. Michael Rodriguez",
      role: "Pharmacist → Functional Medicine Consultant",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=150&h=150&q=80",
      quote: "As a pharmacist, I knew medications weren't solving root causes. AccrediPro filled the gap in my education with practical, actionable protocols. The CPD certification counted towards my pharmacy continuing education—a bonus! Now I consult on the side and plan to transition full-time next year.",
      location: "Toronto, Canada",
      rating: 5,
    },
  ];

  const quickReviews = [
    { quote: "The curriculum is incredibly comprehensive. I compared 5 different programs and AccrediPro had the most depth for the best price.", author: "Lisa K., USA" },
    { quote: "Got my insurance approval within 2 weeks of graduating. The IPHM accreditation made the process seamless.", author: "Mark T., UK" },
    { quote: "The business module alone was worth the investment. I launched my practice with clients before I even graduated!", author: "Anna S., Germany" },
    { quote: "Daily mentorship is incredible. Whenever I had questions, the coaches responded within hours. True support.", author: "David M., New Zealand" },
    { quote: "I can finally use MCMA after my name. It adds so much credibility when marketing to potential clients.", author: "Rachel P., Ireland" },
    { quote: "The 14 individual certificates are genius. I can specialize in hormones AND gut health with proof.", author: "Chen W., Singapore" },
    { quote: "Left my hospital job after 20 years. Best decision ever. Now I help thyroid patients full-time from home.", author: "Patricia S., RN, Florida" },
    { quote: "The gut health module helped me reverse my own IBS. Now I help others do the same. Incredible program!", author: "Michelle D., California" },
    { quote: "Sarah's mentorship was game-changing. She answered every question and helped me price my services.", author: "Jennifer W., Texas" },
    { quote: "From burned out ER nurse to thriving FM practitioner in 5 months. Never looked back.", author: "Karen M., ARNP, Ohio" },
    { quote: "The hormone module alone was worth 10x the price. My clients see real results.", author: "Stephanie L., Colorado" },
    { quote: "I now charge $200/session and have a 3-month waiting list. AccrediPro changed my life.", author: "Amanda C., New York" },
    { quote: "Finally understand the root cause approach. Medical school never taught me this.", author: "Dr. Jennifer W., MD, Virginia" },
    { quote: "Added FM to my chiropractic practice. Patient retention tripled.", author: "Dr. Tiffany N., DC, Arizona" },
    { quote: "Zero healthcare background. Now I help women with hormones and make more than my corporate salary.", author: "Rachel T., Illinois" },
    { quote: "The autoimmune module helped me understand my own Hashimoto's. Now I specialize in it.", author: "Patricia S., RN, Michigan" },
    { quote: "Got my first 5 clients before even finishing the program. The business training works!", author: "Maria S., PA-C, California" },
    { quote: "My pharmacist colleagues are jealous. I work 20 hours a week from home now.", author: "Sandra L., PharmD, Nevada" },
    { quote: "The R.O.O.T.S. protocol is genius. My clients finally get to the bottom of their issues.", author: "Lisa R., NP, Georgia" },
    { quote: "9 international accreditations. That's what sold me. No other program comes close.", author: "David K., UK" },
    { quote: "Finished while working full-time and raising 3 kids. Self-paced format was perfect.", author: "Ines M., LVN, Texas" },
    { quote: "The Coach Workspace alone saves me $100/month in software fees. Everything included.", author: "Tammie J., North Carolina" },
    { quote: "My clients call me a miracle worker. It's just functional medicine done right.", author: "Angela P., Florida" },
    { quote: "Left my $150K/year corporate job. Now I make more helping people actually heal.", author: "Christine B., Washington" },
    { quote: "The weight management protocol helped my client lose 47 lbs. She referred 8 more clients.", author: "Nancy G., RD, Oregon" },
    { quote: "Finally practicing medicine the way it should be practiced. Root cause, not band-aids.", author: "Dr. Michael R., MD, Canada" },
    { quote: "The stress and adrenal module was exactly what I needed. HPA axis finally makes sense.", author: "Julie H., NP, Massachusetts" },
    { quote: "Went from $0 to $8K/month in my first 90 days. Sarah's launch strategy works.", author: "Kimberly W., Tennessee" },
    { quote: "My patients ask why their doctor never taught them this. I just smile.", author: "Rebecca M., RN, Pennsylvania" },
    { quote: "The liver detox protocol is science-based and effective. Not like other programs.", author: "Cynthia D., Arizona" },
    { quote: "Charging $3K for 3-month packages. Clients happily pay because they get results.", author: "Deborah A., New Jersey" },
    { quote: "The private community is incredible. Real practitioners helping each other succeed.", author: "Theresa K., Wisconsin" },
    { quote: "My husband thought I was crazy to invest $197. Now he's proud of my $12K months.", author: "Sharon L., Indiana" },
    { quote: "The blood sugar module helped me reverse my own prediabetes. Now I help clients do the same.", author: "Donna C., RN, Missouri" },
    { quote: "Finally understand why conventional medicine kept failing my patients.", author: "Dr. Barbara H., NP, Connecticut" },
    { quote: "The skin health connection to gut was mind-blowing. My aesthetics clients love it.", author: "Carol M., Minnesota" },
    { quote: "Got featured in local news as a functional medicine expert. Thanks AccrediPro!", author: "Diane S., Virginia" },
    { quote: "The brain health module helped my mom with early dementia. Personal and professional win.", author: "Laura B., RN, Maryland" },
    { quote: "Quit nursing. Now I work 15 hours a week and outearn my old salary.", author: "Susan P., Kansas" },
    { quote: "The fertility module helped 3 of my clients get pregnant after years of trying.", author: "Elizabeth R., NP, Utah" },
    { quote: "My clients fly in from other states to see me. That's the power of specialization.", author: "Margaret T., Colorado" },
    { quote: "The meal planning templates save me hours every week. So practical!", author: "Dorothy W., Ohio" },
    { quote: "Finally feel like a real health professional. The credentials opened so many doors.", author: "Betty J., New York" },
    { quote: "The cardiovascular module changed how I think about heart health. Prevention focused.", author: "Linda F., RN, Florida" },
    { quote: "My chiropractor husband now refers all his nutrition cases to me. Team approach works.", author: "Helen K., Alabama" },
    { quote: "The menopause protocol gave me my life back. Now I help other women through it.", author: "Ruth A., 52, California" },
    { quote: "Insurance companies accept my credentials. That was the game-changer.", author: "Sandra M., NP, Texas" },
    { quote: "The pediatric nutrition module helped my grandson. Now I specialize in kids.", author: "Martha W., Tennessee" },
    { quote: "Replaced my teaching salary in 4 months. Education background actually helped!", author: "Catherine P., Former Teacher, Georgia" },
    { quote: "The joint and bone health module helped my arthritis clients ditch their meds.", author: "Frances C., RN, Virginia" },
    { quote: "My Instagram following went from 200 to 15,000 after sharing my certification journey.", author: "Evelyn R., Florida" },
    { quote: "The sleep optimization protocol works. My insomnia clients finally rest.", author: "Jean H., NP, Arizona" },
    { quote: "Charging premium rates because I have premium credentials. Simple math.", author: "Alice B., Washington" },
    { quote: "The immune system module during COVID was perfectly timed. Helped so many.", author: "Marie S., RN, New York" },
    { quote: "My corporate wellness contracts pay $5K/month. B2B is where the money is.", author: "Joyce T., Illinois" },
    { quote: "The digestive enzyme protocols changed everything for my SIBO clients.", author: "Ann M., NP, California" },
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
              <Link href="/testimonials" className="text-burgundy-600 font-semibold">Testimonials</Link>
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
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-burgundy-600 font-bold uppercase tracking-wider text-sm mb-4 block">
            Success Stories
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Real Students. <span className="text-burgundy-600 italic">Real Results.</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            Discover how AccrediPro graduates are transforming lives—including their own. These are their stories.
          </p>
          {/* Rating Badge */}
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-sm">
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-gold-500 fill-gold-500" />
              ))}
            </div>
            <span className="text-gray-900 font-bold">4.9/5</span>
            <span className="text-gray-500">from 500+ reviews</span>
          </div>
        </div>
      </header>

      {/* Stats Bar */}
      <section className="py-12 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index}>
                <div className="text-4xl font-bold text-burgundy-600 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Testimonials */}
      <section className="py-20 bg-burgundy-50/30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-gold-600 font-bold uppercase tracking-wider text-sm">Featured Stories</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">Transformation Journeys</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {featuredTestimonials.map((testimonial, index) => (
              <article key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-4 border-gold-400"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900">{testimonial.name}</h3>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                    <div className="flex gap-0.5 text-gold-500 mt-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>
                <blockquote className="text-gray-600 italic mb-4">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center gap-2 text-sm text-burgundy-600 font-semibold">
                  <MapPin className="w-4 h-4" />
                  <span>{testimonial.location}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* More Testimonials Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-gold-600 font-bold uppercase tracking-wider text-sm">More Reviews</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-2">What Our Students Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {quickReviews.map((review, index) => (
              <div key={index} className="bg-burgundy-50 p-6 rounded-xl">
                <div className="flex gap-0.5 text-gold-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm mb-4">"{review.quote}"</p>
                <p className="font-bold text-gray-900 text-sm">— {review.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* CTA */}
      <section className="py-20 bg-burgundy-50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            Ready to Write Your Success Story?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join 1,000+ graduates who transformed their careers with AccrediPro.
          </p>
          <Link href="/register">
            <Button size="xl">
              Start Your Journey
              <ArrowRight className="w-5 h-5 ml-2" />
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
                The world's most accredited functional medicine certification. Join 1,000+ successful graduates.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li><Link href="/certifications" className="hover:text-white">Certifications</Link></li>
                <li><Link href="/accreditation" className="hover:text-white">Accreditation</Link></li>
                <li><Link href="/testimonials" className="hover:text-white text-burgundy-400">Testimonials</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
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
