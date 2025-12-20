'use client';

import { useState } from 'react';
import Link from 'next/link';

// STYLE 5: Quiz-First / Assessment Style
// Duolingo-inspired with interactive questions, celebrations, streaks

export default function Style5Page() {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [showResult, setShowResult] = useState(false);
    const [streak, setStreak] = useState(0);

    const questions = [
        {
            question: "How many Americans suffer from digestive issues?",
            options: ["10 Million", "35 Million", "70 Million", "100 Million"],
            correct: "70 Million",
            explanation: "Over 70 million Americans—more than California and Texas combined—struggle with gut issues daily.",
        },
        {
            question: "What percentage of serotonin (the 'happiness hormone') is made in your gut?",
            options: ["50%", "75%", "85%", "95%"],
            correct: "95%",
            explanation: "95% of your serotonin is produced in your gut—that's why gut health directly affects mood and mental health!",
        },
        {
            question: "What percentage of your immune system is located in your gut?",
            options: ["40%", "60%", "80%", "100%"],
            correct: "80%",
            explanation: "80% of your immune system lives in your gut. A healthy gut = a strong immune system!",
        },
        {
            question: "How much can certified gut health practitioners earn monthly?",
            options: ["$1K-$2K", "$2K-$4K", "$5K-$15K", "$20K-$30K"],
            correct: "$5K-$15K",
            explanation: "Our certified practitioners typically earn $5K-$15K/month working from home with flexible hours!",
        },
        {
            question: "Approximately how many neurons are in your gut?",
            options: ["1 Million", "100 Million", "500 Million", "1 Billion"],
            correct: "500 Million",
            explanation: "Your gut contains 500 million neurons—more than your spinal cord! That's why it's called the 'second brain.'",
        },
    ];

    const handleAnswer = (answer: string) => {
        setSelectedAnswer(answer);
        setTimeout(() => {
            if (answer === questions[currentQuestion].correct) {
                setScore(s => s + 1);
                setStreak(s => s + 1);
            } else {
                setStreak(0);
            }
            setShowResult(true);
        }, 300);
    };

    const nextQuestion = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(c => c + 1);
            setSelectedAnswer(null);
            setShowResult(false);
        }
    };

    const isComplete = currentQuestion === questions.length - 1 && showResult;
    const progress = ((currentQuestion + (showResult ? 1 : 0)) / questions.length) * 100;

    return (
        <div style={{
            minHeight: '100vh',
            background: '#111827',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            color: 'white',
        }}>
            {/* Header */}
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 24px',
                borderBottom: '1px solid #374151',
            }}>
                <Link href="/gut-health-mini-diploma/style-4" style={{
                    color: '#9CA3AF',
                    textDecoration: 'none',
                    fontSize: 24,
                }}>
                    ←
                </Link>
                <img src="/newlogo.webp" alt="AccrediPro" style={{ height: 32 }} />
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    color: '#F59E0B',
                }}>
                    <span style={{ fontSize: 20 }}>🔥</span>
                    <span style={{ fontWeight: 'bold' }}>{streak}</span>
                </div>
            </header>

            {/* Progress Bar */}
            <div style={{ padding: '16px 24px 0' }}>
                <div style={{
                    height: 8,
                    background: '#374151',
                    borderRadius: 4,
                    overflow: 'hidden',
                }}>
                    <div style={{
                        height: '100%',
                        width: `${progress}%`,
                        background: 'linear-gradient(90deg, #10B981, #34D399)',
                        borderRadius: 4,
                        transition: 'width 0.5s ease-out',
                    }} />
                </div>
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: 8,
                    fontSize: 14,
                    color: '#9CA3AF',
                }}>
                    <span>Question {currentQuestion + 1} of {questions.length}</span>
                    <span>Score: {score}/{questions.length}</span>
                </div>
            </div>

            {/* Main Content */}
            <main style={{
                maxWidth: 600,
                margin: '0 auto',
                padding: '40px 24px',
            }}>
                {!isComplete ? (
                    <>
                        {/* Question */}
                        <div style={{
                            background: '#1F2937',
                            borderRadius: 20,
                            padding: 32,
                            marginBottom: 24,
                            textAlign: 'center',
                        }}>
                            <div style={{ fontSize: 48, marginBottom: 16 }}>🤔</div>
                            <h2 style={{ fontSize: 24, lineHeight: 1.4 }}>
                                {questions[currentQuestion].question}
                            </h2>
                        </div>

                        {/* Options */}
                        <div style={{ display: 'grid', gap: 12 }}>
                            {questions[currentQuestion].options.map((option) => {
                                const isSelected = selectedAnswer === option;
                                const isCorrect = option === questions[currentQuestion].correct;
                                const showState = showResult && (isSelected || isCorrect);

                                return (
                                    <button
                                        key={option}
                                        onClick={() => !showResult && handleAnswer(option)}
                                        disabled={showResult}
                                        style={{
                                            padding: '20px 24px',
                                            fontSize: 18,
                                            fontWeight: 600,
                                            border: '3px solid',
                                            borderColor: showState
                                                ? isCorrect
                                                    ? '#10B981'
                                                    : isSelected
                                                        ? '#EF4444'
                                                        : '#374151'
                                                : isSelected
                                                    ? '#3B82F6'
                                                    : '#374151',
                                            background: showState
                                                ? isCorrect
                                                    ? '#10B98120'
                                                    : isSelected
                                                        ? '#EF444420'
                                                        : '#1F2937'
                                                : isSelected
                                                    ? '#3B82F620'
                                                    : '#1F2937',
                                            color: 'white',
                                            borderRadius: 16,
                                            cursor: showResult ? 'default' : 'pointer',
                                            transition: 'all 0.3s',
                                            textAlign: 'left',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                        }}
                                    >
                                        <span>{option}</span>
                                        {showState && (
                                            <span style={{ fontSize: 24 }}>
                                                {isCorrect ? '✓' : isSelected ? '✗' : ''}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Result & Explanation */}
                        {showResult && (
                            <div style={{
                                marginTop: 24,
                                padding: 24,
                                background: selectedAnswer === questions[currentQuestion].correct
                                    ? '#10B98120'
                                    : '#EF444420',
                                borderRadius: 16,
                                border: `2px solid ${selectedAnswer === questions[currentQuestion].correct
                                        ? '#10B981'
                                        : '#EF4444'
                                    }`,
                            }}>
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 12,
                                    marginBottom: 12,
                                }}>
                                    <span style={{ fontSize: 32 }}>
                                        {selectedAnswer === questions[currentQuestion].correct ? '🎉' : '💡'}
                                    </span>
                                    <span style={{
                                        fontSize: 20,
                                        fontWeight: 'bold',
                                        color: selectedAnswer === questions[currentQuestion].correct
                                            ? '#10B981'
                                            : '#EF4444',
                                    }}>
                                        {selectedAnswer === questions[currentQuestion].correct
                                            ? 'Correct!'
                                            : 'Not quite!'}
                                    </span>
                                </div>
                                <p style={{ color: '#D1D5DB', lineHeight: 1.6 }}>
                                    {questions[currentQuestion].explanation}
                                </p>
                                <button
                                    onClick={nextQuestion}
                                    style={{
                                        marginTop: 20,
                                        width: '100%',
                                        padding: '16px',
                                        background: '#10B981',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: 12,
                                        fontSize: 18,
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Continue →
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    /* Completion Screen */
                    <div style={{
                        textAlign: 'center',
                        padding: 32,
                    }}>
                        <div style={{
                            fontSize: 80,
                            marginBottom: 24,
                            animation: 'bounce 1s ease-in-out',
                        }}>
                            🏆
                        </div>
                        <h2 style={{ fontSize: 32, marginBottom: 16 }}>Lesson Complete!</h2>
                        <p style={{ fontSize: 20, color: '#9CA3AF', marginBottom: 32 }}>
                            You scored {score} out of {questions.length}
                        </p>

                        {/* Stats */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(3, 1fr)',
                            gap: 16,
                            marginBottom: 40,
                        }}>
                            <div style={{
                                background: '#1F2937',
                                padding: 20,
                                borderRadius: 16,
                            }}>
                                <div style={{ fontSize: 32, color: '#10B981' }}>{score}</div>
                                <div style={{ color: '#9CA3AF', fontSize: 14 }}>Correct</div>
                            </div>
                            <div style={{
                                background: '#1F2937',
                                padding: 20,
                                borderRadius: 16,
                            }}>
                                <div style={{ fontSize: 32, color: '#F59E0B' }}>{streak}</div>
                                <div style={{ color: '#9CA3AF', fontSize: 14 }}>Best Streak</div>
                            </div>
                            <div style={{
                                background: '#1F2937',
                                padding: 20,
                                borderRadius: 16,
                            }}>
                                <div style={{ fontSize: 32, color: '#3B82F6' }}>+50</div>
                                <div style={{ color: '#9CA3AF', fontSize: 14 }}>XP Earned</div>
                            </div>
                        </div>

                        <p style={{ color: '#9CA3AF', marginBottom: 24 }}>
                            You now understand the fundamentals of gut health!<br />
                            Ready to learn more?
                        </p>

                        <Link href="/gut-health-mini-diploma/lesson-2" style={{
                            display: 'inline-block',
                            padding: '18px 48px',
                            background: 'linear-gradient(90deg, #722F37, #8B4049)',
                            color: 'white',
                            borderRadius: 50,
                            textDecoration: 'none',
                            fontSize: 18,
                            fontWeight: 'bold',
                        }}>
                            Continue to Lesson 2 →
                        </Link>

                        <div style={{ marginTop: 24 }}>
                            <Link href="/gut-health-mini-diploma/style-1" style={{
                                color: '#9CA3AF',
                                textDecoration: 'underline',
                            }}>
                                ← Review all styles again
                            </Link>
                        </div>
                    </div>
                )}
            </main>

            <style jsx global>{`
        @keyframes bounce {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
      `}</style>
        </div>
    );
}
