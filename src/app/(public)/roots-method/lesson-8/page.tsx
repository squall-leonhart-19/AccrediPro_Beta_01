'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Lesson8Page() {
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [quickCheckAnswers, setQuickCheckAnswers] = useState<{ [key: number]: string | null }>({});
  const [showAnswers, setShowAnswers] = useState<number[]>([]);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const lessonNumber = 8;
  const brandColor = '#722F37';
  const accentColor = '#D4AF37';
  const courseName = 'R.O.O.T.S. Method™ — Clinical Foundations Mini Course';
  const title = 'S — Scale Your Practice (The Money Lesson)';

  useEffect(() => { const n = localStorage.getItem('roots-lesson-8-notes'); if (n) setNotes(n); }, []);
  const handleNotesChange = (v: string) => { setNotes(v); localStorage.setItem('roots-lesson-8-notes', v); };

  const sections = [
    {
      id: 0, type: 'content', title: 'The Money Lesson', content: (
        <>
          <h3 style={{ fontSize: 20, marginBottom: 16, fontWeight: 600 }}>S — Scale Your Practice 💰</h3>
          <p>This is <strong style={{ color: brandColor }}>the lesson most certifications skip</strong>. But it's the most important.</p>
          <p>What good is knowledge if you can't build a sustainable practice?</p>
          <div style={{ background: 'linear-gradient(135deg, #f8f9fa, white)', border: `2px solid ${accentColor}`, padding: 24, borderRadius: 16, textAlign: 'center', margin: '24px 0' }}>
            <div style={{ fontSize: 14, color: '#888', marginBottom: 8 }}>R.O.O.T.S. Practitioners Earn</div>
            <div style={{ fontSize: 36, fontWeight: 'bold', color: brandColor }}>$5,000 - $15,000/mo</div>
            <div style={{ fontSize: 14, color: '#666', marginTop: 8 }}>Working 15-25 hours per week</div>
          </div>
        </>
      )
    },
    {
      id: 1, type: 'content', title: 'Business Models', content: (
        <>
          <h3 style={{ fontSize: 20, marginBottom: 16, fontWeight: 600 }}>Proven Business Models</h3>
          <p>Choose the model that fits your life:</p>
          <div style={{ display: 'grid', gap: 12, margin: '20px 0' }}>
            {[
              { name: '1:1 Coaching', price: '$150-300/session', time: '4-6 clients/week = $3-6K/mo' },
              { name: 'Group Programs', price: '$500-1500/program', time: '10-20 clients/round = $5-30K' },
              { name: 'Hybrid Model', price: 'Both combined', time: '$8-15K/mo typical' }
            ].map((m, i) => (
              <div key={i} style={{ padding: 16, background: '#f8f9fa', borderRadius: 12, borderLeft: `4px solid ${accentColor}` }}>
                <div style={{ fontWeight: 600, color: brandColor }}>{m.name}</div>
                <div style={{ fontSize: 14, color: '#666' }}>{m.price} — {m.time}</div>
              </div>
            ))}
          </div>
        </>
      )
    },
    { id: 2, type: 'quickcheck', title: 'Quick Check', question: 'What do R.O.O.T.S. practitioners typically earn working 15-25 hours/week?', options: ['$1-2K/month', '$3-5K/month', '$5-15K/month', '$20K+/month'], correct: '$5-15K/month', explanation: 'R.O.O.T.S. practitioners typically earn $5,000-$15,000/month working part-time hours.' },
    {
      id: 3, type: 'content', title: 'Getting Clients', content: (
        <>
          <h3 style={{ fontSize: 20, marginBottom: 16, fontWeight: 600 }}>The Client Acquisition System</h3>
          <p>The full certification includes our complete marketing system:</p>
          <ul style={{ paddingLeft: 20, margin: '16px 0' }}>
            <li>Social media content templates</li>
            <li>Email sequences that convert</li>
            <li>Referral system setup</li>
            <li>Pricing psychology</li>
            <li>Sales conversation scripts</li>
          </ul>
          <div style={{ background: brandColor, color: 'white', padding: 24, borderRadius: 12, marginTop: 20 }}>
            <p style={{ margin: 0, fontStyle: 'italic' }}>"The business training was worth the entire certification price alone. I had my first paying client within 2 weeks."</p>
            <p style={{ margin: '12px 0 0', fontSize: 14, opacity: 0.9 }}>— Recent R.O.O.T.S. Graduate</p>
          </div>
        </>
      )
    },
  ];

  const totalSections = sections.length;
  const moduleProgress = Math.round((lessonNumber / 9) * 100);
  const handleContinue = () => { if (!completedSections.includes(currentSection)) setCompletedSections([...completedSections, currentSection]); if (currentSection < totalSections - 1) { setCurrentSection(currentSection + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
  const handleQuickCheck = (id: number, a: string) => setQuickCheckAnswers({ ...quickCheckAnswers, [id]: a });
  const handleCheckAnswer = (id: number) => { if (!showAnswers.includes(id)) setShowAnswers([...showAnswers, id]); };
  const currentSectionData = sections[currentSection];
  const isLastSection = currentSection === totalSections - 1;
  const isQuickCheck = currentSectionData.type === 'quickcheck';
  const canContinue = isQuickCheck ? showAnswers.includes(currentSectionData.id) : true;

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'Georgia, serif' }}>
      {/* Header with AccrediPro branding */}
      <header style={{ background: `linear-gradient(135deg, ${brandColor} 0%, #4a1c22 100%)`, padding: '16px 24px', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <Image src="/newlogo.webp" alt="AccrediPro" width={44} height={44} style={{ borderRadius: 8 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, color: 'white', fontWeight: 600, marginBottom: 4 }}>{courseName}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 3 }}>
                  <div style={{ height: '100%', width: `${moduleProgress}%`, background: accentColor, borderRadius: 3, transition: 'width 0.3s ease' }} />
                </div>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{lessonNumber}/9</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white' }}>
            <span style={{ fontSize: 14 }}>Lesson {lessonNumber}</span>
            <span style={{ fontSize: 12, opacity: 0.7 }}>8 min</span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 640, margin: '0 auto', padding: '32px 24px 140px' }}>
        <h1 style={{ fontSize: 26, lineHeight: 1.3, marginBottom: 32, fontWeight: 600 }}>{title}</h1>

        {currentSectionData.type === 'content' ? (
          <div style={{ fontSize: 17, lineHeight: 1.9 }}>{currentSectionData.content}</div>
        ) : (
          <div style={{ background: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: 16, padding: 28 }}>
            <p style={{ fontSize: 18, fontWeight: 500, marginBottom: 24 }}>{currentSectionData.question}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {currentSectionData.options?.map((o: string) => {
                const sel = quickCheckAnswers[currentSectionData.id] === o;
                const cor = o === currentSectionData.correct;
                const show = showAnswers.includes(currentSectionData.id);
                return (
                  <button key={o} onClick={() => !show && handleQuickCheck(currentSectionData.id, o)} style={{ padding: '16px', border: '2px solid', borderColor: show ? (cor ? '#10B981' : sel ? '#EF4444' : '#ddd') : (sel ? brandColor : '#ddd'), background: show && cor ? '#D1FAE5' : show && sel && !cor ? '#FEE2E2' : 'white', borderRadius: 10, textAlign: 'left', fontSize: 16, cursor: show ? 'default' : 'pointer' }}>{o}</button>
                );
              })}
            </div>
            {quickCheckAnswers[currentSectionData.id] && !showAnswers.includes(currentSectionData.id) && (
              <button onClick={() => handleCheckAnswer(currentSectionData.id)} style={{ marginTop: 20, padding: '16px', background: brandColor, color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, width: '100%', cursor: 'pointer' }}>Check Answer</button>
            )}
            {showAnswers.includes(currentSectionData.id) && (
              <div style={{ marginTop: 20, padding: 16, background: '#D1FAE5', borderRadius: 10 }}>
                <p style={{ margin: 0 }}>{currentSectionData.explanation}</p>
              </div>
            )}
          </div>
        )}

        <div style={{ marginTop: 40 }}>
          {!canContinue ? (
            <p style={{ color: '#888', textAlign: 'center' }}>Answer to continue</p>
          ) : isLastSection ? (
            <Link href="/roots-method/lesson-9" style={{ display: 'block', padding: '18px', background: `linear-gradient(135deg, ${brandColor}, #1a3a2e)`, color: 'white', borderRadius: 10, fontSize: 16, fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>Continue to Case Study + 90-Day Roadmap →</Link>
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
