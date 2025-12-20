'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

// INTEGRATIVE HEALTH MINI-DIPLOMA - LESSON 1
// Target: Burned-Out Nurses & Licensed Healthcare Workers

interface Message {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    createdAt: string;
}

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

    const lessonData = {
        module: 1,
        moduleTitle: 'Foundations of Integrative Health',
        lessonNumber: 1,
        totalLessons: 9,
        title: 'From Burnout to Purpose: Your New Path',
        readTime: '6 min read',
    };

    const allLessons = [
        { num: 1, title: 'From Burnout to Purpose', completed: true, current: true },
        { num: 2, title: 'Why Conventional Medicine Falls Short', completed: false, current: false },
        { num: 3, title: 'The Functional Medicine Model', completed: false, current: false },
        { num: 4, title: 'Root Cause vs Symptom Management', completed: false, current: false },
        { num: 5, title: 'The 5 Pillars of Integrative Health', completed: false, current: false },
        { num: 6, title: 'Your Clinical Advantage', completed: false, current: false },
        { num: 7, title: 'Bridging Two Worlds', completed: false, current: false },
        { num: 8, title: 'Case Study: From ER Nurse to Practitioner', completed: false, current: false },
        { num: 9, title: 'Your Transformation Roadmap', completed: false, current: false },
    ];

    // Brand color for this diploma - teal/medical green
    const brandColor = '#2D5A4A';
    const brandColorLight = '#3D7A64';

    useEffect(() => {
        const getCoachAndUser = async () => {
            try {
                const sessionRes = await fetch('/api/auth/session');
                const sessionData = await sessionRes.json();
                if (sessionData?.user?.id) setCurrentUserId(sessionData.user.id);
                const coachRes = await fetch('/api/coach/assigned');
                const coachData = await coachRes.json();
                if (coachData?.coach?.id) setCoachId(coachData.coach.id);
            } catch (error) { console.error('Error:', error); }
        };
        getCoachAndUser();
    }, []);

    useEffect(() => {
        if (showChat && coachId) {
            fetchMessages();
            pollInterval.current = setInterval(fetchMessages, 5000);
        }
        return () => { if (pollInterval.current) clearInterval(pollInterval.current); };
    }, [showChat, coachId]);

    useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const fetchMessages = async () => {
        if (!coachId) return;
        try {
            const res = await fetch(`/api/messages?userId=${coachId}`);
            const data = await res.json();
            if (data.success && data.data) setMessages(data.data);
        } catch (error) { console.error('Error:', error); }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !coachId || isSending) return;
        setIsSending(true);
        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ receiverId: coachId, content: newMessage }),
            });
            const data = await res.json();
            if (data.success) { setMessages([...messages, data.data]); setNewMessage(''); }
        } catch (error) { console.error('Error:', error); }
        finally { setIsSending(false); }
    };

    useEffect(() => {
        const savedNotes = localStorage.getItem(`ih-lesson-${lessonData.lessonNumber}-notes`);
        if (savedNotes) setNotes(savedNotes);
    }, [lessonData.lessonNumber]);

    const handleNotesChange = (value: string) => {
        setNotes(value);
        localStorage.setItem(`ih-lesson-${lessonData.lessonNumber}-notes`, value);
    };

    const sections = [
        {
            id: 0,
            title: 'Introduction',
            type: 'content',
            content: (
                <>
                    <div style={{ display: 'flex', gap: 20, marginBottom: 32, padding: 24, background: '#f0f7f4', borderRadius: 12, border: '1px solid #d4e8df' }}>
                        <div style={{ width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', flexShrink: 0, boxShadow: '0 4px 12px rgba(45, 90, 74, 0.2)' }}>
                            <Image src="/coaches/sarah-coach.webp" alt="Sarah" width={72} height={72} style={{ objectFit: 'cover' }} />
                        </div>
                        <div>
                            <p style={{ margin: 0, lineHeight: 1.7 }}>
                                I see you. You became a nurse or healthcare worker because you wanted to <strong style={{ color: brandColor }}>truly help people</strong>.
                                But somewhere along the way, the system started breaking you. The 12-hour shifts. The impossible patient loads.
                                The feeling that you're treating symptoms, not people.
                            </p>
                        </div>
                    </div>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>You're Not Alone</h3>
                    <p>
                        <strong style={{ color: brandColor }}>63% of nurses</strong> report experiencing burnout.
                        But here's what nobody tells you: burnout isn't a sign of weakness. It's a sign that you care deeply
                        and the system isn't designed for people who care.
                    </p>
                    <p>
                        What if there was a way to use your clinical training, your compassion, and your experience—but in
                        a completely different model? One where you have <strong>time</strong> with patients, where you address
                        <strong> root causes</strong>, and where you see people actually get better?
                    </p>
                </>
            ),
        },
        {
            id: 1,
            title: 'The Healthcare Crisis',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>The System Is Broken—You Know It Better Than Anyone</h3>
                    <p>You've seen it firsthand:</p>
                    <div style={{ display: 'grid', gap: 12, margin: '24px 0' }}>
                        {[
                            { stat: '7 minutes', desc: 'Average time doctors spend with patients' },
                            { stat: '70%', desc: 'Of chronic diseases are preventable with lifestyle changes' },
                            { stat: '$4.1 trillion', desc: 'Spent annually on healthcare—mostly managing symptoms' },
                            { stat: '88%', desc: 'Of Americans are metabolically unhealthy' },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', gap: 16, padding: 16, background: '#f9f9f9', borderRadius: 8, alignItems: 'center' }}>
                                <span style={{ fontSize: 24, fontWeight: 'bold', color: brandColor, minWidth: 100 }}>{item.stat}</span>
                                <span style={{ color: '#555' }}>{item.desc}</span>
                            </div>
                        ))}
                    </div>
                    <p>You didn't go into healthcare to be a cog in this machine. You went in to <strong style={{ color: brandColor }}>heal people</strong>.</p>
                </>
            ),
        },
        {
            id: 2,
            title: 'Quick Check',
            type: 'quickcheck',
            question: 'What percentage of chronic diseases are preventable with lifestyle changes?',
            options: ['30%', '50%', '70%', '90%'],
            correct: '70%',
            explanation: '70% of chronic diseases are preventable through lifestyle modifications. This is exactly why integrative health practitioners are so desperately needed—to help people make these changes.',
        },
        {
            id: 3,
            title: 'A Different Path Exists',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>What If You Could Practice Differently?</h3>
                    <p>Imagine a practice where:</p>
                    <div style={{ margin: '24px 0' }}>
                        {[
                            'You spend 60-90 minutes with each client (not 7 minutes)',
                            'You address the ROOT CAUSE, not just prescribe band-aids',
                            'You see people actually get better—not just managed',
                            'You control your schedule (no more mandatory overtime)',
                            'You earn $100-200+ per session, from home',
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: i < 4 ? '1px solid #f0f0f0' : 'none' }}>
                                <span style={{ color: brandColor, fontWeight: 600, fontSize: 16 }}>✓</span>
                                <span style={{ lineHeight: 1.5 }}>{item}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ background: brandColor, color: 'white', padding: 24, borderRadius: 12, margin: '24px 0' }}>
                        <p style={{ margin: 0, fontStyle: 'italic', lineHeight: 1.7 }}>
                            "I was an ER nurse for 15 years. I loved my patients but hated what the system was doing to them—and to me.
                            Now I run my own integrative health practice. I work 25 hours a week, make more than I did as a nurse,
                            and I actually see people heal. This is what I was meant to do."
                        </p>
                        <p style={{ margin: '12px 0 0', fontSize: 14, opacity: 0.9 }}>— Michelle, RN → Certified Integrative Health Practitioner</p>
                    </div>
                </>
            ),
        },
        {
            id: 4,
            title: 'Your Clinical Advantage',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>Your Healthcare Background Is a Superpower</h3>
                    <p>Here's what most people don't realize: as a nurse or healthcare worker, you have <strong style={{ color: brandColor }}>massive advantages</strong> in this field:</p>
                    <div style={{ display: 'grid', gap: 12, margin: '24px 0' }}>
                        {[
                            { title: 'Clinical Assessment Skills', desc: 'You already know how to evaluate patients—something that takes others years to learn' },
                            { title: 'Medical Literacy', desc: 'You understand lab work, medications, and contraindications' },
                            { title: 'Patient Communication', desc: 'You know how to talk to people who are suffering' },
                            { title: 'Crisis Management', desc: 'You stay calm when others panic' },
                            { title: 'Credibility', desc: 'Clients trust healthcare professionals immediately' },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', gap: 16, padding: 16, background: '#f0f7f4', borderRadius: 8, border: '1px solid #d4e8df' }}>
                                <span style={{ width: 32, height: 32, borderRadius: '50%', background: brandColor, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, flexShrink: 0 }}>{i + 1}</span>
                                <div><strong style={{ color: '#1a1a1a' }}>{item.title}</strong><p style={{ margin: '4px 0 0', fontSize: 15, color: '#555' }}>{item.desc}</p></div>
                            </div>
                        ))}
                    </div>
                    <p>You're not starting from zero. You're <strong style={{ color: brandColor }}>adding new tools to an already impressive toolkit</strong>.</p>
                </>
            ),
        },
        {
            id: 5,
            title: 'Quick Check',
            type: 'quickcheck',
            question: 'What percentage of nurses report experiencing burnout?',
            options: ['33%', '45%', '63%', '78%'],
            correct: '63%',
            explanation: '63% of nurses report burnout. This epidemic is driving talented healthcare workers to seek alternative career paths—like integrative health—where they can still help people without sacrificing their own wellbeing.',
        },
        {
            id: 6,
            title: 'What You Will Learn',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>Your Mini-Diploma Journey</h3>
                    <p>Over the next 9 lessons, you'll discover:</p>
                    <div style={{ margin: '20px 0' }}>
                        {[
                            'Why conventional medicine struggles with chronic disease',
                            'The functional medicine model and how it differs',
                            'Root cause analysis vs symptom management',
                            'The 5 pillars of integrative health',
                            'How your clinical background gives you a competitive edge',
                            'How to bridge conventional and integrative approaches',
                            'Real case studies of nurses who made the transition',
                            'Your personal roadmap to becoming certified',
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: i < 7 ? '1px solid #f0f0f0' : 'none' }}>
                                <span style={{ color: brandColor, fontWeight: 600 }}>→</span>
                                <span style={{ lineHeight: 1.5 }}>{item}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ background: 'linear-gradient(135deg, #f0f7f4 0%, #fff 100%)', border: `2px solid ${brandColor}`, borderRadius: 12, padding: 24, textAlign: 'center', margin: '24px 0' }}>
                        <div style={{ fontSize: 14, color: '#888', marginBottom: 8 }}>Upon completion, you'll receive your</div>
                        <div style={{ fontSize: 22, fontWeight: 'bold', color: brandColor }}>Integrative Health Foundation Certificate</div>
                    </div>
                </>
            ),
        },
    ];

    const totalSections = sections.length;
    const progress = Math.round(((completedSections.length) / totalSections) * 100);
    const moduleProgress = Math.round((lessonData.lessonNumber / lessonData.totalLessons) * 100);

    const handleContinue = () => { if (!completedSections.includes(currentSection)) setCompletedSections([...completedSections, currentSection]); if (currentSection < totalSections - 1) { setCurrentSection(currentSection + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
    const handleQuickCheck = (sectionId: number, answer: string) => setQuickCheckAnswers({ ...quickCheckAnswers, [sectionId]: answer });
    const handleCheckAnswer = (sectionId: number) => { if (!showAnswers.includes(sectionId)) setShowAnswers([...showAnswers, sectionId]); };

    const currentSectionData = sections[currentSection];
    const isFirstSection = currentSection === 0 && completedSections.length === 0;
    const isLastSection = currentSection === totalSections - 1;
    const isQuickCheck = currentSectionData.type === 'quickcheck';
    const canContinue = isQuickCheck ? showAnswers.includes(currentSectionData.id) : true;
    const getButtonText = () => { if (isFirstSection) return 'Start Lesson →'; if (isLastSection) return 'Complete Lesson →'; return 'Continue →'; };
    const formatTime = (dateStr: string) => new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
        <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: 'Georgia, "Times New Roman", serif', color: '#2d2d2d' }}>
            {/* Header */}
            <header style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ maxWidth: 640, margin: '0 auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <div style={{ fontSize: 12, color: '#888', whiteSpace: 'nowrap' }}>Module 1</div>
                        <div style={{ flex: 1, height: 6, background: '#f0f0f0', borderRadius: 3 }}><div style={{ height: '100%', width: `${moduleProgress}%`, background: '#D4AF37', borderRadius: 3 }} /></div>
                        <div style={{ fontSize: 12, color: '#888' }}>{lessonData.lessonNumber}/{lessonData.totalLessons}</div>
                        <button onClick={() => setShowLessonNav(!showLessonNav)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}><span style={{ fontSize: 16 }}>📋</span></button>
                    </div>
                    {showLessonNav && (
                        <div style={{ position: 'absolute', right: 24, top: 50, background: 'white', border: '1px solid #e8e8e8', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', padding: 8, zIndex: 200, width: 300 }}>
                            <div style={{ padding: '8px 12px', fontSize: 12, color: '#888', fontWeight: 600, borderBottom: '1px solid #f0f0f0' }}>Module 1: Foundations of Integrative Health</div>
                            {allLessons.map((lesson) => (
                                <Link key={lesson.num} href={`/integrative-health-mini-diploma/lesson-${lesson.num}`} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, textDecoration: 'none', background: lesson.current ? '#f0f7f4' : 'transparent' }}>
                                    <span style={{ width: 20, height: 20, borderRadius: '50%', fontSize: 11, fontWeight: 600, background: lesson.completed ? brandColor : 'transparent', border: lesson.completed ? 'none' : '2px solid #ddd', color: lesson.completed ? 'white' : '#999', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{lesson.completed ? '✓' : lesson.num}</span>
                                    <span style={{ fontSize: 14, color: lesson.current ? brandColor : '#555', fontWeight: lesson.current ? 600 : 400 }}>{lesson.title}</span>
                                </Link>
                            ))}
                        </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>Lesson {lessonData.lessonNumber}</div>
                        <div style={{ fontSize: 13, color: '#888' }}>{lessonData.readTime}</div>
                    </div>
                    <div style={{ marginTop: 12 }}>
                        <div style={{ height: 10, background: '#f0f0f0', borderRadius: 5 }}><div style={{ height: '100%', width: `${Math.max(progress, 3)}%`, background: `linear-gradient(90deg, ${brandColor}, ${brandColorLight})`, borderRadius: 5 }} /></div>
                        <div style={{ fontSize: 12, color: '#666', marginTop: 6, textAlign: 'right' }}>{progress}%</div>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main style={{ maxWidth: 640, margin: '0 auto', padding: '32px 24px 140px' }}>
                <h1 style={{ fontSize: 26, lineHeight: 1.3, color: '#1a1a1a', marginBottom: 32, fontWeight: 600 }}>{lessonData.title}</h1>
                {currentSectionData.type === 'content' ? (
                    <div style={{ fontSize: 17, lineHeight: 1.9, color: '#333' }}>{currentSectionData.content}</div>
                ) : (
                    <div style={{ background: '#f0f7f4', border: '1px solid #d4e8df', borderRadius: 16, padding: 28 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}><span style={{ fontSize: 22 }}>💡</span><span style={{ fontSize: 14, fontWeight: 600, color: brandColor, textTransform: 'uppercase' }}>Quick Check</span></div>
                        <p style={{ fontSize: 18, fontWeight: 500, marginBottom: 24, color: '#1a1a1a' }}>{currentSectionData.question}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {currentSectionData.options?.map((option: string) => {
                                const isSelected = quickCheckAnswers[currentSectionData.id] === option;
                                const isCorrect = option === currentSectionData.correct;
                                const showResult = showAnswers.includes(currentSectionData.id);
                                return (<button key={option} onClick={() => !showResult && handleQuickCheck(currentSectionData.id, option)} disabled={showResult} style={{ padding: '18px 20px', border: '2px solid', borderColor: showResult ? (isCorrect ? '#10B981' : isSelected ? '#EF4444' : '#e8e8e8') : (isSelected ? brandColor : '#e8e8e8'), background: showResult ? (isCorrect ? '#D1FAE5' : isSelected && !isCorrect ? '#FEE2E2' : '#fff') : (isSelected ? '#f0f7f4' : '#fff'), borderRadius: 10, cursor: showResult ? 'default' : 'pointer', textAlign: 'left', fontSize: 16, display: 'flex', alignItems: 'center', gap: 14 }}><span style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid', borderColor: showResult ? (isCorrect ? '#10B981' : isSelected ? '#EF4444' : '#ccc') : (isSelected ? brandColor : '#ccc'), background: showResult && isCorrect ? '#10B981' : showResult && isSelected && !isCorrect ? '#EF4444' : isSelected && !showResult ? brandColor : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12 }}>{showResult && isCorrect && '✓'}{showResult && isSelected && !isCorrect && '✗'}</span><span style={{ color: '#333' }}>{option}</span></button>);
                            })}
                        </div>
                        {quickCheckAnswers[currentSectionData.id] && !showAnswers.includes(currentSectionData.id) && (<button onClick={() => handleCheckAnswer(currentSectionData.id)} style={{ marginTop: 24, padding: '16px 24px', background: brandColor, color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: 'pointer', width: '100%' }}>Check Answer</button>)}
                        {showAnswers.includes(currentSectionData.id) && (<div style={{ marginTop: 24, padding: 20, background: quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? '#D1FAE5' : '#FEF3C7', borderRadius: 10 }}><div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><span>{quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? '✅' : '💡'}</span><strong style={{ color: quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? '#065F46' : '#92400E' }}>{quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? 'Correct!' : 'Good try!'}</strong></div><p style={{ margin: 0, fontSize: 15, color: '#333' }}>{currentSectionData.explanation}</p></div>)}
                    </div>
                )}
                <div style={{ marginTop: 40 }}>
                    {!canContinue ? (<p style={{ color: '#888', fontSize: 15, textAlign: 'center' }}>Answer the quick check to continue</p>) : isLastSection && completedSections.length === totalSections - 1 ? (<Link href="/integrative-health-mini-diploma/lesson-2" style={{ display: 'block', padding: '18px 24px', background: brandColor, color: 'white', borderRadius: 10, fontSize: 16, fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>Continue to Lesson 2 →</Link>) : (<button onClick={handleContinue} style={{ width: '100%', padding: '18px 24px', background: brandColor, color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>{getButtonText()}</button>)}
                </div>
                <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #e8e8e8' }}>
                    <h3 style={{ fontSize: 13, fontWeight: 600, color: '#888', textTransform: 'uppercase', marginBottom: 16 }}>Lesson Progress</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {sections.filter(s => s.type === 'content').map((section) => {
                            const isCompleted = completedSections.includes(section.id);
                            const isCurrent = currentSection === section.id || (currentSectionData.type === 'quickcheck' && sections[currentSection - 1]?.id === section.id);
                            return (<div key={section.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, background: isCurrent ? '#f0f7f4' : 'transparent' }}><span style={{ width: 22, height: 22, borderRadius: '50%', background: isCompleted ? brandColor : isCurrent ? brandColor : 'transparent', border: isCompleted || isCurrent ? 'none' : '2px solid #ddd', color: isCompleted || isCurrent ? 'white' : '#bbb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>{isCompleted ? '✓' : isCurrent ? '●' : '○'}</span><span style={{ fontSize: 15, color: isCurrent ? brandColor : isCompleted ? '#333' : '#999', fontWeight: isCurrent ? 600 : 400 }}>{section.title}</span></div>);
                        })}
                    </div>
                </div>
            </main>

            {/* Floating Buttons */}
            <div style={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 12, zIndex: 100 }}>
                <button onClick={() => { setShowNotes(!showNotes); setShowChat(false); }} style={{ width: 56, height: 56, borderRadius: '50%', background: showNotes ? brandColor : 'white', color: showNotes ? 'white' : brandColor, border: `2px solid ${brandColor}`, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>📝</button>
                <button onClick={() => { setShowChat(!showChat); setShowNotes(false); }} style={{ width: 56, height: 56, borderRadius: '50%', background: showChat ? brandColor : 'white', color: showChat ? 'white' : brandColor, border: `2px solid ${brandColor}`, boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>💬</button>
            </div>

            {/* Notes Panel */}
            {showNotes && (
                <div style={{ position: 'fixed', bottom: 100, right: 24, width: 320, background: 'white', border: '1px solid #e8e8e8', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 100 }}>
                    <div style={{ padding: 16, background: brandColor, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '16px 16px 0 0' }}>
                        <span style={{ fontWeight: 600 }}>📝 Your Notes</span>
                        <button onClick={() => setShowNotes(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: 18 }}>×</button>
                    </div>
                    <div style={{ padding: 16 }}>
                        <textarea value={notes} onChange={(e) => handleNotesChange(e.target.value)} placeholder="Take notes as you learn..." style={{ width: '100%', height: 200, border: '1px solid #e8e8e8', borderRadius: 8, padding: 12, fontSize: 15, fontFamily: 'inherit', resize: 'none' }} />
                        <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>Notes save automatically</div>
                    </div>
                </div>
            )}

            {/* Synced Chat Panel */}
            {showChat && (
                <div style={{ position: 'fixed', bottom: 100, right: 24, width: 360, height: 480, background: 'white', border: '1px solid #e8e8e8', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 100, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ padding: 16, background: brandColor, color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '16px 16px 0 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden' }}>
                                <Image src="/coaches/sarah-coach.webp" alt="Sarah" width={36} height={36} style={{ objectFit: 'cover' }} />
                            </div>
                            <div>
                                <div style={{ fontWeight: 600 }}>Chat with Sarah</div>
                                <div style={{ fontSize: 11, opacity: 0.8 }}>Messages sync with your portal</div>
                            </div>
                        </div>
                        <button onClick={() => setShowChat(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: 18 }}>×</button>
                    </div>
                    <div style={{ flex: 1, overflowY: 'auto', padding: 16 }}>
                        {messages.length === 0 ? (
                            <div style={{ textAlign: 'center', color: '#888', padding: '40px 20px' }}>
                                <div style={{ fontSize: 32, marginBottom: 12 }}>👋</div>
                                <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>Hi! I'm Sarah</div>
                                <div style={{ fontSize: 14 }}>I know the healthcare system inside and out. Ask me anything about transitioning to integrative health!</div>
                            </div>
                        ) : (
                            messages.map((msg) => {
                                const isFromMe = msg.senderId === currentUserId;
                                return (
                                    <div key={msg.id} style={{ marginBottom: 16, display: 'flex', flexDirection: 'column', alignItems: isFromMe ? 'flex-end' : 'flex-start' }}>
                                        <div style={{ maxWidth: '85%', padding: '12px 16px', borderRadius: 16, background: isFromMe ? brandColor : '#f9f9f9', color: isFromMe ? 'white' : '#333' }}>
                                            <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5 }}>{msg.content}</p>
                                        </div>
                                        <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>{formatTime(msg.createdAt)}</div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={chatEndRef} />
                    </div>
                    <div style={{ padding: 16, borderTop: '1px solid #e8e8e8' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendMessage()} placeholder="Type your message..." style={{ flex: 1, padding: '12px 16px', border: '1px solid #e8e8e8', borderRadius: 24, fontSize: 15 }} />
                            <button onClick={sendMessage} disabled={!newMessage.trim() || isSending} style={{ width: 44, height: 44, borderRadius: '50%', background: newMessage.trim() && !isSending ? brandColor : '#ccc', color: 'white', border: 'none', cursor: newMessage.trim() && !isSending ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                                {isSending ? '...' : '→'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
