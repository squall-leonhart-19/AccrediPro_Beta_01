'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function Lesson9Page() {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<number[]>([]);
  const [notes, setNotes] = useState('');
  const [showNotes, setShowNotes] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [examAnswers, setExamAnswers] = useState<{ [key: number]: string }>({});
  const [examSubmitted, setExamSubmitted] = useState(false);
  const [examScore, setExamScore] = useState(0);
  const [showExamResults, setShowExamResults] = useState(false);
  const lessonNumber = 9;
  const brandColor = '#2D5A4A';
  const accentColor = '#D4AF37';
  const title = "Maria's Story + Final Certification Exam";

  useEffect(() => { const n = localStorage.getItem('roots-lesson-9-notes'); if (n) setNotes(n); }, []);
  const handleNotesChange = (v: string) => { setNotes(v); localStorage.setItem('roots-lesson-9-notes', v); };

  // Final Exam Questions
  const examQuestions = [
    { id: 1, question: "What does R.O.O.T.S. stand for?", options: ["Recognize, Origin, Optimize, Transform, Scale", "Research, Observe, Operate, Test, Study", "Review, Organize, Optimize, Treat, Support", "Reach, Observe, Orient, Transform, Succeed"], correct: "Recognize, Origin, Optimize, Transform, Scale" },
    { id: 2, question: "What percentage of nurses report feeling burned out?", options: ["43%", "53%", "63%", "73%"], correct: "63%" },
    { id: 3, question: "What is the '5 Whys' technique used for in the R.O.O.T.S. Method?", options: ["Finding the root cause of symptoms", "Setting 5 goals with clients", "Reviewing 5 body systems", "Creating 5 meal plans"], correct: "Finding the root cause of symptoms" },
    { id: 4, question: "What are the 5 foundational pillars in the 'Optimize' step?", options: ["Nutrition, Movement, Sleep, Stress, Environment", "Diet, Exercise, Rest, Work, Play", "Food, Fitness, Sleep, Mind, Body", "Eating, Training, Resting, Thinking, Living"], correct: "Nutrition, Movement, Sleep, Stress, Environment" },
    { id: 5, question: "What does the COACH model stand for?", options: ["Connect, Outcomes, Accountability, Change, Hold", "Care, Observe, Act, Coach, Help", "Consult, Orient, Advise, Create, Heal", "Call, Organize, Assess, Change, Heal"], correct: "Connect, Outcomes, Accountability, Change, Hold" },
    { id: 6, question: "What is a typical hourly rate for R.O.O.T.S. practitioners?", options: ["$25-50/hour", "$50-75/hour", "$75-150/hour", "$200-300/hour"], correct: "$75-150/hour" },
    { id: 7, question: "How many body systems are in the R.O.O.T.S. assessment matrix?", options: ["5 systems", "7 systems", "9 systems", "12 systems"], correct: "7 systems" },
    { id: 8, question: "What is the recommended timeline for transitioning from clinical work to coaching?", options: ["30 days", "60 days", "90 days", "180 days"], correct: "90 days" },
    { id: 9, question: "What is the main advantage healthcare professionals have over regular health coaches?", options: ["Lower prices", "Clinical experience and medical knowledge", "More free time", "Better marketing skills"], correct: "Clinical experience and medical knowledge" },
    { id: 10, question: "What is the goal of the 'Transform' step in R.O.O.T.S.?", options: ["Diagnosing conditions", "Prescribing medications", "Behavior change through coaching", "Running lab tests"], correct: "Behavior change through coaching" },
  ];

  const handleExamAnswer = (questionId: number, answer: string) => {
    setExamAnswers({ ...examAnswers, [questionId]: answer });
  };

  const submitExam = () => {
    let score = 0;
    examQuestions.forEach(q => {
      if (examAnswers[q.id] === q.correct) score++;
    });
    setExamScore(score);
    setExamSubmitted(true);
    setShowExamResults(true);
  };

  const passedExam = examScore >= 8; // 80% to pass
  const allQuestionsAnswered = Object.keys(examAnswers).length === 10;

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
          <p>Then she realized something:</p>
          <div style={{ background: brandColor, color: 'white', padding: 24, borderRadius: 12, margin: '20px 0' }}>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>"Wait. People are paying $150/hour to coaches with NO clinical background. And I have 18 years of patient care experience?"</p>
          </div>
          <p>She enrolled that night.</p>
        </>
      )
    },
    {
      id: 2, type: 'content', title: 'The Transformation', content: (
        <>
          <h3 style={{ fontSize: 20, marginBottom: 16, fontWeight: 600 }}>60 Days Later</h3>
          <div style={{ display: 'grid', gap: 12, margin: '20px 0' }}>
            <div style={{ padding: 16, background: '#f8f9fa', borderRadius: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 24 }}>📅</span>
              <div><strong>Week 1-4:</strong> Completed R.O.O.T.S. certification (while still working)</div>
            </div>
            <div style={{ padding: 16, background: '#f8f9fa', borderRadius: 12, display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: 24 }}>👤</span>
              <div><strong>Week 5-6:</strong> First 3 clients (coworkers with thyroid issues)</div>
            </div>
            <div style={{ padding: 16, background: '#d1fae5', borderRadius: 12, display: 'flex', gap: 12, alignItems: 'center', border: '2px solid #10B981' }}>
              <span style={{ fontSize: 24 }}>💰</span>
              <div><strong>Week 8:</strong> First $1,200 month — working just 6 hours on weekends</div>
            </div>
          </div>
          <p>Today, 8 months later: <strong style={{ color: brandColor }}>$6,500/month</strong> working from home, half the hours. Her Hashimoto's? Under control.</p>
        </>
      )
    },
    {
      id: 3, type: 'content', title: 'Your Roadmap', content: (
        <>
          <h3 style={{ fontSize: 20, marginBottom: 16, fontWeight: 600 }}>Your 90-Day Roadmap</h3>
          <div style={{ display: 'grid', gap: 16, margin: '20px 0' }}>
            <div style={{ padding: 20, background: `linear-gradient(135deg, ${brandColor}10, ${brandColor}05)`, borderRadius: 12, borderLeft: `4px solid ${brandColor}` }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                <span style={{ padding: '6px 14px', background: brandColor, color: 'white', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>Days 1-30</span>
                <span style={{ fontWeight: 700, fontSize: 18, color: brandColor }}>FOUNDATION</span>
              </div>
              <p style={{ margin: 0, color: '#555' }}>Complete full certification. Keep your job — zero risk.</p>
            </div>
            <div style={{ padding: 20, background: `linear-gradient(135deg, ${accentColor}15, ${accentColor}05)`, borderRadius: 12, borderLeft: `4px solid ${accentColor}` }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                <span style={{ padding: '6px 14px', background: accentColor, color: '#1a1a1a', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>Days 31-60</span>
                <span style={{ fontWeight: 700, fontSize: 18, color: '#1a1a1a' }}>FIRST CLIENTS</span>
              </div>
              <p style={{ margin: 0, color: '#555' }}>Your first 3-5 clients. Friends, coworkers. Build confidence.</p>
            </div>
            <div style={{ padding: 20, background: `linear-gradient(135deg, #10B98115, #10B98105)`, borderRadius: 12, borderLeft: '4px solid #10B981' }}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                <span style={{ padding: '6px 14px', background: '#10B981', color: 'white', borderRadius: 20, fontSize: 13, fontWeight: 600 }}>Days 61-90</span>
                <span style={{ fontWeight: 700, fontSize: 18, color: '#10B981' }}>PAID PRACTICE</span>
              </div>
              <p style={{ margin: 0, color: '#555' }}>$75-150/session. Referrals start. Your exit strategy takes shape.</p>
            </div>
          </div>
          <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 12, marginTop: 24, textAlign: 'center' }}>
            <p style={{ margin: 0, fontWeight: 600 }}>Ready to prove your knowledge?</p>
            <p style={{ margin: '8px 0 0', color: '#666' }}>Complete the Final Exam to earn your R.O.O.T.S. Foundation Certificate</p>
          </div>
        </>
      )
    },
    { id: 4, type: 'exam', title: 'Final Certification Exam' },
  ];

  const totalSections = sections.length;
  const moduleProgress = Math.round((lessonNumber / 9) * 100);
  const handleContinue = () => { if (!completedSections.includes(currentSection)) setCompletedSections([...completedSections, currentSection]); if (currentSection < totalSections - 1) { setCurrentSection(currentSection + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
  const currentSectionData = sections[currentSection];
  const isLastSection = currentSection === totalSections - 1;
  const isExamSection = currentSectionData.type === 'exam';

  return (
    <div style={{ minHeight: '100vh', background: '#fff', fontFamily: 'Georgia, serif' }}>
      {/* Header */}
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
            <span style={{ fontSize: 14 }}>Lesson {lessonNumber} — Final Exam</span>
            <span style={{ fontSize: 12, opacity: 0.7 }}>8 min</span>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: 640, margin: '0 auto', padding: '32px 24px 140px' }}>
        <h1 style={{ fontSize: 26, lineHeight: 1.3, marginBottom: 32, fontWeight: 600 }}>{currentSectionData.title}</h1>

        {isExamSection ? (
          <>
            {!showExamResults ? (
              <>
                <div style={{ background: brandColor, color: 'white', padding: 20, borderRadius: 12, marginBottom: 32 }}>
                  <h3 style={{ margin: '0 0 8px', fontSize: 18 }}>📝 R.O.O.T.S. Method™ Final Exam</h3>
                  <p style={{ margin: 0, opacity: 0.9 }}>Answer all 10 questions. You need 80% (8/10) to pass and earn your certificate.</p>
                </div>

                {examQuestions.map((q, idx) => (
                  <div key={q.id} style={{ marginBottom: 32, padding: 24, background: '#f8f9fa', borderRadius: 12 }}>
                    <p style={{ fontWeight: 600, marginBottom: 16 }}>{idx + 1}. {q.question}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {q.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleExamAnswer(q.id, opt)}
                          style={{
                            padding: '14px 16px',
                            border: `2px solid ${examAnswers[q.id] === opt ? brandColor : '#ddd'}`,
                            background: examAnswers[q.id] === opt ? `${brandColor}15` : 'white',
                            borderRadius: 10,
                            textAlign: 'left',
                            cursor: 'pointer',
                            fontSize: 15,
                          }}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                <button
                  onClick={submitExam}
                  disabled={!allQuestionsAnswered}
                  style={{
                    width: '100%',
                    padding: '18px',
                    background: allQuestionsAnswered ? `linear-gradient(135deg, ${brandColor}, #1a3a2e)` : '#ccc',
                    color: 'white',
                    border: 'none',
                    borderRadius: 10,
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: allQuestionsAnswered ? 'pointer' : 'not-allowed',
                  }}
                >
                  {allQuestionsAnswered ? 'Submit Final Exam →' : `Answer all questions (${Object.keys(examAnswers).length}/10)`}
                </button>
              </>
            ) : (
              <div style={{ textAlign: 'center' }}>
                {passedExam ? (
                  <>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
                    <h2 style={{ fontSize: 28, color: brandColor, marginBottom: 16 }}>Congratulations!</h2>
                    <p style={{ fontSize: 18, marginBottom: 8 }}>You scored <strong>{examScore}/10</strong></p>
                    <p style={{ color: '#666', marginBottom: 32 }}>You have passed the R.O.O.T.S. Method™ Final Exam!</p>

                    <div style={{ background: 'linear-gradient(135deg, #f8f9fa, white)', border: `3px solid ${accentColor}`, borderRadius: 20, padding: 32, margin: '0 auto 32px', maxWidth: 360 }}>
                      <Image src="/accredipro-logo-full.jpg" alt="AccrediPro" width={80} height={80} style={{ borderRadius: 12, marginBottom: 16 }} />
                      <div style={{ fontSize: 20, fontWeight: 'bold', color: brandColor }}>R.O.O.T.S. Method™</div>
                      <div style={{ fontSize: 16, color: '#666', marginTop: 4 }}>Foundation Certificate</div>
                      <div style={{ fontSize: 13, color: '#888', marginTop: 12 }}>Internationally Accredited</div>
                    </div>

                    <button
                      onClick={() => router.push('/roots-method/certificate')}
                      style={{
                        display: 'inline-block',
                        padding: '18px 40px',
                        background: `linear-gradient(135deg, ${brandColor}, #1a3a2e)`,
                        color: 'white',
                        border: 'none',
                        borderRadius: 10,
                        fontSize: 16,
                        fontWeight: 600,
                        cursor: 'pointer',
                        marginBottom: 24,
                      }}
                    >
                      🎓 Download Your Certificate
                    </button>

                    <div style={{ background: brandColor, color: 'white', padding: 24, borderRadius: 16, marginTop: 32 }}>
                      <p style={{ margin: '0 0 12px', fontSize: 15 }}>Ready to master ALL 15 specialized protocols?</p>
                      <div style={{ fontSize: 14, opacity: 0.9, marginBottom: 8 }}>
                        <span style={{ textDecoration: 'line-through' }}>Regular: $997</span>
                      </div>
                      <div style={{ fontSize: 28, fontWeight: 'bold' }}>🎄 $497</div>
                      <div style={{ fontSize: 13, marginTop: 4, opacity: 0.9 }}>Christmas Special — Ends Dec 26</div>
                      <a href="https://sarah.accredipro.academy/fm-certification" style={{ display: 'inline-block', marginTop: 16, padding: '12px 28px', background: accentColor, color: '#1a1a1a', borderRadius: 10, fontSize: 15, fontWeight: 700, textDecoration: 'none' }}>
                        Get Full Certification →
                      </a>
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>😔</div>
                    <h2 style={{ fontSize: 28, color: '#EF4444', marginBottom: 16 }}>Not Quite...</h2>
                    <p style={{ fontSize: 18, marginBottom: 8 }}>You scored <strong>{examScore}/10</strong></p>
                    <p style={{ color: '#666', marginBottom: 32 }}>You need 8/10 (80%) to pass. Review the lessons and try again!</p>

                    <button
                      onClick={() => { setShowExamResults(false); setExamSubmitted(false); setExamAnswers({}); }}
                      style={{
                        padding: '18px 40px',
                        background: `linear-gradient(135deg, ${brandColor}, #1a3a2e)`,
                        color: 'white',
                        border: 'none',
                        borderRadius: 10,
                        fontSize: 16,
                        fontWeight: 600,
                        cursor: 'pointer',
                      }}
                    >
                      Retake Exam
                    </button>
                  </>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ fontSize: 17, lineHeight: 1.9 }}>{currentSectionData.content}</div>
            <div style={{ marginTop: 40 }}>
              <button onClick={handleContinue} style={{ width: '100%', padding: '18px', background: `linear-gradient(135deg, ${brandColor}, #1a3a2e)`, color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
                {currentSection === 3 ? 'Start Final Exam →' : 'Continue →'}
              </button>
            </div>
          </>
        )}
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
