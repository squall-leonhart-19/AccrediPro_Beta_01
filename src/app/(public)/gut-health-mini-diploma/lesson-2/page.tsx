'use client';

import { useState } from 'react';
import Link from 'next/link';

// LESSON 2: The Microbiome

export default function Lesson2Page() {
    const [currentSection, setCurrentSection] = useState(0);
    const [completedSections, setCompletedSections] = useState<number[]>([]);
    const [quickCheckAnswers, setQuickCheckAnswers] = useState<{ [key: number]: string | null }>({});
    const [showAnswers, setShowAnswers] = useState<number[]>([]);

    const lessonData = {
        module: 1,
        moduleTitle: 'Introduction to Gut Health',
        lessonNumber: 2,
        totalLessons: 9,
        title: 'Understanding Your Microbiome',
        readTime: '6 min read',
    };

    const sections = [
        {
            id: 0,
            title: 'What is the Microbiome?',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        Your Inner Ecosystem
                    </h3>
                    <p>
                        Your gut is home to <strong style={{ color: '#722F37' }}>trillions of microorganisms</strong>—bacteria,
                        viruses, fungi, and other microscopic living things. Together, they form what we call the
                        <strong> microbiome</strong>.
                    </p>
                    <p>
                        Think of it as a bustling city inside you. When the city is thriving—with diverse,
                        balanced populations—you feel amazing. When it falls into chaos, symptoms appear.
                    </p>
                    <div style={{
                        background: '#f9f9f9',
                        borderLeft: '4px solid #722F37',
                        padding: '20px 24px',
                        borderRadius: '0 8px 8px 0',
                        margin: '24px 0',
                    }}>
                        <p style={{ margin: 0, fontWeight: 500, marginBottom: 12, color: '#1a1a1a' }}>
                            Key Facts About Your Microbiome:
                        </p>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                            <li><strong>100 trillion</strong> microorganisms in your gut</li>
                            <li><strong>1,000+ species</strong> of bacteria</li>
                            <li>Weighs approximately <strong>2-5 pounds</strong></li>
                            <li>Contains <strong>more DNA</strong> than your human cells</li>
                        </ul>
                    </div>
                </>
            ),
        },
        {
            id: 1,
            title: 'Good vs Bad Bacteria',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        The Balance That Matters
                    </h3>
                    <p>
                        Not all bacteria are created equal. Your microbiome contains both <strong style={{ color: '#722F37' }}>
                            beneficial bacteria</strong> (the good guys) and <strong>pathogenic bacteria</strong> (the troublemakers).
                    </p>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 16,
                        margin: '24px 0',
                    }}>
                        <div style={{
                            background: '#D1FAE5',
                            padding: 20,
                            borderRadius: 12,
                        }}>
                            <div style={{ fontSize: 18, fontWeight: 600, color: '#065F46', marginBottom: 8 }}>✓ Beneficial Bacteria</div>
                            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 15, color: '#065F46' }}>
                                <li>Produce vitamins</li>
                                <li>Support immunity</li>
                                <li>Help digestion</li>
                                <li>Protect gut lining</li>
                            </ul>
                        </div>
                        <div style={{
                            background: '#FEE2E2',
                            padding: 20,
                            borderRadius: 12,
                        }}>
                            <div style={{ fontSize: 18, fontWeight: 600, color: '#991B1B', marginBottom: 8 }}>✗ Pathogenic Bacteria</div>
                            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 15, color: '#991B1B' }}>
                                <li>Cause inflammation</li>
                                <li>Produce toxins</li>
                                <li>Damage gut lining</li>
                                <li>Steal nutrients</li>
                            </ul>
                        </div>
                    </div>
                    <p>
                        The goal isn't to eliminate all "bad" bacteria—that's impossible. The goal is to maintain
                        a <strong style={{ color: '#722F37' }}>healthy balance</strong> where beneficial bacteria
                        outnumber and outcompete the harmful ones.
                    </p>
                </>
            ),
        },
        {
            id: 2,
            title: 'Quick Check',
            type: 'quickcheck',
            question: 'Approximately how many microorganisms live in your gut?',
            options: ['1 million', '1 billion', '100 trillion', '1 quadrillion'],
            correct: '100 trillion',
            explanation: `Your gut contains approximately 100 trillion microorganisms—that's more than 10 times the number of human cells in your body!`,
        },
        {
            id: 3,
            title: 'What Damages the Microbiome',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        The Modern Assault on Gut Health
                    </h3>
                    <p>
                        Our ancestors had robust, diverse microbiomes. Modern life has changed that dramatically.
                        Understanding what <strong>damages</strong> the microbiome is crucial for helping clients restore it.
                    </p>
                    <div style={{
                        display: 'grid',
                        gap: 12,
                        margin: '24px 0',
                    }}>
                        {[
                            { title: 'Antibiotics', desc: 'Wipe out beneficial bacteria along with harmful ones', icon: '💊' },
                            { title: 'Processed Foods', desc: 'Lack fiber and nutrients that feed good bacteria', icon: '🍔' },
                            { title: 'Chronic Stress', desc: 'Alters gut motility and bacterial composition', icon: '😰' },
                            { title: 'Environmental Toxins', desc: 'Pesticides, chemicals disrupt microbial balance', icon: '☠️' },
                            { title: 'Poor Sleep', desc: 'Disrupts circadian rhythms of gut bacteria', icon: '😴' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                gap: 16,
                                padding: 16,
                                background: '#f9f9f9',
                                borderRadius: 8,
                            }}>
                                <span style={{ fontSize: 24 }}>{item.icon}</span>
                                <div>
                                    <strong style={{ color: '#1a1a1a' }}>{item.title}</strong>
                                    <p style={{ margin: '4px 0 0', fontSize: 15, color: '#555' }}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ),
        },
        {
            id: 4,
            title: 'Signs of Dysbiosis',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        How to Recognize Microbial Imbalance
                    </h3>
                    <p>
                        <strong style={{ color: '#722F37' }}>Dysbiosis</strong> is the term for microbial imbalance.
                        When your microbiome is out of balance, the symptoms can show up in surprising ways—not
                        just digestive issues.
                    </p>
                    <div style={{
                        background: '#722F37',
                        color: 'white',
                        padding: 24,
                        borderRadius: 12,
                        margin: '24px 0',
                    }}>
                        <p style={{ margin: 0, fontWeight: 500, marginBottom: 12 }}>Common Signs of Dysbiosis:</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            {[
                                'Bloating & gas',
                                'Brain fog',
                                'Fatigue',
                                'Skin issues',
                                'Sugar cravings',
                                'Mood swings',
                                'Poor immunity',
                                'Weight issues',
                            ].map((symptom, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ color: '#D4AF37' }}>•</span>
                                    <span style={{ fontSize: 15 }}>{symptom}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p>
                        As a practitioner, recognizing these patterns helps you guide clients toward
                        root-cause solutions rather than just symptom management.
                    </p>
                </>
            ),
        },
        {
            id: 5,
            title: 'Quick Check',
            type: 'quickcheck',
            question: 'Which of the following is NOT typically a sign of dysbiosis?',
            options: ['Brain fog', 'High energy levels', 'Sugar cravings', 'Skin issues'],
            correct: 'High energy levels',
            explanation: `High energy levels are a sign of a HEALTHY microbiome, not dysbiosis. Dysbiosis typically causes fatigue, not increased energy.`,
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
                            'Your microbiome contains 100 trillion microorganisms',
                            'Balance between good and bad bacteria is essential',
                            'Modern lifestyle factors damage the microbiome',
                            'Dysbiosis symptoms extend beyond digestion',
                            'Recognizing patterns helps guide root-cause solutions',
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
                            "A healthy microbiome is the foundation. In the next lesson, we'll explore how
                            the gut-brain axis connects your digestive system to mental and emotional health."
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
        <div style={{
            minHeight: '100vh',
            background: '#ffffff',
            fontFamily: 'Georgia, "Times New Roman", serif',
            color: '#2d2d2d',
        }}>
            <header style={{
                background: '#fff',
                borderBottom: '1px solid #e8e8e8',
                padding: '20px 24px',
                position: 'sticky',
                top: 0,
                zIndex: 100,
            }}>
                <div style={{ maxWidth: 640, margin: '0 auto' }}>
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>
                            Module {lessonData.module}: {lessonData.moduleTitle}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>
                                Lesson {lessonData.lessonNumber} of {lessonData.totalLessons}
                            </div>
                            <div style={{ fontSize: 13, color: '#888' }}>{lessonData.readTime}</div>
                        </div>
                    </div>
                    <div style={{ height: 12, background: '#f0f0f0', borderRadius: 6, overflow: 'hidden' }}>
                        <div style={{
                            height: '100%',
                            width: `${Math.max(progress, 3)}%`,
                            background: 'linear-gradient(90deg, #722F37, #8B4049)',
                            borderRadius: 6,
                            transition: 'width 0.4s ease',
                        }} />
                    </div>
                    <div style={{ fontSize: 13, color: '#666', marginTop: 8, textAlign: 'right', fontWeight: 500 }}>
                        {progress}% complete
                    </div>
                </div>
            </header>

            <main style={{ maxWidth: 640, margin: '0 auto', padding: '32px 24px 100px' }}>
                <h1 style={{ fontSize: 28, lineHeight: 1.3, color: '#1a1a1a', marginBottom: 32, fontWeight: 600 }}>
                    {lessonData.title}
                </h1>

                {currentSectionData.type === 'content' ? (
                    <div style={{ fontSize: 17, lineHeight: 1.9, color: '#333' }}>
                        <style jsx>{`
              div p { margin-bottom: 20px; }
              div ul { margin: 20px 0; padding-left: 24px; }
              div li { margin-bottom: 12px; line-height: 1.7; }
            `}</style>
                        {currentSectionData.content}
                    </div>
                ) : (
                    <div style={{ background: '#fdfbf7', border: '1px solid #e8e4e0', borderRadius: 16, padding: 28 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                            <span style={{ fontSize: 22 }}>💡</span>
                            <span style={{ fontSize: 14, fontWeight: 600, color: '#722F37', textTransform: 'uppercase', letterSpacing: 0.5 }}>Quick Check</span>
                        </div>
                        <p style={{ fontSize: 18, fontWeight: 500, marginBottom: 24, lineHeight: 1.5, color: '#1a1a1a' }}>
                            {currentSectionData.question}
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {currentSectionData.options?.map((option: string) => {
                                const isSelected = quickCheckAnswers[currentSectionData.id] === option;
                                const isCorrect = option === currentSectionData.correct;
                                const showResult = showAnswers.includes(currentSectionData.id);
                                return (
                                    <button
                                        key={option}
                                        onClick={() => !showResult && handleQuickCheck(currentSectionData.id, option)}
                                        disabled={showResult}
                                        style={{
                                            padding: '18px 20px',
                                            border: '2px solid',
                                            borderColor: showResult ? (isCorrect ? '#10B981' : isSelected ? '#EF4444' : '#e8e8e8') : (isSelected ? '#722F37' : '#e8e8e8'),
                                            background: showResult ? (isCorrect ? '#D1FAE5' : isSelected && !isCorrect ? '#FEE2E2' : '#fff') : (isSelected ? '#f8f4f0' : '#fff'),
                                            borderRadius: 10,
                                            cursor: showResult ? 'default' : 'pointer',
                                            textAlign: 'left',
                                            fontSize: 16,
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 14,
                                        }}
                                    >
                                        <span style={{
                                            width: 22, height: 22, borderRadius: '50%', border: '2px solid',
                                            borderColor: showResult ? (isCorrect ? '#10B981' : isSelected ? '#EF4444' : '#ccc') : (isSelected ? '#722F37' : '#ccc'),
                                            background: showResult && isCorrect ? '#10B981' : showResult && isSelected && !isCorrect ? '#EF4444' : isSelected && !showResult ? '#722F37' : 'transparent',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, flexShrink: 0,
                                        }}>
                                            {showResult && isCorrect && '✓'}
                                            {showResult && isSelected && !isCorrect && '✗'}
                                        </span>
                                        <span style={{ color: '#333' }}>{option}</span>
                                    </button>
                                );
                            })}
                        </div>
                        {quickCheckAnswers[currentSectionData.id] && !showAnswers.includes(currentSectionData.id) && (
                            <button onClick={() => handleCheckAnswer(currentSectionData.id)} style={{
                                marginTop: 24, padding: '16px 24px', background: '#722F37', color: 'white',
                                border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: 'pointer', width: '100%',
                            }}>Check Answer</button>
                        )}
                        {showAnswers.includes(currentSectionData.id) && (
                            <div style={{
                                marginTop: 24, padding: 20, borderRadius: 10,
                                background: quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? '#D1FAE5' : '#FEF3C7',
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                    <span style={{ fontSize: 18 }}>{quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? '✅' : '💡'}</span>
                                    <strong style={{ color: quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? '#065F46' : '#92400E' }}>
                                        {quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? 'Correct!' : 'Good try!'}
                                    </strong>
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
                        <Link href="/gut-health-mini-diploma/lesson-3" style={{
                            display: 'block', padding: '18px 24px', background: '#722F37', color: 'white',
                            borderRadius: 10, fontSize: 16, fontWeight: 600, textAlign: 'center', textDecoration: 'none',
                        }}>Continue to Lesson 3 →</Link>
                    ) : (
                        <button onClick={handleContinue} style={{
                            width: '100%', padding: '18px 24px', background: '#722F37', color: 'white',
                            border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: 'pointer',
                        }}>{getButtonText()}</button>
                    )}
                </div>

                <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #e8e8e8' }}>
                    <h3 style={{ fontSize: 13, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>
                        Lesson Progress
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {sections.filter(s => s.type === 'content').map((section) => {
                            const isCompleted = completedSections.includes(section.id);
                            const isCurrent = currentSection === section.id || (currentSectionData.type === 'quickcheck' && sections[currentSection - 1]?.id === section.id);
                            return (
                                <div key={section.id} style={{
                                    display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8,
                                    background: isCurrent ? '#f8f4f0' : 'transparent',
                                }}>
                                    <span style={{
                                        width: 22, height: 22, borderRadius: '50%',
                                        background: isCompleted ? '#722F37' : isCurrent ? '#722F37' : 'transparent',
                                        border: isCompleted || isCurrent ? 'none' : '2px solid #ddd',
                                        color: isCompleted || isCurrent ? 'white' : '#bbb',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0,
                                    }}>{isCompleted ? '✓' : isCurrent ? '●' : '○'}</span>
                                    <span style={{ fontSize: 15, color: isCurrent ? '#722F37' : isCompleted ? '#333' : '#999', fontWeight: isCurrent ? 600 : 400 }}>
                                        {section.title}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    );
}
