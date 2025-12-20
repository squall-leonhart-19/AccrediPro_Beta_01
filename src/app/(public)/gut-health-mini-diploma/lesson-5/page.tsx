'use client';

import { useState } from 'react';
import Link from 'next/link';

// LESSON 5: Foods That Harm & Heal

export default function Lesson5Page() {
    const [currentSection, setCurrentSection] = useState(0);
    const [completedSections, setCompletedSections] = useState<number[]>([]);
    const [quickCheckAnswers, setQuickCheckAnswers] = useState<{ [key: number]: string | null }>({});
    const [showAnswers, setShowAnswers] = useState<number[]>([]);

    const lessonData = {
        module: 1,
        moduleTitle: 'Introduction to Gut Health',
        lessonNumber: 5,
        totalLessons: 9,
        title: 'Foods That Harm & Heal Your Gut',
        readTime: '6 min read',
    };

    const sections = [
        {
            id: 0,
            title: 'Foods That Damage the Gut',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        What to Avoid (or Minimize)
                    </h3>
                    <p>
                        Certain foods directly <strong style={{ color: '#722F37' }}>damage gut health</strong>—disrupting
                        the microbiome, increasing inflammation, and weakening the gut barrier. As a practitioner,
                        you will help clients identify and reduce these triggers.
                    </p>
                    <div style={{ margin: '24px 0' }}>
                        {[
                            { food: 'Refined Sugar', why: 'Feeds harmful bacteria and yeast, promotes inflammation', icon: '🍬' },
                            { food: 'Processed Foods', why: 'Contain additives that disrupt microbiome balance', icon: '🍟' },
                            { food: 'Industrial Seed Oils', why: 'Promote inflammation and oxidative stress', icon: '🛢️' },
                            { food: 'Artificial Sweeteners', why: 'Alter gut bacteria composition negatively', icon: '⚗️' },
                            { food: 'Alcohol', why: 'Damages gut lining and promotes permeability', icon: '🍷' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex', gap: 16, padding: 16, background: '#FEE2E2',
                                borderRadius: 8, marginBottom: 8,
                            }}>
                                <span style={{ fontSize: 24 }}>{item.icon}</span>
                                <div>
                                    <strong style={{ color: '#991B1B' }}>{item.food}</strong>
                                    <p style={{ margin: '4px 0 0', fontSize: 15, color: '#7F1D1D' }}>{item.why}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ),
        },
        {
            id: 1,
            title: 'Foods That Heal the Gut',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        What to Include Daily
                    </h3>
                    <p>
                        Just as some foods harm, others actively <strong style={{ color: '#722F37' }}>heal and
                            nourish</strong> the gut. These should form the foundation of a gut-healing protocol.
                    </p>
                    <div style={{ margin: '24px 0' }}>
                        {[
                            { food: 'Fermented Foods', why: 'Sauerkraut, kimchi, kefir—provide beneficial bacteria', icon: '🥬' },
                            { food: 'Bone Broth', why: 'Contains collagen and amino acids that heal gut lining', icon: '🍲' },
                            { food: 'Fiber-Rich Vegetables', why: 'Feed beneficial bacteria, produce short-chain fatty acids', icon: '🥦' },
                            { food: 'Omega-3 Rich Foods', why: 'Reduce inflammation, support gut barrier', icon: '🐟' },
                            { food: 'Polyphenol-Rich Foods', why: 'Berries, dark chocolate—promote beneficial bacteria', icon: '🫐' },
                        ].map((item, i) => (
                            <div key={i} style={{
                                display: 'flex', gap: 16, padding: 16, background: '#D1FAE5',
                                borderRadius: 8, marginBottom: 8,
                            }}>
                                <span style={{ fontSize: 24 }}>{item.icon}</span>
                                <div>
                                    <strong style={{ color: '#065F46' }}>{item.food}</strong>
                                    <p style={{ margin: '4px 0 0', fontSize: 15, color: '#047857' }}>{item.why}</p>
                                </div>
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
            question: 'Which of these foods HEALS the gut?',
            options: ['Refined sugar', 'Artificial sweeteners', 'Fermented foods', 'Industrial seed oils'],
            correct: 'Fermented foods',
            explanation: `Fermented foods like sauerkraut, kimchi, and kefir contain beneficial bacteria that help restore and maintain a healthy gut microbiome.`,
        },
        {
            id: 3,
            title: 'The Role of Fiber',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        Why Fiber is Essential
                    </h3>
                    <p>
                        Fiber is food for your gut bacteria. When beneficial bacteria digest fiber, they produce
                        <strong style={{ color: '#722F37' }}> short-chain fatty acids (SCFAs)</strong>—powerful
                        compounds that heal the gut lining and reduce inflammation.
                    </p>
                    <div style={{
                        background: 'linear-gradient(135deg, #fdfbf7 0%, #fff 100%)',
                        border: '2px solid #722F37',
                        borderRadius: 12,
                        padding: 24,
                        margin: '24px 0',
                    }}>
                        <div style={{ textAlign: 'center', marginBottom: 16 }}>
                            <div style={{ fontSize: 36, fontWeight: 'bold', color: '#722F37' }}>25-35g</div>
                            <div style={{ fontSize: 14, color: '#666' }}>Daily fiber recommendation</div>
                        </div>
                        <div style={{ fontSize: 14, color: '#888', textAlign: 'center' }}>
                            Most Americans get only 10-15g per day
                        </div>
                    </div>
                    <p>
                        Types of fiber that benefit the gut:
                    </p>
                    <ul>
                        <li><strong>Prebiotic fiber</strong> — found in garlic, onions, asparagus</li>
                        <li><strong>Resistant starch</strong> — found in cooked and cooled potatoes, green bananas</li>
                        <li><strong>Soluble fiber</strong> — found in oats, beans, apples</li>
                    </ul>
                </>
            ),
        },
        {
            id: 4,
            title: 'Individualized Approach',
            type: 'content',
            content: (
                <>
                    <h3 style={{ fontSize: 20, color: '#1a1a1a', marginBottom: 16, fontWeight: 600 }}>
                        One Size Does NOT Fit All
                    </h3>
                    <p>
                        Here is what makes gut health complicated: <strong style={{ color: '#722F37' }}>what heals
                            one person may harm another</strong>. This is where your skills as a practitioner become invaluable.
                    </p>
                    <div style={{
                        background: '#722F37',
                        color: 'white',
                        padding: 24,
                        borderRadius: 12,
                        margin: '24px 0',
                    }}>
                        <p style={{ margin: 0, fontWeight: 500, marginBottom: 16 }}>Common Individual Sensitivities:</p>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                            {[
                                { food: 'Gluten', note: 'Not just celiacs' },
                                { food: 'Dairy', note: 'Lactose or casein' },
                                { food: 'FODMAPs', note: 'Fermentable carbs' },
                                { food: 'Nightshades', note: 'Tomatoes, peppers' },
                                { food: 'Eggs', note: 'Common allergen' },
                                { food: 'Histamines', note: 'Aged foods, ferments' },
                            ].map((item, i) => (
                                <div key={i} style={{ background: 'rgba(255,255,255,0.1)', padding: 12, borderRadius: 6 }}>
                                    <div style={{ fontWeight: 600 }}>{item.food}</div>
                                    <div style={{ fontSize: 13, opacity: 0.8 }}>{item.note}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <p>
                        Elimination diets, symptom tracking, and sometimes testing help identify individual triggers.
                        You will learn these skills in advanced modules.
                    </p>
                </>
            ),
        },
        {
            id: 5,
            title: 'Quick Check',
            type: 'quickcheck',
            question: 'How much daily fiber do most Americans actually consume?',
            options: ['5-10g', '10-15g', '25-35g', '40-50g'],
            correct: '10-15g',
            explanation: `Most Americans consume only 10-15g of fiber daily, far below the recommended 25-35g needed for optimal gut health.`,
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
                            'Refined sugar, processed foods, and seed oils damage gut health',
                            'Fermented foods, bone broth, and fiber heal the gut',
                            'Fiber feeds beneficial bacteria and produces healing SCFAs',
                            'Individual sensitivities require personalized approaches',
                            'Most Americans are severely fiber-deficient',
                        ].map((item, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '12px 0', borderBottom: i < 4 ? '1px solid #f0f0f0' : 'none' }}>
                                <span style={{ color: '#722F37', fontWeight: 600, fontSize: 16 }}>✓</span>
                                <span style={{ lineHeight: 1.5 }}>{item}</span>
                            </div>
                        ))}
                    </div>
                    <div style={{ background: '#fdfbf7', padding: 24, borderRadius: 12, borderLeft: '4px solid #722F37', margin: '24px 0' }}>
                        <p style={{ margin: 0, fontSize: 16, color: '#722F37', fontStyle: 'italic' }}>
                            "Diet is the foundation of gut healing—but lifestyle factors matter too.
                            Next, we will explore stress, sleep, and movement."
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
                <div style={{ marginTop: 40 }}>{!canContinue ? (<p style={{ color: '#888', fontSize: 15, textAlign: 'center' }}>Answer the quick check to continue</p>) : isLastSection && completedSections.length === totalSections - 1 ? (<Link href="/gut-health-mini-diploma/lesson-6" style={{ display: 'block', padding: '18px 24px', background: '#722F37', color: 'white', borderRadius: 10, fontSize: 16, fontWeight: 600, textAlign: 'center', textDecoration: 'none' }}>Continue to Lesson 6 →</Link>) : (<button onClick={handleContinue} style={{ width: '100%', padding: '18px 24px', background: '#722F37', color: 'white', border: 'none', borderRadius: 10, fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>{getButtonText()}</button>)}</div>
                <div style={{ marginTop: 48, paddingTop: 32, borderTop: '1px solid #e8e8e8' }}><h3 style={{ fontSize: 13, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 16 }}>Lesson Progress</h3><div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>{sections.filter(s => s.type === 'content').map((section) => { const isCompleted = completedSections.includes(section.id); const isCurrent = currentSection === section.id || (currentSectionData.type === 'quickcheck' && sections[currentSection - 1]?.id === section.id); return (<div key={section.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 8, background: isCurrent ? '#f8f4f0' : 'transparent' }}><span style={{ width: 22, height: 22, borderRadius: '50%', background: isCompleted ? '#722F37' : isCurrent ? '#722F37' : 'transparent', border: isCompleted || isCurrent ? 'none' : '2px solid #ddd', color: isCompleted || isCurrent ? 'white' : '#bbb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, flexShrink: 0 }}>{isCompleted ? '✓' : isCurrent ? '●' : '○'}</span><span style={{ fontSize: 15, color: isCurrent ? '#722F37' : isCompleted ? '#333' : '#999', fontWeight: isCurrent ? 600 : 400 }}>{section.title}</span></div>); })}</div></div>
            </main>
        </div>
    );
}
