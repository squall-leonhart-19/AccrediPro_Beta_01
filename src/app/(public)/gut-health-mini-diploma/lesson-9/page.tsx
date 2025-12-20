'use client';

import { useState } from 'react';
import Link from 'next/link';

// LESSON 9: Your Next Steps

export default function Lesson9Page() {
    const [currentSection, setCurrentSection] = useState(0);
    const [completedSections, setCompletedSections] = useState<number[]>([]);
    const [quickCheckAnswers, setQuickCheckAnswers] = useState<{ [key: number]: string | null }>({});
    const [showAnswers, setShowAnswers] = useState<number[]>([]);
    const [moduleComplete, setModuleComplete] = useState(false);

    const lessonData = {
        module: 1,
        moduleTitle: 'Introduction to Gut Health',
        lessonNumber: 9,
        totalLessons: 9,
        title: 'Your Next Steps & Action Plan',
        readTime: '5 min read',
    };

    const sections = [
        {
            id: 0,
            title: 'Module Recap',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        Look How Far You Have Come
                    </h3>
                    <p>
                        Congratulations! You have completed <strong style={{ color: '#722F37' }}>Module 1</strong> of
                        the Gut Health Mini-Diploma. Let us recap what you have learned:
                    </p>
                    <div style={{ margin: '24px 0' }}>
                        {[
                            { lesson: 'Lesson 1', topic: 'The gut health opportunity and your journey ahead' },
                            { lesson: 'Lesson 2', topic: 'The microbiome: 100 trillion organisms in your gut' },
                            { lesson: 'Lesson 3', topic: 'The gut-brain connection and the vagus nerve' },
                            { lesson: 'Lesson 4', topic: 'How 70-80% of immunity lives in your gut' },
                            { lesson: 'Lesson 5', topic: 'Foods that harm and heal the gut' },
                            { lesson: 'Lesson 6', topic: 'Stress, sleep, and movement for gut health' },
                            { lesson: 'Lesson 7', topic: 'The 5R Protocol and key supplements' },
                            { lesson: 'Lesson 8', topic: 'Maria case study—putting it all together' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: '12px 0',
                                borderBottom: i < 7 ? '1px solid #f0f0f0' : 'none',
                            }}>
                                <span style={{
                                    color: '#722F37',
                                    fontWeight: 600,
                                    fontSize: 16,
                                }}>✓</span>
                                <span style={{ lineHeight: 1.5 }}><strong>{item.lesson}:</strong> {item.topic}</span>
                            </div>
                        ))}
                    </div>
                </>
            ),
        },
        {
            id: 1,
            title: 'Your First Action Step',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        Apply What You Learned TODAY
                    </h3>
                    <p>
                        Knowledge without action is just entertainment. Here is your <strong style={{ color: '#722F37' }}>
                            first action step</strong>:
                    </p>
                    <div style={{
                        background: 'linear-gradient(135deg, #722F37 0%, #8B4049 100%)',
                        color: 'white',
                        padding: 32,
                        borderRadius: 16,
                        margin: '24px 0',
                        textAlign: 'center',
                    }}>
                        <div style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: 1, opacity: 0.8, marginBottom: 12 }}>
                            Your Action Step
                        </div>
                        <div style={{ fontSize: 22, fontWeight: 600, lineHeight: 1.4 }}>
                            For the next 7 days, keep a simple journal noting what you eat and how you feel 2 hours later.
                        </div>
                        <div style={{ fontSize: 15, marginTop: 16, opacity: 0.9 }}>
                            This builds awareness of your personal gut-food connection.
                        </div>
                    </div>
                    <p>
                        This simple practice is how many practitioners—and clients—first start to see the
                        <strong> patterns</strong> that have been hidden in plain sight.
                    </p>
                </>
            ),
        },
        {
            id: 2,
            title: 'Quick Check',
            type: 'quickcheck',
            question: 'What is the recommended daily fiber intake for optimal gut health?',
            options: ['5-10g', '10-15g', '25-35g', '50-60g'],
            correct: '25-35g',
            explanation: `25-35g of fiber daily is recommended for optimal gut health. Most Americans only get 10-15g. This was covered in Lesson 5—great job remembering!`,
        },
        {
            id: 3,
            title: 'The Practitioner Path',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        Where Do You Go From Here?
                    </h3>
                    <p>
                        This mini-diploma gave you the <strong style={{ color: '#722F37' }}>foundation</strong>. But
                        to truly help clients transform their health, you need the complete training.
                    </p>
                    <div style={{
                        background: '#fdfbf7',
                        border: '2px solid #722F37',
                        borderRadius: 16,
                        padding: 24,
                        margin: '24px 0',
                    }}>
                        <div style={{ fontWeight: 600, color: '#722F37', marginBottom: 16, fontSize: 18 }}>
                            The Full Certification Includes:
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {[
                                'Advanced gut testing interpretation',
                                'Client intake and assessment protocols',
                                'Supplement selection and dosing',
                                'Condition-specific protocols (IBS, SIBO, Candida)',
                                'Business building for practitioners',
                                'Ongoing support and community',
                            ].map((item, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ color: '#722F37', fontWeight: 600 }}>→</span>
                                    <span style={{ fontSize: 15 }}>{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p>
                        When you are ready to take the next step, the full certification is waiting for you.
                    </p>
                </>
            ),
        },
        {
            id: 4,
            title: 'Your Certificate',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        Claim Your Mini-Diploma
                    </h3>
                    <p>
                        You have earned it! Complete this lesson to receive your <strong style={{ color: '#722F37' }}>
                            Gut Health Foundation Mini-Diploma</strong>.
                    </p>
                    <div style={{
                        background: '#f9f9f9',
                        border: '2px dashed #722F37',
                        borderRadius: 12,
                        padding: 32,
                        textAlign: 'center',
                        margin: '24px 0',
                    }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🎓</div>
                        <div style={{ fontSize: 18, fontWeight: 600, color: '#722F37', marginBottom: 8 }}>
                            Gut Health Foundation
                        </div>
                        <div style={{ fontSize: 14, color: '#666' }}>
                            Mini-Diploma Certificate
                        </div>
                        <div style={{ fontSize: 13, color: '#888', marginTop: 16 }}>
                            Available upon lesson completion
                        </div>
                    </div>
                    <p>
                        Share your achievement on LinkedIn, add it to your credentials, and take the first
                        step toward becoming a certified Gut Health Practitioner.
                    </p>
                </>
            ),
        },
        {
            id: 5,
            title: 'Quick Check',
            type: 'quickcheck',
            question: 'What is the first "R" in the 5R Protocol?',
            options: ['Repair', 'Reinoculate', 'Replace', 'Remove'],
            correct: 'Remove',
            explanation: `Remove is the first step—eliminating triggers like problematic foods, infections, toxins, and stressors before rebuilding the gut.`,
        },
        {
            id: 6,
            title: 'Congratulations!',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        You Did It!
                    </h3>
                    <div style={{
                        background: 'linear-gradient(135deg, #722F37 0%, #8B4049 100%)',
                        color: 'white',
                        padding: 32,
                        borderRadius: 16,
                        textAlign: 'center',
                        margin: '24px 0',
                    }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                        <div style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>
                            Module 1 Complete!
                        </div>
                        <div style={{ fontSize: 16, opacity: 0.9 }}>
                            You now understand the foundations of gut health
                        </div>
                    </div>
                    <div style={{
                        background: '#fdfbf7',
                        padding: 24,
                        borderRadius: 12,
                        borderLeft: '4px solid #722F37',
                        margin: '24px 0',
                    }}>
                        <p style={{ margin: 0, fontSize: 16, fontStyle: 'italic', color: '#555' }}>
                            "I am so proud of you for completing this foundation. You now know more about
                            gut health than 99% of people—including most healthcare providers.
                            Imagine what you could do with the full certification..."
                        </p>
                        <p style={{ margin: '12px 0 0', fontWeight: 600, color: '#722F37' }}>— Sarah</p>
                    </div>
                    <p style={{ textAlign: 'center', marginTop: 32 }}>
                        <strong style={{ color: '#722F37' }}>Ready to become a Certified Gut Health Practitioner?</strong>
                    </p>
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
        } else {
            setModuleComplete(true);
        }
    };

    const handleQuickCheck = (sectionId: number, answer: string) => { setQuickCheckAnswers({ ...quickCheckAnswers, [sectionId]: answer }); };
    const handleCheckAnswer = (sectionId: number) => { if (!showAnswers.includes(sectionId)) { setShowAnswers([...showAnswers, sectionId]); } };
    const currentSectionData = sections[currentSection];
    const isFirstSection = currentSection === 0 && completedSections.length === 0;
    const isLastSection = currentSection === totalSections - 1;
    const isQuickCheck = currentSectionData.type === 'quickcheck';
    const canContinue = isQuickCheck ? showAnswers.includes(currentSectionData.id) : true;
    const getButtonText = () => { if (isFirstSection) return 'Start Lesson →'; if (isLastSection) return 'Complete Module →'; return 'Continue →'; };

    if (moduleComplete) {
        return (
            <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: 'Georgia, "Times New Roman", serif', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
                <div style={{ maxWidth: 500, textAlign: 'center' }}>
                    <div style={{ fontSize: 64, marginBottom: 24 }}>🎓</div>
                    <h1 style={{ fontSize: 28, color: '#722F37', marginBottom: 16 }}>Congratulations!</h1>
                    <p style={{ fontSize: 18, color: '#555', marginBottom: 32, lineHeight: 1.6 }}>
                        You have completed the Gut Health Foundation Mini-Diploma. Your certificate is ready!
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                        <Link href="/portal/certificates" style={{
                            padding: '18px 32px',
                            background: '#722F37',
                            color: 'white',
                            borderRadius: 10,
                            fontSize: 16,
                            fontWeight: 600,
                            textDecoration: 'none',
                        }}>
                            View My Certificate →
                        </Link>
                        <Link href="/functional-medicine" style={{
                            padding: '18px 32px',
                            background: 'transparent',
                            color: '#722F37',
                            border: '2px solid #722F37',
                            borderRadius: 10,
                            fontSize: 16,
                            fontWeight: 600,
                            textDecoration: 'none',
                        }}>
                            Explore Full Certification
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: '#ffffff', fontFamily: 'Georgia, "Times New Roman", serif', color: '#2d2d2d' }}>
            <header style={{ background: '#fff', borderBottom: '1px solid #e8e8e8', padding: '20px 24px', position: 'sticky', top: 0, zIndex: 100 }}>
                <div style={{ maxWidth: 640, margin: '0 auto' }}>
                    <div style={{ marginBottom: 16 }}>
                        <div style={{ fontSize: 13, color: '#888', marginBottom: 4 }}>Module {lessonData.module}: {lessonData.moduleTitle}</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: 15, fontWeight: 600, color: '#1a1a1a' }}>Lesson {lessonData.lessonNumber} of {lessonData.totalLessons} (Final)</div>
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
                <div style={{ marginTop: 40 }}>{!canContinue ? (<p style={{ color: '#888', fontSize: 15, textAlign: 'center' }}>Answer the quick check to continue</p>) : (<button onClick={handleContinue} style={{ width: '100%', padding: '18px 24px', background: '#722F37', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>{getButtonText()}</button>)}</div>
                <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #e8e8e8' }}><h3 style={{ fontSize: 13, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>Lesson Progress</h3><div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>{sections.filter(s => s.type === 'content').map((section) => { const isCompleted = completedSections.includes(section.id); const isCurrent = currentSection === section.id || (currentSectionData.type === 'quickcheck' && sections[currentSection - 1]?.id === section.id); return (<div key={section.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, background: isCurrent ? '#f8f4f0' : 'transparent' }}><span style={{ width: 22, height: 22, borderRadius: '50%', background: isCompleted ? '#722F37' : isCurrent ? '#722F37' : 'transparent', border: isCompleted || isCurrent ? 'none' : '2px solid #ddd', color: isCompleted || isCurrent ? 'white' : '#bbb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{isCompleted ? '✓' : isCurrent ? '●' : '○'}</span><span style={{ fontSize: 15, color: isCurrent ? '#722F37' : isCompleted ? '#333' : '#999', fontWeight: isCurrent ? 600 : 400 }}>{section.title}</span></div>); })}</div></div>
            </main>
        </div>
    );
}
