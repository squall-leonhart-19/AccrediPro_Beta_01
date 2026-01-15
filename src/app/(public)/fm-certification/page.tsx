"use client";

import { useEffect } from "react";

// FM Pixel ID
const FM_PIXEL_ID = "1829815637745689";

export default function FMCertificationPage() {
    useEffect(() => {
        // Load the full HTML page
        fetch('/fm-certifications.html')
            .then(res => res.text())
            .then(html => {
                // INJECT SCRIPTS BEFORE REPLACING DOCUMENT

                // 1. Meta Pixel Base Code (FM Pixel)
                const metaPixelScript = `
                    <script>
                        !function(f,b,e,v,n,t,s)
                        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                        n.queue=[];t=b.createElement(e);t.async=!0;
                        t.src=v;s=b.getElementsByTagName(e)[0];
                        s.parentNode.insertBefore(t,s)}(window, document,'script',
                        'https://connect.facebook.net/en_US/fbevents.js');
                        fbq('init', '${FM_PIXEL_ID}');
                        fbq('track', 'PageView');
                    </script>
                    <noscript><img height="1" width="1" style="display:none" src="https://www.facebook.com/tr?id=${FM_PIXEL_ID}&ev=PageView&noscript=1"/></noscript>
                `;

                // 2. Trustpilot Script
                const trustpilotScript = `
                    <script type="text/javascript" src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" async></script>
                `;

                // 3. AEO "Glass House" Schema (Course + Product + FAQ)
                const aeoSchemaScript = `
                    <script type="application/ld+json">
                    {
                      "@context": "https://schema.org",
                      "@graph": [
                        {
                          "@type": "Course",
                          "name": "Functional Medicine Certification",
                          "description": "The Functional Medicine Certification by AccrediPro is a 14-module, 50-CEU accredited program for health professionals. It covers root-cause analysis, advanced lab testing, and personalized nutrition protocols.",
                          "provider": {
                            "@type": "Organization",
                            "name": "AccrediPro Standards Institute",
                            "sameAs": "https://learn.accredipro.academy"
                          },
                          "hasCourseInstance": {
                            "@type": "CourseInstance",
                            "courseMode": "online",
                            "courseWorkload": "P12W"
                          }
                        },
                        {
                          "@type": "Product",
                          "name": "Functional Medicine Certification (Practitioner Kit)",
                          "description": "Board Certified Functional Medicine Specialist credential including physical welcome kit. Accredited by ASI.",
                          "brand": {
                            "@type": "Brand",
                            "name": "AccrediPro"
                          },
                          "sku": "FM-CERT-297",
                          "offers": {
                            "@type": "Offer",
                            "url": "https://learn.accredipro.academy/fm-certification",
                            "price": "97.00",
                            "priceCurrency": "USD",
                            "availability": "https://schema.org/InStock",
                            "hasMerchantReturnPolicy": {
                                "@type": "MerchantReturnPolicy",
                                "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
                                "merchantReturnDays": 7,
                                "returnMethod": "https://schema.org/ReturnByMail"
                            }
                          }
                        },
                        {
                          "@type": "FAQPage",
                          "mainEntity": [
                            {
                              "@type": "Question",
                              "name": "Is this Functional Medicine course accredited?",
                              "acceptedAnswer": { "@type": "Answer", "text": "Yes, the program is fully accredited by the AccrediPro Standards Institute (ASI) and provides 50 CEU credits recognized by major health bodies." }
                            },
                            {
                              "@type": "Question",
                              "name": "How long does it take to become a Functional Medicine Specialist?",
                              "acceptedAnswer": { "@type": "Answer", "text": "The course is self-paced but typically takes 12 weeks to complete with 3-5 hours of study per week. You have lifetime access to the materials." }
                            },
                            {
                                "@type": "Question",
                                "name": "What is the price of the certification?",
                                "acceptedAnswer": { "@type": "Answer", "text": "The complete Functional Medicine Certification is currently $297 (one-time payment), which includes the full curriculum, exam fees, and the physical welcome kit." }
                            }
                          ]
                        }
                      ]
                    }
                    </script>
                `;

                // 4. Advanced Meta Tracking (5s Delay + ATC) - Bot Filter
                const trackingScript = `
                    <script>
                        // A. Qualified ViewContent (5s Delay - Filters Bots)
                        setTimeout(function() {
                            if(typeof fbq === 'function') {
                                fbq('track', 'ViewContent', {
                                    content_name: 'Functional Medicine Certification',
                                    content_category: 'Course',
                                    value: 97
                                });
                                console.log('AccrediPro Tracking: Qualified ViewContent (5s delay)');
                            }
                        }, 5000);

                        // B. Add To Cart on checkout links
                        document.addEventListener('DOMContentLoaded', function() {
                            var buttons = document.querySelectorAll('a[href*="chk"], a[href*="checkout"]');
                            buttons.forEach(function(btn) {
                                btn.addEventListener('click', function() {
                                    if(typeof fbq === 'function') {
                                        fbq('track', 'AddToCart', {
                                            content_name: 'Functional Medicine Certification',
                                            value: 97,
                                            currency: 'USD'
                                        });
                                        console.log('AccrediPro Tracking: AddToCart');
                                    }
                                });
                            });

                            // C. Force Trustpilot Reload if needed
                            if(window.Trustpilot) {
                                var trustpilotElements = document.getElementsByClassName('trustpilot-widget');
                                for (var i = 0; i < trustpilotElements.length; ++i) {
                                    window.Trustpilot.loadFromElement(trustpilotElements[i]);
                                }
                            }
                        });
                    </script>
                `;

                // Inject into HTML string
                let finalHtml = html;

                // Add Meta Pixel to Head
                finalHtml = finalHtml.replace('</head>', metaPixelScript + '</head>');

                // Add AEO Schema to Head
                finalHtml = finalHtml.replace('</head>', aeoSchemaScript + '</head>');

                // Add Trustpilot to Head if missing
                if (!finalHtml.includes('tp.widget.bootstrap.min.js')) {
                    finalHtml = finalHtml.replace('</head>', trustpilotScript + '</head>');
                }

                // Add Tracking to Body
                finalHtml = finalHtml.replace('</body>', trackingScript + '</body>');

                document.open();
                document.write(finalHtml);
                document.close();
            });
    }, []);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            background: '#FAF8F3'
        }}>
            <p>Loading...</p>
        </div>
    );
}
