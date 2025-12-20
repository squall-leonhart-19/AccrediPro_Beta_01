'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
interface Message { id: string; content: string; senderId: string; receiverId: string; createdAt: string; }
export default function Lesson1Page() {
    const [currentSection, setCurrentSection] = useState(0);
    const [completedSections, setCompletedSections] = useState<number[]>([]);
    const [quickCheckAnswers, setQuickCheckAnswers] = useState<{ [key: number]: string | null }>({});
    const [showAnswers, setShowAnswers] = useState<number[]>([]);
    const [notes, setNotes] = useState('');
    const [showNotes, setShowNotes] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [coachId, setCoachId] = useState<string | null>(null);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [showLessonNav, setShowLessonNav] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const pollInterval = useRef<NodeJS.Timeout | null>(null);

    const lessonData = { module: 1, lessonNumber: 1, totalLessons: 9, title: 'From Burnout to Purpose: Why You\'re Really Here', readTime: '6 min' };
    const brandColor = '#2D5A4A';
    const accentColor = '#D4AF37';

    const allLessons = [
        { num: 1, title: 'From Burnout to Purpose', completed: true, current: true },
        { num: 2, title: 'Your Clinical Advantage Assessment', completed: false, current: false },
        { num: 3, title: 'The R.O.O.T.S. Framework Overview', completed: false, current: false },
        { num: 4, title: 'R — Recognize the Pattern', completed: false, current: false },
        { num: 5, title: 'O — Find the Origin', completed: false, current: false },
        { num: 6, title: 'O — Optimize the Foundations', completed: false, current: false },
        { num: 7, title: 'T — Transform with Coaching', completed: false, current: false },
        { num: 8, title: 'S — Scale Your Practice', completed: false, current: false },
        { num: 9, title: 'Case Study + 90-Day Roadmap', completed: false, current: false },
    ];

    useEffect(() => { const init = async () => { try { const s = await fetch('/api/auth/session'); const sd = await s.json(); if (sd?.user?.id) setCurrentUserId(sd.user.id); const c = await fetch('/api/coach/assigned'); const cd = await c.json(); if (cd?.coach?.id) setCoachId(cd.coach.id); } catch (e) { console.error(e); } }; init(); }, []);
    useEffect(() => { if (showChat && coachId) { fetchMessages(); pollInterval.current = setInterval(fetchMessages, 5000); } return () => { if (pollInterval.current) clearInterval(pollInterval.current); }; }, [showChat, coachId]);
    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
    const fetchMessages = async () => { if (!coachId) return; try { const r = await fetch(`/api/messages?userId=${coachId}`); const d = await r.json(); if (d.success) setMessages(d.data); } catch (e) { console.error(e); } };
    const sendMessage = async () => { if (!newMessage.trim() || !coachId || isSending) return; setIsSending(true); try { const r = await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ receiverId: coachId, content: newMessage }) }); const d = await r.json(); if (d.success) { setMessages([...messages, d.data]); setNewMessage(''); } } catch (e) { console.error(e); } finally { setIsSending(false); } };
    useEffect(() => { const n = localStorage.getItem(`roots-lesson-${lessonData.lessonNumber}-notes`); if (n) setNotes(n); }, [lessonData.lessonNumber]);
    const handleNotesChange = (v: string) => { setNotes(v); localStorage.setItem(`roots-lesson-${lessonData.lessonNumber}-notes`, v); };

    const sections = [
        {
            id: 0, title: 'Welcome', type: 'content',
            content: (
                <>
                    <div style={{ display: 'flex', gap: 20, marginBottom: 32, padding: 24, background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)', borderRadius: 16, border: '1px solid #dee2e6' }}>
                        <div style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, border: `3px solid ${accentColor}` }}>
                            <Image src="/coaches/sarah-coach.webp" alt="Sarah" width={72} height={72} style={{ objectFit: 'cover' }} />
                        </div>
                        <div>
                            <p style={{ margin: 0, lineHeight: 1.7 }}>
                                I see you. You became a healthcare worker because you wanted to <strong style={{ color: brandColor }}>truly help people heal</strong>.
                                But somewhere along the way, the system started breaking <em>you</em>. The impossible patient loads. The rushed visits.
                                The feeling that you're treating charts, not humans.
                            </p>
                        </div>
                    </div>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 24 }}>🌱</span> Welcome to R.O.O.T.S.
                    </h3>
                    <p>You're about to learn a proprietary method that has transformed <strong style={{ color: brandColor }}>thousands of burned-out healthcare professionals</strong> into thriving practitioners who:</p>
                    <ul style={{ paddingLeft: 20, margin: '16px 0' }}>
                        <li>Work <strong>fewer hours</strong> than they did in clinical settings</li>
                        <li>Earn <strong>more money</strong> with greater flexibility</li>
                        <li>Actually see their clients <strong>get better</strong></li>
                        <li>Rediscover <strong>why they went into healthcare</strong> in the first place</li>
                    </ul>
                </>
            ),
        },
        {
            id: 1, title: 'The Burnout Epidemic', type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>You're Not Alone — This Is an Epidemic</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '24px 0' }}>
                        {[
                            { stat: '63%', label: 'of nurses report burnout' },
                            { stat: '54%', label: 'of physicians are burned out' },
                            { stat: '400+', label: 'physicians die by suicide yearly' },
                            { stat: '500K', label: 'nurses leave profession by 2027' },
                        ].map((item, i) => (
                            <div key={i} style={{ padding: 20, background: '#f8f9fa', borderRadius: 12, textAlign: 'center' }}>
                                <div style={{ fontSize: 28, fontWeight: 'bold', color: brandColor }}>{item.stat}</div>
                                <div style={{ fontSize: 13, color: '#666', marginTop: 4 }}>{item.label}</div>
                            </div>
                        ))}
                    </div>
                    <p>Burnout isn't a personal failure. It's a <strong style={{ color: brandColor }}>systemic crisis</strong>. And you deserve a way out that doesn't mean abandoning everything you've worked for.</p>
                </>
            ),
        },
        { id: 2, title: 'Quick Check', type: 'quickcheck', question: 'What percentage of nurses report experiencing burnout?', options: ['33%', '45%', '63%', '78%'], correct: '63%', explanation: '63% of nurses report burnout. This epidemic is driving talented healthcare workers to seek new paths—like the R.O.O.T.S. Method.' },
        {
            id: 3, title: 'What R.O.O.T.S. Stands For', type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>The R.O.O.T.S. Method™</h3>
                    <p>This framework is your roadmap from burned-out clinician to thriving practitioner:</p>
                    <div style={{ display: 'grid', gap: 12, margin: '24px 0' }}>
                        {[
                            { letter: 'R', title: 'Recognize the Pattern', desc: 'See what conventional medicine misses' },
                            { letter: 'O', title: 'Find the Origin', desc: 'Trace symptoms to their true source' },
                            { letter: 'O', title: 'Optimize the Foundations', desc: 'The 5 pillars every client needs' },
                            { letter: 'T', title: 'Transform with Coaching', desc: 'Guide lasting behavioral change' },
                            { letter: 'S', title: 'Scale Your Practice', desc: 'Build a profitable, flexible business' },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', gap: 16, padding: 16, background: '#f8f9fa', borderRadius: 12, alignItems: 'center' }}>
                                <div style={{ width: 48, height: 48, borderRadius: 12, background: `linear-gradient(135deg, ${brandColor} 0%, ${accentColor} 100%)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 'bold', flexShrink: 0 }}>{item.letter}</div>
                                <div>
                                    <div style={{ fontWeight: 600, color: '#1a1a1a' }}>{item.title}</div>
                                    <div style={{ fontSize: 14, color: '#666' }}>{item.desc}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ),
        },
        {
            id: 4, title: 'Your Unique Advantage', type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>Why Healthcare Workers Excel at This</h3>
                    <p>You're not starting from zero. Your clinical training gives you <strong style={{ color: brandColor }}>massive advantages</strong>:</p>
                    <div style={{ margin: '20px 0' }}>
                        {['Clinical assessment skills (takes others years to learn)', 'Medical literacy & lab interpretation', 'Patient communication mastery', 'Crisis management under pressure', 'Instant credibility with clients'].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < 4 ? '1px solid #f0f0f0' : 'none' }}>
                                <span style={{ color: accentColor, fontWeight: 600, fontSize: 18 }}>✓</span>
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ background: `linear-gradient(135deg, ${brandColor} 0%, #1a3a2e 100%)`, color: 'white', padding: 24, borderRadius: 12, margin: '24px 0' }}>
                        <p style={{ margin: 0, fontStyle: 'italic' }}>"I was an ICU nurse for 12 years. Within 8 months of learning the R.O.O.T.S. Method, I replaced my nursing income working 20 hours a week from home. Best decision I ever made."</p>
                        <p style={{ margin: '12px 0 0', fontSize: 14, opacity: 0.9 }}>— Jennifer T., RN → Certified R.O.O.T.S. Practitioner</p>
                    </div>
                </>
            ),
        },
        { id: 5, title: 'Quick Check', type: 'quickcheck', question: 'What does the "S" in R.O.O.T.S. stand for?', options: ['Symptoms', 'Science', 'Scale Your Practice', 'Support'], correct: 'Scale Your Practice', explanation: '"S" stands for Scale Your Practice—the crucial step of building a sustainable, profitable business doing what you love.' },
        {
            id: 6, title: 'What You\'ll Learn', type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>Your R.O.O.T.S. Training Journey</h3>
                    <p>Over these 9 lessons, you'll master:</p>
                    <div style={{ background: '#f8f9fa', borderRadius: 12, padding: 20, margin: '20px 0' }}>
                        {allLessons.map((lesson, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 8 ? '1px solid #e9ecef' : 'none' }}>
                                <span style={{ width: 24, height: 24, borderRadius: '50%', background: lesson.current ? brandColor : '#e9ecef', color: lesson.current ? 'white' : '#999', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>{i + 1}</span>
                                <span style={{ color: lesson.current ? brandColor : '#333', fontWeight: lesson.current ? 600 : 400 }}>{lesson.title}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ background: `linear-gradient(135deg, #f8f9fa 0%, #fff 100%)`, border: `2px solid ${accentColor}`, borderRadius: 16, padding: 24, textAlign: 'center', margin: '24px 0' }}>
                        <div style={{ fontSize: 14, color: '#888', marginBottom: 8 }}>Upon completion, you'll receive your</div>
                        <div style={{ fontSize: 22, fontWeight: 'bold', color: brandColor }}>R.O.O.T.S. Method™ Foundation Certificate</div>
                        <div style={{ fontSize: 14, color: '#666', marginTop: 8 }}>Accredited training recognized by 9 professional bodies</div>
                    </div>
                </>
            ),
        },
    ];

    const totalSections = sections.length;
    const progress = Math.round((completedSections.length / totalSections) * 100);
    const moduleProgress = Math.round((lessonData.lessonNumber / lessonData.totalLessons) * 100);
    const handleContinue = () => { if (!completedSections.includes(currentSection)) setCompletedSections([...completedSections, currentSection]); if (currentSection < totalSections - 1) { setCurrentSection(currentSection + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
    const handleQuickCheck = (id: number, a: string) => setQuickCheckAnswers({ ...quickCheckAnswers, [id]: a });
    const handleCheckAnswer = (id: number) => { if (!showAnswers.includes(id)) setShowAnswers([...showAnswers, id]); };
    const currentSectionData = sections[currentSection];
    const isFirstSection = currentSection === 0 && completedSections.length === 0;
    const isLastSection = currentSection === totalSections - 1;
    const isQuickCheck = currentSectionData.type === 'quickcheck';
    const canContinue = isQuickCheck ? showAnswers.includes(currentSectionData.id) : true;
    const getButtonText = () => { if (isFirstSection) return 'Begin Training →'; if (isLastSection) return 'Complete Lesson →'; return 'Continue →'; };
    const formatTime = (d: string) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: 'Georgia, "Times New Roman", serif', color: '#2d2d2d' }}>
            <header style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ maxWidth: 640, margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <Image src="/accredipro-logo-full.jpg" alt="AccrediPro" width={32} height={32} style={{ borderRadius: 6 }} />
                        <div style={{ fontSize: 14, color: 'white', fontWeight: 600 }}>R.O.O.T.S. Method™</div>
                        <div style={{ flex: 1, height: 6, background: 'rgba(255,255,255,0.2)', borderRadius: 3, marginLeft: 12 }}><div style={{ height: '100%', width: `${moduleProgress}%`, background: accentColor, borderRadius: 3 }} /></div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{lessonData.lessonNumber}/{lessonData.totalLessons}</div>
                        <button onClick={() => setShowLessonNav(!showLessonNav)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer', padding: '6px 10px', borderRadius: 6, color: 'white', fontSize: 12 }}>📋</button>
                    </div>
                    {showLessonNav && (
                        <div style={{ position: 'absolute', right: 24, top: 60, background: 'white', border: '1px solid #e8e8e8', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', padding: 8, zIndex: 200, width: 320 }}>
                            <div style={{ padding: '8px 12px', fontSize: 12, color: '#888', fontWeight: 600, borderBottom: '1px solid #f0f0f0' }}>R.O.O.T.S. Method™ Training</div>
                            {allLessons.map((l) => (
                                <Link key={l.num} href={`/roots-method/lesson-${l.num}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, textDecoration: 'none', background: l.current ? '#f8f9fa' : 'transparent' }}>
                                    <span style={{ width: 22, height: 22, borderRadius: '50%', fontSize: 11, fontWeight: 600, background: l.completed ? brandColor : 'transparent', border: l.completed ? 'none' : '2px solid #ddd', color: l.completed ? 'white' : '#999', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{l.completed ? '✓' : l.num}</span>
                                    <span style={{ fontSize: 13, color: l.current ? brandColor : '#555', fontWeight: l.current ? 600 : 400 }}>{l.title}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: 14, color: 'white' }}>Lesson {lessonData.lessonNumber}</div>
                        <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>{lessonData.readTime}</div>
                    </div>
                </div>
            </header>

            <main style={{ maxWidth: 640, margin: '0 auto', padding: '32px 24px 140px' }}>
                <h1 style={{ fontSize: 26, lineHeight: 1.3, color: '#1a1a1a', marginBottom: 32, fontWeight: 600 }}>{lessonData.title}</h1>
                {currentSectionData.type === 'content' ? (
                    <div style={{ fontSize: 17, lineHeight: 1.9, color: '#333' }}>{currentSectionData.content}</div>
                ) : (
                    <div style={{ background: '#f8f9fa', border: '1px solid #e9ecef', borderRadius: 16, padding: 28 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}><span style={{ fontSize: 22 }}>💡</span><span style={{ fontSize: 14, fontWeight: 600, color: brandColor, textTransform: 'uppercase' }}>Quick Check</span></div>
                        <p style={{ fontSize: 18, fontWeight: 500, marginBottom: 24, color: '#1a1a1a' }}>{currentSectionData.question}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {currentSectionData.options?.map((o: string) => {
                                const sel = quickCheckAnswers[currentSectionData.id] === o;
                                const cor = o === currentSectionData.correct;
                                const show = showAnswers.includes(currentSectionData.id);
                                return (<button key={o} onClick={() => !show && handleQuickCheck(currentSectionData.id, o)} disabled={show} style={{ padding: '18px 20px', border: '2px solid', borderColor: show ? (cor ? '#10B981' : sel ? '#EF4444' : '#e8e8e8') : (sel ? brandColor : '#e8e8e8'), background: show ? (cor ? '#D1FAE5' : sel && !cor ? '#FEE2E2' : '#fff') : (sel ? '#f0f7f4' : '#fff'), borderRadius: 10, cursor: show ? 'default' : 'pointer', textAlign: 'left', fontSize: 16, display: 'flex', alignItems: 'center', gap: 14 }}><span style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid', borderColor: show ? (cor ? '#10B981' : sel ? '#EF4444' : '#ccc') : (sel ? brandColor : '#ccc'), background: show && cor ? '#10B981' : show && sel && !cor ? '#EF4444' : sel && !show ? brandColor : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12 }}>{show && cor && '✓'}{show && sel && !cor && '✗'}</span><span style={{ color: '#333' }}>{o}</span></button>);
                            })}
                        </div>
                        {quickCheckAnswers[currentSectionData.id] && !showAnswers.includes(currentSectionData.id) && (<button onClick={() => handleCheckAnswer(currentSectionData.id)} style={{ marginTop: 24, padding: '16px 24px', background: brandColor, color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: 'pointer', width: '100%' }}>Check Answer</button>)}
                        {showAnswers.includes(currentSectionData.id) && (<div style={{ marginTop: 24, padding: 20, background: quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? '#D1FAE5' : '#FEF3C7', borderRadius: 10 }}><div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><span>{quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? '✅' : '💡'}</span><strong style={{ color: quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? '#065F46' : '#92400E' }}>{quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? 'Correct!' : 'Good try!'}</strong></div><p style={{ margin: 0, fontSize: 15, color: '#333' }}>{currentSectionData.explanation}</p></div>)}
                    </div>
                )}
                <div style={{ marginTop: 40 }}>
                    {!canContinue ? (<p style={{ color: '#888', fontSize: 15, textAlign: 'center' }}>Answer the quick check to continue</p>) : isLastSection && completedSections.length === totalSections - 1 ? (<Link href="/roots-method/lesson-2" style={{ display: 'block', padding: '18px 24px', background: `linear-gradient(135deg, ${brandColor} 0%, #1a3a2e 100%)`, color: 'white', borderRadius: 10, fontSize: 16, fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>Continue to Lesson 2 →</Link>) : (<button onClick={handleContinue} style={{ width: '100%', padding: '18px 24px', background: `linear-gradient(135deg, ${brandColor} 0%, #1a3a2e 100%)`, color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>{getButtonText()}</button>)}
                </div>
            </main>

            <div style={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 12, zIndex: 100 }}>
                <button onClick={() => { setShowNotes(!showNotes); setShowChat(false); }} style={{ width: 56, height: 56, borderRadius: '50%', background: showNotes ? brandColor : 'white', color: showNotes ? 'white' : brandColor, border: `2px solid ${brandColor}`, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📝</button>
                <button onClick={() => { setShowChat(!showChat); setShowNotes(false); }} style={{ width: 56, height: 56, borderRadius: '50%', background: showChat ? brandColor : 'white', color: showChat ? 'white' : brandColor, border: `2px solid ${brandColor}`, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💬</button>
            </div>

            {showNotes && (<div style={{ position: 'fixed', bottom: 100, right: 24, width: 320, background: 'white', border: '1px solid #e8e8e8', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 100 }}><div style={{ padding: 16, background: `linear-gradient(135deg, ${brandColor} 0%, #1a3a2e 100%)`, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '16px 16px 0 0' }}><span style={{ fontWeight: 600 }}>📝 Your Notes</span><button onClick={() => setShowNotes(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: 18 }}>×</button></div><div style={{ padding: 16 }}><textarea value={notes} onChange={(e) => handleNotesChange(e.target.value)} placeholder="Take notes as you learn the R.O.O.T.S. Method..." style={{ width: '100%', height: 200, border: '1px solid #e8e8e8', borderRadius: 8, padding: 12, fontSize: 15, fontFamily: 'inherit', resize: 'none' }} /><div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>Notes save automatically</div></div></div>)}

            {showChat && (<div style={{ position: 'fixed', bottom: 100, right: 24, width: 360, height: 480, background: 'white', border: '1px solid #e8e8e8', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 100, display: 'flex', flexDirection: 'column' }}><div style={{ padding: 16, background: `linear-gradient(135deg, ${brandColor} 0%, #1a3a2e 100%)`, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '16px 16px 0 0' }}><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', border: `2px solid ${accentColor}` }}><Image src="/coaches/sarah-coach.webp" alt="Sarah" width={36} height={36} style={{ objectFit: 'cover' }} /></div><div><div style={{ fontWeight: 600 }}>Chat with Sarah</div><div style={{ fontSize: 11, opacity: 0.8 }}>Your R.O.O.T.S. Coach</div></div></div><button onClick={() => setShowChat(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: 18 }}>×</button></div><div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>{messages.length === 0 ? (<div style={{ textAlign: 'center', color: '#888', padding: '40px 20px' }}><div style={{ fontSize: 32, marginBottom: 12 }}>🌱</div><div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Hi! I'm Sarah</div><div style={{ fontSize: 14 }}>Ask me anything about the R.O.O.T.S. Method or your transition journey!</div></div>) : messages.map((m) => (<div key={m.id} style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', alignItems: m.senderId === currentUserId ? 'flex-end' : 'flex-start' }}><div style={{ maxWidth: '85%', padding: '12px 16px', borderRadius: 16, background: m.senderId === currentUserId ? brandColor : '#f8f9fa', color: m.senderId === currentUserId ? 'white' : '#333' }}><p style={{ margin: 0, fontSize: 15, lineHeight: 1.5 }}>{m.content}</p></div><div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>{formatTime(m.createdAt)}</div></div>))}<div ref={chatEndRef} /></div><div style={{ padding: 16, borderTop: '1px solid #e8e8e8' }}><div style={{ display: 'flex', gap: 8 }}><input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} placeholder="Type your message..." style={{ flex: 1, padding: '12px 16px', border: '1px solid #e8e8e8', borderRadius: 24, fontSize: 15 }} /><button onClick={sendMessage} disabled={!newMessage.trim() || isSending} style={{ width: 44, height: 44, borderRadius: '50%', background: newMessage.trim() && !isSending ? brandColor : '#ccc', color: 'white', border: 'none', cursor: newMessage.trim() && !isSending ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{isSending ? '...' : '→'}</button></div></div></div>)}
        </div>
    );
}
