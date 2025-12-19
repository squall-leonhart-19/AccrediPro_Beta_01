'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import './styles.css';

// Student avatars from CSV
const studentAvatars = [
    "https://accredipro.academy/wp-content/uploads/2025/12/1000009537.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/linkedin-2024.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_3542-Profile-Picture-Updated.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_1335.jpeg",
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_1235.jpeg",
    "https://accredipro.academy/wp-content/uploads/2025/12/AI_Headshot_Generator-13.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/LeezaRhttilthead.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/Head-shot-dark-background-1.jpg",
    "https://accredipro.academy/wp-content/uploads/2025/12/IMG_1695.jpeg",
    "https://accredipro.academy/wp-content/uploads/2025/12/MICHELLEM047.jpg",
];

const names = ["Jennifer M.", "Lisa K.", "Maria R.", "Amanda S.", "Nicole P.", "Rachel T.", "Diane W.", "Karen B.", "Susan L.", "Michelle C."];
const locations = ["🇺🇸 California", "🇺🇸 Texas", "🇺🇸 New York", "🇬🇧 London", "🇦🇺 Sydney", "🇨🇦 Toronto", "🇺🇸 Florida", "🇺🇸 Ohio"];

const modules = [
    { num: 1, title: "Foundations of Functional Medicine", desc: "Core principles, systems biology", cert: "FM Foundations" },
    { num: 2, title: "Gut Health & Microbiome", desc: "Leaky gut, SIBO, gut-brain axis", cert: "Gut Health Specialist" },
    { num: 3, title: "Hormone Balance", desc: "Thyroid, adrenals, sex hormones", cert: "Hormone Expert" },
    { num: 4, title: "Autoimmune Conditions", desc: "Root cause, triggers, protocols", cert: "Autoimmune Specialist" },
    { num: 5, title: "Detoxification & Toxins", desc: "Liver, heavy metals, mold", cert: "Detox Practitioner" },
    { num: 6, title: "Inflammation & Pain", desc: "Chronic inflammation, pain mgmt", cert: "Inflammation Specialist" },
    { num: 7, title: "Stress & Adrenal Health", desc: "HPA axis, cortisol, nervous system", cert: "Stress Coach" },
    { num: 8, title: "Sleep & Circadian Health", desc: "Sleep, insomnia, circadian rhythm", cert: "Sleep Specialist" },
    { num: 9, title: "Metabolic Health", desc: "Insulin, diabetes prevention", cert: "Metabolic Coach" },
    { num: 10, title: "Women's Health", desc: "Menopause, PCOS, fertility", cert: "Women's Health Specialist" },
    { num: 11, title: "Men's Health", desc: "Testosterone, prostate, vitality", cert: "Men's Health Specialist" },
    { num: 12, title: "Brain Health", desc: "Cognition, neuroinflammation", cert: "Brain Health Practitioner" },
    { num: 13, title: "Mental Wellness", desc: "Anxiety, depression, mood", cert: "Mental Wellness Coach" },
    { num: 14, title: "Cardiovascular Health", desc: "Heart, lipids, vascular", cert: "Cardiovascular Expert" },
    { num: 15, title: "Weight Management", desc: "Sustainable weight loss", cert: "Weight Specialist" },
    { num: 16, title: "Nutrition as Medicine", desc: "Therapeutic diets, food sensitivities", cert: "Nutrition Expert" },
    { num: 17, title: "Lab Interpretation", desc: "Functional ranges, biomarkers", cert: "Lab Expert" },
    { num: 18, title: "Supplements & Botanicals", desc: "Evidence-based supplementation", cert: "Supplements Expert" },
    { num: 19, title: "Lifestyle Medicine", desc: "Exercise, breathwork, lifestyle", cert: "Lifestyle Practitioner" },
    { num: 20, title: "Client Assessment", desc: "Intake, consultation, behavior change", cert: "Assessment Expert" },
    { num: 21, title: "Practice Building", desc: "Marketing, pricing, scaling", cert: "Business Expert" }
];

