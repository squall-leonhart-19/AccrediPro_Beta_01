'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

// OPTIMIZED LESSON TEMPLATE v4
// Features: Notes, Ask Coach, Module Progress, Lesson Nav, Quick Checks

export default function LessonPage() {
    const [currentSection, setCurrentSection] = useState(0);
    const [completedSections, setCompletedSections] = useState<number[]>([]);
    const [quickCheckAnswers, setQuickCheckAnswers] = useState<{ [key: number]: string | null }>({});
    const [showAnswers, setShowAnswers] = useState<number[]>([]);
    const [notes, setNotes] = useState('');
    const [showNotes, setShowNotes] = useState(false);
    const [showAskCoach, setShowAskCoach] = useState(false);
    const [coachQuestion, setCoachQuestion] = useState('');
    const [questionSent, setQuestionSent] = useState(false);
    const [showLessonNav, setShowLessonNav] = useState(false);

    // Lesson metadata
    const lessonData = {
        module: 1,
        moduleTitle: 'Introduction to Gut Health',
        lessonNumber: 1,
        totalLessons: 9,
        title: 'Your Gut Health Foundation Starts Here',
        readTime: '5 min read',
    };

    // All lessons in module for navigation
    const allLessons = [
        { num: 1, title: 'Your Gut Health Foundation', completed: true, current: true },
        { num: 2, title: 'Understanding Your Microbiome', completed: false, current: false },
        { num: 3, title: 'The Gut-Brain Connection', completed: false, current: false },
        { num: 4, title: 'Your Gut & Immune System', completed: false, current: false },
        { num: 5, title: 'Foods That Harm & Heal', completed: false, current: false },
        { num: 6, title: 'Lifestyle Factors', completed: false, current: false },
        { num: 7, title: 'Supplements & Protocols', completed: false, current: false },
        { num: 8, title: 'Case Study: Maria', completed: false, current: false },
        { num: 9, title: 'Your Next Steps', completed: false, current: false },
    ];

    // Load notes from localStorage
    useEffect(() => {
        const savedNotes = localStorage.getItem(`lesson-${lessonData.lessonNumber}-notes`);
        if (savedNotes) setNotes(savedNotes);
    }, [lessonData.lessonNumber]);

    // Save notes to localStorage
    const handleNotesChange = (value: string) => {
        setNotes(value);
        localStorage.setItem(`lesson-${lessonData.lessonNumber}-notes`, value);
    };

    // Section content
    const sections = [
        {
            id: 0,
            title: 'Introduction',
            type: 'content',
            content: (
                <>
                    <div style={{
                        display: 'flex',
                        gap: 20,
                        marginBottom: 32,
                        padding: 24,
                        background: '#fdfbf7',
                        borderRadius: 12,
                        border: '1px solid #e8e4e0',
                    }}>
                        <div style={{
                            width: 72,
                            height: 72,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #722F37 0%, #8B4049 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: 28,
                            fontWeight: 600,
                            flexShrink: 0,
                            boxShadow: '0 4px 12px rgba(114, 47, 55, 0.2)',
                        }}>S</div>
                        <div>
                            <p style={{ margin: 0, lineHeight: 1.7 }}>
                                Welcome to your certification journey. I'm <strong style={{ color: '#722F37' }}>Sarah</strong>,
                                and I'll be your guide as you learn the foundations of gut health and how to apply
                                this knowledge to help yourself and others.
                            </p>
                        </div>
                    </div>

                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        The Opportunity
                    </h3>
                    <p>
                        Over <strong style={{ color: '#722F37' }}>70 million Americans</strong> suffer from
                        digestive issues—more than California and Texas combined.
                    </p>
                    <p>
                        Many have been told their symptoms are "normal" or dismissed entirely. This creates a
                        <strong> tremendous opportunity</strong> for educated practitioners who actually understand
                        what's happening in the gut.
                    </p>
                </>
            ),
        },
        {
            id: 1,
            title: 'The Gut-Body Connection',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        Here's What Most People Don't Realize
                    </h3>
                    <p>
                        The gut isn't just about digestion. It's connected to <em>everything</em>.
                    </p>
                    <p>
                        Your gut is often called the <strong style={{ color: '#722F37' }}>"second brain"</strong> for
                        good reason. It contains over <strong>500 million neurons</strong>—more than your spinal
                        cord—and has its own nervous system called the Enteric Nervous System.
                    </p>

                    <div style={{
                        background: '#f9f9f9',
                        borderLeft: '4px solid #722F37',
                        padding: '20px 24px',
                        borderRadius: '0 8px 8px 0',
                        margin: '24px 0',
                    }}>
                        <p style={{ margin: 0, fontWeight: 500, marginBottom: 12, color: '#1a1a1a' }}>
                            The gut is connected to:
                        </p>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                            <li><strong>70% of your immune system</strong> lives in your gut</li>
                            <li><strong>95% of serotonin</strong> (the "happiness hormone") is made here</li>
                            <li>Your <strong>hormones and metabolism</strong></li>
                            <li>Your <strong>skin, joints, and energy levels</strong></li>
                        </ul>
                    </div>

                    <p>
                        When clients come to you with fatigue, brain fog, skin issues, or hormonal imbalances—
                        <strong style={{ color: '#722F37' }}>the gut is often where we need to look first</strong>.
                    </p>
                </>
            ),
        },
        {
            id: 2,
            title: 'Quick Check',
            type: 'quickcheck',
            question: 'What percentage of serotonin (the "happiness hormone") is produced in the gut?',
            options: ['50%', '75%', '95%', '100%'],
            correct: '95%',
            explanation: 'Correct! 95% of serotonin is produced in the gut. This is why gut health directly affects mood, mental clarity, and overall wellbeing.',
        },
        {
            id: 3,
            title: 'Why Women 40+ Are Especially Affected',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        Why This Matters for Women Over 40
                    </h3>
                    <p>
                        If you're a woman over 40, you may have noticed your digestion isn't what it used to be.
                        There's a <strong>physiological reason</strong> for this.
                    </p>

                    <div style={{ display: 'grid', gap: 12, margin: '24px 0' }}>
                        {[
                            { title: 'Hormonal shifts', desc: 'Directly impact gut motility and microbiome balance' },
                            { title: 'Accumulated stress', desc: 'Decades of stress affect the gut-brain axis' },
                            { title: 'Environmental factors', desc: 'Antibiotics, processed foods, and toxins take their toll' },
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', gap: 16, padding: 16, background: '#f9f9f9', borderRadius: 8 }}>
                                <span style={{ width: 32, height: 32, borderRadius: '50%', background: '#722F37', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600, flexShrink: 0 }}>{i + 1}</span>
                                <div>
                                    <strong style={{ color: '#1a1a1a' }}>{item.title}</strong>
                                    <p style={{ margin: '4px 0 0', fontSize: 15, color: '#555' }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p>
                        Understanding these connections allows you to address <strong style={{ color: '#722F37' }}>root
                            causes</strong> rather than just managing symptoms—both for yourself and for future clients.
                    </p>
                </>
            ),
        },
        {
            id: 4,
            title: 'The Practitioner Opportunity',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        Your Opportunity as a Practitioner
                    </h3>
                    <p>
                        You <strong>don't need a medical degree</strong> to make a profound difference in people's
                        health. What you need is the right training—and that's exactly what this certification provides.
                    </p>

                    <div style={{ background: 'linear-gradient(135deg, #fdfbf7 0%, #fff 100%)', border: '2px solid #722F37', borderRadius: 12, padding: 24, textAlign: 'center', margin: '24px 0' }}>
                        <div style={{ fontSize: 36, fontWeight: 'bold', color: '#722F37' }}>$5,000 - $15,000</div>
                        <div style={{ fontSize: 15, color: '#666', marginTop: 8 }}>Monthly earning potential</div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, margin: '24px 0' }}>
                        {[
                            { label: 'Per Session', value: '$100-200' },
                            { label: 'Per Program', value: '$500-2,500' },
                            { label: 'Clients/Month', value: '5-15' },
                            { label: 'Work From', value: 'Home' },
                        ].map((item, i) => (
                            <div key={i} style={{ background: '#f9f9f9', padding: 16, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: '#666', fontSize: 14 }}>{item.label}</span>
                                <strong style={{ color: '#722F37' }}>{item.value}</strong>
                            </div>
                        ))}
                    </div>
                </>
            ),
        },
        {
            id: 5,
            title: 'Quick Check',
            type: 'quickcheck',
            question: 'How many Americans suffer from digestive issues?',
            options: ['10 Million', '35 Million', '70 Million', '100 Million'],
            correct: '70 Million',
            explanation: `Over 70 million Americans suffer from digestive issues—that's more than California and Texas combined. This represents a massive opportunity for certified practitioners.`,
        },
        {
            id: 6,
            title: `What You'll Learn`,
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        What You'll Learn in This Mini-Diploma
                    </h3>
                    <p>By the end of this certification, you'll understand:</p>

                    <div style={{ margin: '20px 0' }}>
                        {[
                            'Why gut health is the foundation of everything else',
                            'The gut-body connections most practitioners miss',
                            'Why women 40+ are especially affected',
                            'The massive opportunity for practitioners in this space',
                            'Your first action steps to start applying this knowledge',
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: i < 4 ? '1px solid #f0f0f0' : 'none' }}>
                                <span style={{ color: '#722F37', fontWeight: 600, fontSize: 16 }}>✓</span>
                                <span style={{ lineHeight: 1.5 }}>{item}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ background: '#722F37', color: 'white', padding: 24, borderRadius: 12, margin: '24px 0' }}>
                        <p style={{ margin: 0, fontWeight: 500, lineHeight: 1.7, fontStyle: 'italic' }}>
                            "The gut is the gateway to health. When you understand how to restore gut function,
                            you understand how to restore overall wellness."
                        </p>
                        <p style={{ margin: '12px 0 0', fontSize: 14, opacity: 0.9 }}>— Sarah</p>
                    </div>

                    <p style={{ color: '#555' }}>
                        Ready to learn why gut health is the foundation of everything else? Let's dive in.
                    </p>
                </>
            ),
        },
    ];

    const totalSections = sections.length;
    const progress = Math.round(((completedSections.length) / totalSections) * 100);
    const moduleProgress = Math.round((lessonData.lessonNumber / lessonData.totalLessons) * 100);

    const handleContinue = () => {
        if (!completedSections.includes(currentSection)) {
            setCompletedSections([...completedSections, currentSection]);
        }
        if (currentSection < totalSections - 1) {
            setCurrentSection(currentSection + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleQuickCheck = (sectionId: number, answer: string) => {
        setQuickCheckAnswers({ ...quickCheckAnswers, [sectionId]: answer });
    };

    const handleCheckAnswer = (sectionId: number) => {
        if (!showAnswers.includes(sectionId)) {
            setShowAnswers([...showAnswers, sectionId]);
        }
    };

    const handleSendQuestion = () => {
        if (coachQuestion.trim()) {
            // In production, this would send to your chat/messaging system
            setQuestionSent(true);
            setTimeout(() => {
                setShowAskCoach(false);
                setCoachQuestion('');
                setQuestionSent(false);
            }, 2000);
        }
    };

    const currentSectionData = sections[currentSection];
    const isFirstSection = currentSection === 0 && completedSections.length === 0;
    const isLastSection = currentSection === totalSections - 1;
    const isQuickCheck = currentSectionData.type === 'quickcheck';
    const canContinue = isQuickCheck ? showAnswers.includes(currentSectionData.id) : true;

    const getButtonText = () => {
        if (isFirstSection) return 'Start Lesson →';
        if (isLastSection) return 'Complete Lesson →';
        return 'Continue →';
    };

    return (
        <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: 'Georgia, "Times New Roman", serif', color: '#2d2d2d' }}>
            {/* Fixed Header with Module Progress */}
            <header style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '16px 24px', position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ maxWidth: 640, margin: '0 auto' }}>
                    {/* Module Progress Bar */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                        <div style={{ fontSize: 12, color: '#888', whiteSpace: 'nowrap' }}>Module 1</div>
                        <div style={{ flex: 1, height: 6, background: '#f0f0f0', borderRadius: 3 }}>
                            <div style={{ height: '100%', width: `${moduleProgress}%`, background: '#D4AF37', borderRadius: 3, transition: 'width 0.4s' }} />
                        </div>
                        <div style={{ fontSize: 12, color: '#888' }}>{lessonData.lessonNumber}/{lessonData.totalLessons}</div>
                        <button onClick={() => setShowLessonNav(!showLessonNav)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
                            <span style={{ fontSize: 16 }}>📋</span>
                        </button>
                    </div>

                    {/* Lesson Nav Dropdown */}
                    {showLessonNav && (
                        <div style={{ position: 'absolute', right: 24, top: 50, background: 'white', border: '1px solid #e8e8e8', borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)', padding: 8, zIndex: 200, width: 280 }}>
                            <div style={{ padding: '8px 12px', fontSize: 12, color: '#888', fontWeight: 600, borderBottom: '1px solid #f0f0f0' }}>Module 1: Introduction to Gut Health</div>
                            {allLessons.map((lesson) => (
                                <Link key={lesson.num} href={`/gut-health-mini-diploma/lesson-${lesson.num}`} style={{
                                    display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 8, textDecoration: 'none',
                                    background: lesson.current ? '#f8f4f0' : 'transparent',
                                }}>
                                    <span style={{
                                        width: 20, height: 20, borderRadius: '50%', fontSize: 11, fontWeight: 600,
                                        background: lesson.completed ? '#722F37' : 'transparent',
                                        border: lesson.completed ? 'none' : '2px solid #ddd',
                                        color: lesson.completed ? 'white' : '#999',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>{lesson.completed ? '✓' : lesson.num}</span>
                                    <span style={{ fontSize: 14, color: lesson.current ? '#722F37' : '#555', fontWeight: lesson.current ? 600 : 400 }}>{lesson.title}</span>
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Current Lesson Info */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>Lesson {lessonData.lessonNumber}: {lessonData.title}</div>
                        </div>
                        <div style={{ fontSize: 13, color: '#888' }}>{lessonData.readTime}</div>
                    </div>

                    {/* Lesson Progress Bar */}
                    <div style={{ marginTop: 12 }}>
                        <div style={{ height: 10, background: '#f0f0f0', borderRadius: 5, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${Math.max(progress, 3)}%`, background: 'linear-gradient(90deg, #722F37, #8B4049)', borderRadius: 5, transition: 'width 0.4s ease' }} />
                        </div>
                        <div style={{ fontSize: 12, color: '#666', marginTop: 6, textAlign: 'right' }}>{progress}% complete</div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main style={{ maxWidth: 640, margin: '0 auto', padding: '32px 24px 140px' }}>
                <h1 style={{ fontSize: 26, lineHeight: 1.3, color: '#1a1a1a', marginBottom: 32, fontWeight: 600 }}>{lessonData.title}</h1>

                {/* Content or Quick Check */}
                {currentSectionData.type === 'content' ? (
                    <div style={{ fontSize: 17, lineHeight: 1.9, color: '#333' }}>
                        <style jsx>{`div p { margin-bottom: 20px; } div ul { margin: 20px 0; padding-left: 24px; } div li { margin-bottom: 12px; line-height: 1.7; }`}</style>
                        {currentSectionData.content}
                    </div>
                ) : (
                    <div style={{ background: '#fdfbf7', border: '1px solid #e8e4e0', borderRadius: 16, padding: 28 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                            <span style={{ fontSize: 22 }}>💡</span>
                            <span style={{ fontSize: 14, fontWeight: 600, color: '#722F37', textTransform: 'uppercase', letterSpacing: 0.5 }}>Quick Check</span>
                        </div>
                        <p style={{ fontSize: 18, fontWeight: 500, marginBottom: 24, lineHeight: 1.5, color: '#1a1a1a' }}>{currentSectionData.question}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {currentSectionData.options?.map((option: string) => {
                                const isSelected = quickCheckAnswers[currentSectionData.id] === option;
                                const isCorrect = option === currentSectionData.correct;
                                const showResult = showAnswers.includes(currentSectionData.id);
                                return (
                                    <button key={option} onClick={() => !showResult && handleQuickCheck(currentSectionData.id, option)} disabled={showResult} style={{
                                        padding: '18px 20px', border: '2px solid',
                                        borderColor: showResult ? (isCorrect ? '#10B981' : isSelected ? '#EF4444' : '#e8e8e8') : (isSelected ? '#722F37' : '#e8e8e8'),
                                        background: showResult ? (isCorrect ? '#D1FAE5' : isSelected && !isCorrect ? '#FEE2E2' : '#fff') : (isSelected ? '#f8f4f0' : '#fff'),
                                        borderRadius: 10, cursor: showResult ? 'default' : 'pointer', textAlign: 'left', fontSize: 16, display: 'flex', alignItems: 'center', gap: 14,
                                    }}>
                                        <span style={{
                                            width: 22, height: 22, borderRadius: '50%', border: '2px solid',
                                            borderColor: showResult ? (isCorrect ? '#10B981' : isSelected ? '#EF4444' : '#ccc') : (isSelected ? '#722F37' : '#ccc'),
                                            background: showResult && isCorrect ? '#10B981' : showResult && isSelected && !isCorrect ? '#EF4444' : isSelected && !showResult ? '#722F37' : 'transparent',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, flexShrink: 0,
                                        }}>{showResult && isCorrect && '✓'}{showResult && isSelected && !isCorrect && '✗'}</span>
                                        <span style={{ color: '#333' }}>{option}</span>
                                    </button>
                                );
                            })}
                        </div>
                        {quickCheckAnswers[currentSectionData.id] && !showAnswers.includes(currentSectionData.id) && (
                            <button onClick={() => handleCheckAnswer(currentSectionData.id)} style={{ marginTop: 24, padding: '16px 24px', background: '#722F37', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: 'pointer', width: '100%' }}>Check Answer</button>
                        )}
                        {showAnswers.includes(currentSectionData.id) && (
                            <div style={{ marginTop: 24, padding: 20, background: quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? '#D1FAE5' : '#FEF3C7', borderRadius: 10 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                    <span style={{ fontSize: 18 }}>{quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? '✅' : '💡'}</span>
                                    <strong style={{ color: quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? '#065F46' : '#92400E' }}>{quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? 'Correct!' : 'Good try!'}</strong>
                                </div>
                                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: '#333' }}>{currentSectionData.explanation}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Continue Button */}
                <div style={{ marginTop: 40 }}>
                    {!canContinue ? (
                        <p style={{ color: '#888', fontSize: 15, textAlign: 'center' }}>Answer the quick check to continue</p>
                    ) : isLastSection && completedSections.length === totalSections - 1 ? (
                        <Link href="/gut-health-mini-diploma/lesson-2" style={{ display: 'block', padding: '18px 24px', background: '#722F37', color: 'white', borderRadius: 10, fontSize: 16, fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>
                            Continue to Lesson 2 →
                        </Link>
                    ) : (
                        <button onClick={handleContinue} style={{ width: '100%', padding: '18px 24px', background: '#722F37', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>{getButtonText()}</button>
                    )}
                </div>

                {/* Section Progress */}
                <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #e8e8e8' }}>
                    <h3 style={{ fontSize: 13, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>Lesson Progress</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {sections.filter(s => s.type === 'content').map((section) => {
                            const isCompleted = completedSections.includes(section.id);
                            const isCurrent = currentSection === section.id || (currentSectionData.type === 'quickcheck' && sections[currentSection - 1]?.id === section.id);
                            return (
                                <div key={section.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, background: isCurrent ? '#f8f4f0' : 'transparent' }}>
                                    <span style={{ width: 22, height: 22, borderRadius: '50%', background: isCompleted ? '#722F37' : isCurrent ? '#722F37' : 'transparent', border: isCompleted || isCurrent ? 'none' : '2px solid #ddd', color: isCompleted || isCurrent ? 'white' : '#bbb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{isCompleted ? '✓' : isCurrent ? '●' : '○'}</span>
                                    <span style={{ fontSize: 15, color: isCurrent ? '#722F37' : isCompleted ? '#333' : '#999', fontWeight: isCurrent ? 600 : 400 }}>{section.title}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>

            {/* Floating Action Buttons */}
            <div style={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column', gap: 12, zIndex: 100 }}>
                {/* Notes Button */}
                <button onClick={() => { setShowNotes(!showNotes); setShowAskCoach(false); }} style={{
                    width: 56, height: 56, borderRadius: '50%', background: showNotes ? '#722F37' : 'white', color: showNotes ? 'white' : '#722F37',
                    border: '2px solid #722F37', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>📝</button>
                {/* Ask Coach Button */}
                <button onClick={() => { setShowAskCoach(!showAskCoach); setShowNotes(false); }} style={{
                    width: 56, height: 56, borderRadius: '50%', background: showAskCoach ? '#722F37' : 'white', color: showAskCoach ? 'white' : '#722F37',
                    border: '2px solid #722F37', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', cursor: 'pointer', fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>💬</button>
            </div>

            {/* Notes Panel */}
            {showNotes && (
                <div style={{ position: 'fixed', bottom: 100, right: 24, width: 320, background: 'white', border: '1px solid #e8e8e8', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 100, overflow: 'hidden' }}>
                    <div style={{ padding: 16, background: '#722F37', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600 }}>📝 Your Notes</span>
                        <button onClick={() => setShowNotes(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: 18 }}>×</button>
                    </div>
                    <div style={{ padding: 16 }}>
                        <textarea
                            value={notes}
                            onChange={(e) => handleNotesChange(e.target.value)}
                            placeholder="Take notes as you learn..."
                            style={{ width: '100%', height: 200, border: '1px solid #e8e8e8', borderRadius: 8, padding: 12, fontSize: 15, fontFamily: 'inherit', resize: 'none' }}
                        />
                        <div style={{ fontSize: 12, color: '#888', marginTop: 8 }}>Notes save automatically</div>
                    </div>
                </div>
            )}

            {/* Ask Coach Panel */}
            {showAskCoach && (
                <div style={{ position: 'fixed', bottom: 100, right: 24, width: 320, background: 'white', border: '1px solid #e8e8e8', borderRadius: 16, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', zIndex: 100, overflow: 'hidden' }}>
                    <div style={{ padding: 16, background: '#722F37', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600 }}>💬 Ask Your Coach</span>
                        <button onClick={() => setShowAskCoach(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: 18 }}>×</button>
                    </div>
                    <div style={{ padding: 16 }}>
                        {questionSent ? (
                            <div style={{ textAlign: 'center', padding: 20 }}>
                                <div style={{ fontSize: 32, marginBottom: 12 }}>✅</div>
                                <div style={{ fontWeight: 600, color: '#065F46' }}>Question Sent!</div>
                                <div style={{ fontSize: 14, color: '#888', marginTop: 8 }}>Sarah will reply in your private chat</div>
                            </div>
                        ) : (
                            <>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #722F37, #8B4049)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 600 }}>S</div>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: 15 }}>Sarah</div>
                                        <div style={{ fontSize: 12, color: '#888' }}>Your Personal Coach</div>
                                    </div>
                                </div>
                                <textarea
                                    value={coachQuestion}
                                    onChange={(e) => setCoachQuestion(e.target.value)}
                                    placeholder="What would you like to ask about this lesson?"
                                    style={{ width: '100%', height: 100, border: '1px solid #e8e8e8', borderRadius: 8, padding: 12, fontSize: 15, fontFamily: 'inherit', resize: 'none' }}
                                />
                                <button
                                    onClick={handleSendQuestion}
                                    disabled={!coachQuestion.trim()}
                                    style={{
                                        marginTop: 12, width: '100%', padding: '12px 16px', background: coachQuestion.trim() ? '#722F37' : '#ccc',
                                        color: 'white', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 600, cursor: coachQuestion.trim() ? 'pointer' : 'default',
                                    }}
                                >
                                    Send to Sarah →
                                </button>
                                <div style={{ fontSize: 12, color: '#888', marginTop: 8, textAlign: 'center' }}>
                                    Reply comes to your private chat
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
