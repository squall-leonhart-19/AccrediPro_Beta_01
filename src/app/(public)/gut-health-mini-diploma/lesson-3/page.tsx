'use client';

import { useState } from 'react';
import Link from 'next/link';

// LESSON 3: The Gut-Brain Connection

export default function Lesson3Page() {
    const [currentSection, setCurrentSection] = useState(0);
    const [completedSections, setCompletedSections] = useState<number[]>([]);
    const [quickCheckAnswers, setQuickCheckAnswers] = useState<{ [key: number]: string | null }>({});
    const [showAnswers, setShowAnswers] = useState<number[]>([]);

    const lessonData = {
        module: 1,
        moduleTitle: 'Introduction to Gut Health',
        lessonNumber: 3,
        totalLessons: 9,
        title: 'The Gut-Brain Connection',
        readTime: '6 min read',
    };

    const sections = [
        {
            id: 0,
            title: 'The Second Brain',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        Your Gut Has Its Own Nervous System
                    </h3>
                    <p>
                        Have you ever had a "gut feeling"? There is a reason we use that phrase. Your gut contains
                        its own <strong style={{ color: '#722F37' }}>nervous system</strong> called the
                        <strong> Enteric Nervous System (ENS)</strong>.
                    </p>
                    <div style={{
                        background: 'linear-gradient(135deg, #fdfbf7 0%, #fff 100%)',
                        border: '2px solid #722F37',
                        borderRadius: 12,
                        padding: 24,
                        textAlign: 'center',
                        margin: '24px 0',
                    }}>
                        <div style={{ fontSize: 42, fontWeight: 'bold', color: '#722F37' }}>500 Million</div>
                        <div style={{ fontSize: 16, color: '#666', marginTop: 8 }}>Neurons in Your Gut</div>
                        <div style={{ fontSize: 14, color: '#888', marginTop: 4 }}>More than your spinal cord</div>
                    </div>
                    <p>
                        This "second brain" can function <strong>independently</strong> from your central nervous system.
                        It controls digestion, produces neurotransmitters, and communicates constantly with your brain.
                    </p>
                </>
            ),
        },
        {
            id: 1,
            title: 'The Vagus Nerve Highway',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        The Communication Superhighway
                    </h3>
                    <p>
                        The <strong style={{ color: '#722F37' }}>vagus nerve</strong> is the longest cranial nerve in your body,
                        running from your brain stem all the way to your gut. Think of it as a two-way information highway.
                    </p>
                    <div style={{
                        background: '#f9f9f9',
                        borderLeft: '4px solid #722F37',
                        padding: '20px 24px',
                        borderRadius: '0 8px 8px 0',
                        margin: '24px 0',
                    }}>
                        <p style={{ margin: 0, fontWeight: 500, marginBottom: 12, color: '#1a1a1a' }}>
                            The Vagus Nerve Connection:
                        </p>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                            <li><strong>80% of signals</strong> travel FROM the gut TO the brain</li>
                            <li>Only 20% travel from brain to gut</li>
                            <li>Your gut is literally "talking" to your brain constantly</li>
                        </ul>
                    </div>
                    <p>
                        This is why gut issues so often manifest as <strong>anxiety, depression, and brain fog</strong>.
                        The communication is disrupted.
                    </p>
                </>
            ),
        },
        {
            id: 2,
            title: 'Quick Check',
            type: 'quickcheck',
            question: 'What percentage of vagus nerve signals travel FROM the gut TO the brain?',
            options: ['20%', '50%', '80%', '100%'],
            correct: '80%',
            explanation: `80% of vagus nerve signals travel from the gut to the brain, not the other way around. Your gut is constantly sending information to your brain about your internal state.`,
        },
        {
            id: 3,
            title: 'Serotonin: The Gut Connection',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        The Happiness Hormone Lives in Your Gut
                    </h3>
                    <p>
                        Here is what surprises most people: <strong style={{ color: '#722F37' }}>95% of your serotonin</strong> is
                        produced in your gut, not your brain.
                    </p>
                    <p>
                        Serotonin is the neurotransmitter responsible for:
                    </p>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 12,
                        margin: '24px 0',
                    }}>
                        {[
                            { icon: '😊', label: 'Mood regulation' },
                            { icon: '😴', label: 'Sleep quality' },
                            { icon: '🍽️', label: 'Appetite control' },
                            { icon: '🧠', label: 'Memory & learning' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                background: '#f9f9f9',
                                padding: 16,
                                borderRadius: 8,
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                            }}>
                                <span style={{ fontSize: 24 }}>{item.icon}</span>
                                <span style={{ fontSize: 15, fontWeight: 500 }}>{item.label}</span>
                            </div>
                        ))}
                    </div>
                    <p>
                        When gut bacteria are out of balance, serotonin production suffers. This is why
                        <strong style={{ color: '#722F37' }}> healing the gut can often improve mood disorders</strong>.
                    </p>
                </>
            ),
        },
        {
            id: 4,
            title: 'Stress & The Gut',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        The Two-Way Stress Response
                    </h3>
                    <p>
                        Stress affects your gut. But did you know your <strong>gut also affects your stress response</strong>?
                    </p>
                    <div style={{
                        background: '#722F37',
                        color: 'white',
                        padding: 24,
                        borderRadius: 12,
                        margin: '24px 0',
                    }}>
                        <p style={{ margin: 0, fontWeight: 500, marginBottom: 16 }}>The Stress-Gut Cycle:</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ background: '#D4AF37', color: '#722F37', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>1</span>
                                <span>Stress triggers cortisol release</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ background: '#D4AF37', color: '#722F37', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>2</span>
                                <span>Cortisol disrupts gut bacteria</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ background: '#D4AF37', color: '#722F37', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>3</span>
                                <span>Disrupted bacteria increase inflammation</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                <span style={{ background: '#D4AF37', color: '#722F37', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>4</span>
                                <span>Inflammation signals more stress to brain</span>
                            </div>
                        </div>
                    </div>
                    <p>
                        Breaking this cycle is key. As a practitioner, you will learn to address <strong>both</strong> the
                        gut and stress response simultaneously.
                    </p>
                </>
            ),
        },
        {
            id: 5,
            title: 'Quick Check',
            type: 'quickcheck',
            question: 'Where is 95% of your serotonin produced?',
            options: ['In the brain', 'In the liver', 'In the gut', 'In the heart'],
            correct: 'In the gut',
            explanation: `95% of serotonin is produced in the gut, which is why gut health has such a profound impact on mood and mental health.`,
        },
        {
            id: 6,
            title: 'Key Takeaways',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        What You Learned in This Lesson
                    </h3>
                    <div style={{ margin: '20px 0' }}>
                        {[
                            'Your gut has 500 million neurons (the "second brain")',
                            '80% of vagus nerve signals go from gut to brain',
                            '95% of serotonin is produced in the gut',
                            'Stress and gut health create a two-way cycle',
                            'Healing the gut often improves mental health',
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 12,
                                padding: '12px 0',
                                borderBottom: i < 4 ? '1px solid #f0f0f0' : 'none',
                            }}>
                                <span style={{ color: '#722F37', fontWeight: 600, fontSize: 16 }}>✓</span>
                                <span style={{ lineHeight: 1.5 }}>{item}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{
                        background: '#fdfbf7',
                        padding: 24,
                        borderRadius: 12,
                        borderLeft: '4px solid #722F37',
                        margin: '24px 0',
                    }}>
                        <p style={{ margin: 0, fontSize: 16, color: '#722F37', fontStyle: 'italic' }}>
                            "The gut-brain connection explains so much about chronic health issues.
                            Next, we will explore the immune system connection."
                        </p>
                        <p style={{ margin: '12px 0 0', fontSize: 14, color: '#888' }}>— Sarah</p>
                    </div>
                </>
            ),
        },
    ];

    const totalSections = sections.length;
    const progress = Math.round(((completedSections.length) / totalSections) * 100);

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
            <header style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '20px 24px', position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ maxWidth: 640, margin: '0 auto' }}>
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Module {lessonData.module}: {lessonData.moduleTitle}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>Lesson {lessonData.lessonNumber} of {lessonData.totalLessons}</div>
                            <div style={{ fontSize: 13, color: '#888' }}>{lessonData.readTime}</div>
                        </div>
                    </div>
                    <div style={{ height: 12, background: '#f0f0f0', borderRadius: 6, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${Math.max(progress, 3)}%`, background: 'linear-gradient(90deg, #722F37, #8B4049)', borderRadius: 6, transition: 'width 0.4s ease' }} />
                    </div>
                    <div style={{ fontSize: 13, color: '#666', marginTop: 8, textAlign: 'right', fontWeight: 500 }}>{progress}% complete</div>
                </div>
            </header>

            <main style={{ maxWidth: 640, margin: '0 auto', padding: '32px 24px 100px' }}>
                <h1 style={{ fontSize: 28, lineHeight: 1.3, color: '#1a1a1a', marginBottom: 32, fontWeight: 600 }}>{lessonData.title}</h1>

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
                                    <button key={option} onClick={() => !showResult && handleQuickCheck(currentSectionData.id, option)} disabled={showResult}
                                        style={{ padding: '18px 20px', border: '2px solid', borderColor: showResult ? (isCorrect ? '#10B981' : isSelected ? '#EF4444' : '#e8e8e8') : (isSelected ? '#722F37' : '#e8e8e8'), background: showResult ? (isCorrect ? '#D1FAE5' : isSelected && !isCorrect ? '#FEE2E2' : '#fff') : (isSelected ? '#f8f4f0' : '#fff'), borderRadius: 10, cursor: showResult ? 'default' : 'pointer', textAlign: 'left', fontSize: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
                                        <span style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid', borderColor: showResult ? (isCorrect ? '#10B981' : isSelected ? '#EF4444' : '#ccc') : (isSelected ? '#722F37' : '#ccc'), background: showResult && isCorrect ? '#10B981' : showResult && isSelected && !isCorrect ? '#EF4444' : isSelected && !showResult ? '#722F37' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, flexShrink: 0 }}>
                                            {showResult && isCorrect && '✓'}{showResult && isSelected && !isCorrect && '✗'}
                                        </span>
                                        <span style={{ color: '#333' }}>{option}</span>
                                    </button>
                                );
                            })}
                        </div>
                        {quickCheckAnswers[currentSectionData.id] && !showAnswers.includes(currentSectionData.id) && (
                            <button onClick={() => handleCheckAnswer(currentSectionData.id)} style={{ marginTop: 24, padding: '16px 24px', background: '#722F37', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: 'pointer', width: '100%' }}>Check Answer</button>
                        )}
                        {showAnswers.includes(currentSectionData.id) && (
                            <div style={{ marginTop: 24, padding: 20, borderRadius: 10, background: quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? '#D1FAE5' : '#FEF3C7' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                    <span style={{ fontSize: 18 }}>{quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? '✅' : '💡'}</span>
                                    <strong style={{ color: quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? '#065F46' : '#92400E' }}>{quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? 'Correct!' : 'Good try!'}</strong>
                                </div>
                                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: '#333' }}>{currentSectionData.explanation}</p>
                            </div>
                        )}
                    </div>
                )}

                <div style={{ marginTop: 40 }}>
                    {!canContinue ? (
                        <p style={{ color: '#888', fontSize: 15, textAlign: 'center' }}>Answer the quick check to continue</p>
                    ) : isLastSection && completedSections.length === totalSections - 1 ? (
                        <Link href="/gut-health-mini-diploma/lesson-4" style={{ display: 'block', padding: '18px 24px', background: '#722F37', color: 'white', borderRadius: 10, fontSize: 16, fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>Continue to Lesson 4 →</Link>
                    ) : (
                        <button onClick={handleContinue} style={{ width: '100%', padding: '18px 24px', background: '#722F37', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>{getButtonText()}</button>
                    )}
                </div>

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
        </div>
    );
}