const testimonials = [
    { name: "Lisa K.", role: "Nutritionist, Texas", quote: "Income doubled in 4 months. Now I interpret labs and help with hormones.", result: "💰 $4,500 → $9,200/mo", avatar: 1 },
    { name: "Maria R.", role: "Career Changer, NY", quote: "Zero health background. Had 10 clients within 3 months. Best decision ever.", result: "🚀 10 clients in 3 months", avatar: 2 },
    { name: "Amanda S.", role: "Yoga Teacher, CO", quote: "Now I charge $175/hour and have a waitlist. Same clients, 3x the value.", result: "⏳ Now has a waitlist", avatar: 3 },
    { name: "Nicole P.", role: "Naturopath, FL", quote: "The 9 accreditations got me accepted by BCBS for insurance reimbursement.", result: "✅ Insurance approved", avatar: 4 },
    { name: "Rachel T.", role: "Pharmacist, AZ", quote: "Now I help people get OFF medications. Making more than my pharmacy salary.", result: "💊 Helping clients heal", avatar: 5 },
    { name: "Sarah M.", role: "Mom, Ohio", quote: "No medical background. Now I work school hours and earn more than my husband.", result: "👩‍👧 School hours only", avatar: 0 }
];

// Enrollment Popup Component
function EnrollmentPopup() {
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState({ name: '', location: '', avatar: '', time: '' });

    useEffect(() => {
        const show = () => {
            setData({
                name: names[Math.floor(Math.random() * names.length)],
                location: locations[Math.floor(Math.random() * locations.length)],
                avatar: studentAvatars[Math.floor(Math.random() * studentAvatars.length)],
                time: ['Just now', '2 min ago', '5 min ago'][Math.floor(Math.random() * 3)]
            });
            setVisible(true);
            setTimeout(() => setVisible(false), 5000);
        };
        const t1 = setTimeout(show, 8000);
        const t2 = setInterval(show, 25000);
        return () => { clearTimeout(t1); clearInterval(t2); };
    }, []);

    return (
        <div className={`fm-popup ${visible ? 'show' : ''}`}>
            <button className="fm-popup-close" onClick={() => setVisible(false)}>×</button>
            <img src={data.avatar} alt="" className="fm-popup-img" />
            <div className="fm-popup-info">
                <div className="fm-popup-name">{data.name}</div>
                <div className="fm-popup-loc">{data.location}</div>
                <div className="fm-popup-time">{data.time} ✓</div>
            </div>
        </div>
    );
}

// Sticky CTA
function StickyCTA() {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const handleScroll = () => setVisible(window.scrollY > 600);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className={`fm-sticky ${visible ? 'visible' : ''}`}>
            <span>🎓 22 Certs • 9 Accreditations • $97</span>
            <a href="https://www.accredipro.school/intfun-chk" className="fm-sticky-btn">Enroll Now →</a>
        </div>
    );
}

