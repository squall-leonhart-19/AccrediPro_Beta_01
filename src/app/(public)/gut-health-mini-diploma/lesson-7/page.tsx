'use client';

import { useState } from 'react';
import Link from 'next/link';

// LESSON 7: Supplements & Protocols

export default function Lesson7Page() {
    const [currentSection, setCurrentSection] = useState(0);
    const [completedSections, setCompletedSections] = useState<number[]>([]);
    const [quickCheckAnswers, setQuickCheckAnswers] = useState<{ [key: number]: string | null }>({});
    const [showAnswers, setShowAnswers] = useState<number[]>([]);

    const lessonData = {
        module: 1,
        moduleTitle: 'Introduction to Gut Health',
        lessonNumber: 7,
        totalLessons: 9,
        title: 'Supplements & Healing Protocols',
        readTime: '7 min read',
    };

    const sections = [
        {
            id: 0,
            title: 'The Role of Supplements',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        Supplements: Support, Not Replace
                    </h3>
                    <p>
                        Supplements can <strong style={{ color: '#722F37' }}>accelerate gut healing</strong>—but they
                        should never replace a healthy diet and lifestyle. Think of them as the finishing touches,
                        not the foundation.
                    </p>
                    <div style={{
                        background: '#722F37',
                        color: 'white',
                        padding: 24,
                        borderRadius: 12,
                        margin: '24px 0',
                    }}>
                        <p style={{ margin: 0, fontWeight: 500, marginBottom: 12 }}>The Supplement Hierarchy:</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {[
                                '1. Fix the diet first (foundation)',
                                '2. Address lifestyle factors (stress, sleep)',
                                '3. Add targeted supplements (support)',
                                '4. Consider testing (advanced)',
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ color: '#D4AF37' }}>→</span>
                                    <span style={{ fontSize: 15 }}>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p>
                        Too many people skip to supplements without addressing the basics.
                        As a practitioner, you will guide clients through the <strong>proper sequence</strong>.
                    </p>
                </>
            ),
        },
        {
            id: 1,
            title: 'Key Gut-Healing Supplements',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        The Essential Gut Support Toolkit
                    </h3>
                    <p>
                        While there are hundreds of gut supplements on the market, these are the
                        <strong style={{ color: '#722F37' }}> core categories</strong> you will use most often:
                    </p>
                    <div style={{ margin: '24px 0' }}>
                        {[
                            { name: 'Probiotics', desc: 'Beneficial bacteria to reseed the gut', when: 'After antibiotics, with dysbiosis' },
                            { name: 'Prebiotics', desc: 'Fiber that feeds good bacteria', when: 'For ongoing microbiome support' },
                            { name: 'L-Glutamine', desc: 'Amino acid that repairs gut lining', when: 'For leaky gut, post-infection' },
                            { name: 'Digestive Enzymes', desc: 'Help break down food', when: 'For bloating, poor digestion' },
                            { name: 'Zinc Carnosine', desc: 'Heals stomach and intestinal lining', when: 'For gastritis, ulcers' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                padding: 20,
                                background: '#f9f9f9',
                                borderRadius: 12,
                                marginBottom: 12,
                            }}>
                                <div style={{ fontWeight: 600, color: '#722F37', marginBottom: 4 }}>{item.name}</div>
                                <div style={{ fontSize: 15, color: '#333', marginBottom: 8 }}>{item.desc}</div>
                                <div style={{ fontSize: 13, color: '#888' }}>Best for: {item.when}</div>
                            </div>
                        ))}
                    </div>
                </>
            ),
        },
        {
            id: 2,
            title: 'Quick Check',
            type: 'quickcheck',
            question: 'What is the FIRST step before recommending supplements?',
            options: ['Add probiotics', 'Fix the diet', 'Order testing', 'Add enzymes'],
            correct: 'Fix the diet',
            explanation: `Diet always comes first. Supplements should support a healthy diet and lifestyle, not replace them. This is fundamental to effective gut healing protocols.`,
        },
        {
            id: 3,
            title: 'The 5R Protocol',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        The Gold Standard for Gut Healing
                    </h3>
                    <p>
                        The <strong style={{ color: '#722F37' }}>5R Protocol</strong> is the most widely used framework
                        for comprehensive gut healing. You will learn this in depth in advanced modules.
                    </p>
                    <div style={{
                        display: 'grid',
                        gap: 12,
                        margin: '24px 0',
                    }}>
                        {[
                            { r: 'Remove', desc: 'Eliminate triggers: infections, allergens, toxins, stress' },
                            { r: 'Replace', desc: 'Add digestive support: enzymes, stomach acid, bile' },
                            { r: 'Reinoculate', desc: 'Restore bacteria: probiotics, prebiotics, fermented foods' },
                            { r: 'Repair', desc: 'Heal the lining: glutamine, zinc, collagen, aloe' },
                            { r: 'Rebalance', desc: 'Address lifestyle: stress, sleep, movement, mindset' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                gap: 16,
                                padding: 16,
                                background: '#f9f9f9',
                                borderRadius: 8,
                                borderLeft: '4px solid #722F37',
                            }}>
                                <span style={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '50%',
                                    background: '#722F37',
                                    color: 'white',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: 14,
                                    fontWeight: 600,
                                    flexShrink: 0,
                                }}>{i + 1}</span>
                                <div>
                                    <strong style={{ color: '#1a1a1a' }}>{item.r}</strong>
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
            title: 'Safety Considerations',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        Important Safety Notes
                    </h3>
                    <p>
                        As a practitioner, <strong style={{ color: '#722F37' }}>safety is paramount</strong>. Here are
                        key considerations when recommending supplements:
                    </p>
                    <div style={{
                        background: '#FEF3C7',
                        border: '1px solid #F59E0B',
                        borderRadius: 12,
                        padding: 20,
                        margin: '24px 0',
                    }}>
                        <div style={{ fontWeight: 600, color: '#92400E', marginBottom: 12 }}>⚠️ Important Reminders:</div>
                        <ul style={{ margin: 0, paddingLeft: 20, color: '#92400E' }}>
                            <li>Always check for medication interactions</li>
                            <li>Start with lower doses, increase gradually</li>
                            <li>Quality matters—recommend reputable brands</li>
                            <li>Some conditions require medical supervision</li>
                            <li>Know your scope of practice limitations</li>
                        </ul>
                    </div>
                    <p>
                        Never diagnose or treat medical conditions. Your role is to <strong>educate and support</strong>—
                        always refer to qualified healthcare providers when appropriate.
                    </p>
                </>
            ),
        },
        {
            id: 5,
            title: 'Quick Check',
            type: 'quickcheck',
            question: 'What does the "R" stand for in "Repair" (5R Protocol)?',
            options: ['Remove toxins', 'Replace enzymes', 'Heal the gut lining', 'Restore bacteria'],
            correct: 'Heal the gut lining',
            explanation: `"Repair" in the 5R Protocol refers to healing the gut lining using supplements like glutamine, zinc, collagen, and aloe vera.`,
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
                            'Supplements support, not replace, diet and lifestyle',
                            'Key supplements: probiotics, prebiotics, glutamine, enzymes',
                            'The 5R Protocol: Remove, Replace, Reinoculate, Repair, Rebalance',
                            'Safety and scope of practice are paramount',
                            'Quality and proper sequencing determine success',
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: i < 4 ? '1px solid #f0f0f0' : 'none' }}>
                                <span style={{ color: '#722F37', fontWeight: 600, fontSize: 16 }}>✓</span>
                                <span style={{ lineHeight: 1.5 }}>{item}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ background: '#fdfbf7', padding: 24, borderRadius: 12, borderLeft: '4px solid #722F37', margin: '24px 0' }}>
                        <p style={{ margin: 0, fontSize: 16, color: '#722F37', fontStyle: 'italic' }}>
                            "Protocols give you structure, but remember—every client is unique.
                            Next, we will look at a real case study to see these principles in action."
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
                    <div style={{ height: 12, background: '#f0f0f0', borderRadius: 6, overflow: 'hidden' }}><div style={{ height: '100%', width: `${Math.max(progress, 3)}%`, background: 'linear-gradient(90deg, #722F37, #8B4049)', borderRadius: 6, transition: 'width 0.4s ease' }} /></div>
                    <div style={{ fontSize: 13, color: '#666', marginTop: 8, textAlign: 'right', fontWeight: 500 }}>{progress}% complete</div>
                </div>
            </header>
            <main style={{ maxWidth: 640, margin: '0 auto', padding: '32px 24px 100px' }}>
                <h1 style={{ fontSize: 28, lineHeight: 1.3, color: '#1a1a1a', marginBottom: 32, fontWeight: 600 }}>{lessonData.title}</h1>
                {currentSectionData.type === 'content' ? (<div style={{ fontSize: 17, lineHeight: 1.9, color: '#333' }}><style jsx>{`div p { margin-bottom: 20px; } div ul { margin: 20px 0; padding-left: 24px; } div li { margin-bottom: 12px; line-height: 1.7; }`}</style>{currentSectionData.content}</div>) : (
                    <div style={{ background: '#fdfbf7', border: '1px solid #e8e4e0', borderRadius: 16, padding: 28 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}><span style={{ fontSize: 22 }}>💡</span><span style={{ fontSize: 14, fontWeight: 600, color: '#722F37', textTransform: 'uppercase', letterSpacing: 0.5 }}>Quick Check</span></div>
                        <p style={{ fontSize: 18, fontWeight: 500, marginBottom: 24, lineHeight: 1.5, color: '#1a1a1a' }}>{currentSectionData.question}</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{currentSectionData.options?.map((option: string) => { const isSelected = quickCheckAnswers[currentSectionData.id] === option; const isCorrect = option === currentSectionData.correct; const showResult = showAnswers.includes(currentSectionData.id); return (<button key={option} onClick={() => !showResult && handleQuickCheck(currentSectionData.id, option)} disabled={showResult} style={{ padding: '18px 20px', border: '2px solid', borderColor: showResult ? (isCorrect ? '#10B981' : isSelected ? '#EF4444' : '#e8e8e8') : (isSelected ? '#722F37' : '#e8e8e8'), background: showResult ? (isCorrect ? '#D1FAE5' : isSelected && !isCorrect ? '#FEE2E2' : '#fff') : (isSelected ? '#f8f4f0' : '#fff'), borderRadius: 10, cursor: showResult ? 'default' : 'pointer', textAlign: 'left', fontSize: 16, display: 'flex', alignItems: 'center', gap: 14 }}><span style={{ width: 22, height: 22, borderRadius: '50%', border: '2px solid', borderColor: showResult ? (isCorrect ? '#10B981' : isSelected ? '#EF4444' : '#ccc') : (isSelected ? '#722F37' : '#ccc'), background: showResult && isCorrect ? '#10B981' : showResult && isSelected && !isCorrect ? '#EF4444' : isSelected && !showResult ? '#722F37' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 12, flexShrink: 0 }}>{showResult && isCorrect && '✓'}{showResult && isSelected && !isCorrect && '✗'}</span><span style={{ color: '#333' }}>{option}</span></button>); })}</div>
                        {quickCheckAnswers[currentSectionData.id] && !showAnswers.includes(currentSectionData.id) && (<button onClick={() => handleCheckAnswer(currentSectionData.id)} style={{ marginTop: 24, padding: '16px 24px', background: '#722F37', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: 'pointer', width: '100%' }}>Check Answer</button>)}
                        {showAnswers.includes(currentSectionData.id) && (<div style={{ marginTop: 24, padding: 20, borderRadius: 10, background: quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? '#D1FAE5' : '#FEF3C7' }}><div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}><span style={{ fontSize: 18 }}>{quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? '✅' : '💡'}</span><strong style={{ color: quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? '#065F46' : '#92400E' }}>{quickCheckAnswers[currentSectionData.id] === currentSectionData.correct ? 'Correct!' : 'Good try!'}</strong></div><p style={{ margin: 0, fontSize: 15, lineHeight: 1.6, color: '#333' }}>{currentSectionData.explanation}</p></div>)}
                    </div>
                )}
                <div style={{ marginTop: 40 }}>{!canContinue ? (<p style={{ color: '#888', fontSize: 15, textAlign: 'center' }}>Answer the quick check to continue</p>) : isLastSection && completedSections.length === totalSections - 1 ? (<Link href="/gut-health-mini-diploma/lesson-8" style={{ display: 'block', padding: '18px 24px', background: '#722F37', color: 'white', borderRadius: 10, fontSize: 16, fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>Continue to Lesson 8 →</Link>) : (<button onClick={handleContinue} style={{ width: '100%', padding: '18px 24px', background: '#722F37', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>{getButtonText()}</button>)}</div>
                <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #e8e8e8' }}><h3 style={{ fontSize: 13, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>Lesson Progress</h3><div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>{sections.filter(s => s.type === 'content').map((section) => { const isCompleted = completedSections.includes(section.id); const isCurrent = currentSection === section.id || (currentSectionData.type === 'quickcheck' && sections[currentSection - 1]?.id === section.id); return (<div key={section.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, background: isCurrent ? '#f8f4f0' : 'transparent' }}><span style={{ width: 22, height: 22, borderRadius: '50%', background: isCompleted ? '#722F37' : isCurrent ? '#722F37' : 'transparent', border: isCompleted || isCurrent ? 'none' : '2px solid #ddd', color: isCompleted || isCurrent ? 'white' : '#bbb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{isCompleted ? '✓' : isCurrent ? '●' : '○'}</span><span style={{ fontSize: 15, color: isCurrent ? '#722F37' : isCompleted ? '#333' : '#999', fontWeight: isCurrent ? 600 : 400 }}>{section.title}</span></div>); })}</div></div>
            </main>
        </div>
    );
}
