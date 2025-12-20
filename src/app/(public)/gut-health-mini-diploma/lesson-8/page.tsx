'use client';

import { useState } from 'react';
import Link from 'next/link';

// LESSON 8: Case Study - Maria

export default function Lesson8Page() {
    const [currentSection, setCurrentSection] = useState(0);
    const [completedSections, setCompletedSections] = useState<number[]>([]);
    const [quickCheckAnswers, setQuickCheckAnswers] = useState<{ [key: number]: string | null }>({});
    const [showAnswers, setShowAnswers] = useState<number[]>([]);

    const lessonData = {
        module: 1,
        moduleTitle: 'Introduction to Gut Health',
        lessonNumber: 8,
        totalLessons: 9,
        title: 'Case Study: Maria, 47',
        readTime: '6 min read',
    };

    const sections = [
        {
            id: 0,
            title: 'Meet Maria',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        A Real-World Example
                    </h3>
                    <div style={{
                        background: '#fdfbf7',
                        padding: 24,
                        borderRadius: 12,
                        border: '1px solid #e8e4e0',
                        margin: '0 0 24px',
                    }}>
                        <div style={{ display: 'flex', gap: 16 }}>
                            <div style={{
                                width: 64,
                                height: 64,
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #722F37, #8B4049)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: 24,
                                flexShrink: 0,
                            }}>M</div>
                            <div>
                                <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 4 }}>Maria, 47</div>
                                <div style={{ fontSize: 15, color: '#666' }}>Elementary School Teacher • California</div>
                            </div>
                        </div>
                    </div>
                    <p>
                        Maria came to her practitioner feeling <strong style={{ color: '#722F37' }}>exhausted and frustrated</strong>.
                        For years, she had been dealing with bloating after meals, brain fog that made teaching difficult,
                        and skin breakouts she thought she had outgrown.
                    </p>
                    <p>
                        Her doctor told her everything was "normal" and suggested she was "just stressed."
                    </p>
                </>
            ),
        },
        {
            id: 1,
            title: 'Maria\'s Symptoms',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        The Full Picture
                    </h3>
                    <p>
                        When her practitioner dug deeper, a clear pattern emerged:
                    </p>
                    <div style={{
                        display: 'grid',
                        gap: 12,
                        margin: '24px 0',
                    }}>
                        {[
                            { symptom: 'Bloating', detail: 'Within 30 minutes of eating, especially bread and dairy' },
                            { symptom: 'Brain fog', detail: 'Worst in the afternoon, affecting work performance' },
                            { symptom: 'Fatigue', detail: 'Despite sleeping 8 hours, always tired' },
                            { symptom: 'Skin issues', detail: 'Adult acne and occasional rashes' },
                            { symptom: 'Anxiety', detail: 'Developed in her early 40s, no prior history' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                gap: 16,
                                padding: 16,
                                background: '#f9f9f9',
                                borderRadius: 8,
                            }}>
                                <span style={{ color: '#722F37', fontWeight: 600 }}>•</span>
                                <div>
                                    <strong style={{ color: '#1a1a1a' }}>{item.symptom}</strong>
                                    <p style={{ margin: '4px 0 0', fontSize: 15, color: '#555' }}>{item.detail}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <p>
                        Do you recognize this pattern? <strong style={{ color: '#722F37' }}>These are classic signs of gut dysfunction</strong>—
                        symptoms that extend far beyond the digestive system.
                    </p>
                </>
            ),
        },
        {
            id: 2,
            title: 'Quick Check',
            type: 'quickcheck',
            question: 'Based on what you learned, Maria\'s anxiety could be related to...',
            options: ['Poor sleep only', 'The gut-brain connection', 'Too much exercise', 'Work stress only'],
            correct: 'The gut-brain connection',
            explanation: `Maria's anxiety could be related to the gut-brain connection. Remember, 95% of serotonin is made in the gut, and the vagus nerve connects gut and brain bidirectionally. Gut dysfunction often manifests as anxiety.`,
        },
        {
            id: 3,
            title: 'The Approach',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        The Practitioner's Plan
                    </h3>
                    <p>
                        Using the <strong style={{ color: '#722F37' }}>5R Protocol</strong> as a framework, Maria's
                        practitioner created a personalized plan:
                    </p>
                    <div style={{
                        background: '#722F37',
                        color: 'white',
                        padding: 24,
                        borderRadius: 12,
                        margin: '24px 0',
                    }}>
                        <p style={{ margin: 0, fontWeight: 500, marginBottom: 16 }}>Maria's 5R Plan:</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                            <div>
                                <div style={{ fontWeight: 600, color: '#D4AF37' }}>Remove</div>
                                <div style={{ fontSize: 15, opacity: 0.9 }}>Gluten, dairy, processed foods for 4 weeks</div>
                            </div>
                            <div>
                                <div style={{ fontWeight: 600, color: '#D4AF37' }}>Replace</div>
                                <div style={{ fontSize: 15, opacity: 0.9 }}>Added digestive enzymes with meals</div>
                            </div>
                            <div>
                                <div style={{ fontWeight: 600, color: '#D4AF37' }}>Reinoculate</div>
                                <div style={{ fontSize: 15, opacity: 0.9 }}>Quality probiotic + prebiotic foods daily</div>
                            </div>
                            <div>
                                <div style={{ fontWeight: 600, color: '#D4AF37' }}>Repair</div>
                                <div style={{ fontSize: 15, opacity: 0.9 }}>L-glutamine + bone broth protocol</div>
                            </div>
                            <div>
                                <div style={{ fontWeight: 600, color: '#D4AF37' }}>Rebalance</div>
                                <div style={{ fontSize: 15, opacity: 0.9 }}>Evening wind-down routine, morning walks</div>
                            </div>
                        </div>
                    </div>
                </>
            ),
        },
        {
            id: 4,
            title: 'The Results',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        Maria's Transformation
                    </h3>
                    <p>
                        Here is what happened over the next 12 weeks:
                    </p>
                    <div style={{ margin: '24px 0' }}>
                        {[
                            { week: 'Week 2', result: 'Bloating reduced by 50%, energy slightly improved' },
                            { week: 'Week 4', result: 'Brain fog lifting, sleeping better' },
                            { week: 'Week 8', result: 'Skin clearing, anxiety significantly reduced' },
                            { week: 'Week 12', result: 'Felt like a "completely different person"' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                gap: 16,
                                padding: 16,
                                background: '#D1FAE5',
                                borderRadius: 8,
                                marginBottom: 8,
                            }}>
                                <div style={{
                                    fontWeight: 600,
                                    color: '#065F46',
                                    minWidth: 60,
                                }}>{item.week}</div>
                                <div style={{ fontSize: 15, color: '#047857' }}>{item.result}</div>
                            </div>
                        ))}
                    </div>
                    <div style={{
                        background: '#fdfbf7',
                        padding: 24,
                        borderRadius: 12,
                        borderLeft: '4px solid #722F37',
                    }}>
                        <p style={{ margin: 0, fontSize: 16, fontStyle: 'italic', color: '#555' }}>
                            "I spent years thinking this was just aging, that I had to accept feeling this way.
                            I wish I had known about gut health sooner. It changed everything."
                        </p>
                        <p style={{ margin: '12px 0 0', fontWeight: 600, color: '#722F37' }}>— Maria</p>
                    </div>
                </>
            ),
        },
        {
            id: 5,
            title: 'Quick Check',
            type: 'quickcheck',
            question: 'What was the FIRST step in Maria\'s 5R Protocol?',
            options: ['Add probiotics', 'Remove trigger foods', 'Add supplements', 'Start exercise'],
            correct: 'Remove trigger foods',
            explanation: `The first "R" is Remove—eliminating triggers like problematic foods, infections, and toxins. Maria started by removing gluten, dairy, and processed foods for 4 weeks.`,
        },
        {
            id: 6,
            title: 'Key Takeaways',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        What Maria's Story Teaches Us
                    </h3>
                    <div style={{ margin: '20px 0' }}>
                        {[
                            'Gut symptoms often present beyond the digestive system',
                            'Conventional medicine may miss the gut connection',
                            'The 5R Protocol provides a structured approach',
                            'Results take time—expect 8-12 weeks minimum',
                            'Personalization is key to success',
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: i < 4 ? '1px solid #f0f0f0' : 'none' }}>
                                <span style={{ color: '#722F37', fontWeight: 600, fontSize: 16 }}>✓</span>
                                <span style={{ lineHeight: 1.5 }}>{item}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ background: '#fdfbf7', padding: 24, borderRadius: 12, borderLeft: '4px solid #722F37', margin: '24px 0' }}>
                        <p style={{ margin: 0, fontSize: 16, color: '#722F37', fontStyle: 'italic' }}>
                            "Maria's story is one of thousands. Imagine being the practitioner
                            who helps someone transform their life like this. That is what this certification prepares you for."
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
                <div style={{ marginTop: 40 }}>{!canContinue ? (<p style={{ color: '#888', fontSize: 15, textAlign: 'center' }}>Answer the quick check to continue</p>) : isLastSection && completedSections.length === totalSections - 1 ? (<Link href="/gut-health-mini-diploma/lesson-9" style={{ display: 'block', padding: '18px 24px', background: '#722F37', color: 'white', borderRadius: 10, fontSize: 16, fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>Continue to Final Lesson →</Link>) : (<button onClick={handleContinue} style={{ width: '100%', padding: '18px 24px', background: '#722F37', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>{getButtonText()}</button>)}</div>
                <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #e8e8e8' }}><h3 style={{ fontSize: 13, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>Lesson Progress</h3><div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>{sections.filter(s => s.type === 'content').map((section) => { const isCompleted = completedSections.includes(section.id); const isCurrent = currentSection === section.id || (currentSectionData.type === 'quickcheck' && sections[currentSection - 1]?.id === section.id); return (<div key={section.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, background: isCurrent ? '#f8f4f0' : 'transparent' }}><span style={{ width: 22, height: 22, borderRadius: '50%', background: isCompleted ? '#722F37' : isCurrent ? '#722F37' : 'transparent', border: isCompleted || isCurrent ? 'none' : '2px solid #ddd', color: isCompleted || isCurrent ? 'white' : '#bbb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{isCompleted ? '✓' : isCurrent ? '●' : '○'}</span><span style={{ fontSize: 15, color: isCurrent ? '#722F37' : isCompleted ? '#333' : '#999', fontWeight: isCurrent ? 600 : 400 }}>{section.title}</span></div>); })}</div></div>
            </main>
        </div>
    );
}