export default function FunctionalMedicinePage() {
    return (
        <div className="fm-page">
            {/* Header */}
            <header className="fm-header">
                <img src="/newlogo.webp" alt="AccrediPro" className="fm-logo" />
                <a href="https://www.accredipro.school/intfun-chk" className="fm-header-cta">Start Certification →</a>
            </header>

            {/* Accred Bar */}
            <div className="fm-accred-bar">
                <p>🏆 Internationally Accredited by 9 Bodies</p>
                <img src="/All_Logos.png" alt="9 Accreditations" />
            </div>

            {/* Hero */}
            <section className="fm-hero">
                <h1>Get Certified as a Functional Medicine Practitioner</h1>
                <p className="fm-hero-sub">
                    Master root-cause healing, earn <strong>22 professional certifications</strong>, and join 1,247+ graduates now earning <strong>$75-200/hour</strong> — without medical school.
                </p>

                <div className="fm-social">
                    <div className="fm-avatars">
                        {studentAvatars.slice(0, 5).map((url, i) => (
                            <img key={i} src={url} alt="" />
                        ))}
                        <div className="fm-more">+1.2K</div>
                    </div>
                    <div className="fm-stars">★★★★★</div>
                    <div className="fm-rating">4.9/5 from 1,247+ graduates</div>
                </div>

                <img src="/course_images/FunctionalMedicinePractictioner.jpeg" alt="Bundle" className="fm-bundle" />

                <a href="https://www.accredipro.school/intfun-chk" className="fm-cta">Start My Certification → Only $97 Today</a>
                <p className="fm-guarantee">30-Day Money-Back Guarantee • Lifetime Access • Instant Access</p>

                <div className="fm-stats">
                    <div><span>21</span>Modules</div>
                    <div><span>22</span>Certifications</div>
                    <div><span>9</span>Accreditations</div>
                    <div><span>100+</span>Hours</div>
                </div>
            </section>

            {/* Master Certificate - ENHANCED */}
            <section className="fm-master-cert">
                <div className="fm-master-badge">🏆 YOUR CROWNING ACHIEVEMENT</div>
                <h2>Your Master Certification</h2>
                <p className="fm-master-sub">
                    This isn't just a certificate — it's <strong>proof of your transformation</strong>. After completing all 21 modules,
                    you'll receive this prestigious Master Certification, recognized by <strong>9 international accreditation bodies</strong>
                    and valid in <strong>30+ countries worldwide</strong>.
                </p>

                <div className="fm-master-grid">
                    <div className="fm-master-img-wrap">
                        <img src="/certificates_img/FUNCTIONAL_MEDICINE_CERTIFICATE.webp" alt="Master Certificate" className="fm-master-img" />
                    </div>
                    <div className="fm-master-features">
                        <div className="fm-master-feature">
                            <span className="fm-feature-icon">✓</span>
                            <div>
                                <strong>Legally Practice in 30+ Countries</strong>
                                <p>Your certification carries international weight and recognition</p>
                            </div>
                        </div>
                        <div className="fm-master-feature">
                            <span className="fm-feature-icon">✓</span>
                            <div>
                                <strong>Professional Insurance Eligible</strong>
                                <p>Get covered by major insurers — we've had 100% approval rate</p>
                            </div>
                        </div>
                        <div className="fm-master-feature">
                            <span className="fm-feature-icon">✓</span>
                            <div>
                                <strong>Post-Nominal Letters: FMPrac</strong>
                                <p>Add credentials after your name — instant credibility</p>
                            </div>
                        </div>
                        <div className="fm-master-feature">
                            <span className="fm-feature-icon">✓</span>
                            <div>
                                <strong>Lifetime Validity</strong>
                                <p>Never expires, never needs renewal — yours forever</p>
                            </div>
                        </div>
                        <div className="fm-master-feature">
                            <span className="fm-feature-icon">✓</span>
                            <div>
                                <strong>Verified & Trackable</strong>
                                <p>Each certificate has a unique ID clients can verify online</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="fm-master-quote">
                    <p>"When I showed my certificate to my first potential client, she immediately said 'I've never seen so many accreditations on one certificate — you're clearly the real deal.' I signed her that day."</p>
                    <div className="fm-master-author">— Jennifer M., Former ICU Nurse, now earning $12K/month</div>
                </div>
            </section>

            {/* 9 Accreditations */}
            <section className="fm-accreditations">
                <span className="fm-accred-badge">🏆 OFFICIAL RECOGNITION</span>
                <h2>9 Official Accreditations</h2>
                <p className="fm-accred-sub">The World's Most Accredited Functional Medicine Program</p>

                <div className="fm-accred-features">
                    <div>✓ Insurance Eligible</div>
                    <div>✓ CPD Certified</div>
                    <div>✓ Global Recognition</div>
                    <div>✓ Post-Nominal Letters</div>
                </div>

                <div className="fm-accred-stats">
                    <div><span>9</span>Accreditation Bodies</div>
                    <div><span>30+</span>Countries Recognized</div>
                    <div><span>100%</span>Insurance Eligibility</div>
                    <div><span>∞</span>Lifetime Validity</div>
                </div>

                <img src="/All_Logos.png" alt="Accreditation Logos" className="fm-accred-logos" />
            </section>

            {/* Benefits */}
            <section className="fm-benefits">
                <h2>Everything You Need to Succeed</h2>
                <div className="fm-benefits-grid">
                    <div className="fm-benefit"><span>🎓</span><h4>No Medical Degree Needed</h4><p>Start from any background</p></div>
                    <div className="fm-benefit"><span>♾️</span><h4>Lifetime Access</h4><p>All content forever + updates</p></div>
                    <div className="fm-benefit"><span>👥</span><h4>Exclusive Community</h4><p>1,247+ practitioners</p></div>
                    <div className="fm-benefit"><span>👩‍🏫</span><h4>Coach Sarah</h4><p>Unlimited private mentoring</p></div>
                    <div className="fm-benefit"><span>📋</span><h4>30 Pro Resources</h4><p>Forms, protocols, templates</p></div>
                    <div className="fm-benefit"><span>💻</span><h4>Coach Workspace</h4><p>Manage clients & protocols</p></div>
                </div>
            </section>

            {/* Modules */}
            <section className="fm-modules">
                <h2>21 Comprehensive Modules</h2>
                <p className="fm-modules-intro">Each module includes training AND an individual certification</p>
                <div className="fm-start-early">🚀 Start practicing after Module 1 — Build your practice while you learn!</div>

                <div className="fm-module-grid">
                    {modules.map(m => (
                        <div key={m.num} className="fm-module">
                            <span className="fm-module-num">Module {m.num}</span>
                            <h4>{m.title}</h4>
                            <p>{m.desc}</p>
                            <div className="fm-mini-cert">
                                <div className="fm-cert-title">Certificate</div>
                                <div className="fm-cert-name">{m.cert}</div>
                            </div>
                        </div>
                    ))}
                </div>

                <a href="https://www.accredipro.school/intfun-chk" className="fm-cta">Get All 22 Certifications → $97</a>
            </section>

            {/* Success Story */}
            <section className="fm-story">
                <h2>From Burnt-Out Nurse to $12K/Month</h2>
                <div className="fm-story-card">
                    <img src={studentAvatars[0]} alt="" className="fm-story-img" />
                    <div className="fm-story-content">
                        <h3>Jennifer M.</h3>
                        <p className="fm-story-role">Former ICU Nurse → Functional Medicine Practitioner</p>
                        <p className="fm-story-quote">"After 20 years in nursing, I was burnt out. Within 6 months, I replaced my income working 20 hours a week from home. The 9 accreditations gave me instant credibility."</p>
                        <div className="fm-story-results">
                            <div><span>$12K</span>Monthly</div>
                            <div><span>20hrs</span>Week</div>
                            <div><span>47</span>Clients</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="fm-testimonials">
                <h2>What Our 1,247+ Graduates Say</h2>
                <div className="fm-testimonial-grid">
                    {testimonials.map((t, i) => (
                        <div key={i} className="fm-testimonial">
                            <div className="fm-testimonial-header">
                                <img src={studentAvatars[t.avatar]} alt="" />
                                <div><h5>{t.name}</h5><span>{t.role}</span></div>
                            </div>
                            <div className="fm-testimonial-stars">★★★★★</div>
                            <p>"{t.quote}"</p>
                            <div className="fm-testimonial-result">{t.result}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Pricing */}
            <section className="fm-pricing">
                <h2>Start Your Certification Today</h2>
                <p className="fm-pricing-sub">21 Modules • 22 Certifications • 9 Accreditations • Lifetime Access</p>
                <div className="fm-price-card">
                    <div className="fm-price-top"><span className="fm-was">$997</span><span className="fm-save">SAVE 90%</span></div>
                    <div className="fm-now">$97 <small>one-time</small></div>
                    <ul className="fm-price-list">
                        <li><span>✓</span> 21 Comprehensive Modules</li>
                        <li><span>✓</span> 22 Professional Certifications</li>
                        <li><span>✓</span> 9 International Accreditations</li>
                        <li><span>✓</span> Unlimited Mentor Support</li>
                        <li><span>✓</span> Private Community Access</li>
                        <li><span>✓</span> 30 Professional Resources</li>
                        <li><span>✓</span> Coach Workspace Access</li>
                        <li><span>✓</span> Lifetime Access & Updates</li>
                        <li><span>✓</span> 30-Day Money-Back Guarantee</li>
                    </ul>
                    <a href="https://www.accredipro.school/intfun-chk" className="fm-cta-full">Start My Certification Now →</a>
                    <p className="fm-instant">Instant Access • No Hidden Fees</p>
                </div>
            </section>

            {/* Final CTA */}
            <section className="fm-final">
                <h2>Ready to Transform Your Career?</h2>
                <p>Join 1,247+ graduates earning $75-200/hour from home. No medical degree required.</p>
                <a href="https://www.accredipro.school/intfun-chk" className="fm-cta">Enroll Now → Only $97</a>
            </section>

            {/* Footer */}
            <footer className="fm-footer">
                <img src="/newlogo.webp" alt="AccrediPro" />
                <p>© 2025 AccrediPro Academy. All rights reserved.</p>
                <p><a href="/privacy-policy">Privacy</a> • <a href="/terms-of-service">Terms</a> • <a href="/contact">Contact</a></p>
            </footer>

            <EnrollmentPopup />
            <StickyCTA />
        </div>
    );
}
