'use client';

import { useState } from 'react';
import Link from 'next/link';

// STYLE 5: Clean White with Quiz Integration
// Reading content combined with inline quizzes for engagement

export default function Style5Page() {
    const [quizAnswers, setQuizAnswers] = useState<{ [key: number]: string }>({});
    const [showExplanations, setShowExplanations] = useState<number[]>([]);

    const quizzes = [
        {
            id: 1,
            question: 'How many Americans suffer from digestive issues?',
            options: ['10 Million', '35 Million', '70 Million', '100 Million'],
            correct: '70 Million',
            explanation: 'Over 70 million Americans—more than California and Texas combined—suffer from gut issues.',
        },
        {
            id: 2,
            question: 'What percentage of serotonin is made in your gut?',
            options: ['50%', '75%', '85%', '95%'],
            correct: '95%',
            explanation: '95% of serotonin is produced in your gut, directly affecting your mood and mental health!',
        },
        {
            id: 3,
            question: 'How much can certified gut health practitioners earn monthly?',
            options: ['$1K-$2K', '$2K-$4K', '$5K-$15K', '$20K-$30K'],
            correct: '$5K-$15K',
            explanation: 'Our certified practitioners typically earn $5K-$15K/month working from home!',
        },
    ];

    const handleAnswer = (quizId: number, answer: string) => {
        setQuizAnswers({ ...quizAnswers, [quizId]: answer });
        if (!showExplanations.includes(quizId)) {
            setShowExplanations([...showExplanations, quizId]);
        }
    };

    const correctCount = quizzes.filter(q => quizAnswers[q.id] === q.correct).length;
    const answeredCount = Object.keys(quizAnswers).length;
    const progress = (answeredCount / quizzes.length) * 100;

    return (
        <div style={{
            minHeight: '100vh',
            background: '#ffffff',
            fontFamily: 'Georgia, "Times New Roman", serif',
            color: '#2d2d2d',
        }}>
            {/* Header */}
            <header style={{
                background: '#fff',
                borderBottom: '1px solid #e5e5e5',
                padding: '16px 24px',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <img src="/newlogo.webp" alt="AccrediPro" style={{ height: 36 }} />

                <div style={{ flex: 1, maxWidth: 400, margin: '0 24px' }}>
                    <div style={{
                        height: 8,
                        background: '#f0f0f0',
                        borderRadius: 4,
                        overflow: 'hidden',
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${progress}%`,
                            background: 'linear-gradient(90deg, #722F37, #8B4049)',
                            borderRadius: 4,
                            transition: 'width 0.5s ease',
                        }} />
                    </div>
                    <div style={{ fontSize: 12, color: '#888', marginTop: 4, textAlign: 'center' }}>
                        {answeredCount} of {quizzes.length} knowledge checks completed
                    </div>
                </div>

                <Link href="/gut-health-mini-diploma/style-1" style={{
                    padding: '10px 20px',
                    background: '#722F37',
                    color: 'white',
                    borderRadius: 6,
                    textDecoration: 'none',
                    fontSize: 14,
                }}>
                    ← Back to Style 1
                </Link>
            </header>

            {/* Main Content */}
            <main style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px' }}>

                {/* Lesson Title */}
                <div style={{ marginBottom: 40 }}>
                    <span style={{
                        display: 'inline-block',
                        background: '#f8f4f0',
                        color: '#722F37',
                        padding: '6px 16px',
                        borderRadius: 20,
                        fontSize: 13,
                        fontWeight: 600,
                        marginBottom: 16,
                    }}>
                        MODULE 1 • LESSON 1
                    </span>
                    <h1 style={{ fontSize: 36, lineHeight: 1.3, marginBottom: 16, color: '#1a1a1a' }}>
                        Welcome to Your Gut Health Journey
                    </h1>
                </div>

                {/* Coach Welcome */}
                <div style={{
                    display: 'flex',
                    gap: 16,
                    padding: 24,
                    background: '#fdfbf7',
                    borderLeft: '4px solid #722F37',
                    borderRadius: '0 12px 12px 0',
                    marginBottom: 40,
                }}>
                    <div style={{
                        width: 56,
                        height: 56,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #722F37, #8B4049)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontSize: 24,
                        flexShrink: 0,
                    }}>S</div>
                    <div>
                        <p style={{ fontSize: 16, lineHeight: 1.7, margin: 0 }}>
                            <strong style={{ color: '#722F37' }}>Hey there! 👋</strong> I'm Sarah, and I'm SO excited
                            you're here. Let's learn some key facts about gut health together—with quick knowledge
                            checks to make sure you're absorbing everything!
                        </p>
                    </div>
                </div>

                {/* Content Section 1 */}
                <section style={{ marginBottom: 40 }}>
                    <h2 style={{ fontSize: 24, marginBottom: 16, color: '#1a1a1a' }}>
                        The Gut Health Crisis
                    </h2>
                    <p style={{ fontSize: 17, lineHeight: 1.8, marginBottom: 16 }}>
                        Here's a reality that might surprise you: A massive number of Americans are silently
                        suffering from digestive issues. Many have been told their symptoms are "normal" or
                        even "all in their head."
                    </p>
                    <p style={{ fontSize: 17, lineHeight: 1.8, marginBottom: 24 }}>
                        This creates a tremendous opportunity for educated practitioners who understand
                        the gut and can actually help people find solutions.
                    </p>

                    {/* Quiz 1 */}
                    <div style={{
                        background: '#f9f9f9',
                        border: '1px solid #e8e8e8',
                        borderRadius: 12,
                        padding: 24,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <span style={{
                                background: '#722F37',
                                color: 'white',
                                padding: '4px 10px',
                                borderRadius: 4,
                                fontSize: 12,
                                fontWeight: 'bold',
                            }}>KNOWLEDGE CHECK</span>
                        </div>
                        <p style={{ fontSize: 17, fontWeight: 600, marginBottom: 16 }}>
                            {quizzes[0].question}
                        </p>
                        <div style={{ display: 'grid', gap: 8 }}>
                            {quizzes[0].options.map((option) => {
                                const isSelected = quizAnswers[1] === option;
                                const isCorrect = option === quizzes[0].correct;
                                const showResult = showExplanations.includes(1);

                                return (
                                    <button
                                        key={option}
                                        onClick={() => !showResult && handleAnswer(1, option)}
                                        disabled={showResult}
                                        style={{
                                            padding: '14px 20px',
                                            border: '2px solid',
                                            borderColor: showResult
                                                ? isCorrect ? '#10B981' : isSelected ? '#EF4444' : '#e8e8e8'
                                                : isSelected ? '#722F37' : '#e8e8e8',
                                            background: showResult
                                                ? isCorrect ? '#D1FAE5' : isSelected ? '#FEE2E2' : '#fff'
                                                : isSelected ? '#f8f4f0' : '#fff',
                                            borderRadius: 8,
                                            cursor: showResult ? 'default' : 'pointer',
                                            textAlign: 'left',
                                            fontSize: 16,
                                        }}
                                    >
                                        {option}
                                        {showResult && isCorrect && <span style={{ float: 'right', color: '#10B981' }}>✓</span>}
                                        {showResult && isSelected && !isCorrect && <span style={{ float: 'right', color: '#EF4444' }}>✗</span>}
                                    </button>
                                );
                            })}
                        </div>
                        {showExplanations.includes(1) && (
                            <div style={{
                                marginTop: 16,
                                padding: 16,
                                background: quizAnswers[1] === quizzes[0].correct ? '#D1FAE5' : '#FEF3C7',
                                borderRadius: 8,
                            }}>
                                <strong>{quizAnswers[1] === quizzes[0].correct ? '✓ Correct!' : '💡 Good try!'}</strong>
                                <p style={{ margin: '8px 0 0', fontSize: 15 }}>{quizzes[0].explanation}</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Content Section 2 */}
                <section style={{ marginBottom: 40 }}>
                    <h2 style={{ fontSize: 24, marginBottom: 16, color: '#1a1a1a' }}>
                        Your "Second Brain"
                    </h2>
                    <p style={{ fontSize: 17, lineHeight: 1.8, marginBottom: 16 }}>
                        Scientists call the gut the "second brain" for good reason. Your gut contains over
                        500 million neurons and has its own nervous system. But here's what really blew my
                        mind when I first learned about gut health...
                    </p>
                    <div style={{
                        background: '#722F37',
                        color: 'white',
                        padding: 24,
                        borderRadius: 12,
                        marginBottom: 24,
                    }}>
                        <p style={{ margin: 0, fontSize: 16, lineHeight: 1.7 }}>
                            💡 <strong>Key Insight:</strong> Your gut doesn't just affect digestion—it
                            affects your mood, energy, immunity, and mental clarity.
                        </p>
                    </div>

                    {/* Quiz 2 */}
                    <div style={{
                        background: '#f9f9f9',
                        border: '1px solid #e8e8e8',
                        borderRadius: 12,
                        padding: 24,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <span style={{
                                background: '#722F37',
                                color: 'white',
                                padding: '4px 10px',
                                borderRadius: 4,
                                fontSize: 12,
                                fontWeight: 'bold',
                            }}>KNOWLEDGE CHECK</span>
                        </div>
                        <p style={{ fontSize: 17, fontWeight: 600, marginBottom: 16 }}>
                            {quizzes[1].question}
                        </p>
                        <div style={{ display: 'grid', gap: 8 }}>
                            {quizzes[1].options.map((option) => {
                                const isSelected = quizAnswers[2] === option;
                                const isCorrect = option === quizzes[1].correct;
                                const showResult = showExplanations.includes(2);

                                return (
                                    <button
                                        key={option}
                                        onClick={() => !showResult && handleAnswer(2, option)}
                                        disabled={showResult}
                                        style={{
                                            padding: '14px 20px',
                                            border: '2px solid',
                                            borderColor: showResult
                                                ? isCorrect ? '#10B981' : isSelected ? '#EF4444' : '#e8e8e8'
                                                : isSelected ? '#722F37' : '#e8e8e8',
                                            background: showResult
                                                ? isCorrect ? '#D1FAE5' : isSelected ? '#FEE2E2' : '#fff'
                                                : isSelected ? '#f8f4f0' : '#fff',
                                            borderRadius: 8,
                                            cursor: showResult ? 'default' : 'pointer',
                                            textAlign: 'left',
                                            fontSize: 16,
                                        }}
                                    >
                                        {option}
                                        {showResult && isCorrect && <span style={{ float: 'right', color: '#10B981' }}>✓</span>}
                                        {showResult && isSelected && !isCorrect && <span style={{ float: 'right', color: '#EF4444' }}>✗</span>}
                                    </button>
                                );
                            })}
                        </div>
                        {showExplanations.includes(2) && (
                            <div style={{
                                marginTop: 16,
                                padding: 16,
                                background: quizAnswers[2] === quizzes[1].correct ? '#D1FAE5' : '#FEF3C7',
                                borderRadius: 8,
                            }}>
                                <strong>{quizAnswers[2] === quizzes[1].correct ? '✓ Correct!' : '💡 Good try!'}</strong>
                                <p style={{ margin: '8px 0 0', fontSize: 15 }}>{quizzes[1].explanation}</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Content Section 3 */}
                <section style={{ marginBottom: 40 }}>
                    <h2 style={{ fontSize: 24, marginBottom: 16, color: '#1a1a1a' }}>
                        The Practitioner Opportunity
                    </h2>
                    <p style={{ fontSize: 17, lineHeight: 1.8, marginBottom: 16 }}>
                        You don't need a medical degree to make a profound difference. What you DO need
                        is the right training—and that's exactly what this certification provides.
                    </p>
                    <p style={{ fontSize: 17, lineHeight: 1.8, marginBottom: 24 }}>
                        Our certified practitioners work from home with flexible hours, doing work they
                        love while earning a great income.
                    </p>

                    {/* Quiz 3 */}
                    <div style={{
                        background: '#f9f9f9',
                        border: '1px solid #e8e8e8',
                        borderRadius: 12,
                        padding: 24,
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                            <span style={{
                                background: '#722F37',
                                color: 'white',
                                padding: '4px 10px',
                                borderRadius: 4,
                                fontSize: 12,
                                fontWeight: 'bold',
                            }}>KNOWLEDGE CHECK</span>
                        </div>
                        <p style={{ fontSize: 17, fontWeight: 600, marginBottom: 16 }}>
                            {quizzes[2].question}
                        </p>
                        <div style={{ display: 'grid', gap: 8 }}>
                            {quizzes[2].options.map((option) => {
                                const isSelected = quizAnswers[3] === option;
                                const isCorrect = option === quizzes[2].correct;
                                const showResult = showExplanations.includes(3);

                                return (
                                    <button
                                        key={option}
                                        onClick={() => !showResult && handleAnswer(3, option)}
                                        disabled={showResult}
                                        style={{
                                            padding: '14px 20px',
                                            border: '2px solid',
                                            borderColor: showResult
                                                ? isCorrect ? '#10B981' : isSelected ? '#EF4444' : '#e8e8e8'
                                                : isSelected ? '#722F37' : '#e8e8e8',
                                            background: showResult
                                                ? isCorrect ? '#D1FAE5' : isSelected ? '#FEE2E2' : '#fff'
                                                : isSelected ? '#f8f4f0' : '#fff',
                                            borderRadius: 8,
                                            cursor: showResult ? 'default' : 'pointer',
                                            textAlign: 'left',
                                            fontSize: 16,
                                        }}
                                    >
                                        {option}
                                        {showResult && isCorrect && <span style={{ float: 'right', color: '#10B981' }}>✓</span>}
                                        {showResult && isSelected && !isCorrect && <span style={{ float: 'right', color: '#EF4444' }}>✗</span>}
                                    </button>
                                );
                            })}
                        </div>
                        {showExplanations.includes(3) && (
                            <div style={{
                                marginTop: 16,
                                padding: 16,
                                background: quizAnswers[3] === quizzes[2].correct ? '#D1FAE5' : '#FEF3C7',
                                borderRadius: 8,
                            }}>
                                <strong>{quizAnswers[3] === quizzes[2].correct ? '✓ Correct!' : '💡 Good try!'}</strong>
                                <p style={{ margin: '8px 0 0', fontSize: 15 }}>{quizzes[2].explanation}</p>
                            </div>
                        )}
                    </div>
                </section>

                {/* Results */}
                {answeredCount === quizzes.length && (
                    <div style={{
                        textAlign: 'center',
                        padding: 40,
                        background: '#fdfbf7',
                        borderRadius: 16,
                        border: '2px solid #722F37',
                    }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🎉</div>
                        <h2 style={{ marginBottom: 8, color: '#1a1a1a' }}>Lesson Complete!</h2>
                        <p style={{ fontSize: 18, color: '#666', marginBottom: 24 }}>
                            You scored <strong style={{ color: '#722F37' }}>{correctCount}</strong> out of {quizzes.length}
                        </p>
                        <Link href="/gut-health-mini-diploma/style-1" style={{
                            display: 'inline-block',
                            padding: '16px 40px',
                            background: '#722F37',
                            color: 'white',
                            borderRadius: 8,
                            textDecoration: 'none',
                            fontSize: 17,
                            fontWeight: 600,
                        }}>
                            Continue to Next Lesson →
                        </Link>
                    </div>
                )}
            </main>
        </div>
    );
}
