"use client";

import { useState, useCallback, useEffect } from "react";
import { initMetaTracking, trackLead } from "@/lib/meta-tracking";

// Country codes for phone field
const COUNTRY_CODES = [
  { code: "+1", country: "US", flag: "🇺🇸", label: "United States" },
  { code: "+1", country: "CA", flag: "🇨🇦", label: "Canada" },
  { code: "+44", country: "UK", flag: "🇬🇧", label: "United Kingdom" },
  { code: "+61", country: "AU", flag: "🇦🇺", label: "Australia" },
  { code: "+64", country: "NZ", flag: "🇳🇿", label: "New Zealand" },
];

export default function FreeMiniDiplomaPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    countryCode: "+1",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [suggestedEmail, setSuggestedEmail] = useState("");

  // Email validation states
  const [emailStatus, setEmailStatus] = useState<"idle" | "checking" | "valid" | "invalid">("idle");
  const [emailError, setEmailError] = useState("");
  const [checkTimeout, setCheckTimeout] = useState<NodeJS.Timeout | null>(null);

  // Countdown timer
  const [countdown, setCountdown] = useState("14:58");

  // Initialize Meta tracking on page load
  useEffect(() => {
    initMetaTracking();
  }, []);

  // Countdown timer
  useEffect(() => {
    let minutes = 14;
    let seconds = 58;
    const interval = setInterval(() => {
      if (seconds === 0) {
        if (minutes === 0) {
          minutes = 14;
          seconds = 58;
        } else {
          minutes--;
          seconds = 59;
        }
      } else {
        seconds--;
      }
      setCountdown(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Debounced email validation
  const validateEmail = useCallback(async (email: string) => {
    if (!email || email.length < 5 || !email.includes("@")) {
      setEmailStatus("idle");
      setEmailError("");
      return;
    }

    setEmailStatus("checking");
    setEmailError("");

    try {
      const res = await fetch("/api/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (data.isValid) {
        setEmailStatus("valid");
        setEmailError("");
        setSuggestedEmail("");
      } else {
        setEmailStatus("invalid");
        setEmailError(data.reason || "This email address is not valid.");
        if (data.suggestedEmail) {
          setSuggestedEmail(data.suggestedEmail);
        }
      }
    } catch {
      setEmailStatus("idle");
      setEmailError("");
    }
  }, []);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setFormData({ ...formData, email: newEmail });
    setEmailStatus("idle");
    setEmailError("");
    setSuggestedEmail("");

    if (checkTimeout) {
      clearTimeout(checkTimeout);
    }

    if (newEmail.includes("@") && newEmail.length >= 5) {
      const timeout = setTimeout(() => {
        validateEmail(newEmail);
      }, 800);
      setCheckTimeout(timeout);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (emailStatus === "invalid") {
      setError(emailError || "Please fix the email address before continuing.");
      return;
    }

    setLoading(true);
    setError("");

    const fullPhone = formData.phone ? `${formData.countryCode}${formData.phone.replace(/\D/g, "")}` : "";

    try {
      const res = await fetch("/api/auth/register-freebie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          phone: fullPhone,
          miniDiplomaCategory: "functional-medicine-general",
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        trackLead(formData.email, {
          first_name: formData.firstName,
          last_name: formData.lastName,
          content_name: "Mini Diploma - General Audience",
          phone: fullPhone,
        });

        setLoading(false);
        window.location.href = "/mini-diploma/module/1";
      } else {
        setError(data.error || "Something went wrong. Please try again.");
        if (data.suggestedEmail) {
          setSuggestedEmail(data.suggestedEmail);
        } else {
          setSuggestedEmail("");
        }
      }
    } catch {
      setError("Connection error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const useSuggestedEmail = () => {
    setFormData({ ...formData, email: suggestedEmail });
    setSuggestedEmail("");
    setEmailStatus("idle");
    validateEmail(suggestedEmail);
  };

  return (
    <div style={{
      fontFamily: '"IBM Plex Sans", system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif',
      background: '#FFFAF7',
      color: '#1F2432',
      lineHeight: 1.65,
      minHeight: '100vh'
    }}>
      <main style={{ maxWidth: 1160, margin: '0 auto', padding: 20 }}>
        {/* Top Banner */}
        <div style={{
          background: 'linear-gradient(90deg, #722F37, #8B3A42)',
          color: 'white',
          textAlign: 'center',
          padding: '10px 16px',
          fontSize: 'clamp(0.75rem, 2vw, 0.85rem)',
          fontWeight: 700,
          letterSpacing: 0.5,
          lineHeight: 1.4
        }}>
          ⏰ LIMITED SPOTS — ENROLLMENT CLOSES SOON
        </div>

        {/* Hero */}
        <section style={{ textAlign: 'center', padding: '20px 0' }}>
          <h1 style={{
            margin: '12px auto',
            maxWidth: 900,
            fontSize: 'clamp(26px, 5vw, 48px)',
            lineHeight: 1.15,
            color: '#722F37',
            fontWeight: 900
          }}>
            Become a Certified Functional Medicine Practitioner in 3 Days
          </h1>

          <p style={{
            maxWidth: 720,
            margin: '16px auto 28px',
            color: '#6B6E76',
            fontSize: 'clamp(15px, 2.6vw, 19px)',
            lineHeight: 1.6
          }}>
            Learn root-cause healing, earn your Mini Diploma, and unlock a path to $5k-$10k/month helping others — <strong>no experience required.</strong>
          </p>

          {/* Stats Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#FFFFFF',
            border: '1px solid #ECE8E2',
            borderRadius: 14,
            padding: '16px 20px',
            margin: '24px auto',
            maxWidth: 680,
            boxShadow: '0 12px 28px rgba(0,0,0,.07)',
            gap: 12,
            flexWrap: 'wrap'
          }}>
            {[
              { number: '1,787+', label: 'Graduates' },
              { number: '90 min', label: 'To Complete' },
              { number: '100%', label: 'Free' }
            ].map((stat, idx) => (
              <div key={idx} style={{ textAlign: 'center', flex: 1, minWidth: 0 }}>
                <span style={{
                  fontSize: 'clamp(1.2rem, 4vw, 1.7rem)',
                  fontWeight: 900,
                  color: '#722F37',
                  display: 'block',
                  lineHeight: 1.2
                }}>{stat.number}</span>
                <span style={{
                  fontSize: 'clamp(0.65rem, 2vw, 0.75rem)',
                  color: '#6B6E76',
                  textTransform: 'uppercase',
                  letterSpacing: 0.3,
                  marginTop: 4,
                  lineHeight: 1.3
                }}>{stat.label}</span>
              </div>
            ))}
          </div>

          {/* HTML Certificate Preview */}
          <div style={{
            margin: '32px auto',
            maxWidth: 600,
            background: 'linear-gradient(145deg, #FFFEF8, #FFF9E8)',
            border: '4px solid #722F37',
            borderRadius: 12,
            padding: 24,
            boxShadow: '0 20px 50px rgba(0,0,0,.12)',
            position: 'relative'
          }}>
            {/* Header Ribbon */}
            <div style={{
              background: 'linear-gradient(135deg, #722F37 0%, #8B3A42 100%)',
              color: 'white',
              padding: '12px 20px',
              borderRadius: 8,
              marginBottom: 20,
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.7rem', letterSpacing: 2, textTransform: 'uppercase', opacity: 0.9 }}>AccrediPro Academy</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, marginTop: 4 }}>Mini Diploma Certificate</div>
            </div>

            {/* Certificate Content */}
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#722F37', fontSize: '0.85rem', margin: '0 0 8px', fontStyle: 'italic' }}>This certifies that</p>
              <p style={{ color: '#722F37', fontSize: '1.4rem', fontWeight: 800, margin: '0 0 8px', fontFamily: 'Georgia, serif' }}>[Your Name Here]</p>
              <p style={{ color: '#6B6E76', fontSize: '0.85rem', margin: '0 0 16px' }}>has successfully completed the</p>
              <p style={{ color: '#722F37', fontSize: '1.1rem', fontWeight: 800, margin: '0 0 16px' }}>Functional Medicine Mini Diploma</p>

              {/* Seal */}
              <div style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #C9A14E, #E8C547)',
                margin: '0 auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(201,161,78,0.4)'
              }}>
                <span style={{ fontSize: '1.5rem' }}>🎓</span>
              </div>
              <p style={{ color: '#722F37', fontSize: '0.75rem', marginTop: 12, fontWeight: 600 }}>Accredited • Recognized • Verified</p>
            </div>
          </div>

          {/* Sarah Intro */}
          <div style={{
            background: 'linear-gradient(135deg, #6E5A6F, #B79AB8)',
            color: '#fff',
            borderRadius: 14,
            padding: 22,
            margin: '28px auto',
            maxWidth: 900,
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            flexWrap: 'wrap',
            justifyContent: 'center'
          }}>
            <img
              src="https://i.ibb.co/5hzyDsg0/coaching-thumbnail.jpg"
              alt="Sarah"
              style={{
                width: 85,
                height: 85,
                borderRadius: '50%',
                border: '3px solid #fff',
                objectFit: 'cover',
                flexShrink: 0
              }}
            />
            <div style={{ flex: 1, minWidth: 250 }}>
              <h3 style={{ margin: '0 0 7px', fontSize: '1.1rem', fontWeight: 700 }}>
                Hi, I'm Sarah — your mentor for the next 3 days 💕
              </h3>
              <p style={{ margin: 0, fontSize: '0.95rem', opacity: 0.97, lineHeight: 1.5 }}>
                I've helped 1,787+ students from all backgrounds discover the power of Functional Medicine. Whether you're a clinician or a health-seeker, I'll guide you through the root-cause framework and show you how to turn your passion into a thriving career.
              </p>
            </div>
          </div>
        </section>

        {/* Eligibility Section */}
        <section style={{
          background: 'linear-gradient(135deg, #FBF4F4, #F8EDED)',
          border: '2px solid #D4A5A5',
          borderRadius: 14,
          padding: 26,
          margin: '32px auto',
          maxWidth: 1000
        }}>
          <h3 style={{
            margin: '0 0 18px',
            color: '#1F2432',
            fontSize: 'clamp(1.1rem, 3vw, 1.35rem)',
            fontWeight: 800,
            textAlign: 'center'
          }}>
            🎯 This Mini Diploma Is Perfect For You If...
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 24,
            marginTop: 16
          }}>
            <div style={{
              background: 'white',
              border: '1px solid #D4A5A5',
              borderRadius: 12,
              padding: 18
            }}>
              <h4 style={{ margin: '0 0 12px', color: '#722F37', fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)', fontWeight: 800 }}>
                ✓ This IS for you if:
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  'Burnt-out nurses ready for something more fulfilling',
                  'Healthcare pros tired of "sick care" — wanting root-cause healing',
                  'Career changers passionate about health & wellness',
                  'Women dealing with autoimmune, thyroid, or hormone issues',
                  'Health coaches wanting clinical credibility & higher income',
                  'Anyone who tried traditional medicine with no answers',
                ].map((item, idx) => (
                  <li key={idx} style={{
                    padding: '7px 0',
                    fontSize: 'clamp(0.85rem, 2vw, 0.9rem)',
                    color: '#6B6E76',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 9,
                    lineHeight: 1.5
                  }}>
                    <span style={{ color: '#722F37', fontWeight: 900, fontSize: '1.05rem', flexShrink: 0, marginTop: 2 }}>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div style={{
              background: 'white',
              border: '1px solid #D4A5A5',
              borderRadius: 12,
              padding: 18
            }}>
              <h4 style={{ margin: '0 0 12px', color: '#D94B4B', fontSize: 'clamp(0.95rem, 2.5vw, 1.05rem)', fontWeight: 800 }}>
                ✗ This is NOT for you if:
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {[
                  'You want a "get rich quick" scheme',
                  'You\'re not willing to learn something new',
                  'You think all health problems need prescription drugs',
                  'You\'re happy with the current healthcare system',
                  'You don\'t believe the body can heal itself naturally',
                ].map((item, idx) => (
                  <li key={idx} style={{
                    padding: '7px 0',
                    fontSize: 'clamp(0.85rem, 2vw, 0.9rem)',
                    color: '#6B6E76',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 9,
                    lineHeight: 1.5
                  }}>
                    <span style={{ color: '#D94B4B', fontWeight: 900, fontSize: '1.05rem', flexShrink: 0, marginTop: 2 }}>✗</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Main Grid */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 28,
          alignItems: 'start',
          marginTop: 32
        }}>
          {/* Left Content */}
          <div>
            <h2 style={{
              margin: '0 0 14px',
              color: '#284B63',
              fontSize: 'clamp(1.4rem, 4vw, 1.75rem)',
              fontWeight: 900
            }}>
              What You'll Learn (3-Day Training • 90 Minutes Total)
            </h2>
            <p style={{ color: '#6B6E76', fontSize: 'clamp(0.9rem, 2vw, 0.95rem)', marginBottom: 18 }}>
              If you're passionate about healing, wellness, and helping others, this Mini Diploma gives you a real, accredited introduction to Functional Medicine. Learn the exact process behind $1,500–$3,000 client programs.
            </p>

            {/* Day cards */}
            {[
              { title: 'Day 1: Functional Medicine Foundations', desc: 'Systems biology • FM matrix • Root cause vs symptoms • How practitioners uncover hidden causes of fatigue, gut issues, hormone imbalance & more.' },
              { title: 'Day 2: Case Studies & Clinical Pattern Recognition', desc: 'Real case walk-through (Michelle, 42) • Gut-hormone-stress loop • How FM practitioners transform clients ethically & effectively.' },
              { title: 'Day 3: Your Practitioner Pathway & Income Potential', desc: 'How FM practitioners earn $5K–$10K+/month • 12-week transformation program model • The 3 certification pathways • Your next academic steps.' }
            ].map((item, idx) => (
              <div key={idx} style={{
                display: 'flex',
                gap: 12,
                alignItems: 'flex-start',
                background: '#FFF9F3',
                border: '1px solid #F1E7D8',
                borderRadius: 11,
                padding: 14,
                margin: '10px 0',
                transition: 'all 0.2s ease'
              }}>
                <span style={{
                  width: 27,
                  height: 27,
                  borderRadius: '50%',
                  background: '#722F37',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 900,
                  flex: '0 0 27px',
                  fontSize: '0.85rem'
                }}>✓</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 'clamp(0.95rem, 2.5vw, 1.02rem)', color: '#1F2432', marginBottom: 4 }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: 'clamp(0.82rem, 2vw, 0.88rem)', color: '#666', lineHeight: 1.5 }}>
                    {item.desc}
                  </div>
                </div>
              </div>
            ))}

            {/* Testimonials */}
            <div style={{
              background: '#E8F0F7',
              border: '1px solid #B8D4E8',
              borderRadius: 14,
              padding: 18,
              margin: '20px 0'
            }}>
              <p style={{ fontStyle: 'italic', color: '#4A5568', margin: '0 0 10px', lineHeight: 1.6, fontSize: 'clamp(0.88rem, 2vw, 0.95rem)' }}>
                "I always knew I wanted to help people heal, but I didn't know where to start. This Mini Diploma opened my eyes to the science of Functional Medicine. I learned more in 3 days than I did in years of reading blogs. I'm now on my way to becoming a certified coach!"
              </p>
              <div style={{ fontWeight: 800, color: '#1F2432', fontSize: 'clamp(0.88rem, 2vw, 0.95rem)', marginTop: 10 }}>Amanda T.</div>
              <div style={{ fontSize: 'clamp(0.8rem, 2vw, 0.85rem)', color: '#6B6E76' }}>Wellness Enthusiast & Career Changer</div>
            </div>
          </div>

          {/* Form Card */}
          <div style={{
            background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF9F3 100%)',
            border: '2px solid #722F37',
            borderRadius: 16,
            boxShadow: '0 16px 48px rgba(45,106,79,0.12)',
            padding: 28,
            position: 'sticky',
            top: 20
          }}>
            <div style={{ textAlign: 'center', marginBottom: 20, paddingBottom: 18, borderBottom: '2px solid #ECE8E2' }}>
              <div style={{ display: 'inline-block', background: '#722F37', color: 'white', padding: '4px 12px', borderRadius: 20, fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                ✨ Limited Spots Available
              </div>
              <h3 style={{ margin: '0 0 6px', color: '#722F37', fontSize: 'clamp(1.2rem, 3vw, 1.4rem)', fontWeight: 900 }}>
                Apply for Free Access
              </h3>
              <p style={{ color: '#6B6E76', fontSize: 'clamp(0.85rem, 2vw, 0.9rem)', margin: 0 }}>
                Complete your application in 30 seconds
              </p>
              <div style={{
                background: 'linear-gradient(135deg, #FFEBEE, #FFCDD2)',
                border: '2px solid #E57373',
                borderRadius: 8,
                padding: 10,
                marginTop: 12,
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.75rem', color: '#C62828', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>
                  🔥 Enrollment Closing Soon
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#B71C1C', fontFamily: 'monospace' }}>
                  {countdown}
                </div>
              </div>
            </div>

            {/* Value Pills */}
            <div style={{ display: 'flex', gap: 7, margin: '16px 0 20px', flexWrap: 'wrap', justifyContent: 'center' }}>
              {['✓ 100% Free', '✓ Certificate', '✓ No Experience', '✓ Self-Paced'].map((pill, idx) => (
                <div key={idx} style={{
                  background: '#F0F7F4',
                  border: '1px solid #9FE2BF',
                  color: '#722F37',
                  padding: '6px 13px',
                  borderRadius: 20,
                  fontSize: 'clamp(0.75rem, 2vw, 0.8rem)',
                  fontWeight: 700
                }}>
                  {pill}
                </div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              {/* First Name */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: '#1F2432' }}>
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: '1px solid #ECE8E2',
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Your first name"
                />
              </div>

              {/* Last Name */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: '#1F2432' }}>
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: '1px solid #ECE8E2',
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Your last name"
                />
              </div>

              {/* Email */}
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: '#1F2432' }}>
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleEmailChange}
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: `1px solid ${emailStatus === 'invalid' ? '#D94B4B' : emailStatus === 'valid' ? '#722F37' : '#ECE8E2'}`,
                    fontSize: '1rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="you@example.com"
                />
                {emailStatus === 'checking' && (
                  <p style={{ fontSize: '0.75rem', color: '#6B6E76', marginTop: 4 }}>Checking email...</p>
                )}
                {emailError && (
                  <p style={{ fontSize: '0.75rem', color: '#D94B4B', marginTop: 4 }}>{emailError}</p>
                )}
                {suggestedEmail && (
                  <p style={{ fontSize: '0.75rem', color: '#722F37', marginTop: 4 }}>
                    Did you mean{' '}
                    <button type="button" onClick={useSuggestedEmail} style={{ color: '#722F37', fontWeight: 700, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>
                      {suggestedEmail}
                    </button>
                    ?
                  </p>
                )}
              </div>

              {/* Phone */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6, color: '#1F2432' }}>
                  Phone (Optional)
                </label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <select
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value })}
                    style={{
                      padding: '12px 8px',
                      borderRadius: 10,
                      border: '1px solid #ECE8E2',
                      fontSize: '1rem',
                      outline: 'none',
                      width: 90
                    }}
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.country} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      flex: 1,
                      padding: '12px 14px',
                      borderRadius: 10,
                      border: '1px solid #ECE8E2',
                      fontSize: '1rem',
                      outline: 'none'
                    }}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <div style={{
                  background: '#FFEBEE',
                  border: '1px solid #E57373',
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 16,
                  color: '#C62828',
                  fontSize: '0.85rem'
                }}>
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || emailStatus === 'invalid'}
                style={{
                  width: '100%',
                  padding: '16px 24px',
                  borderRadius: 12,
                  border: 'none',
                  background: loading ? '#6B6E76' : 'linear-gradient(135deg, #722F37, #8B3A42)',
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: 800,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {loading ? 'Enrolling...' : '🎓 Start Free Mini Diploma'}
              </button>

              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#6B6E76', marginTop: 12 }}>
                By enrolling, you agree to receive educational emails. Unsubscribe anytime.
              </p>
            </form>
          </div>
        </section>

        {/* Footer */}
        <p style={{
          textAlign: 'center',
          fontSize: 'clamp(0.75rem, 2vw, 0.8rem)',
          color: '#9A9EA6',
          padding: '32px 0 40px',
          marginTop: 48,
          borderTop: '1px solid #ECE8E2'
        }}>
          © 2025 AccrediPro • Functional Medicine Mini Diploma • Questions? Email info@coach.accredipro.academy
        </p>
      </main>
    </div>
  );
}
