import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Mail,
} from "lucide-react";
import { featuredPost, blogPosts } from "@/lib/blog-data";

export const metadata = {
  title: "Blog | Functional Medicine Insights | AccrediPro Academy",
  description: "Expert articles on functional medicine, gut health, hormones, nutrition, and building a health coaching practice. Free resources from AccrediPro Academy.",
  openGraph: {
    title: "Functional Medicine Blog | AccrediPro Academy",
    description: "Expert articles on functional medicine, gut health, hormones, nutrition, and building a health coaching practice.",
    type: "website",
  },
};

export default function BlogPage() {
  const categories = [
    "All Posts",
    "Gut Health",
    "Hormones",
    "Nutrition",
    "Business",
    "Career",
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
              <Link href="/about" className="text-gray-600 hover:text-burgundy-600">About</Link>
              <Link href="/blog" className="text-burgundy-600 font-semibold">Blog</Link>
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
            AccrediPro Blog
          </span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Functional Medicine <span className="text-burgundy-600 italic">Insights</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl mx-auto">
            Expert articles on root-cause health, clinical protocols, and building a thriving wellness practice. Free education from our faculty.
          </p>
        </div>
      </header>

      {/* Categories */}
      <section className="py-8 bg-white border-y border-gray-100 sticky top-16 z-40">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                  index === 0
                    ? "bg-burgundy-600 text-white"
                    : "bg-burgundy-50 text-burgundy-600 hover:bg-burgundy-100"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16 bg-burgundy-50/30">
        <div className="max-w-6xl mx-auto px-4">
          <Link href={`/blog/${featuredPost.slug}`}>
            <article className="bg-white rounded-2xl shadow-xl overflow-hidden grid md:grid-cols-2 hover:-translate-y-2 transition duration-300 cursor-pointer">
              <div className="relative h-64 md:h-auto">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-gold-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  FEATURED
                </div>
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                  <span className="bg-burgundy-50 px-3 py-1 rounded-full text-burgundy-600 font-semibold text-xs">
                    {featuredPost.category}
                  </span>
                  <span>•</span>
                  <span>{featuredPost.readTime}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 hover:text-burgundy-600 transition">
                  {featuredPost.title}
                </h2>
                <p className="text-gray-600 mb-6">{featuredPost.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={featuredPost.author.image}
                      alt={featuredPost.author.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{featuredPost.author.name}</p>
                      <p className="text-xs text-gray-500">{featuredPost.date}</p>
                    </div>
                  </div>
                  <span className="text-burgundy-600 font-bold text-sm hover:text-gold-600 transition flex items-center gap-1">
                    Read More <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </article>
          </Link>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl font-bold text-gray-900">Latest Articles</h2>
            <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm">
              <option>Most Recent</option>
              <option>Most Popular</option>
              <option>Oldest First</option>
            </select>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((article, index) => (
              <Link key={index} href={`/blog/${article.slug}`}>
                <article className="bg-burgundy-50/50 rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition duration-300 h-full">
                  <div className="h-48 overflow-hidden">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover hover:scale-110 transition duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                      <span className="bg-white px-2 py-1 rounded text-burgundy-600 font-semibold">
                        {article.category}
                      </span>
                      <span>•</span>
                      <span>{article.readTime}</span>
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-3 hover:text-burgundy-600 transition line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{article.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">{article.date}</span>
                      <span className="text-burgundy-600 font-bold text-sm hover:text-gold-600 transition">
                        Read →
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-12">
            <button className="w-10 h-10 rounded-full bg-burgundy-600 text-white font-bold">1</button>
            <button className="w-10 h-10 rounded-full bg-burgundy-50 text-burgundy-600 font-bold hover:bg-burgundy-100 transition">2</button>
            <button className="w-10 h-10 rounded-full bg-burgundy-50 text-burgundy-600 font-bold hover:bg-burgundy-100 transition">3</button>
            <button className="w-10 h-10 rounded-full bg-burgundy-50 text-burgundy-600 font-bold hover:bg-burgundy-100 transition">
              <ArrowRight className="w-4 h-4 mx-auto" />
            </button>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-20 bg-burgundy-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Mail className="w-12 h-12 text-gold-400 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Weekly Insights</h2>
          <p className="text-burgundy-100 mb-8 max-w-xl mx-auto">
            Join 5,000+ health professionals receiving our weekly newsletter with clinical tips, research updates, and practice-building strategies.
          </p>
          <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-gold-500 focus:outline-none"
            />
            <Button type="submit" variant="secondary" className="bg-gold-500 text-burgundy-900 hover:bg-gold-400">
              Subscribe
            </Button>
          </form>
          <p className="text-xs text-burgundy-300 mt-4">No spam. Unsubscribe anytime.</p>
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
                Free functional medicine education. Expert insights. Practice-building strategies.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li><Link href="/certifications" className="hover:text-white">Certifications</Link></li>
                <li><Link href="/accreditation" className="hover:text-white">Accreditation</Link></li>
                <li><Link href="/blog" className="hover:text-white text-burgundy-400">Blog</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><Link href="/testimonials" className="hover:text-white">Testimonials</Link></li>
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
