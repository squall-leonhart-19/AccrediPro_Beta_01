'use client';

import { useState } from 'react';
import Link from 'next/link';

// LESSON 4: Gut & Immunity

export default function Lesson4Page() {
    const [currentSection, setCurrentSection] = useState(0);
    const [completedSections, setCompletedSections] = useState<number[]>([]);
    const [quickCheckAnswers, setQuickCheckAnswers] = useState<{ [key: number]: string | null }>({});
    const [showAnswers, setShowAnswers] = useState<number[]>([]);

    const lessonData = {
        module: 1,
        moduleTitle: 'Introduction to Gut Health',
        lessonNumber: 4,
        totalLessons: 9,
        title: 'Your Gut & Immune System',
        readTime: '5 min read',
    };

    const sections = [
        {
            id: 0,
            title: 'The Immune Headquarters',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        70-80% of Your Immune System Lives Here
                    </h3>
                    <p>
                        Most people are surprised to learn that the majority of their immune system is located
                        in their <strong style={{ color: '#722F37' }}>gut</strong>. The gut-associated lymphoid
                        tissue (GALT) is the largest immune organ in your body.
                    </p>
                    <div style={{
                        background: 'linear-gradient(135deg, #fdfbf7 0%, #fff 100%)',
                        border: '2px solid #722F37',
                        borderRadius: 12,
                        padding: 24,
                        textAlign: 'center',
                        margin: '24px 0',
                    }}>
                        <div style={{ fontSize: 48, fontWeight: 'bold', color: '#722F37' }}>70-80%</div>
                        <div style={{ fontSize: 16, color: '#666', marginTop: 8 }}>of your immune cells reside in your gut</div>
                    </div>
                    <p>
                        This makes perfect sense when you think about it—your gut is where the outside world
                        meets the inside of your body. Every bite of food, every sip of water, brings foreign
                        substances that must be evaluated.
                    </p>
                </>
            ),
        },
        {
            id: 1,
            title: 'The Gut Barrier',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        Your First Line of Defense
                    </h3>
                    <p>
                        The gut lining is just <strong>one cell thick</strong>—yet it must distinguish between
                        nutrients to absorb and threats to block. This delicate barrier is held together by
                        <strong style={{ color: '#722F37' }}> tight junctions</strong>.
                    </p>
                    <div style={{
                        background: '#f9f9f9',
                        borderLeft: '4px solid #722F37',
                        padding: '20px 24px',
                        borderRadius: '0 8px 8px 0',
                        margin: '24px 0',
                    }}>
                        <p style={{ margin: 0, fontWeight: 500, marginBottom: 12, color: '#1a1a1a' }}>
                            The Healthy Gut Barrier:
                        </p>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                            <li><strong>Selectively permeable</strong> — absorbs nutrients</li>
                            <li><strong>Blocks pathogens</strong> — keeps out harmful bacteria</li>
                            <li><strong>Communicates with immune cells</strong> — coordinates response</li>
                            <li><strong>Protected by mucus layer</strong> — first physical barrier</li>
                        </ul>
                    </div>
                    <p>
                        When this barrier is compromised, we call it <strong style={{ color: '#722F37' }}>"leaky gut"</strong>—and
                        it is implicated in a wide range of chronic health conditions.
                    </p>
                </>
            ),
        },
        {
            id: 2,
            title: 'Quick Check',
            type: 'quickcheck',
            question: 'What percentage of your immune system is located in your gut?',
            options: ['20-30%', '40-50%', '70-80%', '100%'],
            correct: '70-80%',
            explanation: `70-80% of your immune cells reside in your gut, making gut health directly connected to immune function.`,
        },
        {
            id: 3,
            title: 'Leaky Gut Explained',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        When the Barrier Breaks Down
                    </h3>
                    <p>
                        <strong style={{ color: '#722F37' }}>Intestinal permeability</strong> (leaky gut) occurs when
                        tight junctions become loose, allowing undigested food particles, bacteria, and toxins
                        to enter the bloodstream.
                    </p>
                    <div style={{
                        background: '#722F37',
                        color: 'white',
                        padding: 24,
                        borderRadius: 12,
                        margin: '24px 0',
                    }}>
                        <p style={{ margin: 0, fontWeight: 500, marginBottom: 16 }}>Leaky Gut Triggers:</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                            {[
                                'Chronic stress',
                                'Poor diet',
                                'Alcohol',
                                'NSAIDs',
                                'Infections',
                                'Toxins',
                                'Antibiotics',
                                'Gluten (in some)',
                            ].map((trigger, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ color: '#D4AF37' }}>•</span>
                                    <span style={{ fontSize: 15 }}>{trigger}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p>
                        When foreign substances enter the bloodstream, the immune system goes on high alert,
                        leading to <strong>chronic inflammation</strong>—the root of many modern diseases.
                    </p>
                </>
            ),
        },
        {
            id: 4,
            title: 'Autoimmunity Connection',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        The Autoimmune Link
                    </h3>
                    <p>
                        Research increasingly shows that <strong style={{ color: '#722F37' }}>leaky gut may be a precursor
                            to autoimmune disease</strong>. When the immune system is constantly triggered by gut-derived
                        antigens, it can begin attacking the body's own tissues.
                    </p>
                    <div style={{
                        display: 'grid',
                        gap: 12,
                        margin: '24px 0',
                    }}>
                        {[
                            { condition: 'Hashimoto's Thyroiditis', connection: 'Strong gut- thyroid link' },
              { condition: 'Rheumatoid Arthritis', connection: 'Gut bacteria influence joint inflammation' },
                            { condition: 'Type 1 Diabetes', connection: 'Gut permeability precedes onset' },
                            { condition: 'Multiple Sclerosis', connection: 'Microbiome differences observed' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: 16,
                                background: '#f9f9f9',
                                borderRadius: 8,
                            }}>
                                <strong style={{ color: '#1a1a1a' }}>{item.condition}</strong>
                                <span style={{ color: '#666', fontSize: 14 }}>{item.connection}</span>
                            </div>
                        ))}
                    </div>
                    <p>
                        As a practitioner, understanding this connection allows you to address the
                        <strong style={{ color: '#722F37' }}> root cause</strong> of immune dysfunction.
                    </p>
                </>
            ),
        },
        {
            id: 5,
            title: 'Quick Check',
            type: 'quickcheck',
            question: 'What is the medical term for "leaky gut"?',
            options: ['Gut dysbiosis', 'Intestinal permeability', 'Gastritis', 'Microbiome imbalance'],
            correct: 'Intestinal permeability',
            explanation: `"Leaky gut" is medically known as increased intestinal permeability—when the tight junctions between gut cells become loose.`,
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
                            '70-80% of your immune system lives in the gut',
                            'The gut barrier is just one cell thick but crucial',
                            'Leaky gut allows toxins into the bloodstream',
                            'Chronic inflammation results from barrier breakdown',
                            'Autoimmune conditions often have gut origins',
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0',
                                borderBottom: i < 4 ? '1px solid #f0f0f0' : 'none',
                            }}>
                                <span style={{ color: '#722F37', fontWeight: 600, fontSize: 16 }}>✓</span>
                                <span style={{ lineHeight: 1.5 }}>{item}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{
                        background: '#fdfbf7', padding: 24, borderRadius: 12,
                        borderLeft: '4px solid #722F37', margin: '24px 0',
                    }}>
                        <p style={{ margin: 0, fontSize: 16, color: '#722F37', fontStyle: 'italic' }}>
                            "Healing the gut barrier is often the first step in resolving chronic immune issues.
                            Next, we'll explore foods that harm and heal the gut."
                        </p>
                        <p style={{ margin: '12px 0 0', fontSize: 14, color: '#888' }}>— Sarah</p>
                    </div>
                </>
            ),
        },
    ];

    const totalSections = sections.length;
    const progress = Math.round(((completedSections.length) / totalSections) * 100);
    const handleContinue = () => { if (!completedSections.includes(currentSection)) { setCompletedSections([...completedSections, currentSection]); } if (currentSection < totalSections - 1) { setCurrentSection(currentSection + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); } };
    const handleQuickCheck = (sectionId: number, answer: string) => { setQuickCheckAnswers({ ...quickCheckAnswers, [sectionId]: answer }); };
    const handleCheckAnswer = (sectionId: number) => { if (!showAnswers.includes(sectionId)) { setShowAnswers([...showAnswers, sectionId]); } };
    const currentSectionData = sections[currentSection];
    const isFirstSection = currentSection === 0 && completedSections.length === 0;
    const isLastSection = currentSection === totalSections - 1;
    const isQuickCheck = currentSectionData.type === 'quickcheck';
    const canContinue = isQuickCheck ? showAnswers.includes(currentSectionData.id) : true;
    const getButtonText = () => { if (isFirstSection) return 'Start Lesson →'; if (isLastSection) return 'Complete Lesson →'; return 'Continue →'; };

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
                    <div style={{ fontSize: 17, lineHeight: 1.9, color: '#333' }}><style jsx>{`div p { margin-bottom: 20px; } div ul { margin: 20px 0; padding-left: 24px; } div li { margin-bottom: 12px; line-height: 1.7; }`}</style>{currentSectionData.content}</div>
                ) : (
                    <div style={{ background: '#fdfbf7', border: '1px solid #e8e4e0', borderRadius: 16, padding: 28 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}><span style={{ fontSize: 22 }}>💡</span><span style={{ fontSize: 14, fontWeight: 600, color: '#722F37', textTransform: 'uppercase', letterSpacing: 0.5 }}>Quick Check</span></div>
                        <p style={{ fontSize: 18, fontWeight: 500, marginBottom: 24, lineHeight: 1.5, color: '#1a1a1a' }}>{currentSectionData.question}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {currentSectionData.options?.map((option: string) => { const isSelected = quickCheckAnswers[currentSectionData.id] === option; const isCorrect = option === currentSectionData.correct; const showResult = showAnswers.includes(currentSectionData.id); return (<button key={option} onClick={() => !showResult && handleQuickCheck(currentSectionData.id, option)} disabled={showResult} style={{ padding: '18px 20px', border: '2px solid', borderColor: showResult ? (isCorrect ? '#10B981' : isSelected ? '#EF4444' : '#e8e8e8') : (isSelected ? '#722F37' : '#e8e8e8'), background: showResult ? (isCorrect ? '#D1FAE5' : isSelected && !isCorrect ? '#FEE2E2' : '#fff') : (isSelected ? '#f8f4f0' : '#fff'), borderRadius: 10, cursor: showResult ? 'default' : 'pointer', textAlign: 'left', fontSize: 16, display: 'flex', alignItems: 'center', gap: 14 }}><span style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid', borderColor: showResult ? (isCorrect ? '#10B981' : isSelected ? '#EF4444' : '#ccc') : (isSelected ? '#722F37' : '#ccc'), background: showResult && isCorrect ? '#10B981' : showResult && isSelected && !isCorrect ? '#EF4444' : isSelected && !showResult ? '#722F37' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, flexShrink: 0 }}>{showResult && isCorrect && '✓'}{showResult && isSelected && !isCorrect && '✗'}</span><span style={{ color: '#333' }}>{option}</span></button>); })}
                        </div>
                        {quickCheckAnswers[currentSectionData.id] && !showAnswers.includes(currentSectionData.id) && (<button onClick={() => handleCheckAnswer(currentSectionData.id)} style={{ marginTop: 24, padding: '16px 24px', background: '#722F37', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: 'pointer', width: '100%' }}>Check Answer</button>)}
                        {showAnswers.includes(currentSectionData.id) && (<div style={{ marginTop: 24, padding: 20, borderRadius: 10, background: quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? '#D1FAE5' : '#FEF3C7' }}><div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><span style={{ fontSize: 18 }}>{quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? '✅' : '💡'}</span><strong style={{ color: quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? '#065F46' : '#92400E' }}>{quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? 'Correct!' : 'Good try!'}</strong></div><p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: '#333' }}>{currentSectionData.explanation}</p></div>)}
                    </div>
                )}
                <div style={{ marginTop: 40 }}>
                    {!canContinue ? (<p style={{ color: '#888', fontSize: 15, textAlign: 'center' }}>Answer the quick check to continue</p>) : isLastSection && completedSections.length === totalSections - 1 ? (<Link href="/gut-health-mini-diploma/lesson-5" style={{ display: 'block', padding: '18px 24px', background: '#722F37', color: 'white', borderRadius: 10, fontSize: 16, fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>Continue to Lesson 5 →</Link>) : (<button onClick={handleContinue} style={{ width: '100%', padding: '18px 24px', background: '#722F37', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>{getButtonText()}</button>)}
                </div>
                <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #e8e8e8' }}>
                    <h3 style={{ fontSize: 13, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>Lesson Progress</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {sections.filter(s => s.type === 'content').map((section) => { const isCompleted = completedSections.includes(section.id); const isCurrent = currentSection === section.id || (currentSectionData.type === 'quickcheck' && sections[currentSection - 1]?.id === section.id); return (<div key={section.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, background: isCurrent ? '#f8f4f0' : 'transparent' }}><span style={{ width: 22, height: 22, borderRadius: '50%', background: isCompleted ? '#722F37' : isCurrent ? '#722F37' : 'transparent', border: isCompleted || isCurrent ? 'none' : '2px solid #ddd', color: isCompleted || isCurrent ? 'white' : '#bbb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{isCompleted ? '✓' : isCurrent ? '●' : '○'}</span><span style={{ fontSize: 15, color: isCurrent ? '#722F37' : isCompleted ? '#333' : '#999', fontWeight: isCurrent ? 600 : 400 }}>{section.title}</span></div>); })}
                    </div>
                </div>
            </main>
        </div>
    );
}
