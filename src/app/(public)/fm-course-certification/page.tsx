"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

// Sales page images in order
const salesImages = [
    { src: "/sales-images/sp_img_01_hero_1766504275701.png", alt: "Functional Medicine Certification - From $68K to $135K working from home", priority: true },
    { src: "/sales-images/sp_img_02_problem_1766504311399.png", alt: "Does this sound like you? Common pain points of healthcare workers" },
    { src: "/sales-images/sp_img_03_agitation_1766504331004.png", alt: "The ugly truth about healthcare in 2024" },
    { src: "/sales-images/sp_img_04_solution.png", alt: "Introducing Functional Medicine Practitioner Certification" },
    { src: "/sales-images/sp_img_05_credibility.png", alt: "Accredited by 9 professional bodies - 1447 practitioners certified" },
    { src: "/sales-images/sp_img_06_socialproof_1766504460682.png", alt: "Real results from real practitioners - testimonials" },
    { src: "/sales-images/fm_compare_table_1766447639945.png", alt: "Nursing vs FM Coaching comparison - Income, Hours, Freedom" },
    { src: "/sales-images/fm_cro_payment_1766334094314.png", alt: "Stripe payment received - Real client payment" },
    { src: "/sales-images/fm_cro_bank_statement_1766352939005.png", alt: "Bank statement showing FM practitioner income" },
    { src: "/sales-images/fm_cro_calendar_freedom_1766352854539.png", alt: "Flexible schedule - Work when you want" },
    { src: "/sales-images/sp_img_07_transformation_1766504511154.png", alt: "Before and after transformation stories" },
    { src: "/sales-images/sp_img_08_curriculum_1766504530305.png", alt: "What's inside - 21 modules of complete practitioner training" },
    { src: "/sales-images/sp_img_09_included_1766504568811.png", alt: "Everything you get - $4285 value", cta: true },
    { src: "/sales-images/sp_img_10_pricing_1766504585512.png", alt: "Your investment today - $97 one-time payment", cta: true },
    { src: "/sales-images/sp_img_11_guarantee_1766504633606.png", alt: "30-day money-back guarantee - risk free" },
    { src: "/sales-images/sp_img_12_faq_1766504654263.png", alt: "Frequently asked questions" },
    { src: "/sales-images/sp_img_13_finalcta_1766504690313.png", alt: "The choice is yours - Get certified now", cta: true },
];

const CHECKOUT_URL = "https://accredipro.com/checkout";

export default function FMCourseCertificationPage() {
    const [showFloatingCta, setShowFloatingCta] = useState(false);

    useEffect(() => {
        // Show floating CTA after scrolling 200px
        const handleScroll = () => {
            setShowFloatingCta(window.scrollY > 200);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <>
            {/* Meta tags for SEO */}
            <head>
                <title>Functional Medicine Practitioner Certification | AccrediPro Academy</title>
                <meta
                    name="description"
                    content="Transform from burned-out healthcare worker to thriving home-based practitioner. Get certified in 4-8 weeks. 9 International Accreditations. $97 today."
                />
            </head>

            <main className="min-h-screen bg-[#1a1a1a] flex flex-col items-center">
                <div className="w-full max-w-[1080px] flex flex-col items-center">
                    {salesImages.map((image, index) => (
                        image.cta ? (
                            <Link
                                key={index}
                                href={CHECKOUT_URL}
                                className="w-full block cursor-pointer hover:opacity-95 transition-opacity"
                            >
                                <Image
                                    src={image.src}
                                    alt={image.alt}
                                    width={1080}
                                    height={1350}
                                    className="w-full h-auto"
                                    priority={image.priority}
                                    loading={image.priority ? "eager" : "lazy"}
                                />
                            </Link>
                        ) : (
                            <Image
                                key={index}
                                src={image.src}
                                alt={image.alt}
                                width={1080}
                                height={1350}
                                className="w-full h-auto"
                                priority={image.priority}
                                loading={image.priority ? "eager" : "lazy"}
                            />
                        )
                    ))}
                </div>

                {/* Floating CTA for Mobile */}
                <Link
                    href={CHECKOUT_URL}
                    className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 md:hidden
            bg-gradient-to-r from-[#D4AF37] to-[#AA8C2C] text-[#1a1a1a]
            px-8 py-4 rounded-full font-bold text-base
            shadow-[0_4px_20px_rgba(212,175,55,0.4)]
            transition-all duration-300
            hover:scale-105 hover:shadow-[0_6px_30px_rgba(212,175,55,0.6)]
            ${showFloatingCta ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"}`}
                >
                    GET CERTIFIED - $97 →
                </Link>
            </main>

            {/* Scroll tracking script */}
            <script
                dangerouslySetInnerHTML={{
                    __html: `
            let maxScroll = 0;
            window.addEventListener('scroll', () => {
              const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
              if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;
                if ([25, 50, 75, 100].includes(scrollPercent)) {
                  console.log('Scroll milestone:', scrollPercent + '%');
                  if (typeof gtag !== 'undefined') {
                    gtag('event', 'scroll_depth', { value: scrollPercent, page: 'fm-course-certification' });
                  }
                }
              }
            });
          `,
                }}
            />
        </>
    );
}
