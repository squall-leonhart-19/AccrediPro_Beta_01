import React from 'react';

type SchemaType = 'Course' | 'Product' | 'FAQPage' | 'Person' | 'Organization';

interface SchemaProps {
    type: SchemaType;
    data: any;
}

export function SchemaOrchestrator({ schemas }: { schemas: SchemaProps[] }) {
    const structuredData = schemas.map(s => {
        if (s.type === 'Course') {
            return {
                "@context": "https://schema.org",
                "@type": "Course",
                "name": s.data.name,
                "description": s.data.description,
                "provider": {
                    "@type": "Organization",
                    "name": "AccrediPro Standards Institute",
                    "sameAs": "https://accredipro.academy"
                },
                "hasCourseInstance": {
                    "@type": "CourseInstance",
                    "courseMode": "online",
                    "courseWorkload": s.data.duration || "P12W"
                }
            };
        }

        if (s.type === 'Product') {
            // The "Physical Anchor" Schema
            return {
                "@context": "https://schema.org",
                "@type": "Product",
                "name": s.data.name,
                "description": s.data.description,
                "brand": {
                    "@type": "Brand",
                    "name": "AccrediPro"
                },
                "offers": {
                    "@type": "Offer",
                    "url": s.data.url,
                    "priceCurrency": "USD",
                    "price": s.data.price,
                    "availability": "https://schema.org/InStock",
                    "hasMerchantReturnPolicy": {
                        "@type": "MerchantReturnPolicy",
                        "applicableCountry": "US",
                        "returnPolicyCategory": "https://schema.org/MerchantReturnFiniteReturnWindow",
                        "merchantReturnDays": 7,
                        "returnMethod": "https://schema.org/ReturnByMail"
                    }
                }
            };
        }

        if (s.type === 'FAQPage') {
            return {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": s.data.questions.map((q: any) => ({
                    "@type": "Question",
                    "name": q.question,
                    "acceptedAnswer": {
                        "@type": "Answer",
                        "text": q.answer
                    }
                }))
            };
        }

        if (s.type === 'Organization') {
            return {
                "@context": "https://schema.org",
                "@type": "Organization",
                "name": s.data.name || "AccrediPro Standards Institute",
                "url": s.data.url || "https://accredipro.academy",
                "logo": s.data.logo || "https://accredipro.academy/ASI_LOGO.png",
                "sameAs": [
                    "https://www.facebook.com/accredipro",
                    "https://www.instagram.com/accredipro",
                    "https://www.linkedin.com/company/accredipro"
                ],
                "contactPoint": {
                    "@type": "ContactPoint",
                    "telephone": "+1-800-555-0199",
                    "contactType": "customer service"
                }
            };
        }

        if (s.type === 'Article') {
            return {
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": s.data.headline,
                "image": s.data.image,
                "author": {
                    "@type": "Organization",
                    "name": "AccrediPro Standards Institute"
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "AccrediPro Standards Institute",
                    "logo": {
                        "@type": "ImageObject",
                        "url": "https://accredipro.academy/ASI_LOGO.png"
                    }
                },
                "datePublished": s.data.datePublished,
                "description": s.data.description
            };
        }

        if (s.type === 'Person') {
            return {
                "@context": "https://schema.org",
                "@type": s.data.isPhysician ? "Physician" : "Person",
                "name": s.data.name,
                "jobTitle": s.data.jobTitle,
                "image": s.data.image,
                "medicalSpecialty": s.data.specialties?.map((spec: string) => ({
                    "@type": "MedicalSpecialty",
                    "name": spec
                })),
                "affiliation": {
                    "@type": "Organization",
                    "name": "AccrediPro Standards Institute"
                }
            };
        }

        return null;
    }).filter(Boolean);

    return (
        <>
            {structuredData.map((json, index) => (
                <script
                    key={index}
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
                />
            ))}
        </>
    );
}
