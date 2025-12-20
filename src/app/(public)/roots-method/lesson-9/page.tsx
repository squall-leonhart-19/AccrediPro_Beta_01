'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Lesson9Page() {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const lessonNumber = 9;
  const brandColor = '#2D5A4A';
  const accentColor = '#D4AF37';
  const title = "Maria's Story + Your 90-Day Roadmap";

  useEffect(() => { const n = localStorage.getItem('roots-lesson-9-notes'); if (n) setNotes(n); }, []);
  const handleNotesChange = (v: string) => { setNotes(v); localStorage.setItem('roots-lesson-9-notes', v); };

  const sections = [
    {
      id: 0, type: 'content', title: 'The Breaking Point', content: (
        <>
          <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 12, marginBottom: 24 }}>
            <p style={{ fontStyle: 'italic', color: '#666', margin: 0 }}>"I sat in my car after a 14-hour shift and just... cried. I couldn't go home. I couldn't go back in. I was completely empty."</p>
          </div>
          <h3 style={{ fontSize: 20, marginBottom: 16, fontWeight: 600 }}>Maria's Breaking Point</h3>
          <p>Maria was 47. Med-Surg nurse for 18 years. <strong style={{ color: '#EF4444' }}>Completely broken.</strong></p>
          <p>She'd gained 35 pounds. Her own Hashimoto's was out of control. She'd started snapping at her kids. Her husband said she wasn't "herself" anymore.</p>
          <p>But the worst part?</p>
          <div style={{ background: '#fee2e2', padding: 20, borderRadius: 12, margin: '20px 0', borderLeft: '4px solid #EF4444' }}>
            <p style={{ margin: 0, fontWeight: 600 }}>She'd become the kind of nurse she swore she'd never be.</p>
            <p style={{ margin: '12px 0 0', fontSize: 15 }}>Rushing through patient conversations. Too tired to really listen. Just trying to survive until the end of shift.</p>
          </div>
          <p>One night, she Googled: <em>"Can nurses do something else besides bedside?"</em></p>
          <p>That search changed everything.</p>
        </>
      )
    },
    {
      id: 1, type: 'content', title: 'The Discovery', content: (
        <>
          <h3 style={{ fontSize: 20, marginBottom: 16, fontWeight: 600 }}>She Found a Different Path</h3>
          <p>Maria discovered functional medicine coaches were earning <strong style={{ color: brandColor }}>$75-150/hour</strong> helping people solve the exact health problems doctors couldn't figure out.</p>
          <p>The same problems <em>she</em> had. The same frustrations she felt watching patients leave with pills that wouldn't help.</p>
          <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 12, margin: '20px 0' }}>
            <p style={{ margin: 0, fontWeight: 600, color: brandColor }}>But she almost didn't do it.</p>
            <p style={{ margin: '12px 0 0' }}>She thought: "I'm just a nurse. Who would pay ME for health coaching?"</p>
          </div>
          <p>Sound familiar?</p>
          <p>Then she realized something that changed her mindset forever:</p>
          <div style={{ background: brandColor, color: 'white', padding: 24, borderRadius: 12, margin: '20px 0' }}>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>"Wait. People are paying $150/hour to coaches with NO clinical background. And I have 18 years of patient care experience?"</p>
          </div>
          <p>She enrolled in R.O.O.T.S. that night.</p>
        </>
      )
    },
    {
      id: 2, type: 'content', title: 'The Transformation', content: (
        <>
          <h3 style={{ fontSize: 20, marginBottom: 16, fontWeight: 600 }}>60 Days Later</h3>
          <p>Maria didn't quit her job overnight. She was smart about it.</p>
          <div style={{ display: 'grid', gap: 12, margin: '20px 0' }}>
            <div style={{ padding: 16, background: '#f8f9fa', borderRadius: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 24 }}>📅</span>
              <div>
                <strong>Week 1-4:</strong> Completed R.O.O.T.S. certification (while still working)
              </div>
            </div>
            <div style={{ padding: 16, background: '#f8f9fa', borderRadius: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 24 }}>👤</span>
              <div>
                <strong>Week 5-6:</strong> Got her first 3 clients (friends with thyroid issues, just like her)
              </div>
            </div>
            <div style={{ padding: 16, background: '#d1fae5', borderRadius: 12, display: 'flex', gap: 12, alignItems: 'center', border: '2px solid #10B981' }}>
              <span style={{ fontSize: 24 }}>💰</span>
              <div>
                <strong>Week 8:</strong> First $1,200 month — working just 6 hours on weekends
              </div>
            </div>
          </div>
          <p>Today, 8 months later, Maria works <strong style={{ color: brandColor }}>from home</strong>. She sees 12 clients/week at $125/hour. She makes <strong style={{ color: brandColor }}>$6,500/month</strong> working half the hours she did as a nurse.</p>
          <p>And her Hashimoto's? Under control — because she finally had time to take care of <em>herself</em>.</p>
        </>
      )
    },
    {
      id: 3, type: 'content', title: 'Your Roadmap', content: (
        <>
          <h3 style={{ fontSize: 20, marginBottom: 16, fontWeight: 600 }}>Your 90-Day Roadmap</h3>
          <p>Here's your path — the same one Maria followed:</p>
          <div style={{ display: 'grid', gap: 16, margin: '20px 0' }}>
            <div style={{ padding: 20, background: `linear-gradient(135deg, ${brandColor}10, ${brandColor}05)`, borderRadius: 12, borderLeft: `4px solid ${brandColor}` }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                <span style={{ padding: '6px 14px', background: brandColor, color: 'white', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>Days 1-30</span>
                <span style={{ fontWeight: 700, fontSize: 18, color: brandColor }}>FOUNDATION</span>
              </div>
              <p style={{ margin: 0, color: '#555' }}>Complete full certification. Set up your simple systems. Keep your job — zero risk.</p>
            </div>
            <div style={{ padding: 20, background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}05)`, borderRadius: 12, borderLeft: `4px solid ${accentColor}` }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                <span style={{ padding: '6px 14px', background: accentColor, color: '#1a1a1a', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>Days 31-60</span>
                <span style={{ fontWeight: 700, fontSize: 18, color: '#1a1a1a' }}>FIRST CLIENTS</span>
              </div>
              <p style={{ margin: 0, color: '#555' }}>Your first 3-5 clients. Friends, coworkers with health struggles. Free or discounted. Build confidence.</p>
            </div>
            <div style={{ padding: 20, background: `linear-gradient(135deg, #10B98115, #10B98105)`, borderRadius: 12, borderLeft: '4px solid #10B981' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                <span style={{ padding: '6px 14px', background: '#10B981', color: 'white', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>Days 61-90</span>
                <span style={{ fontWeight: 700, fontSize: 18, color: '#10B981' }}>PAID PRACTICE</span>
              </div>
              <p style={{ margin: 0, color: '#555' }}>Transition to paid clients. $75-150/session. Referrals start coming. Your exit strategy takes shape.</p>
            </div>
          </div>
        </>
      )
    },
    {
      id: 4, type: 'content', title: 'Congratulations', content: (
        <>
          <h3 style={{ fontSize: 20, marginBottom: 16, fontWeight: 600 }}>🎉 You Did It.</h3>
          <p>You just completed the <strong style={{ color: brandColor }}>R.O.O.T.S. Method™ Foundation Training</strong>.</p>
          <p>You now know more about root-cause health coaching than 99% of people who call themselves "health coaches."</p>

          <div style={{ background: 'linear-gradient(135deg, #f8f9fa, white)', border: `3px solid ${accentColor}`, borderRadius: 20, padding: 32, textAlign: 'center', margin: '28px 0' }}>
            <Image src="/accredipro-logo-full.jpg" alt="AccrediPro" width={80} height={80} style={{ borderRadius: 12, marginBottom: 16 }} />
            <div style={{ fontSize: 22, fontWeight: 'bold', color: brandColor }}>R.O.O.T.S. Method™</div>
            <div style={{ fontSize: 16, color: '#666', marginTop: 4 }}>Foundation Certificate</div>
            <div style={{ fontSize: 13, color: '#888', marginTop: 12 }}>Internationally Accredited • CMA Recognized</div>
          </div>

          <p style={{ textAlign: 'center', fontSize: 17 }}>But here's the truth...</p>
          <p style={{ textAlign: 'center', color: '#666' }}>This foundation is just the beginning. The full R.O.O.T.S. Certification includes everything you need to build a <strong>$5K-15K/month practice</strong> — client acquisition, pricing, scripts, and ongoing mentorship.</p>

          <div style={{ background: brandColor, color: 'white', padding: 28, borderRadius: 16, textAlign: 'center', marginTop: 24 }}>
            <div style={{ fontSize: 15, opacity: 0.9, marginBottom: 8 }}>
              <span style={{ textDecoration: 'line-through' }}>Regular: $997</span>
            </div>
            <div style={{ fontSize: 32, fontWeight: 'bold' }}>🎄 $497</div>
            <div style={{ fontSize: 14, marginTop: 4, opacity: 0.9 }}>Christmas Special — Ends Dec 26</div>
            <a href="https://sarah.accredipro.academy/fm-certification" style={{ display: 'inline-block', marginTop: 20, padding: '14px 32px', background: accentColor, color: '#1a1a1a', borderRadius: 10, fontSize: 16, fontWeight: 700, textDecoration: 'none' }}>
              Get Full Certification →
            </a>
          </div>
        </>
      )
    },
  ];

  const totalSections = sections.length;
  const moduleProgress = Math.round((lessonNumber / 9) * 100);
  const handleContinue = () => { if (!completedSections.includes(currentSection)) setCompletedSections([...completedSections, currentSection]); if (currentSection < totalSections - 1) { setCurrentSection(currentSection + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
  const currentSectionData = sections[currentSection];
  const isLastSection = currentSection === totalSections - 1;

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'Georgia, serif' }}>
      {/* Header with AccrediPro branding */}
      <header style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e)', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
            <Image src="/accredipro-logo-full.jpg" alt="AccrediPro" width={32} height={32} style={{ borderRadius: 6 }} />
            <span style={{ fontSize: 14, color: 'white', fontWeight: 600 }}>R.O.O.T.S. Method™</span>
            <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 3, marginLeft: 12 }}>
              <div style={{ height: '100%', width: `${moduleProgress}%`, background: accentColor, borderRadius: 3 }} />
            </div>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{lessonNumber}/9</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white' }}>
            <span style={{ fontSize: 14 }}>Lesson {lessonNumber}</span>
            <span style={{ fontSize: 12, opacity: 0.7 }}>5 min</span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 640, margin: '0 auto', padding: '32px 24px 140px' }}>
        <h1 style={{ fontSize: 26, lineHeight: 1.3, marginBottom: 32, fontWeight: 600 }}>{title}</h1>
        <div style={{ fontSize: 17, lineHeight: 1.9 }}>{currentSectionData.content}</div>

        <div style={{ marginTop: 40 }}>
          {isLastSection ? (
            <Link href="/roots-method" style={{ display: 'block', padding: '18px', background: `linear-gradient(135deg, ${brandColor}, #1a3a2e)`, color: 'white', borderRadius: 10, fontSize: 16, fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>🎉 Complete Training</Link>
          ) : (
            <button onClick={handleContinue} style={{ width: '100%', padding: '18px', background: `linear-gradient(135deg, ${brandColor}, #1a3a2e)`, color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>Continue →</button>
          )}
        </div>
      </main>

      {/* Floating buttons */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 12, zIndex: 100 }}>
        <button onClick={() => setShowNotes(!showNotes)} style={{ width: 56, height: 56, borderRadius: '50%', background: showNotes ? brandColor : 'white', color: showNotes ? 'white' : brandColor, border: `2px solid ${brandColor}`, cursor: 'pointer', fontSize: 20 }}>📝</button>
        <button onClick={() => setShowChat(!showChat)} style={{ width: 56, height: 56, borderRadius: '50%', background: showChat ? brandColor : 'white', color: showChat ? 'white' : brandColor, border: `2px solid ${brandColor}`, cursor: 'pointer', fontSize: 20 }}>💬</button>
      </div>

      {/* Notes panel */}
      {showNotes && (
        <div style={{ position: 'fixed', bottom: 100, right: 24, width: 320, background: 'white', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 100 }}>
          <div style={{ padding: 16, background: brandColor, color: 'white', borderRadius: '16px 16px 0 0' }}>📝 Notes</div>
          <div style={{ padding: 16 }}>
            <textarea value={notes} onChange={(e) => handleNotesChange(e.target.value)} placeholder="Take notes..." style={{ width: '100%', height: 200, border: '1px solid #ddd', borderRadius: 8, padding: 12, fontFamily: 'inherit' }} />
          </div>
        </div>
      )}

      {/* Chat panel */}
      {showChat && (
        <div style={{ position: 'fixed', bottom: 100, right: 24, width: 340, height: 400, background: 'white', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: 16, background: brandColor, color: 'white', borderRadius: '16px 16px 0 0', display: 'flex', alignItems: 'center', gap: 10 }}>
            <Image src="/coaches/sarah-coach.webp" alt="Sarah" width={32} height={32} style={{ borderRadius: '50%' }} />
            <span>Chat with Sarah</span>
          </div>
          <div style={{ flex: 1, padding: 16, textAlign: 'center', color: '#888' }}>🌱 Ask me anything!</div>
          <div style={{ padding: 12, borderTop: '1px solid #eee' }}>
            <input value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type..." style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 20 }} />
          </div>
        </div>
      )}
    </div>
  );
}
