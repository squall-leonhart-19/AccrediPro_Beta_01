'use client';

import { useState } from 'react';
import Link from 'next/link';

// LESSON 6: Lifestyle Factors

export default function Lesson6Page() {
    const [currentSection, setCurrentSection] = useState(0);
    const [completedSections, setCompletedSections] = useState<number[]>([]);
    const [quickCheckAnswers, setQuickCheckAnswers] = useState<{ [key: number]: string | null }>({});
    const [showAnswers, setShowAnswers] = useState<number[]>([]);

    const lessonData = {
        module: 1,
        moduleTitle: 'Introduction to Gut Health',
        lessonNumber: 6,
        totalLessons: 9,
        title: 'Lifestyle Factors: Stress, Sleep & Movement',
        readTime: '6 min read',
    };

    const sections = [
        {
            id: 0,
            title: 'Stress & The Gut',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        How Stress Destroys Gut Health
                    </h3>
                    <p>
                        Chronic stress is one of the most <strong style={{ color: '#722F37' }}>underestimated gut disruptors</strong>.
                        When you are stressed, your body shifts into "fight or flight" mode—and digestion takes a back seat.
                    </p>
                    <div style={{
                        background: '#722F37',
                        color: 'white',
                        padding: 24,
                        borderRadius: 12,
                        margin: '24px 0',
                    }}>
                        <p style={{ margin: 0, fontWeight: 500, marginBottom: 16 }}>What Stress Does to Your Gut:</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {[
                                'Reduces blood flow to digestive organs',
                                'Slows stomach acid production',
                                'Alters gut bacteria composition',
                                'Increases intestinal permeability',
                                'Triggers inflammation',
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                    <span style={{ color: '#D4AF37' }}>•</span>
                                    <span style={{ fontSize: 15 }}>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p>
                        This is why clients often notice digestive symptoms worsen during stressful periods.
                        <strong style={{ color: '#722F37' }}> Stress management is gut healing</strong>.
                    </p>
                </>
            ),
        },
        {
            id: 1,
            title: 'Sleep & Gut Health',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        The Sleep-Gut Connection
                    </h3>
                    <p>
                        Your gut bacteria have their own <strong style={{ color: '#722F37' }}>circadian rhythms</strong>.
                        When your sleep is disrupted, so is your microbiome.
                    </p>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: 16,
                        margin: '24px 0',
                    }}>
                        <div style={{ background: '#D1FAE5', padding: 20, borderRadius: 12 }}>
                            <div style={{ fontSize: 18, fontWeight: 600, color: '#065F46', marginBottom: 8 }}>Good Sleep</div>
                            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 15, color: '#065F46' }}>
                                <li>Diverse microbiome</li>
                                <li>Gut repair overnight</li>
                                <li>Balanced hormones</li>
                                <li>Reduced inflammation</li>
                            </ul>
                        </div>
                        <div style={{ background: '#FEE2E2', padding: 20, borderRadius: 12 }}>
                            <div style={{ fontSize: 18, fontWeight: 600, color: '#991B1B', marginBottom: 8 }}>Poor Sleep</div>
                            <ul style={{ margin: 0, paddingLeft: 16, fontSize: 15, color: '#991B1B' }}>
                                <li>Reduced diversity</li>
                                <li>Increased permeability</li>
                                <li>Higher cortisol</li>
                                <li>More inflammation</li>
                            </ul>
                        </div>
                    </div>
                    <p>
                        Research shows that even <strong>two nights of poor sleep</strong> can measurably alter
                        gut bacteria composition.
                    </p>
                </>
            ),
        },
        {
            id: 2,
            title: 'Quick Check',
            type: 'quickcheck',
            question: 'What happens to digestion when you are chronically stressed?',
            options: ['It speeds up', 'It slows down', 'It stays the same', 'It improves'],
            correct: 'It slows down',
            explanation: `When stressed, your body enters "fight or flight" mode, diverting blood away from digestive organs and slowing digestion. This is why stress management is essential for gut health.`,
        },
        {
            id: 3,
            title: 'Movement & Exercise',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        Exercise Benefits Your Gut
                    </h3>
                    <p>
                        Regular physical activity <strong style={{ color: '#722F37' }}>increases microbiome diversity</strong>—
                        one of the key markers of gut health.
                    </p>
                    <div style={{
                        background: '#f9f9f9',
                        borderLeft: '4px solid #722F37',
                        padding: '20px 24px',
                        borderRadius: '0 8px 8px 0',
                        margin: '24px 0',
                    }}>
                        <p style={{ margin: 0, fontWeight: 500, marginBottom: 12, color: '#1a1a1a' }}>
                            How Exercise Helps Your Gut:
                        </p>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                            <li><strong>Increases beneficial bacteria</strong> diversity</li>
                            <li><strong>Stimulates gut motility</strong> — keeps things moving</li>
                            <li><strong>Reduces inflammation</strong> throughout the body</li>
                            <li><strong>Lowers stress hormones</strong> like cortisol</li>
                        </ul>
                    </div>
                    <p>
                        But more is not always better. <strong>Moderate, consistent exercise</strong> is ideal.
                        Overtraining can actually harm gut health by increasing stress and inflammation.
                    </p>
                </>
            ),
        },
        {
            id: 4,
            title: 'Practical Strategies',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        What to Recommend to Clients
                    </h3>
                    <p>
                        As a practitioner, you will help clients implement <strong style={{ color: '#722F37' }}>practical
                            lifestyle changes</strong>. Here are evidence-based recommendations:
                    </p>
                    <div style={{ margin: '24px 0' }}>
                        {[
                            { category: 'For Stress', tips: 'Deep breathing, meditation, nature walks, journaling' },
                            { category: 'For Sleep', tips: 'Consistent bedtime, dark room, no screens 1hr before' },
                            { category: 'For Movement', tips: 'Daily walking, yoga, strength training 2-3x/week' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                padding: 20,
                                background: '#f9f9f9',
                                borderRadius: 12,
                                marginBottom: 12,
                            }}>
                                <div style={{ fontWeight: 600, color: '#722F37', marginBottom: 8 }}>{item.category}</div>
                                <div style={{ fontSize: 15, color: '#555' }}>{item.tips}</div>
                            </div>
                        ))}
                    </div>
                    <p>
                        Small, consistent changes are more effective than dramatic overhauls. Help clients
                        start with <strong>one change at a time</strong>.
                    </p>
                </>
            ),
        },
        {
            id: 5,
            title: 'Quick Check',
            type: 'quickcheck',
            question: 'What type of exercise is BEST for gut health?',
            options: ['Intense daily training', 'Moderate consistent exercise', 'Only stretching', 'No exercise'],
            correct: 'Moderate consistent exercise',
            explanation: `Moderate, consistent exercise is ideal for gut health. Overtraining can actually harm the gut by increasing stress and inflammation.`,
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
                            'Chronic stress directly damages gut health',
                            'Poor sleep alters microbiome composition quickly',
                            'Moderate exercise increases beneficial bacteria',
                            'Small, consistent lifestyle changes work best',
                            'Addressing lifestyle is essential for gut healing',
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: i < 4 ? '1px solid #f0f0f0' : 'none' }}>
                                <span style={{ color: '#722F37', fontWeight: 600, fontSize: 16 }}>✓</span>
                                <span style={{ lineHeight: 1.5 }}>{item}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ background: '#fdfbf7', padding: 24, borderRadius: 12, borderLeft: '4px solid #722F37', margin: '24px 0' }}>
                        <p style={{ margin: 0, fontSize: 16, color: '#722F37', fontStyle: 'italic' }}>
                            "Diet and lifestyle form the foundation. Next, we will explore supplements
                            and protocols for deeper gut healing."
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
                <div style={{ marginTop: 40 }}>{!canContinue ? (<p style={{ color: '#888', fontSize: 15, textAlign: 'center' }}>Answer the quick check to continue</p>) : isLastSection && completedSections.length === totalSections - 1 ? (<Link href="/gut-health-mini-diploma/lesson-7" style={{ display: 'block', padding: '18px 24px', background: '#722F37', color: 'white', borderRadius: 10, fontSize: 16, fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>Continue to Lesson 7 →</Link>) : (<button onClick={handleContinue} style={{ width: '100%', padding: '18px 24px', background: '#722F37', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>{getButtonText()}</button>)}</div>
                <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #e8e8e8' }}><h3 style={{ fontSize: 13, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>Lesson Progress</h3><div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>{sections.filter(s => s.type === 'content').map((section) => { const isCompleted = completedSections.includes(section.id); const isCurrent = currentSection === section.id || (currentSectionData.type === 'quickcheck' && sections[currentSection - 1]?.id === section.id); return (<div key={section.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, background: isCurrent ? '#f8f4f0' : 'transparent' }}><span style={{ width: 22, height: 22, borderRadius: '50%', background: isCompleted ? '#722F37' : isCurrent ? '#722F37' : 'transparent', border: isCompleted || isCurrent ? 'none' : '2px solid #ddd', color: isCompleted || isCurrent ? 'white' : '#bbb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{isCompleted ? '✓' : isCurrent ? '●' : '○'}</span><span style={{ fontSize: 15, color: isCurrent ? '#722F37' : isCompleted ? '#333' : '#999', fontWeight: isCurrent ? 600 : 400 }}>{section.title}</span></div>); })}</div></div>
            </main>
        </div>
    );
}
