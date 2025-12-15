import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllPosts } from "@/lib/blog-data";
import {
  Heart,
  BookmarkPlus,
  Clock,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  ChevronRight,
  Calendar,
  Tag,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found | AccrediPro Blog",
    };
  }

  return {
    title: `${post.title} | AccrediPro Blog`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [post.author.name],
      images: [post.image],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image],
    },
  };
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = getAllPosts()
    .filter(p => p.slug !== post.slug)
    .slice(0, 3);

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
              <Link href="/certifications" className="text-gray-600 hover:text-burgundy-600 transition">Certifications</Link>
              <Link href="/accreditation" className="text-gray-600 hover:text-burgundy-600 transition">Accreditations</Link>
              <Link href="/testimonials" className="text-gray-600 hover:text-burgundy-600 transition">Testimonials</Link>
              <Link href="/about" className="text-gray-600 hover:text-burgundy-600 transition">About</Link>
              <Link href="/blog" className="text-burgundy-600 font-semibold">Blog</Link>
              <Link href="/contact" className="text-gray-600 hover:text-burgundy-600 transition">Contact</Link>
            </div>

            <div className="flex items-center gap-4">
              <Link href="/login" className="hidden sm:block">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/register">
                <Button>Apply Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="pt-20 bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-burgundy-600 transition">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/blog" className="hover:text-burgundy-600 transition">Blog</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium truncate max-w-[200px]">{post.title}</span>
          </div>
        </div>
      </div>

      {/* Article Header */}
      <header className="bg-gradient-to-b from-gray-50 to-white py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Category & Meta */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <span className="bg-burgundy-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
              {post.category}
            </span>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-6">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-gray-600 leading-relaxed mb-8">
            {post.excerpt}
          </p>

          {/* Author */}
          <div className="flex items-center gap-4 pb-8 border-b border-gray-200">
            <img
              src={post.author.image}
              alt={post.author.name}
              className="w-14 h-14 rounded-full object-cover ring-4 ring-white shadow-md"
            />
            <div>
              <p className="font-bold text-gray-900">{post.author.name}</p>
              <p className="text-sm text-gray-500">{post.author.role}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Featured Image */}
      <div className="max-w-5xl mx-auto px-4 -mt-4">
        <div className="rounded-2xl overflow-hidden shadow-2xl">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 md:h-[400px] lg:h-[500px] object-cover"
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid lg:grid-cols-[1fr_280px] gap-12">
            {/* Article Content */}
            <article className="min-w-0">
              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-wrap items-center gap-2">
                  <Tag className="w-5 h-5 text-gray-400" />
                  <span className="text-sm font-semibold text-gray-600 mr-2">Tags:</span>
                  {["Functional Medicine", post.category, "Health", "Wellness"].map((tag) => (
                    <span
                      key={tag}
                      className="bg-gray-100 text-gray-600 text-sm px-3 py-1 rounded-full hover:bg-burgundy-50 hover:text-burgundy-600 transition cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Share & Actions */}
              <div className="mt-8 p-6 bg-gray-50 rounded-xl">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-700">Share this article:</span>
                    <div className="flex gap-2">
                      <button className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-80 transition">
                        <Facebook className="w-5 h-5" />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:opacity-80 transition">
                        <Twitter className="w-5 h-5" />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-[#0A66C2] text-white flex items-center justify-center hover:opacity-80 transition">
                        <Linkedin className="w-5 h-5" />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-gray-600 text-white flex items-center justify-center hover:opacity-80 transition">
                        <Mail className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                      <Heart className="w-4 h-4" /> Like
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2">
                      <BookmarkPlus className="w-4 h-4" /> Save
                    </Button>
                  </div>
                </div>
              </div>

              {/* Author Box */}
              <div className="mt-8 p-6 bg-burgundy-50 rounded-xl">
                <div className="flex flex-col sm:flex-row gap-6">
                  <img
                    src={post.author.image}
                    alt={post.author.name}
                    className="w-20 h-20 rounded-full object-cover ring-4 ring-white shadow-lg flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm text-burgundy-600 font-semibold uppercase tracking-wide mb-1">About the Author</p>
                    <h4 className="text-xl font-bold text-gray-900 mb-2">{post.author.name}</h4>
                    <p className="text-gray-600 mb-4">
                      {post.author.role} at AccrediPro Academy. Passionate about functional medicine education and helping practitioners build thriving practices.
                    </p>
                    <Link href="/about" className="text-burgundy-600 font-semibold hover:text-burgundy-700 transition">
                      View Profile →
                    </Link>
                  </div>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {/* Newsletter CTA */}
                <div className="bg-burgundy-600 text-white p-6 rounded-xl">
                  <h4 className="font-bold text-lg mb-2">Get Weekly Insights</h4>
                  <p className="text-burgundy-100 text-sm mb-4">
                    Join 5,000+ health professionals receiving our newsletter.
                  </p>
                  <input
                    type="email"
                    placeholder="Your email"
                    className="w-full px-4 py-2 rounded-lg bg-white text-gray-900 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                  <Button className="w-full bg-gold-500 text-burgundy-900 hover:bg-gold-400">
                    Subscribe
                  </Button>
                </div>

                {/* Popular Posts */}
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h4 className="font-bold text-gray-900 mb-4">Popular Articles</h4>
                  <div className="space-y-4">
                    {getAllPosts().slice(0, 4).map((p) => (
                      <Link
                        key={p.slug}
                        href={`/blog/${p.slug}`}
                        className="block group"
                      >
                        <p className="text-sm font-semibold text-gray-900 group-hover:text-burgundy-600 transition line-clamp-2">
                          {p.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{p.readTime}</p>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* CTA Box */}
                <div className="bg-gold-50 border border-gold-200 p-6 rounded-xl text-center">
                  <h4 className="font-bold text-gray-900 mb-2">Ready to Get Certified?</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Start your functional medicine journey today.
                  </p>
                  <Link href="/register">
                    <Button className="w-full">Apply Now</Button>
                  </Link>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      {/* Related Articles */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Continue Reading</h2>
            <p className="text-gray-600">More articles you might enjoy</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedPosts.map((relatedPost) => (
              <Link
                key={relatedPost.slug}
                href={`/blog/${relatedPost.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={relatedPost.image}
                    alt={relatedPost.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <span className="bg-burgundy-50 px-2 py-1 rounded text-burgundy-600 font-semibold">
                      {relatedPost.category}
                    </span>
                    <span>•</span>
                    <span>{relatedPost.readTime}</span>
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 mb-2 group-hover:text-burgundy-600 transition line-clamp-2">
                    {relatedPost.title}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2 mb-4">{relatedPost.excerpt}</p>
                  <span className="text-burgundy-600 font-semibold text-sm">
                    Read More →
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/blog">
              <Button variant="outline" size="lg">
                View All Articles
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-burgundy-600 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Transform Your Career with Functional Medicine
          </h2>
          <p className="text-burgundy-100 mb-8 max-w-2xl mx-auto text-lg">
            Join thousands of health professionals who have elevated their practice with our comprehensive 14-module certification program.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="bg-gold-500 text-burgundy-900 hover:bg-gold-400 px-8">
                Apply Now
              </Button>
            </Link>
            <Link href="/certifications">
              <Button size="lg" variant="outline" className="bg-white text-gray-900 border-white hover:bg-gray-100 px-8">
                View Curriculum
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-burgundy-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AP</span>
                </div>
                <span className="text-xl font-bold">AccrediPro</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Professional certifications in Functional Medicine. CPD & CEU approved. 100% online.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-burgundy-600 transition">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-burgundy-600 transition">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-burgundy-600 transition">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li><Link href="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
                <li><Link href="/certifications" className="text-gray-400 hover:text-white transition">Certifications</Link></li>
                <li><Link href="/accreditation" className="text-gray-400 hover:text-white transition">Accreditation</Link></li>
                <li><Link href="/testimonials" className="text-gray-400 hover:text-white transition">Testimonials</Link></li>
                <li><Link href="/blog" className="text-burgundy-400 hover:text-burgundy-300 transition">Blog</Link></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="font-bold text-lg mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><Link href="/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
                <li><Link href="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
                <li><Link href="/faq" className="text-gray-400 hover:text-white transition">FAQ</Link></li>
                <li><Link href="/career-center" className="text-gray-400 hover:text-white transition">Career Center</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-lg mb-4">Contact Us</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a href="mailto:info@accredipro.academy" className="hover:text-white transition">
                    info@accredipro.academy
                  </a>
                </li>
                <li>
                  <a href="mailto:support@accredipro.academy" className="hover:text-white transition">
                    support@accredipro.academy
                  </a>
                </li>
              </ul>
              <div className="mt-6">
                <p className="text-sm text-gray-500">Accredited by:</p>
                <div className="flex gap-4 mt-2">
                  <div className="bg-gray-800 px-3 py-2 rounded text-xs font-semibold">CPD</div>
                  <div className="bg-gray-800 px-3 py-2 rounded text-xs font-semibold">CEU</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-gray-400 text-sm">
                © {new Date().getFullYear()} AccrediPro Academy. All rights reserved.
              </p>
              <div className="flex gap-6 text-sm text-gray-400">
                <Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link>
                <Link href="/terms" className="hover:text-white transition">Terms of Service</Link>
                <Link href="/refund" className="hover:text-white transition">Refund Policy</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
