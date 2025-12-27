"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import Script from "next/script";

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
    { src: "/sales-images/sp_img_09_included_1766504568811.png", alt: "Everything you get - $4285 value" },
    { src: "/sales-images/sp_img_10_pricing_1766504585512.png", alt: "Your investment today - $97 one-time payment" },
    { src: "/sales-images/sp_img_11_guarantee_1766504633606.png", alt: "30-day money-back guarantee - risk free" },
    { src: "/sales-images/sp_img_12_faq_1766504654263.png", alt: "Frequently asked questions" },
    { src: "/sales-images/sp_img_13_finalcta_1766504690313.png", alt: "The choice is yours - Get certified now" },
];

const CHECKOUT_URL = "https://sarah.accredipro.academy/checkout-fm-certification";

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

            {/* Sticky Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-[#722F37] to-[#8B3A42] shadow-lg">
                <div className="max-w-[1080px] mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Image
                            src="/logos/accredipro-logo-white.png"
                            alt="AccrediPro Academy"
                            width={140}
                            height={35}
                            className="h-8 w-auto"
                            priority
                        />
                    </div>
                    <Link
                        href={CHECKOUT_URL}
                        className="bg-gradient-to-r from-[#D4AF37] to-[#AA8C2C] text-[#1a1a1a] 
              px-6 py-2 rounded-full font-bold text-sm
              shadow-[0_2px_10px_rgba(212,175,55,0.3)]
              hover:scale-105 transition-transform"
                    >
                        GET CERTIFIED →
                    </Link>
                </div>
            </header>

            <main className="min-h-screen bg-[#1a1a1a] flex flex-col items-center pt-14">
                <div className="w-full max-w-[1080px] flex flex-col items-center">
                    {salesImages.map((image, index) => (
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

            {/* Live Chat Widget - Tawk.to */}
            <Script id="tawk-chat" strategy="lazyOnload">
                {`
          var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
          (function(){
            var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
            s1.async=true;
            s1.src='https://embed.tawk.to/YOUR_TAWK_ID/default';
            s1.charset='UTF-8';
            s1.setAttribute('crossorigin','*');
            s0.parentNode.insertBefore(s1,s0);
          })();
        `}
            </Script>

            {/* Alternative: Custom Chat Widget Trigger */}
            <div
                id="chat-widget-trigger"
                className="fixed bottom-24 right-5 z-50 md:bottom-5 cursor-pointer
          bg-[#722F37] text-white p-4 rounded-full shadow-lg
          hover:scale-110 transition-transform"
                onClick={() => {
                    // Open chat - trigger Tawk or custom chat
                    if (typeof window !== 'undefined' && (window as any).Tawk_API) {
                        (window as any).Tawk_API.maximize();
                    }
                }}
            >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z" />
                    <path d="M7 9h10v2H7zm0-3h10v2H7z" />
                </svg>
            </div>

            {/* Scroll tracking script */}
            <Script id="scroll-tracking" strategy="lazyOnload">
                {`
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
        `}
            </Script>
        </>
    );
}
