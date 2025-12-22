"use client";

import { useEffect } from "react";

export default function FMCertificationPage() {
    useEffect(() => {
        // Load the full HTML page
        fetch('/winning_sp.html')
            .then(res => res.text())
            .then(html => {
                // INJECT SCRIPTS BEFORE REPLACING DOCUMENT

                // 1. Trustpilot Script (Ensure it loads)
                const trustpilotScript = `
                    <script type="text/javascript" src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js" async></script>
                `;

                // 2. Advanced Meta Tracking (3s Delay + ATC)
                // We use standard 'fbq' calls since this runs in the context of the new HTML document
                const trackingScript = `
                    <script>
                        // A. Qualified ViewContent (3s Delay)
                        setTimeout(function() {
                            if(typeof fbq === 'function') {
                                fbq('track', 'ViewContent', {
                                    content_name: 'Functional Medicine Certification',
                                    content_category: 'Course',
                                    value: 97
                                });
                                console.log('AccrediPro Pixel: Fired Qualified ViewContent (3s)');
                            }
                        }, 3000);

                        // B. Add To Cart on Keywords (checkout, enroll, etc.)
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
                                        console.log('AccrediPro Pixel: Fired AddToCart');
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

                // Add Trustpilot to Head if missing (or strictly ensure it's there)
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
