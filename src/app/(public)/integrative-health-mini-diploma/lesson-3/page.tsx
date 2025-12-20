'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// LESSON 3: The Functional Medicine Model

interface Message { id: string; content: string; senderId: string; receiverId: string; createdAt: string; }

export default function Lesson3Page() {
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

    const lessonData = { module: 1, moduleTitle: 'Foundations of Integrative Health', lessonNumber: 3, totalLessons: 9, title: 'The Functional Medicine Model', readTime: '7 min read' };
    const allLessons = [
        { num: 1, title: 'From Burnout to Purpose', completed: true, current: false },
        { num: 2, title: 'Why Conventional Medicine Falls Short', completed: true, current: false },
        { num: 3, title: 'The Functional Medicine Model', completed: true, current: true },
        { num: 4, title: 'Root Cause vs Symptom Management', completed: false, current: false },
        { num: 5, title: 'The 5 Pillars of Integrative Health', completed: false, current: false },
        { num: 6, title: 'Your Clinical Advantage', completed: false, current: false },
        { num: 7, title: 'Bridging Two Worlds', completed: false, current: false },
        { num: 8, title: 'Case Study: From ER Nurse to Practitioner', completed: false, current: false },
        { num: 9, title: 'Your Transformation Roadmap', completed: false, current: false },
    ];
    const brandColor = '#2D5A4A';
    const brandColorLight = '#3D7A64';

    useEffect(() => { const init = async () => { try { const s = await fetch('/api/auth/session'); const sd = await s.json(); if (sd?.user?.id) setCurrentUserId(sd.user.id); const c = await fetch('/api/coach/assigned'); const cd = await c.json(); if (cd?.coach?.id) setCoachId(cd.coach.id); } catch (e) { console.error(e); } }; init(); }, []);
    useEffect(() => { if (showChat && coachId) { fetchMessages(); pollInterval.current = setInterval(fetchMessages, 5000); } return () => { if (pollInterval.current) clearInterval(pollInterval.current); }; }, [showChat, coachId]);
    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);
    const fetchMessages = async () => { if (!coachId) return; try { const r = await fetch(`/api/messages?userId=${coachId}`); const d = await r.json(); if (d.success) setMessages(d.data); } catch (e) { console.error(e); } };
    const sendMessage = async () => { if (!newMessage.trim() || !coachId || isSending) return; setIsSending(true); try { const r = await fetch('/api/messages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ receiverId: coachId, content: newMessage }) }); const d = await r.json(); if (d.success) { setMessages([...messages, d.data]); setNewMessage(''); } } catch (e) { console.error(e); } finally { setIsSending(false); } };
    useEffect(() => { const n = localStorage.getItem(`ih-lesson-${lessonData.lessonNumber}-notes`); if (n) setNotes(n); }, [lessonData.lessonNumber]);
    const handleNotesChange = (v: string) => { setNotes(v); localStorage.setItem(`ih-lesson-${lessonData.lessonNumber}-notes`, v); };

    const sections = [
        {
            id: 0, title: 'What is Functional Medicine?', type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>A Patient-Centered, Science-Based Approach</h3>
                    <p><strong style={{ color: brandColor }}>Functional Medicine</strong> addresses the underlying causes of disease, using a systems-oriented approach that engages both patient and practitioner in a therapeutic partnership.</p>
                    <div style={{ background: '#f0f7f4', border: `2px solid ${brandColor}`, borderRadius: 12, padding: 24, margin: '24px 0', textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: 18, fontWeight: 500, color: brandColor }}>Conventional: "What drug matches this diagnosis?"</p>
                        <div style={{ fontSize: 24, margin: '12px 0' }}>↓</div>
                        <p style={{ margin: 0, fontSize: 18, fontWeight: 500, color: brandColor }}>Functional: "Why is this person experiencing these symptoms?"</p>
                    </div>
                    <p>This simple shift in questioning changes everything about how we approach patient care.</p>
                </>
            ),
        },
        {
            id: 1, title: 'The Functional Medicine Matrix', type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>Organizing Complexity</h3>
                    <p>The Functional Medicine Matrix organizes clinical imbalances into <strong>7 core physiological systems</strong>:</p>
                    <div style={{ display: 'grid', gap: 12, margin: '24px 0' }}>
                        {[
                            { system: 'Assimilation', desc: 'Digestion, absorption, microbiome' },
                            { system: 'Defense & Repair', desc: 'Immune function, inflammation' },
                            { system: 'Energy', desc: 'Mitochondria, oxidative stress' },
                            { system: 'Biotransformation', desc: 'Toxin elimination, detoxification' },
                            { system: 'Transport', desc: 'Cardiovascular, lymphatic system' },
                            { system: 'Communication', desc: 'Hormones, neurotransmitters' },
                            { system: 'Structural Integrity', desc: 'Cell membranes, musculoskeletal' },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', gap: 16, padding: 16, background: '#f9f9f9', borderRadius: 8 }}>
                                <span style={{ width: 32, height: 32, borderRadius: '50%', background: brandColor, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, flexShrink: 0 }}>{i + 1}</span>
                                <div><strong style={{ color: '#1a1a1a' }}>{item.system}</strong><p style={{ margin: '4px 0 0', fontSize: 15, color: '#555' }}>{item.desc}</p></div>
                            </div>
                        ))}
                    </div>
                    <p>Rather than chasing symptoms, we identify <strong style={{ color: brandColor }}>which systems are out of balance</strong> and address them.</p>
                </>
            ),
        },
        { id: 2, title: 'Quick Check', type: 'quickcheck', question: 'How many core physiological systems does the Functional Medicine Matrix address?', options: ['3', '5', '7', '12'], correct: '7', explanation: 'The Functional Medicine Matrix organizes clinical thinking around 7 core physiological systems, allowing practitioners to identify patterns and interconnections that might otherwise be missed.' },
        {
            id: 3, title: 'The Timeline', type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>Your History Tells the Story</h3>
                    <p>In functional medicine, we create a detailed <strong style={{ color: brandColor }}>timeline</strong> of a patient's life, tracking:</p>
                    <div style={{ margin: '20px 0' }}>
                        {['Antecedents (genetic and early life factors)', 'Triggers (events that initiated symptoms)', 'Mediators (factors keeping symptoms active)', 'Major life events and exposures', 'Medication history', 'Diet and lifestyle changes'].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 5 ? '1px solid #f0f0f0' : 'none' }}>
                                <span style={{ color: brandColor }}>→</span>
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                    <p>Often, patterns emerge that no one has ever connected before. The patient who's been told "there's nothing wrong" finally has an explanation.</p>
                </>
            ),
        },
        {
            id: 4, title: 'Therapeutic Partnership', type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>Patient as Partner, Not Passive Recipient</h3>
                    <p>Perhaps the most transformative aspect of functional medicine is the <strong style={{ color: brandColor }}>relationship</strong>.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, margin: '24px 0' }}>
                        <div style={{ padding: 20, background: '#fee', borderRadius: 12 }}>
                            <div style={{ fontWeight: 600, color: '#c00', marginBottom: 12 }}>Conventional Model</div>
                            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15 }}>
                                <li>Doctor is expert</li>
                                <li>Patient follows orders</li>
                                <li>7-minute visits</li>
                                <li>Limited patient input</li>
                            </ul>
                        </div>
                        <div style={{ padding: 20, background: '#efe', borderRadius: 12 }}>
                            <div style={{ fontWeight: 600, color: brandColor, marginBottom: 12 }}>Functional Model</div>
                            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 15 }}>
                                <li>Partnership approach</li>
                                <li>Patient actively participates</li>
                                <li>60-90 minute sessions</li>
                                <li>Collaborative goal-setting</li>
                            </ul>
                        </div>
                    </div>
                    <p>This is why patients <em>love</em> functional medicine practitioners—they finally feel <strong>heard</strong>.</p>
                </>
            ),
        },
        { id: 5, title: 'Quick Check', type: 'quickcheck', question: 'What are the three categories tracked on a functional medicine timeline?', options: ['Symptoms, Diagnoses, Treatments', 'Antecedents, Triggers, Mediators', 'Diet, Exercise, Sleep', 'Past, Present, Future'], correct: 'Antecedents, Triggers, Mediators', explanation: 'Antecedents, Triggers, and Mediators (ATM) help identify what predisposed someone to illness, what initiated it, and what keeps it going.' },
        {
            id: 6, title: 'Evidence-Based', type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>Grounded in Science</h3>
                    <p>Functional medicine isn't "alternative medicine." It's <strong style={{ color: brandColor }}>the future of medicine</strong>, grounded in:</p>
                    <div style={{ margin: '20px 0' }}>
                        {['Peer-reviewed research', 'Systems biology', 'Nutrigenomics', 'Epigenetics', 'Microbiome science', 'Psychoneuroimmunology'].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: i < 5 ? '1px solid #f0f0f0' : 'none' }}>
                                <span style={{ color: brandColor, fontWeight: 600 }}>✓</span>
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ background: brandColor, color: 'white', padding: 24, borderRadius: 12, margin: '24px 0' }}>
                        <p style={{ margin: 0, fontStyle: 'italic' }}>"Functional medicine represents the most comprehensive, scientifically-grounded approach to chronic disease that we have today."</p>
                        <p style={{ margin: '12px 0 0', fontSize: 14, opacity: 0.9 }}>— Dr. Mark Hyman, Cleveland Clinic Center for Functional Medicine</p>
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
    const getButtonText = () => { if (isFirstSection) return 'Start Lesson →'; if (isLastSection) return 'Complete Lesson →'; return 'Continue →'; };
    const formatTime = (d: string) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: 'Georgia, "Times New Roman", serif', color: '#2d2d2d' }}>
            <header style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ maxWidth: 640, margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <div style={{ fontSize: 12, color: '#888' }}>Module 1</div>
                        <div style={{ flex: 1, height: 6, background: '#f0f0f0', borderRadius: 3 }}><div style={{ height: '100%', width: `${moduleProgress}%`, background: '#D4AF37', borderRadius: 3 }} /></div>
                        <div style={{ fontSize: 12, color: '#888' }}>{lessonData.lessonNumber}/{lessonData.totalLessons}</div>
                        <button onClick={() => setShowLessonNav(!showLessonNav)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>📋</button>
                    </div>
                    {showLessonNav && (<div style={{ position: 'absolute', right: 24, top: 50, background: 'white', border: '1px solid #e8e8e8', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', padding: 8, zIndex: 200, width: 300 }}><div style={{ padding: '8px 12px', fontSize: 12, color: '#888', fontWeight: 600, borderBottom: '1px solid #f0f0f0' }}>Module 1: Foundations</div>{allLessons.map((l) => (<Link key={l.num} href={`/integrative-health-mini-diploma/lesson-${l.num}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, textDecoration: 'none', background: l.current ? '#f0f7f4' : 'transparent' }}><span style={{ width: 20, height: 20, borderRadius: '50%', fontSize: 11, fontWeight: 600, background: l.completed ? brandColor : 'transparent', border: l.completed ? 'none' : '2px solid #ddd', color: l.completed ? 'white' : '#999', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{l.completed ? '✓' : l.num}</span><span style={{ fontSize: 14, color: l.current ? brandColor : '#555', fontWeight: l.current ? 600 : 400 }}>{l.title}</span></Link>))}</div>)}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div style={{ fontSize: 15, fontWeight: 600 }}>Lesson {lessonData.lessonNumber}</div><div style={{ fontSize: 13, color: '#888' }}>{lessonData.readTime}</div></div>
                    <div style={{ marginTop: 12 }}><div style={{ height: 10, background: '#f0f0f0', borderRadius: 5 }}><div style={{ height: '100%', width: `${Math.max(progress, 3)}%`, background: `linear-gradient(90deg, ${brandColor}, ${brandColorLight})`, borderRadius: 5 }} /></div><div style={{ fontSize: 12, color: '#666', marginTop: 6, textAlign: 'right' }}>{progress}%</div></div>
                </div>
            </header>
            <main style={{ maxWidth: 640, margin: '0 auto', padding: '32px 24px 140px' }}>
                <h1 style={{ fontSize: 26, lineHeight: 1.3, color: '#1a1a1a', marginBottom: 32, fontWeight: 600 }}>{lessonData.title}</h1>
                {currentSectionData.type === 'content' ? (<div style={{ fontSize: 17, lineHeight: 1.9, color: '#333' }}>{currentSectionData.content}</div>) : (
                    <div style={{ background: '#f0f7f4', border: '1px solid #d4e8df', borderRadius: 16, padding: 28 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}><span style={{ fontSize: 22 }}>💡</span><span style={{ fontSize: 14, fontWeight: 600, color: brandColor, textTransform: 'uppercase' }}>Quick Check</span></div>
                        <p style={{ fontSize: 18, fontWeight: 500, marginBottom: 24, color: '#1a1a1a' }}>{currentSectionData.question}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{currentSectionData.options?.map((o: string) => { const sel = quickCheckAnswers[currentSectionData.id] === o; const cor = o === currentSectionData.correct; const show = showAnswers.includes(currentSectionData.id); return (<button key={o} onClick={() => !show && handleQuickCheck(currentSectionData.id, o)} disabled={show} style={{ padding: '18px 20px', border: '2px solid', borderColor: show ? (cor ? '#10B981' : sel ? '#EF4444' : '#e8e8e8') : (sel ? brandColor : '#e8e8e8'), background: show ? (cor ? '#D1FAE5' : sel && !cor ? '#FEE2E2' : '#fff') : (sel ? '#f0f7f4' : '#fff'), borderRadius: 10, cursor: show ? 'default' : 'pointer', textAlign: 'left', fontSize: 16, display: 'flex', alignItems: 'center', gap: 14 }}><span style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid', borderColor: show ? (cor ? '#10B981' : sel ? '#EF4444' : '#ccc') : (sel ? brandColor : '#ccc'), background: show && cor ? '#10B981' : show && sel && !cor ? '#EF4444' : sel && !show ? brandColor : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12 }}>{show && cor && '✓'}{show && sel && !cor && '✗'}</span><span style={{ color: '#333' }}>{o}</span></button>); })}</div>
                        {quickCheckAnswers[currentSectionData.id] && !showAnswers.includes(currentSectionData.id) && (<button onClick={() => handleCheckAnswer(currentSectionData.id)} style={{ marginTop: 24, padding: '16px 24px', background: brandColor, color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: 'pointer', width: '100%' }}>Check Answer</button>)}
                        {showAnswers.includes(currentSectionData.id) && (<div style={{ marginTop: 24, padding: 20, background: quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? '#D1FAE5' : '#FEF3C7', borderRadius: 10 }}><div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><span>{quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? '✅' : '💡'}</span><strong style={{ color: quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? '#065F46' : '#92400E' }}>{quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? 'Correct!' : 'Good try!'}</strong></div><p style={{ margin: 0, fontSize: 15, color: '#333' }}>{currentSectionData.explanation}</p></div>)}
                    </div>
                )}
                <div style={{ marginTop: 40 }}>{!canContinue ? (<p style={{ color: '#888', fontSize: 15, textAlign: 'center' }}>Answer the quick check to continue</p>) : isLastSection && completedSections.length === totalSections - 1 ? (<Link href="/integrative-health-mini-diploma/lesson-4" style={{ display: 'block', padding: '18px 24px', background: brandColor, color: 'white', borderRadius: 10, fontSize: 16, fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>Continue to Lesson 4 →</Link>) : (<button onClick={handleContinue} style={{ width: '100%', padding: '18px 24px', background: brandColor, color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>{getButtonText()}</button>)}</div>
                <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #e8e8e8' }}><h3 style={{ fontSize: 13, fontWeight: 600, color: '#888', textTransform: 'uppercase', marginBottom: 16 }}>Lesson Progress</h3><div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>{sections.filter(s => s.type === 'content').map((s) => { const comp = completedSections.includes(s.id); const curr = currentSection === s.id || (currentSectionData.type === 'quickcheck' && sections[currentSection - 1]?.id === s.id); return (<div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, background: curr ? '#f0f7f4' : 'transparent' }}><span style={{ width: 22, height: 22, borderRadius: '50%', background: comp ? brandColor : curr ? brandColor : 'transparent', border: comp || curr ? 'none' : '2px solid #ddd', color: comp || curr ? 'white' : '#bbb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>{comp ? '✓' : curr ? '●' : '○'}</span><span style={{ fontSize: 15, color: curr ? brandColor : comp ? '#333' : '#999', fontWeight: curr ? 600 : 400 }}>{s.title}</span></div>); })}</div></div>
            </main>
            <div style={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 12, zIndex: 100 }}>
                <button onClick={() => { setShowNotes(!showNotes); setShowChat(false); }} style={{ width: 56, height: 56, borderRadius: '50%', background: showNotes ? brandColor : 'white', color: showNotes ? 'white' : brandColor, border: `2px solid ${brandColor}`, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📝</button>
                <button onClick={() => { setShowChat(!showChat); setShowNotes(false); }} style={{ width: 56, height: 56, borderRadius: '50%', background: showChat ? brandColor : 'white', color: showChat ? 'white' : brandColor, border: `2px solid ${brandColor}`, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💬</button>
            </div>
            {showNotes && (<div style={{ position: 'fixed', bottom: 100, right: 24, width: 320, background: 'white', border: '1px solid #e8e8e8', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 100 }}><div style={{ padding: 16, background: brandColor, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '16px 16px 0 0' }}><span style={{ fontWeight: 600 }}>📝 Your Notes</span><button onClick={() => setShowNotes(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: 18 }}>×</button></div><div style={{ padding: 16 }}><textarea value={notes} onChange={(e) => handleNotesChange(e.target.value)} placeholder="Take notes..." style={{ width: '100%', height: 200, border: '1px solid #e8e8e8', borderRadius: 8, padding: 12, fontSize: 15, fontFamily: 'inherit', resize: 'none' }} /><div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>Auto-saved</div></div></div>)}
            {showChat && (<div style={{ position: 'fixed', bottom: 100, right: 24, width: 360, height: 480, background: 'white', border: '1px solid #e8e8e8', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 100, display: 'flex', flexDirection: 'column' }}><div style={{ padding: 16, background: brandColor, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '16px 16px 0 0' }}><div style={{ display: 'flex', alignItems: 'center', gap: 12 }}><div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden' }}><Image src="/coaches/sarah-coach.webp" alt="Sarah" width={36} height={36} style={{ objectFit: 'cover' }} /></div><div><div style={{ fontWeight: 600 }}>Chat with Sarah</div><div style={{ fontSize: 11, opacity: 0.8 }}>Synced with portal</div></div></div><button onClick={() => setShowChat(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: 18 }}>×</button></div><div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>{messages.length === 0 ? (<div style={{ textAlign: 'center', color: '#888', padding: '40px 20px' }}><div style={{ fontSize: 32, marginBottom: 12 }}>👋</div><div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Hi! I'm Sarah</div><div style={{ fontSize: 14 }}>Ask me anything about functional medicine!</div></div>) : messages.map((m) => (<div key={m.id} style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', alignItems: m.senderId === currentUserId ? 'flex-end' : 'flex-start' }}><div style={{ maxWidth: '85%', padding: '12px 16px', borderRadius: 16, background: m.senderId === currentUserId ? brandColor : '#f9f9f9', color: m.senderId === currentUserId ? 'white' : '#333' }}><p style={{ margin: 0, fontSize: 15, lineHeight: 1.5 }}>{m.content}</p></div><div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>{formatTime(m.createdAt)}</div></div>))}<div ref={chatEndRef} /></div><div style={{ padding: 16, borderTop: '1px solid #e8e8e8' }}><div style={{ display: 'flex', gap: 8 }}><input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} placeholder="Type..." style={{ flex: 1, padding: '12px 16px', border: '1px solid #e8e8e8', borderRadius: 24, fontSize: 15 }} /><button onClick={sendMessage} disabled={!newMessage.trim() || isSending} style={{ width: 44, height: 44, borderRadius: '50%', background: newMessage.trim() && !isSending ? brandColor : '#ccc', color: 'white', border: 'none', cursor: newMessage.trim() && !isSending ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{isSending ? '...' : '→'}</button></div></div></div>)}
        </div>
    );
}
